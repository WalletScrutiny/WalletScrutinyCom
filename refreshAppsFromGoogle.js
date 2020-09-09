// run this via sh script via docker

const gplay = require('google-play-scraper')
const dateFormat = require('dateformat')
const https = require('https')
const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec
const yaml = require('js-yaml')
const sleep = require('sleep').sleep

// these headers get initialized in this order for new apps
const defaultHeaders = "title altTitle users appId launchDate latestUpdate \
apkVersionName stars ratings reviews size website repository issue icon \
bugbounty verdict warnings date reviewStale signer reviewArchive \
providerTwitter providerLinkedIn providerFacebook providerReddit permalink \
redirect_from".split(" ")

const androidFolder = "/mnt/_android/"
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
<<<<<<< HEAD
      if(!allowedHeaders.has(i)) {
        console.error(`Losing property ${i} in ${appPath}.`)
=======
      if(!defaultHeaders.includes(i)) {
        console.error("losing property " + i + " in " + postPath)
>>>>>>> leosWS/warnings
      }
    }
    const correctFile = `${appId}.md`
    if(file != correctFile) {
      const correctFilePath = path.join(androidFolder, correctFile)
      fs.rename(filePath, correctFilePath, function (error) {
        if (error) {
          console.error("File moving error.", error)
        }
      })
    }
    if (!"defunct,nowallet,nobtc".includes(header.verdict)) {
      gplay.app({
          appId: appId,
          lang: 'en',
          country: 'cl',
          throttle: 5}).then(function(app){
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
              writeResult(app, header, iconExtension, body)
              fs.rename(iconPath, `${iconPath}.${iconExtension}`, function(err) {
                if ( err ) console.log('ERROR: ' + err);
              })
            });
          });
        });
      }, function(err){
        console.error(`Error with appId ${appId}: ${err}`)
      });
    }
  })
})

function writeResult(app, header, iconExtension, body) {
  var apkVersionName = app.version || "various"
  const launchDate = header.launchDate || app.release
<<<<<<< HEAD
  var launchDateString = ""
  if (launchDate != undefined) {
    launchDateString = dateFormat(launchDate, "yyyy-mm-dd")
  }
  var stale = header.reviewStale || dateFormat(header.latestUpdate, "yyyy-mm-dd") != dateFormat(app.updated, "yyyy-mm-dd")
  const reviewArchive = new Set(header.reviewArchive)
  const redirects = new Set(header.redirect_from)
  redirects.add(`/${header.appId}/`)
  const p = `_android/${header.appId}.md`
  const f = fs.createWriteStream(p)
  console.log(`Writing results to ${p}`)
  f.write(`---
title: "${app.title}"
altTitle: ${altTitle}

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
verdict: ${header.verdict} # May be any of: wip, fewusers, nowallet, nobtc, custodial, nosource, nonverifiable, reproducible, bounty, defunct
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
=======
  var launchDateString = null
  if (launchDate != undefined) { launchDateString = dateFormat(launchDate, "yyyy-mm-dd") }
  var stale = header.reviewStale || dateFormat(header.latestUpdate, "yyyy-mm-dd") != dateFormat(app.updated, "yyyy-mm-dd")
  const redirects = header.redirect_from
  if (!redirects.includes("/" + header.appId + "/")) {
    redirects.push("/" + header.appId + "/")
  }
  const path = `_posts/2019-12-20-${header.appId}.md`
  const file = fs.createWriteStream(path)
  console.log("Writing results to " + path)
  header.title = app.title
  header.users = app.minInstalls
  header.launchDate = launchDateString
  header.latestUpdate = dateFormat(app.updated, "yyyy-mm-dd")
  header.apkVersionName = apkVersionName
  header.stars = app.scoreText || null
  header.ratings = app.ratings || null
  header.reviews = app.reviews || null
  header.size = app.size
  header.website = app.website || header.website
  header.icon = `${header.appId}.${iconExtension}`
  header.reviewStale = stale
  header.permalink = header.permalink || `/posts/${header.appId}/`
  header.redirect_from = redirects
  
  // make sure we have all properties for new apps or new properties
  // clean up undefineds
  defaultHeaders.forEach(function(h){
    if (!(h in header)) {
      header[h] = null
    }
  })

  const schema = yaml.DEFAULT_SAFE_SCHEMA
  schema.compiledTypeMap.scalar['tag:yaml.org,2002:null'].represent.lowercase = function() { return '' }
  file.write(`---
${yaml.safeDump(header, {
  noArrayIndent: true,
  schema: schema,
  sortKeys: function(a, b) {
    return defaultHeaders.indexOf(a) - defaultHeaders.indexOf(b)
  }
})}
>>>>>>> leosWS/warnings
---

${body}`)
}
