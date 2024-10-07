import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import pLimit from 'p-limit';
import helper from './helper.mjs';

// Parse command-line arguments
let filePathToProcess = null;
for (let i = 2; i < process.argv.length; i++) {
  if (process.argv[i] === '-p' || process.argv[i] === '--path') {
    filePathToProcess = process.argv[i + 1];
    i++; // Skip the next argument, as we have consumed it
  }
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

const countryCodes = 'us,cn,jp,in,gb,ca,br,ar,de,za,au,nz,kr,fr,ru'.split(',');
const allCountryCodes = 'ae,af,ag,ai,al,am,ao,ar,at,au,az,bb,bd,be,bf,bg,bh,bj,bm,bn,bo,br,bs,bt,bw,by,bz,ca,cd,cg,ch,ci,cl,cm,cn,co,cr,cv,cy,cz,de,dk,dm,do,dz,ec,ee,eg,es,fi,fj,fm,fr,gb,gd,gh,gm,gr,gt,gw,gy,hk,hn,hr,hu,id,ie,il,in,is,it,jm,jo,jp,ke,kg,kh,kn,kr,kw,ky,kz,la,lb,lc,lk,lr,lt,lu,lv,md,mg,mk,ml,mm,mn,mo,mr,ms,mt,mu,mw,mx,my,mz,na,ne,ng,ni,nl,no,np,nz,om,pa,pe,pg,ph,pk,pl,pt,pw,py,qa,ro,ru,sa,sb,sc,se,sg,si,sk,sl,sn,sr,st,sv,sz,tc,td,th,tj,tm,tn,tr,tt,tw,tz,ua,ug,us,uy,uz,vc,ve,vg,vn,ye,za,zw'.split(',');

let processedFiles = 0;
let totalFiles = 0;
const updatedFiles = [];
const unavailableFiles = [];

/**
 * Log an error message in red color
 * @param {string} message - The error message to log
 */
function logError (message) {
  console.error('\x1b[31m%s\x1b[0m', message);
}

/**
 * Log a success message in green color
 * @param {string} message - The success message to log
 */
function logSuccess (message) {
  console.log('\x1b[32m%s\x1b[0m', message);
}

/**
 * Check if an app is available in a specific country
 * @param {string} appId - The app ID to check
 * @param {string} countryCode - The country code to check availability
 * @param {number} retryCount - The current retry count
 * @returns {Promise<boolean>} - True if the app is available, false otherwise
 */
async function isAppAvailable (appId, countryCode, retryCount = 0) {
  const url = `https://itunes.apple.com/lookup?id=${appId}&country=${countryCode}`;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay between API calls
    const response = await axios.get(url);
    return response.data.resultCount > 0;
  } catch (error) {
    if (error.response && error.response.status === 403 && retryCount < maxRetries) {
      const delay = baseDelay * Math.pow(2, retryCount);
      console.log(`Rate limited. Retrying in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return isAppAvailable(appId, countryCode, retryCount + 1);
    }
    console.error(`Error checking app availability in ${countryCode}:`, error.message);
    return false;
  }
}

/**
 * Perform a cooldown period with progress messages
 * @returns {Promise<void>}
 */
async function cooldown () {
  console.log(
    "\n🚨 Whoa there, speed racer! We've processed 50 files. Time to give the API a breather. 🌬️"
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

const today = new Date().toISOString().split('T')[0];

/**
 * Log information to the removed.log file
 * @returns {Promise<void>}
 */
async function writeLogFile () {
  const logContent = [
    `Number of updated files: ${updatedFiles.length}`,
    '\nUpdated files:',
    ...updatedFiles.map((file, index) => `${index + 1}. ${file}`), // Numbered list of updated files
    '\n' + '-'.repeat(50),
    '\nFiles not available in other countries (with meta: removed):',
    ...unavailableFiles.map((file, index) => `${index + 1}. ${file}`), // Numbered list of unavailable files
    '\nYou can manually check the above files using single-file processing.'
  ].join('\n');

  await fs.writeFile('removedFix.log', logContent, 'utf8');
  if (totalFiles > 1) {
    console.log('The script only checks for the top 5 market-share countries, + top 2 markets for each continent');
    console.log('Some of the files that were not updated could be available in other countries.');
    console.log('A more comprehensive check would list 161 countries.');
    console.log('-------------------------------------------------------------');
  }
  console.log('Log file "removedFix.log" has been created.');
}

/**
 * Process a single file
 * @param {string} filePath - The path of the file to process
 * @returns {Promise<void>}
 */
async function processFile (filePath, isSingleFile = false) {
  processedFiles++;
  console.log(`Processing file ${processedFiles} of ${totalFiles}: ${filePath}`);

  const content = { header: {}, body: undefined };
  helper.loadFromFile(filePath, content);

  const originalReleased = content.header.released;
  const originalUpdated = content.header.updated;

  if (content.header.meta === 'removed') {
    const appId = content.header.idd;
    if (!appId) {
      console.error(`App ID not found in content.header for ${path.basename(filePath)}`);
      return;
    }

    let availableCountry = null;
    const codesToCheck = isSingleFile ? allCountryCodes : countryCodes;

    if (isSingleFile) {
      // Single-file processing logic
      process.stdout.write('Checking ');
      for (const code of codesToCheck) {
        process.stdout.write(`${code},`);
        const available = await isAppAvailable(appId, code);
        if (available) {
          availableCountry = code;
          process.stdout.write(`\nApp is available in '${availableCountry.toUpperCase()}'\n`);
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      if (!availableCountry) {
        console.log('\nApp not available in any of the specified countries.');
      }
    } else {
      // Multi-file processing logic
      for (const code of codesToCheck) {
        const available = await isAppAvailable(appId, code);
        if (available) {
          availableCountry = code;
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    if (availableCountry) {
      logSuccess(`${path.basename(filePath)} is available in ${availableCountry}`);
      content.header.meta = 'ok';
      content.header.appCountry = availableCountry;
      content.header.date = today;

      content.header.released = originalReleased;
      content.header.updated = originalUpdated;

      helper.writeResult('_iphone/', content.header, content.body);
      console.log(`Updated ${path.basename(filePath)}`);

      // Add the updated file to the updatedFiles list
      updatedFiles.push(path.basename(filePath));
    } else {
      logError(`${path.basename(filePath)} is not available in any of the specified countries.`);

      // Add the unavailable file to the unavailableFiles list
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
async function getFilesToProcess (filePathToProcess) {
  if (filePathToProcess) {
    try {
      await fs.access(filePathToProcess);
      return [filePathToProcess];
    } catch (error) {
      console.error(`Error: The file ${filePathToProcess} does not exist.`);
      process.exit(1);
    }
  } else {
    const directoryPath = path.join(process.cwd(), '_iphone');
    const files = await fs.readdir(directoryPath);
    return files
      .filter((file) => file.endsWith('.md'))
      .map((file) => path.join(directoryPath, file));
  }
}

/**
 * Main function to process all files
 * @returns {Promise<void>}
 */
async function processFiles () {
  const files = await getFilesToProcess(filePathToProcess);
  totalFiles = files.length;

  console.log(`Starting processing of ${totalFiles} files:`);
  files.forEach((file) => console.log(file));
  console.log('\n');

  const isSingleFile = totalFiles === 1;

  const promises = files.map((filePath) => limit(() => processFile(filePath, isSingleFile)));

  await Promise.all(promises);

  // Only write a log file if more than 1 files is processed
  if (totalFiles > 1) {
    await writeLogFile();
  }
}

// Start processing files
processFiles().catch((error) => {
  console.error('An error occurred:', error.message);
});
