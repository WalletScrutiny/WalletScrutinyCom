import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { finalizeEvent, generateSecretKey, getPublicKey } from 'nostr-tools/pure';

import { labelFilter, labelToCheck, verdictsBySha256 } from '../../src/distribution-labels.mjs';

const sk = generateSecretKey();
const pubkey = getPublicKey(sk);
const ID = 'network.bisq.Bisq';
const expected = { pubkey, channel: 'flathub', id: ID };
const COMMIT = '1b2f946862e570352cc7945ade0d0f14cca64116ee9b8e23c237d63574e36de3';
const SHA = '954aa4689f70cd2b773ef6d21d3aab3d5f5d2de4f69e19d64a49a31fdfdbd357';

function tags(over = {}) {
  const t = {
    L: [['L', 'ws.distribution']],
    l: [['l', 'matches', 'ws.distribution']],
    r: [['r', `https://flathub.org/apps/${ID}`]],
    channel: [['channel', 'flathub']],
    id: [['id', ID]],
    commit: [['commit', COMMIT]],
    version: [['version', '1.10.9']],
    x: [['x', SHA]],
    file: [['file', 'Bisq-64bit-1.10.9.deb']],
    method: [['method', 'files']],
    ...over,
  };
  return Object.values(t).flat();
}
const label = (over, key = sk) => finalizeEvent({ kind: 1985, created_at: 1792575000, content: '', tags: tags(over) }, key);

describe('labelFilter', () => {
  it('asks only for the pinned key, the namespace and this package', () => {
    assert.deepEqual(labelFilter(expected), {
      kinds: [1985], authors: [pubkey], '#L': ['ws.distribution'], '#r': [`https://flathub.org/apps/${ID}`], limit: 200,
    });
  });
});

describe('labelToCheck', () => {
  it('turns a valid label into a check without a verdict', () => {
    assert.deepEqual(labelToCheck(label(), expected), {
      commit: COMMIT, version: '1.10.9', checked: '2026-10-21', result: 'matches',
      file: 'Bisq-64bit-1.10.9.deb', sha256: SHA, verdict: null, created_at: 1792575000,
    });
  });
  it('rejects a label from another key, even one that is correctly signed', () => {
    assert.equal(labelToCheck(label({}, generateSecretKey()), expected), null);
  });
  it('rejects a forged signature', () => {
    const e = label();
    assert.equal(labelToCheck({ ...e, tags: tags({ l: [['l', 'differs', 'ws.distribution']] }) }, expected), null);
  });
  it('rejects labels for another package, namespace or result', () => {
    for (const over of [
      { id: [['id', 'org.evil.App']] },
      { channel: [['channel', 'snap']] },
      { r: [['r', 'https://flathub.org/apps/org.evil.App']] },
      { L: [['L', 'other']] },
      { l: [['l', 'reproducible', 'ws.distribution']] },
      { l: [['l', 'matches', 'ws.distribution'], ['l', 'differs', 'ws.distribution']] },
      { commit: [['commit', 'abc']] },
      { x: [['x', SHA], ['x', COMMIT]] },
    ]) {
      assert.equal(labelToCheck(label(over), expected), null, JSON.stringify(over));
    }
  });
});

describe('verdictsBySha256', () => {
  it('takes the newest known status per file and ignores unknown statuses', () => {
    const v = (x, status, created_at) => ({ created_at, tags: [['x', x], ['status', status]] });
    const map = verdictsBySha256([
      v(SHA, 'ftbfs', 10), v(SHA, 'reproducible', 5), v(SHA, 'trusted', 20), v(COMMIT, 'reproducible', 30),
    ], [SHA]);
    assert.deepEqual([...map], [[SHA, 'ftbfs']]);
  });
});
