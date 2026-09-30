#!/usr/bin/env node
/**
 * modelCompare.mjs — Compare LLM models for feature verification quality.
 * Runs the same prompt on the same 30 products across multiple models,
 * then prints a comparison table.
 *
 * Usage: PPQ_API_KEY=... node scripts/modelCompare.mjs
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

const MODELS = [
  'claude-haiku-4.5',
  'minimax/minimax-m2.5',
  'gpt-5-nano',
  'openai/gpt-oss-120b',
  'google/gemini-2.0-flash-lite-001',
];

// Fixed seed sample of 30 products
const SAMPLE = [
  'android/com.blitzwallet', 'android/io.nunchuk.android', 'android/it.airgap.vault',
  'android/org.electrum.electrum', 'desktop/bitcoincore', 'desktop/bitcoinknots',
  'desktop/cakewallet', 'desktop/coldcore', 'desktop/desk.stackwallet',
  'desktop/nixbitcoin', 'desktop/sparrow', 'desktop/specter',
  'desktop/veruswallet', 'desktop/yeticold.wallet', 'hardware/bitBox2Nova',
  'hardware/coldcardMk4', 'hardware/keepKey', 'hardware/keycard-shell',
  'hardware/passportb2', 'hardware/trezorSafe5', 'iphone/co.acinq.phoenix',
  'iphone/co.edgesecure.app', 'iphone/com.coinspace.wallet', 'iphone/com.fontaine.FullyNoded',
  'iphone/com.mycelium.wallet-ios', 'iphone/it.airgap.vault', 'iphone/me.proton.wallet.ios',
  'iphone/org.autonomoussoftwarefoundation.verusmobile.ios', 'iphone/swiss.dfx.bitcoin',
  'iphone/world.bitkey.app',
];

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
  const apiKey = process.env.PPQ_API_KEY;
  const bodyFile = path.join(ROOT, '.git', 'MODEL_COMPARE_BODY');
  fs.writeFileSync(bodyFile, JSON.stringify({ model, max_tokens: 1024, messages: [{ role: 'user', content: prompt }] }), 'utf8');
  try {
    const result = execSync(
      `curl -sS -X POST "${PPQ_API_URL}/v1/chat/completions" -H "Content-Type: application/json" -H "Authorization: Bearer ${apiKey}" --data @"${bodyFile}"`,
      { encoding: 'utf8', timeout: 45000 }
    );
    const parsed = JSON.parse(result);
    if (parsed.error) throw new Error(JSON.stringify(parsed.error));
    const usage = parsed.usage || {};
    return { content: parsed.choices?.[0]?.message?.content || '', inputTokens: usage.prompt_tokens || 0, outputTokens: usage.completion_tokens || 0 };
  } finally { try { fs.unlinkSync(bodyFile); } catch {} }
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
            key,
            hasQuote: !!v.quote,
            hasSource: !!v.source,
            hasComment: !!v.comment,
            quote: v.quote || '',
            source: v.source || '',
            comment: v.comment || '',
          });
        }
      }
    }
    return results;
  } catch { return []; }
}

// ── Main ──

const apiKey = process.env.PPQ_API_KEY;
if (!apiKey) { console.error('PPQ_API_KEY required'); process.exit(1); }

const results = {};  // model -> product -> features[]
const tokenUsage = {};  // model -> { input, output }

for (const model of MODELS) {
  results[model] = {};
  tokenUsage[model] = { input: 0, output: 0 };
  console.log(`\n═══ ${model} ═══`);

  for (const productId of SAMPLE) {
    const [plat, appId] = productId.split('/');
    const textPath = path.join(CACHE_TEXT_DIR, plat, `${appId}.yaml`);
    if (!fs.existsSync(textPath)) { console.log(`  SKIP ${productId}: no cache`); continue; }
    const record = readYaml(textPath);
    if (!record) continue;

    const folder = PLATFORMS[plat];
    const mdPath = path.join(ROOT, folder, `${appId}.md`);
    if (!fs.existsSync(mdPath)) continue;
    const fm = parseFrontmatter(fs.readFileSync(mdPath, 'utf8'));
    if (!fm) continue;

    const existingFeatures = getOfficialFeatureKeys(fm);
    const prompt = buildPrompt(record, existingFeatures);
    if (!prompt) { results[model][productId] = []; continue; }

    process.stdout.write(`  ${productId} ... `);
    try {
      const { content, inputTokens, outputTokens } = await callLLM(model, prompt);
      tokenUsage[model].input += inputTokens;
      tokenUsage[model].output += outputTokens;
      const features = parseResponse(content);
      results[model][productId] = features;
      console.log(`${features.length} features (${features.filter(f => f.hasSource).length} sourced)`);
    } catch (e) {
      console.log(`ERROR: ${e.message.slice(0, 80)}`);
      results[model][productId] = [];
    }
  }
}

// ── Comparison ──

console.log('\n\n════════════════════════════════════════════════════════');
console.log('                   COMPARISON RESULTS');
console.log('════════════════════════════════════════════════════════\n');

// Per-product comparison
for (const productId of SAMPLE) {
  const allEmpty = MODELS.every(m => (results[m][productId] || []).length === 0);
  if (allEmpty) continue;

  console.log(`\n── ${productId} ──`);
  for (const model of MODELS) {
    const features = results[model][productId] || [];
    const shortName = model.split('/').pop();
    if (features.length === 0) {
      console.log(`  ${shortName.padEnd(30)} (none)`);
    } else {
      const keys = features.map(f => f.key).join(', ');
      const sourced = features.filter(f => f.hasSource).length;
      console.log(`  ${shortName.padEnd(30)} ${keys}  [${sourced}/${features.length} sourced]`);
    }
  }
}

// Summary stats
console.log('\n\n══ SUMMARY ══');
console.log(`${'Model'.padEnd(35)} ${'Total feat'.padStart(10)} ${'Sourced'.padStart(10)} ${'Quoted'.padStart(10)} ${'InTok'.padStart(10)} ${'OutTok'.padStart(10)} ${'Est $/1k'.padStart(10)}`);

const pricing = {
  'claude-haiku-4.5': [1.05, 5.25],
  'minimax/minimax-m2.5': [0.315, 1.155],
  'gpt-5-nano': [0.0525, 0.42],
  'openai/gpt-oss-120b': [0.041, 0.1995],
  'google/gemini-2.0-flash-lite-001': [0.0525, 0.21],
};

for (const model of MODELS) {
  let totalFeat = 0, totalSourced = 0, totalQuoted = 0;
  for (const pid of SAMPLE) {
    const features = results[model][pid] || [];
    totalFeat += features.length;
    totalSourced += features.filter(f => f.hasSource).length;
    totalQuoted += features.filter(f => f.hasQuote).length;
  }
  const u = tokenUsage[model];
  const p = pricing[model] || [0, 0];
  const costPer1k = ((u.input / 30 * 1000 * p[0]) + (u.output / 30 * 1000 * p[1])) / 1_000_000;
  console.log(`${model.padEnd(35)} ${String(totalFeat).padStart(10)} ${String(totalSourced).padStart(10)} ${String(totalQuoted).padStart(10)} ${String(u.input).padStart(10)} ${String(u.output).padStart(10)} ${'$'+costPer1k.toFixed(2).padStart(9)}`);
}

// Save raw results for manual inspection
const outPath = path.join(ROOT, 'scripts', 'cache', 'model-comparison.json');
fs.writeFileSync(outPath, JSON.stringify({ models: MODELS, results, tokenUsage, timestamp: new Date().toISOString() }, null, 2));
console.log(`\nRaw results saved to: ${outPath}`);
