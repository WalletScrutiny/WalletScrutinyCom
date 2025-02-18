import helper from './helper.mjs';
import helperPlayStore from './helperPlayStore.mjs';
import helperAppStore from './helperAppStore.mjs';
import helperHardware from './helperHardware.mjs';
import helperBearer from './helperBearer.mjs';
import helperDesktop from './helperDesktop.mjs';
import helperOthers from './helperOthers.mjs';
import fs from 'fs';
import yaml from 'js-yaml';
var meta = yaml.load(fs.readFileSync('_data/platformMeta.yml'));
const df = /^\d{4}-\d{2}-\d{2}$/; // the only date format we use

const migration = function (header, body, fileName, categoryHelper) {
  const category = categoryHelper.category;
  const folder = `_${category}/`;
  // make sure, appId matches file name
  header.appId = fileName.slice(0, -3);

  // Convert date fields from strings to dates
  const dateFields = ['date', 'updated', 'released'];
  for (const f of dateFields) {
    if (header[f]) {
      header[f] = new Date(header[f]);
    }
  }
  if (header.reviewArchive && Array.isArray(header.reviewArchive)) {
    header.reviewArchive = header.reviewArchive
      .map(archive => {
        if (archive.date) {
          archive.date = new Date(archive.date);
        } else {
          console.error(`No date in entry ${JSON.stringify(archive)} in _${category}/${fileName}.`)
        }
        return archive;
      });
  }
 // Convert numeric fields from strings to numbers
  const numericFields = ['ratings', 'stars', 'users', 'reviews'];
  for (const f of numericFields) {
    if (header[f] && typeof header[f] === 'string' && !isNaN(header[f])) {
      header[f] = Number(header[f]);
    }
  }
  if (header.dimensions && Array.isArray(header.dimensions)) {
    header.dimensions = header.dimensions
      .map(d => Number(d));
  }

  // Check for missing 'updated' field when 'version' is defined
  if (header.version && !header.updated) {
    console.error(
        `\x1b[36mWarning: 'updated' field is missing for ${folder}${header.appId}.md with version ${header.version}\x1b[0m`
    );
  }

  header.social = header.social || [];
  for (const l of header.social) {
    if (l == null ||
        typeof l !== 'string' ||
        (!l.startsWith('http') && !l.startsWith('mailto:')) ||
        l.includes(' ')) {
      console.error(`# ${folder}${header.appId}.md: Unrecognized "social" entry ${l}.`);
    }
  }
  if (header.stars) header.stars = Number(header.stars.toPrecision(2));
  if (header.social.length < 1) header.social = null;
  // hardware wallets have some inconsistent "company" and "companyWebsite" entries
  if (category === 'hardware') {
    header.provider = header.provider || header.company || null;
    header.providerWebsite = header.providerWebsite || header.companywebsite || null;
  }
  if (header.website != null && !header.website.startsWith('http')) {
    header.website = null;
  }
  if (header.icon && header.icon.slice(0, -4) !== header.appId) {
    const newIcon = `${header.appId}${header.icon.slice(-4)}`;
    console.error(`# ${header.appId}: unexpected icon ${header.icon}. Action required!
mv images/wIcons/${category}/tiny/{${header.icon},${newIcon}}
mv images/wIcons/${category}/small/{${header.icon},${newIcon}}
mv images/wIcons/${category}/{${header.icon},${newIcon}}`);
    header.icon = newIcon;
  }
  if (header.dimensions) {
    try {
      if (header.dimensions.length !== 3) {
        throw new Error(`invalid dimensions ${header.dimensions}`);
      }
      header.dimensions = header.dimensions.map(it => Number(it.toPrecision(2)));
    } catch (e) {
      console.error(`# ${folder}${header.appId}.md: ${e}.`);
    }
  }
  if (category !== 'others' && !meta[category].verdicts.includes(header.verdict)) {
    console.error(`# ${folder}${header.appId}.md uses wrong verdict "${header.verdict}".`);
  }
  if (category !== 'others' && !meta[category].metas.includes(header.meta) && header.meta !== 'ok') {
    console.error(`# ${folder}${header.appId}.md uses wrong meta "${header.meta}".`);
  }
  if (header.released && !df.test(header.released)) {
    header.released = new Date(Date.parse(header.released));
  }

  for (const key in header) {
    const isKeyInHeaders = categoryHelper.headers.includes(key);
    const shouldKeepKey = category === 'others' 
      ? (header[key] != null || isKeyInHeaders)
      : isKeyInHeaders;
      
    if (!shouldKeepKey) {
      console.log(`dropping key ${key} in _${category}/${fileName}`);
      delete header[key];
    }
  }
}; // crucial semicolon!

[helperPlayStore, helperAppStore, helperHardware, helperBearer, helperDesktop, helperOthers].forEach(h => {
  helper.migrateAll(h, migration);
});
