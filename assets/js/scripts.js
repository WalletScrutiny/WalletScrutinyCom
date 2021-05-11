if (document.getElementById("modularVerdictPH") && window.verdictOrder && window.verdictOrder.length > 0) {
  const verdictSelect = document.createElement("select")
  verdictSelect.setAttribute("id", "modularVerdict")
  verdictSelect.setAttribute("oninput", "window.modularSelectedVerdict = this.value; updateModularPayload()")
  
  var verdictOption = document.createElement("option")
  verdictOption.value = "all"
  verdictOption.innerHTML = "all"
  verdictSelect.append(verdictOption)
  
  window.verdictOrder.forEach(t => {
    verdictOption = document.createElement("option")
    verdictOption.value = t
    verdictOption.innerHTML = t
    verdictSelect.append(verdictOption)
  })

  document.getElementById("modularVerdictPH").replaceWith(verdictSelect)
  document.getElementById("modularVerdict").selectedIndex = 1
}

if (document.getElementById("modularPlatformPH") && window.platformObs && window.platformObs.length > 0) {
  const platformSelect = document.createElement("select")
  platformSelect.setAttribute("id", "modularPlatform")
  platformSelect.setAttribute("oninput", "window.modularSelectedPlatform = this.value; updateModularPayload()")
  
  window.platformObs.forEach(t => {
    const platformOption = document.createElement("option")
    platformOption.value = t
    platformOption.innerHTML = t
    platformSelect.append(platformOption)
  })

  document.getElementById("modularPlatformPH").replaceWith(platformSelect)
}


function updateModularPayload() {
  const verdict = (document.getElementById("modularVerdict") || {}).value || "reproducible"
  const platform = (document.getElementById("modularPlatform") || {}).value || "android"

  document.querySelectorAll(".-filter-element").forEach(function (e) {
    e.classList.contains(`-${window.transcribeTag(platform).category}`) ? (e.style.display="flex") : (e.style.display="none")
  })

  switch(platform) {
    case 'Play Store':
    case 'android':
      ((document.getElementById("SwitchToDownloadsView")||{}).style||{}).display = ""
      break
    default:
      var x
      x = document.getElementById("SwitchToDownloadsView"); if (x) x.style.display = "none"
      x = document.getElementById("walletsPerCatContainer"); if (x) x.classList.add("selected")
      x = document.getElementById("proportionalViewContainer"); if (x) x.classList.remove("selected")
  }

  var d = document.createElement("div")
  d.classList.add("page-section")

  var g = document.createElement("div")
  g.setAttribute("id", "tableofwallets")
  g.innerHTML = `<div id="modal" style="position:fixed;left:0;top:0;width:100%;height:100%;z-index:50;display:none" onclick="toggleApp(lastId);">&nbsp;</div>`

  var f = document.createElement("div")
  f.classList.add("flexi-list")

  var h = ``
  var c = 0
  var presort = [];
  window.wallets.forEach(function (obj) {
    if (obj.appId && obj.verdict && obj.category) {
      if (verdict === "all" || String(obj.verdict) === verdict) {
        if (platform === "all" || String(obj.category) === platform) {
          presort.push(obj);
          c++
        }
      }
    }
  });

  presort.sort(function (a, b) {
    function __nn(o) {
        return { n: o.users||o.ratings||o.reviews, id: o.appId };
    }
    
    var aa = __nn(a),
        bb = __nn(b);
        
    return aa.n - bb.n || aa.id - bb.id;
  });
  presort.reverse()
  presort.forEach(function(obj) {
      var der_id = String(obj.appId).replace(".", "")
    h += `<div id="card_${der_id}" class="AppDisplayCard" style="cursor:pointer;cursor:hand;float:left;" href="${obj.url}">
            <div style="width:7em;position: relative;" onclick="toggleApp('${der_id}')">
              <div id="show_${der_id}" class="card-expand-close">
                <i class="fas fa-plus-square"></i>
              </div>
              <div id="hide_${der_id}" style="display:none" class="card-expand-close card-close" onclick="toggleApp()">
                <i class="fas fa-minus-square"></i>
              </div>
              <div style="position:relative">
                <div class="flex-r">
                  <div class="app_logo">
                      <img loading="lazy" src="/images/wallet_icons/${obj.folder}/small/${obj.icon}" class="app_logo" alt="Wallet Logo">
                  </div>
                  <span class="stamp stamp-${obj.verdict}" alt=""></span>
                </div>
              </div>
                <div class="app_info_box">
                    <strong>${obj.altTitle || obj.title}</strong>
                </div>
            </div>
            <div id="details_${der_id}" class="item-detail-container" style="width:20em;display:none">
              <table>
                <tbody><tr><td>Verdict</td>
                  <td class="verdict">
                    <span class="${obj.verdict} tooltip">
                    ${obj.verdictText}
                      <span class="tooltiptext">
                      ${obj.message}
                      </span>
                    </span>
                  </td>
                </tr>
                ${obj.downloads ? `<tr><td>Downloads</td><td>${obj.downloads}</td></tr>` : ``}
                ${obj.users && obj.stars ? (`<tr><td>Rating</td><td>${obj.stars ? (`${obj.stars} stars by `) : ``}${obj.users} users</td></tr>`) : ``}
                ${obj.size ? `<tr><td>App size</td><td>${obj.size}</td></tr>` : ``}
                ${obj.launchDate ? (`<tr><td>Launched</td><td>${obj.launchDate}</td></tr>`):``}
                <tr><td>Reviewed</td><td>${obj.date}</td></tr>
                <tr><td>${obj.category}</td><td>
                ${obj.idd ? (`<a href="https://apps.apple.com/us/app/id${obj.idd}">${obj.appId}</a>`): (`<a href="https://play.google.com/store/apps/details?id=${obj.appId}">${obj.appId}</a>`)}
                </td></tr>
                ${obj.developerWebsite ? `<tr><td>Website</td><td><a href="${obj.developerWebsite}">${obj.developerWebsite}</a></td></tr>` : ``}
                ${obj.repository ? `<tr><td>Source Code</td><td><a href="${obj.repository}">${obj.repository}</a></td></tr>` : ``}
                ${obj.issue ? (`<tr><td>Open Issue</td><td><a href="${obj.issue}">${obj.issue}</a></td></tr>`):``}
              </tbody></table>
              <p><a href="/${obj.folder}/${obj.appId}/" rel="permalink">
                <strong style="float:right">Full Analysis&nbsp;<i class="fas fa-arrow-right"></i></strong>
              </a></p>
            </div>
            </div>`
  })

  f.innerHTML = h.length == 0 ? `<h2>No wallets...</h2>` : h
  d.append(g)
  d.append(f)
  document.getElementById("modularWalletPayload").querySelectorAll(".page-section")[0].replaceWith(d)
}

window.addEventListener("scroll", function (e) {
  const p = document.getElementById("modularWalletPayload")
  const o = p.getBoundingClientRect().bottom
  document.querySelectorAll(".fragmented-controls-master")[0].getBoundingClientRect().top
  if (o <= 100) {
    p.style.height = `${p.getBoundingClientRect().height}px`
    p.style.overflow = "hidden"
    document.querySelectorAll(".fragmented-controls-master")[0].querySelectorAll(".-disappearable").forEach(function (e) {
      e.style.transform = `translateY(${o - 100}px)`
      e.getBoundingClientRect().bottom <= 0 && (e.style.display = "none")
    })
  } else {
    document.querySelectorAll(".fragmented-controls-master")[0].querySelectorAll(".-disappearable").forEach(function (e) {
      e.style.transform = `translateY(0px)`
      e.style.display = ""
      p.style.height = ""
      p.style.overflow = ""
    })
  }
})

var x, y
x = document.getElementById("SwitchToDownloadsView"); if (x) x.addEventListener("click", function (e) {
  y = document.getElementById("walletsPerCatContainer"); if (y) y.classList.remove("selected")
  y = document.getElementById("proportionalViewContainer"); if (y) y.classList.add("selected")
})
x = document.getElementById("SwitchToWalletsView"); if (x) x.addEventListener("click", function (e) {
  y = document.getElementById("walletsPerCatContainer"); if (y) y.classList.add("selected")
  y = document.getElementById("proportionalViewContainer"); if (y) y.classList.remove("selected")
})
updateModularPayload()
document.body.addEventListener('keydown', function(e) {
  if (e.key === "Escape") toggleApp()
})
