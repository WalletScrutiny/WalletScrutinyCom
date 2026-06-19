import fs from 'fs';
import https from 'https';
import { fileTypeFromFile } from 'file-type';
import path from 'path';
import yaml from 'js-yaml';
import dateFormat from 'dateformat';

process.env.TZ = 'UTC'; // fix timezone issues

function downloadImageFile (url, iconPath, callback) {
  const finish = (iconExtension) => {
    try {
      callback(iconExtension);
    } catch (err) {
      console.error(err);
    }
  };

  if (!url || !String(url).startsWith('https://')) {
    console.error(`Invalid icon URL for ${iconPath}: ${url}`);
    finish(null);
    return;
  }

  const iconFile = fs.createWriteStream(iconPath);
  const request = https.get(url, response => {
    if (response.statusCode && response.statusCode >= 400) {
      console.error(`Icon HTTP ${response.statusCode} for ${iconPath}`);
      iconFile.close(() => {
        fs.unlink(iconPath, () => finish(null));
      });
      return;
    }
    response.pipe(iconFile);
    response.on('end', () => {
      (async () => {
        try {
          const mimetype = ((await fileTypeFromFile(iconPath)) || { mime: 'undefined' }).mime;
          let iconExtension = null;
          if (mimetype === 'image/png') {
            iconExtension = 'png';
          } else if (mimetype === 'image/jpg' || mimetype === 'image/jpeg') {
            iconExtension = 'jpg';
          } else {
            console.error(`Icon wrong mime type ${mimetype} for ${iconPath}. Keeping previous icon.`);
            fs.unlink(iconPath, () => {});
            finish(null);
            return;
          }
          fs.rename(iconPath, `${iconPath}.${iconExtension}`, err => {
            if (err) {
              console.error(`ERROR renaming icon ${iconPath}: ${err}`);
              finish(null);
              return;
            }
            finish(iconExtension);
          });
        } catch (err) {
          console.error(`Icon processing failed for ${iconPath}: ${err}`);
          fs.unlink(iconPath, () => finish(null));
        }
      })();
    });
    response.on('error', err => {
      console.error(err);
      finish(null);
    });
  });
  request.on('error', err => {
    console.error(err);
    finish(null);
  });
}

const defunctFile = '_data/defunct.yaml';
var defuncts = fs.readFileSync(defunctFile, 'utf8');
function was404 (id) {
  const line = `- ${id}\n`;
  return defuncts.match(line);
}

function addRemovedIfNew (id) {
  if (!was404(id)) {
    // newly defunct
    const line = `- ${id}\n`;
    defuncts += line;
    fs.appendFileSync(defunctFile, line);
  }
}

const lastCheckFile = '_data/lastRemovedCheck.yml';
const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;
const NOW_MS = new Date().getTime();
const lastCheck = getLastRemovedCheck();
const removedCheckDue = NOW_MS - lastCheck > TWO_WEEKS_MS;

function getLastRemovedCheck() {
  try {
    if (fs.existsSync(lastCheckFile)) {
      const content = fs.readFileSync(lastCheckFile, 'utf8');
      const data = yaml.load(content);
      if (data && data.date) {
        return new Date(data.date).getTime();
      }
    }
  } catch (err) {
    console.error(`Error reading ${lastCheckFile}: ${err}`);
  }
  return 0;
}

function updateLastRemovedCheck() {
  try {
    const data = { date: new Date() };
    const content = yaml.dump(data);
    fs.writeFileSync(lastCheckFile, content);
  } catch (err) {
    console.error(`Error writing ${lastCheckFile}: ${err}`);
  }
}

function migrateAll (categoryHelper, migration) {
  const category = categoryHelper.category;
  const headers = categoryHelper.headers;
  const folder = `_${category}/`;
  fs.readdir(folder, (_, files) => {
    files.forEach(file => {
      migrateFile(categoryHelper, file, migration, getEmptyHeader(headers));
    });
  });
}

function migrateFile (categoryHelper, file, migration, defaultHeader) {
  const folder = `_${categoryHelper.category}/`;
  const appPath = path.join(folder, file);
  const content = categoryHelper.category === 'others'
    ? { header: {}, body: undefined } // For others: start with empty object to preserve file structure
    : { header: defaultHeader, body: undefined }; // For other categories: use defaultHeader
  loadFromFile(appPath, content);
  migration(content.header, content.body, file, categoryHelper);
  writeResult(folder, content.header, content.body);
}

/**
 * Loads header and body from yaml file
 *
 * @param file The Path or file to be loaded
 * @param outHeaderAndBody Potentially pre-filled object {header: {}, body: ''}
 **/
function loadFromFile (file, outHeaderAndBody = { header: {}, body: '' }) {
  try {
    var parts = fs.readFileSync(file, 'utf8').split('---\n');
    const header = yaml.load(parts[1]);
    outHeaderAndBody.header = outHeaderAndBody.header || {};
    Object.keys(header).forEach(k => {
      outHeaderAndBody.header[k] = header[k];
    });
    outHeaderAndBody.body = parts.slice(2).join('---\n').replace(/^\s*[\r\n]/g, '');
    return outHeaderAndBody;
  } catch (e) {
    console.error(`Issue with ${file}: ${e}`);
  }
}

function dateOrEmpty (d) {
  return d
    ? dateFormat(d, 'yyyy-mm-dd')
    : '';
}

/**
 * Switch meta between stale, obsolete or ok depending on updated date.
 **/
function updateMeta (header) {
  // ignore defunct. Those might recently have been active.
  if (header.meta !== 'defunct') {
    const daysSinceUpdate = ((new Date()) - (new Date(header.updated))) / 1000 / 60 / 60 / 24;
    if (daysSinceUpdate > 720) {
      if (header.meta !== 'obsolete') {
        // mark obsolete if old and not obsolete yet
        header.meta = 'obsolete';
        header.date = new Date();
      }
    } else if (daysSinceUpdate > 360) {
      if (header.meta !== 'stale') {
        // mark stale if old and not stale yet
        header.meta = 'stale';
        header.date = new Date();
      }
    } else {
      if ('stale,obsolete'.includes(header.meta)) {
        // stale/obsolete product was revived. We might have to look into it.
        header.meta = 'ok';
        header.date = new Date();
      }
    }
  }
}

function checkHeaderKeys (header, allowedHeaders) {
  const losts = Object.keys(header).filter(it => !allowedHeaders.includes(it));
  if (losts.length > 0) console.error(`Losing properties: ${losts}.`);
}

/**
 * Turn the array `headers` into an object with the strings as keys.
 **/
function getEmptyHeader (headers) {
  return headers.reduce((a, v) => ({ ...a, [v]: null }), {});
}

/** Frontmatter keys listed in headers but omitted from output when empty. */
const OMIT_IF_EMPTY = new Set(['bitcoinOrgId']);

function omitEmptyOptionalHeaderFields (header) {
  const out = { ...header };
  for (const key of OMIT_IF_EMPTY) {
    const v = out[key];
    if (v == null || (typeof v === 'string' && v.trim() === '')) {
      delete out[key];
    }
  }
  return out;
}

function getResult (header, body) {
  const schema = yaml.DEFAULT_SCHEMA;
  schema.compiledTypeMap.scalar['tag:yaml.org,2002:null'].represent.lowercase = function () { return ''; };
  schema.compiledTypeMap.scalar['tag:yaml.org,2002:timestamp'].represent = function (it) { return dateOrEmpty(it); };
  const headerOut = omitEmptyOptionalHeaderFields(header);
  return `---
${yaml.dump(headerOut, {
  noArrayIndent: true,
  schema: schema,
  lineWidth: -1,
  styles: {
    '!!timestamp': 'plain'  // Prevent quoting of dates
  }
})}
---

${body}`;
}

function writeResult (folder, header, body) {
  if (header.title === null) {
    // don't write defunct apps if we never even got to find out their name
    return;
  }
  fs
    .createWriteStream(`${folder}${header.appId}.md`)
    .write(getResult(header, body));
}

export default {
  addRemovedIfNew,
  checkHeaderKeys,
  dateOrEmpty,
  downloadImageFile,
  getEmptyHeader,
  getLastRemovedCheck,
  getResult,
  loadFromFile,
  migrateAll,
  removedCheckDue,
  updateLastRemovedCheck,
  updateMeta,
  was404,
  writeResult
};
