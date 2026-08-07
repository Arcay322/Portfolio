/**
 * Site URL helper (E8)
 * Fuente única para la URL base del sitio en RSS, sitemap, metadata,
 * canonical, og:image y schemas JSON-LD.
 *
 * El dominio canónico real es https://www.arcay.dev (Vercel redirige el apex
 * arcay.dev → www.arcay.dev con 308). Todos los canonicals/hreflang/og:url
 * deben apuntar a www.arcay.dev para que el canonical no señale a una URL que
 * redirige.
 */

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://www.arcay.dev"
  );
}

/**
 * Convierte una ruta relativa en URL absoluta.
 * Ej.: toAbsoluteUrl("/projects/ventify") -> "https://www.arcay.dev/projects/ventify"
 */
export function toAbsoluteUrl(path: string): string {
  const base = getSiteUrl().replace(/\/+$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
