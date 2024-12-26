---
layout: archive
title: "Latest Assets"
permalink: /assets/
---

<link rel="stylesheet" href="{{ base_path }}/assets/css/attestations.css">

<div style="margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
  <a href="/new_asset/" class="btn btn-success">Register New Asset</a>
  {% include shareButton.html defaultMessage="Look at the list of Latest Assets reported on WalletScrutiny and help us improve the transparency of the Bitcoin ecosystem!" %}
</div>

<div id="binariesTable"></div>

<div id="attestationModal" class="attestation-modal modal-theme">
  <span id="closeModal" class="attestation-modal__close">&times;</span>
  <div id="attestationContent"></div>
</div>

<div id="loadingSpinner">
  <div class="spinner"></div>
</div>

<script src="{{'/dist/attestation.bundle.min.js' | relative_url }}"></script>

<script>
  (async () => {
    document.getElementById('loadingSpinner').style.display = 'block';

    await renderAssetsTable({htmlElementId: 'binariesTable'});

    document.getElementById('loadingSpinner').style.display = 'none';
  })();
</script>