#!/usr/bin/env node

/**
 * syncBitcoinOrgId.mjs
 *
 * Syncs the bitcoinOrgId frontmatter field from bitcoin-dot-org/Bitcoin.org _wallets
 * into WalletScrutiny wallet .md files under active collections.
 *
 * Some IDs are listed in HARDCODED_ASSIGNMENTS (exact paths only, no fuzzy match).
 *
 * Usage:
 *   node scripts/syncBitcoinOrgId.mjs [--dry-run] [--concurrency N]
 *
 * TSV columns: action, file, appId, bitcoinOrgId, matchRule, detail
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import pLimit from 'p-limit';
import { extractRepoPath } from './github_common.mjs';

const fsp = fs.promises;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

const BITCOIN_ORG_API =
  'https://api.github.com/repos/bitcoin-dot-org/Bitcoin.org/contents/_wallets?ref=master';
const USER_AGENT = 'walletscrutiny-bitcoinorg-sync/1.0 (+https://walletscrutiny.com)';

const WALLET_DIRS = ['_mobile', '_desktop', '_hardware', '_bearer', '_others'];

/** WalletScrutiny collection folder -> platform key used for matching. */
const COLLECTION_PLATFORM = {
  _mobile: 'mobile',
  _desktop: 'desktop',
  _hardware: 'hardware',
  _bearer: 'hardware',
  _others: 'others'
};

const YAML_OPTS = { schema: yaml.FAILSAFE_SCHEMA };

/** Titles too generic for title-only matching (many unrelated wallets share them). */
const GENERIC_TITLES = new Set([
  'bitcoin wallet',
  'bitcoin',
  'wallet'
]);

/**
 * bitcoinOrgId -> exact wallet .md paths (repo-relative).
 * Fuzzy matching is skipped for these IDs; only listed files get the field.
 *
 * bitcoinwallet: Bitcoin.org "Bitcoin Wallet" (Schildbach / de.schildbach.wallet).
 * Not Bitcoin Core (_desktop/bitcoincore.md uses bitcoinOrgId: bitcoincore).
 *
 * jadeclassic / jadeplus: Bitcoin.org replaced the single "jade" listing with
 * Jade Classic, Jade Plus, and Jade Core (PR bitcoin-dot-org/Bitcoin.org#4728).
 * All three share the same GitHub repo and product site, so fuzzy matching
 * cannot pick a unique target. Jade DIY is not listed on bitcoin.org.
 * jadecore has no WalletScrutiny page yet.
 */
const HARDCODED_ASSIGNMENTS = {
  bitcoinwallet: ['_mobile/de.schildbach.wallet.md'],
  jadeclassic: ['_hardware/blockstreamjade.md'],
  jadeplus: ['_hardware/blockstreamjadeplus.md']
};

const HARDCODED_ONLY_IDS = new Set(Object.keys(HARDCODED_ASSIGNMENTS));

function parseArgs(argv) {
  let concurrency = 8;
  let dryRun = false;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--concurrency' && argv[i + 1]) {
      concurrency = Math.max(1, parseInt(argv[++i], 10) || 8);
    } else if (argv[i] === '--dry-run') {
      dryRun = true;
    }
  }
  return { concurrency, dryRun };
}

function rel(p) {
  return path.relative(REPO_ROOT, p);
}

function slugNorm(s) {
  if (s == null || s === '') return '';
  return String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
}

function normTitle(s) {
  if (s == null) return '';
  return String(s).trim().toLowerCase();
}

function tryExtractRepo(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    return extractRepoPath(url).toLowerCase();
  } catch {
    return null;
  }
}

function normWebsite(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\./, '').toLowerCase();
    const p = u.pathname.replace(/\/+$/, '').toLowerCase();
    return p && p !== '/' ? `${host}${p}` : host;
  } catch {
    return null;
  }
}

function splitLeadingFrontmatter(content) {
  const m = content.match(/^(---\r?\n)([\s\S]*?)(\r?\n---)/);
  if (!m) return null;
  const body = content.slice(m[0].length);
  return { open: m[1], rawFm: m[2], close: m[3], body };
}

function parseFrontmatter(content) {
  const parts = splitLeadingFrontmatter(content);
  if (!parts) return null;
  try {
    return yaml.load(parts.rawFm, YAML_OPTS);
  } catch {
    return null;
  }
}

function readFmField(fm, key) {
  const v = fm?.[key];
  if (v == null) return null;
  if (typeof v === 'string') return v.trim() || null;
  return String(v).trim() || null;
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: {
      'user-agent': USER_AGENT,
      accept: 'application/vnd.github+json'
    }
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'user-agent': USER_AGENT, accept: 'text/plain' }
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return res.text();
}

function extractFrontmatterText(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : '';
}

/**
 * Parse bitcoin.org platform blocks (hardware / mobile / desktop) and compat line.
 */
function parseBitcoinOrgPlatforms(fmText) {
  const platforms = new Set();

  for (const m of fmText.matchAll(/^\s*-\s+(hardware|mobile|desktop):/gm)) {
    platforms.add(m[1]);
  }

  const compatM = fmText.match(/^\s*compat:\s*["']?([^"'\n]+)["']?/m);
  if (compatM) {
    for (const token of compatM[1].toLowerCase().split(/\s+/)) {
      if (token === 'hardware') platforms.add('hardware');
      if (token === 'mobile') platforms.add('mobile');
      if (token === 'android') platforms.add('android');
      if (token === 'ios') platforms.add('ios');
      if (['desktop', 'windows', 'mac', 'linux'].includes(token)) platforms.add('desktop');
    }
  }

  if (platforms.has('mobile')) {
    if (/^\s*-\s*name:\s*android\s*$/m.test(fmText)) platforms.add('android');
    if (/^\s*-\s*name:\s*ios\s*$/m.test(fmText)) platforms.add('ios');
  }

  return platforms;
}

/**
 * Which WalletScrutiny collections may receive this bitcoin.org entry.
 */
function deriveAllowedLocalPlatforms(boPlatforms, bo) {
  const hasAndroid =
    boPlatforms.has('android') || (boPlatforms.has('mobile') && bo.packages.size > 0);
  const hasIos = boPlatforms.has('ios') || (boPlatforms.has('mobile') && bo.idds.size > 0);
  const hasDesktop = boPlatforms.has('desktop');
  const hasHardware = boPlatforms.has('hardware');

  if (hasHardware && !hasAndroid && !hasIos && !hasDesktop) {
    return { allowed: new Set(['hardware', 'bearer']), hardwareOnly: true };
  }

  const allowed = new Set();
  if (hasAndroid) allowed.add('android');
  if (hasIos) allowed.add('ios');
  if (hasDesktop) allowed.add('desktop');
  if (hasHardware) allowed.add('hardware');

  return { allowed, hardwareOnly: false };
}

function platformCompatible(local, bo) {
  return bo.allowedLocalPlatforms.has(local.platform);
}

function parseBitcoinOrgWallet(bitcoinOrgId, content) {
  const fmText = extractFrontmatterText(content);
  const packages = new Set();
  const idds = new Set();
  const repos = new Set();
  const websites = new Set();

  for (const m of fmText.matchAll(/play\.google\.com\/store\/apps\/details\?[^"\s]*id=([a-zA-Z0-9._]+)/g)) {
    packages.add(m[1]);
  }
  for (const m of fmText.matchAll(/f-droid\.org\/packages\/([a-zA-Z0-9._]+)/g)) {
    packages.add(m[1]);
  }
  for (const m of fmText.matchAll(/apps\.apple\.com\/[^"\s]*\/id(\d+)/g)) {
    idds.add(m[1]);
  }
  for (const m of fmText.matchAll(/^\s*source:\s*["']?(https:\/\/github\.com\/[^"'\s]+)["']?/gim)) {
    const repo = tryExtractRepo(m[1]);
    if (repo) repos.add(repo);
  }
  for (const m of fmText.matchAll(/^\s*link:\s*["']?(https?:\/\/[^"'\s]+)["']?/gim)) {
    const w = normWebsite(m[1]);
    if (w) websites.add(w);
  }

  let title = null;
  const titleM = fmText.match(/^\s*title:\s*["']?([^"'\n]+?)["']?\s*$/m);
  if (titleM) title = titleM[1].trim();

  let idField = bitcoinOrgId;
  const idM = fmText.match(/^\s*id:\s*(\S+)\s*$/m);
  if (idM) idField = idM[1].trim();

  const slugs = new Set([slugNorm(bitcoinOrgId), slugNorm(idField)].filter(Boolean));

  const boPlatforms = parseBitcoinOrgPlatforms(fmText);
  const { allowed: allowedLocalPlatforms, hardwareOnly } = deriveAllowedLocalPlatforms(
    boPlatforms,
    { packages, idds, repos, websites, title, slugs }
  );

  return {
    bitcoinOrgId,
    packages,
    idds,
    repos,
    websites,
    title,
    slugs,
    boPlatforms,
    allowedLocalPlatforms,
    hardwareOnly
  };
}

async function fetchBitcoinOrgCatalog(concurrency) {
  const entries = await fetchJson(BITCOIN_ORG_API);
  const mdEntries = entries.filter((e) => e.type === 'file' && e.name.endsWith('.md'));
  const limit = pLimit(concurrency);
  const wallets = await Promise.all(
    mdEntries.map((e) =>
      limit(async () => {
        const bitcoinOrgId = e.name.replace(/\.md$/, '');
        const url = e.download_url;
        const content = await fetchText(url);
        return parseBitcoinOrgWallet(bitcoinOrgId, content);
      })
    )
  );
  const validIds = new Set(wallets.map((w) => w.bitcoinOrgId));
  return { wallets, validIds };
}

async function* walkMarkdownFiles(dir) {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      yield* walkMarkdownFiles(full);
    } else if (ent.isFile() && ent.name.endsWith('.md')) {
      yield full;
    }
  }
}

async function collectLocalWallets() {
  const locals = [];
  for (const dirName of WALLET_DIRS) {
    const base = path.join(REPO_ROOT, dirName);
    try {
      await fsp.access(base);
    } catch {
      continue;
    }
    for await (const filePath of walkMarkdownFiles(base)) {
      let content;
      try {
        content = await fsp.readFile(filePath, 'utf8');
      } catch {
        continue;
      }
      const fm = parseFrontmatter(content);
      if (!fm) continue;

      const stem = path.basename(filePath, '.md');
      const repository = tryExtractRepo(readFmField(fm, 'repository'));
      const website = normWebsite(readFmField(fm, 'website'));
      const title = readFmField(fm, 'title');
      const existingBitcoinOrgId = readFmField(fm, 'bitcoinOrgId');

      if (dirName === '_mobile') {
        const android = fm.android || {};
        const iphone = fm.iphone || {};
        const base = {
          filePath,
          relPath: rel(filePath),
          collection: dirName,
          repository,
          website,
          title: normTitle(title),
          titleRaw: title,
          existingBitcoinOrgId,
          content
        };
        if (android.appId) {
          locals.push({
            ...base,
            platform: 'android',
            appId: String(android.appId).trim(),
            idd: null,
            slugNorm: slugNorm(android.appId)
          });
        }
        if (iphone.idd || iphone.appId) {
          locals.push({
            ...base,
            platform: 'ios',
            appId: String(iphone.appId || stem).trim(),
            idd: iphone.idd != null ? String(iphone.idd).trim() : null,
            slugNorm: slugNorm(iphone.appId || stem)
          });
        }
        if (!android.appId && !iphone.idd && !iphone.appId) {
          locals.push({
            ...base,
            platform: 'android',
            appId: stem,
            idd: null,
            slugNorm: slugNorm(stem)
          });
        }
        continue;
      }

      const appId = readFmField(fm, 'appId') || stem;
      const idd = readFmField(fm, 'idd');

      locals.push({
        filePath,
        relPath: rel(filePath),
        collection: dirName,
        platform: COLLECTION_PLATFORM[dirName] ?? 'others',
        appId,
        idd,
        repository,
        website,
        title: normTitle(title),
        titleRaw: title,
        slugNorm: slugNorm(appId),
        existingBitcoinOrgId,
        content
      });
    }
  }
  return locals;
}

const MATCH_SCORE = {
  package: 100,
  idd: 95,
  title: 90,
  slug: 80,
  titleWord: 85,
  repoTitle: 70,
  repo: 50,
  website: 30
};

function buildUniqueSet(boWallets, keyFn) {
  const counts = new Map();
  for (const bo of boWallets) {
    for (const key of keyFn(bo)) {
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }
  const unique = new Set();
  for (const [key, n] of counts) {
    if (n === 1) unique.add(key);
  }
  return unique;
}

function buildUniqueRepos(boWallets) {
  return buildUniqueSet(boWallets, (bo) => bo.repos);
}

function buildUniqueWebsites(boWallets) {
  return buildUniqueSet(boWallets, (bo) => bo.websites);
}

function isGenericTitle(title) {
  const t = normTitle(title);
  return GENERIC_TITLES.has(t);
}

function hasStoreIds(bo) {
  return bo.packages.size > 0 || bo.idds.size > 0;
}

function matchLocalToBitcoinOrg(local, bo, uniqueRepos, uniqueWebsites) {
  if (HARDCODED_ONLY_IDS.has(bo.bitcoinOrgId)) {
    return null;
  }
  if (!platformCompatible(local, bo)) {
    return null;
  }
  if (bo.packages.has(local.appId)) {
    return { rule: 'package', score: MATCH_SCORE.package };
  }
  if (local.idd && bo.idds.has(local.idd)) {
    return { rule: 'idd', score: MATCH_SCORE.idd };
  }

  const genericBoTitle = isGenericTitle(bo.title);
  if (hasStoreIds(bo) && genericBoTitle) {
    return null;
  }

  if (
    !genericBoTitle &&
    local.title &&
    bo.title &&
    local.title === normTitle(bo.title)
  ) {
    return { rule: 'title', score: MATCH_SCORE.title };
  }
  const titleWord = titleWordScore(local.titleRaw, bo.title);
  if (bo.packages.size === 0 && bo.idds.size === 0 && titleWord > 0) {
    return { rule: 'titleWord', score: MATCH_SCORE.titleWord };
  }
  if (local.slugNorm && bo.slugs.has(local.slugNorm)) {
    return { rule: 'slug', score: MATCH_SCORE.slug };
  }
  if (local.repository && bo.repos.has(local.repository) && titleWord > 0) {
    return { rule: 'repoTitle', score: MATCH_SCORE.repoTitle };
  }
  if (local.repository && bo.repos.has(local.repository) && uniqueRepos.has(local.repository)) {
    return { rule: 'repo', score: MATCH_SCORE.repo };
  }
  if (
    !bo.hardwareOnly &&
    local.website &&
    bo.websites.has(local.website) &&
    uniqueWebsites.has(local.website)
  ) {
    return { rule: 'website', score: MATCH_SCORE.website };
  }
  return null;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function titleWordScore(localTitle, boTitle) {
  const lt = normTitle(localTitle);
  const bt = normTitle(boTitle);
  if (!lt || !bt || isGenericTitle(boTitle)) return 0;
  if (lt === bt) return 1000;
  if (lt.startsWith(`${bt} `)) return bt.length;
  const re = new RegExp(`\\b${escapeRegex(bt)}\\b`);
  if (re.test(lt)) return bt.length;
  return 0;
}

function slugExactScore(localAppId, bitcoinOrgId) {
  const l = slugNorm(localAppId);
  const b = slugNorm(bitcoinOrgId);
  if (!l || !b) return 0;
  return l === b ? b.length : 0;
}

function tieBreakScore(local, bo) {
  return Math.max(
    titleWordScore(local.titleRaw, bo.title),
    slugExactScore(local.appId, bo.bitcoinOrgId)
  );
}

/**
 * Pick the best bitcoin.org entry per local file. Higher score wins; ties on
 * different bitcoinOrgIds use title-prefix specificity, else conflict.
 */
function assignBitcoinOrgIds(locals, boWallets) {
  const targetBitcoinOrgId = new Map();
  const conflicts = [];
  const uniqueRepos = buildUniqueRepos(boWallets);
  const uniqueWebsites = buildUniqueWebsites(boWallets);

  for (const local of locals) {
    const candidates = [];

    for (const bo of boWallets) {
      const match = matchLocalToBitcoinOrg(local, bo, uniqueRepos, uniqueWebsites);
      if (!match) continue;
      candidates.push({ bo, match });
    }

    if (candidates.length === 0) continue;

    const maxScore = Math.max(...candidates.map((c) => c.match.score));
    const top = candidates.filter((c) => c.match.score === maxScore);

    let winner = top[0];
    if (top.length > 1) {
      const withPrefix = top
        .map((c) => ({
          ...c,
          prefixScore: tieBreakScore(local, c.bo)
        }))
        .filter((c) => c.prefixScore > 0)
        .sort((a, b) => b.prefixScore - a.prefixScore);

      if (withPrefix.length === 1) {
        winner = withPrefix[0];
      } else if (withPrefix.length > 1) {
        const bestPrefix = withPrefix[0].prefixScore;
        const tiedPrefix = withPrefix.filter((c) => c.prefixScore === bestPrefix);
        if (tiedPrefix.length === 1) {
          winner = tiedPrefix[0];
        } else {
          conflicts.push({
            bitcoinOrgId: tiedPrefix.map((c) => c.bo.bitcoinOrgId).join(' vs '),
            candidateCount: tiedPrefix.length,
            files: local.relPath
          });
          continue;
        }
      } else {
        conflicts.push({
          bitcoinOrgId: top.map((c) => c.bo.bitcoinOrgId).join(' vs '),
          candidateCount: top.length,
          files: local.relPath
        });
        continue;
      }
    }

    targetBitcoinOrgId.set(local.filePath, {
      bitcoinOrgId: winner.bo.bitcoinOrgId,
      matchRule: winner.match.rule
    });
  }

  return { targetBitcoinOrgId, conflicts };
}

function applyHardcodedAssignments(locals, targetBitcoinOrgId) {
  const relToPath = new Map(locals.map((l) => [l.relPath, l.filePath]));

  for (const [bitcoinOrgId, relPaths] of Object.entries(HARDCODED_ASSIGNMENTS)) {
    for (const relPath of relPaths) {
      const filePath = relToPath.get(relPath);
      if (!filePath) {
        console.error(`Warning: hardcoded path not found: ${relPath} (${bitcoinOrgId})`);
        continue;
      }
      targetBitcoinOrgId.set(filePath, { bitcoinOrgId, matchRule: 'hardcoded' });
    }
  }

  const allowedPaths = new Set();
  for (const relPaths of Object.values(HARDCODED_ASSIGNMENTS)) {
    for (const relPath of relPaths) {
      const fp = relToPath.get(relPath);
      if (fp) allowedPaths.add(fp);
    }
  }

  for (const [filePath, entry] of targetBitcoinOrgId) {
    if (HARDCODED_ONLY_IDS.has(entry.bitcoinOrgId) && !allowedPaths.has(filePath)) {
      targetBitcoinOrgId.delete(filePath);
    }
  }

  return targetBitcoinOrgId;
}

function getBitcoinOrgIdFromRaw(rawFm) {
  const m = rawFm.match(/^bitcoinOrgId:\s*(.+)\s*$/m);
  if (!m) return null;
  return m[1].trim().replace(/^["']|["']$/g, '');
}

function setBitcoinOrgIdInRaw(rawFm, bitcoinOrgId) {
  const line = `bitcoinOrgId: ${bitcoinOrgId}`;
  if (/^bitcoinOrgId:/m.test(rawFm)) {
    const next = rawFm.replace(/^bitcoinOrgId:\s*.+$/m, line);
    return { rawFm: next, changed: next !== rawFm };
  }

  const appIdM = rawFm.match(/^(appId:.*\n)/m);
  if (appIdM) {
    return { rawFm: rawFm.replace(appIdM[0], `${appIdM[0]}${line}\n`), changed: true };
  }

  const titleM = rawFm.match(/^(title:.*\n)/m);
  if (titleM) {
    return { rawFm: rawFm.replace(titleM[0], `${titleM[0]}${line}\n`), changed: true };
  }

  return { rawFm: `${rawFm.trimEnd()}\n${line}\n`, changed: true };
}

function removeBitcoinOrgIdFromRaw(rawFm) {
  const lines = rawFm.split('\n');
  const out = [];
  let changed = false;
  for (const line of lines) {
    if (/^bitcoinOrgId:/.test(line)) {
      changed = true;
      continue;
    }
    out.push(line);
  }
  return { rawFm: out.join('\n'), changed };
}

function applyBitcoinOrgId(filePath, bitcoinOrgId, dryRun) {
  const content = fs.readFileSync(filePath, 'utf8');
  const parts = splitLeadingFrontmatter(content);
  if (!parts) return { action: 'skip', detail: 'no_frontmatter' };

  const current = getBitcoinOrgIdFromRaw(parts.rawFm);
  if (current === bitcoinOrgId) {
    return { action: 'skip', detail: 'already_set' };
  }

  const { rawFm: nextFm, changed } = setBitcoinOrgIdInRaw(parts.rawFm, bitcoinOrgId);
  if (!changed) return { action: 'skip', detail: 'unchanged' };

  const next = `${parts.open}${nextFm}${parts.close}${parts.body}`;
  if (!dryRun) fs.writeFileSync(filePath, next, 'utf8');
  return { action: current ? 'update' : 'add', detail: '' };
}

function applyRemoveBitcoinOrgId(filePath, dryRun) {
  const content = fs.readFileSync(filePath, 'utf8');
  const parts = splitLeadingFrontmatter(content);
  if (!parts) return { action: 'skip', detail: 'no_frontmatter' };

  if (!/^bitcoinOrgId:/m.test(parts.rawFm)) {
    return { action: 'skip', detail: 'not_present' };
  }

  const { rawFm: nextFm, changed } = removeBitcoinOrgIdFromRaw(parts.rawFm);
  if (!changed) return { action: 'skip', detail: 'unchanged' };

  const next = `${parts.open}${nextFm}${parts.close}${parts.body}`;
  if (!dryRun) fs.writeFileSync(filePath, next, 'utf8');
  return { action: 'remove', detail: '' };
}

async function main() {
  const { concurrency, dryRun } = parseArgs(process.argv.slice(2));

  console.error('Fetching bitcoin.org _wallets catalog...');
  const { wallets: boWallets, validIds } = await fetchBitcoinOrgCatalog(concurrency);
  console.error(`Found ${boWallets.length} bitcoin.org wallet entries`);

  console.error('Indexing local wallets...');
  const locals = await collectLocalWallets();
  console.error(`Indexed ${locals.length} local wallet files`);

  const { targetBitcoinOrgId, conflicts } = assignBitcoinOrgIds(locals, boWallets);
  applyHardcodedAssignments(locals, targetBitcoinOrgId);

  const rows = [];
  let conflictCount = conflicts.length;

  for (const [filePath, { bitcoinOrgId, matchRule }] of targetBitcoinOrgId) {
    const local = locals.find((l) => l.filePath === filePath);
    const result = applyBitcoinOrgId(filePath, bitcoinOrgId, dryRun);
    rows.push({
      action: result.action,
      file: rel(filePath),
      appId: local?.appId ?? '',
      bitcoinOrgId,
      matchRule,
      detail: result.detail
    });
  }

  for (const local of locals) {
    const target = targetBitcoinOrgId.get(local.filePath);
    const existing = local.existingBitcoinOrgId;

    if (!existing) continue;

    // Assigned (including renames like jade -> jadeclassic): first loop already
    // wrote the target id. Do not remove afterwards.
    if (target) continue;

    const result = applyRemoveBitcoinOrgId(local.filePath, dryRun);
    if (result.action === 'remove') {
      rows.push({
        action: dryRun ? 'would_remove' : 'remove',
        file: local.relPath,
        appId: local.appId,
        bitcoinOrgId: existing,
        matchRule: '',
        detail: !validIds.has(existing) ? 'id_removed_from_bitcoin_org' : 'no_longer_matches'
      });
    }
  }

  console.log('action\tfile\tappId\tbitcoinOrgId\tmatchRule\tdetail');
  for (const r of rows.sort((a, b) => a.file.localeCompare(b.file))) {
    if (r.action === 'skip' && r.detail === 'already_set') continue;
    console.log(
      [r.action, r.file, r.appId, r.bitcoinOrgId, r.matchRule, r.detail].join('\t')
    );
  }

  if (conflicts.length > 0) {
    console.error('\nConflicts (not written):');
    for (const c of conflicts) {
      console.error(`  ${c.bitcoinOrgId}: ${c.candidateCount} candidates — ${c.files}`);
      rows.push({
        action: 'conflict',
        file: c.files,
        appId: '',
        bitcoinOrgId: c.bitcoinOrgId,
        matchRule: '',
        detail: `${c.candidateCount} candidates`
      });
      conflictCount++;
    }
  }

  const adds = rows.filter((r) => r.action === 'add' || r.action === 'update').length;
  const removes = rows.filter((r) => r.action === 'remove' || r.action === 'would_remove').length;
  console.error(
    `\nDone${dryRun ? ' (dry-run)' : ''}: ${adds} add/update, ${removes} remove, ${conflictCount} conflicts`
  );

  if (conflictCount > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
