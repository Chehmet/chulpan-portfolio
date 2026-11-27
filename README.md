# Портфолио Чулпан Валиуллиной

На главной представлены проекты по аналитике, разработке и исследованиям, опыт работы, образование, курсы, студкемпы, хакатоны и сертификат. На странице `/publications/` находится публикация Springer и появляются записи, добавленные через кабинет. Переключатель EN/RU сохраняет текущую страницу.

Войдите через ChatGPT на странице `/studio/` с аккаунтом владельца сайта. Редактор позволяет сохранить черновик, просмотреть его и вывести на страницу публикаций со статусом «Препринт», «Рабочая статья» или «Опубликовано». Для PDF можно добавить ссылку. Чтобы снять запись с витрины, выберите «Личный черновик» и сохраните. Если заполнена одна языковая версия, она будет доступна на обоих языках.

В разделе Global Talent можно записывать прогресс по официальным требованиям к UK Global Talent (Digital Technology). Оценка 1–5 отражает вашу собственную оценку силы доказательства. Отметка «Не выбрано / не применимо» исключает этот пункт из счётчика. Прогресс и черновики сохраняются в базе сайта и доступны владельцу после входа.

Источники фактов о хакатонах — пять дипломов и сертификатов в предоставленном Google Doc «Хакатоны». Для остальных разделов использованы резюме, материалы проектов и первичные публичные страницы Springer и Университета Иннополис.

## Локальный запуск

Нужен Node.js 22 или новее. `npm run build` собирает Worker, `npm run check` проверяет публичные маршруты и доступ к данным, `npm run preview` запускает его на `127.0.0.1:4176`. Локальный вход работает только на этом адресе и использует временную базу в памяти. На Sites авторизация привязана к аккаунту владельца через секрет `PORTFOLIO_OWNER_EMAIL`.

### Обложка

Контурная иллюстрация создана встроенным инструментом ImageGen и сохранена в `site/contours.webp`. Промпт

> Stylized concept, editorial key art for the right-hand panel of a sophisticated AI engineer and data analyst portfolio. Square composition. An arresting sculptural folded topographic surface built from hundreds of tightly spaced fine pale-mint contour lines, twisting into a softly curved valley or saddle, with a few luminous acid-lime points and subtle ghosted orbital lines. Render like a premium scientific data sculpture on deep near-black forest green #0d251f, tactile screenprint grain, precise fine geometry, high contrast, muted emerald shadows, acid green #e4ff55 as very sparse accents. Artwork mostly centered with margin around all sides and breathing room near corners for UI annotations added later. Editorial and organic, no vector UI, no letters, no text, no numbers, no human, no logos, no purple, no white borders.
