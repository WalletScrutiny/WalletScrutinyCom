---
layout: archive
title: "Asset Information"
permalink: /asset/
---

<h2 id="sha256title" style="text-align: center; margin-bottom: 2em;"></h2>

<div style="margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
  <a href="/assets/" class="btn btn-success">All Assets</a>
  {% include shareButton.html defaultMessage="Check out this asset information I registered on WalletScrutiny:" %}
</div>

<div id="binariesTable"></div>

<div class="explanation-box" style="margin-top: 2em; padding: 1em; border: 1px solid var(--border-color); border-radius: 4px;">
  <p id="explanationText">Loading...</p>
  <div id="registerAssetButton" style="text-align: center; margin-top: 1em; display: none;">
    <a href="" class="btn btn-small btn-success">Register Asset</a>
  </div>
</div>

<script>
  document.getElementById('loadingSpinner').style.display = 'block';

  window.addEventListener('verificationsUILoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sha256 = DOMPurify.sanitize(urlParams.get('sha256'), purifyConfig);
    document.getElementById('sha256title').innerHTML = sha256;

    const result = await renderAssetsTable({
      htmlElementId: 'binariesTable',
      sha256: sha256,
      hideConfig: {
        sha256: true
      }
    });

    const binariesTable = document.getElementById('binariesTable');
    const explanationText = document.getElementById('explanationText');
    const registerAssetButton = document.getElementById('registerAssetButton');

    if (result?.hasAssets || result?.hasVerifications) {
      binariesTable.style.display = 'block';
      registerAssetButton.style.display = 'none';
      if (result.hasVerifications) {
        explanationText.innerHTML = 'Above is the list of assets found in Nostr with the SHA256 hash provided. You can click on available verifications to view their details.';
      } else {
        explanationText.innerHTML = 'Above is the list of assets found in Nostr with the SHA256 hash provided. No verifications have been made yet. If you\'ve verified this binary by building it from source yourself, you can contribute by creating a new verification to help others verify its authenticity.';
      }
    } else {
      binariesTable.style.display = 'none';
      explanationText.innerHTML = 'No assets were found in Nostr with that SHA256 hash. Do you want to add this asset to Nostr so you or other people can try to verify if it can be built from sources?';
      registerAssetButton.style.display = 'block';
      registerAssetButton.querySelector('a').href = `/new_asset/?sha256=${sha256}`;
    }

    document.getElementById('loadingSpinner').style.display = 'none';
  });
</script>