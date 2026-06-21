export const GLOBAL_GEAR = [
  { name: 'Credential', comment: 'Паспорт пілігрима» на Шляху Святого Якова', category: 'documents' },
  { name: 'Квитки', comment: 'Wizz Air, докупити Priority', category: 'documents' },
  { name: 'Рюкзак', comment: 'Pinguin / Osprey / Forclaz 28-35L (макс 5-6 кг!)', category: 'gear' },
  { name: 'Кросівки трейлові', comment: 'Розношувати 50-100 км вдома!', category: 'clothing' },
  { name: 'Дощовик-пончо', comment: 'Decathlon Forclaz', category: 'clothing' },
  { name: 'Палиці трекінгові', comment: 'Купимо в Порту Forclaz MT100', category: 'gear' },
  { name: 'Silk liner', comment: 'Для сну в альберге', category: 'gear' },
  { name: 'Шльопанці/Крокси', comment: 'Для душу та відпочинку', category: 'clothing' },
  { name: 'Футболка синтетична (2 шт)', comment: 'Швидкосохнучі', category: 'clothing' },
  { name: 'Сорочка UPF', comment: 'Для захисту від сонця', category: 'clothing' },
  { name: 'Фліска', comment: 'На прохолодні ранки', category: 'clothing' },
  { name: 'Шорти', comment: 'Зручні для ходьби', category: 'clothing' },
  { name: 'Спортивки/легінси', comment: 'Для вечора', category: 'clothing' },
  { name: 'Нижня білизна (2-3 пари)', comment: 'Спортивна', category: 'clothing' },
  { name: 'Шкарпетки мерінос (3 пари)', comment: 'Smartwool / Darn Tough / Forclaz', category: 'clothing' },
  { name: 'Вазелін', comment: 'Жирне змащування стоп зранку проти водяних мозолів', category: 'hygiene' },
  { name: 'Окуляри', comment: 'Сонцезахисні (3 рівень)', category: 'gear' },
  { name: 'Кепка / Панамка', comment: 'Від сонця', category: 'clothing' },
  { name: 'Бананка / поясна сумка', comment: 'Для документів і грошей', category: 'gear' },
  { name: 'Купальник / Плавки', comment: 'Для океану', category: 'clothing' },
  { name: 'Рушник мікрофібра', comment: 'Швидкосохнучий', category: 'hygiene' },
  { name: 'Сонцезахисний крем SPF50+', comment: 'Обов\'язково!', category: 'hygiene' },
  { name: 'Антифрикційний крем', comment: 'Від натирання між ногами', category: 'hygiene' },
  { name: 'Пластирі Compeed', comment: 'Від пухирів', category: 'medical' },
  { name: 'Електроліти', comment: 'Для відновлення солей', category: 'medical' },
  { name: 'Пляшка для води', comment: 'Soft Flask або звичайна 1-1.5L', category: 'gear' },
  { name: 'Налобний ліхтарик', comment: 'Для ранніх виходів', category: 'gear' },
  { name: 'Маска для сну + беруші', comment: 'Must-have в альберге!', category: 'other' },
  { name: 'Power bank', comment: '10000mAh', category: 'gear' },
  { name: 'Прищіпки + мотузка 3м', comment: 'Для сушіння одягу', category: 'other' },
  { name: 'Подовжувач / Трійник', comment: 'В альберге мало розеток, на 4-х людей це спасіння', category: 'gear' },
  { name: 'Сонцезахисний бальзам для губ', comment: 'З SPF 30+, щоб губи не потріскалися від вітру та сонця', category: 'hygiene' },
  { name: 'Засіб для прання (міні)', comment: 'Рідке мило або концентрат для щоденного прання одягу', category: 'hygiene' },
  { name: 'Вологі серветки / Антисептик', comment: 'Для гігієни на маршруті вдень', category: 'hygiene' },
  { name: 'Мультитул / Ніж', comment: 'Купити в Порту (не пустять в літак)', category: 'gear' },
  { name: 'Щоденник Камінó + ручка', comment: 'Для записів', category: 'other' },
  { name: 'Мушля Vieira на рюкзак', comment: 'Символ паломника', category: 'other' },
];

// ─────────────────────────────────────────────
// ROUTE
// ─────────────────────────────────────────────

/**
 * @typedef {Object} RoutePlace
 * @property {string} n  - Display name
 * @property {string} i  - Info text
 * @property {string} m  - Maps URL
 * @property {boolean} stamp
 * @property {boolean} secret
 */

/**
 * @typedef {Object} RouteAlb
 * @property {string} n  - Name
 * @property {string} p  - Price
 * @property {string} b  - Booking URL
 * @property {string} m  - Maps URL
 * @property {string} [c] - Comment
 * @property {boolean} stamp
 * @property {string} [type]
 */

/**
 * @typedef {Object} RouteStamp
 * @property {string} place
 * @property {string} note
 * @property {string} m  - Maps URL
 */

/**
 * @typedef {Object} RouteDay
 * @property {string} date
 * @property {string} day
 * @property {string} title
 * @property {string} route
 * @property {number} km
 * @property {string} type
 * @property {string} [special]
 * @property {string} desc
 * @property {string} hl
 * @property {RoutePlace[]} places
 * @property {RouteAlb[]} albs
 * @property {RouteStamp[]} stamps
 * @property {{ up: number, down: number }} elevation
 */

/** @type {RouteDay[]} */
