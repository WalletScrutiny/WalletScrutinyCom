import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { parseFlatpakInfo, normalizeChecks, describe: describeCheck } = require('../../assets/js/distribution-checks.js');

const COMMIT = '1b2f946862e570352cc7945ade0d0f14cca64116ee9b8e23c237d63574e36de3';
const PARENT = '6ce1c90858c91f951d9ab640c85f7787588357154b9b4ee108860703d2afe2df';
const ID = 'network.bisq.Bisq';
const INFO = `
Bisq - A decentralized bitcoin exchange network

          ID: network.bisq.Bisq
         Ref: app/network.bisq.Bisq/x86_64/stable
        Arch: x86_64
      Branch: stable
     Version: 1.10.9
     License: AGPL-3.0-only
      Origin: flathub
  Collection: org.flathub.Stable
Installation: user
   Installed: 1.1 GB
     Runtime: org.freedesktop.Platform/x86_64/25.08
         Sdk: org.freedesktop.Sdk/x86_64/25.08

      Commit: ${COMMIT}
      Parent: ${PARENT}
     Subject: bisq: Update Bisq.deb to 1.10.9 (#96) (27b8cdfeb0ce)
        Date: 2026-10-10 13:42:02 +0000
`;

const check = (over = {}) => ({
  commit: COMMIT, version: '1.10.9', checked: '2026-10-21', result: 'matches',
  file: 'Bisq-64bit-1.10.9.deb', sha256: 'a'.repeat(64), verdict: 'reproducible', ...over,
});

describe('parseFlatpakInfo', () => {
  it('reads commit and version from the full output, not the parent', () => {
    assert.deepEqual(parseFlatpakInfo(INFO, ID), { ok: true, commit: COMMIT, version: '1.10.9' });
  });
  it('accepts the Commit line alone, a bare commit and --show-commit output', () => {
    for (const text of [`Commit: ${COMMIT}`, COMMIT, `  ${COMMIT.toUpperCase()}\n`]) {
      assert.deepEqual(parseFlatpakInfo(text, ID), { ok: true, commit: COMMIT, version: null });
    }
  });
  it('refuses output for another app', () => {
    const r = parseFlatpakInfo(INFO.replace('ID: network.bisq.Bisq', 'ID: org.evil.App'), ID);
    assert.equal(r.ok, false);
    assert.match(r.error, /another app/);
  });
  it('refuses two commits without a Commit label (e.g. a translated flatpak)', () => {
    const r = parseFlatpakInfo(`Übergabe: ${COMMIT}\nEltern: ${PARENT}`, ID);
    assert.equal(r.ok, false);
  });
  it('refuses empty, malformed and oversized input', () => {
    for (const text of ['', '   ', 'Commit: 1b2f9468', 'Commit: <img src=x onerror=alert(1)>', COMMIT.slice(1), 'x'.repeat(20001)]) {
      assert.equal(parseFlatpakInfo(text, ID).ok, false, text.slice(0, 40));
    }
  });
  it('drops a version that is not a plain version string', () => {
    const r = parseFlatpakInfo(INFO.replace('Version: 1.10.9', 'Version: <b>1</b>'), ID);
    assert.equal(r.version, null);
  });
});

describe('normalizeChecks', () => {
  it('drops malformed entries field by field', () => {
    const bad = [
      check({ commit: 'zz' }), check({ version: '<script>' }), check({ checked: 'yesterday' }),
      check({ result: 'reproducible' }), check({ file: '../x' }), check({ sha256: 'g'.repeat(64) }),
      check({ verdict: 'trusted' }), null, 'x',
    ];
    assert.deepEqual(normalizeChecks(bad), []);
    assert.deepEqual(normalizeChecks('not a list'), []);
  });
  it('sorts newest first and keeps one entry per commit', () => {
    const list = normalizeChecks([
      check({ commit: PARENT, checked: '2026-09-18' }),
      check({ checked: '2026-10-01', verdict: null }),
      check({ checked: '2026-10-21' }),
    ]);
    assert.deepEqual(list.map(c => [c.commit, c.checked]), [[COMMIT, '2026-10-21'], [PARENT, '2026-09-18']]);
  });
});

describe('describe', () => {
  it('takes the colour of "matches" from the wrapped file verdict', () => {
    assert.equal(describeCheck(check()).tone, 'good');
    assert.equal(describeCheck(check({ verdict: 'ftbfs' })).tone, 'bad');
    const none = describeCheck(check({ verdict: null }));
    assert.equal(none.tone, 'none');
    assert.match(none.text, /whose verdict is no verdict/);
  });
  it('makes "differs" red whatever the wrapped verdict', () => {
    assert.equal(describeCheck(check({ result: 'differs', verdict: 'reproducible' })).tone, 'bad');
  });
});
