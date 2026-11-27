import { links, publication, visaGroups } from './content.js';
import { setupStudio } from './studio.js';
import { visaStorage } from './pages-storage.js';

const base = document.body.dataset.base;
const checklist = document.body.dataset.page === 'checklist';
const lang = new URLSearchParams(location.search).get('lang') === 'ru' ? 'ru' : 'en';
const tr = (en, ru) => lang === 'ru' ? ru : en;
const pick = value => value[lang];
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const name = tr('Chulpan Valiullina', 'Чулпан Валиуллина');
const query = lang === 'ru' ? '?lang=ru' : '';
const homeUrl = `${base}${query}`;
const checklistUrl = `${base}checklist/${query}`;
const external = (href, label, css = 'text-link') => `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer" class="${css}">${esc(label)}</a>`;
const title = checklist ? tr('UK Global Talent checklist', 'Чеклист UK Global Talent') : tr('UK Global Talent · Digital Technology', 'UK Global Talent · Digital Technology');

document.documentElement.lang = lang;
document.title = `${title} · ${name}`;

function navigation() {
  return `<a class="skip" href="#main">${tr('Skip to main content', 'К основному содержанию')}</a><header class="top"><div class="wrap top-inner"><a class="brand" href="${homeUrl}"><span class="brand-icon" aria-hidden="true">CV</span>${name}</a><nav aria-label="${tr('Main navigation', 'Навигация по сайту')}"><a href="${homeUrl}"${checklist ? '' : ' aria-current="page"'}>${tr('Evidence profile', 'Профиль и доказательства')}</a><a href="${checklistUrl}"${checklist ? ' aria-current="page"' : ''}>${tr('Checklist', 'Чеклист')}</a></nav><div class="lang" aria-label="${tr('Language', 'Язык')}"><a lang="en" href="${location.pathname}"${lang === 'en' ? ' aria-current="true"' : ''}>EN</a><a lang="ru" href="${location.pathname}?lang=ru"${lang === 'ru' ? ' aria-current="true"' : ''}>RU</a></div></div></header>`;
}

function evidenceProfile() {
  return `<main id="main"><section class="visa-hero"><div class="wrap visa-hero-layout"><div><p class="eyebrow">${name} · ${tr('DIGITAL TECHNOLOGY', 'ЦИФРОВЫЕ ТЕХНОЛОГИИ')}</p><h1>UK Global<br>Talent</h1><p>${tr('Evidence profile for AI engineering, data analysis and published NLP research.', 'Профиль для подачи по направлению Digital Technology. Опыт AI-разработки, аналитики данных и опубликованное исследование по NLP.')}</p><div class="actions"><a class="button primary" href="#evidence">${tr('View evidence', 'Смотреть доказательства')}</a><a class="button outline" href="${checklistUrl}">${tr('Open checklist', 'Открыть чеклист')}</a></div></div>
    <aside class="visa-requirements" aria-label="${tr('Endorsement evidence at a glance', 'Основные требования к доказательствам')}"><p class="eyebrow">${tr('ENDORSEMENT EVIDENCE', 'ДОКАЗАТЕЛЬСТВА ДЛЯ ENDORSEMENT')}</p><dl><div><dt>2</dt><dd>${tr('documents supporting recognition', 'документа о признании')}</dd></div><div><dt>4</dt><dd>${tr('documents across two optional criteria', 'документа по двум критериям на выбор')}</dd></div><div><dt>3</dt><dd>${tr('recommendation letters', 'рекомендательных письма')}</dd></div></dl></aside></div></section>
    <section class="wrap section" id="evidence"><div class="section-heading"><h2>${tr('Evidence profile', 'Профиль и доказательства')}</h2><p>${tr('Each item links the work to a source or shows what is available to substantiate it.', 'Для каждого достижения указано, где его можно проверить или каким документом подтвердить.')}</p></div><div class="visa-evidence">
      <article><p class="eyebrow">${tr('PUBLISHED RESEARCH', 'ОПУБЛИКОВАННОЕ ИССЛЕДОВАНИЕ')}</p><h3>${esc(tr(publication.enTitle, publication.ruTitle))}</h3><p>${esc(tr(publication.enSummary, publication.ruSummary))}</p><p>${esc(publication.authors)} · Springer, AINA 2026</p>${external(links.chapter, tr('Springer chapter and DOI', 'Глава и DOI у Springer'))}</article>
      <article><p class="eyebrow">${tr('HACKATHON AWARD', 'НАГРАДА НА ХАКАТОНЕ')}</p><h3>${tr('Third place at the Invian hackathon', '3-е место на хакатоне «Инвиан»')}</h3><p>${tr('The prize diploma names Chulpan Valiullina. The event was organised by Invian and the Innopolis University Startup Studio.', 'В дипломе призёра указано имя Чулпан Валиуллиной. Хакатон организовали «Инвиан» и Стартап-студия Университета Иннополис.')}</p><p>${tr('Additional records include participant certificates from InnoGlobalHack, EESTech Challenge, MTS True Tech Hack and IT Purple Hack.', 'Также есть сертификаты участников InnoGlobalHack, EESTech Challenge, МТС True Tech Hack и IT Purple Hack.')}</p></article>
      <article><p class="eyebrow">${tr('ENGINEERING EXPERIENCE', 'ИНЖЕНЕРНЫЙ ОПЫТ')}</p><h3>${tr('AI agent evaluation at T-Bank', 'Оценка AI-агента в Т-Банке')}</h3><p>${tr('During a three-month backend internship, I developed Python components and automated checks for AI-agent workflows triggered by different user phrasings.', 'За три месяца стажировки я дорабатывала Python-компоненты и автоматизировала проверку того, запускает ли агент нужный сценарий при разных формулировках запроса.')}</p></article>
      <article><p class="eyebrow">${tr('PUBLIC PROJECT RECORD', 'ПУБЛИЧНЫЙ ОТЧЁТ О ПРОЕКТЕ')}</p><h3>${tr('ML engineering for the Innopolis Alumni Portal', 'ML-разработка портала выпускников Иннополиса')}</h3><p>${tr('The university’s team report lists my ML engineering role and describes the project’s AI chat and Django architecture.', 'В командном отчёте университета указана моя роль ML-инженера, описаны AI-чат и архитектура на Django.')}</p>${external('https://capstone.innopolis.university/docs/2024/alumni/week2/', tr('Innopolis University capstone report', 'Отчёт о капстоуне Университета Иннополис'))}</article>
    </div></section>
    <section class="visa-next"><div class="wrap section"><div class="section-heading"><h2>${tr('Prepare the application', 'Подготовка заявки')}</h2><p>${tr('Compare Exceptional Promise and Exceptional Talent. Use the checklist to choose criteria, record what each document supports and track gaps. The site presents evidence alongside the formal endorsement application.', 'Сравните Exceptional Promise и Exceptional Talent. В чеклисте можно выбрать критерии, записать, что подтверждает каждый документ, и отметить пробелы. Сайт дополняет комплект документов для endorsement.')}</p></div><a class="button dark" href="${checklistUrl}">${tr('Open the checklist', 'Открыть чеклист')}</a>${external(links.eligibility, tr('Read the official criteria', 'Официальные критерии'), 'text-link visa-official')}</div></section></main>`;
}

const checklistView = `<main id="main"><section class="page-banner"><div class="wrap"><p class="eyebrow">${name} · DIGITAL TECHNOLOGY</p><h1>${tr('Application checklist', 'Чеклист заявки')}</h1><p>${tr('Track requirements and the evidence behind your UK Global Talent application.', 'Отмечайте выполнение требований UK Global Talent и оценивайте, насколько убедительны доказательства.')}</p></div></section><div class="wrap section" id="tracker"></div></main>`;
const footer = `<footer class="footer"><div class="wrap footer-inner"><span>${name} · UK Global Talent</span><div class="footer-links">${external(links.gov, 'GOV.UK', '')}${external(links.technation, 'Tech Nation', '')}${external(links.scholar, 'Google Scholar', '')}</div></div></footer>`;

document.querySelector('#app').innerHTML = navigation() + (checklist ? checklistView : evidenceProfile()) + footer;
if (checklist) {
  const { api, backup } = visaStorage(base, visaGroups);
  setupStudio({ root: document.querySelector('#tracker'), tr, pick, esc, links, visaGroups, api, url: path => `${base}${path.replace(/^\//, '')}${query}`, pages: 'visa', backup });
}
