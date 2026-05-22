#!/usr/bin/env node

import minimist from 'minimist';
import { fetchGitHubAssets, fetchDockerAssets, parseDockerImage, checkAuthorIdConsistency, evaluateChangesInNewAsset } from './utils.mjs';
import { backupDatabase, initDatabase, saveAsset, hasExistingAssets } from './ddbbUtils.mjs';
import { runSourceCodeAnalysis } from './appAnalysis.mjs';
import { APPS } from './config.mjs';

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
        await runSourceCodeAnalysis({ name: appId, repoUrl: repoUrl, version: mostRecentAsset.version, includeTestFiles });
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
  string: ['githubToken', 'dockerToken'],
  boolean: ['includeTestFiles'],
  alias: {
    githubToken: ['github-token', 'gh-token'],
    dockerToken: ['docker-token', 'docker-token'],
    includeTestFiles: ['include-test-files', 'jsxray-include-tests']
  }
});

// Extract token arguments
const githubToken = argv.githubToken || null;
const dockerToken = argv.dockerToken || null;
const includeTestFiles = Boolean(argv.includeTestFiles);

if (!githubToken && !dockerToken) {
  console.log('No tokens provided via command line');
  process.exit(1);
}

// Check if apps are configured
if (APPS.length === 0) {
  console.error('No apps configured. Please add apps to the APPS array in index.mjs');
  console.error('\nExample:');
  console.error('  const APPS = [');
  console.error('    { appId: \'myapp\', repoUrl: \'https://github.com/user/repo\' },');
  console.error('    { appId: \'myapp2\', repoUrl: \'https://github.com/user/repo2\', dockerImage: \'user/image\' },');
  console.error('  ];');
  process.exit(1);
}

console.log(`Processing ${APPS.length} app(s)...\n`);

// Backup database before starting the process
backupDatabase();

// Initialize database
const db = initDatabase();

try {
  let successCount = 0;
  let errorCount = 0;

  // Process each app
  for (const app of APPS) {
    if (!app.appId || (!app.repoUrl && !app.dockerImage)) {
      console.error(`\n✗  Skipping invalid app configuration:`, app);
      errorCount++;
      continue;
    }

    try {
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
