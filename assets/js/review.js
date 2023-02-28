let dateFields = document.querySelectorAll(".calculate-time-elapsed")
for (let i = 0; i < dateFields.length; i++) {
  const instance = dateFields[i]
  let t = instance.getAttribute("data")
  const secondary = (instance.classList.contains("sec") || instance.classList.contains("secondary")) ? true : false
  dateFields[i].innerHTML = elapsedTime(t, secondary)
}

function elapsedTime(ts, secondary) {
  const sec = secondary ? 'class="secondary-text"' : ''
  const nowTs = new Date().getTime() / 1000
  var dt = Math.floor((nowTs - ts) / 60 / 60 / 24) // time elapsed in days
  const options = {
    year: dt / 365,
    month: dt / 30,
    week: dt / 7,
    day: dt
  }
  for (const k in options) {
    let r = Math.floor(options[k])
    if (r > 0)
      return `${r} <span ${sec}>${k}${r > 1 ? "s" : ""} ago</span>`
  }
  return `<span ${sec}>today</span>`
}

function verdictBadge(v) {
  return `<a id="${v}" href="/methodology/#${v}" class="verdictBadge ${v}"><span>${window.verdicts[v].short}</span></a>`
}

function walletLink(w) {
  return `
  <div class="also-for">
    <a href="${w.url}">
      <img class="app_logo ${w.folder}"
      src="/images/wIcons/${w.folder}/tiny/${w.icon}"
      alt="Wallet Logo">
      <span>${w.altTitle || w.title}</span>
      <span><i class="${window.platforms[w.folder].css}"></i>&nbsp;${window.platforms[w.folder].category}</span>
      </a>
  </div>
  `
}

if (window.wsId) {
  const folder = window.location.pathname.split("/")[1]

  window.orderedObs.forEach(obj => {
    let html = ''
    if (obj.wsId === window.wsId) {
      if (obj.folder !== folder) {
        html += walletLink(obj)
      } else if (obj.versions) {
        obj.versions.forEach(v => {
          html += walletLink(v)
        })
      }
    } else {
      if (obj.versions && Array.isArray(obj.versions)) {
        obj.versions.forEach(version => {
          if (version.wsId === window.wsId) {
            html += walletLink(version)
          }
        })
      }
    }
    if (html.length > 0) {
      const htmlEle = document.createElement("div")
      htmlEle.classList.add("see-also-container")
      htmlEle.innerHTML = html
      document.querySelector(".see-also").replaceWith(htmlEle)
    }
  })
}

// TAB VIEW
// document.querySelectorAll(".tab-view").forEach((ele) => {
//   ele.querySelectorAll(".label")
// })

document.querySelectorAll(".tab-view .label").forEach((ele) => {
  ele.addEventListener("click", (event) => {
    const self = event.target
    document.querySelectorAll(".active").forEach((active) => { active.classList.remove('active') })
    self.classList.add("active")
    document.querySelector(`.${self.getAttribute("data-for")}`).classList.add("active")
  })
})