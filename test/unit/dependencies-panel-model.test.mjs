import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  upstreamFor,
  panelModel, tagMatchesVersion, versionCore, whereLabel, whereOf, sortAdvisories, uncheckedCount, csvOf, WORST_ROWS,
} from '../../src/dependencies-panel-model.mjs';

const advisory = (id, severity, extra = {}) => ({ id, severity, aliases: [], fixed: [], summary: '', ecosystem: 'npm', package: 'pkg', version: '1.0.0', direct: true, dev: false, ...extra });

const app = {
  schema: 1,
  appId: 'app.android',
  aliases: [{ appId: 'app.android', platform: 'android' }, { appId: 'app.ios', platform: 'iphone' }],
  releases: [
    {
      kind: 'release', ref: 'v1.4.0', commit: 'a1b2c3d4e5f6', analysedAt: '2026-10-01 00:00:00', status: 'ok',
      lockfiles: ['package-lock.json', 'android/gradle.lockfile'],
      osv: { checked: 398, skipped: { floating: 12, 'git-or-path': 2 } },
      dependencies: { total: 412, direct: 40, dev: 100, devUnknown: 0, byScope: { app: 300, build: 90, tests: 10, unknown: 12 }, byEcosystem: { npm: 400, Maven: 12 }, tiers: { 'hash-pinned': 400, floating: 12 }, lockfiles: ['package-lock.json'] },
      vulnerabilities: { total: 3, bySeverity: { malicious: 1, critical: 0, high: 1, moderate: 1, low: 0, unknown: 0 }, packages: 3 },
      advisories: [
        advisory('GHSA-mod', 'moderate', { package: 'glob-matcher', dev: true }),
        advisory('MAL-2026-1', 'malicious', { package: 'evil' }),
        advisory('GHSA-high', 'high', { package: 'http-client', ecosystem: 'Maven', dev: null }),
      ],
      diffFrom: { ref: 'v1.3.0', added: 12, removed: 3, changed: 40, integrityChangedAtSameVersion: [] },
    },
    { kind: 'release', ref: 'v1.3.0', commit: 'ffff', analysedAt: '2026-09-01 00:00:00', status: 'ok', dependencies: { total: 400 }, vulnerabilities: { bySeverity: {} }, advisories: [] },
  ],
  defaultBranch: null,
};

describe('dependencies panel model', () => {
  test('tagMatchesVersion compares the digits of the tag with the store version', () => {
    assert.equal(versionCore('android-v2.8.4'), '2.8.4');
    assert.equal(tagMatchesVersion('v1.4.0', '1.4.0'), true);
    assert.equal(tagMatchesVersion('android-v2.8.4', '2.8.4'), true);
    assert.equal(tagMatchesVersion('v1.4.0-beta1', '1.4.0'), true);
    assert.equal(tagMatchesVersion('v1.4.0', '1.4.2'), false);
    assert.equal(tagMatchesVersion('release', '1.4.0'), false);
    assert.equal(tagMatchesVersion('v1.4.0', ''), false);
  });

  test('whereLabel: scope first, then the dev flag of older exports, then "?"', () => {
    assert.equal(whereLabel({ scope: 'tests', dev: true }), 'tests');
    assert.equal(whereLabel({ scope: 'app' }), 'app');
    assert.equal(whereLabel({ dev: false }), 'app');
    assert.equal(whereLabel({ dev: true }), 'build');
    assert.equal(whereLabel({ dev: null }), '?');
    assert.equal(whereOf({ scope: 'bogus', dev: null }), 'unknown');
  });

  test('panelModel: tiles, worst-first rows, unchecked total, version note, diff, aliases', () => {
    const m = panelModel(app, { storeVersion: '1.4.2' });
    assert.equal(m.ref, 'v1.4.0');
    assert.equal(m.commit, 'a1b2c3d');
    assert.equal(m.versionMatches, false);
    assert.equal(m.packages, 412);
    assert.equal(m.direct, 40);
    assert.equal(m.transitive, 372);
    assert.equal(m.unchecked, 14);
    assert.deepEqual(m.uncheckedBreakdown.map(u => [u.reason, u.count]), [['floating', 12], ['git-or-path', 2]]);
    assert.equal(m.vulnerabilities, 2);
    assert.equal(m.malware, 1);
    assert.deepEqual(m.worst.map(a => a.id), ['MAL-2026-1', 'GHSA-high', 'GHSA-mod']);
    assert.deepEqual(m.ecosystems, ['npm', 'Maven']);
    assert.equal(m.whereUnknown, 12);
    assert.equal(m.byScope.tests, 10);
    assert.deepEqual(m.lockfiles, ['package-lock.json', 'android/gradle.lockfile']);
    assert.equal(m.diff.ref, 'v1.3.0');
    assert.deepEqual(m.sameRepositoryAs, ['app.ios']);
    assert.deepEqual(m.releases.map(r => r.ref), ['v1.4.0', 'v1.3.0']);
  });

  test('panelModel: a specific release, a matching store version, no osv data', () => {
    const m = panelModel(app, { storeVersion: '1.3.0', release: 'v1.3.0' });
    assert.equal(m.ref, 'v1.3.0');
    assert.equal(m.versionMatches, true);
    assert.equal(m.unchecked, null);
    assert.equal(m.vulnerabilities, 0);
    assert.equal(m.diff, null);
    assert.equal(panelModel({ releases: [] }), null);
    assert.equal(panelModel(null), null);
  });

  test('a newer release whose analysis failed is reported, the last good one shown', () => {
    const withFailed = { releases: [{ ref: 'v2.0.0', status: 'failed', error: 'clone failed', advisories: [] }, ...app.releases] };
    const m = panelModel(withFailed);
    assert.equal(m.ref, 'v1.4.0');
    assert.deepEqual(m.newerFailed, [{ ref: 'v2.0.0', status: 'failed', error: 'clone failed' }]);
  });

  test('worst rows are capped', () => {
    const many = { releases: [{ ref: 'v1', advisories: Array.from({ length: 30 }, (_, i) => advisory(`GHSA-${i}`, 'low')) }] };
    assert.equal(panelModel(many).worst.length, WORST_ROWS);
    assert.equal(panelModel(many).advisories.length, 30);
  });

  test('sortAdvisories and uncheckedCount', () => {
    assert.deepEqual(sortAdvisories([advisory('b', 'low'), advisory('a', 'critical'), advisory('c', 'unknown')]).map(a => a.id), ['a', 'b', 'c']);
    assert.equal(uncheckedCount({ skipped: {} }), 0);
    assert.equal(uncheckedCount(null), null);
  });

  test('csvOf joins the dependency list with the advisories per package', () => {
    const deps = [
      { ecosystem: 'npm', name: 'pkg', version: '1.0.0', lockfile: 'package-lock.json', tier: 'hash-pinned', direct: true, dev: false, products: 25, productsSameVersion: 3 },
      { ecosystem: 'npm', name: 'quiet, inc', version: '2.0.0', lockfile: 'package-lock.json', tier: 'floating', direct: null, dev: null },
      { ecosystem: 'npm', name: 'jest', version: '29.0.0', lockfile: 'yarn.lock', tier: 'hash-pinned', direct: true, dev: true, scope: 'tests' },
    ];
    const decision = { status: 'not_affected', basis: [{ need: 'via:npm:alib', statement: { status: 'not_affected', justification: null, content: 'never reached, "really"' } }] };
    const csv = csvOf(deps, [advisory('GHSA-1', 'high', { decision, epss: 0.0052, exploited: { added: '2024-01-01' } }), advisory('GHSA-2', 'low')]);
    const lines = csv.trim().split('\n');
    assert.equal(lines[0], 'ecosystem,package,version,lockfile,direct,where,pinning,advisories,worst_severity,products,products_same_version,decision,justification,epss,exploited');
    assert.equal(lines[1], 'npm,pkg,1.0.0,package-lock.json,yes,app,hash-pinned,GHSA-1 GHSA-2,high,25,3,not affected undecided,"via:npm:alib: never reached, ""really""",0.0052,yes');
    assert.equal(lines[2], 'npm,"quiet, inc",2.0.0,package-lock.json,,unknown,floating,,,,,,,,', 'rows from an older export: empty product counts');
    assert.equal(lines[3], 'npm,jest,29.0.0,yarn.lock,yes,tests,hash-pinned,,,,,,,,');
  });

  test('upstreamFor: ignore-file entries by id or alias, without the ones a statement already cites', () => {
    const url = (n) => `https://github.com/a/b/blob/v1/.trivyignore#L${n}`;
    const upstream = { advisories: { 'CVE-1': [{ url: url(1) }, { url: url(2) }], 'GHSA-x': [{ url: url(1) }] } };
    const row = { id: 'GHSA-x', aliases: ['CVE-1'], decision: { basis: [{ statement: { evidence: url(2) } }] } };
    assert.deepEqual(upstreamFor(row, upstream).map(h => h.url), [url(1)]);
    assert.deepEqual(upstreamFor(row, null), []);
  });
});
