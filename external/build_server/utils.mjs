import { execSync } from 'child_process';
import fs from 'fs';
import minimist from 'minimist';
import { appLog } from './logger.js';
import { WS_BOT_NOSTR_PUBKEY_HEX, shouldProcessAppId } from './config/config.mjs';
import { getEventsFromEventIds } from './nostr-utils.mjs';

const appInfoURL = 'https://walletscrutiny.com/assets/js/json/buildServerInfo.json';

export function isDebugEnv() {
  const args = minimist(process.argv.slice(2));
  return args.debug === true || args.debug === 'true';
}

// Helper to compare semantic versions like "1.2.3" or "1.3.5Q"
// "a" is the last version found in a verification
// "b" is the latest version found in the update scripts
// If b > a, there is a new version
export function compareVersions(a, b) {
  a = a.split('/').pop();
  b = b.split('/').pop();

  a = a.replace(/^v/i, '');
  b = b.replace(/^v/i, '');

  const aMatch = a.match(/^(\d+\.\d+\.\d+)/);
  const bMatch = b.match(/^(\d+\.\d+\.\d+)/);
  
  if (aMatch) {
    a = aMatch[1];
  }
  if (bMatch) {
    b = bMatch[1];
  }

  if (!a || !b) {
    return 0;
  }
  
  // Split by '.' and extract numeric parts and suffixes
  const parsePart = (part) => {
    const match = part.match(/^(\d+)(.*)$/);
    if (match) {
      return { numeric: parseInt(match[1], 10), suffix: match[2] };
    }
    return { numeric: 0, suffix: part };
  };
  
  const pa = a.split('.').map(parsePart);
  const pb = b.split('.').map(parsePart);

  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const aPart = pa[i] || { numeric: 0, suffix: '' };
    const bPart = pb[i] || { numeric: 0, suffix: '' };
    
    // Compare numeric parts first
    if (aPart.numeric < bPart.numeric) return 1;
    if (aPart.numeric > bPart.numeric) return -1;
    
    // If numeric parts are equal, compare suffixes lexicographically
    if (aPart.suffix !== bPart.suffix) {
      return aPart.suffix.localeCompare(bPart.suffix);
    }
  }
  return 0;
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

export function findFileRecursively(dir, fileName) {
  if (!fs.existsSync(dir)) return null;

  try {
    const result = execSync(`find "${dir}" -name "${fileName}" -type f | head -n 1`, { encoding: 'utf8' });
    const filePath = result.trim();
    return filePath || null;
  } catch (error) {
    return null;
  }
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
  const crypto = await import("crypto");
  const { Buffer } = await import("buffer");
  const buffer = Buffer.from(arrayBuffer);
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

export function getFirstTagValue(event, tagName, valueIfNull = '') {
  return event.tags.find(tag => tag[0] === tagName)?.[1] ?? valueIfNull;
}

export function getAppIdsFromVerifications(verifications) {
  return Array.from(new Set(verifications.map(verification => getFirstTagValue(verification.verification, 'i'))));
}

export function getFileAttachmentIDsForVerificationEvent(event) {
  return event.getMatchingTags("file-attachment").map(tag => tag[1]) || [];
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
    const fileName = getFirstTagValue(fileEvent, 'name');
    const extension = getFirstTagValue(fileEvent, 'extension');
    const scriptName = fileName + '.' + extension;
    if (scriptName.endsWith('build.sh')) {
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
  for (const asset of assets) {
    const sha256 = getFirstTagValue(asset, 'x');

    if (sha256 && !verifications.has(sha256)) {
      assetsWithoutVerification.push(asset);
    }
  }
  return assetsWithoutVerification;
}

export function saveScriptFromEventMakeExecutable(fileEvent, filePath) {
  const fileContent = Buffer.from(fileEvent.content, 'base64').toString('utf8');
  fs.writeFileSync(filePath, fileContent, 'utf8');
  fs.chmodSync(filePath, 0o755);
}

/**
 * Remove a directory recursively. On Unix tries rm -rf first; on failure falls
 * back to fs.rmSync with retries (handles ENOTEMPTY/EBUSY and permission issues).
 */
export function removeDirectoryRecursive(dir) {
  if (!fs.existsSync(dir)) return;

  if (process.platform !== 'win32') {
    try {
      const escaped = "'" + dir.replace(/'/g, "'\\''") + "'";
      execSync(`rm -rf ${escaped}`, { stdio: ['ignore', 'pipe', 'pipe'] });
      return;
    } catch (rmErr) {
      const stderr = rmErr.stderr ? String(rmErr.stderr).trim() : '';
      appLog.warn(`rm -rf failed for ${dir}${stderr ? ': ' + stderr : ''}, falling back to fs.rmSync`);
    }
  }

  const maxRetries = 3;
  for (let i = 0; i < maxRetries; i++) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
      return;
    } catch (err) {
      if ((err.code === 'ENOTEMPTY' || err.code === 'EBUSY') && i < maxRetries - 1) {
        const deadline = Date.now() + 500 * (i + 1);
        while (Date.now() < deadline) {}
      } else {
        throw err;
      }
    }
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

export function getNewerScriptToReproduce(verificationsWithBuildShFiles, appId, platform) {
  let createdAt = 0;
  let newerVerification = null;

  for (const verification of verificationsWithBuildShFiles) {
    if (
      getFirstTagValue(verification.verification, 'i') !== appId ||
      getFirstTagValue(verification.verification, 'platform') !== platform
    ) {
      continue;
    }

    if (verification.verification.created_at > createdAt) {
      createdAt = verification.verification.created_at;
      newerVerification = verification;
    }
  }

  if (!newerVerification) {
    return null;
  }

  const verificationVersion = getFirstTagValue(newerVerification.verification, 'version');
  appLog.debug(`     - getNewerScriptToReproduce - found script used to reproduce ${appId} ${verificationVersion}`);

  return newerVerification;
}