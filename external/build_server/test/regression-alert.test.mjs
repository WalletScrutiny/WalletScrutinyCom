import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import Database from 'better-sqlite3';
import { generateSecretKey, getPublicKey, nip19, verifyEvent } from 'nostr-tools';

import {
  isRegression,
  recordRegression,
  deliverRegressionAlerts,
  alertIfRegression,
  retryPendingRegressionAlerts,
  postToBuzz,
  regressionAlertText,
  recordSkippedSigner,
  deliverSkippedSignerAlerts,
  alertSkippedSigner,
  skippedSignerAlertText
} from '../regression-alert.mjs';
import { SKIPPED_SIGNER_ALERT_APP_IDS } from '../config/config.mjs';

function base(status = 'reproducible', version = '1.0.0') {
  return { id: 'base-id', tags: [['status', status], ['version', version]] };
}

function row(overrides = {}) {
  return {
    appId: 'com.example',
    version: '2.0.0',
    platform: 'linux',
    verdict: 'ftbfs',
    baseVersion: '1.0.0',
    baseVerificationId: 'base-id',
    verificationEventId: 'new-id',
    buildScriptEventId: 'script-id',
    ...overrides
  };
}

function pendingCount(db) {
  return db.prepare('SELECT COUNT(*) AS n FROM regression_alerts WHERE notifiedAt IS NULL').get().n;
}

describe('isRegression', () => {
  test('a newer version that fails after a reproducible one', () => {
    assert.equal(isRegression(base(), '2.0.0', 'ftbfs'), true);
    assert.equal(isRegression(base(), 'v1.0.1', 'not_reproducible'), true);
  });

  test('a reproducible result is not a regression', () => {
    assert.equal(isRegression(base(), '2.0.0', 'reproducible'), false);
  });

  test('the base must be reproducible', () => {
    assert.equal(isRegression(base('ftbfs'), '2.0.0', 'ftbfs'), false);
  });

  test('a not_reproducible base alerts only on ftbfs', () => {
    assert.equal(isRegression(base('not_reproducible'), '2.0.0', 'ftbfs'), true);
    assert.equal(isRegression(base('not_reproducible'), '2.0.0', 'not_reproducible'), false);
    assert.equal(isRegression(base('not_reproducible'), '2.0.0', 'reproducible'), false);
  });

  test('a not_reproducible base skips an older version', () => {
    assert.equal(isRegression(base('not_reproducible', '6.32.0'), '6.30.0', 'ftbfs'), false);
  });

  test('an older, equal or unparseable version is skipped', () => {
    assert.equal(isRegression(base('reproducible', '2.0.0'), '1.9.9', 'ftbfs'), false);
    assert.equal(isRegression(base('reproducible', 'v2.0.0'), '2.0.0', 'ftbfs'), false);
    assert.equal(isRegression(base('reproducible', 'latest'), '2.0.0', 'ftbfs'), false);
  });
});

describe('recordRegression', () => {
  test('one row per app and version, whatever the architecture', () => {
    const db = new Database(':memory:');
    assert.equal(recordRegression(db, row({ platform: 'linux' })), true);
    assert.equal(recordRegression(db, row({ platform: 'windows', verdict: 'not_reproducible' })), false);
    assert.equal(recordRegression(db, row({ version: '2.0.1' })), true);
    assert.equal(pendingCount(db), 2);
  });
});

describe('deliverRegressionAlerts', () => {
  test('one message lists every pending regression and marks them sent', async () => {
    const db = new Database(':memory:');
    recordRegression(db, row());
    recordRegression(db, row({ appId: 'org.other', version: '3.1' }));
    const sent = [];
    assert.equal(await deliverRegressionAlerts(db, { send: async text => sent.push(text), mentionName: 'Carol' }), 2);
    assert.equal(sent.length, 1);
    assert.match(sent[0], /^🚨 \[regression\] @Carol ABS regression alert: 2 apps regressed\./);
    assert.match(sent[0], /com\.example 2\.0\.0 \(linux\): ftbfs, base 1\.0\.0/);
    assert.match(sent[0], /org\.other 3\.1/);
    assert.equal(pendingCount(db), 0);
    assert.equal(await deliverRegressionAlerts(db, { send: async () => assert.fail('nothing pending') }), 0);
  });

  test('a failed send leaves the rows pending', async () => {
    const db = new Database(':memory:');
    recordRegression(db, row());
    await assert.rejects(deliverRegressionAlerts(db, { send: async () => { throw new Error('down'); } }));
    assert.equal(pendingCount(db), 1);
  });
});

describe('alertIfRegression', () => {
  const input = { baseVerification: base(), appId: 'com.example', version: '2.0.0', platform: 'linux', verdict: 'ftbfs', verificationEventId: 'new-id', buildScriptEventId: 'script-id' };

  test('does nothing while the flag is off', async () => {
    const db = new Database(':memory:');
    await alertIfRegression(db, input, { enabled: false, deliver: async () => assert.fail('must not send') });
    assert.equal(db.prepare("SELECT name FROM sqlite_master WHERE name = 'regression_alerts'").get(), undefined);
  });

  test('skips apps outside the alert list', async () => {
    const db = new Database(':memory:');
    await alertIfRegression(db, input, { enabled: true, appIds: ['org.other'], deliver: async () => assert.fail('not in the list') });
    await alertIfRegression(db, input, { enabled: true, appIds: [], deliver: async () => 1 });
    assert.equal(pendingCount(db), 1);
  });

  test('sends a new regression once', async () => {
    const db = new Database(':memory:');
    let calls = 0;
    const deliver = async () => { calls++; return 1; };
    await alertIfRegression(db, input, { enabled: true, appIds: [], deliver });
    await alertIfRegression(db, { ...input, platform: 'windows' }, { enabled: true, appIds: [], deliver });
    assert.equal(calls, 1);
  });

  test('a delivery error is swallowed and retried next cycle', async () => {
    const db = new Database(':memory:');
    await alertIfRegression(db, input, { enabled: true, appIds: [], deliver: async () => { throw new Error('timeout'); } });
    assert.equal(pendingCount(db), 1);
    await retryPendingRegressionAlerts(db, { enabled: true, deliver: d => deliverRegressionAlerts(d, { send: async () => {} }) });
    assert.equal(pendingCount(db), 0);
  });

  test('the retry is quiet with nothing pending or the flag off', async () => {
    const db = new Database(':memory:');
    await retryPendingRegressionAlerts(db, { enabled: true, deliver: async () => assert.fail('nothing pending') });
    recordRegression(db, row());
    await retryPendingRegressionAlerts(db, { enabled: false, deliver: async () => assert.fail('flag off') });
  });
});

describe('postToBuzz', () => {
  test('posts a signed kind 9 with a NIP-98 header to /events', async () => {
    const sk = generateSecretKey();
    let request;
    const fetchImpl = async (url, opts) => { request = { url, opts }; return { ok: true }; };
    const id = await postToBuzz('hello', { secret: nip19.nsecEncode(sk), relayUrl: 'https://relay.example/', channelId: 'chan', mentionPubkey: 'ab'.repeat(32), fetchImpl });

    assert.equal(request.url, 'https://relay.example/events');
    const message = JSON.parse(request.opts.body);
    assert.equal(message.id, id);
    assert.equal(message.kind, 9);
    assert.equal(message.pubkey, getPublicKey(sk));
    assert.deepEqual(message.tags, [['h', 'chan'], ['p', 'ab'.repeat(32)]]);
    assert.equal(verifyEvent(message), true);

    const auth = JSON.parse(Buffer.from(request.opts.headers.Authorization.replace(/^Nostr /, ''), 'base64').toString());
    assert.equal(auth.kind, 27235);
    assert.equal(verifyEvent(auth), true);
    const tag = name => auth.tags.find(t => t[0] === name)?.[1];
    assert.equal(tag('u'), 'https://relay.example/events');
    assert.equal(tag('method'), 'POST');
    assert.equal(tag('payload'), createHash('sha256').update(request.opts.body).digest('hex'));
  });

  test('accepts a hex key and reports a rejected post', async () => {
    const hex = Buffer.from(generateSecretKey()).toString('hex');
    const fetchImpl = async () => ({ ok: false, status: 403, text: async () => 'not a member' });
    await assert.rejects(postToBuzz('x', { secret: hex, fetchImpl }), /HTTP 403 not a member/);
  });
});

test('regressionAlertText: singular wording for one app', () => {
  assert.match(regressionAlertText([row()], 'Carol'), /^🚨 \[regression\] @Carol ABS regression alert: an app regressed\./);
});

describe('skipped signer alerts', () => {
  const FDROID = 'b00b7be227901e1a673c365fee4f8da59d45d07ba459fc14367b8c51818404d9';
  const input = {
    appId: 'com.example',
    version: '2.0.0',
    platform: 'android',
    signer: FDROID,
    assetEventId: 'asset-id',
    fileHash: 'f'.repeat(64),
    scripts: new Map([['example', new Set(['c1899493'])]])
  };
  const skippedPending = db => db.prepare('SELECT COUNT(*) AS n FROM skipped_signer_alerts WHERE notifiedAt IS NULL').get().n;

  test('one row per app and signer, whatever the version', () => {
    const db = new Database(':memory:');
    const r = { appId: 'com.example', signer: FDROID, version: '2.0.0', platform: 'android', scripts: 'example (c1899493)' };
    assert.equal(recordSkippedSigner(db, r), true);
    assert.equal(recordSkippedSigner(db, { ...r, version: '2.1.0' }), false);
    assert.equal(recordSkippedSigner(db, { ...r, signer: 'a'.repeat(64) }), true);
  });

  test('the message is labelled and lists signer, asset and dropped scripts', async () => {
    const db = new Database(':memory:');
    const sent = [];
    await alertSkippedSigner(db, input, { enabled: true, appIds: [], deliver: d => deliverSkippedSignerAlerts(d, { send: async t => sent.push(t), mentionName: 'Carol' }) });
    assert.equal(sent.length, 1);
    assert.match(sent[0], /^🚨 \[skipped signer\] @Carol ABS skipped an APK on a signer no script was verified on\./);
    assert.ok(sent[0].includes(`com.example 2.0.0 (android): signer ${FDROID}`));
    assert.ok(sent[0].includes(`asset asset-id, file ${'f'.repeat(64)}`));
    assert.ok(sent[0].includes('scripts not tried: example (c1899493)'));
    assert.equal(skippedPending(db), 0);
    assert.match(skippedSignerAlertText([{ ...input, scripts: 'x' }, { ...input, scripts: 'y' }], 'Carol'), /ABS skipped 2 APKs/);
  });

  test('a later version on the same signer sends nothing', async () => {
    const db = new Database(':memory:');
    let calls = 0;
    const deliver = async () => { calls++; return 1; };
    await alertSkippedSigner(db, input, { enabled: true, appIds: [], deliver });
    await alertSkippedSigner(db, { ...input, version: '2.1.0' }, { enabled: true, appIds: [], deliver });
    assert.equal(calls, 1);
  });

  test('follows the regression flag and its own app list, every app by default', async () => {
    const db = new Database(':memory:');
    const fail = async () => assert.fail('must not send');
    assert.deepEqual(SKIPPED_SIGNER_ALERT_APP_IDS, []);
    await alertSkippedSigner(db, input, { enabled: false, deliver: fail });
    await alertSkippedSigner(db, input, { enabled: true, appIds: ['org.other'], deliver: fail });
    assert.equal(db.prepare("SELECT name FROM sqlite_master WHERE name = 'skipped_signer_alerts'").get(), undefined);
  });

  test('a delivery error is swallowed and retried next cycle', async () => {
    const db = new Database(':memory:');
    await alertSkippedSigner(db, input, { enabled: true, appIds: [], deliver: async () => { throw new Error('timeout'); } });
    assert.equal(skippedPending(db), 1);
    await retryPendingRegressionAlerts(db, {
      enabled: true,
      deliver: async () => assert.fail('no regression pending'),
      deliverSkipped: d => deliverSkippedSignerAlerts(d, { send: async () => {} })
    });
    assert.equal(skippedPending(db), 0);
  });

  test('a failing regression retry does not block the skipped signer retry', async () => {
    const db = new Database(':memory:');
    recordRegression(db, row());
    await alertSkippedSigner(db, input, { enabled: true, appIds: [], deliver: async () => { throw new Error('timeout'); } });
    await retryPendingRegressionAlerts(db, {
      enabled: true,
      deliver: async () => { throw new Error('down'); },
      deliverSkipped: d => deliverSkippedSignerAlerts(d, { send: async () => {} })
    });
    assert.equal(pendingCount(db), 1);
    assert.equal(skippedPending(db), 0);
  });
});
