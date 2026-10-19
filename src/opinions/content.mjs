/**
 * Pure helpers for the community opinions widget: event shapes, threading,
 * tallies and sorting. No DOM, no network, so they are unit-tested directly.
 */
import {
  opinionKind,
  replyKind,
  reactionKind,
  deletionKind,
  opinionHeaderSeparator,
  opinionFooterSeparator,
  SENTIMENTS,
  zapstoreAppKind,
  zapstoreCommentKind,
} from './constants.mjs';

const headerRegex = new RegExp(`^[\\s\\S]*?${opinionHeaderSeparator}`);
const footerRegex = new RegExp(`${opinionFooterSeparator}[\\s\\S]*$`);

export function getTagValue(event, name) {
  return event?.tags?.find((tag) => tag[0] === name)?.[1] ?? '';
}

export function getTags(event, name) {
  return event?.tags?.filter((tag) => tag[0] === name) ?? [];
}

/** The canonical subject first, then the legacy aliases (read-only). */
export function parseSubjectKeys(primary, aliases = '') {
  const keys = [];
  for (const part of [primary, ...String(aliases ?? '').split(',')]) {
    const trimmed = String(part ?? '').trim();
    if (trimmed && !keys.includes(trimmed)) {
      keys.push(trimmed);
    }
  }
  return keys;
}

/** Only the part of an opinion the author typed (header and footer removed). */
export function stripOpinionWrapper(content) {
  return String(content ?? '').replace(headerRegex, '').replace(footerRegex, '').trim();
}

/** Full content of a kind-30023 opinion as published by the plugin and the widget. */
export function buildOpinionContent({ header = '', body = '', footer = '', tags = [] }) {
  let content = header ? header + opinionHeaderSeparator : '';
  content += body + opinionFooterSeparator;
  content += tags.map((tag) => `#${tag} `).join('');
  if (footer) {
    content += '\n\n' + footer;
  }
  return content;
}

export function parseTagList(value) {
  return String(value ?? '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function getSentiment(event) {
  const sentiment = getTagValue(event, 'sentiment');
  return SENTIMENTS.includes(sentiment) ? sentiment : null;
}

export function opinionAddress(event) {
  return `${opinionKind}:${event.pubkey}:${getTagValue(event, 'd')}`;
}

/**
 * One opinion per author across the canonical and legacy subjects: the newest
 * version wins. Blocked events and authors never make it into the list.
 */
export function latestOpinionPerAuthor(events, { blockedEventIds = new Set(), blockedAuthors = new Set() } = {}) {
  const byAuthor = new Map();
  for (const event of events) {
    if (event.kind !== opinionKind) continue;
    if (blockedEventIds.has(event.id) || blockedAuthors.has(event.pubkey)) continue;
    const current = byAuthor.get(event.pubkey);
    if (!current || (event.created_at ?? 0) >= (current.created_at ?? 0)) {
      byAuthor.set(event.pubkey, event);
    }
  }
  return [...byAuthor.values()];
}

/**
 * NIP-09: an author's deletion request removes their events named by id (e tag)
 * and the versions of their addressable events (a tag) published no later than
 * the request. Requests signed by anyone else are ignored.
 */
export function applyDeletions(events, deletions) {
  if (!deletions?.length) {
    return [...events];
  }
  const deletedIds = new Map();
  const deletedAddresses = new Map();
  for (const deletion of deletions) {
    if (deletion.kind !== deletionKind) continue;
    for (const [name, value] of deletion.tags ?? []) {
      if (name === 'e' && value) {
        deletedIds.set(`${deletion.pubkey}:${value}`, deletion.created_at ?? 0);
      } else if (name === 'a' && value) {
        const previous = deletedAddresses.get(`${deletion.pubkey}:${value}`) ?? 0;
        deletedAddresses.set(`${deletion.pubkey}:${value}`, Math.max(previous, deletion.created_at ?? 0));
      }
    }
  }
  return events.filter((event) => {
    if (deletedIds.has(`${event.pubkey}:${event.id}`)) {
      return false;
    }
    if (event.kind === opinionKind) {
      const deletedAt = deletedAddresses.get(`${event.pubkey}:${opinionAddress(event)}`);
      if (deletedAt !== undefined && (event.created_at ?? 0) <= deletedAt) {
        return false;
      }
    }
    return true;
  });
}

/**
 * One opinion per author and subject (`d` tag): the newest version wins.
 * Blocked events and authors never make it into the list. Events with no
 * subject are dropped.
 */
export function latestOpinionPerSubject(events, { blockedEventIds = new Set(), blockedAuthors = new Set() } = {}) {
  const byKey = new Map();
  for (const event of events) {
    if (event.kind !== opinionKind) continue;
    if (blockedEventIds.has(event.id) || blockedAuthors.has(event.pubkey)) continue;
    const subject = getTagValue(event, 'd');
    if (!subject) continue;
    const key = `${event.pubkey}:${subject}`;
    const current = byKey.get(key);
    if (!current || (event.created_at ?? 0) >= (current.created_at ?? 0)) {
      byKey.set(key, event);
    }
  }
  return [...byKey.values()];
}

/** Plain-text preview of an opinion body, with the header and footer removed. */
export function opinionExcerpt(content, maxLength = 400) {
  const body = stripOpinionWrapper(content)
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (body.length <= maxLength) {
    return body;
  }
  return `${body.slice(0, maxLength).trimEnd()}...`;
}

/**
 * Preferred opinions first (a trusted author, or an id in `approvedEventIds`),
 * then newest first.
 */
export function sortOpinions(events, trustedAuthors, approvedEventIds = null) {
  const preferred = (event) => trustedAuthors.has(event.pubkey) || Boolean(approvedEventIds?.has(event.id));
  return [...events].sort((a, b) => {
    const aPreferred = preferred(a);
    const bPreferred = preferred(b);
    if (aPreferred !== bPreferred) {
      return aPreferred ? -1 : 1;
    }
    return (b.created_at ?? 0) - (a.created_at ?? 0);
  });
}

export function tallySentiments(events) {
  const counts = { '1': 0, '0': 0, '-1': 0 };
  for (const event of events) {
    const sentiment = getSentiment(event);
    if (sentiment !== null) {
      counts[sentiment] += 1;
    }
  }
  return counts;
}

/**
 * Parent of a reply: the e tag marked "reply", else the one marked "root",
 * else (legacy, no markers) the last e tag.
 */
export function getReplyParentId(reply) {
  const eTags = getTags(reply, 'e');
  if (!eTags.length) {
    return null;
  }
  const marked = eTags.find((tag) => tag[3] === 'reply') ?? eTags.find((tag) => tag[3] === 'root');
  return (marked ?? eTags[eTags.length - 1])[1] ?? null;
}

/**
 * Groups replies by parent id, oldest first. Replies to events that are not in
 * `knownIds` (deleted opinions, foreign threads) are dropped. Replies are
 * kind-1 notes; Zapstore threads pass `kind: zapstoreCommentKind`.
 */
export function buildReplyTree(replies, knownIds, { kind = replyKind } = {}) {
  const children = new Map();
  const accepted = new Set(knownIds);
  const pending = replies
    .filter((reply) => reply.kind === kind)
    .sort((a, b) => (a.created_at ?? 0) - (b.created_at ?? 0));

  // A reply's parent may itself be a reply that appears later in the list.
  let progress = true;
  let remaining = pending;
  while (progress && remaining.length) {
    progress = false;
    const next = [];
    for (const reply of remaining) {
      const parentId = getReplyParentId(reply);
      if (parentId && accepted.has(parentId)) {
        if (!children.has(parentId)) {
          children.set(parentId, []);
        }
        children.get(parentId).push(reply);
        accepted.add(reply.id);
        progress = true;
      } else {
        next.push(reply);
      }
    }
    remaining = next;
  }
  return children;
}

export function countThread(tree, id) {
  const direct = tree.get(id) ?? [];
  return direct.reduce((total, reply) => total + 1 + countThread(tree, reply.id), 0);
}

/**
 * Latest reaction per author per target. Returns Map<targetId, { likes,
 * dislikes, byAuthor: Map<pubkey, "+"|"-"|""> }>.
 */
export function tallyReactions(reactions) {
  const latest = new Map();
  for (const reaction of reactions) {
    if (reaction.kind !== reactionKind) continue;
    const targetId = getTags(reaction, 'e').at(-1)?.[1];
    if (!targetId) continue;
    const key = `${targetId}:${reaction.pubkey}`;
    const current = latest.get(key);
    if (!current || (reaction.created_at ?? 0) > (current.created_at ?? 0)) {
      latest.set(key, reaction);
    }
  }
  const result = new Map();
  for (const reaction of latest.values()) {
    const targetId = getTags(reaction, 'e').at(-1)[1];
    if (!result.has(targetId)) {
      result.set(targetId, { likes: 0, dislikes: 0, byAuthor: new Map() });
    }
    const entry = result.get(targetId);
    const content = reaction.content === '+' || reaction.content === '-' ? reaction.content : '';
    entry.byAuthor.set(reaction.pubkey, content);
    if (content === '+') entry.likes += 1;
    if (content === '-') entry.dislikes += 1;
  }
  return result;
}

export function emptyReactionTally() {
  return { likes: 0, dislikes: 0, byAuthor: new Map() };
}

/** "Edited." when the opinion was republished after its first publication. */
export function isEdited(event) {
  const publishedAt = Number.parseInt(getTagValue(event, 'published_at'), 10);
  return Number.isFinite(publishedAt) && publishedAt < (event.created_at ?? 0);
}

/** Zapstore app address (NIP-82 kind 32267) a comment must name in its `A` tag. */
export function zapstoreAppAddress(publisherPubkey, appId) {
  return `${zapstoreAppKind}:${publisherPubkey}:${appId}`;
}

/**
 * Splits Zapstore comments into top-level comments on the app (newest first)
 * and replies (NIP-22: a reply names its parent comment in an `e` tag).
 * Blocked events and authors are dropped like everywhere else.
 */
export function splitZapstoreComments(events, { blockedEventIds = new Set(), blockedAuthors = new Set() } = {}) {
  const roots = [];
  const replies = [];
  for (const event of events) {
    if (event.kind !== zapstoreCommentKind) continue;
    if (blockedEventIds.has(event.id) || blockedAuthors.has(event.pubkey)) continue;
    if (getTags(event, 'e').length) {
      replies.push(event);
    } else {
      roots.push(event);
    }
  }
  roots.sort((a, b) => (b.created_at ?? 0) - (a.created_at ?? 0));
  return { roots, replies };
}

/** App version the Zapstore comment was written for (`v` tag), or ''. */
export function zapstoreCommentVersion(event) {
  return getTagValue(event, 'v').trim();
}
