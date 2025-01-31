---
layout: archive
title: "Attestator Page"
permalink: /attestator/
---

<link rel="stylesheet" href="{{ base_path }}/assets/css/attestations.css">

<style>
  #main {
    width: 100%;
    margin: 0 auto;
    max-width: 97% !important;
  }

  @media screen and (min-width: 1800px) {
    #main {
      max-width: 87% !important;
    }
  }
  @media screen and (min-width: 2300px) {
    #main {
      max-width: 75% !important;
    }
  }
  @media screen and (min-width: 2800px) {
    #main {
      max-width: 70% !important;
    }
  }

  .npubFallback {
    font-weight: bold;
    padding: 20px;
    padding-top: 0;
    text-align: center;
  }
  #binariesTable {
    margin-top: 20px;
  }
</style>

<div id="attestator"></div>

<div style="margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
  {% include shareButton.html defaultMessage="Look at my attestator profile on WalletScrutiny!" %}
  <a href="" target="_blank" id="njumpLink" class="btn" style="background-color: #007bff;">
    <i class="fas fa-external-link-alt" style="margin-right: 7px;"></i> njump.me
  </a>
</div>

<div id="binariesTable"></div>

<div id="attestationModal">
  <span id="closeModal">&times;</span>
  <div id="attestationContent"></div>
</div>

<div id="loadingSpinner">
  <div class="spinner"></div>
</div>

<script src="{{'/dist/attestation.bundle.min.js' | relative_url }}"></script>

<script>
  const urlParams = new URLSearchParams(window.location.search);
  const pubkey = urlParams.get('pubkey');

  (async () => {
    try {
      document.getElementById('loadingSpinner').style.display = 'block';

      await nostrConnect();
      const npub = getNpubFromPubkey(pubkey);

      document.getElementById('njumpLink').href = `https://njump.me/${npub}`;

      // Profile
      const profile = await getNostrProfile(pubkey);

      if (!profile) {
        document.getElementById('attestator').innerHTML = `<div class="npubFallback">${npub}</div>`;
      } else {
        if (profile?.image) {
          document.getElementById('attestator').innerHTML = `
            <div class="big-profile-card">
              <img src="${profile.image}" alt="Profile Picture" style="width: 200px; height: 200px; border-radius: 50%; margin-bottom: 10px;">
              <div style="font-size: 1.5em; font-weight: bold;">${profile.name ?? ''}</div>
            </div>`;
        }
      }

      // Binaries
      await renderAssetsTable({htmlElementId:'binariesTable', assetsPubkey: pubkey, getAssetsForMyAttestations: true});

      document.getElementById('loadingSpinner').style.display = 'none';
    } catch (error) {
      console.error('Error loading profile:', error);
      document.getElementById('attestator').innerHTML = 'Error loading profile';
      document.getElementById('loadingSpinner').style.display = 'none';
    }
  })();
</script>