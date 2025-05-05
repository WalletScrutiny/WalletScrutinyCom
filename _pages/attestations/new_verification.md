---
layout: archive
permalink: /new_verification/
---

<link rel="stylesheet" href="{{ base_path }}/assets/css/verifications.css">

<script type="text/javascript" src="{{'/dist/verifications.bundle.min.js' | relative_url }}"></script>

<style>
    .hash-input-container {
        display: flex;
        gap: 10px;
        margin-bottom: 10px;
    }
    .hash-list {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .hash-list:not(:empty) {
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 8px;
        margin-top: 5px;
    }
    .hash-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 5px;
        border-radius: 4px;
    }
    .hash-item span {
        flex: 1;
        word-break: break-all;
    }
    .remove-hash {
        color: red;
        cursor: pointer;
        border: none;
        background: none;
        padding: 0 5px;
    }
    .drop-zone {
        background-color: #f8f9fa; /* Light background color */
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
    .file-list {
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .file-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 10px;
        border-radius: 4px;
        background-color: var(--neutral-5);
        border: 1px solid #e9ecef;
        transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }
    .file-item:hover {
        background-color: #cfcfcf;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .file-item span {
        flex: 1;
        word-break: break-word;
        font-size: 0.95em;
        color: var(--neutral-0);
    }
    .remove-file {
        color: red;
        cursor: pointer;
        border: none;
        background: none;
        padding: 5px 8px;
        font-size: 2.1em;
        border-radius: 50%;
        transition: background-color 0.2s ease, color 0.2s ease;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
    }
    .remove-file:hover {
        background-color: rgba(255, 0, 0, 0.1);
    }

    /* Styles for attachment scripts */
    .available-scripts-container {
        margin-top: 50px;
        margin-bottom: 50px;
        border: 1px solid #ced4da;
        border-radius: 5px;
        padding: 13px;
        background-color: var(--neutral-6);
        display: none;
    }
    .available-scripts-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 200px;
        overflow-y: auto;
        border-top: 1px solid #e9ecef;
    }
    .script-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 10px;
        border-radius: 4px;
        background-color: var(--neutral-5);
        border: 1px solid #e9ecef;
        transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }
    .script-item:hover {
        background-color: #cfcfcf;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .script-item span {
        flex: 1;
        word-break: break-word;
        font-size: 0.95em; /* Slightly smaller font */
        color: var(--neutral-0);
    }
    .add-script {
        color: green;
        cursor: pointer;
        border: none;
        background: none;
        padding: 5px 8px;
        font-size: 1.3em;
        border-radius: 50%;
        transition: background-color 0.2s ease, color 0.2s ease;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
    }
    .add-script:hover {
        background-color: rgba(0, 128, 0, 0.1);
    }
    .add-script[style*="color: red"]:hover {
        background-color: rgba(255, 0, 0, 0.1);
    }
</style>

<h1 id="pageTitle" class="page__title">Creating New Verification</h1>

<div class="form-container">
    <div class="info-message"></div>

    <div id="previousAttestations" style="margin-bottom: 3em;"></div>

    <div>
        <p>Fields marked with (*) are required.</p>
    </div>

    <form id="attestationForm" onsubmit="handleSubmit(event)">
        <div class="form-group">
            <label for="appId">App ID:</label>
            <input type="text" id="appId" name="appId" class="form-control" autocomplete="off" maxlength="50">
            <div id="appIdSuggestions" class="suggestions-container"></div>
            <small class="form-text">Example: app.zeusln.zeus. Start typing wallet name or ID to search for known apps, or write a new app ID.</small>
            <small class="form-text" style="margin-bottom: 1em;">If you <b>can't find the app here</b>, you can <a href="https://gitlab.com/walletscrutiny/walletScrutinyCom/-/wikis/How-to-Contribute-to-WalletScrutiny#add-products" target="_blank">open an MR</a> to add it to the inventory, or drop us a message on our <a href="https://discord.com/channels/1011450447392940082/1012176837486596106" target="_blank">Discord</a>.</small>
        </div>

        <div class="form-group">
            <label for="version">Version (*):</label>
            <input type="text" id="version" name="version" class="form-control" required maxlength="15">
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

        <div class="form-group">
            <label for="status">Status (*):</label>
            <select id="status" name="status" class="form-control" required>
                <option value="">Select a status</option>
                <option value="reproducible">Reproducible</option>
                <option value="not_reproducible">Not Reproducible</option>
                <option value="ftbfs">Failed to Build from Source</option>
                <option value="spam">Spam</option>
                <option value="notag">No git revision</option>
                <option value="nosource">No source</option>
                <option value="obfuscated">Obfuscated</option>
                <option value="warning">Warning</option>
            </select>
        </div>

        <div style="margin-top: 1em; margin-bottom: 2em; font-size:smaller">
            <p>
                <b>Reproducible:</b> You've been able to build the asset and differences with the tested binary are minimal.
            </p>
            <p>
                <b>Not Reproducible:</b> You've been able to build the asset, but differences with the tested binary are significant.
            </p>
            <p>
                <b>Failed to Build from Source:</b> You failed to build the asset from source.
            </p>
            <p>
                <b>Spam:</b> The asset is a spam or is not what it says it is.
            </p>
            <p>
                <b>No git revision:</b> The git revision to compile is not clear.
            </p>
            <p>
                <b>No source:</b> The source for this version was not found or the repository was taken down.
            </p>
            <p>
                <b>Obfuscated:</b> The source code is obfuscated.
            </p>
            <p>
                <b>Warning:</b> If another status could apply but some red flag has come up. Reproducible but known backdoor found, or irreproducible with a discrepancy clearly not benign.
            </p>
        </div>

        <div class="form-group">
            <label for="content">Content (*):</label>
            <div class="char-counter">Characters: <span id="charCount">0</span>/60000</div>
            <textarea id="content" name="content" class="form-control" rows="10" required></textarea>
            <small class="form-text">Describe your verification process and findings with as much detail as possible, including scripts you used and output logs (minimum 20, maximum 60000 characters). Markdown is supported.</small>
        </div>

        <div class="form-group">
            <label id="hashesLabel"></label>
            <div class="hash-input-container">
                <input type="text" id="newHash" class="form-control" placeholder="Enter hash">
                <button type="button" id="addHash" class="btn btn-primary" title="Add this hash to the list">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div id="hashList" class="hash-list"></div>
            <small class="form-text" id="hashesHelpText"></small>
        </div>

        <!-- Script Usage Selector -->
        <div class="form-group">
            <label for="scriptUsage">Script Usage:</label>
            <select id="scriptUsage" name="scriptUsage" class="form-control">
                <option value="none">Manual build (no scripts used or instructions are specified in the content field)</option>
                <option value="reuse">Use script from another verification</option>
                <option value="upload">Upload new script</option>
            </select>
            <small class="form-text">Select how you are providing build verification scripts, if any.</small>
        </div>
        <!-- End Script Usage Selector -->

        <!-- File Dropzone Area -->
        <div id="fileDropzoneArea" class="form-group" style="margin-top: 2em; display: none;">
            <label for="fileInput" id="dropZone" class="drop-zone">
                <span class="drop-zone-text">If you've used <b>scripts</b> or <b>docker files</b> to build the asset, <b>drag & drop</b> them here to attach them (max 60KB each). Each file will be linked to this verification and could be used by other users to reproduce the asset.</span>
            </label>
            <input type="file" id="fileInput" multiple hidden>
            <div id="fileList" class="file-list"></div>
        </div>
        <!-- End File Dropzone Area -->

        <div id="availableScriptsContainer" class="form-group available-scripts-container">
            <label>If you've used a script created by another user in a different verification, mark it here with the <i class="fas fa-plus" style="color: green;"></i> icon:</label>
            <div id="availableScriptsList" class="available-scripts-list"></div>
        </div>

        <button type="submit" name="draft" class="btn btn-info" style="margin-right: 1em; margin-top: 2em">Publish Verification as a Draft</button>
        <button type="submit" name="publish" class="btn btn-success" style="margin-right: 1em; margin-top: 2em">Publish Verification</button>
        <a id="deleteDraft" style="color: red; cursor: pointer;">Delete Draft</a>
        <p>
            <small>
                <b>Note:</b> Draft verifications are not displayed directly, but they can still be seen by you and other users if they opt to view them. You'll be able to view them and publish them later.
            </small>
        </p>
    </form>
</div>

<div id="verificationModal">
    <span id="closeModal">&times;</span>
    <div id="verificationContent"></div>
</div>

<script>
  let otherHashes = [];
  let newHashInputField;
  let uploadedFiles = []; // Store File objects
  let reusedFileIds = [];

  function addHash(hash) {
    if (!hash) return;
    if (otherHashes.includes(hash)) {
      showToast('This hash is already in the list', 'error');
      return;
    }

    const hashItem = document.createElement('div');
    hashItem.className = 'hash-item';
    hashItem.innerHTML = `
    <span>${hash}</span>
    <button type="button" class="remove-hash" title="Remove this hash from the list">
      <i class="fas fa-minus"></i>
    </button>
  `;

    hashItem.querySelector('.remove-hash').addEventListener('click', () => {
      otherHashes = otherHashes.filter(h => h !== hash);
      hashItem.remove();
    });

    document.getElementById('hashList').appendChild(hashItem);
    otherHashes.push(hash);
    if (newHashInputField) {
      newHashInputField.value = '';
    }
  }

  function validateForm() {
    const content = document.getElementById('content').value.trim();

    if (content.length < 20) {
      showToast('Content must be at least 20 characters long', 'error');
      return false;
    }
    if (content.length > 60000) {
      showToast('Content cannot exceed 60000 characters', 'error');
      return false;
    }

    for (const file of uploadedFiles) {
      if (file.size > 60000) {
        showToast(`File "${file.name}" is too large (max 60KB)`, 'error');
        return false;
      }
    }
    return true;
  }

  // --- New File Handling Functions ---
  function displayFiles() {
    const fileListElement = document.getElementById('fileList');
    fileListElement.innerHTML = ''; // Clear existing list

    uploadedFiles.forEach((file, index) => {
      const fileItem = document.createElement('div');
      fileItem.className = 'file-item';
      fileItem.innerHTML = `
      <span>${file.name} (${(file.size / 1024).toFixed(1)} KB)</span>
      <button type="button" class="remove-file" title="Remove this file" data-index="${index}">×</button>
    `;
      fileItem.querySelector('.remove-file').addEventListener('click', (e) => {
        const indexToRemove = parseInt(e.target.getAttribute('data-index'));
        uploadedFiles.splice(indexToRemove, 1);
        displayFiles(); // Update the list
      });
      fileListElement.appendChild(fileItem);
    });
  }

  function handleFiles(files) {
    const newFiles = Array.from(files);
    let errors = [];
    newFiles.forEach(file => {
      if (file.size > 60000) {
        errors.push(`File "${file.name}" exceeds the 60KB limit.`);
      } else {
        // Avoid duplicates based on name and size (simple check)
        if (!uploadedFiles.some(f => f.name === file.name && f.size === file.size)) {
          uploadedFiles.push(file);
        } else {
          errors.push(`File "${file.name}" is already added.`);
        }
      }
    });
    if (errors.length > 0) {
      showToast(errors.join('<br>'), 'error', errors.length * 2000); // Show errors longer
    }
    displayFiles();
  }

  function setupDropZone() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');

    fileInput.addEventListener('change', (e) => {
      handleFiles(e.target.files);
      fileInput.value = ''; // Reset input to allow selecting the same file again
    });

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      handleFiles(e.dataTransfer.files);
    });
  }
  // --- End File Handling Functions ---


  async function loadUrlParamsAndGetAssetInfo() {
    const showError = (message) => {
      document.querySelector('.form-container').style.display = 'none';

      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.innerHTML = `
      <p>${message}</p>
      <p><a href="/assets/" class="btn btn-info">Return to assets page</a></p>
    `;

      document.querySelector('.form-container').insertAdjacentElement('beforebegin', errorDiv);
    };

    if (!await userHasBrowserExtension()) {
      showError('A Nostr browser extension is required to create verifications.');
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const draftVerificationEventId = urlParams.get('draftVerificationEventId');
    const action = urlParams.get('action');

    if (draftVerificationEventId && action) {
      const draftButton = document.querySelector('button[name="draft"]');
      if (draftButton) {
        draftButton.textContent = 'Save Draft Verification';
      }

      document.getElementById('pageTitle').textContent = 'Editing Draft Verification';
      document.title = 'Editing Draft Verification | Wallet Scrutiny';

      const draftVerificationEvent = await getDraftVerificationEvent(draftVerificationEventId);
      if (draftVerificationEvent) {
        const fileEventIds = getFileAttachmentIDsForVerificationEvent(draftVerificationEvent);
        const attachments = await getFileAttachmentEvents(fileEventIds);

        attachments.forEach(attachment => {
          const name = attachment.tags.find(tag => tag[0] === 'filename')?.[1] || '';
          const size = attachment.tags.find(tag => tag[0] === 'size')?.[1] || '';
          const attachmentContent = atob(attachment.content);
          const attachmentContentType = attachment.tags.find(tag => tag[0] === 'content-type')?.[1] || 'application/octet-stream';

          uploadedFiles.push({
            name: name,
            size: size,
            type: attachmentContentType,
            data: attachmentContent
          });
        });
        displayFiles();

        // If files were loaded from the draft, set the script usage selector to 'upload'
        if (uploadedFiles.length > 0) {
          document.getElementById('scriptUsage').value = 'upload';
          handleScriptSectionVisibility();
        }

        const eventContent = JSON.parse(draftVerificationEvent.content);

        document.getElementById('appId').value = draftVerificationEvent.tags.find(tag => tag[0] === 'i')?.[1] || '';
        document.getElementById('version').value = draftVerificationEvent.tags.find(tag => tag[0] === 'version')?.[1] || '';
        document.getElementById('platform').value = draftVerificationEvent.tags.find(tag => tag[0] === 'platform')?.[1] || '';
        document.getElementById('description').value = eventContent.description || '';
        document.getElementById('status').value = draftVerificationEvent.tags.find(tag => tag[0] === 'status')?.[1] || '';
        document.getElementById('content').value = eventContent.content || '';

        const hashes = draftVerificationEvent.tags?.filter(tag => tag[0] === 'x').map(tag => tag[1]) || [];
        hashes.forEach(hash => addHash(hash));
      } else {
        showToast('Draft verification not found', 'error');
      }
    } else {
      const deleteDraftBtn = document.getElementById('deleteDraft');
      if (deleteDraftBtn) {
        deleteDraftBtn.style.display = 'none';
      }
    }

    if (window.wallets && window.wallets.length > 0) {
      setupAppIdAutocomplete();
    }

    const fields = ['version', 'appId', 'platform'];
    fields.forEach(field => {
      const value = DOMPurify.sanitize(urlParams.get(field), purifyConfig);
      if (value) {
        document.getElementById(field).value = value;
      }
    });

    const sha256 = DOMPurify.sanitize(urlParams.get('sha256'), purifyConfig);

    // Update the hashes label based on whether sha256 is present
    const hashesLabel = document.getElementById('hashesLabel');
    const hashesHelpText = document.getElementById('hashesHelpText');
    if (sha256) {
      hashesLabel.textContent = 'Additional related hashes:';
      hashesHelpText.textContent = 'If you find other related binaries (e.g., APKs within an AAB) that are also reproducible, you can add the hashes of those additional binaries to your verification.';
    } else {
      hashesLabel.textContent = 'Asset hashes*:';
      hashesHelpText.textContent = 'Add the SHA-256 hash(es) of the asset(s) you are verifying. Each hash must be 64 hexadecimal characters.';
    }

    let message = '';

    if (sha256) {
      // Show asset information and previous verifications
      const result = await renderAssetsTable({
        htmlElementId:'previousAttestations',
        sha256: sha256,
        hideConfig: {buttons: true}
      });

      if (!result.hasVerifications) {
        document.getElementById('previousAttestations').style.display = 'none';
      }

      if (result.hasVerifications) {
        message = '<p>You are about to create a verification for a specific asset. Below you can find the asset information and other verifications that were made. Feel free to review them before creating your own.</p>';
      } else {
        message = '<p>Below you can find the asset information. Since there are no previous verifications, you will be the first one to provide feedback about this asset.</p>';
      }
    }

    message += '<p>To create the verification, fill all the fields, describing your verification process and findings with as much detail as possible.</p>';
    const infoMessage = document.querySelector('.info-message');
    infoMessage.innerHTML = message;

    // Initial call to load scripts if appId is pre-filled
    const initialAppId = document.getElementById('appId').value.trim();
    if (initialAppId) {
      await loadAndDisplayAvailableScripts(initialAppId);
    }
  }

  async function loadAndDisplayAvailableScripts(appId) {
    const availableScriptsContainer = document.getElementById('availableScriptsContainer');
    const availableScriptsList = document.getElementById('availableScriptsList');
    const scriptUsageSelector = document.getElementById('scriptUsage');

    availableScriptsContainer.style.display = 'none'; // Hide by default
    availableScriptsList.innerHTML = '';

    if (appId) {
      try {
        const attachments = await getAllAttachmentsForAppId(appId);

        if (attachments.length > 0 && scriptUsageSelector.value === 'reuse') {
          availableScriptsContainer.style.display = 'block';
          attachments.forEach(attachment => {
            const name = attachment.tags.find(tag => tag[0] === 'filename')?.[1] || 'Unnamed Script';
            const size = attachment.tags.find(tag => tag[0] === 'size')?.[1];
            const sizeText = size ? `(${(size / 1024).toFixed(1)} KB)` : '';
            const attachmentContent = atob(attachment.content);
            const attachmentContentType = attachment.tags.find(tag => tag[0] === 'content-type')?.[1] || 'application/octet-stream';

            const parentVerificationEvent = attachment.parentVerificationEvent;
            const version = parentVerificationEvent.tags.find(tag => tag[0] === 'version')?.[1];
            const status = parentVerificationEvent.tags.find(tag => tag[0] === 'status')?.[1];

            const app = window.wallets.find(it => it.appId === appId) ?? null;
            const appTitle = app?.title ?? appId;

            const scriptItem = document.createElement('div');
            scriptItem.className = 'script-item';
            scriptItem.innerHTML = `
            <span>${name} ${sizeText} ${version ? ` - (used in verification for ${appTitle} v${version} ${status ? ` - ${status}` : ''})` : ''}</span>
            <button type="button" class="add-script" title="Mark this script as used in this verification">
              <i class="fas fa-plus"></i>
            </button>`;

            const addScriptButton = scriptItem.querySelector('.add-script');
            const icon = addScriptButton.querySelector('i');
            const attachmentId = attachment.id; // Store attachment id

            // Check if already added on load
            if (reusedFileIds.includes(attachmentId)) {
              icon.classList.remove('fa-plus');
              icon.classList.add('fa-minus');
              addScriptButton.title = "Remove this script from the verification";
              addScriptButton.style.color = 'red';
            }

            addScriptButton.addEventListener('click', () => {
              const isAdding = icon.classList.contains('fa-plus');
              const fileSize = size ? parseInt(size) : new Blob([attachmentContent]).size;

              if (isAdding) {
                // Prevent adding if the same file (based on name/size/type/content) is already uploaded
                if (uploadedFiles.some(f => f.name === name && f.size === fileSize && f.type === attachmentContentType && f.data === attachmentContent)) {
                  showToast(`Script "${name}" is already uploaded. Cannot reuse and upload the same script.`, 'warning');
                  return;
                }

                if (reusedFileIds.includes(attachmentId)) {
                  showToast(`Script "${name}" is already marked for reuse.`, 'warning');
                  return;
                }

                reusedFileIds.push(attachmentId);
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
                addScriptButton.title = "Remove this script from the verification";
                addScriptButton.style.color = 'red'; // Change color to red
                showToast(`Script "${name}" added to the verification.`, 'success');
              } else {
                // Remove the ID from the reused list
                reusedFileIds = reusedFileIds.filter(id => id !== attachmentId);
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');
                addScriptButton.title = "Mark this script as used in this verification";
                addScriptButton.style.color = 'green'; // Change color back to green
                showToast(`Script "${name}" removed from the verification.`, 'info');
              }
            });

            availableScriptsList.appendChild(scriptItem);
          });
        }
      } catch (error) {
        console.error('Error fetching attachments for appId', appId, ':', error);
        showToast('Error fetching available scripts.', 'error');
      }
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitter = event.submitter;
    const isDraft = submitter.name === 'draft';

    showToast(isDraft ? 'Publishing draft...' : 'Publishing verification...', 'info', 3000);

    document.getElementById('loadingSpinner').style.display = 'block';

    // Process files *before* calling createVerification
    let uploadedFileData = [];
    try {
      for (const file of uploadedFiles) {
        let base64Data = '';
        if (file.data) {
          // File from draft, data is already available as a string
          base64Data = btoa(file.data);
        } else if (file instanceof File) {
          // Standard File object, read its content asynchronously
          const buffer = await file.arrayBuffer();
          // Convert ArrayBuffer to binary string for btoa
          const bytes = new Uint8Array(buffer);
          let binaryString = '';
          for (let i = 0; i < bytes.byteLength; i++) {
            binaryString += String.fromCharCode(bytes[i]);
          }
          base64Data = btoa(binaryString);
        }

        uploadedFileData.push({
          name: file.name,
          type: file.type || 'application/octet-stream', // Default MIME type
          size: file.size,
          base64Data: base64Data
        });
      }
    } catch (error) {
      document.getElementById('loadingSpinner').style.display = 'none';
      showToast(`Error processing files: ${error.message}`, 'error');
      return; // Stop submission if file processing fails
    }

    const sha256 = DOMPurify.sanitize(new URLSearchParams(window.location.search).get('sha256'), purifyConfig);
    const assetEventId = DOMPurify.sanitize(new URLSearchParams(window.location.search).get('assetEventId'), purifyConfig);
    const draftVerificationEventId = DOMPurify.sanitize(new URLSearchParams(window.location.search).get('draftVerificationEventId'), purifyConfig);

    // Combine sha256 and otherHashes into a single parameter
    let hashes = sha256 ? [sha256] : [];
    if (otherHashes.length > 0) {
      hashes = hashes.concat(otherHashes);
    }

    const formData = {
      hashes: hashes,
      description: document.getElementById('description').value.trim(),
      content: document.getElementById('content').value.trim(),
      appId: document.getElementById('appId').value.trim(),
      version: document.getElementById('version').value.trim(),
      status: document.getElementById('status').value,
      platform: document.getElementById('platform').value,
      assetEventId: assetEventId,
      isDraft: isDraft,
      draftVerificationEventId: draftVerificationEventId,
      uploadedFileData: uploadedFileData,
      reusedFileIds: reusedFileIds
    };

    try {
      await createVerification(formData);
      document.getElementById('loadingSpinner').style.display = 'none';
      await showToast(isDraft ? 'Draft published successfully!' : 'Verification published successfully!');

      if (!isDraft && hashes.length > 0) {
        window.location.href = '/asset/?sha256=' + hashes[0]; // Redirect using the first hash
      } else if (!isDraft) {
        window.location.href = '/assets/'; // Fallback redirect if no hash
      }
      // No redirect for drafts, user stays on page
    } catch (error) {
      document.getElementById('loadingSpinner').style.display = 'none';
      showToast(error.message, 'error');
    }
  }

  function updateCharCount() {
    const content = document.getElementById('content').value;
    const charCount = document.getElementById('charCount');
    charCount.textContent = content.length;

    const charCounter = document.querySelector('.char-counter');
    if (content.length > 60000) {
      charCounter.style.color = 'red';
      charCounter.style.fontWeight = 'bold';
      charCounter.style.fontSize = '1.2em';
    } else {
      charCounter.style.color = '#666';
      charCounter.style.fontWeight = 'normal';
      charCounter.style.fontSize = '1em';
    }
  }

  function handleScriptSectionVisibility() {
    const selection = document.getElementById('scriptUsage').value;
    const dropzoneArea = document.getElementById('fileDropzoneArea');
    const availableScriptsArea = document.getElementById('availableScriptsContainer');
    const appId = document.getElementById('appId').value.trim(); // Get current appId

    dropzoneArea.style.display = 'none';
    availableScriptsArea.style.display = 'none';

    if (selection === 'upload') {
      dropzoneArea.style.display = 'block';
    } else if (selection === 'reuse') {
      loadAndDisplayAvailableScripts(appId);
    }
  }

  document.addEventListener('DOMContentLoaded', async function() {
    await loadUrlParamsAndGetAssetInfo();
    updateCharCount(); // Initial count
    setupDropZone();

    // Script Usage Selector Logic
    const scriptUsageSelector = document.getElementById('scriptUsage');
    scriptUsageSelector.addEventListener('change', handleScriptSectionVisibility);
    handleScriptSectionVisibility();

    document.getElementById('content').addEventListener('input', updateCharCount);

    // Hash management
    newHashInputField = document.getElementById('newHash');
    const addHashBtn = document.getElementById('addHash');

    const deleteDraftBtn = document.getElementById('deleteDraft');
    deleteDraftBtn.addEventListener('click', async function() {
      const urlParams = new URLSearchParams(window.location.search);
      const draftVerificationEventId = urlParams.get('draftVerificationEventId');
      await deleteDraftVerification(draftVerificationEventId, '/assets/');
    });

    // Add event listener for appId input
    const appIdInput = document.getElementById('appId');
    appIdInput.addEventListener('input', async (event) => {
      const appId = event.target.value.trim();
      if (scriptUsageSelector.value === 'reuse') {
        await loadAndDisplayAvailableScripts(appId);
      }
    });

    addHashBtn.addEventListener('click', () => {
      const hash = newHashInputField.value.trim();
      if (!hash) {
        showToast('Please enter a hash value', 'error');
        return;
      }
      if (!/^[a-fA-F0-9]{64}$/.test(hash)) {
        showToast('Invalid hash format. Must be 64 hexadecimal characters', 'error');
        return;
      }
      addHash(hash);
    });

    newHashInputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addHashBtn.click();
      }
    });
  });
</script>