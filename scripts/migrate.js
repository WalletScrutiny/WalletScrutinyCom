const helperPlayStore = require('./helperPlayStore')
const helperAppStore = require('./helperAppStore')
const helperHardware = require('./helperHardware')

const migration = function(header, body, fileName) {
  // make sure, appId matches file name
  header.appId = fileName.slice(0, -3)
  // migrate social links to more flexible format
  // Twitter being used for other stuff and also being the most common remains
  // its own item
  header.twitter = header.twitter || header.providerTwitter
  header.social = header.social || []
  if (header.providerLinkedIn) { header.social.push(`https://www.linkedin.com/company/${header.providerLinkedIn}`) }
  if (header.providerFacebook) { header.social.push(`https://www.facebook.com/${header.providerFacebook}`) }
  if (header.providerReddit) { header.social.push(`https://www.reddit.com/r/${header.providerReddit}`) }
  // hardware wallets have some inconsistent "company" and "companyWebsite" entries
  header.provider = header.provider || header.company || ""
  header.providerWebsite = header.providerWebsite || header.companywebsite || ""
  if (header.icon && header.icon.slice(0, -4) != header.appId) {
    const newIcon = `${header.appId}${header.icon.slice(-4)}`
    console.error(`${header.appId}: unexpected icon ${header.icon}
mv images/wallet_icons/hardware/tiny/{${header.icon},${newIcon}}
mv images/wallet_icons/hardware/small/{${header.icon},${newIcon}}
mv images/wallet_icons/hardware/{${header.icon},${newIcon}}
`)
    header.icon = newIcon
  }
}

helperPlayStore.migrateAll(migration)
helperAppStore.migrateAll(migration)
helperHardware.migrateAll(migration)
