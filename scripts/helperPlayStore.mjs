import gplay from 'google-play-scraper';
import fs from 'fs/promises';
import path from 'path';
import helper from './helper.mjs';
import {
  MOBILE_DIR,
  loadMobileFromFile,
  writeMobileFile,
  mobileDefunctKey,
  ensurePlatformBlock,
  metaUpdateContext,
  resolveAndroidFilenames,
  findMobileFileByAndroidAppId,
} from './mobileWalletStore.mjs';
import { Semaphore } from 'async-mutex';

process.env.TZ = 'UTC'; // fix timezone issues
const sem = new Semaphore(50);
const stats = {
  removed: 0,
  updated: 0,
  remaining: 0
};

const category = 'android';
const headers = ('wsId title altTitle authors users appId bitcoinOrgId alternativeStores ' +
                'appCountry released updated version reviews website repository ' +
                'icon bugbounty meta verdict signer twitter social ' +
                'social redirect_from developerName builds features').split(' ');

async function refreshAll (ids, markRemoved) {
  const files = await resolveAndroidFilenames(ids);
  console.log(`Updating ${files.length} 🤖 files ...`);
  stats.remaining = files.length;
  files.forEach(file => { refreshFile(file, undefined, markRemoved); });
  helper.updateLastRemovedCheck();
}

function refreshFile (fileName, content, markRemoved) {
  sem.acquire().then(function ([, release]) {
    const filePath = path.join(MOBILE_DIR, fileName);
    if (content === undefined) {
      const loaded = loadMobileFromFile(filePath);
      content = { mobile: loaded.mobile, body: loaded.body, slug: loaded.slug };
    }
    const { mobile, body, slug } = content;
    const android = ensurePlatformBlock(mobile, 'android');
    const appId = android.appId;
    if (!appId) {
      stats.remaining--;
      release();
      return;
    }
    const appCountry = android.appCountry || mobile.appCountry || 'us';
    helper.checkHeaderKeys(android, headers);

    const metaCtx = metaUpdateContext(mobile, 'android');
    const isDefunctOrRemoved = 'defunct,removed'.includes(mobile.meta);
    const shouldCheckDefunctOrRemoved = isDefunctOrRemoved && helper.removedCheckDue;
    const defunctKey = mobileDefunctKey(slug || path.basename(fileName, '.md'));

    if (!helper.was404(defunctKey) && (!isDefunctOrRemoved || shouldCheckDefunctOrRemoved)) {
      try {
        gplay.app({
          appId: appId,
          lang: 'en',
          country: appCountry
        }).then(app => {
          updateFromApp(android, app, mobile);
          if (mobile.meta === 'removed') {
            mobile.meta = 'ok';
            metaCtx.date = new Date();
          }
          const iconPath = `images/wIcons/android/${appId}`;
          helper.downloadImageFile(`${app.icon}`, iconPath, iconExtension => {
            if (iconExtension) {
              android.icon = `${appId}.${iconExtension}`;
            }
            stats.updated++;
            writeMobileFile(filePath, mobile, body);
            stats.remaining--;
            release();
          });
        }, (err) => {
          if (`${err}`.search(/404/) > -1) {
            if (mobile.meta === 'defunct' || markRemoved) {
              mobile.meta = 'removed';
              metaCtx.date = new Date();
              writeMobileFile(filePath, mobile, body);
            } else if (mobile.meta !== 'removed') {
              helper.addRemovedIfNew(defunctKey);
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
      writeMobileFile(filePath, mobile, body);
      stats.remaining--;
      release();
    }
  }).catch(err => {
    console.error(`Does this ever get triggered 3? ${err}`);
  });
}

function updateFromApp (android, app, mobile) {
  if (app === undefined) {
    return;
  }
  if (app.title) {
    mobile.title = app.title;
  }
  android.version = (app.version || 'various').replace(/["\\]*/g, '');
  android.released = android.released || app.released || null;

  if (mobile.meta !== 'obsolete' && mobile.meta !== 'defunct' && mobile.meta !== 'removed' && app.minInstalls < 1000) {
    mobile.meta = 'fewusers';
  } else if (mobile.meta === 'fewusers' && app.minInstalls >= 1000) {
    mobile.meta = 'ok';
  }

  mobile.meta = mobile.meta || 'ok';

  if (app.updated && !isNaN(new Date(app.updated))) {
    android.updated = android.updated && new Date(android.updated) > new Date(app.updated)
      ? android.updated
      : new Date(app.updated);
  }
  android.users = app.minInstalls;
  android.reviews = app.reviews || null;
  if (app.developerWebsite) {
    mobile.website = app.developerWebsite;
  }
  const metaCtx = metaUpdateContext(mobile, 'android');
  metaCtx.date = metaCtx.date || new Date();
  android.developerName = app.developer || android.developerName || 'Unknown Developer(s)';
  helper.updateMeta(metaCtx);
}

function add (appIds) {
  console.log(`Adding ${appIds.length} apps ...`);

  appIds.forEach(appId => {
    findMobileFileByAndroidAppId(appId)
      .then((existing) => {
        if (existing) {
          refreshFile(existing);
          return;
        }
        const fileName = `${appId}.md`;
        const filePath = path.join(MOBILE_DIR, fileName);
        return fs.access(filePath)
          .then(() => refreshFile(fileName))
          .catch(() => {
            const mobile = {
              title: null,
              verdict: 'wip',
              meta: 'ok',
              android: { appId },
            };
            refreshFile(fileName, { mobile, body: '', slug: appId });
          });
      });
  });
}

function update (appIds) {
  console.log(`Updating ${appIds.length} apps ...`);

  appIds.forEach(appId => {
    findMobileFileByAndroidAppId(appId)
      .then((file) => {
        if (file) {
          refreshFile(file);
        } else {
          const fileName = `${appId}.md`;
          fs.access(path.join(MOBILE_DIR, fileName))
            .then(() => refreshFile(fileName))
            .catch(() => console.error(`No mobile wallet found for android appId ${appId}`));
        }
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
