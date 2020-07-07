window.wallets = Array();
window.onload = function () { 

  for (i = 0; i < document.querySelectorAll(".AppDisplayCard").length; i++) {
    var n = document.querySelectorAll(".AppDisplayCard")[i].querySelectorAll(".app_info_box > strong")[0].innerHTML;

    var l = document.querySelectorAll(".AppDisplayCard")[i].querySelectorAll(".app_logo")[0].querySelectorAll("img")[0].getAttribute("src");

    var u = document.querySelectorAll(".AppDisplayCard")[i].getAttribute("href");

    var w = { img: l, name: n, url: u };
    wallets.push(w);
  }


  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/moreApps', true);
  xhr.onload = function () {
    if (200 === xhr.status && xhr.responseText.length < 1) {
    } else if (200 !== xhr.status) {
    } else {
      try {
        var p = xhr.responseText;
        var f = document.createElement("div");
        f.innerHTML = p;
        if (f.querySelectorAll(".AppDisplayCard").length > 0) {
          for (i = 0; i < f.querySelectorAll(".AppDisplayCard").length; i++) {
            var n = f.querySelectorAll(".AppDisplayCard")[i].querySelectorAll(".app_info_box > strong")[0].innerHTML;
        
            var l = f.querySelectorAll(".AppDisplayCard")[i].querySelectorAll(".app_logo")[0].querySelectorAll("img")[0].getAttribute("src");
        
            var u = f.querySelectorAll(".AppDisplayCard")[i].getAttribute("href");
        
            var w = { img: l, name: n, url: u };
            wallets.push(w);
          }
        }
      } catch (e) {
      }
    }
  };
  xhr.send()



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
}
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
    for (i = 0; i < window.wallets.length; i++) {
      var r = window.wallets[i];
      var n = r.name;
      if(f<1){
        result.innerHTML = "<li><a style='font-size:.7rem;opacity:.7;text-style:italics;'>No matches</a></li>";
      }
      if (n.toUpperCase().indexOf(v) !== -1) {
        if(f==0){result.innerHTML = "";}
        var l = document.createElement("li");
        l.innerHTML = "<a href='"+ r.url +"'><img src='" + r.img + "' class='results-list-wallet-icon' />" + n + "</a>";
        result.append(l);
        f++;
      }
    }
  }else if(v.length!=0){
        var l = document.createElement("li");
        var rem = (filter+1)-v.length;
        var s = rem > 1 ? "s" : "";
        l.innerHTML = "<a style='font-size:.7rem;opacity:.7;text-style:italics;'>Enter " + rem + " more character"+s+" to search " + window.wallets.length + " records</a>";
        result.append(l);
  }
    document.querySelectorAll(".results-list")[0].replaceWith(result);
}