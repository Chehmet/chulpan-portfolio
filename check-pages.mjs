import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { visaGroups } from './site/content.js';
import { portfolioApi, visaStorage } from './site/pages-storage.js';

const root = fileURLToPath(new URL('./dist/github-pages/', import.meta.url));
const routes = [
  'portfolio/index.html', 'portfolio/publications/index.html', 'portfolio/editor/index.html',
  'uk-global-talent/index.html', 'uk-global-talent/checklist/index.html',
];
for (const route of routes) {
  const file = resolve(root, route);
  const document = await readFile(file, 'utf8');
  assert.match(document, /data-site="(?:portfolio|visa)"/);
  assert(!document.includes('{{PAGE}}'));
  for (const match of document.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    const value = match[1];
    if (value.startsWith('data:')) continue;
    assert.match(value, /^(\.\/|\.\.\/)/, `${route}: ${value}`);
    const assetPath = resolve(file, '..', value);
    assert(relative(resolve(root, route.split('/')[0]), assetPath).startsWith('assets'));
    assert((await readFile(assetPath)).length > 0);
  }
}

globalThis.location = new URL('https://example.github.io/portfolio/editor/?lang=ru');
const storage = new Map();
globalThis.localStorage = {
  getItem: key => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
};
let publishedFile = [];
globalThis.fetch = async path => {
  const url = new URL(path, location.href);
  assert.equal(url.pathname, '/portfolio/publications-data.json');
  return Response.json(publishedFile);
};
let downloaded;
globalThis.document = {
  body: { append() {} },
  createElement: () => ({ click() { downloaded = { name: this.download, blob: this.href }; }, remove() {} }),
};
URL.createObjectURL = blob => blob;
URL.revokeObjectURL = () => {};

const put = data => ({ method: 'PUT', body: JSON.stringify(data) });
const draft = await portfolioApi('../', 'studio/articles', put({ status: 'draft', ruTitle: 'Черновик' }));
const preprint = await portfolioApi('../', 'studio/articles', put({ status: 'preprint', ruTitle: 'Препринт' }));
assert.equal((await portfolioApi('../', 'studio/articles')).length, 2);
assert.deepEqual(await portfolioApi('../', 'publications'), []);
await portfolioApi('../', 'studio/export-publications');
assert.equal(downloaded.name, 'publications-data.json');
publishedFile = JSON.parse(await downloaded.blob.text());
assert.deepEqual(publishedFile.map(item => item.id), [preprint.id]);
assert.equal((await portfolioApi('../', 'publications'))[0].ruTitle, 'Препринт');
await portfolioApi('../', 'studio/articles', put({ ...preprint, status: 'draft' }));
await portfolioApi('../', 'studio/export-publications');
assert.deepEqual(JSON.parse(await downloaded.blob.text()), []);
assert((await portfolioApi('../', 'studio/articles')).some(item => item.id === draft.id));

globalThis.location = new URL('https://example.github.io/uk-global-talent/checklist/?lang=ru');
let visa = visaStorage('../', visaGroups);
const checked = await visa.api('studio/checklist/research', put({ status: 'done', quality: 4, notes: 'Springer', next: 'Собрать подтверждения' }));
assert.deepEqual(await visaStorage('../', visaGroups).api('studio/checklist'), [checked]);
visa.backup.download();
assert.equal(downloaded.name, 'visa-checklist-backup.json');
globalThis.location = new URL('https://other.github.io/visa/checklist/');
visa = visaStorage('../', visaGroups);
assert.deepEqual(await visa.api('studio/checklist'), []);
await visa.backup.restore(downloaded.blob);
assert.deepEqual(await visa.api('studio/checklist'), [checked]);
assert.equal(await readFile(resolve(root, 'portfolio/publications-data.json'), 'utf8'), '[]\n');

console.log('Both repository paths, public publication exports, draft privacy, checklist persistence and backup transfer passed.');
