#!/usr/bin/env node

/**
 * Hardware wallet refresh script
 * Updates version information for hardware wallet markdown files
 */

import path from 'path';
import minimist from 'minimist';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import {
  colors,
  createStats,
  getGitHubToken,
  generateReport,
  getMarkdownFiles,
  sleep,
  debugLog,
  normalizeVersion,
  processFileCommon
} from './refresh_common.mjs';
import { 
  fetchAllTags,
  fetchCommitInfo,
  extractRepoPath,
  getRateLimitDelay,
  fetchLatestRelease
} from './github_common.mjs';

// Parse command line arguments
const args = minimist(process.argv.slice(2), {
  boolean: ['d', 'help', 'n', 'dry-run'],
  string: ['g'],
  alias: {
    d: 'debug',
    g: 'github-token',
    h: 'help',
    n: 'dry-run'
  }
});

// Configuration
const HARDWARE_DIR = '_hardware';
const VALID_VERDICTS = ['sourceavailable'];
const VALID_META = 'ok';

// Statistics tracking
const stats = createStats();

function showUsage() {
  console.log(`
Usage: node scripts/refreshHardware.mjs [options]

Options:
  -g, --github-token <token>  GitHub Personal Access Token
  -d, --debug                Enable debug output
  -n, --dry-run              Show what would be updated without writing changes
  -h, --help                 Show this help message

Environment:
  GITHUB_TOKEN               GitHub token (fallback if -g not provided)

Examples:
  node scripts/refreshHardware.mjs -g ghp_xxxxxxxxxxxx
  node scripts/refreshHardware.mjs -d -g ghp_xxxxxxxxxxxx
  node scripts/refreshHardware.mjs --dry-run -g ghp_xxxxxxxxxxxx
  GITHUB_TOKEN=ghp_xxxx node scripts/refreshHardware.mjs
`);
}

// Device-specific version fetchers
async function fetchColdcardVersion(model, token) {
  const regex = {
    mk4: /v5\.[0-9]+\.[0-9]+$/,
    mk3: /v4\.[0-9]+\.[0-9]+$/,
    mk2: /v4\.[0-9]+\.[0-9]+$/,
    mk1: /v3\.[0-9]+\.[0-9]+$/,
    q: /v1\.[0-9]+\.[0-9]+Q$/
  };

  if (!regex[model]) {
    throw new Error(`Unknown Coldcard model: ${model}`);
  }

  try {
    const tags = await fetchAllTags('Coldcard/firmware', token);
    
    if (!tags || tags.length === 0) {
      throw new Error('No tags found');
    }

    // Extract versions from tag names
    const versions = tags
      .map(tag => tag.name)
      .map(name => {
        const match = name.match(/-v([0-9]+\.[0-9]+\.[0-9]+[A-Z]*)/);
        return match ? `v${match[1]}` : null;
      })
      .filter(v => v && regex[model].test(v))
      .sort((a, b) => {
        // Simple version sort
        const aParts = a.replace(/[vQ]/g, '').split('.').map(Number);
        const bParts = b.replace(/[vQ]/g, '').split('.').map(Number);
        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
          const diff = (aParts[i] || 0) - (bParts[i] || 0);
          if (diff !== 0) return diff;
        }
        return 0;
      });

    if (versions.length === 0) {
      throw new Error(`No matching versions found for ${model}`);
    }

    const latestVersion = versions[versions.length - 1];
    
    // Find the tag with this version
    const matchingTag = tags.find(tag => tag.name.includes(latestVersion));
    let releaseDate = new Date().toISOString().split('T')[0];
    
    if (matchingTag && matchingTag.commit && matchingTag.commit.sha) {
      try {
        const commitInfo = await fetchCommitInfo('Coldcard/firmware', matchingTag.commit.sha, token);
        releaseDate = commitInfo.date;
      } catch (commitError) {
        debugLog(`Failed to get commit date for Coldcard ${model}: ${commitError.message}`, args);
      }
    }

    return {
      version: latestVersion,
      date: releaseDate
    };

  } catch (error) {
    throw new Error(`Failed to fetch Coldcard ${model} version: ${error.message}`);
  }
}

async function fetchJadeVersion(isPlus, token) {
  try {
    const tags = await fetchAllTags('Blockstream/Jade', token);
    
    if (!tags || tags.length === 0) {
      throw new Error('No tags found');
    }

    // Filter for appropriate version pattern
    const versionPattern = isPlus ? /^[0-9]+\.[0-9]+\.[0-9]+$/ : /^[0-9]+\.[0-9]+\.[0-9]+$/;
    const versions = tags
      .map(tag => tag.name)
      .filter(name => versionPattern.test(name))
      .sort((a, b) => {
        const aParts = a.split('.').map(Number);
        const bParts = b.split('.').map(Number);
        for (let i = 0; i < 3; i++) {
          const diff = aParts[i] - bParts[i];
          if (diff !== 0) return diff;
        }
        return 0;
      });

    if (versions.length === 0) {
      throw new Error('No matching versions found');
    }

    const latestVersion = versions[versions.length - 1];
    const matchingTag = tags.find(tag => tag.name === latestVersion);
    
    let releaseDate = new Date().toISOString().split('T')[0];
    if (matchingTag && matchingTag.commit && matchingTag.commit.sha) {
      try {
        const commitInfo = await fetchCommitInfo('Blockstream/Jade', matchingTag.commit.sha, token);
        releaseDate = commitInfo.date;
      } catch (commitError) {
        debugLog(`Failed to get commit date for Jade: ${commitError.message}`, args);
      }
    }

    return {
      version: latestVersion,
      date: releaseDate
    };

  } catch (error) {
    throw new Error(`Failed to fetch Jade version: ${error.message}`);
  }
}

async function fetchOneKeyVersion(model, repoPath, token) {
  const modelPrefixes = {
    classic: 'classic/',
    mini: 'mini/',
    touch: 'touch/',
    pro: '' // Pro model tags don't have a prefix in firmware-pro repo
  };

  const prefix = modelPrefixes[model];
  if (typeof prefix === 'undefined') {
    throw new Error(`Unknown OneKey model: ${model}`);
  }

  try {
    const tags = await fetchAllTags(repoPath, token);
    if (!tags || tags.length === 0) {
      throw new Error('No tags found');
    }

    if (args && args.debug) {
      debugLog(`OneKey model ${model} (repo: ${repoPath}): First ${Math.min(5, tags.length)} raw tags out of ${tags.length}: ${tags.slice(0, 5).map(t => t.name).join(', ')}`, args);
    }

    let versions = tags
      .map(tag => tag.name)
      .filter(name => name.startsWith(prefix))
      .map(name => name.substring(prefix.length)) // Remove prefix
      .filter(name => /^v?[0-9]+\.[0-9]+\.[0-9]+/.test(name)) // Basic version format check
      .sort((a, b) => {
        const aParts = normalizeVersion(a).split('.').map(Number);
        const bParts = normalizeVersion(b).split('.').map(Number);
        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
          const diff = (aParts[i] || 0) - (bParts[i] || 0);
          if (diff !== 0) return diff;
        }
        return 0;
      });

    if (versions.length === 0 && model === 'classic') {
      // Fallback for classic: try without any prefix if 'classic/' yields no results
      debugLog(`No versions found with 'classic/' prefix for OneKey Classic. Trying without prefix.`, args);
      versions = tags
        .map(tag => tag.name)
        // Filter for tags that look like versions and don't have other known prefixes
        .filter(name => /^v?[0-9]+\.[0-9]+\.[0-9]+$/.test(name) && 
                         !name.startsWith(modelPrefixes.mini) && 
                         !name.startsWith(modelPrefixes.touch))
        .sort((a, b) => {
          const aParts = normalizeVersion(a).split('.').map(Number);
          const bParts = normalizeVersion(b).split('.').map(Number);
          for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
            const diff = (aParts[i] || 0) - (bParts[i] || 0);
            if (diff !== 0) return diff;
          }
          return 0;
        });
    }

    if (versions.length === 0) {
      throw new Error(`No matching versions found for OneKey ${model}`);
    }

    // The latest version will be the last one after sorting
    const latestVersion = versions[versions.length - 1];
    // Find the original tag name to get the commit SHA. For classic fallback, prefix is empty.
    const effectivePrefix = (model === 'classic' && !tags.find(tag => tag.name === `${prefix}${latestVersion}`)) ? '' : prefix;
    const originalTagName = tags.find(tag => tag.name === `${effectivePrefix}${latestVersion}`);
    let releaseDate = new Date().toISOString().split('T')[0]; // Default to today

    if (originalTagName && originalTagName.commit && originalTagName.commit.sha) {
      try {
        const commitInfo = await fetchCommitInfo(repoPath, originalTagName.commit.sha, token);
        releaseDate = commitInfo.date;
      } catch (commitError) {
        debugLog(`Failed to get commit date for OneKey ${model}: ${commitError.message}`, args);
      }
    }

    return {
      version: latestVersion, // Return version without prefix
      date: releaseDate
    };

  } catch (error) {
    // Add model to the error message for better context
    throw new Error(`Failed to fetch OneKey ${model} version: ${error.message}`);
  }
}

async function fetchTrezorVersion(firmwareCode, token) {
  const modelMap = {
    'trezor-one': 'LEGACY',
    'trezor-t': 'T2T1', 
    'trezor-safe-3': 'T2B1',
    'trezor-safe-5': 'T3T1'
  };

  const trezorModel = modelMap[firmwareCode];
  if (!trezorModel) {
    throw new Error(`Unknown Trezor model: ${firmwareCode}`);
  }

  try {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'trezor_fextractor.mjs');
      const args = ['--json', '--model', trezorModel];
      
      if (token) {
        args.unshift('-g', token);
      }
      
      const child = spawn('node', [scriptPath, ...args], {
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      let stdout = '';
      let stderr = '';
      
      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      child.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`trezor_fextractor.mjs exited with code ${code}: ${stderr}`));
          return;
        }
        
        try {
          const result = JSON.parse(stdout.trim());
          if (result.error) {
            reject(new Error(`Trezor extraction error: ${result.error}`));
            return;
          }
          
          let version = result.version || 'unknown';
          const date = result.date || new Date().toISOString().split('T')[0];

          if (version === 'unknown' && stderr.trim()) {
            debugLog(`Trezor extractor for ${trezorModel} produced 'unknown' version. Stderr:\n${stderr.trim()}`, args);
          }

          // Remove 'v' prefix for LEGACY model if present (frontmatter should be without 'v')
          if (trezorModel === 'LEGACY' && version !== 'unknown' && version.startsWith('v')) {
            version = version.substring(1);
          }

          resolve({ version, date });
        } catch (parseError) {
          reject(new Error(`Invalid trezor_fextractor.mjs output format: ${stdout}`));
        }
      });
      
      child.on('error', (error) => {
        reject(new Error(`Failed to spawn trezor_fextractor.mjs: ${error.message}`));
      });
    });
    
  } catch (error) {
    throw new Error(`Trezor version fetch failed: ${error.message}`);
  }
}

async function getDeviceVersion(fileName, repoUrl, token) {
  const repoPath = extractRepoPath(repoUrl);
  const lowerFileName = fileName.toLowerCase();

  if (lowerFileName.includes('coldcard')) {
    let model = 'mk4'; // Default to mk4
    if (lowerFileName.includes('mk1')) model = 'mk1';
    else if (lowerFileName.includes('mk2')) model = 'mk2';
    else if (lowerFileName.includes('mk3')) model = 'mk3';
    else if (lowerFileName.includes('q1')) model = 'q';
    return fetchColdcardVersion(model, token);
  } else if (lowerFileName.includes('blockstreamjade') || lowerFileName.includes('jade.md')) { // Added jade.md check
    const isPlus = lowerFileName.includes('plus');
    return fetchJadeVersion(isPlus, token);
  } else if (lowerFileName.includes('onekey')) {
    // Determine the OneKey model based on the filename
    let model = '';
    let specificRepoPath = repoPath; // Default to the repoUrl from frontmatter

    if (lowerFileName.includes('onekey.md') || lowerFileName.includes('onekeyclassic.md')) {
      model = 'classic';
      specificRepoPath = 'OneKeyHQ/firmware';
    } else if (lowerFileName.includes('onekeymini.md')) {
      model = 'mini';
      specificRepoPath = 'OneKeyHQ/firmware';
    } else if (lowerFileName.includes('onekey.touch.md') || lowerFileName.includes('onekeytouch.md')) {
      model = 'touch';
      specificRepoPath = 'OneKeyHQ/firmware';
    } else if (lowerFileName.includes('onekey.pro.md') || lowerFileName.includes('onekeypro.md')) {
      model = 'pro';
      specificRepoPath = 'OneKeyHQ/firmware-pro'; // Pro has its own repo
    } else {
      // Fallback for any other onekey, though specific handlers are preferred
      debugLog(`Unknown OneKey variant: ${fileName}, using generic fetch.`, args);
      return fetchLatestRelease(repoUrl, token);
    }
    return fetchOneKeyVersion(model, specificRepoPath, token);
  } else if (lowerFileName.includes('trezor')) {
    let trezorModelId = '';
    if (lowerFileName.includes('trezorone.md')) trezorModelId = 'trezor-one';
    else if (lowerFileName.includes('trezort.md')) trezorModelId = 'trezor-t';
    else if (lowerFileName.includes('trezorsafe3.md')) trezorModelId = 'trezor-safe-3';
    else if (lowerFileName.includes('trezorsafe5.md')) trezorModelId = 'trezor-safe-5'; // Assuming T3T1 maps to 'trezor-safe-5' for the modelMap
    else {
      // Fallback for unknown Trezor models, though unlikely
      debugLog(`Unknown Trezor variant: ${fileName}, using generic fetch.`, args);
      return fetchLatestRelease(repoUrl, token);
    }
    return fetchTrezorVersion(trezorModelId, token);
  } else {
    // Generic fallback for other devices
    return fetchLatestRelease(repoUrl, token);
  }
}

async function processFile(fileName) {
  await processFileCommon(fileName, {
    directory: HARDWARE_DIR,
    validVerdicts: VALID_VERDICTS,
    validMeta: VALID_META,
    emoji: '🔐',
    versionFetcher: getDeviceVersion,
    getToken: () => getGitHubToken(args),
    stats,
    dryRun: args['dry-run'] || false
  });
}

async function main() {
  if (args.help) {
    console.log(`
Usage: node scripts/refreshHardware.mjs [options]

Options:
  -g, --github-token <token>  GitHub Personal Access Token
  -d, --debug                Enable debug output
  -n, --dry-run              Show what would be updated without writing changes
  -h, --help                 Show this help message

Environment:
  GITHUB_TOKEN               GitHub token (fallback if -g not provided)

Examples:
  node scripts/refreshHardware.mjs -g ghp_xxxxxxxxxxxx
  node scripts/refreshHardware.mjs -d -g ghp_xxxxxxxxxxxx
  node scripts/refreshHardware.mjs --dry-run -g ghp_xxxxxxxxxxxx
  GITHUB_TOKEN=ghp_xxxx node scripts/refreshHardware.mjs
`);
    process.exit(0);
  }
  
  const token = getGitHubToken(args);
  if (!token) {
    console.log(`${colors.yellow}⚠️  No GitHub token provided. API requests may be rate limited.${colors.reset}`);
    console.log(`   Use -g <token> or set GITHUB_TOKEN environment variable.`);
  }
  
  console.log(`${colors.cyan}🔐 Refreshing hardware wallet versions...${args['dry-run'] ? ' (DRY RUN)' : ''}${colors.reset}`);
  
  try {
    const files = getMarkdownFiles(HARDWARE_DIR);
    stats.processed = files.length;
    
    console.log(`Found ${files.length} hardware wallet files`);
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
    
    generateReport(stats, args, 'hardware');
    
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