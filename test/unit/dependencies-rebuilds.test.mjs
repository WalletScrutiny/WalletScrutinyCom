import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { ossDetailLines } from '../../src/dependencies-rebuilds.mjs';

const claim = { by: 'oss-rebuild', url: 'https://storage.googleapis.com/google-rebuild-attestations/npm/buffer/6.0.3/buffer-6.0.3.tgz/rebuild.intoto.jsonl' };
const text = (nodes) => nodes.map(n => n.textContent).join('\n');

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
