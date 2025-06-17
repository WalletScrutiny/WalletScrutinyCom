#!/usr/bin/env node

/**
 * Hardware wallet refresh script - JavaScript port of refreshHardware.sh
 * Updates version information for hardware wallet markdown files
 */

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import minimist from 'minimist';
import { execSync } from 'child_process';
import helper from './helper.mjs';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

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

// Colors for output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  gray: '\x1b[90m'
};

// Statistics tracking
const stats = {
  processed: 0,
  updated: 0,
  skipped: {
    noRepo: [],
    invalidVerdict: [],
    invalidMeta: [],
    noReleases: [],
    upToDate: [],
    errors: []
  }
};

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

function getGitHubToken() {
  return args['github-token'] || process.env.GITHUB_TOKEN;
}

function debugLog(message) {
  if (args.debug) {
    console.log(`[DEBUG] ${message}`);
  }
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
    const response = await axios.get('https://api.github.com/repos/Coldcard/firmware/tags?per_page=100', {
      headers: token ? { 'Authorization': `token ${token}` } : {},
      timeout: 10000
    });

    const tags = response.data;
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
        const commitResponse = await axios.get(`https://api.github.com/repos/Coldcard/firmware/commits/${matchingTag.commit.sha}`, {
          headers: token ? { 'Authorization': `token ${token}` } : {},
          timeout: 10000
        });
        releaseDate = commitResponse.data.commit.committer.date.split('T')[0];
      } catch (commitError) {
        debugLog(`Failed to get commit date for Coldcard ${model}: ${commitError.message}`);
      }
    }

    return { version: latestVersion, date: releaseDate };
    
  } catch (error) {
    throw new Error(`Failed to fetch Coldcard ${model} version: ${error.message}`);
  }
}

async function fetchJadeVersion(isPlus, token) {
  try {
    const response = await axios.get('https://api.github.com/repos/Blockstream/jade/tags', {
      headers: token ? { 'Authorization': `token ${token}` } : {},
      timeout: 10000
    });

    const tags = response.data;
    if (!tags || tags.length === 0) {
      return { version: 'unknown', date: new Date().toISOString().split('T')[0] };
    }

    const latestTag = tags[0];
    let releaseDate = new Date().toISOString().split('T')[0];
    
    if (latestTag.commit && latestTag.commit.sha) {
      try {
        const commitResponse = await axios.get(`https://api.github.com/repos/Blockstream/jade/commits/${latestTag.commit.sha}`, {
          headers: token ? { 'Authorization': `token ${token}` } : {},
          timeout: 10000
        });
        releaseDate = commitResponse.data.commit.committer.date.split('T')[0];
      } catch (commitError) {
        debugLog(`Failed to get commit date for Jade: ${commitError.message}`);
      }
    }

    return { version: latestTag.name, date: releaseDate };
    
  } catch (error) {
    return { version: 'unknown', date: new Date().toISOString().split('T')[0] };
  }
}

async function fetchTrezorVersion(firmwareCode, token) {
  const modelMap = {
    'trezorOne': 'LEGACY',
    'trezorT': 'T2T1', 
    'trezorSafe3': 'T2B1',
    'trezorSafe5': 'T3T1'
  };

  const trezorModel = modelMap[firmwareCode];
  if (!trezorModel) {
    throw new Error(`Unknown Trezor model: ${firmwareCode}`);
  }

  try {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'trezor_fextractor.js');
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
          reject(new Error(`trezor_fextractor.js exited with code ${code}: ${stderr}`));
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
          reject(new Error(`Invalid trezor_fextractor.js output format: ${stdout}`));
        }
      });
      
      child.on('error', (error) => {
        reject(new Error(`Failed to spawn trezor_fextractor.js: ${error.message}`));
      });
    });
    
  } catch (error) {
    throw new Error(`Trezor version fetch failed: ${error.message}`);
  }
}

async function getDeviceVersion(fileName, repoUrl, token) {
  const fileNameLower = fileName.toLowerCase();
  
  // Coldcard devices
  if (repoUrl === 'https://github.com/Coldcard/firmware' || 
      fileNameLower.includes('coldcard')) {
    const model = fileNameLower.includes('mk4') ? 'mk4' : 
                  fileNameLower.includes('mk3') ? 'mk3' : 
                  fileNameLower.includes('mk2') ? 'mk2' : 
                  fileNameLower.includes('mk1') ? 'mk1' : 
                  fileNameLower.includes('q') ? 'q' : 
                  'unknown';
    return await fetchColdcardVersion(model, token);
  }
  
  // Blockstream Jade
  if (repoUrl === 'https://github.com/Blockstream/Jade' || 
      fileNameLower.includes('jade')) {
    return await fetchJadeVersion(fileNameLower.includes('plus'), token);
  }
  
  // Trezor devices
  if (repoUrl && (repoUrl.includes('trezor') || fileNameLower.includes('trezor'))) {
    const firmwareCode = fileNameLower === 'trezorone.md' ? 'trezorOne' : 
                         fileNameLower === 'trezort.md' ? 'trezorT' : 
                         fileNameLower === 'trezorsafe3.md' ? 'trezorSafe3' : 
                         fileNameLower === 'trezorsafe5.md' ? 'trezorSafe5' : 
                         'unknown';
    return await fetchTrezorVersion(firmwareCode, token);
  }
  
  // Generic GitHub repository
  if (repoUrl && repoUrl.includes('github.com')) {
    try {
      const response = await axios.get(`https://api.github.com/repos/${repoUrl.replace('https://github.com/', '')}/releases/latest`, {
        headers: token ? { 'Authorization': `token ${token}` } : {},
        timeout: 10000
      });
      
      return {
        version: response.data.tag_name,
        date: response.data.published_at.split('T')[0]
      };
      
    } catch (error) {
      if (error.response?.status === 404) {
        // No releases found, try tags as fallback
        try {
          const tagsResponse = await axios.get(`https://api.github.com/repos/${repoUrl.replace('https://github.com/', '')}/tags`, {
            headers: token ? { 'Authorization': `token ${token}` } : {},
            timeout: 10000
          });
          
          if (tagsResponse.data && tagsResponse.data.length > 0) {
            // Get the latest tag (first in the array)
            const latestTag = tagsResponse.data[0];
            
            // Try to get commit date for the tag
            try {
              const commitResponse = await axios.get(`https://api.github.com/repos/${repoUrl.replace('https://github.com/', '')}/commits/${latestTag.commit.sha}`, {
                headers: token ? { 'Authorization': `token ${token}` } : {},
                timeout: 10000
              });
              
              return {
                version: latestTag.name,
                date: commitResponse.data.commit.committer.date.split('T')[0]
              };
            } catch (commitError) {
              // If we can't get commit date, use current date
              return {
                version: latestTag.name,
                date: new Date().toISOString().split('T')[0]
              };
            }
          } else {
            throw new Error(`No releases or tags found: ${repoUrl}`);
          }
        } catch (tagsError) {
          if (tagsError.response?.status === 404) {
            throw new Error(`Repository not found: ${repoUrl}`);
          }
          throw new Error(`No releases or tags found: ${repoUrl}`);
        }
      } else if (error.response?.status === 403) {
        throw new Error('Rate limited - GitHub token recommended');
      } else if (error.response?.status === 404) {
        throw new Error(`Repository not found: ${repoUrl}`);
      } else if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
        throw new Error('Network error');
      }
      throw error;
    }
  }
  
  throw new Error('Unknown device type or no repository specified');
}

async function processFile(fileName) {
  const filePath = path.join(HARDWARE_DIR, fileName);
  
  try {
    // Load file using existing helper
    const content = { header: {}, body: '' };
    helper.loadFromFile(filePath, content);
    
    const { header, body } = content;
    
    // Check if verdict and meta are valid for processing
    if (!VALID_VERDICTS.includes(header.verdict) || header.meta !== VALID_META) {
      if (!VALID_VERDICTS.includes(header.verdict)) {
        stats.skipped.invalidVerdict.push({
          file: fileName,
          verdict: header.verdict || 'none'
        });
      }
      if (header.meta !== VALID_META) {
        stats.skipped.invalidMeta.push({
          file: fileName,
          meta: header.meta || 'none'
        });
      }
      return;
    }
    
    console.log(`Processing ${colors.cyan}${fileName}${colors.reset} (${header.verdict})...`);
    
    // Get device version using specialized logic
    const token = getGitHubToken();
    const { version: latestVersion, date: releaseDate } = await getDeviceVersion(
      fileName, 
      header.repository, 
      token
    );
    
    const currentVersion = header.version;
    
    if (currentVersion === latestVersion) {
      stats.skipped.upToDate.push({
        file: fileName,
        version: currentVersion
      });
      console.log(`  ✓ Already up to date: ${currentVersion}`);
      return;
    }
    
    // Update header
    header.version = latestVersion;
    header.updated = releaseDate;
    header.date = new Date().toISOString().split('T')[0];
    
    // Write updated file
    helper.writeResult(HARDWARE_DIR + '/', header, body);
    
    stats.updated++;
    console.log(`  ${colors.green}✓ Updated${colors.reset}: ${currentVersion || 'none'} → ${colors.green}${latestVersion}${colors.reset}`);
    
  } catch (error) {
    if (error.message.startsWith('Repository not found:')) {
      stats.skipped.noRepo.push({
        file: fileName,
        repository: error.message.split(': ')[1]
      });
      console.log(`  ${colors.red}✗ Repository not found${colors.reset}: ${error.message.split(': ')[1]}`);
    } else if (error.message.startsWith('No releases or tags found:')) {
      stats.skipped.noReleases.push({
        file: fileName,
        repository: error.message.split(': ')[1]
      });
      console.log(`  ${colors.yellow}✗ No releases or tags found${colors.reset}: ${error.message.split(': ')[1]}`);
    } else {
      stats.skipped.errors.push({
        file: fileName,
        error: error.message
      });
      console.log(`  ${colors.red}✗ Error${colors.reset}: ${error.message}`);
    }
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
  
  const token = getGitHubToken();
  if (!token) {
    console.log(`${colors.yellow}⚠️  No GitHub token provided. API requests may be rate limited.${colors.reset}`);
    console.log(`   Use -g <token> or set GITHUB_TOKEN environment variable.`);
  }
  
  console.log(`${colors.cyan}🔐 Refreshing hardware wallet versions...${colors.reset}`);
  
  try {
    const files = fs.readdirSync(HARDWARE_DIR).filter(file => file.endsWith('.md'));
    stats.processed = files.length;
    
    console.log(`Found ${files.length} hardware wallet files`);
    console.log(`with 'meta:ok' and 'verdict: sourceavailable'`);
    
    // Process files sequentially to avoid rate limiting
    for (const file of files) {
      await processFile(file);
      // Small delay to be nice to GitHub API
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log(`\n${colors.green}✓ Completed${colors.reset}: ${stats.updated} files updated out of ${stats.processed} processed`);
    
    // Generate detailed summary
    if (args.debug) {
      if (stats.skipped.invalidVerdict.length > 0) {
        console.log(`\n${colors.yellow}Skipped - Invalid verdict:${colors.reset}`);
        stats.skipped.invalidVerdict.forEach(item => {
          console.log(`  • ${item.file} (verdict: ${item.verdict})`);
        });
      }
      
      if (stats.skipped.invalidMeta.length > 0) {
        console.log(`\n${colors.yellow}Skipped - Invalid meta:${colors.reset}`);
        stats.skipped.invalidMeta.forEach(item => {
          console.log(`  • ${item.file} (meta: ${item.meta})`);
        });
      }
    } else {
      const totalSkippedInvalid = stats.skipped.invalidVerdict.length + stats.skipped.invalidMeta.length;
      if (totalSkippedInvalid > 0) {
        console.log(`\n${colors.yellow}Skipped - Invalid files:${colors.reset} ${totalSkippedInvalid} files (use -d to see details)`);
      }
    }
    
    if (stats.skipped.noRepo.length > 0) {
      console.log(`\n${colors.yellow}Skipped - Repository not found:${colors.reset}`);
      stats.skipped.noRepo.forEach(item => {
        console.log(`  • ${item.file} (${item.repository})`);
      });
    }
    
    if (stats.skipped.noReleases.length > 0) {
      console.log(`\n${colors.yellow}Skipped - No releases or tags found:${colors.reset}`);
      stats.skipped.noReleases.forEach(item => {
        console.log(`  • ${item.file} (${item.repository})`);
      });
    }
    
    if (stats.skipped.upToDate.length > 0) {
      console.log(`\n${colors.cyan}Already up to date:${colors.reset}`);
      stats.skipped.upToDate.forEach(item => {
        console.log(`  • ${item.file} (${item.version})`);
      });
    }
    
    // Generate summary
    if (stats.skipped.errors.length > 0) {
      console.log(`\n${colors.red}Errors encountered:${colors.reset}`);
      stats.skipped.errors.forEach(item => {
        console.log(`  • ${item.file}: ${item.error}`);
      });
    }
    
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
