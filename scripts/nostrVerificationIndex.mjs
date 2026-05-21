import fs from 'fs';
import path from 'path';

const VERIFICATION_KIND = 30301;
const CLIENT_TAG = 'WalletScrutiny.com';
const DESKTOP_PLATFORMS = new Set(['linux', 'windows', 'macos']);

function compareVersions(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = pa[i] || 0;
    const nb = pb[i] || 0;
    if (na > nb) return 1;
    if (na < nb) return -1;
  }
  return 0;
}

function getFirstTagValue(event, tagName) {
  return event.tags.find(tag => tag[0] === tagName)?.[1];
}

function isSamePlatform(mdPlatform, verificationPlatform) {
  if (mdPlatform === 'desktop') {
    return DESKTOP_PLATFORMS.has(verificationPlatform);
  }
  return mdPlatform === verificationPlatform;
}

function resolveBackupDir(projectRoot = process.cwd()) {
  const candidates = [
    path.join(projectRoot, 'backup', 'nostr-verification-events', String(VERIFICATION_KIND)),
    path.join('/backup', 'nostr-verification-events', String(VERIFICATION_KIND)),
  ];
  return candidates.find(dir => fs.existsSync(dir)) ?? candidates[0];
}

/**
 * Loads kind 30301 verification events and builds a lookup index keyed by
 * `${appId}|${mdPlatform}` with version history sorted oldest-to-newest.
 */
export function buildVerificationIndex(projectRoot = process.cwd()) {
  const kindDir = resolveBackupDir(projectRoot);
  if (!fs.existsSync(kindDir)) {
    console.warn(`Nostr verification backup not found: ${kindDir}`);
    return new Map();
  }

  const byWallet = new Map();

  for (const file of fs.readdirSync(kindDir)) {
    if (!file.endsWith('.json')) continue;

    const event = JSON.parse(fs.readFileSync(path.join(kindDir, file), 'utf8'));
    if (getFirstTagValue(event, 'client') !== CLIENT_TAG) continue;

    const appId = getFirstTagValue(event, 'i');
    const platform = getFirstTagValue(event, 'platform');
    const version = getFirstTagValue(event, 'version');
    const status = getFirstTagValue(event, 'status');
    if (!appId || !platform || !version || !status) continue;

    const mdPlatform = DESKTOP_PLATFORMS.has(platform) ? 'desktop' : platform;
    const key = `${appId}|${mdPlatform}`;
    if (!byWallet.has(key)) byWallet.set(key, []);

    byWallet.get(key).push({
      version,
      status,
      created_at: event.created_at ?? 0,
      verificationPlatform: platform,
    });
  }

  const index = new Map();

  for (const [key, entries] of byWallet) {
    const byVersion = new Map();
    for (const entry of entries) {
      const existing = byVersion.get(entry.version);
      if (!existing || entry.created_at > existing.created_at) {
        byVersion.set(entry.version, entry);
      }
    }

    const history = [...byVersion.values()]
      .sort((a, b) => compareVersions(a.version, b.version))
      .map(entry => entry.status);

    if (history.length > 0) {
      index.set(key, history);
    }
  }

  return index;
}

export function getReproducibilityHistory(index, appId, mdPlatform) {
  if (!appId || !mdPlatform || !index) return [];
  return index.get(`${appId}|${mdPlatform}`) ?? [];
}
