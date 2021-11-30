process.env.TZ = 'UTC' // fix timezone issues
const apple = require('app-store-scraper')
const dateFormat = require('dateformat')
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const helper = require('./helper.js')
const { Mutex, Semaphore, withTimeout } = require('async-mutex')
const sem = new Semaphore(5)
const stats = {
  defunct: 0,
  updated: 0
}

const allowedHeaders = [
  "wsId", // apps that belong together get same swId
  "title", // gets updated from platform
  "altTitle", // if the name is too generic, we use this to distinguish
  "authors", // contributors to the analysis
  "appId", // provider chosen identifier. We use this for the file name, too
  "appCountry", // if the app is not available in the default country US, we take stats from there
  "idd", // plaform provided identifier. By this we find the data at the platform
  "released", // gets provided by platform
  "updated", // platform reported latest update
  "version", // platform reported version
  "stars", // platform reported stars of this language-country
  "reviews", // platform reported count of reviews of this language-country
  "size", // platform reported size in bytes
  "website", // platform reported 
  "repository", // source code repository if available
  "issue", // issue we opened in their repository
  "icon", // icon name. appId.{jpg,png}
  "bugbounty", // link to bug bounty program if known
  "verdict",
  "date", // date the review was done/updated
  "signer", // the identifier of the release signing key
  "reviewArchive", // history of our reviews
  "providerTwitter",
  "providerLinkedIn",
  "providerFacebook",
  "providerReddit",
  "redirect_from"
]
const folder = "_iphone/"

async function refreshAll() {
  fs.readdir(folder, async (err, files) => {
    if (err) {
      console.error(`Could not list the directory ${folder}.`, err)
      process.exit(1);
    }
    console.log(`Updating ${files.length} 🍎 files ...`)
    // HACK: The script fails syncing all apps but maybe if it works for less,
    //       eventually all get updated every now and then ...
    // To have some determinism, the files get sorted by the sha256(file name)
    // and depending on time, another chunk is used exclusively.
    const hashes = {}
    await Promise.all(files.map(async (f) => {
      const digest = await crypto.webcrypto.subtle.digest('SHA-256', f)
      hashes[f] = Buffer.from(digest).toString("hex")
    }))
    // take 1/7:
    const t = Math.round(((new Date()) - (new Date(0))) / 1000 / 60 / 60 / 24)
    const mod = t % 7
    files = files
        .sort((a, b) => {
          return (hashes[a]).localeCompare(hashes[b])
        })
        .filter((v, i) => {return i % 7 == mod})
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
    for(var i of Object.keys(header)) {
      if(allowedHeaders.indexOf(i) < 0) {
        console.error(`Losing property ${i} in ${appPath}.`)
      }
    }
    if (!"defunct".includes(header.verdict)) {
      apple.app({
          id: idd,
          lang: 'en',
          country: appCountry,
          throttle: 20}).then( app => {
        const iconPath = `images/wallet_icons/iphone/${appId}`
        helper.downloadImageFile(`${app.icon}`, iconPath, iconExtension => {
          writeResult(app, header, iconExtension, body)
          release()
        })
      }, (err) => {
        if (`${err}`.search(/404/) > -1) {
          helper.addDefunctIfNew(`_iphone/${appId}`)
        } else {
          console.error(`\nError with ${appId} https://apps.apple.com/${appCountry}/app/id${idd} : ${JSON.stringify(err)}`)
        }
        release()
      })
    } else {
      stats.defunct++
      release()
    }
  })
}

function writeResult(app, header, iconExtension, body) {
  var altTitle = header.altTitle || ""
  if (altTitle.length > 0) altTitle = `"${altTitle}"`
  const authors = new Set(header.authors)
  var version = app.version || "various"
  const released = header.released || app.released
  var releasedString = ""
  if (released != undefined) {
    releasedString = dateFormat(released, "yyyy-mm-dd")
  }
  const reviewArchive = (header.reviewArchive || [])
      .filter(it => {
        // Remove pseudo verdicts.
        return !"wip,fewusers,stale,obsolete".includes(it.verdict) && it.verdict != undefined
      })
  const redirects = new Set(header.redirect_from)
  const p = `_iphone/${header.appId}.md`
  const f = fs.createWriteStream(p)
  stats.updated++
  var verdict = header.verdict
  var date = header.date
  // retire if needed
  const daysSinceUpdate = ((new Date()) - (new Date(app.updated))) / 1000 / 60 / 60 / 24
  if ( daysSinceUpdate > 720 ) {
    if ( verdict != "obsolete" ) {
      // mark obsolete if old and not obsoelte yet
      helper.addReviewArchive(reviewArchive, header)
      verdict = "obsolete"
      date = new Date()
    }
  } else if ( daysSinceUpdate > 360 ) {
    if ( verdict != "stale" ) {
      // mark stale if old and not stale yet
      helper.addReviewArchive(reviewArchive, header)
      verdict = "stale"
      date = new Date()
    }
  } else {
    if ( verdict == "stale" || verdict == "obsolete" ) {
      // stale/obsolete product was revived. We might have to look into it.
      helper.addReviewArchive(reviewArchive, header)
      if ( app.minInstalls < 1000 ) {
        verdict = "fewusers"
      } else {
        verdict = "wip"
      }
      console.log(`\nReviving iphone/${header.appId} (${verdict})`)
      date = new Date()
    }
  }
  f.write(`---
wsId: ${header.wsId || ""}
title: "${app.title}"
altTitle: ${altTitle}
authors:
${[...authors].map((item) => `- ${item}`).join("\n")}
appId: ${header.appId}
appCountry: ${header.appCountry || ""}
idd: ${header.idd}
released: ${releasedString}
updated: ${dateFormat(app.updated, "yyyy-mm-dd")}
version: "${version}"
stars: ${app.score || ""}
reviews: ${app.reviews || ""}
size: ${app.size}
website: ${app.developerWebsite || header.website || ""}
repository: ${header.repository || ""}
issue: ${header.issue || ""}
icon: ${header.appId}.${iconExtension}
bugbounty: ${header.bugbounty || ""}
verdict: ${verdict}
date: ${dateFormat(date, "yyyy-mm-dd")}
signer: ${header.signer || ""}
reviewArchive:
${reviewArchive.map((item) => `- date: ${dateFormat(item.date, "yyyy-mm-dd")}
  version: "${item.version}"
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

module.exports = {
  refreshAll,
  refreshFile,
  stats,
  add
}
