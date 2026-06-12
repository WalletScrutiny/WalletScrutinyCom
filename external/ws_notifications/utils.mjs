import fs from 'fs';
import { args } from './config/env.mjs';

const WEBAPP_BASE_URL = process.env.WEBAPP_BASE_URL ?? 'https://walletscrutiny.com';

/**
 * Load a secret from a file referenced by an env var, falling back to a CLI
 * argument for local development. Throws if neither source is provided.
 */
export function loadSecret({ name, fileEnv, argName }) {
  const filePath = process.env[fileEnv];
  if (filePath) {
    return fs.readFileSync(filePath, 'utf8').trim();
  }
  const argValue = args[argName];
  if (argValue) {
    console.warn(`Warning: Using ${name} from argv (dev only)`);
    return argValue;
  }
  throw new Error(`${name} not provided`);
}

/**
 * Like loadSecret but returns undefined when the secret is not available.
 */
export function tryLoadSecret({ name, fileEnv, argName }) {
  try {
    return loadSecret({ name, fileEnv, argName });
  } catch {
    return undefined;
  }
}

export function getFirstTagValue(event, tagName, valueIfNull = '') {
  const tags = event.tags ?? [];
  return tags.find(tag => tag[0] === tagName)?.[1] ?? valueIfNull;
}

/**
 * Unix timestamp for the start of the current UTC day.
 */
export function startOfTodayUtc() {
  const now = new Date();
  return Math.floor(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 1000);
}

/**
 * Delay between kind=1 publishes (ms). Set WS_NOTIFICATIONS_PUBLISH_DELAY_MS=0 to disable.
 */
export function parsePublishDelayMs() {
  const raw = process.env.WS_NOTIFICATIONS_PUBLISH_DELAY_MS ?? '3000';
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`Invalid WS_NOTIFICATIONS_PUBLISH_DELAY_MS: ${raw}`);
  }
  return Math.floor(parsed);
}

export function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const MOBILE_WEBAPP_PLATFORMS = new Set(['android', 'iphone']);
const DESKTOP_PLATFORMS = new Set(['linux', 'windows', 'macos']);

/**
 * Map a raw Nostr platform tag to the legacy path segment used on walletscrutiny.com.
 * Desktop OSes collapse to "desktop"; android/iphone map to "mobile".
 */
export function toLegacyPlatform(platform) {
  return DESKTOP_PLATFORMS.has(platform) ? 'desktop' : platform;
}

/**
 * Map a Nostr platform tag to the canonical webapp URL path segment.
 */
export function webappPlatformPath(platform) {
  const legacyPlatform = toLegacyPlatform(platform);
  return MOBILE_WEBAPP_PLATFORMS.has(legacyPlatform) ? 'mobile' : legacyPlatform;
}

/**
 * Build the webapp URL for a verification event.
 */
export function buildVerificationUrl({ platform, appId, eventId }) {
  const base = WEBAPP_BASE_URL.replace(/\/$/, '');
  const pathPlatform = webappPlatformPath(platform);
  return `${base}/${pathPlatform}/${appId}/#verificationId=${eventId}`;
}

/**
 * Extract verification metadata from a Nostr event.
 * @returns {{ appId: string, version: string, platform: string, status: string } | null}
 */
export function parseVerificationEvent(event) {
  const appId = getFirstTagValue(event, 'i');
  const version = getFirstTagValue(event, 'version');
  const platform = getFirstTagValue(event, 'platform');
  const status = getFirstTagValue(event, 'status');

  if (!appId || !version || !platform || !status) {
    return null;
  }

  return { appId, version, platform, status };
}

/**
 * Human-readable verification status for notification headlines.
 */
export function formatVerificationStatusLabel(status) {
  switch (status) {
    case 'reproducible':
      return 'Reproducible';
    case 'not_reproducible':
      return 'Not Reproducible';
    case 'ftbfs':
      return 'Failed to Build from Source';
    case 'spam':
      return 'Spam';
    case 'notag':
      return 'No git revision';
    case 'nosource':
      return 'No source';
    case 'obfuscated':
      return 'Obfuscated';
    case 'warning':
      return 'Warning';
    default:
      return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
}

/**
 * Format a kind=1 notification message for a verification event.
 */
export function formatNotificationMessage({ appId, version, platform, status, url }) {
  const statusLabel = formatVerificationStatusLabel(status);
  return [
    `New "${statusLabel}" verification for ${appId} ${version} (${platform}):`,
    '',
    url,
  ].join('\n');
}
