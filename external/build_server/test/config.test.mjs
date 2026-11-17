import './setup.mjs';
import { describe, test, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import { shouldProcessAppId, shouldForceRebuild, DEBUG_APP_IDS, isTrustedVerifierEvent, PINNED_VERIFIER_EVENT_IDS, SCOPED_VERIFIER_APP_IDS } from '../config/config.mjs';

// Restore DEBUG_APP_IDS to its baseline after every test so the mutations
// don't leak into other suites.
afterEach(() => {
  DEBUG_APP_IDS.include = [];
  DEBUG_APP_IDS.exclude = [];
  DEBUG_APP_IDS.forceRebuild = [];
});

describe('shouldProcessAppId', () => {
  test('returns true for any appId when include and exclude are empty', () => {
    assert.equal(shouldProcessAppId('com.example.one'), true);
    assert.equal(shouldProcessAppId('com.example.two'), true);
  });

  test('returns false for appIds present in the exclude list', () => {
    DEBUG_APP_IDS.exclude = ['com.blocked'];
    assert.equal(shouldProcessAppId('com.blocked'), false);
    assert.equal(shouldProcessAppId('com.allowed'), true);
  });

  test('when include is non-empty, only those appIds pass', () => {
    DEBUG_APP_IDS.include = ['com.only.this'];
    assert.equal(shouldProcessAppId('com.only.this'), true);
    assert.equal(shouldProcessAppId('com.something.else'), false);
  });

  test('exclude wins over include when an appId is in both', () => {
    DEBUG_APP_IDS.include = ['com.shared'];
    DEBUG_APP_IDS.exclude = ['com.shared'];
    assert.equal(shouldProcessAppId('com.shared'), false);
  });
});

describe('shouldForceRebuild', () => {
  test('returns false when the list is empty', () => {
    assert.equal(shouldForceRebuild('com.example', '1.0.0'), false);
  });

  test('returns true only for an exact appId and version match', () => {
    DEBUG_APP_IDS.forceRebuild = [
      { appId: 'com.example', version: '1.2.3' },
      { appId: 'com.other', version: '2.0.0' },
    ];
    assert.equal(shouldForceRebuild('com.example', '1.2.3'), true);
    assert.equal(shouldForceRebuild('com.example', '1.2.4'), false);
    assert.equal(shouldForceRebuild('com.other', '2.0.0'), true);
    assert.equal(shouldForceRebuild('com.other', '1.0.0'), false);
  });
});

describe('isTrustedVerifierEvent', () => {
  const keraliss = '6274e238b289e1b2e98e4e6ce600dcc0cb2e2c03db9b850260ff8bdd6bbf2a45';

  test('keeps any event from a verifier without a pin list', () => {
    assert.equal(isTrustedVerifierEvent({ pubkey: 'a'.repeat(64), id: 'b'.repeat(64) }), true);
  });

  test('keeps a pinned verifier only on the listed events', () => {
    const pinned = { [keraliss]: new Set(['x'.repeat(64)]) };
    assert.equal(isTrustedVerifierEvent({ pubkey: keraliss, id: 'x'.repeat(64) }, pinned), true);
    assert.equal(isTrustedVerifierEvent({ pubkey: keraliss, id: 'y'.repeat(64), created_at: 1 }, pinned), false);
  });

  test('pins keraliss to his existing verifications', () => {
    assert.equal(PINNED_VERIFIER_EVENT_IDS[keraliss].size, 436);
    assert.equal(isTrustedVerifierEvent({ pubkey: keraliss, id: '23750b9d716a20392e4d1da12f9c47df7d5a217ac2d615f0de2926288901e3ca' }), true);
    assert.equal(isTrustedVerifierEvent({ pubkey: keraliss, id: '0'.repeat(64) }), false);
  });
});

describe('isTrustedVerifierEvent with an app scope', () => {
  const bitforbit = '54790a499115f63e32536aadab43f62c0cf3922cd1653b3a74846fe2f6573f5d';
  const event = appId => ({ pubkey: bitforbit, id: 'c'.repeat(64), tags: [['i', appId]] });

  test('keeps a scoped verifier only for the listed apps', () => {
    const scoped = { [bitforbit]: ['co.edgesecure.app'] };
    assert.equal(isTrustedVerifierEvent(event('co.edgesecure.app'), {}, scoped), true);
    assert.equal(isTrustedVerifierEvent(event('to.bitkit'), {}, scoped), false);
  });

  test('scopes BitForBit to the one test app', () => {
    assert.deepEqual(SCOPED_VERIFIER_APP_IDS[bitforbit], ['co.edgesecure.app']);
    assert.equal(isTrustedVerifierEvent(event('co.edgesecure.app')), true);
    assert.equal(isTrustedVerifierEvent(event('to.bitkit')), false);
  });
});
