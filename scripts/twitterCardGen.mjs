// Import libraries
import fs from 'fs';
import { createCanvas, loadImage, registerFont } from 'canvas';
import yaml from 'js-yaml';
import path from 'path';
import pLimit from 'p-limit';

// Constants
const fsp = fs.promises;
const limit = pLimit(8); // Allow 8 concurrent async operations
const basePath = '.';
const mdFolders = ['_android', '_bearer', '_hardware', '_iphone']; // MD file folders
const backgroundImage = path.join(basePath, 'images', 'twCard', 'twitterImageBG1024x576.jpg');
const iconsBasePath = path.join(basePath, 'images', 'wIcons');
const fallbackIcon = path.join(basePath, 'images', 'smallNoicon.png');
const verdictMap = loadVerdicts('_data/verdicts');

// Timer variables
let totalFiles = 0;
let totalTime = 1000;
let oldTotalFiles = 0;
const startTime = Date.now();

// Utility Functions - Text Wrapping
function wrapText(text, length) {
    const regex = new RegExp(`(?:(?:\\S{${length}}|.{1,${length}})(?:\\s|$))`, 'g');
    return text.match(regex) || [];
}

// Utility Functions - Date Formatter
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Utility Functions - Verdict Mapper
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
        if (totalTime > 1000 && totalFiles == 0) {
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

// Core Functions - Canvas Image and Text Overlays

async function drawOnCanvas(data, bgImage, iconImage) {
    // Width and Heights variables for canvas
    const width = 1024;
    const height = 576;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    registerFont('assets/fonts/Barlow/barlow-v12-latin-500.ttf', { family: 'Barlow' });
    
    // Draw the background image
    ctx.drawImage(bgImage, 0, 0, width, height);    

    // Draw the resized icon image at specified coordinates
    const iconX = 30;
    const iconY = 100;
    const iconWidth = 200;
    const iconHeight = 200;
    ctx.drawImage(iconImage, iconX, iconY, iconWidth, iconHeight);
    
    // Title
    const wrappedTitle = wrapText(data.title || 'Unknown Title', 32); // adjust the length as needed
    for (let i = 0; i < wrappedTitle.length; i++) {
        const currentLine = wrappedTitle[i];
        // Render the text with the selected font, size, and color
        ctx.font = '36px Barlow';
        ctx.fillText(currentLine, 250, 130 + (i * 40));
    }
    // Version
    if (data.version) {
        ctx.font = '18px Barlow';
        ctx.fillStyle = 'gray';
        ctx.fillText('Version:', 70, 325);
        // Wrapped version
        const wrappedVersion = wrapText(data.version, 7);  // adjust the length as needed
    
        for (let i = 0; i < wrappedVersion.length; i++) {
            const currentLine = wrappedVersion[i];
            // Render the text with the selected font, size, and color
            ctx.font = '18px Barlow';
            ctx.fillStyle = 'black';
            ctx.fillText(currentLine, 140, 325 + (i * 20));  // Adjust vertical spacing as needed
        }
    }
    
    // Verdict 
    const mappedVerdict = verdictMap[data.verdict] || data.verdict || 'Unknown Verdict';
    const wrappedVerdict = wrapText(mappedVerdict, 41);
    ctx.font = '30px Barlow';  
    for (let i = 0; i < wrappedVerdict.length; i++) {
        const currentLine = wrappedVerdict[i];
        ctx.fillText(currentLine, 250, 225 + (i * 30));
    }
    
    // Developer Name
    if (data.developerName) {
        ctx.font = '24px Barlow';
        ctx.fillStyle = 'gray';
        ctx.fillText('Developer:', 250, 300);
        
        // Wrap Developer Name
        const wrappedDeveloperName = wrapText(data.developerName, 37);  // adjust the length as needed
    
        for (let i = 0; i < wrappedDeveloperName.length; i++) {
            const currentLine = wrappedDeveloperName[i];
            // Render the text with the selected font, size, and color
            ctx.fillStyle = 'black';
            ctx.fillText(currentLine, 385, 300 + (i * 30));  // Adjust vertical spacing as needed
        }
    }
    
    // Separator line code
    //------------------------------
    ctx.globalAlpha = 0.3; // 70% transparency
    ctx.strokeStyle = 'rgb(128, 128, 128)';  // Set the line color to light gray
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(250, 335);
    ctx.lineTo(1000, 335);
    ctx.stroke();
    ctx.closePath();
    ctx.globalAlpha = 1; // 70% transparency
    
    //------------------------------

    // Downloads Label
    if (data.users) {
        ctx.globalAlpha = 1; 
        ctx.font = '30px Barlow';
        ctx.fillStyle = 'gray';
        ctx.fillText('Downloads:', 250, 370);
        // Downloads:
        ctx.fillStyle = 'black';
        ctx.fillText('>' + data.users, 800, 370);
    }

    // Released Label
    ctx.fillStyle = 'gray';
    ctx.fillText('Released:', 250, 415);
    // Released
    ctx.fillStyle = 'black';
    const formattedReleasedDate = data.released ? formatDate(data.released): 'Unknown';
    ctx.fillText(formattedReleasedDate, 800, 415); 

    // Updated Label
    ctx.fillStyle = 'gray';
    ctx.fillText('Date Updated:', 250, 460);
    // Updated
    ctx.fillStyle = 'black';
    const formattedUpdateDate = data.updated ? formatDate(data.updated): 'Unknown';
    ctx.fillText(formattedUpdateDate, 800, 460); 

    // Last Analysis Date:
    ctx.fillStyle = 'gray';
    ctx.fillText('Date Analyzed:', 250, 505);
    // Date
    ctx.fillStyle = 'black';
    const formattedAnalyzeDate = data.date ? formatDate(data.date): 'Unknown';
    ctx.fillText(formattedAnalyzeDate, 800, 505);  

    return canvas;
}

// Core Functions - Process One File
async function processOneFile(platform, mdFilesPath, file, outputFolderPath) {
    try {
        const parts = fs.readFileSync(path.join(mdFilesPath, file), 'utf-8').split('---\n');
        const data = yaml.load(parts[1]);
        // Two variables for temporary Images
        // const tempImagePath = `/tmp/ws_tempImage_${file}.png`;

        let iconImagePath = path.join(basePath, 'images', 'wIcons', platform, `${data.icon}`);
        if (!fs.existsSync(iconImagePath)) {
            iconImagePath = fallbackIcon;
        }

        // Load the bg image and icon
        const bgImage = await loadImage(backgroundImage);
        const iconImage = await loadImage(iconImagePath);

        // Draw on the canvas
        const canvas = await drawOnCanvas(data, bgImage, iconImage);
        
        // Export the canvas as a PNG file
        const dataURL = canvas.toDataURL('image/png');

        // Save the Canvas as an image
        const outputPath = `${outputFolderPath}/${file.replace('.md', '.png')}`;
        await fsp.writeFile(outputPath, dataURL.replace(/^data:image\/png;base64,/, ''), 'base64');
        
        // Call the delete temp files function
        totalFiles--;
    } catch (error) {
        console.error(`Error processing file ${file}: `, error);
    }
}

// Core Functions - Process Files
async function processFiles() {
    const socialImagesFolderPath = `${basePath}/images/social`;
    fs.existsSync(socialImagesFolderPath) || fs.mkdirSync(socialImagesFolderPath);

    const asyncTasks = [];
    for (let mdFolder of mdFolders) {
        const mdFilesPath = path.join(basePath, mdFolder); // MD files path
        const platform = mdFolder.substring(1);
        const iconsPath = path.join(iconsBasePath, platform, 'small'); // Icons path
        const files = fs.readdirSync(mdFilesPath);
        const outputFolderPath = `${basePath}/images/social/${platform}`;
        fs.existsSync(outputFolderPath) || fs.mkdirSync(outputFolderPath);

        for (let file of files) {
            totalFiles++;
            asyncTasks.push(limit(() => processOneFile(platform, mdFilesPath, file, outputFolderPath)));
        }
    }
    await Promise.all(asyncTasks);
}

processFilesTimed();