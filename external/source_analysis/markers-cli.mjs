#!/usr/bin/env node
// Malware markers over the database, the "look here" scanner of
// docs/dependency-check.md ("Checking the shipped app"). A hit is a reason
// for a person to look, never a verdict.
//
// Name lookalikes (typosquats): a package one edit away from a name that
// three or more of the checked wallets use (`bitcoinjs-lb` next to
// `bitcoinjs-lib`), itself used by at most two, that the registry shows as
// obscure (npm: fewer than 10,000 downloads last week). Most lookalikes are
// old, legitimate packages (`table` / `stable`); the download count is what
// separates them, and the registry's creation date and repository are
// printed for the person who looks.
// Usage: node markers-cli.mjs [--json <out>]   (SOURCE_ANALYSIS_DB_PATH selects the database)
import fs from 'node:fs';
import minimist from 'minimist';
import { initDatabase } from './ddbbUtils.mjs';

const POPULAR_MIN_WALLETS = 3;
const SUSPECT_MAX_WALLETS = 2;
const OBSCURE_WEEKLY_DOWNLOADS = 10_000;

// Edit distance with transpositions (optimal string alignment), stopping early past 1.
export function editDistance(a, b) {
  if (Math.abs(a.length - b.length) > 1) return 2;
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
}

/**
 * Lookalike pairs among `names` (Map name -> number of wallets using it):
 * `[{ name, wallets, like, likeWallets }]`. Same npm scope only; short names
 * and plural/singular pairs are left out.
 */
export function lookalikes(names) {
  const popular = [...names].filter(([, k]) => k >= POPULAR_MIN_WALLETS).map(([n]) => n);
  const out = [];
  for (const [name, wallets] of names) {
    if (wallets > SUSPECT_MAX_WALLETS) continue;
    const scope = name.includes('/') ? name.slice(0, name.lastIndexOf('/')) : '';
    const base = name.slice(name.lastIndexOf('/') + 1).toLowerCase();
    if (base.length < 5) continue;
    for (const p of popular) {
      if (p === name) continue;
      const pScope = p.includes('/') ? p.slice(0, p.lastIndexOf('/')) : '';
      const pBase = p.slice(p.lastIndexOf('/') + 1).toLowerCase();
      if (scope !== pScope || pBase === base) continue; // case-only differences are the same package (PyPI)
      if (base.replace(/s$/, '') === pBase.replace(/s$/, '')) continue;
      if (base.replace(/[-_.]/g, '') === pBase.replace(/[-_.]/g, '')) continue; // separator spelling
      if (editDistance(base, pBase) === 1) out.push({ name, wallets, like: p, likeWallets: names.get(p) });
    }
  }
  return out;
}

async function npmFacts(name, fetchImpl = fetch) {
  const enc = name.startsWith('@') ? `@${encodeURIComponent(name.slice(1))}` : encodeURIComponent(name);
  const [dl, meta] = await Promise.all([
    fetchImpl(`https://api.npmjs.org/downloads/point/last-week/${enc}`).then(r => (r.ok ? r.json() : null), () => null),
    fetchImpl(`https://registry.npmjs.org/${enc}`).then(r => (r.ok ? r.json() : null), () => null),
  ]);
  const latest = meta?.['dist-tags']?.latest;
  const repo = meta?.versions?.[latest]?.repository;
  return { downloads: dl?.downloads ?? null, created: meta?.time?.created || null, repository: typeof repo === 'string' ? repo : repo?.url || null };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const argv = minimist(process.argv.slice(2), { string: ['json'] });
  const db = initDatabase();
  const rows = db.prepare(`SELECT p.ecosystem, p.name, COUNT(DISTINCT d.app_id) AS wallets FROM app_dependencies d JOIN packages p ON p.id = d.package_id GROUP BY p.ecosystem, p.name`).all();
  const byEco = new Map();
  for (const r of rows) {
    if (!byEco.has(r.ecosystem)) byEco.set(r.ecosystem, new Map());
    byEco.get(r.ecosystem).set(r.name, r.wallets);
  }
  const report = { lookalikes: 0, checked: [], flagged: [] };
  for (const [eco, names] of byEco) {
    for (const hit of lookalikes(names)) {
      report.lookalikes++;
      const facts = eco === 'npm' ? await npmFacts(hit.name) : {};
      const users = db.prepare(`SELECT DISTINCT d.app_id FROM app_dependencies d JOIN packages p ON p.id = d.package_id WHERE p.ecosystem = ? AND p.name = ?`).all(eco, hit.name).map(r => r.app_id);
      const entry = { ecosystem: eco, ...hit, ...facts, users };
      const obscure = eco === 'npm' && facts.downloads != null && facts.downloads < OBSCURE_WEEKLY_DOWNLOADS;
      (obscure ? report.flagged : report.checked).push(entry);
    }
  }
  if (argv.json) fs.writeFileSync(argv.json, JSON.stringify(report, null, 1));
  console.log(`${report.lookalikes} lookalike names, ${report.flagged.length} of them obscure on the registry (look here):`);
  for (const f of report.flagged) console.log(`  ${f.ecosystem}:${f.name} (${f.downloads}/week, since ${String(f.created).slice(0, 10)}, ${f.repository || 'no repository'}) looks like ${f.like} (${f.likeWallets} wallets); used by ${f.users.join(', ')}`);
  process.exit(0);
}
