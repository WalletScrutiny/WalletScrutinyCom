var verdictOrder = "reproducible,nonverifiable,nosource,custodial,wip,nobtc,fewusers,defunct,nowallet", searchInput, pauseForInput;
var sortedWallets = Object.values(window.wallets).sort(function (a, b) {
  if (a.verdict != b.verdict)
    return verdictOrder.indexOf(a.verdict) - verdictOrder.indexOf(b.verdict)
  if (a.users != b.users)
    return Number(b.users) - Number(a.users)
  return Number(b.ratings) - Number(a.ratings)
})
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
document.getElementById("exitSearchTrigger").addEventListener("click", function ( event) { if (event.target != this) { return; } exitSearch() })

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
  const basePath = window.wallets.base_path
  if (term.length > minTermLength) {
    var matchCounter = 0
    sortedWallets.forEach(function (wallet) {
      const searchableTerms = `${wallet.title} ${wallet.appId} ${wallet.website} ${wallet.developerWebsite}`
      if (matchCounter < 1) {
        result.innerHTML = "<li><a style='font-size:.7rem;opacity:.7;text-style:italics;'>No matches</a></li>";
      }
      if (searchableTerms.toUpperCase().indexOf(term) !== -1) {
        if (matchCounter == 0) {
          result.innerHTML = ""
        }
        bi.classList.remove("fa-times")
        bi.classList.add("fa-circle-notch")
        const walletRow = document.createElement("li")
        walletRow.style['animation-delay'] = matchCounter * .1 + 's'
        walletRow.classList.add("actionable")
        const platform = (wallet.idd) ? `iphone` : `android`
        const analysisUrl = `${basePath}${wallet.url}`
        walletRow.innerHTML = `<a 
            onclick="window.location.href = '${analysisUrl}';"
            href='${analysisUrl}'>
          <img
              src='${basePath}/images/wallet_icons/${platform}/small/${wallet.icon}'
              class='results-list-wallet-icon'
            /><span>${wallet.title}</span>
            <i class="fab fa-${(wallet.idd) ? `app-store` : `google-play`}"
            style="margin: 0 0.4em 0 auto"></i>
            <span class="badge ${wallet.verdict}">${wallet.verdict}</span>
            </a>`
        result.append(walletRow)
        matchCounter++
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
  showInitialSuggestion()
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




function showInitialSuggestion() {
  var reproducibleKeysIcons = '';
  // CAN BE MOVED OUTSIDE THIS FUNCTION TO PREVENT RE-BUILD
  var k_ = [], base = window.wallets.base_path;
  document.querySelectorAll(".results-list")[0].classList.add("quick-link");
  if (reproducibleKeysIcons.length < 1) {
    Object.keys(window.wallets).forEach(key => {
      window.wallets[key].verdict && (k_.push(key));
    })
    var a = k_;
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    for (i = 0; i < k_.length; i++) {
      var k = window.wallets[k_[i]],
        p = k.idd ? 'iphone' : 'android';
      reproducibleKeysIcons += `<a onclick="window.location.href = '${k.url}';" href='${k.url}'><img src='${base}/images/wallet_icons/${p}/small/${k.icon}' class='results-list-wallet-icon' />
      <span>
      <span class="badge ${k.verdict}">${k.verdict}</span>
      <i class="fab fa-${(k.idd) ? `app-store` : `google-play`}"></i>
      <br>
      ${k.title}</span>
      </a>`
    }
  }
  document.querySelectorAll(".results-list")[0].innerHTML = `<div class="-pl">${reproducibleKeysIcons}</div>`;
  document.querySelectorAll(".results-list")[0].style.display = "";
  document.querySelectorAll(".-pl")[0].scrollTo({left: 500})
  
  setTimeout(function () {
    document.querySelectorAll(".-pl")[0].scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }, 100);
 
}
