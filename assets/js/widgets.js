let url = new URL(window.location).hash
const urlHash = url.substring(1)
url = url.indexOf("#") == 0 ? url.substring(1) : url
url = url.split("&")
let widgetQuery = {}
for (const obj of url) {
  let item = obj.split("=")
  widgetQuery[item[0]] = item[1]
}
document.body.classList.add(widgetQuery.theme)
document.body.classList.add(widgetQuery.style)
if (widgetQuery.theme === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.body.classList.add('dark')
}
const q = widgetQuery.appId.split("/")
const folder = q[0]
const id = q[1]
fetch('/assets/js/json/wallets.json', {
  method: 'GET',
})
  .then(response => response.json())
  .then(data => { fetchWallet(data) })


function fetchWallet(data) {
  if (data[folder]?.[id]) {
    makeWidgetHTML(data[folder][id])
  }
}

function makeWidgetHTML(wallet) {
  for (const [key, value] of Object.entries(wallet)) {
    if (document.querySelector(`.${key}`)) {
      document.querySelector(`.${key}`).setAttribute("data-key", key)
      document.querySelector(`.${key}`).setAttribute("data", value)
      if (!value) {
        document.querySelector(`.${key}`).style.display = 'none';
      }
    }
  }
  if (document.querySelector(".icon")) {
    document.querySelector(".icon").setAttribute('src', `/images/wIcons/${folder}/${document.querySelector(".icon").getAttribute("data")}`)
  }
  if (document.querySelector(".link")) {
    document.querySelector(".link").setAttribute('href', `/${widgetQuery.appId}`)
  }
  try {
    if (document.querySelector(".date")) {
      document.querySelector(".date").setAttribute('data', document.querySelector(".date").getAttribute('data').split(' ')[0])
    }
  } catch (e) { }
}

window.getDimensions = false
window.dimensionsSent = false
window.addEventListener("load", function () {
  window.getDimensions =
    setInterval(() => {
      const height = document.querySelector(".widget-holder").clientHeight
      const width = document.querySelector(".widget-holder").clientWidth
      if (height > 0 && width > 0) {
        window.dimensionsSent = true
        parent.postMessage({ h: height + 10, w: width + 10, name: urlHash });
      }
    }, 1000)
});

window.addEventListener("resize", () => {
  if (window.dimensionsSent) {
    clearInterval(window.getDimensions)
    window.getDimensions = false
  }
})