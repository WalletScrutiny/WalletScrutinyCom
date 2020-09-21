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
      if(!defaultHeaders.includes(i)) {
        console.error(`Losing property ${i} in ${appPath}.`)
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
  var launchDateString = null
  if (launchDate != undefined) {
    launchDateString = dateFormat(launchDate, "yyyy-mm-dd")
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
---


${body}`)
}
