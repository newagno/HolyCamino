importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

if (typeof workbox !== 'undefined') {
  console.log('Workbox is loaded');

  // Precache all assets detected by workbox-build
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

  // Use a Network-First strategy for general GET requests to allow offline fallback
  workbox.routing.registerRoute(
    ({ request }) => request.method === 'GET',
    new workbox.strategies.NetworkFirst()
  );

  // Standard PWA update channel
  self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });

  // Clean up legacy caches left by non-Workbox service workers
  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName.startsWith('camino-v2-static-'))
            .map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  });
} else {
  console.log('Workbox failed to load');
}
