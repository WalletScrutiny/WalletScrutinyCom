---
layout: archive
title: "Creating New Verification"
permalink: /new_verification/
---

<link rel="stylesheet" href="{{ base_path }}/assets/css/verifications.css">

<script type="text/javascript" src="{{'/dist/verifications.bundle.min.js' | relative_url }}"></script>

<div class="form-container">
  <div class="info-message"></div>

  <div id="previousAttestations" style="margin-bottom: 3em;"></div>

  <form id="attestationForm" onsubmit="handleSubmit(event)">
    <div class="form-group">
      <label for="appId">App ID:</label>
      <input type="text" id="appId" name="appId" class="form-control" autocomplete="off">
      <div id="appIdSuggestions" class="suggestions-container"></div>
      <small class="form-text">Example: app.zeusln.zeus. Start typing wallet name or ID to search for known apps, or write a new app ID.</small>
      <small class="form-text" style="margin-bottom: 1em;">If you <b>can't find the app here</b>, you can <a href="https://gitlab.com/walletscrutiny/walletScrutinyCom/-/wikis/How-to-Contribute-to-WalletScrutiny#add-products" target="_blank">open an MR</a> to add it to the inventory, or drop us a message on our <a href="https://discord.com/channels/1011450447392940082/1012176837486596106" target="_blank">Discord</a>.</small>
    </div>

    <div class="form-group">
      <label for="version">Version*:</label>
      <input type="text" id="version" name="version" class="form-control" required>
      <small class="form-text">Example: 0.9.2</small>
    </div>

    <div class="form-group">
      <label for="status">Status*:</label>
      <select id="status" name="status" class="form-control" required>
        <option value="">Select a status</option>
        <option value="reproducible">Reproducible</option>
        <option value="not_reproducible">Not Reproducible</option>
        <option value="ftbfs">Failed to Build from Source</option>
        <option value="spam">Spam</option>
      </select>
    </div>

    <div style="margin-top: 1em; margin-bottom: 2em;">
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
    </div>

    <div class="form-group">
      <label for="content">Content*:</label>
      <textarea id="content" name="content" class="form-control" rows="10" required></textarea>
      <div class="char-counter">Characters: <span id="charCount">0</span>/60000</div>
    </div>

    <div class="form-group">
      <label for="otherHashes" id="hashesLabel"></label>
      <div class="hash-input-container">
        <input type="text" id="newHash" class="form-control" placeholder="Enter hash">
        <button type="button" id="addHash" class="btn btn-primary" title="Add this hash to the list">
          <i class="fas fa-plus"></i>
        </button>
      </div>
      <div id="hashList" class="hash-list"></div>
      <input type="hidden" id="otherHashes" name="otherHashes">
      <small class="form-text" id="hashesHelpText"></small>
    </div>

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
    </style>

    <button type="submit" class="btn btn-success">Create Verification</button>
  </form>

  <div id="loadingSpinner" style="display: none;">
    <div class="spinner"></div>
  </div>
</div>

<div id="attestationModal">
  <span id="closeModal">&times;</span>
  <div id="attestationContent"></div>
</div>

<script>
function validateForm() {
  const content = document.getElementById('content').value.trim();
  const status = document.getElementById('status').value;
  const version = document.getElementById('version').value.trim();
  const appId = document.getElementById('appId').value.trim();

  if (content.length < 20) {
    showToast('Content must be at least 20 characters long', 'error');
    return false;
  }
  if (content.length > 60000) {
    showToast('Content cannot exceed 60000 characters', 'error');
    return false;
  }

  if (!appId || !version) {
    showToast('Please fill in all required fields', 'error');
    return false;
  }

  return true;
}

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

  if (window.wallets && window.wallets.length > 0) {
    setupAppIdAutocomplete();
  }

  const urlParams = new URLSearchParams(window.location.search);
  
  const fields = ['version', 'appId'];
  fields.forEach(field => {
    const value = urlParams.get(field);
    if (value) {
      document.getElementById(field).value = value;
    }
  });

  const sha256 = urlParams.get('sha256');
  const assetEventId = urlParams.get('assetEventId');

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

  await nostrConnect();

  let message = '';

  if (sha256) {
    // Show asset information and previous verifications
    const result = await renderAssetsTable({
      htmlElementId:'previousAttestations',
      sha256: sha256,
      hideConfig: {buttons: true}
    });
    
    if (!result.info || !result.info.assets || result.info.assets.length === 0) {
      showError('No assets found for the provided parameters.');
      return;
    }

    if (result.hasAttestations) {
      message = '<p>You are about to create a verification for a specific asset. Below you can find the asset information and other verifications that were made. Feel free to review them before creating your own.</p>';
    } else {
      message = '<p>Below you can find the asset information. Since there are no previous verifications, you will be the first one to provide feedback about this asset.</p>';
    }
  }

  message += '<p>To create the verification, first choose the status (if you could reproduce the asset or not), and then describe your verification process and findings with as much detail as possible (minimum 20, maximum 60000 characters). Markdown is supported.</p>';
  const infoMessage = document.querySelector('.info-message');
  infoMessage.innerHTML = message;
}

async function handleSubmit(event) {
  event.preventDefault();
  
  if (!validateForm()) {
    return;
  }

  const sha256 = new URLSearchParams(window.location.search).get('sha256');
  const assetEventId = new URLSearchParams(window.location.search).get('assetEventId');
  const otherHashesValue = document.getElementById('otherHashes').value.trim();

  // Combine sha256 and otherHashes into a single parameter
  let hashes = sha256 ? [sha256] : [];
  if (otherHashesValue) {
    hashes = hashes.concat(otherHashesValue.split(','));
  }

  const formData = {
    hashes: hashes,
    content: document.getElementById('content').value.trim(),
    status: document.getElementById('status').value,
    assetEventId: assetEventId,
    appId: document.getElementById('appId').value.trim(),
    version: document.getElementById('version').value.trim()
  };

  const spinner = document.getElementById('loadingSpinner');
  spinner.style.display = 'block';

  try {
    await createVerification(formData);
    spinner.style.display = 'none';
    await showToast('Verification created successfully!');
    window.location.href = '/asset/?sha256=' + sha256;
  } catch (error) {
    spinner.style.display = 'none';
    showToast(error.message, 'error');
  }
}

function updateCharCount() {
  const content = document.getElementById('content').value;
  const charCount = document.getElementById('charCount');
  charCount.textContent = content.length;
}

document.addEventListener('DOMContentLoaded', function() {
  loadUrlParamsAndGetAssetInfo();

  document.getElementById('content').addEventListener('input', updateCharCount);

  // Hash management
  const hashInput = document.getElementById('newHash');
  const addHashBtn = document.getElementById('addHash');
  const hashList = document.getElementById('hashList');
  const otherHashesInput = document.getElementById('otherHashes');
  let hashes = [];

  function updateHiddenInput() {
    otherHashesInput.value = hashes.join(',');
  }

  function addHash(hash) {
    if (!hash) return;
    if (hashes.includes(hash)) {
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
      hashes = hashes.filter(h => h !== hash);
      hashItem.remove();
      updateHiddenInput();
    });

    hashList.appendChild(hashItem);
    hashes.push(hash);
    updateHiddenInput();
    hashInput.value = '';
  }

  addHashBtn.addEventListener('click', () => {
    const hash = hashInput.value.trim();
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

  hashInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addHashBtn.click();
    }
  });
});
</script>