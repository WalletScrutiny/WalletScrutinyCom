import {
  fetchEvent as nostrFetchEvent,
  signEvent,
  publishEvent,
  subscribeEvents,
  createDeletionRequest,
  createEncryptedDm,
  createEventDraft,
  getNip57ZapSpecFromLud,
  fetchLnInvoice,
  parseZapInvoiceFromReceipt,
  getNip57,
  getTagValue,
  getRelayUrls,
} from './nostr-client.mjs';
import {
  assetRegistrationKind,
  assetBundleRegistrationKind,
  verificationKind,
  endorsementKind,
  verificationDraftKind,
  verificationCommentKind,
  codeSnippetKind,
  verificationReportKind,
  eventRelayUrls,
  mainRelayUrl,
  nip89ClientTagD,
  wsBotPublicKey,
  maxFileAttachmentContentLength,
  isWalletScrutinySiteAdmin,
} from './nostr-constants.mjs';
import { getVerificationReplaceableKey } from './verifications_common.mjs';
import { getNostrProfile } from './nostr-profile.mjs';
import { saveEventsToIDB, deleteCachedEventById } from './nostr-idb.mjs';
import { eventSanitize } from './nostr-sanitize.mjs';
import { showToast } from './toast.mjs';
import {
  ensureNostrSession,
  ensureSignerReady,
  getUserPubkey,
  isNip07SignerAvailable,
} from './nostr-session.mjs';

const REPORT_REASONS = new Set(['spam', 'incorrect']);

function validateSHA256(hashes) {
  if (!hashes || !Array.isArray(hashes) || hashes.length === 0) {
    throw new Error("You must add at least one SHA256 hash");
  }
  for (const hash of hashes) {
    if (!/^[0-9a-f]{64}$/i.test(hash)) {
      throw new Error("Invalid SHA256 hash: must be a 64-character hexadecimal string: " + hash);
    }
  }
}

function getWSClientTags() {
  return [
    ["client", "WalletScrutiny.com", `31990:${wsBotPublicKey}:${nip89ClientTagD}`, mainRelayUrl],
    ["c", "walletscrutiny"]
  ];
}

function getCreatedAt(createdAt) {
  return createdAt ? Math.floor(new Date(createdAt).getTime() / 1000) : Math.floor(new Date().getTime() / 1000);
}

async function publishAppEvent(eventDraft, eventType = 'event') {
  await ensureSignerReady();
  const signed = await signEvent(eventDraft);
  const { successful } = await publishEvent(signed);
  console.debug(`Published ${eventType} (id: ${signed.id}) to ${successful} relays`);
  return signed;
}

function createAppEvent(kind, content, tags = [], createdAt = null) {
  return createEventDraft({
    kind,
    content,
    tags: [...tags, ...getWSClientTags()],
    created_at: getCreatedAt(createdAt),
  });
}

function validateParameterLengths(params) {
  const validationRules = {
    appId: { maxLength: 75, name: 'App ID' },
    version: { maxLength: 30, name: 'Version' },
    platform: { maxLength: 10, name: 'Platform' },
    description: { maxLength: 120, name: 'Description' },
    content: { maxLength: 60000, name: 'Content' },
    issueTrackerUrl: { maxLength: 200, name: 'Issue tracker URL' },
    fileName: { maxLength: 255, name: 'File name' }
  };

  for (const [paramName, value] of Object.entries(params)) {
    if (value && validationRules[paramName]) {
      const rule = validationRules[paramName];
      if (value.length > rule.maxLength) {
        throw new Error(`${rule.name} must be ${rule.maxLength} characters or less`);
      }
    }
  }
}

export async function createAssetRegistration({
  sha256,
  appId,
  version,
  platform,
  description,
  fileName,
  createdAt = null
}) {
  await ensureNostrSession();
  validateSHA256([sha256]);

  if (!appId || !version || !description) {
    throw new Error("Missing required parameters");
  }

  validateParameterLengths({ appId, version, platform, description, fileName });

  const tags = [
    ["x", sha256],
    ["ox", sha256],
    ["i", appId],
    ["version", version]
  ];
  if (platform) {
    tags.push(["platform", platform]);
  }
  if (fileName) {
    tags.push(["file-name", fileName]);
  }

  const event = createAppEvent(assetRegistrationKind, description, tags, createdAt);
  eventSanitize(event);

  const published = await publishAppEvent(event, 'asset registration');
  return published ?? event;
}

export async function createAssetBundleRegistration({
  files,
  appId,
  version,
  platform,
  description,
  createdAt = null
}) {
  await ensureNostrSession();

  if (!Array.isArray(files) || files.length === 0) {
    throw new Error('At least one file is required');
  }

  const hashes = files.map(f => f.sha256);
  validateSHA256(hashes);

  if (!appId || !version || !description) {
    throw new Error('Missing required parameters');
  }

  validateParameterLengths({ appId, version, platform, description });

  for (const file of files) {
    if (file.fileName) {
      validateParameterLengths({ fileName: file.fileName });
    }
  }

  const tags = [
    ['i', appId],
    ['version', version],
  ];
  if (platform) {
    tags.push(['platform', platform]);
  }
  for (const file of files) {
    if (!file.fileName) {
      throw new Error('Each file must have a fileName');
    }
    tags.push(['x', file.sha256, file.fileName]);
  }

  const event = createAppEvent(assetBundleRegistrationKind, description, tags, createdAt);
  eventSanitize(event);

  const published = await publishAppEvent(event, 'asset bundle registration');
  return published ?? event;
}

export async function uploadFileAttachment({ fileName, fileType, fileSize, base64Data }) {
  await ensureNostrSession();

  if (!fileName || !fileType || !base64Data) {
    throw new Error("Missing required parameters for file upload");
  }

  if (fileSize > maxFileAttachmentContentLength) {
    throw new Error(`File ${fileName} exceeds the ${maxFileAttachmentContentLength} bytes limit`);
  }

  const name = fileName.split('.').slice(0, -1).join('.') ?? '';
  const extension = fileName.split('.').pop() ?? '';

  const tags = [
    ["name", name],
    ["extension", extension],
    ["content-type", fileType],
    ["size", fileSize.toString()]
  ];

  const event = createAppEvent(codeSnippetKind, base64Data, tags);

  try {
    const published = await publishAppEvent(event, `file ${fileName}`);
    return { success: true, eventId: published?.id, fileName: fileName };
  } catch (error) {
    console.error(`Error uploading file ${fileName}`, error);
    return { success: false, error: error, fileName: fileName };
  }
}

export async function getVerificationEvent(verificationEventId) {
  if (!verificationEventId) {
    throw new Error('No verification event ID provided');
  }

  await ensureNostrSession();
  return await nostrFetchEvent(verificationEventId);
}

export async function createVerification({
  hashes,
  description,
  content,
  status,
  appId,
  version,
  platform,
  issueTrackerUrl = null,
  createdAt = null,
  isDraft = false,
  draftVerificationEventId = null,
  uploadedFileData = [],
  reusedFileIds = [],
  outputFiles = [],
  basedOn = null
}) {
  await ensureNostrSession();
  validateSHA256(hashes);

  if (!content || !status) {
    throw new Error("Missing required parameters");
  }

  if (!['reproducible', 'not_reproducible', 'ftbfs', 'spam', 'notag', 'nosource', 'warning', 'obfuscated'].includes(status)) {
    throw new Error("Invalid status");
  }

  validateParameterLengths({ appId, version, platform, description, content, issueTrackerUrl });

  let fileUploadResults = [];
  let fileEventIds = [];
  if (uploadedFileData.length > 0) {
    console.log(`Uploading ${uploadedFileData.length} attached file(s) before creating verification...`);
    const uploadPromises = uploadedFileData.map(fileData =>
      uploadFileAttachment({
        fileName: fileData.name,
        fileType: fileData.type,
        fileSize: fileData.size,
        base64Data: fileData.base64Data
      })
    );
    fileUploadResults = await Promise.all(uploadPromises);
    console.log("File upload process completed.", fileUploadResults);

    fileUploadResults.forEach(result => {
      if (result.success && result.eventId) {
        fileEventIds.push(result.eventId);
      }
    });

    const failedUploads = fileUploadResults.filter(r => !r.success);
    if (failedUploads.length > 0) {
      console.error("Some file uploads failed:", failedUploads);
      throw new Error(`Failed to upload file(s): ${failedUploads.map(f => f.fileName).join(', ')}`);
    }
  }

  const fullContent = JSON.stringify({
    description: description || '',
    content: content,
  });

  const tags = [["status", status], ["d", getVerificationReplaceableKey(appId, version, platform, hashes)]];

  if (appId) {
    tags.push(["i", appId]);
  }
  if (version) {
    tags.push(["version", version]);
  }
  if (platform) {
    tags.push(["platform", platform]);
  }
  hashes.forEach(hash => {
    tags.push(["x", hash]);
  });

  if (fileEventIds.length > 0) {
    fileEventIds.forEach(fileEventId => {
      tags.push(["file-attachment", fileEventId]);
    });
  }
  if (reusedFileIds.length > 0) {
    reusedFileIds.forEach(fileEventId => {
      tags.push(["file-attachment", fileEventId]);
    });
  }

  if (outputFiles.length > 0) {
    outputFiles.forEach(file => {
      tags.push(["output-file", file.name, file.hash]);
    });
  }

  if (issueTrackerUrl && issueTrackerUrl.trim()) {
    tags.push(["issue-tracker-url", issueTrackerUrl.trim()]);
  }

  if (basedOn) {
    tags.push(["based-on", basedOn]);
  }

  const event = createAppEvent(
    isDraft ? verificationDraftKind : verificationKind,
    fullContent,
    tags,
    createdAt
  );
  eventSanitize(event);

  const published = await publishAppEvent(event, 'verification');

  if (!isDraft && draftVerificationEventId) {
    const draftVerificationEvent = await getVerificationEvent(draftVerificationEventId);
    if (draftVerificationEvent) {
      await createDeletionRequest(draftVerificationEvent, 'deleting draft, as verification was published', true);
    }
    await deleteCachedEventById(draftVerificationEventId);
  }

  return published ?? event;
}

export async function createVerificationReport({
  verificationEventId,
  reportedPubkey,
  reason
}) {
  await ensureNostrSession();
  if (!verificationEventId || !reportedPubkey) {
    throw new Error('Missing required parameters');
  }
  if (!REPORT_REASONS.has(reason)) {
    throw new Error('Invalid report reason');
  }
  const authorPubkey = await getUserPubkey();
  if (!isWalletScrutinySiteAdmin(authorPubkey)) {
    throw new Error('Only site admins can publish verification reports');
  }

  const tags = [
    ['e', verificationEventId],
    ['p', reportedPubkey],
    ['r', reason]
  ];
  const body = `WalletScrutiny.com admin report: verification ${verificationEventId} as ${reason}.`;
  const event = createAppEvent(verificationReportKind, body, tags);
  eventSanitize(event);
  const published = await publishAppEvent(event, 'verification report');
  const reportEvent = published ?? event;
  await saveEventsToIDB([reportEvent]).catch(e => {
    console.warn('Failed to save verification report to IDB', e);
  });
  return reportEvent;
}

export async function createEndorsement({ validity = null, verificationEventId, endorserNpubkey }) {
  await ensureNostrSession();
  console.debug("Creating attestation (endorsement) for verification: ", verificationEventId);

  if (validity !== null && typeof validity !== 'boolean') {
    throw new Error("Validity must be a boolean value");
  }

  if (!verificationEventId || !endorserNpubkey) {
    throw new Error("Missing required parameters");
  }

  const tags = [
    ["d", `${endorserNpubkey}:${verificationEventId}`],
    ["e", verificationEventId],
    ["validity", validity ? "valid" : "invalid"],
  ];

  const event = createAppEvent(endorsementKind, '', tags);
  await publishAppEvent(event, 'endorsement');
}

export async function createNostrNote(message) {
  await ensureNostrSession();
  if (!message) {
    throw new Error("Message is required");
  }

  const event = createAppEvent(1, message);
  const published = await publishAppEvent(event, 'note');
  return published?.id;
}

export async function createNostrCommentToVerification(verificationKey, comment, commentAuthorPubkeys, messageCounter) {
  await ensureNostrSession();

  const event = createAppEvent(verificationCommentKind, comment);
  event.tags.push(['v', verificationKey]);
  commentAuthorPubkeys.forEach(pubkey => {
    event.tags.push(['p', pubkey]);
  });
  event.tags.push(['d', verificationKey + '-' + messageCounter.toString()]);

  const published = await publishAppEvent(event, 'comment to verification');
  return published?.id;
}

export async function sendPrivateMessageToVerifier(verifierPubkey, commentText) {
  await ensureSignerReady();

  if (!verifierPubkey || !commentText) {
    throw new Error("Missing required parameters: verifierPubkey and commentText are required");
  }

  if (!/^[0-9a-f]{64}$/i.test(verifierPubkey)) {
    throw new Error("Invalid verifier pubkey format");
  }

  try {
    const authorPubkey = await getUserPubkey();
    const signed = await createEncryptedDm(verifierPubkey, commentText, authorPubkey);
    await publishEvent(signed);
    return signed.id;
  } catch (error) {
    console.error('Error encrypting or publishing private message:', error);
    throw new Error(`Failed to send private message: ${error.message}`);
  }
}

export async function deleteDraftVerification(draftVerificationEventId, moveToURL = null, reason = 'user deleted draft verification') {
  if (!draftVerificationEventId) {
    showToast('No draft verification ID found', 'error');
    return;
  }

  if (confirm('Are you sure you want to delete this draft verification? This action cannot be undone.')) {
    try {
      const draftVerificationEvent = await getVerificationEvent(draftVerificationEventId);
      if (draftVerificationEvent) {
        await createDeletionRequest(draftVerificationEvent, reason, true);
      }

      await deleteCachedEventById(draftVerificationEventId);

      showToast('Draft verification deleted successfully');

      if (moveToURL) {
        window.location.href = moveToURL;
      } else {
        window.location.reload();
      }
    } catch (error) {
      showToast(error.message, 'error');
    }
  }
}

export async function deletePublishedVerification(verificationEventId, reason = 'User deleted verification via WalletScrutiny') {
  if (!verificationEventId) {
    showToast('No verification event ID found', 'error');
    return;
  }

  if (!confirm('Are you sure you want to delete this verification? A Nostr deletion request (kind 5) will be sent to relays. This action cannot be undone.')) {
    return;
  }

  try {
    await ensureNostrSession();
    const verificationEvent = await getVerificationEvent(verificationEventId);
    if (!verificationEvent) {
      showToast('Verification event not found on relays', 'error');
      return;
    }

    if (verificationEvent.kind === verificationDraftKind) {
      showToast('Draft verifications are removed with the draft delete action.', 'error');
      return;
    }

    let myPubkey;
    try {
      myPubkey = await getUserPubkey();
    } catch {
      showToast('You need a Nostr browser extension to delete a verification.', 'error');
      return;
    }

    if (verificationEvent.pubkey !== myPubkey) {
      showToast('You can only delete verifications you authored.', 'error');
      return;
    }

    await createDeletionRequest(verificationEvent, reason, true);
    await deleteCachedEventById(verificationEventId);
    showToast('Verification deleted successfully');
    window.location.reload();
  } catch (error) {
    showToast(error.message || String(error), 'error');
  }
}

export async function deleteVerificationComment(commentEventId, reason = 'User deleted verification comment') {
  if (!commentEventId) {
    showToast('No comment event ID found', 'error');
    return false;
  }

  if (!confirm('Do you want to delete this comment?')) {
    return false;
  }

  try {
    await ensureNostrSession();
    const commentEvent = await nostrFetchEvent(commentEventId);
    if (!commentEvent) {
      showToast('Comment not found on relays', 'error');
      return false;
    }

    if (commentEvent.kind !== verificationCommentKind) {
      showToast('This event is not a verification comment.', 'error');
      return false;
    }

    let myPubkey;
    try {
      myPubkey = await getUserPubkey();
    } catch {
      showToast('You need a Nostr browser extension to delete a comment.', 'error');
      return false;
    }

    if (commentEvent.pubkey !== myPubkey) {
      showToast('You can only delete comments you authored.', 'error');
      return false;
    }

    void showToast('Deleting comment, please wait...', 'info', 5000);
    await createDeletionRequest(commentEvent, reason, true);
    showToast('Comment deleted successfully');
    await deleteCachedEventById(commentEventId);

    await new Promise(resolve => setTimeout(resolve, 1000));
    window.location.reload();
  } catch (error) {
    showToast(error.message || String(error), 'error');
    return false;
  }
}

async function buildZapRequestEvent(lnurlSpec, recipientPubkey, amountMsat, relays, comment, extraTags) {
  const nip57Module = await getNip57();

  const zapRequest = nip57Module.makeZapRequest({
    pubkey: recipientPubkey,
    amount: amountMsat,
    comment: comment || '',
    relays: (relays || []).slice(0, 4),
  });

  zapRequest.tags.push(['lnurl', lnurlSpec.callback]);
  if (extraTags) {
    zapRequest.tags = zapRequest.tags.concat(extraTags);
  }

  const eTaggedEvents = new Set();
  const aTaggedEvents = new Set();
  for (const tag of zapRequest.tags) {
    if (tag[0] === 'e') {
      eTaggedEvents.add(tag[1]);
    } else if (tag[0] === 'a') {
      aTaggedEvents.add(tag[1]);
    }
  }
  if (eTaggedEvents.size > 1) {
    throw new Error('Only one e-tag is allowed');
  }
  if (aTaggedEvents.size > 1) {
    throw new Error('Only one a-tag is allowed');
  }

  zapRequest.tags = zapRequest.tags.filter((tag) => tag[0] !== 'p');
  zapRequest.tags.push(['p', recipientPubkey]);
  return signEvent(zapRequest);
}

export async function createZap({ event, amount, comment = '' }) {
  await ensureSignerReady();
  if (!isNip07SignerAvailable()) {
    throw new Error('You must connect a Nostr extension to send a zap');
  }

  const zapTarget = event?.id ? event : null;
  if (!zapTarget?.pubkey || !zapTarget?.id) {
    throw new Error('Invalid verification event for zap');
  }

  const profile = await getNostrProfile(zapTarget.pubkey);
  if (!profile || (!profile.lud16 && !profile.lud06)) {
    throw new Error('The user doesn\'t have a nostr profile or a LN address to receive sats');
  }

  const lnurlSpec = await getNip57ZapSpecFromLud({ lud06: profile.lud06, lud16: profile.lud16 });

  if (!lnurlSpec) {
    throw new Error('The user doesn\'t have a LN address to receive sats');
  }

  const relays = getRelayUrls().slice(0, 4);
  const extraTags = [
    ['p', zapTarget.pubkey],
    ['e', zapTarget.id],
  ];

  const zapRequestEvent = await buildZapRequestEvent(
    lnurlSpec,
    zapTarget.pubkey,
    amount * 1000,
    relays,
    comment,
    extraTags,
  ).catch((err) => {
    console.log('Error: An error occurred in generating zap request!', err);
    return null;
  });
  if (!zapRequestEvent) throw new Error('Failed to generate zap request');
  zapRequestEvent.content = comment;
  console.debug('createZap - zapRequestEvent', zapRequestEvent);

  zapRequestEvent.tags = zapRequestEvent.tags.filter(tag => tag[0] !== 'lnurl');
  zapRequestEvent.tags = zapRequestEvent.tags.filter(tag => tag[0] !== 'a');
  zapRequestEvent.tags = zapRequestEvent.tags.filter(tag => tag[0] !== 'e');
  zapRequestEvent.tags.push(['e', zapTarget.id]);

  const invoice = await fetchLnInvoice(zapRequestEvent, amount * 1000, lnurlSpec).catch((err) => {
    console.log('Error: An error occurred in getting LnInvoice!', err);
    return null;
  });
  if (!invoice) throw new Error('Failed to get LNInvoice');
  console.debug('createZap - invoice', invoice);

  return invoice;
}

export async function subscribeToZapReceipts(zapEvent, currentZapInvoice, receiptReceivedCallback) {
  try {
    const filter = {
      kinds: [9735],
      '#e': [zapEvent.id],
    };
    const sub = subscribeEvents(filter, {
      relayUrls: eventRelayUrls,
      onevent: async (event) => {
        console.debug('subscribeToZapReceipts - Zap receipt event received:', event);
        if (currentZapInvoice) {
          if (getTagValue(event, 'bolt11') === currentZapInvoice) {
            sub.close();
          } else {
            console.debug('    - subscribeToZapReceipts - a zap invoice was received that is not the current zap invoice we are waiting for, so skipping it');
            return;
          }
        }
        const zapReceiptInvoice = getTagValue(event, 'bolt11');
        console.debug('    - subscribeToZapReceipts - zapReceiptInvoice', zapReceiptInvoice, 'currentZapInvoice', currentZapInvoice);
        if (zapReceiptInvoice) {
          const nip57Module = await getNip57();
          const amountPaid = nip57Module.getSatoshisAmountFromBolt11(zapReceiptInvoice);
          const zapRequest = await parseZapInvoiceFromReceipt(event);
          event.zapRequest = zapRequest;
          console.debug('    - zapRequest (parseZapInvoiceFromReceipt)', zapRequest);

          const amountRequested = zapRequest?.amount ? zapRequest.amount / 1000 : -1;

          if (amountPaid === amountRequested) {
            receiptReceivedCallback(event);
            return;
          }

          receiptReceivedCallback(null);
        }
      },
    });
  } catch (error) {
    console.warn("Unable to fetch zap receipt", error);
  }
}

export async function createAuthorizationEvent(verb, content, xTags = [], serverUrl = '', tags = []) {
  await ensureNostrSession();
  const eventObject = {
    kind: 24242,
    created_at: Math.floor(Date.now() / 1000),
    tags: [
      ['t', verb],
      ['expiration', (Math.floor(Date.now() / 1000) + 3600).toString()],
    ],
    content: content,
  };

  tags.forEach(tag => {
    const [key, value] = tag;
    eventObject.tags.push([key, value]);
  });

  xTags.forEach(x => {
    eventObject.tags.push(['x', x]);
  });

  if (serverUrl) {
    eventObject.tags.push(['server', serverUrl]);
  }

  await ensureSignerReady();
  return signEvent(eventObject);
}
