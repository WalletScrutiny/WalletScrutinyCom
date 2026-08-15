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
import {
  summarizeMobileStoreFields,
  toStoreDateString,
  listingMetaForMobile,
  combineMobileMeta,
  platformMeta as getPlatformBlockMeta,
  platformVerdict,
} from './mobileWalletStore.mjs';
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

// Load verdict groups for homepage stats
const verdictGroups = yaml.load(
  fs.readFileSync(path.join(ROOT, '_data/verdictGroups.yml'), 'utf8')
) || [];

// Load features for walletLink alert badges
const featuresData = yaml.load(
  fs.readFileSync(path.join(ROOT, '_data/features.yml'), 'utf8')
) || {};

/** Compact [numerator, denominator] score tuple for allWallets.js (expanded client-side). */
function compactScore(score) {
  return [score.count, score.total];
}

/** Drop empty defaults from serialized wallet apps to shrink allWallets.js. */
function omitEmptyAppFields(app) {
  const out = {};
  for (const [key, value] of Object.entries(app)) {
    if (value === '' || value === false || value == null) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    if (value === 0 && (key === 'users' || key === 'reviews')) continue;
    if (value === 'ok' && (key === 'meta' || key === 'metaAndroid' || key === 'metaIphone')) continue;
    if (value === 'android' && (key === 'storePlatform' || key === 'iconFolder')) continue;
    out[key] = value;
  }
  return out;
}

function slimVerdictsForClient(allVerdicts) {
  return Object.fromEntries(
    Object.entries(allVerdicts).map(([key, value]) => [key, {
      short: value.short,
      title: value.title,
      ...(value.color ? { color: value.color } : {}),
    }])
  );
}

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
 * Resolve icon/title for walletLink.html (matches Liquid logic in _includes/walletLink.html).
 */
function resolveMobileWalletLinkDisplay(wallet, linkPlatform) {
  const android = wallet.android || {};
  const iphone = wallet.iphone || {};
  let icon_platform = linkPlatform;
  let icon_name = null;
  let link_title = null;

  if (linkPlatform === 'iphone' && iphone.icon) {
    icon_platform = 'iphone';
    icon_name = iphone.icon;
    link_title = iphone.altTitle || wallet.title;
  } else if (linkPlatform === 'android' && android.icon) {
    icon_platform = 'android';
    icon_name = android.icon;
    link_title = android.altTitle || wallet.title;
  } else if (android.icon) {
    icon_platform = 'android';
    icon_name = android.icon;
    link_title = android.altTitle || wallet.title;
  } else if (iphone.icon) {
    icon_platform = 'iphone';
    icon_name = iphone.icon;
    link_title = iphone.altTitle || wallet.title;
  } else {
    link_title = wallet.title;
  }

  return { icon_platform, icon_name, link_title };
}

function buildWalletLinkEntry(wallet, linkPlatform, icon_platform, icon_name, link_title, url) {
  const walletFeatures = (Array.isArray(wallet.features) ? wallet.features : [])
    .filter(f => typeof f === 'string');
  const alertFeatures = walletFeatures
    .filter(f => featuresData[f]?.alert)
    .map(f => ({
      key: f,
      short: featuresData[f].short || f,
      message: (featuresData[f].alert || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
    }));

  return {
    url,
    title: link_title || wallet.altTitle || wallet.title || '',
    icon_platform,
    icon_name: icon_name || '',
    verdict: wallet.verdict || '',
    meta: wallet.meta || '',
    alertFeatures,
  };
}

/**
 * Build O(1) walletLink lookup index (replaces where_exp on site.mobile in Liquid).
 */
function buildWalletLinksIndex(allWallets) {
  const walletLinks = {};

  const setEntry = (key, entry) => {
    if (key && !walletLinks[key]) {
      walletLinks[key] = entry;
    }
  };

  for (const wallet of allWallets.mobile || []) {
    const slug = wallet._slug || wallet.appId;
    const url = `/mobile/${slug}/`;
    const android = wallet.android || {};
    const iphone = wallet.iphone || {};

    for (const linkPlatform of ['android', 'iphone', 'mobile']) {
      const { icon_platform, icon_name, link_title } = resolveMobileWalletLinkDisplay(wallet, linkPlatform);
      const entry = buildWalletLinkEntry(wallet, linkPlatform, icon_platform, icon_name, link_title, url);
      if (linkPlatform === 'android' && android.appId) {
        setEntry(`android/${android.appId}`, entry);
      }
      if (linkPlatform === 'iphone' && iphone.appId) {
        setEntry(`iphone/${iphone.appId}`, entry);
      }
      if (linkPlatform === 'mobile') {
        setEntry(`mobile/${slug}`, entry);
      }
    }
  }

  for (const platform of ['hardware', 'bearer', 'desktop', 'others']) {
    for (const wallet of allWallets[platform] || []) {
      const appId = wallet.appId;
      if (!appId) continue;
      const url = `/${platform}/${appId}/`;
      const entry = buildWalletLinkEntry(
        wallet,
        platform,
        platform,
        wallet.icon || '',
        wallet.altTitle || wallet.title,
        url
      );
      setEntry(`${platform}/${appId}`, entry);
    }
  }

  return walletLinks;
}

/**
 * Effective meta/verdict for homepage verdict groups (matches product_matches_verdict_group.html).
 */
function computeEffectiveMetaVerdict(product, isMobile) {
  let eff_meta = product.meta || 'ok';
  let eff_verdict = product.verdict || '';

  if (isMobile && (product.android?.appId || product.iphone?.appId || product.iphone?.idd)) {
    const am = product.android?.meta || 'ok';
    const im = product.iphone?.meta || 'ok';
    if (product.android?.appId && product.iphone?.appId) {
      eff_meta = (am === 'obsolete' && im === 'obsolete') ? 'obsolete' : am;
    } else if (product.android?.appId) {
      eff_meta = am;
    } else {
      eff_meta = im;
    }
    if (product.android?.appId) {
      eff_verdict = product.android?.verdict || eff_verdict;
    } else if (product.iphone?.appId || product.iphone?.idd) {
      eff_verdict = product.iphone?.verdict || eff_verdict;
    }
  }

  return { eff_meta, eff_verdict };
}

function productMatchesVerdictGroup(eff_meta, eff_verdict, verdictGroup) {
  const hasMetas = verdictGroup.metas?.length > 0;
  const hasVerdicts = verdictGroup.verdicts?.length > 0;
  const metaMatch = hasMetas && verdictGroup.metas.includes(eff_meta);
  const verdictMatch = hasVerdicts && eff_verdict !== '' && verdictGroup.verdicts.includes(eff_verdict);

  if (verdictGroup.match === 'all') {
    return metaMatch && verdictMatch;
  }

  if (metaMatch) return true;
  if (verdictMatch) return true;
  return false;
}

function buildVerdictGroupCounts(allWallets) {
  const counts = Object.fromEntries(verdictGroups.map(g => [g.key, 0]));
  let totalReviewedProducts = 0;
  const exclusiveGroups = verdictGroups.filter((g) => g.exclusive);

  for (const platform of platforms) {
    const wallets = allWallets[platform] || [];
    const isMobile = platform === 'mobile';
    for (const wallet of wallets) {
      totalReviewedProducts++;
      const { eff_meta, eff_verdict } = computeEffectiveMetaVerdict(wallet, isMobile);
      const exclusiveMatch = exclusiveGroups.find((group) =>
        productMatchesVerdictGroup(eff_meta, eff_verdict, group)
      );
      if (exclusiveMatch) {
        counts[exclusiveMatch.key]++;
        continue;
      }

      for (const group of verdictGroups) {
        if (group.exclusive) continue;
        if (productMatchesVerdictGroup(eff_meta, eff_verdict, group)) {
          counts[group.key]++;
        }
      }
    }
  }

  return { verdictGroupCounts: counts, totalReviewedProducts };
}

/**
 * Custody step verdict indices (matches loop in _includes/review/steps/custody.html).
 */
function computeVerdictIndices(platform, stepVerdict) {
  const verdictsList = platformMeta[platform]?.verdicts || [];
  let custodyIndex = 0;
  let verdictIndex = 0;
  let iterationCount = 0;
  for (const verdict of verdictsList) {
    iterationCount++;
    if (verdict === stepVerdict) verdictIndex = iterationCount;
    if (verdict === 'custodial') custodyIndex = iterationCount;
  }
  return { custodyIndex, verdictIndex };
}

function buildVerdictIndicesMap() {
  const verdictIndices = {};
  for (const platform of Object.keys(platformMeta)) {
    const platformVerdicts = platformMeta[platform]?.verdicts || [];
    for (const verdict of platformVerdicts) {
      verdictIndices[`${platform}-${verdict}`] = computeVerdictIndices(platform, verdict);
    }
  }
  return verdictIndices;
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
    const storeFields = summarizeMobileStoreFields(android, iphone, { preferPlatform: storePlatform });

    const listingMeta = listingMetaForMobile(frontmatter, storePlatform);
    const combinedMeta = combineMobileMeta(android, iphone);

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
      reviews: Math.max(Number(android.reviews) || 0, Number(iphone.reviews) || 0),
      released: storeFields.released,
      updated: storeFields.updated,
      version: storeFields.version,
      date: toStoreDateString(frontmatter.date),
      meta: combinedMeta === 'obsolete' ? 'obsolete' : listingMeta,
      metaAndroid: getPlatformBlockMeta(android),
      metaIphone: getPlatformBlockMeta(iphone),
      verdictAndroid: android.appId ? platformVerdict(android) : '',
      verdictIphone: (iphone.appId || iphone.idd) ? platformVerdict(iphone) : '',
      android,
      iphone,
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
  // Key: "platform/appId" (walletLink O(1) lookup)
  walletLinks: {},
  // Key: verdict group key -> product count
  verdictGroupCounts: {},
  totalReviewedProducts: 0,
  // Key: "platform-verdict" -> custody step indices
  verdictIndices: {},
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

// Pre-compute scores keyed by platform-verdict (not per-wallet).
// Use every platform in platformMeta (android, iphone, mobile, …), not only wallet folders.
for (const platform of Object.keys(platformMeta)) {
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

console.log('  Building walletLinks index...');
precomputed.walletLinks = buildWalletLinksIndex(allWallets);

console.log('  Building verdict group counts...');
const groupCounts = buildVerdictGroupCounts(allWallets);
precomputed.verdictGroupCounts = groupCounts.verdictGroupCounts;
precomputed.totalReviewedProducts = groupCounts.totalReviewedProducts;

console.log('  Building verdict indices for custody step...');
precomputed.verdictIndices = buildVerdictIndicesMap();

// Write precomputed.json
const outputPath = path.join(ROOT, '_data/precomputed.json');
fs.writeFileSync(outputPath, JSON.stringify(precomputed, null, 2));

console.log(`\nGenerated ${outputPath}`);
console.log(`  Wallet scores: ${Object.keys(precomputed.walletScores).length} unique platform-verdict combinations`);
console.log(`  SeeAlso links: ${Object.keys(precomputed.seeAlso).length} wallets with cross-platform links`);
console.log(`  Wallet links: ${Object.keys(precomputed.walletLinks).length} lookup keys`);
console.log(`  Verdict group counts: ${precomputed.totalReviewedProducts} products across ${verdictGroups.length} groups`);

// Generate wallets.json (replaces Liquid template generation)
console.log('\nGenerating wallets.json...');
const walletsJsonPlatforms = ['hardware', 'mobile', 'bearer', 'desktop', 'others'];
const walletsJson = {};

for (const platform of walletsJsonPlatforms) {
  walletsJson[platform] = {};
  const wallets = allWallets[platform] || [];
  
  for (const wallet of wallets) {
    const isMobile = platform === 'mobile';
    const verdictAndroid = isMobile ? (wallet.verdictAndroid || '') : '';
    const verdictIphone = isMobile ? (wallet.verdictIphone || '') : '';
    const primaryVerdict = isMobile
      ? (verdictAndroid || verdictIphone || wallet.verdict || '')
      : (wallet.verdict || '');
    const scoreKey = `${platform}-${primaryVerdict}`;
    const score = precomputed.walletScores[scoreKey] || { count: 0, total: 0 };
    const verdictData = verdicts[primaryVerdict] || {};
    const scoreAndroid = verdictAndroid
      ? (precomputed.walletScores[`mobile-${verdictAndroid}`] || { count: 0, total: 0 })
      : null;
    const scoreIphone = verdictIphone
      ? (precomputed.walletScores[`mobile-${verdictIphone}`] || { count: 0, total: 0 })
      : null;

    const passedText = score.count === score.total
      ? `Passed all ${score.total} tests`
      : `Passed ${score.count} of ${score.total} tests`;

    const entry = {
      wsId: wallet.wsId || '',
      title: wallet.title || '',
      appId: wallet.appId || '',
      date: wallet.date || '',
      verdict: primaryVerdict,
      meta: wallet.meta || '',
      version: wallet.version || '',
      released: wallet.released || '',
      updated: wallet.updated || '',
      icon: wallet.icon || '',
      developerName: wallet.android?.developerName || wallet.iphone?.developerName || '',
      users: wallet.users || '',
      score: { numerator: score.count, denominator: score.total },
      passedText,
      verdictText: verdictData.title || '',
    };
    if (isMobile) {
      entry.verdictAndroid = verdictAndroid;
      entry.verdictIphone = verdictIphone;
      if (scoreAndroid) entry.scoreAndroid = { numerator: scoreAndroid.count, denominator: scoreAndroid.total };
      if (scoreIphone) entry.scoreIphone = { numerator: scoreIphone.count, denominator: scoreIphone.total };
    }
    walletsJson[platform][wallet.appId] = entry;
  }
}

const walletsJsonPath = path.join(ROOT, 'assets/js/json/wallets-precomputed.json');
fs.writeFileSync(walletsJsonPath, JSON.stringify(walletsJson));
console.log(`  Generated ${walletsJsonPath}`);

// Generate allProducts.json (used by allWallets.js)
console.log('\nGenerating allProducts.json...');

const allProductsJson = {
  verdicts: slimVerdictsForClient(verdicts),
  featureAlerts: Object.fromEntries(
    Object.entries(featuresData).filter(([,v]) => v && v.alert).map(([k,v]) => [k, v.short || k])
  ),
  featureAlertMessages: Object.fromEntries(
    Object.entries(featuresData).filter(([,v]) => v && v.alert).map(([k,v]) => [k, (v.alert || '').replace(/<[^>]+>/g, '').trim()])
  ),
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
    const isMobile = platform === 'mobile';
    const verdictAndroid = isMobile ? (wallet.verdictAndroid || '') : '';
    const verdictIphone = isMobile ? (wallet.verdictIphone || '') : '';
    const primaryVerdict = isMobile
      ? (verdictAndroid || verdictIphone || wallet.verdict || '')
      : (wallet.verdict || '');
    const scoreKey = `${platform}-${primaryVerdict}`;
    const score = precomputed.walletScores[scoreKey] || { count: 0, total: 0 };
    const scoreAndroid = verdictAndroid
      ? (precomputed.walletScores[`mobile-${verdictAndroid}`] || { count: 0, total: 0 })
      : null;
    const scoreIphone = verdictIphone
      ? (precomputed.walletScores[`mobile-${verdictIphone}`] || { count: 0, total: 0 })
      : null;
    const walletFeatures = (Array.isArray(wallet.features) ? wallet.features : [])
      .filter(f => typeof f === 'string' && featuresData[f] !== undefined);
    const app = {
      appId: wallet.appId || '',
      title: wallet.title || '',
      icon: wallet.icon || '',
      meta: wallet.meta || '',
      verdict: primaryVerdict,
      score: compactScore(score),
      features: walletFeatures,
    };
    if (platform === 'mobile') {
      if (wallet.wsId) app.wsId = wallet.wsId;
      if (wallet.altTitle) app.altTitle = wallet.altTitle;
      if (wallet.storeAppId) app.storeAppId = wallet.storeAppId;
      if (wallet.storePlatform && wallet.storePlatform !== 'android') app.storePlatform = wallet.storePlatform;
      if (wallet.iconFolder && wallet.iconFolder !== 'android') app.iconFolder = wallet.iconFolder;
      if (wallet.android?.appId) app.androidAppId = wallet.android.appId;
      const iphoneStoreId = wallet.iphone?.appId || wallet.iphone?.idd;
      if (iphoneStoreId) app.iphoneAppId = iphoneStoreId;
      if (wallet.users) app.users = wallet.users;
      if (wallet.reviews) app.reviews = wallet.reviews;
      if (wallet.metaAndroid && wallet.metaAndroid !== 'ok') app.metaAndroid = wallet.metaAndroid;
      if (wallet.metaIphone && wallet.metaIphone !== 'ok') app.metaIphone = wallet.metaIphone;
      if (verdictAndroid) app.verdictAndroid = verdictAndroid;
      if (verdictIphone) app.verdictIphone = verdictIphone;
      if (scoreAndroid) app.scoreAndroid = compactScore(scoreAndroid);
      if (scoreIphone) app.scoreIphone = compactScore(scoreIphone);
    }
    return omitEmptyAppFields(app);
  });
  
  allProductsJson[platform] = {
    category: platformCategories[platform],
    apps
  };
}

const allProductsPath = path.join(ROOT, '_includes/allProducts-precomputed.json');
fs.writeFileSync(allProductsPath, JSON.stringify(allProductsJson));
console.log(`  Generated ${allProductsPath}`);
