process.env.TZ = 'UTC' // fix timezone issues

const gplay = require('google-play-scraper')
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const helper = require('./helper.js')
const { Semaphore } = require('async-mutex')

const sem = new Semaphore(5)
const stats = {
  defunct: 0,
  updated: 0,
  remaining: 0
}

const folder = "_android/"
const headers = ("wsId title altTitle authors users appId appCountry released " +
                "updated version stars ratings reviews size website repository " +
                "issue icon bugbounty meta verdict date signer reviewArchive " +
                "twitter social redirect_from").split(" ")

async function refreshAll() {
  fs.readdir(folder, async (err, files) => {
    if (err) {
      console.error(`Could not list the directory ${folder}.`, err)
      process.exit(1)
    }
    // HACK: The script fails syncing all apps but maybe if it works for less,
    //       eventually all get updated every now and then ...
    // To have some determinism, the files get sorted by the sha256(file name)
    // and depending on time, another chunk is used exclusively.
    const hashes = {}
    await Promise.all(files.map(async (f) => {
      hashes[f] = crypto.createHash('sha256').update(f).digest('hex')
    }))
    // take 1/fraction per round
    const fraction = 1
    const t = Math.round(((new Date()) - (new Date(0))) / 1000 / 60 / 60 / 24)
    const mod = t % fraction
    files = files
        .sort((a, b) => {
          return (hashes[a]).localeCompare(hashes[b])
        })
        .filter((v, i) => {return i % fraction == mod})
    console.log(`Updating ${files.length} 🤖 files ...`)
    stats.remaining = files.length
    files.forEach((file, index) => {
      refreshFile(file)
    })
  })
}

function refreshFile(fileName, content) {
  sem.acquire().then(function([value, release]) {
    if (content == undefined) {
      content = {header: helper.getEmptyHeader(headers), body: undefined}
      helper.loadFromFile(path.join(folder, fileName), content)
    }
    const header = content.header
    const body = content.body
    const appId = header.appId
    const appCountry = header.appCountry || "us"
    helper.checkHeaderKeys(header, headers)
    if (!helper.was404(`${folder}${appId}`) && !"defunct".includes(header.meta)) {
      try {
        gplay.app({
            appId: appId,
            lang: 'en',
            country: appCountry,
            throttle: 20}).then(app => {
          const iconPath = `images/wallet_icons/android/${appId}`
          helper.downloadImageFile(`${app.icon}`, iconPath, iconExtension => {
            header.icon = `${appId}.${iconExtension}`
            updateFromApp(header, app)
            writeResult(header, body)
            stats.remaining--
            release()
          })
        }, (err) => {
          if (`${err}`.search(/404/) > -1) {
            helper.addDefunctIfNew(`_android/${appId}`)
          } else {
            console.error(`\nError with https://play.google.com/store/apps/details?id=${appId} : ${JSON.stringify(err)}`)
          }
          stats.remaining--
          release()
        }).catch(err => {
          console.error(`Does this ever get triggered 1? %{err}`)
        })
      } catch (err) {
        console.error(`Does this ever get triggered 2? %{err}`)
      }
    } else {
      stats.defunct++
      writeResult(header, body)
      stats.remaining--
      release()
    }
  })
}

function getAppFromHeader(header) {
  return {
    version: header.version,
    released: header.released,
    updated: header.updated,
    title: header.title,
    minInstalls: header.users,
    scoreText: header.stars,
    reviews: header.reviews,
    ratings: header.ratings,
    size: header.size,
    developerWebsite: header.website
  }
}

/**
 * Update the header from app
 **/
function updateFromApp(header, app) {
  if (app == undefined)
    return
  header.title = app.title || header.title
  header.version = (app.version || "various").replace(/["\\]*/g, "") // strip " and \ that won't be missed in the version string
  header.released = header.released || app.released
  if ( (header.verdict == "" || header.verdict == "wip" ) && app.minInstalls < 1000 ) {
    header.verdict = "fewusers"
  } else if ( header.verdict == "fewusers" && app.minInstalls >= 1000 ) {
    header.verdict = "wip"
  }
  header.meta = header.meta || "ok"
  // if api reports an older updated date than what we determined, keep our data
  header.updated = header.updated && new Date(header.updated) > new Date(app.updated)
    ? header.updated
    : new Date(app.updated)
  header.users = app.minInstalls
  header.stars = app.score
  header.reviews = app.reviews
  header.size = app.size
  header.website = app.developerWebsite || header.website || ""
  header.date = header.date || new Date()
  helper.updateMeta(header)
}

function writeResult(header, body) {
  fs
    .createWriteStream(`${folder}${header.appId}.md`)
    .write(helper.getResult(header, body))
    stats.updated++
}

function add(newAppIds) {
  console.log(`Adding skeletons for ${newAppIds.length} apps ...`)

  newAppIds.forEach(appId => {
      const path = `_android/${appId}.md`
      fs.exists(path, fileExists => {
        if (!fileExists) {
          const header = helper.getEmptyHeader(headers)
          header.appId = appId
          header.verdict = "wip"
          refreshFile(`${appId}.md`, {header: header, body: ''})
        } else {
          refreshFile(`${appId}.md`)
        }
      })
  })
}

function migrateAll(migration) {
  helper.migrateAll(folder, migration, headers)
}

module.exports = {
  refreshAll,
  refreshFile,
  stats,
  add,
  migrateAll
}
