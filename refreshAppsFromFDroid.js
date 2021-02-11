// run this via sh script via docker

const dateFormat = require('dateformat')
const https = require('https')
const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec
const yaml = require('js-yaml')
const sleep = require('sleep').sleep
const request = require('request')

const allowedHeaders = new Set("title,wallet,users,appId,launchDate,\
latestUpdate,versionName,versionCode,stars,ratings,reviews,size,website,\
repository,issue,icon,bugbounty,verdict,providerTwitter,\
providerLinkedIn,providerFacebook,providerReddit,date,permalink,redirect_from,\
altTitle,reviewStale,reviewArchive,signer".split(","))

const folder = "/mnt/_fdroid/"
fs.readdir(folder, function (err, files) {
  if (err) {
    console.error(`Could not list the directory ${folder}.`, err)
    process.exit(1);
  }
  files.forEach(function (file, index) {
    const appPath = path.join(folder, file)
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
      const repoUrl = `https://gitlab.com/fdroid/fdroiddata/-/raw/master/metadata/${appId}.yml`
      request(repoUrl, (err, res, reply) => {
        if (err) { 
            return console.log(`Error: ${err}`)
        }
        const app = yaml.load(reply)
        const latestBuild = app.Builds[app.Builds.length -1]
        const latestVersionName = latestBuild.versionName
        const latestVersionCode = latestBuild.versionCode
        if (latestVersionCode != header.versionCode) {
          // we found a new version. Let's see if it has a new icon, too:
          const iconPath = `images/wallet_icons/fdroid/${appId}.png`
          const tmpIconPath = `/tmp/walletIcon_${appId}.png`
          const tmpIconFile = fs.createWriteStream(tmpIconPath)
          const iconUrl = `https://f-droid.org/repo/icons-640/${appId}.${latestVersionCode}.png`
          https.get(iconUrl, function(response) {
            response.pipe(tmpIconFile)
            response.on('end', function() {
              const child = exec(`file --mime-type ${tmpIconPath}`, function (err, stdout, stderr) {
                const mimetype = stdout.substring(stdout.lastIndexOf(':') + 2, stdout.lastIndexOf('\n'))
                if (mimetype == "image/png" || mimetype == "image/jpg" || mimetype == "image/jpeg") {
                  fs.copyFile(tmpIconPath, iconPath, function(err) {
                    if ( err ) console.log('ERROR: ' + err);
                    fs.unlink(tmpIconPath)
                  })
                }
              })
            })
          })
        }
        writeResult(app, header, body, latestVersionCode, latestVersionName)
      }, function(err) {
        console.error(`\nhttps://f-droid.org/en/packages/${appId}/ : ${err}`)
      })
    }
  })
})

function writeResult(app, header, body, latestVersionCode, latestVersionName) {
  var altTitle = header.altTitle || ""
  if (altTitle.length > 0) altTitle = `"${altTitle}"`
  var apkVersionName = app.CurrentVersion
  const launchDate = header.launchDate
  var launchDateString = ""
  if (launchDate != undefined) {
    launchDateString = dateFormat(launchDate, "yyyy-mm-dd")
  }
  var stale = header.reviewStale || header.versionCode != latestVersionCode
  const reviewArchive = new Set(header.reviewArchive)
  const redirects = new Set(header.redirect_from)
  const p = `_fdroid/${header.appId}.md`
  const f = fs.createWriteStream(p)
  process.stdout.write("ツ")
  f.write(`---
title: "${app.AutoName}"
altTitle: ${altTitle}

appId: ${header.appId}
versionName: "${ latestVersionName }"
versionCode: "${ latestVersionCode }"
website: ${app.WebSite || header.website || ""}
repository: ${app.SourceCode || header.repository || ""}
issue: ${header.issue || ""}
icon: ${header.appId}.png
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
