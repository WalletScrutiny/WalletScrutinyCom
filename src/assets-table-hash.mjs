import { getFirstTagValue } from "./verifications_common.mjs";
import {
  setAssetTableResponse,
  findVerificationByIdInMaps,
  resolveVerificationById,
  indexVerification,
} from "./assets-table-state.mjs";
import { prefetchVerificationAttachments } from "./assets-table-attachments.mjs";
import { getVerificationEvent, eventSanitize, isVerificationReported } from "./verifications_utils.mjs";
import { verificationKind, verificationDraftKind } from "./nostr-constants.mjs";
import { isSha256Hex } from "./html-utils.mjs";

let hashVerificationModalOpened = false;
let earlyHashOpenRegistered = false;
let directFetchPromise = null;
let openedFromDirectFetch = false;
let refreshedAfterDirectOpen = false;
let loadingShellVisible = false;
let loadingShellDismissed = false;

export function getVerificationIdFromHash() {
  if (!location.hash.startsWith('#verificationId=')) {
    return null;
  }
  const params = new URLSearchParams(location.hash.substring(1));
  return params.get('verificationId');
}

function verificationMatchesAppId(verification, effectiveAppId) {
  if (!effectiveAppId) {
    return true;
  }
  const verificationAppId = getFirstTagValue(verification, 'i');
  const appIds = Array.isArray(effectiveAppId) ? effectiveAppId : [effectiveAppId];
  return appIds.includes(verificationAppId);
}

function findGlobalAssetInfoForHash(effectiveAppId, verificationId) {
  if (!verificationId || !window.allAssetInformation) {
    return null;
  }
  const result = findVerificationByIdInMaps(window.allAssetInformation, verificationId);
  if (!result || !verificationMatchesAppId(result.verification, effectiveAppId)) {
    return null;
  }
  return window.allAssetInformation;
}

function isVerificationModalVisible() {
  const modal = document.getElementById('verificationModal');
  return modal != null && modal.style.display === 'flex';
}

function firstVerificationHash(verification) {
  const tag = (verification.tags ?? []).find(t => t[0] === 'x' && isSha256Hex(t[1]));
  return tag ? tag[1] : '';
}

/** Same admission rule as processEventsToResult: verifications, and drafts written by this site. */
function isOpenableVerificationEvent(event) {
  if (event.kind === verificationKind) {
    return true;
  }
  return event.kind === verificationDraftKind && getFirstTagValue(event, 'client') === 'WalletScrutiny.com';
}

function stripVerificationHashFromUrl() {
  history.pushState("", document.title, window.location.pathname + window.location.search);
}

function showModal(verification, sha256Hash, verificationId) {
  loadingShellVisible = false;
  queueMicrotask(() => {
    void window.showVerificationModal(
      sha256Hash,
      verificationId,
      getFirstTagValue(verification, 'i'),
      getFirstTagValue(verification, 'platform'),
    );
  });
}

/**
 * Shows the empty modal with a loading line while the verification is fetched,
 * so a shared link does not look like a plain wallet page for a second or two.
 */
function showLoadingShell(ensureModal) {
  if (loadingShellVisible || loadingShellDismissed || hashVerificationModalOpened) {
    return;
  }
  ensureModal();
  const modal = document.getElementById('verificationModal');
  const content = document.getElementById('verificationContent');
  if (!modal || !content || isVerificationModalVisible()) {
    return;
  }
  content.textContent = '';
  const loading = document.createElement('p');
  loading.className = 'verification-loading';
  loading.textContent = 'Loading verification…';
  content.appendChild(loading);
  modal.style.display = 'flex';
  modal.style.flexDirection = 'column';
  const backdrop = document.getElementById('verificationModalBackdrop');
  if (backdrop) {
    backdrop.style.display = 'block';
  }
  document.body.classList.add('modal-open');
  loadingShellVisible = true;

  const closeButton = document.getElementById('closeModal');
  if (closeButton) {
    closeButton.onclick = (event) => {
      event.stopPropagation();
      loadingShellDismissed = true;
      hideLoadingShell();
      stripVerificationHashFromUrl();
    };
  }
}

/** Closes a modal that was opened from the direct fetch (e.g. the id turned out to be reported). */
function closeDirectlyOpenedModal(verificationId) {
  if (!isVerificationModalVisible() || window.currentVerification?.id !== verificationId) {
    return;
  }
  const modal = document.getElementById('verificationModal');
  const backdrop = document.getElementById('verificationModalBackdrop');
  modal.style.display = 'none';
  modal.style.flexDirection = '';
  if (backdrop) {
    backdrop.style.display = 'none';
  }
  window.currentVerification = null;
  document.body.classList.remove('modal-open');
  stripVerificationHashFromUrl();
}

function hideLoadingShell() {
  if (!loadingShellVisible) {
    return;
  }
  loadingShellVisible = false;
  const modal = document.getElementById('verificationModal');
  const content = document.getElementById('verificationContent');
  const backdrop = document.getElementById('verificationModalBackdrop');
  if (modal) {
    modal.style.display = 'none';
    modal.style.flexDirection = '';
  }
  if (content) {
    content.textContent = '';
  }
  if (backdrop) {
    backdrop.style.display = 'none';
  }
  document.body.classList.remove('modal-open');
}

function openVerificationFromHash(assetInfo, verificationId, { isFinalAttempt = false } = {}) {
  const result = findVerificationByIdInMaps(assetInfo, verificationId)
    || resolveVerificationById(verificationId);
  if (!result) {
    if (isFinalAttempt) {
      if (hashVerificationModalOpened || isVerificationModalVisible()) {
        return false;
      }
      console.warn('Verification ID from URL hash not found:', verificationId);
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
    return false;
  }

  hashVerificationModalOpened = true;
  setAssetTableResponse(assetInfo);
  void prefetchVerificationAttachments(result.verification);

  const { verification, sha256Hash } = result;
  showModal(verification, sha256Hash, verificationId);
  return true;
}

/**
 * Opens the modal from an event fetched by id, before the table data exists.
 * Returns false when the event belongs to another app or the user closed the
 * loading shell meanwhile.
 */
function openVerificationFromDirectFetch(verification, verificationId, effectiveAppId) {
  if (hashVerificationModalOpened || loadingShellDismissed || !verification) {
    return false;
  }
  if (typeof window.showVerificationModal !== 'function') {
    return false;
  }
  if (!isOpenableVerificationEvent(verification) || !verificationMatchesAppId(verification, effectiveAppId)) {
    return false;
  }
  // Relay events reach innerHTML through the modal; the table path sanitizes in
  // processEventsToResult, this path has to do it itself.
  eventSanitize(verification);
  const sha256Hash = firstVerificationHash(verification);
  if (!sha256Hash) {
    return false;
  }

  hashVerificationModalOpened = true;
  openedFromDirectFetch = true;
  indexVerification(verification, sha256Hash);
  void prefetchVerificationAttachments(verification);
  showModal(verification, sha256Hash, verificationId);

  // Admin-reported (spam/incorrect) verifications never enter the table maps.
  // Open first, retract if the report check comes back positive.
  void isVerificationReported(verificationId)
    .catch(() => false)
    .then((reported) => {
      if (reported) {
        console.warn('Verification from URL hash is reported by a site admin, closing:', verificationId);
        closeDirectlyOpenedModal(verificationId);
      }
    });
  return true;
}

/**
 * A modal opened from the direct fetch lacks the "other attempts by this
 * verifier" list, which comes from the table maps. Re-render once when the maps
 * arrive, but only if that list is non-empty and the user has not scrolled yet.
 */
function maybeRefreshDirectlyOpenedModal(assetInfo, verificationId) {
  if (!openedFromDirectFetch || refreshedAfterDirectOpen || !isVerificationModalVisible()) {
    return;
  }
  const result = findVerificationByIdInMaps(assetInfo, verificationId);
  if (!result) {
    return;
  }
  refreshedAfterDirectOpen = true;
  setAssetTableResponse(assetInfo);

  const { verification, sha256Hash } = result;
  const siblings = [
    ...(assetInfo.verifications?.get(sha256Hash) || []),
    ...(assetInfo.draftVerifications?.get(sha256Hash) || []),
  ];
  const hasOtherAttempts = siblings.some(a => a.pubkey === verification.pubkey && a.id !== verification.id);
  const content = document.getElementById('verificationContent');
  if (!hasOtherAttempts || (content && content.scrollTop > 0)) {
    return;
  }
  showModal(verification, sha256Hash, verificationId);
}

export function tryOpenHashVerification(assetInfo, isFinalAttempt, effectiveAppId, verificationId) {
  if (!verificationId || loadingShellDismissed) {
    return;
  }
  if (hashVerificationModalOpened) {
    maybeRefreshDirectlyOpenedModal(assetInfo, verificationId);
    return;
  }

  const candidates = [assetInfo, findGlobalAssetInfoForHash(effectiveAppId, verificationId)];
  for (const candidate of candidates) {
    if (candidate && openVerificationFromHash(candidate, verificationId, { isFinalAttempt: false })) {
      return;
    }
  }

  if (!isFinalAttempt || !window.allAssetInformation) {
    return;
  }
  hideLoadingShell();
  openVerificationFromHash(assetInfo, verificationId, { isFinalAttempt: true });
}

/**
 * Registers the early open paths for a `#verificationId=` link: the modal opens
 * from whichever arrives first, the cached/site-wide maps or a direct fetch of
 * the event by id from the project relay.
 */
export function setupEarlyHashVerificationOpen(effectiveAppId, verificationId, ensureModal) {
  if (!verificationId || earlyHashOpenRegistered) {
    return;
  }
  earlyHashOpenRegistered = true;

  const tryEarlyOpen = () => {
    if (hashVerificationModalOpened || typeof window.showVerificationModal !== 'function') {
      return;
    }
    ensureModal();
    tryOpenHashVerification(window.allAssetInformation || {}, false, effectiveAppId, verificationId);
  };

  window.addEventListener('allAssetInformationLoaded', tryEarlyOpen);
  window.addEventListener('verificationsUILoaded', tryEarlyOpen);
  tryEarlyOpen();

  if (hashVerificationModalOpened) {
    return;
  }

  showLoadingShell(ensureModal);
  directFetchPromise = getVerificationEvent(verificationId)
    .catch((error) => {
      console.warn('Direct fetch of hash verification failed:', error);
      return null;
    })
    .then((verification) => {
      if (!openVerificationFromDirectFetch(verification, verificationId, effectiveAppId)) {
        hideLoadingShell();
      }
    });
}

export function findCachedGlobalAssetInfo(effectiveAppId, verificationId) {
  return verificationId ? findGlobalAssetInfoForHash(effectiveAppId, verificationId) : null;
}

export function scheduleFinalHashVerificationOpen(response, effectiveAppId, verificationId) {
  if (!verificationId || hashVerificationModalOpened) {
    return;
  }

  const runFinalAttempt = async () => {
    // Give the direct fetch its say before declaring the id unknown.
    if (directFetchPromise) {
      await directFetchPromise;
    }
    if (!hashVerificationModalOpened) {
      tryOpenHashVerification(response, true, effectiveAppId, verificationId);
    }
  };

  if (window.allAssetInformation) {
    void runFinalAttempt();
  } else {
    window.addEventListener('allAssetInformationLoaded', () => { void runFinalAttempt(); }, { once: true });
  }
}
