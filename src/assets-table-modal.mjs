import { wsIcon } from './icon.mjs';
import { verificationDraftKind, isWalletScrutinySiteAdmin, verificationReportKind } from "./nostr-constants.mjs";
import { formatDate } from "./format-utils.mjs";
import { formatZapAmount, getStatusText, formatCommentDate } from "./assets-table-utils.mjs";
import { getFirstTagValue } from "./verifications_common.mjs";
import { parseMarkdownToSafeHtml, prefetchMarked } from './marked-loader.mjs';
import { fillReportAuthors, rewriteLegacyReport, shortenReportHashes, tidyBuildServerReport } from './build-server-report.mjs';
import { renderCommentsSection } from './assets-table-comments.mjs';
import {
  getAssetTableResponse,
  setOriginalUrlBeforeModal,
  getOriginalUrlBeforeModal,
  resolveVerificationById,
} from "./assets-table-state.mjs";
import { getVerificationEvent } from "./verifications_utils.mjs";
import {
  loadEndorsementsForVerification,
} from "./assets-table-endorsements.mjs";
import {
  populateVerificationAttachmentsList,
} from "./assets-table-attachments.mjs";
import { el, htmlOf, isSha256Hex, sanitizeHttpUrl } from "./html-utils.mjs";
import './zapModal.mjs';

export function buildEndorsementButtonHtml(verificationId, sha256Hash) {
  return htmlOf(el('button', {
    type: 'button',
    className: 'btn btn-info js-open-endorsement',
    title: 'Endorse this verification',
    dataset: {
      verificationId: verificationId ?? '',
      sha256: sha256Hash ?? '',
    },
  },
    el('span', { className: 'verification-modal-action__icon', 'aria-hidden': 'true', html: wsIcon('circle-check') }),
    'Endorse',
  ));
}

/** A 64-character token between underscores, usually a file hash, as its first and last 3 characters. */
export function shortenOutputFileName(fileName) {
  return String(fileName ?? '').replace(/(?<=_)[A-Za-z0-9]{64}(?=_)/g, token => `${token.slice(0, 3)}...${token.slice(-3)}`);
}

export function buildOutputFileDownloadHtml(fileName, fileHash) {
  return htmlOf(el('li', { className: 'verification-modal-file' },
    el('span', { className: 'verification-modal-file__name', title: fileName ?? '' }, shortenOutputFileName(fileName)),
    el('button', {
      type: 'button',
      className: 'verification-modal-file__action js-download-blossom-file',
      title: `Download ${fileName ?? ''}`,
      dataset: {
        fileHash: fileHash ?? '',
        fileName: fileName ?? '',
      },
      html: wsIcon('download'),
    }),
  ));
}

export function buildDiffoscopeOpenButtonHtml(fileName, fileUrl) {
  return htmlOf(el('button', {
    type: 'button',
    className: 'verification-modal-chip js-open-diffoscope',
    title: 'Open the diffoscope report',
    dataset: { diffoscopeUrl: fileUrl ?? '' },
  },
    el('span', { className: 'verification-modal-action__icon', 'aria-hidden': 'true', html: wsIcon('code-compare') }),
    fileName ?? '',
  ));
}

/**
 * The button that opens the build log viewer on a verification's recording: a compact
 * dark pill with a terminal icon. The recording is only downloaded once it is clicked.
 */
export function buildBuildLogButtonHtml(castHash, fileName, subject) {
  if (!isSha256Hex(castHash)) {
    return '';
  }
  return htmlOf(el('button', {
    type: 'button',
    className: 'build-log-button js-open-build-log',
    title: 'Open the build log',
    dataset: {
      castHash,
      logSubject: subject ?? '',
      logFile: fileName ?? '',
    },
  },
    el('span', { className: 'build-log-button-icon', 'aria-hidden': 'true', html: wsIcon('terminal') }),
    'View build log',
  ));
}

let buildLogViewerPromise;

/** The viewer is its own chunk, fetched the first time a build log is wanted. */
function getBuildLogViewer() {
  buildLogViewerPromise ??= import(/* webpackChunkName: "build-log-viewer" */ './build-log-viewer.mjs')
    .catch((error) => {
      buildLogViewerPromise = undefined;
      throw error;
    });
  return buildLogViewerPromise;
}

export function prefetchBuildLogViewer() {
  getBuildLogViewer().catch(() => {});
}

function openBuildLogFromButton(button) {
  getBuildLogViewer()
    .then(module => module.openBuildLogViewer({
      hash: button.dataset.castHash || '',
      subject: button.dataset.logSubject || '',
      fileName: button.dataset.logFile || '',
    }, button))
    .catch((error) => {
      console.error('build log viewer failed to load:', error);
      if (typeof window.showToast === 'function') {
        window.showToast('The build log viewer could not be loaded');
      }
    });
}

export function buildIssueTrackerLinkHtml(issueTrackerUrl) {
  const safeUrl = sanitizeHttpUrl(issueTrackerUrl);
  if (!safeUrl) {
    return htmlOf(el('p', { className: 'verification-modal-note' },
      el('strong', {}, 'Issue tracker:'),
      ' (invalid URL omitted)',
    ));
  }
  return htmlOf(el('p', { className: 'verification-modal-note' },
    el('strong', {}, 'Issue tracker:'),
    ' ',
    el('a', { href: safeUrl, target: '_blank', rel: 'noopener noreferrer' }, safeUrl),
  ));
}

let pendingVerificationReport = null;
let verificationModalClickHandler = null;
let verificationModalKeyHandler = null;

const PLATFORM_LABELS = { android: 'Android', ios: 'iPhone', desktop: 'Desktop', hardware: 'Hardware' };

function platformLabel(platform) {
  if (!platform) {
    return '';
  }
  return PLATFORM_LABELS[platform] ?? `${platform.charAt(0).toUpperCase()}${platform.slice(1)}`;
}

/** The header above the toolbar; built here when the modal shell on the page predates it. */
function ensureVerificationModalHeading(modal, toolbar) {
  let heading = document.getElementById('verificationModalHeading');
  if (heading) {
    return heading;
  }
  heading = el('div', { id: 'verificationModalHeading', className: 'verification-modal-heading' });
  const header = el('div', { className: 'verification-modal-header' }, heading);
  const closeButton = document.getElementById('closeModal');
  if (closeButton) {
    header.appendChild(closeButton);
  }
  modal.insertBefore(header, toolbar);
  return heading;
}

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
  // Capture phase + stopPropagation: an open overlay consumes Escape so the
  // verification modal underneath stays open.
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && wrap.style.display === 'block') {
      event.stopPropagation();
      closeVerificationReportConfirmModal();
    }
  }, true);
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
    wrap.hidden = true;
    return;
  }
  wrap.hidden = false;

  menu.querySelectorAll('.admin-report-reason').forEach((reasonBtn) => {
    reasonBtn.onclick = (e) => {
      e.stopPropagation();
      menu.style.display = 'none';
      openVerificationReportConfirmModal(verification, reasonBtn.getAttribute('data-reason'));
    };
  });

  reportBtn.onclick = (e) => {
    e.stopPropagation();
    const opening = menu.style.display === 'none' || menu.style.display === '';
    menu.style.display = opening ? 'block' : 'none';
  };
}

export function buildWriteVerificationMenuHtml(verification, sha256Hash, editParams, isDraft) {
  const appId = getFirstTagValue(verification, 'i') || '';
  const version = getFirstTagValue(verification, 'version') || '';
  const platform = getFirstTagValue(verification, 'platform') || '';

  const artifactParams = new URLSearchParams();
  if (isSha256Hex(sha256Hash)) {
    artifactParams.set('sha256', sha256Hash);
  }
  verification.tags
    .filter(tag => tag[0] === 'x' && isSha256Hex(tag[1]) && tag[1] !== sha256Hash)
    .forEach(tag => artifactParams.append('hash', tag[1]));
  if (appId) artifactParams.set('appId', appId);
  if (version) artifactParams.set('version', version);
  if (platform) artifactParams.set('platform', platform);

  const productParams = new URLSearchParams();
  if (appId) productParams.set('appId', appId);
  if (platform) productParams.set('platform', platform);

  const entries = [
    { href: `/new_verification/?${editParams.toString()}`, label: isDraft ? 'From this draft' : 'From this verification' },
    { href: `/new_verification/?${artifactParams.toString()}`, label: 'Of this artifact' },
    { href: `/new_verification/?${productParams.toString()}`, label: 'Of this product' },
    { href: '/new_verification/', label: 'New empty verification' },
  ];

  const items = entries.map(({ href, label }) => htmlOf(el('a', {
    className: 'verification-modal-menu__item write-verification-option',
    href,
  }, label))).join('');

  return `<span id="writeVerificationWrap" class="verification-modal-menu-wrap">
    <button type="button" class="btn btn-info" id="writeVerificationBtn">${wsIcon('pen')} Write verification ${wsIcon('caret-down')}</button>
    <div id="writeVerificationMenu" class="verification-modal-menu" style="display: none;">${items}</div>
  </span>`;
}

function initWriteVerificationMenuControls() {
  const menu = document.getElementById('writeVerificationMenu');
  const writeBtn = document.getElementById('writeVerificationBtn');
  if (!menu || !writeBtn) {
    return;
  }
  menu.style.display = 'none';

  writeBtn.onclick = (e) => {
    e.stopPropagation();
    const opening = menu.style.display === 'none' || menu.style.display === '';
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
  zapBtn.hidden = false;
  if (profile && (profile.lud16 || profile.lud06)) {
    zapBtn.disabled = false;
    zapBtn.title = 'Zap this verification';
    zapBtn.onclick = (e) => {
      e.stopPropagation();
      window.showZapModal({
        onClose: () => {},
        setZapped: () => {},
        zapEvent: verification,
      });
    };
  } else {
    zapBtn.disabled = true;
    zapBtn.onclick = null;
    zapBtn.title = "The user doesn't have a nostr profile or a LN address to receive sats";
  }
}

export async function showVerificationModal(sha256Hash, verificationId, appId, platform) {
  document.body.classList.add("modal-open");
  prefetchMarked();

  let response = getAssetTableResponse();

  let lookup = resolveVerificationById(verificationId);
  if (!lookup && verificationId) {
    const fetched = await getVerificationEvent(verificationId).catch(() => null);
    if (fetched) {
      lookup = {
        verification: fetched,
        sha256Hash: sha256Hash || getFirstTagValue(fetched, 'x'),
      };
    }
  }

  if (!lookup) {
    console.warn('showVerificationModal: verification not found:', verificationId);
    document.body.classList.remove("modal-open");
    return;
  }

  if (!response) {
    response = {
      verifications: new Map(),
      draftVerifications: new Map(),
    };
  }

  const verification = lookup.verification;
  sha256Hash = lookup.sha256Hash || sha256Hash;

  const basedOn = getFirstTagValue(verification, 'based-on');

  const verifications = response.verifications?.get(sha256Hash) || [];
  const draftVerifications = response.draftVerifications?.get(sha256Hash) || [];
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
        <iframe id="diffoscopeFrame" sandbox="allow-scripts" referrerpolicy="no-referrer"></iframe>
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
      window.removeEventListener('keydown', handleKeyDown, true);
    };

    newCancelBtn.onclick = closeModal;
    newCloseBtn.onclick = closeModal;
    modal.onclick = (event) => {
      if (event.target === modal) closeModal();
    };

    // Capture phase + stopPropagation: an open overlay consumes Escape so the
    // verification modal underneath stays open.
    const handleKeyDown = function(event) {
      if (event.key === 'Escape') {
        event.stopPropagation();
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);

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
  const heading = ensureVerificationModalHeading(modal, toolbar);
  toolbar.innerHTML = '';
  content.innerHTML = '';

  // Reset scroll positions before showing the modal again
  setTimeout(() => {
    content.scrollTop = 0;
    content.scrollLeft = 0;
  }, 0);

  const isMine = verification.pubkey === window.userPubkey;
  const isDraft = verification.kind === verificationDraftKind;
  const isMyDraft = isDraft && isMine;

  const version = getFirstTagValue(verification, 'version');
  const identifier = getFirstTagValue(verification, 'i');
  const verificationPlatform = getFirstTagValue(verification, 'platform');
  const wallet = window.wallets.find(w => w.appId === identifier);
  const walletTitle = wallet ? wallet.title : identifier;

  const verificationHashes = verification.tags
    .filter(tag => tag[0] === 'x')
    .map(tag => tag[1])
    .filter(id => isSha256Hex(id));

  /* -------------------- Header: app + version, hash, verdict, platform and date -------------------- */
  const isReproducible = status === 'reproducible';
  const hashesEl = verificationHashes.length > 0
    ? el('div', { className: 'verification-modal-hashes' }, ...verificationHashes.map(hash =>
      el('span', { className: 'verification-modal-hash-row' },
        el('span', { className: 'verification-modal-hash', title: hash }, hash.slice(0, 8)),
        el('button', {
          type: 'button',
          className: 'verification-modal-icon-btn js-copy-hash',
          title: 'Copy entire hash',
          'aria-label': 'Copy entire hash',
          dataset: { hash },
          html: wsIcon('copy'),
        }),
      )))
    : null;
  heading.replaceChildren(...[
    el('h2', { id: 'verificationModalTitle', className: 'verification-modal-title' }, `${walletTitle ?? ''} ${version ?? ''}`.trim()),
    hashesEl,
    el('div', { className: 'verification-modal-badges' },
      el('span', { className: `verification-modal-status verification-modal-status--${isReproducible ? 'good' : 'bad'}` },
        el('span', { className: 'verification-modal-mark', 'aria-hidden': 'true', html: wsIcon(isReproducible ? 'check' : 'xmark') }),
        getStatusText(status, true),
      ),
      isDraft ? el('span', { className: 'verification-draft-badge' }, isMyDraft ? 'Draft, not published yet' : 'Draft') : null,
    ),
    el('p', { className: 'verification-modal-subtitle' },
      [platformLabel(verificationPlatform), formatDate(verification.created_at)].filter(Boolean).join(' · ')),
  ].filter(Boolean));

  /* -------------------- Toolbar: one row of quiet action chips -------------------- */
  let toolbarRowHtml = '<div class="verification-modal-toolbar-row">';
  toolbarRowHtml += `<div class="verification-modal-share" id="verificationShareButtonContainer"></div>`;
  const editParams = new URLSearchParams({ action: 'edit' });
  if (isMyDraft) {
    editParams.set('draftVerificationEventId', verification.id);
  } else {
    editParams.set('verificationEventId', verification.id);
  }
  if (isMine) {
    const title = isDraft ? 'Edit your draft' : 'Edit your verification';
    toolbarRowHtml += htmlOf(el('a', {
      className: 'btn btn-info',
      href: `/new_verification/?${editParams.toString()}`,
      title,
    },
      el('span', { className: 'verification-modal-action__icon', 'aria-hidden': 'true', html: wsIcon('pen') }),
      title,
    ));
  } else {
    if (verification.id && verification.pubkey) {
      editParams.set('basedOn', `${verification.id}:${verification.pubkey}`);
    }
    toolbarRowHtml += buildWriteVerificationMenuHtml(verification, sha256Hash, editParams, isDraft);
  }
  if (!isDraft && !isMine) {
    toolbarRowHtml += buildEndorsementButtonHtml(verification.id, sha256Hash);
  }
  toolbarRowHtml += `<div id="verificationActionButtons"></div>`;
  toolbarRowHtml += `<button type="button" class="btn btn-info" id="zapButton" hidden>${wsIcon('bitcoin')} Zap</button>`;
  toolbarRowHtml += `<span id="adminReportVerificationWrap" class="verification-modal-menu-wrap" hidden>
      <button type="button" class="btn btn-info" id="adminReportVerificationBtn">${wsIcon('triangle-exclamation')} Report ${wsIcon('caret-down')}</button>
      <div id="adminReportVerificationMenu" class="verification-modal-menu" style="display: none;">
        <button type="button" class="verification-modal-menu__item admin-report-reason" data-reason="spam">Report as spam</button>
        <button type="button" class="verification-modal-menu__item admin-report-reason" data-reason="incorrect">Report as incorrect</button>
      </div>
    </span>`;
  toolbarRowHtml += isMine
    ? '<a href="#" id="deleteVerificationLink" class="verification-modal-delete-link">Delete verification</a>'
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

  const verificationAttachments = verification.tags.filter(tag => tag[0] === 'file-attachment');
  const verificationOutputFiles = verification.tags.filter(tag => tag[0] === 'output-file');
  const isVerifierOrAssetsPage = window.location.pathname.includes('/verifier/')
    || window.location.pathname.includes('/assets/');
  const numberVerificationAttachments = verificationAttachments.length;

  let firstAsciicastFileSHA256 = null;
  let firstAsciicastFileName = '';
  let diffoscopeFiles = [];
  let outputFilesHTML = '';
  for (const outputFile of verificationOutputFiles) {
    if (!firstAsciicastFileSHA256 && outputFile[1].includes('.cast') && isSha256Hex(outputFile[2])) {
      firstAsciicastFileSHA256 = outputFile[2];
      firstAsciicastFileName = outputFile[1];
    }
    if (outputFile[1].includes('diffo') && outputFile[1].includes('html') && isSha256Hex(outputFile[2])) {
      diffoscopeFiles.push(outputFile);
    }
    outputFilesHTML += buildOutputFileDownloadHtml(outputFile[1], outputFile[2]);
  }

  let attachmentsSectionHTML = '';
  if (numberVerificationAttachments > 0) {
    if (isVerifierOrAssetsPage) {
      const walletForLink = window.wallets.find(w => w.appId === appId);
      attachmentsSectionHTML = `<p class="verification-modal-note">${numberVerificationAttachments} script(s) used to reproduce this binary.${walletForLink?.url ? ` See <a href="${walletForLink.url}#verificationId=${verificationId}">the wallet page</a> for more details.` : ''}</p>`;
    } else {
      attachmentsSectionHTML = `<ul id="verification-attachments-list" class="verification-modal-files"><li class="verification-modal-note">Loading scripts...</li></ul>`;
    }
  }

  let otherVerificationsHTML = '';
  for (const otherVerification of otherVerificationsBySamePubkey) {
    const otherStatus = getFirstTagValue(otherVerification, 'status');
    otherVerificationsHTML += htmlOf(el('li', { className: 'verification-modal-attempt' },
      el('span', {
        className: `verification-modal-mark verification-modal-mark--${otherStatus === 'reproducible' ? 'good' : 'bad'}`,
        title: getStatusText(otherStatus),
        html: wsIcon(otherStatus === 'reproducible' ? 'check' : 'xmark'),
      }),
      formatDate(otherVerification.created_at),
      el('span', { className: 'verification-modal-attempt__status' }, getStatusText(otherStatus, true)),
    ));
  }

  const itemContent = JSON.parse(verification.content).content;
  const report = rewriteLegacyReport(itemContent, verification.tags) ?? itemContent;
  const parsedMarkdown = shortenReportHashes(await parseMarkdownToSafeHtml(tidyBuildServerReport(report)));

  /* The report's tools: the build log and any diffoscope report, as chips above the text. */
  let reportToolsHTML = firstAsciicastFileSHA256
    ? buildBuildLogButtonHtml(firstAsciicastFileSHA256, firstAsciicastFileName, `${walletTitle} ${version ?? ''}`.trim())
    : '';
  for (const file of diffoscopeFiles) {
    const fileUrl = getBlossomFileURL(file[2]);
    if (fileUrl) {
      reportToolsHTML += buildDiffoscopeOpenButtonHtml(file[1], fileUrl);
    }
  }
  if (reportToolsHTML) {
    reportToolsHTML = `<div class="verification-modal-report-tools">${reportToolsHTML}</div>`;
  }

  const issueTrackerUrl = getFirstTagValue(verification, 'issue-tracker-url') || '';
  const issueTrackerHTML = issueTrackerUrl ? buildIssueTrackerLinkHtml(issueTrackerUrl) : '';

  const sectionHtml = (title, innerHtml, className = '') =>
    `<section class="verification-modal-section${className ? ` ${className}` : ''}">`
    + (title ? `<h3 class="verification-modal-caption">${title}</h3>` : '')
    + `${innerHtml}</section>`;
  const factHtml = (label, valueHtml, { wide = false, ddId = '' } = {}) =>
    `<div class="verification-modal-fact${wide ? ' verification-modal-fact--wide' : ''}"><dt>${label}</dt>`
    + `<dd${ddId ? ` id="${ddId}"` : ''}>${valueHtml}</dd></div>`;

  let factsHTML = '';
  factsHTML += factHtml('Attempt by', '', { ddId: 'attempt-by' });
  if (basedOn) {
    factsHTML += factHtml('Based on an attempt by', '', { ddId: 'based-on-attempt-by' });
  }

  let contentHTML = sectionHtml('', `<dl class="verification-modal-facts">${factsHTML}</dl>`, 'verification-modal-section--facts');
  contentHTML += '<div class="verification-modal-section" id="zaps" style="display: none;"></div>';
  contentHTML += '<div class="verification-modal-section" id="endorsements" style="display: none;"></div>';
  if (attachmentsSectionHTML) {
    contentHTML += sectionHtml('Scripts used to reproduce', attachmentsSectionHTML);
  }
  if (outputFilesHTML) {
    contentHTML += sectionHtml('Output files', `<ul class="verification-modal-files">${outputFilesHTML}</ul>`);
  }
  if (otherVerificationsHTML !== '') {
    contentHTML += sectionHtml('Other attempts by this verifier', `<ul class="verification-modal-attempts">${otherVerificationsHTML}</ul>`);
  }
  contentHTML += '<div id="comments-container" class="verification-modal-section verification-modal-section--comments"></div>';
  contentHTML += sectionHtml('Report', `${reportToolsHTML}${issueTrackerHTML}<div class="markdown-content">${parsedMarkdown}</div>`, 'verification-modal-section--report');

  content.innerHTML = contentHTML;
  void fillReportAuthors(content, async pubkey => getProfileDisplayName(await getNostrProfile(pubkey), pubkey));

  const appIdForTheKey = getFirstTagValue(verification, 'i');
  const versionForTheKey = getFirstTagValue(verification, 'version');
  const platformForTheKey = getFirstTagValue(verification, 'platform');
  const authorPubkeyForTheKey = verification.pubkey;
  const verificationKey = `${appIdForTheKey}:${versionForTheKey}:${platformForTheKey}:${authorPubkeyForTheKey}:${verification.id}`;

  renderCommentsSection(document.getElementById('comments-container'), verificationKey, authorPubkeyForTheKey);

  initVerificationAdminReportControls(verification);
  initWriteVerificationMenuControls();

  if (diffoscopeFiles.length > 0) {
    insertDiffoscopeAssets();
  }

  if (modalBackdrop) {
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

        list.appendChild(el('div', { className: 'profile-card verification-modal-person' }, img, details));
      });

      const zapsElement = document.getElementById('zaps');
      zapsElement.style.display = 'block';
      zapsElement.replaceChildren(
        el('h3', { className: 'verification-modal-caption' }, `Zaps received · ${formatZapAmount(zapTotalAmount)} sats`),
        list,
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

      endorsementsList.appendChild(el('div', { className: 'profile-card verification-modal-person' },
        img,
        el('span', {
          className: `verification-modal-mark verification-modal-mark--${validity === 'valid' ? 'good' : 'bad'}`,
          'aria-hidden': 'true',
          html: wsIcon(validity === 'valid' ? 'check' : 'xmark'),
        }),
        `${validity === 'valid' ? 'Positive' : 'Negative'} (${formatCommentDate(endorsement.created_at)})`,
      ));
    }
    const endorsementsElement = document.getElementById('endorsements');
    endorsementsElement.style.display = 'block';
    endorsementsElement.replaceChildren(
      el('h3', { className: 'verification-modal-caption' }, 'Endorsements'),
      endorsementsList,
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

    const buildLogBtn = event.target.closest('.js-open-build-log');
    if (buildLogBtn) {
      event.preventDefault();
      openBuildLogFromButton(buildLogBtn);
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
    if (event.target.closest?.('.js-open-build-log')) {
      prefetchBuildLogViewer();
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
