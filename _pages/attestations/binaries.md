---
layout: archive
title: "Latest Assets"
permalink: /binaries/
---

<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

<style>
  .markdown-content {
    padding: 0;
    overflow-wrap: break-word;
  }
  .markdown-content code {
    background-color: rgba(0,0,0,0.05);
    padding: 2px 4px;
    border-radius: 3px;
  }
  .markdown-content pre {
    background-color: rgba(0,0,0,0.05);
    padding: 10px;
    border-radius: 5px;
    overflow-x: auto;
  }
  .markdown-content img {
    max-width: 100%;
  }
  
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
  #attestationContent p {
    margin-top: 0.4em;
    margin-bottom: 0em;
  }

  thead {
    background-color: #f5f5f5;
  }
  body.dark thead {
    background-color: #656565;
  }
</style>

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

    const response = await getAttestationInfoLastMonths();
    // console.log('**** response', response);

    document.getElementById('loadingSpinner').style.display = 'none';

    const binaries = Array.from(response.assets);

    const sortedBinaries = binaries.sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );

    const table = document.createElement('table');
    table.innerHTML = `
      <thead>
        <tr>
          <th style="text-align: center;">Wallet</th>
          <th style="text-align: center;">Version</th>
          <th style="text-align: center;">Asset Description</th>
          <th style="text-align: center;">SHA256</th>
          <th style="text-align: center;">URL</th>
          <th style="text-align: center;">Attestations</th>
          <th style="text-align: center;">Observed At</th>
        </tr>
      </thead>
    ` ;

    sortedBinaries.forEach(binary => {
      const date = new Date(binary.created_at * 1000).toLocaleDateString(navigator.language, {
        year: '2-digit',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const sha256Hash = binary.tags.find(tag => tag[0] === 'x')?.[1] || '';
      const truncatedHash = `${sha256Hash.slice(0,4)}...${sha256Hash.slice(-4)}`;
      const downloadUrl = binary.tags.find(tag => tag[0] === 'url')?.[1] || '';
      const version = binary.tags.find(tag => tag[0] === 'version')?.[1] || '';
      const identifier = binary.tags.find(tag => tag[0] === 'i')?.[1] || "";

      const attestations = response.attestations.get(binary.tags.find(tag => tag[0] === 'x')?.[1]) || [];

      let attestationList;
      if (attestations.length > 0) {
        let listItems = '';
        for (const attestation of attestations) {
          const attestationDate = new Date(attestation.created_at * 1000).toLocaleDateString(navigator.language, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          const status = attestation.tags.find(tag => tag[0] === 'status')?.[1] || '';

          const statusIcon = status === 'reproducible' ? '✅' : '❌';

          listItems += `<li onclick='showAttestationModal("${sha256Hash}", "${attestation.id}")' style="cursor: pointer;">
            ${attestationDate} <span style="margin: 0 8px;">${statusIcon}</span>
          </li>`;
        }
        attestationList = `<ul>${listItems}</ul>`;
      } else {
        attestationList = `No attestations yet - <a href="/attest" target="_blank" rel="noopener noreferrer">do it yourself</a>`;
      }

      const wallet = window.wallets.find(w => w.appId === identifier);
      const walletTitle = wallet ? wallet.title : identifier;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td style="text-align: center;">
          ${wallet ? `<a href="${wallet.url}" target="_blank" rel="noopener noreferrer">${walletTitle}</a>` : walletTitle}
        </td>
        <td style="text-align: center;">${version}</td>
        <td>${binary.content}</td>
        <td style="text-align: center;">
          <span>${truncatedHash}</span>
          <button onclick="navigator.clipboard.writeText('${sha256Hash}')" style="border: none; background: none; cursor: pointer; padding: 0 5px;">
            📋
          </button>
        </td>
        <td style="text-align: center;">
          ${downloadUrl ? `<a href="${downloadUrl}" target="_blank" rel="noopener noreferrer">Download</a>` : 'N/A'}
        </td>
        <td>${attestationList}</td>
        <td style="text-align: center;">${date}</td>
      `;
      table.appendChild(row);
    });

    document.getElementById('binariesTable').appendChild(table);
    
    // Add spacer div after table
    const spacer = document.createElement('div');
    spacer.style.height = '300px';
    document.getElementById('binariesTable').appendChild(spacer);

    window.showAttestationModal = async function(sha256Hash, attestationId) {
      const attestations = response.attestations.get(sha256Hash);
      const attestation  = attestations.find(a => a.id === attestationId);
      const otherAttestationsBySamePubkey = attestations.filter(a => (a.pubkey === attestation.pubkey && a.id !== attestationId));

      const status = attestation.tags.find(tag => tag[0] === 'status')?.[1] || '';

      const modal = document.getElementById('attestationModal');
      const content = document.getElementById('attestationContent');
      
      modal.style.background = window.theme === 'dark' ? '#2d2d2d' : 'white';
      modal.style.color = window.theme === 'dark' ? 'white' : 'black';

      let otherAttestationsHTML = '';
      if (otherAttestationsBySamePubkey.length > 0) {
        for (const otherAttestation of otherAttestationsBySamePubkey) {
          const attestationDate = new Date(otherAttestation.created_at * 1000).toLocaleDateString(navigator.language, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          const status = otherAttestation.tags.find(tag => tag[0] === 'status')?.[1] || '';

          const statusIcon = status === 'reproducible' ? '✅' : '❌';

          otherAttestationsHTML += `<li>
            ${attestationDate} <span style="margin: 0 8px;">${statusIcon}</span>
          </li>`;
        }
        otherAttestationsHTML = `<ul>${otherAttestationsHTML}</ul>`;
      }
      
      content.innerHTML = `
        <p><strong>Attempt by:</strong> <span id="attempt-by">${attestation.pubkey}</span></p>
        <p><strong>Created At:</strong> ${new Date(attestation.created_at * 1000).toLocaleString()}</p>
        <p><strong>Status: </strong> ${status} ${status === 'reproducible' ? '✅' : '❌'}</p>
        <p><strong>Information:</strong>
          <div class="markdown-content">${marked.parse(attestation.content)}</div>
        </p>
      `;

      if (otherAttestationsHTML !== '') {
        content.innerHTML += `<p><strong>Other attempts by this user:</strong> ${otherAttestationsHTML}</p>`;
      }

      modal.style.display = 'block';

      const profile = await getNostrProfile(attestation.pubkey);
      
      document.getElementById('attempt-by').innerHTML = `
        <div class="profile-card">
          ${profile.image ? `<img src="${profile.image}" class="profile-image" onerror="this.style.display='none'"/>` : ''}
          <div class="profile-info">
            <div>${profile.name || attestation.pubkey}</div>
            ${profile.nip05 ? `<div class="profile-nip05">${profile.nip05}</div>` : ''}
          </div>
        </div>
      `;
    };

    document.getElementById('closeModal').onclick = function() {
      document.getElementById('attestationModal').style.display = 'none';
    };
  })();
</script>