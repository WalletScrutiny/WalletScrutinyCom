#!/usr/bin/env node
// What every analysis needs whichever plugins are on: clone the repository,
// detect its ecosystem, and run the plugins (plugins.mjs) on the checkout, in
// the analysis container and then on the host. The checks themselves live in
// plugins/, one file each.

import fs from 'fs';
import path from 'path';
import { execSync, execFile } from 'child_process';
import { promisify } from 'util';
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

  try {
    const plugins = await loadPlugins();
    ensureImage();
    const result = await runInContainer({ name, repoUrl, ref: version, includeTestFiles, workDir });
    if (!result.ok) {
      console.log(`Analysis of ${name} failed in the container: ${result.error}. Skipping...`);
      return null;
    }
    const ctx = {
      name, version, db, repoPath: path.join(workDir, 'repo'), appType: result.appType,
      options: { includeTestFiles }, results: result.results || {}, failed: result.failed || [],
    };
    await runPlugins(plugins, 'host', ctx);
    if (ctx.failed.length) {
      console.log(`Analysis of ${name} failed: ${ctx.failed.map(f => `${f.plugin} (${f.error})`).join(', ')}`);
      return null;
    }
    return { ...result, results: ctx.results };
  } catch (error) {
    console.error(`Analysis of ${name} failed: ${error.message}`);
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
