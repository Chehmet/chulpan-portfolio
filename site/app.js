import { categories, experience, links, projects, publication, visaGroups } from './content.js';

const page = document.body.dataset.page;
const app = document.querySelector('#app');
const query = new URLSearchParams(location.search);
const lang = query.get('lang') === 'ru' ? 'ru' : 'en';
const tr = (en, ru) => lang === 'ru' ? ru : en;
const pick = value => typeof value === 'object' ? value[lang] : value;
const name = tr('Chulpan Valiullina', 'Чулпан Валиуллина');
const url = (path, hash = '') => `${path}${lang === 'ru' ? '?lang=ru' : ''}${hash}`;
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const tags = items => `<ul class="tags">${items.map(item => `<li>${esc(item)}</li>`).join('')}</ul>`;
const external = (href, label, css = '') => `<a class="${css}" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`;
const validUrl = value => {
  try { const parsed = new URL(value); return ['https:', 'http:'].includes(parsed.protocol) ? parsed.href : ''; }
  catch { return ''; }
};

document.documentElement.lang = lang;
document.title = `${page === 'publications' ? tr('Publications', 'Публикации') + ' · ' : page === 'studio' ? tr('Workspace', 'Рабочий кабинет') + ' · ' : ''}${name} ${page === 'home' ? '— ' + tr('AI engineering & data analytics', 'AI-разработка и аналитика данных') : ''}`.trim();

function header() {
  return `<a class="skip" href="#main">${tr('Skip to main content', 'К основному содержанию')}</a>
    <header class="top"><div class="wrap top-inner">
      <a class="brand" href="${url('/')}"><span class="brand-icon" aria-hidden="true">✳</span><span>${name}</span></a>
      <nav aria-label="${tr('Main navigation', 'Навигация по сайту')}">
        <a href="${url('/', '#work')}">${tr('Projects', 'Проекты')}</a><a href="${url('/', '#experience')}">${tr('Experience', 'Опыт')}</a>
        <a href="${url('/', '#education')}">${tr('Education', 'Образование')}</a>
        <a href="${url('/publications/')}"${page === 'publications' ? ' aria-current="page"' : ''}>${tr('Publications', 'Публикации')}</a>
      </nav>
      <div class="lang" aria-label="${tr('Language', 'Язык')}"><a data-lang="en" lang="en" href="${location.pathname}" ${lang === 'en' ? 'aria-current="true"' : ''}>EN</a><a data-lang="ru" lang="ru" href="${location.pathname}?lang=ru" ${lang === 'ru' ? 'aria-current="true"' : ''}>RU</a></div>
    </div></header>`;
}

function footer() {
  return `<footer class="footer"><div class="wrap footer-inner"><span>© 2026 ${name}</span><div class="footer-links">${external(links.linkedin, 'LinkedIn')}${external(links.github, 'GitHub')}${external(links.scholar, 'Google Scholar')}<a href="${url('/studio/')}">${tr('Owner workspace', 'Кабинет владельца')}</a></div></div></footer>`;
}

const title = (id, heading, copy = '') => `<div class="section-heading"><h2 id="${id}">${heading}</h2>${copy ? `<p>${copy}</p>` : ''}</div>`;

function visual(kind) {
  if (kind === 'experiment') return `<div class="viz experiment" role="img" aria-label="${tr('Case study conversion: A 65.65%, B 80.40%', 'Конверсия в кейсе: A 65,65%, B 80,40%')}"><strong>+14.75 <small>${tr('pp', 'п. п.')}</small></strong><div class="bar-area"><div><i style="--bar:65.65%"></i><span>A</span></div><div><i style="--bar:80.4%"></i><span>B</span></div></div></div>`;
  if (kind === 'flights') return `<div class="viz flights" aria-hidden="true"><div class="radar"><i></i><i></i><i></i><i></i><i></i><span></span><span></span><span></span><span></span></div><span class="viz-caption">HIVEQL / SPARK ML</span></div>`;
  if (kind === 'rag') return `<div class="viz rag" aria-hidden="true"><div class="rag-steps"><span>${tr('Query', 'Запрос')}</span><i></i><span>FAISS</span><i></i><span>LLM</span></div><div class="rag-points">${Array.from({ length: 50 }, () => '<i></i>').join('')}</div></div>`;
  if (kind === 'research') return `<div class="viz research" aria-hidden="true"><div class="research-bars">${[38, 86, 51, 77, 48, 96, 69, 57].map(size => `<i style="--size:${size}%"></i>`).join('')}</div><span class="viz-caption">NLP / AINA 2026</span></div>`;
  if (kind === 'feedback') return `<div class="viz feedback" aria-hidden="true"><strong>11</strong><span>${tr('soft skills', 'гибких навыков')}</span><div class="feedback-grid"></div></div>`;
  return `<div class="viz alumni" aria-hidden="true"><div><b>IU</b><i></i><i></i><i></i></div><span class="viz-caption">DJANGO / AI CHAT</span></div>`;
}

function projectCard(project) {
  const source = project.source ? pick(project.source) : 'GitHub';
  return `<article class="project" id="project-${project.id}" data-categories="${project.category.join(' ')}">
    ${visual(project.visual)}<div class="project-content"><p class="eyebrow">${pick(project.type)}</p><h3>${pick(project.name)}</h3><p>${pick(project.summary)}</p>${tags(project.tools)}
    <details><summary>${tr('Case details', 'Подробности кейса')}</summary><p>${pick(project.detail)}</p></details>
    ${project.url ? external(project.url, source, 'text-link') : ''}</div></article>`;
}

function home() {
  return `<main id="main">
    <div class="hero-shell"><section class="wrap hero" aria-labelledby="hero-title">
      <div class="hero-copy"><p class="eyebrow hero-role">${tr('AI ENGINEERING / DATA ANALYTICS', 'AI-РАЗРАБОТКА / АНАЛИТИКА ДАННЫХ')}</p>
      <h1 id="hero-title">${tr('Chulpan<br>Valiullina', 'Чулпан<br>Валиуллина')}</h1>
      <p class="hero-intro">${tr('I build AI tools and use data to evaluate how products work. My projects span LLM evaluation, product experiments and NLP research.', 'Разрабатываю AI-инструменты и использую данные, чтобы оценивать работу продуктов. Мои проекты охватывают оценку LLM, продуктовые эксперименты и исследования в NLP.')}</p>
      <div class="actions"><a class="button primary" href="#work">${tr('Explore my work', 'Смотреть проекты')}</a>${external(links.linkedin, 'LinkedIn', 'button outline')}</div></div>
      <div class="hero-art" aria-hidden="true"><img src="/assets/contours.webp" width="1000" height="1000" alt="" fetchpriority="high"><span class="art-mark mark-top"></span><span class="art-mark mark-bottom"></span></div>
    </section></div>
    <div class="credential-band"><div class="wrap credential-inner"><div><strong>${tr('T-Bank', 'Т-Банк')}</strong><span>${tr('Backend engineering', 'Backend-разработка')}</span></div><div><strong>${tr('Innopolis University', 'Университет Иннополис')}</strong><span>${tr('Data & AI', 'Данные и AI')}</span></div><div><strong>Springer · AINA 2026</strong><span>${tr('Published NLP research', 'Публикация по NLP')}</span></div></div></div>
    <section class="wrap section" id="work" aria-labelledby="work-title">
      ${title('work-title', tr('Selected work', 'Избранные проекты'), tr('Product experiments, data pipelines and AI systems.', 'Продуктовые эксперименты, пайплайны данных и AI-системы.'))}
      <div class="filter" aria-label="${tr('Filter projects by area', 'Фильтр проектов по направлению')}">${Object.entries(categories).map(([id, label]) => `<button data-filter="${id}" aria-pressed="${id === 'all'}">${pick(label)}</button>`).join('')}</div>
      <div class="project-grid">${projects.map(projectCard).join('')}</div>
    </section>
    <section class="experience-shell" id="experience"><div class="wrap section experience-layout">
      ${title('experience-title', tr('Experience', 'Опыт работы'), tr('Backend engineering, AI agents and computer vision.', 'Backend-разработка, AI-агенты и компьютерное зрение.'))}
      <div class="timeline" aria-labelledby="experience-title">${experience.map(item => `<article><div class="timeline-heading"><div><p class="eyebrow">${pick(item.role)}</p><h3>${pick(item.name)}</h3></div>${item.context ? `<span>${pick(item.context)}</span>` : ''}</div><p>${pick(item.text)}</p>${tags(item.tags)}</article>`).join('')}</div>
    </div></section>
    <section class="wrap section" id="education">
      ${title('education-title', tr('Education & achievements', 'Образование и достижения'))}
      <div class="education-grid">
        <article class="education main-edu"><p class="eyebrow">${tr('DEGREES', 'ОБРАЗОВАНИЕ')}</p><h3>${tr('Innopolis University', 'Университет Иннополис')}</h3><dl><div><dt>${tr('Master’s studies', 'Магистратура')}</dt><dd>${tr('Data Analysis and Engineering', 'Анализ и инженерия данных')}</dd></div><div><dt>${tr('Bachelor’s degree', 'Бакалавриат')}</dt><dd>${tr('Computer Science and Computer Engineering, Data Analysis and Artificial Intelligence track', 'Информатика и вычислительная техника, профиль «Анализ данных и искусственный интеллект»')}</dd></div></dl></article>
        <article class="education"><p class="eyebrow">${tr('UNIVERSITY COURSEWORK', 'УНИВЕРСИТЕТСКИЕ КУРСЫ')}</p><h3>${tr('Statistics & optimisation', 'Статистика и оптимизация')}</h3><ul class="plain"><li>Advanced Statistics</li><li>Statistical Techniques for Large Language Models</li><li>${tr('Optimisation: convexity, constraints and optimality conditions', 'Оптимизация: выпуклость, ограничения и условия оптимальности')}</li></ul></article>
        <article class="education"><p class="eyebrow">${tr('INTENSIVE PROGRAMMES · 2025', 'ИНТЕНСИВЫ · 2025')}</p><h3>${tr('Yandex Studcamps', 'Студкемпы Яндекса')}</h3><ul class="plain"><li>Data Management</li><li>NLP</li><li>Generative AI & Robots</li></ul></article>
        <article class="education"><p class="eyebrow">${tr('HACKATHONS & CERTIFICATES', 'ХАКАТОНЫ И СЕРТИФИКАТЫ')}</p><h3>${tr('Competition & training', 'Соревнования и обучение')}</h3><ul class="plain"><li><strong>${tr('3rd place', '3-е место')}</strong> · ${tr('Invian × Innopolis University Startup Studio Hackathon', 'хакатон «Инвиан» и Стартап-студии Университета Иннополис')}</li><li>${tr('MTS True Tech Hack · participant certificate, 2026', 'МТС True Tech Hack · сертификат участника, 2026')}</li><li>${tr('InnoGlobalHack and EESTech Challenge · participant certificates, 2024', 'InnoGlobalHack и EESTech Challenge · сертификаты участника, 2024')}</li><li>${tr('IT Purple Hack · participant certificate', 'IT Purple Hack · сертификат участника')}</li><li>${tr('Yandex Lyceum certificate · 2018–2020', 'Сертификат Яндекс Лицея · 2018–2020')}</li></ul></article>
      </div>
    </section>
    <div class="research-callout"><div class="wrap research-inner"><div><p class="eyebrow">${tr('RESEARCH · SPRINGER', 'ИССЛЕДОВАНИЯ · SPRINGER')}</p><h2>${tr('How do we measure<br>creativity in text?', 'Как измерить<br>креативность текста?')}</h2></div><div><p>${tr('Our AINA 2026 chapter uses eight linguistic markers to compare human and machine-generated writing.', 'В работе для AINA 2026 мы сравнили тексты людей и языковых моделей по восьми лингвистическим маркерам.')}</p><a class="button dark" href="${url('/publications/')}">${tr('Read my publications', 'Смотреть публикации')}</a></div></div></div>
    <section class="wrap section contact"><h2>${tr('Let’s talk', 'Давайте знакомиться')}</h2><p>${tr('For roles in AI engineering, analytics or applied research, reach me on LinkedIn.', 'Если вы ищете специалистку по AI-разработке, аналитике или прикладным исследованиям, напишите мне в LinkedIn.')}</p>${external(links.linkedin, 'LinkedIn', 'button dark')}</section>
  </main>`;
}

const statuses = {
  published: tr('Published', 'Опубликовано'), preprint: tr('Preprint', 'Препринт'),
  working: tr('Working paper', 'Рабочая статья'), draft: tr('Private draft', 'Личный черновик'),
};

function articleCard(item) {
  const aTitle = (lang === 'ru' ? item.ruTitle || item.enTitle : item.enTitle || item.ruTitle);
  const summary = (lang === 'ru' ? item.ruSummary || item.enSummary : item.enSummary || item.ruSummary);
  const body = (lang === 'ru' ? item.ruBody || item.enBody : item.enBody || item.ruBody);
  const link = validUrl(item.url);
  return `<article class="paper" id="paper-${esc(item.id)}">
    <div class="paper-side"><span class="status-label">${esc(statuses[item.status])}</span><p>${esc(item.year)}</p></div>
    <div class="paper-main"><h2>${esc(aTitle)}</h2>${item.id === publication.id ? `<p class="original-title" lang="en">${lang === 'ru' ? esc(item.enTitle) : ''}</p>` : ''}
      <p class="authors">${esc(item.authors)}</p>${summary ? `<p>${esc(summary)}</p>` : ''}${item.venue ? `<p class="venue">${esc(item.venue)}</p>` : ''}
      ${item.doi ? `<p class="venue">DOI ${esc(item.doi)}</p>` : ''}${body ? `<details class="paper-body"><summary>${tr('Read text', 'Читать текст')}</summary><div>${esc(body)}</div></details>` : ''}
      ${link ? external(link, item.id === publication.id ? tr('Read at Springer', 'Читать на Springer') : tr('Open publication', 'Открыть материал'), 'text-link') : ''}
    </div></article>`;
}

function publications() {
  return `<main id="main"><section class="page-banner"><div class="wrap"><p class="eyebrow">${name}</p><h1>${tr('Publications', 'Публикации')}</h1><p>${tr('Research on language models and creativity, with room for preprints and working papers.', 'Исследования языковых моделей и креативности. Здесь также могут появляться препринты и рабочие статьи.')}</p>${external(links.scholar, 'Google Scholar', 'button outline')}</div></section><div class="wrap section papers" id="papers">${articleCard(publication)}</div></main>`;
}

app.innerHTML = header() + (page === 'publications' ? publications() : page === 'studio' ? `<main id="main"><section class="page-banner"><div class="wrap"><p class="eyebrow">${name}</p><h1>${tr('Workspace', 'Рабочий кабинет')}</h1><p>${tr('Publication editor and Global Talent checklist.', 'Редактор публикаций и чеклист Global Talent.')}</p></div></section><div class="wrap section" id="studio" aria-live="polite"><p>${tr('Checking access…', 'Проверяем доступ…')}</p></div></main>` : home()) + footer();

function preserveLanguageAnchors() {
  document.querySelectorAll('[data-lang]').forEach(link => {
    const params = new URLSearchParams(location.search);
    if (link.dataset.lang === 'ru') params.set('lang', 'ru');
    else params.delete('lang');
    const next = params.toString();
    link.href = `${location.pathname}${next ? '?' + next : ''}${location.hash}`;
  });
}
preserveLanguageAnchors();
window.addEventListener('hashchange', preserveLanguageAnchors);
if (location.hash) requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView());

app.addEventListener('click', event => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  for (const filter of app.querySelectorAll('[data-filter]')) filter.setAttribute('aria-pressed', filter === button);
  for (const card of app.querySelectorAll('[data-categories]')) card.hidden = button.dataset.filter !== 'all' && !card.dataset.categories.split(' ').includes(button.dataset.filter);
});

async function api(path, options) {
  const response = await fetch(`/api/${path}`, { ...options, headers: { 'Content-Type': 'application/json' } });
  if (!response.ok) throw new Error(String(response.status));
  return response.json();
}

if (page === 'publications') {
  api('publications').then(items => {
    document.querySelector('#papers').insertAdjacentHTML('beforeend', items.map(articleCard).join(''));
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }).catch(() => {
    document.querySelector('#papers').insertAdjacentHTML('beforeend', `<p class="notice">${tr('Additional publications are temporarily unavailable.', 'Дополнительные публикации временно недоступны.')}</p>`);
  });
}

if (page === 'studio') {
  import('./studio.js').then(({ setupStudio }) => setupStudio({
    root: document.querySelector('#studio'), tr, pick, esc, links, visaGroups, statuses, api, articleCard, url,
  }));
}
