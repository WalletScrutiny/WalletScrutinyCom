---
layout: compress
permalink: /allVerdicts.js
---

// This is for backend use, only. To have the verdicts available in scripts.
module.exports = {
  verdicts: {{ site.data.verdicts | jsonify }}
}
