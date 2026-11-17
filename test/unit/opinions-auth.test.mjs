import './setup.mjs';
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

const PUBKEY = 'a'.repeat(64);

function rememberLegacyFlag() {
  const memory = new Map([['wsOpinionsSignedIn', '1']]);
  const store = {
    getItem: (key) => (memory.has(key) ? memory.get(key) : null),
    setItem: (key, value) => memory.set(key, String(value)),
    removeItem: (key) => memory.delete(key),
  };
  Object.defineProperty(window, 'localStorage', { value: store, configurable: true });
  return store;
}

function installExtension(getPublicKey) {
  let calls = 0;
  window.nostr = {
    getPublicKey: async () => {
      calls += 1;
      return getPublicKey();
    },
    signEvent: async (event) => event,
  };
  return () => calls;
}

async function loadAuth(tag) {
  return import(`../../src/opinions/auth.mjs?case=${tag}`);
}

describe('detectIdentity', () => {
  test('adopts the extension account once and ignores a missing extension', async () => {
    const store = rememberLegacyFlag();
    const calls = installExtension(async () => PUBKEY);
    const present = await loadAuth('present');
    assert.equal(await present.detectIdentity(), PUBKEY);
    assert.equal(present.getPubkey(), PUBKEY);
    assert.equal(await present.detectIdentity(), PUBKEY);
    assert.equal(calls(), 1);
    assert.equal(store.getItem('wsOpinionsSignedIn'), null);

    installExtension(async () => {
      throw new Error('declined');
    });
    const declined = await loadAuth('declined');
    assert.equal(await declined.detectIdentity(), null);
    assert.equal(declined.getPubkey(), null);

    delete window.nostr;
    const absent = await loadAuth('absent');
    assert.equal(await absent.detectIdentity(), null);
    assert.equal(absent.getPubkey(), null);
  });
});
