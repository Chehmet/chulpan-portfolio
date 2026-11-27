import assert from 'node:assert/strict';
import { localDatabase } from './local-db.mjs';
import worker from './dist/server/index.js';

const origin = 'https://portfolio.example';
const env = { DB: localDatabase(), PORTFOLIO_OWNER_EMAIL: 'owner@example.test' };
const owner = { 'oai-authenticated-user-id': 'owner-id', 'oai-authenticated-user-email': 'owner@example.test' };
const viewer = { 'oai-authenticated-user-id': 'viewer-id', 'oai-authenticated-user-email': 'viewer@example.test' };
const request = (path, headers, body) => worker.fetch(new Request(origin + path, {
  method: body ? 'PUT' : 'GET', headers: { 'content-type': 'application/json', ...headers },
  ...(body ? { body: JSON.stringify(body) } : {}),
}), env);

for (const path of ['/', '/?lang=ru', '/publications/', '/studio/?lang=ru&tab=visa', '/assets/contours.webp', '/assets/style.css', '/assets/app.js', '/assets/content.js', '/assets/studio.js']) {
  const response = await request(path);
  assert.equal(response.status, 200, path);
  assert((await response.arrayBuffer()).byteLength > 0, path);
}
const firstResponse = await request('/studio/?lang=ru');
assert.equal(firstResponse.headers.get('x-robots-tag'), 'noindex, nofollow');
assert.equal((await request('/fake')).status, 404);
assert.equal((await request('/publications')).status, 308);
for (const headers of [{}, viewer, { 'oai-authenticated-user-email': env.PORTFOLIO_OWNER_EMAIL }]) {
  assert.equal((await request('/api/studio/articles', headers)).status, 403);
  assert.equal((await request('/api/studio/checklist', headers)).status, 403);
  assert.equal((await request('/api/studio/articles', headers, { status: 'draft', enTitle: 'Test' })).status, 403);
}
assert.deepEqual(await (await request('/api/session')).json(), { signedIn: false, owner: false });
assert.deepEqual(await (await request('/api/session', owner)).json(), { signedIn: true, owner: true });
assert.equal((await request('/api/studio/articles', { ...owner, origin: 'https://other.example' }, { status: 'preprint', enTitle: 'Unsafe' })).status, 403);
assert.equal((await request('/api/studio/articles', owner, { status: 'preprint', enTitle: 'Unsafe', url: 'javascript:alert(1)' })).status, 422);

const draft = await (await request('/api/studio/articles', owner, { status: 'draft', ruTitle: 'Черновик', ruBody: 'Личный текст' })).json();
assert.equal(draft.status, 'draft');
assert.deepEqual(await (await request('/api/publications')).json(), []);
assert.equal((await (await request('/api/studio/articles', owner)).json())[0].id, draft.id);
const preprint = await (await request('/api/studio/articles', owner, { ...draft, status: 'preprint' })).json();
assert.equal(preprint.status, 'preprint');
assert.equal((await (await request('/api/publications')).json())[0].ruBody, 'Личный текст');
await request('/api/studio/articles', owner, { ...preprint, status: 'draft' });
assert.deepEqual(await (await request('/api/publications')).json(), []);

assert.equal((await request('/api/studio/checklist/research', viewer, { status: 'done', quality: '5' })).status, 403);
assert.equal((await request('/api/studio/checklist/route', owner, { status: 'skip', quality: '0' })).status, 422);
assert.equal((await request('/api/studio/checklist/research', owner, { status: 'done', quality: '7' })).status, 422);
const evidence = { status: 'done', quality: 4, notes: 'Springer chapter', next: 'Request contribution letter' };
assert.deepEqual(await (await request('/api/studio/checklist/research', owner, evidence)).json(), { id: 'research', ...evidence });
assert.deepEqual(await (await request('/api/studio/checklist', owner)).json(), [{ id: 'research', ...evidence }]);
assert.deepEqual(await (await request('/api/publications')).json(), []);
console.log('All pages, core assets, public and owner access, draft visibility and checklist persistence passed.');
