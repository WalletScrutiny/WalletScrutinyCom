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
  if (file !== ':memory:' && path.dirname(file) === DATA_DIR) {
    // The backup (external/db_backup) runs as another user in this group. Reading
    // a WAL database also writes its -shm file, and the -wal/-shm files take the
    // mode of the database file.
    fs.chmodSync(DATA_DIR, 0o770);
    fs.chmodSync(file, 0o660);
  }
  db.exec(`
    -- every exact package version some wallet ships, and how many wallets
    CREATE TABLE IF NOT EXISTS candidates (
      ecosystem TEXT NOT NULL, name TEXT NOT NULL, version TEXT NOT NULL,
      wallets INTEGER NOT NULL,        -- distinct wallets shipping it in the app
      wallets_any INTEGER NOT NULL,    -- distinct wallets with it anywhere (build tooling too)
      wallet_ids TEXT,                 -- the app ids behind "wallets", a JSON array; null before a sync filled it
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
    -- the latest outcome per package version: reproduced | failed | unsupported | skipped
    CREATE TABLE IF NOT EXISTS rebuilds (
      ecosystem TEXT NOT NULL, name TEXT NOT NULL, version TEXT NOT NULL,
      result TEXT NOT NULL, note TEXT, artifact TEXT, sha256 TEXT, repo_url TEXT, ref TEXT, commit_sha TEXT,
      toolchain TEXT, sandbox TEXT, log TEXT, seconds INTEGER, event TEXT, finished_at TEXT DEFAULT CURRENT_TIMESTAMP,
      phase TEXT,                      -- where a failure happened: source | clone | install | fetch | build | compare
      recipe TEXT,                     -- the recipe that built it (recipes.mjs: id@hash of what it runs); null = the generic build
      recipe_event TEXT,               -- the signed event the recipe came as (recipe-events.mjs); null = a file of recipes/
      PRIMARY KEY (ecosystem, name, version)
    );
    CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT);
    -- versions a recipe says it covers and cannot build: its repository has no tag for the version, or
    -- no package of that name at the tag. No result: the generic build keeps these versions.
    CREATE TABLE IF NOT EXISTS recipe_skips (
      recipe TEXT NOT NULL, ecosystem TEXT NOT NULL, name TEXT NOT NULL, version TEXT NOT NULL, reason TEXT, at TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (recipe, ecosystem, name, version)
    );
    -- the newest signed event seen per recipe id and author (recipe-events.mjs): a relay that later serves an older one, or
    -- none, changes nothing. Rows are replaced by newer ones and never removed, so this also holds for an author who was
    -- off the list for a while.
    CREATE TABLE IF NOT EXISTS recipe_events (recipe_id TEXT NOT NULL, author TEXT NOT NULL, event TEXT NOT NULL, PRIMARY KEY (recipe_id, author));
    -- every attempt, kept
    CREATE TABLE IF NOT EXISTS attempts (
      id INTEGER PRIMARY KEY, ecosystem TEXT, name TEXT, version TEXT, result TEXT, note TEXT, seconds INTEGER, finished_at TEXT DEFAULT CURRENT_TIMESTAMP,
      recipe TEXT
    );
  `);
  if (!db.prepare(`SELECT 1 FROM pragma_table_info('rebuilds') WHERE name = 'phase'`).get()) {
    // a database from before the column: the note names the step
    db.exec(`ALTER TABLE rebuilds ADD COLUMN phase TEXT;
      UPDATE rebuilds SET phase = 'clone' WHERE result = 'failed' AND (note LIKE 'clone failed:%' OR note LIKE 'The clone step %');
      UPDATE rebuilds SET phase = 'install' WHERE result = 'failed' AND (note LIKE 'install failed:%' OR note LIKE 'The install step %');`);
  }
  if (!db.prepare(`SELECT 1 FROM pragma_table_info('rebuilds') WHERE name = 'recipe'`).get()) db.exec(`ALTER TABLE rebuilds ADD COLUMN recipe TEXT`);
  if (!db.prepare(`SELECT 1 FROM pragma_table_info('rebuilds') WHERE name = 'recipe_event'`).get()) db.exec(`ALTER TABLE rebuilds ADD COLUMN recipe_event TEXT`);
  if (!db.prepare(`SELECT 1 FROM pragma_table_info('attempts') WHERE name = 'recipe'`).get()) db.exec(`ALTER TABLE attempts ADD COLUMN recipe TEXT`);
  if (!db.prepare(`SELECT 1 FROM pragma_table_info('candidates') WHERE name = 'wallet_ids'`).get()) db.exec(`ALTER TABLE candidates ADD COLUMN wallet_ids TEXT`);
  if (!db.prepare(`SELECT 1 FROM meta WHERE key = 'rejudged_failures'`).get()) {
    // The failures of the first version say little: a workspace member was compared with bare
    // source, a "build" script no publish hook calls was not run, a package the registry names
    // no directory for was looked for at the root (rebuild.mjs). They are dropped once, so
    // these versions are built and judged again; what fails from here on stands.
    db.exec(`DELETE FROM rebuilds WHERE result = 'failed';
      INSERT INTO meta (key, value) VALUES ('rejudged_failures', datetime('now'));`);
  }
  return db;
}

export function saveCandidates(db, rows) {
  const ins = db.prepare(`INSERT INTO candidates (ecosystem, name, version, wallets, wallets_any, wallet_ids, synced_at)
    VALUES (@ecosystem, @name, @version, @wallets, @wallets_any, @wallet_ids, CURRENT_TIMESTAMP)
    ON CONFLICT(ecosystem, name, version) DO UPDATE SET wallets = excluded.wallets, wallets_any = excluded.wallets_any, wallet_ids = excluded.wallet_ids, synced_at = CURRENT_TIMESTAMP`);
  db.transaction(() => {
    for (const { walletIds, ...r } of rows) ins.run({ ...r, wallet_ids: walletIds ? JSON.stringify(walletIds) : null });
  })();
}

// A failure in a step that needs the network (listing the repository, clone, install) may be
// the network's or the host's, not the package's: it gets one more try, a day later at the
// earliest. A second failure stands.
// (IFNULL: a failure without a phase must compare as "no", not as SQL's unknown, which NOT leaves unknown.)
// (r.recipe IS NULL, and attempts without a recipe: a recipe's failure is the recipe's to try again, below,
// and its tries do not use up this one.)
const SECOND_TRY = `r.result = 'failed' AND r.recipe IS NULL AND IFNULL(r.phase, '') IN ('source', 'clone', 'install') AND r.finished_at < datetime('now', '-1 day')
  AND (SELECT COUNT(*) FROM attempts a WHERE a.ecosystem = r.ecosystem AND a.name = r.name AND a.version = r.version AND a.recipe IS NULL) < 2`;
// A failure of a recipe that is no longer in use (changed, narrowed, removed, its author off the list): nobody
// would try the version again, so the generic build takes it back.
const ORPHANED = `r.result != 'reproduced' AND r.recipe IS NOT NULL AND r.recipe NOT IN (SELECT value FROM json_each(@keys))`;

/**
 * Versions still to build: most wallets first, then name and version. Google's and earlier results are
 * skipped unless retry. `recipeKeys`: the keys of the recipes in use, when the caller knows them; a result
 * that is the failure of any other recipe then counts as not tried.
 */
export function pending(db, { ecosystem = 'npm', limit = 10, retry = false, scope = 'app', minWallets = 1, recipeKeys = null } = {}) {
  const col = scope === 'any' ? 'wallets_any' : 'wallets';
  const tried = recipeKeys ? `NOT (${SECOND_TRY}) AND NOT (${ORPHANED})` : `NOT (${SECOND_TRY})`;
  return db.prepare(`
    SELECT c.ecosystem, c.name, c.version, c.${col} AS wallets FROM candidates c
    WHERE c.ecosystem = @ecosystem AND c.${col} >= @minWallets
      AND NOT EXISTS (SELECT 1 FROM google g WHERE g.ecosystem = c.ecosystem AND g.name = c.name AND g.version = c.version)
      AND NOT EXISTS (SELECT 1 FROM rebuilds r WHERE r.ecosystem = c.ecosystem AND r.name = c.name AND r.version = c.version
        AND ${retry ? `r.result = 'reproduced'` : tried})
    ORDER BY c.${col} DESC, c.name, c.version LIMIT @limit`).all({ ecosystem, minWallets, limit, ...(recipeKeys && !retry ? { keys: JSON.stringify(recipeKeys) } : {}) });
}

// The same for a recipe's steps with a network, counted per recipe: what the generic build tried before does not use up the second try.
const RECIPE_SECOND_TRY = `r.result = 'failed' AND IFNULL(r.phase, '') IN ('clone', 'fetch') AND r.finished_at < datetime('now', '-1 day')
  AND (SELECT COUNT(*) FROM attempts a WHERE a.ecosystem = r.ecosystem AND a.name = r.name AND a.version = r.version AND a.recipe = r.recipe) < 2`;

/**
 * Versions a recipe covers and has not settled: not reproduced by anyone, and not yet tried
 * with this recipe as it is now (a changed recipe has another key, so its failures are built
 * again; a failure of the generic build never stands in a recipe's way), and not known to be
 * something it cannot build (recipe_skips). `covers(name, version)` is the recipe's own test.
 * Most wallets first.
 */
export function pendingForRecipe(db, recipeKey, covers, { ecosystem = 'npm', scope = 'app', minWallets = 1, retry = false } = {}) {
  const col = scope === 'any' ? 'wallets_any' : 'wallets';
  return db.prepare(`
    SELECT c.ecosystem, c.name, c.version, c.${col} AS wallets FROM candidates c
    WHERE c.ecosystem = @ecosystem AND c.${col} >= @minWallets
      AND NOT EXISTS (SELECT 1 FROM google g WHERE g.ecosystem = c.ecosystem AND g.name = c.name AND g.version = c.version)
      AND NOT EXISTS (SELECT 1 FROM rebuilds r WHERE r.ecosystem = c.ecosystem AND r.name = c.name AND r.version = c.version
        AND (r.result = 'reproduced' OR (${retry ? '0' : `IFNULL(r.recipe, '') = @key AND NOT (${RECIPE_SECOND_TRY})`})))
      ${retry ? '' : `AND NOT EXISTS (SELECT 1 FROM recipe_skips s WHERE s.recipe = @key AND s.ecosystem = c.ecosystem AND s.name = c.name AND s.version = c.version)`}
    ORDER BY c.${col} DESC, c.name, c.version`).all({ ecosystem, minWallets, ...(retry ? {} : { key: recipeKey }) }).filter(c => covers(c.name, c.version));
}

/** A version the recipe covers by name and cannot build (no tag, not in its repository): remembered, so it is not planned again. */
export function saveRecipeSkip(db, recipeKey, { ecosystem = 'npm', name, version }, reason) {
  db.prepare(`INSERT OR REPLACE INTO recipe_skips (recipe, ecosystem, name, version, reason) VALUES (?, ?, ?, ?, ?)`).run(recipeKey, ecosystem, name, version, reason);
}

/** The signed events kept from earlier, and keeping newer ones: [recipe id, author, event] each. Nothing is removed. */
export const storedRecipeEvents = (db) => db.prepare(`SELECT event FROM recipe_events`).all().flatMap(r => { try { return [JSON.parse(r.event)]; } catch { return []; } });
export function saveRecipeEvents(db, events) {
  db.transaction(() => {
    const ins = db.prepare(`INSERT OR REPLACE INTO recipe_events (recipe_id, author, event) VALUES (?, ?, ?)`);
    for (const [id, author, event] of events) ins.run(id, author, JSON.stringify(event));
  })();
}

export function saveRebuild(db, r) {
  db.transaction(() => {
    db.prepare(`INSERT OR REPLACE INTO rebuilds (ecosystem, name, version, result, note, artifact, sha256, repo_url, ref, commit_sha, toolchain, sandbox, log, seconds, phase, recipe, recipe_event, finished_at)
      VALUES (@ecosystem, @name, @version, @result, @note, @artifact, @sha256, @repoUrl, @ref, @commit, @toolchain, @sandbox, @log, @seconds, @phase, @recipe, @recipeEvent, CURRENT_TIMESTAMP)`)
      .run({ artifact: null, sha256: null, repoUrl: null, ref: null, commit: null, toolchain: null, sandbox: null, log: null, seconds: null, phase: null, recipe: null, recipeEvent: null, ...r });
    db.prepare(`INSERT INTO attempts (ecosystem, name, version, result, note, seconds, recipe) VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .run(r.ecosystem, r.name, r.version, r.result, r.note ?? null, r.seconds ?? null, r.recipe ?? null);
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
