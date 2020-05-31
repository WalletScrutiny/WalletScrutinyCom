---
layout: archive
title: "More Apps"
permalink: /moreApps/
author_profile: true
---

<table>
  <thead>
    <tr>
      <td>Name</td>
      <td>Installs</td>
      <td>Launch</td>
      <td>Update</td>
      <td>Reviewed</td>
      <td>Verdict</td>
    </tr>
  </thead>
  {% assign verdicts = "nobtc,fewusers,defunct,wip,nowallet" | split: "," %}
  {% assign downloads = "100000000,50000000,10000000,5000000,1000000,500000,100000,50000,10000,5000,1000,500,100,50,10,5" | split: "," %}
  {% assign posts_by_ratings = site.posts | sort: "ratings" | reverse %}
  {% for v in verdicts %}
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
  {% endfor %}
</table>

(<a href="/">main list</a>)
