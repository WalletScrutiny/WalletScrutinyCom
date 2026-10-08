import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  tally,
  compareVersionNames,
  buildVersionTimeline,
  defaultVersionKey,
  versionKeyOfVerification,
  headlineFor,
  ledeFor,
  fileVerdict,
} from '../../src/build-verifications-model.mjs';
import { buildHashVerdictIndex } from '../../src/assets-table-filters.mjs';
import { verificationKind, verificationDraftKind } from '../../src/nostr-constants.mjs';
import { HASH_A, HASH_B, HASH_C, makeEvent } from './fixtures.mjs';

const ALICE = 'a'.repeat(64);
const BOB = 'b'.repeat(64);

function verification({ id = 'v', pubkey = ALICE, status = 'reproducible', created_at = 100, hashes = [HASH_A], kind = verificationKind } = {}) {
  return makeEvent({
    id,
    pubkey,
    kind,
    created_at,
    tags: [['status', status], ...hashes.map(hash => ['x', hash])],
  });
}

function row({ sha256 = HASH_A, version = '1.0.0', attestations = [], files = [{ hash: HASH_A, fileName: 'base.apk' }], hasAssets = true, description = '' } = {}) {
  return {
    sha256,
    items: [],
    summary: { version, identifier: 'com.example', platform: 'android', attestations, files, hasAssets, description },
  };
}

describe('tally', () => {
  test('counts each verdict and names the glass', () => {
    assert.deepEqual(tally([]), { reproducible: 0, notReproducible: 0, failedToBuild: 0, other: 0, cracks: 0, glass: 'frosted' });
    assert.equal(tally([verification()]).glass, 'crystal');
    assert.equal(tally([verification({ status: 'ftbfs' })]).glass, 'cracked');
    assert.equal(tally([verification({ status: 'not_reproducible' })]).glass, 'cracked');
    assert.equal(tally([verification(), verification({ pubkey: BOB, status: 'ftbfs' })]).glass, 'split');
    assert.equal(tally([verification({ status: 'warning' })]).glass, 'frosted');
    assert.equal(tally([verification({ status: 'nosource' })]).other, 1);
  });
});

describe('compareVersionNames', () => {
  test('orders numerically, pre-releases before their release, and ignores a leading v', () => {
    const names = ['13.2.2', '13.2.3-alpha1', '13.2.2-rc1', 'v13.2.1', '13.10.0', '13.2.2-beta1'];
    assert.deepEqual(
      [...names].sort(compareVersionNames),
      ['v13.2.1', '13.2.2-beta1', '13.2.2-rc1', '13.2.2', '13.2.3-alpha1', '13.10.0'],
    );
  });
});

describe('buildVersionTimeline', () => {
  test('one version per name, oldest first, with every build of it', () => {
    const timeline = buildVersionTimeline([
      row({ version: '2.0.0', sha256: HASH_B, files: [{ hash: HASH_B, fileName: 'base.apk' }], attestations: [verification({ id: 'v2', hashes: [HASH_B] })] }),
      row({ version: '1.0.0', sha256: HASH_A, attestations: [verification({ id: 'v1' })] }),
      row({ version: '1.0.0', sha256: HASH_C, files: [{ hash: HASH_C, fileName: 'base.apk' }], attestations: [verification({ id: 'v3', pubkey: BOB, status: 'ftbfs', hashes: [HASH_C], created_at: 200 })] }),
    ]);
    assert.deepEqual(timeline.map(v => v.name), ['1.0.0', '2.0.0']);
    assert.equal(timeline[0].builds.length, 2);
    assert.deepEqual(timeline[0].verifications.map(v => v.id), ['v3', 'v1']);
    assert.equal(timeline[0].glass, 'split');
    assert.equal(timeline[1].glass, 'crystal');
    assert.equal(defaultVersionKey(timeline), '2.0.0');
  });

  test('keeps drafts apart from the published tally', () => {
    const timeline = buildVersionTimeline([
      row({ attestations: [verification({ id: 'd', kind: verificationDraftKind, status: 'not_reproducible' })] }),
    ]);
    assert.equal(timeline[0].verifications.length, 0);
    assert.equal(timeline[0].drafts.length, 1);
    assert.equal(timeline[0].glass, 'frosted');
    assert.equal(versionKeyOfVerification(timeline, 'd'), '1.0.0');
    assert.equal(versionKeyOfVerification(timeline, 'nope'), null);
  });

  test('leaves out rows without a version and marks the store release', () => {
    const timeline = buildVersionTimeline([
      row({ version: '' }),
      row({ version: 'v1.2.0' }),
      row({ version: '1.3.0', sha256: HASH_B }),
    ], { latestVersion: '1.2.0' });
    assert.deepEqual(timeline.map(v => [v.name, v.latest]), [['1.2.0', true], ['1.3.0', false]]);
  });

  test('flags a published warning', () => {
    const timeline = buildVersionTimeline([row({ attestations: [verification({ status: 'warning' })] })]);
    assert.equal(timeline[0].hasWarning, true);
    assert.equal(headlineFor(timeline[0]), 'Warning');
  });
});

describe('words', () => {
  const version = attestations => buildVersionTimeline([row({ attestations })])[0];

  test('headline counts verifiers the way the app does', () => {
    assert.equal(headlineFor(version([verification()])), '1 verifier found it reproducible');
    assert.equal(headlineFor(version([verification(), verification({ pubkey: BOB, id: 'b' })])), '2 verifiers found it reproducible');
    assert.equal(headlineFor(version([verification({ status: 'not_reproducible' })])), '1 verifier could not reproduce it');
    assert.equal(headlineFor(version([verification({ status: 'ftbfs' })])), 'The build failed for 1 verifier');
    assert.equal(headlineFor(version([verification(), verification({ pubkey: BOB, id: 'b', status: 'ftbfs' })])), '1 reproducible, 1 not reproducible');
    assert.equal(headlineFor(version([])), 'Nobody has tested this build yet');
    assert.equal(headlineFor(version([verification({ status: 'nosource' })])), 'Source not found');
  });

  test('lede names the wallet and version', () => {
    assert.equal(
      ledeFor(version([verification()]), 'ZEUS'),
      'Verifiers built ZEUS 1.0.0 from its public source code and got exactly the app its developer published.',
    );
    assert.equal(ledeFor(version([]), 'ZEUS'), 'Nobody has tested ZEUS 1.0.0 yet.');
    assert.equal(ledeFor(version([verification({ status: 'ftbfs' })]), 'ZEUS'), 'Nobody managed to build ZEUS 1.0.0 from its source code, so it could not be checked.');
  });
});

describe('files', () => {
  test('a file reproduced anywhere outranks a failure elsewhere', () => {
    const index = buildHashVerdictIndex(new Map([
      [HASH_A, [verification({ id: 'a', status: 'not_reproducible', hashes: [HASH_A, HASH_B] })]],
      [HASH_B, [verification({ id: 'b', pubkey: BOB, hashes: [HASH_B] })]],
    ]));
    assert.equal(fileVerdict(HASH_A, index), 'not_reproducible');
    assert.equal(fileVerdict(HASH_B, index), 'reproducible');
    assert.equal(fileVerdict(HASH_C, index), null);
  });
});
