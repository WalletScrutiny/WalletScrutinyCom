import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  applyDeletions,
  buildOpinionContent,
  buildReplyTree,
  countThread,
  getReplyParentId,
  getSentiment,
  headline,
  isEdited,
  latestOpinionPerAuthor,
  opinionAddress,
  parseSubjectKeys,
  sortOpinions,
  stripOpinionWrapper,
  tallyReactions,
  tallySentiments,
} from '../../src/opinions/content.mjs';
import { opinionKind, replyKind, reactionKind, deletionKind } from '../../src/opinions/constants.mjs';

const A = 'a'.repeat(64);
const B = 'b'.repeat(64);

function opinion({ id, pubkey = A, d = 'mobile/x', sentiment = '1', created_at = 100, content = '', tags = [] }) {
  return {
    id,
    pubkey,
    kind: opinionKind,
    created_at,
    content,
    tags: [['d', d], ['sentiment', sentiment], ...tags],
  };
}

function reply({ id, pubkey = B, created_at = 200, eTags = [] }) {
  return { id, pubkey, kind: replyKind, created_at, content: 'hi', tags: eTags.map((tag) => ['e', ...tag]) };
}

describe('parseSubjectKeys', () => {
  test('canonical subject first, aliases deduplicated and trimmed', () => {
    assert.deepEqual(parseSubjectKeys('mobile/x', ' android/x, iphone/x ,mobile/x,'), ['mobile/x', 'android/x', 'iphone/x']);
    assert.deepEqual(parseSubjectKeys('mobile/x'), ['mobile/x']);
    assert.deepEqual(parseSubjectKeys('mobile/x', undefined), ['mobile/x']);
  });
});

describe('opinion content wrapper', () => {
  test('buildOpinionContent round-trips through stripOpinionWrapper', () => {
    const content = buildOpinionContent({
      header: '******** Opinion about X (mobile)',
      body: 'Great **wallet**\n\n- fast',
      footer: '[Join](https://walletscrutiny.com/mobile/x/)',
      tags: ['WalletScrutiny', 'nostrOpinion'],
    });
    assert.match(content, /<!--HEADER END-->/);
    assert.match(content, /<!--FOOTER START-->/);
    assert.match(content, /#WalletScrutiny #nostrOpinion/);
    assert.equal(stripOpinionWrapper(content), 'Great **wallet**\n\n- fast');
  });

  test('stripOpinionWrapper leaves plain content alone', () => {
    assert.equal(stripOpinionWrapper('just text'), 'just text');
    assert.equal(stripOpinionWrapper(undefined), '');
  });
});

describe('latestOpinionPerAuthor', () => {
  test('keeps the newest version per author and drops blocked events/authors', () => {
    const events = [
      opinion({ id: '1', created_at: 10, d: 'android/x' }),
      opinion({ id: '2', created_at: 20 }),
      opinion({ id: '3', pubkey: B, created_at: 5 }),
      opinion({ id: '4', pubkey: 'c'.repeat(64), created_at: 50 }),
      { id: '5', pubkey: A, kind: 1, created_at: 99, tags: [], content: '' },
    ];
    const kept = latestOpinionPerAuthor(events, {
      blockedEventIds: new Set(['3']),
      blockedAuthors: new Set(['c'.repeat(64)]),
    });
    assert.deepEqual(kept.map((event) => event.id), ['2']);
  });
});

describe('applyDeletions', () => {
  test('removes events named by id and older addressable versions, only by their author', () => {
    const mine = opinion({ id: '1', created_at: 10 });
    const newer = opinion({ id: '2', created_at: 30 });
    const other = opinion({ id: '3', pubkey: B, created_at: 10 });
    const note = reply({ id: '4', pubkey: B });
    const deletions = [
      { id: 'd1', pubkey: A, kind: deletionKind, created_at: 20, tags: [['a', opinionAddress(mine)], ['k', '30023']], content: '' },
      { id: 'd2', pubkey: A, kind: deletionKind, created_at: 20, tags: [['e', '3']], content: '' },
      { id: 'd3', pubkey: B, kind: deletionKind, created_at: 300, tags: [['e', '4']], content: '' },
    ];
    const kept = applyDeletions([mine, newer, other, note], deletions);
    assert.deepEqual(kept.map((event) => event.id), ['2', '3']);
  });

  test('no deletions returns a copy', () => {
    const events = [opinion({ id: '1' })];
    const kept = applyDeletions(events, []);
    assert.deepEqual(kept, events);
    assert.notEqual(kept, events);
  });
});

describe('sorting and tallies', () => {
  test('sortOpinions puts approved authors first, then newest first', () => {
    const events = [
      opinion({ id: 'old-trusted', created_at: 1 }),
      opinion({ id: 'new-unknown', pubkey: B, created_at: 50 }),
      opinion({ id: 'new-trusted', created_at: 9 }),
    ];
    assert.deepEqual(sortOpinions(events, new Set([A])).map((event) => event.id), ['new-trusted', 'old-trusted', 'new-unknown']);
  });

  test('tallySentiments counts only valid sentiment tags', () => {
    const counts = tallySentiments([
      opinion({ id: '1', sentiment: '1' }),
      opinion({ id: '2', sentiment: '-1' }),
      opinion({ id: '3', sentiment: '0' }),
      opinion({ id: '4', sentiment: 'x' }),
    ]);
    assert.deepEqual(counts, { '1': 1, '0': 1, '-1': 1 });
    assert.equal(getSentiment(opinion({ id: '4', sentiment: 'x' })), null);
  });

  test('headline', () => {
    assert.equal(headline(2, 5), 'Community Opinions (2/5)');
  });

  test('isEdited compares published_at with created_at', () => {
    assert.equal(isEdited(opinion({ id: '1', created_at: 100, tags: [['published_at', '100']] })), false);
    assert.equal(isEdited(opinion({ id: '2', created_at: 200, tags: [['published_at', '100']] })), true);
    assert.equal(isEdited(opinion({ id: '3', created_at: 200 })), false);
  });
});

describe('reply threads', () => {
  test('parent is the "reply" marker, else "root", else the last e tag', () => {
    assert.equal(getReplyParentId(reply({ id: 'r', eTags: [['root', '', 'root'], ['p', '', 'reply']] })), 'p');
    assert.equal(getReplyParentId(reply({ id: 'r', eTags: [['root', '', 'root']] })), 'root');
    assert.equal(getReplyParentId(reply({ id: 'r', eTags: [['x'], ['y']] })), 'y');
    assert.equal(getReplyParentId(reply({ id: 'r' })), null);
  });

  test('buildReplyTree nests replies under known parents and drops orphans', () => {
    const root = opinion({ id: 'op' });
    const first = reply({ id: 'r1', created_at: 2, eTags: [['op', '', 'root']] });
    const nested = reply({ id: 'r2', created_at: 1, eTags: [['op', '', 'root'], ['r1', '', 'reply']] });
    const orphan = reply({ id: 'r3', eTags: [['gone', '', 'root']] });
    const tree = buildReplyTree([nested, orphan, first], [root.id]);
    assert.deepEqual(tree.get('op').map((event) => event.id), ['r1']);
    assert.deepEqual(tree.get('r1').map((event) => event.id), ['r2']);
    assert.equal(tree.has('gone'), false);
    assert.equal(countThread(tree, 'op'), 2);
    assert.equal(countThread(tree, 'r2'), 0);
  });
});

describe('tallyReactions', () => {
  const reaction = (id, pubkey, content, created_at, target = 'op') => ({
    id, pubkey, kind: reactionKind, created_at, content, tags: [['a', 'x'], ['p', A], ['e', target, '', 'root']],
  });

  test('counts the latest reaction per author per target', () => {
    const tally = tallyReactions([
      reaction('1', A, '+', 10),
      reaction('2', A, '-', 20),
      reaction('3', B, '+', 5),
      reaction('4', B, '', 6),
      reaction('5', B, '+', 7, 'other'),
    ]);
    assert.equal(tally.get('op').likes, 0);
    assert.equal(tally.get('op').dislikes, 1);
    assert.equal(tally.get('op').byAuthor.get(A), '-');
    assert.equal(tally.get('op').byAuthor.get(B), '');
    assert.equal(tally.get('other').likes, 1);
  });
});
