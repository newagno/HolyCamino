import re
import os

filepath = r"c:\D\Learn\1PROJECTS\Camino\CaminoV2\assets\js\ui.js"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Inject global handlers inside renderApp
global_delegation = """
  // Global Event Delegation
  app.addEventListener('click', handleGlobalClick);
  app.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (handleGlobalClick(e)) e.preventDefault();
    }
  });

  // Wire up remaining non-delegated interactive pieces
  initNavArrows();
  initFoodRandom();
  initWeatherLazy();
  initRouteTools();
  initShellEgg();
  initLogoLongPress();
  initUserMenu();
  initWisdomModal();
"""

content = re.sub(
    r"// Wire up all interactive pieces[\s\S]*?initWisdomModal\(\);",
    global_delegation.strip(),
    content
)

# 2. Add handleGlobalClick and the handle* functions at the end of the file or near the top
handlers_code = """
// ─────────────────────────────────────────────
// GLOBAL EVENT HANDLERS
// ─────────────────────────────────────────────

function handleGlobalClick(e) {
  let handled = false;

  const navTab = e.target.closest('.nav-tab');
  if (navTab) { handleTabSwitch(navTab); handled = true; }

  const dictTab = e.target.closest('.dict-tab');
  if (dictTab && !handled) { handleDictTab(dictTab); handled = true; }

  const exTab = e.target.closest('.ex-tab');
  if (exTab && !handled) { handleExTab(exTab); handled = true; }

  const foodsTab = e.target.closest('.foods-tab');
  if (foodsTab && !handled) { handleFoodsTab(foodsTab); handled = true; }

  const pilgrimCard = e.target.closest('.pilgrim-card');
  if (pilgrimCard && !handled) { openGearModal(pilgrimCard.getAttribute('data-pid')); handled = true; }

  const albBtn = e.target.closest('.alb-toggle-btn');
  const dayCard = e.target.closest('.day-card');
  if (albBtn && !handled) { 
    handleBookingToggle(albBtn); 
    handled = true; 
  } else if (dayCard && !handled) {
    if (e.target.tagName !== 'A' && !e.target.closest('a')) {
      handleDayCardClick(dayCard);
      handled = true;
    }
  }

  const gearCheck = e.target.closest('.gear-item-check');
  if (gearCheck && !handled) { handleGearCheck(gearCheck); handled = true; }

  const checkItem = e.target.closest('.check-item');
  if (checkItem && !handled) { handleCheckItem(checkItem); handled = true; }

  return handled;
}

function handleTabSwitch(tab) {
  const tabs = document.querySelectorAll('.nav-tab');
  const sections = document.querySelectorAll('.section');
  tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
  sections.forEach(s => s.classList.remove('active'));

  tab.classList.add('active');
  tab.setAttribute('aria-selected', 'true');

  const sectionId = 's-' + tab.getAttribute('data-s');
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add('active');
    window.scrollTo(0, 0);
    const live = document.getElementById('navSectionLive');
    if (live) live.textContent = 'Секція: ' + tab.textContent;
  }
}

function handleDictTab(tab) {
  document.querySelectorAll('.dict-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
  tab.classList.add('active');
  tab.setAttribute('aria-selected', 'true');
  dictLang = tab.getAttribute('data-l');
  renderDict();
}

function handleExTab(tab) {
  document.querySelectorAll('.ex-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
  tab.classList.add('active');
  tab.setAttribute('aria-selected', 'true');
  exTab = tab.getAttribute('data-et');
  renderExercises();
}

function handleFoodsTab(tab) {
  const tabs = document.querySelectorAll('.foods-tab');
  tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
  tab.classList.add('active');
  tab.setAttribute('aria-selected', 'true');
  const filter = tab.getAttribute('data-filter') || 'all';
  const grid = document.getElementById('foodsGrid');
  if (grid) grid.innerHTML = buildFoodGridHTML(filter);
}

function handleDayCardClick(card) {
  const idx = card.getAttribute('data-i');
  if (!idx) return;
  const dd = document.getElementById(`dd-${idx}`);
  const isOpen = dd?.classList.toggle('expanded') ?? false;
  card.setAttribute('aria-expanded', String(isOpen));
  if (parseInt(idx) === ROUTE.length - 1) {
    document.getElementById('htip')?.classList.toggle('revealed');
  }
}

function handleBookingToggle(btn) {
  const key = btn.getAttribute('data-key');
  if (!key) return;
  const isBooked = toggleBookingItem(key);

  btn.style.background = isBooked ? 'var(--paper-dark)' : 'var(--olive)';
  btn.style.color = isBooked ? 'var(--ink)' : '#fff';
  btn.style.borderColor = isBooked ? 'var(--paper-dark)' : 'var(--olive)';
  btn.textContent = isBooked ? 'Відмінити' : 'Забронювати';

  const detItem = btn.closest('.det-item');
  if (detItem) {
    if (isBooked) {
      detItem.classList.add('booked');
      if (!detItem.querySelector('.booked-badge')) {
        detItem.insertAdjacentHTML('beforeend', '<div class="booked-badge"><svg class="icon" style="margin-right:3px;"><use href="#icon-check"></svg> ЗАБРОНЬОВАНО</div>');
      }
    } else {
      detItem.classList.remove('booked');
      const badge = detItem.querySelector('.booked-badge');
      if (badge) badge.remove();
    }
  }
  const bookingSec = document.getElementById('s-booking');
  if (bookingSec) bookingSec.innerHTML = buildBooking();
}

function handleGearCheck(el) {
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

function handleCheckItem(el) {
  const k = el.getAttribute('data-k') ?? '';
  const done = toggleChecklistItem(k);
  el.classList.toggle('done', done);
  el.setAttribute('aria-checked', String(done));
  const cb = el.querySelector('.check-cb');
  if (cb) cb.textContent = done ? '✓' : '';
  
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
"""

content += "\n" + handlers_code

# 3. Remove dead init code

# Remove initNav
content = re.sub(r"function initNav\(\)\s*\{[\s\S]*?\}\n\nfunction initNavArrows\(\)", "function initNavArrows()", content)

# Remove initDayCards
content = re.sub(r"function initDayCards\(\)\s*\{[\s\S]*?\}\n\n/\*\*", "/**", content)

# Remove initPilgrimCards
content = re.sub(r"function initPilgrimCards\(currentPilgrimId\)\s*\{[\s\S]*?\}\n\n/\*\*", "/**", content)

# Remove initDictTabs
content = re.sub(r"function initDictTabs\(\)\s*\{[\s\S]*?\}\n\n// ───", "// ───", content)

# Remove initExerciseTabs
content = re.sub(r"function initExerciseTabs\(\)\s*\{[\s\S]*?\}\n\n// ───", "// ───", content)

# Remove initFoodsList
content = re.sub(r"function initFoodsList\(\)\s*\{[\s\S]*?\}\n\n// ───", "// ───", content)

# Modify openGearModal to remove gear-item-check listener
content = re.sub(r"// Gear item check toggle[\s\S]*?// Blister slider and reset listeners", "// Blister slider and reset listeners", content)

# Modify initChecklist to remove .check-item listener
# we still need attachCompostelaEvent for initial load in initChecklist, but we can simplify initChecklist
new_initChecklist = """function initChecklist() {
  document.getElementById('getCompostelaBtn')?.addEventListener('click', () => {
    const badge = document.getElementById('userBadge');
    const name = badge ? badge.getAttribute('data-name') : 'Паломнику';
    showCompostela(name);
  });
}"""

content = re.sub(r"function initChecklist\(\)\s*\{[\s\S]*?\}\n\n// ───", new_initChecklist + "\n\n// ───", content)


with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("done")
