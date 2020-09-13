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


// window.onload = function () {
  // var rgb = getAverageRGB(document.getElementById('i'));
  // document.body.style.backgroundColor = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
  
  // for (i = 0; i < document.querySelectorAll(".app_logo").length; i++){
  //   var t = document.querySelectorAll(".app_logo")[i];
  //   t.addEventListener("load", function () {
  //     var t = this;
  //     var r = getAverageRGB(t);
  //     t.style['box-shadow'] = '0 0 0 1px rgb(' + r.r + ',' + r.g + ',' + r.b + ')';
  //   });
  // }



// }


function getAverageRGB(img) {
  
  var blockSize = 5, // only visit every 5 pixels
      defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
      canvas = document.createElement('canvas'),
      context = canvas.getContext && canvas.getContext('2d'),
      d, width, height,
      i = -4,
      length,
      rgb = {r:0,g:0,b:0},
      c = 0;
      
  if (!context) {
      return defaultRGB;
  }
  
  height = canvas.height = img.naturalHeight || img.offsetHeight || img.height;
  width = canvas.width = img.naturalWidth || img.offsetWidth || img.width;
  
  context.drawImage(img, 0, 0);
  
  try {
      d = context.getImageData(0, 0, width, height);
  } catch(e) {
      /* security error, img on diff domain */alert('x');
      return defaultRGB;
  }
  
  length = d.data.length;
  
  while ( (i += blockSize * 4) < length ) {
      ++c;
      rgb.r += d.data[i];
      rgb.g += d.data[i+1];
      rgb.b += d.data[i+2];
  }
  
  // ~~ used to floor values
  rgb.r = ~~(rgb.r/c);
  rgb.g = ~~(rgb.g/c);
  rgb.b = ~~(rgb.b/c);
  
  return rgb;
  
}