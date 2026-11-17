/**
 * Reads and writes for the community opinions widget, on top of the site's
 * shared Nostr pool (src/nostr-client.mjs).
 *
 * Reads go to opinionRelayUrls (site relays + the public relays the
 * nostr-opinion plugin used). Writes go to the relay set the webapp is
 * connected to; an opinion must be accepted by the project relay, replies and
 * reactions cannot be (kind-policy.py stores neither kind 1 nor 7).
 */
import {
  fetchEvents,
  fetchEventsWithPagination,
  publishEvent,
  assertRequiredRelaysAccepted,
  signEvent,
} from '../nostr-client.mjs';
import { mainRelayUrl, siteAdminPubkeys, verificationReportKind } from '../nostr-constants.mjs';
import {
  opinionKind,
  replyKind,
  reactionKind,
  deletionKind,
  opinionRelayUrls,
  fetchMaxWaitMs,
  zapstoreAppKind,
  zapstoreCommentKind,
  zapstoreRelayUrls,
} from './constants.mjs';
import { buildOpinionContent, getTagValue, getTags, opinionAddress, zapstoreAppAddress } from './content.mjs';
import { OPINION_DECISION_APPROVE, OPINION_DECISION_APPROVE_AUTHOR, OPINION_DECISION_HIDE } from './moderation.mjs';

async function query(filter, maxWait = fetchMaxWaitMs) {
  const events = await fetchEvents(filter, { relayUrls: opinionRelayUrls, maxWait });
  return [...events];
}

/** Every version of every opinion on the canonical and legacy subjects. */
export function fetchOpinions(subjectKeys) {
  return query({ kinds: [opinionKind], '#d': subjectKeys });
}

/**
 * Every WalletScrutiny opinion on the opinion relays, including older
 * versions. Paged, because a single response is capped by the relay.
 */
export async function fetchAllOpinionVersions() {
  const events = await fetchEventsWithPagination(
    { kinds: [opinionKind], '#t': ['WalletScrutiny', 'nostrOpinion'] },
    { relayUrls: opinionRelayUrls, maxWait: 8000 },
  );
  return [...events];
}

const DELETION_FILTER_CHUNK = 40;

async function collectChunked(filters) {
  const events = new Map();
  const batches = await Promise.all(filters.map((filter) => query(filter)));
  for (const batch of batches) {
    for (const event of batch) {
      events.set(event.id, event);
    }
  }
  return [...events.values()];
}

/** Deletion requests that name these opinions by id or by address. */
export function fetchOpinionDeletions(opinions) {
  if (!opinions.length) {
    return Promise.resolve([]);
  }
  const filters = [];
  const addresses = [...new Set(opinions.map(opinionAddress))];
  const ids = opinions.map((event) => event.id);
  for (let i = 0; i < addresses.length; i += DELETION_FILTER_CHUNK) {
    filters.push({ kinds: [deletionKind], '#a': addresses.slice(i, i + DELETION_FILTER_CHUNK) });
  }
  for (let i = 0; i < ids.length; i += DELETION_FILTER_CHUNK) {
    filters.push({ kinds: [deletionKind], '#e': ids.slice(i, i + DELETION_FILTER_CHUNK) });
  }
  return collectChunked(filters);
}

/** Admin approve/hide decisions for opinions and approved authors. Verification reports have no `k` tag, so they are not included. */
export async function fetchOpinionModeration() {
  if (!siteAdminPubkeys.length) {
    return [];
  }
  return query({
    kinds: [verificationReportKind],
    authors: siteAdminPubkeys,
    '#k': [String(opinionKind)],
    '#r': [OPINION_DECISION_APPROVE, OPINION_DECISION_HIDE, OPINION_DECISION_APPROVE_AUTHOR],
  });
}

/**
 * Replies, reactions and deletion requests for a list of opinions.
 * Reactions can target replies too, so they are fetched once the replies are known.
 */
export async function fetchThreadData(opinions) {
  if (!opinions.length) {
    return { replies: [], reactions: [], deletions: [] };
  }
  const addresses = opinions.map(opinionAddress);
  const opinionIds = opinions.map((event) => event.id);

  const [replies, addressDeletions] = await Promise.all([
    query({ kinds: [replyKind], '#a': addresses }),
    query({ kinds: [deletionKind], '#a': addresses }),
  ]);

  const ids = [...opinionIds, ...replies.map((event) => event.id)];
  const [reactions, idDeletions] = await Promise.all([
    query({ kinds: [reactionKind], '#e': ids }),
    query({ kinds: [deletionKind], '#e': ids }),
  ]);

  const deletions = new Map();
  for (const deletion of [...addressDeletions, ...idDeletions]) {
    deletions.set(deletion.id, deletion);
  }
  return { replies, reactions, deletions: [...deletions.values()] };
}

/**
 * Comments posted on Zapstore for an Android app: the app event(s) with that
 * package id give the publisher pubkey(s), the comments name them in their `A`
 * tag. Deletion requests are fetched for the comments found. Zapstore relay only.
 */
export async function fetchZapstoreComments(appId) {
  const none = { comments: [], deletions: [] };
  if (!appId) {
    return none;
  }
  const options = { relayUrls: zapstoreRelayUrls, maxWait: fetchMaxWaitMs };
  const apps = await fetchEvents({ kinds: [zapstoreAppKind], '#d': [appId] }, options);
  const addresses = [...new Set([...apps].map((app) => zapstoreAppAddress(app.pubkey, appId)))];
  if (!addresses.length) {
    return none;
  }
  const comments = [...await fetchEvents({ kinds: [zapstoreCommentKind], '#A': addresses }, options)];
  if (!comments.length) {
    return none;
  }
  const deletions = [...await fetchEvents({ kinds: [deletionKind], '#e': comments.map((event) => event.id) }, options)];
  return { comments, deletions };
}

function now() {
  return Math.floor(Date.now() / 1000);
}

/**
 * Signs with the browser extension and publishes to the webapp's relays.
 * With `requireMainRelay`, the project relay must have answered OK.
 */
export async function signAndPublish(draft, { eventType = 'event', requireMainRelay = false, includeSummary = false } = {}) {
  const signed = await signEvent(draft);
  const summary = await publishEvent(signed, undefined, {
    requiredRelayUrls: requireMainRelay ? [mainRelayUrl] : [],
  });
  assertRequiredRelaysAccepted(summary, eventType);
  if (summary.successful === 0) {
    const reasons = summary.failures.map(({ url, error }) => `${url} (${error})`).join(', ');
    throw new Error(`Failed to publish ${eventType}: no relay accepted it. ${reasons}`);
  }
  console.debug(`Published ${eventType} (id: ${signed.id}) to ${summary.successful}/${summary.total} relays`);
  return includeSummary ? { event: signed, summary } : signed;
}

/**
 * Kind-30023 opinion, same shape as the nostr-opinion plugin produced.
 * `previous` is the author's current opinion when editing: its published_at
 * is kept so the card can show "Edited".
 */
export function buildOpinionDraft(config, { body, sentiment, previous = null }) {
  const createdAt = now();
  const previousPublishedAt = previous ? getTagValue(previous, 'published_at') : '';
  const publishedAt = /^\d+$/.test(previousPublishedAt) ? previousPublishedAt : String(createdAt);
  const tags = [
    ['d', config.subject],
    ['sentiment', sentiment],
    ['summary', config.summary],
    ['published_at', publishedAt],
  ];
  if (config.title) {
    tags.push(['title', config.title]);
  }
  if (config.image) {
    tags.push(['image', config.image]);
  }
  for (const tag of config.tags) {
    tags.push(['t', tag]);
  }
  return {
    kind: opinionKind,
    created_at: createdAt,
    tags,
    content: buildOpinionContent({
      header: config.header,
      body,
      footer: config.footer,
      tags: config.tags,
    }),
  };
}

/** NIP-10 reply under an opinion thread: `target` is the event being answered. */
export function buildReplyDraft({ opinion, target, body }) {
  const tags = [
    ['a', opinionAddress(opinion)],
    ['e', opinion.id, '', 'root'],
  ];
  if (target.id !== opinion.id) {
    tags.push(['e', target.id, '', 'reply']);
  }
  const mentioned = new Set([target.pubkey, opinion.pubkey, ...getTags(target, 'p').map((tag) => tag[1])]);
  for (const pubkey of mentioned) {
    if (pubkey) {
      tags.push(['p', pubkey]);
    }
  }
  return { kind: replyKind, created_at: now(), tags, content: body };
}

/** NIP-25 reaction: "+" like, "-" dislike, "" withdraws the author's reaction. */
export function buildReactionDraft({ opinion, target, content }) {
  return {
    kind: reactionKind,
    created_at: now(),
    tags: [
      ['a', opinionAddress(opinion)],
      ['p', target.pubkey],
      ['e', target.id, '', target.id === opinion.id ? 'root' : 'reply'],
      ['k', String(target.kind)],
    ],
    content,
  };
}

/** NIP-09 deletion request; addressable opinions are also named by address. */
export function buildDeletionDraft(event) {
  const tags = [['e', event.id], ['k', String(event.kind)]];
  if (event.kind === opinionKind) {
    tags.push(['a', opinionAddress(event)]);
  }
  return { kind: deletionKind, created_at: now(), tags, content: '' };
}
