import { assetBundleRegistrationKind } from "./nostr-constants.mjs";
import {
  assetRegistrationKinds,
  getAssetFileEntries,
  getAssetBundleDedupKey,
} from "./asset-utils.mjs";

const findBundleAssetInGroup = group =>
  group.items.find(item => item.kind === assetBundleRegistrationKind);

export function findMultiFileItemInGroup(group) {
  return findBundleAssetInGroup(group) ||
    group.items.find(item => getAssetFileEntries(item).length > 1);
}

function getItemMergeKey(item) {
  return getAssetFileEntries(item).length > 1 ? getAssetBundleDedupKey(item) : null;
}

// A row's lookup hashes come from its multi-file/bundle asset, never from whichever item happens
// to be newest. mergeGroupItems sorts items newest-first, so a single-file verification landing at
// items[0] would otherwise narrow the row to one hash and hide verifications - including warnings -
// attached to the bundle's other files.
export function getRowLookupHashes(group, fallbackHash) {
  const multiFileItem = findMultiFileItemInGroup(group);
  const bundleHashes = multiFileItem
    ? getAssetFileEntries(multiFileItem).map(entry => entry.hash).filter(Boolean)
    : [];
  if (bundleHashes.length > 1) {
    return bundleHashes;
  }
  const firstItemHashes = getAssetFileEntries(group.items[0]).map(entry => entry.hash);
  return [fallbackHash || firstItemHashes[0]].filter(Boolean);
}

export const HASH_HINT_REPRODUCIBLE_ELSEWHERE = 'reproducible_elsewhere';
export const HASH_HINT_NOT_REPRODUCIBLE_ELSEWHERE = 'not_reproducible_elsewhere';
export const HASH_HINT_UNATTEMPTED = 'unattempted';
export const HASH_HINT_REPRODUCIBLE_TOOLTIP =
  'Reproducible in a verification for another set of files';
export const HASH_HINT_NOT_REPRODUCIBLE_TOOLTIP =
  'Not reproducible in a verification for another set of files';
export const HASH_HINT_UNATTEMPTED_TOOLTIP = 'No build reproducibility result for this file yet';

function getVerificationStatus(event) {
  return event.tags?.find(tag => tag[0] === 'status')?.[1] || '';
}

/**
 * hash -> { reproducible, notReproducible } over every published verification, built once per
 * paint so each row is a lookup instead of a scan of all verifications. Only these two verdicts
 * say something about a file; ftbfs, nosource etc. leave it without a result.
 */
export function buildHashVerdictIndex(verificationsMap) {
  const index = new Map();
  const seen = new Set();
  for (const list of verificationsMap?.values() || []) {
    for (const verification of list || []) {
      if (!verification?.id || seen.has(verification.id)) {
        continue;
      }
      seen.add(verification.id);
      const status = getVerificationStatus(verification);
      if (status !== 'reproducible' && status !== 'not_reproducible') {
        continue;
      }
      for (const entry of getAssetFileEntries(verification)) {
        if (!entry.hash) {
          continue;
        }
        let verdicts = index.get(entry.hash);
        if (!verdicts) {
          verdicts = { reproducible: false, notReproducible: false };
          index.set(entry.hash, verdicts);
        }
        verdicts[status === 'reproducible' ? 'reproducible' : 'notReproducible'] = true;
      }
    }
  }
  return index;
}

function getHashHintKind(verdicts) {
  if (!verdicts) {
    return HASH_HINT_UNATTEMPTED;
  }
  // A reproducible set vouches for every file in it; a not_reproducible set only says that some
  // file in it differed. So a file that reproduced anywhere outranks a failure elsewhere.
  return verdicts.reproducible
    ? HASH_HINT_REPRODUCIBLE_ELSEWHERE
    : HASH_HINT_NOT_REPRODUCIBLE_ELSEWHERE;
}

/**
 * Icons for an unverified row whose files overlap another hash set.
 * Only call this for rows without a matching verification of their own. Returns a map only when
 * at least one file has a verdict elsewhere; files without one on that same row get a question mark.
 */
export function getUnverifiedRowHashHints(rowHashes, hashVerdictIndex) {
  const rowUnique = [...new Set((rowHashes || []).filter(Boolean))];
  const hints = new Map();
  for (const hash of rowUnique) {
    hints.set(hash, getHashHintKind(hashVerdictIndex?.get(hash)));
  }
  const hasVerdictElsewhere = [...hints.values()].some(kind => kind !== HASH_HINT_UNATTEMPTED);
  return hasVerdictElsewhere ? hints : new Map();
}

/** True when an attestation belongs to this row's artifact, not merely shares a file hash. */
export function attestationMatchesRowHashes(attestation, rowHashes) {
  const listed = [...new Set(
    getAssetFileEntries(attestation).map(entry => entry.hash).filter(Boolean),
  )];
  const rowUnique = [...new Set((rowHashes || []).filter(Boolean))];
  if (listed.length === 0 || rowUnique.length === 0) {
    return false;
  }
  if (listed.length === 1) {
    return rowUnique.includes(listed[0]);
  }
  if (listed.length !== rowUnique.length) {
    return false;
  }
  const rowSet = new Set(rowUnique);
  return listed.every(hash => rowSet.has(hash));
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

export function mergeBundleAssetRows(groups, requestedSha256) {
  const mergedBundles = new Map();
  const legacyGroups = [];

  const addItem = (mergeKey, item, fallbackSha256, multiFileItem) => {
    const existing = mergedBundles.get(mergeKey);
    if (existing) {
      mergeGroupItems(existing, { items: [item] });
      existing.sha256 = pickCanonicalRowSha256(existing, multiFileItem, requestedSha256);
      return;
    }
    mergedBundles.set(mergeKey, {
      sha256: pickCanonicalRowSha256(
        { sha256: fallbackSha256, items: [item] },
        multiFileItem,
        requestedSha256,
      ),
      items: [item],
    });
  };

  for (const group of groups) {
    const itemsByMergeKey = new Map();
    const singleFileItems = [];

    for (const item of group.items) {
      const mergeKey = getItemMergeKey(item);
      if (!mergeKey) {
        singleFileItems.push(item);
        continue;
      }
      const bucket = itemsByMergeKey.get(mergeKey) || [];
      bucket.push(item);
      itemsByMergeKey.set(mergeKey, bucket);
    }

    if (itemsByMergeKey.size === 0) {
      legacyGroups.push(group);
      continue;
    }

    for (const [mergeKey, items] of itemsByMergeKey) {
      const multiFileItem = items[0];
      for (const item of items) {
        addItem(mergeKey, item, group.sha256, multiFileItem);
      }
    }

    // Single-file events stay on every overlapping bundle in this group that contains that hash.
    for (const item of singleFileItems) {
      const hash = getAssetFileEntries(item)[0]?.hash || group.sha256;
      for (const [mergeKey, items] of itemsByMergeKey) {
        const bundleHashes = getAssetFileEntries(items[0]).map(entry => entry.hash);
        if (hash && bundleHashes.includes(hash)) {
          addItem(mergeKey, item, group.sha256, items[0]);
        }
      }
    }
  }

  return [...mergedBundles.values(), ...legacyGroups];
}

export function fingerprintAllAssetInformation(info) {
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

let assetsTableBlossomFilterHook = null;
let assetsTableBlossomObserver = null;

const BLOSSOM_CHECK_CONCURRENCY = 6;
let blossomChecksInFlight = 0;
const blossomCheckWaitQueue = [];

function runBlossomCheckWithConcurrencyLimit(checkFn) {
  return new Promise((resolve, reject) => {
    const run = () => {
      blossomChecksInFlight++;
      Promise.resolve()
        .then(checkFn)
        .then(resolve, reject)
        .finally(() => {
          blossomChecksInFlight--;
          const next = blossomCheckWaitQueue.shift();
          if (next) {
            next();
          }
        });
    };

    if (blossomChecksInFlight < BLOSSOM_CHECK_CONCURRENCY) {
      run();
    } else {
      blossomCheckWaitQueue.push(run);
    }
  });
}

export function disconnectBlossomObserver() {
  if (assetsTableBlossomObserver) {
    assetsTableBlossomObserver.disconnect();
    assetsTableBlossomObserver = null;
  }
  assetsTableBlossomFilterHook = null;
}

function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

function updateTableVisibilityCore() {
  const searchInput = document.getElementById('assetSearchInput');
  const showLatestCheckbox = document.getElementById('showLatestVersionOnly');
  const showOnlyNoVerificationsCheckbox = document.getElementById('showOnlyNoVerifications');
  const hideDraftsCheckbox = document.getElementById('hideDrafts');

  const searchTerm = (searchInput?.value || '').toLowerCase();
  const showLatestOnly = showLatestCheckbox?.checked ?? false;
  const showOnlyNoVerifications = showOnlyNoVerificationsCheckbox?.checked ?? false;

  const latestVersions = new Map();
  const assetsTableElement = document.getElementById('assetsTable');
  if (!assetsTableElement) {
    return;
  }

  const rows = Array.from(assetsTableElement.querySelectorAll('tbody tr:not(.show-more-row)'));

  rows.forEach(row => {
    if (!row.classList.contains('initially-hidden')) {
      row.style.setProperty('display', 'table-row');
    }
  });

  rows.forEach(row => {
    const walletName = (row.dataset.searchText || row.querySelector('td:first-child')?.textContent || '').toLowerCase();
    const sha256Hash = (row.dataset.sha256 || '').toLowerCase();
    const hasVerifications = row.dataset.hasVerifications === 'true';
    const identifier = row.dataset.identifier || '';

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

    if (shouldShow && searchTerm) {
      shouldShow = walletName.includes(searchTerm) || sha256Hash.includes(searchTerm);
    }

    row.style.setProperty('display', shouldShow ? 'table-row' : 'none');
  });

  const userPubkey = window.userPubkey;
  const hideDraftsChecked = hideDraftsCheckbox?.checked ?? false;

  document.querySelectorAll('.draft-attestation').forEach(attestation => {
    let draftManagementEnabled = true;

    if (attestation.tagName === 'TR' && attestation.style.display === 'none') {
      draftManagementEnabled = false;
    }

    if (draftManagementEnabled) {
      if (hideDraftsChecked && userPubkey && !attestation.getAttribute('data-pubkey_verifiers')?.includes(userPubkey)) {
        attestation.style.display = 'none';
      } else {
        attestation.style.display = attestation.tagName === 'TR' ? 'table-row' : 'block';
      }
    }
  });
}

const debouncedUpdateTableVisibilityCore = debounce(updateTableVisibilityCore, 150);

export function updateTableVisibility() {
  updateTableVisibilityCore();
  if (typeof assetsTableBlossomFilterHook === 'function') {
    assetsTableBlossomFilterHook();
  }
}

export function updateTableVisibilityDebounced() {
  debouncedUpdateTableVisibilityCore();
  if (typeof assetsTableBlossomFilterHook === 'function') {
    assetsTableBlossomFilterHook();
  }
}

export function setupBlossomDownloadObserverForTable(tableForObserver, {
  checkFileExistsInBlossom,
  openBlossomBundleDownloadModal,
  downloadBlossomFileWithDownloadIcon,
}) {
  disconnectBlossomObserver();

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

            const checkResults = await Promise.all(
              hashesToCheck.map(h =>
                runBlossomCheckWithConcurrencyLimit(() => checkFileExistsInBlossom(h))
              )
            );
            const availableHashes = hashesToCheck.filter((_, i) => checkResults[i]);

            if (availableHashes.length > 0) {
              downloadIcon.style.display = 'inline-flex';
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
            observedHashes.delete(hash);
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

  const tableRows = tableForObserver.querySelectorAll('tbody tr:not(.show-more-row)');
  tableRows.forEach(row => {
    assetsTableBlossomObserver.observe(row);
  });

  function updateObserverForVisibleRows() {
    const visibleRows = Array.from(tableForObserver.querySelectorAll('tbody tr:not([style*="display: none"]):not(.show-more-row)'));
    visibleRows.forEach(row => {
      assetsTableBlossomObserver.unobserve(row);
      assetsTableBlossomObserver.observe(row);
    });
  }

  assetsTableBlossomFilterHook = () => {
    updateObserverForVisibleRows();
  };

  updateObserverForVisibleRows();
}

export function applyDraftRowMetadataToTable(tableEl) {
  const rows = tableEl.querySelectorAll('tbody tr:not(.show-more-row)');
  rows.forEach(row => {
    const verifications = Array.from(row.querySelectorAll('.attestation-link'));
    const pubkeyVerifications = [];
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
