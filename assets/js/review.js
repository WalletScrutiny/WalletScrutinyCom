for(i=0; i<document.querySelectorAll(".calculate-time-elapsed").length; i++){
  let t = document.querySelectorAll(".calculate-time-elapsed")[i];
  t.innerHTML = elapsedTime(t.getAttribute("data"));
}
function elapsedTime(d) {
  d = d.split(" ")[0];
  d = new Date(d);
  let e = new Date();
  let n = e.getTime() - d.getTime();
  n = n / 1000;

  let year = n / (52 * 604800); 
  n = (n % (52 * 604800)); 

  let month = n / (4 * 604800); 
  n = (n % (4 * 604800)); 

  let week = (n / (604800)); 
  n = (n % (604800)); 

  let day = (n / (86400)); 
  n = (n % (86400)); 
  
  let hour = n / 3600; 
  n %= 3600; 
  
  let min = n / 60 ; 
  n %= 60; 
  
  let sec = n; 

  let options = { "year": year, "month": month, "week": week, "day": day, "hour": hour };

  let max = "";
  Object.keys(options).forEach(function (k) {
    let r = Math.round(options[k])
    if (r > 0 && String(max).length < 1) {
      let s = r > 1 ? "s" : "";
        max +=  r + " " + k + s + " ago";  
      }
  });
  
  return max;

}

if (document.getElementById("versions").hasAttribute("wsId")) {
  var cVId = document.getElementById("versions").getAttribute("wsID");
  var folder = window.location.pathname.split("/")[1];
  var html = ``;
  window.orderedObs.forEach(function (e) {
    if (e.wsId === cVId) {
      if (e.folder !== folder) {
        html+= `<a href="${e.url}"><b>${e.category}</b> version review available here.</a><br>`;
      }else if (e.versions) {
        e.versions.forEach(function (v) {
          html+= `<a href="${v.url}"><b>${v.category}</b> version review available here.</a><br>`;
        })
      }
    } else {
      if (e.versions && Array.isArray(e.versions)) {
        e.versions.forEach(function (v) {
          if (v.wsId === cVId) {
            html+= `<a href="${v.url}"><b>${v.category}</b> version review available here.</a><br>`;
          }
        })
      }
    }
  })
            document.getElementById("versions").innerHTML = html;
}