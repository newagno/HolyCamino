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
   - `sw.js` (кеш статики для офлайну)
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
├── sw.js                 # service worker: кеш JS/CSS/медіа для повторних відвідувань
├── assets/
│   ├── css/main.css
│   ├── files/
│   │   ├── logo.png
│   │   ├── peixe.jpg
│   │   ├── sound_ocean.mp3
│   │   └── sound_storme.mp3
│   └── js/
│       ├── config.js
│       ├── easterEggs.js
│       ├── main.js
│       ├── storage.js
│       ├── ui.js
│       └── utils.js
└── tests/app.test.mjs
```

## Офлайн і кеш

У `assets/js/main.js` викликається `initOfflineCache()`: реєструється `./sw.js`, якщо є `navigator.serviceWorker` і протокол сторінки — **http:** або **https:** (у коді це `location.protocol.startsWith('http')`, тож і `https:` підходить). Локальний сервер і GitHub Pages підходять; відкриття `index.html` через **file://** service worker не активує — кеш офлайну в такому режимі не працює.

Перший візит зазвичай тягне файли з мережі; повторні відвідування можуть отримувати частину статики з кешу SW. Після змін у `assets/**` або `index.html` збільш **`CACHE_NAME`** у `sw.js` (наприклад `camino-v2-static-v8` → `camino-v2-static-v9`), інакше в клієнтів може довше залишатися старий JS/CSS.

## Перевірка

```powershell
node --test tests\app.test.mjs
```

## Пасхалки

- 5 кліків по мушлі в хедері відкривають меми.
- Пароль `сантьяго` вмикає The Way mode.
- Довге натискання на логотип запускає дощ із мушель.
- Секретні команди в маршруті: `botafumeiro`, `fisterra`, `francesinha`, `peixe`.

## UX — ідеї на наступні ітерації

Нижче — не баги, а напрямки після перегляду `ui.js` / `config.js`:

- **Пошук по маршруту** — у `buildNav()` блок з полем `#routeSearch` зараз закоментований; для довгого `ROUTE` варто повернути пошук або фільтр по даті / назві дня.
- **Порожній стан «Бронювання»** — якщо жодне альберге не позначене як заброньоване, `buildBooking()` показує лише заголовок і порожній `booking-list`; корисно додати один рядок-підказку («поки немає підтверджених бронювань у даних маршруту»).
- **Модалка «Мудрість дня»** — закриття по **Escape** і фокус на кнопці «Зрозумів!» після відкриття зроблять поведінку ближчою до звичних діалогів.
- **Довгі списки (чекліст, спорядження)** — закріпити підсумок / прогрес зверху секції при скролі або додати «стрибок до невідміченого» для швидкого сканування.

Buen Camino.
