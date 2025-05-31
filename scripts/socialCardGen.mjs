// Import libraries
import fs from 'fs';
import { createCanvas, loadImage, registerFont } from 'canvas';
import yaml from 'js-yaml';
import path from 'path';
import pLimit from 'p-limit';
import getColors from 'get-image-colors'; // Added for dynamic gradient
import Color from 'color'; // Added for color manipulation
import { nostrConnect, getAllAssetInformation } from '../src/verifications_utils.mjs';

// Constants
const fsp = fs.promises;
const CACHE_FILE_PATH = path.join('scripts', '.nostr_events_cache.json'); // Cache file in scripts directory
const CACHE_MAX_AGE_HOURS = 12; // Cache data for 12 hours
const limit = pLimit(8); // Allow 8 concurrent async operations
const mdFolders = [
  '_android',
  '_bearer',
  '_hardware',
  '_iphone',
  '_desktop']; // MD file folders
// const backgroundImage = 'images/twCard/twitterImageBG800x450.png'; // Removed static background
let reproducibleImage;
// Load the "reproducible" image
const reproducibleImagePath = 'images/twCard/reproducible-dark.png';
const fallbackIcon = 'images/smallNoicon.png';
function loadVerdicts(directoryPath) {
  const verdicts = new Map();
  try {
    const files = fs.readdirSync(directoryPath); // Using sync version for simplicity at startup
    for (const file of files) {
      if (path.extname(file) === '.yml') {
        const filePath = path.join(directoryPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const verdictKey = path.basename(file, '.yml');
        verdicts.set(verdictKey, yaml.load(fileContent));
      }
    }
  } catch (error) {
    console.error(`Error loading verdicts from ${directoryPath}:`, error);
    // Consider whether to throw error or return empty/partial map based on criticality
  }
  return verdicts;
}

const verdictMap = loadVerdicts('_data/verdicts');

// --- New Constants from testscript.mjs design ---
const CANVAS_IMG_WIDTH = 800; // Standard Twitter card width
const CANVAS_IMG_HEIGHT = 450; // Standard Twitter card height

const NUM_COLORS_FOR_GRADIENT = 4; // Colors for the freeform gradient on the card
const FREEFORM_GRADIENT_ALPHA_ON_CARD = 0.7; // Alpha for individual radial gradients on the card

const CARD_PADDING = 20; // Padding around the main content card
const CARD_CORNER_RADIUS = 20;
const PADDING_AREA_OPACITY = 0.1; // 90% transparent for the area around the card

const ICON_ON_CARD_SIZE = 75; // Size of the app's icon to draw on its card (was 75 in original)
const ICON_ON_CARD_MARGIN_TOP = 25; // Margin from the top of the card to the icon
const ICON_ON_CARD_MARGIN_LEFT = 25; // Margin from the left of the card to the icon

// Global variables
let allNostrVerificationInfo = { verifications: new Map(), assets: new Map() }; // Initialize with empty Maps
let totalFiles = 0;

// --- Helper functions from testscript.mjs ---
function filterAndSelectColors(colors, count) {
  const selectedColors = [];
  if (!colors || colors.length === 0) return selectedColors;
  for (const color of colors) {
    const c = Color(color.hex());
    if (c.luminosity() < 0.1 || c.luminosity() > 0.9) continue;
    if (c.saturationl() < 25) continue;
    selectedColors.push(c);
    if (selectedColors.length >= count) break;
  }
  if (selectedColors.length === 0 && colors.length > 0) {
    console.log("No highly vibrant colors for freeform, using top colors from palette.");
    for (let i = 0; i < Math.min(colors.length, count); i++) {
      selectedColors.push(Color(colors[i].hex()));
    }
  }
  return selectedColors;
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
// Function to wrap text to fit within a specified width
function wrapText(text, maxWidth) {
  if (!text) return [''];
  const words = text.toString().split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach(word => {
    const testLine = currentLine.length === 0 ? word : `${currentLine} ${word}`;
    if (testLine.length <= maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });
  
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }
  
  return lines;
}

// Function to format date or return 'Unknown' if not available
function dateOrUnknown(date) {
  return date || 'Unknown';
}

// Function to draw star rating
function drawStars(ctx, stars, x, y, size) {
  if (!stars || isNaN(parseInt(stars))) return;
  
  const starCount = parseInt(stars);
  const maxStars = 5;
  const starSpacing = size * 1.2;
  
  for (let i = 0; i < maxStars; i++) {
    // Draw star outline
    ctx.fillStyle = i < starCount ? '#FFD700' : '#D3D3D3';
    
    // Draw a simple star shape
    ctx.beginPath();
    const centerX = x + i * starSpacing;
    const centerY = y;
    const spikes = 5;
    const outerRadius = size / 2;
    const innerRadius = outerRadius * 0.4;
    
    for (let j = 0; j < spikes * 2; j++) {
      const radius = j % 2 === 0 ? outerRadius : innerRadius;
      const angle = (j * Math.PI) / spikes - Math.PI / 2;
      const pointX = centerX + radius * Math.cos(angle);
      const pointY = centerY + radius * Math.sin(angle);
      
      if (j === 0) {
        ctx.moveTo(pointX, pointY);
      } else {
        ctx.lineTo(pointX, pointY);
      }
    }
    
    ctx.closePath();
    ctx.fill();
  }
}

// Function to overlay the reproducible image
function overlayReproducibleImage(ctx, cardX, cardY, cardWidth, cardHeight) {
  if (!reproducibleImage) {
    console.warn('Reproducible image not loaded, skipping overlay');
    return;
  }
  
  // Position in bottom right corner with some padding
  const overlayWidth = 100;
  const overlayHeight = 100;
  const overlayX = cardX + cardWidth - overlayWidth - 20;
  const overlayY = cardY + cardHeight - overlayHeight - 20;
  
  ctx.globalAlpha = 0.8; // Semi-transparent
  ctx.drawImage(reproducibleImage, overlayX, overlayY, overlayWidth, overlayHeight);
  ctx.globalAlpha = 1.0; // Reset alpha
}

// Helper to compare semantic versions like "1.2.3"
function compareVersions(a, b) {
  if (!a || !b) return 0; // Handle cases where versions might be undefined
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = pa[i] || 0;
    const nb = pb[i] || 0;
    if (na > nb) return 1;
    if (na < nb) return -1;
  }
  return 0;
}

// Function to get the latest attestation status, version, date, and total count for an app from Nostr data
function getNostrAttestationSummaryForApp(nostrData, appId) {
  if (!nostrData || (!nostrData.verifications && !nostrData.assets)) {
    console.warn(`Nostr data is missing or incomplete for ${appId}`);
    return null;
  }

  let latestVerificationEvent = null;
  let maxVersion = null;
  let attestationCount = 0;

  // Combine verifications and assets for searching
  // getAllAssetInformation returns Maps, so we use .values()
  const allEventsArrays = [];
  if (nostrData.verifications instanceof Map) {
    allEventsArrays.push(...Array.from(nostrData.verifications.values()).flat());
  }
  if (nostrData.assets instanceof Map) {
    allEventsArrays.push(...Array.from(nostrData.assets.values()).flat());
  }

  for (const event of allEventsArrays) {
    if (!event || !event.tags) continue;
    const eventAppIdTag = event.tags.find(tag => tag[0] === 'i');
    const eventVersionTag = event.tags.find(tag => tag[0] === 'version');

    if (eventAppIdTag && eventAppIdTag[1] === appId) {
      attestationCount++; // Count all events for this appId
      if (eventVersionTag) { // Only consider for 'latest' if it has a version
        const currentVersion = eventVersionTag[1];
        if (!maxVersion || compareVersions(currentVersion, maxVersion) > 0) {
          maxVersion = currentVersion;
          latestVerificationEvent = event;
        }
      }
    }
  }

  if (latestVerificationEvent) {
    const statusTag = latestVerificationEvent.tags.find(tag => tag[0] === 'status');
    return {
      latestStatus: statusTag ? statusTag[1] : 'unknown',
      latestVersion: maxVersion,
      latestDate: new Date(latestVerificationEvent.created_at * 1000).toISOString().split('T')[0],
      attestationCount: attestationCount,
      latestRawEvent: latestVerificationEvent.rawEvent ? latestVerificationEvent.rawEvent() : latestVerificationEvent
    };
  } else if (attestationCount > 0) {
    // We found attestations, but none suitable to be 'latest' (e.g. no version tag)
    return {
      latestStatus: null,
      latestVersion: null,
      latestDate: null,
      attestationCount: attestationCount,
      latestRawEvent: null
    };
  }
  return {
    latestStatus: null,
    latestVersion: null,
    latestDate: null,
    attestationCount: 0,
    latestRawEvent: null
  };
}

// Helper function to check cache freshness based on 'fetchedAt' timestamp in the JSON
async function isCacheFresh(filePath, maxAgeHours) {
  try {
    const fileContent = await fsp.readFile(filePath, 'utf-8');
    const cachedData = JSON.parse(fileContent);
    if (!cachedData.fetchedAt) {
      console.log('Cache file missing fetchedAt timestamp. Considering stale.');
      return false;
    }
    const fetchedAtMs = new Date(cachedData.fetchedAt).getTime();
    const cacheAgeMs = Date.now() - fetchedAtMs;
    const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
    if (cacheAgeMs < maxAgeMs) {
      console.log(`Cache is fresh. Data fetched at: ${cachedData.fetchedAt}, Age: ${(cacheAgeMs / (60 * 60 * 1000)).toFixed(2)} hours.`);
      return true;
    }
    console.log(`Cache is stale. Data fetched at: ${cachedData.fetchedAt}, Age: ${(cacheAgeMs / (60 * 60 * 1000)).toFixed(2)} hours.`);
    return false;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('Cache file not found.');
    } else {
      console.warn('Error checking cache freshness (reading/parsing):', error.message);
    }
    return false;
  }
}

// Helper to serialize Nostr data (Maps of NDKEvent arrays to Objects of rawEvent arrays)
function serializeNostrDataForCache(nostrData) {
  const serializable = {
    verifications: {},
    assets: {},
    fetchedAt: new Date().toISOString() // Add timestamp of when data was fetched
  };
  if (nostrData && nostrData.verifications instanceof Map) {
    for (const [key, eventsArray] of nostrData.verifications) {
      serializable.verifications[key] = eventsArray.map(event => event.rawEvent ? event.rawEvent() : event);
    }
  }
  if (nostrData && nostrData.assets instanceof Map) {
    for (const [key, eventsArray] of nostrData.assets) {
      serializable.assets[key] = eventsArray.map(event => event.rawEvent ? event.rawEvent() : event);
    }
  }
  return serializable;
}

// Helper to deserialize cached data (Objects of rawEvent arrays back to Maps of rawEvent arrays)
function deserializeNostrDataFromCache(cachedJson) {
  const deserialized = {
    verifications: new Map(),
    assets: new Map(),
    fetchedAt: cachedJson.fetchedAt
  };
  if (cachedJson.verifications) {
    for (const [key, eventsArray] of Object.entries(cachedJson.verifications)) {
      deserialized.verifications.set(key, eventsArray); // eventsArray already contains raw event objects
    }
  }
  if (cachedJson.assets) {
    for (const [key, eventsArray] of Object.entries(cachedJson.assets)) {
      deserialized.assets.set(key, eventsArray); // eventsArray already contains raw event objects
    }
  }
  return deserialized;
}

async function loadResources () {
  // Use Barlow fonts instead of Ubuntu (which are not available)
  registerFont('assets/fonts/Barlow/barlow-v12-latin-600.ttf', { family: 'Barlow', weight: 'bold' });
  registerFont('assets/fonts/Barlow/barlow-v12-latin-regular.ttf', { family: 'Barlow', weight: 'normal' });
  
  // Load the reproducible image
  try {
    reproducibleImage = await loadImage(reproducibleImagePath);
  } catch (error) {
    console.warn(`Could not load reproducible image from ${reproducibleImagePath}: ${error.message}`);
    // Continue without the image
  }
  
  // Fetch Nostr verification information
  try {
    allNostrVerificationInfo = await getAllAssetInformation(); // Fetch all data once
  } catch (error) {
    console.warn(`Could not load Nostr verification information: ${error.message}`);
    // Continue with empty verification info
    allNostrVerificationInfo = { verifications: new Map(), assets: new Map() };
  }
}

// Core Functions - Canvas Image and Text Overlays

async function drawOnCanvas(data, appIconForCard, iconPalette) {
  // Width and Heights variables for canvas
  const width = CANVAS_IMG_WIDTH;
  const height = CANVAS_IMG_HEIGHT;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 1. Fill entire canvas with highly transparent white (this is the "padding" area)
  ctx.fillStyle = `rgba(255, 255, 255, ${PADDING_AREA_OPACITY})`;
  ctx.fillRect(0, 0, width, height);

  // --- Define Card Dimensions ---
  const cardX = CARD_PADDING;
  const cardY = CARD_PADDING;
  const cardWidth = width - (2 * CARD_PADDING);
  const cardHeight = height - (2 * CARD_PADDING);

  // --- Prepare for drawing the card ---
  ctx.save(); // Save context state before clipping and shadow

  // 2. Apply subtle shadow for the card
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;

  drawRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, CARD_CORNER_RADIUS);
  ctx.fillStyle = 'white'; // Temp fill for shadow casting
  ctx.fill();
  
  ctx.shadowColor = 'transparent'; // Reset shadow
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // 3. Clip to the card's rounded rectangle area
  drawRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, CARD_CORNER_RADIUS); // Re-draw path for clipping
  ctx.clip();

  // --- Draw WalletScrutiny-style Gradient INSIDE the card ---
  ctx.globalAlpha = 1.0;
  
  // Get colors from the icon palette
  const vibrantColorsForCardGradient = filterAndSelectColors(iconPalette, NUM_COLORS_FOR_GRADIENT);
  if (vibrantColorsForCardGradient.length > 0) {
    const selectedColor = vibrantColorsForCardGradient[0];
    
    // Create a very light version of the selected color for the base
    // Based on the Blockstream Green card analysis, we need to make it much lighter (90%)
    // and more desaturated (70%) to match the frontpage style
    const baseColor = selectedColor.lighten(0.9).desaturate(0.7);
    ctx.fillStyle = baseColor.rgb().string();
    ctx.fillRect(cardX, cardY, cardWidth, cardHeight);
    
    // Create a subtle vertical gradient that's slightly lighter at the top
    // and slightly darker at the bottom (matching the color progression in the Green card)
    const verticalGradient = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardHeight);
    
    // Lighter at the top (like def5eb in the Green card)
    verticalGradient.addColorStop(0, selectedColor.lighten(0.92).desaturate(0.75).rgb().string());
    
    // Middle tone (like ceefe1 in the Green card)
    verticalGradient.addColorStop(0.5, selectedColor.lighten(0.9).desaturate(0.7).rgb().string());
    
    // Slightly darker at the bottom (like bae9d5 in the Green card)
    verticalGradient.addColorStop(1, selectedColor.lighten(0.88).desaturate(0.65).rgb().string());
    
    ctx.fillStyle = verticalGradient;
    ctx.fillRect(cardX, cardY, cardWidth, cardHeight);
    
    // Add a very subtle radial gradient to create the soft glow effect
    // This creates the slight color difference between center and edges
    const radialGradient = ctx.createRadialGradient(
      cardX + cardWidth/2, cardY + cardHeight/2, 0,  // Start from the center
      cardX + cardWidth/2, cardY + cardHeight/2, cardWidth  // Extend outward
    );
    
    // Very subtle color in the center (almost imperceptible)
    radialGradient.addColorStop(0, selectedColor.lighten(0.89).desaturate(0.68).alpha(0.3).rgb().string());
    
    // Fade to transparent
    radialGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = radialGradient;
    ctx.fillRect(cardX, cardY, cardWidth, cardHeight);
    
    // Add a creative accent: vibrant radial gradient from bottom right
    // Find the two most vibrant colors in the icon palette
    let vibrantColors = [];
    
    if (iconPalette && iconPalette.length > 0) {
      // Create an array of colors with their saturation values
      const colorSaturationPairs = [];
      
      for (const color of iconPalette) {
        const c = Color(color.hex());
        const saturation = c.saturationl();
        const luminosity = c.luminosity();
        
        // Skip very dark or very light colors
        if (luminosity < 0.1 || luminosity > 0.9) continue;
        
        // Only consider colors with decent saturation
        if (saturation > 20) {
          colorSaturationPairs.push({ color: c, saturation: saturation });
        }
      }
      
      // Sort by saturation (highest first)
      colorSaturationPairs.sort((a, b) => b.saturation - a.saturation);
      
      // Take the top two most vibrant colors
      vibrantColors = colorSaturationPairs.slice(0, 2).map(pair => pair.color);
      
      // If we don't have at least two colors, fill in with variations
      if (vibrantColors.length === 1) {
        // Create a darker variant of the first color
        vibrantColors.push(vibrantColors[0].darken(0.2));
      } else if (vibrantColors.length === 0 && iconPalette.length > 0) {
        // Fallback to the first color in the palette and a variant
        const baseColor = Color(iconPalette[0].hex());
        vibrantColors = [baseColor, baseColor.darken(0.3)];
      }
      
      // Sort by luminosity so darker color comes first
      vibrantColors.sort((a, b) => a.luminosity() - b.luminosity());
      
      if (vibrantColors.length >= 2) {
        // Create a more visible radial gradient from the bottom right corner
        const bottomRightGradient = ctx.createRadialGradient(
          cardX + cardWidth, cardY + cardHeight, 0,  // Start from bottom right
          cardX + cardWidth, cardY + cardHeight, cardWidth * 0.7  // Smaller radius for more visibility
        );
        
        // Start with the darker color at higher opacity
        bottomRightGradient.addColorStop(0, vibrantColors[0].alpha(0.4).rgb().string());
        
        // Transition to the lighter color
        bottomRightGradient.addColorStop(0.3, vibrantColors[1].alpha(0.3).rgb().string());
        
        // Fade to transparent
        bottomRightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        // Apply the bottom right accent gradient
        ctx.fillStyle = bottomRightGradient;
        ctx.fillRect(cardX, cardY, cardWidth, cardHeight);
        
        // Create a larger radial gradient for the top left corner (2x size)
        const topLeftGradient = ctx.createRadialGradient(
          cardX, cardY, 0,  // Start from top left
          cardX, cardY, cardWidth * 1.4  // Double the radius of the bottom right gradient
        );
        
        // Use the same colors but in reverse order for visual balance
        topLeftGradient.addColorStop(0, vibrantColors[1].alpha(0.4).rgb().string());
        topLeftGradient.addColorStop(0.3, vibrantColors[0].alpha(0.3).rgb().string());
        topLeftGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        // Apply the top left accent gradient
        ctx.fillStyle = topLeftGradient;
        ctx.fillRect(cardX, cardY, cardWidth, cardHeight);
      }
    }
  } else {
    // Fallback to a light gray if no suitable color was found
    ctx.fillStyle = 'rgb(245, 245, 245)';
    ctx.fillRect(cardX, cardY, cardWidth, cardHeight);
  }

  // 4. Draw the App Icon on the Card (using appIconForCard) with drop shadow
  if (appIconForCard) {
      const iconDrawX = cardX + ICON_ON_CARD_MARGIN_LEFT + 5; // Moved 5px to the right
      const iconDrawY = cardY + ICON_ON_CARD_MARGIN_TOP;
      
      // Save the current context state before applying shadow
      ctx.save();
      
      // Apply drop shadow effect
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
      
      // Draw the icon with shadow
      ctx.drawImage(appIconForCard, iconDrawX, iconDrawY, ICON_ON_CARD_SIZE, ICON_ON_CARD_SIZE);
      
      // Reset shadow settings
      ctx.restore();
      
      // Add version number centered below the icon
      if (data.version) {
        const versionText = `${data.version}`; // Just the version number, no label
        ctx.font = 'normal 16px Barlow';
        ctx.fillStyle = '#333333';
        const versionWidth = ctx.measureText(versionText).width;
        const versionX = iconDrawX + (ICON_ON_CARD_SIZE - versionWidth) / 2; // Center align with icon
        const versionY = iconDrawY + ICON_ON_CARD_SIZE + 20;
        ctx.fillText(versionText, versionX, versionY);
        
        // Draw stars below the version
        const starsY = versionY + 25;
        drawStars(ctx, data.stars, iconDrawX + (ICON_ON_CARD_SIZE - (data.stars * 18 * 1.2)) / 2, starsY, 18);
      } else {
        // If no version, just draw stars directly below the icon
        const starsY = iconDrawY + ICON_ON_CARD_SIZE + 25;
        drawStars(ctx, data.stars, iconDrawX + (ICON_ON_CARD_SIZE - (data.stars * 18 * 1.2)) / 2, starsY, 18);
      }
  }

  // Add website URL in a rounded rectangle at the bottom right
  const websiteText = "walletscrutiny.com";
  ctx.font = 'normal 12px Barlow';
  
  // Measure text to create appropriately sized rectangle
  const websiteTextWidth = ctx.measureText(websiteText).width;
  const websiteTextHeight = 12; // Approximate height based on font size
  
  // Add padding around text
  const paddingX = 10;
  const paddingY = 6;
  
  // Position at bottom right with some margin
  const websiteRectX = cardX + cardWidth - websiteTextWidth - (paddingX * 2) - 15;
  const websiteRectY = cardY + cardHeight - websiteTextHeight - (paddingY * 2) - 15;
  const websiteRectWidth = websiteTextWidth + (paddingX * 2);
  const websiteRectHeight = websiteTextHeight + (paddingY * 2);
  const websiteRectRadius = websiteRectHeight / 2; // Fully rounded corners
  
  // Draw the rounded rectangle background
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(websiteRectX + websiteRectRadius, websiteRectY);
  ctx.lineTo(websiteRectX + websiteRectWidth - websiteRectRadius, websiteRectY);
  ctx.arcTo(websiteRectX + websiteRectWidth, websiteRectY, websiteRectX + websiteRectWidth, websiteRectY + websiteRectRadius, websiteRectRadius);
  ctx.lineTo(websiteRectX + websiteRectWidth, websiteRectY + websiteRectHeight - websiteRectRadius);
  ctx.arcTo(websiteRectX + websiteRectWidth, websiteRectY + websiteRectHeight, websiteRectX + websiteRectWidth - websiteRectRadius, websiteRectY + websiteRectHeight, websiteRectRadius);
  ctx.lineTo(websiteRectX + websiteRectRadius, websiteRectY + websiteRectHeight);
  ctx.arcTo(websiteRectX, websiteRectY + websiteRectHeight, websiteRectX, websiteRectY + websiteRectHeight - websiteRectRadius, websiteRectRadius);
  ctx.lineTo(websiteRectX, websiteRectY + websiteRectRadius);
  ctx.arcTo(websiteRectX, websiteRectY, websiteRectX + websiteRectRadius, websiteRectY, websiteRectRadius);
  ctx.closePath();
  
  // Fill with the specified color
  ctx.fillStyle = '#00aaa2';
  ctx.fill();
  
  // Draw the text in white, centered in the rectangle
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Use lowercase letters with bold font
  ctx.font = 'bold 10px Barlow';
  ctx.fillText(websiteText, websiteRectX + (websiteRectWidth / 2), websiteRectY + (websiteRectHeight / 2));
  
  // Reset text alignment
  ctx.textAlign = 'start';
  ctx.textBaseline = 'alphabetic';
  ctx.restore();
  
  ctx.restore(); // Restore context (removes clipping)
  // --- End of Card and Icon Drawing within clipped area ---

  // --- Text and Star Drawing (positioning adjusted for the new card layout) ---
  const textStartX = cardX + ICON_ON_CARD_MARGIN_LEFT + ICON_ON_CARD_SIZE + 25; // Start text to the right of icon (moved 5px more to the right)
  const textWidth = cardWidth - (ICON_ON_CARD_MARGIN_LEFT + ICON_ON_CARD_SIZE + 25) - 15; // Adjusted available width for text

  // Print app title (moved down by 15px and 5px to the right)
  printText(data.title, ctx, textStartX, cardY + ICON_ON_CARD_MARGIN_TOP + 20, '#000000', 'bold 30px Barlow', textWidth, 36);

  // Print verdict (moved down accordingly and 5px to the right)
  const verdictText = verdictMap[data.verdict] || data.verdict;
  const verdictColor = data.verdict === 'reproducible' || data.verdict === 'wip' ? '#A0A21A' // Darker Yellow/Green
    : data.verdict === 'custodial' || data.verdict === 'nobtc' || data.verdict === 'noSource' || data.verdict === 'defunct' || data.verdict === 'offline' || data.verdict === 'scam' ? '#CC0000' // Darker Red
      : '#333333'; // Dark Gray for others
  printText(verdictText, ctx, textStartX, cardY + ICON_ON_CARD_MARGIN_TOP + 60, verdictColor, 'bold 22px Barlow', textWidth, 26);
  
  // Info section below the main header (icon, title, verdict)
  const infoStartY = cardY + ICON_ON_CARD_MARGIN_TOP + ICON_ON_CARD_SIZE + 60; // Start further below to account for stars
  const infoStartX = cardX + 20; // Indent from left card edge
  const infoLineHeight = 26;
  let currentInfoY = infoStartY;

  // Print Nostr build status if 'reproducible'
  if (data.verdict === 'reproducible' && data.nostrBuildStatus) {
    const nostrStatusText = `Nostr Build: ${data.nostrBuildStatus}`;
    const nostrStatusColor = data.nostrBuildStatus === 'success' ? '#28A745' // Bootstrap Success Green
      : data.nostrBuildStatus === 'failure' ? '#DC3545' // Bootstrap Danger Red
        : '#FFC107'; // Bootstrap Warning Yellow
    printText(nostrStatusText, ctx, infoStartX, currentInfoY, nostrStatusColor, 'bold 18px Barlow', cardWidth - 40, 22);
    currentInfoY += infoLineHeight;
  }
  // Print Nostr attestation count if available
  if (typeof data.nostrAttestationCount === 'number' && data.nostrAttestationCount > 0) {
    const nostrAttestationText = `Nostr Attestations: ${data.nostrAttestationCount}`;
    printText(nostrAttestationText, ctx, infoStartX, currentInfoY, '#333333', 'normal 18px Barlow', cardWidth - 40, 22);
    // currentInfoY += infoLineHeight; // No increment if it's the last item in this block for now
  }

  // Overlay "reproducible" image if verdict is reproducible (now uses card dimensions)
  if (data.verdict === 'reproducible') {
    overlayReproducibleImage(ctx, cardX, cardY, cardWidth, cardHeight);
  }

  return canvas;
}

function printText (text, ctx, x, y, fillStyle, font, maxLength, lineHeight) {
  const wrapped = wrapText(text, maxLength || 1000);
  ctx.font = font || ctx.font;
  ctx.fillStyle = fillStyle || ctx.fillStyle;
  for (let i = 0; i < wrapped.length; i++) {
    const line = wrapped[i];
    ctx.fillText(line, x, y + (i * (lineHeight || 0)));
  }
}

// Core Functions - Process One File
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

  let iconImagePath = path.join('images', 'wIcons', platform, `${data.icon}`);
  if (!fs.existsSync(iconImagePath)) {
    iconImagePath = fallbackIcon;
  }

  // Load the bg image and icon
  let iconImage;
  try {
    iconImage = await loadImage(iconImagePath);
  } catch (error) {
    console.error(`Error processing file ${file}: `, error);
    totalFiles--;
    return;
  }
  
  // Extract dominant color from the icon using a simple method
  let iconPalette;
  try {
    const iconBuffer = await fsp.readFile(iconImagePath);
    const imageType = path.extname(iconImagePath).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg';
    iconPalette = await getColors(iconBuffer, { type: imageType, count: 10 });
  } catch (paletteError) {
    console.warn(`Could not extract palette for ${iconImagePath}, using fallback. Error: ${paletteError.message}`);
    // Create a fallback palette if extraction fails, e.g., a single gray color
    iconPalette = [{ hex: () => '#dddddd' }]; // Ensure it's an array of objects with a hex method
  }

  // Update Nostr data based on MD verdict
  if (data.verdict === 'sourceavailable') {
    data.nostrBuildStatus = null; // Initialize
    data.nostrAttestationCount = 0; // Initialize

    if (data.appId && allNostrVerificationInfo) {
      console.log(`[Nostr] MD verdict is 'sourceavailable' for ${data.appId}. Checking fetched Nostr data...`);
      const nostrAttestationSummary = getNostrAttestationSummaryForApp(allNostrVerificationInfo, data.appId);

      // Always store the count, even if no 'latest' event was suitable
      if (nostrAttestationSummary) {
          data.nostrAttestationCount = nostrAttestationSummary.attestationCount;
      }

      if (nostrAttestationSummary && nostrAttestationSummary.latestStatus) {
        // We have a definitive latest attestation from Nostr
        console.log(`[Nostr] Found for ${data.appId}: Status=${nostrAttestationSummary.latestStatus}, V=${nostrAttestationSummary.latestVersion || 'N/A'}, Date=${nostrAttestationSummary.latestDate || 'N/A'}, Count=${nostrAttestationSummary.attestationCount}. Overriding relevant MD data.`);
        data.nostrBuildStatus = nostrAttestationSummary.latestStatus;
        
        // Only override version and date if Nostr provides them
        if (nostrAttestationSummary.latestVersion) {
          data.version = nostrAttestationSummary.latestVersion;
        }
        if (nostrAttestationSummary.latestDate) {
          data.date = nostrAttestationSummary.latestDate;
        }
        // data.verdict remains 'sourceavailable' for primary display
      } else {
        // No definitive 'latest' attestation from Nostr (e.g., events exist but lack version/status, or no events at all)
        // The main data.verdict remains 'sourceavailable'.
        // data.version and data.date will remain as per the markdown file.
        // data.nostrAttestationCount is already set (or 0 if nostrAttestationSummary was null).
        // data.nostrBuildStatus remains null.
        const countForLog = nostrAttestationSummary ? nostrAttestationSummary.attestationCount : 0;
        const statusForLog = (nostrAttestationSummary && nostrAttestationSummary.latestStatus) || 'N/A';
        console.log(`[Nostr] MD verdict 'sourceavailable' for ${data.appId}. Nostr summary: Count=${countForLog}, Latest Status=${statusForLog}. Using MD version/date if not overridden.`);
      }
    } else if (data.appId && !allNostrVerificationInfo) {
      console.warn(`[Nostr] MD verdict 'sourceavailable' for ${data.appId}, but Nostr data not available (fetch might have failed). Using MD data.`);
    } else if (!data.appId) {
      console.warn(`[Nostr] MD verdict 'sourceavailable', but no appId in MD for ${file}. Cannot query Nostr. Using MD 'sourceavailable'.`);
    }
    // data.verdict remains 'sourceavailable'
  } else {
    // For verdicts other than 'sourceavailable', use the MD data directly.
    // Initialize nostr-specific fields to ensure they are not accidentally carried over or undefined
    data.nostrBuildStatus = null;
    data.nostrAttestationCount = 0;
    console.log(`MD verdict for ${file} is '${data.verdict}' (not 'sourceavailable'). Using MD data directly, skipping Nostr check.`);
  }

  // Draw on the canvas
  const canvas = await drawOnCanvas(data, iconImage, iconPalette); // Pass iconPalette

  // Export the canvas as a PNG file
  const dataURL = canvas.toDataURL('image/png');

  // Save the Canvas as an image
  const outputPath = `${outputFolderPath}/${file.replace('.md', '.png')}`;
  await fsp.writeFile(outputPath, dataURL.replace(/^data:image\/png;base64,/, ''), 'base64');

  totalFiles--;
}

// Core Functions - Process Files
async function processFiles () {
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

// Add a function to process a single file by path
async function processSingleFile(filePath) {
  // Extract platform and filename from the path
  const parsedPath = path.parse(filePath);
  const filename = parsedPath.base;
  const dirName = parsedPath.dir.split('/').pop();
  
  // Determine the platform from the directory name (remove leading underscore if present)
  const platform = dirName.startsWith('_') ? dirName.substring(1) : dirName;
  
  // Create output directory if it doesn't exist
  const socialImagesFolderPath = 'images/social';
  if (!fs.existsSync(socialImagesFolderPath)) {
    fs.mkdirSync(socialImagesFolderPath);
  }
  
  const outputFolderPath = `images/social/${platform}`;
  if (!fs.existsSync(outputFolderPath)) {
    fs.mkdirSync(outputFolderPath);
  }
  
  // Process the single file
  totalFiles++;
  await processOneFile(platform, parsedPath.dir, filename, outputFolderPath);
  
  console.log(`Finished processing ${filename}`);
}

async function processFilesTimed() {
  console.log('Starting Twitter card generation...');
  const overallStartTime = Date.now();

  try {
    await loadResources(); // Load fonts, images, and Nostr data
    await processFiles(); // Process all markdown files to generate cards
  } catch (error) {
    console.error('Error during Twitter card generation:', error);
  }

  const overallEndTime = Date.now();
  const totalDurationSeconds = (overallEndTime - overallStartTime) / 1000;
  console.log(`Finished Twitter card generation. Total time: ${totalDurationSeconds.toFixed(2)} seconds.`);
  // Any other summary information can be logged here if needed
}

processFilesTimed();
