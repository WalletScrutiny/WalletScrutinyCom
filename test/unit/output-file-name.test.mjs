import './setup.mjs';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { buildBuildLogButtonHtml, buildOutputFileDownloadHtml, shortenOutputFileName } from '../../src/assets-table-modal.mjs';

const HASH = '748c84c0ff5457b9b6a426a456984f0efbe78fb926f1b86d4e6c1ea146f74318';

describe('output file names', () => {
  test('a 64-character token between underscores keeps its first and last 3 characters', () => {
    assert.equal(shortenOutputFileName(`app.zeusln.zeus_0.12.0_${HASH}_downloaded.apk`), 'app.zeusln.zeus_0.12.0_748...318_downloaded.apk');
  });

  test('a token not surrounded by underscores, or of another length, stays as it is', () => {
    for (const name of [`${HASH}_script.sh`, `app_${HASH}.apk`, `app_${HASH.slice(1)}_script.sh`, `app_${HASH}0_script.sh`]) {
      assert.equal(shortenOutputFileName(name), name);
    }
  });

  test('the full name stays in the tooltip and the download', () => {
    const name = `app_${HASH}_script.sh`;
    const li = document.createElement('ul');
    li.innerHTML = buildOutputFileDownloadHtml(name, HASH);
    assert.equal(li.querySelector('.verification-modal-file__name').textContent, 'app_748...318_script.sh');
    assert.equal(li.querySelector('.verification-modal-file__name').title, name);
    assert.equal(li.querySelector('button').dataset.fileName, name);
  });

  test('a recording carries its build log button beside the download', () => {
    const name = `app_${HASH}_script.cast`;
    const ul = document.createElement('ul');
    ul.innerHTML = buildOutputFileDownloadHtml(name, HASH, buildBuildLogButtonHtml(HASH, name, 'ZEUS 13.0.1'));
    const button = ul.querySelector('li .verification-modal-file__log button.js-open-build-log');
    assert.equal(button.dataset.castHash, HASH);
    assert.equal(button.dataset.logFile, name);
    ul.innerHTML = buildOutputFileDownloadHtml('zeus_build.sh', HASH);
    assert.equal(ul.querySelector('.js-open-build-log'), null);
  });

  test('a lone recording drops its name and puts the build log button before the download', () => {
    const name = `app_${HASH}_script.cast`;
    const ul = document.createElement('ul');
    ul.innerHTML = buildOutputFileDownloadHtml(name, HASH, buildBuildLogButtonHtml(HASH, name, 'ZEUS 13.0.1'), { nameHidden: true });
    assert.equal(ul.querySelector('.verification-modal-file__name'), null);
    const buttons = [...ul.querySelectorAll('li button')];
    assert.deepEqual(buttons.map(button => button.classList.contains('js-open-build-log')), [true, false]);
    assert.equal(buttons[1].dataset.fileName, name);
    assert.equal(buttons[1].getAttribute('aria-label'), `Download ${name}`);
  });
});
