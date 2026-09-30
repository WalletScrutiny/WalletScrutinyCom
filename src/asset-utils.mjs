import {
  assetRegistrationKind,
  assetBundleRegistrationKind,
} from './nostr-constants.mjs';
import { isSha256Hex } from './html-utils.mjs';

export const assetRegistrationKinds = [assetRegistrationKind, assetBundleRegistrationKind];

export function isAssetRegistrationKind(kind) {
  return assetRegistrationKinds.includes(kind);
}

export function isAssetBundleRegistrationKind(kind) {
  return kind === assetBundleRegistrationKind;
}

/**
 * @param {{ tags?: string[][] }} event
 * @returns {{ hash: string, fileName: string | null }[]}
 */
export function getAssetFileEntries(event) {
  if (!event?.tags) {
    return [];
  }

  if (event.kind === assetBundleRegistrationKind) {
    return event.tags
      .filter(tag => tag[0] === 'x' && isSha256Hex(tag[1]))
      .map(tag => ({ hash: tag[1], fileName: tag[2] || null }));
  }

  const xTags = event.tags.filter(tag => tag[0] === 'x' && isSha256Hex(tag[1]));
  if (xTags.length === 0) {
    return [];
  }

  const fileName = event.tags.find(tag => tag[0] === 'file-name')?.[1] || null;
  if (xTags.length === 1) {
    return [{ hash: xTags[0][1], fileName }];
  }

  return xTags.map((tag, index) => ({
    hash: tag[1],
    fileName: index === 0 ? fileName : null,
  }));
}

const SCRIPT_BINARY_PATTERNS = {
  android: [/\.apk$/i, /\.aab$/i],
  linux: [/\.apk$/i, /\.deb$/i, /\.AppImage$/i, /\.appimage$/i, /\.tar\.gz$/i],
  windows: [/\.exe$/i, /\.msi$/i],
  macos: [/\.dmg$/i, /\.pkg$/i],
  hardware: [/\.bin$/i, /\.hex$/i],
};

/**
 * Build-server only: pick one local file for scripts that take --binary.
 * Not stored on the Nostr event; all bundle files are still downloaded to the build dir.
 */
export function pickScriptBinaryEntry(event) {
  const entries = getAssetFileEntries(event);
  if (entries.length === 0) {
    return null;
  }
  if (entries.length === 1) {
    return entries[0];
  }

  const platform = event.tags?.find(tag => tag[0] === 'platform')?.[1] || '';
  const patterns = SCRIPT_BINARY_PATTERNS[platform] || SCRIPT_BINARY_PATTERNS.linux;
  for (const pattern of patterns) {
    const match = entries.find(entry => entry.fileName && pattern.test(entry.fileName));
    if (match) {
      return match;
    }
  }

  const sorted = [...entries].sort((a, b) => {
    const nameA = a.fileName || a.hash;
    const nameB = b.fileName || b.hash;
    return nameA.localeCompare(nameB);
  });
  return sorted[0];
}

/** Stable key to dedupe bundle assets in the build-server queue. */
export function getAssetBundleDedupKey(asset) {
  const hashes = getAssetFileEntries(asset).map(entry => entry.hash).sort();
  if (hashes.length === 0) {
    return null;
  }
  return `bundle:${hashes.join(':')}`;
}

/** Legacy split-Android: second x when two 2-element x tags; else first hash. */
export function getLegacyAssetLookupHash(asset) {
  const hashes = asset.tags
    .filter(tag => tag[0] === 'x')
    .map(tag => tag[1])
    .filter(id => isSha256Hex(id));
  if (hashes.length === 0) {
    return null;
  }
  return hashes.length > 1 ? hashes[1] : hashes[0];
}

/** Hashes used as keys in assetsMap (bundle: every file hash; legacy: lookup hash). */
export function getAssetIndexHashes(asset) {
  if (asset.kind === assetBundleRegistrationKind) {
    return getAssetFileEntries(asset).map(entry => entry.hash);
  }
  const lookup = getLegacyAssetLookupHash(asset);
  return lookup ? [lookup] : [];
}

/**
 * True when a verification event lists every hash in the asset bundle.
 * @param {Map<string, unknown[]>} verificationsMap
 */
export function bundleHasFullVerification(asset, verificationsMap) {
  const required = getAssetFileEntries(asset).map(entry => entry.hash);
  if (required.length === 0) {
    return false;
  }
  const requiredSet = new Set(required);

  for (const verificationList of verificationsMap.values()) {
    for (const verification of verificationList) {
      const listed = verification.tags
        ?.filter(tag => tag[0] === 'x')
        .map(tag => tag[1])
        .filter(id => isSha256Hex(id)) ?? [];
      if (required.every(hash => listed.includes(hash))) {
        return true;
      }
    }
  }
  return false;
}

const SHA256_TOKEN_PATTERN = /^[a-fA-F0-9]{64}$/;
// BSD style: "SHA256 (base.apk) = <hash>"
const BSD_DIGEST_LINE = /^SHA-?256\s*\((.+)\)\s*=\s*([a-fA-F0-9]{64})$/i;

function cleanFileNameToken(raw) {
  if (!raw) {
    return null;
  }
  // sha256sum marks binary-mode files with a leading '*'; shells and copy/paste add quotes.
  const cleaned = raw.trim().replace(/^\*/, '').replace(/^["'`]+|["'`,;:]+$/g, '').trim();
  return cleaned || null;
}

/**
 * Parse free text typed or pasted into a hash field into asset file entries.
 *
 * Accepted per line: a bare hash, `sha256sum` output (`<hash>  <file>` or `<hash> *<file>`),
 * the reversed `<file>: <hash>` / `<file> <hash>` form, and BSD `SHA256 (<file>) = <hash>`.
 * Several hashes on one line are all taken (no file name). Hashes are lower-cased and
 * de-duplicated; the first file name seen for a hash wins.
 *
 * @param {string} text
 * @returns {{ entries: { sha256: string, fileName: string | null }[], invalidLines: string[] }}
 */
export function parseHashListInput(text) {
  const entries = [];
  const invalidLines = [];
  const seen = new Set();

  const push = (sha256, fileName) => {
    const hash = sha256.toLowerCase();
    if (seen.has(hash)) {
      return;
    }
    seen.add(hash);
    entries.push({ sha256: hash, fileName: cleanFileNameToken(fileName) });
  };

  for (const rawLine of String(text || '').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    const bsd = line.match(BSD_DIGEST_LINE);
    if (bsd) {
      push(bsd[2], bsd[1]);
      continue;
    }

    const tokens = line.split(/\s+/);
    const hashTokens = tokens.filter(token => SHA256_TOKEN_PATTERN.test(token.replace(/[,;:]+$/, '')));
    if (hashTokens.length === 0) {
      invalidLines.push(line);
      continue;
    }
    if (hashTokens.length > 1) {
      hashTokens.forEach(token => push(token.replace(/[,;:]+$/, ''), null));
      continue;
    }

    const hashIndex = tokens.findIndex(token => SHA256_TOKEN_PATTERN.test(token.replace(/[,;:]+$/, '')));
    const rest = tokens.filter((_, index) => index !== hashIndex).join(' ');
    push(tokens[hashIndex].replace(/[,;:]+$/, ''), rest);
  }

  return { entries, invalidLines };
}

/**
 * Build the `x` tags of a verification event: `["x", hash]`, plus the file name as third
 * element when one is known (same shape as kind 9401 asset bundle registrations).
 *
 * @param {string[]} hashes
 * @param {Record<string, string> | Map<string, string> | null} fileNames hash -> file name
 * @returns {string[][]}
 */
export function buildVerificationHashTags(hashes, fileNames = null) {
  const lookup = fileNames instanceof Map
    ? fileNames
    : new Map(Object.entries(fileNames || {}));
  return hashes.map(hash => {
    const fileName = lookup.get(hash) || lookup.get(hash.toLowerCase());
    const cleaned = typeof fileName === 'string' ? fileName.trim() : '';
    return cleaned ? ['x', hash, cleaned] : ['x', hash];
  });
}
