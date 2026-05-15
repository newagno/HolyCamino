/**
 * @fileoverview easterEggs.js — All hidden features and surprises:
 *   • Shell click counter → memes modal
 *   • Konami code → shell rain
 *   • Logo long-press → shell rain (mobile)
 *   • "сантьяго" password → The Way film-noir mode
 *   • Birthday overlay for Олекса on 24.07.2026
 *
 * @module easterEggs
 */

import { startConfetti } from './utils.js';

// ─────────────────────────────────────────────
// THE WAY MODE  (film-noir Easter egg)
// ─────────────────────────────────────────────

/** @type {boolean} */
let theWayActive = false;

/** @returns {boolean} */
export function isTheWayActive() { return theWayActive; }

/**
 * Activate The Way film-noir mode.
 * Adds `.the-way-mode` to `<body>`.
 */
export function activateTheWayMode() {
  theWayActive = true;
  document.body.classList.add('the-way-mode');

  // Show The Way toggle and hide ocean toggle
  const toggle = document.getElementById('theWayToggle');
  const oceanToggle = document.getElementById('oceanToggle');
  const audio = /** @type {HTMLAudioElement} */ (document.getElementById('theWayAudio'));

  if (toggle) {
    toggle.style.display = 'flex';
  }
  if (oceanToggle) oceanToggle.style.display = 'none';

  if (audio && toggle) {
    audio.volume = 0.4;
    audio.play().then(() => {
      toggle.textContent = '🌩️';
      toggle.title = 'Вимкнути звук шторму';
      toggle.setAttribute('aria-label', 'Вимкнути звук шторму');
      toggle.classList.add('playing');
    }).catch(() => {
      toggle.textContent = '🌩️';
      toggle.title = 'Увімкнути звук шторму';
      toggle.setAttribute('aria-label', 'Увімкнути звук шторму');
      toggle.classList.remove('playing');
    });
  }

  startLightningLoop();
}

/**
 * Periodically triggers a lightning flash effect.
 */
function startLightningLoop() {
  if (!theWayActive) return;

  // Random interval between 4 and 12 seconds
  const nextFlash = 4000 + Math.random() * 8000;

  setTimeout(() => {
    if (!theWayActive) return;

    document.body.classList.add('lightning-strike');

    // Remove class after animation ends (0.4s)
    setTimeout(() => {
      document.body.classList.remove('lightning-strike');
      startLightningLoop();
    }, 500);
  }, nextFlash);
}

export function initTheWayAudio() {
  const btn = document.getElementById('theWayToggle');
  const audio = /** @type {HTMLAudioElement} */ (document.getElementById('theWayAudio'));
  if (!btn || !audio) return;

  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.volume = 0.4;
      audio.play().then(() => {
        btn.textContent = '🌩️';
        btn.title = 'Вимкнути звук шторму';
        btn.setAttribute('aria-label', 'Вимкнути звук шторму');
        btn.classList.add('playing');
      }).catch(() => { });
    } else {
      audio.pause();
      audio.currentTime = 0;
      btn.textContent = '🌩️';
      btn.title = 'Увімкнути звук шторму';
      btn.setAttribute('aria-label', 'Увімкнути звук шторму');
      btn.classList.remove('playing');
    }
  });
}

// ─────────────────────────────────────────────
// KONAMI / SHELL RAIN
// ─────────────────────────────────────────────

const KONAMI_SEQUENCE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];
const RAIN_EMOJIS = ['🐚', '⭐', '🌊', '🌀', '✨', '🎉'];

/**
 * Create a shell / emoji rain effect.
 */
export function triggerKonami() {
  const el = document.getElementById('konamiEffect');
  if (!el) return;

  el.classList.add('active');
  el.innerHTML = '';

  for (let i = 0; i < 60; i++) {
    const div = document.createElement('div');
    div.className = 'konami-shell';
    div.textContent = RAIN_EMOJIS[Math.floor(Math.random() * RAIN_EMOJIS.length)];
    div.style.left = `${Math.random() * 100}%`;
    div.style.animationDelay = `${Math.random() * 1.5}s`;
    div.style.animationDuration = `${2 + Math.random() * 2}s`;
    el.appendChild(div);
  }

  setTimeout(() => el.classList.remove('active'), 4_000);
}

/**
 * Register Konami code keyboard listener.
 */
export function initKonamiCode() {
  let pos = 0;

  document.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === KONAMI_SEQUENCE[pos]) {
      pos++;
    } else {
      pos = 0;
    }
    if (pos === KONAMI_SEQUENCE.length) {
      pos = 0;
      triggerKonami();
    }
  });
}

/**
 * Register long-press on the hero logo to trigger shell rain (mobile).
 */
export function initLogoLongPress() {
  const logo = document.getElementById('heroLogoEgg');
  if (!logo) return;

  let pressTimer;

  const start = () => {
    pressTimer = setTimeout(triggerKonami, 3_000);
  };
  const cancel = () => clearTimeout(pressTimer);

  logo.addEventListener('touchstart', start, { passive: true });
  logo.addEventListener('touchend', cancel, { passive: true });
  logo.addEventListener('touchmove', cancel, { passive: true });
  logo.addEventListener('touchcancel', cancel, { passive: true });
  logo.addEventListener('mousedown', start);
  logo.addEventListener('mouseup', cancel);
  logo.addEventListener('mouseleave', cancel);
  logo.addEventListener('contextmenu', (e) => e.preventDefault());
}

// ─────────────────────────────────────────────
// SHELL CLICK → MEMES MODAL
// ─────────────────────────────────────────────

/**
 * Wire up the shell icon in the header.
 * 5 rapid clicks → memes easter egg.
 */
export function initShellEgg() {
  const shell = document.getElementById('shellEgg');
  if (!shell) return;

  let count = 0;
  let resetTimer;

  shell.addEventListener('click', () => {
    count++;
    shell.style.transform = `scale(${1 + count * 0.1}) rotate(${count * 36}deg)`;
    setTimeout(() => { shell.style.transform = ''; }, 300);

    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => { count = 0; }, 2_000);

    if (count >= 5) {
      count = 0;
      openMemesModal();
    }
  });
}

// ─────────────────────────────────────────────
// MEMES MODAL
// ─────────────────────────────────────────────

export function openMemesModal() {
  // Show a random meme card
  const modal = document.getElementById('memesModal');
  const cards = modal?.querySelectorAll('.meme-card');
  if (!modal || !cards) return;

  cards.forEach((c) => { /** @type {HTMLElement} */ (c).style.display = 'none'; });
  const rand = cards[Math.floor(Math.random() * cards.length)];
  if (rand) /** @type {HTMLElement} */ (rand).style.display = 'block';

  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

export function closeMemesModal() {
  const modal = document.getElementById('memesModal');
  if (modal) modal.classList.remove('show');
  document.body.style.overflow = '';
}

/** Bind close button and backdrop click for memes modal. */
export function initMemesModal() {
  const modal = document.getElementById('memesModal');
  const closeBtn = document.getElementById('memesModalClose');
  if (!modal || !closeBtn) return;

  closeBtn.addEventListener('click', closeMemesModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeMemesModal();
  });
}

// ─────────────────────────────────────────────
// BIRTHDAY OVERLAY (Олекса, 24.07.2026)
// ─────────────────────────────────────────────

/** Show birthday overlay with confetti. */
export function showBirthday() {
  const overlay = document.getElementById('birthdayOverlay');
  const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('confettiCanvas'));
  if (!overlay || !canvas) return;

  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
  startConfetti(canvas);
}

/** Hide birthday overlay. */
export function closeBirthday() {
  const overlay = document.getElementById('birthdayOverlay');
  if (overlay) overlay.classList.remove('show');
  document.body.style.overflow = '';
}

/** Bind close button for birthday overlay. */
export function initBirthdayOverlay() {
  const btn = document.getElementById('birthdayCloseBtn');
  if (btn) btn.addEventListener('click', closeBirthday);
}

/**
 * Check if today is Олекса's birthday during the trip (24.07.2026)
 * and trigger the overlay after a short delay.
 * @param {string} pilgrimId
 */
export function maybeShowBirthday(pilgrimId) {
  if (pilgrimId !== 'oleksa') return;
  const today = new Date();
  const isBirthday = today.getFullYear() === 2026
    && today.getMonth() === 6  // July = 6 (0-indexed)
    && today.getDate() === 24;
  if (isBirthday) {
    setTimeout(showBirthday, 1_200);
  }
}
