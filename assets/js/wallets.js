var verdictOrder = "reproducible,nonverifiable,nosource,custodial,wip,nobtc,fewusers,defunct,nowallet,obfuscated", searchInput, pauseForInput;
window.sortedWallets = Object.values(window.wallets).sort(function (a, b) {
  if (a.verdict != b.verdict)
    return verdictOrder.indexOf(a.verdict) - verdictOrder.indexOf(b.verdict)
  if (a.users != b.users)
    return Number(b.users) - Number(a.users)
  return Number(b.ratings) - Number(a.ratings)
})

window.verdictOrder = verdictOrder.split(",");
window.platformObs = [];
window.orderedObs = [];
var readerRec = [];
var _id = 0;
window.sortedWallets.forEach(function (e) {
  if (e.category && window.platformObs.indexOf(e.category) < 0) { 
    window.platformObs.push(e.category)
  }// ? String(e.wsId) : String(e.appId);
  if (e.wsId) {
  var n = e.wsId;
    var i = readerRec.indexOf(n);
    if (n.length > 0 && i < 0) {
      window.orderedObs.push(e)
      readerRec.push(n)
    } else {
      window.orderedObs[i]['versions'] = window.orderedObs[i]['versions'] && Array.isArray(window.orderedObs[i]['versions']) ? window.orderedObs[i]['versions'].push(e) : [e];
      window.orderedObs[i]['ignore'] = true;
    }
  }
  else if (e.appId && e.appId.length > 0) {
    var n = e.appId;
    _id++;
    var i = readerRec.indexOf(_id);
    if (n.length > 0 && i < 0) {
      window.orderedObs.push(e)
      readerRec.push(n)
    }
  }
})

window.transcribeTag = function (e) {
  if (!e) { return; }
  
  var css, category;

  switch (e) {
    case 'App Store':
      css = 'app-store';
      category = 'iphone'
      break;
    case 'Play Store':
      css = 'google-play';
      category = 'android'
      break;
    case 'fdroid catalogue':
      css = 'f-droid';
      category = 'fdroid'
      break;
      case 'windows':
        css = 'windows';
      category = 'windows'
      break;
    default:
  }
  return {css: css, category: category};
}