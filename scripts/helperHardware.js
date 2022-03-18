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
const headers = ("title appId authors released discontinued updated version " +
                "binaries dimensions weight provider providerWebsite website " +
                "shop country price repository issue icon bugbounty meta " +
                "verdict date signer reviewArchive twitter social").split(" ")

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

// TODO: this is Play Store stuff ...
function refreshFile(fileName, content) {
  if (content == undefined) {
    content = {header: helper.getEmptyHeader(headers), body: undefined}
    helper.loadFromFile(path.join(folder, fileName), content)
  }
  const header = content.header
  const body = content.body
  const appId = header.appId
  const appCountry = header.appCountry || "us"
  helper.checkHeaderKeys(header, headers)
}

function migrateAll(migration) {
  helper.migrateAll(folder, migration, headers)
}

module.exports = {
  refreshAll,
  refreshFile,
  stats,
  migrateAll
}
