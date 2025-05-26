// Service Worker para EducStation
const CACHE_NAME = 'educstation-cache-v1';
const API_CACHE_NAME = 'educstation-api-cache-v1';

// Recursos estáticos a cachear en la instalación
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/css/main.css',
  '/static/js/main.js',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// Patrones de URL para diferentes estrategias de caché
const API_URL_PATTERN = /\/api\/publicaciones/;
const IMAGE_URL_PATTERN = /\.(jpe?g|png|gif|svg|webp)$/i;

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cacheando recursos estáticos');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Eliminar caches antiguas que no sean las actuales
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptar peticiones
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // No cachear peticiones de analytics o que no sean GET
  if (event.request.method !== 'GET' || url.pathname.includes('/analytics')) {
    return;
  }
  
  // Estrategia para API de publicaciones: Network First, luego caché
  if (API_URL_PATTERN.test(url.pathname)) {
    event.respondWith(networkFirstThenCache(event.request));
    return;
  }
  
  // Estrategia para imágenes: Cache First, luego red
  if (IMAGE_URL_PATTERN.test(url.pathname)) {
    event.respondWith(cacheFirstThenNetwork(event.request));
    return;
  }
  
  // Estrategia para otros recursos: Stale-While-Revalidate
  event.respondWith(staleWhileRevalidate(event.request));
});

// Estrategia Network First: Intentar red primero, si falla usar caché
async function networkFirstThenCache(request) {
  const cache = await caches.open(API_CACHE_NAME);
  
  try {
    // Intentar obtener de la red
    const networkResponse = await fetch(request);
    
    // Guardar copia en caché si la respuesta es válida
    if (networkResponse.ok) {
      // Clonar la respuesta porque solo se puede consumir una vez
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Si falla la red, intentar desde la caché
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Si no hay caché, devolver error
    throw error;
  }
}

// Estrategia Cache First: Intentar caché primero, si falla usar red
async function cacheFirstThenNetwork(request) {
  const cache = await caches.open(CACHE_NAME);
  
  // Intentar obtener de la caché
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Si está en caché, devolverlo inmediatamente
    return cachedResponse;
  }
  
  // Si no está en caché, obtener de la red
  try {
    const networkResponse = await fetch(request);
    
    // Guardar copia en caché si la respuesta es válida
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Si todo falla, intentar devolver una imagen de placeholder
    if (IMAGE_URL_PATTERN.test(request.url)) {
      const placeholderResponse = await cache.match('/placeholder-image.png');
      if (placeholderResponse) {
        return placeholderResponse;
      }
    }
    
    // Si no hay placeholder, devolver error
    throw error;
  }
}

// Estrategia Stale-While-Revalidate: Devolver caché mientras se actualiza en segundo plano
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  
  // Obtener de la caché
  const cachedResponse = await cache.match(request);
  
  // Actualizar en segundo plano
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(error => {
    console.error('Error al actualizar caché:', error);
  });
  
  // Devolver caché si existe, o esperar la red
  return cachedResponse || fetchPromise;
}

// Escuchar mensajes desde la aplicación
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.action === 'clearCache') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('Limpiando caché por solicitud:', cacheName);
            return caches.delete(cacheName);
          })
        );
      })
    );
  }
}); 