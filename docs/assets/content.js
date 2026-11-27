export const categories = {
  "all": {
    "en": "All work",
    "ru": "Все работы"
  },
  "analytics": {
    "en": "Analytics",
    "ru": "Аналитика"
  },
  "engineering": {
    "en": "Engineering",
    "ru": "Разработка"
  },
  "research": {
    "en": "Research",
    "ru": "Исследования"
  }
};

export const experience = [
  {
    "name": {
      "en": "T-Bank",
      "ru": "Т-Банк"
    },
    "role": {
      "en": "Backend engineering intern",
      "ru": "Стажёрка backend-разработки"
    },
    "context": {
      "en": "3-month internship",
      "ru": "Стажировка · 3 месяца"
    },
    "text": {
      "en": "Developed Python components for an internal AI agent and wrote automated checks to see whether different user phrasings triggered the intended workflow.",
      "ru": "Дорабатывала Python-компоненты внутреннего AI-агента и писала автоматические проверки, чтобы выяснить, запускают ли разные формулировки запроса нужный сценарий."
    },
    "tags": [
      "Python",
      "Agent evaluation",
      "Git"
    ]
  },
  {
    "name": {
      "en": "Generative models project",
      "ru": "Проект с генеративными моделями"
    },
    "role": {
      "en": "Applied AI",
      "ru": "Прикладной AI"
    },
    "text": {
      "en": "Worked with generative models and evaluated the quality of model outputs.",
      "ru": "Работала с генеративными моделями и оценивала качество их ответов."
    },
    "tags": [
      "Python",
      "Generative AI"
    ]
  },
  {
    "name": {
      "en": "Along",
      "ru": "Алонг"
    },
    "role": {
      "en": "AI agent project",
      "ru": "Проект с AI-агентами"
    },
    "text": {
      "en": "Worked on prompts and agent workflows for data processing and user interactions.",
      "ru": "Работала с промптами и сценариями агентов для обработки данных и взаимодействия с пользователями."
    },
    "tags": [
      "LLM",
      "n8n",
      "JSON"
    ]
  },
  {
    "name": {
      "en": "B-Rain Solutions",
      "ru": "Б-Рейн Солюшенс"
    },
    "role": {
      "en": "Computer vision intern",
      "ru": "Стажёрка Computer Vision"
    },
    "text": {
      "en": "Worked on image classification, segmentation and semantic clustering, using models such as CLIP and SAM.",
      "ru": "Работала с классификацией, сегментацией и семантической кластеризацией изображений, в том числе с CLIP и SAM."
    },
    "tags": [
      "PyTorch",
      "OpenCV",
      "CLIP",
      "SAM"
    ]
  }
];

export const links = {
  "github": "https://github.com/Chehmet",
  "linkedin": "https://www.linkedin.com/in/chulpan-valiullina-071aa3300/",
  "scholar": "https://scholar.google.com/citations?user=DrgQHDQAAAAJ&hl=en",
  "chapter": "https://link.springer.com/chapter/10.1007/978-3-032-23286-1_7"
};

export const projects = [
  {
    "id": "flights",
    "visual": "flights",
    "category": [
      "analytics",
      "engineering"
    ],
    "name": {
      "en": "Flight cancellation analytics",
      "ru": "Аналитика отмен авиарейсов"
    },
    "type": {
      "en": "Team university project",
      "ru": "Командный учебный проект"
    },
    "summary": {
      "en": "Interactive dashboards for exploring when flights were cancelled and why.",
      "ru": "Интерактивные дашборды для анализа причин и времени отмен авиарейсов."
    },
    "detail": {
      "en": "I wrote HiveQL queries, prepared dashboard data and selected time and cancellation-reason breakdowns. The team built the wider ingestion and storage pipeline and used Spark ML for delay prediction.",
      "ru": "Я писала запросы в HiveQL, готовила данные для дашбордов и выбирала срезы по времени и причинам отмен. Команда собрала пайплайн загрузки и хранения данных и использовала Spark ML для прогноза задержек."
    },
    "tools": [
      "HiveQL",
      "Spark ML",
      "Dashboards"
    ],
    "url": "https://github.com/Chehmet/FlightCancellationPrediction"
  },
  {
    "id": "payments",
    "visual": "experiment",
    "category": [
      "analytics"
    ],
    "name": {
      "en": "Payment form A/B study",
      "ru": "A/B-тест формы оплаты"
    },
    "type": {
      "en": "Recruitment case study",
      "ru": "Кейс отбора"
    },
    "summary": {
      "en": "Estimated the conversion lift of a new utility payment form using one outcome per customer.",
      "ru": "Оценила эффект новой формы оплаты ЖКХ. Единицей анализа был клиент, а результатом — хотя бы одна успешная оплата."
    },
    "detail": {
      "en": "Conversion was 65.65% (493/751) in A and 80.40% (603/750) in B, a 14.75 percentage-point difference (95% CI +10.29 to +19.14 pp). I recommended a phased rollout with monitoring for refunds, duplicate charges and support requests, and flagged missing exposure logs.",
      "ru": "Конверсия составила 65,65% (493/751) в A и 80,40% (603/750) в B. Разница — +14,75 п. п. (95% ДИ от +10,29 до +19,14 п. п.). Я предложила поэтапный запуск с контролем возвратов, двойных списаний и обращений в поддержку и отметила отсутствие журнала показа вариантов."
    },
    "tools": [
      "A/B testing",
      "Statistics",
      "Product metrics"
    ]
  },
  {
    "id": "rag",
    "visual": "rag",
    "category": [
      "engineering"
    ],
    "name": {
      "en": "Quran Chat Assistant",
      "ru": "Quran Chat Assistant"
    },
    "type": {
      "en": "Open-source project",
      "ru": "Проект с открытым кодом"
    },
    "summary": {
      "en": "A retrieval-augmented assistant that grounds answers in passages retrieved from an embedding index.",
      "ru": "RAG-ассистент, который ищет фрагменты в индексе эмбеддингов и использует их в ответах."
    },
    "detail": {
      "en": "Haystack and FAISS retrieve passages before generation. The design makes it possible to examine retrieval relevance and whether the answer is supported by the retrieved context as separate checks.",
      "ru": "Поиск в Haystack и FAISS подбирает фрагменты до генерации. Это позволяет отдельно оценивать релевантность найденного контекста и то, насколько ответ на него опирается."
    },
    "tools": [
      "Python",
      "Haystack",
      "FAISS",
      "FastAPI"
    ],
    "url": "https://github.com/Chehmet/Quran_chat_assistant"
  },
  {
    "id": "language",
    "visual": "research",
    "category": [
      "research",
      "analytics"
    ],
    "name": {
      "en": "Measuring linguistic creativity",
      "ru": "Как измерить креативность текста"
    },
    "type": {
      "en": "Springer · AINA 2026",
      "ru": "Springer · AINA 2026"
    },
    "summary": {
      "en": "An NLP framework for comparing eight cognitive-linguistic markers in human and LLM-generated text.",
      "ru": "Подход на базе NLP для сравнения восьми когнитивно-лингвистических маркеров в текстах людей и языковых моделей."
    },
    "detail": {
      "en": "We measured markers such as semantic diversity, metaphoricity and affective valence across several text genres. The published chapter explains the methods and differences observed in the corpus.",
      "ru": "Мы измеряли, например, семантическое разнообразие, метафоричность и эмоциональную окраску в текстах разных жанров. Методы и различия в корпусе описаны в опубликованной главе."
    },
    "tools": [
      "NLP",
      "Statistical analysis",
      "Python"
    ],
    "url": "https://link.springer.com/chapter/10.1007/978-3-032-23286-1_7",
    "source": "Springer"
  },
  {
    "id": "feedback",
    "visual": "feedback",
    "category": [
      "engineering",
      "analytics"
    ],
    "name": {
      "en": "ScoreWorker",
      "ru": "ScoreWorker"
    },
    "type": {
      "en": "ML application",
      "ru": "ML-приложение"
    },
    "summary": {
      "en": "A web app that identifies mentions of 11 soft skills in employee feedback.",
      "ru": "Веб-приложение для поиска упоминаний 11 гибких навыков в отзывах сотрудников."
    },
    "detail": {
      "en": "The ML component classifies mentions of soft skills and helps organise feedback into a summary for review.",
      "ru": "ML-компонент классифицирует упоминания навыков и помогает собрать сводку для дальнейшего разбора."
    },
    "tools": [
      "Django",
      "Transformers",
      "Llama"
    ]
  },
  {
    "id": "alumni",
    "visual": "alumni",
    "category": [
      "engineering"
    ],
    "name": {
      "en": "Innopolis Alumni Portal",
      "ru": "Портал выпускников Иннополиса"
    },
    "type": {
      "en": "Team capstone · 2024",
      "ru": "Командный капстоун · 2024"
    },
    "summary": {
      "en": "Worked as an ML engineer on a university alumni portal featuring an AI chat interface.",
      "ru": "Работала ML-инженером в команде портала выпускников с AI-чатом."
    },
    "detail": {
      "en": "The team’s capstone report describes the Django architecture, project roles and initial work on the AI chat.",
      "ru": "В отчёте команды описаны архитектура на Django, роли участников и первые наработки по AI-чату."
    },
    "tools": [
      "Python",
      "Django",
      "AI chat"
    ],
    "url": "https://capstone.innopolis.university/docs/2024/alumni/week2/",
    "source": {
      "en": "University report",
      "ru": "Отчёт университета"
    }
  }
];

export const publication = {
  "id": "cognitive-linguistic-markers",
  "status": "published",
  "year": "2026",
  "enTitle": "A Quantitative Framework for Profiling Cognitive-Linguistic Markers Across Text Genres",
  "ruTitle": "Количественная оценка когнитивно-лингвистических маркеров в текстах разных жанров",
  "enSummary": "We measured eight markers of linguistic creativity to compare styles across human-written and LLM-generated texts.",
  "ruSummary": "Мы измерили восемь маркеров языковой креативности, чтобы сравнить стили текстов людей и языковых моделей.",
  "authors": "Chulpan Valiullina, Marko Pezer, Manuel Mazzara",
  "venue": "Springer · AINA 2026 · pp. 75–86",
  "url": "https://link.springer.com/chapter/10.1007/978-3-032-23286-1_7",
  "doi": "10.1007/978-3-032-23286-1_7"
};
