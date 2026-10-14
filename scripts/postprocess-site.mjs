#!/usr/bin/env node
/**
 * Post-process _site/ after Jekyll in a single pass over the tree:
 *   - minify every .html in place (whitespace, comments, inline script/style),
 *   - minify .js (terser) and .css (cssnano) in place, skipping *.min.*,
 *   - write a pre-compressed .br next to every html/js/css/json/font/svg/cast
 *     file for nginx's brotli_static (quality 6 for the thousands of nested
 *     pages, 10 for the top-level pages and everything else).
 *
 * This replaces minify-html.mjs plus the `compress` npm script, which walked
 * _site/ five times in a row (foreach-cli spawning one terser/postcss process
 * per file, then brotli-cli twice) with the CPU mostly idle. Here every file
 * is one job; a pool of worker threads pulls jobs from a shared counter so big
 * and small files balance across cores.
 *
 *   node scripts/postprocess-site.mjs              # minify + brotli (production)
 *   node scripts/postprocess-site.mjs --no-brotli  # minify only (E2E build)
 */

import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { brotliCompress, constants as zlib } from 'node:zlib';
import { promisify } from 'node:util';
import { extname, join } from 'node:path';
import { availableParallelism } from 'node:os';
import { minify as minifyHtml } from 'html-minifier-terser';
import { minify as minifyJs } from 'terser';
import postcss from 'postcss';
import cssnano from 'cssnano';

const SITE_DIR = '_site';
const BROTLI_EXTENSIONS = new Set(['.html', '.js', '.css', '.json', '.ttf', '.svg', '.eot', '.cast']);

const HTML_OPTIONS = {
  collapseWhitespace: true,
  conservativeCollapse: true,
  removeComments: true,
  minifyJS: true,
  minifyCSS: true,
};

const brotli = promisify(brotliCompress);
const cssMinifier = postcss([cssnano({ preset: 'default' })]);

async function listFiles(dir, depth = 0) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(full, depth + 1)));
      continue;
    }
    const ext = extname(entry.name).toLowerCase();
    if (!BROTLI_EXTENSIONS.has(ext) || entry.name.endsWith('.br')) continue;
    files.push({ path: full, ext, topLevel: depth === 0 });
  }
  return files;
}

/** Minify one file in place when its type has a minifier; returns the (possibly new) content. */
async function minifyFile(file, source) {
  const name = file.path;
  if (file.ext === '.html') {
    return minifyHtml(source.toString('utf8'), HTML_OPTIONS);
  }
  if (file.ext === '.js' && !name.endsWith('.min.js')) {
    // Same as the former `terser file -o file`: no compress/mangle passes, whitespace only.
    const result = await minifyJs(source.toString('utf8'), { compress: false, mangle: false });
    return result.code;
  }
  if (file.ext === '.css' && !name.endsWith('.min.css')) {
    const result = await cssMinifier.process(source.toString('utf8'), { from: name, to: name, map: false });
    return result.css;
  }
  return null;
}

async function processFile(file, options, stats) {
  let content = await readFile(file.path);
  stats.before += content.length;
  const minified = await minifyFile(file, content);
  if (minified !== null) {
    content = Buffer.from(minified);
    await writeFile(file.path, content);
    stats.minified += 1;
  }
  stats.after += content.length;
  if (!options.brotli) return;
  const quality = file.ext === '.html' && !file.topLevel ? 6 : 10;
  const compressed = await brotli(content, {
    params: {
      [zlib.BROTLI_PARAM_QUALITY]: quality,
      [zlib.BROTLI_PARAM_SIZE_HINT]: content.length,
    },
  });
  await writeFile(`${file.path}.br`, compressed);
  stats.brotli += compressed.length;
}

async function workerMain({ files, counter, options }) {
  const next = new Int32Array(counter);
  const stats = { before: 0, after: 0, minified: 0, brotli: 0 };
  for (let i = Atomics.add(next, 0, 1); i < files.length; i = Atomics.add(next, 0, 1)) {
    try {
      await processFile(files[i], options, stats);
    } catch (err) {
      throw new Error(`${files[i].path}: ${err.message}`);
    }
  }
  parentPort.postMessage(stats);
}

function runWorker(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL(import.meta.url), { workerData });
    worker.once('message', resolve);
    worker.once('error', reject);
    worker.once('exit', (code) => {
      if (code !== 0) reject(new Error(`postprocess worker exited with code ${code}`));
    });
  });
}

async function main() {
  const started = Date.now();
  const options = { brotli: !process.argv.includes('--no-brotli') };
  const files = await listFiles(SITE_DIR);
  const counter = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
  const workerCount = Math.max(1, Math.min(availableParallelism(), files.length));
  const results = await Promise.all(
    Array.from({ length: workerCount }, () => runWorker({ files, counter, options })),
  );
  const total = results.reduce((sum, r) => ({
    before: sum.before + r.before,
    after: sum.after + r.after,
    minified: sum.minified + r.minified,
    brotli: sum.brotli + r.brotli,
  }));
  const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1);
  const seconds = ((Date.now() - started) / 1000).toFixed(1);
  const brotliNote = options.brotli ? `, ${mb(total.brotli)} MB of .br files` : '';
  console.log(
    `Minified ${total.minified} of ${files.length} files: ${mb(total.before)} MB -> ${mb(total.after)} MB${brotliNote} in ${seconds} s`,
  );
}

if (isMainThread) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
} else {
  workerMain(workerData).catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
