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
const barlow30path = path.join(fontBasePath, 'barlow30black', '7R9s0RBr248p1NXogRG5taD4.ttf.fnt');
const barlow27path = path.join(fontBasePath, 'barlow27black', 'wLGmfyMfmpMdLRpomfzsFBfq.ttf.fnt');
const barlow25path = path.join(fontBasePath, 'barlow25black', 'jMYUacOdgyFacfesoWuVlXmp.ttf.fnt');
const barlow25graypath = path.join(fontBasePath, 'barlow25gray', 'dWxVsEOMx8Dxe4UUXvy0leGe.ttf.fnt');
const barlow23path = path.join(fontBasePath, 'barlow23black', '2KWA9EgA5hCXd2SVQJcsZf3Q.ttf.fnt');
const barlow18path = path.join(fontBasePath, 'barlow18black', 'zgfCog9D9HWvpLNyuFjDdXss.ttf.fnt');

const yaml = require('js-yaml');
const verdictMap = {};
const verdictPath = '_data/verdicts';
fs.readdirSync(verdictPath).forEach((filename) => {
  if (filename.endsWith('.yml')) {
    const filePath = path.join(folderPath, filename);
    const verdict = path.parse(filename).name;
    const yamlData = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(yamlData);
    jsonData[verdict] = data.title;
  }
});

//Starting coordinates for text
let x = 100;
let y = 10;

async function processFiles() {
    let totalFiles = 0;
    let totalErrors = 0;
    const startTime = Date.now();

    // Load font within the function
    const barlow30 = await Jimp.loadFont(barlow30path);
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
                try {
                    const content = fs.readFileSync(path.join(mdFilesPath, file), 'utf-8');
                    const titleMatch = content.match(/title: (.*)/) || ['','Unknown Title'];
                    const versionCollect = content.match(/version: (.*)/) || ['','Unknown Version'];
                    const versionMatch = versionCollect[1].replace(/'/g, '');
                    const verdictMatch = content.match(/verdict: (.*)/) || ['','Unknown Verdict'];
                    const developerNameMatch = content.match(/developerName: (.*)/) || ['','Unknown Developer'];
                    const usersMatch = content.match(/users: (.*)/) || ['','Unknown Users'];
                    const releasedMatch = content.match(/released: (.*)/) || ['','Unknown Released Date'];
                    const updatedMatch = content.match(/updated: (.*)/) || ['','Unknown Updated Date'];
                    const dateMatch = content.match(/date: (.*)/) || ['','Unknown Date'];
                    const iconMatch = content.match(/icon: (.*)/) || ['','Unknown Icon'];

                    // Check if any match is null
                    if (!titleMatch || !versionMatch || !verdictMatch || !developerNameMatch || !usersMatch || !releasedMatch || !updatedMatch || !dateMatch || !iconMatch) {
                        throw new Error(`Missing property in file: ${file}`);
                    }
                    const data = {
                        title: titleMatch[1],
                        version: versionMatch,
                        verdict: verdictMatch[1],
                        developerName: developerNameMatch[1],
                        users: usersMatch[1],
                        released: releasedMatch[1],
                        updated: updatedMatch[1],
                        date: dateMatch[1],
                        icon: iconMatch[1]
                    };
                 
                    // calculate the number of lines the title will occupy
                    const titleLineCount = Math.ceil(Jimp.measureText(barlow25, data.title) / 350); // assuming maxWidth is 250 as in your code

                    const iconImage = path.join(basePath, 'images', 'wIcons', mdFolder.substring(1), 'small', `${data.icon}`);
                    const tempImagePath = path.join(basePath, 'tempImage.png');

                    // Overlay icon onto the background using ImageMagick
                    const coords = '+30+130'; 
                    // const tempImagePath = `${basePath}/images/tempImage.png`;
                    await exec(`convert ${backgroundImage} ${iconImage} -geometry +${coords} -composite ${tempImagePath}`);

                    // Load the temporary image for text addition
                    const image = await Jimp.read(tempImagePath);

                    const wrappedTitle = wrapText(data.title || 'Unknown Title', 32); // adjust the length as needed
                    for (let i = 0; i < wrappedTitle.length; i++) {
                        image.print(barlow30, 150, 130 + (i * 40), wrappedTitle[i]);
                    }
                    y += wrappedTitle.length * 40;  // adjust the multiplier as per the font size

                    // Writing version with Barlow font
                    image.print(barlow23, 55, 235, data.version);
                    y += 30; // Increment Y by an estimated height for the next item

                    // Writing verdict with Barlow font
                    const mappedVerdict = verdictMap[data.verdict] || data.verdict;
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
                    image.print(barlow25g, 150, 337, "Developer:");
                    y += 30;

                    image.print(barlow25g, 150, 372, "Downloads:");
                    y += 30;

                    image.print(barlow25g, 150, 407, "Released:");
                    y += 30;

                    image.print(barlow25g, 150, 442, "Latest Release:");
                    y += 30;

                    image.print(barlow25g, 150, 477, "Last Analyzed:");
                    y += 30;

                    // Writing developerName with Barlow font
                    const clippedDeveloperName = data.developerName.length > 15 ? data.developerName.substr(0, 15) + "..." : data.developerName;
                    image.print(barlow25, 340, 337, clippedDeveloperName);
                    y += 30; // Adjust y for the next item, depending on the font size you want.

                    // Writing users with Barlow font
                    image.print(barlow25, 340, 372, `${data.users}`);
                    y += 30;

                    // Writing released date with Barlow font
                    image.print(barlow25, 340, 407, `${data.released}`);
                    y += 30;

                    // Writing updated date with Barlow font
                    image.print(barlow25, 340, 442, `${data.updated}`);
                    y += 30;

                    // Writing date with Barlow font
                    image.print(barlow25, 340, 477, `${data.date}`);
                    y += 30;

                    const outputPath = `${basePath}/images/social/${mdFolder.substring(1)}/${file.replace('.md', '.png')}`;
                    await image.writeAsync(outputPath);
                    y = 10;
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

processFiles();
