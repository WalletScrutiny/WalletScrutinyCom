#!/usr/bin/env node
/**
 * modelCompareAll.mjs — Run all 10 models on 6 products, 10 parallel workers.
 * Uses updated prompt (long feature descriptions, no benefits) + clean source text.
 *
 * Usage: PPQ_API_KEY=... node scripts/modelCompareAll.mjs
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CACHE_TEXT_DIR = path.join(ROOT, 'scripts', 'cache', 'feature-text');
const FEATURES_YML   = path.join(ROOT, '_data', 'features.yml');
const PPQ_API_URL    = 'https://api.ppq.ai';
const PPQ_API_KEY    = process.env.PPQ_API_KEY;

const MODELS = [
  'claude-sonnet-4.6',
  'claude-haiku-4.5',
  'anthropic/claude-3.5-haiku',
  'google/gemini-2.0-flash-lite-001',
  'gemini-3-flash-preview',
  'deepseek/deepseek-v3.2',
  'mistralai/mistral-large-2512',
  'openai/gpt-oss-120b',
  'minimax/minimax-m2.5',
  'openai/gpt-5-mini',
];

const SAMPLE = [
  'hardware/coldcardMk4',
  'android/com.blitzwallet',
  'android/it.airgap.vault',
  'android/io.nunchuk.android',
  'android/org.electrum.electrum',
  'desktop/bitcoincore',
];

const PLATFORMS = { android: '_android', iphone: '_iphone', desktop: '_desktop', hardware: '_hardware' };

const featuresData = yaml.load(fs.readFileSync(FEATURES_YML, 'utf8'));

function readYaml(fp) { try { return yaml.load(fs.readFileSync(fp,'utf8')); } catch { return null; } }
function parseFrontmatter(c) { const m=c.match(/^---\n([\s\S]*?)\n---/); if(!m) return null; try{return yaml.load(m[1]);}catch{return null;} }
function getOfficialFeatureKeys(fm) { const s=new Set(Object.keys(featuresData)); return (fm?.features||[]).filter(f=>typeof f==='string'&&s.has(f)); }
function normalize(s){return s.replace(/\s+/g,' ').toLowerCase().trim();}

function validateQuote(quote, record, source) {
  if (!quote || quote.length < 10) return 'too_short';
  const t = {Store:record.description, README:record.readme, License:record.license, Website:record.websiteText}[source]
    || [record.description, record.readme, record.license, record.websiteText].filter(Boolean).join('\n');
  if (!t) return 'no_source_text';
  const nt=normalize(t), nq=normalize(quote);
  if (nt.includes(nq)) return 'exact';
  const w=nq.split(' ');
  if (w.length>=4) {
    let f=0;
    for(let i=0;i<=w.length-4;i++) if(nt.includes(w.slice(i,i+4).join(' '))) f++;
    if (f/Math.max(1,w.length-3)>=0.6) return 'partial';
  }
  return 'not_found';
}

function buildPrompt(record, existing) {
  const existingSet = new Set(existing);
  const featuresToCheck = Object.entries(featuresData)
    .filter(([k]) => !existingSet.has(k))
    .map(([k, v]) => {
      const short = v?.short || k;
      const long = (v?.long || '').replace(/<[^>]+>/g, '').trim();
      return long ? `### ${k}: ${short}\n${long}` : `### ${k}: ${short}`;
    })
    .join('\n\n');
  if (!featuresToCheck.trim()) return null;

  const alreadyNote = existing.length > 0
    ? `Already confirmed (DO NOT include in response): ${existing.join(', ')}`
    : 'No features confirmed yet.';

  const WEBSITE_MAX = 80_000;
  const textSections = [
    record.reviewBody  && `## Existing WalletScrutiny review\n${record.reviewBody}`,
    record.description && `## Store description\n${record.description}`,
    record.readme      && `## GitHub README\n${record.readme}`,
    record.license     && `## License\n${record.license}`,
    record.websiteText && `## Website\n${record.websiteText.slice(0, WEBSITE_MAX)}`,
  ].filter(Boolean).join('\n\n');

  return `You are a Bitcoin wallet feature analyst for WalletScrutiny.
Find ONLY new features not yet confirmed for "${record.title}" (${record.platform}/${record.appId}).

${alreadyNote}

## Features to check
Only report features where the source text explicitly supports them. Definitions below.

${featuresToCheck}

## RULES
1. LN vs Liquid: Lightning Network (instant off-chain Bitcoin payments) and Liquid (Blockstream sidechain, L-BTC) are completely different. Do not confuse them.
2. cashu vs liquid: cashu is an ecash protocol. Liquid is a sidechain. Not related.
3. ownLN means the user connects to their OWN Lightning node. Custodial Lightning (e.g. Spark, Wallet of Satoshi) does NOT qualify.
4. companion: tag this on the HOT SIDE companion app (the internet-connected wallet). Do NOT tag the air-gapped signing device — that one gets airGapped instead.
5. foss: ONLY if the License file contains an OSI-approved license (MIT, GPL, Apache, AGPL, MPL, etc.) AND does NOT contain Commons Clause or other commercial-use restrictions. Source-available and reproducible-builds licenses do NOT qualify.
6. Quote must be a verbatim plain-text excerpt from the named source — no paraphrasing, no markdown links or image syntax.
7. Evidence found only in the Review body: do NOT return — already documented.
8. Be conservative. If unsure, omit.

## Source text
${textSections}

## Response — YAML only, nothing else:

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

If no new features found (or only Review body evidence):
\`\`\`yaml
features: []
\`\`\``;
}

function parseResponse(response) {
  const m = response.match(/```ya?ml\s*([\s\S]*?)```/i);
  const raw = m ? m[1].trim() : response.trim();
  try {
    const parsed = yaml.load(raw);
    if (!parsed || !Array.isArray(parsed.features)) return [];
    const official = new Set(Object.keys(featuresData));
    const results = [];
    for (const entry of parsed.features) {
      if (typeof entry === 'string' && official.has(entry)) {
        results.push({key:entry, quote:'', source:'', comment:'', hasQuote:false, hasSource:false, hasComment:false});
      } else if (typeof entry === 'object' && entry !== null) {
        for (const [key, val] of Object.entries(entry)) {
          if (!official.has(key)) continue;
          const v = typeof val === 'object' && val !== null ? val : {};
          results.push({key, quote:v.quote||'', source:v.source||'', comment:v.comment||'',
            hasQuote:!!v.quote, hasSource:!!v.source, hasComment:!!v.comment});
        }
      }
    }
    return results;
  } catch { return []; }
}

async function processJob(model, productId) {
  const [plat, appId] = productId.split('/');
  const rec = readYaml(path.join(CACHE_TEXT_DIR, plat, appId+'.yaml'));
  if (!rec) return {model, productId, features:[], error:'no_cache', elapsedMs:0, inputTokens:0, outputTokens:0};
  const folder = PLATFORMS[plat];
  const mdPath = path.join(ROOT, folder, appId+'.md');
  if (!fs.existsSync(mdPath)) return {model, productId, features:[], error:'no_md', elapsedMs:0, inputTokens:0, outputTokens:0};
  const fm = parseFrontmatter(fs.readFileSync(mdPath,'utf8'));
  const existing = getOfficialFeatureKeys(fm||{});
  const prompt = buildPrompt(rec, existing);
  if (!prompt) return {model, productId, features:[], error:'no_prompt', elapsedMs:0, inputTokens:0, outputTokens:0};

  const body = JSON.stringify({model, max_tokens:2048, messages:[{role:'user', content:prompt}]});
  const tmp = `/tmp/mca_${process.pid}_${Date.now()}.json`;
  fs.writeFileSync(tmp, body);
  const t0 = Date.now();
  try {
    const r = execSync(
      `curl -sS -X POST "${PPQ_API_URL}/v1/chat/completions" -H "Content-Type: application/json" -H "Authorization: Bearer ${PPQ_API_KEY}" --data @"${tmp}"`,
      {encoding:'utf8', timeout:120000}
    );
    const elapsed = Date.now()-t0;
    const parsed = JSON.parse(r);
    if (parsed.error) throw new Error(JSON.stringify(parsed.error));
    const features = parseResponse(parsed.choices[0].message.content).map(f => ({
      ...f, quoteValid: f.hasQuote ? validateQuote(f.quote, rec, f.source) : 'no_quote'
    }));
    return {model, productId, features, error:null, elapsedMs:elapsed,
      inputTokens:parsed.usage?.prompt_tokens||0, outputTokens:parsed.usage?.completion_tokens||0};
  } catch(e) {
    return {model, productId, features:[], error:e.message.slice(0,100), elapsedMs:Date.now()-t0, inputTokens:0, outputTokens:0};
  } finally { try{fs.unlinkSync(tmp);}catch{} }
}

async function runParallel(jobs, concurrency) {
  const results = []; let idx = 0;
  await Promise.all(Array.from({length:concurrency}, async () => {
    while (idx < jobs.length) {
      const job = jobs[idx++];
      const short = job.model.split('/').pop().slice(0,22).padEnd(22);
      const prod  = job.productId.split('/')[1].slice(0,20).padEnd(20);
      process.stdout.write(`  [start] ${short} × ${prod}\n`);
      const r = await processJob(job.model, job.productId);
      const status = r.error ? `ERROR(${r.error.slice(0,30)})` : `${r.features.length}feat ${r.elapsedMs}ms`;
      process.stdout.write(`  [done]  ${short} × ${prod} → ${status}\n`);
      results.push(r);
    }
  }));
  return results;
}

// ── Main ─────────────────────────────────────────────────────────────────────

if (!PPQ_API_KEY) { console.error('PPQ_API_KEY required'); process.exit(1); }

const jobs = [];
for (const model of MODELS) for (const prod of SAMPLE) jobs.push({model, productId:prod});
console.log(`Running ${jobs.length} jobs (${MODELS.length} models × ${SAMPLE.length} products), 10 parallel workers...\n`);
const t0 = Date.now();
const allResults = await runParallel(jobs, 10);
console.log(`\nTotal wall time: ${((Date.now()-t0)/1000).toFixed(0)}s`);

// ── Aggregate ────────────────────────────────────────────────────────────────

const byModel = {}, timings = {}, tokensByModel = {};
for (const r of allResults) {
  if (!byModel[r.model]) { byModel[r.model]={}; timings[r.model]=[]; tokensByModel[r.model]={input:0,output:0}; }
  byModel[r.model][r.productId] = r.features;
  if (r.elapsedMs > 0) timings[r.model].push(r.elapsedMs);
  tokensByModel[r.model].input  += r.inputTokens;
  tokensByModel[r.model].output += r.outputTokens;
}

// ── Per-product detail ───────────────────────────────────────────────────────

console.log('\n\n════════════════════════════════════════════════════════');
console.log('                  RESULTS BY PRODUCT');
console.log('════════════════════════════════════════════════════════');

for (const prod of SAMPLE) {
  console.log('\n── ' + prod + ' ──');
  for (const model of MODELS) {
    const feats = (byModel[model]||{})[prod] || [];
    const short = model.split('/').pop().padEnd(28);
    if (!feats.length) { console.log(`  ${short} (none)`); continue; }
    feats.forEach(f => {
      const sym = f.quoteValid==='exact'?'✅':f.quoteValid==='partial'?'⚠️':f.quoteValid==='not_found'?'❌':'·';
      console.log(`  ${short} ${sym} ${f.key}: "${(f.quote||'').slice(0,65)}" (${f.source})`);
    });
  }
}

// ── Summary table ────────────────────────────────────────────────────────────

const pricing = {
  'claude-sonnet-4.6':                  [3.15,  15.75],
  'claude-haiku-4.5':                   [1.05,   5.25],
  'anthropic/claude-3.5-haiku':         [0.84,   4.20],
  'google/gemini-2.0-flash-lite-001':   [0.0525, 0.21],
  'gemini-3-flash-preview':             [0.35,   2.10],
  'deepseek/deepseek-v3.2':             [0.273,  0.399],
  'mistralai/mistral-large-2512':       [0.525,  1.575],
  'openai/gpt-oss-120b':                [0.041,  0.1995],
  'minimax/minimax-m2.5':               [0.315,  1.155],
  'openai/gpt-5-mini':                  [0.2625, 2.10],
};

console.log('\n\n══ SUMMARY ══');
console.log(`${'Model'.padEnd(36)} ${'Total'.padStart(6)} ${'✅'.padStart(5)} ${'⚠️'.padStart(5)} ${'❌'.padStart(5)} ${'Med ms'.padStart(8)} ${'¢/prod'.padStart(8)}`);

for (const model of MODELS) {
  let total=0, exact=0, partial=0, notFound=0;
  for (const prod of SAMPLE) {
    for (const f of (byModel[model]||{})[prod]||[]) {
      total++;
      if (f.quoteValid==='exact') exact++;
      else if (f.quoteValid==='partial') partial++;
      else if (f.quoteValid==='not_found') notFound++;
    }
  }
  const t = (timings[model]||[]).sort((a,b)=>a-b);
  const med = t.length ? t[Math.floor(t.length/2)] : 0;
  const u = tokensByModel[model]||{input:0,output:0};
  const p = pricing[model]||[0,0];
  const cost = ((u.input/6*p[0])+(u.output/6*p[1]))/1e6*100;
  console.log(`${model.padEnd(36)} ${String(total).padStart(6)} ${String(exact).padStart(5)} ${String(partial).padStart(5)} ${String(notFound).padStart(5)} ${String(med).padStart(8)} ${cost.toFixed(4).padStart(8)}`);
}

// ── Save ─────────────────────────────────────────────────────────────────────

const outPath = path.join(ROOT, 'scripts', 'cache', 'model-compare-final.json');
fs.writeFileSync(outPath, JSON.stringify({
  models:MODELS, sample:SAMPLE, results:byModel, timings, tokensByModel,
  timestamp: new Date().toISOString()
}, null, 2));
console.log(`\nSaved: ${outPath}`);
