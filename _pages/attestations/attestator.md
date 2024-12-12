---
layout: archive
title: "Attestator Page"
permalink: /attestator/
---

<style>
  .profile-card {
    text-align: center;
    padding: 20px;
    max-width: 400px;
    margin: 0 auto;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  #binariesTable {
    margin-top: 20px;
  }

  thead {
    background-color: #f5f5f5;
  }
  body.dark thead {
    background-color: #656565;
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
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

<script>
  const urlParams = new URLSearchParams(window.location.search);
  const pubkey = urlParams.get('pubkey');

  (async () => {
    try {
      document.getElementById('loadingSpinner').style.display = 'block';

      // Profile
      const profile = await getNostrProfile(pubkey);

      document.getElementById('attestator').innerHTML = `
        <div class="profile-card">
          <img src="${profile.image}" alt="Profile Picture" style="width: 200px; height: 200px; border-radius: 50%; margin-bottom: 10px;">
          <div style="font-size: 1.5em; font-weight: bold;">${profile.name}</div>
        </div>
      `;

      // Binaries
      await renderAssetsTable('binariesTable', pubkey);

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