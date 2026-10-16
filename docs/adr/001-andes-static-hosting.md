# Portfolio andino: entrega estática para Firebase Hosting

## Contexto

Arnie aprobó la demo 3D con arquitectura andina e identidad personal y pidió
convertirla en el portfolio completo, con despliegue en Firebase. El proyecto
asignado es `portfolio-2242b`. El contenido del portfolio es público y editorial;
la escena no necesita acceder a datos privados ni ejecutar IA en producción.

## Decisión

El nuevo sitio se genera desde `portfolio/` mediante
`scripts/build-portfolio.mjs`. Produce HTML completo para cada idioma y ruta en
`dist/`, junto con fuentes, Three.js 0.180.0, imágenes revisadas y los CV actuales.
La escena es una mejora progresiva: las fichas enlazan a páginas reales, y el
modo lectura funciona sin WebGL o JavaScript. Las galerías conservan enlaces a
las imágenes originales sin JS.

Firebase Hosting sirve únicamente `dist/`. No se usa el SDK de cliente, SSR,
Firestore, Functions, servicios de IA ni credenciales para la página pública.
No hay catch-all de SPA: las rutas inexistentes devuelven un 404 real.

## Consecuencias

- `npm run dev`, `npm run build` y `npm start` se refieren al nuevo portfolio.
- El código Next.js anterior se conserva y se puede ejecutar con los comandos
  `dev:legacy`, `build:legacy` y `start:legacy`.
- La implementación nueva no usa el antiguo formulario de correo, newsletter,
  analítica ni service worker. Contacto se realiza mediante correo, WhatsApp,
  teléfono o perfiles profesionales.
- El worker raíz anterior se retira mediante un worker de migración y una
  comprobación del registro conocido en el cliente. No se borran caches ajenas.
- La URL canónica predeterminada es `https://portfolio-2242b.web.app`. Cuando
  se conecte el dominio propio, `SITE_URL` debe establecerse antes del build.
- No se despliega la primera demo ni el código interno del repositorio.

## Validación

Pruebas de artefactos, enlaces, metadatos, galería, copia de correo, navegación
móvil, modo lectura y configuración Hosting. Verificación HTTP mediante el
emulador oficial y revisión manual de escena, idiomas y páginas en navegador.

## Fuentes

- https://firebase.google.com/docs/hosting/full-config
- https://firebase.google.com/docs/hosting/test-preview-deploy
- https://threejs.org/docs/
