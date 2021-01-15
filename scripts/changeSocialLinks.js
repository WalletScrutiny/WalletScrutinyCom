const dateFormat = require('dateformat')
const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec
const yaml = require('js-yaml')
const sleep = require('sleep').sleep

const allowedHeaders = new Set("title,wallet,users,appId,launchDate,\
latestUpdate,apkVersionName,stars,ratings,reviews,size,website,\
repository,issue,icon,bugbounty,verdict,providerTwitter,\
providerLinkedIn,providerFacebook,providerReddit,date,permalink,redirect_from,\
altTitle,reviewStale,reviewArchive,signer,social".split(","))

const androidFolder = "_android/"
fs.readdir(androidFolder, function (err, files) {
  if (err) {
    console.error("Could not list the directory _android.", err)
    process.exit(1);
  }
  files.forEach(function (file, index) {
    const appPath = path.join(androidFolder, file)
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
    writeResult(header, body)
  })
})

function writeResult(header, body) {
  var altTitle = header.altTitle || ""
  if (altTitle.length > 0) altTitle = `"${altTitle}"`
  const reviewArchive = new Set(header.reviewArchive)
  const redirects = new Set(header.redirect_from)
  redirects.add(`/${header.appId}/`)
  const p = `_android/${header.appId}.md`
  const f = fs.createWriteStream(p)
  console.log(`Writing results to ${p}`)
  f.write(`---
title: "${header.title}"
altTitle: ${header.altTitle}

users: ${header.users}
appId: ${header.appId}
launchDate: ${dateFormat(header.launchDate, "yyyy-mm-dd")}
latestUpdate: ${dateFormat(header.latestUpdate, "yyyy-mm-dd")}
apkVersionName: "${ header.apkVersionName || ""}"
stars: ${header.stars || ""}
ratings: ${header.ratings || ""}
reviews: ${header.reviews || ""}
size: ${header.size || ""}
website: ${header.website || ""}
repository: ${header.repository || ""}
issue: ${header.issue || ""}
icon: ${header.icon}
bugbounty: ${header.bugbounty || ""}
verdict: ${header.verdict} # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: ${dateFormat(header.date, "yyyy-mm-dd")}
reviewStale: ${header.reviewStale}
signer: ${header.signer || ""}
reviewArchive:
${[...reviewArchive].map((item) => `- date: ${dateFormat(item.date, "yyyy-mm-dd")}
  version: "${item.version}"
  apkHash: ${item.apkHash || ""}
  gitRevision: ${item.gitRevision}
  verdict: ${item.verdict}`).join("\n")}

social:
${[header.providerTwitter,header.providerLinkedIn,header.providerFacebook,header.providerReddit].map((item) => `  - "${item}"
`)}

redirect_from:
${[...redirects].map((item) => "  - " + item).join("\n")}
---


${body}`)
}
