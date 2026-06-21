import { APPS } from '../config.js';

export function buildApps() {
  const cards = APPS.map((a) => `
    <div class="app-card">
      <div class="app-icon" aria-hidden="true">
        ${a.img ? `<img src="${a.img}" alt="${a.n}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">` : `<svg class="icon" style="width:32px;height:32px;"><use href="#icon-${a.i === 'shell' ? 'shell-shape' : a.i}"></svg>`}
      </div>
      <div class="app-info">
        <div class="app-name">${a.n}</div>
        <div class="app-desc">${a.d}</div>
      </div>
      <div class="app-links">
        ${a.ios ? `<a class="app-link" href="${a.ios}" target="_blank" rel="noopener noreferrer">iOS</a>` : ''}
        ${a.and ? `<a class="app-link" href="${a.and}" target="_blank" rel="noopener noreferrer">Android</a>` : ''}
        ${a.web ? `<a class="app-link" href="${a.web}" target="_blank" rel="noopener noreferrer">Web</a>` : ''}
      </div>
    </div>`).join('');

  return `
    <h2 class="section-title">Додатки</h2>
    <div class="section-subtitle">встановити до вильоту</div>
    ${cards}`;
}
