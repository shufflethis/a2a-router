/* Minimal local adapter for Vercel function and static-file browser checks. */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const aliases = { '/openapi.json': '/.well-known/openapi.json', '/.well-known/webmcp': '/.well-known/webmcp.json', '/.well-known/api-catalog': '/.well-known/api-catalog.json' };
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.txt': 'text/plain', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.ttf': 'font/ttf' };
http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (/^\/api\/(status|requirements|brief|mcp|a2a)$/.test(url.pathname)) {
      let body = ''; for await (const chunk of req) { body += chunk; if (body.length > 4000000) { res.writeHead(413); return res.end(); } }
      req.body = body; req.query = Object.fromEntries(url.searchParams);
      await require(path.join(root, url.pathname + '.js'))(req, res); return;
    }
    if (url.pathname === '/de' || url.pathname === '/zh') { res.writeHead(308, { Location: url.pathname + '/' }); return res.end(); }
    const route = url.pathname.endsWith('/') ? url.pathname + 'index.html' : decodeURIComponent(url.pathname);
    const file = path.resolve(root, '.' + (aliases[url.pathname] || route));
    if (!file.startsWith(root + '/') || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); return res.end('Not found'); }
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    fs.createReadStream(file).pipe(res);
  } catch (error) { res.writeHead(500); res.end(error.message); }
}).listen(Number(process.env.A2A_PREVIEW_PORT || 4318), '127.0.0.1', () => console.log('a2a-router preview: http://127.0.0.1:4318'));
