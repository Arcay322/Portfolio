/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Keyboard Navigation Utilities
 * 
 * Ensures complete keyboard accessibility following WCAG 2.1 guidelines.
 * Supports Tab, Arrow keys, Enter, Escape, and custom shortcuts.
 */

import { useEffect, useRef, useCallback } from 'react';

export interface KeyboardNavigationOptions {
  /**
   * Enable arrow key navigation
   */
  arrows?: boolean;
  /**
   * Enable Enter key to activate
   */
  enter?: boolean;
  /**
   * Enable Escape key to close/cancel
   */
  escape?: boolean;
  /**
   * Enable Home/End keys for first/last navigation
   */
  homeEnd?: boolean;
  /**
   * Loop navigation (go to first after last)
   */
  loop?: boolean;
  /**
   * Orientation for arrow keys
   */
  orientation?: 'horizontal' | 'vertical' | 'both';
}

/**
 * Hook for keyboard navigation in lists
 */
export function useKeyboardNavigation<T extends HTMLElement>(
  itemsCount: number,
  options: KeyboardNavigationOptions = {}
) {
  const {
    arrows = true,
    homeEnd = true,
    loop = true,
    orientation = 'vertical',
  } = options;

  const currentIndex = useRef(0);
  const itemRefs = useRef<(T | null)[]>([]);

  const setItemRef = useCallback((index: number) => {
    return (el: T | null) => {
      itemRefs.current[index] = el;
    };
  }, []);

  const focusItem = useCallback((index: number) => {
    if (index < 0 || index >= itemsCount) return;
    
    currentIndex.current = index;
    itemRefs.current[index]?.focus();
  }, [itemsCount]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key } = event;
      let newIndex = currentIndex.current;

      // Arrow key navigation
      if (arrows) {
        if (
          (orientation === 'vertical' || orientation === 'both') &&
          (key === 'ArrowDown' || key === 'ArrowUp')
        ) {
          event.preventDefault();
          newIndex = key === 'ArrowDown' ? newIndex + 1 : newIndex - 1;
        } else if (
          (orientation === 'horizontal' || orientation === 'both') &&
          (key === 'ArrowRight' || key === 'ArrowLeft')
        ) {
          event.preventDefault();
          newIndex = key === 'ArrowRight' ? newIndex + 1 : newIndex - 1;
        }
      }

      // Home/End navigation
      if (homeEnd) {
        if (key === 'Home') {
          event.preventDefault();
          newIndex = 0;
        } else if (key === 'End') {
          event.preventDefault();
          newIndex = itemsCount - 1;
        }
      }

      // Handle looping
      if (loop) {
        if (newIndex < 0) newIndex = itemsCount - 1;
        if (newIndex >= itemsCount) newIndex = 0;
      } else {
        newIndex = Math.max(0, Math.min(newIndex, itemsCount - 1));
      }

      if (newIndex !== currentIndex.current) {
        focusItem(newIndex);
      }
    },
    [arrows, homeEnd, loop, orientation, itemsCount, focusItem]
  );

  return {
    currentIndex: currentIndex.current,
    setItemRef,
    focusItem,
    handleKeyDown,
  };
}

/**
 * Hook for focus trap (modals, dialogs)
 */
export function useFocusTrap<T extends HTMLElement>(isActive: boolean) {
  const containerRef = useRef<T>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    // Store currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    if (!container) return;

    // Get all focusable elements
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstElement?.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      // Restore focus
      previousActiveElement.current?.focus();
    };
  }, [isActive]);

  return containerRef;
}

/**
 * Hook for keyboard shortcuts
 */
export function useKeyboardShortcuts(
  shortcuts: Record<string, (event: KeyboardEvent) => void>
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Build key combination string
      const modifiers: string[] = [];
      if (event.ctrlKey) modifiers.push('ctrl');
      if (event.altKey) modifiers.push('alt');
      if (event.shiftKey) modifiers.push('shift');
      if (event.metaKey) modifiers.push('meta');

      const key = event.key.toLowerCase();
      const combination = [...modifiers, key].join('+');

      // Check if combination matches any shortcut
      if (shortcuts[combination]) {
        event.preventDefault();
        shortcuts[combination](event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

/**
 * Skip to content link utility
 */
export const SkipLinks = {
  /**
   * Generate skip link element
   */
  createSkipLink(targetId: string, text: string = 'Skip to main content'): string {
    return `
      <a 
        href="#${targetId}" 
        class="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
      >
        ${text}
      </a>
    `;
  },
};

/**
 * Roving tabindex manager for complex widgets
 */
export class RovingTabindexManager {
  private items: HTMLElement[] = [];
  private currentIndex: number = 0;

  constructor(private container: HTMLElement, private itemSelector: string) {
    this.init();
  }

  private init() {
    this.items = Array.from(
      this.container.querySelectorAll<HTMLElement>(this.itemSelector)
    );

    this.items.forEach((item, index) => {
      item.setAttribute('tabindex', index === 0 ? '0' : '-1');
      item.addEventListener('keydown', (e) => this.handleKeyDown(e, index));
      item.addEventListener('focus', () => this.setCurrentIndex(index));
    });
  }

  private handleKeyDown(event: KeyboardEvent, index: number) {
    let newIndex = index;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        newIndex = index + 1;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = index - 1;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = this.items.length - 1;
        break;
      default:
        return;
    }

    // Loop navigation
    if (newIndex < 0) newIndex = this.items.length - 1;
    if (newIndex >= this.items.length) newIndex = 0;

    this.focusItem(newIndex);
  }

  private focusItem(index: number) {
    this.setCurrentIndex(index);
    this.items[index]?.focus();
  }

  private setCurrentIndex(index: number) {
    this.items[this.currentIndex]?.setAttribute('tabindex', '-1');
    this.currentIndex = index;
    this.items[this.currentIndex]?.setAttribute('tabindex', '0');
  }

  destroy() {
    this.items.forEach((item) => {
      item.removeEventListener('keydown', this.handleKeyDown as any);
      item.removeEventListener('focus', () => this.setCurrentIndex);
    });
  }
}

/**
 * Focus visible utility (keyboard focus only)
 */
export function useFocusVisible() {
  useEffect(() => {
    let hadKeyboardEvent = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        hadKeyboardEvent = true;
      }
    };

    const handlePointerDown = () => {
      hadKeyboardEvent = false;
    };

    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (hadKeyboardEvent && target) {
        target.classList.add('focus-visible');
      }
    };

    const handleBlur = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target) {
        target.classList.remove('focus-visible');
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('focus', handleFocus, true);
    document.addEventListener('blur', handleBlur, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('focus', handleFocus, true);
      document.removeEventListener('blur', handleBlur, true);
    };
  }, []);
}

/**
 * Accessible button helpers
 */
export const accessibleButton = {
  /**
   * Props for keyboard-accessible buttons
   */
  getProps: (onClick: () => void) => ({
    onClick,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    },
    role: 'button',
    tabIndex: 0,
  }),

  /**
   * Props for link-styled buttons
   */
  getLinkProps: (onClick: () => void) => ({
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      onClick();
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onClick();
      }
    },
    href: '#',
    role: 'button',
  }),
};

/**
 * ARIA live region utilities
 */
export const liveRegion = {
  /**
   * Announce message to screen readers
   */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    if (typeof document === 'undefined') return;

    const liveRegion = document.getElementById('aria-live-region');
    if (!liveRegion) {
      // Create live region if it doesn't exist
      const region = document.createElement('div');
      region.id = 'aria-live-region';
      region.className = 'sr-only';
      region.setAttribute('aria-live', priority);
      region.setAttribute('aria-atomic', 'true');
      document.body.appendChild(region);
      
      // Add message after a brief delay to ensure it's announced
      setTimeout(() => {
        region.textContent = message;
      }, 100);
    } else {
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.textContent = message;
    }
  },

  /**
   * Clear live region
   */
  clear() {
    if (typeof document === 'undefined') return;
    
    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
      liveRegion.textContent = '';
    }
  },
};

/**
 * Focus management utilities
 */
export const focusManagement = {
  /**
   * Get all focusable elements in container
   */
  getFocusableElements(container: HTMLElement): HTMLElement[] {
    const selector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.from(container.querySelectorAll<HTMLElement>(selector));
  },

  /**
   * Set focus to first focusable element
   */
  focusFirst(container: HTMLElement): void {
    const focusable = this.getFocusableElements(container);
    focusable[0]?.focus();
  },

  /**
   * Set focus to last focusable element
   */
  focusLast(container: HTMLElement): void {
    const focusable = this.getFocusableElements(container);
    focusable[focusable.length - 1]?.focus();
  },

  /**
   * Check if element is focusable
   */
  isFocusable(element: HTMLElement): boolean {
    const focusable = this.getFocusableElements(element.parentElement || document.body);
    return focusable.includes(element);
  },
};

const keyboardNavigationExport = {
  useKeyboardNavigation,
  useFocusTrap,
  useKeyboardShortcuts,
  useFocusVisible,
  SkipLinks,
  RovingTabindexManager,
  accessibleButton,
  liveRegion,
  focusManagement,
};

export default keyboardNavigationExport;
