let assetTableResponse = null;
let originalUrlBeforeModal = '';

/** Event id → { verification, sha256Hash }. Merged across paints so a later
 *  table (or a network refresh that skip-repaints) cannot drop ids that are
 *  still visible in the DOM. */
const verificationById = new Map();

function normalizedEventId(id) {
  if (id == null || id === '') {
    return '';
  }
  return String(id).toLowerCase();
}

export function eventIdsMatch(eventId, idToFind) {
  const left = normalizedEventId(eventId);
  const right = normalizedEventId(idToFind);
  return Boolean(left) && left === right;
}

function rememberVerification(verification, sha256Hash) {
  const id = verification?.id;
  if (!id) {
    return;
  }
  const record = { verification, sha256Hash };
  verificationById.set(id, record);
  const lower = normalizedEventId(id);
  if (lower && lower !== id) {
    verificationById.set(lower, record);
  }
}

export function indexVerificationsFromAssetInfo(assetInfo) {
  if (!assetInfo) {
    return;
  }
  const allMaps = [assetInfo.verifications, assetInfo.draftVerifications];
  for (const map of allMaps) {
    if (!map) {
      continue;
    }
    for (const [hash, attestations] of map.entries()) {
      for (const attestation of attestations || []) {
        rememberVerification(attestation, hash);
      }
    }
  }
}

export function setAssetTableResponse(response) {
  assetTableResponse = response;
  indexVerificationsFromAssetInfo(response);
}

export function getAssetTableResponse() {
  return assetTableResponse;
}

export function setOriginalUrlBeforeModal(url) {
  originalUrlBeforeModal = url;
}

export function getOriginalUrlBeforeModal() {
  return originalUrlBeforeModal;
}

export function findIndexedVerificationById(idToFind) {
  if (!idToFind) {
    return null;
  }
  return verificationById.get(idToFind)
    || verificationById.get(normalizedEventId(idToFind))
    || null;
}

export function findVerificationByIdInMaps(assetMapsResponse, idToFind) {
  if (!assetMapsResponse) {
    return null;
  }
  const allMaps = [assetMapsResponse.verifications, assetMapsResponse.draftVerifications];
  for (const map of allMaps) {
    if (map) {
      for (const [hash, attestations] of map.entries()) {
        const found = (attestations || []).find(att => eventIdsMatch(att.id, idToFind));
        if (found) {
          return { verification: found, sha256Hash: hash };
        }
      }
    }
  }
  return null;
}

export function resolveVerificationById(idToFind) {
  if (!idToFind) {
    return null;
  }
  const globalInfo = typeof window !== 'undefined' ? window.allAssetInformation : null;
  return findIndexedVerificationById(idToFind)
    || findVerificationByIdInMaps(assetTableResponse, idToFind)
    || findVerificationByIdInMaps(globalInfo, idToFind);
}

export function clearVerificationIndex() {
  verificationById.clear();
}
