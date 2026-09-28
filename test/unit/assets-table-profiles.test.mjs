import './setup.mjs';
import { describe, test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// assets-table-profiles.js reads these as bare globals that nostr-profile.mjs
// installs on window in the browser.
const lookups = new Map();
let lookupCount = 0;

globalThis.PROFILE_PLACEHOLDER_IMAGE = '/placeholder.svg';
globalThis.getProfileImageUrl = profile => profile?.image || '/placeholder.svg';
globalThis.buildProfileCircleHtml = (pubkey, profile, imageUrl) => `<img class="profile-circle" src="${imageUrl}">`;
globalThis.wireProfileCircleInteractions = () => {};
globalThis.getNostrProfile = pubkey => {
  lookupCount += 1;
  return new Promise(resolve => lookups.set(pubkey, resolve));
};

const { renderProfilePictures } = await import('../../src/assets-table-profiles.js');

const flush = () => new Promise(resolve => setTimeout(resolve, 0));

function paintAvatar(pubkey) {
  const avatar = document.createElement('div');
  avatar.className = `verification-card__avatar profile-${pubkey}`;
  document.body.appendChild(avatar);
  return avatar;
}

function srcOf(element) {
  return element.querySelector('img')?.getAttribute('src');
}

describe('renderProfilePictures', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('fills a node painted while the lookup is in flight', async () => {
    const pubkey = '1'.repeat(64);
    const cachePaint = paintAvatar(pubkey);
    renderProfilePictures([pubkey]);
    assert.equal(srcOf(cachePaint), '/placeholder.svg');

    // The network paint replaces the table before the profile arrives.
    cachePaint.remove();
    const networkPaint = paintAvatar(pubkey);
    renderProfilePictures([pubkey]);

    lookups.get(pubkey)({ image: 'https://example.com/one.png' });
    await flush();
    assert.equal(srcOf(networkPaint), 'https://example.com/one.png');
  });

  test('fills a node painted after the profile has loaded, without a second lookup', async () => {
    const pubkey = '2'.repeat(64);
    paintAvatar(pubkey);
    const before = lookupCount;
    renderProfilePictures([pubkey]);
    lookups.get(pubkey)({ image: 'https://example.com/two.png' });
    await flush();

    document.body.innerHTML = '';
    const repainted = paintAvatar(pubkey);
    renderProfilePictures([pubkey]);
    await flush();

    assert.equal(srcOf(repainted), 'https://example.com/two.png');
    assert.equal(lookupCount - before, 1);
  });

  test('leaves an already filled node alone', async () => {
    const pubkey = '3'.repeat(64);
    const avatar = paintAvatar(pubkey);
    renderProfilePictures([pubkey]);
    lookups.get(pubkey)({ image: 'https://example.com/three.png' });
    await flush();
    const img = avatar.querySelector('img');

    renderProfilePictures([pubkey]);
    await flush();
    assert.equal(avatar.querySelector('img'), img);
  });

  test('shows the placeholder when the lookup fails', async () => {
    const pubkey = '4'.repeat(64);
    const avatar = paintAvatar(pubkey);
    renderProfilePictures([pubkey]);
    lookups.get(pubkey)(null);
    await flush();
    assert.equal(srcOf(avatar), '/placeholder.svg');
    assert.equal(avatar.dataset.profileState, 'loaded');
  });
});
