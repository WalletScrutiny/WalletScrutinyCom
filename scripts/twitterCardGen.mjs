// Import libraries
import fs from 'fs';
import { createCanvas, loadImage, registerFont } from 'canvas';
import yaml from 'js-yaml';
import path from 'path';
import pLimit from 'p-limit';
import { execSync } from 'child_process';

// Constants
const fsp = fs.promises;
const limit = pLimit(8); // Allow 8 concurrent async operations
const mdFolders = [
  '_android',
  '_bearer',
  '_hardware',
  '_iphone',
  '_desktop']; // MD file folders

// Configuration flags
const SKIP_NOSTR = process.argv.includes('--skip-nostr'); // Skip Nostr integration if this flag is provided
const NOSTR_BACKUP_PATH = 'backup/nostr-verification-events'; // Path to Nostr backup files
const backgroundImage = 'images/twCard/socGenCardblue.png';
let bgImage, reproducibleImage, sourceavailableImage;
// Load badge images
const sourceavailableImagePath = 'images/twCard/sourceavailable.png';
const reproducibleImagePath = 'images/twCard/reproducible.png';
const fallbackIcon = 'images/smallNoicon.png';
const verdictMap = loadVerdicts('_data/verdicts');
// Load meta verdicts
const metaVerdictMap = loadMetaVerdicts('_data/verdicts');
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
  
  // Load the sourceavailable image
  try {
    sourceavailableImage = await loadImage(sourceavailableImagePath);
  } catch (error) {
    console.warn(`Could not load sourceavailable image from ${sourceavailableImagePath}: ${error.message}`);
  }
  
  // Load the reproducible image
  try {
    reproducibleImage = await loadImage(reproducibleImagePath);
  } catch (error) {
    console.warn(`Could not load reproducible image from ${reproducibleImagePath}: ${error.message}`);
  }
  
  // Register fonts
  
  registerFont('assets/fonts/Barlow/barlow-v12-latin-500.ttf', { family: 'Barlow' });
  
  // Check if Nostr backup directory exists
  console.log('\x1b[1m[NOSTR] Checking for local Nostr backup files\x1b[0m');
  let nostrAvailable = false;
  
  // Clear the verification cache
  nostrVerificationCache.clear();
  
  if (!SKIP_NOSTR && fs.existsSync(NOSTR_BACKUP_PATH)) {
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
  } else if (SKIP_NOSTR) {
    console.log('[NOSTR] --skip-nostr flag provided, skipping Nostr integration');
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

// Function to get Nostr attestation summary for an app using grep and jq on local files
function getNostrAttestationSummaryForApp(appId) {
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
        attestationCount: 0
      };
      nostrVerificationCache.set(appId, emptySummary);
      return emptySummary;
    }
    
    console.log(`[NOSTR] Found ${matchingFiles.length} verification files for ${appId}`);
    
    // Use jq to extract and process the verification events
    const jqCommand = `cat ${matchingFiles.join(' ')} | jq -c 'select(.tags[]? | select(.[0] == "i" and .[1] == "${appId}")) | {id: .id, created_at: .created_at, version: (.tags[] | select(.[0] == "version") | .[1]), status: (.tags[] | select(.[0] == "status") | .[1]), date: (.created_at | tostring)}' | jq -s 'sort_by(.created_at) | reverse'`;
    
    const events = JSON.parse(execSync(jqCommand, { encoding: 'utf8' }).trim() || '[]');
    
    if (events.length === 0) {
      console.log(`[NOSTR] No valid verification events found for ${appId}`);
      const emptySummary = {
        latestStatus: null,
        latestVersion: null,
        latestDate: null,
        attestationCount: 0
      };
      nostrVerificationCache.set(appId, emptySummary);
      return emptySummary;
    }
    
    // Get the most recent event (already sorted in reverse chronological order)
    const latestEvent = events[0];
    
    // Format the date from Unix timestamp
    const formattedDate = latestEvent.date ? 
      new Date(parseInt(latestEvent.date) * 1000).toISOString().split('T')[0] : null;
    
    const summary = {
      latestStatus: latestEvent.status || 'unknown',
      latestVersion: latestEvent.version || null,
      latestDate: formattedDate,
      attestationCount: events.length
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
      attestationCount: 0
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

// Function to draw circuit-like lines with main lines emanating from center
function drawCircuitLines(ctx, startX, startY, length, direction, color = 'rgba(255, 255, 255, 0.4)') {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  
  // Starting point
  let x = startX;
  let y = startY;
  
  // Create 3-4 main lines emanating from the center
  const numMainLines = Math.floor(Math.random() * 2) + 3; // 3-4 main lines
  const mainLineSpacing = 10; // Spacing between main lines
  
  for (let j = 0; j < numMainLines; j++) {
    // Offset each main line vertically
    const lineY = y + (j * mainLineSpacing) - ((numMainLines-1) * mainLineSpacing / 2);
    
    // Draw main horizontal line
    ctx.beginPath();
    ctx.moveTo(x, lineY);
    ctx.lineTo(x + (length * direction), lineY);
    ctx.stroke();
    
    // Draw circuit branches (2-3 branches per main line)
    const numBranches = Math.floor(Math.random() * 2) + 2; // 2-3 branches
    const branchSpacing = length / (numBranches + 1);
    
    for (let i = 1; i <= numBranches; i++) {
      const branchX = x + (branchSpacing * i * direction);
      const branchLength = Math.random() * 15 + 5; // 5-20px
      const branchDirection = Math.random() > 0.5 ? 1 : -1;
      
      ctx.beginPath();
      ctx.moveTo(branchX, lineY);
      ctx.lineTo(branchX, lineY + (branchLength * branchDirection));
      
      // Add a small horizontal segment at the end of some branches
      if (Math.random() > 0.4) {
        const segmentLength = Math.random() * 10 + 5; // 5-15px
        const segmentDirection = Math.random() > 0.5 ? 1 : -1;
        ctx.lineTo(branchX + (segmentLength * segmentDirection), lineY + (branchLength * branchDirection));
        
        // Add a circle node at the end of most segments (increased probability)
        if (Math.random() > 0.3) {
          ctx.stroke(); // Finish the current path
          ctx.beginPath();
          ctx.arc(branchX + (segmentLength * segmentDirection), lineY + (branchLength * branchDirection), 2.5, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }
      }
      
      ctx.stroke();
    }
  }
  
  ctx.restore();
}

// Utility function to overlay "reproducible" image
// Overlay source-available badge with resizing
async function overlaySourceAvailableImage(ctx) {
  if (sourceavailableImage) {
    const width = 200; // your preferred width
    const height = 200; // your preferred height
    const x = 60;
    const y = 145;
    ctx.drawImage(sourceavailableImage, x, y, width, height);
  }
}

// Overlay reproducible badge with resizing
async function overlayReproducibleImage(ctx) {
  if (reproducibleImage) {
    const width = 284;
    const height = 160;
    const x = 800 - width - 20;
    const y = 163;
    ctx.drawImage(reproducibleImage, x, y, width, height);
  }
}


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

  // Draw the resized icon image at specified coordinates
  const iconWidth = 80;
  const iconHeight = 80;
  const iconX = (width / 2) - (iconWidth / 2); // Center horizontally
  const iconY = 140; // Moved 10px up
  
  // Circuit lines have been removed as requested
  
  // Create rounded rectangle clipping path for the icon
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(iconX + 12, iconY);
  ctx.lineTo(iconX + iconWidth - 12, iconY);
  ctx.quadraticCurveTo(iconX + iconWidth, iconY, iconX + iconWidth, iconY + 12);
  ctx.lineTo(iconX + iconWidth, iconY + iconHeight - 12);
  ctx.quadraticCurveTo(iconX + iconWidth, iconY + iconHeight, iconX + iconWidth - 12, iconY + iconHeight);
  ctx.lineTo(iconX + 12, iconY + iconHeight);
  ctx.quadraticCurveTo(iconX, iconY + iconHeight, iconX, iconY + iconHeight - 12);
  ctx.lineTo(iconX, iconY + 12);
  ctx.quadraticCurveTo(iconX, iconY, iconX + 12, iconY);
  ctx.closePath();
  ctx.clip();
  
  ctx.drawImage(iconImage, iconX, iconY, iconWidth, iconHeight);
  ctx.restore();
  
  // Center everything below the icon
  const centerX = iconX + (iconWidth / 2);
  
  // Version
  if (data.version) {
    const versionY = iconY + iconHeight + 25; // 25px below the icon
    
    // Add a subtle background for the version
    ctx.save();
    ctx.fillStyle = 'rgba(240, 240, 240, 0.7)';
    ctx.beginPath();
    // Draw rounded rectangle manually for better compatibility
    const rectX = centerX - 40;
    const rectY = versionY - 15;
    const rectWidth = 80;
    const rectHeight = 20;
    const radius = 5;
    
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
    
    // Set text alignment to center
    ctx.textAlign = 'center';
    ctx.font = 'bold 14px Barlow';
    printText(data.version, ctx, centerX, versionY, 'black', 'bold 14px Barlow', 7, 10);
    ctx.restore();
  }
  
  // Title - centered below version, with enough space for version
  ctx.textAlign = 'center';  // Print the title (truncate if longer than 20 characters)
  const titleY = iconY + iconHeight + 50; // Ensure enough space for version
  let displayTitle = data.title || 'Unknown Title';
  if (displayTitle.length > 20) {
    displayTitle = displayTitle.substring(0, 20) + '...';
  }
  printText(displayTitle, ctx, centerX, titleY, 'white', '22px Barlow', 42, 29);
  
  // Developer Name - in dark gray
  if (data.developerName) {
    const devNameY = titleY + 23; // Moved 10px up
    ctx.font = '400 20px Barlow';
    ctx.fillStyle = 'rgba(122, 122, 122, 1.0)'; // Dark gray color
    ctx.textAlign = 'center';
    ctx.fillText(data.developerName, width / 2, devNameY);
    
    // For source available apps with meta: ok, display Nostr verification below developer name
    // instead of "Source code is available" text
    if (data.verdict === 'sourceavailable') {
      // Calculate position based on whether developer name exists
      const nostrY = data.developerName ? titleY + 70 : titleY + 30; // Moved 10px up
      
      // No need for separate nostrX variable - we'll use width/2 for centering everything
      
      // Display Nostr verification information for sourceavailable apps with meta: ok
      if (data.meta === 'ok' && (data.nostrBuildStatus || data.nostrAttestationCount > 0)) {
        // 1. Measure each line with the correct font - no header text anymore
        ctx.font = 'bold 18px Barlow';
        const buildStatusWidth = data.nostrBuildStatus ? ctx.measureText(`Build: ${data.nostrBuildStatus}`).width : 0;
        // For reproducible status, measure just the word without 'Build:'
        const reproducibleWidth = data.nostrBuildStatus === 'reproducible' ? ctx.measureText('reproducible').width : 0;

        ctx.font = 'normal 18px Barlow';
        const attestationWidth = data.nostrAttestationCount > 0 ? ctx.measureText(`Attestations: ${data.nostrAttestationCount}`).width : 0;
        const dateWidth = data.latestDate ? ctx.measureText(`Latest: ${data.latestDate}`).width : 0;

        // 2. Find the max width, add padding
        const maxTextWidth = Math.max(buildStatusWidth, attestationWidth, dateWidth);
        const boxWidth = maxTextWidth + 70; // Add enough padding for longest string

        // 3. Center the box on the canvas
        const boxX = (width / 2) - (boxWidth / 2);
        const boxY = nostrY - 15; // Move up since we removed the header
        
        // Adjust box height - for reproducible builds, we don't show the build status text
        let boxHeight;
        if (data.nostrBuildStatus === 'reproducible') {
          // One less line of text for reproducible builds
          boxHeight = data.nostrAttestationCount > 0 && data.latestDate ? 50 :
                     data.nostrAttestationCount > 0 || data.latestDate ? 30 : 0; // No box if no text
        } else {
          boxHeight = data.nostrAttestationCount > 0 && data.nostrBuildStatus && data.latestDate ? 70 :
                     (data.nostrAttestationCount > 0 || data.nostrBuildStatus) ? 45 : 25;
        }

        // 4. Draw Nostr bg information box - rounded rectangle with semi-transparent background
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 8);
        ctx.fill();
        ctx.restore();

        // 5. Draw text, all using width/2 as center
        // ===== BEGIN NOSTR INFO =====
        ctx.textAlign = 'center';
        const textX = width / 2;
        
        // Create a variable to track the current Y position for text
        let currentTextY = nostrY;
        
        // Draw status text if available - no header anymore
        if (data.nostrBuildStatus) {
          // Special handling for 'reproducible' status
          if (data.nostrBuildStatus === 'reproducible') {
            // Don't show text since we have a reproducible badge now
            // No need to increment Y position since we're not drawing anything
          } else {
            // Normal rendering for other build statuses
            ctx.font = 'bold 18px Barlow';
            const statusColor = data.nostrBuildStatus === 'success' ? '#28A745' : 
                               (data.nostrBuildStatus === 'failed' ? '#DC3545' : '#FFC107');
            ctx.fillStyle = statusColor;
            ctx.fillText(`Build: ${data.nostrBuildStatus}`, textX, currentTextY + 5);
            currentTextY += 25; // Increment for next text item
          }
        }
        
        // Draw attestation count if available
        if (data.nostrAttestationCount > 0) {
          ctx.font = 'normal 18px Barlow';
          ctx.fillStyle = '#333333';
          ctx.fillText(`Attestations: ${data.nostrAttestationCount}`, textX, currentTextY + 5);
          currentTextY += 25; // Increment for next text item
        }
        
        // Draw date of latest verification if available
        if (data.latestDate) {
          ctx.font = 'normal 18px Barlow';
          ctx.fillStyle = '#333333';
          ctx.fillText(`Latest: ${data.latestDate}`, textX, currentTextY + 5);
        }
        // ===== END NOSTR INFO =====
      } else if (data.meta === 'ok') {
        // If no Nostr data but app is source available with meta: ok, show a note
        const nostrText = 'No Nostr attestations yet';
        
        // Set font before measuring text
        ctx.font = 'normal 14px Barlow';
        const textMetrics = ctx.measureText(nostrText);
        
        // Calculate box dimensions with proper padding
        const messageBoxWidth = textMetrics.width + 60;
        const boxHeight = 30;
        
        // Center the box on the canvas
        const boxX = width / 2 - (messageBoxWidth / 2);
        const boxY = nostrY - 15;
        
        // Draw Nostr bg information box - rounded rectangle with semi-transparent background
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // Semi-transparent white background
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, messageBoxWidth, boxHeight, 8);
        ctx.fill();
        ctx.restore();
        
        // Nostr info - Draw the text centered in the box
        ctx.textAlign = 'center';
        ctx.fillStyle = '#666666';
        ctx.fillText(nostrText, width / 2, nostrY + 5); // "No Nostr attestations yet"
      } else {
        // No additional text for source available apps with meta != ok
        // The badge already indicates source availability
      }
    }
  }
  
  const mappedVerdict = verdictMap[data.verdict] || data.verdict || 'Unknown Verdict';
  if (data.verdict === 'reproducible') {
    await overlayReproducibleImage(ctx);
  }
  
  // Add source available badge and Nostr verification info if needed
  if (data.verdict === 'sourceavailable') {
    await overlaySourceAvailableImage(ctx);
    
    // Debug logging for reproducible badge condition
    console.log(`[DEBUG] App: ${data.title}, Verdict: ${data.verdict}, nostrBuildStatus: ${data.nostrBuildStatus}`);
    
    // Draw the reproducible badge if nostrBuildStatus is 'reproducible'
    if (data.nostrBuildStatus === 'reproducible') {
      console.log(`[DEBUG] Drawing reproducible badge for ${data.title}`);
      await overlayReproducibleImage(ctx);
    } else {
      console.log(`[DEBUG] Not drawing reproducible badge for ${data.title} - status is not 'reproducible'`);
    }
  }
  
  const verdictY = (data.developerName ? titleY + 80 : titleY + 40); // Position based on whether developer name exists
  
  // Set font first so we can measure text properly
  ctx.font = '400 19px Barlow'; // Reduced by 5px total (3px + 2px)
  
  // Skip drawing verdict box and text for sourceavailable apps with meta: ok
  if (!(data.verdict === 'sourceavailable' && data.meta === 'ok')) {
    // Get wrapped lines for the verdict text to calculate proper width
    const verdictLines = wrapText(mappedVerdict, 41);
    
    // Set font before measuring text
    ctx.font = '400 19px Barlow';
    
    // Calculate width based on the widest line
    const verdictWidths = verdictLines.map(line => ctx.measureText(line).width);
    const maxVerdictWidth = Math.max(...verdictWidths);
    const verdictWidth = maxVerdictWidth + 80; // Add more padding for longer verdicts
    const verdictHeight = 36;
    const verdictX = centerX - (verdictWidth / 2);
    const verdictRectY = verdictY - 24; // Position rectangle to center text vertically
    
    // Draw rounded rectangle with 16px radius (very rounded)
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 1.0)'; // Full opacity white background
    ctx.beginPath();
    ctx.moveTo(verdictX + 16, verdictRectY);
    ctx.lineTo(verdictX + verdictWidth - 16, verdictRectY);
    ctx.quadraticCurveTo(verdictX + verdictWidth, verdictRectY, verdictX + verdictWidth, verdictRectY + 16);
    ctx.lineTo(verdictX + verdictWidth, verdictRectY + verdictHeight - 16);
    ctx.quadraticCurveTo(verdictX + verdictWidth, verdictRectY + verdictHeight, verdictX + verdictWidth - 16, verdictRectY + verdictHeight);
    ctx.lineTo(verdictX + 16, verdictRectY + verdictHeight);
    ctx.quadraticCurveTo(verdictX, verdictRectY + verdictHeight, verdictX, verdictRectY + verdictHeight - 16);
    ctx.lineTo(verdictX, verdictRectY + 16);
    ctx.quadraticCurveTo(verdictX, verdictRectY, verdictX + 16, verdictRectY);
    ctx.fill();
    ctx.restore();
  }
  
  // Draw the verdict text, but skip for sourceavailable apps with meta: ok since they show Nostr info instead
  if (!(data.verdict === 'sourceavailable' && data.meta === 'ok')) {
    printText(mappedVerdict, ctx, centerX, verdictY, 'black', '400 19px Barlow', 41, 30);
  }
  
  // If verdict is sourceavailable AND meta is not 'ok', display the meta verdict message underneath
  if (data.verdict === 'sourceavailable' && data.meta && data.meta !== 'ok') {
    // Get the meta verdict message
    let metaMessage = '';
    
    // Try to get the message from the metaVerdictMap
    if (metaVerdictMap[data.meta] && metaVerdictMap[data.meta].message) {
      metaMessage = metaVerdictMap[data.meta].message;
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
    ctx.font = 'italic 14px Barlow'; // Reduced from 16px to 14px
    const metaMetrics = ctx.measureText(metaText);
    const metaWidth = Math.min(metaMetrics.width + 40, width - 100); // Add padding but limit width
    const metaHeight = 30;
    const metaX = centerX - (metaWidth / 2);
    const metaY = verdictY + 40; // Position below the verdict text
    
    // Draw rounded rectangle with 12px radius
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; // Semi-transparent white background
    ctx.beginPath();
    ctx.roundRect(metaX, metaY - 20, metaWidth, metaHeight, 12);
    ctx.fill();
    ctx.restore();
    
    // Draw the meta message text
    ctx.font = 'italic 14px Barlow'; // Reduced from 16px to 14px
    ctx.fillStyle = '#d33100'; // Use the stale.yml color as default for meta messages
    ctx.textAlign = 'center';
    ctx.fillText(metaText, centerX, metaY);
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

  let iconImagePath = path.join('images', 'wIcons', platform, 'small', `${data.icon}`);
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
    data.nostrAttestationCount = 0; // Initialize

    console.log(`\x1b[36m[NOSTR] Processing source available app: ${data.title} (${file})\x1b[0m`);
    
    if (data.appId && !SKIP_NOSTR && fs.existsSync(NOSTR_BACKUP_PATH)) {
      try {
        console.log(`[NOSTR] Checking local Nostr data for ${data.appId}...`);
        const nostrAttestationSummary = getNostrAttestationSummaryForApp(data.appId);
        
        // Always store the count, even if no 'latest' event was suitable
        if (nostrAttestationSummary) {
          data.nostrAttestationCount = nostrAttestationSummary.attestationCount;
          
          if (data.nostrAttestationCount > 0) {
            console.log(`\x1b[32m[NOSTR] Found ${data.nostrAttestationCount} attestations for ${data.appId}\x1b[0m`);
          } else {
            console.log(`\x1b[33m[NOSTR] No attestations found for ${data.appId}\x1b[0m`);
          }
        }

        if (nostrAttestationSummary && nostrAttestationSummary.latestStatus) {
          console.log(`\x1b[32m[NOSTR] Latest status for ${data.appId}: Status=${nostrAttestationSummary.latestStatus}, V=${nostrAttestationSummary.latestVersion || 'N/A'}, Date=${nostrAttestationSummary.latestDate || 'N/A'}\x1b[0m`);
          data.nostrBuildStatus = nostrAttestationSummary.latestStatus;
          
          // Debug output for reproducible status
          if (nostrAttestationSummary.latestStatus === 'reproducible') {
            console.log(`\x1b[32m[NOSTR] ★★★ REPRODUCIBLE BUILD DETECTED for ${data.appId} ★★★\x1b[0m`);
          }
          
          // Store the latest date for display in the Twitter card
          if (nostrAttestationSummary.latestDate) {
            data.latestDate = nostrAttestationSummary.latestDate;
            console.log(`[NOSTR] Latest verification date: ${data.latestDate}`);
          }
          
          // Only override version and date if Nostr provides them
          if (nostrAttestationSummary.latestVersion) {
            data.version = nostrAttestationSummary.latestVersion;
            console.log(`[NOSTR] Updated version to ${data.version} from Nostr`);
          }
          if (nostrAttestationSummary.latestDate) {
            data.date = nostrAttestationSummary.latestDate;
            console.log(`[NOSTR] Updated date to ${data.date} from Nostr`);
          }
        } else {
          console.log(`\x1b[33m[NOSTR] No latest status found in Nostr data for ${data.appId}\x1b[0m`);
        }
      } catch (error) {
        console.error(`\x1b[31m[NOSTR] Error processing Nostr data for ${data.appId}: ${error.message}\x1b[0m`);
        // Continue without Nostr data
      }
    } else if (data.appId && SKIP_NOSTR) {
      console.log(`\x1b[33m[NOSTR] Skipping Nostr data for ${data.appId} due to --skip-nostr flag\x1b[0m`);
    } else if (data.appId && !fs.existsSync(NOSTR_BACKUP_PATH)) {
      console.warn(`\x1b[33m[NOSTR] No Nostr backup directory available for ${data.appId}. Using MD data only.\x1b[0m`);
    } else if (!data.appId) {
      console.warn(`\x1b[31m[NOSTR] No appId in MD for ${file}. Cannot query Nostr.\x1b[0m`);
    }
    
    // Summary of Nostr data for this app
    if (data.nostrBuildStatus || data.nostrAttestationCount > 0) {
      console.log(`\x1b[36m[NOSTR] Final data for ${data.title}: buildStatus=${data.nostrBuildStatus || 'N/A'}, attestationCount=${data.nostrAttestationCount}\x1b[0m`);
    }
  } else if (data.verdict === 'sourceavailable' && data.meta !== 'ok') {
    console.log(`\x1b[33m[NOSTR] App ${data.title} has verdict 'sourceavailable' but meta is not 'ok' (${data.meta}). Skipping Nostr processing.\x1b[0m`);
    // Don't reset nostrBuildStatus if it's 'reproducible' to ensure badge displays
    if (data.nostrBuildStatus !== 'reproducible') {
      data.nostrBuildStatus = null;
    }
    data.nostrAttestationCount = 0;
  } else {
    // For verdicts other than 'sourceavailable', initialize Nostr fields to null
    // Don't reset nostrBuildStatus if it's 'reproducible' to ensure badge displays
    if (data.nostrBuildStatus !== 'reproducible') {
      data.nostrBuildStatus = null;
    }
    data.nostrAttestationCount = 0;
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
  for (const mdFolder of mdFolders) {
    const mdFilesPath = mdFolder;
    const platform = mdFolder.substring(1);
    const files = await fsp.readdir(mdFilesPath);
    const outputFolderPath = `images/social/${platform}`;
    if (!fs.existsSync(outputFolderPath)) {
      fs.mkdirSync(outputFolderPath);
    }

    for (const file of files) {
      totalFiles++;
      asyncTasks.push(limit(() => processOneFile(platform, mdFilesPath, file, outputFolderPath)));
    }
  }
  await Promise.all(asyncTasks);
}

processFilesTimed();
