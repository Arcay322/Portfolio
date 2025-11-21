/**
 * Rate Limiter
 * Sistema de rate limiting para prevenir abuso de APIs
 */

interface RateLimitConfig {
  interval: number // Tiempo en ms
  uniqueTokenPerInterval: number // Número de tokens únicos permitidos
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map()
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = config
    
    // Limpiar entradas expiradas cada minuto
    if (typeof window === "undefined") {
      setInterval(() => this.cleanup(), 60000)
    }
  }

  /**
   * Verifica si una solicitud debe ser permitida
   */
  check(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const entry = this.requests.get(identifier)

    // Si no hay entrada o ha expirado, crear nueva
    if (!entry || now > entry.resetTime) {
      const resetTime = now + this.config.interval
      this.requests.set(identifier, { count: 1, resetTime })
      return {
        allowed: true,
        remaining: this.config.uniqueTokenPerInterval - 1,
        resetTime,
      }
    }

    // Si se excedió el límite
    if (entry.count >= this.config.uniqueTokenPerInterval) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      }
    }

    // Incrementar contador
    entry.count++
    this.requests.set(identifier, entry)

    return {
      allowed: true,
      remaining: this.config.uniqueTokenPerInterval - entry.count,
      resetTime: entry.resetTime,
    }
  }

  /**
   * Limpia entradas expiradas
   */
  private cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key)
      }
    }
  }

  /**
   * Resetea el límite para un identificador específico
   */
  reset(identifier: string) {
    this.requests.delete(identifier)
  }
}

// Rate limiters predefinidos
export const contactFormLimiter = new RateLimiter({
  interval: 60 * 60 * 1000, // 1 hora
  uniqueTokenPerInterval: 3, // 3 mensajes por hora
})

export const apiLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minuto
  uniqueTokenPerInterval: 30, // 30 requests por minuto
})

/**
 * Helper para obtener identificador del cliente
 */
export function getClientIdentifier(request: Request): string {
  // En producción, usar IP real del header
  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown"
  
  // Combinar IP con user agent para mejor unicidad
  const userAgent = request.headers.get("user-agent") || "unknown"
  const hash = simpleHash(`${ip}-${userAgent}`)
  
  return hash
}

/**
 * Simple hash function para identificadores
 */
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}

/**
 * Middleware helper para Next.js API routes
 */
export async function withRateLimit(
  request: Request,
  limiter: RateLimiter = apiLimiter
): Promise<{ success: boolean; error?: string; headers?: Record<string, string> }> {
  const identifier = getClientIdentifier(request)
  const { allowed, remaining, resetTime } = limiter.check(identifier)

  const headers = {
    "X-RateLimit-Limit": limiter["config"].uniqueTokenPerInterval.toString(),
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": new Date(resetTime).toISOString(),
  }

  if (!allowed) {
    const retryAfter = Math.ceil((resetTime - Date.now()) / 1000)
    return {
      success: false,
      error: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
      headers: {
        ...headers,
        "Retry-After": retryAfter.toString(),
      },
    }
  }

  return {
    success: true,
    headers,
  }
}

/**
 * Cliente-side rate limiter usando localStorage
 */
export class ClientRateLimiter {
  private key: string
  private limit: number
  private interval: number

  constructor(key: string, limit: number, interval: number) {
    this.key = `rate_limit_${key}`
    this.limit = limit
    this.interval = interval
  }

  check(): { allowed: boolean; remaining: number; resetTime: number } {
    if (typeof window === "undefined") {
      return { allowed: true, remaining: this.limit, resetTime: Date.now() }
    }

    const now = Date.now()
    const stored = localStorage.getItem(this.key)

    if (!stored) {
      const data = {
        count: 1,
        resetTime: now + this.interval,
      }
      localStorage.setItem(this.key, JSON.stringify(data))
      return { allowed: true, remaining: this.limit - 1, resetTime: data.resetTime }
    }

    const data = JSON.parse(stored)

    // Si ha expirado, resetear
    if (now > data.resetTime) {
      const newData = {
        count: 1,
        resetTime: now + this.interval,
      }
      localStorage.setItem(this.key, JSON.stringify(newData))
      return { allowed: true, remaining: this.limit - 1, resetTime: newData.resetTime }
    }

    // Si excede el límite
    if (data.count >= this.limit) {
      return { allowed: false, remaining: 0, resetTime: data.resetTime }
    }

    // Incrementar
    data.count++
    localStorage.setItem(this.key, JSON.stringify(data))
    return { allowed: true, remaining: this.limit - data.count, resetTime: data.resetTime }
  }

  reset() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.key)
    }
  }
}

// Client-side limiter para formulario de contacto
export const clientContactLimiter = new ClientRateLimiter(
  "contact_form",
  3, // 3 intentos
  60 * 60 * 1000 // 1 hora
)
