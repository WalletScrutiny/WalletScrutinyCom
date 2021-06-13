function fetchWallet(wallet, folder) {
  return wallets.find( w => w.appId===wallet && w.folder===folder)
}

window.addEventListener("load", function () {
  var appId, style, appList, verdict, limit, wallet, theme
window.location.hash.split("#")[1].split("&").forEach(function (item) {
  var kv = item.split("=")
  switch (kv[0]) {
    case "appId":
      const folderAppId = kv[1].split("/")
      wallet = fetchWallet(folderAppId[1], folderAppId[0])
      break
    case "style": style = kv[1]; break
    case "appList": appList = kv[1].split(","); break
    case "verdict": verdict = kv[1]; break
    case "limit": limit = kv[1]; break
    case "theme": theme = kv[1]; break
  }
})

var stylebase = document.documentElement;

if (!theme || theme.length < 1) {
  if (!localStorage.getItem('theme')) {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      localStorage.setItem('theme', 'dark')
    } else {
      localStorage.setItem('theme', 'light')
    }
  }
} else {
  localStorage.setItem('theme', theme)
}
theme = localStorage.getItem('theme')
function setThemeDark() {
  stylebase.style.setProperty('--white', "#222")
  stylebase.style.setProperty('--blue', "#0064ff")
  stylebase.style.setProperty('--light-grey', "#000")
  stylebase.style.setProperty('--text', "#fff")
  stylebase.style.setProperty('--gauze', "rgba(255,255,255,0.3")
}

function setThemeLight() {
  stylebase.style.setProperty('--white', "#fff")
  stylebase.style.setProperty('--blue', "#003395")
  stylebase.style.setProperty('--light-grey', "#fafafa")
  stylebase.style.setProperty('--text', "#222")
  stylebase.style.setProperty('--gauze', "rgba(0,0,0,0.3")
}

switch (theme) {
  case "dark":
    setThemeDark()
    break
  case "light":
    setThemeLight()
    break
  case "auto":
  default:
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeDark()
    } else {
      setThemeLight()
    }
}

var b = document.createElement("div")
var s = ""
switch (style) {
  case "short":
    b.innerHTML = getWidgetHtml(wallet, false)
    s = "position:relative;width: calc(100vw - 1.25rem);padding: 1rem .25rem .25rem 1rem;"
    break
  case "long":
    b.innerHTML = getWidgetHtml(wallet, true)
    s = "position:relative;width: calc(100vw - 1.25rem);padding: 1rem .25rem .25rem 1rem;display: grid;grid-auto-flow: row;grid-template-rows: auto 1fr;height: calc(100vh - 1.75rem);";
    break
  default:
}
b.setAttribute("style", s)
document.body.append(b)
document.querySelectorAll("strong").length > 0 && (
  document.querySelectorAll("strong")[0].innerHTML.length > 20 && (
    document.querySelectorAll("strong")[0].style['font-size'] = "15px"
  )
)
}, false)

function getWidgetHtml(wallet, includeDetails) {
  var details = (includeDetails) ? `
    <table style="color: var(--blue, #003395);height: calc(100% - .75rem);border-collapse: collapse;margin:.5rem .75rem .25rem 0;font-size: 14px;font-family:Helvetica Neue, Arial, sans-serif;">
      ${ hasValue(wallet.users) ? `<tr><td>Downloads</td><td>${wallet.users}</td></tr>` : ``}
      ${ hasValue(wallet.stars) ? `<tr><td>Rating</td><td>${wallet.stars} stars by ${wallet.ratings} users</td></tr>` : ``}
      ${ wallet.folder == "iphone"
        ? `<tr><td>App size</td><td>${ Math.round(wallet.size / 100000 ) / 10 }MB</td></tr>`
        : wallet.folder == "android"
        ? `<tr><td>App size</td><td>${ wallet.size }B</td></tr>`
        : ``
      }
      ${ hasValue(wallet.dimensions) ? `<tr><td>Size</td><td>${wallet.dimensions[0]}mm x ${wallet.dimensions[1]}mm x ${wallet.dimensions[2]}mm</td></tr>` : ``}
      ${ hasValue(wallet.released) ? `<tr><td>Released</td><td>${wallet.released}</td></tr>` : ``}
      <tr><td>Reviewed</td><td>${wallet.date}</td></tr>
      ${ wallet.folder == "iphone"
        ? `<tr><td>App Store</td><td><a target="_blank" href="https://apps.apple.com/us/app/id${wallet.idd}">${wallet.appId}</a></td></tr>`
        : wallet.folder == "android"
        ? `<tr><td>Google Play</td><td><a target="_blank" href="https://play.google.com/store/apps/details?id=${wallet.appId}">${wallet.appId}</a></td></tr>`
        : ``
      }
      ${ hasValue(wallet.website) ? `<tr><td>Website</td><td><a target="_blank" href="${wallet.website}">${wallet.website}</a></td></tr>` : ``}
      ${ hasValue(wallet.repository) ? `<tr><td>Source Code</td><td><a target="_blank" href="${wallet.repository}">${wallet.repository}</a></td></tr>` : ``}
      ${ hasValue(wallet.issue) ? `<tr><td>Open Issue</td><td><a target="_blank" href="${wallet.issue}">${wallet.issue}</a></td></tr>` : ``}
      ${ hasValue(wallet.providerTwitter) ? `<tr><td>Twitter</td><td><a target="_blank" href="https://twitter.com/${wallet.providerTwitter}">@${wallet.providerTwitter}</a></td></tr>` : ``}
      ${ hasValue(wallet.providerFacebook) ? `<tr><td>Facebook</td><td><a target="_blank" href="https://www.facebook.com/${wallet.providerFacebook}">${wallet.providerFacebook}</a></td></tr>` : ``}
      ${ hasValue(wallet.providerReddit) ? `<tr><td>Reddit</td><td><a target="_blank" href="https://www.reddit.com/r/${wallet.providerReddit}">r/${wallet.providerReddit}</a></td></tr>` : ``}
      ${ hasValue(wallet.providerLinkedIn) ? `<tr><td>LinkedIn</td><td><a target="_blank" href="https://www.linkedin.com/company/${wallet.providerLinkedIn}">${wallet.providerLinkedIn}</a></td></tr>` : ``}
    </table><style>td{padding:.25rem .5rem .25rem 0;}tr{box-shadow: 0px 10px 2px -10px #ddd;}td > a{text-decoration: none;}</style>` : ``
  return `
  <a target="_blank" style="display: flex;flex-direction: row;justify-content: start;align-items: center;text-decoration: none;color: var(--text, #222);" href="/${wallet.appId}/">
    <img style="box-shadow: 0px 2px 5px -2px var(--gauze, rgba(0,0,0,0.3));height: 3rem;width: auto;padding: .5rem;border-radius: 20%;background: var(--white, #fff);margin-right:1rem;"
      src="/images/wallet_icons/${ wallet.folder }/small/${wallet.icon}" alt="Wallet Logo">
    <div style="display: flex;flex-direction: column; margin:.5rem .5rem .5rem 0">
      <strong style="font-size: 18px;">${wallet.title}</strong>
      <span style="font-size: 10px;opacity: .6;">APK: ${wallet.version}</span>
      <span style="background:${window.verdicts[wallet.verdict].color};font-size: 10px;padding: 3px 10px;border-radius: 100px;color: var(--white, #fff);text-transform: uppercase;font-weight: 600;margin-right: auto;margin-top: 5px;" alt="">${wallet.verdict}</span>
    </div>
  </a>
  ${details}
  <div style="padding: .75rem .25rem .25rem 1rem;display: flex;flex-direction: row;flex-wrap: wrap;align-items: center;justify-content: end;width: 100%;position: fixed;bottom: 0;right: 0;">
    <a target="_blank" title="Verifiability data provided by Wallet Scrutiny" href="/#tableofwallets" style="text-decoration: none;font-family: sans-serif;font-size: 11px;margin-right: 10px;color: var(--blue, #0064ff);display: block;">WalletScrutiny.com</a>
    
    <span onclick="document.getElementById('info').style.display=\'block\';" style="font-size: 12px;font-family: Courier New, Courier, serif;width: 16px;height: 16px;display: block;color: var(--white, #fff);background: var(--blue, #0064ff);text-align: center;line-height: 16px;border-radius: 16px;cursor:pointer;">i</span>

  </div>
  <div id="info" style="display:none;position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background: var(--blue, #0064ff);color: var(--white, #fff);font-family: sans-serif;">
    <p style="padding: .5rem;margin:.25rem;font-size:12px;line-height:1.25rem;">Data provided by <a target="_blank" style="color:inherit;" href="https://WalletScrutiny.com">Wallet Scrutiny</a> and supported by your donations.<br><br><a>To embed a widget into your site, copy the code on any of the app details pages on <a target="_blank" style="color:inherit;" href="https://WalletScrutiny.com">our website</a>.</a></p>

  <p style="padding: .75rem .25rem .25rem 1rem;position: fixed;bottom: 0;right: 0;text-align: right;margin:0;"><span onclick="document.getElementById(\'info\').style.display=\'none\';" style="display: inline-block;background: var(--gauze, rgba(0,0,0,0.3));cursor:pointer;padding: 4px 8px;font-size: 12px;border-radius: 100px;">close</span></p>
  </div>`
}

function hasValue(x) {
  return typeof x === "boolean"
      || typeof x === "number"
      || typeof x === "object"
      || typeof x === "string" && x != ""
}
