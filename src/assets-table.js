import {marked} from 'marked';
import DOMPurify from 'dompurify';
import { assetBundleRegistrationKind, verificationKind, verificationDraftKind, isWalletScrutinySiteAdmin } from "./nostr-constants.mjs";
import {
  assetRegistrationKinds,
  getAssetFileEntries,
  pickScriptBinaryEntry,
  getAssetBundleDedupKey,
} from "./asset-utils.mjs";
import { formatDate, formatZapAmount, getAttachmentInfo, getStatusIcon, getStatusText, showIssueTrackerHtmlWidget } from "./assets-table-utils.js";
import { getFirstTagValue } from "./verifications_common.mjs";
import { renderCommentsSection } from './assets-table-comments.js';
import { showZapModal } from './zapModal.js';

let response = null;
let originalUrlBeforeModal = ''; // Store the URL before opening the modal

let attachments = [];
let endorsements = [];
const attachmentDataStore = {};   // Define a store for attachment data globally accessible (from the global table and from each verification)

const getHashTags = event => {
  const entries = getAssetFileEntries(event);
  return entries.map(entry => ['x', entry.hash, entry.fileName]);
};
const getVerificationLookupHash = event => {
  if (event.kind === assetBundleRegistrationKind) {
    return null;
  }
  const legacyX = event.tags?.filter(tag => tag[0] === 'x') || [];
  return legacyX[1]?.[1] || legacyX[0]?.[1] || null;
};
const isAssetRegistrationEvent = event => assetRegistrationKinds.includes(event.kind);
const findBundleAssetInGroup = group =>
  group.items.find(item => item.kind === assetBundleRegistrationKind);

/** Item that defines bundle hash set for row merging (kind 9401 asset or multi-hash event). */
const findMultiFileItemInGroup = group =>
  findBundleAssetInGroup(group) ||
  group.items.find(item => getAssetFileEntries(item).length > 1);

function getRowMergeKey(group) {
  const multiFileItem = findMultiFileItemInGroup(group);
  return multiFileItem ? getAssetBundleDedupKey(multiFileItem) : null;
}

function mergeGroupItems(target, source) {
  const seen = new Set(target.items.map(item => item.id));
  for (const item of source.items) {
    if (!seen.has(item.id)) {
      target.items.push(item);
      seen.add(item.id);
    }
  }
  target.items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function pickCanonicalRowSha256(group, multiFileItem, requestedSha256) {
  const bundleHashes = getAssetFileEntries(multiFileItem).map(entry => entry.hash);
  if (requestedSha256 && bundleHashes.includes(requestedSha256)) {
    return requestedSha256;
  }
  return group.sha256;
}

/** One table row per multi-file asset or multi-hash verification, not one per indexed hash. */
function mergeBundleAssetRows(groups, requestedSha256) {
  const mergedBundles = new Map();
  const legacyGroups = [];

  for (const group of groups) {
    const mergeKey = getRowMergeKey(group);
    if (!mergeKey) {
      legacyGroups.push(group);
      continue;
    }

    const multiFileItem = findMultiFileItemInGroup(group);
    const existing = mergedBundles.get(mergeKey);
    if (existing) {
      mergeGroupItems(existing, group);
      existing.sha256 = pickCanonicalRowSha256(existing, multiFileItem, requestedSha256);
    } else {
      mergedBundles.set(mergeKey, {
        sha256: pickCanonicalRowSha256(group, multiFileItem, requestedSha256),
        items: [...group.items],
      });
    }
  }

  return [...mergedBundles.values(), ...legacyGroups];
}

const getPrimaryFileName = event => {
  const primaryFileTag = event.tags?.find(tag => tag[0] === 'file');
  if (primaryFileTag?.[1]) {
    return primaryFileTag[1];
  }
  return getFirstTagValue(event, 'file-name');
};

function fingerprintAllAssetInformation(info) {
  if (!info?.assets || !info.verifications || !info.draftVerifications) {
    return '';
  }
  const encodeMap = (map, prefix) => {
    const pairs = [...map.entries()].sort((a, b) => String(a[0]).localeCompare(String(b[0])));
    return prefix + pairs.map(([k, arr]) => {
      const ids = (arr || []).map(e => e.id).sort().join(',');
      return `${k}=${ids}`;
    }).join(';');
  };
  return [
    encodeMap(info.assets, 'a:'),
    encodeMap(info.verifications, 'v:'),
    encodeMap(info.draftVerifications, 'd:'),
    String(info.oldestEventTimestamp ?? '')
  ].join('|');
}

// Filter table rows (core logic; use updateTableVisibility for filter + optional blossom hook)
async function updateTableVisibilityCore() {
  const searchTerm = document.getElementById('assetSearchInput').value.toLowerCase();
  const showLatestOnly = document.getElementById('showLatestVersionOnly').checked;
  const showOnlyNoVerifications = document.getElementById('showOnlyNoVerifications').checked;

  // Create a map to track latest versions when filter is active
  const latestVersions = new Map();

  // Get all rows except header and show-more
  const assetsTableElement = document.getElementById('assetsTable');
  if (!assetsTableElement) {
    return;
  }

  // Find Verifications cell index by looking at the header text
  const headerCells = Array.from(assetsTableElement.querySelectorAll('th'));
  const verificationsIndex = headerCells.findIndex(cell => cell.textContent.trim() === 'Verifications');
  
  const rows = Array.from(assetsTableElement.querySelectorAll('tr:not(:first-child):not(.show-more-row)'));

  rows.forEach(row => {
    // Don't reset initially-hidden rows to visible
    if (!row.classList.contains('initially-hidden')) {
      row.style.setProperty('display', 'table-row');
    }
  });

  rows.forEach(row => {
    const walletName = row.querySelector('td:first-child')?.textContent.toLowerCase() || '';
    // Get the full SHA256 hash from the button's onclick attribute
    const sha256Button = row.querySelector('button[onclick*="navigator.clipboard.writeText"]');
    const sha256Hash = sha256Button ? sha256Button.getAttribute('onclick').match(/'([a-fA-F0-9]{64})'/)?.[ 1 ]?.toLowerCase() || '' : '';

    const verificationsCell = row.cells[verificationsIndex]?.textContent || '';
    const hasVerifications = !verificationsCell.includes('No verifications yet');

    // Get identifier for grouping latest versions
    const identifier = row.querySelector('td:first-child a')?.textContent || row.querySelector('td:first-child')?.textContent;

    let shouldShow = row.style.display !== 'none';

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

    row.style.setProperty('display', shouldShow ? 'table-row' : 'none');
  });

  const userPubkey = await getUserPubkey();

  // Search draft-attestation elements and hide them depending on the hideDrafts checkbox
  const hideDraftsChecked = document.getElementById('hideDrafts').checked;
  document.querySelectorAll('.draft-attestation').forEach(attestation => {
    let draftManagementEnabled = true;

    // If it's a TR and it's already hidden, drafts management cannot show it again
    if (attestation.tagName === 'TR' && attestation.style.display === 'none') {
      draftManagementEnabled = false;
    }

    if (draftManagementEnabled) {
      if (hideDraftsChecked && !attestation.getAttribute('data-pubkey_verifiers')?.includes(userPubkey)) {
        attestation.style.display = 'none';
      } else {
        attestation.style.display = attestation.tagName === 'TR' ? 'table-row' : 'block';
      }
    }
  });
}

let assetsTableBlossomFilterHook = null;
let assetsTableBlossomObserver = null;

async function updateTableVisibility() {
  await updateTableVisibilityCore();
  if (typeof assetsTableBlossomFilterHook === 'function') {
    assetsTableBlossomFilterHook();
  }
}

window.renderAssetsTable = async function({
                                            htmlElementId,
                                            pubkey,
                                            appId,
                                            appPlatform,
                                            sha256,
                                            hideConfig,
                                            showOnlyRows = 100,
                                            sortByVersion = false,
                                            enableSearch = false,
                                            enableDraftsFilter = false,
                                            enableAppPageSearch = false,
                                            showAttachmentsTable = false,
                                            showProfilePictures = true,
                                            showIssueTracker = false,
                                            showOnlyRegisteredAssets = false,
                                            tableLoadedCallback = null,
                                            getDrafts = true,
                                            months
                                          }) {
  let hasAssets = false;
  let cachePaintFingerprint = null;
  let cachePaintResult = null;

  try {
    window.userPubkey = await getUserPubkey();
  } catch (e) {
    console.error("Error getting user pubkey:", e);
    window.userPubkey = null;
  }

  if (!document.getElementById('verificationModal')) {
    const verificationModalDiv = document.createElement('div');
    verificationModalDiv.id = 'verificationModal';
    document.body.appendChild(verificationModalDiv);
  }
  if (!document.getElementById('verificationModalBackdrop')) {
    const verificationModalBackdropDiv = document.createElement('div');
    verificationModalBackdropDiv.id = 'verificationModalBackdrop';
    document.body.appendChild(verificationModalBackdropDiv);
  }

  document.getElementById('verificationModal').innerHTML = `
    <span id="closeModal">&times;</span>
    <div id="verificationContent"></div>`;

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

  const blossomBundleModalHTML = `
    <div id="blossomBundleModal" style="display: none; position: fixed; z-index: 1002; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.6);">
      <div style="background-color: #fefefe; margin: 10% auto; padding: 20px; border: 1px solid #888; width: 90%; max-width: 520px; border-radius: 8px; color: black;">
        <span id="blossomBundleCloseButton" style="color: #aaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer;">&times;</span>
        <h3 style="margin-top: 0;">Download asset files</h3>
        <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 1em; padding: 12px; background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 4px; text-align: left;">
          <i class="fas fa-exclamation-triangle" style="color: #856404; font-size: 1.5em; flex-shrink: 0; margin-top: 2px;" aria-hidden="true"></i>
          <p style="margin: 0; font-size: 0.95em;">These files were uploaded by third parties. Review before running.</p>
        </div>
        <ul id="blossomBundleFileList" style="list-style: none; padding: 0; text-align: left;"></ul>
      </div>
    </div>`;

  if (!document.getElementById('blossomBundleModal')) {
    document.body.insertAdjacentHTML('beforeend', blossomBundleModalHTML);
  }

  const openBlossomBundleDownloadModal = (files, context) => {
    const modal = document.getElementById('blossomBundleModal');
    const list = document.getElementById('blossomBundleFileList');
    const closeButton = document.getElementById('blossomBundleCloseButton');
    list.innerHTML = '';

    for (const file of files) {
      const li = document.createElement('li');
      li.style.marginBottom = '10px';
      const label = file.fileName || file.hash;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-success btn-small';
      btn.textContent = `Download ${label}`;
      btn.addEventListener('click', () => {
        let filename = file.fileName;
        if (!filename && context) {
          filename = `${context.appid}-${context.version}-${file.hash}`;
          if (context.platform === 'android') {
            filename += '.apk';
          }
        }
        downloadFileWithFilename(file.hash, filename);
      });
      li.appendChild(btn);
      list.appendChild(li);
    }

    const closeModal = () => {
      modal.style.display = 'none';
    };
    closeButton.onclick = closeModal;
    modal.onclick = (event) => {
      if (event.target === modal) {
        closeModal();
      }
    };
    modal.style.display = 'block';
  };

  // Add attachment preview modal structure
  const attachmentPreviewModalHTML = `
    <div id="attachmentPreviewModal" style="display: none; position: fixed; z-index: 1001; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.6);">
      <div style="background-color: #fefefe; margin: 5% auto; padding: 20px; border: 1px solid #888; width: 95%; max-width: 1200px; text-align: center; border-radius: 8px; color: black; max-height: 80vh; overflow: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <h3 id="previewFileName" style="margin: 0;">File Preview</h3>
          <div style="display: flex; align-items: center; gap: 15px;">
            <span id="previewCopyButton" style="color: #555; font-size: 22px; cursor: pointer;" title="Copy to clipboard">📋</span>
            <span id="previewCloseButton" style="color: #aaa; font-size: 46px; font-weight: bold; cursor: pointer;">&times;</span>
          </div>
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
  searchContainer.style.display = enableSearch || enableDraftsFilter || enableAppPageSearch ? 'block' : 'none';
  searchContainer.innerHTML = `
    <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
      <input 
        type="text" 
        id="assetSearchInput" 
        placeholder="Search by ${enableAppPageSearch ? 'version, description or hash' : 'wallet name or hash'}..." 
        style="padding: 8px; border-radius: 4px; border: 1px solid #ccc; flex: 1; min-width: 200px; display: ${enableSearch || enableAppPageSearch ? 'block' : 'none'};"
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

  const setupSearchEventListeners = () => {
    document.getElementById('assetSearchInput').addEventListener('input', updateTableVisibility);
    document.getElementById('showLatestVersionOnly').addEventListener('change', updateTableVisibility);
    document.getElementById('showOnlyNoVerifications').addEventListener('change', updateTableVisibility);
  };

  if (enableSearch || enableAppPageSearch) {
    // Call setupEventListeners after a small delay to ensure DOM is ready
    setTimeout(setupSearchEventListeners, 100);
  }
  if (enableDraftsFilter || enableAppPageSearch) {
    document.getElementById('hideDrafts').addEventListener('change', updateTableVisibility);
  }

  // Server sets Content-Disposition from ?filename= (see external/configs/blossom-server/filesNostr).
  const downloadFileWithFilename = (hash, filename) => {
    const a = document.createElement('a');
    a.href = getBlossomDownloadURL(hash, filename);
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  window.downloadBlossomFile = (hash, filename) => {
    downloadFileWithFilename(hash, filename);
  };

  const downloadBlossomFileWithDownloadIcon = (hash, downloadIcon) => {
    let filename = '';
    const platform = downloadIcon.getAttribute('data-platform');
    const version = downloadIcon.getAttribute('data-version');
    const appid = downloadIcon.getAttribute('data-appid');
    const filenameFromEvent = downloadIcon.getAttribute('data-filename');

    if (filenameFromEvent) {
      filename = `${filenameFromEvent}`;
    } else {
      filename = `${appid}-${version}-${hash}`;
      if (platform === 'android') {
        filename += '.apk';
      }
    }

    downloadFileWithFilename(hash, filename);
  };

  function setupBlossomDownloadObserverForTable(tableForObserver) {
    if (assetsTableBlossomObserver) {
      assetsTableBlossomObserver.disconnect();
      assetsTableBlossomObserver = null;
    }
    assetsTableBlossomFilterHook = null;

    const observedHashes = new Set();

    assetsTableBlossomObserver = new IntersectionObserver((entries) => {
      entries.forEach(async entry => {
        if (entry.isIntersecting) {
          const row = entry.target;
          const blossomDownloads = row.querySelectorAll('.blossom-download');

          for (const downloadIcon of blossomDownloads) {
            const hash = downloadIcon.id.replace('blossom-', '');

            if (observedHashes.has(hash)) continue;
            observedHashes.add(hash);

            try {
              const bundleFilesJson = downloadIcon.getAttribute('data-bundle-files');
              const bundleFiles = bundleFilesJson
                ? JSON.parse(decodeURIComponent(bundleFilesJson))
                : null;
              const hashesToCheck = bundleFiles
                ? bundleFiles.map(f => f.hash)
                : [hash];
              const availableHashes = [];
              for (const h of hashesToCheck) {
                if (await checkFileExistsInBlossom(h)) {
                  availableHashes.push(h);
                }
              }

              if (availableHashes.length > 0) {
                downloadIcon.style.display = 'inline';
                downloadIcon.onclick = async () => {
                  const context = {
                    appid: downloadIcon.getAttribute('data-appid'),
                    platform: downloadIcon.getAttribute('data-platform'),
                    version: downloadIcon.getAttribute('data-version'),
                  };

                  const filesForDownload = bundleFiles
                    ? bundleFiles.filter(f => availableHashes.includes(f.hash))
                    : [{ hash, fileName: downloadIcon.getAttribute('data-filename') || null }];

                  if (filesForDownload.length > 1) {
                    openBlossomBundleDownloadModal(filesForDownload, context);
                    return;
                  }

                  const modal = document.getElementById('blossomWarningModal');
                  const confirmButton = document.getElementById('blossomConfirmDownloadButton');
                  const closeButton = document.getElementById('blossomCloseModalButton');

                  const downloadAction = () => {
                    downloadBlossomFileWithDownloadIcon(hash, downloadIcon);
                    modal.style.display = 'none';
                  };

                  confirmButton.replaceWith(confirmButton.cloneNode(true));
                  const newConfirmButton = document.getElementById('blossomConfirmDownloadButton');
                  newConfirmButton.addEventListener('click', downloadAction);

                  const closeModal = () => {
                    modal.style.display = 'none';
                  };
                  closeButton.onclick = closeModal;
                  modal.onclick = (event) => {
                    if (event.target === modal) {
                      closeModal();
                    }
                  };

                  modal.style.display = 'block';
                };
              }
            } catch (error) {
              console.error(`Error checking hash ${hash} in Blossom:`, error);
            }
          }
        }
      });
    }, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    });

    const tableRows = tableForObserver.querySelectorAll('tr:not(:first-child):not(.show-more-row)');
    tableRows.forEach(row => {
      assetsTableBlossomObserver.observe(row);
    });

    function updateObserverForVisibleRows() {
      const visibleRows = Array.from(tableForObserver.querySelectorAll('tr:not([style*="display: none"]):not(:first-child):not(.show-more-row)'));
      visibleRows.forEach(row => {
        assetsTableBlossomObserver.observe(row);
      });
    }

    assetsTableBlossomFilterHook = () => {
      updateObserverForVisibleRows();
    };

    updateObserverForVisibleRows();
  }

  function removeAssetsTableDynamicContent() {
    if (assetsTableBlossomObserver) {
      assetsTableBlossomObserver.disconnect();
      assetsTableBlossomObserver = null;
    }
    assetsTableBlossomFilterHook = null;
    const host = document.getElementById(htmlElementId);
    if (!host) {
      return;
    }
    host.querySelectorAll('.issue-tracker-container').forEach(el => el.remove());
    host.querySelector('#assetsTable')?.remove();
    host.querySelectorAll('.assets-table-attachments-wrap').forEach(el => el.remove());
  }

  function applyDraftRowMetadataToTable(tableEl) {
    const rows = tableEl.querySelectorAll('tr:not(:first-child):not(.show-more-row)');
    rows.forEach(row => {
      const verifications = Array.from(row.querySelectorAll('.attestation-link'));
      let pubkeyVerifications = [];
      verifications.forEach(verification => {
        const pk = verification.getAttribute('data-pubkey_verifiers');
        if (pk) {
          pubkeyVerifications.push(pk);
        }
      });
      if (verifications.length > 0 && verifications.every(verification => verification.classList.contains('draft-attestation'))) {
        row.classList.add('draft-attestation');
        if (pubkeyVerifications.length > 0) {
          row.dataset.pubkey_verifiers = pubkeyVerifications.join(', ');
        }
      }
    });
  }

  function paintMainAssetsTable(assetInfo) {
    response = assetInfo;
    let hasVerificationsLocal = false;
    let hasAssetsLocal = false;

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

  // It's items because they can be verifications or assets (no status or content)
  // Convert to array and sort by most recent item in each group
  let sortedItems = Array.from(combinedItems).map(([sha256Key, items]) => {
    const sortedGroupItems = items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return {
      sha256: sha256Key,
      items: sortedGroupItems,
    };
  });

  sortedItems = mergeBundleAssetRows(sortedItems, sha256);

  // Sort either by version or date depending on sortByVersion parameter
  if (sortByVersion) {
    sortedItems.sort((a, b) => {
      let versionA = getFirstTagValue(a.items[0], 'version');
      let versionB = getFirstTagValue(b.items[0], 'version');

      // Remove leading 'v' or 'V' prefix if present
      versionA = versionA.replace(/^[vV]/, '');
      versionB = versionB.replace(/^[vV]/, '');

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

  let attachmentEventIDs = [];
  let endorsementEventIDs = [];

  if (sortedItems.length > 0) {
    if (appPlatform) {
      sortedItems.forEach((itemsForThisSha256) => {
        itemsForThisSha256.items = itemsForThisSha256.items.filter(item => {
          const itemPlatform = getFirstTagValue(item, 'platform');
          // 'desktop' in page layouts maps to 'linux'/'windows'/'macos' in verification events
          if (appPlatform === 'desktop') {
            return itemPlatform === 'linux' || itemPlatform === 'windows' || itemPlatform === 'macos';
          }
          return appPlatform === itemPlatform;
        });
      });

      // Remove groups with no remaining items
      for (let i = sortedItems.length - 1; i >= 0; i--) {
        if (sortedItems[i].items.length === 0) {
          sortedItems.splice(i, 1);
        }
      }
    }

    sortedItems.forEach((itemsForThisSha256, index) => {
      itemsForThisSha256.items.forEach(item => {
        // Attachments
        if (item.kind === verificationKind || item.kind === verificationDraftKind) {
          const fileEventIds = getFileAttachmentIDsForVerificationEvent(item);
          attachmentEventIDs.push(...fileEventIds);
        }

        // Endorsements
        if (item.kind === verificationKind) {
          endorsementEventIDs.push(item.id);
        }
      });
    });
  }

  const table = document.createElement('table');
  table.id = 'assetsTable';
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

      const date = formatDate(binary.created_at);

      const eventId = binary.id;
      const sha256Hashes = getHashTags(binary).slice(0, 6);
      const sha256HashKey = item.sha256;
      const downloadHash = sha256HashKey;
      const verificationLookupHash = item.sha256 || getVerificationLookupHash(binary);
      const version = getFirstTagValue(binary, 'version');
      const identifier = getFirstTagValue(binary, 'i');
      const platform = getFirstTagValue(binary, 'platform');

      let thisHashHasAssets = false;

      item.items.forEach(item => {
        if (isAssetRegistrationEvent(item)) {
          thisHashHasAssets = true;
        }
      });

      if (showOnlyRegisteredAssets && !thisHashHasAssets) {
        return;
      }

      if (thisHashHasAssets) {
        hasAssetsLocal = true;
      }
      
      // Get description, guess if it's an asset or a verification
      const itemDescription = isAssetRegistrationEvent(binary)
        ? binary.content
        : JSON.parse(binary.content).description;

      const collectAttestationsForHashes = (hashes) => {
        const seen = new Set();
        const collected = [];
        for (const hash of hashes) {
          for (const attestation of [
            ...(response.verifications.get(hash) || []),
            ...(response.draftVerifications.get(hash) || []),
          ]) {
            if (!seen.has(attestation.id)) {
              seen.add(attestation.id);
              collected.push(attestation);
            }
          }
        }
        return collected;
      };

      const bundleHashes = getAssetFileEntries(binary).map(entry => entry.hash);
      const lookupHashes = bundleHashes.length > 1
        ? bundleHashes
        : [verificationLookupHash || bundleHashes[0]].filter(Boolean);
      const attestations = collectAttestationsForHashes(lookupHashes);

      let verificationsList;
      if (attestations.length > 0) {
        hasVerificationsLocal = true;

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
          const attestationDate = formatDate(attestation.created_at);

          const status = getFirstTagValue(attestation, 'status');

          let statusText = null;

          const isMine = attestation.pubkey === window.userPubkey;
          const isDraft = attestation.kind === verificationDraftKind;
          const isMyDraft = isDraft && isMine;

          const draftBadge = isMyDraft ? `<span class="badge badge-warning">Draft</span>` : '';

          statusText = (status === 'reproducible' ? '✅ ' : '❌ ') + '<span class="attestation-status">' + getStatusText(status, true) + '</span>';

          listItems += `<span
                            onclick='showVerificationModal("${sha256HashKey}", "${attestation.id}", "${identifier}", "${platform}")'
                            class="attestation-link ${isMyDraft ? 'draft-attestation' : ''}"
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

      let fileName = '';
      let bundleFilesForDownload = [];
      item.items.forEach(assetEvent => {
        if (isAssetRegistrationEvent(assetEvent)) {
          const entries = getAssetFileEntries(assetEvent);
          if (entries.length > 0) {
            bundleFilesForDownload = entries.map(e => ({
              hash: e.hash,
              fileName: e.fileName,
            }));
            const scriptBinary = pickScriptBinaryEntry(assetEvent);
            if (scriptBinary?.fileName) {
              fileName = scriptBinary.fileName.replace(/\s+/g, '-');
            }
          } else {
            const fileNameFromAssetRegistration = getPrimaryFileName(assetEvent);
            if (fileNameFromAssetRegistration) {
              fileName = fileNameFromAssetRegistration.replace(/\s+/g, '-');
            }
          }
        }
      });
      const sanitizedFileName = fileName ? fileName.replace(/\s+/g, '-') : '';
      const bundleFilesAttr = bundleFilesForDownload.length > 0
        ? ` data-bundle-files="${encodeURIComponent(JSON.stringify(bundleFilesForDownload))}"`
        : '';
      const downloadTitle = bundleFilesForDownload.length > 1
        ? `Download ${bundleFilesForDownload.length} files from Blossom`
        : 'Download from Blossom';

      const row = document.createElement('tr');
      // Use a class to track initially hidden rows instead of inline style
      if (index >= showOnlyRows) {
        row.classList.add('initially-hidden');
        row.style.display = 'none';
      }
      const sanitizedVersion = version.replace(/\./g, '-');
      row.setAttribute('id', `version-${sanitizedVersion}`);
      row.innerHTML = `
        ${hideConfig?.wallet ? '' : `<td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: normal; word-wrap: break-word;">
          ${wallet ? `<a href="${wallet.url}" rel="noopener noreferrer">${walletTitle}</a><br>${version}<span class="show-on-mobile"><br>${itemDescription}<br>          ${sha256Hashes.length > 0 ? sha256Hashes.map(hash => `
          <div style="margin-bottom: 4px;">
            <button onclick="navigator.clipboard.writeText('${hash[1]}').then(() => showToast('Hash copied to clipboard'))" class="copy-button" title="Copy hash to clipboard">📋</button><span class="hash-display" title="${hash[1]}">${hash[1]}${hash[2] ? ` (${hash[2]})` : ''}</span>
          </div>`).join('') : '-'}</span>` : walletTitle}
          </td>`}
        ${hideConfig?.wallet ? `<td>
          ${version}<span class="show-on-mobile"><br>${itemDescription}<br>          ${sha256Hashes.length > 0 ? sha256Hashes.map(hash => `
          <div style="margin-bottom: 4px;">
            <button onclick="navigator.clipboard.writeText('${hash[1]}').then(() => showToast('Hash copied to clipboard'))" class="copy-button" title="Copy hash to clipboard">📋</button><span class="hash-display" title="${hash[1]}">${hash[1]}${hash[2] ? ` (${hash[2]})` : ''}</span>
          </div>`).join('') : '-'}</span>
          </td>` : ''}
        <td class="asset-description hide-on-mobile" style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: normal; word-wrap: break-word;">${itemDescription}</td>
        ${hideConfig?.sha256 ? '' : `<td class="hide-on-mobile">
          ${sha256Hashes.length > 0 ? sha256Hashes.map(hash => `
          <div style="margin-bottom: 4px;">
            <span class="hash-display" title="${hash[1]}">${hash[1]}${hash[2] ? ` (${hash[2]})` : ''}</span>
            <button onclick="navigator.clipboard.writeText('${hash[1]}').then(() => showToast('Hash copied to clipboard'))" class="copy-button" title="Copy hash to clipboard">📋</button>
          </div>`).join('') : '-'}
        </td>`}
        <td class="hide-on-mobile">
          ${downloadHash ? `
            <span id="blossom-${downloadHash}" data-appid="${identifier}" data-platform="${platform}" data-version="${version}" data-filename="${sanitizedFileName}"${bundleFilesAttr} class="blossom-download" style="display: none; cursor: pointer;" title="${downloadTitle}">💾</span>
          ` : '-'}
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

    return {
      table,
      sortedItems,
      attachmentEventIDs,
      endorsementEventIDs,
      profilePubkeys,
      hasAssets: hasAssetsLocal,
      hasVerifications: hasVerificationsLocal
    };
  }

  response = await getAllAssetInformation({
    pubkey,
    appId,
    sha256,
    getDrafts,
    months,
    onCachedDataLoaded: (cachedData) => {
      removeAssetsTableDynamicContent();
      const pr = paintMainAssetsTable(cachedData);
      hasAssets = pr.hasAssets;
      cachePaintFingerprint = fingerprintAllAssetInformation(cachedData);
      cachePaintResult = pr;
      applyDraftRowMetadataToTable(pr.table);
      void updateTableVisibility();
      setupBlossomDownloadObserverForTable(pr.table);
      if (typeof tableLoadedCallback === 'function') {
        tableLoadedCallback();
      }
    }
  });

  let skipRepaint = cachePaintFingerprint !== null &&
    fingerprintAllAssetInformation(response) === cachePaintFingerprint;
  if (skipRepaint && !document.getElementById('assetsTable')) {
    skipRepaint = false;
  }

  if (!skipRepaint) {
    removeAssetsTableDynamicContent();
  }

  if (showIssueTracker) {
    await showIssueTrackerHtmlWidget(response.verifications, htmlElementId);
    const host = document.getElementById(htmlElementId);
    const issueEl = host?.querySelector('.issue-tracker-container');
    const searchEl = host?.querySelector('.assets-search-container');
    if (issueEl && searchEl) {
      host.insertBefore(issueEl, searchEl);
    }
  }

  let paintResult;
  let table;
  let sortedItems;
  let attachmentEventIDs;
  let endorsementEventIDs;
  let profilePubkeys;

  if (skipRepaint) {
    paintResult = cachePaintResult;
    hasAssets = paintResult.hasAssets;
    sortedItems = paintResult.sortedItems;
    attachmentEventIDs = paintResult.attachmentEventIDs;
    endorsementEventIDs = paintResult.endorsementEventIDs;
    profilePubkeys = paintResult.profilePubkeys;
    table = document.getElementById('assetsTable');
  } else {
    paintResult = paintMainAssetsTable(response);
    hasAssets = paintResult.hasAssets;
    sortedItems = paintResult.sortedItems;
    attachmentEventIDs = paintResult.attachmentEventIDs;
    endorsementEventIDs = paintResult.endorsementEventIDs;
    profilePubkeys = paintResult.profilePubkeys;
    table = paintResult.table;
  }

  let hasVerifications = paintResult.hasVerifications;

  function findVerificationByIdInMaps(assetMapsResponse, idToFind) {
    const allMaps = [assetMapsResponse.verifications, assetMapsResponse.draftVerifications];
    for (const map of allMaps) {
      if (map) {
        for (const [sha256, attestations] of map.entries()) {
          const found = attestations.find(att => att.id === idToFind);
          if (found) {
            return { verification: found, sha256Hash: sha256 };
          }
        }
      }
    }
    return null;
  }

  if (location.hash.startsWith('#verificationId=')) {
    const params = new URLSearchParams(location.hash.substring(1));
    const verificationId = params.get('verificationId');

    if (verificationId) {
      const result = findVerificationByIdInMaps(response, verificationId);

      if (result) {
        const { verification, sha256Hash } = result;
        const appIdFromVerification = getFirstTagValue(verification, 'i');
        const platformFromVerification = getFirstTagValue(verification, 'platform');

        setTimeout(() => {
          window.showVerificationModal(sha256Hash, verificationId, appIdFromVerification, platformFromVerification);
        }, 100);
      } else {
        console.warn('Verification ID from URL hash not found:', verificationId);
        history.pushState("", document.title, window.location.pathname + window.location.search);
      }
    } else {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
  }

  applyDraftRowMetadataToTable(table);

  if (!skipRepaint && typeof tableLoadedCallback === 'function') {
    tableLoadedCallback();
  }

  if (sortedItems.length > 0) {
    attachments = await getEventsFromEventIds(attachmentEventIDs);
    endorsements = await getEndorsementsFromVerificationEventIds(endorsementEventIDs);
    endorsements.loaded = true;
  }

  // ATTACHMENTS TABLE
  if (attachments.size > 0) {
    attachments.forEach(attachment => {
      if (showProfilePictures && !profilePubkeys.includes(attachment.pubkey)) {
        profilePubkeys.push(attachment.pubkey);
      }
    });

    let attachmentsTable = null;
    if (showAttachmentsTable) {
      const wrap = document.createElement('div');
      wrap.className = 'assets-table-attachments-wrap';
      const paragraph = document.createElement('p');
      paragraph.innerHTML = 'Scripts used to reproduce the application:';
      wrap.appendChild(paragraph);
      attachmentsTable = document.createElement('table');
      attachmentsTable.innerHTML = `
        <thead>
          <tr>
            <th>File</th>
            <th>Used to reproduce</th>
          </tr>
        </thead>
      `;
      wrap.appendChild(attachmentsTable);
      document.getElementById(htmlElementId).appendChild(wrap);
    }

    attachments.forEach(attachment => {
      const { name, sizeInKb } = getAttachmentInfo(attachment);

      const attachmentContentType = getFirstTagValue(attachment, 'content-type', 'application/octet-stream');

      attachmentDataStore[attachment.id] = {
        content: atob(attachment.content),
        type: attachmentContentType,
        filename: name,
        sizeInKb: sizeInKb
      };

      if (showAttachmentsTable && attachmentsTable) {
        const row = document.createElement('tr');

        const verifications = sortedItems.flatMap(item =>
          item.items.filter(i =>
            i.tags.some(tag => tag[0] === 'file-attachment' && tag[1] === attachment.id)
          )
        );

        if (verifications.some(v => v.kind === verificationDraftKind)) {
          row.classList.add('draft-attestation');
        }

        const date = formatDate(attachment.created_at);

        let rowHTML = `
          <td>${name} <small>(${sizeInKb} kB)</small> 
            <span id="${attachment.id}" style="cursor: pointer; margin-left: 6px;" onclick="handleAttachmentDownload('${attachment.id}')" title="Download ${name}">💾</span>
            <span id="preview-${attachment.id}" style="cursor: pointer; margin-left: 6px;" onclick="handleAttachmentPreview('${attachment.id}')" title="Preview ${name}">👁️</span><br>
            <small>Uploaded on ${date} by</small> <span style="margin-left: 4px;" class="profile-${attachment.pubkey}">${attachment.pubkey}</span>
          </td>

          <td>`;

        if (verifications.length > 0) {
          for (const verification of verifications) {
            const version = getFirstTagValue(verification, 'version');
            const identifier = getFirstTagValue(verification, 'i');
            const platform = getFirstTagValue(verification, 'platform');

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
      }
    });
  }

  if (!skipRepaint) {
    setupBlossomDownloadObserverForTable(table);
  }

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
            <div class="profile-circle-container" data-name="${getProfileDisplayName(profile, pubkey)}">
              ${profile.image ? `<img src="${profile.image}" class="profile-circle" onerror="this.style.display='none'"/>` : ''}
              <div class="profile-hover-modal">
                <div class="profile-modal-content">
                  ${profile.image ? `<img src="${profile.image}" class="profile-modal-image" onerror="this.style.display='none'"/>` : ''}
                  <br>
                  <span>${getProfileDisplayName(profile, pubkey)}</span>
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

  updateTableVisibility();

  return {
    hasAssets,
    hasVerifications,
    info: response
  };
};

let pendingVerificationReport = null;

function closeVerificationReportConfirmModal() {
  const modal = document.getElementById('verificationReportConfirmModal');
  if (modal) {
    modal.style.display = 'none';
  }
  pendingVerificationReport = null;
}

function ensureVerificationReportConfirmModal() {
  if (document.getElementById('verificationReportConfirmModal')) {
    return;
  }
  const wrap = document.createElement('div');
  wrap.id = 'verificationReportConfirmModal';
  wrap.style.display = 'none';
  wrap.style.position = 'fixed';
  wrap.style.left = '0';
  wrap.style.top = '0';
  wrap.style.width = '100%';
  wrap.style.height = '100%';
  wrap.style.background = 'rgba(0,0,0,0.6)';
  wrap.style.zIndex = '10004';
  wrap.innerHTML = `
    <div id="verificationReportConfirmInner" style="background-color: #fefefe; margin: 12% auto; padding: 20px; border: 1px solid #888; width: 90%; max-width: 520px; border-radius: 8px; color: #000; position: relative;">
      <span id="closeVerificationReportConfirmModal" style="color: #aaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer; line-height: 1;">&times;</span>
      <h3 style="margin-top: 0;">Confirm report</h3>
      <div id="verificationReportConfirmText" style="margin-bottom: 16px; font-size: 14px;"></div>
      <p style="margin-bottom: 12px; font-weight: 600;">Are you sure?</p>
      <div style="display: flex; flex-wrap: wrap; gap: 10px;">
        <button type="button" id="verificationReportConfirmYes" class="btn btn-danger">Yes</button>
        <button type="button" id="verificationReportConfirmNo" class="btn btn-secondary">No</button>
      </div>
    </div>`;
  document.body.appendChild(wrap);

  document.getElementById('closeVerificationReportConfirmModal').onclick = () => {
    closeVerificationReportConfirmModal();
  };
  document.getElementById('verificationReportConfirmNo').onclick = () => {
    closeVerificationReportConfirmModal();
  };
  wrap.onclick = (event) => {
    if (event.target === wrap) {
      closeVerificationReportConfirmModal();
    }
  };
  document.getElementById('verificationReportConfirmYes').onclick = async () => {
    const pending = pendingVerificationReport;
    if (!pending) {
      return;
    }
    try {
      await window.createVerificationReport({
        verificationEventId: pending.verification.id,
        reportedPubkey: pending.verification.pubkey,
        reason: pending.reason
      });
      closeVerificationReportConfirmModal();
      await showToast('Report published.', 'success');
      window.location.reload();
    } catch (e) {
      closeVerificationReportConfirmModal();
      showToast('Failed to publish report: ' + (e.message || e), 'error');
    }
  };
}

function openVerificationReportConfirmModal(verification, reason) {
  ensureVerificationReportConfirmModal();
  pendingVerificationReport = { verification, reason };
  const inner = document.getElementById('verificationReportConfirmInner');
  if (inner) {
    inner.style.backgroundColor = window.theme === 'dark' ? '#2d2d2d' : '#fefefe';
    inner.style.color = window.theme === 'dark' ? '#fff' : '#000';
  }
  const text = document.getElementById('verificationReportConfirmText');
  text.innerHTML = [
    '<p>The following <strong>Nostr kind 1984</strong> report will be sent to the configured relays:</p>',
    `<p><strong>Verification event id (e):</strong> ${verification.id}</p>`,
    `<p><strong>Reported pubkey (p):</strong> ${verification.pubkey}</p>`,
    `<p><strong>Reason (r):</strong> ${reason}</p>`
  ].join('');
  document.getElementById('verificationReportConfirmModal').style.display = 'block';
}

function initVerificationAdminReportControls(verification) {
  const wrap = document.getElementById('adminReportVerificationWrap');
  const menu = document.getElementById('adminReportVerificationMenu');
  const reportBtn = document.getElementById('adminReportVerificationBtn');
  if (!wrap || !menu || !reportBtn) {
    return;
  }
  menu.style.display = 'none';
  if (!isWalletScrutinySiteAdmin(window.userPubkey)) {
    wrap.style.display = 'none';
    return;
  }
  wrap.style.display = 'inline-block';

  const applyAdminReportMenuTheme = () => {
    const isDark = window.theme === 'dark';
    menu.style.background = isDark ? '#2d2d2d' : '#fff';
    menu.style.color = isDark ? '#fff' : '#000';
    menu.style.borderColor = isDark ? '#555' : '#ccc';
    const hoverBg = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
    menu.querySelectorAll('.admin-report-reason').forEach((el) => {
      el.style.setProperty('color', isDark ? '#ffffff' : '#000000', 'important');
      el.style.setProperty('background', 'transparent', 'important');
      el.onmouseenter = () => {
        el.style.setProperty('background', hoverBg, 'important');
      };
      el.onmouseleave = () => {
        el.style.setProperty('background', 'transparent', 'important');
      };
      el.onclick = (e) => {
        e.stopPropagation();
        menu.style.display = 'none';
        openVerificationReportConfirmModal(verification, el.getAttribute('data-reason'));
      };
    });
  };
  applyAdminReportMenuTheme();

  reportBtn.onclick = (e) => {
    e.stopPropagation();
    const opening = menu.style.display === 'none' || menu.style.display === '';
    if (opening) {
      applyAdminReportMenuTheme();
    }
    menu.style.display = opening ? 'block' : 'none';
  };
}

window.showVerificationModal = async function(sha256Hash, verificationId, appId, platform) {
  document.body.classList.add("modal-open");

  const verifications = response.verifications.get(sha256Hash) || [];
  const draftVerifications = response.draftVerifications.get(sha256Hash) || [];
  const allTheVerifications = [...verifications, ...draftVerifications];
  const verification = allTheVerifications.find(a => a.id === verificationId);
  const otherVerificationsBySamePubkey = allTheVerifications.filter(a => (a.pubkey === verification.pubkey && a.id !== verification.id));

  window.currentVerification = verification;

  const status = getFirstTagValue(verification, 'status');

  const modal = document.getElementById('verificationModal');
  const modalBackdrop = document.getElementById('verificationModalBackdrop');

  if (!document.getElementById('diffoscopeModal')) {
    modal.insertAdjacentHTML('beforebegin', `
    <div id="diffoscopeModal" class="diffoscope-modal" style="display: none; z-index: 100000;">
      <div class="diffoscope-modal-content">
        <div class="diffoscope-controls">
            <span class="diffoscope-maximize" title="Maximize">⛶</span>
            <span class="diffoscope-close" title="Close">✖</span>
        </div>
        <iframe id="diffoscopeFrame"></iframe>
      </div>
    </div>`);
  }

  if (!document.getElementById('endorsementModal')) {
    const endorsementModalDiv = document.createElement('div');
    endorsementModalDiv.id = 'endorsementModal';
    endorsementModalDiv.style.display = 'none';
    endorsementModalDiv.innerHTML = `
      <div id="endorsementModalContent">
        <span id="closeEndorsementModal">&times;</span>
        <h3 style="margin-top: 0;">Endorse this verification</h3>
        <p style="margin-bottom: 20px;">Endorsing a verification means you are publicly signaling your agreement or disagreement with the result of this verification, and/or a trust in the verifier.</p>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <button id="endorseValidBtn" class="btn btn-success">Label as Valid</button>
          <button id="endorseInvalidBtn" class="btn btn-danger" style="background-color: #d9534f; color: white; border-color: #d43f3a;">Label as Invalid</button>
          <button id="endorseCancelBtn" class="btn btn-secondary">Cancel</button>
        </div>
      </div>
    `;
    endorsementModalDiv.style.position = 'fixed';
    endorsementModalDiv.style.left = '0';
    endorsementModalDiv.style.top = '0';
    endorsementModalDiv.style.width = '100%';
    endorsementModalDiv.style.height = '100%';
    endorsementModalDiv.style.background = 'rgba(0,0,0,0.6)';
    endorsementModalDiv.style.zIndex = '10002';
    document.body.appendChild(endorsementModalDiv);
  }

  window.openEndorsementModal = function(verificationEventId, sha256Hash) {
    const modal = document.getElementById('endorsementModal');
    modal.style.display = 'block';
    document.body.classList.add('modal-open');

    // Remove previous listeners to avoid duplicates
    const validBtn = document.getElementById('endorseValidBtn');
    const invalidBtn = document.getElementById('endorseInvalidBtn');
    const cancelBtn = document.getElementById('endorseCancelBtn');
    const closeBtn = document.getElementById('closeEndorsementModal');

    // Remove all listeners by cloning
    validBtn.replaceWith(validBtn.cloneNode(true));
    invalidBtn.replaceWith(invalidBtn.cloneNode(true));
    cancelBtn.replaceWith(cancelBtn.cloneNode(true));
    closeBtn.replaceWith(closeBtn.cloneNode(true));

    const newValidBtn = document.getElementById('endorseValidBtn');
    const newInvalidBtn = document.getElementById('endorseInvalidBtn');
    const newCancelBtn = document.getElementById('endorseCancelBtn');
    const newCloseBtn = document.getElementById('closeEndorsementModal');

    const closeModal = () => {
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    };

    newCancelBtn.onclick = closeModal;
    newCloseBtn.onclick = closeModal;
    modal.onclick = (event) => {
      if (event.target === modal) closeModal();
    };

    // ESC key closes modal
    const handleKeyDown = function(event) {
      if (event.key === 'Escape') {
        closeModal();
        window.removeEventListener('keydown', handleKeyDown);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    async function handleEndorsement(isValid) {
      try {
        if (!window.userPubkey) {
          showToast('You must have a Nostr extension to endorse a verification.', 'error');
          return;
        }
        const npub = getNpubFromPubkey(window.userPubkey);
        await createEndorsement({ validity: isValid, verificationEventId, sha256Hash, endorserNpubkey: npub });
        closeModal();
        await showToast(`Successfully marked as ${isValid ? 'Valid' : 'Invalid'}.`, 'success');
        window.location.reload();
      } catch (e) {
        closeModal();
        showToast('Failed to endorse: ' + (e.message || e), 'error');
      }
    }

    newValidBtn.onclick = () => handleEndorsement(true, verificationId);
    newInvalidBtn.onclick = () => handleEndorsement(false, verificationId);
  };

  const content = document.getElementById('verificationContent');

  // Reset scroll positions before showing the modal again
  setTimeout(() => {
    content.scrollTop = 0;
    content.scrollLeft = 0;
  }, 0);

  modal.style.background = window.theme === 'dark' ? '#111' : '#fff';
  modal.style.color = window.theme === 'dark' ? 'white' : 'black';

  let otherVerificationsHTML = '';
  if (otherVerificationsBySamePubkey.length > 0) {
    for (const otherVerification of otherVerificationsBySamePubkey) {
      const status = getFirstTagValue(otherVerification, 'status');

      const statusIcon = '<span title="' + getStatusText(status) + '" style="margin-left: 4px;">' + getStatusIcon(status) + '</span>';

      otherVerificationsHTML += `<li>
        ${formatDate(otherVerification.created_at)} ${statusIcon}
      </li>`;
    }
    otherVerificationsHTML = `<ul class="attestation-other-attempts">${otherVerificationsHTML}</ul>`;
  }

  const isMine = verification.pubkey === window.userPubkey;
  const isDraft = verification.kind === verificationDraftKind;
  const isMyDraft = isDraft && isMine;

  let title = '';
  let icon = '';
  let basedOnParams = '';
  if (isMine) {
    title = isDraft ? 'Edit your draft' : 'Edit your verification';
    icon = '✏️';
  } else {
    title = isDraft ? 'Copy this draft' : 'Copy this verification';
    icon = '📋';
    basedOnParams = `&basedOn=${verification.id}:${verification.pubkey}`;
  }

  content.innerHTML = '<p>';
  content.innerHTML += isMyDraft ? `<span class="badge badge-big badge-warning">Draft</span> This is a draft verification. It is not published yet.` : '';
  content.innerHTML += `<button style="margin: 0; padding: 0; border: 0; background: transparent; ${isMyDraft ? 'margin-left: 10px;' : ''}" id="shareButtonContainer"></button>`;
  content.innerHTML += `<button class="btn btn-info" style="margin-left: 10px;" onclick="event.stopPropagation(); window.location.href=\'/new_verification/?${isMyDraft ? 'draftVerificationEventId' : 'verificationEventId'}=${verification.id}&action=edit${basedOnParams}\'" title="${title}">${icon} ${title}</button>`;
  if (!isDraft && !isMine) {
    content.innerHTML += `<button class="btn btn-info" style="margin-left: 10px;" onclick="event.stopPropagation(); window.openEndorsementModal('${verification.id}', '${sha256Hash}')" title="Endorse this verification">👍 👎 Endorse this verification</button>`;
  }
  content.innerHTML += `<button class="btn btn-info" style="margin: 0; padding: 0; border: 0; background: transparent; margin-left: 10px;" id="verificationActionButtons"></button>`;
  content.innerHTML += `<span id="verificationZapReportGroup" style="margin-left: 10px; display: inline-flex; align-items: center; flex-wrap: wrap; gap: 8px;">
    <button class="btn btn-info" style="display: none; padding-bottom: 7px; margin: 0;" id="zapButton" onclick="showZapModal({onClose: () => {}, setZapped: (ok) => {}});">
      <i class="fab fa-bitcoin" style="font-size: 23px;"></i> Zap this verification
    </button>
    <span id="adminReportVerificationWrap" style="display: none; position: relative; vertical-align: middle;">
      <button type="button" class="btn btn-secondary" id="adminReportVerificationBtn" style="font-size: 16px; margin: 0;">Report as spam/incorrect</button>
      <div id="adminReportVerificationMenu" style="display: none; position: absolute; left: 0; top: 100%; z-index: 10003; margin-top: 4px; min-width: 160px; border: 1px solid #ccc; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); background: #fff; color: #000;">
        <button type="button" class="admin-report-reason" data-reason="spam" style="display: block; width: 100%; text-align: left; padding: 8px 12px; border: 0; background: transparent; cursor: pointer; font-size: 16px;">Report as spam</button>
        <button type="button" class="admin-report-reason" data-reason="incorrect" style="display: block; width: 100%; text-align: left; padding: 8px 12px; border: 0; background: transparent; cursor: pointer; font-size: 16px;">Report as incorrect</button>
      </div>
    </span>
  </span>`;
  content.innerHTML += isMine
    ? '<a href="#" id="deleteVerificationLink" class="verification-modal-delete-link">Delete Verification</a>'
    : '';
  content.innerHTML += '</p>';

  const version = getFirstTagValue(verification, 'version');
  const identifier = getFirstTagValue(verification, 'i');
  const wallet = window.wallets.find(w => w.appId === identifier);
  const walletTitle = wallet ? wallet.title : identifier;

  const verificationHashes = verification.tags.filter(tag => tag[0] === 'x').map(tag => tag[1]).filter(id => id.length === 64);
  if (verificationHashes.length === 1) {
    content.innerHTML += `<p><strong>Hash of the binary reproduced:</strong> ${verificationHashes[0]}</p>`;
  } else {
    content.innerHTML += `<p style="margin-bottom: 10px;"><strong>Hashes of the binaries reproduced:</strong><br>${verificationHashes.join('<br>')}</p>`;
  }

  content.innerHTML += `
    <p><strong>Application:</strong> ${walletTitle}</p>
    <p><strong>Version:</strong> ${version}</p>
    <p><strong>Attempt by:</strong> <span id="attempt-by"></span></p>`;

  const basedOn = getFirstTagValue(verification, 'based-on');
  if (basedOn) {
    content.innerHTML += `<p><strong>Based on an attempt by:</strong> <span id="based-on-attempt-by"></span></p>`;
  }

  content.innerHTML += `
    <p><strong>Created At:</strong> ${ formatDate(verification.created_at) }</p>
    <p><strong>Build status: </strong> ${getStatusIcon(status)} ${getStatusText(status)}</p>
    <p style="display: none;" id="zaps"></p>
    <p style="display: none;" id="endorsements"></p>`;

  const issueTrackerUrl = getFirstTagValue(verification, 'issue-tracker-url') || '';
  if (issueTrackerUrl) {
    content.innerHTML += `<p><strong>Issue tracker url:</strong> <a href="${issueTrackerUrl}" target="_blank">${issueTrackerUrl}</a></p>`;
  }

  content.innerHTML += '<div id="comments-container"></div>';

  const verificationAttachments = verification.tags.filter(tag => tag[0] === 'file-attachment');
  const verificationOutputFiles = verification.tags.filter(tag => tag[0] === 'output-file');

  // Show attachments (scripts used to reproduce)
  const numberVerificationAttachments = verificationAttachments.length;
  if (numberVerificationAttachments > 0) {
    let attachmentsHTML = '';

    if (!window.location.pathname.includes('/verifier/') && !window.location.pathname.includes('/assets/')) {
      //  Wait here until attachmentDataStore is filled
      while (Object.keys(attachmentDataStore).length === 0) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      for (const attachment of verificationAttachments) {
        const attachmentId = attachment[1];
        const attachmentInfo = attachmentDataStore[attachmentId];
  
        if (attachmentInfo) {
          attachmentsHTML += `<li>${attachmentInfo.filename} <small>(${attachmentInfo.sizeInKb} kB)</small>  
            <span id="${attachmentId}" style="cursor: pointer; margin-left: 10px;" onclick="handleAttachmentDownload('${attachmentId}')" title="Download ${attachmentInfo.filename}">💾</span>
            <span id="preview-${attachmentId}" style="cursor: pointer; margin-left: 10px;" onclick="handleAttachmentPreview('${attachmentId}')" title="Preview ${attachmentInfo.filename}">👁️</span></li>`;
        }
      }
    } else {
      const wallet = window.wallets.find(w => w.appId === appId);
      attachmentsHTML += `<li>${numberVerificationAttachments} script(s) used to reproduce this binary. See the <a href="${wallet.url}#verificationId=${verificationId}">the wallet page</a> for more details.</li>`;
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
  <p><strong>Information:</strong></p>
  <div class="markdown-content">
      ${diffoscopeHTML}
      ${asciicastHTML}
      <div>${marked.parse(itemContent)}</div>
  </div>`;

  if (firstAsciicastFileSHA256) {
    const castURL = getBlossomFileURL(firstAsciicastFileSHA256);

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

  const appIdForTheKey = getFirstTagValue(verification, 'i');
  const versionForTheKey = getFirstTagValue(verification, 'version');
  const platformForTheKey = getFirstTagValue(verification, 'platform');
  const authorPubkeyForTheKey = verification.pubkey;
  const verificationKey = `${appIdForTheKey}:${versionForTheKey}:${platformForTheKey}:${authorPubkeyForTheKey}:${verification.id}`;

  renderCommentsSection(document.getElementById('comments-container'), verificationKey, authorPubkeyForTheKey);

  initVerificationAdminReportControls(verification);

  if (diffoscopeFiles.length > 0) {
    insertDiffoscopeAssets();
  }

  if (modalBackdrop) {
    const isMobileModal = window.matchMedia('(max-width: 480px)').matches;
    modalBackdrop.style.background = isMobileModal
      ? (window.theme === 'dark' ? '#111' : '#fff')
      : (window.theme === 'dark' ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.45)');
    modalBackdrop.style.display = 'block';
  }
  modal.style.display = 'block';

  // Store original URL before changing hash
  originalUrlBeforeModal = window.location.pathname + window.location.search;

  // Update hash only if not already set by initial load check
  const currentHash = `#verificationId=${verificationId}`;
  if (window.location.hash !== currentHash) {
    location.hash = currentHash;
  }

  const profile = await getNostrProfile(verification.pubkey);
  if (profile && (profile.lud16 || profile.lud06)) {
    document.getElementById('zapButton').style.display = 'inline-block';
  } else {
    const zapBtn = document.getElementById('zapButton');
    zapBtn.style.display = 'inline-block';
    zapBtn.disabled = true;
    zapBtn.style.backgroundColor = '#ccc';
    zapBtn.style.color = '#888';
    zapBtn.style.cursor = 'not-allowed';
    zapBtn.title = "The user doesn't have a nostr profile or a LN address to receive sats";
  }

  document.getElementById('attempt-by').innerHTML = profile ? `
    <div class="profile-card">
      ${profile.image ? `<img src="${profile.image}" class="profile-image" onclick="window.location.href='/verifier/?pubkey=${verification.pubkey}'" onerror="this.style.display='none'"/>` : ''}
      <div class="profile-info" onclick="window.location.href='/verifier/?pubkey=${verification.pubkey}'">
        <div>${getProfileDisplayName(profile, verification.pubkey)}</div>
        ${profile.nip05 ? `<div class="profile-nip05">${profile.nip05}</div>` : ''}
      </div>
    </div>
  ` : getProfileDisplayName(null, verification.pubkey);

  /* -------------------- Based on -------------------- */
  if (basedOn) {
    const basedOnProfile = await getNostrProfile(basedOn.split(':')[1]);
    document.getElementById('based-on-attempt-by').innerHTML = basedOnProfile ? `
      <div class="profile-card">
        ${basedOnProfile.image ? `<img src="${basedOnProfile.image}" class="profile-image" onclick="window.location.href='/verifier/?pubkey=${basedOn.split(':')[1]}'" onerror="this.style.display='none'"/>` : ''}
        <div class="profile-info" onclick="window.location.href='/verifier/?pubkey=${basedOn.split(':')[1]}'">
          <div>${getProfileDisplayName(basedOnProfile, basedOn.split(':')[1])}</div>
          ${basedOnProfile.nip05 ? `<div class="profile-nip05">${basedOnProfile.nip05}</div>` : ''}
        </div>
      </div>
    ` : getProfileDisplayName(null, basedOn.split(':')[1]);
  }

  /* -------------------- Zap -------------------- */
  let zapsHTML = '';
  const zapReceipts = [];

  subscribeToZapReceipts(verification, null, async (zapReceiptEvent) => {
    if (zapReceiptEvent) {
      const zapReceiptInvoice = zapReceiptEvent.tagValue("bolt11");
      const descriptionJSON = zapReceiptEvent.tagValue("description");
      const description = JSON.parse(descriptionJSON);
      const content = description.content;
      const zapRequest = zapReceiptEvent.zapRequest;
      const zapAmount = zapRequest.amount / 1000;
      const zapperProfile = await getNostrProfile(description.pubkey);

      zapReceipts.push({
        zapAmount,
        zapReceiptInvoice,
        content,
        zapperProfile,
        zapperPubkey: description.pubkey,
        created_at: zapReceiptEvent.created_at
      });

      let zapTotalAmount = 0;

      zapReceipts.sort((a, b) => b.zapAmount - a.zapAmount).forEach((zap) => {
        zapTotalAmount += zap.zapAmount;
        const npub = getNpubFromPubkey(zap.zapperPubkey);
        zapsHTML += `
          <div class="profile-card" style="margin-left: 15px; font-size: 14px; margin-bottom: 13px;">
            ${zap.zapperProfile ? `${zap.zapperProfile.image ? `
              <img src="${zap.zapperProfile.image}" class="profile-image"
                  title="${getProfileDisplayName(zap.zapperProfile, zap.zapperPubkey)} - ${zap.zapperProfile.nip05 ?? ''} - Click to open in Njump.me"
                  onclick="window.open('https://njump.me/${npub}', '_blank')"
                  onerror="this.style.display='none'"
              />` : ''}` :
              `<span onclick="window.open('https://njump.me/${npub}', '_blank')" style="cursor: pointer; margin-top: 14px; margin-bottom: 14px;" title="${zap.zapperPubkey} - Click to open in Njump.me">${zap.zapperPubkey.slice(0, 3)}...${zap.zapperPubkey.slice(-2)}</span>`}
            <div>
              ${formatZapAmount(zap.zapAmount)} sats
              <br>
              Zapped by ${getProfileDisplayName(zap.zapperProfile, zap.zapperPubkey)} on ${formatDate(zap.created_at, true)}
              ${zap.content ? `<br>Message: ${zap.content}` : ''}
            </div>
          </div>`;
      });

      const zapsElement = document.getElementById('zaps');
      zapsElement.style.display = 'block';
      zapsElement.innerHTML = `<p><strong>Zaps received for this verification (${formatZapAmount(zapTotalAmount)} sats):</strong> ${zapsHTML}</p>`;
      zapsHTML = '';
    }
  });

  /* -------------------- Endorsements -------------------- */
  // Wait in a loop until endorsements.loaded is true
  while (!endorsements.loaded) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  const endorsementsForThisVerification = endorsements[verification.id];

  if (endorsementsForThisVerification && endorsementsForThisVerification.length > 0) {
    let endorsementsHTML = '';

    endorsementsForThisVerification.sort((a, b) => b.created_at - a.created_at);

    for (const endorsement of endorsementsForThisVerification) {
      const validity = getFirstTagValue(endorsement, 'validity');
      const endorserProfile = await getNostrProfile(endorsement.pubkey);
      const endorserNpub = getNpubFromPubkey(endorsement.pubkey) ?? endorsement.pubkey;
      endorsementsHTML += `
        <div class="profile-card" style="margin-top: 5px; margin-left: 15px;">
          ${endorserProfile ? `${endorserProfile.image ? `
            <img src="${endorserProfile.image}" class="profile-image"
                title="${getProfileDisplayName(endorserProfile, endorsement.pubkey)} - ${endorserProfile.nip05 ?? ''} - Click to open in Njump.me"
                onclick="window.open('https://njump.me/${endorserNpub}', '_blank')"
                onerror="this.style.display='none'"
            />` : ''}` :
            `<span onclick="window.open('https://njump.me/${endorserNpub}', '_blank')" style="cursor: pointer; margin-top: 14px; margin-bottom: 14px;" title="${endorserNpub} - Click to open in Njump.me">${endorsement.pubkey.slice(0, 3)}...${endorsement.pubkey.slice(-2)}</span>`}
            ${validity === 'valid' ? 'Positive ✅' : 'Negative ❌'} (${formatCommentDate(endorsement.created_at)})
        </div>`;
    }
    const endorsementsElement = document.getElementById('endorsements');
    endorsementsElement.style.display = 'block';
    endorsementsElement.innerHTML = `<p><strong>Endorsements:</strong> ${endorsementsHTML}</p>`;
  }

  const closeModalAction = () => {
    modal.style.display = 'none';
    if (modalBackdrop) {
      modalBackdrop.style.display = 'none';
    }
    window.currentVerification = null;
    window.removeEventListener('click', handleClick);
    window.removeEventListener('keydown', handleKeyDown);
    document.body.classList.remove("modal-open");
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

  renderNostrButton({
    container: "#verificationActionButtons",
    verificationId: verification.id
  });

  const deleteVerificationLink = content.querySelector('#deleteVerificationLink');
  if (deleteVerificationLink) {
    deleteVerificationLink.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        if (isDraft) {
          await window.deleteDraftVerification(verification.id);
        } else {
          await window.deletePublishedVerification(verification.id);
        }
      } catch (err) {
        showToast((err && err.message) || String(err), 'error');
      }
    });
  }

  let shareMessage = "Check out this verification!";
  if (verification.content.includes('i')) {
    const appId = getFirstTagValue(verification, 'i');
    const version = getFirstTagValue(verification, 'version');
    const platform = getFirstTagValue(verification, 'platform');

    const wallet = window.wallets.find(w => w.appId === appId);
    const walletTitle = wallet ? wallet.title : appId;

    const walletDescriptionToken = `${walletTitle} v${version} (${platform})`;

    if (isMine) {
      if (status === 'reproducible') {
        shareMessage = `🚀 Successfully reproduced and verified ${walletDescriptionToken} from source!`;
      } else {
        shareMessage = `🚨 Failed to reproduce and verify ${walletDescriptionToken} from source!`;
      }
    } else {
      shareMessage = `👀 Check out this ${walletDescriptionToken} verification!`;
    }
    shareMessage += `\n${status === 'reproducible' ? '✅' : '❌'} The binary tested ${status === 'reproducible' ? "matches" : "doesn't match"} the one built from source.`;
    shareMessage += `\n🔍 See the full verification here:`;
  }

  renderShareButton({
    container: "#shareButtonContainer",
    defaultMessage: shareMessage,
    showRawButtons: false
  });
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
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
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
  const copyButton = document.getElementById('previewCopyButton');

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

    // Set copy button action
    copyButton.onclick = function() {
      navigator.clipboard.writeText(attachmentData.content).then(() => {
        // Change icon to checkmark temporarily
        const originalIcon = copyButton.textContent;
        copyButton.textContent = '✓';
        copyButton.style.color = '#4CAF50';

        showToast('Copied to clipboard!', 'success');

        // Reset icon after 1.5 seconds
        setTimeout(() => {
          copyButton.textContent = originalIcon;
          copyButton.style.color = '#555';
        }, 1500);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
        showToast('Failed to copy to clipboard', 'error');
      });
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
