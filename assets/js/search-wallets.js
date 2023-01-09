var pauseForInput
var searchInput
if (document.querySelectorAll(".wallet-search-placeholder").length > 0) {
  var searchParent = document.createElement("div")
  var resultsList = document.createElement("ul")
  resultsList.classList.add("results-list")
  searchParent.classList.add("walletSearch-parent")
  searchInput = document.createElement("input")
  var searchExitButton = document.createElement("span")
  searchExitButton.setAttribute("onclick", "blockEvent(event);exitSearch(1)")
  searchExitButton.classList.add("exit-search")
  searchExitButton.innerHTML = '<i class="fas fa-times"></i>'
  searchInput.setAttribute("oninput", "blockEvent(event);searchCatalogue(value)")
  searchInput.setAttribute("onclick", "blockEvent(event);heroUX(this)")
  searchInput.setAttribute("onfocus", "blockEvent(event);heroUX(this)")
  searchInput.setAttribute("onmouseenter", "blockEvent(event);scOOff()")
  searchInput.setAttribute("onmouseleave", "blockEvent(event);scOOn()")
  searchInput.setAttribute("placeholder", "Search wallets...")
  searchInput.classList.add("walletSearch")
  searchParent.append(searchInput)
  searchParent.append(searchExitButton)
  searchParent.append(resultsList)
  document.querySelectorAll(".wallet-search-placeholder")[0].replaceWith(searchParent)
}

function exitSearch(x) {
  document.querySelectorAll(".exit-search")[0].style.display = "none"
  document.querySelectorAll(".results-list")[0].style.display = "none"
  document.body.classList.remove("search-ui-active")
  window.removeEventListener('wheel', captureScrollForSearch)
  window.temporarySearchValue = ""
  x && (searchInput.value = "")
  searchInput.blur()
}

document.getElementById("exitSearchTrigger").addEventListener("click", event => {
  if (event.target != this) {
    return
  }
  exitSearch()
})

var scrPos = 0
var scrollOverride = 0

function captureScrollForSearch(e) {
  scrPos = scrPos + e.deltaY
  !scrollOverride && (
    document.querySelectorAll(".results-list")[0].scrollTop = scrPos
  )
}

function scOOff() {
  scrollOverride = 0
}

function scOOn() {
  scrollOverride = 1
}

function blockEvent(e) {
  e.stopPropagation()
  e.preventDefault()
}

function focusResults(e) {
  e.preventDefault()
  if (e.keyCode === "40") {
    document.querySelectorAll(".results-list")[0].querySelectorAll(".li")[0].focus()
  }
}
window.temporarySearchValue = ""
function searchCatalogue(input) {
  const activityIndicationClearTrigger = document.querySelectorAll(".exit-search")[0].querySelectorAll('i')[0]
  const result = document.createElement("ul")
  result.classList.add("results-list")
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
            result.innerHTML = "<li><a style='font-size:.7rem;opacity:.7;text-style:italics;'>No matches</a></li>"

          let index = searchableTerms.toLocaleUpperCase().indexOf(term)

          if (index !== -1) {
            if (matchCounter == 0) {
              result.innerHTML = ""
            }

            activityIndicationClearTrigger.classList.remove("fa-times")
            activityIndicationClearTrigger.classList.add("fa-circle-notch")
            const walletRow = document.createElement("li")
            if (matchCounter < 10) {
              walletRow.style['animation-delay'] = matchCounter * .2 + 's'
            }
            walletRow.classList.add("actionable")
            var compactedResults = ''
            function cPlus(w) {
              const basePath = w.base_path || ""
              var analysisUrl = `${basePath}${w.url}`
              compactedResults += `<a class="result-pl-inner" onclick="window.location.href = '${analysisUrl}';"
              href='${analysisUrl}'>
              <img src='${w.icon
                ? `${basePath}/images/wIcons/${w.folder}/small/${w.icon}`
                : `${basePath}/images/smallNoicon.png`}' class='results-list-wallet-icon' />
            <span>${w.altTitle || w.title}</span>
            <span class="badge-2 ${w.verdict}">
                <i class="${window.platforms[w.folder].css}"></i>
                <span><nobr>${verdicts[w.verdict].short}</nobr></span>
            </span>
            </a>`
            }
            cPlus(wallet)
            var det = ""
            if (wallet.versions && wallet.versions.length > 0) {
              for (i = 0; i < wallet.versions.length; i++) {
                searchableTerms += `${wallet.versions[i].category} ${wallet.versions[i].verdict} multi cross`;
                cPlus(wallet.versions[i])
              }
              det = "-hom"
            }
            walletRow.innerHTML = `<div class="${det}">${compactedResults}</div>`

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
  clearTimeout(pauseForInput)
  pauseForInput = setTimeout(() => {
    activityIndicationClearTrigger.classList.remove("fa-circle-notch")
    activityIndicationClearTrigger.classList.add("fa-times")
    document.querySelectorAll(".exit-search")[0].style.display = "inline-block"
    document.querySelectorAll(".results-list")[0].replaceWith(result)
  }, 500)
  searchScrollToTop()
  }
}

function heroUX(termInput) {
  if (termInput.value.length > 0) {
    searchCatalogue(termInput.value)
  }
  window.innerWidth > 700 && (
    document.body.classList.add("search-ui-active"),
    window.addEventListener('wheel', captureScrollForSearch),
    document.querySelectorAll(".results-list")[0].addEventListener("mouseenter", e => { scrollOverride = 1 }),
    document.querySelectorAll(".results-list")[0].addEventListener("mouseleave", e => { scrollOverride = 0 })
  )
}

function searchScrollToTop() {
  var s = window.pageYOffset + searchParent.getBoundingClientRect().top - 15
  if (window.innerWidth <= 700) {
    window.scrollTo({
      top: s,
      left: 0,
      behavior: 'smooth'
    })
  }
}

document.querySelectorAll(".sidebar-search-container").length > 0 && (
  document.querySelectorAll(".sidebar-search-container")[0].querySelectorAll(".walletSearch")[0].addEventListener("mouseleave", e => { e.currentTarget.value.length < 1 && (document.body.classList.remove("search-ui-active")) })
)

document.body.addEventListener("click", () => {
  exitSearch()
})
