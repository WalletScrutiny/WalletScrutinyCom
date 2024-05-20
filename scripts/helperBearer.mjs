import fs from 'fs/promises';
import path from 'path';
import helper from './helper.mjs';
import { Semaphore } from 'async-mutex';
import { Octokit } from 'octokit';
import githubHelper from './githubHelper.js';

process.env.TZ = 'UTC'; // fix timezone issues
const sem = new Semaphore(50);
const stats = {
  defunct: 0,
  updated: 0,
  remaining: 0
};

const ignoreVerdicts = ['nowallet', 'fake', 'unreleased'];
const ignoreMetas = ['discontinued'];
const category = 'bearer';
const folder = `_${category}/`;
const headers = ('title appId authors released discontinued updated version ' +
                'binaries dimensions weight provider providerWebsite website ' +
                'shop country price repository issue icon bugbounty meta ' +
                'verdict date signer reviewArchive twitter social features').split(' ');

async function refreshAll (ids, githubApi) {
  const octokit = new Octokit({ auth: githubApi });
  var files;
  if (ids) {
    files = ids.map(it => `${it}.md`);
  } else {
    files = await fs.readdir(folder);
  }
  console.log(`Updating ${files.length} 💳 files ...`);
  stats.remaining = files.length;
  files.forEach(file => { refreshFile(file, undefined, octokit); });
}

function refreshFile (fileName, content, octokit) {
  sem.acquire().then(async function ([, release]) {
    if (content === undefined) {
      content = { header: helper.getEmptyHeader(headers), body: undefined };
      helper.loadFromFile(path.join(folder, fileName), content);
    }
    const header = content.header;
    const body = content.body;
    const appId = header.appId;
    helper.checkHeaderKeys(header, headers);
    if (helper.was404(`${folder}${appId}`) || 'defunct'.includes(header.meta)) {
      stats.defunct++;
      helper.writeResult(folder, header, body);
      stats.remaining--;
      return release();
    }
    if (!ignoreVerdicts.includes(header.verdict) && !ignoreMetas.includes(header.meta)) {
      let app;
      // TODO: Mohammad 05-26-2023: Support other repos like Gitlab and Codeberg
      if (githubHelper.githubPattern.test(header.repository)) {
        app = await githubHelper.getAppInfo(header, category, octokit);
      } else if (header.repository) {
        console.warn(`The source code for ${appId} is not hosted on Github. Currently, This script only supports Github.`);
      }

      if (app) {
        console.log(`${header.title}: Last release was ${app.name} on ${app.updated}.`);

        updateFromApp(header, app);
        stats.updated++;
        helper.writeResult(folder, header, body);
      }
    }
    stats.remaining--;
    release();
  }).catch(console.error);
}

/**
 * Update the header from app
 **/
function updateFromApp (header, app) {
  if (app === undefined) {
    return;
  }
  header.version = app.version;
  // if api reports an older updated date than what we determined, keep our data
  header.updated = header.updated && new Date(header.updated) > new Date(app.updated)
    ? header.updated
    : new Date(app.updated);
  header.meta = header.meta || 'ok';
  helper.updateMeta(header);
}

export default {
  category,
  headers,
  refreshAll,
  refreshFile,
  stats
};
