import apple from 'app-store-scraper';
import fs from 'fs/promises';
import path from 'path';
import helper from './helper.mjs';
import { Semaphore } from 'async-mutex';

process.env.TZ = 'UTC'; // fix timezone issues

const sem = new Semaphore(1);
const stats = {
  removed: 0,
  updated: 0,
  remaining: 0
};

const category = 'iphone';
const folder = `_${category}/`;
const headers = ('wsId title altTitle authors appId appCountry idd released ' +
                'updated version stars reviews website repository issue ' +
                'icon bugbounty meta verdict appHashes date signer reviewArchive ' +
                'twitter social features developerName').split(' ');

async function refreshAll (ids, markDefunct) {
  var files;
  if (ids) {
    files = ids.map(it => `${it}.md`);
  } else {
    files = await fs.readdir(folder);
  }
  console.log(`Updating ${files.length} 🍎 files ...`);
  stats.remaining = files.length;
  files.forEach(file => { refreshFile(file, undefined, markDefunct); });
}

function refreshFile (fileName, content, markDefunct) {
  sem.acquire().then(function ([, release]) {
    if (content === undefined) {
      content = { header: helper.getEmptyHeader(headers), body: undefined };
      helper.loadFromFile(path.join(folder, fileName), content);
    }
    const header = content.header;
    const body = content.body;
    const appId = header.appId;
    const idd = header.idd;
    const appCountry = header.appCountry || 'us';
    helper.checkHeaderKeys(header, headers);
    if (!'defunct,removed'.includes(header.meta)) {
      apple.app({
        id: idd,
        lang: 'en',
        country: appCountry,
        throttle: 2
      }).then(app => {
        const iconPath = `images/wIcons/iphone/${appId}`;
        helper.downloadImageFile(`${app.icon}`, iconPath, iconExtension => {
          header.icon = `${appId}.${iconExtension}`;
          updateFromApp(header, app);
          stats.updated++;
          helper.writeResult(folder, header, body);
          stats.remaining--;
          release();
        });
      }, (err) => {
        if (`${err}`.search(/404/) > -1) {
          if (markDefunct) {
            header.meta = 'removed';
            header.date = new Date();
            helper.writeResult(folder, header, body);
          } else {
            helper.addDefunctIfNew(`_${category}/${appId}`);
          }
        } else {
          console.error(`\nError with ${appId} https://apps.apple.com/${appCountry}/app/id${idd} : ${JSON.stringify(err)}`);
        }
        stats.remaining--;
        release();
      });
    } else {
      stats.removed++;
      helper.writeResult(folder, header, body);
      stats.remaining--;
      release();
    }
  });
}

/**
 * Update the header from app
 **/
function updateFromApp (header, app) {
  if (app === undefined) {
    return;
  }
  header.title = app.title || header.title;
  header.version = (app.version || 'various').replace(/["\\]*/g, ''); // strip " and \ that won't be missed in the version string
  header.meta = header.meta || 'ok';
  // if api reports an older updated date than what we determined, keep our data
  header.updated = header.updated && new Date(header.updated) > new Date(app.updated)
    ? header.updated
    : new Date(app.updated);
  header.released = header.released || app.released;
  header.stars = app.score;
  header.reviews = app.reviews;
  header.website = app.developerWebsite || header.website || '';
  header.date = header.date || new Date();
  header.developerName = app.developer || header.developerName || 'Unknown Developer(s)';
  helper.updateMeta(header);
}

function add (newIdds) {
  console.log(`Adding skeletons for ${newIdds.length} apps ...`);

  newIdds.forEach(param => {
    var idd, appId, country;
    if (param.includes('/')) {
      const parts = param.split('/');
      country = parts[0];
      param = parts[1];
    }
    if (isNaN(param)) {
      appId = param;
    } else {
      idd = param;
    }
    if (appId) {
      refreshFile(`${appId}.md`);
    } else {
      apple.app({
        id: idd,
        lang: 'en',
        country: country || 'cl',
        throttle: 20
      }).then(app => {
        const path = `_iphone/${app.appId}.md`;
        fs.access(path)
          .then(() => {
            refreshFile(`${app.appId}.md`);
          })
          .catch(() => {
            const header = helper.getEmptyHeader(headers);
            header.appId = app.appId;
            header.idd = idd;
            header.appCountry = country;
            header.verdict = 'wip';
            refreshFile(`${app.appId}.md`, { header: header, body: '' });
          });
      }, err => {
        console.error(`Error with id ${idd}: ${JSON.stringify(err)}`);
      });
    }
  });
}

export default {
  category,
  headers,
  refreshAll,
  refreshFile,
  stats,
  add
};
