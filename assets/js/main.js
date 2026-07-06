/**
 * @file main.js
 * @description Entry point for "Твою ж Каміно!" pilgrim app.
 *   Handles login flow, session restore, and bootstraps the UI + sub-systems.
 *
 * Module dependency graph:
 *   main.js
 *     ├── config.js      (pure data — PILGRIMS, ROUTE, …)
 *     ├── storage.js     (localStorage wrappers)
 *     ├── ui.js          (renderApp + all section builders)
 *     ├── utils.js       (countdown, weather, ocean, parallax, confetti)
 *     └── easterEggs.js  (konami, long-press, memes, birthday, The Way)
 */

import { PILGRIMS } from './config.js';
import {
  getSavedPilgrim,
  setSavedPilgrim,
  clearSavedPilgrim,
  initStorage,
  flushPendingWrites,
  logErrorToDB,
} from './storage.js';
import { renderApp } from './ui/index.js';
import {
  startCountdown,
  initParallax,
  initScrollTop,
  initOcean,
  initPeixeLightbox,
  applyTheme,
  applyNightMode,
  shouldAutoNight,
  log
} from './utils.js';
import {
  initKonamiCode,
  initLogoLongPress,
  initMemesModal,
  initBirthdayOverlay,
  maybeShowBirthday,
  activateTheWayMode,
  isTheWayActive,
  initTheWayAudio,
} from './easterEggs.js';

// ─────────────────────────────────────────────────────────────
// Global Error Interceptors (Field Debugger)
// ─────────────────────────────────────────────────────────────

window.addEventListener('error', (event) => {
  logErrorToDB({
    timestamp: Date.now(),
    type: 'window.error',
    message: event.message ?? String(event.error),
    stack: event.error?.stack ?? `${event.filename}:${event.lineno}:${event.colno}`,
  }).catch(() => {});
});

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  logErrorToDB({
    timestamp: Date.now(),
    type: 'promise.rejection',
    message: reason instanceof Error ? reason.message : String(reason),
    stack: reason instanceof Error ? (reason.stack ?? '') : '',
  }).catch(() => {});
});

// ─────────────────────────────────────────────────────────────
// Internal state
// ─────────────────────────────────────────────────────────────

/** @type {string|null} */
let selectedPilgrim = null;

/** @type {number} */
let pwAttempts = 0;

/** @type {boolean} */
let pwVisible = false;

// ─────────────────────────────────────────────────────────────
// Bootstraps (called after DOM ready)
// ─────────────────────────────────────────────────────────────

/**
 * Boot: run on DOMContentLoaded.
 * Applies night mode, initialises global helpers, then either
 * restores a saved session or shows the login screen.
 */
function boot() {
  log('Booting app...');
  // Apply theme before anything renders
  const savedTheme = localStorage.getItem('camino_theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (shouldAutoNight()) {
    applyTheme('dark');
  }

  // Initialise always-on helpers
  initScrollTop();
  initOcean();
  initPeixeLightbox();
  initBirthdayOverlay();
  initMemesModal();
  initTheWayAudio();
  initOfflineCache();

  // Attempt to restore saved pilgrim
  const saved = getSavedPilgrim();
  if (saved && PILGRIMS[saved]) {
    enterApp(saved);
  } else {
    initLoginScreen();
  }
}

// ─────────────────────────────────────────────────────────────
// Login
// ─────────────────────────────────────────────────────────────

/** Wire up all interactive elements on the login screen. */
function initLoginScreen() {
  const stepChoose = document.getElementById('step-choose');
  if (stepChoose) {
    stepChoose.addEventListener('click', (e) => {
      const btn = e.target.closest('.pilgrim-btn');
      if (btn) handlePilgrimSelect(btn.dataset.pilgrim);
    });
  }

  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      document.getElementById('step-password')?.classList.remove('active');
      const stepChooseDiv = document.getElementById('step-choose');
      if (stepChooseDiv) stepChooseDiv.style.display = 'block';
      selectedPilgrim = null;
    });
  }

  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) {
    submitBtn.addEventListener('click', checkPassword);
  }

  const passwordInput = document.getElementById('passwordInput');
  if (passwordInput) {
    passwordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') checkPassword();
    });
  }

  const pwToggle = document.getElementById('pwToggle');
  if (pwToggle) {
    pwToggle.addEventListener('click', () => {
      const inp = /** @type {HTMLInputElement} */ (document.getElementById('passwordInput'));
      if (inp) {
        pwVisible = !pwVisible;
        inp.type = pwVisible ? 'text' : 'password';
        pwToggle.textContent = pwVisible ? '🙈' : '👁';
      }
    });
  }
}

/**
 * Move from the pilgrim-choice step to entering the app.
 * @param {string} pilgrimId
 */
function handlePilgrimSelect(pilgrimId) {
  log('Pilgrim selected:', pilgrimId);
  if (!pilgrimId || !PILGRIMS[pilgrimId]) {
    log('Invalid pilgrim ID:', pilgrimId);
    return;
  }

  selectedPilgrim = pilgrimId;
  pwAttempts = 0;
  const p = PILGRIMS[selectedPilgrim];

  // If password is empty (e.g. guest), log in directly
  if (!p.password) {
    setSavedPilgrim(selectedPilgrim);
    enterApp(selectedPilgrim);
    return;
  }

  // Otherwise show password step
  const welcomeText = document.getElementById('passwordWelcome');
  if (welcomeText) welcomeText.textContent = `Вітаємо, ${p.name}!`;

  const hintText = document.getElementById('passwordHint');
  if (hintText) hintText.textContent = p.hint || '';

  const passwordInput = /** @type {HTMLInputElement} */ (document.getElementById('passwordInput'));
  if (passwordInput) passwordInput.value = '';

  const errorText = document.getElementById('passwordError');
  if (errorText) {
    errorText.classList.remove('show');
    errorText.textContent = 'Не той пароль. Спробуй ще раз!';
  }

  const stepChoose = document.getElementById('step-choose');
  if (stepChoose) stepChoose.style.display = 'none';

  const stepPassword = document.getElementById('step-password');
  if (stepPassword) {
    stepPassword.classList.add('active');
    setTimeout(() => passwordInput?.focus(), 100);
  }
}

function checkPassword() {
  const passwordInput = /** @type {HTMLInputElement} */ (document.getElementById('passwordInput'));
  if (!passwordInput || !selectedPilgrim) return;

  const val = passwordInput.value.trim().toLowerCase();
  const correct = PILGRIMS[selectedPilgrim].password.toLowerCase();

  if (val === correct || val.replace(/\s/g, '').includes('сантьяго')) {
    pwAttempts = 0;

    if (val.replace(/\s/g, '').includes('сантьяго')) {
      activateTheWayMode();
    }

    setSavedPilgrim(selectedPilgrim);
    enterApp(selectedPilgrim);
  } else {
    pwAttempts++;
    const errorText = document.getElementById('passwordError');
    if (errorText) {
      if (pwAttempts >= 3) {
        errorText.textContent = `Ти шо не можеш правильно написати "${correct}"?`;
      } else {
        errorText.textContent = 'Не той пароль. Спробуй ще раз!';
      }
      errorText.classList.remove('show');
      setTimeout(() => errorText.classList.add('show'), 10);
    }
  }
}

// ─────────────────────────────────────────────────────────────
// App entry
// ─────────────────────────────────────────────────────────────

/**
 * Transition from login to the main app.
 * @param {string} id - Pilgrim ID key from PILGRIMS
 */
async function enterApp(id) {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('app').classList.add('visible');

  // Render the full UI
  await renderApp(id);

  // Ensure we start at the top of the page
  window.scrollTo(0, 0);

  // Start live helpers
  startCountdown();
  initParallax();

  // Easter eggs
  initKonamiCode();
  initLogoLongPress();   // logo long-press uses #heroLogoEgg rendered by ui.js

  // Birthday check (only relevant for Олекса on 24.07.2026)
  maybeShowBirthday(id);
}

// ─────────────────────────────────────────────────────────────
// Logout (exposed globally for onclick in rendered HTML)
// ─────────────────────────────────────────────────────────────

/**
 * Clear the saved session and reload the page.
 */
export async function logout() {
  await clearSavedPilgrim();
  location.reload();
}

// Make logout available to inline onclick attributes rendered by ui.js
window.logout = logout;

// ─────────────────────────────────────────────────────────────
// User menu (exposed globally for onclick in rendered HTML)
// ─────────────────────────────────────────────────────────────

export function toggleUserMenu() {
  const m = document.getElementById('userMenu');
  if (m) m.classList.toggle('show');
}
window.toggleUserMenu = toggleUserMenu;

/** Close the user menu on any outside click. */
document.addEventListener('click', e => {
  if (!e.target.closest('.user-badge')) {
    const m = document.getElementById('userMenu');
    if (m) m.classList.remove('show');
  }
});

// ─────────────────────────────────────────────────────────────
// Event listeners
// ─────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  await initStorage();
  boot();
});

// Immediately intercept and flush pending debounced IndexedDB writes 
// if the user closes/minimizes the app within the 500ms debounce window.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    flushPendingWrites();
  }
});



// ─────────────────────────────────────────────────────────────
// Boot
// ─────────────────────────────────────────────────────────────

/**
 * Shows a non-blocking update banner when a new Service Worker is waiting.
 * User explicitly triggers the reload — no surprise interruptions.
 * @param {ServiceWorker} worker - The waiting (installed) Service Worker
 */
function showUpdateBanner(worker) {
  // Prevent duplicates if called multiple times
  if (document.getElementById('sw-update-banner')) return;

  const banner = document.createElement('div');
  banner.id = 'sw-update-banner';
  Object.assign(banner.style, {
    position:        'fixed',
    bottom:          '0',
    left:            '0',
    right:           '0',
    zIndex:          '99999',
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'space-between',
    gap:             '12px',
    padding:         '14px 20px',
    background:      '#000000',
    borderTop:       '1px solid #333',
    boxShadow:       '0 -4px 24px rgba(0,0,0,0.6)',
    fontFamily:      'Manrope, sans-serif',
    fontSize:        '14px',
    color:           '#e0e0e0',
    animation:       'sw-slide-up 0.35s cubic-bezier(.22,1,.36,1) both',
  });

  // Inject keyframe once
  if (!document.getElementById('sw-banner-style')) {
    const style = document.createElement('style');
    style.id = 'sw-banner-style';
    style.textContent = `
      @keyframes sw-slide-up {
        from { transform: translateY(100%); opacity: 0; }
        to   { transform: translateY(0);   opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  banner.innerHTML = `
    <span style="display:flex;align-items:center;gap:8px;">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b04632"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
      Доступна нова версія маршруту
    </span>
    <button id="sw-update-btn" style="
      padding: 8px 18px;
      background: #b04632;
      color: #fff;
      border: none;
      border-radius: 6px;
      font-family: Manrope, sans-serif;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.2s;
    ">Оновити</button>
  `;

  document.body.appendChild(banner);

  const btn = document.getElementById('sw-update-btn');
  if (btn) {
    btn.addEventListener('mouseenter', () => { btn.style.background = '#c8553d'; });
    btn.addEventListener('mouseleave', () => { btn.style.background = '#b04632'; });
    btn.addEventListener('click', () => {
      btn.textContent = '...';
      btn.disabled = true;
      worker.postMessage({ type: 'SKIP_WAITING' });
    });
  }
}

function initOfflineCache() {
  if (!navigator.serviceWorker) return;
  if (!location.protocol.startsWith('http')) return;

  // Auto-reload the moment the new SW takes control
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return; // Guard against double-reload
    reloading = true;
    window.location.reload();
  });

  navigator.serviceWorker.register('./sw.js')
    .then((reg) => {
      // Trigger an immediate network check for a new sw.js
      reg.update();

      // Track any worker discovered during this session
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // A new SW is waiting AND there is an existing controller:
            // this is a genuine update (not first install) — notify the user.
            showUpdateBanner(newWorker);
          }
        });
      });
    })
    .catch((err) => {
      log('SW registration failed:', err);
    });
}

