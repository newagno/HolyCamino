import os
import re

base_dir = r"c:\D\Learn\1PROJECTS\Camino\CaminoV2\assets\js"
ui_dir = os.path.join(base_dir, "ui")
if not os.path.exists(ui_dir):
    os.makedirs(ui_dir)

# Read ui.js
with open(os.path.join(base_dir, "ui.js"), "r", encoding="utf-8") as f:
    ui_js_content = f.read()

# Read utils.js
with open(os.path.join(base_dir, "utils.js"), "r", encoding="utf-8") as f:
    utils_js_content = f.read()

# 1. Extract injectIcons and formatDateDisplay
def extract_func(name):
    pattern = rf"export function {name}\([\s\S]*?^}}"
    match = re.search(pattern, ui_js_content, re.MULTILINE)
    return match.group(0) if match else ""

inject_icons_code = extract_func("injectIcons")
format_date_code = extract_func("formatDateDisplay")

# Ensure they aren't already in utils.js
if "export function injectIcons" not in utils_js_content and inject_icons_code:
    utils_js_content += "\n\n" + inject_icons_code

if "export function formatDateDisplay" not in utils_js_content and format_date_code:
    utils_js_content += "\n\n" + format_date_code

with open(os.path.join(base_dir, "utils.js"), "w", encoding="utf-8") as f:
    f.write(utils_js_content)

# 2. Write ui/core.js
core_js = """
import { PILGRIMS } from '../config.js';
import { applyNightMode } from '../utils.js';

export const NAV_TABS = [
  { id: 'route', label: 'Маршрут' },
  { id: 'booking', label: 'Бронювання' },
  { id: 'history', label: 'Історія' },
  { id: 'pilgrims', label: 'Паломники' },
  { id: 'dict', label: 'Словник' },
  { id: 'food', label: "Що з'їсти" },
  { id: 'exercises', label: 'Вправи' },
  { id: 'apps', label: 'Додатки' },
  { id: 'safety', label: 'Безпека' },
  { id: 'playlist', label: 'Плейлист' },
  { id: 'check', label: 'Чекліст' },
];

export const NAV_ICONS = {
  route: 'map', booking: 'bed', history: 'scroll', pilgrims: 'walk',
  dict: 'globe', food: 'food', exercises: 'bolt', apps: 'phone',
  safety: 'shield', playlist: 'headset', check: 'check',
};

export function navIcon(tabId) {
  const icon = NAV_ICONS[tabId] ?? 'shell-shape';
  return `<span class="nav-icon" aria-hidden="true"><svg class="icon"><use href="#icon-${icon}"></use></svg></span>`;
}

export function buildNav() {
  const tabs = NAV_TABS.map((t, i) =>
    `<button class="nav-tab${i === 0 ? ' active' : ''}" data-s="${t.id}" role="tab" aria-selected="${i === 0}" aria-controls="s-${t.id}">${navIcon(t.id)}<span class="nav-label">${t.label}</span></button>`
  ).join('');

  return `
  <div class="nav-wrapper" role="tablist">
    <button class="nav-arrow left" id="navArrowLeft" aria-label="Прокрутити вліво"><svg class="icon"><use href="#icon-left"></svg></button>
    <nav class="nav-tabs" id="navTabs">${tabs}</nav>
    <button class="nav-arrow right" id="navArrowRight" aria-label="Прокрутити вправо"><svg class="icon"><use href="#icon-right"></svg></button>
  </div>`;
}

export function initNavArrows() {
  const tabs = document.getElementById('navTabs');
  const left = document.getElementById('navArrowLeft');
  const right = document.getElementById('navArrowRight');
  if (!tabs || !left || !right) return;

  const update = () => {
    left.classList.toggle('visible', tabs.scrollLeft > 5);
    right.classList.toggle('visible', tabs.scrollWidth - tabs.clientWidth - tabs.scrollLeft > 5);
  };

  left.addEventListener('click', () => tabs.scrollBy(-150, 0));
  right.addEventListener('click', () => tabs.scrollBy(150, 0));
  tabs.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  setTimeout(update, 100);
}

export function buildHeader(p, id) {
  const initial = id === 'guest' ? 'В' : p.initial;
  const name = id === 'guest' ? 'Вуаєрист' : p.name;
  const isNight = document.body.classList.contains('night-mode');
  return `
  <header class="header">
    <div class="header-left">
      <div class="header-title">
        <span class="shell-icon" id="shellEgg" role="button" tabindex="0" aria-label="Секретний елемент">
          <img src="assets/files/camino.svg" alt="Мушля" class="icon" style="width:24px;height:24px;object-fit:contain;vertical-align:middle;">
        </span>
        Твою ж Каміно!
      </div>
    </div>
    <div class="header-cd" role="timer">
        <div class="countdown-label">До старту <svg class="icon" style="font-size:10px;"><use href="#icon-plane"></svg></div>
        <div class="countdown-grid">
          <div class="countdown-cell"><span class="countdown-num" id="cd-d">—</span><span class="countdown-unit"> дн</span></div>
          <div class="countdown-cell"><span class="countdown-num" id="cd-h">—</span><span class="countdown-unit"> год</span></div>
          <div class="countdown-cell"><span class="countdown-num" id="cd-m">—</span><span class="countdown-unit"> хв</span></div>
          <div class="countdown-cell"><span class="countdown-num" id="cd-s">—</span><span class="countdown-unit"> сек</span></div>
        </div>
      </div>
    <div class="header-right">
      <button class="night-toggle-header" id="nightToggleH" title="Нічний режим" aria-label="Перемкнути нічний режим">
        <svg class="icon"><use href="#icon-${isNight ? 'sun' : 'moon'}"></svg>
      </button>
      <div class="user-badge" id="userBadge" role="button" tabindex="0" aria-haspopup="true" aria-expanded="false" data-initial="${initial}" data-name="${name}">
        <span class="user-badge-text">${initial}</span>
        <div class="user-menu" id="userMenu" role="menu">
          <button id="logoutBtn" role="menuitem">Вийти з акаунту</button>
        </div>
      </div>
    </div>
  </header>`;
}

export function initUserMenu() {
  const badge = document.getElementById('userBadge');
  const menu = document.getElementById('userMenu');
  const logoutBtn = document.getElementById('logoutBtn');
  if (!badge || !menu || !logoutBtn) return;

  const toggle = () => {
    const open = menu.classList.toggle('show');
    badge.setAttribute('aria-expanded', String(open));
    const textSpan = badge.querySelector('.user-badge-text');
    if (textSpan) {
      if (open) {
        textSpan.textContent = badge.getAttribute('data-name');
        badge.style.width = 'auto';
        badge.style.padding = '0 12px';
        badge.style.borderRadius = '16px';
      } else {
        textSpan.textContent = badge.getAttribute('data-initial');
        badge.style.width = '';
        badge.style.padding = '';
        badge.style.borderRadius = '';
      }
    }
  };

  badge.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
  badge.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });

  logoutBtn.addEventListener('click', () => {
    import('../storage.js').then(({ clearSavedPilgrim }) => {
      clearSavedPilgrim();
      location.reload();
    });
  });

  document.addEventListener('click', () => {
    menu.classList.remove('show');
    badge.setAttribute('aria-expanded', 'false');
  });

  const nightBtn = document.getElementById('nightToggleH');
  if (nightBtn) {
    nightBtn.addEventListener('click', () => {
      applyNightMode(!document.body.classList.contains('night-mode'));
    });
  }
}

export function buildHero(p, id) {
  const displayName = id === 'guest' ? 'Вуайєрист' : p.name;
  return `
    <div class="hero" id="heroLogoEgg" role="button" tabindex="0" aria-label="Головне лого (затисніть для сюрпризу)">
      <div class="hero-greeting">Привіт, ${displayName}!</div>
      <h1 class="hero-title" style="display:flex;justify-content:center;align-items:center;gap:12px;margin-top:10px;margin-bottom:20px;">
        <span>Buen <span class="accent">Camino</span></span>
        <img src="assets/files/logo.png" alt="Buen Camino"
          style="max-height:1.2em;width:auto;object-fit:contain;pointer-events:none;"
          draggable="false">
      </h1>
      <p class="hero-subtitle">Camino Português da Costa · 261 км · 12 днів пішки</p>
    </div>`;
}
"""
with open(os.path.join(ui_dir, "core.js"), "w", encoding="utf-8") as f:
    f.write(core_js)


# 3. Write ui/route.js
# Extract buildRoute, buildRouteTools, initRouteTools from ui_js_content
def extract_body(name):
    # Regex for functions that might have dependencies but we will just extract them entirely
    # Actually, they are from ui.js
    pattern = rf"function {name}\([\s\S]*?^}}"
    match = re.search(pattern, ui_js_content, re.MULTILINE)
    return match.group(0).replace(f"function {name}", f"export function {name}") if match else ""

build_route = extract_body("buildRoute")
build_route_tools = extract_body("buildRouteTools")
init_route_tools = extract_body("initRouteTools")

# Add handleDayCardClick manually since we refactored it to be event delegated
handle_day_card_click = """
export function handleDayCardClick(card) {
  const idx = card.getAttribute('data-i');
  if (!idx) return;
  const dd = document.getElementById(`dd-${idx}`);
  const isOpen = dd?.classList.toggle('expanded') ?? false;
  card.setAttribute('aria-expanded', String(isOpen));
  if (parseInt(idx) === document.querySelectorAll('.day-card').length - 1) {
    document.getElementById('htip')?.classList.toggle('revealed');
  }
}
"""

route_js = f"""
import {{ ROUTE, CITY_COORDS }} from '../config.js';
import {{ getBookingState }} from '../storage.js';
import {{ buildStageProgress, formatDateDisplay, injectIcons, loadWeatherForDay }} from '../utils.js';

{build_route}

{build_route_tools}

{init_route_tools}

{handle_day_card_click}

export function initWeatherLazy() {{
  ROUTE.forEach((d, i) => {{
    if (!CITY_COORDS[d.date]) return;
    const card = document.querySelector(`.day-card[data-i="${{i}}"]`);
    if (!card) return;

    const load = () => loadWeatherForDay(i, d.date, d.date);
    card.addEventListener('click', load, {{ once: true }});
    card.addEventListener('keydown', (e) => {{
      if (e.key === 'Enter' || e.key === ' ') load();
    }}, {{ once: true }});
  }});
}}
"""
with open(os.path.join(ui_dir, "route.js"), "w", encoding="utf-8") as f:
    f.write(route_js)


# 4. Write ui/index.js
index_js = """
import { PILGRIMS } from '../config.js';
import { buildHeader, buildNav, buildHero, initNavArrows, initUserMenu } from './core.js';
import { buildRoute, handleDayCardClick, initRouteTools, initWeatherLazy } from './route.js';
import { initShellEgg, initLogoLongPress } from '../easterEggs.js';

// Тимчасові імпорти з моноліту для сумісності (Крок 3)
import { 
  buildBooking, handleBookingToggle, 
  buildHistory, buildPilgrims, buildDict, handleDictTab,
  buildFood, handleFoodsTab, initFoodRandom,
  buildExercises, handleExTab, buildApps, buildSafety, buildPlaylist, 
  buildCheck, openGearModal, handleGearCheck, handleCheckItem
} from '../ui.js';

export function renderApp(id) {
  const p = PILGRIMS[id];
  const app = document.getElementById('app');
  if (!app) return;

  const displayName = id === 'guest' ? 'Вуайєрист' : p.name;
  
  app.innerHTML = `
    ${buildHeader(p, id)}
    ${buildNav()}
    ${buildHero(p, id)}

    <p id="navSectionLive" class="sr-only" aria-live="polite" aria-atomic="true"></p>

    <main class="content-wrapper">
      <section class="section active" id="s-route" data-loaded="true">${buildRoute()}</section>
      <section class="section" id="s-booking"></section>
      <section class="section" id="s-history"></section>
      <section class="section" id="s-pilgrims"></section>
      <section class="section" id="s-dict"></section>
      <section class="section" id="s-food"></section>
      <section class="section" id="s-exercises"></section>
      <section class="section" id="s-apps"></section>
      <section class="section" id="s-safety"></section>
      <section class="section" id="s-playlist"></section>
      <section class="section" id="s-check"></section>
    </main>

    <div id="modal-root"></div>

    <footer class="footer">
      <div><img src="assets/files/camino.svg" alt="Мушля" style="width:24px;height:24px;object-fit:contain;vertical-align:middle;"></div>
      <div>Buen Camino, ${displayName}!</div>
    </footer>
  `;

  // Глобальний Event Delegation
  initGlobalEvents(app);

  // Ініціалізація статичних модулів
  initNavArrows();
  initUserMenu();
  initRouteTools();
  initWeatherLazy();
  initShellEgg();
  initLogoLongPress();

  window.scrollTo(0, 0);

  // Eager Prefetch для інших ледачих модулів
  // (Наразі ми ще не винесли інші модулі, але тут буде їх завантаження)
  setTimeout(() => {
    // import('./booking.js').catch(()=>{});
  }, 1000);
}

function initGlobalEvents(appContainer) {
  appContainer.addEventListener('click', handleGlobalClick);
  appContainer.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (handleGlobalClick(e)) e.preventDefault();
    }
  });
}

function handleGlobalClick(e) {
  let handled = false;

  const navTab = e.target.closest('.nav-tab');
  if (navTab) { handleTabSwitch(navTab); handled = true; }

  // Route interactions
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

  // Тимчасовий fallback до старих обробників
  const dictTab = e.target.closest('.dict-tab');
  if (dictTab && !handled) { handleDictTab(dictTab); handled = true; }

  const exTab = e.target.closest('.ex-tab');
  if (exTab && !handled) { handleExTab(exTab); handled = true; }

  const foodsTab = e.target.closest('.foods-tab');
  if (foodsTab && !handled) { handleFoodsTab(foodsTab); handled = true; }

  const pilgrimCard = e.target.closest('.pilgrim-card');
  if (pilgrimCard && !handled) { openGearModal(pilgrimCard.getAttribute('data-pid')); handled = true; }

  const gearCheck = e.target.closest('.gear-item-check');
  if (gearCheck && !handled) { handleGearCheck(gearCheck); handled = true; }

  const checkItem = e.target.closest('.check-item');
  if (checkItem && !handled) { handleCheckItem(checkItem); handled = true; }

  return handled;
}

async function handleTabSwitch(tab) {
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

    // Ледачий рендер
    if (target.dataset.loaded !== 'true') {
      try {
        /*
        switch(sectionId) {
          case 's-booking':
            const { buildBooking } = await import('./booking.js');
            target.innerHTML = buildBooking();
            break;
          ...
        }
        */
        // Тимчасовий fallback до старих білдерів у ui.js
        if (sectionId === 's-booking') target.innerHTML = buildBooking();
        if (sectionId === 's-history') target.innerHTML = buildHistory();
        if (sectionId === 's-pilgrims') target.innerHTML = buildPilgrims();
        if (sectionId === 's-dict') target.innerHTML = buildDict();
        if (sectionId === 's-food') target.innerHTML = buildFood();
        if (sectionId === 's-exercises') target.innerHTML = buildExercises();
        if (sectionId === 's-apps') target.innerHTML = buildApps();
        if (sectionId === 's-safety') target.innerHTML = buildSafety();
        if (sectionId === 's-playlist') target.innerHTML = buildPlaylist();
        if (sectionId === 's-check') target.innerHTML = buildCheck();

        target.dataset.loaded = 'true';
      } catch (err) {
        console.error('Failed to load module:', err);
        target.innerHTML = `<div style="text-align:center;padding:20px;">Помилка завантаження. Перевірте з'єднання.</div>`;
      }
    }
  }
}
"""
with open(os.path.join(ui_dir, "index.js"), "w", encoding="utf-8") as f:
    f.write(index_js)


# 5. Modify main.js to import renderApp from ui/index.js instead of ui.js
with open(os.path.join(base_dir, "main.js"), "r", encoding="utf-8") as f:
    main_js = f.read()

main_js = main_js.replace("import { renderApp, buildPilgrimList } from './ui.js';", "import { renderApp } from './ui/index.js';\nimport { buildPilgrimList } from './ui.js';")

with open(os.path.join(base_dir, "main.js"), "w", encoding="utf-8") as f:
    f.write(main_js)

print("Files generated and main.js updated successfully.")
