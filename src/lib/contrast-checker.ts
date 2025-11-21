/**
 * Color Contrast Checker
 * Utilidad para verificar el contraste de colores según WCAG 2.1
 */

// Niveles de conformidad WCAG
export type WCAGLevel = "AA" | "AAA"
export type TextSize = "normal" | "large"

// Ratios mínimos requeridos
const CONTRAST_RATIOS = {
  AA: {
    normal: 4.5,
    large: 3,
  },
  AAA: {
    normal: 7,
    large: 4.5,
  },
}

/**
 * Convierte un color hex a RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * Calcula la luminancia relativa de un color
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Calcula el ratio de contraste entre dos colores
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  if (!rgb1 || !rgb2) {
    throw new Error("Invalid hex color")
  }

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)

  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Verifica si el contraste cumple con WCAG
 */
export function meetsWCAG(
  foreground: string,
  background: string,
  level: WCAGLevel = "AA",
  size: TextSize = "normal"
): boolean {
  const ratio = getContrastRatio(foreground, background)
  const minimumRatio = CONTRAST_RATIOS[level][size]
  return ratio >= minimumRatio
}

/**
 * Obtiene el nivel de conformidad del contraste
 */
export function getWCAGLevel(
  foreground: string,
  background: string,
  size: TextSize = "normal"
): "AAA" | "AA" | "Fail" {
  const ratio = getContrastRatio(foreground, background)

  if (ratio >= CONTRAST_RATIOS.AAA[size]) return "AAA"
  if (ratio >= CONTRAST_RATIOS.AA[size]) return "AA"
  return "Fail"
}

/**
 * Colores del tema para verificación
 */
export const themeColors = {
  light: {
    background: "#FFFFFF",
    foreground: "#0A0A0A",
    primary: "#18181B",
    secondary: "#F4F4F5",
    muted: "#F4F4F5",
    mutedForeground: "#71717A",
    accent: "#F4F4F5",
    accentForeground: "#18181B",
    destructive: "#EF4444",
    destructiveForeground: "#FAFAFA",
    border: "#E4E4E7",
    input: "#E4E4E7",
    ring: "#18181B",
  },
  dark: {
    background: "#0A0A0A",
    foreground: "#FAFAFA",
    primary: "#FAFAFA",
    secondary: "#27272A",
    muted: "#27272A",
    mutedForeground: "#A1A1AA",
    accent: "#27272A",
    accentForeground: "#FAFAFA",
    destructive: "#7F1D1D",
    destructiveForeground: "#FAFAFA",
    border: "#27272A",
    input: "#27272A",
    ring: "#D4D4D8",
  },
}

/**
 * Verifica todos los contrastes del tema
 */
export function checkThemeContrast(theme: "light" | "dark" = "dark") {
  const colors = themeColors[theme]
  const results: Array<{
    pair: string
    ratio: number
    level: string
    passes: boolean
  }> = []

  // Verificar combinaciones críticas
  const criticalPairs = [
    { name: "foreground/background", fg: colors.foreground, bg: colors.background },
    { name: "primary/background", fg: colors.primary, bg: colors.background },
    { name: "muted-foreground/background", fg: colors.mutedForeground, bg: colors.background },
    { name: "accent-foreground/accent", fg: colors.accentForeground, bg: colors.accent },
    { name: "destructive-foreground/destructive", fg: colors.destructiveForeground, bg: colors.destructive },
  ]

  criticalPairs.forEach(({ name, fg, bg }) => {
    const ratio = getContrastRatio(fg, bg)
    const level = getWCAGLevel(fg, bg)
    results.push({
      pair: name,
      ratio: Math.round(ratio * 100) / 100,
      level,
      passes: level !== "Fail",
    })
  })

  return results
}

/**
 * Hook de desarrollo para verificar contraste
 */
export function useContrastChecker() {
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    const lightResults = checkThemeContrast("light")
    const darkResults = checkThemeContrast("dark")

    console.group("🎨 Color Contrast Check")
    console.log("Light Theme:", lightResults)
    console.log("Dark Theme:", darkResults)
    console.groupEnd()

    const allPass = [...lightResults, ...darkResults].every((r) => r.passes)
    if (!allPass) {
      console.warn("⚠️ Some color combinations fail WCAG AA standards")
    }
  }
}

/**
 * Genera sugerencias de mejora
 */
export function suggestBetterContrast(
  foreground: string,
  background: string
): {
  current: number
  suggestions: string[]
} {
  const ratio = getContrastRatio(foreground, background)
  const suggestions: string[] = []

  if (ratio < 4.5) {
    suggestions.push("Consider darkening the foreground color")
    suggestions.push("Consider lightening the background color")
    suggestions.push("Increase font size to require only 3:1 ratio")
    suggestions.push("Add a semi-transparent backdrop")
  }

  return {
    current: Math.round(ratio * 100) / 100,
    suggestions,
  }
}
