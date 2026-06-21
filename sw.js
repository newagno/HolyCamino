const CACHE_NAME = 'camino-v2-static-v34';

const urlsToCache = [
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
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

// Network-first: always try network, fall back to cache
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Мережа доступна, оновлюємо кеш
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => {
        // Мережа недоступна, примусово повертаємо з кешу
        return caches.match(event.request);
      })
  );
});
