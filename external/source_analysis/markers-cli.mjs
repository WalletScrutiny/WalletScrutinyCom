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
//
// Install scripts: npm packages whose shipped version declares a
// preinstall, install or postinstall script, which runs on the machine that
// installs it, the build machine of every wallet that ships it. From the
// registry's version document, cached in npm_install_scripts; listed rarest
// first, since a script in a package twenty wallets use has had more eyes.
// Usage: node markers-cli.mjs [--install-scripts] [--json <out>]   (SOURCE_ANALYSIS_DB_PATH selects the database)
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

const INSTALL_HOOKS = ['preinstall', 'install', 'postinstall'];

// The install hooks of one npm version, `{ hook: command }` (empty when none), or null when the registry did not answer.
export async function npmInstallScripts(name, version, fetchImpl = fetch) {
  const enc = name.startsWith('@') ? `@${encodeURIComponent(name.slice(1))}` : encodeURIComponent(name);
  try {
    const res = await fetchImpl(`https://registry.npmjs.org/${enc}/${encodeURIComponent(version)}`, { signal: AbortSignal.timeout(30_000) });
    if (res.status === 404) return {};
    if (!res.ok) return null;
    const doc = await res.json();
    return Object.fromEntries(INSTALL_HOOKS.filter(h => doc.scripts?.[h]).map(h => [h, doc.scripts[h]]));
  } catch {
    return null;
  }
}

async function installScripts(db, log) {
  db.exec(`CREATE TABLE IF NOT EXISTS npm_install_scripts (name TEXT NOT NULL, version TEXT NOT NULL, scripts TEXT NOT NULL, checked_at DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (name, version))`);
  const todo = db.prepare(`SELECT DISTINCT p.name, p.version FROM packages p JOIN app_dependencies d ON d.package_id = p.id
    WHERE p.ecosystem = 'npm' AND p.version GLOB '[0-9]*' AND p.version NOT LIKE '%use.local%'
    AND NOT EXISTS (SELECT 1 FROM npm_install_scripts s WHERE s.name = p.name AND s.version = p.version)`).all();
  const save = db.prepare('INSERT OR REPLACE INTO npm_install_scripts (name, version, scripts) VALUES (?, ?, ?)');
  log(`install scripts: ${todo.length} npm versions to look up`);
  const queue = [...todo];
  let done = 0;
  const worker = async () => {
    while (queue.length) {
      const { name, version } = queue.shift();
      const scripts = await npmInstallScripts(name, version);
      if (scripts) save.run(name, version, JSON.stringify(scripts));
      if (++done % 1000 === 0) log(`  … ${done} of ${todo.length}`);
    }
  };
  await Promise.all(Array.from({ length: 16 }, worker));
  return db.prepare(`SELECT s.name, s.version, s.scripts, COUNT(DISTINCT d.app_id) AS wallets, GROUP_CONCAT(DISTINCT d.app_id) AS apps,
      GROUP_CONCAT(DISTINCT COALESCE(d.scope, CASE d.dev WHEN 1 THEN 'build' WHEN 0 THEN 'app' END)) AS scopes
    FROM npm_install_scripts s JOIN packages p ON p.ecosystem = 'npm' AND p.name = s.name AND p.version = s.version
    JOIN app_dependencies d ON d.package_id = p.id WHERE s.scripts != '{}' GROUP BY s.name, s.version ORDER BY wallets, s.name`).all()
    .map(r => ({ name: r.name, version: r.version, scripts: JSON.parse(r.scripts), wallets: r.wallets, apps: r.apps.split(','), scopes: r.scopes ? r.scopes.split(',') : [] }));
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
  const argv = minimist(process.argv.slice(2), { string: ['json'], boolean: ['install-scripts'] });
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
  if (argv['install-scripts']) report.installScripts = await installScripts(db, console.error);
  if (argv.json) fs.writeFileSync(argv.json, JSON.stringify(report, null, 1));
  console.log(`${report.lookalikes} lookalike names, ${report.flagged.length} of them obscure on the registry (look here):`);
  for (const f of report.flagged) console.log(`  ${f.ecosystem}:${f.name} (${f.downloads}/week, since ${String(f.created).slice(0, 10)}, ${f.repository || 'no repository'}) looks like ${f.like} (${f.likeWallets} wallets); used by ${f.users.join(', ')}`);
  if (report.installScripts) {
    const s = report.installScripts;
    console.log(`${s.length} npm package versions with install scripts; in one wallet only: ${s.filter(x => x.wallets === 1).length}`);
    for (const x of s.filter(x => x.wallets === 1).slice(0, 40)) console.log(`  ${x.name}@${x.version} [${x.scopes.join('/') || '?'}] ${Object.entries(x.scripts).map(([h, c]) => `${h}: ${c}`).join('; ').slice(0, 140)} (${x.apps[0]})`);
  }
  process.exit(0);
}
