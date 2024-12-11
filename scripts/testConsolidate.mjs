// scripts/consolidate_review_archive_app_hashes.mjs

// Run as 'node scripts/consolidate_review_archive_app_hashes.mjs /path/to/markdown/files'
import fs from 'fs';
import path from 'path';

// Helper function to parse dates consistently
function parseReviewDate(dateStr) {
  return new Date(dateStr);
}

export async function consolidateAppHashesByVersion(content) {
  // Find the reviewArchive section
  const sections = content.split(/^(?=[a-zA-Z])/m);
  const reviewArchiveIndex = sections.findIndex(section => section.startsWith('reviewArchive:'));
  
  if (reviewArchiveIndex === -1) return content;

  // Extract all entries from the reviewArchive section
  const reviewEntries = [];
  const reviewEntryRegex = /^-\s*date:\s*(\S+)\s*\n\s*version:\s*['"]?([^'"}\s]+)['"]?\s*\n\s*(?:appHash(?:es)?):?\s*(?:\[(.*?)\]|(\S+))\s*\n\s*(?:commit|gitRevision):\s*(\S+)\s*\n\s*verdict:\s*(\S+)\s*$/gm;
  
  let reviewArchiveSection = sections[reviewArchiveIndex];
  let reviewEntry;
  
  while ((reviewEntry = reviewEntryRegex.exec(reviewArchiveSection)) !== null) {
    const [_, date, version, hashesArray, singleHash, gitRevision, verdict] = reviewEntry;
    let appHashes = [];
    
    if (singleHash) {
      appHashes = [singleHash];
    } else if (hashesArray && hashesArray.trim() !== '') {
      appHashes = hashesArray.split(',').map(h => h.trim()).filter(h => h !== '' && h !== '[]');
    }
    
    // Store the parsed date for accurate comparison
    reviewEntries.push({ 
      date,
      parsedDate: parseReviewDate(date),
      version, 
      appHashes, 
      gitRevision, 
      verdict 
    });
  }

  // Group entries by version number
  const versionGroups = new Map();
  for (const entry of reviewEntries) {
    const version = entry.version;
    if (!versionGroups.has(version)) {
      versionGroups.set(version, []);
    }
    versionGroups.get(version).push(entry);
  }

  // Consolidate entries with same version
  let newReviewArchive = ['reviewArchive:'];
  for (const versionEntries of versionGroups.values()) {
    if (versionEntries.length > 1) {
      // Sort by date to get earliest entry (oldest date first)
      versionEntries.sort((a, b) => a.parsedDate - b.parsedDate);
      const earliestEntry = versionEntries[0];
      
      // Combine all hashes for this version
      const allVersionHashes = [...new Set(versionEntries.flatMap(e => e.appHashes))];
      const hashesStr = allVersionHashes.length ? `[${allVersionHashes.join(', ')}]` : '[]';
      
      newReviewArchive.push(
        `- date: ${earliestEntry.date}`,
        `  version: ${earliestEntry.version}`,
        `  appHashes: ${hashesStr}`,
        `  gitRevision: ${earliestEntry.gitRevision}`,
        `  verdict: ${earliestEntry.verdict}`
      );
    } else {
      const entry = versionEntries[0];
      const hashesStr = entry.appHashes.length ? `[${entry.appHashes.join(', ')}]` : '[]';
      newReviewArchive.push(
        `- date: ${entry.date}`,
        `  version: ${entry.version}`,
        `  appHashes: ${hashesStr}`,
        `  gitRevision: ${entry.gitRevision}`,
        `  verdict: ${entry.verdict}`
      );
    }
  }

  // Replace the reviewArchive section and maintain other sections
  sections[reviewArchiveIndex] = newReviewArchive.length > 1 ? newReviewArchive.join('\n') + '\n' : 'reviewArchive:\n';
  return sections.join('');
}

// Main execution
const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Please provide the path to process');
  process.exit(1);
}

const inputPath = args[0];
if (fs.statSync(inputPath).isDirectory()) {
  // Process all .md files in directory
  const files = fs.readdirSync(inputPath)
    .filter(f => f.endsWith('.md'))
    .map(f => path.join(inputPath, f));
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const newContent = await consolidateAppHashesByVersion(content);
    if (newContent !== content) {
      fs.writeFileSync(file, newContent, 'utf-8');
      console.log(`Updated ${file}`);
    }
  }
} else {
  // Process single file
  const content = fs.readFileSync(inputPath, 'utf-8');
  const newContent = await consolidateAppHashesByVersion(content);
  if (newContent !== content) {
    fs.writeFileSync(inputPath, newContent, 'utf-8');
    console.log(`Updated ${inputPath}`);
  }
}
