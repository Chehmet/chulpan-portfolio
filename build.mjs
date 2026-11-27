import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { visaGroups } from './site/content.js';

const read = (file, encoding) => readFile(new URL(file, import.meta.url), encoding);
const write = (file, data) => writeFile(new URL(file, import.meta.url), data);
const assets = {
  '/assets/style.css': ['style.css', 'text/css; charset=utf-8'],
  '/assets/app.js': ['app.js', 'text/javascript; charset=utf-8'],
  '/assets/content.js': ['content.js', 'text/javascript; charset=utf-8'],
  '/assets/studio.js': ['studio.js', 'text/javascript; charset=utf-8'],
  '/assets/contours.webp': ['contours.webp', 'image/webp', true],
};

const [shell, worker, manifest] = await Promise.all([
  read('./site/shell.html', 'utf8'),
  read('./worker.js', 'utf8'),
  read('./.openai/hosting.json', 'utf8'),
]);
const embedded = Object.fromEntries(await Promise.all(Object.entries(assets).map(async ([url, [file, type, binary]]) => [url, { type, binary: !!binary, data: await read(`./site/${file}`, binary ? 'base64' : 'utf8') }])));
const ids = visaGroups.flatMap(group => group.tasks.map(([id]) => id));

for (const folder of ['./dist/server/', './dist/.openai/']) {
  await mkdir(new URL(folder, import.meta.url), { recursive: true });
}

await Promise.all([
  write('./dist/server/index.js', `const assets = ${JSON.stringify(embedded)};\nconst shell = ${JSON.stringify(shell)};\nconst checklistIds = new Set(${JSON.stringify(ids)});\n${worker}`),
  write('./dist/.openai/hosting.json', manifest),
]);
