import assert from 'node:assert/strict';

const origin = 'http://127.0.0.1:5000';
const checks = [
  '/',
  '/en/',
  '/assets/styles.css',
  '/assets/app.js',
  '/assets/images/hero-vista.webp',
  '/assets/images/sheikah-map-plate.webp',
  '/assets/cv/Arnie_Calderon_ES.pdf',
  '/assets/cv/Arnie_Calderon_EN.pdf',
  '/sitemap.xml',
];

for (const route of checks) {
  const response = await fetch(origin + route);
  assert.equal(response.status, 200, route);
  assert.match(response.headers.get('x-content-type-options') || '', /nosniff/, route);
}

const missing = await fetch(origin + '/this-page-does-not-exist/');
assert.equal(missing.status, 404);

const spanish = await fetch(origin + '/es/', { redirect: 'manual' });
assert.equal(spanish.status, 301);
assert.ok(spanish.headers.get('location').endsWith('/'));

const root = await fetch(origin);
assert.match(root.headers.get('content-security-policy'), /script-src 'self' 'sha256-/);

console.log(
  'Firebase Hosting verified: pages, assets, real 404, redirects, CVs and security headers.'
);
