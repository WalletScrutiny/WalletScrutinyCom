/**
 * Preview tab for markdown content on the new verification form.
 */

import { getMarked, prefetchMarked } from './marked-loader.js';

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
      previewArea.style.height = '';
      previewArea.style.overflowY = '';
      contentArea.style.display = 'block';
      previewArea.style.display = 'none';
    });

    previewTab.addEventListener('mouseenter', prefetchMarked);
  
    // Set up Preview tab click handler
    previewTab.addEventListener('click', async (e) => {
      e.preventDefault();
      previewTab.classList.add('active');
      writeTab.classList.remove('active');

      const editorHeightPx = `${contentArea.offsetHeight}px`;
      previewArea.style.height = editorHeightPx;
      previewArea.style.overflowY = 'auto';

      try {
        const marked = await getMarked();
        previewArea.innerHTML = marked.parse(contentArea.value);
      } catch (error) {
        console.error('Error parsing markdown:', error);
        previewArea.innerHTML = '<p style="color: red;">Error parsing markdown content</p>';
      }

      contentArea.style.display = 'none';
      previewArea.style.display = 'block';
    });

  } catch (error) {
    console.error('Error setting up preview buttons:', error);
  }
}

window.initializePreviewButton = initializePreviewButton;
