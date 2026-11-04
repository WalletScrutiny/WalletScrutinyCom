import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  upstreamFor,
  panelModel, versionCore, whereLabel, whereOf, sortAdvisories, uncheckedCount, csvOf, csvCell, notInAppText, WORST_ROWS,
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
  test('versionCore keeps the digits of a tag', () => {
    assert.equal(versionCore('android-v2.8.4'), '2.8.4');
    assert.equal(versionCore('v1.4.0-beta1'), '1.4.0-beta1');
    assert.equal(versionCore('release'), '');
  });

  test('whereLabel: scope first, then the dev flag of older exports, then "?"', () => {
    assert.equal(whereLabel({ scope: 'tests', dev: true }), 'tests');
    assert.equal(whereLabel({ scope: 'app' }), 'app');
    assert.equal(whereLabel({ dev: false }), 'app');
    assert.equal(whereLabel({ dev: true }), 'build');
    assert.equal(whereLabel({ dev: null }), '?');
    assert.equal(whereOf({ scope: 'bogus', dev: null }), 'unknown');
  });

  test('panelModel: tiles, worst-first rows, unchecked total, diff, aliases', () => {
    const m = panelModel(app);
    assert.equal(m.ref, 'v1.4.0');
    assert.equal(m.commit, 'a1b2c3d');
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
    // the alias's page names the analysed app, not itself
    assert.deepEqual(panelModel(app, { appId: 'app.ios' }).sameRepositoryAs, [app.appId]);
  });

  test('panelModel: a specific release, no osv data', () => {
    const m = panelModel(app, { release: 'v1.3.0' });
    assert.equal(m.ref, 'v1.3.0');
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

  test('csvCell defuses spreadsheet formulas but leaves numbers alone', () => {
    assert.equal(csvCell('=HYPERLINK("https://evil.example","x")'), '"\'=HYPERLINK(""https://evil.example"",""x"")"');
    for (const s of ['+1+1', '-2+3', '@SUM(A1)', '\tcmd']) assert.equal(csvCell(s), `'${s}`);
    assert.equal(csvCell('\r=1'), `"'\r=1"`);
    assert.equal(csvCell(-0.5), '-0.5');
    assert.equal(csvCell('a=b'), 'a=b');
    const decision = { status: 'not_affected', basis: [{ need: '=cmd|x', statement: { status: 'not_affected', content: 'y' } }] };
    const row = csvOf([{ ecosystem: 'npm', name: 'pkg', version: '1.0.0', lockfile: 'l' }], [advisory('GHSA-1', 'high', { decision })]).trim().split('\n')[1];
    assert.ok(row.includes(",'=cmd|x: y,"), row);
  });

  test('upstreamFor: ignore-file entries by id or alias, without the ones a statement already cites', () => {
    const url = (n) => `https://github.com/a/b/blob/v1/.trivyignore#L${n}`;
    const upstream = { advisories: { 'CVE-1': [{ url: url(1) }, { url: url(2) }], 'GHSA-x': [{ url: url(1) }] } };
    const row = { id: 'GHSA-x', aliases: ['CVE-1'], decision: { basis: [{ statement: { evidence: url(2) } }] } };
    assert.deepEqual(upstreamFor(row, upstream).map(h => h.url), [url(1)]);
    assert.deepEqual(upstreamFor(row, null), []);
  });

  test('a row from another product\'s lockfile reads as that product under "Where?"', () => {
    assert.equal(whereLabel({ part: 'desktop', scope: 'build', dev: true }), 'desktop app');
    assert.equal(whereLabel({ scope: 'build' }), 'build');
  });

  describe('counting only this page\'s app (issue 994)', () => {
    const counts = (total, direct, scope, ecosystem = 'npm') => ({ total, direct, byScope: { app: total, build: 0, tests: 0, unknown: 0, ...scope }, byEcosystem: { [ecosystem]: total } });
    const app = {
      appId: 'w',
      aliases: [{ appId: 'w', platform: 'android' }, { appId: 'w', platform: 'desktop' }],
      releases: [{
        ref: 'v2', status: 'ok',
        dependencies: {
          total: 110, direct: 12, byScope: { app: 110, build: 0, tests: 0, unknown: 0 }, byEcosystem: { npm: 90, pypi: 20 }, lockfiles: ['package-lock.json'],
          byTarget: { android: counts(20, 2, {}, 'pypi'), desktop: counts(30, 4, {}), server: counts(10, 1, {}), shared: counts(50, 5, {}) },
        },
        vulnerabilities: { bySeverity: { high: 3, malicious: 1, critical: 1 }, byScope: { app: 5, build: 0, tests: 0, unknown: 0 } },
        advisories: [
          { id: 'SHARED', severity: 'high', ecosystem: 'npm', package: 'a', version: '1', scope: 'app' },
          { id: 'ANDROID', severity: 'high', ecosystem: 'pypi', package: 'b', version: '1', scope: 'build', targets: ['android'] },
          { id: 'DESKTOP', severity: 'critical', ecosystem: 'npm', package: 'c', version: '1', scope: 'app', part: 'desktop', targets: ['desktop'] },
          { id: 'BOTH', severity: 'high', ecosystem: 'npm', package: 'd', version: '1', scope: null, targets: ['desktop', 'shared'] },
          { id: 'BAD', severity: 'malicious', ecosystem: 'npm', package: 'e', version: '1', scope: 'app', part: 'server', targets: ['server'] },
        ],
      }, {
        ref: 'v1', status: 'ok',
        dependencies: { total: 60, direct: 6, byTarget: { desktop: counts(10, 1, {}), shared: counts(50, 5, {}) } },
      }],
    };

    test('the Android page counts Android and shared files only', () => {
      const m = panelModel(app, { platform: 'android' });
      assert.equal(m.packages, 70);
      assert.equal(m.direct, 7);
      assert.equal(m.transitive, 63);
      assert.equal(m.repoPackages, 110);
      assert.deepEqual(m.ecosystems.sort(), ['npm', 'pypi']);
      assert.deepEqual(m.advisories.map(a => a.id).sort(), ['ANDROID', 'BOTH', 'SHARED']);
      assert.equal(m.vulnerabilities, 3);
      assert.equal(m.malware, 0, 'malware in the server is not on this page\'s tile');
      assert.equal(m.bySeverity.critical, 0);
      assert.deepEqual(m.vulnerabilitiesByScope, { app: 1, build: 1, tests: 0, unknown: 1 });
      assert.equal(m.triage.total, 3);
    });

    test('the desktop page counts desktop and shared, and drops its own product\'s mark', () => {
      const m = panelModel(app, { platform: 'desktop' });
      assert.equal(m.packages, 80);
      assert.deepEqual(m.advisories.map(a => a.id).sort(), ['BOTH', 'DESKTOP', 'SHARED']);
      assert.equal(m.advisories.find(a => a.id === 'DESKTOP').part, undefined);
    });

    test('the tree and CSV keep every row, as they were', () => {
      const m = panelModel(app, { platform: 'android' });
      assert.equal(m.allAdvisories.length, 5);
      assert.equal(m.allAdvisories.find(a => a.id === 'DESKTOP').part, 'desktop');
    });

    test('says what was left out, biggest first', () => {
      const m = panelModel(app, { platform: 'android' });
      assert.deepEqual(m.notInApp.map(p => [p.target, p.libraries, p.advisories, p.malware]), [['desktop', 30, 1, 0], ['server', 10, 0, 1]]);
      assert.equal(notInAppText(m.notInApp), 'Not in this app: desktop app, 30 libraries, 1 advisory; server, 10 libraries, 1 possible malware.');
      assert.equal(notInAppText(null), null);
    });

    test('the history chart counts the same files in every release', () => {
      assert.deepEqual(panelModel(app, { platform: 'android' }).history.map(h => [h.ref, h.total]), [['v1', 50], ['v2', 70]]);
      assert.deepEqual(panelModel(app, { platform: 'desktop' }).history.map(h => [h.ref, h.total]), [['v1', 60], ['v2', 80]]);
    });

    test('a page with no list, and an export without the counts, stay as they were', () => {
      for (const platform of ['app', 'bearer', null]) {
        const m = panelModel(app, { platform });
        assert.equal(m.packages, 110, platform);
        assert.equal(m.advisories.length, 5);
        assert.equal(m.notInApp, null);
        assert.equal(m.advisories.find(a => a.id === 'DESKTOP').part, 'desktop');
      }
      const old = { appId: 'o', releases: [{ ref: 'v1', status: 'ok', dependencies: { total: 9, direct: 1 }, vulnerabilities: { bySeverity: { high: 2 } }, advisories: [] }] };
      const m = panelModel(old, { platform: 'android' });
      assert.deepEqual([m.packages, m.vulnerabilities, m.notInApp], [9, 2, null]);
    });
  });
});
