import * as nip19 from 'nostr-tools/nip19';
import {
  connectNostr,
  ensureConnected,
  disconnectNostr,
  getPool as getNostrPoolSync,
  getRelayUrls,
  fetchEvents as nostrFetchEvents,
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
  eventRelayUrls,
  writeRelayUrls,
  verificationEventsSinceTS,
  mainRelayUrl,
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
import {
  saveEventsToIDB,
  deleteCachedEventById,
  getEventsFromIDB,
  getEventsByIdsFromIDB,
  eventTimeRange,
  missingEventIds,
} from './nostr-idb.mjs';
import { syncDelta } from './nostr-sync.mjs';

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

let ndkConnectionPromise = null;
let signerReadyPromise = null;
let hasNip07Signer = false;
let resolveNostrConnectInitiated;
const nostrConnectInitiatedPromise = new Promise(resolve => {
  resolveNostrConnectInitiated = resolve;
});

const connectTimeout = 5;
const nip07WaitTimeoutMs = 3125;

export const getNdk = async () => {
  await ensureNdkConnected();
  return getNostrPoolSync();
};

export const getNostrPool = getNdk;

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

  ndkConnectionPromise = (async () => {
    try {
      await connectNostr({
        relayUrls: writeRelayUrls,
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
  console.debug("nostrConnect initiated, ndkConnectionPromise is set.");

  return ndkConnectionPromise;
};

const ensureNdkConnected = async () => {
  if (!ndkConnectionPromise) {
    await nostrConnectInitiatedPromise;
  }
  await ndkConnectionPromise;
  if (!getNostrPoolSync()) {
    throw new Error("Nostr pool not initialized after connection.");
  }
};

const ensureSignerReady = async () => {
  await ensureNdkConnected();
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

async function publishNdkEvent(eventDraft, eventType = 'event') {
  await ensureSignerReady();
  const signed = await signEvent(eventDraft);
  const { successful } = await publishEvent(signed);
  console.debug(`Published ${eventType} (id: ${signed.id}) to ${successful} relays`);
  return signed;
}

function createNdkEvent(kind, content, tags = [], createdAt = null) {
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
  await ensureNdkConnected();
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

  const ndkEvent = createNdkEvent(assetRegistrationKind, description, tags, createdAt);
  eventSanitize(ndkEvent);

  const published = await publishNdkEvent(ndkEvent, 'asset registration');
  return published ?? ndkEvent;
}

const createAssetBundleRegistration = async function ({
  files,
  appId,
  version,
  platform,
  description,
  createdAt = null
}) {
  await ensureNdkConnected();

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

  const ndkEvent = createNdkEvent(assetBundleRegistrationKind, description, tags, createdAt);
  eventSanitize(ndkEvent);

  const published = await publishNdkEvent(ndkEvent, 'asset bundle registration');
  return published ?? ndkEvent;
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
  await ensureNdkConnected();
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

  const ndkEvent = createNdkEvent(
    isDraft ? verificationDraftKind : verificationKind,
    fullContent,
    tags,
    createdAt
  );
  eventSanitize(ndkEvent);

  const published = await publishNdkEvent(ndkEvent, 'verification');

  if (!isDraft && draftVerificationEventId) {
    const draftVerificationEvent = await getVerificationEvent(draftVerificationEventId);
    if (draftVerificationEvent) {
      await createDeletionRequest(draftVerificationEvent, 'deleting draft, as verification was published', true);
    }
    await deleteCachedEventById(draftVerificationEventId);
  }

  return published ?? ndkEvent;
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
const GAP_FILL_THRESHOLD_SECONDS = 86400;

async function readReportedVerificationIds(verificationEventIds, {
  tagValues = null,
} = {}) {
  if (!verificationEventIds.length) {
    return new Set();
  }
  try {
    const cachedReports = await getEventsFromIDB({
      kinds: [verificationReportKind],
      since: verificationEventsSinceTS,
      ...(tagValues ? { tagName: 'e', tagValues } : {}),
    });
    return reportedIdsFromReports(cachedReports, verificationEventIds);
  } catch (error) {
    console.warn('Failed to load cached verification reports from IDB', error);
    return new Set();
  }
}

async function fetchScopedReportsFromNetwork(verificationEventIds, since = null) {
  const all = new Set();
  for (let i = 0; i < verificationEventIds.length; i += VERIFICATION_REPORT_FETCH_CHUNK) {
    const batch = verificationEventIds.slice(i, i + VERIFICATION_REPORT_FETCH_CHUNK);
    const filter = {
      kinds: [verificationReportKind],
      authors: siteAdminPubkeys,
      '#e': batch,
      since: since ?? verificationEventsSinceTS,
    };
    const events = await nostrFetchEvents(filter);
    events.forEach(event => all.add(event));
  }
  return all;
}

/**
 * Cache-first reports. Homepage (unscoped) syncs the admin-report archive.
 * Scoped wallet pages refresh by #e in chunks so relays are not asked for every id.
 */
async function fetchReportsForVerificationIds(verificationEventIds, {
  unscoped = false,
  fillGaps = false,
} = {}) {
  if (!verificationEventIds.length) {
    return new Set();
  }

  try {
    await ensureNdkConnected();
    if (unscoped) {
      await syncDelta({
        kinds: [verificationReportKind],
        extraFilter: { authors: siteAdminPubkeys },
        sinceFloor: verificationEventsSinceTS,
        fillGaps,
        gapThresholdSeconds: GAP_FILL_THRESHOLD_SECONDS,
      });
    } else {
      const cached = await getEventsFromIDB({
        kinds: [verificationReportKind],
        tagName: 'e',
        tagValues: verificationEventIds,
      });
      const { newest } = eventTimeRange(cached);
      const knownIds = new Set(cached.map(event => event.id));
      const reports = [...cached];
      const fetched = await fetchScopedReportsFromNetwork(
        verificationEventIds,
        newest != null ? newest + 1 : null
      );
      const fresh = [...fetched].filter(event => !knownIds.has(event.id));
      if (fresh.length > 0) {
        await saveEventsToIDB(fresh).catch(error => {
          console.warn('Failed to save verification reports to IDB', error);
        });
        reports.push(...fresh);
      }
      return reportedIdsFromReports(reports, verificationEventIds);
    }
  } catch (error) {
    console.warn('Failed to refresh verification reports from network', error);
  }

  return readReportedVerificationIds(verificationEventIds, {
    tagValues: unscoped ? null : verificationEventIds,
  });
}

const createVerificationReport = async function ({
  verificationEventId,
  reportedPubkey,
  reason
}) {
  await ensureNdkConnected();
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
  const ndkEvent = createNdkEvent(verificationReportKind, body, tags);
  eventSanitize(ndkEvent);
  const published = await publishNdkEvent(ndkEvent, 'verification report');
  const reportEvent = published ?? ndkEvent;
  await saveEventsToIDB([reportEvent]).catch(e => {
    console.warn('Failed to save verification report to IDB', e);
  });
  return reportEvent;
};

const createEndorsement = async function ({validity = null, verificationEventId, endorserNpubkey}) {
  await ensureNdkConnected();
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

  const ndkEvent = createNdkEvent(endorsementKind, '', tags);
  await publishNdkEvent(ndkEvent, 'endorsement');
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
  await ensureNdkConnected();

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

  const ndkEvent = createNdkEvent(codeSnippetKind, base64Data, tags);

  try {
    const published = await publishNdkEvent(ndkEvent, `file ${fileName}`);
    return { success: true, eventId: published?.id, fileName: fileName };
  } catch (error) {
    console.error(`Error uploading file ${fileName}`, error);
    return { success: false, error: error, fileName: fileName };
  }
}

const getEventsFromEventIds = async function(eventIds) {
  const ids = [...new Set((eventIds ?? []).filter(Boolean))];
  if (ids.length === 0) {
    console.debug('No event-ids found on verification event.');
    return new Set();
  }

  const cached = await getEventsByIdsFromIDB(ids);
  const missing = missingEventIds(ids, cached);
  const events = new Map(cached.map(event => [event.id, event]));

  if (missing.length === 0) {
    return new Set(ids.map(id => events.get(id)).filter(Boolean));
  }

  try {
    await ensureNdkConnected();
    console.debug(`Fetching ${missing.length} uncached events of ${ids.length} requested`);
    const fetched = await fetchEventsByIdsFromNetwork(missing);
    if (fetched.size > 0) {
      await saveEventsToIDB(fetched).catch(error => {
        console.warn('Failed to save events fetched by id to IDB', error);
      });
      fetched.forEach(event => events.set(event.id, event));
    }
  } catch (error) {
    if (events.size === 0) {
      throw error;
    }
    console.warn('Failed to fetch missing events from network, using cache', error);
  }

  return new Set(ids.map(id => events.get(id)).filter(Boolean));
}

const EVENT_ID_FETCH_BATCH = 100;

async function fetchEventsByIdsFromNetwork(ids) {
  const all = new Set();
  for (let i = 0; i < ids.length; i += EVENT_ID_FETCH_BATCH) {
    const batch = ids.slice(i, i + EVENT_ID_FETCH_BATCH);
    const events = await nostrFetchEvents({ ids: batch });
    events.forEach(event => all.add(event));
  }
  return all;
}

function groupEndorsementsByVerificationId(endorsements) {
  const grouped = {};
  for (const endorsement of endorsements) {
    const eventId = endorsement.tags?.find(tag => tag[0] === 'e' && tag[1]?.length === 64)?.[1];
    if (!eventId) {
      continue;
    }
    if (!grouped[eventId]) {
      grouped[eventId] = [];
    }
    grouped[eventId].push(endorsement);
  }
  return grouped;
}

const ENDORSEMENT_FETCH_BATCH = 100;

async function fetchEndorsementsFromNetwork(verificationEventIds, since = null) {
  const all = new Set();
  for (let i = 0; i < verificationEventIds.length; i += ENDORSEMENT_FETCH_BATCH) {
    const batch = verificationEventIds.slice(i, i + ENDORSEMENT_FETCH_BATCH);
    const filter = {
      kinds: [endorsementKind],
      '#e': batch,
    };
    if (since != null) {
      filter.since = since;
    }
    const events = await nostrFetchEvents(filter);
    events.forEach(event => all.add(event));
  }
  return all;
}

const getEndorsementsFromVerificationEventIds = async function(verificationEventIds) {
  if (!verificationEventIds?.length) {
    return {};
  }

  const cached = await getEventsFromIDB({
    kinds: [endorsementKind],
    tagName: 'e',
    tagValues: verificationEventIds,
  });
  const { newest } = eventTimeRange(cached);
  const knownIds = new Set(cached.map(event => event.id));
  const endorsements = [...cached];

  try {
    await ensureNdkConnected();
    const fetched = await fetchEndorsementsFromNetwork(
      verificationEventIds,
      newest != null ? newest + 1 : null
    );
    const fresh = [...fetched].filter(event => !knownIds.has(event.id));
    if (fresh.length > 0) {
      await saveEventsToIDB(fresh).catch(error => {
        console.warn('Failed to save endorsements to IDB', error);
      });
      endorsements.push(...fresh);
    }
  } catch (error) {
    if (cached.length === 0) {
      throw error;
    }
    console.warn('Failed to refresh endorsements from network, using cache', error);
  }

  return groupEndorsementsByVerificationId(endorsements);
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

function addEventsToSet(target, source) {
  for (const event of source ?? []) {
    target.add(event);
  }
  return target;
}

function verificationIdsFromEvents(events) {
  return [...events].filter(
    e => e.kind === verificationKind || e.kind === verificationDraftKind
  ).map(e => e.id);
}

/**
 * Independent archive fill of WalletScrutiny event kinds on the project relay.
 * Not scoped to the page query: later UI (any wallet, comments, endorsements)
 * should already be in IDB.
 */
const backgroundSyncEvents = async function() {
  try {
    await ensureNdkConnected();
    console.log('Background sync starting...');

    const archiveSync = {
      sinceFloor: verificationEventsSinceTS,
      fillGaps: true,
    };

    const jobs = [
      { label: 'verifications', kinds: [verificationKind, verificationDraftKind] },
      { label: 'asset registrations', kinds: assetRegistrationKinds },
      { label: 'endorsements', kinds: [endorsementKind] },
      { label: 'comments', kinds: [verificationCommentKind] },
      {
        label: 'verification reports',
        kinds: [verificationReportKind],
        extraFilter: { authors: siteAdminPubkeys },
      },
    ];

    for (const { label, kinds, extraFilter } of jobs) {
      const events = await syncDelta({
        kinds,
        extraFilter,
        ...archiveSync,
      });
      if (events.size > 0) {
        console.log(`Background sync: Saved ${events.size} ${label}`);
      }
    }

    const cachedEvents = await getEventsFromIDB({
      kinds: [
        verificationKind,
        verificationDraftKind,
        ...assetRegistrationKinds,
        endorsementKind,
        verificationCommentKind,
      ],
    });

    const cachedVerifications = cachedEvents.filter(
      event => event.kind === verificationKind || event.kind === verificationDraftKind
    );
    const attachmentIds = [...new Set(
      cachedVerifications.flatMap(event => getFileAttachmentIDsForVerificationEvent(event))
    )];
    const snippetEvents = [];
    if (attachmentIds.length > 0) {
      const snippets = await getEventsFromEventIds(attachmentIds);
      snippetEvents.push(...snippets);
      if (snippets.size > 0) {
        console.log(`Background sync: Loaded ${snippets.size} code snippets by attachment id`);
      }
    }
    const uniquePubkeys = new Set(
      [...cachedEvents, ...snippetEvents].map(event => event.pubkey).filter(Boolean)
    );
    console.log(`Fetching profiles for ${uniquePubkeys.size} authors...`);
    for (const pubkey of uniquePubkeys) {
      try {
        await getNostrProfile(pubkey);
      } catch (e) {
        console.warn(
          `Failed to fetch profile for ${pubkey.substring(0, 8)}...`,
          e?.message ?? e
        );
      }
    }

    console.log('Background sync complete');
  } catch (error) {
    console.warn('Background sync error:', error);
  }
};

/**
 * Helper function to process raw NDK events into our application structure
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
  const timerId = 'getAllAssetInformation' + Math.floor(Math.random() * 100);
  console.time(timerId);

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

  const events = new Set();
  let loadedFromIDB = false;
  let oldestEventTimestamp = null;
  let newestEventTimestamp = null;

  try {
    const cachedEvents = await getEventsFromIDB({
      kinds: targetKinds,
      since: baseSince,
      appId,
      sha256,
      pubkey,
    });
    if (cachedEvents.length > 0) {
      console.debug(`Loaded ${cachedEvents.length} events from IDB (since ${baseSince})`);
      addEventsToSet(events, cachedEvents);
      ({ oldest: oldestEventTimestamp, newest: newestEventTimestamp } = eventTimeRange(cachedEvents));
      loadedFromIDB = true;

      if (onCachedDataLoaded) {
        console.debug('Triggering onCachedDataLoaded callback with IDB data');
        const reportedFromCache = await readReportedVerificationIds(
          verificationIdsFromEvents(events)
        );
        onCachedDataLoaded(processEventsToResult(new Set(events), oldestEventTimestamp, reportedFromCache));
      }
    }
  } catch (e) {
    console.warn('Failed to load from IDB', e);
  }

  const extraFilter = {};
  if (pubkey) {
    extraFilter.authors = [pubkey];
  }
  if (appId) {
    extraFilter['#i'] = Array.isArray(appId) ? appId : [appId];
  }
  if (sha256) {
    extraFilter['#x'] = [sha256];
  }

  const incremental = loadedFromIDB && !until && !singleBatch;
  const scoped = Boolean(appId || sha256 || pubkey);
  const fillGaps = incremental && !scoped && !months && !since;

  await ensureNdkConnected();
  const newEvents = new Set();

  try {
    const fetched = await syncDelta({
      kinds: targetKinds,
      extraFilter,
      sinceFloor: baseSince,
      newest: incremental ? newestEventTimestamp : null,
      oldest: loadedFromIDB ? oldestEventTimestamp : null,
      until,
      limit,
      singleBatch,
      fillGaps,
      gapThresholdSeconds: GAP_FILL_THRESHOLD_SECONDS,
    });
    addEventsToSet(newEvents, fetched);
    console.log(`Fetched ${fetched.size} events from network`);
  } catch (e) {
    console.error('Error fetching events:', e);
    if (!loadedFromIDB) {
      throw e;
    }
  }

  if (newEvents.size > 0) {
    addEventsToSet(events, newEvents);
    ({ oldest: oldestEventTimestamp, newest: newestEventTimestamp } = eventTimeRange(events));
  }

  console.debug(`Total unique events (IDB + Network): ${events.size}`);

  const reportedVerificationIds = await fetchReportsForVerificationIds(
    verificationIdsFromEvents(events),
    { unscoped: !scoped, fillGaps }
  );
  const finalResult = processEventsToResult(events, oldestEventTimestamp, reportedVerificationIds);

  console.log(`Final result: ${finalResult.verifications.size} verifications, ${finalResult.assets.size} assets`);
  console.timeEnd(timerId);

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
  await ensureNdkConnected();
  if (!message) {
    throw new Error("Message is required");
  }

  const ndkEvent = createNdkEvent(1, message);
  const published = await publishNdkEvent(ndkEvent, 'note');
  return published?.id;
}

const createNostrCommentToVerification = async function(verificationKey, comment, commentAuthorPubkeys, messageCounter) {
  await ensureNdkConnected();

  const ndkEvent = createNdkEvent(verificationCommentKind, comment);
  ndkEvent.tags.push(['v', verificationKey]);
  commentAuthorPubkeys.forEach(pubkey => {
    ndkEvent.tags.push(['p', pubkey]);
  });
  ndkEvent.tags.push(['d', verificationKey + '-' + messageCounter.toString()]);

  const published = await publishNdkEvent(ndkEvent, 'comment to verification');
  return published?.id;
}

const getCommentsForVerification = async function(verificationKey) {
  // This is to support the old format of the verificationKey, where
  // the event id was not included. See this issue:
  // https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/844

  // At some point in the future, we can remove this support for the
  // old format and keep only the new format (verificationKey).

  // Remove last part of the verificationKey (the event id)
  const verificationKeyWithoutEventId = verificationKey.split(':').slice(0, -1).join(':');
  const commentKeys = [verificationKey, verificationKeyWithoutEventId].filter(Boolean);

  const cached = await getEventsFromIDB({
    kinds: [verificationCommentKind],
    tagName: 'v',
    tagValues: commentKeys,
  });
  const { newest } = eventTimeRange(cached);
  const knownIds = new Set(cached.map(event => event.id));
  const comments = [...cached];

  try {
    await ensureNdkConnected();
    const filters = commentKeys.map(key => {
      const filter = {
        kinds: [verificationCommentKind],
        '#v': [key],
      };
      if (newest != null) {
        filter.since = newest + 1;
      }
      return filter;
    });
    const fetched = await nostrFetchEvents(filters);
    const fresh = [...fetched].filter(event => !knownIds.has(event.id));
    if (fresh.length > 0) {
      await saveEventsToIDB(fresh).catch(error => {
        console.warn('Failed to save comments to IDB', error);
      });
      comments.push(...fresh);
    }
  } catch (error) {
    if (cached.length === 0) {
      throw error;
    }
    console.warn('Failed to refresh comments from network, using cache', error);
  }

  comments.forEach(comment => {
    comment.content = DOMPurify.sanitize(comment.content);
    comment.tags = comment.tags.map(tag => {
      return [tag[0], DOMPurify.sanitize(tag[1])];
    });
  });

  return comments;
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

  await ensureNdkConnected();
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
    await ensureNdkConnected();
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
    await ensureNdkConnected();
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

const cleanupNdkConnections = function() {
  try {
    disconnectNostr();
    ndkConnectionPromise = null;
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
};

const createAuthorizationEvent = async function(verb, content, xTags = [], serverUrl = '', tags = []) {
  await ensureNdkConnected();
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
  window.cleanupNdkConnections = cleanupNdkConnections;
  window.createNostrCommentToVerification = createNostrCommentToVerification;
  window.getCommentsForVerification = getCommentsForVerification;
  window.sendPrivateMessageToVerifier = sendPrivateMessageToVerifier;
  window.getEndorsementsFromVerificationEventIds = getEndorsementsFromVerificationEventIds;
  window.createZap = createZap;
  window.subscribeToZapReceipts = subscribeToZapReceipts;
  window.createAuthorizationEvent = createAuthorizationEvent;
  window.getTagValue = getTagValue;
  window.addEventListener('beforeunload', () => {
    cleanupNdkConnections();
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
  eventSanitize,
  groupEndorsementsByVerificationId,
};
