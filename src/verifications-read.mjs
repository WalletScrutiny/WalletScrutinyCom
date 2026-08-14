import DOMPurify from 'dompurify';
import {
  fetchEvents as nostrFetchEvents,
  getMatchingTags,
} from './nostr-client.mjs';
import {
  verificationKind,
  endorsementKind,
  verificationDraftKind,
  verificationCommentKind,
  codeSnippetKind,
  verificationReportKind,
  verificationEventsSinceTS,
  siteAdminPubkeys,
  isWalletScrutinySiteAdmin,
} from './nostr-constants.mjs';
import { getFirstTagValue } from './verifications_common.mjs';
import {
  assetRegistrationKinds,
  getAssetFileEntries,
  getAssetIndexHashes,
} from './asset-utils.mjs';
import { formatDate } from './format-utils.mjs';
import { getNostrProfile } from './nostr-profile.mjs';
import {
  saveEventsToIDB,
  getEventsFromIDB,
  getEventsByIdsFromIDB,
  eventTimeRange,
  missingEventIds,
} from './nostr-idb.mjs';
import { syncDelta } from './nostr-sync.mjs';
import { eventSanitize, getVerificationHashList } from './nostr-sanitize.mjs';
import { ensureNostrSession } from './nostr-session.mjs';

const REPORT_REASONS = new Set(['spam', 'incorrect']);
const EVENT_ID_HEX_RE = /^[0-9a-f]{64}$/i;
const VERIFICATION_REPORT_FETCH_CHUNK = 30;
const GAP_FILL_THRESHOLD_SECONDS = 86400;
const EVENT_ID_FETCH_BATCH = 100;
const ENDORSEMENT_FETCH_BATCH = 100;

export function reportedIdsFromReports(reportEvents, requestedIds) {
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

async function fetchReportsForVerificationIds(verificationEventIds, {
  unscoped = false,
  fillGaps = false,
} = {}) {
  if (!verificationEventIds.length) {
    return new Set();
  }

  try {
    await ensureNostrSession();
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

export function getFileAttachmentIDsForVerificationEvent(event) {
  const tags = getMatchingTags(event, 'file-attachment');
  return tags.map(tag => tag[1]).filter(id => id?.length === 64);
}

export async function getEventsFromEventIds(eventIds) {
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
    await ensureNostrSession();
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

async function fetchEventsByIdsFromNetwork(ids) {
  const all = new Set();
  for (let i = 0; i < ids.length; i += EVENT_ID_FETCH_BATCH) {
    const batch = ids.slice(i, i + EVENT_ID_FETCH_BATCH);
    const events = await nostrFetchEvents({ ids: batch });
    events.forEach(event => all.add(event));
  }
  return all;
}

export function groupEndorsementsByVerificationId(endorsements) {
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

export async function getEndorsementsFromVerificationEventIds(verificationEventIds) {
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
    await ensureNostrSession();
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

export async function getAllAttachmentsForAppId(appId, appAssetInformation = null) {
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
                attachmentEvent.parentVerificationEvent = verification;
                attachments.push(attachmentEvent);
              }
            });
          })
        );
      }
    }
  }

  await Promise.all(promises);

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

export async function backgroundSyncEvents() {
  try {
    await ensureNostrSession();
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

function getTimestampMonthsAgo(months = 6) {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return Math.floor(date.getTime() / 1000);
}

export async function getAllAssetInformation({
  months,
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

  await ensureNostrSession();
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

export function getAppInfoFromEventInfo(eventInfo) {
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

export async function getCommentsForVerification(verificationKey) {
  // This is to support the old format of the verificationKey, where
  // the event id was not included. See this issue:
  // https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/844

  // At some point in the future, we can remove this support for the
  // old format and keep only the new format (verificationKey).

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
    await ensureNostrSession();
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

export function getMaxAssetVersion(getAllAssetInformationResult, appId = null) {
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

function isSamePlatform(platform1, platform2) {
  if (platform1 === 'desktop') {
    return platform2 === 'linux' || platform2 === 'windows' || platform2 === 'macos';
  }
  return platform1 === platform2;
}

export function getLastVerificationStatusForAppId(appId, platform) {
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

export function getWeightForAppFromAssetInformation(appId) {
  if (!window.allAssetInformation) {
    throw new Error('window.allAssetInformation is not defined yet');
  }

  const { lastVersion, lastVerifiedVersion } = getMaxAssetVersion(window.allAssetInformation, appId);

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
