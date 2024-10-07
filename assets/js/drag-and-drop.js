document.addEventListener("DOMContentLoaded", function () {
    initializeDragAndDrop();

    setTimeout(() => {
        listUserBlobs();
    }, 1000);
});

function initializeDragAndDrop() {
    const dropArea = document.getElementById('drop-area');
    preventDefaultDragBehaviors(dropArea);
    setupHighlightEvents(dropArea);
    dropArea.addEventListener('drop', handleDrop, false);
    document.getElementById('fileElem').addEventListener('change', e => handleFileSelect(e.target.files));
}

function preventDefaultDragBehaviors(element) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        element.addEventListener(eventName, e => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });
}

function setupHighlightEvents(element) {
    ['dragenter', 'dragover'].forEach(eventName => {
        element.addEventListener(eventName, () => element.classList.add('highlight'), false);
    });
    ['dragleave', 'drop'].forEach(eventName => {
        element.addEventListener(eventName, () => element.classList.remove('highlight'), false);
    });
}

function handleDrop(e) {
    const files = e.dataTransfer.files;
    if (files.length > 1) {
        alert('Please drop only one file at a time.');
        return;
    }
    processFile(files[0]);
}

function handleFileSelect(files) {
    if (files.length > 1) {
        alert('Please select only one file at a time.');
        return;
    }
    processFile(files[0]);
}

function processFile(file) {
    clearFileList();  // Clear the list before displaying new information
    handleFile(file);
}

async function handleFile(file) {
    console.time("Total handleFile time");

    const hash = await calculateFileHash(file);

    // Display initial file information
    displayFileInfo(file, hash);

    // Start fetching app data
    const appData = await fetchAppData(hash);

    if (appData) { // Hash is in attestations.json
        displayAppData(appData);
        checkAppIdMismatch(appData.appId);
    } else { // Hash is NOT in attestations.json
        // Check if file exists in Blossom
        const existsInBlossom = await hasBlob(hash, '', serverUrl);

        if (existsInBlossom) {
            displayBlossomFileInfo(file.name, hash);
        } else {
            showUnknownFileMessage();
            // Parse APK file only if it's an APK
            if (file.name.toLowerCase().endsWith('.apk')) {
                try {
                    const apkInfo = await parseAPK(file);
                    if (apkInfo) {
                        checkAppIdMismatch(apkInfo.package);
                    }
                } catch (error) {
                    console.warn('Error processing APK:', error);
                }
            }
            // Upload unknown file to Blossom
            await uploadToBlossom(file, hash);
        }
    }

    console.timeEnd("Total handleFile time");
    console.log(`for file: ${file.name}, ${formatFileSize(file.size)}`);
}

async function uploadToBlossom(file, hash) {
    try {
        // Clear previous messages
        document.getElementById('app-data').innerHTML = '';

        const exists = await hasBlob(hash, '', serverUrl);

        if (exists) {
            console.log(`Blob ${hash} already exists in Blossom`);
            displayBlossomUploadStatus('File already exists in Blossom', 100);
        } else {
            console.log(`Uploading blob ${hash} to Blossom`);
            displayBlossomUploadStatus('Preparing to upload...', 0);

            const onProgress = (progress) => {
                updateUploadProgress(progress);
            };

            const descriptor = await uploadBlobWithProgress(file, serverUrl, onProgress);

            console.log('Uploaded blob descriptor:', descriptor);

            displayBlossomUploadStatus('Upload complete!', 100);
            await listUserBlobs();
            displayBlossomUploadSuccess(file.name, hash);
        }
    } catch (error) {
        console.error('Error uploading to Blossom:', error.message);
        displayBlossomUploadError(error.message);
    }
}

function updateUploadProgress(progress) {
    displayBlossomUploadStatus(`Uploading... ${Math.round(progress)}%`, progress);
}

function displayBlossomUploadStatus(message, progress) {
    const appDataDiv = document.getElementById('app-data');
    appDataDiv.innerHTML = `
        <h3>Blossom Upload Status</h3>
        <p>${message}</p>
        <progress value="${progress}" max="100"></progress>
    `;
}

function displayBlossomUploadSuccess(fileName, hash) {
    const appDataDiv = document.getElementById('app-data');
    appDataDiv.innerHTML = `
        <h3>Blossom Upload</h3>
        <p>File "${fileName}" (${hash}) has been successfully uploaded to Blossom.</p>
    `;
}

function displayBlossomUploadError(errorMessage) {
    const appDataDiv = document.getElementById('app-data');
    appDataDiv.innerHTML = `
        <h3>Blossom Upload Error</h3>
        <p>An error occurred while uploading to Blossom: ${errorMessage}</p>
    `;
}

function displayFileInfo(file, hash) {
    const fileInfoDiv = document.getElementById('file-info');
    fileInfoDiv.innerHTML = `
        <h3>File Information</h3>
        <strong>File:</strong> ${file ? file.name : 'N/A'}<br>
        <strong>Size:</strong> ${file ? formatFileSize(file.size) : 'N/A'}<br>
        <strong>SHA-256:</strong> ${hash || 'N/A'}<br>
    `;
}

function showUnsupportedFileMessage(file) {
    const fileInfoDiv = document.getElementById('file-info');
    fileInfoDiv.innerHTML = `
        <h3>Unsupported File</h3>
        <p>The file "${file.name}" is not supported. Please upload an APK file.</p>
    `;
}

function showUnknownFileMessage() {
    const appDataDiv = document.getElementById('app-data');
    appDataDiv.innerHTML = `
        <h3>Unknown File</h3>
        <p>We don't know this file. It could be a new version, one we did not test yet, or something malicious.</p>
    `;
}

async function calculateFileHash(file) {
    console.time("calculateFileHash");
    console.log("Calculating file hash");
    const arrayBuffer = await file.arrayBuffer();
    const hash = await sha256(arrayBuffer);
    console.timeEnd("calculateFileHash");
    return hash;
}

async function sha256(data) {
    console.time("sha256");
    console.log("Calculating SHA-256 hash");
    const hash = await window.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hash));
    const hex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    console.timeEnd("sha256");
    return hex;
}

async function parseAPK(file) {
    console.time("parseAPK");
    console.log("Parsing APK file");
    try {
        const parser = new window.AppInfoParser(file);
        const result = await parser.parse();
        console.timeEnd("parseAPK");
        return result;
    } catch (error) {
        console.error('Error parsing APK:', error);
        console.timeEnd("parseAPK");
        return null;
    }
}

async function fetchAppData(hash) {
    console.time("fetchAppData");
    console.log("Fetching app data");
    try {
        const response = await fetch('/assets/attestations.json');
        if (!response.ok) throw new Error('Network response was not ok');

        const appData = await response.json();
        const results = appData.filter(app => app.appHashes && app.appHashes.includes(hash));
        console.timeEnd("fetchAppData");
        return results.length > 0 ? results[0] : null;
    } catch (error) {
        console.error('Error loading app data:', error);
        console.timeEnd("fetchAppData");
        return null;
    }
}

function clearFileList() {
    console.log("Clearing file list");
    document.getElementById('file-info').innerHTML = '';
    document.getElementById('app-data').innerHTML = '';
    document.getElementById('redirect-button').innerHTML = '';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function displayBlossomFileInfo(fileName, hash) {
    const appDataDiv = document.getElementById('app-data');
    appDataDiv.innerHTML = `
        <h3>File Found in Blossom</h3>
        <p>The file "${fileName}" (${hash}) exists in Blossom.</p>
    `;
}

function displayAppData(appData) {
    console.log("Displaying app data");
    const appDataDiv = document.getElementById('app-data');
    appDataDiv.innerHTML = `
        <h3>App Data</h3>
        <strong>Verdict:</strong> <span class="verdict">${appData.verdict}</span><br>
        <strong>App ID:</strong> ${appData.appId}<br>
        <strong>Signer:</strong> ${appData.signer}<br>
        <strong>Version:</strong> ${appData.version}<br>
        <strong>Date:</strong> ${appData.date || 'undefined'}<br>
    `;
}

function checkAppIdMismatch(appId) {
    console.log("Checking app ID mismatch");
    console.time("checkAppIdMismatch");
    const appIdFromPage = window.pageAppId;

    if (appIdFromPage !== appId) {
        let app = window.wallets.find(it => it.appId === appId);

        if (app) {
            showRedirectButton(app);
        }
    }
    console.timeEnd("checkAppIdMismatch");
}

function showRedirectButton(app) {
    console.log("Showing redirect button");
    const redirectButtonDiv = document.getElementById('redirect-button');
    redirectButtonDiv.innerHTML = ''; // Clear any existing content
    const button = document.createElement('button');
    button.innerHTML = `Go to correct page for "${app.title}"`;
    button.onclick = () => {
        window.location.href = `/${app.folder}/${app.appId}/`;  // Redirect to the correct page
    };
    redirectButtonDiv.appendChild(button);
}