/**
 * Test 10: known vulnerabilities, from OSV.dev.
 *
 * Takes the dependency rows test 7 resolved from the lockfiles (see
 * plugins/pinning.mjs makeEntry) and asks OSV.dev which of those exact
 * versions have advisories. One batch API covers npm, PyPI, Maven (gradle) and
 * crates.io, so every ecosystem test 7 reads gets the same check, and nothing
 * has to be installed for it. Runs on the host: it reads JSON the container
 * produced and talks to api.osv.dev, nothing from the repository runs.
 *
 * Only rows with an exact version from a registry can be checked. Floating
 * ranges, BOM-supplied versions and git/path/tarball sources are counted as
 * unchecked: an advisory for a registry package says nothing about a fork
 * built from somebody's git branch.
 *
 * Native libraries (OpenSSL, SQLite, Qt) come from no registry. They are
 * looked up by where their source lives (NATIVE_UPSTREAM): OSV.dev by git
 * repository and release tag, or by commit, and NVD by product (CPE), since
 * each lists advisories the other misses (OSV.dev has none for Qt).
 */
import { SHOW_ONLY_FIRST_X_ALERTS } from '../config.mjs';
import { cvss4Score } from '../cvss4.mjs';

export const OSV_API = 'https://api.osv.dev/v1';
const BATCH_SIZE = 1000; // querybatch limit
const DETAIL_CONCURRENCY = 8;
const REQUEST_TIMEOUT_MS = 30000;
const RETRIES = 2;

export const NVD_API = 'https://services.nvd.nist.gov/rest/json/cves/2.0';
const NVD_PAGE_SIZE = 2000; // the API's maximum
// NVD allows 5 requests in 30 seconds without a key, 50 with one.
const NVD_INTERVAL_MS = process.env.NVD_API_KEY ? 700 : 6500;

// test 7 ecosystem -> OSV ecosystem
const OSV_ECOSYSTEMS = { npm: 'npm', pip: 'PyPI', gradle: 'Maven', cargo: 'crates.io', pub: 'Pub' };

// Rows of a native library. p4a is what plugins/pinning.mjs called them before
// 2026-11-09; stored releases keep it until they are analysed again.
const NATIVE_ECOSYSTEMS = new Set(['native', 'p4a']);

// Native libraries by row name: the git repository OSV.dev knows the source
// as, the tag of a release, and the NVD vendor:product. A name not listed here
// is not checked (no-upstream) rather than guessed at.
const cpython = { repo: 'https://github.com/python/cpython', tag: v => `v${v}`, cpe: 'python:python' };
export const NATIVE_UPSTREAM = {
  hostpython3: cpython,
  libffi: { repo: 'https://github.com/libffi/libffi', tag: v => `v${v}`, cpe: 'libffi_project:libffi' },
  libiconv: { repo: 'https://git.savannah.gnu.org/git/libiconv.git', tag: v => `v${v}`, cpe: 'gnu:libiconv' },
  libsecp256k1: { repo: 'https://github.com/bitcoin-core/secp256k1', tag: v => `v${v}`, cpe: null },
  libzbar: { repo: 'https://github.com/mchehab/zbar', tag: v => v, cpe: 'zbar_project:zbar' },
  openssl: { repo: 'https://github.com/openssl/openssl', tag: v => `openssl-${v}`, cpe: 'openssl:openssl' },
  python3: cpython,
  qt6: { repo: 'https://github.com/qt/qtbase', tag: v => `v${v}`, cpe: 'qt:qt' },
  sqlite3: { repo: 'https://github.com/sqlite/sqlite', tag: v => `version-${v}`, cpe: 'sqlite:sqlite' },
};

const isCommit = version => /^[0-9a-f]{40}$/i.test(version || '');

/**
 * Where a native row's source lives: { repo, commit } for a commit, else
 * { repo, tag, cpe, version } with the version as NVD writes it (libffi's
 * recipe says v3.4.8). Null for a row that is not native or not listed.
 */
export function nativeSource(entry) {
  if (!NATIVE_ECOSYSTEMS.has(entry.ecosystem)) return null;
  const upstream = NATIVE_UPSTREAM[String(entry.name).toLowerCase()];
  if (!upstream || !entry.version) return null;
  if (isCommit(entry.version)) return { repo: upstream.repo, commit: entry.version.toLowerCase() };
  const version = entry.version.replace(/^v(?=\d)/, '');
  return { repo: upstream.repo, tag: upstream.tag(version), cpe: upstream.cpe, version };
}

const UNCHECKABLE_TIERS = new Set(['floating', 'unversioned', 'source-ref-pinned']);
// `informational` is a RustSec notice (unmaintained, unsound) with no rating of
// its own or its aliases': listed, but not a vulnerability report.
const SEVERITY_ORDER = ['malicious', 'critical', 'high', 'moderate', 'low', 'unknown', 'informational'];

/**
 * Why a dependency row cannot be looked up, or null when it can. A version
 * must look like a release number: test 7 also records ranges (`^1.2.0`) and
 * placeholders, which OSV would answer with "no advisories" and so read as
 * clean.
 */
export function uncheckableReason(entry) {
  if (NATIVE_ECOSYSTEMS.has(entry.ecosystem)) {
    if (!NATIVE_UPSTREAM[String(entry.name).toLowerCase()]) return 'no-upstream';
    if (!entry.version) return 'unversioned';
    return isCommit(entry.version) || /^v?\d[0-9A-Za-z.+_-]*$/.test(entry.version) ? null : 'no-exact-version';
  }
  if (!OSV_ECOSYSTEMS[entry.ecosystem]) return 'ecosystem';
  // A floating gradle declaration that gradle resolved (plugins/gradle-resolution.mjs)
  // carries the version gradle picked; an unresolved one still has its range
  // (`1.+`, `[1.0,2.0)`, `latest.release`), which the version check below and
  // the `+` check here reject.
  const resolvedFloating = entry.tier === 'floating' && entry.ecosystem === 'gradle' && !(entry.version || '').includes('+');
  if (UNCHECKABLE_TIERS.has(entry.tier) && !resolvedFloating) return entry.tier;
  // yarn berry writes `<ident>@<protocol>:<ref>` (`metamask@workspace:.`); the protocol is what counts
  const resolved = berryResolution(entry.resolved)?.ref ?? (entry.resolved || '');
  if (/^(git\+|git:|github:|file:|link:|portal:|workspace:|patch:|exec:)/.test(resolved)) return 'git-or-path';
  // an npm registry tarball is `<registry>/<name>/-/<name>-<version>.tgz`; any other URL is a tarball from elsewhere
  if (/^https?:/.test(resolved) && !/\/-\/|registry/.test(resolved)) return 'git-or-path';
  if (!/^\d[0-9A-Za-z.+_-]*$/.test(entry.version || '')) return 'no-exact-version';
  return null;
}

/**
 * A yarn berry resolution split into the package it really is and its
 * protocol reference: `@favware/skip-dependency@npm:1.2.1` is
 * `{ ident: '@favware/skip-dependency', ref: 'npm:1.2.1' }`. Null for
 * anything else (an npm tarball URL, a cargo source).
 */
export function berryResolution(resolved) {
  const m = String(resolved || '').match(/^((?:@[^/@\s]+\/)?[^@\s:]+)@([a-z]+:.*)$/);
  return m ? { ident: m[1], ref: m[2] } : null;
}

// The package OSV is asked about: the package the lockfile really installs,
// whatever name it is installed under. `"fs": "npm:@favware/skip-dependency@1.2.1"`
// is not the npm package `fs` (which OSV lists as malware), and the other way
// round `"friendlyService": "npm:fs@0.0.2"` is: an alias must neither raise
// nor hide a finding. package-lock.json records the real name already; yarn
// berry has it in the resolution, yarn v1 only in the tarball URL.
export function queryName(entry) {
  if (entry.ecosystem !== 'npm') return entry.name;
  const b = berryResolution(entry.resolved);
  if (b && b.ref.startsWith('npm:')) return b.ident;
  // yarn v1 keeps the alias as the name; the registry tarball URL names the real package
  const m = String(entry.resolved || '').match(/^https?:\/\/[^/]+\/((?:@[^/]+(?:\/|%2[fF]))?[^/@]+)\/-\//);
  return m ? decodeURIComponent(m[1]) : entry.name;
}

/** Unique OSV queries for the rows of the given pinning analyses, plus what was skipped. */
export function buildQueries(analyses) {
  const queries = new Map(); // key -> { ecosystem, name, version, rows }
  const skipped = {};
  for (const analysis of analyses || []) {
    for (const entry of analysis.entries || []) {
      const reason = uncheckableReason(entry);
      if (reason) {
        skipped[reason] = (skipped[reason] || 0) + 1;
        continue;
      }
      const name = queryName(entry);
      const key = `${entry.ecosystem}\u0000${name}\u0000${entry.version}`;
      if (!queries.has(key)) queries.set(key, { ecosystem: entry.ecosystem, name, version: entry.version, native: nativeSource(entry), rows: [] });
      queries.get(key).rows.push(entry);
    }
  }
  return { queries: [...queries.values()], skipped };
}

async function request(fetchImpl, url, body = null, headers = {}) {
  let lastError;
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    try {
      const response = await fetchImpl(url, {
        method: body ? 'POST' : 'GET',
        headers: { ...(body ? { 'content-type': 'application/json' } : {}), ...headers },
        body: body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (response.ok) return await response.json();
      lastError = new Error(`${url}: HTTP ${response.status}`);
      if (response.status < 500 && response.status !== 429) break; // a client error will not go away
    } catch (error) {
      lastError = error;
    }
    if (attempt < RETRIES) await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
  }
  throw lastError;
}

// A native library is asked about by commit, or by repository and tag: OSV.dev
// maps C/C++ advisories onto the commits they affect.
const packageQuery = (q) => {
  if (q.native?.commit) return { commit: q.native.commit };
  if (q.native) return { package: { ecosystem: 'GIT', name: q.native.repo }, version: q.native.tag };
  return { package: { ecosystem: OSV_ECOSYSTEMS[q.ecosystem], name: q.name }, version: q.version };
};

const toOsvQuery = (q, pageToken) => ({
  ...packageQuery(q),
  ...(pageToken ? { page_token: pageToken } : {}),
});

/** Advisory ids per query, same order as `queries`. */
async function queryIds(queries, fetchImpl) {
  const ids = queries.map(() => []);
  let pending = queries.map((q, i) => ({ i, pageToken: null }));
  while (pending.length) {
    const next = [];
    for (let start = 0; start < pending.length; start += BATCH_SIZE) {
      const chunk = pending.slice(start, start + BATCH_SIZE);
      const data = await request(fetchImpl, `${OSV_API}/querybatch`,
        { queries: chunk.map(p => toOsvQuery(queries[p.i], p.pageToken)) });
      (data.results || []).forEach((result, j) => {
        const { i } = chunk[j];
        for (const v of result.vulns || []) ids[i].push(v.id);
        // a package with more advisories than fit one page comes back with a token
        if (result.next_page_token) next.push({ i, pageToken: result.next_page_token });
      });
    }
    pending = next;
  }
  return ids;
}

// Advisory details are shared across the repositories of a pass (most wallets
// pull in the same few hundred packages), so they are fetched once per process.
const detailCache = new Map(); // id -> Promise<advisory>

export function clearAdvisoryCache() {
  detailCache.clear();
  aliasCache.clear();
  nvdCache.clear();
  nvdNextAt = 0;
}

// The records an unrated advisory aliases, for their rating: OSV.dev often
// returns only the RUSTSEC or PYSEC record of an issue whose GHSA is rated.
// An alias OSV.dev does not know is remembered as null; any other failure
// leaves the advisory unrated this time, it does not fail the lookup.
const aliasCache = new Map(); // id -> Promise<advisory|null>

async function fetchAliases(details, fetchImpl) {
  const wanted = new Set();
  for (const advisory of details.values()) {
    if (severityOf(advisory) !== 'unknown') continue;
    for (const alias of advisory.aliases || []) if (!details.has(alias)) wanted.add(alias);
  }
  const out = new Map();
  for (const id of wanted) {
    if (!aliasCache.has(id)) {
      aliasCache.set(id, request(fetchImpl, `${OSV_API}/vulns/${encodeURIComponent(id)}`).catch((error) => {
        if (!/HTTP 404$/.test(error.message)) aliasCache.delete(id);
        return null;
      }));
    }
    const record = await aliasCache.get(id);
    if (record) out.set(id, record);
  }
  return out;
}

async function fetchDetails(ids, fetchImpl) {
  const unique = [...new Set(ids)];
  const out = new Map();
  let index = 0;
  const worker = async () => {
    while (index < unique.length) {
      const id = unique[index++];
      if (!detailCache.has(id)) {
        const pending = request(fetchImpl, `${OSV_API}/vulns/${encodeURIComponent(id)}`);
        pending.catch(() => detailCache.delete(id)); // retry a failed id on the next repository
        detailCache.set(id, pending);
      }
      out.set(id, await detailCache.get(id));
    }
  };
  await Promise.all(Array.from({ length: Math.min(DETAIL_CONCURRENCY, unique.length) }, worker));
  return out;
}

/* ----------------------------------- NVD ----------------------------------- */

// A release's NVD answer is kept a while, not for the process: the hourly
// recheck (recheck.mjs) is how new CVEs reach releases that do not change.
const NVD_CACHE_MS = 6 * 3600 * 1000;
const nvdCache = new Map(); // vendor:product:version -> { at, pending }
let nvdNextAt = 0;

/** -1, 0 or 1. Numbers compare as numbers, OpenSSL's 1.1.1w comes after 1.1.1. */
export function compareVersions(a, b) {
  const parts = v => String(v).toLowerCase().match(/\d+|[a-z]+/g) || [];
  const [x, y] = [parts(a), parts(b)];
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if (x[i] === undefined) return -1;
    if (y[i] === undefined) return 1;
    const [nx, ny] = [/^\d/.test(x[i]), /^\d/.test(y[i])];
    if (nx && ny && Number(x[i]) !== Number(y[i])) return Number(x[i]) < Number(y[i]) ? -1 : 1;
    if (nx !== ny) return nx ? 1 : -1;
    if (!nx && x[i] !== y[i]) return x[i] < y[i] ? -1 : 1;
  }
  return 0;
}

/**
 * The OSV-style range events of an NVD cpeMatch that marks this
 * vendor:product version vulnerable, or null. A match where the product is
 * only the platform (vulnerable: false: Apache httpd "running with" OpenSSL)
 * does not count, nor does a pre-release (an update other than * or -).
 */
export function nvdMatch(cpeMatch, cpe, version) {
  const [, , , vendor, product, exact, update] = String(cpeMatch.criteria || '').split(':');
  if (!cpeMatch.vulnerable || `${vendor}:${product}` !== cpe || !['*', '-', undefined].includes(update)) return null;
  if (exact && exact !== '*' && exact !== '-') {
    return compareVersions(exact, version) === 0 ? [{ introduced: exact }, { last_affected: exact }] : null;
  }
  const { versionStartIncluding: si, versionStartExcluding: se, versionEndIncluding: ei, versionEndExcluding: ee } = cpeMatch;
  if (si && compareVersions(version, si) < 0) return null;
  if (se && compareVersions(version, se) <= 0) return null;
  if (ei && compareVersions(version, ei) > 0) return null;
  if (ee && compareVersions(version, ee) >= 0) return null;
  return [{ introduced: si || se || '0' }, ee ? { fixed: ee } : ei ? { last_affected: ei } : null].filter(Boolean);
}

// An NVD CVE as an OSV record, so severity, fix and folding treat both alike.
function nvdAdvisory(cve, q, events) {
  const metrics = cve.metrics || {};
  const v3 = [...(metrics.cvssMetricV31 || []), ...(metrics.cvssMetricV30 || [])][0]?.cvssData;
  const label = (metrics.cvssMetricV40 || metrics.cvssMetricV2 || [])[0]?.cvssData?.baseSeverity
    ?? (metrics.cvssMetricV2 || [])[0]?.baseSeverity;
  return {
    id: cve.id,
    aliases: [],
    details: (cve.descriptions || []).find(d => d.lang === 'en')?.value || '',
    severity: v3?.vectorString ? [{ type: 'CVSS_V3', score: v3.vectorString }] : [],
    database_specific: !v3 && label ? { severity: String(label).toLowerCase() } : {},
    affected: [{ package: { ecosystem: q.ecosystem, name: q.name }, ranges: [{ type: 'ECOSYSTEM', events }] }],
  };
}

async function nvdLookup(q, fetchImpl, intervalMs) {
  const { cpe, version } = q.native;
  const out = [];
  for (let start = 0, total = 1; start < total; start += NVD_PAGE_SIZE) {
    const wait = nvdNextAt - Date.now();
    if (wait > 0) await new Promise(resolve => setTimeout(resolve, wait));
    nvdNextAt = Date.now() + intervalMs;
    const url = `${NVD_API}?virtualMatchString=${encodeURIComponent(`cpe:2.3:a:${cpe}:${version}`)}` +
      `&resultsPerPage=${NVD_PAGE_SIZE}&startIndex=${start}`;
    const data = await request(fetchImpl, url, null, process.env.NVD_API_KEY ? { apiKey: process.env.NVD_API_KEY } : {});
    total = data.totalResults || 0;
    for (const { cve } of data.vulnerabilities || []) {
      if (cve.vulnStatus === 'Rejected') continue;
      const matches = (cve.configurations || []).flatMap(c => c.nodes || []).flatMap(n => n.cpeMatch || []);
      const events = matches.map(m => nvdMatch(m, cpe, version)).find(Boolean);
      if (events) out.push(nvdAdvisory(cve, q, events));
    }
    if (!(data.vulnerabilities || []).length) break;
  }
  return out;
}

/**
 * NVD records per query, same order as `queries`; only native releases with a
 * CPE are asked. A query NVD did not answer has no records and is listed in
 * `failed` (its index): NVD is the flakier of the two sources, and its outage
 * must not take the OSV.dev results of every other row with it.
 */
async function nvdAdvisories(queries, fetchImpl, intervalMs) {
  const records = [];
  const failed = [];
  for (const [i, q] of queries.entries()) {
    if (!q.native?.cpe) { records.push([]); continue; }
    const key = `${q.native.cpe}:${q.native.version}`;
    if (!(Date.now() - nvdCache.get(key)?.at < NVD_CACHE_MS)) {
      const pending = nvdLookup(q, fetchImpl, intervalMs);
      pending.catch(() => nvdCache.delete(key));
      nvdCache.set(key, { at: Date.now(), pending });
    }
    try {
      // the cache is shared by row names (python3, hostpython3): re-label for this one
      records.push((await nvdCache.get(key).pending).map(a => ({
        ...a, affected: a.affected.map(x => ({ ...x, package: { ecosystem: q.ecosystem, name: q.name } })),
      })));
    } catch (error) {
      console.log(`NVD lookup for ${q.name} ${q.version} failed: ${error.message}`);
      records.push([]);
      failed.push(i);
    }
  }
  return { records, failed };
}

/* --------------------------------- severity -------------------------------- */

const CVSS3_WEIGHTS = {
  AV: { N: 0.85, A: 0.62, L: 0.55, P: 0.2 },
  AC: { L: 0.77, H: 0.44 },
  UI: { N: 0.85, R: 0.62 },
  CIA: { H: 0.56, L: 0.22, N: 0 },
};

function roundUp(value) {
  const intInput = Math.round(value * 100000);
  return intInput % 10000 === 0 ? intInput / 100000 : (Math.floor(intInput / 10000) + 1) / 10;
}

/** CVSS 3.x base score of a vector string, or null when it is not one. */
export function cvss3BaseScore(vector) {
  if (!/^CVSS:3\.[01]\//.test(vector || '')) return null;
  const m = Object.fromEntries(vector.split('/').slice(1).map(part => part.split(':')));
  const changed = m.S === 'C';
  const pr = { N: 0.85, L: changed ? 0.68 : 0.62, H: changed ? 0.5 : 0.27 }[m.PR];
  const [av, ac, ui] = [CVSS3_WEIGHTS.AV[m.AV], CVSS3_WEIGHTS.AC[m.AC], CVSS3_WEIGHTS.UI[m.UI]];
  const [c, i, a] = [m.C, m.I, m.A].map(x => CVSS3_WEIGHTS.CIA[x]);
  if ([pr, av, ac, ui, c, i, a].some(x => x === undefined) || (m.S !== 'U' && !changed)) return null;
  const iss = 1 - (1 - c) * (1 - i) * (1 - a);
  const impact = changed ? 7.52 * (iss - 0.029) - 3.25 * Math.pow(iss - 0.02, 15) : 6.42 * iss;
  if (impact <= 0) return 0;
  const exploitability = 8.22 * av * ac * pr * ui;
  return roundUp(Math.min((changed ? 1.08 : 1) * (impact + exploitability), 10));
}

function ratingOfScore(score) {
  if (score >= 9) return 'critical';
  if (score >= 7) return 'high';
  if (score >= 4) return 'moderate';
  if (score > 0) return 'low';
  return 'unknown';
}

/**
 * critical / high / moderate / low / unknown, or `malicious` for an OSV
 * malicious-package record (MAL-*), which has no score but outranks them all.
 * GitHub's reviewed label wins over a computed score, a CVSS 3 score over a
 * CVSS 4 one. Records that score only per affected package are read there:
 * RustSec writes its vector in `database_specific.cvss`, OSS-Fuzz a label in
 * `ecosystem_specific.severity`.
 */
export function severityOf(advisory) {
  if (/^MAL-/.test(advisory.id || '')) return 'malicious';
  const label = ratingOfLabel(advisory.database_specific?.severity);
  if (label) return label;
  const affected = advisory.affected || [];
  const vectors = [...(advisory.severity || []), ...affected.flatMap(a => a.severity || [])].map(s => s.score)
    .concat(affected.map(a => a.database_specific?.cvss));
  for (const score of [cvss3BaseScore, cvss4Score].flatMap(f => vectors.map(v => f(v)))) {
    if (score !== null) return ratingOfScore(score);
  }
  for (const a of affected) {
    const own = ratingOfLabel(a.ecosystem_specific?.severity);
    if (own) return own;
  }
  return 'unknown';
}

/** RustSec's kind of informational notice (unmaintained, unsound, notice), or null. */
export function informationalOf(advisory) {
  return (advisory.affected || []).map(a => a.database_specific?.informational).find(Boolean) || null;
}

// The severity a finding gets: the record's own, else the best rating among
// the records it aliases (`records`: id -> record), else `informational` for
// a RustSec notice, else unknown.
function findingSeverity(advisory, records) {
  const own = severityOf(advisory);
  if (own !== 'unknown') return own;
  const rated = (advisory.aliases || []).map(id => records.get(id)).filter(Boolean).map(severityOf)
    .filter(s => ['critical', 'high', 'moderate', 'low'].includes(s))
    .sort((x, y) => SEVERITY_ORDER.indexOf(x) - SEVERITY_ORDER.indexOf(y));
  if (rated.length) return rated[0];
  return informationalOf(advisory) ? 'informational' : 'unknown';
}

function ratingOfLabel(label) {
  const l = String(label || '').toLowerCase();
  if (['critical', 'high', 'moderate', 'low'].includes(l)) return l;
  return l === 'medium' ? 'moderate' : null;
}

/** The `fixed` versions the advisory lists for this package. */
// The ecosystem an advisory's affected entry names for this query's package:
// an NVD record (nvdAdvisory) uses the row's own.
const affectedEcosystem = q => OSV_ECOSYSTEMS[q.ecosystem] ?? q.ecosystem;

function fixedVersions(advisory, q) {
  const fixed = new Set();
  for (const affected of advisory.affected || []) {
    if (affected.package?.ecosystem !== affectedEcosystem(q)) continue;
    if (String(affected.package?.name).toLowerCase() !== q.name.toLowerCase()) continue;
    for (const range of affected.ranges || []) {
      for (const event of range.events || []) if (event.fixed) fixed.add(event.fixed);
    }
  }
  return [...fixed];
}

/**
 * The affected version ranges the advisory lists for this package, one string
 * per range: "< 4.17.19", ">= 3.7.0, < 4.17.19", "<= 2.1.0", ">= 1.0.0".
 * Git commit ranges are left out; null when no range names a version.
 */
export function affectedRanges(advisory, q) {
  const out = new Set();
  for (const affected of advisory.affected || []) {
    if (affected.package?.ecosystem !== affectedEcosystem(q)) continue;
    if (String(affected.package?.name).toLowerCase() !== q.name.toLowerCase()) continue;
    for (const range of affected.ranges || []) {
      if (range.type === 'GIT') continue;
      let from = null;
      const close = (to) => {
        out.add([from && from !== '0' && `>= ${from}`, to].filter(Boolean).join(', ') || 'all versions');
        from = null;
      };
      let open = false;
      for (const event of range.events || []) {
        if (event.introduced !== undefined) { from = event.introduced; open = true; }
        else if (event.fixed !== undefined && open) { close(`< ${event.fixed}`); open = false; }
        else if (event.last_affected !== undefined && open) { close(`<= ${event.last_affected}`); open = false; }
      }
      if (open) close(null);
    }
  }
  return out.size ? [...out] : null;
}

/**
 * One finding per advisory, per package version. OSV often returns the same
 * issue twice (a GHSA and the RUSTSEC or PYSEC record it aliases); those are
 * folded into one finding, keeping the record that carries a severity and the
 * fixed versions and affected ranges of all of them.
 */
function findingsFor(q, ids, details, extra = [], records = details) {
  const advisories = [...ids.map(id => details.get(id)).filter(Boolean), ...extra];
  const severity = new Map(advisories.map(a => [a, findingSeverity(a, records)]));
  // most severe first; on a tie the record with GitHub's reviewed label, so the
  // kept id does not depend on the order OSV listed them in
  const labelled = (a) => (a.database_specific?.severity ? 0 : 1);
  advisories.sort((x, y) => SEVERITY_ORDER.indexOf(severity.get(x)) - SEVERITY_ORDER.indexOf(severity.get(y)) ||
    labelled(x) - labelled(y) || x.id.localeCompare(y.id));
  const byName = new Map(); // advisory id or alias -> the finding that carries it
  const findings = [];
  for (const advisory of advisories) {
    const names = [advisory.id, ...(advisory.aliases || [])];
    const kept = byName.get(names.find(n => byName.has(n)));
    const fixed = fixedVersions(advisory, q);
    const affected = affectedRanges(advisory, q);
    if (kept) {
      // The record kept for its severity need not be the one that knows the
      // fix: OSV.dev's git-tag records of a C library list neither fixed
      // versions nor ranges, the NVD record of the same CVE lists both.
      kept.fixed = [...new Set([...kept.fixed, ...fixed])];
      kept.affected = kept.affected || affected ? [...new Set([...(kept.affected || []), ...(affected || [])])] : null;
      for (const n of names) byName.set(n, kept);
      continue;
    }
    const finding = {
      ecosystem: q.ecosystem,
      name: q.name,
      version: q.version,
      id: advisory.id,
      aliases: advisory.aliases || [],
      severity: severity.get(advisory),
      summary: advisory.summary || (advisory.details || '').split('\n')[0].slice(0, 200),
      fixed,
      affected,
      direct: q.rows.some(r => r.direct === true) ? true : (q.rows.some(r => r.direct === false) ? false : null),
      dev: q.rows.every(r => r.dev === true) ? true : (q.rows.some(r => r.dev === false) ? false : null),
      scope: scopeOfRows(q.rows),
      dependants: dependantsOfRows(q.rows),
      lockfiles: [...new Set(q.rows.map(r => r.lockfile))],
    };
    for (const n of names) byName.set(n, finding);
    findings.push(finding);
  }
  return findings;
}

/**
 * Look up every checkable dependency of the given pinning analyses.
 * Resolves to { checked, skipped, findings, nvdUnavailable } (findings
 * ordered most severe first), or null when OSV.dev could not be reached: a
 * failed lookup is not a clean result. NVD failing leaves the OSV.dev
 * findings in place and lists the native rows it did not answer for in
 * `nvdUnavailable` (and counts them under skipped['nvd-unavailable']).
 */
// The widest scope among the rows of one package version: 'app' if any row
// ships, else 'build' if any row is build tooling, else 'tests', else null.
// The union of the rows' dependants (who requires this package version, one
// hop up); null when no row knows.
export function dependantsOfRows(rows) {
  const known = rows.filter(r => Array.isArray(r.dependants));
  if (!known.length) return null;
  return [...new Set(known.flatMap(r => r.dependants))].sort();
}

export function scopeOfRows(rows) {
  const scopes = new Set(rows.map(r => r.scope ?? (r.dev === true ? 'build' : r.dev === false ? 'app' : null)));
  for (const s of ['app', 'build', 'tests']) if (scopes.has(s)) return s;
  return null;
}

export async function checkVulnerabilities(analyses, { fetchImpl = globalThis.fetch, nvdIntervalMs = NVD_INTERVAL_MS } = {}) {
  console.log('\n--- Test 10: Known vulnerabilities (OSV.dev, from the resolved dependencies) ---');
  const { queries, skipped } = buildQueries(analyses);
  const skippedTotal = Object.values(skipped).reduce((a, b) => a + b, 0);
  if (!queries.length) {
    console.log(`No dependency with an exact registry version to look up${skippedTotal ? ` (${describeSkipped(skipped)})` : ''}.`);
    return { checked: 0, skipped, findings: [] };
  }

  let findings;
  let nvdUnavailable = [];
  try {
    const ids = await queryIds(queries, fetchImpl);
    const details = await fetchDetails(ids.flat(), fetchImpl);
    // every record an alias can be looked up in: those of other packages too
    const records = new Map([...details, ...await fetchAliases(details, fetchImpl)]);
    const nvd = await nvdAdvisories(queries, fetchImpl, nvdIntervalMs);
    findings = queries.flatMap((q, i) => findingsFor(q, ids[i], details, nvd.records[i], records));
    nvdUnavailable = nvd.failed.map(i => queries[i]);
  } catch (error) {
    console.log(`Vulnerability lookup failed: ${error.message}. No vulnerability result for this run.`);
    return null;
  }
  findings.sort((x, y) => SEVERITY_ORDER.indexOf(x.severity) - SEVERITY_ORDER.indexOf(y.severity) ||
    x.ecosystem.localeCompare(y.ecosystem) || x.name.localeCompare(y.name));

  // Rows NVD did not answer for are counted as not fully checked; what OSV.dev
  // found for them stays. saveVulnerabilities keeps their stored rows.
  const unavailable = nvdUnavailable.reduce((n, q) => n + q.rows.length, 0);
  if (unavailable) skipped['nvd-unavailable'] = (skipped['nvd-unavailable'] || 0) + unavailable;
  report(queries, skipped, findings);
  return {
    checked: queries.length, skipped, findings,
    nvdUnavailable: nvdUnavailable.map(q => ({ ecosystem: q.ecosystem, name: q.name, version: q.version })),
  };
}

function describeSkipped(skipped) {
  return Object.entries(skipped).map(([reason, n]) => `${n} ${reason}`).join(', ');
}

function report(queries, skipped, findings) {
  const perEcosystem = {};
  for (const q of queries) perEcosystem[q.ecosystem] = (perEcosystem[q.ecosystem] || 0) + 1;
  console.log(`Looked up ${queries.length} package versions (${Object.entries(perEcosystem).map(([e, n]) => `${e} ${n}`).join(', ')})`);
  if (Object.keys(skipped).length) {
    console.log(`Not (fully) checked: ${describeSkipped(skipped)}`);
  }
  if (!findings.length) {
    console.log('No known vulnerabilities');
    return;
  }
  const counts = {};
  for (const f of findings) counts[f.severity] = (counts[f.severity] || 0) + 1;
  const vulnerablePackages = new Set(findings.map(f => `${f.ecosystem}\u0000${f.name}\u0000${f.version}`)).size;
  console.log(`${findings.length} advisories in ${vulnerablePackages} package versions: ` +
    SEVERITY_ORDER.filter(s => counts[s]).map(s => `${counts[s]} ${s}`).join(', '));
  for (const f of findings.slice(0, SHOW_ONLY_FIRST_X_ALERTS)) {
    const cve = f.aliases.find(a => a.startsWith('CVE-'));
    const scope = [f.direct === true ? 'direct' : f.direct === false ? 'transitive' : null, f.dev ? 'dev' : null].filter(Boolean).join(', ');
    console.log(`  ** [${f.severity}] ${f.ecosystem} ${f.name}@${f.version} ${f.id}${cve && cve !== f.id ? ` (${cve})` : ''}` +
      `${scope ? ` [${scope}]` : ''} - fixed in: ${f.fixed.length ? f.fixed.join(', ') : 'no fix listed'}`);
    if (f.summary) console.log(`     ${f.summary}`);
  }
  if (findings.length > SHOW_ONLY_FIRST_X_ALERTS) {
    console.log(`  ... and ${findings.length - SHOW_ONLY_FIRST_X_ALERTS} more`);
  }
}

// Test 10: known vulnerabilities of every dependency pinning resolved to an
// exact registry version, from OSV.dev, looked up from the host. A failed
// lookup fails the analysis, so an unchanged default branch is retried next
// pass instead of being skipped without a vulnerability result. Stored per
// release (app_vulnerabilities) with the analysis; a malicious package also
// raises an alert (alerts.mjs) right away, whatever the later steps do.
export default {
  description: 'Test 10: known vulnerabilities (OSV.dev)',
  requires: ['pinning'],
  async host({ name, version, db, results, saves }) {
    const vulnerabilities = await checkVulnerabilities(results.pinning || []);
    if (!vulnerabilities) throw new Error('the OSV.dev lookup failed');
    if (db && version) {
      const { saveVulnerabilities } = await import('../ddbbUtils.mjs');
      saves.push((db) => {
        const stored = saveVulnerabilities(db, name, version, vulnerabilities);
        console.log(`Stored ${stored} vulnerability rows for ${name} ${version}`);
      });
      // A malicious package is not a row to triage some day: record it and tell a person now.
      const { recordMalwareAlerts, deliverAlerts } = await import('../alerts.mjs');
      recordMalwareAlerts(db, name, version, vulnerabilities.findings);
      await deliverAlerts(db); // also retries earlier ones a channel did not take
    }
    return vulnerabilities;
  },
};
