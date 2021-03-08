// run this via sh script via docker

const apple = require('app-store-scraper')
const dateFormat = require('dateformat')
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const helper = require('./helper.js')

const allowedHeaders = new Set("title,altTitle,appId,idd,released,score,reviews,\
updated,version,size,developerWebsite,wsId,authors,\
repository,issue,icon,bugbounty,verdict,providerTwitter,\
providerLinkedIn,providerFacebook,providerReddit,date,permalink,redirect_from,\
reviewStale,reviewArchive,signer".split(","))
const folder = "_iphone/"

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
  const idd = header.idd
  for(var i of Object.keys(header)) {
    if(!allowedHeaders.has(i)) {
      console.error(`Losing property ${i} in ${appPath}.`)
    }
  }
  if (!"defunct,nowallet,nobtc".includes(header.verdict)) {
    apple.app({
        id: idd,
        lang: 'en',
        country: 'us',
        throttle: 5}).then(function(app){
      const iconPath = `images/wallet_icons/iphone/${appId}`
      helper.downloadImageFile(`${app.icon}`, iconPath, function(iconExtension) {
        writeResult(app, header, iconExtension, body)
      })
    }, function(err){
      console.error(`\nError with ${appId} https://apps.apple.com/us/app/id${idd} : ${err}`)
    })
  }
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
  var stale = header.reviewStale || dateFormat(header.updated, "yyyy-mm-dd") != dateFormat(app.updated, "yyyy-mm-dd")
  const reviewArchive = new Set(header.reviewArchive)
  const redirects = new Set(header.redirect_from)
  const p = `_iphone/${header.appId}.md`
  const f = fs.createWriteStream(p)
  //console.log(`Writing results to ${p}`)
  process.stdout.write("🍎")
  f.write(`---
wsId: ${header.wsId || ""}
title: "${app.title}"
altTitle: ${altTitle}
authors:
${[...authors].map((item) => `- ${item}`).join("\n")}
appId: ${header.appId}
idd: ${header.idd}
released: ${releasedString}
updated: ${dateFormat(app.updated, "yyyy-mm-dd")}
version: "${version}"
score: ${app.score || ""}
reviews: ${app.reviews || ""}
size: ${app.size}
developerWebsite: ${app.developerWebsite || header.developerWebsite || ""}
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
  appHash: ${item.apkHash || ""}
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
