// run this via sh script via docker

const apple = require('app-store-scraper')
const dateFormat = require('dateformat')
const https = require('https')
const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec
const yaml = require('js-yaml')
const sleep = require('sleep').sleep
const allowedHeaders = new Set("title,altTitle,appId,idd,released,score,reviews,\
updated,version,size,developerWebsite,\
repository,issue,icon,bugbounty,verdict,providerTwitter,\
providerLinkedIn,providerFacebook,providerReddit,date,permalink,redirect_from,\
reviewStale,reviewArchive,signer".split(","))

const iPhoneFolder = "/mnt/_iphone/"
fs.readdir(iPhoneFolder, function (err, files) {
  if (err) {
    console.error("Could not list the directory _iphone.", err)
    process.exit(1);
  }
  files.forEach(function (file, index) {
    const appPath = path.join(iPhoneFolder, file)
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
    const correctFile = `${appId}.md`
    if(file != correctFile) {
      const correctFilePath = path.join(iPhoneFolder, correctFile)
      fs.rename(appPath, correctFilePath, function (error) {
        if (error) {
          console.error("File moving error.", error)
        }
      })
    }
    if (!"defunct,nowallet,nobtc".includes(header.verdict)) {
      apple.app({
          id: idd,
          lang: 'en',
          country: 'us',
          throttle: 5}).then(function(app){
        const iconPath = `images/wallet_icons/iphone/${appId}`
        const iconFile = fs.createWriteStream(iconPath)
        const request = https.get(`${app.icon}`, function(response) {
          response.pipe(iconFile)
          response.on('end', function() {
            const child = exec(`file --mime-type ${iconPath}`, function (err, stdout, stderr) {
              const mimetype = stdout.substring(stdout.lastIndexOf(':') + 2, stdout.lastIndexOf('\n'))
              if (mimetype == "image/png") {
                iconExtension = "png"
              } else if (mimetype == "image/jpg" || mimetype == "image/jpeg") {
                iconExtension = "jpg"
              } else if (mimetype == "text/html" || mimetype == "text/plain") {
                console.error(`Not writing results to _iphone/${header.appId}.md`)
                console.error(`Icon wrong mime type ${mimetype}. Skipping.`)
                console.error(body)
                return
              } else {
                console.error(`Not writing results to _iphone/${header.appId}.md`)
                console.error(`Icon wrong mime type ${mimetype}. Skipping.`)
                return
              }
              writeResult(app, header, iconExtension, body)
              fs.rename(iconPath, `${iconPath}.${iconExtension}`, function(err) {
                if ( err ) console.log('ERROR: ' + err);
              })
            });
          });
        });
      }, function(err){
        console.error(`\nError with ${appId} https://apps.apple.com/us/app/id${idd} : ${err}`)
      });
    }
  })
})

function writeResult(app, header, iconExtension, body) {
  var altTitle = header.altTitle || ""
  if (altTitle.length > 0) altTitle = `"${altTitle}"`
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
title: "${app.title}"
altTitle: ${altTitle}

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
