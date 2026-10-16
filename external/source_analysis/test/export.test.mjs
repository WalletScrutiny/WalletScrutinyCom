// The static export (export.mjs): index, per-app file and per-release
// dependency list, built from stored rows in a temp dir and swapped in atomically.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { initDatabase, saveDependencies, saveVulnerabilities, recordAnalysis, saveAppList } from '../ddbbUtils.mjs';
import { exportAll, buildApp, safeName, sharedPackages } from '../export.mjs';

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

test('buildApp: releases newest first with summary, advisories, diff and provenance', () => {
  const app = buildApp(seeded(), 'app.android', [{ appId: 'app.android', platform: 'android' }, { appId: 'app.ios', platform: 'iphone' }]);
  assert.equal(app.releases.length, 2);
  const [latest, previous] = app.releases;
  assert.equal(latest.ref, 'v1.1.0');
  assert.equal(latest.commit, 'c2');
  assert.deepEqual(latest.osv, { checked: 1, skipped: { floating: 1 } });
  assert.equal(latest.dependencies.total, 2);
  assert.equal(latest.dependencies.tiers.floating, 1);
  assert.equal(latest.dependencies.devUnknown, 1);
  assert.deepEqual(latest.dependencies.byScope, { app: 1, build: 0, tests: 0, unknown: 1 });
  assert.deepEqual(previous.dependencies.byScope, { app: 1, build: 0, tests: 1, unknown: 0 }, 'scope column first, dev flag for rows without one');
  assert.equal(latest.advisories[0].scope, 'app');
  assert.deepEqual(latest.vulnerabilities.byScope, { app: 1, build: 0, tests: 0, unknown: 0 });
  assert.deepEqual(latest.vulnerabilities.bySeverity, { malicious: 0, critical: 0, high: 1, moderate: 0, low: 0, unknown: 0 });
  assert.equal(latest.advisories[0].id, 'GHSA-aaaa');
  assert.deepEqual(latest.advisories[0].fixed, ['1.0.2']);
  assert.deepEqual([latest.advisories[0].products, latest.advisories[0].productsSameVersion], [2, 2], 'a@1.0.1 is shipped by app.android and app.other');
  assert.deepEqual(latest.diffFrom, { ref: 'v1.0.0', added: 1, removed: 1, changed: 1, integrityChangedAtSameVersion: [] });
  assert.equal(previous.diffFrom, undefined);
  assert.equal(previous.dependencies.dev, 1);
  assert.equal(app.defaultBranch.commit, 'headsha');
  assert.equal(app.aliases.length, 2);
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

  const result = exportAll(db, dir, { generatedAt: '2026-10-16T00:00:00Z', analyser: '1.0.0+abc' });
  assert.deepEqual(result, { apps: 3, releases: 3, dir });
  assert.ok(!fs.existsSync(path.join(dir, 'stale.json')));
  assert.ok(!fs.existsSync(`${dir}.previous`));
  assert.deepEqual(fs.readdirSync(path.dirname(dir)).filter(n => n.startsWith('.export-')), []);

  const index = JSON.parse(fs.readFileSync(path.join(dir, 'index.json'), 'utf8'));
  assert.equal(index.schema, 1);
  assert.equal(index.analyser, '1.0.0+abc');
  assert.deepEqual(index.apps.map(a => a.appId), ['app.android', 'app.failed', 'app.other']);
  const android = index.apps[0];
  assert.equal(android.latest.ref, 'v1.1.0');
  assert.equal(android.latest.vulnerabilities.high, 1);
  assert.deepEqual(android.aliases.map(a => a.appId), ['app.android', 'app.ios']);
  assert.equal(index.apps[1].latest, null);
  assert.equal(index.apps[1].defaultBranch.status, 'failed');

  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir, 'apps', 'app.ios.json'), 'utf8')), { schema: 1, appId: 'app.android', alias: true });
  const app = JSON.parse(fs.readFileSync(path.join(dir, 'apps', 'app.android.json'), 'utf8'));
  assert.equal(app.releases[0].advisories.length, 1);
  const deps = JSON.parse(fs.readFileSync(path.join(dir, 'apps', 'app.android', 'v1.1.0', 'dependencies.json'), 'utf8'));
  assert.deepEqual(deps.dependencies.map(d => `${d.name}@${d.version}:${d.tier}`), ['a@1.0.1:hash-pinned', 'c@3.0.0:floating']);
  assert.equal(deps.dependencies[1].dev, null);
  assert.equal(deps.dependencies[1].scope, null);
  assert.equal(deps.dependencies[0].scope, 'app');
  assert.deepEqual(deps.dependencies.map(d => [d.products, d.productsSameVersion]), [[2, 2], [1, 1]]);
  const packages = JSON.parse(fs.readFileSync(path.join(dir, 'packages', 'index.json'), 'utf8'));
  assert.deepEqual(packages.packages, [{ ecosystem: 'npm', name: 'a', products: 2, versions: { '1.0.0': 1, '1.0.1': 2 } }]);
  assert.equal(index.sharedPackages, 1);
});

test('sharedPackages lists packages used by two or more products, most shared first', () => {
  const list = sharedPackages(seeded());
  assert.deepEqual(list.map(p => `${p.name}:${p.products}`), ['a:2']);
  assert.deepEqual(sharedPackages(seeded(), { minProducts: 1 }).map(p => p.name), ['a', 'b', 'c', 'z']);
});

test('safeName keeps ids and tags readable but path-safe', () => {
  assert.equal(safeName('io.metamask'), 'io.metamask');
  assert.equal(safeName('android-v2.8.4'), 'android-v2.8.4');
  assert.equal(safeName('release/2.0 beta'), 'release_2.0_beta');
  assert.equal(safeName('../x'), '__x');
});
