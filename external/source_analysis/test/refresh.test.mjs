// Advisories refreshed between passes (refresh.mjs): only the wallets whose
// advisories changed are exported and published.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { initDatabase, saveAppList, saveDependencies, saveVulnerabilities, getVulnerabilities, recordAnalysis } from '../ddbbUtils.mjs';
import { exportAll } from '../export.mjs';
import { refreshAdvisories } from '../refresh.mjs';
import { markerPathFor, readMarker } from '../publish.mjs';
import { tryLock, waitForLock } from '../runLock.mjs';

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

// Issue 999: a stalled OSV.dev must not keep the run lock, and a pass waiting
// for it, for one release after another.
function manyReleases(n) {
  const db = initDatabase(':memory:');
  const apps = Array.from({ length: n }, (_, i) => `w${i}.wallet`);
  saveAppList(db, apps.map(appId => ({ appId, platform: 'android', repository: `https://github.com/org/${appId}` })));
  for (const appId of apps) {
    saveDependencies(db, appId, 'v1.0', [{ entries: [entry(`dep-${appId}`, '1.0.0')] }]);
    recordAnalysis(db, { appId, kind: 'release', ref: 'v1.0', status: 'ok', analyser: 't', vulnerabilities: 1 });
    saveVulnerabilities(db, appId, 'v1.0', { findings: [finding(`dep-${appId}`, '1.0.0', `GHSA-${appId}`)] });
  }
  return { db, apps };
}
const severities = (db, apps) => apps.map(appId => getVulnerabilities(db, appId, 'v1.0').map(v => v.severity).join());
const quiet = { log() {}, warn() {} };

test('refreshAdvisories: OSV.dev stops answering, the refresh stops after 3 failures and frees the lock', async () => {
  const { db, apps } = manyReleases(10);
  const lock = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sa-refresh-')), 'assets.db.lock');
  const lines = [];
  let lookups = 0;
  const stalled = async () => { lookups++; await new Promise(r => setTimeout(r, 20)); return null; }; // osv.mjs gives up: null
  // refresh-cli.mjs: take the lock, refresh, release; a pass waits meanwhile.
  const refresh = tryLock(lock);
  let passStarted = false;
  const pass = waitForLock(lock, { pid: 999999, isAlive: () => true, pollMs: 5, log: quiet }).then(release => { passStarted = true; release(); });
  const r = await refreshAdvisories(db, { check: stalled, deliver: async () => {}, log: { log: l => lines.push(l), warn() {} } });
  refresh.release();
  await pass;
  assert.equal(lookups, 3, 'no lookup after the third failure in a row');
  assert.deepEqual([r.releases, r.failed, r.stopped], [0, 3, { reason: '3 OSV.dev lookups failed in a row', skipped: 7, next: { appId: 'w3.wallet', version: 'v1.0' } }]);
  assert.deepEqual(lines, ['Refresh stopped early: 3 OSV.dev lookups failed in a row; 7 releases not looked up keep their stored advisories; the next run starts at w3.wallet v1.0']);
  assert.ok(passStarted, 'the waiting pass got the lock');
  assert.deepEqual(severities(db, apps), apps.map(() => 'high'), 'every release keeps its stored advisories');
  db.close();
});

test('refreshAdvisories: failures that are not in a row do not stop it', async () => {
  const { db } = manyReleases(7);
  let lookups = 0;
  const flaky = async ([{ entries }]) => (++lookups % 3 === 0
    ? { checked: 1, skipped: {}, findings: [finding(entries[0].name, '1.0.0', `GHSA-${entries[0].name.slice(4)}`)] }
    : null);
  const r = await refreshAdvisories(db, { check: flaky, deliver: async () => {}, log: quiet });
  assert.deepEqual([lookups, r.releases, r.failed, 'stopped' in r], [7, 2, 5, false]);
  db.close();
});

test('refreshAdvisories: the deadline stops the refresh; skipped releases keep their advisories, changed ones are published', async () => {
  const { db, apps } = manyReleases(5);
  const dir = exportedAnHourAgo(db);
  let clock = 0;
  const raised = async ([{ entries }]) => {
    clock += 20 * 60 * 1000; // each lookup takes 20 minutes
    return { checked: 1, skipped: {}, findings: [finding(entries[0].name, '1.0.0', `GHSA-${entries[0].name.slice(4)}`, { severity: 'critical' })] };
  };
  const lines = [];
  const published = [];
  const r = await refreshAdvisories(db, { exportDir: dir, onlyReproducible: false, check: raised, deliver: async () => {}, now: () => clock,
    publish: (d, files) => { published.push(...files); return { published: true }; }, signals: async () => ({ written: false }),
    log: { log: l => lines.push(l), warn() {} } });
  // Lookups start at 0, 20 and 40 minutes; at 60 the 45-minute limit has passed.
  assert.deepEqual([r.releases, r.failed, r.stopped], [3, 0, { reason: 'the deadline passed', skipped: 2, next: { appId: 'w3.wallet', version: 'v1.0' } }]);
  assert.deepEqual(lines, ['Refresh stopped early: the deadline passed; 2 releases not looked up keep their stored advisories; the next run starts at w3.wallet v1.0']);
  assert.deepEqual(severities(db, apps), ['critical', 'critical', 'critical', 'high', 'high']);
  assert.deepEqual(r.exported, apps.slice(0, 3), 'what changed before the stop is exported');
  assert.ok(r.published && published.includes('apps/w2.wallet.json') && !published.includes('apps/w3.wallet.json'), published.join(', '));
  assert.ok(readMarker(markerPathFor(dir)) > Date.now() - 60 * 1000, 'the upload moved the marker (issue 997)');
  // The next run starts with the 2 left out, then wraps around to the first 3.
  const order = [];
  const r2 = await refreshAdvisories(db, { exportDir: dir, onlyReproducible: false, deliver: async () => {}, now: () => clock,
    check: async (a) => { order.push(a[0].entries[0].name.slice(4)); return raised(a); },
    publish: () => ({ published: true }), signals: async () => ({ written: false }), log: quiet });
  assert.deepEqual(order, ['w3.wallet', 'w4.wallet', 'w0.wallet']);
  assert.deepEqual(severities(db, apps), apps.map(() => 'critical'), 'every release got its turn');
  assert.deepEqual(r2.stopped.next, { appId: 'w1.wallet', version: 'v1.0' });
  db.close();
});

test('refreshAdvisories: 3 releases that always fail come first, the later ones are still refreshed', async () => {
  const { db, apps } = manyReleases(10);
  const resumePath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sa-refresh-')), 'export.refresh-next');
  const bad = new Set(['w0.wallet', 'w1.wallet', 'w2.wallet']); // OSV.dev rejects their query: osv.mjs returns null every time
  const refreshed = new Set();
  const check = async ([{ entries }]) => {
    const appId = entries[0].name.slice(4);
    if (bad.has(appId)) return null;
    refreshed.add(appId);
    return { checked: 1, skipped: {}, findings: [finding(entries[0].name, '1.0.0', `GHSA-${appId}`, { severity: 'critical' })] };
  };
  const runs = [];
  for (let hour = 0; hour < 3; hour++) {
    const r = await refreshAdvisories(db, { check, deliver: async () => {}, resumePath, log: quiet });
    runs.push([r.releases, r.failed, r.stopped?.next.appId ?? null]);
  }
  // Hour 1 stops behind the bad ones; hour 2 starts there, refreshes the 7
  // and wraps around to the bad ones at the end; hour 3 starts over.
  assert.deepEqual(runs, [[0, 3, 'w3.wallet'], [7, 3, null], [0, 3, 'w3.wallet']]);
  assert.equal(refreshed.size, 7, 'every good release was refreshed');
  assert.deepEqual(severities(db, apps), apps.map(a => (bad.has(a) ? 'high' : 'critical')));
  db.close();
});

test('refreshAdvisories: a resume point whose release is gone starts at the next one', async () => {
  const { db } = manyReleases(4);
  const resumePath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sa-refresh-')), 'export.refresh-next');
  fs.writeFileSync(resumePath, JSON.stringify({ appId: 'w1.wallet', version: 'v0.9' }));
  const order = [];
  const ok = async ([{ entries }]) => { order.push(entries[0].name.slice(4)); return { checked: 1, skipped: {}, findings: [] }; };
  const r = await refreshAdvisories(db, { check: ok, deliver: async () => {}, resumePath, log: quiet });
  assert.deepEqual(order, ['w1.wallet', 'w2.wallet', 'w3.wallet', 'w0.wallet']);
  assert.equal('stopped' in r, false);
  assert.equal(fs.existsSync(resumePath), false, 'a run that looked up everything starts at the beginning next time');
  db.close();
});

test('refreshAdvisories: OSV.dev answering, every release is looked up as before', async () => {
  const { db, apps } = manyReleases(6);
  let clock = 0;
  const lookedUp = [];
  const fine = async ([{ entries }]) => {
    clock += 60 * 1000;
    lookedUp.push(entries[0].name);
    return { checked: 1, skipped: {}, findings: [finding(entries[0].name, '1.0.0', `GHSA-${entries[0].name.slice(4)}`)] };
  };
  const lines = [];
  const r = await refreshAdvisories(db, { check: fine, deliver: async () => {}, now: () => clock, log: { log: l => lines.push(l), warn() {} } });
  assert.deepEqual(lookedUp, apps.map(a => `dep-${a}`));
  assert.deepEqual(r, { releases: 6, failed: 0, added: 0, changed: [], exported: [], published: false, retried: 0 });
  assert.deepEqual(lines, []);
  db.close();
});
