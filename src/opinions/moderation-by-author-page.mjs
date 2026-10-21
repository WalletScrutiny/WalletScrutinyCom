/**
 * /opinions_by_author/: the same queue as /opinions/, grouped by author.
 * Each author is one card with their undecided opinions indented below it,
 * and Approve all / Hide all publish one decision per opinion, exactly the
 * events the per-opinion buttons publish, so both pages and the wallet pages
 * agree on every decision.
 */
import * as nip19 from 'nostr-tools/nip19';
import { el } from '../html-utils.mjs';
import { isWalletScrutinySiteAdmin, siteAdminPubkeys } from '../nostr-constants.mjs';
import { showToast } from '../verifications_utils.mjs';
import {
  getProfileDisplayName,
  getProfileImageUrl,
  hasProfileIdentity,
  profileImageFallback,
} from '../nostr-profile.mjs';
import { SENTIMENT_LABELS } from './constants.mjs';
import { getSentiment, getTagValue } from './content.mjs';
import {
  OPINION_DECISION_APPROVE,
  OPINION_DECISION_HIDE,
  buildOpinionModerationDraft,
  pendingModerationOpinions,
  resolveOpinionModeration,
} from './moderation.mjs';
import { signAndPublish } from './nostr.mjs';
import { OpinionModerationPage, formatDate, renderOpinionBody, walletTitle } from './moderation-page.mjs';

function plural(count, noun) {
  return `${count} ${count === 1 ? noun : `${noun}s`}`;
}

function shortNpub(pubkey) {
  try {
    const npub = nip19.npubEncode(pubkey);
    return `${npub.slice(0, 12)}…${npub.slice(-6)}`;
  } catch {
    return pubkey;
  }
}

/**
 * Opinions grouped by author: the authors with the most opinions first, ties
 * broken by the newest opinion. Each author's opinions are newest first.
 * @returns {Array<{ pubkey: string, opinions: object[] }>}
 */
export function groupOpinionsByAuthor(events) {
  const groups = new Map();
  for (const event of events) {
    if (!groups.has(event.pubkey)) {
      groups.set(event.pubkey, []);
    }
    groups.get(event.pubkey).push(event);
  }
  const newest = (opinions) => Math.max(...opinions.map((event) => event.created_at ?? 0));
  return [...groups].map(([pubkey, opinions]) => ({
    pubkey,
    opinions: opinions.sort((a, b) => (b.created_at ?? 0) - (a.created_at ?? 0)),
  })).sort((a, b) => (b.opinions.length - a.opinions.length) || (newest(b.opinions) - newest(a.opinions)));
}

export class OpinionModerationByAuthorPage extends OpinionModerationPage {
  constructor(root) {
    super(root);
    this.pendingAuthors = new Set();
  }

  renderList() {
    if (!this.isAdmin || !this.shellReady) {
      return;
    }
    this.listEl.replaceChildren();
    if (!this.loaded) {
      return;
    }
    if (this.loadError) {
      const retry = el('button', { type: 'button' }, 'Retry');
      retry.addEventListener('click', () => this.load());
      this.countEl.textContent = '';
      this.listEl.appendChild(el('p', {}, 'Could not load the opinions. ', retry));
      return;
    }

    const visible = this.visibleOpinions();
    const groups = groupOpinionsByAuthor(visible);
    const total = this.opinions.length;
    const totalAuthors = new Set(this.opinions.map((event) => event.pubkey)).size;
    this.countEl.textContent = visible.length === total
      ? `${plural(totalAuthors, 'author')}, ${plural(total, 'opinion')}`
      : `${groups.length} of ${plural(totalAuthors, 'author')}, ${visible.length} of ${plural(total, 'opinion')}`;

    if (!groups.length) {
      this.listEl.appendChild(el('p', {}, total === 0 ? 'No opinions yet.' : 'No opinions match this filter.'));
      return;
    }
    for (const group of groups) {
      this.listEl.appendChild(this.renderAuthor(group));
    }
  }

  renderAuthor({ pubkey, opinions }) {
    const profile = this.profiles.get(pubkey);
    const avatar = el('img', {
      className: 'opinion-moderation__avatar',
      src: getProfileImageUrl(profile),
      alt: '',
      loading: 'lazy',
    });
    avatar.addEventListener('error', () => profileImageFallback(avatar));

    const card = el('article', { className: 'opinion-moderation__author' },
      el('header', { className: 'opinion-moderation__author-header' },
        avatar,
        el('div', { className: 'opinion-moderation__author-title' },
          el('h2', { className: 'opinion-moderation__author-name' }, getProfileDisplayName(profile, pubkey)),
          el('p', { className: 'opinion-moderation__meta' },
            el('span', {}, shortNpub(pubkey)),
            el('span', {}, plural(opinions.length, 'opinion')),
          ),
        ),
      ),
      hasProfileIdentity(profile) ? null : el('p', {
        className: 'opinion-moderation__note',
        role: 'note',
      }, 'This author has no profile name or picture, so their opinions won\'t show on the website or app. Approving them will show them on the wallet pages.'),
    );
    if (isWalletScrutinySiteAdmin(this.me)) {
      card.appendChild(this.renderAuthorActions(pubkey, opinions));
    }
    card.appendChild(el('div', { className: 'opinion-moderation__author-opinions' },
      ...opinions.map((event) => this.renderAuthorOpinion(event)),
    ));
    return card;
  }

  renderAuthorOpinion(event) {
    const wallet = this.wallets.get(getTagValue(event, 'd'));
    const title = walletTitle(event, wallet);
    const heading = wallet?.url
      ? el('a', { href: `${wallet.url}#communityOpinions` }, title)
      : el('span', {}, title);
    const sentiment = getSentiment(event);
    return el('section', { className: 'opinion-moderation__item' },
      el('h3', { className: 'opinion-moderation__wallet' }, heading),
      el('p', { className: 'opinion-moderation__meta' },
        sentiment ? el('span', {}, SENTIMENT_LABELS[sentiment]) : null,
        el('span', {}, formatDate(event.created_at)),
      ),
      renderOpinionBody(event),
    );
  }

  renderAuthorActions(pubkey, opinions) {
    const pending = this.pendingAuthors.has(pubkey);
    const suffix = opinions.length > 1 ? ` all ${opinions.length}` : '';
    const approve = el('button', { type: 'button', disabled: pending }, `Approve${suffix}`);
    const hide = el('button', { type: 'button', disabled: pending }, `Hide${suffix}`);
    approve.addEventListener('click', () => this.decideAuthor(pubkey, opinions, OPINION_DECISION_APPROVE));
    hide.addEventListener('click', () => this.decideAuthor(pubkey, opinions, OPINION_DECISION_HIDE));
    return el('div', { className: 'opinion-moderation__actions' }, approve, hide);
  }

  /**
   * One decision event per opinion, published one after the other so the
   * extension asks for one signature at a time. Stops at the first failure;
   * the opinions decided so far stay decided.
   */
  async decideAuthor(pubkey, opinions, decision) {
    if (!isWalletScrutinySiteAdmin(this.me)) {
      return;
    }
    this.pendingAuthors.add(pubkey);
    this.renderList();
    let done = 0;
    let partial = false;
    let failure = null;
    try {
      for (const opinion of opinions) {
        const { event: signed, summary } = await signAndPublish(buildOpinionModerationDraft({ opinion, decision }), {
          eventType: decision === OPINION_DECISION_APPROVE ? 'approval' : 'hide',
          requireMainRelay: true,
          includeSummary: true,
        });
        this.moderationEvents.push(signed);
        done += 1;
        partial ||= summary.successful !== summary.total;
      }
    } catch (error) {
      failure = error;
    } finally {
      this.moderation = resolveOpinionModeration(this.moderationEvents, siteAdminPubkeys);
      this.opinions = pendingModerationOpinions(this.opinions, {
        trustedAuthors: this.lists.trustedAuthors,
        moderation: this.moderation,
      });
      this.pendingAuthors.delete(pubkey);
      this.renderList();
    }
    const verb = decision === OPINION_DECISION_APPROVE ? 'Approved' : 'Hid';
    const counted = `${verb} ${done} of ${plural(opinions.length, 'opinion')}`;
    if (failure) {
      showToast(`${counted}. ${failure?.message || 'Could not publish the decision.'}`, 'error');
    } else if (partial) {
      showToast(`${counted}. Some relays did not accept every decision.`, 'warning');
    } else {
      showToast(`${counted}.`, 'success');
    }
  }
}
