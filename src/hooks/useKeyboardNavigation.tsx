"use client"

import { useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

interface KeyboardNavigationOptions {
  enableArrowKeys?: boolean
  enableHomeEnd?: boolean
  enableShortcuts?: boolean
}

const shortcuts: Record<string, string> = {
  "h": "/",           // Home
  "a": "/about",      // About
  "p": "/projects",   // Projects
  "c": "/contact",    // Contact
  "?": "/",           // Help (podría ser una página de ayuda)
}

export function useKeyboardNavigation(options: KeyboardNavigationOptions = {}) {
  const {
    enableArrowKeys = false,
    enableHomeEnd = true,
    enableShortcuts = true,
  } = options

  const router = useRouter()

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      // Ignore si el usuario está escribiendo en un input/textarea
      const target = event.target as HTMLElement
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return
      }

      // Home/End keys
      if (enableHomeEnd) {
        if (event.key === "Home") {
          event.preventDefault()
          window.scrollTo({ top: 0, behavior: "smooth" })
          return
        }
        if (event.key === "End") {
          event.preventDefault()
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
          return
        }
      }

      // Arrow keys para scroll
      if (enableArrowKeys) {
        if (event.key === "ArrowUp") {
          event.preventDefault()
          window.scrollBy({ top: -100, behavior: "smooth" })
          return
        }
        if (event.key === "ArrowDown") {
          event.preventDefault()
          window.scrollBy({ top: 100, behavior: "smooth" })
          return
        }
      }

      // Keyboard shortcuts (con Alt key)
      if (enableShortcuts && event.altKey) {
        const route = shortcuts[event.key.toLowerCase()]
        if (route) {
          event.preventDefault()
          router.push(route)
          return
        }
      }

      // Escape para cerrar modales/menus (manejado por componentes)
      if (event.key === "Escape") {
        // Los componentes individuales manejan esto
        return
      }
    },
    [router, enableArrowKeys, enableHomeEnd, enableShortcuts]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [handleKeyPress])
}

// Hook específico para navegación de listas con teclado
export function useListKeyboardNavigation(
  items: HTMLElement[],
  currentIndex: number,
  onIndexChange: (index: number) => void
) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return
      }

      switch (event.key) {
        case "ArrowDown":
        case "j": // Vim-style
          event.preventDefault()
          onIndexChange(Math.min(currentIndex + 1, items.length - 1))
          break
        case "ArrowUp":
        case "k": // Vim-style
          event.preventDefault()
          onIndexChange(Math.max(currentIndex - 1, 0))
          break
        case "Home":
          event.preventDefault()
          onIndexChange(0)
          break
        case "End":
          event.preventDefault()
          onIndexChange(items.length - 1)
          break
        case "Enter":
          event.preventDefault()
          items[currentIndex]?.click()
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [items, currentIndex, onIndexChange])

  // Focus en el elemento actual
  useEffect(() => {
    items[currentIndex]?.focus()
  }, [currentIndex, items])
}

// Component wrapper para añadir navegación por teclado a cualquier página
export function KeyboardNavigationProvider({
  children,
  ...options
}: KeyboardNavigationOptions & { children: React.ReactNode }) {
  useKeyboardNavigation(options)
  return <>{children}</>
}
