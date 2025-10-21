#!/usr/bin/env node

/**
 * Detect New Versions Needing Verification
 * 
 * Compares app versions from markdown files with latest Nostr verifications
 * Adds apps with newer versions to the verification queue
 * 
 * Part of Phase 1: Auto-Verification After Refresh
 * 
 * Usage:
 *   node scripts/detectNewVersions.mjs [--dry-run] [--apps=appId1,appId2]
 * 
 * @module detectNewVersions
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { addToQueue, getQueueStats } from './lib/queueManager.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const appsFilter = args.find(arg => arg.startsWith('--apps='))?.split('=')[1]?.split(',');

// Platform directories
const PLATFORMS = {
  android: '_android',
  desktop: '_desktop',
  hardware: '_hardware'
};

// Nostr verification events directory
const NOSTR_EVENTS_DIR = path.join(PROJECT_ROOT, 'backup/nostr-verification-events/30301');

/**
 * Compare semantic versions
 * Returns: 1 if a > b, -1 if a < b, 0 if equal
 */
function compareVersions(a, b) {
  if (!a || !b) return 0;
  
  // Handle special cases like "29.2.knots20251010"
  const cleanA = a.replace(/[^\d.]/g, '.');
  const cleanB = b.replace(/[^\d.]/g, '.');
  
  const pa = cleanA.split('.').map(Number).filter(n => !isNaN(n));
  const pb = cleanB.split('.').map(Number).filter(n => !isNaN(n));
  
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = pa[i] || 0;
    const nb = pb[i] || 0;
    if (na > nb) return 1;
    if (na < nb) return -1;
  }
  return 0;
}

/**
 * Parse YAML frontmatter from markdown file
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  
  const yaml = match[1];
  const data = {};
  
  // Simple YAML parser for key: value pairs
  const lines = yaml.split('\n');
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();
    
    // Remove quotes
    if ((value.startsWith("'") && value.endsWith("'")) || 
        (value.startsWith('"') && value.endsWith('"'))) {
      value = value.slice(1, -1);
    }
    
    data[key] = value;
  }
  
  return data;
}

/**
 * Read app metadata from markdown file
 */
function readAppMetadata(filePath, platform) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = parseFrontmatter(content);
    
    return {
      appId: data.appId,
      version: data.version,
      platform: platform,
      verdict: data.verdict,
      meta: data.meta,
      title: data.title
    };
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Load cached Nostr verification events for an app
 */
function loadNostrVerifications(appId, platform) {
  try {
    if (!fs.existsSync(NOSTR_EVENTS_DIR)) {
      console.warn(`Nostr events directory not found: ${NOSTR_EVENTS_DIR}`);
      return [];
    }
    
    const files = fs.readdirSync(NOSTR_EVENTS_DIR);
    const verifications = [];
    
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      
      const filePath = path.join(NOSTR_EVENTS_DIR, file);
      const event = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // Check if event is for this app
      const eventAppId = event.tags.find(tag => tag[0] === 'i')?.[1];
      const eventPlatform = event.tags.find(tag => tag[0] === 'platform')?.[1];
      
      if (eventAppId === appId && eventPlatform === platform) {
        const version = event.tags.find(tag => tag[0] === 'version')?.[1];
        const status = event.tags.find(tag => tag[0] === 'status')?.[1];
        
        verifications.push({
          version,
          status,
          createdAt: event.created_at,
          eventId: event.id || file.replace('.json', '')
        });
      }
    }
    
    return verifications;
  } catch (error) {
    console.error(`Error loading Nostr verifications for ${appId}:`, error.message);
    return [];
  }
}

/**
 * Get latest verified version from Nostr events
 */
function getLatestVerifiedVersion(verifications) {
  if (!verifications || verifications.length === 0) {
    return null;
  }
  
  // Sort by version (descending) and take the first one
  const sorted = verifications
    .filter(v => v.version)
    .sort((a, b) => {
      // Sort by version first
      const versionCompare = compareVersions(b.version, a.version);
      if (versionCompare !== 0) return versionCompare;
      
      // If versions equal, sort by date (newer first)
      return b.createdAt - a.createdAt;
    });
  
  return sorted[0]?.version || null;
}

/**
 * Calculate priority based on app characteristics
 */
function calculatePriority(app) {
  // High priority: Desktop apps (Bitcoin Core, Sparrow, etc.)
  if (app.platform === 'desktop') {
    return 'high';
  }
  
  // High priority: Hardware wallets
  if (app.platform === 'hardware') {
    return 'high';
  }
  
  // High priority: Source available apps
  if (app.verdict === 'reproducible' || app.verdict === 'sourceavailable') {
    return 'high';
  }
  
  // Medium priority: Android apps with ok meta
  if (app.platform === 'android' && app.meta === 'ok') {
    return 'medium';
  }
  
  // Low priority: Everything else
  return 'low';
}

/**
 * Process apps from a platform directory
 */
function processApps(platform) {
  const platformDir = path.join(PROJECT_ROOT, PLATFORMS[platform]);
  
  if (!fs.existsSync(platformDir)) {
    console.warn(`Platform directory not found: ${platformDir}`);
    return { checked: 0, queued: 0 };
  }
  
  const files = fs.readdirSync(platformDir).filter(f => f.endsWith('.md'));
  let checked = 0;
  let queued = 0;
  
  console.log(`\nProcessing ${platform} apps (${files.length} files)...`);
  
  for (const file of files) {
    const filePath = path.join(platformDir, file);
    const app = readAppMetadata(filePath, platform);
    
    if (!app || !app.appId || !app.version) {
      continue;
    }
    
    // Skip apps that can't be verified (only check sourceavailable/reproducible)
    if (app.verdict !== 'sourceavailable' && app.verdict !== 'reproducible') {
      continue;
    }
    
    // Apply filter if specified
    if (appsFilter && !appsFilter.includes(app.appId)) {
      continue;
    }
    
    checked++;
    
    // Load Nostr verifications for this app
    const verifications = loadNostrVerifications(app.appId, platform);
    const latestVerified = getLatestVerifiedVersion(verifications);
    
    // Helper to format version with 'v' prefix if not already present
    const formatVersion = (ver) => ver.startsWith('v') ? ver : `v${ver}`;
    
    // Compare versions
    if (!latestVerified) {
      console.log(`  ${app.appId}: ${formatVersion(app.version)} - No previous verification found`);
      // Don't queue apps with no previous verification (need manual first verification)
      continue;
    }
    
    const comparison = compareVersions(app.version, latestVerified);
    
    if (comparison > 0) {
      // App version is newer than latest verification
      const priority = calculatePriority(app);
      console.log(`  ✓ ${app.appId}: ${formatVersion(app.version)} > ${formatVersion(latestVerified)} (${priority} priority)`);
      
      if (!isDryRun) {
        const added = addToQueue({
          appId: app.appId,
          version: app.version,
          platform: platform,
          priority: priority
        });
        if (added) queued++;
      } else {
        queued++;
      }
    } else if (comparison === 0) {
      console.log(`  - ${app.appId}: ${formatVersion(app.version)} = ${formatVersion(latestVerified)} (already verified)`);
    } else {
      console.log(`  - ${app.appId}: ${formatVersion(app.version)} < ${formatVersion(latestVerified)} (older version?)`);
    }
  }
  
  return { checked, queued };
}

/**
 * Main execution
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Detecting New Versions Needing Verification');
  console.log('='.repeat(60));
  
  if (isDryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be made to queue\n');
  }
  
  if (appsFilter) {
    console.log(`📋 Filtering apps: ${appsFilter.join(', ')}\n`);
  }
  
  let totalChecked = 0;
  let totalQueued = 0;
  
  // Process each platform
  for (const platform of Object.keys(PLATFORMS)) {
    const { checked, queued } = processApps(platform);
    totalChecked += checked;
    totalQueued += queued;
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('Summary');
  console.log('='.repeat(60));
  console.log(`Apps checked: ${totalChecked}`);
  console.log(`Apps needing verification: ${totalQueued}`);
  
  if (!isDryRun && totalQueued > 0) {
    const stats = getQueueStats();
    console.log('\nQueue Status:');
    console.log(`  Pending: ${stats.pending}`);
    console.log(`  Processing: ${stats.processing}`);
    console.log(`  Completed: ${stats.completed}`);
    console.log(`  Failed: ${stats.failed}`);
    console.log(`  Skipped: ${stats.skipped}`);
  }
  
  if (isDryRun) {
    console.log('\n💡 Run without --dry-run to add items to queue');
  }
  
  console.log('='.repeat(60));
}

// Run main function
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
