import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { marked } from 'marked';

import { fillReportAuthors, shortenReportHashes, tidyBuildServerReport } from '../../src/build-server-report.mjs';

const HASH = '748c84c0ff5457b9b6a426a456984f0efbe78fb926f1b86d4e6c1ea146f74318';
const BASED_ON = '6dbdacbeff5ebdcfbcaf7e54320749a887af6ed34796053d1a0b6cf1b0b76c07';
const VERIFIER = '1f9e547c2f31942623b8ad1d07713282e8640fd8cf474e9f79f18ace8af216ed';

/** The layout of external/build_server/verifications.mjs buildVerificationContent. */
const REPORT = [
  '**Reproducible.** We built version 2026.11.2 (1) from its public source code and got the same app users download.',
  '',
  `**Official app (SHA-256):** \`${HASH}\``,
  '',
  '<details>',
  '<summary>Other information</summary>',
  '',
  `- Build script from verification \`${BASED_ON}\` by \`${VERIFIER}\``,
  '- Script version: v0.2.31',
  '- Command: `world.bitkey.app_script.sh --binary binary`',
  '',
  '**Notes from the script**',
  '',
  'Bitkey verification reported identical builds.',
  '',
  '</details>',
  '',
].join('\n');

describe('tidyBuildServerReport', () => {
  test('puts the script version first, rewords the build script line and drops the command', () => {
    const tidy = tidyBuildServerReport(REPORT);
    assert.ok(tidy.includes(
      '<summary>Other information</summary>\n\n' +
      '- Script version: v0.2.31\n' +
      `- Build script taken from verification \`${BASED_ON}\` by \`${VERIFIER}\`\n\n` +
      '**Notes from the script**\n'
    ));
    assert.ok(!tidy.includes('Command'));
    assert.ok(tidy.endsWith('identical builds.\n\n</details>\n'));
  });

  test('a report without notes still closes its details', () => {
    const noNotes = REPORT.replace(/\n\*\*Notes from the script\*\*\n\nBitkey verification reported identical builds.\n/, '');
    assert.ok(tidyBuildServerReport(noNotes).endsWith(`by \`${VERIFIER}\`\n\n</details>\n`));
  });

  test('other reports are left alone', () => {
    const mine = '<details>\n<summary>Other information</summary>\n\nI ran - Command: x myself.\n\n</details>';
    assert.equal(tidyBuildServerReport(mine), mine);
    assert.equal(tidyBuildServerReport('I built it and it matches.'), 'I built it and it matches.');
  });
});

describe('shortenReportHashes', () => {
  test('hashes show 8 characters and copy in full; the author becomes a name slot', () => {
    const html = shortenReportHashes(marked.parse(tidyBuildServerReport(REPORT)));
    assert.ok(html.includes(`<code class="js-copy-hash report-hash" data-hash="${HASH}" title="Copy hash" role="button">748c84c0…</code>`));
    assert.ok(html.includes(`data-hash="${BASED_ON}" title="Copy hash" role="button">6dbdacbe…</code> by <span class="report-author" data-pubkey="${VERIFIER}">1f9e547c…</span>`));
    assert.ok(!html.includes(`<code>${VERIFIER}</code>`));
  });

  test('code that is not a hash stays as it is', () => {
    assert.equal(shortenReportHashes('<code>abc</code>'), '<code>abc</code>');
  });
});

describe('fillReportAuthors', () => {
  test('writes the resolved name as text', async () => {
    const root = document.createElement('div');
    root.innerHTML = shortenReportHashes(marked.parse(tidyBuildServerReport(REPORT)));
    await fillReportAuthors(root, async pubkey => (pubkey === VERIFIER ? 'Danny <b>' : null));
    assert.equal(root.querySelector('.report-author').textContent, 'Danny <b>');
    assert.equal(root.querySelector('.report-author b'), null);
  });
});
