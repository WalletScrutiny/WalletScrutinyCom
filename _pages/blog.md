---
layout: archive
title: "Blog"
permalink: /blog/
---
<style>
.post {
  margin-top: 1em;
  padding: 1em;
  background: var(--light-grey);
  border-radius: 1em;
}
.post > .title {
  font-weight: bold;
  font-height: 2em;
}
.post > .subtitle {
  font-weight: bold;
  font-height: 1.2em;
}
.post > .excerpt {
  font-style: italic;
}

</style>

<div id="postList">
{% for post in site.posts %}
  <div class="post">
    <div class="title"><a href="{{ post.url }}">{{ post.title }}</a></div>
    {% if post.subtitle %}<div class="subtitle">{{ post.subtitle }}</div>{% endif %}
    <div class="excerpt">{{ post.excerpt | strip_html }}</div>
    {% include /review/byAuthor.html authors=post.authors %}
    <div><a href="{{ post.url }}">Read more …</a></div>
  </div>
{% endfor %}
</div>