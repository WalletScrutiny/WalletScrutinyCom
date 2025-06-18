#!/usr/bin/env node

/**
 * Desktop wallet refresh script
 * Updates version information for desktop wallet markdown files
 */

import fs from 'fs';
import path from 'path';
import minimist from 'minimist';
import helper from './helper.mjs';
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
  handleProcessingError
} from './refresh_common.mjs';
import { 
  fetchLatestRelease,
  getRateLimitDelay
} from './github_common.mjs';

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

// Statistics tracking
const stats = createStats();

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

async function processFile(fileName) {
  const filePath = path.join(DESKTOP_DIR, fileName);
  
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
    
    console.log(`\n📱 Processing: ${colors.cyan}${fileName}${colors.reset}`);
    
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
      // Fetch latest release
      const release = await fetchLatestRelease(repoUrl, token);
      
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
    showUsage();
    return;
  }
  
  const token = getGitHubToken(args);
  if (!token) {
    console.log(`${colors.yellow}⚠️  No GitHub token provided. API requests may be rate limited.${colors.reset}`);
    console.log(`   Use -g <token> or set GITHUB_TOKEN environment variable.`);
  }
  
  console.log(`${colors.cyan}🖥️  Refreshing desktop wallet versions...${colors.reset}`);
  
  try {
    const files = getMarkdownFiles(DESKTOP_DIR);
    stats.processed = files.length;
    
    console.log(`Found ${files.length} desktop wallet files`);
    console.log(`with 'meta:ok' and 'verdict: sourceavailable'`);
    
    const delay = getRateLimitDelay(!!token);
    
    // Process files sequentially to avoid rate limiting
    for (const file of files) {
      await processFile(file);
      // Rate limiting delay
      await sleep(delay);
    }
    
    console.log(`\n${colors.green}✓ Completed${colors.reset}: ${stats.updated} files updated out of ${stats.processed} processed`);
    
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
