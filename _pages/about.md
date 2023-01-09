---
permalink: /about/
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

<h2 id="sponsoredBy" class="section-label">Proud to be sponsored by:</h2>

<div style="width:6em;height:6em">
<a href="https://spiral.xyz/#grants" target="_blank" title="Spiral">
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-15 -15 679 679" class="image" style="background-color: rgb(27,20,100);border-radius: 50%;"><defs><style>.cls-1{fill:url(#linear-gradient);}</style><linearGradient id="linear-gradient" x1="81.36" y1="311.35" x2="541.35" y2="311.35" gradientUnits="userSpaceOnUse"><stop offset="0.18" stop-color="blue"></stop><stop offset="1" stop-color="#f0f"></stop></linearGradient></defs><path d="M326.4,572.09C201.2,572.09,141,503,112.48,445,84.26,387.47,81.89,330.44,81.69,322.31c-4.85-77,41-231.78,249.58-271.2a28.05,28.05,0,0,1,10.41,55.13c-213.12,40.28-204.44,206-204,213,0,.53.06,1.06.07,1.6C137.9,328.74,142.85,516,326.4,516,394.74,516,443,486.6,470,428.63c24.48-52.74,19.29-112.45-13.52-155.83-22.89-30.27-52.46-45-90.38-45-34.46,0-63.47,9.88-86.21,29.37A91.5,91.5,0,0,0,248,322.3c-1.41,25.4,7.14,49.36,24.07,67.49C287.27,406,305,413.9,326.4,413.9c27.46,0,45.52-9,53.66-26.81,8.38-18.3,3.61-38.93-.19-43.33-9.11-10-18.69-13.68-22.48-13-2.53.43-5.78,4.61-8.48,10.92a28,28,0,0,1-51.58-22c14.28-33.44,37.94-42,50.76-44.2,24.78-4.18,52.17,7.3,73.34,30.65s25.51,68.55,10.15,103.22C421.54,432,394.52,470,326.4,470c-36.72,0-69.67-14.49-95.29-41.92C203.64,398.68,189.77,360,192,319.19a149.1,149.1,0,0,1,51.31-104.6c33.19-28.45,74.48-42.87,122.71-42.87,55.12,0,101.85,23.25,135.12,67.23,45.36,60,52.9,141.71,19.66,213.3C495.45,506.92,441.12,572.09,326.4,572.09Z" class="cls-1"></path></svg>
<div style="width:100%;text-align:center;">Spiral</div>
</a>
</div>

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
