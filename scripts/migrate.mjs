import helper from './helper.mjs';
import helperPlayStore from './helperPlayStore.mjs';
import helperAppStore from './helperAppStore.mjs';
import helperHardware from './helperHardware.mjs';
import helperBearer from './helperBearer.mjs';
import helperDesktop from './helperDesktop.mjs';
import helperOthers from './helperOthers.mjs';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import {
  MOBILE_DIR,
  loadMobileFromFile,
  writeMobileFile,
} from './mobileWalletStore.mjs';

var meta = yaml.load(fs.readFileSync('_data/platformMeta.yml'));
const df = /^\d{4}-\d{2}-\d{2}$/; // the only date format we use

/** Fields that must not appear under android:/iphone: (root-only). */
const MOBILE_ROOT_STRIP_FROM_PLATFORM = new Set([
  'wsId', 'title', 'date',
  'authors', 'website', 'twitter', 'social',
  'features', 'redirect_from', 'android', 'iphone',
]);

const MOBILE_ROOT_HEADERS = [
  ...MOBILE_ROOT_STRIP_FROM_PLATFORM,
  'appCountry',
];

function allowedPlatformKeys (categoryHelper) {
  return categoryHelper.headers.filter((k) => !MOBILE_ROOT_STRIP_FROM_PLATFORM.has(k));
}

const migration = function (header, body, fileName, categoryHelper, options = {}) {
  const category = categoryHelper.category;
  const folder = options.folder || `_${category}/`;
  const label = options.label || header.appId || fileName.slice(0, -3);
  const allowedHeaders = options.allowedHeaders || categoryHelper.headers;
  const metaCategory = options.metaCategory || category;

  if (options.setAppIdFromFile !== false && category !== 'mobile') {
    header.appId = fileName.slice(0, -3);
  }

  // Convert date fields from strings to dates
  const dateFields = ['date', 'updated', 'released'];
  for (const f of dateFields) {
    if (header[f]) {
      header[f] = new Date(header[f]);
    }
  }

 // Convert numeric fields from strings to numbers
  const numericFields = ['users', 'reviews'];
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
        `\x1b[36mWarning: 'updated' field is missing for ${folder}${label}.md with version ${header.version}\x1b[0m`
    );
  }

  if (allowedHeaders.includes('social')) {
    header.social = header.social || [];
    for (const l of header.social) {
      if (l == null ||
          typeof l !== 'string' ||
          (!l.startsWith('http') && !l.startsWith('mailto:') && !l.startsWith('nostr:')) ||
          l.includes(' ')) {
        console.error(`# ${folder}${label}.md: Unrecognized "social" entry ${l}.`);
      }
    }
    if (header.social.length < 1) header.social = null;
  }
  // hardware wallets have some inconsistent "company" and "companyWebsite" entries
  if (category === 'hardware') {
    header.provider = header.provider || header.company || null;
    header.providerWebsite = header.providerWebsite || header.companywebsite || null;
  }
  if (header.website != null && !header.website.startsWith('http')) {
    header.website = null;
  }
  const iconCategory = options.iconCategory || category;
  if (header.icon && header.appId && header.icon.slice(0, -4) !== header.appId) {
    const newIcon = `${header.appId}${header.icon.slice(-4)}`;
    console.error(`# ${label}: unexpected icon ${header.icon}. Action required!
mv images/wIcons/${iconCategory}/tiny/{${header.icon},${newIcon}}
mv images/wIcons/${iconCategory}/small/{${header.icon},${newIcon}}
mv images/wIcons/${iconCategory}/{${header.icon},${newIcon}}`);
    header.icon = newIcon;
  }
  if (header.dimensions) {
    try {
      if (header.dimensions.length !== 3) {
        throw new Error(`invalid dimensions ${header.dimensions}`);
      }
      header.dimensions = header.dimensions.map(it => Number(it.toPrecision(2)));
    } catch (e) {
      console.error(`# ${folder}${label}.md: ${e}.`);
    }
  }
  if (metaCategory !== 'others' && header.verdict && !meta[metaCategory].verdicts.includes(header.verdict)) {
    console.error(`# ${folder}${label}.md uses wrong verdict "${header.verdict}".`);
  }
  if (metaCategory !== 'others' && header.meta && !meta[metaCategory].metas.includes(header.meta) && header.meta !== 'ok') {
    console.error(`# ${folder}${label}.md uses wrong meta "${header.meta}".`);
  }
  if (header.released && !df.test(header.released)) {
    header.released = new Date(Date.parse(header.released));
  }

  for (const key in header) {
    const isKeyInHeaders = allowedHeaders.includes(key);
    const shouldKeepKey = metaCategory === 'others'
      ? (header[key] != null || isKeyInHeaders)
      : isKeyInHeaders;

    if (!shouldKeepKey) {
      console.log(`dropping key ${key} in ${folder}${fileName}`);
      delete header[key];
    }
  }
}; // crucial semicolon!

function migrateMobileWallets () {
  const folder = `${MOBILE_DIR}/`;
  for (const fileName of fs.readdirSync(MOBILE_DIR)) {
    if (!fileName.endsWith('.md')) continue;
    const filePath = path.join(MOBILE_DIR, fileName);
    const { mobile, body } = loadMobileFromFile(filePath);
    if (mobile.title == null) continue;

    migration(mobile, body, fileName, helperPlayStore, {
      folder,
      label: fileName.replace(/\.md$/, ''),
      allowedHeaders: MOBILE_ROOT_HEADERS,
      metaCategory: 'mobile',
      setAppIdFromFile: false,
    });

    if (mobile.android) {
      migration(mobile.android, body, fileName, helperPlayStore, {
        folder,
        label: mobile.android.appId || fileName.replace(/\.md$/, ''),
        allowedHeaders: allowedPlatformKeys(helperPlayStore),
        metaCategory: 'android',
        setAppIdFromFile: false,
        iconCategory: 'android',
      });
    }
    if (mobile.iphone) {
      migration(mobile.iphone, body, fileName, helperAppStore, {
        folder,
        label: mobile.iphone.appId || fileName.replace(/\.md$/, ''),
        allowedHeaders: allowedPlatformKeys(helperAppStore),
        metaCategory: 'iphone',
        setAppIdFromFile: false,
        iconCategory: 'iphone',
      });
    }

    writeMobileFile(filePath, mobile, body);
  }
}

migrateMobileWallets();

[helperHardware, helperBearer, helperDesktop, helperOthers].forEach(h => {
  helper.migrateAll(h, migration);
});
