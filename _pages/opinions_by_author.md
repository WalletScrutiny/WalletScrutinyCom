---
layout: archive
title: Community opinions by author
permalink: /opinions_by_author/
sitemap: false
opinions_moderation: true
---

<div
  id="opinion-moderation"
  data-group-by="author"
  data-trusted-authors='{{ site.data.nostrOpinions.trustedAuthors | jsonify }}'
  data-blocked-event-ids='{{ site.data.nostrOpinionBlocklist.eventIds | jsonify }}'
  data-blocked-authors='{{ site.data.nostrOpinionBlocklist.authors | jsonify }}'
></div>
