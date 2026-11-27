export function setupPublicationEditor({ root, tr, esc, statuses, api, articleCard }) {
  const pages = 'portfolio';
  const setMessage = (container, message, isError = false) => {
    container.textContent = message;
    container.classList.toggle('error', isError);
  };
  const option = (value, text, selected) => `<option value="${esc(value)}"${value === selected ? ' selected' : ''}>${esc(text)}</option>`;
  const field = (key, label, value, { multiline = false, full = false, type = 'text', max = 180 } = {}) => `<label class="field${full ? ' full' : ''}"><span>${esc(label)}</span>${multiline ? `<textarea name="${key}" maxlength="${max}" rows="${max > 2000 ? 6 : 3}">${esc(value)}</textarea>` : `<input name="${key}" type="${type}" maxlength="${max}" value="${esc(value)}">`}</label>`;
  const saveError = tr('Could not save. Your edits are still in the form.', 'Не удалось сохранить. Введённые данные остались в форме.');

  async function editor(panel) {
    let items = await api('studio/articles');
    let editing = null;
    let dirty = false;
    const titleFor = item => tr(item.enTitle || item.ruTitle, item.ruTitle || item.enTitle);

    const exportPanel = pages === 'portfolio' ? `<div class="panel editor-export"><p>${tr('Drafts and edits are saved in this browser. To update the public site, download publications-data.json and replace the file of the same name in the GitHub Pages publishing folder, for example docs/. The download includes only entries marked Preprint, Working paper or Published.', 'Черновики и правки сохраняются в этом браузере. Чтобы обновить сайт, скачайте publications-data.json и замените одноимённый файл в папке публикации GitHub Pages, например docs/. В выгрузку попадут записи со статусом «Препринт», «Рабочая статья» или «Опубликовано».')}</p><div class="studio-actions"><button class="button dark" type="button" id="export-publications">${tr('Download publications-data.json', 'Скачать publications-data.json')}</button><span class="save-status" id="export-status" role="status"></span></div></div>` : '';
    panel.innerHTML = `${exportPanel}<div class="studio-head"><div><h2>${pages ? tr('Your articles', 'Ваши статьи') : tr('Publication editor', 'Редактор публикаций')}</h2><p>${tr('Save a private draft, or share the text as a preprint, working paper or publication. To add a PDF, link to a copy you have permission to share.', 'Сохраните личный черновик или разместите текст как препринт, рабочую статью или публикацию. Для PDF добавьте ссылку на копию, которой можно делиться.')}</p></div><button type="button" class="button dark" id="add-article">${tr('New article', 'Новая статья')}</button></div><div class="editor"><div class="editor-list" id="editor-list"></div><div id="editor-form"></div></div>`;
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
        saveButton.textContent = status.value === 'draft' ? tr('Save draft', 'Сохранить черновик') : pages ? tr('Save for export', 'Сохранить для выгрузки') : tr('Save to publications page', 'Сохранить на странице публикаций');
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
          const savedMessage = pages ? tr('Saved to this browser and ready to export.', 'Сохранено в браузере и готово к выгрузке.') : tr('Saved to the publications page.', 'Запись сохранена на странице публикаций.');
          renderForm(saved, saved.status === 'draft' ? tr('Private draft saved.', 'Личный черновик сохранён.') : savedMessage);
          container.querySelector('button[type=submit]').focus();
        } catch { setMessage(feedback, saveError, true); }
        finally { saveButton.disabled = false; }
      });
    }

    panel.querySelector('#add-article').addEventListener('click', () => { if (editing || !dirty) renderForm(); });
    panel.querySelector('#export-publications')?.addEventListener('click', async () => {
      const feedback = panel.querySelector('#export-status');
      if (dirty) {
        setMessage(feedback, tr('Save your current changes before downloading.', 'Сначала сохраните изменения в форме.'), true);
        return;
      }
      try {
        await api('studio/export-publications');
        setMessage(feedback, tr('Exported entries selected for publication.', 'Выгружены записи, выбранные для публикации.'));
      } catch { setMessage(feedback, tr('The download could not be created.', 'Не удалось подготовить выгрузку.'), true); }
    });
    window.addEventListener('beforeunload', event => { if (dirty) event.preventDefault(); });
    renderForm(items[0]);
  }

  editor(root).catch(() => {
    root.innerHTML = `<p class="notice">${tr('The publication editor could not load. Refresh this page to try again.', 'Редактор публикаций не загрузился. Обновите страницу, чтобы попробовать ещё раз.')}</p>`;
  });
}
