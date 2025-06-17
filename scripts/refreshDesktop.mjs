#!/usr/bin/env node

/**
 * Desktop wallet refresh script - JavaScript port of refreshDesktop.sh
 * Updates version information for desktop wallet markdown files
 */

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import minimist from 'minimist';
import helper from './helper.mjs';

// Parse command line arguments
const args = minimist(process.argv.slice(2), {
  boolean: ['r', 'help', 'd', 'debug'],
  string: ['g'],
  alias: {
    r: 'report',
    g: 'github-token',
    h: 'help',
    d: 'debug'
  }
});

// Configuration
const DESKTOP_DIR = '_desktop';
const VALID_VERDICTS = ['sourceavailable', 'wip', 'reproducible'];
const VALID_META = 'ok';

// Colors for output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  reset: '\x1b[0m'
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
Usage: node scripts/refreshDesktop.mjs [options]

Options:
  -g, --github-token <token>  GitHub Personal Access Token
  -r, --report               Generate detailed report
  -d, --debug                Show detailed debug information including invalid files
  -h, --help                 Show this help message

Environment:
  GITHUB_TOKEN               GitHub token (fallback if -g not provided)

Examples:
  node scripts/refreshDesktop.mjs -g ghp_xxxxxxxxxxxx
  node scripts/refreshDesktop.mjs -r -g ghp_xxxxxxxxxxxx
  GITHUB_TOKEN=ghp_xxxx node scripts/refreshDesktop.mjs -r
`);
}

function getGitHubToken() {
  return args['github-token'] || process.env.GITHUB_TOKEN;
}

async function fetchLatestRelease(repoUrl, token) {
  const repoPath = repoUrl.replace('https://github.com/', '');
  
  try {
    // First try to get latest release
    const releaseResponse = await axios.get(`https://api.github.com/repos/${repoPath}/releases/latest`, {
      headers: token ? { 'Authorization': `token ${token}` } : {},
      timeout: 10000
    });
    
    return {
      version: releaseResponse.data.tag_name,
      date: releaseResponse.data.published_at.split('T')[0]
    };
    
  } catch (releaseError) {
    if (releaseError.response?.status === 404) {
      // No releases found, try tags as fallback
      try {
        const tagsResponse = await axios.get(`https://api.github.com/repos/${repoPath}/tags`, {
          headers: token ? { 'Authorization': `token ${token}` } : {},
          timeout: 10000
        });
        
        if (tagsResponse.data && tagsResponse.data.length > 0) {
          // Get the latest tag (first in the array)
          const latestTag = tagsResponse.data[0];
          
          // Try to get commit date for the tag
          try {
            const commitResponse = await axios.get(`https://api.github.com/repos/${repoPath}/commits/${latestTag.commit.sha}`, {
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
    } else if (releaseError.response?.status === 403) {
      throw new Error('Rate limited - GitHub token recommended');
    } else if (releaseError.response?.status === 404) {
      throw new Error(`Repository not found: ${repoUrl}`);
    } else if (releaseError.code === 'ENOTFOUND' || releaseError.code === 'ETIMEDOUT') {
      throw new Error('Network error');
    }
    throw releaseError;
  }
}

function extractRepoUrl(content) {
  const match = content.match(/repository:\s*(.+)/);
  return match ? match[1].trim() : null;
}

async function processFile(fileName) {
  const filePath = path.join(DESKTOP_DIR, fileName);
  
  try {
    // Load file using existing helper
    const content = { header: {}, body: '' };
    helper.loadFromFile(filePath, content);
    
    const { header, body } = content;
    
    // Check if verdict is valid for processing
    if (!VALID_VERDICTS.includes(header.verdict)) {
      stats.skipped.invalidVerdict.push({
        file: fileName,
        verdict: header.verdict || 'none'
      });
      return;
    }
    
    // Check if meta is valid for processing
    if (header.meta !== VALID_META) {
      stats.skipped.invalidMeta.push({
        file: fileName,
        meta: header.meta || 'none'
      });
      return;
    }
    
    // Extract repository URL
    const repoUrl = header.repository;
    if (!repoUrl || !repoUrl.includes('github.com')) {
      stats.skipped.noRepo.push({
        file: fileName,
        reason: repoUrl ? 'Not a GitHub repository' : 'No repository specified'
      });
      return;
    }
    
    console.log(`Processing ${colors.cyan}${fileName}${colors.reset} (${header.verdict})...`);
    
    // Fetch latest version from GitHub
    const token = getGitHubToken();
    try {
      const { version: latestVersion, date: releaseDate } = await fetchLatestRelease(repoUrl, token);
      
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
      helper.writeResult(DESKTOP_DIR + '/', header, body);
      
      stats.updated++;
      console.log(`  ${colors.green}✓ Updated${colors.reset}: ${currentVersion || 'none'} → ${colors.green}${latestVersion}${colors.reset}`);
      
    } catch (error) {
      if (error.message.startsWith('No releases or tags found:')) {
        stats.skipped.noReleases.push({
          file: fileName,
          repository: error.message.split(': ')[1]
        });
        console.log(`  ${colors.yellow}✗ No releases or tags found${colors.reset}: ${error.message.split(': ')[1]}`);
      } else if (error.message.startsWith('Repository not found:')) {
        stats.skipped.noRepo.push({
          file: fileName,
          repository: error.message.split(': ')[1]
        });
        console.log(`  ${colors.red}✗ Repository not found${colors.reset}: ${error.message.split(': ')[1]}`);
      } else {
        stats.skipped.errors.push({
          file: fileName,
          error: error.message
        });
        console.log(`  ${colors.red}✗ Error${colors.reset}: ${error.message}`);
      }
    }
    
  } catch (error) {
    stats.skipped.errors.push({
      file: fileName,
      error: error.message
    });
    console.log(`  ${colors.red}✗ Error${colors.reset}: ${error.message}`);
  }
}

function generateReport() {
  if (!args.report) return;
  
  console.log(`\n${colors.cyan}=== DETAILED REPORT ===${colors.reset}`);
  console.log(`Files processed: ${stats.processed}`);
  console.log(`Files updated: ${colors.green}${stats.updated}${colors.reset}`);
  
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
      console.log(`\n${colors.gray}Skipped - Invalid verdict/meta:${colors.reset} (use -d to see details)`);
    }
  }
  
  if (stats.skipped.noRepo.length > 0) {
    console.log(`\n${colors.yellow}Skipped - No GitHub repository:${colors.reset}`);
    stats.skipped.noRepo.forEach(item => {
      console.log(`  • ${item.file} (${item.reason})`);
    });
  }
  
  if (stats.skipped.noReleases.length > 0) {
    console.log(`\n${colors.yellow}Skipped - No releases or tags found:${colors.reset}`);
    stats.skipped.noReleases.forEach(item => {
      console.log(`  • ${item.file} (${item.repository})`);
    });
  }
  
  if (stats.skipped.upToDate.length > 0) {
    console.log(`\n${colors.green}Already up to date:${colors.reset}`);
    stats.skipped.upToDate.forEach(item => {
      console.log(`  • ${item.file} (${item.version})`);
    });
  }
  
  if (stats.skipped.errors.length > 0) {
    console.log(`\n${colors.red}Errors:${colors.reset}`);
    stats.skipped.errors.forEach(item => {
      console.log(`  • ${item.file}: ${item.error}`);
    });
  }
}

async function main() {
  if (args.help) {
    showUsage();
    return;
  }
  
  const token = getGitHubToken();
  if (!token) {
    console.log(`${colors.yellow}⚠️  No GitHub token provided. API requests may be rate limited.${colors.reset}`);
    console.log(`   Use -g <token> or set GITHUB_TOKEN environment variable.`);
  }
  
  console.log(`${colors.cyan}🖥️  Refreshing desktop wallet versions...${colors.reset}`);
  
  try {
    const files = fs.readdirSync(DESKTOP_DIR).filter(file => file.endsWith('.md'));
    stats.processed = files.length;
    
    console.log(`Found ${files.length} desktop wallet files`);
    console.log(`with 'meta:ok' and 'verdict: sourceavailable'`);
    
    // Process files sequentially to avoid rate limiting
    for (const file of files) {
      await processFile(file);
      // Small delay to be nice to GitHub API
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\n${colors.green}✓ Completed${colors.reset}: ${stats.updated} files updated out of ${stats.processed} processed`);
    
    generateReport();
    
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
