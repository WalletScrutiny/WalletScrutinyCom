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

function verdictBadge(v) {
  return `<a id="${v}" href="/methodology/#${v}" class="verdictBadge ${v}"><span>${window.verdicts[v].short}</span></a>`
}

// TAB VIEW

document.querySelectorAll(".tab-view .label").forEach((ele) => {
  ele.addEventListener("click", (event) => {
    const self = event.target
    document.querySelectorAll(".active").forEach((active) => { active.classList.remove('active') })
    self.classList.add("active")
    document.querySelector(`.${self.getAttribute("data-for")}`).classList.add("active")
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
  if(document.querySelector(`${location.hash}`)){
    document.querySelector(`${location.hash}`).setAttribute("data-open", "true")
  }
});
let scoreIndex=0
document.querySelectorAll(".score div i").forEach((ele)=>{
  ele.setAttribute("data-index", scoreIndex)
  ele.addEventListener('click', (event)=>{
    window.location.hash = `#${document.querySelectorAll(".methodology-accordion")[event.target.getAttribute("data-index")].getAttribute('id')}`
  })
  ele.addEventListener('mouseenter', (event)=>{
    const i = event.target.getAttribute("data-index")
    document.querySelectorAll(".methodology-accordion").forEach((element)=>{element.classList.remove('highlight')})
    document.querySelectorAll(".methodology-accordion")[i].classList.add('highlight')
  })
  ele.addEventListener('mouseleave', ()=>{
    document.querySelectorAll(".methodology-accordion").forEach((element)=>{element.classList.remove('highlight')})
  })
  scoreIndex++
})

let accordionIndex=0
document.querySelectorAll(".methodology-accordion").forEach((ele)=>{
  ele.setAttribute("data-index", accordionIndex)
  ele.addEventListener('mouseenter', (event)=>{
    const i = event.target.getAttribute("data-index")
    document.querySelectorAll(".score div i").forEach((element)=>{element.classList.remove('highlight')})
    document.querySelectorAll(".score div i")[i].classList.add('highlight')
  })
  ele.addEventListener('mouseleave', ()=>{
    document.querySelectorAll(".score div i").forEach((element)=>{element.classList.remove('highlight')})
  })
  accordionIndex++
})

for (const frame of document.querySelectorAll('iframe')) {
  let src = frame.getAttribute("src");
  if (!src) {
    console.error("Iframe with no src attribute found:", frame);
    continue; 
  }
  let theme = localStorage && localStorage.getItem("colour-scheme") ? localStorage.getItem("colour-scheme") : 'auto';
  frame.setAttribute("src", src.replace(/auto/, theme));
}
