document.addEventListener('DOMContentLoaded', function () {
    var modal = document.getElementById('diffoscopeModal');
    var span = document.getElementsByClassName('close')[0];
    var iframe = document.getElementById('diffoscopeFrame');

    // Add click handler to all diffoscope links
    document.querySelectorAll('a[href*="diffoscope-results"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            iframe.src = this.href;
            modal.style.display = 'block';
        });
    });

    // Close modal when clicking (x)
    span.onclick = function () {
        modal.style.display = 'none';
        iframe.src = '';
    };

    // Close modal when clicking outside
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            iframe.src = '';
        }
    };

    // Make the modal resizable
    iframe.style.resize = 'both';
    iframe.style.overflow = 'auto';
});
