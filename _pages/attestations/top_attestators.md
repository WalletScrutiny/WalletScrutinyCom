---
layout: archive
title: "Top Attestators"
permalink: /attestators/
---

<link rel="stylesheet" href="{{ base_path }}/assets/css/attestations.css">

<style>
  .attestation-count {
    text-align: center;
  }
</style>

<div id="loadingSpinner">
  <div class="spinner"></div>
</div>

<div id="attestatorsTable"></div>

<script src="{{'/dist/attestation.bundle.min.js' | relative_url }}"></script>

<script>
  (async () => {
    document.getElementById('loadingSpinner').style.display = 'block';

    const response = await getAllAssetInformation({
      months: 6
    });

    const attestatorStats = new Map();

    response.attestations.forEach((attestationList, sha256) => {
      attestationList.forEach(attestation => {
        const pubkey = attestation.pubkey;

        const currentStats = attestatorStats.get(pubkey) || {
          attestations: 0,
          endorsements: 0
        };

        currentStats.attestations += 1;

        const endorsements = response.endorsements.get(attestation.id) || [];
        const reproducibleEndorsements = endorsements.filter(endorsement => 
          getFirstTag(endorsement, 'status') === 'reproducible'
        ).length;
        currentStats.endorsements += reproducibleEndorsements;

        attestatorStats.set(pubkey, currentStats);
      });
    });

    const sortedAttestators = Array.from(attestatorStats.entries())
      .sort((a, b) => (b[1].attestations + b[1].endorsements) - (a[1].attestations + a[1].endorsements));

    const tableHTML = `
      <table>
        <thead>
          <tr>
            <th>Attestator</th>
            <th class="attestation-count"># Attestations</th> <!-- , Endorsements -->
          </tr>
        </thead>
        <tbody>
          ${sortedAttestators.map(([pubkey, stats]) => `
            <tr>
              <td id="profile-${pubkey}">${pubkey}</td>
              <td class="attestation-count">${stats.attestations}</td> <!-- , ${stats.endorsements} -->
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
        const profileElement = document.getElementById(`profile-${pubkey}`);
        if (profileElement) {
          profileElement.innerHTML = `
            <div class="profile-card" onclick="window.location.href='/attestator/?pubkey=${pubkey}'">
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