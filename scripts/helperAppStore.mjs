import { app } from '@perttu/app-store-scraper';
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
  resolveIphoneFilenames,
  findMobileFileByIphoneAppId,
} from './mobileWalletStore.mjs';
import { Semaphore } from 'async-mutex';

process.env.TZ = 'UTC'; // fix timezone issues

const sem = new Semaphore(1);
const stats = {
  removed: 0,
  updated: 0,
  remaining: 0
};

const category = 'iphone';
const headers = ('wsId title altTitle authors appId bitcoinOrgId appCountry idd released ' +
                'updated version reviews website repository ' +
                'icon bugbounty meta verdict signer ' +
                'twitter social features developerName').split(' ');

async function refreshAll (ids, markRemoved) {
  const files = await resolveIphoneFilenames(ids);
  console.log(`Updating ${files.length} 🍎 files ...`);
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
    const iphone = ensurePlatformBlock(mobile, 'iphone');
    const appId = iphone.appId;
    const idd = iphone.idd;
    if (!idd && !appId) {
      stats.remaining--;
      release();
      return;
    }
    const appCountry = iphone.appCountry || mobile.appCountry || 'us';
    helper.checkHeaderKeys(iphone, headers);

    const metaCtx = metaUpdateContext(mobile, 'iphone');
    const isDefunctOrRemoved = 'defunct,removed'.includes(iphone.meta);
    const shouldCheckDefunctOrRemoved = isDefunctOrRemoved && helper.removedCheckDue;
    const defunctKey = mobileDefunctKey(slug || path.basename(fileName, '.md'));

    if (!isDefunctOrRemoved || shouldCheckDefunctOrRemoved) {
      app({
        id: idd,
        lang: 'en',
        country: appCountry
      }).then((appData) => {
        updateFromApp(iphone, appData, mobile, appCountry);
        if (iphone.meta === 'removed') {
          iphone.meta = 'ok';
          metaCtx.date = new Date();
        }
        const iconKey = appId || slug;
        const iconPath = `images/wIcons/iphone/${iconKey}`;
        helper.downloadImageFile(`${appData.icon}`, iconPath, iconExtension => {
          if (iconExtension && appId) {
            iphone.icon = `${appId}.${iconExtension}`;
          }
          stats.updated++;
          writeMobileFile(filePath, mobile, body);
          stats.remaining--;
          release();
        });
      }, (err) => {
        const errText = `${err}`;
        if (errText.search(/404/) > -1 || errText.includes('App not found')) {
          if (iphone.meta === 'defunct' || markRemoved) {
            iphone.meta = 'removed';
            metaCtx.date = new Date();
            writeMobileFile(filePath, mobile, body);
          } else if (iphone.meta !== 'removed') {
            helper.addRemovedIfNew(defunctKey);
          }
        } else {
          console.error(`\nError with ${appId} https://apps.apple.com/${appCountry}/app/id${idd} : ${JSON.stringify(err)}`);
        }
        stats.remaining--;
        release();
      });
    } else {
      stats.removed++;
      writeMobileFile(filePath, mobile, body);
      stats.remaining--;
      release();
    }
  });
}

function updateFromApp (iphone, app, mobile, storeCountry) {
  if (app === undefined) {
    return;
  }
  if (storeCountry) {
    iphone.appCountry = storeCountry;
  }
  if (app.title && !mobile.android?.appId) {
    mobile.title = app.title;
  }
  iphone.version = (app.version || 'various').replace(/["\\]*/g, '');
  iphone.meta = iphone.meta || 'ok';
  iphone.updated = iphone.updated && new Date(iphone.updated) > new Date(app.updated)
    ? iphone.updated
    : new Date(app.updated);
  iphone.released = iphone.released || app.released || null;
  iphone.reviews = app.reviews;
  if (app.developerWebsite && !mobile.android?.appId) {
    mobile.website = app.developerWebsite;
  }
  const metaCtx = metaUpdateContext(mobile, 'iphone');
  metaCtx.date = metaCtx.date || new Date();
  iphone.developerName = app.developer || iphone.developerName || 'Unknown Developer(s)';
  helper.updateMeta(metaCtx);
}

function add (newIdds) {
  console.log(`Adding skeletons for ${newIdds.length} apps ...`);

  function refreshOrAdd (appId, iphone) {
    findMobileFileByIphoneAppId(appId)
      .then((file) => {
        if (file) {
          refreshFile(file);
          return;
        }
        const fileName = `${appId}.md`;
        const filePath = path.join(MOBILE_DIR, fileName);
        return fs.access(filePath)
          .then(() => {
            const loaded = loadMobileFromFile(filePath);
            loaded.mobile.iphone = iphone;
            refreshFile(fileName, loaded);
          }, () => {
            refreshFile(fileName, { mobile: { title: null, iphone }, body: '', slug: appId });
          });
      });
  }

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
      refreshOrAdd(appId, { appId, appCountry: country, meta: 'ok', verdict: 'wip' });
    } else {
      app({
        id: idd,
        lang: 'en',
        country: country || 'cl'
      }).then(storeApp => {
        refreshOrAdd(storeApp.appId, {
          appId: storeApp.appId,
          idd,
          appCountry: country,
          meta: 'ok',
          verdict: 'wip',
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
