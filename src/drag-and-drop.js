import { uploadToBlossom, checkBlossomFile, displayBlossomFileInfo } from './blossom-utils.js';
import { 
    formatFileSize, 
    updateDomElement, 
    getVersionFromFilename,
    calculateFileHash,
    isPageForAppId,
    getApkInfo
} from './drag-and-drop-utils.js';

const uploadsActivated = false;

document.addEventListener("DOMContentLoaded", async function () {
    initializeDragAndDrop();

    // If appHash passed to url show AppData and scroll to row in archive.
    const urlParams = new URLSearchParams(window.location.search);
    const hash = urlParams.get('hash');

    if (hash) {
        const appData = await fetchAppData(hash);
        if (appData) {
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
        if (targetElement?.offsetParent) {
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

async function setFormFields(hash, appData, fileName, apkInfo) {
    // If we have a form with a sha256 input, set it to the hash
    if (document.getElementById('sha256')) {
        document.getElementById('sha256').value = hash;
    }

    // If we have a form with a appId or version input, set them
    if (document.getElementById('appId') || document.getElementById('version')) {
        if (apkInfo) {
            document.getElementById('appId').value = apkInfo.package;
            document.getElementById('version').value = apkInfo.versionName;
        } else {
            document.getElementById('appId').value = appData?.appId ? appData.appId : '';

            const versionFromFilename = getVersionFromFilename(fileName);
            document.getElementById('version').value = versionFromFilename ? versionFromFilename : '';
        }
    }
}

async function processFiles(files) {
    if (files.length > 1) {
        alert('Please select or drop only one file at a time.');
        return;
    }

    document.getElementById('loadingSpinner').style.display = 'block';

    const file = files[0];

    // Clear the drop-area before displaying new information
    ['file-info', 'drop-area-buttons'].forEach(id => updateDomElement(id, ''));

    disableHoverMode();

    /////////////////////////////////////////////////////////////////////
    // Get all the information about the file / hash / apk
    /////////////////////////////////////////////////////////////////////
    const [apkInfo, hash] = await Promise.all([
        getApkInfo(file),
        calculateFileHash(file)
    ]);

    const [appData, allAssetsInformation] = await Promise.all([
        fetchAppData(hash),     // Get app data from legacy attestation.json
        (async () => {
            await nostrConnect();
            return getAllAssetInformation({
                months: 12,
                sha256: hash
            });
        })()
    ]);
    /////////////////////////////////////////////////////////////////////

    setFormFields(hash, appData, file.name, apkInfo);

    displayAllInfo(file, apkInfo, hash, appData, allAssetsInformation);

    if (appData) {  // We have legacy appData from attestation.json
        if (isPageForAppId(appData.appId)) {
            scrollToVersion(appData.version);
        }
    } else {    // We don't have legacy appData from attestation.json
        if (uploadsActivated) {
            const existsInBlossom = await checkBlossomFile(hash);
            if (existsInBlossom) {
                displayBlossomFileInfo(file.name, hash);
            } else {
                await uploadToBlossom(file, hash);
            }
        }
    }

    document.getElementById('loadingSpinner').style.display = 'none';
}

async function displayAllInfo(file, apkInfo, hash, appData, allAssetsInformation) {
    const appId = appData?.appId ?? apkInfo?.package ?? null;
    const version = appData?.version ?? apkInfo?.versionName ?? null;

    const app = window.wallets.find(it => it.appId === appId) ?? null;

    let fileInfoHtml = '';
    if (app) {
        fileInfoHtml = `<h3>${app.title}</h3>`;
    }
    fileInfoHtml += `<strong>App ID:</strong> ${appId ?? 'N/A'}<br>`;
    fileInfoHtml += `<strong>Version:</strong> ${version ?? 'N/A'}<br>`;

    if (appData) {
        fileInfoHtml += `
            <strong>Verdict:</strong><span class="verdict ${appData.verdict}">${appData.verdict}</span><br>
            <strong>Signer:</strong> ${appData.signer}<br>
            <strong>Date:</strong> ${appData.date || 'undefined'}<br><br>`;
    }

    fileInfoHtml += `<strong>File:</strong> ${file ? file.name : 'N/A'}<br>`;
    fileInfoHtml += `<strong>Size:</strong> ${file ? formatFileSize(file.size) : 'N/A'}<br>`;
    fileInfoHtml += `<strong>SHA-256:</strong> ${hash || 'N/A'}<br>`;

    if (!appData && apkInfo) {
        fileInfoHtml += '<br><br>' + (
            app ?
            `<p>This appears to be version <b>${version}</b> of <b>${app.title}</b>, but nobody has verified this specific version yet.</p>` :
            `<p>This is an APK for an unknown application. You can register it on Nostr so you or others can try to reproduce it.</p>`);
    }

    fileInfoHtml += '<br><br>';


    // Adding buttons and related information

    if (!isPageForAppId(appId) && app) {
        fileInfoHtml += `<li>You can go to the <a href="/${app.folder}/${appId}/?hash=${encodeURIComponent(hash)}" class="btn btn-small">${app.title} page</a> to check the attestations.</li>`;
    }

    const hasAssets = allAssetsInformation.assets?.size > 0;
    const hasAttestations = allAssetsInformation.attestations?.size > 0;

    if (hasAssets) {
        fileInfoHtml += `<li>This asset is registered in Nostr,`;

        if (hasAttestations) {
            fileInfoHtml += ` and it has attestations. <a href="/asset/?sha256=${encodeURIComponent(hash)}" class="btn btn-small">View them</a>.</li>`;
        } else {
            fileInfoHtml += ` but it doesn't have attestations yet. You can <a href="/new_attestation/?sha256=${encodeURIComponent(hash)}" class="btn btn-small">Create one</a>.</li>`;
        }
    } else {
        if (window.location.pathname !== '/new_asset/') {
            let url = `/new_asset/?sha256=${encodeURIComponent(hash)}`;

            if (appId) {
                url += `&appId=${encodeURIComponent(appId)}`;
            }
            if (version) {
                url += `&version=${encodeURIComponent(version)}`;
            }
        
            fileInfoHtml += `<li><a href="${url}" class="btn btn-small">Register this new asset</a> on Nostr so you or others can try to reproduce it.</li>`;
        }
    }

    fileInfoHtml += `<li>Check out <a href="/attestations/" class="btn btn-small" target="_blank">How Attestations work</a>.</li>`;

    updateDomElement('file-info', fileInfoHtml);
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
