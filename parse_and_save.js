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
                        apkVersionName: reviewData.version || '',
                        apkVersionCode: '',
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
                    apkVersionName: currentTestResults.apkVersionName || '',
                    apkVersionCode: currentTestResults.apkVersionCode || '',
                    verdict: currentTestResults.verdict || '',
                    appHash: currentTestResults.appHash,
                    date: currentTestResults.date
                });
            } else {
                console.log('Skipping current test result due to missing appHash:', currentTestResults);
            }
        } else {
            console.log('No current test results found.');
        }

        console.log('Final entries:', entries);
        return entries;
    } catch (error) {
        console.error(`Error parsing file ${filePath}: ${error.message}`);
        return [];
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
        if (line === '' || line.startsWith('#')) continue;

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
                var value = parts[1].trim();
                if (value.length == 0) {
                    value = undefined;
                }
                console.log('-- key', '[' + key + ']', 'value', '[' + value + ']', 'last', last, 'dict', dict);
                dict[key] = value;
                // console.log('-- result[last][key]', result[last][key]);
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
    const files = fs.readdirSync(directoryPath);
    let filesProcessed = 0;

    files.forEach(filename => {
        if (filename.endsWith('.md')) {
            const filePath = path.join(directoryPath, filename);
            console.log(`Processing file: ${filePath}`);
            const entries = parseFile(filePath);
            outputData.push(...entries);
            filesProcessed += 1;
        }
    });

    console.log(`Total files processed: ${filesProcessed}`);
    fs.writeFileSync('output.json', JSON.stringify(outputData.filter(entry => entry.appHash), null, 2), 'utf8');
    console.log('Output written to output.json');
}

// Directory path to the folder containing your Markdown files
const directoryPath = process.argv[2] || '/path/to/your/markdown/files';
console.log(`Using directory path: ${directoryPath}`);
processFilesInDirectory(directoryPath);
