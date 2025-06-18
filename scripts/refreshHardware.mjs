#!/usr/bin/env node

/**
 * Hardware wallet refresh script
 * Updates version information for hardware wallet markdown files
 */

import fs from 'fs';
import path from 'path';
import minimist from 'minimist';
import { execSync } from 'child_process';
import helper from './helper.mjs';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { 
  colors, 
  createStats, 
  getGitHubToken, 
  generateReport, 
  getMarkdownFiles,
  parseFrontmatter,
  updateVersionInContent,
  isValidVerdict,
  isValidMeta,
  sleep,
  extractRepoUrl,
  handleProcessingError,
  debugLog
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
  boolean: ['d', 'help'],
  string: ['g'],
  alias: {
    d: 'debug',
    g: 'github-token',
    h: 'help'
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
  -h, --help                 Show this help message

Environment:
  GITHUB_TOKEN               GitHub token (fallback if -g not provided)

Examples:
  node scripts/refreshHardware.mjs -g ghp_xxxxxxxxxxxx
  node scripts/refreshHardware.mjs -d -g ghp_xxxxxxxxxxxx
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
          
          // Add 'v' prefix for LEGACY model if missing
          if (trezorModel === 'LEGACY' && version !== 'unknown' && !version.startsWith('v')) {
            version = `v${version}`;
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
  // Special handling for specific hardware devices
  if (fileName.includes('coldcard')) {
    const model = fileName.includes('mk4') ? 'mk4' : 
                  fileName.includes('mk3') ? 'mk3' : 
                  fileName.includes('mk2') ? 'mk2' : 
                  fileName.includes('mk1') ? 'mk1' : 
                  fileName.includes('q') ? 'q' : 'mk4';
    return await fetchColdcardVersion(model, token);
  }
  
  if (fileName.includes('jade')) {
    const isPlus = fileName.includes('plus');
    return await fetchJadeVersion(isPlus, token);
  }
  
  if (fileName.includes('trezor')) {
    const fileNameLower = fileName.toLowerCase();
    const firmwareCode = fileNameLower.includes('one') ? 'trezor-one' :
                        fileNameLower.includes('safe3') ? 'trezor-safe-3' :
                        fileNameLower.includes('safe5') ? 'trezor-safe-5' :
                        'trezor-t';
    return await fetchTrezorVersion(firmwareCode, token);
  }
  
  // For other devices, use generic GitHub release fetching
  return await fetchLatestRelease(repoUrl, token);
}

async function processFile(fileName) {
  const filePath = path.join(HARDWARE_DIR, fileName);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const frontmatter = parseFrontmatter(content);
    
    // Validate verdict
    if (!isValidVerdict(frontmatter.verdict, VALID_VERDICTS)) {
      stats.skipped.invalidVerdict.push({
        file: fileName,
        verdict: frontmatter.verdict
      });
      return;
    }
    
    // Validate meta
    if (!isValidMeta(frontmatter.meta, VALID_META)) {
      stats.skipped.invalidMeta.push({
        file: fileName,
        meta: frontmatter.meta
      });
      return;
    }
    
    console.log(`\n🔐 Processing: ${colors.cyan}${fileName}${colors.reset}`);
    
    // Extract repository URL
    const repoUrl = extractRepoUrl(content);
    if (!repoUrl) {
      stats.skipped.noRepo.push({
        file: fileName,
        reason: 'No repository URL found'
      });
      console.log(`  ${colors.red}✗ No repository URL found${colors.reset}`);
      return;
    }
    
    console.log(`  Repository: ${repoUrl}`);
    
    const token = getGitHubToken(args);
    
    try {
      // Get device-specific version
      const release = await getDeviceVersion(fileName, repoUrl, token);
      
      console.log(`  Current: ${frontmatter.version || 'unknown'}`);
      console.log(`  Latest: ${release.version}`);
      
      // Check if update is needed
      if (frontmatter.version === release.version) {
        stats.skipped.upToDate.push({
          file: fileName,
          version: release.version
        });
        console.log(`  ${colors.green}✓ Already up to date${colors.reset}`);
        return;
      }
      
      // Update the file
      const updatedContent = updateVersionInContent(content, release.version, release.date);
      fs.writeFileSync(filePath, updatedContent);
      
      stats.updated++;
      console.log(`  ${colors.green}✓ Updated${colors.reset}: ${frontmatter.version} → ${release.version}`);
      
    } catch (error) {
      handleProcessingError(error, fileName, stats);
    }
    
  } catch (error) {
    handleProcessingError(error, fileName, stats);
  }
}

async function main() {
  if (args.help) {
    console.log(`
Usage: node scripts/refreshHardware.mjs [options]

Options:
  -g, --github-token <token>  GitHub Personal Access Token
  -d, --debug                Enable debug output
  -h, --help                 Show this help message

Environment:
  GITHUB_TOKEN               GitHub token (fallback if -g not provided)

Examples:
  node scripts/refreshHardware.mjs -g ghp_xxxxxxxxxxxx
  node scripts/refreshHardware.mjs -d -g ghp_xxxxxxxxxxxx
  GITHUB_TOKEN=ghp_xxxx node scripts/refreshHardware.mjs
`);
    process.exit(0);
  }
  
  const token = getGitHubToken(args);
  if (!token) {
    console.log(`${colors.yellow}⚠️  No GitHub token provided. API requests may be rate limited.${colors.reset}`);
    console.log(`   Use -g <token> or set GITHUB_TOKEN environment variable.`);
  }
  
  console.log(`${colors.cyan}🔐 Refreshing hardware wallet versions...${colors.reset}`);
  
  try {
    const files = getMarkdownFiles(HARDWARE_DIR);
    stats.processed = files.length;
    
    console.log(`Found ${files.length} hardware wallet files`);
    console.log(`with 'meta:ok' and 'verdict: sourceavailable'`);
    
    const delay = getRateLimitDelay(!!token);
    
    // Process files sequentially to avoid rate limiting
    for (const file of files) {
      await processFile(file);
      // Rate limiting delay
      await sleep(delay);
    }
    
    console.log(`\n${colors.green}✓ Completed${colors.reset}: ${stats.updated} files updated out of ${stats.processed} processed`);
    
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
