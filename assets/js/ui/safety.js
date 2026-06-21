import { SAFETY, USEFUL_PHRASES } from '../config.js';
import { injectIcons } from '../utils.js';

export function buildSafety() {
  return `
    <h2 class="section-title">Безпека</h2>
    <div class="section-subtitle">правила і корисне</div>

    <div class="safety-emergency">
      <div class="safety-emergency-title"><svg class="icon" style="margin-right:5px;color:var(--paper);"><use href="#icon-sos"></svg> Екстрені номери</div>
      <div class="safety-num" style="margin-bottom:12px;">
        <div class="safety-num-item"><span class="safety-num-val">112</span><div class="safety-num-desc">Єдиний ЄС (без SIM!)</div></div>
        <div class="safety-num-item"><span class="safety-num-val">113</span><div class="safety-num-desc">INEM Португалія</div></div>
        <div class="safety-num-item"><span class="safety-num-val">091</span><div class="safety-num-desc">Polizia Nacional ES</div></div>
        <div class="safety-num-item"><span class="safety-num-val">062</span><div class="safety-num-desc">Guardia Civil ES</div></div>
      </div>
      <a href="tel:112" class="emergency-call-btn" id="emergencyCallBtn" onclick="return confirm('Ви впевнені, що хочете здійснити екстрений виклик 112?');">
        <svg class="icon" style="font-size:16px; color:var(--terracotta);"><use href="#icon-phone"></use></svg>
        <span>Викликати службу порятунку 112</span>
      </a>
    </div>

    <div class="safety-card warning">
      <div class="safety-title"><svg class="icon" style="margin-right:5px;"><use href="#icon-wave"></svg> Безпека на пляжі</div>
      <div class="safety-body">
        <p>Атлантика небезпечна — не плутай з Середземним морем!</p>
        <ul>
          <li><strong><span style="color:#2ecc71;">⬤</span> Зелений прапор</strong> — можна купатися</li>
          <li><strong><span style="color:#f1c40f;">⬤</span> Жовтий прапор</strong> — тільки по коліна, хвилі</li>
          <li><strong><span style="color:#e74c3c;">⬤</span> Червоний прапор</strong> — суворо заборонено</li>
          <li><strong>Rip current (відбійна течія):</strong> не пливи проти — пливи ПАРАЛЕЛЬНО берегу, потім по діагоналі назад</li>
          <li>Температура води: 17-18°C — холодна. Судоми можливі</li>
          <li>Остерігайся <strong>peixe-aranha</strong> (lesser weever) — отруйна риба в піску
            <div class="peixe-thumb" onclick="window.openPeixeLb && window.openPeixeLb()" role="button" tabindex="0" aria-label="Показати фото peixe-aranha">
              <img src="assets/files/peixe.jpg" alt="Peixe-aranha" loading="lazy">
              <div class="peixe-hint"><svg class="icon" style="font-size:12px;margin-right:3px;"><use href="#icon-eye"></svg> Натисни — побачиш більше</div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="safety-card tip">
      <div class="safety-title"><svg class="icon" style="margin-right:5px;"><use href="#icon-foot"></svg> Профілактика пухирів</div>
      <div class="safety-body">
        <ul>
          <li><strong>Compeed + Leukotape P</strong> на проблемні місця до старту — профілактично</li>
          <li>Vaseline / Body Glide на пальці, п'ятки і між пальцями — щоранку</li>
          <li>Двошарові шкарпетки або якісний мерінос (Smartwool, Darn Tough)</li>
          <li>Кросівки на <strong>+0.5 розміру</strong> — ноги набрякають після 10 км</li>
          <li>Якщо пухир: стерильна голка збоку → нитка для дренажу → Compeed зверху</li>
          <li>Щовечора: помити ноги, провітрити, масаж</li>
        </ul>
      </div>
    </div>

    <div class="safety-card info">
      <div class="safety-title"><svg class="icon" style="margin-right:5px;"><use href="#icon-sun"></svg> Спека і сонце</div>
      <div class="safety-body">
        <ul>
          <li><strong>UV індекс 8+ (дуже високий)</strong> — SPF 50+ обов'язково. Ре-аплікація кожні 2 год</li>
          <li>Стартувати о <strong>6:00-6:30</strong>, фінішувати до 13:00-14:00 — уникати пікової спеки</li>
          <li>Норма води: <strong>2-3 літри/день</strong>. Пити до появи спраги, не після</li>
          <li>Електроліти (SaltStick, Hydralyte) — попереджають судоми при сильній спеці</li>
          <li><strong>Ознаки теплового удару:</strong> запаморочення, нудота, темна сеча → знайти тінь, пити, охолодити шию і зап'ястки холодною водою</li>
        </ul>
      </div>
    </div>

    <div class="safety-card tip">
      <div class="safety-title"><svg class="icon" style="margin-right:5px;"><use href="#icon-backpack"></svg> Безпека речей</div>
      <div class="safety-body">
        <ul>
          <li>Документи і готівка — у <strong>money belt</strong> на тілі або в потайній кишені рюкзака</li>
          <li>Розподіли кошти між учасниками — на випадок втрати</li>
          <li>В альберге: замок-карабін на рюкзак або речі у спальнику</li>
          <li>Фото копії документів у хмарі (Google Drive) — на всякий випадок</li>
          <li>Revolut/Wise карта — оптимальний обмінний курс, без комісій за кордоном</li>
        </ul>
      </div>
    </div>

    <div class="safety-card info">
      <div class="safety-title"><svg class="icon" style="margin-right:5px;"><use href="#icon-bandage"></svg> Мінімальна аптечка</div>
      <div class="safety-body">
        <ul>
          <li>Compeed Mixed Pack × 2-3 упаковки</li>
          <li>Leukotape P (краща стрічка для гарячих точок)</li>
          <li>Vaseline 50 мл</li>
          <li>Ibuprofen 400 мг × 20 таб (біль, запалення)</li>
          <li>Paracetamol (температура, головний біль)</li>
          <li>Voltaren Gel 50 г (м'язи і суглоби)</li>
          <li>Імодіум (діарея — від незвичної їжі)</li>
          <li>Антигістамін Цетрин × 10 (алергія, комахи)</li>
          <li>Стерильна голка + нитка + йод (пухирі)</li>
        </ul>
      </div>
    </div>

    <div class="safety-card warning">
      <div class="safety-title"><svg class="icon" style="margin-right:5px;"><use href="#icon-dog"></svg> Собаки і тварини</div>
      <div class="safety-body">
        <ul>
          <li>На сільських ділянках маршруту можуть зустрічатися фермерські собаки</li>
          <li>Не біжи, не дивись в очі — стій спокійно або відходь повільно</li>
          <li>Трекінгові палиці можна підняти для захисту</li>
          <li>В Галісії бувають корови прямо на маршруті — обходь спокійно</li>
        </ul>
      </div>
    </div>

    <div class="safety-card tip">
      <div class="safety-title"><svg class="icon" style="margin-right:5px;"><use href="#icon-phone"></use></svg> Зв'язок і навігація</div>
      <div class="safety-body">
        <ul>
          <li><strong>What3Words</strong> — найточніша локація для екстрених служб</li>
          <li><strong>AlertCops</strong> — прямий зв'язок з іспанською поліцією</li>
          <li>WiFi є в більшості альберге (повільний у пік-години)</li>
          <li>eSIM Airalo або Holafly — PT+ES в одній SIM без переключення</li>
          <li>Завантаж офлайн карти Google Maps заздалегідь!</li>
        </ul>
      </div>
    </div>`;
}
