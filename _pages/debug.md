---
layout: null
title: "Debug / Info page"
permalink: /debug
---

<div id="result"></div>

<script>
  const gitData = JSON.parse('{{ site.data.git | jsonify }}');
  const lastCommitRef = gitData.last_commit_ref;
  const uncommited = gitData.uncommited.split('*').join('<br>');

  let html = `
    <p>
      <strong>Git commit:</strong>  ${lastCommitRef}
    </p>

    <p>
      <strong>Git uncommited changes:</strong>
      <pre>${uncommited}</pre>
    </p>`;

  document.getElementById('result').innerHTML = html;
</script>
