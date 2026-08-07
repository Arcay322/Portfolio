import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: 'es',

  // El idioma se persiste únicamente en la URL (/en). La detección por cookie
  // escribía NEXT_LOCALE en cada petición y Vercel no cachea respuestas que
  // setean cookies, forzando render serverless con cold start (~1-2s TTFB).
  // Con localeDetection y localeCookie desactivados, las páginas SSG se
  // sirven desde el CDN sin escribir cookies por request.
  localeDetection: false,
  localeCookie: false,

  // Prefix strategy: 'as-needed' means Spanish won't have /es prefix
  localePrefix: 'as-needed',
});

export const config = {
  // Match only internationalized pathnames
  // Exclude: api routes, _next files, static files with extensions
  matcher: ['/', '/(es|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
