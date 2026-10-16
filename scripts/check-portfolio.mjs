import { execFileSync } from 'node:child_process';
const files = [
  'portfolio/content.mjs',
  'portfolio/templates.mjs',
  'portfolio/client.js',
  'portfolio/world.js',
  'scripts/build-portfolio.mjs',
  'scripts/serve-portfolio.mjs',
];
for (const file of files) execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
console.log('Portfolio JavaScript syntax verified.');
