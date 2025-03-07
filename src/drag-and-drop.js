import { uploadToBlossom } from './blossom-utils.js';
import { 
    formatFileSize, 
    updateDomElementInClass,
    getVersionFromFilename,
    calculateFileHash,
    isPageForAppId,
    getApkInfo
} from './drag-and-drop-utils.js';

const uploadsActivated = true;

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
        dropArea.addEventListener('drop', e => processFiles(e.dataTransfer.files, dropArea));
    });

    Array.from(fileElems).forEach(fileElem => {
        fileElem.addEventListener('change', e => processFiles(e.target.files, e.target.parentElement.parentElement));
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

function disableHoverMode(dropAreaElement) {
    const select = dropAreaElement.querySelector('#select');
    select.classList.remove('hover-mode');
    select.classList.add('always-visible');

    const dropText = dropAreaElement.querySelector(".drop-text");
    const selectLabel = dropAreaElement.querySelector("#select label");

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

async function processFiles(files, dropAreaElement) {
    if (files.length > 1) {
        alert('Please select or drop only one file at a time.');
        return;
    }

    document.getElementById('loadingSpinner').style.display = 'block';

    const file = files[0];

    updateDomElementInClass('textbox', '', dropAreaElement);    // Clear the drop-area before displaying new information

    disableHoverMode(dropAreaElement);

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
                sha256: hash
            });
        })()
    ]);
    /////////////////////////////////////////////////////////////////////

    setFormFields(hash, appData, file.name, apkInfo);

    displayAllInfo(dropAreaElement, file, apkInfo, hash, appData, allAssetsInformation);

    if (appData) {  // We have legacy appData from attestation.json
        if (isPageForAppId(appData.appId)) {
            scrollToVersion(appData.version);
        }
    }

    if (uploadsActivated) {
        await uploadToBlossom(file, hash);
    }

    document.getElementById('loadingSpinner').style.display = 'none';
}

async function displayAllInfo(dropAreaElement, file, apkInfo, hash, appData, allAssetsInformation) {
    let appTitle = null;
    let appId = null;
    let version = null;
    let verdict = null;
    let signer = null;
    let date = null;
    let appHashes = null;
    let platform = null;

    const firstVerification = allAssetsInformation.verifications.size > 0 
        ? allAssetsInformation.verifications.values().next().value[0]
        : null;

    let appInfoFromNostr = null;
    if (firstVerification) {
        appInfoFromNostr = getAppInfoFromEventInfo(firstVerification);
    }


    appId       = appInfoFromNostr?.appId ?? appData?.appId ?? apkInfo?.package ?? null;

    const app = window.wallets.find(it => it.appId === appId) ?? null;  // Get internal info

    version     = appInfoFromNostr?.version ?? appData?.version ?? apkInfo?.versionName ?? null;
    verdict     = appInfoFromNostr?.verdict ?? appData?.verdict ?? null;
    date        = appInfoFromNostr?.createdAt ?? appData?.date ?? null;
    appHashes   = appInfoFromNostr?.appHashes ?? [hash];
    signer      = appData?.signer ?? null;
    platform    = appInfoFromNostr?.platform ?? app?.folder ?? null; 
    appTitle    = apkInfo?.application?.label[0] ?? app?.title ?? appId;


    let fileInfoHtml = `<h3>${appTitle ?? ''}</h3>`;

    if (appId) {
        fileInfoHtml += `<strong>App ID:</strong> ${appId}<br>`;
    }
    if (version) {
        fileInfoHtml += `<strong>Version:</strong> ${version}<br>`;
    }
    if (verdict) {
        fileInfoHtml += `<strong>Verdict:</strong><span class="verdict ${verdict}">${verdict}</span><br>`;
    }
    if (signer) {
        fileInfoHtml += `<strong>Signer:</strong> ${signer}<br>`;
    }
    if (date) {
        fileInfoHtml += `<strong>Date:</strong> ${date}<br>`;
    }

    fileInfoHtml += `<strong>File:</strong> ${file ? file.name : 'N/A'}<br>`;
    fileInfoHtml += `<strong>Size:</strong> ${file ? formatFileSize(file.size) : 'N/A'}<br>`;
    fileInfoHtml += `<strong>SHA-256:</strong><br>`;
    
    if (appHashes && appHashes.length > 0) {
        fileInfoHtml += `<div style="margin-left: 10px;">`;
        appHashes.forEach(h => {
            fileInfoHtml += `• ${h}<br>`;
        });
        fileInfoHtml += `</div>`;
    }

    if (!appData && apkInfo) {
        fileInfoHtml += '<br>' + (
            app ?
            `<p>This appears to be version <b>${version}</b> of <b>${appTitle}</b>, but nobody has verified this specific version yet.</p>` :
            `<p>This is an APK for an unknown application. You can register it on Nostr so others can try to reproduce it.</p>`);
    }

    fileInfoHtml += '<br>';


    // Adding buttons and related information

    const hasAssets = allAssetsInformation.assets?.size > 0;
    const hasVerifications = allAssetsInformation.verifications?.size > 0;

    // Params to be used for new asset and new verification links
    let urlParams = `?sha256=${encodeURIComponent(hash)}`;
    if (appId) { urlParams += `&appId=${encodeURIComponent(appId)}`; }
    if (version) { urlParams += `&version=${encodeURIComponent(version)}`; }

    if (!hasAssets && !hasVerifications ) {
        if (window.location.pathname !== '/new_asset/') {
            fileInfoHtml += `<li><a href="/new_asset/${urlParams}" class="btn btn-small">Register this new asset</a> on Nostr so others can try to reproduce it.</li>`;
        }

        fileInfoHtml += `<li><a href="/new_verification/${urlParams}" class="btn btn-small">Create a verification</a> for this file so others can see if you were able to reproduce it or not.</li>`;
    } else if (hasAssets && !hasVerifications) {
        fileInfoHtml += `<li>This asset is <a href="/asset/?sha256=${encodeURIComponent(hash)}">already registered in Nostr</a>, but it doesn't have <b>verifications</b> yet. You can <a href="/new_verification/${urlParams}" class="btn btn-small">create one</a>.</li>`;
    } else if (hasVerifications) {
        fileInfoHtml += `<li>This file has <b>verifications</b> by users. You can <a href="/asset/?sha256=${encodeURIComponent(hash)}" class="btn btn-small">view them</a>, or <a href="/new_verification/${urlParams}" class="btn btn-small">create a new verification</a>.</li>`;
    }

    if (app && !isPageForAppId(appId)) {
        fileInfoHtml += `<li>You can go to the <a href="/${platform}/${appId}/?hash=${encodeURIComponent(hash)}" class="btn btn-small">${appTitle} page</a> to see all the information about this app.</li>`;
    }

    fileInfoHtml += `<li>Check out <a href="/verifications/" class="btn btn-small" target="_blank">How Verifications Work</a>.</li>`;

    updateDomElementInClass('textbox', fileInfoHtml, dropAreaElement);
}

async function fetchAppData(hash) {
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
