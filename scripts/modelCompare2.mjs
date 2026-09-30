#!/usr/bin/env node
/**
 * modelCompare2.mjs — Round 2: 5 new models × 6 products, 10 parallel workers.
 * Quote validation: checks if quote text actually appears in the cached source.
 *
 * Usage: PPQ_API_KEY=... node scripts/modelCompare2.mjs
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CACHE_TEXT_DIR = path.join(ROOT, 'scripts', 'cache', 'feature-text');
const FEATURES_YML = path.join(ROOT, '_data', 'features.yml');
const PPQ_API_URL = 'https://api.ppq.ai';
const PPQ_API_KEY = process.env.PPQ_API_KEY;

const MODELS = [
  'anthropic/claude-3.5-haiku',    // $0.84/$4.20 — slightly cheaper haiku generation
  'gemini-3-flash-preview',         // $0.35/$2.10 — Google's newer flash
  'openai/gpt-5-mini',              // $0.26/$2.10 — OpenAI mid-tier
  'mistralai/mistral-large-2512',   // $0.53/$1.58 — Mistral flagship-lite
  'deepseek/deepseek-v3.2',         // $0.27/$0.40 — DeepSeek cheapest quality option
];

// 3 products haiku found most features + 3 where haiku found zero
const SAMPLE = [
  'hardware/coldcardMk4',      // haiku: 3 features
  'android/com.blitzwallet',   // haiku: 2 features
  'android/it.airgap.vault',   // haiku: 2 features
  'android/io.nunchuk.android',    // haiku: 0
  'android/org.electrum.electrum', // haiku: 0
  'desktop/bitcoincore',           // haiku: 0
];

// Haiku's actual findings for reference (from round 1)
const HAIKU_ROUND1 = {
  'hardware/coldcardMk4': ['segwit','foss','coinCtrl'],
  'android/com.blitzwallet': ['segwit','ownLN'],
  'android/it.airgap.vault': ['segwit','companion'],
  'android/io.nunchuk.android': [],
  'android/org.electrum.electrum': [],
  'desktop/bitcoincore': [],
};

const featuresData = yaml.load(fs.readFileSync(FEATURES_YML, 'utf8'));

function readYaml(fp) { try { return yaml.load(fs.readFileSync(fp, 'utf8')); } catch { return null; } }

function parseFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  try { return yaml.load(m[1]); } catch { return null; }
}

function getOfficialFeatureKeys(fm) {
  const official = new Set(Object.keys(featuresData));
  return (fm?.features || []).filter(f => typeof f === 'string' && official.has(f));
}

const PLATFORMS = { android: '_android', iphone: '_iphone', desktop: '_desktop', hardware: '_hardware' };

function buildPrompt(record, existingFeatures) {
  const existingSet = new Set(existingFeatures);
  const featuresToCheck = Object.entries(featuresData)
    .filter(([k]) => !existingSet.has(k))
    .map(([k, v]) => `  - ${k}: ${v?.short || k}`)
    .join('\n');
  if (!featuresToCheck.trim()) return null;

  const alreadyNote = existingFeatures.length > 0
    ? `Already confirmed (DO NOT include in response): ${existingFeatures.join(', ')}`
    : 'No features confirmed yet.';

  const textSections = [
    record.reviewBody   && `## Existing WalletScrutiny review\n${record.reviewBody.slice(0, 2000)}`,
    record.description  && `## Store description\n${record.description.slice(0, 2000)}`,
    record.readme       && `## GitHub README\n${record.readme.slice(0, 2000)}`,
    record.license      && `## License\n${record.license.slice(0, 500)}`,
    record.websiteText  && `## Website\n${record.websiteText.slice(0, 2000)}`,
  ].filter(Boolean).join('\n\n');

  return `You are a Bitcoin wallet feature analyst for WalletScrutiny.
Find ONLY new features not yet confirmed for "${record.title}" (${record.platform}/${record.appId}).
CRITICAL: LN (Lightning Network) and Liquid (L-BTC sidechain) are COMPLETELY DIFFERENT. Do not confuse them.

${alreadyNote}

## Features to check (only these, only if clearly supported)
${featuresToCheck}

## RULES
1. LN vs Liquid: LN = Lightning Network (instant Bitcoin payments). Liquid = Blockstream sidechain with L-BTC. NOT the same.
2. Evidence in Review body: do NOT return these — they are already documented elsewhere.
3. For evidence from Store/README/License/Website, provide:
   - source: ONE of "Store", "README", "License", or "Website" (pick the most authoritative)
   - quote: Exact plain-text snippet (max 150 chars). NO markdown images (![...]), NO links ([text](url)).
   - comment: (optional) One sentence of reasoning ONLY if the quote is not self-explanatory. Do NOT restate which source it came from.
4. foss: ONLY if License section explicitly shows a recognized FOSS license (MIT, GPL, Apache, AGPL, etc.).
5. Be conservative. Omit a feature if you are not certain.

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

async function callLLM(model, prompt) {
  if (!PPQ_API_KEY) throw new Error('PPQ_API_KEY not set');
  const bodyFile = `/tmp/mc2_body_${process.pid}_${Date.now()}.json`;
  fs.writeFileSync(bodyFile, JSON.stringify({
    model,
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }]
  }));
  const t0 = Date.now();
  try {
    const result = execSync(
      `curl -sS -X POST "${PPQ_API_URL}/v1/chat/completions" \
       -H "Content-Type: application/json" \
       -H "Authorization: Bearer ${PPQ_API_KEY}" \
       --data @"${bodyFile}"`,
      { encoding: 'utf8', timeout: 60000 }
    );
    const elapsed = Date.now() - t0;
    const parsed = JSON.parse(result);
    if (parsed.error) throw new Error(JSON.stringify(parsed.error));
    const usage = parsed.usage || {};
    return {
      content: parsed.choices?.[0]?.message?.content || '',
      inputTokens: usage.prompt_tokens || 0,
      outputTokens: usage.completion_tokens || 0,
      elapsedMs: elapsed,
    };
  } finally {
    try { fs.unlinkSync(bodyFile); } catch {}
  }
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
        results.push({ key: entry, hasQuote: false, hasSource: false, hasComment: false });
      } else if (typeof entry === 'object' && entry !== null) {
        for (const [key, val] of Object.entries(entry)) {
          if (!official.has(key)) continue;
          const v = typeof val === 'object' && val !== null ? val : {};
          results.push({
            key, quote: v.quote || '', source: v.source || '', comment: v.comment || '',
            hasQuote: !!v.quote, hasSource: !!v.source, hasComment: !!v.comment,
          });
        }
      }
    }
    return results;
  } catch { return []; }
}

/**
 * Validate a quote: check if it (or a significant substring) appears
 * verbatim in the cached source text for this product.
 */
function validateQuote(quote, record, source) {
  if (!quote || quote.length < 10) return 'too_short';
  // Pick which field to check based on source
  const sourceMap = {
    'Store': record.description,
    'README': record.readme,
    'License': record.license,
    'Website': record.websiteText,
  };
  const text = sourceMap[source] || [record.description, record.readme, record.license, record.websiteText].filter(Boolean).join('\n');
  if (!text) return 'no_source_text';

  // Normalize whitespace for comparison
  const normalize = s => s.replace(/\s+/g, ' ').toLowerCase().trim();
  const normText = normalize(text);
  const normQuote = normalize(quote);

  // Try exact match first
  if (normText.includes(normQuote)) return 'exact';

  // Try matching the longest substring (>= 15 chars)
  // Split quote into chunks and see if most of it appears
  const words = normQuote.split(' ');
  if (words.length >= 4) {
    // Sliding window: try 4-word phrases
    let found = 0;
    for (let i = 0; i <= words.length - 4; i++) {
      const phrase = words.slice(i, i+4).join(' ');
      if (normText.includes(phrase)) found++;
    }
    const ratio = found / Math.max(1, words.length - 3);
    if (ratio >= 0.6) return 'partial';
  }

  return 'not_found';
}

// ── Worker: process one (model, productId) job ──

async function processJob(model, productId) {
  const [plat, appId] = productId.split('/');
  const textPath = path.join(CACHE_TEXT_DIR, plat, `${appId}.yaml`);
  if (!fs.existsSync(textPath)) return { model, productId, features: [], error: 'no_cache', elapsedMs: 0, inputTokens: 0, outputTokens: 0 };
  const record = readYaml(textPath);
  if (!record) return { model, productId, features: [], error: 'bad_yaml', elapsedMs: 0, inputTokens: 0, outputTokens: 0 };

  const folder = PLATFORMS[plat];
  const mdPath = path.join(ROOT, folder, `${appId}.md`);
  if (!fs.existsSync(mdPath)) return { model, productId, features: [], error: 'no_md', elapsedMs: 0, inputTokens: 0, outputTokens: 0 };
  const fm = parseFrontmatter(fs.readFileSync(mdPath, 'utf8'));
  if (!fm) return { model, productId, features: [], error: 'bad_fm', elapsedMs: 0, inputTokens: 0, outputTokens: 0 };

  const existingFeatures = getOfficialFeatureKeys(fm);
  const prompt = buildPrompt(record, existingFeatures);
  if (!prompt) return { model, productId, features: [], error: 'no_prompt', elapsedMs: 0, inputTokens: 0, outputTokens: 0 };

  try {
    const { content, inputTokens, outputTokens, elapsedMs } = await callLLM(model, prompt);
    const features = parseResponse(content).map(f => ({
      ...f,
      quoteValid: f.hasQuote ? validateQuote(f.quote, record, f.source) : 'no_quote',
    }));
    return { model, productId, features, error: null, elapsedMs, inputTokens, outputTokens };
  } catch (e) {
    return { model, productId, features: [], error: e.message.slice(0, 100), elapsedMs: 0, inputTokens: 0, outputTokens: 0 };
  }
}

// ── Parallel runner: max 10 concurrent ──

async function runParallel(jobs, concurrency) {
  const results = [];
  let idx = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (idx < jobs.length) {
      const job = jobs[idx++];
      const shortModel = job.model.split('/').pop();
      process.stdout.write(`  [start] ${shortModel} × ${job.productId.split('/')[1]}\n`);
      const r = await processJob(job.model, job.productId);
      const status = r.error ? `ERROR(${r.error})` : `${r.features.length}feat ${r.elapsedMs}ms`;
      process.stdout.write(`  [done]  ${shortModel} × ${job.productId.split('/')[1]} → ${status}\n`);
      results.push(r);
    }
  });
  await Promise.all(workers);
  return results;
}

// ── Main ──

if (!PPQ_API_KEY) { console.error('PPQ_API_KEY required'); process.exit(1); }

// Build all jobs
const jobs = [];
for (const model of MODELS) {
  for (const productId of SAMPLE) {
    jobs.push({ model, productId });
  }
}

console.log(`Running ${jobs.length} jobs (${MODELS.length} models × ${SAMPLE.length} products), 10 parallel workers...\n`);
const allResults = await runParallel(jobs, 10);

// ── Aggregate ──

const byModel = {};
const timings = {};
const tokensByModel = {};
for (const r of allResults) {
  if (!byModel[r.model]) { byModel[r.model] = {}; timings[r.model] = []; tokensByModel[r.model] = { input: 0, output: 0 }; }
  byModel[r.model][r.productId] = r.features;
  if (r.elapsedMs > 0) timings[r.model].push(r.elapsedMs);
  tokensByModel[r.model].input += r.inputTokens;
  tokensByModel[r.model].output += r.outputTokens;
}

// ── Quote validation summary ──

console.log('\n\n════════════════════════════════════════════════════════');
console.log('              QUOTE VALIDATION RESULTS');
console.log('════════════════════════════════════════════════════════\n');

// Also validate haiku round-1 results
const haiku1Data = JSON.parse(fs.readFileSync(
  path.join(ROOT, 'scripts', 'cache', 'model-comparison.json'), 'utf8'
));
byModel['claude-haiku-4.5'] = {};
for (const prod of SAMPLE) {
  byModel['claude-haiku-4.5'][prod] = haiku1Data.results['claude-haiku-4.5'][prod] || [];
}
// Add quote validation to haiku-1 features
for (const prod of SAMPLE) {
  const [plat, appId] = prod.split('/');
  const textPath = path.join(CACHE_TEXT_DIR, plat, `${appId}.yaml`);
  const record = fs.existsSync(textPath) ? readYaml(textPath) : null;
  if (!record) continue;
  byModel['claude-haiku-4.5'][prod] = byModel['claude-haiku-4.5'][prod].map(f => ({
    ...f,
    quoteValid: f.hasQuote ? validateQuote(f.quote, record, f.source) : 'no_quote',
  }));
}

const allModels = ['claude-haiku-4.5', ...MODELS];

for (const prod of SAMPLE) {
  console.log(`\n── ${prod} ──`);
  for (const model of allModels) {
    const feats = (byModel[model] || {})[prod] || [];
    const shortName = model.split('/').pop().padEnd(28);
    if (feats.length === 0) {
      console.log(`  ${shortName} (none)`);
    } else {
      feats.forEach(f => {
        const valid = f.quoteValid === 'exact' ? '✅' : f.quoteValid === 'partial' ? '⚠️' : f.quoteValid === 'not_found' ? '❌' : '·';
        console.log(`  ${shortName} ${valid} ${f.key}: "${(f.quote||'').slice(0,60)}" (${f.source})`);
      });
    }
  }
}

// ── Summary table ──

console.log('\n\n══ SUMMARY ══');
const pricing = {
  'claude-haiku-4.5': [1.05, 5.25],
  'anthropic/claude-3.5-haiku': [0.84, 4.20],
  'gemini-3-flash-preview': [0.35, 2.10],
  'openai/gpt-5-mini': [0.2625, 2.10],
  'mistralai/mistral-large-2512': [0.525, 1.575],
  'deepseek/deepseek-v3.2': [0.273, 0.399],
};

console.log(`${'Model'.padEnd(35)} ${'Total'.padStart(6)} ${'Valid✅'.padStart(7)} ${'Partial⚠️'.padStart(10)} ${'False❌'.padStart(7)} ${'Med ms'.padStart(7)} ${'¢/prod'.padStart(8)}`);
for (const model of allModels) {
  let total = 0, exact = 0, partial = 0, notFound = 0;
  for (const prod of SAMPLE) {
    const feats = (byModel[model] || {})[prod] || [];
    total += feats.length;
    exact += feats.filter(f => f.quoteValid === 'exact').length;
    partial += feats.filter(f => f.quoteValid === 'partial').length;
    notFound += feats.filter(f => f.quoteValid === 'not_found').length;
  }
  const t = (timings[model] || []).sort((a,b)=>a-b);
  const med = t.length ? t[Math.floor(t.length/2)] : 0;
  const u = tokensByModel[model] || { input: 0, output: 0 };
  const p = pricing[model] || [0, 0];
  const n = SAMPLE.length;
  const costPer1Prod = n > 0 ? ((u.input/n * p[0]) + (u.output/n * p[1])) / 1_000_000 * 100 : 0;

  console.log(`${model.padEnd(35)} ${String(total).padStart(6)} ${String(exact).padStart(7)} ${String(partial).padStart(10)} ${String(notFound).padStart(7)} ${String(med).padStart(7)} ${costPer1Prod.toFixed(4).padStart(8)}`);
}

// Save
const outPath = path.join(ROOT, 'scripts', 'cache', 'model-comparison2.json');
const saveData = { models: MODELS, sample: SAMPLE, results: byModel, timings, tokensByModel, timestamp: new Date().toISOString() };
fs.writeFileSync(outPath, JSON.stringify(saveData, null, 2));
console.log(`\nRaw results saved to: ${outPath}`);
