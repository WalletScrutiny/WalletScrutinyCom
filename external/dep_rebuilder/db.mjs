// The rebuilder's own database: nothing here is shared with source_analysis.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const here = path.dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = process.env.DEP_REBUILDER_DATA || path.join(here, 'data');
export const DB_PATH = process.env.DEP_REBUILDER_DB || path.join(DATA_DIR, 'dep-rebuilder.db');
export const WORK_DIR = process.env.DEP_REBUILDER_WORK || path.join(DATA_DIR, 'work');

export function openDb(file = DB_PATH) {
  if (file !== ':memory:') fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new Database(file);
  db.pragma('journal_mode = WAL');
  db.exec(`
    -- every exact package version some wallet ships, and how many wallets
    CREATE TABLE IF NOT EXISTS candidates (
      ecosystem TEXT NOT NULL, name TEXT NOT NULL, version TEXT NOT NULL,
      wallets INTEGER NOT NULL,        -- distinct wallets shipping it in the app
      wallets_any INTEGER NOT NULL,    -- distinct wallets with it anywhere (build tooling too)
      synced_at TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (ecosystem, name, version)
    );
    -- repository of a package (one lookup serves every version)
    CREATE TABLE IF NOT EXISTS sources (
      ecosystem TEXT NOT NULL, name TEXT NOT NULL, repo_url TEXT, checked_at TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (ecosystem, name)
    );
    -- versions Google's OSS Rebuild already attests (one bucket listing per package)
    CREATE TABLE IF NOT EXISTS google (
      ecosystem TEXT NOT NULL, name TEXT NOT NULL, version TEXT NOT NULL,
      PRIMARY KEY (ecosystem, name, version)
    );
    CREATE TABLE IF NOT EXISTS google_lookups (
      ecosystem TEXT NOT NULL, name TEXT NOT NULL, checked_at TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (ecosystem, name)
    );
    -- the latest outcome per package version: reproduced | failed | skipped
    CREATE TABLE IF NOT EXISTS rebuilds (
      ecosystem TEXT NOT NULL, name TEXT NOT NULL, version TEXT NOT NULL,
      result TEXT NOT NULL, note TEXT, artifact TEXT, sha256 TEXT, repo_url TEXT, ref TEXT, commit_sha TEXT,
      toolchain TEXT, sandbox TEXT, log TEXT, seconds INTEGER, event TEXT, finished_at TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (ecosystem, name, version)
    );
    CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT);
    -- every attempt, kept
    CREATE TABLE IF NOT EXISTS attempts (
      id INTEGER PRIMARY KEY, ecosystem TEXT, name TEXT, version TEXT, result TEXT, note TEXT, seconds INTEGER, finished_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
  return db;
}

export function saveCandidates(db, rows) {
  const ins = db.prepare(`INSERT INTO candidates (ecosystem, name, version, wallets, wallets_any, synced_at)
    VALUES (@ecosystem, @name, @version, @wallets, @wallets_any, CURRENT_TIMESTAMP)
    ON CONFLICT(ecosystem, name, version) DO UPDATE SET wallets = excluded.wallets, wallets_any = excluded.wallets_any, synced_at = CURRENT_TIMESTAMP`);
  db.transaction(() => { for (const r of rows) ins.run(r); })();
}

/** Versions still to build: most wallets first, then name and version. Google's and earlier results are skipped unless retry. */
export function pending(db, { ecosystem = 'npm', limit = 10, retry = false, scope = 'app', minWallets = 1 } = {}) {
  const col = scope === 'any' ? 'wallets_any' : 'wallets';
  return db.prepare(`
    SELECT c.ecosystem, c.name, c.version, c.${col} AS wallets FROM candidates c
    WHERE c.ecosystem = ? AND c.${col} >= ?
      AND NOT EXISTS (SELECT 1 FROM google g WHERE g.ecosystem = c.ecosystem AND g.name = c.name AND g.version = c.version)
      AND NOT EXISTS (SELECT 1 FROM rebuilds r WHERE r.ecosystem = c.ecosystem AND r.name = c.name AND r.version = c.version
        ${retry ? `AND r.result = 'reproduced'` : ''})
    ORDER BY c.${col} DESC, c.name, c.version LIMIT ?`).all(ecosystem, minWallets, limit);
}

export function saveRebuild(db, r) {
  db.transaction(() => {
    db.prepare(`INSERT OR REPLACE INTO rebuilds (ecosystem, name, version, result, note, artifact, sha256, repo_url, ref, commit_sha, toolchain, sandbox, log, seconds, event, finished_at)
      VALUES (@ecosystem, @name, @version, @result, @note, @artifact, @sha256, @repoUrl, @ref, @commit, @toolchain, @sandbox, @log, @seconds, @event, CURRENT_TIMESTAMP)`)
      .run({ artifact: null, sha256: null, repoUrl: null, ref: null, commit: null, toolchain: null, sandbox: null, log: null, seconds: null, event: null, ...r, event: r.event ? JSON.stringify(r.event) : null });
    db.prepare(`INSERT INTO attempts (ecosystem, name, version, result, note, seconds) VALUES (?, ?, ?, ?, ?, ?)`)
      .run(r.ecosystem, r.name, r.version, r.result, r.note ?? null, r.seconds ?? null);
  })();
}

export function tally(db) {
  const results = Object.fromEntries(db.prepare(`SELECT result, COUNT(*) n FROM rebuilds GROUP BY result`).all().map(r => [r.result, r.n]));
  const c = db.prepare(`SELECT COUNT(*) n, SUM(wallets >= 2) shared FROM candidates`).get();
  const todo = db.prepare(`SELECT COUNT(*) n FROM candidates c WHERE NOT EXISTS (SELECT 1 FROM rebuilds r WHERE r.ecosystem = c.ecosystem AND r.name = c.name AND r.version = c.version)
    AND NOT EXISTS (SELECT 1 FROM google g WHERE g.ecosystem = c.ecosystem AND g.name = c.name AND g.version = c.version)`).get().n;
  return { candidates: c.n, sharedByTwoOrMore: c.shared || 0, results, notYetTried: todo };
}

export const getMeta = (db, key) => db.prepare(`SELECT value FROM meta WHERE key = ?`).get(key)?.value ?? null;
export const setMeta = (db, key, value) => db.prepare(`INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)`).run(key, String(value));
