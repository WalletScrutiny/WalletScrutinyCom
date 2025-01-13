<script>
    {% if page.reviewArchive %}
        const oldTestsInfo = [
            {% for review in page.reviewArchive %}
                {
                    version: "{{ review.version }}",
                    appHash: "{{ review.appHash }}",
                    gitRevision: "{{ review.gitRevision }}",
                    date: "{{ review.date }}",
                    verdict: "{{ review.verdict }}"
                },{% endfor %}
        ];
    {% endif %}
</script>