#!/usr/bin/env node

/**
 * Common utilities for refresh scripts
 * Shared functions for refreshDesktop.mjs and refreshHardware.mjs
 */

import fs from 'fs';
import path from 'path';

// Common colors for output
export const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  gray: '\x1b[90m'
};

// Create statistics tracking object
export function createStats() {
  return {
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
}

// Get GitHub token from args or environment
export function getGitHubToken(args) {
  return args['github-token'] || process.env.GITHUB_TOKEN;
}

// Debug logging function
export function debugLog(message, args) {
  if (args && args.debug) {
    console.log(`[DEBUG] ${message}`);
  }
}

// Common file processing utilities
export function getMarkdownFiles(directory) {
  try {
    return fs.readdirSync(directory).filter(file => file.endsWith('.md'));
  } catch (error) {
    throw new Error(`Failed to read directory ${directory}: ${error.message}`);
  }
}

// Parse markdown frontmatter
export function parseFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    return {};
  }

  const frontmatter = {};
  const lines = frontmatterMatch[1].split('\n');
  
  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.*)$/);
    if (match) {
      frontmatter[match[1]] = match[2].trim();
    }
  }
  
  return frontmatter;
}

// Update version in markdown content
export function updateVersionInContent(content, newVersion, newDate) {
  // Update version
  content = content.replace(/^version:\s*.*$/m, `version: ${newVersion}`);

  // Update 'updated' field (not 'date' - that's manual only)
  // Handle both empty values (updated: ) and populated values (updated: 2025-01-01)
  // Use [^\n\r]* instead of .* to avoid matching newlines
  if (/^updated:[^\n\r]*$/m.test(content)) {
    content = content.replace(/^updated:[^\n\r]*$/m, `updated: ${newDate}`);
  } else {
    // If 'updated:' field doesn't exist, insert it after 'version:'
    content = content.replace(/^version:\s*.*$/m, `$&\nupdated: ${newDate}`);
  }

  return content;
}

// Generate detailed report
export function generateReport(stats, args, scriptType = 'refresh') {
  if (!args.report && !args.debug) return;
  
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
      console.log(`\n${colors.gray}Skipped - Invalid verdict/meta: ${totalSkippedInvalid} files${colors.reset} (use -d to see details)`);
    }
  }
  
  if (stats.skipped.noRepo.length > 0) {
    console.log(`\n${colors.yellow}Skipped - No GitHub repository:${colors.reset}`);
    stats.skipped.noRepo.forEach(item => {
      console.log(`  • ${item.file} (${item.reason || item.repository})`);
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

// Common validation functions
export function isValidVerdict(verdict, validVerdicts) {
  return validVerdicts.includes(verdict);
}

export function isValidMeta(meta, validMeta) {
  return meta === validMeta;
}

// Sleep utility for rate limiting
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Extract repository URL from markdown content
export function extractRepoUrl(content) {
  const repoMatch = content.match(/repository:\s*(.+)/);
  return repoMatch ? repoMatch[1].trim() : null;
}

/**
 * Normalize version strings for comparison
 * @param {string} version - Version string to normalize
 * @returns {string} - Normalized version string
 */
export function normalizeVersion(version) {
  if (!version || typeof version !== 'string') {
    return version;
  }

  let normalized = version.trim();

  // Handle prefix/suffix patterns like "firmware/v1.2.3" or "release/1.2.3"
  if (normalized.includes('/')) {
    const parts = normalized.split('/');
    normalized = parts[parts.length - 1]; // Take the part after the last "/"
  }

  // Remove "v" prefix for comparison
  const withoutV = normalized.replace(/^v/i, '');

  return withoutV;
}


/**
 * Compare two version strings after normalization
 * @param {string} current - Current version
 * @param {string} latest - Latest version
 * @returns {boolean} - True if versions are equivalent
 */
export function areVersionsEquivalent(current, latest) {
  if (!current || !latest) {
    return false;
  }
  
  const normalizedCurrent = normalizeVersion(current);
  const normalizedLatest = normalizeVersion(latest);
  
  return normalizedCurrent === normalizedLatest;
}

// Common error handling
export function handleProcessingError(error, fileName, stats) {
  if (error.message.includes('Repository not found') || error.message.includes('No GitHub repository')) {
    stats.skipped.noRepo.push({
      file: fileName,
      repository: error.message.split(': ')[1] || 'Unknown'
    });
    console.log(`  ${colors.red}✗ Repository not found${colors.reset}: ${error.message.split(': ')[1] || 'Unknown'}`);
  } else if (error.message.includes('No releases or tags found')) {
    stats.skipped.noReleases.push({
      file: fileName,
      repository: error.message.split(': ')[1] || 'Unknown'
    });
    console.log(`  ${colors.red}✗ No releases found${colors.reset}: ${error.message.split(': ')[1] || 'Unknown'}`);
  } else {
    stats.skipped.errors.push({
      file: fileName,
      error: error.message
    });
    console.log(`  ${colors.red}✗ Error${colors.reset}: ${error.message}`);
  }
}
