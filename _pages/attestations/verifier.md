---
layout: archive
title: "Build Verifier Page"
permalink: /verifier/
---

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
  <button style="margin: 0; padding: 0; border: 0; background: transparent;" id="shareButtonContainerVerifier"></button>
  <button class="btn btn-info" style="margin-bottom: 0;" href="" target="_blank" id="njumpLink">
    <i class="fas fa-external-link-alt" style="margin-right: 7px; font-size: 18px;"></i> Njump.me
  </button>
  <button class="btn btn-info" style="margin-bottom: 0; display: none;" id="zapButtonVerifier" onclick="showZapModal({onClose: () => {}, setZapped: (ok) => {}});">
    <i class="fab fa-bitcoin" style="margin-right: 6px; font-size: 18px;"></i> Zap this verifier
  </button>
</div>

<div id="binariesTable"></div>

<script>
  document.getElementById('loadingSpinner').style.display = 'block';

  window.addEventListener('verificationsUILoaded', async () => {
    renderShareButton({
      container: "#shareButtonContainerVerifier",
      defaultMessage: "Look at my verifier profile on WalletScrutiny!",
      showRawButtons: false
    });

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

    try {
      const npub = getNpubFromPubkey(pubkey);

      document.getElementById('njumpLink').addEventListener('click', function() {
        window.open(`https://njump.me/${npub}`, '_blank');
      });

      const profile = await getNostrProfile(pubkey);

      if (profile && (profile.lud16 || profile.lud06) && profile.profileEvent) {
        window.profileEvent = profile.profileEvent;
        document.getElementById('zapButtonVerifier').style.display = 'inline-block';
      } else if (profile) {
        const zapBtn = document.getElementById('zapButtonVerifier');
        zapBtn.style.display = 'inline-block';
        zapBtn.disabled = true;
        zapBtn.style.backgroundColor = '#ccc';
        zapBtn.style.color = '#888';
        zapBtn.style.cursor = 'not-allowed';
        zapBtn.title = "The user doesn't have a nostr profile or a LN address to receive sats";
      }

      document.getElementById('attestator').innerHTML = renderBigProfileCardHtml(pubkey, profile);
    } catch (error) {
      console.error('Error loading profile:', error);
      document.getElementById('attestator').innerHTML = 'Error loading profile';
    }

    try {
      await renderAssetsTable({
        htmlElementId: 'binariesTable', 
        pubkey, 
        showProfilePictures: false,
        showOnlyRows: 10,
        tableLoadedCallback: () => (document.getElementById('loadingSpinner').style.display = 'none')
      });
    } catch (error) {
      console.error('Error loading binaries:', error);
      document.getElementById('binariesTable').innerHTML = 'Error loading binaries';
      document.getElementById('loadingSpinner').style.display = 'none';
    }
  });
</script>
