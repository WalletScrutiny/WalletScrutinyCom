---
layout: archive
title: "More Apps"
permalink: /moreApps/
author_profile: true
---

<div class="page-section">
  <div id="modal" style="position:fixed;left:0;top:0;width:100%;height:100%;z-index:50;display:none" onClick="toggleApp(lastId);toggleZIndex(lastId)">&nbsp;</div>

  {% assign verdicts = "wip,nobtc,fewusers,defunct,nowallet" | split: "," %}
  {% assign downloads = "100000000,50000000,10000000,5000000,1000000,500000,100000,50000,10000,5000,1000,500,100,50,10,5" | split: "," %}
  {% assign posts_by_ratings = site.posts | sort: "ratings" | reverse %}
  {% for v in verdicts %}
    {% case v %}
      {% when "wip" %}
        {% assign vLabel   = 'WIP' %}
        {% assign vTooltip = 'Work in progress. We still have to analyze this wallet' %}
      {% when "fewusers" %}
        {% assign vLabel   = 'Few&nbsp;users' %}
        {% assign vTooltip = 'This app has too few users for now to be reviewed in detail.' %}
      {% when "defunct" %}
        {% assign vLabel   = 'Defunct' %}
        {% assign vTooltip = 'This app went out of business ... or so. Read the analysis for details.' %}
      {% when "custodial" %}
        {% assign vLabel   = 'Custodial!' %}
        {% assign vTooltip = 'As the provider of this app holds the users coins,
          verifiability of the app is not relevant wether or not the funds are secure!' %}
      {% when "nobtc" %}
        {% assign vLabel   = 'Non-BTC' %}
        {% assign vTooltip = 'The app cannot send and receive BTC. We currently do
          not investigate other cryptocurrencies.' %}
      {% when "nowallet" %}
        {% assign vLabel   = 'Not&nbsp;a&nbsp;wallet' %}
        {% assign vTooltip = 'We could not find this to be an app meant to store
          receive and send coins.' %}
      {% when "nosource" %}
        {% assign vLabel   = 'No&nbsp;source!' %}
        {% assign vTooltip = 'Without public source available, this app cannot be verified!' %}
      {% when "nonverifiable" %}
        {% assign vLabel   = 'Not&nbsp;verifiable!' %}
        {% assign vTooltip = 'The app provider also shares code but we could so far
          not verify that the published code matches the published app!' %}
      {% when "reproducible" %}
        {% assign vLabel   = 'Reproducible when tested' %}
        {% assign vTooltip = 'At the time of this analysis, the app on Google Play
          was reproducible from the code provided by the developers!' %}
      {% else %}
        {% assign vLabel   = '???' %}
        {% assign vTooltip = '???' %}
    {% endcase %}
    <div class="icon-row row-identifier-{{ v }}">
    <h2 class="verdict {{ v }}">{{ vLabel }}</h2><br style="clear:both">
    <div class="flexi-list">
    {% for d in downloads %}
      {% for post in posts_by_ratings %}
        {% assign users = post.users | downcase %}
        {% if post.verdict == v %}
          {% if users == d %}
            {% include list_of_wallets_item.html %}
          {% endif %}
        {% endif %}
      {% endfor %}
    {% endfor %}
    </div>
    </div>
  {% endfor %}



(<a href="/">main list</a>)
<script>
  function toggleZIndex(t_){
    var t = document.getElementById("card_" + t_)
    var p = t.parentNode;
    if(!t.classList.contains("opened")){
      t.classList.add("opened")
      p.classList.add("opened")
    }else{
      t.classList.remove("opened")
      p.classList.remove("opened")
    }
  }
</script>
</div>