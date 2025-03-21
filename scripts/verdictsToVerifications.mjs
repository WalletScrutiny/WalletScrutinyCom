import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { nostrConnect, createVerification } from '../src/verifications_utils.mjs';

function getStatusFromVerdict(verdict) {
  switch (verdict) {
    case 'reproducible':
      return 'reproducible';
    case 'nonverifiable':
      return 'not_reproducible';
    case 'ftbfs':
      return 'ftbfs';
    default:
      return null;
  }
}

console.debug = function() {};

async function parseFile(filePath, folderName) {
  const verdictsToIgnore = ['fewusers', 'custodial', 'nosource', 'nowallet', 'fake', 'nobtc', 'nosendreceive', 'obfuscated', 'wip'];
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
    let appHashes = null;
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
        appHashes = [data.reviewArchive[0].appHash];
      } else if (data.reviewArchive[0].appHashes && data.reviewArchive[0].appHashes.length > 0) {
        appHashes = data.reviewArchive[0].appHashes;
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
        appHashes = [currentTestResults.appHash];
      } else {
        console.debug('********************  Skipping current test result due to missing appHash and appHashes:', currentTestResults);
      }
    }

    // Get info from the root of the file
    if (data.version || data.appHashes) {
      version = data.version;
    }
    if (data.appHashes && data.appHashes.length > 0) {
      appHashes = data.appHashes;
    }

    // Process Results (text after the YAML front matter)
    const contentAfterYaml =
      content.split(/---\n[\s\S]+?\n---/)[1]
        .replace('{% include testScript.html %}', '<a href="https://walletscrutiny.com/testScript/" target="_blank">test script</a>')
        .replace(/{% include walletLink\.html\s+wallet='([^']+)'\s+verdict='true'\s+%}/g, '$1')
        .replace('{{ page.title }}', data.title)
        .replace('{% include asciicast %}', `<div id="ascii_cast_player"></div>`)
        .slice(0, 50000);


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

        if (!verdictsToIgnore.includes(review.verdict) && review.version !== 'VARY') {
          await createNostrEvents({
            hashes: review.appHashes,
            appId,
            version: review.version,
            platform: folderName,
            description: folderName === 'android' ? "Google Play extracted apk" : "Binary obtained from the manufacturer's website",
            content: review.gitRevision ? `Legacy verification by WalletScrutiny (${review.date}). See details <a target="_blank" href="https://gitlab.com/walletscrutiny/walletScrutinyCom/blob/${review.gitRevision}/_${folderName}/${appId}.md">here</a>.` : `Legacy verification by WalletScrutiny (${review.date}).`,
            status: getStatusFromVerdict(review.verdict)
          });
        }
      }
    }

    if (!appHashes || !version || !data.title || !data.verdict || !folderName || !contentAfterYaml) {
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
      if (!verdictsToIgnore.includes(data.verdict) && version !== 'VARY') {
        await createNostrEvents({
          hashes: appHashes,
          appId,
          version,
          platform: folderName,
          description: folderName === 'android' ? "Google Play extracted apk" : "Binary obtained from the manufacturer's website",
          content: contentAfterYaml,
          status: getStatusFromVerdict(data.verdict)
        });
      }
    }

  } catch (error) {
    console.error(`**************************************************\n Error parsing file ${filePath}: ${error.message}\n**************************************************`);
    process.exit(1);
  }
}

async function createNostrEvents({
                                   hashes,
                                   appId,
                                   version,
                                   platform,
                                   description,
                                   content,
                                   status
                                 }) {
  console.log('   ----------------------------------------------------------------\n    Nostr events will be created with this data:\n   ----------------------------------------------------------------', {
    hashes,
    appId,
    version,
    platform,
    description,
    content,
    status
  });

  await createVerification({
    hashes,
    description,
    content,
    status,
    appId,
    version,
    platform
  });
  await new Promise(resolve => setTimeout(resolve, 4000));
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
    console.log('Usage: node verdictsToVerifications.mjs <nostr_nsec_private_key> <directory_path1> [directory_path2 ...]');
    process.exit(1);
  }

  const nostrNsecPrivateKey = process.argv[2];
  const directoryPaths = process.argv.slice(3);

  console.log('Connecting to Nostr relays...');
  await nostrConnect(nostrNsecPrivateKey);
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
