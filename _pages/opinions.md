---
layout: archive
title: Community opinions
permalink: /opinions/
sitemap: false
opinions_moderation: true
---

<div
  id="opinion-moderation"
  data-trusted-authors='{{ site.data.nostrOpinions.trustedAuthors | jsonify }}'
  data-blocked-event-ids='{{ site.data.nostrOpinionBlocklist.eventIds | jsonify }}'
  data-blocked-authors='{{ site.data.nostrOpinionBlocklist.authors | jsonify }}'
></div>
