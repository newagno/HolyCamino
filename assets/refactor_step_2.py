import os
import re

base_dir = r"c:\D\Learn\1PROJECTS\Camino\CaminoV2\assets\js"
ui_dir = os.path.join(base_dir, "ui")

with open(os.path.join(base_dir, "ui.js"), "r", encoding="utf-8") as f:
    ui_js_content = f.read()

def extract_func(name, make_export=True):
    pattern = rf"(?:export\s+)?function {name}\b[\s\S]*?^}}"
    match = re.search(pattern, ui_js_content, re.MULTILINE)
    if not match:
        return ""
    code = match.group(0)
    if make_export and not code.startswith("export"):
        code = code.replace(f"function {name}", f"export function {name}")
    return code

def write_module(filename, imports, *funcs):
    content = imports + "\n\n"
    for func in funcs:
        content += extract_func(func) + "\n\n"
    with open(os.path.join(ui_dir, filename), "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")

# 1. booking.js
booking_imports = """import { ROUTE } from '../config.js';
import { getBookingState, toggleBookingItem } from '../storage.js';
import { formatDateDisplay } from '../utils.js';"""
write_module("booking.js", booking_imports, "buildBooking", "handleBookingToggle")

# 2. history.js
write_module("history.js", "import { HISTORY } from '../config.js';", "buildHistory")

# 3. dict.js
dict_imports = """import { DICTIONARY } from '../config.js';

export let dictLang = 'es'; // Global state inside module
"""
# need to handle dictLang specifically since it's a let
with open(os.path.join(ui_dir, "dict.js"), "w", encoding="utf-8") as f:
    f.write(dict_imports + "\n" + extract_func("buildDict") + "\n\n" + extract_func("renderDict") + "\n\n" + extract_func("handleDictTab").replace("dictLang = tab", "dictLang = tab") + "\n")

# 4. food.js
food_imports = """import { FOOD_CATEGORIES, FOODS, RAND_STRINGS } from '../config.js';"""
write_module("food.js", food_imports, "buildFood", "buildFoodGridHTML", "handleFoodsTab", "initFoodRandom")

# 5. exercises.js
ex_imports = """import { EXERCISES } from '../config.js';

export let exTab = 'warmup'; // Global state inside module
"""
with open(os.path.join(ui_dir, "exercises.js"), "w", encoding="utf-8") as f:
    f.write(ex_imports + "\n" + extract_func("buildExercises") + "\n\n" + extract_func("renderExercises") + "\n\n" + extract_func("handleExTab") + "\n")

# 6. apps.js
write_module("apps.js", "import { APPS } from '../config.js';", "buildApps")

# 7. safety.js
write_module("safety.js", "import { SAFETY, USEFUL_PHRASES } from '../config.js';\nimport { injectIcons } from '../utils.js';", "buildSafety")

# 8. playlist.js
write_module("playlist.js", "import { PLAYLIST } from '../config.js';", "buildPlaylist")

# 9. gear.js (Pilgrims, Gear Modals, Checklist)
gear_imports = """import { PILGRIMS, GEAR, CHECKLIST } from '../config.js';
import { getGearState, toggleGearItem, getChecklistState, toggleChecklistItem } from '../storage.js';
import { injectIcons } from '../utils.js';
import { showCompostela } from '../easterEggs.js';"""
write_module("gear.js", gear_imports, "buildPilgrims", "openGearModal", "closeGearModal", "buildBlisterFirstAid", "handleGearCheck", "buildCheck", "handleCheckItem")


# 10. Rewrite ui/index.js
index_js = """import { PILGRIMS } from '../config.js';
import { buildHeader, buildNav, buildHero, initNavArrows, initUserMenu } from './core.js';
import { buildRoute, handleDayCardClick, initRouteTools, initWeatherLazy } from './route.js';
import { initShellEgg, initLogoLongPress } from '../easterEggs.js';

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

  initGlobalEvents(app);

  initNavArrows();
  initUserMenu();
  initRouteTools();
  initWeatherLazy();
  initShellEgg();
  initLogoLongPress();

  window.scrollTo(0, 0);

  // Eager Prefetch: Завантаження модулів у фоні для забезпечення офлайн-роботи
  setTimeout(() => {
    import('./booking.js').catch(() => {});
    import('./history.js').catch(() => {});
    import('./gear.js').catch(() => {});
    import('./dict.js').catch(() => {});
    import('./food.js').catch(() => {});
    import('./exercises.js').catch(() => {});
    import('./apps.js').catch(() => {});
    import('./safety.js').catch(() => {});
    import('./playlist.js').catch(() => {});
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

  const albBtn = e.target.closest('.alb-toggle-btn');
  const dayCard = e.target.closest('.day-card');
  
  if (albBtn && !handled) { 
    import('./booking.js').then(m => m.handleBookingToggle(albBtn)).catch(console.error);
    handled = true; 
  } else if (dayCard && !handled) {
    if (e.target.tagName !== 'A' && !e.target.closest('a')) {
      handleDayCardClick(dayCard);
      handled = true;
    }
  }

  const dictTab = e.target.closest('.dict-tab');
  if (dictTab && !handled) { import('./dict.js').then(m => m.handleDictTab(dictTab)).catch(console.error); handled = true; }

  const exTab = e.target.closest('.ex-tab');
  if (exTab && !handled) { import('./exercises.js').then(m => m.handleExTab(exTab)).catch(console.error); handled = true; }

  const foodsTab = e.target.closest('.foods-tab');
  if (foodsTab && !handled) { import('./food.js').then(m => m.handleFoodsTab(foodsTab)).catch(console.error); handled = true; }

  const pilgrimCard = e.target.closest('.pilgrim-card');
  if (pilgrimCard && !handled) { import('./gear.js').then(m => m.openGearModal(pilgrimCard.getAttribute('data-pid'))).catch(console.error); handled = true; }

  const gearCheck = e.target.closest('.gear-item-check');
  if (gearCheck && !handled) { import('./gear.js').then(m => m.handleGearCheck(gearCheck)).catch(console.error); handled = true; }

  const checkItem = e.target.closest('.check-item');
  if (checkItem && !handled) { import('./gear.js').then(m => m.handleCheckItem(checkItem)).catch(console.error); handled = true; }

  return handled;
}

async function handleTabSwitch(tab) {
  const sectionId = 's-' + tab.getAttribute('data-s');
  const target = document.getElementById(sectionId);
  if (!target) return;

  // Безпечний ледачий рендер
  if (target.dataset.loaded !== 'true') {
    try {
      if (sectionId === 's-booking') {
        const { buildBooking } = await import('./booking.js');
        target.innerHTML = buildBooking();
      } else if (sectionId === 's-history') {
        const { buildHistory } = await import('./history.js');
        target.innerHTML = buildHistory();
      } else if (sectionId === 's-pilgrims') {
        const { buildPilgrims } = await import('./gear.js');
        target.innerHTML = buildPilgrims();
      } else if (sectionId === 's-dict') {
        const { buildDict } = await import('./dict.js');
        target.innerHTML = buildDict();
      } else if (sectionId === 's-food') {
        const { buildFood, initFoodRandom } = await import('./food.js');
        target.innerHTML = buildFood();
        initFoodRandom();
      } else if (sectionId === 's-exercises') {
        const { buildExercises } = await import('./exercises.js');
        target.innerHTML = buildExercises();
      } else if (sectionId === 's-apps') {
        const { buildApps } = await import('./apps.js');
        target.innerHTML = buildApps();
      } else if (sectionId === 's-safety') {
        const { buildSafety } = await import('./safety.js');
        target.innerHTML = buildSafety();
      } else if (sectionId === 's-playlist') {
        const { buildPlaylist } = await import('./playlist.js');
        target.innerHTML = buildPlaylist();
      } else if (sectionId === 's-check') {
        const { buildCheck } = await import('./gear.js');
        target.innerHTML = buildCheck();
      }

      target.dataset.loaded = 'true';
    } catch (err) {
      console.error('Lazy load error:', err);
      target.innerHTML = '<div style="text-align:center;padding:20px;color:var(--terracotta);font-weight:bold;">Помилка завантаження секції. Перевірте підключення до мережі.</div>';
      return; // Переривання: не перемикаємо вкладку, залишаємось на поточній
    }
  }

  // Перемикання стилів та видимості
  const tabs = document.querySelectorAll('.nav-tab');
  const sections = document.querySelectorAll('.section');
  tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
  sections.forEach(s => s.classList.remove('active'));

  tab.classList.add('active');
  tab.setAttribute('aria-selected', 'true');
  target.classList.add('active');

  window.scrollTo(0, 0);
  const live = document.getElementById('navSectionLive');
  if (live) live.textContent = 'Секція: ' + tab.textContent;
}
"""
with open(os.path.join(ui_dir, "index.js"), "w", encoding="utf-8") as f:
    f.write(index_js)

# Delete ui.js since it's fully migrated
os.remove(os.path.join(base_dir, "ui.js"))

print("Step 4 and 5 completed successfully. ui.js removed.")
