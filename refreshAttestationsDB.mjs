import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

console.debug = function () {};

function parseFile (filePath) {
  try {
    console.debug(`Reading file: ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf8');

    const yamlPart = content.match(/---\n([\s\S]+?)\n---/);
    if (!yamlPart) {
      console.log('YAML front matter not found.');
      throw new Error('YAML front matter not found');
    }

    const yamlContent = yamlPart[1];
    console.debug('YAML content extracted:', yamlContent);

    // Use js-yaml with FAILSAFE_SCHEMA to prevent date parsing
    const data = yaml.load(yamlContent, { schema: yaml.FAILSAFE_SCHEMA });
    console.debug('Parsed YAML data:', JSON.stringify(data));

    const appId = data.appId || '';
    const signer = data.signer || '';

    const entries = [];

    // Process reviewArchive if available
    if (data.reviewArchive && data.reviewArchive != null) {
      console.debug('Processing reviewArchive entries...');
      data.reviewArchive.forEach(review => {
        const reviewData = review;

        console.debug('Review entry:', reviewData);
        if ((reviewData.appHash || reviewData.appHashes) && reviewData.verdict) {
          entries.push({
            appId,
            signer,
            version: reviewData.version || '',
            verdict: reviewData.verdict || '',
            appHashes: reviewData.appHashes || [reviewData.appHash],
            date: reviewData.date || ''
          });
        } else {
          console.debug('Skipping review entry due to missing appHash or appHashes:', reviewData);
        }
      });
    } else {
      console.debug('No reviewArchive entries found.', data.reviewArchive);
    }

    // Process reviewCurrent if available
    if (data.reviewCurrent && data.reviewCurrent != null) {
      const reviewData = data.reviewCurrent;
      if (reviewData.appHashes && reviewData.verdict) {
        entries.push({
          appId,
          signer,
          version: reviewData.version || '',
          verdict: reviewData.verdict || '',
          appHashes: reviewData.appHashes || [],
          date: reviewData.date || ''
        });
      } else {
        console.debug('Skipping reviewCurrent entry due to missing appHashes or verdict:', reviewData);
      }
    } else {
      // Process current test results if available
      const resultsMatch = content.match(/===== Begin Results =====([\s\S]+?)===== End Results =====/);
      if (resultsMatch) {
        const resultsContent = resultsMatch[1];

        const currentTestResults = parseResults(resultsContent);

        if (currentTestResults.appHash || currentTestResults.appHashes || data.appHash || data.appHashes) {
          entries.push({
            appId: currentTestResults.appId || '',
            signer: currentTestResults.signer || '',
            version: currentTestResults.apkVersionName || '',
            verdict: currentTestResults.verdict || '',
            appHashes: currentTestResults.appHashes || data.appHashes ||
                [currentTestResults.appHash || data.appHash].filter(Boolean),
            date: currentTestResults.date || data.date
          });
        } else {
          console.debug('Skipping current test result due to missing appHash and appHashes:', currentTestResults);
        }
      } else {
        console.debug('No current test results found.');
      }
    }

    return entries; // Return only entries
  } catch (error) {
    console.error(`Error parsing file ${filePath}: ${error.message}`);
    return [];
  }
}

function parseResults (resultsString) {
  const lines = resultsString.split('\n');
  const result = {};

  lines.forEach(line => {
    if (line.includes(':')) {
      const [key, value] = line.split(':').map(part => part.trim());
      result[key] = value;
    }
  });

  return result;
}

function processFilesInDirectory (directoryPath) {
  const outputData = [];
  const files = fs.readdirSync(directoryPath);
  let filesProcessed = 0;

  let folderName = path.basename(directoryPath);
  folderName = folderName.startsWith('_') ? folderName.slice(1) : folderName;

  files.forEach(filename => {
    if (filename.endsWith('.md')) {
      const filePath = path.join(directoryPath, filename);
      console.debug(`Processing file: ${filePath}`);

      const entries = parseFile(filePath);
      entries.forEach(entry => {
        entry.platform = folderName;
      });
      outputData.push(...entries);
      filesProcessed += 1;
    }
  });

  console.log(`Found ${outputData.length} appHashes in ${filesProcessed} files in directory: ${directoryPath}.`);
  return outputData;
}

function processAllDirectories (directoryPaths) {
  const attestationData = [];
  directoryPaths.forEach(directoryPath => {
    console.log(`Processing directory: ${directoryPath}`);
    const outputData = processFilesInDirectory(directoryPath);
    attestationData.push(...outputData);
  });

  console.log(`Total directories processed: ${directoryPaths.length}`);

  // Filter attestations and write to file
  const filteredAttestations = attestationData.filter(entry => entry.appHashes && entry.appHashes.length > 0);
  const attestationsFile = 'assets/attestations.json';
  fs.writeFileSync(attestationsFile, JSON.stringify(filteredAttestations, null, 2), 'utf8');
  console.log(`${filteredAttestations.length} attestations written to ${attestationsFile}`);
}

// Direct execution check
if (import.meta.url === `file://${process.argv[1]}`) {
  // Get directory paths from command-line arguments
  const directoryPaths = process.argv.slice(2);

  if (directoryPaths.length === 0) {
    console.log('Please provide at least one directory path as a command-line argument.');
    process.exit(1);
  }

  console.log(`Using directory paths: ${directoryPaths.join(', ')}`);
  processAllDirectories(directoryPaths);
}

// Export functionality for use in other modules
export { processAllDirectories, processFilesInDirectory, parseFile };
