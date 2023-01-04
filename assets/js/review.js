let dateFields = document.querySelectorAll(".calculate-time-elapsed")
for(i=0; i<dateFields.length; i++) {
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
  for (k in options) {
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
  return `<span class="wallet-link">
<img
  class="app_logo ${w.folder}"
  src="/images/wIcons/${w.folder}/tiny/${w.icon}"
  alt="Wallet Logo">
<a href="${w.url}">${w.altTitle || w.title}</a>&nbsp;${verdictBadge(w.verdict)} </span>`
}

if (document.getElementById("versions").hasAttribute("wsId")) {
  var cVId = document.getElementById("versions").getAttribute("wsID")
  var folder = window.location.pathname.split("/")[1]
  var html = ''
  window.orderedObs.forEach(e => {
    if (e.wsId === cVId) {
      if (e.folder !== folder) {
        html+= `${walletLink(e)}<br>`
      } else if (e.versions) {
        e.versions.forEach(v => {
          html+= `${walletLink(v)}<br>`
        })
      }
    } else {
      if (e.versions && Array.isArray(e.versions)) {
        e.versions.forEach(v => {
          if (v.wsId === cVId) {
            html+= `${walletLink(v)}<br>`
          }
        })
      }
    }
  })
  document.getElementById("versions").innerHTML = `See also ${html}`
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