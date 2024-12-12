---
layout: archive
title: "Top Attestators"
permalink: /attestators/
---

<style>
  .spinner {
    border: 8px solid rgba(0, 0, 0, 0.1);
    border-top: 8px solid #3498db;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .profile-card {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0;
    padding: 6px;
    cursor: pointer;
  }
  .profile-image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
  .profile-info {
    display: flex;
    flex-direction: column;
  }
  .profile-nip05 {
    font-size: 0.9em;
    color: #666;
  }

  .attestation-count {
    text-align: center;
  }

  thead {
    background-color: #f5f5f5;
  }
  body.dark thead {
    background-color: #656565;
  }
</style>

<div id="loadingSpinner" style="display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); z-index:1000;">
  <div class="spinner"></div>
</div>

<h2>In the last 6 months</h2>
<div id="attestatorsTable"></div>

<script src="{{'/dist/attestation.bundle.min.js' | relative_url }}"></script>

<script>
  (async () => {
    document.getElementById('loadingSpinner').style.display = 'block';

    const response = await getAttestationInfoLastMonths({
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
          getFirstTag(endorsement, 'status6') === 'reproducible'
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
            <th class="attestation-count"># Attestations, Endorsements</th>
          </tr>
        </thead>
        <tbody>
          ${sortedAttestators.map(([pubkey, stats]) => `
            <tr>
              <td id="profile-${pubkey}">${pubkey}</td>
              <td class="attestation-count">${stats.attestations}, ${stats.endorsements}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    document.getElementById('attestatorsTable').innerHTML = tableHTML;
    document.getElementById('loadingSpinner').style.display = 'none';

    // Add spacer div after table
    const spacer = document.createElement('div');
    spacer.style.height = '300px';
    document.getElementById('attestatorsTable').appendChild(spacer);

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