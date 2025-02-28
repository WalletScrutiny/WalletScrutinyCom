import {marked} from 'marked';
import DOMPurify from 'dompurify';
import { assetRegistrationKind } from "./nostr-constants.mjs";

let response = null;

const table = document.createElement('table');

// Filter table rows
function updateTableVisibility() {
  const searchTerm = document.getElementById('assetSearchInput').value.toLowerCase();
  const showLatestOnly = document.getElementById('showLatestVersionOnly').checked;
  const showOnlyNoVerifications = document.getElementById('showOnlyNoVerifications').checked;

  // Create a map to track latest versions when filter is active
  const latestVersions = new Map();

  // Get all rows except header and show-more
  const rows = Array.from(table.querySelectorAll('tr:not(:first-child):not(.show-more-row)'));
  
  rows.forEach(row => {
    const walletName = row.querySelector('td:first-child')?.textContent.toLowerCase() || '';
    // Get the full SHA256 hash from the button's onclick attribute
    const sha256Button = row.querySelector('button[onclick*="navigator.clipboard.writeText"]');
    const sha256Hash = sha256Button ? sha256Button.getAttribute('onclick').match(/'([a-fA-F0-9]{64})'/)?.[ 1 ]?.toLowerCase() || '' : '';
    
    // Find Verifications cell by looking at the header text
    const headerCells = Array.from(table.querySelectorAll('th'));
    const verificationsIndex = headerCells.findIndex(cell => cell.textContent.trim() === 'Verifications');
    const verificationsCell = row.cells[verificationsIndex]?.textContent || '';
    const hasVerifications = !verificationsCell.includes('No verifications yet');
    
    // Get identifier for grouping latest versions
    const identifier = row.querySelector('td:first-child a')?.textContent || row.querySelector('td:first-child')?.textContent;
    
    let shouldShow = true;

    if (showOnlyNoVerifications) {
      shouldShow = !hasVerifications;
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

window.renderAssetsTable = async function({htmlElementId, pubkey, appId, sha256, hideConfig, showOnlyRows = 100, sortByVersion = false, enableSearch = false}) {
  response = await getAllAssetInformation({
    pubkey,
    appId,
    sha256
  });

  // Search and filter UI
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
              <input type="checkbox" id="showOnlyNoVerifications">
              <span>Show only unverified assets</span>
            </label>
          </div>
        </div>
      </div>
    `;

    document.getElementById(htmlElementId).appendChild(searchContainer);
  }

  let hasLegacyVerifications = false;
  let hasVerifications = false;

  const combinedItems = new Map([...response.verifications.entries(), ...response.assets.entries()]);

  // It's items because they can be verifications or assets (no status or content)
  // Convert to array and sort by most recent item in each group
  const sortedItems = Array.from(combinedItems).map(([sha256, items]) => {
    // Sort assets within each SHA256 group by date and take the most recent one
    const sortedItems = items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return {
      sha256,
      items: sortedItems
    };
  });

  // Add old tests information to sortedItems if oldTestsInfo is defined and is an array
/*
  if (typeof oldTestsInfo !== 'undefined' && Array.isArray(oldTestsInfo)) {
    oldTestsInfo.forEach(oldTest => {
      if (oldTest.date && oldTest.version && oldTest.verdict) {
        hasLegacyVerifications = true;
        sortedItems.push({
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
*/

  // Add event listeners for search and filters only if enableSearch is true
  if (enableSearch) {
    document.getElementById('assetSearchInput').addEventListener('input', updateTableVisibility);
    document.getElementById('showLatestVersionOnly').addEventListener('change', updateTableVisibility);
    document.getElementById('showOnlyNoVerifications').addEventListener('change', updateTableVisibility);
  }

  // Sort either by version or date depending on sortByVersion parameter
  if (sortByVersion) {
    sortedItems.sort((a, b) => {
      const versionA = a.items[0].tags.find(tag => tag[0] === 'version')?.[1] || '';
      const versionB = b.items[0].tags.find(tag => tag[0] === 'version')?.[1] || '';

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
    sortedItems.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  table.innerHTML = `
    <thead>
      <tr>
        ${hideConfig?.wallet ? '' : '<th>Wallet</th>'}
        ${hideConfig?.wallet ? '<th>Version</th>' : ''}
        <th class="hide-on-mobile">Description</th>
        ${hideConfig?.sha256 ? '' : '<th class="hide-on-mobile">Hashes</th>'}
        <th class="hide-on-mobile">URL</th>
        <th>Verifications</th>
        <th>Seen</th>
      </tr>
    </thead>
  `;

  if (sortedItems.length > 0) {
    sortedItems.forEach((item, index) => {
      // Handle both legacy and new format
      const binary = item.items ? item.items[0] : item;

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
      const sha256Hashes = binary.tags?.filter(tag => tag[0] === 'x') || [];
      const sha256HashKey = item.sha256;
      const downloadUrl = binary.tags.find(tag => tag[0] === 'url')?.[1] || '';
      const version = binary.tags.find(tag => tag[0] === 'version')?.[1] || '';
      const oldInfoStatus = binary.tags.find(tag => tag[0] === 'status')?.[1] || '';
      const identifier = binary.tags.find(tag => tag[0] === 'i')?.[1] || "";
      const platform = binary.tags.find(tag => tag[0] === 'platform')?.[1] || "";

      // Guess if it's an asset or a verification
      const isAsset = binary.kind === assetRegistrationKind;
      const itemDescription = isAsset ? binary.content : JSON.parse(binary.content).description;

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

      const attestations = response.verifications.get(binary.tags.find(tag => tag[0] === 'x')?.[1]) || [];

      let attestationList;
      if (attestations.length > 0) {
        hasVerifications = true;
        
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

          listItems += `<span onclick='showVerificationModal("${sha256HashKey}", "${attestation.id}", "${identifier}", "${platform}")' class="attestation-link" style="cursor: pointer; margin-bottom: 0; margin-top: 0; display: block;">
            <div style="line-height: 1.2; margin-bottom: 0.7em;">
              ${statusText}
              <small style="display: block;">(${attestationDate})</small>
            </div>
          </span>`;
        }
        attestationList = `${listItems}
        ${hideConfig?.buttons ? '' :
        `<div style="margin-top: 4px;"><a href="/new_verification/?sha256=${sha256HashKey}&assetEventId=${eventId}&appId=${identifier}&version=${version}" class="btn-small btn-success" target="_blank" rel="noopener noreferrer">Create another verification</a></div>`}`;
      } else {
        attestationList = `No verifications yet.
        ${hideConfig?.buttons ? '' : 
        `<div style="margin-top: 4px;"><a href="/new_verification/?sha256=${sha256HashKey}&assetEventId=${eventId}&appId=${identifier}&version=${version}" class="btn-small btn-success" target="_blank" rel="noopener noreferrer">Create verification</a></div>`}`;
      }

      const wallet = window.wallets.find(w => w.appId === identifier);
      const walletTitle = wallet ? wallet.title : identifier;

      const row = document.createElement('tr');
      row.className = index >= showOnlyRows ? 'hidden-row' : '';
      const sanitizedVersion = version.replace(/\./g, '-');
      row.setAttribute('id', `version-${sanitizedVersion}`);
      row.innerHTML = `
        ${hideConfig?.wallet ? '' : `<td>
          ${wallet ? `<a href="${wallet.url}" target="_blank" rel="noopener noreferrer">${walletTitle}</a><br>${version}<span class="show-on-mobile"><br>${itemDescription}<br>${sha256Hashes.length > 0 ? sha256Hashes.map(hash => `
          <div style="margin-bottom: 4px;">
            <button onclick="navigator.clipboard.writeText('${hash[1]}').then(() => showToast('Hash copied to clipboard'))" class="copy-button">📋</button>${hash[1].slice(0,4)}...${hash[1].slice(-4)}
          </div>`).join('') : '-'}</span>` : walletTitle}
          </td>`}
        ${hideConfig?.wallet ? `<td>
          ${version}<span class="show-on-mobile"><br>${itemDescription}<br>${sha256Hashes.length > 0 ? sha256Hashes.map(hash => `
          <div style="margin-bottom: 4px;">
            <button onclick="navigator.clipboard.writeText('${hash[1]}').then(() => showToast('Hash copied to clipboard'))" class="copy-button">📋</button>${hash[1].slice(0,4)}...${hash[1].slice(-4)}
          </div>`).join('') : '-'}</span>
          </td>` : ''}
        <td class="asset-description hide-on-mobile">${itemDescription}</td>
        ${hideConfig?.sha256 ? '' : `<td class="hide-on-mobile">
          ${sha256Hashes.length > 0 ? sha256Hashes.map(hash => `
          <div style="margin-bottom: 4px;">
            <span>${hash[1].slice(0,4)}...${hash[1].slice(-4)}</span>
            <button onclick="navigator.clipboard.writeText('${hash[1]}').then(() => showToast('Hash copied to clipboard'))" class="copy-button">
              📋
            </button>
          </div>`).join('') : '-'}
        </td>`}
        <td class="hide-on-mobile">
          ${downloadUrl ? `<a href="${downloadUrl}" target="_blank" rel="noopener noreferrer">Download</a>` : '-'}
        </td>
        <td>${binary.isLegacy ? (longStatus ? longStatus : oldInfoStatus) : attestationList}</td>
        <td>${date}</td>`;
      table.appendChild(row);
    });

    if (sortedItems.length > showOnlyRows) {
      const showMoreRow = document.createElement('tr');
      showMoreRow.className = 'show-more-row';
      showMoreRow.innerHTML = `
        <td colspan="8" style="text-align: center;">
          <a href="#" class="show-more-link">Show ${sortedItems.length - showOnlyRows} more</a>
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
    if (pubkey) {
      row.innerHTML = '<td colspan="8">No verifications found for this user</td>';
    } else {
      row.innerHTML = '<td colspan="8">No verifications found</td>';
    }
    table.appendChild(row);
  }

  document.getElementById(htmlElementId).appendChild(table);

  // Apply initial filter only if enableSearch is true
  if (enableSearch) {
    updateTableVisibility();
  }

  return {
    hasVerifications,
    hasLegacyVerifications,
    info: response
  };
};

window.showVerificationModal = async function(sha256Hash, verificationId, appId, platform) {
  document.body.classList.add("modal-open");

  const verifications = response.verifications.get(sha256Hash);
  const verification  = verifications.find(a => a.id === verificationId);
  const otherVerificationsBySamePubkey = verifications.filter(a => (a.pubkey === verification.pubkey && a.id !== verification.id));

  const status = verification.tags.find(tag => tag[0] === 'status')?.[1] || '';

  const modal = document.getElementById('verificationModal');
  const content = document.getElementById('verificationContent');
  
  // Reset scroll positions before showing the modal again
  setTimeout(() => {
    content.scrollTop = 0;
    content.scrollLeft = 0;
  }, 0);

  modal.style.background = window.theme === 'dark' ? '#2d2d2df7' : '#e1e1e1f7';
  modal.style.color = window.theme === 'dark' ? 'white' : 'black';

  let otherVerificationsHTML = '';
  if (otherVerificationsBySamePubkey.length > 0) {
    for (const otherVerification of otherVerificationsBySamePubkey) {
      const verificationDate = new Date(otherVerification.created_at * 1000).toLocaleDateString(navigator.language, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const status = otherVerification.tags.find(tag => tag[0] === 'status')?.[1] || '';

      const statusIcon = status === 'reproducible' 
        ? '<span title="Reproducible" style="margin-left: 4px;">✅</span>' 
        : '<span title="Not Reproducible" style="margin-left: 4px;">❌</span>';

      otherVerificationsHTML += `<li>
        ${verificationDate} ${statusIcon}
      </li>`;
    }
    otherVerificationsHTML = `<ul class="attestation-other-attempts">${otherVerificationsHTML}</ul>`;
  }
  
  content.innerHTML = `
    <p><strong>Attempt by:</strong> <span id="attempt-by"></span></p>
    <p><strong>Created At:</strong> ${new Date(verification.created_at * 1000).toLocaleDateString(navigator.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}</p>
    <p><strong>Status: </strong> ${status} ${status === 'reproducible' ? '✅' : '❌'}</p>`;

  if (otherVerificationsHTML !== '') {
    content.innerHTML += `<p><strong>Other attempts by this user:</strong> ${otherVerificationsHTML}</p>`;
  }

  const itemContent = JSON.parse(verification.content).content;

  content.innerHTML += `
    <p><strong>Information:</strong>
      <div class="markdown-content">${DOMPurify.sanitize(marked.parse(itemContent))}</div>
    </p>
  `;

  // Play asciicast
  if (verification.content.includes('ascii_cast_player')) {
    // Inyect the asciinema player .js and .css
    const asciinemaPlayerJS = document.createElement('script');
    asciinemaPlayerJS.src = '/assets/js/asciinema-player.min.js';
    document.head.appendChild(asciinemaPlayerJS);

    const asciinemaPlayerCSS = document.createElement('link');
    asciinemaPlayerCSS.rel = 'stylesheet';
    asciinemaPlayerCSS.href = '/assets/css/asciinema-player.min.css';
    document.head.appendChild(asciinemaPlayerCSS);

    if (!platform) {    // Extract platform from the URL path
      const urlParts = window.location.pathname.split('/').filter(Boolean);
      if (urlParts.length > 0) {
        platform = urlParts[0];
      }
    }

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

  // Add blur to all divs except verificationModal
  document.querySelectorAll('.archive > div:not(#verificationModal), .archive > h1').forEach(div => {
    div.style.filter = 'blur(5px)';
  });

  const profile = await getNostrProfile(verification.pubkey);
  
  document.getElementById('attempt-by').innerHTML = profile ? `
    <div class="profile-card">
      ${profile.image ? `<img src="${profile.image}" class="profile-image" onclick="window.location.href='/verifier/?pubkey=${verification.pubkey}'" onerror="this.style.display='none'"/>` : ''}
      <div class="profile-info" onclick="window.location.href='/verifier/?pubkey=${verification.pubkey}'">
        <div>${profile.name || verification.pubkey}</div>
        ${profile.nip05 ? `<div class="profile-nip05">${profile.nip05}</div>` : ''}
      </div>
    </div>
  ` : verification.pubkey;

  document.getElementById('closeModal').onclick = function() {
    modal.style.display = 'none';
    window.removeEventListener('click', handleClick);
    window.removeEventListener('keydown', handleKeyDown);
    document.body.classList.remove("modal-open");
    // Remove blur from all divs
    document.querySelectorAll('.archive > div:not(#verificationModal), .archive > h1').forEach(div => {
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
      document.querySelectorAll('.archive > div:not(#verificationModal), .archive > h1').forEach(div => {
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
      document.querySelectorAll('.archive > div:not(#verificationModal), .archive > h1').forEach(div => {
        div.style.filter = '';
      });
    }
  };

  window.addEventListener('click', handleClick);
  window.addEventListener('keydown', handleKeyDown);
};