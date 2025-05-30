---
layout: archive
title: "Asset Registry"
permalink: /assets/
---

<link rel="stylesheet" href="{{ base_path }}/assets/css/verifications.css">

<div style="margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
  <a href="/new_asset/" class="btn btn-success">Register New Asset</a>
  {% include shareButton.html defaultMessage="Look at the list of latest assets reported on WalletScrutiny and help us improve the transparency of the Bitcoin ecosystem!" %}
</div>

<div id="binariesTable"></div>

<div id="verificationModal"></div>

<script>
  document.getElementById('loadingSpinner').style.display = 'block';

  window.addEventListener('verificationsUILoaded', async () => {
    try {
      await renderAssetsTable({htmlElementId: 'binariesTable', enableSearch: true, showOnlyRows: 100000});
    } catch (error) {
      console.error('Error rendering assets table: ', error);
    } finally {
      document.getElementById('loadingSpinner').style.display = 'none';
    }
  });
</script>