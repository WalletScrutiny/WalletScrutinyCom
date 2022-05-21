---
permalink: /
title: "Is your Bitcoin wallet secure?"
summary: "The aim of this project is to improve the security of Bitcoin wallets by examining products for transparency and potential attacks."
excerpt: "Many wallets are not open to public scrutiny"
author_profile: true
---

{% include base_path %}

<div id="myModal" class="donate-modal">
  <div class="donate-modal-content">
    <h1 style="text-align:center;margin-top:unset">We are here to protect you, but today we need your help!</h1>
    <h2 style="text-align:center;margin-top:unset">What protects your Bitcoins from Hackers?</h2>
    <img src="{{ base_path }}/images/hacker-bg.png" alt="hacker" style="height:10em;margin:0 auto 1em auto;" />
    <p>
      Do <strong>you</strong> really own your Bitcoins or do you just <strong>trust</strong> that your product allows you to use 
      them while owned by the <strong>custodian</strong>? Do you have a backup? Do
      "they" have a copy they didn't tell you about? Did anybody check the wallet for back doors
      and <strong>vulnerabilities</strong>? Could anybody check the wallet for those?
    </p><p>
      We examine wallets, free of charge, for new-coiners and whales alike,
      free of charge, trusting that people with the most to lose will
      voluntarily support our ongoing efforts.
    </p><p>
      In May 2021, we received
      one generous donation of 1.7BTC, which constitutes almost 90% of all the
      support we’ve ever received over the past 2.5 years of operation.
      Contributions have been scarce since then so we’re now at the point where
      we have to decide whether or not the project should continue.
    </p><p>
      Will you help to keep WalletScrutiny alive?
    </p><p>
      <a href="/?voteSupport=now">Yes, I will help WalletScrutiny today with a donation or content contribution!</a>
    </p><p>
      <a href="/?voteSupport=later">Yes, I will help but not today.</a>
    </p><p>
      <a href="/?voteSupport=never">No, the project just isn’t that important to me.</a>
    </p><p>
      (All three options give you full access as before. )
    </p>
  </div>
</div>

<script>
function lsTest(){
    var test = 'test';
    try {
        localStorage.setItem(test, test)
        localStorage.removeItem(test)
        return true
    } catch(e) {
        return false
    }
}
window.addEventListener("scroll", () => {
  if (window.showingModal)
    return
  // don't bother people who disabled their localStorage completely
  if( lsTest() !== true )
    return
  if (localStorage.getItem('support-vote'))
    return
  window.showingModal = true
  // The modal needs to be a direct child to <body> or it won't be able to cover
  // the header line. To not create a new layout, we move it programmatically
  const modal = document.getElementById("myModal")
  modal.style.display = "block"
  // document.getElementsByTagName("body")[0].appendChild(modal)
  document.getElementById('main').replaceWith(modal)
})
</script>

<div class="page-section">
<h1 id="all-wallets-ordered-by-verifiability-downloads-and-ratings">What protects your Bitcoins from Hackers?</h1>
<div style="width:100%;text-align:center;">
<img src="{{ base_path }}/images/hacker-bg.png" alt="hacker" style="height:10em;margin:0 auto 1em auto;" />
</div>
<p style="text-align:center">
  Do <strong>you</strong> own your Bitcoins or do you <strong>trust</strong> that your product allows you to use "your"
  coins while they are actually controlled by <strong>"them"</strong>? Do you have a backup? Do
  "they" have a copy they didn't tell you about? Did anybody check the wallet for deliberate back doors
  or <strong>vulnerabilities</strong>? Could anybody check the wallet for those?
</p><p>
  We try to answer these questions and more for Bitcoin Wallets.
</p><p>
  To understand in more detail read about <a title="our methodology"
  href="{{ base_path }}/methodology/">our methodology</a>.
</p>
</div>


<h2 id="featuredOn" class="section-label">As featured on:</h2>

{% include press.html %}

<br>
<div class="-sticky fragmented-controls-master">
<h2 class="section-label fragmented-controls -sticky">Showing</h2>
<h2 class="section-label fragmented-controls -disappearable"><span id="modularVerdict">reproducible</span> </h2>
<h2 class="section-label fragmented-controls -sticky">Wallets from <span id="modularPlatformPH"></span></h2>
</div>
<br>

<h2 class="section-label">Wallets&nbsp;<a href="#modularWalletPayload" style="color:#ccc">&para;</a></h2>


<div id="modularWalletPayload">

  <!--
    The content of this div gets replaced if JS is enabled.
  -->
  {% assign platform = "android" %}
  {% assign verdicts = "reproducible" | split: "," %}
  {% assign selectedVerdict = "reproducible" %}
  {% include list_of_wallets.html %}

</div>

{% if site.environment != "development" %}
  {% include grid_of_wallets.html %}
  {% include grid_of_wallets_proportional.html %}
{% else %}
  <b>Grids of Wallets only in production ...</b>
{% endif %}

{% assign recent_posts = site.iphone | concat: site.android | concat: site.hardware | sort: "wsId" | sort: "date" | slice: -10, 10 | reverse %}
<h2 class="section-label" id="recently">Most Recent Reviews Or Updates ({{ recent_posts.first.date | date: '%b %e' }}{% if recent_posts.last.date != recent_posts.first.date %} to {{ recent_posts.last.date | date: '%b %e' }}{% endif %})&nbsp;<a href="#recently" style="color:#ccc">&para;</a></h2>
<div id="recentPosts">
<div class="page-section">
  <div id="tableofwallets3">
    <div id="modal" style="position:fixed;left:0;top:0;width:100%;height:100%;z-index:50;display:none" onClick="toggleApp(lastId);">&nbsp;</div>
    <div class="flexi-list">
      {% for post in recent_posts %}
        {% include list_of_wallets_item.html %}
      {% endfor %}
    </div>
  </div>
</div>
<a onClick="loadMoreApps()">load more ...</a>
</div>

<script src="{{ base_path }}/assets/js/widgetBadgeDetails.js"></script>
<script src="{{ base_path }}/assets/js/scripts.js"></script>
<script src="{{ base_path }}/assets/js/landingPage.js"></script>
