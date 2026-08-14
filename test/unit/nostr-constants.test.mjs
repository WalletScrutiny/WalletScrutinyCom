import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  isWalletScrutinySiteAdmin,
  siteAdminPubkeys,
  eventRelayUrls,
  profileRelayUrl,
  explicitRelayUrls,
  verificationReportKind,
  codeSnippetKind,
} from '../../src/nostr-constants.mjs';

describe('isWalletScrutinySiteAdmin', () => {
  test('returns true for configured admin pubkeys', () => {
    assert.equal(isWalletScrutinySiteAdmin(siteAdminPubkeys[0]), true);
  });

  test('returns false for unknown or empty pubkeys', () => {
    assert.equal(isWalletScrutinySiteAdmin('f'.repeat(64)), false);
    assert.equal(isWalletScrutinySiteAdmin(''), false);
    assert.equal(isWalletScrutinySiteAdmin(null), false);
  });
});

describe('relay URL lists', () => {
  test('excludes profile relay from event relay urls', () => {
    assert.equal(eventRelayUrls.includes(profileRelayUrl), false);
    for (const url of eventRelayUrls) {
      assert.equal(explicitRelayUrls.includes(url), true);
    }
  });

  test('application-event reads use only the project relay', async () => {
    const { mainRelayUrl, readRelayUrls, writeRelayUrls } = await import('../../src/nostr-constants.mjs');
    assert.deepEqual(readRelayUrls, [mainRelayUrl]);
    assert.equal(writeRelayUrls.includes(mainRelayUrl), true);
    assert.ok(writeRelayUrls.length > readRelayUrls.length);
  });
});

describe('relayPaginationPageLimits', () => {
  test('allows a higher page limit for the project relay', async () => {
    const { mainRelayUrl, relayPaginationPageLimits, defaultRelayPaginationPageLimit } = await import('../../src/nostr-constants.mjs');
    assert.equal(defaultRelayPaginationPageLimit, 500);
    assert.ok(relayPaginationPageLimits[mainRelayUrl] > defaultRelayPaginationPageLimit);
  });
});

describe('kind constants', () => {
  test('uses stable public kinds in production mode (Node has no window, so isDebugEnv is false)', () => {
    assert.equal(verificationReportKind, 1984);
    assert.equal(codeSnippetKind, 1337);
  });
});
