const dateFormat = require('dateformat')
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

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
    writeResult(header, body)
  })
})

function writeResult(header, body) {
  const socials = []
  if (header.providerTwitter) { socials.push(`https://twitter.com/${header.providerTwitter}`) }
  if (header.providerLinkedIn) { socials.push(`https://www.linkedin.com/${header.providerLinkedIn}`) }
  if (header.providerFacebook) { socials.push(`https://www.facebook.com/${header.providerFacebook}`) }
  if (header.providerReddit) { socials.push(`https://www.reddit.com/r/${header.providerReddit}`) }
  var altTitle = header.altTitle || ""
  if (altTitle.length > 0) altTitle = `"${altTitle}"`
  const launchDateString = (header.launchDate != undefined) ? dateFormat(header.launchDate, "yyyy-mm-dd") : ""
  const latestUpdateString = (header.latestUpdate != undefined) ? dateFormat(header.latestUpdate, "yyyy-mm-dd") : ""
  const reviewArchive = new Set(header.reviewArchive)
  const redirects = new Set(header.redirect_from)
  redirects.add(`/${header.appId}/`)
  const p = `_android/${header.appId}.md`
  const f = fs.createWriteStream(p)
  console.log(`Writing results to ${p}`)
  f.write(`---
title: "${header.title}"
altTitle: ${header.altTitle || ""}

users: ${header.users || ""}
appId: ${header.appId || ""}
launchDate: ${launchDateString}
latestUpdate: ${latestUpdateString}
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
  version: "${item.version || ""}"
  apkHash: ${item.apkHash || ""}
  gitRevision: ${item.gitRevision}
  verdict: ${item.verdict}`).join("\n")}
social:
${socials.map((item) => `  - "${item}"`).join("\n")}
redirect_from:
${[...redirects].map((item) => "  - " + item).join("\n")}
---

${body}`)
}
