---
layout: compress
permalink: /allMetas.js
---

module.exports = {
  metas: {{ site.data.metas | jsonify }}
}
