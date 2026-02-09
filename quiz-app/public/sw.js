// Service Worker básico para notificaciones
const CACHE_NAME = 'quiz-bereal-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/App.jsx'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activado');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

// Manejo de notificaciones push
self.addEventListener('push', (event) => {
  console.log('Push recibido:', event);
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || '💡 ¡Hora de aprender!';
  const options = {
    body: data.body || 'Tienes una nueva pregunta esperándote',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    tag: 'quiz-notification',
    requireInteraction: true,
    data: {
      url: data.url || '/',
      timestamp: Date.now()
    },
    actions: [
      { action: 'answer', title: 'Responder ahora ✨' },
      { action: 'later', title: 'Más tarde' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('Notificación clickeada:', event);
  
  event.notification.close();

  if (event.action === 'answer') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  } else if (!event.action) {
    // Click en la notificación misma
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
