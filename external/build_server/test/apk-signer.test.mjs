import './setup.mjs';
import { describe, test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

import {
  clearApkSignerCache,
  startApkSignerCycle,
  getApkSignerForHashes,
  getBlobApkSigner,
  readApkSigner,
  scriptFamily,
  selectCandidatesBySigner,
  verificationHashes,
} from '../apk-signer.mjs';

const V2 = 0x7109871a;
const V3 = 0xf05368c0;

function u32(n) {
  const b = Buffer.alloc(4);
  b.writeUInt32LE(n);
  return b;
}

function u64(n) {
  const b = Buffer.alloc(8);
  b.writeBigUInt64LE(BigInt(n));
  return b;
}

function lp(...parts) {
  const body = Buffer.concat(parts);
  return Buffer.concat([u32(body.length), body]);
}

// One scheme block (v2 and v3 share the prefix that matters here):
// signers -> signer -> signed data -> digests, certificates -> certificate
function schemeBlock(cert) {
  const signedData = lp(lp(Buffer.from('digest')), lp(lp(cert)));
  return lp(lp(signedData, lp(Buffer.from('signatures')), lp(Buffer.from('pubkey'))));
}

function pair(id, value) {
  return Buffer.concat([u64(value.length + 4), u32(id), value]);
}

// Zip entries, signing block, an empty central directory, then the EOCD.
function makeApk(schemes) {
  const entries = Buffer.from('local file headers and data');
  let signingBlock = Buffer.alloc(0);
  if (schemes) {
    const pairs = Buffer.concat(schemes.map(([id, cert]) => pair(id, schemeBlock(cert))));
    const size = pairs.length + 24;
    signingBlock = Buffer.concat([u64(size), pairs, u64(size), Buffer.from('APK Sig Block 42', 'latin1')]);
  }
  const cdOffset = entries.length + signingBlock.length;
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt32LE(0, 12); // central directory size
  eocd.writeUInt32LE(cdOffset, 16);
  return Buffer.concat([entries, signingBlock, eocd]);
}

const sha256 = buf => createHash('sha256').update(buf).digest('hex');
const readerFor = buf => async (start, length) => buf.subarray(start, start + length);

// Minimal Blossom stand-in that honours Range requests.
function fakeBlossom(blobs) {
  const calls = [];
  const fetchImpl = async (url, { headers }) => {
    calls.push(url);
    const blob = blobs[url.split('/').pop()];
    if (!blob) return new Response('not found', { status: 404 });
    const [, from, to] = /bytes=(\d+)-(\d+)/.exec(headers.Range);
    const end = Math.min(Number(to), blob.length - 1);
    return new Response(blob.subarray(Number(from), end + 1), {
      status: 206,
      headers: { 'content-range': `bytes ${from}-${end}/${blob.length}` },
    });
  };
  return { fetchImpl, calls, baseUrl: 'https://blossom.test' };
}

describe('readApkSigner', () => {
  test('returns the SHA-256 of the v2 signing certificate', async () => {
    const cert = Buffer.from('upstream certificate DER');
    const apk = makeApk([[V2, cert]]);
    assert.equal(await readApkSigner(readerFor(apk), apk.length), sha256(cert));
  });

  test('prefers the v3 certificate over v2', async () => {
    const apk = makeApk([[V2, Buffer.from('old key')], [V3, Buffer.from('current key')]]);
    assert.equal(await readApkSigner(readerFor(apk), apk.length), sha256(Buffer.from('current key')));
  });

  test('returns null for a v1-only APK (no signing block)', async () => {
    const apk = makeApk(null);
    assert.equal(await readApkSigner(readerFor(apk), apk.length), null);
  });

  test('ignores an EOCD signature inside the zip comment', async () => {
    const cert = Buffer.from('upstream certificate DER');
    const apk = makeApk([[V2, cert]]);
    const comment = Buffer.concat([Buffer.from('x'), u32(0x06054b50), Buffer.alloc(20)]);
    apk.writeUInt16LE(comment.length, apk.length - 2);
    const withComment = Buffer.concat([apk, comment]);
    assert.equal(await readApkSigner(readerFor(withComment), withComment.length), sha256(cert));
  });

  test('returns null for data that is not a zip', async () => {
    const junk = Buffer.alloc(200, 7);
    assert.equal(await readApkSigner(readerFor(junk), junk.length), null);
  });
});

describe('getBlobApkSigner', () => {
  beforeEach(() => clearApkSignerCache());

  test('reads the signer with range requests and caches it per hash', async () => {
    const cert = Buffer.from('fdroid certificate');
    const hash = 'a'.repeat(64);
    const blossom = fakeBlossom({ [hash]: makeApk([[V2, cert]]) });
    assert.equal(await getBlobApkSigner(hash, blossom), sha256(cert));
    const callsAfterFirst = blossom.calls.length;
    assert.equal(await getBlobApkSigner(hash, blossom), sha256(cert));
    assert.equal(blossom.calls.length, callsAfterFirst);
  });

  test('a missing blob is unknown, and not requested again', async () => {
    const hash = 'b'.repeat(64);
    const blossom = fakeBlossom({});
    assert.equal(await getBlobApkSigner(hash, blossom), null);
    assert.equal(await getBlobApkSigner(hash, blossom), null);
    assert.equal(blossom.calls.length, 1);
  });

  test('a network error is not cached', async () => {
    const hash = 'e'.repeat(64);
    let calls = 0;
    const failing = { baseUrl: 'https://blossom.test', fetchImpl: async () => { calls++; throw new Error('ECONNRESET'); } };
    assert.equal(await getBlobApkSigner(hash, failing), null);
    assert.equal(await getBlobApkSigner(hash, failing), null);
    assert.equal(calls, 2);
  });

  test('a server error is not cached', async () => {
    const hash = 'f'.repeat(64);
    let calls = 0;
    const busy = { baseUrl: 'https://blossom.test', fetchImpl: async () => { calls++; return new Response('busy', { status: 503 }); } };
    assert.equal(await getBlobApkSigner(hash, busy), null);
    assert.equal(await getBlobApkSigner(hash, busy), null);
    assert.equal(calls, 2);
  });

  test('an unknown signer is asked again after a day', async () => {
    const hash = 'b'.repeat(64);
    const blossom = fakeBlossom({});
    let clock = 0;
    const options = { ...blossom, now: () => clock };
    assert.equal(await getBlobApkSigner(hash, options), null);
    clock = 23 * 3600 * 1000;
    assert.equal(await getBlobApkSigner(hash, options), null);
    assert.equal(blossom.calls.length, 1);
    clock = 25 * 3600 * 1000;
    assert.equal(await getBlobApkSigner(hash, options), null);
    assert.equal(blossom.calls.length, 2);
  });

  test('after 3 failed lookups the cycle stops asking, the next cycle asks again', async () => {
    let calls = 0;
    const failing = { baseUrl: 'https://blossom.test', fetchImpl: async () => { calls++; throw new Error('timeout'); } };
    for (const c of 'abcde') assert.equal(await getBlobApkSigner(c.repeat(64), failing), null);
    assert.equal(calls, 3);
    startApkSignerCycle();
    assert.equal(await getBlobApkSigner('f'.repeat(64), failing), null);
    assert.equal(calls, 4);
  });

  test('a cached signer is still served after the cycle stopped asking', async () => {
    const cert = Buffer.from('play certificate');
    const hash = 'c'.repeat(64);
    assert.equal(await getBlobApkSigner(hash, fakeBlossom({ [hash]: makeApk([[V2, cert]]) })), sha256(cert));
    const failing = { baseUrl: 'https://blossom.test', fetchImpl: async () => { throw new Error('timeout'); } };
    for (const c of 'def') await getBlobApkSigner(c.repeat(64), failing);
    assert.equal(await getBlobApkSigner(hash, failing), sha256(cert));
  });

  test('getApkSignerForHashes returns the first readable signer', async () => {
    const cert = Buffer.from('play certificate');
    const present = 'c'.repeat(64);
    const blossom = fakeBlossom({ [present]: makeApk([[V2, cert]]) });
    assert.equal(await getApkSignerForHashes(['d'.repeat(64), present], blossom), sha256(cert));
  });
});

describe('selectCandidatesBySigner', () => {
  const candidate = (id, hash, script = id) => ({
    verification: { id, tags: [['x', hash]] },
    buildShFileEvent: { id: `file-${id}`, tags: [['name', `${script}_build`], ['extension', 'sh']] },
  });
  const signers = { ['1'.repeat(64)]: 'upstream', ['2'.repeat(64)]: 'fdroid', ['3'.repeat(64)]: 'github' };
  const signerOf = async verification => signers[verificationHashes(verification)[0]] ?? null;
  const ids = result => result.map(c => c.verification.id);

  // Newest first, as getScriptsToReproduce returns them.
  const candidates = [
    candidate('play-new', '1'.repeat(64)),
    candidate('github-new', '9'.repeat(64)), // APK not on Blossom
    candidate('play-old', '1'.repeat(64)),
    candidate('fdroid-old', '2'.repeat(64)),
  ];

  test('same-signer scripts first, then unknown ones, drops other signers', async () => {
    const result = await selectCandidatesBySigner(candidates, 'fdroid', signerOf, 3);
    assert.deepEqual(ids(result), ['fdroid-old', 'github-new']);
  });

  test('newer unknown scripts cannot push a matching one past the limit', async () => {
    const many = [
      candidate('u1', '9'.repeat(64)),
      candidate('u2', '8'.repeat(64)),
      candidate('u3', '7'.repeat(64)),
      candidate('fdroid-old', '2'.repeat(64)),
    ];
    assert.deepEqual(ids(await selectCandidatesBySigner(many, 'fdroid', signerOf, 3)), ['fdroid-old', 'u1', 'u2']);
  });

  test('applies the limit', async () => {
    const result = await selectCandidatesBySigner(candidates, 'upstream', signerOf, 2);
    assert.deepEqual(ids(result), ['play-new', 'play-old']);
  });

  test('an unknown asset signer keeps the recency-only order', async () => {
    const result = await selectCandidatesBySigner(candidates, null, signerOf, 3);
    assert.deepEqual(ids(result), ['play-new', 'github-new', 'play-old']);
  });

  // Bitcoin Keeper: one script builds the Play and the GitHub APK, which have
  // different signers; its newest version was only verified on one of them.
  const keeper = [
    candidate('v0.3.0', '1'.repeat(64), 'bitcoinkeeper-v0.3.0'),
    candidate('v0.2.2', '3'.repeat(64), 'bitcoinkeeper-v0.2.2'),
    candidate('v0.2.1', '1'.repeat(64), 'bitcoinkeeper-v0.2.1'),
    candidate('unversioned', '1'.repeat(64), 'bitcoinkeeper'),
  ];

  test('a newer version of a script verified on this signer comes first', async () => {
    const result = await selectCandidatesBySigner(keeper, 'github', signerOf, 3);
    assert.deepEqual(ids(result), ['v0.3.0', 'v0.2.2', 'v0.2.1']);
  });

  test('a script with no version verified on this signer is dropped, whatever its version', async () => {
    const result = await selectCandidatesBySigner(keeper, 'fdroid', signerOf, 3);
    assert.deepEqual(ids(result), []);
  });

  test('onSkip gets the dropped scripts and their signers when nothing is left', async () => {
    const skipped = [];
    await selectCandidatesBySigner(keeper, 'fdroid', signerOf, 3, dropped => { skipped.push(dropped); });
    assert.equal(skipped.length, 1);
    assert.deepEqual([...skipped[0]].map(([name, s]) => [name, [...s].sort()]), [['bitcoinkeeper', ['github', 'upstream']]]);
  });

  test('onSkip is not called while a script is kept', async () => {
    const fail = () => assert.fail('a script was kept');
    await selectCandidatesBySigner(candidates, 'fdroid', signerOf, 3, fail);
    await selectCandidatesBySigner(keeper, null, signerOf, 3, fail);
    await selectCandidatesBySigner([], 'fdroid', signerOf, 3, fail);
  });

  test('a newest version on an unreadable APK is tried first when an older one matches', async () => {
    const gem = [
      candidate('new', '9'.repeat(64), 'gemwallet-v0.3.0'),
      candidate('old', '1'.repeat(64), 'gemwallet-v0.2.26'),
    ];
    const result = await selectCandidatesBySigner(gem, 'upstream', signerOf, 3);
    assert.deepEqual(ids(result), ['new', 'old']);
  });

  test('an unreadable verification of a script known on another signer is dropped', async () => {
    // Unstoppable: an F-Droid APK must not reach the developer-signed script
    // through one of its verifications whose APK is not on Blossom.
    const unstoppable = [
      candidate('wallet-unknown', '9'.repeat(64), 'unstoppablewallet-v0.6.6'),
      candidate('wallet', '1'.repeat(64), 'unstoppablewallet-v0.6.6'),
      candidate('fdroid', '8'.repeat(64), 'unstoppablefdroid'),
    ];
    const result = await selectCandidatesBySigner(unstoppable, 'fdroid', signerOf, 3);
    assert.deepEqual(ids(result), ['fdroid']);
  });

  test('a script file attached to several verifications is kept once', async () => {
    const shared = (id, hash) => ({ ...candidate(id, hash, 'envoy-v0.5.1'), buildShFileEvent: { id: 'same-file', tags: [['name', 'envoy-v0.5.1_build']] } });
    const envoy = [
      shared('a', '1'.repeat(64)),
      shared('b', '3'.repeat(64)),
      candidate('old', '1'.repeat(64), 'envoy-v0.4.0'),
    ];
    assert.deepEqual(ids(await selectCandidatesBySigner(envoy, 'github', signerOf, 3)), ['a', 'old']);
  });

  test('different script names stay separate', async () => {
    const green = [
      candidate('fdroid', '2'.repeat(64), 'greenfdroid-v0.2.7'),
      candidate('play', '1'.repeat(64), 'greenandroid-v0.4.4'),
    ];
    assert.deepEqual(ids(await selectCandidatesBySigner(green, 'upstream', signerOf, 3)), ['play']);
    assert.deepEqual(ids(await selectCandidatesBySigner(green, 'fdroid', signerOf, 3)), ['fdroid']);
  });
});

describe('scriptFamily', () => {
  const named = name => ({ buildShFileEvent: { id: 'f', tags: [['name', name]] } });

  test('drops the version and the _build suffix', () => {
    assert.equal(scriptFamily(named('bitcoinkeeper-v0.3.0_build')), 'bitcoinkeeper');
    assert.equal(scriptFamily(named('bitcoinkeeper_build')), 'bitcoinkeeper');
    assert.equal(scriptFamily(named('unstoppablewallet-v0.5.2_build')), 'unstoppablewallet');
    assert.equal(scriptFamily(named('io.horizontalsystems.bankwallet_fdroid_build')), 'io.horizontalsystems.bankwallet_fdroid');
  });

  test('a nameless script is its own family', () => {
    assert.equal(scriptFamily({ buildShFileEvent: { id: 'abc', tags: [] } }), 'event:abc');
  });
});
