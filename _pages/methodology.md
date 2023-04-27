---
layout: archive
title: "Methodology"
permalink: /methodology/
author_profile: true
---

<script src="{{ base_path }}/assets/js/ui-components.js"></script>

<div class="tabulation-scroll-container">
<div class="tabulation">
  <div class="tab">Introduction</div>
  <div class="tab">Tests we run</div>
  <div class="tab">FAQ</div>
</div>
</div>

<div class="tab-payloads">
  <div class="tab-container">{% include methodology/introduction.html %}</div>
  <div class="tab-container">{% include methodology/tests.html %}</div>
  <div class="tab-container">{% include methodology/faq.html %}</div>
</div>

<script>
  let urlIndex = 1
  if(window.location.search.indexOf('?')>=0){
  const query = window.location.search.split('?')
    let urlIndexCounter = 1
    let tabQuery = query[1].indexOf("/")>0?query[1].split("/")[0]:query[1]
    for(const tab of document.querySelectorAll(".tabulation .tab")){
      if(tabQuery===tab.innerHTML.replace(/ /g, '-').toLowerCase()){
        urlIndex = urlIndexCounter
        break
      }
      urlIndexCounter++
    }
    window.testSubcat = query[1].indexOf("/")>0?query[1].split("/")[1]:false
  }

  let index = 1
  for(const tab of document.querySelectorAll(".tabulation .tab")){
    tab.setAttribute("data-index", index)
    tab.addEventListener("click", (event)=>{
      document.body.setAttribute("data-active-index", event.target.getAttribute("data-index"))
      window.history.pushState('data', null, `/methodology/?${event.target.innerHTML.replace(/ /g, '-').toLowerCase()}`)
    })
    index++
  }
    if(urlIndex==2)
  {processSelectedSubcategory()}
  document.body.setAttribute("data-active-index", urlIndex)
</script>

