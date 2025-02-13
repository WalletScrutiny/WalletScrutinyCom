<script>
  {% assign reviewArchive = page.reviewArchive | default: empty %}
  const oldTestsInfo = [
    {% for review in reviewArchive %}
      {% if review.appHashes == nil or review.appHashes == empty or review.appHashes == "" %}
      {
        version: "{{ review.version }}",
        gitRevision: "{{ review.gitRevision }}",
        date: "{{ review.date }}",
        verdict: "{{ review.verdict }}"
      },
      {% endif %}
    {% endfor %}
  ];
</script>