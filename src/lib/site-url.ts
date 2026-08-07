/**
 * Site URL helper (E8)
 * Fuente única para la URL base del sitio en RSS, sitemap, metadata,
 * canonical, og:image y schemas JSON-LD.
 */

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://arcay.dev"
  );
}

/**
 * Convierte una ruta relativa en URL absoluta.
 * Ej.: toAbsoluteUrl("/projects/ventify") -> "https://arcay.dev/projects/ventify"
 */
export function toAbsoluteUrl(path: string): string {
  const base = getSiteUrl().replace(/\/+$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
