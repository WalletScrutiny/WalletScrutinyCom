import { test } from 'node:test';
import assert from 'node:assert/strict';

import { affectsVersion, newestReproduced, reviewedVersion, ownVulnerabilitiesModel, fixedText, cveOf } from '../../src/own-vulnerabilities-model.mjs';

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

// Releases as the export lists them, newest first, each with the listings it was reproduced for.
const rel = (ref, ...listings) => ({ ref, reproducedFor: listings.map(([appId, platform, version]) => ({ appId, platform, version })) });
const electrum = { ...app, releases: [
  rel('4.8.4', ['org.electrum.electrum', 'android', '4.8.4']),
  rel('4.8.3', ['org.electrum.electrum', 'android', '4.8.3'], ['electrum', 'desktop', '4.8.3']),
  rel('4.8.2', ['org.electrum.electrum', 'android', '4.8.2'], ['electrum', 'desktop', '4.8.2']),
] };
const android = { appId: 'org.electrum.electrum', platform: 'android' };
const desktop = { appId: 'electrum', platform: 'desktop' };

test('newestReproduced: the listing\'s own newest, whatever the order', () => {
  assert.deepEqual(newestReproduced(electrum, 'org.electrum.electrum', 'android'), { version: '4.8.4', ref: '4.8.4' });
  assert.deepEqual(newestReproduced(electrum, 'electrum', 'desktop'), { version: '4.8.3', ref: '4.8.3' });
  assert.deepEqual(newestReproduced({ releases: [...electrum.releases].reverse() }, 'electrum'), { version: '4.8.3', ref: '4.8.3' });
  assert.equal(newestReproduced(electrum, 'org.electrum.electrum', 'iphone'), null);
  assert.equal(newestReproduced(electrum, 'other'), null);
  assert.equal(newestReproduced({ releases: [{ ref: '4.8.4' }] }, 'electrum'), null, 'analysed is not reproduced');
  assert.equal(newestReproduced(null, 'electrum'), null);
});

test('reviewedVersion: the greater of the page\'s version and the newest reproduced one', () => {
  assert.equal(reviewedVersion(electrum, '4.8.2', android), '4.8.4', 'stale page version');
  assert.equal(reviewedVersion(electrum, '4.8.5', android), '4.8.5', 'store ahead of the verifiers');
  assert.equal(reviewedVersion(electrum, '4.10.0', android), '4.10.0', 'numbers, not strings');
  assert.equal(reviewedVersion(electrum, '4.8.2', desktop), '4.8.3');
  assert.equal(reviewedVersion(electrum, '', android), '4.8.4');
  assert.equal(reviewedVersion(electrum, 'various', android), '4.8.4');
  assert.equal(reviewedVersion(electrum, '4.8.2', { appId: 'org.electrum.electrum', platform: 'iphone' }), '4.8.2', 'never reproduced: the page\'s version');
  assert.equal(reviewedVersion(electrum, '4.8.2'), '4.8.2', 'no listing given');
  assert.equal(reviewedVersion(app, '4.8.2', android), '4.8.2', 'export without releases');
  assert.equal(reviewedVersion(app, '', android), null);
  // a tie goes to the release tag, the name the advisories use
  const keepKey = { releases: [rel('v7.14.3', ['keepKey', 'hardware', '7.14.3-BTC only']), rel('v7.14.2', ['keepKey', 'hardware', '7.14.2'])] };
  assert.equal(reviewedVersion(keepKey, '7.14.3', { appId: 'keepKey', platform: 'hardware' }), '7.14.3');
  assert.equal(reviewedVersion(keepKey, '7.14.2', { appId: 'keepKey', platform: 'hardware' }), '7.14.3');
});

test('ownVulnerabilitiesModel: a stale page version does not report what the reproduced release fixed', () => {
  const m = ownVulnerabilitiesModel(electrum, '4.8.2', android);
  assert.equal(m.version, '4.8.4');
  assert.deepEqual([m.hits.length, m.others.length], [0, 3]);
  // and the other way round: the page says 4.8.3, nobody reproduced past 4.8.2
  const behind = { ...app, releases: [rel('4.8.2', ['electrum', 'desktop', '4.8.2'])] };
  assert.deepEqual(ownVulnerabilitiesModel(behind, '4.8.3', desktop).hits, []);
  assert.deepEqual(ownVulnerabilitiesModel(behind, '4.8.1', desktop).hits.map(a => a.id), ['CVE-2026-117601'], 'the reproduced version is hit');
  assert.deepEqual(ownVulnerabilitiesModel(electrum, '4.8.2').hits.map(a => a.id), ['CVE-2026-117601'], 'no listing: the page\'s version, as before');
});

test('fixedText and cveOf', () => {
  assert.equal(fixedText(adv('X', 'high', [], { fixed: ['4.10.0', '4.9.1'] })), '4.9.1 or 4.10.0');
  assert.equal(fixedText(adv('X', 'high', [], { lastAffected: ['2.9.4'] })), 'no fix listed; 2.9.4 and older affected');
  assert.equal(fixedText(adv('X', 'high', [])), 'no fix listed');
  assert.equal(cveOf({ id: 'GHSA-1', aliases: ['CVE-1-2'] }), 'CVE-1-2');
  assert.equal(cveOf({ id: 'GHSA-1', aliases: [] }), 'GHSA-1');
});
