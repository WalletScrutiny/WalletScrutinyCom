//twitterCardGen.mjs
// Original
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
const backgroundImage = 'images/twCard/new-ws-bg-800x450.png';
let bgImage;
const fallbackIcon = 'images/smallNoicon.png';
const verdictMap = loadVerdicts('_data/verdicts');

// Nostr verification constants
const NOSTR_BACKUP_PATH = 'backup/nostr-verification-events';
let nostrVerificationCache = new Map();

// Timer variables
let totalFiles = 0;
let totalTime = 0;
let oldTotalFiles = 0;
const startTime = Date.now();

async function loadResources () {
  bgImage = await loadImage(backgroundImage);
  registerFont('assets/fonts/Barlow/barlow-v12-latin-500.ttf', { family: 'Barlow' });
  
  // Initialize Nostr verification system
  console.log('[NOSTR] Initializing enhanced verification system...');
  nostrVerificationCache.clear();
  
  if (fs.existsSync(NOSTR_BACKUP_PATH)) {
    try {
      const result = execSync(`find ${NOSTR_BACKUP_PATH} -name "*.json" | wc -l`, { encoding: 'utf8' });
      const fileCount = parseInt(result.trim());
      
      if (fileCount > 0) {
        console.log(`[NOSTR] Found ${fileCount} verification files - enhanced processing enabled`);
      } else {
        console.log('[NOSTR] No verification files found in backup directory');
      }
    } catch (error) {
      console.warn(`[NOSTR] Error checking backup files: ${error.message}`);
    }
  } else {
    console.log(`[NOSTR] Backup directory not found at ${NOSTR_BACKUP_PATH} - will proceed without Nostr data`);
  }
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

function loadVerdicts (verdictPath) {
  const verdictMap = {};
  fs.readdirSync(verdictPath).forEach((filename) => {
    if (filename.endsWith('.yml')) {
      const filePath = path.join(verdictPath, filename);
      const verdict = path.parse(filename).name;
      const yamlData = fs.readFileSync(filePath, 'utf8');
      const data = yaml.load(yamlData);
      verdictMap[verdict] = data.title;
    }
  });
  return verdictMap;
}

// Enhanced Nostr verification function (Option 3 implementation)
function getEnhancedNostrVerificationSummary(appId) {
  // Check cache first
  if (nostrVerificationCache.has(appId)) {
    return nostrVerificationCache.get(appId);
  }

  if (!fs.existsSync(NOSTR_BACKUP_PATH)) {
    console.warn(`[NOSTR] Backup directory not found at ${NOSTR_BACKUP_PATH}`);
    const emptySummary = {
      latestStatus: null,
      latestVersion: null,
      latestDate: null,
      lastVerifiedVersion: null,
      lastVerifiedVersionDate: null,
      wsVersion: null,
      verificationCount: 0,
      reproducibleCount: 0
    };
    nostrVerificationCache.set(appId, emptySummary);
    return emptySummary;
  }

  try {
    // Find all files containing this appId
    const grepCommand = `grep -r "${appId}" ${NOSTR_BACKUP_PATH} --include="*.json" | cut -d: -f1`;
    const matchingFiles = execSync(grepCommand, { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
    
    if (matchingFiles.length === 0) {
      console.log(`[NOSTR] No verification files found for ${appId}`);
      const emptySummary = {
        latestStatus: null,
        latestVersion: null,
        latestDate: null,
        lastVerifiedVersion: null,
        lastVerifiedVersionDate: null,
        wsVersion: null,
        verificationCount: 0,
        reproducibleCount: 0
      };
      nostrVerificationCache.set(appId, emptySummary);
      return emptySummary;
    }
    
    console.log(`[NOSTR] Found ${matchingFiles.length} verification files for ${appId}`);
    
    // Enhanced jq command to extract comprehensive verification data
    const jqCommand = `cat ${matchingFiles.join(' ')} | jq -c '
      select(.tags[]? | select(.[0] == "i" and .[1] == "${appId}")) | 
      {
        id: .id,
        created_at: .created_at,
        version: (.tags[] | select(.[0] == "version") | .[1]),
        status: (.tags[] | select(.[0] == "status") | .[1]),
        platform: (.tags[] | select(.[0] == "platform") | .[1]),
        date: (.created_at | tostring),
        is_reproducible: ((.tags[] | select(.[0] == "status") | .[1]) == "reproducible")
      }
    ' | jq -s '
      sort_by(.created_at) | reverse |
      {
        all_events: .,
        latest: .[0],
        reproducible_events: [.[] | select(.is_reproducible)],
        all_versions: [.[] | .version] | unique | sort_by(. | split(".") | map(tonumber? // 0)) | reverse
      }
    '`;
    
    const result = JSON.parse(execSync(jqCommand, { encoding: 'utf8' }).trim() || '{}');
    
    if (!result.all_events || result.all_events.length === 0) {
      console.log(`[NOSTR] No valid verification events found for ${appId}`);
      const emptySummary = {
        latestStatus: null,
        latestVersion: null,
        latestDate: null,
        lastVerifiedVersion: null,
        lastVerifiedVersionDate: null,
        wsVersion: null,
        verificationCount: 0,
        reproducibleCount: 0
      };
      nostrVerificationCache.set(appId, emptySummary);
      return emptySummary;
    }
    
    // Extract comprehensive verification information
    const latestEvent = result.latest;
    const reproducibleEvents = result.reproducible_events || [];
    const lastReproducibleEvent = reproducibleEvents[0]; // Most recent reproducible
    
    // Format dates from Unix timestamps
    const formatUnixDate = (unixTimestamp) => {
      if (!unixTimestamp) return null;
      const date = new Date(parseInt(unixTimestamp) * 1000);
      return date.toISOString().split('T')[0];
    };
    
    const formatDisplayDate = (unixTimestamp) => {
      if (!unixTimestamp) return null;
      const date = new Date(parseInt(unixTimestamp) * 1000);
      const day = date.getDate();
      const month = date.toLocaleString('en', { month: 'short' }).toLowerCase();
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    };
    
    const summary = {
      // Basic information (existing)
      latestStatus: latestEvent?.status || 'unknown',
      latestVersion: latestEvent?.version || null,
      latestDate: formatDisplayDate(latestEvent?.created_at),
      
      // Enhanced information (matching frontend)
      lastVerifiedVersion: lastReproducibleEvent?.version || null,
      lastVerifiedVersionDate: formatDisplayDate(lastReproducibleEvent?.created_at),
      
      // Additional metadata
      wsVersion: null, // Will be populated from page data
      verificationCount: result.all_events.length,
      reproducibleCount: reproducibleEvents.length,
      platform: latestEvent?.platform || null,
      
      // Full timeline data for advanced processing
      allVersions: result.all_versions || [],
      timeline: result.all_events.map(event => ({
        version: event.version,
        status: event.status,
        date: formatDisplayDate(event.created_at),
        isReproducible: event.is_reproducible
      }))
    };
    
    // Cache and return
    nostrVerificationCache.set(appId, summary);
    console.log(`[NOSTR] Enhanced summary for ${appId}:`, {
      latest: `${summary.latestVersion} (${summary.latestStatus})`,
      lastReproducible: summary.lastVerifiedVersion ? `${summary.lastVerifiedVersion} (${summary.lastVerifiedVersionDate})` : 'None',
      totalVerifications: summary.verificationCount,
      reproducibleCount: summary.reproducibleCount
    });
    
    return summary;
    
  } catch (error) {
    console.error(`[NOSTR] Error processing enhanced verification data for ${appId}: ${error.message}`);
    const errorSummary = {
      latestStatus: null,
      latestVersion: null,
      latestDate: null,
      lastVerifiedVersion: null,
      lastVerifiedVersionDate: null,
      wsVersion: null,
      verificationCount: 0,
      reproducibleCount: 0
    };
    nostrVerificationCache.set(appId, errorSummary);
    return errorSummary;
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

// Utility Function - Draw stars
async function drawStars (ctx, stars, x, y, starSize) {
  const fullStars = Math.floor(stars);
  const partialStar = stars - fullStars;

  for (let i = 0; i < 5; i++) {
    drawStar(ctx, x + i * (starSize + 5), y, '#eed7af', 'dddddd');
  }
  for (let i = 0; i < fullStars; i++) {
    drawStar(ctx, x + i * (starSize + 5), y);
  }
  if (partialStar > 0) {
    drawStar(ctx, x + fullStars * (starSize + 5), y, '#ee9e15', 'black', partialStar);
  }
}


// Helper functions for verification status display
function getStatusBadgeText(status) {
  switch (status) {
    case 'reproducible':
      return '✓ Reproducible';
    case 'not_reproducible':
      return '⚠ Not Reproducible';
    case 'ftbfs':
      return '⚠ Build Failed';
    case 'spam':
      return '⚠ Spam';
    case 'notag':
      return '⚠ No Git Tag';
    case 'nosource':
      return '⚠ No Source';
    case 'obfuscated':
      return '⚠ Obfuscated';
    case 'warning':
      return '⚠ Warning';
    default:
      return '⚠ Unknown Status';
  }
}

function getStatusBadgeColor(status) {
  switch (status) {
    case 'reproducible':
      return '#00AA00'; // Green
    case 'not_reproducible':
    case 'ftbfs':
    case 'spam':
    case 'nosource':
    case 'obfuscated':
      return '#CC0000'; // Red
    case 'notag':
    case 'warning':
      return '#FF8800'; // Orange
    default:
      return '#888888'; // Gray
  }
}

// Core Functions - Canvas Image and Text Overlays

async function drawOnCanvas (data, iconImage) {
  // Width and Heights variables for canvas
  const width = 800;
  const height = 450;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Draw the background image
  ctx.drawImage(bgImage, 0, 0, width, height);

  // Draw the resized icon image with rounded corners at specified coordinates
  const iconX = 40; // moved right by 50px
  const iconY = 190; // moved down by 150px
  const iconWidth = 200;
  const iconHeight = 200;
  const cornerRadius = 25;
  
  // Create rounded rectangle path for icon
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(iconX + cornerRadius, iconY);
  ctx.lineTo(iconX + iconWidth - cornerRadius, iconY);
  ctx.quadraticCurveTo(iconX + iconWidth, iconY, iconX + iconWidth, iconY + cornerRadius);
  ctx.lineTo(iconX + iconWidth, iconY + iconHeight - cornerRadius);
  ctx.quadraticCurveTo(iconX + iconWidth, iconY + iconHeight, iconX + iconWidth - cornerRadius, iconY + iconHeight);
  ctx.lineTo(iconX + cornerRadius, iconY + iconHeight);
  ctx.quadraticCurveTo(iconX, iconY + iconHeight, iconX, iconY + iconHeight - cornerRadius);
  ctx.lineTo(iconX, iconY + cornerRadius);
  ctx.quadraticCurveTo(iconX, iconY, iconX + cornerRadius, iconY);
  ctx.closePath();
  ctx.clip();
  
  ctx.drawImage(iconImage, iconX, iconY, iconWidth, iconHeight);
  ctx.restore();

  // App Title App Name - positioned to the right of the icon
  const titleX = iconX + iconWidth + 20; // 20px margin from icon
  let titleY = iconY + 50; // positioned near top of icon, like ZEUS Wallet reference
  
  // Dynamic font sizing based on title length
  const titleText = data.title || 'Unknown Title';
  const fontSize = titleText.length < 10 ? '80px' : titleText.length < 20 ? '56px' : '40px';
  
  // Adjust Y position for larger fonts
  if (fontSize === '80px' || fontSize === '56px') {
    titleY += 20; // lower position by 12px for larger fonts
  }
  
  printText(titleText, ctx, titleX, titleY, 'white', `${fontSize} Barlow`, 27, 45);

  // Enhanced verification information display (Option 3 implementation)
  if (data.verdict === 'sourceavailable' && data.meta === 'ok' && (data.wsVersion || data.latestVersion || data.lastVerifiedVersion)) {
    let verificationY = titleY + 90; // Start below the title with more space
    const verificationX = titleX;
    const lineHeight = 35; // Increased line height to prevent overlap
    const fontSize = '20px'; // Increased by 2px
    const color = '#CCCCCC'; // Light gray for secondary information
    
    // Build verification information text (matching frontend format)
    const verificationLines = [];
    
    if (data.wsVersion) {
      verificationLines.push(`Latest release found by WalletScrutiny: ${data.wsVersion}`);
    }
    
    if (data.latestVersion && data.latestDate) {
      verificationLines.push(`Latest release found in a Verification: ${data.latestVersion} (${data.latestDate})`);
    }
    
    // Always show Last Reproducible Verification if we have the data
    if (data.lastVerifiedVersion && data.lastVerifiedVersionDate) {
      verificationLines.push(`Last Reproducible Verification: ${data.lastVerifiedVersion} (${data.lastVerifiedVersionDate})`);
    }
    
    // Draw each verification line
    verificationLines.forEach((line, index) => {
      const currentY = verificationY + (index * lineHeight);
      
      // Special styling for reproducible verification (green color and bold)
      const lineColor = line.includes('Reproducible') ? '#00AA00' : color;
      const fontWeight = line.includes('Reproducible') ? 'bold' : 'normal';
      const fontStyle = `${fontWeight} ${fontSize} Barlow`;
      
      printText(line, ctx, verificationX, currentY, lineColor, fontStyle, 100, 0);
      
      console.log(`[DISPLAY] Added verification line: ${line}`);
    });
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

  // Enhanced Nostr verification integration (Option 3)
  if (data.verdict === 'sourceavailable' && data.meta === 'ok' && data.appId) {
    const nostrSummary = getEnhancedNostrVerificationSummary(data.appId);
    
    // Attach enhanced verification data to app data
    data.nostrBuildStatus = nostrSummary.latestStatus;
    data.latestVersion = nostrSummary.latestVersion;
    data.latestDate = nostrSummary.latestDate;
    data.lastVerifiedVersion = nostrSummary.lastVerifiedVersion;
    data.lastVerifiedVersionDate = nostrSummary.lastVerifiedVersionDate;
    data.wsVersion = data.version; // Use the version from YAML as WalletScrutiny version
    data.verificationCount = nostrSummary.verificationCount;
    data.reproducibleCount = nostrSummary.reproducibleCount;
    data.verificationTimeline = nostrSummary.timeline;
    
    if (nostrSummary.latestStatus) {
      console.log(`[NOSTR] Enhanced data attached to ${data.title || data.appId}:`);
      console.log(`  - WalletScrutiny version: ${data.wsVersion || 'N/A'}`);
      console.log(`  - Latest verification: ${data.latestVersion || 'N/A'} (${data.latestDate || 'N/A'})`);
      console.log(`  - Last reproducible: ${data.lastVerifiedVersion || 'N/A'} (${data.lastVerifiedVersionDate || 'N/A'})`);
      console.log(`  - Status: ${data.nostrBuildStatus}`);
    }
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

