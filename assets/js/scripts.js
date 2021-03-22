if (document.getElementById("modularVerdictPH") && window.verdictOrder && window.verdictOrder.length > 0) {
  var s = document.createElement("select");
  s.setAttribute("id", "modularVerdict");
  s.setAttribute("oninput", "window.modularSelectedVerdict = this.value; updateModularPayload()")
  
  var o = document.createElement("option");
  o.value = "all";
  o.innerHTML = "all";
  s.append(o)
  
  window.verdictOrder.forEach(t => {
    var o = document.createElement("option");
    o.value = t;
    o.innerHTML = t;
    s.append(o)
  });

  document.getElementById("modularVerdictPH").replaceWith(s);
  document.getElementById("modularVerdict").selectedIndex = 1;
}

if (document.getElementById("modularPlatformPH") && window.platformObs && window.platformObs.length > 0) {
  var s = document.createElement("select");
  s.setAttribute("id", "modularPlatform");
  s.setAttribute("oninput", "window.modularSelectedPlatform = this.value; updateModularPayload()")
  
  window.platformObs.forEach(t => {
    var o = document.createElement("option");
    o.value = t;
    o.innerHTML = t;
    s.append(o)
  });

  document.getElementById("modularPlatformPH").replaceWith(s);
}


function updateModularPayload() {

  var a = document.getElementById("modularVerdict") && document.getElementById("modularVerdict").value ? document.getElementById("modularVerdict").value : "reproducible";
  var b = document.getElementById("modularPlatform") && document.getElementById("modularPlatform").value ? document.getElementById("modularPlatform").value : "android";

  document.querySelectorAll(".-filter-element").forEach(function (e) {
    e.classList.contains(`-${window.transcribeTag(b).category}`) ? (e.style.display="flex") : (e.style.display="none")
  })

  b === 'Play Store' || b === 'android' ? (
    document.getElementById("SwitchToDownloadsView") && (
      document.getElementById("SwitchToDownloadsView").style.display = ""
    )
  ): (
    document.getElementById("SwitchToDownloadsView") && (
      document.getElementById("SwitchToDownloadsView").style.display = "none",
        document.getElementById("walletsPerCatContainer") && (
        document.getElementById("walletsPerCatContainer").classList.add("selected")
        ),
        document.getElementById("proportionalViewContainer") && (
          document.getElementById("proportionalViewContainer").classList.remove("selected")
        )
    )
    
  )

  var d = document.createElement("div");
  d.classList.add("page-section");

  var g = document.createElement("div");
  g.setAttribute("id", "tableofwallets");
  g.innerHTML = `<div id="modal" style="position:fixed;left:0;top:0;width:100%;height:100%;z-index:50;display:none" onclick="toggleApp(lastId);">&nbsp;</div>`;



  var f = document.createElement("div");
  f.classList.add("flexi-list");

  var h = ``;
  var c = 0;
  window.orderedObs.forEach(function (obj) {
    if (obj.appId && obj.verdict && obj.category) {
      var c = String(obj.appId).replace(".", "");

      if (a === "all" || String(obj.verdict) === a) {
        if (b === "all" || String(obj.category) === b) {
          h += `<div id="card_${c}" class="AppDisplayCard" style="cursor:pointer;cursor:hand;float:left;" href="${obj.url}">
            <div style="width:7em;position: relative;" onclick="toggleApp('${c}')">
              <div id="show_${c}" class="card-expand-close">
                <i class="fas fa-plus-square"></i>
              </div>
              <div id="hide_${c}" style="display:none" class="card-expand-close card-close" onclick="toggleApp()">
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
                    <strong>${obj.title}</strong>
                </div>
            </div>
            <div id="details_${c}" class="item-detail-container" style="width:20em;display:none">
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
                ${obj.downloads ? ( `<tr><td>Downloads</td><td>${obj.downloads}</td></tr>`) : ``}
                ${obj.users && obj.stars ? (`<tr><td>Rating</td><td>${obj.stars ? (`${obj.stars} stars by `) : ``}${obj.users} users</td></tr>`):``}
                
                ${obj.size ? ( `<tr><td>App size</td><td>${obj.size}</td></tr>` ):``}
                
                ${obj.launchDate ? (`<tr><td>Launched</td><td>${obj.launchDate}</td></tr>`):``}
                
                <tr><td>Reviewed</td><td>${obj.date}</td></tr>

                <tr><td>${obj.category}</td><td>
                ${obj.idd ? (`<a href="https://apps.apple.com/us/app/id${obj.idd}">${obj.appId}</a>`): (`<a href="https://play.google.com/store/apps/details?id=${obj.appId}">${obj.appId}</a>`)}
                </td></tr>
                
                <tr><td>Website</td><td><a href="${obj.developerWebsite}">${obj.developerWebsite}</a></td></tr>
                
                <tr><td>Source Code</td><td><a href="${obj.repository}">${obj.repository}</a></td></tr>
                ${obj.issue ? (`<tr><td>Open Issue</td><td><a href="${obj.issue}">${obj.issue}</a></td></tr>`):``}
                
                
                
                
              </tbody></table>
              <p><a href="/${obj.folder}/${obj.appId}/" rel="permalink">
                <strong style="float:right">Full Analysis&nbsp;<i class="fas fa-arrow-right"></i></strong>
              </a></p>
            </div>
            </div>`;
          c++;
        }
      }
    }
  })

  f.innerHTML = h.length == 0? `<h2>No wallets...</h2>` : h;
  d.append(g);
  d.append(f);
  document.getElementById("modularWalletPayload").querySelectorAll(".page-section")[0].replaceWith(d);
}

window.addEventListener("scroll", function (e) {
  var o = document.getElementById("modularWalletPayload").getBoundingClientRect().bottom;
  document.querySelectorAll(".fragmented-controls-master")[0].getBoundingClientRect().top;
  if (o <= 100) {
    document.getElementById("modularWalletPayload").style.height = `${document.getElementById("modularWalletPayload").getBoundingClientRect().height}px`;
    document.getElementById("modularWalletPayload").style.overflow = "hidden"
    document.querySelectorAll(".fragmented-controls-master")[0].querySelectorAll(".-disappearable").forEach(function (e) {
      e.style.transform = `translateY(${o - 100}px)`;
      e.getBoundingClientRect().bottom <= 0 && (e.style.display = "none")
    })
  } else {
    document.querySelectorAll(".fragmented-controls-master")[0].querySelectorAll(".-disappearable").forEach(function (e) {
      e.style.transform = `translateY(0px)`;
      e.style.display = ""
      document.getElementById("modularWalletPayload").style.height = "";
      document.getElementById("modularWalletPayload").style.overflow = ""
    })
  }
})

updateModularPayload()

document.getElementById("SwitchToDownloadsView") && (
  document.getElementById("SwitchToDownloadsView").addEventListener("click", function (e) {
    document.getElementById("walletsPerCatContainer") && (
    document.getElementById("walletsPerCatContainer").classList.remove("selected")
    )
    document.getElementById("proportionalViewContainer") && (
      document.getElementById("proportionalViewContainer").classList.add("selected")
    )
  }),
  updateModularPayload()
)

document.getElementById("SwitchToWalletsView") && (
  document.getElementById("SwitchToWalletsView").addEventListener("click", function (e) {
    document.getElementById("proportionalViewContainer") && (
    document.getElementById("proportionalViewContainer").classList.remove("selected")
    )
    document.getElementById("walletsPerCatContainer") && (
      document.getElementById("walletsPerCatContainer").classList.add("selected")
    )
  }),
  updateModularPayload()
)