const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const Jimp = require('jimp');
const path = require('path');

const mdFolders = ['_android', '_bearer', '_hardware', '_iphone']; // MD files folders
const basePath = path.join(__dirname, '..');
const backgroundImage = path.join(basePath, 'images', 'twCard', 'twitterImageBG600x600.jpg');
const iconsBasePath = path.join(basePath, 'images', 'wIcons'); // Icons base path 
const barlowFontPath = path.join(basePath, 'assets', 'fonts', 'Barlow', 'barlow-fnt', 'barlow.fnt');

const verdictMap = {
    'custodial': 'Custodial: The provider holds the keys',
    'diy': 'DIY: Do-It-Yourself Project',
    'fake': 'Fake: The product mimics a popular competitor!',
    'fewusers': 'Few users: This product has too few users for now to be reviewed in detail.',
    'ftbfs': 'FTBFS: Failed to build from source provided!',
    'nobinary': 'No Binary: This product comes without a binary.',
    'nobtc': 'No BTC: This wallet does not support Bitcoin.',
    'noita': 'Bad Interface: The device interface does not let you verify what is being signed',
    'nonverifiable': 'Not reproducible from source provided',
    'nosendreceive': 'No sending or receiving bitcoins',
    'nosource': 'No source for current release found',
    'nowallet': 'Not an actual wallet',
    'obfuscated': 'Obfuscated: The binary contains active obfuscation',
    'obsolete': 'Obsolete: Not updated in a long time',
    'outdated': 'Outdated: Review might be outdated',
    'plainkey': 'Leaks Keys: This device requires sharing private key material!',
    'prefilled': 'Prefilled: The device is delivered with the private keys as defined by the provider!',
    'reproducible': 'Reproducible when tested',
    'sealed-noita': 'Transactions are signed blindly',
    'sealed-plainkey': 'Sealed Plainkey: Keys are sealed at first, but may be shared when spending',
    'unreleased': 'Un-Released!',
    'vapor': 'Vaporware!',
    'wip': 'Review is Work in Progress'
}

//Starting coordinates for text
let x = 100;
let y = 10;

async function processFiles() {
    let totalFiles = 0;
    let totalErrors = 0;
    const startTime = Date.now();

    // Load font within the function
    const barlowFont = await Jimp.loadFont(barlowFontPath);

    for (let mdFolder of mdFolders) {
        const mdFilesPath = path.join(basePath, mdFolder); // MD files path
        const iconsPath = path.join(iconsBasePath, mdFolder.substring(1), 'small'); // Icons path

        const files = fs.readdirSync (mdFilesPath);
        for (let file of files) {
            if (file.endsWith('.md')) {
                console.log(`Processing file: ${file}`); // Added log
                try {
                    const content = fs.readFileSync(path.join(mdFilesPath, file), 'utf-8');
                    const titleMatch = content.match(/title: (.*)/) || ['','Unknown Title'];
                    const versionMatch = content.match(/version: (.*)/) || ['','Unknown Version'];
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
                        version: versionMatch[1],
                        verdict: verdictMatch[1],
                        developerName: developerNameMatch[1],
                        users: usersMatch[1],
                        released: releasedMatch[1],
                        updated: updatedMatch[1],
                        date: dateMatch[1],
                        icon: iconMatch[1]
                    };

                    const iconImage = path.join(basePath, 'images', 'wIcons', mdFolder.substring(1), 'small', `${data.icon}`);
                    const tempImagePath = path.join(basePath, 'tempImage.png');

                    // Overlay icon onto the background using ImageMagick
                    const coords = '+60+130'; 
                    // const tempImagePath = `${basePath}/images/tempImage.png`;
                    await exec(`convert ${backgroundImage} ${iconImage} -geometry +${coords} -composite ${tempImagePath}`);
                    
                    // Load the temporary image for text addition
                    const image = await Jimp.read(tempImagePath);

                    // Writing title with Barlow font
                    image.print(barlowFont, 175, 130, { text: data.title, alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT, maxWidth: 350 });
                    y += 60;  // Increment Y by the height of the title font for the next item

                    // Writing version with Barlow font
                    image.print(barlowFont, 175, 175, data.version);
                    y += 30; // Increment Y by an estimated height for the next item

                    // Writing verdict with Barlow font
                    const wrappedVerdict = verdictMap[data.verdict] || data.verdict; // Fallback to data.verdict if not found in map
                    image.print(barlowFont, 175, 215, { text: wrappedVerdict, alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT, maxWidth: 500 });
                    y += 60;  // Increment Y by an estimated height for the wrapped verdict

                    // Writing developerName with Barlow font
                    image.print(barlowFont, 175, 255, { text: data.developerName, alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT, maxWidth: 500 });
                    y += 60;  // Increment Y by an estimated height for the wrapped developer name

                    // Writing users with Barlow font
                    image.print(barlowFont, 175, 295, `Users: ${data.users}`);
                    y += 30;

                    // Writing released date with Barlow font
                    image.print(barlowFont, 175, 335, `Released: ${data.released}`);
                    y += 30;

                    // Writing updated date with Barlow font
                    image.print(barlowFont, 175, 375, `Updated: ${data.updated}`);
                    y += 30;

                    // Writing date with Barlow font
                    image.print(barlowFont, 175, 415, `Date: ${data.date}`);
                    y += 30;

                    const outputPath = `${basePath}/images/social/${mdFolder.substring(1)}/${file.replace('.md', '.png')}`;
                    await image.writeAsync(outputPath);
                    y = 10;
                    totalFiles++;
                } catch (err) {
                    console.log(`Error processing file: ${file}. Error: ${err.message}`); // Added log
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
