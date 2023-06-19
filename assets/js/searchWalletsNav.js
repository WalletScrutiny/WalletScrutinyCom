function exitSearchUI() {
  const ui = document.querySelector(".results-target")
  ui.innerHTML = ""
  ui.classList.remove("visible")
  document.body.classList.remove("search-ui-active")
  document.querySelector(".wallet-search").classList.remove("active")
}
window.addEventListener("resize", () => {
  if (window.outerWidth <= 700) {
    exitSearchUI()
  }
})
if (document.querySelector(".searchbar")) {
  document.body.addEventListener("click", () => {
    exitSearchUI()
  })
  document.querySelector(".reset-search").addEventListener("click", (event) => {
    event.stopPropagation()
    window.searchTerm = ""
    document.querySelector(".searchbar").value = ""
    document.querySelector(".search-controls").classList.remove("hint-return")
    document.querySelector(".wallet-search").classList.remove("active")
    document.querySelector(".search-controls").classList.remove("working")
    document.querySelector(".search-controls").classList.remove("edited")
    exitSearchUI()
  })
  document.querySelectorAll(".search-trigger-target").forEach((ele) => {
    ele.addEventListener("click", (event) => {
      event.stopPropagation()
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
  document.querySelector(".mobile-search-shortcut").addEventListener("click", () => {
    if (!document.querySelector(".wallet-search").classList.contains("mobile-active")) {
      document.querySelector(".wallet-search").classList.add("mobile-active")
      document.querySelector(".mobile-search-shortcut").classList.add("active")
      document.querySelector(".searchbar").focus()
    } else {
      document.querySelector(".wallet-search").classList.remove("mobile-active")
      document.querySelector(".mobile-search-shortcut").classList.remove("active")
    }
  })
  document.querySelector(".searchbar").addEventListener("click", (event) => {
    event.stopPropagation()
    if (window.searchTerm && window.searchTerm.length > 0) {
      document.querySelector(".search-controls").classList.add("hint-return")
    } else {
      document.querySelector(".search-controls").classList.remove("hint-return")
    }
  })
}
function searchTrigger() {
  if (window.searchTerm && window.searchTerm.length > 1) {
    document.querySelector(".wallet-search").classList.add("active")
    document.querySelector(".search-controls").classList.add("working")
    document.querySelector(".search-controls").classList.add("edited")
    // document.querySelector(".search-controls").classList.remove("hint-return")
  }
  else {
    document.querySelector(".wallet-search").classList.remove("active")
    document.querySelector(".search-controls").classList.remove("working")
    document.querySelector(".search-controls").classList.remove("edited")
  }

  clearTimeout(window.walletSearchTimeoutTrigger)
  if (window.searchTerm && window.searchTerm.length > 1) {
    window.walletSearchTimeoutTrigger = setTimeout(() => {
      searchCatalogueNav(window.searchTerm)
    }, 200)
  }
}
window.temporarySearchValue = ""
function searchCatalogueNav(input) {
  if (window.isHomepage) {
    deferSearch(input)
    return
  }
  document.body.classList.add("search-ui-active")
  const result = document.querySelector(".results-target")
  result.classList.add("visible")
  const term = input.trim().toUpperCase()
  const minTermLength = 1
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
            walletRow.style['animation-delay'] = matchCounter * 80 + 'ms'
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

function deferSearch(input) {
  window.scroll(0,document.querySelector("#homepageSearch").offsetTop)
  document.querySelector(".search-filtered-wallets").value = input
  filterWalletsByName()
  document.querySelector(".search-filtered-wallets").focus()
}

function getIcon(name) {
  let faCollection = ''
  switch (name) {
    case "all": faCollection = "i-all-devices"; break
    case "android": faCollection = "fab fa-google-play"; break
    case "iphone": faCollection = "i-app-store"; break
    case "hardware": faCollection = "fas fa-toolbox"; break
    case "bearer": faCollection = "i-btc"; break
  }
  return faCollection
}

function makeCompactResultsHTML(wallet) {
  let result = ""
  let faCollection = getIcon(wallet.folder)
  const basePath = wallet.base_path || ""
  var analysisUrl = `${basePath}${wallet.url}`
  result += `<a class="result-pl-inner ${wallet.meta}" onclick="window.location.href = '${analysisUrl}';" href='${analysisUrl}'>
    <div class="icon-wrapper"><img src='${wallet.icon ? `${basePath}/images/wIcons/${wallet.folder}/small/${wallet.icon}` : `${basePath}/images/smallNoicon.png`}' class='wallet-icon' loading="lazy"/></div>
      <span class="result-title-wrapper">
        <span>${wallet.altTitle || wallet.title}</span>
        <small>
          <span class="category"><i class="${faCollection}"></i>&nbsp;<span> ${wallet.category}</span></span>
        </small>
      </span>
      <span class="stamps">
      ${ wallet.meta !== "outdated" ? `<span data-text="${window.verdicts[wallet.verdict].short}" class="stamp stamp-${wallet.verdict}" alt=""></span>` : "" }
      ${ wallet.meta && wallet.meta !== "ok" ? `<span data-text="${window.verdicts[wallet.meta].short}" class="stamp stamp-${wallet.meta}" alt=""></span>` : "" }
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


//PLACING MENU BUTTON SCRIPT HERE AS IT PERTAINS TO THE NAV
//MAY MOVE TO MORE SUITABLE FILE LATER

// MOVED TO MASTHEAD HTML
