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
const sourceavailableImagePath = 'images/twCard/sourceavailable.png';
// Reproducible badge removed - now using text display
const androidImagePath = 'images/twCard/android_icon.png';
const appleImagePath = 'images/twCard/apple_logo.png';
const desktopImagePath = 'images/twCard/desktop_logo.png';
const sadNostrichImagePath = 'images/twCard/sad_nostrich.png';
const nostrImagePath = 'images/twCard/nostr_icon.png';
const fallbackIcon = 'images/smallNoicon.png';

// Global variables for images
let bgImage, sourceavailableImage, androidImage, appleImage, desktopImage, sadNostrichImage, nostrImage;
const verdictMap = loadVerdicts('_data/verdicts');
// Load meta verdicts
const metaVerdictMap = loadMetaVerdicts('_data/verdicts');
// Manual mapping for Nostr build statuses
const nostrStatusMap = {
  'reproducible': 'Reproducible',
  'not_reproducible': 'Not Reproducible',
  'ftbfs': '⚠ Build failed'
};
// Cache for Nostr verification info to avoid repeated grep/jq calls
let nostrVerificationCache = new Map();

// Timer variables
let totalFiles = 0;
let totalTime = 0;
let oldTotalFiles = 0;
const startTime = Date.now();

async function loadResources () {
  // Load the background image
  try {
    bgImage = await loadImage(backgroundImage);
  } catch (error) {
    console.warn(`Could not load background image from ${backgroundImage}: ${error.message}`);
  }
  
  // We now use the standard background for all cards
  
  // Load the sourceavailable image
  try {
    sourceavailableImage = await loadImage(sourceavailableImagePath);
  } catch (error) {
    console.warn(`Could not load sourceavailable image from ${sourceavailableImagePath}: ${error.message}`);
  }
  
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

  // Load Sad Nostrich image
  try {
    sadNostrichImage = await loadImage(sadNostrichImagePath);
  } catch (error) {
    console.error(`Error loading Sad Nostrich image: ${error.message}`);
  }

  // Load Nostr icon
  try {
    nostrImage = await loadImage(nostrImagePath);
    console.log(`\x1b[32m[NOSTR] Successfully loaded Nostr icon from ${nostrImagePath}\x1b[0m`);
  } catch (error) {
    console.error(`\x1b[31m[NOSTR] Error loading Nostr icon: ${error.message}\x1b[0m`);
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
  
  // App Icon - Draw the resized icon image at specified coordinates
  const iconWidth = 150;
  const iconHeight = 150;
  const iconX = 30; 
  const iconY = 140; // Moved 10px up
  
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
  
  // Version centered below the app icon
  const iconCenterX = iconX + (iconWidth / 2);
  
  // Title (app name) to the right of the app icon, top aligned
  const titleX = iconX + iconWidth + 30; // 30px to the right of the icon
  const titleY = 190; // Exactly top aligned with the app icon
  let displayTitle = data.title || 'Unknown Title';
  if (displayTitle.length > 40) {
    displayTitle = displayTitle.substring(0, 37) + '...';
  }
  ctx.textAlign = 'left'; // Left align the title
  printText(displayTitle, ctx, titleX, titleY, 'white', 'bold 30px Barlow', 40, 29);
  
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
  const verdictX = titleX; // Align with the title on the right side
  const verdictRectY = verdictY - 30; // Position rectangle to center text vertically
  
  // Draw rounded rectangle with 16px radius (very rounded)
  ctx.save();
  
  // Set background color to FAF0E6 for all verdicts
  ctx.fillStyle = '#FAF0E6';
  
  // Define stroke colors based on verdict
  let strokeColor = '#000000'; // Default black stroke
  
  if (data.verdict === 'sourceavailable') {
    strokeColor = '#1caaa2';
  } else if (['custodial', 'nosource', 'nosendreceive', 'fake', 'noita', 'prefilled', 'vapor'].includes(data.verdict)) {
    strokeColor = '#aa1c1c';
  } else if (['diy', 'fewusers', 'wip'].includes(data.verdict)) {
    strokeColor = '#B2BEB5';
  }
  
  ctx.beginPath();
  ctx.moveTo(verdictX + 12, verdictRectY);
  ctx.lineTo(verdictX + verdictWidth - 12, verdictRectY);
  ctx.quadraticCurveTo(verdictX + verdictWidth, verdictRectY, verdictX + verdictWidth, verdictRectY + 12);
  ctx.lineTo(verdictX + verdictWidth, verdictRectY + verdictHeight - 12);
  ctx.quadraticCurveTo(verdictX + verdictWidth, verdictRectY + verdictHeight, verdictX + verdictWidth - 12, verdictRectY + verdictHeight);
  ctx.lineTo(verdictX + 12, verdictRectY + verdictHeight);
  ctx.quadraticCurveTo(verdictX, verdictRectY + verdictHeight, verdictX, verdictRectY + verdictHeight - 12);
  ctx.lineTo(verdictX, verdictRectY + 12);
  ctx.quadraticCurveTo(verdictX, verdictRectY, verdictX + 12, verdictRectY);
  ctx.fill();
  
  // Add 4px stroke
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 4;
  ctx.stroke();
  
  ctx.restore();

  // Draw the verdict text for all apps
  ctx.textAlign = 'left';
  
  // Use black text for all verdicts since background is now consistent light color
  const textColor = 'black';
  const centeredTextY = verdictRectY + (verdictHeight /2) + 10;
  printText(mappedVerdict, ctx, verdictX + 12, centeredTextY, textColor, '400 27px Barlow', 41, 30); // Add padding from the left edge of the box
  
  // If verdict is sourceavailable AND meta is not 'ok', display the meta verdict message underneath
  if (data.verdict === 'sourceavailable' && data.meta && data.meta !== 'ok') {
    // Get the meta verdict message
    let metaMessage = '';
    
    // Try to get the message from the metaVerdictMap
    if (metaVerdictMap[data.meta] && metaVerdictMap[data.meta].message) {
      metaMessage = metaVerdictMap[data.meta].message;
      // Special handling for 'defunct' meta verdict to prevent text overflow
      if (data.meta === 'defunct') {
        // Truncate the message to "This product went out of business...or so"
        metaMessage = "This product went out of business...or so";
      }
    } else {
      // Fallback to just the meta value
      metaMessage = data.meta;
    }
    
    // Draw a subtle rounded rectangle background for the meta message
    // Ensure first letter of metaMessage is lowercase
    let formattedMetaMessage = metaMessage;
    if (formattedMetaMessage.length > 0) {
      formattedMetaMessage = formattedMetaMessage.charAt(0).toLowerCase() + formattedMetaMessage.slice(1);
    }
    
    const metaText = `But ${formattedMetaMessage}`;
    ctx.font = 'italic 22px Barlow'; // Enlarged to 22, must also set value for other ctx.font
    const metaMetrics = ctx.measureText(metaText);
    const metaWidth = metaMetrics.width + 24; // Add padding but limit width
    const metaHeight = 34;
    const metaX = verdictX; // Align with the verdict box
    const metaY = verdictY + 60; // Position below the verdict text
    
    // Draw rounded rectangle with 12px radius
    ctx.save();
    ctx.fillStyle = 'rgba(211, 49, 0, 0.9)'; // Semi-transparent white background
    ctx.beginPath();
    ctx.roundRect(metaX, metaY - 20, metaWidth, metaHeight, 12);
    ctx.fill();
    ctx.restore();
    
    // Draw the meta message text
    ctx.font = 'italic 22px Barlow'; // must also set in other ctx.font (verdict: sa but not meta:ok)
    ctx.fillStyle = '#ffffff'; // Use the stale.yml color as default for meta messages
    ctx.textAlign = 'left';
    ctx.fillText(metaText, metaX + 12, metaY + 6); // Add padding from the left edge of the box
  }
  
  // Display Nostr verification info for sourceavailable apps with meta: ok
  if (data.verdict === 'sourceavailable' && data.meta === 'ok' && data.nostrBuildStatus) {
    // Position below the verdict box
    let nostrInfoY = verdictY + 70;
    if (data.meta && data.meta !== 'ok') {
      nostrInfoY = verdictY + 130; // Position below meta message if it exists
    }
    
    // Create badge-style display - rearranged: version • verdict • date
    const versionText = data.latestVersion ? `v${data.latestVersion}` : '';
    const statusText = data.nostrBuildStatus === 'reproducible' ? '✓ Reproducible' : nostrStatusMap[data.nostrBuildStatus];
    const dateText = data.latestDate ? data.latestDate : '';
    
    // Combine in new order: version • status • date
    let badgeTextParts = [];
    if (versionText) badgeTextParts.push(versionText);
    if (statusText) badgeTextParts.push(statusText);
    if (dateText) badgeTextParts.push(dateText);
    const badgeText = badgeTextParts.join(' • ');
    
    // Badge height for consistent sizing
    const badgeHeight = 36;
    
    // Nostr icon setup (50% smaller)
    const nostrIconSize = 50; // Reduced from 100 to 50
    const nostrIconX = titleX; // Align left with verdict text
    const badgeX = nostrIconX + nostrIconSize + 10; // Badge positioned after icon with 10px gap
    
    // Load and draw Nostr icon
    if (nostrImage) {
      const nostrIconY = nostrInfoY - 8 - (nostrIconSize - badgeHeight) / 2; // Center with badge
      
      ctx.save();
      ctx.drawImage(nostrImage, nostrIconX, nostrIconY, nostrIconSize, nostrIconSize);
      ctx.restore();
    }
    
    // Determine stroke color based on verification status
    let strokeColor = 'white'; // Default
    if (data.nostrBuildStatus === 'reproducible') {
      strokeColor = '#4ADE80'; // Subtle green
    } else if (data.nostrBuildStatus === 'not_reproducible') {
      strokeColor = '#F87171'; // Subtle red
    } else if (data.nostrBuildStatus === 'ftbfs') {
      strokeColor = '#aa1c1c'; // Red like verdict colors
    }
    
    // Calculate available width for text (from badge start to card edge)
    const cardWidth = 800;
    const maxBadgeWidth = cardWidth - badgeX - 30; // 30px margin from right edge
    
    // Measure text for badge sizing (enlarged text)
    ctx.font = '26px Barlow';
    const fullTextWidth = ctx.measureText(badgeText).width + 24;
    
    // Check if text fits in one line or needs to be split
    if (fullTextWidth <= maxBadgeWidth) {
      // Single line badge
      const badgeWidth = fullTextWidth;
      
      // Draw badge border with status-based color
      ctx.save();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(badgeX, nostrInfoY - 8, badgeWidth, badgeHeight, 14);
      ctx.stroke();
      ctx.restore();
      
      // Draw badge text (vertically centered)
      ctx.font = '26px Barlow';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'left';
      // Vertical centering: badge top + half height + small font adjustment (increase +2 to move text down, decrease to move up)
      const textY = nostrInfoY - 8 + (badgeHeight / 2) + 10;
      ctx.fillText(badgeText, badgeX + 12, textY);
    } else {
      // Multi-line badge - handle ftbfs specially
      let firstLine = '';
      let secondLine = '';
      let verticalGap = 4; // Default gap
      
      // Standard intelligent splitting for all cases
      const words = badgeText.split(' ');
      
      // Find the best split point
      for (let i = 0; i < words.length; i++) {
        const testLine = firstLine + (firstLine ? ' ' : '') + words[i];
        const testWidth = ctx.measureText(testLine).width + 24;
        
        if (testWidth <= maxBadgeWidth) {
          firstLine = testLine;
        } else {
          secondLine = words.slice(i).join(' ');
          break;
        }
      }
      
      // If no good split found, force split at character level
      if (!secondLine && firstLine !== badgeText) {
        const chars = badgeText.split('');
        firstLine = '';
        for (let i = 0; i < chars.length; i++) {
          const testLine = firstLine + chars[i];
          const testWidth = ctx.measureText(testLine).width + 24;
          if (testWidth <= maxBadgeWidth) {
            firstLine = testLine;
          } else {
            secondLine = chars.slice(i).join('');
            break;
          }
        }
      }
      
      // Calculate widths for both lines
      const firstLineWidth = Math.max(ctx.measureText(firstLine).width + 24, 100);
      const secondLineWidth = Math.max(ctx.measureText(secondLine).width + 24, 100);
      
      // Draw first badge
      ctx.save();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(badgeX, nostrInfoY - 8, firstLineWidth, badgeHeight, 14);
      ctx.stroke();
      ctx.restore();
      
      // Draw second badge below first with adjusted gap
      const secondBadgeY = nostrInfoY - 8 + badgeHeight + verticalGap;
      ctx.save();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(badgeX, secondBadgeY, secondLineWidth, badgeHeight, 14);
      ctx.stroke();
      ctx.restore();
      
      // Draw text for both badges
      ctx.font = '26px Barlow';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'left';
      
      // First line text (vertical centering: increase +2 to move down, decrease to move up)
      const firstTextY = nostrInfoY - 8 + (badgeHeight / 2) + 2;
      ctx.fillText(firstLine, badgeX + 12, firstTextY);
      
      // Second line text (vertical centering: increase +2 to move down, decrease to move up)
      const secondTextY = secondBadgeY + (badgeHeight / 2) + 2;
      ctx.fillText(secondLine, badgeX + 12, secondTextY);
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

processFilesTimed();
