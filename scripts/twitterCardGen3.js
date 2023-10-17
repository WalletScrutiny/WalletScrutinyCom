const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const Jimp = require('jimp');
const path = require('path');

function wrapText(text, length) {
    const regex = new RegExp(`(?:(?:\\S{${length}}|.{1,${length}})(?:\\s|$))`, 'g');
    return text.match(regex) || [];
}

const mdFolders = ['_android', '_bearer', '_hardware', '_iphone']; // MD files folders
const basePath = path.join(__dirname, '..');
const backgroundImage = path.join(basePath, 'images', 'twCard', 'twitterImageBG600x600.jpg');
const iconsBasePath = path.join(basePath, 'images', 'wIcons'); // Icons base path 
const fontBasePath = path.join(basePath, 'assets', 'fonts', 'Barlow', 'barlow-fnt')
const notoSansPath = path.join(basePath, 'assets', 'fonts', 'NotoSans', 'NotoSans.fnt'); // Path to Noto Sans Arabic Font
const barlow30path = path.join(fontBasePath, 'barlow30black', '7R9s0RBr248p1NXogRG5taD4.ttf.fnt');
const barlow27path = path.join(fontBasePath, 'barlow27black', 'wLGmfyMfmpMdLRpomfzsFBfq.ttf.fnt');
const barlow25path = path.join(fontBasePath, 'barlow25black', 'jMYUacOdgyFacfesoWuVlXmp.ttf.fnt');
const barlow25graypath = path.join(fontBasePath, 'barlow25gray', 'dWxVsEOMx8Dxe4UUXvy0leGe.ttf.fnt');
const barlow23path = path.join(fontBasePath, 'barlow23black', '2KWA9EgA5hCXd2SVQJcsZf3Q.ttf.fnt');
const barlow18path = path.join(fontBasePath, 'barlow18black', 'zgfCog9D9HWvpLNyuFjDdXss.ttf.fnt');
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

//Starting coordinates for text
let x = 100;
let y = 10;

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function printLabel(image, font, x, y, text) {
    image.print(font, x, y, text);
    return y + 35;
}

async function processFiles() {
    let totalFiles = 0;
    let totalErrors = 0;
    const startTime = Date.now();

    // Load font within the function
    const barlow30 = await Jimp.loadFont(barlow30path);
    const notoSans = await Jimp.loadFont(notoSansPath);
    const barlow27 = await Jimp.loadFont(barlow27path);
    const barlow25 = await Jimp.loadFont(barlow25path);
    const barlow25g = await Jimp.loadFont(barlow25graypath);
    const barlow23 = await Jimp.loadFont(barlow23path);
    const barlow18 = await Jimp.loadFont(barlow18path);

    for (let mdFolder of mdFolders) {
        const mdFilesPath = path.join(basePath, mdFolder); // MD files path
        const iconsPath = path.join(iconsBasePath, mdFolder.substring(1), 'small'); // Icons path

        const files = fs.readdirSync (mdFilesPath);
        for (let file of files) {
            if (file.endsWith('.md')) {
                    const parts = fs.readFileSync(path.join(mdFilesPath, file), 'utf-8').split('---\n');
                    const data = yaml.load(parts[1]);
                    
                    let iconImage = path.join(basePath, 'images', 'wIcons', mdFolder.substring(1), 'small', `${data.icon}`);
                    if (!fs.existsSync(iconImage)) {
                        iconImage = fallbackIcon;
                    }              
                    // Uncomment to troubleshoot errors
                    // console.log('Parsed data:', data);
                    // console.log(`File Content: ${parts}`);
                    
                    // calculate the number of lines the title will occupy
                    const titleLineCount = Math.ceil(Jimp.measureText(barlow25, data.title) / 350); // assuming maxWidth is 250 as in your code

                    const tempImagePath = path.join(basePath, 'tempImage.png');

                    // Overlay icon onto the background using ImageMagick
                    const coords = '+30+130'; 
                    // const tempImagePath = `${basePath}/images/tempImage.png`;
                    await exec(`convert ${backgroundImage} ${iconImage} -geometry +${coords} -composite ${tempImagePath}`);

                    // Load the temporary image for text addition
                    const image = await Jimp.read(tempImagePath);

                    // Regex for Arabic characters
                    const arabicCharRegExp = /[\u0600-\u06FF]/; // This is supposed to search and detect for any Arabic characters in the text

                    const wrappedTitle = wrapText(data.title || 'Unknown Title', 32); // adjust the length as needed
                    for (let i = 0; i < wrappedTitle.length; i++) {
                        const currentLine = wrappedTitle[i];
                        if (arabicCharRegExp.test(currentLine)) {
                            // IF any of the titles contain characters listed in the RegEx, switch to the Arabic-supporting font
                            image.print(notoSans, 150, 130 + (i * 40), wrappedTitle[i]);
                        } else {
                            // Otherwise the title is output in Barlow 30. Unfortunately it does not work with mixed English/Arabic titles.
                            image.print(barlow30, 150, 130 + (i * 40), wrappedTitle[i]);
                            
                        }
                    }
                    y += wrappedTitle.length * 40;  // adjust the multiplier as per the font size

                    // Writing version with Barlow font
                    const version = data.version ?? 'N/A';
                    image.print(barlow23, 55, 235, version);
                    y += 30; // Increment Y by an estimated height for the next item

                    // Writing verdict with Barlow font
                    const mappedVerdict = verdictMap[data.verdict] || data.verdict || 'Unknown Verdict';
                    const wrappedVerdict = wrapText(mappedVerdict, 40); 
                    for (let i = 0; i < wrappedVerdict.length; i++) {
                        image.print(barlow25, 150, 225 + (i * 30), wrappedVerdict[i]);
                    }
                    y += wrappedVerdict.length * 23; // adjust the multiplier as per the font size

                    // Separator line

                    // Drawing a thin gray horizontal line
                    const lineStartX = 175;    // Start of the line on X-axis
                    const lineStartY = 317;    // Start of the line on Y-axis
                    const lineLength = 300;    // Length of the line
                    const lineHeight = 1;      // Height of the line
                    const grayColor = Jimp.rgbaToInt(128, 128, 128, 255); // RGBA value for gray

                    image.scan(lineStartX, lineStartY, lineLength, lineHeight, (x, y, idx) => {
                        image.bitmap.data[idx + 0] = (grayColor >> 24) & 0xFF; // Red channel
                        image.bitmap.data[idx + 1] = (grayColor >> 16) & 0xFF; // Green channel
                        image.bitmap.data[idx + 2] = (grayColor >> 8) & 0xFF;  // Blue channel
                        image.bitmap.data[idx + 3] = grayColor & 0xFF;         // Alpha channel
                    });

                    y += lineHeight + 10; 
                    // Labels        
                    y = 337;
                    y = printLabel(image, barlow25g, 150, y, "Developer:");
                    y = printLabel(image, barlow25g, 150, y, "Downloads:");
                    y = printLabel(image, barlow25g, 150, y, "Released:");
                    y = printLabel(image, barlow25g, 150, y, "Latest Release:");
                    y = printLabel(image, barlow25g, 150, y, "Last Analyzed:");

                    // Writing developerName with Barlow font
                    const clippedDeveloperName = data.developerName ? (data.developerName.length > 15 ? data.developerName.substr(0, 15) + "..." : data.developerName) : 'Unknown Developer';
                    image.print(barlow25, 340, 337, clippedDeveloperName);
                    y += 30; // Adjust y for the next item, depending on the font size you want.

                    // Writing users with Barlow font
                    image.print(barlow25, 340, 372, `${data.users ?? 'N/A'}`);
                    y += 30;

                    // Writing released date with Barlow font
                    const formattedReleasedDate = data.released ? formatDate(data.released): 'Unknown Date';
                    image.print(barlow25, 340, 407, formattedReleasedDate);
                    y += 30;

                    // Writing updated date with Barlow font
                    const formattedUpdatedDate = data.updated ? formatDate(data.updated): 'Unknown Date';
                    image.print(barlow25, 340, 442, formattedUpdatedDate);
                    y += 30;

                    // Writing date with Barlow font
                    const formattedDate = data.date ? formatDate(data.date): 'Unknown Date';
                    image.print(barlow25, 340, 477, formattedDate);
                    y += 30;

                    const outputPath = `${basePath}/images/social/${mdFolder.substring(1)}/${file.replace('.md', '.png')}`;
                    await image.writeAsync(outputPath);
                    y = 10;
                    totalFiles++;
            }
        }
    }

    const totalTime = Date.now() - startTime;
    console.log(`Total files processed: ${totalFiles}`);
    console.log(`Total errors: ${totalErrors}`);
    console.log(`Total time it took to process: ${totalTime} ms`);
}

processFiles();
