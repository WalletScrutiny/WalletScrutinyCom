let dateFields = document.querySelectorAll(".calculate-time-elapsed")
for (let i = 0; i < dateFields.length; i++) {
  let t = dateFields[i].getAttribute("data")
  dateFields[i].innerHTML = elapsedTime(t)
}

function elapsedTime(ts) {
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
      return `${r} <span class="secondary-text">${k}${r > 1 ? "s" : ""}</span>`
  }
  return `<span class="secondary-text">today</span>`
}

function verdictBadge(v) {
  return `<a id="${v}" href="/methodology/#${v}" class="verdictBadge ${v}"><span>${window.verdicts[v].short}</span></a>`
}

function walletLink(w) {
  return `
  <label>
    <i class="${getIcon(w.folder)}"></i>&nbsp;Also for ${w.folder}
  </label>
  <div>
    <a href="${w.url}">
      <img class="app_logo ${w.folder}"
      src="/images/wIcons/${w.folder}/tiny/${w.icon}"
      alt="Wallet Logo">${w.altTitle || w.title}<i class="fas fa-chevron-right"></i></a>
  </div>
  <span>
    <div class="stamps">
      <span data-text="${w.verdict}" class="stamp stamp-${w.verdict}" alt=""></span>
    </div>
  </span>`
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
      htmlEle.innerHTML = html
      document.querySelector(".app-payload-flex").append(htmlEle)
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