document.addEventListener("DOMContentLoaded", function() {
    let dropArea = document.getElementById('drop-area');

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Highlight the drop area when a file is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.add('highlight'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.remove('highlight'), false);
    });

    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        let dt = e.dataTransfer;
        let files = dt.files;
        handleFiles(files);
    }

    window.handleFileSelect = function(files) {
        handleFiles(files);
    }

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            calculateHash(file);
        }
    }

    function calculateHash(file) {
        let reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = function() {
            let shaObj = new jsSHA("SHA-256", "ARRAYBUFFER");
            shaObj.update(reader.result);
            let hash = shaObj.getHash("HEX");
            parseAPK(file, hash);
        }
    }

    function parseAPK(file, hash) {
        const parser = new window.AppInfoParser(file);
        parser.parse()
            .then(result => {
                displayInfo(file.name, result, hash);
            })
            .catch(err => {
                console.error('Error parsing APK:', err);
            });
    }

    function displayInfo(fileName, info, hash) {
        let fileList = document.getElementById('file-list');
        fileList.innerHTML = ''; // Clear the existing content
        let li = document.createElement('li');
        li.innerHTML = `
      <strong>File:</strong> ${fileName}<br>
      <strong>SHA-256:</strong> ${hash}<br>
      <strong>Package:</strong> ${info.package}<br>
      <strong>Version:</strong> ${info.versionName} (${info.versionCode})<br>
      <strong>Min SDK:</strong> ${info.usesSdk.minSdkVersion || 'undefined'}<br>
      <strong>Target SDK:</strong> ${info.usesSdk.targetSdkVersion || 'undefined'}<br>
    `;
        fileList.appendChild(li);
    }
});
