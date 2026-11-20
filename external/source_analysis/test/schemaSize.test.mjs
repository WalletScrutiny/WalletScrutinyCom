import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import Database from 'better-sqlite3';
import { initDatabase, saveDependencies, getDependencies } from '../ddbbUtils.mjs';

const tmp = () => path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'schema-size-')), 'assets.db');
const sqlOf = (db, name) => db.prepare('SELECT sql FROM sqlite_master WHERE name = ?').get(name)?.sql;
const entry = (name, extra = {}) => ({ ecosystem: 'npm', lockfile: 'yarn.lock', name, version: '1.0.0', resolved: `https://r/${name}`, integrity: `sha512-${name}`, direct: true, dev: false, scope: 'app', dependants: null, tier: 'hash-pinned', ...extra });

// The shape a server database has from before: a rowid app_dependencies table
// and the four unused indexes on assets.
function legacyDatabase(file) {
  const db = initDatabase(file);
  db.exec(`
    DROP TABLE app_dependencies;
    CREATE TABLE app_dependencies (
      app_id TEXT NOT NULL, version TEXT NOT NULL, package_id INTEGER NOT NULL REFERENCES packages(id),
      lockfile TEXT NOT NULL, direct INTEGER, dev INTEGER, tier TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP, scope TEXT, dependants TEXT,
      PRIMARY KEY (app_id, version, package_id, lockfile)
    );
    CREATE INDEX idx_app_dependencies_package ON app_dependencies(package_id);
    CREATE INDEX idx_app_version ON assets(app_id, version);
    CREATE INDEX idx_app_asset ON assets(app_id, asset_name);
    CREATE INDEX idx_architecture ON assets(architecture);
    CREATE INDEX idx_os ON assets(os);
  `);
  return db;
}

test('a new database has no unused assets indexes and a WITHOUT ROWID app_dependencies', () => {
  const db = initDatabase(tmp());
  for (const index of ['idx_app_version', 'idx_app_asset', 'idx_architecture', 'idx_os']) assert.equal(sqlOf(db, index), undefined, index);
  assert.ok(sqlOf(db, 'idx_unique_asset'));
  assert.match(sqlOf(db, 'app_dependencies'), /WITHOUT ROWID/);
  assert.equal(sqlOf(db, 'sqlite_autoindex_app_dependencies_1'), undefined, 'no second copy of the key');
  db.close();
});

test('an existing database loses the unused indexes, keeps every dependency row, and shrinks', () => {
  const file = tmp();
  const legacy = legacyDatabase(file);
  legacy.prepare("INSERT INTO assets (app_id, version, asset_name, sha256, source) VALUES ('a', '1', 'a.apk', 'x', 'github')").run();
  const insertPackage = legacy.prepare("INSERT INTO packages (ecosystem, name, version, resolved, integrity) VALUES ('npm', ?, '1.0.0', ?, ?)");
  const insertDep = legacy.prepare("INSERT INTO app_dependencies (app_id, version, package_id, lockfile, direct, dev, tier, scope, dependants) VALUES (?, ?, ?, 'yarn.lock', 1, 0, 'hash-pinned', 'app', ?)");
  for (let i = 0; i < 3000; i++) {
    const id = insertPackage.run(`pkg${i}`, `https://registry/pkg${i}`, `sha512-${i}`.padEnd(90, 'x')).lastInsertRowid;
    for (const version of ['v1', 'v2']) insertDep.run('some.app.id', version, id, i % 7 ? null : '["pkg0"]');
  }
  const before = legacy.prepare('SELECT * FROM app_dependencies ORDER BY app_id, version, package_id').all();
  legacy.close();
  const sizeBefore = fs.statSync(file).size;

  const db = initDatabase(file);
  const after = db.prepare('SELECT * FROM app_dependencies ORDER BY app_id, version, package_id').all();
  assert.deepEqual(after, before, 'every row and column is carried over');
  assert.match(sqlOf(db, 'app_dependencies'), /WITHOUT ROWID/);
  assert.equal(sqlOf(db, 'app_dependencies_rowid'), undefined, 'the old table is gone');
  assert.ok(sqlOf(db, 'idx_app_dependencies_package'), 'the package index is back');
  for (const index of ['idx_app_version', 'idx_app_asset', 'idx_architecture', 'idx_os']) assert.equal(sqlOf(db, index), undefined, index);
  assert.equal(db.prepare('PRAGMA integrity_check').get().integrity_check, 'ok');
  assert.equal(db.pragma('foreign_keys', { simple: true }), 1, 'foreign keys are back on');
  assert.equal(db.prepare('PRAGMA freelist_count').get().freelist_count, 0, 'VACUUM gave the pages back');
  assert.ok(fs.statSync(file).size < sizeBefore, `file shrank (${sizeBefore} -> ${fs.statSync(file).size})`);
  // The code that uses the table still works on the rebuilt one.
  saveDependencies(db, 'new.app', 'v1', [{ ecosystem: 'npm', entries: [entry('a'), entry('b', { dev: true })] }]);
  assert.deepEqual(getDependencies(db, 'new.app', 'v1').map(r => r.name), ['a', 'b']);
  db.close();

  const again = initDatabase(file);
  assert.equal(again.prepare('SELECT COUNT(*) n FROM app_dependencies').get().n, before.length + 2, 'the second start does not rebuild again');
  again.close();
});

test('a failed rebuild leaves the table as it was', () => {
  const file = tmp();
  const legacy = legacyDatabase(file);
  legacy.exec(`ALTER TABLE app_dependencies ADD COLUMN extra TEXT;
    INSERT INTO packages (ecosystem, name) VALUES ('npm', 'p');
    INSERT INTO app_dependencies (app_id, version, package_id, lockfile, tier, extra) VALUES ('a', 'v', 1, 'l', 't', 'kept');`);
  legacy.close();
  assert.throws(() => initDatabase(file), /app_dependencies rebuild failed, database left as it was/);
  const raw = new Database(file);
  assert.doesNotMatch(sqlOf(raw, 'app_dependencies'), /WITHOUT ROWID/);
  assert.equal(raw.prepare('SELECT extra FROM app_dependencies').get().extra, 'kept');
  assert.equal(sqlOf(raw, 'app_dependencies_rowid'), undefined);
  raw.close();
});

test('a dependency row whose package is gone is carried over, not a reason to stop', () => {
  const file = tmp();
  const legacy = legacyDatabase(file);
  legacy.pragma('foreign_keys = OFF');
  legacy.exec("INSERT INTO app_dependencies (app_id, version, package_id, lockfile, tier) VALUES ('a', 'v', 999, 'l', 't')");
  legacy.close();
  const db = initDatabase(file);
  assert.equal(db.prepare('SELECT COUNT(*) n FROM app_dependencies').get().n, 1);
  assert.equal(db.pragma('foreign_keys', { simple: true }), 1);
  db.close();
});
