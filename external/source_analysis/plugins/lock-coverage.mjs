import fs from 'fs';
import path from 'path';

/**
 * Test 7c: lock coverage. Which dependency manifests the repository has, and
 * whether each one has a lockfile next to it (or above it, for workspaces).
 *
 * A dependency that is not locked is strictly worse than one with a known
 * vulnerability (Leo, 2026-10-26): nothing says which code the build gets, so
 * nothing can be checked, and the build can change without a commit. The
 * pinning step only sees the ecosystems it parses; this one also lists the
 * manifests nobody parses (Flutter, CocoaPods, SwiftPM, Go, Carthage), so a
 * wallet built from those cannot look clean by having no rows at all.
 *
 * Leaving something out of the lockfile must not hide it (Leo, 2026-10-26):
 * build inputs that no lockfile can list count too. A binary committed into
 * the tree (committed-binaries) and a download without a hash check
 * (oob-downloads: curl, wget, git clone, a container base image without a
 * digest) make the verdict 'unlocked' like a manifest without a lockfile.
 * Test fixtures and build-tool wrappers do not; CI configs do, since a CI job
 * may be what builds the release.
 *
 * Reads file names and a few bytes only; nothing is installed or executed.
 */

// Directories never searched: installed or generated trees.
const IGNORED_DIRS = new Set(['node_modules', '.git', 'build', 'dist', 'Pods', 'vendor', '.dart_tool', 'Carthage', 'target', '.gradle']);
const MAX_SCAN_DEPTH = 5;
const UNLISTED_LIST_CAP = 50;

// A manifest under one of these is not the product (a library's demo app,
// test fixtures, docs): listed, but it does not decide the verdict.
const NOT_PRODUCT_DIR = /^(examples?|samples?|demos?|tests?|__tests__|fixtures?|docs?|benchmarks?)$/i;

// Gradle has no lockfile by default. A build that declares exact versions
// only resolves the same set every time (Schildbach's wallet, Leo
// 2026-10-26), so it is locked without one; a range (`1.+`, `[1,2)`,
// `latest.release`) is a floating row from pinning and unlocks it. Only
// verification metadata adds hashes; `lockfile` names it when present.

function walk(root, visit, rel = '', depth = 0) {
  if (depth > MAX_SCAN_DEPTH) return;
  let entries;
  try {
    entries = fs.readdirSync(path.join(root, rel), { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const child = rel ? `${rel}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) walk(root, visit, child, depth + 1);
    } else if (entry.isFile()) {
      visit(child, entry.name);
    }
  }
}

const dirOf = (rel) => (rel.includes('/') ? rel.slice(0, rel.lastIndexOf('/')) : '');

// The directory and each of its ancestors up to the repository root.
function upwards(dir) {
  const dirs = [dir];
  while (dir) {
    dir = dirOf(dir);
    dirs.push(dir);
  }
  return dirs;
}

const inDir = (dir, name) => (dir ? `${dir}/${name}` : name);

export function isProductPath(rel) {
  return !dirOf(rel).split('/').some(seg => NOT_PRODUCT_DIR.test(seg));
}

/**
 * One record per manifest: { ecosystem, manifest, lockfile, product }.
 * `lockfile` is the path of the lockfile that covers the manifest, null when
 * there is none. `files` (repository-relative paths) is for tests; the plugin
 * walks the checkout.
 */
export function findManifests(repoPath, files = null) {
  const all = files || [];
  if (!files) walk(repoPath, (rel) => all.push(rel));
  const has = new Set(all);
  const read = (rel) => {
    try { return fs.readFileSync(path.join(repoPath, rel), 'utf8'); } catch { return ''; }
  };
  const byName = (re) => all.filter(rel => re.test(rel.slice(rel.lastIndexOf('/') + 1)));
  // The nearest of `names` in the manifest's directory or above it.
  const lockAbove = (rel, names) => {
    for (const dir of upwards(dirOf(rel))) {
      for (const name of names) if (has.has(inDir(dir, name))) return inDir(dir, name);
    }
    return null;
  };
  const lockHere = (rel, names) => names.map(n => inDir(dirOf(rel), n)).find(p => has.has(p)) || null;

  const out = [];
  const add = (ecosystem, manifest, lockfile, extra = {}) => out.push({ ecosystem, manifest, lockfile, product: isProductPath(manifest), ...extra });

  for (const m of byName(/^package\.json$/)) {
    if (!/"(dependencies|devDependencies|optionalDependencies)"\s*:\s*\{\s*"/.test(read(m))) continue; // scripts or tooling config only
    add('npm', m, lockAbove(m, ['package-lock.json', 'npm-shrinkwrap.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb', 'bun.lock']));
  }
  for (const m of byName(/^Cargo\.toml$/)) add('cargo', m, lockAbove(m, ['Cargo.lock']));
  for (const m of byName(/^pubspec\.yaml$/)) add('pub', m, lockHere(m, ['pubspec.lock']));
  for (const m of byName(/^Podfile$/)) add('cocoapods', m, lockHere(m, ['Podfile.lock']));
  for (const m of byName(/^Cartfile$/)) add('carthage', m, lockHere(m, ['Cartfile.resolved']));
  for (const m of byName(/^go\.mod$/)) add('go', m, lockHere(m, ['go.sum']) || lockAbove(m, ['go.work.sum']));
  // Python: requirements files are their own lock (pinning grades each line);
  // the other manifests need one of the lock formats beside them.
  for (const m of byName(/^requirements[^/]*\.txt$/)) add('pip', m, m);
  for (const m of byName(/^(pyproject\.toml|Pipfile|setup\.py)$/)) {
    if (!/(^|\n)\s*\[?(tool\.poetry\.)?(dev-)?(dependencies|packages|install_requires)\b/.test(read(m)) && !read(m).includes('install_requires')) continue; // tool settings only
    add('pip', m, lockHere(m, ['poetry.lock', 'Pipfile.lock', 'uv.lock', 'pdm.lock', 'requirements.txt']));
  }
  // SwiftPM: a Package.swift, or an Xcode project that references packages.
  // Package.resolved sits beside Package.swift, or inside the project or
  // workspace bundle.
  const resolvedFiles = byName(/^Package\.resolved$/);
  for (const m of byName(/^Package\.swift$/)) add('swiftpm', m, lockHere(m, ['Package.resolved']));
  for (const m of byName(/^project\.pbxproj$/)) {
    if (!read(m).includes('XCRemoteSwiftPackageReference')) continue;
    // Inside Foo.xcodeproj, or in a workspace beside it.
    const parent = dirOf(dirOf(m));
    const lock = resolvedFiles.find(r => !parent || r.startsWith(`${parent}/`));
    add('swiftpm', m, lock || null);
  }
  // Gradle: one record per build root (a settings file, or a lone build file).
  const settings = byName(/^settings\.gradle(\.kts)?$/);
  const buildFiles = byName(/^build\.gradle(\.kts)?$/);
  const isBelow = (rel, dir) => !dir || rel.startsWith(`${dir}/`);
  const roots = settings.length
    ? settings
    : buildFiles.filter(b => !buildFiles.some(o => dirOf(o) !== dirOf(b) && isBelow(b, dirOf(o))));
  for (const m of roots) {
    const root = dirOf(m);
    const under = (r) => isBelow(r, root);
    const lock = all.find(r => under(r) && (r.endsWith('/gradle/verification-metadata.xml') || r === 'gradle/verification-metadata.xml'))
      || all.find(r => under(r) && /(^|\/)(gradle\.lockfile|buildscript-gradle\.lockfile)$/.test(r))
      || all.find(r => under(r) && /(^|\/)gradle-lock\/[^/]+\.json$/.test(r))
      || null;
    add('gradle', m, lock, lock ? {} : { exactDeclarations: true });
  }
  return out.sort((a, b) => a.ecosystem.localeCompare(b.ecosystem) || a.manifest.localeCompare(b.manifest));
}

/**
 * Build inputs outside any lockfile, from the results of oob-downloads and
 * committed-binaries (either may be missing when the plugin is off).
 */
export function unlistedInputs({ downloads = [], binaries = null } = {}) {
  const d = (downloads || []).filter(x => !x.hashCheck && isProductPath(x.file));
  const b = (binaries?.artifacts || []).filter(x => x.category === 'build-input' && isProductPath(x.path));
  // Counts are complete; the lists are capped, they are stored with every analysis.
  return {
    downloadCount: d.length,
    binaryCount: b.length,
    downloads: d.slice(0, UNLISTED_LIST_CAP).map(x => ({ kind: x.kind, target: x.target, file: x.file, line: x.line })),
    binaries: b.slice(0, UNLISTED_LIST_CAP).map(x => ({ path: x.path, kind: x.kind, size: x.size })),
  };
}

/**
 * The manifests plus what the pinning rows say about them: per ecosystem, how
 * many rows are unlocked (a range, `1.+`, `latest`), plus the inputs no
 * lockfile lists. The verdict counts product manifests and inputs only:
 *   'none'     no manifest and no unlisted input found: the dependencies are unknown
 *   'unlocked' a manifest without a lockfile (gradle: with a range), unlocked
 *              rows, a committed binary or a download without a hash check
 *   'locked'   every product manifest has a lockfile, no row floats, nothing unlisted
 */
export function lockCoverage(manifests, pinning = [], unlisted = unlistedInputs()) {
  const floatingRows = {};
  for (const a of pinning || []) {
    for (const e of a.entries || []) {
      if (e.tier === 'floating' && isProductPath(e.lockfile || '')) floatingRows[e.ecosystem] = (floatingRows[e.ecosystem] || 0) + 1;
    }
  }
  const product = manifests.filter(m => m.product);
  const missing = product.filter(m => !m.lockfile && !m.exactDeclarations);
  const floating = Object.values(floatingRows).reduce((n, v) => n + v, 0);
  const outside = unlisted.downloadCount + unlisted.binaryCount;
  const verdict = missing.length || floating || outside ? 'unlocked' : (product.length ? 'locked' : 'none');
  return { verdict, manifests, missing: missing.length, floatingRows, unlisted };
}

export default {
  description: 'Test 7c: lock coverage, manifests without a lockfile',
  container({ repoPath, results }) {
    const unlisted = unlistedInputs({ downloads: results?.['oob-downloads'], binaries: results?.['committed-binaries'] });
    const coverage = lockCoverage(findManifests(repoPath), results?.pinning, unlisted);
    console.log('\n--- Test 7c: Lock coverage ---');
    if (coverage.verdict === 'none') console.log('No dependency manifest found: the dependencies are unknown.');
    for (const m of coverage.manifests) {
      console.log(`  [${m.ecosystem}] ${m.manifest}: ${m.lockfile ? `locked by ${m.lockfile}` : (m.exactDeclarations ? 'no lockfile, exact versions unless pinning lists floating rows' : 'NO LOCKFILE')}${m.product ? '' : ' (not the product)'}`);
    }
    for (const [eco, n] of Object.entries(coverage.floatingRows)) console.log(`  [${eco}] ${n} unlocked entries`);
    for (const d of unlisted.downloads) console.log(`  [download] ${d.kind} ${d.target} at ${d.file}:${d.line}: NO HASH CHECK`);
    for (const b of unlisted.binaries) console.log(`  [binary] ${b.path}: committed, in no lockfile`);
    console.log(`  verdict: ${coverage.verdict}`);
    return coverage;
  },
};
