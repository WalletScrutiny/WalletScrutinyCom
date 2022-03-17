---
layout: archive
title: "Features"
permalink: /features/
author_profile: true
---

<style>
.praiseBox,.alertBox {
    font-weight: normal;
}
</style>

{% for f in site.data.features %}
  {% assign feature = f[0] %}
  {% include featureExplained.html %}
{% endfor %}
