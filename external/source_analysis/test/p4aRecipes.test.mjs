// python-for-android recipes (issue 1009). The recipes below are cut down from
// Electrum 4.8.3's contrib/android/p4a_recipes/ and keep the shapes the reader has
// to handle.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { analyzePinning } from '../plugins/pinning.mjs';
import { uncheckableReason } from '../plugins/osv.mjs';

const SPEC = 'contrib/android/buildozer_qml.spec';
const RECIPES = 'contrib/android/p4a_recipes';
const SHA = 'a'.repeat(128);

const REQUIREMENTS_MULTILINE = `requirements =
    python3,
    android,
    openssl,
    pycryptodomex,
    pyqt6,
    pyparsing,
    libzxing
`;

const spec = (requirements = REQUIREMENTS_MULTILINE) => `[app]
title = Electrum
${requirements}
p4a.local_recipes = %(source.dir)s/contrib/android/p4a_recipes/
p4a.bootstrap = qt6
`;

const ELECTRUM = {
  // Only an override.
  python3: `from pythonforandroid.recipes.python3 import Python3Recipe

assert Python3Recipe.depends == ['sqlite3', 'openssl']
assert Python3Recipe.python_depends == []


class Python3RecipePinned(Python3Recipe):
    version = "3.11.16"
    sha512sum = "${SHA}"


recipe = Python3RecipePinned()
`,
  // The assert checks python-for-android's default; the override is what ships.
  sqlite3: `from pythonforandroid.recipes.sqlite3 import Sqlite3Recipe

assert Sqlite3Recipe._version == "3.35.5"
assert Sqlite3Recipe.depends == []


class Sqlite3RecipePinned(util.InheritedRecipeMixin, Sqlite3Recipe):
    version = "3.50.0"
    url = 'https://www.sqlite.org/2025/sqlite-amalgamation-3500000.zip'
    sha512sum = "${SHA}"


recipe = Sqlite3RecipePinned()
`,
  // A commented-out assert.
  openssl: `from pythonforandroid.recipes.openssl import OpenSSLRecipe

# assert OpenSSLRecipe._version == "3.3.1"
assert OpenSSLRecipe.depends == []


class OpenSSLRecipePinned(util.InheritedRecipeMixin, OpenSSLRecipe):
    version = "3.0.22"
    sha512sum = "${SHA}"


recipe = OpenSSLRecipePinned()
`,
  // No version, no hash, "one of" in depends, and a pip build tool.
  android: `from pythonforandroid.recipes.android import AndroidRecipe
from pythonforandroid.util import load_source, HashPinnedDependency

assert AndroidRecipe.depends == [('sdl3', 'sdl2', 'genericndkbuild', 'qt6'), 'python3'], AndroidRecipe.depends
assert AndroidRecipe.python_depends == []


class AndroidRecipePinned(util.InheritedRecipeMixin, AndroidRecipe):
    hostpython_prerequisites = [
        HashPinnedDependency(package="Cython==3.1.8",
                             hashes=['sha256:282b3c8e6abc3fea421919e862e898ff']),
    ]


recipe = AndroidRecipePinned()
`,
  // The assert names the base class, and this recipe's own depends replaces it.
  pycryptodomex: `from pythonforandroid.recipe import PythonRecipe
from pythonforandroid.util import HashPinnedDependency

assert PythonRecipe.depends == ['python3']
assert PythonRecipe.python_depends == []


class PycryptodomexRecipe(PythonRecipe):
    version = "3.23.0"
    sha512sum = "${SHA}"
    url = "https://github.com/Legrandin/pycryptodome/archive/v{version}x.tar.gz"
    depends = ["cffi"]
    hostpython_prerequisites = [
        HashPinnedDependency(package="setuptools==80.9.0",
                             hashes=['sha256:062d34222ad13e0cc312a4c02d73f059']),
    ]


recipe = PycryptodomexRecipe()
`,
  cffi: `from pythonforandroid.recipes.cffi import CffiRecipe

assert CffiRecipe._version == "2.0.0"
assert CffiRecipe.depends == ['setuptools', 'python3']


class CffiRecipePinned(util.InheritedRecipeMixin, CffiRecipe):
    sha512sum = "${SHA}"


recipe = CffiRecipePinned()
`,
  setuptools: `from pythonforandroid.recipes.setuptools import SetuptoolsRecipe

assert SetuptoolsRecipe._version == "80.9.0"
assert SetuptoolsRecipe.depends == ['python3']


class SetuptoolsRecipePinned(util.InheritedRecipeMixin, SetuptoolsRecipe):
    sha512sum = "${SHA}"


recipe = SetuptoolsRecipePinned()
`,
  // Only an assert.
  pyqt6: `from pythonforandroid.recipes.pyqt6 import PyQt6Recipe

assert PyQt6Recipe._version == "6.10.2"
assert PyQt6Recipe.depends == ['qt6', 'python3'], PyQt6Recipe.depends


class PyQt6RecipePinned(util.InheritedRecipeMixin, PyQt6Recipe):
    sha512sum = "${SHA}"


recipe = PyQt6RecipePinned()
`,
  // Reaches hostqt6, which has no recipe in this folder.
  qt6: `from pythonforandroid.recipes.qt6 import Qt6Recipe

assert Qt6Recipe._version == "6.10.2"
assert Qt6Recipe.depends == ['python3', 'hostqt6']


class Qt6RecipePinned(util.InheritedRecipeMixin, Qt6Recipe):
    sha512sum = "${SHA}"


recipe = Qt6RecipePinned()
`,
  // A commented-out override, and build tools that repeat another recipe's.
  pyparsing: `from pythonforandroid.recipes.pyparsing import PyparsingRecipe
from pythonforandroid.util import HashPinnedDependency

assert PyparsingRecipe._version == "3.0.7"
assert PyparsingRecipe.depends == ["python3"]


class PyparsingRecipePinned(PyparsingRecipe):
    #version = "9.9.9"
    sha512sum = "${SHA}"

    hostpython_prerequisites = [
        HashPinnedDependency(package="setuptools==80.9.0",
                             hashes=['sha256:062d34222ad13e0cc312a4c02d73f059']),
        HashPinnedDependency(package="pip==26.2.2",
                             hashes=['sha256:fd7f4dfa8190e014013b9f08f3e973f4']),
    ]


recipe = PyparsingRecipePinned()
`,
  // A version that is a commit, and its own depends.
  libzxing: `from pythonforandroid.recipe import Recipe


class LibZXingRecipe(Recipe):
    # zxing-cpp v3.1.1. Keep in sync with contrib/make_zxing.sh.
    version = "287c85df6f961c8efbfb5ffd736cd9457b8b890e"
    url = "https://github.com/zxing-cpp/zxing-cpp/archive/{version}.tar.gz"
    sha512sum = "${SHA}"
    depends = []


recipe = LibZXingRecipe()
`,
  // In the folder, but nothing reaches them.
  cryptography: `from pythonforandroid.recipes.cryptography import CryptographyRecipe

assert CryptographyRecipe._version == "2.8"
assert CryptographyRecipe.depends == ['openssl', 'python3']


class CryptographyRecipePinned(util.InheritedRecipeMixin, CryptographyRecipe):
    sha512sum = "${SHA}"


recipe = CryptographyRecipePinned()
`,
  sdl2: `class Sdl2Recipe(Recipe):
    version = "2.0.9"
    sha512sum = "${SHA}"


recipe = Sdl2Recipe()
`,
};

function repository({ specText = spec(), recipes = ELECTRUM } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'p4a-'));
  const write = (name, content) => {
    fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
    fs.writeFileSync(path.join(dir, name), content);
  };
  write(SPEC, specText);
  for (const [name, content] of Object.entries(recipes)) write(`${RECIPES}/${name}/__init__.py`, content);
  return dir;
}

function quiet(fn) {
  const log = console.log;
  console.log = () => {};
  try { return fn(); } finally { console.log = log; }
}

const analyse = (dir = repository()) => quiet(() => analyzePinning(dir));
const rowsOf = (analyses) => analyses.flatMap(a => a.entries);
const notesOf = (analyses) => analyses.flatMap(a => a.resolutionNotes).join('\n');
const rowNamed = (rows, name) => {
  const hits = rows.filter(r => r.name === name);
  assert.equal(hits.length, 1, `${name}: expected one row, got ${hits.length}`);
  return hits[0];
};

test('p4a recipes: the override wins, the assert is the fallback, comments do not count', () => {
  const rows = rowsOf(analyse());
  assert.equal(rowNamed(rows, 'sqlite3').version, '3.50.0');
  assert.equal(rowNamed(rows, 'openssl').version, '3.0.22');
  assert.equal(rowNamed(rows, 'python3').version, '3.11.16');
  assert.equal(rowNamed(rows, 'qt6').version, '6.10.2');
  assert.equal(rowNamed(rows, 'pyparsing').version, '3.0.7');
});

test('p4a recipes: url_version beats the assert, as in older OpenSSL recipes', () => {
  // Electrum 4.6.2's shape: the assert says 1.1, and 1.1.1w is what is downloaded.
  const openssl = `assert OpenSSLRecipe._version == "1.1"
assert OpenSSLRecipe.depends == []


class OpenSSLRecipePinned(util.InheritedRecipeMixin, OpenSSLRecipe):
    url_version = "1.1.1w"
    sha512sum = "${SHA}"
`;
  const rows = rowsOf(analyse(repository({ specText: spec('requirements = openssl\n'), recipes: { openssl } })));
  assert.equal(rowNamed(rows, 'openssl').version, '1.1.1w');
});

test('p4a recipes: a recipe\'s own depends beats the assert on its base class', () => {
  const cffi = rowNamed(rowsOf(analyse()), 'cffi');
  assert.equal(cffi.version, '2.0.0');
  assert.equal(cffi.direct, false);
  assert.deepEqual(cffi.dependants, ['pycryptodomex']);
});

test('p4a recipes: "one of" follows the bootstrap', () => {
  const rows = rowsOf(analyse());
  assert.ok(rows.some(r => r.name === 'qt6'));
  for (const name of ['sdl2', 'sdl3', 'genericndkbuild']) assert.ok(!rows.some(r => r.name === name), name);
});

test('p4a recipes: a recipe nothing reaches is not listed', () => {
  assert.ok(!rowsOf(analyse()).some(r => r.name === 'cryptography'));
});

test('p4a recipes: both ways of writing requirements', () => {
  const inline = 'requirements = python3,openssl\n';
  const rows = rowsOf(analyse(repository({ specText: spec(inline) })));
  assert.equal(rowNamed(rows, 'python3').direct, true);
  assert.equal(rowNamed(rows, 'openssl').direct, true);
  assert.equal(rowNamed(rows, 'sqlite3').direct, false);
  assert.ok(!rows.some(r => r.name === 'libzxing'));
});

test('p4a recipes: a commit stays the version and a sha512sum makes the row hash-pinned', () => {
  const zxing = rowNamed(rowsOf(analyse()), 'libzxing');
  assert.equal(zxing.version, '287c85df6f961c8efbfb5ffd736cd9457b8b890e');
  assert.equal(zxing.tier, 'hash-pinned');
  assert.equal(zxing.lockfile, SPEC);
});

test('p4a recipes: what cannot be resolved is reported, not dropped', () => {
  const analyses = analyse();
  const rows = rowsOf(analyses);
  for (const name of ['android', 'hostqt6']) {
    const row = rowNamed(rows, name);
    assert.equal(row.version, '');
    assert.equal(row.tier, 'unversioned');
    assert.match(notesOf(analyses), new RegExp(`: ${name} has no`));
  }
});

test('p4a recipes: a link can\'t lead out of the repository', () => {
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'p4a-outside-'));
  fs.writeFileSync(path.join(outside, '__init__.py'), ELECTRUM.sqlite3);
  const dir = repository({ specText: spec('requirements = stolen\n'), recipes: {} });
  fs.mkdirSync(path.join(dir, RECIPES), { recursive: true });
  fs.symlinkSync(outside, path.join(dir, RECIPES, 'stolen'));
  const analyses = analyse(dir);
  const row = rowNamed(rowsOf(analyses), 'stolen');
  assert.equal(row.version, '');
  assert.match(notesOf(analyses), /: stolen has no recipe/);
});

test('p4a recipes: a requirement that is not a recipe name is reported, not followed', () => {
  const analyses = analyse(repository({ specText: spec('requirements = python3,../../evil\n') }));
  assert.ok(!rowsOf(analyses).some(r => r.name.includes('evil')));
  assert.match(notesOf(analyses), /"\.\.\/\.\.\/evil" is not a recipe name/);
});

test('p4a recipes: pinned pip build tools are build rows, once each', () => {
  const rows = rowsOf(analyse());
  const cython = rowNamed(rows, 'Cython');
  assert.equal(cython.ecosystem, 'pip');
  assert.equal(cython.version, '3.1.8');
  assert.equal(cython.scope, 'build');
  assert.equal(cython.tier, 'hash-pinned');
  assert.equal(rowNamed(rows, 'pip').version, '26.2.2');
});

test('p4a recipes: a library that is a recipe stays one row, not a build tool', () => {
  // setuptools is a recipe in the chain and a build tool of two other recipes.
  const setuptools = rowNamed(rowsOf(analyse()), 'setuptools');
  assert.equal(setuptools.version, '80.9.0');
  assert.notEqual(setuptools.scope, 'build');
});

test('p4a recipes: PyPI libraries can be looked up, native ones say why not', () => {
  const rows = rowsOf(analyse());
  const pyqt = rowNamed(rows, 'PyQt6');
  assert.equal(pyqt.ecosystem, 'pip');
  assert.equal(uncheckableReason(pyqt), null);
  const openssl = rowNamed(rows, 'openssl');
  assert.equal(openssl.ecosystem, 'p4a');
  assert.equal(uncheckableReason(openssl), 'ecosystem');
});

test('p4a recipes: a recipe is never run', () => {
  const marker = path.join(os.tmpdir(), `p4a-ran-${process.pid}-${Date.now()}`);
  const recipes = { ...ELECTRUM, openssl: `open(${JSON.stringify(marker)}, "w").close()\n${ELECTRUM.openssl}` };
  analyse(repository({ recipes }));
  assert.equal(fs.existsSync(marker), false);
});

test('p4a recipes: a repository without a buildozer spec has no recipe rows', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'p4a-none-'));
  fs.writeFileSync(path.join(dir, 'requirements.txt'), 'six==1.17.0\n');
  assert.deepEqual(analyse(dir).map(a => a.ecosystem), ['pip']);
});
