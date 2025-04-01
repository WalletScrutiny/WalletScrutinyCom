#!/usr/bin/env node

/**
 * Script to list all files hosted on a Blossom server
 * 
 * Usage: node list-blossom-files.js <server-url> [port]
 * Example: node list-blossom-files.js http://localhost 3000
 */

const fetch = require('node-fetch');

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Usage: node list-blossom-files.js <server-url> [port]');
  console.error('Example: node list-blossom-files.js http://localhost 3000');
  process.exit(1);
}

let serverUrl = args[0];
const port = args.length > 1 ? args[1] : null;

// Add port to URL if provided
if (port) {
  // Remove trailing slash if present
  serverUrl = serverUrl.replace(/\/$/, '');
  serverUrl = `${serverUrl}:${port}`;
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
      
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.error('Error: API endpoint not found. Make sure the server URL is correct and the server implements the Blossom API.');
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
      const sha256Tag = tags.find(tag => tag[0] === 'x');
      const sizeTag = tags.find(tag => tag[0] === 'size');
      const altTag = tags.find(tag => tag[0] === 'alt');
      const expirationTag = tags.find(tag => tag[0] === 'expiration');
      
      if (sha256Tag) console.log(`  SHA256: ${sha256Tag[1]}`);
      if (sizeTag) console.log(`  Size: ${sizeTag[1]} bytes`);
      if (altTag) console.log(`  Alt: ${altTag[1]}`);
      if (expirationTag) {
        const expirationDate = new Date(parseInt(expirationTag[1]) * 1000);
        console.log(`  Expires: ${expirationDate.toLocaleString()}`);
      }
      
      console.log(`  Content: ${file.content || 'No content'}`);
      console.log(`  Created: ${new Date(file.created_at * 1000).toLocaleString()}`);
      console.log(`  URL: ${serverUrl}/${sha256Tag ? sha256Tag[1] : 'unknown'}`);
    });
    
  } catch (error) {
    console.error('Error fetching files:', error.message);
  }
}

// Run the script
listAllFiles(); 