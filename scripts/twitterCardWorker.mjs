/*
 * Font Installation Requirements for Unicode Support:
 * 
 * # Ubuntu/Debian
 * sudo apt install fonts-noto-cjk fonts-dejavu fonts-liberation
 * 
 * # macOS (already has Arial Unicode MS)
 * brew install --cask font-noto-sans-cjk
 * 
 * # Windows (already has Arial)
 * # Download Noto fonts from Google Fonts
 */

import { parentPort } from 'worker_threads';
import fs from 'fs';
import pkg from '@napi-rs/canvas';
const { createCanvas, loadImage } = pkg;
import yaml from 'js-yaml';
import path from 'path';

const fsp = fs.promises;
const fallbackIcon = 'images/smallNoicon.png';
const platformNames = {
  android: 'Android', iphone: 'iOS', hardware: 'Hardware', bearer: 'Bearer Token', desktop: 'Desktop'
};

// Worker-specific resources (loaded once per worker)
let bgImage, platformIconImages = {}, redFlagImage;

async function loadWorkerResources() {
  try {
    bgImage = await loadImage('images/twCard/new-ws-bg-800x450.png');
    
    // Enhanced font registration for Unicode support
    if (pkg.GlobalFonts?.registerFromPath) {
      try {
        pkg.GlobalFonts.registerFromPath('assets/fonts/Barlow/barlow-v12-latin-500.ttf', 'Barlow');
        console.log('Worker: Barlow font registered successfully');
        
        // Register common system Unicode fonts
        const unicodeFonts = [
          ['/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 'NotoSansCJK'],
          ['/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 'DejaVuSans'],
          ['/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf', 'LiberationSans'],
          ['/System/Library/Fonts/Arial Unicode MS.ttf', 'ArialUnicodeMS'],
          ['C:\\Windows\\Fonts\\arial.ttf', 'Arial']
        ];
        
        let unicodeFontsRegistered = 0;
        for (const [fontPath, fontName] of unicodeFonts) {
          try {
            if (fs.existsSync(fontPath)) {
              pkg.GlobalFonts.registerFromPath(fontPath, fontName);
              console.log(`Worker: Registered Unicode font: ${fontName}`);
              unicodeFontsRegistered++;
            }
          } catch (e) {}
        }
        console.log(`Worker: ${unicodeFontsRegistered} Unicode fonts registered`);
      } catch (error) {
        console.warn(`Worker: Font registration failed: ${error.message}`);
      }
    } else {
      console.warn('Worker: Font registration not available, using system fonts');
    }
    
    const iconPaths = [
      ['android', 'images/twCard/play-store.png'],
      ['iphone', 'images/twCard/iphone-store.png'],
      ['hardware', 'images/twCard/hardware-icon.png']
    ];
    
    for (const [platform, iconPath] of iconPaths) {
      try {
        platformIconImages[platform] = await loadImage(iconPath);
      } catch (error) {
        console.warn(`Worker: Could not load ${platform} icon: ${error.message}`);
      }
    }
    
    try {
      redFlagImage = await loadImage('images/twCard/red-flag.png');
    } catch (error) {
      console.warn(`Worker: Could not load red flag image: ${error.message}`);
    }
  } catch (error) {
    console.error(`Worker: Failed to load resources: ${error.message}`);
    throw error;
  }
}

async function drawPlatformIcon(ctx, platform, x, y) {
  ctx.save();
  ctx.fillStyle = ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  
  if (platformIconImages[platform]) {
    const img = platformIconImages[platform];
    const maxSize = 16;
    const aspectRatio = img.width / img.height;
    const [drawWidth, drawHeight] = aspectRatio > 1 
      ? [maxSize, maxSize / aspectRatio] 
      : [maxSize * aspectRatio, maxSize];
    ctx.drawImage(img, x, y - drawHeight/2, drawWidth, drawHeight);
  } else {
    ctx.beginPath();
    switch (platform) {
      case 'android':
        ctx.moveTo(x, y - 8); ctx.lineTo(x + 14, y); ctx.lineTo(x, y + 8); ctx.closePath(); ctx.fill();
        break;
      case 'iphone':
        ctx.arc(x + 6, y, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#1f1911'; ctx.beginPath(); ctx.arc(x + 9, y - 3, 2, 0, Math.PI * 2); ctx.fill();
        break;
      case 'hardware':
        ctx.rect(x, y - 6, 12, 12); ctx.stroke(); ctx.beginPath(); ctx.rect(x + 3, y - 8, 6, 4); ctx.fill();
        break;
      case 'desktop':
        ctx.rect(x, y - 6, 14, 10); ctx.stroke(); ctx.beginPath(); ctx.rect(x + 5, y + 4, 4, 2); ctx.fill();
        break;
      case 'bearer':
        ctx.arc(x + 6, y, 6, 0, Math.PI * 2); ctx.stroke();
        ctx.font = '8px Barlow'; ctx.textAlign = 'center'; ctx.fillText('₿', x + 6, y + 3);
        break;
    }
  }
  ctx.restore();
}

const wrapText = (text, length) => `${text}`.match(new RegExp(`(?:(?:\\S{${length}}|.{1,${length}})(?:\\s|$))`, 'g')) || [];

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
    ctaPhrases[data.verdict] || [{ text: "Wallet security analyzed", cta: "Read our review" }];
  return phrases[Math.abs(hash) % phrases.length];
}

function printText(text, ctx, x, y, fillStyle, font, maxLength, lineHeight = 0) {
  const wrapped = wrapText(text, maxLength || 1000);
  ctx.fillStyle = fillStyle || ctx.fillStyle;
  
  wrapped.forEach((line, i) => {
    line = line.trim();
    if (line) {
      const fontSize = (font || ctx.font).match(/\d+/)?.[0] || '16';
      const fontWeight = (font || ctx.font).includes('bold') ? 'bold ' : '';
      ctx.font = (font || ctx.font).includes('Barlow') 
        ? `${fontWeight}${fontSize}px Barlow, NotoSansCJK, DejaVuSans, LiberationSans, ArialUnicodeMS, Arial, sans-serif`
        : `${fontWeight}${fontSize}px NotoSansCJK, DejaVuSans, LiberationSans, ArialUnicodeMS, Arial, sans-serif`;
      ctx.fillText(line, x, y + (i * lineHeight));
    }
  });
}

async function drawOnCanvas(data, iconImage) {
  const canvas = createCanvas(800, 450);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(bgImage, 0, 0, 800, 450);

  // Draw clipped icon
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(65, 190); ctx.lineTo(165, 190);
  ctx.quadraticCurveTo(190, 190, 190, 215); ctx.lineTo(190, 315);
  ctx.quadraticCurveTo(190, 340, 165, 340); ctx.lineTo(65, 340);
  ctx.quadraticCurveTo(40, 340, 40, 315); ctx.lineTo(40, 215);
  ctx.quadraticCurveTo(40, 190, 65, 190); ctx.closePath(); ctx.clip();
  ctx.drawImage(iconImage, 40, 190, 150, 150);
  ctx.restore();

  const titleX = 210, titleText = data.title || 'Unknown Title';
  const fontSize = titleText.length < 10 ? '80px' : titleText.length < 20 ? '56px' : '40px';
  const titleY = 240 + (fontSize === '80px' || fontSize === '56px' ? 20 : 0);
  
  printText(titleText, ctx, titleX, titleY, 'white', 
    `${fontSize} Barlow, NotoSansCJK, DejaVuSans, LiberationSans, ArialUnicodeMS, Arial, sans-serif`, 27, 45);

  const wrappedLines = wrapText(titleText, 27);
  const platformY = titleY + ((wrappedLines.length - 1) * 45) + 35;

  // Draw platform icon and text
  if (data.platform && platformNames[data.platform]) {
    await drawPlatformIcon(ctx, data.platform, titleX, platformY - 5);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px Barlow, NotoSansCJK, DejaVuSans, LiberationSans, ArialUnicodeMS, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(platformNames[data.platform], titleX + 20, platformY);
  }

  // Draw CTA section
  const ctaY = platformY + 40, ctaPhrase = getCtaPhrase(data);
  
  ctx.fillStyle = '#CCCCCC';
  ctx.font = '18px Barlow, "Noto Sans", "DejaVu Sans", "Arial Unicode MS", Arial, sans-serif';
  ctx.fillText(ctaPhrase.text, titleX, ctaY);
  
  const mainTextWidth = ctx.measureText(ctaPhrase.text).width;
  const ctaBadgeX = titleX + mainTextWidth + 15, ctaBadgeY = ctaY - 18;
  
  // Draw CTA badge
  ctx.font = 'bold 18px Barlow, NotoSansCJK, DejaVuSans, LiberationSans, ArialUnicodeMS, Arial, sans-serif';
  const ctaBadgeWidth = ctx.measureText(ctaPhrase.cta).width + 20;
  
  ctx.fillStyle = '#ff6b35'; ctx.beginPath();
  ctx.moveTo(ctaBadgeX + 13, ctaBadgeY); ctx.lineTo(ctaBadgeX + ctaBadgeWidth - 13, ctaBadgeY);
  ctx.quadraticCurveTo(ctaBadgeX + ctaBadgeWidth, ctaBadgeY, ctaBadgeX + ctaBadgeWidth, ctaBadgeY + 13);
  ctx.lineTo(ctaBadgeX + ctaBadgeWidth, ctaBadgeY + 13); ctx.lineTo(ctaBadgeX + ctaBadgeWidth, ctaBadgeY + 26);
  ctx.quadraticCurveTo(ctaBadgeX + ctaBadgeWidth, ctaBadgeY + 26, ctaBadgeX + ctaBadgeWidth - 13, ctaBadgeY + 26);
  ctx.lineTo(ctaBadgeX + 13, ctaBadgeY + 26);
  ctx.quadraticCurveTo(ctaBadgeX, ctaBadgeY + 26, ctaBadgeX, ctaBadgeY + 13);
  ctx.lineTo(ctaBadgeX, ctaBadgeY + 13); ctx.quadraticCurveTo(ctaBadgeX, ctaBadgeY, ctaBadgeX + 13, ctaBadgeY);
  ctx.closePath(); ctx.fill();
  
  ctx.fillStyle = '#1f1911'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(ctaPhrase.cta, ctaBadgeX + (ctaBadgeWidth / 2), ctaBadgeY + 13);
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';

  // Draw red flag for fake wallets
  if (data.verdict === 'fake' && redFlagImage) {
    const flagWidth = redFlagImage.width * 0.3, flagHeight = redFlagImage.height * 0.3;
    ctx.drawImage(redFlagImage, 800 - flagWidth - 20, 450 - flagHeight - 20, flagWidth, flagHeight);
  }

  // Draw app ID watermark
  if (data.appId) {
    ctx.save(); ctx.globalAlpha = 0.1; ctx.fillStyle = '#CCCCCC';
    ctx.font = '18px Barlow, NotoSansCJK, DejaVuSans, LiberationSans, ArialUnicodeMS, Arial, sans-serif';
    ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
    ctx.fillText(data.appId, 20, 430); ctx.restore();
  }

  return canvas;
}

async function processCard(cardJob) {
  try {
    const { platform, mdFilesPath, file, outputFolderPath } = cardJob;
    
    // Debug logging for troubleshooting
    if (!mdFilesPath || !file || !platform || !outputFolderPath) {
      throw new Error(`Invalid job parameters: mdFilesPath=${mdFilesPath}, file=${file}, platform=${platform}, outputFolderPath=${outputFolderPath}`);
    }
    
    // Read and parse markdown file
    const content = await fsp.readFile(path.join(mdFilesPath, file), 'utf-8');
    const data = yaml.load(content.split('---')[1]);
    data.platform = platform;

    // Load app icon
    let iconImagePath = fallbackIcon;
    if (data.icon) {
      const proposedPath = path.join('images', 'wIcons', platform, data.icon);
      if (fs.existsSync(proposedPath)) iconImagePath = proposedPath;
    }
    const iconImage = await loadImage(iconImagePath);
    
    // Generate and save card
    const canvas = await drawOnCanvas(data, iconImage);
    const dataURL = canvas.toDataURL('image/png');
    await fsp.writeFile(`${outputFolderPath}/${file.replace('.md', '.png')}`, dataURL.replace(/^data:image\/png;base64,/, ''), 'base64');
    
    return { success: true, file, platform };
  } catch (error) {
    // Log error to file
    fs.appendFileSync('draw-card-error.log', `${new Date().toISOString()} | ${cardJob.platform} | ${cardJob.file} | ${error.message}\n`);
    return { success: false, file: cardJob.file, platform: cardJob.platform, error: error.message };
  }
}

// Initialize worker and listen for jobs
(async () => {
  try {
    await loadWorkerResources();
    parentPort.on('message', async (cardJob) => {
      parentPort.postMessage(await processCard(cardJob));
    });
    parentPort.postMessage({ type: 'ready' });
  } catch (error) {
    parentPort.postMessage({ type: 'error', error: error.message });
  }
})();