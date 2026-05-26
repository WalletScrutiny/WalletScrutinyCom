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
                'icon bugbounty meta verdict date signer ' +
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
    const isDefunctOrRemoved = 'defunct,removed'.includes(mobile.meta);
    const shouldCheckDefunctOrRemoved = isDefunctOrRemoved && helper.removedCheckDue;
    const defunctKey = mobileDefunctKey(slug || path.basename(fileName, '.md'));

    if (!isDefunctOrRemoved || shouldCheckDefunctOrRemoved) {
      app({
        id: idd,
        lang: 'en',
        country: appCountry
      }).then((appData) => {
        updateFromApp(iphone, appData, mobile);
        if (mobile.meta === 'removed') {
          mobile.meta = 'ok';
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
          if (mobile.meta === 'defunct' || markRemoved) {
            mobile.meta = 'removed';
            metaCtx.date = new Date();
            writeMobileFile(filePath, mobile, body);
          } else if (mobile.meta !== 'removed') {
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

function updateFromApp (iphone, app, mobile) {
  if (app === undefined) {
    return;
  }
  iphone.title = app.title || iphone.title;
  iphone.version = (app.version || 'various').replace(/["\\]*/g, '');
  mobile.meta = mobile.meta || 'ok';
  iphone.updated = iphone.updated && new Date(iphone.updated) > new Date(app.updated)
    ? iphone.updated
    : new Date(app.updated);
  iphone.released = iphone.released || app.released || null;
  iphone.reviews = app.reviews;
  iphone.website = app.developerWebsite || iphone.website || mobile.website || null;
  iphone.date = iphone.date || new Date();
  mobile.developerName = app.developer || mobile.developerName || 'Unknown Developer(s)';
  helper.updateMeta(metaUpdateContext(mobile, 'iphone'));
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
      findMobileFileByIphoneAppId(appId)
        .then((file) => {
          if (file) {
            refreshFile(file);
          } else {
            const fileName = `${appId}.md`;
            const mobile = {
              title: null,
              verdict: 'wip',
              meta: 'ok',
              iphone: { appId, appCountry: country },
            };
            refreshFile(fileName, { mobile, body: '', slug: appId });
          }
        });
    } else {
      app({
        id: idd,
        lang: 'en',
        country: country || 'cl'
      }).then(storeApp => {
        findMobileFileByIphoneAppId(storeApp.appId)
          .then((file) => {
            if (file) {
              refreshFile(file);
            } else {
              const fileName = `${storeApp.appId}.md`;
              const mobile = {
                title: null,
                verdict: 'wip',
                meta: 'ok',
                iphone: {
                  appId: storeApp.appId,
                  idd,
                  appCountry: country,
                },
              };
              refreshFile(fileName, { mobile, body: '', slug: storeApp.appId });
            }
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
