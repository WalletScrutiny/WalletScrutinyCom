import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// searchWallets.js is a classic browser script, so it runs in its own context
// with just enough of a window for its top level.
function loadSearch (wallets) {
  const context = {
    setTimeout: () => 0,
    addEventListener: () => {},
    document: { querySelector: () => null },
    wallets,
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(readFileSync(new URL('../../assets/js/searchWallets.js', import.meta.url), 'utf8'), context);
  return (query) => Array.from(vm.runInContext('performSearch', context)(wallets, query), (w) => w.appId);
}

const wallets = () => [
  { appId: 'trezorSafe3', title: 'Trezor Safe 3', folder: 'hardware', verdict: 'sourceavailable', meta: 'ok' },
  { appId: 'bluewallet', title: 'BlueWallet', folder: 'mobile', verdict: 'sourceavailable', meta: 'ok', users: 1000000 },
  { appId: 'bitcoin.safe', title: 'Bitcoin-Safe Desktop', folder: 'desktop', verdict: 'sourceavailable', meta: 'ok' },
  { appId: 'muun', title: 'Muun: Bitcoin Lightning Wallet', folder: 'mobile', verdict: 'sourceavailable', meta: 'ok', users: 100000 },
];

describe('performSearch ranking', () => {
  test('a hyphenated title holding every query word comes first (#993)', () => {
    const search = loadSearch(wallets());
    assert.equal(search('BITCOIN SAFE')[0], 'bitcoin.safe');
  });

  test('a title holding every query word beats one holding only "wallet"', () => {
    const search = loadSearch(wallets());
    assert.deepEqual(search('MUUN WALLET').slice(0, 1), ['muun']);
  });

  test('a title holding the whole query still shows only such titles', () => {
    const search = loadSearch(wallets());
    assert.deepEqual(search('TREZOR SAFE'), ['trezorSafe3']);
    assert.deepEqual(search('BITCOIN-SAFE'), ['bitcoin.safe']);
  });

  test('an earlier search does not reorder the unfiltered list', () => {
    const search = loadSearch(wallets());
    const unfiltered = search(false);
    search('MUUN WALLET');
    assert.deepEqual(search(false), unfiltered);
  });
});
