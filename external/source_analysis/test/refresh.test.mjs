// Advisories refreshed between passes (refresh.mjs): only the wallets whose
// advisories changed are exported and published.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { initDatabase, saveAppList, saveDependencies, saveVulnerabilities, recordAnalysis } from '../ddbbUtils.mjs';
import { exportAll } from '../export.mjs';
import { refreshAdvisories } from '../refresh.mjs';
import { markerPathFor, readMarker } from '../publish.mjs';

const entry = (name, version) => ({ ecosystem: 'npm', lockfile: 'package-lock.json', name, version, resolved: `https://registry.npmjs.org/${name}/-/${name}-${version}.tgz`, integrity: `sha512-${name}${version}`, direct: true, dev: false, scope: 'app', dependants: null, tier: 'hash-pinned' });
const finding = (name, version, id, extra = {}) => ({ ecosystem: 'npm', name, version, id, aliases: [], severity: 'high', summary: '', fixed: [], direct: true, dev: false, scope: 'app', dependants: null, ...extra });

function seeded() {
  const db = initDatabase(':memory:');
  saveAppList(db, ['a.wallet', 'b.wallet'].map(appId => ({ appId, platform: 'android', repository: `https://github.com/org/${appId}` })));
  for (const [appId, dep] of [['a.wallet', 'left-pad'], ['b.wallet', 'is-odd']]) {
    saveDependencies(db, appId, 'v1.0', [{ entries: [entry(dep, '1.0.0')] }]);
    recordAnalysis(db, { appId, kind: 'release', ref: 'v1.0', status: 'ok', analyser: 't', vulnerabilities: 1 });
    saveVulnerabilities(db, appId, 'v1.0', { findings: [finding(dep, '1.0.0', `GHSA-${dep}`)] });
  }
  return db;
}

// OSV.dev as of "tomorrow": left-pad's advisory was raised to critical, is-odd's is unchanged.
const check = async ([{ entries }]) => ({ checked: 1, skipped: {}, findings: entries[0].name === 'left-pad'
  ? [finding('left-pad', '1.0.0', 'GHSA-left-pad', { severity: 'critical' })]
  : [finding('is-odd', '1.0.0', 'GHSA-is-odd')] });

test('refreshAdvisories: a changed advisory re-exports and publishes that wallet only', async () => {
  const db = seeded();
  const dir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sa-refresh-')), 'export');
  exportAll(db, dir);
  const published = [];
  const r = await refreshAdvisories(db, { exportDir: dir, onlyReproducible: false, check, deliver: async () => {},
    publish: (d, files) => { published.push(...files); return { published: true }; },
    signals: async () => ({ written: true }) });
  assert.deepEqual(r.changed, ['a.wallet'], 'a raised severity is new information too');
  assert.equal(r.added, 0);
  assert.deepEqual(r.exported, ['a.wallet']);
  assert.ok(r.published);
  assert.deepEqual(published.sort(), ['apps/a.wallet.json', 'apps/a.wallet/', 'index.json', 'signals.json']);
  const app = JSON.parse(fs.readFileSync(path.join(dir, 'apps', 'a.wallet.json'), 'utf8'));
  assert.equal(app.releases[0].advisories[0].severity, 'critical', 'the app file carries the new severity');
  db.close();
});

test('refreshAdvisories: nothing changed, nothing exported or published', async () => {
  const db = seeded();
  const dir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sa-refresh-')), 'export');
  exportAll(db, dir);
  const same = async ([{ entries }]) => ({ checked: 1, skipped: {}, findings: [finding(entries[0].name, '1.0.0', `GHSA-${entries[0].name}`)] });
  let publishes = 0;
  const r = await refreshAdvisories(db, { exportDir: dir, onlyReproducible: false, check: same, deliver: async () => {},
    publish: () => { publishes++; return { published: true }; }, signals: async () => { throw new Error('not reached'); } });
  assert.deepEqual([r.releases, r.changed, r.exported, publishes], [2, [], [], 0]);
  db.close();
});

test('refreshAdvisories: before the first export only the database is updated', async () => {
  const db = seeded();
  const dir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sa-refresh-')), 'export');
  const r = await refreshAdvisories(db, { exportDir: dir, onlyReproducible: false, check, deliver: async () => {},
    publish: () => { throw new Error('not reached'); } });
  assert.deepEqual([r.changed, r.exported, fs.existsSync(dir)], [['a.wallet'], [], false]);
  db.close();
});

// The export as the last pass left it, an hour ago.
function exportedAnHourAgo(db) {
  const dir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sa-refresh-')), 'export');
  exportAll(db, dir);
  const then = new Date(Date.now() - 3600 * 1000);
  const age = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) age(f); fs.utimesSync(f, then, then); } };
  age(dir);
  return dir;
}

test('refreshAdvisories: a failed upload is sent by the next run, though nothing changed since', async () => {
  const db = seeded();
  const dir = exportedAnHourAgo(db);
  const opts = { exportDir: dir, onlyReproducible: false, check, deliver: async () => {}, signals: async () => ({ written: false }), log: { log() {}, warn() {} } };
  await assert.rejects(refreshAdvisories(db, { ...opts, publish: () => { throw new Error('rsync exited 255: connection refused'); } }), /rsync exited 255/);
  const published = [];
  const r = await refreshAdvisories(db, { ...opts, publish: (d, files) => { published.push(...files); return { published: true }; } });
  assert.deepEqual(r.changed, [], 'the database already has the new severity');
  assert.ok(r.published);
  assert.ok(published.includes('apps/a.wallet.json') && published.includes('index.json'), published.join(', '));
  assert.ok(!published.some(f => f.startsWith('apps/b.wallet')), 'b.wallet was published by the pass');
  const app = JSON.parse(fs.readFileSync(path.join(dir, 'apps', 'a.wallet.json'), 'utf8'));
  assert.equal(app.releases[0].advisories[0].severity, 'critical');
  let again = 0;
  await refreshAdvisories(db, { ...opts, publish: () => { again++; return { published: true }; } });
  assert.equal(again, 0, 'sent once, not every hour');
  db.close();
});

test('refreshAdvisories: nothing new and nothing failed, no upload', async () => {
  const db = seeded();
  const dir = exportedAnHourAgo(db);
  const opts = { exportDir: dir, onlyReproducible: false, check, deliver: async () => {}, signals: async () => ({ written: false }), log: { log() {}, warn() {} } };
  let publishes = 0;
  const publish = () => { publishes++; return { published: true }; };
  await refreshAdvisories(db, { ...opts, publish });
  assert.equal(publishes, 1, 'the changed wallet');
  const marker = readMarker(markerPathFor(dir));
  assert.ok(marker > Date.now() - 60 * 1000, 'the marker moved to the upload');
  assert.ok(!fs.readdirSync(dir).some(f => f.includes('published')), 'the marker is not part of the export');
  const r = await refreshAdvisories(db, { ...opts, publish });
  assert.deepEqual([r.changed, r.retried, r.published, publishes], [[], 0, false, 1]);
  assert.equal(readMarker(markerPathFor(dir)), marker);
  db.close();
});
