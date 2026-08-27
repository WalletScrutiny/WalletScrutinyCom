import {
  assetRegistrationKinds,
  getAssetFileEntries,
  pickScriptBinaryEntry,
} from "./asset-utils.mjs";
import { assetBundleRegistrationKind, verificationKind, verificationDraftKind } from "./nostr-constants.mjs";
import { formatDate } from "./format-utils.mjs";
import { getStatusText } from "./assets-table-utils.mjs";
import { getFirstTagValue } from "./verifications_common.mjs";
import { mergeBundleAssetRows, getRowLookupHashes } from "./assets-table-filters.mjs";
import { setAssetTableResponse } from "./assets-table-state.mjs";
import { el, htmlOf, isSha256Hex } from "./html-utils.mjs";

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

function getAssetsTableColumnCount(hideConfig, showSeen = false) {
  let count = 1; // Wallet or Version
  count += 1; // Description
  if (!hideConfig?.sha256) {
    count += 1; // Hashes
  }
  count += 1; // Binary
  count += 1; // Verifications
  if (showSeen) {
    count += 1; // Seen
  }
  return count;
}

const getPrimaryFileName = event => {
  const primaryFileTag = event.tags?.find(tag => tag[0] === 'file');
  if (primaryFileTag?.[1]) {
    return primaryFileTag[1];
  }
  return getFirstTagValue(event, 'file-name');
};

const BLOSSOM_DOWNLOAD_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>`;

const HASH_COPY_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;

function hexOrEmpty(value) {
  return isSha256Hex(value) ? value : '';
}

function getFileAttachmentIds(item) {
  if (typeof window.getFileAttachmentIDsForVerificationEvent === 'function') {
    return window.getFileAttachmentIDsForVerificationEvent(item);
  }
  return (item.tags || [])
    .filter(tag => tag[0] === 'file-attachment' && isSha256Hex(tag[1]))
    .map(tag => tag[1]);
}

function createHashCopyButton(hash, title = 'Copy hash to clipboard') {
  return el('button', {
    type: 'button',
    className: 'hash-copy-btn js-copy-hash',
    dataset: { hash: hexOrEmpty(hash) },
    title,
    'aria-label': title,
  }, el('span', { className: 'hash-copy-btn__icon', 'aria-hidden': 'true', html: HASH_COPY_ICON_SVG }));
}

function createCopyAllHashesButton(allHashes) {
  if (allHashes.length <= 6) {
    return null;
  }
  const allHashesText = allHashes.map(entry => entry[1]).filter(isSha256Hex).join('\n');
  const count = allHashes.length;
  const title = `Copy all ${count} hashes to clipboard`;
  return el('div', { className: 'hash-copy-all-wrap' },
    el('button', {
      type: 'button',
      className: 'hash-copy-all-btn js-copy-hash',
      dataset: { hash: allHashesText },
      title,
      'aria-label': title,
    },
      el('span', { className: 'hash-copy-all-btn__icon', 'aria-hidden': 'true', html: HASH_COPY_ICON_SVG }),
      el('span', {}, `Copy all (${count})`),
    ),
  );
}

function fillHashCell(cell, sha256Hashes, allHashes = sha256Hashes) {
  if (sha256Hashes.length === 0) {
    cell.textContent = '-';
    return;
  }
  for (const hash of sha256Hashes) {
    const label = hash[2] ? `${hash[1]} (${hash[2]})` : hash[1];
    cell.appendChild(
      el('div', { className: 'hash-row' },
        el('span', { className: 'hash-display', title: hash[1] || '' }, label),
        createHashCopyButton(hash[1]),
      ),
    );
  }
  if (allHashes.length > 6) {
    cell.appendChild(el('div', { className: 'hash-list-more' }, '...'));
    const copyAll = createCopyAllHashesButton(allHashes);
    if (copyAll) {
      cell.appendChild(copyAll);
    }
  }
}

function parseItemDescription(binary) {
  if (isAssetRegistrationEvent(binary)) {
    return binary.content;
  }
  try {
    return JSON.parse(binary.content).description;
  } catch {
    return '';
  }
}

function getVerificationStatusModifier(status) {
  switch (status) {
    case 'reproducible':
      return 'reproducible';
    case 'warning':
    case 'notag':
      return 'warning';
    case 'not_reproducible':
    case 'ftbfs':
    case 'nosource':
    case 'obfuscated':
    case 'spam':
      return 'negative';
    default:
      return 'neutral';
  }
}

export function createVerificationActionLink({ identifier, version, platform, label }) {
  const params = new URLSearchParams({
    appId: identifier ?? '',
    version: version ?? '',
    platform: platform ?? '',
  });
  return el('a', {
    href: `/new_verification/?${params.toString()}`,
    className: 'verification-action-link',
    rel: 'noopener noreferrer',
  }, label);
}

export function renderVerificationActionLink(options) {
  return htmlOf(createVerificationActionLink(options));
}

export function createBlossomDownloadButton({
  downloadHash,
  identifier,
  platform,
  version,
  sanitizedFileName,
  bundleFilesJson,
  downloadTitle,
  bundleFileCount,
}) {
  const ariaLabel = bundleFileCount > 1
    ? `Download ${bundleFileCount} files from Blossom`
    : 'Download from Blossom';

  const button = el('button', {
    type: 'button',
    id: isSha256Hex(downloadHash) ? `blossom-${downloadHash}` : undefined,
    className: 'blossom-download blossom-download-btn',
    style: { display: 'none' },
    title: downloadTitle,
    'aria-label': ariaLabel,
    dataset: {
      appid: identifier ?? '',
      platform: platform ?? '',
      version: version ?? '',
      filename: sanitizedFileName ?? '',
    },
  },
    el('span', { className: 'blossom-download-btn__icon', 'aria-hidden': 'true', html: BLOSSOM_DOWNLOAD_ICON_SVG }),
    bundleFileCount > 1
      ? el('span', { className: 'blossom-download-btn__badge' }, String(bundleFileCount))
      : null,
  );

  if (bundleFilesJson) {
    button.setAttribute('data-bundle-files', bundleFilesJson);
  }

  return button;
}

export function renderBlossomDownloadButton({
  downloadHash,
  identifier,
  platform,
  version,
  sanitizedFileName,
  bundleFilesAttr,
  downloadTitle,
  bundleFileCount,
}) {
  let bundleFilesJson;
  if (bundleFilesAttr) {
    const match = /data-bundle-files="([^"]*)"/.exec(bundleFilesAttr);
    bundleFilesJson = match?.[1];
  }
  return htmlOf(createBlossomDownloadButton({
    downloadHash,
    identifier,
    platform,
    version,
    sanitizedFileName,
    bundleFilesJson,
    downloadTitle,
    bundleFileCount,
  }));
}

export function createVerificationCard({ attestation, sha256HashKey, identifier, platform, isMyDraft }) {
  const status = getFirstTagValue(attestation, 'status');
  const attestationDate = formatDate(attestation.created_at);
  const statusModifier = getVerificationStatusModifier(status);
  const statusLabel = getStatusText(status, true);
  const pubkey = hexOrEmpty(attestation.pubkey);

  return el('div', {
    className: `verification-card attestation-link${isMyDraft ? ' verification-card--draft' : ''}`,
    role: 'button',
    tabindex: '0',
    dataset: {
      sha256Hash: hexOrEmpty(sha256HashKey),
      verificationId: hexOrEmpty(attestation.id),
      appId: identifier ?? '',
      platform: platform ?? '',
      pubkey_verifiers: pubkey,
    },
  },
    el('div', { className: 'verification-card__layout' },
      el('div', { className: `verification-card__avatar ${pubkey ? `profile-${pubkey}` : 'profile-unknown'}` }),
      el('div', { className: 'verification-card__body' },
        el('div', { className: 'verification-card__meta' },
          el('span', { className: `verification-status-pill verification-status-pill--${statusModifier}` },
            el('span', { className: 'verification-status-pill__dot', 'aria-hidden': 'true' }),
            el('span', { className: 'attestation-status' }, statusLabel),
          ),
          isMyDraft ? el('span', { className: 'verification-draft-badge' }, 'Draft') : null,
        ),
        el('time', { className: 'verification-card__date' }, attestationDate),
      ),
    ),
  );
}

export function renderVerificationCard(options) {
  return htmlOf(createVerificationCard(options));
}

// Single source of truth for which verifications represent a row: the latest published
// verification per verifier, plus every draft as its own entry. The cards and the warning badge
// both read this, so they cannot disagree about what is current.
export function selectCurrentRowVerifications(attestations) {
  const latestByKey = new Map();
  for (const attestation of attestations) {
    if (attestation.kind === verificationDraftKind) {
      latestByKey.set(`${attestation.pubkey}-draft-${attestation.id}`, attestation);
      continue;
    }
    const existing = latestByKey.get(attestation.pubkey);
    if (!existing || attestation.created_at > existing.created_at) {
      latestByKey.set(attestation.pubkey, attestation);
    }
  }
  return [...latestByKey.values()];
}

// Drafts never flag a row - an unpublished draft is not a public statement.
export function hasWarningVerification(currentVerifications) {
  return currentVerifications.some(attestation =>
    attestation.kind !== verificationDraftKind &&
    getFirstTagValue(attestation, 'status') === 'warning');
}

export function createVersionWarningBadge(currentVerifications) {
  if (!hasWarningVerification(currentVerifications)) {
    return null;
  }
  return el('span', {
    className: 'version-warning-badge',
    title: 'A verifier flagged a serious problem with this version. See the Warning verification on this row.',
  }, '⚠️ Warning');
}

export function renderVersionWarningBadge(currentVerifications) {
  const badge = createVersionWarningBadge(currentVerifications);
  return badge ? htmlOf(badge) : '';
}

/** Version + description fragments for tests and callers that still serialize to HTML. */
export function renderAssetVersionDescriptionHtml({ version, itemDescription, versionWarningBadge = '' }) {
  const versionHolder = el('div');
  versionHolder.appendChild(document.createTextNode(version ?? ''));
  if (versionWarningBadge) {
    if (typeof versionWarningBadge !== 'string') {
      versionHolder.appendChild(versionWarningBadge);
    } else if (versionWarningBadge) {
      const tmp = el('div', { html: versionWarningBadge });
      while (tmp.firstChild) {
        versionHolder.appendChild(tmp.firstChild);
      }
    }
  }

  const mobile = el('span', { className: 'asset-description-mobile' }, itemDescription ?? '');
  const descriptionCell = el('td', {
    className: 'asset-description hide-on-mobile',
    style: {
      maxWidth: '300px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'normal',
      wordWrap: 'break-word',
    },
  }, itemDescription ?? '');

  return {
    versionFragment: versionHolder.innerHTML,
    mobileDescription: htmlOf(mobile),
    descriptionCell: htmlOf(descriptionCell),
  };
}

export function createVerificationsCell({
  attestations,
  sha256HashKey,
  identifier,
  platform,
  version,
  hideButtons,
}) {
  const cell = el('div', { className: 'verification-cell' });

  if (!attestations.length) {
    cell.appendChild(
      el('div', { className: 'verification-empty' },
        el('span', { className: 'verification-empty__label' }, 'No verifications yet'),
      ),
    );
    if (!hideButtons) {
      cell.appendChild(createVerificationActionLink({
        identifier,
        version,
        platform,
        label: 'Create verification',
      }));
    }
    return cell;
  }

  const list = el('div', { className: 'verification-cell__list' });
  for (const attestation of attestations) {
    const isMine = attestation.pubkey === window.userPubkey;
    const isDraft = attestation.kind === verificationDraftKind;
    list.appendChild(createVerificationCard({
      attestation,
      sha256HashKey,
      identifier,
      platform,
      isMyDraft: isDraft && isMine,
    }));
  }
  cell.appendChild(list);

  if (!hideButtons) {
    cell.appendChild(createVerificationActionLink({
      identifier,
      version,
      platform,
      label: 'Create another verification',
    }));
  }
  return cell;
}

export function renderVerificationsCell(options) {
  return htmlOf(createVerificationsCell(options));
}

function appendVersionBlock(parent, { version, warningBadge, itemDescription, hashCellContent }) {
  parent.appendChild(document.createTextNode(version ?? ''));
  if (warningBadge) {
    parent.appendChild(document.createElement('br'));
    parent.appendChild(warningBadge);
  }
  const mobileWrap = el('span', { className: 'show-on-mobile' });
  mobileWrap.appendChild(document.createElement('br'));
  mobileWrap.appendChild(el('span', { className: 'asset-description-mobile' }, itemDescription ?? ''));
  if (hashCellContent) {
    mobileWrap.appendChild(hashCellContent);
  }
  parent.appendChild(mobileWrap);
}

export function paintMainAssetsTable({
  assetInfo,
  htmlElementId,
  sha256,
  sortByVersion,
  appPlatform,
  hideConfig,
  showOnlyRows,
  showOnlyRegisteredAssets,
  showProfilePictures,
  showAttachmentsTable = false,
  pubkey,
  showSeen = false,
}) {
  setAssetTableResponse(assetInfo);

  let hasVerificationsLocal = false;
  let hasAssetsLocal = false;
  const walletByAppId = new Map((window.wallets || []).map(w => [w.appId, w]));
  const profilePubkeySet = new Set();

  const combinedItems = new Map();

  function mergeIntoCombined(sourceMap) {
    for (const [key, value] of sourceMap.entries()) {
      const existing = combinedItems.get(key) || [];
      combinedItems.set(key, existing.concat(value));
    }
  }

  mergeIntoCombined(assetInfo.verifications);
  mergeIntoCombined(assetInfo.draftVerifications);
  mergeIntoCombined(assetInfo.assets);

  let sortedItems = Array.from(combinedItems).map(([sha256Key, items]) => {
    const sortedGroupItems = items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return {
      sha256: sha256Key,
      items: sortedGroupItems,
    };
  });

  sortedItems = mergeBundleAssetRows(sortedItems, sha256);

  if (sortByVersion) {
    sortedItems.sort((a, b) => {
      let versionA = getFirstTagValue(a.items[0], 'version');
      let versionB = getFirstTagValue(b.items[0], 'version');
      versionA = versionA.replace(/^[vV]/, '');
      versionB = versionB.replace(/^[vV]/, '');
      const hasVaryA = versionA.includes('VARY');
      const hasVaryB = versionB.includes('VARY');
      if (hasVaryA !== hasVaryB) {
        return hasVaryB ? 1 : -1;
      }
      const partsA = versionA.split('.').map(part => parseInt(part) || 0);
      const partsB = versionB.split('.').map(part => parseInt(part) || 0);
      for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
        const numA = partsA[i] || 0;
        const numB = partsB[i] || 0;
        if (numA !== numB) {
          return numB - numA;
        }
      }
      return 0;
    });
  } else {
    sortedItems.sort((a, b) => new Date(b.items[0].created_at) - new Date(a.items[0].created_at));
  }

  const attachmentEventIdSet = new Set();
  const endorsementEventIdSet = new Set();

  if (sortedItems.length > 0) {
    if (appPlatform) {
      sortedItems.forEach((itemsForThisSha256) => {
        itemsForThisSha256.items = itemsForThisSha256.items.filter(item => {
          const itemPlatform = getFirstTagValue(item, 'platform');
          if (appPlatform === 'desktop') {
            return itemPlatform === 'linux' || itemPlatform === 'windows' || itemPlatform === 'macos';
          }
          return appPlatform === itemPlatform;
        });
      });

      for (let i = sortedItems.length - 1; i >= 0; i--) {
        if (sortedItems[i].items.length === 0) {
          sortedItems.splice(i, 1);
        }
      }
    }

    sortedItems.forEach((itemsForThisSha256) => {
      itemsForThisSha256.items.forEach(item => {
        if (showAttachmentsTable && (item.kind === verificationKind || item.kind === verificationDraftKind)) {
          for (const id of getFileAttachmentIds(item)) {
            attachmentEventIdSet.add(id);
          }
        }
        if (item.kind === verificationKind) {
          endorsementEventIdSet.add(item.id);
        }
      });
    });
  }

  const attachmentEventIDs = [...attachmentEventIdSet];
  const endorsementEventIDs = [...endorsementEventIdSet];

  const collectAttestationsForHashes = (hashes) => {
    const seen = new Set();
    const collected = [];
    for (const hash of hashes) {
      for (const attestation of [
        ...(assetInfo.verifications.get(hash) || []),
        ...(assetInfo.draftVerifications.get(hash) || []),
      ]) {
        if (!seen.has(attestation.id)) {
          seen.add(attestation.id);
          collected.push(attestation);
        }
      }
    }
    return collected;
  };

  const table = el('table', { id: 'assetsTable', className: 'assets-table' });
  const thead = el('thead');
  const headerRow = el('tr');
  if (!hideConfig?.wallet) {
    headerRow.appendChild(el('th', { style: { maxWidth: '200px' } }, 'Wallet'));
  } else {
    headerRow.appendChild(el('th', { style: { maxWidth: '200px' } }, 'Version'));
  }
  headerRow.appendChild(el('th', { className: 'hide-on-mobile', style: { maxWidth: '300px' } }, 'Description'));
  if (!hideConfig?.sha256) {
    headerRow.appendChild(el('th', { className: 'hide-on-mobile hash-cell' }, 'Hashes'));
  }
  headerRow.appendChild(el('th', { className: 'hide-on-mobile' }, 'Binary'));
  headerRow.appendChild(el('th', {}, 'Verifications'));
  if (showSeen) {
    headerRow.appendChild(el('th', {}, 'Seen'));
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tableBody = el('tbody');
  table.appendChild(tableBody);

  let visibleRowIndex = 0;

  if (sortedItems.length > 0) {
    sortedItems.forEach((item) => {
      if (showProfilePictures) {
        profilePubkeySet.add(item.items[0].pubkey);
      }

      const binary = item.items ? item.items[0] : item;
      const date = formatDate(binary.created_at);
      const allSha256Hashes = getHashTags(binary);
      const sha256Hashes = allSha256Hashes.slice(0, 5);
      const sha256HashKey = item.sha256;
      const downloadHash = sha256HashKey;
      const verificationLookupHash = item.sha256 || getVerificationLookupHash(binary);
      const version = getFirstTagValue(binary, 'version');
      const identifier = getFirstTagValue(binary, 'i');
      const platform = getFirstTagValue(binary, 'platform');

      let thisHashHasAssets = false;
      item.items.forEach(innerItem => {
        if (isAssetRegistrationEvent(innerItem)) {
          thisHashHasAssets = true;
        }
      });

      if (showOnlyRegisteredAssets && !thisHashHasAssets) {
        return;
      }

      if (thisHashHasAssets) {
        hasAssetsLocal = true;
      }

      const itemDescription = parseItemDescription(binary);
      const lookupHashes = getRowLookupHashes(item, verificationLookupHash);
      const attestations = selectCurrentRowVerifications(collectAttestationsForHashes(lookupHashes));
      const hasVerifications = attestations.length > 0;
      const warningBadge = createVersionWarningBadge(attestations);

      if (hasVerifications) {
        hasVerificationsLocal = true;
      }

      const wallet = walletByAppId.get(identifier);
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
      const bundleFilesJson = bundleFilesForDownload.length > 0
        ? encodeURIComponent(JSON.stringify(bundleFilesForDownload))
        : '';
      const downloadTitle = bundleFilesForDownload.length > 1
        ? `Download ${bundleFilesForDownload.length} files from Blossom`
        : 'Download from Blossom';

      const row = el('tr');
      if (visibleRowIndex >= showOnlyRows) {
        row.classList.add('initially-hidden');
        row.style.display = 'none';
      }
      visibleRowIndex++;

      row.id = `version-${String(version ?? '').replace(/\./g, '-')}`;
      row.dataset.sha256 = sha256HashKey || '';
      row.dataset.identifier = identifier || '';
      row.dataset.hasVerifications = hasVerifications ? 'true' : 'false';
      row.dataset.searchText = `${walletTitle} ${version} ${itemDescription}`.toLowerCase();

      const mobileHashMount = el('span');
      fillHashCell(mobileHashMount, sha256Hashes, allSha256Hashes);

      // Wallet / version cell
      const versionCell = el('td', {
        style: hideConfig?.wallet
          ? undefined
          : {
            maxWidth: '200px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
          },
      });

      if (!hideConfig?.wallet && wallet) {
        versionCell.appendChild(el('a', { href: wallet.url, rel: 'noopener noreferrer' }, walletTitle));
        versionCell.appendChild(document.createElement('br'));
        appendVersionBlock(versionCell, {
          version,
          warningBadge,
          itemDescription,
          hashCellContent: mobileHashMount,
        });
      } else if (!hideConfig?.wallet) {
        versionCell.textContent = walletTitle ?? '';
      } else {
        appendVersionBlock(versionCell, {
          version,
          warningBadge,
          itemDescription,
          hashCellContent: mobileHashMount,
        });
      }
      row.appendChild(versionCell);

      // Description
      row.appendChild(el('td', {
        className: 'asset-description hide-on-mobile',
        style: {
          maxWidth: '300px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'normal',
          wordWrap: 'break-word',
        },
      }, itemDescription ?? ''));

      // Hashes
      if (!hideConfig?.sha256) {
        const hashCell = el('td', { className: 'hide-on-mobile hash-cell' });
        fillHashCell(hashCell, sha256Hashes, allSha256Hashes);
        row.appendChild(hashCell);
      }

      // Binary
      const binaryCell = el('td', { className: 'hide-on-mobile binary-cell' });
      if (downloadHash) {
        binaryCell.appendChild(
          el('div', { className: 'binary-cell__content' },
            createBlossomDownloadButton({
              downloadHash,
              identifier,
              platform,
              version,
              sanitizedFileName,
              bundleFilesJson,
              downloadTitle,
              bundleFileCount: bundleFilesForDownload.length,
            }),
          ),
        );
      } else {
        binaryCell.textContent = '-';
      }
      row.appendChild(binaryCell);

      // Verifications
      const verificationsTd = el('td');
      verificationsTd.appendChild(createVerificationsCell({
        attestations: hasVerifications ? attestations : [],
        sha256HashKey,
        identifier,
        platform,
        version,
        hideButtons: hideConfig?.buttons,
      }));
      row.appendChild(verificationsTd);

      if (showSeen) {
        row.appendChild(el('td', {}, date));
      }

      tableBody.appendChild(row);
    });

    if (visibleRowIndex > showOnlyRows) {
      const showMoreRow = el('tr', { className: 'show-more-row', id: 'show-more-row' });
      const columnCount = getAssetsTableColumnCount(hideConfig, showSeen);
      const cell = el('td', { colspan: String(columnCount) });
      cell.appendChild(el('button', {
        id: 'show-more-link',
        type: 'button',
        className: 'js-show-more-rows',
      }, `Show ${visibleRowIndex - showOnlyRows} more`));
      showMoreRow.appendChild(cell);
      tableBody.appendChild(showMoreRow);
    }
  } else {
    const row = el('tr');
    const columnCount = getAssetsTableColumnCount(hideConfig, showSeen);
    row.appendChild(el('td', { colspan: String(columnCount) },
      pubkey ? 'No verifications found for this user' : 'No verifications found',
    ));
    tableBody.appendChild(row);
  }

  const host = document.getElementById(htmlElementId);
  const tableFrame = el('div', { className: 'assets-table-frame' });
  const tableScroll = el('div', { className: 'assets-table-scroll' });
  tableScroll.appendChild(table);
  tableFrame.appendChild(tableScroll);
  host.appendChild(tableFrame);

  return {
    table,
    sortedItems,
    attachmentEventIDs,
    endorsementEventIDs,
    profilePubkeys: [...profilePubkeySet],
    hasAssets: hasAssetsLocal,
    hasVerifications: hasVerificationsLocal,
    walletByAppId,
  };
}
