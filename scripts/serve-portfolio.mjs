import http from 'node:http';
import { readFile, stat, watch } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPortfolio } from './build-portfolio.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const portArg = process.argv.find(a => a.startsWith('--port='))?.split('=')[1];
const port = Number(portArg || process.env.PORT || 3012);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid port');
const production = process.argv.includes('--production');
if (!production) await buildPortfolio();
const directory = path.join(root, 'dist');
await stat(path.join(directory, 'index.html'));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.pdf': 'application/pdf' };
const server = http.createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return; }
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, `http://127.0.0.1:${port}`).pathname); }
  catch { res.writeHead(400); res.end('Bad request'); return; }
  if (pathname.includes('\0')) { res.writeHead(400); res.end(); return; }
  let file = path.resolve(directory, `.${pathname}`);
  if (!file.startsWith(directory + path.sep) && file !== directory) { res.writeHead(403); res.end(); return; }
  let status = 200;
  try {
    const info = await stat(file);
    if (info.isDirectory()) {
      if (!pathname.endsWith('/')) { res.writeHead(301, { Location: pathname + '/' }); res.end(); return; }
      file = path.join(file, 'index.html');
    }
    await stat(file);
  } catch { file = path.join(directory, '404.html'); status = 404; }
  try {
    const data = await readFile(file);
    const config = JSON.parse(await readFile(path.join(root, 'firebase.json'), 'utf8'));
    const security = Object.fromEntries(config.hosting.headers[0].headers.map(h => [h.key, h.value]));
    // HTTPS upgrading is inappropriate for this loopback HTTP preview.
    security['Content-Security-Policy'] = security['Content-Security-Policy'].replace('; upgrade-insecure-requests', '');
    res.writeHead(status, { ...security, 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'Content-Length': data.length });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch { res.writeHead(500); res.end('Preview error'); }
});
server.listen(port, '127.0.0.1', () => console.log(`Portfolio: http://127.0.0.1:${port}`));
server.on('error', e => { console.error(e.message); process.exitCode = 1; });
if (!production) {
  let timer;
  let building = false;
  const rebuild = async () => {
    if (building) return;
    building = true;
    try { await buildPortfolio(); } catch (e) { console.error(e.message); } finally { building = false; }
  };
  (async () => {
    try { for await (const _event of watch(path.join(root, 'portfolio'), { recursive: true })) { clearTimeout(timer); timer = setTimeout(rebuild, 100); } }
    catch (e) { if (e.name !== 'AbortError') console.error('Watch:', e.message); }
  })();
}
