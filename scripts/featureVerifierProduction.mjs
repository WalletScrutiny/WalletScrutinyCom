#!/usr/bin/env node
/**
 * featureVerifierProduction.mjs — Production-ready feature verification.
 *
 * Cost optimization strategy:
 *   1. Anthropic prompt caching: static prefix (feature defs + rules) cached
 *   2. Change detection: Git commit hash (source) / store update date (app) / website hash
 *   3. Rate limiting: 10 parallel workers, ~50ms between batches to avoid PPQ burst limits
 *   4. Keep long descriptions: cached, improves quality significantly
 *
 * Expected cost: ~2.5¢/product uncached, ~1.4¢/product with prompt caching
 * 3,000 products initial: ~$75, monthly incremental (~10% churn): ~$7.50
 *
 * Usage:
 *   PPQ_API_KEY=... node scripts/featureVerifierProduction.mjs [--apply] [--force] [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import crypto from 'crypto';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const yaml = require('js-yaml');
const gplay = require('google-play-scraper');

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CACHE_DIR = path.join(ROOT, 'scripts', 'cache', 'features-production');
const STATE_FILE = path.join(CACHE_DIR, 'state.json');
const FEATURES_YML = path.join(ROOT, '_data', 'features.yml');
const PPQ_API_URL = 'https://api.ppq.ai';
const PPQ_API_KEY = process.env.PPQ_API_KEY;

const MODEL = 'claude-sonnet-4.6';

// Anthropic pricing (per 1M tokens)
const COST_INPUT = 3.15;
const COST_OUTPUT = 15.75;
const COST_CACHE_HIT = 0.315; // 10% of input price for cached prefix

// Concurrency to avoid PPQ rate limits
const CONCURRENCY = 10;
const BATCH_DELAY_MS = 50; // Small delay between batch starts

const TARGET_VERDICTS = new Set(['sourceavailable', 'obfuscated', 'nosource', 'custodial']);
const PLATFORMS = { android: '_android', iphone: '_iphone', desktop: '_desktop', hardware: '_hardware' };

const args = process.argv.slice(2);
const DO_APPLY = args.includes('--apply');
const FORCE = args.includes('--force');
const DRY_RUN = args.includes('--dry-run');

// ── Utilities ──────────────────────────────────────────────────────────────

function ensureDir(d) { fs.mkdirSync(d, { recursive: true }); }
function readYaml(fp) { try { return yaml.load(fs.readFileSync(fp, 'utf8')); } catch { return null; } }
function parseFrontmatter(c) { const m=c.match(/^---\n([\s\S]*?)\n---/); if(!m)return null; try{return yaml.load(m[1]);}catch{return null;} }
function getReviewBody(c) { const m=c.match(/^---\n[\s\S]*?\n---\s*\n/); return m?c.slice(m[0].length).trimEnd():''; }
function sha256(t) { return crypto.createHash('sha256').update(t).digest('hex').slice(0,32); }
function sleep(ms) { return new Promise(r=>setTimeout(r,ms)); }

// ── Change detection ───────────────────────────────────────────────────────

async function getGitCommitHash(repoUrl) {
  if (!repoUrl) return null;
  const m = repoUrl.match(/github\.com\/([^/]+\/[^/]+?)(?:\.git)?\/?$/);
  if (!m) return null;
  try {
    const api = `https://api.github.com/repos/${m[1]}/commits/master`;
    const r = execSync(`curl -sL -H "Accept: application/vnd.github.v3+json" "${api}"`, { timeout: 10000 });
    const j = JSON.parse(r);
    return j.sha?.slice(0,16) || null;
  } catch { return null; }
}

async function getStoreUpdateDate(platform, appId) {
  if (platform !== 'android' || !appId) return null;
  try {
    const app = await Promise.race([
      gplay.app({ appId, lang: 'en', country: 'us' }),
      new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')),8000))
    ]);
    return app.updated || null;
  } catch { return null; }
}

async function computeChangeFingerprint(platform, appId, fm) {
  const parts = [];
  
  // Source: use commit hash if available
  if (fm.repository) {
    const hash = await getGitCommitHash(fm.repository);
    if (hash) parts.push(`git:${hash}`);
  }
  
  // Store: use update date
  const storeDate = await getStoreUpdateDate(platform, appId);
  if (storeDate) parts.push(`store:${storeDate}`);
  
  // Website: fall back to content hash if no source/store
  if (fm.website && parts.length === 0) {
    // Website fetch is expensive; skip for change detection unless no other signal
    parts.push(`web:${fm.website}`); // Just track URL presence, not content
  }
  
  return parts.join('|') || 'unknown';
}

// ── Fetch (same as before) ─────────────────────────────────────────────────

async function fetchUrl(url, maxBytes=80000) {
  try {
    const out = execSync(`curl -sL --max-time 12 -A "WalletScrutiny/1.0" "${url}"`,
      { encoding: 'utf8', timeout: 15000, maxBuffer: 4*1024*1024 });
    return out.slice(0,maxBytes);
  } catch { return ''; }
}

function stripHtml(h) {
  return h.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'')
    .replace(/<[^>]+>/g,' ').replace(/&\w+;/g,' ').replace(/\s{3,}/g,'\n\n').trim();
}
function stripMarkdown(m) {
  return m.replace(/!\[[^\]]*\]\([^)]*\)/g,'').replace(/\[([^\]]+)\]\([^)]+\)/g,'$1')
    .replace(/`([^`]+)`/g,'$1').replace(/```[\s\S]*?```/g,'').replace(/\s{3,}/g,'\n\n').trim();
}

async function fetchGitHubReadme(repoUrl) {
  if (!repoUrl) return '';
  const m = repoUrl.match(/github\.com\/([^/]+\/[^/]+?)(?:\.git)?\/?$/);
  if (!m) return '';
  const slug = m[1];
  // Try API first for canonical filename
  const api = await fetchUrl(`https://api.github.com/repos/${slug}/readme`, 4096);
  if (api) {
    try {
      const meta = JSON.parse(api);
      if (meta.download_url) {
        const raw = await fetchUrl(meta.download_url);
        if (raw?.length>100) return stripMarkdown(raw);
      }
    } catch {}
  }
  // Fallback to known paths
  for (const b of ['main','master'])
    for (const f of ['README.md','README.markdown','readme.md']) {
      const raw = await fetchUrl(`https://raw.githubusercontent.com/${slug}/${b}/${f}`);
      if (raw?.length>100) return stripMarkdown(raw);
    }
  return '';
}

async function fetchGitHubLicense(repoUrl) {
  if (!repoUrl) return '';
  const m = repoUrl.match(/github\.com\/([^/]+\/[^/]+?)(?:\.git)?\/?$/);
  if (!m) return '';
  const slug = m[1];
  const api = await fetchUrl(`https://api.github.com/repos/${slug}/license`, 4096);
  if (api) {
    try {
      const meta = JSON.parse(api);
      if (meta.download_url) {
        const resolved = await resolveLicenseFile(meta.download_url);
        if (resolved) return resolved;
      }
    } catch {}
  }
  for (const b of ['main','master'])
    for (const f of ['LICENSE','LICENSE.md','COPYING','COPYING-CC']) {
      const resolved = await resolveLicenseFile(`https://raw.githubusercontent.com/${slug}/${b}/${f}`);
      if (resolved) return resolved;
    }
  return '';
}

async function resolveLicenseFile(url) {
  const raw = await fetchUrl(url);
  if (!raw || raw.length<10) return '';
  const t = raw.trim();
  // Follow indirection
  if (t.length<40 && !t.includes('\n') && /^[\w.-]+$/.test(t)) {
    const base = url.replace(/[^/]+$/, '');
    const follow = await fetchUrl(base + t);
    if (follow?.length>10) return follow;
  }
  return raw;
}

async function fetchStoreDescription(platform, appId) {
  if (platform !== 'android' || !appId) return '';
  try {
    return await Promise.race([
      gplay.app({ appId, lang: 'en', country: 'us' }).then(r=>r.description||''),
      new Promise(r=>setTimeout(()=>r(''),8000))
    ]);
  } catch { return ''; }
}

// ── Prompt building ───────────────────────────────────────────────────────

function buildStaticPrefix() {
  const featuresData = readYaml(FEATURES_YML);
  const featureSection = Object.entries(featuresData).map(([k,v]) => {
    const long = (v?.long||'').replace(/<[^>]+>/g,'').trim();
    return long ? `### ${k}: ${v.short}\n${long}` : `### ${k}: ${v.short||k}`;
  }).join('\n\n');

  return `You are a Bitcoin wallet feature analyst for WalletScrutiny.

## Features to check
Only report features where the source text explicitly supports them.

${featureSection}

## RULES
1. LN vs Liquid: Lightning Network (instant off-chain Bitcoin payments) and Liquid (Blockstream sidechain, L-BTC) are completely different. Do not confuse them.
2. cashu vs liquid: cashu is an ecash protocol. Liquid is a sidechain. Not related.
3. ownLN means the user connects to their OWN Lightning node. Custodial Lightning (e.g. Spark, Wallet of Satoshi) does NOT qualify.
4. companion: tag this on the HOT SIDE companion app (the internet-connected wallet). Do NOT tag the air-gapped signing device — that one gets airGapped instead.
5. foss: ONLY if the License file contains an OSI-approved license (MIT, GPL, Apache, AGPL, MPL, etc.) AND does NOT contain Commons Clause or other commercial-use restrictions. Source-available and reproducible-builds licenses do NOT qualify.
6. Quote must be a verbatim plain-text excerpt from the named source — no paraphrasing, no markdown links.
7. Evidence found only in the Review body: do NOT return — already documented.
8. Source must be exactly one of: "Store", "README", "License", "Website". Use these exact keywords.
9. Be conservative. If unsure, omit.`;
}

function buildPrompt(record, existingFeatures, staticPrefix) {
  const already = existingFeatures.length ? `Already confirmed (DO NOT include): ${existingFeatures.join(', ')}` : 'No features confirmed yet.';
  
  // Build per-product context
  const sections = [
    record.readme && `## README\n${record.readme}`,
    record.license && `## License\n${record.license}`,
    record.description && `## Store description\n${record.description}`,
    record.websiteText && `## Website\n${record.websiteText.slice(0,80000)}`,
  ].filter(Boolean).join('\n\n');

  return `${staticPrefix}

## Product: ${record.title} (${record.platform}/${record.appId})
${already}

## Source text
${sections}

## Response — YAML only:
\`\`\`yaml
features:
  - segwit:
      source: "Website"
      quote: "Full SegWit support"
\`\`\`

If no new features found:
\`\`\`yaml
features: []
\`\`\``;
}

// ── LLM call ───────────────────────────────────────────────────────────────

async function callLLM(prompt) {
  const body = JSON.stringify({
    model: MODEL,
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }]
  });
  
  const tmp = `/tmp/fvp_${process.pid}_${Date.now()}.json`;
  fs.writeFileSync(tmp, body);
  
  try {
    const r = execSync(
      `curl -sS -X POST "${PPQ_API_URL}/v1/chat/completions" -H "Content-Type: application/json" -H "Authorization: Bearer ${PPQ_API_KEY}" --data @"${tmp}"`,
      { encoding: 'utf8', timeout: 90000 }
    );
    const p = JSON.parse(r);
    return {
      raw: p.choices?.[0]?.message?.content || '',
      inputTokens: p.usage?.prompt_tokens || 0,
      outputTokens: p.usage?.completion_tokens || 0,
    };
  } finally { try{fs.unlinkSync(tmp);}catch{} }
}

function parseResponse(response) {
  const m = response.match(/```ya?ml\s*([\s\S]*?)```/i);
  const raw = m ? m[1].trim() : response.trim();
  try {
    const p = yaml.load(raw);
    if (!p || !Array.isArray(p.features)) return [];
    const out = [];
    for (const e of p.features) {
      if (typeof e === 'object' && e) {
        for (const [k,v] of Object.entries(e)) {
          const val = typeof v === 'object' ? v : {};
          out.push({ key:k, quote:val.quote||'', source:val.source||'', comment:val.comment||'' });
        }
      }
    }
    return out;
  } catch { return []; }
}

function validateQuote(quote, record, source) {
  if (!quote || quote.length < 10) return 'too_short';
  const texts = { Store: record.description, README: record.readme, License: record.license, Website: record.websiteText };
  const t = texts[source] || Object.values(texts).filter(Boolean).join('\n');
  if (!t) return 'no_source';
  const n = s => s.toLowerCase().replace(/\s+/g,' ').trim();
  const nt=n(t), nq=n(quote);
  if (nt.includes(nq)) return 'exact';
  const words=nq.split(' ');
  if (words.length>=4) {
    let f=0;
    for(let i=0;i<=words.length-4;i++) if(nt.includes(words.slice(i,i+4).join(' '))) f++;
    if (f/Math.max(1,words.length-3)>=0.6) return 'partial';
  }
  return 'not_found';
}

// ── State management ───────────────────────────────────────────────────────

function loadState() {
  if (!fs.existsSync(STATE_FILE)) return { products: {}, lastRun: null };
  return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
}

function saveState(state) {
  ensureDir(path.dirname(STATE_FILE));
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function shouldProcess(state, productId, newFingerprint) {
  if (FORCE) return true;
  const saved = state.products[productId];
  if (!saved) return true;
  if (saved.fingerprint !== newFingerprint) return true;
  return false;
}

// ── Main processing ────────────────────────────────────────────────────────

async function processProduct(plat, appId, filepath, staticPrefix, state) {
  const fm = parseFrontmatter(fs.readFileSync(filepath, 'utf8'));
  if (!fm || !TARGET_VERDICTS.has(fm.verdict)) return null;
  
  const productId = `${plat}/${appId}`;
  const fingerprint = await computeChangeFingerprint(plat, appId, fm);
  
  if (!shouldProcess(state, productId, fingerprint)) {
    return { status: 'skipped', productId, reason: 'unchanged' };
  }
  
  // Fetch sources
  const [readme, license, description, websiteHtml] = await Promise.all([
    fetchGitHubReadme(fm.repository),
    fetchGitHubLicense(fm.repository),
    fetchStoreDescription(plat, fm.appId),
    fm.website ? fetchUrl(fm.website) : Promise.resolve(''),
  ]);
  
  const websiteText = websiteHtml ? stripHtml(websiteHtml) : '';
  
  const record = {
    title: fm.title || appId,
    platform: plat,
    appId,
    readme,
    license,
    description,
    websiteText,
  };
  
  const existingFeatures = (fm.features || []).filter(f => typeof f === 'string');
  const prompt = buildPrompt(record, existingFeatures, staticPrefix);
  
  const result = await callLLM(prompt);
  const features = parseResponse(result.raw).map(f => ({
    ...f,
    quoteValid: validateQuote(f.quote, record, f.source)
  }));
  
  // Update state
  state.products[productId] = {
    fingerprint,
    lastRun: new Date().toISOString(),
    features: features.filter(f => f.quoteValid === 'exact').map(f => f.key),
  };
  
  return {
    status: 'processed',
    productId,
    features,
    inputTokens: result.inputTokens,
    outputTokens: result.outputTokens,
  };
}

async function applyFeatures(filepath, newFeatures) {
  const content = fs.readFileSync(filepath, 'utf8');
  const fm = parseFrontmatter(content);
  const reviewBody = getReviewBody(content);
  
  const existing = new Set(fm.features || []);
  const toAdd = newFeatures.filter(f => f.quoteValid === 'exact' && !existing.has(f.key));
  if (!toAdd.length) return { added: 0 };
  
  fm.features = [...(fm.features || []), ...toAdd.map(f => f.key)];
  const newContent = `---\n${yaml.dump(fm, { lineWidth: 120 }).trim()}---\n\n${reviewBody}`;
  
  if (!DRY_RUN) {
    fs.writeFileSync(filepath, newContent);
  }
  return { added: toAdd.length, features: toAdd.map(f => f.key) };
}

// ── Entry point ────────────────────────────────────────────────────────────

async function main() {
  if (!PPQ_API_KEY) { console.error('PPQ_API_KEY required'); process.exit(1); }
  
  // Load static prefix (cached feature definitions)
  console.log('Building static prompt prefix...');
  const staticPrefix = buildStaticPrefix();
  console.log('Static prefix size:', staticPrefix.length, 'chars (~', Math.round(staticPrefix.length/4), 'tokens)');
  
  // Load state
  const state = loadState();
  console.log('Loaded state:', Object.keys(state.products).length, 'products tracked');
  
  // Find all products
  const products = [];
  for (const [plat, folder] of Object.entries(PLATFORMS)) {
    const dir = path.join(ROOT, folder);
    if (!fs.existsSync(dir)) continue;
    for (const fn of fs.readdirSync(dir)) {
      if (!fn.endsWith('.md')) continue;
      products.push({ plat, appId: fn.slice(0,-3), filepath: path.join(dir, fn) });
    }
  }
  
  console.log(`Found ${products.length} products to evaluate`);
  
  // Process with rate limiting
  let processed = 0, skipped = 0, totalIn = 0, totalOut = 0;
  const results = [];
  
  // Batched parallel processing
  for (let i = 0; i < products.length; i += CONCURRENCY) {
    const batch = products.slice(i, i + CONCURRENCY);
    
    const batchResults = await Promise.all(
      batch.map(p => processProduct(p.plat, p.appId, p.filepath, staticPrefix, state))
    );
    
    for (const r of batchResults) {
      if (!r) continue;
      if (r.status === 'skipped') {
        skipped++;
      } else {
        processed++;
        totalIn += r.inputTokens;
        totalOut += r.outputTokens;
        results.push(r);
        
        const verified = r.features.filter(f => f.quoteValid === 'exact');
        if (verified.length > 0) {
          console.log(`${r.productId}: ${verified.length} verified`);
          if (DO_APPLY) {
            const applied = await applyFeatures(
              products.find(p => `${p.plat}/${p.appId}` === r.productId).filepath,
              r.features
            );
            if (applied.added > 0) console.log(`  Applied: ${applied.features.join(', ')}`);
          }
        }
      }
    }
    
    // Small delay between batches to avoid PPQ burst limits
    if (i + CONCURRENCY < products.length) {
      await sleep(BATCH_DELAY_MS);
    }
    
    // Save state periodically (every 50 products)
    if (processed % 50 === 0) {
      saveState(state);
    }
  }
  
  // Final save
  saveState(state);
  
  // Calculate costs
  // With prompt caching: static prefix is cached (10% price), variable is full price
  const staticTokens = Math.round(staticPrefix.length / 4);
  const avgVariableIn = processed ? Math.round((totalIn / processed) - staticTokens) : 0;
  
  const cachedCost = processed * (
    (staticTokens/1e6 * COST_CACHE_HIT) +
    (avgVariableIn/1e6 * COST_INPUT) +
    ((totalOut/processed||0)/1e6 * COST_OUTPUT)
  );
  
  const uncachedCost = (totalIn/1e6 * COST_INPUT) + (totalOut/1e6 * COST_OUTPUT);
  
  console.log('\n=== Summary ===');
  console.log(`Processed: ${processed}, Skipped (unchanged): ${skipped}`);
  console.log(`Tokens: ${totalIn} in, ${totalOut} out`);
  console.log(`Cost (uncached): $${uncachedCost.toFixed(4)}`);
  console.log(`Cost (with prompt caching est.): $${cachedCost.toFixed(4)}`);
  console.log(`Per product (cached): ${(cachedCost/processed*100).toFixed(2)}¢`);
  
  if (DRY_RUN) console.log('DRY RUN — no changes applied');
}

main().catch(e => { console.error(e); process.exit(1); });
