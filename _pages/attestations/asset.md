---
layout: archive
title: "Asset Information"
permalink: /asset/
---

<link rel="stylesheet" href="{{ base_path }}/assets/css/attestations.css">

<h2 id="sha256title" style="text-align: center; margin-bottom: 2em;"></h2>

<div id="binariesTable"></div>

<div class="explanation-box" style="margin-top: 2em; padding: 1em; border: 1px solid var(--border-color); border-radius: 4px;">
  <p id="explanationText">Loading...</p>
  <div id="registerAssetButton" style="text-align: center; margin-top: 1em; display: none;">
    <a href="" class="btn attest-button">Register Asset</a>
  </div>
</div>

<div id="attestationModal" style="display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); padding:20px; padding-top:5px; border:1px solid var(--border-color); z-index:1000;" class="modal-theme">
  <span id="closeModal" style="cursor:pointer; position:absolute; top:10px; right:10px; font-size: 24px;">&times;</span>
  <div id="attestationContent"></div>
</div>

<div id="loadingSpinner" style="display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); z-index:1000;">
  <div class="spinner"></div>
</div>

<script src="{{'/dist/attestation.bundle.min.js' | relative_url }}"></script>

<script>
  (async () => {
    document.getElementById('loadingSpinner').style.display = 'block';

    const urlParams = new URLSearchParams(window.location.search);
    const sha256 = urlParams.get('sha256');
    document.getElementById('sha256title').innerHTML = sha256;

    const result = await renderAssetsTable({
      htmlElementId: 'binariesTable',
      sha256: sha256,
      hideConfig: {
        sha256: true,
        spacer: true
      }
    });

    const binariesTable = document.getElementById('binariesTable');
    const explanationText = document.getElementById('explanationText');
    const registerAssetButton = document.getElementById('registerAssetButton');

    if (result && result.hasBinaries) {
      binariesTable.style.display = 'block';
      registerAssetButton.style.display = 'none';
      if (result.hasAttestations) {
        explanationText.innerHTML = 'Above is the list of assets found in Nostr with the provided SHA256 hash. You can click on available attestations to view their details.';
      } else {
        explanationText.innerHTML = 'Above is the list of assets found in Nostr with the provided SHA256 hash. No attestations have been found yet. If you\'ve verified this binary by building it from source yourself, you can contribute by creating a new attestation to help others verify its authenticity.';
      }
    } else {
      binariesTable.style.display = 'none';
      explanationText.innerHTML = 'No assets were found in Nostr with that SHA256 hash. Do you want to add this asset to Nostr so you or other people can try to verify if it can be built from sources?';
      registerAssetButton.style.display = 'block';
      registerAssetButton.querySelector('a').href = `/new_asset/?sha256=${sha256}`;
    }

    document.getElementById('loadingSpinner').style.display = 'none';

    document.getElementById('closeModal').onclick = function() {
      document.getElementById('attestationModal').style.display = 'none';
    };
  })();
</script>