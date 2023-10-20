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
const backgroundImage = 'images/twCard/twitterImageBG800x600.jpg';
const bgImage = await loadImage(backgroundImage);
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

async function drawOnCanvas(data, iconImage) {
    // Width and Heights variables for canvas
    const width = 800;
    const height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Draw the background image
    ctx.drawImage(bgImage, 0, 0, width, height);    

    // Draw the resized icon image at specified coordinates
    const iconX = 30;
    const iconY = 90;
    const iconWidth = 175;
    const iconHeight = 175;
    ctx.drawImage(iconImage, iconX, iconY, iconWidth, iconHeight);
    
    // Title
    printText(data.title || 'Unknown Title', ctx, 225, 130, 'black', '36px Barlow', 32, 40);
    // Version
    if (data.version) {
        printText('Version:', ctx, 50, 300, 'gray', '18px Barlow');
        // Wrapped version
        printText(data.version, ctx, 125, 300, 'black', '18px Barlow', 7, 20);
    }
    
    // Verdict 
    const mappedVerdict = verdictMap[data.verdict] || data.verdict || 'Unknown Verdict';
    printText(mappedVerdict, ctx, 225, 225, 'black', '30px Barlow', 41, 30);
    
    // Developer Name
    if (data.developerName) {
        printText('Developer:', ctx, 225, 300, 'gray', '24px Barlow');
        printText(data.developerName, ctx, 355, 300, 'black', null, 37, 30);
    }
    
    // Separator line code
    //------------------------------
    ctx.globalAlpha = 0.3; // 70% transparency
    ctx.strokeStyle = 'rgb(128, 128, 128)';  // Set the line color to light gray
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(225, 335);
    ctx.lineTo(750, 335);
    ctx.stroke();
    ctx.closePath();
    ctx.globalAlpha = 1;
    //------------------------------

    if (data.users) {
        printText('Downloads:', ctx, 225, 400, 'gray', '30px Barlow');
        printText('>' + data.users, ctx, 600, 400, 'black', '30px Barlow');
    }

    function dateOrUnknown(date) {
      return date
      ? formatDate(date)
      : 'Unknown';
    }
    printText('Released:', ctx, 225, 445, 'gray');
    printText(dateOrUnknown(data.released), ctx, 600, 445, 'black');

    printText('Updated:', ctx, 225, 490, 'gray');
    printText(dateOrUnknown(data.updated), ctx, 600, 490, 'black');

    printText('Analyzed:', ctx, 225, 535, 'gray');
    printText(dateOrUnknown(data.date), ctx, 600, 535, 'black');

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