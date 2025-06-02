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
const backgroundImage = 'images/twCard/socGenCardblue.png';
let bgImage, reproducibleImage;
// Load the "reproducible" image
const reproducibleImagePath = 'images/twCard/reproducible-dark.png';
const fallbackIcon = 'images/smallNoicon.png';
const verdictMap = loadVerdicts('_data/verdicts');

// Timer variables
let totalFiles = 0;
let totalTime = 0;
let oldTotalFiles = 0;
const startTime = Date.now();

async function loadResources () {
  bgImage = await loadImage(backgroundImage);
  reproducibleImage = await loadImage(reproducibleImagePath);
  registerFont('assets/fonts/Barlow/barlow-v12-latin-500.ttf', { family: 'Barlow' });
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
async function overlayReproducibleImage (ctx) {
  // Overlay the "reproducible" image
  const x = 500;
  const y = 180;
  const width = 200;
  const height = 40;
  ctx.drawImage(reproducibleImage, x, y, width, height);

  // Add a subtle line
  ctx.globalAlpha = 0.3; // 70% transparency
  ctx.strokeStyle = 'rgb(128, 128, 128)'; // Set the line color to light gray
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(205, 182); // match the above (x, y)
  ctx.lineTo(750, 182);
  ctx.stroke();
  ctx.closePath();
  ctx.globalAlpha = 1;
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
  const iconY = 150; // 100 if 1024x576
  
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
  
  // Title - centered below version
  ctx.textAlign = 'center';  // Print the title (truncate if longer than 20 characters)
  const titleY = iconY + iconHeight + 60; // 60px below the icon
  let displayTitle = data.title || 'Unknown Title';
  if (displayTitle.length > 20) {
    displayTitle = displayTitle.substring(0, 20) + '...';
  }
  printText(displayTitle, ctx, centerX, titleY, 'white', '22px Barlow', 42, 29);
  
  // Developer Name - in dark gray
  if (data.developerName) {
    const devNameY = titleY + 33; // Moved 7px closer to title
    ctx.font = '400 20px Barlow';
    ctx.fillStyle = 'rgba(122, 122, 122, 1.0)'; // Dark gray color
    ctx.textAlign = 'center';
    ctx.fillText(data.developerName, width / 2, devNameY);
  }
  
  // Verdict - centered below developer name
  const mappedVerdict = verdictMap[data.verdict] || data.verdict || 'Unknown Verdict';
  if (data.verdict === 'reproducible') {
    await overlayReproducibleImage(ctx);
  }
  
  const verdictY = (data.developerName ? titleY + 80 : titleY + 40); // Position based on whether developer name exists
  
  // Set font first so we can measure text properly
  ctx.font = '400 19px Barlow'; // Reduced by 5px total (3px + 2px)
  
  // Draw a subtle rounded rectangle background for the verdict
  const verdictMetrics = ctx.measureText(mappedVerdict);
  const verdictWidth = verdictMetrics.width + 60; // Add more padding for longer verdicts
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
  
  // Draw the verdict text
  printText(mappedVerdict, ctx, centerX, verdictY, 'black', '400 19px Barlow', 41, 30);
  
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
