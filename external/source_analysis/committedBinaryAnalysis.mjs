import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Test 12: Committed binary artifacts.
 *
 * Finds compiled artifacts that are checked into the source tree itself:
 * static/shared libraries, aar/jar bundles, executables. Nobody downloads
 * them and nobody rebuilds them — every build, upstream's or a verifier's,
 * just links whatever bytes are already sitting in the checkout.
 *
 * This is a blind spot of both earlier tests by construction:
 *   Test 10 (pinning) only sees entries in lock/manifest files.
 *   Test 11 (out-of-band downloads) only sees fetch commands.
 * A committed .a is neither, so it scores clean in both while being the
 * least verifiable input in the build.
 *
 * Each group of artifacts is graded on:
 *   rebuildPath - does the repository document how the bytes were produced
 *                 (a README/CONTEXT/build script that names the directory)?
 *   buildRef    - does a build file actually reference the directory, i.e.
 *                 is this linked into the product rather than dead weight?
 *
 * Known blind spots, stated rather than guessed at: whether a documented
 * recipe actually reproduces the committed bytes (that needs a rebuild, not
 * a scan), and artifacts living in dependency repositories — for those see
 * analyzeDependencyBinaries(), which is the transitive half of this test.
 */

// Only used by the filesystem fallback; the git index is authoritative when
// available. Without this a tree that has been built once reports its own
// compiled output as "committed" binaries, which is the opposite of the point.
const IGNORED_DIRS = new Set([
  '.git', 'node_modules', 'temp_repos', '.gradle', '.idea',
  'build', 'out', 'dist', 'target', 'DerivedData', '.dart_tool', 'Pods',
]);

// Extensions that are compiled output by definition.
const BINARY_EXT_RE = /\.(a|so|dylib|dll|lib|o|obj|aar|jar|apk|aab|ipa|wasm|exe|node|pyd|dex|class|jnilib|framework)$/i;
const VERSIONED_SO_RE = /\.so\.\d+/;

// Build-tool wrappers are committed binaries too, but they are a known,
// separately-pinned category (gradle-wrapper.properties carries the
// distribution URL and often a sha256) — reporting them next to a 300 MB
// vendored wallet engine would be noise.
const WRAPPER_RE = /(^|\/)(gradle\/wrapper\/gradle-wrapper\.jar|\.mvn\/wrapper\/maven-wrapper\.jar)$/;
const TEST_PATH_RE = /(^|\/)(test|tests|androidTest|testdata|test-data|fixtures?|samples?|examples?|demo)(\/|$)/i;
const ABI_SEGMENT_RE = /^(arm64-v8a|armeabi-v7a|armeabi|x86|x86_64|arm64|armv7|mips|mips64|universal|jni|jniLibs)$/i;

// NOTICE/LICENSE deliberately absent: they name third-party components without
// saying how the committed bytes were produced, so treating them as a rebuild
// path would grade an opaque blob as documented.
// Anchored on a documentation extension (or none) on purpose: a looser
// `^BUILD.*` also matches build.gradle and build.sh, which would let a build
// script masquerade as a rebuild recipe.
const DOC_FILE_RE = /^(README|CONTEXT|BUILD|BUILDING|HACKING|DEVELOPMENT|COMPILING|INSTALL)(\.(md|markdown|txt|rst|adoc))?$/i;
const BUILD_FILE_RE = /^(CMakeLists\.txt|Makefile.*|Dockerfile.*|build\.gradle(\.kts)?|.*\.(cmake|mk|sh|bash|bzl|gyp|gni))$/;

const MAGIC_MIN_SIZE = 4096;
const TEXTISH_EXT_RE = /\.(md|txt|json|xml|ya?ml|kt|java|swift|js|ts|mjs|cjs|c|cc|cpp|h|hpp|py|rb|go|rs|gradle|kts|properties|pro|toml|cfg|ini|html|css|svg|png|jpe?g|gif|webp|ico|ttf|otf|woff2?|pdf|zip|gz|xz|bz2|tar|mp3|mp4|wav|proto|sql|lock|patch|diff|po|plist)$/i;

/** ELF / Mach-O / PE / ar-archive / wasm magic, for artifacts with no telling extension. */
function sniffBinary(file) {
  let fd;
  try {
    fd = fs.openSync(file, 'r');
    const buf = Buffer.alloc(8);
    if (fs.readSync(fd, buf, 0, 8, 0) < 8) return null;
    const hex = buf.toString('hex');
    if (hex.startsWith('7f454c46')) return 'ELF';
    // 0xcafebabe is both a Mach-O fat header and a JVM .class file. A class
    // file's bytes 6-7 are its major version (45 = Java 1.1 upward); a fat
    // header's are the high half of a small architecture count.
    if (hex.startsWith('cafebabe')) {
      const major = buf.readUInt16BE(6);
      return major >= 45 && major <= 100 ? 'JVM class' : 'Mach-O';
    }
    if (/^(feedface|feedfacf|cefaedfe|cffaedfe)/.test(hex)) return 'Mach-O';
    if (buf.toString('latin1', 0, 2) === 'MZ') return 'PE';
    if (buf.toString('latin1', 0, 7) === '!<arch>') return 'ar-archive';
    if (hex.startsWith('0061736d')) return 'wasm';
    return null;
  } catch {
    return null;
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
}

function walk(rootPath, dir = rootPath, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) walk(rootPath, full, out);
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

/**
 * The set of files that are actually *committed*. The git index is the only
 * authoritative answer: a filesystem walk of a tree that has been built once
 * would report the build's own output as vendored blobs. Falls back to the
 * walk (minus common output directories) when there is no git metadata,
 * e.g. an exported tarball.
 */
function listCommittedFiles(repoPath) {
  try {
    const out = execSync(`git -C "${repoPath}" ls-files -z`,
      { stdio: 'pipe', timeout: 120000, maxBuffer: 64 * 1024 * 1024 }).toString();
    const files = out.split('\0').filter(Boolean).map(p => path.join(repoPath, p));
    if (files.length) return { files, source: 'git index' };
  } catch { /* not a git checkout */ }
  return { files: walk(repoPath), source: 'filesystem walk (no git metadata)' };
}

function classify(relPath) {
  if (WRAPPER_RE.test(relPath)) return 'build-tool-wrapper';
  if (TEST_PATH_RE.test(relPath)) return 'test-fixture';
  return 'build-input';
}

function humanSize(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

/**
 * Group artifacts by their containing directory: 54 .a files in one
 * external-libs/ folder are one decision by the maintainer, not 54.
 */
function groupByDir(artifacts) {
  const groups = new Map();
  for (const a of artifacts) {
    const dir = path.posix.dirname(a.path.split(path.sep).join('/'));
    // The same library built for four ABIs is one decision, not four: drop ABI
    // path segments wherever they sit, so arm64-v8a/monero and x86_64/monero
    // land in the same group.
    const key = dir.split('/')
      .filter(seg => !ABI_SEGMENT_RE.test(seg))
      .join('/') || '.';
    if (!groups.has(key)) groups.set(key, { dir: key, count: 0, bytes: 0, kinds: new Set(), files: [] });
    const g = groups.get(key);
    g.count++;
    g.bytes += a.size;
    g.kinds.add(a.kind);
    g.files.push(a);
  }
  return [...groups.values()].sort((x, y) => y.bytes - x.bytes);
}

/**
 * Look for evidence that the repo says how these bytes were produced, and
 * that a build file actually consumes them. Text-only, nothing executed.
 */
function findEvidence(repoPath, textFiles, groups) {
  applyEvidence(textFiles, groups);
}

/**
 * Decide whether a text file really refers to this group of artifacts.
 * Matching a bare directory basename is far too loose — "release" or "out"
 * appears in every README — so a mention must be either the directory used as
 * a path, or the name of an actual artifact in the group.
 */
const GENERIC_DIR_TOKENS = new Set([
  'lib', 'libs', 'jni', 'jnilibs', 'bin', 'obj', 'out', 'src', 'main', 'app',
  'build', 'release', 'debug', 'dist', 'target', 'assets', 'res', 'files', '.', '',
]);

function mentionsGroup(text, g) {
  const token = path.posix.basename(g.dir);
  if (!GENERIC_DIR_TOKENS.has(token.toLowerCase()) && token.length >= 4 &&
      (text.includes(`${g.dir}/`) || text.includes(`${token}/`))) {
    return true;
  }
  return g.files.some(f => text.includes(path.posix.basename(f.path.split(path.sep).join('/'))));
}

function applyEvidence(textFiles, groups) {
  for (const g of groups) {
    g.rebuildDoc = null;
    g.buildRef = null;
    for (const { rel, text } of textFiles) {
      if (!mentionsGroup(text, g)) continue;
      const base = path.posix.basename(rel);
      if (!g.rebuildDoc && DOC_FILE_RE.test(base)) g.rebuildDoc = rel;
      else if (!g.buildRef && BUILD_FILE_RE.test(base)) g.buildRef = rel;
    }
    // A build script that documents its own inputs counts as documentation too.
    if (!g.rebuildDoc && g.buildRef && /\.(sh|bash|mk)$|^Makefile|^Dockerfile/.test(path.posix.basename(g.buildRef))) {
      g.rebuildDoc = g.buildRef;
    }
  }
}

function readTextFiles(repoPath, files) {
  const out = [];
  for (const file of files) {
    const base = path.basename(file);
    if (!DOC_FILE_RE.test(base) && !BUILD_FILE_RE.test(base) && !/\.md$/i.test(base)) continue;
    try {
      const stat = fs.statSync(file);
      if (stat.size > 1_000_000) continue;
      out.push({ rel: path.relative(repoPath, file).split(path.sep).join('/'), text: fs.readFileSync(file, 'utf8') });
    } catch { /* unreadable, skip */ }
  }
  return out;
}

function printGroups(groups, indent = '  ') {
  for (const g of groups) {
    // "documented" is a claim by the repository, not a verified property: a
    // recipe can require a machine nobody has, or embed a build hash that makes
    // the committed bytes unreachable anyway. Say which one this is.
    const grade = g.rebuildDoc ? 'rebuild documented (unverified)' : 'NO REBUILD PATH';
    const linked = g.buildRef ? 'referenced by build' : 'no build reference found';
    console.log(`${indent}[${grade} | ${linked}] ${g.dir}/`);
    console.log(`${indent}    ${g.count} artifact(s), ${humanSize(g.bytes)}, kinds: ${[...g.kinds].sort().join(', ')}`);
    if (g.rebuildDoc) console.log(`${indent}    rebuild documented in: ${g.rebuildDoc}`);
    if (g.buildRef) console.log(`${indent}    consumed by: ${g.buildRef}`);
    const biggest = g.files.slice().sort((a, b) => b.size - a.size).slice(0, 3);
    for (const f of biggest) console.log(`${indent}    ${humanSize(f.size).padStart(9)}  ${f.path}`);
    if (g.count > biggest.length) console.log(`${indent}    … and ${g.count - biggest.length} more`);
  }
}

/**
 * Scan one checked-out repository for committed binary artifacts.
 * Returns { artifacts, groups, totals } and prints a human-readable report.
 */
export function analyzeCommittedBinaries(repoPath, { header = true } = {}) {
  if (header) console.log('\n--- Test 12: Committed binary artifacts (static, nothing executed) ---');

  const { files: all, source } = listCommittedFiles(repoPath);
  const artifacts = [];
  for (const file of all) {
    const rel = path.relative(repoPath, file).split(path.sep).join('/');
    let size;
    try { size = fs.statSync(file).size; } catch { continue; } // indexed but absent
    let kind = null;
    if (BINARY_EXT_RE.test(rel) || VERSIONED_SO_RE.test(rel)) {
      kind = (rel.match(BINARY_EXT_RE)?.[1] || 'so').toLowerCase();
    } else if (!TEXTISH_EXT_RE.test(rel) && size >= MAGIC_MIN_SIZE) {
      const magic = sniffBinary(file);
      if (magic) kind = `${magic} (no extension)`;
    }
    if (!kind) continue;
    artifacts.push({ path: rel, size, kind, category: classify(rel) });
  }

  const buildInputs = artifacts.filter(a => a.category === 'build-input');
  const wrappers = artifacts.filter(a => a.category === 'build-tool-wrapper');
  const fixtures = artifacts.filter(a => a.category === 'test-fixture');

  const groups = groupByDir(buildInputs);
  findEvidence(repoPath, readTextFiles(repoPath, all), groups);

  const totals = {
    count: buildInputs.length,
    bytes: buildInputs.reduce((n, a) => n + a.size, 0),
    undocumented: groups.filter(g => !g.rebuildDoc).reduce((n, g) => n + g.count, 0),
    undocumentedBytes: groups.filter(g => !g.rebuildDoc).reduce((n, g) => n + g.bytes, 0),
    wrappers: wrappers.length,
    fixtures: fixtures.length,
  };

  if (!buildInputs.length) {
    console.log(`No committed binary build inputs found, per ${source} ` +
      `(${wrappers.length} build-tool wrapper(s), ${fixtures.length} test fixture(s) excluded).`);
  } else {
    console.log(`Found ${totals.count} committed binary build input(s), ${humanSize(totals.bytes)} total, ` +
      `in ${groups.length} location(s), per ${source}.`);
    if (totals.undocumented) {
      console.log(`NOTE: ${totals.undocumented} of them (${humanSize(totals.undocumentedBytes)}) have NO documented ` +
        'rebuild path in this repository — they are opaque inputs to every build, upstream\'s included.');
    }
    printGroups(groups);
    if (wrappers.length || fixtures.length) {
      console.log(`  (excluded: ${wrappers.length} build-tool wrapper(s), ${fixtures.length} test fixture(s))`);
    }
  }
  console.log('(Blind spots: whether a documented recipe actually reproduces the committed bytes — that needs a ' +
    'rebuild, not a scan — and artifacts committed in dependency repositories; see --follow-deps.)');

  return { artifacts, groups, totals };
}

// ---------------------------------------------------------------------------
// Transitive half: the same check, one repository down.
// ---------------------------------------------------------------------------

/**
 * Resolve source dependencies that are themselves git repositories.
 * v1 covers the JitPack convention used across the Android wallet corpus:
 * com.github.<owner>:<repo> coordinates in a Gradle version catalog or build
 * file, whose version is a git ref (tag or commit) rather than a release.
 */
export function resolveGitDependencies(repoPath) {
  const deps = new Map();
  const catalogs = [
    path.join(repoPath, 'gradle', 'libs.versions.toml'),
    path.join(repoPath, 'gradle', 'libs.versions.tomls'),
  ].filter(p => fs.existsSync(p));

  for (const catalog of catalogs) {
    const text = fs.readFileSync(catalog, 'utf8');
    const versions = new Map();
    for (const m of text.matchAll(/^\s*([A-Za-z0-9_.-]+)\s*=\s*"([^"]+)"\s*$/gm)) {
      versions.set(m[1], m[2]);
    }
    for (const m of text.matchAll(/module\s*=\s*"com\.github\.([^:"]+):([^"]+)"[^}]*?version(?:\.ref)?\s*=\s*"([^"]+)"/g)) {
      const [, ownerPart, artifact, version] = m;
      // com.github.<owner>:<repo>            — whole repository
      // com.github.<owner>.<repo>:<artifact> — one module of a multi-module
      //   repository; the repo to scan is the group suffix, not the artifact.
      const dot = ownerPart.indexOf('.');
      const owner = dot === -1 ? ownerPart : ownerPart.slice(0, dot);
      const repo = dot === -1 ? artifact : ownerPart.slice(dot + 1);
      const ref = versions.get(version) || version;
      const url = `https://github.com/${owner}/${repo}`;
      if (!deps.has(url)) deps.set(url, { url, owner, repo, ref, source: path.relative(repoPath, catalog) });
    }
  }
  return [...deps.values()];
}

/**
 * List a dependency repo's tree at a ref without checking out its blobs.
 * A blob:none clone costs a few hundred KB; `ls-tree --long` then pulls only
 * what git needs to report sizes, and no working tree is ever materialised.
 */
function listRemoteTree(url, ref, tmpDir) {
  fs.rmSync(tmpDir, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(tmpDir), { recursive: true });
  execSync(`git clone --quiet --filter=blob:none --no-checkout ${url} "${tmpDir}"`,
    { stdio: 'pipe', timeout: 300000 });
  const sha = execSync(`git -C "${tmpDir}" rev-parse ${ref}`, { stdio: 'pipe', timeout: 60000 })
    .toString().trim();
  const out = execSync(`git -C "${tmpDir}" ls-tree -r --long ${sha}`,
    { stdio: 'pipe', timeout: 900000, maxBuffer: 64 * 1024 * 1024 }).toString();
  const files = [];
  for (const line of out.split('\n')) {
    // <mode> blob <sha> <size>\t<path>
    const m = line.match(/^\d+ blob ([0-9a-f]+)\s+(\d+)\t(.*)$/);
    if (m) files.push({ path: m[3], size: parseInt(m[2], 10) });
  }
  return { sha, files, tmpDir };
}

/** Read one file out of the bare-ish clone (lazy-fetches just that blob). */
function showFile(tmpDir, sha, filePath) {
  try {
    return execSync(`git -C "${tmpDir}" show ${sha}:"${filePath}"`,
      { stdio: 'pipe', timeout: 120000, maxBuffer: 8 * 1024 * 1024 }).toString();
  } catch {
    return null;
  }
}

/**
 * Run Test 12 against each git-resolvable dependency of the repo.
 * This is where a wallet whose own tree is spotless stops looking spotless:
 * the artifacts are one repository down, and every single-repo scanner —
 * including Tests 10 and 11 — is standing in the wrong place to see them.
 */
export async function analyzeDependencyBinaries(repoPath, tempRoot) {
  console.log('\n--- Test 12b: Committed binaries in source dependencies (one repository down) ---');
  const deps = resolveGitDependencies(repoPath);
  if (!deps.length) {
    console.log('No git-resolvable source dependencies found (v1 resolves com.github.* JitPack coordinates ' +
      'from Gradle version catalogs).');
    return [];
  }
  console.log(`Resolved ${deps.length} source dependency repositor(ies) to scan.`);

  const results = [];
  for (const dep of deps) {
    const tmpDir = path.join(tempRoot, `dep_${dep.owner}_${dep.repo}`);
    let tree;
    try {
      tree = listRemoteTree(dep.url, dep.ref, tmpDir);
    } catch (error) {
      console.log(`  [unresolved] ${dep.owner}/${dep.repo}@${dep.ref} — ${error.message.split('\n')[0]}`);
      results.push({ ...dep, error: 'unresolved' });
      continue;
    }

    const artifacts = tree.files
      .filter(f => BINARY_EXT_RE.test(f.path) || VERSIONED_SO_RE.test(f.path))
      .map(f => ({
        path: f.path,
        size: f.size,
        kind: (f.path.match(BINARY_EXT_RE)?.[1] || 'so').toLowerCase(),
        category: classify(f.path),
      }));
    const buildInputs = artifacts.filter(a => a.category === 'build-input');
    const groups = groupByDir(buildInputs);

    if (groups.length) {
      const textFiles = tree.files
        .filter(f => {
          const base = path.posix.basename(f.path);
          return f.size < 1_000_000 && (DOC_FILE_RE.test(base) || BUILD_FILE_RE.test(base) || /\.md$/i.test(base));
        })
        .map(f => ({ rel: f.path, text: showFile(tree.tmpDir, tree.sha, f.path) }))
        .filter(f => f.text !== null);
      applyEvidence(textFiles, groups);
    }

    const bytes = buildInputs.reduce((n, a) => n + a.size, 0);
    const undocumented = groups.filter(g => !g.rebuildDoc).reduce((n, g) => n + g.bytes, 0);
    if (buildInputs.length) {
      console.log(`\n  ${dep.owner}/${dep.repo}@${dep.ref} (${tree.sha.slice(0, 12)}) — ` +
        `${buildInputs.length} committed binary build input(s), ${humanSize(bytes)}` +
        (undocumented ? `, ${humanSize(undocumented)} with no documented rebuild path` : ''));
      printGroups(groups, '    ');
    } else {
      console.log(`\n  ${dep.owner}/${dep.repo}@${dep.ref} (${tree.sha.slice(0, 12)}) — clean, no committed binaries.`);
    }
    results.push({
      ...dep,
      sha: tree.sha,
      count: buildInputs.length,
      bytes,
      undocumentedBytes: undocumented,
      // JSON-safe view: Sets and full file lists stay out of --json output.
      groups: groups.map(g => ({
        dir: g.dir, count: g.count, bytes: g.bytes, kinds: [...g.kinds].sort(),
        rebuildDoc: g.rebuildDoc, buildRef: g.buildRef,
      })),
    });
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  const totalBytes = results.reduce((n, r) => n + (r.bytes || 0), 0);
  const dirty = results.filter(r => r.count > 0);
  console.log(`\n  Summary: ${dirty.length} of ${results.length} dependency repositor(ies) carry committed ` +
    `binaries, ${humanSize(totalBytes)} in total.`);
  console.log('  (Depth 1: dependencies of dependencies are not followed.)');
  return results;
}

