---
layout: archive
title: "Creating New Attestation"
permalink: /new_attestation/
---

<link rel="stylesheet" href="{{ base_path }}/assets/css/attestations.css">

<script type="text/javascript" src="{{'/dist/attestation.bundle.min.js' | relative_url }}"></script>

<div class="form-container">
  <div class="static-info">
    <div class="info-row">
      <span class="info-label">SHA256:</span>
      <span id="sha256Display" class="info-value"></span>
    </div>
  </div>

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

    <button type="submit" class="btn btn-primary">Create Attestation</button>
  </form>
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

function loadUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const sha256 = urlParams.get('sha256');
  const assetEventId = urlParams.get('assetEventId');

  if (!sha256 || !assetEventId) {
    document.querySelector('.form-container').style.display = 'none';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
      <p>Required URL parameters are missing.</p>
      <p><a href="/assets/" class="btn btn-primary">Return to assets page</a></p>
    `;
    
    document.querySelector('.form-container').insertAdjacentElement('beforebegin', errorDiv);
    return;
  }

  document.getElementById('sha256Display').textContent = sha256;
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

document.addEventListener('DOMContentLoaded', loadUrlParams);
</script>
