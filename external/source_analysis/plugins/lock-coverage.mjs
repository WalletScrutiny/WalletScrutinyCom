import fs from 'fs';
import path from 'path';
import { CONTAINER_FILE_RE, LOOPBACK_URL_RE } from './oob-downloads.mjs';

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
 * A lockfile counts only if the pinning step reads it (Danny, 2026-10-28).
 * go.sum, Podfile.lock, Package.resolved, pnpm-lock.yaml,
 * poetry.lock and the like are found but not parsed: their packages are in no
 * row and were never checked. Those manifests are 'unread', and a release
 * whose product rests on one is 'unknown', never 'locked'. So is a C/C++
 * build: CMake, meson and autotools have no lockfile at all.
 *
 * Containers for development only (a devcontainer, a compose file, a
 * Dockerfile named for dev or tests) do not build the release, so their
 * downloads do not unlock it.
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

// The lockfiles plugins/pinning.mjs parses. Gradle is read from its build
// files whatever lockfile it has (pinning grades every declaration).
const READ_LOCKFILE = /(^|\/)(package-lock\.json|yarn\.lock|Cargo\.lock|pubspec\.lock|requirements[^/]*\.txt)$/;
export const isRead = (m) => m.ecosystem === 'gradle' || (!!m.lockfile && READ_LOCKFILE.test(m.lockfile));
// Each stored manifest records whether pinning read its lockfile (`read`,
// since 2026-10-28). A result stored before that has no rows for a lockfile
// pinning learned to read later, so regrading it must not call it read.
const READ_SINCE_RECORDED = /(^|\/)pubspec\.lock$/;
const wasRead = (m) => typeof m.read === 'boolean' ? m.read : isRead(m) && !READ_SINCE_RECORDED.test(m.lockfile || '');

// A container for development only: it never builds the release.
const DEV_CONTAINER_FILE = /^((docker-)?compose[^/]*\.ya?ml|(Dockerfile|Containerfile)[.-](dev|devel|development|local|debug|tests?|e2e)([.-][^/]*)?)$/i;
export function isDevOnlyPath(rel) {
  return rel.split('/').includes('.devcontainer') || DEV_CONTAINER_FILE.test(rel.slice(rel.lastIndexOf('/') + 1));
}

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

// A dependency file under one of these belongs to the team's own tooling (a
// helper script's requirements.txt, CI), not to the app. Only manifests and
// their version ranges: whether downloads in CI and scripts count is open.
const TOOLING_DIR = /^(scripts?|tools?|tooling|\.github|\.circleci|ci)$/i;
export function isProductManifestPath(rel) {
  return isProductPath(rel) && !dirOf(rel).split('/').some(seg => TOOLING_DIR.test(seg));
}

// Which app a file builds: 'iphone', 'android', 'desktop' (Flutter's linux/,
// macos/, windows/ targets), null for all. One repository often holds several
// apps, and the Android page must not list what only the iPhone build reads.
const IPHONE_ECOSYSTEMS = new Set(['cocoapods', 'swiftpm', 'carthage']);
export function platformOf(rel, ecosystem = null) {
  if (IPHONE_ECOSYSTEMS.has(ecosystem)) return 'iphone';
  if (ecosystem === 'gradle') return 'android';
  const segs = dirOf(rel || '').split('/').map(x => x.toLowerCase());
  if (segs.some(x => x === 'ios' || x === 'iphone')) return 'iphone';
  if (segs.includes('android')) return 'android';
  if (segs.some(x => x === 'linux' || x === 'macos' || x === 'windows')) return 'desktop';
  return null;
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
  const add = (ecosystem, manifest, lockfile, extra = {}) => out.push({ ecosystem, manifest, lockfile, product: isProductManifestPath(manifest), ...extra });

  for (const m of byName(/^package\.json$/)) {
    if (!/"(dependencies|devDependencies|optionalDependencies)"\s*:\s*\{\s*"/.test(read(m))) continue; // scripts or tooling config only
    add('npm', m, lockAbove(m, ['package-lock.json', 'npm-shrinkwrap.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb', 'bun.lock']));
  }
  for (const m of byName(/^Cargo\.toml$/)) add('cargo', m, lockAbove(m, ['Cargo.lock']));
  // A pub workspace member (`resolution: workspace`) is resolved into the
  // workspace root's pubspec.lock, not one of its own.
  for (const m of byName(/^pubspec\.yaml$/)) {
    add('pub', m, lockHere(m, ['pubspec.lock']) || (/(^|\n)resolution:\s*workspace\b/.test(read(m)) ? lockAbove(m, ['pubspec.lock']) : null));
  }
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
  // ESP-IDF's component manager resolves version ranges into dependencies.lock.
  for (const m of byName(/^idf_component\.yml$/)) {
    if (/(^|\n)dependencies:\s*\n\s+\S/.test(read(m))) add('esp-idf', m, lockAbove(m, ['dependencies.lock']));
  }
  // C and C++: no lockfile format exists; the libraries are checked in,
  // submodules or found on the build machine. One record per build root (the
  // topmost CMakeLists.txt, meson.build or configure.ac of a tree), so a
  // C/C++ product is never 'locked' by a stray package.json of its tooling.
  const nativeFiles = byName(/^(CMakeLists\.txt|meson\.build|configure\.(ac|in))$/);
  for (const m of nativeFiles.filter(f => !nativeFiles.some(o => dirOf(o) !== dirOf(f) && isBelow(f, dirOf(o))))) {
    add('c/c++', m, null, { nativeBuild: true });
  }
  return out.sort((a, b) => a.ecosystem.localeCompare(b.ecosystem) || a.manifest.localeCompare(b.manifest));
}

/**
 * Build inputs outside any lockfile, from the results of oob-downloads and
 * committed-binaries (either may be missing when the plugin is off).
 */
export function unlistedInputs({ downloads = [], binaries = null } = {}) {
  const d = (downloads || []).filter(x => !x.hashCheck && isProductPath(x.file) && !isDevOnlyPath(x.file));
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
 *   'unknown'  locked, but a lockfile nothing reads, or a C/C++ build (it has
 *              none): those packages were not checked
 *   'locked'   every product manifest has a lockfile we read, no row floats, nothing unlisted
 * `unread` lists the product manifests whose lockfile nothing reads.
 */
export function lockCoverage(manifests, pinning = [], unlisted = unlistedInputs()) {
  const floatingRows = {};
  // per file too, so the page can name it: { 'app/build.gradle': { ecosystem, count } }
  const floatingFiles = {};
  for (const a of pinning || []) {
    for (const e of a.entries || []) {
      if (e.tier !== 'floating' || !isProductManifestPath(e.lockfile || '')) continue;
      floatingRows[e.ecosystem] = (floatingRows[e.ecosystem] || 0) + 1;
      const f = floatingFiles[e.lockfile || ''] ||= { ecosystem: e.ecosystem, count: 0 };
      f.count++;
    }
  }
  manifests = manifests.map(m => (m.lockfile ? { ...m, read: isRead(m) } : m));
  const g = grade(manifests, floatingRows, unlisted);
  return { verdict: g.verdict, manifests, missing: g.missing.length, unread: g.unread, floatingRows, floatingFiles, unlisted };
}

function grade(manifests, floatingRows, unlisted) {
  const product = manifests.filter(m => m.product);
  const missing = product.filter(m => !m.lockfile && !m.exactDeclarations && !m.nativeBuild);
  const unread = product.filter(m => m.nativeBuild || (m.lockfile && !wasRead(m))).map(m => ({ ecosystem: m.ecosystem, manifest: m.manifest, lockfile: m.lockfile }));
  const floating = Object.values(floatingRows).reduce((n, v) => n + v, 0);
  const outside = unlisted.downloadCount + unlisted.binaryCount;
  const verdict = missing.length || floating || outside ? 'unlocked' : unread.length ? 'unknown' : (product.length ? 'locked' : 'none');
  return { verdict, missing, unread, floating };
}

/**
 * What the wallet page shows of a stored result (analyses.lock_coverage),
 * graded again with today's rules, so an analysis stored before a rule existed
 * follows it too. (Only the capped download list can be re-checked, and a
 * C/C++ build root is only recorded by analyses since that rule.) `null`
 * when the plugin did not run. Lists are capped; the counts are not.
 */
const SHOWN_CAP = 5;
export function coverageForReaders(stored, platform = null) {
  if (!stored || !Array.isArray(stored.manifests)) return null;
  const u = stored.unlisted || {};
  // On one app's page, leave out what only the other app's build reads.
  const forThisApp = (rel, ecosystem) => !platform || [null, platform].includes(platformOf(rel, ecosystem));
  // Stored before the scanner stopped reading FROM in scripts and loopback
  // health checks as downloads, or before development containers were dropped.
  const stillCounts = (d) => !isDevOnlyPath(d.file) && !LOOPBACK_URL_RE.test(d.target)
    && (d.kind !== 'container-base-image' || CONTAINER_FILE_RE.test(path.basename(d.file))) && forThisApp(d.file);
  const listed = u.downloads || [];
  const downloads = listed.filter(stillCounts);
  const listedBinaries = u.binaries || [];
  const binaries = listedBinaries.filter(b => forThisApp(b.path));
  const binaryCount = Math.max(binaries.length, (u.binaryCount || 0) - (listedBinaries.length - binaries.length));
  const unlisted = { downloadCount: Math.max(downloads.length, (u.downloadCount || 0) - (listed.length - downloads.length)), binaryCount };
  // Manifests are re-classified too: a helper script's requirements.txt
  // stored as product before that rule no longer counts.
  const manifests = stored.manifests.filter(m => forThisApp(m.manifest, m.ecosystem))
    .map(m => ({ ...m, product: m.product && isProductManifestPath(m.manifest) }));
  // Version ranges per file where stored (since 2026-10-28), else the per-ecosystem counts as they were.
  const floatingFiles = stored.floatingFiles
    ? Object.entries(stored.floatingFiles).filter(([f, v]) => isProductManifestPath(f) && forThisApp(f, v.ecosystem)).map(([file, v]) => ({ file, count: v.count }))
    : null;
  const floatingRows = floatingFiles ? { all: floatingFiles.reduce((n, f) => n + f.count, 0) }
    : Object.fromEntries(Object.entries(stored.floatingRows || {}).filter(([eco]) => forThisApp('', eco)));
  const c = grade(manifests, floatingRows, unlisted);
  // Workspace members share the root's lockfile: name each unread file once.
  const seen = new Set();
  const unread = c.unread.filter(m => { const k = `${m.ecosystem} ${m.lockfile || m.manifest}`; return !seen.has(k) && seen.add(k); });
  // One line can download twice (a key and a repository): name the place once.
  const places = new Set();
  const downloadPlaces = downloads.filter(d => { const k = `${d.file}:${d.line}`; return !places.has(k) && places.add(k); });
  return {
    verdict: c.verdict,
    missing: c.missing.slice(0, SHOWN_CAP).map(m => ({ ecosystem: m.ecosystem, manifest: m.manifest })),
    missingCount: c.missing.length,
    unread: unread.slice(0, SHOWN_CAP),
    unreadCount: unread.length,
    floating: c.floating,
    ...(floatingFiles ? { floatingFiles: floatingFiles.slice(0, SHOWN_CAP).map(f => f.file) } : {}),
    downloads: downloadPlaces.slice(0, SHOWN_CAP).map(d => ({ file: d.file, line: d.line, target: d.target })),
    downloadCount: unlisted.downloadCount,
    downloadPlaceCount: downloadPlaces.length + Math.max(0, unlisted.downloadCount - downloads.length),
    binaries: binaries.slice(0, SHOWN_CAP).map(b => b.path),
    binaryCount,
  };
}

/**
 * The page of each app, when one repository builds both and they differ:
 * { android, iphone }, or undefined when both see the same as coverageForReaders(stored).
 */
export function coverageByPlatform(stored) {
  const all = JSON.stringify(coverageForReaders(stored));
  const out = {};
  for (const p of ['android', 'iphone']) {
    const c = coverageForReaders(stored, p);
    if (c && JSON.stringify(c) !== all) out[p] = c;
  }
  return Object.keys(out).length ? out : undefined;
}

export default {
  description: 'Test 7c: lock coverage, manifests without a lockfile',
  container({ repoPath, results }) {
    const unlisted = unlistedInputs({ downloads: results?.['oob-downloads'], binaries: results?.['committed-binaries'] });
    const coverage = lockCoverage(findManifests(repoPath), results?.pinning, unlisted);
    console.log('\n--- Test 7c: Lock coverage ---');
    if (coverage.verdict === 'none') console.log('No dependency manifest found: the dependencies are unknown.');
    for (const m of coverage.manifests) {
      console.log(`  [${m.ecosystem}] ${m.manifest}: ${m.lockfile ? `locked by ${m.lockfile}${isRead(m) ? '' : ' (NOT READ: its packages were not checked)'}` : (m.nativeBuild ? 'C/C++ build, has no lockfile format (NOT READ)' : m.exactDeclarations ? 'no lockfile, exact versions unless pinning lists floating rows' : 'NO LOCKFILE')}${m.product ? '' : ' (not the product)'}`);
    }
    for (const [eco, n] of Object.entries(coverage.floatingRows)) console.log(`  [${eco}] ${n} unlocked entries`);
    for (const d of unlisted.downloads) console.log(`  [download] ${d.kind} ${d.target} at ${d.file}:${d.line}: NO HASH CHECK`);
    for (const b of unlisted.binaries) console.log(`  [binary] ${b.path}: committed, in no lockfile`);
    console.log(`  verdict: ${coverage.verdict}`);
    return coverage;
  },
};
