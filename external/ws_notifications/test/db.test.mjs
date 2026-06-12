import './setup.mjs';

import { describe, test, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';

import {
  closeDb,
  getSince,
  initDb,
  isNotified,
  markNotified,
  resetDbForTests,
  updateSince,
} from '../db.mjs';
import {
  buildVerificationUrl,
  formatNotificationMessage,
  parseVerificationEvent,
  parsePublishDelayMs,
  startOfTodayUtc,
  webappPlatformPath,
} from '../utils.mjs';
import { buildNotificationForVerification } from '../nostr.mjs';

beforeEach(() => {
  resetDbForTests();
});

after(() => {
  closeDb();
});

describe('db cursor and dedup', () => {
  test('initDb seeds since to start of today UTC when meta is empty', () => {
    initDb();
    const since = getSince();
    assert.equal(since, startOfTodayUtc());
  });

  test('updateSince persists the cursor', () => {
    initDb();
    updateSince(1_700_000_000);
    assert.equal(getSince(), 1_700_000_000);
  });

  test('markNotified and isNotified round-trip', () => {
    initDb();
    assert.equal(isNotified('abc123'), false);
    markNotified('abc123');
    assert.equal(isNotified('abc123'), true);
    assert.equal(isNotified('other'), false);
  });

  test('markNotified is idempotent for the same event_id', () => {
    initDb();
    markNotified('dup-id');
    markNotified('dup-id');
    assert.equal(isNotified('dup-id'), true);
  });
});

describe('utils', () => {
  test('parseVerificationEvent returns null when tags are missing', () => {
    assert.equal(parseVerificationEvent({ tags: [['i', 'app.test']] }), null);
  });

  test('parseVerificationEvent extracts required fields', () => {
    const event = {
      tags: [
        ['i', 'app.zeusln.zeus'],
        ['version', '1.2.3'],
        ['platform', 'android'],
        ['status', 'reproducible'],
      ],
    };
    assert.deepEqual(parseVerificationEvent(event), {
      appId: 'app.zeusln.zeus',
      version: '1.2.3',
      platform: 'android',
      status: 'reproducible',
    });
  });

  test('buildVerificationUrl maps desktop platforms to /desktop/', () => {
    const url = buildVerificationUrl({
      platform: 'linux',
      appId: 'blockstreamgreen',
      eventId: 'deadbeef',
    });
    assert.equal(
      url,
      'https://walletscrutiny.com/desktop/blockstreamgreen/#verificationId=deadbeef'
    );
    assert.equal(webappPlatformPath('windows'), 'desktop');
    assert.equal(webappPlatformPath('macos'), 'desktop');
  });

  test('buildVerificationUrl uses /mobile/ for android and iphone', () => {
    assert.equal(
      buildVerificationUrl({
        platform: 'android',
        appId: 'com.btc.trustless',
        eventId: 'evt1',
      }),
      'https://walletscrutiny.com/mobile/com.btc.trustless/#verificationId=evt1'
    );
    assert.equal(
      buildVerificationUrl({
        platform: 'iphone',
        appId: 'com.example.wallet',
        eventId: 'evt2',
      }),
      'https://walletscrutiny.com/mobile/com.example.wallet/#verificationId=evt2'
    );
    assert.equal(webappPlatformPath('android'), 'mobile');
    assert.equal(webappPlatformPath('iphone'), 'mobile');
    assert.equal(webappPlatformPath('hardware'), 'hardware');
  });

  test('formatNotificationMessage puts status and app info in headline', () => {
    const message = formatNotificationMessage({
      appId: 'blockstreamgreen',
      version: '3.4.0',
      platform: 'linux',
      status: 'not_reproducible',
      url: 'https://walletscrutiny.com/desktop/blockstreamgreen/#verificationId=evt1',
    });
    assert.match(
      message,
      /^New "Not Reproducible" verification for blockstreamgreen 3\.4\.0 \(linux\):/
    );
    assert.doesNotMatch(message, /App:/);
    assert.doesNotMatch(message, /Version:/);
    assert.doesNotMatch(message, /Platform:/);
    assert.match(message, /#verificationId=evt1/);
  });

  test('parsePublishDelayMs defaults to 3000ms', () => {
    const previous = process.env.WS_NOTIFICATIONS_PUBLISH_DELAY_MS;
    delete process.env.WS_NOTIFICATIONS_PUBLISH_DELAY_MS;
    assert.equal(parsePublishDelayMs(), 3000);
    process.env.WS_NOTIFICATIONS_PUBLISH_DELAY_MS = '0';
    assert.equal(parsePublishDelayMs(), 0);
    if (previous === undefined) {
      delete process.env.WS_NOTIFICATIONS_PUBLISH_DELAY_MS;
    } else {
      process.env.WS_NOTIFICATIONS_PUBLISH_DELAY_MS = previous;
    }
  });

  test('buildNotificationForVerification builds kind=1 payload', () => {
    const event = {
      id: 'evt1',
      pubkey: 'abc123',
      tags: [
        ['i', 'app.test'],
        ['version', '1.0'],
        ['platform', 'linux'],
        ['status', 'reproducible'],
      ],
    };
    const payload = buildNotificationForVerification(event);
    assert.match(payload.content, /verification for app\.test 1\.0 \(linux\):/);
    assert.deepEqual(payload.tags, [['e', 'evt1', '', 'abc123']]);
  });
});
