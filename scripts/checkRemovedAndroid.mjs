// This script checks every defunct app in the _android/ folder to see if it
// returns a 404. If so, it will rename meta: defunct to meta:removed. 
// All apps checked will be output in a .md file in the home directory.
// You can run this in the home folder using
// node scripts/android404VerificationScript.mjs

import gplay from 'google-play-scraper';
import fs from 'fs/promises';
import path from "path";
import helper from "./helper.mjs";

let notRemovedDefunctApps = [];
let removedApps = [];

const category = "android";
const folder = `_${category}/`;

async function checkDefunctApps() {
  try {
    const files = await fs.readdir(folder);

    for (const fileName of files) {
      const content = helper.loadFromFile(path.join(folder, fileName));
      const header = content.header;
      const appId = header.appId;
      const appCountry = header.appCountry || 'us';
      if (header.meta === "defunct") {
        try {
          await gplay.app({
            appId: appId,
            lang: "en",
            country: appCountry
          });

          //console.log(`App with appId ${appId} is still available.`);
          notRemovedDefunctApps.push(appId);
        } catch (error) {
          if (`${error}`.search(/404/) > -1) {
            // Sets the meta to removed if playstore returns a 404 error.
            header.meta = "removed";
            helper.writeResult(folder, header, content.body);
            removedApps.push(appId);
          } else {
            console.error(
              `Error checking app with appId ${appId}: ${error.message}`
            );
          }
        }
      }
    }

    const formatOutput = (apps, title) => {
      return `${title}:\n- ${apps.join('\n- ')}\n\nTotal Number of ${title.toLowerCase()}: ${apps.length}\n---\n`;
    };

    const output = formatOutput(notRemovedDefunctApps, "Apps that are defunct, but not removed") +
      formatOutput(removedApps, "Apps that are removed from the Play Store");

    fs.writeFile('list-of-processed-defunct-android.md', output, err => {
      if (err) {
        console.error('Error writing to file', err);
      } else {
        console.log('Results written to list-of-processed-defunct-android.md');
      }
    });
  } catch (err) {
    console.error(`Error reading files from ${folder}: ${err.message}`);
  }

}

checkDefunctApps();
