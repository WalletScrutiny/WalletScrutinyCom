import {
  assetRegistrationKinds,
  getAssetFileEntries,
  pickScriptBinaryEntry,
} from "./asset-utils.mjs";
import { assetBundleRegistrationKind, verificationKind, verificationDraftKind } from "./nostr-constants.mjs";
import { formatDate } from "./format-utils.mjs";
import { getStatusText } from "./assets-table-utils.js";
import { getFirstTagValue } from "./verifications_common.mjs";
import { mergeBundleAssetRows } from "./assets-table-filters.js";
import { setAssetTableResponse } from "./assets-table-state.js";

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

const getPrimaryFileName = event => {
  const primaryFileTag = event.tags?.find(tag => tag[0] === 'file');
  if (primaryFileTag?.[1]) {
    return primaryFileTag[1];
  }
  return getFirstTagValue(event, 'file-name');
};

function renderCopyAllHashesButton(allHashes) {
  if (allHashes.length <= 6) {
    return '';
  }
  const allHashesText = allHashes.map(hash => hash[1]).join('\n');
  const count = allHashes.length;
  return `
    <div class="hash-list-more">...</div>
    <div style="margin-top: 6px;">
      <button onclick='navigator.clipboard.writeText(${JSON.stringify(allHashesText)}).then(() => showToast("Hashes copied to clipboard"))' class="copy-button" title="Copy all ${count} hashes to clipboard">📋 Copy all (${count})</button>
    </div>`;
}

function renderMobileHashCells(sha256Hashes, allHashes = sha256Hashes) {
  if (sha256Hashes.length === 0) {
    return '-';
  }
  return sha256Hashes.map(hash => `
    <div style="margin-bottom: 4px;">
      <button onclick="navigator.clipboard.writeText('${hash[1]}').then(() => showToast('Hash copied to clipboard'))" class="copy-button" title="Copy hash to clipboard">📋</button><span class="hash-display" title="${hash[1]}">${hash[1]}${hash[2] ? ` (${hash[2]})` : ''}</span>
    </div>`).join('') + renderCopyAllHashesButton(allHashes);
}

function renderDesktopHashCells(sha256Hashes, allHashes = sha256Hashes) {
  if (sha256Hashes.length === 0) {
    return '-';
  }
  return sha256Hashes.map(hash => `
    <div style="margin-bottom: 4px;">
      <span class="hash-display" title="${hash[1]}">${hash[1]}${hash[2] ? ` (${hash[2]})` : ''}</span>
      <button onclick="navigator.clipboard.writeText('${hash[1]}').then(() => showToast('Hash copied to clipboard'))" class="copy-button" title="Copy hash to clipboard">📋</button>
    </div>`).join('') + renderCopyAllHashesButton(allHashes);
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
          for (const id of getFileAttachmentIDsForVerificationEvent(item)) {
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
      const bundleHashes = getAssetFileEntries(binary).map(entry => entry.hash);
      const lookupHashes = bundleHashes.length > 1
        ? bundleHashes
        : [verificationLookupHash || bundleHashes[0]].filter(Boolean);
      const attestations = collectAttestationsForHashes(lookupHashes);
      const hasVerifications = attestations.length > 0;

      let verificationsList;
      if (hasVerifications) {
        hasVerificationsLocal = true;

        const latestVerificationsByUser = new Map();
        for (const attestation of attestations) {
          if (attestation.kind === verificationDraftKind) {
            latestVerificationsByUser.set(`${attestation.pubkey}-draft-${attestation.id}`, attestation);
          } else {
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
          const isMine = attestation.pubkey === window.userPubkey;
          const isDraft = attestation.kind === verificationDraftKind;
          const isMyDraft = isDraft && isMine;
          const draftBadge = isMyDraft ? `<span class="badge badge-warning">Draft</span>` : '';
          const statusText = (status === 'reproducible' ? '✅ ' : '❌ ') + '<span class="attestation-status">' + getStatusText(status, true) + '</span>';

          listItems += `<span
                            onclick='showVerificationModal("${sha256HashKey}", "${attestation.id}", "${identifier}", "${platform}")'
                            onmouseenter="prefetchMarked()"
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
      const bundleFilesAttr = bundleFilesForDownload.length > 0
        ? ` data-bundle-files="${encodeURIComponent(JSON.stringify(bundleFilesForDownload))}"`
        : '';
      const downloadTitle = bundleFilesForDownload.length > 1
        ? `Download ${bundleFilesForDownload.length} files from Blossom`
        : 'Download from Blossom';

      const row = document.createElement('tr');
      if (visibleRowIndex >= showOnlyRows) {
        row.classList.add('initially-hidden');
        row.style.display = 'none';
      }
      visibleRowIndex++;

      const sanitizedVersion = version.replace(/\./g, '-');
      row.setAttribute('id', `version-${sanitizedVersion}`);
      row.dataset.sha256 = sha256HashKey || '';
      row.dataset.identifier = identifier || '';
      row.dataset.hasVerifications = hasVerifications ? 'true' : 'false';
      row.dataset.searchText = `${walletTitle} ${version} ${itemDescription}`.toLowerCase();

      const mobileHashes = renderMobileHashCells(sha256Hashes, allSha256Hashes);
      const desktopHashes = renderDesktopHashCells(sha256Hashes, allSha256Hashes);

      row.innerHTML = `
        ${hideConfig?.wallet ? '' : `<td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: normal; word-wrap: break-word;">
          ${wallet ? `<a href="${wallet.url}" rel="noopener noreferrer">${walletTitle}</a><br>${version}<span class="show-on-mobile"><br>${itemDescription}<br>${mobileHashes}</span>` : walletTitle}
          </td>`}
        ${hideConfig?.wallet ? `<td>
          ${version}<span class="show-on-mobile"><br>${itemDescription}<br>${mobileHashes}</span>
          </td>` : ''}
        <td class="asset-description hide-on-mobile" style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: normal; word-wrap: break-word;">${itemDescription}</td>
        ${hideConfig?.sha256 ? '' : `<td class="hide-on-mobile">${desktopHashes}</td>`}
        <td class="hide-on-mobile">
          ${downloadHash ? `
            <span id="blossom-${downloadHash}" data-appid="${identifier}" data-platform="${platform}" data-version="${version}" data-filename="${sanitizedFileName}"${bundleFilesAttr} class="blossom-download" style="display: none; cursor: pointer;" title="${downloadTitle}">💾</span>
          ` : '-'}
        </td>
        <td>${verificationsList}</td>
        <td>${date}</td>`;
      table.appendChild(row);
    });

    if (visibleRowIndex > showOnlyRows) {
      const showMoreRow = document.createElement('tr');
      showMoreRow.className = 'show-more-row';
      showMoreRow.id = 'show-more-row';
      showMoreRow.innerHTML = `
        <td colspan="8" style="text-align: center; padding: 15px;">
          <button id="show-more-link" onclick="showMoreRows()" style="cursor: pointer; background: none; border: none; color: #0066cc; text-decoration: underline; font-size: inherit; padding: 5px 10px;">Show ${visibleRowIndex - showOnlyRows} more</button>
        </td>`;
      table.appendChild(showMoreRow);
    }
  } else {
    const row = document.createElement('tr');
    row.innerHTML = pubkey
      ? '<td colspan="8">No verifications found for this user</td>'
      : '<td colspan="8">No verifications found</td>';
    table.appendChild(row);
  }

  document.getElementById(htmlElementId).appendChild(table);

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
