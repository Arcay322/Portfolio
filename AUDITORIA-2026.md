# Auditoría Completa — arcay.dev (Portfolio)

**Fecha:** 7 de agosto de 2026
**Stack:** Next.js 15.4 · TypeScript · next-intl (es/en) · Tailwind · shadcn/ui · Firebase · Resend · framer-motion · Lenis

---

## Resumen Ejecutivo

| Área | Estado |
|---|---|
| Build (`next build`) | ✅ OK |
| Typecheck (`tsc --noEmit`) | ✅ OK |
| Lint (`next lint`) | ⚠️ 15 warnings, 0 errores |
| Tests Jest (`test:ci`) | ❌ No hay tests — "No tests found" |
| Tests E2E (Playwright) | ⚠️ Solo 1 spec (`e2e/portfolio.spec.ts`) |
| i18n es/en | ✅ 412 claves idénticas |
| Secretos hardcodeados | ✅ Limpio (.env gitignoreado) |

### Conteo de hallazgos

| Severidad | Cantidad |
|---|---|
| 🔴 CRÍTICA | 3 |
| 🟠 ALTA | 21 |
| 🟡 MEDIA | 27 |
| 🔵 BAJA | 15 |

---

## 🔴 CRÍTICOS

### C1. Canonical, og:url y hreflang rotos en todo el sitio
- **Archivo:** `src/app/[locale]/layout.tsx:49,71-75`
- **Problema:** El canonical y `og:url` están hardcodeados a `https://arcay.dev` (home ES) en el layout raíz. Todas las páginas (`/about`, `/en/*`, `/projects/ventify`, etc.) se autocanonicalizan a la home ES. Los `alternates.languages` (`es: '/', en: '/en'`) se heredan a todas las rutas, así que en `/about` el hreflang apunta a las homes. No existe `x-default`.
- **Impacto:** Señal masiva de contenido duplicado. Para `/en` el canonical apunta a la versión ES.
- **Recomendación:** Generar canonical/og:url/hreflang por ruta real con locale y slug. Añadir `'x-default': '/'`.

### C2. Galería de proyectos inoperable con teclado
- **Archivo:** `src/components/projects/ProjectGallery.tsx:61-87`
- **Problema:** La grid son `<div onClick={() => setSelectedIndex(index)}>` sin `role="button"`, `tabIndex` ni `onKeyDown`. Un usuario de solo teclado no puede abrir ninguna imagen.
- **Estándar:** WCAG 2.1.1 (Keyboard).
- **Recomendación:** Convertir a `<button>` o añadir `role="button"`, `tabIndex={0}` y manejo de Enter/Espacio.

### C3. Home es un client component (LCP + SEO)
- **Archivo:** `src/app/[locale]/page.tsx:1`
- **Problema:** Al ser `"use client"`, no puede exportar metadata. El `<h1>` "Arnie Calderon" (candidato LCP) se renderiza vacío en SSR porque lo controla `Typewriter` (`Typewriter.tsx:22`, estado inicial `''`).
- **Impacto:** La home hereda la metadata genérica del layout y los crawlers sin renderizado JS no ven el heading principal.
- **Recomendación:** Convertir a server component; mover el Typewriter (o su texto final) a un hijo cliente, renderizando el texto completo en SSR o en un `<span>` sr-only.

---

## 🟠 ALTOS

### Seguridad

#### S1. Sin rate limiting server-side en el formulario de contacto
- **Archivo:** `src/app/[locale]/contact/actions.ts:43-48`
- **Problema:** El comentario dice "Rate limiting básico" pero solo hace `console.log` de la IP. No se aplica ningún límite. Spam/agotamiento de cuota de Resend.
- **Recomendación:** Aplicar `withRateLimit`/`contactFormLimiter` (ya implementados en `src/lib/rate-limiter.ts:88`) dentro de `submitContactForm`.
- ✅ **Corregido:** `contactFormLimiter.check(getClientIdentifier(headersList))` en `actions.ts:21` con respuesta de rate limit.

#### S2. Los rate limiters definidos nunca se usan en las API routes
- **Archivo:** `src/lib/rate-limiter.ts:88-96,129-158` — sin uso en `src/app/api/analytics/*` ni `src/app/api/newsletter/subscribe/route.ts`
- **Problema:** `contactFormLimiter`, `apiLimiter` y `withRateLimit` existen pero ninguna ruta los importa. Los 4 endpoints POST/DELETE son públicos e ilimitados.
- **Recomendación:** Envolver cada handler con `withRateLimit(request, apiLimiter)` y responder 429.
- ✅ **Corregido:** `withRateLimit(request, apiLimiter)` en las 3 rutas de analytics y en POST/DELETE de newsletter; 429 con `Retry-After`.

#### S3. HTML injection en el cuerpo del email
- **Archivo:** `src/ai/flows/send-contact-email-flow.ts:33-36`
- **Problema:** El HTML del email se construye por interpolación directa (`${validatedInput.name}`, `${validatedInput.message}`) sin escapar. El flujo re-valida con Zod pero no re-sanitiza.
- **Recomendación:** Escapar el HTML en el propio flujo (defensa en profundidad), no confiar en el caller.
- ✅ **Corregido:** `escapeHtml()` aplicado a name/email/message en el HTML del email (`send-contact-email-flow.ts:36`).

#### S4. Rate limiter basado en `x-forwarded-for` spoofeable
- **Archivo:** `src/lib/rate-limiter.ts:101-111`; `actions.ts:45`
- **Problema:** Toma el primer valor de `x-forwarded-for`, que el cliente controla. Permite rotar la identidad y bypasear el límite.
- **Recomendación:** Usar `x-real-ip` o el último valor de la cadena; o rate limiting en edge (Vercel WAF/Upstash).
- ✅ **Corregido:** `getClientIp()` prefiere `x-real-ip` y, si solo hay `x-forwarded-for`, toma el ÚLTIMO valor de la cadena (`rate-limiter.ts:105-117`).

#### S5. Endpoints de analytics sin validación ni límite de tamaño
- **Archivo:** `src/app/api/analytics/error/route.ts:6`, `performance/route.ts:6`, `vitals/route.ts:6`
- **Problema:** `request.json()` sin schema Zod ni límite de body → DoS de memoria y log injection.
- **Adicional:** `src/lib/error-tracking.ts:264,266` envía a `/api/analytics/errors` (plural), ruta que **no existe** — los errores se pierden silenciosamente.
- **Recomendación:** Validar con Zod, limitar tamaño del body, aplicar rate limiting y corregir la URL del endpoint.
- ✅ **Corregido:** Schemas Zod (`analyticsErrorSchema`, `analyticsPerformanceSchema`, `analyticsVitalsSchema`) + límite 64KB en `src/lib/api-validation.ts`; aplicado en las 3 rutas (400/413). URL corregida a `/api/analytics/error` en `error-tracking.ts`.

#### S6. Sin validación de Origin/Referrer en ninguna API route
- **Archivo:** Todas las rutas `src/app/api/**` y `actions.ts`
- **Problema:** Ninguna valida `Origin`/`Referer`; el middleware excluye explícitamente `/api`.
- **Recomendación:** Validar `Origin` contra `https://arcay.dev` en rutas sensibles (newsletter, contacto) y rechazar 403.
- ✅ **Corregido:** `isValidOrigin()` en `rate-limiter.ts:251` aplicado a newsletter, las 3 rutas de analytics y `submitContactForm` (403).

### Accesibilidad

#### A1. Modales sin `role="dialog"`, focus trap ni Escape
- **Archivo:** `src/components/SearchBar.tsx:185-321` (modal de búsqueda); `src/components/Header.tsx:155-187` (menú móvil); `src/components/ShareButtons.tsx:69-135` (popup)
- **Problema:** Overlays custom sin `role="dialog"`, `aria-modal`, `aria-label` ni focus trap. El foco se escapa al fondo de la página y no se restaura al trigger.
- **Nota:** `useFocusTrap` ya existe en `src/lib/keyboard-navigation.ts:127` pero **nunca se usa** (0 usos en el repo).
- **Recomendación:** Usar los componentes Radix (`Sheet`, `Dialog`) ya importados o aplicar `useFocusTrap` + `role="dialog"` + `aria-modal` + Escape.
- ✅ **Corregido:** `SearchBar` con `role="dialog"`/`aria-modal`/`aria-label` + `useFocusTrap` (foco restaurado al cerrar). `ShareButtons` popup con `role="dialog"` + `useFocusTrap` + Escape. Menú móvil de Header con Escape y `aria-label` (trigger ya tenía `aria-expanded`).

#### A2. Inputs sin `<label>` ni `aria-label`
- **Archivo:** `src/components/SearchBar.tsx:198-206`, `src/app/[locale]/projects/page.tsx:123-128`, `src/components/NewsletterSubscription.tsx:72-79`
- **Problema:** Solo placeholder → fallo WCAG 1.3.1 / 4.1.2.
- **Recomendación:** Añadir `aria-label` o `<label htmlFor>`.
- ✅ **Corregido:** `aria-label` en input de búsqueda (SearchBar), input de búsqueda de proyectos y email del newsletter.

#### A3. Botones solo-icono sin `aria-label`
- **Archivo:** `ImageCarousel.tsx:102-136`, `ProjectGallery.tsx:97-103,125-131`, `MediaViewer.tsx:87-94,222-252`, `ThemeToggle.tsx:30-35` (fallback SSR), `projects/page.tsx:130-136` (botón limpiar búsqueda), `Testimonials.tsx:108-139`
- **Recomendación:** `aria-label` traducido en todos.
- ✅ **Corregido:** `aria-label` en flechas prev/next y fullscreen de `ImageCarousel`, fullscreen/thumbnails/play/pausa/mute de `MediaViewer`, ThemeToggle SSR, botón limpiar de projects y flechas de Testimonials. (ProjectGallery ya corregido en C2.)

#### A4. Controles invisibles al foco (`opacity-0 group-hover`)
- **Archivo:** `ImageCarousel.tsx:102-136`, `MediaViewer.tsx:220-254`, `ProjectGallery.tsx:78`
- **Problema:** `opacity-0 group-hover:opacity-100` sin `focus:opacity-100` → invisibles al tabular.
- **Recomendación:** Añadir `focus:opacity-100` y `focus-visible:ring`.
- ✅ **Corregido:** `focus:opacity-100` + `focus-visible:ring` en ImageCarousel y MediaViewer; overlay de controles de video con `focus-within:opacity-100`.

#### A5. Cero soporte `prefers-reduced-motion`
- **Problema:** grep en `src` y CSS: 0 resultados. Typewriter, ParticlesBackground, StatsCounter, cursor `animate-pulse`, `animate-bounce`, Lenis, framer-motion — todo ignora WCAG 2.3.3.
- **Recomendación:** `MotionConfig reducedMotion="user"`, media query CSS global y condicionar Lenis.
- ✅ **Corregido:** `MotionConfig reducedMotion="user"` en nuevo `MotionProvider` (layout). Media query global en `globals.css`. Lenis desactivado con reduced-motion. ParticlesBackground renderiza frame estático. StatsCounter muestra valor final. (Typewriter ya lo tenía de C3.)

#### A6. Dialogs de fullscreen sin `DialogTitle`
- **Archivo:** `ImageCarousel.tsx:128-147`, `ProjectGallery.tsx:91`, `MediaViewer.tsx:85-127`
- **Problema:** Sin nombre accesible.
- **Recomendación:** `DialogTitle` sr-only.
- ✅ **Corregido:** `DialogTitle` sr-only con `alt` del media en ImageCarousel y MediaViewer. (ProjectGallery ya corregido en C2.)

#### A7. Typewriter reescribe el H1 carácter a carácter
- **Archivo:** `src/components/Typewriter.tsx:27-73`
- **Problema:** El lector de pantalla lee texto parcial/cambiante; sin pausa para el usuario (WCAG 2.2.2) ni reduced-motion.
- **Recomendación:** Texto final completo en `span` sr-only, animación decorativa con `aria-hidden`.
- ✅ **Corregido (en C3):** Texto completo en `span sr-only`, animación `aria-hidden`, soporte `prefers-reduced-motion`.
- **Extra:** Se corrigió clave i18n faltante `blog.read_more` (es/en) que producía `MISSING_MESSAGE` en `/blog`.

### SEO

#### E1. `/about`, `/projects`, `/contact` sin metadata propia
- **Archivo:** `src/app/[locale]/about/page.tsx:1`, `projects/page.tsx:1`, `contact/page.tsx` (todos `"use client"`)
- **Problema:** Heredan el title/description del layout ("Arnie Calderon - Portafolio"). Duplicación de meta tags.
- **Recomendación:** Convertir a server components con `generateMetadata` y `getTranslations`.

#### E2. Detalle de proyecto sin `generateMetadata`
- **Archivo:** `src/app/[locale]/projects/[slug]/page.tsx`
- **Problema:** La página de mayor valor SEO del portafolio hereda el título genérico.
- **Recomendación:** `generateMetadata` con título del proyecto + marca, description, canonical y og:url con locale/slug.

#### E3. Metadata de blog/FAQ/changelog hardcodeada en español para `/en`
- **Archivo:** `src/app/[locale]/blog/page.tsx:8-15`, `faq/page.tsx:12-15`, `changelog/page.tsx:4-7`
- **Problema:** `/en/blog`, `/en/faq`, `/en/changelog` muestran títulos en español. El blog no tiene canonical ni og:url.
- **Recomendación:** `generateMetadata` con `getTranslations`.

#### E4. JSON-LD inyectado con `next/script`
- **Archivo:** `src/components/JsonLd.tsx:13-18`
- **Problema:** Google a menudo no parsea structured data con `next/script`.
- **Recomendación:** `<script type="application/ld+json" dangerouslySetInnerHTML>` plano, en server components.

#### E5. JSON-LD con URLs relativas y `url` apuntando a sitios externos
- **Archivo:** `src/lib/schema.ts:56-70` (`generateProjectSchema`)
- **Problema:** `image` relativa (`/images/...`) → inválida en JSON-LD. `url` apunta al demo externo en vez de la página del proyecto.
- **Recomendación:** Resolver a absolutas y usar `url` = página arcay.dev + `sameAs` para externos.

#### E6. Sitemap desactualizado y robots.txt sin Sitemap
- **Archivo:** `public/sitemap.xml` (Oct 2025, sin URLs `/en`), `public/robots.txt` (sin directiva `Sitemap`)
- **Problema:** `next-sitemap.config.js` no define `locales`/`alternateRefs`; con `localePrefix: 'as-needed'` las rutas ES sin prefijo podrían quedar fuera del sitemap.
- **Recomendación:** Configurar `locales: ['es','en']`, `defaultLocale: 'es'`, `alternateRefs` y verificar el sitemap tras `next build && next-sitemap`.

#### E7. Links a `/blog/tag/*` que devuelven 404
- **Archivo:** `src/app/[locale]/blog/page.tsx:46`, `blog/[slug]/page.tsx:82`
- **Problema:** Se enlaza a tags pero no existe la ruta `blog/tag/[tag]`.
- **Recomendación:** Crear la ruta o eliminar los enlaces.

#### E8. RSS con fallback localhost e inconsistencia de env vars
- **Archivo:** `src/app/rss.xml/route.ts:4`, `src/lib/blog.ts:189`
- **Problema:** Fallback a `http://localhost:3000`; tres nombres de variable (`SITE_URL`, `NEXT_PUBLIC_SITE_URL`) inconsistente con `next-sitemap.config.js`.
- **Recomendación:** Unificar una sola variable y fallback a `https://arcay.dev`.

#### E9. Sin FAQPage ni Article/BlogPosting schema
- **Archivo:** `src/app/[locale]/faq/page.tsx`, `blog/[slug]/page.tsx`
- **Problema:** Oportunidades perdidas de rich results.
- **Recomendación:** `generateFaqSchema` y `generateArticleSchema`.

#### E10. Página changelog indexable y en el sitemap
- **Archivo:** `src/app/[locale]/changelog/page.tsx`, `public/sitemap.xml:3`
- **Problema:** Contenido de bajo valor indexable.
- **Recomendación:** `robots: { index: false }` y excluir del sitemap.

---

## 🟡 MEDIOS

### Rendimiento

#### P1. ParticlesBackground fullscreen 60fps en todas las páginas
- **Archivo:** `src/components/ParticlesBackground.tsx:74-120`
- **Problema:** Canvas `fixed inset-0` con `requestAnimationFrame` + O(n²) conexión de partículas + listener `mousemove`, activo en toda la web, incluso móvil. Sin reduced-motion.
- **Recomendación:** Desactivar en móvil / con `prefers-reduced-motion` / o bajo carga.

#### P2. SmoothScroll/Lenis sin reduced-motion y scroll brusco
- **Archivo:** `src/components/SmoothScroll.tsx:11-31`
- **Problema:** Lenis activo siempre; `window.scrollTo(0,0)` brusco en cada navegación.
- **Recomendación:** Inicializar condicional con `matchMedia('(prefers-reduced-motion: reduce)')`.

#### P3. Middleware pesado (68 kB)
- **Archivo:** `src/middleware.ts` (next-intl)
- **Problema:** Corre en cada request.
- **Recomendación:** Mantener matcher mínimo (ya es aceptable); monitorizar.

#### P4. First Load JS elevado
- **Proyecto:** 215 kB (`/projects`), ~198 kB (home/contact), 102 kB shared.
- **Recomendación:** Convertir páginas a server components, aplicar `dynamic` a AnalyticsDashboard/componentes pesados, verificar con `ANALYZE=true npm run build`.

### Seguridad

#### P5. CSP con `'unsafe-inline' 'unsafe-eval'` en script-src
- **Archivo:** `next.config.ts:90`
- **Problema:** Debilita la protección XSS; combinado con `dangerouslyAllowSVG: true` (`:22`).
- **Recomendación:** Eliminar en lo posible y valorar `dangerouslyAllowSVG: false`.

#### P6. Logs con PII sin redacción
- **Archivo:** `src/app/api/newsletter/subscribe/route.ts:46` (email), `contact/actions.ts:48` (IP), `api/analytics/error/route.ts:10-16` (stacks/URLs)
- **Nota:** `sanitizeForLog` existe en `src/lib/sanitization.ts:238` pero no se usa.
- **Recomendación:** Aplicarlo en todos los puntos de log.

#### P7. `checkDuplicateSubmission` y subscribers en memoria
- **Archivo:** `src/lib/sanitization.ts:252-276`, `src/app/api/newsletter/subscribe/route.ts:12`
- **Problema:** Estado en memoria se resetea entre instancias serverless. Newsletter es un stub (sin DB ni email service real).
- **Recomendación:** Persistir (Upstash/Redis/DB) o integrar un servicio real (Mailchimp/Resend).

#### P8. Newsletter DELETE sin autenticación
- **Archivo:** `src/app/api/newsletter/subscribe/route.ts:72-101`
- **Problema:** Cualquier persona desuscribe a un tercero; oráculo de emails registrados.
- **Recomendación:** Tokens firmados (HMAC) por email + DB real.

### Accesibilidad

#### P9. Contraste débil en texto pequeño
- **Archivo:** `contact-form.tsx:285` (`text-muted-foreground/60` text-xs), `Footer.tsx:47` (`/60`)
- **Recomendación:** Subir opacidad a sólido o ≥ 4.5:1.

#### P10. Gradientes de texto `to-foreground/70` en headings
- **Archivo:** `ProjectSpotlight.tsx:65`, `ProjectCard.tsx:97`, `contact/page.tsx:52`, `about/page.tsx:91`
- **Recomendación:** Verificar contraste; usar `/85` o más.

#### P11. Indicadores de estado sin `aria-live`/`role="status"`
- **Archivo:** `InfiniteScroll.tsx:83-92`, `NewsletterSubscription.tsx:91-106`
- **Recomendación:** `role="status"`/`role="alert"`.

#### P12. Autoplay sin pausa (WCAG 2.2.2)
- **Archivo:** `ImageCarousel.tsx:50-58`, `MediaViewer.tsx:207-217`, `ProjectGallery.tsx:108-113`
- **Recomendación:** Botón pause/play visible y pausa en hover/focus.

#### P13. Listeners globales de teclado que secuestran flechas
- **Archivo:** `ImageCarousel.tsx:66-79` (ArrowLeft/Right en window)
- **Recomendación:** Limitar al `onKeyDown` del contenedor con foco.

#### P14. Tooltip no focusable
- **Archivo:** `SkillBars.tsx:143-157`
- **Recomendación:** Trigger focusable (button/tabIndex).

#### P15. StatsCounter sin valor accesible
- **Archivo:** `StatsCounter.tsx:18-53`
- **Recomendación:** `aria-hidden` en la animación + valor final sr-only.

#### P16. aria-labels/traducciones hardcodeadas
- **Archivo:** `Header.tsx:83` ("Navegación principal" en EN), `LanguageSwitcher.tsx:51`, `ScrollToTop.tsx:46`, `ThemeToggle.tsx:43`, `Breadcrumbs.tsx:25`
- **Recomendación:** Mover a `messages/*.json`.

#### P17. Resultados de búsqueda sin semántica combobox
- **Archivo:** `SearchBar.tsx:260-292` — sin `role="listbox"`/`aria-activedescendant`; contador sin `aria-live`.
- **Recomendación:** Implementar patrón combobox accesible.

### SEO

#### P18. `og:locale` no normalizado
- **Archivo:** `layout.tsx:59` — emite `es`/`en` en vez de `es_ES`/`en_US`; sin `og:locale:alternate`.
- **Recomendación:** Mapear a formato correcto.

#### P19. Twitter card incompleta
- **Archivo:** `layout.tsx:62-68` — sin `twitter.site`; blog hereda la card de la home.
- **Recomendación:** Añadir `twitter.site` y cards coherentes.

#### P20. `generateMetadata` de blog post sin canonical/og:url
- **Archivo:** `blog/[slug]/page.tsx:32-49`
- **Recomendación:** Añadir canonical/hreflang/og:url con locale y slug.

#### P21. WebSite schema con SearchAction engañoso
- **Archivo:** `src/lib/schema.ts:40-44` — apunta a filtro client-side de proyectos.
- **Recomendación:** Eliminar o crear ruta de resultados server-side.

#### P22. `keywords` en español para `/en`
- **Archivo:** `layout.tsx:45` — traducir o eliminar.

#### P23. Avatar de `/about` sin `priority` (LCP)
- **Archivo:** `about/page.tsx:82-86`

#### P24. RSS con `language=es` fijo y sin `<link rel="alternate">`
- **Archivo:** `src/lib/blog.ts:210`, layout
- **Recomendación:** Declarar idioma correcto y añadir link alternate en el head.

#### P25. H1 de la home vacío en SSR
- **Archivo:** `Typewriter.tsx:64` — (ver C3/A7). Incluir texto completo en SSR.

---

## 🔵 BAJOS

1. **Warnings de lint (15):**
   - Imports sin usar: `layout.tsx:15` (PrefetchRoutes, IMPORTANT_ROUTES), `projects/[slug]/page.tsx:3` (Badge), `DownloadCVButton.tsx:13` (isDownloading/setIsDownloading), `Header.tsx:9` (Sheet*), `SkillBars.tsx:6` (Brain).
   - `<img>` sin `next/image`: `ImageCarousel.tsx:91,140,197`, `ProjectGallery.tsx:115`.
2. **`useFocusTrap` definido y nunca usado** — `src/lib/keyboard-navigation.ts:127`.
3. **Imports Radix Sheet sin usar** — `Header.tsx:9`.
4. **Lockfile duplicado** — `/home/arcay/package-lock.json` (84 B) causa warning de `outputFileTracingRoot` en build. Setear `outputFileTracingRoot` o eliminar el lockfile.
5. **ESLint 9 con config legacy** — `.eslintrc.json` (deprecated en v9); migrar a `eslint.config.mjs`.
6. **Sitemap con `lastmod`/`changefreq` uniformes** — poco informativo.
7. **RSS sin `<enclosure>`/`content:encoded`** — `src/lib/blog.ts:187-201`.
8. **`og:image` en bucket externo** (`storage.googleapis.com/ticket_world_media/...`) — mover a `/images/og/`.
9. **remotePatterns demasiado amplio** — `next.config.ts:34-38` permite cualquier path de `storage.googleapis.com`; restringir a `/ticket_world_media/**`.
10. **`dangerouslySetInnerHTML` para GA** — `layout.tsx:107-116`; validar formato del GA ID.
11. **Service worker cachea `/api/*`** — `public/sw.js:96-99`; excluir endpoints autenticados.
12. **Log de IP en server action** — `contact/actions.ts:48` (GDPR).
13. **`validateSecurity` regex bypasseable** — `sanitization.ts:178-233`; mantener solo como defensa en profundidad.
14. **Iconos decorativos sin `aria-hidden`** — `Breadcrumbs.tsx:38`, `ShareButtons.tsx:89-116`, `projects/page.tsx:148`.
15. **Animaciones `animate-pulse`/`animate-bounce` sin `motion-reduce`** — `ScrollToTop`, `ProjectHero:85`, `Typewriter:71`, `contact-form:198`.

---

## ✅ Lo que está bien (no revertir)

- **i18n completa:** 412/412 claves en es/en; `<html lang>` dinámico correcto.
- **Headers de seguridad:** CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy en `next.config.ts`.
- **Formulario de contacto:** Zod + sanitización + honeypot + `validateSecurity`.
- **Sin secretos:** `.env*` gitignoreado, sin keys hardcodeadas.
- **Skip link funcional** y `main tabIndex={-1}` correcto (`Header.tsx:53-58`, `layout.tsx:151`).
- **FAQ con Accordion Radix** (accesible).
- **`metadataBase` definido**, OG image con dimensiones, `priority` correcto en imágenes LCP (ProjectHero, featured home, featured blog).
- **`generateStaticParams`** para locales y proyectos.
- **Un solo `<h1>` por página** en todas las rutas.

---

## Orden de prioridad sugerido

1. **C1** — Canonical/og:url/hreflang por ruta (afecta todo el sitio).
2. **S1–S6** — Rate limiting server-side real (contacto, newsletter, analytics) + escapar HTML del email + validar Origin.
3. **C2 + A1–A6** — Accesibilidad: teclado en galería, dialogs/focus trap, labels, aria-labels, reduced-motion.
4. **C3 + P4** — Convertir home/about/projects/contact a server components con metadata propia.
5. **E1–E10** — Metadata por página, sitemap/robots/RSS, schema, fix tags 404.
6. **P1–P3** — Reducir coste de ParticlesBackground/SmoothScroll.
7. Bajos cuando se toque cada archivo.

---

## ✅ Re-medición en producción (7 ago 2026, tras fixes)

Verificación manual en `www.arcay.dev` de los hallazgos del analizador externo y la auditoría:

| Check | Resultado |
|---|---|
| `og:image` | ✅ `https://www.arcay.dev/images/og/og-default.png` (local, 1200x630, HTTP 200) en todas las páginas |
| `canonical` | ✅ Por ruta: `/`→arcay.dev, `/en`→arcay.dev/en, `/about`→/about (verificado home y /en) |
| `hreflang` | ✅ `es` + `en` + `x-default` correctos por ruta |
| `og:locale` | ✅ `es_ES` / `en_US` con `og:locale:alternate` |
| `twitter` card | ✅ `summary_large_image` + `twitter:site/@arcaydev` |
| Favicons/PWA | ✅ favicon.ico/svg/16/32 + apple-touch-icon + `site.webmanifest` |
| `theme-color` | ✅ light (#ffffff) y dark (#0b0f1a) con media |
| Cache (TTFB) | ✅ Home `/` → `x-vercel-cache: HIT`, TTFB ~0.45s (antes ~1.4s). `/en`, `/about`, `/projects`, `/faq`, `/changelog`, `/blog` → HIT/PRERENDER |
| Home estática | ✅ `es.html`/`en.html` prerendered (SSG) — antes dinámica por `NEXT_LOCALE` cookie + `getLocale()` sin `setRequestLocale` |
| HTML size | ⚠️ ~133 kB home (reportado 126 kB externo) — en el mismo orden, informativo |

### Hallazgos externos verificados como resueltos
- **og:image roto (bucket `storage.googleapis.com`)** → self-hosted en `/images/og/og-default.png`; bucket eliminado del código y de `remotePatterns`.
- **Canonical/og:url hardcodeado a la home** → generado por ruta en `src/lib/metadata.ts` (`buildPageMetadata`).
- **favicons/PWA ausentes** → añadidos todos los tamaños + manifest + theme-color.
- **TTFB alto por cookie no cacheable** → `localeDetection: false` + `localeCookie: false` en middleware + `setRequestLocale` en todas las páginas.

### Causa raíz del TTFB (resuelta)
1. next-intl escribía `NEXT_LOCALE` (set-cookie) en cada request → Vercel no cachea respuestas con cookies.
2. `getLocale()`/`getTranslations()` sin locale explícito leen `next/headers` → digest `DYNAMIC_SERVER_USAGE`, forzando render serverless con cold start.
3. Fix: `setRequestLocale(locale)` + `params.locale` explícito en `generateMetadata` de todas las páginas (commits `9a2ae8a` y `7e56819`).
