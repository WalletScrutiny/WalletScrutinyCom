---
permalink: /publications/
author_profile: true
---

{% include base_path %}

<h2 class="section-label">As featured on:</h2>

{% include press.html full="true" %}

{% assign recent_posts = site.iphone | concat: site.android | concat: site.hardware | concat: site.bearer | sort: "wsId" | sort: "date" | slice: -10, 10 | reverse %}


