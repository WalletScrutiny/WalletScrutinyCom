---
permalink: /publications/
author_profile: true
---
<h2 class="section-label">As featured on:</h2>

{% include press.html full="true" %}

{% assign recent_posts = site.mobile | concat: site.hardware | concat: site.bearer | sort: "wsId" | sort: "date" | slice: -10, 10 | reverse %}


