---
layout: archive
title: "Creating New Asset"
permalink: /new_asset/
---

<style>
.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-text {
  display: block;
  color: #6c757d;
  font-size: 0.875em;
}

input {
  margin-bottom: 0.1em;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>

<div class="form-container">
  <form id="assetForm" onsubmit="handleSubmit(event)">
    <div class="form-group">
      <label for="name">Asset Name*:</label>
      <input type="text" id="name" name="name" class="form-control" required>
      <small class="form-text">Example: Universal APK from Github</small>
    </div>

    <div class="form-group">
      <label for="url">Asset URL*:</label>
      <input type="url" id="url" name="url" class="form-control" required>
      <small class="form-text">Example: https://github.com/ZeusLN/zeus/releases/download/v0.9.2/zeus-v0.9.2-universal.apk</small>
    </div>

    <div class="form-group">
      <label for="version">Version*:</label>
      <input type="text" id="version" name="version" class="form-control" required>
      <small class="form-text">Example: 0.9.2</small>
    </div>

    <div class="form-group">
      <label for="hash">Hash*:</label>
      <input type="text" id="hash" name="hash" class="form-control" required>
      <small class="form-text">Example: deb318adc37cd2c44b3c429af56a76982c6a81dfdad1ea679c01d8184fc6a4fe</small>
    </div>

    <div class="form-group">
      <label for="appId">App ID:</label>
      <input type="text" id="appId" name="appId" class="form-control">
      <small class="form-text">Example: app.zeusln.zeus</small>
    </div>

    <div class="form-group">
      <label for="mimeType">MIME Type:</label>
      <input type="text" id="mimeType" name="mimeType" class="form-control">
      <small class="form-text">Example: application/vnd.android.package-archive</small>
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

    <button type="submit" class="btn btn-primary">Register Asset</button>
  </form>
</div>

<script>
  /*
    (async () => {
    const createdAssetResult = await createAssetRegistration({
      name: "Universal APK from Github",
      appId: "app.zeusln.zeus",
      url: "https://github.com/ZeusLN/zeus/releases/download/v0.9.2/zeus-v0.9.2-universal.apk",
      version: "0.9.2",
      mimeType: "application/vnd.android.package-archive",
      sha256: "deb318adc37cd2c44b3c429af56a76982c6a81dfdad1ea679c01d8184fc6a4fe",
      platform: "Android Universal"
    });
  })();
  */
function validateForm() {
  const name = document.getElementById('name').value.trim();
  const url = document.getElementById('url').value.trim();
  const version = document.getElementById('version').value.trim();
  const hash = document.getElementById('hash').value.trim();

  if (!name || !url || !version || !hash) {
    alert('Please fill in all required fields');
    return false;
  }

  try {
    new URL(url);
  } catch (e) {
    alert('Please enter a valid URL');
    return false;
  }

  return true;
}

function loadUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  
  const fields = ['name', 'url', 'version', 'hash', 'appId', 'mimeType', 'platform'];
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
    hash: document.getElementById('hash').value.trim(),
    appId: document.getElementById('appId').value.trim(),
    mimeType: document.getElementById('mimeType').value.trim(),
    platform: document.getElementById('platform').value
  };

  if (!formData.appId) delete formData.appId;
  if (!formData.mimeType) delete formData.mimeType;
  if (!formData.platform) delete formData.platform;

  try {
    await createAssetRegistration(formData);
    alert('Asset registered successfully!');
    window.location.href = '/attestations/';
  } catch (error) {
    alert('Error registering asset: ' + error.message);
  }
}

document.addEventListener('DOMContentLoaded', loadUrlParams);
</script>
