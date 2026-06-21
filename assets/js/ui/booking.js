// No static import for ROUTE
import { getBookingState, toggleBookingItem } from '../storage.js';
import { formatDateDisplay } from '../utils.js';

export async function buildBooking() {
  const { ROUTE } = await import('../config/route.js');
  const dynState = getBookingState();
  const booked = ROUTE.flatMap((day, dayIdx) => day.albs
    .map((alb, albIdx) => ({ day, alb, dayIdx, albIdx }))
    .filter(({ alb, dayIdx, albIdx }) => 
      alb.c?.includes('ЗАБРОНЬОВАНО') || dynState[`${dayIdx}-${albIdx}`]
    ));

  return `
    <h2 class="section-title">Бронювання</h2>
    <div class="section-subtitle">Всі ваші зупинки в одному місці</div>
    <div class="booking-list">
      ${booked.map(({ day, alb }) => {
    const cleanComment = (alb.c ?? '').replace('(ЗАБРОНЬОВАНО)', '').replace('ЗАБРОНЬОВАНО', '').trim();
    return `
        <div class="booking-item">
          <div class="booking-date">${formatDateDisplay(day.date)} · ${day.day}</div>
          <div class="booking-main">
            <div class="booking-name">${alb.n}</div>
            <div class="booking-price">${alb.p}</div>
          </div>
          ${cleanComment ? `<div class="booking-comment">${cleanComment}</div>` : ''}
          <div class="booking-actions">
            <a href="${alb.m}" target="_blank" class="tool-btn mini">Мапа</a>
            ${alb.b ? `<a href="${alb.b}" target="_blank" class="tool-btn mini accent">Бронювання</a>` : ''}
          </div>
        </div>
      `}).join('')}
    </div>
  `;
}

export async function handleBookingToggle(btn) {
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
  if (bookingSec) bookingSec.innerHTML = await buildBooking();
}
