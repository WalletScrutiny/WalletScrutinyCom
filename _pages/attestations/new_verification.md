---
layout: archive
title: "Creating New Attestation"
permalink: /new_attestation/
---

<link rel="stylesheet" href="{{ base_path }}/assets/css/attestations.css">

<script type="text/javascript" src="{{'/dist/attestation.bundle.min.js' | relative_url }}"></script>

<div class="form-container">
  <div class="info-message"></div>

  <div id="previousAttestations" style="margin-bottom: 3em;"></div>

  <form id="attestationForm" onsubmit="handleSubmit(event)">
    <div class="form-group">
      <label for="status">Status*:</label>
      <select id="status" name="status" class="form-control" required>
        <option value="">Select a status</option>
        <option value="reproducible">Reproducible</option>
        <option value="not_reproducible">Not Reproducible</option>
        <option value="ftbfs">Failed to Build from Source</option>
      </select>
    </div>

    <div class="form-group">
      <label for="content">Content*:</label>
      <textarea id="content" name="content" class="form-control" rows="10" required></textarea>
      <div class="char-counter">Characters: <span id="charCount">0</span>/60000</div>
    </div>

    <button type="submit" class="btn btn-success">Create Attestation</button>
  </form>
  <div style="margin-top: 3em;">
    <p>
      <b>Reproducible:</b> You've been able to build the asset and differences with the tested binary are minimal.
    </p>
    <p>
      <b>Not Reproducible:</b> You've been able to build the asset, but differences with the tested binary are significant.
    </p>
    <p>
      <b>Failed to Build from Source:</b> You failed to build the asset from source.
    </p>
  </div>
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

  if (content.length < 20) {
    showToast('Content must be at least 20 characters long', 'error');
    return false;
  }
  if (content.length > 60000) {
    showToast('Content cannot exceed 60000 characters', 'error');
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
    showError('A Nostr browser extension is required to create attestations.');
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const sha256 = urlParams.get('sha256');
  const assetEventId = urlParams.get('assetEventId');

  if (!sha256 || !assetEventId) {
    showError('Required URL parameters are missing.');
    return;
  }

  await nostrConnect();

  // Show asset information and previous attestations
  const result = await renderAssetsTable({
    htmlElementId:'previousAttestations',
    sha256: sha256,
    hideConfig: {buttons: true}
  });
  
  if (!result.info || !result.info.assets || result.info.assets.length === 0) {
    showError('No assets found for the provided parameters.');
    return;
  }

  const infoMessage = document.querySelector('.info-message');
  let message = '';
  if (result.hasAttestations) {
    message = '<p>You are about to create an attestation for a specific asset. Below you can find the asset information and other attestations that were made. Feel free to review them before creating your own.</p>';
  } else {
    message = '<p>Below you can find the asset information. Since there are no previous attestations, you will be the first one to provide feedback about this asset.</p>';
  }
  message += '<p>To create the attestation, first choose the status (if you could reproduce the asset or not), and then describe your attestation process and findings with as much detail as possible (minimum 20, maximum 60000 characters). Markdown is supported.</p>';
  infoMessage.innerHTML = message;
}

async function handleSubmit(event) {
  event.preventDefault();
  
  if (!validateForm()) {
    return;
  }

  const sha256 = new URLSearchParams(window.location.search).get('sha256');
  const assetEventId = new URLSearchParams(window.location.search).get('assetEventId');

  const formData = {
    sha256: sha256,
    content: document.getElementById('content').value.trim(),
    status: document.getElementById('status').value,
    assetEventId: assetEventId
  };

  const spinner = document.getElementById('loadingSpinner');
  spinner.style.display = 'block';

  try {
    await createAttestation(formData);
    spinner.style.display = 'none';
    await showToast('Attestation created successfully!');
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
});
</script>