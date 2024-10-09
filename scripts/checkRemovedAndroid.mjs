// File: scripts/checkRemovedAndroid.mjs

// Import necessary dependencies
import gplay from 'google-play-scraper';
import fs from 'fs/promises';
import path from 'path';
import helper from './helper.mjs';
import { isAppAvailable, cooldown, countryCodes, logCountryProgress } from './countryAvailabilityChecker.mjs';

let notRemovedDefunctApps = [];
let removedApps = [];

const category = 'android';
const folder = `_${category}/`;

async function checkDefunctApps() {
  try {
    // Filter files that have 'meta: defunct' in the front matter
    const files = await fs.readdir(folder);
    const defunctFiles = [];
    for (const fileName of files) {
      const content = helper.loadFromFile(path.join(folder, fileName));
      if (content.header.meta === 'defunct') {
        defunctFiles.push(fileName);
      }
    }

    const totalDefunctFiles = defunctFiles.length;
    const totalFiles = files.length;
    let processedFiles = 0;
    
    console.log(`Starting processing of ${totalDefunctFiles} defunct files out of a total of ${totalFiles} in the directory '${folder}':`);

    for (const fileName of defunctFiles) {
      processedFiles++;
      console.log(`Processing file ${processedFiles} of ${totalDefunctFiles}: ${fileName}`);
      const content = helper.loadFromFile(path.join(folder, fileName));
      const header = content.header;
      const appId = header.appId;
      const appCountry = header.appCountry || 'US';
      let availableCountry = null;

      for (const country of countryCodes) {
        logCountryProgress(country, true);
        const isAvailable = await isAppAvailable(appId, country, 'android');
        if (isAvailable) {
          availableCountry = country;
          break;
        }
      }

      if (availableCountry) {
        console.log(`App ${appId} is available in country: ${availableCountry}`);
        notRemovedDefunctApps.push(appId);
      } else {
        console.log(`App ${appId} is not available in any of the specified countries. Marking as removed.`);
        header.meta = 'removed';
        helper.writeResult(folder, header, content.body);
        removedApps.push(appId);
      }
    }

    const formatOutput = (apps, title) => {
      return `${title}:
- ${apps.join('\n- ')}

Total Number of ${title.toLowerCase()}: ${apps.length}\n---\n`;
    };

    const output =
      formatOutput(notRemovedDefunctApps, 'Apps that are defunct, but not removed') +
      formatOutput(removedApps, 'Apps that are removed from the Play Store');

    await fs.writeFile('list-of-processed-defunct-android.md', output, 'utf8');
    console.log('Results written to list-of-processed-defunct-android.md');
  } catch (err) {
    console.error(`Error reading files from ${folder}: ${err.message}`);
  }
}

checkDefunctApps();