//twitterCardGen.mjs
// Original
// Import libraries
import fs from 'fs';
import { createCanvas, loadImage, registerFont } from 'canvas';
import yaml from 'js-yaml';
import path from 'path';
import pLimit from 'p-limit';

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


// Platform names
const platformNames = {
  android: 'Android',
  iphone: 'iOS', 
  hardware: 'Hardware',
  bearer: 'Bearer Token',
  desktop: 'Desktop'
};

// Platform icon images
let platformIconImages = {};

// Function to draw platform icons
async function drawPlatformIcon(ctx, platform, x, y) {
  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  
  switch (platform) {
    case 'android':
      // Use play-store.png image if available
      if (platformIconImages.android) {
        // Calculate proper size maintaining aspect ratio
        const img = platformIconImages.android;
        const maxSize = 16;
        const aspectRatio = img.width / img.height;
        let drawWidth, drawHeight;
        
        if (aspectRatio > 1) {
          // Wider than tall
          drawWidth = maxSize;
          drawHeight = maxSize / aspectRatio;
        } else {
          // Taller than wide or square
          drawHeight = maxSize;
          drawWidth = maxSize * aspectRatio;
        }
        
        ctx.drawImage(img, x, y - drawHeight/2, drawWidth, drawHeight);
      } else {
        // Fallback to triangle if image not loaded
        ctx.beginPath();
        ctx.moveTo(x, y - 8);
        ctx.lineTo(x + 14, y);
        ctx.lineTo(x, y + 8);
        ctx.closePath();
        ctx.fill();
      }
      break;
      
    case 'iphone':
      // Use iphone-store.png image if available
      if (platformIconImages.iphone) {
        // Calculate proper size maintaining aspect ratio
        const img = platformIconImages.iphone;
        const maxSize = 16;
        const aspectRatio = img.width / img.height;
        let drawWidth, drawHeight;
        
        if (aspectRatio > 1) {
          // Wider than tall
          drawWidth = maxSize;
          drawHeight = maxSize / aspectRatio;
        } else {
          // Taller than wide or square
          drawHeight = maxSize;
          drawWidth = maxSize * aspectRatio;
        }
        
        ctx.drawImage(img, x, y - drawHeight/2, drawWidth, drawHeight);
      } else {
        // Fallback to Apple logo if image not loaded
        ctx.beginPath();
        ctx.arc(x + 6, y, 6, 0, Math.PI * 2);
        ctx.fill();
        // Apple bite
        ctx.fillStyle = '#1f1911'; // Background color
        ctx.beginPath();
        ctx.arc(x + 9, y - 3, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
      
    case 'hardware':
      // Use hardware-icon.png image if available
      if (platformIconImages.hardware) {
        // Calculate proper size maintaining aspect ratio
        const img = platformIconImages.hardware;
        const maxSize = 16;
        const aspectRatio = img.width / img.height;
        let drawWidth, drawHeight;
        
        if (aspectRatio > 1) {
          // Wider than tall
          drawWidth = maxSize;
          drawHeight = maxSize / aspectRatio;
        } else {
          // Taller than wide or square
          drawHeight = maxSize;
          drawWidth = maxSize * aspectRatio;
        }
        
        ctx.drawImage(img, x, y - drawHeight/2, drawWidth, drawHeight);
      } else {
        // Fallback to toolbox drawing if image not loaded
        ctx.beginPath();
        ctx.rect(x, y - 6, 12, 12);
        ctx.stroke();
        ctx.beginPath();
        ctx.rect(x + 3, y - 8, 6, 4);
        ctx.fill();
      }
      break;
      
    case 'desktop':
      // Draw monitor
      ctx.beginPath();
      ctx.rect(x, y - 6, 14, 10);
      ctx.stroke();
      ctx.beginPath();
      ctx.rect(x + 5, y + 4, 4, 2);
      ctx.fill();
      break;
      
    case 'bearer':
      // Draw coin
      ctx.beginPath();
      ctx.arc(x + 6, y, 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.font = '8px Barlow';
      ctx.textAlign = 'center';
      ctx.fillText('₿', x + 6, y + 3);
      break;
  }
  
  ctx.restore();
}

// Timer variables
let totalFiles = 0;
let totalTime = 0;
let oldTotalFiles = 0;
const startTime = Date.now();

async function loadResources () {
  bgImage = await loadImage(backgroundImage);
  registerFont('assets/fonts/Barlow/barlow-v12-latin-500.ttf', { family: 'Barlow' });
  
  // Load platform icon images
  try {
    platformIconImages.android = await loadImage('images/twCard/play-store.png');
    console.log('[PLATFORM ICONS] Play Store icon loaded');
  } catch (error) {
    console.warn(`[PLATFORM ICONS] Could not load play-store.png: ${error.message}`);
  }
  
  try {
    platformIconImages.iphone = await loadImage('images/twCard/iphone-store.png');
    console.log('[PLATFORM ICONS] iPhone Store icon loaded');
  } catch (error) {
    console.warn(`[PLATFORM ICONS] Could not load iphone-store.png: ${error.message}`);
  }
  
  try {
    platformIconImages.hardware = await loadImage('images/twCard/hardware-icon.png');
    console.log('[PLATFORM ICONS] Hardware icon loaded');
  } catch (error) {
    console.warn(`[PLATFORM ICONS] Could not load hardware-icon.png: ${error.message}`);
  }
}

function wrapText (text, length) {
  const regex = new RegExp(`(?:(?:\\S{${length}}|.{1,${length}})(?:\\s|$))`, 'g');
  return `${text}`.match(regex) || [];
}





// Progress Tracking Function
function showProgress () {
  const i = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const processed = oldTotalFiles - totalFiles;
    const rate = processed / (elapsed / 1000);
    const eta = totalFiles / rate;
    console.log(`Processed: ${processed}/${oldTotalFiles}, Rate: ${rate.toFixed(2)}/s, ETA: ${eta.toFixed(0)}s`);
    if (totalFiles === 0) {
      clearInterval(i);
      console.log(`Total time: ${(Date.now() - startTime) / 1000}s`);
    }
  }, 5000);
}

function processFilesTimed () {
  showProgress();
  processFiles();
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
function drawStars (ctx, stars, x, y, starSize) {
  for (let i = 0; i < 5; i++) {
    const starX = x + (i * (starSize + 5));
    const starY = y;
    if (i < stars) {
      drawStar(ctx, starX, starY, '#ee9e15', 'black', 1);
    } else {
      drawStar(ctx, starX, starY, 'transparent', 'black', 1);
    }
  }
}

// Call-to-action phrases by verdict type
const ctaPhrases = {
  sourceavailable: [
    { text: "Open source wallet analyzed", cta: "Discover our security findings" },
    { text: "Code transparency verified", cta: "See what we uncovered" },
    { text: "Source code scrutinized", cta: "Read our detailed review" },
    { text: "Open wallet, open analysis", cta: "Explore the verdict" },
    { text: "Security audit complete", cta: "Check our insights" },
    { text: "Transparency confirmed", cta: "Dive into the report" },
    { text: "Code reviewed & verified", cta: "Uncover the details" },
    { text: "Open source deep-dive", cta: "Get the full story" }
  ],
  custodial: [
    { text: "Custodial service analyzed", cta: "Learn the trade-offs" },
    { text: "Third-party custody reviewed", cta: "See our assessment" },
    { text: "Managed wallet evaluated", cta: "Understand the risks" },
    { text: "Professional custody studied", cta: "Get the insights" },
    { text: "Custodial solution scrutinized", cta: "Read our findings" },
    { text: "Managed service reviewed", cta: "Discover what it means" },
    { text: "Third-party wallet assessed", cta: "See the full picture" }
  ],
  metaNotOk: [
    { text: "Wallet status updated", cta: "See what changed" },
    { text: "Service discontinued", cta: "Read the latest" },
    { text: "Important changes detected", cta: "Get the update" },
    { text: "Status evolution tracked", cta: "Learn more" },
    { text: "Service transition noted", cta: "Find out why" }
  ],
  nosource: [
    { text: "Closed source wallet", cta: "See our concerns" },
    { text: "Proprietary code analyzed", cta: "Learn the risks" },
    { text: "Black box wallet reviewed", cta: "Read our take" }
  ]
};

// Get CTA phrase based on verdict and meta status
function getCtaPhrase(data) {
  // Create a simple hash from app title for consistent rotation
  const hash = (data.title || '').split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  let phrases;
  
  // Determine which phrase set to use
  if (data.meta !== 'ok') {
    phrases = ctaPhrases.metaNotOk;
  } else if (data.verdict === 'sourceavailable') {
    phrases = ctaPhrases.sourceavailable;
  } else if (data.verdict === 'custodial') {
    phrases = ctaPhrases.custodial;
  } else if (data.verdict === 'nosource') {
    phrases = ctaPhrases.nosource;
  } else {
    // Default fallback
    return { text: "Wallet security analyzed", cta: "Read our review" };
  }
  
  // Use hash to select consistent phrase for this app
  const index = Math.abs(hash) % phrases.length;
  return phrases[index];
}

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
  const iconWidth = 150;
  const iconHeight = 150;
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

  // Draw platform name - always 35px below the app name text
  // Calculate where the app name text ends by accounting for multiple lines
  const wrappedLines = wrapText(titleText, 27); // Same maxLength as used in printText
  const lineHeight = 45; // Same lineHeight as used in printText
  const textEndY = titleY + ((wrappedLines.length - 1) * lineHeight);
  const platformY = textEndY + 35; // Always 35px below the last line of text
  const platformX = titleX;

  if (data.platform && platformNames[data.platform]) {
    // Draw platform icon
    await drawPlatformIcon(ctx, data.platform, platformX, platformY - 5);
    
    // Draw platform name next to icon
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px Barlow';
    ctx.textAlign = 'left';
    ctx.fillText(platformNames[data.platform], platformX + 20, platformY);
  }

  // Draw call-to-action phrase
  const ctaY = platformY + 40;
  const ctaX = titleX;
  const ctaPhrase = getCtaPhrase(data);
  
  // Draw main text
  ctx.fillStyle = '#CCCCCC';
  ctx.font = '18px Barlow';
  ctx.fillText(ctaPhrase.text, ctaX, ctaY);
  
  // Measure main text to position CTA badge
  const mainTextWidth = ctx.measureText(ctaPhrase.text).width;
  const ctaBadgeX = ctaX + mainTextWidth + 15; // 15px gap
  const ctaBadgeY = ctaY - 18; // Align with text baseline
  
  // Set font for CTA text measurement and calculate proper width
  ctx.font = 'bold 18px Barlow'; // Same size as main text
  const ctaBadgeWidth = ctx.measureText(ctaPhrase.cta).width + 20; // 10px padding each side
  const ctaBadgeHeight = 26; // Height for 18px text
  const ctaBadgeRadius = 13;
  
  // Badge background with rounded corners
  ctx.fillStyle = '#ff6b35'; // Orange that pops against dark background
  ctx.beginPath();
  ctx.moveTo(ctaBadgeX + ctaBadgeRadius, ctaBadgeY);
  ctx.lineTo(ctaBadgeX + ctaBadgeWidth - ctaBadgeRadius, ctaBadgeY);
  ctx.quadraticCurveTo(ctaBadgeX + ctaBadgeWidth, ctaBadgeY, ctaBadgeX + ctaBadgeWidth, ctaBadgeY + ctaBadgeRadius);
  ctx.lineTo(ctaBadgeX + ctaBadgeWidth, ctaBadgeY + ctaBadgeHeight - ctaBadgeRadius);
  ctx.quadraticCurveTo(ctaBadgeX + ctaBadgeWidth, ctaBadgeY + ctaBadgeHeight, ctaBadgeX + ctaBadgeWidth - ctaBadgeRadius, ctaBadgeY + ctaBadgeHeight);
  ctx.lineTo(ctaBadgeX + ctaBadgeRadius, ctaBadgeY + ctaBadgeHeight);
  ctx.quadraticCurveTo(ctaBadgeX, ctaBadgeY + ctaBadgeHeight, ctaBadgeX, ctaBadgeY + ctaBadgeHeight - ctaBadgeRadius);
  ctx.lineTo(ctaBadgeX, ctaBadgeY + ctaBadgeRadius);
  ctx.quadraticCurveTo(ctaBadgeX, ctaBadgeY, ctaBadgeX + ctaBadgeRadius, ctaBadgeY);
  ctx.closePath();
  ctx.fill();
  
  // Draw CTA text - centered in badge
  ctx.fillStyle = '#1f1911'; // Background color (brownish)
  ctx.font = 'bold 18px Barlow'; // Same size as main text
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Center the text in the badge
  const textCenterX = ctaBadgeX + (ctaBadgeWidth / 2);
  const textCenterY = ctaBadgeY + (ctaBadgeHeight / 2);
  ctx.fillText(ctaPhrase.cta, textCenterX, textCenterY);
  
  // Reset text alignment for future text
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  
  console.log(`[CTA] Added phrase: "${ctaPhrase.text}" with CTA: "${ctaPhrase.cta}"`);
  console.log(`[CTA] Verdict: ${data.verdict}, Meta: ${data.meta}`);

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

  // Add platform information to data
  data.platform = platform;

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

loadResources().then(() => {
  processFilesTimed();
});

