/**
 * One opinion (or reply) card. Cards are rebuilt from state by the widget;
 * only like/dislike counts are updated in place.
 */
import { el } from '../html-utils.mjs';
import { parseMarkdownToSafeHtml } from '../marked-loader.mjs';
import { formatCommentDate } from '../assets-table-utils.mjs';
import { getProfileDisplayName, getProfileImageUrl, PROFILE_PLACEHOLDER_IMAGE, profileImageFallback } from '../nostr-profile.mjs';
import { wsIcon } from '../icon.mjs';
import { opinionKind, njumpUrl, SENTIMENT_LABELS } from './constants.mjs';
import { countThread, emptyReactionTally, getSentiment, isEdited, stripOpinionWrapper, zapstoreCommentVersion } from './content.mjs';
import { approvedIcon, replyIcon, sentimentIcon, thumbsDownIcon, thumbsUpIcon } from './icons.mjs';
import { createReplyEditor } from './editor.mjs';

/** Content that overflows the CSS clamp by less than this many lines is shown in full instead of getting a "Read more". */
const CLAMP_SLACK_LINES = 0.5;

/** Avatar + name; the widget patches both once the profile arrives. */
export function renderAuthor(ctx, pubkey, { withBadge = true } = {}) {
  const profile = ctx.profiles.get(pubkey) ?? null;
  const avatar = el('img', {
    className: 'opinion-card__avatar',
    src: getProfileImageUrl(profile),
    alt: '',
    loading: 'lazy',
    dataset: { authorAvatar: pubkey, placeholder: PROFILE_PLACEHOLDER_IMAGE },
  });
  avatar.addEventListener('error', () => profileImageFallback(avatar));
  const name = el('span', { className: 'opinion-card__name', dataset: { authorName: pubkey } },
    getProfileDisplayName(profile, pubkey));
  const author = el('span', { className: 'opinion-card__author' }, avatar, name);
  if (withBadge && ctx.config.trustedAuthors.has(pubkey)) {
    author.appendChild(el('span', { className: 'opinion-card__approved', title: 'Approved author', html: approvedIcon }));
  }
  ctx.requestProfile(pubkey);
  return author;
}

function renderContent(event) {
  const isOpinion = event.kind === opinionKind;
  const markdown = isOpinion ? stripOpinionWrapper(event.content) : String(event.content ?? '');
  const content = el('div', { className: 'opinion-card__content' });
  const wrapper = el('div', {}, content);
  parseMarkdownToSafeHtml(markdown).then((html) => {
    content.innerHTML = html;
    requestAnimationFrame(() => {
      const lineHeight = parseFloat(getComputedStyle(content).lineHeight) || 24;
      if (content.scrollHeight <= content.clientHeight + CLAMP_SLACK_LINES * lineHeight) {
        content.classList.add('is-expanded');
        return;
      }
      content.classList.add('is-clamped');
      const toggle = el('button', { type: 'button', className: 'opinion-card__read-more' }, 'Read more');
      toggle.addEventListener('click', () => {
        const expanded = content.classList.toggle('is-expanded');
        content.classList.toggle('is-clamped', !expanded);
        toggle.textContent = expanded ? 'Read less' : 'Read more';
      });
      wrapper.appendChild(toggle);
    });
  }).catch((error) => {
    console.error('opinions: could not render content', error);
    content.textContent = markdown;
  });
  return wrapper;
}

function reactionButton(icon, label) {
  const count = el('span', { className: 'opinion-card__count' }, '0');
  const button = el('button', { type: 'button', className: 'opinion-card__action', title: label, 'aria-label': label });
  button.innerHTML = icon;
  button.appendChild(count);
  return { button, count };
}

/** Wallet version a Zapstore comment was written for, as a "v1.2.3" pill. */
function renderVersion(event) {
  const version = zapstoreCommentVersion(event);
  if (!version) {
    return null;
  }
  return el('span', { className: 'opinion-card__version', title: 'Wallet version this comment was written for' }, `v${version}`);
}

/**
 * @param ctx widget context: config, me, profiles, requestProfile, tree,
 *            reactions, expandedThreads, actions; `readOnly` cards (Zapstore
 *            comments, `source: 'zapstore'`) only offer the thread toggle.
 */
export function renderCard(ctx, event, { opinion = event, depth = 0 } = {}) {
  const isOpinion = event.kind === opinionKind;
  // Top-level Zapstore comments are kind 1111 too, so the reply look keys on the depth, not the kind.
  const isReply = depth > 0;
  const readOnly = ctx.readOnly === true;
  const mine = !readOnly && ctx.me && ctx.me === event.pubkey;
  const card = el('article', {
    className: `opinion-card${isReply ? ' opinion-card--reply' : ''}${readOnly ? ' opinion-card--read-only' : ''}`,
    dataset: { eventId: event.id, source: ctx.source ?? 'walletscrutiny' },
  });

  // Header: author, sentiment ("Positive opinion" after a separator), time.
  const top = el('div', { className: 'opinion-card__top' });
  const left = el('div', { className: 'opinion-card__author-row' });
  left.appendChild(renderAuthor(ctx, event.pubkey));
  const sentiment = isOpinion ? getSentiment(event) : null;
  if (sentiment) {
    const label = el('span', { className: 'opinion-card__sentiment', html: sentimentIcon(sentiment) });
    label.appendChild(el('span', {}, `${SENTIMENT_LABELS[sentiment]} opinion`));
    left.appendChild(label);
  }
  const meta = el('span', { className: 'opinion-card__meta' });
  const version = ctx.source === 'zapstore' ? renderVersion(event) : null;
  if (version) {
    meta.appendChild(version);
    meta.appendChild(el('span', {}, ' · '));
  }
  if (isOpinion && isEdited(event)) {
    meta.appendChild(el('span', {}, 'Edited · '));
  }
  meta.appendChild(el('a', {
    href: `${njumpUrl}${event.id}`,
    target: '_blank',
    rel: 'noopener noreferrer',
    title: 'Open on njump',
  }, formatCommentDate(event.created_at)));
  top.append(left, meta);
  card.appendChild(top);

  card.appendChild(renderContent(event));

  // Actions: like, dislike, reply, thread toggle, delete, edit.
  const actions = el('div', { className: 'opinion-card__actions' });
  const like = reactionButton(thumbsUpIcon, 'Like');
  const dislike = reactionButton(thumbsDownIcon, 'Dislike');
  const paintReactions = () => {
    const tally = ctx.reactions.get(event.id) ?? emptyReactionTally();
    like.count.textContent = String(tally.likes);
    dislike.count.textContent = String(tally.dislikes);
    const mineReaction = ctx.me ? tally.byAuthor.get(ctx.me) ?? '' : '';
    like.button.setAttribute('aria-pressed', String(mineReaction === '+'));
    dislike.button.setAttribute('aria-pressed', String(mineReaction === '-'));
  };
  paintReactions();
  const react = (content) => async () => {
    like.button.disabled = true;
    dislike.button.disabled = true;
    try {
      await ctx.actions.react(opinion, event, content);
      paintReactions();
    } finally {
      like.button.disabled = false;
      dislike.button.disabled = false;
    }
  };
  if (ctx.canPost === false) {
    like.button.disabled = true;
    dislike.button.disabled = true;
  }
  like.button.addEventListener('click', react('+'));
  dislike.button.addEventListener('click', react('-'));
  if (!readOnly) {
    actions.append(like.button, dislike.button);
  }

  const replyButton = el('button', { type: 'button', className: 'opinion-card__action', title: 'Reply' });
  replyButton.innerHTML = replyIcon;
  replyButton.appendChild(el('span', {}, 'Reply'));
  if (!readOnly && ctx.canPost !== false) {
    actions.appendChild(replyButton);
  }

  const repliesContainer = el('div', { className: 'opinion-card__replies' });
  const threadToggle = el('button', { type: 'button', className: 'opinion-card__action opinion-card__thread' });
  const paintReplies = () => {
    const count = countThread(ctx.tree, event.id);
    const expanded = ctx.expandedThreads.has(event.id);
    threadToggle.textContent = `${count} ${count === 1 ? 'reply' : 'replies'}`;
    threadToggle.setAttribute('aria-pressed', String(expanded));
    threadToggle.hidden = count === 0;
    repliesContainer.replaceChildren();
    if (!expanded) {
      return;
    }
    for (const reply of ctx.tree.get(event.id) ?? []) {
      repliesContainer.appendChild(renderCard(ctx, reply, { opinion, depth: depth + 1 }));
    }
  };
  threadToggle.addEventListener('click', () => {
    if (ctx.expandedThreads.has(event.id)) {
      ctx.expandedThreads.delete(event.id);
    } else {
      ctx.expandedThreads.add(event.id);
    }
    paintReplies();
  });
  actions.appendChild(threadToggle);

  if (mine) {
    const remove = el('button', {
      type: 'button',
      className: 'opinion-card__action opinion-card__action--danger opinion-card__action--right',
      title: isOpinion ? 'Delete my opinion' : 'Delete my reply',
      html: wsIcon('trash-can'),
    });
    remove.appendChild(el('span', {}, 'Delete'));
    remove.addEventListener('click', () => ctx.actions.remove(event));
    actions.appendChild(remove);
    if (isOpinion) {
      const edit = el('button', { type: 'button', className: 'opinion-card__action', title: 'Edit my opinion', html: wsIcon('pen') });
      edit.appendChild(el('span', {}, 'Edit'));
      edit.addEventListener('click', () => ctx.actions.edit(event));
      actions.appendChild(edit);
    }
  }
  card.appendChild(actions);

  // Reply editor, opened on demand under the actions.
  const replySlot = el('div');
  card.appendChild(replySlot);
  replyButton.addEventListener('click', async () => {
    if (replySlot.firstChild) {
      replySlot.replaceChildren();
      return;
    }
    if (!(await ctx.actions.ensureSignedIn())) {
      return;
    }
    const editor = createReplyEditor({
      onSubmit: async ({ body }) => {
        await ctx.actions.reply(opinion, event, body);
        replySlot.replaceChildren();
        ctx.expandedThreads.add(event.id);
        paintReplies();
      },
      onCancel: () => replySlot.replaceChildren(),
    });
    replySlot.appendChild(editor.element);
    editor.focus();
  });

  card.appendChild(repliesContainer);
  paintReplies();
  return card;
}
