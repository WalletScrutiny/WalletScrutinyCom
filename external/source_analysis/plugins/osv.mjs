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
 * each lists advisories the other misses (OSV.dev has none for Qt). NVD names
 * the product of a CVE only once it has analysed it, so where the library's
 * vendor publishes its own CVE records, those are read too (VENDORS,
 * vendorCves.mjs). None of them sees a fix backported to an older release
 * line, so each such finding is checked against the release tags of the
 * upstream repository too (applyUpstreamFixes, issue 1016).
 */
import { SHOW_ONLY_FIRST_X_ALERTS, CVE_RECORDS_DIR } from '../config.mjs';
import { defaultUpstreamGit, sameRepo } from '../upstreamGit.mjs';
import { CVE_API, vendorMatch, vendorAdvisory, vendorRecords } from '../vendorCves.mjs';

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
// is not checked (no-upstream) rather than guessed at. `vendor` is set where
// the library's maintainers publish their own CVE records: NVD's name for
// them as the source of a CVE, and the product such a record must name (the
// same vendors also publish for pip, Qt Creator, Qt for MCUs).
const VENDORS = {
  openssl: { source: 'openssl-security@openssl.org', product: /^openssl$/i },
  psf: { source: 'cna@python.org', product: /^cpython$/i },
  qt: { source: 'a59d8014-47c4-4630-ab43-e1b13cbe58e3', product: /^qt(?: framework)?$/i },
};
const cpython = { repo: 'https://github.com/python/cpython', tag: v => `v${v}`, cpe: 'python:python', vendor: VENDORS.psf };
// OSV.dev knows the repository in lower case only
const ffmpeg = { repo: 'https://github.com/ffmpeg/ffmpeg', tag: v => `n${v}`, cpe: 'ffmpeg:ffmpeg' };
export const NATIVE_UPSTREAM = {
  ffmpeg,
  ffmpeg_qt: ffmpeg, // the FFmpeg build Qt Multimedia links
  hostpython3: cpython,
  libffi: { repo: 'https://github.com/libffi/libffi', tag: v => `v${v}`, cpe: 'libffi_project:libffi' },
  libiconv: { repo: 'https://git.savannah.gnu.org/git/libiconv.git', tag: v => `v${v}`, cpe: 'gnu:libiconv' },
  libsecp256k1: { repo: 'https://github.com/bitcoin-core/secp256k1', tag: v => `v${v}`, cpe: null },
  libzbar: { repo: 'https://github.com/mchehab/zbar', tag: v => v, cpe: 'zbar_project:zbar' },
  openssl: { repo: 'https://github.com/openssl/openssl', tag: v => `openssl-${v}`, cpe: 'openssl:openssl', vendor: VENDORS.openssl },
  python3: cpython,
  qt6: { repo: 'https://github.com/qt/qtbase', tag: v => `v${v}`, cpe: 'qt:qt', vendor: VENDORS.qt },
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
const SEVERITY_ORDER = ['malicious', 'critical', 'high', 'moderate', 'low', 'unknown'];

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
      // a pinned pair's source row (pipRules.mjs): its pinned row is the same package and is looked up
      if (entry.coveredBy) continue;
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

export async function request(fetchImpl, url, body = null, headers = {}) {
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
      lastError = Object.assign(new Error(`${url}: HTTP ${response.status}`), { status: response.status });
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
  nvdCache.clear();
  nvdSeverityCache.clear();
  vendorCache.clear();
  nvdNextAt = 0;
}

export async function fetchDetails(ids, fetchImpl) {
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

// One paced request to NVD: every lookup of the process shares the interval.
async function nvdRequest(query, fetchImpl, intervalMs) {
  const wait = nvdNextAt - Date.now();
  if (wait > 0) await new Promise(resolve => setTimeout(resolve, wait));
  nvdNextAt = Date.now() + intervalMs;
  return request(fetchImpl, `${NVD_API}?${query}`, null, process.env.NVD_API_KEY ? { apiKey: process.env.NVD_API_KEY } : {});
}

async function nvdLookup(q, fetchImpl, intervalMs) {
  const { cpe, version } = q.native;
  const out = [];
  for (let start = 0, total = 1; start < total; start += NVD_PAGE_SIZE) {
    const data = await nvdRequest(`virtualMatchString=${encodeURIComponent(`cpe:2.3:a:${cpe}:${version}`)}` +
      `&resultsPerPage=${NVD_PAGE_SIZE}&startIndex=${start}`, fetchImpl, intervalMs);
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

// The severity NVD gives one CVE, from its own score: OSV.dev's copy of a
// CVE scored only in CVSS 4.0 has a vector this module cannot rate (the 4.0
// score is a table lookup, not a formula). Lower case like severityOf's
// labels ('moderate' for NVD's MEDIUM), null when NVD rates it in no version.
// Paced and cached like the product lookups.
const nvdSeverityCache = new Map(); // id -> { at, pending }
export async function nvdSeverity(id, { fetchImpl = globalThis.fetch, intervalMs = NVD_INTERVAL_MS } = {}) {
  if (!(Date.now() - nvdSeverityCache.get(id)?.at < NVD_CACHE_MS)) {
    const pending = (async () => {
      const data = await nvdRequest(`cveId=${encodeURIComponent(id)}`, fetchImpl, intervalMs);
      const metrics = data.vulnerabilities?.[0]?.cve?.metrics || {};
      const label = ['cvssMetricV40', 'cvssMetricV31', 'cvssMetricV30', 'cvssMetricV2']
        .map(k => (metrics[k] || [])[0]).filter(Boolean).map(m => m.cvssData?.baseSeverity ?? m.baseSeverity)[0];
      if (!label) return null;
      const lower = String(label).toLowerCase();
      return lower === 'medium' ? 'moderate' : lower;
    })();
    pending.catch(() => nvdSeverityCache.delete(id));
    nvdSeverityCache.set(id, { at: Date.now(), pending });
  }
  return nvdSeverityCache.get(id).pending;
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

/* ----------------------------- vendor CVE records --------------------------- */

const vendorCache = new Map(); // source -> { at, pending: Promise<Map id -> record> }

// Every CVE a vendor published, with its record (vendorCves.mjs). NVD lists
// them whether or not it has analysed them; a rejected one is no advisory.
async function vendorLookup(source, { fetchImpl, intervalMs, dir }) {
  const listed = [];
  for (let start = 0, total = 1; start < total; start += NVD_PAGE_SIZE) {
    const data = await nvdRequest(`sourceIdentifier=${encodeURIComponent(source)}&resultsPerPage=${NVD_PAGE_SIZE}&startIndex=${start}`, fetchImpl, intervalMs);
    total = data.totalResults || 0;
    // NVD answers a source it does not know with an empty list, not an error.
    // A vendor in VENDORS has published CVEs: none listed is a lookup that failed.
    if (!total) throw new Error(`NVD lists no CVE for the source ${source}`);
    for (const { cve } of data.vulnerabilities || []) {
      if (cve.vulnStatus !== 'Rejected') listed.push({ id: cve.id, lastModified: cve.lastModified || '' });
    }
    if (!(data.vulnerabilities || []).length) break;
  }
  const fetchRecord = id => request(fetchImpl, `${CVE_API}/${encodeURIComponent(id)}`).catch((error) => {
    if (error.status === 404) return null; // listed by NVD, not (yet) public as a record
    throw error;
  });
  return vendorRecords(source, listed, { dir, fetchRecord });
}

/**
 * The vendor's records that name the shipped version, per query, same order
 * as `queries`; only native releases of a library in VENDORS are asked.
 * `skip` is the queries NVD already failed for (the list of a vendor's CVEs
 * comes from NVD too). A query whose vendor's records could not be read has
 * none and is listed in `failed`, like one NVD did not answer for.
 */
async function vendorAdvisories(queries, skip, { fetchImpl, intervalMs, dir }) {
  const records = [];
  const failed = [];
  for (const [i, q] of queries.entries()) {
    const vendor = q.native?.version ? NATIVE_UPSTREAM[String(q.name).toLowerCase()]?.vendor : null;
    if (!vendor || skip.includes(i)) { records.push([]); continue; }
    if (!(Date.now() - vendorCache.get(vendor.source)?.at < NVD_CACHE_MS)) {
      const pending = vendorLookup(vendor.source, { fetchImpl, intervalMs, dir });
      pending.catch(() => vendorCache.delete(vendor.source));
      vendorCache.set(vendor.source, { at: Date.now(), pending });
    }
    try {
      const out = [];
      for (const [id, record] of await vendorCache.get(vendor.source).pending) {
        const match = vendorMatch(record, vendor.product, q.native.version, compareVersions);
        if (match) out.push(vendorAdvisory(id, record, match, q));
      }
      records.push(out);
    } catch (error) {
      console.log(`Vendor CVE records for ${q.name} ${q.version} could not be read: ${error.message}`);
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
 * GitHub's reviewed label wins over a computed score; CVSS v4-only advisories
 * are `unknown` (no v4 calculator here).
 */
export function severityOf(advisory) {
  if (/^MAL-/.test(advisory.id || '')) return 'malicious';
  const label = String(advisory.database_specific?.severity || '').toLowerCase();
  if (['critical', 'high', 'moderate', 'low'].includes(label)) return label;
  if (label === 'medium') return 'moderate';
  for (const s of advisory.severity || []) {
    const score = cvss3BaseScore(s.score);
    if (score !== null) return ratingOfScore(score);
  }
  return 'unknown';
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
 * fixed versions and affected ranges of all of them. `listedBy` is the
 * sources whose records were folded in, in LISTERS' order: 'osv' for OSV.dev,
 * 'nvd' for the NVD records, 'vendor' for the vendor's own CVE records.
 */
const LISTERS = ['osv', 'nvd', 'vendor'];
// Every advisory id and alias folded into a finding, so the upstream check
// finds the fixing commits of a record that lost the fold to a more severe one.
const foldedNames = new WeakMap(); // finding -> Set of ids

function findingsFor(q, ids, details, nvd = [], vendor = []) {
  const advisories = [...ids.map(id => details.get(id)).filter(Boolean), ...nvd, ...vendor];
  const [nvdRecords, vendorRecordsOf] = [new Set(nvd), new Set(vendor)];
  const listerOf = (advisory) => (nvdRecords.has(advisory) ? 'nvd' : vendorRecordsOf.has(advisory) ? 'vendor' : 'osv');
  // most severe first; on a tie the record with GitHub's reviewed label, so the
  // kept id does not depend on the order OSV listed them in
  const labelled = (a) => (a.database_specific?.severity ? 0 : 1);
  advisories.sort((x, y) => SEVERITY_ORDER.indexOf(severityOf(x)) - SEVERITY_ORDER.indexOf(severityOf(y)) ||
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
      kept.listedBy = LISTERS.filter(l => l === listerOf(advisory) || kept.listedBy.includes(l));
      // A native finding may be kept under NVD's or the vendor's record, which
      // names no alias: OSV.dev's id (PSF-2026-13) stays known with it.
      if (q.native) kept.aliases = [...new Set([...kept.aliases, ...names])].filter(n => n !== kept.id);
      for (const n of names) byName.set(n, kept);
      for (const n of names) foldedNames.get(kept).add(n);
      continue;
    }
    const finding = {
      ecosystem: q.ecosystem,
      name: q.name,
      version: q.version,
      id: advisory.id,
      aliases: advisory.aliases || [],
      severity: severityOf(advisory),
      summary: advisory.summary || (advisory.details || '').split('\n')[0].slice(0, 200),
      fixed,
      affected,
      direct: q.rows.some(r => r.direct === true) ? true : (q.rows.some(r => r.direct === false) ? false : null),
      dev: q.rows.every(r => r.dev === true) ? true : (q.rows.some(r => r.dev === false) ? false : null),
      scope: scopeOfRows(q.rows),
      dependants: dependantsOfRows(q.rows),
      lockfiles: [...new Set(q.rows.map(r => r.lockfile))],
      listedBy: [listerOf(advisory)],
    };
    for (const n of names) byName.set(n, finding);
    foldedNames.set(finding, new Set(names));
    findings.push(finding);
  }
  return findings;
}

/**
 * Look up every checkable dependency of the given pinning analyses.
 * Resolves to { checked, skipped, findings, backported, nvdUnavailable }
 * (findings ordered most severe first; backported the native findings left
 * out because the shipped tag has the fix, applyUpstreamFixes), or null when
 * OSV.dev could not be reached: a
 * failed lookup is not a clean result. NVD failing leaves the OSV.dev
 * findings in place and lists the native rows it did not answer for in
 * `nvdUnavailable` (and counts them under skipped['nvd-unavailable']), as
 * does a vendor's CVE records not being readable.
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

/* ------------------------------ upstream git ------------------------------ */

// The release line a version is on, which a backport lands on: 3.11 for
// 3.11.16, 3.0 for 3.0.22, 1.1.1 for OpenSSL's 1.1.1w.
export function releaseLine(version) {
  const v = String(version);
  if (/\d[a-z]{1,2}$/i.test(v)) return v.replace(/[a-z]+$/i, '');
  const parts = v.split('.');
  return parts.length > 2 ? parts.slice(0, -1).join('.') : v;
}

// A release after `version`, not a pre-release (3.11.0rc1).
export function laterRelease(candidate, version) {
  return /^\d+(\.\d+)*[a-z]{0,2}$/i.test(candidate) && compareVersions(candidate, version) > 0;
}

// A later release on the same line as `version`: 3.11.17 for 3.11.16, not
// 3.11.0rc1, 3.12.0 or 3.110.1.
export function laterOnLine(candidate, version) {
  const line = releaseLine(version);
  return laterRelease(candidate, version) && candidate.startsWith(line) && /^(\.\d+)*[a-z]{0,2}$/i.test(candidate.slice(line.length));
}

// An advisory record by id or alias, or null when OSV.dev has none or did not
// answer: a missing record leaves the finding as NVD and OSV.dev gave it.
function advisoryRecord(id, details, fetchImpl) {
  if (details.has(id)) return Promise.resolve(details.get(id));
  if (!detailCache.has(id)) {
    // OSV.dev has no record for many CVEs that only NVD or the vendor lists:
    // that answer is kept too, and not asked for again with every release.
    const pending = request(fetchImpl, `${OSV_API}/vulns/${encodeURIComponent(id)}`).catch((error) => {
      if (error.status === 404) return null;
      throw error;
    });
    pending.catch(() => detailCache.delete(id));
    detailCache.set(id, pending);
  }
  return detailCache.get(id).catch(() => null);
}

/** The fixing commits OSV.dev records for an advisory in this repository, sorted. */
export function fixCommits(records, repo) {
  const commits = new Set();
  for (const record of records) {
    for (const affected of record?.affected || []) {
      for (const range of affected.ranges || []) {
        if (range.type !== 'GIT' || !sameRepo(range.repo, repo)) continue;
        for (const event of range.events || []) if (event.fixed) commits.add(String(event.fixed).toLowerCase());
      }
    }
  }
  return [...commits].sort();
}

/**
 * What the upstream repository says about a native finding: { backported:
 * { commit, tag } } when a fixing commit is in the shipped release's tag,
 * { fixedIn: { version, tag, commit } } for the first later release on the
 * same line that has one (or, with `anyLine`, the first later release at
 * all when the line has none), {} when neither, or null when it is not known
 * (no clone): the finding then stays as it is.
 */
export async function upstreamVerdict(commits, { repo, tag, version, tagOf }, git, { anyLine = false } = {}) {
  const prefix = tagOf('');
  const containing = [];
  for (const commit of commits) {
    const tags = await git.tagsContaining(repo, commit);
    if (!tags) return null;
    // A commit a tag points at is a release, not a fix. OSV.dev lists it for
    // a version range ("fixed: 3.1.5" as the commit "bump to 3.1.5 final"),
    // and every later release of every line descends from it. It speaks for
    // its own release only, and never shows that a later one has the fix.
    const releases = await git.tagsPointingAt?.(repo, commit);
    containing.push(releases?.size ? { commit, tags: releases, release: true } : { commit, tags });
  }
  // Of the commits in a tag, the fix rather than the release commit: only
  // the fix says what changed.
  const pick = (inTag) => {
    const found = containing.filter(c => c.tags.has(inTag));
    return (found.find(c => !c.release) || found[0]).commit;
  };
  const backport = containing.find(c => !c.release && c.tags.has(tag));
  if (backport) return { backported: { commit: backport.commit, tag } };
  let onLine = null;
  let later = null;
  const earlier = (v, than) => !than || compareVersions(v, than.version) < 0;
  for (const t of new Set(containing.flatMap(c => [...c.tags]))) {
    if (!t.startsWith(prefix)) continue;
    const v = t.slice(prefix.length);
    if (laterOnLine(v, version) && earlier(v, onLine)) onLine = { version: v, tag: t };
    if (laterRelease(v, version) && earlier(v, later)) later = { version: v, tag: t };
  }
  const first = onLine || (anyLine ? later : null);
  return first ? { fixedIn: { ...first, commit: pick(first.tag) } } : {};
}

/**
 * Checks each finding of a native release against its upstream repository
 * (upstreamGit.mjs). A finding whose fix is already in the shipped tag is
 * taken out of `perQuery` and returned in the list of backported ones, with
 * the commit and tag that show it; NVD's "< 3.13.13" ranges say nothing about
 * a 3.11 backport (issue 1016). Otherwise the first release on the shipped
 * line that has the fix is added to `fixed` and named in `fixedFromGit`; for
 * a finding with no fix version at all (SQLite's OSV.dev-only records), the
 * first later release that has it. Git only adds a version: NVD's stay, since
 * a release line may get a fix without a public tag (OpenSSL 3.0.23). Without
 * an answer from git a finding stays as NVD and OSV.dev gave it.
 */
export async function applyUpstreamFixes(queries, perQuery, details, { fetchImpl, git }) {
  const backported = [];
  if (!git) return backported;
  for (const [i, q] of queries.entries()) {
    if (!q.native?.tag) continue;
    const upstream = NATIVE_UPSTREAM[String(q.name).toLowerCase()];
    const kept = [];
    for (const f of perQuery[i]) {
      let verdict = null;
      try {
        const names = [...(foldedNames.get(f) || [f.id, ...f.aliases])];
        const records = await Promise.all(names.map(id => advisoryRecord(id, details, fetchImpl)));
        verdict = await upstreamVerdict(fixCommits(records, upstream.repo),
          { repo: upstream.repo, tag: q.native.tag, version: q.native.version, tagOf: upstream.tag }, git, { anyLine: !f.fixed.length });
      } catch (error) {
        console.log(`Upstream git check of ${f.id} for ${q.name} ${q.version} failed: ${error.message}`);
      }
      if (verdict?.backported) {
        backported.push({
          ecosystem: f.ecosystem, name: f.name, version: f.version, id: f.id, aliases: f.aliases,
          severity: f.severity, summary: f.summary, listedBy: f.listedBy,
          repo: upstream.repo, commit: verdict.backported.commit, tag: verdict.backported.tag,
        });
        continue;
      }
      if (verdict?.fixedIn) {
        const { version, tag, commit } = verdict.fixedIn;
        if (!f.fixed.includes(version)) f.fixed = [...f.fixed, version];
        f.fixedFromGit = [{ version, tag, commit, repo: upstream.repo }];
      }
      kept.push(f);
    }
    perQuery[i] = kept;
  }
  return backported;
}

export async function checkVulnerabilities(analyses, { fetchImpl = globalThis.fetch, nvdIntervalMs = NVD_INTERVAL_MS, git = defaultUpstreamGit(), cveRecordsDir = CVE_RECORDS_DIR } = {}) {
  console.log('\n--- Test 10: Known vulnerabilities (OSV.dev, from the resolved dependencies) ---');
  const { queries, skipped } = buildQueries(analyses);
  const skippedTotal = Object.values(skipped).reduce((a, b) => a + b, 0);
  if (!queries.length) {
    console.log(`No dependency with an exact registry version to look up${skippedTotal ? ` (${describeSkipped(skipped)})` : ''}.`);
    return { checked: 0, skipped, findings: [], backported: [] };
  }

  let findings;
  let backported = [];
  let nvdUnavailable = [];
  try {
    const ids = await queryIds(queries, fetchImpl);
    const details = await fetchDetails(ids.flat(), fetchImpl);
    const nvd = await nvdAdvisories(queries, fetchImpl, nvdIntervalMs);
    const vendor = await vendorAdvisories(queries, nvd.failed, { fetchImpl, intervalMs: nvdIntervalMs, dir: cveRecordsDir });
    const perQuery = queries.map((q, i) => findingsFor(q, ids[i], details, nvd.records[i], vendor.records[i]));
    backported = await applyUpstreamFixes(queries, perQuery, details, { fetchImpl, git });
    findings = perQuery.flat();
    nvdUnavailable = [...nvd.failed, ...vendor.failed].sort((a, b) => a - b).map(i => queries[i]);
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
  report(queries, skipped, findings, backported);
  return {
    checked: queries.length, skipped, findings, backported,
    nvdUnavailable: nvdUnavailable.map(q => ({ ecosystem: q.ecosystem, name: q.name, version: q.version })),
  };
}

function describeSkipped(skipped) {
  return Object.entries(skipped).map(([reason, n]) => `${n} ${reason}`).join(', ');
}

function report(queries, skipped, findings, backported = []) {
  const perEcosystem = {};
  for (const q of queries) perEcosystem[q.ecosystem] = (perEcosystem[q.ecosystem] || 0) + 1;
  console.log(`Looked up ${queries.length} package versions (${Object.entries(perEcosystem).map(([e, n]) => `${e} ${n}`).join(', ')})`);
  if (Object.keys(skipped).length) {
    console.log(`Not (fully) checked: ${describeSkipped(skipped)}`);
  }
  for (const b of backported) {
    console.log(`  Left out ${b.name}@${b.version} ${b.id}: fix ${b.commit.slice(0, 10)} is in ${b.tag} (${b.repo})`);
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
