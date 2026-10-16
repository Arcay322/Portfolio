import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
const { JSDOM } = createRequire(import.meta.url)('jsdom');
const script = await readFile('portfolio/client.js', 'utf8');
async function load(file, pathname) {
  const html = await readFile(`dist/${file}`, 'utf8');
  const dom = new JSDOM(html, {
    url: `https://portfolio.test/${pathname}`,
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });
  dom.window.matchMedia = () => ({ matches: false, addEventListener() {} });
  dom.window.scrollTo = () => {};
  return dom;
}
test('gallery wraps in both directions and keeps the original-image link in sync', async () => {
  const dom = await load('projects/ventify/index.html', 'projects/ventify/');
  dom.window.eval(script);
  const d = dom.window.document;
  const first = d.querySelector('[data-gallery-image]').getAttribute('src');
  d.querySelector('[data-gallery-prev]').click();
  assert.equal(d.querySelector('[data-gallery-status]').textContent, '3 / 3');
  assert.equal(
    d.querySelector('[data-gallery-link]').getAttribute('href'),
    'https://portfolio.test/images/projects/ventify/Ventify_3.webp'
  );
  d.querySelector('[data-gallery-next]').click();
  assert.equal(d.querySelector('[data-gallery-image]').getAttribute('src'), first);
  d.querySelector('[data-gallery-thumb="1"]').click();
  assert.equal(d.querySelector('[data-gallery-status]').textContent, '2 / 3');
  assert.equal(d.querySelectorAll('[data-gallery-thumb][aria-current="true"]').length, 1);
  dom.window.close();
});
test('mobile navigation announces state and Escape closes it with restored focus', async () => {
  const dom = await load('about/index.html', 'about/');
  dom.window.eval(script);
  const d = dom.window.document;
  const menu = d.getElementById('menu-toggle');
  menu.click();
  assert.equal(menu.getAttribute('aria-expanded'), 'true');
  d.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape' }));
  assert.equal(menu.getAttribute('aria-expanded'), 'false');
  assert.equal(d.activeElement, menu);
  dom.window.close();
});
test('reading-only entry never needs a WebGL context and keeps project URLs accessible', async () => {
  const dom = await load('index.html', '?view=reading');
  dom.window.eval(script);
  const d = dom.window.document;
  assert.ok(d.body.classList.contains('reading-mode'));
  assert.equal(d.getElementById('enable-world').hidden, false);
  assert.equal(d.querySelector('canvas'), null);
  assert.ok(d.querySelector('.reading-content a[href="/projects/imprex/"]'));
  dom.window.close();
});
test('motion toggle preserves icons and announces pause and resume in both languages', async () => {
  for (const [file, pathname, pause, resume] of [
    ['index.html', '?view=reading', 'Pausar movimiento ambiental', 'Activar movimiento ambiental'],
    ['en/index.html', 'en/?view=reading', 'Pause ambient motion', 'Enable ambient motion'],
  ]) {
    const dom = await load(file, pathname);
    try {
      dom.window.eval(script);
      const button = dom.window.document.getElementById('motion-toggle');
      button.click();
      assert.equal(button.getAttribute('aria-pressed'), 'true');
      assert.equal(button.getAttribute('aria-label'), resume);
      assert.equal(button.querySelectorAll('svg').length, 2);
      button.click();
      assert.equal(button.getAttribute('aria-pressed'), 'false');
      assert.equal(button.getAttribute('aria-label'), pause);
      assert.equal(button.querySelectorAll('svg').length, 2);
    } finally {
      dom.window.close();
    }
  }
});
test('copy email reports success and handles unavailable clipboard gracefully', async () => {
  const dom = await load('en/contact/index.html', 'en/contact/');
  let copied;
  Object.defineProperty(dom.window.navigator, 'clipboard', {
    configurable: true,
    value: {
      async writeText(value) {
        copied = value;
      },
    },
  });
  dom.window.eval(script);
  const d = dom.window.document;
  d.querySelector('[data-copy]').click();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(copied, 'arniecalderonayala@gmail.com');
  assert.equal(d.querySelector('.copy-status').textContent, 'Email copied');
  dom.window.navigator.clipboard.writeText = async () => {
    throw new Error('Permission denied');
  };
  d.querySelector('[data-copy]').click();
  await new Promise((resolve) => setImmediate(resolve));
  assert.match(d.querySelector('.copy-status').textContent, /Could not copy/);
  dom.window.close();
});
