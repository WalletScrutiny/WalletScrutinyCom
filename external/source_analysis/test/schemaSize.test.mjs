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

// The shapes a server database has from before: app_dependencies as a table
// with the app, version and lockfile text in every row. First a rowid table
// next to four unused indexes on assets, then WITHOUT ROWID and no such indexes.
function legacyDatabase(file, { withoutRowid = false, columns = 'scope TEXT, dependants TEXT,' } = {}) {
  const db = initDatabase(file);
  db.exec(`
    DROP VIEW app_dependencies;
    DROP TABLE lockfile_dependencies;
    DROP TABLE app_lockfiles;
    CREATE TABLE app_dependencies (
      app_id TEXT NOT NULL, version TEXT NOT NULL, package_id INTEGER NOT NULL REFERENCES packages(id),
      lockfile TEXT NOT NULL, direct INTEGER, dev INTEGER, tier TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP, ${columns}
      PRIMARY KEY (app_id, version, package_id, lockfile)
    ) ${withoutRowid ? 'WITHOUT ROWID' : ''};
    CREATE INDEX idx_app_dependencies_package ON app_dependencies(package_id);
  `);
  if (!withoutRowid) {
    db.exec(`
      CREATE INDEX idx_app_version ON assets(app_id, version);
      CREATE INDEX idx_app_asset ON assets(app_id, asset_name);
      CREATE INDEX idx_architecture ON assets(architecture);
      CREATE INDEX idx_os ON assets(os);
    `);
  }
  return db;
}
const typeOf = (db, name) => db.prepare('SELECT type FROM sqlite_master WHERE name = ?').get(name)?.type;
const allRows = (db) => db.prepare('SELECT * FROM app_dependencies ORDER BY app_id, version, lockfile, package_id').all();

test('a new database has no unused assets indexes and keeps dependencies by lockfile id', () => {
  const db = initDatabase(tmp());
  for (const index of ['idx_app_version', 'idx_app_asset', 'idx_architecture', 'idx_os']) assert.equal(sqlOf(db, index), undefined, index);
  assert.ok(sqlOf(db, 'idx_unique_asset'));
  assert.equal(typeOf(db, 'app_dependencies'), 'view');
  assert.match(sqlOf(db, 'lockfile_dependencies'), /WITHOUT ROWID/);
  assert.deepEqual(db.prepare('PRAGMA table_info(lockfile_dependencies)').all().filter(c => c.type === 'TEXT').map(c => c.name), ['tier', 'scope', 'dependants', 'covered_by'],
    'no app, version or lockfile text per dependency row');
  db.close();
});

for (const withoutRowid of [false, true]) {
  test(`an existing database (${withoutRowid ? 'WITHOUT ROWID table' : 'rowid table, unused indexes'}) keeps every dependency row and shrinks`, () => {
    const file = tmp();
    const legacy = legacyDatabase(file, { withoutRowid });
    legacy.prepare("INSERT INTO assets (app_id, version, asset_name, sha256, source) VALUES ('a', '1', 'a.apk', 'x', 'github')").run();
    const insertPackage = legacy.prepare("INSERT INTO packages (ecosystem, name, version, resolved, integrity) VALUES ('npm', ?, '1.0.0', ?, ?)");
    const insertDep = legacy.prepare("INSERT INTO app_dependencies (app_id, version, package_id, lockfile, direct, dev, tier, scope, dependants, created_at) VALUES (?, ?, ?, ?, 1, 0, 'hash-pinned', 'app', ?, ?)");
    for (let i = 0; i < 3000; i++) {
      const id = insertPackage.run(`pkg${i}`, `https://registry/pkg${i}`, `sha512-${i}`.padEnd(90, 'x')).lastInsertRowid;
      for (const version of ['v1', 'v2']) insertDep.run('some.app.id', version, id, i % 3 ? 'yarn.lock' : 'ios/Podfile.lock', i % 7 ? null : '["pkg0"]', `2026-01-0${version[1]} 10:00:00`);
    }
    insertDep.run('other.app', 'v1', 1, 'yarn.lock', null, '2026-02-01 10:00:00');
    const before = allRows(legacy);
    legacy.close();
    const sizeBefore = fs.statSync(file).size;

    const db = initDatabase(file);
    assert.deepEqual(allRows(db).map(({ covered_by, ...r }) => r), before, 'every row and column reads as before');
    assert.ok(allRows(db).every(r => r.covered_by === null), 'and no row is covered');
    assert.equal(typeOf(db, 'app_dependencies'), 'view');
    assert.equal(sqlOf(db, 'idx_app_dependencies_package'), undefined, 'the old index went with the table');
    assert.equal(db.prepare('SELECT COUNT(*) n FROM app_lockfiles').get().n, 5, 'one row per lockfile of a release');
    for (const index of ['idx_app_version', 'idx_app_asset', 'idx_architecture', 'idx_os']) assert.equal(sqlOf(db, index), undefined, index);
    assert.equal(db.prepare('PRAGMA integrity_check').get().integrity_check, 'ok');
    assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(), []);
    assert.equal(db.pragma('foreign_keys', { simple: true }), 1, 'foreign keys are back on');
    assert.equal(db.prepare('PRAGMA freelist_count').get().freelist_count, 0, 'VACUUM gave the pages back');
    assert.ok(fs.statSync(file).size < sizeBefore, `file shrank (${sizeBefore} -> ${fs.statSync(file).size})`);
    // The code that uses the table still works on the moved rows.
    assert.equal(getDependencies(db, 'some.app.id', 'v2').length, 3000);
    saveDependencies(db, 'new.app', 'v1', [{ ecosystem: 'npm', entries: [entry('a'), entry('b', { dev: true })] }]);
    assert.deepEqual(getDependencies(db, 'new.app', 'v1').map(r => r.name), ['a', 'b']);
    db.close();

    const again = initDatabase(file);
    assert.equal(again.prepare('SELECT COUNT(*) n FROM app_dependencies').get().n, before.length + 2, 'the second start does not move anything');
    again.close();
  });
}

test('a failed move leaves the table as it was', () => {
  const file = tmp();
  const legacy = legacyDatabase(file);
  legacy.exec(`ALTER TABLE app_dependencies ADD COLUMN extra TEXT;
    INSERT INTO packages (ecosystem, name) VALUES ('npm', 'p');
    INSERT INTO app_dependencies (app_id, version, package_id, lockfile, tier, extra) VALUES ('a', 'v', 1, 'l', 't', 'kept');`);
  legacy.close();
  assert.throws(() => initDatabase(file), /app_dependencies move failed, database left as it was: no place for the column extra/);
  const raw = new Database(file);
  assert.equal(typeOf(raw, 'app_dependencies'), 'table');
  assert.equal(raw.prepare('SELECT extra FROM app_dependencies').get().extra, 'kept');
  assert.equal(typeOf(raw, 'app_lockfiles'), undefined);
  assert.equal(typeOf(raw, 'lockfile_dependencies'), undefined);
  raw.close();
});

test('a move that fails halfway is rolled back', () => {
  const file = tmp();
  const legacy = legacyDatabase(file);
  // The lockfile rows go in, the dependency rows cannot.
  legacy.exec(`CREATE TABLE lockfile_dependencies (unrelated TEXT);
    INSERT INTO packages (ecosystem, name) VALUES ('npm', 'p');
    INSERT INTO app_dependencies (app_id, version, package_id, lockfile, tier) VALUES ('a', 'v', 1, 'l', 't');`);
  legacy.close();
  assert.throws(() => initDatabase(file), /app_dependencies move failed, database left as it was/);
  const raw = new Database(file);
  assert.equal(typeOf(raw, 'app_dependencies'), 'table');
  assert.equal(raw.prepare('SELECT COUNT(*) n FROM app_dependencies').get().n, 1);
  assert.equal(typeOf(raw, 'app_lockfiles'), undefined, 'the lockfile rows written before the failure are gone');
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

test('a table from before the scope and dependants columns is moved too', () => {
  const file = tmp();
  const legacy = legacyDatabase(file, { columns: '' });
  legacy.exec(`INSERT INTO packages (ecosystem, name) VALUES ('npm', 'p');
    INSERT INTO app_dependencies (app_id, version, package_id, lockfile, direct, tier) VALUES ('a', 'v', 1, 'l', 1, 't');`);
  legacy.close();
  const db = initDatabase(file);
  const [row] = allRows(db);
  assert.deepEqual({ ...row, created_at: null }, { app_id: 'a', version: 'v', package_id: 1, lockfile: 'l', direct: 1, dev: null, tier: 't', created_at: null, scope: null, dependants: null, covered_by: null });
  db.close();
});

test('created_at of a moved lockfile is the earliest of its rows', () => {
  const file = tmp();
  const legacy = legacyDatabase(file);
  legacy.exec(`INSERT INTO packages (ecosystem, name) VALUES ('npm', 'p'), ('npm', 'q');
    INSERT INTO app_dependencies (app_id, version, package_id, lockfile, tier, created_at) VALUES
      ('a', 'v', 1, 'l', 't', '2026-03-01 10:00:02'), ('a', 'v', 2, 'l', 't', '2026-03-01 10:00:01');`);
  legacy.close();
  const db = initDatabase(file);
  assert.deepEqual(allRows(db).map(r => r.created_at), ['2026-03-01 10:00:01', '2026-03-01 10:00:01']);
  db.close();
});

test('saving a release again replaces its lockfile rows and leaves other releases alone', () => {
  const db = initDatabase(tmp());
  saveDependencies(db, 'app', 'v1', [{ entries: [entry('a'), entry('b', { lockfile: 'ios/Podfile.lock' })] }]);
  saveDependencies(db, 'app', 'v2', [{ entries: [entry('a')] }]);
  saveDependencies(db, 'app', 'v1', [{ entries: [entry('a', { lockfile: 'package-lock.json' }), entry('c', { lockfile: 'package-lock.json' })] }]);
  assert.deepEqual(db.prepare('SELECT version, lockfile FROM app_lockfiles ORDER BY version, lockfile').all(),
    [{ version: 'v1', lockfile: 'package-lock.json' }, { version: 'v2', lockfile: 'yarn.lock' }]);
  assert.deepEqual(getDependencies(db, 'app', 'v1').map(r => `${r.lockfile}:${r.name}`), ['package-lock.json:a', 'package-lock.json:c']);
  assert.deepEqual(getDependencies(db, 'app', 'v2').map(r => `${r.lockfile}:${r.name}`), ['yarn.lock:a']);
  assert.equal(db.prepare('SELECT COUNT(*) n FROM lockfile_dependencies').get().n, 3, 'no rows left behind');
  for (const r of db.prepare('SELECT created_at FROM app_dependencies').all()) assert.match(r.created_at, /^\d{4}-\d\d-\d\d \d\d:\d\d:\d\d$/);
  // One lockfile named by two analyses of a release is still one lockfile.
  saveDependencies(db, 'app', 'v3', [{ entries: [entry('a')] }, { entries: [entry('b')] }]);
  assert.deepEqual(getDependencies(db, 'app', 'v3').map(r => `${r.lockfile}:${r.name}`), ['yarn.lock:a', 'yarn.lock:b']);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM app_lockfiles WHERE version = 'v3'").get().n, 1);
  saveDependencies(db, 'app', 'v1', []);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM app_lockfiles WHERE version = 'v1'").get().n, 0, 'a release saved without dependencies has no lockfile rows');
  db.close();
});

// A database from before covered_by (issue 1027): lockfile_dependencies and
// the view as they were. It opens, gets the column, and its rows read NULL.
test('a lockfile_dependencies table from before covered_by gets the column, its rows NULL', () => {
  const file = tmp();
  const old = initDatabase(file);
  saveDependencies(old, 'app', 'v1', [{ entries: [entry('a')] }]);
  old.exec(`
    DROP VIEW app_dependencies;
    ALTER TABLE lockfile_dependencies DROP COLUMN covered_by;
    CREATE VIEW app_dependencies AS
      SELECT l.app_id, l.version, d.package_id, l.lockfile, d.direct, d.dev, d.tier, l.created_at, d.scope, d.dependants
      FROM lockfile_dependencies d JOIN app_lockfiles l ON l.id = d.lockfile_id;
  `);
  old.close();
  const db = initDatabase(file);
  assert.ok(db.prepare('PRAGMA table_info(lockfile_dependencies)').all().some(c => c.name === 'covered_by'));
  assert.deepEqual(getDependencies(db, 'app', 'v1').map(r => [r.name, r.covered_by]), [['a', null]], 'the view was made again with the column');
  saveDependencies(db, 'app', 'v2', [{ entries: [entry('b', { lockfile: 'src/r.txt', coveredBy: 'pinned/r.txt' })] }]);
  assert.equal(getDependencies(db, 'app', 'v2')[0].covered_by, 'pinned/r.txt');
  db.close();
  const again = initDatabase(file);
  assert.equal(again.prepare('SELECT COUNT(*) n FROM app_dependencies').get().n, 2, 'a second start changes nothing');
  again.close();
});
