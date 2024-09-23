const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml'); 

function parseFile(filePath) {
    try {
        console.log(`Reading file: ${filePath}`);
        const content = fs.readFileSync(filePath, 'utf8');

        const yamlPart = content.match(/---\n([\s\S]+?)\n---/);
        if (!yamlPart) {
            console.log('YAML front matter not found.');
            throw new Error('YAML front matter not found');
        }

        const yamlContent = yamlPart[1];
        console.log('YAML content extracted:', yamlContent);

        const data = yaml.load(yamlContent, { schema: yaml.FAILSAFE_SCHEMA }); // Use js-yaml with FAILSAFE_SCHEMA to prevent date parsing
        console.log('Parsed YAML data:', data);

        console.log('Parsed YAML data:', JSON.stringify(data));

        const appId = data.appId || '';
        const signer = data.signer || '';

        let entries = [];

        // Process reviewArchive if available
        if (data.reviewArchive) {
            console.log('Processing reviewArchive entries...');
            data.reviewArchive.forEach(review => {
                const reviewData = review;
                console.log('Review entry:', reviewData);
                if (reviewData.appHash) {
                    entries.push({
                        appId,
                        signer,
                        version: reviewData.version || '',
                        verdict: reviewData.verdict || '',
                        appHash: reviewData.appHash,
                        date: reviewData.date || ''
                    });
                } else {
                    console.log('Skipping review entry due to missing appHash:', reviewData);
                }
            });
        } else {
            console.log('No reviewArchive entries found.');
        }

        // Process current test results if available
        const resultsMatch = content.match(/===== Begin Results =====([\s\S]+?)===== End Results =====/);
        if (resultsMatch) {
            console.log('Processing current test results...');
            const resultsContent = resultsMatch[1];
            console.log('Current test results content:', resultsContent);

            const currentTestResults = parseResults(resultsContent);
            console.log('Parsed current test results:', currentTestResults);

            if (currentTestResults.appHash) {
                entries.push({
                    appId: currentTestResults.appId || '',
                    signer: currentTestResults.signer || '',
                    version: currentTestResults.apkVersionName || '',
                    verdict: currentTestResults.verdict || '',
                    appHash: currentTestResults.appHash || data.appHash,
                    date: currentTestResults.date  || data.date
                });
            } else {
                console.log('Skipping current test result due to missing appHash:', currentTestResults);
            }
        } else {
            console.log('No current test results found.');
        }

        console.log('Final entries:', entries);
        return entries; // Return only entries
    } catch (error) {
        console.error(`Error parsing file ${filePath}: ${error.message}`);
        return [];
    }
}

function parseResults(resultsString) {
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

function processFilesInDirectory(directoryPath) {
    const outputData = [];
    const files = fs.readdirSync(directoryPath);
    let filesProcessed = 0;

    let folderName = path.basename(directoryPath);
    folderName = folderName.startsWith('_') ? folderName.slice(1) : folderName;

    files.forEach(filename => {
        if (filename.endsWith('.md')) {
            const filePath = path.join(directoryPath, filename);
            console.log(`Processing file: ${filePath}`);

            const entries = parseFile(filePath);
            entries.forEach(entry => {
                entry.platform = folderName;
            });
            outputData.push(...entries);
            filesProcessed += 1;
        }
    });

    console.log(`Found ${outputData.length} appHashes in ${filesProcessed} files in directory: ${directoryPath}.`);
    return outputData; // Return only outputData
}

function processAllDirectories(directoryPaths) {
    let attestationData = [];
    directoryPaths.forEach(directoryPath => {
        console.log(`Processing directory: ${directoryPath}`);
        const outputData = processFilesInDirectory(directoryPath); 
        attestationData.push(...outputData);
    });

    console.log(`Total directories processed: ${directoryPaths.length}`);
    
    // Filter attestations and write to file
    const filteredAttestations = attestationData.filter(entry => entry.appHash);
    let attestationsFile = 'assets/attestations.json';
    fs.writeFileSync(attestationsFile, JSON.stringify(filteredAttestations, null, 2), 'utf8');
    console.log(`${filteredAttestations.length} attestations written to ${attestationsFile}`);
}

// Get directory paths from command-line arguments
const directoryPaths = process.argv.slice(2);

if (directoryPaths.length === 0) {
    console.log('Please provide at least one directory path as a command-line argument.');
    process.exit(1);
}

console.log(`Using directory paths: ${directoryPaths.join(', ')}`);
processAllDirectories(directoryPaths);
