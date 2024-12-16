---
layout: archive
title: "Attestator Page"
permalink: /attestator/
---

<link rel="stylesheet" href="{{ base_path }}/assets/css/attestations.css">

<style>
  #binariesTable {
    margin-top: 20px;
  }
</style>

<div id="attestator"></div>

<div id="attestationModal" style="display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); padding:20px; padding-top:5px; border:1px solid var(--border-color); z-index:1000;" class="modal-theme">
  <span id="closeModal" style="cursor:pointer; position:absolute; top:10px; right:10px; font-size: 24px;">&times;</span>
  <div id="attestationContent"></div>
</div>

<div id="binariesTable"></div>

<div id="loadingSpinner" style="display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); z-index:1000;">
  <div class="spinner"></div>
</div>

<script src="{{'/dist/attestation.bundle.min.js' | relative_url }}"></script>

<script>
  const urlParams = new URLSearchParams(window.location.search);
  const pubkey = urlParams.get('pubkey');

  (async () => {
    try {
      document.getElementById('loadingSpinner').style.display = 'block';

      // Profile
      const profile = await getNostrProfile(pubkey);

      document.getElementById('attestator').innerHTML = `
        <div class="big-profile-card">
          <img src="${profile.image}" alt="Profile Picture" style="width: 200px; height: 200px; border-radius: 50%; margin-bottom: 10px;">
          <div style="font-size: 1.5em; font-weight: bold;">${profile.name}</div>
        </div>
      `;

      // Binaries
      await renderAssetsTable({htmlElementId:'binariesTable', assetsPubkey: pubkey});

      document.getElementById('closeModal').onclick = function() {
        document.getElementById('attestationModal').style.display = 'none';
      };

      document.getElementById('loadingSpinner').style.display = 'none';
    } catch (error) {
      console.error('Error loading profile:', error);
      document.getElementById('attestator').innerHTML = 'Error loading profile';
    }
  })();
</script>