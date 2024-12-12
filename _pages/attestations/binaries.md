---
layout: archive
title: "Latest Assets"
permalink: /binaries/
---

<style>
  .markdown-content {
    padding: 0;
    overflow-wrap: break-word;
  }
  .markdown-content code {
    background-color: rgba(0,0,0,0.05);
    padding: 2px 4px;
    border-radius: 3px;
  }
  .markdown-content pre {
    background-color: rgba(0,0,0,0.05);
    padding: 10px;
    border-radius: 5px;
    overflow-x: auto;
  }
  .markdown-content img {
    max-width: 100%;
  }
  
  .spinner {
    border: 8px solid rgba(0, 0, 0, 0.1);
    border-top: 8px solid #3498db;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .profile-card {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0;
    cursor: pointer;
  }
  .profile-image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
  .profile-info {
    display: flex;
    flex-direction: column;
  }
  .profile-nip05 {
    font-size: 0.9em;
    color: #666;
  }
  #attestationContent p {
    margin-top: 0.4em;
    margin-bottom: 0em;
  }

  thead {
    background-color: #f5f5f5;
  }
  body.dark thead {
    background-color: #656565;
  }
</style>

<div id="binariesTable"></div>

<div id="attestationModal" style="display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); padding:20px; padding-top:5px; border:1px solid var(--border-color); z-index:1000;" class="modal-theme">
  <span id="closeModal" style="cursor:pointer; position:absolute; top:10px; right:10px; font-size: 24px;">&times;</span>
  <div id="attestationContent"></div>
</div>

<div id="loadingSpinner" style="display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); z-index:1000;">
  <div class="spinner"></div>
</div>

<script src="{{'/dist/attestation.bundle.min.js' | relative_url }}"></script>
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

<script>
  (async () => {
    document.getElementById('loadingSpinner').style.display = 'block';

    await renderAssetsTable('binariesTable');

    document.getElementById('loadingSpinner').style.display = 'none';

    document.getElementById('closeModal').onclick = function() {
      document.getElementById('attestationModal').style.display = 'none';
    };
  })();
</script>