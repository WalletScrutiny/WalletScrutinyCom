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
