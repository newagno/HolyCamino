importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

if (typeof workbox !== 'undefined') {
  console.log('Workbox is loaded');

  // Precache all assets detected by workbox-build
  workbox.precaching.precacheAndRoute([{"revision":"914f03e3ae32177af59baee744b0e907","url":"index.html"},{"revision":"1adfe92a1b17e7628630320dc582758a","url":"manifest.json"},{"revision":"5469502e0f89890f06558b539e3af247","url":"assets/css/main.css"},{"revision":"d1c24cd6da35872af5aaee4f85cb5f05","url":"assets/js/utils.js"},{"revision":"815ada1730f798a104f51c34cbda3c2a","url":"assets/js/storage.js"},{"revision":"96f2ceed99be2e9fb30e27fadf5c3cb5","url":"assets/js/main.js"},{"revision":"d9def20f8b447c687d22742104e6dcb0","url":"assets/js/easterEggs.js"},{"revision":"6008d29e6ef1ef9f5439981aca7fcdca","url":"assets/js/config.js"},{"revision":"84770141e991904508a1a5cd40b818fd","url":"assets/js/ui/safety.js"},{"revision":"f98f067ec1657e1abdf4536e9627887c","url":"assets/js/ui/route.js"},{"revision":"caf58a4817daf6e564e38f246cdfc2ee","url":"assets/js/ui/playlist.js"},{"revision":"3aef0ad3cb517e1717ba4c4f148849b3","url":"assets/js/ui/index.js"},{"revision":"fc6542c1129529f56e55139459628d31","url":"assets/js/ui/history.js"},{"revision":"5fdedc95caa1ac6dce9a8a20143c9531","url":"assets/js/ui/gear.js"},{"revision":"65cf246a4c5830857d4be2e641352b3c","url":"assets/js/ui/food.js"},{"revision":"eaf1f7598114d490bb188e6af6d61e3c","url":"assets/js/ui/exercises.js"},{"revision":"54f0d2e2cfe56ecdb0bc66ccc5f254a7","url":"assets/js/ui/dict.js"},{"revision":"7563fb7c64639e74e416f746c1310603","url":"assets/js/ui/core.js"},{"revision":"f9c1d668db6565216296a19602aec36c","url":"assets/js/ui/booking.js"},{"revision":"d9af245a1f8b05fc81a4037dc238ef66","url":"assets/js/ui/apps.js"},{"revision":"42a038e79233141184fee68a42082c35","url":"assets/js/config/route.js"},{"revision":"90d19d4ce1a3755f75a5dc77d2e7e6a1","url":"assets/js/config/gear.js"},{"revision":"069c807d82fb3046ae7c5dc87ede055e","url":"assets/js/config/food.js"},{"revision":"b6c71a4f7a735a33acae6d16604338a9","url":"assets/js/config/dict.js"},{"revision":"c0299375651b7a11f74837621b70864b","url":"assets/files/WisePilgrimApp.jpg"},{"revision":"dcd03d2d567a80184f00f17833e3f2ed","url":"assets/files/peixe.jpg"},{"revision":"cc68908e7d2e47d781f3031b82d23ca9","url":"assets/files/MapsMeApp.jpg"},{"revision":"6e33f44259ecf5287a2fdb7297cff21c","url":"assets/files/logo.png"},{"revision":"bffabe98febb07dca97740771f57f0e9","url":"assets/files/logo-512.png"},{"revision":"d35cfc9e6ea92097f44caf89bba1715c","url":"assets/files/logo-192.png"},{"revision":"c0802536de08fae665d51419b8be8b44","url":"assets/files/logo-180.png"},{"revision":"7f1b541be91615e6879e8c014fb6ea28","url":"assets/files/KomootApp.jpg"},{"revision":"030a574085185999cb5d2bcaf1c9af2b","url":"assets/files/GoogleTranslateApp.jpg"},{"revision":"1248ef3d6ba04fa216c792c18d49bfb7","url":"assets/files/GeocachingApp.jpg"},{"revision":"d66f478bbcd5ddda63ea78f8216b678c","url":"assets/files/CaminoNinjaApp.jpg"},{"revision":"72792e2e4fe14e89c067ed48dee7e1e2","url":"assets/files/camino.svg"},{"revision":"ec30c3df20381add425d0f9a756f0d29","url":"assets/files/BuenCaminoApp.jpg"},{"revision":"5eadb813a9a1f1b47cc8d963e6040fe6","url":"assets/files/AlsaApp.jpg"},{"revision":"38271aa03b9914d7044ce211f04eeca0","url":"assets/files/AlertCopsApp.jpg"}] || []);

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
