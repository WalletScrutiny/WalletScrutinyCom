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
  {% assign g = site.data.features[feature] %}
  <h3><a href="/features/#{{ feature }}" id="{{ feature }}">{{ g.short }}</a></h3>

  {{ g.long | markdownify }}

  {% if g.benefit %}<div class="praiseBox"><div>
    {{ g.benefit | markdownify }}
  </div></div>{% endif %}

  {% if g.drawback %}<div class="alertBox"><div>
    {{ g.drawback | markdownify }}
  </div></div>{% endif %}
{% endfor %}
