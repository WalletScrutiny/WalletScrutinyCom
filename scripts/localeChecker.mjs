import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import axios from 'axios';
import pLimit from 'p-limit';

const limit = pLimit(2); // Concurrency limited to 2
const maxRetries = 5;
const baseDelay = 2000; // 2 seconds
const cooldownPeriod = 60000; // 1 minute cooldown
const filesPerCooldown = 50; // Number of files processed before triggering cooldown

const countryCodes = 'US,CN,JP,GB,DE,KR,FR,CA,BR,IN,RU,AU,IT,MX,ES'.split(',');

let processedFiles = 0;
let totalFiles = 0;

// Custom YAML schema to preserve date formats
const customYamlType = new yaml.Type('!date', {
  kind: 'scalar',
  resolve: (data) => data !== null,
  construct: (data) => data,
  instanceOf: Date,
  represent: (data) => data.toISOString().split('T')[0],
});

const CUSTOM_SCHEMA = yaml.DEFAULT_SCHEMA.extend([customYamlType]);

function extractFrontMatter(content) {
  const match = /^---\n([\s\S]+?)\n---/m.exec(content);
  return match ? match[1] : null;
}

function stripQuotes(value) {
  if (typeof value === 'string') {
    return value.replace(/^['"]|['"]$/g, '');
  }
  return value;
}

function needsQuotes(value) {
  if (typeof value !== 'string') return false;
  // YAML requires quotes if the string starts with certain characters or contains special characters
  return /^[\s-?:,[\]{}#&*!|>'"%@`]/.test(value) || /[\s]/.test(value);
}

async function isAppAvailable(appId, countryCode, retryCount = 0) {
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

async function cooldown() {
  console.log(
    "\n🚨 Whoa there, speed racer! We've processed 50 files. Time to give the API a breather. 🌬️"
  );

  const cooldownMessages = [
    'API is doing yoga to destress.',
    'API is sipping on a digital smoothie.',
    'API is practicing its deep breathing exercises.',
    'API is power napping.',
    'API is almost done with its meditation session.',
    'API is stretching its digital muscles.',
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

function customYamlDump(obj) {
  const lines = [];
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined || value === '') {
      lines.push(`${key}:`);
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(`${key}: []`);
      } else {
        lines.push(`${key}:`);
        value.forEach((item) => lines.push(`- ${item}`));
      }
    } else if (value instanceof Date) {
      // Output dates in YYYY-MM-DD format
      lines.push(`${key}: ${value.toISOString().split('T')[0]}`);
    } else if (typeof value === 'object') {
      lines.push(`${key}:`);
      const nestedLines = customYamlDump(value).split('\n');
      lines.push(
        ...nestedLines.map((line) => `  ${line}`).filter((line) => line.trim() !== '')
      );
    } else {
      let valueStr = value.toString();
      // Strip any existing surrounding quotes
      valueStr = valueStr.replace(/^['"]|['"]$/g, '');
      // Add quotes only if necessary
      if (needsQuotes(valueStr) || key === 'idd' || key === 'size') {
        lines.push(`${key}: '${valueStr}'`);
      } else {
        lines.push(`${key}: ${valueStr}`);
      }
    }
  }
  return lines.filter((line) => line.trim() !== '').join('\n');
}

function getTodayDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

async function processFile(filePath) {
  processedFiles++;
  console.log(`Processing file ${processedFiles} of ${totalFiles}: ${filePath}`);

  const fileContent = await fs.readFile(filePath, 'utf8');
  const frontMatter = extractFrontMatter(fileContent);

  if (frontMatter) {
    const metadata = yaml.load(frontMatter, { schema: CUSTOM_SCHEMA });

    // Ensure 'released' and 'updated' are strings
    if (metadata.released instanceof Date) {
      metadata.released = metadata.released.toISOString().split('T')[0];
    }
    if (metadata.updated instanceof Date) {
      metadata.updated = metadata.updated.toISOString().split('T')[0];
    }

    // Store original 'released' and 'updated' dates
    const originalReleased = metadata.released;
    const originalUpdated = metadata.updated;

    if (metadata.meta === 'removed') {
      let appId = metadata.idd;
      if (!appId) {
        console.error(`App ID not found in metadata for ${path.basename(filePath)}`);
        return;
      }

      let availableCountry = null;
      for (const code of countryCodes) {
        const available = await isAppAvailable(appId, code);
        if (available) {
          availableCountry = code;
          break;
        }
      }

      if (availableCountry) {
        console.log(`${path.basename(filePath)} is available in ${availableCountry}`);
        metadata.meta = 'ok';
        metadata.appCountry = availableCountry;
        metadata.date = getTodayDate(); // Update date to today's date

        // Restore original 'released' and 'updated' dates
        metadata.released = originalReleased;
        metadata.updated = originalUpdated;

        const newFrontMatter = customYamlDump(metadata);
        const newContent = fileContent.replace(
          /^---\n[\s\S]+?\n---/m,
          `---\n${newFrontMatter}\n---`
        );

        await fs.writeFile(filePath, newContent, 'utf8');
        console.log(`Updated ${path.basename(filePath)}`);
      } else {
        console.log(
          `${path.basename(filePath)} is not available in any of the specified countries.`
        );
      }
    }
  }

  if (processedFiles % filesPerCooldown === 0) {
    await cooldown();
    console.log(`Resuming processing. ${totalFiles - processedFiles} files remaining.`);
  }
}

async function getFilesToProcess() {
  const directoryPath = path.join(process.cwd(), '_iphone');
  const files = await fs.readdir(directoryPath);
  return files
    .filter((file) => file.endsWith('.md'))
    .map((file) => path.join(directoryPath, file));
}

async function processFiles() {
  const files = await getFilesToProcess();
  totalFiles = files.length;

  console.log(`Starting processing of ${totalFiles} files:`);
  files.forEach((file) => console.log(file));
  console.log('\n');

  const promises = files.map((filePath) => limit(() => processFile(filePath)));

  await Promise.all(promises);
}

processFiles().catch((error) => {
  console.error('An error occurred:', error.message);
});
