/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Advanced Mobile Gesture Support
 * 
 * Provides comprehensive gesture recognition for mobile devices:
 * - Swipe (left, right, up, down)
 * - Pinch to zoom
 * - Long press
 * - Double tap
 * - Pan/drag
 */

import { useEffect, useRef, useState, useCallback } from 'react';

export interface SwipeDirection {
  type: 'swipe';
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  velocity: number;
  duration: number;
}

export interface PinchGesture {
  type: 'pinch';
  scale: number;
  center: { x: number; y: number };
}

export interface LongPressGesture {
  type: 'longpress';
  position: { x: number; y: number };
  duration: number;
}

export interface DoubleTapGesture {
  type: 'doubletap';
  position: { x: number; y: number };
  timeBetweenTaps: number;
}

export interface PanGesture {
  type: 'pan';
  delta: { x: number; y: number };
  position: { x: number; y: number };
  velocity: { x: number; y: number };
}

export type Gesture = SwipeDirection | PinchGesture | LongPressGesture | DoubleTapGesture | PanGesture;

export interface GestureOptions {
  onSwipe?: (gesture: SwipeDirection) => void;
  onPinch?: (gesture: PinchGesture) => void;
  onLongPress?: (gesture: LongPressGesture) => void;
  onDoubleTap?: (gesture: DoubleTapGesture) => void;
  onPan?: (gesture: PanGesture) => void;
  
  swipeThreshold?: number;
  longPressDuration?: number;
  doubleTapDelay?: number;
  preventDefaultTouchMove?: boolean;
}

/**
 * Advanced gesture recognition hook
 */
export function useGestures<T extends HTMLElement>(options: GestureOptions = {}) {
  const {
    onSwipe,
    onPinch,
    onLongPress,
    onDoubleTap,
    onPan,
    swipeThreshold = 50,
    longPressDuration = 500,
    doubleTapDelay = 300,
    preventDefaultTouchMove = false,
  } = options;

  const ref = useRef<T>(null);
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTap = useRef<{ time: number; position: { x: number; y: number } } | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isPanning = useRef(false);
  const initialTouches = useRef<Touch[]>([]);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0];
      const now = Date.now();

      touchStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: now,
      };

      initialTouches.current = Array.from(e.touches);

      // Long press detection
      if (onLongPress) {
        longPressTimer.current = setTimeout(() => {
          if (touchStart.current) {
            onLongPress({
              type: 'longpress',
              position: { x: touchStart.current.x, y: touchStart.current.y },
              duration: Date.now() - touchStart.current.time,
            });
          }
        }, longPressDuration);
      }

      // Double tap detection
      if (onDoubleTap && lastTap.current) {
        const timeSinceLastTap = now - lastTap.current.time;
        const distance = Math.hypot(
          touch.clientX - lastTap.current.position.x,
          touch.clientY - lastTap.current.position.y
        );

        if (timeSinceLastTap < doubleTapDelay && distance < 30) {
          onDoubleTap({
            type: 'doubletap',
            position: { x: touch.clientX, y: touch.clientY },
            timeBetweenTaps: timeSinceLastTap,
          });
          lastTap.current = null;
        } else {
          lastTap.current = { time: now, position: { x: touch.clientX, y: touch.clientY } };
        }
      } else if (onDoubleTap) {
        lastTap.current = { time: now, position: { x: touch.clientX, y: touch.clientY } };
      }
    },
    [onLongPress, onDoubleTap, longPressDuration, doubleTapDelay]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (preventDefaultTouchMove) {
        e.preventDefault();
      }

      // Cancel long press if moved
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }

      if (!touchStart.current) return;

      // Pinch detection
      if (e.touches.length === 2 && onPinch && initialTouches.current.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];

        const initialTouch1 = initialTouches.current[0];
        const initialTouch2 = initialTouches.current[1];

        const initialDistance = Math.hypot(
          initialTouch2.clientX - initialTouch1.clientX,
          initialTouch2.clientY - initialTouch1.clientY
        );

        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );

        const scale = currentDistance / initialDistance;

        const centerX = (touch1.clientX + touch2.clientX) / 2;
        const centerY = (touch1.clientY + touch2.clientY) / 2;

        onPinch({
          type: 'pinch',
          scale,
          center: { x: centerX, y: centerY },
        });

        return;
      }

      // Pan detection
      if (onPan && e.touches.length === 1) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStart.current.x;
        const deltaY = touch.clientY - touchStart.current.y;
        const deltaTime = Date.now() - touchStart.current.time;

        isPanning.current = true;

        onPan({
          type: 'pan',
          delta: { x: deltaX, y: deltaY },
          position: { x: touch.clientX, y: touch.clientY },
          velocity: {
            x: deltaX / deltaTime,
            y: deltaY / deltaTime,
          },
        });
      }
    },
    [onPinch, onPan, preventDefaultTouchMove]
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      // Cancel long press
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }

      if (!touchStart.current) return;

      const touch = e.changedTouches[0];
      const now = Date.now();

      touchEnd.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: now,
      };

      // Don't detect swipe if it was a pan
      if (isPanning.current) {
        isPanning.current = false;
        touchStart.current = null;
        return;
      }

      // Swipe detection
      if (onSwipe) {
        const deltaX = touchEnd.current.x - touchStart.current.x;
        const deltaY = touchEnd.current.y - touchStart.current.y;
        const deltaTime = touchEnd.current.time - touchStart.current.time;

        const distance = Math.hypot(deltaX, deltaY);
        const velocity = distance / deltaTime;

        if (distance >= swipeThreshold) {
          // Determine swipe direction
          let direction: 'left' | 'right' | 'up' | 'down';

          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            direction = deltaX > 0 ? 'right' : 'left';
          } else {
            direction = deltaY > 0 ? 'down' : 'up';
          }

          onSwipe({
            type: 'swipe',
            direction,
            distance,
            velocity,
            duration: deltaTime,
          });
        }
      }

      touchStart.current = null;
      initialTouches.current = [];
    },
    [onSwipe, swipeThreshold]
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventDefaultTouchMove });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);

      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, preventDefaultTouchMove]);

  return ref;
}

/**
 * Pull to refresh hook
 */
export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const currentY = useRef(0);

  const threshold = 80; // Pull distance to trigger refresh
  const maxDistance = 150; // Maximum pull distance

  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Only start if at top of page
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (window.scrollY > 0 || isRefreshing) return;

      currentY.current = e.touches[0].clientY;
      const distance = currentY.current - startY.current;

      if (distance > 0) {
        // Apply resistance effect
        const resistance = Math.min(distance / 2, maxDistance);
        setPullDistance(resistance);

        // Prevent default scrolling when pulling
        if (distance > 10) {
          e.preventDefault();
        }
      }
    },
    [isRefreshing, maxDistance]
  );

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(threshold);

      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }

    startY.current = 0;
    currentY.current = 0;
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    isRefreshing,
    pullDistance,
    threshold,
    progress: Math.min(pullDistance / threshold, 1),
  };
}

/**
 * Haptic feedback utilities
 */
export const haptics = {
  /**
   * Light impact feedback
   */
  light() {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },

  /**
   * Medium impact feedback
   */
  medium() {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  },

  /**
   * Heavy impact feedback
   */
  heavy() {
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  },

  /**
   * Success feedback
   */
  success() {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 50, 10]);
    }
  },

  /**
   * Error feedback
   */
  error() {
    if ('vibrate' in navigator) {
      navigator.vibrate([20, 100, 20, 100, 20]);
    }
  },

  /**
   * Selection feedback
   */
  selection() {
    if ('vibrate' in navigator) {
      navigator.vibrate(5);
    }
  },
};

/**
 * Device orientation utilities
 */
export function useDeviceOrientation() {
  const [orientation, setOrientation] = useState<{
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
  }>({
    alpha: null,
    beta: null,
    gamma: null,
  });

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      setOrientation({
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
      });
    };

    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return orientation;
}

/**
 * Screen orientation lock
 */
export async function lockOrientation(
  orientation: 'portrait' | 'landscape'
): Promise<boolean> {
  if (typeof window === 'undefined' || !('screen' in window)) {
    return false;
  }

  try {
    const screen = window.screen as any;
    
    if (screen.orientation && screen.orientation.lock) {
      await screen.orientation.lock(orientation);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Failed to lock orientation:', error);
    return false;
  }
}

/**
 * Unlock screen orientation
 */
export function unlockOrientation(): boolean {
  if (typeof window === 'undefined' || !('screen' in window)) {
    return false;
  }

  try {
    const screen = window.screen as any;
    
    if (screen.orientation && screen.orientation.unlock) {
      screen.orientation.unlock();
      return true;
    }

    return false;
  } catch (error) {
    console.error('Failed to unlock orientation:', error);
    return false;
  }
}

const mobileGesturesExport = {
  useGestures,
  usePullToRefresh,
  useDeviceOrientation,
  lockOrientation,
  unlockOrientation,
  haptics,
};

export default mobileGesturesExport;
