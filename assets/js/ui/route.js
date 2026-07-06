// No static import for config
import { getBookingState } from '../storage.js';
import { buildStageProgress, formatDateDisplay, injectIcons, loadWeatherForDay } from '../utils.js';

export async function buildRoute() {
  const { ROUTE, CITY_COORDS, STAGE_DAYS } = await import('../config/route.js');
  const stageHTML = buildStageProgress(STAGE_DAYS);
  const lastIdx = ROUTE.length - 1;
  const bookingState = getBookingState();

  const cards = ROUTE.map((d, i) => {
    const isSpecial = !!d.special;
    const isBirthday = d.special === 'birthday-holiday';
    const isHoliday = d.special === 'apostolo-mass';

    const tags = [
      d.km ? `<span class="day-tag km"><svg class="icon" style="font-size:10px;margin-right:3px;"><use href="#icon-walk"></svg> ${d.km} км</span>` : '',
      d.elevation ? `<span class="day-tag elevation" style="background:var(--paper-dark);color:var(--ink);"><svg class="icon" style="font-size:10px;margin-right:2px;"><use href="#icon-up"></use></svg>${d.elevation.up}м <svg class="icon" style="font-size:10px;margin-left:5px;margin-right:2px;"><use href="#icon-down"></use></svg>${d.elevation.down}м</span>` : '',
      d.type === 'walking-hard' ? '<span class="day-tag"><svg class="icon" style="font-size:10px;margin-right:3px;"><use href="#icon-alert"></svg> Складно</span>' : '',
      d.type === 'walking-easy' ? '<span class="day-tag">😊 Легко</span>' : '',
      d.type === 'walking-finish' ? '<span class="day-tag"><svg class="icon" style="font-size:10px;margin-right:3px;"><use href="#icon-trophy"></svg> Фініш!</span>' : '',
      isBirthday ? '<span class="day-tag" style="background:#ffd6d0;color:var(--terracotta-dark);"><svg class="icon" style="font-size:10px;margin-right:3px;"><use href="#icon-cake"></svg> Apóstolo</span>' : '',
      isHoliday ? '<span class="day-tag" style="background:#ffd6d0;color:var(--terracotta-dark);"><svg class="icon" style="font-size:10px;margin-right:3px;"><use href="#icon-church"></svg> 25 Липня</span>' : '',
    ].join('');

    const specialClass = isSpecial ? ` special ${isBirthday ? 'birthday' : isHoliday ? 'holiday' : ''}` : '';

    // Places
    const placesHTML = d.places.length ? (() => {
      let html = '';
      let inTourGroup = false;

      d.places.forEach((p) => {
        const isChild = p.n.trim().startsWith('↳');
        
        if (isChild) {
          if (!inTourGroup) {
            html += `<div class="tour-children">`;
            inTourGroup = true;
          }
          
          const cleanName = p.n.replace(/^↳\s*/, '');
          html += `
            <div class="det-item tour-child">
              <a class="det-name" href="${p.m}" target="_blank" rel="noopener noreferrer">
                ${injectIcons(cleanName)}
                ${p.secret ? '<span class="secret-tag"><svg class="icon" style="font-size:9px;margin-right:2px;"><use href="#icon-shush"></svg> секрет</span>' : ''}
                ${p.stamp ? '<span class="stamp-mark">✦</span>' : ''}
              </a>
              <div class="det-info">${injectIcons(p.i)}</div>
            </div>`;
        } else {
          if (inTourGroup) {
            html += `</div>`;
            inTourGroup = false;
          }
          
          const isTourParent = p.n.includes('Тур') || p.n.includes('TRAVEL');
          const itemClass = isTourParent ? 'det-item tour-parent' : 'det-item';

          html += `
            <div class="${itemClass}">
              <a class="det-name" href="${p.m}" target="_blank" rel="noopener noreferrer">
                ${injectIcons(p.n)}
                ${p.secret ? '<span class="secret-tag"><svg class="icon" style="font-size:9px;margin-right:2px;"><use href="#icon-shush"></svg> секрет</span>' : ''}
                ${p.stamp ? '<span class="stamp-mark">✦</span>' : ''}
              </a>
              <div class="det-info">${injectIcons(p.i)}</div>
            </div>`;
        }
      });

      if (inTourGroup) {
        html += `</div>`;
      }

      return `
        <div class="detail-section">
          <div class="det-title"><svg class="icon" style="margin-right:5px;"><use href="#icon-pin"></svg> Що подивитись / де поїсти</div>
          ${html}
        </div>`;
    })() : '';

    // Albergues
    const bookingState = getBookingState();
    const albsHTML = d.albs.length ? (() => {
      const rows = d.albs.map((a, aIdx) => {
        const key = `${i}-${aIdx}`;
        const isBooked = (a.c?.includes('ЗАБРОНЬОВАНО') ?? false) || bookingState[key];
        const cleanComment = (a.c ?? '').replace('(ЗАБРОНЬОВАНО)', '').replace('ЗАБРОНЬОВАНО', '').trim();
        const mapLink = a.m || `https://www.google.com/maps/search/$${encodeURIComponent(a.n)}`;
        const bookLink = a.b ? `<a class="det-book-btn" href="${a.b}" target="_blank" rel="noopener noreferrer"><svg class="icon" style="margin-right:3px;"><use href="#icon-ticket"></svg> Book</a>` : '';
        const bookedBadge = isBooked ? '<div class="booked-badge"><svg class="icon" style="margin-right:3px;"><use href="#icon-check"></svg> ЗАБРОНЬОВАНО</div>' : '';
        const bookedClass = isBooked ? 'booked' : '';
        const btnBg = isBooked ? 'var(--paper-dark)' : 'var(--olive)';
        const btnColor = isBooked ? 'var(--ink)' : '#fff';
        const btnBorder = isBooked ? 'var(--paper-dark)' : 'var(--olive)';
        const btnLabel = isBooked ? 'Відмінити' : 'Забронювати';
        return `
            <div class="det-item ${bookedClass}">
              <div style="display:flex;justify-content:space-between;align-items:center;width:100%;gap:10px;">
                <div style="flex:1;">
                  <a class="det-name" href="${mapLink}" target="_blank" rel="noopener noreferrer"><svg class="icon" style="margin-right:4px;"><use href="#icon-pin"></svg> ${injectIcons(a.n)}</a>
                  <div class="det-info"><strong>${a.p}</strong>${cleanComment ? ' — ' + injectIcons(cleanComment) : ''}</div>
                </div>
                <div style="display:flex;flex-direction:column;gap:5px;">
                  ${bookLink}
                  <button class="det-book-btn alb-toggle-btn" data-key="${key}" style="background:${btnBg};color:${btnColor};border-color:${btnBorder};">${btnLabel}</button>
                </div>
              </div>
              ${bookedBadge}
            </div>`;
      });
      return `<div class="detail-section"><div class="det-title"><svg class="icon" style="margin-right:5px;"><use href="#icon-bed"></svg> Альберге</div>${rows.join('')}</div>`;
    })() : '';

    // Stamps
    const stampsHTML = d.stamps.length ? `
      <div class="detail-section">
        <div class="det-title"><svg class="icon" style="margin-right:5px;"><use href="#icon-scroll"></svg> Де поставити штамп</div>
        ${d.stamps.map((s) => `
          <div class="det-item">
            <div class="det-name">${injectIcons(s.place)}</div>
            <div class="det-info">${injectIcons(s.note)}</div>
          </div>`).join('')}
      </div>` : '';

    // Weather widget placeholder (only for days with coords)
    const weatherHTML = CITY_COORDS[d.date] ? `
      <div id="weather-${i}" class="detail-section">
        <div class="det-title"><svg class="icon" style="margin-right:5px;"><use href="#icon-cloud"></svg> Погода на ${formatDateDisplay(d.date)}</div>
        <div class="weather-widget"><div class="weather-loading"><svg class="icon" style="margin-right:5px;animation:spin 2s linear infinite;"><use href="#icon-globe"></svg> Завантажуємо…</div></div>
      </div>` : '';

    // Secret tip on the last day
    const secretTip = i === lastIdx ? `
      <div class="hidden-tip" id="htip">
        <div class="hidden-tip-title"><svg class="icon" style="margin-right:5px;"><use href="#icon-shush"></svg> Секрет 25.07 — як пробігти OPO</div>
        <p style="font-size:13px;line-height:1.5;">
          • Прийти за 1.5 год (не 2 — Wizz check-in швидкий)<br>
          • Wizz Air check-in T1 — центр терміналу, зліва<br>
          • Security 16:00-18:00 — менше людей<br>
          • Воду купити після security (€2.50) — на гейті дорожче<br>
          • Boarding починається за 35-40 хв до вильоту<br>
          • Штамп аеропорту в credencial — на пам'ять!
        </p>
      </div>` : '';

    const hasWarning = d.type === 'walking-hard' || d.desc.includes('⚠️') || (d.hl && d.hl.includes('⚠️'));
    const warningHTML = hasWarning ? (() => {
      let warningText = 'Складний етап або особливі умови!';
      if (d.desc.includes('⚠️')) {
        const sentences = d.desc.split(/[.!?]/);
        const match = sentences.find(s => s.includes('⚠️'));
        if (match) warningText = match.replace(/⚠️/g, '').trim();
      } else if (d.hl && d.hl.includes('⚠️')) {
        const sentences = d.hl.split(/[.!?]/);
        const match = sentences.find(s => s.includes('⚠️'));
        if (match) warningText = match.replace(/⚠️/g, '').trim();
      }
      return `
        <div class="route-warning-banner">
          <svg class="icon"><use href="#icon-alert"></use></svg>
          <div class="warning-text"><strong>Увага:</strong> ${warningText}</div>
        </div>`;
    })() : '';

    return `
    <div class="day-card${specialClass}" data-i="${i}" role="button" tabindex="0"
         aria-expanded="false" aria-label="${d.date} ${d.title}">
      <div style="display:flex;justify-content:space-between;align-items:baseline;">
        <div>
          <div class="day-date">${formatDateDisplay(d.date)}</div>
          <div class="day-dow">${d.day} · ${injectIcons(d.route)}</div>
        </div>
      </div>
      <div class="day-route">${injectIcons(d.title)}</div>
      <div class="day-meta">${tags}</div>
      <div class="day-desc">${injectIcons(d.desc)}</div>
      ${warningHTML}
      ${d.hl ? `<div class="day-hl"><svg class="icon" style="margin-right:5px;color:var(--gold);"><use href="#icon-sun"></svg> ${injectIcons(d.hl)}</div>` : ''}
      <div class="expand-hint" aria-hidden="true"><svg class="icon"><use href="#icon-down"></svg> натисни для деталей</div>
      <div class="day-details" id="dd-${i}">
        ${placesHTML}
        ${albsHTML}
        ${stampsHTML}
        ${weatherHTML}
        ${secretTip}
      </div>
    </div>`;
  }).join('');

  return `
    <h2 class="section-title">Маршрут</h2>
    <div class="section-subtitle">12 днів · старт 13.07.2026</div>
    ${stageHTML}
    ${buildRouteTools()}
    ${cards}`;
}

export function buildRouteTools() {
  return `
    <div class="route-tools">
      <button class="tool-btn" id="todayRouteBtn" type="button">Сьогодні</button>
      <button class="tool-btn danger" id="sosHubBtn" type="button"><svg class="icon" style="margin-right:4px;"><use href="#icon-sos"></use></svg>SOS / Довідник</button>
    </div>`;
}

async function scrollToTodayCard(isAuto = false) {
  const { ROUTE } = await import('../config/route.js');
  const today = new Date();
  const key = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const found = ROUTE.findIndex((day) => day.date === key);
  
  if (isAuto && found === -1) {
    return;
  }

  const idx = found >= 0 ? found : 0;
  const target = document.querySelector(`.day-card[data-i="${idx}"]`);
  if (target) {
    target.scrollIntoView({ behavior: isAuto ? 'auto' : 'smooth', block: 'center' });
    if (target.getAttribute('aria-expanded') === 'false') {
      const dd = document.getElementById(`dd-${idx}`);
      dd?.classList.add('expanded');
      target.setAttribute('aria-expanded', 'true');
      
      const { CITY_COORDS } = await import('../config/route.js');
      if (CITY_COORDS[ROUTE[idx].date]) {
        loadWeatherForDay(idx, ROUTE[idx].date, CITY_COORDS[ROUTE[idx].date], ROUTE[idx].date);
      }
    }
    target.classList.add('pulse-focus');
    setTimeout(() => target.classList.remove('pulse-focus'), 1800);
  }
}

export function initRouteTools() {
  document.getElementById('todayRouteBtn')?.addEventListener('click', async () => {
    await scrollToTodayCard(false);
  });

  document.getElementById('sosHubBtn')?.addEventListener('click', () => {
    const safetyTab = document.querySelector('.nav-tab[data-s="safety"]');
    if (safetyTab) {
      safetyTab.click();
      setTimeout(() => {
        const emergencyCard = document.querySelector('.safety-emergency');
        emergencyCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  });

  // Auto-scroll on initial mount
  setTimeout(async () => {
    await scrollToTodayCard(true);
  }, 400);
}

export function handleDayCardClick(card) {
  const idx = card.getAttribute('data-i');
  if (!idx) return;
  const dd = document.getElementById(`dd-${idx}`);
  const isOpen = dd?.classList.toggle('expanded') ?? false;
  card.setAttribute('aria-expanded', String(isOpen));
  
  const cardsCount = document.querySelectorAll('.day-card').length;
  if (parseInt(idx) === cardsCount - 1) {
    const htip = document.getElementById('htip');
    if (isOpen) {
      htip?.classList.add('revealed');
      const canvas = document.getElementById('confettiCanvas');
      if (canvas) {
        import('../utils.js').then(m => m.startConfetti(canvas));
      }
    } else {
      htip?.classList.remove('revealed');
    }
  }
}

export async function initWeatherLazy() {
  const { ROUTE, CITY_COORDS } = await import('../config/route.js');
  ROUTE.forEach((d, i) => {
    if (!CITY_COORDS[d.date]) return;
    const coords = CITY_COORDS[d.date];
    const card = document.querySelector(`.day-card[data-i="${i}"]`);
    if (!card) return;

    const load = () => loadWeatherForDay(i, d.date, coords, d.date);
    card.addEventListener('click', load, { once: true });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') load();
    }, { once: true });
  });
}
