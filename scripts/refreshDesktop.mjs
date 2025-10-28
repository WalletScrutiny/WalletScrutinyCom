#!/usr/bin/env node

/**
 * Desktop wallet refresh script
 * Updates version information for desktop wallet markdown files
 */

import path from 'path';
import minimist from 'minimist';
import {
  colors,
  createStats,
  getGitHubToken,
  generateReport,
  getMarkdownFiles,
  sleep,
  processFileCommon
} from './refresh_common.mjs';
import { 
  fetchLatestRelease,
  fetchAllTags,
  fetchAllReleases, // Added for Stack Wallet
  extractRepoPath,
  createGitHubRequest,
  getRateLimitDelay
} from './github_common.mjs';

// Parse command line arguments
const args = minimist(process.argv.slice(2), {
  boolean: ['r', 'help', 'd', 'debug', 'n', 'dry-run'],
  string: ['g'],
  alias: {
    r: 'report',
    g: 'github-token',
    h: 'help',
    d: 'debug',
    n: 'dry-run'
  }
});

// Configuration
const DESKTOP_DIR = '_desktop';
const VALID_VERDICTS = ['sourceavailable', 'wip', 'reproducible'];
const VALID_META = 'ok';

// Statistics tracking
const stats = createStats();

// Special handler for Electrum which has non-version tags like 'seed_v10'
// that can be mistaken for the latest release.

// Special handler for Electrum which has non-version tags like 'seed_v10'
// that can be mistaken for the latest release.
async function fetchLatestElectrumRelease(repoUrl, token) {
  const repoPath = extractRepoPath(repoUrl);
  const allTags = await fetchAllTags(repoPath, token);

  // Filter for tags that look like versions, e.g., 4.5.8 or 4.6.0b1
  const versionTags = allTags
    .map(tag => tag.name)
    .filter(name => /^\d+\.\d+\.\d+(b\d+)?$/.test(name));

  if (versionTags.length === 0) {
    throw new Error(`No valid version tags found for Electrum in ${repoUrl}`);
  }

  // Sort tags semantically to find the latest version.
  versionTags.sort((a, b) => {
    const aParts = a.replace('b', '.').split('.').map(Number);
    const bParts = b.replace('b', '.').split('.').map(Number);
    const len = Math.max(aParts.length, bParts.length);
    for (let i = 0; i < len; i++) {
      const valA = aParts[i] || 0;
      const valB = bParts[i] || 0;
      if (valA !== valB) return valB - valA;
    }
    return 0;
  });

  const latestVersion = versionTags[0];
  const latestTagObject = allTags.find(tag => tag.name === latestVersion);
  const github = createGitHubRequest(token);
  try {
    const commitResponse = await github.get(`/repos/${repoPath}/commits/${latestTagObject.commit.sha}`);
    return {
      version: latestTagObject.name,
      date: commitResponse.data.commit.committer.date.split('T')[0],
      url: `https://github.com/${repoPath}/releases/tag/${latestTagObject.name}`
    };
  } catch (commitError) {
    return {
      version: latestTagObject.name,
      date: new Date().toISOString().split('T')[0],
      url: `https://github.com/${repoPath}/releases/tag/${latestTagObject.name}`
    };
  }
}

async function fetchLatestLedgerLiveRelease(repoUrl, token) {
  const repoPath = extractRepoPath(repoUrl);
  const allTags = await fetchAllTags(repoPath, token);
  const desktopVersionPrefix = '@ledgerhq/live-desktop@';

  const versionTags = allTags
    .map(tag => tag.name)
    .filter(name => name.startsWith(desktopVersionPrefix))
    .map(name => name.substring(desktopVersionPrefix.length)); // Extract X.Y.Z

  if (versionTags.length === 0) {
    throw new Error(`No valid desktop version tags found for Ledger Live in ${repoUrl}`);
  }

  versionTags.sort((a, b) => {
    const aParts = a.split('.').map(Number);
    const bParts = b.split('.').map(Number);
    const len = Math.max(aParts.length, bParts.length);
    for (let i = 0; i < len; i++) {
      const valA = aParts[i] || 0;
      const valB = bParts[i] || 0;
      if (valA !== valB) return valB - valA;
    }
    return 0;
  });

  const latestVersionNumber = versionTags[0];
  const originalTagName = `${desktopVersionPrefix}${latestVersionNumber}`;
  const latestTagObject = allTags.find(tag => tag.name === originalTagName);

  const github = createGitHubRequest(token);
  try {
    const commitResponse = await github.get(`/repos/${repoPath}/commits/${latestTagObject.commit.sha}`);
    return {
      version: latestVersionNumber, // Return only X.Y.Z
      date: commitResponse.data.commit.committer.date.split('T')[0],
      url: `https://github.com/${repoPath}/releases/tag/${originalTagName}`
    };
  } catch (commitError) {
    return {
      version: latestVersionNumber,
      date: new Date().toISOString().split('T')[0],
      url: `https://github.com/${repoPath}/releases/tag/${originalTagName}`
    };
  }
}

async function fetchLatestBtcWalletRelease(repoUrl, token) {
  const repoPath = extractRepoPath(repoUrl);
  const allTags = await fetchAllTags(repoPath, token);
  // Filter for tags like vX.Y.Z, excluding those with '/' (sub-modules)
  const versionTags = allTags
    .map(tag => tag.name)
    .filter(name => /^v\d+\.\d+\.\d+$/.test(name) && !name.includes('/'));

  if (versionTags.length === 0) {
    throw new Error(`No valid top-level version tags found for BtcWallet in ${repoUrl}`);
  }

  versionTags.sort((a, b) => {
    const aParts = a.substring(1).split('.').map(Number); // remove 'v' before splitting
    const bParts = b.substring(1).split('.').map(Number);
    const len = Math.max(aParts.length, bParts.length);
    for (let i = 0; i < len; i++) {
      const valA = aParts[i] || 0;
      const valB = bParts[i] || 0;
      if (valA !== valB) return valB - valA;
    }
    return 0;
  });

  const latestVersion = versionTags[0];
  const latestTagObject = allTags.find(tag => tag.name === latestVersion);
  const github = createGitHubRequest(token);
  try {
    const commitResponse = await github.get(`/repos/${repoPath}/commits/${latestTagObject.commit.sha}`);
    return {
      version: latestTagObject.name,
      date: commitResponse.data.commit.committer.date.split('T')[0],
      url: `https://github.com/${repoPath}/releases/tag/${latestTagObject.name}`
    };
  } catch (commitError) {
    return {
      version: latestTagObject.name,
      date: new Date().toISOString().split('T')[0],
      url: `https://github.com/${repoPath}/releases/tag/${latestTagObject.name}`
    };
  }
}

async function fetchLatestStackWalletRelease(repoUrl, token) {
  const repoPath = extractRepoPath(repoUrl);
  const allReleases = await fetchAllReleases(repoPath, token);
  const prefix = 'Stack Wallet v';

  const matchingReleases = allReleases
    .filter(release => release.name && release.name.startsWith(prefix))
    .map(release => ({
      versionNumber: release.name.substring(prefix.length),
      date: release.published_at.split('T')[0],
      url: release.html_url,
      originalName: release.name // Keep original name for reference if needed
    }));

  if (matchingReleases.length === 0) {
    throw new Error(`No releases found with name starting with '${prefix}' for StackWallet in ${repoUrl}`);
  }

  // Sort by version number
  matchingReleases.sort((a, b) => {
    const aParts = a.versionNumber.split('.').map(Number);
    const bParts = b.versionNumber.split('.').map(Number);
    const len = Math.max(aParts.length, bParts.length);
    for (let i = 0; i < len; i++) {
      const valA = aParts[i] || 0;
      const valB = bParts[i] || 0;
      if (valA !== valB) return valB - valA; // Descending sort
    }
    return 0;
  });

  const latestRelease = matchingReleases[0];

  return {
    version: latestRelease.versionNumber,
    date: latestRelease.date,
    url: latestRelease.url
  };
}


async function fetchLatestBitcoinKeeperRelease(repoUrl, token) {
  const repoPath = extractRepoPath(repoUrl);
  const allTags = await fetchAllTags(repoPath, token);
  const prefix = 'keeper-desktop-v';

  const versionTags = allTags
    .map(tag => tag.name)
    .filter(name => name.startsWith(prefix) && name.toLowerCase().includes('desktop'))
    .map(name => name.substring(prefix.length));

  if (versionTags.length === 0) {
    throw new Error(`No valid desktop version tags found for Bitcoin Keeper in ${repoUrl}`);
  }

  versionTags.sort((a, b) => {
    const aParts = a.split('.').map(Number);
    const bParts = b.split('.').map(Number);
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const valA = aParts[i] || 0;
      const valB = bParts[i] || 0;
      if (valA !== valB) return valB - valA;
    }
    return 0;
  });

  const latestVersionNumber = versionTags[0];
  const originalTagName = `${prefix}${latestVersionNumber}`;
  const latestTagObject = allTags.find(tag => tag.name === originalTagName);
  const github = createGitHubRequest(token);
  try {
    const commitResponse = await github.get(`/repos/${repoPath}/commits/${latestTagObject.commit.sha}`);
    return {
      version: latestVersionNumber,
      date: commitResponse.data.commit.committer.date.split('T')[0],
      url: `https://github.com/${repoPath}/releases/tag/${originalTagName}`
    };
  } catch (commitError) {
    return {
      version: latestVersionNumber,
      date: new Date().toISOString().split('T')[0],
      url: `https://github.com/${repoPath}/releases/tag/${originalTagName}`
    };
  }
}

async function fetchLatestBlockstreamGreenRelease(repoUrl, token) {
  const repoPath = extractRepoPath(repoUrl);
  const allTags = await fetchAllTags(repoPath, token);
  const prefix = 'release_';

  const versionTags = allTags
    .map(tag => tag.name)
    .filter(name => name.startsWith(prefix))
    .map(name => name.substring(prefix.length));

  if (versionTags.length === 0) {
    throw new Error(`No valid version tags found for Blockstream Green in ${repoUrl}`);
  }

  versionTags.sort((a, b) => {
    const aParts = a.split('.').map(Number);
    const bParts = b.split('.').map(Number);
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const valA = aParts[i] || 0;
      const valB = bParts[i] || 0;
      if (valA !== valB) return valB - valA;
    }
    return 0;
  });

  const latestVersionNumber = versionTags[0];
  const originalTagName = `${prefix}${latestVersionNumber}`;
  const latestTagObject = allTags.find(tag => tag.name === originalTagName);
  const github = createGitHubRequest(token);
  try {
    const commitResponse = await github.get(`/repos/${repoPath}/commits/${latestTagObject.commit.sha}`);
    return {
      version: latestVersionNumber,
      date: commitResponse.data.commit.committer.date.split('T')[0],
      url: `https://github.com/${repoPath}/releases/tag/${originalTagName}`
    };
  } catch (commitError) {
    return {
      version: latestVersionNumber,
      date: new Date().toISOString().split('T')[0],
      url: `https://github.com/${repoPath}/releases/tag/${originalTagName}`
    };
  }
}

async function fetchLatestCaravanRelease(repoUrl, token) {
  const repoPath = extractRepoPath(repoUrl);
  const allTags = await fetchAllTags(repoPath, token);
  const prefix = 'caravan-v';

  const versionNumbers = allTags
    .map(tag => tag.name)
    .filter(name => name.startsWith(prefix))
    .map(name => name.substring(prefix.length));

  if (versionNumbers.length === 0) {
    throw new Error(`No valid '${prefix}X.Y.Z' tags found for Caravan in ${repoUrl}`);
  }

  versionNumbers.sort((a, b) => {
    const aParts = a.split('.').map(Number);
    const bParts = b.split('.').map(Number);
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const valA = aParts[i] || 0;
      const valB = bParts[i] || 0;
      if (valA !== valB) return valB - valA;
    }
    return 0;
  });

  const latestVersionNumber = versionNumbers[0];
  const originalTagName = `${prefix}${latestVersionNumber}`;
  const latestTagObject = allTags.find(tag => tag.name === originalTagName);
  const github = createGitHubRequest(token);
  try {
    const commitResponse = await github.get(`/repos/${repoPath}/commits/${latestTagObject.commit.sha}`);
    return {
      version: latestVersionNumber,
      date: commitResponse.data.commit.committer.date.split('T')[0],
      url: `https://github.com/${repoPath}/releases/tag/${originalTagName}`
    };
  } catch (commitError) {
    return {
      version: latestVersionNumber,
      date: new Date().toISOString().split('T')[0],
      url: `https://github.com/${repoPath}/releases/tag/${originalTagName}`
    };
  }
}

async function fetchLatestLilyWalletRelease(repoUrl, token) {
  const repoPath = extractRepoPath(repoUrl);
  const allTags = await fetchAllTags(repoPath, token);
  const prefix = 'lily-wallet-v';

  const versionNumbers = allTags
    .map(tag => tag.name)
    .filter(name => name.startsWith(prefix))
    .map(name => name.substring(prefix.length));

  if (versionNumbers.length === 0) {
    throw new Error(`No valid '${prefix}X.Y.Z' tags found for Lily Wallet in ${repoUrl}`);
  }

  versionNumbers.sort((a, b) => {
    const aParts = a.split('.').map(Number);
    const bParts = b.split('.').map(Number);
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const valA = aParts[i] || 0;
      const valB = bParts[i] || 0;
      if (valA !== valB) return valB - valA;
    }
    return 0;
  });

  const latestVersionNumber = versionNumbers[0];
  const originalTagName = `${prefix}${latestVersionNumber}`;
  const latestTagObject = allTags.find(tag => tag.name === originalTagName);
  const github = createGitHubRequest(token);
  try {
    const commitResponse = await github.get(`/repos/${repoPath}/commits/${latestTagObject.commit.sha}`);
    return {
      version: latestVersionNumber,
      date: commitResponse.data.commit.committer.date.split('T')[0],
      url: `https://github.com/${repoPath}/releases/tag/${originalTagName}`
    };
  } catch (commitError) {
    return {
      version: latestVersionNumber,
      date: new Date().toISOString().split('T')[0],
      url: `https://github.com/${repoPath}/releases/tag/${originalTagName}`
    };
  }
}

function showUsage() {
  console.log(`
Usage: node scripts/refreshDesktop.mjs [options]

Options:
  -g, --github-token <token>  GitHub Personal Access Token
  -r, --report               Generate detailed report
  -d, --debug                Show detailed debug information including invalid files
  -n, --dry-run              Show what would be updated without writing changes
  -h, --help                 Show this help message

Environment:
  GITHUB_TOKEN               GitHub token (fallback if -g not provided)

Examples:
  node scripts/refreshDesktop.mjs -g ghp_xxxxxxxxxxxx
  node scripts/refreshDesktop.mjs -r -g ghp_xxxxxxxxxxxx
  GITHUB_TOKEN=ghp_xxxx node scripts/refreshDesktop.mjs -r
`);
}

// Version fetcher for desktop wallets with special handling
async function getDesktopVersion(fileName, repoUrl, token) {
  const baseName = path.basename(fileName);

  if (baseName === 'electrum.md') {
    console.log(`  ${colors.cyan}Applying special Electrum version fetching logic...${colors.reset}`);
    return await fetchLatestElectrumRelease(repoUrl, token);
  } else if (baseName === 'btcsuite.btcwallet.md') {
    console.log(`  ${colors.cyan}Applying special BtcWallet version fetching logic...${colors.reset}`);
    return await fetchLatestBtcWalletRelease(repoUrl, token);
  } else if (baseName === 'desk.stackwallet.md') {
    console.log(`  ${colors.cyan}Applying special StackWallet version fetching logic...${colors.reset}`);
    return await fetchLatestStackWalletRelease(repoUrl, token);
  } else if (baseName === 'ledger.live.md') {
    console.log(`  ${colors.cyan}Applying special Ledger Live version fetching logic...${colors.reset}`);
    return await fetchLatestLedgerLiveRelease(repoUrl, token);
  } else if (baseName === 'bitcoinkeeper.md') {
    console.log(`  ${colors.cyan}Applying special Bitcoin Keeper version fetching logic...${colors.reset}`);
    return await fetchLatestBitcoinKeeperRelease(repoUrl, token);
  } else if (baseName === 'blockstreamgreen.md') {
    console.log(`  ${colors.cyan}Applying special Blockstream Green version fetching logic...${colors.reset}`);
    return await fetchLatestBlockstreamGreenRelease(repoUrl, token);
  } else if (baseName === 'caravan.md') {
    console.log(`  ${colors.cyan}Applying special Caravan version fetching logic...${colors.reset}`);
    return await fetchLatestCaravanRelease(repoUrl, token);
  } else if (baseName === 'lilywallet.md') {
    console.log(`  ${colors.cyan}Applying special Lily Wallet version fetching logic...${colors.reset}`);
    return await fetchLatestLilyWalletRelease(repoUrl, token);
  } else {
    return await fetchLatestRelease(repoUrl, token);
  }
}

async function processFile(fileName) {
  await processFileCommon(fileName, {
    directory: DESKTOP_DIR,
    validVerdicts: VALID_VERDICTS,
    validMeta: VALID_META,
    emoji: '📱',
    versionFetcher: getDesktopVersion,
    getToken: () => getGitHubToken(args),
    stats,
    dryRun: args['dry-run'] || false
  });
}

async function main() {
  if (args.help) {
    showUsage();
    return;
  }
  
  const token = getGitHubToken(args);
  if (!token) {
    console.log(`${colors.yellow}⚠️  No GitHub token provided. API requests may be rate limited.${colors.reset}`);
    console.log(`   Use -g <token> or set GITHUB_TOKEN environment variable.`);
  }
  
  console.log(`${colors.cyan}🖥️  Refreshing desktop wallet versions...${args['dry-run'] ? ' (DRY RUN)' : ''}${colors.reset}`);
  
  try {
    const files = getMarkdownFiles(DESKTOP_DIR);
    stats.processed = files.length;
    
    console.log(`Found ${files.length} desktop wallet files`);
    console.log(`with 'meta:ok' and 'verdict: sourceavailable'`);
    if (args['dry-run']) {
      console.log(`${colors.yellow}⚠ Dry-run mode: No files will be modified${colors.reset}`);
    }
    
    const delay = getRateLimitDelay(!!token);
    
    // Process files sequentially to avoid rate limiting
    for (const file of files) {
      await processFile(file);
      // Rate limiting delay
      await sleep(delay);
    }
    
    const action = args['dry-run'] ? 'would be updated' : 'updated';
    console.log(`\n${colors.green}✓ Completed${colors.reset}: ${stats.updated} files ${action} out of ${stats.processed} processed`);
    
    generateReport(stats, args, 'desktop');
    
  } catch (error) {
    console.error(`${colors.red}Fatal error:${colors.reset} ${error.message}`);
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error(`${colors.red}Unexpected error:${colors.reset} ${error.message}`);
  process.exit(1);
});
