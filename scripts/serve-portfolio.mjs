import http from 'node:http';
import { readFile, stat, watch } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPortfolio } from './build-portfolio.mjs';
import { checkRateLimit, generateChatReply } from '../functions/chat-core.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function loadEnvKey() {
  if (process.env.DEEPSEEK_API_KEY) {
    return {
      apiKey: process.env.DEEPSEEK_API_KEY,
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    };
  }
  for (const name of ['.env.local', '.env']) {
    try {
      const raw = await readFile(path.join(root, name), 'utf8');
      const keyMatch = raw.match(/^\s*DEEPSEEK_API_KEY\s*=\s*(.+)\s*$/m);
      const modelMatch = raw.match(/^\s*DEEPSEEK_MODEL\s*=\s*(.+)\s*$/m);
      if (keyMatch) {
        return {
          apiKey: keyMatch[1].trim().replace(/^['"]|['"]$/g, ''),
          model: modelMatch ? modelMatch[1].trim().replace(/^['"]|['"]$/g, '') : 'deepseek-chat',
        };
      }
    } catch {
      // ignore missing env file
    }
  }
  return { apiKey: '', model: 'deepseek-chat' };
}

async function readJsonBody(req, maxBytes = 32768) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBytes) throw new Error('Payload too large');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}
const portArg = process.argv.find((a) => a.startsWith('--port='))?.split('=')[1];
const port = Number(portArg || process.env.PORT || 3012);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid port');
const production = process.argv.includes('--production');
if (!production) await buildPortfolio();
const directory = path.join(root, 'dist');
await stat(path.join(directory, 'index.html'));
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
};
const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url?.split('?')[0] === '/api/chat') {
    const limit = checkRateLimit(req.socket.remoteAddress || '127.0.0.1');
    if (!limit.allowed) {
      res.writeHead(429, {
        'Content-Type': 'application/json; charset=utf-8',
        'Retry-After': String(limit.retryAfterSec),
      });
      res.end(JSON.stringify({ error: 'Too many requests.' }));
      return;
    }
    try {
      const body = await readJsonBody(req);
      const { apiKey, model } = await loadEnvKey();
      const result = await generateChatReply({
        messages: body.messages,
        locale: body.locale === 'en' ? 'en' : 'es',
        apiKey,
        model,
      });
      res.writeHead(result.status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      });
      res.end(JSON.stringify(result.body));
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Invalid JSON request body.' }));
    }
    return;
  }

  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow: 'GET, HEAD, POST' });
    res.end();
    return;
  }
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, `http://127.0.0.1:${port}`).pathname);
  } catch {
    res.writeHead(400);
    res.end('Bad request');
    return;
  }
  if (pathname.includes('\0')) {
    res.writeHead(400);
    res.end();
    return;
  }
  let file = path.resolve(directory, `.${pathname}`);
  if (!file.startsWith(directory + path.sep) && file !== directory) {
    res.writeHead(403);
    res.end();
    return;
  }
  let status = 200;
  try {
    const info = await stat(file);
    if (info.isDirectory()) {
      if (!pathname.endsWith('/')) {
        res.writeHead(301, { Location: pathname + '/' });
        res.end();
        return;
      }
      file = path.join(file, 'index.html');
    }
    await stat(file);
  } catch {
    file = path.join(directory, '404.html');
    status = 404;
  }
  try {
    const data = await readFile(file);
    const config = JSON.parse(await readFile(path.join(root, 'firebase.json'), 'utf8'));
    const security = Object.fromEntries(
      config.hosting.headers[0].headers.map((h) => [h.key, h.value])
    );
    // HTTPS upgrading is inappropriate for this loopback HTTP preview.
    security['Content-Security-Policy'] = security['Content-Security-Policy'].replace(
      '; upgrade-insecure-requests',
      ''
    );
    res.writeHead(status, {
      ...security,
      'Content-Type': types[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
      'Content-Length': data.length,
    });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch {
    res.writeHead(500);
    res.end('Preview error');
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Portfolio: http://127.0.0.1:${port}`));
server.on('error', (e) => {
  console.error(e.message);
  process.exitCode = 1;
});
if (!production) {
  let timer;
  let building = false;
  const rebuild = async () => {
    if (building) return;
    building = true;
    try {
      await buildPortfolio();
    } catch (e) {
      console.error(e.message);
    } finally {
      building = false;
    }
  };
  (async () => {
    try {
      for await (const _event of watch(path.join(root, 'portfolio'), { recursive: true })) {
        clearTimeout(timer);
        timer = setTimeout(rebuild, 100);
      }
    } catch (e) {
      if (e.name !== 'AbortError') console.error('Watch:', e.message);
    }
  })();
}
