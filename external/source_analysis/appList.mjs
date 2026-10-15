// Which wallets to analyse and where their source lives.
//
// The site renders api/appRepositories.json from the wallet
// records: one {appId, platform, repository} per record that has a repository
// and is not gone. This module fetches it, keeps the last good copy in SQLite
// so a run survives the site being unreachable, and groups the entries by
// repository so a repo shared by several records is cloned once.
import fs from 'fs';
import axios from 'axios';
import { APP_LIST_URL } from './config.mjs';
import { getAppList, saveAppList } from './ddbbUtils.mjs';

const PLATFORM_ORDER = ['android', 'iphone', 'desktop', 'hardware', 'bearer'];
// Path segments after owner/repo that are pages of the repository, not part of its name.
const PAGE_SEGMENTS = new Set(['releases', 'tags', 'tree', 'blob', 'commits', 'issues', 'wiki', '-']);

// Canonical https://host/owner/repo for the URL forms found in the wallet
// records (trailing slash, .git, /releases, /tags, /tree/..., www.), or null
// when the URL names no repository (user or organisation pages).
export function normalizeRepoUrl(url) {
  if (!url) return null;
  let parsed;
  try {
    parsed = new URL(String(url).trim());
  } catch {
    return null;
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;
  const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
  if (host === 'web.archive.org') return null; // a snapshot of a repository cannot be cloned
  const parts = parsed.pathname.split('/').filter(Boolean);
  if (host === 'github.com') {
    if (parts.length < 2 || parts[0] === 'orgs') return null;
    return `https://github.com/${parts[0]}/${parts[1].replace(/\.git$/, '')}`;
  }
  // GitLab and GitLab-like hosts allow subgroups: keep every segment up to the
  // first one that is a page of the repository.
  const cut = parts.findIndex(p => PAGE_SEGMENTS.has(p));
  const repoParts = cut === -1 ? parts : parts.slice(0, cut);
  if (repoParts.length < 2) return null;
  repoParts[repoParts.length - 1] = repoParts[repoParts.length - 1].replace(/\.git$/, '');
  return `https://${host}/${repoParts.join('/')}`;
}

function checkEntries(list) {
  if (!Array.isArray(list)) throw new Error('app list is not an array');
  for (const e of list) {
    if (!e || typeof e.appId !== 'string' || typeof e.platform !== 'string' || typeof e.repository !== 'string') {
      throw new Error(`malformed app list entry: ${JSON.stringify(e)}`);
    }
  }
  // Two wallet records can claim the same store listing (an app and its
  // rewrite); the cache is keyed on (appId, platform), so keep the first.
  const seen = new Set();
  return list
    .filter(e => {
      const key = `${e.platform}\n${e.appId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map(e => ({ appId: e.appId, platform: e.platform, repository: e.repository }));
}

// Read the list from a URL or a local file (handy before the site publishes it).
export async function fetchAppList(source = APP_LIST_URL, { get = (u) => axios.get(u, { timeout: 30000 }) } = {}) {
  if (/^https?:\/\//.test(source)) {
    const response = await get(source);
    return checkEntries(response.data);
  }
  return checkEntries(JSON.parse(fs.readFileSync(source, 'utf8')));
}

// Fresh list when the source is reachable (and cache it), otherwise the last
// cached copy. Throws when neither exists.
export async function loadAppList(db, { source = APP_LIST_URL, get } = {}) {
  try {
    const entries = await fetchAppList(source, get ? { get } : {});
    saveAppList(db, entries);
    return { entries, source: 'site' };
  } catch (error) {
    const entries = getAppList(db);
    if (!entries.length) throw new Error(`cannot load the app list from ${source} and no cached copy: ${error.message}`);
    return { entries, source: 'cache', error: error.message };
  }
}

const platformRank = (p) => {
  const i = PLATFORM_ORDER.indexOf(p);
  return i === -1 ? PLATFORM_ORDER.length : i;
};

// One job per distinct repository. `appId` is the first record (android before
// iphone before desktop ...) and `aliases` are all (appId, platform) records
// that point at the repository. Entries whose URL names no repository land in
// `skipped`.
export function groupByRepository(entries) {
  const byRepo = new Map();
  const skipped = [];
  for (const e of entries) {
    const repoUrl = normalizeRepoUrl(e.repository);
    if (!repoUrl) {
      skipped.push(e);
      continue;
    }
    if (!byRepo.has(repoUrl)) byRepo.set(repoUrl, { repoUrl, aliases: [] });
    byRepo.get(repoUrl).aliases.push({ appId: e.appId, platform: e.platform });
  }
  const jobs = [];
  for (const job of byRepo.values()) {
    job.aliases.sort((a, b) => platformRank(a.platform) - platformRank(b.platform) || a.appId.localeCompare(b.appId));
    jobs.push({ appId: job.aliases[0].appId, repoUrl: job.repoUrl, aliases: job.aliases });
  }
  jobs.sort((a, b) => a.repoUrl.localeCompare(b.repoUrl));
  return { jobs, skipped };
}
