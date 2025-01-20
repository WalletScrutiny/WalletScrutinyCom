

// Check if Nostr is available in the browser
export function isNostrAvailable() {
  return typeof window.nostr !== 'undefined' && typeof window.nostr.signEvent === 'function';
}

// Sign a Nostr event
export async function signer(event) {
  if (!isNostrAvailable()) {
    throw new Error('Nostr provider is not available');
  }
  return await window.nostr.signEvent(event);
}

// Get the current user's public key
export async function getCurrentPublicKey() {
  if (!isNostrAvailable()) {
    throw new Error('Nostr provider is not available');
  }
  try {
    return await window.nostr.getPublicKey();
  } catch (error) {
    console.error('Error getting public key:', error);
    throw error;
  }
}

// List blobs uploaded by the current user
export async function listUserBlobs(serverUrl) {
  const since = null;
  const until = null;
  const requireAuth = true;

  try {
    const pubKey = await getCurrentPublicKey();
    console.log('Current public key:', pubKey);

    const blobs = await listBlobs(pubKey, serverUrl, since, until, requireAuth);
    console.log('Blobs uploaded by pubKey:', pubKey, blobs.length);

    blobs.forEach((blob, index) => {
      console.log(`Blob ${index + 1}:`);
      console.log(`  SHA256: ${blob.sha256}`);
      console.log(`  Created: ${new Date(blob.created * 1000).toLocaleString()}`);
      console.log(`  Size: ${blob.size} bytes`);
      console.log(`  Type: ${blob.type}`);
      console.log(`  URL: ${blob.url}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error listing blobs:', error.message);
    if (error.message.includes('Auth must be signed by the pubkey')) {
      console.log('Authorization error: Make sure you are signed in with the correct Nostr account.');
    }
  }
}

// Create and sign an authorization event
export async function createAuthorizationEvent(verb, content, xTags = [], serverUrl = '', tags = []) {
  const event = {
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
    event.tags.push([key, value]);
  });

  xTags.forEach(x => {
    event.tags.push(['x', x]);
  });

  if (serverUrl) {
    event.tags.push(['server', serverUrl]);
  }

  return await signer(event);
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
export async function hasBlob(sha256, fileExtension = '', serverUrl) {
  const url = `${serverUrl}/${sha256}${fileExtension}`;
  const response = await fetch(url, { method: 'HEAD' });
  if (response.ok) {
    return true;
  } else if (response.status === 404) {
    return false;
  } else {
    const error = await response.json();
    throw new Error(error.message);
  }
}

// Upload a blob with progress tracking
export async function uploadBlobWithProgress(blob, serverUrl, onProgress) {
  const sha256 = await sha256FromBlob(blob);
  const mimeType = blob.type || 'application/octet-stream';

  const tags = [
    ['name', blob.name],
    ['size', blob.size],
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
      reject(new Error('Network Error'));
    };

    xhr.send(blob);
  });
}

// List blobs for a specific public key
export async function listBlobs(pubkey, serverUrl, since = null, until = null, requireAuth = false) {
  let url = `${serverUrl}/list/${pubkey}`;
  const params = new URLSearchParams();
  if (since) params.append('since', since);
  if (until) params.append('until', until);
  if (params.toString()) {
    url += '?' + params.toString();
  }

  const headers = { 'Accept': 'application/json' };

  if (requireAuth) {
    headers['Authorization'] = await createAuthorizationHeader('list', 'List Blobs');
  }

  const response = await fetch(url, { headers });
  if (response.ok) {
    return await response.json();
  } else {
    const error = await response.json();
    throw new Error(error.message);
  }
}
