/**
 * /opinions/: the queue of undecided third-party opinions, grouped by author.
 * Each author is one card with their opinions indented below it. Approve
 * author publishes one author approval: everything that author has published
 * or publishes later counts as approved, on every page. Hide all publishes one
 * hide per opinion. Not linked from the site menu. The list is rendered only
 * for siteAdminPubkeys.
 * The stylesheet and the mount live in moderation-page-boot.mjs so unit tests
 * can import this module without a CSS loader.
 */
import * as nip19 from 'nostr-tools/nip19';
import { el } from '../html-utils.mjs';
import { isWalletScrutinySiteAdmin, siteAdminPubkeys } from '../nostr-constants.mjs';
import { showToast } from '../verifications_utils.mjs';
import { parseMarkdownToSafeHtml } from '../marked-loader.mjs';
import {
  getNostrProfiles,
  getProfileDisplayName,
  getProfileImageUrl,
  hasProfileIdentity,
  profileImageFallback,
} from '../nostr-profile.mjs';
import { readModerationLists } from './config.mjs';
import { SENTIMENT_LABELS } from './constants.mjs';
import {
  applyDeletions,
  getSentiment,
  getTagValue,
  latestOpinionPerSubject,
  opinionExcerpt,
  stripOpinionWrapper,
} from './content.mjs';
import {
  OPINION_DECISION_HIDE,
  buildAuthorApprovalDraft,
  buildOpinionModerationDraft,
  indexWalletsBySubject,
  opinionListStatus,
  opinionsForModeration,
  pendingModerationOpinions,
  resolveOpinionModeration,
  withApprovedAuthors,
} from './moderation.mjs';
import {
  fetchAllOpinionVersions,
  fetchOpinionDeletions,
  fetchOpinionModeration,
  signAndPublish,
} from './nostr.mjs';
import { detectIdentity, EXTENSION_DECLINED_MESSAGE, getPubkey, hasExtension, onAuthChange } from './auth.mjs';

function whenWalletsReady() {
  if (window.allWalletsLoaded && Array.isArray(window.wallets)) {
    return Promise.resolve(window.wallets);
  }
  return new Promise((resolve) => {
    const finish = () => resolve(Array.isArray(window.wallets) ? window.wallets : []);
    const timer = setTimeout(finish, 15000);
    window.addEventListener('allWalletsLoaded', () => {
      clearTimeout(timer);
      finish();
    }, { once: true });
  });
}

export function formatDate(createdAt) {
  if (!createdAt) {
    return '';
  }
  return new Date(createdAt * 1000).toLocaleDateString('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function walletTitle(event, wallet) {
  if (wallet?.title) {
    return wallet.title;
  }
  const fromEvent = getTagValue(event, 'title').replace(/^Opinion about\s+/i, '').trim();
  return fromEvent || getTagValue(event, 'd') || 'Unknown wallet';
}

/** The whole opinion, rendered like the wallet page's card but never clamped. */
export function renderOpinionBody(event) {
  const markdown = stripOpinionWrapper(event.content).trim();
  const body = el('div', { className: 'opinion-moderation__body' }, markdown || '(No text)');
  if (markdown) {
    parseMarkdownToSafeHtml(markdown).then((html) => {
      body.innerHTML = html;
    }).catch((error) => {
      console.error('opinions: could not render content', error);
    });
  }
  return body;
}

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

export class OpinionModerationPage {
  constructor(root) {
    this.root = root;
    this.lists = readModerationLists(root.dataset);
    // _data/nostrOpinions.yml; lists.trustedAuthors adds the authors approved on Nostr.
    this.staticTrustedAuthors = this.lists.trustedAuthors;
    this.opinions = [];
    this.moderationEvents = [];
    this.moderation = new Map();
    this.profiles = new Map();
    this.wallets = new Map();
    this.me = null;
    this.loaded = false;
    this.loading = false;
    this.shellReady = false;
    this.loadError = null;
    this.query = '';
    this.pendingAuthors = new Set();
  }

  async init() {
    this.root.classList.add('opinion-moderation');
    onAuthChange((pubkey) => {
      this.me = pubkey;
      this.onIdentity();
    });
    this.renderGate();
    await detectIdentity();
    if (!getPubkey() && await hasExtension()) {
      showToast(EXTENSION_DECLINED_MESSAGE, 'error');
    }
    this.onIdentity();
  }

  get isAdmin() {
    return isWalletScrutinySiteAdmin(this.me);
  }

  onIdentity() {
    if (!this.isAdmin) {
      this.renderGate();
      return;
    }
    if (!this.shellReady) {
      this.buildShell();
    }
    if (!this.loaded && !this.loading) {
      void this.load();
    } else if (this.loaded) {
      this.renderList();
    }
  }

  renderGate() {
    this.shellReady = false;
    this.root.replaceChildren(
      el('p', {}, 'This page is for WalletScrutiny administrators.'),
    );
  }

  buildShell() {
    this.shellReady = true;
    this.countEl = el('p', { className: 'opinion-moderation__count' });
    this.listEl = el('div', { className: 'opinion-moderation__list' });

    const search = el('input', {
      type: 'search',
      className: 'opinion-moderation__search',
      placeholder: 'Filter by wallet, author or text',
      'aria-label': 'Filter opinions',
    });
    search.addEventListener('input', () => {
      this.query = search.value;
      if (this.loaded) {
        this.renderList();
      }
    });

    this.root.replaceChildren(
      el('div', { className: 'opinion-moderation__toolbar' }, search),
      this.countEl,
      this.listEl,
    );
  }

  async load() {
    if (!this.isAdmin) {
      return;
    }
    this.loading = true;
    this.loaded = false;
    this.loadError = null;
    this.listEl.replaceChildren(el('p', {}, 'Loading opinions...'));
    this.countEl.textContent = '';
    try {
      const [versions, walletList] = await Promise.all([
        fetchAllOpinionVersions(),
        whenWalletsReady(),
      ]);
      this.wallets = indexWalletsBySubject(walletList);
      const latest = opinionsForModeration(latestOpinionPerSubject(versions, this.lists));
      const kept = applyDeletions(latest, await fetchOpinionDeletions(latest));
      this.opinions = opinionsForModeration(latestOpinionPerSubject(kept, this.lists));
      const [moderationEvents, profiles] = await Promise.all([
        fetchOpinionModeration(),
        getNostrProfiles(this.opinions.map((event) => event.pubkey)).catch(() => new Map()),
      ]);
      this.moderationEvents = moderationEvents;
      this.applyModeration();
      this.profiles = profiles;
      this.me = getPubkey();
    } catch (error) {
      console.error('opinions: index failed', error);
      this.loadError = error;
    } finally {
      this.loading = false;
      this.loaded = true;
      if (this.isAdmin) {
        this.renderList();
      }
    }
  }

  /** Resolve `moderationEvents` and drop the opinions that are no longer undecided. */
  applyModeration() {
    this.moderation = resolveOpinionModeration(this.moderationEvents, siteAdminPubkeys);
    this.lists.trustedAuthors = withApprovedAuthors(this.staticTrustedAuthors, this.moderationEvents, siteAdminPubkeys);
    this.opinions = pendingModerationOpinions(this.opinions, {
      trustedAuthors: this.lists.trustedAuthors,
      moderation: this.moderation,
    });
  }

  statusOf(event) {
    return opinionListStatus(event, {
      trustedAuthors: this.lists.trustedAuthors,
      moderation: this.moderation,
    });
  }

  visibleOpinions() {
    const query = this.query.trim().toLowerCase();
    return this.opinions.filter((event) => {
      if (this.statusOf(event) !== 'open') {
        return false;
      }
      if (!query) {
        return true;
      }
      const wallet = this.wallets.get(getTagValue(event, 'd'));
      const haystack = [
        walletTitle(event, wallet),
        getTagValue(event, 'd'),
        opinionExcerpt(event.content, Infinity),
        getProfileDisplayName(this.profiles.get(event.pubkey), event.pubkey),
      ].join(' ').toLowerCase();
      return haystack.includes(query);
    }).sort((a, b) => (b.created_at ?? 0) - (a.created_at ?? 0));
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
    const approve = el('button', {
      type: 'button',
      disabled: pending,
      title: 'Approves this author\'s opinions, including the ones they publish later',
    }, 'Approve author');
    const hide = el('button', { type: 'button', disabled: pending }, opinions.length > 1 ? `Hide all ${opinions.length}` : 'Hide');
    approve.addEventListener('click', () => this.approveAuthor(pubkey));
    hide.addEventListener('click', () => this.hideAll(pubkey, opinions));
    return el('div', { className: 'opinion-moderation__actions' }, approve, hide);
  }

  /** One event: the author joins the trusted authors, their opinions leave the queue. */
  async approveAuthor(pubkey) {
    if (!isWalletScrutinySiteAdmin(this.me)) {
      return;
    }
    this.pendingAuthors.add(pubkey);
    this.renderList();
    try {
      const { event: signed, summary } = await signAndPublish(buildAuthorApprovalDraft({ pubkey }), {
        eventType: 'approval',
        requireMainRelay: true,
        includeSummary: true,
      });
      this.moderationEvents.push(signed);
      this.applyModeration();
      const name = getProfileDisplayName(this.profiles.get(pubkey), pubkey);
      if (summary.successful === summary.total) {
        showToast(`Approved ${name}. Their future opinions are approved too.`, 'success');
      } else {
        showToast(`Approved ${name}, but only ${summary.successful} of ${summary.total} relays accepted it.`, 'warning');
      }
    } catch (error) {
      showToast(error?.message || 'Could not publish the approval.', 'error');
    } finally {
      this.pendingAuthors.delete(pubkey);
      this.renderList();
    }
  }

  /**
   * One hide per opinion, published one after the other so the extension
   * asks for one signature at a time. Stops at the first failure; the
   * opinions hidden so far stay hidden.
   */
  async hideAll(pubkey, opinions) {
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
        const { event: signed, summary } = await signAndPublish(
          buildOpinionModerationDraft({ opinion, decision: OPINION_DECISION_HIDE }),
          { eventType: 'hide', requireMainRelay: true, includeSummary: true },
        );
        this.moderationEvents.push(signed);
        done += 1;
        partial ||= summary.successful !== summary.total;
      }
    } catch (error) {
      failure = error;
    } finally {
      this.applyModeration();
      this.pendingAuthors.delete(pubkey);
      this.renderList();
    }
    const counted = `Hid ${done} of ${plural(opinions.length, 'opinion')}`;
    if (failure) {
      showToast(`${counted}. ${failure?.message || 'Could not publish the decision.'}`, 'error');
    } else if (partial) {
      showToast(`${counted}. Some relays did not accept every decision.`, 'warning');
    } else {
      showToast(`${counted}.`, 'success');
    }
  }
}
