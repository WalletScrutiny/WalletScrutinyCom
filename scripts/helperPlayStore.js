process.env.TZ = 'UTC' // fix timezone issues
process.on('unhandledRejection', (reason, promise) => {
  if (`${reason}`.search(/404/) > -1) {
    console.error(`Ignoring a 404 error that for some reason did not get caught: ${reason}`)
  } else {
    console.error(`Ignoring an error we did not intend to ignore: ${reason}`)
  }
})

const gplay = require('google-play-scraper')
const dateFormat = require('dateformat')
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const helper = require('./helper.js')
const weirdBug = []
const errorLogFileName = "/tmp/unnatural.txt"
const { Semaphore } = require('async-mutex')
const sem = new Semaphore(5)

const stats = {
  defunct: 0,
  updated: 0,
  remaining: 0
}

const allowedHeaders = [
  "wsId", // apps that belong together get same swId
  "title", // gets updated from platform
  "altTitle", // if the name is too generic, we use this to distinguish
  "authors", // contributors to the analysis
  "users", // platform reported downloads in steps
  "appId", // provider chosen identifier. We use this for the file name, too
  "appCountry", // if the app is not available in the default country US, we take stats from there
  "released", // gets provided by platform
  "updated", // platform reported latest update
  "version", // platform reported version
  "stars", // platform reported average rating
  "ratings", // platform reported count of ratings
  "reviews", // platform reported count of reviews
  "size", // platform reported size as string
  "website", // provider website
  "repository", // source code repository if available
  "issue", // issue we opened in their repository
  "icon", // icon name. appId.{jpg,png}
  "bugbounty", // link to bug bounty program if known
  "verdict", // 
  "date", // date the review was done/updated
  "signer", // the identifier of the release signing key
  "reviewArchive", // history of our reviews
  "providerTwitter",
  "providerLinkedIn",
  "providerFacebook",
  "providerReddit",
  "redirect_from",
  "meta" // meta verdict. defunct, obsolete and stale were verdicts before but that hid the actual verdict in the reviewArchive
]
const folder = "_android/"

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
      try {
        refreshFile(file)
      } catch (e) {
        const appId = `${file}`.slice(0, -3)
        noteForLater(appId)
      }
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
    const appCountry = header.appCountry || "us"
    for(var i of Object.keys(header)) {
      if(allowedHeaders.indexOf(i) < 0) {
        console.error(`Losing property ${i} in ${appPath}.`)
      }
    }
    if (!helper.was404(`_android/${appId}`) && !"defunct".includes(header.meta)) {
      try {
        gplay.app({
            appId: appId,
            lang: 'en',
            country: appCountry,
            throttle: 20}).then(app => {
          const iconPath = `images/wallet_icons/android/${appId}`
          helper.downloadImageFile(`${app.icon}`, iconPath, iconExtension => {
            writeResult(app, header, iconExtension, body)
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
      writeResult(getAppFromHeader(header), header, header.icon.split('.').pop(), body)
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
    minInstalls: header.users,
    scoreText: header.stars,
    reviews: header.reviews,
    ratings: header.ratings,
    title: header.title,
    size: header.size,
    developerWebsite: header.website
  }
}

function writeResult(app, header, iconExtension, body) {
  var altTitle = header.altTitle || ""
  if (altTitle.length > 0)
    altTitle = `"${altTitle}"`
  const authors = new Set(header.authors)
  var version = (app.version || "various").replace(/["\\]*/g, "") // strip " and \ that won't be missed in the version string
  const released = header.released || app.released
  var releasedString = ""
  if (released != undefined) {
    releasedString = dateFormat(released, "yyyy-mm-dd")
  }
  var verdict = header.verdict
  if ( (header.verdict == "" || header.verdict == "wip" ) && app.minInstalls < 1000 ) {
    verdict = "fewusers"
  } else if ( header.verdict == "fewusers" && app.minInstalls >= 1000 ) {
    verdict = "wip"
  }
  const reviewArchive = (header.reviewArchive || [])
  const redirects = new Set(header.redirect_from)
  stats.updated++
  var date = header.date
  var meta = header.meta || "ok"
  // retire if needed
  if (meta != "defunct") {
    const daysSinceUpdate = ((new Date()) - (new Date(app.updated))) / 1000 / 60 / 60 / 24
    if ( daysSinceUpdate > 720 ) {
      if ( meta != "obsolete" ) {
        // mark obsolete if old and not obsoelte yet
        meta = "obsolete"
        date = new Date()
      }
    } else if ( daysSinceUpdate > 360 ) {
      if ( meta != "stale" ) {
        // mark stale if old and not stale yet
        meta = "stale"
        date = new Date()
      }
    } else {
      if ( "stale,obsolete".includes(meta)) {
        // stale/obsolete product was revived. We might have to look into it.
        meta = "ok"
        console.log(`\nReviving android/${header.appId} (${verdict})`)
        date = new Date()
      }
    }
  }
  const p = `_android/${header.appId}.md`
  const f = fs.createWriteStream(p)
  f.write(`---
wsId: ${header.wsId || ""}
title: "${app.title}"
altTitle: ${altTitle}
authors:
${[...authors].map((item) => `- ${item}`).join("\n")}
users: ${app.minInstalls}
appId: ${header.appId}
appCountry: ${header.appCountry || ""}
released: ${releasedString}
updated: ${dateFormat(app.updated, "yyyy-mm-dd")}
version: "${ version }"
stars: ${app.scoreText || ""}
ratings: ${app.ratings || ""}
reviews: ${app.reviews || ""}
size: ${app.size}
website: ${app.developerWebsite || header.website || ""}
repository: ${header.repository || ""}
issue: ${header.issue || ""}
icon: ${header.appId}.${iconExtension}
bugbounty: ${header.bugbounty || ""}
meta: ${meta}
verdict: ${verdict}
date: ${dateFormat(date, "yyyy-mm-dd")}
signer: ${header.signer || ""}
reviewArchive:
${reviewArchive.map((item) => `- date: ${dateFormat(item.date, "yyyy-mm-dd")}
  version: "${item.version || ""}"
  appHash: ${item.appHash || ""}
  gitRevision: ${item.gitRevision}
  verdict: ${item.verdict}`).join("\n")}
providerTwitter: ${header.providerTwitter || ""}
providerLinkedIn: ${header.providerLinkedIn || ""}
providerFacebook: ${header.providerFacebook || ""}
providerReddit: ${header.providerReddit || ""}

redirect_from:
${[...redirects].map((item) => "  - " + item).join("\n")}
---

${body}`)
}

function add(newAppIds) {
  console.log(`Adding skeletons for ${newAppIds.length} apps ...`)

  newAppIds.forEach(appId => {
      const path = `_android/${appId}.md`
      fs.exists(path, fileExists => {
        if (!fileExists) {
          const file = fs.createWriteStream(path)
          file.write(`---
  appId: ${appId}
  verdict: wip
  ---
  `,
          err => {
            if (err) {
              console.error(`Error with id ${idd}: ${err}`)
            }
            // console.log(`Success: ${path}`)
            refreshFile(`${appId}.md`)
          })
        } else {
          // console.warn(`${path} / http://walletscrutiny.com/android/${appId} already exists. Refreshing ...`)
          refreshFile(`${appId}.md`)
        }
      })
  })
}

module.exports = {
  refreshAll,
  refreshFile,
  stats,
  add
}

