#!/usr/bin/env node
/**
 * fetchSources.mjs — Parallel source fetcher for sourceavailable products.
 * Fetches README + License via GitHub API, website text via curl.
 * 10 concurrent workers. Skips products with fresh cache (< 7 days old).
 *
 * Usage: node scripts/fetchSources.mjs [--force] [--verdict sourceavailable]
 */

import fs from 'fs';
import path from 'path';
import { execSync, exec } from 'child_process';
import { createRequire } from 'module';

function execAsync(cmd, opts = {}) {
  return new Promise((resolve, reject) => {
    exec(cmd, { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024, timeout: 18000, ...opts }, (err, stdout) => {
      if (err) reject(err);
      else resolve(stdout);
    });
  });
}

const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CACHE_DIR = path.join(ROOT, 'scripts', 'cache', 'feature-text');
const PLATFORMS = { android: '_android', iphone: '_iphone', desktop: '_desktop', hardware: '_hardware' };

const FORCE = process.argv.includes('--force');
const VERDICT_FILTER = (() => {
  const i = process.argv.indexOf('--verdict');
  return i >= 0 ? process.argv[i+1] : 'sourceavailable';
})();
const CONCURRENCY = 10;
const CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function isFresh(fp) {
  if (FORCE) return false;
  try { return (Date.now() - fs.statSync(fp).mtimeMs) < CACHE_MAX_AGE_MS; }
  catch { return false; }
}

async function fetchUrl(url, maxBytes = 80000, timeoutSec = 12) {
  try {
    const out = await execAsync(
      `curl -sL --max-time ${timeoutSec} -A "WalletScrutiny/1.0" "${url}"`,
      { timeout: (timeoutSec + 3) * 1000 }
    );
    return out.slice(0, maxBytes);
  } catch { return ''; }
}

function stripHtml(h) {
  return h.replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&nbsp;/g,' ')
    .replace(/\s{3,}/g, '\n\n').trim();
}

function stripMarkdown(md) {
  return md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')      // images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')   // links → text
    .replace(/`([^`]+)`/g, '$1')               // inline code
    .replace(/^```[\s\S]*?^```/gm, '')         // code blocks
    .replace(/\s{3,}/g, '\n\n').trim();
}

async function fetchGitHubReadme(slug) {
  const api = await fetchUrl(`https://api.github.com/repos/${slug}/readme`, 4096);
  if (api) {
    try {
      const meta = JSON.parse(api);
      if (meta.download_url) {
        const raw = await fetchUrl(meta.download_url);
        if (raw?.length > 100) return stripMarkdown(raw);
      }
    } catch {}
  }
  for (const b of ['main', 'master'])
    for (const f of ['README.md', 'README.markdown', 'readme.md']) {
      const raw = await fetchUrl(`https://raw.githubusercontent.com/${slug}/${b}/${f}`);
      if (raw?.length > 100) return stripMarkdown(raw);
    }
  return '';
}

async function resolveLicenseFile(url) {
  const raw = await fetchUrl(url);
  if (!raw || raw.length < 10) return '';
  const t = raw.trim();
  if (t.length < 40 && !t.includes('\n') && /^[\w.-]+$/.test(t)) {
    const follow = await fetchUrl(url.replace(/[^/]+$/, '') + t);
    if (follow?.length > 10) return follow;
  }
  return raw;
}

async function fetchGitHubLicense(slug) {
  const api = await fetchUrl(`https://api.github.com/repos/${slug}/license`, 4096);
  if (api) {
    try {
      const meta = JSON.parse(api);
      if (meta.download_url) {
        const r = await resolveLicenseFile(meta.download_url);
        if (r) return r;
      }
    } catch {}
  }
  for (const b of ['main', 'master'])
    for (const f of ['LICENSE', 'LICENSE.md', 'COPYING', 'COPYING-CC']) {
      const r = await resolveLicenseFile(`https://raw.githubusercontent.com/${slug}/${b}/${f}`);
      if (r) return r;
    }
  return '';
}

async function fetchProduct(plat, appId, fm) {
  const cacheFile = path.join(CACHE_DIR, plat, appId + '.yaml');
  if (isFresh(cacheFile)) return 'skipped';

  const repoUrl = fm.repository || '';
  const slug = (repoUrl.match(/github\.com\/([^/]+\/[^/]+?)(?:\.git)?\/?$/) || [])[1] || '';

  const readme   = slug ? fetchGitHubReadme(slug) : '';
  const license  = slug ? fetchGitHubLicense(slug) : '';
  const websiteText = fm.website ? stripHtml(await fetchUrl(fm.website, 80000)) : '';

  const record = {
    appId, platform: plat,
    title: fm.title || appId,
    readme: await readme,
    license: await license,
    websiteText,
    description: '',
  };

  fs.mkdirSync(path.dirname(cacheFile), { recursive: true });
  fs.writeFileSync(cacheFile, yaml.dump(record, { lineWidth: 120 }));
  return 'fetched';
}

// ── Collect products ───────────────────────────────────────────────────────

const products = [];
for (const [plat, folder] of Object.entries(PLATFORMS)) {
  const dir = path.join(ROOT, folder);
  if (!fs.existsSync(dir)) continue;
  for (const fn of fs.readdirSync(dir)) {
    if (!fn.endsWith('.md')) continue;
    const c = fs.readFileSync(path.join(dir, fn), 'utf8');
    const m = c.match(/^---\n([\s\S]*?)\n---/);
    if (!m) continue;
    let fm; try { fm = yaml.load(m[1]); } catch { continue; }
    if (fm?.verdict !== VERDICT_FILTER) continue;
    products.push({ plat, appId: fn.slice(0,-3), fm });
  }
}

console.log(`${products.length} ${VERDICT_FILTER} products to process (concurrency: ${CONCURRENCY})\n`);

// ── Run parallel ───────────────────────────────────────────────────────────

let fetched = 0, skipped = 0, errors = 0;
let idx = 0;

await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
  while (idx < products.length) {
    const { plat, appId, fm } = products[idx++];
    const label = `${plat}/${appId}`;
    try {
      const status = await fetchProduct(plat, appId, fm);
      if (status === 'skipped') { skipped++; process.stdout.write('.'); }
      else { fetched++; process.stdout.write(`\n  fetched ${label}`); }
    } catch (e) {
      errors++;
      process.stdout.write(`\n  ERROR ${label}: ${e.message?.slice(0,60)}`);
    }
  }
}));

console.log(`\n\nDone. Fetched: ${fetched}  Skipped (fresh): ${skipped}  Errors: ${errors}`);
