import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { addArchivedFrom, shouldArchiveMobile } from '../../scripts/archiveNobtcNowallet.mjs';

test('archives a mobile listing whose only platform is nobtc or nowallet', () => {
  assert.equal(shouldArchiveMobile({ android: { verdict: 'nobtc' } }), true);
  assert.equal(shouldArchiveMobile({ iphone: { verdict: 'nowallet' } }), true);
});

test('archives a mobile listing when every platform is nobtc or nowallet', () => {
  assert.equal(shouldArchiveMobile({
    android: { verdict: 'nowallet' },
    iphone: { verdict: 'nobtc' }
  }), true);
});

test('keeps a mobile listing when another platform is still a wallet', () => {
  assert.equal(shouldArchiveMobile({
    android: { verdict: 'custodial' },
    iphone: { verdict: 'nobtc' }
  }), false);
  assert.equal(shouldArchiveMobile({
    android: { verdict: 'nowallet' },
    iphone: { verdict: 'nosource' }
  }), false);
});

test('keeps a mobile listing when a platform has no verdict', () => {
  assert.equal(shouldArchiveMobile({
    android: { verdict: 'nobtc' },
    iphone: { appId: 'id123' }
  }), false);
});

test('falls back to the root verdict when no store platform is present', () => {
  assert.equal(shouldArchiveMobile({ verdict: 'nobtc' }), true);
  assert.equal(shouldArchiveMobile({ verdict: 'custodial' }), false);
  assert.equal(shouldArchiveMobile({}), false);
});

test('points the archived header at the last commit of the original file', () => {
  const filePath = 'scripts/archiveNobtcNowallet.mjs';
  const expected = execFileSync('git', ['log', '-1', '--format=%H', '--', filePath], { encoding: 'utf8' }).trim();
  assert.deepEqual(addArchivedFrom({ verdict: 'nobtc' }, filePath), {
    verdict: 'nobtc',
    archivedFrom: filePath,
    archivedCommit: expected
  });
});

test('leaves the archived header alone for a file git never saw', () => {
  assert.deepEqual(addArchivedFrom({ verdict: 'nobtc' }, '_mobile/never.committed.md'), { verdict: 'nobtc' });
});
