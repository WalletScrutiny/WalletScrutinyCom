document.addEventListener("DOMContentLoaded", function() {
    initializeDragAndDrop();
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
    processDroppedFiles(files);
}

function handleFileSelect(files) {
    processDroppedFiles(files);
}

function processDroppedFiles(files) {
    if (files.length > 0) {
        clearFileList();  // Clear the list before displaying new information
        const file = files[0];
        handleFile(file);
    }
}

async function handleFile(file) {
    const hash = await calculateFileHash(file);
    const apkInfo = await parseAPK(file);
    const appData = await fetchAppData(hash);
    
    clearFileList();
    
    if (appData) {
        displayAppData(appData);
    }
    displayApkInfo(apkInfo, hash, file);
    
    checkAppIdMismatch(apkInfo?.package);
}

async function calculateFileHash(file) {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    return new Promise((resolve, reject) => {
        reader.onloadend = async function() {
            try {
                const hash = await sha256(reader.result); // Use the new sha256 function
                resolve(hash);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = reject;
    });
}

async function sha256(data) {
    const hash = await window.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hash));
    const hex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    return hex;
}

async function parseAPK(file) {
    const parser = new window.AppInfoParser(file);
    return parser.parse();  // Directly return the promise
}

async function fetchAppData(hash) {
    try {
        const response = await fetch('/assets/attestations.json');
        if (!response.ok) throw new Error('Network response was not ok');

        const appData = await response.json();
        const results = appData.filter(app => app.appHash === hash);
        return results.length > 0 ? results[0] : null;
    } catch (error) {
        console.error('Error loading app data:', error);
        return null;
    }
}

function clearFileList() {
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '';  // Clear all previous information
}

function displayApkInfo(info, hash, file) {
    const fileList = document.getElementById('file-list');
    const div = document.createElement('div');
    div.className = 'apk-info';
    div.innerHTML = `
        <h3>APK Information</h3>
        <strong>File:</strong> ${file ? file.name : 'N/A'}<br>
        <strong>Size:</strong> ${file ? formatFileSize(file.size) : 'N/A'}<br>
        <strong>SHA-256:</strong> ${hash || 'N/A'}<br>
        <strong>Package:</strong> ${info?.package || 'N/A'}<br>
        <strong>Version:</strong> ${info?.versionName || 'N/A'} (${info?.versionCode || 'N/A'})<br>
        <strong>Min SDK:</strong> ${info?.usesSdk?.minSdkVersion || 'N/A'}<br>
        <strong>Target SDK:</strong> ${info?.usesSdk?.targetSdkVersion || 'N/A'}<br>
    `;
    fileList.appendChild(div);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function displayAppData(appData) {
    const fileList = document.getElementById('file-list');
    const div = document.createElement('div');
    div.className = 'app-data';
    div.innerHTML = `
        <h3>App Data</h3>
        <strong>Verdict:</strong> <span class="verdict">${appData.verdict}</span><br>
        <strong>App ID:</strong> ${appData.appId}<br>
        <strong>Signer:</strong> ${appData.signer}<br>
        <strong>Version Name:</strong> ${appData.apkVersionName}<br>
        <strong>Version Code:</strong> ${appData.apkVersionCode || 'undefined'}<br>
        <strong>Date:</strong> ${appData.date || 'undefined'}<br>
    `;
    fileList.appendChild(div);
}

function checkAppIdMismatch(packageName) {
    const appIdFromPage = window.pageAppId; // Access `page.appId` from the global scope

    if (appIdFromPage !== packageName) {
        showRedirectButton(packageName);
    }
}

function showRedirectButton(packageName) {
    const fileList = document.getElementById('file-list');
    const button = document.createElement('button');
    button.innerHTML = `Go to Correct Page for ${packageName}`;
    button.onclick = () => {
        window.location.href = `/android/${packageName}/`;  // Redirect to the correct page
    };
    fileList.appendChild(button);
}
