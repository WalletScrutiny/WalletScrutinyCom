// Advisories filed against the wallet itself (ownAdvisories.mjs, issue 1022).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { repoKey, ownAdvisory, lookupOwnAdvisories, refreshOwnAdvisories } from '../ownAdvisories.mjs';
import { initDatabase, saveAppList, saveDependencies, recordAnalysis, getOwnAdvisories } from '../ddbbUtils.mjs';
import { clearAdvisoryCache } from '../plugins/osv.mjs';
import { buildApp, exportAll } from '../export.mjs';
import { refreshAdvisories } from '../refresh.mjs';

const REPO = 'https://github.com/spesmilo/electrum';

// Trimmed from OSV.dev's CVE-2026-117601 as of 2026-11-18: rated in CVSS 4.0 only,
// the fix as a version only in the extracted events.
const cve117601 = {
  id: 'CVE-2026-117601', aliases: ['GHSA-6jp4-8v48-cc5v'], published: '2026-10-27T13:09:51.347Z',
  summary: 'Electrum before 4.8.3 Missing Signature Verification of Mempool Transactions',
  severity: [{ type: 'CVSS_V4', score: 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N' }],
  affected: [{
    ranges: [{ type: 'GIT', repo: REPO, events: [{ introduced: '0' }, { fixed: '90fe30822561e515a9d2d6e5a352cc07780999eb' }],
      database_specific: { extracted_events: [
        { source: 'AFFECTED_FIELD', range: [{ introduced: '0' }, { fixed: '4.8.3' }] },
        { source: 'REFERENCES_COMMIT', range: [{ fixed: '90fe30822561e515a9d2d6e5a352cc07780999eb' }] },
      ] } }],
    versions: ['4.8.2', '4.8.1', 'v4.0.0'],
  }],
};
// CVE-2018-6353: no fix named, only the last affected version; CVSS 3 rates it.
const cve6353 = {
  id: 'CVE-2018-6353', published: '2018-01-27T00:00:00Z', summary: 'Electrum JSONRPC interface',
  severity: [{ type: 'CVSS_V3', score: 'CVSS:3.0/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H' }],
  affected: [{
    ranges: [{ type: 'GIT', repo: `${REPO}.git`, events: [{ introduced: '0' }],
      database_specific: { extracted_events: [{ source: 'CPE_RANGE', range: [{ introduced: '0' }, { last_affected: '2.9.4' }] }] } }],
    versions: ['2.9.4', '2.9.3'],
  }],
};
// An advisory of another repository that OSV.dev lists for this one too must not count.
const elsewhere = { id: 'CVE-2000-1', affected: [{ ranges: [{ type: 'GIT', repo: 'https://github.com/other/lib', events: [] }], versions: ['1.0'] }] };

function osvFetch(records, calls = []) {
  return async (url, { body } = {}) => {
    calls.push(url);
    if (url.endsWith('/query')) {
      const q = JSON.parse(body);
      assert.deepEqual(q.package, { ecosystem: 'GIT', name: REPO }, 'asked by repository, with no version');
      assert.equal(q.version, undefined);
      return { ok: true, json: async () => ({ vulns: records.map(r => ({ id: r.id })) }) };
    }
    const id = decodeURIComponent(url.split('/').pop());
    return { ok: true, json: async () => records.find(r => r.id === id) };
  };
}

test('repoKey: the repository as OSV.dev names it', () => {
  assert.equal(repoKey('https://github.com/spesmilo/electrum.git'), REPO);
  assert.equal(repoKey('https://GitHub.com/spesmilo/electrum/'), REPO);
  assert.equal(repoKey('git@github.com:spesmilo/electrum.git'), REPO);
  assert.equal(repoKey('https://example.com/some/where'), null);
  assert.equal(repoKey(''), null);
});

test('ownAdvisory: affected tags without a leading v, fixed versions from the extracted events, not commits', () => {
  const a = ownAdvisory(cve117601, REPO);
  assert.deepEqual(a.versions, ['4.8.2', '4.8.1', '4.0.0']);
  assert.deepEqual(a.fixed, ['4.8.3']);
  assert.equal(a.published, '2026-10-27');
  assert.equal(a.severity, 'unknown', 'CVSS 4.0 is not rated here');
  const b = ownAdvisory(cve6353, REPO);
  assert.deepEqual([b.fixed, b.lastAffected, b.severity], [[], ['2.9.4'], 'high']);
  assert.equal(ownAdvisory(elsewhere, REPO), null);
});

test('lookupOwnAdvisories: NVD rates what OSV.dev cannot, most severe first', async () => {
  clearAdvisoryCache();
  const asked = [];
  const out = await lookupOwnAdvisories(REPO, { fetchImpl: osvFetch([cve6353, cve117601, elsewhere]),
    severity: async (id) => { asked.push(id); return 'critical'; } });
  assert.deepEqual(out.map(a => [a.id, a.severity]), [['CVE-2026-117601', 'critical'], ['CVE-2018-6353', 'high']]);
  assert.deepEqual(asked, ['CVE-2026-117601'], 'only the unrated one goes to NVD');
});

test('lookupOwnAdvisories: OSV.dev down is null, not none', async () => {
  clearAdvisoryCache();
  const down = async () => ({ ok: false, status: 400, json: async () => ({}) });
  assert.equal(await lookupOwnAdvisories(REPO, { fetchImpl: down }), null);
});

function seeded() {
  const db = initDatabase(':memory:');
  saveAppList(db, [
    { appId: 'electrum', platform: 'desktop', repository: `${REPO}.git` },
    { appId: 'org.electrum.electrum', platform: 'android', repository: REPO },
    { appId: 'no.repo', platform: 'desktop', repository: 'https://example.com/x' },
  ]);
  return db;
}

test('refreshOwnAdvisories: one lookup per repository; a failure keeps what was stored', async () => {
  const db = seeded();
  const looked = [];
  let answer = [ownAdvisory(cve117601, REPO)];
  const lookup = async (repo) => { looked.push(repo); return answer; };
  let r = await refreshOwnAdvisories(db, ['electrum', 'org.electrum.electrum', 'no.repo'], { lookup });
  assert.deepEqual(looked, [REPO]);
  assert.deepEqual(r, { checked: 1, failed: 0, changed: ['electrum', 'org.electrum.electrum'] });
  assert.equal(getOwnAdvisories(db, 'electrum').advisories[0].id, 'CVE-2026-117601');
  r = await refreshOwnAdvisories(db, ['electrum'], { lookup });
  assert.deepEqual(r.changed, [], 'the same answer changes nothing');
  answer = null;
  r = await refreshOwnAdvisories(db, ['electrum'], { lookup });
  assert.deepEqual([r.failed, r.changed], [1, []]);
  assert.equal(getOwnAdvisories(db, 'electrum').advisories.length, 1, 'kept');
  assert.equal(getOwnAdvisories(db, 'no.repo'), null);
  db.close();
});

test('export: ownAdvisories only once the wallet was looked up', async () => {
  const db = seeded();
  assert.equal(buildApp(db, 'electrum').ownAdvisories, undefined, 'never looked up is not "none known"');
  await refreshOwnAdvisories(db, ['electrum'], { lookup: async () => [] });
  assert.deepEqual(buildApp(db, 'electrum').ownAdvisories.advisories, []);
  await refreshOwnAdvisories(db, ['electrum'], { lookup: async () => [ownAdvisory(cve117601, REPO)] });
  const own = buildApp(db, 'electrum').ownAdvisories;
  assert.equal(own.repository, REPO);
  assert.deepEqual(own.advisories[0].fixed, ['4.8.3']);
  db.close();
});

test('refreshAdvisories: a new own advisory re-exports that wallet', async () => {
  const db = seeded();
  saveDependencies(db, 'electrum', '4.8.2', [{ entries: [{ ecosystem: 'pip', lockfile: 'requirements.txt', name: 'qrcode', version: '7.4.2', resolved: '', integrity: 'sha256-x', direct: true, dev: false, scope: 'app', dependants: null, tier: 'hash-pinned' }] }]);
  recordAnalysis(db, { appId: 'electrum', kind: 'release', ref: '4.8.2', status: 'ok', analyser: 't', vulnerabilities: 0 });
  const dir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sa-own-')), 'export');
  exportAll(db, dir);
  const own = (db2, apps) => refreshOwnAdvisories(db2, apps, { lookup: async () => [ownAdvisory(cve117601, REPO)] });
  const r = await refreshAdvisories(db, { exportDir: dir, onlyReproducible: false, own,
    check: async () => ({ checked: 0, skipped: {}, findings: [] }), deliver: async () => {},
    publish: () => ({ published: true }), signals: async () => ({ written: false }) });
  assert.deepEqual(r.changed, ['electrum']);
  assert.deepEqual(r.exported, ['electrum']);
  const app = JSON.parse(fs.readFileSync(path.join(dir, 'apps', 'electrum.json'), 'utf8'));
  assert.equal(app.ownAdvisories.advisories[0].id, 'CVE-2026-117601');
  db.close();
});
