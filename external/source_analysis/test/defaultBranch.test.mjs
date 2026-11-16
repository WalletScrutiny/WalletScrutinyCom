// The default branch's latest analysis is stored under DEFAULT_BRANCH_REF, so
// a release's advisory can say it is already fixed there; nothing that means
// releases counts those rows.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { initDatabase, saveAppList, saveDependencies, saveVulnerabilities, getVulnerabilities, recordAnalysis, getAnalysedCommit, saveAnalysedCommit, getDefaultBranch, DEFAULT_BRANCH_REF } from '../ddbbUtils.mjs';
import { buildApp, productCounts } from '../export.mjs';
import { recheckStoredReleases } from '../recheck.mjs';
import { undatedReleases } from '../releaseDates.mjs';

const entry = (name, version, extra = {}) => ({ ecosystem: 'npm', lockfile: 'package-lock.json', name, version, resolved: `https://registry.npmjs.org/${name}/-/${name}-${version}.tgz`, integrity: `sha512-${name}${version}`, direct: true, dev: false, scope: 'app', tier: 'hash-pinned', ...extra });
const finding = (name, version, id, aliases = []) => ({ ecosystem: 'npm', name, version, id, aliases, severity: 'high', summary: '', fixed: [], direct: true, dev: false, scope: 'app' });

// v1.0 ships gone@1.0.0, bumped@1.0.0, still@1.0.0 and aliased@1.0.0, each with an advisory.
// The default branch dropped `gone`, moved `bumped` past its advisory, and still
// matches `still` (same id) and `aliased` (under another id with the same alias).
function seeded({ master = true } = {}) {
  const db = initDatabase(':memory:');
  saveAppList(db, [{ appId: 'w', platform: 'android', repository: 'https://github.com/o/w' }]);
  saveDependencies(db, 'w', 'v1.0', [{ entries: [entry('gone', '1.0.0'), entry('bumped', '1.0.0'), entry('still', '1.0.0'), entry('aliased', '1.0.0')] }]);
  saveVulnerabilities(db, 'w', 'v1.0', { findings: [finding('gone', '1.0.0', 'GHSA-gone'), finding('bumped', '1.0.0', 'GHSA-bump'),
    finding('still', '1.0.0', 'GHSA-still'), finding('aliased', '1.0.0', 'GHSA-alias', ['CVE-2026-9'])] });
  recordAnalysis(db, { appId: 'w', kind: 'release', ref: 'v1.0', commit: 'c1', status: 'ok', analyser: 't', vulnerabilities: 4 });
  if (master) {
    saveDependencies(db, 'w', DEFAULT_BRANCH_REF, [{ entries: [entry('bumped', '1.2.0'), entry('still', '1.0.0'), entry('aliased', '1.0.0'), entry('new', '1.0.0')] }]);
    saveVulnerabilities(db, 'w', DEFAULT_BRANCH_REF, { findings: [finding('still', '1.0.0', 'GHSA-still'), finding('aliased', '1.0.0', 'PYSEC-x', ['CVE-2026-9'])] });
    recordAnalysis(db, { appId: 'w', kind: 'default-branch', ref: 'headsha', commit: 'headsha', status: 'ok', analyser: 't' });
    saveAnalysedCommit(db, 'w', 'headsha');
  }
  return db;
}

test('buildApp: each advisory says whether the default branch still has it', () => {
  const db = seeded();
  const app = buildApp(db, 'w');
  assert.deepEqual(app.releases.map(r => r.ref), ['v1.0'], 'the default branch is not a release');
  assert.equal(app.defaultBranch.commit, 'headsha');
  const by = Object.fromEntries(app.releases[0].advisories.map(a => [a.package, a.inDefaultBranch]));
  assert.deepEqual(by, { gone: { status: 'removed' }, bumped: { status: 'updated', versions: ['1.2.0'] }, still: undefined, aliased: undefined });
  db.close();
});

test('buildApp: nothing is claimed without stored default-branch rows', () => {
  const db = seeded({ master: false });
  // analysed before the rows were kept: the commit is known, the rows are not
  db.prepare("INSERT INTO default_branch_analyses (app_id, commit_sha) VALUES ('w', 'oldsha')").run();
  const app = buildApp(db, 'w');
  assert.equal(app.defaultBranch, undefined);
  assert.ok(app.releases[0].advisories.every(a => a.inDefaultBranch === undefined));
  assert.equal(getAnalysedCommit(db, 'w'), null, 'so the next pass analyses the unmoved branch again');
  assert.equal(getDefaultBranch(db, 'w'), null);
  db.close();
});

test('the default branch rows count as no release: product counts, undated releases, the analyses backfill', () => {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sa-db-')), 'a.db');
  let db = initDatabase(file);
  saveAppList(db, [{ appId: 'w', platform: 'android', repository: 'https://github.com/o/w' }]);
  saveDependencies(db, 'w', DEFAULT_BRANCH_REF, [{ entries: [entry('only-master', '1.0.0')] }]);
  saveDependencies(db, 'w', 'v1.0', [{ entries: [entry('a', '1.0.0')] }]);
  db.close();
  db = initDatabase(file); // the backfill runs on open
  assert.deepEqual(db.prepare("SELECT ref FROM analyses WHERE app_id = 'w'").all().map(r => r.ref), ['v1.0']);
  assert.deepEqual(undatedReleases(db).map(r => r.ref), ['v1.0']);
  assert.deepEqual(buildApp(db, 'w').releases.map(r => r.ref), ['v1.0']);
  assert.equal(productCounts(db).byName.get('npm:only-master'), undefined);
  db.close();
});

test('recheckStoredReleases looks the default branch up again, so a new advisory does not read as fixed there', async () => {
  const db = seeded();
  const check = async (analyses) => ({ checked: analyses[0].entries.length, skipped: {},
    findings: analyses[0].entries.filter(e => e.name === 'bumped').map(e => finding('bumped', e.version, 'GHSA-bump')) });
  await recheckStoredReleases(db, ['w'], { check, deliver: async () => {} });
  assert.deepEqual(getVulnerabilities(db, 'w', DEFAULT_BRANCH_REF).map(v => v.vuln_id), ['GHSA-bump']);
  const bumped = buildApp(db, 'w').releases[0].advisories.find(a => a.package === 'bumped');
  assert.equal(bumped.inDefaultBranch, undefined);
  db.close();
});
