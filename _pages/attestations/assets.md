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

<div id="verificationModal">
  <span id="closeModal">&times;</span>
  <div id="verificationContent"></div>
</div>

<script src="{{'/dist/verifications.bundle.min.js' | relative_url }}"></script>

<script>
  (async () => {
    document.getElementById('loadingSpinner').style.display = 'block';
    await renderAssetsTable({htmlElementId: 'binariesTable', enableSearch: true, showOnlyRows: 100000});
    document.getElementById('loadingSpinner').style.display = 'none';
  })();
</script>