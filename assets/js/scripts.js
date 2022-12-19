window.verdictCount = {}

window.addEventListener("load", () => {
  const platformNames = Object.keys(window.platforms)
  for (var p in platformNames) {
    const platform = platformNames[p]
    window.verdictCount[platform] = { all: 0 }
    for (var v in window.verdictOrder) {
      const verdict = window.verdictOrder[v]
      window.verdictCount[platform][verdict] = 0
    }
  }
  for (var w in window.wallets) {
    const wallet = window.wallets[w]
    window.verdictCount[wallet.folder][wallet.verdict]++
    window.verdictCount[wallet.folder]["all"]++
  }
  recreateDropdowns("reproducible", "android")

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
  if (window.verdictOrder?.length > 0 && document.querySelector(".dropdown-verdict")) {
    let html = `<div class="option ${verdict === 'all' ? 'selected' : ''} all" data="all">All verdicts</div>`
    for (const instanceVerdict of window.verdictOrder) {
      const count = productCount(instanceVerdict, platform)
      if (count > 0) {
        html += `<div class="option ${verdict === instanceVerdict ? 'selected' : ''} ${instanceVerdict}" data="${instanceVerdict}">${instanceVerdict} <small>${count} wallets</small></div>`
      }
      else if(verdict === instanceVerdict) {
        html += `<div class="option selected ${instanceVerdict}" data="${instanceVerdict}">${instanceVerdict} <small>none found</small></div>`
      }
    }
    document.querySelector(".dropdown-verdict").innerHTML = html
  }

  if (window.platformObs?.length > 0 && document.querySelector(".dropdown-platform")) {
    let html = ``
    for (const instancePlatform of window.platformObs) {
      html += `<div class="option ${platform === instancePlatform ? 'selected' : ''} ${instancePlatform}" data="${instancePlatform}"><i class="${getIcon(instancePlatform)}"></i> ${instancePlatform}</div>`
    }
    document.querySelectorAll(".dropdown-platform").forEach((ele) => { ele.innerHTML = html })
  }
}
function getIcon(name) {
  let faCollection = ''
  switch (name) {
    case "android": faCollection = "fab fa-google-play"; break
    case "iphone": faCollection = "fab fa-app-store"; break
    case "hardware": faCollection = "fas fa-toolbox"; break
    case "bearer": faCollection = "fab fa-bitcoin"; break
  }
  return faCollection
}
document.body.addEventListener("click", () => { document.querySelectorAll(".dropdown-options.opened").forEach((ele) => { ele.classList.remove("opened") }) })

for (const target of ["verdict", "platform"]) {
  for (const dropdown of document.querySelectorAll(".dropdown-" + target)) {
    dropdown.addEventListener("click", (event) => {
      
      let self = event.target.parentNode.classList.contains("option") ? event.target.parentNode : event.target
      let parentEle = self.parentNode
      //IF TARGET IS AN UN-SELECTED CHILD ELEMENT
      if (!self.classList.contains("selected") && self.classList.contains("option")) {
        event.stopPropagation()
        
        parentEle.querySelectorAll(".selected").forEach((ele) => { ele.classList.remove("selected") })
        self.classList.add("selected")
        parentEle.classList.remove("opened")
        const platform = parentEle.classList.contains("dropdown-platform") ? self.getAttribute("data") : false
        if (platform) {
          document.querySelectorAll(".dropdown-platform > .selected").forEach((selected) => { selected.classList.remove("selected")})
          document.querySelectorAll(".dropdown-platform > ." + platform).forEach((newOpt) => { newOpt.classList.add("selected")})
        }
        updateUrl()
        updateModularPayload()
        return
      }
      event.stopPropagation()
      if (parentEle.classList.contains("opened")) {
        parentEle.classList.remove("opened")
      } else {
        //RESET ALL DROPDOWNS TO CLOSED STATE ONLY WHEN OPENING NEW DROPDOWN
        for (const drop of document.querySelectorAll(".dropdown-options")) { drop.classList.remove("opened") }
        parentEle.classList.add("opened")
      }
    })
  }
}

//SEPARATE FUNCTION FOR GRID / LIST TO AVOID MAKING THE LOGIC CONFUSING
let userSelectView = localStorage.getItem("userSelectView") ? localStorage.getItem("userSelectView") : 'tiles'
document.querySelector(".dropdown-view > .selected").classList.remove("selected")
document.querySelector(".dropdown-view > ." + userSelectView).classList.add("selected")
for (const view of document.querySelectorAll(".tile-list-ui")){ view.setAttribute("class", `tile-list-ui view-${userSelectView}`) }  
document.querySelector(".dropdown-view").addEventListener("click", (event) => {
  let self = event.target.parentNode.classList.contains("option") ? event.target.parentNode : event.target
  let parentEle = self.parentNode
  if (!self.classList.contains("selected") && self.classList.contains("option")) {
    //TARGET IS AN UN-SELECTED CHILD ELEMENT
    event.stopPropagation()
    parentEle.querySelectorAll(".selected").forEach((ele) => { ele.classList.remove("selected") })
    self.classList.add("selected")
    parentEle.classList.remove("opened")
    for (const view of document.querySelectorAll(".tile-list-ui")) {
      let newView = self.getAttribute("data")
      view.setAttribute("class", `tile-list-ui view-${newView}`)
      localStorage.setItem("userSelectView", newView)
    }
    return
  }
  event.stopPropagation()
  if (parentEle.classList.contains("opened")) {
    parentEle.classList.remove("opened")
  } else {
    parentEle.classList.add("opened")
  }
})

/**
 * @return how many products in the platform have the verdict.
 **/
function productCount(verdict, platform) {
  return window.verdictCount[platform][verdict]
}

function updateModularPayload() {
  let verdict = document.querySelector(".dropdown-verdict").querySelector(".selected") ? document.querySelector(".dropdown-verdict").querySelector(".selected").getAttribute("data") : "reproducible"
  const platform =  document.querySelector(".dropdown-platform").querySelector(".selected") ? document.querySelector(".dropdown-platform").querySelector(".selected").getAttribute("data") : "android"
  // remove empty verdicts
  recreateDropdowns(verdict, platform)
  verdict = document.querySelector(".dropdown-verdict").querySelector(".selected") ? document.querySelector(".dropdown-verdict").querySelector(".selected").getAttribute("data") : "reproducible"

  document.querySelectorAll(".-filter-element").forEach(e => {
    e.classList.contains(`-${platform}`) ? (e.style.display = "flex") : (e.style.display = "none")
  })

  switch (platform) {
    case 'android':
      ((document.getElementById("SwitchToDownloadsView") || {}).style || {}).display = ""
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
  const paltformOrder = 'android,iphone,hardware,bearer'.split(',')
  const metaOrder = 'ok,outdated,stale,obsolete,defunct'.split(',')
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
      return window.verdictOrder.indexOf(a.verdict) - window.verdictOrder.indexOf(b.verdict)
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
  if (!anchor)
    return
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
  let faCollection = getIcon(wallet.folder)

  return `<div id="card_${walletId}" class="AppDisplayCard meta_${wallet.meta}" style="cursor:pointer;cursor:hand;float:left;" href="${wallet.url}">
      <div style="width:7em;position: relative;" onclick="toggleApp('${walletId}')">
        <div style="position:relative">
          <div class="flex-r">
            <div class="app_logo">
                <img loading="lazy" src="${wallet.icon
      ? `/images/wIcons/${wallet.folder}/small/${wallet.icon}`
    : '/images/smallNoicon.png'}" class="app_logo" alt="Wallet Logo">
    <h3 class="list-title">${wallet.altTitle || wallet.title}</h3>
                <div class="platform-logo platform-info">
                <span><i class="${faCollection}"></i><span class="list-view-only"> ${wallet.category}</span></span>
                <div class="list-view-only stats">
                <span title="${wallet.stars} stars" class="star-rating" style="background-image: linear-gradient(90deg,var(--dark-grey, #ffd900) calc(${wallet.stars} / 5 * 100%), var(--shadow-3, #eee) 0%);">★★★★★</span>
                </div>
                <span class="list-view-only updated">${wallet.updated || wallet.released}</span>
                </div>
               
            </div>
            <div class="stamps">
            <span data-text="${wallet.verdict}" alt=""></span>
            </div>
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
