# Desplegar el portfolio en Firebase Hosting

El proyecto ya configurado es **portfolio-2242b**. La salida está en `dist/`.
Usa **Node.js 24** (ver `.nvmrc`). La CLI está fijada en la versión 15.34.0
en los comandos npm para que el flujo sea repetible.

## Revisar localmente

```sh
npm ci --legacy-peer-deps
npm run dev
```

Abrir http://127.0.0.1:3012. Los cambios en `portfolio/` regeneran las páginas;
recarga el navegador para verlos. Para verificar antes del despliegue:

```sh
npm run verify:portfolio
npm run test:hosting
```

La segunda orden inicia el emulador oficial de Hosting, comprueba las rutas,
redirecciones, PDFs y headers, y lo detiene. No publica nada ni necesita iniciar
sesión. Para dejar el emulador abierto usa `npm run emulate:firebase` después del
build; abre http://127.0.0.1:5000.

## Publicar

Inicia sesión con una cuenta que tenga acceso al proyecto:

```sh
npx --yes firebase-tools@15.34.0 login
npm run deploy:firebase
```

El comando de despliegue ejecuta automáticamente el build y las pruebas de la
salida antes de publicar Hosting. No ejecuta despliegues de Firestore, Storage
ni Functions. La dirección del sitio será:

https://portfolio-2242b.web.app

## Dominio propio

El dominio principal es `www.arcay.dev`. El build lo usa por defecto para los
metadatos; `arcay.dev` está configurado en Firebase para redirigir a `www.arcay.dev`.
Ambos dominios se añadieron al sitio `portfolio-2242b` el 16 de octubre de 2026.
Los siguientes registros se guardaron en el DNS avanzado de Spaceship:

| Tipo | Host | Valor |
| --- | --- | --- |
| A | `@` | `199.36.158.100` |
| CNAME | `www` | `portfolio-2242b.web.app.` |
| TXT | `@` | `hosting-site=portfolio-2242b` |

Se conservó el TXT `google-site-verification` existente. El A anterior era
`216.198.79.1` y el CNAME de `www` era
`4f1e18967cc4ebd0.vercel-dns-017.com.`; ambos apuntaban a Vercel. El TTL es de
30 minutos. Después de un cambio, revisar propagación DNS y certificado HTTPS
en Firebase Console → Hosting; guardar los registros no implica que la
validación del certificado haya terminado.

Para usar otro origen en un despliegue puntual:

```sh
SITE_URL=https://www.arcay.dev npm run deploy:firebase
```

`SITE_URL` debe ser solo un
origen HTTP(S), sin rutas ni parámetros. Define canonical, hreflang, sitemap,
Open Graph y datos estructurados. El build rechaza valores no válidos.

## Editar contenido

- `portfolio/content.mjs`: textos ES/EN, experiencia, proyectos y enlaces.
- `portfolio/templates.mjs`: estructura HTML de las páginas.
- `portfolio/portfolio.css`: diseño, responsive y modo lectura.
- `portfolio/client.js`: navegación, galería, portapapeles y ciclo de la escena.
- `portfolio/world.js`: cámara y escena Three.js.
- `portfolio/assets/cv/`: PDFs públicos actuales en español e inglés.
- `firebase.json`: cabeceras, caché, rutas y emulador.

El build completa los hashes CSP de los datos estructurados y los redirects
`/es/...` a partir de las páginas que genera. Por eso puede actualizar
`firebase.json` al cambiar el dominio canónico o las rutas.

No se necesita pegar claves Firebase ni service accounts en el sitio. La
configuración del SDK que se usó para identificar el proyecto no se distribuye.
Los canales de contacto abren sus aplicaciones respectivas; no hay un formulario
que prometa enviar correos sin un backend configurado.

La salida no incluye las demos, los archivos `.env`, fuentes del backend, módulos
npm ni documentos internos. Las fuentes tipográficas y Three.js se sirven desde
el propio Hosting, sin depender de CDNs externos en ejecución.

## Código anterior

La versión Next.js permanece en `src/`. Para consultarla:

```sh
npm run dev:legacy
npm run build:legacy
```

No uses esa salida para este despliegue. La configuración actual de Hosting
apunta exclusivamente al build estático nuevo.

Referencias: [configuración de Hosting](https://firebase.google.com/docs/hosting/full-config)
y [pruebas y despliegue](https://firebase.google.com/docs/hosting/test-preview-deploy).
