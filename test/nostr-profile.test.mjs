import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { getPublicKey, generateSecretKey } from 'nostr-tools/pure';

import {
  getProfileDisplayName,
  getProfileImageUrl,
  PROFILE_PLACEHOLDER_IMAGE,
  buildProfileCircleHtml,
} from '../src/nostr-profile.mjs';

const PUBKEY = getPublicKey(generateSecretKey());

describe('getProfileDisplayName', () => {
  test('prefers profile name fields', () => {
    assert.equal(getProfileDisplayName({ name: 'Alice' }, PUBKEY), 'Alice');
    assert.equal(getProfileDisplayName({ displayName: 'Bob' }, PUBKEY), 'Bob');
    assert.equal(getProfileDisplayName({ display_name: 'Carol' }, PUBKEY), 'Carol');
  });

  test('falls back to shortened npub when name is missing', () => {
    const name = getProfileDisplayName(null, PUBKEY);
    assert.match(name, /npub1/);
    assert.match(name, /…/);
  });
});

describe('getProfileImageUrl', () => {
  test('returns image or picture url', () => {
    assert.equal(getProfileImageUrl({ image: 'https://cdn.example/avatar.png' }), 'https://cdn.example/avatar.png');
    assert.equal(getProfileImageUrl({ picture: 'https://cdn.example/pic.png' }), 'https://cdn.example/pic.png');
  });

  test('returns placeholder when profile has no image', () => {
    assert.equal(getProfileImageUrl(null), PROFILE_PLACEHOLDER_IMAGE);
    assert.equal(getProfileImageUrl({}), PROFILE_PLACEHOLDER_IMAGE);
  });
});

describe('buildProfileCircleHtml', () => {
  test('includes display name and pubkey in generated html', () => {
    const html = buildProfileCircleHtml(PUBKEY, { name: 'Verifier' }, 'https://img.test/a.png', PROFILE_PLACEHOLDER_IMAGE);
    assert.match(html, /Verifier/);
    assert.match(html, new RegExp(PUBKEY));
    assert.match(html, /profile-circle/);
  });
});
