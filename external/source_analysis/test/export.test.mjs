// The static export (export.mjs): index, per-app file and per-release
// dependency list, built from stored rows in a temp dir and swapped in atomically.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { initDatabase, saveDependencies, saveVulnerabilities, recordAnalysis, saveAppList, saveReproducibleVersions, saveSubmodules } from '../ddbbUtils.mjs';
import { exportAll, exportApp, buildApp, safeName, productPartOf } from '../export.mjs';

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
    { ecosystem: 'npm', name: 'a', version: '1.0.1', id: 'GHSA-aaaa', aliases: ['CVE-2026-1'], severity: 'high', summary: 'bad', fixed: ['1.0.2'], direct: true, dev: false },
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
  assert.deepEqual(Object.keys(written.dependencies), ['total', 'direct', 'byScope', 'byEcosystem', 'lockfiles']);
  assert.deepEqual(Object.keys(written.vulnerabilities), ['bySeverity', 'byScope']);
  assert.deepEqual(Object.keys(written.advisories[0]), ['id', 'severity', 'aliases', 'summary', 'ecosystem', 'package', 'version', 'fixed', 'direct', 'scope', 'dependants', 'products', 'productsSameVersion']);
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
  assert.deepEqual(result, { apps: 3, releases: 3, dir });
  assert.ok(!fs.existsSync(path.join(dir, 'stale.json')));
  assert.ok(!fs.existsSync(`${dir}.previous`));
  assert.deepEqual(fs.readdirSync(path.dirname(dir)).filter(n => n.startsWith('.export-')), []);

  const index = JSON.parse(fs.readFileSync(path.join(dir, 'index.json'), 'utf8'));
  assert.deepEqual(index, { schema: 1, apps: [{ appId: 'app.android' }, { appId: 'app.failed' }, { appId: 'app.other' }] });

  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir, 'apps', 'app.ios.json'), 'utf8')), { schema: 1, appId: 'app.android', alias: true });
  const app = JSON.parse(fs.readFileSync(path.join(dir, 'apps', 'app.android.json'), 'utf8'));
  assert.equal(app.releases[0].advisories.length, 1);
  const deps = JSON.parse(fs.readFileSync(path.join(dir, 'apps', 'app.android', 'v1.1.0', 'dependencies.json'), 'utf8'));
  assert.deepEqual(deps.dependencies.map(d => `${d.name}@${d.version}:${d.tier}`), ['a@1.0.1:hash-pinned', 'c@3.0.0:floating']);
  assert.deepEqual(Object.keys(deps), ['schema', 'dependencies']);
  assert.deepEqual(Object.keys(deps.dependencies[0]), ['ecosystem', 'name', 'version', 'lockfile', 'tier', 'direct', 'scope', 'dependants', 'products', 'productsSameVersion']);
  assert.equal(deps.dependencies[1].scope, null);
  assert.equal(deps.dependencies[0].scope, 'app');
  assert.deepEqual(deps.dependencies.map(d => [d.products, d.productsSameVersion]), [[2, 2], [1, 1]]);
  assert.ok(!fs.existsSync(path.join(dir, 'packages')));
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
  assert.equal(JSON.parse(fs.readFileSync(path.join(dir, 'apps', 'app.other.json'), 'utf8')).releases[0].ref, 'v9');
  assert.deepEqual(fs.readdirSync(path.join(dir, 'apps')).filter(n => n.endsWith('.tmp')), []);
});

test('exportApp starts an export when there is none, with the alias stub', () => {
  const db = seeded();
  const dir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sa-export-')), 'export');
  const result = exportApp(db, dir, 'app.android');
  assert.deepEqual(result.files, ['index.json', 'apps/app.android.json', 'apps/app.android/', 'apps/app.ios.json']);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir, 'apps', 'app.ios.json'), 'utf8')), { schema: 1, appId: 'app.android', alias: true });
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir, 'index.json'), 'utf8')).apps.map(a => a.appId), ['app.android']);
});

test('exportApp leaves an app out of scope alone, and exports one verified under an alias', () => {
  const db = seeded();
  const dir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sa-export-')), 'export');
  assert.deepEqual(exportApp(db, dir, 'app.android', { onlyReproducible: true }), { exported: false });
  assert.ok(!fs.existsSync(dir));
  saveReproducibleVersions(db, new Map([['app.ios', [{ version: '1.1.0', verifiedAt: 1 }]]]));
  assert.equal(exportApp(db, dir, 'app.android', { onlyReproducible: true }).exported, true);
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
  recordAnalysis(db, { appId: 'cpp.wallet', kind: 'release', ref: 'v2', commit: 'a'.repeat(40), status: 'unsupported', analyser: 't', appType: 'unknown' });
  const rows = [
    { path: 'contrib/own', firstParty: true, scope: { status: 'assumed' }, identity: { status: 'upstream-commit' }, advisories: { status: 'none-listed', applies: [] } },
    { path: 'contrib/openssl', scope: { status: 'assumed' }, identity: { status: 'upstream-tag', tag: 'openssl-3.0.13' }, advisories: { status: 'affected', applies: ['CVE-1', 'CVE-2'] } },
    { path: 'contrib/openssl/krb5', depth: 2, scope: { status: 'test-only', why: 'x', via: 'contrib/openssl' }, identity: { status: 'upstream-commit' }, advisories: { status: 'affected', applies: ['CVE-3'] } },
    { path: 'contrib/fork', scope: { status: 'assumed' }, identity: { status: 'derived', base: 'v1', baseCommit: 'b'.repeat(40) }, advisories: { status: 'unknown', base: 'v1', unknown: [{ id: 'CVE-4', hint: 'cant-tell' }] } },
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
    assert.deepEqual(file.rows[3].identity, { status: 'derived', base: 'v1' });
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
