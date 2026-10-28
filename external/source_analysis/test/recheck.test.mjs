// Stored releases looked up again each pass (recheck.mjs), and gone wallets
// past their end of life left out of the export.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { initDatabase, getDependencies, saveDependencies, saveVulnerabilities, getVulnerabilities, recordAnalysis, saveReproducibleVersions, saveEndOfLife, getEndOfLife } from '../ddbbUtils.mjs';
import { recheckStoredReleases, entryOfRow } from '../recheck.mjs';
import { exportAll } from '../export.mjs';

const entry = (name, version, extra = {}) => ({ ecosystem: 'npm', lockfile: 'package-lock.json', name, version, resolved: `https://registry.npmjs.org/${name}/-/${name}-${version}.tgz`, integrity: `sha512-${name}${version}`, direct: true, dev: false, scope: 'app', dependants: null, tier: 'hash-pinned', ...extra });
const finding = (name, version, id, severity = 'high') => ({ ecosystem: 'npm', name, version, id, aliases: [], severity, summary: '', fixed: [], direct: true, dev: false, scope: 'app', dependants: null });

function seeded() {
  const db = initDatabase(':memory:');
  saveDependencies(db, 'old.wallet', 'v1.0', [{ entries: [entry('a', '1.0.0'), entry('b', '2.0.0', { direct: false, dependants: ['a'] })] }]);
  recordAnalysis(db, { appId: 'old.wallet', kind: 'release', ref: 'v1.0', status: 'ok', analyser: 't', vulnerabilities: 0 });
  saveVulnerabilities(db, 'old.wallet', 'v1.0', { findings: [] });
  return db;
}

test('entryOfRow: a stored row reads back as the entry that was stored', () => {
  const db = seeded();
  assert.deepEqual(getDependencies(db, 'old.wallet', 'v1.0').map(entryOfRow), [entry('a', '1.0.0'), entry('b', '2.0.0', { direct: false, dependants: ['a'] })]);
  db.close();
});

test('recheckStoredReleases: a new advisory for an unchanged release is stored and counted', async () => {
  const db = seeded();
  let asked = null;
  const check = async (analyses) => { asked = analyses[0].entries.map(e => `${e.name}@${e.version}`); return { checked: 2, skipped: {}, findings: [finding('b', '2.0.0', 'GHSA-new')] }; };
  const delivered = [];
  const result = await recheckStoredReleases(db, ['old.wallet'], { check, deliver: async () => delivered.push(1) });
  assert.deepEqual(asked.sort(), ['a@1.0.0', 'b@2.0.0']);
  assert.deepEqual(result, { releases: 1, failed: 0, added: 1, changed: ['old.wallet'] });
  assert.deepEqual(getVulnerabilities(db, 'old.wallet', 'v1.0').map(v => v.vuln_id), ['GHSA-new']);
  assert.equal(db.prepare("SELECT vulnerabilities FROM analyses WHERE app_id = 'old.wallet'").get().vulnerabilities, 1);
  assert.equal(delivered.length, 1);
  // The same advisory next pass is not new.
  assert.equal((await recheckStoredReleases(db, ['old.wallet'], { check, deliver: async () => {} })).added, 0);
  db.close();
});

test('recheckStoredReleases: a failed lookup keeps the stored advisories', async () => {
  const db = seeded();
  saveVulnerabilities(db, 'old.wallet', 'v1.0', { findings: [finding('a', '1.0.0', 'GHSA-old')] });
  const result = await recheckStoredReleases(db, ['old.wallet'], { check: async () => null, deliver: async () => {} });
  assert.deepEqual(result, { releases: 0, failed: 1, added: 0, changed: [] });
  assert.deepEqual(getVulnerabilities(db, 'old.wallet', 'v1.0').map(v => v.vuln_id), ['GHSA-old']);
  db.close();
});

test('recheckStoredReleases: a release analysed this pass is not looked up twice', async () => {
  const db = seeded();
  const since = db.prepare("SELECT datetime(CURRENT_TIMESTAMP, '-1 minute') AS t").get().t;
  let calls = 0;
  const result = await recheckStoredReleases(db, ['old.wallet'], { since, check: async () => { calls++; return { checked: 0, skipped: {}, findings: [] }; }, deliver: async () => {} });
  assert.equal(calls, 0);
  assert.equal(result.releases, 0);
  db.close();
});

test('exportAll: a gone wallet past its end of life is left out', () => {
  const db = seeded();
  saveDependencies(db, 'live.wallet', 'v2.0', [{ entries: [entry('a', '1.0.0')] }]);
  recordAnalysis(db, { appId: 'live.wallet', kind: 'release', ref: 'v2.0', status: 'ok', analyser: 't' });
  saveReproducibleVersions(db, new Map([['old.wallet', [{ version: '1.0', verifiedAt: 1 }]], ['live.wallet', [{ version: '2.0', verifiedAt: 1 }]]]));
  saveEndOfLife(db, [{ appId: 'old.wallet', lastCommitAt: new Date('2020-01-01T00:00:00Z') }]);
  assert.equal(getEndOfLife(db).get('old.wallet'), '2020-01-01T00:00:00.000Z');
  const dir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'eol-')), 'out');
  exportAll(db, dir, { onlyReproducible: true });
  const index = JSON.parse(fs.readFileSync(path.join(dir, 'index.json'), 'utf8'));
  assert.deepEqual(index.apps.map(a => a.appId), ['live.wallet']);
  db.close();
});
