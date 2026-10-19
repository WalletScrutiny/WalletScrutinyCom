/**
 * Controller for one community-opinions section: loads the events, keeps the
 * state and re-renders the body. Rendering is a full rebuild of the list;
 * reaction counts are patched in place by the cards.
 */
import { el } from '../html-utils.mjs';
import { wsIcon } from '../icon.mjs';
import { isWalletScrutinySiteAdmin, siteAdminPubkeys } from '../nostr-constants.mjs';
import { showToast } from '../verifications_utils.mjs';
import { getNostrProfile, getNostrProfiles, getProfileDisplayName, getProfileImageUrl, hasProfileIdentity } from '../nostr-profile.mjs';
import { readWidgetConfig } from './config.mjs';
import {
  showAllConsentStorageKey,
  SENTIMENT_POSITIVE,
  SENTIMENT_NEUTRAL,
  SENTIMENT_NEGATIVE,
  SENTIMENT_LABELS,
  zapstoreAppUrl,
  zapstoreCommentKind,
} from './constants.mjs';
import {
  applyDeletions,
  buildReplyTree,
  latestOpinionPerAuthor,
  sortOpinions,
  stripOpinionWrapper,
  getSentiment,
  tallyReactions,
  tallySentiments,
  emptyReactionTally,
  splitZapstoreComments,
} from './content.mjs';
import {
  fetchOpinions,
  fetchOpinionModeration,
  fetchThreadData,
  fetchZapstoreComments,
  signAndPublish,
  buildOpinionDraft,
  buildReplyDraft,
  buildReactionDraft,
  buildDeletionDraft,
} from './nostr.mjs';
import {
  detectIdentity,
  EXTENSION_DECLINED_MESSAGE,
  getPubkey,
  hasExtension,
  NO_EXTENSION_MESSAGE,
  onAuthChange,
} from './auth.mjs';
import { renderCard, renderAuthor } from './card.mjs';
import { createOpinionEditor } from './editor.mjs';
import { confirmModal } from './modal.mjs';
import { sentimentIcon } from './icons.mjs';
import {
  OPINION_DECISION_APPROVE,
  buildOpinionModerationDraft,
  canModerateOpinion,
  moderationRelayMessage,
  opinionListStatus,
  resolveOpinionModeration,
} from './moderation.mjs';

const GUIDELINES = 'Thank you for contributing your opinion. Please be objective and be polite.';
const HIDDEN_WITHOUT_PROFILE = 'Published, but only authors with a Nostr profile name or picture are shown here. '
  + 'Set up your profile and reload the page.';

/** Which list the section shows when both WalletScrutiny opinions and Zapstore comments exist. */
const SOURCE_WALLETSCRUTINY = 'walletscrutiny';
const SOURCE_ZAPSTORE = 'zapstore';

function storage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export class OpinionsWidget {
  constructor(root) {
    this.root = root;
    this.config = readWidgetConfig(root.dataset);
    this.body = root.querySelector('.opinions__body') ?? root.appendChild(el('div', { className: 'opinions__body' }));

    this.opinions = [];
    this.moderationEvents = [];
    this.moderation = new Map();
    // Opinion ids with an approve / hide on its way to the relays.
    this.moderationPending = new Set();
    this.replies = [];
    this.tree = new Map();
    this.reactions = new Map();
    this.profiles = new Map();
    this.filter = 'approved';
    this.expandedThreads = new Set();
    this.composeOpen = false;
    this.composeEditor = null;
    this.loaded = false;
    this.loadError = null;
    this.me = null;
    // null until the NIP-07 check settles; without an extension nobody can post.
    this.canPost = null;
    // Comments posted on Zapstore for the Android app (read-only, own relay, loaded alongside).
    this.zapstore = { loaded: false, roots: [], tree: new Map() };
    this.source = SOURCE_WALLETSCRUTINY;
    // The first full render picks the tab with content; afterwards only the visitor switches.
    this.sourcePicked = false;

    this.ctx = {
      config: this.config,
      profiles: this.profiles,
      tree: this.tree,
      reactions: this.reactions,
      expandedThreads: this.expandedThreads,
      me: null,
      canPost: null,
      requestProfile: (pubkey) => this.requestProfile(pubkey),
      canModerate: (event) => this.canModerate(event),
      isModerationPending: (event) => this.moderationPending.has(event.id),
      actions: {
        ensureSignedIn: () => this.ensureSignedIn(),
        react: (opinion, target, content) => this.react(opinion, target, content),
        reply: (opinion, target, body) => this.reply(opinion, target, body),
        remove: (event) => this.remove(event),
        edit: () => this.openCompose(),
        moderate: (event, decision) => this.moderate(event, decision),
      },
    };
  }

  async init() {
    onAuthChange((pubkey) => {
      this.me = pubkey;
      this.ctx.me = pubkey;
      if (this.loaded) {
        this.render();
      }
    });
    void hasExtension().then((found) => {
      this.canPost = found;
      this.ctx.canPost = found;
      if (this.loaded) {
        this.render();
      }
    });
    void detectIdentity();
    const zapstoreLoad = this.loadZapstore();
    await this.load();
    await zapstoreLoad;
  }

  async load() {
    this.loaded = false;
    this.loadError = null;
    this.body.setAttribute('aria-busy', 'true');
    try {
      const [versions, moderationEvents] = await Promise.all([
        fetchOpinions(this.config.subjectKeys),
        fetchOpinionModeration().catch((error) => {
          console.warn('opinions: moderation events failed to load', error?.message ?? error);
          return [];
        }),
      ]);
      this.moderationEvents = moderationEvents;
      this.moderation = resolveOpinionModeration(moderationEvents, siteAdminPubkeys);
      const latest = latestOpinionPerAuthor(versions, {
        ...this.config,
        isPinned: (event) => this.listStatus(event) === 'approved',
      }).filter((event) => this.listStatus(event) !== 'hidden');
      const { replies, reactions, deletions } = await fetchThreadData(latest);
      const kept = await this.withProfiles(applyDeletions([...latest, ...replies], deletions));
      this.opinions = kept.filter((event) => latest.includes(event));
      this.replies = kept.filter((event) => replies.includes(event));
      this.rebuildDerived(reactions);
      this.rawReactions = reactions;
    } catch (error) {
      console.error('opinions: load failed', error);
      this.loadError = error;
    } finally {
      this.loaded = true;
      this.body.removeAttribute('aria-busy');
      this.render();
    }
  }

  /**
   * Zapstore comments never block the opinions: a slow or failed Zapstore relay
   * only means the tab stays away. Re-renders once both loads are in.
   */
  async loadZapstore() {
    const appId = this.config.zapstoreAppId;
    if (!appId) {
      this.zapstore.loaded = true;
      return;
    }
    try {
      const { comments, deletions } = await fetchZapstoreComments(appId);
      const kept = await this.withProfiles(applyDeletions(comments, deletions));
      const { roots, replies } = splitZapstoreComments(kept, this.config);
      this.zapstore.roots = roots;
      this.zapstore.tree = buildReplyTree(replies, roots.map((event) => event.id), { kind: zapstoreCommentKind });
    } catch (error) {
      console.warn('opinions: Zapstore comments failed to load', error?.message ?? error);
    } finally {
      this.zapstore.loaded = true;
      if (this.loaded) {
        this.render();
      }
    }
  }

  /** Card context for Zapstore comments: own reply tree, no reactions, no posting. */
  get zapstoreCtx() {
    return { ...this.ctx, tree: this.zapstore.tree, reactions: new Map(), readOnly: true, source: SOURCE_ZAPSTORE };
  }

  rebuildDerived(rawReactions = this.rawReactions ?? []) {
    this.tree.clear();
    for (const [parentId, children] of buildReplyTree(this.replies, this.opinions.map((event) => event.id))) {
      this.tree.set(parentId, children);
    }
    this.reactions.clear();
    for (const [targetId, tally] of tallyReactions(rawReactions)) {
      this.reactions.set(targetId, tally);
    }
  }

  // --- profiles --------------------------------------------------------

  /**
   * Only authors with a Nostr profile picture or name are shown; the events of
   * everybody else are dropped here, on both sources, with no way to reveal
   * them. Profiles are fetched in one batch before the first render.
   */
  async withProfiles(events) {
    await this.resolveProfiles(events.map((event) => event.pubkey));
    return events.filter((event) => this.isShownAuthor(event.pubkey) || this.isExplicitlyApproved(event));
  }

  async resolveProfiles(pubkeys) {
    const missing = [...new Set(pubkeys)].filter((pubkey) => !this.profiles.get(pubkey));
    if (!missing.length) {
      return;
    }
    const found = await getNostrProfiles(missing).catch((error) => {
      console.debug('opinions: profile batch failed', error?.message ?? error);
      return new Map();
    });
    for (const pubkey of missing) {
      this.profiles.set(pubkey, found.get(pubkey) ?? null);
    }
  }

  isShownAuthor(pubkey) {
    return hasProfileIdentity(this.profiles.get(pubkey));
  }

  requestProfile(pubkey) {
    if (this.profiles.has(pubkey)) {
      return;
    }
    this.profiles.set(pubkey, null);
    getNostrProfile(pubkey).then((profile) => {
      if (!profile) {
        return;
      }
      this.profiles.set(pubkey, profile);
      const name = getProfileDisplayName(profile, pubkey);
      const image = getProfileImageUrl(profile);
      this.root.querySelectorAll(`[data-author-name="${pubkey}"]`).forEach((node) => {
        node.textContent = name;
      });
      this.root.querySelectorAll(`[data-author-avatar="${pubkey}"]`).forEach((node) => {
        if (node.src !== image) {
          node.src = image;
        }
      });
    }).catch((error) => {
      console.debug('opinions: profile fetch failed', error?.message ?? error);
    });
  }

  // --- derived views ---------------------------------------------------

  listStatus(event) {
    return opinionListStatus(event, {
      trustedAuthors: this.config.trustedAuthors,
      moderation: this.moderation,
    });
  }

  canModerate(event) {
    return canModerateOpinion(event, {
      me: this.me,
      trustedAuthors: this.config.trustedAuthors,
      moderation: this.moderation,
    });
  }

  isExplicitlyApproved(event) {
    return this.moderation.get(event.id)?.decision === OPINION_DECISION_APPROVE
      || this.moderation.get(String(event.id).toLowerCase())?.decision === OPINION_DECISION_APPROVE;
  }

  get approvedEventIds() {
    const ids = new Set();
    for (const [id, record] of this.moderation) {
      if (record.decision === OPINION_DECISION_APPROVE) {
        ids.add(id);
      }
    }
    return ids;
  }

  get trustedOpinions() {
    return this.opinions.filter((event) => this.listStatus(event) === 'approved' || this.listStatus(event) === 'approved-author');
  }

  get visibleOpinions() {
    const events = this.filter === 'approved' ? this.trustedOpinions : this.opinions;
    return sortOpinions(events, this.config.trustedAuthors, this.approvedEventIds);
  }

  get myOpinion() {
    return this.me ? this.opinions.find((event) => event.pubkey === this.me) ?? null : null;
  }

  // --- rendering -------------------------------------------------------

  render() {
    this.composeEditor?.destroy();
    this.composeEditor = null;
    this.body.replaceChildren();

    if (!this.loaded) {
      this.body.appendChild(el('p', { className: 'opinions__status' }, 'Loading opinions…'));
      return;
    }
    if (this.loadError) {
      const retry = el('button', { type: 'button', className: 'opinions-btn opinions-btn--small' }, 'Retry');
      retry.addEventListener('click', () => this.load());
      this.body.appendChild(el('p', { className: 'opinions__status opinions__status--error' },
        'Could not load the opinions from the Nostr relays. ', retry));
      return;
    }

    const hasZapstore = this.zapstore.roots.length > 0;
    const hasOwn = this.opinions.length > 0;
    if (!hasZapstore) {
      this.source = SOURCE_WALLETSCRUTINY;
    } else if (!this.sourcePicked && this.zapstore.loaded) {
      // Open on the Zapstore comments when there is no approved opinion to show.
      this.sourcePicked = true;
      this.source = this.trustedOpinions.length > 0 ? SOURCE_WALLETSCRUTINY : SOURCE_ZAPSTORE;
    }
    if (hasZapstore && hasOwn) {
      this.body.appendChild(this.renderTabs());
    }
    if (hasZapstore && (this.source === SOURCE_ZAPSTORE || !hasOwn)) {
      this.body.appendChild(this.renderZapstorePanel());
      this.body.appendChild(this.renderCompose());
      return;
    }

    const visible = this.visibleOpinions;
    this.body.appendChild(this.renderToolbar(visible));

    if (this.filter === 'approved' && visible.length === 0 && this.opinions.length > 0) {
      const count = this.opinions.length;
      const show = el('button', { type: 'button' },
        `Show ${count} ${count === 1 ? 'opinion of an unknown author' : 'opinions of unknown authors'}.`);
      show.addEventListener('click', () => this.setFilter('all'));
      this.body.appendChild(el('p', { className: 'opinions__notice' }, show, ' ⚠️ Viewer discretion advised.'));
    }

    const list = el('div', { className: 'opinions__list' });
    if (visible.length === 0) {
      list.appendChild(el('p', { className: 'opinions__empty' },
        this.opinions.length === 0
          ? (this.canPost ? 'No opinions yet. Be the first to share yours.' : 'No opinions yet.')
          : ''));
    }
    for (const event of visible) {
      list.appendChild(renderCard(this.ctx, event));
    }
    this.body.appendChild(list);
    this.body.appendChild(this.renderCompose());
  }

  /** WalletScrutiny / Zapstore tabs with the number of top-level entries in each list. */
  renderTabs() {
    const tabs = el('div', { className: 'opinions__tabs', role: 'tablist', 'aria-label': 'Opinion sources' });
    const entries = [
      [SOURCE_WALLETSCRUTINY, 'WalletScrutiny', wsIcon('walletscrutiny'), this.opinions.length],
      [SOURCE_ZAPSTORE, 'Zapstore', wsIcon('zapstore'), this.zapstore.roots.length],
    ];
    for (const [source, label, icon, count] of entries) {
      const tab = el('button', {
        type: 'button',
        className: 'opinions__tab',
        role: 'tab',
        'aria-selected': String(this.source === source),
        dataset: { source },
        html: icon,
      });
      tab.appendChild(el('span', {}, label));
      tab.appendChild(el('span', { className: 'opinions__tab-count', title: `${count} on ${label}` }, String(count)));
      tab.addEventListener('click', () => {
        this.sourcePicked = true;
        if (this.source !== source) {
          this.source = source;
          this.render();
        }
      });
      tabs.appendChild(tab);
    }
    return tabs;
  }

  /** Read-only list of the comments posted on Zapstore, with a note on where they come from. */
  renderZapstorePanel() {
    const panel = el('div', { className: 'opinions__panel', role: 'tabpanel', dataset: { source: SOURCE_ZAPSTORE } });
    const link = el('a', {
      href: `${zapstoreAppUrl}${encodeURIComponent(this.config.zapstoreAppId)}`,
      target: '_blank',
      rel: 'noopener noreferrer',
    }, 'Open on Zapstore');
    const note = el('p', { className: 'opinions__source-note', html: wsIcon('zapstore') });
    note.appendChild(el('span', {},
      this.opinions.length === 0 ? 'No opinions on WalletScrutiny yet. ' : '',
      'These comments were posted on Zapstore, the Nostr app store, and can be answered there. ', link, '.'));
    panel.appendChild(note);
    const list = el('div', { className: 'opinions__list' });
    const ctx = this.zapstoreCtx;
    for (const event of this.zapstore.roots) {
      list.appendChild(renderCard(ctx, event));
    }
    panel.appendChild(list);
    return panel;
  }

  renderToolbar(visible) {
    const counts = tallySentiments(visible);
    const countList = el('ul', { className: 'opinions__counts' },
      ...[SENTIMENT_POSITIVE, SENTIMENT_NEUTRAL, SENTIMENT_NEGATIVE].map((sentiment) => {
        const item = el('li', { html: sentimentIcon(sentiment) });
        item.appendChild(el('span', {}, `${counts[sentiment]} ${SENTIMENT_LABELS[sentiment].toLowerCase()}`));
        return item;
      }));
    const filters = el('div', { className: 'opinions__filters', role: 'group', 'aria-label': 'Filter opinions' });
    for (const [value, label] of [['approved', 'Approved'], ['all', 'All opinions']]) {
      const button = el('button', {
        type: 'button',
        className: 'opinions__filter',
        'aria-pressed': String(this.filter === value),
      }, label);
      button.addEventListener('click', () => this.setFilter(value));
      filters.appendChild(button);
    }
    return el('div', { className: 'opinions__toolbar' }, countList, filters);
  }

  renderCompose() {
    const container = el('div', { className: 'opinions__compose' });
    if (this.canPost === null) {
      return container;
    }
    if (!this.canPost) {
      container.appendChild(el('p', { className: 'opinions__no-extension' },
        'To ', el('strong', {}, 'add an opinion'),
        ', reply or react, open this page in a browser with a Nostr extension (NIP-07), for example Alby, nos2x or Flamingo.'));
      return container;
    }
    const mine = this.myOpinion;
    const toggle = el('button', { type: 'button', className: 'opinions-btn opinions-btn--primary' },
      mine ? 'Edit your opinion' : 'Add your opinion');
    toggle.addEventListener('click', () => {
      if (this.composeOpen) {
        this.closeCompose();
      } else {
        this.openCompose();
      }
    });
    container.appendChild(toggle);

    if (!this.composeOpen || !this.me) {
      return container;
    }

    const panel = el('div', { className: 'opinions__compose-panel' },
      el('h3', {}, mine ? 'Edit your opinion' : 'Add your opinion'),
      el('p', {}, GUIDELINES),
    );
    panel.appendChild(el('div', { className: 'opinions__signed-in' },
      el('span', {}, 'Posting as'),
      renderAuthor(this.ctx, this.me, { withBadge: false }),
    ));
    this.composeEditor = createOpinionEditor({
      initialValue: mine ? stripOpinionWrapper(mine.content) : '',
      sentiment: mine ? getSentiment(mine) ?? SENTIMENT_NEUTRAL : SENTIMENT_NEUTRAL,
      submitLabel: mine ? 'Update' : 'Post',
      onSubmit: ({ body, sentiment }) => this.submitOpinion({ body, sentiment, previous: mine }),
      onCancel: () => this.closeCompose(),
    });
    panel.appendChild(this.composeEditor.element);
    container.appendChild(panel);
    return container;
  }

  // --- user actions ----------------------------------------------------

  async setFilter(filter) {
    if (filter === this.filter) {
      return;
    }
    if (filter === 'all' && storage()?.getItem(showAllConsentStorageKey) !== '1') {
      const agreed = await confirmModal({
        title: 'Show all opinions?',
        message: [
          'Opinions under "All opinions" come from Nostr accounts we do not know.',
          '⚠️ Viewer discretion advised.',
        ],
      });
      if (!agreed) {
        return;
      }
      storage()?.setItem(showAllConsentStorageKey, '1');
    }
    this.filter = filter;
    this.render();
  }

  async ensureSignedIn() {
    if (getPubkey()) {
      return true;
    }
    await detectIdentity();
    if (getPubkey()) {
      return true;
    }
    const message = await hasExtension() ? EXTENSION_DECLINED_MESSAGE : NO_EXTENSION_MESSAGE;
    showToast(message, 'error');
    return false;
  }

  async openCompose() {
    if (!(await this.ensureSignedIn())) {
      return;
    }
    this.composeOpen = true;
    this.render();
    const panel = this.body.querySelector('.opinions__compose-panel');
    panel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.composeEditor?.focus();
  }

  closeCompose() {
    this.composeOpen = false;
    this.render();
  }

  async submitOpinion({ body, sentiment, previous }) {
    const draft = buildOpinionDraft(this.config, { body, sentiment, previous });
    const signed = await signAndPublish(draft, { eventType: 'opinion', requireMainRelay: true });
    this.composeOpen = false;
    if (!(await this.withProfiles([signed])).length) {
      showToast(HIDDEN_WITHOUT_PROFILE, 'error');
      this.render();
      return;
    }
    this.opinions = [signed, ...this.opinions.filter((event) => event.pubkey !== signed.pubkey)];
    this.rebuildDerived();
    showToast(previous ? 'Opinion updated.' : 'Opinion published.');
    this.render();
  }

  async react(opinion, target, content) {
    if (!(await this.ensureSignedIn())) {
      return;
    }
    const tally = this.reactions.get(target.id) ?? emptyReactionTally();
    const current = tally.byAuthor.get(this.me) ?? '';
    const next = current === content ? '' : content;
    const signed = await signAndPublish(buildReactionDraft({ opinion, target, content: next }), { eventType: 'reaction' })
      .catch((error) => {
        showToast(error?.message || 'Could not publish the reaction.', 'error');
        return null;
      });
    if (!signed) {
      return;
    }
    this.rawReactions = [...(this.rawReactions ?? []), signed];
    this.rebuildDerived();
  }

  async reply(opinion, target, body) {
    const signed = await signAndPublish(buildReplyDraft({ opinion, target, body }), { eventType: 'reply' });
    if (!(await this.withProfiles([signed])).length) {
      showToast(HIDDEN_WITHOUT_PROFILE, 'error');
      return;
    }
    this.replies = [...this.replies, signed];
    this.rebuildDerived();
    showToast('Reply published.');
  }

  /** Admin approve / hide from the wallet page, the same event the /opinions/ page publishes. */
  async moderate(opinion, decision) {
    if (!isWalletScrutinySiteAdmin(getPubkey()) || this.moderationPending.has(opinion.id)) {
      return;
    }
    this.moderationPending.add(opinion.id);
    this.render();
    try {
      const { event: signed, summary } = await signAndPublish(buildOpinionModerationDraft({ opinion, decision }), {
        eventType: decision === OPINION_DECISION_APPROVE ? 'approval' : 'hide',
        requireMainRelay: true,
        includeSummary: true,
      });
      this.moderationEvents = [...this.moderationEvents, signed];
      this.moderation = resolveOpinionModeration(this.moderationEvents, siteAdminPubkeys);
      this.opinions = this.opinions.filter((event) => this.listStatus(event) !== 'hidden');
      this.rebuildDerived();
      const toastType = summary.successful === summary.total ? 'success' : 'warning';
      showToast(moderationRelayMessage(decision, summary), toastType);
    } catch (error) {
      showToast(error?.message || 'Could not publish the decision.', 'error');
    } finally {
      this.moderationPending.delete(opinion.id);
      this.render();
    }
  }

  async remove(event) {
    const isOpinion = event.pubkey === this.me && this.opinions.includes(event);
    const agreed = await confirmModal({
      title: isOpinion ? 'Delete your opinion?' : 'Delete your reply?',
      message: 'A deletion request is sent to the relays. Relays that honour it will drop the event; others may keep it.',
      confirmLabel: 'Delete',
    });
    if (!agreed) {
      return;
    }
    try {
      await signAndPublish(buildDeletionDraft(event), { eventType: 'deletion request' });
    } catch (error) {
      showToast(error?.message || 'Could not publish the deletion request.', 'error');
      return;
    }
    this.opinions = this.opinions.filter((item) => item.id !== event.id);
    this.replies = this.replies.filter((item) => item.id !== event.id);
    this.rebuildDerived();
    showToast('Deleted.');
    this.render();
  }
}
