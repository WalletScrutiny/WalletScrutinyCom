---
layout: archive
title: "Registering New Asset"
permalink: /new_asset/
---

<style>
  .drop-zone {
    background-color: #f8f9fa;
    border: 2px dashed #ccc;
    border-radius: 4px;
    padding: 10px;
    text-align: center;
    cursor: pointer;
    color: #666;
    line-height: 22px !important;
  }
  .drop-zone.dragover {
    background-color: #e9ecef;
    border-color: #aaa;
  }
  .drop-zone-text {
    display: block;
    color: black;
  }
  #assetFilesInput {
    display: none !important;
  }
  .asset-files-selection-summary {
    margin: 0.5rem 0 0;
    font-size: 0.95em;
    color: var(--neutral-0, #333);
  }
  .asset-files-selection-summary:empty {
    display: none;
  }
  .file-list {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .file-item {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    padding: 10px;
    border-radius: 4px;
    background-color: var(--neutral-5);
    border: 1px solid #e9ecef;
  }
  .file-item-details {
    flex: 1;
    min-width: 0;
  }
  .file-item-name {
    word-break: break-word;
    font-size: 0.95em;
    color: var(--neutral-0);
  }
  .file-item-size {
    white-space: nowrap;
  }
  .file-item-hash {
    margin-top: 0.4rem;
    font-size: 0.85em;
    word-break: break-all;
    color: var(--neutral-1, #666);
    font-family: monospace;
  }
  .remove-file {
    color: red;
    cursor: pointer;
    border: none;
    background: none;
    padding: 5px 8px;
    font-size: 2.1em;
    border-radius: 50%;
    line-height: 1;
    flex-shrink: 0;
  }
  .remove-file:hover {
    background-color: rgba(255, 0, 0, 0.1);
  }
</style>

<div class="form-container">
  <div class="info-message">
    <p>To add a new asset to Nostr so it can be verified by you or others, provide the metadata below and attach one or more binary files. Each file is uploaded to our server and referenced by its SHA-256 hash and filename. If your asset has multiple files, you must add them all here in the same asset registration.</p>
  </div>

  <div>
    <p>Fields marked with (*) are required.</p>
  </div>

  <form id="assetForm" onsubmit="handleSubmit(event)">
    <div id="assetFilesDropzoneArea" class="form-group">
      <label for="assetFilesInput" id="assetFilesDropZone" class="drop-zone">
        <span class="drop-zone-text" style="width: 100%">
          <p><b>Drag and drop</b> one or more files here, or use the button below. Hashes are calculated automatically.</p>
        </span>
      </label>
      <input type="file" id="assetFilesInput" multiple>
      <p id="assetFilesSelectionSummary" class="asset-files-selection-summary" aria-live="polite"></p>
      <div id="assetFilesList" class="file-list"></div>
    </div>
    <div class="blossom-upload-status"></div>

    <div class="form-group">
      <label for="appId">App ID:</label>
      <input type="text" id="appId" name="appId" class="form-control" autocomplete="off" maxlength="75">
      <div id="appIdSuggestions" class="suggestions-container"></div>
      <small class="form-text">Example: app.zeusln.zeus. Start typing wallet name or ID to search for known apps, or write a new app ID.</small>
      <small class="form-text" style="margin-bottom: 1em;">If you <b>can't find the app here</b>, you can <a href="https://gitlab.com/walletscrutiny/walletScrutinyCom/-/wikis/How-to-Contribute-to-WalletScrutiny#add-products" target="_blank">open an MR</a> to add it to the inventory, or drop us a message on our <a href="https://discord.com/channels/1011450447392940082/1012176837486596106" target="_blank">Discord</a>.</small>
    </div>

    <div class="form-group">
      <label for="version">Version (*):</label>
      <input type="text" id="version" name="version" class="form-control" required maxlength="30">
      <small class="form-text">Example: 0.9.2</small>
    </div>

    <div class="form-group">
      <label for="platform">Platform (*):</label>
      <select id="platform" name="platform" class="form-control" required>
        <option value="">Select a platform</option>
        {% for p in site.data.platformMeta %}
          {% assign folder = p[0] %}
          {% include folderToName.html folder=folder %}
          <option value="{{p[0]}}">{{name}}{% if folder == 'desktop' %} (deprecated){% endif %}</option>
        {% endfor %}
      </select>
    </div>

    <div class="form-group">
      <label for="description">Asset Description (*):</label>
      <input type="text" id="description" name="description" class="form-control" required maxlength="120">
      <small class="form-text">Example: Firmware / Bootloader / Universal APK from Github / Debian package amd64 / ARM v8 / MacOS App Store</small>
    </div>

    <button type="submit" class="btn btn-success">Register Asset</button>
  </form>
</div>

<script>
  const PENDING_ASSET_FILES_KEY = 'wsPendingAssetFiles';
  let assetFiles = [];

  function displayAssetFiles() {
    const fileListElement = document.getElementById('assetFilesList');
    const summaryElement = document.getElementById('assetFilesSelectionSummary');
    fileListElement.innerHTML = '';

    if (summaryElement) {
      if (assetFiles.length === 0) {
        summaryElement.textContent = '';
      } else if (assetFiles.length === 1) {
        summaryElement.textContent = '1 file selected';
      } else {
        summaryElement.textContent = `${assetFiles.length} files selected`;
      }
    }

    assetFiles.forEach((file, index) => {
      const sizeLabel = file.data
        ? `(${(file.data.size / 1024 / 1024).toFixed(2)} MB)`
        : '(already uploaded)';
      const fileItem = document.createElement('div');
      fileItem.className = 'file-item';
      fileItem.innerHTML = `
        <div class="file-item-details">
          <div class="file-item-name">${file.fileName} <span class="file-item-size">${sizeLabel}</span></div>
          <div class="file-item-hash">${file.sha256}</div>
        </div>
        <button type="button" class="remove-file" title="Remove this file" data-index="${index}">×</button>`;

      fileItem.querySelector('.remove-file').addEventListener('click', (e) => {
        const indexToRemove = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        assetFiles.splice(indexToRemove, 1);
        displayAssetFiles();
      });
      fileListElement.appendChild(fileItem);
    });
  }

  async function expandIncomingFiles(files) {
    const expandedFiles = [];

    for (const file of files) {
      try {
        const expanded = await window.expandDroppedFile(file);
        if (expanded.sourceZip && expanded.entries.length > 1) {
          expanded.entries.forEach(entry => expandedFiles.push(entry.file));
        } else {
          expandedFiles.push(file);
        }
      } catch (error) {
        throw new Error(`Could not read ZIP "${file.name}": ${error.message}`);
      }
    }

    return expandedFiles;
  }

  function addAssetFileEntry({ sha256, fileName, uploaded = false, data = null }) {
    if (!sha256 || assetFiles.some(f => f.sha256 === sha256)) {
      return;
    }
    assetFiles.push({
      data,
      fileName,
      sha256,
      uploaded
    });
  }

  function loadPendingAssetFiles() {
    const raw = sessionStorage.getItem(PENDING_ASSET_FILES_KEY);
    if (!raw) {
      return false;
    }

    sessionStorage.removeItem(PENDING_ASSET_FILES_KEY);
    const pendingFiles = JSON.parse(raw);
    for (const pending of pendingFiles) {
      addAssetFileEntry({
        sha256: pending.sha256,
        fileName: pending.fileName,
        uploaded: pending.uploaded === true
      });
    }
    return pendingFiles.length > 0;
  }

  function loadAssetFilesFromUrlParams(urlParams) {
    const sha256 = DOMPurify.sanitize(urlParams.get('sha256'), purifyConfig);
    if (!sha256 || !/^[a-fA-F0-9]{64}$/.test(sha256)) {
      return false;
    }

    const extraHashes = urlParams.getAll('hash')
      .map(hash => DOMPurify.sanitize(hash, purifyConfig))
      .filter(hash => hash && /^[a-fA-F0-9]{64}$/.test(hash) && hash !== sha256);

    const hashes = [sha256, ...extraHashes];
    const apkFileNames = urlParams.getAll('apkFileName')
      .map(name => DOMPurify.sanitize(name, purifyConfig))
      .filter(Boolean);
    const fallbackFileName = DOMPurify.sanitize(urlParams.get('fileName'), purifyConfig);

    hashes.forEach((hash, index) => {
      let fileName = apkFileNames[index];
      if (!fileName) {
        fileName = hashes.length === 1 && fallbackFileName
          ? fallbackFileName
          : `apk-${index + 1}.apk`;
      }
      addAssetFileEntry({ sha256: hash, fileName });
    });

    return assetFiles.length > 0;
  }

  async function handleAssetFiles(files) {
    const newFiles = Array.from(files);
    const errors = [];
    let expandedFiles = [];

    try {
      expandedFiles = await expandIncomingFiles(newFiles);
    } catch (error) {
      showToast(error.message, 'error');
      return;
    }

    for (const file of expandedFiles) {
      if (assetFiles.some(f => f.fileName === file.name && f.sha256)) {
        continue;
      }
      try {
        const hash = await calculateFileHash(file);
        if (assetFiles.some(f => f.sha256 === hash)) {
          errors.push(`File "${file.name}" has the same hash as an already added file.`);
          continue;
        }
        assetFiles.push({
          data: file,
          fileName: file.name,
          sha256: hash
        });
      } catch (error) {
        errors.push(`Could not calculate hash for "${file.name}": ${error.message}`);
      }
    }

    if (errors.length > 0) {
      showToast(errors.join('\n'), 'error', 6000 + (errors.length * 2000));
    }
    displayAssetFiles();
  }

  function setupAssetFilesDropZone() {
    const dropZone = document.getElementById('assetFilesDropZone');
    const fileInput = document.getElementById('assetFilesInput');

    fileInput.addEventListener('change', async (e) => {
      await handleAssetFiles(e.target.files);
      fileInput.value = '';
    });

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', async (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      await handleAssetFiles(e.dataTransfer.files);
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (assetFiles.length === 0) {
      showToast('Add at least one file to register', 'error');
      return;
    }

    const formData = {
      description: document.getElementById('description').value.trim(),
      version: document.getElementById('version').value.trim(),
      appId: document.getElementById('appId').value.trim(),
      platform: document.getElementById('platform').value,
      files: assetFiles.map(f => ({ sha256: f.sha256, fileName: f.fileName }))
    };

    if (!formData.appId) delete formData.appId;
    if (!formData.platform) delete formData.platform;

    const redirectHash = [...formData.files].map(f => f.sha256).sort()[0];

    const spinner = document.getElementById('loadingSpinner');
    spinner.style.display = 'block';

    try {
      for (const file of assetFiles) {
        if (!file.data || file.uploaded) {
          continue;
        }
        if ((file.data.size / 1024 / 1024) <= maxFileSize) {
          await uploadToBlossom(file.data, file.sha256);
        }
      }

      await createAssetBundleRegistration(formData);

      spinner.style.display = 'none';
      await showToast('Asset registered successfully!');
      window.location.href = '/asset/?sha256=' + redirectHash;
    } catch (error) {
      spinner.style.display = 'none';
      showToast(error.message, 'error');
    }
  }

  let newAssetPageInitialized = false;

  function initializeNewAssetPage() {
    if (newAssetPageInitialized) {
      return;
    }
    newAssetPageInitialized = true;

    setupAssetFilesDropZone();

    const urlParams = new URLSearchParams(window.location.search);
    const loadedFromSession = loadPendingAssetFiles();
    if (!loadedFromSession) {
      loadAssetFilesFromUrlParams(urlParams);
    }
    displayAssetFiles();

    const showError = (message) => {
      document.querySelector('.form-container').style.display = 'none';

      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.innerHTML = `
        <p>${message}</p>
        <p><a href="/nostr/" target="_blank">(learn more about Nostr)</a></p>
        <p><a href="/assets/" class="btn btn-info">Return to assets page</a></p>`;

      document.querySelector('.form-container').insertAdjacentElement('beforebegin', errorDiv);
    };

    if (window.wallets && window.wallets.length > 0) {
      setupAppIdAutocomplete();
    }

    const fields = ['description', 'version', 'appId', 'platform'];
    fields.forEach(field => {
      const value = DOMPurify.sanitize(urlParams.get(field), purifyConfig);
      if (value) {
        document.getElementById(field).value = value;
      }
    });
  }

  window.addEventListener('verificationsUILoaded', initializeNewAssetPage);

  window.addEventListener('allWalletsLoaded', async () => {
    setupAppIdAutocomplete(false);
  });
</script>
