// Golden test: a whole export of a small fixed database, compared file by file
// with the saved copy in test/fixtures/golden-export/. A refactor that changes
// what the site reads fails here, even where no unit test looks.
//
// When a change to the export is intended, rewrite the saved copy and review
// its diff like code:
//   GOLDEN_UPDATE=1 node --test test/goldenExport.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase, saveDependencies, saveVulnerabilities, recordAnalysis, saveAppList, saveReproducibleVersions, saveVerifiedRef } from '../ddbbUtils.mjs';
import { exportAll } from '../export.mjs';

const GOLDEN = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures', 'golden-export');

const entry = (name, version, extra = {}) => ({ ecosystem: 'npm', lockfile: 'package-lock.json', name, version, resolved: `https://registry.npmjs.org/${name}/-/${name}-${version}.tgz`, integrity: `sha512-${name}${version}`, direct: true, dev: false, tier: 'hash-pinned', ...extra });

// Two repositories. org/app: an Android and an iPhone listing, three analysed
// releases, two of them reproduced (one under two typed names, one on both
// listings), one never reproduced. org/fw: one hardware listing, nothing
// reproduced, so it is not exported.
function fixture() {
  const db = initDatabase(':memory:');
  saveAppList(db, [
    { appId: 'app.android', platform: 'android', repository: 'https://github.com/org/app' },
    { appId: 'app.ios', platform: 'iphone', repository: 'https://github.com/org/app' },
    { appId: 'fw.device', platform: 'hardware', repository: 'https://github.com/org/fw' },
  ]);
  saveDependencies(db, 'app.android', 'v1.0.0', [{ ecosystem: 'npm', entries: [entry('a', '1.0.0'), entry('b', '2.0.0', { direct: false, dev: true, scope: 'tests' })] }]);
  saveDependencies(db, 'app.android', 'v1.1.0', [{ ecosystem: 'npm', entries: [entry('a', '1.0.1'), entry('c', '3.0.0', { tier: 'floating', dev: null })] }]);
  saveDependencies(db, 'app.android', 'v1.2.0-rc1', [{ ecosystem: 'npm', entries: [entry('a', '1.0.2')] }]);
  saveDependencies(db, 'fw.device', 'v9', [{ ecosystem: 'npm', entries: [entry('a', '1.0.1'), entry('z', '1.0.0')] }]);
  saveVulnerabilities(db, 'app.android', 'v1.1.0', { findings: [
    { ecosystem: 'npm', name: 'a', version: '1.0.1', id: 'GHSA-aaaa', aliases: ['CVE-2026-1'], severity: 'high', summary: 'bad', fixed: ['1.0.2'], direct: true, dev: false },
  ] });
  const release = (appId, ref, commit, extra = {}) => recordAnalysis(db, { appId, kind: 'release', ref, commit, status: 'ok', appType: 'npm', analyser: 't', plugins: ['pinning', 'osv'], lockfiles: ['package-lock.json'], dependencies: 2, osvChecked: 2, osvSkipped: {}, vulnerabilities: 0, ...extra });
  release('app.android', 'v1.0.0', 'c1');
  release('app.android', 'v1.1.0', 'c2', { osvChecked: 1, osvSkipped: { floating: 1 }, vulnerabilities: 1 });
  release('app.android', 'v1.2.0-rc1', 'c3');
  release('fw.device', 'v9', 'c9');
  db.prepare("UPDATE analyses SET analysed_at = '2026-10-01 00:00:00'").run();
  saveReproducibleVersions(db, new Map([
    ['app.android', [{ version: '1.1.0-btc', verifiedAt: 3, platform: 'Android (arm64-v8a)' }, { version: '1.1.0 - Btc', verifiedAt: 2, platform: 'android' }, { version: '1.0.0', verifiedAt: 1, platform: 'android' }]],
    ['app.ios', [{ version: '1.0.0', verifiedAt: 1, platform: 'iphone' }]],
  ]));
  saveVerifiedRef(db, 'app.android', 'v1.1.0', '1.1.0-btc');
  saveVerifiedRef(db, 'app.android', 'v1.1.0', '1.1.0 - Btc');
  saveVerifiedRef(db, 'app.android', 'v1.0.0', '1.0.0');
  return db;
}

const walk = (dir, base = dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory()
  ? walk(path.join(dir, e.name), base) : [path.relative(base, path.join(dir, e.name))]).sort();

// One line per JSON key, so a failure (and an update's diff) points at the field.
const pretty = (text, file) => (file.endsWith('.json') ? `${JSON.stringify(JSON.parse(text), null, 2)}\n` : text);

test('golden export: the whole export of a fixed database matches the saved files', () => {
  const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sa-golden-')), 'export');
  exportAll(fixture(), out, { onlyReproducible: true });
  const files = walk(out);
  if (process.env.GOLDEN_UPDATE) {
    fs.rmSync(GOLDEN, { recursive: true, force: true });
    for (const f of files) {
      fs.mkdirSync(path.dirname(path.join(GOLDEN, f)), { recursive: true });
      fs.writeFileSync(path.join(GOLDEN, f), pretty(fs.readFileSync(path.join(out, f), 'utf8'), f));
    }
  }
  assert.deepEqual(files, walk(GOLDEN), 'the same files (GOLDEN_UPDATE=1 rewrites them when the change is intended)');
  for (const f of files) {
    assert.equal(pretty(fs.readFileSync(path.join(out, f), 'utf8'), f), fs.readFileSync(path.join(GOLDEN, f), 'utf8'), `${f} differs from the saved copy`);
  }
});
