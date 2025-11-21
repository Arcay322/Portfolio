/**
 * Service Worker for offline caching and performance
 * 
 * Implements caching strategies for:
 * - Static assets (cache-first)
 * - API responses (network-first)
 * - Images (cache-first with fallback)
 * - Pages (network-first with cache fallback)
 */

const CACHE_VERSION = 'v1';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;

// Cache duration in milliseconds
const CACHE_DURATION = {
  static: 30 * 24 * 60 * 60 * 1000, // 30 days
  dynamic: 24 * 60 * 60 * 1000,     // 1 day
  images: 7 * 24 * 60 * 60 * 1000,  // 7 days
};

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/about',
  '/projects',
  '/contact',
  '/manifest.json',
  '/favicon.ico',
];

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );

  // Activate worker immediately
  self.skipWaiting();
});

/**
 * Activate event - clean old caches
 */
self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (
            cacheName !== STATIC_CACHE &&
            cacheName !== DYNAMIC_CACHE &&
            cacheName !== IMAGE_CACHE
          ) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // Take control of all pages immediately
  self.clients.claim();
});

/**
 * Fetch event - implement caching strategies
 */
self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // API requests - Network first, cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
    return;
  }

  // Images - Cache first, network fallback
  if (
    request.destination === 'image' ||
    /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(url.pathname)
  ) {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
    return;
  }

  // Static assets - Cache first
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font' ||
    /\.(css|js|woff2?|ttf|eot)$/i.test(url.pathname)
  ) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    return;
  }

  // Pages - Network first, cache fallback
  if (request.destination === 'document' || request.mode === 'navigate') {
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
    return;
  }

  // Default - Network first
  event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
});

/**
 * Cache-first strategy
 * Try cache first, fallback to network
 */
async function cacheFirstStrategy(request: Request, cacheName: string): Promise<Response> {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Check if cache is expired
      const cacheTime = await getCacheTime(request, cacheName);
      const duration = getCacheDuration(cacheName);

      if (cacheTime && Date.now() - cacheTime < duration) {
        console.log('[Service Worker] Cache hit:', request.url);
        return cachedResponse;
      }
    }

    // Fetch from network
    console.log('[Service Worker] Fetching from network:', request.url);
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      await setCacheTime(request, cacheName);
    }

    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Cache-first failed:', error);

    // Try cache as last resort
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page or error response
    return createOfflineResponse();
  }
}

/**
 * Network-first strategy
 * Try network first, fallback to cache
 */
async function networkFirstStrategy(request: Request, cacheName: string): Promise<Response> {
  try {
    console.log('[Service Worker] Fetching from network:', request.url);
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      await setCacheTime(request, cacheName);
    }

    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Network failed, trying cache:', request.url);

    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page or error response
    return createOfflineResponse();
  }
}

/**
 * Get cache timestamp
 */
async function getCacheTime(request: Request, cacheName: string): Promise<number | null> {
  const cache = await caches.open(`${cacheName}-metadata`);
  const response = await cache.match(request.url);
  
  if (response) {
    const text = await response.text();
    return parseInt(text, 10);
  }
  
  return null;
}

/**
 * Set cache timestamp
 */
async function setCacheTime(request: Request, cacheName: string): Promise<void> {
  const cache = await caches.open(`${cacheName}-metadata`);
  const response = new Response(Date.now().toString());
  await cache.put(request.url, response);
}

/**
 * Get cache duration based on cache name
 */
function getCacheDuration(cacheName: string): number {
  if (cacheName.includes('static')) return CACHE_DURATION.static;
  if (cacheName.includes('images')) return CACHE_DURATION.images;
  return CACHE_DURATION.dynamic;
}

/**
 * Create offline response
 */
function createOfflineResponse(): Response {
  return new Response(
    `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Offline - Portfolio</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 20px;
          }
          .container {
            max-width: 500px;
          }
          h1 {
            font-size: 3rem;
            margin: 0 0 1rem;
          }
          p {
            font-size: 1.25rem;
            margin: 0 0 2rem;
            opacity: 0.9;
          }
          button {
            background: white;
            color: #667eea;
            border: none;
            padding: 12px 24px;
            font-size: 1rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
          }
          button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🔌 Sin conexión</h1>
          <p>
            Parece que no tienes conexión a internet en este momento.
            Algunas páginas pueden estar disponibles en caché.
          </p>
          <button onclick="window.location.reload()">
            Reintentar
          </button>
        </div>
      </body>
    </html>
    `,
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'text/html',
      },
    }
  );
}

/**
 * Background sync for form submissions
 */
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'sync-contact-form') {
    event.waitUntil(syncContactForm());
  }
});

/**
 * Sync contact form submissions when online
 */
async function syncContactForm() {
  console.log('[Service Worker] Syncing contact form...');
  
  // Get pending submissions from IndexedDB
  // This would integrate with your form submission logic
  // For now, this is a placeholder
  
  try {
    // Send pending forms
    console.log('[Service Worker] Contact forms synced');
  } catch (error) {
    console.error('[Service Worker] Sync failed:', error);
    throw error; // Re-throw to retry sync later
  }
}

/**
 * Push notifications (optional)
 */
self.addEventListener('push', (event: any) => {
  const data = event.data?.json() || {};
  const title = data.title || 'Portfolio Update';
  const options = {
    body: data.body || 'New content available',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/',
    },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

/**
 * Notification click handler
 */
self.addEventListener('notificationclick', (event: any) => {
  event.notification.close();

  event.waitUntil(
    self.clients.openWindow(event.notification.data.url)
  );
});

/**
 * Message handler for cache updates
 */
self.addEventListener('message', (event: any) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

export {};
