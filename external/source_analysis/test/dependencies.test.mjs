// Per-dependency rows from lockfiles (Test 7) and their SQLite storage.
// Fixtures are written to a temp dir; nothing is cloned or installed.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { analyzePinning } from '../plugins/pinning.mjs';
import { initDatabase, saveDependencies, getDependencies, diffDependencies, findAppsShipping } from '../ddbbUtils.mjs';

function fixture(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pinning-'));
  for (const [name, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
    fs.writeFileSync(path.join(dir, name), content);
  }
  return dir;
}

const quiet = (fn) => {
  const log = console.log;
  console.log = () => {};
  try { return fn(); } finally { console.log = log; }
};

const byName = (entries, name) => entries.find(e => e.name === name);

test('npm package-lock v3: direct/transitive/dev flags and integrity', () => {
  const dir = fixture({
    'package.json': JSON.stringify({ dependencies: { a: '^1.0.0' }, devDependencies: { t: '^2.0.0' } }),
    'package-lock.json': JSON.stringify({
      lockfileVersion: 3,
      packages: {
        '': { dependencies: { a: '^1.0.0' }, devDependencies: { t: '^2.0.0' } },
        'node_modules/a': { version: '1.2.3', resolved: 'https://registry.npmjs.org/a/-/a-1.2.3.tgz', integrity: 'sha512-AAA' },
        'node_modules/b': { version: '0.1.0', resolved: 'https://registry.npmjs.org/b/-/b-0.1.0.tgz', integrity: 'sha512-BBB' },
        'node_modules/t': { version: '2.0.0', resolved: 'https://registry.npmjs.org/t/-/t-2.0.0.tgz', dev: true },
        'node_modules/b/node_modules/a': { version: '0.5.0', resolved: 'https://registry.npmjs.org/a/-/a-0.5.0.tgz', integrity: 'sha512-A0' },
      },
    }),
  });
  const [npm] = quiet(() => analyzePinning(dir));
  assert.equal(npm.entries.length, 4);
  assert.equal(npm.entries.find(e => e.name === 'a' && e.version === '0.5.0').direct, false, 'nested copy is transitive');
  assert.deepEqual(byName(npm.entries, 'a'), {
    ecosystem: 'npm', lockfile: 'package-lock.json', name: 'a', version: '1.2.3',
    resolved: 'https://registry.npmjs.org/a/-/a-1.2.3.tgz', integrity: 'sha512-AAA',
    direct: true, dev: false, tier: 'hash-pinned',
  });
  assert.equal(byName(npm.entries, 'b').direct, false);
  assert.equal(byName(npm.entries, 't').dev, true);
  assert.equal(byName(npm.entries, 't').tier, 'version-pinned');
  assert.equal(npm.deps.hashPinned, 3);
});

test('yarn.lock classic and berry', () => {
  const dir = fixture({
    'package.json': JSON.stringify({ dependencies: { '@scope/x': '^1.0.0' } }),
    'yarn.lock': [
      '# yarn lockfile v1', '',
      '"@scope/x@^1.0.0", "@scope/x@^1.1.0":',
      '  version "1.1.2"',
      '  resolved "https://registry.yarnpkg.com/@scope/x/-/x-1.1.2.tgz#abc"',
      '  integrity sha512-XXX', '',
      'y@~3.0.0:',
      '  version "3.0.4"',
      '  resolved "https://registry.yarnpkg.com/y/-/y-3.0.4.tgz#def"', '',
      '"@scope/x@^0.9.0":',
      '  version "0.9.9"',
      '  resolved "https://registry.yarnpkg.com/@scope/x/-/x-0.9.9.tgz#old"',
      '  integrity sha512-OLD', '',
    ].join('\n'),
    'sub/yarn.lock': [
      '__metadata:', '  version: 8', '',
      '"z@npm:^2.0.0":', '  version: 2.5.0', '  resolution: "z@npm:2.5.0"', '  checksum: 10c0/deadbeef', '  languageName: node', '',
    ].join('\n'),
  });
  const [npm] = quiet(() => analyzePinning(dir));
  assert.equal(npm.entries.length, 4);
  const x = byName(npm.entries, '@scope/x');
  assert.equal(x.version, '1.1.2');
  assert.equal(x.direct, true);
  const old = npm.entries.find(e => e.name === '@scope/x' && e.version === '0.9.9');
  assert.equal(old.direct, false, 'a second resolution of a declared name, asked for by a dependency, is transitive');
  assert.equal(x.tier, 'hash-pinned');
  assert.equal(byName(npm.entries, 'y').tier, 'version-pinned');
  assert.equal(byName(npm.entries, 'y').dev, null);
  const z = byName(npm.entries, 'z');
  assert.equal(z.lockfile, 'sub/yarn.lock');
  assert.equal(z.integrity, '10c0/deadbeef');
  assert.equal(z.version, '2.5.0');
});

test('pip requirements: exact, hashed, floating and git lines', () => {
  const dir = fixture({
    'requirements.txt': [
      'requests==2.31.0 --hash=sha256:aaa \\', '    --hash=sha256:bbb',
      'urllib3==1.26.5', 'flask>=2.0', 'git+https://github.com/o/r@0123456789abcdef#egg=lib',
    ].join('\n'),
  });
  const [pip] = quiet(() => analyzePinning(dir));
  assert.equal(pip.entries.length, 4);
  assert.equal(byName(pip.entries, 'requests').integrity, 'sha256:aaa sha256:bbb');
  assert.equal(byName(pip.entries, 'requests').tier, 'hash-pinned');
  assert.equal(byName(pip.entries, 'urllib3').version, '1.26.5');
  assert.equal(byName(pip.entries, 'flask').tier, 'floating');
  assert.equal(byName(pip.entries, 'flask').version, '>=2.0');
  assert.equal(byName(pip.entries, 'lib').tier, 'source-ref-pinned');
});

test('gradle: verification metadata replaces covered declarations', () => {
  const dir = fixture({
    'build.gradle': 'dependencies { implementation "org.a:lib:1.0"; implementation "org.b:only-declared:2.0"; implementation "org.c:range:1.+" }\nrepositories { mavenCentral() }',
    'gradle/verification-metadata.xml': [
      '<verification-metadata><components>',
      '<component group="org.a" name="lib" version="1.0"><artifact name="lib-1.0.jar"><sha256 value="ABCD"/></artifact></component>',
      '<component group="org.t" name="transitive" version="0.9"><artifact name="t.jar"><sha256 value="EEEE"/></artifact></component>',
      '</components></verification-metadata>',
    ].join('\n'),
  });
  const [gradle] = quiet(() => analyzePinning(dir));
  const names = gradle.entries.map(e => e.name).sort();
  assert.deepEqual(names, ['org.a:lib', 'org.b:only-declared', 'org.c:range', 'org.t:transitive']);
  const lib = byName(gradle.entries, 'org.a:lib');
  assert.equal(lib.lockfile, 'gradle/verification-metadata.xml');
  assert.equal(lib.integrity, 'sha256:abcd');
  assert.equal(lib.direct, true);
  assert.equal(byName(gradle.entries, 'org.t:transitive').direct, false);
  assert.equal(byName(gradle.entries, 'org.b:only-declared').lockfile, 'build.gradle');
  assert.equal(byName(gradle.entries, 'org.c:range').tier, 'floating');
});

test('cargo: workspace crates are skipped, their dependencies are direct', () => {
  const dir = fixture({
    'Cargo.lock': [
      '[[package]]', 'name = "app"', 'version = "0.1.0"', 'dependencies = [', ' "serde",', ' "gitdep",', ']', '',
      '[[package]]', 'name = "serde"', 'version = "1.0.1"', 'source = "registry+https://github.com/rust-lang/crates.io-index"',
      'checksum = "abc"', 'dependencies = [', ' "serde_derive 1.0.1",', ']', '',
      '[[package]]', 'name = "serde_derive"', 'version = "1.0.1"', 'source = "registry+https://github.com/rust-lang/crates.io-index"', 'checksum = "def"', '',
      '[[package]]', 'name = "gitdep"', 'version = "0.3.0"', 'source = "git+https://github.com/o/r?rev=abc#abc123"', '',
    ].join('\n'),
  });
  const [cargo] = quiet(() => analyzePinning(dir));
  assert.equal(cargo.deps.total, 4);
  assert.equal(cargo.entries.length, 3);
  assert.equal(byName(cargo.entries, 'serde').direct, true);
  assert.equal(byName(cargo.entries, 'serde').integrity, 'sha256:abc');
  assert.equal(byName(cargo.entries, 'serde_derive').direct, false);
  assert.equal(byName(cargo.entries, 'gitdep').tier, 'source-ref-pinned');
});

test('database: store, re-store, diff and ships lookup', () => {
  const db = initDatabase(':memory:');
  const v1 = [{ ecosystem: 'npm', entries: [
    { ecosystem: 'npm', lockfile: 'package-lock.json', name: 'a', version: '1.0.0', resolved: 'r/a-1.0.0', integrity: 'sha512-A1', direct: true, dev: false, tier: 'hash-pinned' },
    { ecosystem: 'npm', lockfile: 'package-lock.json', name: 'b', version: '2.0.0', resolved: 'r/b-2.0.0', integrity: 'sha512-B', direct: false, dev: null, tier: 'hash-pinned' },
    { ecosystem: 'npm', lockfile: 'package-lock.json', name: 'gone', version: '0.1.0', resolved: '', integrity: '', direct: false, dev: true, tier: 'version-pinned' },
  ] }];
  const v2 = [{ ecosystem: 'npm', entries: [
    { ecosystem: 'npm', lockfile: 'package-lock.json', name: 'a', version: '1.0.0', resolved: 'r/a-1.0.0', integrity: 'sha512-A2', direct: true, dev: false, tier: 'hash-pinned' },
    { ecosystem: 'npm', lockfile: 'package-lock.json', name: 'b', version: '2.1.0', resolved: 'r/b-2.1.0', integrity: 'sha512-B2', direct: false, dev: null, tier: 'hash-pinned' },
    { ecosystem: 'npm', lockfile: 'package-lock.json', name: 'new', version: '9.9.9', resolved: '', integrity: '', direct: true, dev: false, tier: 'version-pinned' },
  ] }];
  assert.equal(saveDependencies(db, 'app', 'v1', v1), 3);
  assert.equal(saveDependencies(db, 'app', 'v2', v2), 3);
  assert.equal(saveDependencies(db, 'app', 'v2', v2), 3, 're-storing the same version replaces, not duplicates');
  assert.equal(getDependencies(db, 'app', 'v2').length, 3);
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM packages').get().n, 6, 'a package is one row however many versions ship it');
  assert.deepEqual(getDependencies(db, 'app', 'v1').map(r => [r.name, r.direct, r.dev]), [['a', 1, 0], ['b', 0, null], ['gone', 0, 1]]);

  const delta = diffDependencies(db, 'app', 'v1', 'v2');
  assert.deepEqual(delta.added.map(r => r.name), ['new']);
  assert.deepEqual(delta.removed.map(r => r.name), ['gone']);
  assert.deepEqual(delta.changed.map(r => [r.name, r.from, r.to, r.integrityChangedAtSameVersion]),
    [['a', ['1.0.0'], ['1.0.0'], ['1.0.0']], ['b', ['2.0.0'], ['2.1.0'], []]]);

  assert.deepEqual(findAppsShipping(db, 'npm', 'b').map(r => `${r.version}:${r.dep_version}`), ['v1:2.0.0', 'v2:2.1.0']);
  assert.deepEqual(findAppsShipping(db, 'npm', 'b', '2.1.0').map(r => r.version), ['v2']);
  assert.equal(findAppsShipping(db, 'npm', 'nope').length, 0);
  db.close();
});
