import fs from 'fs';
import path from 'path';
import helper from './helper.mjs';

process.env.TZ = 'UTC'; // fix timezone issues
const stats = {
  defunct: 0,
  updated: 0,
  remaining: 0
};

const category = 'bearer';
const folder = `_${category}/`;
const headers = ('title appId authors released discontinued updated version ' +
                'binaries dimensions weight provider providerWebsite website ' +
                'shop country price repository issue icon bugbounty meta ' +
                'verdict date signer twitter social features').split(' ');

async function refreshAll () {
  fs.readdir(folder, async (err, files) => {
    if (err) {
      console.error(`Could not list the directory ${folder}.`, err);
      process.exit(1);
    }
    console.log(`Updating ${files.length} 🗃 files ...`);
    stats.remaining = files.length;
    files.forEach(file => { refreshFile(file); });
  });
}

function refreshFile (fileName, content) {
  if (content === undefined) {
    content = { header: helper.getEmptyHeader(headers), body: undefined };
    helper.loadFromFile(path.join(folder, fileName), content);
  }
  const header = content.header;
  helper.checkHeaderKeys(header, headers);
}

export default {
  category,
  headers,
  refreshAll,
  refreshFile,
  stats
};
