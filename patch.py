import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', encoding='utf-8') as f:
    src = f.read()

print('Original lines:', src.count('\n'))

# ---- 1. NAV CSS: wrap nav-tabs ----
if '.nav-wrapper{' not in src:
    old = '.nav-tabs{position:sticky;top:0;display:flex;gap:0;overflow-x:auto;scrollbar-width:none;padding:0 20px;background:var(--paper);z-index:101;border-bottom:1px solid var(--paper-dark);box-shadow:0 4px 12px rgba(0,0,0,0.05);}\n.nav-tabs::-webkit-scrollbar{display:none;}\n.nav-tab{'
    new = '.nav-wrapper{position:sticky;top:0;z-index:101;background:var(--paper);border-bottom:1px solid var(--paper-dark);box-shadow:0 4px 12px rgba(0,0,0,0.05);display:flex;align-items:stretch;}\n.nav-tabs{display:flex;gap:0;overflow-x:auto;scrollbar-width:none;padding:0 4px;flex:1;scroll-behavior:smooth;}\n.nav-tabs::-webkit-scrollbar{display:none;}\n.nav-arrow{background:var(--paper);border:none;color:var(--terracotta);font-size:18px;font-weight:bold;padding:0 8px;cursor:pointer;display:flex;align-items:center;transition:opacity 0.2s;opacity:0;pointer-events:none;flex-shrink:0;}\n.nav-arrow.visible{opacity:1;pointer-events:auto;}\n.nav-arrow.left{box-shadow:4px 0 8px -4px rgba(0,0,0,0.1);z-index:2;}\n.nav-arrow.right{box-shadow:-4px 0 8px -4px rgba(0,0,0,0.1);z-index:2;}\n.nav-tab{'
    if old in src:
        src = src.replace(old, new, 1)
        print('PATCH 1 (nav css): OK')
    else:
        print('PATCH 1 (nav css): NOT FOUND')
else:
    print('PATCH 1 (nav css): already patched')

# ---- 2. HTML: nav-tabs -> nav-wrapper ----
if 'id="navTabs"' not in src:
    old = '    <nav class="nav-tabs">\n      <button class="nav-tab active" data-s="route">Маршрут</button>\n      <button class="nav-tab" data-s="pilgrims">Паломники</button>\n      <button class="nav-tab" data-s="dict">Словник</button>\n      <button class="nav-tab" data-s="food">Що з\'їсти</button>\n      <button class="nav-tab" data-s="exercises">Вправи</button>\n      <button class="nav-tab" data-s="apps">Додатки</button>\n      <button class="nav-tab" data-s="check">Чекліст</button>\n    </nav>'
    new = '    <div class="nav-wrapper">\n      <button class="nav-arrow left" id="navArrowLeft" onclick="document.getElementById(\'navTabs\').scrollBy(-150,0)">&#8592;</button>\n      <nav class="nav-tabs" id="navTabs">\n        <button class="nav-tab active" data-s="route">Маршрут</button>\n        <button class="nav-tab" data-s="pilgrims">Паломники</button>\n        <button class="nav-tab" data-s="dict">Словник</button>\n        <button class="nav-tab" data-s="food">Що з\'їсти</button>\n        <button class="nav-tab" data-s="exercises">Вправи</button>\n        <button class="nav-tab" data-s="apps">Додатки</button>\n        <button class="nav-tab" data-s="check">Чекліст</button>\n      </nav>\n      <button class="nav-arrow right" id="navArrowRight" onclick="document.getElementById(\'navTabs\').scrollBy(150,0)">&#8594;</button>\n    </div>'
    if old in src:
        src = src.replace(old, new, 1)
        print('PATCH 2 (nav html): OK')
    else:
        print('PATCH 2 (nav html): NOT FOUND')
else:
    print('PATCH 2 (nav html): already patched')

# ---- 3. initNavArrows function ----
if 'initNavArrows' not in src:
    old = "    window.scrollTo({top:document.querySelector('.nav-tabs').offsetTop-55,behavior:'smooth'});\n  }));\n  initDayCards(); initPilgrimCards(); initDictTabs(); initFoodRand(); initExTabs(); initCheck();\n  setTimeout(initWeather, 300);\n}"
    new = "    window.scrollTo({top:document.querySelector('.nav-wrapper').offsetTop-55,behavior:'smooth'});\n  }));\n  initDayCards(); initPilgrimCards(); initDictTabs(); initFoodRand(); initExTabs(); initCheck(); initNavArrows();\n  setTimeout(initWeather, 300);\n}\n\nfunction initNavArrows() {\n  const tabs = document.getElementById('navTabs');\n  const left = document.getElementById('navArrowLeft');\n  const right = document.getElementById('navArrowRight');\n  if(!tabs || !left || !right) return;\n  function update() {\n    if(tabs.scrollLeft > 5) left.classList.add('visible'); else left.classList.remove('visible');\n    if(tabs.scrollWidth - tabs.clientWidth - tabs.scrollLeft > 5) right.classList.add('visible'); else right.classList.remove('visible');\n  }\n  tabs.addEventListener('scroll', update, {passive: true});\n  window.addEventListener('resize', update);\n  setTimeout(update, 100);\n}"
    if old in src:
        src = src.replace(old, new, 1)
        print('PATCH 3 (initNavArrows): OK')
    else:
        print('PATCH 3 (initNavArrows): NOT FOUND')
else:
    print('PATCH 3 (initNavArrows): already patched')

# ---- 4a. CITY_COORDS: add 11.07, 12.07 ----
if "'11.07'" not in src:
    old = "const CITY_COORDS={\n  '13.07':{lat:41.35,lon:-8.75,name:'Vila do Conde'},"
    new = "const CITY_COORDS={\n  '11.07':{lat:41.15,lon:-8.61,name:'Порту'},\n  '12.07':{lat:41.15,lon:-8.61,name:'Порту'},\n  '13.07':{lat:41.35,lon:-8.75,name:'Vila do Conde'},"
    if old in src:
        src = src.replace(old, new, 1)
        print('PATCH 4a (coords 11,12): OK')
    else:
        print('PATCH 4a (coords 11,12): NOT FOUND')
else:
    print('PATCH 4a: already patched')

# ---- 4b. CITY_COORDS: add 25.07 ----
if "'25.07'" not in src:
    old = "  '24.07':{lat:42.88,lon:-8.54,name:'Santiago + Fisterra'},\n};"
    new = "  '24.07':{lat:42.88,lon:-8.54,name:'Santiago + Fisterra'},\n  '25.07':{lat:42.88,lon:-8.54,name:'Santiago'},\n};"
    if old in src:
        src = src.replace(old, new, 1)
        print('PATCH 4b (coords 25): OK')
    else:
        print('PATCH 4b (coords 25): NOT FOUND')
else:
    print('PATCH 4b: already patched')

# ---- 5. Weather function: unavailable + Google link ----
if 'extLink' not in src:
    marker = 'async function loadWeatherForDay(dayIdx,dateStr,coordKey){'
    end_marker = '\nfunction initWeather(){'
    if marker in src and end_marker in src:
        start = src.index(marker)
        end = src.index(end_marker, start)
        new_fn = '''async function loadWeatherForDay(dayIdx,dateStr,coordKey){
  const coords=CITY_COORDS[coordKey];
  if(!coords)return;
  const container=document.getElementById(`weather-${dayIdx}`);
  if(!container)return;
  const isoDate=`2026-${coordKey.split('.').reverse().join('-')}`;
  const targetDate=new Date(isoDate);
  const diffDays=(targetDate-new Date())/86400000;
  const extLink=`https://www.google.com/search?q=погода+${encodeURIComponent(coords.name)}+${dateStr}`;
  const wdg=container.querySelector('.weather-widget');
  if(diffDays>14){
    if(wdg)wdg.innerHTML=`<a href="${extLink}" target="_blank" style="text-decoration:none;color:inherit;display:block;">
      <div class="weather-title">🏹 ${coords.name}</div>
      <div style="font-size:13px;opacity:0.8;font-style:italic;text-align:center;padding:10px 0;">Погода недоступна, з\'явиться ближче до дати.<br><span style="text-decoration:underline;color:var(--gold);margin-top:5px;display:inline-block;">Переглянути прогноз в Google ↗</span></div>
    </a>`;
    return;
  }
  const url=`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Europe%2FLisbon&start_date=${isoDate}&end_date=${isoDate}`;
  try{
    const r=await fetch(url);
    const data=await r.json();
    const wc=data.daily.weathercode[0];
    const tmax=Math.round(data.daily.temperature_2m_max[0]);
    const tmin=Math.round(data.daily.temperature_2m_min[0]);
    const icon=WMO_ICON[wc]||'🌤️';
    const desc=WMO_DESC[wc]||'';
    if(wdg)wdg.innerHTML=`<a href="${extLink}" target="_blank" style="text-decoration:none;color:inherit;display:block;">
      <div class="weather-title">🏹 ${coords.name}</div>
      <div class="weather-grid">
        <div class="weather-cell"><span class="weather-icon">${icon}</span><div class="weather-temp">${tmax}°</div><div class="weather-desc">${desc}</div></div>
        <div class="weather-cell"><span class="weather-icon">🌕</span><div class="weather-temp">${tmax}°</div><div class="weather-desc">День</div></div>
        <div class="weather-cell"><span class="weather-icon">🌑</span><div class="weather-temp">${tmin}°</div><div class="weather-desc">Ніч</div></div>
      </div>
    </a>`;
  }catch(e){
    if(wdg)wdg.innerHTML=`<a href="${extLink}" target="_blank" style="text-decoration:none;color:inherit;display:block;">
      <div class="weather-title">🏹 ${coords.name}</div>
      <div style="font-size:13px;opacity:0.8;text-align:center;padding:10px 0;">Помилка завантаження.<br><span style="text-decoration:underline;color:var(--gold);">Переглянути в Google ↗</span></div>
    </a>`;
  }
}
'''
        src = src[:start] + new_fn + src[end:]
        print('PATCH 5 (weather fn): OK')
    else:
        print('PATCH 5 (weather fn): NOT FOUND')
else:
    print('PATCH 5 (weather fn): already patched')

# ---- 6. initWeather: remove d.km check ----
old6 = "  ROUTE.forEach((d,i)=>{\n    if(!d.km)return;\n    const key=d.date;"
new6 = "  ROUTE.forEach((d,i)=>{\n    const key=d.date;"
if old6 in src:
    src = src.replace(old6, new6, 1)
    print('PATCH 6 (initWeather no km): OK')
else:
    print('PATCH 6: SKIP')

# ---- 7. Weather card condition ----
old7 = "${d.date&&d.km?`<div id=\"weather-${i}\""
new7 = "${d.date&&CITY_COORDS[d.date]?`<div id=\"weather-${i}\""
if old7 in src:
    src = src.replace(old7, new7, 1)
    print('PATCH 7 (weather card): OK')
else:
    print('PATCH 7: SKIP')

# ---- 8. buildStageProgress: fix start date + Math.floor ----
old8 = "  const start=new Date('2026-07-13');\n  const end=new Date('2026-07-24');\n  if(now<start||now>end){\n    const diff=start-now;\n    const days=Math.ceil(diff/86400000);"
new8 = "  const start=new Date('2026-07-11T16:25:00');\n  const end=new Date('2026-07-24');\n  if(now<start||now>end){\n    const diff=start-now;\n    const days=Math.floor(diff/86400000);"
if old8 in src:
    src = src.replace(old8, new8, 1)
    print('PATCH 8 (stage progress): OK')
else:
    print('PATCH 8: SKIP')

# ---- 9. Fix shake detection ----
old9 = "  let shakeN=0,lastT=0,lx=0,ly=0,lz=0;\n  if(window.DeviceMotionEvent){\n    window.addEventListener('devicemotion',e=>{\n      const a=e.accelerationIncludingGravity;if(!a)return;\n      const now=Date.now();\n      if(now-lastT>100){\n        const sp=Math.abs(a.x+a.y+a.z-lx-ly-lz)/(now-lastT)*10000;\n        if(sp>800){shakeN++;if(shakeN>=3&&now-lastT>2000){shakeN=0;triggerKonami();}}\n        lx=a.x;ly=a.y;lz=a.z;lastT=now;\n      }\n    });\n  }"
new9 = "  let shakeN=0,lastT=0,lastShakeTime=0,lx=0,ly=0,lz=0;\n  if(window.DeviceMotionEvent){\n    if(typeof DeviceMotionEvent.requestPermission === 'function'){\n      document.body.addEventListener('click',()=>{DeviceMotionEvent.requestPermission().catch(()=>{});},{once:true,passive:true});\n    }\n    window.addEventListener('devicemotion',e=>{\n      const a=e.accelerationIncludingGravity;if(!a)return;\n      const now=Date.now();\n      if(now-lastT>50){\n        const diff=Math.abs(a.x+a.y+a.z-lx-ly-lz);\n        if(diff>12){\n          if(now-lastShakeTime>2000)shakeN=0;\n          shakeN++;lastShakeTime=now;\n          if(shakeN>=3){shakeN=0;triggerKonami();}\n        }\n        lx=a.x;ly=a.y;lz=a.z;lastT=now;\n      }\n    });\n  }"
if old9 in src:
    src = src.replace(old9, new9, 1)
    print('PATCH 9 (shake): OK')
else:
    print('PATCH 9 (shake): SKIP')

with open('index.html', 'w', encoding='utf-8', newline='\n') as f:
    f.write(src)
print('DONE. Lines:', src.count('\n'))
