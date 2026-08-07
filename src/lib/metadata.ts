import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";

export const SITE_URL = getSiteUrl();

const OG_IMAGE = {
  url: "https://storage.googleapis.com/ticket_world_media/arcay-dev-portfolio.png",
  width: 1200,
  height: 630,
  alt: "Arnie Calderon - Portafolio",
};

const SITE_NAME = "Arnie Calderon";

type PageOpenGraph = NonNullable<Metadata["openGraph"]>;

/**
 * Construye canonical, hreflang (es/en con x-default) y openGraph completo
 * (url, locale, alternateLocale, siteName, type e imagen por defecto) para
 * una ruta concreta.
 *
 * `path` es la ruta sin prefijo de locale, p. ej. "/about" o "/projects/ventify".
 * Con localePrefix 'as-needed', el ES no lleva prefijo y el EN usa "/en".
 *
 * `og` permite sobrescribir campos openGraph por página (p. ej. tipo article,
 * título o imagen propia del post). Si `og.images` está vacío/undefined se
 * conserva la imagen OG por defecto, así ninguna página emite <head> sin
 * og:image.
 *
 * Cada página hace `...buildPageMetadata(locale, path, og)` en su
 * generateMetadata. Como openGraph se fusiona a nivel de objeto (no deep-merge),
 * este helper debe incluir TODA la imagen OG compartida para que las páginas no
 * la sobrescriban con un openGraph parcial y pierdan og:image en producción.
 */
export function buildPageMetadata(
  locale: string,
  path: string,
  og?: PageOpenGraph
): Pick<Metadata, "alternates" | "openGraph"> {
  const normalizedPath = path === "/" ? "" : path;
  const esUrl = `${SITE_URL}${normalizedPath}`;
  const enUrl = `${SITE_URL}/en${normalizedPath}`;
  const canonical = locale === "en" ? enUrl : esUrl;

  const base: PageOpenGraph = {
    url: canonical,
    locale: locale === "en" ? "en_US" : "es_ES",
    alternateLocale: locale === "en" ? "es_ES" : "en_US",
    siteName: SITE_NAME,
    type: "website",
    images: [OG_IMAGE],
  };

  const hasCustomImages = Array.isArray(og?.images)
    ? og.images.length > 0
    : Boolean(og?.images);

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
      ...base,
      ...og,
      images: hasCustomImages ? og!.images : [OG_IMAGE],
    },
  };
}
