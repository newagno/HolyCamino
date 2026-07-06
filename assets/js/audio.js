/**
 * audio.js
 * Handles Web Audio API and media element logic for environmental sounds.
 */

/** Wire up the audio toggle button to cycle: Mute -> Ocean -> Forest -> Mute */
export function initOcean() {
  const btn = document.getElementById('oceanToggle');
  const audio = /** @type {HTMLAudioElement} */ (document.getElementById('oceanAudio'));
  if (!btn || !audio) return;

  let audioState = 0; // 0 = Mute, 1 = Ocean, 2 = Forest
  let oscSrc = null;
  let lfoSrc = null;
  let audioCtx = null;

  function stopAll() {
    audio.pause();
    audio.currentTime = 0;
    const forestAudio = /** @type {HTMLAudioElement} */ (document.getElementById('forestAudio'));
    if (forestAudio) {
      forestAudio.pause();
      forestAudio.currentTime = 0;
    }
    if (oscSrc) { try { oscSrc.stop(); oscSrc.disconnect(); } catch {} }
    if (lfoSrc) { try { lfoSrc.stop(); lfoSrc.disconnect(); } catch {} }
  }

  function getBrownNoiseBuffer(ctx) {
    const sr = ctx.sampleRate;
    const sz = sr * 4;
    const buf = ctx.createBuffer(1, sz, sr);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < sz; i++) {
      const w = Math.random() * 2 - 1;
      d[i] = (last + 0.02 * w) / 1.02;
      last = d[i];
      d[i] *= 3.5;
    }
    return buf;
  }

  function startWebAudioOcean() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    oscSrc = audioCtx.createBufferSource();
    oscSrc.buffer = getBrownNoiseBuffer(audioCtx);
    oscSrc.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 600;

    const gain = audioCtx.createGain();
    gain.gain.value = 0.12;

    const lfo = audioCtx.createOscillator();
    lfoSrc = lfo;
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
    stopAll();
    
    audioState = (audioState + 1) % 3;

    if (audioState === 1) { // Ocean
      audio.volume = 0.4;
      audio.play().catch(() => startWebAudioOcean());
      btn.classList.add('active');
      btn.title = 'Океан (натисніть для Лісу)';
      btn.innerHTML = `<svg class="icon"><use href="#icon-wave"></svg>`;
    } else if (audioState === 2) { // Forest
      const forestAudio = /** @type {HTMLAudioElement} */ (document.getElementById('forestAudio'));
      if (forestAudio) {
        forestAudio.volume = 0.4;
        forestAudio.play().catch(() => {}); // ignore errors if autoplay blocked
      }
      btn.classList.add('active');
      btn.title = 'Ліс (натисніть щоб Вимкнути)';
      btn.innerHTML = `<svg class="icon"><use href="#icon-tree"></svg>`;
    } else { // Mute
      btn.classList.remove('active');
      btn.title = 'Звуки (натисніть для Океану)';
      btn.innerHTML = `<svg class="icon"><use href="#icon-volume-off"></svg>`; // Normal mute icon
    }
  });
}

export function initTheWayAudio() {
  const btn = document.getElementById('theWayToggle');
  const audio = /** @type {HTMLAudioElement} */ (document.getElementById('theWayAudio'));
  if (!btn || !audio) return;

  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.volume = 0.4;
      audio.play().then(() => {
        btn.innerHTML = '<svg class="icon"><use href="#icon-storm"></svg>';
        btn.title = 'Вимкнути звук шторму';
        btn.setAttribute('aria-label', 'Вимкнути звук шторму');
        btn.classList.add('playing');
      }).catch(() => { });
    } else {
      audio.pause();
      audio.currentTime = 0;
      btn.innerHTML = '<svg class="icon"><use href="#icon-storm"></svg>';
      btn.title = 'Увімкнути звук шторму';
      btn.setAttribute('aria-label', 'Увімкнути звук шторму');
      btn.classList.remove('playing');
    }
  });
}

