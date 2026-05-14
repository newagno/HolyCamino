# CaminoV2

Паломницький веб-додаток для Camino Portugues da Costa: маршрут, спорядження, чекліст, словник, їжа, безпека, плейлист і секретні режими.

## Локальний запуск

Проєкт використовує ES modules, тому відкривати `index.html` подвійним кліком не треба. Запускай через локальний HTTP-сервер:

```powershell
python -m http.server 8080 --bind 127.0.0.1
```

Потім відкрий:

```text
http://127.0.0.1:8080/index.html
```

## Публікація на GitHub Pages

1. Створи public repository на GitHub, наприклад `camino-v2`.
2. Завантаж у репозиторій:
   - `index.html`
   - папку `assets`
   - папку `tests`
   - `README.md`
   - `.gitignore`
3. Відкрий **Settings -> Pages**.
4. У **Build and deployment** вибери:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main`
   - **Folder:** `/root`
5. Натисни **Save**.

Через кілька хвилин сайт буде доступний за адресою:

```text
https://YOUR-USERNAME.github.io/camino-v2/
```

## Структура

```text
CaminoV2/
├── index.html
├── assets/
│   ├── css/main.css
│   ├── files/
│   │   ├── logo.png
│   │   ├── peixe.jpg
│   │   └── sound_ocean.mp3
│   └── js/
│       ├── config.js
│       ├── easterEggs.js
│       ├── main.js
│       ├── storage.js
│       ├── ui.js
│       └── utils.js
└── tests/app.test.mjs
```

## Перевірка

```powershell
node --test tests\app.test.mjs
```

## Пасхалки

- 5 кліків по мушлі в хедері відкривають меми.
- Пароль `сантьяго` вмикає The Way mode.
- Довге натискання на логотип запускає дощ із мушель.
- Секретні команди в маршруті: `botafumeiro`, `fisterra`, `francesinha`, `peixe`.

Buen Camino.
