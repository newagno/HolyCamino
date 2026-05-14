const CACHE_NAME = 'camino-v2-static-v7';
const STATIC_ASSETS = [
  './',
  './index.html',
  './assets/css/main.css',
  './assets/js/config.js',
  './assets/js/easterEggs.js',
  './assets/js/main.js',
  './assets/js/storage.js',
  './assets/js/ui.js',
  './assets/js/utils.js',
  './assets/files/logo.png',
  './assets/files/peixe.jpg',
  './assets/files/sound_ocean.mp3',
  './assets/files/sound_storme.mp3',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request)
      .then((cached) => cached || fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match('./index.html'))),
  );
});
