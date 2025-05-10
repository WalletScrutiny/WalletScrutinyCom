---
layout: archive
title: "Build Verifier Page"
permalink: /verifier/
---

<link rel="stylesheet" href="{{ base_path }}/assets/css/verifications.css">

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
  {% include shareButton.html defaultMessage="Look at my verifier profile on WalletScrutiny!" %}
  <a href="" target="_blank" id="njumpLink" class="btn btn-info" style="margin-bottom: 0;">
    <i class="fas fa-external-link-alt" style="margin-right: 7px;"></i> njump.me
  </a>
</div>

<div id="binariesTable"></div>

<div id="verificationModal">
  <span id="closeModal">&times;</span>
  <div id="verificationContent"></div>
</div>

<script src="{{'/dist/verifications.bundle.min.js' | relative_url }}"></script>

<script>
  const urlParams = new URLSearchParams(window.location.search);
  const rawPubkey = DOMPurify.sanitize(urlParams.get('pubkey'), purifyConfig);
  let pubkey = rawPubkey;

  // Try to decode if it's a bech32 format (npub or nprofile)
  if (rawPubkey && (rawPubkey.startsWith('npub') || rawPubkey.startsWith('nprofile'))) {
    try {
      const decoded = nip19.decode(rawPubkey);
      if (decoded.type === 'npub') {
        pubkey = decoded.data;
      } else if (decoded.type === 'nprofile') {
        pubkey = decoded.data.pubkey;
      }
    } catch (error) {
      console.error('Error decoding bech32 pubkey:', error);
      document.getElementById('attestator').innerHTML = 'Error: Invalid pubkey format';
    }
  }

  if (!pubkey) {
    document.getElementById('attestator').innerHTML = 'Error: No pubkey provided';
  }

  (async () => {
    try {
      document.getElementById('loadingSpinner').style.display = 'block';

      const npub = await getNpubFromPubkey(pubkey);
      document.getElementById('njumpLink').href = `https://njump.me/${npub}`;

      const profile = await getNostrProfile(pubkey);

      if (!profile) {
        document.getElementById('attestator').innerHTML = `<div class="npubFallback">${npub}</div>`;
      } else {
        if (profile.image || profile.name) {
          document.getElementById('attestator').innerHTML = `
            <div class="big-profile-card">
              ${profile.image ? `<img src="${profile.image}" alt="Profile Picture" style="width: 200px; height: 200px; border-radius: 50%; margin-bottom: 10px;" onerror="this.style.display='none'">` : ''}
              ${profile.name ? `<div style="font-size: 1.5em; font-weight: bold;">${profile.name}</div>` : ''}
              ${profile.nip05 ? `<div class="profile-nip05">${profile.nip05}</div>` : ''}
            </div>`;
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      document.getElementById('attestator').innerHTML = 'Error loading profile';
    }

    try {
      await renderAssetsTable({htmlElementId:'binariesTable', pubkey, showProfilePictures: false});
    } catch (error) {
      console.error('Error loading binaries:', error);
      document.getElementById('binariesTable').innerHTML = 'Error loading binaries';
    }

    document.getElementById('loadingSpinner').style.display = 'none';
  })();
</script>