---
layout: archive
title: "Latest Assets"
permalink: /binaries/
---

<link rel="stylesheet" href="{{ base_path }}/assets/css/attestations.css">

<div id="binariesTable"></div>

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

    await renderAssetsTable({htmlElementId: 'binariesTable'});

    document.getElementById('loadingSpinner').style.display = 'none';

    document.getElementById('closeModal').onclick = function() {
      document.getElementById('attestationModal').style.display = 'none';
    };
  })();
</script>