import { spawnSync } from 'child_process';
import { createHash } from 'node:crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { appLog } from './logger.mjs';
import { WS_BOT_NOSTR_PUBKEY_HEX, BUILD_DIR, BUILD_DIR_DEBUG, shouldProcessAppId, shouldForceRebuild } from './config/config.mjs';
import { args, DEBUG, isDebugEnv } from './config/argv.mjs';
import { getEventsFromEventIds } from './nostr-utils.mjs';
import {
  getAssetFileEntries,
  getLegacyAssetLookupHash,
  isAssetBundleRegistrationKind,
  bundleHasFullVerification,
  getAssetBundleDedupKey,
} from './asset-utils.mjs';

const appInfoURL = 'https://walletscrutiny.com/assets/js/json/buildServerInfo.json';
const MAX_SCRIPTS_TO_TRY = 3;

export { args, DEBUG, isDebugEnv };

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

// Platforms whose verifications are bucketed under the legacy "desktop" label
// used by Asset Registry consumers and the wallet config files.
const DESKTOP_PLATFORMS = new Set(['linux', 'windows', 'macos']);

/**
 * Map a raw platform tag (e.g. "linux", "windows", "macos", "android",
 * "hardware") to the legacy platform name used elsewhere in the pipeline.
 * Desktop OSes collapse to "desktop"; everything else passes through.
 */
export function toLegacyPlatform(platform) {
  return DESKTOP_PLATFORMS.has(platform) ? 'desktop' : platform;
}

/**
 * Make a string safe for directory and file names on disk.
 * Nostr tags and logs should still use the original version string.
 */
export function sanitizeFilesystemSegment(value) {
  return String(value).replace(/[^a-zA-Z0-9.-]/g, '_');
}

function parseVersionPart(part) {
  const match = part.match(/^(\d+)(.*)$/);
  if (match) {
    return { numeric: parseInt(match[1], 10), suffix: match[2] };
  }
  return { numeric: 0, suffix: part };
}

/**
 * Normalize a version string into comparable numeric/suffix parts.
 * Handles prefixes like "v", "refs/tags/", and leading X.Y.Z blocks.
 */
export function parseVersionComponents(version) {
  let normalized = String(version).split('/').pop();
  normalized = normalized.replace(/^v/i, '');

  const semverMatch = normalized.match(/^(\d+\.\d+\.\d+)/);
  if (semverMatch) {
    normalized = semverMatch[1];
  }

  if (!normalized) {
    return [];
  }

  return normalized.split('.').map(parseVersionPart);
}

/** First numeric component of a version (the major release line). */
export function getVersionMajor(version) {
  const parts = parseVersionComponents(version);
  return parts.length > 0 ? parts[0].numeric : null;
}

// Helper to compare semantic versions like "1.2.3" or "1.3.5Q".
// Returns 1 when b is newer than a, -1 when a is newer, 0 when equal.
export function compareVersions(a, b) {
  const pa = parseVersionComponents(a);
  const pb = parseVersionComponents(b);

  if (pa.length === 0 || pb.length === 0) {
    return 0;
  }

  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const aPart = pa[i] || { numeric: 0, suffix: '' };
    const bPart = pb[i] || { numeric: 0, suffix: '' };

    if (aPart.numeric < bPart.numeric) return 1;
    if (aPart.numeric > bPart.numeric) return -1;

    if (aPart.suffix !== bPart.suffix) {
      return aPart.suffix.localeCompare(bPart.suffix);
    }
  }
  return 0;
}

/**
 * Among verifications already sorted by version (any order), return the highest
 * one that belongs to the same major release line as targetVersion.
 */
export function findHighestVerificationInMajor(verifications, targetVersion) {
  const targetMajor = getVersionMajor(targetVersion);
  if (targetMajor === null) {
    return null;
  }

  const inMajor = verifications.filter(
    (entry) => getVersionMajor(entry.version) === targetMajor
  );

  if (inMajor.length === 0) {
    return null;
  }

  return inMajor.reduce((best, current) => (
    compareVersions(best.version, current.version) > 0 ? current : best
  ));
}

export function groupVerificationsByAppIdAndSortByVersion(verifications) {
  const verificationsByAppId = new Map();

  for (const verification of verifications) {
    const appId = getFirstTagValue(verification, 'i');
    let version = getFirstTagValue(verification, 'version');
    version = version.replace(/^v/i, '');
    
    if (!verificationsByAppId.has(appId)) {
      verificationsByAppId.set(appId, []);
    }
    
    verificationsByAppId.get(appId).push({
      verification,
      version
    });
  }

  // For each appId, sort by version (highest first), then by created_at (descending - newest first)
  for (const [, verifications] of verificationsByAppId) {
    verifications.sort((a, b) => {
      const versionComparison = compareVersions(a.version, b.version);
      if (versionComparison !== 0) {
        return versionComparison;
      }
      return b.verification.created_at - a.verification.created_at;
    });
  }

  return verificationsByAppId;
}

/**
 * Find the first file named `fileName` anywhere under `dir`, traversing
 * subdirectories depth-first. Returns the absolute or relative path to the
 * match (depending on how `dir` was passed) or `null` if no match is found.
 *
 * Implemented with `fs.readdirSync` instead of shelling out to `find` to avoid
 * shell-injection risk from interpolated paths and to drop a child-process per
 * call. Unreadable subdirectories are skipped, mirroring `find`'s behavior of
 * continuing past per-entry errors. Symlinks are not followed.
 */
export function findFileRecursively(dir, fileName) {
  if (!fs.existsSync(dir)) return null;

  const stack = [dir];
  while (stack.length > 0) {
    const current = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      const entryPath = path.join(current, entry.name);
      if (entry.isFile() && entry.name === fileName) {
        return entryPath;
      }
      if (entry.isDirectory()) {
        stack.push(entryPath);
      }
    }
  }
  return null;
}

export async function fetchAppInfo() {
  try {
    appLog.info(`Fetching app info from ${appInfoURL}...`);
    const response = await fetch(appInfoURL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const appInfo = await response.json();
    appLog.info('App info fetched successfully');
    return appInfo;
  } catch (error) {
    appLog.error(`Error fetching app info from ${appInfoURL}:`, error);
    throw error;
  }
}

export async function calculateFileHash(file) {
  const arrayBuffer = await file.arrayBuffer();
  return createHash('sha256').update(Buffer.from(arrayBuffer)).digest('hex');
}

export function getFirstTagValue(event, tagName, valueIfNull = '') {
  return event.tags.find(tag => tag[0] === tagName)?.[1] ?? valueIfNull;
}

export function getAppIdsFromVerifications(verifications) {
  return Array.from(new Set(verifications.map(verification => getFirstTagValue(verification.verification, 'i'))));
}

export function getFileAttachmentIDsForVerificationEvent(event) {
  return (event.tags ?? [])
    .filter(tag => tag[0] === 'file-attachment')
    .map(tag => tag[1])
    .filter(id => id?.length === 64);
}

export function isBuildScriptFileEvent(fileEvent) {
  const fileName = getFirstTagValue(fileEvent, 'name');
  const extension = getFirstTagValue(fileEvent, 'extension');
  return (fileName + '.' + extension).endsWith('build.sh');
}

export async function filterVerificationsWithBuildScripts(verifications) {
  const fileAttachmentIds = [];

  // First we get fileAttachmentIds for all verifications made by
  // trusted verifiers and put them in a verificationsCandidates array
  const verificationsCandidates = [];
  for (const [sha256, verificationEvents] of verifications) {
    for (const verification of verificationEvents) {
      if (verification.pubkey === WS_BOT_NOSTR_PUBKEY_HEX) {
        continue;
      }
      if (!shouldProcessAppId(getFirstTagValue(verification, 'i'))) {
        continue;
      }
      const fileAttachmentIdsForThisVerification = getFileAttachmentIDsForVerificationEvent(verification);
      if (fileAttachmentIdsForThisVerification.length > 0) {
        fileAttachmentIdsForThisVerification.forEach(fileAttachmentId => {
          if (!fileAttachmentIds.includes(fileAttachmentId)) {
            fileAttachmentIds.push(fileAttachmentId);
          }
        });

        verificationsCandidates.push(verification);
      }
    }
  }

  appLog.debug(`verificationsCandidates: ${verificationsCandidates.length}`);
  appLog.debug(`fileAttachmentIds: ${fileAttachmentIds.length}`);

  const fileEvents = await getEventsFromEventIds(fileAttachmentIds);

  // buildShFileEvents will have key=fileAttachmentId and value=fileEvent
  // of events that are build.sh files for verificationsCandidates
  const buildShFileEvents = new Map();
  for (const fileEvent of fileEvents) {
    if (isBuildScriptFileEvent(fileEvent)) {
      buildShFileEvents.set(fileEvent.id, fileEvent);
    }
  }
  appLog.debug(`buildShFileEvents: ${buildShFileEvents.size}`);

  // We iterate over verificationsCandidates and for each verification,
  // if the verification has a fileAttachmentId that is in buildShFileEvents,
  // we add the fileEvent to verificationsWithBuildShFiles.
  const verificationsWithBuildShFiles = [];
  for (const verification of verificationsCandidates) {
    const fileAttachmentIdsForThisVerification = getFileAttachmentIDsForVerificationEvent(verification);
    for (const fileAttachmentId of fileAttachmentIdsForThisVerification) {
      if (buildShFileEvents.has(fileAttachmentId)) {
        verificationsWithBuildShFiles.push({
          verification: verification,
          buildShFileEvent: buildShFileEvents.get(fileAttachmentId)
        });
      }
    }
  }

  return verificationsWithBuildShFiles;
}

export function filterAssetsWithoutVerification(assets, verifications) {
  const assetsWithoutVerification = [];
  const seenSha256 = new Set();

  for (const asset of assets) {
    const appId = getFirstTagValue(asset, 'i');
    const version = getFirstTagValue(asset, 'version');
    const platform = getFirstTagValue(asset, 'platform');
    const forceRebuild = shouldForceRebuild(appId, version);

    const fileEntries = getAssetFileEntries(asset);
    const allHashes = fileEntries.map(entry => entry.hash);
    const isBundle = isAssetBundleRegistrationKind(asset.kind);
    const isSplitAndroid = !isBundle && platform === 'android' && allHashes.length > 1;

    const sha256 = isBundle ? getAssetBundleDedupKey(asset) : getLegacyAssetLookupHash(asset);

    const isVerified = isBundle
      ? bundleHasFullVerification(asset, verifications)
      : isSplitAndroid
        ? (verifications.has(allHashes[0]) || verifications.has(allHashes[1]))
        : (sha256 && verifications.has(sha256));

    const hasNoVerification = sha256 && !isVerified;
    const shouldInclude = (hasNoVerification || forceRebuild) && sha256 && !seenSha256.has(sha256);

    if (shouldInclude) {
      seenSha256.add(sha256);
      assetsWithoutVerification.push(asset);
    }
  }
  return assetsWithoutVerification;
}

/**
 * Returns true if the script content contains "sudo" (as a word).
 * Scripts with sudo can hang waiting for password input in non-interactive environments.
 */
export function scriptContainsSudo(fileEvent) {
  const fileContent = Buffer.from(fileEvent.content, 'base64').toString('utf8');
  return /\bsudo\b/.test(fileContent);
}

export function saveScriptFromEventMakeExecutable(fileEvent, filePath) {
  const fileContent = Buffer.from(fileEvent.content, 'base64').toString('utf8');
  fs.writeFileSync(filePath, fileContent, 'utf8');
  fs.chmodSync(filePath, 0o755);
}

/**
 * Remove a directory recursively.
 *
 * First tries a normal (non-sudo) deletion via fs.rmSync with retries.
 * If that fails and the directory is under BUILD_DIR,
 * it falls back to a privileged removal via a hardened script (sudo).
 */
export function removeDirectoryRecursive(dir) {
  if (!fs.existsSync(dir)) return;

  // Safety check: never delete arbitrary paths.
  const allowedProdBase = path.resolve(BUILD_DIR);
  const allowedDebugBase = path.resolve(BUILD_DIR_DEBUG);

  const dirResolved = path.resolve(dir);
  const isUnderProdBase = dirResolved === allowedProdBase || dirResolved.startsWith(allowedProdBase + '/');
  const isUnderDebugBase = dirResolved === allowedDebugBase || dirResolved.startsWith(allowedDebugBase + '/');

  if (!isUnderProdBase && !isUnderDebugBase) {
    appLog.error(`Refusing to delete directory outside allowed bases. dir=${dirResolved} allowedProdBase=${allowedProdBase} allowedDebugBase=${allowedDebugBase}`);
    return;
  }

  // Extra safety: avoid deleting the base directories themselves.
  if (dirResolved === allowedProdBase || dirResolved === allowedDebugBase) {
    appLog.error(`Refusing to delete base directories themselves. dir=${dirResolved}`);
    return;
  }

  // 1) First try: user-level deletion (no sudo).
  const maxRetries = 3;
  let lastErr = null;
  for (let i = 0; i < maxRetries; i++) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
      return;
    } catch (err) {
      lastErr = err;
      if ((err.code === 'ENOTEMPTY' || err.code === 'EBUSY') && i < maxRetries - 1) {
        const deadline = Date.now() + 500 * (i + 1);
        while (Date.now() < deadline) {}
        continue;
      }
      break;
    }
  }

  // 2) Fallback: privileged removal via sudo + hardened script.
  // Only allow this path-based escalation in production builds.
  if (isUnderProdBase) {
    try {
      const safeScriptPath = fileURLToPath(new URL('./scripts/build-server-safe-rmdir.sh', import.meta.url));
      const sudoResult = spawnSync('sudo', [safeScriptPath, dir], {
        stdio: ['ignore', 'pipe', 'pipe'],
        encoding: 'utf8'
      });

      if (sudoResult.status === 0) {
        appLog.info(`sudo safe-rmdir succeeded for ${dir}`);
        return;
      }

      const sudoStderr = sudoResult.stderr ? String(sudoResult.stderr).trim() : '';
      appLog.warn(`sudo safe-rmdir failed for ${dir}${sudoStderr ? ': ' + sudoStderr : ''}`);
    } catch (sudoErr) {
      appLog.warn(`sudo safe-rmdir invocation failed for ${dir}: ${String(sudoErr)}`);
    }
  }

  // If both deletion attempts failed, surface the original error.
  if (lastErr) {
    throw lastErr;
  }
}

export function createCompilationDirectory(buildDir) {
  removeDirectoryRecursive(buildDir);
  fs.mkdirSync(buildDir, { recursive: true });
}

export function getCombinationsFromAppInfo(appInfo, platform, appId) {
  let buildCombinations = [];

  const appInfoFromWS = appInfo?.[platform]?.[appId] || null;
  const buildConfigFromWS = appInfoFromWS?.builds || null;

  if (buildConfigFromWS) {
    for (const buildConfig of buildConfigFromWS) {
      const arch = buildConfig.arch || undefined;
      const types = buildConfig.types;

      if (!types) {
        buildCombinations.push({ architecture: arch, type: undefined, patterns: undefined });
        continue;
      }

      for (const [type, patterns] of Object.entries(types)) {
        buildCombinations.push({ architecture: arch, type: type, patterns: patterns });
      }
    }
    appLog.info(` *** Build combinations for ${appId} (${buildCombinations.length}): ${JSON.stringify(buildCombinations)}`);

    return buildCombinations;

  } else {
    appLog.info(` *** No build combinations found for ${appId}`);
    return null;
  }
}

/**
 * Find the architecture and type for a given file name by matching against patterns in appInfo.
 * @param {Object} appInfo - The app info object
 * @param {string} platform - The platform (e.g., 'android', 'iphone', 'desktop')
 * @param {string} appId - The application ID
 * @param {string} fileName - The file name to match
 * @returns {{ architecture: string|undefined, type: string|undefined }|null} - The matching architecture and type, or null if not found
 */
export function findArchAndTypeForFile(appInfo, platform, appId, fileName) {
  const appInfoFromWS = appInfo?.[platform]?.[appId] || null;
  const buildConfigFromWS = appInfoFromWS?.builds || null;

  if (!buildConfigFromWS) {
    appLog.debug(`No build config found for ${appId} on ${platform}`);
    return null;
  }

  // Collect all arch+type combinations
  const archTypeCombinations = [];
  for (const buildConfig of buildConfigFromWS) {
    const arch = buildConfig.arch || undefined;
    const types = buildConfig.types;

    if (!types) {
      continue;
    }

    for (const type of Object.keys(types)) {
      archTypeCombinations.push({ architecture: arch, type });
    }
  }

  // If there's only one combination, return it directly
  if (archTypeCombinations.length === 1) {
    appLog.debug(`Single arch+type combination found for ${appId} on ${platform}: ${JSON.stringify(archTypeCombinations[0])}`);
    return archTypeCombinations[0];
  }

  for (const buildConfig of buildConfigFromWS) {
    const arch = buildConfig.arch || undefined;
    const types = buildConfig.types;

    if (!types) {
      continue;
    }

    for (const [type, patterns] of Object.entries(types)) {
      for (const pattern of patterns) {
        if (matchPattern(fileName, pattern)) {
          appLog.debug(`Found match for ${fileName}: architecture=${arch}, type=${type} (pattern: ${pattern})`);
          return { architecture: arch, type };
        }
      }
    }
  }

  appLog.debug(`No match found for ${fileName} in ${appId} on ${platform}`);
  return null;
}

/**
 * Match a file name against a glob-like pattern.
 * Supports patterns like "*.tar", "*.tar.gz", "prefix*", etc.
 * @param {string} fileName - The file name to match
 * @param {string} pattern - The glob pattern
 * @returns {boolean} - True if the file name matches the pattern
 */
function matchPattern(fileName, pattern) {
  // Convert glob pattern to regex
  // Escape special regex characters except * and ?
  let regexPattern = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');

  // Anchor the pattern
  regexPattern = '^' + regexPattern + '$';

  const regex = new RegExp(regexPattern);
  return regex.test(fileName);
}

export function getScriptsToReproduce(verificationsWithBuildShFiles, appId, platform) {
  const scriptsToReproduce = verificationsWithBuildShFiles
    .filter(verification => (
      getFirstTagValue(verification.verification, 'i') === appId &&
      getFirstTagValue(verification.verification, 'platform') === platform
    ))
    .sort((a, b) => b.verification.created_at - a.verification.created_at);
  const limitedScriptsToReproduce = scriptsToReproduce.slice(0, MAX_SCRIPTS_TO_TRY);

  appLog.info(
    `     - found ${scriptsToReproduce.length} scripts to reproduce appId=${appId}, platform=${platform}; ` +
    `checking ${limitedScriptsToReproduce.length} most recent scripts (max=${MAX_SCRIPTS_TO_TRY})`
  );

  return limitedScriptsToReproduce;
}
