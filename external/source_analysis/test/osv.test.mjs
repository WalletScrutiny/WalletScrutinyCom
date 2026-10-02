// Test 4: OSV.dev lookup of the resolved dependencies, against a stubbed
// fetch. Nothing here talks to the network.
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  buildQueries, checkVulnerabilities, clearAdvisoryCache, cvss3BaseScore, severityOf, uncheckableReason,
} from '../osvCheck.mjs';
import { initDatabase, saveVulnerabilities, getVulnerabilities } from '../ddbbUtils.mjs';

const quiet = async (fn) => {
  const log = console.log;
  console.log = () => {};
  try { return await fn(); } finally { console.log = log; }
};

const entry = (ecosystem, name, version, extra = {}) => ({
  ecosystem, lockfile: 'lock', name, version, resolved: '', integrity: '', direct: true, dev: false, tier: 'version-pinned', ...extra,
});

/**
 * fetch stub: `vulnsByQuery` maps "<OSV ecosystem>/<name>@<version>" to advisory
 * ids, `advisories` maps an id to its record. Records every request.
 */
function stubFetch({ vulnsByQuery = {}, advisories = {}, pageSize = Infinity, failBatch = false } = {}) {
  const calls = [];
  const json = (body, status = 200) => ({ ok: status < 400, status, json: async () => body });
  const fetchImpl = async (url, options) => {
    calls.push({ url, body: options.body ? JSON.parse(options.body) : null });
    if (url.endsWith('/querybatch')) {
      if (failBatch) return json({}, 503);
      const { queries } = JSON.parse(options.body);
      return json({
        results: queries.map(q => {
          const ids = vulnsByQuery[`${q.package.ecosystem}/${q.package.name}@${q.version}`] || [];
          const start = q.page_token ? Number(q.page_token) : 0;
          const page = ids.slice(start, start + pageSize);
          return {
            ...(page.length ? { vulns: page.map(id => ({ id, modified: '2026-01-01T00:00:00Z' })) } : {}),
            ...(start + pageSize < ids.length ? { next_page_token: String(start + pageSize) } : {}),
          };
        }),
      });
    }
    const id = decodeURIComponent(url.split('/vulns/')[1]);
    return advisories[id] ? json(advisories[id]) : json({}, 404);
  };
  return { fetchImpl, calls };
}

beforeEach(() => clearAdvisoryCache());

test('only exact registry versions are looked up', () => {
  assert.equal(uncheckableReason(entry('npm', 'a', '1.2.3', { resolved: 'https://registry.npmjs.org/a/-/a-1.2.3.tgz' })), null);
  assert.equal(uncheckableReason(entry('npm', 'a', '^1.2.0', { tier: 'floating' })), 'floating');
  assert.equal(uncheckableReason(entry('npm', 'a', '1.0.0', { resolved: 'git+https://github.com/x/a.git#abc' })), 'git-or-path');
  assert.equal(uncheckableReason(entry('npm', 'a', '1.0.0', { resolved: 'https://example.com/a.tgz' })), 'git-or-path');
  assert.equal(uncheckableReason(entry('gradle', 'g:a', '', { tier: 'unversioned' })), 'unversioned');
  assert.equal(uncheckableReason(entry('cargo', 'c', '0.1.0', { tier: 'source-ref-pinned', resolved: 'git+https://x' })), 'source-ref-pinned');
  assert.equal(uncheckableReason(entry('cargo', 'c', '0.1.0', { resolved: 'registry+https://github.com/rust-lang/crates.io-index' })), null);
  assert.equal(uncheckableReason(entry('pip', 'requests', '>=2.0')), 'no-exact-version');
});

test('queries are deduplicated across lockfiles and ecosystems map to OSV names', () => {
  const { queries, skipped } = buildQueries([
    { entries: [entry('npm', 'a', '1.0.0'), entry('npm', 'a', '1.0.0', { lockfile: 'sub/package-lock.json', direct: false })] },
    { entries: [entry('gradle', 'g:a', '2.0'), entry('pip', 'x', '~=1.0', { tier: 'floating' })] },
  ]);
  assert.equal(queries.length, 2);
  assert.equal(queries[0].rows.length, 2);
  assert.deepEqual(skipped, { floating: 1 });
});

test('findings across ecosystems, aliases folded, severity from GHSA, CVSS and MAL', async () => {
  const { fetchImpl, calls } = stubFetch({
    vulnsByQuery: {
      'npm/lodash@4.17.15': ['GHSA-p6mc-m468-83gw'],
      'Maven/com.squareup.okhttp3:okhttp@3.12.0': ['GHSA-okhttp'],
      'crates.io/smallvec@1.6.0': ['RUSTSEC-2021-0003', 'GHSA-43w2-9j62-hq99'],
      'PyPI/evil@1.0.0': ['MAL-2024-1'],
    },
    advisories: {
      'GHSA-p6mc-m468-83gw': {
        id: 'GHSA-p6mc-m468-83gw', aliases: ['CVE-2020-8203'], summary: 'Prototype Pollution in lodash',
        database_specific: { severity: 'HIGH' },
        affected: [
          { package: { ecosystem: 'npm', name: 'lodash' }, ranges: [{ events: [{ introduced: '3.7.0' }, { fixed: '4.17.19' }] }] },
          { package: { ecosystem: 'npm', name: 'lodash-es' }, ranges: [{ events: [{ introduced: '0' }, { fixed: '4.17.20' }] }] },
        ],
      },
      'GHSA-okhttp': { id: 'GHSA-okhttp', database_specific: { severity: 'MODERATE' }, affected: [] },
      // the RUSTSEC record has only a vector, its GHSA alias has the label: one finding
      'RUSTSEC-2021-0003': {
        id: 'RUSTSEC-2021-0003', aliases: ['CVE-2021-25900', 'GHSA-43w2-9j62-hq99'],
        severity: [{ type: 'CVSS_V3', score: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H' }],
      },
      'GHSA-43w2-9j62-hq99': { id: 'GHSA-43w2-9j62-hq99', aliases: ['CVE-2021-25900', 'RUSTSEC-2021-0003'], database_specific: { severity: 'CRITICAL' } },
      'MAL-2024-1': { id: 'MAL-2024-1', summary: 'Malicious code in evil (PyPI)' },
    },
  });
  const result = await quiet(() => checkVulnerabilities([
    { entries: [entry('npm', 'lodash', '4.17.15', { direct: false, dev: true }), entry('npm', 'left-pad', '1.3.0')] },
    { entries: [entry('gradle', 'com.squareup.okhttp3:okhttp', '3.12.0')] },
    { entries: [entry('cargo', 'smallvec', '1.6.0')] },
    { entries: [entry('pip', 'evil', '1.0.0')] },
  ], { fetchImpl }));

  assert.equal(result.checked, 5);
  assert.deepEqual(result.findings.map(f => [f.severity, f.name, f.id]), [
    ['malicious', 'evil', 'MAL-2024-1'],
    ['critical', 'smallvec', 'GHSA-43w2-9j62-hq99'],
    ['high', 'lodash', 'GHSA-p6mc-m468-83gw'],
    ['moderate', 'com.squareup.okhttp3:okhttp', 'GHSA-okhttp'],
  ]);
  const lodash = result.findings.find(f => f.name === 'lodash');
  assert.deepEqual(lodash.fixed, ['4.17.19']); // lodash-es' fix is not lodash's
  assert.equal(lodash.direct, false);
  assert.equal(lodash.dev, true);
  assert.equal(calls.filter(c => c.url.endsWith('/querybatch')).length, 1);
});

test('large inputs are split into 1000-query batches and paged results are followed', async () => {
  const entries = Array.from({ length: 2500 }, (_, i) => entry('npm', `p${i}`, '1.0.0'));
  const { fetchImpl, calls } = stubFetch({
    vulnsByQuery: { 'npm/p2499@1.0.0': ['A-1', 'A-2', 'A-3'] },
    advisories: Object.fromEntries(['A-1', 'A-2', 'A-3'].map(id => [id, { id, database_specific: { severity: 'LOW' } }])),
    pageSize: 2,
  });
  const result = await quiet(() => checkVulnerabilities([{ entries }], { fetchImpl }));
  const batches = calls.filter(c => c.url.endsWith('/querybatch'));
  assert.deepEqual(batches.map(b => b.body.queries.length), [1000, 1000, 500, 1]);
  assert.equal(batches[3].body.queries[0].page_token, '2');
  assert.deepEqual(result.findings.map(f => f.id).sort(), ['A-1', 'A-2', 'A-3']);
});

test('advisory details are fetched once per process', async () => {
  const stub = stubFetch({ vulnsByQuery: { 'npm/a@1.0.0': ['X-1'] }, advisories: { 'X-1': { id: 'X-1' } } });
  await quiet(() => checkVulnerabilities([{ entries: [entry('npm', 'a', '1.0.0')] }], { fetchImpl: stub.fetchImpl }));
  await quiet(() => checkVulnerabilities([{ entries: [entry('npm', 'a', '1.0.0')] }], { fetchImpl: stub.fetchImpl }));
  assert.equal(stub.calls.filter(c => c.url.includes('/vulns/')).length, 1);
});

test('an unreachable OSV is no result, not a clean one', async () => {
  const { fetchImpl } = stubFetch({ failBatch: true });
  const result = await quiet(() => checkVulnerabilities([{ entries: [entry('npm', 'a', '1.0.0')] }], { fetchImpl }));
  assert.equal(result, null);
});

test('nothing checkable needs no request', async () => {
  const { fetchImpl, calls } = stubFetch();
  const result = await quiet(() => checkVulnerabilities([{ entries: [entry('npm', 'a', '^1', { tier: 'floating' })] }], { fetchImpl }));
  assert.deepEqual(result, { checked: 0, skipped: { floating: 1 }, findings: [] });
  assert.equal(calls.length, 0);
});

test('CVSS 3 base scores and ratings', () => {
  assert.equal(cvss3BaseScore('CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H'), 9.8);
  assert.equal(cvss3BaseScore('CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:N/I:H/A:H'), 7.4);
  assert.equal(cvss3BaseScore('CVSS:3.0/AV:N/AC:L/PR:L/UI:N/S:C/C:L/I:L/A:N'), 6.4);
  assert.equal(cvss3BaseScore('CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N'), null);
  assert.equal(severityOf({ id: 'X', severity: [{ type: 'CVSS_V3', score: 'CVSS:3.1/AV:L/AC:H/PR:H/UI:R/S:U/C:L/I:N/A:N' }] }), 'low');
  assert.equal(severityOf({ id: 'X', database_specific: { severity: 'MEDIUM' } }), 'moderate');
  assert.equal(severityOf({ id: 'X' }), 'unknown');
});

test('findings are stored per release and replaced on re-analysis', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'osv-db-'));
  const db = initDatabase(path.join(dir, 'test.db'));
  const finding = {
    ecosystem: 'npm', name: 'lodash', version: '4.17.15', id: 'GHSA-p6mc-m468-83gw', aliases: ['CVE-2020-8203'],
    severity: 'high', summary: 'Prototype Pollution', fixed: ['4.17.19'], direct: true, dev: false,
  };
  assert.equal(saveVulnerabilities(db, 'app', '1.0', { findings: [finding, { ...finding, id: 'MAL-1', severity: 'malicious', aliases: [] }] }), 2);
  assert.deepEqual(getVulnerabilities(db, 'app', '1.0').map(r => [r.vuln_id, r.severity, r.fixed, r.aliases]), [
    ['MAL-1', 'malicious', '4.17.19', ''],
    ['GHSA-p6mc-m468-83gw', 'high', '4.17.19', 'CVE-2020-8203'],
  ]);
  saveVulnerabilities(db, 'app', '1.0', { findings: [] });
  assert.equal(getVulnerabilities(db, 'app', '1.0').length, 0);
  db.close();
  fs.rmSync(dir, { recursive: true, force: true });
});
