window.wallets;


  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/allApps.json', true);
  xhr.onload = function () {
    if (200 === xhr.status && xhr.responseText.length < 1) {
    } else if (200 !== xhr.status) {
    } else {
      try {
        var p = xhr.responseText;
        window.wallets = JSON.parse(p);
        console.log(JSON.parse(p))
        if (document.querySelectorAll(".hero-cta").length > 0) {
          var p = document.querySelectorAll(".hero-cta")[0];
      
      
          var t = document.createElement("div");
          var r = document.createElement("ul");
          r.classList.add("results-list");
          t.classList.add("walletSearch-parent")
          var s = document.createElement("input");
          s.setAttribute("oninput", "searchCatalogue(this)");
          s.setAttribute("onkeyup", "focusResults(event)");
          s.setAttribute("placeholder", "Search wallets...");
          s.classList.add("walletSearch");
          t.append(s);
          t.append(r);
          document.querySelectorAll(".wallet-search-placeholder")[0].replaceWith(t);
        }
      } catch (e) {
      }
    }
  };
  xhr.send()




function focusResults(e){
e.preventDefault();
  if(e.keyCode === "40"){
    document.querySelectorAll(".results-list")[0].querySelectorAll(".li")[0].focus();
  }
}
function searchCatalogue(t) {
  var result = document.createElement("ul");
  result.classList.add("results-list");
  var v = t.value.toUpperCase();
  var filter = String("COIN").indexOf(v) !== -1 ? 4 : 2;
  if (v.length > filter) {
    var f = 0;
    for (var key in window.wallets) {
      var r = window.wallets[key];
      var n = r.title;
      if(f<1){
        result.innerHTML = "<li><a style='font-size:.7rem;opacity:.7;text-style:italics;'>No matches</a></li>";
      }
      if (n.toUpperCase().indexOf(v) !== -1) {
        if(f==0){result.innerHTML = "";}
        var l = document.createElement("li");
        l.innerHTML = "<a href='/posts/"+ key +"'><img src='/images/wallet_icons/small/" + r.icon + "' class='results-list-wallet-icon' />" + n + "</a>";
        result.append(l);
        f++;
      }
    }
  }else if(v.length!=0){
        var l = document.createElement("li");
        var rem = (filter+1)-v.length;
        var s = rem > 1 ? "s" : "";
        l.innerHTML = "<a style='font-size:.7rem;opacity:.7;text-style:italics;'>Enter " + rem + " more character"+s+" to search all records</a>";
        result.append(l);
  }
    document.querySelectorAll(".results-list")[0].replaceWith(result);
}