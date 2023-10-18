const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const Font = require('canvas').registerFont;
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');

function wrapText(text, length) {
    const regex = new RegExp(`(?:(?:\\S{${length}}|.{1,${length}})(?:\\s|$))`, 'g');
    return text.match(regex) || [];
}

const mdFolders = ['_android', '_bearer', '_hardware', '_iphone']; // MD files folders
const basePath = path.join(__dirname, '..'); // Base path to directory /
const backgroundImage = path.join(basePath, 'images', 'twCard', 'twitterImageBG800x600.jpg'); // Loads a 800x600 jpg image as a background
const iconsBasePath = path.join(basePath, 'images', 'wIcons'); // Icons base path 
const fallbackIcon = path.join(basePath, 'images', 'smallNoicon.png'); 

const yaml = require('js-yaml');
const verdictMap = {};
const verdictPath = '_data/verdicts';
fs.readdirSync(verdictPath).forEach((filename) => {
  if (filename.endsWith('.yml')) {
    const filePath = path.join(verdictPath, filename);
    const verdict = path.parse(filename).name;
    const yamlData = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(yamlData);
    verdictMap[verdict] = data.title;
  }
});

// Starting coordinates for text
let x = 100;
let y = 55;
// Width and Heights variables for canvas
const width = 800;
const height = 600;

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

async function processFilesWithCanvas() {
    let totalFiles = 0;
    let totalErrors = 0;
    const startTime = Date.now();

    for (let mdFolder of mdFolders) {
        const mdFilesPath = path.join(basePath, mdFolder); // MD files path
        const iconsPath = path.join(iconsBasePath, mdFolder.substring(1), 'small'); // Icons path
        const files = fs.readdirSync(mdFilesPath);

        for (let file of files) {
            if (file.endsWith('.md')) {
                try {
                    const parts = fs.readFileSync(path.join(mdFilesPath, file), 'utf-8').split('---\n');
                    const data = yaml.load(parts[1]);

                    let iconImage = path.join(basePath, 'images', 'wIcons', mdFolder.substring(1), 'small', `${data.icon}`);
                    if (!fs.existsSync(iconImage)) {
                        iconImage = fallbackIcon;
                    }
                    const tempImagePath = path.join(basePath, 'tempImage.png');
                    const coords = '+30+130';

                    await exec(`convert ${backgroundImage} ${iconImage} -geometry +${coords} -composite ${tempImagePath}`);

                    // Create a Canvas and load the temporary image
                    const { createCanvas, loadImage } = require('canvas');
                    const canvas = createCanvas(width, height);
                    const ctx = canvas.getContext('2d');
                    const img = await loadImage(tempImagePath);

                    Font('assets/fonts/Barlow/barlow-v12-latin-500.ttf', { family: 'Barlow' });


                    ctx.drawImage(img, 0, 0);

                    // Add text to the Canvas using Canvas functions

                    const wrappedTitle = wrapText(data.title || 'Unknown Title', 32); // adjust the length as needed
                    for (let i = 0; i < wrappedTitle.length; i++) {
                        const currentLine = wrappedTitle[i];
                        // Render the text with the selected font, size, and color
                        ctx.font = '32px Barlow';
                        ctx.fillText(currentLine, 150, 130 + (i * 40));
                    }

                    // Add version
                    ctx.font = '20px Barlow';
                    ctx.fillText(data.version, 55, 255); 

                    y += 30; // Increment Y by an estimated height for the next item

                    // Writing verdict with Barlow font
                    const mappedVerdict = verdictMap[data.verdict] || data.verdict || 'Unknown Verdict';
                    const wrappedVerdict = wrapText(mappedVerdict, 40); 
                    for (let i = 0; i < wrappedVerdict.length; i++) {
                        const currentLine = wrappedVerdict[i];
                        ctx.fillText(currentLine, 150, 225 + (i * 30), );
                    }
                    y += wrappedVerdict.length * 23; // adjust the multiplier as per the font size
                    
                    // Seperator line code
                    ctx.strokeStyle = 'rgb(128, 128, 128)';  // Set the line color to light gray
                    ctx.lineWidth = 1;         // Set the line width to 2 pixels

                    ctx.beginPath();
                    ctx.moveTo(225, 315);
                    ctx.lineTo(525, 315);
                    ctx.stroke();
                    ctx.closePath();
                    
                    let propertyX = 500;
                    // Writing developerName with Barlow font
                    const clippedDeveloperName = data.developerName ? (data.developerName.length > 23 ? data.developerName.substr(0, 23) + "..." : data.developerName) : 'Unknown Developer';
                    ctx.fillText(clippedDeveloperName, propertyX, 337);
                    y += 30; // Adjust y for the next item, depending on the font size you want.

                    // Writing users with Barlow font
                    ctx.fillText(`${data.users ?? 'N/A'}`, propertyX, 372, );
                    y += 30;

                    // Writing released date with Barlow font
                    const formattedReleasedDate = data.released ? formatDate(data.released): 'Unknown Date';
                    ctx.fillText(formattedReleasedDate, propertyX, 407);
                    y += 30;

                    // Save the Canvas as an image
                    const outputPath = `${basePath}/images/social/${mdFolder.substring(1)}/${file.replace('.md', '.png')}`;
                    const outputStream = fs.createWriteStream(outputPath);
                    const stream = canvas.createPNGStream();
                    stream.pipe(outputStream);

                    totalFiles++;
                } catch (err) {
                    console.error(`Error processing file: ${file}. Error: ${err.message}`);
                    totalErrors++;
                }
            }
        }
    }

    const totalTime = Date.now() - startTime;
    console.log(`Total files processed: ${totalFiles}`);
    console.log(`Total errors: ${totalErrors}`);
    console.log(`Total time it took to process: ${totalTime} ms`);
}

processFilesWithCanvas();
