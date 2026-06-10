import { uploadToBlossom } from './blossom-utils.js';
import {
  formatFileSize,
  updateDomElementInClass,
  getVersionFromFilename,
  calculateFileHash,
  isPageForAppId,
  getApkInfo,
  getPlatformFromFilename,
  expandDroppedFile,
  resolveApkInfoFromProcessedFiles,
  PENDING_ASSET_FILES_KEY
} from './drag-and-drop-utils.js';
import { isDebugEnv, userHasBrowserExtension } from './verifications_common.mjs';

const uploadsActivated = true;
const maxFileSize = 500;  // MB

window.addEventListener("verificationsUILoaded", async function () {
  initializeDragAndDrop();
});

function scrollToVersion(version) {
  const versionId = `version-${version.replace(/\./g, '-')}`; // Generate row ID

  const observer = new MutationObserver((mutations, obs) => {
    const showMoreButton = document.getElementById('show-more-link');
    const targetElement = document.getElementById(versionId);

    // Row is visible, we can directly scroll to it
    if (targetElement?.offsetParent) {
      obs.disconnect();
      targetElement.scrollIntoView({ block: 'center' });
      targetElement.classList.add('highlightRow');
    } else if (showMoreButton != null) {
      obs.disconnect();

      if (targetElement && !targetElement.offsetParent)
        // Row is hidden, we need to expand the table
        if (showMoreButton) {
          showMoreButton.click(); // Expand the table
        }

      // Wait for the table to expand, then scroll to and highlight the target row
      setTimeout(() => {
        const updatedTarget = document.getElementById(versionId);
        if (updatedTarget) {
          updatedTarget.scrollIntoView({ block: 'center' });
          updatedTarget.classList.add('highlightRow');

        } else {
          console.warn(`No table row found for version: ${version}`);
        }
      }, 500);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function initializeDragAndDrop() {
  const dropAreas = document.getElementsByClassName('drop-areas');
  const fileElems = document.getElementsByClassName('fileElems');

  Array.from(dropAreas).forEach(dropArea => {
    preventDefaultDragBehaviors(dropArea);
    setupHighlightEvents(dropArea);
    dropArea.addEventListener('drop', e => processFiles(e.dataTransfer.files, dropArea));
  });

  Array.from(fileElems).forEach(fileElem => {
    fileElem.addEventListener('change', e => processFiles(e.target.files, e.target.parentElement.parentElement));
  });
}

function preventDefaultDragBehaviors(element) {
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    element.addEventListener(eventName, e => {
      e.preventDefault();
      e.stopPropagation();
    }, false);
  });
}

function setupHighlightEvents(element) {
  ['dragenter', 'dragover'].forEach(eventName => {
    element.addEventListener(eventName, () => element.classList.add('highlight'), false);
  });
  ['dragleave', 'drop'].forEach(eventName => {
    element.addEventListener(eventName, () => element.classList.remove('highlight'), false);
  });
}

function disableHoverMode(dropAreaElement) {
  const select = dropAreaElement.querySelector('#select');
  select.classList.remove('hover-mode');
  select.classList.add('always-visible');

  const dropText = dropAreaElement.querySelector(".drop-text");
  const selectLabel = dropAreaElement.querySelector("#select label");

  // Change the text after a file is selected or dropped
  dropText.textContent = "Drop another file to verify";
  selectLabel.textContent = "Select a new file";
}

async function setFormFields(hash, fileName, apkInfo) {
  // If we have a form with a sha256 input, set it to the hash
  if (document.getElementById('sha256')) {
    document.getElementById('sha256').value = hash;
  }

  // If we have a form with a appId or version input, set them
  if (document.getElementById('appId') || document.getElementById('version')) {
    if (apkInfo) {
      document.getElementById('appId').value = apkInfo.package;
      document.getElementById('version').value = apkInfo.versionName;
    } else {
      const versionFromFilename = getVersionFromFilename(fileName);
      document.getElementById('version').value = versionFromFilename ? versionFromFilename : '';
    }
  }

  if (document.getElementById('platform')) {
    document.getElementById('platform').value = getPlatformFromFilename(fileName, apkInfo);
  }
}

function getCurrentExtractedFiles() {
  if (window.currentExtractedFiles?.length > 0) {
    return window.currentExtractedFiles;
  }
  if (window.currentFile && window.currentHash) {
    return [{
      data: window.currentFile,
      fileName: window.currentFile.name,
      sha256: window.currentHash
    }];
  }
  return [];
}

function buildActionUrlParams(primaryHash, processedFiles, { appId, version, platform, fileName }) {
  let urlParams = `?sha256=${encodeURIComponent(primaryHash)}`;
  for (const entry of processedFiles.slice(1)) {
    urlParams += `&hash=${encodeURIComponent(entry.sha256)}`;
  }
  for (const entry of processedFiles) {
    urlParams += `&apkFileName=${encodeURIComponent(entry.fileName)}`;
  }
  if (appId) {
    urlParams += `&appId=${encodeURIComponent(appId)}`;
  }
  if (version) {
    urlParams += `&version=${encodeURIComponent(version)}`;
  }
  if (platform) {
    urlParams += `&platform=${encodeURIComponent(platform)}`;
  }
  if (fileName) {
    urlParams += `&fileName=${encodeURIComponent(fileName)}`;
  }
  return urlParams;
}

async function processFiles(files, dropAreaElement) {
  if (files.length > 1) {
    alert('Please select or drop only one file at a time.');
    return;
  }

  const forbiddenExtensions = [
    // Images
    'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'ico', 'webp', 'svg',
    'raw', 'heic', 'psd', 'ai',
    // Documents
    'pdf', 'epub', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt',
    'rtf', 'odt', 'ods', 'odp', 'pages', 'numbers', 'keynote',
    // Data and config
    'csv', 'json', 'xml', 'yaml', 'yml', 'toml', 'ini', 'cfg', 'conf', 'log',
    // Video
    'mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'webm', '3gp', 'mpg', 'mpeg',
    // Audio
    'mp3', 'wav', 'ogg', 'm4a', 'wma', 'flac', 'aac', 'm4b', 'm4p', 'm4v'
  ];
  const extension = files[0].name.split('.').pop().toLowerCase();
  if (forbiddenExtensions.includes(extension)) {
    updateDomElementInClass('drop-area-textbox', '<p style="color: red;">Only binary files can be verified. Please drop a binary file to verify.</p>', dropAreaElement);
    return;
  }

  document.getElementById('loadingSpinner').style.display = 'block';

  const droppedFile = files[0];

  updateDomElementInClass('drop-area-textbox', '', dropAreaElement);

  disableHoverMode(dropAreaElement);

  let expanded;
  try {
    expanded = await expandDroppedFile(droppedFile);
  } catch (error) {
    document.getElementById('loadingSpinner').style.display = 'none';
    updateDomElementInClass(
      'drop-area-textbox',
      `<p style="color: red;">Could not read the ZIP file: ${error.message}</p>`,
      dropAreaElement
    );
    return;
  }

  const processedFiles = await Promise.all(expanded.entries.map(async (entry) => {
    const [apkInfo, sha256] = await Promise.all([
      getApkInfo(entry.file),
      calculateFileHash(entry.file)
    ]);
    return {
      data: entry.file,
      fileName: entry.fileName,
      sha256,
      apkInfo
    };
  }));

  const primaryFile = processedFiles[0];
  const primaryHash = primaryFile.sha256;
  const resolvedApkInfo = resolveApkInfoFromProcessedFiles(processedFiles);
  const isApkBundle = expanded.sourceZip != null && processedFiles.length > 1;

  const blossomChecks = await Promise.all(
    processedFiles.map(entry => checkFileExistsInBlossom(entry.sha256, true))
  );
  const allAssetsInformation = await getAllAssetInformation({ sha256: primaryHash });

  setFormFields(primaryHash, primaryFile.fileName, resolvedApkInfo);

  displayAllInfo(dropAreaElement, {
    droppedFile,
    sourceZip: expanded.sourceZip,
    processedFiles,
    isApkBundle,
    allAssetsInformation,
    blossomChecks
  });

  if (allAssetsInformation.assets?.size > 0) {
    try {
      document.getElementById('loadingSpinner').style.display = 'none';
      for (const [index, entry] of processedFiles.entries()) {
        if (
          !blossomChecks[index] &&
          (entry.data.size / 1024 / 1024) <= maxFileSize
        ) {
          await uploadToBlossom(entry.data, entry.sha256);
        }
      }
    } catch (error) {
      console.error('Error uploading file to Blossom', error);
    }
  }

  if (uploadsActivated) {
    window.currentExtractedFiles = processedFiles;
    window.currentFile = primaryFile.data;
    window.currentHash = primaryHash;
  }

  document.getElementById('loadingSpinner').style.display = 'none';
}

async function handleUploadAsset(urlParams) {
  if (!uploadsActivated) {
    return;
  }

  const filesToUpload = getCurrentExtractedFiles();
  if (filesToUpload.length === 0) {
    showToast('No file is available to upload. Please drop the file again.', 'error');
    return;
  }

  try {
    const oversizedFiles = filesToUpload.filter(file => (file.data.size / 1024 / 1024) > maxFileSize);
    if (oversizedFiles.length > 0) {
      showToast('Some files are too large to be uploaded, but you can still register them on Nostr.', 'info');
      await new Promise(resolve => setTimeout(resolve, 6000));
    } else {
      document.getElementById('loadingSpinner').style.display = 'block';
      for (const file of filesToUpload) {
        if ((file.data.size / 1024 / 1024) <= maxFileSize) {
          await uploadToBlossom(file.data, file.sha256);
        }
      }
      document.getElementById('loadingSpinner').style.display = 'none';
      showToast(
        filesToUpload.length > 1
          ? 'The files have been correctly uploaded to our server. You can now register them on Nostr.'
          : 'The file has been correctly uploaded to our server. You can now register it on Nostr.'
      );
    }

    sessionStorage.setItem(
      PENDING_ASSET_FILES_KEY,
      JSON.stringify(filesToUpload.map(file => ({
        sha256: file.sha256,
        fileName: file.fileName,
        uploaded: oversizedFiles.length === 0
      })))
    );

    window.location.href = `/new_asset/${urlParams}`;
  } catch (error) {
    document.getElementById('loadingSpinner').style.display = 'none';
    showToast('It was impossible to upload the file to our server. Please try again.', 'error');
  }
}

async function displayAllInfo(dropAreaElement, {
  droppedFile,
  sourceZip,
  processedFiles,
  isApkBundle,
  allAssetsInformation,
  blossomChecks
}) {
  const primaryFile = processedFiles[0];
  const hash = primaryFile.sha256;
  const apkInfo = resolveApkInfoFromProcessedFiles(processedFiles);
  const file = droppedFile;
  const fileExistsInBlossomServer = blossomChecks.every(exists => exists);
  let appTitle = null;
  let appId = null;
  let version = null;
  let verdict = null;
  let date = null;
  let platform = null;

  const firstVerification = allAssetsInformation.verifications.size > 0
    ? allAssetsInformation.verifications.values().next().value[0]
    : null;

  let appInfoFromNostr = null;
  if (firstVerification) {
    appInfoFromNostr = getAppInfoFromEventInfo(firstVerification);
  }

  if (appInfoFromNostr?.version) {
    scrollToVersion(appInfoFromNostr.version);
  }

  appId       = appInfoFromNostr?.appId ?? apkInfo?.package ?? null;

  const app = window.wallets.find(it => it.appId === appId) ?? null;  // Get internal info

  version     = appInfoFromNostr?.version ?? apkInfo?.versionName ?? null;
  verdict     = appInfoFromNostr?.verdict ?? null;
  date        = appInfoFromNostr?.createdAt ?? null;
  platform    = appInfoFromNostr?.platform ?? app?.folder ?? null;
  appTitle    = apkInfo?.application?.label[0] ?? app?.title ?? appId;

  const platformLegacy = ['linux', 'windows', 'macos'].includes(platform) ? 'desktop' : platform;

  let fileInfoHtml = `<h3>${appTitle ?? ''}</h3>`;

  if (appId) {
    fileInfoHtml += `<strong>App ID:</strong> ${appId}<br>`;
  }
  if (version) {
    fileInfoHtml += `<strong>Version:</strong> ${version}<br>`;
  }
  if (verdict) {
    fileInfoHtml += `<strong>Verdict:</strong><span class="verdict ${verdict}">${verdict}</span><br>`;
  }
  if (date) {
    fileInfoHtml += `<strong>Date:</strong> ${date}<br>`;
  }

  if (isApkBundle) {
    fileInfoHtml += `<strong>Archive:</strong> ${sourceZip.name}<br>`;
    fileInfoHtml += `<strong>APK files:</strong> ${processedFiles.length}<br>`;
    fileInfoHtml += '<ul>';
    for (const entry of processedFiles) {
      const tooLarge = (entry.data.size / 1024 / 1024) > maxFileSize;
      fileInfoHtml += `<li><strong>${entry.fileName}</strong> (${formatFileSize(entry.data.size)}${tooLarge ? ` <span style="color: red;">(upload size limit is ${maxFileSize} MB)</span>` : ''})<br><strong>SHA-256:</strong> ${entry.sha256}</li>`;
    }
    fileInfoHtml += '</ul>';
  } else {
    fileInfoHtml += `<strong>File:</strong> ${file ? file.name : 'N/A'}<br>`;
    fileInfoHtml += `<strong>Size:</strong> ${formatFileSize(file.size) ?? 'N/A'} ${(file.size / 1024 / 1024) > maxFileSize ? ` <span style="color: red;">(upload size limit is ${maxFileSize} MB)</span>` : ''}<br>`;
    fileInfoHtml += `<strong>SHA-256:</strong> ${hash}<br>`;
  }

  if (isDebugEnv()) {
    fileInfoHtml += `<strong>${fileExistsInBlossomServer ? 'All files exist in Blossom' : 'Some or all files are missing from Blossom'}</strong> <small>(overrides cache - only shown in debug envs)</small><br>`;
  }

  if (!appInfoFromNostr && apkInfo) {
    const bundleSuffix = isApkBundle ? ` The ZIP contains <b>${processedFiles.length}</b> APK files whose hashes will be included if you register or verify this asset.` : '';
    fileInfoHtml += '<br>' + (
      app ?
        `<p>This appears to be version <b>${version}</b> of <b>${appTitle}</b>, but nobody has verified this specific version yet.${bundleSuffix}</p>` :
        `<p>This is an APK for an unknown application. You can register it on Nostr so others can try to reproduce it.${bundleSuffix}</p>`);
  } else if (isApkBundle) {
    fileInfoHtml += `<br><p>The ZIP contains <b>${processedFiles.length}</b> APK files. All of their hashes will be included if you register or verify this asset.</p>`;
  }

  fileInfoHtml += '<br>';


  // Adding buttons and related information

  const hasAssets = allAssetsInformation.assets?.size > 0;
  const hasVerifications = allAssetsInformation.verifications?.size > 0;

  const platformFromFile = getPlatformFromFilename(primaryFile.fileName, apkInfo);
  const urlParams = buildActionUrlParams(hash, processedFiles, {
    appId,
    version,
    platform: platformFromFile ?? platform,
    fileName: isApkBundle ? sourceZip.name : file.name
  });

  if (!hasAssets && !hasVerifications ) {
    if (window.location.pathname !== '/new_asset/') {
      fileInfoHtml += `<li><a href="#" onclick="handleUploadAsset('${urlParams}'); return false;" class="btn btn-small">Register this new asset</a> on Nostr so others can try to reproduce the build process.</li>`;
    }
    fileInfoHtml += `<li><a href="/new_verification/${urlParams}" class="btn btn-small">Create a verification</a> for this file so others can see if you were able to reproduce it or not.</li>`;
  } else if (hasAssets && !hasVerifications) {
    fileInfoHtml += `<li>This asset is <a href="/asset/?sha256=${encodeURIComponent(hash)}">already registered in Nostr</a>, but nobody tried to create a <b>verification</b> yet.`;
    fileInfoHtml += ` You can <a href="/new_verification/${urlParams}" class="btn btn-small">create one</a> yourself.`;
    fileInfoHtml += `</li>`;
  } else if (hasVerifications) {
    fileInfoHtml += `<li>Thi file has <b>verifications</b> by users. You can <a href="/asset/?sha256=${encodeURIComponent(hash)}" class="btn btn-small">view them</a>`;
    fileInfoHtml += `, or <a href="/new_verification/${urlParams}" class="btn btn-small">create a new verification</a>`;
    fileInfoHtml += `.</li>`;
  }

  if (app && !isPageForAppId(appId)) {
    fileInfoHtml += `<li>You can go to the <a href="/${platformLegacy}/${appId}/?hash=${encodeURIComponent(hash)}" class="btn btn-small">${appTitle} page</a> to see all the information about this app.</li>`;
  }

  fileInfoHtml += `<li>Check out <a href="/verifications/" class="btn btn-small" target="_blank">How Verifications Work</a>.</li>`;

  updateDomElementInClass('drop-area-textbox', fileInfoHtml, dropAreaElement);
}

window.handleUploadAsset = handleUploadAsset;
window.maxFileSize = maxFileSize;
window.calculateFileHash = calculateFileHash;
window.expandDroppedFile = expandDroppedFile;
window.PENDING_ASSET_FILES_KEY = PENDING_ASSET_FILES_KEY;