import { hasBlob, uploadBlobWithProgress, listUserBlobs } from './blossom.js';
import { updateDomElement } from './drag-and-drop-utils.js';

const blossomServerUrl = 'https://cdn.satellite.earth';

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
            await listUserBlobs(blossomServerUrl);
            displayBlossomUploadSuccess(file.name, hash);
        }
    } catch (error) {
        console.error('Error uploading to Blossom:', error.message);
        displayBlossomUploadError(error.message);
    }
}

export async function checkBlossomFile(hash) {
    return await hasBlob(hash, '', blossomServerUrl);
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