---
layout: archive
title: "Registering New Asset"
permalink: /new_asset/
---

<link rel="stylesheet" href="{{ base_path }}/assets/css/verifications.css">

<script type="text/javascript" src="{{'/dist/verifications.bundle.min.js' | relative_url }}"></script>

<div class="form-container">
  <div class="info-message">
    <p>To add a new asset to Nostr so it can be verified by you or others, you will need to provide the following information<span class="drag-and-drop-area bigScreenOnly">, or drag and drop your binary file here so we calculate some fields for you</span>:</p>
  </div>

  <div style="margin: 1.5em; margin-left: 0;" class="drag-and-drop-area">
    {% include /verifications/dragAndDropArea.html buttonMessage="Drop file to calculate" %}
  </div>

  <div>
    <p>Fields marked with (*) are required.</p>
  </div>

  <form id="assetForm" onsubmit="handleSubmit(event)">
    <div class="form-group">
      <label for="sha256">Hash (sha256) (*):</label>
      <input type="text" id="sha256" name="sha256" class="form-control" required maxlength="64">
      <small class="form-text">Example: deb318adc37cd2c44b3c429af56a76982c6a81dfdad1ea679c01d8184fc6a4fe</small>
    </div>

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

    <button type="submit" class="btn btn-success">Register Asset</button>
  </form>
</div>

<script>
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
  
  const fields = ['description', 'version', 'sha256', 'appId', 'platform'];
  fields.forEach(field => {
    const value = DOMPurify.sanitize(urlParams.get(field), purifyConfig);
    if (value) {
      document.getElementById(field).value = value;
    }
  });

  // If sha256 is provided, hide all drag and drop areas
  if (urlParams.get('sha256')) {
    document.querySelectorAll('.drag-and-drop-area').forEach(element => {
      element.style.display = 'none';
    });
  }
}

async function handleSubmit(event) {
  event.preventDefault();

  const formData = {
    description: document.getElementById('description').value.trim(),
    version: document.getElementById('version').value.trim(),
    appId: document.getElementById('appId').value.trim(),
    sha256: document.getElementById('sha256').value.trim(),
    platform: document.getElementById('platform').value
  };

  if (!formData.appId) delete formData.appId;
  if (!formData.platform) delete formData.platform;

  const spinner = document.getElementById('loadingSpinner');
  spinner.style.display = 'block';

  try {
    await createAssetRegistration(formData);

    if (window.currentFile && window.currentHash) {
      await uploadToBlossom(window.currentFile, window.currentHash);
    }

    spinner.style.display = 'none';
    await showToast('Asset registered successfully!');
    window.location.href = '/asset/?sha256=' + formData.sha256;
  } catch (error) {
    spinner.style.display = 'none';
    showToast(error.message, 'error');
  }
}

document.addEventListener('DOMContentLoaded', loadUrlParams);

nostrConnect();
</script>
