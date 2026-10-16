import { mkdir, readFile, writeFile, cp, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { projects, places } from '../portfolio/content.mjs';
import { renderPage, route } from '../portfolio/templates.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
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
  )
    throw new Error(
      'SITE_URL must be a plain HTTP(S) origin without a path, query or credentials.'
    );
  const out = path.join(root, 'dist');
  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });
  await cp(path.join(root, 'portfolio/assets'), path.join(out, 'assets'), { recursive: true });
  for (const name of ['portfolio.css', 'client.js', 'world.js'])
    await cp(path.join(root, 'portfolio', name), path.join(out, 'assets', name));
  await writeFile(
    path.join(out, 'assets/places.js'),
    `export const places = ${JSON.stringify(places)};\n`
  );
  // Only reviewed public images are shipped; demo files and application credentials are excluded.
  const images = new Set(projects.flatMap((p) => p.images));
  images.add('/images/profile/avatar.webp');
  for (const file of images) {
    const destination = path.join(out, file);
    await mkdir(path.dirname(destination), { recursive: true });
    await cp(path.join(root, 'public', file), destination);
  }
  const hashes = new Set();
  const pages = ['', 'projects', 'about', 'contact', ...projects.map((p) => `projects/${p.slug}`)];
  for (const locale of ['es', 'en']) {
    for (const page of pages) {
      const directory = path.join(out, route(locale, page));
      await mkdir(directory, { recursive: true });
      const html = renderPage({ locale, page, origin });
      await writeFile(path.join(directory, 'index.html'), html);
      const schema = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1];
      if (schema) hashes.add(`'sha256-${createHash('sha256').update(schema).digest('base64')}'`);
    }
  }
  await writeFile(path.join(out, '404.html'), renderPage({ locale: 'es', origin, is404: true }));
  const urls = ['es', 'en'].flatMap((locale) =>
    pages.map((page) => `<url><loc>${origin + route(locale, page)}</loc></url>`)
  );
  await writeFile(
    path.join(out, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`
  );
  await writeFile(
    path.join(out, 'robots.txt'),
    `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`
  );
  await writeFile(
    path.join(out, 'sw.js'),
    `// Retire the previous portfolio's root-scoped service worker.\nself.addEventListener('install',()=>self.skipWaiting());\nself.addEventListener('activate',e=>e.waitUntil((async()=>{await self.clients.claim();await Promise.all(['static-v1','dynamic-v1','images-v1'].map(n=>caches.delete(n)));await self.registration.unregister();})()));\n`
  );
  const configPath = path.join(root, 'firebase.json');
  const firebase = JSON.parse(await readFile(configPath, 'utf8'));
  firebase.hosting.redirects = [
    ...pages.flatMap((page) =>
      [false, true].map((slash) => ({
        source: '/es' + (page ? '/' + page : '') + (slash ? '/' : ''),
        destination: route('es', page),
        type: 301,
      }))
    ),
    ...firebase.hosting.redirects.filter((rule) => !rule.source?.startsWith('/es')),
  ];
  const csp = firebase.hosting.headers[0].headers.find((h) => h.key === 'Content-Security-Policy');
  csp.value = `default-src 'self'; script-src 'self' ${[...hashes].join(' ')}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'none'; upgrade-insecure-requests`;
  await writeFile(configPath, JSON.stringify(firebase, null, 2) + '\n');
  await stat(path.join(out, 'assets/og-portfolio.jpg'));
  console.log(`Built ${pages.length * 2} localized pages + 404 → dist/ (${origin})`);
  return out;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href)
  await buildPortfolio();
