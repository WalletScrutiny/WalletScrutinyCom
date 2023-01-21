const helper = require('./helper.js')
const helperPlayStore = require('./helperPlayStore')
const helperAppStore = require('./helperAppStore')
const helperHardware = require('./helperHardware')
const helperBearer = require('./helperBearer')
var verdicts
try {
  const x = require('../_site/allVerdicts.js').verdicts
  verdicts = Object.keys(x)
} catch (e) {
  console.error('"Unknown verdict" errors might be safe to ignore if the verdict is new and looks spelled right')
  // ls -1 _data/verdicts/ | grep yml | sed 's/.yml//g' | paste -sd ","
  verdicts = 'custodial,fewusers,noita,nowallet,plainkey,sealed-noita,vapor,defunct,ftbfs,nonverifiable,obfuscated,prefilled,sealed-plainkey,wip,diy,nobinary,nosendreceive,obsolete,stale,fake,nobtc,nosource,outdated,reproducible,unreleased'.split(',')
}

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
  if (!verdicts.includes(header.verdict)) {
    console.error(`# ${folder}${header.appId}.md uses unknown verdict "${header.verdict}".`)
  }
}; // crucial semicolon!

[helperPlayStore, helperAppStore, helperHardware, helperBearer].forEach(h => {
  helper.migrateAll(h.category, migration, h.headers)
})
