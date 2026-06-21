import os
import re

base_dir = r"c:\D\Learn\1PROJECTS\Camino\CaminoV2"

# 1. Update sw.js
sw_path = os.path.join(base_dir, "sw.js")
with open(sw_path, "r", encoding="utf-8") as f:
    sw_content = f.read()

urls_to_cache = """const urlsToCache = [
  './',
  './index.html',
  './assets/css/main.css',
  './assets/js/main.js',
  './assets/js/config.js',
  './assets/js/storage.js',
  './assets/js/utils.js',
  './assets/js/easterEggs.js',
  './assets/js/ui/index.js',
  './assets/js/ui/core.js',
  './assets/js/ui/route.js',
  './assets/js/ui/booking.js',
  './assets/js/ui/history.js',
  './assets/js/ui/dict.js',
  './assets/js/ui/food.js',
  './assets/js/ui/exercises.js',
  './assets/js/ui/apps.js',
  './assets/js/ui/safety.js',
  './assets/js/ui/playlist.js',
  './assets/js/ui/gear.js',
  './assets/files/camino.svg',
  './assets/files/logo.png',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});"""

sw_content = re.sub(r"self\.addEventListener\('install', \(\) => self\.skipWaiting\(\)\);", urls_to_cache, sw_content)
with open(sw_path, "w", encoding="utf-8") as f:
    f.write(sw_content)

# Update ui/index.js to remove setTimeout prefetch
index_js_path = os.path.join(base_dir, "assets", "js", "ui", "index.js")
with open(index_js_path, "r", encoding="utf-8") as f:
    idx_content = f.read()

idx_content = re.sub(r"// Eager Prefetch:[\s\S]*?}, 1000\);", "", idx_content)
with open(index_js_path, "w", encoding="utf-8") as f:
    f.write(idx_content)


# 2. Update index.html to remove unused SVG symbols
html_path = os.path.join(base_dir, "index.html")
with open(html_path, "r", encoding="utf-8") as f:
    html_content = f.read()

html_content = re.sub(r'\s*<symbol id="icon-(mountain|roman|muscle|sleep|happy|flag-ua|flag-pt|flag-es)"[\s\S]*?</symbol>', '', html_content)
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)


# 3. Remove "the-way-mode" from CSS and JS
# easterEggs.js
eggs_path = os.path.join(base_dir, "assets", "js", "easterEggs.js")
with open(eggs_path, "r", encoding="utf-8") as f:
    eggs_content = f.read()

eggs_content = re.sub(r"// ─── THE WAY MODE ───[\s\S]*?(?=// ───|$)", "", eggs_content)
with open(eggs_path, "w", encoding="utf-8") as f:
    f.write(eggs_content)

# main.js
main_path = os.path.join(base_dir, "assets", "js", "main.js")
with open(main_path, "r", encoding="utf-8") as f:
    main_content = f.read()

# remove imports
main_content = re.sub(r"\bactivateTheWayMode\b,?\s*", "", main_content)
main_content = re.sub(r"\bisTheWayActive\b,?\s*", "", main_content)
main_content = re.sub(r"\binitTheWayAudio\b,?\s*", "", main_content)

# remove init
main_content = re.sub(r"initTheWayAudio\(\);", "", main_content)

# remove check
main_content = re.sub(r"if \(val\.replace\(/\\s/g, ''\)\.includes\('сантьяго'\)\) \{\s*activateTheWayMode\(\);\s*\}", "", main_content)
main_content = re.sub(r" \|\| val\.replace\(/\\s/g, ''\)\.includes\('сантьяго'\)", "", main_content)

with open(main_path, "w", encoding="utf-8") as f:
    f.write(main_content)

# main.css
css_path = os.path.join(base_dir, "assets", "css", "main.css")
with open(css_path, "r", encoding="utf-8") as f:
    css_content = f.read()

css_content = re.sub(r"/\*[\s\S]*?THE WAY MODE[\s\S]*?\*/[\s\S]*?\.the-way-mode[\s\S]*?(?=\n\n\n|\Z)", "", css_content)
css_content = re.sub(r"body\.the-way-mode[\s\S]*?\}", "", css_content)

with open(css_path, "w", encoding="utf-8") as f:
    f.write(css_content)

print("Optimizations completed.")
