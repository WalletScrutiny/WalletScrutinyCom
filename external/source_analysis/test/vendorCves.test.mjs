// The vendors' own CVE records: reading their version ranges, and the store
// that keeps them. Nothing here talks to the network.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { vendorMatch, vendorAdvisory, vendorRecords } from '../vendorCves.mjs';
import { compareVersions, severityOf } from '../plugins/osv.mjs';

const CPYTHON = /^cpython$/i;
const OPENSSL = /^openssl$/i;
const QT = /^qt(?: framework)?$/i;
const range = (version, lessThan, extra = {}) => ({ version, lessThan, status: 'affected', versionType: 'python', ...extra });
const match = (record, product, version) => vendorMatch(record, product, version, compareVersions);

test('vendorMatch: the range of the shipped release line, with the fix on that line', () => {
  // CVE-2026-4224 as the PSF published it
  const record = { affected: [{ product: 'CPython', defaultStatus: 'unaffected', versions: [
    range('0', '3.10.21'), range('3.11.0', '3.11.16'), range('3.12.0', '3.12.14'), range('3.15.0a1', '3.15.0a8'),
  ] }] };
  assert.deepEqual(match(record, CPYTHON, '3.11.15'), { events: [{ introduced: '3.11.0' }, { fixed: '3.11.16' }], modules: [] });
  assert.equal(match(record, CPYTHON, '3.11.16'), null, 'the fixed release');
  assert.deepEqual(match(record, CPYTHON, '3.10.14').events, [{ introduced: '0' }, { fixed: '3.10.21' }]);
  assert.equal(match(record, CPYTHON, '3.13.2'), null, 'a line the record does not name: default unaffected');
  assert.equal(match(record, OPENSSL, '3.11.15'), null, 'another product');
  assert.equal(match(null, CPYTHON, '3.11.15'), null);
});

test('vendorMatch: pre-release bounds are read for releases; OpenSSL letters are releases', () => {
  const python = { affected: [{ product: 'CPython', defaultStatus: 'unaffected', versions: [range('3.14.0a1', '3.14.5rc1'), range('3.15.0a1', '3.15.0b3')] }] };
  assert.deepEqual(match(python, CPYTHON, '3.14.0').events, [{ introduced: '3.14.0a1' }, { fixed: '3.14.5rc1' }], '3.14.0 came after 3.14.0a1');
  assert.ok(match(python, CPYTHON, '3.14.4'));
  assert.equal(match(python, CPYTHON, '3.14.5'), null, '3.14.5 came after 3.14.5rc1');
  assert.equal(match(python, CPYTHON, '3.15.0'), null, 'fixed during the 3.15 betas');
  const upTo = { affected: [{ product: 'CPython', versions: [{ version: '3.15.0a1', lessThanOrEqual: '3.15.0rc2', status: 'affected' }] }] };
  assert.equal(match(upTo, CPYTHON, '3.15.0'), null, 'up to a release candidate is before the release');
  // CVE-2024-9143
  const openssl = { affected: [{ product: 'OpenSSL', defaultStatus: 'unaffected', versions: [range('3.0.0', '3.0.16', { versionType: 'semver' }), range('1.1.1', '1.1.1zb', { versionType: 'custom' })] }] };
  assert.deepEqual(match(openssl, OPENSSL, '1.1.1w').events, [{ introduced: '1.1.1' }, { fixed: '1.1.1zb' }]);
  assert.equal(match(openssl, OPENSSL, '1.1.1zb'), null);
  assert.ok(match(openssl, OPENSSL, '3.0.15'));
});

test('vendorMatch: ranges written as prose, as commits or not at all say nothing', () => {
  const prose = { affected: [{ product: 'OpenSSL', versions: [{ status: 'affected', version: 'Fixed in OpenSSL 1.1.1c (Affected 1.1.1-1.1.1b)' }] }] };
  assert.equal(match(prose, OPENSSL, '1.1.1b'), null);
  assert.equal(match({ affected: [{ product: 'OpenSSL', versions: [{ version: 'n/a', status: 'affected' }] }] }, OPENSSL, '3.0.7'), null);
  const commits = { affected: [{ product: 'OpenSSL', versions: [{ version: '0', lessThan: 'e04bd3433fd84e1861bf258ea37928d9845e6a86', status: 'affected', versionType: 'git' }] }] };
  assert.equal(match(commits, OPENSSL, '3.0.7'), null);
  assert.equal(match({ affected: [{ product: 'OpenSSL' }] }, OPENSSL, '3.0.7'), null, 'no default status: unknown');
  assert.deepEqual(match({ affected: [{ product: 'OpenSSL', defaultStatus: 'affected' }] }, OPENSSL, '3.0.7'), { events: [{ introduced: '0' }], modules: [] }, 'affected unless said otherwise');
  const exact = { affected: [{ product: 'OpenSSL', versions: [{ version: '3.0.7', status: 'affected' }] }] };
  assert.deepEqual(match(exact, OPENSSL, '3.0.7').events, [{ introduced: '3.0.7' }, { last_affected: '3.0.7' }]);
  assert.equal(match(exact, OPENSSL, '3.0.8'), null);
  // a record that does not follow the schema is not read, and does not throw
  for (const affected of [[null], [{ product: 'OpenSSL', defaultStatus: 'unaffected', versions: [null, 'x'] }], [{ product: 'OpenSSL', versions: {} }], 'x']) {
    assert.equal(match({ affected }, OPENSSL, '3.0.7'), null);
  }
  const nulls = { affected: [{ product: 'OpenSSL', versions: [{ version: '3.0.0', lessThan: null, lessThanOrEqual: '3.0.7', status: 'affected' }] }] };
  assert.deepEqual(match(nulls, OPENSSL, '3.0.7').events, [{ introduced: '3.0.0' }, { last_affected: '3.0.7' }], 'a null lessThan is none');
});

test('vendorMatch: Qt names its modules, and its other products are not Qt', () => {
  // CVE-2026-9499 and CVE-2026-107472 as the Qt Group published them
  const record = { affected: [
    { vendor: 'Qt', product: 'Qt', modules: ['Qt5Compat (Core5Compat)'], defaultStatus: 'unaffected', versions: [range('6.0.0', '6.8.8'), range('6.9.0', '6.11.1')] },
    { vendor: 'Qt', product: 'Qt', modules: ['qtbase'], defaultStatus: 'unaffected', versions: [range('4.0.0', '6.0.0')] },
  ] };
  assert.deepEqual(match(record, QT, '6.10.2'), { events: [{ introduced: '6.9.0' }, { fixed: '6.11.1' }], modules: ['Qt5Compat (Core5Compat)'] });
  assert.deepEqual(match(record, QT, '5.15.2').modules, ['qtbase']);
  assert.equal(match(record, QT, '6.8.8'), null);
  const upTo = { affected: [{ product: 'Qt Framework', modules: ['qt5compat', 'qtbase'], defaultStatus: 'unaffected', versions: [
    { status: 'affected', version: '4.0.0', lessThanOrEqual: '6.8.8' }, { status: 'affected', version: '6.9.0', lessThanOrEqual: '6.11.2' }, { status: 'unaffected', version: '0', lessThan: '4.0.0' },
  ] }] };
  assert.deepEqual(match(upTo, QT, '6.11.2'), { events: [{ introduced: '6.9.0' }, { last_affected: '6.11.2' }], modules: ['qt5compat', 'qtbase'] });
  assert.equal(match(upTo, QT, '6.11.3'), null);
  assert.equal(match(upTo, QT, '3.3.8'), null, 'listed as unaffected');
  assert.equal(match({ affected: [{ product: 'Qt for MCUs', defaultStatus: 'affected' }] }, QT, '6.10.2'), null);
});

test('vendorAdvisory: an OSV-style record with the vendor\'s rating and the modules in the summary', () => {
  const q = { ecosystem: 'native', name: 'qt6', version: '6.10.2' };
  const hit = { events: [{ introduced: '6.9.0' }, { fixed: '6.11.1' }], modules: ['qtbase', 'qtsvg'] };
  const advisory = vendorAdvisory('CVE-2026-1', { title: 'Heap overflow in QTextDocument', description: 'Long text.', metrics: [{ cvssV4_0: { baseSeverity: 'MEDIUM' } }] }, hit, q);
  assert.equal(advisory.summary, 'qtbase, qtsvg: Heap overflow in QTextDocument');
  assert.equal(severityOf(advisory), 'moderate', 'a CVSS 4.0 rating is taken as the vendor wrote it');
  assert.deepEqual(advisory.affected, [{ package: { ecosystem: 'native', name: 'qt6' }, ranges: [{ type: 'ECOSYSTEM', events: hit.events }] }]);
  const plain = { ...hit, modules: [] };
  const openssl = vendorAdvisory('CVE-2026-2', { title: '', description: 'First line.\nSecond.', metrics: [
    { format: 'other', other: { content: { text: 'Low' }, type: 'https://openssl-library.org/policies/general/security-policy/' } },
    { cvssV3_1: { vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H' } }, // added by CISA
  ] }, plain, q);
  assert.equal(openssl.summary, 'First line.');
  assert.equal(severityOf(openssl), 'low', 'the vendor\'s own rating comes first');
  const scored = vendorAdvisory('CVE-2026-3', { title: 't', metrics: [{ cvssV3_1: { vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H' } }] }, plain, q);
  assert.equal(severityOf(scored), 'critical');
  assert.equal(severityOf(vendorAdvisory('CVE-2026-4', { title: 't', metrics: [] }, plain, q)), 'unknown');
});

const log = console.log;
const cveRecord = (product, versions, extra = {}) => ({ containers: { cna: { title: 'a title', descriptions: [{ lang: 'en', value: 'a description' }], affected: [{ product, defaultStatus: 'unaffected', versions }], ...extra } } });

test('vendorRecords: a record is fetched once, again when NVD\'s lastModified moves, and kept on disk', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cve-records-'));
  const fetched = [];
  const fetchRecord = async (id) => { fetched.push(id); return id === 'CVE-GONE' ? null : cveRecord('CPython', [range('0', '3.10.21')], { metrics: [{ cvssV4_0: { baseSeverity: 'HIGH' } }] }); };
  const listed = [{ id: 'CVE-1', lastModified: 'a' }, { id: 'CVE-2', lastModified: 'a' }, { id: 'CVE-GONE', lastModified: 'a' }];
  const first = await vendorRecords('cna@python.org', listed, { dir, fetchRecord });
  assert.deepEqual([...first.keys()], ['CVE-1', 'CVE-2'], 'no record for a CVE the CVE Program does not have');
  assert.deepEqual(first.get('CVE-1'), { lastModified: 'a', title: 'a title', description: 'a description',
    affected: [{ product: 'CPython', defaultStatus: 'unaffected', versions: [range('0', '3.10.21')] }], metrics: [{ cvssV4_0: { baseSeverity: 'HIGH' } }] });
  assert.deepEqual(fetched.sort(), ['CVE-1', 'CVE-2', 'CVE-GONE']);
  assert.deepEqual(fs.readdirSync(dir), ['cna_python.org.json']);

  fetched.length = 0;
  const moved = [{ id: 'CVE-1', lastModified: 'a' }, { id: 'CVE-2', lastModified: 'b' }, { id: 'CVE-3', lastModified: 'a' }];
  const second = await vendorRecords('cna@python.org', moved, { dir, fetchRecord });
  assert.deepEqual(fetched.sort(), ['CVE-2', 'CVE-3'], 'only the changed and the new one');
  assert.deepEqual([...second.keys()], ['CVE-1', 'CVE-2', 'CVE-3']);
  assert.equal(second.get('CVE-2').lastModified, 'b');

  // without a directory nothing is kept
  fetched.length = 0;
  await vendorRecords('cna@python.org', listed, { dir: null, fetchRecord });
  assert.equal(fetched.length, 3);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('vendorRecords: an unreachable CVE Program answers from the stored copy, and fails when a record was never read', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cve-records-'));
  const ok = async () => cveRecord('OpenSSL', [range('3.0.0', '3.0.16')]);
  await vendorRecords('openssl', [{ id: 'CVE-1', lastModified: 'a' }], { dir, fetchRecord: ok });
  const down = async (id) => { if (id === 'CVE-2') return ok(); throw new Error('HTTP 503'); };
  const stale = await vendorRecords('openssl', [{ id: 'CVE-1', lastModified: 'b' }], { dir, fetchRecord: down });
  assert.equal(stale.get('CVE-1').lastModified, 'a', 'the stored copy, to be asked for again');
  await assert.rejects(vendorRecords('openssl', [{ id: 'CVE-1', lastModified: 'b' }, { id: 'CVE-2', lastModified: 'a' }, { id: 'CVE-3', lastModified: 'a' }], { dir, fetchRecord: down }), /HTTP 503/);
  const fetched = [];
  const back = async (id) => { fetched.push(id); return ok(); };
  const all = await vendorRecords('openssl', [{ id: 'CVE-1', lastModified: 'b' }, { id: 'CVE-2', lastModified: 'a' }, { id: 'CVE-3', lastModified: 'a' }], { dir, fetchRecord: back });
  assert.deepEqual(fetched.sort(), ['CVE-1', 'CVE-3'], 'what was read during the outage is not asked for again');
  assert.equal(all.size, 3);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('vendorRecords: an answer with nothing in it is not "no advisories", and leaves the store alone', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cve-records-'));
  const ok = async () => cveRecord('OpenSSL', [range('3.0.0', '3.0.16')]);
  await vendorRecords('openssl', [{ id: 'CVE-1', lastModified: 'a' }], { dir, fetchRecord: ok });
  const before = fs.readFileSync(path.join(dir, 'openssl.json'), 'utf8');
  assert.equal((await vendorRecords('openssl', [], { dir, fetchRecord: ok })).size, 0, 'an empty list reads nothing');
  await assert.rejects(vendorRecords('openssl', [{ id: 'CVE-1', lastModified: 'b' }, { id: 'CVE-2', lastModified: 'a' }], { dir: null, fetchRecord: async () => null }), /no record for any of the 2 CVEs/);
  await assert.rejects(vendorRecords('openssl', [{ id: 'CVE-2', lastModified: 'a' }], { dir, fetchRecord: async () => ({ message: 'rate limited' }) }), /not a CVE record/);
  const stale = await vendorRecords('openssl', [{ id: 'CVE-1', lastModified: 'b' }], { dir, fetchRecord: async () => ({ error: 'x' }) });
  assert.equal(stale.get('CVE-1').lastModified, 'a', 'an answer that is no record: the stored copy');
  assert.equal(fs.readFileSync(path.join(dir, 'openssl.json'), 'utf8'), before);
  // the store only saves requests: a directory that cannot be written costs no records
  const blocked = path.join(dir, 'openssl.json', 'below-a-file');
  console.log = () => {};
  try {
    assert.equal((await vendorRecords('openssl', [{ id: 'CVE-1', lastModified: 'a' }], { dir: blocked, fetchRecord: ok })).size, 1);
  } finally {
    console.log = log;
  }
  fs.rmSync(dir, { recursive: true, force: true });
});
