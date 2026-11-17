import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { marked } from 'marked';

import { fillReportAuthors, rewriteLegacyReport, shortenReportHashes, tidyBuildServerReport } from '../../src/build-server-report.mjs';

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
  test('the script facts come under the verdict; the notes stay in Other information', () => {
    assert.equal(tidyBuildServerReport(REPORT), [
      '**Reproducible.** We built version 2026.11.2 (1) from its public source code and got the same app users download.',
      '',
      'Script version: v0.2.31',
      '',
      `Build script taken from verification \`${BASED_ON}\` by \`${VERIFIER}\``,
      '',
      '<details>',
      '<summary>Other information</summary>',
      '',
      'Bitkey verification reported identical builds.',
      '',
      '</details>',
      '',
    ].join('\n'));
  });

  test('drops the list of official files too', () => {
    const many = REPORT.replace(`**Official app (SHA-256):** \`${HASH}\``, `**Official files (SHA-256):**\n- \`${HASH}\`\n- \`${BASED_ON}\``);
    const tidy = tidyBuildServerReport(many);
    assert.ok(!tidy.includes('Official'));
    assert.ok(tidy.includes('download.\n\nScript version: v0.2.31\n'));
  });

  test('with nothing else there is no Other information', () => {
    const noNotes = REPORT.replace(/\n\*\*Notes from the script\*\*\n\nBitkey verification reported identical builds.\n/, '');
    assert.ok(tidyBuildServerReport(noNotes).endsWith(`download.\n\nScript version: v0.2.31\n\nBuild script taken from verification \`${BASED_ON}\` by \`${VERIFIER}\`\n`));
  });

  test('the notes keep their title next to a version-override note', () => {
    const note = '- The asset registration listed version 0.9; the APK versionName is 1.';
    const tidy = tidyBuildServerReport(REPORT.replace('- Command:', `${note}\n- Command:`));
    assert.ok(tidy.includes(`${note}\n\n**Notes from the script**\n\nBitkey verification`));
  });

  test('the version-override note stays in Other information', () => {
    const note = '- The asset registration listed version 0.9; the APK versionName is 1.';
    const withNote = REPORT
      .replace('- Command:', `${note}\n- Command:`)
      .replace(/\n\*\*Notes from the script\*\*\n\nBitkey verification reported identical builds.\n/, '');
    assert.ok(tidyBuildServerReport(withNote).endsWith(`\`${VERIFIER}\`\n\n<details>\n<summary>Other information</summary>\n\n${note}\n\n</details>\n`));
  });

  test('other reports are left alone', () => {
    const mine = '<details>\n<summary>Other information</summary>\n\nI ran - Command: x myself.\n\n</details>';
    assert.equal(tidyBuildServerReport(mine), mine);
    assert.equal(tidyBuildServerReport('I built it and it matches.'), 'I built it and it matches.');
  });
});

describe('shortenReportHashes', () => {
  test('hashes show 8 characters and copy in full; the author becomes a name slot set off as code', () => {
    const html = shortenReportHashes(marked.parse(tidyBuildServerReport(REPORT)));
    assert.ok(shortenReportHashes(marked.parse(REPORT)).includes(`<code class="js-copy-hash report-hash" data-hash="${HASH}" title="Copy hash" role="button">748c84c0</code>`));
    assert.ok(html.includes(`data-hash="${BASED_ON}" title="Copy hash" role="button">6dbdacbe</code> by <code class="report-author" data-pubkey="${VERIFIER}">1f9e547c</code>`));
    assert.ok(!html.includes(`<code>${VERIFIER}</code>`));
    assert.ok(html.includes('<p class="report-fact">Script version: v0.2.31</p>'));
    assert.ok(html.includes('<p class="report-fact">Build script taken from verification <code'));
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

describe('rewriteLegacyReport', () => {
  const build = '/opt/build-server-builds/world.bitkey.app_748c84c0_2026.11.2__1_';
  /** A real Bitkey report (event db55fe1c), with its build dir shortened. */
  const bitkey = 'Automatic verification by WalletScrutiny Build Server for wallet version 2026.11.2 (1)  , ' +
    `based on verification ${BASED_ON} by ${VERIFIER}. ` +
    `The script was executed with these parameters: ${build}/world.bitkey.app_script.sh --binary ${build}/binary` +
    ' - Script version: v0.2.31. - Notes from the developer of the script: Bitkey verification reported identical builds.\n' +
    `Plain diff file: ${build}/bitkey_verification_auto_1790719480/comparison/diff-unzipped-apks.txt\n.`;
  const tags = [['status', 'reproducible'], ['x', HASH], ['x', 'not a hash']];

  test('an old report reads as the server writes it now (the same text as the app\'s AbsReport)', () => {
    assert.equal(rewriteLegacyReport(bitkey, tags), [
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
      'Bitkey verification reported identical builds.  ',
      'Plain diff file: bitkey\\_verification\\_auto\\_1790719480/comparison/diff-unzipped-apks.txt',
      '',
      '</details>',
      '',
    ].join('\n'));
  });

  test('then gets the same tidy as a current report', () => {
    const tidy = tidyBuildServerReport(rewriteLegacyReport(bitkey, tags));
    assert.ok(tidy.includes(`Script version: v0.2.31\n\nBuild script taken from verification \`${BASED_ON}\` by \`${VERIFIER}\`\n\n<details>\n<summary>Other information</summary>\n\nBitkey verification`));
    assert.ok(!tidy.includes('Command'));
  });

  test('architecture, type, an override note and an unknown verdict', () => {
    const report = 'Automatic verification by WalletScrutiny Build Server for wallet version 6.3.1  with architecture: x86_64-linux-gnu    type: tarball, ' +
      `based on verification ${'a'.repeat(64)} by ${VERIFIER}. The script was executed with these parameters: /opt/b/x/s.sh --binary /opt/b/x/binary` +
      ' The asset registration listed version 6.3.0; the APK versionName is 6.3.1. - Script version: v0.1.9.';
    const out = rewriteLegacyReport(report, [['status', 'warning']]);
    assert.ok(out.startsWith('<details>'));
    assert.ok(out.includes('- Command: `s.sh --binary binary`\n- The asset registration listed version 6.3.0; the APK versionName is 6.3.1.\n'));
    assert.ok(!out.includes('Notes from the script'));
  });

  test('other reports are left alone', () => {
    assert.equal(rewriteLegacyReport('I built it myself and it matches.', tags), null);
    assert.equal(rewriteLegacyReport(REPORT, tags), null);
  });
});
