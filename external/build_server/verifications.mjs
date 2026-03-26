import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import PQueue from 'p-queue';
import { getNdk, getAllAssetsForTheseAppIds, getEventsFromEventIds, createVerification, uploadBlobToBlossomServer } from './nostr-utils.mjs';
import {
  filterVerificationsWithBuildScripts,
  getAppIdsFromVerifications,
  filterAssetsWithoutVerification,
  getFirstTagValue,
  saveScriptFromEventMakeExecutable,
  scriptContainsSudo,
  createCompilationDirectory,
  removeDirectoryRecursive,
  findFileRecursively,
  getCombinationsFromAppInfo,
  getFileAttachmentIDsForVerificationEvent,
  getNewerScriptToReproduce,
  findArchAndTypeForFile
} from './utils.mjs';
import yaml from 'js-yaml';
import { appLog, verificationsLog } from './logger.js';
import { BLOSSOM_SERVER_URL, QUEUE_TIMEOUT_HOURS, QUEUE_CONCURRENCY, QUEUE_DEBUG_TIMEOUT_MINUTES, QUEUE_STATUS_INTERVAL_MINUTES } from './config/config.mjs';
import { BUILD_DIR_PREFIX } from './index.mjs';
import { open as openZip } from 'yauzl';

// Tracks appIds of currently running jobs. Used by AppIdAwareQueue to prefer jobs from different apps.
const runningAppIds = new Set();

/**
 * Custom queue that ensures at most one job per appId runs at a time.
 * When a slot becomes free, it only picks jobs whose appId is not in runningAppIds.
 * If all queued jobs are from apps already running, the slot stays free until one of those apps finishes.
 */
class AppIdAwareQueue {
  #queue = [];

  enqueue(run, options) {
    const { priority = 0, id, appId } = options ?? {};
    const element = { priority, id, run, appId };
    if (this.#queue.length === 0 || this.#queue[this.#queue.length - 1].priority >= priority) {
      this.#queue.push(element);
      return;
    }
    const index = this.#lowerBound(element);
    this.#queue.splice(index, 0, element);
  }

  #lowerBound(value) {
    let first = 0;
    let count = this.#queue.length;
    while (count > 0) {
      const step = Math.trunc(count / 2);
      const it = first + step;
      if (this.#queue[it].priority >= value.priority) {
        first = it + 1;
        count -= step + 1;
      } else {
        count = step;
      }
    }
    return first;
  }

  setPriority(id, priority) {
    const index = this.#queue.findIndex((el) => el.id === id);
    if (index === -1) {
      throw new ReferenceError(`No promise function with the id "${id}" exists in the queue.`);
    }
    const [item] = this.#queue.splice(index, 1);
    this.enqueue(item.run, { priority, id, appId: item.appId });
  }

  dequeue() {
    const idx = this.#queue.findIndex((el) => !el.appId || !runningAppIds.has(el.appId));
    if (idx < 0) {
      const running = [...runningAppIds].join(', ');
      appLog.info(`[QUEUE_INFO] Slot deferred: all ${this.#queue.length} queued jobs are from running apps (${running}). Retrying in 5s.`);
      return () => new Promise((resolve) => setTimeout(resolve, 5000));
    }
    const [item] = this.#queue.splice(idx, 1);
    appLog.info(`[QUEUE_INFO] Picked job for appId=${item.appId ?? 'n/a'} from queue (${this.#queue.length} remaining).`);
    return item.run;
  }

  filter(options) {
    return this.#queue.filter((el) => el.priority === options.priority).map((el) => el.run);
  }

  get size() {
    return this.#queue.length;
  }
}

export const queue = new PQueue({
  concurrency: QUEUE_CONCURRENCY,
  timeout: QUEUE_TIMEOUT_HOURS * 60 * 60 * 1000,
  throwOnTimeout: true,
  queueClass: AppIdAwareQueue
});
queue.on('active', logQueueInfo);
queue.on('next', logQueueInfo);
queue.on('error', error => {
  appLog.error(error);
  // TODO: We can potentially send a Nostr notification to the user to inform them about the error
});
function logQueueInfo() {
  appLog.info(`[QUEUE_INFO] Waiting (${queue.size})  Running (${queue.pending}): ${JSON.stringify(queue.runningTasks)}`);
}

setInterval(() => {
  appLog.info(`[QUEUE_INFO] Waiting (${queue.size})  Running (${queue.pending}): ${JSON.stringify(queue.runningTasks)}`);
}, QUEUE_STATUS_INTERVAL_MINUTES * 60 * 1000);

/**
 * Downloads a file from the Blossom server by its hash.
 * Ensures proper cleanup of HTTP connections to avoid file descriptor leaks.
 * @param {string} fileHash - The SHA256 hash of the file to download
 * @param {string} destinationPath - The local path where the file should be saved
 * @returns {Promise<{success: boolean, error?: string}>} - Result of the download operation
 */
export async function downloadFileFromBlossom(fileHash, destinationPath) {
  const blossomFileURL = BLOSSOM_SERVER_URL + '/' + fileHash;
  let response;

  try {
    response = await fetch(blossomFileURL);
  } catch (fetchError) {
    return { success: false, error: `Fetch failed: ${fetchError?.message ?? fetchError}` };
  }

  try {
    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}: file not found` };
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(destinationPath, buffer);
    return { success: true };
  } finally {
    // Ensure response body is consumed to release the HTTP connection
    if (response && response.body) {
      try {
        const reader = response.body.getReader();
        while (true) {
          const { done } = await reader.read();
          if (done) break;
        }
      } catch {
        // Ignore errors during cleanup
      }
    }
  }
}

async function zipContainsBaseApk(zipFilePath) {
  return new Promise((resolve, reject) => {
    openZip(zipFilePath, { lazyEntries: true }, (err, zipFile) => {
      if (err) {
        reject(err);
        return;
      }

      let resolved = false;

      const finish = (value) => {
        if (resolved) return;
        resolved = true;
        try {
          zipFile.close();
        } catch {
          // Ignore close errors; we only care about the boolean result.
        }
        resolve(value);
      };

      zipFile.on('entry', (entry) => {
        const fileName = entry.fileName;
        const baseName = path.posix.basename(fileName);
        if (baseName === 'base.apk') {
          finish(true);
          return;
        }
        zipFile.readEntry();
      });

      zipFile.on('end', () => finish(false));
      zipFile.on('error', (zipErr) => reject(zipErr));

      zipFile.readEntry();
    });
  });
}

export async function verifyAssetsFromRegistry(verifications, appInfo, githubToken) {
  appLog.debug(`# verifications: ${verifications.size}`);
  const verificationsWithBuildShFiles = await filterVerificationsWithBuildScripts(verifications);
  appLog.debug(`# verificationsWithBuildShFiles: ${Object.keys(verificationsWithBuildShFiles).length}`);

  const appIds = getAppIdsFromVerifications(verificationsWithBuildShFiles);
  appLog.debug(`appIds: ${appIds}`);

  const assets = await getAllAssetsForTheseAppIds(appIds);
  appLog.debug(`# assets for appIds with build scripts: ${Object.keys(assets).length}`);

  const assetsWithoutVerification = filterAssetsWithoutVerification(assets, verifications);
  appLog.debug(`# assetsWithoutVerification: ${Object.keys(assetsWithoutVerification).length}`);

  for (const asset of assetsWithoutVerification) {
    const appId = getFirstTagValue(asset, 'i');
    const platform = getFirstTagValue(asset, 'platform');
    const version = getFirstTagValue(asset, 'version');
    const fileName = getFirstTagValue(asset, 'file-name') ?? null;
    if (!fileName && platform !== 'android') {
      appLog.debug(`   no file name found for appId=${appId}, version=${version}, and platform=${platform}. Skipping...`);
      continue;
    }
    const sanitizedFileName = fileName ? fileName.replace(/\s+/g, '-') : null;
    const legacyPlatform = ['linux', 'windows', 'macos'].includes(platform) ? 'desktop' : platform;

    appLog.debug(`   searching for script to try to reproduce appId=${appId}, version=${version}, and platform=${platform}...`);

    const verification = getNewerScriptToReproduce(verificationsWithBuildShFiles, appId, platform);
    if (!verification) {
      appLog.debug(`   no script to reproduce appId=${appId}, version=${version}, and platform=${platform} found`);
      continue;
    }

    const fileHash = getFirstTagValue(asset, 'x');
    appLog.debug(`     - file hash found: ${fileHash}`);

    // For split APK assets (Android zip uploads), x[0] is the zip transport hash
    // and x[1] is the base APK hash. Verifications are indexed by the APK hash
    // (matching the site-side MR !1405 asset lookup key), so use x[1] when present.
    const allHashes = asset.tags.filter(tag => tag[0] === 'x').map(tag => tag[1]).filter(id => id.length === 64);
    const verificationHash = (platform === 'android' && allHashes.length > 1)
      ? allHashes[1]
      : fileHash;
    appLog.debug(`     - verification hash: ${verificationHash}`);

    let archAndType = null;
    if (legacyPlatform === 'android') {
      archAndType = { architecture: null, type: null };
    } else {
      archAndType = findArchAndTypeForFile(appInfo, legacyPlatform, appId, fileName);

      if (!archAndType) {
        appLog.debug(`   no arch and type found for appId=${appId}, version=${version}, and platform=${legacyPlatform} and fileName=${fileName}. Do you need to add the file patterns to the builds array in the .md file?`);
        continue;
      }
    }
    const { architecture, type } = archAndType;

    if (scriptContainsSudo(verification.buildShFileEvent)) {
      appLog.info(`     - the script contains sudo (would hang waiting for password if run in the host machine)`);
    }

    const downloadedFileName = sanitizedFileName ?? `${appId}_${version}_${fileHash}_downloaded.apk`;

    await addJobToQueue({
      verification: verification.verification,
      appId,
      platform,
      newWalletVersion: version,
      architecture,
      type,
      fileEventIdsForSHFiles: [verification.buildShFileEvent.id],
      fileHash,
      verificationHash,
      jobType: 'asset',
      buildShFileEvent: verification.buildShFileEvent,
      downloadedFileName,
      githubToken
    });
  }
}

export async function processNewReleaseVerification(verification, newWalletVersion, appInfo, wsBotVerifications, githubToken) {
  try {
    // Capture ndk instance at the start to ensure it's available in async callbacks
    const ndkInstance = getNdk();
    if (!ndkInstance) {
      throw new Error('NDK instance is not initialized');
    }

    const appId = getFirstTagValue(verification, 'i');
    const version = getFirstTagValue(verification, 'version');
    const platform = getFirstTagValue(verification, 'platform');
    const legacyPlatform = ['linux', 'windows', 'macos'].includes(platform) ? 'desktop' : platform;

    // Get file attachment IDs
    const fileAttachmentIds = getFileAttachmentIDsForVerificationEvent(verification);

    if (fileAttachmentIds.length === 0) {
      appLog.info(`${appId} | ${version} | ${platform} | No attachments, so no verification can be tried`);
      return;
    }

    // Get file events
    const fileEvents = await getEventsFromEventIds(fileAttachmentIds);

    let fileEventIdsForSHFiles = [];

    let anyFileTried = false;

    for (const fileEvent of fileEvents) {
      const fileName = getFirstTagValue(fileEvent, 'name');
      const extension = getFirstTagValue(fileEvent, 'extension');

      const scriptName = fileName + '.' + extension;
      if (!scriptName.endsWith('build.sh')) {
        continue;
      }

      anyFileTried = true;

      fileEventIdsForSHFiles.push(fileEvent.id);

      const buildCombinations = getCombinationsFromAppInfo(appInfo, legacyPlatform, appId);
      if (!buildCombinations) {
        continue;
      }

      for (const { architecture, type } of buildCombinations) {
        const safeAppId = appId.replace(/[^a-zA-Z0-9.-]/g, '_');
        const safeVersion = newWalletVersion.replace(/[^a-zA-Z0-9.-]/g, '_');
        const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
        const outputFileName = `${safeAppId}_${safeVersion}_${safeFileName}.sh`;

        // Check if this combination is already in the WS Bot verifications
        const wsBotVerification = wsBotVerifications.find(v => {
          const content = v.content;
          const contentJson = JSON.parse(content);
          const contentDescription = contentJson.description;

          return (
            appId === getFirstTagValue(v, 'i') &&
            newWalletVersion === getFirstTagValue(v, 'version') &&
            platform === getFirstTagValue(v, 'platform') &&
            contentDescription.includes(architecture) &&
            contentDescription.includes(type)
          );
        });

        if (wsBotVerification) {
          appLog.info(`${appId} | ${newWalletVersion} | ${platform} | ${architecture} | ${type} | WS Bot verification already found for this combination: ${wsBotVerification.id}`);
          continue;
        } else {
          appLog.info(`${appId} | ${newWalletVersion} | ${platform} | ${architecture} | ${type} | sh script found`);
        }

        if (scriptContainsSudo(fileEvent)) {
          appLog.info(`${appId} | ${newWalletVersion} | ${platform} | ${architecture} | ${type} | the script contains sudo (would hang waiting for password if run in the host machine)`);
        }

        await addJobToQueue({
          verification,
          appId,
          platform,
          newWalletVersion,
          architecture,
          type,
          fileEventIdsForSHFiles,
          fileHash: null,
          jobType: 'newRelease',
          buildShFileEvent: fileEvent,
          outputFileName,
          githubToken
        });
      }
    }

    if (!anyFileTried) {
      appLog.info(`   ** There are no files ending in .build.sh in the latest verification. Skipping... **`);
      verificationsLog.info(`--- ${appId} ${newWalletVersion} | There are no files ending in .build.sh in the latest verification. Skipping...`);
      return;
    }

  } catch (error) {
    appLog.error(`Error processing verification ${verification.id}:`, error);
    verificationsLog.info(`--- ${appId} ${newWalletVersion} | Error processing verification: ${architecture ? architecture : ''} ${type ? type : ''} ${JSON.stringify(error)}`);
  }
}

export async function addJobToQueue({
  verification,
  appId,
  platform,
  newWalletVersion,
  architecture,
  type,
  fileEventIdsForSHFiles,
  fileHash,
  verificationHash,
  jobType,
  buildShFileEvent,
  downloadedFileName,
  outputFileName,
  githubToken
}) {
  const scriptPathForLog = jobType === 'asset'
    ? `${appId}_${fileHash}_script.sh`
    : outputFileName ?? 'script.sh';
  appLog.info(`[QUEUE_INFO] Add job to queue: architecture: ${architecture}, type: ${type}, new wallet version: ${newWalletVersion} - ${scriptPathForLog} ***`);

  const jobPayload = {
    verification,
    appId,
    platform,
    newWalletVersion,
    architecture,
    type,
    fileEventIdsForSHFiles,
    fileHash,
    verificationHash,
    jobType,
    buildShFileEvent,
    downloadedFileName,
    outputFileName,
    githubToken
  };

  const job = queue.add(
    async () => {
      runningAppIds.add(appId);
      try {
        return await runJobWithPreparation(jobPayload).catch(err => {
          appLog.error('Script execution job failed:', err);
          verificationsLog.info(`--- ${appId} ${newWalletVersion} | Script execution job failed: ${architecture ? architecture : ''} ${type ? type : ''} ${err?.message ?? String(err)}`);
          return null;
        });
      } finally {
        runningAppIds.delete(appId);
      }
    },
    {
      appId,
      id: `${appId}_${newWalletVersion}_${architecture ?? ''}_${type ?? ''}_${fileHash ?? 'release'}`
    }
  );
  job.then(async returnParamsFromCompilationJob => {
    if (!returnParamsFromCompilationJob) {
      return;
    }
    appLog.info('Script execution job completed. Creating verification...', returnParamsFromCompilationJob);
    const binaryFilePath = returnParamsFromCompilationJob.binaryFilePath ?? null;
    await createVerificationAfterCompilation(
      returnParamsFromCompilationJob,
      verification,
      newWalletVersion,
      appId,
      platform,
      architecture,
      type,
      fileEventIdsForSHFiles,
      verificationHash ?? fileHash,
      binaryFilePath
    );
  });
}

async function runJobWithPreparation({
  verification,
  appId,
  platform,
  newWalletVersion,
  architecture,
  type,
  fileEventIdsForSHFiles,
  fileHash,
  verificationHash,
  jobType,
  buildShFileEvent,
  downloadedFileName,
  outputFileName,
  githubToken
}) {
  const buildDirForThisVerification = jobType === 'asset'
    ? path.join(BUILD_DIR_PREFIX, appId + '_' + fileHash + '_' + newWalletVersion + (architecture ? '_' + architecture : '') + (type ? '_' + type : ''))
    : path.join(BUILD_DIR_PREFIX, appId + '_' + newWalletVersion + (architecture ? '_' + architecture : '') + (type ? '_' + type : ''));

  createCompilationDirectory(buildDirForThisVerification);

  let binaryFilePath = null;
  if (jobType === 'asset') {
    const downloadedFileNamePath = path.join(buildDirForThisVerification, downloadedFileName);
    appLog.debug(`     - downloading from Blossom... ${fileHash}`);
    const downloadResult = await downloadFileFromBlossom(fileHash, downloadedFileNamePath);
    if (!downloadResult.success) {
      throw new Error(`File not found in Blossom (${downloadResult.error})`);
    }
    appLog.debug(`     - saved to ${downloadedFileNamePath}`);

    if (
      platform === 'android' &&
      downloadedFileNamePath.toLowerCase().endsWith('.zip')
    ) {
      const hasBaseApk = await zipContainsBaseApk(downloadedFileNamePath);
      if (!hasBaseApk) {
        appLog.warn(
          `     - base.apk not found inside ${downloadedFileNamePath}. Cannot run Android verification from this asset; skipping job.`
        );
        return null;
      }
    }

    binaryFilePath = downloadedFileNamePath;
  }

  const scriptWithPath = jobType === 'asset'
    ? path.join(buildDirForThisVerification, `${appId}_${fileHash}_script.sh`)
    : path.join(buildDirForThisVerification, outputFileName);

  appLog.debug(`     - saving script to ${scriptWithPath}`);
  saveScriptFromEventMakeExecutable(buildShFileEvent, scriptWithPath);

  const result = await startCompilationJob(buildDirForThisVerification, scriptWithPath, newWalletVersion, architecture, type, binaryFilePath, platform, appId, githubToken);
  return { ...result, binaryFilePath };
}

export function readComparisonResults(buildDirForThisVerification, architecture, appId, newWalletVersion, type) {
  const yamlFilePath = findFileRecursively(buildDirForThisVerification, 'COMPARISON_RESULTS.yaml');
  if (yamlFilePath) {
    try {
      const yamlContent = fs.readFileSync(yamlFilePath, 'utf8');
      const data = yaml.load(yamlContent);

      appLog.info(`COMPARISON_RESULTS.yaml content: ${JSON.stringify(data)}`);

      return {
        // Workaround for old scripts that don't have a verdict field yet
        verdict: data?.verdict ?? data?.results?.[0]?.status ?? null,
        scriptVersion: data?.script_version ?? null,
        notes: data?.notes ?? null
      };

    } catch (error) {
      appLog.error(`Error reading COMPARISON_RESULTS.yaml: ${error}`);
      verificationsLog.info(`--- ${appId} ${newWalletVersion} | Error reading COMPARISON_RESULTS.yaml: ${architecture ? architecture : ''} ${type ? type : ''} ${JSON.stringify(error)}`);
      return null;
    }
  }
}

export async function startCompilationJob(buildDirForThisVerification, script, newWalletVersion, architecture, type, binaryFilePath = null, platform, appId = null, githubToken = null) {
  const jobInfo = `appId=${appId ?? 'n/a'} version=${newWalletVersion} platform=${platform} arch=${architecture ?? 'n/a'} type=${type ?? 'n/a'}`;

  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const timeoutMs = QUEUE_TIMEOUT_HOURS * 60 * 60 * 1000;
    const timeoutId = setTimeout(() => {
      appLog.warn(`[QUEUE_INFO] Job timeout after ${QUEUE_TIMEOUT_HOURS}h - aborting process to free queue slot. ${jobInfo} Script: ${script}`);
      controller.abort();
    }, timeoutMs);

    let debugTimeoutId = null;
    if (QUEUE_DEBUG_TIMEOUT_MINUTES > 0) {
      const debugMs = QUEUE_DEBUG_TIMEOUT_MINUTES * 60 * 1000;
      debugTimeoutId = setTimeout(() => {
        appLog.warn(`[QUEUE_INFO]  Job still running after ${QUEUE_DEBUG_TIMEOUT_MINUTES} min without Promise resolution - process may have finished without exec callback, or process may be hung. ${jobInfo} Script: ${script}`);
      }, debugMs);
    }

    const done = (err, result) => {
      clearTimeout(timeoutId);
      if (debugTimeoutId) clearTimeout(debugTimeoutId);
      if (err) {
        appLog.error(`Error recording and executing script: ${err}`);
        reject(err);
      } else {
        appLog.info(`Script recorded and executed successfully: ${result.castFileName}`);
        resolve(result);
      }
    };

    // Execute script with asciinema recording
    const architectureFlag = architecture ? `--arch ${architecture}` : null;
    const typeFlag = type ? `--type ${type}` : null;
    const binaryParam = binaryFilePath ? `--binary ${binaryFilePath}` : null;
    const versionString = platform !== 'android' ? `--version ${newWalletVersion}` : null;
    const scriptArgs = [versionString, binaryParam, architectureFlag, typeFlag].filter(Boolean).join(' ');
    const finalScriptExecutionCommand = `${script} ${scriptArgs}`;

    let castFileName = script.replace(/\.sh$/, '');
    castFileName += `${architecture ? `_${architecture}` : ''}${type ? `_${type}` : ''}.cast`;
    const asciinemaCommand = `cd ${buildDirForThisVerification} && asciinema rec --overwrite -c "sleep 2; ${finalScriptExecutionCommand} ; echo scriptrc=\\$? ; sleep 5" ${castFileName}`;
    appLog.info(`Recording and executing script: ${asciinemaCommand}`);

    const child = spawn(asciinemaCommand, {
      shell: true,
      signal: controller.signal,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: {
        PATH: process.env.PATH || '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
        HOME: process.env.HOME || '/tmp',
        XDG_CONFIG_HOME: process.env.XDG_CONFIG_HOME || '/tmp/.config',
        ASCIINEMA_CONFIG_HOME: process.env.ASCIINEMA_CONFIG_HOME || '/tmp/.config',
        GITHUB_TOKEN: githubToken || process.env.GITHUB_TOKEN || null
      }
    });

    const stdoutChunks = [];
    const stderrChunks = [];
    child.stdout?.on('data', chunk => stdoutChunks.push(chunk));
    child.stderr?.on('data', chunk => stderrChunks.push(chunk));

    child.on('close', (code, signal) => {
      if (signal) {
        done(Object.assign(new Error(`Process killed: ${signal}`), { code: null, signal }), null);
      } else if (code !== 0) {
        const stderrStr = Buffer.concat(stderrChunks).toString('utf8');
        done(Object.assign(new Error(`Process exited with code ${code}${stderrStr ? `: ${stderrStr.slice(0, 200)}` : ''}`), { code, signal: null }), null);
      } else {
        done(null, {
          castFileName: castFileName,
          finalScriptExecutionCommand: finalScriptExecutionCommand,
          buildDirForThisVerification: buildDirForThisVerification
        });
      }
    });
    child.on('error', err => done(err, null));
  });
}

export async function createVerificationAfterCompilation(returnParamsFromCompilationJob, verification, newWalletVersion, appId, platform, architecture, type, fileEventIdsForSHFiles, fileHash, binaryFilePath = null) {
  const {castFileName, finalScriptExecutionCommand, buildDirForThisVerification} = returnParamsFromCompilationJob;

  const ndkInstance = getNdk();
  if (!ndkInstance) {
    throw new Error('NDK instance is not initialized');
  }

  const comparisionResults = readComparisonResults(buildDirForThisVerification, architecture, appId, newWalletVersion, type);
  if (!comparisionResults || !comparisionResults.verdict) {
    appLog.error(`COMPARISON_RESULTS.yaml not found, or error found reading it in ${buildDirForThisVerification}`);
    verificationsLog.info(`--- ${appId} ${newWalletVersion} | file COMPARISON_RESULTS.yaml not found in ${buildDirForThisVerification}`);
    return;
  }

  const { verdict, scriptVersion, notes } = comparisionResults;

  if (!['reproducible', 'not_reproducible', 'ftbfs'].includes(verdict)) {
    appLog.error(`________________________________ Verdict ${verdict} is not in the list of allowed verdicts for appId=${appId}, version=${newWalletVersion}, architecture=${architecture}, type=${type}`);
    verificationsLog.info(`--- ${appId} ${newWalletVersion} | Verdict ${verdict} is not in the list of allowed verdicts`);
    return null;
  }

  // Upload the asciicast file to Blossom server
  const castFileContent = fs.readFileSync(castFileName, 'utf8');
  const castFile = new File([castFileContent], path.basename(castFileName), { type: 'application/x-asciicast' });
  let castFileHash = null;
  try {
    castFileHash = await uploadBlobToBlossomServer(castFile, ndkInstance);
  } catch (error) {
    appLog.error(`************* Error uploading cast file to Blossom: ${error} *************\n`);
    verificationsLog.info(`--- ${appId} ${newWalletVersion} | Error uploading cast file to Blossom: ${architecture ? architecture : ''} ${type ? type : ''} ${JSON.stringify(error)}`);
    return;
  }

  let description = 'Automatic verification by WalletScrutiny Build Server';
  if (architecture) {
    description += architecture;
  }
  if (type) {
    if (architecture) {
      description += ' / ';
    }
    description += type;
  }

  let content = `Automatic verification by WalletScrutiny Build Server for wallet version ${newWalletVersion} ${architecture ? ` with architecture: ${architecture}` : '' } ${type ? `   type: ${type}` : ''}, based on verification ${verification.id} by ${verification.pubkey}. `;
  content += `The script was executed with these parameters: ${finalScriptExecutionCommand}`;
  if (scriptVersion) {
    content += ` - Script version: ${scriptVersion}.`;
  }
  if (notes) {
    content += ` - Notes from the developer of the script: ${notes}.`;
  }

  const formData = {
    // Changed values
    basedOn: verification.id + ':' + verification.pubkey,
    version: newWalletVersion,
    status: verdict,
    hashes: [fileHash],
    description: description,
    content: content,
    outputFiles: [{name: path.basename(castFileName), hash: castFileHash}],
    reusedFileIds: fileEventIdsForSHFiles,
    isDraft: false,
    // Original verification values
    appId: appId,
    platform: platform
  };

  try {
    const verificationEventId = await createVerification(ndkInstance, formData);

    verificationsLog.info(`+++ ${appId} ${newWalletVersion} | Verification created: ${architecture ? architecture : ''} ${type ? type : ''} ${verdict} ${fileHash} - verificationEventId: ${verificationEventId.id}`);

    if (buildDirForThisVerification && fs.existsSync(buildDirForThisVerification)) {
      removeDirectoryRecursive(buildDirForThisVerification);
      appLog.info(`Deleted build directory: ${buildDirForThisVerification}`);
    }
  } catch (error) {
    appLog.error(`Error creating verification for ${appId}:`, error);
    verificationsLog.info(`--- ${appId} ${newWalletVersion} | Error creating verification: ${architecture ? architecture : ''} ${type ? type : ''} ${verdict} ${fileHash}`);
  }
}
