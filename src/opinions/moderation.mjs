/**
 * Per-opinion approve / hide decisions.
 *
 * A decision is a NIP-56 report (kind 1984, the same kind as verification
 * reports) published by a site admin. The project relay already stores that
 * kind when the event carries the WalletScrutiny client tag. The `k` tag is
 * the opinion kind and the `r` tag is the decision, so these events are not
 * verification reports. The newest decision for an opinion id wins. Anyone
 * else publishing the same shape is ignored.
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
import { getTagValue } from './content.mjs';

export const OPINION_DECISION_APPROVE = 'opinion-approve';
export const OPINION_DECISION_HIDE = 'opinion-hide';

const OPINION_DECISIONS = new Set([OPINION_DECISION_APPROVE, OPINION_DECISION_HIDE]);
const EVENT_ID_HEX = /^[0-9a-f]{64}$/i;

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
  return {
    kind: verificationReportKind,
    created_at: createdAt,
    tags: [
      ['e', opinion.id],
      ['p', opinion.pubkey],
      ['k', String(opinionKind)],
      ['r', decision],
      ...walletScrutinyClientTags(),
    ],
    content: `WalletScrutiny.com admin ${verb} of opinion ${opinion.id}.`,
  };
}

/**
 * Newest admin decision per opinion id.
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
    const known = latest.get(targetId);
    if (!known || (event.created_at ?? 0) >= known.created_at) {
      latest.set(targetId, { decision, created_at: event.created_at ?? 0 });
    }
  }
  return latest;
}

/**
 * How an opinion is treated. An explicit hide wins over a trusted author.
 * `approved` is an explicit approval or a trusted author with no hide.
 */
export function opinionListStatus(event, { trustedAuthors, moderation }) {
  const decision = moderation.get(event.id)?.decision ?? moderation.get(String(event.id).toLowerCase())?.decision ?? null;
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
