
function parseFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  try { return yaml.load(m[1]); } catch { return null; }
}

function getReviewBody(content) {
  const m = content.match(/^---\n[\s\S]*?\n---\s*\n/);
  return m ? content.slice(m[0].length).trimEnd() : '';
}

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex').slice(0, 32);
}

// Minimal feature definitions (~200 tokens vs 3000)
const FEATURE_PROMPT_MINIMAL = `segwit: Full SegWit Support
taproot: Full Taproot Support
ln: Lightning Network support
bip158spv: SPV using compact block filters
TOR: TOR - The Onion Router
ownLN: Connect To Own Lightning Node (NOT custodial)
ownFullNode: Connect To Own Full Node
hd: Hierarchically Deterministic
multiAccount: Unlimited Accounts
batching: Transaction Batching
multiSig: Multi Signature
tradeAlts: Trade from and to other crypto currencies
buyWithCC: Buy with Credit Card
mix: CoinJoin / Coin Mixing
airGapped: Air Gapped - App works without internet
liquid: Liquid Network Integration (NOT cashu - sidechain L-BTC)
fingerprint: Fingerprint Authentication
secEl: Secure Elements
camera: Camera for Secure Transactions
cashu: Cashu eCash ecash protocol (NOT Liquid)
fedimint: Fedimint eCash federated custody
ecash-mint: eCash Mint Software
coinCtrl: Advanced UTXO Control
companion: Companion App (tag on HOT/wallet side, NOT on air-gapped signing device)
customNode: Custom Node Connection
foss: Free and Open Source (OSI-approved: MIT, GPL, Apache, AGPL. NOT Commons Clause, NOT source-available)
nfc: NFC`;

// Concise rules (~100 tokens vs verbose)
const RULES_MINIMAL = `Rules:
1. LN vs Liquid: completely different. cashu vs liquid: different.
2. ownLN = user's own node. Custodial (Spark, WoS) = NOT ownLN.
3. companion = tag the HOT wallet app. Air-gapped device gets airGapped.
4. foss = OSI-approved license only. Commons Clause = NOT foss.
5. Quote must be exact verbatim from source. No paraphrasing.
6. Review body evidence: do NOT return.
7. Be conservative. Omit if unsure.`;

function buildMinimalPrompt(productInfo, existingFeatures) {
  const already = existingFeatures.length ? `Excluded (already confirmed): ${existingFeatures.join(', ')}` : 'No features confirmed yet.';
  
  // Per-product context
  const context = [
    productInfo.readme && `README:\n${productInfo.readme.slice(0, 6000)}`,
    productInfo.license && `License:\n${productInfo.license.slice(0, 2000)}`,
    productInfo.websiteText && `Website:\n${productInfo.websiteText.slice(0, 4000)}`,
  ].filter(Boolean).join('\n\n');

  return `Find features for "${productInfo.title}" (${productInfo.platform}/${productInfo.appId}).
${already}

${FEATURE_PROMPT_MINIMAL}

${RULES_MINIMAL}

## Source text
${context}

Respond with YAML: features: [{key: {source: "README|License|Website", quote: "exact excerpt"}}] or features: []`;
}

// ── Fetch logic (same as featureVerifier, but hash and compare) ─────────────

async function fetchUrl(url, maxBytes = 80000) {
  try {
    const out = execSync(`curl -sL --max-time 12 -A "WalletScrutiny/1.0" "${url}"`,
      { encoding: 'utf8', stdio: ['pipe','pipe','pipe'], timeout: 15000, maxBuffer: 4 * 1024 * 1024 });
    return out.slice(0, maxBytes);
  } catch { return ''; }
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
    .replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&nbsp;/g,' ')
    .replace(/\s{3,}/g, '\n\n').trim();
}

function stripMarkdown(md) {
  return md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^```[\s\S]*?^```/gm, '')
    .replace(/\s{3,}/g, '\n\n').trim();
}

async function fetchGitHubReadme(repoUrl) {
  if (!repoUrl) return '';
  const m = repoUrl.match(/https?:\/\/github\.com\/([^/]+\/[^/]+?)(?:\.git)?(?:\/?$)/);
  if (!m) return '';
  const slug = m[1];
  const apiUrl = `https://api.github.com/repos/${slug}/readme`;
  const apiResp = await fetchUrl(apiUrl, 4096);
  if (apiResp) {
    try {
      const meta = JSON.parse(apiResp);
      if (meta.download_url) {
        const raw = await fetchUrl(meta.download_url);
        if (raw && raw.length > 100) return stripMarkdown(raw);
      }
    } catch {}
  }
  for (const br of ['main', 'master'])
    for (const fn of ['README.md', 'README.markdown', 'readme.md']) {
      const raw = await fetchUrl(`https://raw.githubusercontent.com/${slug}/${br}/${fn}`);
      if (raw && raw.length > 100) return stripMarkdown(raw);
    }
  return '';
}

async function fetchGitHubLicense(repoUrl) {
  if (!repoUrl) return '';
  const m = repoUrl.match(/https?:\/\/github\.com\/([^/]+\/[^/]+?)(?:\.git)?(?:\/?$)/);
  if (!m) return '';
  const slug = m[1];
  
  async function resolveFile(url) {
    const raw = await fetchUrl(url);
    if (!raw || raw.length < 10) return '';
    const trimmed = raw.trim();
    if (trimmed.length < 40 && !trimmed.includes('\n') && /^[\w.-]+$/.test(trimmed)) {
      const base = url.replace(/[^/]+$/, '');
      const follow = await fetchUrl(base + trimmed);
      if (follow && follow.length > 10) return follow;
    }
    return raw;
  }
  
  const apiUrl = `https://api.github.com/repos/${slug}/license`;
  const apiResp = await fetchUrl(apiUrl, 4096);
  if (apiResp) {
    try {
      const meta = JSON.parse(apiResp);
      if (meta.download_url) {
        const resolved = await resolveFile(meta.download_url);
        if (resolved) return resolved;
      }
    } catch {}
  }
  
  for (const br of ['main', 'master'])
    for (const fn of ['LICENSE', 'LICENSE.md', 'COPYING', 'COPYING-CC']) {
      const resolved = await resolveFile(`https://raw.githubusercontent.com/${slug}/${br}/${fn}`);
      if (resolved) return resolved;
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

// ── Main logic ─────────────────────────────────────────────────────────────

async function processProduct(plat, appId, filepath) {
  const fm = parseFrontmatter(fs.readFileSync(filepath, 'utf8'));
  if (!fm || !TARGET_VERDICTS.has(fm.verdict)) return null;
  
  const reviewBody = getReviewBody(fs.readFileSync(filepath, 'utf8'));
  const repoUrl = fm.repository || '';
  
  // Fetch all sources
  let description = '';
  if (plat === 'android' && fm.appId) description = await scrapePlayStore(fm.appId);
  
  const readme = await fetchGitHubReadme(repoUrl);
  const license = await fetchGitHubLicense(repoUrl);
  
  let websiteText = '';
  if (fm.website) {
    const html = await fetchUrl(fm.website);
    if (html) websiteText = stripHtml(html);
  }
  
  // Clean description
  if (description) description = stripHtml(description);
  
  // Build source fingerprint
  const sourceHash = sha256([readme, license, websiteText, description].join('||'));
  
  // Check if we have a cached result for this source hash
  const cachePath = path.join(CACHE_DIR, plat, `${appId}.json`);
  const existingCache = fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath, 'utf8')) : null;
  
  if (!FORCE && existingCache && existingCache.sourceHash === sourceHash) {
    return { status: 'skipped', appId, plat, reason: 'source unchanged', cache: existingCache };
  }
  
  // Build prompt and call LLM
  const existingFeatures = (fm.features || []).filter(f => typeof f === 'string');
  const productInfo = {
    title: fm.title || appId,
    platform: plat,
    appId,
    readme,
    license,
    websiteText,
  };
  
  const prompt = buildMinimalPrompt(productInfo, existingFeatures);
  
  // Call LLM
  const body = JSON.stringify({ model: MODEL, max_tokens: 1024, messages: [{ role: 'user', content: prompt }] });
  const tmp = `/tmp/fvopt_${process.pid}_${Date.now()}.json`;
  fs.writeFileSync(tmp, body);
  
  let result;
  try {
    const resp = execSync(
      `curl -sS -X POST "${PPQ_API_URL}/v1/chat/completions" -H "Content-Type: application/json" -H "Authorization: Bearer ${PPQ_API_KEY}" --data @"${tmp}"`,
      { encoding: 'utf8', timeout: 60000 }
    );
    const parsed = JSON.parse(resp);
    result = {
      raw: parsed.choices?.[0]?.message?.content || '',
      inputTokens: parsed.usage?.prompt_tokens || 0,
      outputTokens: parsed.usage?.completion_tokens || 0,
    };
  } finally {
    try { fs.unlinkSync(tmp); } catch {}
  }
  
  // Parse features from YAML response
  const features = parseLLMResponse(result.raw);
  
  // Validate quotes
  const validated = features.map(f => ({
    ...f,
    quoteValid: validateQuote(f.quote, productInfo, f.source),
  }));
  
  // Save to cache
  const cacheEntry = {
    sourceHash,
    fetchedAt: new Date().toISOString(),
    features: validated,
    inputTokens: result.inputTokens,
    outputTokens: result.outputTokens,
  };
  
  ensureDir(path.dirname(cachePath));
  fs.writeFileSync(cachePath, JSON.stringify(cacheEntry, null, 2));
  
  return {
    status: 'processed',
    appId,
    plat,
    features: validated,
    inputTokens: result.inputTokens,
    outputTokens: result.outputTokens,
  };
}

function parseLLMResponse(response) {
  const m = response.match(/```ya?ml\s*([\s\S]*?)```/i);
  const raw = m ? m[1].trim() : response.trim();
  try {
    const parsed = yaml.load(raw);
    if (!parsed || !Array.isArray(parsed.features)) return [];
    const results = [];
    for (const entry of parsed.features) {
      if (typeof entry === 'object' && entry !== null) {
        for (const [key, val] of Object.entries(entry)) {
          const v = typeof val === 'object' ? val : {};
          results.push({
            key,
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

function validateQuote(quote, productInfo, source) {
  if (!quote || quote.length < 10) return 'too_short';
  const textMap = {
    README: productInfo.readme,
    License: productInfo.license,
    Website: productInfo.websiteText,
    Store: productInfo.description,
  };
  const text = textMap[source] || Object.values(textMap).filter(Boolean).join('\n');
  if (!text) return 'no_source_text';
  
  const normalize = s => s.toLowerCase().replace(/\s+/g, ' ').trim();
  const nt = normalize(text);
  const nq = normalize(quote);
  
  if (nt.includes(nq)) return 'exact';
  
  // Partial: 4-word sliding window
  const words = nq.split(' ');
  if (words.length >= 4) {
    let found = 0;
    for (let i = 0; i <= words.length - 4; i++) {
      if (nt.includes(words.slice(i, i+4).join(' '))) found++;
    }
    if (found / Math.max(1, words.length - 3) >= 0.6) return 'partial';
  }
  return 'not_found';
}

async function applyFeatures(plat, appId, filepath, newFeatures) {
  const content = fs.readFileSync(filepath, 'utf8');
  const fm = parseFrontmatter(content);
  const reviewBody = getReviewBody(content);
  
  // Merge new features with existing
  const existing = new Set(fm.features || []);
  const toAdd = newFeatures.filter(f => f.quoteValid === 'exact' && !existing.has(f.key));
  if (!toAdd.length) return { added: 0 };
  
  fm.features = [...(fm.features || []), ...toAdd.map(f => f.key)];
  
  // Rebuild frontmatter
  const newFm = yaml.dump(fm, { lineWidth: 120 }).trim();
  const newContent = `---\n${newFm}---\n\n${reviewBody}`;
  
  fs.writeFileSync(filepath, newContent);
  return { added: toAdd.length, features: toAdd.map(f => f.key) };
}

// ── Main entry ────────────────────────────────────────────────────────────

async function main() {
  if (!PPQ_API_KEY) { console.error('PPQ_API_KEY required'); process.exit(1); }
  
  // Find all products
  const products = [];
  for (const [plat, folder] of Object.entries(PLATFORMS)) {
    const dir = path.join(ROOT, folder);
    if (!fs.existsSync(dir)) continue;
    for (const fn of fs.readdirSync(dir)) {
      if (!fn.endsWith('.md')) continue;
      products.push({ plat, appId: fn.slice(0, -3), filepath: path.join(dir, fn) });
    }
  }
  
  console.log(`Found ${products.length} products`);
  
  let totalInput = 0, totalOutput = 0, processed = 0, skipped = 0, cost = 0;
  
  for (const { plat, appId, filepath } of products) {
    const result = await processProduct(plat, appId, filepath);
    if (!result) continue;
    
    if (result.status === 'skipped') {
      skipped++;
      continue;
    }
    
    processed++;
    totalInput += result.inputTokens;
    totalOutput += result.outputTokens;
    cost += (result.inputTokens / 1000) * COST_PER_1K_INPUT + (result.outputTokens / 1000) * COST_PER_1K_OUTPUT;
    
    const verified = result.features.filter(f => f.quoteValid === 'exact');
    if (verified.length > 0) {
      console.log(`${plat}/${appId}: ${verified.length} verified features added`);
    }
    
    if (DO_APPLY && !DRY_RUN) {
      const applied = await applyFeatures(plat, appId, filepath, result.features);
      if (applied.added > 0) {
        console.log(`  Applied: ${applied.features.join(', ')}`);
      }
    }
  }
  
  console.log(`\n=== Summary ===`);
  console.log(`Processed: ${processed}`);
  console.log(`Skipped (unchanged): ${skipped}`);
  console.log(`Total cost: $${cost.toFixed(4)}`);
  console.log(`Avg per product: $${(cost / (processed || 1)).toFixed(4)}`);
  
  if (DRY_RUN) {
    console.log('\nDry run - no changes applied');
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
