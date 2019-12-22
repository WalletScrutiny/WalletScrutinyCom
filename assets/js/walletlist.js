$(document).ready(function(){
  $("#showWallets").on("click", function() {
    console.log("clicked here")
    $("#sidebarWalletList")
      .css('height', 'auto')
      .css('overflow-y', 'auto')
    $("#sidebarWalletListShowButton").hide()
  });
});
