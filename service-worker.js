/**
 * ============================================================================
 * 🏴‍☠️⚓ THE PIRATES AND TRADERS RPG GAME BY SUBIN KHULLAR 😎
 * Progressive Web App Offline Service Worker (service-worker.js)
 * 
 * Copyright ©️ 2026 Subin Khullar. All rights reserved.
 * ============================================================================
 */

const CACHE_NAME = 'pirates-traders-subin-khullar-v1.0.0';

const PRECACHE_ASSETS = [
  './',
  'index.html',
  'styles.css',
  'app.js',
  'manifest.json'
];

// Install Event: Pre-cache core shell resources for 100% offline gameplay
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
      .catch((error) => {
        console.warn('[Service Worker] Pre-cache failed:', error);
      })
  );
});

// Activate Event: Purge outdated caches and take immediate control of clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch Event: Cache-First strategy with network fallback for offline resilience
self.addEventListener('fetch', (event) => {
  // Only handle HTTP/HTTPS GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached asset immediately
          return cachedResponse;
        }

        // If not in cache, fetch from network and dynamically cache
        return fetch(event.request)
          .then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          })
          .catch(() => {
            // Offline fallback for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('index.html');
            }
          });
      })
  );
});

// Message Event: Allow skip waiting trigger from UI
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
