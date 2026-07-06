import { PILGRIMS } from '../config.js';
import { buildHeader, buildNav, buildHero, initNavArrows, initUserMenu } from './core.js';
import { buildRoute, handleDayCardClick, initRouteTools, initWeatherLazy } from './route.js';
import { initShellEgg, initLogoLongPress } from '../easterEggs.js';

export async function renderApp(id) {
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
      <section class="section active" id="s-route" data-loaded="true">${await buildRoute()}</section>
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

  
}

function initGlobalEvents(appContainer) {
  document.addEventListener('click', handleGlobalClick);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (handleGlobalClick(e)) e.preventDefault();
    } else if (e.key === 'Escape') {
      const openModal = document.querySelector('.modal.show');
      if (openModal) {
        if (openModal.id === 'pilgrimModal') {
          import('./gear.js').then(m => m.closeGearModal()).catch(console.error);
        } else {
          openModal.classList.remove('show');
          document.body.style.overflow = '';
        }
      }
    }
  });
}

function handleGlobalClick(e) {
  let handled = false;

  const navTab = e.target.closest('.nav-tab');
  if (navTab) { handleTabSwitch(navTab); handled = true; }

  const albBtn = e.target.closest('.alb-toggle-btn');
  const completeStageBtn = e.target.closest('.complete-stage-btn');
  const dayCard = e.target.closest('.day-card');
  
  if (albBtn && !handled) { 
    import('./booking.js').then(m => m.handleBookingToggle(albBtn)).catch(console.error);
    handled = true; 
  } else if (completeStageBtn && !handled) {
    const canvas = document.getElementById('confettiCanvas');
    if (canvas) {
      import('../utils.js').then(m => m.startConfetti(canvas));
    }
    completeStageBtn.innerHTML = '<svg class="icon" style="margin-right:5px;"><use href="#icon-check"></use></svg> Етап завершено!';
    completeStageBtn.style.opacity = '0.7';
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

  const pilgrimClose = e.target.closest('#pilgrimModalClose');
  if (pilgrimClose && !handled) { import('./gear.js').then(m => m.closeGearModal()).catch(console.error); handled = true; }

  const pilgrimModal = e.target.closest('#pilgrimModal');
  if (pilgrimModal && e.target === pilgrimModal && !handled) { import('./gear.js').then(m => m.closeGearModal()).catch(console.error); handled = true; }

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
        target.innerHTML = await buildBooking();
      } else if (sectionId === 's-history') {
        const { buildHistory } = await import('./history.js');
        target.innerHTML = buildHistory();
      } else if (sectionId === 's-pilgrims') {
        const { buildPilgrims } = await import('./gear.js');
        target.innerHTML = buildPilgrims();
      } else if (sectionId === 's-dict') {
        const { buildDict, renderDict } = await import('./dict.js');
        target.innerHTML = buildDict();
        renderDict();
      } else if (sectionId === 's-food') {
        const { buildFood, initFoodRandom } = await import('./food.js');
        target.innerHTML = await buildFood();
        initFoodRandom();
      } else if (sectionId === 's-exercises') {
        const { buildExercises, renderExercises } = await import('./exercises.js');
        target.innerHTML = buildExercises();
        renderExercises();
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
