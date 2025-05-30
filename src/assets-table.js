import {marked} from 'marked';
import DOMPurify from 'dompurify';
import { assetRegistrationKind, verificationDraftKind, codeSnippetKind } from "./nostr-constants.mjs";

window.DOMPurify = DOMPurify;

let response = null;
let originalUrlBeforeModal = ''; // Store the URL before opening the modal

const table = document.createElement('table');

let attachments = [];
const attachmentDataStore = {};   // Define a store for attachment data globally accessible

// Filter table rows
async function updateTableVisibility() {
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

  const userPubkey = await getUserPubkey();

  // Search draft-attestation elements and hide them depending on the hideDrafts checkbox
  const hideDraftsChecked = document.getElementById('hideDrafts').checked;
  document.querySelectorAll('.draft-attestation').forEach(attestation => {
    if (hideDraftsChecked && !attestation.getAttribute('data-pubkey_verifiers')?.includes(userPubkey)) {
      attestation.style.display = 'none';
    } else {
      // attestation is a tr?
      attestation.style.display = attestation.tagName === 'TR' ? 'table-row' : 'block';
    }
  });
}

window.renderAssetsTable = async function({
                                            htmlElementId,
                                            pubkey,
                                            appId,
                                            sha256,
                                            hideConfig,
                                            showOnlyRows = 100,
                                            sortByVersion = false,
                                            enableSearch = false,
                                            enableDraftsFilter = false,
                                            enableAttachments = false,
                                            showProfilePictures = true
                                          }) {
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
    </div>`;

  // Append modal to body to ensure it's outside the main container's potential overflow issues
  if (!document.getElementById('blossomWarningModal')) {
    document.body.insertAdjacentHTML('beforeend', blossomModalHTML);
  }

  // Add attachment preview modal structure
  const attachmentPreviewModalHTML = `
    <div id="attachmentPreviewModal" style="display: none; position: fixed; z-index: 1001; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.6);">
      <div style="background-color: #fefefe; margin: 5% auto; padding: 20px; border: 1px solid #888; width: 95%; max-width: 1200px; text-align: center; border-radius: 8px; color: black; max-height: 80vh; overflow: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <h3 id="previewFileName" style="margin: 0;">File Preview</h3>
          <span id="previewCloseButton" style="color: #aaa; font-size: 28px; font-weight: bold; cursor: pointer;">&times;</span>
        </div>
        <div id="previewContent" style="text-align: left; overflow: auto; max-height: calc(80vh - 100px);"></div>
      </div>
    </div>`;

  // Append preview modal to body
  if (!document.getElementById('attachmentPreviewModal')) {
    document.body.insertAdjacentHTML('beforeend', attachmentPreviewModalHTML);
  }

  // Search and filter UI
  const searchContainer = document.createElement('div');
  searchContainer.className = 'assets-search-container';
  searchContainer.style.marginBottom = '20px';
  searchContainer.style.display = enableSearch || enableDraftsFilter ? 'block' : 'none';
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
        <span>Hide others' drafts</span>
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
  mergeIntoCombined(response.draftVerifications);
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

  if (enableAttachments && sortedItems.length > 0) {
    let attachmentEventIDs = [];
    sortedItems.forEach((item, index) => {
      const fileEventIds = getFileAttachmentIDsForVerificationEvent(item.items[0]);
      attachmentEventIDs.push(...fileEventIds);
    });

    attachments = await getFileAttachmentEvents(attachmentEventIDs);
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

  let profilePubkeys = [];

  if (sortedItems.length > 0) {
    sortedItems.forEach((item, index) => {
      if (showProfilePictures && !profilePubkeys.includes(item.items[0].pubkey)) {
        profilePubkeys.push(item.items[0].pubkey);
      }

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

      let verificationsList;
      if (attestations.length > 0) {
        hasVerifications = true;

        const latestVerificationsByUser = new Map();
        for (const attestation of attestations) {
          // Always include draft verifications
          if (attestation.kind === verificationDraftKind) {
            // Add the draft with a key that includes both the pubkey and the draft ID to ensure we keep all drafts
            latestVerificationsByUser.set(`${attestation.pubkey}-draft-${attestation.id}`, attestation);
          } else {
            // For regular attestations, only keep the most recent one per user
            const existingAttestation = latestVerificationsByUser.get(attestation.pubkey);
            if (!existingAttestation || (existingAttestation.kind !== verificationDraftKind &&
              attestation.created_at > existingAttestation.created_at)) {
              latestVerificationsByUser.set(attestation.pubkey, attestation);
            }
          }
        }

        let listItems = '';
        for (const attestation of latestVerificationsByUser.values()) {
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
          const draftBadge = isDraft ? `
            <span class="badge badge-warning">Draft</span> 
            <span
              class="edit-draft-icon" style="cursor: pointer; font-size: x-large;" title="Edit Draft"
              onclick="event.stopPropagation(); window.location.href=\'/new_verification/?draftVerificationEventId=${attestation.id}&action=edit\'"
            >✏️</span>`
            : '';

          statusText = (status === 'reproducible' ? '✅ ' : '❌ ') + '<span class="attestation-status">' + getStatusText(status, true) + '</span>';

          listItems += `<span
                            onclick='showVerificationModal("${sha256HashKey}", "${attestation.id}", "${identifier}", "${platform}")'
                            class="attestation-link ${isDraft ? 'draft-attestation' : ''}"
                            data-pubkey_verifiers="${attestation.pubkey}"
                            style="cursor: pointer; margin-bottom: 0; margin-top: 0; display: block;">
            <div style="font-size: 1.1em; line-height: 1.2; margin-bottom: 0.7em;">
              ${draftBadge}
              <span class="profile-${attestation.pubkey}"></span>
              ${statusText}
              <small style="display: block;">(${attestationDate})</small>
            </div>
          </span>`;
        }
        verificationsList = `${listItems}
        ${hideConfig?.buttons ? '' :
          `<div style="margin-top: 4px;"><a href="/new_verification/?appId=${identifier}&version=${version}&platform=${platform}" class="btn-tiny btn-success btn_outline" rel="noopener noreferrer">Create another verification</a></div>`}`;
      } else {
        verificationsList = `No verifications yet.
        ${hideConfig?.buttons ? '' :
          `<div style="margin-top: 4px;"><a href="/new_verification/?appId=${identifier}&version=${version}&platform=${platform}" class="btn-tiny btn-success btn_outline" rel="noopener noreferrer">Create verification</a></div>`}`;
      }

      const wallet = window.wallets.find(w => w.appId === identifier);
      const walletTitle = wallet ? wallet.title : identifier;

      const row = document.createElement('tr');
      row.className = index >= showOnlyRows ? 'hidden-row' : '';
      const sanitizedVersion = version.replace(/\./g, '-');
      row.setAttribute('id', `version-${sanitizedVersion}`);
      row.innerHTML = `
        ${hideConfig?.wallet ? '' : `<td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: normal; word-wrap: break-word;">
          ${wallet ? `<a href="${wallet.url}" rel="noopener noreferrer">${walletTitle}</a><br>${version}<span class="show-on-mobile"><br>${itemDescription}<br>${sha256Hashes.length > 0 ? sha256Hashes.map(hash => `
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
        <td>${verificationsList}</td>
        <td>${date}</td>`;
      table.appendChild(row);
    });

    if (sortedItems.length > showOnlyRows) {
      const showMoreRow = document.createElement('tr');
      showMoreRow.className = 'show-more-row';
      showMoreRow.id = 'show-more-row';
      showMoreRow.innerHTML = `
        <td colspan="8" style="text-align: center; padding: 15px;">
          <button id="show-more-link" onclick="showMoreRows()" style="cursor: pointer; background: none; border: none; color: #0066cc; text-decoration: underline; font-size: inherit; padding: 5px 10px;">Show ${sortedItems.length - showOnlyRows} more</button>
        </td>`;
      table.appendChild(showMoreRow);
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

  // ATTACHMENTS TABLE
  if (enableAttachments && attachments.size > 0) {
    attachments.forEach(attachment => {
      if (showProfilePictures && !profilePubkeys.includes(attachment.pubkey)) {
        profilePubkeys.push(attachment.pubkey);
      }
    });

    const paragraph = document.createElement('p');
    paragraph.innerHTML = 'Scripts used to reproduce the application:';
    document.getElementById(htmlElementId).appendChild(paragraph);

    const attachmentsTable = document.createElement('table');
    attachmentsTable.innerHTML = `
      <thead>
        <tr>
          <th>File</th>
          <th>Used to reproduce</th>
        </tr>
      </thead>
    `;

    attachments.forEach(attachment => {
      const date = new Date(attachment.created_at * 1000).toLocaleDateString(navigator.language, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      let name;
      if (attachment.kind === codeSnippetKind) {
        const attachmentName = attachment.tags.find(tag => tag[0] === 'name')?.[1] || '';
        const extension = attachment.tags.find(tag => tag[0] === 'extension')?.[1] || '';
        name = `${attachmentName}.${extension}`;
      } else {  // See https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/729
        name = attachment.tags.find(tag => tag[0] === 'filename')?.[1] || '';
      }
      const size = attachment.tags.find(tag => tag[0] === 'size')?.[1] || '';
      const sizeInKb = Math.round(size / 1024);

      // Find in sortedItems the specific verification items that use this attachment
      const verifications = sortedItems.flatMap(item =>
        item.items.filter(i =>
          i.tags.some(tag => tag[0] === 'file-attachment' && tag[1] === attachment.id)
        )
      );

      const row = document.createElement('tr');
      if (verifications.some(v => v.kind === verificationDraftKind)) {
        row.classList.add('draft-attestation');
      }

      // Decode and store attachment data
      const attachmentContent = atob(attachment.content);
      const attachmentContentType = attachment.tags.find(tag => tag[0] === 'content-type')?.[1] || 'application/octet-stream';

      attachmentDataStore[attachment.id] = {
        content: attachmentContent,
        type: attachmentContentType,
        filename: name,
        sizeInKb: sizeInKb
      };

      let rowHTML = `
        <td>${name} <small>(${sizeInKb} kB)</small> 
          <span id="${attachment.id}" style="cursor: pointer; margin-left: 6px;" onclick="handleAttachmentDownload('${attachment.id}')" title="Download ${name}">💾</span>
          <span id="preview-${attachment.id}" style="cursor: pointer; margin-left: 6px;" onclick="handleAttachmentPreview('${attachment.id}')" title="Preview ${name}">👁️</span><br>
          <small>Uploaded on ${date} by</small> <span style="margin-left: 4px;" class="profile-${attachment.pubkey}">${attachment.pubkey}</span>
        </td>

        <td>`;

      if (verifications.length > 0) {
        for (const verification of verifications) {
          const version = verification.tags.find(tag => tag[0] === 'version')?.[1] || '';
          const identifier = verification.tags.find(tag => tag[0] === 'i')?.[1] || "";
          const platform = verification.tags.find(tag => tag[0] === 'platform')?.[1] || "";

          const wallet = window.wallets.find(w => w.appId === identifier);
          const walletTitle = wallet ? wallet.title : identifier;

          rowHTML += `${walletTitle ?? identifier} <br><small>(${platform})</small> <br>${version}<br>`;
        }
      } else {
        rowHTML += '-';
      }

      rowHTML += `</td>`;

      row.innerHTML = rowHTML;

      attachmentsTable.appendChild(row);
    });

    document.getElementById(htmlElementId).appendChild(attachmentsTable);
  }

  // Iterate over the table rows and add a data-is-draft attribute to the rows where the "attestation-link" elements are also draft-attestation
  const rows = table.querySelectorAll('tr:not(:first-child):not(.show-more-row)');
  rows.forEach(row => {
    const verifications = Array.from(row.querySelectorAll('.attestation-link'));

    let pubkeyVerifications = [];
    verifications.forEach(verification => {
      const pubkey = verification.getAttribute('data-pubkey_verifiers');
      if (pubkey) {
        pubkeyVerifications.push(pubkey);
      }
    });

    if (verifications.every(verification => verification.classList.contains('draft-attestation'))) {
      row.classList.add('draft-attestation');
      if (pubkeyVerifications.length > 0) {
        row.dataset.pubkey_verifiers = pubkeyVerifications.join(', ');
      }
    }
  });

  updateTableVisibility();

  // Setup Intersection Observer for lazy loading Blossom checks
  const observedHashes = new Set();

  // --- Helper function for actual download with data in downloadIcon ---
  window.downloadBlossomFile = async (hash, filename) => {
    showToast('Preparing file to download, wait a moment...', 'info', 9000);
    try {
      // This makes the download process way slower, but it's
      // the only way to change to a different filename
      const response = await fetch(getBlossomFileURL(hash));
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

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

  // --- Helper function for actual download with data in downloadIcon ---
  const downloadBlossomFileWithDownloadIcon = async (hash, downloadIcon) => {
    showToast('Preparing file to download, wait a moment...', 'info', 9000);
    try {
      // This makes the download process way slower, but it's
      // the only way to change to a different filename
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
        const blossomDownloads = row.querySelectorAll('.blossom-download');

        for (const downloadIcon of blossomDownloads) {
          const hash = downloadIcon.id.replace('blossom-', '');

          // Skip if we've already checked this hash
          if (observedHashes.has(hash)) continue;
          observedHashes.add(hash);

          try {
            if (await checkFileExistsInBlossom(hash)) {
              downloadIcon.style.display = 'inline';
              downloadIcon.onclick = async () => {
                const modal = document.getElementById('blossomWarningModal');
                const confirmButton = document.getElementById('blossomConfirmDownloadButton');
                const closeButton = document.getElementById('blossomCloseModalButton');

                const downloadAction = () => {
                  downloadBlossomFileWithDownloadIcon(hash, downloadIcon);
                  modal.style.display = 'none';
                };

                // Remove previous listener to avoid duplicates if clicked multiple times
                confirmButton.replaceWith(confirmButton.cloneNode(true)); // Clone to remove listeners
                const newConfirmButton = document.getElementById('blossomConfirmDownloadButton');
                newConfirmButton.addEventListener('click', downloadAction);

                const closeModal = () => {
                  modal.style.display = 'none';
                };
                closeButton.onclick = closeModal;
                modal.onclick = (event) => { // Close if clicking outside the content
                  if (event.target === modal) {
                    closeModal();
                  }
                };

                modal.style.display = 'block'; // Show the modal
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

  if (showProfilePictures) {
    profilePubkeys.forEach(async pubkey => {
      try {
        const profile = await getNostrProfile(pubkey);
        if (!profile) {
          return;
        }
        const profileElementsForThisPubkey = document.querySelectorAll(`.profile-${pubkey}`);

        profileElementsForThisPubkey.forEach(profileElement => {
          profileElement.innerHTML = `
            <div class="profile-circle-container" data-name="${profile.name || pubkey}">
              ${profile.image ? `<img src="${profile.image}" class="profile-circle" onerror="this.style.display='none'"/>` : ''}
              <div class="profile-hover-modal">
                <div class="profile-modal-content">
                  ${profile.image ? `<img src="${profile.image}" class="profile-modal-image" onerror="this.style.display='none'"/>` : ''}
                  <br>
                  <span>${profile.name || pubkey}</span>
                  <button class="profile-page-btn" onclick="window.location.href='/verifier/?pubkey=${pubkey}'">Verifier Page</button>
                </div>
              </div>
            </div>
          `;
          
          // Add event listeners to each profile element to handle hover behavior
          const container = profileElement.querySelector('.profile-circle-container');
          const modal = container.querySelector('.profile-hover-modal');
          let timeout;
          
          container.addEventListener('mouseenter', () => {
            clearTimeout(timeout);
            modal.style.display = 'block';
          });
          
          container.addEventListener('mouseleave', (e) => {
            // Check if mouse is moving towards the modal
            const rect = modal.getBoundingClientRect();
            // Only start timeout if mouse is not moving toward the modal
            if (e.clientY >= rect.bottom || e.clientY <= rect.top || 
                e.clientX >= rect.right || e.clientX <= rect.left) {
              timeout = setTimeout(() => {
                if (!modal.matches(':hover')) {
                  modal.style.display = 'none';
                }
              }, 300); // 300ms delay gives time to move mouse to modal
            }
          });
          
          modal.addEventListener('mouseenter', () => {
            clearTimeout(timeout);
          });
          
          // Stop clicks from propagating through the modal
          modal.addEventListener('click', (e) => {
            e.stopPropagation();
          });
        });
      } catch (error) {
        console.error(`Error loading profile for ${pubkey}:`, error);
      }
    });

    const profileStyles = document.createElement('style');
    profileStyles.textContent = `
      .profile-circle-container {
        position: relative;
        display: inline-block;
      }
      
      .profile-circle {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        object-fit: cover;
        cursor: pointer;
        margin-right: 5px;
      }
      
      .profile-hover-modal {
        display: none;
        position: absolute;
        z-index: 1000;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        padding: 15px;
        min-width: 200px;
        left: 50%;
        transform: translateX(-50%);
        top: 30px;
        text-align: center;
        color: #333;
        pointer-events: auto; /* Ensure the modal captures all pointer events */
        cursor: default; /* Show arrow cursor instead of hand */
      }
      
      .profile-modal-content {
        pointer-events: none; /* Make the entire content non-clickable */
        cursor: default;
      }
      
      .profile-modal-content .profile-page-btn {
        pointer-events: auto; /* Re-enable pointer events only for the button */
        cursor: pointer;
      }
      
      .profile-modal-image {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
        margin-bottom: 10px;
      }
      
      .profile-page-btn {
        background-color: #4CAF50;
        color: white;
        border: none;
        padding: 8px 16px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 14px;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 10px;
      }
      
      .profile-hover-modal:before {
        content: '';
        position: absolute;
        top: -10px;
        left: 0;
        width: 100%;
        height: 10px;
      }
      
      /* Dark theme support */
      body.dark-theme .profile-hover-modal {
        background-color: #2d2d2d;
        color: white;
      }
    `;
    document.head.appendChild(profileStyles);
  }

  document.getElementById(htmlElementId).innerHTML += `
    <div id="diffoscopeModal" class="diffoscope-modal" style="display: none; z-index: 100000;">
      <div class="diffoscope-modal-content">
        <div class="diffoscope-controls">
            <span class="diffoscope-maximize" title="Maximize">⛶</span>
            <span class="diffoscope-close" title="Close">✖</span>
        </div>
        <iframe id="diffoscopeFrame"></iframe>
    </div>
  </div>`;

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

  window.currentVerification = verification;

  const status = verification.tags.find(tag => tag[0] === 'status')?.[1] || '';

  const modal = document.getElementById('verificationModal');
  modal.innerHTML = `
    <span id="closeModal">&times;</span>
    <div id="verificationContent"></div>`;

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
  content.innerHTML = isDraft ? `<p><span class="badge badge-big badge-warning">Draft</span> This is a draft verification. It is not published yet. <span class="edit-draft-icon" style="cursor: pointer; font-size: x-large;" onclick="event.stopPropagation(); window.location.href=\'/new_verification/?draftVerificationEventId=${verification.id}&action=edit\'" title="Edit Draft">✏️</span></p>` : '';

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

  const verificationAttachments = verification.tags.filter(tag => tag[0] === 'file-attachment');
  const verificationOutputFiles = verification.tags.filter(tag => tag[0] === 'output-file');

  // Show attachments (scripts used to reproduce)
  if (verificationAttachments.length > 0) {
    // Wait here until attachmentDataStore is filled
    while (Object.keys(attachmentDataStore).length === 0) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    let attachmentsHTML = '';

    for (const attachment of verificationAttachments) {
      const attachmentId = attachment[1];
      const attachmentInfo = attachmentDataStore[attachmentId];

      if (attachmentInfo) {
        attachmentsHTML += `<li>${attachmentInfo.filename} <small>(${attachmentInfo.sizeInKb} kB)</small>  
          <span id="${attachmentId}" style="cursor: pointer; margin-left: 10px;" onclick="handleAttachmentDownload('${attachmentId}')" title="Download ${attachmentInfo.filename}">💾</span>
          <span id="preview-${attachmentId}" style="cursor: pointer; margin-left: 10px;" onclick="handleAttachmentPreview('${attachmentId}')" title="Preview ${attachmentInfo.filename}">👁️</span></li>`;
      }
    }

    content.innerHTML += `<p><strong>Scripts used to reproduce:</strong></p><ul class="attestation-other-attempts">${attachmentsHTML}</ul>`;
  }

  let firstAsciicastFileSHA256 = null;
  let diffoscopeFiles = [];

  // Show output files
  if (verificationOutputFiles.length > 0) {
    let outputFilesHTML = '';
    for (const outputFile of verificationOutputFiles) {
      if (!firstAsciicastFileSHA256 && outputFile[1].includes('.cast')) {
        firstAsciicastFileSHA256 = outputFile[2];
      }
      if (outputFile[1].includes('diffo') && outputFile[1].includes('html')) {
        diffoscopeFiles.push(outputFile);
      }
      outputFilesHTML += `<li>${outputFile[1]}
        <span id="${outputFile[1]}" style="cursor: pointer; margin-left: 10px;" onclick="downloadBlossomFile('${outputFile[2]}', '${outputFile[1]}')" title="Download ${outputFile[1]}">💾</span></li>`;
    }

    content.innerHTML += `<p><strong>Output files:</strong></p><ul class="attestation-other-attempts">${outputFilesHTML}</ul>`;
  }

  if (otherVerificationsHTML !== '') {
    content.innerHTML += `<p><strong>Other attempts by this user:</strong> ${otherVerificationsHTML}</p>`;
  }

  let itemContent = JSON.parse(verification.content).content;

  // Diffoscope special treatment
  let diffoscopeHTML = '';
  if (diffoscopeFiles.length > 0) {
    diffoscopeHTML += `<div class="diffoscope-files" style="margin-top: 10px; margin-bottom: 20px; display: flex; flex-direction: column; gap: 10px; align-items: flex-start;">
                         <p>Diffoscope files attached (click to see report):</p>`;
    for (const file of diffoscopeFiles) {
      diffoscopeHTML += `<button class="btn btn-small btn-info" style="width: auto;" onclick="openDiffoscopeModal('${getBlossomFileURL(file[2])}')">${file[1]}</button>`;
    }
    diffoscopeHTML += '</div>';
  }

  // Adding AsciiCast html
  let asciicastHTML = '';
  if (firstAsciicastFileSHA256) {
    asciicastHTML = `<br><div id="ascii_cast_player" class="asciicast-player" style="margin-bottom: 20px;"></div>`;
  }

  content.innerHTML += `
  <p><strong>Information:</strong>
    <div class="markdown-content">
      ${diffoscopeHTML}
      ${asciicastHTML}
      ${marked.parse(itemContent)}
    </div>
  </p>`;

  // Asciicast special treatment (legacy asciicasts can only be played on old verifications)
  if (firstAsciicastFileSHA256 || (verification.content.includes('ascii_cast_player') && verification.created_at < 1746607369)) {
    let castURL;
    if (firstAsciicastFileSHA256) {
      castURL = getBlossomFileURL(firstAsciicastFileSHA256);
    } else {
      if (!platform) {    // Extract platform from the URL path
        const urlParts = window.location.pathname.split('/').filter(Boolean);
        if (urlParts.length > 0) {
          platform = urlParts[0];
        }
      }

      castURL = '/assets/casts/' + platform + '/' + appId + '.cast';
    }

    // Check if asciinema player assets are already loaded
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

    const initPlayer = () => {
      AsciinemaPlayer.create(
        castURL,
        document.getElementById('ascii_cast_player'),
        {
          idleTimeLimit: 1,
          autoPlay: true,
          rows: 25
        }
      );
    };

    if (!asciinemaJSExists && asciinemaPlayerJS) {
      asciinemaPlayerJS.onload = initPlayer;  // If we just added the script, wait for it to load
    } else {
      initPlayer();   // Script was already loaded, initialize player directly
    }
  }

  if (diffoscopeFiles.length > 0) {
    insertDiffoscopeAssets();
  }

  const verificationActions = document.createElement('div');
  verificationActions.id = 'verification-action-buttons';
  verificationActions.style.marginTop = '10px';
  verificationActions.innerHTML = `
      <img onclick="showVerificationButtons()" id="verification-nostr-icon" src="/images/nostr_logo.svg" alt="Nostr Logo" title="Show Nostr actions" />
      <button onclick="openEventInNjump('${verification.id}')" class="btn-small button-closed-by-default">Open in njump</button>
      <button onclick="copyNostrEmbedToClipboard('${verification.id}')" class="btn-small button-closed-by-default">Copy Nostr embed code</button>
      <button onclick="copyRawEventJsonToClipboard()" class="btn-small button-closed-by-default">Copy raw event</button>
      <button onclick="copyLinkToVerificationToClipboard()" class="btn-small"><i class="fas fa-share-alt"></i> Copy link to this verification</button>`;

  modal.appendChild(verificationActions);

  modal.style.display = 'block';

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
    window.currentVerification = null;
    window.removeEventListener('click', handleClick);
    window.removeEventListener('keydown', handleKeyDown);
    document.body.classList.remove("modal-open");
    // Remove blur from all divs
    document.querySelectorAll('.archive > div:not(#verificationModal), .archive > h1').forEach(div => {
      div.style.filter = '';
    });
    // Restore original URL (remove hash)
    history.pushState("", document.title, originalUrlBeforeModal);
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

function insertDiffoscopeAssets() {
  const diffoscopeCSSExists = document.querySelector('link[href="/assets/css/diffoscope-modal.css"]');
  const diffoscopeJSExists = document.querySelector('script[src="/assets/js/diffoscope-modal.js"]');

  // Only add CSS if not already present
  if (!diffoscopeCSSExists) {
    const diffoscopeCSS = document.createElement('link');
    diffoscopeCSS.rel = 'stylesheet';
    diffoscopeCSS.href = '/assets/css/diffoscope-modal.css';
    document.head.appendChild(diffoscopeCSS);
  }

  // Only add JS if not already present
  if (!diffoscopeJSExists) {
    const diffoscopeJS = document.createElement('script');
    diffoscopeJS.src = '/assets/js/diffoscope-modal.js';
    document.head.appendChild(diffoscopeJS);
  }
}

// Function to handle attachment download using stored data
window.handleAttachmentDownload = function(attachmentId) {
  const modal = document.getElementById('blossomWarningModal');
  const confirmButton = document.getElementById('blossomConfirmDownloadButton');
  const closeButton = document.getElementById('blossomCloseModalButton');

  const downloadAction = () => {
    const attachmentData = attachmentDataStore[attachmentId];

    if (!attachmentData || !attachmentData.content) {
      console.error('handleAttachmentDownload - Attachment data or content is missing for ID:', attachmentId);
      showToast('Error: Attachment data is missing.', 'error');
      return;
    }

    try {
      const blob = new Blob([attachmentData.content], { type: attachmentData.type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachmentData.filename;
      document.body.appendChild(a); // Append anchor to body
      a.click();
      document.body.removeChild(a); // Clean up anchor
      URL.revokeObjectURL(url); // Clean up blob URL
    } catch (error) {
      console.error('Error preparing download:', error);
      showToast('Error preparing download.', 'error');
    }

    modal.style.display = 'none';
  };

  // Remove previous listener to avoid duplicates if clicked multiple times
  confirmButton.replaceWith(confirmButton.cloneNode(true)); // Clone to remove listeners
  document.getElementById('blossomConfirmDownloadButton').addEventListener('click', downloadAction);

  const closeModal = () => {
    modal.style.display = 'none';
  };
  closeButton.onclick = closeModal;
  modal.onclick = (event) => { // Close if clicking outside the content
    if (event.target === modal) {
      closeModal();
    }
  };

  modal.style.display = 'block';
};

// Function to show verification buttons and hide Nostr icon
window.showVerificationButtons = function() {
  const buttonClosedByDefault = document.getElementById('verification-action-buttons').querySelectorAll('.button-closed-by-default');
  buttonClosedByDefault.forEach(button => {
    button.classList.remove('button-closed-by-default');
  });

  document.getElementById('verification-nostr-icon').style.display = 'none';
};

// Function to handle attachment preview
window.handleAttachmentPreview = function(attachmentId) {
  const attachmentData = attachmentDataStore[attachmentId];
  
  if (!attachmentData || !attachmentData.content) {
    console.error('handleAttachmentPreview - Attachment data or content is missing for ID:', attachmentId);
    showToast('Error: Attachment data is missing.', 'error');
    return;
  }

  // Get modal elements
  const modal = document.getElementById('attachmentPreviewModal');
  const previewContent = document.getElementById('previewContent');
  const previewFileName = document.getElementById('previewFileName');
  const closeButton = document.getElementById('previewCloseButton');
  
  // Set the filename
  previewFileName.textContent = attachmentData.filename;
  
  // Clear previous content
  previewContent.innerHTML = '';
  
  try {
    // Handle text content - simplified for all files
    const textContent = attachmentData.content;
    
    // Display content in a preformatted element
    previewContent.innerHTML = `<pre>${DOMPurify.sanitize(textContent)}</pre>`;
    
    // Set modal close action
    closeButton.onclick = function() {
      modal.style.display = 'none';
    };
    
    // Close modal when clicking outside
    modal.onclick = function(event) {
      if (event.target === modal) {
        closeButton.onclick();
      }
    };
    
    // Show the modal
    modal.style.display = 'block';
    
    // Reset scroll position to top
    previewContent.scrollTop = 0;
    previewContent.scrollLeft = 0;
    
    // Close on ESC key
    const handleKeyDown = function(event) {
      if (event.key === 'Escape') {
        closeButton.onclick();
        window.removeEventListener('keydown', handleKeyDown);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    
  } catch (error) {
    console.error('Error creating preview:', error);
    showToast('Error creating preview.', 'error');
  }
};
