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
const verdictMap = loadVerdicts('_data/verdicts');

// Timer variables
let totalFiles = 0;
let totalTime = 0;
let oldTotalFiles = 0;
const startTime = Date.now();

async function loadResources () {
  bgImage = await loadImage(backgroundImage);
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
  const titleY = iconY + 50; // positioned near top of icon, like ZEUS Wallet reference
  printText(data.title || 'Unknown Title', ctx, titleX, titleY, 'white', '40px Barlow', 27, 45);


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

