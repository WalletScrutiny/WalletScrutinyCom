import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { reproducedRows, groupByMonth, walletIndex } from '../../src/reproduced-wallets-model.mjs';
import { verificationKind } from '../../src/nostr-constants.mjs';
import { makeEvent } from './fixtures.mjs';

const A = 'a'.repeat(64);
const B = 'b'.repeat(64);
const NOW = Date.UTC(2026, 10, 20) / 1000;
const DAY = 86400;

function verification({ id, pubkey = A, status = 'reproducible', appId = 'com.example', version = '1.0.0', created_at, platform = 'android' }) {
  return makeEvent({
    id, pubkey, kind: verificationKind, created_at,
    tags: [['i', appId], ['version', version], ['platform', platform], ['status', status]],
  });
}

const wallets = [{ appId: 'example', androidAppId: 'com.example', title: 'Example Wallet', url: '/mobile/example/' }];

describe('reproducedRows', () => {
  test('one row per wallet version, dated by its first reproduction, with the wallet page', () => {
    const { rows } = reproducedRows([
      verification({ id: '1', created_at: NOW - 5 * DAY }),
      verification({ id: '2', pubkey: B, created_at: NOW - 2 * DAY }),
      verification({ id: '3', pubkey: A, created_at: NOW - 1 * DAY }),
    ], wallets, NOW);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].title, 'Example Wallet');
    assert.equal(rows[0].url, '/mobile/example/');
    assert.equal(rows[0].date, NOW - 5 * DAY);
    assert.equal(rows[0].lastDate, NOW - 1 * DAY);
    assert.equal(rows[0].verifiers, 2, 'a verifier counts once');
  });

  test('versions nobody reproduced are left out; a dissent on a reproduced one is shown', () => {
    const { rows } = reproducedRows([
      verification({ id: '1', status: 'not_reproducible', version: '2.0.0', created_at: NOW - DAY }),
      verification({ id: '2', status: 'ftbfs', version: '1.0.0', pubkey: B, created_at: NOW - DAY }),
      verification({ id: '3', version: '1.0.0', created_at: NOW - 2 * DAY }),
    ], wallets, NOW);
    assert.deepEqual(rows.map(r => [r.version, r.against]), [['1.0.0', 1]]);
  });

  test('"v1.0.0" and "1.0.0" are one version; newest first; unknown wallets keep their id', () => {
    const { rows, summary } = reproducedRows([
      verification({ id: '1', version: 'v1.0.0', created_at: NOW - 40 * DAY }),
      verification({ id: '2', version: '1.0.0', pubkey: B, created_at: NOW - 39 * DAY }),
      verification({ id: '3', appId: 'org.other', version: '3', created_at: NOW - DAY }),
    ], wallets, NOW);
    assert.deepEqual(rows.map(r => r.title), ['org.other', 'Example Wallet']);
    assert.equal(rows[0].url, null);
    assert.deepEqual([summary.wallets, summary.versions, summary.recentVersions, summary.recentWallets], [2, 2, 1, 1]);
  });

  test('events without an app id or version are ignored', () => {
    const odd = makeEvent({ id: 'x', pubkey: A, kind: verificationKind, created_at: 1, tags: [['status', 'reproducible']] });
    assert.equal(reproducedRows([odd], wallets, NOW).rows.length, 0);
  });
});

describe('groupByMonth / walletIndex', () => {
  test('groups consecutive rows by UTC month', () => {
    const rows = [{ date: Date.UTC(2026, 10, 2) / 1000 }, { date: Date.UTC(2026, 10, 1) / 1000 }, { date: Date.UTC(2026, 9, 30) / 1000 }];
    assert.deepEqual(groupByMonth(rows).map(g => [g.key, g.rows.length]), [['2026-11', 2], ['2026-10', 1]]);
  });
  test('finds a wallet by its page id, Android package or iPhone bundle id', () => {
    const index = walletIndex([{ appId: 'a', androidAppId: 'com.a', iphoneAppId: 'id1' }]);
    assert.ok(index.get('a') && index.get('com.a') && index.get('id1'));
  });
});

describe('renderReproduced', () => {
  test('draws months, wallet links as links, text from data as text, and a show-more button', async () => {
    const { renderReproduced } = await import('../../src/reproduced-wallets.mjs');
    const rows = [];
    for (let i = 0; i < 120; i++) {
      rows.push({ appId: `app${i}`, version: '1.0', platform: 'android', title: i === 0 ? '<img src=x onerror=alert(1)>' : `Wallet ${i}`, url: i === 1 ? '/mobile/w1/' : null, date: NOW - i * 3600, lastDate: NOW, verifiers: 1, against: i === 2 ? 1 : 0 });
    }
    const root = document.createElement('div');
    renderReproduced(root, { rows, summary: { wallets: 120, versions: 120, recentVersions: 120, recentWallets: 120, newest: NOW } });
    assert.equal(root.querySelectorAll('li').length, 100);
    assert.equal(root.querySelector('img'), null, 'a wallet title is text, never markup');
    assert.equal(root.querySelector('a').getAttribute('href'), '/mobile/w1/');
    assert.match(root.textContent, /120 wallets with 120 versions reproduced/);
    assert.match(root.textContent, /1 verifier could not reproduce it/);
    root.querySelector('button').click();
    assert.equal(root.querySelectorAll('li').length, 120);
    assert.equal(root.querySelector('button'), null);
  });
});
