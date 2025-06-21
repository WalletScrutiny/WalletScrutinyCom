#!/usr/bin/env node

/**
 * Advanced script to list all files hosted on a Blossom server with NIP-98 HTTP Auth support
 * 
 * Usage: node list-blossom-files-auth.js <server-url> [port] [private-key]
 * Example: node list-blossom-files-auth.js http://localhost 3000 nsec1...
 */

const fetch = require('node-fetch');
const crypto = require('crypto');
const { nip19, getPublicKey, getEventHash, signEvent } = require('nostr-tools');

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Usage: node list-blossom-files-auth.js <server-url> [port] [private-key]');
  console.error('Example: node list-blossom-files-auth.js http://localhost 3000 nsec1...');
  process.exit(1);
}

let serverUrl = args[0];
const port = args.length > 1 ? args[1] : null;
const privateKey = args.length > 2 ? args[2] : null;

// Add port to URL if provided
if (port) {
  // Remove trailing slash if present
  serverUrl = serverUrl.replace(/\/$/, '');
  serverUrl = `${serverUrl}:${port}`;
}

/**
 * Create a NIP-98 HTTP Auth header
 * @param {string} privateKey - The private key in nsec format
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {string} url - The URL being accessed
 * @param {string} body - The request body (if any)
 * @returns {string} - The Authorization header value
 */
async function createAuthHeader(privateKey, method, url, body = '') {
  try {
    // Decode nsec if provided
    let secKey = privateKey;
    if (privateKey && privateKey.startsWith('nsec')) {
      try {
        secKey = nip19.decode(privateKey).data;
      } catch (e) {
        console.error('Invalid nsec format:', e.message);
        return null;
      }
    }

    if (!secKey) {
      return null;
    }

    // Get public key from private key
    const pubKey = getPublicKey(secKey);
    
    // Create the NIP-98 event
    const event = {
      kind: 24242,
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ['u', url],
        ['method', method],
      ],
      content: body,
      pubkey: pubKey,
    };

    // Add hash to the event
    event.id = getEventHash(event);
    
    // Sign the event
    event.sig = signEvent(event, secKey);
    
    // Convert to base64
    const eventBase64 = Buffer.from(JSON.stringify(event)).toString('base64');
    
    return `Nostr ${eventBase64}`;
  } catch (error) {
    console.error('Error creating auth header:', error.message);
    return null;
  }
}

/**
 * List all files from the Blossom server
 * Based on the API documentation at:
 * https://github.com/quentintaranpino/nostrcheck-server/blob/main/DOCS.md#media-get-listing-files
 */
async function listAllFiles() {
  try {
    console.log(`Fetching files from ${serverUrl}/api/v2/media...`);
    
    // Initial request with page 0 and count 100
    let page = 0;
    const count = 100;
    let hasMoreFiles = true;
    let allFiles = [];
    
    while (hasMoreFiles) {
      const url = `${serverUrl}/api/v2/media?page=${page}&count=${count}`;
      console.log(`Fetching page ${page}...`);
      
      // Prepare headers
      const headers = {
        'Accept': 'application/json'
      };
      
      // Add auth header if private key is provided
      if (privateKey) {
        const authHeader = await createAuthHeader(privateKey, 'GET', url);
        if (authHeader) {
          headers['Authorization'] = authHeader;
        } else {
          console.warn('Warning: Failed to create auth header, proceeding without authentication');
        }
      }
      
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        if (response.status === 404) {
          console.error('Error: API endpoint not found. Make sure the server URL is correct and the server implements the Blossom API.');
          break;
        } else if (response.status === 401 || response.status === 403) {
          console.error('Error: Authentication failed. Make sure you provided a valid private key and have permission to access this resource.');
          break;
        }
        
        const errorText = await response.text();
        console.error(`Error (${response.status}): ${errorText}`);
        break;
      }
      
      const data = await response.json();
      
      if (!data.files || !Array.isArray(data.files)) {
        console.error('Error: Unexpected response format. The server did not return a files array.');
        console.error('Response:', JSON.stringify(data, null, 2));
        break;
      }
      
      // Add files from this page to our collection
      allFiles = allFiles.concat(data.files);
      console.log(`Retrieved ${data.files.length} files from page ${page}`);
      
      // Check if we've reached the end
      if (data.files.length < count || (page + 1) * count >= data.total) {
        hasMoreFiles = false;
      } else {
        page++;
      }
    }
    
    // Display the results
    console.log('\n=== Files on Blossom Server ===');
    console.log(`Total files: ${allFiles.length}`);
    
    allFiles.forEach((file, index) => {
      console.log(`\nFile ${index + 1}:`);
      
      // Extract important tags
      const tags = file.tags || [];
      const sha256Tag = getFirstTagValue(file, 'x', 'unknown');
      const sizeTag = getFirstTagValue(file, 'size');
      const altTag = getFirstTagValue(file, 'alt');
      const expirationTag = getFirstTagValue(file, 'expiration');
      
      if (sha256Tag) console.log(`  SHA256: ${sha256Tag}`);
      if (sizeTag) console.log(`  Size: ${sizeTag} bytes`);
      if (altTag) console.log(`  Alt: ${altTag}`);
      if (expirationTag) {
        const expirationDate = new Date(parseInt(expirationTag) * 1000);
        console.log(`  Expires: ${expirationDate.toLocaleString()}`);
      }

      console.log(`  Content: ${file.content || 'No content'}`);
      console.log(`  Created: ${new Date(file.created_at * 1000).toLocaleString()}`);
      console.log(`  URL: ${serverUrl}/${sha256Tag}`);
    });
    
  } catch (error) {
    console.error('Error fetching files:', error.message);
  }
}

// Run the script
listAllFiles(); 