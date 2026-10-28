// Advisories refreshed between passes (refresh.mjs): only the wallets whose
// advisories changed are exported and published.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { initDatabase, saveDependencies, saveVulnerabilities, recordAnalysis } from '../ddbbUtils.mjs';
import { exportAll } from '../export.mjs';
import { refreshAdvisories } from '../refresh.mjs';

const entry = (name, version) => ({ ecosystem: 'npm', lockfile: 'package-lock.json', name, version, resolved: `https://registry.npmjs.org/${name}/-/${name}-${version}.tgz`, integrity: `sha512-${name}${version}`, direct: true, dev: false, scope: 'app', dependants: null, tier: 'hash-pinned' });
const finding = (name, version, id, extra = {}) => ({ ecosystem: 'npm', name, version, id, aliases: [], severity: 'high', summary: '', fixed: [], direct: true, dev: false, scope: 'app', dependants: null, ...extra });

function seeded() {
  const db = initDatabase(':memory:');
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
