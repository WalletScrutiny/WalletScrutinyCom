// The analyses table: one row per analysis the service ran, so "analysed and
// clean", "failed" and "never analysed" stay distinguishable.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initDatabase, recordAnalysis, getAnalyses, listAnalysedApps } from '../ddbbUtils.mjs';
import { summarizeResults } from '../appAnalysis.mjs';

test('recordAnalysis stores provenance and counts, a repeat replaces the row', () => {
  const db = initDatabase(':memory:');
  recordAnalysis(db, {
    appId: 'app.one', kind: 'release', ref: 'v1.0.0', commit: 'abc123', status: 'ok', appType: 'npm', analyser: '1.0.0+deadbeef',
    plugins: ['pinning', 'osv'], lockfiles: ['package-lock.json'], dependencies: 42, osvChecked: 40, osvSkipped: { floating: 2 }, vulnerabilities: 3,
  });
  recordAnalysis(db, { appId: 'app.one', kind: 'default-branch', ref: 'ffff00', commit: 'ffff00', status: 'failed', error: 'clone failed', analyser: '1.0.0' });
  recordAnalysis(db, { appId: 'app.one', kind: 'release', ref: 'v1.0.0', commit: 'abc124', status: 'ok', analyser: '1.0.1', dependencies: 43 });

  const rows = getAnalyses(db, 'app.one');
  assert.equal(rows.length, 2);
  const release = rows.find(r => r.kind === 'release');
  assert.equal(release.commit_sha, 'abc124');
  assert.equal(release.analyser, '1.0.1');
  assert.equal(release.dependencies, 43);
  assert.deepEqual(release.plugins, []);
  assert.deepEqual(release.lockfiles, []);
  assert.deepEqual(release.osv_skipped, {});
  const head = rows.find(r => r.kind === 'default-branch');
  assert.equal(head.status, 'failed');
  assert.equal(head.error, 'clone failed');
  assert.deepEqual(listAnalysedApps(db), ['app.one']);
  assert.deepEqual(getAnalyses(db, 'app.none'), []);
});

test('summarizeResults reads the pinning and osv results, null when a plugin was off', () => {
  const plugins = [{ name: 'pinning' }, { name: 'osv' }];
  const results = {
    pinning: [{ ecosystem: 'npm', lockfiles: ['yarn.lock'], entries: [{}, {}] }, { ecosystem: 'gradle', lockfiles: [], entries: [{}] }],
    osv: { checked: 2, skipped: { floating: 1 }, findings: [{ id: 'GHSA-1' }] },
  };
  assert.deepEqual(summarizeResults(results, plugins), {
    plugins: ['pinning', 'osv'], lockfiles: ['yarn.lock'], dependencies: 3, osvChecked: 2, osvSkipped: { floating: 1 }, vulnerabilities: 1, lockCoverage: null,
  });
  assert.deepEqual(summarizeResults({}, []), { plugins: [], lockfiles: [], dependencies: null, osvChecked: null, osvSkipped: {}, vulnerabilities: null, lockCoverage: null });
});

test('the lock coverage result is stored with the analysis and read back', () => {
  const coverage = { verdict: 'unlocked', manifests: [{ ecosystem: 'pub', manifest: 'pubspec.yaml', lockfile: null, product: true }], missing: 1, floatingRows: {} };
  const seen = summarizeResults({ 'lock-coverage': coverage }, [{ name: 'lock-coverage' }]);
  assert.deepEqual(seen.lockCoverage, coverage);
  const db = initDatabase(':memory:');
  recordAnalysis(db, { appId: 'app.flutter', kind: 'release', ref: 'v2', status: 'unsupported', analyser: '1', ...seen });
  recordAnalysis(db, { appId: 'app.old', kind: 'release', ref: 'v1', status: 'ok', analyser: '1' });
  assert.deepEqual(getAnalyses(db, 'app.flutter')[0].lock_coverage, coverage);
  assert.equal(getAnalyses(db, 'app.old')[0].lock_coverage, null, 'an analysis without the plugin says nothing about locks');
});

test('initDatabase backfills analyses rows for releases stored before the table existed', async () => {
  const { saveDependencies } = await import('../ddbbUtils.mjs');
  const db = initDatabase(':memory:');
  db.exec('DROP TABLE analyses');
  saveDependencies(db, 'app.old', 'v0.9', [{ ecosystem: 'npm', entries: [
    { ecosystem: 'npm', lockfile: 'package-lock.json', name: 'a', version: '1', resolved: '', integrity: '', direct: true, dev: false, tier: 'hash-pinned' },
  ] }]);
  // initDatabase on an open handle: re-run the schema statements on the same file is not possible for :memory:,
  // so recreate the table the way initDatabase does by calling it on a file-backed copy.
  const fs = await import('fs'); const os = await import('os'); const path = await import('path');
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sa-backfill-')), 'assets.db');
  await db.backup(file);
  db.close();
  const reopened = initDatabase(file);
  const rows = getAnalyses(reopened, 'app.old');
  assert.equal(rows.length, 1);
  assert.equal(rows[0].status, 'ok');
  assert.equal(rows[0].analyser, 'before-analyses-table');
  assert.equal(rows[0].dependencies, 1);
  assert.equal(rows[0].commit_sha, null);
  reopened.close();
});

// Issue 998: a re-check that fails must not replace the result that worked.
const LEFT_PAD = { ecosystem: 'npm', lockfile: 'package-lock.json', name: 'left-pad', version: '1.0.0', resolved: 'https://registry.npmjs.org/left-pad/-/left-pad-1.0.0.tgz', integrity: 'sha512-x', direct: true, dev: false, scope: 'app', dependants: null, tier: 'hash-pinned' };
async function goodRelease(db, appId, ref) {
  const { saveDependencies, saveVulnerabilities } = await import('../ddbbUtils.mjs');
  saveDependencies(db, appId, ref, [{ entries: [LEFT_PAD] }]);
  recordAnalysis(db, { appId, kind: 'release', ref, status: 'ok', analyser: 't', lockfiles: ['package-lock.json'], osvChecked: 1, vulnerabilities: 1 });
  saveVulnerabilities(db, appId, ref, { findings: [{ ecosystem: 'npm', name: 'left-pad', version: '1.0.0', id: 'GHSA-demo', aliases: [], severity: 'high', summary: '', fixed: [], direct: true, dev: false, scope: 'app', dependants: null }] });
}

test('a failed re-check keeps the good result and notes the attempt beside it (issue 998)', async () => {
  const { saveAppList } = await import('../ddbbUtils.mjs');
  const { buildApp } = await import('../export.mjs');
  const db = initDatabase(':memory:');
  saveAppList(db, [{ appId: 'demo.wallet', platform: 'android', repository: 'https://github.com/org/demo' }]);
  for (const ref of ['v1.0', 'v2.0']) await goodRelease(db, 'demo.wallet', ref);
  const before = buildApp(db, 'demo.wallet').releases.find(r => r.ref === 'v2.0');
  assert.equal(before.recheckFailed, undefined);

  // what appAnalysis.mjs records when a re-check crashes
  recordAnalysis(db, { appId: 'demo.wallet', kind: 'release', ref: 'v2.0', status: 'failed', analyser: 't', error: 'git clone timed out' });
  const after = buildApp(db, 'demo.wallet').releases.find(r => r.ref === 'v2.0');
  assert.equal(after.status, 'ok');
  assert.equal(after.error, undefined);
  assert.deepEqual(after.lockfiles, ['package-lock.json']);
  assert.deepEqual(after.osv, { skipped: {} });
  assert.equal(after.analysedAt, before.analysedAt);
  assert.equal(after.recheckFailed.error, 'git clone timed out');
  assert.match(after.recheckFailed.at, /^\d{4}-\d\d-\d\d /);
  const { recheckFailed, ...rest } = after;
  assert.equal(JSON.stringify(rest), JSON.stringify(before), 'apart from the note, the release exports as before');

  // a re-check that works replaces the row and clears the note
  recordAnalysis(db, { appId: 'demo.wallet', kind: 'release', ref: 'v2.0', status: 'ok', analyser: 't2', lockfiles: ['package-lock.json'], osvChecked: 1, vulnerabilities: 1 });
  const fixed = getAnalyses(db, 'demo.wallet').find(r => r.ref === 'v2.0');
  assert.equal(fixed.analyser, 't2');
  assert.equal(fixed.failed_attempt_at, null);
  assert.equal(fixed.failed_attempt_error, null);
  assert.equal(buildApp(db, 'demo.wallet').releases.find(r => r.ref === 'v2.0').recheckFailed, undefined);
});

test('a first check that fails still records "failed", and so does one after a failed or unsupported row', () => {
  const db = initDatabase(':memory:');
  recordAnalysis(db, { appId: 'app.new', kind: 'release', ref: 'v1', status: 'failed', analyser: 't', error: 'clone failed' });
  let [row] = getAnalyses(db, 'app.new');
  assert.equal(row.status, 'failed');
  assert.equal(row.error, 'clone failed');
  assert.equal(row.failed_attempt_at, null);
  recordAnalysis(db, { appId: 'app.new', kind: 'release', ref: 'v1', status: 'failed', analyser: 't', error: 'osv (timeout)' });
  [row] = getAnalyses(db, 'app.new');
  assert.equal(row.error, 'osv (timeout)', 'with no good row, the newest failure is the row');
  recordAnalysis(db, { appId: 'app.flutter', kind: 'release', ref: 'v1', status: 'unsupported', analyser: 't' });
  recordAnalysis(db, { appId: 'app.flutter', kind: 'release', ref: 'v1', status: 'failed', analyser: 't', error: 'boom' });
  assert.equal(getAnalyses(db, 'app.flutter')[0].status, 'failed', 'only an ok row is kept');
});

test('a failed re-check leaves analysed_at and the --reanalyse order unchanged', async () => {
  const { releasesToReanalyse, hasReleaseAnalysis } = await import('../ddbbUtils.mjs');
  const db = initDatabase(':memory:');
  for (const ref of ['v1', 'v2', 'v3']) recordAnalysis(db, { appId: 'app.order', kind: 'release', ref, status: 'ok', analyser: 't' });
  const at = { v1: '2026-01-01 00:00:00', v2: '2026-02-01 00:00:00', v3: '2026-03-01 00:00:00' };
  for (const [ref, t] of Object.entries(at)) db.prepare("UPDATE analyses SET analysed_at = ? WHERE app_id = 'app.order' AND ref = ?").run(t, ref);
  const order = releasesToReanalyse(db, 'app.order');
  assert.deepEqual(order, ['v3', 'v2', 'v1']);

  recordAnalysis(db, { appId: 'app.order', kind: 'release', ref: 'v1', status: 'failed', analyser: 't', error: 'boom' });
  assert.deepEqual(releasesToReanalyse(db, 'app.order'), order);
  const v1 = getAnalyses(db, 'app.order').find(r => r.ref === 'v1');
  assert.equal(v1.analysed_at, at.v1);
  assert.equal(v1.failed_attempt_error, 'boom');
  assert.equal(hasReleaseAnalysis(db, 'app.order', 'v1'), true, 'the kept ok row is not retried by the next pass');
});

test('initDatabase adds the failed-attempt columns to an older database without touching its rows', async () => {
  const fs = await import('fs'); const os = await import('os'); const path = await import('path');
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sa-998-')), 'assets.db');
  const db = initDatabase(file);
  recordAnalysis(db, { appId: 'app.old', kind: 'release', ref: 'v1', status: 'ok', analyser: 't', dependencies: 5 });
  db.exec('ALTER TABLE analyses DROP COLUMN failed_attempt_at');
  db.exec('ALTER TABLE analyses DROP COLUMN failed_attempt_error');
  const stored = db.prepare('SELECT * FROM analyses').all();
  db.close();
  const reopened = initDatabase(file);
  const columns = reopened.prepare('PRAGMA table_info(analyses)').all().map(c => c.name);
  assert.ok(columns.includes('failed_attempt_at') && columns.includes('failed_attempt_error'));
  const rows = reopened.prepare('SELECT * FROM analyses').all();
  assert.deepEqual(rows.map(({ failed_attempt_at, failed_attempt_error, ...r }) => r), stored);
  assert.ok(rows.every(r => r.failed_attempt_at === null && r.failed_attempt_error === null));
  reopened.close();
});
