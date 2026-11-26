import { createHash } from 'node:crypto';
import { appLog } from './logger.mjs';
import { BLOSSOM_SERVER_URL } from './config/config.mjs';

// Reads the SHA-256 of an APK's signing certificate from its APK Signing Block
// (v3, else v2), the value `apksigner verify --print-certs` reports as the
// "certificate SHA-256 digest". ABS uses it to send each APK to a build script
// that was verified on an APK with the same signer, so a store re-signed build
// (F-Droid) does not run through the script for the developer-signed one.
//
// Only the zip tail and the signing block are read, so a Blossom blob costs a
// few small range requests instead of a full download. Returns null when the
// signer cannot be read: v1-only APK, zip64, not an APK, missing blob, or a
// server without range support. Callers treat null as "unknown" and keep the
// recency-only behaviour.

const EOCD_SIGNATURE = 0x06054b50;
const EOCD_MIN_SIZE = 22;
const EOCD_SEARCH_SIZE = EOCD_MIN_SIZE + 0xffff;
const SIG_BLOCK_MAGIC = 'APK Sig Block 42';
const SIG_BLOCK_FOOTER_SIZE = 24; // u64 size + 16-byte magic
const MAX_SIG_BLOCK_SIZE = 16 * 1024 * 1024;
const V3_BLOCK_ID = 0xf05368c0;
const V2_BLOCK_ID = 0x7109871a;
const REQUEST_TIMEOUT_MS = 15000;

// Length-prefixed (u32 LE) reader over a Buffer; throws on overrun.
function lengthPrefixed(buf, offset) {
  if (offset + 4 > buf.length) throw new Error('truncated length prefix');
  const len = buf.readUInt32LE(offset);
  const start = offset + 4;
  if (start + len > buf.length) throw new Error('truncated length-prefixed value');
  return { value: buf.subarray(start, start + len), next: start + len };
}

// signers -> first signer -> signed data -> digests, certificates -> first certificate
function firstCertificateOfSchemeBlock(block) {
  const signers = lengthPrefixed(block, 0).value;
  const signer = lengthPrefixed(signers, 0).value;
  const signedData = lengthPrefixed(signer, 0).value;
  const digests = lengthPrefixed(signedData, 0);
  const certificates = lengthPrefixed(signedData, digests.next).value;
  return lengthPrefixed(certificates, 0).value;
}

// Pairs inside the signing block: u64 length, u32 id, value.
export function signerFromSigningBlock(pairs) {
  const found = new Map();
  let offset = 0;
  while (offset + 8 <= pairs.length) {
    const len = Number(pairs.readBigUInt64LE(offset));
    const start = offset + 8;
    if (len < 4 || start + len > pairs.length) return null;
    const id = pairs.readUInt32LE(start);
    if (id === V3_BLOCK_ID || id === V2_BLOCK_ID) {
      found.set(id, pairs.subarray(start + 4, start + len));
    }
    offset = start + len;
  }
  for (const id of [V3_BLOCK_ID, V2_BLOCK_ID]) {
    const block = found.get(id);
    if (!block) continue;
    try {
      return createHash('sha256').update(firstCertificateOfSchemeBlock(block)).digest('hex');
    } catch {
      // Malformed scheme block; try the next scheme.
    }
  }
  return null;
}

/**
 * @param {(start: number, length: number) => Promise<Buffer|null>} readRange
 * @param {number} size total file size in bytes
 * @returns {Promise<string|null>} lowercase hex SHA-256 of the signing certificate
 */
export async function readApkSigner(readRange, size) {
  if (!Number.isSafeInteger(size) || size < EOCD_MIN_SIZE) return null;
  const tailLength = Math.min(size, EOCD_SEARCH_SIZE);
  const tail = await readRange(size - tailLength, tailLength);
  if (!tail || tail.length !== tailLength) return null;

  let eocd = -1;
  for (let i = tail.length - EOCD_MIN_SIZE; i >= 0; i--) {
    // The record must end the file: its comment runs to the last byte.
    if (tail.readUInt32LE(i) === EOCD_SIGNATURE && i + EOCD_MIN_SIZE + tail.readUInt16LE(i + 20) === tail.length) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) return null;
  const cdOffset = tail.readUInt32LE(eocd + 16);
  if (cdOffset === 0xffffffff || cdOffset < SIG_BLOCK_FOOTER_SIZE || cdOffset > size) return null;

  const footer = await readRange(cdOffset - SIG_BLOCK_FOOTER_SIZE, SIG_BLOCK_FOOTER_SIZE);
  if (!footer || footer.length !== SIG_BLOCK_FOOTER_SIZE) return null;
  if (footer.subarray(8).toString('latin1') !== SIG_BLOCK_MAGIC) return null; // v1-only

  // The size field counts everything after the leading u64 size.
  const blockSize = Number(footer.readBigUInt64LE(0));
  const blockStart = cdOffset - blockSize - 8;
  if (blockSize < SIG_BLOCK_FOOTER_SIZE || blockSize > MAX_SIG_BLOCK_SIZE || blockStart < 0) return null;
  const pairsLength = blockSize - SIG_BLOCK_FOOTER_SIZE;
  const pairs = await readRange(blockStart + 8, pairsLength);
  if (!pairs || pairs.length !== pairsLength) return null;
  return signerFromSigningBlock(pairs);
}

// 206 -> response; 404 or no range support (200) -> null, a lasting answer;
// anything else (5xx, 429, ...) throws, so the lookup is retried next cycle.
async function rangeRequest(url, range, fetchImpl) {
  const response = await fetchImpl(url, {
    headers: { Range: `bytes=${range}` },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (response.status === 206) return response;
  try { await response.body?.cancel(); } catch { /* best effort */ }
  if (response.status === 404 || response.status === 200) return null;
  throw new Error(`HTTP ${response.status}`);
}

async function fetchRange(url, start, length, fetchImpl) {
  const response = await rangeRequest(url, `${start}-${start + length - 1}`, fetchImpl);
  return response ? Buffer.from(await response.arrayBuffer()) : null;
}

async function fetchSize(url, fetchImpl) {
  const response = await rangeRequest(url, '0-0', fetchImpl);
  if (!response) return null;
  try { await response.body?.cancel(); } catch { /* best effort */ }
  const total = /\/(\d+)$/.exec(response.headers.get('content-range') ?? '')?.[1];
  return total ? Number(total) : null;
}

const signerCache = new Map();

export function clearApkSignerCache() {
  signerCache.clear();
}

/**
 * Signer of a Blossom blob, cached per hash for the life of the process
 * (blobs are content-addressed, so the answer never changes). An absent blob
 * or unreadable signer is cached as null too, so it is not re-requested every
 * cycle; a network error, timeout or server error is not cached, so the next
 * cycle tries again.
 */
export async function getBlobApkSigner(hash, { fetchImpl = fetch, baseUrl = BLOSSOM_SERVER_URL } = {}) {
  if (!/^[0-9a-f]{64}$/.test(hash ?? '')) return null;
  if (signerCache.has(hash)) return signerCache.get(hash);
  const url = `${baseUrl}/${hash}`;
  let signer = null;
  try {
    const size = await fetchSize(url, fetchImpl);
    if (size) signer = await readApkSigner((start, length) => fetchRange(url, start, length, fetchImpl), size);
  } catch (error) {
    appLog.debug(`     - could not read APK signer of blob ${hash}: ${error?.message ?? error}`);
    return null;
  }
  signerCache.set(hash, signer);
  return signer;
}

/** First readable signer among several hashes (e.g. base.apk plus its splits). */
export async function getApkSignerForHashes(hashes, options) {
  for (const hash of hashes ?? []) {
    const signer = await getBlobApkSigner(hash, options);
    if (signer) return signer;
  }
  return null;
}

/**
 * Narrows build-script candidates (newest first) to those verified on an APK
 * with the asset's signer. Candidates whose signer cannot be read stay, after
 * the matching ones; candidates with a different signer are dropped. With an
 * unknown asset signer the list is returned unchanged.
 *
 * @param {Array<{verification: object}>} candidates newest first
 * @param {string|null} assetSigner
 * @param {(verification: object) => Promise<string|null>} signerOfVerification
 * @param {number} limit
 */
export async function selectCandidatesBySigner(candidates, assetSigner, signerOfVerification, limit) {
  if (!assetSigner) return candidates.slice(0, limit);
  const matching = [];
  const unknown = [];
  let dropped = 0;
  for (const candidate of candidates) {
    // Enough same-signer scripts: older candidates cannot make the cut.
    if (matching.length >= limit) break;
    const signer = await signerOfVerification(candidate.verification);
    if (signer === assetSigner) matching.push(candidate);
    else if (!signer) unknown.push(candidate);
    else dropped++;
  }
  appLog.info(
    `     - APK signer ${assetSigner}: ${matching.length} script(s) verified on the same signer, ` +
    `${unknown.length} on an unreadable signer, ${dropped} dropped for a different signer`
  );
  if (matching.length === 0 && unknown.length === 0 && dropped > 0) {
    appLog.info(`     - no script was verified on an APK with signer ${assetSigner}; skipping this asset`);
  }
  return [...matching, ...unknown].slice(0, limit);
}

export function verificationHashes(verification) {
  return (verification?.tags ?? [])
    .filter(tag => tag[0] === 'x' && /^[0-9a-f]{64}$/.test(tag[1] ?? ''))
    .map(tag => tag[1]);
}
