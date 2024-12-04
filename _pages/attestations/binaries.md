---
layout: archive
title: "Latest Binaries"
permalink: /binaries/
---

<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

<style>
  .markdown-content {
    padding: 10px;
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
</style>

<div id="binariesTable"></div>

<div id="attestationModal" style="display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); padding:20px; border:1px solid var(--border-color); z-index:1000;" class="modal-theme">
  <span id="closeModal" style="cursor:pointer; position:absolute; top:10px; right:10px;">&times;</span>
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
    console.log('**** response', response);

    document.getElementById('loadingSpinner').style.display = 'none';

    const binaries = Array.from(response.assets);

    const sortedBinaries = binaries.sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
      <th style="text-align: center;">Wallet</th>
      <th style="text-align: center;">Description</th>
      <th style="text-align: center;">SHA256</th>
      <th style="text-align: center;">URL</th>
      <th style="text-align: center;">Attestations</th>
      <th style="text-align: center;">Created At</th>
    `;
    table.appendChild(headerRow);

    sortedBinaries.forEach(binary => {
      const row = document.createElement('tr');
      const date = new Date(binary.created_at * 1000).toLocaleDateString(navigator.language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const sha256Hash = binary.tags.find(tag => tag[0] === 'x')?.[1] || '';
      const truncatedHash = `${sha256Hash.slice(0,4)}...${sha256Hash.slice(-4)}`;
      
      const downloadUrl = binary.tags.find(tag => tag[0] === 'url')?.[1] || '';

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

          attestationInfo = {
            content: attestation.content,
            created_at: attestation.created_at,
            status: attestation.tags.find(tag => tag[0] === 'status')?.[1] || ''
          };

          listItems += `<li onclick='showAttestationModal(${JSON.stringify(attestationInfo)})' style="cursor: pointer;">
            ${attestationDate}
          </li>`;
        }
        attestationList = `<ul style="font-size: smaller;">${listItems}</ul>`;
      } else {
        attestationList = `No attestations yet - <a href="/attest" target="_blank" rel="noopener noreferrer">do it yourself</a>`;
      }

      const wallet = window.wallets.find(w => w.appId === identifier);
      const walletTitle = wallet ? wallet.title : identifier;

      row.innerHTML = `
        <td style="text-align: center;">
          ${wallet ? `<a href="${wallet.url}" target="_blank" rel="noopener noreferrer">${walletTitle}</a>` : walletTitle}
        </td>
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

    window.showAttestationModal = function(attestation) {
      const modal = document.getElementById('attestationModal');
      const content = document.getElementById('attestationContent');
      
      modal.style.background = window.theme === 'dark' ? '#2d2d2d' : 'white';
      modal.style.color = window.theme === 'dark' ? 'white' : 'black';
      
      content.innerHTML = `
        <p><strong>Created At:</strong> ${new Date(attestation.created_at * 1000).toLocaleString()}</p>
        <p><strong>Status: </strong> ${attestation.status}</p>
        <p><strong>Information:</strong>
          <div class="markdown-content">${marked.parse(attestation.content)}</div>
        </p>         
      `;
      modal.style.display = 'block';
    };

    document.getElementById('closeModal').onclick = function() {
      document.getElementById('attestationModal').style.display = 'none';
    };
  })();
</script>