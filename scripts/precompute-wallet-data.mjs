#!/usr/bin/env node
/**
 * Pre-compute expensive wallet data that Jekyll would otherwise calculate
 * during rendering. This script runs once before Jekyll and generates
 * a JSON file that Jekyll can quickly read.
 * 
 * This eliminates O(n²) loops in Liquid templates.
 */

import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

const ROOT = process.cwd();

// Load platform metadata
const platformMeta = yaml.load(fs.readFileSync(path.join(ROOT, '_data/platformMeta.yml'), 'utf8'));

// Load verdict definitions
const verdictsDir = path.join(ROOT, '_data/verdicts');
const verdicts = {};
for (const file of fs.readdirSync(verdictsDir)) {
  if (file.endsWith('.yml')) {
    const key = file.replace('.yml', '');
    verdicts[key] = yaml.load(fs.readFileSync(path.join(verdictsDir, file), 'utf8'));
  }
}

// Platform folders to process
const platforms = ['mobile', 'hardware', 'bearer', 'desktop', 'others'];

/**
 * Parse frontmatter from markdown file
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  try {
    return yaml.load(match[1]);
  } catch (e) {
    return null;
  }
}

/**
 * Get criteria for a platform - only verdicts that have a "pass" field count as tests
 * This matches the Liquid logic in wallet_score.html
 */
function getCriteria(platform) {
  const allVerdicts = platformMeta[platform]?.verdicts || [];
  return allVerdicts.filter(v => verdicts[v]?.pass);
}

/**
 * Calculate wallet score (replicates wallet_score.html logic)
 * Score depends only on platform + verdict, not on individual wallet
 * 
 * Logic:
 * - criteria = only verdicts with "pass" field (these are the "tests")
 * - count = how many tests passed before hitting current verdict
 * - if verdict is sourceavailable/diy, it counts as passing that test too
 * - if verdict is wip, count = 0
 */
function calculateWalletScore(verdict, platform) {
  const criteria = getCriteria(platform);
  let count = 0;
  
  if (verdict === 'wip') {
    return { count: 0, total: criteria.length };
  }
  
  for (const criterion of criteria) {
    if (verdict === criterion) {
      // sourceavailable and diy count as passing the test
      if (verdict === 'sourceavailable' || verdict === 'diy') {
        count++;
      }
      break;
    }
    count++;
    if (count >= criteria.length) break;
  }
  
  return { count, total: criteria.length };
}

/**
 * Build seeAlso data - find wallets with same wsId on other platforms
 */
function buildSeeAlsoIndex(allWallets) {
  const wsIdIndex = {};
  
  // Index all wallets by wsId
  for (const [platform, wallets] of Object.entries(allWallets)) {
    for (const wallet of wallets) {
      if (wallet.wsId) {
        if (!wsIdIndex[wallet.wsId]) {
          wsIdIndex[wallet.wsId] = [];
        }
        wsIdIndex[wallet.wsId].push({
          platform,
          appId: wallet.appId,
          // Use altTitle if available (important for Android wallets with generic names)
          title: wallet.altTitle || wallet.title,
          icon: wallet.icon
        });
      }
    }
  }
  
  return wsIdIndex;
}

/**
 * Load all wallets from a platform folder
 */
function loadPlatformWallets(platform) {
  const dir = path.join(ROOT, `_${platform}`);
  if (!fs.existsSync(dir)) return [];

  const wallets = [];
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;

    const fileContent = fs.readFileSync(path.join(dir, file), 'utf8');
    const frontmatter = parseFrontmatter(fileContent);
    if (!frontmatter) continue;

    wallets.push({
      ...frontmatter,
      _file: file
    });
  }

  return wallets;
}

/**
 * Load unified mobile wallets from _mobile (one entry per wallet page).
 */
function loadMobileWallets() {
  const dir = path.join(ROOT, '_mobile');
  if (!fs.existsSync(dir)) return [];

  const wallets = [];
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;

    const fileContent = fs.readFileSync(path.join(dir, file), 'utf8');
    const frontmatter = parseFrontmatter(fileContent);
    if (!frontmatter) continue;

    const slug = file.replace(/\.md$/, '');
    const android = frontmatter.android || {};
    const iphone = frontmatter.iphone || {};
    const storePlatform = android.appId ? 'android' : (iphone.appId ? 'iphone' : 'android');
    const storeAppId = android.appId || iphone.appId || slug;
    const iconFolder = android.icon ? 'android' : (iphone.icon ? 'iphone' : storePlatform);

    wallets.push({
      ...frontmatter,
      _file: file,
      _slug: slug,
      appId: slug,
      storeAppId,
      storePlatform,
      iconFolder,
      hasAndroid: Boolean(android.appId),
      hasIphone: Boolean(iphone.appId),
      icon: android.icon || iphone.icon || '',
      altTitle: android.altTitle || iphone.altTitle || '',
      users: Math.max(Number(android.users) || 0, Number(iphone.users) || 0),
      reviews: Math.max(Number(android.reviews) || 0, Number(iphone.reviews) || 0)
    });
  }

  return wallets;
}

// Main execution
console.log('Pre-computing wallet data...');

const allWallets = {};
const precomputed = {
  // Key: "platform-verdict" (score only depends on these two)
  walletScores: {},
  // Key: "platform/appId" (seeAlso is per-wallet)
  seeAlso: {},
  generated: new Date().toISOString()
};

// Load all wallets
for (const platform of platforms) {
  console.log(`  Loading ${platform}...`);
  allWallets[platform] = platform === 'mobile'
    ? loadMobileWallets()
    : loadPlatformWallets(platform);
}

// Build seeAlso index
const wsIdIndex = buildSeeAlsoIndex(allWallets);

// Pre-compute scores keyed by platform-verdict (not per-wallet)
// Only compute for verdicts that actually exist in the platform's verdict list
for (const platform of platforms) {
  const platformVerdicts = platformMeta[platform]?.verdicts || [];
  for (const verdict of platformVerdicts) {
    const key = `${platform}-${verdict}`;
    if (!precomputed.walletScores[key]) {
      precomputed.walletScores[key] = calculateWalletScore(verdict, platform);
    }
  }
}

// Debug: show criteria count per platform
console.log('\n  Criteria per platform (verdicts with "pass" field):');
for (const platform of platforms) {
  const criteria = getCriteria(platform);
  console.log(`    ${platform}: ${criteria.length} tests (${criteria.join(', ')})`);
}

// Build seeAlso links (still per-wallet, keyed by platform/appId)
for (const platform of platforms) {
  for (const wallet of allWallets[platform]) {
    if (wallet.wsId && wsIdIndex[wallet.wsId]) {
      const others = wsIdIndex[wallet.wsId].filter(w => w.platform !== platform);
      if (others.length > 0) {
        const key = `${platform}/${wallet.appId}`;
        precomputed.seeAlso[key] = others;
      }
    }
  }
}

// Write precomputed.json
const outputPath = path.join(ROOT, '_data/precomputed.json');
fs.writeFileSync(outputPath, JSON.stringify(precomputed, null, 2));

console.log(`\nGenerated ${outputPath}`);
console.log(`  Wallet scores: ${Object.keys(precomputed.walletScores).length} unique platform-verdict combinations`);
console.log(`  SeeAlso links: ${Object.keys(precomputed.seeAlso).length} wallets with cross-platform links`);

// Generate wallets.json (replaces Liquid template generation)
console.log('\nGenerating wallets.json...');
const walletsJsonPlatforms = ['hardware', 'mobile', 'bearer', 'desktop', 'others'];
const walletsJson = {};

for (const platform of walletsJsonPlatforms) {
  walletsJson[platform] = {};
  const wallets = allWallets[platform] || [];
  
  for (const wallet of wallets) {
    const scoreKey = `${platform}-${wallet.verdict}`;
    const score = precomputed.walletScores[scoreKey] || { count: 0, total: 0 };
    const verdictData = verdicts[wallet.verdict] || {};
    
    const passedText = score.count === score.total 
      ? `Passed all ${score.total} tests`
      : `Passed ${score.count} of ${score.total} tests`;
    
    walletsJson[platform][wallet.appId] = {
      wsId: wallet.wsId || '',
      title: wallet.title || '',
      appId: wallet.appId || '',
      date: wallet.date || '',
      verdict: wallet.verdict || '',
      meta: wallet.meta || '',
      version: wallet.version || '',
      released: wallet.released || '',
      updated: wallet.updated || '',
      icon: wallet.icon || '',
      developerName: wallet.developerName || '',
      users: wallet.users || '',
      score: { numerator: score.count, denominator: score.total },
      passedText,
      verdictText: verdictData.title || ''
    };
  }
}

const walletsJsonPath = path.join(ROOT, 'assets/js/json/wallets-precomputed.json');
fs.writeFileSync(walletsJsonPath, JSON.stringify(walletsJson));
console.log(`  Generated ${walletsJsonPath}`);

// Generate allProducts.json (used by allWallets.js)
console.log('\nGenerating allProducts.json...');

// Load features.yml to compute alertFeatures
const featuresYml = fs.readFileSync(path.join(ROOT, '_data/features.yml'), 'utf8');
const featuresData = yaml.load(featuresYml) || {};
const alertFeatureKeys = new Set(Object.entries(featuresData).filter(([,v]) => v && v.alert).map(([k]) => k));

const allProductsJson = {
  verdicts: verdicts,
  featureAlerts: Object.fromEntries(
    Object.entries(featuresData).filter(([,v]) => v && v.alert).map(([k,v]) => [k, v.short || k])
  ),
  featureAlertMessages: Object.fromEntries(
    Object.entries(featuresData).filter(([,v]) => v && v.alert).map(([k,v]) => [k, (v.alert || '').replace(/<[^>]+>/g, '').trim()])
  ),
  featureShorts: Object.fromEntries(
    Object.entries(featuresData).filter(([,v]) => v && v.short).map(([k,v]) => [k, v.short])
  )
};

const productPlatforms = ['mobile', 'hardware', 'bearer', 'desktop', 'others'];
const platformCategories = {
  mobile: 'Mobile',
  hardware: 'Hardware Wallet',
  bearer: 'Bearer Token',
  desktop: 'Desktop',
  others: 'Others'
};

for (const platform of productPlatforms) {
  const wallets = allWallets[platform] || [];
  const apps = wallets.map(wallet => {
    const scoreKey = `${platform}-${wallet.verdict}`;
    const score = precomputed.walletScores[scoreKey] || { count: 0, total: 0 };
    const walletFeatures = (Array.isArray(wallet.features) ? wallet.features : [])
      .filter(f => typeof f === 'string' && featuresData[f] !== undefined);
    const app = {
      appId: wallet.appId || '',
      title: wallet.title || '',
      icon: wallet.icon || '',
      meta: wallet.meta || '',
      verdict: wallet.verdict || '',
      url: platform === 'mobile'
        ? `/mobile/${wallet._slug || wallet.appId}/`
        : `/${platform}/${wallet.appId}/`,
      score: { numerator: score.count, denominator: score.total },
      features: walletFeatures,
      alertFeatures: walletFeatures.filter(f => alertFeatureKeys.has(f))
    };
    if (platform === 'mobile') {
      app.wsId = wallet.wsId || '';
      app.altTitle = wallet.altTitle || '';
      app.storeAppId = wallet.storeAppId || '';
      app.storePlatform = wallet.storePlatform || 'android';
      app.iconFolder = wallet.iconFolder || 'android';
      app.hasAndroid = wallet.hasAndroid || false;
      app.hasIphone = wallet.hasIphone || false;
      app.androidAppId = wallet.android?.appId || '';
      app.iphoneAppId = wallet.iphone?.appId || '';
      app.users = wallet.users || 0;
      app.reviews = wallet.reviews || 0;
    }
    return app;
  });
  
  allProductsJson[platform] = {
    category: platformCategories[platform],
    apps
  };
}

const allProductsPath = path.join(ROOT, '_includes/allProducts-precomputed.json');
fs.writeFileSync(allProductsPath, JSON.stringify(allProductsJson));
console.log(`  Generated ${allProductsPath}`);
