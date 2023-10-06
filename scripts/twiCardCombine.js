const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

// Check for wallet ID argument
if (process.argv.length !== 3) {
    console.error('Please provide a wallet ID.');
    process.exit(1);
}
const wsID = process.argv[2];

(async () => {
    // Load images
    const background = await loadImage('../images/twitterImageBG.png');
    const widget = await loadImage('widget.png');

    // Calculate location of center
    const x = (background.width - widget.width) / 2;
    const y = (background.height - widget.height) / 2;

    // Create canvas
    const canvas = createCanvas(background.width, background.height);
    const ctx = canvas.getContext('2d');

    // Draw images
    ctx.drawImage(background, 0, 0);
    ctx.drawImage(widget, x, y);

    // Save canvas as image with specified filename
    const outputPath = `../images/twcard/${wsID}_twitter_card.png`;
    const out = fs.createWriteStream(outputPath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () =>  console.log(`Image for ${wsID} was created as ${outputPath}.`));
})();
