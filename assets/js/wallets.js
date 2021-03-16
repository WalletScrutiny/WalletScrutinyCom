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
window.sortedWallets.forEach(function (e) {
  if (e.category && window.platformObs.indexOf(e.category) < 0) { 
    window.platformObs.push(e.category)
  }
  var n = e.wsId ? String(e.wsId) : String(e.appId);
  if (n) {
    var i = readerRec.indexOf(n);
    if (n.length > 0 && i < 0) {
      window.orderedObs.push(e)
      readerRec.push(n)
    } else {
      window.orderedObs[i]['test'] = 'hello';
      window.orderedObs[i]['versions'] = window.orderedObs[i]['versions'] && Array.isArray(window.orderedObs[i]['versions']) ? window.orderedObs[i]['versions'].push(e) : [e];
      window.orderedObs[i]['ignore'] = true;
    }
  }
})

window.transcribeTag = function (e) {
  if (!e) { return; }
  
  var css, category;

  switch (e) {
    case 'app store':
      css = 'app-store';
      category = 'iphone'
      break;
    case 'play store':
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