import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const { JSDOM } = createRequire(import.meta.url)('jsdom');
const script = await readFile('portfolio/app.js', 'utf8');

async function load(file, pathname) {
  const html = await readFile(`dist/${file}`, 'utf8');
  const dom = new JSDOM(html, {
    url: `https://portfolio.test/${pathname}`,
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });
  dom.window.matchMedia = () => ({ matches: false, addEventListener() {} });
  dom.window.CSS = { supports: () => false };
  dom.window.scrollTo = () => {};
  return dom;
}

test('map pins update discovery progress, coordinates, and active readout', async () => {
  const dom = await load('index.html', '');
  dom.window.eval(script);
  const d = dom.window.document;

  assert.equal(d.getElementById('map-progress').textContent.trim(), '1 / 5 descubiertos');
  d.querySelector('[data-waypoint="imprex"]').click();
  assert.equal(d.getElementById('map-progress').textContent.trim(), '2 / 5 descubiertos');
  assert.equal(d.getElementById('map-hud-coords').textContent.trim(), "40°25'N 03°42'W · MADRID");
  assert.match(d.getElementById('readout-title').textContent, /IMPREX EUROPE/);
  assert.ok(d.querySelector('[data-waypoint="imprex"]').classList.contains('is-visited'));

  dom.window.close();
});

test('language toggle switches UI, map progress, and CV download hrefs', async () => {
  const dom = await load('index.html', '');
  dom.window.eval(script);
  const d = dom.window.document;

  d.getElementById('lang-toggle').click();
  assert.equal(d.documentElement.lang, 'en');
  assert.equal(d.getElementById('map-progress').textContent.trim(), '1 / 5 discovered');
  assert.equal(d.getElementById('header-cv-link').getAttribute('href'), '/assets/cv/Arnie_Calderon_EN.pdf');

  d.getElementById('lang-toggle').click();
  assert.equal(d.documentElement.lang, 'es');
  assert.equal(d.getElementById('header-cv-link').getAttribute('href'), '/assets/cv/Arnie_Calderon_ES.pdf');

  dom.window.close();
});

test('theme toggle persists color-scheme override on meta tag and localStorage', async () => {
  const dom = await load('index.html', '');
  dom.window.eval(script);
  const d = dom.window.document;
  const meta = d.querySelector('meta[name="color-scheme"]');

  assert.equal(meta.getAttribute('content'), 'light dark');
  d.getElementById('theme-toggle').click();
  assert.equal(meta.getAttribute('content'), 'dark');
  assert.equal(dom.window.localStorage.getItem('color-scheme'), 'dark');

  d.getElementById('theme-toggle').click();
  assert.equal(meta.getAttribute('content'), 'light dark');
  assert.equal(dom.window.localStorage.getItem('color-scheme'), null);

  dom.window.close();
});

test('copy email reports success and handles unavailable clipboard gracefully', async () => {
  const dom = await load('en/index.html', 'en/');
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

  d.getElementById('copy-email').click();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(copied, 'arniecalderonayala@gmail.com');
  assert.equal(d.getElementById('copy-status').textContent, 'Email copied');

  dom.window.navigator.clipboard.writeText = async () => {
    throw new Error('Permission denied');
  };
  d.getElementById('copy-email').click();
  await new Promise((resolve) => setImmediate(resolve));
  assert.match(d.getElementById('copy-status').textContent, /Could not copy/);

  dom.window.close();
});

test('AI recruiter chatbot opens, switches animated SVG states, and renders API replies', async () => {
  const dom = await load('index.html', '');
  dom.window.fetch = async () => ({
    ok: true,
    async json() {
      return { reply: 'Arnie desarrolló **Ventify** en Next.js y Firebase.', mode: 'live' };
    },
  });
  dom.window.eval(script);
  const d = dom.window.document;

  const launcher = d.getElementById('chat-launcher');
  const panel = d.getElementById('chat-panel');
  const avatar = d.getElementById('chat-header-avatar');

  assert.equal(panel.hidden, true);
  launcher.click();
  assert.equal(panel.hidden, false);
  assert.equal(avatar.getAttribute('src'), '/assets/avatar/arnie_greeting.svg');

  const firstPrompt = d.querySelector('.chat-prompt-chip');
  assert.ok(firstPrompt);
  firstPrompt.click();
  assert.equal(avatar.getAttribute('src'), '/assets/avatar/arnie_thinking.svg');

  await new Promise((resolve) => setImmediate(resolve));
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(avatar.getAttribute('src'), '/assets/avatar/arnie_talking.svg');
  assert.match(d.getElementById('chat-messages').textContent, /Ventify/);

  d.getElementById('chat-close').click();
  assert.equal(panel.hidden, true);

  dom.window.close();
});
