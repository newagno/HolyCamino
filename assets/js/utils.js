/**
 * @fileoverview utils.js — Shared utilities: confetti, weather, countdown,
 * stage progress, parallax, scroll-top, ocean sound, night mode.
 *
 * @module utils
 */

import { TRIP_START, WMO_ICON, WMO_DESC, TOTAL_KM } from './config.js';
import { getCache, setCache } from './storage.js';

/**
 * Безпечне логування: виводить інформацію лише в локальному середовищі
 */
export function log(...args) {
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    console.log(...args);
  }
}

export function formatDateDisplay(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  
  const parts = dateStr.split('-');
  return `${parts[2]}.${parts[1]}`;
}

// ─────────────────────────────────────────────
// CONFETTI
// ─────────────────────────────────────────────

/**
 * Animate confetti on a canvas element for ~12 seconds.
 * @param {HTMLCanvasElement} canvas
 */
export function startConfetti(canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const COLORS = ['#c8553d', '#6b7d3a', '#c9a64b', '#5a7d8c', '#faf4e3', '#ff69b4', '#ffd700'];

  /** @type {{ x:number, y:number, r:number, color:string, vx:number, vy:number, rot:number, vr:number }[]} */
  const pieces = Array.from({ length: 90 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    r: Math.random() * 8 + 4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    vx: (Math.random() - 0.5) * 3,
    vy: Math.random() * 3 + 2,
    rot: Math.random() * 360,
    vr: (Math.random() - 0.5) * 5,
  }));

  let frameId;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of pieces) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
      ctx.restore();

      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      if (p.y > canvas.height) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
      }
    }
    frameId = requestAnimationFrame(draw);
  }

  draw();
  setTimeout(() => cancelAnimationFrame(frameId), 12_000);
}

// ─────────────────────────────────────────────
// COUNTDOWN
// ─────────────────────────────────────────────

/**
 * Start the live countdown to TRIP_START.
 * Updates DOM elements #cd-d, #cd-h, #cd-m, #cd-s every second.
 */
export function startCountdown() {
  function update() {
    const diff = TRIP_START - new Date();

    if (diff <= 0) {
      for (const id of ['cd-d', 'cd-h', 'cd-m', 'cd-s']) {
        const el = document.getElementById(id);
        if (el) el.textContent = '0';
      }
      return;
    }

    const days = Math.floor(diff / 86_400_000);
    const hours = Math.floor((diff % 86_400_000) / 3_600_000);
    const minutes = Math.floor((diff % 3_600_000) / 60_000);
    const seconds = Math.floor((diff % 60_000) / 1_000);

    const set = (id, val, pad = false) => {
      const el = document.getElementById(id);
      if (el) el.textContent = pad ? String(val).padStart(2, '0') : String(val);
    };

    set('cd-d', days);
    set('cd-h', hours, true);
    set('cd-m', minutes, true);
    set('cd-s', seconds, true);

    // Also update the route section countdown label if present
    const rd = document.getElementById('route-cd-days');
    if (rd) rd.textContent = String(days);
  }

  update();
  setInterval(update, 1_000);
}

// ─────────────────────────────────────────────
// STAGE PROGRESS
// ─────────────────────────────────────────────

/**
 * Build the stage progress bar HTML.
 * Shown in the Route section header.
 * @returns {string} HTML string
 */
export function buildStageProgress(STAGE_DAYS) {
  const now = new Date();
  const start = new Date('2026-07-11T16:25:00');
  const end = new Date('2026-07-24');

  if (now < start) {
    const diff = start - now;
    const days = Math.floor(diff / 86_400_000);
    return `<div class="stage-progress">
      <div class="stage-progress-label">До старту: <span id="route-cd-days">${days}</span> дн. • Маршрут ${TOTAL_KM} км</div>
    </div>`;
  }

  if (now > end) {
    return `<div class="stage-progress">
      <div class="stage-progress-label"><svg class="icon" style="margin-right:5px;color:var(--gold);"><use href="#icon-trophy"></svg> Kamiño завершено! Buen Camino!</div>
    </div>`;
  }

  let pct = 0;
  let city = '';

  for (const stage of STAGE_DAYS) {
    if (now >= new Date(stage.date)) {
      pct = Math.round((stage.km / TOTAL_KM) * 100);
      city = stage.city;
    }
  }

  return `<div class="stage-progress">
    <div class="stage-progress-label"><svg class="icon" style="margin-right:5px;"><use href="#icon-walk"></svg> Твій Camiño зараз</div>
    <div class="stage-track">
      <div class="stage-fill" style="width:${pct}%"></div>
      <span class="stage-shell" style="left:${pct}%"><img src="assets/files/camino.svg" alt="Мушля" style="width:18px;height:18px;object-fit:contain;vertical-align:middle;"></span>
    </div>
    <div class="stage-city">${city}</div>
  </div>`;
}

// ─────────────────────────────────────────────
// GEOLOCATION
// ─────────────────────────────────────────────

/**
 * Wraps navigator.geolocation.getCurrentPosition in a Promise.
 * Returns { lat, lon } on success, or null on error / denied / timeout.
 * @param {number} [timeout=4000] - Timeout in ms
 * @returns {Promise<{lat: number, lon: number} | null>}
 */
export function getUserLocation(timeout = 4000) {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    const timer = setTimeout(() => resolve(null), timeout + 100);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timer);
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => {
        clearTimeout(timer);
        resolve(null);
      },
      {
        enableHighAccuracy: false,
        timeout,
        maximumAge: 5 * 60 * 1000, // accept cached position up to 5 min old
      }
    );
  });
}

// ─────────────────────────────────────────────
// WEATHER
// ─────────────────────────────────────────────

let weatherController = null;

/**
 * Returns a YYYY-MM-DD string for local today.
 * @returns {string}
 */
function localTodayISO() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Lazy-load weather for one day card. Called on card click (once).
 * Uses GPS coordinates when the target date is today; falls back to static coords otherwise.
 * @param {number} dayIdx   - Index into ROUTE array
 * @param {string} dateStr  - Display date e.g. "13.07"
 * @param {object} coords   - Static coords { lat, lon, name }
 * @param {string} coordKey - Key in CITY_COORDS e.g. "13.07"
 */
export async function loadWeatherForDay(dayIdx, dateStr, coords, coordKey) {
  if (!coords) return;

  const container = document.getElementById(`weather-${dayIdx}`);
  if (!container) return;

  const wdg = container.querySelector('.weather-widget');
  if (!wdg) return;

  // ── Resolve ISO date from coordKey ──────────────────────────
  let isoDate = coordKey;
  let displayDate = dateStr;
  if (coordKey.includes('-')) {
    // Already ISO
    const parts = coordKey.split('-');
    if (parts.length === 3) {
      displayDate = `${parts[2]}.${parts[1]}`;
    }
  } else {
    const [dd, mm] = coordKey.split('.');
    isoDate = `2026-${mm}-${dd}`;
  }

  // ── Temporal check: is the target date today? ────────────────
  const today = localTodayISO();
  const isToday = isoDate === today;

  // ── Geolocation (only for today) ────────────────────────────
  let effectiveLat = coords.lat;
  let effectiveLon = coords.lon;

  if (isToday) {
    const gps = await getUserLocation(4000);
    if (gps) {
      effectiveLat = gps.lat;
      effectiveLon = gps.lon;
    }
  }

  // ── Cache key includes actual coordinates used ───────────────
  // Round to 4 decimal places (~11 m precision) to keep key stable for nearby positions
  const latKey = effectiveLat.toFixed(4);
  const lonKey = effectiveLon.toFixed(4);
  const cacheKey = `weather_${isoDate}_${latKey}_${lonKey}`;

  // ── Temporal window check (Open-Meteo 16-day limit) ─────────
  const targetDate = new Date(isoDate);
  const diffDays = (targetDate - new Date()) / 86_400_000;

  const extLink = `https://www.google.com/search?q=погода+${encodeURIComponent(coords.name)}+${displayDate}`;

  if (diffDays > 14) {
    wdg.innerHTML = `
      <a href="${extLink}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;color:inherit;display:block;">
        <div class="weather-title"><svg class="icon" style="margin-right:4px;"><use href="#icon-pin"></svg> ${coords.name}</div>
        <div style="font-size:13px;opacity:0.8;font-style:italic;text-align:center;padding:10px 0;">
          Погода недоступна, з'явиться ближче до дати.<br>
          <span style="text-decoration:underline;color:var(--gold);margin-top:5px;display:inline-block;">Переглянути прогноз в Google ↗</span>
        </div>
      </a>`;
    return;
  }

  // ── Try IndexedDB cache first ────────────────────────────────
  let data = null;
  const cached = await getCache(cacheKey);
  const TTL = 4 * 60 * 60 * 1000; // 4 hours

  if (cached && cached.timestamp && (Date.now() - cached.timestamp < TTL)) {
    data = cached.data;
  } else {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${effectiveLat}&longitude=${effectiveLon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Europe%2FLisbon&start_date=${isoDate}&end_date=${isoDate}`;

    // Cancel any in-flight request
    if (weatherController) {
      weatherController.abort();
    }
    weatherController = new AbortController();

    // Hard 8-second timeout guard
    const timeoutId = setTimeout(() => weatherController.abort(), 8000);

    try {
      const resp = await fetch(url, { signal: weatherController.signal });
      clearTimeout(timeoutId);

      if (!resp.ok) throw new Error(`HTTP error: ${resp.status}`);

      data = await resp.json();
      await setCache(cacheKey, { timestamp: Date.now(), data });
    } catch (err) {
      if (err.name === 'AbortError') {
        return;
      }
      console.error('Weather fetch error:', err);
      wdg.innerHTML = `
        <a href="${extLink}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;color:inherit;display:block;">
          <div class="weather-title"><svg class="icon" style="margin-right:4px;"><use href="#icon-pin"></svg> ${coords.name}</div>
          <div style="font-size:13px;opacity:0.8;text-align:center;padding:10px 0;">
            Помилка завантаження.<br>
            <span style="text-decoration:underline;color:var(--gold);margin-top:5px;display:inline-block;">Переглянути в Google ↗</span>
          </div>
        </a>`;
      return;
    }
  }

  // ── Render weather widget ────────────────────────────────────
  const wc = data.daily.weathercode[0];
  const tmax = Math.round(data.daily.temperature_2m_max[0]);
  const tmin = Math.round(data.daily.temperature_2m_min[0]);
  const icon = WMO_ICON[wc] ?? 'sun';
  const desc = WMO_DESC[wc] ?? '';

  let adviceHTML = '';
  if (wc >= 61) {
    adviceHTML = `<div class="weather-advice rain"><svg class="icon" style="margin-right:5px;"><use href="#icon-rain"></svg> Рекомендуємо пончо зверху рюкзака!</div>`;
  } else if (tmax >= 25) {
    adviceHTML = `<div class="weather-advice heat"><svg class="icon" style="margin-right:5px;"><use href="#icon-sun"></svg> Спекотно! Онови запас води та намастись кремом.</div>`;
  } else if (tmin <= 10) {
    adviceHTML = `<div class="weather-advice cold"><svg class="icon" style="margin-right:5px;"><use href="#icon-moon"></svg> Прохолодний ранок, тримай фліску під рукою.</div>`;
  }

  wdg.innerHTML = `
    <a href="${extLink}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;color:inherit;display:block;">
      <div class="weather-title"><svg class="icon" style="margin-right:4px;"><use href="#icon-pin"></svg> ${coords.name}</div>
      <div class="weather-grid">
        <div class="weather-cell condition"><span class="weather-icon"><svg class="icon"><use href="#icon-${icon}"></svg></span><div class="weather-desc">${desc}</div></div>
        <div class="weather-cell day"><span class="weather-icon"><svg class="icon"><use href="#icon-sun"></svg></span><div class="weather-temp"><span class="temp-highlight">${tmax}°</span></div><div class="weather-desc">День</div></div>
        <div class="weather-cell night"><span class="weather-icon"><svg class="icon"><use href="#icon-moon"></svg></span><div class="weather-temp">${tmin}°</div><div class="weather-desc">Ніч</div></div>
      </div>
      ${adviceHTML}
    </a>`;
}

// ─────────────────────────────────────────────
// PARALLAX
// ─────────────────────────────────────────────

/**
 * Subtle parallax on the decorative shell backgrounds.
*/
export function initParallax() {
  let pending = false;

  window.addEventListener('scroll', () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      const s = window.pageYOffset;
      const s1 = /** @type {HTMLElement|null} */ (document.querySelector('.shell-1'));
      const s2 = /** @type {HTMLElement|null} */ (document.querySelector('.shell-2'));
      const s3 = /** @type {HTMLElement|null} */ (document.querySelector('.shell-3'));

      if (s1) s1.style.transform = `rotate(${15 + s * 0.02}deg) translateY(${s * 0.3}px)`;
      if (s2) s2.style.transform = `rotate(${-25 - s * 0.015}deg) translateY(${s * 0.2}px)`;
      if (s3) s3.style.transform = `rotate(${60 + s * 0.025}deg) translateY(${s * 0.4}px)`;

      pending = false;
    });
  }, { passive: true });
}

// ─────────────────────────────────────────────
// SCROLL-TO-TOP BUTTON
// ─────────────────────────────────────────────

/** Wire up the scroll-to-top floating button. */
export function initScrollTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });

  btn.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );
}

// ─────────────────────────────────────────────
// NIGHT MODE
// ─────────────────────────────────────────────

/**
 * Apply or remove night mode class on <body>.
 * @param {boolean} on
 */
export function applyNightMode(on) {
  document.body.classList.toggle('night-mode', on);
  const btn = document.getElementById('nightToggleH');
  if (btn) {
    btn.innerHTML = `<svg class="icon"><use href="#icon-${on ? 'sun' : 'moon'}"></svg>`;
  }
}

/**
 * Auto-detect night mode from current hour (21:00 – 06:00).
 * @returns {boolean}
 */
export function shouldAutoNight() {
  const h = new Date().getHours();
  return h >= 21 || h < 6;
}

// ─────────────────────────────────────────────
// OCEAN SOUND
// ─────────────────────────────────────────────

/** Wire up the ocean toggle button. Tries <audio> first, falls back to Web Audio. */
export function initOcean() {
  const btn = document.getElementById('oceanToggle');
  const audio = /** @type {HTMLAudioElement} */ (document.getElementById('oceanAudio'));
  if (!btn || !audio) return;

  let playing = false;
  let oscSrc = /** @type {AudioBufferSourceNode|null} */ (null);
  let audioCtx = /** @type {AudioContext|null} */ (null);

  /** Synthesise ocean-like brown noise via Web Audio API. */
  function startWebAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || /** @type {any} */(window.webkitAudioContext))();
    }
    const sr = audioCtx.sampleRate;
    const sz = sr * 4;
    const buf = audioCtx.createBuffer(1, sz, sr);
    const d = buf.getChannelData(0);
    let last = 0;

    for (let i = 0; i < sz; i++) {
      const w = Math.random() * 2 - 1;
      d[i] = (last + 0.02 * w) / 1.02;
      last = d[i];
      d[i] *= 3.5;
    }

    oscSrc = audioCtx.createBufferSource();
    oscSrc.buffer = buf;
    oscSrc.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 600;

    const gain = audioCtx.createGain();
    gain.gain.value = 0.12;

    const lfo = audioCtx.createOscillator();
    const lfog = audioCtx.createGain();
    lfo.frequency.value = 0.12;
    lfog.gain.value = 0.1;
    lfo.connect(lfog);
    lfog.connect(gain.gain);

    oscSrc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    oscSrc.start();
    lfo.start();
  }

  btn.addEventListener('click', () => {
    if (!playing) {
      audio.volume = 0.4;
      audio.play()
        .then(() => {
          playing = true;
          btn.classList.add('active');
          btn.title = 'Вимкнути';
          btn.setAttribute('aria-label', 'Вимкнути звуки океану');
        })
        .catch(() => {
          startWebAudio();
          playing = true;
          btn.classList.add('active');
          btn.title = 'Вимкнути';
          btn.setAttribute('aria-label', 'Вимкнути звуки океану');
        });
    } else {
      audio.pause();
      audio.currentTime = 0;
      if (oscSrc) { try { oscSrc.stop(); } catch { /* already stopped */ } }
      playing = false;
      btn.classList.remove('active');
      btn.title = 'Звуки океану';
      btn.setAttribute('aria-label', 'Увімкнути звуки океану');
    }
  });
}

// ─────────────────────────────────────────────
// PEIXE LIGHTBOX
// ─────────────────────────────────────────────

/** Bind open/close for the peixe-aranha image lightbox. */
export function initPeixeLightbox() {
  const lb = document.getElementById('peixeLb');
  const close = document.getElementById('peixeLbClose');
  if (!lb || !close) return;

  // Allow external trigger via window function (for inline onclick in HTML)
  window.openPeixeLb = () => {
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeIt = () => {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  };

  close.addEventListener('click', closeIt);
  lb.addEventListener('click', closeIt);
}

// ─────────────────────────────────────────────
// CLICK RIPPLE EFFECT
// ─────────────────────────────────────────────

/**
 * Initialise a global ripple effect on click/tap.
 * Adds a temporary .click-ripple element to the DOM at the pointer location.
 */
export function initClickRipple() {
  document.addEventListener('pointerdown', (e) => {
    // Create 3 concentric rings for a "wave" effect
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
        
        document.body.appendChild(ripple);
        
        ripple.addEventListener('animationend', () => {
          ripple.remove();
        });
      }, i * 150);
    }
  }, { passive: true });
}


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

export function countryChip(cc) {
  if (cc === 'pt') return `<span style="display:inline-block;padding:2px 6px;background:var(--forest);color:#fff;border-radius:4px;font-size:10px;font-weight:700;text-transform:uppercase;line-height:1;">PT</span>`;
  if (cc === 'es') return `<span style="display:inline-block;padding:2px 6px;background:var(--terracotta);color:#fff;border-radius:4px;font-size:10px;font-weight:700;text-transform:uppercase;line-height:1;">ES</span>`;
  if (cc === 'ua') return `<span style="display:inline-block;padding:2px 6px;background:#0057b7;color:#ffd700;border-radius:4px;font-size:10px;font-weight:700;text-transform:uppercase;line-height:1;">UA</span>`;
  return '';
}

export function langPair(from, to) {
  return `<span style="display:inline-flex;align-items:center;gap:4px;">${countryChip(from)} <svg class="icon" style="width:10px;height:10px;opacity:.6;"><use href="#icon-right"></svg> ${countryChip(to)}</span>`;
}