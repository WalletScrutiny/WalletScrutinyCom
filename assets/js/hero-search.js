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

function searchCatalogue(t) {
  var bi = document.querySelectorAll(".exit-search")[0].querySelectorAll('i')[0];
  var result = document.createElement("ul")
  result.classList.add("results-list")
  var v = t.value.toUpperCase()
  var filter = 1;//String("COIN").indexOf(v) !== -1 ? 4 : String("WALLET").indexOf(v) !== -1 ? 6 : 0;
  if (v.length > filter) {
    var f = 0
    sortedWallets.forEach(function (r) {
      var n = `${r.title} ${r.appId} ${r.website}`
      if (f < 1) {
        result.innerHTML = "<li><a style='font-size:.7rem;opacity:.7;text-style:italics;'>No matches</a></li>";
      }
      if (n.toUpperCase().indexOf(v) !== -1) {
        if (f == 0) { result.innerHTML = ""; }
        bi.classList.remove("fa-times")
          bi.classList.add("fa-circle-notch");
        var l = document.createElement("li");
        l.style['animation-delay'] = f * .1 + 's';
        l.classList.add("actionable");
        l.innerHTML = `<a onclick="window.location.href = '${window.wallets.base_path}${r.url}';" href='${window.wallets.base_path}${r.url}'><img src='${window.wallets.base_path}/images/wallet_icons/android/small/${r.icon}' class='results-list-wallet-icon' />${r.title}</a>`
        result.append(l)
        f++
      }
    })
  } else if (v.length != 0) {
    var l = document.createElement("li")
    var rem = (filter + 1) - v.length
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
  heroSearchScrollToTop(t)
}

function heroUX(t) {
  t.focus()
  t.select()

  heroSearchScrollToTop(t)

  if (t.value.length > 0) {
    searchCatalogue(t)
  }
  document.getElementById("exitSearchTrigger").style.display = "block"
}

function heroSearchScrollToTop(t) {
  var s = window.pageYOffset + t.getBoundingClientRect().top
  if (window.innerWidth <= 700) {
    window.scrollTo({
      top: s,
      behavior: 'smooth'
    })
    window.scrollTo(0, s)
    document.body.scrollTop = s
  }
}
