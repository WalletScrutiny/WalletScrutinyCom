import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml'; 
import { nostrConnect, createAssetRegistration, createAttestation } from '../src/attestation_utils.mjs';

console.debug = function() {};

async function parseFile(filePath, folderName) {
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

        const data = yaml.load(yamlContent, { schema: yaml.FAILSAFE_SCHEMA }); // Use js-yaml with FAILSAFE_SCHEMA to prevent date parsing
        console.debug('Parsed YAML data:', JSON.stringify(data));

        const appId = data.appId || '';
        let appHash = null;
        let version = null;
        let status = null;

        // We try to get the information from 3 sources:
        // 1. reviewArchive
        // 2. current test results in the body of the file between ==== Begin Results ==== and ==== End Results ====
        // 3. information on the root of the file
        // We give priority to the information in the root of the file, as it's the most current.

        // Get info from reviewArchive[0] if available
        if (data.reviewArchive && data.reviewArchive.length > 0) {
            console.log(`Processing reviewArchive (${appId})...`);
            version = data.reviewArchive[0].version;

            if (data.reviewArchive[0].appHash) {
                appHash = data.reviewArchive[0].appHash;
            } else if (data.reviewArchive[0].appHashes && data.reviewArchive[0].appHashes.length > 0) {
                appHash = data.reviewArchive[0].appHashes[0];
            }
        } else {
            console.debug('   No reviewArchive hash found.');
        }

        // Get info from current test results in the body of the file, if available
        const resultsMatch = content.match(/===== Begin Results =====([\s\S]+?)===== End Results =====/);
        if (resultsMatch) {
            const currentTestResults = parseResults(resultsMatch[1]);

            if (currentTestResults.apkVersionName && currentTestResults.appHash) {
                version = currentTestResults.apkVersionName;
                appHash = currentTestResults.appHash;
            } else {
                console.debug('********************  Skipping current test result due to missing appHash and appHashes:', currentTestResults);
            }
        }

        // Get info from the root of the file
        if (data.version || data.appHashes) {
            version = data.version;
            if (data.appHashes && data.appHashes.length > 0) {
                appHash = data.appHashes[0];
            }
        }

        // Process Results (text after the YAML front matter)
        const contentAfterYaml = 
            content.split(/---\n[\s\S]+?\n---/)[1]
                .replace('{% include testScript.html %}', '<a href="https://walletscrutiny.com/testScript/" target="_blank">test script</a>')
                .replace(/{% include walletLink\.html\s+wallet='([^']+)'\s+verdict='true'\s+%}/g, '$1')
                .replace('{{ page.title }}', data.title)
                .replace('{% include asciicast %}', `<div id="ascii_cast_player"></div>`)
                .slice(0, 50000);


        if (['fewusers', 'custodial', 'nosource', 'nowallet', 'fake', 'nobtc', 'nosendreceive', 'obfuscated', 'wip'].includes(data.verdict)) {
            //console.log(`   Skipping verdict (${appId}): ${data.verdict}`);
            return;
        }
        if (['reproducible', 'nonverifiable', 'ftbfs'].includes(data.verdict)) {
            console.log(`   Verdict (${appId}): ${data.verdict}`);

            switch (data.verdict) {
                case 'reproducible':
                    status = 'reproducible';
                    break;
                case 'nonverifiable':
                    status = 'not_reproducible';
                    break;
                case 'ftbfs':
                    status = 'ftbfs';
                    break;
            }
        }

        // Create events for each review in reviewArchive
        if (data.reviewArchive && data.reviewArchive.length > 0) {
            for (const [index, review] of [...data.reviewArchive].reverse().entries()) {
                console.log(`\nAppId: ${appId} - Review #${data.reviewArchive.length - index}:`);
                console.log('  Date:', review.date);
                console.log('  Version:', review.version);
                console.log('  Verdict:', review.verdict);

                if (!review.appHashes || review.appHashes.length === 0) {
                    console.log('  --------------------------------------------------------------  No appHashes found');
                    continue;
                }
                if (review.appHashes) {
                    console.log('  AppHashes:');
                    review.appHashes.forEach(hash => console.log('    -', hash));
                }

                await createNostrEvents({
                    sha256: review.appHashes[0],     // TODO: ¿más de uno como en nunchuk?
                    appId,
                    version: review.version,
                    platform: folderName,
                    name: folderName === 'android' ? "Google Play extracted apk" : "Binary obtained from the manufacturer's website",
                    content: review.gitRevision ? `Legacy verification by WalletScrutiny (${review.date}). See details <a target="_blank" href="https://gitlab.com/walletscrutiny/walletScrutinyCom/blob/${review.gitRevision}/_${folderName}/${appId}.md">here</a>.` : '',
                    status: review.verdict
                });
            }
        }

        if (!appHash || !version || !data.title || !data.verdict || !folderName || !contentAfterYaml) {
            console.error(`     Not enough information to create nostr event for ${appId}:`);
            /*
            console.error({
                appId,
                appHash,
                version,
                title: data.title,
                verdict: data.verdict,
                folderName,
                contentAfterYaml
            });
            */
            //console.error(data);
            //process.exit(1);
        } else {
            await createNostrEvents({
                sha256: appHash,
                appId,
                version,
                platform: folderName,
                name: folderName === 'android' ? "Google Play extracted apk" : "Binary obtained from the manufacturer's website",
                content: contentAfterYaml,
                status: status
            });
        }

    } catch (error) {
        console.error(`**************************************************\n Error parsing file ${filePath}: ${error.message}\n**************************************************`);
    }
}

async function createNostrEvents({
    sha256,
    appId,
    version,
    platform,
    name,
    content,
    status
}) {
    console.log('   ----------------------------------------------------------------\n    Nostr events will be created with this data:\n   ----------------------------------------------------------------', {
        sha256,
        appId,
        version,
        platform,
        name,
        content,
        status
    });

    console.log('   ----------------------------------------------------------------\n    Creating asset registration...\n   ----------------------------------------------------------------');
    const assetEvent = await createAssetRegistration({
        sha256,
        appId,
        version,
        platform,
        name
    });
    await new Promise(resolve => setTimeout(resolve, 300));

    const assetEventId = assetEvent.id;

    console.log('   ----------------------------------------------------------------\n    Creating attestation...\n   ----------------------------------------------------------------');
    await createAttestation({
        sha256,
        content,
        status,
        assetEventId
    });
    await new Promise(resolve => setTimeout(resolve, 300));
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

// Direct execution check
if (import.meta.url === `file://${process.argv[1]}`) {
    // Get Nostr private key and directory paths from command-line arguments
    if (process.argv.length < 4) {
        console.log('Usage: node verdictsToAttestations.mjs <nostr_private_key> <directory_path1> [directory_path2 ...]');
        process.exit(1);
    }

    const nostrPrivateKey = process.argv[2];
    const directoryPaths = process.argv.slice(3);

    console.log('Connecting to Nostr relays...');
    await nostrConnect(nostrPrivateKey);
    await new Promise(resolve => setTimeout(resolve, 5000));

    if (directoryPaths.length === 0) {
        console.log('Please provide at least one directory path as a command-line argument.');
        process.exit(1);
    }

    (async () => {
        for (const directoryPath of directoryPaths) {
            console.log(`Processing directory: ${directoryPath}`);
            const files = fs.readdirSync(directoryPath);
            console.log(`Found ${files.length} files in directory: ${directoryPath}`);
        
            let folderName = path.basename(directoryPath);
            folderName = folderName.startsWith('_') ? folderName.slice(1) : folderName;
        
            for (const filename of files) {
                if (filename.endsWith('.md')) {
                    const filePath = path.join(directoryPath, filename);
                    console.debug(`Processing file: ${filePath}`);
        
                    await parseFile(filePath, folderName);
                }
            }
        }

        console.log(`Total directories processed: ${directoryPaths.length}`);
        process.exit(0);
    })();
}
