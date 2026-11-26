import './setup.mjs';
import { describe, test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

import {
  clearApkSignerCache,
  getApkSignerForHashes,
  getBlobApkSigner,
  readApkSigner,
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

  test('getApkSignerForHashes returns the first readable signer', async () => {
    const cert = Buffer.from('play certificate');
    const present = 'c'.repeat(64);
    const blossom = fakeBlossom({ [present]: makeApk([[V2, cert]]) });
    assert.equal(await getApkSignerForHashes(['d'.repeat(64), present], blossom), sha256(cert));
  });
});

describe('selectCandidatesBySigner', () => {
  const candidate = (id, hash) => ({ verification: { id, tags: [['x', hash]] } });
  const signers = { ['1'.repeat(64)]: 'upstream', ['2'.repeat(64)]: 'fdroid' };
  const signerOf = async verification => signers[verificationHashes(verification)[0]] ?? null;

  // Newest first, as getScriptsToReproduce returns them.
  const candidates = [
    candidate('play-new', '1'.repeat(64)),
    candidate('github-new', '9'.repeat(64)), // APK not on Blossom
    candidate('play-old', '1'.repeat(64)),
    candidate('fdroid-old', '2'.repeat(64)),
  ];

  test('puts same-signer scripts first, keeps unknown ones, drops other signers', async () => {
    const result = await selectCandidatesBySigner(candidates, 'fdroid', signerOf, 3);
    assert.deepEqual(result.map(c => c.verification.id), ['fdroid-old', 'github-new']);
  });

  test('keeps recency order among same-signer scripts and applies the limit', async () => {
    const result = await selectCandidatesBySigner(candidates, 'upstream', signerOf, 2);
    assert.deepEqual(result.map(c => c.verification.id), ['play-new', 'play-old']);
  });

  test('stops looking up signers once the limit of same-signer scripts is reached', async () => {
    const looked = [];
    const counting = async verification => { looked.push(verification.id); return signerOf(verification); };
    const result = await selectCandidatesBySigner(candidates, 'upstream', counting, 1);
    assert.deepEqual(result.map(c => c.verification.id), ['play-new']);
    assert.deepEqual(looked, ['play-new']);
  });

  test('an unknown asset signer keeps the recency-only order', async () => {
    const result = await selectCandidatesBySigner(candidates, null, signerOf, 3);
    assert.deepEqual(result.map(c => c.verification.id), ['play-new', 'github-new', 'play-old']);
  });
});
