/**
 * Mobile Touch Utilities
 * Mejora la experiencia táctil en dispositivos móviles
 */

import { cn } from "./utils"

/**
 * Clases de utilidad para áreas de toque mínimas (44x44px WCAG)
 */
export const touchTarget = {
  // Mínimo WCAG (44x44px)
  min: "min-h-[44px] min-w-[44px]",
  
  // Recomendado (48x48px)
  recommended: "min-h-[48px] min-w-[48px]",
  
  // Grande (56x56px)
  large: "min-h-[56px] min-w-[56px]",
  
  // Padding adicional para elementos pequeños
  padding: "p-3",
  
  // Gap mínimo entre elementos táctiles
  gap: "gap-2",
}

/**
 * Hook para detectar dispositivo táctil
 */
export function useTouchDevice(): boolean {
  if (typeof window === "undefined") return false
  
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error - msMaxTouchPoints es legacy
    navigator.msMaxTouchPoints > 0
  )
}

/**
 * Clases para botones táctiles optimizados
 */
export const touchButton = cn(
  touchTarget.min,
  "inline-flex items-center justify-center",
  "active:scale-95 transition-transform",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
)

/**
 * Clases para links táctiles optimizados
 */
export const touchLink = cn(
  touchTarget.min,
  "inline-flex items-center",
  "active:opacity-70 transition-opacity",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
)

/**
 * Clases para iconos táctiles
 */
export const touchIcon = cn(
  touchTarget.recommended,
  "inline-flex items-center justify-center rounded-full",
  "active:scale-90 transition-transform",
  "hover:bg-accent"
)

/**
 * Helper para obtener clases de tamaño táctil
 */
export function getTouchTargetClasses(size: "min" | "recommended" | "large" = "min"): string {
  return cn(
    touchTarget[size],
    "inline-flex items-center justify-center"
  )
}

/**
 * Breakpoints optimizados para diferentes dispositivos
 */
export const responsiveBreakpoints = {
  // Móvil pequeño (320px - 374px)
  'xs': '320px',
  
  // Móvil (375px - 639px)
  'sm': '640px',
  
  // Tablet pequeño (640px - 767px)
  'md': '768px',
  
  // Tablet (768px - 1023px)
  'lg': '1024px',
  
  // Desktop pequeño (1024px - 1279px)
  'xl': '1280px',
  
  // Desktop (1280px - 1535px)
  '2xl': '1536px',
  
  // Desktop grande (1536px+)
  '3xl': '1920px',
}

/**
 * Clases de utilidad responsive
 */
export const responsive = {
  // Padding responsive
  padding: {
    mobile: "px-4 py-3",
    tablet: "md:px-6 md:py-4",
    desktop: "lg:px-8 lg:py-6",
  },
  
  // Texto responsive
  text: {
    heading: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
    subheading: "text-xl sm:text-2xl md:text-3xl",
    body: "text-base md:text-lg",
    small: "text-sm md:text-base",
  },
  
  // Grid responsive
  grid: {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  },
  
  // Container responsive
  container: "w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl",
}

/**
 * Gestos táctiles personalizados
 */
export interface SwipeHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
}

export function useSwipe(handlers: SwipeHandlers, threshold: number = 50) {
  let touchStartX = 0
  let touchStartY = 0
  let touchEndX = 0
  let touchEndY = 0

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.changedTouches[0].screenX
    touchStartY = e.changedTouches[0].screenY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX = e.changedTouches[0].screenX
    touchEndY = e.changedTouches[0].screenY
    handleSwipe()
  }

  const handleSwipe = () => {
    const deltaX = touchEndX - touchStartX
    const deltaY = touchEndY - touchStartY

    // Horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          handlers.onSwipeRight?.()
        } else {
          handlers.onSwipeLeft?.()
        }
      }
    }
    // Vertical swipe
    else {
      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0) {
          handlers.onSwipeDown?.()
        } else {
          handlers.onSwipeUp?.()
        }
      }
    }
  }

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
  }
}

/**
 * Prevenir zoom en doble tap (iOS)
 */
export function preventDoubleTapZoom(element: HTMLElement) {
  let lastTap = 0
  
  element.addEventListener('touchend', (e) => {
    const currentTime = new Date().getTime()
    const tapLength = currentTime - lastTap
    
    if (tapLength < 500 && tapLength > 0) {
      e.preventDefault()
    }
    
    lastTap = currentTime
  })
}

/**
 * Mejora el scroll en móviles (momentum scrolling)
 */
export const smoothScroll = "-webkit-overflow-scrolling: touch; overflow-y: scroll;"

/**
 * Clases para mejorar la interacción táctil
 */
export const touchInteraction = {
  // Efecto de presión
  active: "active:scale-95 active:opacity-90",
  
  // Feedback visual rápido
  feedback: "transition-transform duration-100 active:scale-95",
  
  // Prevenir selección de texto accidental
  noSelect: "select-none",
  
  // Cursor pointer en dispositivos híbridos
  pointer: "cursor-pointer touch-manipulation",
}

/**
 * Configuración de viewport meta para móviles
 */
export const mobileViewportMeta = {
  content: "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover"
}

/**
 * Safe area insets para notch/island
 */
export const safeArea = {
  top: "pt-[env(safe-area-inset-top)]",
  bottom: "pb-[env(safe-area-inset-bottom)]",
  left: "pl-[env(safe-area-inset-left)]",
  right: "pr-[env(safe-area-inset-right)]",
  all: "p-[env(safe-area-inset-top)] p-[env(safe-area-inset-bottom)] p-[env(safe-area-inset-left)] p-[env(safe-area-inset-right)]",
}
