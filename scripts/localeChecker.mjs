// Checks if an app is available in top 15 countries
// Can run in bulk or process only a specific file
// To process a specific file: '$ node scripts/localeChecker.mjs --platform ios --path /path/to/your/file.md'

import fs from 'fs/promises';
import path from 'path';
import pLimit from 'p-limit';
import helper from './helper.mjs';
import { isAppAvailable, cooldown, logCountryProgress, countryCodes, allCountryCodes } from './countryAvailabilityChecker.mjs';

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
if (!platform || (platform !== 'ios' && platform !== 'iphone' && platform !== 'android')) {
  console.error('Error: Please specify a valid platform using --platform ios/iphone or --platform android');
  process.exit(1);
}

// Resolve the file path to an absolute path
if (filePathToProcess) {
  filePathToProcess = path.resolve(process.cwd(), filePathToProcess);
}

// Constants and configurations
const limit = pLimit(2); // Concurrency limited to 2
const filesPerCooldown = 50; // Number of files processed before triggering cooldown

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
      if (isSingleFile) {
        logCountryProgress(code, isSingleFile);
      }
      const available = await isAppAvailable(appId, code, platform);
      if (available) {
        availableCountry = code;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
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

  if (totalFiles > 1 && processedFiles > 0 && processedFiles % filesPerCooldown === 0) {
    await cooldown(60000); 
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
