// scripts/localeChecker.mjs

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import axios from 'axios';

// Directory containing the .md files
const directories = ['_iphone']; // Since we're dealing with iOS apps

// Popular country codes
const countryCodes = ['US', 'CN', 'JP', 'GB', 'DE', 'FR', 'CA', 'AU', 'IN', 'KR', 'BR', 'IT', 'ES', 'RU', 'MX'];

function extractFrontMatter(content) {
  const match = /^---\n([\s\S]+?)\n---/m.exec(content);
  return match ? match[1] : null;
}

async function isAppAvailable(appId, countryCode) {
  const url = `https://itunes.apple.com/lookup?id=${appId}&country=${countryCode}`;

  try {
    const response = await axios.get(url);
    return response.data.resultCount > 0;
  } catch (error) {
    console.error(`Error checking app availability in ${countryCode}:`, error.message);
    return false;
  }
}

async function processFiles() {
  for (const dir of directories) {
    const directoryPath = path.join(process.cwd(), dir);
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(directoryPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const frontMatter = extractFrontMatter(fileContent);

        if (frontMatter) {
          const metadata = yaml.load(frontMatter);
          if (metadata.meta === 'removed') {
            console.log(`\n${dir}/${file}`);

            // Extract the App ID from the 'idd' field
            let appId = metadata.idd;

            if (!appId) {
              console.error('App ID not found in metadata.');
              continue;
            }

            const availableIn = [];
            const notAvailableIn = [];

            for (const code of countryCodes) {
              const available = await isAppAvailable(appId, code);
              if (available) {
                availableIn.push(code);
              } else {
                notAvailableIn.push(code);
              }
            }

            console.log(`  - available in: ${availableIn.join(', ') || 'None'}`);
            console.log(`  - not available in: ${notAvailableIn.join(', ') || 'None'}`);
          }
        }
      }
    }
  }
}

// Run the script
processFiles().catch((error) => {
  console.error('An error occurred:', error.message);
});
