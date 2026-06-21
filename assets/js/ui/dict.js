import { injectIcons } from '../utils.js';

export let dictLang = 'es'; // Global state inside module

export function buildDict() {
  return `
    <h2 class="section-title">Словник</h2>
    <div class="section-subtitle">фрази які знадобляться</div>
    <div class="dict-tabs" role="tablist">
      <button class="dict-tab active" data-l="ua2pt" role="tab" aria-selected="true">${langPair('ua', 'pt')} <span class="nav-label">Португальська</span></button>
      <button class="dict-tab"        data-l="ua2es" role="tab" aria-selected="false">${langPair('ua', 'es')} <span class="nav-label">Іспанська</span></button>
    </div>
    <div id="dict-content"></div>`;
}

export async function renderDict() {
  const isPT = dictLang === 'ua2pt';

  const content = document.getElementById('dict-content');
  if (content) content.innerHTML = '<div style="padding:20px;text-align:center;">Завантаження...</div>';

  let DICTIONARY;
  try {
    const mod = await import('../config/dict.js');
    DICTIONARY = mod.DICTIONARY;
  } catch (err) {
    if (content) content.innerHTML = '<div class="error">Помилка завантаження словника</div>';
    return;
  }

  const html = Object.values(DICTIONARY).map((cat) => {
    const phrases = cat.phrases.map((ph) => {
      const target = isPT ? ph.pt : ph.es;
      if (!target) return '';

      const pronParts = ph.pro?.split(' / ') ?? [];
      const pronun = isPT ? pronParts[0] : (pronParts[1] ?? pronParts[0] ?? '');


      return `
        <div class="dict-phrase">
          <div class="dict-original">${ph.ua}</div>
          <div class="dict-translation" style="color:var(--terracotta);font-weight:600;">${target}</div>
          ${pronun ? `<div class="dict-pronun"><svg class="icon" style="margin-right:5px;"><use href="#icon-volume"></svg> ${pronun}</div>` : ''}
          ${ph.tr ? `<div style="font-size:12px;color:var(--ink-soft);font-style:italic;margin-top:3px;"><svg class="icon" style="width:14px;height:14px;margin-right:3px;"><use href="#icon-scroll"></svg><em>${injectIcons(ph.tr)}</em></div>` : ''}
        </div>`;
    }).join('');

    return `<div class="dict-category"><div class="dict-cat-title">${cat.title}</div>${phrases}</div>`;
  }).join('');

  if (content) content.innerHTML = html;
}

export function handleDictTab(tab) {
  document.querySelectorAll('.dict-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
  tab.classList.add('active');
  tab.setAttribute('aria-selected', 'true');
  dictLang = tab.getAttribute('data-l');
  renderDict();
}
