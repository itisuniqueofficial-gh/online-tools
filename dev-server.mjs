import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 8080);

const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

const send = (res, status, file) => {
  const ext = path.extname(file).toLowerCase();
  res.writeHead(status, { 'Content-Type': types[ext] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${PORT}`);
  const pathname = decodeURIComponent(url.pathname);
  const requested = path.normalize(path.join(ROOT, pathname));

  if (!requested.startsWith(ROOT)) {
    send(res, 404, path.join(ROOT, '404.html'));
    return;
  }

  let file = requested;
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    file = path.join(file, 'index.html');
  }

  if (fs.existsSync(file) && fs.statSync(file).isFile()) {
    send(res, 200, file);
    return;
  }

  const fallback = path.join(ROOT, '404.html');
  send(res, fs.existsSync(fallback) ? 404 : 200, fs.existsSync(fallback) ? fallback : path.join(ROOT, 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Online Tools preview running at http://localhost:${PORT}/`);
});
