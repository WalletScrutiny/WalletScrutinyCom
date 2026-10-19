import fs from 'fs';
import path from 'path';

/**
 * Test 7: Supply-chain pinning analysis.
 *
 * Everything here is derived from manifest/lock files only — dependencies are
 * NEVER installed and no repository code is executed, so this test is safe to
 * run against untrusted repositories outside a sandbox.
 *
 * Per-dependency record (see channel discussion 2026-08-31):
 *   integrity:  hash-pinned (content hash recorded) /
 *               version-pinned (exact version, registry trusted for bytes) /
 *               floating (range or no lock — the build is not fully defined)
 *   resolution: unambiguous (single registry per package) /
 *               ambiguous (multiple candidate registries — dependency-confusion
 *               exposure; for gradle/maven declaration order is security config,
 *               for pip --extra-index-url all indexes compete)
 *   source:     git/path/tarball dependencies are listed separately; real
 *               opacity measurement (prebuilt blobs inside packages) needs
 *               artifact inspection and is out of scope for this lock-based pass.
 */

const IGNORED_DIRS = new Set(['node_modules', '.git', 'build', 'dist', 'Pods', 'vendor']);
const MAX_SCAN_DEPTH = 3;

function findFiles(rootPath, matcher, depth = 0, results = []) {
  if (depth > MAX_SCAN_DEPTH) return results;
  let entries;
  try {
    entries = fs.readdirSync(rootPath, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const full = path.join(rootPath, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) findFiles(full, matcher, depth + 1, results);
    } else if (matcher(entry.name, full)) {
      results.push(full);
    }
  }
  return results;
}

function relative(repoPath, file) {
  return path.relative(repoPath, file) || '.';
}

/**
 * One row per resolved dependency: the unit ddbbUtils.saveDependencies
 * stores. `direct` is true when the repository declares the package itself,
 * false when another dependency pulled it in, null when the file format does
 * not say. `dev` follows the same convention for build-time-only packages.
 * `tier` is the pinning tier used by the report (hash-pinned, version-pinned,
 * source-ref-pinned, build-service-tag, unversioned, floating).
 */
function makeEntry(ecosystem, lockfile, fields) {
  return {
    ecosystem,
    lockfile,
    name: fields.name,
    version: fields.version || '',
    resolved: fields.resolved || '',
    integrity: fields.integrity || '',
    direct: fields.direct ?? null,
    dev: fields.dev ?? null,
    scope: fields.scope ?? scopeOf(fields),
    // The packages that require this one, by name, one hop up (`alib` for
    // alib -> blib); the project's own manifests are not listed, `direct`
    // says that. null when the files do not record the graph.
    dependants: fields.dependants ? [...new Set(fields.dependants)].sort() : null,
    tier: fields.tier,
  };
}

/**
 * Who requires whom in a package-lock v2/v3 `packages` map, resolved the way
 * node does: a name asked for by `node_modules/a/node_modules/b` is looked up
 * in b's own node_modules, then a's, then the top level. Returns
 * key -> Set of dependant names; roots and workspaces (keys without
 * node_modules) are dependants of nothing listed, `direct` covers them.
 */
export function npmLockDependants(packages) {
  const dependants = new Map();
  for (const [key, entry] of Object.entries(packages)) {
    if (key.includes('node_modules/') && !entry.link) dependants.set(key, new Set());
  }
  // The places a name asked for from `key` can live, nearest first:
  // key/node_modules, then each enclosing package's node_modules, then the top.
  const basesOf = (key) => {
    const bases = [key];
    let cur = key;
    while (cur.includes('node_modules/')) {
      cur = cur.replace(/\/?node_modules\/(@[^/]+\/)?[^/]+$/, '');
      bases.push(cur);
    }
    if (bases[bases.length - 1] !== '') bases.push('');
    return bases;
  };
  for (const [key, entry] of Object.entries(packages)) {
    if (!key.includes('node_modules/') || entry.link) continue; // roots and workspaces: `direct` covers them
    const by = key.replace(/^.*node_modules\//, '');
    const names = Object.keys({ ...(entry.dependencies || {}), ...(entry.optionalDependencies || {}), ...(entry.peerDependencies || {}) });
    for (const name of names) {
      for (const base of basesOf(key)) {
        const candidate = `${base ? `${base}/` : ''}node_modules/${name}`;
        if (dependants.has(candidate)) { dependants.get(candidate).add(by); break; }
      }
    }
  }
  return dependants;
}

/**
 * Where a package ends up, as far as the files say: 'app' (reachable from the
 * project's own dependencies, so bundled), 'build' (only reachable from its
 * development dependencies), 'tests' (only reachable from test frameworks and
 * test tooling), or null when the lockfile does not say. `dev` is the same
 * fact as a boolean and stays for readers that predate `scope`.
 */
function scopeOf(fields) {
  if (fields.dev === true) return 'build';
  if (fields.dev === false) return 'app';
  return null;
}

// Development dependencies that exist for tests: a package reachable only
// through these is 'tests', every other development-only package is 'build'.
const TEST_ROOT = /^(jest|jest-.*|@jest\/.*|babel-jest|ts-jest|vitest|@vitest\/.*|mocha|jasmine|jasmine-.*|karma|karma-.*|ava|tap|tape|chai|chai-.*|sinon|enzyme|enzyme-.*|react-test-renderer|@testing-library\/.*|cypress|@cypress\/.*|playwright|@playwright\/.*|puppeteer|detox|supertest|nock|msw|nyc|c8|istanbul|istanbul-.*|@istanbuljs\/.*|@types\/(jest|mocha|jasmine|chai|sinon|supertest)|protractor|@wdio\/.*|webdriverio|appium|@appium\/.*)$/;
export function isTestRoot(name) {
  return TEST_ROOT.test(name);
}

/* ---------------------------------- npm ---------------------------------- */

/**
 * name -> { dev, range } for the packages a set of manifests declares. A
 * lockfile is matched with the package.json beside it (the project it locks);
 * a lockfile without one falls back to every manifest in the repository.
 */
function declaredNpmDeps(manifestObjects) {
  const declared = new Map();
  for (const pkg of manifestObjects) {
    for (const [field, dev] of [['dependencies', false], ['optionalDependencies', false], ['devDependencies', true]]) {
      for (const [name, range] of Object.entries(pkg[field] || {})) {
        if (!declared.has(name) || !dev) declared.set(name, { dev, range: String(range).replace(/^npm:/, '') });
      }
    }
  }
  return declared;
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

function declaredBeside(lockFile, allManifests) {
  const own = readJson(path.join(path.dirname(lockFile), 'package.json'));
  return declaredNpmDeps(own ? [own] : allManifests);
}

/**
 * yarn.lock entries, classic (v1) and berry. Both formats start an entry with
 * a non-indented `"<name>@<range>", …:` line; v1 then has `version`,
 * `resolved`, `integrity` lines, berry has `version:`, `resolution:`,
 * `checksum:`.
 */
function parseYarnLock(text) {
  const entries = [];
  let current = null;
  let block = null; // the indented sub-block we are in: dependencies, optionalDependencies, or something else
  for (const line of text.split('\n')) {
    if (/^[^#\s].*:\s*$/.test(line)) {
      block = null;
      const spec = line.trim().replace(/:$/, '').split(',')[0].trim().replace(/^"|"$/g, '');
      const at = spec.indexOf('@', 1); // scoped names start with '@'
      const ranges = line.trim().replace(/:$/, '').split(',').map(part => {
        const one = part.trim().replace(/^"|"$/g, '');
        const i = one.indexOf('@', 1);
        return i === -1 ? '' : one.slice(i + 1).replace(/^npm:/, '');
      });
      current = { name: at === -1 ? spec : spec.slice(0, at), ranges, version: '', resolved: '', integrity: '', dependencies: {} };
      if (current.name !== '__metadata') entries.push(current);
      continue;
    }
    if (!current) continue;
    let m;
    if ((m = line.match(/^  (\w+):\s*$/))) { block = m[1]; continue; }
    if (/^  \S/.test(line)) block = null; // a two-space key ends the block (berry's checksum follows dependencies)
    if (block === 'dependencies' || block === 'optionalDependencies') {
      // v1: `    "@scope/name" "^1.0.0"` or `    name "^1.0.0"`; berry: `    "@scope/name": ^1.0.0` or `    name: "npm:^1.0.0"`
      if ((m = line.match(/^    "?((?:@[^/"\s]+\/)?[^"\s:]+)"?:?\s+"?([^"]*?)"?\s*$/))) {
        current.dependencies[m[1]] = m[2].replace(/^npm:/, '');
      }
      continue;
    }
    if (/^    /.test(line)) continue; // inside bin:, peerDependenciesMeta:, …
    if ((m = line.match(/^\s+version:?\s+"?([^"\s]+)"?/))) current.version = m[1];
    else if ((m = line.match(/^\s+(?:resolved|resolution):?\s+"?([^"\s]+)"?/))) current.resolved = m[1];
    else if ((m = line.match(/^\s+(?:integrity|checksum):?\s+"?([^"\s]+)"?/))) current.integrity = m[1];
  }
  return entries;
}

/**
 * Walk a parsed yarn.lock from the manifests' roots and say, per resolved
 * `name@version`, whether it is reachable from the production dependencies
 * ('app'), only from development dependencies ('build'), or only from test
 * frameworks among those ('tests'). yarn.lock records the graph (each entry's
 * `dependencies:`) but no dev flag, so the flag is computed here. Entries no
 * root reaches (stale entries, workspaces the manifests do not cover) get no
 * answer.
 */
// entry -> Set of names of the entries whose `dependencies:` resolve to it.
export function yarnDependants(entries) {
  const byRequest = new Map();
  for (const e of entries) for (const r of e.ranges) byRequest.set(`${e.name}@${r}`, e);
  const dependants = new Map(entries.map(e => [e, new Set()]));
  for (const e of entries) {
    for (const [name, range] of Object.entries(e.dependencies || {})) {
      const target = byRequest.get(`${name}@${range}`);
      if (target && target !== e) dependants.get(target).add(e.name);
    }
  }
  return dependants;
}

export function yarnScopes(entries, manifests) {
  const byRequest = new Map(); // "name@range" -> entry
  for (const e of entries) for (const r of e.ranges) byRequest.set(`${e.name}@${r}`, e);
  const reach = (requests, stop) => {
    const seen = new Set();
    const queue = requests.map(([name, range]) => byRequest.get(`${name}@${String(range).replace(/^npm:/, '')}`)).filter(Boolean);
    while (queue.length) {
      const e = queue.pop();
      if (seen.has(e) || stop.has(e)) continue;
      seen.add(e);
      for (const [name, range] of Object.entries(e.dependencies || {})) {
        const next = byRequest.get(`${name}@${range}`);
        if (next) queue.push(next);
      }
    }
    return seen;
  };
  const prodRoots = [];
  const devRoots = [];
  for (const pkg of manifests) {
    prodRoots.push(...Object.entries(pkg.dependencies || {}), ...Object.entries(pkg.optionalDependencies || {}));
    devRoots.push(...Object.entries(pkg.devDependencies || {}));
  }
  const app = reach(prodRoots, new Set());
  const build = reach(devRoots.filter(([name]) => !isTestRoot(name)), app);
  const tests = reach(devRoots.filter(([name]) => isTestRoot(name)), app);
  const scopes = new Map();
  for (const e of app) scopes.set(`${e.name}@${e.version}`, 'app');
  for (const e of build) scopes.set(`${e.name}@${e.version}`, 'build');
  for (const e of tests) if (!build.has(e)) scopes.set(`${e.name}@${e.version}`, 'tests');
  return scopes;
}

function analyzeNpm(repoPath) {
  const lockFiles = findFiles(repoPath, (name) => name === 'package-lock.json');
  const yarnLocks = findFiles(repoPath, (name) => name === 'yarn.lock');
  const manifests = findFiles(repoPath, (name) => name === 'package.json');
  if (!lockFiles.length && !yarnLocks.length && !manifests.length) return null;

  const result = {
    ecosystem: 'npm',
    lockfiles: [...lockFiles, ...yarnLocks].map(f => relative(repoPath, f)),
    deps: { total: 0, hashPinned: 0, versionPinned: 0, floating: 0 },
    gitOrTarballDeps: [],
    registries: new Set(),
    resolutionNotes: [],
    floatingExamples: [],
    entries: [],
  };
  const allManifests = manifests.map(readJson).filter(Boolean);

  for (const lockFile of lockFiles) {
    const lock = readJson(lockFile);
    if (!lock) continue;
    // lockfileVersion 2/3: "packages" map. v1: "dependencies" tree.
    // A package is direct when a manifest declares it AND it sits at the top
    // of the tree (`node_modules/<name>`, or depth 0 in a v1 tree): a nested
    // copy of a declared name is another version some dependency asked for.
    const entries = [];
    let declared;
    if (lock.packages) {
      const roots = Object.entries(lock.packages)
        .filter(([key, entry]) => !key.includes('node_modules/') && !entry.link)
        .map(([, entry]) => entry);
      declared = declaredNpmDeps(roots.length ? roots : allManifests);
      const dependants = npmLockDependants(lock.packages);
      for (const [key, entry] of Object.entries(lock.packages)) {
        if (!key.includes('node_modules/') || entry.link) continue; // root / workspaces / links
        const name = key.replace(/^.*node_modules\//, '');
        entries.push({ name, nested: /node_modules\/.*node_modules\//.test(key), ...entry, dependants: [...(dependants.get(key) || [])] });
      }
    } else if (lock.dependencies) {
      declared = declaredBeside(lockFile, allManifests);
      // v1 nests what a package needs under it (`dependencies`) and names
      // what it requires (`requires`); a required name resolves to the
      // nearest enclosing level that has it.
      const nodes = [];
      const walk = (deps, chain) => {
        for (const [name, entry] of Object.entries(deps)) {
          const node = { name, nested: chain.length > 0, ...entry, dependants: [] };
          nodes.push({ node, entry, chain });
          if (entry.dependencies) walk(entry.dependencies, [...chain, { entry, node }]);
        }
      };
      walk(lock.dependencies, []);
      const nodeOf = new Map(nodes.map(n => [n.entry, n.node]));
      for (const { node, entry, chain } of nodes) {
        for (const name of Object.keys(entry.requires || {})) {
          const levels = [entry.dependencies || {}, ...[...chain].reverse().map(c => c.entry.dependencies || {}), lock.dependencies];
          const target = levels.map(l => l[name]).find(Boolean);
          if (target && nodeOf.has(target)) nodeOf.get(target).dependants.push(node.name);
        }
      }
      entries.push(...nodes.map(n => n.node));
    } else {
      continue;
    }
    for (const entry of entries) {
      result.deps.total++;
      const resolved = entry.resolved || '';
      if (/^git\+|^git:|^github:/.test(resolved) || /\.(tar\.gz|tgz)$/.test(resolved) && !/registry/.test(resolved)) {
        result.gitOrTarballDeps.push(`${entry.name}@${entry.version || '?'} (${resolved.slice(0, 80)})`);
      }
      if (resolved) {
        try {
          result.registries.add(new URL(resolved).host);
        } catch { /* non-URL resolved */ }
      }
      if (entry.integrity) result.deps.hashPinned++;
      else result.deps.versionPinned++;
      result.entries.push(makeEntry('npm', relative(repoPath, lockFile), {
        name: entry.name,
        version: entry.version,
        resolved,
        integrity: entry.integrity,
        direct: declared.has(entry.name) && !entry.nested,
        dev: entry.dev === true, // lockfile v1-v3 mark packages reachable only through devDependencies
        dependants: entry.dependants,
        tier: entry.integrity ? 'hash-pinned' : 'version-pinned',
      }));
    }
  }

  for (const yarnLock of yarnLocks) {
    const text = fs.readFileSync(yarnLock, 'utf8');
    const own = readJson(path.join(path.dirname(yarnLock), 'package.json'));
    // a workspace root locks every workspace's dependencies: their manifests are roots too
    const roots = own ? (own.workspaces ? [own, ...allManifests.filter(m => m !== own)] : [own]) : allManifests;
    const declared = declaredNpmDeps(roots);
    const parsed = parseYarnLock(text);
    const scopes = yarnScopes(parsed, roots);
    const dependants = yarnDependants(parsed);
    for (const parsedEntry of parsed) {
      const { ranges, dependencies, ...e } = parsedEntry;
      e.dependants = [...(dependants.get(parsedEntry) || [])];
      // yarn.lock keeps every requested range per resolution, so the direct
      // one is the resolution whose ranges include what the manifest asked for
      const direct = declared.has(e.name) && ranges.includes(declared.get(e.name).range);
      const scope = scopes.get(`${e.name}@${e.version}`) ?? (direct ? (declared.get(e.name).dev ? 'build' : 'app') : null);
      result.entries.push(makeEntry('npm', relative(repoPath, yarnLock), {
        ...e,
        direct,
        dev: scope === null ? null : scope === 'app' ? false : true,
        scope,
        tier: e.integrity ? 'hash-pinned' : 'version-pinned',
      }));
    }
    // yarn v1: entry headers are non-indented lines ending in ':'
    const entryCount = (text.match(/^[^#\s].*:\s*$/gm) || []).length;
    const integrityCount = (text.match(/^\s+integrity /gm) || []).length;
    const resolvedHosts = [...text.matchAll(/^\s+resolved "(https?:\/\/[^/"]+)/gm)].map(m => m[1]);
    for (const host of resolvedHosts) {
      try { result.registries.add(new URL(host).host); } catch { /* ignore */ }
    }
    result.deps.total += entryCount;
    result.deps.hashPinned += Math.min(integrityCount, entryCount);
    result.deps.versionPinned += Math.max(entryCount - integrityCount, 0);
  }

  // Manifests without any lockfile → every range is floating.
  if (!lockFiles.length && !yarnLocks.length) {
    for (const manifest of manifests) {
      const pkg = readJson(manifest);
      if (!pkg) continue;
      const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
      for (const [name, range] of Object.entries(allDeps)) {
        result.deps.total++;
        result.deps.floating++;
        if (result.floatingExamples.length < 10) result.floatingExamples.push(`${name}: ${range}`);
        result.entries.push(makeEntry('npm', relative(repoPath, manifest), {
          name, version: range, direct: true, dev: !(name in (pkg.dependencies || {})), tier: 'floating',
        }));
      }
    }
    result.resolutionNotes.push('no lockfile found — all manifest ranges are floating');
  }

  // .npmrc registry configuration
  const npmrcs = findFiles(repoPath, (name) => name === '.npmrc');
  for (const npmrc of npmrcs) {
    const text = fs.readFileSync(npmrc, 'utf8');
    for (const m of text.matchAll(/^\s*(@[^:]+:)?registry\s*=\s*(\S+)/gm)) {
      result.resolutionNotes.push(`${relative(repoPath, npmrc)}: ${(m[1] || '')}registry=${m[2]}`);
      try { result.registries.add(new URL(m[2]).host); } catch { /* ignore */ }
    }
  }

  result.registries = [...result.registries];
  // Scoped registries in .npmrc are unambiguous; multiple *hosts* in resolved URLs are not.
  result.resolutionAmbiguous = result.registries.length > 1;
  return result;
}

/* ---------------------------------- pip ---------------------------------- */

// pip decodes a requirements file by its byte-order mark; Windows editors save UTF-16.
function readRequirements(file) {
  const buf = fs.readFileSync(file);
  const utf16 = () => Buffer.from(buf.subarray(2, buf.length - (buf.length % 2)));
  if (buf[0] === 0xff && buf[1] === 0xfe) return utf16().toString('utf16le');
  if (buf[0] === 0xfe && buf[1] === 0xff) return utf16().swap16().toString('utf16le');
  return buf.toString('utf8').replace(/^\uFEFF/, '');
}

function analyzePip(repoPath) {
  const reqFiles = findFiles(repoPath, (name) => /^requirements[^/]*\.txt$/.test(name));
  if (!reqFiles.length) return null;

  const result = {
    ecosystem: 'pip',
    lockfiles: reqFiles.map(f => relative(repoPath, f)),
    deps: { total: 0, hashPinned: 0, versionPinned: 0, floating: 0 },
    gitOrTarballDeps: [],
    registries: [],
    resolutionNotes: [],
    resolutionAmbiguous: false,
    floatingExamples: [],
    entries: [],
  };

  for (const reqFile of reqFiles) {
    const raw = readRequirements(reqFile);
    // join continuation lines so per-requirement --hash options stay attached
    const logical = raw.replace(/\\\r?\n/g, ' ').split('\n');
    for (const line of logical) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      if (trimmed.startsWith('--index-url')) {
        result.resolutionNotes.push(`${relative(repoPath, reqFile)}: ${trimmed}`);
        continue;
      }
      if (trimmed.startsWith('--extra-index-url')) {
        result.resolutionAmbiguous = true;
        result.resolutionNotes.push(`${relative(repoPath, reqFile)}: ${trimmed} (all indexes compete — dependency-confusion exposure)`);
        continue;
      }
      if (trimmed.startsWith('-')) continue; // other pip options
      const hashes = [...trimmed.matchAll(/--hash=(\S+)/g)].map(m => m[1]).join(' ');
      if (/^(git\+|https?:\/\/|\.\/|\.\.\/|file:)/.test(trimmed)) {
        result.gitOrTarballDeps.push(trimmed.slice(0, 80));
        result.deps.total++;
        const url = trimmed.split(/\s/)[0];
        const egg = url.match(/#egg=([A-Za-z0-9_.-]+)/);
        result.entries.push(makeEntry('pip', relative(repoPath, reqFile), {
          name: egg ? egg[1] : url,
          resolved: url,
          integrity: hashes,
          direct: true,
          tier: hashes ? 'hash-pinned' : (/@[0-9a-f]{7,40}(#|$)/.test(url) ? 'source-ref-pinned' : 'floating'),
        }));
        continue;
      }
      result.deps.total++;
      const name = trimmed.split(/[\s=<>!~;[]/)[0];
      const exact = trimmed.match(/==\s*([^\s;\\,]+)/);
      let tier;
      if (hashes) { result.deps.hashPinned++; tier = 'hash-pinned'; }
      else if (exact) { result.deps.versionPinned++; tier = 'version-pinned'; }
      else {
        result.deps.floating++;
        tier = 'floating';
        if (result.floatingExamples.length < 10) result.floatingExamples.push(name);
      }
      result.entries.push(makeEntry('pip', relative(repoPath, reqFile), {
        name,
        version: exact ? exact[1] : trimmed.slice(name.length).split(/[\s;]/)[0],
        integrity: hashes,
        direct: true,
        tier,
      }));
    }
  }
  return result;
}

/* --------------------------------- gradle -------------------------------- */

function analyzeGradle(repoPath) {
  const buildFiles = findFiles(repoPath, (name) => /\.gradle(\.kts)?$/.test(name));
  if (!buildFiles.length) return null;

  const verificationFiles = findFiles(repoPath, (name, full) =>
    name === 'verification-metadata.xml' && full.includes(`${path.sep}gradle${path.sep}`));

  const result = {
    ecosystem: 'gradle',
    lockfiles: verificationFiles.map(f => relative(repoPath, f)),
    deps: {
      total: 0, hashPinned: 0, versionPinned: 0,
      sourceRefPinned: 0, buildServiceTag: 0, unversioned: 0, floating: 0,
    },
    gitOrTarballDeps: [],
    registries: [],
    resolutionNotes: [],
    floatingExamples: [],
    sourceRefExamples: [],
    buildServiceExamples: [],
    entries: [],
  };

  // Hash tier exists only through dependency verification metadata.
  let verifiedComponents = 0;
  for (const file of verificationFiles) {
    const xml = fs.readFileSync(file, 'utf8');
    verifiedComponents += (xml.match(/<component /g) || []).length;
  }

  const repoSet = new Set();
  const declRe = /["']([a-zA-Z0-9._-]+):([a-zA-Z0-9._-]+):([^"'$]+)["']/g;
  const seen = new Set();
  for (const file of buildFiles) {
    const text = fs.readFileSync(file, 'utf8');
    for (const known of ['mavenCentral()', 'google()', 'jcenter()', 'mavenLocal()', 'gradlePluginPortal()']) {
      if (text.includes(known)) repoSet.add(known);
    }
    for (const m of text.matchAll(/maven\s*[({][^)}]*?(?:url|uri)[^"')\s]*["']?\s*[=(:]?\s*["']([^"']+)["']/g)) {
      repoSet.add(m[1]);
    }
    for (const m of text.matchAll(declRe)) {
      const [, group, artifact, version] = m;
      if (/^(\d|\[|latest\.)/.test(version) === false && !version.includes('+')) continue; // not a version literal
      const key = `${group}:${artifact}`;
      if (seen.has(key)) continue;
      seen.add(key);
      classifyGradleDep(key, version, verifiedComponents, result, '', relative(repoPath, file));
    }
  }
  // Version catalogs. A catalog entry (`alias = { module = "g:a", version.ref
  // = "x" }`) is a real declaration, and on a catalog-based project it is where
  // nearly all of them live: counting only the inline "g:a:v" literals above
  // undercounts such a project several-fold.
  for (const toml of findFiles(repoPath, (name) => name === 'libs.versions.toml')) {
    analyzeVersionCatalog(fs.readFileSync(toml, 'utf8'), relative(repoPath, toml),
      result, seen, verifiedComponents);
  }

  // Verification metadata is the only place gradle records the *resolved* set
  // (transitives included) with checksums. Where it exists it replaces the
  // declaration rows for the coordinates it covers; declarations it does not
  // cover (plugins, floating ranges) stay as declaration rows.
  const declaredEntries = result.entries;
  result.entries = [];
  const covered = new Set();
  for (const file of verificationFiles) {
    const xml = fs.readFileSync(file, 'utf8');
    for (const m of xml.matchAll(/<component\s+group="([^"]+)"\s+name="([^"]+)"\s+version="([^"]+)"[^>]*>([\s\S]*?)<\/component>/g)) {
      const [, group, name, version, body] = m;
      const key = `${group}:${name}`;
      const sha = body.match(/<(sha256|sha512|sha1|md5)\s+value="([0-9a-fA-F]+)"/);
      covered.add(key);
      result.entries.push(makeEntry('gradle', relative(repoPath, file), {
        name: key,
        version,
        integrity: sha ? `${sha[1]}:${sha[2].toLowerCase()}` : '',
        direct: seen.has(key),
        tier: sha ? 'hash-pinned' : 'version-pinned',
      }));
    }
  }
  for (const e of declaredEntries) if (!covered.has(e.name)) result.entries.push(e);

  result.registries = [...repoSet];
  // With >1 repository and no verification metadata, declaration order decides
  // which repository serves each artifact — that order is security configuration.
  result.resolutionAmbiguous = repoSet.size > 1 && verifiedComponents === 0;
  if (verifiedComponents > 0) {
    result.resolutionNotes.push(`gradle dependency verification active (${verifiedComponents} components with recorded checksums)`);
  } else if (repoSet.size > 1) {
    result.resolutionNotes.push('multiple repositories, no verification-metadata.xml — declaration order decides resolution');
  }
  if ([...repoSet].some(r => /jitpack\.io/.test(r))) {
    result.resolutionNotes.push('jitpack.io is in the resolution list, and this pass counts DECLARED dependencies only — ' +
      'JitPack coordinates pulled in transitively by other libraries never appear in a manifest and are not counted here');
  }
  if (repoSet.has('mavenLocal()')) {
    result.resolutionNotes.push('mavenLocal() in the resolution list — whatever is cached on the build machine can satisfy ' +
      'a coordinate ahead of any registry, so the build is not defined by this repository alone');
  }
  return result;
}

/**
 * Place one gradle dependency in a tier.
 *
 * `com.github.<owner>:<repo>` is a JitPack coordinate: the artifact does not
 * exist until a build service compiles it from that GitHub ref on demand. That
 * is a different trust story from a registry release, and the ref itself makes
 * it two different stories — a commit cannot move, a tag or version branch can
 * (a pin against a moving branch is how a rebuild recipe silently rots).
 */
function classifyGradleDep(key, version, verifiedComponents, result, relPath, lockfile = relPath) {
  const label = relPath ? `${relPath}: ${key}:${version}` : `${key}:${version}`;
  result.deps.total++;
  let tier;
  if (version.includes('+') || version.startsWith('[') || version.startsWith('latest.')) {
    result.deps.floating++;
    tier = 'floating';
    if (result.floatingExamples.length < 10) result.floatingExamples.push(label);
  } else if (verifiedComponents > 0) {
    result.deps.hashPinned++;
    tier = 'hash-pinned';
  } else if (/^com\.github\./.test(key)) {
    if (/^[0-9a-f]{7,40}$/.test(version)) {
      result.deps.sourceRefPinned++;
      tier = 'source-ref-pinned';
      if (result.sourceRefExamples.length < 10) result.sourceRefExamples.push(`${key}@${version}`);
    } else {
      result.deps.buildServiceTag++;
      tier = 'build-service-tag';
      if (result.buildServiceExamples.length < 10) result.buildServiceExamples.push(`${key}@${version}`);
    }
  } else {
    result.deps.versionPinned++;
    tier = 'version-pinned';
  }
  result.entries.push(makeEntry('gradle', lockfile, { name: key, version, direct: true, dev: false, tier }));
}

/** Text of one TOML section, up to the next `[header]`. */
function tomlSection(text, name) {
  // `[ \t]` rather than `\s`: a leading `\s*` would swallow the preceding
  // newline into the match and leave the header itself inside the section.
  const header = new RegExp(`^[ \\t]*\\[${name}\\][ \\t]*$`, 'm').exec(text);
  if (!header) return '';
  const rest = text.slice(header.index + header[0].length);
  const end = rest.search(/^[ \t]*\[[a-zA-Z-]+\][ \t]*$/m);
  return end === -1 ? rest : rest.slice(0, end);
}

/**
 * Gradle version catalog. Adds the catalog's [libraries] entries to the tally,
 * keyed by group:artifact so an entry also declared inline is not counted twice.
 *
 * A JitPack-style git ref (`com.github.owner:repo` at a commit) gets its own
 * tier: the *source* is pinned immutably, which is stronger than a version
 * string, but the bytes are still built by a third party, so it is not a hash.
 */
function analyzeVersionCatalog(text, relPath, result, seen, verifiedComponents) {
  const versions = new Map();
  for (const m of tomlSection(text, 'versions').matchAll(/^\s*([A-Za-z0-9_.-]+)\s*=\s*["']([^"']+)["']/gm)) {
    versions.set(m[1], m[2]);
  }
  for (const line of tomlSection(text, 'libraries').split('\n')) {
    const body = line.match(/^\s*[A-Za-z0-9_.-]+\s*=\s*\{(.*)\}\s*$/);
    if (!body) continue;
    const entry = body[1];
    const module = entry.match(/module\s*=\s*["']([^"']+)["']/);
    const group = entry.match(/group\s*=\s*["']([^"']+)["']/);
    const name = entry.match(/name\s*=\s*["']([^"']+)["']/);
    const key = module ? module[1] : (group && name ? `${group[1]}:${name[1]}` : null);
    if (!key || seen.has(key)) continue;
    seen.add(key);

    const refName = entry.match(/version\s*\.\s*ref\s*=\s*["']([^"']+)["']/);
    const literal = entry.match(/version\s*=\s*["']([^"']+)["']/);
    const version = refName ? versions.get(refName[1]) : (literal ? literal[1] : null);

    if (!version) {
      result.deps.total++;
      result.deps.unversioned++;
      result.entries.push(makeEntry('gradle', relPath, { name: key, direct: true, dev: false, tier: 'unversioned' }));
      continue; // version supplied by a BOM/platform declared elsewhere
    }
    classifyGradleDep(key, version, verifiedComponents, result, relPath);
  }
}

/* --------------------------------- cargo --------------------------------- */

function analyzeCargo(repoPath) {
  const lockFiles = findFiles(repoPath, (name) => name === 'Cargo.lock');
  if (!lockFiles.length) return null;

  const result = {
    ecosystem: 'cargo',
    lockfiles: lockFiles.map(f => relative(repoPath, f)),
    deps: { total: 0, hashPinned: 0, versionPinned: 0, floating: 0 },
    gitOrTarballDeps: [],
    registries: ['crates.io'],
    resolutionNotes: [],
    resolutionAmbiguous: false,
    floatingExamples: [],
    entries: [],
  };
  for (const lockFile of lockFiles) {
    const text = fs.readFileSync(lockFile, 'utf8');
    const blocks = text.split('[[package]]').slice(1).map(block => ({
      name: (block.match(/^name = "([^"]+)"/m) || [])[1] || '?',
      version: (block.match(/^version = "([^"]+)"/m) || [])[1] || '',
      source: (block.match(/^source = "([^"]+)"/m) || [])[1] || '',
      checksum: (block.match(/^checksum = "([^"]+)"/m) || [])[1] || '',
      // `dependencies = [ "name", "name 1.2.3", "name 1.2.3 (source)" ]`: the
      // whole spec is kept, the version tells two resolutions of a name apart
      dependencies: [...((block.match(/^dependencies = \[([\s\S]*?)^\]/m) || [])[1] || '').matchAll(/"([^"]+)"/g)].map(m => m[1]),
    }));
    // Packages without a source are the workspace's own crates; what they
    // list is the declared (direct) set, everything else is transitive.
    const direct = new Set(blocks.filter(b => !b.source).flatMap(b => b.dependencies.map(d => d.split(' ')[0])));
    const scopes = cargoScopes(blocks, cargoManifests(path.dirname(lockFile)));
    const dependants = cargoDependants(blocks);
    for (const block of blocks) {
      result.deps.total++;
      if (block.checksum) result.deps.hashPinned++;
      else {
        result.deps.versionPinned++;
        if (block.source.startsWith('git+')) result.gitOrTarballDeps.push(`${block.name} (${block.source.slice(0, 70)})`);
      }
      if (!block.source) continue; // the app's own crates are not dependencies
      result.entries.push(makeEntry('cargo', relative(repoPath, lockFile), {
        name: block.name,
        version: block.version,
        resolved: block.source,
        integrity: block.checksum ? `sha256:${block.checksum}` : '',
        direct: direct.has(block.name),
        dev: scopes.has(block) ? scopes.get(block) !== 'app' : null,
        scope: scopes.get(block) ?? null,
        dependants: [...dependants.get(block)],
        tier: block.checksum ? 'hash-pinned' : (block.source.startsWith('git+') ? 'source-ref-pinned' : 'version-pinned'),
      }));
    }
  }
  return result;
}

/**
 * The dependency sections of every Cargo.toml below a directory, keyed by
 * crate name: { app, build, tests } as sets of dependency names (the crate
 * name after a `package = "…"` rename). Sections read: [dependencies],
 * [build-dependencies], [dev-dependencies], the same under [target.'…'.…],
 * and their [dependencies.<name>] sub-tables. Not a TOML parser: enough for
 * the shapes manifests in the wild use.
 */
// block -> Set of names of the crates that depend on it; the workspace's own
// crates (no source) are not listed, `direct` covers them. A spec is
// "name", "name 1.2.3" or "name 1.2.3 (source)": the version tells two
// resolutions of one name apart.
export function cargoDependants(blocks) {
  const byName = new Map();
  for (const b of blocks) {
    if (!byName.has(b.name)) byName.set(b.name, []);
    byName.get(b.name).push(b);
  }
  const dependants = new Map(blocks.map(b => [b, new Set()]));
  for (const b of blocks) {
    if (!b.source) continue;
    for (const spec of b.dependencies) {
      const [name, version] = spec.split(' ');
      const candidates = byName.get(name) || [];
      const target = candidates.length === 1 ? candidates[0] : candidates.find(c => c.version === version);
      if (target && target !== b) dependants.get(target).add(b.name);
    }
  }
  return dependants;
}

export function cargoManifests(dir) {
  const manifests = new Map();
  for (const file of findFiles(dir, (name) => name === 'Cargo.toml')) {
    const text = fs.readFileSync(file, 'utf8');
    const name = (text.match(/^\[package\][^[]*?^name\s*=\s*"([^"]+)"/ms) || [])[1];
    if (!name) continue; // a virtual workspace manifest declares no crate
    const sets = { app: new Set(), build: new Set(), tests: new Set() };
    const kindOf = (section) => /(^|\.)dev-dependencies$/.test(section) ? 'tests' : /(^|\.)build-dependencies$/.test(section) ? 'build' : /(^|\.)dependencies$/.test(section) ? 'app' : null;
    let section = null;
    let subTable = null; // [dependencies.<name>]
    for (const raw of text.split('\n')) {
      const line = raw.replace(/#.*$/, '').trim();
      if (!line) continue;
      let m;
      if ((m = line.match(/^\[\[?([^\]]+)\]?\]$/))) {
        const header = m[1].trim();
        // [dependencies.foo] / [target.'cfg(unix)'.dependencies.foo]
        const sub = header.match(/^((?:target\.[^.]+(?:\.[^.]+)*?\.)?(?:dev-|build-)?dependencies)\.(.+)$/);
        if (sub && kindOf(sub[1])) {
          section = sub[1]; subTable = sub[2].replace(/^"|"$/g, '');
          sets[kindOf(section)].add(subTable);
        } else {
          section = header; subTable = null;
        }
        continue;
      }
      const kind = section && kindOf(section);
      if (!kind) continue;
      if (subTable) {
        if ((m = line.match(/^package\s*=\s*"([^"]+)"/))) { sets[kind].delete(subTable); sets[kind].add(m[1]); }
        continue;
      }
      if ((m = line.match(/^"?([A-Za-z0-9_.-]+)"?\s*=\s*(.*)$/))) {
        const renamed = m[2].match(/package\s*=\s*"([^"]+)"/);
        sets[kind].add(renamed ? renamed[1] : m[1]);
      }
    }
    manifests.set(name, sets);
  }
  return manifests;
}

/**
 * Where each Cargo.lock package ends up, from the workspace crates' manifests:
 * 'app' when reachable through [dependencies], 'build' when only through
 * [build-dependencies], 'tests' when only through [dev-dependencies] (which
 * cargo compiles for tests, examples and benches only). Cargo.lock lists a
 * registry crate's normal and build dependencies together, so a registry
 * crate's build script helpers count as app: an over-approximation in the
 * safe direction. Workspace crates without a manifest give no answer.
 */
export function cargoScopes(blocks, manifests) {
  const byName = new Map();
  for (const b of blocks) {
    if (!byName.has(b.name)) byName.set(b.name, []);
    byName.get(b.name).push(b);
  }
  // "name", "name 1.2.3" or "name 1.2.3 (source)": cargo adds the version
  // when two resolutions share a name, and the source when they share both
  const resolve = (spec) => {
    const [name, version, source] = spec.split(' ');
    const candidates = byName.get(name) || [];
    if (!version) return candidates[0];
    const sameVersion = candidates.filter(b => b.version === version);
    return (source && sameVersion.find(b => `(${b.source})` === source)) || sameVersion[0];
  };
  const workspace = new Set(blocks.filter(b => !b.source));
  // What a package pulls into whoever depends on it: through a workspace
  // crate only its [dependencies] (its dev and build sections stay with it),
  // through a registry crate everything the lock lists.
  const deps = (b) => {
    const m = workspace.has(b) ? manifests.get(b.name) : null;
    return b.dependencies.map(resolve).filter(Boolean).filter(d => !m || m.app.has(d.name));
  };
  const reach = (roots, stop) => {
    const seen = new Set();
    const queue = [...roots];
    while (queue.length) {
      const b = queue.pop();
      if (seen.has(b) || stop.has(b)) continue;
      seen.add(b);
      for (const d of deps(b)) queue.push(d);
    }
    return seen;
  };
  const rootsOf = (kind) => {
    const roots = [];
    for (const w of workspace) {
      const m = manifests.get(w.name);
      if (!m) continue;
      for (const d of w.dependencies.map(resolve).filter(Boolean)) if (m[kind].has(d.name)) roots.push(d);
    }
    return roots;
  };
  const app = reach(rootsOf('app'), new Set());
  const build = reach(rootsOf('build'), app);
  const tests = reach(rootsOf('tests'), app);
  const scopes = new Map();
  for (const b of app) scopes.set(b, 'app');
  for (const b of build) scopes.set(b, 'build');
  for (const b of tests) if (!build.has(b)) scopes.set(b, 'tests');
  return scopes;
}

/* --------------------------------- report -------------------------------- */

export function analyzePinning(repoPath) {
  console.log('\n--- Test 7: Supply-chain pinning analysis (lockfile-based, nothing installed) ---');
  const analyses = [
    analyzeNpm(repoPath),
    analyzePip(repoPath),
    analyzeGradle(repoPath),
    analyzeCargo(repoPath),
  ].filter(Boolean);

  if (!analyses.length) {
    console.log('No supported manifest/lock files found (npm, pip, gradle, cargo).');
    return [];
  }

  for (const a of analyses) {
    const {
      total, hashPinned, versionPinned,
      sourceRefPinned = 0, buildServiceTag = 0, unversioned = 0, floating,
    } = a.deps;
    const pct = (n) => total ? `${((n / total) * 100).toFixed(1)}%` : '-';
    console.log(`\n[${a.ecosystem}] lock/verification files: ${a.lockfiles.length ? a.lockfiles.join(', ') : 'NONE'}`);
    console.log(`  dependencies:    ${total}` + (a.entries.length !== total ? `  (${a.entries.length} resolved rows recorded)` : ''));
    console.log(`  hash-pinned:     ${hashPinned} (${pct(hashPinned)})  — content hash recorded; registry swap detectable`);
    console.log(`  version-pinned:  ${versionPinned} (${pct(versionPinned)})  — exact version, registry trusted for bytes`);
    if (sourceRefPinned) {
      console.log(`  source-ref-pinned: ${sourceRefPinned} (${pct(sourceRefPinned)})  — pinned to an immutable git commit, ` +
        'but the artifact is built by a third party (JitPack) from that source');
      console.log(`    e.g. ${a.sourceRefExamples.slice(0, 5).join(', ')}`);
    }
    if (buildServiceTag) {
      console.log(`  build-service-tag: ${buildServiceTag} (${pct(buildServiceTag)})  — JitPack coordinate at a tag or ` +
        'version branch: the ref can move and the bytes are produced on demand by a build service, not a registry');
      console.log(`    e.g. ${a.buildServiceExamples.slice(0, 5).join(', ')}`);
    }
    if (unversioned) {
      console.log(`  unversioned:     ${unversioned} (${pct(unversioned)})  — version comes from a BOM/platform declared elsewhere`);
    }
    console.log(`  floating:        ${floating} (${pct(floating)})  — build not fully defined`);
    if (a.floatingExamples.length) {
      console.log(`  floating examples: ${a.floatingExamples.join(', ')}`);
    }
    if (a.gitOrTarballDeps.length) {
      console.log(`  git/path/tarball deps (${a.gitOrTarballDeps.length}):`);
      for (const dep of a.gitOrTarballDeps.slice(0, 10)) console.log(`    - ${dep}`);
    }
    console.log(`  registries seen: ${a.registries.join(', ') || '(none recorded)'}`);
    console.log(`  resolution:      ${a.resolutionAmbiguous ? 'AMBIGUOUS' : 'unambiguous'}`);
    for (const note of a.resolutionNotes) console.log(`    note: ${note}`);
  }
  console.log('\nSource-opacity (prebuilt blobs inside packages) requires artifact inspection — not covered by this lock-based pass.');
  return analyses;
}

// Test 7: supply-chain pinning of every dependency in the lock and manifest
// files. Its result (the pinning analyses, one per ecosystem) is what
// gradle-resolution completes and osv checks; for a release, the host stores
// the resolved rows (packages, app_dependencies).
export default {
  description: 'Test 7: supply-chain pinning',
  container({ repoPath }) {
    return analyzePinning(repoPath);
  },
  async host({ name, version, db, results }) {
    if (!db || !version) return;
    const { saveDependencies } = await import('../ddbbUtils.mjs');
    const stored = saveDependencies(db, name, version, results.pinning);
    console.log(`Stored ${stored} dependency rows for ${name} ${version}`);
  },
};
