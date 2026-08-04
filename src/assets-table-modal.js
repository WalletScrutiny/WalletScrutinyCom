import { verificationDraftKind, isWalletScrutinySiteAdmin, verificationReportKind } from "./nostr-constants.mjs";
import { formatDate } from "./format-utils.mjs";
import { formatZapAmount, getStatusIcon, getStatusText, formatCommentDate } from "./assets-table-utils.js";
import { getFirstTagValue } from "./verifications_common.mjs";
import { parseMarkdownToSafeHtml, prefetchMarked } from './marked-loader.js';
import { renderCommentsSection } from './assets-table-comments.js';
import {
  getAssetTableResponse,
  setOriginalUrlBeforeModal,
  getOriginalUrlBeforeModal,
  findVerificationByIdInMaps,
} from "./assets-table-state.js";
import {
  loadEndorsementsForVerification,
} from "./assets-table-endorsements.js";
import {
  populateVerificationAttachmentsList,
} from "./assets-table-attachments.js";
import { el, htmlOf, isSha256Hex, sanitizeHttpUrl } from "./html-utils.mjs";
import './zapModal.js';

export function buildEndorsementButtonHtml(verificationId, sha256Hash) {
  return htmlOf(el('button', {
    type: 'button',
    className: 'btn btn-info js-open-endorsement',
    title: 'Endorse this verification',
    dataset: {
      verificationId: verificationId ?? '',
      sha256: sha256Hash ?? '',
    },
  }, '👍 👎 Endorse this verification'));
}

export function buildOutputFileDownloadHtml(fileName, fileHash) {
  return htmlOf(el('li', {},
    fileName ?? '',
    ' ',
    el('span', {
      className: 'js-download-blossom-file',
      style: { cursor: 'pointer', marginLeft: '10px' },
      title: `Download ${fileName ?? ''}`,
      dataset: {
        fileHash: fileHash ?? '',
        fileName: fileName ?? '',
      },
    }, '💾'),
  ));
}

export function buildDiffoscopeOpenButtonHtml(fileName, fileUrl) {
  return htmlOf(el('button', {
    type: 'button',
    className: 'btn btn-small btn-info js-open-diffoscope',
    style: { width: 'auto' },
    dataset: { diffoscopeUrl: fileUrl ?? '' },
  }, fileName ?? ''));
}

export function buildIssueTrackerLinkHtml(issueTrackerUrl) {
  const safeUrl = sanitizeHttpUrl(issueTrackerUrl);
  if (!safeUrl) {
    return htmlOf(el('p', {},
      el('strong', {}, 'Issue tracker url:'),
      ' (invalid URL omitted)',
    ));
  }
  return htmlOf(el('p', {},
    el('strong', {}, 'Issue tracker url:'),
    ' ',
    el('a', { href: safeUrl, target: '_blank', rel: 'noopener noreferrer' }, safeUrl),
  ));
}

let pendingVerificationReport = null;
let verificationModalClickHandler = null;
let verificationModalKeyHandler = null;

function setupVerificationModalCloseHandlers(modal, modalBackdrop, content) {
  if (verificationModalClickHandler) {
    window.removeEventListener('click', verificationModalClickHandler);
    verificationModalClickHandler = null;
  }
  if (verificationModalKeyHandler) {
    window.removeEventListener('keydown', verificationModalKeyHandler);
    verificationModalKeyHandler = null;
  }

  const closeModalAction = () => {
    modal.style.display = 'none';
    modal.style.flexDirection = '';
    if (modalBackdrop) {
      modalBackdrop.style.display = 'none';
    }
    window.currentVerification = null;
    if (verificationModalClickHandler) {
      window.removeEventListener('click', verificationModalClickHandler);
      verificationModalClickHandler = null;
    }
    if (verificationModalKeyHandler) {
      window.removeEventListener('keydown', verificationModalKeyHandler);
      verificationModalKeyHandler = null;
    }
    document.body.classList.remove("modal-open");
    history.pushState("", document.title, getOriginalUrlBeforeModal());
  };

  const closeButton = document.getElementById('closeModal');
  if (closeButton) {
    closeButton.onclick = (event) => {
      event.stopPropagation();
      closeModalAction();
    };
  }

  const toolbar = document.getElementById('verificationModalToolbar');

  verificationModalClickHandler = function(event) {
    if (event.target.closest('#closeModal')) {
      closeModalAction();
      return;
    }
    if (event.target.closest('.zap-modal')) {
      return;
    }
    if (event.target.closest('.share-nostr-modal')) {
      return;
    }
    const clickedInsideModalPanel = content.contains(event.target)
      || event.target === content
      || toolbar?.contains(event.target);
    if (!clickedInsideModalPanel && !event.target.closest('.attestation-link')) {
      const modalRect = modal.getBoundingClientRect();
      if (event.clientX < modalRect.left || event.clientX > modalRect.right || event.clientY < modalRect.top || event.clientY > modalRect.bottom) {
        closeModalAction();
      }
    }
  };

  verificationModalKeyHandler = function(event) {
    if (event.key === 'Escape') {
      closeModalAction();
    }
  };

  window.addEventListener('click', verificationModalClickHandler);
  window.addEventListener('keydown', verificationModalKeyHandler);
}

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
    `<p>The following <strong>Nostr kind ${verificationReportKind}</strong> report will be sent to the configured relays:</p>`,
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

function buildVerifierProfileCardHtml(profile, pubkey) {
  const imageUrl = getProfileImageUrl(profile);
  const placeholderUrl = PROFILE_PLACEHOLDER_IMAGE;
  const safePubkey = isSha256Hex(pubkey) ? pubkey : '';
  if (profile) {
    const card = el('div', { className: 'profile-card' },
      el('img', {
        src: imageUrl,
        className: 'profile-image',
        alt: '',
        dataset: {
          placeholder: placeholderUrl,
          ...(safePubkey ? { verifierPubkey: safePubkey } : {}),
        },
      }),
      el('div', {
        className: 'profile-info',
        ...(safePubkey ? { dataset: { verifierPubkey: safePubkey } } : {}),
      },
        el('div', {}, getProfileDisplayName(profile, pubkey)),
        profile.nip05 ? el('div', { className: 'profile-nip05' }, profile.nip05) : null,
      ),
    );
    return htmlOf(card);
  }
  return getProfileDisplayName(null, pubkey);
}

function wireVerifierProfileCard(root) {
  if (!root) {
    return;
  }
  root.querySelectorAll('img.profile-image').forEach((img) => {
    img.addEventListener('error', () => profileImageFallback(img));
  });
  root.querySelectorAll('[data-verifier-pubkey]').forEach((node) => {
    const pubkey = node.dataset.verifierPubkey;
    if (!isSha256Hex(pubkey)) {
      return;
    }
    node.style.cursor = 'pointer';
    node.addEventListener('click', (e) => {
      e.stopPropagation();
      window.location.href = `/verifier/?pubkey=${pubkey}`;
    });
  });
}

function setupZapButton(zapBtn, profile, verification) {
  if (!zapBtn) {
    return;
  }
  if (profile && (profile.lud16 || profile.lud06)) {
    zapBtn.style.display = 'inline-block';
    zapBtn.disabled = false;
    zapBtn.onclick = (e) => {
      e.stopPropagation();
      window.showZapModal({
        onClose: () => {},
        setZapped: () => {},
        zapEvent: verification,
      });
    };
  } else {
    zapBtn.style.display = 'inline-block';
    zapBtn.disabled = true;
    zapBtn.onclick = null;
    zapBtn.style.backgroundColor = '#ccc';
    zapBtn.style.color = '#888';
    zapBtn.style.cursor = 'not-allowed';
    zapBtn.title = "The user doesn't have a nostr profile or a LN address to receive sats";
  }
}

export async function showVerificationModal(sha256Hash, verificationId, appId, platform) {
  document.body.classList.add("modal-open");
  prefetchMarked();

  const response = getAssetTableResponse();
  if (!response) {
    console.error('showVerificationModal: asset data not loaded yet');
    document.body.classList.remove("modal-open");
    return;
  }

  const lookup = findVerificationByIdInMaps(response, verificationId);
  if (!lookup) {
    console.warn('showVerificationModal: verification not found:', verificationId);
    document.body.classList.remove("modal-open");
    return;
  }

  const verification = lookup.verification;
  sha256Hash = lookup.sha256Hash || sha256Hash;

  const basedOn = getFirstTagValue(verification, 'based-on');

  const verifications = response.verifications.get(sha256Hash) || [];
  const draftVerifications = response.draftVerifications.get(sha256Hash) || [];
  const allTheVerifications = [...verifications, ...draftVerifications];
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
  let toolbar = document.getElementById('verificationModalToolbar');
  if (!toolbar) {
    toolbar = document.createElement('div');
    toolbar.id = 'verificationModalToolbar';
    modal.insertBefore(toolbar, content);
  }
  toolbar.innerHTML = '';
  content.innerHTML = '';

  // Reset scroll positions before showing the modal again
  setTimeout(() => {
    content.scrollTop = 0;
    content.scrollLeft = 0;
  }, 0);

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
  if (isMine) {
    title = isDraft ? 'Edit your draft' : 'Edit your verification';
    icon = '✏️';
  } else {
    title = isDraft ? 'Copy this draft' : 'Copy this verification';
    icon = '📋';
  }

  let toolbarRowHtml = '<div class="verification-modal-toolbar-row">';
  toolbarRowHtml += isMyDraft ? `<span class="badge badge-big badge-warning">Draft</span> This is a draft verification. It is not published yet.` : '';
  toolbarRowHtml += `<div class="verification-modal-share" id="verificationShareButtonContainer"></div>`;
  const editParams = new URLSearchParams({ action: 'edit' });
  if (isMyDraft) {
    editParams.set('draftVerificationEventId', verification.id);
  } else {
    editParams.set('verificationEventId', verification.id);
  }
  if (!isMine && verification.id && verification.pubkey) {
    editParams.set('basedOn', `${verification.id}:${verification.pubkey}`);
  }
  toolbarRowHtml += htmlOf(el('a', {
    className: 'btn btn-info',
    href: `/new_verification/?${editParams.toString()}`,
    title,
  }, `${icon} ${title}`));
  if (!isDraft && !isMine) {
    toolbarRowHtml += buildEndorsementButtonHtml(verification.id, sha256Hash);
  }
  toolbarRowHtml += `<div id="verificationActionButtons"></div>`;
  toolbarRowHtml += `<div id="verificationZapReportGroup" style="display: inline-flex; align-items: center; flex-wrap: wrap; gap: 8px;">
    <button type="button" class="btn btn-info" style="display: none; padding-bottom: 7px; margin: 0;" id="zapButton">
      <i class="fab fa-bitcoin" style="font-size: 23px;"></i> Zap this verification
    </button>
    <span id="adminReportVerificationWrap" style="display: none; position: relative; vertical-align: middle;">
      <button type="button" class="btn btn-secondary" id="adminReportVerificationBtn" style="font-size: 16px; margin: 0;">Report as spam/incorrect</button>
      <div id="adminReportVerificationMenu" style="display: none; position: absolute; left: 0; top: 100%; z-index: 10003; margin-top: 4px; min-width: 160px; border: 1px solid #ccc; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); background: #fff; color: #000;">
        <button type="button" class="admin-report-reason" data-reason="spam" style="display: block; width: 100%; text-align: left; padding: 8px 12px; border: 0; background: transparent; cursor: pointer; font-size: 16px;">Report as spam</button>
        <button type="button" class="admin-report-reason" data-reason="incorrect" style="display: block; width: 100%; text-align: left; padding: 8px 12px; border: 0; background: transparent; cursor: pointer; font-size: 16px;">Report as incorrect</button>
      </div>
    </span>
  </div>`;
  toolbarRowHtml += isMine
    ? '<a href="#" id="deleteVerificationLink" class="verification-modal-delete-link">Delete Verification</a>'
    : '';
  toolbarRowHtml += '</div>';
  toolbar.innerHTML = toolbarRowHtml;

  const shareButtonContainer = toolbar.querySelector('#verificationShareButtonContainer');
  let shareMessage = 'Check out this verification!';
  const shareAppId = getFirstTagValue(verification, 'i');
  if (shareAppId) {
    const shareVersion = getFirstTagValue(verification, 'version');
    const sharePlatform = getFirstTagValue(verification, 'platform');
    const shareWallet = window.wallets.find(w => w.appId === shareAppId);
    const shareWalletTitle = shareWallet ? shareWallet.title : shareAppId;
    const walletDescriptionToken = `${shareWalletTitle} v${shareVersion} (${sharePlatform})`;

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
    shareMessage += '\n🔍 See the full verification here:';
  }

  if (shareButtonContainer && typeof window.renderShareButton === 'function') {
    window.renderShareButton({
      container: shareButtonContainer,
      defaultMessage: shareMessage,
      showRawButtons: false,
      pulseAttention: isMine
    });
  }

  const version = getFirstTagValue(verification, 'version');
  const identifier = getFirstTagValue(verification, 'i');
  const wallet = window.wallets.find(w => w.appId === identifier);
  const walletTitle = wallet ? wallet.title : identifier;

  const verificationHashes = verification.tags
    .filter(tag => tag[0] === 'x')
    .map(tag => tag[1])
    .filter(id => isSha256Hex(id));
  const verificationAttachments = verification.tags.filter(tag => tag[0] === 'file-attachment');
  const verificationOutputFiles = verification.tags.filter(tag => tag[0] === 'output-file');
  const isVerifierOrAssetsPage = window.location.pathname.includes('/verifier/')
    || window.location.pathname.includes('/assets/');
  const numberVerificationAttachments = verificationAttachments.length;

  let firstAsciicastFileSHA256 = null;
  let diffoscopeFiles = [];
  let outputFilesHTML = '';
  for (const outputFile of verificationOutputFiles) {
    if (!firstAsciicastFileSHA256 && outputFile[1].includes('.cast')) {
      firstAsciicastFileSHA256 = outputFile[2];
    }
    if (outputFile[1].includes('diffo') && outputFile[1].includes('html')) {
      diffoscopeFiles.push(outputFile);
    }
    outputFilesHTML += buildOutputFileDownloadHtml(outputFile[1], outputFile[2]);
  }

  let attachmentsSectionHTML = '';
  if (numberVerificationAttachments > 0) {
    if (isVerifierOrAssetsPage) {
      const walletForLink = window.wallets.find(w => w.appId === appId);
      attachmentsSectionHTML = `<p><strong>Scripts used to reproduce:</strong></p><ul class="attestation-other-attempts"><li>${numberVerificationAttachments} script(s) used to reproduce this binary.${walletForLink?.url ? ` See the <a href="${walletForLink.url}#verificationId=${verificationId}">the wallet page</a> for more details.` : ''}</li></ul>`;
    } else {
      attachmentsSectionHTML = `<p><strong>Scripts used to reproduce:</strong></p><ul id="verification-attachments-list" class="attestation-other-attempts"><li>Loading scripts...</li></ul>`;
    }
  }

  const itemContent = JSON.parse(verification.content).content;
  const parsedMarkdown = await parseMarkdownToSafeHtml(itemContent);

  let diffoscopeHTML = '';
  if (diffoscopeFiles.length > 0) {
    diffoscopeHTML += `<div class="diffoscope-files" style="margin-top: 10px; margin-bottom: 20px; display: flex; flex-direction: column; gap: 10px; align-items: flex-start;">
                         <p>Diffoscope files attached (click to see report):</p>`;
    for (const file of diffoscopeFiles) {
      diffoscopeHTML += buildDiffoscopeOpenButtonHtml(file[1], getBlossomFileURL(file[2]));
    }
    diffoscopeHTML += '</div>';
  }

  const asciicastHTML = firstAsciicastFileSHA256
    ? '<br><div id="ascii_cast_player" class="asciicast-player" style="margin-bottom: 20px;"></div>'
    : '';

  const issueTrackerUrl = getFirstTagValue(verification, 'issue-tracker-url') || '';

  let contentHTML = '';
  if (verificationHashes.length === 1) {
    contentHTML += `<p><strong>Hash of the binary reproduced:</strong> ${verificationHashes[0]}</p>`;
  } else if (verificationHashes.length > 1) {
    contentHTML += `<p style="margin-bottom: 10px;"><strong>Hashes of the binaries reproduced:</strong><br>${verificationHashes.join('<br>')}</p>`;
  }
  contentHTML += `
    <p><strong>Application:</strong> ${walletTitle}</p>
    <p><strong>Version:</strong> ${version}</p>
    <p><strong>Attempt by:</strong> <span id="attempt-by"></span></p>`;
  if (basedOn) {
    contentHTML += `<p><strong>Based on an attempt by:</strong> <span id="based-on-attempt-by"></span></p>`;
  }
  contentHTML += `
    <p><strong>Created At:</strong> ${formatDate(verification.created_at)}</p>
    <p><strong>Build status: </strong> ${getStatusIcon(status)} ${getStatusText(status)}</p>
    <p style="display: none;" id="zaps"></p>
    <p style="display: none;" id="endorsements"></p>`;
  if (issueTrackerUrl) {
    contentHTML += buildIssueTrackerLinkHtml(issueTrackerUrl);
  }
  contentHTML += '<div id="comments-container"></div>';
  contentHTML += attachmentsSectionHTML;
  if (outputFilesHTML) {
    contentHTML += `<p><strong>Output files:</strong></p><ul class="attestation-other-attempts">${outputFilesHTML}</ul>`;
  }
  if (otherVerificationsHTML !== '') {
    contentHTML += `<p><strong>Other attempts by this user:</strong> ${otherVerificationsHTML}</p>`;
  }
  contentHTML += `
  <p><strong>Information:</strong></p>
  <div class="markdown-content">
      ${diffoscopeHTML}
      ${asciicastHTML}
      <div>${parsedMarkdown}</div>
  </div>`;

  content.innerHTML = contentHTML;

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
    if (isMobileModal) {
      modalBackdrop.style.background = window.theme === 'dark' ? '#111' : '#fff';
    } else {
      modalBackdrop.style.background = '';
    }
    modalBackdrop.style.display = 'block';
  }
  modal.style.display = 'flex';
  modal.style.flexDirection = 'column';
  setupVerificationModalCloseHandlers(modal, modalBackdrop, content);

  // Store original URL before changing hash
  setOriginalUrlBeforeModal(window.location.pathname + window.location.search);

  // Update hash only if not already set by initial load check
  const currentHash = `#verificationId=${verificationId}`;
  if (window.location.hash !== currentHash) {
    location.hash = currentHash;
  }

  if (numberVerificationAttachments > 0 && !isVerifierOrAssetsPage) {
    const attachmentsListEl = content.querySelector('#verification-attachments-list');
    void populateVerificationAttachmentsList(attachmentsListEl, verificationAttachments);
  }

  void (async () => {
    const [profile, basedOnProfile] = await Promise.all([
      getNostrProfile(verification.pubkey),
      basedOn ? getNostrProfile(basedOn.split(':')[1]) : Promise.resolve(null),
    ]);
    const attemptByEl = document.getElementById('attempt-by');
    if (attemptByEl) {
      attemptByEl.innerHTML = buildVerifierProfileCardHtml(profile, verification.pubkey);
      wireVerifierProfileCard(attemptByEl);
    }
    if (basedOn) {
      const basedOnEl = document.getElementById('based-on-attempt-by');
      if (basedOnEl) {
        basedOnEl.innerHTML = buildVerifierProfileCardHtml(basedOnProfile, basedOn.split(':')[1]);
        wireVerifierProfileCard(basedOnEl);
      }
    }
    setupZapButton(document.getElementById('zapButton'), profile, verification);
  })();

  /* -------------------- Zap -------------------- */
  const zapReceipts = [];

  subscribeToZapReceipts(verification, null, async (zapReceiptEvent) => {
    if (zapReceiptEvent) {
      const zapReceiptInvoice = getTagValue(zapReceiptEvent, "bolt11");
      const descriptionJSON = getTagValue(zapReceiptEvent, "description");
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

      const list = el('div');
      let zapTotalAmount = 0;

      zapReceipts.sort((a, b) => b.zapAmount - a.zapAmount).forEach((zap) => {
        zapTotalAmount += zap.zapAmount;
        const npub = getNpubFromPubkey(zap.zapperPubkey);
        const zapperImageUrl = getProfileImageUrl(zap.zapperProfile);
        const placeholderUrl = PROFILE_PLACEHOLDER_IMAGE;
        const displayName = getProfileDisplayName(zap.zapperProfile, zap.zapperPubkey);
        const titleParts = [displayName];
        if (zap.zapperProfile?.nip05) {
          titleParts.push(zap.zapperProfile.nip05);
        }
        titleParts.push('Click to open in Njump.me');

        const img = el('img', {
          src: zapperImageUrl,
          className: 'profile-image',
          alt: '',
          title: titleParts.join(' - '),
          dataset: { placeholder: placeholderUrl },
        });
        img.addEventListener('error', () => profileImageFallback(img));
        if (npub) {
          img.style.cursor = 'pointer';
          img.addEventListener('click', () => {
            window.open(`https://njump.me/${npub}`, '_blank', 'noopener,noreferrer');
          });
        }

        const details = el('div', {},
          `${formatZapAmount(zap.zapAmount)} sats`,
          el('br'),
          `Zapped by ${displayName} on ${formatDate(zap.created_at, true)}`,
        );
        if (zap.content) {
          details.appendChild(document.createElement('br'));
          details.appendChild(document.createTextNode(`Message: ${zap.content}`));
        }

        list.appendChild(el('div', {
          className: 'profile-card',
          style: { marginLeft: '15px', fontSize: '14px', marginBottom: '13px' },
        }, img, details));
      });

      const zapsElement = document.getElementById('zaps');
      zapsElement.style.display = 'block';
      zapsElement.replaceChildren(
        el('p', {},
          el('strong', {}, `Zaps received for this verification (${formatZapAmount(zapTotalAmount)} sats):`),
          ' ',
          list,
        ),
      );
    }
  });

  /* -------------------- Endorsements -------------------- */
  let endorsementsForThisVerification = [];
  try {
    endorsementsForThisVerification = await loadEndorsementsForVerification(verification.id);
  } catch (error) {
    console.error('Error loading endorsements for verification modal:', error);
  }

  if (endorsementsForThisVerification && endorsementsForThisVerification.length > 0) {
    endorsementsForThisVerification.sort((a, b) => b.created_at - a.created_at);
    const endorserProfiles = await Promise.all(
      endorsementsForThisVerification.map(endorsement => getNostrProfile(endorsement.pubkey))
    );

    const endorsementsList = el('div');
    const placeholderUrl = PROFILE_PLACEHOLDER_IMAGE;
    for (let i = 0; i < endorsementsForThisVerification.length; i++) {
      const endorsement = endorsementsForThisVerification[i];
      const endorserProfile = endorserProfiles[i];
      const validity = getFirstTagValue(endorsement, 'validity');
      const endorserNpub = getNpubFromPubkey(endorsement.pubkey) ?? endorsement.pubkey;
      const endorserImageUrl = getProfileImageUrl(endorserProfile);
      const displayName = getProfileDisplayName(endorserProfile, endorsement.pubkey);
      const titleParts = [displayName];
      if (endorserProfile?.nip05) {
        titleParts.push(endorserProfile.nip05);
      }
      titleParts.push('Click to open in Njump.me');

      const img = el('img', {
        src: endorserImageUrl,
        className: 'profile-image',
        alt: '',
        title: titleParts.join(' - '),
        dataset: { placeholder: placeholderUrl },
      });
      img.addEventListener('error', () => profileImageFallback(img));
      if (endorserNpub) {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
          window.open(`https://njump.me/${endorserNpub}`, '_blank', 'noopener,noreferrer');
        });
      }

      endorsementsList.appendChild(el('div', {
        className: 'profile-card',
        style: { marginTop: '5px', marginLeft: '15px' },
      },
        img,
        ` ${validity === 'valid' ? 'Positive ✅' : 'Negative ❌'} (${formatCommentDate(endorsement.created_at)})`,
      ));
    }
    const endorsementsElement = document.getElementById('endorsements');
    endorsementsElement.style.display = 'block';
    endorsementsElement.replaceChildren(
      el('p', {}, el('strong', {}, 'Endorsements:'), ' ', endorsementsList),
    );
  }

  renderNostrButton({
    container: "#verificationActionButtons",
    verificationId: verification.id
  });

  const deleteVerificationLink = toolbar.querySelector('#deleteVerificationLink');
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

}

function insertDiffoscopeAssets() {
  const diffoscopeCSSExists = document.querySelector('link[href="/assets/css/diffoscope-modal.css"]');
  const diffoscopeJSExists = document.querySelector('script[src="/assets/js/diffoscope-modal.js"]');

  if (!diffoscopeCSSExists) {
    const diffoscopeCSS = document.createElement('link');
    diffoscopeCSS.rel = 'stylesheet';
    diffoscopeCSS.href = '/assets/css/diffoscope-modal.css';
    document.head.appendChild(diffoscopeCSS);
  }

  if (!diffoscopeJSExists) {
    const diffoscopeJS = document.createElement('script');
    diffoscopeJS.src = '/assets/js/diffoscope-modal.js';
    document.head.appendChild(diffoscopeJS);
  }
}

export function registerShowVerificationModal() {
  window.showVerificationModal = showVerificationModal;

  if (window.__wsVerificationUiDelegationRegistered) {
    return;
  }
  window.__wsVerificationUiDelegationRegistered = true;

  document.addEventListener('click', (event) => {
    const card = event.target.closest('.verification-card[data-verification-id]');
    if (card) {
      event.preventDefault();
      window.showVerificationModal(
        card.dataset.sha256Hash || '',
        card.dataset.verificationId || '',
        card.dataset.appId || '',
        card.dataset.platform || '',
      );
      return;
    }

    const endorsementBtn = event.target.closest('.js-open-endorsement');
    if (endorsementBtn) {
      event.preventDefault();
      event.stopPropagation();
      if (typeof window.openEndorsementModal === 'function') {
        window.openEndorsementModal(
          endorsementBtn.dataset.verificationId || '',
          endorsementBtn.dataset.sha256 || '',
        );
      }
      return;
    }

    const blossomFile = event.target.closest('.js-download-blossom-file');
    if (blossomFile) {
      event.preventDefault();
      if (typeof window.downloadBlossomFile === 'function') {
        window.downloadBlossomFile(
          blossomFile.dataset.fileHash || '',
          blossomFile.dataset.fileName || '',
        );
      }
      return;
    }

    const diffoscopeBtn = event.target.closest('.js-open-diffoscope');
    if (diffoscopeBtn) {
      event.preventDefault();
      if (typeof window.openDiffoscopeModal === 'function') {
        window.openDiffoscopeModal(diffoscopeBtn.dataset.diffoscopeUrl || '');
      }
      return;
    }

    const copyHashBtn = event.target.closest('.js-copy-hash');
    if (copyHashBtn) {
      event.preventDefault();
      const text = copyHashBtn.dataset.hash || '';
      if (text && navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          if (typeof window.showToast === 'function') {
            window.showToast(text.includes('\n') ? 'Hashes copied to clipboard' : 'Hash copied to clipboard');
          }
        });
      }
      return;
    }

    if (event.target.closest('.js-show-more-rows')) {
      event.preventDefault();
      if (typeof window.showMoreRows === 'function') {
        window.showMoreRows();
      }
    }
  });

  document.addEventListener('pointerover', (event) => {
    if (event.target.closest?.('.verification-card')) {
      prefetchMarked();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    const card = event.target.closest?.('.verification-card[data-verification-id]');
    if (!card || event.target !== card) {
      return;
    }
    event.preventDefault();
    window.showVerificationModal(
      card.dataset.sha256Hash || '',
      card.dataset.verificationId || '',
      card.dataset.appId || '',
      card.dataset.platform || '',
    );
  });
}
