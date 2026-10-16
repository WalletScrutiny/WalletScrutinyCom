/**
 * Controller for one community-opinions section: loads the events, keeps the
 * state and re-renders the body. Rendering is a full rebuild of the list;
 * reaction counts are patched in place by the cards.
 */
import { el } from '../html-utils.mjs';
import { showToast } from '../verifications_utils.mjs';
import { getNostrProfile, getProfileDisplayName, getProfileImageUrl } from '../nostr-profile.mjs';
import { readWidgetConfig } from './config.mjs';
import { showAllConsentStorageKey, SENTIMENT_POSITIVE, SENTIMENT_NEUTRAL, SENTIMENT_NEGATIVE, SENTIMENT_LABELS } from './constants.mjs';
import {
  applyDeletions,
  buildReplyTree,
  headline,
  latestOpinionPerAuthor,
  sortOpinions,
  stripOpinionWrapper,
  getSentiment,
  tallyReactions,
  tallySentiments,
  emptyReactionTally,
} from './content.mjs';
import { fetchOpinions, fetchThreadData, signAndPublish, buildOpinionDraft, buildReplyDraft, buildReactionDraft, buildDeletionDraft } from './nostr.mjs';
import { getPubkey, hasExtension, onAuthChange, restoreSignIn, signIn, signOut } from './auth.mjs';
import { renderCard, renderAuthor } from './card.mjs';
import { createOpinionEditor } from './editor.mjs';
import { confirmModal } from './modal.mjs';
import { sentimentIcon } from './icons.mjs';

const GUIDELINES = 'Thank you for contributing your opinion. Please be objective and be polite.';
const NO_EXTENSION_NOTE =
  'To add an opinion, reply or react, open this page in a browser with a Nostr extension (NIP-07), for example Alby, nos2x or Flamingo.';

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
    this.headlineElement = root.querySelector('.opinions__headline');
    this.body = root.querySelector('.opinions__body') ?? root.appendChild(el('div', { className: 'opinions__body' }));

    this.opinions = [];
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

    this.ctx = {
      config: this.config,
      profiles: this.profiles,
      tree: this.tree,
      reactions: this.reactions,
      expandedThreads: this.expandedThreads,
      me: null,
      canPost: null,
      requestProfile: (pubkey) => this.requestProfile(pubkey),
      actions: {
        ensureSignedIn: () => this.ensureSignedIn(),
        react: (opinion, target, content) => this.react(opinion, target, content),
        reply: (opinion, target, body) => this.reply(opinion, target, body),
        remove: (event) => this.remove(event),
        edit: () => this.openCompose(),
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
    void restoreSignIn();
    await this.load();
  }

  async load() {
    this.loaded = false;
    this.loadError = null;
    this.body.setAttribute('aria-busy', 'true');
    try {
      const versions = await fetchOpinions(this.config.subjectKeys);
      const latest = latestOpinionPerAuthor(versions, this.config);
      const { replies, reactions, deletions } = await fetchThreadData(latest);
      const kept = applyDeletions([...latest, ...replies], deletions);
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

  get trustedOpinions() {
    return this.opinions.filter((event) => this.config.trustedAuthors.has(event.pubkey));
  }

  get visibleOpinions() {
    const events = this.filter === 'approved' ? this.trustedOpinions : this.opinions;
    return sortOpinions(events, this.config.trustedAuthors);
  }

  get myOpinion() {
    return this.me ? this.opinions.find((event) => event.pubkey === this.me) ?? null : null;
  }

  // --- rendering -------------------------------------------------------

  render() {
    if (this.headlineElement) {
      this.headlineElement.textContent = this.loaded && !this.loadError
        ? headline(this.trustedOpinions.length, this.opinions.length)
        : 'Community Opinions';
    }
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
      container.appendChild(el('p', { className: 'opinions__no-extension' }, NO_EXTENSION_NOTE));
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
    const signOutButton = el('button', { type: 'button', className: 'opinions-btn opinions-btn--small' }, 'Sign out');
    signOutButton.addEventListener('click', () => {
      this.closeCompose();
      signOut();
    });
    panel.appendChild(el('div', { className: 'opinions__signed-in' },
      el('span', {}, 'Posting as'),
      renderAuthor(this.ctx, this.me, { withBadge: false }),
      signOutButton,
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
    try {
      await signIn();
      return true;
    } catch (error) {
      showToast(error?.message || 'Could not connect to the Nostr extension.', 'error');
      return false;
    }
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
    this.opinions = [signed, ...this.opinions.filter((event) => event.pubkey !== signed.pubkey)];
    this.rebuildDerived();
    this.composeOpen = false;
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
    this.replies = [...this.replies, signed];
    this.rebuildDerived();
    showToast('Reply published.');
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
