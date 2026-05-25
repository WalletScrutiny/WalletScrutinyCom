#!/usr/bin/env node
/**
 * Migrate _android and _iphone wallet pages into _mobile.
 * Each run deletes _mobile/ and rebuilds from scratch. Original folders are untouched.
 *
 * Frontmatter layout:
 *   - Shared fields at the root (when equal, or when only one platform exists)
 *   - authors, social, features: union of both platforms at root
 *   - title: at root (Android value if both differ)
 *   - redirect_from: at root (existing redirects + /android/<id>/ + /iphone/<id>/)
 *   - android: / iphone: nested blocks for store-specific metadata and conflicting values
 *
 * Body layout (when both platforms exist):
 *   ## Android
 *   ...
 *   ---
 *   ## iPhone
 *   ...
 *
 * Pairs are matched by wsId when filenames differ (e.g. app.zeusln.zeus vs
 * com.zeusln.zeus). Output filename prefers the Android basename.
 *
 * Usage:
 *   node scripts/migrateToMobile.mjs
 *   node scripts/migrateToMobile.mjs --root /path/to/repo
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import helper from './helper.mjs';

const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Always at root; union of both platforms when dual. */
const COMBINED_ROOT_FIELDS = ['authors', 'social', 'features'];

/** Always at root; prefer Android value when both differ. */
const ROOT_SCALAR_PREFER_ANDROID = ['title'];

/** Semantic fields merged at root when values match. */
const MERGEABLE_COMMON_FIELDS = [
  'wsId',
  'bitcoinOrgId',
  'website',
  'repository',
  'bugbounty',
  'meta',
  'verdict',
  'date',
  'twitter',
  'developerName',
  'appCountry',
];

/** Always stored under android: / iphone: (never at root when both exist). */
const PLATFORM_METADATA_FIELDS = [
  'altTitle',
  'released',
  'updated',
  'version',
  'reviews',
  'icon',
  'signer',
];

const ANDROID_EXCLUSIVE_FIELDS = [
  'users',
  'alternativeStores',
  'builds',
];

const IPHONE_EXCLUSIVE_FIELDS = ['idd'];

const ROOT_FIELD_ORDER = [
  'wsId',
  'title',
  'altTitle',
  'bitcoinOrgId',
  'verdict',
  'meta',
  'date',
  'authors',
  'website',
  'repository',
  'bugbounty',
  'twitter',
  'social',
  'features',
  'developerName',
  'appCountry',
  'redirect_from',
  'android',
  'iphone',
];

const PLATFORM_FIELD_ORDER = [
  'appId',
  'altTitle',
  'users',
  'idd',
  'appCountry',
  'released',
  'updated',
  'version',
  'reviews',
  'icon',
  'signer',
  'alternativeStores',
  'builds',
  'meta',
  'verdict',
  'date',
  'website',
  'repository',
  'bugbounty',
  'twitter',
  'developerName',
  'bitcoinOrgId',
  'wsId',
];

function parseArgs (argv) {
  let root = path.resolve(__dirname, '..');
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--root' && argv[i + 1]) {
      root = path.resolve(argv[i + 1]);
      i++;
    }
  }
  return { root };
}

function splitFrontmatter (content) {
  if (!content.startsWith('---\n') && !content.startsWith('---\r\n')) {
    return { frontmatter: null, body: content };
  }
  const rest = content.replace(/^---\r?\n/, '');
  const end = rest.search(/\r?\n---\r?\n/);
  if (end === -1) {
    return { frontmatter: null, body: content };
  }
  const frontmatter = rest.slice(0, end);
  const body = rest.slice(end).replace(/^\r?\n---\r?\n/, '');
  return { frontmatter, body };
}

function parseYamlFrontmatter (frontmatter) {
  if (!frontmatter) return null;
  try {
    const data = yaml.load(frontmatter);
    return data && typeof data === 'object' ? data : null;
  } catch {
    return null;
  }
}

function isEmpty (v) {
  if (v === null || v === undefined) return true;
  if (typeof v === 'string' && v.trim() === '') return true;
  if (Array.isArray(v) && v.length === 0) return true;
  return false;
}

function normalizeForCompare (v) {
  if (isEmpty(v)) return null;
  if (Array.isArray(v)) {
    const items = v
      .map((item) => (typeof item === 'object' && item !== null
        ? JSON.stringify(item)
        : String(item).trim()))
      .filter((item) => item !== '');
    if (items.length === 0) return null;
    return [...items].sort();
  }
  if (typeof v === 'object') {
    return JSON.stringify(v, Object.keys(v).sort());
  }
  const t = String(v).trim();
  return t === '' ? null : t;
}

function valuesEqual (a, b) {
  const na = normalizeForCompare(a);
  const nb = normalizeForCompare(b);
  if (na === null && nb === null) return true;
  if (Array.isArray(na) && Array.isArray(nb)) {
    if (na.length !== nb.length) return false;
    return na.every((x, i) => x === nb[i]);
  }
  return na === nb;
}

function pruneEmpty (obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (isEmpty(v)) continue;
    out[k] = v;
  }
  return out;
}

function pickOrdered (obj, order) {
  const out = {};
  for (const key of order) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && !isEmpty(obj[key])) {
      out[key] = obj[key];
    }
  }
  for (const key of Object.keys(obj).sort()) {
    if (!order.includes(key) && !isEmpty(obj[key])) {
      out[key] = obj[key];
    }
  }
  return out;
}

function assignPlatformField (target, key, value) {
  if (!isEmpty(value)) {
    target[key] = value;
  }
}

function toListItems (v) {
  if (isEmpty(v)) return [];
  return Array.isArray(v) ? v.filter((item) => !isEmpty(item)) : [v];
}

/** Union of list values; earlier arguments first, then later-only entries. */
function combineListFields (...values) {
  const seen = new Set();
  const out = [];
  for (const value of values) {
    for (const item of toListItems(value)) {
    const key = typeof item === 'object' && item !== null
      ? JSON.stringify(item)
      : String(item).trim();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(item);
    }
  }
  return out.length > 0 ? out : null;
}

function basenameToSlug (basename) {
  return basename.replace(/\.md$/i, '');
}

function pickScalarPreferAndroid (aVal, iVal) {
  if (!isEmpty(aVal)) return aVal;
  if (!isEmpty(iVal)) return iVal;
  return null;
}

function stripRootFieldsFromPlatform (platformBlock) {
  if (!platformBlock) return;
  for (const key of [
    ...COMBINED_ROOT_FIELDS,
    ...ROOT_SCALAR_PREFER_ANDROID,
    'redirect_from',
  ]) {
    delete platformBlock[key];
  }
}

function legacyPlatformRedirects (androidBasename, iphoneBasename) {
  const out = [];
  if (androidBasename) {
    out.push(`/android/${basenameToSlug(androidBasename)}/`);
  }
  if (iphoneBasename) {
    out.push(`/iphone/${basenameToSlug(iphoneBasename)}/`);
  }
  return out;
}

function finalizeMobileHeader (mobile, {
  androidBasename,
  iphoneBasename,
  androidHeader,
  iphoneHeader,
}) {
  if (isEmpty(mobile.title)) {
    const title = pickScalarPreferAndroid(
      androidHeader?.title,
      iphoneHeader?.title
    );
    if (!isEmpty(title)) mobile.title = title;
  }

  const redirects = combineListFields(
    androidHeader?.redirect_from,
    iphoneHeader?.redirect_from,
    legacyPlatformRedirects(androidBasename, iphoneBasename)
  );
  if (!isEmpty(redirects)) mobile.redirect_from = redirects;

  stripRootFieldsFromPlatform(mobile.android);
  stripRootFieldsFromPlatform(mobile.iphone);
  delete mobile.appId;

  const ordered = pickOrdered(pruneEmpty(mobile), ROOT_FIELD_ORDER);
  if (mobile.android && Object.keys(mobile.android).length > 0) {
    ordered.android = pickOrdered(mobile.android, PLATFORM_FIELD_ORDER);
  }
  if (mobile.iphone && Object.keys(mobile.iphone).length > 0) {
    ordered.iphone = pickOrdered(mobile.iphone, PLATFORM_FIELD_ORDER);
  }
  return ordered;
}

function splitSinglePlatformHeader (header, platform) {
  const root = {};
  const platformBlock = {};

  for (const [key, value] of Object.entries(header || {})) {
    if (isEmpty(value)) continue;
    if (
      key === 'appId' ||
      PLATFORM_METADATA_FIELDS.includes(key) ||
      ANDROID_EXCLUSIVE_FIELDS.includes(key) ||
      IPHONE_EXCLUSIVE_FIELDS.includes(key)
    ) {
      platformBlock[key] = value;
    } else if (
      key === 'redirect_from' ||
      ROOT_SCALAR_PREFER_ANDROID.includes(key) ||
      COMBINED_ROOT_FIELDS.includes(key) ||
      MERGEABLE_COMMON_FIELDS.includes(key)
    ) {
      root[key] = value;
    } else {
      platformBlock[key] = value;
    }
  }

  const mobile = pickOrdered(root, ROOT_FIELD_ORDER);
  if (Object.keys(platformBlock).length > 0) {
    stripRootFieldsFromPlatform(platformBlock);
    mobile[platform] = pickOrdered(platformBlock, PLATFORM_FIELD_ORDER);
  }
  return mobile;
}

function mergeDualPlatformHeaders (androidHeader, iphoneHeader) {
  const root = {};
  const android = {};
  const iphone = {};
  const conflicts = [];

  const allKeys = new Set([
    ...Object.keys(androidHeader || {}),
    ...Object.keys(iphoneHeader || {}),
  ]);

  for (const key of allKeys) {
    const aVal = androidHeader?.[key];
    const iVal = iphoneHeader?.[key];

    if (ANDROID_EXCLUSIVE_FIELDS.includes(key)) {
      assignPlatformField(android, key, aVal);
      continue;
    }
    if (IPHONE_EXCLUSIVE_FIELDS.includes(key)) {
      assignPlatformField(iphone, key, iVal);
      continue;
    }
    if (key === 'appId' || PLATFORM_METADATA_FIELDS.includes(key)) {
      assignPlatformField(android, key, aVal);
      assignPlatformField(iphone, key, iVal);
      continue;
    }
    if (key === 'redirect_from') {
      continue;
    }
    if (ROOT_SCALAR_PREFER_ANDROID.includes(key)) {
      const chosen = pickScalarPreferAndroid(aVal, iVal);
      if (!isEmpty(chosen)) root[key] = chosen;
      continue;
    }
    if (COMBINED_ROOT_FIELDS.includes(key)) {
      const merged = combineListFields(aVal, iVal);
      if (!isEmpty(merged)) root[key] = merged;
      continue;
    }
    if (MERGEABLE_COMMON_FIELDS.includes(key)) {
      if (valuesEqual(aVal, iVal)) {
        const chosen = !isEmpty(aVal) ? aVal : iVal;
        if (!isEmpty(chosen)) root[key] = chosen;
      } else {
        if (!isEmpty(aVal)) android[key] = aVal;
        if (!isEmpty(iVal)) iphone[key] = iVal;
        conflicts.push(key);
      }
      continue;
    }

    // Unknown field: same merge rule as common
    if (valuesEqual(aVal, iVal)) {
      const chosen = !isEmpty(aVal) ? aVal : iVal;
      if (!isEmpty(chosen)) root[key] = chosen;
    } else {
      if (!isEmpty(aVal)) android[key] = aVal;
      if (!isEmpty(iVal)) iphone[key] = iVal;
      conflicts.push(key);
    }
  }

  stripRootFieldsFromPlatform(android);
  stripRootFieldsFromPlatform(iphone);

  const mobile = pickOrdered(pruneEmpty(root), ROOT_FIELD_ORDER);
  const androidOut = pickOrdered(pruneEmpty(android), PLATFORM_FIELD_ORDER);
  const iphoneOut = pickOrdered(pruneEmpty(iphone), PLATFORM_FIELD_ORDER);
  if (Object.keys(androidOut).length > 0) mobile.android = androidOut;
  if (Object.keys(iphoneOut).length > 0) mobile.iphone = iphoneOut;

  return { mobile, conflicts };
}

function buildMobileHeader (androidHeader, iphoneHeader) {
  if (androidHeader && iphoneHeader) {
    return mergeDualPlatformHeaders(androidHeader, iphoneHeader);
  }
  if (androidHeader) {
    return { mobile: splitSinglePlatformHeader(androidHeader, 'android'), conflicts: [] };
  }
  return { mobile: splitSinglePlatformHeader(iphoneHeader, 'iphone'), conflicts: [] };
}

function buildBody (androidBody, iphoneBody) {
  const a = (androidBody || '').trim();
  const i = (iphoneBody || '').trim();
  if (a && i) {
    return `## Android\n\n${a}\n\n---\n\n## iPhone\n\n${i}\n`;
  }
  if (a) return a + '\n';
  if (i) return i + '\n';
  return '\n';
}

async function listMdBasenames (dir) {
  const names = await fs.readdir(dir);
  return names.filter((n) => n.endsWith('.md'));
}

async function readWallet (filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  const { frontmatter, body } = splitFrontmatter(raw);
  const header = parseYamlFrontmatter(frontmatter);
  return { header, body };
}

async function wipeMobileDir (mobileDir) {
  await fs.rm(mobileDir, { recursive: true, force: true });
  await fs.mkdir(mobileDir, { recursive: true });
}

function indexByWsId (wallets) {
  /** @type {Map<string, string>} */
  const byWsId = new Map();
  for (const [basename, wallet] of wallets) {
    const wsId = wallet.header?.wsId;
    if (!wsId || byWsId.has(wsId)) continue;
    byWsId.set(wsId, basename);
  }
  return byWsId;
}

async function loadWallets (dir, basenames) {
  /** @type {Map<string, { header: object, body: string }>} */
  const wallets = new Map();
  await Promise.all(basenames.map(async (basename) => {
    const wallet = await readWallet(path.join(dir, basename));
    wallets.set(basename, wallet);
  }));
  return wallets;
}

async function writeMobileFile ({
  mobileDir,
  outputBasename,
  androidBasename,
  iphoneBasename,
  android,
  iphone,
  stats,
}) {
  if (
    (android && !android.header) ||
    (iphone && !iphone.header)
  ) {
    stats.parseErrors++;
    console.error(`Skipping ${outputBasename}: YAML frontmatter parse error`);
    return false;
  }

  const { mobile: rawMobile, conflicts } = buildMobileHeader(
    android?.header,
    iphone?.header
  );

  const mobile = finalizeMobileHeader(rawMobile, {
    androidBasename: android ? androidBasename : null,
    iphoneBasename: iphone ? iphoneBasename : null,
    androidHeader: android?.header,
    iphoneHeader: iphone?.header,
  });

  const body = buildBody(android?.body, iphone?.body);
  const outPath = path.join(mobileDir, outputBasename);
  await fs.writeFile(outPath, helper.getResult(mobile, body), 'utf8');

  stats.total++;
  if (android && iphone) {
    stats.both++;
    if (conflicts.length > 0) {
      stats.conflictPairs++;
      stats.conflictFields += conflicts.length;
    }
  } else if (android) {
    stats.androidOnly++;
  } else {
    stats.iphoneOnly++;
  }
  return true;
}

async function main () {
  const { root } = parseArgs(process.argv);
  const androidDir = path.join(root, '_android');
  const iphoneDir = path.join(root, '_iphone');
  const mobileDir = path.join(root, '_mobile');

  await wipeMobileDir(mobileDir);

  const [androidFiles, iphoneFiles] = await Promise.all([
    listMdBasenames(androidDir),
    listMdBasenames(iphoneDir),
  ]);

  const [androidWallets, iphoneWallets] = await Promise.all([
    loadWallets(androidDir, androidFiles),
    loadWallets(iphoneDir, iphoneFiles),
  ]);

  const androidByWsId = indexByWsId(androidWallets);
  const iphoneByWsId = indexByWsId(iphoneWallets);

  const processed = new Set();
  const stats = {
    total: 0,
    both: 0,
    bothByWsId: 0,
    bothByFilename: 0,
    androidOnly: 0,
    iphoneOnly: 0,
    parseErrors: 0,
    conflictPairs: 0,
    conflictFields: 0,
  };

  // Phase 1: pair by wsId (covers same or different filenames)
  const wsIds = [...new Set([...androidByWsId.keys(), ...iphoneByWsId.keys()])].sort();
  for (const wsId of wsIds) {
    const androidBasename = androidByWsId.get(wsId);
    const iphoneBasename = iphoneByWsId.get(wsId);
    if (!androidBasename || !iphoneBasename) continue;

    const outputBasename = androidBasename;
    const android = androidWallets.get(androidBasename);
    const iphone = iphoneWallets.get(iphoneBasename);

    const ok = await writeMobileFile({
      mobileDir,
      outputBasename,
      androidBasename,
      iphoneBasename,
      android,
      iphone,
      stats,
    });
    if (!ok) continue;

    processed.add(androidBasename);
    processed.add(iphoneBasename);
    stats.bothByWsId++;
    if (androidBasename === iphoneBasename) {
      stats.bothByFilename++;
    }
  }

  // Phase 2: remaining files without a wsId cross-platform pair
  const allBasenames = [...new Set([...androidFiles, ...iphoneFiles])].sort();
  for (const basename of allBasenames) {
    if (processed.has(basename)) continue;

    const android = androidWallets.has(basename)
      ? androidWallets.get(basename)
      : null;
    const iphone = iphoneWallets.has(basename)
      ? iphoneWallets.get(basename)
      : null;

    const ok = await writeMobileFile({
      mobileDir,
      outputBasename: basename,
      androidBasename: android ? basename : null,
      iphoneBasename: iphone ? basename : null,
      android,
      iphone,
      stats,
    });
    if (!ok) continue;

    processed.add(basename);
    if (android && iphone) stats.bothByFilename++;
  }

  console.log('Migrated wallet pages to _mobile/\n');
  console.log(`Total files written:     ${stats.total}`);
  console.log(`  Both platforms:        ${stats.both}`);
  console.log(`    matched by wsId:       ${stats.bothByWsId}`);
  console.log(`    same filename:         ${stats.bothByFilename}`);
  console.log(`  Android only:          ${stats.androidOnly}`);
  console.log(`  iPhone only:           ${stats.iphoneOnly}`);
  console.log(`  Pairs with conflicts:  ${stats.conflictPairs} (${stats.conflictFields} field(s) split to android/iphone)`);
  if (stats.parseErrors) {
    console.log(`  Parse errors skipped:  ${stats.parseErrors}`);
  }
  console.log('\nOriginal _android/ and _iphone/ were not modified.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
