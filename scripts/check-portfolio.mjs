import { execFileSync } from 'node:child_process';

const files = [
  'portfolio/app.js',
  'scripts/build-portfolio.mjs',
  'scripts/serve-portfolio.mjs',
  'scripts/verify-hosting.mjs',
];

for (const file of files) {
  execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
}

console.log('Portfolio JavaScript syntax verified.');
