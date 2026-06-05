let assetTableResponse = null;
let originalUrlBeforeModal = '';

export function setAssetTableResponse(response) {
  assetTableResponse = response;
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

export function findVerificationByIdInMaps(assetMapsResponse, idToFind) {
  if (!assetMapsResponse) {
    return null;
  }
  const allMaps = [assetMapsResponse.verifications, assetMapsResponse.draftVerifications];
  for (const map of allMaps) {
    if (map) {
      for (const [hash, attestations] of map.entries()) {
        const found = attestations.find(att => att.id === idToFind);
        if (found) {
          return { verification: found, sha256Hash: hash };
        }
      }
    }
  }
  return null;
}
