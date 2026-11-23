import './setup.mjs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { ownVulnerabilitiesElement, renderOwnVulnerabilities } from '../../src/own-vulnerabilities.mjs';
import { ownVulnerabilitiesModel } from '../../src/own-vulnerabilities-model.mjs';

const adv = (id, severity, versions, extra = {}) => ({ id, severity, aliases: [], summary: `${id} summary`, published: '2026-10-27', fixed: [], versions, ...extra });
const app = {
  appId: 'org.electrum.electrum',
  releases: [],
  ownAdvisories: { repository: 'https://github.com/spesmilo/electrum', advisories: [
    adv('CVE-2026-117601', 'critical', ['4.8.2'], { fixed: ['4.8.3'] }),
    adv('CVE-2026-117602', 'high', ['4.7.1'], { fixed: ['4.7.2'] }),
  ] },
};

test('the step: hits of the reviewed version on top, the rest folded', () => {
  const node = ownVulnerabilitiesElement(ownVulnerabilitiesModel(app, '4.8.2'));
  assert.match(node.querySelector('.ov-lead').textContent, /1 published vulnerability affects 4\.8\.2/);
  const [hits, others] = node.querySelectorAll('table');
  assert.match(hits.textContent, /CVE-2026-117601.*Critical.*4\.8\.3/);
  assert.match(others.textContent, /CVE-2026-117602/);
  assert.equal(node.querySelector('details').hasAttribute('open'), false, 'folded while the reviewed version is hit');
});

test('renderOwnVulnerabilities: the step stays hidden without a lookup, or when the reviewed version is clean', async () => {
  document.body.innerHTML = '<div class="step own-vulnerabilities-step" hidden><div id="h" hidden></div></div>';
  const host = document.getElementById('h');
  const fetchImpl = async () => ({ ok: true, status: 200, json: async () => ({ appId: 'x', releases: [] }) });
  assert.equal(await renderOwnVulnerabilities({ host, appId: 'x', version: '1.0', base: '/x', fetchImpl }), null);
  assert.equal(document.querySelector('.own-vulnerabilities-step').hidden, true);
  const withOwn = async () => ({ ok: true, status: 200, json: async () => app });
  assert.equal(await renderOwnVulnerabilities({ host, appId: 'x', version: '4.8.3', base: '/x', fetchImpl: withOwn }), null);
  assert.equal(document.querySelector('.own-vulnerabilities-step').hidden, true, 'hidden although other versions are hit');
  await renderOwnVulnerabilities({ host, appId: 'x', version: '4.8.2', base: '/x', fetchImpl: withOwn });
  assert.equal(document.querySelector('.own-vulnerabilities-step').hidden, false);
});

test('renderOwnVulnerabilities: the newest reproduced version outranks an older page version', async () => {
  const page = () => {
    document.body.innerHTML = '<div class="step own-vulnerabilities-step" hidden><div id="h" hidden></div></div>';
    return document.getElementById('h');
  };
  const release = (ref, platform) => ({ ref, reproducedFor: [{ appId: 'y', platform, version: ref }] });
  const serve = releases => async () => ({ ok: true, status: 200, json: async () => ({ ...app, releases }) });
  // /y1, /y2, /y3: loadApp keeps one app file per URL
  assert.equal(await renderOwnVulnerabilities({ host: page(), appId: 'y', platform: 'android', version: '4.8.2', base: '/y1', fetchImpl: serve([release('4.8.4', 'android')]) }), null);
  assert.equal(document.querySelector('.own-vulnerabilities-step').hidden, true, 'the fixed release was reproduced');
  const other = await renderOwnVulnerabilities({ host: page(), appId: 'y', platform: 'android', version: '4.8.2', base: '/y2', fetchImpl: serve([release('4.8.4', 'desktop')]) });
  assert.equal(other.version, '4.8.2', 'reproduced for another platform only');
  const hit = await renderOwnVulnerabilities({ host: page(), appId: 'y', platform: 'android', version: '4.7.0', base: '/y3', fetchImpl: serve([release('4.8.2', 'android')]) });
  assert.equal(hit.version, '4.8.2');
  assert.match(document.querySelector('.ov-lead').textContent, /affects 4\.8\.2, the version reviewed here/);
});
