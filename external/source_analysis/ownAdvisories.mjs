// Advisories filed against the wallet itself (issue 1022).
//
// The dependency check (plugins/osv.mjs) looks up what a wallet ships, never
// the wallet's own code: Electrum 4.8.2 showed no sign of CVE-2026-117601,
// filed against Electrum itself. OSV.dev answers by the wallet's repository,
// the GIT ecosystem it already uses for native libraries, and without a
// version it lists every advisory of the repository with the release tags
// each one affects. So one query per repository covers every version, analysed
// or not, and the page can say which ones are hit.
//
// Not covered: advisories OSV.dev does not map onto the repository. Bitcoin
// Core's 2026-10-28 disclosures are not in OSV.dev at all; NVD by product
// would need a CPE per wallet, which the site does not record yet.
import { OSV_API, request, fetchDetails, severityOf, nvdSeverity } from './plugins/osv.mjs';

const SEVERITY_ORDER = ['malicious', 'critical', 'high', 'moderate', 'low', 'unknown'];

// The repository as OSV.dev names it: https, no .git, no trailing slash.
export function repoKey(url) {
  const m = String(url || '').trim().match(/^(?:https?:\/\/|git@)(github\.com|gitlab\.com|codeberg\.org)[/:]([^/\s]+)\/([^/\s#?]+?)(?:\.git)?\/?(?:[#?].*)?$/i);
  return m ? `https://${m[1].toLowerCase()}/${m[2]}/${m[3]}` : null;
}

const sameRepo = (a, b) => String(a || '').replace(/\.git$/, '').replace(/\/$/, '').toLowerCase() === String(b).toLowerCase();
const isCommit = v => /^[0-9a-f]{40}$/i.test(String(v));
// A CVE's description as its summary, cut at a word with an ellipsis.
const shorten = (text, max = 200) => (text.length <= max ? text : `${text.slice(0, max).replace(/\s+\S*$/, '')}…`);
export const tagVersion = tag => String(tag).replace(/^v(?=\d)/i, '');

/**
 * One advisory record of the repository, as stored and exported: the release
 * tags it affects (`versions`, leading v dropped) and the versions it names
 * as fixed (`fixed`, from OSV.dev's extracted ranges; the GIT range itself
 * only names commits), or, when it names none, the last affected ones. Severity is severityOf's; 'unknown' until rated.
 */
export function ownAdvisory(record, repo) {
  const versions = new Set();
  const fixed = new Set();
  const lastAffected = new Set();
  for (const affected of record.affected || []) {
    const ranges = (affected.ranges || []).filter(r => r.type === 'GIT' && sameRepo(r.repo, repo));
    if (!ranges.length) continue;
    for (const v of affected.versions || []) versions.add(tagVersion(v));
    for (const range of ranges) {
      for (const extracted of range.database_specific?.extracted_events || []) {
        for (const event of extracted.range || []) {
          if (event.fixed && !isCommit(event.fixed)) fixed.add(tagVersion(event.fixed));
          if (event.last_affected && !isCommit(event.last_affected)) lastAffected.add(tagVersion(event.last_affected));
        }
      }
    }
  }
  if (!versions.size) return null;
  return {
    id: record.id,
    aliases: record.aliases || [],
    severity: severityOf(record),
    summary: record.summary || shorten(String(record.details || '').split('\n')[0]),
    published: record.published ? String(record.published).slice(0, 10) : null,
    fixed: [...fixed],
    // "up to and including": CVE-2018-6353 names no fix, only 2.9.4 as the last affected
    ...(fixed.size || !lastAffected.size ? {} : { lastAffected: [...lastAffected] }),
    versions: [...versions],
  };
}

/**
 * Every advisory OSV.dev lists for the repository, most severe first, or null
 * when OSV.dev could not be reached (a failed lookup is not a clean result).
 * A CVE OSV.dev cannot rate (CVSS 4.0 only) gets NVD's rating; when NVD fails
 * too it stays 'unknown'.
 */
export async function lookupOwnAdvisories(repo, { fetchImpl = globalThis.fetch, severity = nvdSeverity } = {}) {
  let records;
  try {
    const ids = [];
    let pageToken = null;
    do {
      const data = await request(fetchImpl, `${OSV_API}/query`,
        { package: { ecosystem: 'GIT', name: repo }, ...(pageToken ? { page_token: pageToken } : {}) });
      for (const v of data.vulns || []) ids.push(v.id);
      pageToken = data.next_page_token || null;
    } while (pageToken);
    records = [...(await fetchDetails(ids, fetchImpl)).values()];
  } catch (error) {
    console.log(`Own advisories of ${repo}: OSV.dev lookup failed: ${error.message}`);
    return null;
  }
  const out = records.map(r => ownAdvisory(r, repo)).filter(Boolean);
  for (const a of out) {
    if (a.severity !== 'unknown') continue;
    const cve = [a.id, ...a.aliases].find(n => /^CVE-/.test(n));
    if (!cve) continue;
    try {
      a.severity = (await severity(cve, { fetchImpl })) || 'unknown';
    } catch (error) {
      console.log(`Own advisories of ${repo}: NVD rating of ${cve} failed: ${error.message}`);
    }
  }
  return out.sort((x, y) => SEVERITY_ORDER.indexOf(x.severity) - SEVERITY_ORDER.indexOf(y.severity) || x.id.localeCompare(y.id));
}

/**
 * Look up the own advisories of the given apps (by the repository the site
 * lists for them) and store them. One lookup per repository. A failed lookup
 * keeps what was stored. Returns { checked, failed, changed } with changed the
 * apps whose stored advisories differ afterwards.
 */
export async function refreshOwnAdvisories(db, appIds, { lookup = lookupOwnAdvisories } = {}) {
  const { saveOwnAdvisories, getOwnAdvisories } = await import('./ddbbUtils.mjs');
  const repoOf = db.prepare('SELECT repository FROM apps WHERE app_id = ? AND gone = 0 ORDER BY platform LIMIT 1');
  const byRepo = new Map();
  for (const appId of appIds) {
    const repo = repoKey(repoOf.get(appId)?.repository);
    if (!repo) continue;
    if (!byRepo.has(repo)) byRepo.set(repo, []);
    byRepo.get(repo).push(appId);
  }
  let checked = 0, failed = 0;
  const changed = [];
  for (const [repo, apps] of byRepo) {
    const advisories = await lookup(repo);
    if (!advisories) { failed++; continue; }
    checked++;
    for (const appId of apps) {
      const before = JSON.stringify(getOwnAdvisories(db, appId)?.advisories ?? null);
      saveOwnAdvisories(db, appId, repo, advisories);
      if (JSON.stringify(getOwnAdvisories(db, appId).advisories) !== before) changed.push(appId);
    }
  }
  return { checked, failed, changed };
}
