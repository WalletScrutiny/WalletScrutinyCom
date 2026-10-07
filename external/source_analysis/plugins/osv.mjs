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
 */
import { SHOW_ONLY_FIRST_X_ALERTS } from '../config.mjs';

export const OSV_API = 'https://api.osv.dev/v1';
const BATCH_SIZE = 1000; // querybatch limit
const DETAIL_CONCURRENCY = 8;
const REQUEST_TIMEOUT_MS = 30000;
const RETRIES = 2;

// test 7 ecosystem -> OSV ecosystem
const OSV_ECOSYSTEMS = { npm: 'npm', pip: 'PyPI', gradle: 'Maven', cargo: 'crates.io' };
const UNCHECKABLE_TIERS = new Set(['floating', 'unversioned', 'source-ref-pinned']);
const SEVERITY_ORDER = ['malicious', 'critical', 'high', 'moderate', 'low', 'unknown'];

/**
 * Why a dependency row cannot be looked up, or null when it can. A version
 * must look like a release number: test 7 also records ranges (`^1.2.0`) and
 * placeholders, which OSV would answer with "no advisories" and so read as
 * clean.
 */
export function uncheckableReason(entry) {
  if (!OSV_ECOSYSTEMS[entry.ecosystem]) return 'ecosystem';
  // A floating gradle declaration that gradle resolved (plugins/gradle-resolution.mjs)
  // carries the version gradle picked; an unresolved one still has its range
  // (`1.+`, `[1.0,2.0)`, `latest.release`), which the version check below and
  // the `+` check here reject.
  const resolvedFloating = entry.tier === 'floating' && entry.ecosystem === 'gradle' && !(entry.version || '').includes('+');
  if (UNCHECKABLE_TIERS.has(entry.tier) && !resolvedFloating) return entry.tier;
  const resolved = entry.resolved || '';
  if (/^(git\+|git:|github:|file:|link:|portal:|workspace:|patch:)/.test(resolved)) return 'git-or-path';
  // an npm registry tarball is `<registry>/<name>/-/<name>-<version>.tgz`; any other URL is a tarball from elsewhere
  if (/^https?:/.test(resolved) && !/\/-\/|registry/.test(resolved)) return 'git-or-path';
  if (!/^\d[0-9A-Za-z.+_-]*$/.test(entry.version || '')) return 'no-exact-version';
  return null;
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
      const key = `${entry.ecosystem}\u0000${entry.name}\u0000${entry.version}`;
      if (!queries.has(key)) queries.set(key, { ecosystem: entry.ecosystem, name: entry.name, version: entry.version, rows: [] });
      queries.get(key).rows.push(entry);
    }
  }
  return { queries: [...queries.values()], skipped };
}

async function request(fetchImpl, url, body = null) {
  let lastError;
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    try {
      const response = await fetchImpl(url, {
        method: body ? 'POST' : 'GET',
        headers: body ? { 'content-type': 'application/json' } : {},
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

const toOsvQuery = (q, pageToken) => ({
  package: { ecosystem: OSV_ECOSYSTEMS[q.ecosystem], name: q.name },
  version: q.version,
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
function fixedVersions(advisory, q) {
  const fixed = new Set();
  for (const affected of advisory.affected || []) {
    if (affected.package?.ecosystem !== OSV_ECOSYSTEMS[q.ecosystem]) continue;
    if (String(affected.package?.name).toLowerCase() !== q.name.toLowerCase()) continue;
    for (const range of affected.ranges || []) {
      for (const event of range.events || []) if (event.fixed) fixed.add(event.fixed);
    }
  }
  return [...fixed];
}

/**
 * One finding per advisory, per package version. OSV often returns the same
 * issue twice (a GHSA and the RUSTSEC or PYSEC record it aliases); those are
 * folded into one finding, keeping the record that carries a severity.
 */
function findingsFor(q, ids, details) {
  const advisories = ids.map(id => details.get(id)).filter(Boolean);
  // most severe first; on a tie the record with GitHub's reviewed label, so the
  // kept id does not depend on the order OSV listed them in
  const labelled = (a) => (a.database_specific?.severity ? 0 : 1);
  advisories.sort((x, y) => SEVERITY_ORDER.indexOf(severityOf(x)) - SEVERITY_ORDER.indexOf(severityOf(y)) ||
    labelled(x) - labelled(y) || x.id.localeCompare(y.id));
  const seen = new Set();
  const findings = [];
  for (const advisory of advisories) {
    const names = [advisory.id, ...(advisory.aliases || [])];
    if (names.some(n => seen.has(n))) {
      for (const n of names) seen.add(n);
      continue;
    }
    for (const n of names) seen.add(n);
    findings.push({
      ecosystem: q.ecosystem,
      name: q.name,
      version: q.version,
      id: advisory.id,
      aliases: advisory.aliases || [],
      severity: severityOf(advisory),
      summary: advisory.summary || (advisory.details || '').split('\n')[0].slice(0, 200),
      fixed: fixedVersions(advisory, q),
      direct: q.rows.some(r => r.direct === true) ? true : (q.rows.some(r => r.direct === false) ? false : null),
      dev: q.rows.every(r => r.dev === true) ? true : (q.rows.some(r => r.dev === false) ? false : null),
      lockfiles: [...new Set(q.rows.map(r => r.lockfile))],
    });
  }
  return findings;
}

/**
 * Look up every checkable dependency of the given pinning analyses.
 * Resolves to { checked, skipped, findings } (findings ordered most severe
 * first), or null when OSV.dev could not be reached: a failed lookup is not a
 * clean result.
 */
export async function checkVulnerabilities(analyses, { fetchImpl = globalThis.fetch } = {}) {
  console.log('\n--- Test 10: Known vulnerabilities (OSV.dev, from the resolved dependencies) ---');
  const { queries, skipped } = buildQueries(analyses);
  const skippedTotal = Object.values(skipped).reduce((a, b) => a + b, 0);
  if (!queries.length) {
    console.log(`No dependency with an exact registry version to look up${skippedTotal ? ` (${describeSkipped(skipped)})` : ''}.`);
    return { checked: 0, skipped, findings: [] };
  }

  let findings;
  try {
    const ids = await queryIds(queries, fetchImpl);
    const details = await fetchDetails(ids.flat(), fetchImpl);
    findings = queries.flatMap((q, i) => findingsFor(q, ids[i], details));
  } catch (error) {
    console.log(`OSV.dev lookup failed: ${error.message}. No vulnerability result for this run.`);
    return null;
  }
  findings.sort((x, y) => SEVERITY_ORDER.indexOf(x.severity) - SEVERITY_ORDER.indexOf(y.severity) ||
    x.ecosystem.localeCompare(y.ecosystem) || x.name.localeCompare(y.name));

  report(queries, skipped, findings);
  return { checked: queries.length, skipped, findings };
}

function describeSkipped(skipped) {
  return Object.entries(skipped).map(([reason, n]) => `${n} ${reason}`).join(', ');
}

function report(queries, skipped, findings) {
  const perEcosystem = {};
  for (const q of queries) perEcosystem[q.ecosystem] = (perEcosystem[q.ecosystem] || 0) + 1;
  console.log(`Looked up ${queries.length} package versions (${Object.entries(perEcosystem).map(([e, n]) => `${e} ${n}`).join(', ')})`);
  if (Object.keys(skipped).length) {
    console.log(`Not checkable (no exact registry version): ${describeSkipped(skipped)}`);
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
// release (app_vulnerabilities).
export default {
  description: 'Test 10: known vulnerabilities (OSV.dev)',
  requires: ['pinning'],
  async host({ name, version, db, results }) {
    const vulnerabilities = await checkVulnerabilities(results.pinning || []);
    if (!vulnerabilities) throw new Error('the OSV.dev lookup failed');
    if (db && version) {
      const { saveVulnerabilities } = await import('../ddbbUtils.mjs');
      const stored = saveVulnerabilities(db, name, version, vulnerabilities);
      console.log(`Stored ${stored} vulnerability rows for ${name} ${version}`);
    }
    return vulnerabilities;
  },
};
