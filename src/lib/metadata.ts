import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";

export const SITE_URL = getSiteUrl();

/**
 * Construye canonical, hreflang (es/en con x-default) y openGraph url/locale
 * para una ruta concreta.
 *
 * `path` es la ruta sin prefijo de locale, p. ej. "/about" o "/projects/ventify".
 * Con localePrefix 'as-needed', el ES no lleva prefijo y el EN usa "/en".
 */
export function buildPageMetadata(
  locale: string,
  path: string
): Pick<Metadata, "alternates" | "openGraph"> {
  const normalizedPath = path === "/" ? "" : path;
  const esUrl = `${SITE_URL}${normalizedPath}`;
  const enUrl = `${SITE_URL}/en${normalizedPath}`;
  const canonical = locale === "en" ? enUrl : esUrl;

  return {
    alternates: {
      canonical,
      languages: {
        es: esUrl,
        en: enUrl,
        "x-default": esUrl,
      },
    },
    openGraph: {
      url: canonical,
      locale: locale === "en" ? "en_US" : "es_ES",
      alternateLocale: locale === "en" ? "es_ES" : "en_US",
    },
  };
}
