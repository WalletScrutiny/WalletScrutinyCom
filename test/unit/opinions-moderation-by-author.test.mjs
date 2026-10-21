import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { siteAdminPubkeys } from '../../src/nostr-constants.mjs';
import {
  OpinionModerationByAuthorPage,
  groupOpinionsByAuthor,
} from '../../src/opinions/moderation-by-author-page.mjs';
import { buildAuthorApprovalDraft } from '../../src/opinions/moderation.mjs';

const ADMIN = siteAdminPubkeys[0];
const ALICE = 'aa'.repeat(32);
const BOB = 'bb'.repeat(32);

function opinion(id, pubkey, created_at, subject = 'mobile/com.example') {
  return {
    id: id.repeat(64).slice(0, 64),
    pubkey,
    kind: 30023,
    created_at,
    content: `Opinion ${id}`,
    tags: [['d', subject], ['sentiment', '1']],
  };
}

describe('groupOpinionsByAuthor', () => {
  test('most opinions first, newest first within an author', () => {
    const groups = groupOpinionsByAuthor([
      opinion('1', ALICE, 100),
      opinion('2', BOB, 300),
      opinion('3', ALICE, 200, 'mobile/com.other'),
    ]);
    assert.deepEqual(groups.map((group) => group.pubkey), [ALICE, BOB]);
    assert.deepEqual(groups[0].opinions.map((event) => event.created_at), [200, 100]);
  });

  test('equal counts sort by the newest opinion', () => {
    const groups = groupOpinionsByAuthor([opinion('1', ALICE, 100), opinion('2', BOB, 300)]);
    assert.deepEqual(groups.map((group) => group.pubkey), [BOB, ALICE]);
  });
});

describe('OpinionModerationByAuthorPage', () => {
  function loadedPage(me) {
    const page = new OpinionModerationByAuthorPage(document.createElement('div'));
    page.me = me;
    page.buildShell();
    page.loaded = true;
    page.opinions = [opinion('1', ALICE, 100), opinion('2', BOB, 300), opinion('3', ALICE, 200, 'mobile/com.other')];
    page.wallets.set('mobile/com.example', { title: 'Example', url: '/mobile/com.example/' });
    return page;
  }

  test('one card per author with their opinions nested and per-author buttons', () => {
    const page = loadedPage(ADMIN);
    page.renderList();
    const cards = page.root.querySelectorAll('.opinion-moderation__author');
    assert.equal(cards.length, 2);
    assert.match(page.countEl.textContent, /^2 authors, 3 opinions$/);
    assert.equal(cards[0].querySelectorAll('.opinion-moderation__author-opinions .opinion-moderation__item').length, 2);
    assert.deepEqual([...cards[0].querySelectorAll('button')].map((b) => b.textContent), ['Approve author', 'Hide all 2']);
    assert.deepEqual([...cards[1].querySelectorAll('button')].map((b) => b.textContent), ['Approve author', 'Hide']);
    assert.equal(cards[0].querySelector('.opinion-moderation__note')?.getAttribute('role'), 'note');
  });

  test('the search filters opinions and drops authors left with none', () => {
    const page = loadedPage(ADMIN);
    page.query = 'Opinion 2';
    page.renderList();
    assert.equal(page.root.querySelectorAll('.opinion-moderation__author').length, 1);
    assert.equal(page.countEl.textContent, '1 of 2 authors, 1 of 3 opinions');
  });

  test('an author approval takes all their opinions off the queue', () => {
    const page = loadedPage(ADMIN);
    page.moderationEvents.push({ ...buildAuthorApprovalDraft({ pubkey: ALICE }), id: 'ee'.repeat(32), pubkey: ADMIN });
    page.applyModeration();
    page.renderList();
    assert.deepEqual(page.opinions.map((event) => event.pubkey), [BOB]);
    assert.equal(page.countEl.textContent, '1 author, 1 opinion');
    assert.ok(page.lists.trustedAuthors.has(ALICE));
    assert.equal(page.staticTrustedAuthors.has(ALICE), false);
  });

  test('no buttons for a non-admin', () => {
    const page = loadedPage(ADMIN);
    page.me = ALICE;
    const card = page.renderAuthor(groupOpinionsByAuthor(page.opinions)[0]);
    assert.equal(card.querySelectorAll('button').length, 0);
  });
});
