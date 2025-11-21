/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
/**
 * Core Web Vitals Optimization
 * 
 * This file provides utilities to monitor and optimize Core Web Vitals:
 * - LCP (Largest Contentful Paint) - Target: < 2.5s
 * - INP (Interaction to Next Paint) - Target: < 200ms (replaces FID)
 * - CLS (Cumulative Layout Shift) - Target: < 0.1
 * - TTFB (Time to First Byte) - Target: < 800ms
 * - FCP (First Contentful Paint) - Target: < 1.8s
 */

import type { Metric } from 'web-vitals';

export interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

/**
 * Get rating based on metric thresholds
 */
function getWebVitalRating(metric: Metric): 'good' | 'needs-improvement' | 'poor' {
  const { name, value } = metric;

  const thresholds: Record<string, { good: number; poor: number }> = {
    LCP: { good: 2500, poor: 4000 },
    CLS: { good: 0.1, poor: 0.25 },
    INP: { good: 200, poor: 500 },
    TTFB: { good: 800, poor: 1800 },
    FCP: { good: 1800, poor: 3000 },
  };

  const threshold = thresholds[name];
  if (!threshold) return 'good';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Report Web Vitals to analytics
 */
export function reportWebVitals(metric: Metric) {
  const webVitalMetric: WebVitalMetric = {
    name: metric.name,
    value: metric.value,
    rating: getWebVitalRating(metric),
    delta: metric.delta,
    id: metric.id,
  };

  // Send to Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `[Web Vitals] ${webVitalMetric.name}: ${webVitalMetric.value.toFixed(2)}ms - Rating: ${webVitalMetric.rating}`
    );
  }

  // Send to custom analytics endpoint
  sendToAnalytics(webVitalMetric);
}

/**
 * Send metrics to custom analytics endpoint
 */
async function sendToAnalytics(metric: WebVitalMetric) {
  if (typeof window === 'undefined') return;

  try {
    const body = JSON.stringify({
      ...metric,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
    });

    // Use sendBeacon if available (doesn't block page unload)
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/vitals', body);
    } else {
      // Fallback to fetch with keepalive
      fetch('/api/analytics/vitals', {
        body,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      }).catch(console.error);
    }
  } catch (error) {
    // Fail silently in production
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to send Web Vitals:', error);
    }
  }
}

/**
 * LCP Optimization Utilities
 */
export const lcpOptimization = {
  /**
   * Preload critical images
   */
  preloadImage(src: string, as: 'image' = 'image') {
    if (typeof document === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = as;
    link.href = src;
    document.head.appendChild(link);
  },

  /**
   * Preload critical fonts
   */
  preloadFont(href: string, type: string = 'font/woff2') {
    if (typeof document === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = type;
    link.href = href;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  },

  /**
   * Get image loading priority
   */
  getImagePriority(isAboveFold: boolean): 'high' | 'low' | 'auto' {
    return isAboveFold ? 'high' : 'low';
  },
};

/**
 * CLS Optimization Utilities
 */
export const clsOptimization = {
  /**
   * Get aspect ratio for image containers
   */
  getAspectRatio(width: number, height: number): string {
    return `${width} / ${height}`;
  },

  /**
   * Get responsive image sizes
   */
  getImageSizes(breakpoints: { mobile: number; tablet: number; desktop: number }): string {
    return `(max-width: 640px) ${breakpoints.mobile}px, (max-width: 1024px) ${breakpoints.tablet}px, ${breakpoints.desktop}px`;
  },

  /**
   * Create skeleton loader dimensions
   */
  getSkeletonDimensions(width: number, height: number): React.CSSProperties {
    return {
      width: `${width}px`,
      height: `${height}px`,
      aspectRatio: `${width} / ${height}`,
    };
  },
};

/**
 * INP (Interaction to Next Paint) Optimization Utilities
 */
export const interactionOptimization = {
  /**
   * Debounce function for heavy operations
   */
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: Parameters<T>) {
      const later = () => {
        timeout = null;
        func(...args);
      };

      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function for frequent events
   */
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return function executedFunction(...args: Parameters<T>) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  /**
   * Request Idle Callback wrapper
   */
  runWhenIdle(callback: () => void, timeout: number = 2000) {
    if (typeof window === 'undefined') return;

    if ('requestIdleCallback' in window) {
      requestIdleCallback(callback, { timeout });
    } else {
      // Fallback for Safari
      setTimeout(callback, 1);
    }
  },

  /**
   * Break up long tasks
   */
  async yieldToMain() {
    return new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
  },
};

/**
 * Performance Observer for monitoring
 */
export class WebVitalsMonitor {
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window === 'undefined') return;
    this.initObservers();
  }

  private initObservers() {
    // Monitor long tasks (> 50ms)
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              console.warn(
                `[Long Task] ${entry.name}: ${entry.duration.toFixed(2)}ms`,
                entry
              );
            }
          }
        });

        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.push(longTaskObserver);
      } catch (e) {
        // longtask might not be supported
      }

      // Monitor layout shifts
      try {
        const layoutShiftObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if ((entry as any).hadRecentInput) continue;

            console.warn(
              `[Layout Shift] Value: ${(entry as any).value.toFixed(4)}`,
              entry
            );
          }
        });

        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(layoutShiftObserver);
      } catch (e) {
        // layout-shift might not be supported
      }
    }
  }

  disconnect() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
}

/**
 * Preconnect to external domains
 */
export function preconnectDomains(domains: string[]) {
  if (typeof document === 'undefined') return;

  domains.forEach((domain) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    document.head.appendChild(link);

    // Also add dns-prefetch as fallback
    const dnsPrefetch = document.createElement('link');
    dnsPrefetch.rel = 'dns-prefetch';
    dnsPrefetch.href = domain;
    document.head.appendChild(dnsPrefetch);
  });
}

/**
 * Resource hints for critical resources
 */
export const resourceHints = {
  preconnect: (href: string) => {
    if (typeof document === 'undefined') return;
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = href;
    document.head.appendChild(link);
  },

  dnsPrefetch: (href: string) => {
    if (typeof document === 'undefined') return;
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = href;
    document.head.appendChild(link);
  },

  prefetch: (href: string) => {
    if (typeof document === 'undefined') return;
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  },

  prerender: (href: string) => {
    if (typeof document === 'undefined') return;
    const link = document.createElement('link');
    link.rel = 'prerender';
    link.href = href;
    document.head.appendChild(link);
  },
};

/**
 * Hook to monitor Web Vitals in React components
 */
export function useWebVitals() {
  if (typeof window === 'undefined') return;

  import('web-vitals').then(({ onCLS, onLCP, onINP, onTTFB, onFCP }) => {
    onCLS(reportWebVitals);
    onLCP(reportWebVitals);
    onINP(reportWebVitals);
    onTTFB(reportWebVitals);
    onFCP(reportWebVitals);
  });
}

const webVitalsExport = {
  reportWebVitals,
  lcpOptimization,
  clsOptimization,
  interactionOptimization,
  WebVitalsMonitor,
  preconnectDomains,
  resourceHints,
  useWebVitals,
};

export default webVitalsExport;
