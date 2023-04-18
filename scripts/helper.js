const fs = require('fs')
const https = require('https')
const FileType = require('file-type')
const path = require('path')
const yaml = require('js-yaml')
const dateFormat = require('dateformat')

function downloadImageFile (url, iconPath, callback) {
  const iconFile = fs.createWriteStream(iconPath)
  const request = https.get(`${url}`, response => {
    response.pipe(iconFile)
    response.on('end', () => {
      (async () => {
        const mimetype = ((await FileType.fromFile(iconPath)) || { mime: 'undefined' }).mime
        var iconExtension = null
        if (mimetype === 'image/png') {
          iconExtension = 'png'
        } else if (mimetype === 'image/jpg' || mimetype === 'image/jpeg') {
          iconExtension = 'jpg'
        } else if (mimetype === 'text/html' || mimetype === 'text/plain') {
          console.error(`Not writing results to ${iconPath}`)
          console.error(`Icon wrong mime type ${mimetype}. Skipping.`)
          return
        } else {
          console.error(`Not writing results to ${iconPath}`)
          console.error(`Icon wrong mime type ${mimetype}. Skipping.`)
          return
        }
        callback(iconExtension)
        fs.rename(iconPath, `${iconPath}.${iconExtension}`, err => {
          if (err) console.log('ERROR: ' + err)
        })
      })()
    })
    response.on('error', err => {
      console.error(err)
    })
  })
  request.on('error', err => {
    console.error(err)
  })
}

function addReviewArchive (header) {
  // don't archive undefined or pseudo verdicts
  if (header.verdict === undefined || 'wip,fewusers,stale,obsolete,defunct'.includes(header.verdict)) {
    return
  }
  header.reviewArchive = header.reviewArchive || []
  header.reviewArchive.unshift({
    date: header.date,
    version: header.version,
    appHash: '',
    gitRevision: getMasterHead(),
    verdict: header.verdict
  })
}

function getMasterHead () {
  return `${fs.readFileSync('.git/refs/heads/master')}`.trim()
}

const defunctFile = '_data/defunct.yaml'
var defuncts = fs.readFileSync(defunctFile, 'utf8')
function was404 (id) {
  const line = `- ${id}\n`
  return defuncts.match(line)
}

function addDefunctIfNew (id) {
  if (!was404(id)) {
    // newly defunct
    const line = `- ${id}\n`
    defuncts += line
    fs.appendFileSync(defunctFile, line)
    console.error(`\n${id}.md not available`)
  }
}

function migrateAll (category, migration, headers) {
  const folder = `_${category}/`
  fs.readdir(folder, (_, files) => {
    files.forEach(file => {
      migrateFile(category, file, migration, getEmptyHeader(headers))
    })
  })
}

function migrateFile (category, file, migration, defaultHeader) {
  const folder = `_${category}/`
  const appPath = path.join(folder, file)
  const content = { header: defaultHeader, body: undefined }
  loadFromFile(appPath, content)
  migration(content.header, content.body, file, category)
  writeResult(folder, content.header, content.body)
}

/**
 * Loads header and body from yaml file
 *
 * @param file The Path or file to be loaded
 * @param outHeaderAndBody Potentially pre-filled object {header: {}, body: ''}
 **/
function loadFromFile (file, outHeaderAndBody) {
  var parts = fs.readFileSync(file, 'utf8').split('---\n')
  const header = yaml.load(parts[1])
  outHeaderAndBody.header = outHeaderAndBody.header || {}
  Object.keys(header).forEach(k => { outHeaderAndBody.header[k] = header[k] })
  outHeaderAndBody.body = parts.slice(2).join('---\n').replace(/^\s*[\r\n]/g, '')
}

function dateOrEmpty (d) {
  return d
    ? dateFormat(d, 'yyyy-mm-dd')
    : ''
}

function stringOrEmpty (s) {
  return s
    ? `"${s}"`
    : ''
}

/**
 * Switch meta between stale, obsolete or ok depending on updated date.
 **/
function updateMeta (header) {
  // ignore defunct. Those might recently have been active.
  if (header.meta !== 'defunct') {
    const daysSinceUpdate = ((new Date()) - (new Date(header.updated))) / 1000 / 60 / 60 / 24
    if (daysSinceUpdate > 720) {
      if (header.meta !== 'obsolete') {
        // mark obsolete if old and not obsolete yet
        header.meta = 'obsolete'
        header.date = new Date()
      }
    } else if (daysSinceUpdate > 360) {
      if (header.meta !== 'stale') {
        // mark stale if old and not stale yet
        header.meta = 'stale'
        header.date = new Date()
      }
    } else {
      if ('stale,obsolete'.includes(header.meta)) {
        // stale/obsolete product was revived. We might have to look into it.
        header.meta = 'ok'
        header.date = new Date()
      }
    }
  }
}

function checkHeaderKeys (header, allowedHeaders) {
  const losts = Object.keys(header).filter(it => !allowedHeaders.includes(it))
  if (losts.length > 0) console.error(`Losing properties: ${losts}.`)
}

function getEmptyHeader (headers) {
  return headers.reduce((a, v) => ({ ...a, [v]: null }), {})
}

function getResult (header, body) {
  const schema = yaml.DEFAULT_SCHEMA
  schema.compiledTypeMap.scalar['tag:yaml.org,2002:null'].represent.lowercase = function () { return '' }
  schema.compiledTypeMap.scalar['tag:yaml.org,2002:timestamp'].represent = function (it) { return dateOrEmpty(it) }
  return `---
${yaml.dump(header, {
  noArrayIndent: true,
  schema: schema
})}
---

${body}`
}

function writeResult (folder, header, body) {
  if (header.title === null) {
    // don't write defunct apps if we never even got to find out their name
    return
  }
  fs
    .createWriteStream(`${folder}${header.appId}.md`)
    .write(getResult(header, body))
}

module.exports = {
  addReviewArchive,
  downloadImageFile,
  was404,
  addDefunctIfNew,
  migrateAll,
  dateOrEmpty,
  stringOrEmpty,
  updateMeta,
  checkHeaderKeys,
  loadFromFile,
  getEmptyHeader,
  getResult,
  writeResult
}
