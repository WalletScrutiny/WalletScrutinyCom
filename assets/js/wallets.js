const verdictOrder = "reproducible,nonverifiable,nosource,custodial,obfuscated,fake,noita,plainkey,prefilled,wip,fewusers,unreleased,nobtc,defunct,nowallet"
const platformOrder = "hardware,android,iphone"

window.wallets.sort((a, b) => {
  return Number(b.users) - Number(a.users) ||  Number(b.ratings) - Number(a.ratings) || Number(b.reviews) - Number(a.reviews)
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
    var n = e.wsId
    var i = readerRec.indexOf(n)
    if (n.length > 0 && i < 0) {
      window.orderedObs.push(e)
      readerRec.push(n)
    } else {
      window.orderedObs[i]['versions'] = window.orderedObs[i]['versions'] && Array.isArray(window.orderedObs[i]['versions']) ? window.orderedObs[i]['versions'].push(e) : [e]
      window.orderedObs[i]['ignore'] = true
    }
  }
  else if (e.appId && e.appId.length > 0) {
    var n = e.appId
    _id++
    var i = readerRec.indexOf(_id)
    if (n.length > 0 && i < 0) {
      window.orderedObs.push(e)
      readerRec.push(n)
    }
  }
})
window.platformObs.reverse()
window.transcribeTag = function (e) {
  if (!e) {
    return
  }
  
  return {
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
  }[e]
}
