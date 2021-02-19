


if (document.querySelectorAll(".hero-cta").length > 0) {
  var p = document.querySelectorAll(".hero-cta")[0]
  var t = document.createElement("div")
  var r = document.createElement("ul")
  r.classList.add("results-list")
  t.classList.add("walletSearch-parent")
  var s = document.createElement("input");
  var c = document.createElement("span");
  c.setAttribute("onclick", "exitSearch()");
  c.classList.add("exit-search");
  c.innerHTML = '<i class="fas fa-times"></i>';
  s.setAttribute("oninput", "searchCatalogue(this)")
  s.setAttribute("onkeyup", "focusResults(event)")
  s.setAttribute("onfocus", "heroUX(this)");
  s.setAttribute("placeholder", "Search wallets...")
  searchInput = s;
  s.classList.add("walletSearch")
  t.append(s)
  t.append(c)
  t.append(r)
  document.querySelectorAll(".wallet-search-placeholder")[0].replaceWith(t)
}




function exitSearch() {
  document.querySelectorAll(".exit-search")[0].style.display = "none";
  document.querySelectorAll(".results-list")[0].style.display = "none";
  document.getElementById("exitSearchTrigger").style.display = "none";
  searchInput.blur()
}

document.getElementById("exitSearchTrigger").addEventListener("mouseenter", function (event) { if (event.target != this) { return; } exitSearch() });
document.getElementById("exitSearchTrigger").addEventListener("click", function (event) { if (event.target != this) { return; } exitSearch() })

function focusResults(e) {
  e.preventDefault()
  if (e.keyCode === "40") {
    document.querySelectorAll(".results-list")[0].querySelectorAll(".li")[0].focus()
  }
}




function searchCatalogue(termInput) {
  const bi = document.querySelectorAll(".exit-search")[0].querySelectorAll('i')[0];
  const result = document.createElement("ul")
  result.classList.add("results-list")
  const term = termInput.value.toUpperCase()
  const minTermLength = 1
  if (term.length > minTermLength) {
    var matchCounter = 0
    window.orderedObs.forEach(function (wallet) {
      if (wallet.title) {
        let searchableTerms = `${wallet.title} ${wallet.appId} ${wallet.website} ${wallet.developerWebsite} ${wallet.category} ${wallet.verdict}`



        matchCounter < 1 && (result.innerHTML = "<li><a style='font-size:.7rem;opacity:.7;text-style:italics;'>No matches</a></li>")

        let index = searchableTerms.toLocaleUpperCase().indexOf(term);

        if (index !== -1) {
          if (matchCounter == 0) {
            result.innerHTML = ""
          }

          bi.classList.remove("fa-times")
          bi.classList.add("fa-circle-notch")
          const walletRow = document.createElement("li")
          walletRow.style['animation-delay'] = matchCounter * .1 + 's'
          walletRow.classList.add("actionable")
          var compactedResults = '';
          function cPlus(w) {
            const basePath = window.wallets.base_path
            var analysisUrl = `${basePath}${w.url}`
            compactedResults += `<a class="result-pl-inner" onclick="window.location.href = '${analysisUrl}';"
              href='${analysisUrl}'>
              <img src='${basePath}/images/wallet_icons/${w.folder}/small/${w.icon}' class='results-list-wallet-icon' />
            <span>${w.title}</span>
            
            <span class="badge-2 ${w.verdict}">
                <i class="fab fa-${window.determineIconTag(w.category)}"></i>&nbsp;
                <span>${w.verdict}</span>
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
          walletRow.innerHTML = `<div class="${det}">${compactedResults}</div>`;

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
  pauseForInput = setTimeout(function () {
    bi.classList.remove("fa-circle-notch")
    bi.classList.add("fa-times")
    document.querySelectorAll(".exit-search")[0].style.display = "inline-block"
    document.querySelectorAll(".results-list")[0].replaceWith(result)
  }, 500)
  heroSearchScrollToTop(termInput)
}

function heroUX(termInput) {
  termInput.focus()
  termInput.select()
  heroSearchScrollToTop(termInput)

  if (termInput.value.length > 0) {
    searchCatalogue(termInput)
  }
  document.getElementById("exitSearchTrigger").style.display = "block"
}

function heroSearchScrollToTop(termInput) {
  var s = window.pageYOffset + t.getBoundingClientRect().top - 15
  if (window.innerWidth <= 700) {
    window.scrollTo({
      top: s,
      left: 0,
      behavior: 'smooth'
    })
  }
}