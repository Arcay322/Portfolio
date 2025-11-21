/**
 * Input Sanitization Utilities
 * Previene XSS y otras vulnerabilidades de inyección
 */

/**
 * Escapa caracteres HTML peligrosos
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  }
  return text.replace(/[&<>"'/]/g, (char) => map[char])
}

/**
 * Remueve tags HTML de un string
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "")
}

/**
 * Sanitiza input de texto básico
 */
export function sanitizeText(input: string, maxLength: number = 1000): string {
  if (typeof input !== "string") {
    throw new Error("Input must be a string")
  }

  // Trim y limitar longitud
  let sanitized = input.trim().slice(0, maxLength)

  // Remover null bytes
  sanitized = sanitized.replace(/\0/g, "")

  // Remover caracteres de control (excepto saltos de línea y tabs)
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")

  // Escape HTML
  sanitized = escapeHtml(sanitized)

  return sanitized
}

/**
 * Sanitiza input de email
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== "string") {
    throw new Error("Email must be a string")
  }

  // Trim y lowercase
  let sanitized = email.trim().toLowerCase()

  // Limitar longitud
  sanitized = sanitized.slice(0, 254) // RFC 5321

  // Remover caracteres peligrosos
  sanitized = sanitized.replace(/[<>()[\]\\,;:\s@"]/g, "")

  return sanitized
}

/**
 * Valida y sanitiza URL
 */
export function sanitizeUrl(url: string): string | null {
  if (typeof url !== "string") {
    return null
  }

  try {
    const parsed = new URL(url)
    
    // Solo permitir http y https
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null
    }

    return parsed.toString()
  } catch {
    return null
  }
}

/**
 * Sanitiza nombre (solo letras, espacios y algunos caracteres)
 */
export function sanitizeName(name: string, maxLength: number = 100): string {
  if (typeof name !== "string") {
    throw new Error("Name must be a string")
  }

  let sanitized = name.trim().slice(0, maxLength)

  // Solo permitir letras, espacios, guiones, apóstrofes
  sanitized = sanitized.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/g, "")

  // Remover múltiples espacios
  sanitized = sanitized.replace(/\s+/g, " ")

  return sanitized
}

/**
 * Sanitiza teléfono
 */
export function sanitizePhone(phone: string): string {
  if (typeof phone !== "string") {
    throw new Error("Phone must be a string")
  }

  // Solo números, espacios, guiones, paréntesis, +
  return phone.replace(/[^0-9\s\-()+]/g, "").trim()
}

/**
 * Sanitiza mensaje/textarea
 */
export function sanitizeMessage(message: string, maxLength: number = 5000): string {
  if (typeof message !== "string") {
    throw new Error("Message must be a string")
  }

  let sanitized = message.trim().slice(0, maxLength)

  // Remover null bytes
  sanitized = sanitized.replace(/\0/g, "")

  // Remover caracteres de control peligrosos (mantener \n, \r, \t)
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")

  // Strip HTML tags
  sanitized = stripHtml(sanitized)

  // Limitar saltos de línea consecutivos
  sanitized = sanitized.replace(/\n{4,}/g, "\n\n\n")

  return sanitized
}

/**
 * Valida y sanitiza objeto completo
 */
export function sanitizeContactForm(data: {
  name: string
  email: string
  message: string
  phone?: string
  website?: string
}): {
  name: string
  email: string
  message: string
  phone?: string
  website?: string | null
} {
  return {
    name: sanitizeName(data.name),
    email: sanitizeEmail(data.email),
    message: sanitizeMessage(data.message),
    ...(data.phone && { phone: sanitizePhone(data.phone) }),
    ...(data.website && { website: sanitizeUrl(data.website) }),
  }
}

/**
 * Detecta posibles ataques de inyección SQL
 */
export function detectSqlInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(--|;|\/\*|\*\/|xp_|sp_)/i,
    /(\bOR\b\s+\d+\s*=\s*\d+)/i,
    /(\bAND\b\s+\d+\s*=\s*\d+)/i,
    /(\bUNION\b.*\bSELECT\b)/i,
  ]

  return sqlPatterns.some((pattern) => pattern.test(input))
}

/**
 * Detecta posibles ataques XSS
 */
export function detectXss(input: string): boolean {
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // onclick, onerror, etc.
    /<img[^>]*src[^>]*>/gi,
    /eval\s*\(/gi,
  ]

  return xssPatterns.some((pattern) => pattern.test(input))
}

/**
 * Validación completa de seguridad
 */
export function validateSecurity(input: string): {
  safe: boolean
  threats: string[]
} {
  const threats: string[] = []

  if (detectSqlInjection(input)) {
    threats.push("Possible SQL injection detected")
  }

  if (detectXss(input)) {
    threats.push("Possible XSS attack detected")
  }

  // Detectar exceso de caracteres especiales
  const specialCharsRatio = (input.match(/[^a-zA-Z0-9\s]/g) || []).length / input.length
  if (specialCharsRatio > 0.3) {
    threats.push("Excessive special characters")
  }

  return {
    safe: threats.length === 0,
    threats,
  }
}

/**
 * Limpia input de forma segura para logging
 */
export function sanitizeForLog(input: string, maxLength: number = 100): string {
  let sanitized = input.slice(0, maxLength)
  
  // Remover información sensible común
  sanitized = sanitized.replace(/\b\d{16}\b/g, "[CARD]") // Tarjetas
  sanitized = sanitized.replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[SSN]") // SSN
  sanitized = sanitized.replace(/password[=:]\s*\S+/gi, "password=[REDACTED]")
  
  return sanitized
}

/**
 * Rate limit basado en contenido duplicado
 */
const recentSubmissions = new Map<string, number>()

export function checkDuplicateSubmission(content: string, windowMs: number = 60000): boolean {
  const hash = simpleHash(content)
  const now = Date.now()
  const lastSubmission = recentSubmissions.get(hash)

  if (lastSubmission && now - lastSubmission < windowMs) {
    return true // Es duplicado
  }

  recentSubmissions.set(hash, now)
  
  // Limpiar entries antiguos
  if (recentSubmissions.size > 1000) {
    const cutoff = now - windowMs
    for (const [key, time] of recentSubmissions.entries()) {
      if (time < cutoff) {
        recentSubmissions.delete(key)
      }
    }
  }

  return false
}

function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}
