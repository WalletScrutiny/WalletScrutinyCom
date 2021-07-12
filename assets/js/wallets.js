const verdictOrder = "reproducible,nonverifiable,nosource,custodial,obfuscated,noita,wip,fewusers,nobtc,defunct,nowallet"
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
  
  var css, category

  switch (e) {
    case 'iphone':
      css = 'fab fa-app-store'
      category = 'App Store'
      break
    case 'android':
      css = 'fab fa-google-play'
      category = 'Play Store'
      break
    case 'fdroid':
      css = 'fab fa-f-droid'
      category = 'fdroid'
      break
    case 'windows':
      css = 'fab fa-windows'
      category = 'windows'
      break
    case 'hardware':
      css = 'fas fa-toolbox'
      category = 'Hardware Wallet'
      break
    default:
  }
  return {
    css: css,
    category: category
  }
}