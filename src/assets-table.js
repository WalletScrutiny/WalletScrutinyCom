import {marked} from 'marked';
import DOMPurify from 'dompurify';

let response = null;

window.renderAssetsTable = async function({htmlElementId, assetsPubkey, attestationsPubkey, appId, sha256, hideConfig, getAssetsForMyAttestations, showOnlyRows = 100, sortByVersion = false, enableSearch = false}) {
  response = await getAllAssetInformation({
    assetsPubkey,
    attestationsPubkey,
    appId,
    sha256,
    getAssetsForMyAttestations
  });

  // Add search and filter UI only if enableSearch is true
  if (enableSearch) {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'assets-search-container';
    searchContainer.style.marginBottom = '20px';
    searchContainer.innerHTML = `
      <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
        <input 
          type="text" 
          id="assetSearchInput" 
          placeholder="Search by wallet name or hash..." 
          style="padding: 8px; border-radius: 4px; border: 1px solid #ccc; flex: 1; min-width: 200px;"
        >
        <div style="display: flex; gap: 15px; align-items: flex-start; flex-wrap: wrap;">
          <style>
            @media (max-width: 768px) {
              .checkbox-container {
                flex-direction: column !important;
                gap: 0 !important;
              }
            }
          </style>
          <div class="checkbox-container" style="display: flex; gap: 15px; align-items: flex-start;">
            <label style="display: flex; align-items: center; gap: 5px; white-space: nowrap;">
              <input type="checkbox" id="showLatestVersionOnly" checked>
              <span>Show latest version only</span>
            </label>
            <label style="display: flex; align-items: center; gap: 5px; white-space: nowrap;">
              <input type="checkbox" id="showOnlyNoAttestations">
              <span>Show only unverified assets</span>
            </label>
          </div>
        </div>
      </div>
    `;

    document.getElementById(htmlElementId).appendChild(searchContainer);
  }

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
            ['status', oldTest.verdict]
          ],
          content: `Legacy verdict by WS`,
          isLegacy: true,
          gitRevision: oldTest.gitRevision
        });
      }
    });
  }

  // Function to filter and update table rows
  function updateTableVisibility() {
    // Only apply search/filter if enableSearch is true, otherwise show all rows
    if (!enableSearch) {
      return;
    }

    const searchTerm = document.getElementById('assetSearchInput').value.toLowerCase();
    const showLatestOnly = document.getElementById('showLatestVersionOnly').checked;
    const showOnlyNoAttestations = document.getElementById('showOnlyNoAttestations').checked;

    // Create a map to track latest versions when filter is active
    const latestVersions = new Map();

    // Get all rows except header and show-more
    const rows = Array.from(table.querySelectorAll('tr:not(:first-child):not(.show-more-row)'));
    
    rows.forEach(row => {
      const walletName = row.querySelector('td:first-child')?.textContent.toLowerCase() || '';
      // Get the full SHA256 hash from the button's onclick attribute
      const sha256Button = row.querySelector('button[onclick*="navigator.clipboard.writeText"]');
      const sha256Hash = sha256Button ? sha256Button.getAttribute('onclick').match(/'([a-fA-F0-9]{64})'/)?.[ 1 ]?.toLowerCase() || '' : '';
      
      // Find attestations cell by looking at the header text
      const headerCells = Array.from(table.querySelectorAll('th'));
      const attestationsIndex = headerCells.findIndex(cell => cell.textContent.trim() === 'Verifications');
      const attestationsCell = row.cells[attestationsIndex]?.textContent || '';
      const hasAttestations = !attestationsCell.includes('No verifications yet');
      
      // Get identifier for grouping latest versions
      const identifier = row.querySelector('td:first-child a')?.textContent || row.querySelector('td:first-child')?.textContent;
      
      let shouldShow = true;

      if (showOnlyNoAttestations) {
        shouldShow = !hasAttestations;
      }

      if (shouldShow && showLatestOnly) {
        if (!latestVersions.has(identifier)) {
          latestVersions.set(identifier, true);
        } else {
          shouldShow = false;
        }
      }

      if (shouldShow) {
        shouldShow = (walletName.includes(searchTerm) || sha256Hash.includes(searchTerm));
      }

      row.style.display = shouldShow ? '' : 'none';
    });
  }

  // Add event listeners for search and filters only if enableSearch is true
  if (enableSearch) {
    document.getElementById('assetSearchInput').addEventListener('input', updateTableVisibility);
    document.getElementById('showLatestVersionOnly').addEventListener('change', updateTableVisibility);
    document.getElementById('showOnlyNoAttestations').addEventListener('change', updateTableVisibility);
  }

  // Sort either by version or date depending on sortByVersion parameter
  if (sortByVersion) {
    sortedBinaries.sort((a, b) => {
      const versionA = a.assets ? a.assets[0].tags.find(tag => tag[0] === 'version')?.[1] : a.tags.find(tag => tag[0] === 'version')?.[1] || '';
      const versionB = b.assets ? b.assets[0].tags.find(tag => tag[0] === 'version')?.[1] : b.tags.find(tag => tag[0] === 'version')?.[1] || '';

      // Check for VARY string first
      const hasVaryA = versionA.includes('VARY');
      const hasVaryB = versionB.includes('VARY');
      
      if (hasVaryA !== hasVaryB) {
        return hasVaryB ? 1 : -1; // Put VARY versions first
      }

      // Split versions into components and compare numerically
      const partsA = versionA.split('.').map(part => parseInt(part) || 0);
      const partsB = versionB.split('.').map(part => parseInt(part) || 0);
      
      for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
        const numA = partsA[i] || 0;
        const numB = partsB[i] || 0;
        if (numA !== numB) {
          return numB - numA; // Sort in descending order
        }
      }
      return 0;
    });
  } else {
    sortedBinaries.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr>
        ${hideConfig?.wallet ? '' : '<th>Wallet</th>'}
        ${hideConfig?.wallet ? '<th>Version</th>' : ''}
        <th class="hide-on-mobile">Asset Description</th>
        ${hideConfig?.sha256 ? '' : '<th class="hide-on-mobile">SHA256</th>'}
        <th class="hide-on-mobile">URL</th>
        <th>Verifications</th>
        <th>Seen</th>
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
      const platform = binary.tags.find(tag => tag[0] === 'platform')?.[1] || "";
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

          listItems += `<span onclick='showAttestationModal("${sha256Hash}", "${attestation.id}", "${identifier}", "${platform}")' class="attestation-link" style="cursor: pointer; margin-bottom: 0; margin-top: 0; display: block;">
            <div style="line-height: 1.2; margin-bottom: 0.7em;">
              ${statusText}
              <small style="display: block;">(${attestationDate})</small>
            </div>
          </span>`;
        }
        attestationList = `${listItems}
        ${hideConfig?.buttons ? '' :
        `<div style="margin-top: 4px;"><a href="/new_verification/?sha256=${sha256Hash}&assetEventId=${eventId}&appId=${identifier}&version=${version}" class="btn-small btn-success" target="_blank" rel="noopener noreferrer">Create another verification</a></div>`}`;
      } else {
        attestationList = `No verifications yet.
        ${hideConfig?.buttons ? '' : 
        `<div style="margin-top: 4px;"><a href="/new_verification/?sha256=${sha256Hash}&assetEventId=${eventId}&appId=${identifier}&version=${version}" class="btn-small btn-success" target="_blank" rel="noopener noreferrer">Create verification</a></div>`}`;
      }

      const wallet = window.wallets.find(w => w.appId === identifier);
      const walletTitle = wallet ? wallet.title : identifier;

      const row = document.createElement('tr');
      row.className = index >= showOnlyRows ? 'hidden-row' : '';
      const sanitizedVersion = version.replace(/\./g, '-');
      row.setAttribute('id', `version-${sanitizedVersion}`);
      row.innerHTML = `
        ${hideConfig?.wallet ? '' : `<td>
          ${wallet ? `<a href="${wallet.url}" target="_blank" rel="noopener noreferrer">${walletTitle}</a><br>${version}<span class="show-on-mobile"><br>${item.assets ? [...new Set(item.assets.map(asset => asset.content))].join('<br>') : binary.content}<br>${sha256Hash ? `
          <button onclick="navigator.clipboard.writeText('${sha256Hash}').then(() => showToast('SHA256 copied to clipboard'))" class="copy-button">📋</button>sha256` : '-'}</span>` : walletTitle}
          </td>`}
        ${hideConfig?.wallet ? `<td>
          ${version}<span class="show-on-mobile"><br>${item.assets ? [...new Set(item.assets.map(asset => asset.content))].join('<br>') : binary.content}<br>${sha256Hash ? `
          <button onclick="navigator.clipboard.writeText('${sha256Hash}').then(() => showToast('SHA256 copied to clipboard'))" class="copy-button">📋</button>sha256` : '-'}</span>
          </td>` : ''}
        <td class="asset-description hide-on-mobile">${item.assets ? [...new Set(item.assets.map(asset => asset.content))].join('<br>') : binary.content}</td>
        ${hideConfig?.sha256 ? '' : `<td class="hide-on-mobile">
          ${sha256Hash ? `
          <span>${truncatedHash}</span>
          <button onclick="navigator.clipboard.writeText('${sha256Hash}').then(() => showToast('SHA256 copied to clipboard'))" class="copy-button">
            📋
          </button>` : '-'}
        </td>`}
        <td class="hide-on-mobile">
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

  // Apply initial filter only if enableSearch is true
  if (enableSearch) {
    updateTableVisibility();
  }

  return {
    hasAttestations,
    hasBinaries,
    hasLegacyBinaries,
    info: response
  };
};

window.showAttestationModal = async function(sha256Hash, attestationId, appId, platform) {
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
      AsciinemaPlayer.create(
        '/assets/casts/' + platform + '/' + appId + '.cast',
        document.getElementById('ascii_cast_player'),
        {
          idleTimeLimit: 1,
          autoPlay: true,
          rows: 25
        }
      );
    };
  }

  modal.style.display = 'block';

  // Add blur to all divs except attestationModal
  document.querySelectorAll('.archive > div:not(#attestationModal), .archive > h1').forEach(div => {
    div.style.filter = 'blur(5px)';
  });

  const profile = await getNostrProfile(attestation.pubkey);
  
  document.getElementById('attempt-by').innerHTML = profile ? `
    <div class="profile-card">
      ${profile.image ? `<img src="${profile.image}" class="profile-image" onclick="window.location.href='/verifier/?pubkey=${attestation.pubkey}'" onerror="this.style.display='none'"/>` : ''}
      <div class="profile-info" onclick="window.location.href='/verifier/?pubkey=${attestation.pubkey}'">
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
    // Remove blur from all divs
    document.querySelectorAll('.archive > div:not(#attestationModal), .archive > h1').forEach(div => {
      div.style.filter = '';
    });
  };

  const handleClick = function(event) {
    if (!modal.contains(event.target)) {
      modal.style.display = 'none';
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove("modal-open");
      // Remove blur from all divs
      document.querySelectorAll('.archive > div:not(#attestationModal), .archive > h1').forEach(div => {
        div.style.filter = '';
      });
    }
  };

  const handleKeyDown = function(event) {
    if (event.key === 'Escape') {
      modal.style.display = 'none';
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove("modal-open");
      // Remove blur from all divs
      document.querySelectorAll('.archive > div:not(#attestationModal), .archive > h1').forEach(div => {
        div.style.filter = '';
      });
    }
  };

  window.addEventListener('click', handleClick);
  window.addEventListener('keydown', handleKeyDown);
};