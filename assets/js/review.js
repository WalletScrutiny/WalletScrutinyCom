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
var s = String(window.location).split("/");
var cVId = s[s.length-1].length > 0 ? s[s.length-1] : s[s.length - 2];

window.orderedObs.forEach(function (e) {
  if (e.appId === cVId) {
    if (e.versions) {
      // console.log(e)
      e.versions.forEach(function (v) {
        // console.log(v)
        var a = document.createElement("a");
        a.setAttribute("href", v.url)
        a.innerHTML = `${v.category.toUpperCase()} version review available here.`;
        document.getElementById("versions").append(a);
      })
    }
  } else {
    if (e.versions) {
      e.versions.forEach(function (v) {
        if (v.appId === cVId) {
          var a = document.createElement("a");
          a.setAttribute("href", e.url)
          a.innerHTML = `${e.category.toUpperCase()} version review available here.`;
          document.getElementById("versions").append(a);
        } 
      })
    }
  }
})