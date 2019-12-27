// run this via sh script via docker

const gplay = require('google-play-scraper')
const dateFormat = require('dateformat')
const https = require('https')
const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec
const yaml = require('js-yaml')
const sleep = require('sleep').sleep

const allowedHeaders = new Set("title,wallet,users,appId,launchDate,\
latestUpdate,apkVersionName,stars,ratings,reviews,size,website,\
repository,issue,icon,bugbounty,verdict,internalIssue,providerTwitter,\
providerLinkedIn,providerFacebook,providerReddit,date,permalink,redirect_from,\
altTitle,reviewStale".split(","))

var allHeaders = new Set()
const postsFolder = "/mnt/_posts/"
var i = 0
fs.readdir(postsFolder, function (err, files) {
  if (err) {
    console.error("Could not list the directory _posts.", err)
    process.exit(1);
  }
  files.forEach(function (file, index) {
    sleep(1)
    const postPath = path.join(postsFolder, file)
    var parts = fs.readFileSync(postPath, 'utf8').split("---")
    const headerStr = parts[1]
    const body = parts.slice(2).join("---").replace(/^\s*[\r\n]/g, "")
    const header = yaml.safeLoad(headerStr)
    const appId = header.appId
    for(var i of Object.keys(header)) {
      if(!allowedHeaders.has(i)) {
        console.error("losing property " + i + " in " + postPath)
      }
    }
    const correctFile = `2019-12-20-${appId}.md`
    if(file != correctFile) {
      const correctFilePath = path.join(postsFolder, correctFile)
      fs.rename(filePath, correctFilePath, function (error) {
        if (error) {
          console.error("File moving error.", error)
        }
      })
    }
    gplay.app({appId: appId}).then(function(app){
      const iconPath = `images/wallet_icons/${appId}`
      const iconFile = fs.createWriteStream(iconPath)
      const request = https.get(app.icon, function(response) {
        response.pipe(iconFile)
        response.on('end', function() {
          const child = exec(`file --mime-type ${iconPath}`, function (err, stdout, stderr) {
            const mimetype = stdout.substring(stdout.lastIndexOf(':') + 2, stdout.lastIndexOf('\n'))
            if (mimetype == "image/png") {
              iconExtension = "png"
            } else if (mimetype == "image/jpg" || mimetype == "image/jpeg") {
              iconExtension = "jpg"
            } else {
              throw Error(`wrong mime type ${mimetype}`)
            }
            if (app.released == undefined) app.released = Date()
            writeResult(app, header, iconExtension, body)
            fs.rename(iconPath, `${iconPath}.${iconExtension}`, function(err) {
              if ( err ) console.log('ERROR: ' + err);
            })
          });
        });
      });
    }, console.log);
  })
})

function writeResult(app, header, iconExtension, body) {
  var altTitle = header.altTitle || ""
  if (altTitle.length > 0) altTitle = `"${altTitle}"`
  var apkVersionName = app.version || "various"
  var stale = header.reviewStale || dateFormat(header.latestUpdate, "yyyy-mm-dd") != dateFormat(app.updated, "yyyy-mm-dd")
  const redirects = new Set(header.redirect_from)
  redirects.add("/" + header.appId + "/")
  const path = `_posts/2019-12-20-${header.appId}.md`
  const file = fs.createWriteStream(path)
  console.log("Writing results to " + path)
  file.write(`---
title: "${app.title}"
altTitle: ${altTitle}

users: ${app.minInstalls}
appId: ${header.appId}
launchDate: ${dateFormat(header.launchDate, "yyyy-mm-dd")}
latestUpdate: ${dateFormat(app.updated, "yyyy-mm-dd")}
apkVersionName: ${ apkVersionName }
stars: ${app.scoreText || ""}
ratings: ${app.ratings || ""}
reviews: ${app.reviews || ""}
size: ${app.size}
website: ${app.website || header.website || ""}
repository: ${header.repository || ""}
issue: ${header.issue || ""}
icon: ${header.appId}.${iconExtension}
bugbounty: ${header.bugbounty || ""}
verdict: ${header.verdict} # May be any of: wip, nowallet, custodial, nosource, nonverifiable, verifiable, bounty
date: ${dateFormat(header.date, "yyyy-mm-dd")}
reviewStale: ${stale}

internalIssue: ${header.internalIssue || ""}
providerTwitter: ${header.providerTwitter || ""}
providerLinkedIn: ${header.providerLinkedIn || ""}
providerFacebook: ${header.providerFacebook || ""}
providerReddit: ${header.providerReddit || ""}

permalink: /posts/${header.appId}/
redirect_from:
${[...redirects].map((item) => "  - " + item).join("\n")}
---


${body}`)
}
