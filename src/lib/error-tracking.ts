/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Error Tracking and Monitoring
 * 
 * Centralized error tracking system compatible with services like Sentry.
 * Captures, logs, and reports errors with context.
 */

export interface ErrorContext {
  user?: {
    id?: string;
    email?: string;
    username?: string;
  };
  tags?: Record<string, string>;
  extra?: Record<string, any>;
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
  fingerprint?: string[];
}

export interface ErrorEvent {
  message: string;
  error?: Error;
  timestamp: number;
  url: string;
  userAgent: string;
  context?: ErrorContext;
  breadcrumbs?: Breadcrumb[];
}

export interface Breadcrumb {
  type: 'navigation' | 'http' | 'user' | 'console' | 'error' | 'default';
  category?: string;
  message?: string;
  data?: Record<string, any>;
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
  timestamp: number;
}

class ErrorTracker {
  private static instance: ErrorTracker;
  private breadcrumbs: Breadcrumb[] = [];
  private maxBreadcrumbs = 50;
  private context: ErrorContext = {};
  private enabled = true;
  private beforeSend?: (event: ErrorEvent) => ErrorEvent | null;

  private constructor() {
    this.setupGlobalErrorHandlers();
  }

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  /**
   * Initialize error tracker
   */
  init(options: {
    dsn?: string;
    environment?: string;
    release?: string;
    beforeSend?: (event: ErrorEvent) => ErrorEvent | null;
    enabled?: boolean;
  }) {
    this.enabled = options.enabled !== false;
    this.beforeSend = options.beforeSend;

    if (options.dsn) {
      this.setContext({
        tags: {
          environment: options.environment || 'production',
          release: options.release || 'unknown',
        },
      });
    }

    console.log('[Error Tracker] Initialized', {
      enabled: this.enabled,
      environment: options.environment,
    });
  }

  /**
   * Setup global error handlers
   */
  private setupGlobalErrorHandlers() {
    if (typeof window === 'undefined') return;

    // Catch unhandled errors
    window.addEventListener('error', (event) => {
      this.captureException(event.error, {
        tags: { type: 'unhandled_error' },
        extra: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureException(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        {
          tags: { type: 'unhandled_rejection' },
        }
      );
    });

    // Catch console errors
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      this.addBreadcrumb({
        type: 'console',
        category: 'error',
        message: args.map(arg => String(arg)).join(' '),
        level: 'error',
        timestamp: Date.now(),
      });

      originalConsoleError.apply(console, args);
    };

    // Track navigation
    if ('navigation' in window.performance) {
      this.addBreadcrumb({
        type: 'navigation',
        category: 'navigation',
        message: 'Page loaded',
        data: {
          url: window.location.href,
        },
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Capture an exception
   */
  captureException(error: Error | string, context?: ErrorContext) {
    if (!this.enabled) return;

    const errorObj = typeof error === 'string' ? new Error(error) : error;

    const event: ErrorEvent = {
      message: errorObj.message,
      error: errorObj,
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      context: { ...this.context, ...context },
      breadcrumbs: [...this.breadcrumbs],
    };

    // Run beforeSend hook
    const processedEvent = this.beforeSend ? this.beforeSend(event) : event;
    
    if (!processedEvent) {
      return; // Event was filtered out
    }

    this.sendError(processedEvent);
  }

  /**
   * Capture a message
   */
  captureMessage(message: string, level: ErrorContext['level'] = 'info', context?: ErrorContext) {
    if (!this.enabled) return;

    const event: ErrorEvent = {
      message,
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      context: { ...this.context, ...context, level },
      breadcrumbs: [...this.breadcrumbs],
    };

    this.sendError(event);
  }

  /**
   * Add breadcrumb
   */
  addBreadcrumb(breadcrumb: Breadcrumb) {
    if (!this.enabled) return;

    this.breadcrumbs.push(breadcrumb);

    // Keep only last N breadcrumbs
    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs = this.breadcrumbs.slice(-this.maxBreadcrumbs);
    }
  }

  /**
   * Set user context
   */
  setUser(user: ErrorContext['user']) {
    this.context.user = user;
  }

  /**
   * Set tags
   */
  setTags(tags: Record<string, string>) {
    this.context.tags = { ...this.context.tags, ...tags };
  }

  /**
   * Set extra context
   */
  setExtra(extra: Record<string, any>) {
    this.context.extra = { ...this.context.extra, ...extra };
  }

  /**
   * Set context
   */
  setContext(context: ErrorContext) {
    this.context = { ...this.context, ...context };
  }

  /**
   * Clear context
   */
  clearContext() {
    this.context = {};
  }

  /**
   * Send error to tracking service
   */
  private async sendError(event: ErrorEvent) {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('[Error Tracker] New Error');
      console.error('Message:', event.message);
      console.error('Error:', event.error);
      console.log('Context:', event.context);
      console.log('Breadcrumbs:', event.breadcrumbs);
      console.groupEnd();
    }

    // Send to analytics endpoint
    try {
      const body = JSON.stringify({
        ...event,
        error: event.error ? {
          name: event.error.name,
          message: event.error.message,
          stack: event.error.stack,
        } : undefined,
      });

      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/errors', body);
      } else {
        fetch('/api/analytics/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: true,
        }).catch(console.error);
      }
    } catch (error) {
      console.error('[Error Tracker] Failed to send error:', error);
    }
  }
}

// Export singleton instance
export const errorTracker = ErrorTracker.getInstance();

/**
 * React error boundary helper
 */
export class ErrorBoundaryTracker {
  static captureError(error: Error, errorInfo: React.ErrorInfo) {
    errorTracker.captureException(error, {
      level: 'error',
      tags: {
        type: 'react_error_boundary',
      },
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });
  }
}

/**
 * Track API errors
 */
export function trackApiError(
  url: string,
  status: number,
  statusText: string,
  responseBody?: any
) {
  errorTracker.addBreadcrumb({
    type: 'http',
    category: 'api',
    message: `${status} ${statusText}`,
    data: {
      url,
      status,
      statusText,
      responseBody,
    },
    level: status >= 500 ? 'error' : 'warning',
    timestamp: Date.now(),
  });

  if (status >= 500) {
    errorTracker.captureMessage(
      `API Error: ${status} ${statusText} - ${url}`,
      'error',
      {
        tags: {
          type: 'api_error',
          status: String(status),
        },
        extra: {
          url,
          responseBody,
        },
      }
    );
  }
}

/**
 * Track user actions for debugging
 */
export function trackUserAction(
  action: string,
  data?: Record<string, any>
) {
  errorTracker.addBreadcrumb({
    type: 'user',
    category: 'action',
    message: action,
    data,
    level: 'info',
    timestamp: Date.now(),
  });
}

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  /**
   * Start measuring
   */
  start(label: string) {
    if (typeof performance !== 'undefined') {
      performance.mark(`${label}-start`);
    }
  }

  /**
   * End measuring
   */
  end(label: string) {
    if (typeof performance !== 'undefined') {
      performance.mark(`${label}-end`);
      performance.measure(label, `${label}-start`, `${label}-end`);

      const measure = performance.getEntriesByName(label)[0];
      if (measure) {
        this.recordMetric(label, measure.duration);
      }

      // Cleanup
      performance.clearMarks(`${label}-start`);
      performance.clearMarks(`${label}-end`);
      performance.clearMeasures(label);
    }
  }

  /**
   * Record metric
   */
  private recordMetric(label: string, duration: number) {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }

    const metrics = this.metrics.get(label)!;
    metrics.push(duration);

    // Keep only last 100 measurements
    if (metrics.length > 100) {
      metrics.shift();
    }

    // Log slow operations
    if (duration > 1000) {
      errorTracker.captureMessage(
        `Slow operation: ${label} took ${duration.toFixed(2)}ms`,
        'warning',
        {
          tags: {
            type: 'performance',
            operation: label,
          },
          extra: {
            duration,
          },
        }
      );
    }
  }

  /**
   * Get average duration
   */
  getAverage(label: string): number | null {
    const metrics = this.metrics.get(label);
    if (!metrics || metrics.length === 0) return null;

    const sum = metrics.reduce((a, b) => a + b, 0);
    return sum / metrics.length;
  }

  /**
   * Get metrics summary
   */
  getSummary(label: string): {
    count: number;
    average: number;
    min: number;
    max: number;
  } | null {
    const metrics = this.metrics.get(label);
    if (!metrics || metrics.length === 0) return null;

    return {
      count: metrics.length,
      average: metrics.reduce((a, b) => a + b, 0) / metrics.length,
      min: Math.min(...metrics),
      max: Math.max(...metrics),
    };
  }
}

export const performanceMonitor = new PerformanceMonitor();

/**
 * Hook for tracking component errors
 */
export function useErrorTracking(componentName: string) {
  errorTracker.addBreadcrumb({
    type: 'default',
    category: 'component',
    message: `${componentName} mounted`,
    timestamp: Date.now(),
  });

  return {
    captureError: (error: Error, context?: ErrorContext) => {
      errorTracker.captureException(error, {
        ...context,
        tags: {
          ...context?.tags,
          component: componentName,
        },
      });
    },
    trackAction: (action: string, data?: Record<string, any>) => {
      trackUserAction(`${componentName}: ${action}`, data);
    },
  };
}

const errorTrackingExport = {
  errorTracker,
  ErrorBoundaryTracker,
  trackApiError,
  trackUserAction,
  performanceMonitor,
  useErrorTracking,
};

export default errorTrackingExport;
