"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

interface PrefetchConfig {
  routes: string[]
  delay?: number // Delay antes de hacer prefetch (ms)
  onHover?: boolean // Prefetch al hacer hover en links
  onIdle?: boolean // Prefetch cuando el navegador está idle
}

/**
 * Hook para prefetch inteligente de rutas
 */
export function usePrefetch({
  routes,
  delay = 2000,
  onHover = true,
  onIdle = true,
}: PrefetchConfig) {
  const pathname = usePathname()

  useEffect(() => {
    // Prefetch después del delay
    const timeoutId = setTimeout(() => {
      routes.forEach((route) => {
        // No prefetch la ruta actual
        if (route === pathname) return

        // Crear un link invisible y usar router prefetch
        const link = document.createElement("link")
        link.rel = "prefetch"
        link.href = route
        link.as = "document"
        document.head.appendChild(link)
      })
    }, delay)

    return () => clearTimeout(timeoutId)
  }, [routes, delay, pathname])

  useEffect(() => {
    if (!onHover) return

    // Prefetch al hacer hover en links internos
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Verificar que target tenga el método closest
      if (!target || typeof target.closest !== 'function') return
      
      const link = target.closest("a[href^='/']") as HTMLAnchorElement
      
      if (link && link.href) {
        try {
          const url = new URL(link.href)
          const route = url.pathname
          
          if (routes.includes(route) && route !== pathname) {
            const prefetchLink = document.createElement("link")
            prefetchLink.rel = "prefetch"
            prefetchLink.href = route
            prefetchLink.as = "document"
            document.head.appendChild(prefetchLink)
          }
        } catch {
          // Invalid URL, skip
        }
      }
    }

    document.addEventListener("mouseover", handleMouseEnter, true)
    return () => document.removeEventListener("mouseover", handleMouseEnter, true)
  }, [routes, pathname, onHover])

  useEffect(() => {
    if (!onIdle || typeof window === "undefined" || !("requestIdleCallback" in window)) {
      return
    }

    // Prefetch cuando el navegador está idle
    const idleCallback = window.requestIdleCallback(() => {
      routes.forEach((route) => {
        if (route === pathname) return

        const link = document.createElement("link")
        link.rel = "prefetch"
        link.href = route
        link.as = "document"
        document.head.appendChild(link)
      })
    })

    return () => {
      if (typeof window !== "undefined" && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleCallback)
      }
    }
  }, [routes, pathname, onIdle])
}

/**
 * Componente para prefetch inteligente de rutas
 */
export function PrefetchRoutes({
  routes,
  delay = 2000,
  onHover = true,
  onIdle = true,
}: PrefetchConfig) {
  usePrefetch({ routes, delay, onHover, onIdle })
  return null
}

/**
 * Configuración de rutas importantes para prefetch
 */
export const IMPORTANT_ROUTES = [
  "/",
  "/about",
  "/projects",
  "/contact",
]

/**
 * Prefetch relacionado con la ruta actual
 */
export function useSmartPrefetch() {
  const pathname = usePathname()

  useEffect(() => {
    const relatedRoutes = getRelatedRoutes(pathname)
    
    const timeoutId = setTimeout(() => {
      relatedRoutes.forEach((route) => {
        const link = document.createElement("link")
        link.rel = "prefetch"
        link.href = route
        link.as = "document"
        document.head.appendChild(link)
      })
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [pathname])
}

/**
 * Obtiene rutas relacionadas basadas en la ruta actual
 */
function getRelatedRoutes(pathname: string): string[] {
  const routes: Record<string, string[]> = {
    "/": ["/about", "/projects"],
    "/about": ["/projects", "/contact"],
    "/projects": ["/contact", "/about"],
    "/contact": ["/projects", "/about"],
  }

  // Para rutas de detalle de proyecto, prefetch la lista de proyectos
  if (pathname.startsWith("/projects/")) {
    return ["/projects", "/contact"]
  }

  return routes[pathname] || []
}

/**
 * Prefetch de imágenes críticas
 */
export function prefetchImages(urls: string[]) {
  if (typeof window === "undefined") return

  urls.forEach((url) => {
    const link = document.createElement("link")
    link.rel = "prefetch"
    link.href = url
    link.as = "image"
    document.head.appendChild(link)
  })
}

/**
 * Prefetch de datos JSON
 */
export function prefetchData(urls: string[]) {
  if (typeof window === "undefined") return

  urls.forEach((url) => {
    fetch(url, {
      method: "GET",
      priority: "low",
    } as RequestInit).catch(() => {
      // Silently fail prefetch
    })
  })
}
