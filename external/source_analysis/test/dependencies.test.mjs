// Per-dependency rows from lockfiles (Test 7) and their SQLite storage.
// Fixtures are written to a temp dir; nothing is cloned or installed.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { analyzePinning } from '../plugins/pinning.mjs';
import { initDatabase, saveDependencies, getDependencies, diffDependencies, findAppsShipping, dependantsOfRow } from '../ddbbUtils.mjs';

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
        'node_modules/b': { version: '0.1.0', resolved: 'https://registry.npmjs.org/b/-/b-0.1.0.tgz', integrity: 'sha512-BBB', dependencies: { a: '^0.5.0' } },
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
    direct: true, dev: false, scope: 'app', dependants: [], tier: 'hash-pinned',
  });
  assert.equal(byName(npm.entries, 'b').direct, false);
  // who requires whom, resolved like node does: b asks for a and gets its nested copy, not the top-level one
  assert.deepEqual(npm.entries.find(e => e.name === 'a' && e.version === '0.5.0').dependants, ['b']);
  assert.deepEqual(byName(npm.entries, 'b').dependants, [], 'nothing in the lock requires b; the manifest is not listed');
  assert.equal(byName(npm.entries, 't').dev, true);
  assert.equal(byName(npm.entries, 't').scope, 'build');
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

test('yarn.lock graph walk: app, build, tests, and entries no root reaches', () => {
  const dir = fixture({
    'package.json': JSON.stringify({
      dependencies: { app: '^1.0.0' },
      devDependencies: { bundler: '^2.0.0', jest: '^29.0.0' },
    }),
    'yarn.lock': [
      '# yarn lockfile v1', '',
      'app@^1.0.0:', '  version "1.0.0"', '  resolved "https://registry.yarnpkg.com/app/-/app-1.0.0.tgz#a"', '  integrity sha512-APP', '  dependencies:', '    shared "^3.0.0"', '  optionalDependencies:', '    "@scope/deep" "~4.1.0"', '',
      '"@scope/deep@~4.1.0":', '  version "4.1.3"', '  resolved "https://registry.yarnpkg.com/@scope/deep/-/deep-4.1.3.tgz#d"', '',
      'shared@^3.0.0:', '  version "3.2.0"', '  resolved "https://registry.yarnpkg.com/shared/-/shared-3.2.0.tgz#s"', '',
      'bundler@^2.0.0:', '  version "2.0.0"', '  resolved "https://registry.yarnpkg.com/bundler/-/bundler-2.0.0.tgz#b"', '  dependencies:', '    shared "^3.0.0"', '    tool "^1.0.0"', '',
      'tool@^1.0.0:', '  version "1.0.0"', '  resolved "https://registry.yarnpkg.com/tool/-/tool-1.0.0.tgz#t"', '  bin:', '    tool "bin.js"', '',
      'jest@^29.0.0:', '  version "29.0.0"', '  resolved "https://registry.yarnpkg.com/jest/-/jest-29.0.0.tgz#j"', '  dependencies:', '    tool "^1.0.0"', '    jest-only "^1.0.0"', '',
      'jest-only@^1.0.0:', '  version "1.0.0"', '  resolved "https://registry.yarnpkg.com/jest-only/-/jest-only-1.0.0.tgz#jo"', '',
      'stale@^0.1.0:', '  version "0.1.0"', '  resolved "https://registry.yarnpkg.com/stale/-/stale-0.1.0.tgz#st"', '',
    ].join('\n'),
  });
  const [npm] = quiet(() => analyzePinning(dir));
  const scopes = Object.fromEntries(npm.entries.map(e => [e.name, e.scope]));
  assert.deepEqual(scopes, {
    app: 'app', '@scope/deep': 'app', shared: 'app', // reachable from dependencies, even when a dev root also needs it
    bundler: 'build', tool: 'build', // a dev root and what only dev roots pull in
    jest: 'tests', 'jest-only': 'tests', // a test framework and what only it pulls in
    stale: null, // in the lockfile, reached by nothing
  });
  assert.equal(byName(npm.entries, 'shared').dev, false);
  assert.equal(byName(npm.entries, 'tool').dev, true);
  assert.equal(byName(npm.entries, 'stale').dev, null);
  assert.equal(byName(npm.entries, 'shared').direct, false);
  assert.equal(byName(npm.entries, 'app').integrity, 'sha512-APP');
  // one hop up: the entries whose dependencies resolve to this one
  assert.deepEqual(byName(npm.entries, 'shared').dependants, ['app', 'bundler']);
  assert.deepEqual(byName(npm.entries, 'tool').dependants, ['bundler', 'jest']);
  assert.deepEqual(byName(npm.entries, '@scope/deep').dependants, ['app']);
  assert.deepEqual(byName(npm.entries, 'app').dependants, []);
});

test('yarn berry dependencies blocks and workspaces are walked too', () => {
  const dir = fixture({
    'package.json': JSON.stringify({ name: 'root', workspaces: ['packages/*'], devDependencies: { vitest: '^1.0.0' } }),
    'packages/app/package.json': JSON.stringify({ name: 'app', dependencies: { '@scope/lib': '^7.0.0' } }),
    'yarn.lock': [
      '__metadata:', '  version: 8', '',
      '"@scope/lib@npm:^7.0.0":', '  version: 7.2.0', '  resolution: "@scope/lib@npm:7.2.0"', '  dependencies:', '    "@scope/inner": "npm:^1.0.0"', '    plain: ^2.0.0', '  peerDependenciesMeta:', '    react:', '      optional: true', '  checksum: 10c0/aa', '  languageName: node', '',
      '"@scope/inner@npm:^1.0.0":', '  version: 1.0.0', '  resolution: "@scope/inner@npm:1.0.0"', '  checksum: 10c0/bb', '  languageName: node', '',
      '"plain@npm:^2.0.0":', '  version: 2.0.0', '  resolution: "plain@npm:2.0.0"', '  checksum: 10c0/cc', '  languageName: node', '',
      '"vitest@npm:^1.0.0":', '  version: 1.0.0', '  resolution: "vitest@npm:1.0.0"', '  dependencies:', '    tinypool: "npm:^0.8.0"', '  checksum: 10c0/dd', '  languageName: node', '',
      '"tinypool@npm:^0.8.0":', '  version: 0.8.1', '  resolution: "tinypool@npm:0.8.1"', '  checksum: 10c0/ee', '  languageName: node', '',
    ].join('\n'),
  });
  const [npm] = quiet(() => analyzePinning(dir));
  const scopes = Object.fromEntries(npm.entries.map(e => [e.name, e.scope]));
  assert.deepEqual(scopes, { '@scope/lib': 'app', '@scope/inner': 'app', plain: 'app', vitest: 'tests', tinypool: 'tests' });
  assert.equal(byName(npm.entries, '@scope/lib').integrity, '10c0/aa', 'the checksum after the dependencies block is still read');
  assert.equal(byName(npm.entries, '@scope/lib').tier, 'hash-pinned');
  assert.equal(byName(npm.entries, '@scope/lib').version, '7.2.0');
});

test('scope is stored, read back, and the column is added to a database that predates it', () => {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'pinning-db-')), 'assets.db');
  const legacy = initDatabase(file);
  legacy.exec('ALTER TABLE app_dependencies DROP COLUMN scope; ALTER TABLE app_vulnerabilities DROP COLUMN scope; ALTER TABLE app_dependencies DROP COLUMN dependants; ALTER TABLE app_vulnerabilities DROP COLUMN dependants');
  legacy.close();
  const db = initDatabase(file);
  for (const column of ['scope', 'dependants']) {
    assert.ok(db.prepare('PRAGMA table_info(app_dependencies)').all().some(c => c.name === column), column);
    assert.ok(db.prepare('PRAGMA table_info(app_vulnerabilities)').all().some(c => c.name === column), column);
  }
  saveDependencies(db, 'app', 'v1', [{ ecosystem: 'npm', entries: [
    { ecosystem: 'npm', lockfile: 'yarn.lock', name: 'a', version: '1', resolved: '', integrity: '', direct: true, dev: true, scope: 'tests', dependants: ['z', 'y', 'z'], tier: 'version-pinned' },
    { ecosystem: 'npm', lockfile: 'yarn.lock', name: 'b', version: '1', resolved: '', integrity: '', direct: null, dev: null, scope: 'nonsense', dependants: null, tier: 'version-pinned' },
  ] }]);
  const rows = getDependencies(db, 'app', 'v1');
  assert.deepEqual(rows.map(r => [r.name, r.scope]), [['a', 'tests'], ['b', null]]);
  assert.deepEqual(rows.map(r => dependantsOfRow(r.dependants)), [['y', 'z'], null], 'stored as a sorted, deduplicated JSON list, or NULL');
  db.close();
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

test('cargo: scope from the manifests, dev-dependencies are tests, build-dependencies are build', () => {
  const dir = fixture({
    'Cargo.toml': ['[workspace]', 'members = ["app", "lib"]', ''].join('\n'),
    'app/Cargo.toml': [
      '[package]', 'name = "app"', 'version = "0.1.0"', '',
      '[dependencies]', 'serde = "1"', 'lib = { path = "../lib" }', 'pretty = { package = "prettyplease", version = "0.2" }', '',
      '[dependencies.tokio]', 'version = "1"', 'features = ["rt"]', '',
      '[target.\'cfg(unix)\'.dependencies]', 'libc = "0.2"', '',
      '[build-dependencies]', 'cc = "1"', '',
      '[dev-dependencies]', 'criterion = "0.5"', 'serde = "1" # also a dev dep: stays app', '',
    ].join('\n'),
    'lib/Cargo.toml': ['[package]', 'name = "lib"', 'version = "0.1.0"', '', '[dependencies]', 'hex = "0.4"', '', '[dev-dependencies]', 'proptest = "1"', ''].join('\n'),
    'Cargo.lock': [
      '[[package]]', 'name = "app"', 'version = "0.1.0"', 'dependencies = [', ' "cc",', ' "criterion",', ' "lib",', ' "libc",', ' "prettyplease",', ' "serde",', ' "tokio",', ']', '',
      '[[package]]', 'name = "lib"', 'version = "0.1.0"', 'dependencies = [', ' "hex",', ' "proptest",', ']', '',
      '[[package]]', 'name = "serde"', 'version = "1.0.1"', 'source = "registry+https://github.com/rust-lang/crates.io-index"', 'checksum = "a"', 'dependencies = [', ' "serde_derive 1.0.1",', ']', '',
      '[[package]]', 'name = "serde_derive"', 'version = "1.0.1"', 'source = "registry+https://github.com/rust-lang/crates.io-index"', 'checksum = "b"', '',
      '[[package]]', 'name = "prettyplease"', 'version = "0.2.0"', 'source = "registry+https://github.com/rust-lang/crates.io-index"', 'checksum = "c"', '',
      '[[package]]', 'name = "tokio"', 'version = "1.40.0"', 'source = "registry+https://github.com/rust-lang/crates.io-index"', 'checksum = "d"', '',
      '[[package]]', 'name = "libc"', 'version = "0.2.1"', 'source = "registry+https://github.com/rust-lang/crates.io-index"', 'checksum = "e"', '',
      '[[package]]', 'name = "hex"', 'version = "0.4.3"', 'source = "registry+https://github.com/rust-lang/crates.io-index"', 'checksum = "f"', '',
      '[[package]]', 'name = "cc"', 'version = "1.1.0"', 'source = "registry+https://github.com/rust-lang/crates.io-index"', 'checksum = "g"', 'dependencies = [', ' "shlex",', ']', '',
      '[[package]]', 'name = "shlex"', 'version = "1.3.0"', 'source = "registry+https://github.com/rust-lang/crates.io-index"', 'checksum = "h"', '',
      '[[package]]', 'name = "criterion"', 'version = "0.5.1"', 'source = "registry+https://github.com/rust-lang/crates.io-index"', 'checksum = "i"', 'dependencies = [', ' "serde",', ' "plotters",', ']', '',
      '[[package]]', 'name = "plotters"', 'version = "0.3.5"', 'source = "registry+https://github.com/rust-lang/crates.io-index"', 'checksum = "j"', '',
      '[[package]]', 'name = "proptest"', 'version = "1.4.0"', 'source = "registry+https://github.com/rust-lang/crates.io-index"', 'checksum = "k"', '',
      '[[package]]', 'name = "orphan"', 'version = "0.0.1"', 'source = "registry+https://github.com/rust-lang/crates.io-index"', 'checksum = "l"', '',
    ].join('\n'),
  });
  const [cargo] = quiet(() => analyzePinning(dir));
  const scopes = Object.fromEntries(cargo.entries.map(e => [e.name, e.scope]));
  assert.deepEqual(scopes, {
    serde: 'app', serde_derive: 'app', prettyplease: 'app', tokio: 'app', libc: 'app', hex: 'app', // [dependencies], renamed, sub-table, target-specific, through the workspace lib
    cc: 'build', shlex: 'build', // [build-dependencies] and what it pulls
    criterion: 'tests', plotters: 'tests', proptest: 'tests', // [dev-dependencies] of app and of lib
    orphan: null, // in the lock, reached by nothing
  });
  assert.equal(byName(cargo.entries, 'hex').dev, false);
  assert.equal(byName(cargo.entries, 'proptest').dev, true);
  assert.equal(byName(cargo.entries, 'orphan').dev, null);
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
