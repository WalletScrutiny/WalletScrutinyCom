import { assetBundleRegistrationKind } from '../src/nostr-constants.mjs';

const HASH_A = 'a'.repeat(64);
const HASH_B = 'b'.repeat(64);
const HASH_C = 'c'.repeat(64);

export { HASH_A, HASH_B, HASH_C };

export function makeEvent({
  id = 'evt',
  pubkey = 'pk',
  kind,
  tags = [],
  created_at = 0,
  content = '',
} = {}) {
  return { id, pubkey, kind, tags, created_at, content };
}

export function makeAsset({
  appId,
  platform,
  version = '1.0.0',
  hashes = [],
  fileName,
  kind,
} = {}) {
  const tags = [
    ['i', appId],
    ['platform', platform],
    ['version', version],
  ];

  if (kind === assetBundleRegistrationKind) {
    const names = Array.isArray(fileName) ? fileName : hashes.map((_, i) => `file-${i}.bin`);
    hashes.forEach((hash, i) => tags.push(['x', hash, names[i] ?? `file-${i}.bin`]));
    return makeEvent({ kind, tags });
  }

  for (const hash of hashes) {
    tags.push(['x', hash]);
  }
  if (fileName) {
    tags.push(['file-name', fileName]);
  }
  return makeEvent({ tags });
}

export function makeVerification({
  appId,
  platform,
  version,
  created_at = 0,
  id = 'v',
  extraTags = [],
} = {}) {
  const tags = [
    ['i', appId],
    ['platform', platform],
    ['version', version],
    ...extraTags,
  ];
  return makeEvent({ id, tags, created_at });
}

export function makeWallet(overrides = {}) {
  return {
    title: 'Test Wallet',
    appId: 'com.example.wallet',
    folder: 'android',
    verdict: 'sourceavailable',
    features: [],
    users: 0,
    reviews: 0,
    ...overrides,
  };
}
