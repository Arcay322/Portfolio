'use client';

import { useEffect, useState } from 'react';
import { registerServiceWorker, setupOnlineListener } from '@/lib/service-worker-registration';
import { useToast } from '@/hooks/use-toast';

export function ServiceWorkerRegistrar() {
  const [isOnline, setIsOnline] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Register service worker
    registerServiceWorker().then((registration) => {
      if (registration) {
        console.log('[SW] Service Worker registered');
      }
    });

    // Setup online/offline listeners
    const cleanup = setupOnlineListener(
      () => {
        setIsOnline(true);
        toast({
          title: '✅ Conexión restaurada',
          description: 'Volviste a estar en línea',
          duration: 3000,
        });
      },
      () => {
        setIsOnline(false);
        toast({
          title: '📡 Sin conexión',
          description: 'Algunas funciones pueden no estar disponibles',
          variant: 'destructive',
          duration: 5000,
        });
      }
    );

    return cleanup;
  }, [toast]);

  // Hidden status indicator (for debugging)
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
        <div
          className={`
            px-3 py-1 rounded-full text-xs font-medium
            ${isOnline ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'}
          `}
        >
          {isOnline ? '🟢 Online' : '🔴 Offline'}
        </div>
      </div>
    );
  }

  return null;
}
