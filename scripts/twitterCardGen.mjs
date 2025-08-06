import fs from 'fs';
import { createCanvas, loadImage, registerFont } from 'canvas';
import yaml from 'js-yaml';
import path from 'path';
import pLimit from 'p-limit';

const fsp = fs.promises;
const limit = pLimit(8);
const mdFolders = ['_android', '_bearer', '_hardware', '_iphone', '_desktop'];
const backgroundImage = 'images/twCard/new-ws-bg-800x450.png';
let bgImage;
const fallbackIcon = 'images/smallNoicon.png';

const platformNames = {
  android: 'Android',
  iphone: 'iOS', 
  hardware: 'Hardware',
  bearer: 'Bearer Token',
  desktop: 'Desktop'
};

let platformIconImages = {};
let redFlagImage;

async function drawPlatformIcon(ctx, platform, x, y) {
  ctx.save();
  ctx.fillStyle = ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  
  const drawPlatformImage = (img) => {
    const maxSize = 16;
    const aspectRatio = img.width / img.height;
    const [drawWidth, drawHeight] = aspectRatio > 1 
      ? [maxSize, maxSize / aspectRatio] 
      : [maxSize * aspectRatio, maxSize];
    ctx.drawImage(img, x, y - drawHeight/2, drawWidth, drawHeight);
  };
  
  switch (platform) {
    case 'android':
      if (platformIconImages.android) {
        drawPlatformImage(platformIconImages.android);
      } else {
        ctx.beginPath();
        ctx.moveTo(x, y - 8);
        ctx.lineTo(x + 14, y);
        ctx.lineTo(x, y + 8);
        ctx.closePath();
        ctx.fill();
      }
      break;
      
    case 'iphone':
      if (platformIconImages.iphone) {
        drawPlatformImage(platformIconImages.iphone);
      } else {
        ctx.beginPath();
        ctx.arc(x + 6, y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1f1911';
        ctx.beginPath();
        ctx.arc(x + 9, y - 3, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
      
    case 'hardware':
      if (platformIconImages.hardware) {
        drawPlatformImage(platformIconImages.hardware);
      } else {
        ctx.beginPath();
        ctx.rect(x, y - 6, 12, 12);
        ctx.stroke();
        ctx.beginPath();
        ctx.rect(x + 3, y - 8, 6, 4);
        ctx.fill();
      }
      break;
      
    case 'desktop':
      ctx.beginPath();
      ctx.rect(x, y - 6, 14, 10);
      ctx.stroke();
      ctx.beginPath();
      ctx.rect(x + 5, y + 4, 4, 2);
      ctx.fill();
      break;
      
    case 'bearer':
      ctx.beginPath();
      ctx.arc(x + 6, y, 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.font = '8px Barlow';
      ctx.textAlign = 'center';
      ctx.fillText('₿', x + 6, y + 3);
      break;
  }
  ctx.restore();
}

let totalFiles = 0;
const startTime = Date.now();

async function loadResources() {
  bgImage = await loadImage(backgroundImage);
  registerFont('assets/fonts/Barlow/barlow-v12-latin-500.ttf', { family: 'Barlow' });
  
  const iconPaths = [
    ['android', 'images/twCard/play-store.png'],
    ['iphone', 'images/twCard/iphone-store.png'],
    ['hardware', 'images/twCard/hardware-icon.png']
  ];
  
  for (const [platform, path] of iconPaths) {
    try {
      platformIconImages[platform] = await loadImage(path);
      console.log(`[PLATFORM ICONS] ${platform} icon loaded`);
    } catch (error) {
      console.warn(`[PLATFORM ICONS] Could not load ${path}: ${error.message}`);
    }
  }
  
  try {
    redFlagImage = await loadImage('images/twCard/red-flag.png');
    console.log('[RED FLAG] Red flag image loaded');
  } catch (error) {
    console.warn(`[RED FLAG] Could not load red-flag.png: ${error.message}`);
  }
}

function wrapText(text, length) {
  const regex = new RegExp(`(?:(?:\\S{${length}}|.{1,${length}})(?:\\s|$))`, 'g');
  return `${text}`.match(regex) || [];
}

function showProgress() {
  const oldTotalFiles = totalFiles;
  const i = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const processed = oldTotalFiles - totalFiles;
    const rate = processed / (elapsed / 1000);
    const eta = totalFiles / rate;
    console.log(`Processed: ${processed}/${oldTotalFiles}, Rate: ${rate.toFixed(2)}/s, ETA: ${eta.toFixed(0)}s`);
    if (totalFiles === 0) {
      clearInterval(i);
      console.log(`Total time: ${(Date.now() - startTime) / 1000}s`);
    }
  }, 5000);
}

function processFilesTimed() {
  showProgress();
  processFiles();
}

function drawStar(ctx, cx, cy, fillColor = '#ee9e15', strokeColor = 'black', fraction = 1) {
  const spikes = 5, outerRadius = 20, innerRadius = 10, strokeWidth = 3;
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;

  ctx.save();
  ctx.beginPath();
  ctx.rect(cx - outerRadius - strokeWidth, cy - outerRadius - strokeWidth, 2 * (outerRadius + strokeWidth) * fraction, 2 * (outerRadius + strokeWidth));
  ctx.clip();
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);

  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
    rot += step;
  }

  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.lineWidth = strokeWidth;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = strokeColor;
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawStars(ctx, stars, x, y, starSize) {
  for (let i = 0; i < 5; i++) {
    const starX = x + (i * (starSize + 5));
    drawStar(ctx, starX, y, i < stars ? '#ee9e15' : 'transparent', 'black', 1);
  }
}

const ctaPhrases = {
  sourceavailable: [
    { text: "Open source wallet analyzed", cta: "Discover our security findings" },
    { text: "Code transparency verified", cta: "See what we uncovered" },
    { text: "Source code scrutinized", cta: "Read our detailed review" },
    { text: "Open wallet, open analysis", cta: "Explore the verdict" },
    { text: "Security audit complete", cta: "Check our insights" },
    { text: "Transparency confirmed", cta: "Dive into the report" },
    { text: "Code reviewed & verified", cta: "Uncover the details" },
    { text: "Open source deep-dive", cta: "Get the full story" }
  ],
  custodial: [
    { text: "Custodial service analyzed", cta: "Learn the trade-offs" },
    { text: "Third-party custody reviewed", cta: "See our assessment" },
    { text: "Managed wallet evaluated", cta: "Understand the risks" },
    { text: "Professional custody studied", cta: "Get the insights" },
    { text: "Custodial solution scrutinized", cta: "Read our findings" },
    { text: "Managed service reviewed", cta: "Discover what it means" },
    { text: "Third-party wallet assessed", cta: "See the full picture" }
  ],
  metaNotOk: [
    { text: "Wallet status updated", cta: "See what changed" },
    { text: "Service discontinued", cta: "Read the latest" },
    { text: "Important changes detected", cta: "Get the update" },
    { text: "Status evolution tracked", cta: "Learn more" },
    { text: "Service transition noted", cta: "Find out why" }
  ],
  nosource: [
    { text: "Closed source wallet", cta: "See our concerns" },
    { text: "Proprietary code analyzed", cta: "Learn the risks" },
    { text: "Black box wallet reviewed", cta: "Read our take" }
  ]
};

function getCtaPhrase(data) {
  const hash = (data.title || '').split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0) & a, 0);
  
  const phrases = data.meta !== 'ok' ? ctaPhrases.metaNotOk :
    data.verdict === 'sourceavailable' ? ctaPhrases.sourceavailable :
    data.verdict === 'custodial' ? ctaPhrases.custodial :
    data.verdict === 'nosource' ? ctaPhrases.nosource :
    [{ text: "Wallet security analyzed", cta: "Read our review" }];
  
  return phrases[Math.abs(hash) % phrases.length];
}

async function drawOnCanvas(data, iconImage) {
  const width = 800, height = 450;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(bgImage, 0, 0, width, height);

  const iconX = 40, iconY = 190, iconWidth = 150, iconHeight = 150, cornerRadius = 25;
  
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(iconX + cornerRadius, iconY);
  ctx.lineTo(iconX + iconWidth - cornerRadius, iconY);
  ctx.quadraticCurveTo(iconX + iconWidth, iconY, iconX + iconWidth, iconY + cornerRadius);
  ctx.lineTo(iconX + iconWidth, iconY + iconHeight - cornerRadius);
  ctx.quadraticCurveTo(iconX + iconWidth, iconY + iconHeight, iconX + iconWidth - cornerRadius, iconY + iconHeight);
  ctx.lineTo(iconX + cornerRadius, iconY + iconHeight);
  ctx.quadraticCurveTo(iconX, iconY + iconHeight, iconX, iconY + iconHeight - cornerRadius);
  ctx.lineTo(iconX, iconY + cornerRadius);
  ctx.quadraticCurveTo(iconX, iconY, iconX + cornerRadius, iconY);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(iconImage, iconX, iconY, iconWidth, iconHeight);
  ctx.restore();

  const titleX = iconX + iconWidth + 20;
  const titleText = data.title || 'Unknown Title';
  const fontSize = titleText.length < 10 ? '80px' : titleText.length < 20 ? '56px' : '40px';
  let titleY = iconY + 50 + (fontSize === '80px' || fontSize === '56px' ? 20 : 0);
  
  printText(titleText, ctx, titleX, titleY, 'white', `${fontSize} Barlow`, 27, 45);

  const wrappedLines = wrapText(titleText, 27);
  const textEndY = titleY + ((wrappedLines.length - 1) * 45);
  const platformY = textEndY + 35;
  const platformX = titleX;

  if (data.platform && platformNames[data.platform]) {
    await drawPlatformIcon(ctx, data.platform, platformX, platformY - 5);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px Barlow';
    ctx.textAlign = 'left';
    ctx.fillText(platformNames[data.platform], platformX + 20, platformY);
  }

  const ctaY = platformY + 40;
  const ctaX = titleX;
  const ctaPhrase = getCtaPhrase(data);
  
  ctx.fillStyle = '#CCCCCC';
  ctx.font = '18px Barlow';
  ctx.fillText(ctaPhrase.text, ctaX, ctaY);
  
  const mainTextWidth = ctx.measureText(ctaPhrase.text).width;
  const ctaBadgeX = ctaX + mainTextWidth + 15;
  const ctaBadgeY = ctaY - 18;
  
  ctx.font = 'bold 18px Barlow';
  const ctaBadgeWidth = ctx.measureText(ctaPhrase.cta).width + 20;
  const ctaBadgeHeight = 26, ctaBadgeRadius = 13;
  
  ctx.fillStyle = '#ff6b35';
  ctx.beginPath();
  ctx.moveTo(ctaBadgeX + ctaBadgeRadius, ctaBadgeY);
  ctx.lineTo(ctaBadgeX + ctaBadgeWidth - ctaBadgeRadius, ctaBadgeY);
  ctx.quadraticCurveTo(ctaBadgeX + ctaBadgeWidth, ctaBadgeY, ctaBadgeX + ctaBadgeWidth, ctaBadgeY + ctaBadgeRadius);
  ctx.lineTo(ctaBadgeX + ctaBadgeWidth, ctaBadgeY + ctaBadgeHeight - ctaBadgeRadius);
  ctx.quadraticCurveTo(ctaBadgeX + ctaBadgeWidth, ctaBadgeY + ctaBadgeHeight, ctaBadgeX + ctaBadgeWidth - ctaBadgeRadius, ctaBadgeY + ctaBadgeHeight);
  ctx.lineTo(ctaBadgeX + ctaBadgeRadius, ctaBadgeY + ctaBadgeHeight);
  ctx.quadraticCurveTo(ctaBadgeX, ctaBadgeY + ctaBadgeHeight, ctaBadgeX, ctaBadgeY + ctaBadgeHeight - ctaBadgeRadius);
  ctx.lineTo(ctaBadgeX, ctaBadgeY + ctaBadgeRadius);
  ctx.quadraticCurveTo(ctaBadgeX, ctaBadgeY, ctaBadgeX + ctaBadgeRadius, ctaBadgeY);
  ctx.closePath();
  ctx.fill();
  
  ctx.fillStyle = '#1f1911';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(ctaPhrase.cta, ctaBadgeX + (ctaBadgeWidth / 2), ctaBadgeY + (ctaBadgeHeight / 2));
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  
  console.log(`[CTA] Added phrase: "${ctaPhrase.text}" with CTA: "${ctaPhrase.cta}"`);
  console.log(`[CTA] Verdict: ${data.verdict}, Meta: ${data.meta}`);

  if (data.verdict === 'fake' && redFlagImage) {
    const flagScale = 0.3;
    const flagWidth = redFlagImage.width * flagScale;
    const flagHeight = redFlagImage.height * flagScale;
    const flagMargin = 20;
    const flagX = width - flagWidth - flagMargin;
    const flagY = height - flagHeight - flagMargin;
    
    ctx.drawImage(redFlagImage, flagX, flagY, flagWidth, flagHeight);
    console.log('[RED FLAG] Red flag displayed for fake verdict at 30% scale');
  }

  // Add appId watermark in bottom-left corner
  if (data.appId) {
    ctx.save();
    ctx.globalAlpha = 0.1; // 10% opacity
    ctx.fillStyle = '#CCCCCC'; // Light gray
    ctx.font = '12px Barlow';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText(data.appId, 20, height - 20); // 20px margin from left and bottom
    ctx.restore();
  }

  return canvas;
}

function printText(text, ctx, x, y, fillStyle, font, maxLength, lineHeight) {
  const wrapped = wrapText(text, maxLength || 1000);
  ctx.font = font || ctx.font;
  ctx.fillStyle = fillStyle || ctx.fillStyle;
  for (let i = 0; i < wrapped.length; i++) {
    ctx.fillText(wrapped[i], x, y + (i * (lineHeight || 0)));
  }
}

async function processOneFile(platform, mdFilesPath, file, outputFolderPath) {
  const parts = (await fsp.readFile(path.join(mdFilesPath, file), 'utf-8')).split('---');
  let data;
  try {
    data = yaml.load(parts[1]);
  } catch (e) {
    console.log(`processOneFile(${platform}, ${mdFilesPath}, ${file}, ${outputFolderPath})`);
    console.error(e);
    totalFiles--;
    return;
  }

  data.platform = platform;

  let iconImagePath = path.join('images', 'wIcons', platform, `${data.icon}`);
  if (!fs.existsSync(iconImagePath)) {
    iconImagePath = fallbackIcon;
  }

  let iconImage;
  try {
    iconImage = await loadImage(iconImagePath);
  } catch (error) {
    console.error(`Error processing file ${file}: `, error);
    totalFiles--;
    return;
  }

  const canvas = await drawOnCanvas(data, iconImage);
  const dataURL = canvas.toDataURL('image/png');
  const outputPath = `${outputFolderPath}/${file.replace('.md', '.png')}`;
  await fsp.writeFile(outputPath, dataURL.replace(/^data:image\/png;base64,/, ''), 'base64');
  totalFiles--;
}

async function processFiles() {
  const socialImagesFolderPath = 'images/social';
  if (!fs.existsSync(socialImagesFolderPath)) {
    fs.mkdirSync(socialImagesFolderPath);
  }

  const asyncTasks = [];
  for (const mdFolder of mdFolders) {
    const mdFilesPath = mdFolder;
    const platform = mdFolder.substring(1);
    const files = await fsp.readdir(mdFilesPath);
    const outputFolderPath = `images/social/${platform}`;
    if (!fs.existsSync(outputFolderPath)) {
      fs.mkdirSync(outputFolderPath);
    }

    for (const file of files) {
      totalFiles++;
      asyncTasks.push(limit(() => processOneFile(platform, mdFilesPath, file, outputFolderPath)));
    }
  }
  await Promise.all(asyncTasks);
}

loadResources().then(() => {
  processFilesTimed();
});