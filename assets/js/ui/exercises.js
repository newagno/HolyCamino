import { EXERCISES } from '../config.js';

export let exTab = 'before'; // Global state inside module

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
      <text x="50" y="55" font-size="18">💪</text>
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
      <text x="55" y="25" font-size="20">💤</text>
    </svg>`,
    poles: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 65L40 35L70 65" stroke="var(--olive)" stroke-width="2" stroke-dasharray="4 4" opacity="0.5"/>
      <path d="M25 70L35 15M55 70L45 15" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M33 25L36 12M47 25L44 12" stroke="var(--terracotta)" stroke-width="5" stroke-linecap="round"/>
      <path d="M36 12C45 5 45 20 33 22" stroke="var(--gold)" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M44 12C35 5 35 20 47 22" stroke="var(--gold)" stroke-width="2" stroke-linecap="round" fill="none"/>
      <circle cx="24" cy="71" r="3" fill="var(--ink)"/>
      <circle cx="56" cy="71" r="3" fill="var(--ink)"/>
    </svg>`,
  };
  return svgs[type] ?? '🚶';
}

export function buildExercises() {
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

export function renderExercises() {
  const content = document.getElementById('ex-content');
  if (!content) return;

  content.innerHTML = EXERCISES[exTab].map((ex) => `
    <div class="exercise-card minimalist">
      <div class="ex-comic-fig" aria-hidden="true">${getExerciseSVG(ex.fig)}</div>
      <div class="ex-info">
        <div class="ex-name">${ex.n}</div>
        <div class="ex-dur">${ex.dur}</div>
        <div class="ex-comic-txt">"${ex.comic.replace(/"/g, '')}"</div>
        ${ex.steps ? `<ul class="ex-steps" style="margin-top:10px; padding-left:18px; font-size:13px; color:var(--ink);">${ex.steps.map(s => `<li style="margin-bottom:6px;">${s}</li>`).join('')}</ul>` : ''}
      </div>
    </div>`).join('');
}

export function handleExTab(tab) {
  document.querySelectorAll('.ex-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
  tab.classList.add('active');
  tab.setAttribute('aria-selected', 'true');
  exTab = tab.getAttribute('data-et');
  renderExercises();
}
