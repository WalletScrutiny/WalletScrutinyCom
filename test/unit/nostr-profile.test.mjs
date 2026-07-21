import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { getPublicKey, generateSecretKey } from 'nostr-tools/pure';

import {
  getProfileDisplayName,
  getProfileImageUrl,
  PROFILE_PLACEHOLDER_IMAGE,
  buildProfileCircleHtml,
  profileImageFallback,
  renderProfileCardHtml,
  renderBigProfileCardHtml,
} from '../../src/nostr-profile.mjs';

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
    assert.doesNotMatch(html, /profile-circle--placeholder/);
  });

  test('marks placeholder images with a dedicated class', () => {
    const html = buildProfileCircleHtml(PUBKEY, null, PROFILE_PLACEHOLDER_IMAGE, PROFILE_PLACEHOLDER_IMAGE);
    assert.match(html, /profile-circle profile-circle--placeholder/);
  });
});

describe('profileImageFallback', () => {
  test('replaces broken image src with placeholder', () => {
    const img = {
      src: 'https://cdn.example/broken.png',
      dataset: { placeholder: PROFILE_PLACEHOLDER_IMAGE },
      onerror: () => {},
      classList: { add() {} },
    };
    profileImageFallback(img);
    assert.equal(img.src, PROFILE_PLACEHOLDER_IMAGE);
    assert.equal(img.onerror, null);
  });

  test('does nothing when image already uses placeholder', () => {
    const img = {
      src: PROFILE_PLACEHOLDER_IMAGE,
      dataset: { placeholder: PROFILE_PLACEHOLDER_IMAGE },
      onerror: () => {},
    };
    profileImageFallback(img);
    assert.equal(img.src, PROFILE_PLACEHOLDER_IMAGE);
    assert.notEqual(img.onerror, null);
  });
});

describe('renderProfileCardHtml', () => {
  test('includes profile name, image, and nip05 when available', () => {
    const html = renderProfileCardHtml(PUBKEY, {
      name: 'Alice',
      nip05: 'alice@walletscrutiny.com',
      image: 'https://cdn.example/alice.png',
    });
    assert.match(html, /Alice/);
    assert.match(html, /alice@walletscrutiny\.com/);
    assert.match(html, /profile-card/);
    assert.match(html, new RegExp(PUBKEY));
  });
});

describe('renderBigProfileCardHtml', () => {
  test('renders large profile card markup', () => {
    const html = renderBigProfileCardHtml(PUBKEY, { display_name: 'Bob' });
    assert.match(html, /big-profile-card/);
    assert.match(html, /Bob/);
    assert.match(html, /200px/);
  });
});

describe('getProfileImageUrl https upgrade', () => {
  test('upgrades http image urls on https pages', () => {
    const previousProtocol = globalThis.window.location.protocol;
    globalThis.window.location.protocol = 'https:';
    try {
      assert.equal(
        getProfileImageUrl({ image: 'http://cdn.example/avatar.png' }),
        'https://cdn.example/avatar.png',
      );
    } finally {
      globalThis.window.location.protocol = previousProtocol;
    }
  });
});
