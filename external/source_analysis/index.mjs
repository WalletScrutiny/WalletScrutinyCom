#!/usr/bin/env node

import fs from 'fs';
import minimist from 'minimist';
import { fetchGitHubAssets, fetchDockerAssets, parseDockerImage, checkAuthorIdConsistency, evaluateChangesInNewAsset, loadSecret } from './utils.mjs';
import { backupDatabase, initDatabase, saveAsset, hasExistingAssets } from './ddbbUtils.mjs';
import { runSourceCodeAnalysis } from './appAnalysis.mjs';
import { pruneCache } from './containerRunner.mjs';
import { APPS, APP_LIST_URL, DEFAULT_TEMP_DIR } from './config.mjs';
import { loadAppList, groupByRepository } from './appList.mjs';

// Main function
async function processApp(db, appId, repoUrl, dockerImage = null, githubToken = null, dockerToken = null, includeTestFiles = false) {
  console.log(`\nProcessing app: ${appId}`);
  if (repoUrl) {
    console.log(`  GitHub repo: ${repoUrl}`);
  }
  if (dockerImage) {
    console.log(`  Docker image: ${dockerImage}`);
  }

  try {
    let unchangedCount = 0;
    let addedCount = 0;
    let unknownCount = 0;
    const checkedVersions = new Set(); // Track versions we've already checked for authorId consistency
    const skipSizeComparison = !hasExistingAssets(db, appId);
    if (skipSizeComparison) {
      console.log('  Baseline run: skipping size-change notifications');
    }

    // Fetch GitHub assets
    if (repoUrl) {
      let mostRecentAsset = null;

      if (repoUrl.startsWith('https://github.com/')) {
        console.log('\nFetching GitHub assets...');
        const githubAssets = await fetchGitHubAssets(repoUrl, githubToken);
        console.log(`Found ${githubAssets.length} GitHub assets`);
        
        for (const asset of githubAssets) {
          const shaChangeResult = evaluateChangesInNewAsset(db, appId, asset, { skipSizeComparison });
          const status = saveAsset(db, appId, asset, shaChangeResult);
          if (status === 'unchanged') unchangedCount++;
          else if (status === 'added') {
            addedCount++;
            // Check authorId consistency for new versions (only once per version)
            if (asset.authorId && asset.source === 'github' && !checkedVersions.has(asset.version)) {
              if (!mostRecentAsset || new Date(asset.publishedAt) > new Date(mostRecentAsset.publishedAt)) {
                mostRecentAsset = asset;
              }
              checkedVersions.add(asset.version);
              checkAuthorIdConsistency(db, appId, asset.version, asset.authorId, asset.authorLogin);
            }
          } else if (status === 'unknown') unknownCount++;
        }
      }

      if (mostRecentAsset) {
        await runSourceCodeAnalysis({ name: appId, repoUrl: repoUrl, version: mostRecentAsset.version, includeTestFiles, db });
      } else {
        console.log('  No updates or not a GitHub repo...');
        await runSourceCodeAnalysis({ name: appId, repoUrl: repoUrl, includeTestFiles });
      }
    }

    // Fetch Docker assets if provided
    if (dockerImage) {
      console.log('\nFetching Docker assets...');
      // For ghcr.io, use GitHub token if docker token is not provided
      const { registry } = parseDockerImage(dockerImage);
      const effectiveDockerToken = dockerToken || (registry === 'ghcr.io' && githubToken ? githubToken : null);
      if (registry === 'ghcr.io') {
        if (effectiveDockerToken && !dockerToken) {
          //console.log('Using GitHub token for ghcr.io authentication');
        } else if (!effectiveDockerToken) {
          console.warn('Warning: No token provided for ghcr.io - authentication may fail');
        }
      }
      const dockerAssets = await fetchDockerAssets(dockerImage, effectiveDockerToken);
      console.log(`Found ${dockerAssets.length} Docker assets`);

      for (const asset of dockerAssets) {
        const shaChangeResult = evaluateChangesInNewAsset(db, appId, asset, { skipSizeComparison });
        const status = saveAsset(db, appId, asset, shaChangeResult);
        if (status === 'unchanged') unchangedCount++;
        else if (status === 'added') addedCount++;
        else if (status === 'unknown') unknownCount++;
      }
    }

    console.log(`\n✓  Completed processing ${appId}  unchanged: ${unchangedCount}, added: ${addedCount}, unknown: ${unknownCount}`);
    if (unknownCount > 0) {
      console.warn(`  ⚠ No digest available for ${unknownCount} assets - may be from before 2025 or API issue`);
    }
  } catch (error) {
    console.error(`\n✗  Error processing ${appId}:`, error.message);
    throw error;
  }
}


// Parse command line arguments with minimist
const argv = minimist(process.argv.slice(2), {
  string: ['githubToken', 'dockerToken', 'appList', 'appId'],
  boolean: ['includeTestFiles'],
  alias: {
    githubToken: ['github-token', 'gh-token'],
    dockerToken: ['docker-token', 'docker-token'],
    includeTestFiles: ['include-test-files', 'jsxray-include-tests'],
    appList: ['app-list'],
    appId: ['app-id']
  }
});

// Tokens: GITHUB_TOKEN_FILE / DOCKER_TOKEN_FILE (the service), --githubToken / --dockerToken (dev)
const githubToken = loadSecret({ name: 'GITHUB_TOKEN', fileEnv: 'GITHUB_TOKEN_FILE', argValue: argv.githubToken });
const dockerToken = loadSecret({ name: 'DOCKER_TOKEN', fileEnv: 'DOCKER_TOKEN_FILE', argValue: argv.dockerToken });
const includeTestFiles = Boolean(argv.includeTestFiles);

if (!githubToken && !dockerToken) {
  console.error('No token provided: set GITHUB_TOKEN_FILE (or DOCKER_TOKEN_FILE), or pass --githubToken / --dockerToken');
  process.exit(1);
}

// Backup database before starting the process
backupDatabase();

// Initialize database
const db = initDatabase();

// The site's app list (one job per repository, records sharing a repository
// become aliases of the first one) plus the manual extras from config.mjs.
// --app-list <url|file> overrides the source, --app-id <id> (repeatable)
// restricts the run to jobs whose appId or alias matches.
let jobs;
try {
  const source = argv.appList || APP_LIST_URL;
  const { entries, source: listSource, error } = await loadAppList(db, { source });
  if (listSource === 'cache') {
    console.warn(`Warning: could not fetch the app list from ${source} (${error}); using the cached copy`);
  }
  const { jobs: siteJobs, skipped } = groupByRepository(entries);
  for (const e of skipped) {
    console.warn(`Skipping ${e.appId} (${e.platform}): '${e.repository}' does not name a repository`);
  }
  console.log(`App list: ${entries.length} records, ${siteJobs.length} repositories, ${skipped.length} skipped (from ${listSource})`);
  jobs = [...siteJobs, ...APPS];
} catch (error) {
  console.error(`✗  ${error.message}`);
  db.close();
  process.exit(1);
}

const wantedIds = [].concat(argv.appId || []).filter(Boolean);
if (wantedIds.length) {
  jobs = jobs.filter(j => wantedIds.includes(j.appId) || (j.aliases || []).some(a => wantedIds.includes(a.appId)));
}

// Leftovers of an interrupted pass (each repository's scratch dir is deleted
// when its analysis ends; a kill mid-way leaves one behind).
fs.rmSync(DEFAULT_TEMP_DIR, { recursive: true, force: true });

console.log(`Processing ${jobs.length} app(s)...\n`);

try {
  let successCount = 0;
  let errorCount = 0;

  // Process each app
  for (const app of jobs) {
    if (!app.appId || (!app.repoUrl && !app.dockerImage)) {
      console.error(`\n✗  Skipping invalid app configuration:`, app);
      errorCount++;
      continue;
    }

    try {
      if (app.aliases && app.aliases.length > 1) {
        console.log(`  Also listed as: ${app.aliases.slice(1).map(a => `${a.appId} (${a.platform})`).join(', ')}`);
      }
      // For ghcr.io, use GitHub token if docker token is not provided
      const appGithubToken = app.githubToken || githubToken;
      let effectiveDockerToken = app.dockerToken || dockerToken;
      if (!effectiveDockerToken && app.dockerImage) {
        const { registry } = parseDockerImage(app.dockerImage);
        if (registry === 'ghcr.io') {
          if (appGithubToken) {
            effectiveDockerToken = appGithubToken;
            console.log(`Using GitHub token for ghcr.io registry (app: ${app.appId})`);
          } else {
            console.warn(`Warning: No GitHub token provided for ghcr.io registry (app: ${app.appId})`);
            console.warn(`  Attempting without token - may fail if repository requires authentication`);
            console.warn(`  For authenticated access, provide --githubToken or configure githubToken in APPS array`);
          }
        }
      }
      
      await processApp(
        db,
        app.appId,
        app.repoUrl || null,
        app.dockerImage || null,
        appGithubToken,
        effectiveDockerToken,
        includeTestFiles
      );
      successCount++;
    } catch (error) {
      console.error(`\n✗  Failed to process ${app.appId}:`, error.message);
      errorCount++;
      // Continue with next app instead of stopping
    }
  }

  // Scratch dirs are deleted per repository; the shared package caches only
  // when they outgrow their cap.
  fs.rmSync(DEFAULT_TEMP_DIR, { recursive: true, force: true });
  pruneCache();

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Summary: ${successCount} succeeded, ${errorCount} failed`);
  console.log(`${'='.repeat(50)}`);

  if (errorCount > 0) {
    process.exit(1);
  }
} catch (error) {
  console.error('Fatal error:', error.message);
  process.exit(1);
} finally {
  db.close();
}
