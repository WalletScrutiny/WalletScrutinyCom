// Import libraries
import fs from 'fs';
import { createCanvas, loadImage, registerFont } from 'canvas';
import yaml from 'js-yaml';
import path from 'path';
import pLimit from 'p-limit';

// Constants
const fsp = fs.promises;
const limit = pLimit(8); // Allow 8 concurrent async operations
const mdFolders = ['_android', '_bearer', '_hardware', '_iphone']; // MD file folders
const backgroundImage = 'images/twCard/twitterImageBG512x288.jpg';
const bgImage = await loadImage(backgroundImage);
// Load the "reproducible" image
const reproducibleImagePath = 'images/twCard/reproducible-dark.png';
const reproducibleImage = await loadImage(reproducibleImagePath);
const iconsBasePath = 'images/wIcons';
const fallbackIcon = 'images/smallNoicon.png';
const verdictMap = loadVerdicts('_data/verdicts');
await registerFont('assets/fonts/Barlow/barlow-v12-latin-500.ttf', { family: 'Barlow' });

// Timer variables
let totalFiles = 0;
let totalTime = 0;
let oldTotalFiles = 0;
const startTime = Date.now();

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
        console.log(`${(totalTime/1000).toFixed(1)}s: ${totalFiles} files and ${secondsRemaining.toFixed(0)}s remaining at approx. ${filesPerSecond.toFixed(0)}f/s.`)
        if (totalTime > 1000 && limit.activeCount === 0) {
            // stop when not working on any tasks ...
            clearInterval(i)
            console.log(`
Finished in ${(totalTime/1000).toFixed(1)}s`);
        }
        oldTotalFiles = totalFiles;
    }, 5_000)
}

async function processFilesTimed() {
    showProgress();
    await processFiles();
}

// Utility function to overlay "reproducible" image
async function overlayReproducibleImage(ctx) {
    // Overlay the "reproducible" image
    const overlayX = 35;  // X position
    const overlayY = 177; // Y position (100 pixels below the logo)
    const overlayWidth = 75;
    const overlayHeight = 75;
    ctx.drawImage(reproducibleImage, overlayX, overlayY, overlayWidth, overlayHeight);

    // Background line for reproducible
    ctx.strokeStyle = 'rgb(255, 173, 48)';  // Set the line color to orange
    ctx.lineWidth = 20;

    let grad = ctx.createLinearGradient(130, 110, 500, 110);
    grad.addColorStop(0, 'rgba(255, 173, 48, 0.8)'); // 0% transparent at the start
    grad.addColorStop(0.4, 'rgba(255, 173, 48, 0.4)'); // 0% transparent at the middle
    grad.addColorStop(1, 'rgba(255, 173, 48, 0)'); // 100% transparent at the end

    ctx.strokeStyle = grad;

    ctx.beginPath();
    ctx.moveTo(130, 116);
    ctx.lineTo(500, 116);
    ctx.stroke();
    ctx.closePath();
}

// Core Functions - Canvas Image and Text Overlays

async function drawOnCanvas(data, iconImage) {
    // Width and Heights variables for canvas
    const width = 512; 
    const height = 288;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Draw the background image
    ctx.drawImage(bgImage, 0, 0, width, height);    

    // Draw the resized icon image at specified coordinates
    const iconX = 22; // 30 if 1024x576
    const iconY = 55; // 100 if 1024x576
    const iconWidth = 100;
    const iconHeight = 100;
    ctx.drawImage(iconImage, iconX, iconY, iconWidth, iconHeight);
    
    // Title
    printText(data.title || 'Unknown Title', ctx, 130, 70, 'black', '20px Barlow', 42, 22);
    // Version
    if (data.version) {
        printText('Version:', ctx, 45, 170, 'gray', '7px Barlow');
        // Wrapped version
        printText(data.version, ctx, 73, 170, 'black', '12px Barlow', 7, 10);
    }
    
    // Verdict 
    const mappedVerdict = verdictMap[data.verdict] || data.verdict || 'Unknown Verdict';
    printText(mappedVerdict, ctx, 130, 122, 'black', '30px Barlow', 41, 30);
    
    if (data.verdict === 'reproducible') {
        await overlayReproducibleImage(ctx);
    }
    
    // Developer Name
    if (data.developerName) {
        printText('Developer:', ctx, 130, 140, 'gray', '16px Barlow');
        printText(data.developerName, ctx, 220, 140, 'black', null, 37, 18);
    }
    
    // Separator line code
    //------------------------------
    ctx.globalAlpha = 0.3; // 70% transparency
    ctx.strokeStyle = 'rgb(128, 128, 128)';  // Set the line color to light gray
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(130, 165);
    ctx.lineTo(500, 165);
    ctx.stroke();
    ctx.closePath();
    ctx.globalAlpha = 1;
    
    //------------------------------

    if (data.users) {
        printText('Downloads:', ctx, 130, 185, 'gray', '16px Barlow');
        printText('>' + data.users, ctx, 240, 185, 'black');
    }

    function dateOrUnknown(date) {
      return date
      ? formatDate(date)
      : 'Unknown';
    }
    printText('Released:', ctx, 130, 205, 'gray', '16px Barlow');
    printText(dateOrUnknown(data.released), ctx, 240, 205, 'black');

    printText('Updated:', ctx, 130, 225, 'gray');
    printText(dateOrUnknown(data.updated), ctx, 240, 225, 'black');

    printText('Analyzed:', ctx, 130, 245, 'gray');
    printText(dateOrUnknown(data.date), ctx, 240, 245, 'black');

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
    const parts = (await fsp.readFile(path.join(mdFilesPath, file), 'utf-8')).split('---\n');
    const data = yaml.load(parts[1]);

    let iconImagePath = path.join('images', 'wIcons', platform, `${data.icon}`);
    if (!fs.existsSync(iconImagePath)) {
        iconImagePath = fallbackIcon;
    }

    // Load the bg image and icon
    let iconImage
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
async function processFiles() {
    const socialImagesFolderPath = `images/social`;
    fs.existsSync(socialImagesFolderPath) || fs.mkdirSync(socialImagesFolderPath);

    const asyncTasks = [];
    for (let mdFolder of mdFolders) {
        const mdFilesPath = mdFolder;
        const platform = mdFolder.substring(1);
        const iconsPath = path.join(iconsBasePath, platform, 'small'); // Icons path
        const files = await fsp.readdir(mdFilesPath);
        const outputFolderPath = `images/social/${platform}`;
        fs.existsSync(outputFolderPath) || fs.mkdirSync(outputFolderPath);

        for (let file of files) {
            totalFiles++;
            asyncTasks.push(limit(() => processOneFile(platform, mdFilesPath, file, outputFolderPath)));
        }
    }
    await Promise.all(asyncTasks);
}

processFilesTimed();
