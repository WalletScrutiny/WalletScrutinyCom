$(document).ready(function(){
  $("#showWallets").on("click", function() {
    $("#sidebarWalletList")
      .css('height', 'auto')
      .css('overflow-y', 'auto')
    $("#sidebarWalletListShowButton").hide()
  });
});

var lastId = ""

function toggleApp(id) {
  if (!id) { 
    document.querySelectorAll(".temp_card")[0].remove();
      document.body.classList.remove("modal-open");
  }
  else {
    lastId = id

    var t = document.getElementById("card_" + id)
    if (document.querySelectorAll(".temp_card_" + id).length > 0) {
      document.querySelectorAll(".temp_card_" + id)[0].remove();
      document.body.classList.remove("modal-open");
    } else {
      var temp = document.createElement("div");
      var tempInner = document.createElement("div");
      tempInner.classList.add("opened");
      tempInner.classList.add("AppDisplayCard");
      tempInner.innerHTML = String(t.innerHTML).replace("onclick=", "_disabled=");
      tempInner.setAttribute("onclick", "event.stopPropagation()");
      temp.classList.add("temp_card_" + id);
      temp.classList.add("temp_card");
      temp.append(tempInner);
      temp.setAttribute("onclick", "toggleApp()");
      document.body.append(temp);
      if (screen.width > 756) { document.body.classList.add("modal-open"); }
    }
  }

}
