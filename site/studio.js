const tLabels = {
  notStarted: ['Not started', 'Не начато'],
  working: ['In progress', 'В работе'],
  review: ['Ready for review', 'На проверку'],
  done: ['Complete', 'Готово'],
  skip: ['Not applicable / not selected', 'Не применимо / не выбрано'],
};

export function setupStudio({ root, tr, pick, esc, links, visaGroups, statuses, api, articleCard, url }) {
  const tab = new URLSearchParams(location.search).get('tab') === 'visa' ? 'visa' : 'writing';
  const studioPath = url('/studio/');
  const visaPath = `${studioPath}${studioPath.includes('?') ? '&' : '?'}tab=visa`;
  const signIn = `/signin-with-chatgpt?return_to=${encodeURIComponent(location.pathname + location.search)}`;
  const current = value => value === tab ? ' aria-current="page"' : '';

  const setMessage = (container, message, isError = false) => {
    container.textContent = message;
    container.classList.toggle('error', isError);
  };
  const option = (value, text, selected) => `<option value="${esc(value)}"${value === selected ? ' selected' : ''}>${esc(text)}</option>`;
  const field = (key, label, value, { multiline = false, full = false, type = 'text', max = 180 } = {}) => `<label class="field${full ? ' full' : ''}"><span>${esc(label)}</span>${multiline ? `<textarea name="${key}" maxlength="${max}" rows="${max > 2000 ? 6 : 3}">${esc(value)}</textarea>` : `<input name="${key}" type="${type}" maxlength="${max}" value="${esc(value)}">`}</label>`;
  const saveError = tr('Could not save. Your edits are still in the form.', 'Не удалось сохранить. Введённые данные остались в форме.');

  async function start() {
    const session = await api('session');
    if (!session.owner) {
      root.innerHTML = `<div class="notice"><h2>${tr('Owner sign-in', 'Вход для владельца')}</h2><p>${tr('The editor and checklist are available from the site owner’s ChatGPT account.', 'Редактор и чеклист доступны из аккаунта ChatGPT владельца сайта.')}</p>${session.signedIn ? '' : `<a class="button dark" href="${signIn}" target="_top">${tr('Sign in with ChatGPT', 'Войти через ChatGPT')}</a>`}</div>`;
      return;
    }
    root.innerHTML = `<nav class="studio-nav" aria-label="${tr('Workspace sections', 'Разделы кабинета')}"><a class="button light" href="${studioPath}"${current('writing')}>${tr('Publication editor', 'Редактор публикаций')}</a><a class="button light" href="${visaPath}"${current('visa')}>Global Talent</a></nav><div id="studio-panel"></div>`;
    const panel = root.querySelector('#studio-panel');
    if (tab === 'visa') await checklist(panel);
    else await editor(panel);
  }

  async function editor(panel) {
    let items = await api('studio/articles');
    let editing = null;
    let dirty = false;
    const titleFor = item => tr(item.enTitle || item.ruTitle, item.ruTitle || item.enTitle);

    panel.innerHTML = `<div class="studio-head"><div><h2>${tr('Publication editor', 'Редактор публикаций')}</h2><p>${tr('Save a private draft, or share the text as a preprint, working paper or publication. To add a PDF, link to a copy you have permission to share.', 'Сохраните личный черновик или разместите текст как препринт, рабочую статью или публикацию. Для PDF добавьте ссылку на копию, которой можно делиться.')}</p></div><button type="button" class="button dark" id="add-article">${tr('New article', 'Новая статья')}</button></div><div class="editor"><div class="editor-list" id="editor-list"></div><div id="editor-form"></div></div>`;
    const list = panel.querySelector('#editor-list');
    const container = panel.querySelector('#editor-form');

    function renderList() {
      list.replaceChildren();
      if (!items.length) list.innerHTML = `<p class="small-copy">${tr('Your new entries will appear here.', 'Здесь появятся ваши новые записи.')}</p>`;
      for (const item of items) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'button light';
        if (item.id === editing?.id) button.setAttribute('aria-current', 'true');
        button.innerHTML = `<span>${esc(titleFor(item))}</span><small>${esc(statuses[item.status])}</small>`;
        button.addEventListener('click', () => renderForm(item));
        list.append(button);
      }
    }

    function renderForm(item = null, message = '') {
      if (dirty && !window.confirm(tr('Discard unsaved edits?', 'Отменить несохранённые изменения?'))) return;
      editing = item;
      dirty = false;
      renderList();
      const a = item || {};
      container.innerHTML = `<form class="panel" id="article-form"><div class="fields">
        <label class="field"><span>${tr('Status', 'Статус')}</span><select name="status">${['draft', 'preprint', 'working', 'published'].map(status => option(status, statuses[status], a.status || 'draft')).join('')}</select></label>
        ${field('year', tr('Year', 'Год'), a.year, { max: 4 })}
        ${field('enTitle', tr('Title in English', 'Название на английском'), a.enTitle, { max: 280 })}${field('ruTitle', tr('Title in Russian', 'Название на русском'), a.ruTitle, { max: 280 })}
        ${field('authors', tr('Authors', 'Авторы'), a.authors, { full: true, max: 500 })}
        ${field('venue', tr('Venue or publisher', 'Издание или издатель'), a.venue, { max: 280 })}${field('doi', 'DOI', a.doi, { max: 180 })}
        ${field('url', tr('Link to the article or PDF', 'Ссылка на статью или PDF'), a.url, { type: 'url', full: true, max: 1000 })}
        ${field('enSummary', tr('English summary', 'Аннотация на английском'), a.enSummary, { multiline: true, max: 1500 })}${field('ruSummary', tr('Russian summary', 'Аннотация на русском'), a.ruSummary, { multiline: true, max: 1500 })}
        ${field('enBody', tr('English text', 'Текст на английском'), a.enBody, { multiline: true, max: 32000 })}${field('ruBody', tr('Russian text', 'Текст на русском'), a.ruBody, { multiline: true, max: 32000 })}
      </div><div class="studio-actions"><button class="button dark" type="submit">${tr('Save draft', 'Сохранить черновик')}</button><button class="button light" type="button" id="preview-article">${tr('Preview', 'Предпросмотр')}</button><span class="save-status" role="status">${esc(message)}</span></div></form><div id="studio-preview"></div>`;

      const form = container.querySelector('form');
      const status = form.elements.status;
      const saveButton = form.querySelector('button[type=submit]');
      const feedback = form.querySelector('.save-status');
      const values = () => ({ ...Object.fromEntries(new FormData(form)), ...(a.id ? { id: a.id } : {}) });
      const updateSaveLabel = () => {
        saveButton.textContent = status.value === 'draft' ? tr('Save draft', 'Сохранить черновик') : tr('Save to publications page', 'Сохранить на странице публикаций');
      };
      updateSaveLabel();
      form.addEventListener('input', () => { dirty = true; updateSaveLabel(); });
      form.querySelector('#preview-article').addEventListener('click', () => {
        container.querySelector('#studio-preview').innerHTML = `<div class="panel studio-preview"><p class="eyebrow">${tr('Preview', 'Предпросмотр')}</p>${articleCard(values())}</div>`;
      });
      form.addEventListener('submit', async event => {
        event.preventDefault();
        const record = values();
        if (!record.enTitle.trim() && !record.ruTitle.trim()) {
          setMessage(feedback, tr('Enter a title in at least one language.', 'Укажите название хотя бы на одном языке.'), true);
          form.elements.enTitle.focus();
          return;
        }
        if (record.year && !/^\d{4}$/.test(record.year)) {
          setMessage(feedback, tr('Enter the year as four digits.', 'Укажите год четырьмя цифрами.'), true);
          form.elements.year.focus();
          return;
        }
        saveButton.disabled = true;
        try {
          const saved = await api('studio/articles', { method: 'PUT', body: JSON.stringify(record) });
          items = [saved, ...items.filter(existing => existing.id !== saved.id)];
          dirty = false;
          renderForm(saved, saved.status === 'draft' ? tr('Private draft saved.', 'Личный черновик сохранён.') : tr('Saved to the publications page.', 'Запись сохранена на странице публикаций.'));
          container.querySelector('button[type=submit]').focus();
        } catch { setMessage(feedback, saveError, true); }
        finally { saveButton.disabled = false; }
      });
    }

    panel.querySelector('#add-article').addEventListener('click', () => { if (editing || !dirty) renderForm(); });
    window.addEventListener('beforeunload', event => { if (dirty) event.preventDefault(); });
    renderForm(items[0]);
  }

  async function checklist(panel) {
    const saved = await api('studio/checklist');
    const state = new Map(saved.map(record => [record.id, record]));
    const label = key => tr(...tLabels[key]);
    const count = visaGroups.reduce((total, group) => total + group.tasks.length, 0);
    const evidenceOptions = ['innovation', 'external', 'impact', 'research'];
    const ratings = ['0', '1', '2', '3', '4', '5'];

    const task = ([id, subject, copy]) => {
      const item = state.get(id) || { status: 'notStarted', quality: 0, notes: '', next: '' };
      const canSkip = id === 'business' || evidenceOptions.includes(id);
      return `<details class="visa-item"><summary>${pick(subject)} <span class="status-label">${label(item.status)}</span></summary><form data-check="${id}"><p>${pick(copy)}</p><div class="fields">
        <label class="field"><span>${tr('Status', 'Статус')}</span><select name="status">${Object.keys(tLabels).filter(key => key !== 'skip' || canSkip).map(key => option(key, label(key), item.status)).join('')}</select></label>
        <label class="field"><span>${tr('Evidence strength', 'Сила доказательства')}</span><select name="quality">${ratings.map(key => option(key, key === '0' ? tr('Unrated', 'Без оценки') : `${key}/5`, String(item.quality))).join('')}</select></label>
        ${field('notes', tr('What is ready and where to find it', 'Что готово и где это найти'), item.notes, { multiline: true, max: 4000 })}
        ${field('next', tr('Next action', 'Следующий шаг'), item.next, { multiline: true, max: 1600 })}
        </div><div class="studio-actions"><button type="submit" class="button dark">${tr('Save progress', 'Сохранить прогресс')}</button><span class="save-status" role="status"></span></div></form></details>`;
    };

    panel.innerHTML = `<div class="studio-head"><div><h2>${tr('UK Global Talent checklist', 'Чеклист UK Global Talent')}</h2><p>${tr('Digital technology endorsement. Track the evidence, rate its strength and record the next action for each item.', 'Маршрут digital technology. Отмечайте готовые доказательства, оценивайте их силу и записывайте следующий шаг.')}</p></div></div>
      <div class="panel progress-box"><div><b id="progress-label"></b><p id="progress-support"></p></div><progress id="track-progress" aria-labelledby="progress-label" max="${count}" value="0"></progress></div>
      <div class="notice"><p>${tr('The checklist helps you prepare the endorsement application. Tech Nation assesses whether the evidence meets the criteria. Guidance checked 27 November 2026.', 'Чеклист помогает подготовить заявку на endorsement. Соответствие доказательств критериям оценивает Tech Nation. Источники сверены 27 ноября 2026 года.')}</p><div class="visa-sources">${[[links.eligibility, tr('GOV.UK eligibility', 'GOV.UK: критерии')], [links.evidence, tr('Evidence and letters', 'Доказательства и письма')], [links.rules, tr('Immigration Rules', 'Иммиграционные правила')], [links.technation, 'Tech Nation'], [links.stage2, tr('Stage 2', 'Подача на визу')]].map(([href, text]) => `<a class="text-link" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(text)}</a>`).join('')}</div></div>
      ${visaGroups.map(group => `<section class="visa-group"><h3>${pick(group.name)}</h3>${group.tasks.map(task).join('')}</section>`).join('')}`;

    function updateProgress() {
      const records = Array.from(state.values());
      const done = records.filter(record => record.status === 'done').length;
      const skip = records.filter(record => record.status === 'skip').length;
      const rated = records.filter(record => record.quality > 0 && record.status !== 'skip').length;
      const progress = panel.querySelector('progress');
      progress.max = count - skip;
      progress.value = done;
      panel.querySelector('#progress-label').textContent = tr(`${done} of ${count - skip} complete`, `Готово ${done} из ${count - skip}`);
      panel.querySelector('#progress-support').textContent = tr(`Strength rated for ${rated} · Excluded ${skip}`, `Оценено ${rated} · Исключено ${skip}`);
    }
    updateProgress();

    const dirty = new Set();
    window.addEventListener('beforeunload', event => { if (dirty.size) event.preventDefault(); });
    for (const form of panel.querySelectorAll('[data-check]')) {
      form.addEventListener('input', () => dirty.add(form.dataset.check));
      form.addEventListener('submit', async event => {
        event.preventDefault();
        const id = form.dataset.check;
        const button = form.querySelector('button');
        const feedback = form.querySelector('.save-status');
        button.disabled = true;
        try {
          const record = await api(`studio/checklist/${id}`, { method: 'PUT', body: JSON.stringify(Object.fromEntries(new FormData(form))) });
          state.set(id, record);
          form.closest('details').querySelector('.status-label').textContent = label(record.status);
          setMessage(feedback, tr('Progress saved.', 'Прогресс сохранён.'));
          dirty.delete(id);
          updateProgress();
        } catch { setMessage(feedback, saveError, true); }
        finally { button.disabled = false; }
      });
    }
  }

  start().catch(() => {
    root.innerHTML = `<p class="notice">${tr('The workspace could not load. Refresh this page to try again.', 'Кабинет не загрузился. Обновите страницу, чтобы попробовать ещё раз.')}</p>`;
  });
}
