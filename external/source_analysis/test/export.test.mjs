// The static export (export.mjs): index, per-app file and per-release
// dependency list, built from stored rows in a temp dir and swapped in atomically.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { initDatabase, saveDependencies, saveVulnerabilities, recordAnalysis, saveAppList, saveReproducibleVersions, saveVerifiedRef, saveSubmodules } from '../ddbbUtils.mjs';
import { exportAll, exportApp, buildApp, loadRepositories, safeName, productPartOf, pagePlatform, rebuildRowForReaders } from '../export.mjs';
import { parseOssListing, ossRebuildPrefix, ossRebuildUrl } from '../rebuildClaims.mjs';

const entry = (name, version, extra = {}) => ({ ecosystem: 'npm', lockfile: 'package-lock.json', name, version, resolved: `https://registry.npmjs.org/${name}/-/${name}-${version}.tgz`, integrity: `sha512-${name}${version}`, direct: true, dev: false, tier: 'hash-pinned', ...extra });

function seeded() {
  const db = initDatabase(':memory:');
  saveAppList(db, [
    { appId: 'app.android', platform: 'android', repository: 'https://github.com/org/app' },
    { appId: 'app.ios', platform: 'iphone', repository: 'https://github.com/org/app' },
  ]);
  saveDependencies(db, 'app.android', 'v1.0.0', [{ ecosystem: 'npm', entries: [entry('a', '1.0.0'), entry('b', '2.0.0', { direct: false, dev: true, scope: 'tests' })] }]);
  saveDependencies(db, 'app.android', 'v1.1.0', [{ ecosystem: 'npm', entries: [entry('a', '1.0.1'), entry('c', '3.0.0', { tier: 'floating', dev: null })] }]);
  saveDependencies(db, 'app.other', 'v9', [{ ecosystem: 'npm', entries: [entry('a', '1.0.1'), entry('z', '1.0.0')] }]);
  saveVulnerabilities(db, 'app.android', 'v1.1.0', { findings: [
    { ecosystem: 'npm', name: 'a', version: '1.0.1', id: 'GHSA-aaaa', aliases: ['CVE-2026-1'], severity: 'high', summary: 'bad', fixed: ['1.0.2'], direct: true, dev: false, listedBy: ['osv'] },
  ] });
  recordAnalysis(db, { appId: 'app.android', kind: 'release', ref: 'v1.0.0', commit: 'c1', status: 'ok', appType: 'npm', analyser: 't', plugins: ['pinning', 'osv'], lockfiles: ['package-lock.json'], dependencies: 2, osvChecked: 2, osvSkipped: {}, vulnerabilities: 0 });
  db.prepare("UPDATE analyses SET analysed_at = '2026-10-01 00:00:00' WHERE ref = 'v1.0.0'").run();
  recordAnalysis(db, { appId: 'app.android', kind: 'release', ref: 'v1.1.0', commit: 'c2', status: 'ok', appType: 'npm', analyser: 't', plugins: ['pinning', 'osv'], lockfiles: ['package-lock.json'], dependencies: 2, osvChecked: 1, osvSkipped: { floating: 1 }, vulnerabilities: 1 });
  recordAnalysis(db, { appId: 'app.android', kind: 'default-branch', ref: 'headsha', commit: 'headsha', status: 'ok', appType: 'npm', analyser: 't' });
  recordAnalysis(db, { appId: 'app.failed', kind: 'default-branch', ref: 'unknown', status: 'failed', error: 'clone failed', analyser: 't' });
  return db;
}

test('buildApp: releases newest first with summary, advisories and diff, nothing the panel does not read', () => {
  const app = buildApp(seeded(), 'app.android', [{ appId: 'app.android' }, { appId: 'app.ios' }]);
  assert.equal(app.releases.length, 2);
  const [latest, previous] = app.releases;
  assert.equal(latest.ref, 'v1.1.0');
  assert.equal(latest.commit, 'c2');
  assert.deepEqual(latest.osv, { skipped: { floating: 1 } });
  assert.equal(latest.dependencies.total, 2);
  assert.deepEqual(latest.dependencies.byScope, { app: 1, build: 0, tests: 0, unknown: 1 });
  assert.deepEqual(previous.dependencies.byScope, { app: 1, build: 0, tests: 1, unknown: 0 }, 'scope column first, dev flag for rows without one');
  assert.equal(latest.advisories[0].scope, 'app');
  assert.deepEqual(latest.vulnerabilities.byScope, { app: 1, build: 0, tests: 0, unknown: 0 });
  assert.deepEqual(latest.vulnerabilities.bySeverity, { malicious: 0, critical: 0, high: 1, moderate: 0, low: 0, unknown: 0 });
  assert.equal(latest.advisories[0].id, 'GHSA-aaaa');
  assert.deepEqual([latest.advisories[0].products, latest.advisories[0].productsSameVersion], [2, 2], 'a@1.0.1 is shipped by app.android and app.other');
  assert.deepEqual(latest.diffFrom, { ref: 'v1.0.0', added: 1, removed: 1, changed: 1, integrityChangedAtSameVersion: [] });
  assert.equal(previous.diffFrom, undefined);
  assert.deepEqual(app.aliases, [{ appId: 'app.android' }, { appId: 'app.ios' }]);
  // as written to the file: undefined keys are left out
  const written = JSON.parse(JSON.stringify(latest));
  assert.deepEqual(Object.keys(app), ['schema', 'appId', 'aliases', 'releases']);
  assert.deepEqual(Object.keys(written), ['ref', 'commit', 'analysedAt', 'status', 'lockfiles', 'osv', 'dependencies', 'vulnerabilities', 'advisories', 'diffFrom']);
  assert.deepEqual(Object.keys(written.dependencies), ['total', 'direct', 'directUnknown', 'byScope', 'byEcosystem', 'lockfiles', 'sorting']);
  assert.deepEqual(Object.keys(written.vulnerabilities), ['bySeverity', 'byScope']);
  assert.deepEqual(Object.keys(written.advisories[0]), ['id', 'severity', 'aliases', 'summary', 'ecosystem', 'package', 'version', 'fixed', 'listedBy', 'direct', 'scope', 'dependants', 'products', 'productsSameVersion']);
  assert.deepEqual(written.advisories[0].listedBy, ['osv']);
});

// Issue 995: a statement records its direct user's version, so the row says it.
test('buildApp: an advisory row names its direct users\' versions, from the lockfiles the package is in', () => {
  const db = seeded();
  saveDependencies(db, 'app.android', 'v1.2.0', [
    { ecosystem: 'npm', entries: [entry('blib', '1.0.0', { direct: false, dependants: ['alib'] }), entry('alib', '2.0.0'), entry('clib', '1.0.0', { dependants: [] })] },
    { ecosystem: 'npm', entries: [entry('alib', '3.0.0', { lockfile: 'desktop/package-lock.json' })] },
  ]);
  saveVulnerabilities(db, 'app.android', 'v1.2.0', { findings: [
    { ecosystem: 'npm', name: 'blib', version: '1.0.0', id: 'GHSA-bbbb', aliases: [], severity: 'low', summary: 'x', fixed: [], direct: false, dev: false, dependants: ['alib'] },
    { ecosystem: 'npm', name: 'clib', version: '1.0.0', id: 'GHSA-cccc', aliases: [], severity: 'low', summary: 'x', fixed: [], direct: true, dev: false },
  ] });
  recordAnalysis(db, { appId: 'app.android', kind: 'release', ref: 'v1.2.0', commit: 'c3', status: 'ok', appType: 'npm', analyser: 't', plugins: ['pinning', 'osv'], lockfiles: ['package-lock.json'], dependencies: 4, osvChecked: 4, osvSkipped: {}, vulnerabilities: 2 });
  const latest = buildApp(db, 'app.android', [{ appId: 'app.android' }]).releases[0];
  assert.equal(latest.ref, 'v1.2.0');
  const byId = Object.fromEntries(latest.advisories.map(a => [a.id, a]));
  assert.deepEqual(byId['GHSA-bbbb'].dependantVersions, { alib: ['2.0.0'] }, 'not the desktop lockfile\'s alib');
  assert.equal(byId['GHSA-cccc'].dependantVersions, undefined, 'no direct users, no key');
});

// Issue 1016: git's fix version on a row, and the advisories left out for a backported fix.
test('buildApp: a native release exports git\'s fix versions and the backported advisories with commit and tag', () => {
  const db = seeded();
  const repo = 'https://github.com/python/cpython';
  saveDependencies(db, 'app.android', 'v1.2.0', [{ ecosystem: 'native', entries: [entry('python3', '3.11.16', { ecosystem: 'native', lockfile: 'p4a', tier: 'exact' })] }]);
  saveVulnerabilities(db, 'app.android', 'v1.2.0', {
    findings: [{ ecosystem: 'native', name: 'python3', version: '3.11.16', id: 'CVE-B', aliases: [], severity: 'high', summary: 'x', fixed: ['3.13.13', '3.11.17'], direct: true, dev: false, listedBy: ['nvd'],
      fixedFromGit: [{ version: '3.11.17', tag: 'v3.11.17', commit: 'b17', repo }] }],
    backported: [{ ecosystem: 'native', name: 'python3', version: '3.11.16', id: 'CVE-A', aliases: [], severity: 'moderate', summary: 'y', listedBy: ['nvd'], repo, commit: 'b16', tag: 'v3.11.16' }],
  });
  recordAnalysis(db, { appId: 'app.android', kind: 'release', ref: 'v1.2.0', commit: 'c3', status: 'ok', appType: 'p4a', analyser: 't', plugins: ['pinning', 'osv'], lockfiles: ['p4a'], dependencies: 1, osvChecked: 1, osvSkipped: {}, vulnerabilities: 1 });
  const latest = buildApp(db, 'app.android', [{ appId: 'app.android' }]).releases[0];
  assert.deepEqual(latest.advisories.map(a => [a.id, a.fixed, a.fixedFromGit]), [['CVE-B', ['3.13.13', '3.11.17'], [{ version: '3.11.17', tag: 'v3.11.17', commit: 'b17', repo }]]]);
  assert.deepEqual(latest.backported, [{ id: 'CVE-A', severity: 'moderate', aliases: [], summary: 'y', ecosystem: 'native', package: 'python3', version: '3.11.16', listedBy: ['nvd'], repo, commit: 'b16', tag: 'v3.11.16', targets: undefined }]);
  assert.equal(latest.vulnerabilities.bySeverity.moderate, 0, 'not counted');
  assert.equal(buildApp(db, 'app.android', [{ appId: 'app.android' }]).releases[1].backported, undefined, 'no key without any');
});

test('a release stored before the analyses table existed is exported without provenance', () => {
  const db = seeded();
  db.prepare("DELETE FROM analyses WHERE ref = 'v1.0.0'").run();
  const app = buildApp(db, 'app.android');
  const old = app.releases.find(r => r.ref === 'v1.0.0');
  assert.equal(old.analysedAt, null);
  assert.equal(old.dependencies.total, 2);
});

test('exportAll writes index, app files and dependency lists, atomically replacing the previous export', () => {
  const db = seeded();
  const dir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sa-export-')), 'export');
  fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, 'stale.json'), '{}');

  const result = exportAll(db, dir, {});
  assert.deepEqual(result, { apps: 3, releases: 3, dir, unlisted: {} });
  assert.ok(!fs.existsSync(path.join(dir, 'stale.json')));
  assert.ok(!fs.existsSync(`${dir}.previous`));
  assert.deepEqual(fs.readdirSync(path.dirname(dir)).filter(n => n.startsWith('.export-')), []);

  const index = JSON.parse(fs.readFileSync(path.join(dir, 'index.json'), 'utf8'));
  assert.deepEqual(index, { schema: 1, complete: true, apps: [{ appId: 'app.android', aliases: ['app.ios'] }, { appId: 'app.failed', aliases: [] }, { appId: 'app.other', aliases: [] }] });

  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir, 'apps', 'app.ios.json'), 'utf8')), { schema: 1, appId: 'app.android', alias: true });
  const app = JSON.parse(fs.readFileSync(path.join(dir, 'apps', 'app.android.json'), 'utf8'));
  assert.equal(app.releases[0].advisories.length, 1);
  assert.deepEqual(Object.keys(app), ['schema', 'appId', 'aliases', 'releases', 'extra']);
  assert.deepEqual(app.extra, {}, 'no upstream hints, no APK check: the page asks for neither');
  assert.equal('signals' in app, false, 'no signals.json yet: the page asks for it, as it did before');
  const deps = JSON.parse(fs.readFileSync(path.join(dir, 'apps', 'app.android', 'v1.1.0', 'dependencies.json'), 'utf8'));
  assert.deepEqual(deps.dependencies.map(d => `${d.name}@${d.version}`), ['a@1.0.1', 'c@3.0.0']);
  assert.deepEqual(Object.keys(deps), ['schema', 'dependencies']);
  assert.deepEqual(Object.keys(deps.dependencies[0]), ['ecosystem', 'name', 'version', 'lockfile', 'direct', 'scope', 'dependants', 'productsSameVersion'], 'no pinning tier, no count over all versions: nothing shows them');
  assert.equal(deps.dependencies[1].scope, null);
  assert.equal(deps.dependencies[0].scope, 'app');
  assert.deepEqual(deps.dependencies.map(d => d.productsSameVersion), [2, 1]);
  assert.ok(!fs.existsSync(path.join(dir, 'packages')));
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir, 'used-by.json'), 'utf8')),
    { schema: 1, packages: { 'npm:a': { 'app.android': ['1.0.0', '1.0.1'], 'app.other': ['1.0.1'] } } }, 'only packages with an advisory');
});

// A wallet page reads one app file: it carries its advisories' part of
// signals.json and names the ids with a file under upstream/ and apk/.
test('the app file carries its signals and names its upstream and apk files, from exportAll and exportApp', () => {
  const db = seeded();
  const dir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sa-export-')), 'export');
  fs.mkdirSync(path.join(dir, 'apk'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'apk', 'app.ios.json'), '{"schema":1}');
  fs.writeFileSync(path.join(dir, 'apk', 'app.other.json'), '{"schema":1}');
  fs.writeFileSync(path.join(dir, 'signals.json'), JSON.stringify({ schema: 1, date: '2026-11-20', epss: { 'CVE-2026-1': [0.5, 0.9], 'CVE-1999-1': [0.1, 0.2] }, published: { 'GHSA-aaaa': '2026-11-01', 'GHSA-zzzz': '2020-01-01' } }));
  const read = id => JSON.parse(fs.readFileSync(path.join(dir, 'apps', `${id}.json`), 'utf8'));
  const mine = { date: '2026-11-20', epss: { 'CVE-2026-1': [0.5, 0.9] }, published: { 'GHSA-aaaa': '2026-11-01' } };
  // the wallet's own ignore file speaks to its advisory: exportAll writes upstream/app.android.json
  const hint = db.prepare("INSERT INTO upstream_triage (repo_url, ref, file, tool, line, vuln_id, reason) VALUES ('https://github.com/org/app', 'v1.1.0', '.trivyignore', 'trivy', 1, 'GHSA-aaaa', 'not reachable')");
  hint.run();

  exportAll(db, dir, {});
  assert.ok(fs.existsSync(path.join(dir, 'upstream', 'app.android.json')));
  assert.deepEqual(read('app.android').extra, { upstream: ['app.android'], apk: ['app.ios'] }, 'the hints this export wrote, and the APK check under the alias id');
  db.prepare('DELETE FROM upstream_triage').run();
  exportAll(db, dir, {});
  assert.deepEqual(read('app.android').extra, { apk: ['app.ios'] }, 'no upstream hints any more');
  assert.deepEqual(read('app.android').signals, mine, 'by id and alias, no other wallet\'s; no kev part, as in signals.json');
  assert.deepEqual(read('app.other').extra, { apk: ['app.other'] });
  assert.deepEqual(read('app.other').signals, { date: '2026-11-20', epss: {}, published: {} });
  assert.deepEqual(read('app.failed').extra, {});

  fs.mkdirSync(path.join(dir, 'upstream'));
  fs.writeFileSync(path.join(dir, 'upstream', 'app.android.json'), '{"schema":1}');
  fs.rmSync(path.join(dir, 'apk', 'app.ios.json'));
  exportApp(db, dir, 'app.android');
  assert.deepEqual(read('app.android').extra, { upstream: ['app.android'] }, 'what the export has when the app is written');
  assert.deepEqual(read('app.android').signals, mine);

  // An export exportApp has to start (the directory was lost): the web server may still have
  // signals.json and both directories, so the app file claims nothing about them.
  const fresh = path.join(path.dirname(dir), 'fresh');
  exportApp(db, fresh, 'app.android');
  const started = JSON.parse(fs.readFileSync(path.join(fresh, 'apps', 'app.android.json'), 'utf8'));
  assert.deepEqual(['extra' in started, 'signals' in started], [false, false]);
});

// What only the database's own readers use is not written: the affected
// ranges (news.mjs asks the database), the second list of lockfiles, and
// OSS Rebuild's attestation summaries once per release.
test('the app file leaves out affected ranges and the repeated lockfiles; rebuild details are one file per app', () => {
  const db = seeded();
  saveVulnerabilities(db, 'app.android', 'v1.1.0', { findings: [
    { ecosystem: 'npm', name: 'a', version: '1.0.1', id: 'GHSA-aaaa', aliases: ['CVE-2026-1'], severity: 'high', summary: 'bad', fixed: ['1.0.2'], affected: ['< 1.0.2'], direct: true, dev: false },
  ] });
  db.prepare("DELETE FROM analyses WHERE app_id = 'app.android' AND ref = 'v1.0.0'").run();
  const url = (name, version) => `https://storage.googleapis.com/google-rebuild-attestations/npm/${name}/${version}/${name}-${version}.tgz/rebuild.intoto.jsonl`;
  const claim = db.prepare("INSERT INTO package_rebuilds (ecosystem, name, version, claimant, result, url) VALUES ('npm', ?, ?, ?, 'reproduced', ?)");
  claim.run('a', '1.0.0', 'oss-rebuild', url('a', '1.0.0'));
  claim.run('a', '1.0.1', 'oss-rebuild', url('a', '1.0.1'));
  claim.run('b', '2.0.0', 'oss-rebuild', 'https://elsewhere.example/b/rebuild.intoto.jsonl');
  claim.run('c', '3.0.0', 'reproducible-central', 'https://github.com/jvm-repo-rebuild/reproducible-central/blob/master/content/c/c-3.0.0.buildspec');
  const detail = db.prepare('INSERT INTO oss_rebuild_details (url, details) VALUES (?, ?)');
  for (const v of ['1.0.0', '1.0.1']) detail.run(url('a', v), JSON.stringify({ commit: v }));
  assert.deepEqual(buildApp(db, 'app.android').releases[0].advisories[0].affected, ['< 1.0.2'], 'still there for whoever reads the database');

  const dir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sa-export-')), 'export');
  const check = () => {
    const read = rel => JSON.parse(fs.readFileSync(path.join(dir, 'apps', rel), 'utf8'));
    const [latest, old] = read('app.android.json').releases;
    assert.equal('affected' in latest.advisories[0], false);
    assert.deepEqual(latest.advisories[0].fixed, ['1.0.2']);
    assert.deepEqual([latest.lockfiles, latest.dependencies.lockfiles], [['package-lock.json'], undefined], 'the analysis names its lockfiles: not said twice');
    assert.deepEqual([old.lockfiles, old.dependencies.lockfiles], [undefined, ['package-lock.json']], 'stored before analyses were recorded: the rows\' files are all there is');
    assert.deepEqual(read('app.android/v1.1.0/rebuilds.json').rows, [
      { ecosystem: 'npm', name: 'a', version: '1.0.1', claims: [{ by: 'oss-rebuild', result: 'reproduced', artifact: 'a-1.0.1.tgz' }] },
      { ecosystem: 'npm', name: 'c', version: '3.0.0', claims: [{ by: 'reproducible-central', result: 'reproduced', url: 'https://github.com/jvm-repo-rebuild/reproducible-central/blob/master/content/c/c-3.0.0.buildspec' }] },
    ], 'OSS Rebuild\'s URL as the artifact name the reader builds it from; another project\'s whole');
    assert.deepEqual(read('app.android/v1.0.0/rebuilds.json').rows.map(r => r.claims[0]), [
      { by: 'oss-rebuild', result: 'reproduced', artifact: 'a-1.0.0.tgz' },
      { by: 'oss-rebuild', result: 'reproduced', url: 'https://elsewhere.example/b/rebuild.intoto.jsonl' },
    ], 'a URL that is not the bucket\'s place for the package is kept whole');
    assert.deepEqual(read('app.android/rebuild-details.json'), { schema: 1, details: { [url('a', '1.0.1')]: { commit: '1.0.1' }, [url('a', '1.0.0')]: { commit: '1.0.0' } } }, 'every release\'s, once');
    for (const ref of ['v1.0.0', 'v1.1.0']) assert.ok(!fs.existsSync(path.join(dir, 'apps', 'app.android', ref, 'rebuild-details.json')));
    assert.deepEqual(Object.keys(read('app.other/rebuild-details.json').details), [url('a', '1.0.1')], 'another app: its own packages\' only');
  };
  exportAll(db, dir, {});
  check();
  // exportApp writes into the tree that is there: one from before, with a details file per release
  fs.writeFileSync(path.join(dir, 'apps', 'app.android', 'v1.1.0', 'rebuild-details.json'), '{"schema":1,"details":{}}');
  fs.rmSync(path.join(dir, 'apps', 'app.android', 'rebuild-details.json'));
  exportApp(db, dir, 'app.android');
  check();
  db.prepare('DELETE FROM oss_rebuild_details').run();
  exportApp(db, dir, 'app.android');
  assert.ok(!fs.existsSync(path.join(dir, 'apps', 'app.android', 'rebuild-details.json')), 'no summary left: no file left');
});

// The claim's URL goes out as the artifact name only when the reader's rule gives the same URL back.
test('rebuildRowForReaders: every URL as the bucket lists it comes back from the artifact name; another shape stays whole', () => {
  const packages = [['npm', 'buffer', '6.0.3', 'buffer-6.0.3.tgz'], ['npm', '@noble/hashes', '1.8.0', 'noble-hashes-1.8.0.tgz'], ['npm', 'JSONStream', '1.3.5+b1', 'JSONStream-1.3.5.tgz'],
    ['pip', 'Flask_Login.ext', '0.6.3', 'flask_login-0.6.3-py3-none-any.whl'], ['cargo', 'serde', '1.0.200', 'serde-1.0.200.crate']];
  for (const [ecosystem, name, version, artifact] of packages) {
    const prefix = ossRebuildPrefix(ecosystem, name);
    const [{ url }] = parseOssListing([`${prefix}${version}/${artifact}/rebuild.intoto.jsonl`], prefix).get(version);
    const [claim] = rebuildRowForReaders({ ecosystem, name, version, claims: [{ by: 'oss-rebuild', result: 'reproduced', url }] }).claims;
    assert.deepEqual(claim, { by: 'oss-rebuild', result: 'reproduced', artifact }, `${ecosystem} ${name}`);
    assert.equal(ossRebuildUrl(ecosystem, name, version, claim.artifact), url);
  }
  const base = 'https://storage.googleapis.com/google-rebuild-attestations/npm/buffer/6.0.3';
  for (const url of [`${base}/extra/buffer-6.0.3.tgz/rebuild.intoto.jsonl`, `${base}/buffer-6.0.3.tgz/other.jsonl`, 'https://elsewhere.example/npm/buffer/6.0.3/buffer-6.0.3.tgz/rebuild.intoto.jsonl']) {
    const row = { ecosystem: 'npm', name: 'buffer', version: '6.0.3', claims: [{ by: 'oss-rebuild', result: 'reproduced', url }, { by: 'ws', result: 'reproduced' }] };
    assert.deepEqual(rebuildRowForReaders(row), row, url);
  }
});

test('exportApp updates one app in place, leaving the rest of the export as it was', () => {
  const db = seeded();
  const dir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sa-export-')), 'export');
  exportAll(db, dir, {});
  const otherBefore = fs.readFileSync(path.join(dir, 'apps', 'app.other.json'), 'utf8');

  saveDependencies(db, 'app.android', 'v1.2.0', [{ ecosystem: 'npm', entries: [entry('a', '1.0.2')] }]);
  recordAnalysis(db, { appId: 'app.android', kind: 'release', ref: 'v1.2.0', commit: 'c3', status: 'ok', appType: 'npm', analyser: '1.0.1', dependencies: 1 });
  db.prepare("UPDATE analyses SET analysed_at = '2099-01-01 00:00:00' WHERE ref = 'v1.2.0'").run();
  saveDependencies(db, 'app.other', 'v10', [{ ecosystem: 'npm', entries: [entry('z', '2.0.0')] }]);
  recordAnalysis(db, { appId: 'app.other', kind: 'release', ref: 'v10', status: 'ok', analyser: '1.0.1' });

  const result = exportApp(db, dir, 'app.android');
  assert.deepEqual(result, { exported: true, releases: 3, files: ['index.json', 'apps/app.android.json', 'apps/app.android/', 'apps/app.ios.json'] });
  const app = JSON.parse(fs.readFileSync(path.join(dir, 'apps', 'app.android.json'), 'utf8'));
  assert.equal(app.releases[0].ref, 'v1.2.0');
  assert.ok(fs.existsSync(path.join(dir, 'apps', 'app.android', 'v1.2.0', 'dependencies.json')));
  assert.equal(fs.readFileSync(path.join(dir, 'apps', 'app.other.json'), 'utf8'), otherBefore, 'another app waits for the end of the pass');
  const index = JSON.parse(fs.readFileSync(path.join(dir, 'index.json'), 'utf8'));
  assert.deepEqual(index.apps.map(a => a.appId), ['app.android', 'app.failed', 'app.other']);
  assert.equal(index.complete, true, 'still the full export\'s index');
  assert.equal(JSON.parse(fs.readFileSync(path.join(dir, 'apps', 'app.other.json'), 'utf8')).releases[0].ref, 'v9');
  assert.deepEqual(fs.readdirSync(path.join(dir, 'apps')).filter(n => n.endsWith('.tmp')), []);
});

test('exportApp starts an export when there is none, with the alias stub', () => {
  const db = seeded();
  const dir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sa-export-')), 'export');
  const result = exportApp(db, dir, 'app.android');
  assert.deepEqual(result.files, ['index.json', 'apps/app.android.json', 'apps/app.android/', 'apps/app.ios.json']);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir, 'apps', 'app.ios.json'), 'utf8')), { schema: 1, appId: 'app.android', alias: true });
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir, 'index.json'), 'utf8')), { schema: 1, apps: [{ appId: 'app.android', aliases: ['app.ios'] }] }, 'not complete: only a full export knows every file');
});

test('exportApp leaves an app out of scope alone, and exports one verified under an alias', () => {
  const db = seeded();
  const dir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sa-export-')), 'export');
  assert.deepEqual(exportApp(db, dir, 'app.android', { onlyReproducible: true }), { exported: false });
  assert.ok(!fs.existsSync(dir));
  saveReproducibleVersions(db, new Map([['app.ios', [{ version: '1.1.0', verifiedAt: 1, platform: 'iphone' }]]]));
  assert.deepEqual(exportApp(db, dir, 'app.android', { onlyReproducible: true }), { exported: false }, 'no tag resolved to the verified version yet');
  saveVerifiedRef(db, 'app.android', 'v1.1.0', '1.1.0');
  assert.equal(exportApp(db, dir, 'app.android', { onlyReproducible: true }).exported, true);
});

test('onlyReproducible: only reproduced releases, each naming the listings it was reproduced for', () => {
  const db = seeded();
  // v1.1.0 reproduced on Android only, v1.0.0 by nobody; the iPhone app was never reproduced
  saveReproducibleVersions(db, new Map([['app.android', [{ version: '1.1.0', verifiedAt: 2, platform: 'Android (arm64-v8a)' }]]]));
  saveVerifiedRef(db, 'app.android', 'v1.1.0', '1.1.0');
  const dir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sa-export-')), 'export');
  const result = exportAll(db, dir, { onlyReproducible: true });
  assert.deepEqual([result.apps, result.releases], [1, 1]);
  const app = JSON.parse(fs.readFileSync(path.join(dir, 'apps', 'app.android.json'), 'utf8'));
  assert.deepEqual(app.releases.map(r => [r.ref, r.reproducedFor]), [['v1.1.0', [{ appId: 'app.android', platform: 'android', version: '1.1.0' }]]]);
  assert.equal(app.releases[0].diffFrom, undefined, 'no diff to a release that is not shown');
  assert.ok(!fs.existsSync(path.join(dir, 'apps', 'app.android', 'v1.0.0')));
  assert.ok(!fs.existsSync(path.join(dir, 'apps', 'app.ios.json')), 'no stub for a listing nobody reproduced');
  // without the option every release, as before
  assert.equal(buildApp(db, 'app.android', [{ appId: 'app.android' }, { appId: 'app.ios' }]).releases.length, 2);
});

test('exportApp onlyReproducible does not publish a stub for a listing nobody reproduced', () => {
  const db = seeded();
  saveAppList(db, [
    { appId: 'app.android', platform: 'android', repository: 'https://github.com/org/app' },
    { appId: 'app.ios', platform: 'iphone', repository: 'https://github.com/org/app' },
    { appId: 'app.hw', platform: 'hardware', repository: 'https://github.com/org/app' },
  ]);
  saveReproducibleVersions(db, new Map([['app.android', [{ version: '1.1.0', verifiedAt: 2, platform: 'Android (arm64-v8a)' }]]]));
  saveVerifiedRef(db, 'app.android', 'v1.1.0', '1.1.0');
  const dir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sa-export-')), 'export');
  const result = exportApp(db, dir, 'app.android', { onlyReproducible: true });
  assert.deepEqual(result.files, ['index.json', 'apps/app.android.json', 'apps/app.android/']);
  assert.ok(!fs.existsSync(path.join(dir, 'apps', 'app.hw.json')));
  assert.ok(!fs.existsSync(path.join(dir, 'apps', 'app.ios.json')));
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir, 'index.json'), 'utf8')).apps, [{ appId: 'app.android', aliases: [] }], 'the index names no alias without a stub');
});

test('onlyReproducible: an alias in scope with no release of its own gets the stub (Passport Batch 2)', () => {
  const db = seeded();
  // the iPhone listing is in scope and analysed, but every reproduced ref sits under app.android
  saveReproducibleVersions(db, new Map([['app.ios', [{ version: '1.1.0', verifiedAt: 2, platform: 'iphone' }]]]));
  saveVerifiedRef(db, 'app.android', 'v1.1.0', '1.1.0');
  recordAnalysis(db, { appId: 'app.ios', kind: 'verified-no-tag', ref: '1.1.0', status: 'unsupported', analyser: '1.0.1' });
  const dir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sa-export-')), 'export');
  const result = exportAll(db, dir, { onlyReproducible: true });
  assert.equal(result.apps, 1);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir, 'apps', 'app.ios.json'), 'utf8')), { schema: 1, appId: 'app.android', alias: true });
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir, 'index.json'), 'utf8')).apps, [{ appId: 'app.android', aliases: ['app.ios'] }]);
});

test('pagePlatform: verifiers\' platform tags as the wallet page names its platforms', () => {
  assert.deepEqual(['android', 'Android (arm64-v8a)', 'iphone', 'linux', 'windows', 'macos', 'hardware', null].map(pagePlatform),
    ['android', 'android', 'iphone', 'desktop', 'desktop', 'desktop', 'hardware', null]);
});


test('a lockfile of another product in the repository (desktop, server, web) marks its rows', () => {
  assert.equal(productPartOf('electron/package-lock.json'), 'desktop');
  assert.equal(productPartOf('apps/desktop/yarn.lock'), 'desktop');
  assert.equal(productPartOf('server/package-lock.json'), 'server');
  assert.equal(productPartOf('web/package-lock.json'), 'web');
  assert.equal(productPartOf('yarn.lock'), null);
  assert.equal(productPartOf('android/app/build.gradle'), null);
  assert.equal(productPartOf('electron.lock'), null, 'a file name is no directory');
  const db = initDatabase(':memory:');
  const e = (name, version, lockfile) => ({ ecosystem: 'npm', lockfile, name, version, resolved: '', integrity: '', direct: false, dev: true, tier: 'hash-pinned' });
  saveDependencies(db, 'w', 'v1', [{ ecosystem: 'npm', entries: [e('ejs', '3.1.5', 'electron/package-lock.json'), e('minimist', '1.2.0', 'electron/package-lock.json'), e('minimist', '1.2.0', 'yarn.lock')] }]);
  const f = (name, version, id) => ({ ecosystem: 'npm', name, version, id, severity: 'critical', aliases: [], fixed: [], summary: '', direct: false, dev: true });
  saveVulnerabilities(db, 'w', 'v1', { findings: [f('ejs', '3.1.5', 'GHSA-phwq-j96m-2c2q'), f('minimist', '1.2.0', 'GHSA-xvch-5gv4-984h')] });
  recordAnalysis(db, { appId: 'w', kind: 'release', ref: 'v1', status: 'ok', analyser: 't' });
  const rows = buildApp(db, 'w').releases[0].advisories;
  assert.deepEqual(rows.map(a => [a.package, a.part]), [['ejs', 'desktop'], ['minimist', undefined]], 'also in the main lockfile: the app\'s, not only the desktop\'s');
});

test('safeName keeps ids and tags readable but path-safe', () => {
  assert.equal(safeName('io.metamask'), 'io.metamask');
  assert.equal(safeName('android-v2.8.4'), 'android-v2.8.4');
  assert.equal(safeName('release/2.0 beta'), 'release_2.0_beta');
  assert.equal(safeName('../x'), '__x');
});


test('buildApp: releases analysed later but older (backfill) still sort after newer versions', () => {
  const db = initDatabase(':memory:');
  for (const v of ['v1.9.0', 'v1.10.0', 'v2.0.0-rc1', 'v2.0.0', 'v1.0.0']) {
    saveDependencies(db, 'app.b', v, [{ ecosystem: 'npm', entries: [entry('a', '1.0.0')] }]);
    recordAnalysis(db, { appId: 'app.b', kind: 'release', ref: v, commit: 'c', status: 'ok', appType: 'npm', analyser: 't', plugins: [], lockfiles: [], dependencies: 1, osvChecked: 1, osvSkipped: {}, vulnerabilities: 0 });
  }
  // v1.0.0 was backfilled last, so it has the newest analysis time.
  db.prepare("UPDATE analyses SET analysed_at = '2026-10-20 00:00:00' WHERE ref = 'v1.0.0'").run();
  assert.deepEqual(buildApp(db, 'app.b').releases.map(r => r.ref), ['v2.0.0', 'v2.0.0-rc1', 'v1.10.0', 'v1.9.0', 'v1.0.0']);
});

test('buildApp: a tag prefix with a dash in it (BitBox02) still sorts by its version', () => {
  const db = initDatabase(':memory:');
  const refs = ['firmware/v9.27.1', 'firmware-btc-only/v9.23.2', 'firmware-btc-only/v9.23.3', 'firmware/v9.26.1', 'firmware-btc-only/v9.25.0', 'firmware/v9.27.0', 'android-v9.26.4-rc1'];
  for (const v of refs) {
    saveDependencies(db, 'app.p', v, [{ ecosystem: 'npm', entries: [entry('a', '1.0.0')] }]);
    recordAnalysis(db, { appId: 'app.p', kind: 'release', ref: v, commit: 'c', status: 'ok', appType: 'npm', analyser: 't', plugins: [], lockfiles: [], dependencies: 1, osvChecked: 1, osvSkipped: {}, vulnerabilities: 0 });
  }
  // the newest version was analysed first, as on beta
  refs.forEach((v, i) => db.prepare('UPDATE analyses SET analysed_at = ? WHERE ref = ?').run(`2026-10-28 18:${String(30 + i).padStart(2, '0')}:00`, v));
  assert.deepEqual(buildApp(db, 'app.p').releases.map(r => r.ref),
    ['firmware/v9.27.1', 'firmware/v9.27.0', 'android-v9.26.4-rc1', 'firmware/v9.26.1', 'firmware-btc-only/v9.25.0', 'firmware-btc-only/v9.23.3', 'firmware-btc-only/v9.23.2']);
});

test('buildApp: a release carries the earliest publication day of its assets, else its tag commit day', () => {
  const db = initDatabase(':memory:');
  for (const v of ['v2.0.0', 'v1.0.0']) {
    saveDependencies(db, 'app.d', v, [{ ecosystem: 'npm', entries: [entry('a', '1.0.0')] }]);
    recordAnalysis(db, { appId: 'app.d', kind: 'release', ref: v, commit: 'c', status: 'ok', appType: 'npm', analyser: 't', plugins: [], lockfiles: [], dependencies: 1, osvChecked: 1, osvSkipped: {}, vulnerabilities: 0 });
  }
  const asset = db.prepare("INSERT INTO assets (app_id, source, version, asset_name, sha256, published_at) VALUES ('app.d', 'github', ?, ?, 'h', ?)");
  asset.run('v2.0.0', 'app.apk', '2026-10-02T15:34:04Z');
  asset.run('v2.0.0', 'app.aab', '2026-10-01T09:00:00Z');
  asset.run('v1.0.0', 'app.apk', null);
  assert.deepEqual(buildApp(db, 'app.d').releases.map(r => [r.ref, r.releasedAt]), [['v2.0.0', '2026-10-01'], ['v1.0.0', undefined]]);
  // a tag's commit day (releaseDates.mjs) fills in; an asset's day wins over it
  db.prepare("INSERT INTO release_dates (app_id, ref, released_at) VALUES ('app.d', 'v1.0.0', '2026-04-01'), ('app.d', 'v2.0.0', '2026-09-30')").run();
  assert.deepEqual(buildApp(db, 'app.d').releases.map(r => [r.ref, r.releasedAt]), [['v2.0.0', '2026-10-01'], ['v1.0.0', '2026-04-01']]);
});

test('submodules: counted in the release summary, advisories only where the code may be in the app, rows exported per release', () => {
  const db = initDatabase(':memory:');
  saveAppList(db, [{ appId: 'cpp.wallet', platform: 'android', repository: 'https://github.com/org/cpp-wallet' }]);
  recordAnalysis(db, { appId: 'cpp.wallet', kind: 'release', ref: 'v2', commit: 'a'.repeat(40), status: 'unsupported', analyser: 't', appType: 'unknown' });
  const rows = [
    { path: 'contrib/own', firstParty: true, scope: { status: 'assumed' }, identity: { status: 'upstream-commit' }, advisories: { status: 'none-listed', applies: [] } },
    { path: 'contrib/openssl', scope: { status: 'assumed' }, identity: { status: 'upstream-tag', tag: 'openssl-3.0.13' }, advisories: { status: 'affected', applies: ['CVE-1', 'CVE-2'] }, buildRefs: { referenced: true, whole: false, parts: ['crypto'] }, childrenError: 'cannot list' },
    { path: 'contrib/openssl/krb5', depth: 2, scope: { status: 'test-only', why: 'x', via: 'contrib/openssl' }, identity: { status: 'upstream-commit' }, advisories: { status: 'affected', applies: ['CVE-3'] } },
    { path: 'contrib/fork', scope: { status: 'assumed' }, identity: { status: 'derived', base: 'v1', baseCommit: 'b'.repeat(40), ahead: 2, files: ['src/a.c', 'src/b.c', 'README'] }, advisories: { status: 'unknown', base: 'v1', unknown: [{ id: 'CVE-4', hint: 'cant-tell' }] } },
    { path: 'contrib/gone', error: 'cannot reach' },
  ];
  saveSubmodules(db, 'cpp.wallet', 'v2', 'a'.repeat(40), rows);
  const app = buildApp(db, 'cpp.wallet');
  assert.deepEqual(app.releases[0].submodules, {
    total: 5, errors: 1, firstParty: 1, notInApp: 1, derived: 1, unknownOrigin: 0, affected: 1, advisories: 2, advisoriesUnknown: 1,
  });
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'sa-export-subs-'));
  try {
    exportAll(db, path.join(out, 'export'));
    const file = JSON.parse(fs.readFileSync(path.join(out, 'export', 'apps', 'cpp.wallet', 'v2', 'submodules.json'), 'utf8'));
    assert.deepEqual(Object.keys(file), ['schema', 'rows']);
    assert.deepEqual(file.rows[2], { path: 'contrib/openssl/krb5', scope: { status: 'test-only', why: 'x' }, identity: { status: 'upstream-commit' }, advisories: { status: 'affected', applies: ['CVE-3'] } });
    assert.deepEqual(file.rows[3].identity, { status: 'derived', base: 'v1', ahead: 2, filesChanged: 3 }, 'how many files a modified copy changed, not their names');
    assert.deepEqual(file.rows[1], { path: 'contrib/openssl', scope: { status: 'assumed' }, identity: { status: 'upstream-tag', tag: 'openssl-3.0.13' }, advisories: { status: 'affected', applies: ['CVE-1', 'CVE-2'] } }, 'the walk\'s own notes stay in the database');
    assert.deepEqual(file.rows[0], rows[0]);
  } finally {
    fs.rmSync(out, { recursive: true, force: true });
  }
});

test('buildApp: lock coverage regraded with the current rules, capped for the page', () => {
  const db = initDatabase(':memory:');
  saveAppList(db, [{ appId: 'app.flutter', platform: 'android', repository: 'https://github.com/org/flutter' }]);
  const manifests = [
    { ecosystem: 'npm', manifest: 'package.json', lockfile: 'package-lock.json', product: true },
    { ecosystem: 'pub', manifest: 'pubspec.yaml', lockfile: 'pubspec.lock', product: true },
  ];
  // stored by an older analyser: 'locked', with a SQL FROM, a health check and a dev container as downloads
  const downloads = [
    { kind: 'container-base-image', target: 'communities', file: 'scripts/seed.sh', line: 3 },
    { kind: 'curl', target: 'http://127.0.0.1:3000/_readiness', file: 'scripts/wait.sh', line: 1 },
    { kind: 'container-base-image', target: 'node:20', file: '.devcontainer/Dockerfile', line: 1 },
  ];
  const stored = { verdict: 'unlocked', manifests, missing: 0, floatingRows: {}, unlisted: { downloadCount: 3, binaryCount: 0, downloads, binaries: [] } };
  recordAnalysis(db, { appId: 'app.flutter', kind: 'release', ref: 'v1', commit: 'c1', status: 'ok', appType: 'flutter', analyser: 't', lockCoverage: stored });
  assert.deepEqual(buildApp(db, 'app.flutter').releases[0].lockCoverage, {
    verdict: 'unknown', missing: [], missingCount: 0,
    unread: [{ ecosystem: 'pub', manifest: 'pubspec.yaml', lockfile: 'pubspec.lock' }], unreadCount: 1,
    floating: 0, downloads: [], downloadCount: 0, downloadPlaceCount: 0, binaries: [], binaryCount: 0,
  });

  const many = Array.from({ length: 8 }, (_, i) => ({ ecosystem: 'npm', manifest: `pkg${i}/package.json`, lockfile: null, product: true }));
  recordAnalysis(db, { appId: 'app.flutter', kind: 'release', ref: 'v2', commit: 'c2', status: 'ok', appType: 'npm', analyser: 't',
    lockCoverage: { manifests: many, floatingRows: { gradle: 2 }, unlisted: { downloadCount: 60, binaryCount: 1, downloads: [{ kind: 'wget', target: 'https://x/sdk.zip', file: 'Dockerfile', line: 4 }], binaries: [{ path: 'libs/x.aar' }] } } });
  const c = buildApp(db, 'app.flutter').releases[0].lockCoverage;
  assert.equal(c.verdict, 'unlocked');
  assert.equal(c.missing.length, 5);
  assert.equal(c.missingCount, 8);
  assert.equal(c.floating, 2);
  assert.deepEqual(c.downloads, [{ file: 'Dockerfile', line: 4, target: 'https://x/sdk.zip' }]);
  assert.equal(c.downloadCount, 60, 'the stored count is complete; only listed downloads can be dropped');
  assert.deepEqual(c.binaries, ['libs/x.aar']);
});

test('buildApp: lock coverage per app when one repository builds both', () => {
  const db = initDatabase(':memory:');
  saveAppList(db, [{ appId: 'it.vault', platform: 'android', repository: 'https://github.com/org/vault' }]);
  const manifests = [
    { ecosystem: 'npm', manifest: 'package.json', lockfile: 'yarn.lock', product: true },
    { ecosystem: 'cocoapods', manifest: 'ios/App/Podfile', lockfile: 'ios/App/Podfile.lock', product: true },
  ];
  recordAnalysis(db, { appId: 'it.vault', kind: 'release', ref: 'v1', commit: 'c1', status: 'ok', appType: 'npm', analyser: 't',
    lockCoverage: { manifests, floatingRows: {}, floatingFiles: {}, unlisted: { downloadCount: 0, binaryCount: 0, downloads: [], binaries: [] } } });
  const r = buildApp(db, 'it.vault').releases[0];
  assert.equal(r.lockCoverage.verdict, 'unknown');
  assert.equal(r.lockCoverageByPlatform.android.verdict, 'locked', 'the Podfile is not part of the Android app');
  assert.equal(r.lockCoverageByPlatform.iphone, undefined, 'the iPhone page sees the same as the whole');
});

test('no app list stops the export, and the last good export stays', () => {
  const dir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sa-nolist-')), 'out');
  const db = seeded();
  exportAll(db, dir);
  const before = fs.readFileSync(path.join(dir, 'index.json'), 'utf8');
  const empty = initDatabase(':memory:');
  assert.throws(() => exportAll(empty, dir), /app list is empty/);
  assert.throws(() => exportApp(empty, dir, 'app.android'), /app list is empty/);
  assert.equal(fs.readFileSync(path.join(dir, 'index.json'), 'utf8'), before);
  assert.deepEqual(fs.readdirSync(path.dirname(dir)), ['out'], 'no half-made export left behind');
});

test('buildApp: counts per target and advisory targets, only for a wallet on the hand-made list', () => {
  const db = initDatabase(':memory:');
  const id = 'it.airgap.vault';
  saveAppList(db, [{ appId: id, platform: 'android', repository: 'https://github.com/airgap-it/airgap-vault' }]);
  loadRepositories(db);
  const e = (name, lockfile, extra = {}) => ({ ecosystem: 'npm', lockfile, name, version: '1.0.0', resolved: '', integrity: '', direct: false, dev: false, tier: 'hash-pinned', ...extra });
  saveDependencies(db, id, 'v1', [{ ecosystem: 'npm', entries: [
    e('a', 'package-lock.json', { direct: true }),
    e('b', 'electron/package-lock.json'),
    e('c', 'electron/package-lock.json'),
    e('c', 'package-lock.json', { dev: true }),
    e('d', 'android/build.gradle'),
  ] }]);
  const f = (name, extra = {}) => ({ ecosystem: 'npm', name, version: '1.0.0', id: `GHSA-${name}`, severity: 'high', aliases: [], fixed: [], summary: '', direct: false, dev: false, ...extra });
  saveVulnerabilities(db, id, 'v1', { findings: [f('a'), f('b'), f('c')] });
  recordAnalysis(db, { appId: id, kind: 'release', ref: 'v1', status: 'ok', analyser: 't' });
  saveDependencies(db, 'single', 'v1', [{ ecosystem: 'npm', entries: [e('a', 'package-lock.json'), e('b', 'electron/package-lock.json')] }]);
  saveVulnerabilities(db, 'single', 'v1', { findings: [f('a')] });
  recordAnalysis(db, { appId: 'single', kind: 'release', ref: 'v1', status: 'ok', analyser: 't' });

  const [release] = buildApp(db, id).releases;
  assert.deepEqual(Object.keys(release.dependencies.byTarget), ['android', 'desktop', 'shared']);
  assert.equal(release.dependencies.byTarget.desktop.total, 2);
  assert.equal(release.dependencies.byTarget.shared.total, 2);
  assert.equal(release.dependencies.byTarget.shared.direct, 1);
  assert.deepEqual(release.dependencies.byTarget.desktop.byEcosystem, { npm: 2 });
  assert.equal(release.dependencies.total, 4, 'c is in two files and counts once');
  assert.deepEqual(Object.keys(release.dependencies.byPlatform), ['android', 'iphone', 'desktop', 'hardware']);
  assert.deepEqual([release.dependencies.byPlatform.android.total, release.dependencies.byPlatform.android.direct], [3, 1], 'shared a and c, android d');
  assert.deepEqual(release.dependencies.byPlatform.android.byScope, { app: 2, build: 1, tests: 0, unknown: 0 }, 'c is only a build tool in the shared file');
  assert.deepEqual(release.dependencies.byPlatform.desktop.byScope, { app: 3, build: 0, tests: 0, unknown: 0 }, 'c ships in the desktop app');
  assert.deepEqual(release.advisories.map(a => [a.package, a.targets]), [['a', undefined], ['b', ['desktop']], ['c', ['desktop', 'shared']]]);
  assert.deepEqual(release.dependencies.onlyOutside, { android: 1, iphone: 2, desktop: 1, hardware: 2 }, 'c is in a shared file, so it is in the app');
  assert.deepEqual(release.advisories.find(a => a.package === 'c').scopes, { desktop: 'app', shared: 'build' });

  const [single] = buildApp(db, 'single').releases;
  assert.equal(single.dependencies.byTarget, undefined, 'a guess alone changes nothing: electron/ still counts');
  assert.equal(single.dependencies.onlyOutside, undefined);
  assert.deepEqual(single.dependencies.unlisted, ['electron/package-lock.json'], 'the guess is named for review');
  assert.equal(release.dependencies.unlisted, undefined, 'everything the guess flags has a rule');
  assert.equal(single.advisories[0].targets, undefined);
});

test('dependencies.json: each row names its product, for a wallet whose release is split by target', () => {
  const db = initDatabase(':memory:');
  const id = 'it.airgap.vault';
  saveAppList(db, [{ appId: id, platform: 'android', repository: 'https://github.com/airgap-it/airgap-vault' }]);
  loadRepositories(db);
  const e = (name, lockfile) => ({ ecosystem: 'npm', lockfile, name, version: '1.0.0', resolved: '', integrity: '', direct: false, dev: false, tier: 'hash-pinned' });
  saveDependencies(db, id, 'v1', [{ ecosystem: 'npm', entries: [e('a', 'package-lock.json'), e('b', 'electron/package-lock.json'), e('d', 'android/build.gradle')] }]);
  recordAnalysis(db, { appId: id, kind: 'release', ref: 'v1', status: 'ok', analyser: 't' });
  saveDependencies(db, 'single', 'v1', [{ ecosystem: 'npm', entries: [e('a', 'package-lock.json'), e('b', 'electron/package-lock.json')] }]);
  recordAnalysis(db, { appId: 'single', kind: 'release', ref: 'v1', status: 'ok', analyser: 't' });
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sa-target-'));
  exportAll(db, dir, {});
  const rows = appId => JSON.parse(fs.readFileSync(path.join(dir, 'apps', appId, 'v1', 'dependencies.json'), 'utf8')).dependencies;
  const [release] = JSON.parse(fs.readFileSync(path.join(dir, 'apps', `${id}.json`), 'utf8')).releases;
  assert.deepEqual(rows(id).map(d => [d.name, d.target]).sort(), [['a', 'shared'], ['b', 'desktop'], ['d', 'android']]);
  for (const [target, c] of Object.entries(release.dependencies.byTarget)) {
    assert.equal(rows(id).filter(d => d.target === target).length, c.total, `the rows of ${target} add up to its count`);
  }
  assert.deepEqual(rows('single').map(d => d.target), [undefined, undefined], 'a release with only shared files stays as it was');
  fs.rmSync(dir, { recursive: true, force: true });
});

test('Where?: a rule that contradicts the folder guess takes the label off rows and advisories', () => {
  const db = initDatabase(':memory:');
  const id = 'com.coinspace.app';
  saveAppList(db, [{ appId: id, platform: 'android', repository: 'https://github.com/CoinSpace/CoinSpace' }]);
  loadRepositories(db);
  const e = (name, lockfile) => ({ ecosystem: 'npm', lockfile, name, version: '1.0.0', resolved: '', integrity: '', direct: false, dev: false, tier: 'hash-pinned' });
  saveDependencies(db, id, 'v1', [{ ecosystem: 'npm', entries: [e('a', 'web/package-lock.json'), e('b', 'electron/package-lock.json')] }]);
  const f = name => ({ ecosystem: 'npm', name, version: '1.0.0', id: `GHSA-${name}`, severity: 'high', aliases: [], fixed: [], summary: '', direct: false, dev: false });
  saveVulnerabilities(db, id, 'v1', { findings: [f('a'), f('b')] });
  recordAnalysis(db, { appId: id, kind: 'release', ref: 'v1', status: 'ok', analyser: 't' });
  const rows = buildApp(db, id).releases[0].advisories;
  assert.deepEqual(rows.map(a => [a.package, a.part]), [['a', undefined], ['b', 'desktop']]);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sa-where-'));
  exportAll(db, dir, {});
  const deps = JSON.parse(fs.readFileSync(path.join(dir, 'apps', id, 'v1', 'dependencies.json'), 'utf8')).dependencies;
  assert.deepEqual(deps.map(d => [d.name, d.part]).sort(), [['a', undefined], ['b', 'desktop']]);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('buildApp: each package counts once, direct before unknown before transitive (issue 1027)', () => {
  const db = initDatabase(':memory:');
  const row = (ecosystem, name, version, lockfile, extra = {}) => ({ ecosystem, lockfile, name, version, resolved: '', integrity: '', direct: false, dev: false, tier: 'hash-pinned', ...extra });
  saveDependencies(db, 'app.pip', 'v1', [
    { ecosystem: 'pip', entries: [
      // one package under three spellings: PEP 503 folds case, `_`, `.` and extras
      row('pip', 'pyproject_hooks', '1.2.0', 'a.txt', { direct: null }),
      row('pip', 'Pyproject.Hooks', '1.2.0', 'b.txt', { direct: true }),
      row('pip', 'pyproject-hooks[cli]', '1.2.0', 'c.txt'),
      // transitive in one file, unknown in another: unknown
      row('pip', 'tomli', '2.0.2', 'a.txt', { direct: null }),
      row('pip', 'tomli', '2.0.2', 'b.txt'),
      // versions are not folded: two packages
      row('pip', 'six', '1.0', 'a.txt'),
      row('pip', 'six', '1.0.0', 'b.txt'),
      // a build row and an unknown-scope row: unknown; tests and build: build
      row('pip', 'wheel', '0.45.1', 'a.txt', { scope: 'build' }),
      row('pip', 'wheel', '0.45.1', 'b.txt', { dev: null }),
      row('pip', 'pytest', '8.0.0', 'a.txt', { scope: 'tests' }),
      row('pip', 'pytest', '8.0.0', 'b.txt', { scope: 'build' }),
    ] },
    // other ecosystems keep their names as stored
    { ecosystem: 'gradle', entries: [
      row('gradle', 'org.Foo:bar', '1.0', 'build.gradle'),
      row('gradle', 'org.foo:bar', '1.0', 'build.gradle'),
    ] },
  ]);
  recordAnalysis(db, { appId: 'app.pip', kind: 'release', ref: 'v1', status: 'ok', analyser: 't' });
  const [release] = buildApp(db, 'app.pip').releases;
  const c = release.dependencies;
  assert.equal(c.total, 8, 'pyproject-hooks, tomli, six twice, wheel, pytest, two gradle names');
  assert.equal(c.direct, 1, 'pyproject-hooks: one direct row wins');
  assert.equal(c.directUnknown, 1, 'tomli');
  assert.deepEqual(c.byScope, { app: 6, build: 1, tests: 0, unknown: 1 });
  assert.deepEqual(c.byEcosystem, { gradle: 2, pip: 6 });
});

test('buildApp: "could not be checked" counts packages, as the total does (issue 1027)', () => {
  const db = initDatabase(':memory:');
  saveAppList(db, [{ appId: 'app.s', platform: 'android', repository: 'https://github.com/org/s' }]);
  saveDependencies(db, 'app.s', 'v1', [{ ecosystem: 'npm', entries: [
    // one floating package in two files: one skipped package
    entry('f', '^1.0.0', { tier: 'floating' }), entry('f', '^1.0.0', { tier: 'floating', lockfile: 'sub/package-lock.json' }),
    // skipped in one file, looked up in the other: checked
    entry('g', '1.0.0', { resolved: 'git+https://github.com/x/g.git#abc' }), entry('g', '1.0.0', { lockfile: 'sub/package-lock.json' }),
    entry('ok', '1.0.0'),
  ] }]);
  recordAnalysis(db, { appId: 'app.s', kind: 'release', ref: 'v1', status: 'ok', appType: 'npm', analyser: 't', plugins: ['pinning', 'osv'], lockfiles: [],
    dependencies: 5, osvChecked: 2, osvSkipped: { floating: 2, 'git-or-path': 1, 'nvd-unavailable': 3 }, vulnerabilities: 0 });
  const [release] = buildApp(db, 'app.s').releases;
  assert.equal(release.dependencies.total, 3);
  assert.deepEqual(release.osv, { skipped: { floating: 1, 'nvd-unavailable': 3 } }, 'lookups NVD could not answer stay as stored');
});

test('buildApp: an advisory found only in labelled files carries the label; unsettled pip files are listed (issue 1027)', () => {
  const db = initDatabase(':memory:');
  const id = 'bitcoin.safe';
  saveAppList(db, [{ appId: id, platform: 'desktop', repository: 'https://github.com/andreasgriffin/bitcoin-safe' }]);
  loadRepositories(db);
  const mac = 'tools/deterministic-build/requirements-build_mac_x86_64.txt';
  const all = 'tools/deterministic-build/requirements-build.txt';
  const flatpak = 'tools/build_linux/flathub_flatpak/requirements-runtime.txt';
  const e = (name, version, lockfile, direct) => ({ ecosystem: 'pip', lockfile, name, version, resolved: '', integrity: '', direct, dev: null, tier: 'hash-pinned' });
  saveDependencies(db, id, '2.3.0', [{ ecosystem: 'pip', entries: [
    e('cryptography', '48.0.1', mac, false),
    e('cryptography', '50.0.2', all, false),
    e('cryptography', '50.0.2', flatpak, null),
    e('ecdsa', '0.19.2', mac, false),
    e('ecdsa', '0.19.2', all, false),
  ] }]);
  const f = (name, version) => ({ ecosystem: 'pip', name, version, id: `GHSA-${name}`, severity: 'high', aliases: [], fixed: [], summary: '', direct: false, dev: null });
  saveVulnerabilities(db, id, '2.3.0', { findings: [f('cryptography', '48.0.1'), f('ecdsa', '0.19.2')] });
  recordAnalysis(db, { appId: id, kind: 'release', ref: '2.3.0', status: 'ok', analyser: 't' });
  const [release] = buildApp(db, id).releases;
  assert.deepEqual(release.advisories.map(a => [a.package, a.labels]), [['cryptography', ['macOS Intel build only']], ['ecdsa', undefined]],
    'ecdsa 0.19.2 is in every build too');
  assert.deepEqual(release.dependencies.unprovenPip, [flatpak]);
});
