//
// This script generates Twitter summary cards for wallet apps. It reads metadata
// from `.md` files, fetches Nostr verification data, and uses the `canvas`
// library to create PNG images. The cards display the app icon, title, version,
// verdict, and Nostr verification status with dynamic font scaling and layout.
//
// --- Table of Contents ---
//
// 1.  Setup & Configuration
//     - Imports & Constants
//     - Command-Line Argument Parsing
//     - Configuration Paths & Global Variables
//     - Nostr Verification Configuration (getStatusText)
//
// 2.  Core Logic
//     - loadResources(): Loads images, fonts, and Nostr data.
//     - processOneFile(): Processes a single markdown file to generate a card.
//     - processFiles(): Main loop to process all files in target folders.
//
// 3.  Canvas Drawing
//     - drawOnCanvas(): The main drawing function that composes the card.
//     - Platform Backgrounds (drawAndroidBackground, etc.)
//
// 4.  Data Fetching & Helpers
//     - getNostrVerificationSummaryForApp(): Fetches Nostr data for an app.
//     - loadVerdicts(), loadMetaVerdicts(): Loads verdict data from YAML.
//     - Helper functions for text wrapping, date formatting, etc.
//

// Import libraries
import fs from 'fs';
import { createCanvas, loadImage, registerFont } from 'canvas';
import yaml from 'js-yaml';
import path from 'path';
import pLimit from 'p-limit';
import { execSync } from 'child_process';
import { parseArgs } from 'node:util';

// Constants
const fsp = fs.promises;
const limit = pLimit(8); // Allow 8 concurrent async operations
const allMdFolders = [
  '_android',
  '_bearer',
  '_hardware',
  '_iphone',
  '_desktop']; // MD file folders

// Parse command line arguments
const { values } = parseArgs({
  options: {
    folder: {
      type: 'string',
      short: 'f',
      default: '',
    },
    single: {
      type: 'string',
      short: 's',
      default: '',
    },
    help: {
      type: 'boolean',
      short: 'h',
    }
  },
});

// Show help if requested
if (values.help) {
  console.log('Twitter Card Generator');
  console.log('Usage: node twitterCardGen.mjs [options]');
  console.log('Options:');
  console.log('  -f, --folder <folder>  Process only the specified folder (e.g., _android, _bearer, _hardware, _iphone, _desktop)');
  console.log('  -s, --single <file>    Process only a single file (e.g., _hardware/bithdwatch2.md)');
  console.log('  -h, --help             Show this help message');
  process.exit(0);
}

// Check for single file processing
let singleFilePath = null;
let singleFileName = null;

// Determine which folders to process
let mdFolders = allMdFolders;

if (values.single) {
  // Parse the single file path
  singleFilePath = values.single;
  
  // Ensure path starts with underscore
  if (!singleFilePath.startsWith('_')) {
    console.error(`Error: File path must start with a folder name prefixed with underscore (e.g., _hardware/file.md)`);
    process.exit(1);
  }
  
  // Extract folder and file name
  const pathParts = singleFilePath.split('/');
  if (pathParts.length !== 2) {
    console.error(`Error: Invalid file path format. Expected format: _folder/filename.md`);
    process.exit(1);
  }
  
  const folderName = pathParts[0];
  singleFileName = pathParts[1];
  
  // Validate folder
  if (!allMdFolders.includes(folderName)) {
    console.error(`Error: Invalid folder name '${folderName}'. Valid options are: ${allMdFolders.join(', ')}`);
    process.exit(1);
  }
  
  // Check if file exists
  if (!fs.existsSync(singleFilePath)) {
    console.error(`Error: File '${singleFilePath}' does not exist.`);
    process.exit(1);
  }
  
  // Set folder to process
  mdFolders = [folderName];
  console.log(`Processing only single file: ${singleFilePath}`);
} 
// Determine which folders to process if not processing a single file
else if (values.folder) {
  const folderName = values.folder.startsWith('_') ? values.folder : `_${values.folder}`;
  if (allMdFolders.includes(folderName)) {
    mdFolders = [folderName];
    console.log(`Processing only folder: ${folderName}`);
  } else {
    console.error(`Error: Invalid folder name '${values.folder}'. Valid options are: ${allMdFolders.map(f => f.substring(1)).join(', ')}`);
    process.exit(1);
  }
}

// Configuration paths
const NOSTR_BACKUP_PATH = 'backup/nostr-verification-events'; // Path to Nostr backup files
const backgroundImage = 'images/twCard/socGenCardblue.png';
// Standard background image is used for all cards
// Load badge images
// Reproducible badge removed - now using text display
const androidImagePath = 'images/twCard/android_icon.png';
const appleImagePath = 'images/twCard/apple_logo.png';
const desktopImagePath = 'images/twCard/desktop_logo.png';
const fallbackIcon = 'images/smallNoicon.png';

// Add this toggle at the top of the file (after constants)
const USE_LONG_NOSTR_DESCRIPTIONS = false; // Set to true for long descriptions

// Global variables for images
let bgImage, androidImage, appleImage, desktopImage;
const verdictMap = loadVerdicts('_data/verdicts');
// Load meta verdicts
const metaVerdictMap = loadMetaVerdicts('_data/verdicts');

// Nostr verification section
function getStatusText(status, short = true) {
  switch (status) {
    case 'reproducible':
      return short ? 'Reproducible' : 'The application was successfully reproduced';
    case 'not_reproducible':
      return short ? '⚠︎ Not Reproducible' : '⚠︎ The application could not be reproduced';
    case 'ftbfs':
      return short ? '⚠︎ Failed to Build from Source' : '⚠︎ The application failed to build from source';
    case 'spam':
      return short ? '⚠︎ Spam' : '⚠︎ The application is spam';
    case 'notag':
      return short ? '⚠︎ No git revision' : '⚠︎ The application has no git revision';
    case 'nosource':
      return short ? '⚠︎ No source' : '⚠︎ The application has no sources available';
    case 'obfuscated':
      return short ? '⚠︎ Obfuscated' : '⚠︎ The application\'s source code is obfuscated';
    case 'warning':
      return short ? '⚠︎ Warning' : '⚠︎ The application\'s source code is a warning';
    default:
      return '⚠︎ Unknown';
  }
}
// Cache for Nostr verification info to avoid repeated grep/jq calls
let nostrVerificationCache = new Map();

// Timer variables
let totalFiles = 0;
let totalTime = 0;
let oldTotalFiles = 0;
const startTime = Date.now();

// Statistics tracking variables
let stats = {
  platforms: {
    android: 0,
    iphone: 0,
    desktop: 0,
    bearer: 0,
    hardware: 0
  },
  totalFailed: 0,
  nostrVerification: {
    total: 0,
    reproducible: 0,
    not_reproducible: 0,
    ftbfs: 0,
    spam: 0,
    notag: 0,
    nosource: 0,
    obfuscated: 0,
    warning: 0,
    unknown: 0
  }
};

async function loadResources () {
  // Load the background image
  try {
    bgImage = await loadImage(backgroundImage);
  } catch (error) {
    console.warn(`Could not load background image from ${backgroundImage}: ${error.message}`);
  }
  
  // We now use the standard background for all cards
  
  // Reproducible image loading removed - now using text display
  
  // Load the android image
  try {
    androidImage = await loadImage(androidImagePath);
  } catch (error) {
    console.error(`Error loading Android logo: ${error.message}`);
  }

  // Load Desktop logo
  try {
    desktopImage = await loadImage(desktopImagePath);
  } catch (error) {
    console.error(`Error loading Desktop logo: ${error.message}`);
  }

  // Load Apple logo
  try {
    appleImage = await loadImage(appleImagePath);
    console.log(`\x1b[32m[APPLE] Successfully loaded Apple logo from ${appleImagePath}\x1b[0m`);
    // Log the dimensions of the Apple logo
    console.log(`\x1b[32m[APPLE] Apple logo dimensions: ${appleImage.width}x${appleImage.height}\x1b[0m`);
  } catch (error) {
    console.error(`\x1b[31m[APPLE] Error loading Apple logo: ${error.message}\x1b[0m`);
  }
  
  // Register fonts
  
  registerFont('assets/fonts/Barlow/barlow-v12-latin-500.ttf', { family: 'Barlow' });
  
  // Check if Nostr backup directory exists
  console.log('\x1b[1m[NOSTR] Checking for local Nostr backup files\x1b[0m');
  let nostrAvailable = false;
  
  // Clear the verification cache
  nostrVerificationCache.clear();
  
  if (fs.existsSync(NOSTR_BACKUP_PATH)) {
    try {
      // Check if there are any JSON files in the backup directory
      const result = execSync(`find ${NOSTR_BACKUP_PATH} -name "*.json" | wc -l`, { encoding: 'utf8' });
      const fileCount = parseInt(result.trim(), 10);
      
      if (fileCount > 0) {
        console.log(`\x1b[33;1m[NOSTR] Found ${fileCount} Nostr verification files in local backup!\x1b[0m`);
        nostrAvailable = true;
      } else {
        console.log('[NOSTR] No Nostr verification files found in backup directory');
      }
    } catch (error) {
      console.warn(`[NOSTR] Error checking Nostr backup files: ${error.message}`);
    }
  } else {
    console.log(`[NOSTR] Nostr backup directory not found at ${NOSTR_BACKUP_PATH}`);
  }
  
  // Log the final status
  if (!nostrAvailable) {
    console.log('[NOSTR] Will proceed without Nostr data');
  } else {
    console.log('[NOSTR] Local Nostr backup files will be used for verification data');
  }
  
  // Find and display all apps with verdict: sourceavailable AND meta: ok
  await findSourceAvailableApps();
}

// Function to find and display all apps with verdict: sourceavailable AND meta: ok
async function findSourceAvailableApps() {
  console.log('\x1b[36;1m[APPS] Finding all apps with verdict: sourceavailable AND meta: ok\x1b[0m');
  
  const sourceAvailableApps = [];
  
  // Process each platform folder
  for (const mdFolder of mdFolders) {
    const mdFilesPath = mdFolder;
    const files = await fsp.readdir(mdFilesPath);
    
    // Process each markdown file
    for (const file of files) {
      try {
        // Read the file content
        const filePath = path.join(mdFilesPath, file);
        const content = await fsp.readFile(filePath, 'utf8');
        
        // Extract front matter
        const frontMatterMatch = content.match(/---\r?\n([\s\S]*?)\r?\n---/);
        if (frontMatterMatch) {
          const frontMatter = yaml.load(frontMatterMatch[1]);
          
          // Check if verdict is sourceavailable AND meta is ok
          if (frontMatter.verdict === 'sourceavailable' && 
              frontMatter.meta === 'ok') {
            
            // Add to the list
            sourceAvailableApps.push({
              file: file,
              platform: mdFolder.substring(1),
              title: frontMatter.title || 'Unknown',
              appId: frontMatter.appId || null
            });
          }
        }
      } catch (error) {
        console.error(`[APPS] Error processing file ${file}:`, error.message);
      }
    }
  }
  
  // Display the results
  if (sourceAvailableApps.length > 0) {
    console.log('\x1b[32;1m[APPS] Found', sourceAvailableApps.length, 'apps with verdict: sourceavailable AND meta: ok\x1b[0m');
    console.log('\x1b[33;1m[APPS] List of sourceavailable apps that will be processed with Nostr data:\x1b[0m');
    
    // Table header
    console.log('\x1b[36m%-40s %-15s %-30s\x1b[0m', 'Title', 'Platform', 'App ID');
    console.log('-'.repeat(85));
    
    // Table rows
    sourceAvailableApps.forEach(app => {
      // Use a simple truncation for console display
      const truncatedTitle = app.title.length > 38 ? app.title.substring(0, 35) + '...' : app.title;
      console.log('%-40s %-15s %-30s', 
        truncatedTitle,
        app.platform,
        app.appId || 'N/A'
      );
    });
    console.log('-'.repeat(85));
  } else {
    console.log('\x1b[31m[APPS] No apps found with verdict: sourceavailable AND meta: ok\x1b[0m');
  }
  
  return sourceAvailableApps;
}

function wrapText (text, length) {
  const regex = new RegExp(`(?:(?:\\S{${length}}|.{1,${length}})(?:\\s|$))`, 'g');
  return `${text}`.match(regex) || [];
}

function formatDate (dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function loadVerdicts (dirPath) {
  const verdictMap = {};
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    if (file.endsWith('.yml')) {
      const content = fs.readFileSync(path.join(dirPath, file), 'utf8');
      const verdict = yaml.load(content);
      const key = file.replace('.yml', '');
      verdictMap[key] = verdict.title;
    }
  }
  return verdictMap;
}

function loadMetaVerdicts (dirPath) {
  const metaVerdictMap = {};
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    if (file.endsWith('.yml')) {
      const content = fs.readFileSync(path.join(dirPath, file), 'utf8');
      const verdict = yaml.load(content);
      // Only include verdicts with meta: true
      if (verdict.meta === true) {
        const key = file.replace('.yml', '');
        metaVerdictMap[key] = {
          title: verdict.title || '',
          message: verdict.message || ''
        };
      }
    }
  }
  return metaVerdictMap;
}

// Helper function to compare semantic versions
function compareVersions(a, b) {
  if (a === b) return 0;
  
  const aParts = a.split('.').map(Number);
  const bParts = b.split('.').map(Number);
  
  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aVal = i < aParts.length ? aParts[i] : 0;
    const bVal = i < bParts.length ? bParts[i] : 0;
    
    if (aVal > bVal) return 1;
    if (aVal < bVal) return -1;
  }
  
  return 0;
}

// Helper function to calculate and format time since last verification
function getTimeSinceLastVerification(dateString) {
  try {
    // Parse the date string (format: YYYY-MM-DD)
    const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
    const verificationDate = new Date(year, month - 1, day); // Month is 0-indexed in JavaScript
    
    // Get current date
    const currentDate = new Date();
    
    // Calculate difference in milliseconds
    const diffMs = currentDate - verificationDate;
    
    // Convert to days
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    // Format based on the time difference
    if (diffDays < 7) {
      // Less than a week
      return diffDays <= 1 ? 
        'Verified yesterday' : 
        `${diffDays} days since last verification`;
    } else if (diffDays < 30) {
      // Less than a month
      const weeks = Math.floor(diffDays / 7);
      return weeks === 1 ? 
        '1 week since last verification' : 
        `${weeks} weeks since last verification`;
    } else {
      // Months or more
      const months = Math.floor(diffDays / 30);
      return months === 1 ? 
        '1 month since last verification' : 
        `${months} months since last verification`;
    }
  } catch (error) {
    console.error(`Error parsing date: ${dateString}`, error);
    return `Latest verification: ${dateString}`; // Fallback to original format
  }
}

// Function to get Nostr verification summary for an app using grep and jq on local files
function getNostrVerificationSummaryForApp(appId) {
  // Check if we already have cached results for this appId
  if (nostrVerificationCache.has(appId)) {
    return nostrVerificationCache.get(appId);
  }

  if (!fs.existsSync(NOSTR_BACKUP_PATH)) {
    console.warn(`Nostr backup directory not found at ${NOSTR_BACKUP_PATH}`);
    return null;
  }

  try {
    // First, find all files containing this appId using grep
    const grepCommand = `grep -r "${appId}" ${NOSTR_BACKUP_PATH} --include="*.json" | cut -d: -f1`;
    const matchingFiles = execSync(grepCommand, { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
    
    if (matchingFiles.length === 0) {
      console.log(`[NOSTR] No verification files found for ${appId}`);
      const emptySummary = {
        latestStatus: null,
        latestVersion: null,
        latestDate: null,
        verificationCount: 0,
        reproducibleCount: 0
      };
      nostrVerificationCache.set(appId, emptySummary);
      return emptySummary;
    }
    
    console.log(`[NOSTR] Found ${matchingFiles.length} verification files for ${appId}`);
    
    // Use jq to extract and process the verification events
    const jqCommand = `cat ${matchingFiles.join(' ')} | jq -c 'select(.tags[]? | select(.[0] == "i" and .[1] == "${appId}")) | {id: .id, created_at: .created_at, version: (.tags[] | select(.[0] == "version") | .[1]), status: (.tags[] | select(.[0] == "status") | .[1]), platform: (.tags[] | select(.[0] == "platform") | .[1]), date: (.created_at | tostring)}' | jq -s 'sort_by(.created_at) | reverse'`;
    
    const events = JSON.parse(execSync(jqCommand, { encoding: 'utf8' }).trim() || '[]');
    
    if (events.length === 0) {
      console.log(`[NOSTR] No valid verification events found for ${appId}`);
      const emptySummary = {
        latestStatus: null,
        latestVersion: null,
        latestDate: null,
        verificationCount: 0,
        reproducibleCount: 0
      };
      nostrVerificationCache.set(appId, emptySummary);
      return emptySummary;
    }
    
    // Get the most recent event (already sorted in reverse chronological order)
    const latestEvent = events[0];
    
    // Format the date from Unix timestamp
    const formattedDate = latestEvent.date ? 
      new Date(parseInt(latestEvent.date) * 1000).toISOString().split('T')[0] : null;
    
    // Count how many verifications have status 'reproducible'
    const reproducibleCount = events.filter(event => event.status === 'reproducible').length;
    
    const summary = {
      latestStatus: latestEvent.status || 'unknown',
      latestVersion: latestEvent.version || null,
      latestDate: formattedDate,
      verificationCount: events.length,
      reproducibleCount: reproducibleCount,
      platform: latestEvent.platform || null
    };
    
    // Cache the results
    nostrVerificationCache.set(appId, summary);
    return summary;
  } catch (error) {
    console.error(`[NOSTR] Error processing verification data for ${appId}: ${error.message}`);
    return {
      latestStatus: null,
      latestVersion: null,
      latestDate: null,
      verificationCount: 0,
      reproducibleCount: 0,
      platform: null
    };
  }
}

// Progress Tracking Function
async function showProgress () {
  const i = setInterval(() => {
    const oldTotalTime = totalTime;
    totalTime = Date.now() - startTime;
    const filesPerSecond = 1000 * (oldTotalFiles - totalFiles) / (totalTime - oldTotalTime);
    const secondsRemaining = totalFiles / filesPerSecond;
    console.log(`${(totalTime / 1000).toFixed(1)}s: ${totalFiles} files and ${secondsRemaining.toFixed(0)}s remaining at approx. ${filesPerSecond.toFixed(0)}f/s.`);
    if (totalTime > 1000 && limit.activeCount === 0) {
      // stop when not working on any tasks ...
      clearInterval(i);
      console.log(`
        Finished in ${(totalTime / 1000).toFixed(1)}s`);
    }
    oldTotalFiles = totalFiles;
  }, 5000);
}

async function processFilesTimed () {
  showProgress();
  await loadResources();
  await processFiles();
  displaySummary();
}

const spikes = 5;
const outerRadius = 20;
const innerRadius = 10;
const strokeWidth = 3;
function drawStar (ctx, cx, cy, fillColor = '#ee9e15', strokeColor = 'black', fraction = 1) {
  let rot = (Math.PI / 2) * 3;
  let x, y;
  const step = Math.PI / spikes;

  ctx.save();
  ctx.beginPath();
  ctx.rect(
    cx - outerRadius - strokeWidth,
    cy - outerRadius - strokeWidth,
    2 * (outerRadius + strokeWidth) * fraction,
    2 * (outerRadius + strokeWidth));
  ctx.clip();
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);

  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }

  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.lineWidth = strokeWidth;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = strokeColor;
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

// Function to adjust the hue of the background image using pixel manipulation
function adjustImageHue(sourceImage, hueRotation = 0) {
  // Create a temporary canvas to manipulate the image
  const tempCanvas = createCanvas(sourceImage.width, sourceImage.height);
  const tempCtx = tempCanvas.getContext('2d');
  
  // Draw the original image
  tempCtx.drawImage(sourceImage, 0, 0, sourceImage.width, sourceImage.height);
  
  // Get the image data
  const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
  const data = imageData.data;
  
  // Convert hue rotation from degrees to radians
  const hueRotationRad = (hueRotation * Math.PI) / 180;
  
  // Process each pixel
  for (let i = 0; i < data.length; i += 4) {
    // Get RGB values
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Convert RGB to HSL
    const [h, s, l] = rgbToHsl(r, g, b);
    
    // Rotate the hue
    const newHue = (h + hueRotationRad) % (2 * Math.PI);
    
    // Convert back to RGB
    const [newR, newG, newB] = hslToRgb(newHue, s, l);
    
    // Update pixel data
    data[i] = newR;
    data[i + 1] = newG;
    data[i + 2] = newB;
    // Alpha channel (data[i + 3]) remains unchanged
  }
  
  // Put the modified image data back
  tempCtx.putImageData(imageData, 0, 0);
  
  return tempCanvas;
}

// Helper function to convert RGB to HSL
function rgbToHsl(r, g, b) {
  // Normalize RGB values
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    // Achromatic (gray)
    h = 0;
    s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    
    h /= 6;
  }
  
  // Convert h to radians for easier rotation
  return [h * 2 * Math.PI, s, l];
}

// Helper function to convert HSL to RGB
function hslToRgb(h, s, l) {
  let r, g, b;
  
  // Convert h back to 0-1 range
  h = h / (2 * Math.PI);
  
  if (s === 0) {
    // Achromatic (gray)
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  // Convert back to 0-255 range
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Function to generate a random hue rotation value
function getRandomHueRotation() {
  // Generate a random value between 0 and 360 degrees
  return Math.floor(Math.random() * 360);
}

// Utility function to overlay "reproducible" image
// Overlay source-available badge with resizing
async function overlaySourceAvailableImage(ctx) {
  if (sourceavailableImage) {
    const width = 200; // your preferred width
    const height = 200; // your preferred height
    const x = 30;
    const y = 350;
    
    // Add drop shadow for the source-available badge
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.drawImage(sourceavailableImage, x, y, width, height);
    ctx.restore();
  }
}

// Reproducible badge overlay function removed - now using text display

// Draw Android icon as a background element for Android apps
async function drawAndroidBackground(ctx, width, height, data) {
  // Draw Android icon for all Android apps regardless of verdict
  if (androidImage && data && data.isAndroidApp) {
    // Use the natural size of the Android icon
    const androidIconWidth = androidImage.width;
    const androidIconHeight = androidImage.height;
    
    // Center horizontally and align with bottom of card
    const x = (width - androidIconWidth) / 2;
    const y = height - androidIconHeight - 19; // lessen last value to move android icon down
    
    // Position the Android icon at the bottom center of the card
    
    // Draw with low opacity to make it a subtle background element
    ctx.save();
    ctx.globalAlpha = 0.15; // Very transparent
    ctx.drawImage(androidImage, x, y);
    ctx.globalAlpha = 1.0; // Reset opacity
    ctx.restore();
  }
}

// Draw Apple logo as a background element for Apple apps
async function drawAppleBackground(ctx, width, height) {
  console.log('\x1b[36m[APPLE] drawAppleBackground called\x1b[0m');
  if (appleImage) {
    // Use the natural size of the Apple logo
    const appleIconWidth = appleImage.width;
    const appleIconHeight = appleImage.height;
    
    // Position the Apple logo on the canvas - offset to the right side
    // This makes it more visible as a background element
    const x = width - appleIconWidth - 50; // 50px from right edge
    const y = height - appleIconHeight - 50; // 50px from bottom edge
    
    console.log(`\x1b[36m[APPLE] Drawing Apple logo at position (${x}, ${y}) with size ${appleIconWidth}x${appleIconHeight}\x1b[0m`);
    
    // Draw the Apple logo with original size
    // It should be above the background but below everything else
    ctx.save();
    ctx.globalAlpha = 0.4; // Increased opacity from 0.2 to 0.4
    ctx.drawImage(appleImage, x, y);
    ctx.globalAlpha = 1.0; // Reset opacity
    ctx.restore();
    
    console.log('\x1b[32m[APPLE] Apple logo drawn successfully\x1b[0m');
  } else {
    console.log('\x1b[31m[APPLE] appleImage is not loaded\x1b[0m');
  }
}

// Draw Desktop logo as a background element for Desktop apps
async function drawDesktopBackground(ctx, width, height) {
  console.log('\x1b[36m[DESKTOP] drawDesktopBackground called\x1b[0m');
  if (desktopImage) {
    // Use the natural size of the Desktop logo
    const desktopIconWidth = desktopImage.width;
    const desktopIconHeight = desktopImage.height;
    
    // Position the Desktop logo on the canvas - same position as Apple logo
    const x = width - desktopIconWidth - 50; // 50px from right edge
    const y = height - desktopIconHeight - 50; // 50px from bottom edge
    
    console.log(`\x1b[36m[DESKTOP] Drawing Desktop logo at position (${x}, ${y}) with size ${desktopIconWidth}x${desktopIconHeight}\x1b[0m`);
    
    // Draw the Desktop logo with original size
    // It should be above the background but below everything else
    ctx.save();
    ctx.globalAlpha = 0.4; // Same opacity as Apple logo
    ctx.drawImage(desktopImage, x, y);
    ctx.globalAlpha = 1.0; // Reset opacity
    ctx.restore();
    
    console.log('\x1b[32m[DESKTOP] Desktop logo drawn successfully\x1b[0m');
  } else {
    console.log('\x1b[31m[DESKTOP] desktopImage is not loaded\x1b[0m');
  }
}

// Core Functions - Canvas Image and Text Overlays

// Core Functions - Canvas Image and Text Overlays

async function drawOnCanvas (data, iconImage) {
  // Width and Heights variables for canvas
  const width = 800;
  const height = 450;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Adjust the hue of the background image (randomly for each card)
  const hueRotation = getRandomHueRotation();
  const adjustedBgImage = adjustImageHue(bgImage, hueRotation);
  
  // Draw the adjusted background image
  ctx.drawImage(adjustedBgImage, 0, 0, width, height);
  
  // Add Android icon as background for Android apps
  if (data.isAndroidApp) {
    await drawAndroidBackground(ctx, width, height, data);
  }
  
  // Add Apple logo for Apple apps
  if (data.isAppleApp) {
    await drawAppleBackground(ctx, width, height);
  }
  
  // Add Desktop logo for Desktop apps
  if (data.isDesktopApp) {
    await drawDesktopBackground(ctx, width, height);
  }
  
  // App Icon - with platform-specific sizing and positioning
  const iconWidth = (data.isHardwareApp || data.isBearerApp) ? 170 : 150; // Increase by 20px for hardware/bearer
  const iconHeight = (data.isHardwareApp || data.isBearerApp) ? 170 : 150; // Increase by 20px for hardware/bearer
  const iconX = (data.isHardwareApp || data.isBearerApp) ? 65 : 60; // Move 5px right for hardware/bearer
  const iconY = 157; // Moved 17px down
  
  // Apply drop shadow and clip, then draw the icon
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;

  ctx.beginPath();
  ctx.moveTo(iconX + 24, iconY);
  ctx.lineTo(iconX + iconWidth - 24, iconY);
  ctx.quadraticCurveTo(iconX + iconWidth, iconY, iconX + iconWidth, iconY + 24);
  ctx.lineTo(iconX + iconWidth, iconY + iconHeight - 24);
  ctx.quadraticCurveTo(iconX + iconWidth, iconY + iconHeight, iconX + iconWidth - 24, iconY + iconHeight);
  ctx.lineTo(iconX + 24, iconY + iconHeight);
  ctx.quadraticCurveTo(iconX, iconY + iconHeight, iconX, iconY + iconHeight - 24);
  ctx.lineTo(iconX, iconY + 24);
  ctx.quadraticCurveTo(iconX, iconY, iconX + 24, iconY);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(iconImage, iconX, iconY, iconWidth, iconHeight);
  ctx.restore();
  
  // Version moved down with the icon
  const iconCenterX = iconX + (iconWidth / 2);
  
  // App Version below the app icon (moved with icon)
  if (data.version) {
    const versionY = iconY + iconHeight + 30; // Now positions relative to new iconY
    
    // ... rest of version code remains the same ...
  }
  
  // Calculate the content area (RRG - moved 10px left and 5px up)
  const contentAreaX = iconX + iconWidth + 20; // Moved 10px left (was +30, now +20)
  const contentAreaWidth = width - contentAreaX - 30; // Available width for RRG
  const contentAreaCenterX = contentAreaX + (contentAreaWidth / 2);

  // Title (app name) - with dynamic font scaling
  const titleY = 185; // Moved 5px up (was 190, now 185)
  let displayTitle = data.title || 'Unknown Title';

  // Dynamic font scaling for title
  let titleFontSize = 32; // Starting font size (increased by 2px as requested)
  const minTitleFontSize = 20; // Minimum readable size
  const maxTitleWidth = contentAreaWidth - 20; // Leave 10px margin on each side
  let titleWidth;

  // Keep reducing font size until text fits or we reach minimum
  do {
    ctx.font = `bold ${titleFontSize}px Barlow`;
    titleWidth = ctx.measureText(displayTitle).width;
    
    if (titleWidth > maxTitleWidth && titleFontSize > minTitleFontSize) {
      titleFontSize -= 1; // Reduce by 1px each iteration
    } else {
      break;
    }
  } while (titleFontSize >= minTitleFontSize);

  // If still too long at minimum font size, truncate
  if (titleWidth > maxTitleWidth) {
    // Truncate character by character until it fits
    while (titleWidth > maxTitleWidth && displayTitle.length > 3) {
      displayTitle = displayTitle.substring(0, displayTitle.length - 4) + '...';
      titleWidth = ctx.measureText(displayTitle).width;
    }
  }

  // Center the title with final measurements
  const centeredTitleX = contentAreaCenterX - (titleWidth / 2);

  ctx.textAlign = 'left';
  printText(displayTitle, ctx, centeredTitleX, titleY, 'white', `bold ${titleFontSize}px Barlow`, 100, 29);
  
  // App Version below the app icon
  if (data.version) {
    const versionY = iconY + iconHeight + 30; // 30px below the icon (adjusted for better centering)
    
    // Add a subtle background for the version
    ctx.save();
    ctx.fillStyle = 'rgba(240, 240, 240, 0.7)';
    ctx.beginPath();
    // Draw rounded rectangle manually for better compatibility
    const rectX = iconCenterX - 60;
    const rectY = versionY - 15;
    const rectWidth = 120;
    const rectHeight = 26;
    const radius = 8;
    
    // Draw the rounded rectangle path
    ctx.moveTo(rectX + radius, rectY);
    ctx.lineTo(rectX + rectWidth - radius, rectY);
    ctx.quadraticCurveTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + radius);
    ctx.lineTo(rectX + rectWidth, rectY + rectHeight - radius);
    ctx.quadraticCurveTo(rectX + rectWidth, rectY + rectHeight, rectX + rectWidth - radius, rectY + rectHeight);
    ctx.lineTo(rectX + radius, rectY + rectHeight);
    ctx.quadraticCurveTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - radius);
    ctx.lineTo(rectX, rectY + radius);
    ctx.quadraticCurveTo(rectX, rectY, rectX + radius, rectY);
    ctx.closePath();
    ctx.fill();
    
    // Set text alignment to center for version
    ctx.textAlign = 'center';
    ctx.font = 'bold 18px Barlow';
    // Adjust the vertical position to center the text in the rectangle
    const versionTextY = rectY + (rectHeight / 2) + 7; // Center vertically with a small adjustment
    printText(data.version, ctx, iconCenterX, versionTextY, 'black', 'bold 20px Barlow', 12, 15);
    ctx.restore();
  }
  
  // Get platform name based on folder name
  let platformName = '';
  if (data.isAppleApp) {
    platformName = 'iPhone';
  } else if (data.isAndroidApp) {
    platformName = 'Android';
  } else if (data.isDesktopApp) {
    platformName = 'Desktop';
  } else if (data.isHardwareApp) {
    platformName = 'Hardware';
  } else {
    // Extract from folder name if available
    if (data.folderName && data.folderName.startsWith('_')) {
      platformName = data.folderName.substring(1); // Remove underscore
      platformName = platformName.charAt(0).toUpperCase() + platformName.slice(1); // Capitalize first letter
      if (platformName === 'Iphone') platformName = 'iPhone'; // Special case for iPhone
      if (platformName === 'Web') platformName = 'Web';
      if (platformName === 'Bearer') platformName = 'Bearer';
      if (platformName === 'Others') platformName = 'Other';
    }
  }
  
  // Platform information and developer name are no longer displayed
  // Define platformY for positioning other elements
  const platformY = titleY + 30;
  
  const mappedVerdict = verdictMap[data.verdict] || data.verdict || 'Unknown Verdict';
  // Reproducible badge overlay removed - now using text display
  
  // Add badges based on app verdict
  // All apps now use the standard layout
  if (data.verdict === 'sourceavailable') {
    console.log(`Using standard layout for source-available app ${data.title} (meta: ${data.meta})`);
    
    // Source-available badge temporarily commented out
    /*
    if (sourceavailableImage) {
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.drawImage(sourceavailableImage, 30, 150, 200, 200); // x, y, width, height
      ctx.restore();
    }
    */
  }
  
  // Android icon is now drawn as a background element earlier in the function
  
  // Calculate verdict position - now positioned below the title on the right side
  const verdictY = titleY + 70; // Position below the title with some spacing
  
  // Set font first so we can measure text properly
  ctx.font = '400 27px Barlow'; // Increased by 7px as requested
  
  // Draw verdict box for all apps
  // Get wrapped lines for the verdict text to calculate proper width
  const verdictLines = wrapText(mappedVerdict, 41);
  
  // Use the same font for measuring as we'll use for display
  // This ensures the rectangle size matches the text size
  
  // Calculate width based on the widest line
  const verdictWidths = verdictLines.map(line => ctx.measureText(line).width);
  const maxVerdictWidth = Math.max(...verdictWidths);
  const horizontalPadding = 24;
  const verdictWidth = maxVerdictWidth + horizontalPadding; // Add more padding for longer verdicts
  const verdictHeight = 50; // Increased height to accommodate larger text
  const centeredVerdictX = contentAreaCenterX - (verdictWidth / 2); // Center the verdict box
  const verdictRectY = verdictY - 30; // Position rectangle to center text vertically
  
  // Draw rounded rectangle with 16px radius (very rounded)
  ctx.save();
  
  // Set background color to FAF0E6 for all verdicts
  ctx.fillStyle = '#FAF0E6';
  
  if (data.verdict === 'sourceavailable') {
    ctx.fillStyle = '#1caaa2'; // Use the green color (same as old stroke)
    // No stroke for sourceavailable
  } else {
    ctx.fillStyle = '#FAF0E6'; // Light background for other verdicts
    
    // Define stroke colors for non-sourceavailable verdicts
    let strokeColor = '#000000'; // Default black stroke
    if (['custodial', 'nosource', 'nosendreceive', 'fake', 'noita', 'prefilled', 'vapor'].includes(data.verdict)) {
      strokeColor = '#aa1c1c';
    } else if (['diy', 'fewusers', 'wip'].includes(data.verdict)) {
      strokeColor = '#B2BEB5';
    }
    
    // Add stroke for non-sourceavailable verdicts
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 4;
  }

  ctx.beginPath();
  ctx.moveTo(centeredVerdictX + 20, verdictRectY);
  ctx.lineTo(centeredVerdictX + verdictWidth - 20, verdictRectY);
  ctx.quadraticCurveTo(centeredVerdictX + verdictWidth, verdictRectY, centeredVerdictX + verdictWidth, verdictRectY + 20);
  ctx.lineTo(centeredVerdictX + verdictWidth, verdictRectY + verdictHeight - 20);
  ctx.quadraticCurveTo(centeredVerdictX + verdictWidth, verdictRectY + verdictHeight, centeredVerdictX + verdictWidth - 20, verdictRectY + verdictHeight);
  ctx.lineTo(centeredVerdictX + 20, verdictRectY + verdictHeight);
  ctx.quadraticCurveTo(centeredVerdictX, verdictRectY + verdictHeight, centeredVerdictX, verdictRectY + verdictHeight - 20);
  ctx.lineTo(centeredVerdictX, verdictRectY + 20);
  ctx.quadraticCurveTo(centeredVerdictX, verdictRectY, centeredVerdictX + 20, verdictRectY);
  ctx.fill();

  // Add stroke only for non-sourceavailable verdicts
  if (data.verdict !== 'sourceavailable') {
    ctx.stroke();
  }

  ctx.restore();

  // Draw the verdict text with appropriate color
  ctx.textAlign = 'left';

  // Text color based on verdict background
  const textColor = data.verdict === 'sourceavailable' ? 'white' : 'black';
  const centeredTextY = verdictRectY + (verdictHeight / 2) + 10;
  printText(mappedVerdict, ctx, centeredVerdictX + 12, centeredTextY, textColor, '400 27px Barlow', 41, 30); // Add padding from the left edge of the box
  
  // If verdict is sourceavailable AND meta is not 'ok', display the meta verdict message underneath
  if (data.verdict === 'sourceavailable' && data.meta && data.meta !== 'ok') {
    // Custom meta messages
    let metaMessage = '';
    
    if (data.meta === 'obsolete') {
      metaMessage = 'But not updated for > 2 years';
    } else if (data.meta === 'removed') {
      metaMessage = 'But this product was removed';
    } else if (data.meta === 'deprecated') {
      metaMessage = 'But this product will be replaced';
    } else {
      // Fallback to existing logic for other meta types
      if (metaVerdictMap[data.meta] && metaVerdictMap[data.meta].message) {
        metaMessage = metaVerdictMap[data.meta].message;
        // Special handling for 'defunct' meta verdict to prevent text overflow
        if (data.meta === 'defunct') {
          metaMessage = "This product went out of business...or so";
        }
      } else {
        metaMessage = data.meta;
      }
      
      // Ensure first letter is lowercase for fallback cases
      if (metaMessage.length > 0) {
        metaMessage = metaMessage.charAt(0).toLowerCase() + metaMessage.slice(1);
      }
      
      // Add "But " prefix only for fallback cases
      metaMessage = `But ${metaMessage}`;
    }
    
    // Dynamic font scaling for meta message
    let metaFontSize = 22;
    const minMetaFontSize = 16;
    const maxMetaWidth = contentAreaWidth - 40; // Leave more margin for meta
    let metaTextWidth;
    
    // Scale font down until it fits
    do {
      ctx.font = `italic ${metaFontSize}px Barlow`;
      metaTextWidth = ctx.measureText(metaMessage).width;
      
      if (metaTextWidth > maxMetaWidth && metaFontSize > minMetaFontSize) {
        metaFontSize -= 1;
      } else {
        break;
      }
    } while (metaFontSize >= minMetaFontSize);
    
    // Calculate centered position
    const metaWidth = metaTextWidth + 24;
    const metaHeight = 34;
    const centeredMetaX = contentAreaCenterX - (metaWidth / 2); // Center the meta box
    const metaY = verdictY + 60;
    
    // Draw rounded rectangle with 12px radius
    ctx.save();
    ctx.fillStyle = 'rgba(211, 49, 0, 0.9)';
    ctx.beginPath();
    ctx.roundRect(centeredMetaX, metaY - 20, metaWidth, metaHeight, 12);
    ctx.fill();
    ctx.restore();
    
    // Draw the meta message text (centered)
    ctx.font = `italic ${metaFontSize}px Barlow`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText(metaMessage, centeredMetaX + 12, metaY + 6);
  }
  
// Display Nostr verification info - with enhanced dynamic sizing
if (data.verdict === 'sourceavailable' && data.meta === 'ok' && data.nostrBuildStatus) {
  let nostrInfoY = verdictY + 70;
  
  // Create badge text WITHOUT date
  const versionText = data.latestVersion ? `${data.latestVersion}` : '';

  // Dynamic length detection for status text
  const preferLong = USE_LONG_NOSTR_DESCRIPTIONS;
  let statusText;

  if (preferLong) {
    // Always try long version first - REMOVE THE SPECIAL CASE
    statusText = getStatusText(data.nostrBuildStatus, false); // Always use long version
  } else {
    // Use short version - REMOVE THE SPECIAL CASE  
    statusText = getStatusText(data.nostrBuildStatus, true); // Always use short version
  }

  let badgeTextParts = [];
  if (versionText) badgeTextParts.push(versionText);
  if (statusText) badgeTextParts.push(statusText);
  const badgeText = badgeTextParts.join(' ');
  
  // Enhanced dynamic sizing with multi-line first approach
  let fontSize = 27; // Starting font size
  const minFontSize = 18; // Minimum readable size
  const maxSingleLineWidth = contentAreaWidth + 20; // Enlarged by 40px each side (was -60, now +20)
  const maxTotalWidth = contentAreaWidth + 40; // Enlarged by 40px each side (was -40, now +40)
  let badgeWidth;
  let badgeHeight = 36; // Base height for single line
  let isMultiLine = false;
  let line1 = '';
  let line2 = '';
  
  // Step 1: Check if single line fits at current font size
  ctx.font = `${fontSize}px Barlow`;
  badgeWidth = ctx.measureText(badgeText).width + 24;
  
  // Step 2: If too wide for single line, try multi-line FIRST
  if (badgeWidth > maxSingleLineWidth) {
    isMultiLine = true;
    badgeHeight = 72; // Double height for two lines
    
    // Split intelligently at word boundaries
    const words = badgeText.split(' ');
    let bestSplit = Math.floor(words.length / 2);
    let minWidthDiff = Infinity;
    
    // Find the split that creates the most balanced lines
    for (let i = 1; i < words.length; i++) {
      const testLine1 = words.slice(0, i).join(' ');
      const testLine2 = words.slice(i).join(' ');
      
      ctx.font = `${fontSize}px Barlow`; // Use current font size for measurement
      const width1 = ctx.measureText(testLine1).width;
      const width2 = ctx.measureText(testLine2).width;
      const widthDiff = Math.abs(width1 - width2);
      
      // Both lines must fit in max width
      if (width1 + 24 <= maxTotalWidth && width2 + 24 <= maxTotalWidth && widthDiff < minWidthDiff) {
        minWidthDiff = widthDiff;
        bestSplit = i;
      }
    }
    
    line1 = words.slice(0, bestSplit).join(' ');
    line2 = words.slice(bestSplit).join(' ');
    
    // Calculate width based on the wider line at current font size
    ctx.font = `${fontSize}px Barlow`;
    const line1Width = ctx.measureText(line1).width + 24;
    const line2Width = ctx.measureText(line2).width + 24;
    badgeWidth = Math.max(line1Width, line2Width);
    
    // Step 3: If multi-line still too wide, THEN scale font down within multi-line
    if (badgeWidth > maxTotalWidth && fontSize > minFontSize) {
      while (badgeWidth > maxTotalWidth && fontSize > minFontSize) {
        fontSize -= 1;
        ctx.font = `${fontSize}px Barlow`;
        
        // Recalculate line widths with new font size
        const newLine1Width = ctx.measureText(line1).width + 24;
        const newLine2Width = ctx.measureText(line2).width + 24;
        badgeWidth = Math.max(newLine1Width, newLine2Width);
      }
    }
    
    // Step 4: If STILL too wide even with smallest font in multi-line, fallback to short version
    if (badgeWidth > maxTotalWidth) {
      console.log(`[DEBUG] Multi-line still too wide at ${fontSize}px, falling back to short version`);
      isMultiLine = false;
      badgeHeight = 36;
      statusText = getStatusText(data.nostrBuildStatus, true); // Now use short version
      
      // Rebuild with short text
      badgeTextParts = [];
      if (versionText) badgeTextParts.push(versionText);
      if (statusText) badgeTextParts.push(statusText);
      const fallbackText = badgeTextParts.join(' ');
      
      // Reset font size and try single line with short text
      fontSize = 27;
      ctx.font = `${fontSize}px Barlow`;
      badgeWidth = ctx.measureText(fallbackText).width + 24;
      
      // Scale down short text if needed
      while (badgeWidth > maxSingleLineWidth && fontSize > minFontSize) {
        fontSize -= 1;
        ctx.font = `${fontSize}px Barlow`;
        badgeWidth = ctx.measureText(fallbackText).width + 24;
      }
    }
  } else {
    // Step 5: Single line fits, but try font scaling if needed
    while (badgeWidth > maxSingleLineWidth && fontSize > minFontSize) {
      fontSize -= 1;
      ctx.font = `${fontSize}px Barlow`;
      badgeWidth = ctx.measureText(badgeText).width + 24;
    }
  }
  
  // Ensure minimum width for aesthetic purposes
  badgeWidth = Math.max(badgeWidth, 120);
  
  // Center the badge
  const centeredBadgeX = contentAreaCenterX - (badgeWidth / 2);
  
  // Determine stroke color
  let strokeColor = 'white';
  if (data.nostrBuildStatus === 'reproducible') {
    strokeColor = '#4ADE80';
  } else if (['not_reproducible', 'ftbfs', 'spam', 'nosource', 'obfuscated'].includes(data.nostrBuildStatus)) {
    strokeColor = '#F87171';
  } else if (['notag', 'warning'].includes(data.nostrBuildStatus)) {
    strokeColor = '#FFA500';
  } else {
    strokeColor = '#aa1c1c';
  }
  
  // Draw badge border (now with dynamic height)
  ctx.save();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(centeredBadgeX, nostrInfoY - 8, badgeWidth, badgeHeight, 14);
  ctx.stroke();
  ctx.restore();
  
  // Draw badge text - single or multi-line
  ctx.font = `${fontSize}px Barlow`;
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  
  if (isMultiLine) {
    // Draw two lines centered vertically within the expanded container
    const textCenterX = centeredBadgeX + (badgeWidth / 2);
    const line1Y = nostrInfoY - 8 + (badgeHeight / 4) + 8; // Quarter height + adjustment
    const line2Y = nostrInfoY - 8 + (3 * badgeHeight / 4) + 8; // Three quarters height + adjustment
    
    ctx.fillText(line1, textCenterX, line1Y);
    ctx.fillText(line2, textCenterX, line2Y);
    
    console.log(`[DEBUG] Using multi-line: "${line1}" / "${line2}" at ${fontSize}px`);
  } else {
    // Single line centered
    const textY = nostrInfoY - 8 + (badgeHeight / 2) + 10;
    const textCenterX = centeredBadgeX + (badgeWidth / 2);
    const finalText = badgeTextParts.length > 0 ? badgeTextParts.join(' ') : badgeText;
    ctx.fillText(finalText, textCenterX, textY);
    
    console.log(`[DEBUG] Using single line: "${finalText}" at ${fontSize}px`);
  }
  
  // Draw date separately below the badge (adjust spacing for multi-line)
  if (data.latestDate) {
    ctx.font = '20px Barlow';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.textAlign = 'center';
    const dateSpacing = isMultiLine ? 25 : 37; // Less spacing for multi-line since container is taller
    const dateY = nostrInfoY - 8 + badgeHeight + dateSpacing;
    ctx.fillText(data.latestDate, contentAreaCenterX, dateY);
  }
}
  
  // Reset text alignment to default
  ctx.textAlign = 'start';

  // ------------------------------

  function dateOrUnknown (date) {
    return date ? formatDate(date) : 'Unknown';
  }

  return canvas;
}

function printText (text, ctx, x, y, fillStyle, font, maxLength, lineHeight) {
  const wrapped = wrapText(text, maxLength || 1000);
  ctx.font = font || ctx.font;
  ctx.fillStyle = fillStyle || ctx.fillStyle;
  for (let i = 0; i < wrapped.length; i++) {
    const line = wrapped[i];
    ctx.fillText(line, x, y + (i * (lineHeight || 0)));
  }
}

// Core Functions - Process One File
async function processOneFile (platform, mdFilesPath, file, outputFolderPath) {
  const parts = (await fsp.readFile(path.join(mdFilesPath, file), 'utf-8')).split('---');
  let data;
  try {
    data = yaml.load(parts[1]);
  } catch (e) {
    console.log(`processOneFile(${platform}, ${mdFilesPath}, ${file}, ${outputFolderPath})`);
    console.error(e);
    totalFiles--;
    return;
  }
  
  // Check if the app is from the _android or _iphone folder
  data.isAndroidApp = mdFilesPath.includes('_android');
  data.isAppleApp = mdFilesPath.includes('_iphone');
  data.isDesktopApp = mdFilesPath.includes('_desktop');
  
  // Add platform detection for hardware and bearer apps
  data.isHardwareApp = mdFilesPath.includes('_hardware');
  data.isBearerApp = mdFilesPath.includes('_bearer');
  
  // Track platform statistics
  if (data.isAndroidApp) stats.platforms.android++;
  else if (data.isAppleApp) stats.platforms.iphone++;
  else if (data.isDesktopApp) stats.platforms.desktop++;
  else if (data.isHardwareApp) stats.platforms.hardware++;
  else if (data.isBearerApp) stats.platforms.bearer++;
  
  // Debug iPhone app detection
  if (data.isAppleApp) {
    console.log(`\x1b[36m[APPLE] Found iPhone app: ${data.title} in ${mdFilesPath}\x1b[0m`);
  }

  let iconImagePath = path.join('images', 'wIcons', platform, `${data.icon}`);
  if (!fs.existsSync(iconImagePath)) {
    iconImagePath = fallbackIcon;
  }
  
  // Load the bg image and icon
  let iconImage;
  try {
    iconImage = await loadImage(iconImagePath);
  } catch (error) {
    console.error(`Error processing file ${file}: `, error);
    stats.totalFailed++;
    totalFiles--;
    return;
  }
  
  // Add Nostr data for sourceavailable apps with meta: ok
  if (data.verdict === 'sourceavailable' && data.meta === 'ok') {
    data.nostrBuildStatus = null; // Initialize
    data.nostrVerificationCount = 0; // Initialize
    data.nostrReproducibleCount = 0; // Initialize

    console.log(`\x1b[36m[NOSTR] Processing source available app: ${data.title} (${file})\x1b[0m`);
    
    if (data.appId && fs.existsSync(NOSTR_BACKUP_PATH)) {
      try {
        console.log(`[NOSTR] Checking local Nostr data for ${data.appId}...`);
        const nostrVerificationSummary = getNostrVerificationSummaryForApp(data.appId);
        
        // Always store the count, even if no 'latest' event was suitable
        if (nostrVerificationSummary) {
          data.nostrVerificationCount = nostrVerificationSummary.verificationCount;
          data.nostrReproducibleCount = nostrVerificationSummary.reproducibleCount;
          
          if (data.nostrVerificationCount > 0) {
            console.log(`\x1b[32m[NOSTR] Found ${data.nostrVerificationCount} verifications for ${data.appId} (${data.nostrReproducibleCount} reproducible)\x1b[0m`);
          } else {
            console.log(`\x1b[33m[NOSTR] No verifications found for ${data.appId}\x1b[0m`);
          }
        }

        if (nostrVerificationSummary && nostrVerificationSummary.latestStatus) {
          console.log(`\x1b[32m[NOSTR] Latest status for ${data.appId}: Status=${nostrVerificationSummary.latestStatus}, V=${nostrVerificationSummary.latestVersion || 'N/A'}, Date=${nostrVerificationSummary.latestDate || 'N/A'}\x1b[0m`);
          data.nostrBuildStatus = nostrVerificationSummary.latestStatus;
          
          // Track Nostr verification statistics
          stats.nostrVerification.total++;
          if (stats.nostrVerification[nostrVerificationSummary.latestStatus] !== undefined) {
            stats.nostrVerification[nostrVerificationSummary.latestStatus]++;
          } else {
            stats.nostrVerification.unknown++;
          }
          
          // Debug output for reproducible status
          if (nostrVerificationSummary.latestStatus === 'reproducible') {
            console.log(`\x1b[32m[NOSTR] ★★★ REPRODUCIBLE BUILD DETECTED for ${data.appId} ★★★\x1b[0m`);
          }
          
          // Store the latest date for display in the Twitter card
          if (nostrVerificationSummary.latestDate) {
            data.latestDate = nostrVerificationSummary.latestDate;
            console.log(`[NOSTR] Latest verification date: ${data.latestDate}`);
          }
          
          // Store platform information if available
          if (nostrVerificationSummary.platform) {
            data.platform = nostrVerificationSummary.platform;
            console.log(`[NOSTR] Platform: ${data.platform}`);
          }
          
          // Only override version and date if Nostr provides them
          if (nostrVerificationSummary.latestVersion) {
            // Store latest version in both fields - one for display in version badge, one for info box
            data.version = nostrVerificationSummary.latestVersion;
            data.latestVersion = nostrVerificationSummary.latestVersion;
            console.log(`[NOSTR] Updated version to ${data.version} from Nostr`);
          }
          if (nostrVerificationSummary.latestDate) {
            data.date = nostrVerificationSummary.latestDate;
            console.log(`[NOSTR] Updated date to ${data.date} from Nostr`);
          }
        } else {
          console.log(`\x1b[33m[NOSTR] No latest status found in Nostr data for ${data.appId}\x1b[0m`);
        }
      } catch (error) {
        console.error(`\x1b[31m[NOSTR] Error processing Nostr data for ${data.appId}: ${error.message}\x1b[0m`);
        // Continue without Nostr data
      }
    } else if (data.appId && !fs.existsSync(NOSTR_BACKUP_PATH)) {
      console.warn(`\x1b[33m[NOSTR] No Nostr backup directory available for ${data.appId}. Using MD data only.\x1b[0m`);
    } else if (!data.appId) {
      console.warn(`\x1b[31m[NOSTR] No appId in MD for ${file}. Cannot query Nostr.\x1b[0m`);
    }
    
    // Summary of Nostr data for this app
    if (data.nostrBuildStatus || data.nostrVerificationCount > 0) {
      console.log(`\x1b[36m[NOSTR] Final data for ${data.title}: buildStatus=${data.nostrBuildStatus || 'N/A'}, verificationCount=${data.nostrVerificationCount}, reproducibleCount=${data.nostrReproducibleCount || 0}\x1b[0m`);
    }
  } else if (data.verdict === 'sourceavailable' && data.meta !== 'ok') {
    console.log(`\x1b[33m[NOSTR] App ${data.title} has verdict 'sourceavailable' but meta is not 'ok' (${data.meta}). Skipping Nostr processing.\x1b[0m`);
    // Don't reset nostrBuildStatus if it's 'reproducible' to ensure badge displays
    if (data.nostrBuildStatus !== 'reproducible') {
      data.nostrBuildStatus = null;
    }
    data.nostrVerificationCount = 0;
    data.nostrReproducibleCount = 0;
  } else {
    // For verdicts other than 'sourceavailable', initialize Nostr fields to null
    // Don't reset nostrBuildStatus if it's 'reproducible' to ensure badge displays
    if (data.nostrBuildStatus !== 'reproducible') {
      data.nostrBuildStatus = null;
    }
    data.nostrVerificationCount = 0;
    data.nostrReproducibleCount = 0;
  }



  // Draw on the canvas
  const canvas = await drawOnCanvas(data, iconImage);

  // Export the canvas as a PNG file
  const dataURL = canvas.toDataURL('image/png');

  // Save the Canvas as an image
  const outputPath = `${outputFolderPath}/${file.replace('.md', '.png')}`;
  await fsp.writeFile(outputPath, dataURL.replace(/^data:image\/png;base64,/, ''), 'base64');

  totalFiles--;
}

// Core Functions - Process Files
async function processFiles () {
  const socialImagesFolderPath = 'images/social';
  if (!fs.existsSync(socialImagesFolderPath)) {
    fs.mkdirSync(socialImagesFolderPath);
  }

  const asyncTasks = [];
  
  // If processing a single file
  if (singleFileName) {
    for (const mdFolder of mdFolders) {
      const mdFilesPath = mdFolder;
      const platform = mdFolder.substring(1);
      
      // Check if folder exists
      if (!fs.existsSync(mdFilesPath)) {
        console.error(`Error: Folder '${mdFilesPath}' does not exist.`);
        continue;
      }
      
      const outputFolderPath = `images/social/${platform}`;
      if (!fs.existsSync(outputFolderPath)) {
        fs.mkdirSync(outputFolderPath);
      }

      console.log(`Processing single file ${singleFileName} from ${mdFolder}...`);
      totalFiles++;
      asyncTasks.push(limit(() => processOneFile(platform, mdFilesPath, singleFileName, outputFolderPath)));
    }
  } 
  // Process all files in the specified folders
  else {
    for (const mdFolder of mdFolders) {
      const mdFilesPath = mdFolder;
      const platform = mdFolder.substring(1);
      
      // Check if folder exists
      if (!fs.existsSync(mdFilesPath)) {
        console.error(`Error: Folder '${mdFilesPath}' does not exist.`);
        continue;
      }
      
      const files = await fsp.readdir(mdFilesPath);
      const outputFolderPath = `images/social/${platform}`;
      if (!fs.existsSync(outputFolderPath)) {
        fs.mkdirSync(outputFolderPath);
      }

      console.log(`Processing ${files.length} files from ${mdFolder}...`);
      for (const file of files) {
        totalFiles++;
        asyncTasks.push(limit(() => processOneFile(platform, mdFilesPath, file, outputFolderPath)));
      }
    }
  }
  
  await Promise.all(asyncTasks);
}

// Summary function to display statistics
function displaySummary() {
  console.log('\n' + '='.repeat(60));
  console.log('\x1b[1m\x1b[36m                    PROCESSING SUMMARY\x1b[0m');
  console.log('='.repeat(60));
  
  const totalProcessed = stats.platforms.android + stats.platforms.iphone + 
                        stats.platforms.desktop + stats.platforms.bearer + 
                        stats.platforms.hardware;
  
  console.log(`\x1b[1mTotal number of apps processed: ${totalProcessed}\x1b[0m`);
  console.log(`  - Android: ${stats.platforms.android}`);
  console.log(`  - iPhone: ${stats.platforms.iphone}`);
  console.log(`  - Desktop: ${stats.platforms.desktop}`);
  console.log(`  - Bearer: ${stats.platforms.bearer}`);
  console.log(`  - Hardware: ${stats.platforms.hardware}`);
  
  console.log(`\n\x1b[31mTotal failed: ${stats.totalFailed}\x1b[0m`);
  
  console.log(`\n\x1b[1mTotal with Nostr verification: ${stats.nostrVerification.total}\x1b[0m`);
  console.log(`  - \x1b[32mReproducible: ${stats.nostrVerification.reproducible}\x1b[0m`);
  console.log(`  - \x1b[31mNot reproducible: ${stats.nostrVerification.not_reproducible}\x1b[0m`);
  console.log(`  - \x1b[31mFailed to build: ${stats.nostrVerification.ftbfs}\x1b[0m`);
  
  if (stats.nostrVerification.spam > 0) {
    console.log(`  - \x1b[33mSpam: ${stats.nostrVerification.spam}\x1b[0m`);
  }
  if (stats.nostrVerification.notag > 0) {
    console.log(`  - \x1b[33mNo git revision: ${stats.nostrVerification.notag}\x1b[0m`);
  }
  if (stats.nostrVerification.nosource > 0) {
    console.log(`  - \x1b[33mNo source: ${stats.nostrVerification.nosource}\x1b[0m`);
  }
  if (stats.nostrVerification.obfuscated > 0) {
    console.log(`  - \x1b[33mObfuscated: ${stats.nostrVerification.obfuscated}\x1b[0m`);
  }
  if (stats.nostrVerification.warning > 0) {
    console.log(`  - \x1b[33mWarning: ${stats.nostrVerification.warning}\x1b[0m`);
  }
  if (stats.nostrVerification.unknown > 0) {
    console.log(`  - \x1b[33mUnknown: ${stats.nostrVerification.unknown}\x1b[0m`);
  }
  
  console.log('='.repeat(60));
}

processFilesTimed();
