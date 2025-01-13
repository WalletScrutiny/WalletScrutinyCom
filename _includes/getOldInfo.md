<script>
    {% assign reviewArchive = page.reviewArchive | default: empty %}
    {% assign reviewCurrent = page.reviewCurrent | default: empty %}
    {% assign currentArray = "" | split: "" %}
    {% if reviewCurrent != empty %}
        {% assign currentArray = currentArray | push: reviewCurrent %}
    {% endif %}
    {% assign combinedReviews = reviewArchive | concat: currentArray %}
    const oldTestsInfo = [
        {% for review in combinedReviews %}
            {
                version: "{{ review.version }}",
                appHash: "{{ review.appHash | default: review.appHashes[0] }}",
                gitRevision: "{{ review.gitRevision }}",
                date: "{{ review.date }}",
                verdict: "{{ review.verdict }}"
            },{% endfor %}
    ];
</script>