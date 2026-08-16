import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  shortenNpub,
  getAppInfoFromEventInfo,
  getMaxAssetVersion,
  getWeightForAppFromAssetInformation,
  getLastVerificationStatusForAppId,
  getFileAttachmentIDsForVerificationEvent,
  groupEndorsementsByVerificationId,
} from '../../src/verifications_utils.mjs';
import {
  assetRegistrationKind,
  verificationKind,
} from '../../src/nostr-constants.mjs';
import { HASH_A, HASH_B, makeEvent, makeVerification } from './fixtures.mjs';

const ATTACHMENT_ID_A = 'a'.repeat(64);
const ATTACHMENT_ID_B = 'b'.repeat(64);

describe('shortenNpub', () => {
  test('returns short values unchanged', () => {
    assert.equal(shortenNpub('npub1short'), 'npub1short');
    assert.equal(shortenNpub(null), null);
    assert.equal(shortenNpub(''), '');
  });

  test('truncates long npubs with ellipsis', () => {
    const npub = 'npub1' + 'x'.repeat(50);
    const shortened = shortenNpub(npub);
    assert.match(shortened, /^npub1.{0,6}….{6}$/);
    assert.ok(shortened.length < npub.length);
    assert.equal(shortened.slice(0, 10), npub.slice(0, 10));
    assert.equal(shortened.slice(-6), npub.slice(-6));
  });
});

describe('groupEndorsementsByVerificationId', () => {
  test('groups endorsements by 64-character e tag', () => {
    const endorsementA = makeEvent({
      id: 'end-a',
      tags: [['e', HASH_A], ['e', 'short']],
    });
    const endorsementB = makeEvent({
      id: 'end-b',
      tags: [['e', HASH_A]],
    });
    const endorsementC = makeEvent({
      id: 'end-c',
      tags: [['e', HASH_B]],
    });
    const skipped = makeEvent({
      id: 'end-skip',
      tags: [['e', 'not-an-event-id'], ['p', HASH_A]],
    });

    assert.deepEqual(
      groupEndorsementsByVerificationId([endorsementA, endorsementB, endorsementC, skipped]),
      {
        [HASH_A]: [endorsementA, endorsementB],
        [HASH_B]: [endorsementC],
      }
    );
  });

  test('returns an empty object for an empty list', () => {
    assert.deepEqual(groupEndorsementsByVerificationId([]), {});
  });
});

describe('getFileAttachmentIDsForVerificationEvent', () => {
  test('returns 64-character attachment event ids', () => {
    const event = makeEvent({
      tags: [
        ['file-attachment', ATTACHMENT_ID_A],
        ['file-attachment', ATTACHMENT_ID_B],
        ['file-attachment', 'too-short'],
        ['file-attachment', ''],
      ],
    });
    assert.deepEqual(getFileAttachmentIDsForVerificationEvent(event), [
      ATTACHMENT_ID_A,
      ATTACHMENT_ID_B,
    ]);
  });

  test('returns empty array when no attachment tags exist', () => {
    const event = makeEvent({ tags: [['status', 'reproducible']] });
    assert.deepEqual(getFileAttachmentIDsForVerificationEvent(event), []);
  });
});

describe('getAppInfoFromEventInfo', () => {
  test('parses asset registration events', () => {
    const event = makeEvent({
      kind: assetRegistrationKind,
      created_at: 1_700_000_000,
      content: 'Signed APK for review',
      tags: [
        ['i', 'com.example.wallet'],
        ['version', '3.1.0'],
        ['platform', 'android'],
        ['x', HASH_A],
        ['file-name', 'base.apk'],
      ],
    });

    const info = getAppInfoFromEventInfo(event);
    assert.equal(info.isAsset, true);
    assert.equal(info.appId, 'com.example.wallet');
    assert.equal(info.version, '3.1.0');
    assert.equal(info.platform, 'android');
    assert.equal(info.content, 'Signed APK for review');
    assert.equal(info.description, '');
    assert.equal(info.status, '');
    assert.deepEqual(info.appHashes, [HASH_A]);
    assert.equal(info.assetFiles[0].fileName, 'base.apk');
  });

  test('parses verification events with JSON content', () => {
    const event = makeEvent({
      kind: verificationKind,
      created_at: 1_700_000_100,
      content: JSON.stringify({
        description: 'Build verified',
        content: '<p>Reproduced successfully</p>',
      }),
      tags: [
        ['i', 'com.example.wallet'],
        ['version', '3.1.0'],
        ['platform', 'android'],
        ['status', 'reproducible'],
        ['x', HASH_A],
        ['issue-tracker-url', 'https://github.com/org/repo/issues/1'],
      ],
    });

    const info = getAppInfoFromEventInfo(event);
    assert.equal(info.isAsset, false);
    assert.equal(info.description, 'Build verified');
    assert.equal(info.content, '<p>Reproduced successfully</p>');
    assert.equal(info.status, 'reproducible');
    assert.equal(info.url, '');
  });

  test('falls back when verification content is not JSON', () => {
    const event = makeEvent({
      kind: verificationKind,
      created_at: 1_700_000_100,
      content: 'not-json',
      tags: [
        ['i', 'com.example.wallet'],
        ['status', 'reproducible'],
      ],
    });

    const info = getAppInfoFromEventInfo(event);
    assert.equal(info.isAsset, false);
    assert.equal(info.description, '');
    assert.equal(info.content, 'not-json');
  });
});

describe('getMaxAssetVersion', () => {
  function makeAssetInfo({ verifications = [], assets = [] } = {}) {
    const verificationsMap = new Map();
    const assetsMap = new Map();

    for (const entry of verifications) {
      const hash = entry.tags.find(t => t[0] === 'x')?.[1] || HASH_A;
      if (!verificationsMap.has(hash)) {
        verificationsMap.set(hash, []);
      }
      verificationsMap.get(hash).push(entry);
    }

    for (const entry of assets) {
      const hash = entry.tags.find(t => t[0] === 'x')?.[1] || HASH_B;
      if (!assetsMap.has(hash)) {
        assetsMap.set(hash, []);
      }
      assetsMap.get(hash).push(entry);
    }

    return { verifications: verificationsMap, assets: assetsMap };
  }

  test('throws when verifications map is missing', () => {
    assert.throws(
      () => getMaxAssetVersion({ assets: new Map() }),
      /verifications is not defined/,
    );
  });

  test('picks highest semantic version across assets and verifications', () => {
    const info = makeAssetInfo({
      assets: [
        makeEvent({
          kind: assetRegistrationKind,
          created_at: 100,
          tags: [['i', 'com.app'], ['version', '1.9.0'], ['x', HASH_A]],
        }),
      ],
      verifications: [
        makeVerification({
          appId: 'com.app',
          platform: 'android',
          version: '2.0.0',
          created_at: 200,
          extraTags: [['status', 'not_reproducible'], ['x', HASH_A]],
        }),
        makeVerification({
          appId: 'com.app',
          platform: 'android',
          version: '1.10.0',
          created_at: 150,
          extraTags: [['status', 'reproducible'], ['x', HASH_B]],
        }),
      ],
    });

    const result = getMaxAssetVersion(info);
    assert.equal(result.lastVersion, '2.0.0');
    assert.equal(result.lastVerifiedVersion, '1.10.0');
    assert.ok(result.lastVersionDate);
    assert.ok(result.lastVerifiedVersionDate);
  });

  test('filters by app id when provided', () => {
    const info = makeAssetInfo({
      verifications: [
        makeVerification({
          appId: 'com.keep',
          platform: 'android',
          version: '9.0.0',
          created_at: 300,
          extraTags: [['status', 'reproducible'], ['x', HASH_A]],
        }),
        makeVerification({
          appId: 'com.ignore',
          platform: 'android',
          version: '99.0.0',
          created_at: 400,
          extraTags: [['status', 'reproducible'], ['x', HASH_B]],
        }),
      ],
    });

    const result = getMaxAssetVersion(info, 'com.keep');
    assert.equal(result.lastVersion, '9.0.0');
    assert.equal(result.lastVerifiedVersion, '9.0.0');
  });

  test('returns null versions when no matching events exist', () => {
    const info = makeAssetInfo();
    const result = getMaxAssetVersion(info, 'com.missing');
    assert.equal(result.lastVersion, null);
    assert.equal(result.lastVerifiedVersion, null);
    assert.equal(result.lastVersionDate, null);
    assert.equal(result.lastVerifiedVersionDate, null);
  });
});

describe('getWeightForAppFromAssetInformation', () => {
  function makeInfo(verifications) {
    const verificationsMap = new Map();
    for (const entry of verifications) {
      const hash = entry.tags.find(t => t[0] === 'x')?.[1] || HASH_A;
      if (!verificationsMap.has(hash)) {
        verificationsMap.set(hash, []);
      }
      verificationsMap.get(hash).push(entry);
    }
    return { verifications: verificationsMap, assets: new Map() };
  }

  test('indexes once and returns the reproducible ratio', () => {
    const info = makeInfo([
      makeVerification({
        appId: 'com.app',
        platform: 'android',
        version: '1.0.0',
        extraTags: [['status', 'reproducible'], ['x', HASH_A]],
      }),
      makeVerification({
        appId: 'com.app',
        platform: 'android',
        version: '1.1.0',
        extraTags: [['status', 'not_reproducible'], ['x', HASH_B]],
      }),
    ]);

    const first = getWeightForAppFromAssetInformation(info, 'com.app');
    const second = getWeightForAppFromAssetInformation(info, 'com.app');
    assert.equal(first.weight, 0.5);
    assert.deepEqual(second, first);
    assert.equal(getLastVerificationStatusForAppId(info, 'com.app', 'android'), 'not_reproducible');
  });
});
