---
permalink: /
title: "Is your Bitcoin wallet secure?"
summary: "The aim of this project is to improve the security of Bitcoin wallets by examining the application code for possible back-doors and other vulnerabilities."
excerpt: "Many wallets are not open to public scrutiny"
author_profile: true
redirect_from:
  - /about/
  - /about.html
---

{% include base_path %}
<script>
  window.wallets = {% include allAppList.html %}
</script>

<div class="page-section">

<h1 id="all-wallets-ordered-by-verifiability-downloads-and-ratings">What protects your Bitcoins from Hackers?</h1>

<img src="{{ base_path }}/images/hacker-bg.png" alt="hacker" style="height:10em;margin:0 0em 1em 0" />
<p style="text-align:center">
  Do <strong>you</strong> own your Bitcoins or do you <strong>trust</strong> that your app allows you to use "your"
  coins while they are actually controlled by <strong>"them"</strong>? Do you have a backup? Do
  "they" have a copy they didn't tell you about? Did anybody check the wallet for deliberate backdoors
  or <strong>vulnerabilities</strong>? Could anybody check the wallet for those?
</p><p>
  We try to answer these questions for Bitcoin wallets on Android.
</p><p>
  To understand in more detail read about <a title="our methodology"
  href="{{ base_path }}/methodology/">our methodology</a>.
</p>
</div>


<h2 class="section-label">As featured on:</h2>

{% include press.html %}


<h2 class="section-label">All reproducible wallets</h2>

<div id="myCarousel" class="carousel slide" data-ride="carousel">
  <!-- Indicators -->
  <ol class="carousel-indicators">
    <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
    <li data-target="#myCarousel" data-slide-to="1"></li>
    <li data-target="#myCarousel" data-slide-to="2"></li>
  </ol>

  <!-- Wrapper for slides -->
  <div class="carousel-inner">
    <div class="item active">
      <img src="la.jpg" alt="Los Angeles">
    </div>

    <div class="item">
      <img src="chicago.jpg" alt="Chicago">
    </div>

    <div class="item">
      <img src="ny.jpg" alt="New York">
    </div>
  </div>

  <!-- Left and right controls -->
  <a class="left carousel-control" href="#myCarousel" data-slide="prev">
    <span class="glyphicon glyphicon-chevron-left"></span>
    <span class="sr-only">Previous</span>
  </a>
  <a class="right carousel-control" href="#myCarousel" data-slide="next">
    <span class="glyphicon glyphicon-chevron-right"></span>
    <span class="sr-only">Next</span>
  </a>
</div>
<div class="carousel">
  <div class="slide">
    <div class="carousel-caption">
      <h3>Android</h3>
      <p>{% assign verdicts = "reproducible" | split: "," %}
      {% include list_of_wallets.html %}</p>
    </div>
  </div>
  <div class="slide">
    <div class="carousel-caption">
      <h3>Linux</h3>
      <p>{% assign verdicts = "reproducible" | split: "," %}
      {% include list_of_wallets.html %}</p>
    </div>
  </div>
</div>


<a href="{{ base_path }}/allApps">all apps</a>


<h2 class="section-label">How many wallets are in each category?</h2>

{% include grid_of_wallets.html %}


<h2 class="section-label">How many users (downloads) are in each category?</h2>

{% include grid_of_wallets_proportional.html %}
