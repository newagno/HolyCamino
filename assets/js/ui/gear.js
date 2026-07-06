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
  const modalHTML = `
    <div id="compostelaModal" class="modal show" role="dialog" aria-modal="true" style="display:flex;">
      <div class="modal-content" style="background:#fff;color:#333;text-align:center;padding:30px;">
        <button class="modal-close" onclick="this.closest('.modal').remove()" aria-label="Закрити"><svg class="icon"><use href="#icon-close"></svg></button>
        <h2 style="font-family:serif;font-size:24px;color:#8a1538;margin-bottom:10px;">Compostela</h2>
        <div style="font-size:14px;margin-bottom:20px;font-style:italic;">Цим підтверджується, що</div>
        <div style="font-size:28px;font-weight:bold;margin-bottom:20px;font-family:serif;">${name}</div>
        <div style="font-size:14px;margin-bottom:20px;font-style:italic;">успішно завершив підготовку до Шляху Святого Якова!</div>
        <div style="font-size:40px;">🏆🐚🇪🇸</div>
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
  
  // Reorder visually within the category
  const catContainer = el.closest('.check-category');
  if (catContainer) {
    if (done) {
      catContainer.appendChild(el);
    } else {
      const firstDone = Array.from(catContainer.querySelectorAll('.check-item')).find(x => x.classList.contains('done'));
      if (firstDone) {
        catContainer.insertBefore(el, firstDone);
      } else {
        catContainer.appendChild(el);
      }
    }
  }
  
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
