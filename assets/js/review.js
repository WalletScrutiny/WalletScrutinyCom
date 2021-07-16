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
      return `${r} ${k}${r > 1 ? "s" : ""} ago`
  }
  return "today"
}

if (document.getElementById("versions").hasAttribute("wsId")) {
  var cVId = document.getElementById("versions").getAttribute("wsID")
  var folder = window.location.pathname.split("/")[1]
  var html = ``
  window.orderedObs.forEach(e => {
    if (e.wsId === cVId) {
      if (e.folder !== folder) {
        html+= `<a href="${e.url}"><b>${e.category}</b> version review available here.</a><br>`
      } else if (e.versions) {
        e.versions.forEach(function (v) {
          html+= `<a href="${v.url}"><b>${v.category}</b> version review available here.</a><br>`
        })
      }
    } else {
      if (e.versions && Array.isArray(e.versions)) {
        e.versions.forEach(function (v) {
          if (v.wsId === cVId) {
            html+= `<a href="${v.url}"><b>${v.category}</b> version review available here.</a><br>`
          }
        })
      }
    }
  })
  document.getElementById("versions").innerHTML = html
}