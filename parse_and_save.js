const fs = require('fs');
const path = require('path');

function parseFile(filePath) {
    try {
        console.log(`Reading file: ${filePath}`);
        const content = fs.readFileSync(filePath, 'utf8');
        console.log('File content read successfully.');

        const yamlPart = content.match(/---\n([\s\S]+?)\n---/);
        if (!yamlPart) {
            console.log('YAML front matter not found.');
            throw new Error('YAML front matter not found');
        }

        const yamlContent = yamlPart[1];
        console.log('YAML content extracted:', yamlContent);

        const data = parseYAML(yamlContent);
        console.log('Parsed YAML data:', data);

        console.log('Parsed YAML data:', JSON.stringify(data));

        const appId = data.appId || '';
        const signer = data.signer || '';
        const date = data.date || '';

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
        return { appId, entries };
    } catch (error) {
        console.error(`Error parsing file ${filePath}: ${error.message}`);
        return { appId: '', entries: [] };
    }
}

function parseYAML(yamlString) {
    console.log('yamlString:', yamlString)
    const lines = yamlString.split('\n');
    const result = {};
    let currentContext = [result];
    let currentIndent = 0;
    let last;

    let dict;

    for (let line of lines) {
        line = line.trimRight();
        if (line === '' || line.startsWith('#') || line.startsWith('>-')) continue;

        if (line.startsWith('- ')) {

            console.log('result[last] ==> ', result[last], typeof result[last])
            if (result[last] == undefined) {
                result[last] = [];
            }

            const trimmedLine = line.slice(2).trim();
            console.log('line1', '[' + trimmedLine + ']');

            if (trimmedLine.includes(':')) {
                dict = {};
                var parts = trimmedLine.split(': ');
                if (parts.length > 0) {
                    var key = parts[0];
                    var value = parts[1];
                    console.log('- key', '[' + key + ']', 'value', '[' + value + ']');
                    dict[key] = value;
                    result[last].push(dict);
                }

            }
            else {
                result[last].push(trimmedLine);
            }

        }
        else if (line.startsWith('  ')) {
            const trimmedLine = line.slice(2).trim();
            console.log('line2', '[' + trimmedLine + ']');

            var parts = trimmedLine.split(':');
            if (parts.length > 0) {
                var key = parts[0].trim();
                var value = parts.slice(1).join(':').trim();
                if (value.length == 0) {
                    value = undefined;
                }
                console.log('-- key', '[' + key + ']', 'value', '[' + value + ']', 'last', last, 'dict', dict);
                if (dict) {
                    dict[key] = value;
                } else {
                    console.log('Warning: Trying to set property on undefined dict. Skipping.');
                }
            }
        }
        else {
            const trimmedLine = line.trim();
            console.log('line3', '[' + trimmedLine + ']');
            var parts = trimmedLine.split(':');
            if (parts.length > 0) {
                var key = parts[0].trim();
                var value = parts[1].trim();
                if (value.length == 0) {
                    value = undefined;
                }

                console.log('key', '[' + key + ']', 'value', '[' + value + ']');
                result[key] = value;
                last = key;
            }
        }
    }

    return result;
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
    const appIds = new Set(); // Use a Set to store unique appIds
    const files = fs.readdirSync(directoryPath);
    let filesProcessed = 0;

    files.forEach(filename => {
        if (filename.endsWith('.md')) {
            const filePath = path.join(directoryPath, filename);
            console.log(`Processing file: ${filePath}`);
            const { appId, entries } = parseFile(filePath);
            
            let folderName = path.basename(directoryPath);
            folderName = folderName.startsWith('_') ? folderName.slice(1) : folderName;
            
            entries.forEach(entry => {
                entry.type = folderName;
            });
            
            outputData.push(...entries);
            if (appId) {
                appIds.add(appId);
            }
            filesProcessed += 1;
        }
    });

    console.log(`Total files processed in ${directoryPath}: ${filesProcessed}`);
    return { outputData, appIds };
}

function processAllDirectories(directoryPaths) {
    let attestationData = [];
    let allAppIds = new Set();

    directoryPaths.forEach(directoryPath => {
        console.log(`Processing directory: ${directoryPath}`);
        const { outputData, appIds } = processFilesInDirectory(directoryPath);
        attestationData.push(...outputData);
        appIds.forEach(id => allAppIds.add(id));
    });

    console.log(`Total directories processed: ${directoryPaths.length}`);
    
    // Filter attestations and write to file
    const filteredAttestations = attestationData.filter(entry => entry.appHash);
    let attestationsFile = 'assets/attestations.json';
    fs.writeFileSync(attestationsFile, JSON.stringify(filteredAttestations, null, 2), 'utf8');
    console.log(`${filteredAttestations.length} attestations written to ${attestationsFile}`);

    // Write app-ids.json
    const appIdsArray = Array.from(allAppIds);
    let appIdsFile = 'assets/app-ids.json';
    fs.writeFileSync(appIdsFile, JSON.stringify(appIdsArray, null, 2), 'utf8');
    console.log(`${appIdsArray.length} App IDs written to ${appIdsFile}`);
}

// Get directory paths from command-line arguments
const directoryPaths = process.argv.slice(2);

if (directoryPaths.length === 0) {
    console.log('Please provide at least one directory path as a command-line argument.');
    process.exit(1);
}

console.log(`Using directory paths: ${directoryPaths.join(', ')}`);
processAllDirectories(directoryPaths);
