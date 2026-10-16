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
    plugins: ['pinning', 'osv'], lockfiles: ['yarn.lock'], dependencies: 3, osvChecked: 2, osvSkipped: { floating: 1 }, vulnerabilities: 1,
  });
  assert.deepEqual(summarizeResults({}, []), { plugins: [], lockfiles: [], dependencies: null, osvChecked: null, osvSkipped: {}, vulnerabilities: null });
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
