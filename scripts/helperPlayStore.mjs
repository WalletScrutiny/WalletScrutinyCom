import gplay from 'google-play-scraper';
import fs from 'fs/promises';
import path from 'path';
import helper from './helper.mjs';
import { Semaphore } from 'async-mutex';
import { Octokit } from 'octokit';
import githubHelper from './githubHelper.js';

process.env.TZ = 'UTC'; // fix timezone issues

const sem = new Semaphore(50);
const stats = {
  removed: 0,
  updated: 0,
  remaining: 0
};

const ignoreVerdicts = ['nowallet', 'fake', 'unreleased'];
const ignoreMetas = ['discontinued'];
const category = 'android';
const folder = `_${category}/`;
const headers = ('wsId title altTitle authors users appId appCountry released ' +
                'updated version sourceVersion stars ratings reviews size website repository ' +
                'issue icon bugbounty meta verdict date signer reviewArchive ' +
                'twitter social redirect_from developerName features').split(' ');

async function refreshAll (ids, markDefunct, githubApi) {
  const octokit = new Octokit({ auth: githubApi });
  var files;
  if (ids) {
    files = ids.map(it => `${it}.md`);
  } else {
    files = await fs.readdir(folder);
  }
  console.log(`Updating ${files.length} 🤖 files ...`);
  stats.remaining = files.length;
  files.forEach(file => { refreshFile(file, undefined, markDefunct, octokit); });
}

function refreshFile (fileName, content, markDefunct, octokit) {
  sem.acquire().then(async function ([, release]) {
    if (content === undefined) {
      content = { header: helper.getEmptyHeader(headers), body: undefined };
      helper.loadFromFile(path.join(folder, fileName), content);
    }
    const header = content.header;
    const body = content.body;
    const appId = header.appId;
    const appCountry = header.appCountry || 'us';
    helper.checkHeaderKeys(header, headers);
    if (helper.was404(`${folder}${appId}`) || !'defunct,removed'.includes(header.meta)) {
      stats.defunct++;
      helper.writeResult(folder, header, body);
      stats.remaining--;
      return release();
    }
    if (!ignoreVerdicts.includes(header.verdict) && !ignoreMetas.includes(header.meta)) {
      let repoApp;
      // TODO: Mohammad 05-26-2023: Support other repos like Gitlab and Codeberg
      if (githubHelper.githubPattern.test(header.repository)) {
        repoApp = await githubHelper.getAppInfo(header, category, octokit);
      } else if (header.repository) {
        console.warn(`The source code for ${appId} is ${header.repository}. \
Currently, This script only supports GitHub.`);
      }

      if (repoApp) {
        console.log(`${header.title}: Last release on repository was ${repoApp.name} on ${repoApp.updated}.`);
      }

      try {
        const app = await gplay.app({
          appId: appId,
          lang: 'en',
          country: appCountry
        });
        const iconPath = `images/wIcons/android/${appId}`;
        helper.downloadImageFile(`${app.icon}`, iconPath, iconExtension => {
          header.icon = `${appId}.${iconExtension}`;
          updateFromApp(header, app, repoApp);
          stats.updated++;
          helper.writeResult(folder, header, body);
          stats.remaining--;
          release();
        });
      } catch (err) {
        if (`${err}`.search(/404/) > -1) {
          if (markDefunct) {
            header.meta = 'removed';
            header.date = new Date();
            helper.writeResult(folder, header, body);
          } else {
            helper.addDefunctIfNew(`_android/${appId}`);
          }
        } else {
          console.error(`\nError with https://play.google.com/store/apps/details?id=${appId} : ${JSON.stringify(err)}`);
        }
        stats.remaining--;
        release();
      }
    } else {
      stats.remaining--;
      release();
    }
  }).catch(console.error);
}

/**
 * Update the header from app
 **/
function updateFromApp (header, app, repoApp) {
  if (app === undefined) {
    return;
  }
  header.title = app.title || header.title;
  header.version = (app.version || 'various').replace(/["\\]*/g, ''); // strip " and \ that won't be missed in the version string
  header.sourceVersion = repoApp?.version;
  header.released = header.released || app.released;
  if ((header.verdict === '' || header.verdict === 'wip') && app.minInstalls < 1000) {
    header.verdict = 'fewusers';
  } else if (header.verdict === 'fewusers' && app.minInstalls >= 1000) {
    header.verdict = 'wip';
  }
  header.meta = header.meta || 'ok';
  // Consider more recent date between play store and repo
  const storeDate = new Date(app.updated);
  const repoDate = repoApp?.updated ? new Date(repoApp?.updated) : null;
  const updateDate = repoDate > storeDate ? repoDate : storeDate;
  // if api reports an older updated date than what we determined, keep our data
  header.updated = header.updated && new Date(header.updated) > updateDate
    ? header.updated
    : updateDate;
  header.users = app.minInstalls;
  header.stars = app.score || header.stars || null;
  header.reviews = app.reviews || null;
  header.size = app.size;
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
