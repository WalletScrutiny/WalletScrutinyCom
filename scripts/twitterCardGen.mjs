// To generate for single files, run:
// $ node scripts/twitterCardGen.mjs --single android _android com.phonegap.bit2me.md

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
const backgroundImage = 'images/twCard/twitterImageBG800x450.png';
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

async function loadResources() {
  try {
    bgImage = await loadImage(backgroundImage);
    console.log('Background image loaded successfully');
  } catch (error) {
    console.error('Failed to load background image:', error);
    process.exit(1); // Exit the script if the background image fails to load
  }

  try {
    reproducibleImage = await loadImage(reproducibleImagePath);
    console.log('Reproducible image loaded successfully');
  } catch (error) {
    console.error('Failed to load reproducible image:', error);
    process.exit(1); // Exit the script if the reproducible image fails to load
  }

  try {
    registerFont('assets/fonts/Barlow/barlow-v12-latin-500.ttf', { family: 'Barlow' });
    console.log('Font loaded successfully');
  } catch (error) {
    console.error('Failed to load font:', error);
    process.exit(1); // Exit the script if the font fails to load
  }
}

function wrapText(text, length) {
  const regex = new RegExp(`(?:(?:\\S{${length}}|.{1,${length}})(?:\\s|$))`, 'g');
  return `${text}`.match(regex) || [];
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function loadVerdicts(verdictPath) {
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
async function showProgress() {
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

async function processFilesTimed() {
  showProgress();
  await loadResources();
  await processFiles();
}

const spikes = 5;
const outerRadius = 20;
const innerRadius = 10;
const strokeWidth = 3;
function drawStar(ctx, cx, cy, fillColor = '#ee9e15', strokeColor = 'black', fraction = 1) {
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
async function drawStars(ctx, stars, x, y, starSize) {
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

// Utility function to overlay "reproducible" image
async function overlayReproducibleImage(ctx) {
  // Overlay the "reproducible" image
  const overlayX = 41; // X position
  const overlayY = 275; // Y position (100 pixels below the logo)
  const overlayWidth = 130;
  const overlayHeight = 130;
  ctx.drawImage(reproducibleImage, overlayX, overlayY, overlayWidth, overlayHeight);

  // Background line for reproducible

  ctx.strokeStyle = 'rgb(255, 173, 48)'; // Set the line color to orange
  ctx.lineWidth = 25;
  ctx.lineJoin = 'round';

  const grad = ctx.createLinearGradient(280, 182, 750, 182); // Adjust (x,y, up to x,y)
  grad.addColorStop(0, 'rgba(255, 173, 48, 0.8)'); // 20% transparent at the start
  grad.addColorStop(0.7, 'rgba(255, 173, 48, 0.4)'); // 60% transparent at the middle
  grad.addColorStop(1, 'rgba(255, 173, 48, 0)'); // 100% transparent at the end

  ctx.strokeStyle = grad;

  ctx.beginPath();
  ctx.moveTo(205, 182); // match the above (x, y)
  ctx.lineTo(750, 182);
  ctx.stroke();
  ctx.closePath();
}

// Core Functions - Canvas Image and Text Overlays

async function drawOnCanvas(data, iconImage) {
  // Width and Heights variables for canvas
  const width = 800;
  const height = 450;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Draw the background image
  ctx.drawImage(bgImage, 0, 0, width, height);

  // Draw the resized icon image at specified coordinates
  const iconX = 22; // 30 if 1024x576
  const iconY = 80; // 100 if 1024x576
  const iconWidth = 160;
  const iconHeight = 160;
  ctx.drawImage(iconImage, iconX, iconY, iconWidth, iconHeight);

  // Title
  printText(data.title || 'Unknown Title', ctx, 207, 113, 'black', '31px Barlow', 42, 29);
  // Version
  if (data.version) {
    printText('Version:', ctx, 60, 260, 'gray', '12px Barlow');
    // Wrapped version
    printText(data.version, ctx, 107, 260, 'black', '16px Barlow', 7, 10);
  }

  // Verdict
  const mappedVerdict = verdictMap[data.verdict] || data.verdict || 'Unknown Verdict';

  if (data.verdict === 'reproducible') {
    await overlayReproducibleImage(ctx);
  }

  printText(mappedVerdict, ctx, 207, 190, 'black', '26px Barlow', 41, 30);

  // Developer Name
  if (data.developerName) {
    printText('Developer:', ctx, 207, 230, 'gray', '20px Barlow');
    printText(data.developerName, ctx, 305, 230, 'black', null, 37, 18);
  }

  // Separator line code
  // ------------------------------
  ctx.globalAlpha = 0.3; // 70% transparency
  ctx.strokeStyle = 'rgb(128, 128, 128)'; // Set the line color to light gray
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(207, 255);
  ctx.lineTo(750, 255);
  ctx.stroke();
  ctx.closePath();
  ctx.globalAlpha = 1;

  // ------------------------------

  if (data.stars) {
    // Draw Stars
    drawStars(ctx, data.stars, 560, 330, 30); // x=130, y=265 are coordinates; 20 is star spacing
  }

  if (data.users) {
    printText('Downloads:', ctx, 207, 285, 'gray', '20px Barlow');
    printText('>' + data.users, ctx, 360, 285, 'black');
  }

  function dateOrUnknown(date) {
    return date ? formatDate(date) : 'Unknown';
  }
  printText('Released:', ctx, 207, 315, 'gray', '20 Barlow');
  printText(dateOrUnknown(data.released), ctx, 360, 315, 'black');

  printText('Updated:', ctx, 207, 345, 'gray');
  printText(dateOrUnknown(data.updated), ctx, 360, 345, 'black');

  printText('Analyzed:', ctx, 207, 375, 'gray');
  printText(dateOrUnknown(data.date), ctx, 360, 375, 'black');

  return canvas;
}

function printText(text, ctx, x, y, fillStyle, font, maxLength, lineHeight) {
  const wrapped = wrapText(text, maxLength || 1000);
  ctx.font = font || ctx.font;
  ctx.fillStyle = fillStyle || ctx.fillStyle;
  for (let i = 0; i < wrapped.length; i++) {
    const line = wrapped[i];
    ctx.fillText(line, x, y + (i * (lineHeight || 0)));
  }
}

// Core Functions - Process One File
async function processOneFile(platform, mdFilesPath, file, outputFolderPath) {
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

  let iconImagePath = path.join('images', 'wIcons', platform, `${data.icon}`);
  if (!fs.existsSync(iconImagePath)) {
    iconImagePath = fallbackIcon;
  }

  // Load the bg image and icon
  let iconImage;
  try {
    iconImage = await loadImage(iconImagePath);
  } catch (error) {
    console.error(`Error processing file ${file} with icon ${iconImagePath}: `, error);
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
async function processFiles() {
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

// Main function to handle command-line arguments
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 4 && args[0] === '--single') {
    const platform = args[1];
    const mdFilesPath = args[2];
    const file = args[3];
    const outputFolderPath = `images/social/${platform}`;

    if (!fs.existsSync(outputFolderPath)) {
      fs.mkdirSync(outputFolderPath, { recursive: true });
    }

    await loadResources();
    await processOneFile(platform, mdFilesPath, file, outputFolderPath);
    console.log('Processing of single file completed');
  } else {
    await processFilesTimed();
  }
}

// Start the process
main();
