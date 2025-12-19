// This script scans markdown files in _android, _iphone, _hardware, bearer, _desktop and _others
// directories, identifies files with verdict "nobtc" or "nowallet", then archives them
// by deleting their images, removing specified fields, and moving to _archived.

import fs from 'fs/promises';
import path from 'path';
import helper from './helper.mjs';

const PLATFORMS = ['android', 'iphone', 'hardware', 'bearer', 'desktop', 'others'];
const TARGET_VERDICTS = ['nobtc', 'nowallet'];
const FIELDS_TO_REMOVE = [
    'altTitle', 'issue', 'bugbounty', 'signer', 'twitter', 'social', 'builds', 'stars',
    'ratings', 'reviews', 'icon', 'features', 'redirect_from', 'date', 'appCountry',
    'repository', 'authors', 'appHashes', 'users', 'updated', 'developerName', 'released',
    'version', 'website', 'wsId'
];

async function deleteImage(iconPath) {
  try {
    await fs.unlink(iconPath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, which is fine
      return false;
    }
    throw error;
  }
}

async function deleteImagesForFile(platform, icon) {
  if (!icon || icon.trim() === '') {
    return { deleted: 0, errors: [] };
  }

  const basePath = path.join('images', 'wIcons', platform);
  const imagePaths = [
    path.join(basePath, icon),
    path.join(basePath, 'small', icon),
    path.join(basePath, 'tiny', icon)
  ];

  let deleted = 0;
  const errors = [];

  for (const imagePath of imagePaths) {
    try {
      const wasDeleted = await deleteImage(imagePath);
      if (wasDeleted) {
        deleted++;
      }
    } catch (error) {
      errors.push({ path: imagePath, error: error.message });
    }
  }

  return { deleted, errors };
}

function removeFields(header) {
  const updatedHeader = { ...header };
  FIELDS_TO_REMOVE.forEach(field => {
    delete updatedHeader[field];
  });
  return updatedHeader;
}

async function ensureArchiveDirectory(platform) {
  const archiveDir = path.join('_archived', platform);
  try {
    await fs.mkdir(archiveDir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
  return archiveDir;
}

async function processFile(platform, fileName) {
  const folder = `_${platform}/`;
  const filePath = path.join(folder, fileName);
  
  try {
    // Load file content
    const content = helper.loadFromFile(filePath);
    const header = content.header;
    const body = content.body;

    // Check verdict
    const verdict = header.verdict;
    if (!verdict || !TARGET_VERDICTS.includes(verdict)) {
      return { processed: false, reason: 'verdict does not match' };
    }

    // Remove specified fields
    const updatedHeader = removeFields(header);

    // Delete images
    const icon = header.icon;
    const imageResult = await deleteImagesForFile(platform, icon);

    // Ensure archive directory exists
    const archiveDir = await ensureArchiveDirectory(platform);

    // Write updated content to archive
    const archiveFilePath = path.join(archiveDir, fileName);
    const updatedContent = helper.getResult(updatedHeader, body);
    await fs.writeFile(archiveFilePath, updatedContent, 'utf8');

    // Delete original file
    await fs.unlink(filePath);

    return {
      processed: true,
      fileName,
      imagesDeleted: imageResult.deleted,
      imageErrors: imageResult.errors
    };
  } catch (error) {
    return {
      processed: false,
      fileName,
      error: error.message
    };
  }
}

async function scanPlatform(platform) {
  const folder = `_${platform}/`;
  let files;
  
  try {
    files = await fs.readdir(folder);
  } catch (error) {
    console.error(`Error reading directory ${folder}: ${error.message}`);
    return { scanned: 0, matched: 0, processed: 0, errors: [] };
  }

  const mdFiles = files.filter(f => f.endsWith('.md'));
  let processed = 0;
  const errors = [];
  const results = [];

  for (const fileName of mdFiles) {
    const result = await processFile(platform, fileName);
    
    if (result.processed) {
      processed++;
      results.push(result);
      console.log(`✓ Processed ${platform}/${fileName} (deleted ${result.imagesDeleted} images)`);
    } else if (result.error) {
      errors.push({ fileName, error: result.error });
      console.error(`✗ Error processing ${platform}/${fileName}: ${result.error}`);
    }
  }

  return {
    scanned: mdFiles.length,
    processed,
    errors,
    results
  };
}

async function main() {
  console.log('Starting archive process for nobtc/nowallet files...\n');

  let totalScanned = 0;
  let totalProcessed = 0;
  const allErrors = [];

  for (const platform of PLATFORMS) {
    console.log(`\nProcessing platform: ${platform}`);
    console.log('─'.repeat(50));
    
    const result = await scanPlatform(platform);
    totalScanned += result.scanned;
    totalProcessed += result.processed;
    allErrors.push(...result.errors.map(e => ({ platform, ...e })));

    console.log(`  Scanned: ${result.scanned} files`);
    console.log(`  Processed: ${result.processed} files`);
    if (result.errors.length > 0) {
      console.log(`  Errors: ${result.errors.length}`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('Summary:');
  console.log(`  Total files scanned: ${totalScanned}`);
  console.log(`  Total files processed: ${totalProcessed}`);
  
  if (allErrors.length > 0) {
    console.log(`  Total errors: ${allErrors.length}`);
    console.log('\nErrors:');
    allErrors.forEach(({ platform, fileName, error }) => {
      console.log(`  - ${platform}/${fileName}: ${error}`);
    });
  }

  console.log('\nArchive process completed.');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

