$(document).ready(function(){
  $("#showWallets").on("click", function() {
    $("#sidebarWalletList")
      .css('height', 'auto')
      .css('overflow-y', 'auto')
    $("#sidebarWalletListShowButton").hide()
  });
});
