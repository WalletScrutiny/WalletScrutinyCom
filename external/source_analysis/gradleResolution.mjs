/**
 * Test 10, gradle part 2: the resolved dependency graph.
 *
 * Without a committed verification-metadata.xml the gradle build files only
 * show what a project declares as literals: no transitive dependencies, no
 * versions built from variables or supplied by a BOM. Gradle itself is the only
 * thing that knows the full set, so this runs the project's own gradle wrapper
 * with an init script (gradle/resolve-deps.init.gradle) that resolves the
 * graph of every classpath configuration and lists the modules it selected.
 *
 * That executes the repository's build scripts, so it runs INSIDE the
 * analysis container only (runChecksOnCheckout), never on the host:
 * pinning-cli.mjs and the parse-only analyzePinning do not call it. Only
 * metadata is resolved (POM / module files); no artifact is downloaded and
 * no task of the project runs.
 */
import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import { fileURLToPath } from 'url';

const INIT_SCRIPT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'gradle', 'resolve-deps.init.gradle');
const IGNORED_DIRS = new Set(['node_modules', '.git', 'build', 'dist', 'Pods', 'vendor']);
const MAX_SCAN_DEPTH = 3;
const MAX_BUILDS = 3;
export const GRADLE_TIMEOUT_MS = 20 * 60 * 1000; // per build, inside the container's own limit
const SUBMODULE_TIMEOUT_MS = 5 * 60 * 1000;
export const RESOLVED_LOCKFILE_SUFFIX = ' (gradle resolution)';

// JDKs in the analysis image (see containerRunner.mjs CONTAINER_JAVA_HOME)
export const JDKS = {
  8: '/usr/lib/jvm/java-8-openjdk-amd64',
  11: '/usr/lib/jvm/java-11-openjdk-amd64',
  17: '/usr/lib/jvm/java-17-openjdk-amd64',
};

/**
 * Directories holding a gradle build that can be run: a settings file (or,
 * for a single-project build, a build file) with the wrapper beside it. The
 * wrapper is required: it pins the gradle version the project was written for.
 */
export function findGradleBuilds(repoPath) {
  const builds = [];
  const walk = (dir, depth) => {
    if (depth > MAX_SCAN_DEPTH) return;
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    const names = new Set(entries.map(e => e.name));
    const isBuild = ['settings.gradle', 'settings.gradle.kts', 'build.gradle', 'build.gradle.kts'].some(n => names.has(n));
    if (isBuild && names.has('gradlew')) {
      builds.push(dir);
      return; // its subprojects belong to it
    }
    for (const e of entries) if (e.isDirectory() && !IGNORED_DIRS.has(e.name)) walk(path.join(dir, e.name), depth + 1);
  };
  walk(repoPath, 0);
  return builds;
}

/** Gradle version the wrapper downloads, e.g. "8.7", or null. */
export function wrapperGradleVersion(buildDir) {
  try {
    const props = fs.readFileSync(path.join(buildDir, 'gradle', 'wrapper', 'gradle-wrapper.properties'), 'utf8');
    const m = props.match(/distributionUrl=.*gradle-(\d+(?:\.\d+)*)/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

/** JDK major version a gradle version runs on: 17 from 7.3 on, 11 from 5.0, else 8. */
export function jdkForGradle(version) {
  if (!version) return 17;
  const [major, minor = 0] = version.split('.').map(Number);
  if (major > 7 || (major === 7 && minor >= 3)) return 17;
  if (major >= 5) return 11;
  return 8;
}

/**
 * Parse the init script's JSON lines. Returns { modules, unresolved, errors }:
 * modules keyed by group:module:version with the configurations they came from.
 */
export function parseResolution(text) {
  const modules = new Map();
  const unresolved = new Set();
  const errors = [];
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    let r;
    try { r = JSON.parse(line); } catch { continue; }
    if (r.error) { errors.push(`${r.project} ${r.configuration}: ${r.error}`); continue; }
    if (r.unresolved) { unresolved.add(r.unresolved); continue; }
    const key = `${r.group}:${r.module}:${r.version}`;
    if (!modules.has(key)) modules.set(key, { name: `${r.group}:${r.module}`, version: r.version, direct: false, shipped: false, configurations: new Set() });
    const m = modules.get(key);
    m.direct = m.direct || r.direct;
    m.shipped = m.shipped || isShippedConfiguration(r.configuration);
    m.configurations.add(r.configuration);
  }
  return { modules, unresolved: [...unresolved], errors };
}

/**
 * Whether a configuration ends up in the app: a runtime classpath that is not
 * for tests or a debug build. Compile-only, annotation processors, the build
 * script classpath (plugins) and test/debug variants are build-time (`dev`).
 */
export function isShippedConfiguration(name) {
  return /runtimeclasspath$/i.test(name) && !/test|debug|benchmark|^buildscript:/i.test(name);
}

/**
 * The checkout is shallow and without submodules, but a build that includes a
 * submodule's projects (Mycelium's fiosdk_kotlin) fails to configure without
 * them. Fetch them at the commit the repository pins, shallow. Returns an
 * error message, or null.
 */
function initSubmodules(repoPath, { env = process.env } = {}) {
  if (!fs.existsSync(path.join(repoPath, '.gitmodules'))) return Promise.resolve(null);
  return new Promise((resolve) => {
    execFile('git', ['-C', repoPath, 'submodule', 'update', '--init', '--recursive', '--depth', '1'], {
      env: { ...env, GIT_TERMINAL_PROMPT: '0' },
      timeout: SUBMODULE_TIMEOUT_MS,
      killSignal: 'SIGKILL',
      maxBuffer: 16 * 1024 * 1024,
    }, (error, stdout, stderr) => {
      resolve(error ? (stderr || error.message).trim().split('\n').slice(-3).join(' ') : null);
    });
  });
}

function runGradle(buildDir, outFile, { timeoutMs = GRADLE_TIMEOUT_MS, env = process.env } = {}) {
  const gradleVersion = wrapperGradleVersion(buildDir);
  const jdk = jdkForGradle(gradleVersion);
  const javaHome = JDKS[jdk];
  const args = [
    'gradlew', '--no-daemon', '--console=plain', '--init-script', INIT_SCRIPT,
    `-DwsDepsOut=${outFile}`,
    '-Dorg.gradle.configuration-cache=false', '-Dorg.gradle.unsafe.configuration-cache=false',
    '-Dorg.gradle.configureondemand=false',
    'help',
  ];
  return new Promise((resolve) => {
    execFile('sh', args, {
      cwd: buildDir,
      env: { ...env, JAVA_HOME: javaHome, PATH: `${javaHome}/bin:${env.PATH || ''}` },
      timeout: timeoutMs,
      killSignal: 'SIGKILL',
      maxBuffer: 64 * 1024 * 1024,
    }, (error, stdout, stderr) => {
      resolve({ ok: !error, gradleVersion, jdk, error, output: `${stdout}\n${stderr}` });
    });
  });
}

/**
 * Fold the resolved modules of one build into the gradle analysis of test 10.
 * A resolved module replaces the declaration rows of the same group:artifact
 * (the declaration may name another version, or a range, or none); a row from
 * verification-metadata.xml at the same version keeps its hash. Declarations
 * nothing resolved (plugins applied through plugins {}, unresolvable ones)
 * stay as they were.
 */
export function mergeResolved(analysis, modules, lockfile) {
  const fromMetadata = new Map(); // name@version -> row with a hash
  const declared = new Map(); // name -> declaration rows
  for (const e of analysis.entries) {
    if (e.integrity) fromMetadata.set(`${e.name}@${e.version}`, e);
    else {
      if (!declared.has(e.name)) declared.set(e.name, []);
      declared.get(e.name).push(e);
    }
  }
  const resolvedNames = new Set();
  const added = [];
  for (const m of modules.values()) {
    resolvedNames.add(m.name);
    const hashed = fromMetadata.get(`${m.name}@${m.version}`);
    if (hashed) {
      hashed.direct = hashed.direct || m.direct;
      hashed.dev = hashed.dev === false || m.shipped ? false : true;
      continue;
    }
    const decl = declared.get(m.name) || [];
    added.push({
      ecosystem: 'gradle',
      lockfile,
      name: m.name,
      version: m.version,
      resolved: '',
      integrity: '',
      direct: m.direct || decl.length > 0,
      dev: !m.shipped,
      // what the build files ask for is still the pinning story: a floating
      // declaration stays floating even though gradle picked a version today
      tier: decl.some(d => d.tier === 'floating') ? 'floating' : 'version-pinned',
    });
  }
  analysis.entries = analysis.entries
    .filter(e => e.integrity || !resolvedNames.has(e.name))
    .concat(added);
  return added.length;
}

/**
 * Run the resolution on every gradle build of the checkout and merge it into
 * the gradle analysis of `pinning` (test 10's result), in place. A build that
 * fails to configure keeps its declaration rows; the reason goes to the log
 * and to the analysis' resolutionNotes.
 */
export async function resolveGradleDependencies(repoPath, pinning, options = {}) {
  const analysis = pinning.find(a => a.ecosystem === 'gradle');
  if (!analysis) return;
  console.log('\n--- Test 10b: gradle dependency resolution (runs the project\'s gradle wrapper in the container) ---');
  const builds = findGradleBuilds(repoPath);
  if (!builds.length) {
    const note = 'no gradle wrapper found — only the declared dependencies are known';
    console.log(note);
    analysis.resolutionNotes.push(note);
    return;
  }
  const submoduleError = await initSubmodules(repoPath, options);
  if (submoduleError) {
    const note = `git submodules could not be fetched (${submoduleError}) — a build that includes them may fail to configure`;
    console.log(note);
    analysis.resolutionNotes.push(note);
  }
  for (const buildDir of builds.slice(0, MAX_BUILDS)) {
    const rel = path.relative(repoPath, buildDir) || '.';
    const outFile = path.join(buildDir, '.ws-resolved-deps.jsonl');
    const started = Date.now();
    const run = await runGradle(buildDir, outFile, options);
    const seconds = Math.round((Date.now() - started) / 1000);
    let text = '';
    try { text = fs.readFileSync(outFile, 'utf8'); } catch { /* nothing written */ }
    const { modules, unresolved, errors } = parseResolution(text);
    if (!modules.size) {
      const tail = run.output.trim().split('\n').filter(l => l.trim()).slice(-8).join('\n    ');
      const note = `${rel}: gradle resolution failed (gradle ${run.gradleVersion || '?'}, JDK ${run.jdk}, ${seconds} s) — only the declared dependencies are known`;
      console.log(`${note}\n    ${tail}`);
      analysis.resolutionNotes.push(note);
      continue;
    }
    const added = mergeResolved(analysis, modules, `${rel}${RESOLVED_LOCKFILE_SUFFIX}`);
    // test 10's JitPack note assumes only declarations were counted
    analysis.resolutionNotes = analysis.resolutionNotes.map(n => n.startsWith('jitpack.io is in the resolution list, and this pass counts DECLARED')
      ? 'jitpack.io is in the resolution list (transitive JitPack coordinates are included: gradle resolved the graph)' : n);
    const shipped = [...modules.values()].filter(m => m.shipped).length;
    console.log(`${rel}: ${modules.size} modules resolved (${shipped} in release runtime classpaths), ` +
      `${added} rows added, gradle ${run.gradleVersion || '?'}, JDK ${run.jdk}, ${seconds} s`);
    if (!run.ok) console.log('  gradle exited with an error after writing the graph; the rows it wrote are kept');
    if (unresolved.length) {
      const note = `${rel}: ${unresolved.length} dependencies gradle could not resolve (e.g. ${unresolved.slice(0, 5).join(', ')})`;
      console.log(`  ${note}`);
      analysis.resolutionNotes.push(note);
    }
    if (errors.length) console.log(`  ${errors.length} configurations failed to resolve (e.g. ${errors[0]})`);
  }
  if (builds.length > MAX_BUILDS) {
    analysis.resolutionNotes.push(`${builds.length} gradle builds found, only the first ${MAX_BUILDS} were resolved`);
  }
}
