---
layout: archive
title: "Top Build Verifiers"
permalink: /verifiers/
---

<link rel="stylesheet" href="{{ base_path }}/assets/css/verifications.css">

<style>
  table { 
    width: 100%;
    margin: auto;
    border-collapse: collapse;
    table-layout: fixed;
  }
  
  @media screen and (min-width: 768px) {
    table {
      width: initial;
      table-layout: auto;
    }
    table th:nth-child(1) {
      padding-left: 8em;
      padding-right: 8em;
    }
    table th:nth-child(2) {
      padding-left: 5em;
      padding-right: 5em;
    }
  }

  @media screen and (max-width: 767px) {
    table th, table td {
      padding: 0.5em;
      word-break: break-word;
    }
    .profile-info {
      font-size: 14px;
    }
    .attestation-count-column {
      font-size: 1.2em !important;
      width: 30%;
    }
    .attestator-card-column {
      width: 70%;
    }
  }

  .attestator-card-column {
    padding: 1.3em;
  }
  @media screen and (max-width: 767px) {
    .attestator-card-column {
      padding: 0.5em;
    }
  }

  .attestation-count-column {
    text-align: center;
    font-size: 1.5em;
  }

  .profile-image {
    width: 50px;
    height: 50px;
  }

  .profile-card {
    max-width: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .profile-info {
    font-size: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }

  .profile-info div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>

<div style="margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
  {% include shareButton.html defaultMessage="Look at the Top Verifiers ranking on WalletScrutiny!" %}
</div>

<div id="attestatorsTable"></div>

<script src="{{'/dist/verifications.bundle.min.js' | relative_url }}"></script>

<script>
  (async () => {
    document.getElementById('loadingSpinner').style.display = 'block';

    try {
      await nostrConnect();
    } catch (e) {
      console.error("Failed to connect to Nostr", e);
      document.getElementById('loadingSpinner').style.display = 'none';
      showToast('It was impossible to connect to Nostr. Please check your browser extension and try again.', 'error');
      return;
    }

    const response = await getAllAssetInformation({});

    const attestatorStats = new Map();

    response.verifications.forEach((verificationList, sha256) => {
      verificationList.forEach(verification => {
        const pubkey = verification.pubkey;

        const currentStats = attestatorStats.get(pubkey) || {
          verifications: 0,
          endorsements: 0
        };

        currentStats.verifications += 1;

        const endorsements = response.endorsements.get(verification.id) || [];
        const reproducibleEndorsements = endorsements.filter(endorsement => 
          getFirstTag(endorsement, 'status') === 'reproducible'
        ).length;
        currentStats.endorsements += reproducibleEndorsements;

        attestatorStats.set(pubkey, currentStats);
      });
    });

    const sortedAttestators = Array.from(attestatorStats.entries())
      .sort((a, b) => (b[1].verifications + b[1].endorsements) - (a[1].verifications + a[1].endorsements));

    const tableHTML = `
      <table>
        <thead>
          <tr>
            <th class="attestator-card-column">Verifier</th>
            <th class="attestation-count-column"># Verifications</th> <!-- , Endorsements -->
          </tr>
        </thead>
        <tbody>
          ${sortedAttestators.map(([pubkey, stats]) => `
            <tr>
              <td class="attestator-card-column" id="profile-${pubkey}"><a href="/verifier/?pubkey=${pubkey}">${getNpubFromPubkey(pubkey)}</a></td>
              <td class="attestation-count-column">${stats.verifications}</td> <!-- , ${stats.endorsements} -->
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    document.getElementById('attestatorsTable').innerHTML = tableHTML;
    document.getElementById('loadingSpinner').style.display = 'none';

    // Load profiles asynchronously
    for (const [pubkey] of sortedAttestators) {
      try {
        const profile = await getNostrProfile(pubkey);
        if (!profile) {
          continue;
        }
        const profileElement = document.getElementById(`profile-${pubkey}`);
        if (profileElement) {
          profileElement.innerHTML = `
            <div class="profile-card" onclick="window.location.href='/verifier/?pubkey=${pubkey}'">
              ${profile.image ? `<img src="${profile.image}" class="profile-image" onerror="this.style.display='none'"/>` : ''}
              <div class="profile-info">
                <div>${profile.name || pubkey}</div>
                ${profile.nip05 ? `<div class="profile-nip05">${profile.nip05}</div>` : ''}
              </div>
            </div>
          `;
        }
      } catch (error) {
        console.error(`Error loading profile for ${pubkey}:`, error);
      }
    }
  })();
</script>