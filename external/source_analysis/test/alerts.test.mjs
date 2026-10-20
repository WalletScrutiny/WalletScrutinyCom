import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { generateSecretKey, getPublicKey, nip19, nip17 } from 'nostr-tools';
import { initDatabase } from '../ddbbUtils.mjs';
import { recordMalwareAlerts, deliverAlerts, alertChannels, alertText } from '../alerts.mjs';

const quiet = { warn: () => {}, log: () => {} };
const mal = { id: 'MAL-2025-21003', severity: 'malicious', ecosystem: 'npm', name: 'fs', version: '0.0.2', summary: 'Malicious code in fs (npm)', scope: 'build', dependants: ['@starcoin/starcoin'], aliases: [] };
const cve = { id: 'GHSA-aaaa-bbbb-cccc', severity: 'critical', ecosystem: 'npm', name: 'ejs', version: '3.1.5', aliases: [] };

describe('alerts', () => {
  test('a malicious package raises one alert per release, delivered once; a failed channel is retried', async () => {
    const db = initDatabase(':memory:');
    assert.equal(recordMalwareAlerts(db, 'w.one', 'v1', [mal, cve]).length, 1, 'only MAL- findings alert');
    assert.equal(recordMalwareAlerts(db, 'w.one', 'v1', [mal]).length, 0, 'the same finding again is no new alert');
    const sent = [];
    let up = false;
    const flaky = { name: 'flaky', send: async (a) => { if (!up) throw new Error('down'); sent.push(a); } };
    assert.deepEqual(await deliverAlerts(db, { channels: [flaky], log: quiet }), { sent: 0, failed: 1, pending: 1, channels: ['flaky'] });
    up = true;
    assert.deepEqual(await deliverAlerts(db, { channels: [flaky], log: quiet }), { sent: 1, failed: 0, pending: 1, channels: ['flaky'] });
    assert.equal((await deliverAlerts(db, { channels: [flaky], log: quiet })).pending, 0, 'delivered alerts are not sent again');
    assert.match(alertText(sent[0]), /possible malware in w\.one v1\nnpm:fs@0\.0\.2 is listed as malicious: MAL-2025-21003[\s\S]*Where: build, required by @starcoin\/starcoin[\s\S]*a build dependency can still patch the app/);
  });

  test('channels come from the environment; the Nostr message is a NIP-17 DM the recipient can open', async () => {
    assert.deepEqual(alertChannels({}).map(c => c.name), []);
    const sk = generateSecretKey();
    const to = generateSecretKey();
    const env = { ALERT_WEBHOOK_URL: 'https://example.org/hook', ALERT_NOSTR_NSEC: nip19.nsecEncode(sk), ALERT_NOSTR_TO: nip19.npubEncode(getPublicKey(to)) };
    let posted = null;
    const channels = alertChannels(env, { fetchImpl: async (url, opts) => { posted = { url, body: JSON.parse(opts.body) }; return { ok: true }; } });
    assert.deepEqual(channels.map(c => c.name), ['webhook', 'nostr']);
    const db = initDatabase(':memory:');
    recordMalwareAlerts(db, 'w.one', 'v1', [mal]);
    const [a] = db.prepare('SELECT * FROM alerts').all();
    await channels[0].send(a);
    assert.equal(posted.url, 'https://example.org/hook');
    assert.equal(posted.body.advisory, 'MAL-2025-21003');
    assert.equal(posted.body.details.scope, 'build');
    // what the nostr channel sends, opened with the recipient's key
    const wrap = nip17.wrapEvent(sk, { publicKey: getPublicKey(to) }, alertText(a));
    assert.match(nip17.unwrapEvent(wrap, to).content, /^WalletScrutiny dependency check: possible malware in w\.one v1/);
  });
});
