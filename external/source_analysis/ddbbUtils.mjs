import Database from 'better-sqlite3';
import { existsSync, mkdirSync, copyFileSync, readdirSync, unlinkSync } from 'fs';
import { DB_PATH, BACKUP_DIR, BACKUPS_TO_KEEP, DEFAULT_BRANCH_REF } from './config.mjs';
export { DEFAULT_BRANCH_REF };
import { join, dirname } from 'path';
import { WS_DIFFERS } from './rebuildClaims.mjs';

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
  `);
  // Indexes earlier versions created that nothing uses: (app_id, version) is a
  // prefix of idx_unique_asset, every assets query is filtered by app_id (which
  // that index also serves), and architecture / os have a handful of values.
  // About 26 MB of a 260 MB database. A database that has them keeps the space
  // until the VACUUM that follows the first start without them.
  let reclaimable = false;
  for (const index of ['idx_app_version', 'idx_app_asset', 'idx_architecture', 'idx_os']) {
    if (db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'index' AND name = ?").get(index)) {
      db.exec(`DROP INDEX IF EXISTS ${index}`); // another process may have dropped it meanwhile
      reclaimable = true;
    }
  }

  // Resolved dependencies per (app_id, version), from lockfiles only.
  // `packages` holds one row per unique (ecosystem, name, version, resolved,
  // integrity) so consecutive releases, which share almost all of their
  // packages, add join rows rather than package rows.
  // `app_lockfiles` holds one row per lockfile of a release, and
  // `lockfile_dependencies` one per package in it, keyed by the two ids.
  // Read them through the view `app_dependencies`, which has the columns the
  // table of that name had (one row per app_id, version, package_id, lockfile).
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
  `);
  if (moveDependenciesToLockfileIds(db)) reclaimable = true;
  db.exec(DEPENDENCY_TABLES);
  // A pinned pair's source row (pipRules.mjs) names the pinned file whose row
  // is the same package; NULL for every other row and for rows stored before.
  ensureColumn(db, 'lockfile_dependencies', 'covered_by', 'TEXT');
  // CREATE VIEW IF NOT EXISTS keeps a view from before the column.
  if (!db.prepare('PRAGMA table_info(app_dependencies)').all().some(c => c.name === 'covered_by')) db.exec('DROP VIEW IF EXISTS app_dependencies');
  db.exec(DEPENDENCY_VIEW);

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
  ensureColumn(db, 'app_vulnerabilities', 'scope', 'TEXT');
  // `dependants` is the JSON list of package names that require this one, one
  // hop up (plugins/pinning.mjs makeEntry); NULL when the lockfile has no graph.
  ensureColumn(db, 'app_vulnerabilities', 'dependants', 'TEXT');
  // `affected` is the JSON list of the advisory's affected ranges for this
  // package ("< 1.2.3"); NULL on rows stored before the column, until the next recheck.
  ensureColumn(db, 'app_vulnerabilities', 'affected', 'TEXT');
  // `listed_by` is the sources that listed the advisory, space separated, of
  // "osv", "nvd" and "vendor" (plugins/osv.mjs findingsFor); NULL on rows stored
  // before the column, until the next recheck.
  ensureColumn(db, 'app_vulnerabilities', 'listed_by', 'TEXT');
  // `fixed_git` is the JSON list of fix versions the upstream repository's
  // release tags gave ({ version, tag, commit, repo }, plugins/osv.mjs
  // applyUpstreamFixes), also in `fixed`; NULL when git added none (issue 1016).
  ensureColumn(db, 'app_vulnerabilities', 'fixed_git', 'TEXT');
  // Advisories NVD or OSV.dev list for a native release whose shipped tag
  // already has the fixing commit (issue 1016): kept out of
  // app_vulnerabilities, but stored and exported with the commit and tag
  // that show it, so the record of what was left out is complete.
  db.exec(`
    CREATE TABLE IF NOT EXISTS app_backported_advisories (
      app_id TEXT NOT NULL,
      version TEXT NOT NULL,
      ecosystem TEXT NOT NULL,
      name TEXT NOT NULL,
      dep_version TEXT NOT NULL,
      vuln_id TEXT NOT NULL,
      aliases TEXT NOT NULL DEFAULT '',
      severity TEXT NOT NULL,
      summary TEXT NOT NULL DEFAULT '',
      listed_by TEXT,
      repo TEXT NOT NULL,
      commit_sha TEXT NOT NULL,
      tag TEXT NOT NULL,
      checked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (app_id, version, ecosystem, name, dep_version, vuln_id)
    );
  `);

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

  // Rung "reproduced" (rebuildClaims.mjs, rebuildNpm.mjs): who rebuilt a
  // package version from source and got the registry's file. One row per
  // claimant: ws (us), oss-rebuild, reproducible-central. result is
  // reproduced | failed, for ws also almost | not-reproducible | unknown-command
  // (the rebuilder's verdicts, rebuildClaims.mjs WS_DIFFERS); sha256 is the registry file's, commit_sha the source
  // built, event our unsigned Nostr event (ws only), issue where a failed Reproducible Central
  // rebuild is reported upstream (its buildspec's issue=).
  // rebuild_lookups records every (claimant, package) asked, with or without claims.
  // oss_rebuild_details caches what an OSS Rebuild attestation says, by its URL
  // (rebuildClaims.mjs parseOssAttestation); attestations never change.
  db.exec(`
    CREATE TABLE IF NOT EXISTS package_rebuilds (
      ecosystem TEXT NOT NULL,
      name TEXT NOT NULL,
      version TEXT NOT NULL,
      claimant TEXT NOT NULL,
      result TEXT NOT NULL,
      artifact TEXT,
      sha256 TEXT,
      commit_sha TEXT,
      url TEXT,
      note TEXT,
      event TEXT,
      checked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (ecosystem, name, version, claimant)
    );
    CREATE TABLE IF NOT EXISTS rebuild_lookups (
      claimant TEXT NOT NULL,
      ecosystem TEXT NOT NULL,
      name TEXT NOT NULL,
      checked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (claimant, ecosystem, name)
    );
    CREATE TABLE IF NOT EXISTS oss_rebuild_details (
      url TEXT PRIMARY KEY,
      details TEXT NOT NULL,
      checked_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  ensureColumn(db, 'package_rebuilds', 'issue', 'TEXT');

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
      build_locks TEXT,                -- JSON { locks, misnamed }: the build-lock.json output files (reproducible.mjs buildLockRefs)
      PRIMARY KEY (app_id, version)
    );
  `);
  ensureColumn(db, 'reproducible_versions', 'build_locks', 'TEXT');

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
  // 1 once that analysis also stored its dependency and advisory rows (under
  // DEFAULT_BRANCH_REF); commits recorded before it did are analysed again.
  ensureColumn(db, 'default_branch_analyses', 'rows_stored', 'INTEGER');

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
      build_lock TEXT,                           -- JSON plugins/build-lock.mjs result, NULL when the release has no build-lock.json
      analysed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      failed_attempt_at DATETIME,                -- the last re-check that failed and left this ok row in place (issue 998)
      failed_attempt_error TEXT,
      PRIMARY KEY (app_id, kind, ref)
    );
  `);
  ensureColumn(db, 'analyses', 'lock_coverage', 'TEXT');
  ensureColumn(db, 'analyses', 'build_lock', 'TEXT');
  ensureColumn(db, 'analyses', 'failed_attempt_at', 'DATETIME');
  ensureColumn(db, 'analyses', 'failed_attempt_error', 'TEXT');

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
    FROM app_dependencies d WHERE d.version != '${DEFAULT_BRANCH_REF}' GROUP BY d.app_id, d.version;
  `);

  // Advisories filed against the wallet's own repository (ownAdvisories.mjs,
  // issue 1022), as the JSON list the export carries; one row per app, replaced
  // by every lookup that answers. No row: never looked up.
  db.exec(`
    CREATE TABLE IF NOT EXISTS app_own_advisories (
      app_id TEXT PRIMARY KEY,
      repository TEXT NOT NULL,
      advisories TEXT NOT NULL,
      checked_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Wallets marked for a rerun (reanalyse-cli.mjs): the next pass analyses
  // each one as --reanalyse would, then removes its mark.
  db.exec(`
    CREATE TABLE IF NOT EXISTS reanalyse_requests (
      app_id TEXT PRIMARY KEY,
      requested_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Pages freed by the two cleanups above stay in the file until a VACUUM. One
  // attempt per start; if another connection holds the database the pages are
  // reused by later writes and the next start does not try again.
  if (reclaimable && dbPath !== ':memory:') {
    try { db.exec('VACUUM'); } catch (error) { console.warn(`VACUUM after the schema cleanup skipped: ${error.message}`); }
  }

  return db;
}

const DEPENDENCY_TABLES = `
  CREATE TABLE IF NOT EXISTS app_lockfiles (
    id INTEGER PRIMARY KEY,
    app_id TEXT NOT NULL,
    version TEXT NOT NULL,
    lockfile TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (app_id, version, lockfile)
  );
  CREATE TABLE IF NOT EXISTS lockfile_dependencies (
    lockfile_id INTEGER NOT NULL REFERENCES app_lockfiles(id),
    package_id INTEGER NOT NULL REFERENCES packages(id),
    direct INTEGER,
    dev INTEGER,
    tier TEXT NOT NULL,
    scope TEXT,
    dependants TEXT,
    covered_by TEXT,
    PRIMARY KEY (lockfile_id, package_id)
  ) WITHOUT ROWID;
  CREATE INDEX IF NOT EXISTS idx_lockfile_dependencies_package ON lockfile_dependencies(package_id);
`;
const DEPENDENCY_VIEW = `
  CREATE VIEW IF NOT EXISTS app_dependencies AS
    SELECT l.app_id, l.version, d.package_id, l.lockfile, d.direct, d.dev, d.tier, l.created_at, d.scope, d.dependants, d.covered_by
    FROM lockfile_dependencies d JOIN app_lockfiles l ON l.id = d.lockfile_id;
`;
const LEGACY_DEPENDENCY_COLUMNS = ['app_id', 'version', 'package_id', 'lockfile', 'direct', 'dev', 'tier', 'created_at', 'scope', 'dependants'];

// app_dependencies used to be a table with the app id, version and lockfile
// path as text in every row and again in the package index, plus a created_at
// that is the same for all rows of a release: more than half of its size
// (19.8 -> 8.5 MB for 103,000 rows). Now a lockfile of a release is one row of
// app_lockfiles, with the created_at, and the dependency rows carry its id.
// Moves the rows of such a table (rowid or WITHOUT ROWID) once, inside a
// transaction, and puts the view in its place; returns whether it did anything.
function moveDependenciesToLockfileIds(db) {
  const isTable = () => Boolean(db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'app_dependencies'").get());
  if (!isTable()) return false;
  // Foreign keys off for the copy (the pragma is a no-op inside a transaction):
  // the rows are copied as they are, and a stray one must not stop the service.
  db.pragma('foreign_keys = OFF');
  db.exec('BEGIN IMMEDIATE');
  try {
    // Another process may have done it while this one waited for the lock.
    if (!isTable()) {
      db.exec('COMMIT');
      return false;
    }
    ensureColumn(db, 'app_dependencies', 'scope', 'TEXT');
    ensureColumn(db, 'app_dependencies', 'dependants', 'TEXT');
    const unknown = db.prepare('PRAGMA table_info(app_dependencies)').all().map(c => c.name).filter(c => !LEGACY_DEPENDENCY_COLUMNS.includes(c));
    if (unknown.length) throw new Error(`no place for the column ${unknown.join(', ')}`);
    db.exec(`
      ${DEPENDENCY_TABLES}
      INSERT INTO app_lockfiles (app_id, version, lockfile, created_at)
        SELECT app_id, version, lockfile, MIN(created_at) FROM app_dependencies GROUP BY app_id, version, lockfile;
      INSERT INTO lockfile_dependencies (lockfile_id, package_id, direct, dev, tier, scope, dependants)
        SELECT l.id, d.package_id, d.direct, d.dev, d.tier, d.scope, d.dependants
        FROM app_dependencies d JOIN app_lockfiles l ON l.app_id = d.app_id AND l.version = d.version AND l.lockfile = d.lockfile;
    `);
    const before = db.prepare('SELECT COUNT(*) n FROM app_dependencies').get().n;
    const after = db.prepare('SELECT COUNT(*) n FROM lockfile_dependencies').get().n;
    if (before !== after) throw new Error(`copied ${after} of ${before} rows`);
    db.exec(`DROP TABLE app_dependencies; ${DEPENDENCY_VIEW}`);
    db.exec('COMMIT');
    return true;
  } catch (error) {
    db.exec('ROLLBACK');
    throw new Error(`app_dependencies move failed, database left as it was: ${error.message}`);
  } finally {
    db.pragma('foreign_keys = ON');
  }
}

// Store the outcome of one analysis (see appAnalysis.runSourceCodeAnalysis);
// a repeat of the same (appId, kind, ref) replaces the earlier row, except
// that a failed one leaves an ok row in place (issue 998): it only notes the
// attempt and its error beside it, and analysed_at stays the ok check's.
export function recordAnalysis(db, { appId, kind, ref, commit = null, status, error = null, appType = null,
  analyser, plugins = [], lockfiles = [], dependencies = null, osvChecked = null, osvSkipped = {}, vulnerabilities = null, lockCoverage = null, buildLock = null }) {
  if (status === 'failed') {
    const kept = db.prepare(`
      UPDATE analyses SET failed_attempt_at = CURRENT_TIMESTAMP, failed_attempt_error = ?
      WHERE app_id = ? AND kind = ? AND ref = ? AND status = 'ok'
    `).run(error, appId, kind, ref);
    if (kept.changes) return;
  }
  db.prepare(`
    INSERT OR REPLACE INTO analyses
      (app_id, kind, ref, commit_sha, status, error, app_type, analyser, plugins, lockfiles,
       dependencies, osv_checked, osv_skipped, vulnerabilities, lock_coverage, build_lock, analysed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `).run(appId, kind, ref, commit, status, error, appType, analyser, plugins.join(' '), JSON.stringify(lockfiles),
    dependencies, osvChecked, JSON.stringify(osvSkipped), vulnerabilities, lockCoverage ? JSON.stringify(lockCoverage) : null,
    buildLock ? JSON.stringify(buildLock) : null);
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
    build_lock: row.build_lock ? JSON.parse(row.build_lock) : null,
  };
}

// The default branch's commit whose rows are stored under DEFAULT_BRANCH_REF,
// or null: never analysed, or analysed before those rows were kept.
export function getAnalysedCommit(db, appId) {
  return getDefaultBranch(db, appId)?.commit ?? null;
}

// { commit, analysedAt } of the default branch analysis whose rows are stored, or null.
export function getDefaultBranch(db, appId) {
  const row = db.prepare('SELECT commit_sha, analysed_at FROM default_branch_analyses WHERE app_id = ? AND rows_stored = 1').get(appId);
  return row ? { commit: row.commit_sha, analysedAt: row.analysed_at } : null;
}

export function saveAnalysedCommit(db, appId, commitSha) {
  db.prepare(`INSERT INTO default_branch_analyses (app_id, commit_sha, rows_stored) VALUES (?, ?, 1)
    ON CONFLICT(app_id) DO UPDATE SET commit_sha = excluded.commit_sha, rows_stored = 1, analysed_at = CURRENT_TIMESTAMP`).run(appId, commitSha);
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
  const insert = db.prepare('INSERT INTO reproducible_versions (app_id, version, verified_at, platform, build_locks) VALUES (?, ?, ?, ?, ?)');
  const locksOf = (v) => (v.buildLocks?.length || v.misnamedLocks?.length ? JSON.stringify({ locks: v.buildLocks || [], misnamed: v.misnamedLocks || [] }) : null);
  db.transaction(() => {
    db.prepare('DELETE FROM reproducible_versions').run();
    for (const [appId, versions] of byApp) for (const v of versions) insert.run(appId, v.version, v.verifiedAt, v.platform ?? null, locksOf(v));
  })();
}

export function getReproducibleVersions(db) {
  const byApp = new Map();
  for (const r of db.prepare('SELECT app_id, version, verified_at, platform, build_locks FROM reproducible_versions ORDER BY verified_at DESC').all()) {
    if (!byApp.has(r.app_id)) byApp.set(r.app_id, []);
    const { locks = [], misnamed = [] } = r.build_locks ? JSON.parse(r.build_locks) : {};
    byApp.get(r.app_id).push({ version: r.version, verifiedAt: r.verified_at, platform: r.platform,
      ...(locks.length ? { buildLocks: locks } : {}), ...(misnamed.length ? { misnamedLocks: misnamed } : {}) });
  }
  return byApp;
}

// The build-lock.json output files the verifications of (appId, version)
// carry, and the misnamed ones: { locks, misnamed }, both empty when none.
export function getBuildLockRefs(db, appId, version) {
  const r = db.prepare('SELECT build_locks FROM reproducible_versions WHERE app_id = ? AND version = ?').get(appId, version);
  const { locks = [], misnamed = [] } = r?.build_locks ? JSON.parse(r.build_locks) : {};
  return { locks, misnamed };
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

// The finished (ok or unsupported) release analysis of this ref, decoded like
// getAnalyses, or null when there is none or only a failed one.
export function getReleaseAnalysis(db, appId, ref) {
  const row = db.prepare("SELECT * FROM analyses WHERE app_id = ? AND kind = 'release' AND ref = ? AND status != 'failed'").get(appId, ref);
  return row ? decodeAnalysis(row) : null;
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

// One file can list a package version twice (pip lines with different
// environment markers). The table keeps one row per file and package, so the
// lines are merged rather than the last one replacing the others (issue 1027):
// direct if any line is, unknown before transitive; in the app if any line is;
// the dependants of all of them; the stronger pin.
const MERGE_DIRECT = [true, null, false];
const MERGE_SCOPE = ['app', null, 'build', 'tests'];
const MERGE_TIER = ['hash-pinned', 'source-ref-pinned', 'version-pinned', 'build-service-tag', 'unversioned', 'floating'];
const firstOf = (order, x, y) => {
  const [ix, iy] = [order.indexOf(x), order.indexOf(y)];
  return ix < 0 ? y : iy < 0 ? x : (ix <= iy ? x : y);
};
export function mergeEntries(x, y) {
  return {
    ...x,
    direct: firstOf(MERGE_DIRECT, x.direct ?? null, y.direct ?? null),
    dev: x.dev === false || y.dev === false ? false : (x.dev ?? y.dev),
    scope: firstOf(MERGE_SCOPE, scopeOrNull(x.scope), scopeOrNull(y.scope)),
    dependants: x.dependants || y.dependants ? [...new Set([...(x.dependants || []), ...(y.dependants || [])])].sort() : null,
    tier: firstOf(MERGE_TIER, x.tier, y.tier),
    coveredBy: x.coveredBy && y.coveredBy ? x.coveredBy : null,
  };
}

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
  const insertLockfile = db.prepare('INSERT INTO app_lockfiles (app_id, version, lockfile) VALUES (?, ?, ?)');
  const insertDependency = db.prepare(`
    INSERT OR REPLACE INTO lockfile_dependencies (lockfile_id, package_id, direct, dev, scope, dependants, tier, covered_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const clearDependencies = db.prepare('DELETE FROM lockfile_dependencies WHERE lockfile_id IN (SELECT id FROM app_lockfiles WHERE app_id = ? AND version = ?)');
  const clearLockfiles = db.prepare('DELETE FROM app_lockfiles WHERE app_id = ? AND version = ?');

  const run = db.transaction(() => {
    clearDependencies.run(appId, version);
    clearLockfiles.run(appId, version);
    const lockfileIds = new Map();
    const merged = new Map();
    for (const analysis of analyses) {
      for (const e of analysis.entries || []) {
        const key = JSON.stringify([e.lockfile, e.ecosystem, e.name, e.version, e.resolved, e.integrity]);
        merged.set(key, merged.has(key) ? mergeEntries(merged.get(key), e) : e);
      }
    }
    for (const e of merged.values()) {
      insertPackage.run(e.ecosystem, e.name, e.version, e.resolved, e.integrity);
      const { id } = selectPackage.get(e.ecosystem, e.name, e.version, e.resolved, e.integrity);
      if (!lockfileIds.has(e.lockfile)) lockfileIds.set(e.lockfile, insertLockfile.run(appId, version, e.lockfile).lastInsertRowid);
      insertDependency.run(lockfileIds.get(e.lockfile), id, boolOrNull(e.direct), boolOrNull(e.dev), scopeOrNull(e.scope), dependantsOrNull(e.dependants), e.tier, e.coveredBy || null);
    }
    return merged.size;
  });
  return run();
}

// Replace the stored vulnerability findings of (appId, version) with those of
// a checkVulnerabilities result (plugins/osv.mjs). Returns the number of rows stored.
// `nvdUnavailable` lists the package versions NVD did not answer for
// (plugins/osv.mjs): the rows stored for them are kept, since replacing them
// with OSV.dev's answer alone would drop every NVD-only advisory until the
// next successful lookup. A finding of this run replaces its stored row, but
// keeps the row's stored `listed_by`: NVD did not say this time whether it lists it.
// A new finding of such a package stores NULL (no line) for the same reason.
// `backported` (plugins/osv.mjs applyUpstreamFixes) replaces the release's
// stored backported advisories the same way, those of an NVD-less package kept.
// The same advisory can come back under another id in such a run: the full
// lookup stored it under NVD's or the vendor's CVE id, OSV.dev alone has it as
// PSF-2026-13 with that CVE as an alias. The stored row is the fuller one and
// stays; a second row would count the advisory twice.
const namesOfRow = r => [r.vuln_id, ...String(r.aliases || '').split(' ').filter(Boolean)];

export function saveVulnerabilities(db, appId, version, { findings, nvdUnavailable = [], backported = [] }) {
  const columns = 'app_id, version, ecosystem, name, dep_version, vuln_id, severity, aliases, fixed, summary, direct, dev, scope, dependants, affected, listed_by, fixed_git';
  const values = columns.split(', ').map(() => '?').join(', ');
  const insert = db.prepare(`INSERT OR REPLACE INTO app_vulnerabilities (${columns}) VALUES (${values})`);
  const keep = db.prepare(`INSERT OR IGNORE INTO app_vulnerabilities (${columns}) VALUES (${values})`);
  const stored = db.prepare(`SELECT ${columns} FROM app_vulnerabilities WHERE app_id = ? AND version = ? AND ecosystem = ? AND name = ? AND dep_version = ?`);
  const key = (ecosystem, name, depVersion, id) => [ecosystem, name, depVersion, id].join('\0');
  return db.transaction(() => {
    const kept = nvdUnavailable.flatMap(p => stored.all(appId, version, p.ecosystem, p.name, p.version));
    const keptListedBy = new Map(kept.map(r => [key(r.ecosystem, r.name, r.dep_version, r.vuln_id), r.listed_by]));
    const keptNames = new Set(kept.flatMap(r => namesOfRow(r).map(n => key(r.ecosystem, r.name, r.dep_version, n))));
    let inserted = 0;
    const unanswered = new Set(nvdUnavailable.map(p => key(p.ecosystem, p.name, p.version, '')));
    db.prepare('DELETE FROM app_vulnerabilities WHERE app_id = ? AND version = ?').run(appId, version);
    for (const f of findings) {
      const k = key(f.ecosystem, f.name, f.version, f.id);
      if (!keptListedBy.has(k) && [f.id, ...f.aliases].some(n => keptNames.has(key(f.ecosystem, f.name, f.version, n)))) continue;
      inserted++;
      insert.run(appId, version, f.ecosystem, f.name, f.version, f.id, f.severity,
        f.aliases.join(' '), f.fixed.join(' '), f.summary, boolOrNull(f.direct), boolOrNull(f.dev), scopeOrNull(f.scope), dependantsOrNull(f.dependants),
        Array.isArray(f.affected) && f.affected.length ? JSON.stringify(f.affected) : null,
        keptListedBy.has(k) ? keptListedBy.get(k)
          : unanswered.has(key(f.ecosystem, f.name, f.version, '')) ? null
          : (f.listedBy?.length ? f.listedBy.join(' ') : null),
        f.fixedFromGit?.length ? JSON.stringify(f.fixedFromGit) : null);
    }
    let carried = 0;
    for (const r of kept) carried += keep.run(...columns.split(', ').map(c => r[c])).changes;
    saveBackported(db, appId, version, backported, nvdUnavailable);
    return inserted + carried;
  })();
}

const BACKPORTED_COLUMNS = 'app_id, version, ecosystem, name, dep_version, vuln_id, aliases, severity, summary, listed_by, repo, commit_sha, tag';

function saveBackported(db, appId, version, backported, nvdUnavailable) {
  const values = BACKPORTED_COLUMNS.split(', ').map(() => '?').join(', ');
  const stored = db.prepare(`SELECT ${BACKPORTED_COLUMNS} FROM app_backported_advisories WHERE app_id = ? AND version = ? AND ecosystem = ? AND name = ? AND dep_version = ?`);
  const kept = nvdUnavailable.flatMap(p => stored.all(appId, version, p.ecosystem, p.name, p.version));
  db.prepare('DELETE FROM app_backported_advisories WHERE app_id = ? AND version = ?').run(appId, version);
  const insert = db.prepare(`INSERT OR REPLACE INTO app_backported_advisories (${BACKPORTED_COLUMNS}) VALUES (${values})`);
  const keptIds = new Set(kept.map(r => [r.ecosystem, r.name, r.dep_version, r.vuln_id].join('\0')));
  const keptNames = new Set(kept.flatMap(r => namesOfRow(r).map(n => [r.ecosystem, r.name, r.dep_version, n].join('\0'))));
  for (const b of backported) {
    const k = n => [b.ecosystem, b.name, b.version, n].join('\0');
    if (!keptIds.has(k(b.id)) && [b.id, ...(b.aliases || [])].some(n => keptNames.has(k(n)))) continue; // as in saveVulnerabilities
    insert.run(appId, version, b.ecosystem, b.name, b.version, b.id, (b.aliases || []).join(' '), b.severity, b.summary || '',
      b.listedBy?.length ? b.listedBy.join(' ') : null, b.repo, b.commit, b.tag);
  }
  const keep = db.prepare(`INSERT OR IGNORE INTO app_backported_advisories (${BACKPORTED_COLUMNS}) VALUES (${values})`);
  for (const r of kept) keep.run(...BACKPORTED_COLUMNS.split(', ').map(c => r[c]));
}

/** The advisories left out of (appId, version) because its shipped tag has the fix (saveVulnerabilities). */
export function getBackportedAdvisories(db, appId, version) {
  return db.prepare(`
    SELECT ecosystem, name, dep_version, vuln_id, aliases, severity, summary, listed_by, repo, commit_sha, tag
    FROM app_backported_advisories WHERE app_id = ? AND version = ?
    ORDER BY ecosystem, name, dep_version, vuln_id
  `).all(appId, version);
}

/** Store the own advisories of an app (ownAdvisories.mjs), replacing the earlier lookup's. */
export function saveOwnAdvisories(db, appId, repository, advisories) {
  db.prepare('INSERT OR REPLACE INTO app_own_advisories (app_id, repository, advisories, checked_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)')
    .run(appId, repository, JSON.stringify(advisories));
}

/** { repository, advisories, checkedAt } of the app's last own-advisory lookup, or null when there was none. */
export function getOwnAdvisories(db, appId) {
  const row = db.prepare('SELECT repository, advisories, checked_at FROM app_own_advisories WHERE app_id = ?').get(appId);
  return row ? { repository: row.repository, advisories: JSON.parse(row.advisories), checkedAt: row.checked_at } : null;
}

export function getVulnerabilities(db, appId, version) {
  return db.prepare(`
    SELECT ecosystem, name, dep_version, vuln_id, severity, aliases, fixed, summary, direct, dev, scope, dependants, affected, listed_by, fixed_git
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
/**
 * Every rebuild claim (package_rebuilds) as Map `ecosystem\0name\0version` →
 * claims, ours first. Only what the panel shows: our unsigned event rides along.
 * A rebuild of ours that did not match shows only with the verdict of the feed
 * (rebuildClaims.mjs, WS_DIFFERS); a bare "failed" says that our build did not
 * give the published file, not that the package cannot be reproduced. The row
 * stays, so rebuild-npm-cli.mjs does not try the version again.
 */
export function getRebuildClaims(db) {
  const out = new Map();
  const rows = db.prepare(`SELECT * FROM package_rebuilds ORDER BY claimant = 'ws' DESC, claimant`).all();
  for (const r of rows) {
    if (r.claimant === 'ws' && r.result !== 'reproduced' && !WS_DIFFERS.includes(r.result)) continue;
    const key = `${r.ecosystem}\0${r.name}\0${r.version}`;
    if (!out.has(key)) out.set(key, []);
    const c = { by: r.claimant, result: r.result };
    if (r.url) c.url = r.url;
    if (r.note) c.note = r.note;
    if (r.issue) c.issue = r.issue;
    if (r.claimant === 'ws') {
      c.date = String(r.checked_at).slice(0, 10);
      if (r.event) c.event = JSON.parse(r.event);
    }
    out.get(key).push(c);
  }
  return out;
}

/** OSS Rebuild attestation summaries (oss_rebuild_details) as Map url → details. */
export function getOssRebuildDetails(db) {
  return new Map(db.prepare('SELECT url, details FROM oss_rebuild_details').all().map(r => [r.url, JSON.parse(r.details)]));
}

export function getSubmodules(db, appId, ref) {
  const r = db.prepare('SELECT commit_sha, rows, checked_at FROM release_submodules WHERE app_id = ? AND ref = ?').get(appId, ref);
  return r ? { commit: r.commit_sha, checkedAt: r.checked_at, rows: JSON.parse(r.rows) } : null;
}

// Stored dependency rows of (appId, version), package fields joined in.
export function getDependencies(db, appId, version) {
  return db.prepare(`
    SELECT p.ecosystem, p.name, p.version AS dep_version, p.resolved, p.integrity,
           d.lockfile, d.direct, d.dev, d.scope, d.dependants, d.tier, d.covered_by
    FROM app_dependencies d JOIN packages p ON p.id = d.package_id
    WHERE d.app_id = ? AND d.version = ?
    ORDER BY p.ecosystem, d.lockfile, p.name, p.version
  `).all(appId, version);
}

// Set difference between two stored versions, keyed by (ecosystem, lockfile,
// name); a name resolved to several versions in one release is compared as
// the set of its versions. Returns { added, removed, changed }; changed rows
// carry from/to version lists and, for a version present on both sides, an
// integrity or resolved change — the case worth an alert. A pinned pair's
// source row (covered_by) is left out: its pinned row is the same package.
export function diffDependencies(db, appId, fromVersion, toVersion) {
  const group = (rows) => {
    const map = new Map();
    for (const r of rows) {
      if (r.covered_by != null) continue;
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
    SELECT d.app_id, d.version, p.version AS dep_version, d.lockfile, d.direct, d.dev, d.covered_by
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
