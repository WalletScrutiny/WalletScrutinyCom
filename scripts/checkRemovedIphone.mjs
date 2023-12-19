// This script checks every defunct app in the _iphone/ folder to see if it
// returns a 404. If so, it will rename meta: defunct to meta:removed. 
// Otherwise it will be left alone. All the results will be output in a list called 

import apple from 'app-store-scraper';
import fs from 'fs/promises';
import path from "path";
import helper from "./helper.mjs";

let notRemovedDefunctApps = [];
let removedApps = [];

const category = "iphone";
const folder = `_${category}/`;

async function checkDefunctApps() {
  try {
    const files = await fs.readdir(folder);

    for (const fileName of files) {
      const content = helper.loadFromFile(path.join(folder, fileName));
      const header = content.header;
      const body = content.body;
      const appId = header.appId;
      const appCountry = header.appCountry || 'us';
      const idd = header.idd;

      if (header.meta === "defunct") {
        try {
          await apple.app({
            id: idd,
            lang: 'en',
            country: appCountry,
            throttle: 2
          });
          notRemovedDefunctApps.push(appId);
        } catch (error) {
          if (`${error}`.search(/404/) > -1) {
            header.meta = "removed";
            helper.writeResult(folder, header, body);
            removedApps.push(appId);
          } else {
            console.error(`\nError with ${appId} https://apps.apple.com/${appCountry}/app/id${idd} : ${JSON.stringify(err)}`);
          }
        }
      }
    }

    const formatOutput = (apps, title) => {
      return `${title}:\n- ${apps.join('\n- ')}\n\nTotal Number of ${title.toLowerCase()}: ${apps.length}\n---\n`;
    };

    // Writing the results to a text file
    const output = formatOutput(notRemovedDefunctApps, "apps that are defunct, but not removed") +
      formatOutput(removedApps, "apps that have been removed from the App Store");

    fs.writeFile('list-of-processed-defunct-iphone.md', output, err => {
      if (err) {
        console.error('Error writing to file', err);
      } else {
        console.log('Results written to list-of-processed-defunct-iphone.md');
      }
    });
  } catch (err) {
    console.error(`Error reading files from ${folder}: ${err.message}`);
  }
}

checkDefunctApps();

