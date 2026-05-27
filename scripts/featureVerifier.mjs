#!/usr/bin/env node
/**
 * featureVerifier.mjs — LLM-assisted feature population for wallet reviews.
 *
 * Phases:
 *   --fetch   Scrape store listings + GitHub text, cache to scripts/cache/feature-text/
 *   --verify  Send cached text to LLM, save proposals to scripts/cache/feature-proposals/
 *   --apply   Apply proposals: add keys to frontmatter, insert featureEvidence includes
 *
 * Options:
 *   --id android/com.example.wallet   Scope to a single product
 *   --dry-run                         With --apply: print diff without writing
 *   --verdict sourceavailable         Filter by verdict
 *   --platform android                Filter by platform
 *
 * Environment:
 *   PPQ_API_KEY   API key for ppq.ai (required for --verify)
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { execSync } from 'child_process';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const yaml = require('js-yaml');
// ESM-default-exporting packages — must use .default when loaded via require()
const _gplay = require('google-play-scraper');
const gplay = _gplay.default || _gplay;
const { app } = require('@perttu/app-store-scraper');

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CACHE_TEXT_DIR = path.join(ROOT, 'scripts', 'cache', 'feature-text');
const CACHE_PROPOSALS_DIR = path.join(ROOT, 'scripts', 'cache', 'feature-proposals');
const FEATURES_YML = path.join(ROOT, '_data', 'features.yml');
const CACHE_MAX_AGE_DAYS = 30;

const PLATFORMS = { desktop: '_desktop', hardware: '_hardware' };
const MOBILE_DIR = '_mobile';
const TARGET_VERDICTS = new Set(['sourceavailable', 'obfuscated', 'nosource', 'custodial',
  'noita', 'sealed-noita', 'ecash', 'diy']);

const PPQ_API_URL = 'https://api.ppq.ai';
const PPQ_MODEL = 'claude-sonnet-4.6';

const args = process.argv.slice(2);
const hasFlag = f => args.includes(f);
const getArg = f => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };

const PHASE_FETCH    = hasFlag('--fetch');
const PHASE_VERIFY   = hasFlag('--verify');
const PHASE_APPLY    = hasFlag('--apply');
const PHASE_SANITIZE = hasFlag('--sanitize');
const DRY_RUN        = hasFlag('--dry-run');
const SINGLE_ID      = getArg('--id');
const FILTER_VERDICT  = getArg('--verdict');
const FILTER_PLATFORM = getArg('--platform');

if (!PHASE_FETCH && !PHASE_VERIFY && !PHASE_APPLY && !PHASE_SANITIZE) {
  console.error('Usage: node scripts/featureVerifier.mjs [--fetch] [--verify] [--apply] [--sanitize] [--dry-run] [--id platform/appId]');
  process.exit(1);
}

function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function readYaml(fp) { try { return yaml.load(fs.readFileSync(fp, 'utf8')); } catch { return null; } }
function writeYaml(fp, data) { ensureDir(path.dirname(fp)); fs.writeFileSync(fp, yaml.dump(data, { lineWidth: 120, quotingType: '"' }), 'utf8'); }

function parseFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  try { return yaml.load(m[1]); } catch { return null; }
}

function getReviewBody(content) {
  const m = content.match(/^---\n[\s\S]*?\n---\s*\n/);
  return m ? content.slice(m[0].length).trimEnd() : '';
}

let _featuresCache = null;
function loadFeaturesYml() {
  if (!_featuresCache) _featuresCache = readYaml(FEATURES_YML) || {};
  return _featuresCache;
}

function getOfficialFeatureKeys(fm) {
  const official = new Set(Object.keys(loadFeaturesYml()));
  return (fm?.features || []).filter(f => typeof f === 'string' && official.has(f));
}

const cacheTextPath     = (p, id) => path.join(CACHE_TEXT_DIR,      p, `${id}.yaml`);
const cacheProposalPath = (p, id) => path.join(CACHE_PROPOSALS_DIR, p, `${id}.yaml`);

function isCacheFresh(fp) {
  try { return Date.now() - fs.statSync(fp).mtimeMs < CACHE_MAX_AGE_DAYS * 86400000; }
  catch { return false; }
}

function fetchUrl(url, maxBytes = 80000) {
  return new Promise((resolve) => {
    const timeoutMs = 12000;
    const parsed = new URL(url);
    const mod = parsed.protocol === 'https:' ? https : http;
    const options = {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method: 'GET',
      headers: { 'User-Agent': 'WalletScrutiny/1.0' },
      timeout: timeoutMs,
    };
    let done = false;
    const finish = (val) => { if (!done) { done = true; resolve(val); } };

    try {
      const req = mod.request(options, (res) => {
        // Follow up to 5 redirects
        if ((res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308)
            && res.headers.location && options._redirects < 5) {
          res.resume();
          const next = new URL(res.headers.location, url);
          fetchUrl(next.href, maxBytes).then(finish);
          options._redirects = (options._redirects || 0) + 1;
          return;
        }
        const chunks = [];
        let total = 0;
        res.on('data', (chunk) => {
          total += chunk.length;
          chunks.push(chunk);
          if (total > maxBytes) { res.destroy(); }
        });
        res.on('end', () => finish(Buffer.concat(chunks).toString('utf8', 0, maxBytes)));
        res.on('error', () => finish(''));
      });
      req.on('timeout', () => { req.destroy(); finish(''); });
      req.on('error', () => finish(''));
      req.end();
    } catch { finish(''); }
  });
}

// Strip HTML tags and entities from website content.
// No length limit here — callers slice as needed.
function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&nbsp;/g,' ')
    .replace(/\s{3,}/g, '\n\n').trim();
}

// Strip markdown formatting from README text for LLM consumption:
// removes link syntax [text](url) → text, image embeds, inline code backticks.
// Leaves the actual text content intact — no length limit.
function stripMarkdown(md) {
  return md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')          // remove images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')        // links → text only
    .replace(/`([^`]+)`/g, '$1')                    // inline code
    .replace(/^```[\s\S]*?^```/gm, '')              // fenced code blocks
    .replace(/\s{3,}/g, '\n\n').trim();
}

async function fetchGitHubReadme(repoUrl) {
  if (!repoUrl) return '';
  const m = repoUrl.match(/https?:\/\/github\.com\/([^/]+\/[^/]+?)(?:\.git|\/tree\/([^/]+))?(?:\/?$)/);
  if (!m) return '';
  const slug = m[1], branch = m[2] || null;

  // Use GitHub API to find the canonical README filename and download URL.
  // Falls back to guessing common names if API is unavailable.
  const apiUrl = `https://api.github.com/repos/${slug}/readme` + (branch ? `?ref=${branch}` : '');
  const apiResp = await fetchUrl(apiUrl, 4096);
  if (apiResp) {
    try {
      const meta = JSON.parse(apiResp);
      if (meta.download_url) {
        const raw = await fetchUrl(meta.download_url); // no size limit
        if (raw && raw.length > 100) return raw;
      }
    } catch {}
  }

  // Fallback: try common filenames
  for (const br of branch ? [branch] : ['main', 'master'])
    for (const fn of ['README.md', 'README.markdown', 'readme.md', 'README.rst', 'README']) {
      const raw = await fetchUrl(`https://raw.githubusercontent.com/${slug}/${br}/${fn}`);
      if (raw && raw.length > 100) return raw;
    }
  return '';
}

async function fetchGitHubLicense(repoUrl) {
  if (!repoUrl) return '';
  const m = repoUrl.match(/https?:\/\/github\.com\/([^/]+\/[^/]+?)(?:\.git)?(?:\/?$)/);
  if (!m) return '';
  const slug = m[1];

  // Fetch a license file, following single-line indirection pointers (e.g. a file containing just "COPYING-CC")
  async function fetchLicenseFile(url) {
    const raw = await fetchUrl(url);
    if (!raw || raw.length < 10) return '';
    // If the file is a short single-line pointer to another file, follow it
    const trimmed = raw.trim();
    if (trimmed.length < 40 && !trimmed.includes('\n') && /^[\w.-]+$/.test(trimmed)) {
      // Looks like a filename pointer — fetch the actual file from the same directory
      const base = url.replace(/[^/]+$/, '');
      const followed = await fetchUrl(base + trimmed);
      if (followed && followed.length > 10) return followed;
    }
    return raw;
  }

  // Use GitHub API to find canonical license file
  const apiResp = await fetchUrl(`https://api.github.com/repos/${slug}/license`, 4096);
  if (apiResp) {
    try {
      const meta = JSON.parse(apiResp);
      if (meta.download_url) {
        const raw = await fetchLicenseFile(meta.download_url);
        if (raw && raw.length > 10) return raw;
      }
    } catch {}
  }

  // Fallback: try common filenames
  for (const br of ['main', 'master'])
    for (const fn of ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'LICENCE', 'COPYING', 'COPYING-CC', 'COPYING.md']) {
      const raw = await fetchLicenseFile(`https://raw.githubusercontent.com/${slug}/${br}/${fn}`);
      if (raw && raw.length > 10) return raw;
    }
  return '';
}

async function scrapePlayStore(appId, country = 'us') {
  try {
    return await Promise.race([
      gplay.app({ appId, lang: 'en', country }).then(r => r.description || '').catch(() => ''),
      new Promise(resolve => setTimeout(() => resolve(''), 8000)),
    ]);
  } catch { return ''; }
}
async function scrapeAppStore(idd, country = 'us') {
  if (!idd) return '';
  try { return (await app({ id: String(idd), country })).description || ''; } catch { return ''; }
}

function flattenMobileFm(mobile, plat) {
  const block = mobile[plat] || {};
  const {
    date: _platformDate,
    title: _platformTitle,
    website: _platformWebsite,
    twitter: _platformTwitter,
    meta: _meta,
    verdict: _verdict,
    ...blockFields
  } = block;
  return {
    ...mobile,
    ...blockFields,
    appId: block.appId,
    idd: block.idd,
    appCountry: block.appCountry ?? mobile.appCountry,
    title: mobile.title,
    website: mobile.website,
    twitter: mobile.twitter,
    date: mobile.date,
    meta: block.meta || 'ok',
    verdict: mobile.verdict,
  };
}

function getMobileProducts() {
  const products = [];
  const dir = path.join(ROOT, MOBILE_DIR);
  if (!fs.existsSync(dir)) return products;
  for (const fn of fs.readdirSync(dir).sort()) {
    if (!fn.endsWith('.md')) continue;
    const filepath = path.join(dir, fn);
    const content = fs.readFileSync(filepath, 'utf8');
    const mobile = parseFrontmatter(content);
    if (!mobile) continue;
    for (const plat of ['android', 'iphone']) {
      if (FILTER_PLATFORM && FILTER_PLATFORM !== plat) continue;
      const block = mobile[plat];
      if (!block?.appId && !(plat === 'iphone' && block?.idd)) continue;
      const appId = block.appId || fn.slice(0, -3);
      if (SINGLE_ID && SINGLE_ID !== `${plat}/${appId}`) continue;
      const fm = flattenMobileFm(mobile, plat);
      if (fm.meta !== 'ok' || !TARGET_VERDICTS.has(fm.verdict)) continue;
      if (FILTER_VERDICT && fm.verdict !== FILTER_VERDICT) continue;
      products.push({ plat, appId, filepath, fm, content });
    }
  }
  return products;
}

function getAllProducts() {
  const products = getMobileProducts();
  for (const [plat, folder] of Object.entries(PLATFORMS)) {
    if (FILTER_PLATFORM && FILTER_PLATFORM !== plat) continue;
    const dir = path.join(ROOT, folder);
    if (!fs.existsSync(dir)) continue;
    for (const fn of fs.readdirSync(dir).sort()) {
      if (!fn.endsWith('.md')) continue;
      const appId = fn.slice(0, -3);
      if (SINGLE_ID && SINGLE_ID !== `${plat}/${appId}`) continue;
      const filepath = path.join(dir, fn);
      const content = fs.readFileSync(filepath, 'utf8');
      const fm = parseFrontmatter(content);
      if (!fm || fm.meta !== 'ok' || !TARGET_VERDICTS.has(fm.verdict)) continue;
      if (FILTER_VERDICT && fm.verdict !== FILTER_VERDICT) continue;
      products.push({ plat, appId, filepath, fm, content });
    }
  }
  return products;
}

// ── Phase 1: Fetch ────────────────────────────────────────────────────────────

async function fetchOne({ plat, appId, fm, content }) {
  const cachePath = cacheTextPath(plat, appId);
  if (isCacheFresh(cachePath)) return 'skip';
  const reviewBody = getReviewBody(content);
  const repoUrl = fm.repository || '';

  // Fire all network calls in parallel
  const [description, readmeRaw, license, websiteRaw] = await Promise.all([
    plat === 'android' && fm.appId  ? scrapePlayStore(fm.appId, fm.appCountry || 'us')  :
    plat === 'iphone'  && fm.idd    ? scrapeAppStore(String(fm.idd), fm.appCountry || 'us') :
    Promise.resolve(''),
    fetchGitHubReadme(repoUrl),
    fetchGitHubLicense(repoUrl),
    fm.website ? fetchUrl(fm.website) : Promise.resolve(''),
  ]);

  const readme      = readmeRaw ? stripMarkdown(readmeRaw) : '';
  const websiteText = websiteRaw ? stripHtml(websiteRaw) : '';

  writeYaml(cachePath, {
    appId, platform: plat, title: fm.title||'', verdict: fm.verdict||'',
    fetchedAt: new Date().toISOString(),
    description: description ? stripHtml(description) : '',
    readme: readme||'', license: license||'',
    websiteText: websiteText||'', reviewBody: reviewBody||'',
  });
  return 'ok';
}

async function runPool(items, concurrency, worker) {
  // Generic concurrency pool: runs worker(item) for each item with at most
  // `concurrency` in-flight at once. Truly async — no execSync inside workers.
  return new Promise((resolve, reject) => {
    let idx = 0, active = 0;
    if (items.length === 0) return resolve();
    function next() {
      while (active < concurrency && idx < items.length) {
        const item = items[idx++];
        active++;
        Promise.resolve(worker(item))
          .catch(() => {})  // errors handled inside worker
          .finally(() => {
            active--;
            if (active === 0 && idx >= items.length) resolve();
            else next();
          });
      }
    }
    next();
  });
}

async function phaseFetch(products, concurrency = 10) {
  console.log(`\n── FETCH (${products.length} products, ${concurrency} parallel) ──`);
  let fetched = 0, skipped = 0, errors = 0;
  await runPool(products, concurrency, async (product) => {
    const { plat, appId } = product;
    try {
      const result = await fetchOne(product);
      if (result === 'skip') skipped++;
      else { fetched++; process.stdout.write(`  ${plat}/${appId} ok\n`); }
    } catch (err) {
      errors++;
      process.stdout.write(`  ${plat}/${appId} ERROR: ${err.message?.slice(0, 60)}\n`);
    }
  });
  console.log(`\nFetched: ${fetched}  Skipped (fresh cache): ${skipped}  Errors: ${errors}`);
}

// ── Phase 2: Verify ───────────────────────────────────────────────────────────

// Build the per-product user prompt (the non-cached portion)
function buildPrompt(record, featuresData, existingFeatures) {
  const existingSet = new Set(existingFeatures);
  const remainingFeatures = Object.keys(featuresData).filter(k => !existingSet.has(k));
  
  // If all features already confirmed, skip LLM call
  if (remainingFeatures.length === 0) return null;

  const alreadyNote = existingFeatures.length > 0
    ? `Already confirmed (DO NOT include in response): ${existingFeatures.join(', ')}`
    : 'No features confirmed yet.';

  // 50k token limit ≈ 200k chars. Websites can be large; cap at 80k chars.
  const WEBSITE_MAX = 80_000;

  const textSections = [
    record.reviewBody   && `## Existing WalletScrutiny review\n${record.reviewBody}`,
    record.description  && `## Store description\n${record.description}`,
    record.readme       && `## GitHub README\n${record.readme}`,
    record.license      && `## License\n${record.license}`,
    record.websiteText  && `## Website\n${record.websiteText.slice(0, WEBSITE_MAX)}`,
  ].filter(Boolean).join('\n\n');

  return `Find features for "${record.title}" (${record.platform}/${record.appId}).

${alreadyNote}

Respond with ONLY a YAML code block. No prose, no explanation, no text outside the code block.

## Source text
${textSections}`;
}

// Build the reusable system/instructions portion for prompt caching.
// This is identical for every product — Anthropic caches it automatically
// when we mark it with cache_control.
function buildSystemPrompt(featuresData) {
  const featuresToCheck = Object.entries(featuresData)
    .map(([k, v]) => {
      const short = v?.short || k;
      const long = (v?.long || '').replace(/<[^>]+>/g, '').trim();
      return long ? `### ${k}: ${short}\n${long}` : `### ${k}: ${short}`;
    })
    .join('\n\n');

  return `You are a Bitcoin wallet feature analyst for WalletScrutiny.

## Features to check
Only report features where the source text explicitly supports them. Definitions below.

${featuresToCheck}

## RULES
1. LN vs Liquid: Lightning Network (instant off-chain Bitcoin payments) and Liquid (Blockstream sidechain, L-BTC) are completely different. Do not confuse them.
2. cashu vs liquid: cashu is an ecash protocol. Liquid is a sidechain. Not related.
3. ownLN means the user connects to their OWN Lightning node. Custodial Lightning (e.g. Spark, Wallet of Satoshi) does NOT qualify.
4. companion: Tag software products (android/iphone/desktop) that can act as the network-side companion to a hardware wallet or signing device — i.e. the app that handles connectivity, transaction preparation, and broadcasting while the hardware device holds the keys. The connection method is irrelevant (USB, QR, NFC, Bluetooth, OTG — all count). Examples: Mycelium+Trezor, Sparrow+Trezor, Specter Desktop+Specter-DIY, Envoy+Passport. NEVER tag hardware or bearer platform products — hardware wallets are the signing device, not the companion. Tag the hot wallet side only.
5. foss: ONLY if the License file contains a recognized FOSS license (MIT, GPL, Apache, AGPL, MPL, etc.) AND does NOT contain "Commons Clause" or other commercial-use restrictions. MIT + Commons Clause is NOT FOSS. Source-available and reproducible-builds licenses do NOT qualify.
6. Quote must be a verbatim plain-text excerpt from the named source — no paraphrasing, no markdown links or image syntax.
7. Evidence found only in the Review body: do NOT return — already documented.
8. Be conservative. If unsure, omit.

## Response format
Return YAML only. For each feature, include source ("Store", "README", "License") and a verbatim quote.

\`\`\`yaml
features:
  - ln:
      source: "Store"
      quote: "Send and receive Lightning payments instantly"
  - foss:
      source: "License"  
      quote: "MIT License"
  - coinCtrl:
      source: "README"
      quote: "Select which UTXOs to spend in advanced settings"
      comment: "Implies coin control functionality"
\`\`\`

If no new features: \`\`\`yaml\nfeatures: []\n\`\`\``;
}

// Cache the system prompt in-memory to avoid rebuilding for every product
let _systemPromptCache = null;

async function callLLM(productPrompt, featuresData) {
  const apiKey = process.env.PPQ_API_KEY;
  if (!apiKey) throw new Error('PPQ_API_KEY environment variable not set');
  
  if (!_systemPromptCache) {
    _systemPromptCache = buildSystemPrompt(featuresData);
  }
  
  const requestBody = JSON.stringify({
    model: PPQ_MODEL,
    max_tokens: 1024,
    system: [
      { type: 'text', text: _systemPromptCache, cache_control: { type: 'ephemeral' } }
    ],
    messages: [{ role: 'user', content: productPrompt }]
  });

  return new Promise((resolve, reject) => {
    const ppqUrl = new URL(`${PPQ_API_URL}/v1/chat/completions`);
    const options = {
      hostname: ppqUrl.hostname,
      port: ppqUrl.port || 443,
      path: ppqUrl.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(requestBody),
      },
      timeout: 60000,
    };
    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
          if (parsed.error) return reject(new Error(JSON.stringify(parsed.error)));
          if (parsed.usage?.cache_creation_input_tokens)
            process.stdout.write(`[cache:create] `);
          else if (parsed.usage?.cache_read_input_tokens)
            process.stdout.write(`[cache:hit] `);
          resolve(parsed.choices?.[0]?.message?.content || '');
        } catch (e) { reject(e); }
      });
      res.on('error', reject);
    });
    req.on('timeout', () => { req.destroy(); reject(new Error('LLM request timed out')); });
    req.on('error', reject);
    req.write(requestBody);
    req.end();
  });
}

function parseYamlFromLLMResponse(response) {
  // Strip optional outer prose, extract content inside ```yaml ... ``` or ``` ... ```
  const m = response.match(/```ya?ml\s*([\s\S]*?)```/i) || response.match(/```\s*([\s\S]*?)```/);
  const raw = (m ? m[1] : response).trim();
  // Remove any remaining backtick fence lines (Sonnet sometimes double-wraps)
  const cleaned = raw.replace(/^```ya?ml?\s*/im, '').replace(/^```\s*$/m, '').trim();
  try { return yaml.load(cleaned); }
  catch (e) { console.error(`  YAML parse error: ${e.message.slice(0, 80)}`); return null; }
}

// Validate that a quote actually exists in the claimed source text
function validateQuote(evidence, record) {
  if (!evidence.quote || !evidence.source) return false;
  
  // Extract source keyword from "Store", "README", "License", or markdown link
  let sourceKey = evidence.source;
  const mdMatch = evidence.source.match(/^\[([^\]]+)\]\s*\(/);
  if (mdMatch) sourceKey = mdMatch[1]; // "[Store](url)" → "Store"
  
  // Normalize: lowercase, collapse whitespace for fuzzy matching
  const normalize = s => s.toLowerCase().replace(/\s+/g, ' ').trim();
  const normalizedQuote = normalize(evidence.quote);
  
  // Map source keyword to the actual text content
  const sourceMap = {
    'store': record.description,
    'store description': record.description,
    'play store': record.description,
    'app store': record.description,
    'readme': record.readme,
    'github readme': record.readme,
    'license': record.license,
    'website': record.websiteText,
  };
  
  const sourceText = sourceMap[normalize(sourceKey)] || '';
  if (!sourceText) return false;
  
  // Check for exact or near-exact match (allowing for HTML entity variations)
  const normalizedSource = normalize(sourceText);
  return normalizedSource.includes(normalizedQuote);
}

async function verifyOne({ plat, appId, fm }, featuresData, official) {
  const textPath     = cacheTextPath(plat, appId);
  const proposalPath = cacheProposalPath(plat, appId);
  if (!fs.existsSync(textPath)) return { status: 'skip-no-text', plat, appId };
  if (isCacheFresh(proposalPath)) return { status: 'skip-fresh', plat, appId };
  const record = readYaml(textPath);
  if (!record) return { status: 'skip-no-record', plat, appId };

  const existingFeatures = getOfficialFeatureKeys(fm);
  const prompt = buildPrompt(record, featuresData, existingFeatures);
  if (!prompt) {
    writeYaml(proposalPath, { appId, platform: plat, title: fm.title||'', verdict: fm.verdict||'', verifiedAt: new Date().toISOString(), model: PPQ_MODEL, existingFeatures, proposedEvidence: [] });
    return { status: 'skip-no-prompt', plat, appId };
  }

  try {
    const response = await callLLM(prompt, featuresData);
    const parsed = parseYamlFromLLMResponse(response);
    if (!parsed) return { status: 'error-parse', plat, appId, err: 'YAML parse failed' };

    const rawFeatures = Array.isArray(parsed.features) ? parsed.features : [];
    const proposedEvidence = [];
    let invalidQuotes = 0;
    
    for (const entry of rawFeatures) {
      if (typeof entry === 'string') {
        if (official.has(entry) && !existingFeatures.includes(entry))
          proposedEvidence.push({ key: entry, comment: '(no justification provided by LLM)' });
      } else if (typeof entry === 'object' && entry !== null) {
        for (const [key, val] of Object.entries(entry)) {
          if (!official.has(key) || existingFeatures.includes(key)) continue;
          if (typeof val === 'object' && val !== null) {
            // Validate quote before accepting
            if (val.quote && !validateQuote(val, record)) {
              invalidQuotes++;
              continue; // Skip fabricated quotes
            }
            proposedEvidence.push({ key, ...val });
          } else {
            proposedEvidence.push({ key, comment: '(no justification provided by LLM)' });
          }
        }
      }
    }
    
    const seen = new Set();
    const deduped = proposedEvidence.filter(e => seen.has(e.key) ? false : seen.add(e.key));
    writeYaml(proposalPath, { appId, platform: plat, title: fm.title||'', verdict: fm.verdict||'', verifiedAt: new Date().toISOString(), model: PPQ_MODEL, existingFeatures, proposedEvidence: deduped });
    return { status: 'ok', plat, appId, count: deduped.length, withSource: deduped.filter(e=>e.source).length, invalidQuotes };
  } catch (e) { return { status: 'error', plat, appId, err: e.message }; }
}

async function phaseVerify(products, concurrency = 10) {
  console.log(`\n── VERIFY (${products.length} products, ${concurrency} parallel) ──`);
  const featuresData = loadFeaturesYml();
  const official = new Set(Object.keys(featuresData));
  let done = 0, skipped = 0, errors = 0, totalInvalid = 0;

  await runPool(products, concurrency, async (product) => {
    const r = await verifyOne(product, featuresData, official);
    if (r.status === 'ok') {
      done++;
      totalInvalid += r.invalidQuotes || 0;
      const invNote = r.invalidQuotes ? ` [${r.invalidQuotes} rejected]` : '';
      process.stdout.write(`  ${r.plat}/${r.appId} ok (${r.count} new, ${r.withSource} source)${invNote}\n`);
    } else if (r.status.startsWith('skip')) {
      skipped++;
    } else {
      errors++;
      process.stdout.write(`  ${r.plat}/${r.appId} ERROR: ${r.err?.slice(0,80)}\n`);
    }
  });
  console.log(`\nVerified: ${done}  Skipped: ${skipped}  Errors: ${errors}  Invalid quotes rejected: ${totalInvalid}`);
}

// ── Phase 3: Apply ────────────────────────────────────────────────────────────

function setFeaturesInFrontmatter(content, features) {
  const m = content.match(/^(---\n)([\s\S]*?)(\n---)/);
  if (!m) return content;
  const newBlock = features.length > 0 ? 'features:\n' + features.map(f => `- ${f}\n`).join('') : 'features:\n';
  return m[1] + m[2].replace(/^features:\s*\n(?:- .+\n)*/m, newBlock) + m[3] + content.slice(m[0].length);
}

function sanitizeQuote(s) {
  if (!s) return s;
  // Strip markdown images: ![alt](url)
  s = s.replace(/!\[[^\]]*\]\([^)]*\)/g, '');
  // Strip markdown links: [text](url) → text
  s = s.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  // Collapse whitespace
  s = s.replace(/\s{2,}/g, ' ').trim();
  return s;
}

// Inject a text fragment (#:~:text=…) into a markdown link's URL so the browser
// scrolls to and highlights the quoted text when the link is clicked.
// Takes a source string like "[Store listing](https://…)" and a quote string.
// Returns the source string with the fragment appended to the URL.
// If the source is a bare keyword (no URL) or quote is empty, returns it unchanged.
function injectTextFragment(source, quote) {
  if (!source || !quote) return source;
  // Match a markdown link: [label](url)
  const m = source.match(/^(\[[^\]]*\]\()([^)]+)(\).*)$/);
  if (!m) return source; // bare keyword like "Store", "README", "License" — no URL to modify
  const [, open, url, close] = m;
  // Don't double-add a fragment
  if (url.includes('#')) return source;
  // Build a short, unique snippet: words 2-6 of the quote (5 words)
  // Skip the first word in case it was stripped/sanitized
  const words = quote.replace(/\s+/g, ' ').trim().split(' ');
  const snippet = words.slice(1, 6).join(' ');
  const fragment = encodeURIComponent(snippet);
  return `${open}${url}#:~:text=${fragment}${close}`;
}

function appendEvidenceToBody(content, evidenceList) {
  let body = getReviewBody(content);
  const fmEnd = content.match(/^---\n[\s\S]*?\n---\s*\n/);
  const prefix = fmEnd ? content.slice(0, fmEnd[0].length) : content;
  for (const ev of evidenceList) {
    const esc = s => (s || '').replace(/"/g, '&quot;').replace(/\n/g, ' ').trim();
    const cleanQuote = sanitizeQuote(ev.quote);
    const sourceWithFragment = injectTextFragment(ev.source, cleanQuote);
    const attrs = [
      `feature="${ev.key}"`,
      cleanQuote          && `quote="${esc(cleanQuote)}"`,
      sourceWithFragment  && `source="${esc(sourceWithFragment)}"`,
      ev.comment          && `comment="${esc(ev.comment)}"`,
    ].filter(Boolean).join(' ');
    body = body + `\n\n{% include featureEvidence.html ${attrs} %}`;
  }
  return prefix + body;
}

async function phaseApply(products) {
  console.log(`\n── APPLY${DRY_RUN ? ' (dry-run)' : ''} ──`);
  const official = new Set(Object.keys(loadFeaturesYml()));
  let applied = 0, skipped = 0;

  for (const { plat, appId, filepath, fm, content } of products) {
    const proposalPath = cacheProposalPath(plat, appId);
    if (!fs.existsSync(proposalPath)) { skipped++; continue; }
    const proposal = readYaml(proposalPath);
    if (!proposal) { skipped++; continue; }

    const existingFeatures = getOfficialFeatureKeys(fm);
    const evidence = (proposal.proposedEvidence || []).filter(e => official.has(e.key));
    const toAdd = evidence.map(e => e.key).filter(k => !existingFeatures.includes(k));
    if (toAdd.length === 0) { skipped++; continue; }

    const newFeatures = [...new Set([...existingFeatures, ...toAdd])].sort();

    if (DRY_RUN) {
      console.log(`\n  ${plat}/${appId}: +${toAdd.join(', ')}`);
      for (const ev of evidence.filter(e => toAdd.includes(e.key))) {
        console.log(`    ${ev.key}: ${ev.comment||''}`);
        if (ev.quote)  console.log(`      quote: ${ev.quote.slice(0,80)}`);
        if (ev.source) console.log(`      source: ${ev.source}`);
      }
      applied++; continue;
    }

    let newContent = setFeaturesInFrontmatter(content, newFeatures);
    newContent = appendEvidenceToBody(newContent, evidence.filter(e => toAdd.includes(e.key)));
    fs.writeFileSync(filepath, newContent, 'utf8');
    console.log(`  ${plat}/${appId}: +${toAdd.join(', ')}`);
    applied++;
  }

  console.log(`\nApplied: ${applied}  Skipped (no changes): ${skipped}`);
}

// ── Sanitize: strip invalid keys from all product frontmatter → freeform_features.yaml ──

const FREEFORM_PATH = path.join(ROOT, 'freeform_features.yaml');

function loadFreeform() {
  try { return yaml.load(fs.readFileSync(FREEFORM_PATH, 'utf8')) || {}; }
  catch { return {}; }
}

function saveFreeform(data) {
  fs.writeFileSync(FREEFORM_PATH, yaml.dump(data, { lineWidth: 200 }), 'utf8');
}

async function phaseSanitize() {
  const official = new Set(Object.keys(loadFeaturesYml()));
  const freeform = loadFreeform();
  let totalStripped = 0;
  let totalFiles = 0;
  const filesToCommit = [];
  const sanitizedPaths = new Set();

  function sanitizeFeaturesFile({ filepath, content, appKey, rawFeatures }) {
    if (!Array.isArray(rawFeatures) || rawFeatures.length === 0) return;

    const valid = [];
    const invalid = [];
    for (const f of rawFeatures) {
      if (typeof f === 'string' && official.has(f)) {
        valid.push(f);
      } else {
        const str = typeof f === 'string' ? f : JSON.stringify(f);
        invalid.push(str);
      }
    }

    if (invalid.length === 0) return;

    console.log(`  ${appKey}: stripping ${invalid.length} invalid → freeform`);
    for (const s of invalid) console.log(`    - ${s}`);

    if (!DRY_RUN) {
      const newContent = setFeaturesInFrontmatter(content, valid);
      fs.writeFileSync(filepath, newContent, 'utf8');
      filesToCommit.push(filepath);
      sanitizedPaths.add(filepath);

      const existing = new Set(freeform[appKey] || []);
      for (const s of invalid) existing.add(s);
      freeform[appKey] = [...existing];
    }

    totalStripped += invalid.length;
    totalFiles++;
  }

  const mobileDir = path.join(ROOT, MOBILE_DIR);
  if (fs.existsSync(mobileDir)) {
    for (const fn of fs.readdirSync(mobileDir).sort()) {
      if (!fn.endsWith('.md')) continue;
      const filepath = path.join(mobileDir, fn);
      const content = fs.readFileSync(filepath, 'utf8');
      const fm = parseFrontmatter(content);
      if (!fm) continue;
      sanitizeFeaturesFile({
        filepath,
        content,
        appKey: `mobile/${fn.slice(0, -3)}`,
        rawFeatures: fm.features || [],
      });
    }
  }

  for (const [plat, folder] of Object.entries(PLATFORMS)) {
    const dir = path.join(ROOT, folder);
    if (!fs.existsSync(dir)) continue;
    for (const fn of fs.readdirSync(dir).sort()) {
      if (!fn.endsWith('.md')) continue;
      const filepath = path.join(dir, fn);
      const content = fs.readFileSync(filepath, 'utf8');
      const fm = parseFrontmatter(content);
      if (!fm) continue;
      sanitizeFeaturesFile({
        filepath,
        content,
        appKey: `${plat}/${fn.slice(0, -3)}`,
        rawFeatures: fm.features || [],
      });
    }
  }

  if (!DRY_RUN && totalFiles > 0) {
    saveFreeform(freeform);
  }

  if (DRY_RUN) console.log(`\n[dry-run] Would strip ${totalStripped} invalid key(s) from ${totalFiles} file(s)`);
  else if (totalFiles === 0) console.log('✓ All feature keys are valid — nothing to sanitize');
  else console.log(`\nDone: stripped ${totalStripped} key(s) from ${totalFiles} file(s) → freeform_features.yaml`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

const products = getAllProducts();
console.log(`Products: ${products.length} qualifying`);

if (PHASE_SANITIZE) await phaseSanitize();
if (PHASE_FETCH)  await phaseFetch(products);
if (PHASE_VERIFY) await phaseVerify(products);
if (PHASE_APPLY)  { await phaseSanitize(); await phaseApply(products); }
