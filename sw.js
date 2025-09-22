// Service Worker for PWA Caching

const CACHE_NAME = 'quality-check-photos-cache-v1';

// A list of all the essential files the app needs to run offline.
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/constants.ts',
  '/services/geminiService.ts',
  '/components/ProjectSelector.tsx',
  '/components/CameraView.tsx',
  '/components/ReviewAndUpload.tsx',
  '/components/Spinner.tsx',
  '/components/IconComponents.tsx',
  '/components/BarcodeScanner.tsx',
  '/logo.svg', // The app icon
  'https://cdn.tailwindcss.com'
];

// Install event: triggered when the service worker is first installed.
self.addEventListener('install', event => {
  // waitUntil() ensures the service worker doesn't install until the code inside has successfully completed.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Add all the specified URLs to the cache.
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: triggered for every network request made by the page.
self.addEventListener('fetch', event => {
  // We only cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  // We respond to the request by trying to find a matching response in our cache.
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If a match is found in the cache, return it.
        if (response) {
          return response;
        }
        // If no match is found, fetch the request from the network.
        return fetch(event.request).then(
          networkResponse => {
            // OPTIONAL: You could add logic here to cache new requests as they are made.
            return networkResponse;
          }
        );
      })
  );
});

// Activate event: triggered when the service worker is activated.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        // Clean up old caches that are no longer needed.
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
