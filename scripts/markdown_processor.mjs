// Run as 'node scripts/markdown_processor.mjs /path/to/markdown/files'
// Alpha-1.1

import fs from 'fs';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url'; // Moved import to the top
import { dirname } from 'path';

// Get the filename and directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set up logging
const logFile = 'addHashes.log';
const logStream = fs.createWriteStream(logFile, { flags: 'w' }); // Overwrite the log file each time
function logInfo(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - INFO - ${message}\n`;
  logStream.write(logMessage);
}

function logError(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ERROR - ${message}\n`;
  logStream.write(logMessage);
}

async function findMarkdownFiles(directory) {
  const markdownFiles = [];

  async function traverseDir(currentPath) {
    const files = await fs.promises.readdir(currentPath);
    for (const file of files) {
      const fullPath = path.join(currentPath, file);
      const stat = await fs.promises.stat(fullPath);
      if (stat.isDirectory()) {
        await traverseDir(fullPath);
      } else if (stat.isFile() && file.endsWith('.md')) {
        markdownFiles.push(fullPath);
      }
    }
  }

  await traverseDir(directory);
  return markdownFiles;
}

async function processFile(filePath) {
  try {
    let content = await fs.promises.readFile(filePath, 'utf-8');

    logInfo(`Processing file: ${filePath}`);

    // Check if 'reviewCurrent' exists and is correctly formatted
    const reviewCurrentMatch = content.match(/^reviewCurrent:\n((^\s{2}\S.*\n)+)/m);
    if (reviewCurrentMatch) {
      const reviewCurrentContent = reviewCurrentMatch[1];
      const requiredFields = ['version', 'signer', 'appHashes', 'verdict', 'date'];
      const fieldsPresent = requiredFields.every((field) =>
        new RegExp(`^\\s{2}${field}:`, 'm').test(reviewCurrentContent)
      );
      if (fieldsPresent) {
        logInfo(`Skipped ${filePath} (already correctly formatted).`);
        return false;
      } else {
        logInfo(`Processing ${filePath} (incomplete reviewCurrent).`);
      }
    } else {
      logInfo(`Processing ${filePath} (reviewCurrent missing).`);
    }

    // Process content
    content = await processContent(content);

    // Write the updated content back to the file
    await writeFile(filePath, content);
    logInfo(`Successfully processed ${filePath}`);
    return true;
  } catch (error) {
    logError(`Error processing ${filePath}: ${error.message}`);
    return false;
  }
}

async function processContent(content) {
  // Normalize line endings
  content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Find the Results block
  const resultsBlockMatch = content.match(/===== Begin Results =====[\s\S]*?===== End Results =====/);
  if (resultsBlockMatch) {
    const resultsBlock = resultsBlockMatch[0];
    const beforeResults = content.slice(0, resultsBlockMatch.index);
    const afterResults = content.slice(resultsBlockMatch.index + resultsBlock.length);

    // Extract appHash from the results block
    const appHashMatch = resultsBlock.match(/appHash:\s*([0-9a-fA-F]+)/);
    const appHashValue = appHashMatch ? appHashMatch[1] : null;

    // Process before_results
    const beforeResultsProcessed = await processContentWithoutResults(beforeResults, appHashValue);

    // Process after_results
    const afterResultsProcessed = await processContentWithoutResults(afterResults, null);

    // Reassemble the content
    content = beforeResultsProcessed + resultsBlock + afterResultsProcessed;
  } else {
    // No Results block, process the entire content
    content = await processContentWithoutResults(content, null);
  }

  return content;
}

async function processContentWithoutResults(content, appHashValue) {
  // Normalize line endings
  content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Split the content into lines
  const lines = content.split('\n');

  // Initialize variables
  let version = '';
  let signer = '';
  let verdict = '';
  let date = '';
  const newLines = [];
  let inFrontMatter = false;

  for (const line of lines) {
    const strippedLine = line.trim();
    if (strippedLine === '---') {
      inFrontMatter = !inFrontMatter;
      newLines.push(line);
      continue;
    }
    if (inFrontMatter) {
      if (line.startsWith('version:')) {
        version = line.split(':').slice(1).join(':').trim();
      } else if (line.startsWith('signer:')) {
        signer = line.split(':').slice(1).join(':').trim();
      } else if (line.startsWith('verdict:')) {
        verdict = line.split(':').slice(1).join(':').trim();
      } else if (line.startsWith('date:')) {
        date = line.split(':').slice(1).join(':').trim();
      } else if (line.startsWith('appHashes:')) {
        // Remove appHashes from top-level fields
        // Do nothing
      } else {
        newLines.push(line);
      }
    } else {
      newLines.push(line);
    }
  }

  // Build the reviewCurrent block
  const appHashes = appHashValue ? `[${appHashValue}]` : '[]';
  const reviewCurrentBlock = [
    'reviewCurrent:',
    `  version: ${version}`,
    `  signer: ${signer}`,
    `  appHashes: ${appHashes}`,
    `  verdict: ${verdict}`,
    `  date: ${date}`,
  ].join('\n');

  // Insert reviewCurrent before reviewArchive or at the end of front matter
  let inserted = false;
  for (let i = 0; i < newLines.length; i++) {
    if (newLines[i].startsWith('reviewArchive:')) {
      newLines.splice(i, 0, reviewCurrentBlock);
      inserted = true;
      break;
    }
  }
  if (!inserted) {
    // Insert before closing '---'
    for (let i = 0; i < newLines.length; i++) {
      if (newLines[i].trim() === '---' && i !== 0) {
        newLines.splice(i, 0, reviewCurrentBlock);
        break;
      }
    }
  }

  // Join the lines back together
  content = newLines.join('\n');

  // Process the reviewArchive section
  content = await processReviewArchive(content);

  return content;
}

async function processReviewArchive(content) {
  // Function to process each reviewArchive entry
  function replaceAppHash(match, p1) {
    let entry = p1;
    // Convert legacy appHash to appHashes array
    entry = entry.replace(/\bappHash:\s*([0-9a-fA-F]+)/g, 'appHashes: [$1]');
    // Ensure appHashes exists even if appHash is missing
    if (!/appHashes:/.test(entry)) {
      entry = entry.replace(/(verdict:.*)/, '$1\n  appHashes: []');
      logInfo('Added empty appHashes to a reviewArchive entry.');
    } else {
      logInfo('Updated legacy appHash to appHashes in reviewArchive.');
    }
    return entry;
  }

  // Pattern to process each reviewArchive entry
  const reviewArchivePattern = /(-\s*date:.*?)(?=\n-\s*date:|\n$)/gs;
  const reviewArchiveMatch = content.match(/^reviewArchive:(.*)$/smi);
  if (reviewArchiveMatch) {
    const reviewArchiveContent = reviewArchiveMatch[1];
    const updatedReviewArchive = reviewArchiveContent.replace(reviewArchivePattern, replaceAppHash);
    content = content.slice(0, reviewArchiveMatch.index) + 'reviewArchive:' + updatedReviewArchive;
  }

  return content;
}

async function writeFile(filePath, content) {
  await fs.promises.writeFile(filePath, content, 'utf-8');
}

async function main(directory) {
  const markdownFiles = await findMarkdownFiles(directory);
  let processedCount = 0;
  for (const file of markdownFiles) {
    if (await processFile(file)) {
      processedCount += 1;
    }
  }
  logInfo(`Successfully processed ${processedCount} out of ${markdownFiles.length} files.`);
  console.log(`Modified ${processedCount} files out of ${markdownFiles.length}.`);

  // Close the log stream
  logStream.end();
}

// Execute the main function if the script is run directly
if (process.argv[1] === __filename) {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Usage: node markdown_processor.mjs <directory>');
    process.exit(1);
  }
  const directory = args[0];
  main(directory).catch((error) => {
    logError(`Error in main: ${error.message}`);
    console.error(`Error: ${error.message}`);
  });
}
