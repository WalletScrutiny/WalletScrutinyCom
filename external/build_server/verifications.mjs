import { exec } from 'child_process';
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
import { BLOSSOM_SERVER_URL, QUEUE_TIMEOUT_HOURS, QUEUE_CONCURRENCY } from './config/config.mjs';
import { BUILD_DIR_PREFIX } from './index.mjs';

const queue = new PQueue({
  concurrency: QUEUE_CONCURRENCY,
  timeout: QUEUE_TIMEOUT_HOURS * 60 * 60 * 1000,
  throwOnTimeout: true
});
queue.on('active', logQueueInfo);
queue.on('next', logQueueInfo);
queue.on('error', error => {
  appLog.error(error);
  // TODO: We can potentially send a Nostr notification to the user to inform them about the error
});
function logQueueInfo() {
  appLog.info(`**** Queue info - Waiting (${queue.size})  Running (${queue.pending}): ${JSON.stringify(queue.runningTasks)}`);
}

let buildDirForThisVerification = null;

export async function verifyAssetsFromRegistry(verifications, appInfo) {
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

    const archAndType = findArchAndTypeForFile(appInfo, legacyPlatform, appId, fileName);
    if (!archAndType) {
      appLog.debug(`   no arch and type found for appId=${appId}, version=${version}, and platform=${legacyPlatform} and fileName=${fileName}. Do you need to add the file patterns to the builds array in the .md file?`);
      continue;
    }
    const { architecture, type } = archAndType;

    const blossomFileURL = BLOSSOM_SERVER_URL + '/' + fileHash;
    let response;
    try {
      response = await fetch(blossomFileURL);
    } catch (fetchError) {
      appLog.error(`Fetch failed for ${blossomFileURL}: ${fetchError?.message ?? fetchError}. Skipping asset.`);
      continue;
    }
    if (response.ok) {
      const buildDirForThisVerification = path.join(BUILD_DIR_PREFIX, appId + '_' + fileHash + '_' + version + (architecture ? '_' + architecture : '') + (type ? '_' + type : ''));
      createCompilationDirectory(buildDirForThisVerification);

      appLog.debug(`     - file found in Blossom. Downloading... ${blossomFileURL}`);
      let downloadedFileName = null;
      if (sanitizedFileName) {
        downloadedFileName = sanitizedFileName;
      } else {
        downloadedFileName = `${appId}_${version}_${fileHash}_downloaded.apk`;
      }
      const downloadedFileNamePath = path.join(buildDirForThisVerification, downloadedFileName);
      const buffer = Buffer.from(await response.arrayBuffer());
      fs.writeFileSync(downloadedFileNamePath, buffer);
      appLog.debug(`     - saved to ${downloadedFileNamePath}`);

      const scriptFileName = `${appId}_${fileHash}_script.sh`;
      const scriptPath = path.join(buildDirForThisVerification, scriptFileName);
      appLog.debug(`     - saving script to ${scriptPath}`);
      saveScriptFromEventMakeExecutable(verification.buildShFileEvent, scriptPath);

      await addJobToQueue({
        verification: verification.verification,
        appId,
        platform,
        buildDirForThisVerification,
        scriptWithPath: scriptPath,
        newWalletVersion: version,
        architecture,
        type,
        fileEventIdsForSHFiles: [verification.buildShFileEvent.id],
        fileHash,
        binaryFilePath: downloadedFileNamePath
      });
    } else {
      appLog.debug(`     - file not found in Blossom. Skipping... ${blossomFileURL}`);
    }
  }
}

export async function processNewReleaseVerification(verification, newWalletVersion, appInfo, wsBotVerifications) {
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
        // Create unique filename
        const safeAppId = appId.replace(/[^a-zA-Z0-9.-]/g, '_');
        const safeVersion = newWalletVersion.replace(/[^a-zA-Z0-9.-]/g, '_');
        const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
        const outputFileName = `${safeAppId}_${safeVersion}_${safeFileName}.sh`;
        buildDirForThisVerification = path.join(BUILD_DIR_PREFIX, appId + '_' + newWalletVersion + (architecture ? '_' + architecture : '') + (type ? '_' + type : ''));

        const scriptWithPath = path.join(buildDirForThisVerification, outputFileName);

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
          appLog.info(`${appId} | ${newWalletVersion} | ${platform} | ${architecture} | ${type} | sh script found: ${scriptWithPath}`);
        }

        createCompilationDirectory(buildDirForThisVerification);

        saveScriptFromEventMakeExecutable(fileEvent, scriptWithPath);

        await addJobToQueue({
          verification,
          appId,
          platform,
          buildDirForThisVerification,
          scriptWithPath,
          newWalletVersion,
          architecture,
          type,
          fileEventIdsForSHFiles,
          fileHash
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
  buildDirForThisVerification,
  scriptWithPath,
  newWalletVersion,
  architecture,
  type,
  fileEventIdsForSHFiles,
  fileHash,
  binaryFilePath = null
}) {
  appLog.info(`   ** Add job to queue: architecture: ${architecture}, type: ${type}, new wallet version: ${newWalletVersion} - ${scriptWithPath} ***`);

  const job = queue.add(() => startCompilationJob(buildDirForThisVerification, scriptWithPath, newWalletVersion, architecture, type, binaryFilePath, platform));
  job.catch(err => {
    appLog.error('Script execution job failed:', err);
    verificationsLog.info(`--- ${appId} ${newWalletVersion} | Script execution job failed: ${architecture ? architecture : ''} ${type ? type : ''} ${JSON.stringify(err)}`);
  });
  job.then(async returnParamsFromCompilationJob => {
    appLog.info('Script execution job completed. Creating verification...', returnParamsFromCompilationJob);
    await createVerificationAfterCompilation(
      returnParamsFromCompilationJob,
      verification,
      newWalletVersion,
      appId,
      platform,
      architecture,
      type,
      fileEventIdsForSHFiles,
      fileHash,
      binaryFilePath
    );
  });
}

export function readComparisonResults(buildDirForThisVerification, architecture, appId, newWalletVersion, type) {
  // First, try to find and read COMPARISON_RESULTS.yaml
  const yamlFilePath = findFileRecursively(buildDirForThisVerification, 'COMPARISON_RESULTS.yaml');
  if (yamlFilePath) {
    try {
      const yamlContent = fs.readFileSync(yamlFilePath, 'utf8');
      const data = yaml.load(yamlContent);

      appLog.info(`COMPARISON_RESULTS.yaml content: ${JSON.stringify(data)}`);
      if (data?.results) {
        let architectureResults;
        if (architecture) {
          // Find all results matching the architecture
          architectureResults = data.results.filter(r => r.architecture === architecture);
        } else {
          architectureResults = data.results;
        }

        if (architectureResults.length > 0) {
          for (const result of architectureResults) {
            return result.status;
          }
        }
      }

      return null;

    } catch (error) {
      appLog.error(`Error reading COMPARISON_RESULTS.yaml: ${error}`);
      verificationsLog.info(`--- ${appId} ${newWalletVersion} | Error reading COMPARISON_RESULTS.yaml: ${architecture ? architecture : ''} ${type ? type : ''} ${JSON.stringify(error)}`);
    }
  }

  // Fallback to COMPARISON_RESULTS.txt if YAML not found or didn't contain matching architecture
  const comparisonFilePath = findFileRecursively(buildDirForThisVerification, 'COMPARISON_RESULTS.txt');
  if (!comparisonFilePath) {
    return null;
  }

  try {
    const content = fs.readFileSync(comparisonFilePath, 'utf8');
    const line = content.split('\n').find(l => l.includes(` - ${architecture} - `));
    if (line) {
      const tokens = line.split(' - ');
      const hash = tokens[2];
      if (hash) {
        hashes = [hash];
        matches = tokens[3]?.trim().startsWith('1');
      }
    }
  } catch (error) {
    appLog.error(`Error reading COMPARISON_RESULTS.txt: ${error}`);
    verificationsLog.info(`--- ${appId} ${newWalletVersion} | Error reading COMPARISON_RESULTS.txt: ${architecture ? architecture : ''} ${type ? type : ''} ${JSON.stringify(error)}`);
  }

  if (hashes.length === 0) {
    return null;
  }

  return { hashes, matches };
}

export async function startCompilationJob(buildDirForThisVerification, script, newWalletVersion, architecture, type, binaryFilePath = null, platform) {
  return new Promise((resolve, reject) => {
    // Execute script with asciinema recording
    const architectureFlag = architecture ? `--arch ${architecture}` : null;
    const typeFlag = type ? `--type ${type}` : null;
    let binaryParam = null;
    if (platform === 'android') {
      binaryParam = binaryFilePath ? `--apk ${binaryFilePath}` : null;
    } else {
      binaryParam = binaryFilePath ? `--binary ${binaryFilePath}` : null;
    }
    const versionString = platform !== 'android' ? `--version ${newWalletVersion}` : null;
    const scriptArgs = [versionString, binaryParam, architectureFlag, typeFlag].filter(Boolean).join(' ');
    const finalScriptExecutionCommand = `${script} ${scriptArgs}`;

    let castFileName = script.replace(/\.sh$/, '');
    castFileName += `${architecture ? `_${architecture}` : ''}${type ? `_${type}` : ''}.cast`;
    const asciinemaCommand = `cd ${buildDirForThisVerification} && asciinema rec --overwrite -c "sleep 2; ${finalScriptExecutionCommand} ; echo scriptrc=\\$? ; sleep 5" ${castFileName}`;
    appLog.info(`Recording and executing script: ${asciinemaCommand}`);
    exec(asciinemaCommand, {
      env: {
        // Ensure PATH includes standard system directories for rootless container tools
        PATH: process.env.PATH || '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
        HOME: process.env.HOME || '/tmp',
        XDG_CONFIG_HOME: process.env.XDG_CONFIG_HOME || '/tmp/.config',
        ASCIINEMA_CONFIG_HOME: process.env.ASCIINEMA_CONFIG_HOME || '/tmp/.config'
      },
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer for large script outputs
    }, (error, stdout, stderr) => {
      if (error) {
        appLog.error(`Error recording and executing script: ${error}`);
        reject(error);
      } else {
        appLog.info(`Script recorded and executed successfully: ${castFileName}`);
        resolve({
          castFileName: castFileName,
          finalScriptExecutionCommand: finalScriptExecutionCommand,
          buildDirForThisVerification: buildDirForThisVerification
        });
      }
    });
  });
}

export async function createVerificationAfterCompilation(returnParamsFromCompilationJob, verification, newWalletVersion, appId, platform, architecture, type, fileEventIdsForSHFiles, fileHash, binaryFilePath = null) {
  const {castFileName, finalScriptExecutionCommand, buildDirForThisVerification} = returnParamsFromCompilationJob;

  const ndkInstance = getNdk();
  if (!ndkInstance) {
    throw new Error('NDK instance is not initialized');
  }

  const status = readComparisonResults(buildDirForThisVerification, architecture, appId, newWalletVersion, type);
  if (!status) {
    appLog.error(`COMPARISON_RESULTS.yaml or COMPARISON_RESULTS.txt not found, or error found reading it in ${buildDirForThisVerification}`);
    verificationsLog.info(`--- ${appId} ${newWalletVersion} | file COMPARISON_RESULTS.yaml or COMPARISON_RESULTS.txt not found ${architecture ? architecture : ''} ${type ? type : ''} ${buildDirForThisVerification}`);
    return;
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

  let description = 'Automatic verification by WalletScrutiny Build Server - ';
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
  content += `The script was executed with these parameters: ${finalScriptExecutionCommand}.`;

  const formData = {
    // Changed values
    basedOn: verification.id + ':' + verification.pubkey,
    version: newWalletVersion,
    status,
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

    verificationsLog.info(`+++ ${appId} ${newWalletVersion} | Verification created: ${architecture ? architecture : ''} ${type ? type : ''} ${status} ${hashes.join(', ')} - verificationEventId: ${verificationEventId}`);

    if (buildDirForThisVerification && fs.existsSync(buildDirForThisVerification)) {
      removeDirectoryRecursive(buildDirForThisVerification);
      appLog.info(`Deleted build directory: ${buildDirForThisVerification}`);
    }
  } catch (error) {
    appLog.error(`Error creating verification for ${appId}:`, error);
    verificationsLog.info(`--- ${appId} ${newWalletVersion} | Error creating verification: ${architecture ? architecture : ''} ${type ? type : ''} ${status} ${hashes.join(', ')}`);
  }
}
