import { FOOD_CATEGORIES, FOODS, RAND_STRINGS } from '../config.js';

export function buildFood() {
  return `
    <h2 class="section-title">Що з'їсти</h2>
    <div class="section-subtitle">натисни — рандомна страва</div>
    <div class="food-randomizer">
      <div class="food-rand-title"><svg class="icon" style="margin-right:5px;"><use href="#icon-food"></use></svg> Каміно Меню</div>
      <span class="food-spinner" id="foodSpinner" aria-hidden="true"><svg class="icon" style="width:48px;height:48px;"><use href="#icon-food"></use></svg></span>
      <div class="food-result" id="foodResult" aria-live="polite">натисни кнопку!</div>
      <div class="food-desc"   id="foodDesc">щоб дізнатися що замовити...</div>
      <div class="food-city"   id="foodCity"></div>
      <button class="food-btn" id="foodBtn"><svg class="icon" style="margin-right:6px;"><use href="#icon-food"></use></svg> Що з'їсти?</button>
    </div>
    <div style="background:var(--paper);padding:14px;border-radius:4px;border:1px solid var(--paper-dark);margin-bottom:20px;">
      <div style="font-family:'Caveat',cursive;font-size:20px;color:var(--terracotta);margin-bottom:8px;"><svg class="icon" style="margin-right:5px;"><use href="#icon-scroll"></use></svg> Menu del Peregrino</div>
      <p style="font-size:13px;color:var(--ink-soft);line-height:1.5;">
        <strong>€10-15/паломника</strong> — 3 страви (закуска / основна / десерт) + хліб + вино або сік.
        Обід 13:00-16:00, вечеря 18:30-19:00.
      </p>
    </div>
    
    <div class="foods-list-wrap">
      <div class="foods-list-title">Список згаданих продуктів, їжі та напоїв</div>
      <div class="foods-tabs" role="tablist">
        <button class="foods-tab active" data-filter="all" role="tab" aria-selected="true">Всі</button>
        <button class="foods-tab" data-filter="pt" role="tab" aria-selected="false">${countryChip('pt')} <span class="nav-label" style="margin-left:6px;">Португалія</span></button>
        <button class="foods-tab" data-filter="es" role="tab" aria-selected="false">${countryChip('es')} <span class="nav-label" style="margin-left:6px;">Іспанія / Галісія</span></button>
      </div>
      <div class="foods-grid" id="foodsGrid">
        ${buildFoodGridHTML('all')}
      </div>
    </div>`;
}

export function buildFoodGridHTML(filter = 'all') {
  return FOODS
    .filter(f => filter === 'all' || f.country === filter)
    .map(f => `
        <div class="food-card">
          <div class="food-card-header">
            <div class="food-card-title">${f.n}</div>
            <div class="food-card-flag" title="${f.country === 'pt' ? 'Португалія' : 'Іспанія'}">${countryChip(f.country)}</div>
          </div>
          <div class="food-card-desc">${f.d}</div>
          <div class="food-card-city">
            <svg class="icon" style="width:14px;height:14px;"><use href="#icon-pin"></use></svg>
            <span>${f.city.replace(/^📍\s*/, '')}</span>
          </div>
        </div>
    `).join('');
}

export function handleFoodsTab(tab) {
  const tabs = document.querySelectorAll('.foods-tab');
  tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
  tab.classList.add('active');
  tab.setAttribute('aria-selected', 'true');
  const filter = tab.getAttribute('data-filter') || 'all';
  const grid = document.getElementById('foodsGrid');
  if (grid) grid.innerHTML = buildFoodGridHTML(filter);
}

export function initFoodRandom() {
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
      city.innerHTML = `<svg class="icon" style="width:14px;height:14px;margin-right:4px;"><use href="#icon-pin"></use></svg>${food.city.replace(/^📍\s*/, '')}`;
      [result, desc, city].forEach((el) => { el.style.opacity = '1'; });
    }, 1_400);
  });
}
