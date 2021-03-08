// run this via sh script via docker

const gplay = require('google-play-scraper')
const dateFormat = require('dateformat')
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const helper = require('./helper.js')

const allowedHeaders = new Set("title,wallet,users,appId,launchDate,\
latestUpdate,apkVersionName,stars,ratings,reviews,size,website,\
repository,issue,icon,bugbounty,verdict,providerTwitter,wsId,authors,\
providerLinkedIn,providerFacebook,providerReddit,date,permalink,redirect_from,\
altTitle,reviewStale,reviewArchive,signer".split(","))
const folder = "_android/"

function refreshAll() {
  fs.readdir(folder, function (err, files) {
    if (err) {
      console.error(`Could not list the directory ${folder}.`, err)
      process.exit(1);
    }
    files.forEach(function (file, index) {
      refreshFile(file)
    })
  })
}

function refreshFile(fileName) {
  const appPath = path.join(folder, fileName)
  var parts = fs.readFileSync(appPath, 'utf8').split("---")
  const headerStr = parts[1]
  const body = parts.slice(2).join("---").replace(/^\s*[\r\n]/g, "")
  const header = yaml.safeLoad(headerStr)
  const appId = header.appId
  for(var i of Object.keys(header)) {
    if(!allowedHeaders.has(i)) {
      console.error(`Losing property ${i} in ${appPath}.`)
    }
  }
  if (!"defunct,nowallet,nobtc".includes(header.verdict)) {
    gplay.app({
        appId: appId,
        lang: 'en',
        country: 'cl',
        throttle: 5}).then(function(app){
      const iconPath = `images/wallet_icons/android/${appId}`
      helper.downloadImageFile(`${app.icon}`, iconPath, function(iconExtension) {
        writeResult(app, header, iconExtension, body)
      })
    }, function(err) {
      console.error(`\nError with https://play.google.com/store/apps/details?id=${appId} : ${err}`)
    })
  }
}

function writeResult(app, header, iconExtension, body) {
  var altTitle = header.altTitle || ""
  if (altTitle.length > 0) altTitle = `"${altTitle}"`
  const authors = new Set(header.authors)
  var apkVersionName = app.version || "various"
  const launchDate = header.launchDate || app.release
  var launchDateString = ""
  if (launchDate != undefined) {
    launchDateString = dateFormat(launchDate, "yyyy-mm-dd")
  }
  var stale = header.reviewStale || dateFormat(header.latestUpdate, "yyyy-mm-dd") != dateFormat(app.updated, "yyyy-mm-dd")
  const reviewArchive = new Set(header.reviewArchive)
  const redirects = new Set(header.redirect_from)
  const p = `_android/${header.appId}.md`
  const f = fs.createWriteStream(p)
  //console.log(`Writing results to ${p}`)
  process.stdout.write("🤖")
  f.write(`---
wsId: ${header.wsId || ""}
title: "${app.title}"
altTitle: ${altTitle}
authors:
${[...authors].map((item) => `- ${item}`).join("\n")}
users: ${app.minInstalls}
appId: ${header.appId}
launchDate: ${launchDateString}
latestUpdate: ${dateFormat(app.updated, "yyyy-mm-dd")}
apkVersionName: "${ apkVersionName }"
stars: ${app.scoreText || ""}
ratings: ${app.ratings || ""}
reviews: ${app.reviews || ""}
size: ${app.size}
website: ${app.website || header.website || ""}
repository: ${header.repository || ""}
issue: ${header.issue || ""}
icon: ${header.appId}.${iconExtension}
bugbounty: ${header.bugbounty || ""}
verdict: ${header.verdict} # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: ${dateFormat(header.date, "yyyy-mm-dd")}
reviewStale: ${stale}
signer: ${header.signer || ""}
reviewArchive:
${[...reviewArchive].map((item) => `- date: ${dateFormat(item.date, "yyyy-mm-dd")}
  version: "${item.version}"
  apkHash: ${item.apkHash || ""}
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

module.exports = {
  refreshAll,
  refreshFile
}
