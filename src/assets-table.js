import { showIssueTrackerHtmlWidget } from "./assets-table-utils.js";
import { paintMainAssetsTable } from "./assets-table-paint.js";
import {
  fingerprintAllAssetInformation,
  updateTableVisibility,
  updateTableVisibilityDebounced,
  applyDraftRowMetadataToTable,
  disconnectBlossomObserver,
  setupBlossomDownloadObserverForTable,
} from "./assets-table-filters.js";
import {
  resetAttachmentState,
  loadAndStoreAttachments,
  buildAttachmentVerificationIndex,
  renderAttachmentsTable,
  registerAttachmentHandlers,
} from "./assets-table-attachments.js";
import {
  resetEndorsementsState,
  setPendingEndorsementIds,
} from "./assets-table-endorsements.js";
import { renderProfilePictures } from "./assets-table-profiles.js";
import { registerShowVerificationModal } from "./assets-table-modal.js";
import {
  setAssetTableResponse,
} from "./assets-table-state.js";
import {
  getVerificationIdFromHash,
  tryOpenHashVerification,
  setupEarlyHashVerificationOpen,
  findCachedGlobalAssetInfo,
  scheduleFinalHashVerificationOpen,
} from "./assets-table-hash.js";

registerAttachmentHandlers();
registerShowVerificationModal();

function ensureVerificationModal() {
  if (!document.getElementById('verificationModal')) {
    const verificationModalDiv = document.createElement('div');
    verificationModalDiv.id = 'verificationModal';
    verificationModalDiv.innerHTML = `
      <span id="closeModal">&times;</span>
      <div id="verificationModalToolbar"></div>
      <div id="verificationContent"></div>`;
    document.body.appendChild(verificationModalDiv);
  } else if (!document.getElementById('verificationModalToolbar')) {
    const modal = document.getElementById('verificationModal');
    const content = document.getElementById('verificationContent');
    const toolbar = document.createElement('div');
    toolbar.id = 'verificationModalToolbar';
    modal.insertBefore(toolbar, content);
  }
  if (!document.getElementById('verificationModalBackdrop')) {
    const verificationModalBackdropDiv = document.createElement('div');
    verificationModalBackdropDiv.id = 'verificationModalBackdrop';
    document.body.appendChild(verificationModalBackdropDiv);
  }
}

function ensureBlossomModals() {
  if (!document.getElementById('blossomWarningModal')) {
    document.body.insertAdjacentHTML('beforeend', `
    <div id="blossomWarningModal" style="display: none; position: fixed; z-index: 1001; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.6);">
      <div style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 80%; max-width: 400px; text-align: center; border-radius: 8px; color: black;">
        <span id="blossomCloseModalButton" style="color: #aaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer;">&times;</span>
        <p style="margin-top: 30px; margin-bottom: 20px;">This file was uploaded by a third party. We haven't verified its content, so please be careful before running it.</p>
        <button id="blossomConfirmDownloadButton" class="btn btn-success" style="padding: 10px 20px;">Download</button>
      </div>
    </div>`);
  }

  if (!document.getElementById('blossomBundleModal')) {
    document.body.insertAdjacentHTML('beforeend', `
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
    </div>`);
  }

  if (!document.getElementById('attachmentPreviewModal')) {
    document.body.insertAdjacentHTML('beforeend', `
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
    </div>`);
  }
}

function setupSearchUI(htmlElementId, {
  enableSearch,
  enableDraftsFilter,
  enableAppPageSearch,
}) {
  const host = document.getElementById(htmlElementId);
  if (!host || host.querySelector('.assets-search-container')) {
    return;
  }

  const searchContainer = document.createElement('div');
  searchContainer.className = 'assets-search-container';
  searchContainer.style.display = enableSearch || enableDraftsFilter || enableAppPageSearch ? 'block' : 'none';
  searchContainer.innerHTML = `
    <div class="assets-search-toolbar">
      <input
        type="text"
        id="assetSearchInput"
        class="assets-search-input"
        placeholder="Search by ${enableAppPageSearch ? 'version, description or hash' : 'wallet name or hash'}..."
        style="display: ${enableSearch || enableAppPageSearch ? 'block' : 'none'};"
      >
      <div class="assets-search-filters" style="display: ${enableSearch ? 'flex' : 'none'};">
        <div class="checkbox-container assets-search-checkboxes">
          <label class="assets-search-checkbox-label">
            <input type="checkbox" id="showLatestVersionOnly" ${enableSearch ? 'checked' : ''}>
            <span>Show latest version only</span>
          </label>
          <label class="assets-search-checkbox-label">
            <input type="checkbox" id="showOnlyNoVerifications">
            <span>Show only untested assets</span>
          </label>
        </div>
      </div>
      <label class="assets-search-checkbox-label" style="display: ${enableDraftsFilter ? 'flex' : 'none'};">
        <input type="checkbox" id="hideDrafts" ${enableDraftsFilter ? 'checked' : ''}>
        <span>Hide others' drafts</span>
      </label>
    </div>`;

  host.appendChild(searchContainer);

  if (enableSearch || enableAppPageSearch) {
    document.getElementById('assetSearchInput').addEventListener('input', updateTableVisibilityDebounced);
    document.getElementById('showLatestVersionOnly').addEventListener('change', updateTableVisibility);
    document.getElementById('showOnlyNoVerifications').addEventListener('change', updateTableVisibility);
  }
  if (enableDraftsFilter || enableAppPageSearch) {
    document.getElementById('hideDrafts').addEventListener('change', updateTableVisibility);
  }
}

function createBlossomDownloadHelpers() {
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

  return { downloadBlossomFileWithDownloadIcon, openBlossomBundleDownloadModal };
}

function scheduleIssueTrackerWidget(verifications, htmlElementId) {
  void showIssueTrackerHtmlWidget(verifications, htmlElementId).then(() => {
    const host = document.getElementById(htmlElementId);
    const issueEl = host?.querySelector('.issue-tracker-container');
    const searchEl = host?.querySelector('.assets-search-container');
    if (issueEl && searchEl) {
      host.insertBefore(issueEl, searchEl);
    }
  });
}

function removeAssetsTableDynamicContent(htmlElementId) {
  disconnectBlossomObserver();
  const host = document.getElementById(htmlElementId);
  if (!host) {
    return;
  }
  host.querySelectorAll('.issue-tracker-container').forEach(el => el.remove());
  host.querySelector('.assets-table-frame')?.remove();
  host.querySelector('.assets-table-scroll')?.remove();
  host.querySelectorAll('.assets-table-attachments-wrap').forEach(el => el.remove());
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
  months,
  filterAppIds = null,
  showSeen = false,
}) {
  let hasAssets = false;
  let cachePaintFingerprint = null;
  let cachePaintResult = null;

  const verificationIdFromHash = getVerificationIdFromHash();

  resetAttachmentState();
  resetEndorsementsState();

  const userPubkeyPromise = getUserPubkey()
    .then((pubkey) => {
      window.userPubkey = pubkey;
      return pubkey;
    })
    .catch((e) => {
      console.error("Error getting user pubkey:", e);
      window.userPubkey = null;
      return null;
    });

  if (!verificationIdFromHash) {
    await userPubkeyPromise;
  } else {
    void userPubkeyPromise;
  }

  const host = document.getElementById(htmlElementId);
  if (host && hideConfig?.wallet) {
    host.classList.add('assets-table-widget');
  }

  ensureVerificationModal();
  ensureBlossomModals();
  setupSearchUI(htmlElementId, { enableSearch, enableDraftsFilter, enableAppPageSearch });

  const blossomHelpers = createBlossomDownloadHelpers();

  const effectiveAppId = filterAppIds || appId;

  if (verificationIdFromHash) {
    setupEarlyHashVerificationOpen(effectiveAppId, verificationIdFromHash, ensureVerificationModal);
  }

  const paintOptions = {
    htmlElementId,
    sha256,
    sortByVersion,
    appPlatform,
    hideConfig,
    showOnlyRows,
    showOnlyRegisteredAssets,
    showProfilePictures,
    showAttachmentsTable,
    pubkey,
    showSeen,
  };

  function runPaint(assetInfo) {
    return paintMainAssetsTable({ assetInfo, ...paintOptions });
  }

  const profilePicturesStarted = new Set();

  function maybeRenderProfilePictures(pubkeys) {
    if (!showProfilePictures || !pubkeys?.length) {
      return;
    }
    const newPubkeys = pubkeys.filter(pubkey => !profilePicturesStarted.has(pubkey));
    newPubkeys.forEach(pubkey => profilePicturesStarted.add(pubkey));
    if (newPubkeys.length > 0) {
      renderProfilePictures(newPubkeys);
    }
  }

  function afterTablePaint(pr) {
    setPendingEndorsementIds(pr.endorsementEventIDs);
    applyDraftRowMetadataToTable(pr.table);
    maybeRenderProfilePictures(pr.profilePubkeys);
    void updateTableVisibility();
    setupBlossomDownloadObserverForTable(pr.table, {
      checkFileExistsInBlossom,
      openBlossomBundleDownloadModal: blossomHelpers.openBlossomBundleDownloadModal,
      downloadBlossomFileWithDownloadIcon: blossomHelpers.downloadBlossomFileWithDownloadIcon,
    });
  }

  function handleCachedAssetData(cachedData) {
    removeAssetsTableDynamicContent(htmlElementId);
    const pr = runPaint(cachedData);
    hasAssets = pr.hasAssets;
    cachePaintFingerprint = fingerprintAllAssetInformation(cachedData);
    cachePaintResult = pr;
    afterTablePaint(pr);
    tryOpenHashVerification(cachedData, false, effectiveAppId, verificationIdFromHash);
    if (typeof tableLoadedCallback === 'function') {
      tableLoadedCallback();
    }
  }

  const globalCachedAssetInfo = findCachedGlobalAssetInfo(effectiveAppId, verificationIdFromHash);
  if (globalCachedAssetInfo) {
    handleCachedAssetData(globalCachedAssetInfo);
  }

  const response = await getAllAssetInformation({
    pubkey,
    appId: effectiveAppId,
    sha256,
    getDrafts,
    months,
    onCachedDataLoaded: (cachedData) => {
      if (globalCachedAssetInfo && fingerprintAllAssetInformation(cachedData) === cachePaintFingerprint) {
        return;
      }
      handleCachedAssetData(cachedData);
    }
  });

  setAssetTableResponse(response);

  let skipRepaint = cachePaintFingerprint !== null &&
    fingerprintAllAssetInformation(response) === cachePaintFingerprint;
  if (skipRepaint && !document.getElementById('assetsTable')) {
    skipRepaint = false;
  }

  if (!skipRepaint) {
    removeAssetsTableDynamicContent(htmlElementId);
  }

  let paintResult;
  let table;

  if (skipRepaint) {
    paintResult = cachePaintResult;
    hasAssets = paintResult.hasAssets;
    table = document.getElementById('assetsTable');
  } else {
    paintResult = runPaint(response);
    hasAssets = paintResult.hasAssets;
    table = paintResult.table;
  }

  const { profilePubkeys } = paintResult;
  const hasVerifications = paintResult.hasVerifications;

  applyDraftRowMetadataToTable(table);

  if (!skipRepaint && typeof tableLoadedCallback === 'function') {
    tableLoadedCallback();
  }

  if (showIssueTracker) {
    scheduleIssueTrackerWidget(response.verifications, htmlElementId);
  }

  setPendingEndorsementIds(paintResult.endorsementEventIDs);
  maybeRenderProfilePictures(profilePubkeys);
  tryOpenHashVerification(response, false, effectiveAppId, verificationIdFromHash);

  if (showAttachmentsTable) {
    const { sortedItems, attachmentEventIDs, walletByAppId } = paintResult;

    let attachments = new Map();
    if (sortedItems.length > 0 && attachmentEventIDs.length > 0) {
      attachments = await loadAndStoreAttachments(attachmentEventIDs);
    } else {
      await loadAndStoreAttachments([]);
    }

    const profilePubkeySet = new Set(profilePubkeys);
    const attachmentVerificationIndex = buildAttachmentVerificationIndex(sortedItems);

    renderAttachmentsTable({
      attachments,
      sortedItems,
      attachmentVerificationIndex,
      walletByAppId,
      htmlElementId,
      showAttachmentsTable,
      profilePubkeySet,
      showProfilePictures,
    });

    maybeRenderProfilePictures([...profilePubkeySet]);
  }

  updateTableVisibility();

  setupBlossomDownloadObserverForTable(table, {
    checkFileExistsInBlossom,
    openBlossomBundleDownloadModal: blossomHelpers.openBlossomBundleDownloadModal,
    downloadBlossomFileWithDownloadIcon: blossomHelpers.downloadBlossomFileWithDownloadIcon,
  });

  scheduleFinalHashVerificationOpen(response, effectiveAppId, verificationIdFromHash);

  return {
    hasAssets,
    hasVerifications,
    info: response
  };
};
