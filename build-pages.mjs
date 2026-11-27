import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { categories, experience, links, projects, publication, visaGroups } from './site/content.js';

const root = fileURLToPath(new URL('./dist/github-pages/', import.meta.url));
const source = fileURLToPath(new URL('./site/', import.meta.url));
const template = await readFile(join(source, 'shell.html'), 'utf8');

const readme = (name, details) => `# ${name}

## Публикация через GitHub Pages

1. Создайте отдельный репозиторий на GitHub для этого сайта.
2. Создайте папку **docs** и распакуйте в неё содержимое ZIP. Сохраните **index.html**, **.nojekyll** и папки **assets**, **editor** и **publications** рядом друг с другом, если они присутствуют в архиве.
3. Откройте **Settings → Pages**. В **Build and deployment** выберите **Deploy from a branch**, ветку **main**, папку **/docs** и **Save**. Если вы разместили файлы в корне, выберите **/(root)**.
4. После сборки скопируйте ссылку из **Settings → Pages**. На сайте переключатель **RU / EN** расположен вверху.

Сайт работает по адресу вида **https://USERNAME.github.io/REPOSITORY/** и не требует установки зависимостей или сборки. Открывайте его по HTTP(S), чтобы браузер мог загружать модули и данные.

${details}

[Документация GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
`;

const variants = [
  {
    dir: 'portfolio', id: 'portfolio', app: 'app.js', assets: ['style.css', 'app.js', 'studio.js', 'pages-storage.js', 'contours.webp'],
    data: { categories, experience, links: { github: links.github, linkedin: links.linkedin, scholar: links.scholar, chapter: links.chapter }, projects, publication, visaGroups: [] },
    routes: [
      { path: '', page: 'home', title: 'Chulpan Valiullina — AI Engineering & Data Analytics' },
      { path: 'publications', page: 'publications', title: 'Publications — Chulpan Valiullina' },
      { path: 'editor', page: 'studio', title: 'Publication Editor — Chulpan Valiullina', noindex: true },
    ],
    description: 'Chulpan Valiullina’s bilingual portfolio across AI engineering, data analytics and NLP research.',
    guide: readme('Портфолио Чулпан Валиуллиной', `## Как добавлять публикации

Откройте в подвале сайта **Редактор публикаций**. Добавьте название, аннотацию, ссылку на PDF или текст. Можно заполнить один язык или оба. Нажмите **Предпросмотр**, чтобы проверить карточку.

Черновики и правки хранятся в текущем браузере. Чтобы поделиться материалом, выберите «Препринт», «Рабочая статья» или «Опубликовано», сохраните запись и нажмите **Скачать publications-data.json**. Замените этот файл в папке, выбранной источником GitHub Pages, например **docs/publications-data.json**. После обновления GitHub Pages запись будет видна всем посетителям. Для снятия записи выберите «Личный черновик» и повторите выгрузку и замену файла.

В публичную выгрузку попадают только записи со статусом для публикации. PDF хранится по внешней ссылке. Работа Springer уже добавлена в сайт. 

Контурная иллюстрация создана встроенным инструментом ImageGen и находится в **assets/contours.webp**. [Публикация Springer](https://link.springer.com/chapter/10.1007/978-3-032-23286-1_7).`),
  },
  {
    dir: 'uk-global-talent', id: 'visa', app: 'visa-app.js', assets: ['style.css', 'visa.css', 'visa-app.js', 'studio.js', 'pages-storage.js'],
    data: { links: Object.fromEntries(Object.entries(links).filter(([key]) => !['github', 'linkedin'].includes(key))), publication, visaGroups },
    routes: [
      { path: '', page: 'evidence', title: 'UK Global Talent Evidence — Chulpan Valiullina' },
      { path: 'checklist', page: 'checklist', title: 'UK Global Talent Checklist — Chulpan Valiullina', noindex: true },
    ],
    description: 'Digital Technology evidence profile and application checklist for UK Global Talent.',
    guide: readme('UK Global Talent · Чулпан Валиуллина', `## Как пользоваться чеклистом

На главной странице собраны подтверждённые достижения. По ссылке **Чеклист** открываются требования и поля для статуса, оценки силы доказательства, заметок и следующего шага. После изменения пункта нажмите **Сохранить прогресс**. Чеклист сверялся с GOV.UK и Tech Nation 27 ноября 2026 года.

Данные чеклиста хранятся в вашем браузере по адресу сайта. Посетитель по той же ссылке увидит свой пустой чеклист. Чтобы перенести данные, используйте **Скачать резервную копию** и **Восстановить из копии**. Держите резервную копию среди личных файлов.

Сайт можно показать вместе с комплектом документов. [Официальные критерии GOV.UK](https://www.gov.uk/global-talent-digital-technology/eligibility).`),
  },
];

async function buildVariant(variant) {
  const folder = join(root, variant.dir);
  const assets = join(folder, 'assets');
  await mkdir(assets, { recursive: true });
  await Promise.all(variant.assets.map(file => copyFile(join(source, file), join(assets, file))));
  const exported = Object.entries(variant.data).map(([key, value]) => `export const ${key} = ${JSON.stringify(value, null, 2)};`).join('\n\n');
  await writeFile(join(assets, 'content.js'), exported + '\n');
  await writeFile(join(folder, 'README.md'), variant.guide);
  await writeFile(join(folder, '.nojekyll'), '');
  if (variant.id === 'portfolio') await writeFile(join(folder, 'publications-data.json'), '[]\n');

  for (const route of variant.routes) {
    const base = route.path ? '../' : './';
    const document = template
      .replace('data-page="{{PAGE}}"', `data-page="${route.page}" data-site="${variant.id}" data-base="${base}"`)
      .replace(/<title>[^<]+<\/title>/, `<title>${route.title}</title>`)
      .replace(/(<meta name="description" content=")[^"]+(".*)/, `$1${variant.description}$2${route.noindex ? '\n  <meta name="robots" content="noindex, nofollow">' : ''}`)
      .replace('href="/assets/style.css"', `href="${base}assets/style.css"${variant.id === 'visa' ? `>\n  <link rel="stylesheet" href="${base}assets/visa.css"` : ''}`)
      .replace('src="/assets/app.js"', `src="${base}assets/${variant.app}"`);
    const outlet = join(folder, route.path);
    await mkdir(outlet, { recursive: true });
    await writeFile(join(outlet, 'index.html'), document);
  }
}

export async function buildPages(only) {
  for (const variant of variants.filter(variant => !only || variant.id === only)) {
    await buildVariant(variant);
  }
  return root;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(await buildPages());
}
