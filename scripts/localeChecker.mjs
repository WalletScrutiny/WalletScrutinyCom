// Checks if an app is available in top 15 countries
// Can run in bulk or process only a specific file
// To process a specific file: '$ node scripts/localeChecker.mjs --platform ios --path /path/to/your/file.md'

import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import pLimit from 'p-limit';
import { JSDOM } from 'jsdom';
import helper from './helper.mjs';

// Parse command-line arguments
let filePathToProcess = null;
let platform = null;
for (let i = 2; i < process.argv.length; i++) {
  if (process.argv[i] === '-p' || process.argv[i] === '--path') {
    filePathToProcess = process.argv[i + 1];
    i++; // Skip the next argument, as we have consumed it
  } else if (process.argv[i] === '--platform') {
    platform = process.argv[i + 1].toLowerCase();
    i++; // Skip the next argument, as we have consumed it
  }
}

// Validate platform flag
if (!platform || (platform !== 'ios' && platform !== 'android')) {
  console.error('Error: Please specify a valid platform using --platform ios or --platform android');
  process.exit(1);
}

// Resolve the file path to an absolute path
if (filePathToProcess) {
  filePathToProcess = path.resolve(process.cwd(), filePathToProcess);
}

// Constants and configurations
const limit = pLimit(2); // Concurrency limited to 2
const maxRetries = 5;
const baseDelay = 2000; // 2 seconds
const cooldownPeriod = 60000; // 1 minute cooldown
const filesPerCooldown = 50; // Number of files processed before triggering cooldown

const countryCodes = 'US,CN,JP,IN,GB,CA,BR,AR,DE,ZA,AU,NZ,KR,FR,RU'.split(',');
const allCountryCodes = 'AE,AF,AG,AI,AL,AM,AO,AR,AT,AU,AZ,BB,BD,BE,BF,BG,BH,BJ,BM,BN,BO,BR,BS,BT,BW,BY,BZ,CA,CD,CG,CH,CI,CL,CM,CN,CO,CR,CV,CY,CZ,DE,DK,DM,DO,DZ,EC,EE,EG,ES,FI,FJ,FM,FR,GB,GD,GH,GM,GR,GT,GW,GY,HK,HN,HR,HU,ID,IE,IL,IN,IS,IT,JM,JO,JP,KE,KG,KH,KN,KR,KW,KY,KZ,LA,LB,LC,LK,LR,LT,LU,LV,MD,MG,MK,ML,MM,MN,MO,MR,MS,MT,MU,MW,MX,MY,MZ,NA,NE,NG,NI,NL,NO,NP,NZ,OM,PA,PE,PG,PH,PK,PL,PT,PW,PY,QA,RO,RU,SA,SB,SC,SE,SG,SI,SK,SL,SN,SR,ST,SV,SZ,TC,TD,TH,TJ,TM,TN,TR,TT,TW,TZ,UA,UG,US,UY,UZ,VC,VE,VG,VN,YE,ZA,ZW'.split(',');

let processedFiles = 0;
let totalFiles = 0;
const updatedFiles = [];
const unavailableFiles = [];

/**
 * Log an error message in red color
 * @param {string} message - The error message to log
 */
function logError(message) {
  console.error('\x1b[31m%s\x1b[0m', message);
}

/**
 * Log a success message in green color
 * @param {string} message - The success message to log
 */
function logSuccess(message) {
  console.log('\x1b[32m%s\x1b[0m', message);
}

/**
 * Check if an app is available in a specific country
 * @param {string} appId - The app ID or package name to check
 * @param {string} countryCode - The country code to check availability
 * @param {number} retryCount - The current retry count
 * @returns {Promise<boolean>} - True if the app is available, false otherwise
 */
async function isAppAvailable(appId, countryCode, retryCount = 0) {
  let url;
  if (platform === 'ios') {
    url = `https://itunes.apple.com/lookup?id=${appId}&country=${countryCode}`;
  } else if (platform === 'android') {
    url = `https://play.google.com/store/apps/details?id=${appId}&gl=${countryCode}`;
  }

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay between API calls
    const response = await axios.get(url, {
      headers: platform === 'android' ? {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      } : {}
    });

    if (platform === 'ios') {
      return response.data.resultCount > 0;
    } else if (platform === 'android') {
      const dom = new JSDOM(response.data);
      const document = dom.window.document;
      const notFoundElement = document.querySelector('div[jscontroller="WYvdzc"]');
      if (notFoundElement) {
        const notFoundText = notFoundElement.textContent;
        if (notFoundText.includes("isn't available in your country") || notFoundText.includes("not found")) {
          return false;
        }
      }
      return true;
    }
  } catch (error) {
    if (error.response && (error.response.status === 403 || error.response.status === 429) && retryCount < maxRetries) {
      const delay = baseDelay * Math.pow(2, retryCount);
      console.log(`Rate limited. Retrying in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return isAppAvailable(appId, countryCode, retryCount + 1);
    }
    return false;
  }
}

/**
 * Perform a cooldown period with progress messages
 * @returns {Promise<void>}
 */
async function cooldown() {
  console.log(
    "\n🚨 Whoa there, speed racer! We've processed 50 files. Time to give the API a breather. 💨"
  );

  const cooldownMessages = [
    'API is doing yoga to destress.',
    'API is sipping on a digital smoothie.',
    'API is practicing its deep breathing exercises.',
    'API is power napping.',
    'API is almost done with its meditation session.',
    'API is stretching its digital muscles.'
  ];

  const totalSteps = 6;
  const stepDuration = cooldownPeriod / totalSteps;

  for (let i = 0; i < totalSteps; i++) {
    await new Promise((resolve) => setTimeout(resolve, stepDuration));
    const emoji = ['🕐', '🕑', '🕒', '🕓', '🕔', '🕕'][i];
    console.log(`${emoji} Cooling down... (${(i + 1) * 10}s) ${cooldownMessages[i]}`);
  }

  console.log(
    "✨ Cooldown complete! The API is refreshed and ready to rock 'n' roll again! 🎸\n"
  );
}

const today = new Date();

/**
 * Log information to the removed log file
 * @returns {Promise<void>}
 */
async function writeLogFile() {
  const logFileName = platform === 'ios' ? 'removedFixIOS.log' : 'removedFixAndroid.log';
  const logContent = [
    `Number of updated files: ${updatedFiles.length}`,
    '\nUpdated files:',
    ...updatedFiles.map((file, index) => `${index + 1}. ${file}`),
    '\n' + '-'.repeat(50),
    '\nFiles not available in other countries (with meta: removed):',
    ...unavailableFiles.map((file, index) => `${index + 1}. ${file}`),
    '\nYou can manually check the above files using single-file processing.'
  ].join('\n');

  await fs.writeFile(logFileName, logContent, 'utf8');
  if (totalFiles > 1) {
    console.log('The script only checks for the top 5 market-share countries, + top 2 markets for each continent');
    console.log('Some of the files that were not updated could be available in other countries.');
    console.log('A more comprehensive check would list 161 countries.');
    console.log('-------------------------------------------------------------');
  }
  console.log(`Log file "${logFileName}" has been created.`);
}

/**
 * Process a single file
 * @param {string} filePath - The path of the file to process
 * @param {boolean} isSingleFile - Whether we are processing a single file
 * @returns {Promise<void>}
 */
async function processFile(filePath, isSingleFile = false) {
  processedFiles++;
  console.log(`Processing file ${processedFiles} of ${totalFiles}: ${filePath}`);

  const content = { header: {}, body: undefined };
  helper.loadFromFile(filePath, content);

  const originalReleased = content.header.released;
  const originalUpdated = content.header.updated;

  if (content.header.meta === 'removed') {
    const appId = platform === 'ios' ? content.header.idd : content.header.appId;
    if (!appId) {
      console.error(`App ID not found in content.header for ${path.basename(filePath)}`);
      return;
    }

    let availableCountry = null;
    const codesToCheck = isSingleFile ? allCountryCodes : countryCodes;

    for (const code of codesToCheck) {
      const available = await isAppAvailable(appId, code);
      if (available) {
        availableCountry = code;
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (availableCountry) {
      logSuccess(`${path.basename(filePath)} is available in ${availableCountry}`);
      content.header.meta = 'ok';
      content.header.appCountry = availableCountry;
      content.header.date = today;

      content.header.released = originalReleased;
      content.header.updated = originalUpdated;

      helper.writeResult(platform === 'ios' ? '_iphone/' : '_android/', content.header, content.body);
      updatedFiles.push(path.basename(filePath));
    } else {
      logError(`${path.basename(filePath)} is not available in any of the specified countries.`);
      unavailableFiles.push(path.basename(filePath));
    }
  }

  if (processedFiles > 0 && processedFiles % filesPerCooldown === 0) {
    await cooldown();
    console.log(`Resuming processing. ${totalFiles - processedFiles} files remaining.`);
  }
}

/**
 * Get the list of files to process
 * @param {string|null} filePathToProcess - Optional specific file path to process
 * @returns {Promise<string[]>} - Array of file paths to process
 */
async function getFilesToProcess(filePathToProcess) {
  if (filePathToProcess) {
    try {
      await fs.access(filePathToProcess);
      return [filePathToProcess];
    } catch (error) {
      console.error(`Error: The file ${filePathToProcess} does not exist.`);
      process.exit(1);
    }
  } else {
    const directoryPath = path.join(process.cwd(), platform === 'ios' ? '_iphone' : '_android');
    const files = await fs.readdir(directoryPath);
    const filteredFiles = [];
    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(directoryPath, file);
        const content = await fs.readFile(filePath, 'utf8');
        if (content.includes('meta: removed')) {
          filteredFiles.push(filePath);
        }
      }
    }
    return filteredFiles;
  }
}

/**
 * Main function to process all files
 * @returns {Promise<void>}
 */
async function processFiles() {
  const files = await getFilesToProcess(filePathToProcess);
  totalFiles = files.length;

  console.log(`Starting processing of ${totalFiles} files:`);
  files.forEach((file) => console.log(file));
  console.log('\n');

  if (totalFiles > 1) {
    console.log(`There are a total of ${totalFiles} files that have "meta: removed".`); 
    console.log(`Checking ${totalFiles} files if they are available in ${countryCodes.join(',')}.`);
    console.log('=====================================================================================');
  }
  
  if (totalFiles === 1) {
    console.log(`Checking availability in all countries for the file: ${files[0]}`);
  }

  const isSingleFile = totalFiles === 1;

  const promises = files.map((filePath) => limit(() => processFile(filePath, isSingleFile)));

  await Promise.all(promises);

  // Only write a log file if more than 1 file is processed
  if (totalFiles > 1) {
    await writeLogFile();
  }
}

// Start processing files
processFiles().catch((error) => {
  console.error('An error occurred:', error.message);
});
