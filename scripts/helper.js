const fs = require('fs')
const https = require('https')
const FileType = require('file-type')
const path = require('path')
const yaml = require('js-yaml')
const dateFormat = require('dateformat')

function downloadImageFile(url, path, callback) {
  const iconFile = fs.createWriteStream(path)
  const request = https.get(`${url}`, response => {
    response.pipe(iconFile)
    response.on('end', () => {
      (async () => {
        const mimetype = ((await FileType.fromFile(path)) || {'mime': "undefined"}).mime
        if (mimetype == "image/png") {
          iconExtension = "png"
        } else if (mimetype == "image/jpg" || mimetype == "image/jpeg") {
          iconExtension = "jpg"
        } else if (mimetype == "text/html" || mimetype == "text/plain") {
          console.error(`Not writing results to ${path}`)
          console.error(`Icon wrong mime type ${mimetype}. Skipping.`)
          console.error(body)
          return
        } else {
          console.error(`Not writing results to ${path}`)
          console.error(`Icon wrong mime type ${mimetype}. Skipping.`)
          return
        }
        callback(iconExtension)
        fs.rename(path, `${path}.${iconExtension}`, err => {
          if ( err ) console.log('ERROR: ' + err)
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

function addReviewArchive(reviewArchive, header) {
  // don't archive undefined or pseudo verdicts
  if (header.verdict == undefined || "wip,fewusers,stale,obsolete".includes(header.verdict)) {
    return
  }
  reviewArchive.unshift({
    date: header.date,
    version: header.version,
    appHash: "",
    gitRevision: getMasterHead(),
    verdict: header.verdict
  })
}

function getMasterHead() {
  return `${fs.readFileSync('.git/refs/heads/master')}`.trim()
}

const defunctFile = '_data/defunct.yaml'
var defuncts = fs.readFileSync(defunctFile, 'utf8')
function was404(id) {
  const line = `- ${id}\n`
  return defuncts.match(line)
}

function addDefunctIfNew(id) {
  if (!was404(id)) {
    // newly defunct
    const line = `- ${id}\n`
    defuncts += line
    fs.appendFileSync(defunctFile, line)
    console.error(`\n${id}.md not available`)
  }
}

function migrateAll(folder, migration, writeResult) {
  fs.readdir(folder, (err, files) => {
    files.forEach((file, index) => {
      migrateFile(folder, file, migration, writeResult)
    })
  })
}

function migrateFile(folder, file, migration, writeResult) {
  const appPath = path.join(folder, file)
  var parts = fs.readFileSync(appPath, 'utf8').split("---")
  const headerStr = parts[1]
  const body = parts.slice(2).join("---").replace(/^\s*[\r\n]/g, "")
  const header = yaml.load(headerStr)
  migration(header, body, file)
  writeResult(header, body)
}

function dateOrEmpty(d) {
  return d
    ? dateFormat(d, "yyyy-mm-dd")
    : ""
}

function stringOrEmpty(s) {
  return s
    ? `"${s}"`
    : ""
}

/**
 * Switch meta between stale, obsolete or ok depending on updated date.
 **/
function updateMeta(header) {
  // ignore defunct. Those might recently have been active.
  if (header.meta != "defunct") {
    const daysSinceUpdate = ((new Date()) - (new Date(header.updated))) / 1000 / 60 / 60 / 24
    if ( daysSinceUpdate > 720 ) {
      if ( header.meta != "obsolete" ) {
        // mark obsolete if old and not obsolete yet
        header.meta = "obsolete"
        header.date = new Date()
      }
    } else if ( daysSinceUpdate > 360 ) {
      if ( header.meta != "stale" ) {
        // mark stale if old and not stale yet
        header.meta = "stale"
        header.date = new Date()
      }
    } else {
      if ( "stale,obsolete".includes(header.meta)) {
        // stale/obsolete product was revived. We might have to look into it.
        header.meta = "ok"
        header.date = new Date()
      }
    }
  }
}

function checkHeaderKeys(header, allowedHeaders) {
  const losts = Object.keys(header).filter(it => !allowedHeaders.includes(it))
  if (losts.length > 0) console.error(`Losing properties: ${losts}.`)
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
  checkHeaderKeys
}
