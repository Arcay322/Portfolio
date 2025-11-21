'use client';

import { useEffect } from 'react';
import { errorTracker } from '@/lib/error-tracking';
import { reportWebVitals } from '@/lib/web-vitals-optimization';

export function WebVitalsReporter() {
  useEffect(() => {
    // Initialize Web Vitals monitoring
    if (typeof window !== 'undefined') {
      import('web-vitals').then(({ onCLS, onLCP, onINP, onTTFB, onFCP }) => {
        onCLS(reportWebVitals);
        onLCP(reportWebVitals);
        onINP(reportWebVitals);
        onTTFB(reportWebVitals);
        onFCP(reportWebVitals);
      });
    }

    // Initialize error tracking
    errorTracker.init({
      enabled: process.env.NODE_ENV === 'production',
      environment: process.env.NODE_ENV,
      release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      beforeSend: (event) => {
        // Filter out known non-critical errors
        if (event.message.includes('ResizeObserver loop')) {
          return null; // Don't send this error
        }
        return event;
      },
    });

    // Add initial context
    errorTracker.setTags({
      app: 'portfolio',
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    });

    console.log('[Web Vitals] Monitoring initialized');
  }, []);

  return null; // This component doesn't render anything
}
