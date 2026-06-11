---
layout: archive
permalink: /new_verification/
---

{% assign maxFileAttachmentContentLength = 48235 %}

<style>
      /* Tab styling with light/dark mode support */
      .tab-button {
        background-color: #444; /* Dark background for inactive tab in both modes */
        border: 1px solid var(--neutral-4);
        padding: 0.4em 1em;
        border-radius: 5px 5px 0 0;
        font-weight: bold;
        cursor: pointer;
        color: rgba(255, 255, 255, 0.25); /* 75% opacity white text for inactive tab */
      }
      .tab-button:hover {
        background-color: #555;
        color: rgba(255, 255, 255, 0.4); /* Slightly more visible on hover */
      }
      .tab-button.active {
        background-color: #f5f5f5; /* Light background for active tab in both modes */
        border: 1px solid var(--neutral-4);
        border-bottom: 1px solid #f5f5f5;
        position: relative;
        top: 1px;
        z-index: 2;
        color: #333; /* Dark text for active tab */
      }

      #editorContainer {
        border: 1px solid var(--neutral-4);
        border-top: none;
        padding: 0;
        border-radius: 0 0 5px 5px;
        position: relative;
        z-index: 1;
      }
      #editorTabs {
        display: flex;
        gap: 0.5em;
        margin-bottom: 0;
        position: relative;
        top: 1px;
        z-index: 1;
      }
      #editorContainer .form-control {
        margin: 0;
        border-radius: 0 0 5px 5px;
      }

      #content::placeholder {
        color: var(--neutral-2);
        opacity: 0.75;
      }

      /* Markdown preview styling */
      #markdownPreview h1, #markdownPreview h2, #markdownPreview h3, 
      #markdownPreview h4, #markdownPreview h5, #markdownPreview h6 {
        margin-top: 1em;
        margin-bottom: 0.5em;
        line-height: 1.2;
      }
      #markdownPreview h1 {
        font-size: 2em;
        border-bottom: 1px solid var(--neutral-4);
        padding-bottom: 0.3em;
        text-align: left;
      }
      #markdownPreview h2 {
        font-size: 1.5em;
        border-bottom: 1px solid var(--neutral-4);
        padding-bottom: 0.3em;
      }
      #markdownPreview h3 {
        font-size: 1.3em;
      }
      #markdownPreview h4 {
        font-size: 1.1em;
      }
      #markdownPreview p {
        margin: 0.5em 0;
      }
      /* Compact list styling */
      #markdownPreview h3 {
        margin-top: 0.8em;
        margin-bottom: 0.3em;
      }
      #markdownPreview ul {
        list-style-type: disc;
        padding-left: 2em;
        margin: 0.2em 0;
      }
      #markdownPreview ol {
        list-style-type: decimal;
        padding-left: 2em;
        margin: 0.2em 0;
      }
      #markdownPreview ul ul,
      #markdownPreview ol ul {
        list-style-type: circle;
        margin: 0;
      }
      #markdownPreview ul ul ul,
      #markdownPreview ol ul ul {
        list-style-type: square;
      }
      #markdownPreview ul ol,
      #markdownPreview ol ol {
        list-style-type: lower-alpha;
        margin: 0;
      }
      #markdownPreview ul ol ol,
      #markdownPreview ol ol ol {
        list-style-type: lower-roman;
      }
      #markdownPreview li {
        margin: 0;
        line-height: 1.2;
      }
      /* Fix spacing between list items */
      #markdownPreview ul li,
      #markdownPreview ol li {
        margin-bottom: 0;
        padding-bottom: 0;
      }
      #markdownPreview blockquote {
        border-left: 4px solid var(--neutral-4);
        padding-left: 1em;
        margin: 0.5em 0;
        color: var(--neutral-2);
      }
      
      /* Code block styling */
      #markdownPreview pre,
      #markdownPreview code {
        font-family: monospace;
      }
      #markdownPreview pre {
        background-color: rgba(0, 0, 0, 0.07); /* Light gray with opacity that works in both modes */
        border: none;
        border-radius: 4px;
        padding: 0.8em;
        overflow-x: auto;
        margin: 0.5em 0;
      }
      #markdownPreview pre code {
        display: block;
        background: none;
        border: none;
        padding: 0;
        line-height: 1.4;
      }
      #markdownPreview code {
        background-color: rgba(0, 0, 0, 0.07); /* Light gray with opacity that works in both modes */
        border: none;
        border-radius: 3px;
        padding: 0.2em 0.4em;
        font-size: 0.9em;
      }
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
    .script-item .pubkey-link {
        color: inherit;
        text-decoration: underline;
        cursor: pointer;
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

    <div id="youWillLoseEndorsements" style="margin-bottom: 3em; display: none;">
      <p>If you edit this verification, you will lose all endorsements.</p>
    </div>

    <div id="previousAttestations" style="margin-bottom: 3em;"></div>

    <div id="issueTrackerInfo" style="margin-bottom: 3em;"></div>

    <div>
        <p>Fields marked with (*) are required.</p>
    </div>

    <form id="attestationForm" onsubmit="handleSubmit(event)">
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

        <div id="issueTrackerField" class="form-group">
            <label for="issueTrackerUrl">Issue tracker url:</label>
            <input type="url" id="issueTrackerUrl" name="issueTrackerUrl" class="form-control" placeholder="https://github.com/example/repo/issues/123">
            <small class="form-text">If this version is not reproducible or you want to provide more information to the maintainers, you could open an issue in the wallet's issue tracker and put the url here for reference.</small>
        </div>

        <div class="form-group">
            <label for="content">Description (*):</label>
            <div class="char-counter">Characters: <span id="charCount">0</span>/60000</div>
            <div id="editorTabs" style="display: flex; gap: 0.5em;">
                <button type="button" id="writeTab" class="tab-button active">Write</button>
                <button type="button" id="previewTab" class="tab-button">Preview</button>
            </div>

            <div id="editorContainer">
                <textarea id="content" name="content" class="form-control" rows="10" required placeholder="Describe how you performed the verification and what you found (steps, commands you ran manually, conclusions, and references to hashes or diffs). This will appear on the verification page and should be detailed enough to let other users reproduce the verification.&#10;&#10;Use the fields below to upload the scripts you used to build the asset, and the output files (logs, asciicasts, diffoscope reports, etc.). Avoid pasting very large logs here unless a short excerpt is enough for context."></textarea>
                <div id="markdownPreview" class="form-control" style="display:none; padding:1em; background:var(--neutral-6); border:1px solid var(--neutral-4); border-radius:4px; min-height:10em; color:var(--text);"></div>
            </div>
            <small class="form-text">Minimum 20 characters, maximum 60000. Markdown is supported. Prefer the script and file sections below for scripts and bulky logs.</small>
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
                <option value="upload">Upload new scripts</option>
            </select>
            <small class="form-text">Select how you are providing build verification scripts, if any.</small>
        </div>
        <!-- End Script Usage Selector -->

        <!-- File Dropzone Area -->
        <div id="fileDropzoneArea" class="form-group" style="margin-top: 2em; display: none;">
            <label for="fileInput" id="dropZone" class="drop-zone">
                <span class="drop-zone-text">If you've used <b>scripts</b> or <b>docker files</b> to build the asset, <b>drag & drop</b> them here to attach them (max {{ maxFileAttachmentContentLength | divided_by: 1024 }} KB each). Each file will be linked to this verification and could be used by other users to reproduce the asset.</span>
            </label>
            <input type="file" id="fileInput" multiple hidden>
            <div id="fileList" class="file-list"></div>
        </div>
        <!-- End File Dropzone Area -->

        <!-- Blossom File Dropzone Area -->
        <div id="blossomDropzoneArea" class="form-group" style="margin-top: 2em;">
            <label for="blossomFileInput" id="blossomDropZone" class="drop-zone">
                <span class="drop-zone-text" style="width: 100%">
                  <p>For larger files, <b>drag & drop</b> them here to upload to our server. These files will be uploaded when you save or publish your verification.</p>
                  <p>- <b>Asciicast</b> files are supported (*.cast). The first one will autoplay in the verification.</p>
                  <p>- <b>Diffoscope</b> files are supported (diffo*.html).</p>
                  <p>- You can also upload other log files, like build logs showing successful or failed builds.</p>
                </span>
            </label>
            <input type="file" id="blossomFileInput" multiple hidden>
            <div id="blossomFileList" class="file-list"></div>
        </div>
        <div class="blossom-upload-status"></div>
        <!-- End Blossom File Dropzone Area -->

        <div id="availableScriptsContainer" class="form-group available-scripts-container">
            <label>If you've used a script created by another user in a different verification, mark it here with the <i class="fas fa-plus" style="color: green;"></i> icon:</label>
            <div id="availableScriptsList" class="available-scripts-list"></div>
        </div>

        <button type="submit" name="draft" class="btn btn-info" style="margin-right: 1em; margin-top: 2em">Publish Verification as a Draft</button>
        <button type="submit" name="publish" class="btn btn-success" style="margin-right: 1em; margin-top: 2em">Publish Verification</button>
        <a id="deleteDraft" style="color: red; cursor: pointer;">Delete Draft</a>
        <p>
            <small>
                <b>Note:</b> Draft verifications are not displayed by default, but they can still be viewed by you and other users who choose to see them. You’ll be able to view and publish them later.
            </small>
        </p>
    </form>
</div>

<script>
  let otherHashes = [];
  let newHashInputField;
  let uploadedFiles = []; // Store File objects
  let reusedFileIds = [];
  let outputFiles = []; // Store files for Blossom upload
  const codeSnippetKind = 1337;

  document.getElementById('loadingSpinner').style.display = 'block';

  function getUniqueVerificationHashes(sha256, hashes = otherHashes) {
    return [...new Set([sha256, ...hashes].filter(Boolean))];
  }

  function loadHashesFromUrlParams(urlParams) {
    const sha256 = DOMPurify.sanitize(urlParams.get('sha256'), purifyConfig);
    const extraHashes = urlParams.getAll('hash')
      .map(hash => DOMPurify.sanitize(hash, purifyConfig))
      .filter(hash => hash && /^[a-fA-F0-9]{64}$/.test(hash) && hash !== sha256);

    const allUrlHashes = getUniqueVerificationHashes(sha256, extraHashes);
    const hashesLabel = document.getElementById('hashesLabel');
    const hashesHelpText = document.getElementById('hashesHelpText');

    if (allUrlHashes.length > 1) {
      hashesLabel.textContent = 'Asset hashes:';
      hashesHelpText.textContent = 'These are the SHA-256 hashes of all binaries in this asset bundle.';
      allUrlHashes.forEach(hash => addHash(hash));
    } else if (sha256) {
      hashesLabel.textContent = 'Additional related hashes:';
      hashesHelpText.textContent = 'If you find other related binaries (e.g., APKs within an AAB) that are also reproducible, you can add the hashes of those additional binaries to your verification.';
      extraHashes.forEach(hash => addHash(hash));
    } else {
      hashesLabel.textContent = 'Asset hashes*:';
      hashesHelpText.textContent = 'Add the SHA-256 hash(es) of the asset(s) you are verifying and press the (+) button to add it. Each hash must be 64 hexadecimal characters.';
      extraHashes.forEach(hash => addHash(hash));
    }

    return sha256;
  }

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
      if (file.size > {{ maxFileAttachmentContentLength }}) {
        showToast(`File "${file.name}" is too large (max {{ maxFileAttachmentContentLength | divided_by: 1024 }} KB)`, 'error');
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
      if (file.size > {{ maxFileAttachmentContentLength }}) {
        errors.push(`File "${file.name}" exceeds the {{ maxFileAttachmentContentLength | divided_by: 1024 }} KB limit.`);
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
      showToast(errors.join('\n'), 'error', errors.length * 2000); // Show errors longer
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

  // --- Output File Handling Functions ---
  function displayOutputFiles() {
    const fileListElement = document.getElementById('blossomFileList');
    fileListElement.innerHTML = ''; // Clear existing list

    outputFiles.forEach((file, index) => {
      const fileItem = document.createElement('div');
      fileItem.className = 'file-item';
      fileItem.innerHTML = `
      <span>${file.name} ${!isNaN(file.size) ? `(${(file.size / 1024 / 1024).toFixed(2)} MB)` : ''}</span>
      <button type="button" class="remove-file" title="Remove this file" data-index="${index}">×</button>`;

      fileItem.querySelector('.remove-file').addEventListener('click', (e) => {
        const indexToRemove = parseInt(e.target.getAttribute('data-index'));
        outputFiles.splice(indexToRemove, 1);
        displayOutputFiles(); // Update the list
      });
      fileListElement.appendChild(fileItem);
    });
  }

  async function handleOutputFiles(files) {
    const newFiles = Array.from(files);
    let errors = [];
    
    for (const file of newFiles) {
      // Avoid duplicates based on name and size
      if (!outputFiles.some(f => f.name === file.name && f.size === file.size)) {
        try {
          const hash = await calculateFileHash(file);
          outputFiles.push({
            data: file,
            name: file.name,
            size: file.size,
            hash: hash
          });
        } catch (error) {
          console.error("Error calculating hash for file:", file.name, error);
          errors.push(`Could not calculate hash for "${file.name}": ${error.message}`);
        }
      } else {
        errors.push(`File "${file.name}" is already added.`);
      }
    }
    
    if (errors.length > 0) {
      showToast(errors.join('\n'), 'error', 6000 + (errors.length * 2000));
    }
    displayOutputFiles();
  }

  function setupBlossomDropZone() {
    const dropZone = document.getElementById('blossomDropZone');
    const fileInput = document.getElementById('blossomFileInput');

    fileInput.addEventListener('change', async (e) => {
      await handleOutputFiles(e.target.files);
      fileInput.value = ''; // Reset input to allow selecting the same file again
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
      await handleOutputFiles(e.dataTransfer.files);
    });
  }
  // --- End Output File Handling Functions ---

  async function loadUrlParamsAndGetAssetInfo() {
    const showError = (message) => {
      document.querySelector('.form-container').style.display = 'none';

      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.innerHTML = `
        <p>${message}</p>
        <p><a href="/assets/" class="btn btn-info">Return to assets page</a></p>`;

      document.querySelector('.form-container').insertAdjacentElement('beforebegin', errorDiv);
    };

    const urlParams = new URLSearchParams(window.location.search);
    const draftVerificationEventId = urlParams.get('draftVerificationEventId');
    const verificationEventId = urlParams.get('verificationEventId');
    const action = urlParams.get('action');

    if ((draftVerificationEventId || verificationEventId) && action) {
      if (draftVerificationEventId && draftVerificationEventId.length === 64) {
        const draftButton = document.querySelector('button[name="draft"]');
        if (draftButton) {
          draftButton.textContent = 'Save Draft Verification';
        }
      }

      document.getElementById('pageTitle').textContent = draftVerificationEventId ? 'Editing Draft Verification' : 'Editing Verification';
      document.title = draftVerificationEventId ? 'Editing Draft Verification | Wallet Scrutiny' : 'Editing Verification | Wallet Scrutiny';

      const verificationEvent = await getVerificationEvent(draftVerificationEventId || verificationEventId);
      if (verificationEvent) {
        let isMine = verificationEvent.pubkey === await getUserPubkey();
        if (isMine && verificationEventId) {
          const endorsementsForThisVerification = await getEndorsementsFromVerificationEventIds([verificationEventId]);
          if (endorsementsForThisVerification[verificationEventId] && endorsementsForThisVerification[verificationEventId].length > 0) {
            document.getElementById('youWillLoseEndorsements').style.display = 'block';
          }
        }

        const fileEventIds = getFileAttachmentIDsForVerificationEvent(verificationEvent);
        const attachments = await getEventsFromEventIds(fileEventIds);

        attachments.forEach(attachment => {
          let name;
          if (attachment.kind === codeSnippetKind) {
            const attachmentName = getFirstTagValue(attachment, 'name');
            const extension = getFirstTagValue(attachment, 'extension');
            name = `${attachmentName}.${extension}`;
          } else { // See https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/729
            name = getFirstTagValue(attachment, 'filename');
          }

          const size = getFirstTagValue(attachment, 'size');
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

        const verificationOutputFiles = verificationEvent.tags.filter(tag => tag[0] === 'output-file');
        verificationOutputFiles.forEach(outputFile => {
          outputFiles.push({
            name: outputFile[1],
            hash: outputFile[2]
          });
        });
        displayOutputFiles();

        // If files were loaded from the event (draft or not), set the script usage selector to 'upload'
        if (uploadedFiles.length > 0) {
          document.getElementById('scriptUsage').value = 'upload';
          await handleScriptSectionVisibility();
        }

        const eventContent = JSON.parse(verificationEvent.content);

        document.getElementById('appId').value = getFirstTagValue(verificationEvent, 'i');
        document.getElementById('version').value = getFirstTagValue(verificationEvent, 'version');
        document.getElementById('platform').value = getFirstTagValue(verificationEvent, 'platform');
        document.getElementById('description').value = eventContent.description || '';
        document.getElementById('status').value = getFirstTagValue(verificationEvent, 'status');
        document.getElementById('content').value = eventContent.content || '';
        document.getElementById('issueTrackerUrl').value = getFirstTagValue(verificationEvent, 'issue-tracker-url') || '';

        const hashes = verificationEvent.tags?.filter(tag => tag[0] === 'x').map(tag => tag[1]).filter(id => id.length === 64) || [];
        hashes.forEach(hash => addHash(hash));
      } else {
        showToast('Draft or verification not found', 'error');
      }
    }

    if (!draftVerificationEventId) {
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

    const sha256 = loadHashesFromUrlParams(urlParams);

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

    const initialAppId = document.getElementById('appId').value.trim();
    if (initialAppId) {
      await performAppIdRelatedActions(initialAppId);
    }

    document.getElementById('loadingSpinner').style.display = 'none';
  }

  async function performAppIdRelatedActions(appId, doScriptsTreatment = true) {
    if (appId.length < 3) {
      return;
    }

    document.getElementById('issueTrackerInfo').innerHTML = '';

    const appAssetInformation = await getAllAssetInformation({
      appId
    });

    if (doScriptsTreatment) {
      await loadAndDisplayAvailableScripts(appId, appAssetInformation);
    }

    await showIssueTrackerHtmlWidget(appAssetInformation.verifications, 'issueTrackerInfo', 5);
  }

  async function loadAndDisplayAvailableScripts(appId, appAssetInformation = null) {
    const availableScriptsContainer = document.getElementById('availableScriptsContainer');
    const availableScriptsList = document.getElementById('availableScriptsList');
    const scriptUsageSelector = document.getElementById('scriptUsage');

    availableScriptsContainer.style.display = 'none'; // Hide by default
    availableScriptsList.innerHTML = '';

    if (appId) {
      try {
        const attachments = await getAllAttachmentsForAppId(appId, appAssetInformation);

        if (attachments.length > 0 && scriptUsageSelector.value === 'reuse') {
          availableScriptsContainer.style.display = 'block';
          attachments.forEach(attachment => {
            let name;
            if (attachment.kind === codeSnippetKind) {
              const attachmentName = getFirstTagValue(attachment, 'name');
              const extension = getFirstTagValue(attachment, 'extension');
              name = `${attachmentName}.${extension}`;
            } else {
              name = getFirstTagValue(attachment, 'filename');
            }
            if (!name || name === '.') {
              name = 'Unnamed Script';
            }
            const size = getFirstTagValue(attachment, 'size', null);
            const sizeText = size ? `(${(size / 1024).toFixed(1)} KB)` : '';
            const attachmentContent = atob(attachment.content);
            const attachmentContentType = attachment.tags.find(tag => tag[0] === 'content-type')?.[1] || 'application/octet-stream';
            const parentVerificationEvent = attachment.parentVerificationEvent;
            const version = getFirstTagValue(parentVerificationEvent, 'version', null);
            const status = getFirstTagValue(parentVerificationEvent, 'status', null);
            const pubkey = parentVerificationEvent.pubkey;
            const pubkeyShort = `${pubkey.slice(0, 4)}...${pubkey.slice(-4)}`;
            const verifierHref = `/verifier/?pubkey=${encodeURIComponent(pubkey)}`;

            const app = window.wallets.find(it => it.appId === appId) ?? null;
            const appTitle = app?.title ?? appId;
            const provenance = version
              ? ` - (from verification for ${appTitle} v${version}${status ? ` - ${status}` : ''})`
              : '';

            const scriptItem = document.createElement('div');
            scriptItem.className = 'script-item';
            scriptItem.innerHTML = `
            <span>${name} ${sizeText}${provenance} - by <a href="${verifierHref}" class="pubkey-link" target="_blank" rel="noopener noreferrer">${pubkeyShort}</a></span>
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

            const verifierLinkEl = scriptItem.querySelector('.pubkey-link');
            if (verifierLinkEl) {
              getNostrProfile(pubkey).then(profile => {
                if (profile && profile.name) {
                  verifierLinkEl.textContent = profile.name;
                }
              });
            }
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

    if (outputFiles.length > 0) {
      try {
        showToast('Uploading files to Blossom server, please wait...', 'info', 5000);
        for (const file of outputFiles) {
          await uploadToBlossom(file.data, file.hash);
        }
      } catch (error) {
        document.getElementById('loadingSpinner').style.display = 'none';
        showToast(`Error uploading files to Blossom: ${error.message}`, 'error');
        return;
      }
    }

    const sha256 = DOMPurify.sanitize(new URLSearchParams(window.location.search).get('sha256'), purifyConfig);
    const draftVerificationEventId = DOMPurify.sanitize(new URLSearchParams(window.location.search).get('draftVerificationEventId'), purifyConfig);
    const basedOn = DOMPurify.sanitize(new URLSearchParams(window.location.search).get('basedOn'), purifyConfig);

    const hashes = getUniqueVerificationHashes(sha256, otherHashes);

    const formData = {
      hashes: hashes,
      description: document.getElementById('description').value.trim(),
      content: document.getElementById('content').value.trim(),
      appId: document.getElementById('appId').value.trim(),
      version: document.getElementById('version').value.trim(),
      status: document.getElementById('status').value,
      platform: document.getElementById('platform').value,
      issueTrackerUrl: document.getElementById('issueTrackerUrl').value.trim(),
      isDraft: isDraft,
      draftVerificationEventId: draftVerificationEventId,
      uploadedFileData: uploadedFileData,
      reusedFileIds: reusedFileIds,
      outputFiles: outputFiles,
      basedOn: basedOn
    };

    try {
      const verificationEvent = await createVerification(formData);
      document.getElementById('loadingSpinner').style.display = 'none';
      await showToast(isDraft ? 'Draft published successfully!' : 'Verification published successfully!');

      const walletBaseUrl = `/${document.getElementById("platform").value}/${document.getElementById("appId").value}/`;
      const response = await fetch(walletBaseUrl, { method: 'HEAD' });
      if (response.ok) {
        window.location.href = `${walletBaseUrl}#verificationId=${verificationEvent.id}`;
      } else {
        const userPubkey = await getUserPubkey();
        if (userPubkey) {
          window.location.href = '/verifier/?pubkey=' + userPubkey;
        } else {
          window.location.href = '/assets/'; // Fallback redirect if we couldn't guess the page to redirect to
        }
      }

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
      charCounter.style.color = '#c1c1c1';
      charCounter.style.fontWeight = 'normal';
      charCounter.style.fontSize = '1em';
    }
  }

  async function handleScriptSectionVisibility() {
    const selection = document.getElementById('scriptUsage').value;
    const dropzoneArea = document.getElementById('fileDropzoneArea');
    const availableScriptsArea = document.getElementById('availableScriptsContainer');
    const appId = document.getElementById('appId').value.trim(); // Get current appId

    dropzoneArea.style.display = 'none';
    availableScriptsArea.style.display = 'none';

    if (selection === 'upload') {
      dropzoneArea.style.display = 'block';
    } else if (selection === 'reuse') {
      await performAppIdRelatedActions(appId);
    }
  }

  window.addEventListener('verificationsUILoaded', async () => {
    await loadUrlParamsAndGetAssetInfo();
    updateCharCount(); // Initial count
    setupDropZone();
    setupBlossomDropZone();

    // Script Usage Selector Logic
    const scriptUsageSelector = document.getElementById('scriptUsage');
    scriptUsageSelector.addEventListener('change', async () => {
      await handleScriptSectionVisibility();
    });
    await handleScriptSectionVisibility();

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
      await performAppIdRelatedActions(appId, scriptUsageSelector.value === 'reuse');
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

    initializePreviewButton();
  });

  window.addEventListener('allWalletsLoaded', async () => {
    // Setup AutoComplete again, now with all the wallets loaded
    setupAppIdAutocomplete(false);
  });
</script>