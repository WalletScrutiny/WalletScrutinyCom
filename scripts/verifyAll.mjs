#!/usr/bin/env node
/**
 * verifyAll.mjs — Run Sonnet 4.6 feature verification on all sourceavailable products.
 * 10 parallel workers. Applies verified features to frontmatter.
 * Commits in batches of 20.
 *
 * Usage: PPQ_API_KEY=... node scripts/verifyAll.mjs [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { createRequire } from 'module';

// Truly async exec — doesn't block the event loop
function execAsync(cmd, opts = {}) {
  return new Promise((resolve, reject) => {
    exec(cmd, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024, timeout: 90000, ...opts }, (err, stdout, stderr) => {
      if (err) reject(err);
      else resolve(stdout);
    });
  });
}

const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CACHE_DIR = path.join(ROOT, 'scripts', 'cache', 'feature-text');
const FEATURES_YML = path.join(ROOT, '_data', 'features.yml');
const PPQ_API_URL = 'https://api.ppq.ai';
const PPQ_API_KEY = process.env.PPQ_API_KEY;
const MODEL = 'claude-sonnet-4.6';
const CONCURRENCY = 10;
const BATCH_SIZE = 20;
const DRY_RUN = process.argv.includes('--dry-run');
const ONLY_EMPTY = process.argv.includes('--only-empty');

const PLATFORMS = { android: '_android', iphone: '_iphone', desktop: '_desktop', hardware: '_hardware' };
const WEBSITE_MAX = 80_000;

if (!PPQ_API_KEY) { console.error('PPQ_API_KEY required'); process.exit(1); }

// ── Helpers ────────────────────────────────────────────────────────────────

function parseFrontmatter(c) {
  const m = c.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  try { return yaml.load(m[1]); } catch { return null; }
}
function getReviewBody(c) {
  const m = c.match(/^---\n[\s\S]*?\n---\s*\n/);
  return m ? c.slice(m[0].length) : '';
}
function normalize(s) { return s.replace(/\s+/g,' ').toLowerCase().trim(); }

function validateQuote(quote, record, source) {
  if (!quote || quote.length < 10) return 'too_short';
  const texts = { Store: record.description, README: record.readme, License: record.license, Website: record.websiteText, Review: record.reviewBody };
  const t = texts[source] || Object.values(texts).filter(Boolean).join('\n');
  if (!t) return 'no_source';
  const nt = normalize(t), nq = normalize(quote);
  if (nt.includes(nq)) return 'exact';
  const w = nq.split(' ');
  if (w.length >= 4) {
    let f = 0;
    for (let i = 0; i <= w.length - 4; i++) if (nt.includes(w.slice(i,i+4).join(' '))) f++;
    if (f / Math.max(1, w.length - 3) >= 0.6) return 'partial';
  }
  return 'not_found';
}

function parseResponse(response, validKeys) {
  const m = response.match(/```ya?ml\s*([\s\S]*?)```/i);
  const raw = m ? m[1].trim() : response.trim();
  try {
    const p = yaml.load(raw);
    if (!p || !Array.isArray(p.features)) return [];
    const out = [];
    for (const e of p.features) {
      if (typeof e === 'object' && e) {
        for (const [k, v] of Object.entries(e)) {
          if (!validKeys.has(k)) continue;
          const val = typeof v === 'object' ? v : {};
          out.push({ key: k, quote: val.quote||'', source: val.source||'', comment: val.comment||'' });
        }
      }
    }
    return out;
  } catch { return []; }
}

// ── Prompt ────────────────────────────────────────────────────────────────

function buildPrompt(featuresData, record, existingFeatures) {
  const existingSet = new Set(existingFeatures);
  const featureSection = Object.entries(featuresData)
    .filter(([k]) => !existingSet.has(k))
    .map(([k, v]) => {
      const long = (v?.long || '').replace(/<[^>]+>/g, '').trim();
      return long ? `### ${k}: ${v.short}\n${long}` : `### ${k}: ${v.short||k}`;
    }).join('\n\n');

  if (!featureSection.trim()) return null;

  const alreadyNote = existingFeatures.length
    ? `Already confirmed (DO NOT include): ${existingFeatures.join(', ')}`
    : 'No features confirmed yet.';

  const sections = [
    record.reviewBody   && `## Existing review\n${record.reviewBody}`,
    record.description  && `## Store description\n${record.description}`,
    record.readme       && `## README\n${record.readme}`,
    record.license      && `## License\n${record.license}`,
    record.websiteText  && `## Website\n${record.websiteText.slice(0, WEBSITE_MAX)}`,
  ].filter(Boolean).join('\n\n');

  return `You are a Bitcoin wallet feature analyst for WalletScrutiny.
Find features for "${record.title}" (${record.platform}/${record.appId}).
${alreadyNote}

## Features to check
${featureSection}

## RULES
1. LN vs Liquid: Lightning Network and Liquid (Blockstream sidechain, L-BTC) are completely different.
2. cashu vs liquid: cashu is an ecash protocol. Not related to Liquid.
3. ownLN: user connects to THEIR OWN Lightning node. Custodial Lightning does NOT qualify.
4. companion: tag the HOT SIDE app only. Air-gapped signing device gets airGapped, not companion.
5. foss: OSI-approved license ONLY (MIT, GPL, Apache, AGPL, MPL). Commons Clause = NOT foss.
6. Quote must be verbatim plain-text from the named source. No paraphrasing, no markdown.
7. Quote must be a single line, maximum 120 characters. For foss, quote only the license name (e.g. "MIT License"), not the full license text.
8. Quote must not contain the characters { } or %.
9. Source must be exactly: "Store", "README", "License", "Website", or "Review".
10. Be conservative. Omit if unsure.

## Source text
${sections}

\`\`\`yaml
features:
  - segwit:
      source: "Website"
      quote: "Full SegWit support for all address types"
\`\`\`

If nothing new found:
\`\`\`yaml
features: []
\`\`\``;
}

// ── LLM call ──────────────────────────────────────────────────────────────

async function callLLM(prompt) {
  const body = JSON.stringify({ model: MODEL, max_tokens: 1024, messages: [{ role: 'user', content: prompt }] });
  const tmp = `/tmp/va_${process.pid}_${Date.now()}_${Math.random().toString(36).slice(2)}.json`;
  fs.writeFileSync(tmp, body);
  try {
    const r = await execAsync(
      `curl -sS -X POST "${PPQ_API_URL}/v1/chat/completions" -H "Content-Type: application/json" -H "Authorization: Bearer ${PPQ_API_KEY}" --data @"${tmp}"`
    );
    const p = JSON.parse(r);
    if (p.error) throw new Error(JSON.stringify(p.error));
    return {
      raw: p.choices?.[0]?.message?.content || '',
      inputTokens: p.usage?.prompt_tokens || 0,
      outputTokens: p.usage?.completion_tokens || 0,
    };
  } finally { try { fs.unlinkSync(tmp); } catch {} }
}

// ── Source URL resolver ────────────────────────────────────────────────────
// Converts keyword source ("README", "License", etc.) to a markdown link
// using the product's repo URL. featureEvidence.html renders source with markdownify.

function resolveSourceUrl(sourceKeyword, fm) {
  const repo = fm.repository || '';
  const slug = (repo.match(/github\.com\/([^/]+\/[^/]+?)(?:\.git)?\/?$/) || [])[1];

  switch (sourceKeyword) {
    case 'README':
      return slug ? `[README](https://github.com/${slug}#readme)` : 'README';
    case 'License':
      return slug ? `[License](https://github.com/${slug}/blob/master/LICENSE)` : 'License';
    case 'Website':
      return fm.website ? `[Website](${fm.website})` : 'Website';
    case 'Store': {
      if (fm.appId) {
        // Try to determine platform from path context (passed in fm.__plat)
        const plat = fm.__plat;
        if (plat === 'android') return `[Play Store](https://play.google.com/store/apps/details?id=${fm.appId})`;
        if (plat === 'iphone')  return `[App Store](https://apps.apple.com/app/${fm.appId})`;
      }
      return 'Store';
    }
    case 'Review':
      return 'Review';
    default:
      return sourceKeyword || '';
  }
}

// ── Apply ──────────────────────────────────────────────────────────────────
// Surgical frontmatter edit: only touches the `features:` block.
// Never re-serializes the whole frontmatter to avoid yaml.dump reformatting.

function applyToFile(filepath, fm, toAdd) {
  const content = fs.readFileSync(filepath, 'utf8');
  const fmMatch = content.match(/^(---\n)([\s\S]*?)(\n---)/);
  if (!fmMatch) return 0;

  const existing = new Set((fm.features||[]).filter(f=>typeof f==='string'));
  const newFeats = toAdd.filter(f => !existing.has(f.key));
  if (!newFeats.length) return 0;

  const rawFm = fmMatch[2];
  const afterFm = content.slice(fmMatch[0].length); // everything after closing ---

  // Build the new feature key lines to insert
  const newKeyLines = newFeats.map(f => `- ${f.key}`).join('\n');

  let newRawFm;
  if (/^features:/m.test(rawFm)) {
    // features: block exists — append new keys into it
    // Find the features block and append before the next top-level key or end
    newRawFm = rawFm.replace(
      /(^features:[ \t]*\n)((?:[ \t]+-[ \t]+\S[^\n]*\n?)*)/m,
      (_, header, existingItems) => {
        return header + existingItems + newKeyLines.split('\n').map(l => '- ' === l.slice(0,2) ? `- ${l.slice(2)}` : l).map(l=>`- ${l.replace(/^- /,'')}`).map(k=>`- ${k.replace(/^- /,'')}`).join('\n') + '\n';
      }
    );
    // Simpler: just append lines at end of features block
    newRawFm = rawFm.replace(
      /(^features:[ \t]*(?:\n[ \t]+-[^\n]*)*)/m,
      (block) => block + '\n' + newFeats.map(f => `- ${f.key}`).join('\n')
    );
  } else {
    // No features block — append it at end of frontmatter
    newRawFm = rawFm.trimEnd() + '\nfeatures:\n' + newFeats.map(f => `- ${f.key}`).join('\n');
  }

  // Build featureEvidence includes for new features
  // Newlines within quotes/comments are collapsed to spaces to prevent Liquid tag breakage.
  // All other content is preserved as-is (constraints enforced via prompt).
  function oneLine(s) { return s.replace(/\r?\n/g, ' ').replace(/\s{2,}/g, ' ').trim(); }
  const evidenceIncludes = newFeats.map(f => {
    const sourceLink = resolveSourceUrl(f.source, fm);
    let include = `{% include featureEvidence.html feature="${f.key}"`;
    if (sourceLink) include += ` source="${oneLine(sourceLink)}"`;
    if (f.quote)    include += ` quote="${oneLine(f.quote).replace(/"/g, "'")}"`;
    if (f.comment)  include += ` comment="${oneLine(f.comment).replace(/"/g, "'")}"`;
    return include + ' %}';
  }).join('\n');

  const newContent = `---\n${newRawFm}\n---\n${evidenceIncludes}\n\n${afterFm.trimStart()}`;
  fs.writeFileSync(filepath, newContent);
  return newFeats.length;
}

// ── No git ops — the runner commits after reviewing the output ─────────────

// ── Main ─────────────────────────────────────────────────────────────────

const featuresData = yaml.load(fs.readFileSync(FEATURES_YML, 'utf8'));
const validKeys = new Set(Object.keys(featuresData));

// ── Preflight: abort if any invalid feature keys exist in frontmatter ────
{
  let invalid = [];
  for (const [plat, folder] of Object.entries(PLATFORMS)) {
    const dir = path.join(ROOT, folder);
    if (!fs.existsSync(dir)) continue;
    for (const fn of fs.readdirSync(dir)) {
      if (!fn.endsWith('.md')) continue;
      const fm = parseFrontmatter(fs.readFileSync(path.join(dir, fn), 'utf8'));
      if (!fm) continue;
      for (const f of (fm.features || [])) {
        if (typeof f !== 'string' || !validKeys.has(f)) {
          invalid.push(`  ${plat}/${fn.slice(0,-3)}: ${JSON.stringify(f)}`);
        }
      }
    }
  }
  if (invalid.length > 0) {
    console.error(`\n❌ PREFLIGHT FAILED: ${invalid.length} invalid feature key(s) found in frontmatter.\nFix these before running verifyAll:\n${invalid.join('\n')}\n`);
    process.exit(1);
  }
  console.log(`✓ Preflight: all feature keys valid`);
}

// Collect all sourceavailable products
const products = [];
for (const [plat, folder] of Object.entries(PLATFORMS)) {
  const dir = path.join(ROOT, folder);
  if (!fs.existsSync(dir)) continue;
  for (const fn of fs.readdirSync(dir)) {
    if (!fn.endsWith('.md')) continue;
    const fp = path.join(dir, fn);
    const c = fs.readFileSync(fp, 'utf8');
    const fm = parseFrontmatter(c);
    if (fm?.verdict !== 'sourceavailable') continue;
    if (ONLY_EMPTY && (fm.features||[]).filter(f=>typeof f==='string').length > 0) continue;
    const appId = fn.slice(0,-3);
    const cacheFile = path.join(CACHE_DIR, plat, appId+'.yaml');
    if (!fs.existsSync(cacheFile)) { console.warn(`No cache: ${plat}/${appId} — skipping`); continue; }
    const rec = yaml.load(fs.readFileSync(cacheFile, 'utf8'));
    fm.__plat = plat; // for Store URL resolution
    products.push({ plat, appId, filepath: fp, fm, rec });
  }
}

console.log(`Running ${MODEL} on ${products.length} sourceavailable products (${CONCURRENCY} parallel)\n`);

let done = 0, totalIn = 0, totalOut = 0;
let idx = 0;
const mu = { lock: false, queue: [] }; // simple mutex for shared state

async function withLock(fn) {
  return new Promise((res, rej) => {
    const run = async () => { try { res(await fn()); } catch(e) { rej(e); } mu.lock = false; if(mu.queue.length) mu.queue.shift()(); };
    if (!mu.lock) { mu.lock = true; run(); } else { mu.queue.push(run); }
  });
}

await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
  while (true) {
    const item = await withLock(() => idx < products.length ? products[idx++] : null);
    if (!item) break;

    const { plat, appId, filepath, fm, rec } = item;
    const existing = (fm.features||[]).filter(f=>typeof f==='string');
    const prompt = buildPrompt(featuresData, rec, existing);
    if (!prompt) { process.stdout.write('·'); continue; }

    let result;
    try {
      result = await callLLM(prompt);
    } catch(e) {
      process.stdout.write('E');
      console.error(`\n  ERROR ${plat}/${appId}: ${e.message?.slice(0,80)}`);
      continue;
    }

    const features = parseResponse(result.raw, validKeys).map(f => ({
      ...f, quoteValid: validateQuote(f.quote, rec, f.source)
    }));

    totalIn += result.inputTokens;
    totalOut += result.outputTokens;

    const verified = features.filter(f => f.quoteValid === 'exact');

    if (!DRY_RUN && verified.length > 0) {
      const added = applyToFile(filepath, fm, verified);
      if (added > 0) {
        console.log(`\n  ${plat}/${appId}: +${verified.map(f=>f.key).join(', ')}`);
        process.stdout.write('+');
      } else {
        process.stdout.write('.');
      }
    } else {
      process.stdout.write(verified.length ? '+' : '.');
    }

    done++;
    if (done % 50 === 0) {
      const cost = (totalIn/1e6*3.15) + (totalOut/1e6*15.75);
      console.log(`\n  [${done}/${products.length}] cost so far: $${cost.toFixed(3)}`);
    }
  }
}));

const cost = (totalIn/1e6*3.15) + (totalOut/1e6*15.75);
const perProd = cost / Math.max(done, 1);
console.log(`\n\n=== Done ===`);
console.log(`Products: ${done}/${products.length}`);
console.log(`Tokens: ${totalIn} in, ${totalOut} out`);
console.log(`Total cost: $${cost.toFixed(4)}`);
console.log(`Per product: ${(perProd*100).toFixed(2)}¢`);
console.log(`Est. 3000 products: $${(perProd*3000).toFixed(2)}`);
if (DRY_RUN) console.log('DRY RUN — nothing committed');
