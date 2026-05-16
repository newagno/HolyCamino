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
} from './storage.js';
import { renderApp, buildPilgrimList } from './ui.js';
import {
  startCountdown,
  initParallax,
  initScrollTop,
  initOcean,
  initPeixeLightbox,
  initClickRipple,
  applyNightMode,
  shouldAutoNight,
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
  console.log('Booting app...');
  // Apply night-mode before anything renders
  if (shouldAutoNight()) applyNightMode(true);

  // Initialise always-on helpers
  initScrollTop();
  initOcean();
  initPeixeLightbox();
  initClickRipple();
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
}

/**
 * Move from the pilgrim-choice step to entering the app.
 * @param {string} pilgrimId
 */
function handlePilgrimSelect(pilgrimId) {
  console.log('Pilgrim selected:', pilgrimId);
  if (!pilgrimId || !PILGRIMS[pilgrimId]) {
    console.warn('Invalid pilgrim ID:', pilgrimId);
    return;
  }

  selectedPilgrim = pilgrimId;
  setSavedPilgrim(selectedPilgrim);
  enterApp(selectedPilgrim);
}

// ─────────────────────────────────────────────────────────────
// App entry
// ─────────────────────────────────────────────────────────────

/**
 * Transition from login to the main app.
 * @param {string} id - Pilgrim ID key from PILGRIMS
 */
function enterApp(id) {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('app').classList.add('visible');

  // Render the full UI
  renderApp(id);

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
export function logout() {
  clearSavedPilgrim();
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
// Boot
// ─────────────────────────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

function initOfflineCache() {
  if (!('serviceWorker' in navigator)) return;
  if (!location.protocol.startsWith('http')) return;
  
  navigator.serviceWorker.register('./sw.js').catch(() => {
    // Offline cache is a nice-to-have
  });

  // Automatically reload when a new service worker takes control
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}
