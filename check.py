import sys; sys.stdout.reconfigure(encoding='utf-8')
with open('index.html', encoding='utf-8') as f:
    src = f.read()

checks = [
    ('nav-wrapper CSS', '.nav-wrapper{position:sticky' in src),
    ('nav-wrapper HTML', 'id=navTabs' in src.replace('"','')),
    ('initNavArrows fn', 'function initNavArrows' in src),
    ('CITY_COORDS 11.07', "'11.07':" in src),
    ('CITY_COORDS 25.07', "'25.07':" in src),
    ('extLink weather', 'extLink' in src),
    ('weather diffDays>14', 'diffDays>14' in src),
    ('shake diff>12', 'diff>12' in src),
    ('shake requestPermission', 'requestPermission' in src),
    ('stage 2026-07-11T16:25', '2026-07-11T16:25:00' in src),
    ('Math.floor days', 'Math.floor(diff/86400000)' in src),
    ('CITY_COORDS weather card', 'CITY_COORDS[d.date]' in src),
    ('initWeather no km check', 'ROUTE.forEach((d,i)=>{\n    const key=d.date;' in src),
]
for name, ok in checks:
    print(('OK  ' if ok else 'MISS'), name)
