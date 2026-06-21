
import { PILGRIMS } from '../config.js';
import { applyNightMode } from '../utils.js';

// ─────────────────────────────────────────────────────────────
// Field Debugger
// ─────────────────────────────────────────────────────────────

/** Render the error log overlay. Called after 5 rapid taps on the header title. */
async function showErrorLog() {
  // Dynamic import keeps storage.js out of the regular module graph for this UI file
  const { getErrorsFromDB, clearErrorsFromDB } = await import('../storage.js');
  const errors = await getErrorsFromDB();

  // Newest first, cap at 20 entries
  const recent = errors.slice().reverse().slice(0, 20);

  // Remove existing overlay if present
  document.getElementById('field-debugger-overlay')?.remove();

  const overlay = document.createElement('div');
  overlay.id = 'field-debugger-overlay';
  Object.assign(overlay.style, {
    position:   'fixed',
    inset:      '0',
    zIndex:     '999999',
    background: '#000',
    color:      '#e0e0e0',
    fontFamily: 'monospace',
    fontSize:   '12px',
    lineHeight: '1.5',
    overflowY:  'auto',
    padding:    '16px',
    boxSizing:  'border-box',
  });

  const toolbar = `
    <div style="display:flex;align-items:center;justify-content:space-between;
                 padding-bottom:12px;border-bottom:1px solid #333;margin-bottom:12px;">
      <strong style="font-size:14px;color:#b04632;">&#x1F41E; Field Debugger — ${recent.length} / ${errors.length} помилок</strong>
      <span style="display:flex;gap:8px;">
        <button id="fd-clear-btn" style="background:#b04632;color:#fff;border:none;
          border-radius:4px;padding:6px 12px;cursor:pointer;font-family:monospace;font-size:12px;">
          Очистити
        </button>
        <button id="fd-close-btn" style="background:#333;color:#e0e0e0;border:none;
          border-radius:4px;padding:6px 12px;cursor:pointer;font-family:monospace;font-size:12px;">
          ✕ Закрити
        </button>
      </span>
    </div>`;

  const rows = recent.length === 0
    ? '<p style="color:#666;font-style:italic;">Помилок не знайдено. Все чисто! ✨</p>'
    : recent.map((err, i) => `
      <div style="margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid #1a1a1a;">
        <div style="color:#888;margin-bottom:4px;">
          #${recent.length - i} &nbsp;•&nbsp;
          <span style="color:#e0c060;">${err.type}</span> &nbsp;•&nbsp;
          ${new Date(err.timestamp).toLocaleString('uk-UA')}
        </div>
        <div style="color:#ff6b6b;margin-bottom:4px;">${escHtml(err.message)}</div>
        ${err.stack ? `<pre style="margin:0;color:#666;font-size:11px;white-space:pre-wrap;word-break:break-all;">${escHtml(err.stack)}</pre>` : ''}
      </div>`).join('');

  overlay.innerHTML = toolbar + rows;
  document.body.appendChild(overlay);

  document.getElementById('fd-close-btn').addEventListener('click', () => overlay.remove());
  document.getElementById('fd-clear-btn').addEventListener('click', async () => {
    await clearErrorsFromDB();
    overlay.remove();
  });
}

/** HTML-escape helper to safely display error messages. */
function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Attach 5-rapid-tap trigger to .header-title.
 * Inter-tap gap must be ≤ 400 ms; resets automatically on timeout or after 5 taps.
 */
export function initFieldDebugger() {
  const title = document.querySelector('.header-title');
  if (!title) return;

  let tapCount = 0;
  let lastTap  = 0;
  const THRESHOLD = 5;
  const GAP_MS    = 400;

  title.addEventListener('click', () => {
    const now = Date.now();
    if (now - lastTap > GAP_MS) {
      tapCount = 0; // reset on slow tap
    }
    lastTap = now;
    tapCount++;
    if (tapCount >= THRESHOLD) {
      tapCount = 0;
      showErrorLog();
    }
  });
}


export const NAV_TABS = [
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

export const NAV_ICONS = {
  route: 'map', booking: 'bed', history: 'scroll', pilgrims: 'walk',
  dict: 'globe', food: 'food', exercises: 'bolt', apps: 'phone',
  safety: 'shield', playlist: 'headset', check: 'check',
};

export function navIcon(tabId) {
  const icon = NAV_ICONS[tabId] ?? 'shell-shape';
  return `<span class="nav-icon" aria-hidden="true"><svg class="icon"><use href="#icon-${icon}"></use></svg></span>`;
}

export function buildNav() {
  const tabs = NAV_TABS.map((t, i) =>
    `<button class="nav-tab${i === 0 ? ' active' : ''}" data-s="${t.id}" role="tab" aria-selected="${i === 0}" aria-controls="s-${t.id}">${navIcon(t.id)}<span class="nav-label">${t.label}</span></button>`
  ).join('');

  return `
  <div class="nav-wrapper" role="tablist">
    <button class="nav-arrow left" id="navArrowLeft" aria-label="Прокрутити вліво"><svg class="icon"><use href="#icon-left"></svg></button>
    <nav class="nav-tabs" id="navTabs">${tabs}</nav>
    <button class="nav-arrow right" id="navArrowRight" aria-label="Прокрутити вправо"><svg class="icon"><use href="#icon-right"></svg></button>
  </div>`;
}

export function initNavArrows() {
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

export function buildHeader(p, id) {
  const initial = id === 'guest' ? 'В' : p.initial;
  const name = id === 'guest' ? 'Вуаєрист' : p.name;
  const isNight = document.body.classList.contains('night-mode');
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
      <button class="night-toggle-header" id="nightToggleH" title="Нічний режим" aria-label="Перемкнути нічний режим">
        <svg class="icon"><use href="#icon-${isNight ? 'sun' : 'moon'}"></svg>
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

export function initUserMenu() {
  const badge = document.getElementById('userBadge');
  const menu = document.getElementById('userMenu');
  const logoutBtn = document.getElementById('logoutBtn');
  if (!badge || !menu || !logoutBtn) return;

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

  logoutBtn.addEventListener('click', () => {
    import('../storage.js').then(({ clearSavedPilgrim }) => {
      clearSavedPilgrim();
      location.reload();
    });
  });

  document.addEventListener('click', () => {
    menu.classList.remove('show');
    badge.setAttribute('aria-expanded', 'false');
  });

  const nightBtn = document.getElementById('nightToggleH');
  if (nightBtn) {
    nightBtn.addEventListener('click', () => {
      applyNightMode(!document.body.classList.contains('night-mode'));
    });
  }

  // Activate the 5-tap Field Debugger trigger on the header title
  initFieldDebugger();
}

export function buildHero(p, id) {
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
