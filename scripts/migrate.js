const helperPlayStore = require('./helperPlayStore')
const helperAppStore = require('./helperAppStore')
const helperHardware = require('./helperHardware')
const helperBearer = require('./helperBearer')

const migration = function(header, body, fileName, folder) {
  // make sure, appId matches file name
  header.appId = fileName.slice(0, -3)
  // migrate social links to more flexible format
  // Twitter being used for other stuff and also being the most common remains
  // its own item
  header.twitter = header.twitter || header.providerTwitter || null
  header.social = header.social || []
  if (header.stars) header.stars = Number(header.stars.toPrecision(2))
  if (header.providerLinkedIn) { header.social.push(`https://www.linkedin.com/company/${header.providerLinkedIn}`) }
  if (header.providerFacebook) { header.social.push(`https://www.facebook.com/${header.providerFacebook}`) }
  if (header.providerReddit) { header.social.push(`https://www.reddit.com/r/${header.providerReddit}`) }
  if (header.social.length < 1) header.social = null
  // hardware wallets have some inconsistent "company" and "companyWebsite" entries
  if (folder == "hardware") {
    header.provider = header.provider || header.company || null
    header.providerWebsite = header.providerWebsite || header.companywebsite || null
  }
  if (header.website != null && !header.website.startsWith('http')) {
    header.website = null
  }
  if (header.icon && header.icon.slice(0, -4) != header.appId) {
    const newIcon = `${header.appId}${header.icon.slice(-4)}`
    console.error(`# ${header.appId}: unexpected icon ${header.icon}. Action required!
mv images/wallet_icons/${folder}/tiny/{${header.icon},${newIcon}}
mv images/wallet_icons/${folder}/small/{${header.icon},${newIcon}}
mv images/wallet_icons/${folder}/{${header.icon},${newIcon}}`)
    header.icon = newIcon
  }
  if (header.dimensions) {
    try {
      if (header.dimensions.length != 3) {
        throw `invalid dimensions ${header.dimensions}`
      }
      header.dimensions = header.dimensions.map(it => Number(it.toPrecision(2)))
    } catch(e) {
      console.error(`# ${folder}${header.appId}.md: ${e}.`)
    }
  }
}

helperPlayStore.migrateAll(migration)
helperAppStore.migrateAll(migration)
helperHardware.migrateAll(migration)
helperBearer.migrateAll(migration)