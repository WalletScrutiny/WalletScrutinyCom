---
layout: archive
title: "Creating New Attestation"
permalink: /new_attestation/
---

<link rel="stylesheet" href="{{ base_path }}/assets/css/attestations.css">

<script type="text/javascript" src="{{'/dist/attestation.bundle.min.js' | relative_url }}"></script>

<div class="form-container">
  <div class="info-message">
    <p>You are about to create an attestation for a specific asset. Below you can find the asset information and any previous attestations that may have been made. Feel free to review existing attestations before creating your own.</p>
  </div>

  <div id="previousAttestations" style="margin-bottom: 3em;"></div>

  <form id="attestationForm" onsubmit="handleSubmit(event)">
    <div class="form-group">
      <label for="status">Status*:</label>
      <select id="status" name="status" class="form-control" required>
        <option value="">Select a status</option>
        <option value="not_reproducible">Not Reproducible</option>
        <option value="reproducible">Reproducible</option>
      </select>
    </div>

    <div class="form-group">
      <label for="content">Content*:</label>
      <textarea id="content" name="content" class="form-control" rows="10" required></textarea>
      <small class="form-text">Describe your attestation process and findings with as much detail as possible (minimum 10, maximum 60000 characters). Markdown is supported.</small>
    </div>

    <button type="submit" class="btn btn-success">Create Attestation</button>
  </form>
</div>

<div id="attestationModal" class="attestation-modal modal-theme">
  <span id="closeModal" class="attestation-modal__close">&times;</span>
  <div id="attestationContent"></div>
</div>

<script>
function validateForm() {
  const content = document.getElementById('content').value.trim();
  const status = document.getElementById('status').value;

  if (!content || !status) {
    alert('Please fill in all required fields');
    return false;
  }

  if (content.length < 10) {
    alert('Content must be at least 10 characters long');
    return false;
  }
  if (content.length > 60000) {
    alert('Content cannot exceed 60000 characters');
    return false;
  }

  return true;
}

async function loadUrlParamsAndGetAssetInfo() {
  const urlParams = new URLSearchParams(window.location.search);
  const sha256 = urlParams.get('sha256');
  const assetEventId = urlParams.get('assetEventId');

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

  if (!sha256 || !assetEventId) {
    showError('Required URL parameters are missing.');
    return;
  }

  // Show asset information and previous attestations
  const pubkey = await getUserPubkey();

  const result = await renderAssetsTable({
    htmlElementId:'previousAttestations',
    sha256: sha256,
    hideConfig: {spacer: true, buttons: true}
  });
  
  if (!result.info || !result.info.assets || result.info.assets.length === 0) {
    showError('No assets found for the provided parameters.');
    return;
  }
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

  try {
    await createAttestation(formData);
    alert('Attestation created successfully!');
    window.location.href = '/asset/?sha256=' + sha256;
  } catch (error) {
    alert('Error creating attestation: ' + error.message);
  }
}

document.addEventListener('DOMContentLoaded', loadUrlParamsAndGetAssetInfo);

document.getElementById('closeModal').onclick = function() {
  document.getElementById('attestationModal').style.display = 'none';
};
</script>