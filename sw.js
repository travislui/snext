// GaiChin PWA Service Worker
// Version: 1.5.1   <-- Change this number every time you deploy a new version!

const CACHE_NAME = 'gaichin-cache 31-12-2025-總儲蓄';  // Change this when you want to force cache refresh

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/GaiChin Icon.png',
  '/GaiChin Icon-512.png',
  // Add more static assets if you have them (e.g., custom fonts, images)
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())  // Optional: take control immediately on install
  );
});

self.addEventListener('activate', event => {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // Optional: show offline fallback page
        // return caches.match('/offline.html');
      })
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});