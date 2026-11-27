import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { categories, experience, links, projects, publication, studcampCertificates } from './site/content.js';
import { buildPages } from './build-pages.mjs';

const project = fileURLToPath(new URL('.', import.meta.url));
const source = join(await buildPages('portfolio'), 'portfolio');
const target = join(project, 'docs');
const read = file => readFile(join(source, file), 'utf8');
const write = (file, text) => writeFile(join(target, file), text);

function replaceChecked(text, original, replacement) {
  if (!text.includes(original)) throw new Error(`Expected portfolio source marker: ${original.slice(0, 68)}`);
  return text.replace(original, replacement);
}

function block(text, startMarker, endMarker) {
  const start = text.indexOf(startMarker);
  const end = text.indexOf(endMarker, start + 1);
  if (start < 0 || end < 0) throw new Error(`Expected source block: ${startMarker}`);
  return text.slice(start, end);
}

for (const dir of ['assets', 'publications', 'editor']) await mkdir(join(target, dir), { recursive: true });
const copied = ['.nojekyll', 'README.md', 'index.html', 'publications/index.html', 'editor/index.html', 'assets/contours.webp', ...studcampCertificates.map(({ image }) => `assets/${image}`)];
await Promise.all(copied.map(file => copyFile(join(source, file), join(target, file))));
try {
  await copyFile(join(source, 'publications-data.json'), join(target, 'publications-data.json'), constants.COPYFILE_EXCL);
} catch (error) {
  if (error.code !== 'EEXIST') throw error;
}
const catalogue = JSON.parse(await readFile(join(target, 'publications-data.json'), 'utf8'));
if (!Array.isArray(catalogue) || catalogue.some(item => !item || !['published', 'preprint', 'working'].includes(item.status))) {
  throw new Error('Use the public JSON export from the publication editor in docs/publications-data.json.');
}

let app = await read('assets/app.js');
app = replaceChecked(app, 'publication, visaGroups', 'publication');
app = replaceChecked(app, "const pages = document.body.dataset.site === 'portfolio';\n", '');
app = replaceChecked(app, "url(pages ? '/editor/' : '/studio/')", "url('/editor/')");
app = replaceChecked(app, "pages ? tr('Publication editor', 'Редактор публикаций') : tr('Owner workspace', 'Кабинет владельца')", "tr('Publication editor', 'Редактор публикаций')");
app = replaceChecked(app, block(app, 'const workspaceTitle = ', 'app.innerHTML = '), "const workspaceTitle = tr('Publication editor', 'Редактор публикаций');\n");
app = replaceChecked(app, '${workspaceSummary}', '');
app = replaceChecked(app, block(app, 'async function api(', "if (page === 'publications') {"), `async function api(path, options) {
  const { portfolioApi } = await import('./pages-storage.js');
  return portfolioApi(base, path, options);
}

`);
app = replaceChecked(app, "import('./studio.js').then(({ setupStudio }) => setupStudio({", "import('./publication-editor.js').then(({ setupPublicationEditor }) => setupPublicationEditor({");
app = replaceChecked(app, "tr, pick, esc, links, visaGroups, statuses, api, articleCard, url,\n    ...(pages ? { pages: 'portfolio' } : {}),", 'tr, esc, statuses, api, articleCard,');
await write('assets/app.js', app);

const studio = await read('assets/studio.js');
const helpers = block(studio, '  const setMessage = ', '  async function start()');
const editor = block(studio, '  async function editor(panel)', '  async function checklist(panel)');
await write('assets/publication-editor.js', `export function setupPublicationEditor({ root, tr, esc, statuses, api, articleCard }) {
  const pages = 'portfolio';
${helpers}${editor}  editor(root).catch(() => {
    root.innerHTML = \`<p class="notice">\${tr('The publication editor could not load. Refresh this page to try again.', 'Редактор публикаций не загрузился. Обновите страницу, чтобы попробовать ещё раз.')}</p>\`;
  });
}
`);

let storage = await read('assets/pages-storage.js');
storage = replaceChecked(storage, "const checklistStates = new Set(['notStarted', 'working', 'review', 'done', 'skip']);\n", '');
storage = storage.slice(0, storage.indexOf('export function visaStorage('));
await write('assets/pages-storage.js', storage);

const css = (await read('assets/style.css')).split('\n').filter(line => !line.startsWith('.visa-') && !line.includes('.visa-sources')).join('\n').replace('.checklist-backup{margin-top:16px}', '').replace('.editor-export p,.checklist-backup p', '.editor-export p');
await write('assets/style.css', css);

const publicLinks = { github: links.github, linkedin: links.linkedin, scholar: links.scholar, chapter: links.chapter };
const data = { categories, experience, links: publicLinks, projects, publication, studcampCertificates };
await write('assets/content.js', Object.entries(data).map(([key, value]) => `export const ${key} = ${JSON.stringify(value, null, 2)};`).join('\n\n') + '\n');
console.log(`GitHub Pages: ${target}`);
