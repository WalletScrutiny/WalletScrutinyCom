import { uploadToBlossom } from './blossom-utils.js';
import {
  formatFileSize,
  updateDomElementInClass,
  getVersionFromFilename,
  calculateFileHash,
  isPageForAppId,
  getApkInfo,
  getPlatformFromFilename
} from './drag-and-drop-utils.js';
import { isDebugEnv } from './verifications_utils.mjs';

const uploadsActivated = true;
const maxFileSize = 500;  // MB

document.addEventListener("DOMContentLoaded", async function () {
  initializeDragAndDrop();
});

function scrollToVersion(version) {
  const versionId = `version-${version.replace(/\./g, '-')}`; // Generate row ID

  const observer = new MutationObserver((mutations, obs) => {
    const showMoreButton = document.querySelector('a.show-more-link');
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

  const file = files[0];

  updateDomElementInClass('drop-area-textbox', '', dropAreaElement);    // Clear the drop-area before displaying new information

  disableHoverMode(dropAreaElement);

  /////////////////////////////////////////////////////////////////////
  // Get all the information about the file / hash / apk
  /////////////////////////////////////////////////////////////////////
  const [apkInfo, hash] = await Promise.all([
    getApkInfo(file),
    calculateFileHash(file)
  ]);

  const [allAssetsInformation, fileExistsInBlossomServer] = await Promise.all([
    getAllAssetInformation({ sha256: hash }),
    checkBlossomFile(hash, true)
  ]);
  /////////////////////////////////////////////////////////////////////

  setFormFields(hash, file.name, apkInfo);

  displayAllInfo(dropAreaElement, file, apkInfo, hash, allAssetsInformation, fileExistsInBlossomServer);

  if (allAssetsInformation.assets?.size > 0 && !fileExistsInBlossomServer && (file.size / 1024 / 1024) <= maxFileSize) {
    try {
      document.getElementById('loadingSpinner').style.display = 'none';
      await uploadToBlossom(file, hash);
    } catch (error) {
      console.error('Error uploading file to Blossom', error);
    }
  }

  // Store the file and hash for later use when registering the asset
  if (uploadsActivated) {
    window.currentFile = file;
    window.currentHash = hash;
  }

  document.getElementById('loadingSpinner').style.display = 'none';
}

async function handleUploadAsset(urlParams) {
  if (uploadsActivated) {
    try {
      const fileSize = window.currentFile.size / 1024 / 1024;

      if (fileSize > maxFileSize) {
        showToast('The file is too large to be uploaded, but you can still register it on Nostr.', 'info');
        await new Promise(resolve => setTimeout(resolve, 6000));
      } else {
        document.getElementById('loadingSpinner').style.display = 'block';
        await uploadToBlossom(window.currentFile, window.currentHash);
        document.getElementById('loadingSpinner').style.display = 'none';
        showToast('The file has been correctly uploaded to our server. You can now register it on Nostr.');
      }

      window.location.href = `/new_asset/${urlParams}`;
    } catch (error) {
      document.getElementById('loadingSpinner').style.display = 'none';
      showToast('It was impossible to upload the file to our server. Please try again.', 'error');
    }
  }
}

async function displayAllInfo(dropAreaElement, file, apkInfo, hash, allAssetsInformation, fileExistsInBlossomServer) {
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

  fileInfoHtml += `<strong>File:</strong> ${file ? file.name : 'N/A'}<br>`;
  fileInfoHtml += `<strong>Size:</strong> ${formatFileSize(file.size) ?? 'N/A'} ${(file.size / 1024 / 1024) > maxFileSize ? ` <span style="color: red;">(upload size limit is ${maxFileSize} MB)</span>` : ''}<br>`;
  fileInfoHtml += `<strong>SHA-256:</strong> ${hash}<br>`;

  if (isDebugEnv()) {
    fileInfoHtml += `<strong>${fileExistsInBlossomServer ? 'File exists in Blossom' : 'File does not exist in Blossom'}</strong> <small>(overrides cache - only shown in debug envs)</small><br>`;
  }

  if (!appInfoFromNostr && apkInfo) {
    fileInfoHtml += '<br>' + (
      app ?
        `<p>This appears to be version <b>${version}</b> of <b>${appTitle}</b>, but nobody has verified this specific version yet.</p>` :
        `<p>This is an APK for an unknown application. You can register it on Nostr so others can try to reproduce it.</p>`);
  }

  fileInfoHtml += '<br>';


  // Adding buttons and related information

  const hasAssets = allAssetsInformation.assets?.size > 0;
  const hasVerifications = allAssetsInformation.verifications?.size > 0;

  // Params to be used for new asset and new verification links
  let urlParams = `?sha256=${encodeURIComponent(hash)}`;
  if (appId) { urlParams += `&appId=${encodeURIComponent(appId)}`; }
  if (version) { urlParams += `&version=${encodeURIComponent(version)}`; }
  const platformFromFile = getPlatformFromFilename(file.name, apkInfo);
  if (platformFromFile) {
    urlParams += `&platform=${encodeURIComponent(platformFromFile ?? platform)}`;
  }

  if (!hasAssets && !hasVerifications ) {
    if (window.location.pathname !== '/new_asset/') {
      fileInfoHtml += `<li><a href="#" onclick="handleUploadAsset('${urlParams}'); return false;" class="btn btn-small">Register this new asset</a> on Nostr so others can try to reproduce the build process.</li>`;
    }

    fileInfoHtml += `<li><a href="/new_verification/${urlParams}" class="btn btn-small">Create a verification</a> for this file so others can see if you were able to reproduce it or not.</li>`;
  } else if (hasAssets && !hasVerifications) {
    fileInfoHtml += `<li>This asset is <a href="/asset/?sha256=${encodeURIComponent(hash)}">already registered in Nostr</a>, but nobody tried to create a <b>verification</b> yet. You can <a href="/new_verification/${urlParams}" class="btn btn-small">create one</a> yourself.</li>`;
  } else if (hasVerifications) {
    fileInfoHtml += `<li>This file has <b>verifications</b> by users. You can <a href="/asset/?sha256=${encodeURIComponent(hash)}" class="btn btn-small">view them</a>, or <a href="/new_verification/${urlParams}" class="btn btn-small">create a new verification</a>.</li>`;
  }

  if (app && !isPageForAppId(appId)) {
    fileInfoHtml += `<li>You can go to the <a href="/${platform}/${appId}/?hash=${encodeURIComponent(hash)}" class="btn btn-small">${appTitle} page</a> to see all the information about this app.</li>`;
  }

  fileInfoHtml += `<li>Check out <a href="/verifications/" class="btn btn-small" target="_blank">How Verifications Work</a>.</li>`;

  updateDomElementInClass('drop-area-textbox', fileInfoHtml, dropAreaElement);
}

window.handleUploadAsset = handleUploadAsset;
window.maxFileSize = maxFileSize;