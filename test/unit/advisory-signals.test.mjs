import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { collectCves, fetchEpss, buildSignals, EPSS_URL, KEV_URL } from '../../scripts/build-advisory-signals.mjs';
import { signalsFor, applySignals, sortAdvisories, epssLabel, csvOf } from '../../src/dependencies-panel-model.mjs';

function exportWith(tmp) {
  const exportDir = join(tmp, 'export');
  mkdirSync(join(exportDir, 'apps'), { recursive: true });
  writeFileSync(join(exportDir, 'apps', 'a.json'), JSON.stringify({ appId: 'a', releases: [{ advisories: [
    { id: 'GHSA-1', aliases: ['CVE-2023-45133'] }, { id: 'CVE-2023-4863', aliases: [] }, { id: 'GHSA-2', aliases: [] },
  ] }] }));
  writeFileSync(join(exportDir, 'apps', 'stub.json'), JSON.stringify({ appId: 'a', alias: true }));
  return exportDir;
}

const fakeFetch = (handlers) => async (url) => {
  for (const [prefix, body] of Object.entries(handlers)) {
    if (url.startsWith(prefix)) {
      if (body instanceof Error) throw body;
      return { ok: true, status: 200, json: async () => (typeof body === 'function' ? body(url) : body) };
    }
  }
  return { ok: false, status: 404, json: async () => null };
};

describe('advisory signals', () => {
  test('collectCves takes ids and aliases from every analysed app, skipping stubs', () => {
    const tmp = mkdtempSync(join(tmpdir(), 'signals-'));
    try {
      assert.deepEqual([...collectCves(join(exportWith(tmp), 'apps'))].sort(), ['CVE-2023-45133', 'CVE-2023-4863']);
      assert.equal(collectCves(join(tmp, 'missing')).size, 0);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  test('fetchEpss asks in batches of 100 and keeps probability and percentile', async () => {
    const calls = [];
    const fetchImpl = fakeFetch({ [EPSS_URL]: (url) => {
      calls.push(url);
      const ids = new URL(url).searchParams.get('cve').split(',');
      return { data: ids.map((cve, i) => ({ cve, epss: String(0.001 * (i + 1)), percentile: '0.5' })) };
    } });
    const cves = new Set(Array.from({ length: 150 }, (_, i) => `CVE-2024-${String(i).padStart(4, '0')}`));
    const { epss } = await fetchEpss(cves, { fetchImpl });
    assert.equal(calls.length, 2);
    assert.equal(new URL(calls[0]).searchParams.get('cve').split(',').length, 100);
    assert.equal(new URL(calls[1]).searchParams.get('cve').split(',').length, 50);
    assert.deepEqual(epss['CVE-2024-0000'], [0.001, 0.5]);
    assert.equal(Object.keys(epss).length, 150);
  });

  test('buildSignals writes signals.json and survives one failing feed', async () => {
    const tmp = mkdtempSync(join(tmpdir(), 'signals-'));
    try {
      const exportDir = exportWith(tmp);
      const quiet = { warn: () => {}, log: () => {} };
      let r = await buildSignals({ exportDir, now: new Date('2026-10-16T12:00:00Z'), log: quiet, fetchImpl: fakeFetch({
        [EPSS_URL]: { data: [{ cve: 'CVE-2023-45133', epss: '0.00525', percentile: '0.4322' }] },
        [KEV_URL]: { catalogVersion: '2026.10.16', count: 2, vulnerabilities: [{ cveID: 'CVE-2023-4863', dateAdded: '2023-09-13' }, { cveID: 'CVE-1999-1', dateAdded: '2021-11-03' }] },
      }) });
      assert.deepEqual(r, { cves: 2, epss: 1, kev: 1, written: true, failed: [] });
      const out = JSON.parse(readFileSync(join(exportDir, 'signals.json'), 'utf8'));
      assert.deepEqual(out, { schema: 1, date: '2026-10-16', cves: 2, epss: { 'CVE-2023-45133': [0.00525, 0.432] }, kev: { 'CVE-2023-4863': { added: '2023-09-13' } }, kevCatalog: { version: '2026.10.16', size: 2 } });

      rmSync(join(exportDir, 'signals.json'));
      r = await buildSignals({ exportDir, log: quiet, fetchImpl: fakeFetch({ [EPSS_URL]: new Error('down'), [KEV_URL]: { vulnerabilities: [] } }) });
      assert.deepEqual(r.failed, ['EPSS: down']);
      assert.equal(r.written, true, 'the KEV part is still written');
      assert.equal(JSON.parse(readFileSync(join(exportDir, 'signals.json'), 'utf8')).epss, undefined);

      rmSync(join(exportDir, 'signals.json'));
      r = await buildSignals({ exportDir, log: quiet, fetchImpl: fakeFetch({ [EPSS_URL]: new Error('down'), [KEV_URL]: new Error('down') }) });
      assert.equal(r.written, false);
      assert.equal(existsSync(join(exportDir, 'signals.json')), false, 'both feeds down: nothing written, the build goes on');
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  test('the model attaches signals by id or alias, sorts exploited and likelier first, and prints EPSS', () => {
    const signals = { epss: { 'CVE-2023-45133': [0.00525, 0.43], 'CVE-2': [0.2, 0.99] }, kev: { 'CVE-2': { added: '2024-01-01' } } };
    const a = { id: 'GHSA-1', aliases: ['CVE-2023-45133'], severity: 'high', package: 'a' };
    const b = { id: 'GHSA-2', aliases: ['CVE-2'], severity: 'high', package: 'b' };
    const c = { id: 'GHSA-3', aliases: [], severity: 'high', package: 'c' };
    assert.deepEqual(signalsFor(a, signals), { epss: 0.00525, epssPercentile: 0.43, exploited: null });
    assert.deepEqual(signalsFor(c, null), { epss: null, epssPercentile: null, exploited: null });
    const sorted = sortAdvisories(applySignals([c, a, b], signals));
    assert.deepEqual(sorted.map(x => x.id), ['GHSA-2', 'GHSA-1', 'GHSA-3']);
    assert.deepEqual(sortAdvisories([c, a, b]).map(x => x.id), ['GHSA-1', 'GHSA-2', 'GHSA-3'], 'without signals: by package name');
    assert.equal(epssLabel(0.00525), '0.5 %');
    assert.equal(epssLabel(0.0004), '<0.1 %');
    assert.equal(epssLabel(0.236), '24 %');
    assert.equal(epssLabel(null), null);
    const csv = csvOf([{ ecosystem: 'npm', name: 'b', version: '1', lockfile: 'l', direct: true, tier: 't' }], applySignals([{ ...b, ecosystem: 'npm', version: '1' }], signals));
    assert.match(csv.split('\n')[0], /,epss,exploited$/);
    assert.match(csv.split('\n')[1], /,0\.2,yes$/);
  });
});
