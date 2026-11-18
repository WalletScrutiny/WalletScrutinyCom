import { test } from 'node:test';
import assert from 'node:assert/strict';

import { affectsVersion, ownVulnerabilitiesModel, fixedText, cveOf } from '../../src/own-vulnerabilities-model.mjs';

const adv = (id, severity, versions, extra = {}) => ({ id, severity, aliases: [], summary: '', published: '2026-10-27', fixed: [], versions, ...extra });

// Electrum as the export had it on 2026-11-18 (external/source_analysis/ownAdvisories.mjs).
const app = {
  appId: 'electrum',
  ownAdvisories: {
    repository: 'https://github.com/spesmilo/electrum',
    checkedAt: '2026-11-18 12:00:00',
    advisories: [
      adv('CVE-2026-117602', 'high', ['4.7.1', '4.7.0', '4.6.2'], { fixed: ['4.7.2'] }),
      adv('CVE-2026-117601', 'critical', ['4.8.2', '4.8.1', '4.7.1'], { fixed: ['4.8.3'], aliases: ['GHSA-6jp4-8v48-cc5v'] }),
      adv('CVE-2018-6353', 'high', ['2.9.4', '2.9.3'], { lastAffected: ['2.9.4'] }),
    ],
  },
};

test('affectsVersion: same digits, with or without a v; a beta is not its release', () => {
  const a = adv('X', 'high', ['4.8.2', '4.6.0b1']);
  assert.ok(affectsVersion(a, '4.8.2'));
  assert.ok(affectsVersion(a, 'v4.8.2'));
  assert.ok(!affectsVersion(a, '4.8.3'));
  assert.ok(!affectsVersion(a, '4.6.0'));
  assert.ok(!affectsVersion(a, ''));
});

test('ownVulnerabilitiesModel: the reviewed version\'s hits, then the rest, most severe first', () => {
  const m = ownVulnerabilitiesModel(app, '4.8.2');
  assert.deepEqual(m.hits.map(a => a.id), ['CVE-2026-117601']);
  assert.deepEqual(m.others.map(a => a.id), ['CVE-2018-6353', 'CVE-2026-117602']);
  const fixed = ownVulnerabilitiesModel(app, '4.8.3');
  assert.deepEqual([fixed.hits.length, fixed.others.length], [0, 3]);
  assert.deepEqual(ownVulnerabilitiesModel(app, '4.7.1').hits.map(a => a.id), ['CVE-2026-117601', 'CVE-2026-117602']);
});

test('ownVulnerabilitiesModel: no lookup in the export is null, not "none known"', () => {
  assert.equal(ownVulnerabilitiesModel({ appId: 'x', releases: [] }, '1.0'), null);
  assert.equal(ownVulnerabilitiesModel(null, '1.0'), null);
  assert.deepEqual(ownVulnerabilitiesModel({ ownAdvisories: { advisories: [] } }, '1.0').hits, []);
});

test('fixedText and cveOf', () => {
  assert.equal(fixedText(adv('X', 'high', [], { fixed: ['4.10.0', '4.9.1'] })), '4.9.1 or 4.10.0');
  assert.equal(fixedText(adv('X', 'high', [], { lastAffected: ['2.9.4'] })), 'no fix listed; 2.9.4 and older affected');
  assert.equal(fixedText(adv('X', 'high', [])), 'no fix listed');
  assert.equal(cveOf({ id: 'GHSA-1', aliases: ['CVE-1-2'] }), 'CVE-1-2');
  assert.equal(cveOf({ id: 'GHSA-1', aliases: [] }), 'GHSA-1');
});
