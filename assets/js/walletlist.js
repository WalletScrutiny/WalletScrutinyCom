if (document.getElementById("showWallets") && document.getElementById("collapseWalletList")) {
  document.getElementById("showWallets").addEventListener("click", () => {
    toggleWalletList();
  });
  document.getElementById("collapseWalletList").addEventListener("click", () => {
    toggleWalletList();
  });
}

function toggleWalletList() {
  if (document.getElementById("sidebarWalletList").classList.contains("mobile-compact")) { 
    document.getElementById("sidebarWalletList").classList.remove("mobile-compact");
    document.getElementById("showWallets").innerHTML = 'Collapse list&nbsp;<i class="fas fa-chevron-up"></i>';
    document.getElementById("collapseWalletList").style.display = "unset";
  }else{
    document.getElementById("sidebarWalletList").classList.add("mobile-compact");
    document.getElementById("showWallets").innerHTML = 'Expand list&nbsp;<i class="fas fa-chevron-down"></i>';
    document.getElementById("collapseWalletList").style.display = "none";
  }
}

var lastId = "";

function toggleApp(id, show, self) {
  if (!id) { 
    // no id provided means close whatever is open
    const modal = document.querySelectorAll(".temp_card")[0];
    if (modal) {
      modal.remove();
      document.body.classList.remove("modal-open");
    }
    lastId = "";
  } else {
    lastId = id;
    let thisCard = false;
    for (const walletInstance of window.wallets) {
      if (walletInstance.folder + walletInstance.appId === id) {
        thisCard = getBadge(walletInstance);
        thisCard += getWidgetDetails(walletInstance);
        thisCard+=`<a href="${walletInstance.url}" rel="permalink" class="article-link">
        Full Analysis&nbsp;<i class="fas fa-arrow-right"></i>
        </a>`;
        break;
      }
    }
    if (document.querySelectorAll(".temp_card_" + id).length > 0) {
      // correct card is open already
      if (!show) {
        // user really wants to show this, even if it's open already.
        document.querySelectorAll(".temp_card_" + id)[0].remove();
        document.body.classList.remove("modal-open");
        lastId = "";
      }
    } else {
      var temp = document.createElement("div");
      var tempInner = document.createElement("div");
      tempInner.style.setProperty("--wallet-gradient-2", self.getAttribute("data-colour"));
      tempInner.setAttribute("class", "opened AppDisplayCard");
      tempInner.innerHTML = String(thisCard).replace("onclick=", "_disabled=");
      tempInner.setAttribute("onclick", "event.stopPropagation()");
      temp.setAttribute("class", "temp_card_" + id + " temp_card");
      temp.append(tempInner);
      temp.setAttribute("onclick", "toggleApp()");
      document.body.append(temp);
      if (screen.width > 756) {
        document.body.classList.add("modal-open");
      }
    }
  }
  updateUrl();
}

function resizeLabelBold() {
  if (document.querySelectorAll(".-bold").length > 0) {
    let c = document.querySelectorAll(".-bold");
    for (i = 0; i < c.length; i++) {
      let t = c[i];
      let p = t.parentNode.parentNode;
      let pw = p.getBoundingClientRect().width * 0.9;
      if (t.getBoundingClientRect().width > pw) {
        let l = t.querySelectorAll("l")[0];
        for (j = 15; j > 0; j--) {
          l.style['font-size'] = `${j * 0.3}rem`;
          if (l.parentNode.getBoundingClientRect().width < p.getBoundingClientRect().width) {
            break;
          }
        }
      }
    }
  }
}

resizeLabelBold();

window.addEventListener('popstate', () => {
  if(lastId != "") {
    toggleApp(lastId, false);
    return false;
  }
});