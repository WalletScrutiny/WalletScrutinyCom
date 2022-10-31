window.verdictOrder = ("nobinary,reproducible,diy,nonverifiable,ftbfs,nosource," +
    "custodial,nosendreceive,obfuscated,fake,noita,plainkey,prefilled,wip,sealed-noita,sealed-plainkey" +
    "fewusers,unreleased,vapor,nobtc,nowallet").split(",")
const platformOrder = "hardware,android,iphone,bearer"
const metaOrder = "ok,outdated,stale,obsolete,defunct"

window.wallets.sort((a, b) => {
  const diff = function(a, b) {
    if (a && b) return Number(b) - Number(a)
    return 0
  }
  return (
      // by verdict within platform
      window.verdictOrder.indexOf(a.verdict) - window.verdictOrder.indexOf(b.verdict)
      // sort by platform
      || platformOrder.indexOf(a.folder) - platformOrder.indexOf(b.folder)
      // sort by meta verdict
      || metaOrder.indexOf(a.meta) - metaOrder.indexOf(b.meta)
      // if available, by users (Currently only Android)
      || diff(b.users, a.users)
      // if available, by ratings and reviews
      || diff(b.ratings, a.ratings)
      || diff(b.reviews, a.reviews)
      // If no relevance criteria is available, randomize
      || ((Math.random() - 0.5) * 1E9 | 0)
    )
})

window.platformObs = []
window.orderedObs = []
var readerRec = []
window.wallets.forEach(e => {
  if (e.folder && window.platformObs.indexOf(e.folder) < 0) { 
    window.platformObs.push(e.folder)
  }
  if (e.wsId) {
    const wsId = e.wsId
    var i = readerRec.indexOf(wsId)
    if (wsId.length > 0 && i < 0) {
      window.orderedObs.push(e)
      readerRec.push(wsId)
    } else {
      // If we already added a product with this wsId, we add the new one as a
      // "version" of the prior one.
      const versionsI = window.orderedObs[i]['versions'] || []
      versionsI.push(e)
      window.orderedObs[i]['versions'] = versionsI
    }
  } else if (e.appId && e.appId.length > 0) {
    // making sure the appId doesn't match any wsId:
    const appId = `__${e.appId}__`
    if (!readerRec.includes(appId)) {
      window.orderedObs.push(e)
      readerRec.push(appId)
    }
  }
})
window.platformObs.reverse()

window.platforms = {
  iphone: {
    css: 'fab fa-app-store',
    category: 'App Store'
  },
  android: {
    css: 'fab fa-google-play',
    category: 'Play Store'
  },
  fdroid: {
    css: 'fab fa-f-droid',
    category: 'fdroid'
  },
  windows: {
    css: 'fab fa-windows',
    category: 'windows'
  },
  hardware: {
    css: 'fas fa-toolbox',
    category: 'Hardware Wallet'
  },
  bearer: {
    css: 'fab fa-bitcoin',
    category: 'Bearer Token'
  }
}
