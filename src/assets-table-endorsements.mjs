let endorsementsData = {};
let endorsementsLoadPromise = null;
let pendingEndorsementIds = [];

export function resetEndorsementsState() {
  endorsementsData = {};
  endorsementsLoadPromise = null;
  pendingEndorsementIds = [];
}

export function setPendingEndorsementIds(ids) {
  pendingEndorsementIds = ids;
  endorsementsLoadPromise = null;
}

export function loadEndorsementsForTable() {
  if (!endorsementsLoadPromise) {
    if (pendingEndorsementIds.length === 0) {
      endorsementsLoadPromise = Promise.resolve(endorsementsData);
    } else {
      endorsementsLoadPromise = getEndorsementsFromVerificationEventIds(pendingEndorsementIds)
        .then(data => {
          endorsementsData = data;
          return data;
        });
    }
  }
  return endorsementsLoadPromise;
}

export async function loadEndorsementsForVerification(verificationId) {
  const tableEndorsements = await loadEndorsementsForTable();
  if (tableEndorsements[verificationId]?.length) {
    return tableEndorsements[verificationId];
  }
  const direct = await getEndorsementsFromVerificationEventIds([verificationId]);
  const endorsements = direct[verificationId] || [];
  if (endorsements.length > 0) {
    endorsementsData = { ...endorsementsData, [verificationId]: endorsements };
  }
  return endorsements;
}
