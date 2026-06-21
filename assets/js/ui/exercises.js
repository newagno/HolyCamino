import { EXERCISES } from '../config.js';

export let exTab = 'warmup'; // Global state inside module

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
