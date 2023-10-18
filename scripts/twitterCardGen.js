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

// Two variables for temporary Images
const tempImagePath = path.join(basePath, 'tempImage.png');
const tempIconPath = path.join(basePath, 'tempIcon.png');

// Function to delete temporary files
function deleteTempFiles() {
    // Check and delete the temporary icon file
    if (fs.existsSync(tempIconPath)) {
        fs.unlink(tempIconPath, (err) => {
        });
    }

    // Check and delete the temporary image file
    if (fs.existsSync(tempImagePath)) {
        fs.unlink(tempImagePath, (err) => {
        });
    }
}

// Set up a signal handler to catch process termination (e.g., Ctrl+C)
process.on('SIGINT', () => {
  console.log('Script interrupted. Cleaning up...');
  deleteTempFiles();
  process.exit(1); // Exit the script
});


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
    const socialImagesFolderPath = `${basePath}/images/social`;
    fs.existsSync(socialImagesFolderPath) || fs.mkdirSync(socialImagesFolderPath);

    for (let mdFolder of mdFolders) {
        const mdFilesPath = path.join(basePath, mdFolder); // MD files path
        const platform = mdFolder.substring(1);
        const iconsPath = path.join(iconsBasePath, platform, 'small'); // Icons path
        const files = fs.readdirSync(mdFilesPath);
        const outputFolderPath = `${basePath}/images/social/${platform}`;
        fs.existsSync(outputFolderPath) || fs.mkdirSync(outputFolderPath);

        for (let file of files) {
            const parts = fs.readFileSync(path.join(mdFilesPath, file), 'utf-8').split('---\n');
            const data = yaml.load(parts[1]);

            let iconImage = path.join(basePath, 'images', 'wIcons', platform, `${data.icon}`);
            if (!fs.existsSync(iconImage)) {
                iconImage = fallbackIcon;
            }
            const coords = '+30+90';

            // First, resize the iconImage
            await exec(`convert ${iconImage} -resize 175x175! ${tempIconPath}`);

            // Then, composite the resized icon onto the backgroundImage
            await exec(`convert ${backgroundImage} ${tempIconPath} -geometry +${coords} -composite ${tempImagePath}`);

            // Create a Canvas and load the temporary image
            const { createCanvas, loadImage } = require('canvas');
            const canvas = createCanvas(width, height);
            const ctx = canvas.getContext('2d');
            const img = await loadImage(tempImagePath);

            Font('assets/fonts/Barlow/barlow-v12-latin-500.ttf', { family: 'Barlow' });
            
            ctx.drawImage(img, 0, 0);

            // Title
            const wrappedTitle = wrapText(data.title || 'Unknown Title', 32); // adjust the length as needed
            for (let i = 0; i < wrappedTitle.length; i++) {
                const currentLine = wrappedTitle[i];
                // Render the text with the selected font, size, and color
                ctx.font = '36px Barlow';
                ctx.fillText(currentLine, 225, 130 + (i * 40));
            }
            // Version label
            ctx.font = '18px Barlow';
            ctx.fillText('Version: ', 50, 300)    
            // Version No:
            ctx.font = '18px Barlow';
            ctx.fillText(data.version, 125, 300); 

            y += 30; // Increment Y by an estimated height for the next item

            // Verdict 
            const mappedVerdict = verdictMap[data.verdict] || data.verdict || 'Unknown Verdict';
            const wrappedVerdict = wrapText(mappedVerdict, 37);
            ctx.font = '30px Barlow';  
            for (let i = 0; i < wrappedVerdict.length; i++) {
                const currentLine = wrappedVerdict[i];
                ctx.fillText(currentLine, 225, 225 + (i * 30), );
            }
            y += wrappedVerdict.length * 23; // adjust the multiplier as per the font size
            
            // Developer Label
            ctx.font = '24px Barlow';
            ctx.fillStyle = 'gray';
            ctx.fillText('Developer:', 225, 300);
            // Developer Name:
            ctx.font = '24px Barlow';
            ctx.fillStyle = 'black';
            ctx.fillText(data.developerName, 355, 300);  

            // Separator line code
            //------------------------------
            ctx.globalAlpha = 0.3; // 70% transparency
            ctx.strokeStyle = 'rgb(128, 128, 128)';  // Set the line color to light gray
            ctx.lineWidth = 1;         // Set the line width to 2 pixels

            ctx.beginPath();
            ctx.moveTo(225, 335);
            ctx.lineTo(750, 335);
            ctx.stroke();
            ctx.closePath();
            
            //------------------------------

            // Downloads Label
            ctx.globalAlpha = 1; 
            ctx.font = '30px Barlow';
            ctx.fillStyle = 'gray';
            ctx.fillText('Downloads:', 225, 400);
            // Downloads Name:
            ctx.font = '30px Barlow';
            ctx.fillStyle = 'black';
            ctx.fillText(data.users, 600, 400);  

            // Released Label
            ctx.font = '30px Barlow';
            ctx.fillStyle = 'gray';
            ctx.fillText('Released:', 225, 445);
            // Released
            ctx.fillStyle = 'black';
            const formattedReleasedDate = data.released ? formatDate(data.released): 'Unknown';
            ctx.fillText(formattedReleasedDate, 600, 445); 

            // Updated Label
            ctx.font = '30px Barlow';
            ctx.fillStyle = 'gray';
            ctx.fillText('Date Updated:', 225, 490);
            // Updated
            ctx.fillStyle = 'black';
            const formattedUpdateDate = data.updated ? formatDate(data.updated): 'Unknown';
            ctx.fillText(formattedUpdateDate, 600, 490); 

            // Last Analysis Date:
            ctx.font = '30px Barlow';
            ctx.fillStyle = 'gray';
            ctx.fillText('Date Updated:', 225, 535);
            // Date
            ctx.font = '30px Barlow';
            ctx.fillStyle = 'black';
            const formattedAnalyzeDate = data.date ? formatDate(data.date): 'Unknown';
            ctx.fillText(formattedAnalyzeDate, 600, 535);                   

            // Save the Canvas as an image
            const outputPath = `${outputFolderPath}/${file.replace('.md', '.png')}`;
            const outputStream = fs.createWriteStream(outputPath);
            const stream = canvas.createPNGStream();
            stream.pipe(outputStream);
            
            // Call the delete temp files function
            deleteTempFiles();
            totalFiles++;
        }
    }

    const totalTime = Date.now() - startTime;
    console.log(`Total files processed: ${totalFiles}`);
    console.log(`Total errors: ${totalErrors}`);
    console.log(`Total time it took to process: ${totalTime} ms`);
}

processFilesWithCanvas();

deleteTempFiles();
