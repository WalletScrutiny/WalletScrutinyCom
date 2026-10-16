#!/usr/bin/env node
/**
 * Public, per-CVE signals for the advisories the source-analysis export
 * lists, published as _site/api/source-analysis/signals.json for the wallet
 * page's Dependencies panel:
 *
 *   epss  EPSS (Exploit Prediction Scoring System, FIRST): the probability
 *         that the CVE is exploited in the wild within 30 days, and its
 *         percentile among all CVEs. api.first.org, 100 ids per request
 *         (more silently returns nothing).
 *   kev   CISA's Known Exploited Vulnerabilities catalogue: CVEs with
 *         confirmed exploitation, with the date they were added.
 *
 * Both say something about the advisory, nothing about the wallet: they sort
 * the triage queue and put a severity label in perspective, they decide
 * nothing (docs/dependency-check.md, "Triage"). A failing upstream must not
 * fail the site build: the file is then written without that part, or not at
 * all, and the panel shows no signal. ADVISORY_SIGNALS=off skips the step.
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { advisoryIdsOf } from '../src/dependency-triage.mjs';

const SITE_DIR = process.env.SITE_DIR || '_site';
const EXPORT_DIR = join(SITE_DIR, 'api', 'source-analysis');
export const EPSS_URL = 'https://api.first.org/data/v1/epss';
export const KEV_URL = 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json';
const BATCH = 100;
const TIMEOUT_MS = 30_000;

// Every CVE id the export's analysed releases name, as id or alias.
export function collectCves(appsDir) {
  const cves = new Set();
  if (!existsSync(appsDir)) return cves;
  for (const file of readdirSync(appsDir).filter(f => f.endsWith('.json'))) {
    let doc;
    try {
      doc = JSON.parse(readFileSync(join(appsDir, file), 'utf8'));
    } catch {
      continue;
    }
    if (!doc || doc.alias || !Array.isArray(doc.releases)) continue;
    for (const id of advisoryIdsOf(doc.releases)) if (id.startsWith('CVE-')) cves.add(id);
  }
  return cves;
}

async function getJson(url, fetchImpl) {
  const response = await fetchImpl(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response.json();
}

// { "CVE-2023-45133": [0.00525, 0.4322], ... } (probability, percentile), rounded to what the panel shows.
export async function fetchEpss(cves, { fetchImpl = globalThis.fetch, url = EPSS_URL } = {}) {
  const ids = [...cves].sort();
  const epss = {};
  for (let i = 0; i < ids.length; i += BATCH) {
    const batch = ids.slice(i, i + BATCH);
    const body = await getJson(`${url}?cve=${batch.join(',')}&limit=${BATCH}`, fetchImpl);
    for (const row of body?.data || []) {
      const p = Number(row.epss);
      const pct = Number(row.percentile);
      if (row.cve && Number.isFinite(p)) epss[row.cve] = [Number(p.toFixed(5)), Number.isFinite(pct) ? Number(pct.toFixed(3)) : null];
    }
  }
  return { epss, date: null };
}

// { "CVE-2023-4863": { added: "2023-09-13" }, ... } for the CVEs we care about.
export async function fetchKev(cves, { fetchImpl = globalThis.fetch, url = KEV_URL } = {}) {
  const body = await getJson(url, fetchImpl);
  const kev = {};
  for (const v of body?.vulnerabilities || []) {
    if (cves.has(v.cveID)) kev[v.cveID] = { added: v.dateAdded || null };
  }
  return { kev, catalogVersion: body?.catalogVersion || null, catalogSize: body?.count ?? null };
}

export async function buildSignals({ exportDir = EXPORT_DIR, fetchImpl = globalThis.fetch, now = new Date(), log = console } = {}) {
  const cves = collectCves(join(exportDir, 'apps'));
  const result = { cves: cves.size, epss: 0, kev: 0, written: false, failed: [] };
  if (!cves.size) return result;
  const out = { schema: 1, date: now.toISOString().slice(0, 10), cves: cves.size };
  const parts = await Promise.allSettled([fetchEpss(cves, { fetchImpl }), fetchKev(cves, { fetchImpl })]);
  if (parts[0].status === 'fulfilled') {
    out.epss = parts[0].value.epss;
    result.epss = Object.keys(out.epss).length;
  } else {
    result.failed.push(`EPSS: ${parts[0].reason?.message || parts[0].reason}`);
  }
  if (parts[1].status === 'fulfilled') {
    out.kev = parts[1].value.kev;
    out.kevCatalog = { version: parts[1].value.catalogVersion, size: parts[1].value.catalogSize };
    result.kev = Object.keys(out.kev).length;
  } else {
    result.failed.push(`KEV: ${parts[1].reason?.message || parts[1].reason}`);
  }
  for (const f of result.failed) log.warn(`advisory signals: ${f} (the panel shows no such signal in this build)`);
  if (out.epss || out.kev) {
    writeFileSync(join(exportDir, 'signals.json'), JSON.stringify(out));
    result.written = true;
  }
  return result;
}

async function main() {
  if (process.env.ADVISORY_SIGNALS === 'off') {
    console.log('advisory signals: skipped (ADVISORY_SIGNALS=off)');
    return;
  }
  if (!existsSync(join(EXPORT_DIR, 'apps'))) {
    console.log(`advisory signals: no export under ${EXPORT_DIR}, nothing to do`);
    return;
  }
  const r = await buildSignals();
  console.log(`advisory signals: ${r.cves} CVEs, EPSS for ${r.epss}, ${r.kev} on CISA's exploited list${r.written ? ` -> ${join(EXPORT_DIR, 'signals.json')}` : ', nothing written'}`);
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main().catch((err) => {
    // Never fail the site build on a third-party feed.
    console.warn(`advisory signals: ${err.message}`);
  });
}
