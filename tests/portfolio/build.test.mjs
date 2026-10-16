import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat, readdir } from 'node:fs/promises';
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
test('project indexes separate featured work from secondary projects in both languages', async () => {
  for (const prefix of ['', 'en/']) {
    const dom = new JSDOM(await readFile(path.join(root, prefix, 'projects/index.html'), 'utf8'));
    const doc = dom.window.document;
    const primary = [...doc.querySelectorAll('.project-list .project-info h2 a')];
    assert.deepEqual(primary.map((a) => a.getAttribute('href')), [
      `/${prefix}projects/ventify/`, `/${prefix}projects/imprex/`,
      `/${prefix}projects/arcay3dlabs/`, `/${prefix}projects/jr-transportes/`,
    ]);
    const secondary = [...doc.querySelectorAll('.more-projects li a')];
    assert.deepEqual(secondary.map((a) => a.getAttribute('href')), [
      `/${prefix}projects/sumaq-uywa/`, `/${prefix}projects/ticket-world/`,
    ]);
    assert.equal(doc.getElementById('more-projects-title').textContent, prefix ? 'More projects' : 'Más proyectos');
    dom.window.close();
  }
});
test('localized pages have working local links, assets, unique IDs and one primary heading', async () => {
  const pages = (await files(root)).filter((p) => p.endsWith('.html'));
  assert.ok(
    pages.length >= 18,
    'home, projects, cases, about and contact must exist in both languages'
  );
  for (const page of pages) {
    const source = await readFile(page, 'utf8');
    const doc = new JSDOM(source).window.document;
    assert.equal(doc.querySelectorAll('h1').length, 1, page);
    assert.ok(['es', 'en'].includes(doc.documentElement.lang), page);
    const ids = [...doc.querySelectorAll('[id]')].map((e) => e.id);
    assert.equal(new Set(ids).size, ids.length, `duplicate IDs: ${page}`);
    for (const el of doc.querySelectorAll('[href], [src]')) {
      const ref = el.getAttribute('href') ?? el.getAttribute('src');
      if (!ref || /^(https?:|mailto:|tel:|data:)/.test(ref)) continue;
      if (ref.startsWith('#')) {
        assert.ok(doc.getElementById(ref.slice(1)), `missing anchor ${ref}: ${page}`);
        continue;
      }
      const clean = decodeURI(ref.split('#')[0].split('?')[0]);
      const target = clean.startsWith('/')
        ? path.join(root, clean)
        : path.resolve(path.dirname(page), clean);
      const item = await stat(target).catch(() => null);
      assert.ok(item, `missing local resource ${ref}: ${page}`);
      if (item.isDirectory()) await stat(path.join(target, 'index.html'));
    }
  }
});
test('production output contains the real CVs and no demos, server code or credentials', async () => {
  const all = await files(root);
  const names = all.map((f) => path.relative(root, f));
  assert.ok(names.some((f) => f.endsWith('Arnie_Calderon_ES.pdf')));
  assert.ok(names.some((f) => f.endsWith('Arnie_Calderon_EN.pdf')));
  assert.equal(
    names.filter((f) =>
      /(^|\/)(demo|node_modules|api|\.git)(\/|$)|service.account|\.env|\.map$/.test(f)
    ).length,
    0
  );
  const es = await readFile(path.join(root, 'index.html'), 'utf8');
  const en = await readFile(path.join(root, 'en/index.html'), 'utf8');
  assert.match(es, /IMPREX/);
  assert.match(es, /5,5/);
  assert.match(en, /Full-Stack Developer/);
  assert.doesNotMatch(es + en, /Agente RAG|3\+ años|97%/);
});
test('search engines and error pages have complete metadata without SPA catch-all', async () => {
  const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
  assert.match(sitemap, /\/en\/projects\/ventify\//);
  assert.match(await readFile(path.join(root, '404.html'), 'utf8'), /noindex/);
  for (const file of (await files(root)).filter(
    (p) => p.endsWith('.html') && !p.endsWith('404.html')
  )) {
    const doc = new JSDOM(await readFile(file, 'utf8')).window.document;
    assert.ok(doc.querySelector('link[rel="canonical"]'), file);
    assert.equal(doc.querySelectorAll('link[rel="alternate"][hreflang]').length, 3, file);
    assert.ok(doc.querySelector('meta[property="og:image"]'), file);
  }
  const config = JSON.parse(await readFile('firebase.json', 'utf8'));
  assert.equal(config.hosting.public, 'dist');
  assert.ok(
    !config.hosting.rewrites?.some((r) => r.source === '**'),
    'unknown URLs must return 404, not the homepage'
  );
});
