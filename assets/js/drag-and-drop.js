var uploadsActivated = false;

document.addEventListener("DOMContentLoaded", function () {
    initializeDragAndDrop();
});

function initializeDragAndDrop() {
    const dropArea = document.getElementById('drop-area');
    const fileElem = document.getElementById('fileElem');
    preventDefaultDragBehaviors(dropArea);
    setupHighlightEvents(dropArea);
    dropArea.addEventListener('drop', e => processFiles(e.dataTransfer.files));
    fileElem.addEventListener('change', e => processFiles(e.target.files));
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

function processFiles(files) {
    if (files.length > 1) {
        alert('Please select or drop only one file at a time.');
        return;
    }

    clearFileList();  // Clear the list before displaying new information
    handleFile(files[0]);
}

async function handleFile(file) {
    console.time("Total handleFile time");

    const hash = await calculateFileHash(file);

    const select = document.getElementById('select');
    select.classList.remove('hover-mode');
    select.classList.add('always-visible');

    // Display initial file information
    displayFileInfo(file, hash);

    // Start fetching app data
    const appData = await fetchAppData(hash);

    if (appData) { // Hash is in attestations.json        
        displayFileInfo(file, hash, appData.appId);
        displayAppData(appData);
        checkAppIdMismatch(appData.appId);
    } else { // Hash is NOT in attestations.json
        await handleUnknownFile(file, hash);
    }

    console.timeEnd("Total handleFile time");
    console.log(`for file: ${file.name}, ${formatFileSize(file.size)}`);
}

async function handleUnknownFile(file, hash) {
    if (!uploadsActivated) {
        await processUnknownApk(file, hash);
        return;
    }

    // Check if file exists in Blossom
    const existsInBlossom = await hasBlob(hash, '', serverUrl);

    if (existsInBlossom) {
        displayBlossomFileInfo(file.name, hash);
    } else {
        await processUnknownApk(file, hash);
        await uploadToBlossom(file, hash);
    }
}

async function processUnknownApk(file, hash) {
    // Parse APK file only if it's an APK
    if (file.name.toLowerCase().endsWith('.apk')) {
        try {
            const apkInfo = await parseAPK(file);
            if (apkInfo) {
                displayFileInfo(file, hash, apkInfo.package);
                showUnknownVersionMessage(apkInfo);

                checkAppIdMismatch(apkInfo.package);
            }
            else {
                showNoApkMessage();
            }
        } catch (error) {
            showNoApkMessage();
            console.warn('Error processing APK:', error);
        }
    }
    else {
        showNoApkMessage();
    }
}

async function uploadToBlossom(file, hash) {
    try {
        // Clear previous messages
        updateDomElement('app-data', '');

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

function updateDomElement(elementId, htmlContent) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = htmlContent;
    } else {
        console.warn(`Element with id "${elementId}" not found.`);
    }
}

function displayBlossomUploadStatus(message, progress) {
    updateDomElement('app-data', `
        <h3>Blossom Upload Status</h3>
        <p>${message}</p>
        <progress value="${progress}" max="100"></progress>
    `);
}

function displayBlossomUploadSuccess(fileName, hash) {
    updateDomElement('app-data', `
        <h3>Blossom Upload</h3>
        <p>File "${fileName}" (${hash}) has been successfully uploaded to Blossom.</p>
    `);
}

function displayBlossomUploadError(errorMessage) {
    updateDomElement('app-data', `
        <h3>Blossom Upload Error</h3>
        <p>An error occurred while uploading to Blossom: ${errorMessage}</p>
    `);
}

function showUnsupportedFileMessage(file) {
    updateDomElement('file-info', `
        <h3>Unsupported File</h3>
        <p>The file "${file.name}" is not supported. Please upload an APK file.</p>
    `);
}

function displayFileInfo(file, hash, appId) {
    updateDomElement('file-info', `
        <h3>File Information</h3>
        <strong>File:</strong> ${file ? file.name : 'N/A'}<br>
        ${appId ? `<strong>App ID:</strong> ${appId}<br>` : ''}
        <strong>Size:</strong> ${file ? formatFileSize(file.size) : 'N/A'}<br>
        <strong>SHA-256:</strong> ${hash || 'N/A'}<br>        
    `);
}

function displayAppData(appData) {
    const app = window.wallets.find(it => it.appId === appData.appId);

    console.log("Displaying app data");
    updateDomElement('app-data', `
        <h3>${app.title}</h3>
        <strong>Verdict:</strong><span class="verdict ${appData.verdict}">${appData.verdict}</span><br>
        <strong>App ID:</strong> ${appData.appId}<br>
        <strong>Signer:</strong> ${appData.signer}<br>
        <strong>Version:</strong> ${appData.version}<br>
        <strong>Date:</strong> ${appData.date || 'undefined'}<br>
    `);
}

function showUnknownVersionMessage(apkInfo) {
    const app = window.wallets.find(it => it.appId === apkInfo.package);

    let message;

    if (app) {
        // Case 1: We know this wallet/app
        message = `
            <h3>${app.title}</h3>
            <p>This appears to be version <b>${apkInfo.versionName}</b> of <b>${app.title}</b>, but we haven't verified this specific version yet.</p>
            <p>This could be:</p>
            <ul>
                <li>A newer version we haven't tested yet</li>
                <li>An older version that we haven't tested</li>
                <li>A modified version of the app</li>
            </ul>`;
    } else {
        // Case 2: Unknown app
        message = `
            <h3>Unknown Application</h3>
            <p>This is an APK with:</p>
            <ul>
                <li>Application ID: ${apkInfo.package}</li>
                <li>Version: ${apkInfo.versionName}</li>
            </ul>
            <p>Sorry, but we don't have any information about this application in our database yet.</p>`;
    }

    updateDomElement('app-data', message);
}


function showNoApkMessage() {
    updateDomElement('app-data', `
        <h3>Invalid APK File</h3>
        <p>The file could not be processed as a valid APK. Please ensure you're uploading a properly formatted Android application package.</p>
    `);
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
    ['file-info', 'app-data', 'redirect-button'].forEach(id => updateDomElement(id, ''));
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function displayBlossomFileInfo(fileName, hash) {
    updateDomElement('app-data', `
        <h3>File Found in Blossom</h3>
        <p>The file "${fileName}" (${hash}) exists in Blossom.</p>
    `);
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
