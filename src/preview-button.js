/**
 * This module handles the preview button functionality for markdown content
 * It properly imports the marked library from node modules instead of using a CDN
 */

// Import marked from the node modules
import {marked} from 'marked';

/**
 * Initialize the preview button functionality
 * This sets up event listeners for the Write and Preview tabs
 */
export function initializePreviewButton() {
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupPreviewButtons);
  } else {
    // DOM already loaded, set up immediately
    setupPreviewButtons();
  }
}

/**
 * Set up the preview button event listeners
 */
function setupPreviewButtons() {
  try {
    const writeTab = document.getElementById('writeTab');
    const previewTab = document.getElementById('previewTab');
    const contentArea = document.getElementById('content');
    const previewArea = document.getElementById('markdownPreview');
    
    // Only proceed if all required elements exist
    if (!writeTab || !previewTab || !contentArea || !previewArea) {
      console.warn('Preview button elements not found in the DOM');
      return;
    }
    
    // Set up Write tab click handler
    writeTab.addEventListener('click', (e) => {
      e.preventDefault();
      writeTab.classList.add('active');
      previewTab.classList.remove('active');
      contentArea.style.display = 'block';
      previewArea.style.display = 'none';
    });
  
    // Set up Preview tab click handler
    previewTab.addEventListener('click', (e) => {
      e.preventDefault();
      previewTab.classList.add('active');
      writeTab.classList.remove('active');
      contentArea.style.display = 'none';
      
      try {
        // Parse markdown content using the imported marked library
        const markdownText = contentArea.value;
        previewArea.innerHTML = marked.parse(markdownText);
      } catch (error) {
        console.error('Error parsing markdown:', error);
        previewArea.innerHTML = '<p style="color: red;">Error parsing markdown content</p>';
      }
      
      previewArea.style.display = 'block';
    });
    
    console.log('Preview button functionality initialized successfully');
  } catch (error) {
    console.error('Error setting up preview buttons:', error);
  }
}

// Make the function available globally for use in HTML
if (typeof window !== 'undefined') {
  window.initializePreviewButton = initializePreviewButton;
}
