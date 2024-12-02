// Import libraries
import fs from 'fs';
import { createCanvas, registerFont } from 'canvas';
import yaml from 'js-yaml';
import path from 'path';
import pLimit from 'p-limit';

// Constants
const fsp = fs.promises;
const limit = pLimit(8); // Allow 8 concurrent async operations
const mdFolders = ['_android', '_hardware']; // MD file folders

// Standard shield.io-like dimensions
const height = 20;
const leftPadding = 8;
const rightPadding = 8;
const fontSize = 11;
const borderRadius = 0;

// Colors
const leftBgColor = '#000000';
const rightBgColorYes = '#44cc11'; // Bright green
const rightBgColorNo = '#e05d44';  // Bright red

// Font configuration
registerFont('assets/fonts/Barlow/barlow-v12-latin-500.ttf', { family: 'Barlow' });

// Timer variables for progress tracking
let totalFiles = 0;
let processedFiles = 0;
const startTime = Date.now();

// Progress Tracking Function
async function showProgress() {
    const i = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const remaining = totalFiles - processedFiles;
        const rate = processedFiles / elapsed;
        console.log(`${elapsed.toFixed(1)}s: ${remaining} files remaining, processed ${processedFiles} at ${rate.toFixed(1)} files/s`);
        
        if (processedFiles >= totalFiles) {
            clearInterval(i);
            console.log(`Finished in ${elapsed.toFixed(1)}s`);
        }
    }, 5000);
}

function measureText(ctx, text) {
    const metrics = ctx.measureText(text);
    return metrics.width;
}

function drawPill(verdict) {
    const leftText = 'reproducible';
    const rightText = verdict === 'reproducible' ? 'yes' : 'no';
    
    // Create canvas context
    const ctx = createCanvas(200, height).getContext('2d');
    ctx.font = `${fontSize}px Barlow`;
    
    // Measure text widths to calculate total width
    const leftWidth = measureText(ctx, leftText) + (2 * leftPadding);
    const rightWidth = measureText(ctx, rightText) + (2 * rightPadding);
    const totalWidth = leftWidth + rightWidth;
    
    // Create final canvas with correct width
    const canvas = createCanvas(totalWidth, height);
    const context = canvas.getContext('2d');
    context.font = `${fontSize}px Barlow`;
    
    // Draw left side
    context.beginPath();
    context.moveTo(borderRadius, 0);
    context.lineTo(leftWidth - borderRadius, 0);
    context.quadraticCurveTo(leftWidth, 0, leftWidth, borderRadius);
    context.lineTo(leftWidth, height - borderRadius);
    context.quadraticCurveTo(leftWidth, height, leftWidth - borderRadius, height);
    context.lineTo(borderRadius, height);
    context.quadraticCurveTo(0, height, 0, height - borderRadius);
    context.lineTo(0, borderRadius);
    context.quadraticCurveTo(0, 0, borderRadius, 0);
    context.fillStyle = leftBgColor;
    context.fill();
    
    // Draw right side
    context.beginPath();
    context.moveTo(leftWidth, borderRadius);
    context.lineTo(leftWidth, height - borderRadius);
    context.quadraticCurveTo(leftWidth, height, leftWidth + borderRadius, height);
    context.lineTo(totalWidth - borderRadius, height);
    context.quadraticCurveTo(totalWidth, height, totalWidth, height - borderRadius);
    context.lineTo(totalWidth, borderRadius);
    context.quadraticCurveTo(totalWidth, 0, totalWidth - borderRadius, 0);
    context.lineTo(leftWidth + borderRadius, 0);
    context.quadraticCurveTo(leftWidth, 0, leftWidth, borderRadius);
    context.fillStyle = verdict === 'reproducible' ? rightBgColorYes : rightBgColorNo;
    context.fill();
    
    // Add text
    context.fillStyle = '#fff';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Left text
    context.fillText(leftText, leftWidth / 2, height / 2);
    
    // Right text
    context.fillText(rightText, leftWidth + (rightWidth / 2), height / 2);
    
    return canvas;
}

async function processOneFile(platform, mdFilesPath, file) {
    const filePath = path.join(mdFilesPath, file);
    const content = await fsp.readFile(filePath, 'utf8');
    
    // Extract front matter
    const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontMatterMatch) {
        console.log(`No front matter found in ${file}`);
        return;
    }
    
    const frontMatter = yaml.load(frontMatterMatch[1]);
    if (!frontMatter || !frontMatter.verdict) {
        console.log(`No verdict found in ${file}`);
        return;
    }
    
    // Generate output path
    const fileName = path.parse(file).name;
    const outputDir = path.join(process.cwd(), 'images', 'pills', platform);
    const outputPath = path.join(outputDir, `${fileName}.png`);
    
    // Ensure output directory exists
    await fsp.mkdir(outputDir, { recursive: true });
    
    // Generate and save the pill image
    const canvas = drawPill(frontMatter.verdict);
    const buffer = canvas.toBuffer('image/png');
    await fsp.writeFile(outputPath, buffer);
    
    processedFiles++;
    console.log(`Generated pill for ${file} with verdict: ${frontMatter.verdict}`);
}

async function processFiles() {
    for (const folder of mdFolders) {
        const mdFilesPath = path.join(process.cwd(), folder);
        
        try {
            const files = await fsp.readdir(mdFilesPath);
            const mdFiles = files.filter(file => file.endsWith('.md'));
            
            totalFiles += mdFiles.length;
            console.log(`Found ${mdFiles.length} markdown files in ${folder}`);
            
            const promises = mdFiles.map(file =>
                limit(() => processOneFile(folder.slice(1), mdFilesPath, file))
            );
            
            await Promise.all(promises);
        } catch (error) {
            console.error(`Error processing folder ${folder}:`, error);
        }
    }
}

async function processFilesTimed() {
    console.log('Starting pill badge generation...');
    showProgress();
    await processFiles();
}

processFilesTimed();
