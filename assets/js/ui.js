/**
 * @fileoverview ui.js — All HTML rendering and DOM interaction.
 *
 * Exports one main entry point: `renderApp(pilgrimId)`.
 * All section builders are pure string-template functions.
 * All event-init functions are called once after renderApp().
 *
 * @module ui
 */

import {
  PILGRIMS, ROUTE, DICTIONARY, FOODS, EXERCISES,
  APPS, CHECKLIST, CITY_COORDS, BLISTER_TEXTS, GLOBAL_GEAR,
} from './config.js';

import {
  getGearState, toggleGearItem,
  getChecklistState, toggleChecklistItem,
  getBlisterValue, setBlisterValue,
  getBookingState, toggleBookingItem,
} from './storage.js';

import { buildStageProgress, loadWeatherForDay } from './utils.js';
import { applyNightMode, shouldAutoNight } from './utils.js';
import { initShellEgg, initLogoLongPress } from './easterEggs.js';

// ─────────────────────────────────────────────
// LOGIN & PILGRIM LIST
// ─────────────────────────────────────────────

/**
 * Generate HTML for the pilgrim selection buttons.
 * @returns {string}
 */
export function buildPilgrimList() {
  // Guest is hardcoded in index.html, so exclude it from the dynamic list
  return Object.entries(PILGRIMS)
    .filter(([id]) => id !== 'guest')
    .map(([id, p]) => `
    <button class="pilgrim-btn" data-pilgrim="${id}">
      ${p.name} <span class="arrow"><svg class="icon"><use href="#icon-right"></svg></span>
    </button>
  `).join('');
}

// ─────────────────────────────────────────────
// MAIN RENDER
// ─────────────────────────────────────────────

/**
 * Render the full application for a given pilgrim.
 * @param {string} id - Pilgrim key from PILGRIMS
 */
export function renderApp(id) {
  const p = PILGRIMS[id];
  const app = document.getElementById('app');
  if (!app) return;

  const displayName = id === 'guest' ? 'Вуайєрист' : p.name;
  app.innerHTML = `
    ${buildHeader(p, id)}
    ${buildNav()}
    ${buildHero(p, id)}

    <p id="navSectionLive" class="sr-only" aria-live="polite" aria-atomic="true"></p>

    <section class="section active" id="s-route">${buildRoute()}</section>
    <section class="section"        id="s-booking">${buildBooking()}</section>
    <section class="section"        id="s-history">${buildHistory()}</section>
    <section class="section"        id="s-pilgrims">${buildPilgrims()}</section>
    <section class="section"        id="s-dict">${buildDict()}</section>
    <section class="section"        id="s-food">${buildFood()}</section>
    <section class="section"        id="s-exercises">${buildExercises()}</section>
    <section class="section"        id="s-apps">${buildApps()}</section>
    <section class="section"        id="s-safety">${buildSafety()}</section>
    <section class="section"        id="s-playlist">${buildPlaylist()}</section>
    <section class="section"        id="s-check">${buildCheck()}</section>

    <footer class="footer"><div><img src="assets/files/camino.svg" alt="Мушля" style="width:24px;height:24px;object-fit:contain;vertical-align:middle;"></div><div>Buen Camino, ${displayName}!</div></footer>
  `;

  // Wire up all interactive pieces
  initNav();
  initNavArrows();
  initDayCards();
  initPilgrimCards(id);
  initDictTabs();
  initFoodRandom();
  initExerciseTabs();
  initChecklist();
  initWeatherLazy();
  initRouteTools();
  initShellEgg();
  initLogoLongPress();
  initUserMenu();
  initWisdomModal();

  // Reset scroll to ensure we start at the beginning
  window.scrollTo(0, 0);

  // Night mode toggle (button rendered by buildHeader)
  const nightBtn = document.getElementById('nightToggleH');
  if (nightBtn) {
    nightBtn.addEventListener('click', () => {
      applyNightMode(!document.body.classList.contains('night-mode'));
    });
  }
}

// ─────────────────────────────────────────────
// HEADER
// ─────────────────────────────────────────────

function buildHeader(p, id) {
  const initial = id === 'guest' ? 'В' : p.initial;
  const name = id === 'guest' ? 'Вуаєрист' : p.name;
  return `
  <header class="header">
    <div class="header-left">
      <div class="header-title">
        <span class="shell-icon" id="shellEgg" role="button" tabindex="0" aria-label="Секретний елемент">
          <img src="assets/files/camino.svg" alt="Мушля" class="icon" style="width:24px;height:24px;object-fit:contain;vertical-align:middle;">
        </span>
        Твою ж Каміно!
      </div>
    </div>
    <div class="header-cd" role="timer">
        <div class="countdown-label">До старту <svg class="icon" style="font-size:10px;"><use href="#icon-plane"></svg></div>
        <div class="countdown-grid">
          <div class="countdown-cell"><span class="countdown-num" id="cd-d">—</span><span class="countdown-unit"> дн</span></div>
          <div class="countdown-cell"><span class="countdown-num" id="cd-h">—</span><span class="countdown-unit"> год</span></div>
          <div class="countdown-cell"><span class="countdown-num" id="cd-m">—</span><span class="countdown-unit"> хв</span></div>
          <div class="countdown-cell"><span class="countdown-num" id="cd-s">—</span><span class="countdown-unit"> сек</span></div>
        </div>
      </div>
    <div class="header-right">
      <button class="night-toggle-header" id="nightToggleH"
        title="Нічний режим" aria-label="Перемкнути нічний режим">
        <svg class="icon"><use href="#icon-${document.body.classList.contains('night-mode') ? 'sun' : 'moon'}"></svg>
      </button>
      <div class="user-badge" id="userBadge" role="button" tabindex="0" aria-haspopup="true" aria-expanded="false" data-initial="${initial}" data-name="${name}">
        <span class="user-badge-text">${initial}</span>
        <div class="user-menu" id="userMenu" role="menu">
          <button id="logoutBtn" role="menuitem">Вийти з акаунту</button>
        </div>
      </div>
    </div>
  </header>`;
}

function initUserMenu() {
  const badge = document.getElementById('userBadge');
  const menu = document.getElementById('userMenu');
  const logout = document.getElementById('logoutBtn');
  if (!badge || !menu || !logout) return;

  const toggle = () => {
    const open = menu.classList.toggle('show');
    badge.setAttribute('aria-expanded', String(open));
    const textSpan = badge.querySelector('.user-badge-text');
    if (textSpan) {
      if (open) {
        textSpan.textContent = badge.getAttribute('data-name');
        badge.style.width = 'auto';
        badge.style.padding = '0 12px';
        badge.style.borderRadius = '16px';
      } else {
        textSpan.textContent = badge.getAttribute('data-initial');
        badge.style.width = '';
        badge.style.padding = '';
        badge.style.borderRadius = '';
      }
    }
  };

  badge.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
  badge.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });

  logout.addEventListener('click', () => {
    import('./storage.js').then(({ clearSavedPilgrim }) => {
      clearSavedPilgrim();
      location.reload();
    });
  });

  document.addEventListener('click', () => {
    menu.classList.remove('show');
    badge.setAttribute('aria-expanded', 'false');
  });
}

// ─────────────────────────────────────────────
// NAV
// ─────────────────────────────────────────────

/** @type {Array<{id: string, label: string}>} */
const NAV_TABS = [
  { id: 'route', label: 'Маршрут' },
  { id: 'booking', label: 'Бронювання' },
  { id: 'history', label: 'Історія' },
  { id: 'pilgrims', label: 'Паломники' },
  { id: 'dict', label: 'Словник' },
  { id: 'food', label: "Що з'їсти" },
  { id: 'exercises', label: 'Вправи' },
  { id: 'apps', label: 'Додатки' },
  { id: 'safety', label: 'Безпека' },
  { id: 'playlist', label: 'Плейлист' },
  { id: 'check', label: 'Чекліст' },
];

function buildNav() {
  const tabs = NAV_TABS.map((t, i) =>
    `<button class="nav-tab${i === 0 ? ' active' : ''}" data-s="${t.id}" role="tab" aria-selected="${i === 0}" aria-controls="s-${t.id}">${t.label}</button>`
  ).join('');

  return `
  <div class="nav-wrapper" role="tablist">
    <button class="nav-arrow left" id="navArrowLeft" aria-label="Прокрутити вліво"><svg class="icon"><use href="#icon-left"></svg></button>
    <nav class="nav-tabs" id="navTabs">${tabs}</nav>
    <button class="nav-arrow right" id="navArrowRight" aria-label="Прокрутити вправо"><svg class="icon"><use href="#icon-right"></svg></button>
    <!-- <div class="nav-search-wrap">
      <input class="nav-search" id="routeSearch" type="search" placeholder="Пошук..." aria-label="Пошук по маршруту">
    </div> -->
  </div>`;
}

function initNav() {
  const tabs = document.querySelectorAll('.nav-tab');
  const sections = document.querySelectorAll('.section');

  const announceActiveSection = (tab) => {
    const sid = tab.getAttribute('data-s');
    const entry = NAV_TABS.find((t) => t.id === sid);
    const live = document.getElementById('navSectionLive');
    if (!live || !entry) return;
    live.textContent = `Секція: ${entry.label}`;
  };

  const switchTab = (tab) => {
    tabs.forEach((t) => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    sections.forEach((s) => s.classList.remove('active'));

    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    const sectionId = `s-${tab.getAttribute('data-s')}`;
    const target = document.getElementById(sectionId);
    if (target) {
      target.classList.add('active');
      window.scrollTo(0, 0);
      announceActiveSection(tab);
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => switchTab(tab));
  });

  // Initial scroll to top
  window.scrollTo(0, 0);
}

function initNavArrows() {
  const tabs = document.getElementById('navTabs');
  const left = document.getElementById('navArrowLeft');
  const right = document.getElementById('navArrowRight');
  if (!tabs || !left || !right) return;

  const update = () => {
    left.classList.toggle('visible', tabs.scrollLeft > 5);
    right.classList.toggle('visible', tabs.scrollWidth - tabs.clientWidth - tabs.scrollLeft > 5);
  };

  left.addEventListener('click', () => tabs.scrollBy(-150, 0));
  right.addEventListener('click', () => tabs.scrollBy(150, 0));
  tabs.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  setTimeout(update, 100);
}

// ─────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────

/** @param {{ name: string }} p */
function buildHero(p, id) {
  const displayName = id === 'guest' ? 'Вуайєрист' : p.name;
  return `
    <div class="hero" id="heroLogoEgg" role="button" tabindex="0" aria-label="Головне лого (затисніть для сюрпризу)">
      <div class="hero-greeting">Привіт, ${displayName}!</div>
      <h1 class="hero-title" style="display:flex;justify-content:center;align-items:center;gap:12px;margin-top:10px;margin-bottom:20px;">
        <span>Buen <span class="accent">Camino</span></span>
        <img src="assets/files/logo.png" alt="Buen Camino"
          style="max-height:1.2em;width:auto;object-fit:contain;pointer-events:none;"
          draggable="false">
      </h1>
      <p class="hero-subtitle">Camino Português da Costa · 261 км · 12 днів пішки</p>
    </div>`;
}

// ─────────────────────────────────────────────
// ROUTE SECTION
// ─────────────────────────────────────────────

function buildRoute() {
  const stageHTML = buildStageProgress();
  const lastIdx = ROUTE.length - 1;
  const bookingState = getBookingState();

  const cards = ROUTE.map((d, i) => {
    const isSpecial = !!d.special;
    const isBirthday = d.special === 'birthday-holiday';
    const isHoliday = d.special === 'apostolo-mass';

    const tags = [
      d.km ? `<span class="day-tag km"><svg class="icon" style="font-size:10px;margin-right:3px;"><use href="#icon-walk"></svg> ${d.km} км</span>` : '',
      d.type === 'walking-hard' ? '<span class="day-tag"><svg class="icon" style="font-size:10px;margin-right:3px;"><use href="#icon-alert"></svg> Складно</span>' : '',
      d.type === 'walking-easy' ? '<span class="day-tag"><svg class="icon" style="font-size:10px;margin-right:3px;"><use href="#icon-happy"></svg> Легко</span>' : '',
      d.type === 'walking-finish' ? '<span class="day-tag"><svg class="icon" style="font-size:10px;margin-right:3px;"><use href="#icon-trophy"></svg> Фініш!</span>' : '',
      isBirthday ? '<span class="day-tag" style="background:#ffd6d0;color:var(--terracotta-dark);"><svg class="icon" style="font-size:10px;margin-right:3px;"><use href="#icon-cake"></svg> Apóstolo</span>' : '',
      isHoliday ? '<span class="day-tag" style="background:#ffd6d0;color:var(--terracotta-dark);"><svg class="icon" style="font-size:10px;margin-right:3px;"><use href="#icon-church"></svg> 25 Липня</span>' : '',
    ].join('');

    const specialClass = isSpecial ? ` special ${isBirthday ? 'birthday' : isHoliday ? 'holiday' : ''}` : '';

    // Places
    const placesHTML = d.places.length ? `
      <div class="detail-section">
        <div class="det-title"><svg class="icon" style="margin-right:5px;"><use href="#icon-pin"></svg> Що подивитись / де поїсти</div>
        ${d.places.map((p) => `
          <div class="det-item">
            <a class="det-name" href="${p.m}" target="_blank" rel="noopener noreferrer">
              ${injectIcons(p.n)}
              ${p.secret ? '<span class="secret-tag"><svg class="icon" style="font-size:9px;margin-right:2px;"><use href="#icon-shush"></svg> секрет</span>' : ''}
              ${p.stamp ? '<span class="stamp-mark">✦</span>' : ''}
            </a>
            <div class="det-info">${injectIcons(p.i)}</div>
          </div>`).join('')}
      </div>` : '';

    // Albergues
    const bookingState = getBookingState();
    const albsHTML = d.albs.length ? (() => {
      const rows = d.albs.map((a, aIdx) => {
        const key = `${i}-${aIdx}`;
        const isBooked = (a.c?.includes('ЗАБРОНЬОВАНО') ?? false) || bookingState[key];
        const cleanComment = (a.c ?? '').replace('(ЗАБРОНЬОВАНО)', '').replace('ЗАБРОНЬОВАНО', '').trim();
        const mapLink = a.m || `https://www.google.com/maps/search/${encodeURIComponent(a.n)}`;
        const bookLink = a.b ? `<a class="det-book-btn" href="${a.b}" target="_blank" rel="noopener noreferrer"><svg class="icon" style="margin-right:3px;"><use href="#icon-ticket"></svg> Book</a>` : '';
        const bookedBadge = isBooked ? '<div class="booked-badge"><svg class="icon" style="margin-right:3px;"><use href="#icon-check"></svg> ЗАБРОНЬОВАНО</div>' : '';
        const bookedClass = isBooked ? 'booked' : '';
        const btnBg = isBooked ? 'var(--paper-dark)' : 'var(--olive)';
        const btnColor = isBooked ? 'var(--ink)' : '#fff';
        const btnBorder = isBooked ? 'var(--paper-dark)' : 'var(--olive)';
        const btnLabel = isBooked ? 'Відмінити' : 'Забронювати';
        return `
            <div class="det-item ${bookedClass}">
              <div style="display:flex;justify-content:space-between;align-items:center;width:100%;gap:10px;">
                <div style="flex:1;">
                  <a class="det-name" href="${mapLink}" target="_blank" rel="noopener noreferrer"><svg class="icon" style="margin-right:4px;"><use href="#icon-pin"></svg> ${injectIcons(a.n)}</a>
                  <div class="det-info"><strong>${a.p}</strong>${cleanComment ? ' — ' + injectIcons(cleanComment) : ''}</div>
                </div>
                <div style="display:flex;flex-direction:column;gap:5px;">
                  ${bookLink}
                  <button class="det-book-btn alb-toggle-btn" data-key="${key}" style="background:${btnBg};color:${btnColor};border-color:${btnBorder};">${btnLabel}</button>
                </div>
              </div>
              ${bookedBadge}
            </div>`;
      });
      return `<div class="detail-section"><div class="det-title"><svg class="icon" style="margin-right:5px;"><use href="#icon-bed"></svg> Альберге</div>${rows.join('')}</div>`;
    })() : '';

    // Stamps
    const stampsHTML = d.stamps.length ? `
      <div class="detail-section">
        <div class="det-title"><svg class="icon" style="margin-right:5px;"><use href="#icon-scroll"></svg> Де поставити штамп</div>
        ${d.stamps.map((s) => `
          <div class="det-item">
            <div class="det-name">${injectIcons(s.place)}</div>
            <div class="det-info">${injectIcons(s.note)}</div>
          </div>`).join('')}
      </div>` : '';

    // Weather widget placeholder (only for days with coords)
    const weatherHTML = CITY_COORDS[d.date] ? `
      <div id="weather-${i}" class="detail-section">
        <div class="det-title"><svg class="icon" style="margin-right:5px;"><use href="#icon-cloud"></svg> Погода на ${d.date}</div>
        <div class="weather-widget"><div class="weather-loading"><svg class="icon" style="margin-right:5px;animation:spin 2s linear infinite;"><use href="#icon-globe"></svg> Завантажуємо…</div></div>
      </div>` : '';

    // Secret tip on the last day
    const secretTip = i === lastIdx ? `
      <div class="hidden-tip" id="htip">
        <div class="hidden-tip-title"><svg class="icon" style="margin-right:5px;"><use href="#icon-shush"></svg> Секрет 25.07 — як пробігти OPO</div>
        <p style="font-size:13px;line-height:1.5;">
          • Прийти за 1.5 год (не 2 — Wizz check-in швидкий)<br>
          • Wizz Air check-in T1 — центр терміналу, зліва<br>
          • Security 16:00-18:00 — менше людей<br>
          • Воду купити після security (€2.50) — на гейті дорожче<br>
          • Boarding починається за 35-40 хв до вильоту<br>
          • Штамп аеропорту в credencial — на пам'ять!
        </p>
      </div>` : '';

    return `
    <div class="day-card${specialClass}" data-i="${i}" role="button" tabindex="0"
         aria-expanded="false" aria-label="${d.date} ${d.title}">
      <div style="display:flex;justify-content:space-between;align-items:baseline;">
        <div>
          <div class="day-date">${d.date}</div>
          <div class="day-dow">${d.day} · ${injectIcons(d.route)}</div>
        </div>
      </div>
      <div class="day-route">${injectIcons(d.title)}</div>
      <div class="day-meta">${tags}</div>
      <div class="day-desc">${injectIcons(d.desc)}</div>
      ${d.hl ? `<div class="day-hl"><svg class="icon" style="margin-right:5px;color:var(--gold);"><use href="#icon-sun"></svg> ${injectIcons(d.hl)}</div>` : ''}
      <div class="expand-hint" aria-hidden="true"><svg class="icon"><use href="#icon-down"></svg> натисни для деталей</div>
      <div class="day-details" id="dd-${i}">
        ${placesHTML}
        ${albsHTML}
        ${stampsHTML}
        ${weatherHTML}
        ${secretTip}
      </div>
    </div>`;
  }).join('');

  return `
    <h2 class="section-title">Маршрут</h2>
    <div class="section-subtitle">12 днів · старт 13.07.2026</div>
    ${stageHTML}
    ${buildRouteTools()}
    ${cards}`;
}

function buildRouteTools() {
  return `
    <div class="route-tools">
      <div class="tool-card">
        <button class="tool-btn" id="todayRouteBtn" type="button" style="width:100%">Сьогоднішній день маршруту</button>
      </div>
    </div>`;
}

function initRouteTools() {
  document.getElementById('todayRouteBtn')?.addEventListener('click', () => {
    const today = new Date();
    const key = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}`;
    const found = ROUTE.findIndex((day) => day.date === key);
    const idx = found >= 0 ? found : 0;
    const target = document.querySelector(`.day-card[data-i="${idx}"]`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (target.getAttribute('aria-expanded') === 'false') {
        const dd = document.getElementById(`dd-${idx}`);
        dd?.classList.add('expanded');
        target.setAttribute('aria-expanded', 'true');
      }
      target.classList.add('pulse-focus');
      setTimeout(() => target.classList.remove('pulse-focus'), 1800);
    }
  });
}

function initDayCards() {
  document.querySelectorAll('.day-card').forEach((card) => {
    const activate = () => {
      const idx = card.getAttribute('data-i');
      if (!idx) return;

      const dd = document.getElementById(`dd-${idx}`);
      const isOpen = dd?.classList.toggle('expanded') ?? false;
      card.setAttribute('aria-expanded', String(isOpen));

      // Last-day secret tip
      if (parseInt(idx) === ROUTE.length - 1) {
        document.getElementById('htip')?.classList.toggle('revealed');
      }
    };

    card.addEventListener('click', (e) => {
      if (/** @type {HTMLElement} */ (e.target).tagName === 'A' ||
          /** @type {HTMLElement} */ (e.target).closest('a')) return;
      activate();
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
    });
  });

  document.querySelectorAll('.alb-toggle-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const key = btn.getAttribute('data-key');
      if (!key) return;
      const isBooked = toggleBookingItem(key);

      btn.style.background = isBooked ? 'var(--paper-dark)' : 'var(--olive)';
      btn.style.color = isBooked ? 'var(--ink)' : '#fff';
      btn.style.borderColor = isBooked ? 'var(--paper-dark)' : 'var(--olive)';
      btn.textContent = isBooked ? 'Відмінити' : 'Забронювати';

      const detItem = btn.closest('.det-item');
      if (detItem) {
        if (isBooked) {
          detItem.classList.add('booked');
          if (!detItem.querySelector('.booked-badge')) {
            detItem.insertAdjacentHTML('beforeend', '<div class="booked-badge"><svg class="icon" style="margin-right:3px;"><use href="#icon-check"></svg> ЗАБРОНЬОВАНО</div>');
          }
        } else {
          detItem.classList.remove('booked');
          const badge = detItem.querySelector('.booked-badge');
          if (badge) badge.remove();
        }
      }

      const bookingSec = document.getElementById('s-booking');
      if (bookingSec) bookingSec.innerHTML = buildBooking();
    });
  });
}

/** Attach one-time lazy weather load on card click. */
function initWeatherLazy() {
  ROUTE.forEach((d, i) => {
    if (!CITY_COORDS[d.date]) return;
    const card = document.querySelector(`.day-card[data-i="${i}"]`);
    if (!card) return;

    const load = () => loadWeatherForDay(i, d.date, d.date);
    card.addEventListener('click', load, { once: true });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') load();
    }, { once: true });
  });
}

// ─────────────────────────────────────────────
// PILGRIMS SECTION
// ─────────────────────────────────────────────

function buildPilgrims() {
  const cards = Object.entries(PILGRIMS)
    .filter(([id, p]) => id !== 'guest')
    .map(([id, p]) => `
    <div class="pilgrim-card" data-pid="${id}" role="button" tabindex="0" aria-label="${p.name}">
      <div class="pilgrim-avatar" aria-hidden="true">${p.initial}</div>
      <div class="pilgrim-card-name">${p.name}</div>
      <div class="pilgrim-card-arrow" aria-hidden="true"><svg class="icon"><use href="#icon-right"></svg></div>
    </div>`).join('');

  return `
    <h2 class="section-title">Паломники</h2>
    <div class="section-subtitle">натисни — побачиш список речей</div>
    <div class="pilgrim-cards">${cards}</div>`;
}

/**
 * @param {string} currentPilgrimId - ID of the logged-in pilgrim
 */
function initPilgrimCards(currentPilgrimId) {
  document.querySelectorAll('.pilgrim-card').forEach((card) => {
    const activate = () => openGearModal(card.getAttribute('data-pid') ?? '');
    card.addEventListener('click', activate);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
    });
  });

  // Modal close
  const modal = document.getElementById('pilgrimModal');
  const closeBtn = document.getElementById('pilgrimModalClose');
  if (modal) {
    modal.addEventListener('click', (e) => { if (e.target === modal) closeGearModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeGearModal(); });
  }
  if (closeBtn) closeBtn.addEventListener('click', closeGearModal);
}

/**
 * Open the gear modal for a pilgrim.
 * @param {string} pid
 */
function openGearModal(pid) {
  const p = PILGRIMS[pid];
  const state = getGearState(pid);

  // Use GLOBAL_GEAR, mark checked if state has it true
  const hasItems = GLOBAL_GEAR.filter(it => state[it.name]);
  const needItems = GLOBAL_GEAR.filter(it => !state[it.name]);

  const gearRow = (it, checked) => `
    <div class="gear-item" style="border-left-color:${checked ? 'var(--olive)' : 'var(--terracotta)'}">
      <div class="gear-item-check${checked ? ' checked' : ''}"
           data-pid="${pid}" data-key="${it.name}"
           role="checkbox" aria-checked="${checked}" tabindex="0"
           aria-label="Відмітити: ${it.name}"></div>
      <div class="gear-item-body">
        <strong>${it.name}</strong>
        ${it.model ? ` <span style="font-size:11px;color:var(--ink-soft);">${it.model}</span>` : ''}
        ${it.comment ? `<span class="comment">${it.comment}</span>` : ''}
        ${it.link ? `<div style="margin-top:4px;"><a href="${it.link}" target="_blank" rel="noopener noreferrer"><svg class="icon" style="font-size:11px;margin-right:3px;"><use href="#icon-link"></svg> Подивитися <svg class="icon" style="font-size:10px;"><use href="#icon-right"></svg></a></div>` : ''}
      </div>
    </div>`;

  const blisterVal = getBlisterValue(pid);

  document.getElementById('pilgrimModalContent').innerHTML = `
    <h2 class="modal-title">${p.name}</h2>
    <div class="modal-subtitle">загальний список речей · відмічай чекбоксами</div>
    <div class="blister-meter">
      <div class="blister-label"><svg class="icon" style="margin-right:5px;"><use href="#icon-brain"></svg> Blister Meter <svg class="icon" style="margin-left:5px;"><use href="#icon-brain"></svg></div>
      <input class="blister-slider" type="range" min="0" max="10"
             value="${blisterVal}" id="blister-${pid}"
             aria-label="Blister Meter">
      <div class="blister-display" id="blister-txt-${pid}">${getBlisterText(blisterVal)}</div>
    </div>
    ${hasItems.length ? `<div class="gear-section has"><div class="gear-section-title"><svg class="icon" style="margin-right:7px;color:var(--olive);"><use href="#icon-check"></svg> Вже є (${hasItems.length})</div>${hasItems.map((it) => gearRow(it, true)).join('')}</div>` : ''}
    ${needItems.length ? `<div class="gear-section need"><div class="gear-section-title"><svg class="icon" style="margin-right:7px;color:var(--terracotta);"><use href="#icon-cart"></svg> Купити (${needItems.length})</div>${needItems.map((it) => gearRow(it, false)).join('')}</div>` : ''}
  `;

  // Gear item check toggle
  document.querySelectorAll('.gear-item-check').forEach((el) => {
    const toggle = () => {
      const p2 = el.getAttribute('data-pid') ?? '';
      const key = el.getAttribute('data-key') ?? '';
      const newChecked = toggleGearItem(p2, key);

      el.classList.toggle('checked', newChecked);
      el.setAttribute('aria-checked', String(newChecked));

      const row = el.closest('.gear-item');
      if (row instanceof HTMLElement) {
        row.style.borderLeftColor = newChecked ? 'var(--olive)' : 'var(--terracotta)';

        const targetSection = document.querySelector(`.gear-section.${newChecked ? 'has' : 'need'}`);
        if (targetSection) targetSection.appendChild(row);

        document.querySelectorAll('.gear-section').forEach((sec) => {
          const title = sec.querySelector('.gear-section-title');
          if (!title) return;
          const count = sec.querySelectorAll('.gear-item').length;
          title.textContent = sec.classList.contains('has')
            ? `✅ Вже є (${count})` : `🛒 Купити (${count})`;
        });
      }
    };

    el.addEventListener('click', toggle);
    el.addEventListener('keydown', (e) => {
      if (e instanceof KeyboardEvent && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault(); toggle();
      }
    });
  });

  // Blister slider
  const slider = document.getElementById(`blister-${pid}`);
  const display = document.getElementById(`blister-txt-${pid}`);
  if (slider && display) {
    slider.addEventListener('input', (e) => {
      const val = parseInt(/** @type {HTMLInputElement} */(e.target).value);
      setBlisterValue(pid, val);
      display.textContent = getBlisterText(val);
    });
  }

  const modal = document.getElementById('pilgrimModal');
  if (modal) { modal.classList.add('show'); document.body.style.overflow = 'hidden'; }
}

function closeGearModal() {
  document.getElementById('pilgrimModal')?.classList.remove('show');
  document.body.style.overflow = '';
}

// ─────────────────────────────────────────────
// DICTIONARY SECTION
// ─────────────────────────────────────────────

/** @type {'ua2pt'|'ua2es'} */
let dictLang = 'ua2pt';

function buildDict() {
  return `
    <h2 class="section-title">Словник</h2>
    <div class="section-subtitle">фрази які знадобляться</div>
    <div class="dict-tabs" role="tablist">
      <button class="dict-tab active" data-l="ua2pt" role="tab" aria-selected="true"><svg class="icon" style="width:16px;height:16px;"><use href="#icon-flag-ua"></svg> <svg class="icon" style="width:10px;height:10px;opacity:.6;"><use href="#icon-right"></svg> <svg class="icon" style="width:16px;height:16px;"><use href="#icon-flag-pt"></svg> Португальська</button>
      <button class="dict-tab"        data-l="ua2es" role="tab" aria-selected="false"><svg class="icon" style="width:16px;height:16px;"><use href="#icon-flag-ua"></svg> <svg class="icon" style="width:10px;height:10px;opacity:.6;"><use href="#icon-right"></svg> <svg class="icon" style="width:16px;height:16px;"><use href="#icon-flag-es"></svg> Іспанська</button>
    </div>
    <div id="dict-content"></div>`;
}

function renderDict() {
  const isPT = dictLang === 'ua2pt';

  const html = Object.values(DICTIONARY).map((cat) => {
    const phrases = cat.phrases.map((ph) => {
      const target = isPT ? ph.pt : ph.es;
      if (!target) return '';

      const pronParts = ph.pro?.split(' / ') ?? [];
      const pronun = isPT ? pronParts[0] : (pronParts[1] ?? pronParts[0] ?? '');


      return `
        <div class="dict-phrase">
          <div class="dict-original">${ph.ua}</div>
          <div class="dict-translation" style="color:var(--terracotta);font-weight:600;">${target}</div>
          ${pronun ? `<div class="dict-pronun"><svg class="icon" style="margin-right:5px;"><use href="#icon-volume"></svg> ${pronun}</div>` : ''}
          ${ph.tr ? `<div style="font-size:12px;color:var(--ink-soft);font-style:italic;margin-top:3px;"><svg class="icon" style="width:14px;height:14px;margin-right:3px;"><use href="#icon-scroll"></svg><em>${injectIcons(ph.tr)}</em></div>` : ''}
        </div>`;
    }).join('');

    return `<div class="dict-category"><div class="dict-cat-title">${cat.title}</div>${phrases}</div>`;
  }).join('');

  const content = document.getElementById('dict-content');
  if (content) content.innerHTML = html;
}

function initDictTabs() {
  document.querySelectorAll('.dict-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.dict-tab').forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      dictLang = /** @type {'ua2pt'|'ua2es'} */ (tab.getAttribute('data-l') ?? 'ua2pt');
      renderDict();
    });
  });
  renderDict();
}

// ─────────────────────────────────────────────
// FOOD SECTION
// ─────────────────────────────────────────────

function buildFood() {
  return `
    <h2 class="section-title">Що з'їсти</h2>
    <div class="section-subtitle">натисни — рандомна страва</div>
    <div class="food-randomizer">
      <div class="food-rand-title"><svg class="icon" style="margin-right:5px;"><use href="#icon-food"></svg> Каміно Меню</div>
      <span class="food-spinner" id="foodSpinner" aria-hidden="true"><svg class="icon" style="width:48px;height:48px;"><use href="#icon-food"></svg></span>
      <div class="food-result" id="foodResult" aria-live="polite">натисни кнопку!</div>
      <div class="food-desc"   id="foodDesc">щоб дізнатися що замовити...</div>
      <div class="food-city"   id="foodCity"></div>
      <button class="food-btn" id="foodBtn"><svg class="icon" style="margin-right:6px;"><use href="#icon-food"></svg> Що з'їсти?</button>
    </div>
    <div style="background:var(--paper);padding:14px;border-radius:4px;border:1px solid var(--paper-dark);">
      <div style="font-family:'Caveat',cursive;font-size:20px;color:var(--terracotta);margin-bottom:8px;"><svg class="icon" style="margin-right:5px;"><use href="#icon-scroll"></svg> Menu del Peregrino</div>
      <p style="font-size:13px;color:var(--ink-soft);line-height:1.5;">
        <strong>€10-15/паломника</strong> — 3 страви (закуска / основна / десерт) + хліб + вино або сік.
        Обід 13:00-16:00, вечеря 18:30-19:00.
      </p>
    </div>`;
}

function initFoodRandom() {
  const btn = document.getElementById('foodBtn');
  const spinner = document.getElementById('foodSpinner');
  const result = document.getElementById('foodResult');
  const desc = document.getElementById('foodDesc');
  const city = document.getElementById('foodCity');
  if (!btn || !spinner || !result || !desc || !city) return;

  btn.addEventListener('click', () => {
    spinner.classList.remove('spinning');
    void spinner.offsetWidth; // force reflow to restart animation
    spinner.classList.add('spinning');

    [result, desc, city].forEach((el) => { el.style.opacity = '0'; });

    setTimeout(() => {
      const food = FOODS[Math.floor(Math.random() * FOODS.length)];
      result.textContent = food.n;
      desc.textContent = food.d;
      city.innerHTML = `<svg class="icon" style="width:14px;height:14px;margin-right:4px;"><use href="#icon-pin"></svg>${food.city.replace(/^📍\s*/, '')}`;
      [result, desc, city].forEach((el) => { el.style.opacity = '1'; });
    }, 1_400);
  });
}

// ─────────────────────────────────────────────
// EXERCISES SECTION
// ─────────────────────────────────────────────

/** @type {'before'|'during'|'mindset'} */
let exTab = 'before';

function buildExercises() {
  return `
    <h2 class="section-title">Вправи</h2>
    <div class="section-subtitle">тіло — твій транспорт на Камінó</div>
    <div class="exercise-tabs" role="tablist">
      <button class="ex-tab active" data-et="before" role="tab" aria-selected="true">Перед походом</button>
      <button class="ex-tab"        data-et="during" role="tab" aria-selected="false">Під час походу</button>
      <button class="ex-tab"        data-et="mindset" role="tab" aria-selected="false">Як дійти</button>
    </div>
    <div id="ex-content"></div>`;
}

/** @param {string} type - figure key */
function getExerciseSVG(type) {
  const svgs = {
    walking: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 65L35 45L30 25M35 45L50 65M30 25L45 20L55 35" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="48" cy="15" r="5" stroke="var(--ink)" stroke-width="2.5"/>
      <path d="M22 28C22 28 25 15 35 15C45 15 48 28 48 28" stroke="var(--terracotta)" stroke-width="2" stroke-dasharray="3 3"/>
      <rect x="25" y="28" width="12" height="15" rx="2" fill="var(--terracotta)" opacity="0.2" stroke="var(--terracotta)" stroke-width="1.5"/>
    </svg>`,
    squat: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 65H35L30 45L45 40L55 25" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="58" cy="18" r="5" stroke="var(--ink)" stroke-width="2.5"/>
      <path d="M35 65L45 55L60 55" stroke="var(--olive)" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
      <path d="M45 45c2 0 4 2 4 4s-2 4-4 4M55 45c-2 0-4 2-4 4s2 4 4 4" stroke="var(--ink)" stroke-width="1.5" opacity="0.3"/>
    </svg>`,
    stretch: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 65V40L60 25M30 40L15 25" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="62" cy="18" r="5" stroke="var(--ink)" stroke-width="2.5"/>
      <path d="M30 65C45 65 60 50 60 35" stroke="var(--gold)" stroke-width="2" stroke-dasharray="4 2"/>
    </svg>`,
    feet: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 55C25 45 35 40 45 40C55 40 65 45 65 55C65 65 55 70 45 70C35 70 25 65 25 55Z" fill="var(--paper-dark)" stroke="var(--ink)" stroke-width="2"/>
      <circle cx="30" cy="35" r="4" fill="var(--sand)"/>
      <circle cx="40" cy="30" r="4" fill="var(--sand)"/>
      <circle cx="50" cy="32" r="4" fill="var(--sand)"/>
      <circle cx="60" cy="38" r="4" fill="var(--sand)"/>
      <path d="M45 50L45 60M40 55L50 55" stroke="var(--terracotta)" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    morning: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="15" stroke="var(--gold)" stroke-width="2" stroke-dasharray="4 4"/>
      <path d="M40 10V20M40 60V70M10 40H20M60 40H70" stroke="var(--gold)" stroke-width="2" stroke-linecap="round"/>
      <path d="M30 50L40 30L50 50" stroke="var(--ink)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="40" cy="22" r="4" fill="var(--gold)"/>
    </svg>`,
    evening: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 50C20 33.4315 33.4315 20 50 20C53.5 20 56.8 20.6 59.9 21.7C55 24.5 52 29.8 52 35.8C52 45.2 59.8 52.8 69.2 52.8C68.1 55.9 66.5 58.7 64.3 61.1" stroke="var(--ocean)" stroke-width="2" stroke-linecap="round"/>
      <path d="M25 65H55L40 45L25 65Z" fill="var(--paper-dark)" stroke="var(--ink)" stroke-width="2"/>
    </svg>`,
    feetcare: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="55" rx="25" ry="15" stroke="var(--ink)" stroke-width="2" fill="var(--cream)"/>
      <path d="M30 35C30 35 35 20 40 20C45 20 50 35 50 35" stroke="var(--terracotta)" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M35 55H45M40 50V60" stroke="var(--olive)" stroke-width="2"/>
    </svg>`,
    rest: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="45" width="50" height="15" rx="2" stroke="var(--ink)" stroke-width="2" fill="var(--sand)" opacity="0.3"/>
      <path d="M20 45V30M60 45V35" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M35 25L45 25M30 15L50 15" stroke="var(--terracotta)" stroke-width="2" opacity="0.6"/>
      <path d="M52 20l4 4m0-4l-4 4M58 14l4 4m0-4l-4 4" stroke="var(--ink)" stroke-width="1.5" opacity="0.4"/>
    </svg>`,
    mind: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 20C25 20 20 35 20 45C20 55 30 65 40 65C50 65 60 55 60 45C60 35 55 20 40 20Z" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M30 35C30 35 35 30 40 30C45 30 50 35 50 35" stroke="var(--terracotta)" stroke-width="2"/>
      <circle cx="33" cy="45" r="3" fill="var(--ink)"/>
      <circle cx="47" cy="45" r="3" fill="var(--ink)"/>
    </svg>`,
    physics: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 60L35 45L45 55L60 30" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="60" cy="30" r="4" fill="var(--terracotta)"/>
      <path d="M25 35L35 35" stroke="var(--olive)" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
    resource: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="20" width="30" height="45" rx="4" stroke="var(--ink)" stroke-width="2.5"/>
      <path d="M35 15H45" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round"/>
      <rect x="30" y="45" width="20" height="15" fill="var(--olive)" opacity="0.8"/>
      <path d="M40 30V40M35 35H45" stroke="var(--terracotta)" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  };
  return svgs[type] ?? '🚶';
}

function renderExercises() {
  const content = document.getElementById('ex-content');
  if (!content) return;

  content.innerHTML = EXERCISES[exTab].map((ex) => `
    <div class="exercise-card">
      <div class="ex-name">${ex.n}</div>
      <div class="ex-dur">${ex.dur}</div>
      <div class="ex-comic">
        <div class="ex-comic-fig" aria-hidden="true">${getExerciseSVG(ex.fig)}</div>
        <div class="ex-comic-txt">${ex.comic}</div>
      </div>
      <ol class="ex-steps">${ex.steps.map((s) => `<li>${s}</li>`).join('')}</ol>
    </div>`).join('');
}

function initExerciseTabs() {
  document.querySelectorAll('.ex-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.ex-tab').forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      exTab = /** @type {'before'|'during'|'mindset'} */ (tab.getAttribute('data-et') ?? 'before');
      renderExercises();
    });
  });
  renderExercises();
}

// ─────────────────────────────────────────────
// APPS SECTION
// ─────────────────────────────────────────────

function buildApps() {
  const cards = APPS.map((a) => `
    <div class="app-card">
      <div class="app-icon" aria-hidden="true">
        ${a.img ? `<img src="${a.img}" alt="${a.n}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">` : `<svg class="icon" style="width:32px;height:32px;"><use href="#icon-${a.i === 'shell' ? 'shell-shape' : a.i}"></svg>`}
      </div>
      <div class="app-info">
        <div class="app-name">${a.n}</div>
        <div class="app-desc">${a.d}</div>
      </div>
      <div class="app-links">
        ${a.ios ? `<a class="app-link" href="${a.ios}" target="_blank" rel="noopener noreferrer">iOS</a>` : ''}
        ${a.and ? `<a class="app-link" href="${a.and}" target="_blank" rel="noopener noreferrer">Android</a>` : ''}
        ${a.web ? `<a class="app-link" href="${a.web}" target="_blank" rel="noopener noreferrer">Web</a>` : ''}
      </div>
    </div>`).join('');

  return `
    <h2 class="section-title">Додатки</h2>
    <div class="section-subtitle">встановити до вильоту</div>
    ${cards}`;
}

// ─────────────────────────────────────────────
// CHECKLIST SECTION
// ─────────────────────────────────────────────

function buildCheck() {
  const saved = getChecklistState();

  const cats = CHECKLIST.map((cat, ci) => {
    const items = cat.items.map((it, ii) => {
      const k = `${ci}-${ii}`;
      const done = saved[k] ?? false;
      const urgClass = it.u === 'critical' ? 'urg-critical' : it.u === 'important' ? 'urg-important' : 'urg-nice';
      const urgLabel = it.u === 'critical' ? 'ТЕРМІНОВО' : it.u === 'important' ? 'ВАЖЛИВО' : 'ПРИЄМНО';

      return `
        <div class="check-item${done ? ' done' : ''}" data-k="${k}"
             role="checkbox" aria-checked="${done}" tabindex="0">
          <div class="check-cb" aria-hidden="true">${done ? '✓' : ''}</div>
          <div>
            <span class="urgency ${urgClass}">${urgLabel}</span>
            <div class="check-task">${it.t}</div>
            <div class="check-detail">${it.d}</div>
          </div>
        </div>`;
    }).join('');

    return `
      <div class="check-category">
        <div class="check-cat-title">${cat.cat}</div>
        <div class="check-cat-sub">${cat.sub}</div>
        ${items}
      </div>`;
  }).join('');

  const total = CHECKLIST.reduce((sum, cat) => sum + cat.items.length, 0);
  const doneCount = Object.values(saved).filter(Boolean).length;
  const pct = Math.round((doneCount / Math.max(total, 1)) * 100);

  return `
    <h2 class="section-title">Чекліст</h2>
    <div class="section-subtitle">що зробити до вильоту</div>
    <div class="check-progress" id="checkProgress">
      <div class="check-progress-bar"><span style="width:${pct}%"></span></div>
      <div class="check-progress-text">${doneCount}/${total} готово · ${pct}%</div>
      <div class="compostela-prep" id="compostelaPrep">${pct === 100 ? 'Compostela підготовки відкрита!' : 'Фініш чекліста відкриє маленьку нагороду.'}</div>
    </div>
    ${cats}`;
}

function initChecklist() {
  const updateProgress = () => {
    const items = [...document.querySelectorAll('.check-item')];
    const done = items.filter((item) => item.classList.contains('done')).length;
    const total = items.length;
    const pct = Math.round((done / Math.max(total, 1)) * 100);
    const bar = document.querySelector('.check-progress-bar span');
    const text = document.querySelector('.check-progress-text');
    const prize = document.getElementById('compostelaPrep');
    if (bar) /** @type {HTMLElement} */ (bar).style.width = `${pct}%`;
    if (text) text.textContent = `${done}/${total} готово · ${pct}%`;
    if (prize) prize.textContent = pct === 100 ? 'Compostela підготовки відкрита!' : 'Фініш чекліста відкриє маленьку нагороду.';
  };

  document.querySelectorAll('.check-item').forEach((el) => {
    const toggle = () => {
      const k = el.getAttribute('data-k') ?? '';
      const done = toggleChecklistItem(k);
      el.classList.toggle('done', done);
      el.setAttribute('aria-checked', String(done));
      const cb = el.querySelector('.check-cb');
      if (cb) cb.textContent = done ? '✓' : '';
      updateProgress();
    };

    el.addEventListener('click', toggle);
    el.addEventListener('keydown', (e) => {
      if (e instanceof KeyboardEvent && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault(); toggle();
      }
    });
  });
}

// ─────────────────────────────────────────────
// HISTORY SECTION
// ─────────────────────────────────────────────

function buildHistory() {
  return `
    <h2 class="section-title">Історія</h2>
    <div class="section-subtitle">Шлях паломника крізь віки</div>

    <div class="hist-card">
      <div class="hist-icon"><svg class="icon"><use href="#icon-star"></svg></div>
      <div class="hist-body">
        <div class="hist-title">Як усе почалося — IX ст.</div>
        <p>У 814 році пастух <strong>Пелайо</strong> побачив дивне сяйво над полем у Галіції. Виявилося — це мощі <strong>апостола Якова (Сантьяго)</strong>, одного з учнів Ісуса. За легендою, після страти в Єрусалимі його тіло привезли в Іспанію на кам'яному човні, керованому ангелами.</p>
        <p>Король <strong>Альфонсо II</strong> побудував першу капличку, згодом — величезна катедра в Сантьяго-де-Компостела. Так почався один із трьох головних паломницьких шляхів Середньовіччя (поряд з Єрусалимом і Римом).</p>
      </div>
    </div>

    <div class="hist-card">
      <div class="hist-icon"><svg class="icon"><use href="#icon-flag-pt"></svg></div>
      <div class="hist-body">
        <div class="hist-title">Чому саме Португальський?</div>
        <p>Португальський шлях (Camino Português) набув популярності з XII ст. після незалежності Португалії. Королі, королеви і звичайні люди йшли ним століттями.</p>
        <p>Найвідоміша — <strong>королева Ізабелла (Свята Єлизавета Португальська)</strong>, яка пройшла шлях, зняла корону біля вівтаря і подарувала її. Це був жест смирення, якого не забули досі.</p>
        <p><svg class="icon" style="font-size:14px;margin-right:3px;"><use href="#icon-mountain"></svg> <strong>Центральний</strong> — через поля, виноградники, старовинні села.<br><svg class="icon" style="font-size:14px;margin-right:3px;"><use href="#icon-wave"></svg> <strong>Прибережний (da Costa)</strong> — з видом на Атлантику, вітер у лице, свіжа риба. <em>Ваш маршрут.</em></p>
      </div>
    </div>

    <div class="section-subtitle">Хронологія Шляху</div>
    <div class="hist-timeline">
      ${[
      { year: '814 р.', text: 'Пастух Пелайо знаходить мощі апостола Якова. Перша каплиця на місці майбутнього Сантьяго.' },
      { year: 'IX–X ст.', text: 'Король Альфонсо II робить перше відоме паломництво. Він вважається першим офіційним пілігримом Камінó. Навіть королі терпіли мозолі.' },
      { year: 'XII ст.', text: 'Португальський шлях набуває популярності. Королева Єлизавета Португальська здійснює паломництво і жертвує корону.' },
      { year: '1502', text: 'Король Мануел I проходить шлях з Лісабона. Від Порту до Сантьяго пішки — справжній королівський рівень.' },
      { year: 'XIX–XX ст.', text: 'Традиція занепадає, потім відроджується. У 1985 Камінó Францеський отримує статус першого Культурного маршруту Ради Європи.' },
      { year: '1993', text: 'Камінó — об\'єкт Всесвітньої спадщини ЮНЕСКО. Щорічно зростає на тисячі паломників.' },
      { year: 'Сьогодні', text: '<strong>250,000+ паломників</strong> отримують Compostela щороку. Мінімум 100 км пішки (або 200 км велосипедом). Ти серед них!' },
    ].map((e) => `
        <div class="hist-tl-item">
          <div class="hist-tl-year">${e.year}</div>
          <div class="hist-tl-text">${e.text}</div>
        </div>`).join('')}
    </div>

    <div class="section-subtitle">Цікаві факти</div>
    <div class="hist-fact-grid">
      ${[
      { icon: 'shell-shape', text: '<strong>Мушля — головний символ.</strong> Її носили на рюкзаку, щоб показати: «Я — пілігрим». За легендою, мушлі приносило хвилями саме до Сантьяго. Тепер вона на твоєму рюкзаку.' },
      { icon: 'icon-scroll', text: '<strong>Жовті стрілки</strong> малювали волонтери задовго до Google Maps і GPS. Зараз вони мільйони по всіх маршрутах. Хтось малює ночами до цих пір.' },
      { icon: 'icon-flag-ua', text: '<strong>Українці теж ходять!</strong> У 2015-му в Україні почали маркувати свій відрізок Шляху (Львів — Шегині). Камінó тепер справді до дому.' },
      { icon: 'icon-roman', text: '<strong>Римські дороги</strong> лягли в основу багатьох ділянок маршруту в Північній Португалії (Via XIX). Ти буквально йдеш слідами римських легіонів.' },
      { icon: 'icon-happy', text: '<strong>Факт для мемів:</strong> першим офіційним пілігримом вважають короля Альфонсо II (814 р). Тобто навіть королі терпіли мозолі й альберге без WiFi.' },
      { icon: 'icon-compass', text: '<strong>Сьогодні Camino — це не тільки релігія.</strong> Хтось іде за духовністю, хтось — «перезавантажити» голову, хтось просто хоче пригоди. Buen Camino не про дистанцію, а про те, ким ти станеш на фініші.' },
    ].map((f) => `
        <div class="hist-fact">
          <div class="hist-fact-icon"><svg class="icon"><use href="#${f.icon}"></svg></div>
          <div class="hist-fact-text">${f.text}</div>
        </div>`).join('')}
    </div>`;
}

// ─────────────────────────────────────────────
// SAFETY SECTION
// ─────────────────────────────────────────────

function buildSafety() {
  return `
    <h2 class="section-title">Безпека</h2>
    <div class="section-subtitle">правила і корисне</div>

    <div class="safety-emergency">
      <div class="safety-emergency-title"><svg class="icon" style="margin-right:5px;color:var(--terracotta);"><use href="#icon-sos"></svg> Екстрені номери</div>
      <div class="safety-num">
        <div class="safety-num-item"><span class="safety-num-val">112</span><div class="safety-num-desc">Єдиний ЄС (без SIM!)</div></div>
        <div class="safety-num-item"><span class="safety-num-val">113</span><div class="safety-num-desc">INEM Португалія</div></div>
        <div class="safety-num-item"><span class="safety-num-val">091</span><div class="safety-num-desc">Polizia Nacional ES</div></div>
        <div class="safety-num-item"><span class="safety-num-val">062</span><div class="safety-num-desc">Guardia Civil ES</div></div>
      </div>
    </div>

    <div class="safety-card warning">
      <div class="safety-title"><svg class="icon" style="margin-right:5px;"><use href="#icon-wave"></svg> Безпека на пляжі</div>
      <div class="safety-body">
        <p>Атлантика небезпечна — не плутай з Середземним морем!</p>
        <ul>
          <li><strong><span style="color:#2ecc71;">⬤</span> Зелений прапор</strong> — можна купатися</li>
          <li><strong><span style="color:#f1c40f;">⬤</span> Жовтий прапор</strong> — тільки по коліна, хвилі</li>
          <li><strong><span style="color:#e74c3c;">⬤</span> Червоний прапор</strong> — суворо заборонено</li>
          <li><strong>Rip current (відбійна течія):</strong> не пливи проти — пливи ПАРАЛЕЛЬНО берегу, потім по діагоналі назад</li>
          <li>Температура води: 17-18°C — холодна. Судоми можливі</li>
          <li>Остерігайся <strong>peixe-aranha</strong> (lesser weever) — отруйна риба в піску
            <div class="peixe-thumb" onclick="window.openPeixeLb && window.openPeixeLb()" role="button" tabindex="0" aria-label="Показати фото peixe-aranha">
              <img src="assets/files/peixe.jpg" alt="Peixe-aranha" loading="lazy">
              <div class="peixe-hint"><svg class="icon" style="font-size:12px;margin-right:3px;"><use href="#icon-eye"></svg> Натисни — побачиш більше</div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="safety-card tip">
      <div class="safety-title"><svg class="icon" style="margin-right:5px;"><use href="#icon-foot"></svg> Профілактика пухирів</div>
      <div class="safety-body">
        <ul>
          <li><strong>Compeed + Leukotape P</strong> на проблемні місця до старту — профілактично</li>
          <li>Vaseline / Body Glide на пальці, п'ятки і між пальцями — щоранку</li>
          <li>Двошарові шкарпетки або якісний мерінос (Smartwool, Darn Tough)</li>
          <li>Кросівки на <strong>+0.5 розміру</strong> — ноги набрякають після 10 км</li>
          <li>Якщо пухир: стерильна голка збоку → нитка для дренажу → Compeed зверху</li>
          <li>Щовечора: помити ноги, провітрити, масаж</li>
        </ul>
      </div>
    </div>

    <div class="safety-card info">
      <div class="safety-title"><svg class="icon" style="margin-right:5px;"><use href="#icon-sun"></svg> Спека і сонце</div>
      <div class="safety-body">
        <ul>
          <li><strong>UV індекс 8+ (дуже високий)</strong> — SPF 50+ обов'язково. Ре-аплікація кожні 2 год</li>
          <li>Стартувати о <strong>6:00-6:30</strong>, фінішувати до 13:00-14:00 — уникати пікової спеки</li>
          <li>Норма води: <strong>2-3 літри/день</strong>. Пити до появи спраги, не після</li>
          <li>Електроліти (SaltStick, Hydralyte) — попереджають судоми при сильній спеці</li>
          <li><strong>Ознаки теплового удару:</strong> запаморочення, нудота, темна сеча → знайти тінь, пити, охолодити шию і зап'ястки холодною водою</li>
        </ul>
      </div>
    </div>

    <div class="safety-card tip">
      <div class="safety-title"><svg class="icon" style="margin-right:5px;"><use href="#icon-backpack"></svg> Безпека речей</div>
      <div class="safety-body">
        <ul>
          <li>Документи і готівка — у <strong>money belt</strong> на тілі або в потайній кишені рюкзака</li>
          <li>Розподіли кошти між учасниками — на випадок втрати</li>
          <li>В альберге: замок-карабін на рюкзак або речі у спальнику</li>
          <li>Фото копії документів у хмарі (Google Drive) — на всякий випадок</li>
          <li>Revolut/Wise карта — оптимальний обмінний курс, без комісій за кордоном</li>
        </ul>
      </div>
    </div>

    <div class="safety-card info">
      <div class="safety-title"><svg class="icon" style="margin-right:5px;"><use href="#icon-bandage"></svg> Мінімальна аптечка</div>
      <div class="safety-body">
        <ul>
          <li>Compeed Mixed Pack × 2-3 упаковки</li>
          <li>Leukotape P (краща стрічка для гарячих точок)</li>
          <li>Vaseline 50 мл</li>
          <li>Ibuprofen 400 мг × 20 таб (біль, запалення)</li>
          <li>Paracetamol (температура, головний біль)</li>
          <li>Voltaren Gel 50 г (м'язи і суглоби)</li>
          <li>Імодіум (діарея — від незвичної їжі)</li>
          <li>Антигістамін Цетрин × 10 (алергія, комахи)</li>
          <li>Стерильна голка + нитка + йод (пухирі)</li>
        </ul>
      </div>
    </div>

    <div class="safety-card warning">
      <div class="safety-title"><svg class="icon" style="margin-right:5px;"><use href="#icon-dog"></svg> Собаки і тварини</div>
      <div class="safety-body">
        <ul>
          <li>На сільських ділянках маршруту можуть зустрічатися фермерські собаки</li>
          <li>Не біжи, не дивись в очі — стій спокійно або відходь повільно</li>
          <li>Трекінгові палиці можна підняти для захисту</li>
          <li>В Галісії бувають корови прямо на маршруті — обходь спокійно</li>
        </ul>
      </div>
    </div>

    <div class="safety-card tip">
      <div class="safety-title"><svg class="icon" style="margin-right:5px;"><use href="#icon-phone"></use></svg> Зв'язок і навігація</div>
      <div class="safety-body">
        <ul>
          <li><strong>What3Words</strong> — найточніша локація для екстрених служб</li>
          <li><strong>AlertCops</strong> — прямий зв'язок з іспанською поліцією</li>
          <li>WiFi є в більшості альберге (повільний у пік-години)</li>
          <li>eSIM Airalo або Holafly — PT+ES в одній SIM без переключення</li>
          <li>Завантаж офлайн карти Google Maps заздалегідь!</li>
        </ul>
      </div>
    </div>`;
}

// ─────────────────────────────────────────────
// PLAYLIST SECTION
// ─────────────────────────────────────────────

function buildPlaylist() {
  return `
    <h2 class="section-title">Плейлист</h2>
    <div class="section-subtitle">музика Камінó</div>

    <div class="section-subtitle" style="margin-top:8px;">Слухати зараз <svg class="icon" style="font-size:14px;"><use href="#icon-headset"></svg></div>
    <iframe
      style="border-radius:12px;margin-bottom:20px;"
      src="https://open.spotify.com/embed/playlist/6KaNjx2EGlYG3YrmNHV25X?utm_source=generator&theme=0"
      width="100%" height="352" frameborder="0"
      allowfullscreen
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      title="Camino Português playlist на Spotify">
    </iframe>

    <div style="background:var(--paper);border-radius:4px;padding:16px;margin-top:16px;border:1px solid var(--paper-dark);text-align:center;">
      <p style="font-family:'Caveat',cursive;font-size:20px;color:var(--terracotta);margin-bottom:6px;"><svg class="icon" style="margin-right:5px;"><use href="#icon-headset"></svg> Порада</p>
      <p style="font-size:13px;color:var(--ink-soft);line-height:1.6;">
        Закачай плейлист офлайн у Spotify Premium перед вильотом. Сигнал часто зникає
        на прибережних ділянках. І обов'язково: Madredeus на заході сонця в Caminha — це окремий досвід.
      </p>
    </div>`;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function getBlisterText(value) {
  return BLISTER_TEXTS[Math.min(parseInt(String(value)), 10)];
}

// ─────────────────────────────────────────────
// WISDOM MODAL
// ─────────────────────────────────────────────

function initWisdomModal() {
  const modal = document.getElementById('wisdomModal');
  const close = document.getElementById('wisdomModalClose');
  const body = document.getElementById('wisdomModalBody');
  if (!modal || !body) return;

  const wisdom = 'Кожен штамп - маленька перемога над диваном.';
  const order = 'випити воду до першої кави';

  body.innerHTML = `
    <div class="wisdom-title"><svg class="icon" style="margin-right:5px;"><use href="#icon-lightbulb"></svg> Мудрість дня</div>
    <div class="wisdom-text">${wisdom}</div>
    <div class="wisdom-order-title"><svg class="icon" style="margin-right:5px;"><use href="#icon-scroll"></svg> Наказ дня</div>
    <div class="wisdom-order-text">${order}</div>
    <button class="tool-btn" id="wisdomUnderstandBtn" style="margin-top:20px;width:100%;">Зрозумів!</button>
  `;

  if (!sessionStorage.getItem('wisdomShown_v2')) {
    setTimeout(() => {
      modal.classList.add('visible');
      sessionStorage.setItem('wisdomShown_v2', 'true');
    }, 1000);
  }

  const hide = () => modal.classList.remove('visible');
  close?.addEventListener('click', hide);
  document.getElementById('wisdomUnderstandBtn')?.addEventListener('click', hide);
  modal.addEventListener('click', (e) => { if (e.target === modal) hide(); });
}

function buildBooking() {
  const booked = ROUTE.flatMap((day) => day.albs
    .filter((a) => a.c?.includes('ЗАБРОНЬОВАНО'))
    .map((alb) => ({ day, alb })));

  return `
    <h2 class="section-title">Бронювання</h2>
    <div class="section-subtitle">Всі ваші зупинки в одному місці</div>
    <div class="booking-list">
      ${booked.map(({ day, alb }) => {
    const cleanComment = (alb.c ?? '').replace('(ЗАБРОНЬОВАНО)', '').replace('ЗАБРОНЬОВАНО', '').trim();
    return `
        <div class="booking-item">
          <div class="booking-date">${day.date} · ${day.day}</div>
          <div class="booking-main">
            <div class="booking-name">${alb.n}</div>
            <div class="booking-price">${alb.p}</div>
          </div>
          ${cleanComment ? `<div class="booking-comment">${cleanComment}</div>` : ''}
          <div class="booking-actions">
            <a href="${alb.m}" target="_blank" class="tool-btn mini">Мапа</a>
            ${alb.b ? `<a href="${alb.b}" target="_blank" class="tool-btn mini accent">Бронювання</a>` : ''}
          </div>
        </div>
      `}).join('')}
    </div>
  `;
}

/**
 * Replaces common emojis with their SVG counterparts or strips them.
 * @param {string} text
 * @returns {string}
 */
export function injectIcons(text) {
  if (!text) return '';
  let result = text;
  
  const mapping = {
    '🍽️': 'food',
    '🚶': 'walk',
    '🛥️': 'boat',
    '⚡': 'bolt',
    '🎆': 'sparkles',
    '🎸': 'guitar',
    '🛫': 'plane',
    '⚠️': 'warning',
    '🤫': 'shush',
    '📍': 'pin',
    '⛪': 'church',
    '🧗': 'mountain',
    '🐚': 'shell-shape',
    '🦴': 'bandage',
    '🎒': 'backpack'
  };

  Object.entries(mapping).forEach(([emoji, icon]) => {
    const regex = new RegExp(emoji, 'g');
    result = result.replace(regex, `<svg class="icon" style="width:1.1em;height:1.1em;vertical-align:text-bottom;margin-right:2px;"><use href="#icon-${icon}"></svg>`);
  });

  return result;
}
