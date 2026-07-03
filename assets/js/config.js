/**
 * @fileoverview config.js — All application data and constants.
 * Single source of truth. No logic here, only pure data structures.
 *
 * @module config
 */

// ─────────────────────────────────────────────
// TRIP METADATA
// ─────────────────────────────────────────────

/** @type {Date} Flight departure datetime */
export const TRIP_START = new Date('2026-07-11T16:25:00');

// ─────────────────────────────────────────────
// PILGRIMS
// ─────────────────────────────────────────────

/**
 * @typedef {Object} GearItem
 * @property {string} name
 * @property {string} [model]
 * @property {string} [comment]
 * @property {string} [link]
 * @property {string} category
 */

/**
 * @typedef {Object} Pilgrim
 * @property {string} name
 * @property {string} initial
 * @property {string} password
 * @property {string} hint
 */

/** @type {Record<string, Pilgrim>} */
export const PILGRIMS = {
  mykola: {
    name: 'Микола', initial: 'М', password: 'тьоте',
    hint: 'Скажи … (кому?)'
  },
  guest: {
    name: 'Гість', initial: 'Г', password: '',
    hint: ''
  },
  oleksa: {
    name: 'Олекса', initial: 'О', password: 'устурой',
    hint: 'Ти хотіла б, щоб тебя так називали (часник)'
  },
  hanna: {
    name: 'Ганна', initial: 'Г', password: 'пес',
    hint: 'Ти часто так називаєш Євгена, коли вона показує щось дуже класне (пес)'
  },
  yevhen: {
    name: 'Євген', initial: 'Є', password: '665',
    hint: 'цифри'
  },
};

export const EXERCISES = {
  before: [
    {
      n: 'Ходьба з рюкзаком — головне тренування',
      dur: '5-6 разів/тиждень • 60-90 хв',
      comic: '"Чим більше зараз — тим менше боліть потім"',
      fig: 'walking',
      steps: [
        'Починай з 5 кг у рюкзаку, поступово до 8 кг (ціль на Камінó)',
        'Тиждень 1: 5-7 км/день у спокійному темпі',
        'Тиждень 2-3: 10-12 км/день',
        'Тиждень 4-6: 15-20 км/день — базовий темп Камінó',
        'Останній тиждень: 2 рази 25 км з рюкзаком — тест витривалості',
        "ОБОВ'ЯЗКОВО у тих кросівках, у яких ідеш на Камінó!",
      ],
    },
    {
      n: 'Силові для ніг',
      dur: '3 рази/тиждень • 20-30 хв',
      comic: '"Сильні ноги = щасливе Камінó"',
      fig: 'squat',
      steps: [
        'Присідання: 3×15',
        'Випади вперед: 3×12 на кожну ногу',
        'Випади назад: 3×12 на кожну ногу',
        'Підйоми на носки: 3×20 (для литок)',
        'Планка: 3×30-60 сек',
        'Місток для сідниць: 3×15',
      ],
    },
    {
      n: 'Розтяжка (щодня!)',
      dur: 'Щодня • 15-20 хв',
      comic: '"Гнучкі м\'язи = мало пухирів"',
      fig: 'stretch',
      steps: [
        'Литки: стопу на стіну, нога пряма, 30 сек × 3',
        'Задня поверхня стегна (hamstring): сядь, пряма нога витягнута вперед, тягнись до носка — відчуєш натяг ЗЗАДУ стегна — 30 сек × 3',
        'Передня поверхня стегна (квадрицепс): стоячи, підтягни п\'ятку рукою до сідниць — відчуєш натяг СПЕРЕДУ стегна — 30 сек × кожну',
        'Стопа: котити тенісний м\'яч під стопою 2 хв (plantar fasciitis!)',
        'Нижня спина: лежачи, подтягнути коліна до грудей 30 сек',
        'Шия: повільні кругові рухи 5+5',
      ],
    },
    {
      n: 'Тренування стоп',
      dur: 'Щодня • 5 хв',
      comic: '"Готова стопа = щаслива стопа"',
      fig: 'feet',
      steps: [
        'Розтирати лосьйоном з евкаліптом щовечора',
        'Ходити босоніж по траві/гравію 5 хв/день',
        'Тримати стопи сухими — міняти шкарпетки якщо вологі',
        'Розношувати кросівки мінімум 50-100 км до Камінó',
        'Обрізати нігті коротко за тиждень до старту',
        'Vaseline на місця ризику перед прогулянками',
      ],
    },
  ],
  during: [
    {
      n: 'Ранкова розминка (перед стартом)',
      dur: 'Щодня • 10 хв',
      comic: '"М\'язи ще сонні? Збуди їх!"',
      fig: 'morning',
      steps: [
        'Кругові рухи плечима: 10 вперед + 10 назад',
        'Нахили шиї: 5 у кожну сторону',
        'Кругові рухи поясом: 10 в одну + 10 в іншу',
        'Підйоми на носки: 20 разів',
        'Махи ногами: 10 кожною (підняти коліно, опустити)',
        'Розкочати голеностопи: 10 кругових кожним',
        '20 swift кроків на місці для тепла',
        'Глибокий вдих-видих × 3 рази',
      ],
    },
    {
      n: 'Вечірня розтяжка',
      dur: 'Щодня • 15 хв',
      comic: '"Сьогодні розтягнусь — завтра не болітиме"',
      fig: 'evening',
      steps: [
        "Литки: піднятись на сходинку, опустити п'ятку нижче — 30 сек × 3",
        'Задня поверхня стегна (hamstring): постав ногу на лавку або бордюр, нахились корпусом вперед — натяг ззаду — 30 сек × кожну',
        "Передня поверхня стегна (квадрицепс): притягни п'ятку рукою до сідниць — натяг спереду стегна — 30 сек × кожну",
        "Стопи: тенісний м'яч 2 хв кожну",
        'IT-band: хрест-навхрест нахил у бік — 30 сек',
        'Нижня спина: лежачи, коліна до грудей — 60 сек',
      ],
    },
    {
      n: "Догляд за стопами (обов'язково щовечора)",
      dur: 'Щодня • 10 хв',
      comic: '"Стопи — єдиний транспорт. Шануй їх!"',
      fig: 'feetcare',
      steps: [
        'Зняти кросівки одразу як прийшов в альберге — провітрити',
        'Помити ноги теплою водою з милом',
        'Ретельно витерти, особливо між пальцями',
        'Перевірити на "гарячі точки" — червоні плями = майбутні пухирі!',
        'Гаряча точка → Leukotape або Compeed ПРОФІЛАКТИЧНО',
        'Пухир: стерильна голка → збоку → нитка (дренаж) → Compeed зверху',
        "Помасажувати 5 хв: склепіння, п'ятку, пальці",
        "Підняти ноги вище серця 10 хв — зняти набряк",
      ],
    },
    {
      n: 'Відпочинок кожні 1.5-1.5 год',
      dur: 'За потреби • 5 хв',
      comic: '"Втомився? Зупинись на 5 хв!"',
      fig: 'rest',
      steps: [
        'Зупинка 5-10 хв кожні 1-1.5 год — це не слабкість!',
        'Зняти кросівки, провітрити стопи',
        '300-500 мл води + електроліт (SaltStick або Hydralyte)',
        'Перекус: банан, фініки, горіхи',
        'Литки і стегна розтягнути по 30 сек',
        "Масаж плечей і шиї 10 кругових рухів",
        "Якщо є можливість — ноги на стіну/дерево 2 хв",
      ],
    },
  ],
  mindset: [
    {
      n: '🧠 Психологія шляху',
      dur: 'Постійно',
      comic: '"Головний принцип: Фініш робиться стабільністю, а не геройством. Слухай тіло, а не его."',
      fig: 'mind',
      steps: [
        'Дроби дистанцію: Замість «30 км» бач «10 + 10 + 10». Малі цілі не лякають мозок.',
        'Точка кризи (22–25 км): Коли хочеться все кинути — це просто гормональний спад. Не думай про фініш, думай про наступні 3 км.'
      ],
    },
    {
      n: '🏃‍♂️ Фізика руху',
      dur: 'Кожен крок',
      comic: '"Втому треба випереджати, а не наздоганяти."',
      fig: 'physics',
      steps: [
        'Ритм 50/10: 50 хвилин ідеш, 10 відпочиваєш.',
        'Правило 70%: Твій темп — це коли ти можеш вільно розмовляти. Жодних спринтів.',
        'Повільний старт: Перші 7 км іди повільніше, ніж хочеться. Це твій інвестиційний фонд сили на вечір.'
      ],
    },
    {
      n: '🔋 Ресурс і догляд',
      dur: 'Протягом дня',
      comic: '"Слухай тіло, а не его."',
      fig: 'resource',
      steps: [
        'Гідратація: Пий кожні 20 хвилин. Втома — це часто приховане зневоднення.',
        'Харчування: Перекус кожні 90 хвилин (банан, горіхи). Їж до того, як відчуєш голод.',
        'Чек-ап ніг (15–20 км): Обов\'язкова зупинка. Перевір шкарпетки, підсуши шкіру, наклей пластир до появи мозолів.'
      ],
    },
    {
      n: '☀️ Літній режим ходьби (Липень)',
      dur: 'Щодня',
      comic: '"Хто рано встає, той не згорить на сонці"',
      fig: 'sun',
      steps: [
        'Золотий час у липні: старт о 06:00.',
        'Мета — пройти 15 км до 12:00, щоб уникнути пікової спеки.',
        'Після 12:00 температура стрімко росте, тінь зникає — бережіть сили.'
      ]
    },
    {
      n: '🐚 Каміно: Як дійти і не зламатись',
      dur: 'Загальне',
      comic: '"Коротка інструкція з виживання на довгій дистанції"',
      fig: 'walking',
      steps: [
        'Фініш робиться стабільністю, а не геройством.',
        'Слухай тіло, а не его.'
      ]
    }
  ],
};

// ─────────────────────────────────────────────
// APPS
// ─────────────────────────────────────────────

/**
 * @typedef {Object} App
 * @property {string} n   - Name
 * @property {string} d   - Description
 * @property {string} i   - Emoji icon
 * @property {string} [ios]
 * @property {string} [and]
 * @property {string} [web]
 */

/** @type {App[]} */
export const APPS = [
  { n: 'Buen Camino', d: 'Офлайн карти, етапи, альберге', i: 'shell', img: 'assets/files/BuenCaminoApp.jpg', ios: 'https://apps.apple.com/us/app/buen-camino-de-santiago-app/id858222947', and: 'https://play.google.com/store/apps/details?id=com.editorialbuencamino.buencamino' },
  { n: 'Camino Ninja', d: 'Детальні карти і альберге', i: 'ninja', img: 'assets/files/CaminoNinjaApp.jpg', ios: 'https://apps.apple.com/us/app/camino-ninja-app/id1491232190', and: 'https://play.google.com/store/apps/details?id=ninja.camino.app' },
  { n: 'Wise Pilgrim Portugués', d: '€6 — найдетальніші карти PT маршруту', i: 'pin', img: 'assets/files/WisePilgrimApp.jpg', ios: 'https://apps.apple.com/ua/app/wise-pilgrim-camino-portugu%C3%A9s/id983056779', and: 'https://play.google.com/store/apps/details?id=com.wisepilgrim.portuguese' },
  { n: 'Komoot', d: 'GPS трекінг, офлайн маршрути', i: 'map', img: 'assets/files/KomootApp.jpg', ios: 'https://apps.apple.com/us/app/komoot-hike-bike-run/id447374873', and: 'https://play.google.com/store/apps/details?id=de.komoot.android' },
  { n: 'Google Translate', d: 'Завантажити офлайн пакети PT + ES!', i: 'globe', img: 'assets/files/GoogleTranslateApp.jpg', ios: 'https://apps.apple.com/us/app/google-translate/id414706506', and: 'https://play.google.com/store/apps/details?id=com.google.android.apps.translate' },
  { n: 'Maps.me', d: 'Офлайн карти всього маршруту', i: 'pin', img: 'assets/files/MapsMeApp.jpg', ios: 'https://apps.apple.com/us/app/maps-me-offline-maps-gps-nav/id510623322', and: 'https://play.google.com/store/apps/details?id=com.mapswithme.maps.pro' },
  { n: 'ALSA автобуси', d: 'Іспанські автобуси — бронювати заздалезідь', i: 'bus', img: 'assets/files/AlsaApp.jpg', ios: 'https://apps.apple.com/us/app/alsa-buy-coach-tickets/id444511709', and: 'https://play.google.com/store/apps/details?id=com.mo2o.alsa&hl=uk' },
  { n: 'AlertCops', d: "Прямий зв'язок з іспанською поліцією", i: 'sos', img: 'assets/files/AlertCopsApp.jpg', ios: 'https://apps.apple.com/us/app/alertcops/id1273718252', and: 'https://play.google.com/store/search?q=AlertCops&c=apps' },
  { n: 'Geocaching', d: 'Схованки на маршруті — квест для Олекси', i: 'target', img: 'assets/files/GeocachingApp.jpg', ios: 'https://apps.apple.com/us/iphone/search?term=Geocaching', and: 'https://play.google.com/store/apps/details?id=com.groundspeak.geocaching.intro' },
];

// ─────────────────────────────────────────────
// CHECKLIST
// ─────────────────────────────────────────────

/**
 * @typedef {Object} CheckItem
 * @property {string} t  - Task title
 * @property {string} d  - Detail
 * @property {'critical'|'important'|'nice'} u  - Urgency
 */

/**
 * @typedef {Object} CheckCategory
 * @property {string} cat
 * @property {string} sub
 * @property {CheckItem[]} items
 */

/** @type {CheckCategory[]} */
export const CHECKLIST = [
  {
    cat: 'Поки не пізно', sub: 'критично',
    items: [
      { t: '🔴 Квитки Ганни з Стамбула 11.07', d: 'Wizz Air до Порту, прибуття 18:45. Чи куплено?', u: 'critical' },
      { t: '🔴 Забронювати готель у Порту 11-12.07', d: 'Best Guest Porto Hostel — 2 ночі одна альберге', u: 'critical' },
      { t: '🔴 Albergue Seminario Menor Santiago 23-24.07', d: 'Бронювати ТІЛЬКИ через albergueseminario.com (НЕ Booking!)', u: 'critical' },
      { t: '🔴 Пором Caminha → A Guarda 17.07', d: 'xacobeotransfer.com або WhatsApp +34 613 011 226. Бронювати!', u: 'critical' },
      { t: '🔴 Тур TOXO TRAVEL (Fisterra) на 24.07', d: 'Забронювати за 5 днів до поїздки (до 19.07)', u: 'critical' },
      { t: '🔴 ALSA автобус Santiago → OPO 25.07', d: 'alsa.com. €25/паломника, ~3 год. За 1-2 місяці!', u: 'critical' },
      { t: '🔴 Кросівки трейлові Ганні — купити і розношувати!', d: 'Hoka Speedgoat 5 або Quechua FH500. Мінімум 50-100 км!', u: 'critical' },
      { t: '🔴 Перевірити паспорти всіх 4-х', d: '6+ місяців до закінчення', u: 'critical' },
      { t: '🔴 Страховка EHIC + комерційна', d: 'World Nomads / IATI / SafetyWing — покриття Camino пішки', u: 'critical' },
    ],
  },
  {
    cat: 'Спорядження', sub: 'Decathlon',
    items: [
      { t: '🟡 Дощовик-пончо 3 паломникам', d: 'Decathlon Forclaz €15. Миколі, Ганні, Олексі', u: 'important' },
      { t: '🟡 Фліска 4 паломникам', d: 'Decathlon Forclaz MT100 €15-20. Ночі 12-14°C у Сантьяго', u: 'important' },
      { t: '🟡 Налобний ліхтарик 4 паломникам', d: 'Petzl Tikkina €15-25. Старт о 6:00 у темряві', u: 'important' },
      { t: '🟡 Silk liner-и для альберге', d: 'Cocoon Silk €25. У липні без спальника', u: 'important' },
      { t: '🟡 Шкарпетки мерінос ×3 пари кожному', d: 'Smartwool PhD або Darn Tough — захист #1 від пухирів', u: 'important' },
      { t: '🟡 Замовити палиці в Decathlon Norteshopping Порту (Click & Collect)', d: 'MT500 (Миколі, Євгену), MT100 Comfort (Ганні), MT100 Junior (Олексі)', u: 'important' },
      { t: '🔴 Навісний замок (кодовий, малий)', d: 'Критично! Більшість альберге мають шафки, без замка не заселять або не зможете убезпечити речі.', u: 'critical' },
      { t: '🟡 Аптечка', d: 'Compeed, Leukotape P, Vaseline, Ibuprofen, Німесил, Voltaren Gel, голка стерильна', u: 'important' },
    ],
  },
  {
    cat: 'Цифровий старт', sub: 'до вильоту',
    items: [
      { t: '🟢 eSIM Airalo Eurolink', d: 'PT+ES в одній. ~$13 за 10GB. Активувати при приземленні', u: 'nice' },
      { t: '🟢 Додатки на телефони', d: 'Buen Camino, Camino Ninja, Wise Pilgrim, Komoot, Google Translate (офлайн PT+ES)', u: 'nice' },
      { t: '🟢 Офлайн карти Google Maps', d: 'Завантажити весь маршрут Porto → Santiago', u: 'nice' },
      { t: '🟢 Плейлист "Камінó 2026"', d: 'Madredeus, Carlos Núñez, Luar na Lubre', u: 'nice' },
    ],
  },
  {
    cat: 'Фізична підготовка', sub: 'тренування',
    items: [
      { t: '🟡 Тренування 15-20 км/день з рюкзаком', d: 'Перевірити витривалість. Починати вже зараз!', u: 'important' },
      { t: '🟡 Розношувати кросівки 50-100 км', d: 'Найголовніше для уникнення пухирів', u: 'important' },
      { t: '🟢 Розтяжка щодня 15 хв', d: 'Литки, стегна, спина — після тренувань', u: 'nice' },
    ],
  },
  {
    cat: 'Дух Камінó', sub: 'приємне',
    items: [
      { t: '🟢 Подивитись "The Way" (2010)', d: 'З Мартіном Шином. Налаштування на Камінó', u: 'nice' },
      { t: '🟢 Вивчити: "Um carimbo, por favor"', d: 'PT / ES: "Un sello, por favor" — запитувати штампи скрізь!', u: 'nice' },
      { t: '🟢 Записна книжка Олексі у Livraria Lello', d: 'Щоденник Камінó — купити 12.07', u: 'nice' },
      { t: '🟢 Мушля Vieira на рюкзак', d: '€2-5 у Sé do Porto. Символ паломника #1', u: 'nice' },
    ],
  },
];

// ─────────────────────────────────────────────
// WEATHER COORDINATES
// ─────────────────────────────────────────────

/**
 * @typedef {Object} CityCoord
 * @property {number} lat
 * @property {number} lon
 * @property {string} name
 */

/** @type {Record<string, CityCoord>} */
export const WMO_ICON = {
  0: 'sun', 1: 'sun', 2: 'sun', 3: 'cloud',
  45: 'cloud', 48: 'cloud',
  51: 'rain', 53: 'rain', 55: 'rain',
  61: 'rain', 63: 'rain', 65: 'rain',
  80: 'rain', 81: 'rain', 82: 'storm',
  95: 'bolt', 96: 'bolt', 99: 'bolt',
};

/** @type {Record<number, string>} WMO weather code → Ukrainian description */
export const WMO_DESC = {
  0: 'Ясно', 1: 'Майже ясно', 2: 'Мінливо', 3: 'Хмарно',
  45: 'Туман', 51: 'Моросящий дощ', 61: 'Дощ', 65: 'Сильний дощ',
  80: 'Зливи', 95: 'Гроза',
};

// ─────────────────────────────────────────────
// STAGE PROGRESS (walking days)
// ─────────────────────────────────────────────

/**
 * @typedef {Object} StageDay
 * @property {string} date  - ISO date string
 * @property {string} city
 * @property {number} km    - Cumulative km walked
 */

/** @type {StageDay[]} */
export const TOTAL_KM = 241;

// ─────────────────────────────────────────────
// BLISTER METER
// ─────────────────────────────────────────────

/** @type {string[]} Blister meter display texts indexed by slider value (0-10) */
export const BLISTER_TEXTS = [
  '0 — Новачок 😊 ноги як нові!',
  '1-2 — Трохи наліваються — витри кросівки!',
  '1-2 — Трохи наліваються — витри кросівки!',
  '3-4 — Compeed в руки! 🩹',
  '3-4 — Compeed в руки! 🩹',
  '5 — Половина маршруту. Тримай! 💪',
  '6-7 — Ноги просять пощади. 😬',
  '6-7 — Ноги просять пощади. 😬',
  '8-9 — Герой! Леукотейп 🧡 + Vaseline після!',
  '8-9 — Герой! Леукотейп 🧡 + Vaseline після!',
  '10 — CAMINO VETERAN 💜 Ноги — легенди!',
];
