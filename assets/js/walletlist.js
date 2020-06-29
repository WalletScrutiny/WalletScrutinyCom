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
  if ($('#details_' + id + ':visible').length) {
    // hide
    $('#modal').hide()
    $('#card_' + id)
      .css('left', '')
      .css('top', '')
      .css('righ', '')
      .css('margin-left', '')
      .css('margin-right', '')
      .css('width', '')
      .css('position', '')
    $('#details_' + id).hide()
    $('#show_' + id).show()
    $('#hide_' + id).hide()
  } else {
    // show
    $('#modal').show()
    $('#card_' + id)
      .css('top', $('#card_' + id).position().top)
      .css('left', 0)
      .css('right', 0)
      .css('margin-left', 'auto')
      .css('margin-right', 'auto')
      .css('width', '25em')
      .css('position', 'absolute')
    $('#details_' + id).show()
    $('#show_' + id).hide()
    $('#hide_' + id).show()
  }
  lastId = id
}
