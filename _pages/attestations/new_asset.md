---
layout: archive
title: "Registering New Asset"
permalink: /new_asset/
---

<link rel="stylesheet" href="{{ base_path }}/assets/css/attestations.css">

<script type="text/javascript" src="{{'/dist/attestation.bundle.min.js' | relative_url }}"></script>

<div class="form-container">
  <div class="info-message">
    <p>To add a new asset to Nostr so it can be verified by you or others, you will need to provide the following information:</p>
  </div>

  <form id="assetForm" onsubmit="handleSubmit(event)">
    <div class="form-group">
      <label for="appId">App ID:</label>
      <input type="text" id="appId" name="appId" class="form-control" autocomplete="off">
      <div id="appIdSuggestions" class="suggestions-container"></div>
      <small class="form-text">Example: app.zeusln.zeus. Start typing wallet name or ID to search for known apps, or write a new app ID.</small>
    </div>

    <div class="form-group">
      <label for="version">Version*:</label>
      <input type="text" id="version" name="version" class="form-control" required>
      <small class="form-text">Example: 0.9.2</small>
    </div>

    <div class="form-group">
      <label for="name">Asset Name*:</label>
      <input type="text" id="name" name="name" class="form-control" required>
      <small class="form-text">Example: Universal APK from Github / Debian package amd64 / MacOS App Store</small>
    </div>

    <div class="form-group">
      <label for="sha256">Hash (sha256)*:</label>
      <input type="text" id="sha256" name="sha256" class="form-control" required>
      <small class="form-text">Example: deb318adc37cd2c44b3c429af56a76982c6a81dfdad1ea679c01d8184fc6a4fe</small>
    </div>

    <div class="form-group">
      <label for="url">Download URL:</label>
      <input type="url" id="url" name="url" class="form-control">
      <small class="form-text">Example: https://github.com/ZeusLN/zeus/releases/download/v0.9.2/zeus-v0.9.2-universal.apk</small>
    </div>

    <div class="form-group">
      <label for="platform">Platform:</label>
      <select id="platform" name="platform" class="form-control">
        <option value="">Select a platform</option>
        <option value="Android Universal">Android Universal</option>
        <option value="iOS">iOS</option>
        <option value="Linux">Linux</option>
        <option value="Windows">Windows</option>
        <option value="macOS">macOS</option>
      </select>
    </div>

    <div class="form-group">
      <label for="mimeType">MIME Type:</label>
      <input type="text" id="mimeType" name="mimeType" class="form-control">
      <small class="form-text">Example: application/vnd.android.package-archive</small>
    </div>

    <button type="submit" class="btn btn-success">Register Asset</button>
  </form>
  <div id="loadingSpinner" style="display: none;">
    <div class="spinner"></div>
  </div>
</div>

<style>
.suggestions-container {
  display: none;
  position: absolute;
  border: 1px solid #ddd;
  border-top: none;
  z-index: 1000;
  background: var(--neutral-5);
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
}

.suggestion-item {
  padding: 8px 10px;
  cursor: pointer;
  color: var(--text-color);
}

.suggestion-item:hover {
  background-color: #6f6f6f;
}
</style>

<script>
function validateForm() {
  const name = document.getElementById('name').value.trim();
  const version = document.getElementById('version').value.trim();
  const sha256 = document.getElementById('sha256').value.trim();
  const appId = document.getElementById('appId').value.trim();

  if (!appId || !name || !version || !sha256) {
    alert('Please fill in all required fields');
    return false;
  }

  return true;
}

function setupAppIdAutocomplete() {
  const appIdInput = document.getElementById('appId');
  const suggestionsContainer = document.getElementById('appIdSuggestions');
  
  function filterWallets(searchText) {
    if (!window.wallets) return [];
    return window.wallets.filter(wallet => {
      const searchLower = searchText.toLowerCase();
      return wallet.appId.toLowerCase().includes(searchLower) || 
             wallet.title.toLowerCase().includes(searchLower);
    });
  }

  function showSuggestions(suggestions) {
    suggestionsContainer.innerHTML = '';
    if (suggestions.length === 0) {
      suggestionsContainer.style.display = 'none';
      return;
    }

    suggestions.forEach(wallet => {
      const div = document.createElement('div');
      div.className = 'suggestion-item';
      div.textContent = `${wallet.title}${wallet.folder ? ' (' + wallet.folder + ')' : ''} - ${wallet.appId}`;
      div.onclick = () => {
        appIdInput.value = wallet.appId;
        suggestionsContainer.style.display = 'none';
      };
      suggestionsContainer.appendChild(div);
    });
    
    suggestionsContainer.style.display = 'block';
  }

  appIdInput.addEventListener('input', (e) => {
    const searchText = e.target.value;
    const filteredWallets = filterWallets(searchText);
    showSuggestions(filteredWallets);
  });

  document.addEventListener('click', (e) => {
    if (!appIdInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
      suggestionsContainer.style.display = 'none';
    }
  });
}

async function loadUrlParams() {
  const showError = (message) => {
    document.querySelector('.form-container').style.display = 'none';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
      <p>${message}</p>
      <p><a href="/nostr/" target="_blank">(learn more about Nostr)</a></p>
      <p><a href="/assets/" class="btn btn-info">Return to assets page</a></p>
    `;
    
    document.querySelector('.form-container').insertAdjacentElement('beforebegin', errorDiv);
  };
  
  if (!await userHasBrowserExtension()) {
    showError('A Nostr browser extension is required to create assets.');
    return;
  }

  if (window.wallets && window.wallets.length > 0) {
    setupAppIdAutocomplete();
  }

  const urlParams = new URLSearchParams(window.location.search);
  
  const fields = ['name', 'url', 'version', 'sha256', 'appId', 'mimeType', 'platform'];
  fields.forEach(field => {
    const value = urlParams.get(field);
    if (value) {
      document.getElementById(field).value = value;
    }
  });
}

async function handleSubmit(event) {
  event.preventDefault();
  
  if (!validateForm()) {
    return;
  }

  const formData = {
    name: document.getElementById('name').value.trim(),
    url: document.getElementById('url').value.trim(),
    version: document.getElementById('version').value.trim(),
    sha256: document.getElementById('sha256').value.trim(),
    appId: document.getElementById('appId').value.trim(),
    mimeType: document.getElementById('mimeType').value.trim(),
    platform: document.getElementById('platform').value
  };

  if (!formData.appId) delete formData.appId;
  if (!formData.mimeType) delete formData.mimeType;
  if (!formData.platform) delete formData.platform;

  const spinner = document.getElementById('loadingSpinner');
  spinner.style.display = 'block';

  try {
    await createAssetRegistration(formData);
    spinner.style.display = 'none';
    await showToast('Asset registered successfully!');
    window.location.href = '/asset/?sha256=' + formData.sha256;
  } catch (error) {
    spinner.style.display = 'none';
    showToast(error.message, 'error');
  }
}

document.addEventListener('DOMContentLoaded', loadUrlParams);
</script>
