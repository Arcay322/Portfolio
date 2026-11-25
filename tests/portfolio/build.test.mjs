import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { JSDOM } = require('jsdom');
const root = path.resolve('dist');

async function files(dir) {
  return (
    await Promise.all(
      (await readdir(dir, { withFileTypes: true })).map((e) =>
        e.isDirectory() ? files(path.join(dir, e.name)) : [path.join(dir, e.name)]
      )
    )
  ).flat();
}

test('localized pages have working local links, assets, unique IDs and color-scheme support', async () => {
  for (const [rel, locale] of [
    ['index.html', 'es'],
    ['en/index.html', 'en'],
  ]) {
    const page = path.join(root, rel);
    const source = await readFile(page, 'utf8');
    const doc = new JSDOM(source).window.document;

    assert.equal(doc.documentElement.lang, locale);
    assert.equal(doc.querySelectorAll('h1').length, 1, rel);
    assert.equal(
      doc.querySelector('meta[name="color-scheme"]')?.getAttribute('content'),
      'light dark'
    );

    const ids = [...doc.querySelectorAll('[id]')].map((e) => e.id);
    assert.equal(new Set(ids).size, ids.length, `duplicate IDs: ${rel}`);

    for (const el of doc.querySelectorAll('[href], [src]')) {
      const ref = el.getAttribute('href') ?? el.getAttribute('src');
      if (!ref || /^(https?:|mailto:|tel:|data:)/.test(ref)) continue;
      if (ref.startsWith('#')) {
        assert.ok(doc.getElementById(ref.slice(1)), `missing anchor ${ref}: ${rel}`);
        continue;
      }
      const clean = decodeURI(ref.split('#')[0].split('?')[0]);
      const target = clean.startsWith('/')
        ? path.join(root, clean)
        : path.resolve(path.dirname(page), clean);
      const item = await stat(target).catch(() => null);
      assert.ok(item, `missing local resource ${ref}: ${rel}`);
    }
  }
});

test('production output contains the real CVs, artwork and no demos, server code or credentials', async () => {
  const all = await files(root);
  const names = all.map((f) => path.relative(root, f));

  assert.ok(names.includes('assets/cv/Arnie_Calderon_ES.pdf'));
  assert.ok(names.includes('assets/cv/Arnie_Calderon_EN.pdf'));
  assert.ok(names.includes('assets/images/hero-vista.webp'));
  assert.ok(names.includes('assets/images/sheikah-map-plate.webp'));
  assert.ok(names.includes('assets/styles.css'));
  assert.ok(names.includes('assets/app.js'));
  assert.equal(
    names.filter((f) =>
      /(^|\/)(demo|node_modules|api|\.git)(\/|$)|service.account|\.env|\.map$/.test(f)
    ).length,
    0
  );

  const appCode = await readFile(path.join(root, 'assets/app.js'), 'utf8');
  for (const match of appCode.matchAll(/\/assets\/[^"'\s`)]+/g)) {
    const assetPath = path.join(root, match[0]);
    await stat(assetPath);
  }
  assert.match(appCode, /IMPREX EUROPE/);
  assert.match(appCode, /5,5 millones/);
  assert.doesNotMatch(appCode, /Agente RAG|3\+ años|97%/);
});

test('search engines, error pages and CSP hashes match generated inline scripts', async () => {
  const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
  assert.match(sitemap, /https:\/\/www\.arcay\.dev\//);
  assert.match(sitemap, /https:\/\/www\.arcay\.dev\/en\//);

  const notFound = await readFile(path.join(root, '404.html'), 'utf8');
  assert.match(notFound, /noindex/);

  const config = JSON.parse(await readFile('firebase.json', 'utf8'));
  assert.equal(config.hosting.public, 'dist');
  assert.ok(
    !config.hosting.rewrites?.some((r) => r.source === '**'),
    'unknown URLs must return 404, not the homepage'
  );

  const csp = config.hosting.headers[0].headers.find(
    (h) => h.key === 'Content-Security-Policy'
  ).value;

  for (const rel of ['index.html', 'en/index.html', '404.html']) {
    const html = await readFile(path.join(root, rel), 'utf8');
    if (rel !== '404.html') {
      const doc = new JSDOM(html).window.document;
      assert.ok(doc.querySelector('link[rel="canonical"]'), rel);
      assert.equal(doc.querySelectorAll('link[rel="alternate"][hreflang]').length, 3, rel);
      assert.ok(doc.querySelector('meta[property="og:image"]'), rel);
    }
    for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      const [, attrs, body] = match;
      if (/\bsrc\s*=/i.test(attrs)) continue;
      const hash = `'sha256-${createHash('sha256').update(body).digest('base64')}'`;
      assert.ok(csp.includes(hash), `missing inline script CSP hash ${hash} for ${rel}`);
    }
  }
});
