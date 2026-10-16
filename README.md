# Arnie Calderón — Entre piedra y código

Portfolio personal con un paisaje andino en Three.js, páginas de proyectos,
experiencia, contacto y CV en español e inglés. Listo para Firebase Hosting
en el proyecto **portfolio-2242b**.

## Desarrollo

Node.js 24 (ver `.nvmrc`).

```sh
npm ci --legacy-peer-deps
npm run dev
```

Abrir **http://127.0.0.1:3012**. La escena es una mejora progresiva del contenido:
se puede navegar en modo lectura o sin WebGL. El sitio final es estático.

```sh
npm run verify:portfolio   # ESLint, sintaxis, build y 7 pruebas automatizadas
npm run test:hosting      # Integración con el emulador oficial de Firebase
npm run deploy:firebase   # Build + pruebas + despliegue de Hosting
```

Antes de publicar, iniciar sesión con `npx --yes firebase-tools@15.34.0 login`.
No hay credenciales en el código de la aplicación.

La guía completa para publicar, configurar el dominio y editar contenido está en
[docs/FIREBASE-HOSTING.md](docs/FIREBASE-HOSTING.md).

## Estructura

- `portfolio/`: contenido ES/EN, HTML, CSS y JavaScript del sitio nuevo.
- `portfolio/assets/`: fuentes, librerías locales y PDFs actuales.
- `public/images/`: imágenes existentes que el build copia según cada proyecto.
- `dist/`: salida generada y única carpeta publicada (ignorada por Git).
- `tests/portfolio/`: pruebas de recursos, metadatos e interacciones.

[Decisión de arquitectura](docs/adr/001-andes-static-hosting.md).
[Identidad visual](DESIGN.md). [Contexto del producto](PRODUCT.md).

El código Next.js anterior se conserva en `src/`, con los comandos `dev:legacy`,
`build:legacy` y `start:legacy`. Su README anterior está en
[docs/legacy-nextjs-readme.md](docs/legacy-nextjs-readme.md).
