// Run as 'node scripts/markdown_processor.mjs /path/to/markdown/files [--verdict=value]'
// Alpha-1.1

import fs from 'fs';
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

async function processFile(filePath, targetVerdict) {
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
        return null;
      } else {
        logInfo(`Processing ${filePath} (incomplete reviewCurrent).`);
      }
    } else {
      logInfo(`Processing ${filePath} (reviewCurrent missing).`);
    }

    // Process content
    const properties = await processContent(content);

    // Skip files that don't match the target verdict
    if (targetVerdict && properties.verdict !== targetVerdict) {
      logInfo(`Skipping ${filePath} - verdict '${properties.verdict}' doesn't match target '${targetVerdict}'`);
      return null;
    }

    const newContent = await processContentWithoutResults(content, properties);
    if (newContent !== content) {
      await writeFile(filePath, newContent);
      logInfo(`Updated ${filePath}`);
      return filePath;
    }
    return null;
  } catch (error) {
    logError(`Error processing file ${filePath}: ${error.message}`);
    return null;
  }
}

// Helper function to extract properties from Results block
function extractResultsProperties(resultsBlock) {
  const properties = {};
  const patterns = {
    version: /apkVersionName:\s*(\S+)/,
    signer: /signer:\s*(\S+)/,
    appHash: /appHash:\s*(\S+)/,
    verdict: /verdict:\s*(\S+)/,
    gitRevision: /commit:\s*(\S+)/
  };

  for (const [key, pattern] of Object.entries(patterns)) {
    const match = resultsBlock.match(pattern);
    if (match && match[1] && match[1].trim() !== '') {
      properties[key] = match[1].trim();
    }
  }

  return properties;
}

// Helper function to extract top-level fields
function extractTopLevelFields(content) {
  const fields = {};
  const patterns = {
    version: /^version:\s*['"]?([^'"}\s]+)['"]?\s*$/m,
    signer: /^signer:\s*(\S+)\s*$/m,
    appHashes: /^appHashes:\s*\[(.*?)\]\s*$/m,
    verdict: /^verdict:\s*(\S+)\s*$/m,
    date: /^date:\s*(\S+)\s*$/m
  };

  for (const [key, pattern] of Object.entries(patterns)) {
    const match = content.match(pattern);
    if (match && match[1] && match[1].trim() !== '') {
      if (key === 'appHashes') {
        // Handle appHashes array format
        const hashesStr = match[1].trim();
        fields[key] = hashesStr ? hashesStr.split(',').map(h => h.trim()) : [];
      } else {
        fields[key] = match[1].trim();
      }
    }
  }

  return fields;
}

async function processContent(content) {
  // Normalize line endings
  content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Find all Results blocks
  const resultsBlocks = [...content.matchAll(/===== Begin Results =====([\s\S]*?)===== End Results =====/g)];
  
  let properties = {};
  
  if (resultsBlocks.length > 0) {
    // Sort Results blocks by date if present, otherwise use the last one
    const blocksWithDates = resultsBlocks.map(match => {
      const block = match[0];
      const dateMatch = block.match(/date:\s*(\S+)/);
      return {
        block,
        date: dateMatch ? new Date(dateMatch[1]) : new Date(0),
        index: match.index
      };
    });

    // Sort by date in descending order (most recent first)
    blocksWithDates.sort((a, b) => b.date - a.date);
    
    // Use the most recent Results block
    const mostRecentBlock = blocksWithDates[0];
    properties = extractResultsProperties(mostRecentBlock.block);
    
    // Split content and process
    const beforeResults = content.slice(0, mostRecentBlock.index);
    const afterResults = content.slice(mostRecentBlock.index + mostRecentBlock.block.length);

    // Extract top-level fields to fill in any missing properties
    const topLevelFields = extractTopLevelFields(beforeResults);
    
    // Merge properties, preferring Results block values over top-level fields
    properties = {
      version: properties.version || topLevelFields.version || '',
      signer: properties.signer || topLevelFields.signer || '',
      appHash: properties.appHash || (topLevelFields.appHashes ? topLevelFields.appHashes[0] : ''),
      verdict: properties.verdict || topLevelFields.verdict || '',
      date: topLevelFields.date || new Date().toISOString().split('T')[0]
    };

    // Process content parts
    const beforeResultsProcessed = await processContentWithoutResults(beforeResults, properties);
    const afterResultsProcessed = await processContentWithoutResults(afterResults, null);

    // Reassemble the content
    content = beforeResultsProcessed + mostRecentBlock.block + afterResultsProcessed;
  } else {
    // No Results block, extract from top-level fields
    const topLevelFields = extractTopLevelFields(content);
    properties = {
      version: topLevelFields.version || '',
      signer: topLevelFields.signer || '',
      appHash: topLevelFields.appHashes ? topLevelFields.appHashes[0] : '',
      verdict: topLevelFields.verdict || '',
      date: topLevelFields.date || new Date().toISOString().split('T')[0]
    };
    
    content = await processContentWithoutResults(content, properties);
  }

  return properties;
}

async function processContentWithoutResults(content, properties) {
  // Split content at both '---' separators
  const parts = content.split('---');
  
  // We need at least 3 parts: top section, metadata section, and review section
  if (parts.length < 3) {
    logError('Content does not have the expected format with two "---" separators');
    return content;
  }

  // Extract the sections
  const [topSection, metadataSection, ...reviewSections] = parts;

  // Split metadata section into lines
  const metadataLines = metadataSection.split('\n');
  
  // Find the index of reviewArchive
  const archiveIndex = metadataLines.findIndex(line => line.startsWith('reviewArchive:'));
  
  // Filter out standalone fields (not under reviewArchive) that will be moved to reviewCurrent
  const filteredLines = metadataLines.filter(line => {
    const trimmed = line.trim();
    if (!trimmed) return true; // Keep empty lines
    if (line.startsWith(' ')) return true; // Keep indented lines (they're under something)
    return !line.startsWith('verdict:') && 
           !line.startsWith('date:') && 
           !line.startsWith('appHashes:') &&
           !line.startsWith('signer:') &&
           !line.startsWith('reviewCurrent:');
  });

  // Build the reviewCurrent block
  const appHashes = properties.appHash ? `[${properties.appHash}]` : '[]';
  const reviewCurrentBlock = [
    'reviewCurrent:',
    `  version: ${properties.version || ''}`,
    `  signer: ${properties.signer || ''}`,
    `  appHashes: ${appHashes}`,
    `  verdict: ${properties.verdict || ''}`,
    `  date: ${properties.date || ''}`
  ];

  // Create new metadata section with reviewCurrent in the right place
  let newMetadataLines = [];
  if (archiveIndex !== -1) {
    const archiveIndexInFiltered = filteredLines.findIndex(line => line.startsWith('reviewArchive:'));
    newMetadataLines = [
      ...filteredLines.slice(0, archiveIndexInFiltered),
      ...reviewCurrentBlock,
      ...filteredLines.slice(archiveIndexInFiltered)
    ];
  } else {
    newMetadataLines = [...filteredLines, ...reviewCurrentBlock];
  }

  // Combine all sections back together, preserving original separators
  return topSection + '---' + 
         newMetadataLines.join('\n') + '---' + 
         reviewSections.join('---');
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

async function main(directory, targetVerdict) {
  try {
    const files = await findMarkdownFiles(directory);
    logInfo(`Found ${files.length} markdown files`);
    
    const processedFiles = await Promise.all(files.map(file => processFile(file, targetVerdict)));
    const updatedFiles = processedFiles.filter(file => file !== null);
    
    logInfo(`Successfully processed ${updatedFiles.length} files`);
    logStream.end();
  } catch (error) {
    logError(`Error in main: ${error.message}`);
    logStream.end();
    process.exit(1);
  }
}

// Execute the main function if the script is run directly
if (process.argv[1] === __filename) {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Please provide a directory path');
    process.exit(1);
  }

  const directory = args[0];
  let targetVerdict = null;

  // Parse command line arguments for verdict
  const verdictArg = args.find(arg => arg.startsWith('--verdict='));
  if (verdictArg) {
    targetVerdict = verdictArg.split('=')[1];
    logInfo(`Filtering for verdict: ${targetVerdict}`);
  }

  main(directory, targetVerdict);
}
