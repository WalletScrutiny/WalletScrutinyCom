// This script checks every defunct app in the _iphone/ folder to see if it
// returns a 404. If so, it will rename meta: defunct to meta:removed. 
// All results will be output in a file called list-of-processed-defunct-iphone.md
// You can run this in the home folder using
// node scripts/checkRemovedIphone.mjs
// To check a single file: node scripts/checkRemovedIphone.mjs co.busha.apple.md

import apple from 'app-store-scraper';
import fs from 'fs/promises';
import path from "path";
import helper from "./helper.mjs";

let notRemovedDefunctApps = [];
let removedApps = [];

const category = "iphone";
const folder = `_${category}/`;

// Get the filename from command line arguments if provided
const targetFile = process.argv[2];

async function checkDefunctApps() {
  try {
    console.log("Processing iPhone apps marked as defunct...");
    
    // If a specific file is provided, only check that file
    let files = [];
    if (targetFile) {
      // Check if the file exists
      try {
        await fs.access(path.join(folder, targetFile));
        files = [targetFile];
        console.log(`Checking single file: ${targetFile}`);
      } catch (error) {
        console.error(`Error: File ${targetFile} not found in ${folder}`);
        return;
      }
    } else {
      // Otherwise, get all files in the directory
      files = await fs.readdir(folder);
      console.log(`Found ${files.length} total files in ${folder}`);
    }
    
    let defunctCount = 0;
    let processedCount = 0;
    
    for (const fileName of files) {
      const content = helper.loadFromFile(path.join(folder, fileName));
      const header = content.header;
      const body = content.body;
      const appId = header.appId;
      const appCountry = header.appCountry || 'us';
      const idd = header.idd;

      if (header.meta === "defunct") {
        defunctCount++;
        process.stdout.write(`Processing ${fileName} (${processedCount+1}/${defunctCount})... `);
        
        // List of country codes to try if the primary one fails
        // Start with the app's specified country or 'us' as default
        const countriesToTry = [appCountry];
        
        // Add common alternative regions if not already included
        const commonRegions = [
          'in', // India
          'us', // United States
          'br', // Brazil
          'id', // Indonesia
          'ru', // Russia
          'mx', // Mexico
          'vn', // Vietnam
          'tr', // Turkey
          'jp', // Japan
          'gb', // United Kingdom
          'th', // Thailand
          'pk', // Pakistan
          'ph', // Philippines
          'eg', // Egypt
          'de', // Germany
          'fr', // France
          'it', // Italy
          'kr', // South Korea
          'ca', // Canada
          'sa', // Saudi Arabia
          'ng', // Nigeria
          'za', // South Africa
          'ke', // Kenya
          'au'  // Australia
        ];
        for (const region of commonRegions) {
          if (!countriesToTry.includes(region)) {
            countriesToTry.push(region);
          }
        }
        
        let appFound = false;
        let lastError = null;
        
        // Try each country code until we find the app or exhaust all options
        for (const country of countriesToTry) {
          try {
            await apple.app({
              id: idd,
              lang: 'en',
              country: country,
              throttle: 2
            });
            
            // If we get here, the app was found
            appFound = true;
            notRemovedDefunctApps.push(appId);
            console.log(`\u2713 Still available in ${country} - check if it should remain marked as defunct`);
            break;
          } catch (error) {
            lastError = error;
            // Only continue to the next country if we got a 404
            if (`${error}`.search(/404/) === -1) {
              // Non-404 error, stop trying
              break;
            }
            // If this is the last country to try, we'll handle the error after the loop
          }
        }
        
        // If app wasn't found in any region, mark it as removed
        if (!appFound) {
          if (`${lastError}`.search(/404/) > -1) {
            header.meta = "removed";
            helper.writeResult(folder, header, body);
            removedApps.push(appId);
            console.log(`\u2717 Returned 404 in all regions - marking as removed`);
          } else {
            console.error(`\u26a0 Error with ${appId} https://apps.apple.com/${appCountry}/app/id${idd} : ${lastError.message}`);
          }
        }
        processedCount++;
      }
    }
    
    console.log(`\nProcessed ${processedCount} defunct apps out of ${defunctCount} found.`);
    console.log(`Total files checked: ${files.length}`);
    console.log(`Apps still available: ${notRemovedDefunctApps.length}`);
    console.log(`Apps marked as removed: ${removedApps.length}`);
    console.log("---");

    const formatOutput = (apps, title) => {
      return `${title}:\n- ${apps.join('\n- ')}\n\nTotal Number of ${title.toLowerCase()}: ${apps.length}\n---\n`;
    };

    // Writing the results to a text file
    const output = formatOutput(notRemovedDefunctApps, "Apps that are defunct, but not removed") +
      formatOutput(removedApps, "Apps that have been removed from the App Store");

    fs.writeFile('list-of-processed-defunct-iphone.md', output, err => {
      if (err) {
        console.error('Error writing to file', err);
      } else {
        console.log('Results written to list-of-processed-defunct-iphone.md');
        console.log('Done! Check the file for detailed results.');
      }
    });
  } catch (err) {
    console.error(`Error reading files from ${folder}: ${err.message}`);
  }
}

// Display usage information if requested
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: node scripts/checkRemovedIphone.mjs [filename]

Options:
  [filename]    Optional. Specify a single file to check (e.g., 'co.busha.apple.md')
  --help, -h    Show this help message

Examples:
  node scripts/checkRemovedIphone.mjs                  # Check all iPhone apps
  node scripts/checkRemovedIphone.mjs co.busha.apple.md  # Check only the Busha app
`);
} else {
  checkDefunctApps();
}

