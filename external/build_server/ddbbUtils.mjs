import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = process.env.BUILD_SERVER_DB_PATH ?? join(__dirname, 'verifications.db');

let db = null;

/**
 * Initialize the database and create the verifications table if it does not exist.
 * @returns {Database.Database} The database instance
 */
export function initDb() {
  if (db) return db;
  db = new Database(DB_PATH);
  db.exec(`
    CREATE TABLE IF NOT EXISTS verifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      appId TEXT NOT NULL,
      platform TEXT NOT NULL,
      version TEXT NOT NULL,
      arch TEXT NOT NULL,
      type TEXT NOT NULL,
      verificationId TEXT NOT NULL,
      buildScriptEventId TEXT NOT NULL,
      endResult TEXT NOT NULL,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_verifications_app_platform_version
      ON verifications(appId, platform, version);
    CREATE INDEX IF NOT EXISTS idx_verifications_verification_id
      ON verifications(verificationId);
  `);
  return db;
}

/**
 * Get the database instance. Calls initDb() if not yet initialized.
 * @returns {Database.Database}
 */
export function getDb() {
  return initDb();
}

/**
 * Insert a new verification record.
 * @param {Object} row - { appId, platform, version, arch, type, verificationId, buildScriptEventId, endResult }
 * @returns {number} The inserted row id
 */
export function insert(row) {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT INTO verifications (appId, platform, version, arch, type, verificationId, buildScriptEventId, endResult)
    VALUES (@appId, @platform, @version, @arch, @type, @verificationId, @buildScriptEventId, @endResult)
  `);
  const result = stmt.run(row);
  return result.lastInsertRowid;
}

/**
 * Find a verification by its primary key id.
 * @param {number} id
 * @returns {Object|undefined}
 */
export function findById(id) {
  const database = getDb();
  const stmt = database.prepare('SELECT * FROM verifications WHERE id = ?');
  return stmt.get(id);
}

/**
 * Find a verification by verificationId.
 * @param {string} verificationId
 * @returns {Object|undefined}
 */
export function findByVerificationId(verificationId) {
  const database = getDb();
  const stmt = database.prepare('SELECT * FROM verifications WHERE verificationId = ?');
  return stmt.get(verificationId);
}

/**
 * Find a queued or errored verification attempt with the same build inputs.
 * @param {Object} row - { appId, platform, version, arch, type, verificationId, buildScriptEventId }
 * @returns {Object|undefined}
 */
export function findQueuedOrErroredSimilarAttempt(row) {
  const database = getDb();
  const stmt = database.prepare(`
    SELECT *
    FROM verifications
    WHERE appId = @appId
      AND platform = @platform
      AND version = @version
      AND arch = @arch
      AND type = @type
      AND verificationId = @verificationId
      AND buildScriptEventId = @buildScriptEventId
      AND endResult IN ('queued', 'error')
    ORDER BY id DESC
    LIMIT 1
  `);
  return stmt.get(row);
}

/**
 * Find all verifications, optionally filtered by appId and/or platform.
 * @param {Object} [options] - { appId?, platform?, limit?, offset? }
 * @returns {Object[]}
 */
export function findAll(options = {}) {
  const database = getDb();
  const { appId, platform, limit, offset } = options;
  let sql = 'SELECT * FROM verifications WHERE 1=1';
  const params = [];

  if (appId != null) {
    sql += ' AND appId = ?';
    params.push(appId);
  }
  if (platform != null) {
    sql += ' AND platform = ?';
    params.push(platform);
  }
  sql += ' ORDER BY id DESC';
  if (limit != null) {
    sql += ' LIMIT ?';
    params.push(limit);
  }
  if (offset != null) {
    sql += ' OFFSET ?';
    params.push(offset);
  }

  const stmt = database.prepare(sql);
  return stmt.all(...params);
}

/**
 * Update a verification by id. Only provided fields are updated.
 * @param {number} id
 * @param {Object} updates - { appId?, platform?, version?, arch?, type?, verificationId?, buildScriptEventId?, endResult? }
 * @returns {number} Number of rows updated (0 or 1)
 */
export function update(id, updates) {
  const database = getDb();
  const allowed = ['appId', 'platform', 'version', 'arch', 'type', 'verificationId', 'buildScriptEventId', 'endResult'];
  const setParts = [];
  const params = [];

  for (const key of allowed) {
    if (updates[key] !== undefined) {
      setParts.push(`${key} = ?`);
      params.push(updates[key]);
    }
  }
  if (setParts.length === 0) return 0;

  setParts.push("updatedAt = datetime('now')");
  params.push(id);
  const sql = `UPDATE verifications SET ${setParts.join(', ')} WHERE id = ?`;
  const stmt = database.prepare(sql);
  const result = stmt.run(...params);
  return result.changes;
}

/**
 * Delete a verification by id.
 * @param {number} id
 * @returns {number} Number of rows deleted (0 or 1)
 */
export function deleteById(id) {
  const database = getDb();
  const stmt = database.prepare('DELETE FROM verifications WHERE id = ?');
  const result = stmt.run(id);
  return result.changes;
}

/**
 * Close the database connection. Call when shutting down the process.
 */
export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}
