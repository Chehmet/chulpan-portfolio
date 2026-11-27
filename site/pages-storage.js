const publicationStates = new Set(['draft', 'published', 'preprint', 'working']);
const checklistStates = new Set(['notStarted', 'working', 'review', 'done', 'skip']);
const articleFields = {
  enTitle: 280, ruTitle: 280, authors: 500, venue: 280, year: 4, url: 1000, doi: 180,
  enSummary: 1500, ruSummary: 1500, enBody: 32000, ruBody: 32000,
};

function localKey(base, kind) {
  return `cv-pages:v1:${new URL(base, location.href).pathname}:${kind}`;
}

function readLocal(key) {
  const value = JSON.parse(localStorage.getItem(key) || '[]');
  if (!Array.isArray(value)) throw new Error('Stored data is invalid');
  return value;
}

function writeLocal(key, items) {
  localStorage.setItem(key, JSON.stringify(items));
}

function mergeRecords(existing, incoming) {
  const incomingIds = new Set(incoming.map(record => record.id));
  return [...incoming, ...existing.filter(record => !incomingIds.has(record.id))];
}

function normalizeArticle(raw) {
  if (!raw || !publicationStates.has(raw.status)) throw new Error('Invalid publication status');
  if (raw.id && !/^[a-zA-Z0-9-]{1,80}$/.test(raw.id)) throw new Error('Invalid publication ID');
  const fields = Object.fromEntries(Object.entries(articleFields).map(([key, limit]) => [key, String(raw[key] ?? '').trim().slice(0, limit)]));
  if (!fields.enTitle && !fields.ruTitle) throw new Error('Publication needs a title');
  if (fields.year && !/^\d{4}$/.test(fields.year)) throw new Error('Invalid year');
  if (fields.url && !['https:', 'http:'].includes(new URL(fields.url).protocol)) throw new Error('Invalid publication URL');
  return { id: raw.id || crypto.randomUUID(), status: raw.status, ...fields };
}

async function publicArticles(base) {
  const response = await fetch(`${base}publications-data.json`, { cache: 'no-cache' });
  if (!response.ok) throw new Error('Published articles are unavailable');
  const records = await response.json();
  if (!Array.isArray(records)) throw new Error('Invalid publication file');
  return records.filter(item => item && item.id && item.id !== 'cognitive-linguistic-markers' && item.status !== 'draft').map(normalizeArticle);
}

function downloadJson(name, data) {
  const file = new Blob([JSON.stringify(data, null, 2) + '\n'], { type: 'application/json' });
  const href = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = href;
  link.download = name;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}

export async function portfolioApi(base, path, options) {
  if (path === 'publications') return publicArticles(base);
  const key = localKey(base, 'article-edits');
  if (path === 'studio/articles' && options?.method === 'PUT') {
    const saved = normalizeArticle(JSON.parse(options.body));
    writeLocal(key, mergeRecords(readLocal(key), [saved]));
    return saved;
  }
  if (path === 'studio/articles' || path === 'studio/export-publications') {
    const records = mergeRecords(await publicArticles(base), readLocal(key));
    if (path === 'studio/articles') return records;
    downloadJson('publications-data.json', records.filter(record => record.status !== 'draft'));
    return true;
  }
  throw new Error('Unknown portfolio request');
}

export function visaStorage(base, groups) {
  const key = localKey(base, 'visa-checklist');
  const ids = new Set(groups.flatMap(group => group.tasks.map(([id]) => id)));
  const skippable = new Set(['business', 'innovation', 'external', 'impact', 'research']);

  function normalizeChecklist(record) {
    if (!record || !ids.has(record.id) || !checklistStates.has(record.status) || (record.status === 'skip' && !skippable.has(record.id)) || !/^[0-5]$/.test(String(record.quality))) {
      throw new Error('Invalid checklist item');
    }
    return { id: record.id, status: record.status, quality: Number(record.quality), notes: String(record.notes ?? '').slice(0, 4000), next: String(record.next ?? '').slice(0, 1600) };
  }

  return {
    async api(path, options) {
      if (path === 'studio/checklist') return readLocal(key).map(normalizeChecklist);
      const id = path.match(/^studio\/checklist\/([a-z]+)$/)?.[1];
      if (!id || options?.method !== 'PUT') throw new Error('Unknown checklist request');
      const record = normalizeChecklist({ ...JSON.parse(options.body), id });
      writeLocal(key, mergeRecords(readLocal(key), [record]));
      return record;
    },
    backup: {
      download() { downloadJson('visa-checklist-backup.json', { version: 1, records: readLocal(key) }); },
      async restore(file) {
        if (file.size > 500000) throw new Error('File is too large');
        const data = JSON.parse(await file.text());
        if (data.version !== 1 || !Array.isArray(data.records) || data.records.length > ids.size) throw new Error('Invalid backup');
        const records = data.records.map(normalizeChecklist);
        if (new Set(records.map(record => record.id)).size !== records.length) throw new Error('Duplicate checklist item');
        writeLocal(key, mergeRecords(readLocal(key), records));
      },
    },
  };
}
