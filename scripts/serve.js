// Minimal zero-dependency static file server for local development.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const PORT = Number(process.env.PORT) || 3000;

// URL prefix -> directory on disk
const MOUNTS = [
  ['/src/', join(ROOT, 'src')],
  ['/', join(ROOT, 'public')],
];

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function resolvePath(urlPath) {
  const pathname = decodeURIComponent(urlPath.split('?')[0]);
  for (const [prefix, dir] of MOUNTS) {
    if (!pathname.startsWith(prefix)) continue;
    let rel = pathname.slice(prefix.length);
    if (rel === '' || rel.endsWith('/')) rel += 'index.html';
    const file = normalize(join(dir, rel));
    if (file.startsWith(dir)) return file; // block path traversal
  }
  return null;
}

createServer(async (req, res) => {
  const file = resolvePath(req.url);
  if (!file) {
    res.writeHead(403).end('Forbidden');
    return;
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('Not found');
  }
}).listen(PORT, () => {
  console.log(`Todo app running at http://localhost:${PORT}`);
});
