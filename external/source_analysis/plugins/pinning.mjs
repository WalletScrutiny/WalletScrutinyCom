import fs from 'fs';
import path from 'path';

/**
 * Test 10: Supply-chain pinning analysis.
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
    tier: fields.tier,
  };
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
  for (const line of text.split('\n')) {
    if (/^[^#\s].*:\s*$/.test(line)) {
      const spec = line.trim().replace(/:$/, '').split(',')[0].trim().replace(/^"|"$/g, '');
      const at = spec.indexOf('@', 1); // scoped names start with '@'
      const ranges = line.trim().replace(/:$/, '').split(',').map(part => {
        const one = part.trim().replace(/^"|"$/g, '');
        const i = one.indexOf('@', 1);
        return i === -1 ? '' : one.slice(i + 1).replace(/^npm:/, '');
      });
      current = { name: at === -1 ? spec : spec.slice(0, at), ranges, version: '', resolved: '', integrity: '' };
      if (current.name !== '__metadata') entries.push(current);
      continue;
    }
    if (!current) continue;
    let m;
    if ((m = line.match(/^\s+version:?\s+"?([^"\s]+)"?/))) current.version = m[1];
    else if ((m = line.match(/^\s+(?:resolved|resolution):?\s+"?([^"\s]+)"?/))) current.resolved = m[1];
    else if ((m = line.match(/^\s+(?:integrity|checksum):?\s+"?([^"\s]+)"?/))) current.integrity = m[1];
  }
  return entries;
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
      for (const [key, entry] of Object.entries(lock.packages)) {
        if (!key.includes('node_modules/') || entry.link) continue; // root / workspaces / links
        const name = key.replace(/^.*node_modules\//, '');
        entries.push({ name, nested: /node_modules\/.*node_modules\//.test(key), ...entry });
      }
    } else if (lock.dependencies) {
      declared = declaredBeside(lockFile, allManifests);
      const walk = (deps, depth) => {
        for (const [name, entry] of Object.entries(deps)) {
          entries.push({ name, nested: depth > 0, ...entry });
          if (entry.dependencies) walk(entry.dependencies, depth + 1);
        }
      };
      walk(lock.dependencies, 0);
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
        tier: entry.integrity ? 'hash-pinned' : 'version-pinned',
      }));
    }
  }

  for (const yarnLock of yarnLocks) {
    const text = fs.readFileSync(yarnLock, 'utf8');
    const declared = declaredBeside(yarnLock, allManifests);
    for (const { ranges, ...e } of parseYarnLock(text)) {
      // yarn.lock keeps every requested range per resolution, so the direct
      // one is the resolution whose ranges include what the manifest asked for
      const direct = declared.has(e.name) && ranges.includes(declared.get(e.name).range);
      result.entries.push(makeEntry('npm', relative(repoPath, yarnLock), {
        ...e,
        direct,
        dev: direct ? declared.get(e.name).dev : null, // yarn.lock does not flag dev reachability
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
    const raw = fs.readFileSync(reqFile, 'utf8');
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
      // `dependencies = [ "name", "name 1.2.3", "name 1.2.3 (source)" ]`
      dependencies: [...((block.match(/^dependencies = \[([\s\S]*?)^\]/m) || [])[1] || '').matchAll(/"([^"\s]+)/g)].map(m => m[1]),
    }));
    // Packages without a source are the workspace's own crates; what they
    // list is the declared (direct) set, everything else is transitive.
    const direct = new Set(blocks.filter(b => !b.source).flatMap(b => b.dependencies));
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
        tier: block.checksum ? 'hash-pinned' : (block.source.startsWith('git+') ? 'source-ref-pinned' : 'version-pinned'),
      }));
    }
  }
  return result;
}

/* --------------------------------- report -------------------------------- */

export function analyzePinning(repoPath) {
  console.log('\n--- Test 10: Supply-chain pinning analysis (lockfile-based, nothing installed) ---');
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

// Test 10: supply-chain pinning of every dependency in the lock and manifest
// files. Its result (the pinning analyses, one per ecosystem) is what
// gradle-resolution completes and osv checks; for a release, the host stores
// the resolved rows (packages, app_dependencies).
export default {
  description: 'Test 10: supply-chain pinning',
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
