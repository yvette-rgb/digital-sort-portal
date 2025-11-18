// Service Worker name and version
const CACHE_NAME = 'neatfreeks-digital-sort-v1';
const urlsToCache = [
  './digital-sort-portal.html',
  './manifest.json',
  'https://cdn.tailwindcss.com', // Caches the CSS framework
  // Caches all external images for offline use
  'https://res.cloudinary.com/dyemjxidz/image/upload/v1756495275/Official_Logos_33_q2ajhh.png',
  'https://res.cloudinary.com/dyemjxidz/image/upload/v1763437316/We_Freak_Neat._szxmmf.png'
];

// Installation: Caches all essential assets for offline viewing
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // IMPORTANT: We use skipWaiting to ensure the PWA updates immediately
        self.skipWaiting();
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch: Tries network first, falls back to cache for assets
self.addEventListener('fetch', event => {
  // We only cache GET requests for assets, not POST requests for data submission
  if (event.request.method === 'GET') {
    event.respondWith(
      fetch(event.request).catch(function() {
        return caches.match(event.request);
      })
    );
  }
});

// Activation: Cleans up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});