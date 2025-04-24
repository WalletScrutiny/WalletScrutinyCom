import {marked} from 'marked';
import DOMPurify from 'dompurify';
import { assetRegistrationKind, verificationDraftKind } from "./nostr-constants.mjs";

window.DOMPurify = DOMPurify;

let response = null;
let originalUrlBeforeModal = ''; // Store the URL before opening the modal

const table = document.createElement('table');

// Filter table rows
function updateTableVisibility() {
  const searchTerm = document.getElementById('assetSearchInput').value.toLowerCase();
  const showLatestOnly = document.getElementById('showLatestVersionOnly').checked;
  const showOnlyNoVerifications = document.getElementById('showOnlyNoVerifications').checked;
  const hideDrafts = document.getElementById('hideDrafts').checked;

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


  // Search draft-attestation elements and hide them depending on the hideDrafts checkbox
  const hideDraftsChecked = document.getElementById('hideDrafts').checked;
  document.querySelectorAll('.draft-attestation').forEach(attestation => {
    if (hideDraftsChecked) {
      attestation.style.display = 'none';
    } else {
      // attestation is a tr?
      const isATr = attestation.tagName === 'TR';
      attestation.style.display = isATr ? 'table-row' : 'block';
    }
  });
}

window.renderAssetsTable = async function({htmlElementId, pubkey, appId, sha256, hideConfig, showOnlyRows = 100, sortByVersion = false, enableSearch = false, enableDraftsFilter = false}) {
  let hasAssets = false;

  response = await getAllAssetInformation({
    pubkey,
    appId,
    sha256
  });

  // --- Add Blossom Download Warning Modal Structure ---
  const blossomModalHTML = `
    <div id="blossomWarningModal" style="display: none; position: fixed; z-index: 1001; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.6);">
      <div style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 80%; max-width: 400px; text-align: center; border-radius: 8px; color: black;">
        <span id="blossomCloseModalButton" style="color: #aaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer;">&times;</span>
        <p style="margin-top: 30px; margin-bottom: 20px;">⚠️ This file was uploaded by a third party. We haven't verified its content, so please be careful before running it. ⚠️</p>
        <button id="blossomConfirmDownloadButton" class="btn btn-success" style="padding: 10px 20px;">Download</button>
      </div>
    </div>
  `;
  // Append modal to body to ensure it's outside the main container's potential overflow issues
  if (!document.getElementById('blossomWarningModal')) {
    document.body.insertAdjacentHTML('beforeend', blossomModalHTML);
  }

  // Search and filter UI
  if (enableSearch || enableDraftsFilter) {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'assets-search-container';
    searchContainer.style.marginBottom = '20px';
    searchContainer.innerHTML = `
      <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
        <input 
          type="text" 
          id="assetSearchInput" 
          placeholder="Search by wallet name or hash..." 
          style="padding: 8px; border-radius: 4px; border: 1px solid #ccc; flex: 1; min-width: 200px; display: ${enableSearch ? 'block' : 'none'};"
        >
        <div style="display: flex; gap: 15px; align-items: flex-start; flex-wrap: wrap; display: ${enableSearch ? 'flex' : 'none'};">
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
              <input type="checkbox" id="showLatestVersionOnly" ${enableSearch ? 'checked' : ''}>
              <span>Show latest version only</span>
            </label>
            <label style="display: flex; align-items: center; gap: 5px; white-space: nowrap;">
              <input type="checkbox" id="showOnlyNoVerifications">
              <span>Show only untested assets</span>
            </label>
          </div>
        </div>
        <label style="display: ${enableDraftsFilter ? 'flex' : 'none'}; align-items: center; gap: 5px; white-space: nowrap;">
          <input type="checkbox" id="hideDrafts" ${enableDraftsFilter ? 'checked' : ''}>
          <span>Hide drafts</span>
        </label>
      </div>`;

    document.getElementById(htmlElementId).appendChild(searchContainer);

    // Add event listeners for search and filters only if enableSearch is true
    if (enableSearch) {
      document.getElementById('assetSearchInput').addEventListener('input', updateTableVisibility);
      document.getElementById('showLatestVersionOnly').addEventListener('change', updateTableVisibility);
      document.getElementById('showOnlyNoVerifications').addEventListener('change', updateTableVisibility);
    }
    if (enableDraftsFilter) {
      document.getElementById('hideDrafts').addEventListener('change', updateTableVisibility);
    }
  }

  let hasVerifications = false;

  let combinedItems = new Map();

  function mergeIntoCombined(sourceMap) {
    for (const [key, value] of sourceMap.entries()) {
      const existing = combinedItems.get(key) || [];
      // Assuming 'value' is always an array based on the subsequent sorting logic
      combinedItems.set(key, existing.concat(value));
    }
  }

  mergeIntoCombined(response.verifications);
  if (enableDraftsFilter) {
    mergeIntoCombined(response.draftVerifications);
  }
  mergeIntoCombined(response.assets);

  // Helper function to find verification by ID across all SHA256 hashes
  const findVerificationById = (idToFind) => {
    const allMaps = [response.verifications, response.draftVerifications];
    for (const map of allMaps) {
      if (map) { // Check if the map exists (drafts might not)
        for (const [sha256, attestations] of map.entries()) {
          const found = attestations.find(att => att.id === idToFind);
          if (found) {
            return { verification: found, sha256Hash: sha256 };
          }
        }
      }
    }
    return null;
  };

  // Check URL hash for verification details after fetching data
  if (location.hash.startsWith('#verificationId=')) {
    const params = new URLSearchParams(location.hash.substring(1));
    const verificationId = params.get('verificationId');

    if (verificationId) {
        const result = findVerificationById(verificationId);

        if (result) {
            const { verification, sha256Hash } = result;
            // Extract appId and platform from the found verification's tags
            const appIdFromVerification = verification.tags.find(tag => tag[0] === 'i')?.[1] || "";
            const platformFromVerification = verification.tags.find(tag => tag[0] === 'platform')?.[1] || "";

            // Call showVerificationModal after a short delay
            setTimeout(() => {
                window.showVerificationModal(sha256Hash, verificationId, appIdFromVerification, platformFromVerification);
            }, 100);
        } else {
           // Clear the hash if the verification ID is invalid/not found
           console.warn('Verification ID from URL hash not found:', verificationId);
           history.pushState("", document.title, window.location.pathname + window.location.search);
        }
    } else {
        // Clear incomplete hash
        history.pushState("", document.title, window.location.pathname + window.location.search);
    }
  }

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
        <th class="hide-on-mobile">Binary</th>
        <th>Verifications</th>
        <th>Seen</th>
      </tr>
    </thead>`;

  if (sortedItems.length > 0) {
    sortedItems.forEach((item, index) => {
      // Handle both legacy and new format
      const binary = item.items ? item.items[0] : item;

      const date = new Date(binary.created_at * 1000).toLocaleDateString(navigator.language,
        {
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
      const identifier = binary.tags.find(tag => tag[0] === 'i')?.[1] || "";
      const platform = binary.tags.find(tag => tag[0] === 'platform')?.[1] || "";

      // Guess if it's an asset or a verification
      hasAssets = binary.kind === assetRegistrationKind;
      const itemDescription = hasAssets ? binary.content : JSON.parse(binary.content).description;

      const standardAttestations = response.verifications.get(binary.tags.find(tag => tag[0] === 'x')?.[1]) || [];
      const draftAttestations = response.draftVerifications.get(binary.tags.find(tag => tag[0] === 'x')?.[1]) || [];
      const attestations = [...standardAttestations, ...draftAttestations];

      let attestationList;
      if (attestations.length > 0) {
        hasVerifications = true;

        const latestAttestationsByUser = new Map();
        for (const attestation of attestations) {
          // Always include draft verifications
          if (attestation.kind === verificationDraftKind) {
            // Add the draft with a key that includes both the pubkey and the draft ID to ensure we keep all drafts
            latestAttestationsByUser.set(`${attestation.pubkey}-draft-${attestation.id}`, attestation);
          } else {
            // For regular attestations, only keep the most recent one per user
            const existingAttestation = latestAttestationsByUser.get(attestation.pubkey);
            if (!existingAttestation || (existingAttestation.kind !== verificationDraftKind && 
                attestation.created_at > existingAttestation.created_at)) {
              latestAttestationsByUser.set(attestation.pubkey, attestation);
            }
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

          const isDraft = attestation.kind === verificationDraftKind;
          const draftBadge = isDraft ? '<span class="badge badge-warning">Draft</span>' : '';

          statusText = (status === 'reproducible' ? '✅ ' : '❌ ') + '<span class="attestation-status">' + getStatusText(status, true) + '</span>';

          listItems += `<span
                            onclick='showVerificationModal("${sha256HashKey}", "${attestation.id}", "${identifier}", "${platform}")'
                            class="attestation-link ${isDraft ? 'draft-attestation' : ''}"
                            style="cursor: pointer; margin-bottom: 0; margin-top: 0; display: block;">
            <div style="line-height: 1.2; margin-bottom: 0.7em;">
              ${draftBadge}
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
            <span id="blossom-${hash[1]}" data-appid="${identifier}" data-title="${walletTitle}" data-version="${version}" class="blossom-download" style="display: none; cursor: pointer;" title="Download from Blossom">💾</span>
          `).join('') : '-'}
        </td>
        <td>${attestationList}</td>
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

  // Iterate over the table rows and add a data-is-draft attribute to the rows where the "attestation-link" elements are also draft-attestation
  const rows = table.querySelectorAll('tr:not(:first-child):not(.show-more-row)');
  rows.forEach(row => {
    const attestations = Array.from(row.querySelectorAll('.attestation-link'));
    if (attestations.every(attestation => attestation.classList.contains('draft-attestation'))) {
      row.classList.add('draft-attestation');
    }
  });

  // Apply initial filter only if enableSearch is true
  if (enableSearch || enableDraftsFilter) {
    updateTableVisibility();
  }

  // Setup Intersection Observer for lazy loading Blossom checks
  const observedHashes = new Set();

  // --- Helper function for actual download ---
  const downloadBlossomFile = async (hash, downloadIcon) => {
    showToast('Preparing file to download, wait a moment...', 'info', 9000);
    console.log('downloading');
    try {
      const response = await fetch(getBlossomFileURL(hash));
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const filenameFromURL = response.url?.split('/').pop() ?? hash;

      let filename = '';
      const title = downloadIcon.getAttribute('data-title');
      const version = downloadIcon.getAttribute('data-version');
      const appid = downloadIcon.getAttribute('data-appid');

      if (title && !title.includes(' ')) {
        filename = `${title}-${version}-${filenameFromURL}`;
      } else {
        filename = `${appid}-${version}-${filenameFromURL}`;
      }

      const a = document.createElement('a');
      a.href = URL.createObjectURL(await response.blob());
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href); // Clean up blob URL
    } catch (error) {
      console.error('Error downloading file:', error);
      showToast(`Error downloading file: ${error.message || 'Unknown error'}`, 'error');
    }
  };
  // --- End helper function ---

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
              // --- Modify onclick to show modal ---
              downloadIcon.onclick = async () => {
                const modal = document.getElementById('blossomWarningModal');
                const confirmButton = document.getElementById('blossomConfirmDownloadButton');
                const closeButton = document.getElementById('blossomCloseModalButton');

                // Define the download action
                const downloadAction = () => {
                    downloadBlossomFile(hash, downloadIcon);
                    modal.style.display = 'none';
                };

                // Remove previous listener to avoid duplicates if clicked multiple times
                confirmButton.replaceWith(confirmButton.cloneNode(true)); // Clone to remove listeners
                document.getElementById('blossomConfirmDownloadButton').addEventListener('click', downloadAction);


                // Close modal listeners
                const closeModal = () => {
                  modal.style.display = 'none';
                  // Make sure to remove the specific listener for the confirm button when closing
                  // This is handled by replaceWith above, but good practice if not cloning
                };
                closeButton.onclick = closeModal;
                modal.onclick = (event) => { // Close if clicking outside the content
                  if (event.target === modal) {
                    closeModal();
                  }
                };

                modal.style.display = 'block'; // Show the modal
              };
              // --- End modification ---
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

  const verifications = response.verifications.get(sha256Hash) || [];
  const draftVerifications = response.draftVerifications.get(sha256Hash) || [];
  const attestations = [...verifications, ...draftVerifications];
  const verification  = attestations.find(a => a.id === verificationId);
  const otherVerificationsBySamePubkey = attestations.filter(a => (a.pubkey === verification.pubkey && a.id !== verification.id));

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

  const isDraft = verification.kind === verificationDraftKind;
  content.innerHTML = isDraft ? `<p><span class="badge badge-big badge-warning">Draft</span> This is a draft verification. It is not published yet.</p>` : '';

  content.innerHTML += `
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
      <div class="markdown-content">${marked.parse(itemContent)}</div>
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

  // Add share button dynamically
  const shareButton = document.createElement('button');
  shareButton.id = 'shareVerificationButton';
  // Use innerHTML to include the Font Awesome icon and text
  shareButton.innerHTML = '<i class="fas fa-share-alt"></i> Copy link to this verification';
  shareButton.title = 'Copy link to this verification';
  shareButton.style.position = 'absolute';
  shareButton.style.top = '15px';
  shareButton.style.right = '50px'; // Adjust right positioning to not overlap close button
  shareButton.className = 'btn-small'; // Optional: Use existing styles
  shareButton.onclick = () => {
      navigator.clipboard.writeText(window.location.href)
          .then(() => showToast('Link copied to clipboard'))
          .catch(err => {
              console.error('Failed to copy link: ', err);
              showToast('Failed to copy link', 'error');
          });
  };
  modal.appendChild(shareButton);

  // Add blur to all divs except verificationModal
  document.querySelectorAll('.archive > div:not(#verificationModal), .archive > h1').forEach(div => {
    div.style.filter = 'blur(5px)';
  });

  // Store original URL before changing hash
  originalUrlBeforeModal = window.location.pathname + window.location.search;

  // Update hash only if not already set by initial load check
  const currentHash = `#verificationId=${verificationId}`;
  if (window.location.hash !== currentHash) {
      location.hash = currentHash;
  }

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

  const closeModalAction = () => {
    modal.style.display = 'none';
    window.removeEventListener('click', handleClick);
    window.removeEventListener('keydown', handleKeyDown);
    document.body.classList.remove("modal-open");
    // Remove blur from all divs
    document.querySelectorAll('.archive > div:not(#verificationModal), .archive > h1').forEach(div => {
      div.style.filter = '';
    });
    // Restore original URL (remove hash)
    history.pushState("", document.title, originalUrlBeforeModal);
    // Remove the dynamically added share button
    const shareBtn = document.getElementById('shareVerificationButton');
    if (shareBtn) {
        shareBtn.remove();
    }
  };

  document.getElementById('closeModal').onclick = closeModalAction;

  const handleClick = function(event) {
    // Close only if click is outside the modal content area
    if (!content.contains(event.target) && event.target !== content && event.target.id !== 'closeModal' && !event.target.closest('.attestation-link')) {
       // Check if the click target is outside the modal boundaries entirely
        const modalRect = modal.getBoundingClientRect();
        if (event.clientX < modalRect.left || event.clientX > modalRect.right || event.clientY < modalRect.top || event.clientY > modalRect.bottom) {
            closeModalAction();
        }
    }
  };

  const handleKeyDown = function(event) {
    if (event.key === 'Escape') {
      closeModalAction();
    }
  };

  window.addEventListener('click', handleClick);
  window.addEventListener('keydown', handleKeyDown);
};
