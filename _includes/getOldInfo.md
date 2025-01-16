<script>
    {% assign reviewArchive = page.reviewArchive | default: empty %}
    const oldTestsInfo = [
        {% for review in reviewArchive %}
            {
                version: "{{ review.version }}",
                appHash: "{{ review.appHash | default: review.appHashes[0] }}",
                gitRevision: "{{ review.gitRevision }}",
                date: "{{ review.date }}",
                verdict: "{{ review.verdict }}"
            },{% endfor %}
    ];
</script>