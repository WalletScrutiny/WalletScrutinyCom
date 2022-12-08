function exitSearchUI() {
  const ui = document.querySelector(".results-target")
  ui.innerHTML = ""
  ui.classList.remove("visible")
  document.body.classList.remove("search-ui-active")
}
document.querySelector(".exit-search-target").addEventListener("click", () => {
  exitSearchUI()
})
document.querySelector(".reset-search").addEventListener("click", (event) => {
  event.stopPropagation()
  document.querySelector(".searchbar").value = ""
  document.querySelector(".search-controls").classList.remove("hint-return")
  document.querySelector(".wallet-search").classList.remove("active")
  document.querySelector(".search-controls").classList.remove("working")
  document.querySelector(".search-controls").classList.remove("edited")
  exitSearchUI()
})
document.querySelectorAll(".search-trigger-target").forEach((ele) => {
  ele.addEventListener("click", () => {
    searchTrigger()
  })
})
document.querySelector(".searchbar").value = ""
document.querySelector(".searchbar").addEventListener("input", () => {
  window.searchTerm = document.querySelector(".searchbar").value
  searchTrigger()
})
document.querySelector(".searchbar").addEventListener("keyup", (e) => {
  if (e.key === 'Enter' || e.keyCode === 13) {
    window.searchTerm = document.querySelector(".searchbar").value
    searchTrigger()
  }
})
document.querySelector(".searchbar").addEventListener("click", () => {
  document.querySelector(".search-controls").classList.add("hint-return")
  // searchTrigger()
})
function searchTrigger() {
  if (window.searchTerm?.length > 0) {
    document.querySelector(".wallet-search").classList.add("active")
    document.querySelector(".search-controls").classList.add("working")
    document.querySelector(".search-controls").classList.add("edited")
    document.querySelector(".search-controls").classList.remove("hint-return")
  }
  else {
    document.querySelector(".wallet-search").classList.remove("active")
    document.querySelector(".search-controls").classList.remove("working")
    document.querySelector(".search-controls").classList.remove("edited")
  }

  clearTimeout(window.walletSearchTimeoutTrigger)
  if (window.searchTerm?.length > 0) {
    window.walletSearchTimeoutTrigger = setTimeout(() => { searchCatalogueNav(window.searchTerm) }, 200)
  }
}
window.temporarySearchValue = ""
function searchCatalogueNav(input) {
  document.body.classList.add("search-ui-active")
  const result = document.querySelector(".results-target")
  result.classList.add("visible")
  const term = input.trim().toUpperCase()
  const minTermLength = 1
  if (window.temporarySearchValue !== term) {
    window.temporarySearchValue = term;
    if (term.length > minTermLength) {
      var matchCounter = 0
      window.orderedObs.forEach(wallet => {
        if (wallet.title) {
          let searchableTerms = `${[wallet, ...(wallet.versions || [])].map(v => ` ${v.title} ${v.folder}/${v.appId} ${v.website}`).join(" ")}`

          if (matchCounter < 1)
            result.innerHTML = `<li onclick="event.stopPropagation();"><a style='font-size:.7rem;opacity:.7;text-style:italics;'>No matches</a></li>`
          document.querySelector(".search-controls").classList.remove("working")
          let index = searchableTerms.toLocaleUpperCase().indexOf(term)

          if (index !== -1) {
            if (matchCounter == 0) {
              result.innerHTML = ""
            }
            const walletRow = document.createElement("li")
            if (matchCounter < 10) {
              walletRow.style['animation-delay'] = matchCounter * .2 + 's'
            }
            walletRow.classList.add("actionable")
            let compactedResults = ""
            compactedResults += makeCompactResultsHTML(wallet)


            var det = ""
            if (wallet.versions && wallet.versions.length > 0) {
              for (let i = 0; i < wallet.versions.length; i++) {
                searchableTerms += `${wallet.versions[i].category} ${wallet.versions[i].verdict} multi cross`;
                compactedResults += makeCompactResultsHTML(wallet.versions[i])
              }
              det = "-hom"
            }
            walletRow.innerHTML = `<div class="${det}">${compactedResults}</div>`
            document.querySelector(".search-controls").classList.remove("working")
            result.append(walletRow)
            matchCounter++
          }
        }
      })
    } else if (term.length != 0) {
      var l = document.createElement("li")
      var rem = (minTermLength + 1) - term.length
      var s = rem > 1 ? "s" : ""
      l.innerHTML = `<a style='font-size:.7rem;opacity:.7;text-style:italics;'>Enter ${rem} more character${s} to search all records</a>`
      result.append(l)
    }
    searchScrollToTop()
  }
}

function makeCompactResultsHTML(w) {
  let result = ""
  const basePath = w.base_path || ""
  var analysisUrl = `${basePath}${w.url}`
  result += `<a class="result-pl-inner" onclick="window.location.href = '${analysisUrl}';"
  href='${analysisUrl}'>
  <img src='${w.icon
      ? `${basePath}/images/wIcons/${w.folder}/small/${w.icon}`
      : `${basePath}/images/smallNoicon.png`}' class='wallet-icon' />
<span>${w.altTitle || w.title}</span>
<span class="badge-2 ${w.verdict}">
    <i class="${window.platforms[w.folder].css}"></i>
    <span><nobr>${verdicts[w.verdict].short}</nobr></span>
</span>
</a>`
  return result
}
function searchScrollToTop() {
  if (window.innerWidth <= 700) {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }
}