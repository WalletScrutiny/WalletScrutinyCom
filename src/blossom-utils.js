import { hasBlob, uploadBlobWithProgress, listUserBlobs } from './blossom.js';
import { updateDomElement } from './drag-and-drop-utils.js';

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
        // Clear previous messages
        updateDomElement('app-data', ' ');

        const exists = await hasBlob(hash, '', blossomServerUrl);

        if (exists) {
            console.log(`Blob ${hash} already exists in Blossom`);
            displayBlossomUploadStatus('File already exists in Blossom', 100);
        } else {
            console.log(`Uploading blob ${hash} to Blossom`);
            displayBlossomUploadStatus('Preparing to upload...', 0);

            const onProgress = (progress) => {
                displayBlossomUploadStatus(`Uploading... ${Math.round(progress)}%`, progress);
            };

            const descriptor = await uploadBlobWithProgress(file, blossomServerUrl, onProgress);

            console.log('Uploaded blob descriptor:', descriptor);

            displayBlossomUploadStatus('Upload complete!', 100);

            setCache(hash, true);

            await listUserBlobs(blossomServerUrl);
            displayBlossomUploadSuccess(file.name, hash);
        }
    } catch (error) {
        console.error('Error uploading to Blossom:', error.message);
        displayBlossomUploadError(error.message);
    }
}

export async function checkBlossomFile(hash) {
    // Check cache first
    const cachedResult = getCachedResult(hash);
    if (cachedResult !== null) {
        return cachedResult;
    }

    // If not in cache or expired, make the API call
    const exists = await hasBlob(hash, '', blossomServerUrl);
    setCache(hash, exists);
    return exists;
}

export function getBlossomFileURL(hash) {
    return blossomServerUrl + '/' + hash;
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

export function displayBlossomFileInfo(fileName, hash) {
    updateDomElement('app-data', `
        <h3>File Found in Blossom</h3>
        <p>The file "${fileName}" (${hash}) exists in Blossom.</p>
    `);
}

if (typeof window !== 'undefined') {
    window.checkBlossomFile = checkBlossomFile;
    window.getBlossomFileURL = getBlossomFileURL;
}