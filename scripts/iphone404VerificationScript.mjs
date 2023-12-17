// This script checks every defunct app in the _iphone/ folder to see if it returns a 404. If so, it will rename meta: defunct to meta:removed. 
// Otherwise it will be left alone. All the results will be output in a list called 
process.env.TZ = "UTC"; // fix timezone issues

import apple from 'app-store-scraper';
import fs from 'fs/promises';
import path from "path";
import helper from "./helper.mjs";
import { Semaphore } from 'async-mutex';


let notRemovedDefunctApps = [];
let removedApps = [];

const sem = new Semaphore(1);

const stats = {
  removed: 0,
  updated: 0,
  remaining: 0,
};

const category = "iphone";
const folder = `_${category}/`;
const headers = ('wsId title altTitle authors appId appCountry idd released ' +
  'updated version stars reviews size website repository issue ' +
  'icon bugbounty meta verdict date signer reviewArchive ' +
  'twitter social features developerName').split(' ')

async function checkDefunctApps() {
  try {
    const files = await fs.readdir(folder);

    for (const fileName of files) {
      const content = {
        header: helper.getEmptyHeader(headers),
        body: undefined,
      };

      helper.loadFromFile(path.join(folder, fileName), content);

      const header = content.header;
      const body = content.body
      const appId = header.appId;
      const appCountry = header.appCountry || 'us'
      const idd = header.idd

      if (header.meta === "defunct") {
        try {
          await apple.app({
            id: idd,
            lang: 'en',
            country: appCountry,
            throttle: 2
          });
          //console.log(`App with appId ${appId} is still available.`);
          notRemovedDefunctApps.push(appId);
        } catch (error) {
          if (`${error}`.search(/404/) > -1) {
            header.meta = "removed"
            helper.writeResult(folder, header, body)
            //console.log(`App with appId ${appId} is no longer available.`);
            removedApps.push(appId);
          } else {
            console.error(`\nError with ${appId} https://apps.apple.com/${appCountry}/app/id${idd} : ${JSON.stringify(err)}`)
          }
        }
      }
    }

    function formatOutput(apps, title) {
      return `${title}:\n- ${apps.join('\n- ')}\n\nTotal Number of ${title.toLowerCase()}: ${apps.length}\n---\n`;
    }

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

