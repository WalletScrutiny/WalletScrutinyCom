import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  parseFeatureTokens,
  walletMatchesPlatformFilter,
  performSearch,
  getPrimaryWalletVerdict,
  walletHasVerdict,
  getVerificationTarget,
} from '../assets/js/searchWalletsUtils.mjs';
import { makeWallet } from './fixtures.mjs';

describe('parseFeatureTokens', () => {
  test('extracts f:key tokens and leaves remaining query', () => {
    assert.deepEqual(parseFeatureTokens('bitcoin f:lightning wallet'), {
      featureKeys: ['lightning'],
      remainingQuery: 'bitcoin wallet',
    });
  });

  test('handles multiple feature tokens', () => {
    const result = parseFeatureTokens('f:btc f:lnurl query');
    assert.deepEqual(result.featureKeys, ['btc', 'lnurl']);
    assert.equal(result.remainingQuery, 'query');
  });

  test('returns empty values for blank query', () => {
    assert.deepEqual(parseFeatureTokens(''), { featureKeys: [], remainingQuery: '' });
    assert.deepEqual(parseFeatureTokens(null), { featureKeys: [], remainingQuery: '' });
  });
});

describe('walletMatchesPlatformFilter', () => {
  test('matches all platforms when filter is absent', () => {
    const wallet = makeWallet({ folder: 'desktop' });
    assert.equal(walletMatchesPlatformFilter(wallet, 'allPlatforms'), true);
    assert.equal(walletMatchesPlatformFilter(wallet, null), true);
  });

  test('matches android mobile wallets', () => {
    const wallet = makeWallet({ folder: 'mobile', hasAndroid: true, hasIphone: false });
    assert.equal(walletMatchesPlatformFilter(wallet, 'android'), true);
    assert.equal(walletMatchesPlatformFilter(wallet, 'iphone'), false);
  });

  test('matches direct folder values', () => {
    assert.equal(walletMatchesPlatformFilter(makeWallet({ folder: 'hardware' }), 'hardware'), true);
    assert.equal(walletMatchesPlatformFilter(makeWallet({ folder: 'hardware' }), 'desktop'), false);
  });
});

describe('performSearch', () => {
  const wallets = [
    makeWallet({ title: 'Blue Wallet', appId: 'com.bluewallet', folder: 'mobile', hasAndroid: true, features: ['lightning'] }),
    makeWallet({ title: 'Green Wallet', appId: 'com.greenwallet', folder: 'desktop', features: ['lightning', 'multisig'] }),
    makeWallet({ title: 'Red Vault', appId: 'com.redvault', folder: 'hardware' }),
  ];

  test('filters by text query', () => {
    const results = performSearch(wallets, 'BLUE');
    assert.equal(results.length, 1);
    assert.equal(results[0].appId, 'com.bluewallet');
  });

  test('filters by platform', () => {
    const results = performSearch(wallets, false, 'desktop');
    assert.deepEqual(results.map(w => w.appId), ['com.greenwallet']);
  });

  test('filters by feature tokens with AND logic', () => {
    const results = performSearch(wallets, 'F:LIGHTNING F:MULTISIG');
    assert.equal(results.length, 1);
    assert.equal(results[0].appId, 'com.greenwallet');
  });

  test('returns all wallets when query and platform are empty', () => {
    assert.equal(performSearch(wallets).length, 3);
  });
});

describe('getPrimaryWalletVerdict', () => {
  test('picks the best-ranked verdict from dual-platform wallets', () => {
    const wallet = makeWallet({
      verdictAndroid: 'custodial',
      verdictIphone: 'sourceavailable',
    });
    assert.equal(getPrimaryWalletVerdict(wallet), 'sourceavailable');
  });

  test('falls back to single verdict field', () => {
    assert.equal(getPrimaryWalletVerdict(makeWallet({ verdict: 'diy' })), 'diy');
  });
});

describe('walletHasVerdict', () => {
  test('checks all platform-specific verdict fields', () => {
    const wallet = makeWallet({ verdictAndroid: 'diy', verdictIphone: 'custodial' });
    assert.equal(walletHasVerdict(wallet, 'diy'), true);
    assert.equal(walletHasVerdict(wallet, 'custodial'), true);
    assert.equal(walletHasVerdict(wallet, 'fake'), false);
  });
});

describe('getVerificationTarget', () => {
  test('uses platform-specific app ids when filter is set', () => {
    const wallet = makeWallet({
      androidAppId: 'com.android.app',
      iphoneAppId: 'com.iphone.app',
      appId: 'fallback',
      folder: 'mobile',
    });
    assert.deepEqual(getVerificationTarget(wallet, 'android'), { appId: 'com.android.app', platform: 'android' });
    assert.deepEqual(getVerificationTarget(wallet, 'iphone'), { appId: 'com.iphone.app', platform: 'iphone' });
  });
});
