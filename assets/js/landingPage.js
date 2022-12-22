var dontUpdateUrl = true
window.addEventListener('load', () => {
  loadMoreApps()
  // filter the products by verdict and platform as requested in the href
  const params = window.location.search.split('?')
  if (params.length > 1) {
    params[1].split('#')
    params[1].split('&').forEach(item => {
      var kv = item.split('=')
      switch (kv[0]) {
        case 'verdict': setDropdown("verdict",kv[1]); window.modularSelectedVerdict = kv[1]; updateModularPayload(); break
        case 'platform': setDropdown("platform",kv[1]); window.modularSelectedPlatform = kv[1]; updateModularPayload(); break
      }
    })
  }
  // scroll to the hash even if it was generated, giving it time to generate first
  $('html, body')
    .delay(2000, _ => {
      const anchor = $(window.location.hash)
      var top = 0
      if (anchor) {
        top = (anchor.offset() || {top: 0}).top
      }
      if (top > 0) {
        $('html, body').animate({
          scrollTop: top
        }, 2000, _ => {
          if (window.location.hash.search('card_') > 0) {
            const cardId = window.location.hash.split('card_')[1]
            toggleApp(cardId, true)
          }
        })
      }
      dontUpdateUrl = false
    })
})

function setDropdown(parent, child) {
  // TRY / CATCH HERE FOR TESTING PURPOSES
  try {
    for (const ele of document.querySelectorAll(".dropdown-" + parent + " > .selected")) { ele.classList.remove("selected") }
    document.querySelector(".dropdown-" + parent + " > ." + child).classList.add("selected")
  }catch(err){console.log("failed to set dropdown for:", parent, child)}
}

function updateUrl () {
  if (dontUpdateUrl) {
    return
  }
  var hash
  if (lastId !== '') {
    hash = `#card_${lastId}`
  } else {
    hash = ''
  }
  const verdict = document.querySelector(".dropdown-verdict > .selected") ? document.querySelector(".dropdown-verdict > .selected").getAttribute("data") : "reproducible"
  const platform = document.querySelector(".dropdown-platform > .selected") ? document.querySelector(".dropdown-platform > .selected").getAttribute("data") : "android"
  window.history.pushState('data', null, `/?verdict=${verdict}&platform=${platform}${hash}`)
}

var limit = 10
function loadMoreApps () {
  // Show the most recent products as badges
  const mostRecent = [].concat(window.wallets)
  mostRecent.sort((a, b) => {
    if (a.date !== b.date) {
      return Date.parse(b.date) - Date.parse(a.date)
    }
    return a.wsId === b.wsId
      ? 0
      : a.wsId < b.wsId
        ? -1
        : 1
  })
  renderBadgesToDiv(mostRecent.slice(0, limit), document.getElementById('recentPosts'))
  limit *= 2
}
