import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { startOfTodayUtc } from './utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = process.env.WS_NOTIFICATIONS_DB_PATH ?? join(__dirname, 'notifications.db');
const META_SINCE_KEY = 'since';

let db = null;

function parseInitialSince() {
  const envValue = process.env.WS_NOTIFICATIONS_INITIAL_SINCE;
  if (envValue !== undefined && envValue !== '') {
    const parsed = Number(envValue);
    if (!Number.isFinite(parsed) || parsed < 0) {
      throw new Error(`Invalid WS_NOTIFICATIONS_INITIAL_SINCE: ${envValue}`);
    }
    return Math.floor(parsed);
  }
  return startOfTodayUtc();
}

function migrateNotifiedEventsTableIfNeeded(database) {
  const columns = database.prepare('PRAGMA table_info(notified_events)').all();
  if (columns.length === 0) {
    return;
  }
  if (columns.length === 1 && columns[0].name === 'event_id') {
    return;
  }
  database.exec(`
    CREATE TABLE notified_events_migrated (
      event_id TEXT PRIMARY KEY
    );
    INSERT OR IGNORE INTO notified_events_migrated (event_id)
    SELECT event_id FROM notified_events;
    DROP TABLE notified_events;
    ALTER TABLE notified_events_migrated RENAME TO notified_events;
  `);
}

/**
 * Initialize the database and create tables if they do not exist.
 * Seeds the since cursor on first run.
 * @returns {Database.Database}
 */
export function initDb() {
  if (db) return db;
  db = new Database(DB_PATH);
  db.exec(`
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS notified_events (
      event_id TEXT PRIMARY KEY
    );
  `);

  migrateNotifiedEventsTableIfNeeded(db);

  const row = db.prepare('SELECT value FROM meta WHERE key = ?').get(META_SINCE_KEY);
  if (!row) {
    const initialSince = parseInitialSince();
    db.prepare('INSERT INTO meta (key, value) VALUES (?, ?)').run(META_SINCE_KEY, String(initialSince));
  }

  return db;
}

/**
 * Close the database connection. Used in tests.
 */
export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

/**
 * @returns {number} Stored since cursor (unix seconds).
 */
export function getSince() {
  const database = initDb();
  const row = database.prepare('SELECT value FROM meta WHERE key = ?').get(META_SINCE_KEY);
  if (!row) {
    throw new Error('since cursor missing from meta table');
  }
  const parsed = Number(row.value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid since value in meta table: ${row.value}`);
  }
  return parsed;
}

/**
 * Update the since cursor to the given unix timestamp.
 * @param {number} since
 */
export function updateSince(since) {
  const database = initDb();
  database.prepare('UPDATE meta SET value = ? WHERE key = ?').run(String(since), META_SINCE_KEY);
}

/**
 * @param {string} eventId
 * @returns {boolean}
 */
export function isNotified(eventId) {
  const database = initDb();
  const row = database.prepare('SELECT 1 FROM notified_events WHERE event_id = ?').get(eventId);
  return Boolean(row);
}

/**
 * Record that a verification event was notified.
 * @param {string} eventId
 */
export function markNotified(eventId) {
  const database = initDb();
  database.prepare(`
    INSERT OR IGNORE INTO notified_events (event_id)
    VALUES (?)
  `).run(eventId);
}

/**
 * Reset database state. Test helper only.
 */
export function resetDbForTests() {
  closeDb();
  initDb();
  const database = getDb();
  database.exec('DELETE FROM notified_events; DELETE FROM meta;');
  const initialSince = parseInitialSince();
  database.prepare('INSERT INTO meta (key, value) VALUES (?, ?)').run(META_SINCE_KEY, String(initialSince));
}

export function getDb() {
  return initDb();
}
