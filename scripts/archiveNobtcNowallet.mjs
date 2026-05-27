// This script scans markdown files in _mobile, _hardware, bearer, _desktop and _others
// directories, identifies files with verdict "nobtc" or "nowallet", then archives them
// by deleting their images, removing specified fields, and moving to _archived.

import fs from 'fs/promises';
import path from 'path';
import helper from './helper.mjs';

const PLATFORMS = ['mobile', 'hardware', 'bearer', 'desktop', 'others'];
const TARGET_VERDICTS = ['nobtc', 'nowallet'];
const FIELDS_TO_KEEP = ['title', 'appId', 'meta', 'verdict'];

const IMAGE_SUBDIRS = ['', 'small', 'tiny'];
const ARCHIVE_DIR = '_archived';

async function deleteImage(iconPath) {
  try {
    await fs.unlink(iconPath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

async function deleteImagesForFile(platform, icon) {
  if (!icon?.trim()) {
    return { deleted: 0, errors: [] };
  }

  const basePath = path.join('images', 'wIcons', platform);
  const imagePaths = IMAGE_SUBDIRS.map(subdir => 
    subdir ? path.join(basePath, subdir, icon) : path.join(basePath, icon)
  );

  const results = await Promise.allSettled(
    imagePaths.map(imagePath => deleteImage(imagePath))
  );

  let deleted = 0;
  const errors = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value) {
      deleted++;
    } else if (result.status === 'rejected') {
      errors.push({ path: imagePaths[index], error: result.reason.message });
    }
  });

  return { deleted, errors };
}

function removeFields(header) {
  const updatedHeader = {};
  FIELDS_TO_KEEP.forEach(field => {
    if (header.hasOwnProperty(field)) {
      updatedHeader[field] = header[field];
    }
  });
  return updatedHeader;
}

async function ensureArchiveDirectory(platform) {
  const archiveDir = path.join(ARCHIVE_DIR, platform);
  await fs.mkdir(archiveDir, { recursive: true });
  return archiveDir;
}

async function getAllUnderscoreDirectories() {
  const entries = await fs.readdir('.', { withFileTypes: true });
  return entries
    .filter(entry => entry.isDirectory() && entry.name.startsWith('_'))
    .map(entry => entry.name);
}

async function getAllMdFilesInDirectory(dirPath) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const files = [];
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        const subFiles = await getAllMdFilesInDirectory(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }
    return files;
  } catch {
    return [];
  }
}

async function updateFileReferences(filePath, walletIdentifier) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const escapedWalletId = walletIdentifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(
      `\\{%\\s*include\\s+walletLink\\.html\\s+wallet=['"]${escapedWalletId}['"]\\s+verdict=(?:['"]?(?:true|false)['"]?)\\s*%\\}`,
      'g'
    );
    const newContent = content.replace(
      pattern,
      `{% include walletLinkArchived.html wallet='${walletIdentifier}' %}`
    );
    
    if (newContent !== content) {
      await fs.writeFile(filePath, newContent, 'utf8');
      return { updated: true, filePath };
    }
    return { updated: false };
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
    return { updated: false, error: error.message };
  }
}

async function updateWalletLinkReferences(walletIdentifier) {
  const underscoreDirs = await getAllUnderscoreDirectories();
  const allMdFiles = await Promise.all(
    underscoreDirs.map(dir => getAllMdFilesInDirectory(dir))
  );
  const mdFiles = allMdFiles.flat();
  
  const results = await Promise.allSettled(
    mdFiles.map(filePath => updateFileReferences(filePath, walletIdentifier))
  );
  
  const updatedFiles = [];
  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value.updated) {
      updatedFiles.push(result.value.filePath);
    }
  });

  return { totalUpdated: updatedFiles.length, updatedFiles };
}

function getWalletIdentifier(platform, fileName) {
  const fileNameWithoutExt = fileName.replace(/\.md$/, '');
  return `${platform}/${fileNameWithoutExt}`;
}

async function processMobileFile(fileName) {
  const folder = '_mobile';
  const filePath = path.join(folder, fileName);

  try {
    const content = helper.loadFromFile(filePath);
    const { header, body } = content;

    const matchesTarget = TARGET_VERDICTS.includes(header.verdict) ||
      TARGET_VERDICTS.includes(header.android?.verdict) ||
      TARGET_VERDICTS.includes(header.iphone?.verdict);
    if (!matchesTarget) {
      return { processed: false, reason: 'verdict does not match' };
    }

    const updatedHeader = removeFields(header);
    delete updatedHeader.android;
    delete updatedHeader.iphone;

    let imagesDeleted = 0;
    const imageErrors = [];
    for (const storePlatform of ['android', 'iphone']) {
      const icon = header[storePlatform]?.icon;
      if (!icon?.trim()) continue;
      const result = await deleteImagesForFile(storePlatform, icon);
      imagesDeleted += result.deleted;
      imageErrors.push(...result.errors);
    }

    const archiveDir = await ensureArchiveDirectory('mobile');
    const archiveFilePath = path.join(archiveDir, fileName);
    const updatedContent = helper.getResult(updatedHeader, '');
    await fs.writeFile(archiveFilePath, updatedContent, 'utf8');

    const slug = fileName.replace(/\.md$/, '');
    const walletIdentifier = `mobile/${slug}`;
    const referenceUpdate = await updateWalletLinkReferences(walletIdentifier);

    await fs.unlink(filePath);

    return {
      processed: true,
      fileName,
      imagesDeleted,
      imageErrors,
      referencesUpdated: referenceUpdate.totalUpdated,
      referenceFiles: referenceUpdate.updatedFiles
    };
  } catch (error) {
    return {
      processed: false,
      fileName,
      error: error.message
    };
  }
}

async function processFile(platform, fileName) {
  if (platform === 'mobile') {
    return processMobileFile(fileName);
  }

  const folder = `_${platform}`;
  const filePath = path.join(folder, fileName);
  
  try {
    const content = helper.loadFromFile(filePath);
    const { header, body } = content;

    if (!TARGET_VERDICTS.includes(header.verdict)) {
      return { processed: false, reason: 'verdict does not match' };
    }

    const updatedHeader = removeFields(header);
    const imageResult = await deleteImagesForFile(platform, header.icon);
    const archiveDir = await ensureArchiveDirectory(platform);
    
    const archiveFilePath = path.join(archiveDir, fileName);
    const updatedContent = helper.getResult(updatedHeader, '');
    await fs.writeFile(archiveFilePath, updatedContent, 'utf8');

    const walletIdentifier = getWalletIdentifier(platform, fileName);
    const referenceUpdate = await updateWalletLinkReferences(walletIdentifier);

    await fs.unlink(filePath);

    return {
      processed: true,
      fileName,
      imagesDeleted: imageResult.deleted,
      imageErrors: imageResult.errors,
      referencesUpdated: referenceUpdate.totalUpdated,
      referenceFiles: referenceUpdate.updatedFiles
    };
  } catch (error) {
    return {
      processed: false,
      fileName,
      error: error.message
    };
  }
}

function formatProcessMessage(platform, fileName, result) {
  const refMsg = result.referencesUpdated > 0 
    ? `, updated ${result.referencesUpdated} reference(s)` 
    : '';
  return `✓ Processed ${platform}/${fileName} (deleted ${result.imagesDeleted} images${refMsg})`;
}

async function scanPlatform(platform) {
  const folder = `_${platform}`;
  
  try {
    const files = await fs.readdir(folder);
    const mdFiles = files.filter(f => f.endsWith('.md'));
    const results = [];
    const errors = [];

    for (const fileName of mdFiles) {
      const result = await processFile(platform, fileName);
      
      if (result.processed) {
        results.push(result);
        console.log(formatProcessMessage(platform, fileName, result));
      } else if (result.error) {
        errors.push({ fileName, error: result.error });
        console.error(`✗ Error processing ${platform}/${fileName}: ${result.error}`);
      }
    }

    return {
      scanned: mdFiles.length,
      processed: results.length,
      errors,
      results
    };
  } catch (error) {
    console.error(`Error reading directory ${folder}: ${error.message}`);
    return { scanned: 0, processed: 0, errors: [], results: [] };
  }
}

function printSummary(totalScanned, totalProcessed, allErrors) {
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

  printSummary(totalScanned, totalProcessed, allErrors);
  console.log('\nArchive process completed.');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

