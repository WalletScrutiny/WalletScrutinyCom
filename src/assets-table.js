import {marked} from 'marked';
import DOMPurify from 'dompurify';
import { assetRegistrationKind } from "./nostr-constants.mjs";

window.DOMPurify = DOMPurify;

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

function getStatusText(status, short = false) {
  switch (status) {
    case 'reproducible':
      return 'Reproducible when tested';
    case 'not_reproducible':
      return short ? 'Not reproducible' : 'Not reproducible from source provided, or differences are significant';
    case 'ftbfs':
      return short ? 'Failed to build from source' : 'Failed to build from source provided';
    case 'notag':
      return short ? 'Git revision not clear' : 'The git revision to compile is not clear';
    case 'nosource':
      return short ? 'Source not found' : 'Source for this version was not found or repository was taken down';
    case 'obfuscated':
      return short ? 'Source obfuscated' : 'Source code is obfuscated';
    case 'warning':
      return 'Warning';
    default:
      return status;
  }
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
              <span>Show only untested assets</span>
            </label>
          </div>
        </div>
      </div>
    `;

    document.getElementById(htmlElementId).appendChild(searchContainer);
  }

  let hasAssets = false;
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
    sortedItems.sort((a, b) => new Date(b.items[0].created_at) - new Date(a.items[0].created_at));
  }

  table.innerHTML = `
    <thead>
      <tr>
        ${hideConfig?.wallet ? '' : '<th style="max-width: 200px;">Wallet</th>'}
        ${hideConfig?.wallet ? '<th style="max-width: 200px;">Version</th>' : ''}
        <th class="hide-on-mobile" style="max-width: 300px;">Description</th>
        ${hideConfig?.sha256 ? '' : '<th class="hide-on-mobile">Hashes</th>'}
        <th class="hide-on-mobile">Download</th>
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
      const sha256Hashes = (binary.tags?.filter(tag => tag[0] === 'x') || []).slice(0, 6);

      const sha256HashKey = item.sha256;
      const version = binary.tags.find(tag => tag[0] === 'version')?.[1] || '';
      const oldInfoStatus = binary.tags.find(tag => tag[0] === 'status')?.[1] || '';
      const identifier = binary.tags.find(tag => tag[0] === 'i')?.[1] || "";
      const platform = binary.tags.find(tag => tag[0] === 'platform')?.[1] || "";

      // Guess if it's an asset or a verification
      const isAsset = binary.kind === assetRegistrationKind;
      const itemDescription = isAsset ? binary.content : JSON.parse(binary.content).description;

      if (isAsset) {
        hasAssets = true;
      }

      let longStatus = null;

      if (binary.isLegacy) {
        let openLinkTag = null;

        if (binary.gitRevision) {
          const firstPathToken = window.location.pathname.split('/').filter(Boolean)[0];
          openLinkTag = '<a target="_blank" rel="noopener noreferrer" href="https://gitlab.com/walletscrutiny/walletScrutinyCom/blob/' + binary.gitRevision + '/_' + firstPathToken + '/' + appId + '.md">';
          longStatus = '';
        }

        longStatus += (oldInfoStatus === 'reproducible' ? '✅ ' : '❌ ') + openLinkTag + getStatusText(oldInfoStatus, true) + (openLinkTag ? '</a>' : '');
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

          statusText = (status === 'reproducible' ? '✅ ' : '❌ ') + '<span class="attestation-status">' + getStatusText(status, true) + '</span>';

          listItems += `<span onclick='showVerificationModal("${sha256HashKey}", "${attestation.id}", "${identifier}", "${platform}")' class="attestation-link" style="cursor: pointer; margin-bottom: 0; margin-top: 0; display: block;">
            <div style="line-height: 1.2; margin-bottom: 0.7em;">
              ${statusText}
              <small style="display: block;">(${attestationDate})</small>
            </div>
          </span>`;
        }
        attestationList = `${listItems}
        ${hideConfig?.buttons ? '' :
          `<div style="margin-top: 4px;"><a href="/new_verification/?sha256=${sha256HashKey}&assetEventId=${eventId}&appId=${identifier}&version=${version}&platform=${platform}" class="btn-small btn-success" target="_blank" rel="noopener noreferrer">Create another verification</a></div>`}`;
      } else {
        attestationList = `No verifications yet.
        ${hideConfig?.buttons ? '' :
          `<div style="margin-top: 4px;"><a href="/new_verification/?sha256=${sha256HashKey}&assetEventId=${eventId}&appId=${identifier}&version=${version}&platform=${platform}" class="btn-small btn-success" target="_blank" rel="noopener noreferrer">Create verification</a></div>`}`;
      }

      const wallet = window.wallets.find(w => w.appId === identifier);
      const walletTitle = wallet ? wallet.title : identifier;

      const row = document.createElement('tr');
      row.className = index >= showOnlyRows ? 'hidden-row' : '';
      const sanitizedVersion = version.replace(/\./g, '-');
      row.setAttribute('id', `version-${sanitizedVersion}`);
      row.innerHTML = `
        ${hideConfig?.wallet ? '' : `<td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: normal; word-wrap: break-word;">
          ${wallet ? `<a href="${wallet.url}" target="_blank" rel="noopener noreferrer">${walletTitle}</a><br>${version}<span class="show-on-mobile"><br>${itemDescription}<br>${sha256Hashes.length > 0 ? sha256Hashes.map(hash => `
          <div style="margin-bottom: 4px;">
            <button onclick="navigator.clipboard.writeText('${hash[1]}').then(() => showToast('Hash copied to clipboard'))" class="copy-button" title="Copy hash to clipboard">📋</button><span class="hash-display" title="${hash[1]}">${hash[1]}</span>
          </div>`).join('') : '-'}</span>` : walletTitle}
          </td>`}
        ${hideConfig?.wallet ? `<td>
          ${version}<span class="show-on-mobile"><br>${itemDescription}<br>${sha256Hashes.length > 0 ? sha256Hashes.map(hash => `
          <div style="margin-bottom: 4px;">
            <button onclick="navigator.clipboard.writeText('${hash[1]}').then(() => showToast('Hash copied to clipboard'))" class="copy-button" title="Copy hash to clipboard">📋</button><span class="hash-display" title="${hash[1]}">${hash[1]}</span>
          </div>`).join('') : '-'}</span>
          </td>` : ''}
        <td class="asset-description hide-on-mobile" style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: normal; word-wrap: break-word;">${itemDescription}</td>
        ${hideConfig?.sha256 ? '' : `<td class="hide-on-mobile">
          ${sha256Hashes.length > 0 ? sha256Hashes.map(hash => `
          <div style="margin-bottom: 4px;">
            <span class="hash-display" title="${hash[1]}">${hash[1]}</span>
            <button onclick="navigator.clipboard.writeText('${hash[1]}').then(() => showToast('Hash copied to clipboard'))" class="copy-button" title="Copy hash to clipboard">📋</button>
          </div>`).join('') : '-'}
        </td>`}
        <td class="hide-on-mobile">
          ${sha256Hashes.length > 0 ? sha256Hashes.map(hash => `
            <span id="blossom-${hash[1]}" data-appid="${identifier}" data-title="${walletTitle}" data-version="${version}" class="blossom-download" style="display: none; cursor: pointer;" title="Download binary from our server">💾</span>
          `).join('') : '-'}
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

  // Setup Intersection Observer for lazy loading Blossom checks
  const observedHashes = new Set();

  const blossomObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(async entry => {
      if (entry.isIntersecting) {
        const row = entry.target;
        const hashElements = row.querySelectorAll('.blossom-download');

        for (const downloadIcon of hashElements) {
          const hash = downloadIcon.id.replace('blossom-', '');

          // Skip if we've already checked this hash
          if (observedHashes.has(hash)) continue;
          observedHashes.add(hash);

          try {
            const exists = await checkBlossomFile(hash);
            if (exists) {
              downloadIcon.style.display = 'inline';
              downloadIcon.onclick = async () => {
                showToast('Preparing file to download, wait a moment...', 'info', 6000);

                try {
                  const response = await fetch(getBlossomFileURL(hash));
                  if (!response.ok) throw new Error(`HTTP ${response.status}`);

                  const filenameFromURL = response.url?.split('/').pop() ?? hash;

                  let filename = '';
                  if (downloadIcon.getAttribute('data-title') && !downloadIcon.getAttribute('data-title').includes(' ')) {
                    filename = downloadIcon.getAttribute('data-title') + '-' + downloadIcon.getAttribute('data-version') + '-' + filenameFromURL;
                  } else {
                    filename = downloadIcon.getAttribute('data-appid') + '-' + downloadIcon.getAttribute('data-version') + '-' + filenameFromURL;
                  }

                  const a = document.createElement('a');
                  a.href = URL.createObjectURL(await response.blob());
                  a.download = filename;
                  a.click();
                } catch (error) {
                  showToast('Error downloading file.', 'error');
                }
              };
            }
          } catch (error) {
            console.error(`Error checking hash ${hash} in Blossom:`, error);
          }
        }
      }
    });
  }, {
    root: null, // Use the viewport
    rootMargin: '100px', // Start loading a bit before they become visible
    threshold: 0.1 // Trigger when at least 10% of the element is visible
  });

  // Observe all rows in the table
  const tableRows = table.querySelectorAll('tr:not(:first-child):not(.show-more-row)');
  tableRows.forEach(row => {
    blossomObserver.observe(row);
  });

  // Function to handle filtering and update observer
  function updateObserverForVisibleRows() {
    const visibleRows = Array.from(table.querySelectorAll('tr:not([style*="display: none"]):not(:first-child):not(.show-more-row)'));

    // Re-observe all visible rows to trigger checks for newly visible elements
    visibleRows.forEach(row => {
      blossomObserver.observe(row);
    });
  }

  // Hook into the existing updateTableVisibility function to update observer when filtering
  const originalUpdateTableVisibility = updateTableVisibility;
  updateTableVisibility = function() {
    originalUpdateTableVisibility();
    updateObserverForVisibleRows();
  };

  // Initial check for visible rows
  updateObserverForVisibleRows();

  return {
    hasAssets,
    hasVerifications,
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

      const statusIcon = '<span title="' + getStatusText(status) + '" style="margin-left: 4px;">' + (status === 'reproducible' ? '✅' : '❌') + '</span>';

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
    <p><strong>Status: </strong> ${status === 'reproducible' ? '✅' : '❌'} ${getStatusText(status)} </p>`;

  if (otherVerificationsHTML !== '') {
    content.innerHTML += `<p><strong>Other attempts by this user:</strong> ${otherVerificationsHTML}</p>`;
  }

  const itemContent = JSON.parse(verification.content).content;

  content.innerHTML += `
    <p><strong>Information:</strong>
      <div class="markdown-content">${DOMPurify.sanitize(marked.parse(itemContent), purifyConfig)}</div>
    </p>
  `;

  // Play asciicast
  if (verification.content.includes('ascii_cast_player')) {
    // Check if asciinema player scripts are already loaded
    const asciinemaJSExists = document.querySelector('script[src="/assets/js/asciinema-player.min.js"]');
    const ascinemaCSSExists = document.querySelector('link[href="/assets/css/asciinema-player.min.css"]');

    // Only add JS if not already present
    let asciinemaPlayerJS;
    if (!asciinemaJSExists) {
      asciinemaPlayerJS = document.createElement('script');
      asciinemaPlayerJS.src = '/assets/js/asciinema-player.min.js';
      document.head.appendChild(asciinemaPlayerJS);
    }

    // Only add CSS if not already present
    if (!ascinemaCSSExists) {
      const asciinemaPlayerCSS = document.createElement('link');
      asciinemaPlayerCSS.rel = 'stylesheet';
      asciinemaPlayerCSS.href = '/assets/css/asciinema-player.min.css';
      document.head.appendChild(asciinemaPlayerCSS);
    }

    if (!platform) {    // Extract platform from the URL path
      const urlParts = window.location.pathname.split('/').filter(Boolean);
      if (urlParts.length > 0) {
        platform = urlParts[0];
      }
    }

    // Function to initialize the player
    const initPlayer = () => {
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

    // If we just added the script, wait for it to load
    if (!asciinemaJSExists && asciinemaPlayerJS) {
      asciinemaPlayerJS.onload = initPlayer;
    } else {
      // Script was already loaded, initialize player directly
      initPlayer();
    }
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
