const gplay = require('google-play-scraper')
const dateFormat = require('dateformat')
const https = require('https')
const fs = require('fs')
const req = require('request')
const sync = require('sync-request')
var exec = require('child_process').exec

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
  var iconPath = `images/wallet_icons/${appId}`
  const iconFile = fs.createWriteStream(iconPath)
  const request = https.get(app.icon, function(response) {
    response.pipe(iconFile)
    response.on('end', function() {
      var child = exec(`file --mime-type ${iconPath}`, function (err, stdout, stderr) {
        var mimetype = stdout.substring(stdout.lastIndexOf(':') + 2, stdout.lastIndexOf('\n'))
        if (mimetype == "image/png") {
          iconExtension = "png"
        } else if (mimetype == "image/jpg" || mimetype == "image/jpeg") {
          iconExtension = "jpg"
        } else {
          throw Error(`wrong mime type ${mimetype}`)
        }
        writeResult(app, iconExtension)
        fs.rename(iconPath, `${iconPath}.${iconExtension}`, function(err) {
          if ( err ) console.log('ERROR: ' + err);
        })
      });
    });
  });
}, console.log);
