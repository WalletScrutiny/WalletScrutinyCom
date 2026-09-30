import { verificationDraftKind } from "./nostr-constants.mjs";
import { formatDate } from "./format-utils.mjs";
import { getAttachmentInfo } from "./assets-table-utils.mjs";
import { getFirstTagValue } from "./verifications_common.mjs";
import { el, htmlOf, isSha256Hex } from "./html-utils.mjs";

const attachmentDataStore = {};

let attachmentsReadyResolve = null;
let attachmentsReadyPromise = new Promise(resolve => {
  attachmentsReadyResolve = resolve;
});

export function resetAttachmentState() {
  for (const key of Object.keys(attachmentDataStore)) {
    delete attachmentDataStore[key];
  }
  attachmentsReadyPromise = new Promise(resolve => {
    attachmentsReadyResolve = resolve;
  });
}

export function waitForAttachmentsReady() {
  return attachmentsReadyPromise;
}

export function createAttachmentRowActions({ attachmentId, name, pubkey, date, sizeInKb }) {
  const safePubkey = isSha256Hex(pubkey) ? pubkey : '';
  return el('span', {},
    name ?? '',
    ' ',
    el('small', {}, `(${sizeInKb} kB)`),
    ' ',
    el('span', {
      className: 'js-attachment-download',
      style: { cursor: 'pointer', marginLeft: '6px' },
      title: `Download ${name ?? ''}`,
      dataset: { attachmentId: attachmentId ?? '' },
    }, '💾'),
    ' ',
    el('span', {
      className: 'js-attachment-preview',
      style: { cursor: 'pointer', marginLeft: '6px' },
      title: `Preview ${name ?? ''}`,
      dataset: { attachmentId: attachmentId ?? '' },
    }, '👁️'),
    el('br'),
    el('small', {}, `Uploaded on ${date ?? ''} by`),
    ' ',
    el('span', {
      style: { marginLeft: '4px' },
      className: safePubkey ? `profile-${safePubkey}` : 'profile-unknown',
    }, safePubkey),
  );
}

export function buildAttachmentRowActionsHtml(options) {
  return htmlOf(createAttachmentRowActions(options));
}

export function createAttachmentVerificationMeta({ walletTitle, identifier, platform, version }) {
  return el('span', {},
    walletTitle ?? identifier ?? '',
    ' ',
    el('br'),
    el('small', {}, `(${platform ?? ''})`),
    ' ',
    el('br'),
    version ?? '',
    el('br'),
  );
}

export function buildAttachmentVerificationMetaHtml(options) {
  return htmlOf(createAttachmentVerificationMeta(options));
}

/** Preview body as a text node inside <pre>. Do not pass Nostr attachment bytes through innerHTML. */
export function createAttachmentPreviewNode(textContent) {
  return el('pre', { style: { margin: '0', overflow: 'visible' } }, textContent ?? '');
}

function decodeAttachmentContent(rawContent) {
  return atob(rawContent);
}

function getAttachmentEntry(attachmentId) {
  return attachmentDataStore[attachmentId];
}

function getDecodedContent(entry) {
  if (!entry) {
    return null;
  }
  if (entry.content !== undefined) {
    return entry.content;
  }
  if (entry.rawContent) {
    entry.content = decodeAttachmentContent(entry.rawContent);
    return entry.content;
  }
  return null;
}

export function storeAttachmentMetadata(attachment) {
  const { name, sizeInKb } = getAttachmentInfo(attachment);
  const attachmentContentType = getFirstTagValue(attachment, 'content-type', 'application/octet-stream');

  attachmentDataStore[attachment.id] = {
    rawContent: attachment.content,
    type: attachmentContentType,
    filename: name,
    sizeInKb,
  };
}

export function buildAttachmentVerificationIndex(sortedItems) {
  const index = new Map();
  for (const group of sortedItems) {
    for (const item of group.items) {
      for (const tag of item.tags || []) {
        if (tag[0] === 'file-attachment' && tag[1]) {
          const list = index.get(tag[1]) || [];
          list.push(item);
          index.set(tag[1], list);
        }
      }
    }
  }
  return index;
}

export async function loadAndStoreAttachments(attachmentEventIDs) {
  const uniqueIds = [...new Set(attachmentEventIDs)];
  if (uniqueIds.length === 0) {
    attachmentsReadyResolve();
    return new Map();
  }

  const attachments = await getEventsFromEventIds(uniqueIds);
  attachments.forEach(attachment => {
    storeAttachmentMetadata(attachment);
  });
  attachmentsReadyResolve();
  return attachments;
}

function getFileAttachmentIdsFromVerification(verification) {
  return verification.tags
    .filter(tag => tag[0] === 'file-attachment' && tag[1])
    .map(tag => tag[1]);
}

export async function prefetchVerificationAttachments(verification) {
  const attachmentIds = getFileAttachmentIdsFromVerification(verification);
  if (attachmentIds.length === 0) {
    return;
  }

  const missingIds = attachmentIds.filter(id => !getAttachmentEntry(id));
  if (missingIds.length === 0) {
    return;
  }

  const attachments = await getEventsFromEventIds(missingIds);
  attachments.forEach(attachment => {
    storeAttachmentMetadata(attachment);
  });
}

function buildAttachmentListItems(verificationAttachments) {
  const items = [];
  for (const attachment of verificationAttachments) {
    const attachmentId = attachment[1];
    const attachmentInfo = getAttachmentEntry(attachmentId);
    if (attachmentInfo) {
      items.push(el('li', {},
        attachmentInfo.filename ?? '',
        ' ',
        el('small', {}, `(${attachmentInfo.sizeInKb} kB)`),
        ' ',
        el('span', {
          className: 'js-attachment-download',
          style: { cursor: 'pointer', marginLeft: '10px' },
          title: `Download ${attachmentInfo.filename ?? ''}`,
          dataset: { attachmentId: attachmentId ?? '' },
        }, '💾'),
        ' ',
        el('span', {
          className: 'js-attachment-preview',
          style: { cursor: 'pointer', marginLeft: '10px' },
          title: `Preview ${attachmentInfo.filename ?? ''}`,
          dataset: { attachmentId: attachmentId ?? '' },
        }, '👁️'),
      ));
    }
  }
  return items;
}

export async function populateVerificationAttachmentsList(listEl, verificationAttachments) {
  if (!listEl) {
    return;
  }

  const missingIds = verificationAttachments
    .map(attachment => attachment[1])
    .filter(id => id && !getAttachmentEntry(id));

  if (missingIds.length > 0) {
    const attachments = await getEventsFromEventIds(missingIds);
    attachments.forEach(attachment => {
      storeAttachmentMetadata(attachment);
    });
  }

  const items = buildAttachmentListItems(verificationAttachments);
  listEl.replaceChildren(...(items.length ? items : [el('li', {}, 'Scripts not available')]));
}

export function renderAttachmentsTable({
  attachments,
  sortedItems,
  attachmentVerificationIndex,
  walletByAppId,
  htmlElementId,
  showAttachmentsTable,
  profilePubkeySet,
  showProfilePictures,
}) {
  if (!showAttachmentsTable) {
    return null;
  }

  if (!attachments || attachments.size === 0) {
    return null;
  }

  attachments.forEach(attachment => {
    if (showProfilePictures) {
      profilePubkeySet.add(attachment.pubkey);
    }
  });

  const wrap = document.createElement('div');
  wrap.className = 'assets-table-attachments-wrap';
  const paragraph = document.createElement('p');
  paragraph.innerHTML = 'Scripts used to reproduce the application:';
  wrap.appendChild(paragraph);
  const attachmentsTable = document.createElement('table');
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

  attachments.forEach(attachment => {
    const entry = getAttachmentEntry(attachment.id);
    const { name, sizeInKb } = entry;
    const verifications = attachmentVerificationIndex.get(attachment.id) || [];
    const row = document.createElement('tr');

    if (verifications.some(v => v.kind === verificationDraftKind)) {
      row.classList.add('draft-attestation');
    }

    const date = formatDate(attachment.created_at);

    const fileTd = el('td');
    fileTd.appendChild(createAttachmentRowActions({
      attachmentId: attachment.id,
      name,
      pubkey: attachment.pubkey,
      date,
      sizeInKb,
    }));

    const metaTd = el('td');
    if (verifications.length > 0) {
      for (const verification of verifications) {
        const version = getFirstTagValue(verification, 'version');
        const identifier = getFirstTagValue(verification, 'i');
        const platform = getFirstTagValue(verification, 'platform');
        const wallet = walletByAppId.get(identifier);
        const walletTitle = wallet ? wallet.title : identifier;
        metaTd.appendChild(createAttachmentVerificationMeta({
          walletTitle,
          identifier,
          platform,
          version,
        }));
      }
    } else {
      metaTd.textContent = '-';
    }

    row.appendChild(fileTd);
    row.appendChild(metaTd);
    attachmentsTable.appendChild(row);
  });

  return attachmentsTable;
}

export function getAttachmentInfoFromStore(attachmentId) {
  return getAttachmentEntry(attachmentId);
}

export function registerAttachmentHandlers() {
  window.handleAttachmentDownload = function(attachmentId) {
    const modal = document.getElementById('blossomWarningModal');
    const confirmButton = document.getElementById('blossomConfirmDownloadButton');
    const closeButton = document.getElementById('blossomCloseModalButton');

    const downloadAction = () => {
      const attachmentData = getAttachmentEntry(attachmentId);
      const content = getDecodedContent(attachmentData);

      if (!attachmentData || content === null) {
        console.error('handleAttachmentDownload - Attachment data or content is missing for ID:', attachmentId);
        showToast('Error: Attachment data is missing.', 'error');
        return;
      }

      try {
        const blob = new Blob([content], { type: attachmentData.type });
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

    confirmButton.replaceWith(confirmButton.cloneNode(true));
    document.getElementById('blossomConfirmDownloadButton').addEventListener('click', downloadAction);

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

  window.handleAttachmentPreview = function(attachmentId) {
    const attachmentData = getAttachmentEntry(attachmentId);
    const textContent = getDecodedContent(attachmentData);

    if (!attachmentData || textContent === null) {
      console.error('handleAttachmentPreview - Attachment data or content is missing for ID:', attachmentId);
      showToast('Error: Attachment data is missing.', 'error');
      return;
    }

    const modal = document.getElementById('attachmentPreviewModal');
    const previewContent = document.getElementById('previewContent');
    const previewFileName = document.getElementById('previewFileName');
    const closeButton = document.getElementById('previewCloseButton');
    const copyButton = document.getElementById('previewCopyButton');

    previewFileName.textContent = attachmentData.filename;
    previewContent.replaceChildren();

    try {
      previewContent.replaceChildren(createAttachmentPreviewNode(textContent));

      closeButton.onclick = function() {
        modal.style.display = 'none';
      };

      copyButton.onclick = function() {
        navigator.clipboard.writeText(textContent).then(() => {
          const originalIcon = copyButton.textContent;
          copyButton.textContent = '✓';
          copyButton.style.color = '#4CAF50';
          showToast('Copied to clipboard!', 'success');
          setTimeout(() => {
            copyButton.textContent = originalIcon;
            copyButton.style.color = '#555';
          }, 1500);
        }).catch(err => {
          console.error('Failed to copy text: ', err);
          showToast('Failed to copy to clipboard', 'error');
        });
      };

      modal.onclick = function(event) {
        if (event.target === modal) {
          closeButton.onclick();
        }
      };

      modal.style.display = 'flex';
      previewContent.scrollTop = 0;
      previewContent.scrollLeft = 0;

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

  if (!window.__wsAttachmentUiDelegationRegistered) {
    window.__wsAttachmentUiDelegationRegistered = true;
    document.addEventListener('click', (event) => {
      const downloadEl = event.target.closest('.js-attachment-download');
      if (downloadEl) {
        event.preventDefault();
        window.handleAttachmentDownload(downloadEl.dataset.attachmentId || '');
        return;
      }
      const previewEl = event.target.closest('.js-attachment-preview');
      if (previewEl) {
        event.preventDefault();
        window.handleAttachmentPreview(previewEl.dataset.attachmentId || '');
      }
    });
  }
}
