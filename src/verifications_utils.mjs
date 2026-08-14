import * as nip19 from 'nostr-tools/nip19';
import DOMPurify from 'dompurify';
import { verificationKind } from './nostr-constants.mjs';
import { getNostrProfile } from './nostr-profile.mjs';
import { getNpubFromPubkey, shortenNpub, getStatusText } from './verifications_common.mjs';
import { purifyConfig, eventSanitize, getVerificationHashList } from './nostr-sanitize.mjs';
import { showToast } from './toast.mjs';
import {
  nostrConnect,
  getUserPubkey,
  getNostrPool,
  cleanupNostrSession,
} from './nostr-session.mjs';
import {
  createAssetRegistration,
  createAssetBundleRegistration,
  createVerification,
  createEndorsement,
  createVerificationReport,
  createNostrNote,
  createNostrCommentToVerification,
  sendPrivateMessageToVerifier,
  uploadFileAttachment,
  createZap,
  subscribeToZapReceipts,
  createAuthorizationEvent,
} from './verifications-publish.mjs';
import {
  getAllAssetInformation,
  backgroundSyncEvents,
  getEventsFromEventIds,
  getAllAttachmentsForAppId,
  getEndorsementsFromVerificationEventIds,
  getCommentsForVerification,
  getFileAttachmentIDsForVerificationEvent,
  getAppInfoFromEventInfo,
  getMaxAssetVersion,
  getLastVerificationStatusForAppId,
  getWeightForAppFromAssetInformation,
  reportedIdsFromReports,
  groupEndorsementsByVerificationId,
  getVerificationEvent,
} from './verifications-read.mjs';
import {
  setupAppIdAutocomplete,
  loadDraftVerificationsNotifications,
  doDraftVerificationAction,
  deleteDraftVerification,
  deletePublishedVerification,
  deleteVerificationComment,
} from './verifications-ui.mjs';

if (typeof window !== 'undefined') {
  window.DOMPurify = DOMPurify;
  window.nostrConnect = nostrConnect;
  window.createAssetRegistration = createAssetRegistration;
  window.createAssetBundleRegistration = createAssetBundleRegistration;
  window.createVerification = createVerification;
  window.createEndorsement = createEndorsement;
  window.createVerificationReport = createVerificationReport;
  window.createNostrNote = createNostrNote;
  window.getAllAssetInformation = getAllAssetInformation;
  window.backgroundSyncEvents = backgroundSyncEvents;
  window.verificationKind = verificationKind;
  window.getUserPubkey = getUserPubkey;
  window.showToast = showToast;
  window.getNpubFromPubkey = getNpubFromPubkey;
  window.shortenNpub = shortenNpub;
  window.setupAppIdAutocomplete = setupAppIdAutocomplete;
  window.getAppInfoFromEventInfo = getAppInfoFromEventInfo;
  window.nip19 = nip19;
  window.purifyConfig = purifyConfig;
  window.getStatusText = getStatusText;
  window.loadDraftVerificationsNotifications = loadDraftVerificationsNotifications;
  window.doDraftVerificationAction = doDraftVerificationAction;
  window.getVerificationEvent = getVerificationEvent;
  window.deleteDraftVerification = deleteDraftVerification;
  window.deletePublishedVerification = deletePublishedVerification;
  window.deleteVerificationComment = deleteVerificationComment;
  window.getFileAttachmentIDsForVerificationEvent = getFileAttachmentIDsForVerificationEvent;
  window.uploadFileAttachment = uploadFileAttachment;
  window.getEventsFromEventIds = getEventsFromEventIds;
  window.getAllAttachmentsForAppId = getAllAttachmentsForAppId;
  window.getMaxAssetVersion = getMaxAssetVersion;
  window.getLastVerificationStatusForAppId = (appId, platform) =>
    getLastVerificationStatusForAppId(window.allAssetInformation, appId, platform);
  window.getWeightForAppFromAssetInformation = (appId) =>
    getWeightForAppFromAssetInformation(window.allAssetInformation, appId);
  window.cleanupNostrSession = cleanupNostrSession;
  window.createNostrCommentToVerification = createNostrCommentToVerification;
  window.getCommentsForVerification = getCommentsForVerification;
  window.sendPrivateMessageToVerifier = sendPrivateMessageToVerifier;
  window.getEndorsementsFromVerificationEventIds = getEndorsementsFromVerificationEventIds;
  window.createZap = createZap;
  window.subscribeToZapReceipts = subscribeToZapReceipts;
  window.createAuthorizationEvent = createAuthorizationEvent;
  window.addEventListener('beforeunload', () => {
    cleanupNostrSession();
  });
}

export {
  nostrConnect,
  createAssetRegistration,
  createAssetBundleRegistration,
  createVerification,
  createEndorsement,
  createVerificationReport,
  createNostrNote,
  getNostrProfile,
  getAllAssetInformation,
  getUserPubkey,
  getNostrPool,
  showToast,
  getNpubFromPubkey,
  shortenNpub,
  setupAppIdAutocomplete,
  getAppInfoFromEventInfo,
  nip19,
  purifyConfig,
  getStatusText,
  loadDraftVerificationsNotifications,
  doDraftVerificationAction,
  getVerificationEvent,
  deleteDraftVerification,
  deletePublishedVerification,
  deleteVerificationComment,
  getFileAttachmentIDsForVerificationEvent,
  uploadFileAttachment,
  getEventsFromEventIds,
  getAllAttachmentsForAppId,
  getMaxAssetVersion,
  getLastVerificationStatusForAppId,
  getWeightForAppFromAssetInformation,
  createNostrCommentToVerification,
  getCommentsForVerification,
  sendPrivateMessageToVerifier,
  getEndorsementsFromVerificationEventIds,
  createZap,
  subscribeToZapReceipts,
  createAuthorizationEvent,
  reportedIdsFromReports,
  eventSanitize,
  getVerificationHashList,
  groupEndorsementsByVerificationId,
  cleanupNostrSession,
};
