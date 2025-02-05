import {marked} from 'marked';
import DOMPurify from 'dompurify';

let response = null;

window.renderAssetsTable = async function({htmlElementId, assetsPubkey, attestationsPubkey, appId, sha256, hideConfig, getAssetsForMyAttestations, showOnlyRows = 100}) {
  response = await getAllAssetInformation({
    months: 6,
    assetsPubkey,
    attestationsPubkey,
    appId,
    sha256,
    getAssetsForMyAttestations
  });

  const hasBinaries = response.assets.size > 0;
  let hasLegacyBinaries = false;
  let hasAttestations = false;

  // Convert to array and sort by most recent asset in each group
  const sortedBinaries = Array.from(response.assets.entries()).map(([sha256, assets]) => {
    // Sort assets within each SHA256 group by date and take the most recent one
    const sortedAssets = assets.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return {
      sha256,
      assets: sortedAssets,
      created_at: sortedAssets[0].created_at  // Use the most recent asset's created_at for sorting
    };
  });

  // Add old tests information to sortedBinaries if oldTestsInfo is defined and is an array
  if (typeof oldTestsInfo !== 'undefined' && Array.isArray(oldTestsInfo)) {
    oldTestsInfo.forEach(oldTest => {
      if (oldTest.date && oldTest.version && oldTest.verdict) {
        hasLegacyBinaries = true;
        sortedBinaries.push({
          created_at: Math.floor(new Date(oldTest.date).getTime() / 1000),
          tags: [
            ['version', oldTest.version],
            ['status', oldTest.verdict],
            ['x', oldTest.appHash]
          ],
          content: `Legacy verdict by WS`,
          isLegacy: true,
          gitRevision: oldTest.gitRevision
        });
      }
    });
  }

  sortedBinaries.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr>
        ${hideConfig?.wallet ? '' : '<th>Wallet</th>'}
        ${hideConfig?.wallet ? '<th>Version</th>' : ''}
        <th>Asset Description</th>
        ${hideConfig?.sha256 ? '' : '<th>SHA256</th>'}
        <th>URL</th>
        <th>Attestations</th>
        <th>Observed At</th>
        ${getAssetsForMyAttestations ? '<th>Worked On</th>' : ''}
      </tr>
    </thead>
  `;

  if (sortedBinaries.length > 0) {
    sortedBinaries.forEach((item, index) => {
      // Handle both legacy and new format
      const binary = item.assets ? item.assets[0] : item;
      const date = new Date(binary.created_at * 1000).toLocaleDateString(navigator.language, 
        binary.isLegacy ? {
          year: '2-digit',
          month: 'short',
          day: 'numeric'
        } : {
          year: '2-digit',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }
      );

      const eventId = binary.id;
      const sha256Hash = item.sha256 || binary.tags?.find(tag => tag[0] === 'x')?.[1] || '';
      const truncatedHash = sha256Hash ? `${sha256Hash.slice(0,4)}...${sha256Hash.slice(-4)}` : '';
      const downloadUrl = binary.tags.find(tag => tag[0] === 'url')?.[1] || '';
      const version = binary.tags.find(tag => tag[0] === 'version')?.[1] || '';
      const oldInfoStatus = binary.tags.find(tag => tag[0] === 'status')?.[1] || '';
      const identifier = binary.tags.find(tag => tag[0] === 'i')?.[1] || "";
      let longStatus = null;

      if (binary.isLegacy) {
        let openLinkTag = null;

        if (binary.gitRevision) {
          const firstPathToken = window.location.pathname.split('/').filter(Boolean)[0];
          openLinkTag = '<a target="_blank" rel="noopener noreferrer" href="https://gitlab.com/walletscrutiny/walletScrutinyCom/blob/' + binary.gitRevision + '/_' + firstPathToken + '/' + appId + '.md">';
          longStatus = '';
        }

        switch (oldInfoStatus) {
          case 'reproducible':
            longStatus += '✅ ' + openLinkTag + 'Reproducible when tested' + (openLinkTag ? '</a>' : '');
            break;
          case 'nonverifiable':
            longStatus += '❌ ' + openLinkTag + 'Failed to build from source provided' + (openLinkTag ? '</a>' : '');
            break;
          case 'ftbfs':
            longStatus += '❌ ' + openLinkTag + 'Not reproducible from source provided' + (openLinkTag ? '</a>' : '');
            break;
        }
      }

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

          let statusText = null;

          switch (status) {
            case 'reproducible':
              statusText = '✅ <span class="attestation-status">Reproducible when tested</span>';
              break;
            case 'not_reproducible':
              statusText = '❌ <span class="attestation-status">Failed to build from source provided</span>';
              break;
            case 'ftbfs':
              statusText = '❌ <span class="attestation-status">Not reproducible from source provided</span>';
              break;
          }

          listItems += `<span onclick='showAttestationModal("${sha256Hash}", "${attestation.id}")' class="attestation-link" style="cursor: pointer; margin-bottom: 0; margin-top: 0;">
            ${statusText}<br><small>(${attestationDate})</small>
          </span>`;
        }
        attestationList = `${listItems}
        ${hideConfig?.buttons ? '' :
        `<div style="margin-top: 4px;"><a href="/new_attestation/?sha256=${sha256Hash}&assetEventId=${eventId}" class="btn-small btn-success" target="_blank" rel="noopener noreferrer">Create another attestation</a></div>`}`;
      } else {
        attestationList = `No attestations yet.
        ${hideConfig?.buttons ? '' : 
        `<div style="margin-top: 4px;"><a href="/new_attestation/?sha256=${sha256Hash}&assetEventId=${eventId}" class="btn-small btn-success" target="_blank" rel="noopener noreferrer">Create attestation</a></div>`}`;
      }

      const wallet = window.wallets.find(w => w.appId === identifier);
      const walletTitle = wallet ? wallet.title : identifier;

      const row = document.createElement('tr');
      row.className = index >= showOnlyRows ? 'hidden-row' : '';
      const sanitizedVersion = version.replace(/\./g, '-');
      row.setAttribute('id', `version-${sanitizedVersion}`);
      row.innerHTML = `
        ${hideConfig?.wallet ? '' : `<td>
          ${wallet ? `<a href="${wallet.url}" target="_blank" rel="noopener noreferrer">${walletTitle}</a><br>${version}` : walletTitle}
        </td>`}
        ${hideConfig?.wallet ? `<td>
          ${version}
        </td>` : ''}
        <td class="asset-description">${item.assets ? [...new Set(item.assets.map(asset => asset.content))].join('<br>') : binary.content}</td>
        ${hideConfig?.sha256 ? '' : `<td>
          ${sha256Hash ? `
          <span>${truncatedHash}</span>
          <button onclick="navigator.clipboard.writeText('${sha256Hash}').then(() => showToast('SHA256 copied to clipboard'))" class="copy-button">
            📋
          </button>` : '-'}
        </td>`}
        <td>
          ${downloadUrl ? `<a href="${downloadUrl}" target="_blank" rel="noopener noreferrer">Download</a>` : '-'}
        </td>
        <td>${binary.isLegacy ? (longStatus ? longStatus : oldInfoStatus) : attestationList}</td>
        <td>${date}</td>
        ${getAssetsForMyAttestations ? `
          <td>
            <ul style="padding: 0; margin: 0; list-style-position: inside; text-align: left;">
            ${binary.pubkey === assetsPubkey ? '<li>Registered Asset</li>' : ''}
            ${(attestations.some(att => att.pubkey === assetsPubkey)) ? '<li>Created Attestation</li>' : ''}
            </ul>
          </td>` : ''}
      `;
      table.appendChild(row);
    });

    if (sortedBinaries.length > showOnlyRows) {
      const showMoreRow = document.createElement('tr');
      showMoreRow.className = 'show-more-row';
      showMoreRow.innerHTML = `
        <td colspan="8" style="text-align: center;">
          <a href="#" class="show-more-link">Show ${sortedBinaries.length - showOnlyRows} more</a>
        </td>
      `;
      table.appendChild(showMoreRow);

      const showMoreLink = showMoreRow.querySelector('.show-more-link');
      showMoreLink.addEventListener('click', (e) => {
        e.preventDefault();
        const hiddenRows = table.querySelectorAll('.hidden-row');
        hiddenRows.forEach(row => row.classList.remove('hidden-row'));
        showMoreRow.remove();
      });
    }
  } else {
    const row = document.createElement('tr');
    if (assetsPubkey || attestationsPubkey) {
      row.innerHTML = '<td colspan="8">No assets found for this user</td>';
    } else {
      row.innerHTML = '<td colspan="8">No assets found</td>';
    }
    table.appendChild(row);
  }

  document.getElementById(htmlElementId).appendChild(table);

  return {
    hasAttestations,
    hasBinaries,
    hasLegacyBinaries,
    info: response
  };
};

window.showAttestationModal = async function(sha256Hash, attestationId) {
  document.body.classList.add("modal-open");
  
  const attestations = response.attestations.get(sha256Hash);
  const attestation  = attestations.find(a => a.id === attestationId);
  const otherAttestationsBySamePubkey = attestations.filter(a => (a.pubkey === attestation.pubkey && a.id !== attestationId));

  const status = attestation.tags.find(tag => tag[0] === 'status')?.[1] || '';

  const modal = document.getElementById('attestationModal');
  const content = document.getElementById('attestationContent');
  
  // Reset scroll positions before showing the modal again
  setTimeout(() => {
    content.scrollTop = 0;
    content.scrollLeft = 0;
  }, 0);

  modal.style.background = window.theme === 'dark' ? '#2d2d2df7' : '#e1e1e1f7';
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
        ? '<span title="Reproducible" style="margin-left: 4px;">✅</span>' 
        : '<span title="Not Reproducible" style="margin-left: 4px;">❌</span>';

      otherAttestationsHTML += `<li>
        ${attestationDate} ${statusIcon}
      </li>`;
    }
    otherAttestationsHTML = `<ul class="attestation-other-attempts">${otherAttestationsHTML}</ul>`;
  }
  
  content.innerHTML = `
    <p><strong>Attempt by:</strong> <span id="attempt-by"></span></p>
    <p><strong>Created At:</strong> ${new Date(attestation.created_at * 1000).toLocaleDateString(navigator.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}</p>
    <p><strong>Status: </strong> ${status} ${status === 'reproducible' ? '✅' : '❌'}</p>`;

  if (otherAttestationsHTML !== '') {
    content.innerHTML += `<p><strong>Other attempts by this user:</strong> ${otherAttestationsHTML}</p>`;
  }

  content.innerHTML += `
    <p><strong>Information:</strong>
      <div class="markdown-content">${DOMPurify.sanitize(marked.parse(attestation.content))}</div>
    </p>
  `;

  // Play asciicast
  if (attestation.content.includes('ascii_cast_player')) {
    // Inyect the asciinema player .js and .css
    const asciinemaPlayerJS = document.createElement('script');
    asciinemaPlayerJS.src = '/assets/js/asciinema-player.min.js';
    document.head.appendChild(asciinemaPlayerJS);

    const asciinemaPlayerCSS = document.createElement('link');
    asciinemaPlayerCSS.rel = 'stylesheet';
    asciinemaPlayerCSS.href = '/assets/css/asciinema-player.min.css';
    document.head.appendChild(asciinemaPlayerCSS);

    // Wait until asciinemaPlayerJS is loaded
    asciinemaPlayerJS.onload = () => {
      const urlPath = window.location.pathname;
      const pathParts = urlPath.split('/').filter(Boolean);
      const folderName = pathParts[0];
      const appId = pathParts[1];

      AsciinemaPlayer.create(
        '/assets/casts/'+folderName+'/'+appId+`.cast`,
        document.getElementById('ascii_cast_player'),{
        idleTimeLimit: 1,
        autoPlay: true,
        rows: 25
      });
    };
  }

  modal.style.display = 'block';

  const profile = await getNostrProfile(attestation.pubkey);
  
  document.getElementById('attempt-by').innerHTML = profile ? `
    <div class="profile-card">
      ${profile.image ? `<img src="${profile.image}" class="profile-image" onclick="window.location.href='/attestator/?pubkey=${attestation.pubkey}'" onerror="this.style.display='none'"/>` : ''}
      <div class="profile-info" onclick="window.location.href='/attestator/?pubkey=${attestation.pubkey}'">
        <div>${profile.name || attestation.pubkey}</div>
        ${profile.nip05 ? `<div class="profile-nip05">${profile.nip05}</div>` : ''}
      </div>
    </div>
  ` : attestation.pubkey;

  document.getElementById('closeModal').onclick = function() {
    modal.style.display = 'none';
    window.removeEventListener('click', handleClick);
    window.removeEventListener('keydown', handleKeyDown);
    document.body.classList.remove("modal-open");
  };

  const handleClick = function(event) {
    if (!modal.contains(event.target)) {
      modal.style.display = 'none';
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove("modal-open");
    }
  };

  const handleKeyDown = function(event) {
    if (event.key === 'Escape') {
      modal.style.display = 'none';
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove("modal-open");
    }
  };

  window.addEventListener('click', handleClick);
  window.addEventListener('keydown', handleKeyDown);
};