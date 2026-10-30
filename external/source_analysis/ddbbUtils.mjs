import Database from 'better-sqlite3';
import { existsSync, mkdirSync, copyFileSync, readdirSync, unlinkSync } from 'fs';
import { DB_PATH, BACKUP_DIR, BACKUPS_TO_KEEP } from './config.mjs';
import { join, dirname } from 'path';

// Backup database before processing. Keeps the newest `keep` copies.
export function backupDatabase(dbPath = DB_PATH, backupDir = BACKUP_DIR, keep = BACKUPS_TO_KEEP) {
  // Ensure backup directory exists
  if (!existsSync(backupDir)) {
    mkdirSync(backupDir, { recursive: true });
  }

  // Check if database file exists
  if (!existsSync(dbPath)) {
    console.log('Database file does not exist yet, skipping backup');
    return;
  }

  // Generate timestamp for backup filename
  const now = new Date();
  const timestamp = now.toISOString()
    .replace(/T/, '_')
    .replace(/:/g, '-')
    .replace(/\..+/, '');

  const backupFilename = `assets_${timestamp}.db`;
  const backupPath = join(backupDir, backupFilename);

  try {
    copyFileSync(dbPath, backupPath);
  } catch (error) {
    console.error(`Failed to create database backup: ${error.message}`);
    throw error;
  }

  // The timestamp sorts lexically, so the oldest copies come first
  const old = readdirSync(backupDir)
    .filter(f => /^assets_.*\.db$/.test(f))
    .sort()
    .slice(0, -keep);
  for (const f of old) {
    unlinkSync(join(backupDir, f));
  }
}

// Initialize database
export function initDatabase(dbPath = DB_PATH) {
  if (dbPath !== ':memory:') {
    mkdirSync(dirname(dbPath), { recursive: true });
  }
  const db = new Database(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      app_id TEXT NOT NULL,
      source TEXT NOT NULL,
      version TEXT NOT NULL,
      architecture TEXT,
      os TEXT,
      asset_name TEXT NOT NULL,
      size INTEGER,
      sha256 TEXT NOT NULL,
      published_at DATETIME,
      author_id TEXT,
      author_login TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create new unique index with architecture and os
  db.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_asset ON assets(
      app_id, version, asset_name, source, architecture, os
    );
    
    CREATE INDEX IF NOT EXISTS idx_app_version ON assets(app_id, version);
    CREATE INDEX IF NOT EXISTS idx_app_asset ON assets(app_id, asset_name);
    CREATE INDEX IF NOT EXISTS idx_architecture ON assets(architecture);
    CREATE INDEX IF NOT EXISTS idx_os ON assets(os);
  `);

  // Resolved dependencies per (app_id, version), from lockfiles only.
  // `packages` holds one row per unique (ecosystem, name, version, resolved,
  // integrity) so consecutive releases, which share almost all of their
  // packages, add join rows rather than package rows.
  db.exec(`
    CREATE TABLE IF NOT EXISTS packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ecosystem TEXT NOT NULL,
      name TEXT NOT NULL,
      version TEXT NOT NULL DEFAULT '',
      resolved TEXT NOT NULL DEFAULT '',
      integrity TEXT NOT NULL DEFAULT ''
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_package ON packages(ecosystem, name, version, resolved, integrity);
    CREATE INDEX IF NOT EXISTS idx_package_name ON packages(ecosystem, name);

    CREATE TABLE IF NOT EXISTS app_dependencies (
      app_id TEXT NOT NULL,
      version TEXT NOT NULL,
      package_id INTEGER NOT NULL REFERENCES packages(id),
      lockfile TEXT NOT NULL,
      direct INTEGER,
      dev INTEGER,
      tier TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (app_id, version, package_id, lockfile)
    );
    CREATE INDEX IF NOT EXISTS idx_app_dependencies_package ON app_dependencies(package_id);
  `);

  // Known vulnerabilities of a release's dependencies as OSV.dev reported them
  // when the release was analysed (plugins/osv.mjs), one row per advisory and
  // package version. A snapshot: advisories published later show up through
  // findAppsShipping, not here.
  db.exec(`
    CREATE TABLE IF NOT EXISTS app_vulnerabilities (
      app_id TEXT NOT NULL,
      version TEXT NOT NULL,
      ecosystem TEXT NOT NULL,
      name TEXT NOT NULL,
      dep_version TEXT NOT NULL,
      vuln_id TEXT NOT NULL,
      severity TEXT NOT NULL,
      aliases TEXT NOT NULL DEFAULT '',
      fixed TEXT NOT NULL DEFAULT '',
      summary TEXT NOT NULL DEFAULT '',
      direct INTEGER,
      dev INTEGER,
      checked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (app_id, version, ecosystem, name, dep_version, vuln_id)
    );
    CREATE INDEX IF NOT EXISTS idx_app_vulnerabilities_vuln ON app_vulnerabilities(vuln_id);
  `);
  // Columns added after the tables existed on the server; CREATE TABLE IF NOT
  // EXISTS leaves an existing table alone, so add them one by one when missing.
  // `scope` is where a package ends up: app, build, tests, or NULL (not said).
  for (const table of ['app_dependencies', 'app_vulnerabilities']) ensureColumn(db, table, 'scope', 'TEXT');
  // `dependants` is the JSON list of package names that require this one, one
  // hop up (plugins/pinning.mjs makeEntry); NULL when the lockfile has no graph.
  for (const table of ['app_dependencies', 'app_vulnerabilities']) ensureColumn(db, table, 'dependants', 'TEXT');
  // `affected` is the JSON list of the advisory's affected ranges for this
  // package ("< 1.2.3"); NULL on rows stored before the column, until the next recheck.
  ensureColumn(db, 'app_vulnerabilities', 'affected', 'TEXT');

  // Where a package's source lives, per (ecosystem, name): resolved from the
  // registry metadata (sourceRepos.mjs) and cached, since it does not
  // change per version. repo_url NULL = looked up, none named.
  db.exec(`
    CREATE TABLE IF NOT EXISTS package_sources (
      ecosystem TEXT NOT NULL,
      name TEXT NOT NULL,
      repo_url TEXT,
      source TEXT NOT NULL,
      note TEXT,
      checked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (ecosystem, name)
    );
  `);

  // Rung one of the dependency ladder (sourceIdentity.mjs): does the
  // shipped version exist in the package's source repository?
  db.exec(`
    CREATE TABLE IF NOT EXISTS package_identity (
      ecosystem TEXT NOT NULL,
      name TEXT NOT NULL,
      version TEXT NOT NULL,
      status TEXT NOT NULL,
      tag TEXT,
      commit_sha TEXT,
      provenance INTEGER,
      checked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (ecosystem, name, version)
    );
  `);

  // Upstream triage (upstreamTriage.mjs): the scanner ignore lists and VEX
  // documents found in a repository at one ref, one row per advisory entry;
  // upstream_triage_checked records every (repo, ref) read, with or without files.
  db.exec(`
    CREATE TABLE IF NOT EXISTS upstream_triage_checked (
      repo_url TEXT NOT NULL,
      ref TEXT NOT NULL,
      status TEXT NOT NULL,            -- ok | unsupported-host | error
      error TEXT,
      files TEXT NOT NULL DEFAULT '[]', -- JSON array of the triage files present
      checked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (repo_url, ref)
    );
    CREATE TABLE IF NOT EXISTS upstream_triage (
      repo_url TEXT NOT NULL,
      ref TEXT NOT NULL,
      file TEXT NOT NULL,
      tool TEXT NOT NULL,
      line INTEGER NOT NULL,
      vuln_id TEXT NOT NULL,
      reason TEXT,
      PRIMARY KEY (repo_url, ref, file, line, vuln_id)
    );
  `);

  // Last good copy of the site's app list (see appList.mjs), one row per
  // wallet record with a repository.
  db.exec(`
    CREATE TABLE IF NOT EXISTS apps (
      app_id TEXT NOT NULL,
      platform TEXT NOT NULL,
      repository TEXT NOT NULL,
      fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (app_id, platform)
    );
  `);
  ensureColumn(db, 'apps', 'gone', 'INTEGER NOT NULL DEFAULT 0');

  // The day a release was tagged, for refs without a dated GitHub release asset
  // (releaseDates.mjs): the date of the commit the tag points at. released_at is
  // null when the forge does not know the ref; neither changes, so each is asked once.
  db.exec(`
    CREATE TABLE IF NOT EXISTS release_dates (
      app_id TEXT NOT NULL,
      ref TEXT NOT NULL,
      released_at TEXT,
      checked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (app_id, ref)
    );
  `);

  // Gone wallets past their end of life (index.mjs, GONE_EOL_YEARS), as of the
  // last pass: neither analysed nor exported.
  db.exec(`
    CREATE TABLE IF NOT EXISTS end_of_life (
      app_id TEXT PRIMARY KEY,
      last_commit_at DATETIME NOT NULL
    );
  `);

  // Last good copy of the build verifications that put a wallet in scope
  // (see reproducible.mjs): every version some verifier found reproducible.
  db.exec(`
    CREATE TABLE IF NOT EXISTS reproducible_versions (
      app_id TEXT NOT NULL,
      version TEXT NOT NULL,
      verified_at INTEGER NOT NULL,    -- created_at of the newest reproducible verification
      platform TEXT,                   -- its platform tag (android, iphone, hardware, windows, ...)
      PRIMARY KEY (app_id, version)
    );
  `);

  // Which release analysis is the check of a verified version: the tag the
  // pass resolved the version to.
  db.exec(`
    CREATE TABLE IF NOT EXISTS verified_refs (
      app_id TEXT NOT NULL,
      ref TEXT NOT NULL,
      version TEXT NOT NULL,
      PRIMARY KEY (app_id, ref)
    );
  `);

  // Commit of the default branch the last successful analysis looked at, so a
  // pass skips repositories whose default branch has not moved since.
  db.exec(`
    CREATE TABLE IF NOT EXISTS default_branch_analyses (
      app_id TEXT PRIMARY KEY,
      commit_sha TEXT NOT NULL,
      analysed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // One row per analysis the service ran: what was looked at (commit, ref,
  // kind), by which analyser, with which outcome, and what it saw (ecosystem,
  // lockfiles, dependency and OSV counts). The dependency and vulnerability
  // tables only hold rows for releases that produced some; this table is what
  // says "analysed, nothing found", "failed" or "not supported", and when.
  db.exec(`
    CREATE TABLE IF NOT EXISTS analyses (
      app_id TEXT NOT NULL,
      kind TEXT NOT NULL,              -- release | default-branch | verified-no-tag
      ref TEXT NOT NULL,               -- release tag, or the branch's commit for default-branch runs
      commit_sha TEXT,
      status TEXT NOT NULL,            -- ok | failed | unsupported
      error TEXT,
      app_type TEXT,
      analyser TEXT NOT NULL,
      plugins TEXT NOT NULL DEFAULT '',          -- space-separated plugin names that ran
      lockfiles TEXT NOT NULL DEFAULT '',        -- JSON array of lockfile paths the pinning step read
      dependencies INTEGER,
      osv_checked INTEGER,
      osv_skipped TEXT NOT NULL DEFAULT '{}',    -- JSON {reason: count}
      vulnerabilities INTEGER,
      lock_coverage TEXT,                        -- JSON plugins/lock-coverage.mjs result, NULL when it did not run
      analysed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (app_id, kind, ref)
    );
  `);
  ensureColumn(db, 'analyses', 'lock_coverage', 'TEXT');

  // The git submodules of an analysed release with their three claims
  // (submoduleIdentity.mjs), as the walk returned them; one row per release.
  db.exec(`
    CREATE TABLE IF NOT EXISTS release_submodules (
      app_id TEXT NOT NULL,
      ref TEXT NOT NULL,
      commit_sha TEXT NOT NULL,
      rows TEXT NOT NULL,              -- JSON array, one entry per submodule, nested ones included
      checked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (app_id, ref)
    );
  `);
  // Releases stored before this table existed get a row from what the
  // dependency rows remember (their creation time and count); commit and
  // lockfiles stay unknown until the release is analysed again.
  db.exec(`
    INSERT OR IGNORE INTO analyses (app_id, kind, ref, status, analyser, dependencies, vulnerabilities, analysed_at)
    SELECT d.app_id, 'release', d.version, 'ok', 'before-analyses-table', COUNT(*),
           (SELECT COUNT(*) FROM app_vulnerabilities v WHERE v.app_id = d.app_id AND v.version = d.version),
           MIN(d.created_at)
    FROM app_dependencies d GROUP BY d.app_id, d.version;
  `);

  // Wallets marked for a rerun (reanalyse-cli.mjs): the next pass analyses
  // each one as --reanalyse would, then removes its mark.
  db.exec(`
    CREATE TABLE IF NOT EXISTS reanalyse_requests (
      app_id TEXT PRIMARY KEY,
      requested_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return db;
}

// Store the outcome of one analysis (see appAnalysis.runSourceCodeAnalysis);
// a repeat of the same (appId, kind, ref) replaces the earlier row.
export function recordAnalysis(db, { appId, kind, ref, commit = null, status, error = null, appType = null,
  analyser, plugins = [], lockfiles = [], dependencies = null, osvChecked = null, osvSkipped = {}, vulnerabilities = null, lockCoverage = null }) {
  db.prepare(`
    INSERT OR REPLACE INTO analyses
      (app_id, kind, ref, commit_sha, status, error, app_type, analyser, plugins, lockfiles,
       dependencies, osv_checked, osv_skipped, vulnerabilities, lock_coverage, analysed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `).run(appId, kind, ref, commit, status, error, appType, analyser, plugins.join(' '), JSON.stringify(lockfiles),
    dependencies, osvChecked, JSON.stringify(osvSkipped), vulnerabilities, lockCoverage ? JSON.stringify(lockCoverage) : null);
}

// Every recorded analysis of an app, newest first, JSON columns decoded.
export function getAnalyses(db, appId) {
  return db.prepare('SELECT * FROM analyses WHERE app_id = ? ORDER BY analysed_at DESC, ref').all(appId).map(decodeAnalysis);
}

// The apps with at least one recorded analysis.
export function listAnalysedApps(db) {
  return db.prepare('SELECT DISTINCT app_id FROM analyses ORDER BY app_id').all().map(r => r.app_id);
}

function decodeAnalysis(row) {
  return {
    ...row,
    plugins: row.plugins ? row.plugins.split(' ') : [],
    lockfiles: JSON.parse(row.lockfiles || '[]'),
    osv_skipped: JSON.parse(row.osv_skipped || '{}'),
    lock_coverage: row.lock_coverage ? JSON.parse(row.lock_coverage) : null,
  };
}

export function getAnalysedCommit(db, appId) {
  const row = db.prepare('SELECT commit_sha FROM default_branch_analyses WHERE app_id = ?').get(appId);
  return row ? row.commit_sha : null;
}

export function saveAnalysedCommit(db, appId, commitSha) {
  db.prepare(`INSERT INTO default_branch_analyses (app_id, commit_sha) VALUES (?, ?)
    ON CONFLICT(app_id) DO UPDATE SET commit_sha = excluded.commit_sha, analysed_at = CURRENT_TIMESTAMP`).run(appId, commitSha);
}

// Replace the cached app list with the given entries ({appId, platform, repository, gone}).
export function saveAppList(db, entries) {
  const insert = db.prepare('INSERT INTO apps (app_id, platform, repository, gone) VALUES (?, ?, ?, ?)');
  db.transaction(() => {
    db.prepare('DELETE FROM apps').run();
    for (const e of entries) insert.run(e.appId, e.platform, e.repository, e.gone ? 1 : 0);
  })();
  return entries.length;
}

export function getAppList(db) {
  return db.prepare('SELECT app_id, platform, repository, gone FROM apps ORDER BY platform, app_id').all()
    .map(r => ({ appId: r.app_id, platform: r.platform, repository: r.repository, gone: r.gone === 1 }));
}

// Replace the end-of-life set with the given entries ({appId, lastCommitAt: Date}).
export function saveEndOfLife(db, entries) {
  const insert = db.prepare('INSERT INTO end_of_life (app_id, last_commit_at) VALUES (?, ?)');
  db.transaction(() => {
    db.prepare('DELETE FROM end_of_life').run();
    for (const e of entries) insert.run(e.appId, e.lastCommitAt.toISOString());
  })();
}

export function getEndOfLife(db) {
  return new Map(db.prepare('SELECT app_id, last_commit_at FROM end_of_life').all().map(r => [r.app_id, r.last_commit_at]));
}

// Replace the cached verifications with byApp (appId -> [{version, verifiedAt}]).
export function saveReproducibleVersions(db, byApp) {
  const insert = db.prepare('INSERT INTO reproducible_versions (app_id, version, verified_at, platform) VALUES (?, ?, ?, ?)');
  db.transaction(() => {
    db.prepare('DELETE FROM reproducible_versions').run();
    for (const [appId, versions] of byApp) for (const v of versions) insert.run(appId, v.version, v.verifiedAt, v.platform ?? null);
  })();
}

export function getReproducibleVersions(db) {
  const byApp = new Map();
  for (const r of db.prepare('SELECT app_id, version, verified_at, platform FROM reproducible_versions ORDER BY verified_at DESC').all()) {
    if (!byApp.has(r.app_id)) byApp.set(r.app_id, []);
    byApp.get(r.app_id).push({ version: r.version, verifiedAt: r.verified_at, platform: r.platform });
  }
  return byApp;
}

export function saveVerifiedRef(db, appId, ref, version) {
  db.prepare("DELETE FROM analyses WHERE app_id = ? AND kind = 'verified-no-tag' AND ref = ?").run(appId, version);
  db.prepare('INSERT OR REPLACE INTO verified_refs (app_id, ref, version) VALUES (?, ?, ?)').run(appId, ref, version);
}

// ref -> verified version, for one app.
export function getVerifiedRefs(db, appId) {
  return new Map(db.prepare('SELECT ref, version FROM verified_refs WHERE app_id = ?').all(appId).map(r => [r.ref, r.version]));
}

// True when a release analysis of this ref finished (ok or unsupported); a
// failed one is retried.
export function hasReleaseAnalysis(db, appId, ref) {
  return Boolean(db.prepare("SELECT 1 FROM analyses WHERE app_id = ? AND kind = 'release' AND ref = ? AND status != 'failed'").get(appId, ref));
}

// The release tags --reanalyse runs again for an app: the newest GitHub
// release stored for it, then every release with a recorded analysis.
export function releasesToReanalyse(db, appId) {
  const newest = db.prepare("SELECT version FROM assets WHERE app_id = ? AND source = 'github' ORDER BY published_at DESC LIMIT 1").get(appId);
  const analysed = db.prepare("SELECT ref FROM analyses WHERE app_id = ? AND kind = 'release' ORDER BY analysed_at DESC, ref").all(appId).map(r => r.ref);
  return [...new Set([...(newest ? [newest.version] : []), ...analysed])];
}

// Mark wallets for a rerun; marking one again moves its mark to now.
export function requestReanalyse(db, appIds) {
  const mark = db.prepare('INSERT OR REPLACE INTO reanalyse_requests (app_id) VALUES (?)');
  db.transaction(() => { for (const id of appIds) mark.run(id); })();
}

// The pending marks, oldest first: [{ app_id, requested_at }].
export function reanalyseRequests(db) {
  return db.prepare('SELECT app_id, requested_at FROM reanalyse_requests ORDER BY requested_at, app_id').all();
}

// Remove marks. With `before`, only marks older than it: one made while the
// wallet was already being analysed stays for the next pass.
export function clearReanalyse(db, appIds, before = null) {
  const clear = before
    ? db.prepare('DELETE FROM reanalyse_requests WHERE app_id = ? AND requested_at < ?')
    : db.prepare('DELETE FROM reanalyse_requests WHERE app_id = ?');
  let removed = 0;
  db.transaction(() => { for (const id of appIds) removed += (before ? clear.run(id, before) : clear.run(id)).changes; })();
  return removed;
}

function ensureColumn(db, table, column, type) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all().map(c => c.name);
  if (!columns.includes(column)) db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
}

const SCOPES = ['app', 'build', 'tests'];
const scopeOrNull = (v) => (SCOPES.includes(v) ? v : null);

const boolOrNull = (v) => (v === null || v === undefined ? null : (v ? 1 : 0));

const dependantsOrNull = (v) => (Array.isArray(v) ? JSON.stringify([...new Set(v)].sort()) : null);
// The stored JSON list back as an array; null when the row predates the column or the files had no graph.
export const dependantsOfRow = (v) => {
  if (v == null) return null;
  try {
    const list = JSON.parse(v);
    return Array.isArray(list) ? list : null;
  } catch {
    return null;
  }
};

// Replace the stored dependency set of (appId, version) with the entries of
// the given pinning analyses (see plugins/pinning.mjs makeEntry).
// Returns the number of rows stored.
export function saveDependencies(db, appId, version, analyses) {
  const insertPackage = db.prepare(`
    INSERT OR IGNORE INTO packages (ecosystem, name, version, resolved, integrity) VALUES (?, ?, ?, ?, ?)
  `);
  const selectPackage = db.prepare(`
    SELECT id FROM packages WHERE ecosystem = ? AND name = ? AND version = ? AND resolved = ? AND integrity = ?
  `);
  const insertDependency = db.prepare(`
    INSERT OR REPLACE INTO app_dependencies (app_id, version, package_id, lockfile, direct, dev, scope, dependants, tier)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const clear = db.prepare('DELETE FROM app_dependencies WHERE app_id = ? AND version = ?');

  const run = db.transaction(() => {
    clear.run(appId, version);
    let count = 0;
    for (const analysis of analyses) {
      for (const e of analysis.entries || []) {
        insertPackage.run(e.ecosystem, e.name, e.version, e.resolved, e.integrity);
        const { id } = selectPackage.get(e.ecosystem, e.name, e.version, e.resolved, e.integrity);
        insertDependency.run(appId, version, id, e.lockfile, boolOrNull(e.direct), boolOrNull(e.dev), scopeOrNull(e.scope), dependantsOrNull(e.dependants), e.tier);
        count++;
      }
    }
    return count;
  });
  return run();
}

// Replace the stored vulnerability findings of (appId, version) with those of
// a checkVulnerabilities result (plugins/osv.mjs). Returns the number of rows stored.
export function saveVulnerabilities(db, appId, version, { findings }) {
  const insert = db.prepare(`
    INSERT OR REPLACE INTO app_vulnerabilities
      (app_id, version, ecosystem, name, dep_version, vuln_id, severity, aliases, fixed, summary, direct, dev, scope, dependants, affected)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  return db.transaction(() => {
    db.prepare('DELETE FROM app_vulnerabilities WHERE app_id = ? AND version = ?').run(appId, version);
    for (const f of findings) {
      insert.run(appId, version, f.ecosystem, f.name, f.version, f.id, f.severity,
        f.aliases.join(' '), f.fixed.join(' '), f.summary, boolOrNull(f.direct), boolOrNull(f.dev), scopeOrNull(f.scope), dependantsOrNull(f.dependants),
        Array.isArray(f.affected) && f.affected.length ? JSON.stringify(f.affected) : null);
    }
    return findings.length;
  })();
}

export function getVulnerabilities(db, appId, version) {
  return db.prepare(`
    SELECT ecosystem, name, dep_version, vuln_id, severity, aliases, fixed, summary, direct, dev, scope, dependants, affected
    FROM app_vulnerabilities WHERE app_id = ? AND version = ?
    ORDER BY CASE severity WHEN 'malicious' THEN 0 WHEN 'critical' THEN 1 WHEN 'high' THEN 2
      WHEN 'moderate' THEN 3 WHEN 'low' THEN 4 ELSE 5 END, ecosystem, name, vuln_id
  `).all(appId, version);
}

export function saveSubmodules(db, appId, ref, commit, rows) {
  db.prepare('INSERT OR REPLACE INTO release_submodules (app_id, ref, commit_sha, rows, checked_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)')
    .run(appId, ref, commit, JSON.stringify(rows));
}

// { commit, checkedAt, rows } of (appId, ref), or null when it has no submodules stored.
export function getSubmodules(db, appId, ref) {
  const r = db.prepare('SELECT commit_sha, rows, checked_at FROM release_submodules WHERE app_id = ? AND ref = ?').get(appId, ref);
  return r ? { commit: r.commit_sha, checkedAt: r.checked_at, rows: JSON.parse(r.rows) } : null;
}

// Stored dependency rows of (appId, version), package fields joined in.
export function getDependencies(db, appId, version) {
  return db.prepare(`
    SELECT p.ecosystem, p.name, p.version AS dep_version, p.resolved, p.integrity,
           d.lockfile, d.direct, d.dev, d.scope, d.dependants, d.tier
    FROM app_dependencies d JOIN packages p ON p.id = d.package_id
    WHERE d.app_id = ? AND d.version = ?
    ORDER BY p.ecosystem, d.lockfile, p.name, p.version
  `).all(appId, version);
}

// Set difference between two stored versions, keyed by (ecosystem, lockfile,
// name); a name resolved to several versions in one release is compared as
// the set of its versions. Returns { added, removed, changed }; changed rows
// carry from/to version lists and, for a version present on both sides, an
// integrity or resolved change — the case worth an alert.
export function diffDependencies(db, appId, fromVersion, toVersion) {
  const group = (rows) => {
    const map = new Map();
    for (const r of rows) {
      const k = `${r.ecosystem}\u0000${r.lockfile}\u0000${r.name}`;
      if (!map.has(k)) map.set(k, { ecosystem: r.ecosystem, lockfile: r.lockfile, name: r.name, direct: r.direct, dev: r.dev, versions: new Map() });
      const g = map.get(k);
      g.direct = g.direct || r.direct;
      g.versions.set(r.dep_version, r);
    }
    return map;
  };
  const before = group(getDependencies(db, appId, fromVersion));
  const after = group(getDependencies(db, appId, toVersion));
  const added = [], removed = [], changed = [];
  const summary = (g) => ({ ecosystem: g.ecosystem, lockfile: g.lockfile, name: g.name, direct: g.direct, dev: g.dev, versions: [...g.versions.keys()] });
  for (const [k, g] of after) {
    const prev = before.get(k);
    if (!prev) { added.push(summary(g)); continue; }
    const from = [...prev.versions.keys()], to = [...g.versions.keys()];
    const sameBytes = [...g.versions].filter(([v, r]) => prev.versions.has(v) &&
      (prev.versions.get(v).integrity !== r.integrity || prev.versions.get(v).resolved !== r.resolved)).map(([v]) => v);
    if (from.join() !== to.join() || sameBytes.length) {
      changed.push({ ...summary(g), from, to, integrityChangedAtSameVersion: sameBytes });
    }
  }
  for (const [k, g] of before) if (!after.has(k)) removed.push(summary(g));
  return { added, removed, changed };
}

// Every (app_id, version) that ships a package: the retroactive lookup for a
// new advisory. `version` null matches all versions of the package.
export function findAppsShipping(db, ecosystem, name, version = null) {
  return db.prepare(`
    SELECT d.app_id, d.version, p.version AS dep_version, d.lockfile, d.direct, d.dev
    FROM app_dependencies d JOIN packages p ON p.id = d.package_id
    WHERE p.ecosystem = ? AND p.name = ? AND (? IS NULL OR p.version = ?)
    ORDER BY d.app_id, d.version
  `).all(ecosystem, name, version, version);
}

// Returns true if the app already has at least one stored asset (not a baseline run)
export function hasExistingAssets(db, appId) {
  const row = db.prepare('SELECT 1 FROM assets WHERE app_id = ? LIMIT 1').get(appId);
  return row !== undefined;
}

// Save or update asset in database
// Returns: 'unchanged', 'added', 'unknown', or 'changed'
// shaChangeResult: result from evaluateAssetShaChange function
export function saveAsset(db, appId, asset, shaChangeResult) {
  const { status, existing, oldSha256, newSha256, metadataNeedsUpdate } = shaChangeResult;

  if (existing) {
    if (status === 'unknown') {
      return 'unknown';
    }

    if (status === 'upgrade_from_unknown') {
      const updateStmt = db.prepare(`
        UPDATE assets 
        SET sha256 = ?, architecture = ?, os = ?, size = COALESCE(?, size), published_at = ?, author_id = ?, author_login = ?
        WHERE app_id = ? AND version = ? AND asset_name = ? AND source = ?
          AND COALESCE(architecture, '') = COALESCE(?, '')
          AND COALESCE(os, '') = COALESCE(?, '')
      `);
      updateStmt.run(newSha256, asset.architecture || null, asset.os || null, asset.size ?? null, asset.publishedAt || null, asset.authorId || null, asset.authorLogin || null, appId, asset.version, asset.assetName, asset.source, asset.architecture || null, asset.os || null);
      return 'added';
    }

    if (status === 'changed') {
      const updateStmt = db.prepare(`
        UPDATE assets 
        SET sha256 = ?, architecture = ?, os = ?, size = COALESCE(?, size), published_at = ?, author_id = ?, author_login = ?
        WHERE app_id = ? AND version = ? AND asset_name = ? AND source = ?
          AND COALESCE(architecture, '') = COALESCE(?, '')
          AND COALESCE(os, '') = COALESCE(?, '')
      `);
      updateStmt.run(newSha256, asset.architecture || null, asset.os || null, asset.size ?? null, asset.publishedAt || null, asset.authorId || null, asset.authorLogin || null, appId, asset.version, asset.assetName, asset.source, asset.architecture || null, asset.os || null);
      return 'changed';
    }

    if (metadataNeedsUpdate) {
      const updateStmt = db.prepare(`
        UPDATE assets 
        SET published_at = COALESCE(?, published_at), author_id = COALESCE(?, author_id), author_login = COALESCE(?, author_login), size = COALESCE(?, size)
        WHERE app_id = ? AND version = ? AND asset_name = ? AND source = ?
          AND COALESCE(architecture, '') = COALESCE(?, '')
          AND COALESCE(os, '') = COALESCE(?, '')
      `);
      updateStmt.run(asset.publishedAt || null, asset.authorId || null, asset.authorLogin || null, asset.size ?? null, appId, asset.version, asset.assetName, asset.source, asset.architecture || null, asset.os || null);
    }

    return 'unchanged';
  } else {
    // New asset, insert it
    const insertStmt = db.prepare(`
      INSERT INTO assets (app_id, version, asset_name, sha256, source, architecture, os, size, published_at, author_id, author_login)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertStmt.run(appId, asset.version, asset.assetName, asset.sha256, asset.source, asset.architecture || null, asset.os || null, asset.size ?? null, asset.publishedAt || null, asset.authorId || null, asset.authorLogin || null);
    return 'added';
  }
}

// Get previous releases with their authorIds for an app
// Returns array of objects with version, authorId, authorLogin, publishedAt
// Excludes the current version if provided
// Groups by version to get one authorId per version (takes the most common one if there are multiple)
export function getPreviousReleases(db, appId, currentVersion = null, limit = 5) {
  let query = `
    SELECT 
      version,
      author_id,
      MAX(author_login) as author_login,
      MAX(COALESCE(published_at, created_at)) as published_at
    FROM assets
    WHERE app_id = ? AND source = 'github' AND author_id IS NOT NULL
  `;
  
  const params = [appId];
  
  if (currentVersion) {
    query += ` AND version != ?`;
    params.push(currentVersion);
  }
  
  query += `
    GROUP BY version, author_id
    ORDER BY published_at DESC, created_at DESC
    LIMIT ?
  `;
  params.push(limit);
  
  const stmt = db.prepare(query);
  const results = stmt.all(...params);
  
  // If a version appears multiple times with different authorIds, take the first one
  // (This shouldn't happen for GitHub releases, but handle it just in case)
  const versionMap = new Map();
  for (const row of results) {
    if (!versionMap.has(row.version)) {
      versionMap.set(row.version, row);
    }
  }
  
  return Array.from(versionMap.values());
}

// Create a pattern from asset name by replacing version with wildcard for LIKE query
// This allows matching assets with the same base name but different versions
// Example: "zeus-v0.12.0-alpha4-arm64-v8a.apk" with version "v0.12.0-alpha4" 
//          becomes "zeus-%-arm64-v8a.apk"
function createAssetNamePattern(assetName, version) {
  if (!version || !assetName) {
    return assetName;
  }

  // Escape special regex characters in the version to use it in a regex
  const escapedVersionForRegex = version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Replace the version with % wildcard (case-insensitive)
  let pattern = assetName.replace(new RegExp(escapedVersionForRegex, 'gi'), '%');
  
  // Escape special LIKE characters (% and _) in the pattern, but preserve the % we just added
  // Split by the % we added, escape each part, then join back
  const parts = pattern.split('%');
  const escapedParts = parts.map(part => part.replace(/[%_]/g, '\\$&'));
  pattern = escapedParts.join('%');
  
  return pattern;
}

// Get previous versions of the same asset (same asset_name pattern, source, architecture, os)
// The asset_name pattern is created by replacing the version with a wildcard
// This allows matching assets like "zeus-v0.12.0-alpha4-arm64-v8a.apk" and "zeus-v0.12.0-alpha3-arm64-v8a.apk"
// Returns array of objects with version, size, published_at
// publishedBefore (optional): only versions published before it, so a release is
// never compared against newer ones
export function getPreviousAssetVersions(db, appId, assetName, source, architecture, os, currentVersion, limit = 10, publishedBefore = null) {
  // Create pattern by replacing version with wildcard
  const assetNamePattern = createAssetNamePattern(assetName, currentVersion);
  
  const selectStmt = db.prepare(`
    SELECT version, asset_name, size, published_at, created_at
    FROM assets 
    WHERE app_id = ? AND asset_name LIKE ? ESCAPE '\\' AND source = ?
      AND COALESCE(architecture, '') = COALESCE(?, '')
      AND COALESCE(os, '') = COALESCE(?, '')
      AND version != ?
      AND size IS NOT NULL
      AND (? IS NULL OR published_at < ?)
    ORDER BY COALESCE(published_at, created_at) DESC
    LIMIT ?
  `);

  return selectStmt.all(
    appId, 
    assetNamePattern, 
    source, 
    architecture || null, 
    os || null, 
    currentVersion,
    publishedBefore,
    publishedBefore,
    limit
  );
}


export function savePackageSource(db, ecosystem, name, r) {
  db.prepare(`INSERT OR REPLACE INTO package_sources (ecosystem, name, repo_url, source, note, checked_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`)
    .run(ecosystem, name, r.url || null, r.source, r.note || null);
}

// Source repository per `ecosystem:name`, for the export.
export function packageSources(db) {
  const map = new Map();
  for (const r of db.prepare('SELECT ecosystem, name, repo_url, source FROM package_sources').all()) map.set(`${r.ecosystem}:${r.name}`, r);
  return map;
}

// Distinct packages without a cached lookup (or all of them with `all`); one
// version each, which Maven needs to find the POM.
export function packagesToResolve(db, { all = false } = {}) {
  return db.prepare(`
    SELECT p.ecosystem, p.name, MAX(p.version) AS version FROM packages p
    ${all ? '' : 'WHERE NOT EXISTS (SELECT 1 FROM package_sources s WHERE s.ecosystem = p.ecosystem AND s.name = p.name)'}
    GROUP BY p.ecosystem, p.name ORDER BY p.ecosystem, p.name
  `).all();
}
