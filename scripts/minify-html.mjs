#!/usr/bin/env node
/**
 * Minify every HTML file under _site/ in place (production build step,
 * runs after Jekyll and before compress). Whitespace runs collapse to a
 * single space, comments go, inline <script>/<style> are minified.
 *
 * html-minifier-terser is synchronous and CPU bound, so the files are
 * spread over a pool of worker threads.
 */

import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { availableParallelism } from 'node:os';
import { minify } from 'html-minifier-terser';

const SITE_DIR = '_site';

const MINIFY_OPTIONS = {
  collapseWhitespace: true,
  conservativeCollapse: true,
  removeComments: true,
  minifyJS: true,
  minifyCSS: true,
};

async function listHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listHtmlFiles(full)));
    } else if (entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

async function minifyFiles(files) {
  let before = 0;
  let after = 0;
  for (const file of files) {
    const source = await readFile(file, 'utf8');
    const output = await minify(source, MINIFY_OPTIONS);
    before += Buffer.byteLength(source);
    after += Buffer.byteLength(output);
    await writeFile(file, output);
  }
  return { before, after };
}

function runWorker(files) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL(import.meta.url), { workerData: { files } });
    worker.once('message', resolve);
    worker.once('error', reject);
    worker.once('exit', (code) => {
      if (code !== 0) reject(new Error(`minify worker exited with code ${code}`));
    });
  });
}

async function main() {
  const started = Date.now();
  const files = await listHtmlFiles(SITE_DIR);
  const workerCount = Math.max(1, Math.min(availableParallelism(), files.length));
  const chunks = Array.from({ length: workerCount }, () => []);
  files.forEach((file, i) => chunks[i % workerCount].push(file));

  const results = await Promise.all(chunks.map(runWorker));
  const before = results.reduce((sum, r) => sum + r.before, 0);
  const after = results.reduce((sum, r) => sum + r.after, 0);
  const seconds = ((Date.now() - started) / 1000).toFixed(1);
  const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1);
  console.log(`Minified ${files.length} HTML files: ${mb(before)} MB -> ${mb(after)} MB in ${seconds} s`);
}

if (isMainThread) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
} else {
  minifyFiles(workerData.files).then((result) => parentPort.postMessage(result));
}
