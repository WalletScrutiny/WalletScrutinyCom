import { blossomServerHasBlob, uploadBlobWithProgress } from './blossom.js';
import { updateDomElementInClass } from './drag-and-drop-utils.js';

const blossomServerUrl = 'https://files.nostr.info';

const BLOSSOM_CACHE_KEY = 'walletScrutinyFileCache';
const CACHE_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function getCache() {
    try {
        const cache = localStorage.getItem(BLOSSOM_CACHE_KEY);
        return cache ? JSON.parse(cache) : {};
    } catch (error) {
        console.error('Error reading from cache:', error);
        return {};
    }
}

function setCache(hash, exists) {
    try {
        const cache = getCache();
        cache[hash] = {
            exists,
            timestamp: Date.now()
        };
        localStorage.setItem(BLOSSOM_CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
        console.error('Error writing to cache:', error);
    }
}

function getCachedResult(hash) {
    const cache = getCache();
    const entry = cache[hash];
    
    if (entry) {
        const isExpired = Date.now() - entry.timestamp > CACHE_EXPIRATION_TIME;
        if (!isExpired) {
            return entry.exists;
        }
    }
    return null;
}

export async function uploadToBlossom(file, hash) {
    try {
        if (await blossomServerHasBlob(hash, '', blossomServerUrl)) {
            console.log(`Blob ${hash} already exists in Blossom`);
        } else {
            console.log(`Uploading blob ${hash} to Blossom`);
            displayBlossomUploadStatus('Preparing to upload file to our server...', 0);

            const onProgress = (progress) => {
                displayBlossomUploadStatus(`Uploading... ${Math.round(progress)}%`, progress);
            };

            await uploadBlobWithProgress(file, blossomServerUrl, onProgress);

            displayBlossomUploadSuccess(file.name, hash);

            setCache(hash, true);
        }
    } catch (error) {
        displayBlossomUploadError(error.message);
        showToast('It was impossible to upload the file to our server. Please try again.', 'error');
        return Promise.reject(error);
    }
}

function displayBlossomUploadStatus(message, progress) {
    document.querySelector('.blossom-upload-status').style.display = 'block';

    updateDomElementInClass('blossom-upload-status', `
        <p>${message}</p>
        <p><progress value="${progress}" max="100"></progress></p>
    `);
}

function displayBlossomUploadSuccess(fileName, hash) {
    updateDomElementInClass('blossom-upload-status', `
        <p>The file has been successfully uploaded to our server.</p>
    `);
}

function displayBlossomUploadError(errorMessage) {
    document.querySelector('.blossom-upload-status').style.display = 'block';

    updateDomElementInClass('blossom-upload-status', `
        <p style="color: red;">An error occurred while uploading to our server: ${errorMessage}.</p>
    `);
}

export async function checkFileExistsInBlossom(hash, overrideCache = false) {
    // Check cache first
    if (!overrideCache) {
        const cachedResult = getCachedResult(hash);
        if (cachedResult !== null) {
            return cachedResult;
        }
    }

    // If not in cache or expired, make the API call
    const exists = await blossomServerHasBlob(hash, '', blossomServerUrl);
    setCache(hash, exists);
    return exists;
}

export function getBlossomFileURL(hash) {
    return blossomServerUrl + '/' + hash;
}

if (typeof window !== 'undefined') {
    window.checkFileExistsInBlossom = checkFileExistsInBlossom;
    window.getBlossomFileURL = getBlossomFileURL;
    window.uploadToBlossom = uploadToBlossom;
}