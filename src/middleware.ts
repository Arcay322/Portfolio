import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: 'es',

  // Enable locale detection from cookies for persistence
  localeDetection: true,

  // Prefix strategy: 'as-needed' means Spanish won't have /es prefix
  localePrefix: 'as-needed',
});

export const config = {
  // Match only internationalized pathnames
  // Exclude: api routes, _next files, static files with extensions
  matcher: ['/', '/(es|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
