// run this via sh script via docker

const gplay = require('google-play-scraper')
const dateFormat = require('dateformat')
const https = require('https')
const fs = require('fs')
const path = require('path')
const req = require('request')
const sync = require('sync-request')
const exec = require('child_process').exec
const yaml = require('js-yaml')

const walletsFolder = "/mnt/_posts/"
fs.readdir(walletsFolder, function (err, files) {
  if (err) {
    console.error("Could not list the directory _posts.", err)
    process.exit(1);
  }
  files.forEach(function (file, index) {
    const filePath = path.join(walletsFolder, file)
    const parts = fs.readFileSync(filePath, 'utf8').split("---")
    const headerStr = parts[1]
    const body = parts[2]
    const header = yaml.safeLoad(headerStr)
    const correctFile = `2019-12-20-${header.appId}.md`
    if(file != correctFile) {
      const correctFilePath = path.join(walletsFolder, correctFile)
      fs.rename(filePath, correctFilePath, function (error) {
        if (error) {
          console.error("File moving error.", error);
        }
      });
    }
  });
});

return
console.log(`---
title: "${header.title}"

wallet: ${header.wallet}
users: ${header.users}
appId: ${header.appId}
launchDate: ${dateFormat(header.launchDate, "yyyy-mm-dd")}
latestUpdate: ${dateFormat(header.latestUpdate, "yyyy-mm-dd")}
apkVersionName: ${header.apkVersionName}
stars: ${header.stars}
ratings: ${header.ratings}
reviews: ${header.reviews}
size: ${header.size}
permissions: ${header.permissions || ""}
website: ${header.website || ""}
repository: ${header.repository || ""}
issue: ${header.issue || ""}
icon: ${header.icon}
bugbounty: ${header.bugbounty || ""}
verdict: wip # May be any of: wip, nowallet, custodial, nosource, nonverifiable, verifiable, bounty

date: ${dateFormat(header.date, "yyyy-mm-dd")}
permalink: ${header.permalink}
redirect_from:
- /${header.appId}/
---


${body}`)

exit()



appId = process.argv[2]

function writeResult(app, iconExtension) {
  const path = `_posts/2019-12-20-${appId}.md`
  const file = fs.createWriteStream(path)
  file.write(`---
title: "${app.title}"

wallet: true
users: ${app.minInstalls}
appId: ${appId}
launchDate: ${dateFormat(new Date(app.released), "yyyy-mm-dd")}
latestUpdate: ${dateFormat(new Date(app.updated), "yyyy-mm-dd")}
apkVersionName: ${app.version}
stars: ${app.scoreText}
ratings: ${app.ratings}
reviews: ${app.reviews}
size: ${app.size}
permissions:
website: ${app.developerWebsite}
repository:
issue:
icon: images/wallet_icons/${appId}.${iconExtension}
bugbounty:
verdict: wip # May be any of: wip, nowallet, custodial, nosource, nonverifiable, verifiable, bounty, cert1, cert2, cert3

date: ${dateFormat(new Date(), "yyyy-mm-dd")}
permalink: /posts/${appId}/
redirect_from:
- /${appId}/
---

This page was created by a script from the **appId** "${appId}" and public
information found
[here](https://play.google.com/store/apps/details?id=${appId}).

Probably an engineer will soon have a deeper look at this app.

This app was added because it came up searching the playstore for wallet apps.`)
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
        writeResult(app, iconExtension)
        fs.rename(iconPath, `${iconPath}.${iconExtension}`, function(err) {
          if ( err ) console.log('ERROR: ' + err);
        })
      });
    });
  });
}, console.log);
