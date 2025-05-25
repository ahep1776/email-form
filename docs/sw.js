const CACHE_NAME = 'email-form-cache-v1';
const urlsToCache = [
  '/email-form/index.html',
  '/email-form/style.css',
  '/email-form/script.js',
  '/email-form/ahep-logo.svg',
  '/email-form/form-192.png',
  '/email-form/form-512.png',
  '/email-form/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return fetch(event.request).then(response => {
        // If the request is successful, update the cache
        if (response && response.status === 200) {
          cache.put(event.request, response.clone());
        }
        return response;
      }).catch(() => {
        // If the network request fails, try to serve from cache
        return cache.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If not in cache either, and it's a navigation request for index.html,
          // return the cached index.html as a fallback.
          // This ensures the main page loads even if other specific assets weren't explicitly cached
          // or if the exact request path doesn't match a cached entry but the app shell is needed.
          if (event.request.mode === 'navigate' && event.request.url.endsWith('/')) {
            return cache.match('/email-form/index.html');
          }
          // For other types of requests or if index.html is not found,
          // it will result in a standard browser error page for offline.
        });
      });
    })
  );
});

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
