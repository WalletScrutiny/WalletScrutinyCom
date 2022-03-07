process.env.TZ = 'UTC' // fix timezone issues

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const helper = require('./helper.js')

const stats = {
  defunct: 0,
  updated: 0,
  remaining: 0
}

const folder = "_hardware/"
const allowedHeaders = Object.keys(
  yaml.load(
    getResult({}, "").split("---")[1]))

async function refreshAll() {
  fs.readdir(folder, async (err, files) => {
    if (err) {
      console.error(`Could not list the directory ${folder}.`, err)
      process.exit(1)
    }
    console.log(`Updating ${files.length} 🗃 files ...`)
    stats.remaining = files.length
    files.forEach((file, index) => {
      refreshFile(file)
    })
  })
}

function refreshFile(fileName) {
  const appPath = path.join(folder, fileName)
  const parts = fs.readFileSync(appPath, 'utf8').split("---")
  const headerStr = parts[1]
  const body = parts.slice(2).join("---").replace(/^\s*[\r\n]/g, "")
  const header = yaml.load(headerStr)
  const appId = header.appId
  const appCountry = header.appCountry || "us"
  helper.checkHeaderKeys(header, allowedHeaders)
  if (!helper.was404(`${folder}${appId}`) && !"defunct".includes(header.meta)) {
    try {
      gplay.app({
          appId: appId,
          lang: 'en',
          country: appCountry,
          throttle: 20}).then(app => {
        const iconPath = `images/wallet_icons/android/${appId}`
        helper.downloadImageFile(`${app.icon}`, iconPath, iconExtension => {
          header.icon = `${appId}.${iconExtension}`
          updateFromApp(header, app)
          writeResult(header, body)
          stats.remaining--
          release()
        })
      }, (err) => {
        if (`${err}`.search(/404/) > -1) {
          helper.addDefunctIfNew(`_android/${appId}`)
        } else {
          console.error(`\nError with https://play.google.com/store/apps/details?id=${appId} : ${JSON.stringify(err)}`)
        }
        stats.remaining--
        release()
      }).catch(err => {
        console.error(`Does this ever get triggered 1? %{err}`)
      })
    } catch (err) {
      console.error(`Does this ever get triggered 2? %{err}`)
    }
  } else {
    stats.defunct++
    writeResult(header, body)
    stats.remaining--
    release()
  }
}

function writeResult(header, body) {
  helper.checkHeaderKeys(header, allowedHeaders)
  fs
    .createWriteStream(`${folder}${header.appId}.md`)
    .write(getResult(header, body))
  stats.updated++
}

function getResult(header, body) {
  return `---
title: "${header.title}"
appId: ${header.appId}
authors:
${(header.authors || []).map((item) => `- ${item}`).join("\n")}
released: ${helper.dateOrEmpty(header.released)}
discontinued: ${helper.dateOrEmpty(header.discontinued)}
updated: ${helper.dateOrEmpty(header.updated)}
version: ${helper.stringOrEmpty(header.version)}
binaries: ${header.binaries || ""}
dimensions: ${header.dimensions ? `[${header.dimensions.join(", ")}]` : ""}
weight: ${header.weight || ""}
provider: ${helper.stringOrEmpty(header.provider)}
providerWebsite: ${header.providerWebsite || ""}
website: ${header.website || ""}
shop: ${header.shop || ""}
country: ${header.country || ""}
price: ${header.price || ""}
repository: ${header.repository || ""}
issue: ${header.issue || ""}
icon: ${header.icon || ""}
bugbounty: ${header.bugbounty || ""}
meta: ${header.meta || "ok"}
verdict: ${header.verdict}
date: ${helper.dateOrEmpty(header.date)}
signer: ${header.signer || ""}
reviewArchive: ${(header.reviewArchive || []).length > 0
    ? "\n" + header.reviewArchive.map((item) =>
        `- date: ${helper.dateOrEmpty(item.date)}
  version: "${item.version || ""}"
  appHash: ${item.appHash || ""}
  gitRevision: ${item.gitRevision}
  verdict: ${item.verdict}`).join("\n")
    : "" }
twitter: ${header.twitter || ""}
social: ${(header.social || []).length > 0
  ? "\n" + header.social.map((item) => "  - " + item).join("\n")
  : ""}
---

${body}`
}

function migrateAll(migration) {
  helper.migrateAll(folder, migration, writeResult)
}

module.exports = {
  refreshAll,
  refreshFile,
  stats,
  migrateAll
}
