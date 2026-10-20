import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { parseTriageFile, rawUrl, blobUrl, harvestRepo, harvestGithub, hintsByApp, TRIAGE_FILES } from '../upstreamTriage.mjs';
import { initDatabase, saveDependencies, saveVulnerabilities, recordAnalysis, saveAppList } from '../ddbbUtils.mjs';

const file = (path) => TRIAGE_FILES.find(f => f.path === path);

describe('upstream triage files', () => {
  test('.trivyignore: ids with the comment above as the reason; commented-out ids are not ignores', () => {
    const text = '# form-data via graphql-request: we never upload files\nGHSA-FJXV-7RQG-78G4\n\nCVE-2021-44906 # minimist, CLI only\n# CVE-2020-0001\n';
    assert.deepEqual(parseTriageFile(file('.trivyignore'), text), [
      { id: 'GHSA-fjxv-7rqg-78g4', line: 2, reason: 'form-data via graphql-request: we never upload files' },
      { id: 'CVE-2021-44906', line: 4, reason: 'minimist, CLI only' },
    ]);
  });

  test('.trivyignore.yaml and osv-scanner.toml: the entry\'s own statement or reason', () => {
    const yaml = 'vulnerabilities:\n  - id: GHSA-9pv7-vfvm-6vr7\n    paths:\n      - yarn.lock\n    statement: graphql 16.7.1 via @apollo, never parses untrusted queries\n  - id: CVE-2026-12345\n';
    assert.deepEqual(parseTriageFile(file('.trivyignore.yaml'), yaml), [
      { id: 'GHSA-9pv7-vfvm-6vr7', line: 2, reason: 'graphql 16.7.1 via @apollo, never parses untrusted queries' },
      { id: 'CVE-2026-12345', line: 6, reason: null },
    ]);
    const toml = '[[IgnoredVulns]]\nid = "GO-2022-0968"\nreason = "No ssh servers are connected to or hosted in Go lang"\n\n[[IgnoredVulns]]\nid = "GHSA-aaaa-bbbb-cccc"\nignoreUntil = 2026-01-01\n';
    assert.deepEqual(parseTriageFile(file('osv-scanner.toml'), toml), [
      { id: 'GO-2022-0968', line: 2, reason: 'No ssh servers are connected to or hosted in Go lang' },
      { id: 'GHSA-aaaa-bbbb-cccc', line: 6, reason: null },
    ]);
  });

  test('YAML block scalars: the folded statement is the reason, and an id written inside it is prose', () => {
    const yaml = 'vulnerabilities:\n  - id: CVE-2025-7783\n    statement: >-\n      form-data via graphql-request. Predictable\n      boundaries matter only for uploads.\n  - id: CVE-2026-12143\n    statement: >-\n      Same dead path as CVE-2025-7783.\n';
    assert.deepEqual(parseTriageFile(file('.trivyignore.yaml'), yaml), [
      { id: 'CVE-2025-7783', line: 2, reason: 'form-data via graphql-request. Predictable boundaries matter only for uploads.' },
      { id: 'CVE-2026-12143', line: 6, reason: 'Same dead path as CVE-2025-7783.' },
    ]);
  });

  test('deny.toml inline tables, and package.json only inside pnpm.auditConfig', () => {
    const deny = '[advisories]\nignore = [\n  { id = "RUSTSEC-2024-0436", reason = "paste is unmaintained, no fix needed" },\n  "RUSTSEC-2023-0071",\n]\n';
    assert.deepEqual(parseTriageFile(file('deny.toml'), deny).map(e => [e.id, e.reason]), [['RUSTSEC-2024-0436', 'paste is unmaintained, no fix needed'], ['RUSTSEC-2023-0071', null]]);
    const pkg = '{\n  "description": "fixes CVE-2020-1111",\n  "pnpm": {\n    "auditConfig": {\n      "ignoreCves": ["CVE-2022-25883"]\n    }\n  }\n}\n';
    assert.deepEqual(parseTriageFile(file('package.json'), pkg), [{ id: 'CVE-2022-25883', line: 5, reason: null }]);
    assert.deepEqual(parseTriageFile(file('package.json'), '{"description":"CVE-2020-1111"}'), [], 'no audit config, nothing');
  });

  test('raw and blob URLs for GitHub and GitLab; other hosts are not read', () => {
    assert.equal(rawUrl('https://github.com/airgap-it/airgap-vault', 'v3.35.0', '.trivyignore.yaml'), 'https://raw.githubusercontent.com/airgap-it/airgap-vault/v3.35.0/.trivyignore.yaml');
    assert.equal(rawUrl('https://gitlab.com/a/b/c.git', 'rel/1.0', 'deny.toml'), 'https://gitlab.com/a/b/c/-/raw/rel/1.0/deny.toml');
    assert.equal(rawUrl('https://bitbucket.org/a/b', 'v1', 'x'), null);
    assert.equal(blobUrl('https://github.com/a/b', 'v1', '.trivyignore', 7), 'https://github.com/a/b/blob/v1/.trivyignore#L7');
  });

  test('harvestRepo reads the files that exist and tells absence from failure', async () => {
    const files = { '/v1/.trivyignore': 'CVE-2021-44906\n', '/v1/package.json': '{"name":"x"}' };
    const fetchImpl = async (url) => {
      const path = new URL(url).pathname.replace('/a/b', '');
      if (files[path] === undefined) return { status: 404, ok: false };
      return { status: 200, ok: true, text: async () => files[path] };
    };
    const r = await harvestRepo('https://github.com/a/b', 'v1', { fetchImpl });
    assert.equal(r.status, 'ok');
    assert.deepEqual(r.files, [{ path: '.trivyignore', tool: 'trivy', entries: [{ id: 'CVE-2021-44906', line: 1, reason: null }] }], 'a package.json without audit config is not a triage file');
    const down = await harvestRepo('https://github.com/a/b', 'v1', { fetchImpl: async () => ({ status: 503, ok: false }) });
    assert.equal(down.status, 'error');
    assert.equal((await harvestRepo('https://example.org/a/b', 'v1', { fetchImpl })).status, 'unsupported-host');
  });

  test('harvestGithub reads many refs in one GraphQL query; a missing repository is no failure', async () => {
    const queries = [];
    const fetchImpl = async (url, opts) => {
      queries.push(JSON.parse(opts.body).query);
      const trivy = TRIAGE_FILES.findIndex(f => f.path === '.trivyignore');
      return { status: 200, ok: true, json: async () => ({ data: { r0: { [`f${trivy}`]: { text: 'CVE-2021-44906\n' } }, r1: null, r2: {} }, errors: [{ type: 'NOT_FOUND', path: ['r1'] }] }) };
    };
    const targets = [{ repo: 'https://github.com/a/b', ref: 'v1' }, { repo: 'https://github.com/gone/x', ref: 'v2' }, { repo: 'https://github.com/c/d', ref: 'abc123' }];
    const r = await harvestGithub(targets, { token: 't', fetchImpl });
    assert.equal(queries.length, 1);
    assert.match(queries[0], /r0: repository\(owner: "a", name: "b"\) \{ f0: object\(expression: "v1:.trivyignore"\)/);
    assert.deepEqual(r.get('https://github.com/a/b\0v1').files, [{ path: '.trivyignore', tool: 'trivy', entries: [{ id: 'CVE-2021-44906', line: 1, reason: null }] }]);
    assert.deepEqual([r.get('https://github.com/gone/x\0v2').status, r.get('https://github.com/c/d\0abc123').status], ['ok', 'ok']);
  });

  test('hintsByApp: the wallet\'s own file, and a direct user\'s file at the shipped version, for the rows they name', () => {
    const db = initDatabase(':memory:');
    saveAppList(db, [{ appId: 'w.one', platform: 'android', repository: 'https://github.com/w/one' }]);
    recordAnalysis(db, { appId: 'w.one', kind: 'release', ref: 'v1', commit: 'c', status: 'ok', appType: 'npm', analyser: 't' });
    const dep = (name, version, extra = {}) => ({ ecosystem: 'npm', lockfile: 'yarn.lock', name, version, resolved: '', integrity: '', direct: true, dev: false, tier: 'hash-pinned', ...extra });
    saveDependencies(db, 'w.one', 'v1', [{ ecosystem: 'npm', entries: [dep('alib', '2.0.0'), dep('blib', '1.0.0', { direct: false, dependants: ['alib'] }), dep('other', '1.0.0')] }]);
    const finding = (id, extra) => ({ ecosystem: 'npm', name: 'blib', version: '1.0.0', id, severity: 'high', aliases: [], fixed: [], summary: '', direct: false, dev: false, scope: 'app', dependants: ['alib'], ...extra });
    saveVulnerabilities(db, 'w.one', 'v1', { findings: [finding('GHSA-aaaa-bbbb-cccc', { aliases: ['CVE-2026-1111'] }), finding('GHSA-dddd-eeee-ffff')] });
    db.prepare("INSERT INTO package_sources (ecosystem, name, repo_url, source) VALUES ('npm', 'alib', 'https://github.com/a/alib', 'npm'), ('npm', 'other', 'https://github.com/o/other', 'npm')").run();
    db.prepare("INSERT INTO package_identity (ecosystem, name, version, status, tag) VALUES ('npm', 'alib', '2.0.0', 'tag-found', 'v2.0.0'), ('npm', 'other', '1.0.0', 'tag-found', 'v1.0.0')").run();
    const ins = db.prepare('INSERT INTO upstream_triage (repo_url, ref, file, tool, line, vuln_id, reason) VALUES (?, ?, ?, ?, ?, ?, ?)');
    ins.run('https://github.com/a/alib', 'v2.0.0', '.trivyignore', 'trivy', 3, 'CVE-2026-1111', 'we never call parse()');
    ins.run('https://github.com/o/other', 'v1.0.0', '.trivyignore', 'trivy', 1, 'GHSA-dddd-eeee-ffff', 'not via us');
    ins.run('https://github.com/w/one', 'v1', 'osv-scanner.toml', 'osv-scanner', 9, 'GHSA-dddd-eeee-ffff', 'our own call');
    const hints = hintsByApp(db);
    assert.deepEqual(Object.keys(hints), ['w.one']);
    assert.deepEqual(hints['w.one']['GHSA-aaaa-bbbb-cccc'], [{ kind: 'upstream', repo: 'https://github.com/a/alib', ref: 'v2.0.0', file: '.trivyignore', line: 3, url: 'https://github.com/a/alib/blob/v2.0.0/.trivyignore#L3', reason: 'we never call parse()', package: 'npm:alib@2.0.0' }], 'matched by alias, from the dependant');
    assert.deepEqual(hints['w.one']['GHSA-dddd-eeee-ffff'].map(h => [h.kind, h.reason]), [['own', 'our own call']], 'a direct user that is not this row\'s dependant says nothing about it');
  });
});
