const guards = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'content-security-policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; object-src 'none'; base-uri 'none'; form-action 'self'",
};
const headers = (type, extra) => ({ ...guards, 'content-type': type, ...extra });
const json = (value, status = 200) => new Response(JSON.stringify(value), {
  status, headers: headers('application/json; charset=utf-8', { 'cache-control': 'no-store' }),
});
const privateError = status => json({ error: status === 403 ? 'Forbidden' : 'Request failed' }, status);
const pageRoutes = new Map([['/', 'home'], ['/publications/', 'publications'], ['/studio/', 'studio']]);
const articleStatuses = new Set(['draft', 'published', 'preprint', 'working']);
const progressStatuses = new Set(['notStarted', 'working', 'review', 'done', 'skip']);
const skippable = new Set(['business', 'innovation', 'external', 'impact', 'research']);
const articleLimits = {
  enTitle: 280, ruTitle: 280, authors: 500, venue: 280, year: 4, url: 1000, doi: 180,
  enSummary: 1500, ruSummary: 1500, enBody: 32000, ruBody: 32000,
};

function identity(request, env) {
  const signedIn = Boolean(request.headers.get('oai-authenticated-user-id'));
  const email = request.headers.get('oai-authenticated-user-email')?.trim().toLowerCase();
  const ownerEmail = env.PORTFOLIO_OWNER_EMAIL?.trim().toLowerCase();
  return { signedIn, owner: Boolean(signedIn && email && ownerEmail && email === ownerEmail) };
}

function textField(value, limit) {
  if (value == null) return '';
  if (typeof value !== 'string' || value.length > limit) throw new Error('Invalid text');
  return value.trim();
}

async function readInput(request) {
  if (!/^application\/json(?:;|$)/i.test(request.headers.get('content-type') || '')) return null;
  if (Number(request.headers.get('content-length')) > 500000) return null;
  const input = await request.text();
  if (input.length > 450000) return null;
  try {
    const result = JSON.parse(input);
    return result && typeof result === 'object' && !Array.isArray(result) ? result : null;
  } catch { return null; }
}

async function saveArticle(db, body) {
  let record;
  try {
    const fields = Object.fromEntries(Object.entries(articleLimits).map(([key, limit]) => [key, textField(body[key], limit)]));
    if (!fields.enTitle && !fields.ruTitle) return privateError(422);
    if (fields.year && !/^\d{4}$/.test(fields.year)) return privateError(422);
    if (fields.url && !['https:', 'http:'].includes(new URL(fields.url).protocol)) return privateError(422);
    if (!articleStatuses.has(body.status)) return privateError(422);
    if (body.id != null && (typeof body.id !== 'string' || !/^[\da-f-]{36}$/.test(body.id))) return privateError(422);
    record = { id: body.id || crypto.randomUUID(), status: body.status, ...fields };
  } catch { return privateError(422); }

  await db.prepare(`INSERT INTO articles (id, status, data, updated_at) VALUES (?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET status = excluded.status, data = excluded.data, updated_at = excluded.updated_at`)
    .bind(record.id, record.status, JSON.stringify(record), new Date().toISOString()).run();
  return json(record);
}

async function saveChecklist(db, id, body) {
  if (!checklistIds.has(id)) return privateError(404);
  if (!progressStatuses.has(body.status) || (body.status === 'skip' && !skippable.has(id))) return privateError(422);
  if (!/^[0-5]$/.test(String(body.quality))) return privateError(422);
  let record;
  try {
    record = { id, status: body.status, quality: Number(body.quality), notes: textField(body.notes, 4000), next: textField(body.next, 1600) };
  } catch { return privateError(422); }
  await db.prepare('INSERT INTO checklist (id, data) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data')
    .bind(id, JSON.stringify(record)).run();
  return json(record);
}

async function api(request, env, url) {
  const path = url.pathname;
  const method = request.method;
  const session = identity(request, env);
  if (path === '/api/session' && method === 'GET') return json(session);
  if (path === '/api/publications' && method === 'GET') {
    const { results } = await env.DB.prepare("SELECT data FROM articles WHERE status IN ('published', 'preprint', 'working') ORDER BY updated_at DESC, id DESC").all();
    return json(results.map(row => JSON.parse(row.data)));
  }
  if (!path.startsWith('/api/studio/')) return privateError(404);
  if (!session.owner) return privateError(403);
  if (method === 'GET' && path === '/api/studio/articles') {
    const { results } = await env.DB.prepare('SELECT data FROM articles ORDER BY updated_at DESC, id DESC').all();
    return json(results.map(row => JSON.parse(row.data)));
  }
  if (method === 'GET' && path === '/api/studio/checklist') {
    const { results } = await env.DB.prepare('SELECT data FROM checklist ORDER BY id').all();
    return json(results.map(row => JSON.parse(row.data)));
  }
  if (method !== 'PUT') return privateError(405);
  const origin = request.headers.get('origin');
  if ((origin && origin !== url.origin) || request.headers.get('sec-fetch-site') === 'cross-site') return privateError(403);
  const body = await readInput(request);
  if (!body) return privateError(400);
  if (path === '/api/studio/articles') return saveArticle(env.DB, body);
  const match = path.match(/^\/api\/studio\/checklist\/([a-z]+)$/);
  if (match) return saveChecklist(env.DB, match[1], body);
  return privateError(404);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      try { return await api(request, env, url); }
      catch (error) {
        console.error('Portfolio request failed:', error instanceof Error ? error.message : 'unknown error');
        return privateError(503);
      }
    }
    if (!['GET', 'HEAD'].includes(request.method)) return privateError(405);
    if (url.pathname === '/publications' || url.pathname === '/studio') {
      url.pathname += '/';
      return Response.redirect(url, 308);
    }
    if (Object.hasOwn(assets, url.pathname)) {
      const asset = assets[url.pathname];
      const body = asset.binary ? Uint8Array.from(atob(asset.data), char => char.charCodeAt(0)) : asset.data;
      return new Response(request.method === 'HEAD' ? null : body, {
        headers: headers(asset.type, { 'cache-control': 'public, max-age=300' }),
      });
    }
    const page = pageRoutes.get(url.pathname);
    if (page) {
      const studio = page === 'studio';
      const meta = studio ? { 'x-robots-tag': 'noindex, nofollow' } : {};
      const html = shell.replace('{{PAGE}}', page);
      return new Response(request.method === 'HEAD' ? null : html, {
        headers: headers('text/html; charset=utf-8', { ...meta, 'cache-control': 'no-store' }),
      });
    }
    return new Response(request.method === 'HEAD' ? null : 'Page not found', { status: 404, headers: headers('text/plain; charset=utf-8') });
  },
};
