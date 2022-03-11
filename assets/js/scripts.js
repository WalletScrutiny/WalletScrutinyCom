window.verdictCount = {}

window.addEventListener("load", () => {
  const platformNames = Object.keys(window.platforms)
  for (var p in platformNames) {
    const platform = platformNames[p]
    window.verdictCount[platform] = {}
    for (var v in window.verdictOrder) {
      const verdict = window.verdictOrder[v]
      window.verdictCount[platform][verdict] = 0
    }
  }
  for (var w in window.wallets) {
    const wallet = window.wallets[w]
    window.verdictCount[wallet.folder][wallet.verdict]++
  }
  recreateDropdowns("reproducible", "android")
  window.addEventListener("scroll", ignore => {
    const p = document.getElementById("modularWalletPayload")
    const o = p.getBoundingClientRect().bottom
    document.querySelectorAll(".fragmented-controls-master")[0].getBoundingClientRect().top
    if (o <= 100) {
      p.style.height = `${p.getBoundingClientRect().height}px`
      p.style.overflow = "hidden"
      document.querySelectorAll(".fragmented-controls-master")[0].querySelectorAll(".-disappearable").forEach(e => {
        e.style.transform = `translateY(${o - 100}px)`
        e.getBoundingClientRect().bottom <= 0 && (e.style.display = "none")
      })
    } else {
      document.querySelectorAll(".fragmented-controls-master")[0].querySelectorAll(".-disappearable").forEach(e => {
        e.style.transform = `translateY(0px)`
        e.style.display = ""
        p.style.height = ""
        p.style.overflow = ""
      })
    }
  })

  var x, y
  x = document.getElementById("SwitchToDownloadsView"); if (x) x.addEventListener("click", e => {
    y = document.getElementById("walletsPerCatContainer"); if (y) y.classList.remove("selected")
    y = document.getElementById("proportionalViewContainer"); if (y) y.classList.add("selected")
    resizeLabelBold()
  })
  x = document.getElementById("SwitchToWalletsView"); if (x) x.addEventListener("click", e => {
    y = document.getElementById("walletsPerCatContainer"); if (y) y.classList.add("selected")
    y = document.getElementById("proportionalViewContainer"); if (y) y.classList.remove("selected")
    resizeLabelBold()
  })
  updateModularPayload()
  document.body.addEventListener('keydown', e => {
    if (e.key === "Escape")
      toggleApp()
  })
})

function recreateDropdowns(verdict, platform) {
  if (window.verdictOrder && window.verdictOrder.length > 0) {
    const verdictSelect = document.createElement("select")
    verdictSelect.setAttribute("id", "modularVerdict")
    verdictSelect.setAttribute("oninput", "window.modularSelectedVerdict = this.value; updateModularPayload()")
    
    var verdictOption = document.createElement("option")
    verdictOption.value = "all"
    verdictOption.innerHTML = "all"
    verdictSelect.append(verdictOption)
    if ("all" == verdict)
      verdictOption.selected = true
    
    window.verdictOrder.forEach(t => {
      const count = productCount(t, platform)
      if (0 == count) {
        return
      }
      verdictOption = document.createElement("option")
      verdictOption.value = t
      verdictOption.innerHTML = `${verdicts[t].short} (${count})`
      verdictSelect.append(verdictOption)
      if (t == verdict)
        verdictOption.selected = true
    })

    document.getElementById("modularVerdict").replaceWith(verdictSelect)
    if (verdict != "all" && 0 == productCount(verdict, platform)) {
      document.getElementById("modularVerdict").selectedIndex = 1
    }
  }

  if (document.getElementById("modularPlatformPH") && window.platformObs && window.platformObs.length > 0) {
    const platformSelect = document.createElement("select")
    platformSelect.setAttribute("id", "modularPlatform")
    platformSelect.setAttribute("oninput", "window.modularSelectedPlatform = this.value; updateModularPayload()")
    
    window.platformObs.forEach(t => {
      const platformOption = document.createElement("option")
      platformOption.value = t
      platformOption.innerHTML = window.platforms[t].category
      platformSelect.append(platformOption)
      if (t == platform)
        platformOption.selected = true
    })

    document.getElementById("modularPlatformPH").replaceWith(platformSelect)
  }
}

/**
 * @return how many products in the platform have the verdict.
 **/
function productCount(verdict, platform) {
  return window.verdictCount[platform][verdict]
}

function updateModularPayload() {
  var verdict = (document.getElementById("modularVerdict") || {}).value || "reproducible"
  const platform = (document.getElementById("modularPlatform") || {}).value || "android"
  // remove empty verdicts
  recreateDropdowns(verdict, platform)
  verdict = (document.getElementById("modularVerdict") || {}).value || "reproducible"

  document.querySelectorAll(".-filter-element").forEach(e => {
    e.classList.contains(`-${platform}`) ? (e.style.display="flex") : (e.style.display="none")
  })

  switch(platform) {
    case 'android':
      ((document.getElementById("SwitchToDownloadsView")||{}).style||{}).display = ""
      break
    case 'iphone':
    case 'hardware':
    case 'bearer':
      var x
      x = document.getElementById("SwitchToDownloadsView"); if (x) x.style.display = "none"
      x = document.getElementById("walletsPerCatContainer"); if (x) x.classList.add("selected")
      x = document.getElementById("proportionalViewContainer"); if (x) x.classList.remove("selected")
      break
  }

  var c = 0
  var appIds = []
  var presort = []
  const verdictOrder = 'nobinary,reproducible,nonverifiable,ftbfs,nosource,custodial,nosendreceive,obfuscated,fake,noita,plainkey,prefilled,wip,fewusers,unreleased,nobtc,nowallet'.split(',')
  const paltformOrder = 'android,iphone,hardware,bearer'.split(',')
  const metaOrder = 'ok,stale,obsolete,defunct'.split(',')
  window.wallets.forEach(obj => {
    if (obj.appId && obj.verdict && obj.folder &&
        (verdict === "all" || String(obj.verdict) === verdict) &&
        (platform === "all" || String(obj.folder) === platform)) {
      presort.push(obj)
      appIds.push(obj.appId)
      c++
    }
  })
  appIds.sort().reverse()
  // presort = presort.filter(it => it.meta=="ok")
  presort.sort((a, b) => {
    if (a.verdict != b.verdict)
      return verdictOrder.indexOf(a.verdict) - verdictOrder.indexOf(b.verdict)
    if (a.folder != b.folder)
      return paltformOrder.indexOf(a.folder) - paltformOrder.indexOf(b.folder)
    if (a.meta != b.meta)
      return metaOrder.indexOf(a.meta) - metaOrder.indexOf(b.meta)
    if (a.users != b.users)
      return b.users - a.users
    if (a.ratings != b.ratings)
      return b.ratings - a.ratings
    if (a.reviews != b.reviews)
      return b.reviews - a.reviews
    return 0
  })
  renderBadgesToDiv(presort, document.getElementById("modularWalletPayload"))
  resizeLabelBold()
  updateUrl()
}

function renderBadgesToDiv(wallets, anchor) {
  var badgesHtml = ``
  wallets.forEach(obj => {
    badgesHtml += getBadge(obj)
  })
  var d = document.createElement("div")
  d.classList.add("page-section")
  var f = document.createElement("div")
  f.classList.add("flexi-list")
  var g = document.createElement("div")
  g.setAttribute("id", "tableofwallets")
  g.innerHTML = `<div id="modal" style="position:fixed;left:0;top:0;width:100%;height:100%;z-index:50;display:none" onclick="toggleApp(lastId);">&nbsp;</div>`
  f.innerHTML = badgesHtml.length == 0 ? `<h2>No wallets...</h2>` : badgesHtml
  d.append(g)
  d.append(f)
  anchor.querySelectorAll(".page-section")[0].replaceWith(d)
}

function getBadge(wallet) {
  const walletId = wallet.folder + String(wallet.appId).replaceAll(".", "")
  switch(wallet.folder) {
    case "android": faCollection = "fab fa-google-play"; break
    case "iphone": faCollection = "fab fa-app-store"; break
    case "hardware": faCollection = "fas fa-toolbox"; break
    case "bearer": faCollection = "fab fa-bitcoin"; break
  }

  return  `<div id="card_${walletId}" class="AppDisplayCard meta_${wallet.meta}" style="cursor:pointer;cursor:hand;float:left;" href="${wallet.url}">
      <div style="width:7em;position: relative;" onclick="toggleApp('${walletId}')">
        <div id="show_${walletId}" class="card-expand-close">
          <i class="fas fa-plus-square"></i>
        </div>
        <div id="hide_${walletId}" style="display:none" class="card-expand-close card-close" onclick="toggleApp()">
          <i class="fas fa-minus-square"></i>
        </div>
        <div style="position:relative">
          <div class="flex-r">
            <div class="app_logo">
                <img loading="lazy" src="/images/wallet_icons/${wallet.folder}/small/${wallet.icon}" class="app_logo" alt="Wallet Logo">
                <i class="platform-logo ${ faCollection }"></i>
            </div>
            <span class="stamp stamp-${wallet.verdict}" alt=""></span>
            ${ wallet.meta != "ok" ? `<span class="stamp stamp-${wallet.meta}" alt=""></span>` : "" }
          </div>
        </div>
          <div class="app_info_box">
              <strong>${wallet.altTitle || wallet.title}</strong>
          </div>
      </div>
      <div id="details_${walletId}" class="item-detail-container" style="width:20em;display:none">
        ${getWidgetDetails(wallet)}
        <p><a href="${wallet.url}" rel="permalink">
        <strong style="float:right">Full Analysis&nbsp;<i class="fas fa-arrow-right"></i></strong>
        </a></p>
      </div>
      </div>`
}
