/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
/**
 * Service Worker Registration
 * 
 * Handles service worker registration, updates, and lifecycle events.
 */

export interface ServiceWorkerStatus {
  registered: boolean;
  controller: ServiceWorker | null;
  waiting: ServiceWorker | null;
  active: ServiceWorker | null;
}

/**
 * Register service worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('[SW] Service Workers not supported');
    return null;
  }

  // Don't register in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[SW] Skipping registration in development');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('[SW] Service Worker registered successfully:', registration.scope);

    // Check for updates every hour
    setInterval(() => {
      registration.update();
    }, 60 * 60 * 1000);

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      
      if (newWorker) {
        console.log('[SW] New Service Worker found');
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available, notify user
            console.log('[SW] New content available, refresh to update');
            notifyUpdate(registration);
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error('[SW] Registration failed:', error);
    return null;
  }
}

/**
 * Unregister service worker
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    for (const registration of registrations) {
      await registration.unregister();
    }

    console.log('[SW] Service Worker unregistered');
    return true;
  } catch (error) {
    console.error('[SW] Unregistration failed:', error);
    return false;
  }
}

/**
 * Update service worker immediately
 */
export async function updateServiceWorker(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    
    if (!registration) {
      return false;
    }

    const waiting = registration.waiting;
    
    if (waiting) {
      // Tell the waiting service worker to skip waiting
      waiting.postMessage({ type: 'SKIP_WAITING' });

      // Reload the page when the new service worker takes control
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      return true;
    }

    return false;
  } catch (error) {
    console.error('[SW] Update failed:', error);
    return false;
  }
}

/**
 * Get service worker status
 */
export function getServiceWorkerStatus(): ServiceWorkerStatus {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return {
      registered: false,
      controller: null,
      waiting: null,
      active: null,
    };
  }

  return {
    registered: !!navigator.serviceWorker.controller,
    controller: navigator.serviceWorker.controller,
    waiting: null, // Would need to get from registration
    active: null,  // Would need to get from registration
  };
}

/**
 * Clear all caches
 */
export async function clearAllCaches(): Promise<boolean> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return false;
  }

  try {
    const cacheNames = await caches.keys();
    
    await Promise.all(
      cacheNames.map((cacheName) => caches.delete(cacheName))
    );

    console.log('[SW] All caches cleared');
    return true;
  } catch (error) {
    console.error('[SW] Failed to clear caches:', error);
    return false;
  }
}

/**
 * Notify user about available update
 */
function notifyUpdate(registration: ServiceWorkerRegistration) {
  // Check if we have a toast/notification system
  if (typeof window !== 'undefined' && (window as any).toast) {
    const toast = (window as any).toast;
    
    toast.info('Nueva versión disponible', {
      description: 'Haz clic para actualizar',
      action: {
        label: 'Actualizar',
        onClick: () => updateServiceWorker(),
      },
      duration: Infinity, // Don't auto-dismiss
    });
  } else {
    // Fallback to console
    console.log(
      '[SW] New version available. Refresh the page to update.',
      'Call updateServiceWorker() to update immediately.'
    );
  }
}

/**
 * Check if browser is online
 */
export function isOnline(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }

  return navigator.onLine;
}

/**
 * Listen to online/offline events
 */
export function setupOnlineListener(
  onOnline?: () => void,
  onOffline?: () => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleOnline = () => {
    console.log('[SW] Browser is online');
    onOnline?.();
  };

  const handleOffline = () => {
    console.log('[SW] Browser is offline');
    onOffline?.();
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * Request background sync (for form submissions)
 */
export async function requestBackgroundSync(tag: string): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    if ('sync' in registration) {
      await (registration as any).sync.register(tag);
      console.log(`[SW] Background sync requested: ${tag}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
    return false;
  }
}

/**
 * Request persistent storage
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof window === 'undefined' || !('storage' in navigator)) {
    return false;
  }

  try {
    if (navigator.storage && navigator.storage.persist) {
      const isPersisted = await navigator.storage.persist();
      console.log(`[SW] Persistent storage: ${isPersisted ? 'granted' : 'denied'}`);
      return isPersisted;
    }

    return false;
  } catch (error) {
    console.error('[SW] Persistent storage request failed:', error);
    return false;
  }
}

/**
 * Get storage estimate
 */
export async function getStorageEstimate(): Promise<{
  usage: number;
  quota: number;
  percentage: number;
} | null> {
  if (typeof window === 'undefined' || !('storage' in navigator)) {
    return null;
  }

  try {
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const percentage = quota > 0 ? (usage / quota) * 100 : 0;

      return {
        usage,
        quota,
        percentage,
      };
    }

    return null;
  } catch (error) {
    console.error('[SW] Storage estimate failed:', error);
    return null;
  }
}

/**
 * React hook for service worker
 */
export function useServiceWorker() {
  if (typeof window === 'undefined') {
    return {
      register: async () => null,
      unregister: async () => false,
      update: async () => false,
      clearCaches: async () => false,
      isOnline: true,
      status: {
        registered: false,
        controller: null,
        waiting: null,
        active: null,
      },
    };
  }

  return {
    register: registerServiceWorker,
    unregister: unregisterServiceWorker,
    update: updateServiceWorker,
    clearCaches: clearAllCaches,
    isOnline: isOnline(),
    status: getServiceWorkerStatus(),
  };
}

const serviceWorkerExport = {
  register: registerServiceWorker,
  unregister: unregisterServiceWorker,
  update: updateServiceWorker,
  clearCaches: clearAllCaches,
  getStatus: getServiceWorkerStatus,
  isOnline,
  setupOnlineListener,
  requestBackgroundSync,
  requestPersistentStorage,
  getStorageEstimate,
  useServiceWorker,
};

export default serviceWorkerExport;
