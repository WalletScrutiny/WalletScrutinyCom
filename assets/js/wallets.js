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
  var n = String(e.appId).replace('-ios', '');
  if (n) {
    var i = readerRec.indexOf(n);
    if (i <0) {
      window.orderedObs.push(e)
      readerRec.push(n)
    } else {
      window.orderedObs[i]['test'] = 'hello';
      window.orderedObs[i]['versions'] = window.orderedObs[i]['versions']? window.orderedObs[i]['versions'].push(e) : [e];
      window.orderedObs[i]['ignore'] = true;
    }
  }
})

window.determineIconTag = function (e) {
  if (!e) { return false; }
  
  var css;
  switch (e) {
    case 'app store':
      css = 'app-store';
      break;
    case 'play store':
      css = 'google-play';
      break;
    case 'fdroid catalogue':
      css = 'f-droid';
      break;
      case 'windows':
        css = 'windows';
      break;
    default:
  }
  return css;
}