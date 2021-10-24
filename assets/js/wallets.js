const verdictOrder = "reproducible,nonverifiable,ftbfs,nosource,custodial,nosendreceive,obfuscated,fake,noita,plainkey,prefilled,wip,fewusers,unreleased,nobtc,stale,obsolete,defunct,nowallet"
const platformOrder = "hardware,android,iphone"


window.wallets.sort((a, b) => {
  const diff = function(a, b) {
    if (a && b) return Number(b) - Number(a)
    return 0
  }
  return (
      // by verdict within platform
      verdictOrder.indexOf(a.verdict) - verdictOrder.indexOf(b.verdict)
      // sort by platform
      || platformOrder.indexOf(a.folder) - platformOrder.indexOf(b.folder)
      // if available, by users (Currently only Android)
      || diff(b.users, a.users)
      // if available, by ratings and reviews
      || diff(b.ratings, a.ratings)
      || diff(b.reviews, a.reviews)
      // If no relevance criteria is available, randomize
      || ((Math.random() - 0.5) * 1E9 | 0)
    )
})

window.verdictOrder = verdictOrder.split(",")
window.platformObs = []
window.orderedObs = []
var readerRec = []
var _id = 0
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
      window.orderedObs[i]['versions'] = window.orderedObs[i]['versions'] && Array.isArray(window.orderedObs[i]['versions']) ? window.orderedObs[i]['versions'].push(e) : [e]
      window.orderedObs[i]['ignore'] = true
    }
  } else if (e.appId && e.appId.length > 0) {
    const appId = e.appId
    _id++
    var i = readerRec.indexOf(_id)
    if (appId.length > 0 && i < 0) {
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
  }
}
