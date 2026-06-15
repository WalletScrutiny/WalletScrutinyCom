import { getFirstTagValue } from "./verifications_common.mjs";
import { setAssetTableResponse, findVerificationByIdInMaps } from "./assets-table-state.js";
import { prefetchVerificationAttachments } from "./assets-table-attachments.js";

let hashVerificationModalOpened = false;
let earlyHashOpenRegistered = false;

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

function openVerificationFromHash(assetInfo, verificationId, { isFinalAttempt = false } = {}) {
  const result = findVerificationByIdInMaps(assetInfo, verificationId);
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
  queueMicrotask(() => {
    void window.showVerificationModal(
      sha256Hash,
      verificationId,
      getFirstTagValue(verification, 'i'),
      getFirstTagValue(verification, 'platform'),
    );
  });
  return true;
}

export function tryOpenHashVerification(assetInfo, isFinalAttempt, effectiveAppId, verificationId) {
  if (hashVerificationModalOpened || !verificationId) {
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
  openVerificationFromHash(assetInfo, verificationId, { isFinalAttempt: true });
}

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
}

export function findCachedGlobalAssetInfo(effectiveAppId, verificationId) {
  return verificationId ? findGlobalAssetInfoForHash(effectiveAppId, verificationId) : null;
}

export function scheduleFinalHashVerificationOpen(response, effectiveAppId, verificationId) {
  if (!verificationId || hashVerificationModalOpened) {
    return;
  }

  const runFinalAttempt = () => {
    if (!hashVerificationModalOpened) {
      tryOpenHashVerification(response, true, effectiveAppId, verificationId);
    }
  };

  if (window.allAssetInformation) {
    runFinalAttempt();
  } else {
    window.addEventListener('allAssetInformationLoaded', runFinalAttempt, { once: true });
  }
}
