#!/usr/bin/env node

/**
 * checkUrls.mjs — Check URLs in product files for broken links.
 *
 * URL states in files:
 *   - https://example.com              → live, normal
 *   - https://example.com#deadLink     → dead, no archive available
 *   - https://web.archive.org/web/TS/URL → dead, archive available
 *
 * Cache: scripts/cache/url-check-log.yaml
 *   Rolling log keyed by date. Each date maps URLs to their status.
 *   Used to determine when each URL was last checked, so we don't
 *   re-check URLs unnecessarily.
 *
 * On each run:
 *   1. Collects all URLs from frontmatter + body across all platforms
 *   2. Loads cache to find each URL's last-checked date
 *   3. Sorts by oldest-checked-first (never-checked URLs first)
 *   4. Checks up to --batch URLs (default 500)
 *   5. For dead URLs: tries archive.org Wayback Machine
 *   6. Applies changes to files and appends results to cache
 *
 * Usage:
 *   node scripts/checkUrls.mjs [--batch N] [--concurrency N] [--dry-run]
 *
 * Options:
 *   --batch N          Max URLs to check per run (default: 500)
 *   --concurrency N    Parallel requests (default: 20)
 *   --dry-run          Report changes without writing files or cache
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import helper from './helper.mjs';

const PLATFORMS = [
  { dir: '_android',  category: 'android' },
  { dir: '_iphone',   category: 'iphone' },
  { dir: '_hardware', category: 'hardware' },
  { dir: '_bearer',   category: 'bearer' },
  { dir: '_desktop',  category: 'desktop' },
  { dir: '_others',   category: 'others' },
];

// Frontmatter fields that contain URLs (string fields)
const URL_FIELDS = ['website', 'repository', 'issue', 'bugbounty', 'providerWebsite', 'shop'];

// Domains where responses are unreliable (bot-blocking, auth-walls).
// URLs on these domains are skipped entirely — never checked, never marked dead.
const SKIP_DOMAINS = new Set([
  'facebook.com', 'www.facebook.com', 'm.facebook.com',
  'linkedin.com', 'www.linkedin.com',
  'instagram.com', 'www.instagram.com',
  'tiktok.com', 'www.tiktok.com',
  'twitter.com', 'www.twitter.com', 'mobile.twitter.com',
  'x.com', 'www.x.com',
  'vk.com', 'www.vk.com',
  'play.google.com', 'apps.apple.com',
  'bitcointalk.org', 'www.bitcointalk.org',
  // Crowdfunding platforms — 403 bot block
  'kickstarter.com', 'www.kickstarter.com',
  'indiegogo.com', 'www.indiegogo.com',
  // Marketplace bot challenges
  'ebay.com', 'www.ebay.com', 'www.ebay.ca', 'www.ebay.co.uk',
  'amazon.com', 'www.amazon.com', 'www.amazon.de', 'www.amazon.co.uk',
]);

// Domains with special check strategies (override normal HTTP check)
const SPECIAL_CHECKERS = {
  // YouTube: oembed API for videos only; channels/playlists fall back to HTTP
  'youtube.com': checkYouTube,
  'www.youtube.com': checkYouTube,
  'm.youtube.com': checkYouTube,
  'youtu.be': checkYouTube,
  // Discord invite links
  'discord.com': checkDiscord,
  'discord.gg': checkDiscord,
  // Reddit: use .json check; 403 = alive (bot protection)
  'reddit.com': checkReddit,
  'www.reddit.com': checkReddit,
  'old.reddit.com': checkReddit,
  'np.reddit.com': checkReddit,
};

const CACHE_FILE = 'scripts/cache/url-check-log.yaml';

// Parse CLI args
const args = process.argv.slice(2);
let BATCH_SIZE = 500;
let CONCURRENCY = 20;
let DRY_RUN = false;

for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--batch':       BATCH_SIZE = parseInt(args[++i]); break;
    case '--concurrency': CONCURRENCY = parseInt(args[++i]); break;
    case '--dry-run':     DRY_RUN = true; break;
  }
}

const TODAY = new Date().toISOString().slice(0, 10);

// ─── Cache management ───────────────────────────────────────────────

/**
 * Load the rolling URL check log.
 * Returns Map<url, { date, status }> with the most recent entry per URL.
 */
function loadCache() {
  const lastSeen = new Map(); // url → { date, status }

  if (!fs.existsSync(CACHE_FILE)) return lastSeen;

  try {
    const raw = fs.readFileSync(CACHE_FILE, 'utf8');
    const data = yaml.load(raw);
    if (!data || typeof data !== 'object') return lastSeen;

    // data is { '2026-03-01': { url: status, ... }, ... }
    // Process dates in chronological order so later entries overwrite earlier
    const dates = Object.keys(data).sort();
    for (const date of dates) {
      const entries = data[date];
      if (!entries || typeof entries !== 'object') continue;
      for (const [url, status] of Object.entries(entries)) {
        lastSeen.set(normalizeUrl(url), { date, status });
      }
    }
  } catch (err) {
    console.error(`Warning: could not parse cache: ${err.message}`);
  }

  return lastSeen;
}

/**
 * Append today's results to the cache file.
 */
function saveCache(results) {
  if (results.size === 0) return;

  let data = {};
  if (fs.existsSync(CACHE_FILE)) {
    try {
      data = yaml.load(fs.readFileSync(CACHE_FILE, 'utf8')) || {};
    } catch { data = {}; }
  }

  // Merge into today's entry
  if (!data[TODAY]) data[TODAY] = {};
  for (const [url, status] of results) {
    data[TODAY][url] = status;
  }

  // Prune entries older than 6 months
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 6);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  for (const date of Object.keys(data)) {
    if (date < cutoffStr) delete data[date];
  }

  fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
  fs.writeFileSync(CACHE_FILE, yaml.dump(data, { lineWidth: -1, sortKeys: true }));
}

// ─── URL normalization ──────────────────────────────────────────────

/**
 * Normalize a URL for deduplication:
 *   - Strip trailing slash on root paths (example.com/ → example.com)
 *   - Lowercase the hostname
 * Returns the normalized URL string.
 */
function normalizeUrl(url) {
  try {
    const u = new URL(url);
    u.hostname = u.hostname.toLowerCase();
    // Strip trailing slash only on root path
    if (u.pathname === '/') u.pathname = '';
    return u.toString().replace(/\/$/, '');
  } catch {
    return url;
  }
}

// ─── URL parsing helpers ────────────────────────────────────────────

/**
 * Extract the original URL from a possibly-dead or archived URL.
 * Returns { original, state }
 *   state: 'normal' | 'dead' | 'deadLegacy' | 'archived'
 *
 * Supports both new #deadLink and legacy #dead=DATE / &dead=DATE markers.
 */
function parseUrl(url) {
  if (!url || typeof url !== 'string') return null;
  url = url.trim();
  if (!url.startsWith('http')) return null;

  // Archived: https://web.archive.org/web/TIMESTAMP/https://original.com
  const archiveMatch = url.match(/^https?:\/\/web\.archive\.org\/web\/(\d+)\/(https?:\/\/.+)$/);
  if (archiveMatch) {
    const embedded = stripDeadMarker(archiveMatch[2]);
    return { original: embedded, state: 'archived', archiveTs: archiveMatch[1], full: url };
  }

  // New dead marker: #deadLink or &deadLink
  if (url.endsWith('#deadLink') || url.endsWith('&deadLink')) {
    const original = url.replace(/[#&]deadLink$/, '');
    return { original, state: 'dead', full: url };
  }

  // Legacy dead marker: #dead=DATE or &dead=DATE
  const deadMatch = url.match(/[#&]dead=(\d{4}-\d{2}-\d{2})$/);
  if (deadMatch) {
    const original = stripDeadMarker(url);
    return { original, state: 'deadLegacy', deadDate: deadMatch[1], full: url };
  }

  return { original: url, state: 'normal', full: url };
}

/**
 * Strip dead markers (both legacy and new) from a URL.
 */
function stripDeadMarker(url) {
  // New format
  url = url.replace(/[#&]deadLink$/, '');
  // Legacy format: #dead=DATE or &dead=DATE
  url = url.replace(/#dead=\d{4}-\d{2}-\d{2}$/, '');
  url = url.replace(/&dead=\d{4}-\d{2}-\d{2}$/, '');
  return url;
}

/**
 * Add a dead marker to a URL.
 */
function addDeadMarker(url) {
  if (url.includes('#')) {
    return `${url}&deadLink`;
  }
  return `${url}#deadLink`;
}

/**
 * Get the domain from a URL, safely.
 */
function getDomain(url) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return '';
  }
}

// ─── HTTP checking ──────────────────────────────────────────────────

/**
 * Strip fragment from URL for HTTP checking (servers don't see fragments).
 */
function stripFragment(url) {
  const idx = url.indexOf('#');
  return idx === -1 ? url : url.slice(0, idx);
}

/**
 * Check if a URL is alive. Returns { alive, statusCode, error, inconclusive }
 * Two-tier timeout: 15s for HEAD, 60s for GET fallback.
 */
async function checkAlive(url) {
  const domain = getDomain(url);
  if (SKIP_DOMAINS.has(domain)) {
    return { alive: false, inconclusive: true, skipped: true };
  }

  // Special checkers for specific domains
  const specialChecker = SPECIAL_CHECKERS[domain];
  if (specialChecker) {
    return specialChecker(url);
  }

  return checkHttp(url);
}

/**
 * Check if an HTTP response indicates the server is actively managed.
 * CDN/proxy headers = someone is paying for hosting = alive, regardless of status code.
 */
function hasActiveInfra(res) {
  const server = (res.headers.get('server') || '').toLowerCase();
  const via = (res.headers.get('via') || '').toLowerCase();
  return server.includes('cloudflare') ||
         server.includes('cloudfront') ||
         server.includes('akamai') ||
         server.includes('nginx') ||
         server.includes('apache') ||
         server.includes('esf') ||       // Google Edge Serving Frontend
         server.includes('gws') ||       // Google Web Server
         server.includes('gse') ||       // Google Servlet Engine
         via.includes('cloudfront') ||
         res.headers.has('cf-ray') ||
         res.headers.has('x-amz-cf-id');
}

/**
 * Classify an HTTP response as alive/dead/inconclusive.
 *
 * Strategy:
 *   - 403 / 451: always alive (bot protection, legal/geo block)
 *   - 429: inconclusive (rate limited)
 *   - 5xx: inconclusive (temporary server errors)
 *   - 404/410 on homepage + CDN: alive (bot protection returning errors)
 *   - 404/410 on deep path: dead (content genuinely removed, even behind CDN)
 *   - 404/410 on homepage without CDN: dead (domain abandoned/parked)
 *   - Other 4xx + CDN: alive
 *   - Other 4xx without CDN: dead
 */
function classifyResponse(res, url) {
  const status = res.status;

  // 2xx, 3xx → alive
  if (status >= 200 && status < 400) return { alive: true, statusCode: status };

  // 403 → always alive (bot protection / auth wall)
  if (status === 403) return { alive: true, statusCode: 403 };

  // 451 → alive (legal/geo block = active management)
  if (status === 451) return { alive: true, statusCode: 451 };

  // 429 → rate limited, inconclusive
  if (status === 429) return { alive: false, statusCode: 429, inconclusive: true };

  // 5xx → server error, inconclusive (could be temporary)
  if (status >= 500) return { alive: false, statusCode: status, inconclusive: true };

  // 4xx — distinguish homepage vs deep paths
  const isHomepage = isRootUrl(url);
  const hasCdn = hasActiveInfra(res);

  if (status === 404 || status === 410) {
    // Homepage + CDN → bot protection (e.g., crypto.com returns 404 to bots)
    if (isHomepage && hasCdn) return { alive: true, statusCode: status };
    // Homepage without CDN → dead domain
    // Deep path → content genuinely removed (even behind CDN)
    return { alive: false, statusCode: status };
  }

  // Other 4xx (401, 402, 407, etc.)
  if (hasCdn) return { alive: true, statusCode: status };
  return { alive: false, statusCode: status };
}

/**
 * Check if a URL is a root/homepage URL (path is /, empty, or just a trailing slash).
 */
function isRootUrl(url) {
  try {
    const u = new URL(url);
    return u.pathname === '/' || u.pathname === '';
  } catch {
    return false;
  }
}

/**
 * Standard HTTP check with two-tier timeout.
 */
async function checkHttp(url) {
  const fetchUrl = stripFragment(url);

  // Tier 1: HEAD with 15s timeout
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    let res = await fetch(fetchUrl, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WalletScrutiny/1.0)',
        'Accept': '*/*',
      },
    });
    clearTimeout(timer);

    // 405 = HEAD not allowed → fall through to GET
    // Also fall through to GET for 4xx responses — some SPAs (bsky.app)
    // and services return 404 on HEAD but 200 on GET
    if (res.status !== 405 && res.status < 400) {
      return classifyResponse(res, url);
    }
    // For 403 on HEAD, server is up (bot protection) — no need for GET
    if (res.status === 403 || res.status === 451) {
      return classifyResponse(res, url);
    }
    // 4xx/5xx on HEAD → try GET to confirm
  } catch (err) {
    // HEAD failed — could be timeout or network error
    const msg = err.cause?.code || err.message || String(err);
    if (!msg.includes('AbortError') && !msg.includes('abort')) {
      return classifyError(msg);
    }
  }

  // Tier 2: GET with 60s timeout
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 60000);
    const res = await fetch(fetchUrl, {
      method: 'GET',
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WalletScrutiny/1.0)',
        'Accept': 'text/html,*/*',
      },
    });
    clearTimeout(timer);

    return classifyResponse(res, url);
  } catch (err) {
    const msg = err.cause?.code || err.message || String(err);
    return classifyError(msg);
  }
}

/**
 * Classify a network error as definitive (dead) or inconclusive.
 */
function classifyError(msg) {
  // DNS failure = definitely dead
  if (msg.includes('ENOTFOUND') || msg.includes('EAI_AGAIN')) {
    return { alive: false, error: msg };
  }
  // SSL cert expired = likely dead/abandoned
  if (msg.includes('CERT_HAS_EXPIRED') || msg.includes('SELF_SIGNED_CERT')) {
    return { alive: false, error: msg };
  }
  // Other SSL/TLS errors = likely dead/abandoned
  if (msg.includes('SSL') || msg.includes('TLS')) {
    return { alive: false, error: msg };
  }
  // Connection refused / timeout / reset = inconclusive
  return { alive: false, error: msg, inconclusive: true };
}

// ─── Special domain checkers ────────────────────────────────────────

/**
 * Reddit: try .json API; treat 403 as alive (bot protection = server is up).
 */
async function checkReddit(url) {
  try {
    const u = new URL(stripFragment(url));
    const jsonUrl = u.pathname === '/' || !u.pathname
      ? null
      : `${u.origin}${u.pathname.replace(/\/$/, '')}.json`;

    if (!jsonUrl) return { alive: true, inconclusive: true }; // bare domain

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    const res = await fetch(jsonUrl, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'WalletScrutiny/1.0' },
    });
    clearTimeout(timer);

    // 403 = bot protection, server is up
    if (res.status === 403) return { alive: true, statusCode: 403 };
    if (res.status === 429) return { alive: false, inconclusive: true };
    return { alive: res.ok, statusCode: res.status };
  } catch {
    return { alive: false, inconclusive: true };
  }
}

/**
 * YouTube: use oembed API for video URLs; fall back to HTTP for channels/playlists.
 * oembed only works for /watch?v=... and youtu.be/... URLs.
 * Channel URLs (/channel/..., /@handle, /c/..., /user/...) require HTTP check.
 */
async function checkYouTube(url) {
  try {
    const u = new URL(stripFragment(url));
    const path = u.pathname;

    // Detect video URLs: /watch, youtu.be short links, /embed/, /v/
    // Everything else (channels, handles, playlists, search, custom paths) → HTTP check
    const isVideo = (u.hostname === 'youtu.be' && path.length > 1) ||
                    (path === '/watch' && u.searchParams.has('v')) ||
                    /^\/(?:embed|v)\//.test(path);

    if (isVideo) {
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(stripFragment(url))}&format=json`;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 30000);
      const res = await fetch(oembedUrl, {
        signal: controller.signal,
        headers: { 'User-Agent': 'WalletScrutiny/1.0' },
      });
      clearTimeout(timer);
      // oembed: 200 = exists, 404 = deleted/private, 401/403 = inconclusive
      if (res.status === 401 || res.status === 403) {
        return { alive: false, inconclusive: true };
      }
      return { alive: res.ok, statusCode: res.status };
    }

    // Channel/playlist/handle URLs — YouTube returns 200 even for empty/skeleton channels.
    // Use HTTP check; a 404 means the channel truly doesn't exist.
    return checkHttp(url);
  } catch {
    return { alive: false, inconclusive: true };
  }
}

/**
 * Discord: check invite validity via API.
 */
async function checkDiscord(url) {
  try {
    const u = new URL(stripFragment(url));
    // Extract invite code from /invite/CODE or discord.gg/CODE
    let code = null;
    if (u.hostname === 'discord.gg') {
      code = u.pathname.replace(/^\//, '').split('/')[0];
    } else {
      const match = u.pathname.match(/\/invite\/([^/]+)/);
      if (match) code = match[1];
    }

    if (!code) return { alive: false, inconclusive: true };

    const apiUrl = `https://discord.com/api/v10/invites/${code}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    const res = await fetch(apiUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': 'WalletScrutiny/1.0' },
    });
    clearTimeout(timer);

    if (res.status === 429) return { alive: false, inconclusive: true };
    return { alive: res.ok, statusCode: res.status };
  } catch {
    return { alive: false, inconclusive: true };
  }
}

// ─── Wayback Machine ────────────────────────────────────────────────

/**
 * Check Wayback Machine for an archived snapshot.
 * Returns the archive URL or null.
 */
async function findArchive(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);

  try {
    const apiUrl = `https://archive.org/wayback/available?url=${encodeURIComponent(url)}`;
    const res = await fetch(apiUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': 'WalletScrutiny/1.0' },
    });
    clearTimeout(timer);

    if (!res.ok) return null;

    const data = await res.json();
    const snap = data?.archived_snapshots?.closest;
    if (snap?.available && snap.url) {
      return snap.url.replace(/^http:\/\/web\.archive\.org/, 'https://web.archive.org');
    }
    return null;
  } catch {
    clearTimeout(timer);
    return null;
  }
}

// ─── Concurrency helper ─────────────────────────────────────────────

async function runConcurrent(tasks, limit) {
  const results = [];
  let idx = 0;

  async function worker() {
    while (idx < tasks.length) {
      const i = idx++;
      results[i] = await tasks[i]();
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, tasks.length) }, () => worker())
  );
  return results;
}

// ─── URL collection ─────────────────────────────────────────────────

/**
 * Collect all URLs from all product files.
 * Returns { urlMap, fileData }
 *   urlMap: Map<originalUrl, { raw, parsed, refs[] }>
 *   fileData: Map<filePath, { header, body, dirty }>
 */
function collectUrls() {
  const urlMap = new Map();
  const fileData = new Map();

  for (const { dir } of PLATFORMS) {
    let files;
    try {
      files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
    } catch { continue; }

    for (const file of files) {
      const filePath = path.join(dir, file);
      const content = { header: {}, body: '' };
      helper.loadFromFile(filePath, content);
      fileData.set(filePath, { header: content.header, body: content.body, dirty: false });

      // Frontmatter URL fields
      for (const field of URL_FIELDS) {
        const val = content.header[field];
        if (typeof val === 'string' && val.startsWith('http')) {
          addUrl(urlMap, val, filePath, field);
        }
      }

      // Social array
      const social = content.header.social;
      if (Array.isArray(social)) {
        social.forEach((val, idx) => {
          if (typeof val === 'string' && val.startsWith('http')) {
            addUrl(urlMap, val, filePath, 'social', idx);
          }
        });
      }

      // Body URLs (markdown links + bare URLs)
      if (content.body) {
        const bodyUrls = extractBodyUrls(content.body);
        for (const { url, offset } of bodyUrls) {
          addUrl(urlMap, url, filePath, 'body', offset);
        }
      }
    }
  }

  return { urlMap, fileData };
}

function addUrl(urlMap, rawUrl, filePath, field, index) {
  const parsed = parseUrl(rawUrl);
  if (!parsed) return;

  const key = normalizeUrl(parsed.original);
  if (!urlMap.has(key)) {
    urlMap.set(key, { raw: rawUrl, parsed, refs: [] });
  } else {
    // Keep track of all raw URL variants for replacement
    const existing = urlMap.get(key);
    if (existing.raw !== rawUrl && !existing.rawVariants) {
      existing.rawVariants = new Set([existing.raw]);
    }
    if (existing.rawVariants) existing.rawVariants.add(rawUrl);
  }
  urlMap.get(key).refs.push({ file: filePath, field, index, rawUrl });
}

function extractBodyUrls(body) {
  const results = [];
  const seen = new Set();

  // Markdown links: [text](url)
  const mdRe = /\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;
  let m;
  while ((m = mdRe.exec(body)) !== null) {
    const url = cleanExtractedUrl(m[2]);
    if (url && !seen.has(url)) {
      results.push({ url, offset: m.index });
      seen.add(url);
    }
  }

  // Bare URLs (not inside markdown link parens or HTML attributes)
  const bareRe = /(?<!\(|"|')(https?:\/\/[^\s<>"')\]]+)/g;
  while ((m = bareRe.exec(body)) !== null) {
    const url = cleanExtractedUrl(m[1]);
    if (url && !seen.has(url)) {
      results.push({ url, offset: m.index });
      seen.add(url);
    }
  }

  return results;
}

function cleanExtractedUrl(url) {
  if (!url) return null;
  url = url.replace(/[.,;`]+$/, '');
  url = url.replace(/["']+$/, '');
  return url.startsWith('http') ? url : null;
}

// ─── URL replacement in files ───────────────────────────────────────

function replaceInFile(fileData, filePath, field, index, oldUrl, newUrl) {
  const data = fileData.get(filePath);
  if (!data) return;

  if (field === 'body') {
    const escaped = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(escaped + String.raw`(?=[\s)>"'\],]|$)`, 'g');
    data.body = data.body.replace(re, newUrl);
  } else if (field === 'social') {
    if (Array.isArray(data.header.social)) {
      const idx = data.header.social.indexOf(oldUrl);
      if (idx !== -1) {
        data.header.social[idx] = newUrl;
      }
    }
  } else {
    if (data.header[field] === oldUrl) {
      data.header[field] = newUrl;
    }
  }
  data.dirty = true;
}

// ─── Main logic ─────────────────────────────────────────────────────

async function main() {
  console.log('Collecting URLs from product files...');
  const { urlMap, fileData } = collectUrls();
  const totalRefs = [...urlMap.values()].reduce((s, e) => s + e.refs.length, 0);
  console.log(`Found ${urlMap.size} unique URLs across ${totalRefs} references in ${fileData.size} files`);

  // Migrate legacy #dead=DATE markers to #deadLink
  let migrated = 0;
  for (const [key, entry] of urlMap) {
    if (entry.parsed.state === 'deadLegacy') {
      const newUrl = addDeadMarker(entry.parsed.original);
      for (const ref of entry.refs) {
        const oldUrl = ref.rawUrl || entry.raw;
        replaceInFile(fileData, ref.file, ref.field, ref.index, oldUrl, newUrl);
      }
      // Update the entry so downstream logic sees it as 'dead'
      entry.raw = newUrl;
      entry.parsed.state = 'dead';
      entry.parsed.full = newUrl;
      migrated++;
    }
  }
  if (migrated > 0) {
    console.log(`Migrated ${migrated} legacy #dead=DATE markers to #deadLink`);
  }

  // Load cache to determine last-checked dates
  const cache = loadCache();

  // Build check list: skip domains, sort by oldest-checked
  const toCheck = [];
  let skippedDomain = 0;

  for (const [key, entry] of urlMap) {
    const domain = getDomain(key);
    if (SKIP_DOMAINS.has(domain)) {
      skippedDomain++;
      continue;
    }

    const cached = cache.get(key);
    const lastDate = cached?.date || '0000-00-00';

    // If URL is already dead/archived in files AND cache confirms it's dead,
    // no need to re-check frequently — only recheck if cache is stale
    toCheck.push({ key, entry, lastDate });
  }

  // Sort: oldest (or never-checked) first
  toCheck.sort((a, b) => a.lastDate.localeCompare(b.lastDate));

  const batch = toCheck.slice(0, BATCH_SIZE);
  console.log(`To check: ${batch.length} of ${toCheck.length} (skipping ${skippedDomain} on blocked domains)`);
  if (batch.length > 0) {
    console.log(`  Oldest in batch: last checked ${batch[0].lastDate === '0000-00-00' ? 'never' : batch[0].lastDate}`);
    console.log(`  Newest in batch: last checked ${batch[batch.length - 1].lastDate === '0000-00-00' ? 'never' : batch[batch.length - 1].lastDate}`);
  }

  // Check URLs
  let checked = 0;
  let changes = 0;
  const startTime = Date.now();
  const stats = { alive: 0, dead: 0, archived: 0, restored: 0, inconclusive: 0 };
  const todayResults = new Map(); // url → status (for cache)
  const deadDomains = new Set(); // domains confirmed dead (DNS/network failure)

  const tasks = batch.map(({ key, entry }) => async () => {
    const urlToCheck = key; // normalized URL
    const domain = getDomain(urlToCheck);

    // If domain is already confirmed dead, skip the HTTP check
    let result;
    if (deadDomains.has(domain)) {
      result = { alive: false, error: 'domain dead (propagated)' };
    } else {
      result = await checkAlive(urlToCheck);
    }

    checked++;
    if (checked % 50 === 0) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
      console.log(`  ${checked}/${batch.length} checked (${elapsed}s) — ${changes} changes`);
    }

    if (result.skipped) return; // shouldn't happen (filtered above) but safety

    // Track dead domains: if a URL fails with DNS/network error, mark the domain
    if (!result.alive && !result.inconclusive && result.error) {
      deadDomains.add(domain);
    }

    if (result.alive) {
      todayResults.set(urlToCheck, 'alive');

      if (entry.parsed.state === 'dead' || entry.parsed.state === 'archived') {
        // Was dead/archived, now alive → restore original URL
        console.log(`  ✅ Restored: ${urlToCheck}`);
        for (const ref of entry.refs) {
          const oldUrl = ref.rawUrl || entry.raw;
          replaceInFile(fileData, ref.file, ref.field, ref.index, oldUrl, urlToCheck);
        }
        stats.restored++;
        changes++;
      } else {
        stats.alive++;
      }
    } else if (result.inconclusive) {
      todayResults.set(urlToCheck, 'inconclusive');
      stats.inconclusive++;
    } else {
      // URL is dead
      todayResults.set(urlToCheck, 'dead');

      if (entry.parsed.state === 'dead' || entry.parsed.state === 'archived') {
        // Already marked — leave as-is
        stats.dead++;
      } else {
        // Newly dead — try archive.org
        const archiveUrl = await findArchive(urlToCheck);

        if (archiveUrl) {
          console.log(`  📦 Archived: ${urlToCheck}`);
          for (const ref of entry.refs) {
            const oldUrl = ref.rawUrl || entry.raw;
            replaceInFile(fileData, ref.file, ref.field, ref.index, oldUrl, archiveUrl);
          }
          stats.archived++;
        } else {
          const deadUrl = addDeadMarker(urlToCheck);
          console.log(`  💀 Dead: ${urlToCheck}`);
          for (const ref of entry.refs) {
            const oldUrl = ref.rawUrl || entry.raw;
            replaceInFile(fileData, ref.file, ref.field, ref.index, oldUrl, deadUrl);
          }
          stats.dead++;
        }
        changes++;
      }
    }
  });

  await runConcurrent(tasks, CONCURRENCY);

  // Write changed files
  let filesWritten = 0;
  if (!DRY_RUN) {
    for (const [filePath, data] of fileData) {
      if (!data.dirty) continue;
      const result = helper.getResult(data.header, data.body);
      fs.writeFileSync(filePath, result);
      filesWritten++;
    }

    // Save cache
    saveCache(todayResults);
  }

  // Summary
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
  console.log(`\n=== Summary (${elapsed}s) ===`);
  console.log(`  Checked: ${checked}/${urlMap.size} unique URLs`);
  console.log(`  Alive: ${stats.alive}`);
  console.log(`  Dead (newly marked): ${stats.dead}`);
  console.log(`  Archived (via archive.org): ${stats.archived}`);
  console.log(`  Restored (came back alive): ${stats.restored}`);
  console.log(`  Inconclusive (timeout/transient): ${stats.inconclusive}`);
  console.log(`  Total changes: ${changes}`);
  if (migrated > 0) {
    console.log(`  Legacy markers migrated: ${migrated}`);
  }
  if (DRY_RUN) {
    console.log(`  [DRY RUN] No files written`);
  } else {
    console.log(`  Files written: ${filesWritten}`);
    console.log(`  Cache: ${CACHE_FILE}`);
  }
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
