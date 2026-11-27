const t = (en, ru) => ({ en, ru });

export const links = {
  github: 'https://github.com/Chehmet',
  linkedin: 'https://www.linkedin.com/in/chulpan-valiullina-071aa3300/',
  scholar: 'https://scholar.google.com/citations?user=DrgQHDQAAAAJ&hl=en',
  chapter: 'https://link.springer.com/chapter/10.1007/978-3-032-23286-1_7',
  gov: 'https://www.gov.uk/global-talent-digital-technology',
  eligibility: 'https://www.gov.uk/global-talent-digital-technology/eligibility',
  evidence: 'https://www.gov.uk/global-talent-digital-technology/documents-you-need-to-apply-endorsement',
  rules: 'https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-global-talent',
  stage2: 'https://www.gov.uk/global-talent',
  technation: 'https://technation.io/global-talent-visa/',
};

export const categories = {
  all: t('All work', 'Все работы'), analytics: t('Analytics', 'Аналитика'),
  engineering: t('Engineering', 'Разработка'), research: t('Research', 'Исследования'),
};

export const projects = [
  {
    id: 'flights', visual: 'flights', category: ['analytics', 'engineering'],
    name: t('Flight cancellation analytics', 'Аналитика отмен авиарейсов'),
    type: t('Team university project', 'Командный учебный проект'),
    summary: t('Interactive dashboards for exploring when flights were cancelled and why.', 'Интерактивные дашборды для анализа причин и времени отмен авиарейсов.'),
    detail: t('I wrote HiveQL queries, prepared dashboard data and selected time and cancellation-reason breakdowns. The team built the wider ingestion and storage pipeline and used Spark ML for delay prediction.', 'Я писала запросы в HiveQL, готовила данные для дашбордов и выбирала срезы по времени и причинам отмен. Команда собрала пайплайн загрузки и хранения данных и использовала Spark ML для прогноза задержек.'),
    tools: ['HiveQL', 'Spark ML', 'Dashboards'], url: 'https://github.com/Chehmet/FlightCancellationPrediction',
  },
  {
    id: 'payments', visual: 'experiment', category: ['analytics'],
    name: t('Payment form A/B study', 'A/B-тест формы оплаты'),
    type: t('Recruitment case study', 'Кейс отбора'),
    summary: t('Estimated the conversion lift of a new utility payment form using one outcome per customer.', 'Оценила эффект новой формы оплаты ЖКХ. Единицей анализа был клиент, а результатом — хотя бы одна успешная оплата.'),
    detail: t('Conversion was 65.65% (493/751) in A and 80.40% (603/750) in B, a 14.75 percentage-point difference (95% CI +10.29 to +19.14 pp). I recommended a phased rollout with monitoring for refunds, duplicate charges and support requests, and flagged missing exposure logs.', 'Конверсия составила 65,65% (493/751) в A и 80,40% (603/750) в B. Разница — +14,75 п. п. (95% ДИ от +10,29 до +19,14 п. п.). Я предложила поэтапный запуск с контролем возвратов, двойных списаний и обращений в поддержку и отметила отсутствие журнала показа вариантов.'),
    tools: ['A/B testing', 'Statistics', 'Product metrics'],
  },
  {
    id: 'rag', visual: 'rag', category: ['engineering'],
    name: t('Quran Chat Assistant', 'Quran Chat Assistant'),
    type: t('Open-source project', 'Проект с открытым кодом'),
    summary: t('A retrieval-augmented assistant that grounds answers in passages retrieved from an embedding index.', 'RAG-ассистент, который ищет фрагменты в индексе эмбеддингов и использует их в ответах.'),
    detail: t('Haystack and FAISS retrieve passages before generation. The design makes it possible to examine retrieval relevance and whether the answer is supported by the retrieved context as separate checks.', 'Поиск в Haystack и FAISS подбирает фрагменты до генерации. Это позволяет отдельно оценивать релевантность найденного контекста и то, насколько ответ на него опирается.'),
    tools: ['Python', 'Haystack', 'FAISS', 'FastAPI'], url: 'https://github.com/Chehmet/Quran_chat_assistant',
  },
  {
    id: 'language', visual: 'research', category: ['research', 'analytics'],
    name: t('Measuring linguistic creativity', 'Как измерить креативность текста'),
    type: t('Springer · AINA 2026', 'Springer · AINA 2026'),
    summary: t('An NLP framework for comparing eight cognitive-linguistic markers in human and LLM-generated text.', 'Подход на базе NLP для сравнения восьми когнитивно-лингвистических маркеров в текстах людей и языковых моделей.'),
    detail: t('We measured markers such as semantic diversity, metaphoricity and affective valence across several text genres. The published chapter explains the methods and differences observed in the corpus.', 'Мы измеряли, например, семантическое разнообразие, метафоричность и эмоциональную окраску в текстах разных жанров. Методы и различия в корпусе описаны в опубликованной главе.'),
    tools: ['NLP', 'Statistical analysis', 'Python'], url: links.chapter, source: 'Springer',
  },
  {
    id: 'feedback', visual: 'feedback', category: ['engineering', 'analytics'],
    name: t('ScoreWorker', 'ScoreWorker'),
    type: t('ML application', 'ML-приложение'),
    summary: t('A web app that identifies mentions of 11 soft skills in employee feedback.', 'Веб-приложение для поиска упоминаний 11 гибких навыков в отзывах сотрудников.'),
    detail: t('The ML component classifies mentions of soft skills and helps organise feedback into a summary for review.', 'ML-компонент классифицирует упоминания навыков и помогает собрать сводку для дальнейшего разбора.'),
    tools: ['Django', 'Transformers', 'Llama'],
  },
  {
    id: 'alumni', visual: 'alumni', category: ['engineering'],
    name: t('Innopolis Alumni Portal', 'Портал выпускников Иннополиса'),
    type: t('Team capstone · 2024', 'Командный капстоун · 2024'),
    summary: t('Worked as an ML engineer on a university alumni portal featuring an AI chat interface.', 'Работала ML-инженером в команде портала выпускников с AI-чатом.'),
    detail: t('The team’s capstone report describes the Django architecture, project roles and initial work on the AI chat.', 'В отчёте команды описаны архитектура на Django, роли участников и первые наработки по AI-чату.'),
    tools: ['Python', 'Django', 'AI chat'], url: 'https://capstone.innopolis.university/docs/2024/alumni/week2/', source: t('University report', 'Отчёт университета'),
  },
];

export const experience = [
  { name: t('T-Bank', 'Т-Банк'), role: t('Backend engineering intern', 'Стажёрка backend-разработки'), context: t('3-month internship', 'Стажировка · 3 месяца'), text: t('Developed Python components for an internal AI agent and wrote automated checks to see whether different user phrasings triggered the intended workflow.', 'Дорабатывала Python-компоненты внутреннего AI-агента и писала автоматические проверки, чтобы выяснить, запускают ли разные формулировки запроса нужный сценарий.'), tags: ['Python', 'Agent evaluation', 'Git'] },
  { name: t('Generative models project', 'Проект с генеративными моделями'), role: t('Applied AI', 'Прикладной AI'), text: t('Worked with generative models and evaluated the quality of model outputs.', 'Работала с генеративными моделями и оценивала качество их ответов.'), tags: ['Python', 'Generative AI'] },
  { name: t('Along', 'Алонг'), role: t('AI agent project', 'Проект с AI-агентами'), text: t('Worked on prompts and agent workflows for data processing and user interactions.', 'Работала с промптами и сценариями агентов для обработки данных и взаимодействия с пользователями.'), tags: ['LLM', 'n8n', 'JSON'] },
  { name: t('B-Rain Solutions', 'Б-Рейн Солюшенс'), role: t('Computer vision intern', 'Стажёрка Computer Vision'), text: t('Worked on image classification, segmentation and semantic clustering, using models such as CLIP and SAM.', 'Работала с классификацией, сегментацией и семантической кластеризацией изображений, в том числе с CLIP и SAM.'), tags: ['PyTorch', 'OpenCV', 'CLIP', 'SAM'] },
];

export const publication = {
  id: 'cognitive-linguistic-markers', status: 'published', year: '2026',
  enTitle: 'A Quantitative Framework for Profiling Cognitive-Linguistic Markers Across Text Genres',
  ruTitle: 'Количественная оценка когнитивно-лингвистических маркеров в текстах разных жанров',
  enSummary: 'We measured eight markers of linguistic creativity to compare styles across human-written and LLM-generated texts.',
  ruSummary: 'Мы измерили восемь маркеров языковой креативности, чтобы сравнить стили текстов людей и языковых моделей.',
  authors: 'Chulpan Valiullina, Marko Pezer, Manuel Mazzara',
  venue: 'Springer · AINA 2026 · pp. 75–86', url: links.chapter,
  doi: '10.1007/978-3-032-23286-1_7',
};

export const visaGroups = [
  { name: t('Route and recognition', 'Маршрут и признание'), tasks: [
    ['route', t('Choose the route and profile', 'Выбрать маршрут и профиль'), t('Compare Exceptional Promise and Exceptional Talent and assess the technical or business profile. Promise is a starting point to investigate if you are early in your tech career.', 'Сравните Exceptional Promise и Exceptional Talent, затем оцените технический или бизнес-профиль. На раннем этапе карьеры можно начать с изучения Exceptional Promise.')],
    ['recognition', t('Show recognition in the past five years', 'Собрать подтверждения признания за последние пять лет'), t('Plan at least two distinct pieces of evidence. For the Invian hackathon’s third-place diploma, collect the official results, competition scope and evidence of your individual contribution. Check whether each piece independently supports recognition.', 'Запланируйте минимум два разных доказательства. К диплому за 3-е место на хакатоне «Инвиан» подберите официальные результаты, сведения о масштабе конкурса и подтверждение личного вклада. Проверьте, показывает ли каждый документ признание в отрасли.')],
  ] },
  { name: t('Optional criteria', 'Критерии на выбор'), tasks: [
    ['innovation', t('Innovation', 'Инновации'), t('If selected, document a novel product or contribution in a new digital field and independently substantiate your role. Prepare two distinct items.', 'Если выберете этот критерий, покажите инновационный продукт или вклад в новую цифровую область и независимо подтвердите свою роль. Подготовьте два разных доказательства.')],
    ['external', t('Contribution outside work', 'Вклад вне основной работы'), t('If selected, collect two records, such as documented open-source adoption or peer recognition for sustained work.', 'Если выберете этот критерий, соберите два подтверждения. Например, сведения об использовании открытого проекта или признание коллегами длительного вклада.')],
    ['impact', t('Contribution to a product-led technology company', 'Вклад в продуктовую технологическую компанию'), t('If selected, gather two pieces that show your individual contribution and impact. Check if you can cite approved and attributable evidence from your T-Bank internship.', 'Если выберете этот критерий, соберите два подтверждения личного вклада и результата. Уточните, какие материалы по стажировке в Т-Банке разрешено раскрывать и можно ли подтвердить вашу роль.')],
    ['research', t('Academic contribution', 'Вклад в исследования'), t('If selected, start with the Springer chapter and seek separate evidence of your own contribution or relevant expert recognition. Two pieces are required for a selected criterion.', 'Если выберете этот критерий, начните с главы Springer. Подберите отдельное подтверждение личного вклада или признания профильным экспертом. Для выбранного критерия нужны два доказательства.')],
  ] },
  { name: t('Endorsement documents', 'Документы для endorsement'), tasks: [
    ['cv', t('Prepare career and publication CV', 'Подготовить CV с опытом и публикациями'), t('Up to three A4 sides. Reconcile employer names, dates, roles and findings, and add the Springer citation.', 'До трёх страниц A4. Сверьте названия работодателей, сроки, роли и результаты. Добавьте ссылку на публикацию Springer.')],
    ['referees', t('Obtain three recommendation letters', 'Получить три рекомендательных письма'), t('Use three established digital-tech experts who have known your work for at least 12 months. Give each distinct examples. Check dates, signatures, contacts, credentials and the three-side limit per letter.', 'Нужны три признанных эксперта в digital tech, знакомых с вашей работой минимум 12 месяцев. Подберите разные примеры для каждого. Проверьте даты, подписи, контакты, квалификацию авторов и лимит в три страницы на письмо.')],
    ['uk', t('Explain planned UK contribution', 'Описать будущий вклад в Великобритании'), t('Describe plans for digital technology work in the UK and give referees enough detail to explain your expected contribution.', 'Опишите планы работы в британском digital tech и дайте рекомендателям конкретику, чтобы они могли объяснить ожидаемый вклад.')],
    ['business', t('Check founder or senior executive evidence', 'Проверить требования для основателей и руководителей'), t('If you held a relevant founder or senior executive role in the last five years, collect proof of the connection. Otherwise mark this item as not applicable.', 'Если за последние пять лет вы были основателем или топ-руководителем технологической компании, соберите подтверждение. В остальных случаях отметьте «Не применимо».')],
    ['bundle', t('Audit the evidence bundle', 'Проверить комплект доказательств'), t('Choose two optional criteria and allocate two distinct pieces to each, plus two for recognition. Maximum 10 evidence documents, up to three A4 sides each. One document can support only one criterion. CV and letters sit outside the limit.', 'Выберите два дополнительных критерия, выделите по два разных доказательства на каждый и ещё два на признание. Максимум 10 документов до трёх страниц А4 каждый. Один документ относится к одному критерию. CV и письма идут отдельно.')],
  ] },
  { name: t('Submission', 'Подача'), tasks: [
    ['endorsement', t('Submit the endorsement application', 'Подать заявку на endorsement'), t('Recheck the current guidance, translations and submission instructions. The Home Office forwards digital technology endorsement applications to Tech Nation.', 'Перед подачей сверьте актуальные правила, требования к переводам и порядок подачи. Home Office передаёт заявки по digital technology в Tech Nation.')],
    ['visa', t('Complete the visa application', 'Подать заявление на визу'), t('If applying after endorsement, submit Stage 2 within three months of the endorsement letter. Check the form and document list for your situation on GOV.UK.', 'Если подаёте после endorsement, отправьте заявление на визу в течение трёх месяцев с даты письма. Проверьте актуальную форму и перечень документов для вашей ситуации на GOV.UK.')],
  ] },
];
