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

/* ---------------------------------- npm ---------------------------------- */

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
  };

  for (const lockFile of lockFiles) {
    let lock;
    try {
      lock = JSON.parse(fs.readFileSync(lockFile, 'utf8'));
    } catch {
      continue;
    }
    // lockfileVersion 2/3: "packages" map. v1: "dependencies" tree.
    const entries = [];
    if (lock.packages) {
      for (const [key, entry] of Object.entries(lock.packages)) {
        if (key === '' || entry.link) continue; // root / workspace links
        entries.push({ name: key.replace(/^.*node_modules\//, ''), ...entry });
      }
    } else if (lock.dependencies) {
      const walk = (deps) => {
        for (const [name, entry] of Object.entries(deps)) {
          entries.push({ name, ...entry });
          if (entry.dependencies) walk(entry.dependencies);
        }
      };
      walk(lock.dependencies);
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
    }
  }

  for (const yarnLock of yarnLocks) {
    const text = fs.readFileSync(yarnLock, 'utf8');
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
      let pkg;
      try {
        pkg = JSON.parse(fs.readFileSync(manifest, 'utf8'));
      } catch {
        continue;
      }
      const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
      for (const [name, range] of Object.entries(allDeps)) {
        result.deps.total++;
        result.deps.floating++;
        if (result.floatingExamples.length < 10) result.floatingExamples.push(`${name}: ${range}`);
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
      if (/^(git\+|https?:\/\/|\.\/|\.\.\/|file:)/.test(trimmed)) {
        result.gitOrTarballDeps.push(trimmed.slice(0, 80));
        result.deps.total++;
        continue;
      }
      result.deps.total++;
      if (/--hash=/.test(trimmed)) result.deps.hashPinned++;
      else if (/==/.test(trimmed)) result.deps.versionPinned++;
      else {
        result.deps.floating++;
        if (result.floatingExamples.length < 10) result.floatingExamples.push(trimmed.split(/\s/)[0]);
      }
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
      classifyGradleDep(key, version, verifiedComponents, result, '');
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
function classifyGradleDep(key, version, verifiedComponents, result, relPath) {
  const label = relPath ? `${relPath}: ${key}:${version}` : `${key}:${version}`;
  result.deps.total++;
  if (version.includes('+') || version.startsWith('[') || version.startsWith('latest.')) {
    result.deps.floating++;
    if (result.floatingExamples.length < 10) result.floatingExamples.push(label);
  } else if (verifiedComponents > 0) {
    result.deps.hashPinned++;
  } else if (/^com\.github\./.test(key)) {
    if (/^[0-9a-f]{7,40}$/.test(version)) {
      result.deps.sourceRefPinned++;
      if (result.sourceRefExamples.length < 10) result.sourceRefExamples.push(`${key}@${version}`);
    } else {
      result.deps.buildServiceTag++;
      if (result.buildServiceExamples.length < 10) result.buildServiceExamples.push(`${key}@${version}`);
    }
  } else {
    result.deps.versionPinned++;
  }
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
  };
  for (const lockFile of lockFiles) {
    const text = fs.readFileSync(lockFile, 'utf8');
    const blocks = text.split('[[package]]').slice(1);
    for (const block of blocks) {
      result.deps.total++;
      if (/^checksum = "/m.test(block)) result.deps.hashPinned++;
      else {
        const source = (block.match(/^source = "([^"]+)"/m) || [])[1] || 'path';
        const name = (block.match(/^name = "([^"]+)"/m) || [])[1] || '?';
        result.deps.versionPinned++;
        if (source.startsWith('git+')) result.gitOrTarballDeps.push(`${name} (${source.slice(0, 70)})`);
      }
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
    console.log(`  dependencies:    ${total}`);
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
