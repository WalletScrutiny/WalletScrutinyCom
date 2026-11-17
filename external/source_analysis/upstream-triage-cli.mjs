#!/usr/bin/env node
// Upstream triage harvest over the database (upstreamTriage.mjs): read the
// scanner ignore lists and VEX documents of every analysed wallet at its
// analysed tag, and of every direct user (a package a wallet imports itself,
// or one named as a package's `dependants`) at the tag or commit the
// identity check found for the shipped version. Then count how many wallet
// advisory rows an upstream entry speaks to.
// Usage: [GITHUB_TOKEN=…] node upstream-triage-cli.mjs [--all] [--limit N] [--report-only] [--export <dir>]
//   (--export writes the per-wallet hints for the panel to <dir>/upstream/<appId>.json)
//   (with a token, GitHub repositories are read through the GraphQL API, 5 refs a query)
//   (SOURCE_ANALYSIS_DB_PATH selects the database; --all re-reads refs already checked,
//   a ref whose read failed is always read again)
import minimist from 'minimist';
import { initDatabase, dependantsOfRow } from './ddbbUtils.mjs';
import { harvestRepo, harvestGithub, isGithub } from './upstreamTriage.mjs';
import { writeUpstreamHints } from './export.mjs';

const CONCURRENCY = 8;

// Every (repo, ref) to read: the wallets' own, then their direct users'.
export function harvestTargets(db) {
  const targets = new Map();
  const add = (repo, ref, who) => {
    if (!repo || !ref) return;
    const key = `${repo}\0${ref}`;
    if (!targets.has(key)) targets.set(key, { repo, ref, who: new Set() });
    targets.get(key).who.add(who);
  };
  for (const r of db.prepare(`SELECT a.app_id, ap.repository, a.ref FROM analyses a JOIN apps ap ON ap.app_id = a.app_id WHERE a.kind = 'release' AND a.status = 'ok'`).all()) {
    add(r.repository.replace(/\.git$/, ''), r.ref, `app:${r.app_id}`);
  }
  const rows = db.prepare(`
    SELECT d.app_id, d.version AS app_version, d.direct, d.dependants, p.ecosystem, p.name, p.version
    FROM app_dependencies d JOIN packages p ON p.id = d.package_id
  `).all();
  // a package named as someone's dependant, at the version this wallet ships it
  const dependantNames = new Set();
  for (const r of rows) for (const d of dependantsOfRow(r.dependants) || []) dependantNames.add(`${r.app_id}\0${r.app_version}\0${r.ecosystem}:${d}`);
  const repoOf = db.prepare(`SELECT repo_url FROM package_sources WHERE ecosystem = ? AND name = ? AND repo_url IS NOT NULL`);
  const refOf = db.prepare(`SELECT COALESCE(tag, commit_sha) AS ref FROM package_identity WHERE ecosystem = ? AND name = ? AND version = ?`);
  for (const r of rows) {
    if (!(r.direct === 1 || dependantNames.has(`${r.app_id}\0${r.app_version}\0${r.ecosystem}:${r.name}`))) continue;
    const repo = repoOf.get(r.ecosystem, r.name)?.repo_url;
    const ref = refOf.get(r.ecosystem, r.name, r.version)?.ref;
    add(repo, ref, `pkg:${r.ecosystem}:${r.name}@${r.version}`);
  }
  return [...targets.values()];
}

export async function harvest(db, { all = false, limit = Infinity, log = () => {}, fetchImpl = fetch, token = null } = {}) {
  const done = new Set(all ? [] : db.prepare("SELECT repo_url, ref FROM upstream_triage_checked WHERE status != 'error'").all().map(r => `${r.repo_url}\0${r.ref}`));
  const queue = harvestTargets(db).filter(t => !done.has(`${t.repo}\0${t.ref}`)).slice(0, limit);
  const saveChecked = db.prepare(`INSERT OR REPLACE INTO upstream_triage_checked (repo_url, ref, status, error, files, checked_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`);
  const clear = db.prepare('DELETE FROM upstream_triage WHERE repo_url = ? AND ref = ?');
  const saveEntry = db.prepare(`INSERT OR REPLACE INTO upstream_triage (repo_url, ref, file, tool, line, vuln_id, reason) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  const stats = { targets: queue.length, read: 0, withFiles: 0, entries: 0, byStatus: {} };
  const record = (t, r) => {
    db.transaction(() => {
      clear.run(t.repo, t.ref);
      saveChecked.run(t.repo, t.ref, r.status, r.error || null, JSON.stringify(r.files.map(f => f.path)));
      for (const f of r.files) for (const e of f.entries) saveEntry.run(t.repo, t.ref, f.path, f.tool, e.line, e.id, e.reason);
    })();
    stats.read++;
    stats.byStatus[r.status] = (stats.byStatus[r.status] || 0) + 1;
    if (r.files.length) stats.withFiles++;
    stats.entries += r.files.reduce((n, f) => n + f.entries.length, 0);
    if (r.files.length) log(`${t.repo}@${t.ref}: ${r.files.map(f => `${f.path} (${f.entries.length})`).join(', ')}`);
    if (stats.read % 250 === 0) log(`… ${stats.read} of ${stats.targets}`);
  };
  // GitHub through the GraphQL API when there is a token, everything else raw
  const github = token ? queue.filter(t => isGithub(t.repo)) : [];
  const rest = token ? queue.filter(t => !isGithub(t.repo)) : queue;
  const ghQueue = [];
  for (let i = 0; i < github.length; i += 25) ghQueue.push(github.slice(i, i + 25));
  const ghWorker = async () => {
    while (ghQueue.length) {
      const chunk = ghQueue.shift();
      const results = await harvestGithub(chunk, { token, fetchImpl });
      for (const t of chunk) record(t, results.get(`${t.repo}\0${t.ref}`));
    }
  };
  const worker = async () => {
    while (rest.length) {
      const t = rest.shift();
      record(t, await harvestRepo(t.repo, t.ref, { fetchImpl }));
    }
  };
  await Promise.all([...Array.from({ length: 4 }, ghWorker), ...Array.from({ length: CONCURRENCY }, worker)]);
  return stats;
}

/**
 * What the harvest found and what it speaks to: per tool, how many refs carry
 * a file; and how many wallet advisory rows have an entry for the same
 * advisory (id or alias) in the wallet's own files (`own`) or in the files of
 * a direct user the wallet ships (`upstream`).
 */
export function report(db) {
  const targets = harvestTargets(db);
  const checked = new Map(db.prepare('SELECT repo_url, ref, status, files FROM upstream_triage_checked').all().map(r => [`${r.repo_url}\0${r.ref}`, r]));
  const entries = db.prepare('SELECT repo_url, ref, file, tool, line, vuln_id, reason FROM upstream_triage').all();
  const byRef = new Map();
  for (const e of entries) {
    const k = `${e.repo_url}\0${e.ref}`;
    if (!byRef.has(k)) byRef.set(k, []);
    byRef.get(k).push(e);
  }
  const out = { wallets: { refs: 0, checked: 0, withFiles: 0, withEntries: 0 }, packages: { refs: 0, checked: 0, withFiles: 0, withEntries: 0 }, files: {}, entries: entries.length, withReason: entries.filter(e => e.reason).length, rows: { total: 0, own: 0, upstream: 0, either: 0 }, examples: [] };
  // who reads which (repo, ref)
  const ownRefs = new Map(); // appId -> keys
  const pkgRefs = new Map(); // eco:name@version -> keys
  for (const t of targets) {
    const k = `${t.repo}\0${t.ref}`;
    const isApp = [...t.who].some(w => w.startsWith('app:'));
    const bucket = isApp ? out.wallets : out.packages;
    bucket.refs++;
    const c = checked.get(k);
    if (c) {
      bucket.checked++;
      const files = JSON.parse(c.files);
      if (files.length) bucket.withFiles++;
      for (const f of files) out.files[f] = (out.files[f] || 0) + 1;
      if (byRef.has(k)) bucket.withEntries++;
    }
    for (const w of t.who) {
      const [kind, id] = [w.slice(0, 3), w.slice(4)];
      const map = kind === 'app' ? ownRefs : pkgRefs;
      if (!map.has(id)) map.set(id, []);
      map.get(id).push(k);
    }
  }
  const idsAt = (keys) => {
    const s = new Map();
    for (const k of keys || []) for (const e of byRef.get(k) || []) s.set(e.vuln_id, e);
    return s;
  };
  // the direct users each wallet release ships
  const shipped = new Map();
  for (const r of db.prepare(`SELECT d.app_id, d.version, p.ecosystem, p.name, p.version AS v FROM app_dependencies d JOIN packages p ON p.id = d.package_id`).all()) {
    const key = `${r.ecosystem}:${r.name}@${r.v}`;
    if (!pkgRefs.has(key)) continue;
    const k = `${r.app_id}\0${r.version}`;
    if (!shipped.has(k)) shipped.set(k, new Set());
    shipped.get(k).add(key);
  }
  const vulns = db.prepare(`SELECT v.app_id, v.version, v.name, v.dep_version, v.vuln_id, v.aliases FROM app_vulnerabilities v
    JOIN analyses a ON a.app_id = v.app_id AND a.ref = v.version AND a.kind = 'release' AND a.status = 'ok'`).all();
  const upstreamCache = new Map();
  for (const v of vulns) {
    out.rows.total++;
    const ids = [v.vuln_id, ...String(v.aliases || '').split(/[,\s]+/).filter(Boolean)];
    const own = idsAt(ownRefs.get(v.app_id));
    const k = `${v.app_id}\0${v.version}`;
    if (!upstreamCache.has(k)) upstreamCache.set(k, idsAt([...(shipped.get(k) || [])].flatMap(p => pkgRefs.get(p) || [])));
    const up = upstreamCache.get(k);
    const hitOwn = ids.find(id => own.has(id));
    const hitUp = ids.find(id => up.has(id));
    if (hitOwn) out.rows.own++;
    if (hitUp) out.rows.upstream++;
    if (hitOwn || hitUp) out.rows.either++;
    if (hitUp && out.examples.length < 15) {
      const e = up.get(hitUp);
      out.examples.push({ app: v.app_id, package: `${v.name}@${v.dep_version}`, advisory: hitUp, from: `${e.repo_url}@${e.ref} ${e.file}:${e.line}`, reason: e.reason });
    }
  }
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const argv = minimist(process.argv.slice(2), { boolean: ['all', 'report-only'] });
  const db = initDatabase();
  if (!argv['report-only']) {
    const stats = await harvest(db, { all: argv.all, limit: argv.limit ? Number(argv.limit) : Infinity, log: console.error, token: process.env.GITHUB_TOKEN || null });
    console.error(JSON.stringify(stats));
  }
  console.log(JSON.stringify(report(db), null, 2));
  if (argv.export) console.error(`hints: ${JSON.stringify(writeUpstreamHints(db, argv.export))} -> ${argv.export}/upstream`);
  process.exit(0);
}
