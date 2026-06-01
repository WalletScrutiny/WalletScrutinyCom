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
import { buildVerificationIndex, getReproducibilityHistory } from './nostrVerificationIndex.mjs';

const fsp = fs.promises;
const REPRODUCIBLE_GREEN = '#22c55e';
const NOT_REPRODUCIBLE_RED = '#ef4444';
// Most recent verification statuses to show on each card (history is oldest-to-newest).
const MAX_REPRODUCIBILITY_SQUARES = 12;
const fallbackIcon = 'images/smallNoicon.png';
const platformNames = {
  android: 'Android', iphone: 'iOS', mobile: 'Mobile', hardware: 'Hardware', bearer: 'Bearer Token', desktop: 'Desktop'
};

// Worker-specific resources (loaded once per worker)
let bgImage, platformIconImages = {}, redFlagImage, verificationIndex;

async function loadWorkerResources() {
  verificationIndex = buildVerificationIndex();
  bgImage = await loadImage('images/twCard/new-ws-bg-800x450.png');
  
  if (pkg.GlobalFonts?.registerFromPath) {
    try {
      pkg.GlobalFonts.registerFromPath('assets/fonts/Barlow/barlow-v12-latin-500.ttf', 'Barlow');
      
      // Bundled Unicode fonts for consistent rendering across all systems
      const bundledFonts = [
        ['assets/fonts/Noto/NotoSansCJK-Regular.ttc', 'NotoSansCJK'],
        ['assets/fonts/DejaVu/DejaVuSans.ttf', 'DejaVuSans'],
        ['assets/fonts/Liberation/LiberationSans-Regular.ttf', 'LiberationSans']
      ];

      for (const [fontPath, fontName] of bundledFonts) {
        pkg.GlobalFonts.registerFromPath(fontPath, fontName);
      }
    } catch (error) {
      console.warn(`Worker: Font registration failed: ${error.message}`);
    }
  }

  const iconPaths = [
    ['android', 'images/twCard/play-store.png'],
    ['iphone', 'images/twCard/iphone-store.png'],
    ['hardware', 'images/twCard/hardware-icon.png'],
    ['desktop', 'images/twCard/desktop-icon.png'],
    ['bearer', 'images/twCard/bearer-icon.png']
  ];
  
  for (const [platform, iconPath] of iconPaths) {
    platformIconImages[platform] = await loadImage(iconPath);
  }
  
  redFlagImage = await loadImage('images/twCard/red-flag.png');
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
  }

  ctx.restore();
}

function drawReproducibilityBar(ctx, x, y, statuses) {
  const label = 'Verification history:';
  const squareSize = 12;
  const gap = 3;

  ctx.fillStyle = '#CCCCCC';
  ctx.font = '16px Barlow, NotoSansCJK, DejaVuSans, LiberationSans, ArialUnicodeMS, Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(label, x, y);

  let squareX = x + ctx.measureText(`${label} `).width;
  const squareY = y - squareSize + 3;

  for (const status of statuses) {
    ctx.fillStyle = status === 'reproducible' ? REPRODUCIBLE_GREEN : NOT_REPRODUCIBLE_RED;
    ctx.fillRect(squareX, squareY, squareSize, squareSize);
    squareX += squareSize + gap;
  }
}

const wrapText = (text, length) => `${text}`.match(new RegExp(`(?:(?:\\S{${length}}|.{1,${length}})(?:\\s|$))`, 'g')) || [];

const ctaPhrases = {
  sourceavailable: [
    { text: "Open source wallet analyzed", cta: "Discover our security findings" },
    { text: "Open source wallet analyzed", cta: "See what we uncovered" },
    { text: "Open source wallet analyzed", cta: "Read our detailed review" },
    { text: "Open source wallet analyzed", cta: "Explore the verdict" }
  ],
  custodial: [
    { text: "Custodial wallet analyzed", cta: "Learn the trade-offs" },
    { text: "Custodial wallet analyzed", cta: "See our assessment" },
    { text: "Custodial wallet analyzed", cta: "Understand the risks" },
    { text: "Custodial wallet analyzed", cta: "Get the insights" }
  ],
  metaNotOk: [
    { text: "Wallet status updated", cta: "See what changed" },
    { text: "Wallet status updated", cta: "Read the latest" },
    { text: "Wallet status updated", cta: "Get the update" }
  ],
  nosource: [
    { text: "Closed source wallet analyzed", cta: "See our concerns" },
    { text: "Closed source wallet analyzed", cta: "Learn the risks" },
    { text: "Closed source wallet analyzed", cta: "Read our take" }
  ]
};

// Generate a stable hash from the wallet title.
// This ensures the same wallet title always gets the same CTA phrase
// instead of picking randomly each run, while still varying between wallets.
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

  const hasReproducibility = data.verdict === 'sourceavailable'
    && data.reproducibilityStatuses?.length > 0;

  // Draw CTA section
  const ctaY = platformY + 40;
  const ctaPhrase = getCtaPhrase(data);
  
  ctx.fillStyle = '#CCCCCC';
  ctx.font = '18px Barlow, "Noto Sans", "DejaVu Sans", "Arial Unicode MS", Arial, sans-serif';
  ctx.fillText(ctaPhrase.text, titleX, ctaY);
  
  const mainTextWidth = ctx.measureText(ctaPhrase.text).width;
  const ctaBadgeX = titleX + mainTextWidth + 15, ctaBadgeY = ctaY - 18;
  
  // Draw Call to Action (CTA) rounded rectangle badge 
  ctx.font = 'bold 18px Barlow, NotoSansCJK, DejaVuSans, LiberationSans, ArialUnicodeMS, Arial, sans-serif';
  const ctaBadgeWidth = ctx.measureText(ctaPhrase.cta).width + 20;
  
  ctx.fillStyle = '#F5E4C3'; ctx.beginPath();
  ctx.moveTo(ctaBadgeX + 13, ctaBadgeY); ctx.lineTo(ctaBadgeX + ctaBadgeWidth - 13, ctaBadgeY);
  ctx.quadraticCurveTo(ctaBadgeX + ctaBadgeWidth, ctaBadgeY, ctaBadgeX + ctaBadgeWidth, ctaBadgeY + 13);
  ctx.quadraticCurveTo(ctaBadgeX + ctaBadgeWidth, ctaBadgeY + 26, ctaBadgeX + ctaBadgeWidth - 13, ctaBadgeY + 26);
  ctx.lineTo(ctaBadgeX + 13, ctaBadgeY + 26);
  ctx.quadraticCurveTo(ctaBadgeX, ctaBadgeY + 26, ctaBadgeX, ctaBadgeY + 13);
  ctx.lineTo(ctaBadgeX, ctaBadgeY + 13); ctx.quadraticCurveTo(ctaBadgeX, ctaBadgeY, ctaBadgeX + 13, ctaBadgeY);
  ctx.closePath(); ctx.fill();
  
  ctx.fillStyle = '#1f1911'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(ctaPhrase.cta, ctaBadgeX + (ctaBadgeWidth / 2), ctaBadgeY + 13);
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';

  if (hasReproducibility) {
    drawReproducibilityBar(ctx, titleX, ctaY + 35, data.reproducibilityStatuses);
  }

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
    
    if (!mdFilesPath || !file || !platform || !outputFolderPath) {
      throw new Error(`Invalid job parameters: mdFilesPath=${mdFilesPath}, file=${file}, platform=${platform}, outputFolderPath=${outputFolderPath}`);
    }
    
    const content = await fsp.readFile(path.join(mdFilesPath, file), 'utf-8');
    const fm = yaml.load(content.split('---')[1]);
    const slug = file.replace(/\.md$/i, '');
    const data = platform === 'mobile'
      ? {
          title: fm.title,
          verdict: fm.android?.verdict || fm.iphone?.verdict || fm.verdict,
          verdictAndroid: fm.android?.verdict || '',
          verdictIphone: fm.iphone?.verdict || '',
          meta: fm.android?.meta || fm.iphone?.meta || fm.meta,
          platform: 'mobile',
          appId: fm.android?.appId || fm.iphone?.appId || slug,
          icon: fm.android?.icon || fm.iphone?.icon,
        }
      : { ...fm, platform };

    const isSourceAvailable = platform === 'mobile'
      ? (fm.android?.verdict === 'sourceavailable' || fm.iphone?.verdict === 'sourceavailable')
      : data.verdict === 'sourceavailable';
    if (isSourceAvailable) {
      const reproAppId = platform === 'mobile'
        ? (fm.android?.verdict === 'sourceavailable' ? fm.android?.appId : fm.iphone?.appId)
        : data.appId;
      const reproPlatform = platform === 'mobile'
        ? (fm.android?.verdict === 'sourceavailable' ? 'android' : 'iphone')
        : platform;
      if (reproAppId) {
        const history = getReproducibilityHistory(verificationIndex, reproAppId, reproPlatform);
        data.reproducibilityStatuses = history.slice(-MAX_REPRODUCIBILITY_SQUARES);
      }
    }

    let iconImagePath = fallbackIcon;
    if (data.icon) {
      const iconPlatform = platform === 'mobile'
        ? (fm.android?.icon ? 'android' : 'iphone')
        : platform;
      const proposedPath = path.join('images', 'wIcons', iconPlatform, data.icon);
      if (fs.existsSync(proposedPath)) iconImagePath = proposedPath;
    }
    const iconImage = await loadImage(iconImagePath);
    
    const canvas = await drawOnCanvas(data, iconImage);
    const dataURL = canvas.toDataURL('image/png');
    await fsp.writeFile(`${outputFolderPath}/${file.replace('.md', '.png')}`, dataURL.replace(/^data:image\/png;base64,/, ''), 'base64');
    
    return { success: true, file, platform };
  } catch (error) {
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