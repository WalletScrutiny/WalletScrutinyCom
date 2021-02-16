document.documentElement.style.setProperty('--lazy', 'none');

function returnBodyOffset(e) {
  var p = e;
  var o = 0;
  while (true) {
      p = p.parentNode;
      if (p.nodeName === 'BODY') {
          break;
      } else {
          o += p.offsetTop;
      }
  }
  try { e.setAttribute("ot", o) } catch (err) { }
  return Number(o);
}

window.addEventListener("scroll", function () {
//SCROLL BEHAVIOUR PREVENTS STRAIGHTFORWARD LAZY LOADING.
//CIRCUMVENTING FOR NOW.
  if (window.scrollY > 100) {
    document.querySelectorAll(".lazy").forEach(function (e) {
      e.classList.remove("lazy");
    })
  }
})