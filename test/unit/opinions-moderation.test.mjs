import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { siteAdminPubkeys } from '../../src/nostr-constants.mjs';
import { opinionKind } from '../../src/opinions/constants.mjs';
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
} from '../../src/opinions/moderation.mjs';
import { OpinionModerationPage } from '../../src/opinions/moderation-page.mjs';

const ADMIN = siteAdminPubkeys[0];
const OTHER = 'ab'.repeat(32);
const OPINION_ID = 'cd'.repeat(32);

function decisionEvent({ id, pubkey, target = OPINION_ID, decision, created_at, k = String(opinionKind) }) {
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
});
