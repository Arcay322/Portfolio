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
npm run verify:portfolio   # ESLint, sintaxis, build y pruebas automatizadas
npm run test:hosting      # Integración con el emulador oficial de Firebase
npm run deploy:firebase   # Build + pruebas + despliegue de Hosting
```

Antes de publicar, iniciar sesión con `npx --yes firebase-tools@15.34.0 login`.
No hay credenciales en el código de la aplicación.

La guía completa para publicar, configurar el dominio y editar contenido está en
[docs/FIREBASE-HOSTING.md](docs/FIREBASE-HOSTING.md).

## Acceso y CV

La portada ofrece un acceso directo a proyectos y un modo lectura sin WebGL.
Con el foco en el paisaje o en sus controles, las flechas orientan la cámara,
`+` y `-` cambian la distancia e `Inicio` restaura la vista general. El resto de
la página conserva su navegación normal por teclado.

Los PDF públicos se regeneran con `python3 scripts/generate-portfolio-cvs.py`.
El script requiere ReportLab y las fuentes Liberation Serif instaladas en el
sistema. Después de actualizar datos, revisar ambos documentos antes de ejecutar
el build; este copia los PDF de `portfolio/assets/cv/`.

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
