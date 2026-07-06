import { PILGRIMS, CHECKLIST, BLISTER_TEXTS } from '../config.js';
import { getGearState, toggleGearItem, getChecklistState, toggleChecklistItem, getBlisterValue, setBlisterValue } from '../storage.js';
import { injectIcons } from '../utils.js';
import { startConfetti } from '../confetti.js';

function getBlisterText(val) {
  return BLISTER_TEXTS[Math.min(val, BLISTER_TEXTS.length - 1)];
}

export function showCompostela(name) {
  const canvas = document.getElementById('confettiCanvas');
  if (canvas) startConfetti(canvas);

  const noiseSVG = `data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)" opacity="0.05"/></svg>`;

  const modalHTML = `
    <div id="compostelaModal" class="modal show" role="dialog" aria-modal="true" style="display:flex; align-items:center; justify-content:center; padding:16px;">
      <div class="modal-content" style="
        background: url('${noiseSVG}'), radial-gradient(circle, #fdfbf7 0%, #e8dcc4 100%);
        color: #2c2523;
        text-align: center;
        padding: 50px 40px;
        box-shadow: inset 0 0 0 4px #e8dcc4, inset 0 0 0 6px #8a1538, inset 0 0 0 10px #e8dcc4, inset 0 0 0 11px #c9a64b, 0 15px 40px rgba(0,0,0,0.4);
        border: none;
        border-radius: 2px;
        max-width: 560px;
        width: 100%;
        position: relative;
        font-family: 'Georgia', 'Times New Roman', serif;
      ">
        <button class="modal-close" onclick="this.closest('.modal').remove()" aria-label="Закрити" style="
          position: absolute;
          top: 15px;
          right: 15px;
          background: transparent;
          border: none;
          font-size: 20px;
          color: #8a1538;
          cursor: pointer;
          opacity: 0.6;
          transition: opacity 0.2s;
        " onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.6">✕</button>

        <h1 style="
          font-size: 32px;
          color: #8a1538;
          letter-spacing: 6px;
          margin: 10px 0 0 0;
          text-transform: uppercase;
          font-weight: normal;
        ">Compostela</h1>
        
        <!-- Decorative Divider -->
        <div style="display: flex; align-items: center; justify-content: center; margin: 15px 0 25px 0;">
          <div style="height: 1px; width: 60px; background: #8a1538; opacity: 0.5;"></div>
          <div style="width: 8px; height: 8px; background: #c9a64b; transform: rotate(45deg); margin: 0 10px;"></div>
          <div style="height: 1px; width: 60px; background: #8a1538; opacity: 0.5;"></div>
        </div>
        
        <div style="
          font-size: 14px;
          color: #554a46;
          margin: 0 0 10px 0;
          font-style: italic;
          letter-spacing: 0.5px;
        ">Цим підтверджується, що паломник</div>

        <div style="
          font-size: 56px;
          font-family: 'Great Vibes', 'Caveat', 'Brush Script MT', cursive;
          color: #110d0c;
          margin: 15px 0 25px 0;
          font-weight: normal;
          line-height: 1.1;
          text-shadow: 1px 1px 0 rgba(255,255,255,0.5);
        ">${name}</div>

        <div style="
          font-size: 15px;
          color: #38302d;
          line-height: 1.6;
          margin: 0 auto 35px auto;
          max-width: 420px;
          font-style: italic;
        ">
          успішно завершив повну підготовку та зібрав необхідне спорядження для проходження Шляху Святого Якова (Camino de Santiago).
        </div>

        <!-- Realistic 3D Wax Seal -->
        <div style="
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 86px;
          height: 86px;
          background: radial-gradient(circle at 30% 30%, #d32036 0%, #8a1538 50%, #4a0b1d 100%);
          border-radius: 48% 52% 51% 49% / 50% 48% 52% 50%;
          box-shadow: 2px 5px 8px rgba(0,0,0,0.4), inset -3px -5px 10px rgba(0,0,0,0.5), inset 2px 4px 6px rgba(255,255,255,0.3);
          position: relative;
        ">
          <!-- Glare Reflection -->
          <div style="
            position: absolute;
            top: 5px; left: 10px;
            width: 40px; height: 15px;
            background: linear-gradient(110deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%);
            border-radius: 50%;
            transform: rotate(-15deg);
            pointer-events: none;
          "></div>
          
          <!-- Camino Scallop Shell SVG (Proper Ridges) -->
          <svg viewBox="0 0 100 100" style="width: 48px; height: 48px; fill: #e8cca0; filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.5)); position: relative; z-index: 1;">
            <path d="M50,85 C20,85 5,55 15,35 C20,25 35,20 50,20 C65,20 80,25 85,35 C95,55 80,85 50,85 Z" />
            <path d="M50,83 L50,22 M50,83 L40,24 M50,83 L30,30 M50,83 L22,40 M50,83 L18,52 M50,83 L60,24 M50,83 L70,30 M50,83 L78,40 M50,83 L82,52" stroke="#630d22" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.5"/>
            <path d="M38,82 L62,82 L64,90 L36,90 Z" fill="#e8cca0" stroke="#630d22" stroke-width="1.5" stroke-linejoin="round" opacity="0.8"/>
          </svg>
        </div>
      </div>
    </div>
  `;
  document.getElementById('modal-root').innerHTML = modalHTML;
}

export function buildPilgrims() {
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

export async function openGearModal(pid) {
  const { GLOBAL_GEAR } = await import('../config/gear.js');
  const p = PILGRIMS[pid];
  const state = getGearState(pid);

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

  const CATEGORIES = [
    { id: 'documents', title: 'Документи / Квитки 📄' },
    { id: 'gear', title: 'Спорядження 🎒' },
    { id: 'clothing', title: 'Одяг / Взуття 👕' },
    { id: 'hygiene', title: 'Гігієна / Косметика 🧼' },
    { id: 'medical', title: 'Аптечка / Медицина 🩹' },
    { id: 'other', title: 'Різне / Дрібниці 🌀' },
  ];

  const categoriesHTML = CATEGORIES.map(cat => {
    const items = GLOBAL_GEAR.filter(it => (it.category || 'other') === cat.id);
    if (!items.length) return '';

    const itemsHTML = items.map(it => {
      const checked = !!state[it.name];
      return gearRow(it, checked);
    }).join('');

    return `
      <div class="gear-section category-${cat.id}" data-cat="${cat.id}">
        <div class="gear-section-title">${cat.title}</div>
        ${itemsHTML}
      </div>
    `;
  }).join('');

  document.getElementById('pilgrimModalContent').innerHTML = `
    <h2 class="modal-title">${p.name}</h2>
    <div class="modal-subtitle">загальний список речей · відмічай чекбоксами</div>
    <div class="blister-meter">
      <div class="blister-label" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span style="display:flex; align-items:center;"><svg class="icon" style="margin-right:5px; vertical-align:middle;"><use href="#icon-bandage"></use></svg> Blister Meter</span>
        <button class="tool-btn mini" id="reset-blister-${pid}" style="margin:0; padding:2px 8px; font-size:11px;">Скинути стан ніг</button>
      </div>
      <input class="blister-slider" type="range" min="0" max="10"
             value="${blisterVal}" id="blister-${pid}"
             aria-label="Blister Meter">
      <div class="blister-display" id="blister-txt-${pid}">${getBlisterText(blisterVal)}</div>
    </div>
    
    <div class="gear-filters">
      <input type="search" id="gear-search-input" class="gear-search-input" placeholder="Пошук речей (наприклад, вазелін)..." aria-label="Пошук речей">
      <div class="gear-filter-chips">
        <button class="filter-chip active" data-cat="all">Всі</button>
        ${CATEGORIES.map(cat => {
          const emoji = cat.title.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Emoji}/gu)?.[0] || '';
          const name = cat.title.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Emoji}/gu, '').replace(/\//g, '').trim();
          return `<button class="filter-chip" data-cat="${cat.id}">${emoji} ${name}</button>`;
        }).join('')}
      </div>
    </div>

    <div class="gear-sections-container">
      ${categoriesHTML}
    </div>
  `;

  // Blister slider and reset listeners
  const slider = document.getElementById(`blister-${pid}`);
  const display = document.getElementById(`blister-txt-${pid}`);
  if (slider && display) {
    slider.addEventListener('input', (e) => {
      const val = parseInt(/** @type {HTMLInputElement} */(e.target).value);
      setBlisterValue(pid, val);
      display.textContent = getBlisterText(val);
    });
  }

  const resetBlisterBtn = document.getElementById(`reset-blister-${pid}`);
  if (resetBlisterBtn && slider && display) {
    resetBlisterBtn.addEventListener('click', () => {
      slider.value = '0';
      setBlisterValue(pid, 0);
      display.textContent = getBlisterText(0);
    });
  }

  // Filter and search logic
  const searchInput = document.getElementById('gear-search-input');
  const chips = document.querySelectorAll('.filter-chip');
  let activeCat = 'all';
  let searchQuery = '';

  const updateGearFilters = () => {
    const sections = document.querySelectorAll('.gear-section');
    sections.forEach(section => {
      const sectionCat = section.getAttribute('data-cat');
      const items = section.querySelectorAll('.gear-item');
      let visibleItemsCount = 0;

      items.forEach(item => {
        const itemName = item.querySelector('strong').textContent.toLowerCase();
        const itemComment = (item.querySelector('.comment')?.textContent || '').toLowerCase();
        const matchesSearch = itemName.includes(searchQuery) || itemComment.includes(searchQuery);

        if (matchesSearch) {
          item.style.display = '';
          visibleItemsCount++;
        } else {
          item.style.display = 'none';
        }
      });

      const matchesCat = activeCat === 'all' || sectionCat === activeCat;
      if (matchesCat && visibleItemsCount > 0) {
        section.style.display = '';
      } else {
        section.style.display = 'none';
      }
    });
  };

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      updateGearFilters();
    });
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCat = chip.getAttribute('data-cat') ?? 'all';
      updateGearFilters();
    });
  });

  const modal = document.getElementById('pilgrimModal');
  if (modal) { modal.classList.add('show'); document.body.style.overflow = 'hidden'; }
}

export function closeGearModal() {
  document.getElementById('pilgrimModal')?.classList.remove('show');
  document.body.style.overflow = '';
}



export function handleGearCheck(el) {
  const p2 = el.getAttribute('data-pid') ?? '';
  const key = el.getAttribute('data-key') ?? '';
  const newChecked = toggleGearItem(p2, key);

  el.classList.toggle('checked', newChecked);
  el.setAttribute('aria-checked', String(newChecked));

  const row = el.closest('.gear-item');
  if (row) {
    row.style.borderLeftColor = newChecked ? 'var(--olive)' : 'var(--terracotta)';
  }
}

export function buildCheck() {
  const saved = getChecklistState();

  const cats = CHECKLIST.map((cat, ci) => {
    const itemsData = cat.items.map((it, ii) => {
      const k = `${ci}-${ii}`;
      const done = saved[k] ?? false;
      return { it, ii, k, done };
    });

    itemsData.sort((a, b) => a.done - b.done);

    const items = itemsData.map(({ it, ii, k, done }) => {
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
      <div class="compostela-prep" id="compostelaPrep">${pct === 100 ? '<button class="compostela-btn-gold" id="getCompostelaBtn">🏆 Отримати Compostela</button>' : 'Фініш чекліста відкриє маленьку нагороду.'}</div>
    </div>
    ${cats}`;
}

export function handleCheckItem(el) {
  const k = el.getAttribute('data-k') ?? '';
  const done = toggleChecklistItem(k);
  el.classList.toggle('done', done);
  el.setAttribute('aria-checked', String(done));
  const cb = el.querySelector('.check-cb');
  if (cb) cb.textContent = done ? '✓' : '';
  
  // Removed visual reordering to prevent Layout Shift
  // The item will just toggle its styling (gray out / checkmark)
  // update progress
  const items = [...document.querySelectorAll('.check-item')];
  const doneCount = items.filter(item => item.classList.contains('done')).length;
  const total = items.length;
  const pct = Math.round((doneCount / Math.max(total, 1)) * 100);
  const bar = document.querySelector('.check-progress-bar span');
  const text = document.querySelector('.check-progress-text');
  const prize = document.getElementById('compostelaPrep');
  if (bar) bar.style.width = `${pct}%`;
  if (text) text.textContent = `${doneCount}/${total} готово · ${pct}%`;
  if (prize) {
    if (pct === 100) {
      prize.innerHTML = '<button class="compostela-btn-gold" id="getCompostelaBtn">🏆 Отримати Compostela</button>';
      document.getElementById('getCompostelaBtn')?.addEventListener('click', () => {
        const badge = document.getElementById('userBadge');
        const name = badge ? badge.getAttribute('data-name') : 'Паломнику';
        showCompostela(name);
      });
    } else {
      prize.textContent = 'Фініш чекліста відкриє маленьку нагороду.';
    }
  }
}
