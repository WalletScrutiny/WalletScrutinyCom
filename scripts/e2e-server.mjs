#!/usr/bin/env node
/**
 * Build the site and serve _site/ for Playwright E2E tests.
 * Playwright's webServer keeps this process running for the test session.
 */

import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { stat, readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const port = process.env.PLAYWRIGHT_PORT || '4173';
const root = resolve('_site');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.map': 'application/json',
  '.cast': 'application/octet-stream',
};

async function serveFile(res, filePath) {
  const data = await readFile(filePath);
  res.writeHead(200, {
    'Content-Type': mimeTypes[extname(filePath).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-cache',
  });
  res.end(data);
}

const server = createServer(async (req, res) => {
  try {
    let urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (urlPath.endsWith('/')) {
      urlPath += 'index.html';
    }
    let filePath = join(root, normalize(urlPath).replace(/^([.][.][/\\])+/, ''));
    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    try {
      const stats = await stat(filePath);
      if (stats.isDirectory()) {
        filePath = join(filePath, 'index.html');
      }
    } catch {
      filePath += '.html';
    }
    await serveFile(res, filePath);
  } catch {
    res.writeHead(404);
    res.end('Not Found');
  }
});

function runAndWait(command, args, env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      env: { ...process.env, ...env },
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
    });
  });
}

await runAndWait('node', ['scripts/build-e2e.mjs']);

await new Promise((resolveListen) => server.listen(port, resolveListen));
console.log(`Serving _site/ on http://localhost:${port}`);

for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
  });
}
