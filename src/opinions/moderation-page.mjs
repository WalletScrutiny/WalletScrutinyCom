/**
 * Index of third-party WalletScrutiny opinions and the wallet each one belongs to.
 * Not linked from the site menu. The list is rendered only for siteAdminPubkeys.
 * The stylesheet and the mount live in moderation-page-boot.mjs so unit tests
 * can import this module without a CSS loader.
 */
import { el } from '../html-utils.mjs';
import { isWalletScrutinySiteAdmin, siteAdminPubkeys } from '../nostr-constants.mjs';
import { showToast } from '../verifications_utils.mjs';
import { getNostrProfiles, getProfileDisplayName, hasProfileIdentity } from '../nostr-profile.mjs';
import { readModerationLists } from './config.mjs';
import { SENTIMENT_LABELS } from './constants.mjs';
import {
  applyDeletions,
  getSentiment,
  getTagValue,
  latestOpinionPerSubject,
  opinionExcerpt,
} from './content.mjs';
import {
  OPINION_DECISION_APPROVE,
  OPINION_DECISION_HIDE,
  buildOpinionModerationDraft,
  indexWalletsBySubject,
  moderationRelayMessage,
  opinionListStatus,
  opinionsForModeration,
  pendingModerationOpinions,
  resolveOpinionModeration,
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

function formatDate(createdAt) {
  if (!createdAt) {
    return '';
  }
  return new Date(createdAt * 1000).toLocaleDateString('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function walletTitle(event, wallet) {
  if (wallet?.title) {
    return wallet.title;
  }
  const fromEvent = getTagValue(event, 'title').replace(/^Opinion about\s+/i, '').trim();
  return fromEvent || getTagValue(event, 'd') || 'Unknown wallet';
}

export class OpinionModerationPage {
  constructor(root) {
    this.root = root;
    this.lists = readModerationLists(root.dataset);
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
    this.pending = new Set();
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
      this.moderation = resolveOpinionModeration(moderationEvents, siteAdminPubkeys);
      this.opinions = pendingModerationOpinions(this.opinions, {
        trustedAuthors: this.lists.trustedAuthors,
        moderation: this.moderation,
      });
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
        opinionExcerpt(event.content, 4000),
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
    const total = this.opinions.length;
    this.countEl.textContent = visible.length === total
      ? `${total} ${total === 1 ? 'opinion' : 'opinions'}`
      : `${visible.length} of ${total} opinions`;

    if (!visible.length) {
      this.listEl.appendChild(el('p', {}, total === 0 ? 'No opinions yet.' : 'No opinions match this filter.'));
      return;
    }
    for (const event of visible) {
      this.listEl.appendChild(this.renderItem(event));
    }
  }

  renderItem(event) {
    const subject = getTagValue(event, 'd');
    const wallet = this.wallets.get(subject);
    const title = walletTitle(event, wallet);
    const heading = wallet?.url
      ? el('a', { href: `${wallet.url}#communityOpinions` }, title)
      : el('span', {}, title);
    const sentiment = getSentiment(event);
    const profile = this.profiles.get(event.pubkey);
    const excerpt = opinionExcerpt(event.content);
    const item = el('article', { className: 'opinion-moderation__item' },
      el('h2', { className: 'opinion-moderation__wallet' }, heading),
      el('p', { className: 'opinion-moderation__meta' },
        el('span', {}, getProfileDisplayName(profile, event.pubkey)),
        sentiment ? el('span', {}, SENTIMENT_LABELS[sentiment]) : null,
        el('span', {}, formatDate(event.created_at)),
      ),
      el('p', { className: 'opinion-moderation__excerpt' }, excerpt || '(No text)'),
      hasProfileIdentity(profile) ? null : el('p', {
        className: 'opinion-moderation__note',
        role: 'note',
      }, 'This author has no profile name or picture, so it won\'t show on the website or app. Approving the opinion will show it on the wallet page.'),
    );
    if (isWalletScrutinySiteAdmin(this.me)) {
      item.appendChild(this.renderActions(event));
    }
    return item;
  }

  renderActions(event) {
    const pending = this.pending.has(event.id);
    const approve = el('button', {
      type: 'button',
      disabled: pending,
    }, 'Approve');
    const hide = el('button', {
      type: 'button',
      disabled: pending,
    }, 'Hide');
    approve.addEventListener('click', () => this.decide(event, OPINION_DECISION_APPROVE));
    hide.addEventListener('click', () => this.decide(event, OPINION_DECISION_HIDE));
    return el('div', { className: 'opinion-moderation__actions' }, approve, hide);
  }

  async decide(opinion, decision) {
    if (!isWalletScrutinySiteAdmin(getPubkey())) {
      return;
    }
    this.pending.add(opinion.id);
    this.renderList();
    try {
      const { event: signed, summary } = await signAndPublish(buildOpinionModerationDraft({ opinion, decision }), {
        eventType: decision === OPINION_DECISION_APPROVE ? 'approval' : 'hide',
        requireMainRelay: true,
        includeSummary: true,
      });
      this.moderationEvents.push(signed);
      this.moderation = resolveOpinionModeration(this.moderationEvents, siteAdminPubkeys);
      this.opinions = pendingModerationOpinions(this.opinions, {
        trustedAuthors: this.lists.trustedAuthors,
        moderation: this.moderation,
      });
      const toastType = summary.successful === summary.total ? 'success' : 'warning';
      showToast(moderationRelayMessage(decision, summary), toastType);
    } catch (error) {
      showToast(error?.message || 'Could not publish the decision.', 'error');
    } finally {
      this.pending.delete(opinion.id);
      this.renderList();
    }
  }
}

