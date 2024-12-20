import {marked} from 'marked';
import DOMPurify from 'dompurify';

let response = null;

window.renderAssetsTable = async function({htmlElementId, assetsPubkey, attestationsPubkey, appId, sha256, hideConfig}) {
  response = await getAllAssetInformation({
    months: 6,
    assetsPubkey,
    attestationsPubkey,
    appId,
    sha256
  });

  const binaries = Array.from(response.assets);
  const hasBinaries = binaries.length > 0;
  let hasAttestations = false;

  const sortedBinaries = binaries.sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  );

  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr>
        ${hideConfig?.wallet ? '' : '<th>Wallet</th>'}
        <th>Version</th>
        <th>Asset Description</th>
        ${hideConfig?.sha256 ? '' : '<th>SHA256</th>'}
        <th>URL</th>
        <th>Attestations</th>
        <th>Observed At</th>
      </tr>
    </thead>
  `;

  sortedBinaries.forEach(binary => {
    const date = new Date(binary.created_at * 1000).toLocaleDateString(navigator.language, {
      year: '2-digit',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const eventId = binary.id;
    const sha256Hash = binary.tags.find(tag => tag[0] === 'x')?.[1] || '';
    const truncatedHash = `${sha256Hash.slice(0,4)}...${sha256Hash.slice(-4)}`;
    const downloadUrl = binary.tags.find(tag => tag[0] === 'url')?.[1] || '';
    const version = binary.tags.find(tag => tag[0] === 'version')?.[1] || '';
    const identifier = binary.tags.find(tag => tag[0] === 'i')?.[1] || "";

    const attestations = response.attestations.get(binary.tags.find(tag => tag[0] === 'x')?.[1]) || [];

    let attestationList;
    if (attestations.length > 0) {
      hasAttestations = true;
      
      const latestAttestationsByUser = new Map();
      for (const attestation of attestations) {
        const existingAttestation = latestAttestationsByUser.get(attestation.pubkey);
        if (!existingAttestation || attestation.created_at > existingAttestation.created_at) {
          latestAttestationsByUser.set(attestation.pubkey, attestation);
        }
      }

      let listItems = '';
      for (const attestation of latestAttestationsByUser.values()) {
        const attestationDate = new Date(attestation.created_at * 1000).toLocaleDateString(navigator.language, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        const status = attestation.tags.find(tag => tag[0] === 'status')?.[1] || '';

        const statusIcon = status === 'reproducible' 
          ? '<span title="Reproducible" style="margin-left: 6px;">✅</span>' 
          : '<span title="Not Reproducible" style="margin-left: 6px;">❌</span>';

        listItems += `<li onclick='showAttestationModal("${sha256Hash}", "${attestation.id}")' style="cursor: pointer;">
          ${attestationDate} ${statusIcon}
        </li>`;
      }
      attestationList = `<ul style="text-align: left; padding-inline-start: 20px;">${listItems}</ul>
      ${hideConfig?.buttons ? '' :
      `<div style="margin-top: 4px;"><a href="/new_attestation/?sha256=${sha256Hash}&assetEventId=${eventId}" class="btn-small btn-success" target="_blank" rel="noopener noreferrer">Create another attestation</a></div>`}`;
    } else {
      attestationList = `No attestations yet.
      ${hideConfig?.buttons ? '' : 
      `<div style="margin-top: 4px;"><a href="/new_attestation/?sha256=${sha256Hash}&assetEventId=${eventId}" class="btn-small btn-success" target="_blank" rel="noopener noreferrer">Attest this binary</a></div>`}`;
    }

    const wallet = window.wallets.find(w => w.appId === identifier);
    const walletTitle = wallet ? wallet.title : identifier;

    const row = document.createElement('tr');
    row.innerHTML = `
      ${hideConfig?.wallet ? '' : `<td>
        ${wallet ? `<a href="${wallet.url}" target="_blank" rel="noopener noreferrer">${walletTitle}</a>` : walletTitle}
      </td>`}
      <td>${version}</td>
      <td class="asset-description">${binary.content}</td>
      ${hideConfig?.sha256 ? '' : `<td>
        <span>${truncatedHash}</span>
        <button onclick="navigator.clipboard.writeText('${sha256Hash}')" class="copy-button">
          📋
        </button>
      </td>`}
      <td>
        ${downloadUrl ? `<a href="${downloadUrl}" target="_blank" rel="noopener noreferrer">Download</a>` : 'N/A'}
      </td>
      <td>${attestationList}</td>
      <td>${date}</td>
    `;
    table.appendChild(row);
  });

  document.getElementById(htmlElementId).appendChild(table);

  return {
    hasAttestations,
    hasBinaries,
    info: response
  };
};

window.showAttestationModal = async function(sha256Hash, attestationId) {
  const attestations = response.attestations.get(sha256Hash);
  const attestation  = attestations.find(a => a.id === attestationId);
  const otherAttestationsBySamePubkey = attestations.filter(a => (a.pubkey === attestation.pubkey && a.id !== attestationId));

  const status = attestation.tags.find(tag => tag[0] === 'status')?.[1] || '';

  const modal = document.getElementById('attestationModal');
  const content = document.getElementById('attestationContent');

  modal.style.background = window.theme === 'dark' ? '#2d2d2d' : '#e1e1e1';
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

      const statusIcon = status === 'reproducible' 
        ? '<span title="Reproducible" style="margin-left: 6px;">✅</span>' 
        : '<span title="Not Reproducible" style="margin-left: 6px;">❌</span>';

      otherAttestationsHTML += `<li>
        ${attestationDate} ${statusIcon}
      </li>`;
    }
    otherAttestationsHTML = `<ul>${otherAttestationsHTML}</ul>`;
  }
  
  content.innerHTML = `
    <p><strong>Attempt by:</strong> <span id="attempt-by">${attestation.pubkey}</span></p>
    <p><strong>Created At:</strong> ${new Date(attestation.created_at * 1000).toLocaleDateString(navigator.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}</p>
    <p><strong>Status: </strong> ${status} ${status === 'reproducible' ? '✅' : '❌'}</p>
    <p><strong>Information:</strong>
      <div class="markdown-content">${DOMPurify.sanitize(marked.parse(attestation.content))}</div>
    </p>
  `;

  if (otherAttestationsHTML !== '') {
    content.innerHTML += `<p><strong>Other attempts by this user:</strong> ${otherAttestationsHTML}</p>`;
  }

  modal.style.display = 'block';

  const profile = await getNostrProfile(attestation.pubkey);
  
  document.getElementById('attempt-by').innerHTML = `
    <div class="profile-card">
      ${profile.image ? `<img src="${profile.image}" class="profile-image" onclick="window.location.href='/attestator/?pubkey=${attestation.pubkey}'" onerror="this.style.display='none'"/>` : ''}
      <div class="profile-info" onclick="window.location.href='/attestator/?pubkey=${attestation.pubkey}'">
        <div>${profile.name || attestation.pubkey}</div>
        ${profile.nip05 ? `<div class="profile-nip05">${profile.nip05}</div>` : ''}
      </div>
    </div>
  `;
};