process.env.TZ = "UTC"; // fix timezone issues

import gplay from "google-play-scraper";
import fs from "fs/promises";
import path from "path";
import helper from "./helper.mjs";
import { Semaphore } from "async-mutex";

const sem = new Semaphore(50);
const stats = {
  removed: 0,
  updated: 0,
  remaining: 0,
};

const category = "android";
const folder = `_${category}/`;
const headers = (
  "wsId title altTitle authors users appId appCountry released " +
  "updated version stars ratings reviews size website repository " +
  "issue icon bugbounty meta verdict date signer reviewArchive " +
  "twitter social redirect_from " +
  "developerName features"
).split(" ");

async function checkDefunctApps() {
  const notRemovedDefunctApps = [];
  try {

    const files = await fs.readdir(folder);

    for (const fileName of files) {
      const content = {
        header: helper.getEmptyHeader(headers),
        body: undefined,
      };
      helper.loadFromFile(path.join(folder, fileName), content);

      const header = content.header;
      const appId = header.appId;

      if (header.meta === "defunct") {
        try {
          await gplay.app({
            appId: appId,
            lang: "en",
            country: header.appCountry || "us",
          });

          // If no 404 error, app is not removed from the Play Store
          console.log(`App with appId ${appId} is still available.`);
          notRemovedDefunctApps.push(appId);
        } catch (error) {
          if (`${error}`.search(/404/) > -1) {
            // App is removed from the Play Store
            header.meta = "removed";
            header.date = new Date();
            helper.writeResult(folder, header, content.body);
            console.log(
              `App with appId ${appId} is removed from the Play Store.`
            );
          } else {
            console.error(
              `Error checking app with appId ${appId}: ${error.message}`
            );
          }
        }
      }
    }

    if (notRemovedDefunctApps.length > 0) {
      console.log("Apps marked as 'defunct' but not removed from the Play Store:");
      console.log(notRemovedDefunctApps);
      console.log(notRemovedDefunctApps.length);
    } else {
      console.log("All 'defunct' apps have been processed and removed from the Play Store.");
    }
  } catch (err) {
    console.error(`Error reading files from ${folder}: ${err.message}`);
  }

}

// Call the function to check defunct apps
checkDefunctApps();

function update (appIds) {
  console.log(`Updating ${appIds.length} apps ...`)

  appIds.forEach(appId => {
    const path = `_android/${appId}.md`
    fs.access(path)
      .then(() => {
        refreshFile(`${appId}.md`)
      })
  })
}
