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
//
// Key rotation is not followed: the v3.1 block (0x1b93ad61) is not read, and
// the proof-of-rotation lineage in a v3 block is ignored. An app that rotated
// its key can therefore show up as a new signer; its asset is then skipped
// and the skipped-signer alert reports it.

const EOCD_SIGNATURE = 0x06054b50;
const EOCD_MIN_SIZE = 22;
const EOCD_SEARCH_SIZE = EOCD_MIN_SIZE + 0xffff;
const SIG_BLOCK_MAGIC = 'APK Sig Block 42';
const SIG_BLOCK_FOOTER_SIZE = 24; // u64 size + 16-byte magic
const MAX_SIG_BLOCK_SIZE = 16 * 1024 * 1024;
const V3_BLOCK_ID = 0xf05368c0;
const V2_BLOCK_ID = 0x7109871a;
const REQUEST_TIMEOUT_MS = 15000;
// After this many failed lookups (network error, timeout, 5xx) in one cycle,
// the rest of the cycle treats every uncached signer as unknown, so a slow
// Blossom server cannot stall the cycle at 15 s per request.
const MAX_FAILED_LOOKUPS_PER_CYCLE = 3;
// An absent blob or unreadable signer is asked again after this long, in case
// the APK was uploaded since.
const UNKNOWN_SIGNER_RECHECK_MS = 24 * 60 * 60 * 1000;

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

// hash -> { signer, checkedAt }
const signerCache = new Map();
let failedLookups = 0;
// Lookups that failed or were not made because of the cap, since process
// start. A null signer then means "not known this cycle", not "unreadable",
// so callers compare this before and after and retry the asset next cycle.
let missedLookups = 0;

export function clearApkSignerCache() {
  signerCache.clear();
  failedLookups = 0;
  missedLookups = 0;
}

export function missedApkSignerLookups() {
  return missedLookups;
}

/** Called at the start of each cycle: lookups that failed may be tried again. */
export function startApkSignerCycle() {
  failedLookups = 0;
}

/**
 * Signer of a Blossom blob, cached per hash for the life of the process
 * (blobs are content-addressed, so a signer never changes). An absent blob or
 * unreadable signer is cached as null for UNKNOWN_SIGNER_RECHECK_MS, so it is
 * not re-requested every cycle but is found once the APK is uploaded. A
 * network error, timeout or server error is not cached, so the next cycle
 * tries again; after MAX_FAILED_LOOKUPS_PER_CYCLE of them the rest of the
 * cycle makes no requests. Both cases count in missedApkSignerLookups().
 */
export async function getBlobApkSigner(hash, { fetchImpl = fetch, baseUrl = BLOSSOM_SERVER_URL, now = Date.now } = {}) {
  if (!/^[0-9a-f]{64}$/.test(hash ?? '')) return null;
  const cached = signerCache.get(hash);
  if (cached && (cached.signer || now() - cached.checkedAt < UNKNOWN_SIGNER_RECHECK_MS)) return cached.signer;
  if (failedLookups >= MAX_FAILED_LOOKUPS_PER_CYCLE) {
    missedLookups++;
    return null;
  }
  const url = `${baseUrl}/${hash}`;
  let signer = null;
  try {
    const size = await fetchSize(url, fetchImpl);
    if (size) signer = await readApkSigner((start, length) => fetchRange(url, start, length, fetchImpl), size);
  } catch (error) {
    failedLookups++;
    missedLookups++;
    appLog.debug(`     - could not read APK signer of blob ${hash}: ${error?.message ?? error}`);
    if (failedLookups === MAX_FAILED_LOOKUPS_PER_CYCLE) {
      appLog.info(`     - ${failedLookups} APK signer lookups failed; signers not cached yet are unknown until the next cycle`);
    }
    return null;
  }
  signerCache.set(hash, { signer, checkedAt: now() });
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

// Versions of one script share a name: "bitcoinkeeper-v0.3.0_build" and
// "bitcoinkeeper_build" are both "bitcoinkeeper". Different names
// (greenandroid, greenfdroid) are different scripts.
export function scriptFamily(candidate) {
  const name = candidate.buildShFileEvent?.tags?.find(tag => tag[0] === 'name')?.[1];
  if (!name) return `event:${candidate.buildShFileEvent?.id ?? candidate.verification?.id}`;
  return name.replace(/_build$/, '').replace(/-v\d[\w.-]*$/, '');
}

/**
 * Narrows build-script candidates (newest first) to the scripts that fit the
 * asset's signer, keeping their recency order. A script fits when it, or any
 * other version of it, was verified on an APK with that signer: one script
 * often builds both the Play and the GitHub APK, which can carry different
 * signers, and a new version is usually verified on only one of them. A script
 * that was never verified on a readable APK stays as unknown. Scripts whose
 * versions were only verified on other signers are dropped, and a script file
 * attached to several verifications is kept once. Scripts known on the asset's
 * signer come first, then unknown ones, each group newest first, so the limit
 * cannot push out a matching script in favour of newer unknown ones. With an
 * unknown asset signer the list is returned unchanged. When every script was dropped, `onSkip` gets
 * a map of the dropped script names to the signers they were verified on.
 *
 * @param {Array<{verification: object, buildShFileEvent?: object}>} candidates newest first
 * @param {string|null} assetSigner
 * @param {(verification: object) => Promise<string|null>} signerOfVerification
 * @param {number} limit
 * @param {(dropped: Map<string, Set<string>>) => Promise<void>|void} [onSkip]
 */
export async function selectCandidatesBySigner(candidates, assetSigner, signerOfVerification, limit, onSkip) {
  if (!assetSigner) return candidates.slice(0, limit);
  const signersByFamily = new Map();
  for (const candidate of candidates) {
    const family = scriptFamily(candidate);
    if (!signersByFamily.has(family)) signersByFamily.set(family, new Set());
    const signer = await signerOfVerification(candidate.verification);
    if (signer) signersByFamily.get(family).add(signer);
  }
  const matching = [];
  const unknown = [];
  const dropped = new Set();
  const seenScripts = new Set();
  for (const candidate of candidates) {
    // One script file is often attached to several verifications. ABS skips a
    // script that already failed, so a repeat would only waste a slot.
    const scriptId = candidate.buildShFileEvent?.id;
    if (scriptId && seenScripts.has(scriptId)) continue;
    if (scriptId) seenScripts.add(scriptId);
    const family = scriptFamily(candidate);
    const signers = signersByFamily.get(family);
    if (signers.has(assetSigner)) matching.push(candidate);
    else if (signers.size === 0) unknown.push(candidate);
    else dropped.add(family);
  }
  const kept = [...matching, ...unknown];
  const selected = kept.slice(0, limit);
  appLog.info(
    `     - APK signer ${assetSigner}: trying ${selected.map(scriptFamily).join(', ') || 'no script'}` +
    (unknown.length ? ` (${unknown.length} verification(s) on an unreadable signer)` : '') +
    (dropped.size ? `; dropped for a different signer: ${[...dropped].join(', ')}` : '')
  );
  if (kept.length === 0 && dropped.size > 0) {
    appLog.info(`     - no script was verified on an APK with signer ${assetSigner}; skipping this asset`);
    if (onSkip) await onSkip(new Map([...dropped].map(family => [family, signersByFamily.get(family)])));
  }
  return selected;
}

export function verificationHashes(verification) {
  return (verification?.tags ?? [])
    .filter(tag => tag[0] === 'x' && /^[0-9a-f]{64}$/.test(tag[1] ?? ''))
    .map(tag => tag[1]);
}
