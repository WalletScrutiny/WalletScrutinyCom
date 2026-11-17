let dateFields = document.querySelectorAll(".calculate-time-elapsed")
for (let i = 0; i < dateFields.length; i++) {
  const instance = dateFields[i]
  let t = instance.getAttribute("data")
  const secondary = (instance.classList.contains("sec") || instance.classList.contains("secondary")) ? true : false
  const brackets = (instance.classList.contains("brackets") || instance.classList.contains("brackets")) ? true : false
  dateFields[i].innerHTML = elapsedTime(t, secondary, brackets, instance)
}

function elapsedTime(ts, secondary, brackets, instance) {
  const sec = secondary ? 'class="secondary-text"' : ''
  let bra = brackets ? ['(', ')'] : ['', '']

  const nowTs = new Date().getTime() / 1000
  var dt = Math.floor((nowTs - ts) / 60 / 60 / 24) // time elapsed in days
  const options = {
    year: dt / 365,
    month: dt / 30,
    week: dt / 7,
    day: dt
  }
  let processed = `<span ${sec}>today</span>`
  const warn = instance.classList.contains("raw")?'':'warn'
  for (const k in options) {
    let r = Math.floor(options[k])
    if (r > 0) {
      bra = k === 'year' ? ['(<span class="' + warn + '">', '</span>)'] : bra
      processed = `${bra[0]}${r} <span ${sec}>${k}${r > 1 ? "s" : ""} ago</span>${bra[1]}`
      break
    }
  }
  return processed
}

// Mark dead and archived links across the whole page
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href*="#deadLink"], a[href*="&deadLink"]').forEach((a) => {
    a.classList.add('dead-link')
    a.title = (a.title ? a.title + ' ' : '') + '(Dead link)'
    if (!a.textContent.includes('\uD83D\uDC80')) a.textContent += ' \uD83D\uDC80'
  })
  document.querySelectorAll('a[href*="web.archive.org/web/"]').forEach((a) => {
    if (a.classList.contains('dead-link')) return
    a.classList.add('archived-link')
    a.title = (a.title ? a.title + ' ' : '') + '(Archived)'
    if (!a.textContent.includes('\uD83D\uDCE6')) a.textContent += ' \uD83D\uDCE6'
  })
})

if (document.querySelector(".app_logo_big")) {
  let imgObj = new Image();
  imgObj.src = document.querySelector(".app_logo_big").src;
  imgObj.onload = setTimeout( ()=> {
    let colorThief = new ColorThief();
    let colour = false
    for (const rgb of colorThief.getPalette(imgObj, 3)) {
      if (rgb[0] < 70 && rgb[1] < 70 & rgb[2] < 70) { continue; }
      if (rgb[0] > 130 && rgb[1] > 130 & rgb[2] > 130) { continue; }
      if (colour) { break; }
      colour = `rgba(${rgb[0]},${rgb[1]},${rgb[2]}, 0.2)`
      document.documentElement.style.setProperty('--wallet-low-contrast', `rgba(${rgb[0]},${rgb[1]},${rgb[2]}, 0.1)`);
      document.documentElement.style.setProperty('--wallet-gradient', colour);
      document.documentElement.style.setProperty('--wallet-solid', `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`);
      document.body.setAttribute("data-colour-available", "true")
    }
  }, 100)
}


//TESTS SECTION SCRIPTS

window.addEventListener("hashchange", () => {
  try {
    const id = decodeURIComponent(location.hash.slice(1));
    const target = id ? document.getElementById(id) : null;
    if (target) {
      target.setAttribute("data-open", "true");
    }
  } catch (error) {}
});

for (const frame of document.querySelectorAll('iframe')) {
  let src = frame.getAttribute("src");
  if (!src) {
    console.error("Iframe with no src attribute found:", frame);
    continue; 
  }
  let theme = localStorage && localStorage.getItem("colour-scheme") ? localStorage.getItem("colour-scheme") : 'auto';
  frame.setAttribute("src", src.replace(/auto/, theme));
}
