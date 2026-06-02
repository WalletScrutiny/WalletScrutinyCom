import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import helper from './helper.mjs';

export const MOBILE_DIR = '_mobile';

const ROOT_FIELD_ORDER = [
  'wsId',
  'title',
  'altTitle',
  'bitcoinOrgId',
  'date',
  'authors',
  'website',
  'bugbounty',
  'twitter',
  'social',
  'features',
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
  'developerName',
  'repository',
  'bugbounty',
  'bitcoinOrgId',
  'wsId',
];

function isEmpty (value) {
  if (value == null) return true;
  if (value instanceof Date) return false;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) {
    return true;
  }
  return false;
}

function parseAsDate (value) {
  if (value == null) return null;
  if (value instanceof Date && !isNaN(value.getTime())) return value;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

export function toStoreDateString (value) {
  const d = parseAsDate(value);
  if (!d) {
    return value == null ? '' : String(value).trim();
  }
  return d.toISOString().slice(0, 10);
}

/**
 * Flatten per-store fields for JSON/search: oldest released, newest updated,
 * version from preferPlatform then android then iphone.
 */
export function summarizeMobileStoreFields (android = {}, iphone = {}, { preferPlatform } = {}) {
  const releasedDates = [android.released, iphone.released]
    .map(parseAsDate)
    .filter(Boolean);
  const updatedDates = [android.updated, iphone.updated]
    .map(parseAsDate)
    .filter(Boolean);

  const released = releasedDates.length
    ? toStoreDateString(new Date(Math.min(...releasedDates.map((d) => d.getTime()))))
    : '';
  const updated = updatedDates.length
    ? toStoreDateString(new Date(Math.max(...updatedDates.map((d) => d.getTime()))))
    : '';

  const version =
    (preferPlatform === 'iphone' ? iphone.version : null) ||
    android.version ||
    iphone.version ||
    '';

  return { released, updated, version };
}

/** Platform `meta` (default ok when block exists). */
export function platformMeta (block) {
  if (!block || typeof block !== 'object') return 'ok';
  return isEmpty(block.meta) ? 'ok' : block.meta;
}

/**
 * Listings: meta of the store row (storePlatform). Global obsolete only when both platforms are obsolete.
 */
export function combineMobileMeta (android = {}, iphone = {}) {
  const hasAndroid = Boolean(android?.appId);
  const hasIphone = Boolean(iphone?.appId || iphone?.idd);
  const am = hasAndroid ? platformMeta(android) : null;
  const im = hasIphone ? platformMeta(iphone) : null;
  if (am === 'obsolete' && im === 'obsolete') return 'obsolete';
  if (!hasAndroid) return im || 'ok';
  if (!hasIphone) return am || 'ok';
  return am || 'ok';
}

export function listingMetaForMobile (mobile, storePlatform) {
  if (storePlatform === 'iphone') {
    return platformMeta(mobile.iphone);
  }
  return platformMeta(mobile.android);
}

/** Platform `verdict` (empty when block missing or no value). */
export function platformVerdict (block) {
  if (!block || typeof block !== 'object') return '';
  return isEmpty(block.verdict) ? '' : block.verdict;
}

/** Move root `verdict` into platform blocks; keep verdict only under android:/iphone:. */
export function stripRootRepository (mobile) {
  delete mobile.repository;
}

export function stripRootVerdict (mobile) {
  const rootVerdict = mobile.verdict;
  if (!isEmpty(rootVerdict)) {
    for (const platform of ['android', 'iphone']) {
      const block = mobile[platform];
      if (!block || typeof block !== 'object') continue;
      if (isEmpty(block.verdict)) {
        block.verdict = rootVerdict;
      }
    }
  }
  delete mobile.verdict;
}

/** Move root `meta` into platform blocks; keep meta only under android:/iphone:. */
export function stripRootMeta (mobile) {
  const rootMeta = mobile.meta;
  if (!isEmpty(rootMeta)) {
    for (const platform of ['android', 'iphone']) {
      const block = mobile[platform];
      if (!block || typeof block !== 'object') continue;
      if (isEmpty(block.meta)) {
        block.meta = rootMeta;
      }
    }
  }
  delete mobile.meta;
}

/** Keep `developerName` under android:/iphone: only; copy root value into empty platform fields. */
export function demoteRootDeveloperName (mobile) {
  const rootName = mobile.developerName;
  if (isEmpty(rootName)) {
    delete mobile.developerName;
    return;
  }
  for (const platform of ['android', 'iphone']) {
    const block = mobile[platform];
    if (!block || typeof block !== 'object') continue;
    if (isEmpty(block.developerName)) {
      block.developerName = rootName;
    }
  }
  delete mobile.developerName;
}

/** Keep `website` at root only; prefer Android when hoisting from platform blocks. */
export function stripPlatformWebsite (mobile) {
  if (isEmpty(mobile.website)) {
    const androidSite = mobile.android?.website;
    const iphoneSite = mobile.iphone?.website;
    if (!isEmpty(androidSite)) {
      mobile.website = androidSite;
    } else if (!isEmpty(iphoneSite)) {
      mobile.website = iphoneSite;
    }
  }
  for (const platform of ['android', 'iphone']) {
    const block = mobile[platform];
    if (!block || typeof block !== 'object') continue;
    delete block.website;
  }
}

/** Keep `twitter` at root only; prefer Android when hoisting from platform blocks. */
export function stripPlatformTwitter (mobile) {
  if (isEmpty(mobile.twitter)) {
    const androidTw = mobile.android?.twitter;
    const iphoneTw = mobile.iphone?.twitter;
    if (!isEmpty(androidTw)) {
      mobile.twitter = androidTw;
    } else if (!isEmpty(iphoneTw)) {
      mobile.twitter = iphoneTw;
    }
  }
  for (const platform of ['android', 'iphone']) {
    const block = mobile[platform];
    if (!block || typeof block !== 'object') continue;
    delete block.twitter;
  }
}

/** Keep `title` at root only; hoist from platform blocks if root is empty. */
export function stripPlatformTitle (mobile) {
  for (const platform of ['android', 'iphone']) {
    const block = mobile[platform];
    if (!block || typeof block !== 'object') continue;
    if (!isEmpty(block.title) && isEmpty(mobile.title)) {
      mobile.title = block.title;
    }
    delete block.title;
  }
}

/** Move platform `date` fields to root; when both differ, keep the oldest. */
export function hoistMobileDate (mobile) {
  const candidates = [];
  const rootDate = parseAsDate(mobile.date);
  if (rootDate) candidates.push(rootDate);

  for (const platform of ['android', 'iphone']) {
    const block = mobile[platform];
    if (!block || block.date == null) continue;
    const d = parseAsDate(block.date);
    if (d) candidates.push(d);
    delete block.date;
  }

  if (candidates.length === 0) return;
  mobile.date = new Date(Math.min(...candidates.map((d) => d.getTime())));
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

function pruneEmpty (obj) {
  const out = {};
  for (const [key, value] of Object.entries(obj)) {
    if (isEmpty(value)) continue;
    out[key] = value;
  }
  return out;
}

export function orderMobileHeader (mobile) {
  stripPlatformTitle(mobile);
  stripPlatformWebsite(mobile);
  stripPlatformTwitter(mobile);
  stripRootMeta(mobile);
  stripRootVerdict(mobile);
  stripRootRepository(mobile);
  demoteRootDeveloperName(mobile);
  hoistMobileDate(mobile);
  const pruned = pruneEmpty(mobile);
  const ordered = pickOrdered(pruned, ROOT_FIELD_ORDER);
  if (pruned.android && Object.keys(pruned.android).length > 0) {
    ordered.android = pickOrdered(pruned.android, PLATFORM_FIELD_ORDER);
  }
  if (pruned.iphone && Object.keys(pruned.iphone).length > 0) {
    ordered.iphone = pickOrdered(pruned.iphone, PLATFORM_FIELD_ORDER);
  }
  return ordered;
}

export function splitFrontmatter (content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!m) {
    return { mobile: null, body: content };
  }
  let mobile;
  try {
    mobile = yaml.load(m[1]) || {};
  } catch {
    mobile = null;
  }
  const body = content.slice(m[0].length).replace(/^\s*/, '');
  return { mobile, body };
}

export function loadMobileFromFile (filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const { mobile, body } = splitFrontmatter(raw);
  return {
    mobile: mobile || {},
    body: body || '',
    slug: path.basename(filePath, '.md'),
    filePath,
  };
}

export function writeMobileFile (filePath, mobile, body) {
  if (mobile.title == null) {
    return;
  }
  const ordered = orderMobileHeader(mobile);
  fs.writeFileSync(filePath, helper.getResult(ordered, body || ''), 'utf8');
}

export function mobileDefunctKey (slug) {
  return `_mobile/${slug}`;
}

export function ensurePlatformBlock (mobile, platform) {
  if (!mobile[platform]) {
    mobile[platform] = {};
  }
  return mobile[platform];
}

/** Platform `meta` and `updated`; root `date` only. */
export function metaUpdateContext (mobile, platform) {
  const block = ensurePlatformBlock(mobile, platform);
  return {
    get meta () { return block.meta; },
    set meta (v) { block.meta = v; },
    get updated () { return block.updated; },
    set updated (v) { block.updated = v; },
    get date () { return mobile.date; },
    set date (v) {
      const next = parseAsDate(v);
      if (!next) return;
      const current = parseAsDate(mobile.date);
      if (!current || next.getTime() < current.getTime()) {
        mobile.date = next;
      } else {
        mobile.date = current;
      }
    },
  };
}

export async function resolveAndroidFilenames (androidAppIds) {
  const dir = MOBILE_DIR;
  const all = (await fs.promises.readdir(dir)).filter((f) => f.endsWith('.md'));
  const withAndroid = [];
  for (const file of all) {
    const { mobile } = loadMobileFromFile(path.join(dir, file));
    if (mobile.android?.appId) {
      withAndroid.push(file);
    }
  }
  if (!androidAppIds || androidAppIds.length === 0) {
    return withAndroid;
  }
  const wanted = new Set();
  for (const id of androidAppIds) {
    wanted.add(id);
    wanted.add(id.replace(/\.md$/i, ''));
  }
  return withAndroid.filter((file) => {
    const { mobile, slug } = loadMobileFromFile(path.join(dir, file));
    return wanted.has(mobile.android.appId) || wanted.has(slug) || wanted.has(`${slug}.md`);
  });
}

export async function resolveIphoneFilenames (iphoneAppIds) {
  const dir = MOBILE_DIR;
  const all = (await fs.promises.readdir(dir)).filter((f) => f.endsWith('.md'));
  const withIphone = [];
  for (const file of all) {
    const { mobile } = loadMobileFromFile(path.join(dir, file));
    if (mobile.iphone?.appId || mobile.iphone?.idd) {
      withIphone.push(file);
    }
  }
  if (!iphoneAppIds || iphoneAppIds.length === 0) {
    return withIphone;
  }
  const wanted = new Set();
  for (const id of iphoneAppIds) {
    wanted.add(id);
    wanted.add(id.replace(/\.md$/i, ''));
  }
  return withIphone.filter((file) => {
    const { mobile, slug } = loadMobileFromFile(path.join(dir, file));
    const iphone = mobile.iphone || {};
    return wanted.has(iphone.appId) ||
      wanted.has(String(iphone.idd || '')) ||
      wanted.has(slug) ||
      wanted.has(`${slug}.md`);
  });
}

export async function findMobileFileByAndroidAppId (appId) {
  const files = await resolveAndroidFilenames([appId]);
  return files[0] || null;
}

export async function findMobileFileByIphoneAppId (appId) {
  const files = await resolveIphoneFilenames([appId]);
  return files[0] || null;
}

/** Root `date` only (never android:/iphone:). */
export function getMobileDate (mobile) {
  return parseAsDate(mobile?.date);
}

export function flattenMobileForPlatform (mobile, platform) {
  const block = mobile[platform] || {};
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
    users: block.users,
    icon: block.icon,
    appCountry: block.appCountry ?? mobile.appCountry,
    title: mobile.title,
    website: mobile.website,
    twitter: mobile.twitter,
    date: mobile.date,
    meta: platformMeta(block),
    verdict: platformVerdict(block),
  };
}
