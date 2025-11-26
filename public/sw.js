const CACHE_NAME = 'weather-app-cache-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/vite.svg',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => (key !== CACHE_NAME ? caches.delete(key) : null)))
    )
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  // Network-first for navigation and HTML
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        return response;
      }).catch(() => caches.match(request) || caches.match('/index.html'))
    );
    return;
  }

  // Cache-first for same-origin static assets
  const url = new URL(request.url);
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then(cached =>
        cached || fetch(request).then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
      )
    );
  }
});


// Firebase Cloud Messaging (FCM) background notifications
// Replace the config values below with your Firebase project settings or mirror the values used in src/firebase.js
try {
  importScripts('https://www.gstatic.com/firebasejs/10.14.0/firebase-app-compat.js');
  importScripts('https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging-compat.js');

  firebase.initializeApp({
    apiKey: 'AIzaSyCOaKsiJbHSraCoE9WCWqgq0dWTSbnN0uM',
    authDomain: 'weather-app-a916b.firebaseapp.com',
    projectId: 'weather-app-a916b',
    storageBucket: 'weather-app-a916b.firebasestorage.app',
    messagingSenderId: '872426385516',
    appId: '1:872426385516:web:4a362db6f6d27d117ce849',
    measurementId: 'G-6LPSTN5TCX',
  });

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const title =
      (payload && payload.data && payload.data.title) ||
      (payload && payload.notification && payload.notification.title) ||
      'Notification';
    const body =
      (payload && payload.data && payload.data.body) ||
      (payload && payload.notification && payload.notification.body) ||
      '';
    self.registration.showNotification(title, { body });
  });

  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          const url = new URL(client.url);
          if ('focus' in client) return client.focus();
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
        return undefined;
      })
    );
  });
} catch (e) {
  // No-op
}

