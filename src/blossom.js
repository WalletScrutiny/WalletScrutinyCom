import { getNdk } from './verifications_utils.mjs';
import { NDKEvent } from '@nostr-dev-kit/ndk';

// Create and sign an authorization event
export async function createAuthorizationEvent(verb, content, xTags = [], serverUrl = '', tags = []) {
  const ndk = await getNdk();
  const eventObject = {
    kind: 24242,
    created_at: Math.floor(Date.now() / 1000),
    tags: [
      ['t', verb],
      ['expiration', (Math.floor(Date.now() / 1000) + 3600).toString()], // Expires in 1 hour
    ],
    content: content,
  };

  tags.forEach(tag => {
    const [key, value] = tag;
    eventObject.tags.push([key, value]);
  });

  xTags.forEach(x => {
    eventObject.tags.push(['x', x]);
  });

  if (serverUrl) {
    eventObject.tags.push(['server', serverUrl]);
  }

  // Sign with extension if available
  if (typeof window.nostr !== 'undefined' && typeof window.nostr.signEvent === 'function') {
    return await window.nostr.signEvent(eventObject)
  }

  // Sign with internal identity if no extension is available
  const event = new NDKEvent(ndk, eventObject);
  event.sig = await event.sign();
  return event;
}

// Create an authorization header
export async function createAuthorizationHeader(verb, content, xTags = [], serverUrl = '', tags = []) {
  const signedEvent = await createAuthorizationEvent(verb, content, xTags, serverUrl, tags);
  const eventJson = JSON.stringify(signedEvent);
  const eventBase64 = btoa(eventJson);
  return 'Nostr ' + eventBase64;
}

// Calculate SHA256 of a blob
export async function sha256FromBlob(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  return sha256(arrayBuffer);
}

// Calculate SHA256 from data
export async function sha256(data) {
  const hash = await window.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hash));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// Check if a blob exists on the server
export async function blossomServerHasBlob(sha256, fileExtension = '', serverUrl) {
  const url = `${serverUrl}/${sha256}${fileExtension}`;
  try {
    // Suppress console logging for 404s - they're expected when blobs don't exist
    const response = await fetch(url, { 
      method: 'HEAD',
      // Set mode to 'no-cors' would hide the error but we can't read the response
      // Instead we'll just catch and suppress expected 404s below
    });
    
    if (response.ok) {
      return true;
    } else if (response.status === 404) {
      // 404 is expected when blob doesn't exist - silently return false
      return false;
    } else {
      // Unexpected status code
      try {
        const error = await response.json();
        console.warn(`Blob check unexpected status ${response.status}:`, error.message);
      } catch {
        console.warn(`Blob check unexpected status: ${response.status}`);
      }
      return false;
    }
  } catch (error) {
    // Network errors or CORS issues - these are expected for missing blobs
    // Only log truly unexpected errors
    if (error.name !== 'TypeError' && !error.message.includes('Failed to fetch')) {
      console.warn('Unexpected error checking blob existence:', error);
    }
    return false;
  }
}

// Upload a blob with progress tracking
export async function uploadBlobWithProgress(blob, serverUrl, onProgress) {
  const sha256 = await sha256FromBlob(blob);
  const mimeType = blob.type || 'application/octet-stream';

  const tags = [
    ['name', blob.name],
    ['size', blob.size.toString()],
  ];

  const authHeader = await createAuthorizationHeader('upload', `Upload blob ${sha256}`, [sha256], serverUrl, tags);

  const headers = {
    'Content-Type': mimeType,
    'Authorization': authHeader,
  };

  const url = `${serverUrl}/upload`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);

    Object.keys(headers).forEach(key => {
      xhr.setRequestHeader(key, headers[key]);
    });

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percentComplete = (event.loaded / event.total) * 100;
        onProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`HTTP Error: ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error((blob.size / 1024 / 1024) > window.maxFileSize ? 'File too big (max ' + window.maxFileSize + 'MB)' : 'Network error'));
    };

    xhr.send(blob);
  });
}
