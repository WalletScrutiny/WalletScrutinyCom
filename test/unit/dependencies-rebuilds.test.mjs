import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { ossDetailLines, ossRebuildUrl, withClaimUrls, rebuildState, rebuildBadge, rebuildsElement, wsDetailLines } from '../../src/dependencies-rebuilds.mjs';
import { ossRebuildUrl as exporterUrl } from '../../external/source_analysis/rebuildClaims.mjs';

const claim = { by: 'oss-rebuild', url: 'https://storage.googleapis.com/google-rebuild-attestations/npm/buffer/6.0.3/buffer-6.0.3.tgz/rebuild.intoto.jsonl' };
const text = (nodes) => nodes.map(n => n.textContent).join('\n');

// rebuilds.json stores an OSS Rebuild claim as its artifact name (export.mjs, rebuildRowForReaders).
describe('OSS Rebuild claim URLs', () => {
  const cases = [['npm', 'buffer', '6.0.3', 'buffer-6.0.3.tgz'], ['npm', '@noble/hashes', '1.8.0', 'noble-hashes-1.8.0.tgz'],
    ['pip', 'Flask_Login.ext', '0.6.3', 'flask_login-0.6.3-py3-none-any.whl'], ['cargo', 'serde', '1.0.200', 'serde-1.0.200.crate'], ['gradle', 'g:a', '1', 'a-1.jar']];

  test('built the way the exporter took them apart', () => {
    assert.equal(ossRebuildUrl(...cases[0]), claim.url);
    assert.equal(ossRebuildUrl(...cases[1]), 'https://storage.googleapis.com/google-rebuild-attestations/npm/@noble/hashes/1.8.0/noble-hashes-1.8.0.tgz/rebuild.intoto.jsonl');
    assert.equal(ossRebuildUrl(...cases[2]), 'https://storage.googleapis.com/google-rebuild-attestations/pypi/flask-login-ext/0.6.3/flask_login-0.6.3-py3-none-any.whl/rebuild.intoto.jsonl');
    assert.equal(ossRebuildUrl(...cases[4]), null, 'an ecosystem OSS Rebuild does not cover');
    for (const c of cases) assert.equal(ossRebuildUrl(...c), exporterUrl(...c), `the exporter's rule for ${c[0]}`);
  });

  test('withClaimUrls gives each OSS Rebuild claim its URL and leaves the rest alone', () => {
    const theirs = { by: 'reproducible-central', result: 'reproduced', url: 'https://github.com/x/y.buildspec' };
    const whole = { by: 'oss-rebuild', result: 'reproduced', url: 'https://elsewhere.example/rebuild.intoto.jsonl' };
    const ours = { by: 'ws', result: 'reproduced', date: '2026-11-20' };
    const data = { schema: 1, rows: [
      { ecosystem: 'npm', name: 'buffer', version: '6.0.3', claims: [ours, { by: 'oss-rebuild', result: 'reproduced', artifact: 'buffer-6.0.3.tgz' }] },
      { ecosystem: 'npm', name: 'old', version: '1', claims: [whole, theirs] },
      { ecosystem: 'gradle', name: 'g:a', version: '1', claims: [{ by: 'oss-rebuild', result: 'failed', artifact: 'a-1.jar' }] },
    ] };
    const out = withClaimUrls(data);
    assert.deepEqual(out.rows[0].claims, [ours, { by: 'oss-rebuild', result: 'reproduced', artifact: 'buffer-6.0.3.tgz', url: claim.url }]);
    assert.deepEqual(out.rows[1].claims, [whole, theirs], 'an export that stores the URL, and other projects\' claims');
    assert.deepEqual(out.rows[2].claims, data.rows[2].claims, 'no URL to build: the claim stays as it is');
    assert.equal(withClaimUrls(null), null);
  });
});

describe('OSS Rebuild info tip', () => {
  test('source commit linked, how it matched, recipe, and the attestation', () => {
    const nodes = ossDetailLines(claim, { repo: 'https://github.com/feross/buffer', commit: 'f52dffd9df0445b93c0c9065c2f8f0f46b2c729a', recipe: 'npm_pack_build', tools: 'npm 6.14.8', built: '2025-12-13', exact: false });
    assert.match(text(nodes), /Built from github\.com\/feross\/buffer at f52dffd9df04\./);
    assert.match(text(nodes), /after Google set aside details/);
    assert.match(text(nodes), /Built with npm pack \(npm 6\.14\.8\), 2025-12-13\./);
    const hrefs = nodes.flatMap(n => [...n.querySelectorAll('a')].map(a => a.href));
    assert.ok(hrefs.includes('https://github.com/feross/buffer/commit/f52dffd9df0445b93c0c9065c2f8f0f46b2c729a'));
    assert.ok(hrefs.includes(claim.url));
  });

  test('loading, then missing: the attestation link stays', () => {
    assert.match(text(ossDetailLines(claim, undefined)), /Loading/);
    const missing = ossDetailLines(claim, null);
    assert.match(text(missing), /No summary/);
    assert.equal(missing.at(-1).querySelector('a').href, claim.url);
  });
});

// The rebuilder's verdicts (external/dep_rebuilder/db.mjs) as our claims' results.
describe('our verdicts besides reproduced', () => {
  const row = (...results) => ({ ecosystem: 'npm', name: 'a', version: '1', claims: results.map(([by, result]) => ({ by, result })) });

  test('the package\'s state is its most telling claim', () => {
    assert.equal(rebuildState(row(['ws', 'unknown-command'], ['oss-rebuild', 'reproduced'])), 'reproduced');
    assert.equal(rebuildState(row(['ws', 'almost'], ['reproducible-central', 'failed'])), 'almost');
    assert.equal(rebuildState(row(['ws', 'not-reproducible'])), 'not-reproducible');
    assert.equal(rebuildState(row(['ws', 'unknown-command'], ['reproducible-central', 'failed'])), 'failed');
    assert.equal(rebuildState(row(['ws', 'unknown-command'])), 'unknown-command');
    assert.equal(rebuildState(row(['ws', 'something-new'])), 'failed', 'a result the page does not know reads as failed');
    assert.equal(rebuildState(row()), 'none');
  });

  test('a difference of our guessed build is never called not reproducible', () => {
    const badge = rebuildBadge(row(['ws', 'unknown-command']));
    assert.equal(badge.textContent, 'differs from our build');
    assert.ok(badge.className.includes('dp-rb--unknown-command'));
    assert.doesNotMatch(badge.title, /not reproducible/);
    const tip = text(wsDetailLines({ by: 'ws', result: 'unknown-command', note: 'Rebuilt tarball differs: 1 of 4 files differ (index.js)' }));
    assert.match(tip, /We guessed the build command/);
    assert.equal(rebuildBadge(row(['ws', 'not-reproducible'])).textContent, 'not reproducible');
    assert.equal(rebuildBadge(row(['ws', 'almost'])).textContent, 'almost reproduced');
  });

  test('the Rebuilds tab: each claim under its own word, all of them under Not reproduced', () => {
    const data = { rows: [row(['ws', 'not-reproducible']), { ...row(['ws', 'almost']), name: 'b' }, { ...row(['ws', 'reproduced']), name: 'c' }] };
    const deps = ['a', 'b', 'c'].map(name => ({ ecosystem: 'npm', name, version: '1' }));
    const pane = rebuildsElement(data, deps);
    const pills = [...pane.querySelectorAll('.dp-rb-claims .dp-rb')].map(p => p.textContent).sort();
    assert.deepEqual(pills, ['almost', 'not reproducible', 'reproduced']);
    const filter = [...pane.querySelectorAll('.dp-rb-filter')].find(b => b.textContent.startsWith('Not reproduced'));
    assert.equal(filter.querySelector('.dp-rb-filter-count').textContent, '2');
  });
});
