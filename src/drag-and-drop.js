import AppInfoParser from 'app-info-parser';
import { hasBlob, uploadBlobWithProgress, listUserBlobs } from './blossom.js';

const uploadsActivated = false;
const blossomServerUrl = 'https://cdn.satellite.earth';

document.addEventListener("DOMContentLoaded", async function () {
    initializeDragAndDrop();

    // If appHash passed to url show AppData and scroll to row in archive.
    const urlParams = new URLSearchParams(window.location.search);
    const hash = urlParams.get('hash');

    if (hash) {
        const appData = await fetchAppData(hash);
        if (appData) {
            displayAppData(appData);
            disableHoverMode();

            if (appData.version) {
                scrollToVersion(appData.version);
            } else {
                console.warn('Version not found in appData.');
            }
        } else {
            console.error('No app data found for this hash.');
        }
    }
});

function scrollToVersion(version) {
    const versionId = `version-${version.replace(/\./g, '-')}`; // Generate row ID

    const observer = new MutationObserver((mutations, obs) => {

        const showMoreButton = document.querySelector('a.show-more-link');
        const targetElement = document.getElementById(versionId);

        // Row is visible, we can directly scroll to it
        if (targetElement && targetElement.offsetParent) {
            obs.disconnect();
            targetElement.scrollIntoView({ block: 'center' });
            targetElement.classList.add('highlightRow');
        } else if (showMoreButton != null) {
            obs.disconnect();

            if (targetElement && !targetElement.offsetParent)
                // Row is hidden, we need to expand the table
                if (showMoreButton) {
                    showMoreButton.click(); // Expand the table
                }

            // Wait for the table to expand, then scroll to and highlight the target row
            setTimeout(() => {
                const updatedTarget = document.getElementById(versionId);
                if (updatedTarget) {
                    updatedTarget.scrollIntoView({ block: 'center' });
                    updatedTarget.classList.add('highlightRow');

                } else {
                    console.warn(`No table row found for version: ${version}`);
                }
            }, 500);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function initializeDragAndDrop() {
    const dropAreas = document.getElementsByClassName('drop-areas');
    const fileElems = document.getElementsByClassName('fileElems');

    Array.from(dropAreas).forEach(dropArea => {
        preventDefaultDragBehaviors(dropArea);
        setupHighlightEvents(dropArea);
        dropArea.addEventListener('drop', e => processFiles(e.dataTransfer.files));
    });

    Array.from(fileElems).forEach(fileElem => {
        fileElem.addEventListener('change', e => processFiles(e.target.files));
    });
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

function disableHoverMode() {
    const select = document.getElementById('select');
    select.classList.remove('hover-mode');
    select.classList.add('always-visible');

    const dropText = document.querySelector(".drop-text");
    const selectLabel = document.querySelector("#select label");

    // Change the text after a file is selected or dropped
    dropText.textContent = "Drop another file to verify";
    selectLabel.textContent = "Select a new file";
}

function processFiles(files) {
    if (files.length > 1) {
        alert('Please select or drop only one file at a time.');
        return;
    }

    // Clear the drop-area before displaying new information
    ['file-info', 'app-data', 'drop-area-buttons', 'drop-area-messages'].forEach(id => updateDomElement(id, ''));

    handleFile(files[0]);
}

async function handleFile(file) {
    const hash = await calculateFileHash(file);

    disableHoverMode();

    // Display initial file information
    displayFileInfo(file, hash);

    // Start fetching app data from legacy attestation.json
    const appData = await fetchAppData(hash);
    if (appData) { // Hash is in attestations.json
        displayFileInfo(file, hash, appData.appId);
        displayAppData(appData);
        if (isAppIdCorrect(appData.appId, hash)) {
            scrollToVersion(appData.version);
        }
    } else { // Hash is NOT in attestations.json
        await handleUnknownFile(file, hash);
    }

    // If we have a form with a sha256 input, set it to the hash
    if (document.getElementById('sha256')) {
        document.getElementById('sha256').value = hash;
    }

    // If we have a form with a appId input, set it to the appId
    if (document.getElementById('appId') && appData.appId) {
        document.getElementById('appId').value = appData.appId;
    }

    // Get attestations information for this hash from Nostr
    await nostrConnect();
    const allAssetsInformation = await getAllAssetInformation({
        months: 12,
        sha256: hash
    });
    console.log("allAssetsInformation", allAssetsInformation);

    const hasAssets = allAssetsInformation.assets && allAssetsInformation.assets.size > 0;
    const hasAttestations = allAssetsInformation.attestations && allAssetsInformation.attestations.size > 0;
    if (hasAssets) {
        let message = `<li>This asset has already been registered in Nostr,`;
        let buttonText;

        if (hasAttestations) {
            message += ` and it has attestations.</li>`;
            buttonText = "Create a new attestation";
        } else {
            message += ` but it doesn't have attestations yet. You can create one by clicking the button.</li>`;
            buttonText = "Create attestation";
        }
        addButtonToDropArea(buttonText, `/new_attestation/?sha256=${encodeURIComponent(hash)}&assetEventId="aaaaaa"`, "btn btn-primary");
        addMessageToDropArea(message);

        addButtonToDropArea("How Attestations work", `/attestations/`, "btn btn-primary", true);
    } else {
        let url = `/new_asset/?sha256=${encodeURIComponent(hash)}`;

        if (appData) {
            url += `&appId=${encodeURIComponent(appData.appId)}`;
        }

        addButtonToDropArea(`Register new asset`, url, "btn btn-primary");
        addMessageToDropArea(`<li>Register this new asset so you or others can try to reproduce it.</li>`);
    }
}

async function handleUnknownFile(file, hash) {
    if (!uploadsActivated) {
        await processUnknownFile(file, hash);
        return;
    }

    // Check if file exists in Blossom
    const existsInBlossom = await hasBlob(hash, '', blossomServerUrl);

    if (existsInBlossom) {
        displayBlossomFileInfo(file.name, hash);
    } else {
        await processUnknownFile(file, hash);
        await uploadToBlossom(file, hash);
    }
}

async function processUnknownFile(file, hash) {
    try {
        const parser = new AppInfoParser(file);
        const apkInfo = await parser.parse();

        if (apkInfo) {
            console.log("Processing unknown file");
            displayFileInfo(file, hash, apkInfo.package);
            showUnknownVersionMessage(apkInfo, hash);
            isAppIdCorrect(apkInfo.package, hash);
        }
    } catch (error) {
        console.debug("It's not an APK file:", error);
        return null;
    }
}

async function uploadToBlossom(file, hash) {
    try {
        // Clear previous messages
        updateDomElement('app-data', '');

        const exists = await hasBlob(hash, '', blossomServerUrl);

        if (exists) {
            console.log(`Blob ${hash} already exists in Blossom`);
            displayBlossomUploadStatus('File already exists in Blossom', 100);
        } else {
            console.log(`Uploading blob ${hash} to Blossom`);
            displayBlossomUploadStatus('Preparing to upload...', 0);

            const onProgress = (progress) => {
                updateUploadProgress(progress);
            };

            const descriptor = await uploadBlobWithProgress(file, blossomServerUrl, onProgress);

            console.log('Uploaded blob descriptor:', descriptor);

            displayBlossomUploadStatus('Upload complete!', 100);
            await listUserBlobs(blossomServerUrl);
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
    console.log("Updating DOM element", elementId, htmlContent);
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

    updateDomElement('app-data', `
        <h3>${app.title}</h3>
        <strong>Verdict:</strong><span class="verdict ${appData.verdict}">${appData.verdict}</span><br>
        <strong>App ID:</strong> ${appData.appId}<br>
        <strong>Signer:</strong> ${appData.signer}<br>
        <strong>Version:</strong> ${appData.version}<br>
        <strong>Date:</strong> ${appData.date || 'undefined'}<br>
    `);

    return appData;
}

function showUnknownVersionMessage(apkInfo, hash) {
    const app = window.wallets.find(it => it.appId === apkInfo.package);

    let message;

    console.log("Showing unknown version message", app);
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
        /*
                addButtonToDropArea(
                    `Register new asset_222`,
                    `/new_asset/?sha256=${encodeURIComponent(hash)}&appId=${encodeURIComponent(app.appId)}`,
                    "btn btn-primary"
                );
        */
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

        //let url = `/new_asset/?sha256=${encodeURIComponent(hash)}&appId=${encodeURIComponent(app.appId)}`;
        //addButtonToDropArea(`Register new asset_333`, url, "btn btn-primary");
    }

    updateDomElement('app-data', message);
}

async function calculateFileHash(file) {
    console.time("sha256");
    console.log("Calculating SHA-256 hash");
    const arrayBuffer = await file.arrayBuffer();
    const hash = await window.crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hash));
    const hex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    console.timeEnd("sha256");
    return hex;
}

async function fetchAppData(hash) {
    console.log("Fetching app data");
    try {
        const response = await fetch('/assets/attestations.json');
        if (!response.ok) throw new Error('Network response was not ok');

        const appData = await response.json();
        const results = appData.filter(app => app.appHashes && app.appHashes.includes(hash));
        return results.length > 0 ? results[0] : null;
    } catch (error) {
        console.error('Error loading app data:', error);
        return null;
    }
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

function isAppIdCorrect(appId, hash) {
    const appIdFromPage = window.pageAppId;

    if (appIdFromPage !== appId) {
        let app = window.wallets.find(it => it.appId === appId);

        if (app) {
            addButtonToDropArea(`Go to "${app.title}" page`, `/${app.folder}/${app.appId}/?hash=${encodeURIComponent(hash)}`, "btn btn-primary");
            addMessageToDropArea(`<li>You can go to the "${app.title}" application page to check for other attestations.</li>`);
        }

        return false;
    }

    return true;
}

function addButtonToDropArea(text, href, className = "btn btn-primary") {
    const dropAreaButtonDiv = document.getElementById('drop-area-buttons');
    const button = document.createElement('a');
    button.innerHTML = text;
    button.className = className;
    button.href = href;
    dropAreaButtonDiv.appendChild(button);
}

function addMessageToDropArea(message) {
    const dropAreaMessageDiv = document.getElementById('drop-area-messages');
    dropAreaMessageDiv.innerHTML += message;
}