---
layout: archive
title: "Methodology"
permalink: /methodology/
author_profile: true
---

<div class="tabulation-scroll-container">
<div class="tabulation">
  <div class="tab">Introduction</div>
  <div class="tab">Tests we run</div>
  <div class="tab">Hardware wallets</div>
  <div class="tab">Bearer tokens</div>
  <div class="tab">FAQ</div>
</div>
</div>

<div class="tab-payloads">
  <div class="tab-container">{% include methodology/introduction.html %}</div>
  <div class="tab-container">{% include methodology/tests.html %}</div>
  <div class="tab-container">{% include methodology/hardware.html %}</div>
  <div class="tab-container">{% include methodology/bearers.html %}</div>
  <div class="tab-container">{% include methodology/faq.html %}</div>
</div>

<script>
  let index = 1
  for(const tab of document.querySelectorAll(".tabulation .tab")){
    tab.setAttribute("data-index", index)
    tab.addEventListener("click", (event)=>{
      document.body.setAttribute("data-active-index", event.target.getAttribute("data-index"))
    })
    index++
  }
  document.body.setAttribute("data-active-index", 1)
</script>