import gplay from 'google-play-scraper';
import fs from 'fs/promises';
import path from 'path';
import helper from './helper.mjs';
import { Semaphore } from 'async-mutex';

process.env.TZ = 'UTC'; // fix timezone issues
const sem = new Semaphore(50);
const stats = {
  removed: 0,
  updated: 0,
  remaining: 0
};

const category = 'android';
const folder = `_${category}/`;
const headers = ('wsId title altTitle authors users appId bitcoinOrgId alternativeStores ' +
                'appCountry released updated version reviews website repository ' +
                'icon bugbounty meta verdict date signer twitter social ' +
                'social redirect_from developerName builds features').split(' ');

async function refreshAll (ids, markRemoved) {
  var files;
  if (ids) {
    files = ids.map(it => `${it}.md`);
  } else {
    files = await fs.readdir(folder);
  }
  console.log(`Updating ${files.length} 🤖 files ...`);
  stats.remaining = files.length;
  files.forEach(file => { refreshFile(file, undefined, markRemoved); });
  helper.updateLastRemovedCheck();
}

function refreshFile (fileName, content, markRemoved) {
  sem.acquire().then(function ([, release]) {
    if (content === undefined) {
      content = { header: helper.getEmptyHeader(headers), body: undefined };
      helper.loadFromFile(path.join(folder, fileName), content);
    }
    const header = content.header;
    const body = content.body;
    const appId = header.appId;
    const appCountry = header.appCountry || 'us';
    helper.checkHeaderKeys(header, headers);
    
    const isDefunctOrRemoved = 'defunct,removed'.includes(header.meta);
    const shouldCheckDefunctOrRemoved = isDefunctOrRemoved && helper.removedCheckDue;
    
    if (!helper.was404(`${folder}${appId}`) && (!isDefunctOrRemoved || shouldCheckDefunctOrRemoved)) {
      try {
        gplay.app({
          appId: appId,
          lang: 'en',
          country: appCountry
        }).then(app => {
          const iconPath = `images/wIcons/android/${appId}`;
          updateFromApp(header, app);
          if (header.meta === 'removed') {
            header.meta = 'ok';
            header.date = new Date();
          }
          helper.downloadImageFile(`${app.icon}`, iconPath, iconExtension => {
            if (iconExtension) {
              header.icon = `${appId}.${iconExtension}`;
            }
            stats.updated++;
            helper.writeResult(folder, header, body);
            stats.remaining--;
            release();
          });
        }, (err) => {
          if (`${err}`.search(/404/) > -1) {
            if (header.meta === 'defunct' || markRemoved) {
              header.meta = "removed";
              header.date = new Date();
              helper.writeResult(folder, header, body);
            } else if (header.meta !== "removed") {
              helper.addRemovedIfNew(`_${category}/${appId}`);
            }
          } else {
            console.error(`\nError with https://play.google.com/store/apps/details?id=${appId} : ${JSON.stringify(err)}`);
          }
          stats.remaining--;
          release();
        }).catch(err => {
          console.error(`Does this ever get triggered 1? ${err}`);
        });
      } catch (err) {
        console.error(`Does this ever get triggered 2? ${err}`);
      }
    } else {
      stats.removed++;
      helper.writeResult(folder, header, body);
      stats.remaining--;
      release();
    }
  }).catch(err => {
    console.error(`Does this ever get triggered 3? ${err}`);
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
  header.released = header.released || app.released || null;

  if (header.meta !== 'obsolete' && header.meta !== 'defunct' && header.meta !== 'removed' && app.minInstalls < 1000) {
    header.meta = 'fewusers';
  } else if (header.meta === 'fewusers' && app.minInstalls >= 1000) {
    header.meta = 'ok';
  }

  header.meta = header.meta || 'ok';

  // if api reports an older updated date than what we determined, keep our data
  if (app.updated && !isNaN(new Date(app.updated))) {
  header.updated = header.updated && new Date(header.updated) > new Date(app.updated)
      ? header.updated
    : new Date(app.updated);
  } else {
    header.updated = header.updated;
  }
  header.users = app.minInstalls;
  header.reviews = app.reviews || null;
  header.website = app.developerWebsite || header.website || null;
  header.date = header.date || new Date();
  header.developerName = app.developer || header.developerName || 'Unknown Developer(s)';
  helper.updateMeta(header);
}

function add (appIds) {
  console.log(`Adding ${appIds.length} apps ...`);

  appIds.forEach(appId => {
    const path = `_android/${appId}.md`;
    fs.access(path)
      .catch(() => {
        const header = helper.getEmptyHeader(headers);
        header.appId = appId;
        header.verdict = 'wip';
        refreshFile(`${appId}.md`, { header: header, body: '' });
      });
  });
}

function update (appIds) {
  console.log(`Updating ${appIds.length} apps ...`);

  appIds.forEach(appId => {
    const path = `_android/${appId}.md`;
    fs.access(path)
      .then(() => {
        refreshFile(`${appId}.md`);
      });
  });
}

export default {
  category,
  headers,
  refreshAll,
  refreshFile,
  stats,
  add,
  update
};
