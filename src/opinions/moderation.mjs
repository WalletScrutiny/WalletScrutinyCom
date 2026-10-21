/**
 * Per-opinion approve / hide decisions.
 *
 * A decision is a NIP-56 report (kind 1984, the same kind as verification
 * reports) published by a site admin. The project relay already stores that
 * kind when the event carries the WalletScrutiny client tag. The `k` tag is
 * the opinion kind and the `r` tag is the decision, so these events are not
 * verification reports. The newest decision for an opinion id wins. Anyone
 * else publishing the same shape is ignored.
 *
 * An approval covers one version (the `e` id): an edit is a new event and
 * goes back to the queue. A hide also names the opinion address (`a` tag),
 * so it covers every version of that author's opinion on that wallet,
 * including later edits.
 *
 * An author approval (`r` `opinion-author-approve`, the author in a `p` tag
 * and no `e` tag) makes that pubkey a trusted author, like the ones in
 * _data/nostrOpinions.yml: every opinion they have published or publish
 * later counts as approved, unless an admin hides it.
 */
import {
  isWalletScrutinySiteAdmin,
  mainRelayUrl,
  nip89ClientTagD,
  opinionKind,
  siteAdminPubkeys,
  verificationReportKind,
  wsBotPublicKey,
} from '../nostr-constants.mjs';
import { getTagValue, opinionAddress } from './content.mjs';

export const OPINION_DECISION_APPROVE = 'opinion-approve';
export const OPINION_DECISION_HIDE = 'opinion-hide';
export const OPINION_DECISION_APPROVE_AUTHOR = 'opinion-author-approve';

const OPINION_DECISIONS = new Set([OPINION_DECISION_APPROVE, OPINION_DECISION_HIDE]);
const EVENT_ID_HEX = /^[0-9a-f]{64}$/i;
const PUBKEY_HEX = /^[0-9a-f]{64}$/i;
const OPINION_ADDRESS = new RegExp(`^${opinionKind}:[0-9a-f]{64}:.+$`);

export function walletScrutinyClientTags() {
  return [
    ['client', 'WalletScrutiny.com', `31990:${wsBotPublicKey}:${nip89ClientTagD}`, mainRelayUrl],
    ['c', 'walletscrutiny'],
  ];
}

export function buildOpinionModerationDraft({ opinion, decision, createdAt = Math.floor(Date.now() / 1000) }) {
  if (!OPINION_DECISIONS.has(decision)) {
    throw new Error(`Unknown opinion decision: ${decision}`);
  }
  const verb = decision === OPINION_DECISION_APPROVE ? 'approval' : 'hide';
  const address = getTagValue(opinion, 'd') ? opinionAddress(opinion) : '';
  return {
    kind: verificationReportKind,
    created_at: createdAt,
    tags: [
      ['e', opinion.id],
      ['p', opinion.pubkey],
      ...(address ? [['a', address]] : []),
      ['k', String(opinionKind)],
      ['r', decision],
      ...walletScrutinyClientTags(),
    ],
    content: `WalletScrutiny.com admin ${verb} of opinion ${opinion.id}.`,
  };
}

export function buildAuthorApprovalDraft({ pubkey, createdAt = Math.floor(Date.now() / 1000) }) {
  if (!PUBKEY_HEX.test(String(pubkey ?? ''))) {
    throw new Error(`Not a hex pubkey: ${pubkey}`);
  }
  return {
    kind: verificationReportKind,
    created_at: createdAt,
    tags: [
      ['p', pubkey.toLowerCase()],
      ['k', String(opinionKind)],
      ['r', OPINION_DECISION_APPROVE_AUTHOR],
      ...walletScrutinyClientTags(),
    ],
    content: `WalletScrutiny.com admin approval of opinion author ${pubkey.toLowerCase()}.`,
  };
}

/** Pubkeys a site admin approved as opinion authors. */
export function resolveApprovedAuthors(events, adminPubkeys = siteAdminPubkeys) {
  const admins = adminPubkeys instanceof Set ? adminPubkeys : new Set(adminPubkeys ?? []);
  const authors = new Set();
  for (const event of events ?? []) {
    if (!admins.has(event?.pubkey)
      || getTagValue(event, 'k') !== String(opinionKind)
      || getTagValue(event, 'r') !== OPINION_DECISION_APPROVE_AUTHOR) {
      continue;
    }
    const pubkey = getTagValue(event, 'p').toLowerCase();
    if (PUBKEY_HEX.test(pubkey)) {
      authors.add(pubkey);
    }
  }
  return authors;
}

/** The static trusted authors plus the ones approved on Nostr. */
export function withApprovedAuthors(trustedAuthors, events, adminPubkeys = siteAdminPubkeys) {
  return new Set([...trustedAuthors, ...resolveApprovedAuthors(events, adminPubkeys)]);
}

/**
 * Newest admin decision per opinion id, and the newest hide per opinion
 * address (keys like `30023:<pubkey>:<d>`).
 * @returns {Map<string, { decision: string, created_at: number }>}
 */
export function resolveOpinionModeration(events, adminPubkeys = siteAdminPubkeys) {
  const admins = adminPubkeys instanceof Set ? adminPubkeys : new Set(adminPubkeys ?? []);
  const latest = new Map();
  for (const event of events ?? []) {
    if (!admins.has(event?.pubkey)) {
      continue;
    }
    if (getTagValue(event, 'k') !== String(opinionKind)) {
      continue;
    }
    const decision = getTagValue(event, 'r');
    if (!OPINION_DECISIONS.has(decision)) {
      continue;
    }
    const targetId = getTagValue(event, 'e').toLowerCase();
    if (!EVENT_ID_HEX.test(targetId)) {
      continue;
    }
    keepNewest(latest, targetId, decision, event.created_at ?? 0);
    const address = getTagValue(event, 'a');
    if (decision === OPINION_DECISION_HIDE && OPINION_ADDRESS.test(address)) {
      keepNewest(latest, address, decision, event.created_at ?? 0);
    }
  }
  return latest;
}

function keepNewest(map, key, decision, createdAt) {
  const known = map.get(key);
  if (!known || createdAt >= known.created_at) {
    map.set(key, { decision, created_at: createdAt });
  }
}

/** The decision for this version, or a newer hide of its address. */
function decisionFor(event, moderation) {
  const byId = moderation.get(event.id) ?? moderation.get(String(event.id).toLowerCase()) ?? null;
  const byAddress = getTagValue(event, 'd') ? moderation.get(opinionAddress(event)) ?? null : null;
  if (byAddress && (!byId || byAddress.created_at > byId.created_at)) {
    return byAddress.decision;
  }
  return byId?.decision ?? null;
}

/**
 * How an opinion is treated. An explicit hide wins over a trusted author.
 * `approved` is an explicit approval or a trusted author with no hide.
 */
export function opinionListStatus(event, { trustedAuthors, moderation }) {
  const decision = decisionFor(event, moderation);
  switch (decision) {
    case OPINION_DECISION_HIDE:
      return 'hidden';
    case OPINION_DECISION_APPROVE:
      return 'approved';
    case null:
      return trustedAuthors.has(event.pubkey) ? 'approved-author' : 'open';
    default: {
      const unexpected = decision;
      throw new Error(`Unknown opinion decision: ${unexpected}`);
    }
  }
}

export function isExplicitlyApproved(event, moderation) {
  return opinionListStatus(event, { trustedAuthors: new Set(), moderation }) === 'approved';
}

/** Approve / Hide buttons on a wallet page: site admins, on opinions nobody has decided yet. */
export function canModerateOpinion(event, { me, trustedAuthors, moderation }) {
  return isWalletScrutinySiteAdmin(me)
    && event?.kind === opinionKind
    && opinionListStatus(event, { trustedAuthors, moderation }) === 'open';
}

/** Opinions by site admins already show on the wallet page, so the index skips them. */
export function opinionsForModeration(events) {
  return events.filter((event) => !isWalletScrutinySiteAdmin(event.pubkey));
}

function moderationActionLabel(decision) {
  switch (decision) {
    case OPINION_DECISION_APPROVE:
      return 'Approval';
    case OPINION_DECISION_HIDE:
      return 'Hide';
    default: {
      const unexpected = decision;
      throw new Error(`Unknown opinion decision: ${unexpected}`);
    }
  }
}

/**
 * Toast text for a moderation publish. `summary` is the relay outcome from
 * signAndPublish: how many relays accepted the event, and why the others did not.
 */
export function moderationRelayMessage(decision, summary) {
  const action = moderationActionLabel(decision);
  if (summary.successful === summary.total) {
    const noun = summary.successful === 1 ? 'relay' : 'relays';
    return `${action} sent to ${summary.successful} ${noun}.`;
  }
  const failed = summary.failures.map(({ url, error }) => `${url} (${error})`).join(', ');
  return `${action} accepted by ${summary.successful} of ${summary.total} relays. Not accepted by ${failed}.`;
}

/** The index is a queue: an opinion that is already approved or hidden stays off it. */
export function pendingModerationOpinions(events, { trustedAuthors, moderation }) {
  return events.filter((event) => opinionListStatus(event, { trustedAuthors, moderation }) === 'open');
}

/**
 * Subject (`collection/id` and the legacy android/iphone ids) to the wallet
 * object from allWallets.js. Active listings replace archived ones.
 */
export function indexWalletsBySubject(wallets) {
  const index = new Map();
  const put = (key, wallet) => {
    if (key) {
      index.set(key, wallet);
    }
  };
  const archived = [];
  const active = [];
  for (const wallet of wallets ?? []) {
    if (wallet?.archived) {
      archived.push(wallet);
    } else {
      active.push(wallet);
    }
  }
  for (const wallet of archived) {
    put(wallet.appId ? `${wallet.folder}/${wallet.appId}` : '', wallet);
  }
  for (const wallet of active) {
    const folder = wallet.folder || 'mobile';
    put(wallet.appId ? `${folder}/${wallet.appId}` : '', wallet);
    put(wallet.androidAppId ? `android/${wallet.androidAppId}` : '', wallet);
    put(wallet.iphoneAppId ? `iphone/${wallet.iphoneAppId}` : '', wallet);
  }
  return index;
}
