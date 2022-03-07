process.env.TZ = 'UTC' // fix timezone issues

const apple = require('app-store-scraper')
const dateFormat = require('dateformat')
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

const folder = "_iphone/"
const allowedHeaders = Object.keys(
  yaml.load(
    getResult({}, "").split("---")[1]))

async function refreshAll() {
  fs.readdir(folder, async (err, files) => {
    if (err) {
      console.error(`Could not list the directory ${folder}.`, err)
      process.exit(1);
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
    const fraction = 3
    const t = Math.round(((new Date()) - (new Date(0))) / 1000 / 60 / 60 / 24)
    const mod = t % fraction
    files = files
        .sort((a, b) => {
          return (hashes[a]).localeCompare(hashes[b])
        })
        .filter((v, i) => {return i % fraction == mod})
    console.log(`Updating ${files.length} 🍎 files ...`)
    stats.remaining = files.length
    files.forEach((file, index) => {
      refreshFile(file)
    })
  })
}

function refreshFile(fileName) {
  sem.acquire().then(function([value, release]) {
    const appPath = path.join(folder, fileName)
    var parts = fs.readFileSync(appPath, 'utf8').split("---")
    const headerStr = parts[1]
    const body = parts.slice(2).join("---").replace(/^\s*[\r\n]/g, "")
    const header = yaml.load(headerStr)
    const appId = header.appId
    const idd = header.idd
    const appCountry = header.appCountry || "us"
    helper.checkHeaderKeys(header, allowedHeaders)
    if (!"defunct".includes(header.meta)) {
      apple.app({
          id: idd,
          lang: 'en',
          country: appCountry,
          throttle: 20}).then( app => {
        const iconPath = `images/wallet_icons/iphone/${appId}`
        helper.downloadImageFile(`${app.icon}`, iconPath, iconExtension => {
          header.icon = `${appId}.${iconExtension}`
          updateFromApp(header, app)
          writeResult(header, body)
          stats.remaining--
          release()
        })
      }, (err) => {
        if (`${err}`.search(/404/) > -1) {
          helper.addDefunctIfNew(`_iphone/${appId}`)
        } else {
          console.error(`\nError with ${appId} https://apps.apple.com/${appCountry}/app/id${idd} : ${JSON.stringify(err)}`)
        }
        stats.remaining--
        release()
      })
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
    score: header.stars,
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
  header.version = (app.version || "various").replace(/["\\]*/g, "") // strip " and \ that won't be missed in the version string
  header.meta = header.meta || "ok"
  // if api reports an older updated date than what we determined, keep our data
  header.updated = header.updated && new Date(header.updated) > new Date(app.updated)
    ? header.updated
    : app.updated
  header.stars = app.score
  header.reviews = app.reviews
  header.size = app.size
  header.website = app.developerWebsite || header.website || ""
  helper.updateMeta(header)
}

function writeResult(header, body) {
  fs
    .createWriteStream(`${folder}${header.appId}.md`)
    .write(getResult(header, body))
    stats.updated++
}

function getResult(header, body) {
  return `---
wsId: ${header.wsId || ""}
title: "${header.title}"
altTitle: ${helper.stringOrEmpty(header.altTitle)}
authors:
${(header.authors || []).map((item) => `- ${item}`).join("\n")}
appId: ${header.appId}
appCountry: ${header.appCountry || ""}
idd: ${header.idd}
released: ${helper.dateOrEmpty(header.released)}
updated: ${helper.dateOrEmpty(header.updated)}
version: ${helper.stringOrEmpty(header.version)}
stars: ${header.stars || ""}
reviews: ${header.reviews || ""}
size: ${header.size || ""}
website: ${header.website || ""}
repository: ${header.repository || ""}
issue: ${header.issue || ""}
icon: ${header.icon}
bugbounty: ${header.bugbounty || ""}
meta: ${header.meta}
verdict: ${header.verdict}
date: ${helper.dateOrEmpty(header.date)}
signer: ${header.signer || ""}
reviewArchive:${(header.reviewArchive || []).length > 0
    ? "\n" + header.reviewArchive.map((item) =>
        `- date: ${helper.dateOrEmpty(item.date)}
  version: "${item.version || ""}"
  appHash: ${item.appHash || ""}
  gitRevision: ${item.gitRevision}
  verdict: ${item.verdict}`).join("\n")
    : "" }
twitter: ${header.twitter || ""}
social:${(header.social || []).length > 0
    ? "\n" + header.social.map((item) => "  - " + item).join("\n")
    : ""}
---

${body}`
}

function add(newIdds) {
  console.log(`Adding skeletons for ${newIdds.length} apps ...`)

  newIdds.forEach( param => {
    var idd = undefined
    var appId = undefined
    var country = undefined
    if (param.includes("/")) {
      const parts = param.split("/")
      country = parts[0]
      param = parts[1]
    }
    if (isNaN(param)) {
      appId = param
    } else {
      idd = param
    }
    if (appId) {
      refreshFile(`${appId}.md`)
    } else {
      apple.app({
          id: idd,
          lang: 'en',
          country: country || "cl",
          throttle: 20}).then( app => {
        const path = `_iphone/${app.appId}.md`
        fs.exists(path, fileExists => {
          if (!fileExists) {
            const file = fs.createWriteStream(path)
            file.write(`---
appId: ${app.appId}
idd: ${idd}
appCountry: ${country || "" }
verdict: wip
---
`,
            err => {
              if (err)
                console.error(`Error with id ${idd}: ${JSON.stringify(err)}`)
              // console.log(`Success: ${path}`)
              refreshFile(`${app.appId}.md`)
            })
          } else {
            // console.warn(`${path} / http://walletscrutiny.com/iphone/${app.appId} already exists. Refreshing ...`)
            refreshFile(`${app.appId}.md`)
          }
        })
      }, err => {
        console.error(`Error with id ${idd}: ${JSON.stringify(err)}`)
      })
    }
  })
}

function migrateAll(migration) {
  helper.migrateAll(folder, migration, writeResult)
}

module.exports = {
  refreshAll,
  refreshFile,
  stats,
  add,
  migrateAll
}
