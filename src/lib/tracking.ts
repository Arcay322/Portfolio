/**
 * Error Tracking Integration
 * 
 * Integrates Sentry for error tracking and monitoring
 * Initialize in app/layout.tsx or instrumentation.ts
 */

// This would be in instrumentation.ts for Next.js 13+
export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side Sentry initialization
    initSentryServer();
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime Sentry initialization
    initSentryEdge();
  }
}

function initSentryServer() {
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    // Sentry.init({
    //   dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    //   environment: process.env.NODE_ENV,
    //   tracesSampleRate: 1.0,
    //   integrations: [
    //     new Sentry.Integrations.Http({ tracing: true }),
    //     new Sentry.Integrations.Prisma({ client: prisma }),
    //   ],
    // });
  }
}

function initSentryEdge() {
  // Edge runtime initialization
}

/**
 * Error Boundary Client Component
 */
export class ErrorTracker {
  private static instance: ErrorTracker;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initializeClient();
    }
  }

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  private initializeClient() {
    // Initialize Sentry on client
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
      // Sentry.init({
      //   dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      //   environment: process.env.NODE_ENV,
      //   tracesSampleRate: 1.0,
      //   replaysSessionSampleRate: 0.1,
      //   replaysOnErrorSampleRate: 1.0,
      //   integrations: [
      //     new Sentry.BrowserTracing(),
      //     new Sentry.Replay({
      //       maskAllText: false,
      //       blockAllMedia: false,
      //     }),
      //   ],
      // });
    }

    // Setup global error handlers
    window.addEventListener('error', this.handleError.bind(this));
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
  }

  private handleError(event: ErrorEvent) {
    console.error('Global error:', event.error);
    this.captureException(event.error, {
      type: 'error',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  }

  private handleUnhandledRejection(event: PromiseRejectionEvent) {
    console.error('Unhandled promise rejection:', event.reason);
    this.captureException(event.reason, {
      type: 'unhandledRejection',
    });
  }

  captureException(error: Error, context?: Record<string, unknown>) {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error captured:', error, context);
    }

    // Send to Sentry in production
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureException(error, {
      //   contexts: {
      //     custom: context,
      //   },
      // });
    }

    // Also send to custom analytics endpoint
    this.sendToAnalytics(error, context);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  captureMessage(_message: string, _level: 'info' | 'warning' | 'error' = 'info') {
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureMessage(_message, _level);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setUser(_user: { id: string; email?: string; username?: string }) {
    if (process.env.NODE_ENV === 'production') {
      // Sentry.setUser(_user);
    }
  }

  private async sendToAnalytics(error: Error, context?: Record<string, unknown>) {
    try {
      await fetch('/api/analytics/error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
          context,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        }),
      });
    } catch (e) {
      console.error('Failed to send error to analytics:', e);
    }
  }
}

/**
 * Performance Monitoring
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initializeMonitoring();
    }
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeMonitoring() {
    // Monitor Core Web Vitals
    if (typeof window !== 'undefined') {
      import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
        onCLS(this.sendToAnalytics.bind(this));
        onFCP(this.sendToAnalytics.bind(this));
        onLCP(this.sendToAnalytics.bind(this));
        onTTFB(this.sendToAnalytics.bind(this));
        onINP(this.sendToAnalytics.bind(this));
      });
    }

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              this.reportLongTask(entry);
            }
          }
        });
        observer.observe({ entryTypes: ['longtask'] });
      } catch {
        // Long task monitoring not supported
      }
    }
  }

  private sendToAnalytics(metric: { name: string; value: number; rating: string; delta: number; id: string }) {
    // Send to analytics service
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/analytics/vitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
          timestamp: new Date().toISOString(),
        }),
      }).catch(console.error);
    }
  }

  private reportLongTask(entry: PerformanceEntry) {
    console.warn('Long task detected:', entry.duration, 'ms');
    
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'longtask',
          duration: entry.duration,
          startTime: entry.startTime,
          timestamp: new Date().toISOString(),
        }),
      }).catch(console.error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  measureCustomMetric(_name: string, _value: number) {
    if (process.env.NODE_ENV === 'production') {
      // Sentry.metrics.distribution(_name, _value);
    }
  }
}

// Initialize tracking (call in app layout or instrumentation)
export function initializeTracking() {
  if (typeof window !== 'undefined') {
    ErrorTracker.getInstance();
    PerformanceMonitor.getInstance();
  }
}

// Export convenient functions
export const trackError = (error: Error, context?: Record<string, unknown>) => {
  ErrorTracker.getInstance().captureException(error, context);
};

export const trackMessage = (message: string, level?: 'info' | 'warning' | 'error') => {
  ErrorTracker.getInstance().captureMessage(message, level);
};

export const trackPerformance = (name: string, value: number) => {
  PerformanceMonitor.getInstance().measureCustomMetric(name, value);
};
