#!/usr/bin/env node
// What every analysis needs whichever plugins are on: clone the repository,
// detect its ecosystem, and run the plugins (plugins.mjs) on the checkout, in
// the analysis container and then on the host. The checks themselves live in
// plugins/, one file each.

import fs from 'fs';
import os from 'os';
import path from 'path';
import { execSync, execFile } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { DEFAULT_TEMP_DIR, APP_TYPES } from './config.mjs';
import { ensureImage, runInContainer } from './containerRunner.mjs';
import { loadPlugins, runPlugins } from './plugins.mjs';
// ddbbUtils (better-sqlite3, a native module) is imported lazily, by the
// plugins' host steps only: this module is also loaded inside the analysis
// container (containerEntry.mjs), where only pure-JS packages are available.

/**
 * Detect the type of application based on dependency files
 */
export function detectAppType(repoPath) {
  if (fs.existsSync(path.join(repoPath, 'package.json'))) {
    return APP_TYPES.NPM;
  }
  
  if (fs.existsSync(path.join(repoPath, 'build.gradle')) || 
      fs.existsSync(path.join(repoPath, 'build.gradle.kts'))) {
    return APP_TYPES.GRADLE;
  }
  
  if (fs.existsSync(path.join(repoPath, 'pom.xml'))) {
    return APP_TYPES.MAVEN;
  }
  
  if (fs.existsSync(path.join(repoPath, 'requirements.txt')) ||
      fs.existsSync(path.join(repoPath, 'setup.py')) ||
      fs.existsSync(path.join(repoPath, 'pyproject.toml'))) {
    return APP_TYPES.PIP;
  }
  
  return APP_TYPES.UNKNOWN;
}

/**
 * Clone a git repository to a temporary directory
 */
export async function cloneRepository(repoUrl, targetPath, tagName = null) {
  console.log(`Cloning repository ${repoUrl} to ${targetPath} ${tagName ? `with tag ${tagName}` : 'at its default branch'}...`);
  try {
    fs.rmSync(targetPath, { recursive: true, force: true });
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });

    const branch = tagName ? `--branch ${tagName} ` : '';
    execSync(`git clone ${branch}--depth 1 ${repoUrl} "${targetPath}"`, {
      stdio: 'pipe',
      timeout: 60000
    });
    return true;
  } catch (error) {
    console.error(`Error cloning repository ${repoUrl}:`, error.message);
    return false;
  }
}

/**
 * Commit the remote's default branch (HEAD) points at, or null when it cannot
 * be read. Runs on the host and only talks to the remote: nothing is checked out.
 */
export async function remoteHeadCommit(repoUrl, { timeoutMs = 60000 } = {}) {
  try {
    const { stdout } = await promisify(execFile)('git', ['ls-remote', '--', repoUrl, 'HEAD'], {
      encoding: 'utf8',
      timeout: timeoutMs,
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
    });
    // The pattern also matches refs ending in /HEAD (refs/pull/123/HEAD on
    // Forgejo/Gitea), so pick the line for HEAD itself.
    const line = stdout.split('\n').find(l => l.split('\t')[1] === 'HEAD');
    const sha = line ? line.split('\t')[0] : null;
    return /^[0-9a-f]{40}([0-9a-f]{24})?$/.test(sha) ? sha : null;
  } catch (error) {
    console.log(`Could not read the default branch of ${repoUrl}: ${error.message.split('\n')[0]}`);
    return null;
  }
}

/**
 * Commit time (Date) of the remote's default branch, or null when it cannot be
 * read. A shallow fetch of the one commit object, no trees or blobs: about a
 * hundred kilobytes and a second, from any host.
 */
export async function remoteHeadDate(repoUrl, { timeoutMs = 60000 } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'head-date-'));
  const git = (args) => promisify(execFile)('git', ['-C', dir, ...args], {
    encoding: 'utf8',
    timeout: timeoutMs,
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
  });
  try {
    await git(['init', '-q', '--bare']);
    await git(['fetch', '-q', '--depth=1', '--filter=tree:0', '--', repoUrl, 'HEAD']);
    const { stdout } = await git(['log', '-1', '--format=%ct', 'FETCH_HEAD']);
    const seconds = Number(stdout.trim());
    return seconds > 0 ? new Date(seconds * 1000) : null;
  } catch (error) {
    console.log(`Could not read the last commit of ${repoUrl}: ${error.message.split('\n')[0]}`);
    return null;
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * The container steps of the enabled plugins (PLUGINS in config.mjs), on the
 * checkout. Runs INSIDE the analysis container (containerEntry.mjs).
 * Returns what goes back to the host: each plugin's result by name, and the
 * plugins that failed.
 */
export async function runChecksOnCheckout(repoPath, appType, { includeTestFiles = false } = {}) {
  const plugins = await loadPlugins();
  const { results, failed } = await runPlugins(plugins, 'container', { repoPath, appType, options: { includeTestFiles } });
  return { results, failed };
}

/**
 * What an analysis saw, for the analyses table: the lockfiles the pinning
 * step read, the dependency rows it produced, what the OSV step checked
 * and skipped (plugins/osv.mjs checkVulnerabilities), and which manifests
 * have no lockfile (plugins/lock-coverage.mjs). Plugins that are off
 * leave their fields null.
 */
export function summarizeResults(results = {}, plugins = []) {
  const pinning = Array.isArray(results.pinning) ? results.pinning : null;
  const osv = results.osv && typeof results.osv === 'object' ? results.osv : null;
  const coverage = results['lock-coverage'] && typeof results['lock-coverage'] === 'object' ? results['lock-coverage'] : null;
  return {
    plugins: plugins.map(p => p.name),
    lockfiles: pinning ? pinning.flatMap(a => a.lockfiles || []) : [],
    dependencies: pinning ? pinning.reduce((n, a) => n + (a.entries || []).length, 0) : null,
    osvChecked: osv ? osv.checked ?? null : null,
    osvSkipped: osv ? osv.skipped || {} : {},
    vulnerabilities: osv ? (osv.findings || []).length : null,
    lockCoverage: coverage,
  };
}

// Which analyser produced a row: the package version, plus the git revision
// the deploy script writes to REVISION (a dev checkout has none).
export function analyserVersion() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  let version = 'unknown';
  try { version = JSON.parse(fs.readFileSync(path.join(here, 'package.json'), 'utf8')).version || version; } catch { /* keep unknown */ }
  let revision = '';
  try { revision = fs.readFileSync(path.join(here, 'REVISION'), 'utf8').trim().slice(0, 12); } catch { /* dev checkout */ }
  return revision ? `${version}+${revision}` : version;
}

/**
 * Analyse one repository at one ref (the new release's tag, or the default
 * branch when nothing new was found). Clone and the plugins' container steps
 * run in a throwaway container (containerRunner.mjs); the plugins' host steps
 * (OSV lookup, Semgrep, storing results) then run on the checkout and the
 * results the container left behind; the host deletes the scratch directory.
 * Resolves to the container's result (with the analysed `commit` and every
 * plugin's `results`) when the analysis ran and no plugin failed, null
 * otherwise; failures are logged, never thrown.
 */
export async function runSourceCodeAnalysis({ name, repoUrl, version = null, includeTestFiles = false, db = null }) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing: ${name} - Repository: ${repoUrl} - ${version ? `Tag: ${version}` : 'default branch'}`);
  console.log('='.repeat(60));

  const workDir = path.join(DEFAULT_TEMP_DIR, name.replace(/[^a-zA-Z0-9.-]/g, '_'));
  fs.rmSync(workDir, { recursive: true, force: true });
  fs.mkdirSync(workDir, { recursive: true });

  // Host only (the container never has a database): ddbbUtils stays a lazy import.
  const record = async (fields) => {
    if (!db) return;
    const { recordAnalysis } = await import('./ddbbUtils.mjs');
    recordAnalysis(db, { appId: name, kind: version ? 'release' : 'default-branch', ref: version || fields.commit || 'unknown', analyser: analyserVersion(), ...fields });
  };
  try {
    const plugins = await loadPlugins();
    ensureImage();
    const result = await runInContainer({ name, repoUrl, ref: version, includeTestFiles, workDir });
    if (!result.ok) {
      console.log(`Analysis of ${name} failed in the container: ${result.error}. Skipping...`);
      await record({ status: 'failed', error: String(result.error || 'container failed'), commit: result.commit || null, appType: result.appType || null });
      return null;
    }
    const ctx = {
      name, version, db, repoPath: path.join(workDir, 'repo'), appType: result.appType,
      options: { includeTestFiles }, results: result.results || {}, failed: result.failed || [],
    };
    await runPlugins(plugins, 'host', ctx);
    const seen = summarizeResults(ctx.results, plugins);
    if (ctx.failed.length) {
      const error = ctx.failed.map(f => `${f.plugin} (${f.error})`).join(', ');
      console.log(`Analysis of ${name} failed: ${error}`);
      await record({ status: 'failed', error, commit: result.commit, appType: result.appType, ...seen });
      return null;
    }
    await record({ status: result.appType === APP_TYPES.UNKNOWN ? 'unsupported' : 'ok', commit: result.commit, appType: result.appType, ...seen });
    return { ...result, results: ctx.results };
  } catch (error) {
    console.error(`Analysis of ${name} failed: ${error.message}`);
    await record({ status: 'failed', error: error.message }).catch(() => {});
    return null;
  } finally {
    // Clone, node_modules and result: nothing of it is needed after this point.
    try {
      fs.rmSync(workDir, { recursive: true, force: true });
    } catch (error) {
      console.error(`Error cleaning up ${workDir}:`, error.message);
    }
  }
}
