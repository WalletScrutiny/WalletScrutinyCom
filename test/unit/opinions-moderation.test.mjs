import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { siteAdminPubkeys } from '../../src/nostr-constants.mjs';
import { opinionKind } from '../../src/opinions/constants.mjs';
import {
  OPINION_DECISION_APPROVE,
  OPINION_DECISION_APPROVE_AUTHOR,
  OPINION_DECISION_HIDE,
  buildAuthorApprovalDraft,
  buildOpinionModerationDraft,
  canModerateOpinion,
  indexWalletsBySubject,
  moderationRelayMessage,
  opinionListStatus,
  opinionsForModeration,
  pendingModerationOpinions,
  resolveApprovedAuthors,
  resolveOpinionModeration,
  withApprovedAuthors,
} from '../../src/opinions/moderation.mjs';
import { OpinionModerationPage } from '../../src/opinions/moderation-page.mjs';
import { renderCard } from '../../src/opinions/card.mjs';

const ADMIN = siteAdminPubkeys[0];
const OTHER = 'ab'.repeat(32);
const OPINION_ID = 'cd'.repeat(32);

function decisionEvent({ id, pubkey, target = OPINION_ID, decision, created_at, k = String(opinionKind), address = null }) {
  return {
    id,
    pubkey,
    kind: 1984,
    created_at,
    content: '',
    tags: [
      ['e', target],
      ['p', OTHER],
      ['k', k],
      ['r', decision],
      ...(address ? [['a', address]] : []),
    ],
  };
}

describe('resolveOpinionModeration', () => {
  test('keeps the newest admin decision and ignores everyone else', () => {
    const moderation = resolveOpinionModeration([
      decisionEvent({ id: '1', pubkey: ADMIN, decision: OPINION_DECISION_APPROVE, created_at: 10 }),
      decisionEvent({ id: '2', pubkey: ADMIN, decision: OPINION_DECISION_HIDE, created_at: 20 }),
      decisionEvent({ id: '3', pubkey: OTHER, decision: OPINION_DECISION_APPROVE, created_at: 30 }),
      decisionEvent({ id: '4', pubkey: ADMIN, decision: 'spam', created_at: 40, k: '30301' }),
    ]);
    assert.equal(moderation.get(OPINION_ID).decision, OPINION_DECISION_HIDE);
    assert.equal(moderation.size, 1);
  });

  test('draft carries the opinion id, the decision and the client tag', () => {
    const draft = buildOpinionModerationDraft({
      opinion: { id: OPINION_ID, pubkey: OTHER },
      decision: OPINION_DECISION_APPROVE,
      createdAt: 50,
    });
    assert.equal(draft.kind, 1984);
    assert.equal(draft.created_at, 50);
    assert.ok(draft.tags.some((tag) => tag[0] === 'e' && tag[1] === OPINION_ID));
    assert.ok(draft.tags.some((tag) => tag[0] === 'r' && tag[1] === OPINION_DECISION_APPROVE));
    assert.ok(draft.tags.some((tag) => tag[0] === 'k' && tag[1] === '30023'));
    assert.ok(draft.tags.some((tag) => tag[0] === 'c' && tag[1] === 'walletscrutiny'));
  });

  test('draft names the opinion address when the opinion has a subject', () => {
    const draft = buildOpinionModerationDraft({
      opinion: { id: OPINION_ID, pubkey: OTHER, tags: [['d', 'android/com.example']] },
      decision: OPINION_DECISION_HIDE,
      createdAt: 50,
    });
    assert.ok(draft.tags.some((tag) => tag[0] === 'a' && tag[1] === `${opinionKind}:${OTHER}:android/com.example`));
  });
});

describe('author approvals', () => {
  const approval = (pubkey, overrides = {}) => ({
    ...buildAuthorApprovalDraft({ pubkey: OTHER, createdAt: 10 }),
    id: 'ef'.repeat(32),
    pubkey,
    ...overrides,
  });

  test('the draft names the author and no opinion', () => {
    const draft = buildAuthorApprovalDraft({ pubkey: OTHER.toUpperCase(), createdAt: 10 });
    assert.equal(draft.kind, 1984);
    assert.deepEqual(draft.tags.slice(0, 3), [['p', OTHER], ['k', String(opinionKind)], ['r', OPINION_DECISION_APPROVE_AUTHOR]]);
    assert.equal(draft.tags.some(([name]) => name === 'e' || name === 'a'), false);
    assert.throws(() => buildAuthorApprovalDraft({ pubkey: 'npub1nope' }));
  });

  test('only admin approvals count, and they add to the static list', () => {
    assert.deepEqual([...resolveApprovedAuthors([approval(ADMIN)])], [OTHER]);
    assert.equal(resolveApprovedAuthors([approval(OTHER)]).size, 0);
    assert.equal(resolveApprovedAuthors([approval(ADMIN, { tags: [['p', OTHER], ['k', '1'], ['r', OPINION_DECISION_APPROVE_AUTHOR]] })]).size, 0);
    const trusted = withApprovedAuthors(new Set(['12'.repeat(32)]), [approval(ADMIN)]);
    assert.deepEqual([...trusted].sort(), ['12'.repeat(32), OTHER].sort());
  });

  test('it is not an opinion decision', () => {
    assert.equal(resolveOpinionModeration([approval(ADMIN)]).size, 0);
  });

  test('an approved author\'s opinions are approved, and a hide still wins', () => {
    const opinion = { id: OPINION_ID, pubkey: OTHER, kind: opinionKind, created_at: 5, tags: [['d', 'mobile/com.example']] };
    const trustedAuthors = withApprovedAuthors(new Set(), [approval(ADMIN)]);
    assert.equal(opinionListStatus(opinion, { trustedAuthors, moderation: new Map() }), 'approved-author');
    const hidden = resolveOpinionModeration([
      decisionEvent({ id: '1', pubkey: ADMIN, decision: OPINION_DECISION_HIDE, created_at: 20 }),
    ]);
    assert.equal(opinionListStatus(opinion, { trustedAuthors, moderation: hidden }), 'hidden');
  });
});

describe('opinionListStatus', () => {
  const event = { id: OPINION_ID, pubkey: OTHER };

  test('a hide wins over a trusted author', () => {
    const moderation = resolveOpinionModeration([
      decisionEvent({ id: '1', pubkey: ADMIN, decision: OPINION_DECISION_HIDE, created_at: 1 }),
    ]);
    assert.equal(opinionListStatus(event, { trustedAuthors: new Set([OTHER]), moderation }), 'hidden');
  });

  test('an approval shows an unknown author as approved', () => {
    const moderation = resolveOpinionModeration([
      decisionEvent({ id: '1', pubkey: ADMIN, decision: OPINION_DECISION_APPROVE, created_at: 1 }),
    ]);
    assert.equal(opinionListStatus(event, { trustedAuthors: new Set(), moderation }), 'approved');
  });

  describe('across versions of one opinion', () => {
    const address = `${opinionKind}:${OTHER}:android/com.example`;
    const version = (id) => ({ id, pubkey: OTHER, tags: [['d', 'android/com.example']] });
    const original = version(OPINION_ID);
    const edit = version('ef'.repeat(32));
    const status = (event, events) => opinionListStatus(event, {
      trustedAuthors: new Set(),
      moderation: resolveOpinionModeration(events),
    });

    test('a hide covers later edits of the same opinion', () => {
      const events = [
        decisionEvent({ id: '1', pubkey: ADMIN, decision: OPINION_DECISION_HIDE, created_at: 1, address }),
      ];
      assert.equal(status(original, events), 'hidden');
      assert.equal(status(edit, events), 'hidden');
    });

    test('an approval covers only the approved version', () => {
      const events = [
        decisionEvent({ id: '1', pubkey: ADMIN, decision: OPINION_DECISION_APPROVE, created_at: 1, address }),
      ];
      assert.equal(status(original, events), 'approved');
      assert.equal(status(edit, events), 'open');
    });

    test('the newer of an approval and an address hide wins', () => {
      const hideThenApprove = [
        decisionEvent({ id: '1', pubkey: ADMIN, target: edit.id, decision: OPINION_DECISION_HIDE, created_at: 1, address }),
        decisionEvent({ id: '2', pubkey: ADMIN, decision: OPINION_DECISION_APPROVE, created_at: 2, address }),
      ];
      assert.equal(status(original, hideThenApprove), 'approved');
      assert.equal(status(edit, hideThenApprove), 'hidden');

      const approveThenHide = [
        decisionEvent({ id: '1', pubkey: ADMIN, decision: OPINION_DECISION_APPROVE, created_at: 1, address }),
        decisionEvent({ id: '2', pubkey: ADMIN, target: edit.id, decision: OPINION_DECISION_HIDE, created_at: 2, address }),
      ];
      assert.equal(status(original, approveThenHide), 'hidden');
    });

    test('an address from a non-admin hides nothing', () => {
      const events = [
        decisionEvent({ id: '1', pubkey: OTHER, target: edit.id, decision: OPINION_DECISION_HIDE, created_at: 1, address }),
      ];
      assert.equal(status(original, events), 'open');
    });
  });

  test('a trusted author with no decision is an approved author', () => {
    assert.equal(opinionListStatus(event, { trustedAuthors: new Set([OTHER]), moderation: new Map() }), 'approved-author');
    assert.equal(opinionListStatus(event, { trustedAuthors: new Set(), moderation: new Map() }), 'open');
  });
});

describe('opinionsForModeration', () => {
  test('drops opinions written by a site admin', () => {
    const events = [
      { id: '1', pubkey: ADMIN },
      { id: '2', pubkey: OTHER },
    ];
    assert.deepEqual(opinionsForModeration(events).map((event) => event.id), ['2']);
  });
});

describe('moderationRelayMessage', () => {
  test('names a full acceptance and a partial one', () => {
    assert.equal(
      moderationRelayMessage(OPINION_DECISION_APPROVE, { successful: 4, total: 4, failures: [] }),
      'Approval sent to 4 relays.',
    );
    assert.equal(
      moderationRelayMessage(OPINION_DECISION_HIDE, {
        successful: 1,
        total: 2,
        failures: [{ url: 'wss://nostr.mom/', error: 'timeout' }],
      }),
      'Hide accepted by 1 of 2 relays. Not accepted by wss://nostr.mom/ (timeout).',
    );
  });
});

describe('pendingModerationOpinions', () => {
  const context = (moderation) => ({ trustedAuthors: new Set([OTHER]), moderation });

  test('keeps only opinions that are neither approved nor hidden', () => {
    const open = { id: 'aa'.repeat(32), pubkey: 'bb'.repeat(32) };
    const byTrustedAuthor = { id: 'cc'.repeat(32), pubkey: OTHER };
    const approved = { id: OPINION_ID, pubkey: 'dd'.repeat(32) };
    const hidden = { id: 'ee'.repeat(32), pubkey: 'ff'.repeat(32) };
    const moderation = resolveOpinionModeration([
      decisionEvent({ id: '1', pubkey: ADMIN, target: approved.id, decision: OPINION_DECISION_APPROVE, created_at: 1 }),
      decisionEvent({ id: '2', pubkey: ADMIN, target: hidden.id, decision: OPINION_DECISION_HIDE, created_at: 1 }),
    ]);
    const kept = pendingModerationOpinions([open, byTrustedAuthor, approved, hidden], context(moderation));
    assert.deepEqual(kept.map((event) => event.id), [open.id]);
  });
});

describe('indexWalletsBySubject', () => {
  test('maps the canonical subject and the legacy store ids, preferring the active listing', () => {
    const archived = { folder: 'android', appId: 'com.example', title: 'Old', archived: true, url: '/android/com.example/' };
    const active = {
      folder: 'mobile',
      appId: 'com.example',
      title: 'Example',
      androidAppId: 'com.example',
      iphoneAppId: 'com.example.ios',
      url: '/mobile/com.example/',
    };
    const index = indexWalletsBySubject([archived, active]);
    assert.equal(index.get('mobile/com.example').title, 'Example');
    assert.equal(index.get('android/com.example').title, 'Example');
    assert.equal(index.get('iphone/com.example.ios').title, 'Example');
  });
});

describe('OpinionModerationPage actions', () => {
  test('renders approve and hide only for a site admin', () => {
    const root = document.createElement('div');
    const page = new OpinionModerationPage(root);
    const event = {
      id: OPINION_ID,
      pubkey: OTHER,
      created_at: 1_700_000_000,
      content: 'Looks good',
      tags: [['d', 'mobile/com.example'], ['sentiment', '1']],
    };
    page.wallets.set('mobile/com.example', { title: 'Example', url: '/mobile/com.example/' });

    page.me = null;
    page.renderGate();
    assert.equal(page.root.querySelector('.opinion-moderation__item'), null);
    assert.equal(page.root.querySelector('button'), null);
    assert.match(page.root.textContent, /administrators/);
    assert.doesNotMatch(page.root.textContent, /Sign in|Sign out/);

    page.me = OTHER;
    assert.equal(page.renderItem(event).querySelectorAll('button').length, 0);

    page.me = ADMIN;
    const item = page.renderItem(event);
    const buttons = [...item.querySelectorAll('button')].map((button) => button.textContent);
    assert.deepEqual(buttons, ['Approve', 'Hide']);
    assert.equal(item.querySelector('.opinion-moderation__subject'), null);
    assert.doesNotMatch(item.textContent, /mobile\/com\.example/);
    assert.equal(item.querySelector('.opinion-moderation__state'), null);
    assert.doesNotMatch(item.textContent, /Not approved/);
    const note = item.querySelector('.opinion-moderation__note');
    assert.equal(note?.getAttribute('role'), 'note');
    assert.equal(note?.textContent, 'This author has no profile name or picture, so it won\'t show on the website or app. Approving the opinion will show it on the wallet page.');
  });
  test('shows the whole opinion, not an excerpt', async () => {
    const page = new OpinionModerationPage(document.createElement('div'));
    const tail = 'the last sentence of a long opinion';
    const event = {
      id: OPINION_ID,
      pubkey: OTHER,
      created_at: 1_700_000_000,
      content: `First paragraph.\n\n${'word '.repeat(300)}${tail}`,
      tags: [['d', 'mobile/com.example'], ['sentiment', '1']],
    };
    const body = page.renderItem(event).querySelector('.opinion-moderation__body');
    await new Promise((resolve) => setTimeout(resolve, 50));
    assert.match(body.textContent.trim(), new RegExp(`${tail}$`));
    assert.equal(body.querySelectorAll('p').length, 2);
  });
});

describe('wallet page approve / hide', () => {
  const opinion = {
    id: OPINION_ID,
    pubkey: OTHER,
    kind: opinionKind,
    created_at: 1_700_000_000,
    content: 'Looks good',
    tags: [['d', 'mobile/com.example'], ['sentiment', '1']],
  };
  const lists = { trustedAuthors: new Set(), moderation: new Map() };

  test('only a site admin moderates, and only opinions nobody decided yet', () => {
    assert.equal(canModerateOpinion(opinion, { ...lists, me: ADMIN }), true);
    assert.equal(canModerateOpinion(opinion, { ...lists, me: OTHER }), false);
    assert.equal(canModerateOpinion(opinion, { ...lists, me: null }), false);
    assert.equal(canModerateOpinion(opinion, { ...lists, me: ADMIN, trustedAuthors: new Set([OTHER]) }), false);
    const approved = resolveOpinionModeration([
      decisionEvent({ id: '1', pubkey: ADMIN, decision: OPINION_DECISION_APPROVE, created_at: 10 }),
    ]);
    assert.equal(canModerateOpinion(opinion, { ...lists, me: ADMIN, moderation: approved }), false);
    assert.equal(canModerateOpinion({ ...opinion, kind: 1111 }, { ...lists, me: ADMIN }), false);
  });

  function cardCtx({ canModerate, pending = false, calls = [] }) {
    return {
      config: { trustedAuthors: new Set() },
      profiles: new Map(),
      tree: new Map(),
      reactions: new Map(),
      expandedThreads: new Set(),
      me: canModerate ? ADMIN : OTHER,
      canPost: true,
      requestProfile: () => {},
      canModerate: () => canModerate,
      isModerationPending: () => pending,
      actions: { moderate: (event, decision) => calls.push([event.id, decision]) },
    };
  }

  const moderationButtons = (card) => [...card.querySelectorAll('.opinion-card__action--moderate')];

  test('the card shows Approve and Hide when the widget allows it, and they publish the decision', () => {
    const calls = [];
    const card = renderCard(cardCtx({ canModerate: true, calls }), opinion);
    const buttons = moderationButtons(card);
    assert.deepEqual(buttons.map((button) => button.textContent), ['Approve', 'Hide']);
    buttons[0].click();
    buttons[1].click();
    assert.deepEqual(calls, [[OPINION_ID, OPINION_DECISION_APPROVE], [OPINION_ID, OPINION_DECISION_HIDE]]);
  });

  test('the card has no moderation buttons otherwise, and disables them while publishing', () => {
    assert.equal(moderationButtons(renderCard(cardCtx({ canModerate: false }), opinion)).length, 0);
    const pending = moderationButtons(renderCard(cardCtx({ canModerate: true, pending: true }), opinion));
    assert.equal(pending.length, 2);
    assert.ok(pending.every((button) => button.disabled));
  });
});
