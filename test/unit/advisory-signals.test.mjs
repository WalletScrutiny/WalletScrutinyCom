import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { signalsFor, applySignals, sortAdvisories, epssLabel, csvOf } from '../../src/dependencies-panel-model.mjs';

// signals.json is written by the analyser (external/source_analysis/signals.mjs, its own tests there).
describe('advisory signals', () => {
  test('the model attaches signals by id or alias, sorts exploited and likelier first, and prints EPSS', () => {
    const signals = { epss: { 'CVE-2023-45133': [0.00525, 0.43], 'CVE-2': [0.2, 0.99] }, kev: { 'CVE-2': { added: '2024-01-01' } } };
    const a = { id: 'GHSA-1', aliases: ['CVE-2023-45133'], severity: 'high', package: 'a' };
    const b = { id: 'GHSA-2', aliases: ['CVE-2'], severity: 'high', package: 'b' };
    const c = { id: 'GHSA-3', aliases: [], severity: 'high', package: 'c' };
    assert.deepEqual(signalsFor(a, { ...signals, published: { 'GHSA-1': '2022-04-25' } }), { epss: 0.00525, epssPercentile: 0.43, exploited: null, published: '2022-04-25' });
    assert.deepEqual(signalsFor(c, null), { epss: null, epssPercentile: null, exploited: null, published: null });
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
