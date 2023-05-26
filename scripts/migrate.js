const helper = require('./helper.js')
const helperPlayStore = require('./helperPlayStore')
const helperAppStore = require('./helperAppStore')
const helperHardware = require('./helperHardware')
const helperBearer = require('./helperBearer')
const fs = require('fs')
const yaml = require('js-yaml')
var meta = yaml.load(fs.readFileSync('_data/platformMeta.yml'))
const df = /^\d{4}-\d{2}-\d{2}$/ // the only date format we use

const migration = function (header, body, fileName, category) {
  const folder = `_${category}/`
  // make sure, appId matches file name
  header.appId = fileName.slice(0, -3)
  header.social = header.social || []
  if (header.stars) header.stars = Number(header.stars.toPrecision(2))
  if (header.social.length < 1) header.social = null
  // hardware wallets have some inconsistent "company" and "companyWebsite" entries
  if (category === 'hardware') {
    header.provider = header.provider || header.company || null
    header.providerWebsite = header.providerWebsite || header.companywebsite || null
  }
  if (header.website != null && !header.website.startsWith('http')) {
    header.website = null
  }
  if (header.icon && header.icon.slice(0, -4) !== header.appId) {
    const newIcon = `${header.appId}${header.icon.slice(-4)}`
    console.error(`# ${header.appId}: unexpected icon ${header.icon}. Action required!
mv images/wIcons/${category}/tiny/{${header.icon},${newIcon}}
mv images/wIcons/${category}/small/{${header.icon},${newIcon}}
mv images/wIcons/${category}/{${header.icon},${newIcon}}`)
    header.icon = newIcon
  }
  if (header.dimensions) {
    try {
      if (header.dimensions.length !== 3) {
        throw new Error(`invalid dimensions ${header.dimensions}`)
      }
      header.dimensions = header.dimensions.map(it => Number(it.toPrecision(2)))
    } catch (e) {
      console.error(`# ${folder}${header.appId}.md: ${e}.`)
    }
  }
  if (!meta[category].verdicts.includes(header.verdict)) {
    console.error(`# ${folder}${header.appId}.md uses wrong verdict "${header.verdict}".`)
  }
  if (!meta[category].metas.includes(header.meta) && 'ok' !== header.meta) {
    console.error(`# ${folder}${header.appId}.md uses wrong meta "${header.meta}".`)
  }
  if (header.released && !df.test(header.released)) {
    header.released = new Date(Date.parse(header.released))
  }
}; // crucial semicolon!

[helperPlayStore, helperAppStore, helperHardware, helperBearer].forEach(h => {
  helper.migrateAll(h.category, migration, h.headers)
})
