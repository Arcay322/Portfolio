import { mkdir, readFile, writeFile, cp, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const SEO = {
  es: {
    title: 'Arnie Calderón — Desarrollador Full-Stack',
    description:
      'Portfolio de Arnie Calderón, desarrollador Full-Stack en Lima. Productos SaaS en producción (Ventify), integración SAP (IMPREX EUROPE), Astro, Node.js y Python.',
    ogLocale: 'es_PE',
    jobTitle: 'Desarrollador Full-Stack',
  },
  en: {
    title: 'Arnie Calderón — Full-Stack Developer',
    description:
      'Portfolio of Arnie Calderón, Full-Stack Developer in Lima. Production SaaS products (Ventify), SAP integration (IMPREX EUROPE), Astro, Node.js, and Python.',
    ogLocale: 'en_US',
    jobTitle: 'Full-Stack Developer',
  },
};

function escapeAttr(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[ch]);
}

function buildSeoHead(locale, origin) {
  const s = SEO[locale];
  const canonical = `${origin}${locale === 'en' ? '/en/' : '/'}`;
  const structured = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Arnie Calderón',
    url: origin,
    jobTitle: s.jobTitle,
    sameAs: [
      'https://github.com/Arcay322',
      'https://www.linkedin.com/in/arniecalderonayala/',
    ],
  }).replace(/</g, '\\u003c');

  return [
    `<link rel="canonical" href="${canonical}" />`,
    `<link rel="alternate" hreflang="es" href="${origin}/" />`,
    `<link rel="alternate" hreflang="en" href="${origin}/en/" />`,
    `<link rel="alternate" hreflang="x-default" href="${origin}/" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeAttr(s.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(s.description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${origin}/assets/og-portfolio.jpg" />`,
    `<meta property="og:locale" content="${s.ogLocale}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<script type="application/ld+json">${structured}</script>`,
  ].join('\n    ');
}

function renderNotFound(origin) {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    <script>
      try {
        const saved = localStorage.getItem('color-scheme');
        if (saved === 'light' || saved === 'dark') {
          document.querySelector('meta[name="color-scheme"]').content = saved;
        }
      } catch {}
    </script>
    <title>404 · Arnie Calderón</title>
    <meta name="robots" content="noindex,follow" />
    <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="/assets/styles.css" />
  </head>
  <body>
    <main class="container" style="padding: 6rem 0;">
      <p class="tabular-meta">404</p>
      <h1 style="font-family: var(--font-display); font-size: clamp(2.2rem, 4vw, 3.2rem); margin: 0.4rem 0 0;">
        Este camino no lleva a ninguna parte.
      </h1>
      <div class="hyrule-rule hyrule-rule-left" aria-hidden="true"></div>
      <p style="margin: 1.2rem 0 1.6rem; color: var(--ink-muted); max-width: 48ch;">
        La página que buscas no existe o cambió de dirección.
      </p>
      <a class="btn-primary" href="${origin}/">Volver al inicio</a>
    </main>
  </body>
</html>
`;
}

function collectInlineScriptHashes(html, hashes) {
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const [, attrs, body] = match;
    if (/\bsrc\s*=/i.test(attrs)) continue;
    hashes.add(`'sha256-${createHash('sha256').update(body).digest('base64')}'`);
  }
}

export async function buildPortfolio() {
  const origin = (process.env.SITE_URL || 'https://www.arcay.dev').replace(/\/+$/, '');
  const parsed = new URL(origin);
  if (
    !['http:', 'https:'].includes(parsed.protocol) ||
    parsed.pathname !== '/' ||
    parsed.search ||
    parsed.hash ||
    parsed.username ||
    parsed.password
  ) {
    throw new Error(
      'SITE_URL must be a plain HTTP(S) origin without a path, query or credentials.'
    );
  }

  const out = path.join(root, 'dist');
  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });

  await cp(path.join(root, 'portfolio/assets'), path.join(out, 'assets'), { recursive: true });
  for (const name of ['styles.css', 'app.js']) {
    await cp(path.join(root, 'portfolio', name), path.join(out, 'assets', name));
  }

  const template = await readFile(path.join(root, 'portfolio/index.html'), 'utf8');
  const hashes = new Set();

  for (const locale of ['es', 'en']) {
    const s = SEO[locale];
    let html = template.replace('<!--SEO_HEAD-->', buildSeoHead(locale, origin));
    if (locale === 'en') {
      html = html
        .replace('<html lang="es">', '<html lang="en">')
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${s.title}</title>`)
        .replace(
          /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
          `<meta name="description" content="${escapeAttr(s.description)}" />`
        );
    }
    collectInlineScriptHashes(html, hashes);
    const targetDir = locale === 'en' ? path.join(out, 'en') : out;
    await mkdir(targetDir, { recursive: true });
    await writeFile(path.join(targetDir, 'index.html'), html);
  }

  const notFoundHtml = renderNotFound(origin);
  collectInlineScriptHashes(notFoundHtml, hashes);
  await writeFile(path.join(out, '404.html'), notFoundHtml);

  const urls = [`${origin}/`, `${origin}/en/`].map((u) => `<url><loc>${u}</loc></url>`).join('');
  await writeFile(
    path.join(out, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
  );
  await writeFile(
    path.join(out, 'robots.txt'),
    `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`
  );
  await writeFile(
    path.join(out, 'sw.js'),
    `// Retire any previous root-scoped service worker.\nself.addEventListener('install',()=>self.skipWaiting());\nself.addEventListener('activate',e=>e.waitUntil((async()=>{await self.clients.claim();await Promise.all(['static-v1','dynamic-v1','images-v1'].map(n=>caches.delete(n)));await self.registration.unregister();})()));\n`
  );

  const configPath = path.join(root, 'firebase.json');
  const firebase = JSON.parse(await readFile(configPath, 'utf8'));
  firebase.hosting.redirects = [
    { source: '/es', destination: '/', type: 301 },
    { source: '/es/', destination: '/', type: 301 },
    { source: '/projects', destination: '/#proyectos', type: 301 },
    { source: '/projects/', destination: '/#proyectos', type: 301 },
    { source: '/about', destination: '/#trayectoria', type: 301 },
    { source: '/about/', destination: '/#trayectoria', type: 301 },
    { source: '/contact', destination: '/#contacto', type: 301 },
    { source: '/contact/', destination: '/#contacto', type: 301 },
    { source: '/en/projects', destination: '/en/#proyectos', type: 301 },
    { source: '/en/projects/', destination: '/en/#proyectos', type: 301 },
    { source: '/en/about', destination: '/en/#trayectoria', type: 301 },
    { source: '/en/about/', destination: '/en/#trayectoria', type: 301 },
    { source: '/en/contact', destination: '/en/#contacto', type: 301 },
    { source: '/en/contact/', destination: '/en/#contacto', type: 301 },
  ];

  const csp = firebase.hosting.headers[0].headers.find((h) => h.key === 'Content-Security-Policy');
  csp.value = `default-src 'self'; script-src 'self' ${[...hashes].join(' ')}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'none'; upgrade-insecure-requests`;
  await writeFile(configPath, JSON.stringify(firebase, null, 2) + '\n');

  await stat(path.join(out, 'assets/og-portfolio.jpg'));
  console.log(`Built 2 localized pages + 404 → dist/ (${origin})`);
  return out;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await buildPortfolio();
}
