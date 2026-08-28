import * as nip19 from 'nostr-tools/nip19';
import {
  connectNostr,
  disconnectNostr,
  getPool,
  getRelayUrls,
  fetchEvents as nostrFetchEvents,
  fetchEvent as nostrFetchEvent,
  fetchEventsWithPagination,
  signEvent,
  publishEvent,
  publishToRelays,
  subscribeEvents,
  createDeletionRequest,
  createEncryptedDm,
  createEventDraft,
  getNip57ZapSpecFromLud,
  fetchLnInvoice,
  parseZapInvoiceFromReceipt,
  getNip57,
  getTagValue,
  getMatchingTags,
  getUserPubkeyFromSigner,
} from './nostr-client.mjs';
import DOMPurify from 'dompurify';
import {
  assetRegistrationKind,
  assetBundleRegistrationKind,
  verificationKind,
  endorsementKind,
  verificationDraftKind,
  verificationCommentKind,
  codeSnippetKind,
  verificationReportKind,
  explicitRelayUrls,
  eventRelayUrls,
  verificationEventsSinceTS,
  mainRelayUrl,
  defaultRelayPaginationPageLimit,
  relayPaginationPageLimits,
  nip89ClientTagD,
  wsBotPublicKey,
  maxFileAttachmentContentLength,
  siteAdminPubkeys,
  isWalletScrutinySiteAdmin,
} from "./nostr-constants.mjs";
import { waitNostr } from 'nip07-awaiter';
import { getFirstTagValue, getStatusText, getVerificationReplaceableKey } from './verifications_common.mjs';
import {
  assetRegistrationKinds,
  getAssetFileEntries,
  getAssetIndexHashes,
} from './asset-utils.mjs';
import { formatDate } from './format-utils.mjs';
import { getNostrProfile } from './nostr-profile.mjs';
import { isSha256Hex, stripHtmlTags } from './html-utils.mjs';

// Configure DOMPurify to be more restrictive
const purifyConfig = {
  ALLOWED_TAGS: ['div'], // No HTML tags allowed
  ALLOWED_ATTR: ['id'], // Allow id attribute
  SANITIZE_DOM: true,
  WHOLE_DOCUMENT: false,
  RETURN_DOM_FRAGMENT: false,
  RETURN_DOM: false,
  RETURN_TRUSTED_TYPE: false
};

let nostrConnectionPromise = null;
let signerReadyPromise = null;
let hasNip07Signer = false;
let resolveNostrConnectInitiated;
const nostrConnectInitiatedPromise = new Promise(resolve => {
  resolveNostrConnectInitiated = resolve;
});

const connectTimeout = 5;
const nip07WaitTimeoutMs = 3125;

const assignSigner = async function() {
  const nip07 = await waitNostr(nip07WaitTimeoutMs);
  if (nip07) {
    console.debug("Signer: Using browser extension");
    hasNip07Signer = true;
    return;
  }

  hasNip07Signer = false;
  console.debug("Signer: No browser extension available");
};

const nostrConnect = function () {
  let resolveSignerReady;
  signerReadyPromise = new Promise((resolve) => {
    resolveSignerReady = resolve;
  });

  nostrConnectionPromise = (async () => {
    try {
      await connectNostr({
        relayUrls: eventRelayUrls,
        connectTimeoutMs: connectTimeout * 1000,
        onRelayConnect: (relay) => {
          console.debug(`Connected to relay: ${relay.url}`);
        },
        onRelayDisconnect: (relay) => {
          console.debug(`Disconnected from relay: ${relay.url}`);
        },
        onRelayError: (relay, error) => {
          console.debug(`Relay error (${relay.url}):`, error);
        },
      });
      console.log("Nostr connected successfully.");
      void assignSigner().finally(() => resolveSignerReady());
    } catch (e) {
      console.error("nostr connect failed", e);
      if (typeof window !== 'undefined') {
        showToast('It was impossible to connect to Nostr. Please check your browser extension and try again.', 'error');
      }
      resolveSignerReady();
      throw e;
    }
  })();

  resolveNostrConnectInitiated();
  console.debug("nostrConnect initiated, nostrConnectionPromise is set.");

  return nostrConnectionPromise;
};

const ensureNostrConnected = async () => {
  if (!nostrConnectionPromise) {
    await nostrConnectInitiatedPromise;
  }
  await nostrConnectionPromise;
  if (!getPool()) {
    throw new Error("Nostr pool not initialized after connection.");
  }
};

const ensureSignerReady = async () => {
  await ensureNostrConnected();
  if (signerReadyPromise) {
    await signerReadyPromise;
  }
};

const getUserPubkey = async function() {
  await ensureSignerReady();
  if (!hasNip07Signer) {
    throw new Error("No signer available");
  }
  return getUserPubkeyFromSigner();
}

const validateSHA256 = function(hashes) {
  if (!hashes || !Array.isArray(hashes) || hashes.length === 0) {
    throw new Error("You must add at least one SHA256 hash");
  }
  for (const hash of hashes) {
    if (!/^[0-9a-f]{64}$/i.test(hash)) {
      throw new Error("Invalid SHA256 hash: must be a 64-character hexadecimal string: " + hash);
    }
  }
}

const getNpubFromPubkey = function (pubkey) {
  return nip19.npubEncode(pubkey);
}

const shortenNpub = function (npub) {
  if (!npub || npub.length < 16) return npub;
  return `${npub.substring(0, 10)}…${npub.substring(npub.length - 6)}`;
}

const getWSClientTags = function() {
  return [
    ["client", "WalletScrutiny.com", `31990:${wsBotPublicKey}:${nip89ClientTagD}`, mainRelayUrl],
    ["c", "walletscrutiny"]
  ];
}

async function signAndPublish(eventDraft, eventType = 'event') {
  await ensureSignerReady();
  const signed = await signEvent(eventDraft);
  const { successful } = await publishEvent(signed);
  if (successful < 1) {
    throw new Error(`Failed to publish ${eventType} to any relay`);
  }
  console.debug(`Published ${eventType} (id: ${signed.id}) to ${successful} relays`);
  return signed;
}

function createNostrEvent(kind, content, tags = [], createdAt = null) {
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

const createAssetRegistration = async function ({
                                                  sha256,
                                                  appId,
                                                  version,
                                                  platform,
                                                  description,
                                                  fileName,
                                                  createdAt = null
                                                }) {
  await ensureNostrConnected();
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

  const eventDraft = createNostrEvent(assetRegistrationKind, description, tags, createdAt);
  eventSanitize(eventDraft);

  return await signAndPublish(eventDraft, 'asset registration');
}

const createAssetBundleRegistration = async function ({
  files,
  appId,
  version,
  platform,
  description,
  createdAt = null
}) {
  await ensureNostrConnected();

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

  const eventDraft = createNostrEvent(assetBundleRegistrationKind, description, tags, createdAt);
  eventSanitize(eventDraft);

  return await signAndPublish(eventDraft, 'asset bundle registration');
}

const createVerification = async function ({
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
  await ensureNostrConnected();
  validateSHA256(hashes);

  if (!content || !status) {
    throw new Error("Missing required parameters");
  }

  if (!['reproducible', 'not_reproducible', 'ftbfs', 'spam', 'notag', 'nosource', 'warning', 'obfuscated'].includes(status)) {
    throw new Error("Invalid status");
  }

  validateParameterLengths({ appId, version, platform, description, content, issueTrackerUrl });

  // --- Upload Files Before Main Event Creation ---
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

    // Collect successful file event IDs
    fileUploadResults.forEach(result => {
      if (result.success && result.eventId) {
        fileEventIds.push(result.eventId);
      }
    });

    // Handle potential upload failures
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

  // Add file event IDs as tags
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

  const eventDraft = createNostrEvent(
    isDraft ? verificationDraftKind : verificationKind,
    fullContent,
    tags,
    createdAt
  );
  eventSanitize(eventDraft);

  const published = await signAndPublish(eventDraft, 'verification');

  if (!isDraft && draftVerificationEventId) {
    const draftVerificationEvent = await getVerificationEvent(draftVerificationEventId);
    if (draftVerificationEvent) {
      await createDeletionRequest(draftVerificationEvent, 'deleting draft, as verification was published', true);
    }
    await deleteCachedEventById(draftVerificationEventId);
  }

  return published;
}

const REPORT_REASONS = new Set(['spam', 'incorrect']);
const EVENT_ID_HEX_RE = /^[0-9a-f]{64}$/i;

/**
 * Verification ids to hide from admin verification-report events.
 * Non-admin authors, unknown reasons, and e tags outside requestedIds are ignored.
 */
function reportedIdsFromReports(reportEvents, requestedIds) {
  const requested = new Set(requestedIds);
  const reported = new Set();
  if (!requested.size) {
    return reported;
  }

  for (const ev of reportEvents) {
    if (!isWalletScrutinySiteAdmin(ev.pubkey)) {
      continue;
    }
    if (!REPORT_REASONS.has(getFirstTagValue(ev, 'r', null))) {
      continue;
    }
    for (const t of ev.tags || []) {
      if (t[0] !== 'e') {
        continue;
      }
      const eventId = t[1];
      if (eventId && EVENT_ID_HEX_RE.test(eventId) && requested.has(eventId)) {
        reported.add(eventId);
      }
    }
  }
  return reported;
}

const VERIFICATION_REPORT_FETCH_CHUNK = 30;

/**
 * Homepage loads every verification (no appId/sha256/pubkey). Chunking those ids
 * into #e filters would mean dozens of relay queries. Fetch all admin reports
 * instead and intersect client-side. Scoped wallet-page loads keep #e chunks.
 */
function buildVerificationReportFilters(verificationEventIds, { unscoped = false } = {}) {
  if (!verificationEventIds.length) {
    return [];
  }
  const baseFilter = {
    kinds: [verificationReportKind],
    authors: siteAdminPubkeys,
    since: verificationEventsSinceTS
  };
  if (unscoped) {
    return [baseFilter];
  }
  const filters = [];
  for (let i = 0; i < verificationEventIds.length; i += VERIFICATION_REPORT_FETCH_CHUNK) {
    filters.push({
      ...baseFilter,
      '#e': verificationEventIds.slice(i, i + VERIFICATION_REPORT_FETCH_CHUNK)
    });
  }
  return filters;
}

/**
 * Fetches verification-report events for the given verification ids.
 * Relay author filter is an optimization; pubkey and reason are re-checked client-side.
 */
async function fetchReportsForVerificationIds(verificationEventIds, { unscoped = false } = {}) {
  const reported = new Set();
  const filters = buildVerificationReportFilters(verificationEventIds, { unscoped });
  if (!filters.length) {
    return reported;
  }
  await ensureNostrConnected();
  for (const filter of filters) {
    try {
      const batch = await nostrFetchEvents(filter);
      if (batch.size > 0) {
        await saveEventsToIDB(batch).catch(e => {
          console.warn('Failed to save verification reports to IDB', e);
        });
      }
      for (const eventId of reportedIdsFromReports(batch, verificationEventIds)) {
        reported.add(eventId);
      }
    } catch (e) {
      console.warn('fetchReportsForVerificationIds: chunk failed', e);
    }
  }
  return reported;
}

const createVerificationReport = async function ({
  verificationEventId,
  reportedPubkey,
  reason
}) {
  await ensureNostrConnected();
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
  const eventDraft = createNostrEvent(verificationReportKind, body, tags);
  eventSanitize(eventDraft);
  const reportEvent = await signAndPublish(eventDraft, 'verification report');
  await saveEventsToIDB([reportEvent]).catch(e => {
    console.warn('Failed to save verification report to IDB', e);
  });
  return reportEvent;
};

const createEndorsement = async function ({validity = null, verificationEventId, endorserNpubkey}) {
  await ensureNostrConnected();
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

  const eventDraft = createNostrEvent(endorsementKind, '', tags);
  await signAndPublish(eventDraft, 'endorsement');
}

function getCreatedAt(createdAt) {
  return createdAt ? Math.floor(new Date(createdAt).getTime() / 1000) : Math.floor(new Date().getTime() / 1000);
}

const getTimestampMonthsAgo = function(months = 6) {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return Math.floor(date.getTime() / 1000); // Convert to Unix timestamp (seconds)
}

function isValidJSONObject(str) {
  try {
    const parsed = JSON.parse(str);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed);
  } catch (e) {
    return false;
  }
}

/**
 * Markdown body of a verification is sanitized at render time (marked → sanitizeRichHtml).
 * At ingest we only length-limit so legitimate markdown syntax is preserved.
 */
function sanitizeVerificationMarkdownContent(content) {
  if (!content) {
    return content;
  }
  return String(content).substring(0, 60000);
}

const sanitizedEvents = new WeakSet();

function canUseDomPurify() {
  // linkedom can expose a sanitize() that is a no-op when isSupported is not true
  return Boolean(DOMPurify?.isSupported && typeof DOMPurify.sanitize === 'function');
}

function purifyText(value) {
  if (canUseDomPurify()) {
    return DOMPurify.sanitize(value, purifyConfig);
  }
  // No DOM for DOMPurify (unit tests): strip tags, keep ordinary punctuation.
  return stripHtmlTags(value);
}

function eventSanitize(event) {
  if (sanitizedEvents.has(event)) {
    return;
  }

  // Sanitize content
  if (isValidJSONObject(event.content)) {
    const contentObject = JSON.parse(event.content);

    Object.keys(contentObject).forEach(key => {
      let sanitizedContent;
      if (key === 'content') {
        sanitizedContent = sanitizeVerificationMarkdownContent(contentObject[key]);
      } else {
        // For other fields like 'description', sanitize to strip any HTML.
        sanitizedContent = purifyText(contentObject[key]);
      }

      if (key === 'description') {
        sanitizedContent = sanitizedContent.substring(0, 120);
      }

      contentObject[key] = sanitizedContent;
    });

    event.content = JSON.stringify(contentObject);
  } else {
    event.content = purifyText(event.content);
    event.content = event.content.substring(0, 120);
  }

  // Sanitize tags (attribute-bound values: neutralize quote breakout chars)
  event.tags.forEach(tag => {
    if (tag[1] == null) {
      return;
    }
    let sanitizedTag = purifyText(tag[1]);

    // Tags are interpolated into HTML attributes / handlers historically; strip both
    // quote types. Do not apply this to JSON content fields (see description above).
    sanitizedTag = sanitizedTag.replace(/["']/g, '');

    if (tag[0] === 'i') {
      sanitizedTag = sanitizedTag.substring(0, 75);
    } else if (tag[0] === 'version') {
      sanitizedTag = sanitizedTag.substring(0, 30);
    } else if (['x', 'ox'].includes(tag[0])) {
      sanitizedTag = sanitizedTag.substring(0, 64);
    } else if (tag[0] === 'platform') {
      sanitizedTag = sanitizedTag.substring(0, 10);
    } else if (tag[0] === 'status') {
      sanitizedTag = sanitizedTag.substring(0, 16);
    }

    tag[1] = sanitizedTag;
  });

  sanitizedEvents.add(event);
}

const getFileAttachmentIDsForVerificationEvent = function(event) {
  const tags = getMatchingTags(event, 'file-attachment');
  return tags.map(tag => tag[1]).filter(id => id?.length === 64);
}

const uploadFileAttachment = async function({ fileName, fileType, fileSize, base64Data }) {
  await ensureNostrConnected();

  if (!fileName || !fileType || !base64Data) {
    throw new Error("Missing required parameters for file upload");
  }

  if (fileSize > maxFileAttachmentContentLength) { // Double check size
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

  const eventDraft = createNostrEvent(codeSnippetKind, base64Data, tags);

  try {
    const published = await signAndPublish(eventDraft, `file ${fileName}`);
    return { success: true, eventId: published.id, fileName: fileName };
  } catch (error) {
    console.error(`Error uploading file ${fileName}`, error);
    return { success: false, error: error, fileName: fileName };
  }
}

const getEventsFromEventIds = async function(eventIds) {
  await ensureNostrConnected();

  if (!eventIds || eventIds.length === 0) {
    console.debug(`No event-ids found on verification event ${eventIds}.`);
    return [];
  }

  console.debug(`Fetching ${eventIds.length} events: ${eventIds.join(', ')}`);

  return await nostrFetchEvents({
    ids: eventIds
  });
}

const getEndorsementsFromVerificationEventIds = async function(verificationEventIds) {
  await ensureNostrConnected();
  const endorsements = await nostrFetchEvents({
    kinds: [endorsementKind],
    '#e': verificationEventIds
  });

  // Group endorsements by the value of the 'e' tag (verification event id)
  const grouped = {};
  for (const endorsement of endorsements) {
    const eTag = endorsement.tags?.find(tag => tag[0] === 'e' && tag[1]?.length === 64);
    if (eTag?.[1]) {
      if (!grouped[eTag[1]]) {
        grouped[eTag[1]] = [];
      }
      grouped[eTag[1]].push(endorsement);
    }
  }
  return grouped;
}

const getAllAttachmentsForAppId = async function(appId, appAssetInformation = null) {
  if (!appAssetInformation) {
    appAssetInformation = await getAllAssetInformation({
      appId
    });
  }

  const attachments = [];
  const promises = [];

  for (const sha256VerificationGroup of appAssetInformation.verifications.values()) {
    for (const verification of sha256VerificationGroup) {
      const fileEventIds = getFileAttachmentIDsForVerificationEvent(verification);
      if (fileEventIds.length > 0) {
        promises.push(
          getEventsFromEventIds(fileEventIds).then(fileAttachmentEvents => {
            fileAttachmentEvents.forEach(attachmentEvent => {
              if (attachmentEvent.kind === codeSnippetKind) {
                // Add the parent verification event to the attachment
                attachmentEvent.parentVerificationEvent = verification;
                attachments.push(attachmentEvent);
              }
            });
          })
        );
      }
    }
  }

  await Promise.all(promises);  // Wait for all promises to resolve before continuing

  return attachments;
}

function buildRelayPaginationOptions(relayUrls) {
  return {
    relayUrls,
    relayPageLimits: relayPaginationPageLimits,
    pageLimit: defaultRelayPaginationPageLimit,
  };
}

function getMainRelayPageLimit() {
  return relayPaginationPageLimits[mainRelayUrl] ?? defaultRelayPaginationPageLimit;
}

async function fetchVerificationEventsWithPagination(baseFilter, options) {
  const kindFilters = [verificationKind, verificationDraftKind].map(kind => ({
    ...baseFilter,
    kinds: [kind],
  }));

  const pages = await Promise.all(
    kindFilters.map(kindFilter => fetchEventsWithPagination(kindFilter, options))
  );

  const merged = new Set();
  for (const page of pages) {
    for (const event of page) {
      merged.add(event);
    }
  }
  return merged;
}

const mainRelayPaginationOptions = buildRelayPaginationOptions([mainRelayUrl]);
const supplementalRelayPaginationOptions = buildRelayPaginationOptions(
  eventRelayUrls.filter(url => url !== mainRelayUrl)
);

// IndexedDB Helper Functions
const dbName = 'WalletScrutinyDB';
const dbVersion = 4;
const eventsStoreName = 'events';
const profilesStoreName = 'profiles';

let dbOpenPromise = null;

const initDB = () => {
  if (dbOpenPromise) {
    return dbOpenPromise;
  }

  dbOpenPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      dbOpenPromise = null;
      reject(new Error("IndexedDB is not available"));
      return;
    }
    const request = window.indexedDB.open(dbName, dbVersion);
    request.onerror = (event) => {
      dbOpenPromise = null;
      reject("IndexedDB error: " + event.target.errorCode);
    };
    request.onsuccess = (event) => resolve(event.target.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const oldVersion = event.oldVersion;

      // v4: drop stale events from incomplete pre-pagination-fix syncs; profiles are kept.
      if (oldVersion > 0 && oldVersion < 4 && db.objectStoreNames.contains(eventsStoreName)) {
        db.deleteObjectStore(eventsStoreName);
        console.log('Cleared events store for IDB v4 migration');
      }

      // Create events store with indexes
      if (!db.objectStoreNames.contains(eventsStoreName)) {
        const eventsStore = db.createObjectStore(eventsStoreName, { keyPath: 'id' });
        eventsStore.createIndex('created_at', 'created_at', { unique: false });
        eventsStore.createIndex('kind', 'kind', { unique: false });
        eventsStore.createIndex('kind_createdAt', ['kind', 'created_at'], { unique: false });
        eventsStore.createIndex('pubkey', 'pubkey', { unique: false });
        console.log('Created events object store with indexes');
      }

      // Create profiles store
      if (!db.objectStoreNames.contains(profilesStoreName)) {
        const profilesStore = db.createObjectStore(profilesStoreName, { keyPath: 'pubkey' });
        profilesStore.createIndex('cached_at', 'cached_at', { unique: false });
        console.log('Created profiles object store');
      }
    };
  });

  return dbOpenPromise;
};

/**
 * Save events to IDB - stores all events as-is
 * Deduplication is done application-side when reading (for verifications: by hash+pubkey)
 * @param {Array|Set} events - Events to save
 * @returns {Promise<number>} Number of events saved
 */
const saveEventsToIDB = async (events) => {
  const db = await initDB().catch(() => null);
  if (!db) return 0;

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([eventsStoreName], "readwrite");
    const objectStore = transaction.objectStore(eventsStoreName);

    let savedCount = 0;
    const eventsArray = Array.isArray(events) ? events : Array.from(events);

    eventsArray.forEach(event => {
      const rawEvent = event.rawEvent ? event.rawEvent() : (event.toNostrEvent ? event.toNostrEvent() : event);
      const request = objectStore.put(rawEvent);
      request.onsuccess = () => savedCount++;
    });

    transaction.oncomplete = () => {
      console.debug(`Saved ${savedCount} events to IDB`);
      resolve(savedCount);
    };
    transaction.onerror = () => reject("Error saving events to IDB");
  });
};

/**
 * Removes a single Nostr event from the IndexedDB cache (events store keyPath: id).
 * Used after publishing a deletion (kind 5) so reload does not resurrect stale data.
 */
const deleteCachedEventById = async (eventId) => {
  if (!eventId) {
    return;
  }
  const db = await initDB().catch(() => null);
  if (!db) {
    return;
  }

  return new Promise((resolve) => {
    const transaction = db.transaction([eventsStoreName], 'readwrite');
    const objectStore = transaction.objectStore(eventsStoreName);
    const request = objectStore.delete(eventId);
    request.onerror = () => {
      console.warn('Failed to remove event from IDB cache:', eventId, request.error);
    };
    transaction.oncomplete = () => {
      console.debug(`Removed event ${eventId} from IDB cache`);
      resolve();
    };
    transaction.onerror = () => {
      console.warn('IDB transaction error removing cached event:', eventId);
      resolve();
    };
  });
};

/**
 * Get events from IDB with optional filtering
 * @param {Object} options - Filter options
 * @param {Array<number>} options.kinds - Event kinds to filter
 * @param {number} options.since - Timestamp to filter from (inclusive)
 * @param {number} options.until - Timestamp to filter until (inclusive)
 * @param {number} options.limit - Max number of events to return
 * @returns {Promise<Array>} Array of raw event objects sorted by created_at DESC (newest first)
 */
const getEventsFromIDB = async ({ kinds = null, since = null, until = null, limit = null } = {}) => {
  const db = await initDB().catch(() => null);
  if (!db) return [];

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([eventsStoreName], "readonly");
    const objectStore = transaction.objectStore(eventsStoreName);
    const results = [];

    // Use created_at index to iterate in descending order (newest first)
    const index = objectStore.index('created_at');

    // Build IDBKeyRange based on since/until
    let range = null;
    if (since !== null && until !== null) {
      range = IDBKeyRange.bound(since, until);
    } else if (since !== null) {
      range = IDBKeyRange.lowerBound(since);
    } else if (until !== null) {
      range = IDBKeyRange.upperBound(until);
    }

    // Open cursor in descending order (prev = newest first)
    const request = index.openCursor(range, 'prev');

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const eventData = cursor.value;

        // Apply kind filter
        let include = true;
        if (kinds && !kinds.includes(eventData.kind)) {
          include = false;
        }

        if (include) {
          results.push(eventData);

          // Stop if we've hit the limit
          if (limit && results.length >= limit) {
            resolve(results);
            return;
          }
        }

        cursor.continue();
      } else {
        // No more results, return what we have
        resolve(results);
      }
    };

    request.onerror = () => reject("Error reading events from IDB");
  });
};

function verificationIdsFromEvents(events) {
  return [...events].filter(
    e => e.kind === verificationKind || e.kind === verificationDraftKind
  ).map(e => e.id);
}

async function loadCachedReportedVerificationIds(verificationEventIds, since) {
  if (!verificationEventIds.length) {
    return new Set();
  }
  try {
    const cachedReports = await getEventsFromIDB({
      kinds: [verificationReportKind],
      since
    });
    return reportedIdsFromReports(cachedReports, verificationEventIds);
  } catch (e) {
    console.warn('Failed to load cached verification reports from IDB', e);
    return new Set();
  }
}

/**
 * Get timestamp range of cached events in IDB
 * @param {Array<number>} kinds - Optional kinds to check
 * @returns {Promise<{oldest: number|null, newest: number|null, count: number}>}
 */
const getIDBEventRange = async (kinds = null) => {
  const db = await initDB().catch(() => null);
  if (!db) return { oldest: null, newest: null, count: 0 };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([eventsStoreName], "readonly");
    const objectStore = transaction.objectStore(eventsStoreName);
    const index = objectStore.index('created_at');

    let oldest = null;
    let newest = null;
    let count = 0;

    const countRequest = objectStore.count();
    countRequest.onsuccess = () => {
      count = countRequest.result;
    };

    // Get oldest
    const oldestRequest = index.openCursor(null, 'next');
    oldestRequest.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const eventData = cursor.value;
        if (!kinds || kinds.includes(eventData.kind)) {
          oldest = eventData.created_at;
        } else {
          cursor.continue();
          return;
        }
      }

      // Get newest
      const newestRequest = index.openCursor(null, 'prev');
      newestRequest.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const eventData = cursor.value;
          if (!kinds || kinds.includes(eventData.kind)) {
            newest = eventData.created_at;
          } else {
            cursor.continue();
            return;
          }
        }

        resolve({ oldest, newest, count });
      };
      newestRequest.onerror = () => reject("Error reading newest event");
    };
    oldestRequest.onerror = () => reject("Error reading oldest event");
  });
};


/**
 * Background sync to keep IDB cache fresh - fetches ALL relevant event kinds
 * Runs in background after page is idle
 */
const backgroundSyncEvents = async function() {
  try {
    await ensureNostrConnected();
    console.log('🔄 Background sync starting...');

    const SYNC_LIMIT = 500; // Max events per query (relay limit)

    // 1. Sync verifications and drafts (newer events)
    const { newest: newestVerification } = await getIDBEventRange([verificationKind, verificationDraftKind]);

    if (newestVerification) {
      const newVerifications = await fetchEventsWithPagination({
        kinds: [verificationKind, verificationDraftKind],
        since: newestVerification + 1,
        limit: SYNC_LIMIT
      }, supplementalRelayPaginationOptions);

      if (newVerifications.size > 0) {
        await saveEventsToIDB(newVerifications);
        console.log(`✅ Background sync: Saved ${newVerifications.size} new verifications`);
      }
    } else {
      // First time sync - fetch all verifications
      const allVerifications = await fetchEventsWithPagination({
        kinds: [verificationKind, verificationDraftKind],
        since: verificationEventsSinceTS,
        limit: SYNC_LIMIT
      }, supplementalRelayPaginationOptions);

      if (allVerifications.size > 0) {
        await saveEventsToIDB(allVerifications);
        console.log(`✅ Background sync: Initial load of ${allVerifications.size} verifications`);
      }
    }

    // 2. Fill gaps (older events that might have been missed due to interruption)
    const { oldest: oldestVerification } = await getIDBEventRange([verificationKind, verificationDraftKind]);

    if (oldestVerification && oldestVerification > verificationEventsSinceTS) {
      const olderVerifications = await fetchEventsWithPagination({
        kinds: [verificationKind, verificationDraftKind],
        since: verificationEventsSinceTS,
        until: oldestVerification - 1,
        limit: SYNC_LIMIT
      }, supplementalRelayPaginationOptions);

      if (olderVerifications.size > 0) {
        await saveEventsToIDB(olderVerifications);
        console.log(`✅ Background sync: Filled gap with ${olderVerifications.size} older verifications`);
      }
    }

    // 3. Get all appIds and verification event IDs from cached verifications
    const allCachedVerifications = await getEventsFromIDB({
      kinds: [verificationKind, verificationDraftKind]
    });

    const appIds = new Set();
    const verificationEventIds = [];
    allCachedVerifications.forEach(v => {
      const appId = v.tags?.find(t => t[0] === 'i')?.[1];
      if (appId) {
        appIds.add(appId);
      }
      verificationEventIds.push(v.id);
    });

    // 4. Sync asset registrations for these appIds only
    if (appIds.size > 0) {
      const { newest: newestAsset } = await getIDBEventRange(assetRegistrationKinds);

      const newAssets = await fetchEventsWithPagination({
        kinds: assetRegistrationKinds,
        '#i': Array.from(appIds),
        since: newestAsset ? newestAsset + 1 : verificationEventsSinceTS,
        limit: SYNC_LIMIT
      }, supplementalRelayPaginationOptions);

      if (newAssets.size > 0) {
        await saveEventsToIDB(newAssets);
        console.log(`✅ Background sync: Saved ${newAssets.size} new asset registrations`);
      }

      // 5. Fill gaps for asset registrations
      const { oldest: oldestAsset } = await getIDBEventRange(assetRegistrationKinds);

      if (oldestAsset && oldestAsset > verificationEventsSinceTS) {
        const olderAssets = await fetchEventsWithPagination({
          kinds: assetRegistrationKinds,
          '#i': Array.from(appIds),
          since: verificationEventsSinceTS,
          until: oldestAsset - 1,
          limit: SYNC_LIMIT
        }, supplementalRelayPaginationOptions);

        if (olderAssets.size > 0) {
          await saveEventsToIDB(olderAssets);
          console.log(`✅ Background sync: Filled gap with ${olderAssets.size} older assets`);
        }
      }
    }

    // 6. Fetch and cache profiles for all verifiers
    const uniquePubkeys = new Set();
    allCachedVerifications.forEach(v => {
      if (v.pubkey) uniquePubkeys.add(v.pubkey);
    });

    console.log(`🔄 Fetching profiles for ${uniquePubkeys.size} verifiers...`);
    for (const pubkey of uniquePubkeys) {
      try {
        await getNostrProfile(pubkey);
      } catch (e) {
        console.warn(
          `Failed to fetch profile for ${pubkey.substring(0, 8)}...`,
          e && e.message ? e.message : e
        );
      }
    }

    // 7. Sync endorsements for cached verifications
    if (verificationEventIds.length > 0) {
      const { newest: newestEndorsement } = await getIDBEventRange([endorsementKind]);

      // Fetch in batches of 100 verification IDs (relay limit)
      const batchSize = 100;
      for (let i = 0; i < verificationEventIds.length; i += batchSize) {
        const batch = verificationEventIds.slice(i, i + batchSize);

        const newEndorsements = await nostrFetchEvents({
          kinds: [endorsementKind],
          '#e': batch,
          since: newestEndorsement ? newestEndorsement + 1 : verificationEventsSinceTS,
          limit: SYNC_LIMIT
        });

        if (newEndorsements.size > 0) {
          await saveEventsToIDB(newEndorsements);
          console.log(`✅ Background sync: Saved ${newEndorsements.size} new endorsements (batch ${Math.floor(i/batchSize) + 1})`);
        }
      }
    }

    // 8. Sync comments for cached verifications (using 'v' tag)
    if (verificationEventIds.length > 0) {
      const { newest: newestComment } = await getIDBEventRange([verificationCommentKind]);

      // Comments use 'v' tag, not 'e' tag
      const batchSize = 100;
      for (let i = 0; i < verificationEventIds.length; i += batchSize) {
        const batch = verificationEventIds.slice(i, i + batchSize);

        const newComments = await nostrFetchEvents({
          kinds: [verificationCommentKind],
          '#v': batch,
          since: newestComment ? newestComment + 1 : verificationEventsSinceTS,
          limit: SYNC_LIMIT
        });

        if (newComments.size > 0) {
          await saveEventsToIDB(newComments);
          console.log(`✅ Background sync: Saved ${newComments.size} new comments (batch ${Math.floor(i/batchSize) + 1})`);
        }
      }
    }

    // 9. Sync code snippets (file attachments) - these are referenced by verifications
    // We'll fetch them on-demand when verifications are loaded, but cache what we find
    const { newest: newestSnippet } = await getIDBEventRange([codeSnippetKind]);

    const newSnippets = await nostrFetchEvents({
      kinds: [codeSnippetKind],
      since: newestSnippet ? newestSnippet + 1 : verificationEventsSinceTS,
      limit: SYNC_LIMIT
    });

    if (newSnippets.size > 0) {
      await saveEventsToIDB(newSnippets);
      console.log(`✅ Background sync: Saved ${newSnippets.size} new code snippets`);
    }

    const { newest: newestReport } = await getIDBEventRange([verificationReportKind]);
    const newReports = await nostrFetchEvents({
      kinds: [verificationReportKind],
      authors: siteAdminPubkeys,
      since: newestReport ? newestReport + 1 : verificationEventsSinceTS
    });
    if (newReports.size > 0) {
      await saveEventsToIDB(newReports);
      console.log(`Background sync: Saved ${newReports.size} new verification reports`);
    }

    console.log('✅ Background sync complete - ALL event kinds synced');
  } catch (error) {
    console.warn('Background sync error:', error);
  }
};

/**
 * Helper function to process raw Nostr events into our application structure
 * Applies deduplication: For verifications, keeps only newest per (hash, pubkey) pair
 */
export function getVerificationHashList(event) {
  return (event.tags ?? [])
    .filter(tag => tag[0] === 'x' && isSha256Hex(tag[1]))
    .map(tag => tag[1]);
}

function processEventsToResult(events, oldestEventTimestamp, reportedVerificationIds = null) {
  const reported = reportedVerificationIds?.size ? reportedVerificationIds : null;

  const assetsMap = new Map();
  const verificationsMap = new Map();
  const draftVerificationsMap = new Map();
  const verificationDeduplicationMap = new Map();
  let verificationCount = 0;

  for (const event of events) {
    eventSanitize(event);
    const kind = event.kind;

    if (assetRegistrationKinds.includes(kind)) {
      for (const sha256FromEventTag of getAssetIndexHashes(event)) {
        if (!assetsMap.has(sha256FromEventTag)) {
          assetsMap.set(sha256FromEventTag, []);
        }
        assetsMap.get(sha256FromEventTag).push(event);
      }
      continue;
    }

    if (kind === verificationKind && (!reported || !reported.has(event.id))) {
      verificationCount++;
      for (const sha256FromEventTag of getVerificationHashList(event)) {
        const dedupKey = `${sha256FromEventTag}:${event.pubkey}`;
        const existing = verificationDeduplicationMap.get(dedupKey);
        if (!existing || event.created_at > existing.created_at) {
          verificationDeduplicationMap.set(dedupKey, event);
        }
      }
      continue;
    }

    if (kind === verificationDraftKind &&
        getFirstTagValue(event, 'client') === 'WalletScrutiny.com' &&
        (!reported || !reported.has(event.id))) {
      for (const sha256FromEventTag of getVerificationHashList(event)) {
        if (!draftVerificationsMap.has(sha256FromEventTag)) {
          draftVerificationsMap.set(sha256FromEventTag, []);
        }
        draftVerificationsMap.get(sha256FromEventTag).push(event);
      }
    }
  }

  verificationDeduplicationMap.forEach(verification => {
    for (const sha256FromEventTag of getVerificationHashList(verification)) {
      if (!verificationsMap.has(sha256FromEventTag)) {
        verificationsMap.set(sha256FromEventTag, []);
      }
      verificationsMap.get(sha256FromEventTag).push(verification);
    }
  });

  console.debug(`Deduplicated ${verificationCount} verification events to ${verificationDeduplicationMap.size} unique (hash, pubkey) pairs`);

  return {
    assets: assetsMap,
    verifications: verificationsMap,
    draftVerifications: draftVerificationsMap,
    oldestEventTimestamp: oldestEventTimestamp
  };
}

const getAllAssetInformation = async function({ months,
                                                pubkey,
                                                appId,
                                                sha256,
                                                since,
                                                until,
                                                singleBatch = false,
                                                kinds = null,
                                                limit = null,
                                                onCachedDataLoaded = null,
                                                getDrafts = true
                                              }) {
  const randomNumber = Math.floor(Math.random() * 100);
  console.time('getAllAssetInformation' + randomNumber);

  const resolveReportedVerificationIds = async (eventSet) => {
    const verificationEventIds = verificationIdsFromEvents(eventSet);
    const unscoped = !appId && !sha256 && !pubkey;
    return fetchReportsForVerificationIds(verificationEventIds, { unscoped });
  };

  let events = new Set();
  let loadedFromIDB = false;
  let oldestEventTimestamp = null;
  let newestEventTimestamp = 0;

  const targetKinds = kinds || (getDrafts
    ? [...assetRegistrationKinds, verificationKind, verificationDraftKind]
    : [...assetRegistrationKinds, verificationKind]);
  let baseSince = verificationEventsSinceTS;
  if (months) {
    console.debug(`Getting events from last ${months} months`);
    baseSince = getTimestampMonthsAgo(months);
  } else if (since) {
    console.debug(`Getting events from ${since} onwards`);
    baseSince = since;
  }

  // 1. Load from IDB
  try {
    const cachedEvents = await getEventsFromIDB({ kinds: targetKinds, since: baseSince });
    if (cachedEvents && cachedEvents.length > 0) {
      console.debug(`Loaded ${cachedEvents.length} events from IDB (since ${baseSince})`);

      cachedEvents.forEach(eventData => {
        // Filter relevant events based on request parameters
        let includeEvent = true;

        // Filter by appId if specified
        if (appId) {
          const appIds = Array.isArray(appId) ? appId : [appId];
          const eventAppId = eventData.tags?.find(t => t[0] === 'i')?.[1];
          if (!eventAppId || !appIds.includes(eventAppId)) {
            includeEvent = false;
          }
        }

        // Filter by sha256 if specified
        if (includeEvent && sha256) {
          const eventHashes = eventData.tags?.filter(t => t[0] === 'x').map(t => t[1]) || [];
          if (!eventHashes.includes(sha256)) {
            includeEvent = false;
          }
        }

        // Filter by pubkey if specified
        if (includeEvent && pubkey && eventData.pubkey !== pubkey) {
          includeEvent = false;
        }

        if (includeEvent) {
          events.add(eventData);

          if (eventData.created_at) {
            if (newestEventTimestamp < eventData.created_at) {
              newestEventTimestamp = eventData.created_at;
            }
            if (oldestEventTimestamp === null || eventData.created_at < oldestEventTimestamp) {
              oldestEventTimestamp = eventData.created_at;
            }
          }
        }
      });

      loadedFromIDB = events.size > 0;

      if (loadedFromIDB && onCachedDataLoaded) {
        console.debug('Triggering onCachedDataLoaded callback with IDB data');
        const reportedFromCache = await loadCachedReportedVerificationIds(
          verificationIdsFromEvents(events),
          baseSince
        );
        const quickResult = processEventsToResult(new Set(events), oldestEventTimestamp, reportedFromCache);
        onCachedDataLoaded(quickResult);
      }
    }
  } catch (e) {
    console.warn("Failed to load from IDB", e);
  }

  // 2. Determine what to fetch from network
  const filter = { kinds: targetKinds };

  // Smart sync: fetch newer events
  if (loadedFromIDB && !until && !singleBatch) {
    // Fetch newer events (incremental sync)
    filter.since = newestEventTimestamp + 1;
    console.debug(`Incremental sync: Fetching events newer than ${newestEventTimestamp}`);

    // Also check if we need to fetch older events (gap filling)
    const DAY_IN_SECONDS = 86400;
    if (oldestEventTimestamp && oldestEventTimestamp > baseSince + DAY_IN_SECONDS) {
      console.debug(`Gap detected: IDB oldest=${oldestEventTimestamp}, expected=${baseSince}. Will fetch older events after new ones.`);
    }
  } else {
    filter.since = baseSince;
  }

  if (until) {
    filter.until = until;
  }
  if (limit) {
    filter.limit = limit;
  }
  if (pubkey) {
    filter.authors = [pubkey];
  }
  if (appId) {
    filter["#i"] = Array.isArray(appId) ? appId : [appId];
  }
  if (sha256) {
    filter["#x"] = [sha256];
  }

  // 3. Fetch from Network
  let newEvents = new Set();
  await ensureNostrConnected();

  // Strategy: First fetch verifications, then fetch related assets and other events
  // Only fetch assets for appIds that have verifications

  // Step 3a: Fetch verifications first
  if (!appId && !sha256 && !pubkey) {
    // General query - fetch verifications first, then assets for those appIds only
    const verificationFilter = {
      kinds: [verificationKind, verificationDraftKind],
      since: filter.since
    };
    if (filter.until) verificationFilter.until = filter.until;
    if (filter.limit) verificationFilter.limit = filter.limit;

    try {
      const newVerifications = singleBatch
        ? await nostrFetchEvents(verificationFilter)
        : await fetchVerificationEventsWithPagination(verificationFilter, mainRelayPaginationOptions);

      newVerifications.forEach(e => newEvents.add(e));
      console.log(`Fetched ${newVerifications.size} verifications from network`);

      // Extract appIds from these verifications
      const verificationAppIds = new Set();
      newVerifications.forEach(v => {
        const vAppId = v.tags?.find(t => t[0] === 'i')?.[1];
        if (vAppId) verificationAppIds.add(vAppId);
      });

      // Now fetch assets only for these appIds
      if (verificationAppIds.size > 0) {
        const assetFilter = {
          kinds: assetRegistrationKinds,
          '#i': Array.from(verificationAppIds),
          since: filter.since,
          limit: getMainRelayPageLimit(),
        };
        if (filter.until) assetFilter.until = filter.until;

        const newAssets = singleBatch
          ? await nostrFetchEvents(assetFilter)
          : await nostrFetchEvents(assetFilter, {
            relayUrls: [mainRelayUrl],
            maxWait: 15_000,
          });

        newAssets.forEach(e => newEvents.add(e));
        console.log(`Fetched ${newAssets.size} assets for ${verificationAppIds.size} appIds from network`);
      }
    } catch(e) {
      console.error("Error fetching events:", e);
      if (!loadedFromIDB) throw e;
    }
  } else {
    // Specific query with appId/sha256/pubkey filters - use original filter
    try {
      if (singleBatch) {
        console.debug(`Fetching single batch with filter:`, filter);
        newEvents = await nostrFetchEvents(filter);
      } else {
        newEvents = await fetchEventsWithPagination(filter);
      }

      console.log(`Fetched ${newEvents.size} new events from network`);
    } catch(e) {
      console.error("Error fetching events:", e);
      if (!loadedFromIDB) throw e;
    }
  }

  // 4. Fetch older events to fill gaps (if needed and not limited by params)
  if (loadedFromIDB && !until && !singleBatch && !pubkey && !appId && !sha256 && !months && !since) {
    const DAY_IN_SECONDS = 86400;
    if (oldestEventTimestamp && oldestEventTimestamp > baseSince + DAY_IN_SECONDS) {
      console.debug(`Filling gap: fetching events between ${baseSince} and ${oldestEventTimestamp - 1}`);

      const gapFilter = {
        kinds: targetKinds,
        since: baseSince,
        until: oldestEventTimestamp - 1
      };

      try {
        const gapEvents = await fetchEventsWithPagination(gapFilter, mainRelayPaginationOptions);
        console.log(`Gap fill: fetched ${gapEvents.size} older events`);
        gapEvents.forEach(e => newEvents.add(e));
      } catch(e) {
        console.warn("Error fetching gap events:", e);
      }
    }
  }

  // 5. Merge new events and update IDB
  if (newEvents.size > 0) {
    newEvents.forEach(e => {
      events.add(e);
      if (oldestEventTimestamp === null || e.created_at < oldestEventTimestamp) {
        oldestEventTimestamp = e.created_at;
      }
      if (newestEventTimestamp < e.created_at) {
        newestEventTimestamp = e.created_at;
      }
    });

    // Save to IDB
    try {
      await saveEventsToIDB(newEvents);
      console.debug(`Saved ${newEvents.size} new events to IDB`);
    } catch (e) {
      console.warn("Failed to save to IDB", e);
    }
  }

  console.debug(`Total unique events (IDB + Network): ${events.size}`);

  const reportedFromCache = await loadCachedReportedVerificationIds(
    verificationIdsFromEvents(events),
    baseSince
  );
  const reportedFromNetwork = await resolveReportedVerificationIds(events);
  const reportedVerificationIds = new Set([...reportedFromCache, ...reportedFromNetwork]);
  const finalResult = processEventsToResult(events, oldestEventTimestamp, reportedVerificationIds);

  console.log(`Final result: ${finalResult.verifications.size} verifications, ${finalResult.assets.size} assets`);
  console.timeEnd('getAllAssetInformation' + randomNumber);

  return finalResult;
}

function getAppInfoFromEventInfo(eventInfo) {
  const isAsset = assetRegistrationKinds.includes(eventInfo.kind);

  const createdAt = eventInfo.created_at;
  const description = isAsset ? '' : JSON.parse(eventInfo.content).description;
  const content = isAsset ? eventInfo.content : JSON.parse(eventInfo.content).content;
  const appId = getFirstTagValue(eventInfo, 'i');
  const version = getFirstTagValue(eventInfo, 'version');
  const platform = getFirstTagValue(eventInfo, 'platform');
  const status = getFirstTagValue(eventInfo, 'status');
  const url = getFirstTagValue(eventInfo, 'url');
  const gitRevision = getFirstTagValue(eventInfo, 'git_revision');
  const appHashes = getAssetFileEntries(eventInfo).map(entry => entry.hash);
  const assetFiles = getAssetFileEntries(eventInfo);

  return {
    isAsset,
    appId,
    version,
    createdAt,
    description,
    content,
    platform,
    status,
    url,
    gitRevision,
    appHashes,
    assetFiles,
  };
}

function showToast(message, type = 'success', duration = 4000) {
  return new Promise((resolve) => {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }

    let color;
    if (type === 'error') {
      duration = 6000;
      color = '#ff5861';
    } else if (type === 'success') {
      color = '#00a96e';
    } else if (type === 'warning') {
      color = '#ffbe00';
    } else if (type === 'info') {
      color = '#00b6ff';
    }

    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.backgroundColor = color;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => toast.classList.add('show'), 250);

    // Hide and remove toast after duration
    setTimeout(() => {
      toast.classList.remove('show');
      toast.remove();
      resolve();
    }, duration);
  });
}

const createNostrNote = async function (message) {
  await ensureNostrConnected();
  if (!message) {
    throw new Error("Message is required");
  }

  const eventDraft = createNostrEvent(1, message);
  const published = await signAndPublish(eventDraft, 'note');
  return published.id;
}

const createNostrCommentToVerification = async function(verificationKey, comment, commentAuthorPubkeys, messageCounter) {
  await ensureNostrConnected();

  const eventDraft = createNostrEvent(verificationCommentKind, comment);
  eventDraft.tags.push(['v', verificationKey]);
  commentAuthorPubkeys.forEach(pubkey => {
    eventDraft.tags.push(['p', pubkey]);
  });
  eventDraft.tags.push(['d', verificationKey + '-' + messageCounter.toString()]);

  const published = await signAndPublish(eventDraft, 'comment to verification');
  return published.id;
}

const getCommentsForVerification = async function(verificationKey) {
  // This is to support the old format of the verificationKey, where
  // the event id was not included. See this issue:
  // https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/844

  // At some point in the future, we can remove this support for the
  // old format and keep only the new format (verificationKey).

  // Remove last part of the verificationKey (the event id)
  const verificationKeyWithoutEventId = verificationKey.split(':').slice(0, -1).join(':');

  await ensureNostrConnected();
  const comments = await nostrFetchEvents([
    {
      kinds: [verificationCommentKind],
      '#v': [verificationKey]
    },
    {
      kinds: [verificationCommentKind],
      '#v': [verificationKeyWithoutEventId]
    }
  ]);

  comments.forEach(comment => {
    comment.content = DOMPurify.sanitize(comment.content);
    comment.tags = comment.tags.map(tag => {
      return [tag[0], DOMPurify.sanitize(tag[1])];
    });
  });

  return Array.from(comments);
}

const sendPrivateMessageToVerifier = async function(verifierPubkey, commentText) {
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

function setupAppIdAutocomplete(firstTime = true) {
  const appIdInput = document.getElementById('appId');
  const suggestionsContainer = document.getElementById('appIdSuggestions');

  function filterWallets(searchText) {
    if (!window.wallets) return [];
    return window.wallets.filter(wallet => {
      const searchLower = searchText.toLowerCase();
      return wallet.appId.toLowerCase().includes(searchLower) ||
        wallet.title.toLowerCase().includes(searchLower);
    });
  }

  // Helper function to decode HTML entities
  function decodeHtmlEntities(text) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  }

  function showSuggestions(suggestions) {
    suggestionsContainer.innerHTML = '';
    if (suggestions.length === 0) {
      suggestionsContainer.style.display = 'none';
      return;
    }

    const fragment = document.createDocumentFragment();

    suggestions.forEach(wallet => {
      const div = document.createElement('div');
      div.className = 'suggestion-item';
      // Decode HTML entities in the title before displaying
      const decodedTitle = decodeHtmlEntities(wallet.title);
      div.textContent = `${decodedTitle}${wallet.folder ? ' (' + wallet.folder + ')' : ''} - ${wallet.appId}`;
      div.onclick = () => {
        appIdInput.value = wallet.appId;
        suggestionsContainer.style.display = 'none';
        appIdInput.dispatchEvent(new Event('input', { bubbles: true }));  // Manually trigger the input event after setting the value
      };
      fragment.appendChild(div);
    });

    suggestionsContainer.appendChild(fragment);

    suggestionsContainer.style.display = 'block';
  }

  if (firstTime) {
    appIdInput.addEventListener('input', (e) => {
      const searchText = e.target.value;
      if (searchText.length > 1) {
        const filteredWallets = filterWallets(searchText);
        showSuggestions(filteredWallets);
      } else {
        showSuggestions([]);
      }
    });

    document.addEventListener('click', (e) => {
      if (!appIdInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
        suggestionsContainer.style.display = 'none';
      }
    });
  }
}

const getVerificationEvent = async function(verificationEventId) {
  if (!verificationEventId) {
    throw new Error('No verification event ID provided');
  }

  await ensureNostrConnected();
  return await nostrFetchEvent(verificationEventId);
}

const deleteDraftVerification = async function(draftVerificationEventId, moveToURL = null, reason = 'user deleted draft verification') {
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

const deletePublishedVerification = async function(verificationEventId, reason = 'User deleted verification via WalletScrutiny') {
  if (!verificationEventId) {
    showToast('No verification event ID found', 'error');
    return;
  }

  if (!confirm('Are you sure you want to delete this verification? A Nostr deletion request (kind 5) will be sent to relays. This action cannot be undone.')) {
    return;
  }

  try {
    await ensureNostrConnected();
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
};

const deleteVerificationComment = async function(commentEventId, reason = 'User deleted verification comment') {
  if (!commentEventId) {
    showToast('No comment event ID found', 'error');
    return false;
  }

  if (!confirm('Do you want to delete this comment?')) {
    return false;
  }

  try {
    await ensureNostrConnected();
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

    const deletionRequestEvent = await createDeletionRequest(commentEvent, reason, false);
    void showToast('Deleting comment, please wait...', 'info', 5000);
    await publishToRelays(deletionRequestEvent, explicitRelayUrls, 5000, 1);
    showToast('Comment deleted successfully');
    await deleteCachedEventById(commentEventId);

    await new Promise(resolve => setTimeout(resolve, 1000));
    window.location.reload();
  } catch (error) {
    showToast(error.message || String(error), 'error');
    return false;
  }
};

const loadDraftVerificationsNotifications = async function () {
  let myPubkey;
  try {
    myPubkey = await getUserPubkey();
  } catch {
    return;
  }
  if (!myPubkey) {
    return;
  }

  let myDraftVerifications = [];

  for (const draftVerification of window.allAssetInformation.draftVerifications) {
    const arrayDraftVerificationEventsForThisSha256 = draftVerification[1];
    for (const draftVerificationEvent of arrayDraftVerificationEventsForThisSha256) {
      if (draftVerificationEvent.pubkey === myPubkey) {
        myDraftVerifications.push(draftVerificationEvent);
      }
    }
  }

  if (myDraftVerifications && myDraftVerifications.length > 0) {
    ensureDraftNotificationClickHandler();
    myDraftVerifications.forEach(verification => {
      const identifier = getFirstTagValue(verification, 'i', 'Unknown');
      const version = getFirstTagValue(verification, 'version', null);
      const wallet = window.wallets?.find(w => w.appId === identifier);
      const walletTitle = wallet ? wallet.title : identifier;
      const status = getFirstTagValue(verification, 'status');
      const statusIcon = '<span title="' + getStatusText(status) + '" style="margin-left: 4px;">' + (status === 'reproducible' ? '✅' : '❌') + ` ${getStatusText(status, true)}</span>`;

      addNotificationToIndicator('Unpublished Verification',
        `${walletTitle} - ${version ? version+' -' : ''} ${formatDate(verification.created_at)} ${statusIcon}
        <br>
        ${isSha256Hex(verification.id) ? `<button class="edit-button" data-draft-id="${verification.id}" data-draft-action="edit">Edit</button>
        <button class="delete-button" data-draft-id="${verification.id}" data-draft-action="delete">Delete</button>` : ''}`,'info')
    });
  }
}

function ensureDraftNotificationClickHandler() {
  const list = document.querySelector('.notifications-list');
  if (!list || list.dataset.draftActionsWired === '1') {
    return;
  }
  list.dataset.draftActionsWired = '1';
  list.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-draft-id][data-draft-action]');
    if (!btn) {
      return;
    }
    event.preventDefault();
    doDraftVerificationAction(btn.dataset.draftId, btn.dataset.draftAction);
  });
}

function doDraftVerificationAction(draftVerificationEventId, action) {
  if (action === 'edit') {
    window.location.href = `/new_verification?draftVerificationEventId=${draftVerificationEventId}&action=${action}`;
  } else if (action === 'delete') {
    let goToURL = null;

    if (window.location.pathname.includes('new_verification')) {
      goToURL = '/assets/';
    }

    deleteDraftVerification(draftVerificationEventId, goToURL);
  }
}

// Helper to compare semantic versions like "1.2.3"
function compareVersions(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = pa[i] || 0;
    const nb = pb[i] || 0;
    if (na > nb) return 1;
    if (na < nb) return -1;
  }
  return 0;
}

function getMaxAssetVersion(getAllAssetInformationResult, appId = null) {
  // Check if getAllAssetInformationResult.verifications is defined
  if (!getAllAssetInformationResult.verifications) {
    throw new Error('getAllAssetInformationResult.verifications is not defined');
  }

  let maxVersion = null;
  let maxDate = null;
  let verifiedVersion = null;
  let verifiedDate = null;

  const allAssetArrays = [...getAllAssetInformationResult.verifications.values(), ...getAllAssetInformationResult.assets.values()];
  for (const assetArray of allAssetArrays) {
    for (const asset of assetArray) {
      const version = getFirstTagValue(asset, 'version');
      const appIdFromTag = getFirstTagValue(asset, 'i');
      if (version && (!appId || appIdFromTag === appId)) {
        if (!maxVersion || compareVersions(version, maxVersion) > 0) {
          maxVersion = version;
          maxDate = formatDate(asset.created_at, true);
        }

        const status = getFirstTagValue(asset, 'status');
        if (status === 'reproducible' && (!verifiedVersion || compareVersions(version, verifiedVersion) > 0)) {
          verifiedVersion = version;
          verifiedDate = formatDate(asset.created_at, true);
        }
      }
    }
  }

  return {
    lastVersion: maxVersion,
    lastVersionDate: maxDate,
    lastVerifiedVersion: verifiedVersion,
    lastVerifiedVersionDate: verifiedDate
  };
}

// This function is made to mitigate the mess caused
// by the fact that in the .md files we have 'desktop',
// but in the assets/verifications we have 'linux', 'windows', 'macos'.
function isSamePlatform(platform1, platform2) {
  if (platform1 === 'desktop') {
    return platform2 === 'linux' || platform2 === 'windows' || platform2 === 'macos';
  }
  return platform1 === platform2;
}

function getLastVerificationStatusForAppId(appId, platform) {
  let verification = null;
  let maxVersion = null;

  for (const assetArray of window.allAssetInformation.verifications.values()) {
    for (const asset of assetArray) {
      const version = getFirstTagValue(asset, 'version', null);
      const appIdFromTag = getFirstTagValue(asset, 'i');
      const platformFromTag = getFirstTagValue(asset, 'platform');
      if (version && (appIdFromTag === appId) && isSamePlatform(platform, platformFromTag)) {
        if (!maxVersion || compareVersions(version, maxVersion) > 0) {
          verification = asset;
          maxVersion = version;
        }
      }
    }
  }

  if (verification) {
    return getFirstTagValue(verification, 'status');
  }

  return null;
}

function getWeightForAppFromAssetInformation(appId) {
  if (!window.allAssetInformation) {
    throw new Error('window.allAssetInformation is not defined yet');
  }

  const { lastVersion, lastVersionDate, lastVerifiedVersion, lastVerifiedVersionDate } = getMaxAssetVersion(window.allAssetInformation, appId);

  let numberOfVerifications = 0;
  let numberOfReproducibleVerifications = 0;

  for (const verifications of window.allAssetInformation.verifications.values()) {
    for (const verification of verifications) {
      const appIdCurrentVerification = getFirstTagValue(verification, 'i');
      const status = getFirstTagValue(verification, 'status');

      if (appIdCurrentVerification === appId) {
        numberOfVerifications += 1;

        if (status === 'reproducible') {
          numberOfReproducibleVerifications += 1;
        }
      }
    }
  }

  let weight = numberOfReproducibleVerifications / numberOfVerifications;
  if (isNaN(weight)) {
    weight = 0;
  }

  return {
    weight,
    lastVersionVerified: (lastVerifiedVersion && (lastVerifiedVersion === lastVersion)) ? 1 : -1
  };
}

const cleanupNostrConnections = function() {
  try {
    disconnectNostr();
    nostrConnectionPromise = null;
    signerReadyPromise = null;
    hasNip07Signer = false;
    console.warn("Nostr cleanup completed");
  } catch (error) {
    console.error("Error during Nostr cleanup:", error);
  }
};

/**
 * Build and sign a NIP-57 zap request.
 */
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

const createZap = async function ({ event, amount, comment = '' }) {
  await ensureSignerReady();
  if (!hasNip07Signer) {
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

const subscribeToZapReceipts = async function(zapEvent, currentZapInvoice, receiptReceivedCallback) {
  try {
    const filter = {
      kinds: [9735],
      '#e': [zapEvent.id],
    };
    const sub = subscribeEvents(filter, {
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
};

const createAuthorizationEvent = async function(verb, content, xTags = [], serverUrl = '', tags = []) {
  await ensureNostrConnected();
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
};

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
  window.getLastVerificationStatusForAppId = getLastVerificationStatusForAppId;
  window.getWeightForAppFromAssetInformation = getWeightForAppFromAssetInformation;
  window.cleanupNostrConnections = cleanupNostrConnections;
  window.createNostrCommentToVerification = createNostrCommentToVerification;
  window.getCommentsForVerification = getCommentsForVerification;
  window.sendPrivateMessageToVerifier = sendPrivateMessageToVerifier;
  window.getEndorsementsFromVerificationEventIds = getEndorsementsFromVerificationEventIds;
  window.createZap = createZap;
  window.subscribeToZapReceipts = subscribeToZapReceipts;
  window.createAuthorizationEvent = createAuthorizationEvent;
  window.getTagValue = getTagValue;
  window.addEventListener('beforeunload', () => {
    cleanupNostrConnections();
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
  createNostrCommentToVerification,
  getCommentsForVerification,
  sendPrivateMessageToVerifier,
  getEndorsementsFromVerificationEventIds,
  createZap,
  subscribeToZapReceipts,
  createAuthorizationEvent,
  reportedIdsFromReports,
  buildVerificationReportFilters,
  eventSanitize,
};
