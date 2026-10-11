// =============================================================================
// College OS Progressive Web App Service Worker
// Enables Standalone Native App Mode, Fullscreen & Offline Cache
// =============================================================================

const CACHE_NAME = 'college-os-pwa-v1';
const PRECACHE_URLS = [
  '/',
  '/home',
  '/timetable',
  '/tasks',
  '/vault',
  '/profile',
  '/attendance',
  '/manifest.json',
  '/icon.svg',
  '/pwa_manager.js',
  '/shared_firebase_cloud.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[PWA SW] Pre-caching app shell assets');
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('[PWA SW] Pre-cache partial note:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[PWA SW] Removing old cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-first caching strategy with fallback
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip non-GET and chrome-extension / firestore streaming / cloudinary upload requests
  if (req.method !== 'GET') return;
  if (url.origin.includes('firestore.googleapis.com') || url.origin.includes('identitytoolkit')) return;
  if (url.pathname.startsWith('/api/')) return;

  event.respondWith(
    fetch(req)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(req).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (req.headers.get('accept') && req.headers.get('accept').includes('text/html')) {
            return caches.match('/home');
          }
        });
      })
  );
});
