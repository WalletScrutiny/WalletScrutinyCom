---
permalink: /about/
title: "About"
author_profile: true
---

{% include base_path %}

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
</script>

<h2 id="featuredOn" class="section-label">As featured on:</h2>

{% include press.html %}

{% assign recent_posts = site.iphone | concat: site.android | concat: site.hardware | concat: site.bearer | sort: "wsId" | sort: "date" | slice: -10, 10 | reverse %}
<h2 class="section-label" id="recently">Most Recent Reviews Or Updates ({{ recent_posts.first.date | date: '%b %e' }}{% if recent_posts.last.date != recent_posts.first.date %} to {{ recent_posts.last.date | date: '%b %e' }}{% endif %})&nbsp;<a href="#recently" style="color:#ccc">&para;</a></h2>
<div id="recentPosts">
<div class="page-section">
</div>
<a onClick="loadMoreApps()">load more ...</a>
</div>

<script src="{{ base_path }}/assets/js/widgetBadgeDetails.js"></script>
<script src="{{ base_path }}/assets/js/scripts.js"></script>
<script src="{{ base_path }}/assets/js/landingPage.js"></script>
