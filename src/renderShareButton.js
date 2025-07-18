(function(){
  function renderShareButton({
    container,
    defaultMessage = "",
    showRawButtons = false,
    showOnLabel = "Share on"
  }) {
    // Helper to get container element
    const el = (typeof container === "string") ? document.querySelector(container) : container;
    if (!el) throw new Error("Container not found");
    // Remove any previous instance
    if (el._shareButtonRendered) return;
    el._shareButtonRendered = true;
    // CSS
    const style = document.createElement("style");
    style.textContent = `
      #shareModal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0; top: 0; width: 100%; height: 100%;
        background-color: rgba(0,0,0,0.4);
      }
      #share-modal-content {
        margin: 15% auto; padding: 20px; border: 1px solid #888;
        width: 80%; max-width: 600px; border-radius: 5px;
        background: #e1e1e1;
        color: black;
      }
      body.dark #share-modal-content {
        background-color: #2d2d2d;
        color: white;
      }

      #shareButtonContainer .dropdown span {
        transform: rotate(0deg);
        -webkit-transform: rotate(0deg);
        -moz-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        -o-transform: rotate(0deg);
      }

      #shareTextarea { width: 100%; height: 8em; margin: 0 0 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
      .share-button { color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
      .close { color: #535353; float: right; font-size: 44px; font-weight: bold; cursor: pointer; margin-top: -23px; }
      .close:hover { color: black; }
      #share-modal-content h2 { margin-top: 0; margin-bottom: 0; }
      .shareButtonNetwork { text-decoration: none !important; margin-right: 10px; flex: 1; }
      .share-buttons-container { display: flex; flex-direction: row; width: 100%; justify-content: space-between; margin: auto; padding: auto; justify-items: center; }
      .network-text { margin-left: 10px; }
      @media (max-width: 768px) { .network-text { display: none; } }
      #rawShareButtons { flex-direction: row; width: 100%; }
      .shareButtonNetwork img, .shareButtonNetwork i { margin-right: 6px; }
      .shareButtonNetwork svg { font-size: 23px; }
      .dropdown { position: relative; display: inline-block; }
      .dropdown-content { display: none; position: absolute; background-color: #007bff; min-width: 275px; max-width: 90vw; box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2); z-index: 1000; border-radius: 4px; left: 0; right: auto; top: 100%; margin-top: 2px; font-size: 13px; }
      .dropdown-content a { color: white; padding: 10px 16px; display: flex; align-items: center; width: 100%; box-sizing: border-box; font-size: 25px; }
      .dropdown-content a:hover { color: white; background-color: #0056b3; width: 100%; border-radius: 4px; }
      .show { display: block; }
      .dropdown-content a img, .dropdown-content a i, .dropdown-content a span { margin-right: 8px; }
      #shareBtn { margin-bottom: 0; }
    `;
    document.head.appendChild(style);
    // HTML for buttons
    const nostrButton = `<a href="#" id="shareNostrBtn" class="btn btn-info shareButtonNetwork"><img src="/images/nostr_logo.svg" style="width:24px;height:24px;vertical-align:middle;margin-right: 0;" alt="Nostr Logo"/><span class="network-text">Share on Nostr</span></a>`;
    const xButton = `<a href="#" id="shareXBtn" class="btn btn-info shareButtonNetwork"><i class="fa-brands fa-x-twitter" style="vertical-align:middle" aria-hidden="true"></i><span class="network-text">Share on X</span></a>`;
    const fbButton = `<a href="#" id="shareFBBtn" class="btn btn-info shareButtonNetwork"><i class="fa-brands fa-square-facebook" style="vertical-align:middle" aria-hidden="true"></i><span class="network-text">Share on Facebook</span></a>`;
    const linkedinButton = `<a href="#" id="shareLinkedinBtn" class="btn btn-info shareButtonNetwork"><i class="fa-brands fa-linkedin" style="vertical-align:middle" aria-hidden="true"></i><span class="network-text">Share on LinkedIn</span></a>`;
    const copyUrlButton = `<a href="#" id="copyUrlBtn" class="btn btn-info shareButtonNetwork"><i class="fas fa-copy" style="vertical-align:middle" aria-hidden="true"></i><span class="network-text">Copy current URL</span></a>`;
    // Modal HTML
    const modalHTML = `
      <div id="shareModal">
        <div id="share-modal-content">
          <span class="close" id="closeShareModal">&times;</span>
          <h2>Share on Nostr</h2>
          <textarea id="shareTextarea" placeholder="Write your message here..."></textarea>
          <button class="btn btn-success share-button" id="shareButton">Share</button>
        </div>
      </div>
    `;
    // Main HTML
    let html = "";
    if (showRawButtons) {
      html += `<h4 class="page__share-title">${showOnLabel}</h4><br/><div id="rawShareButtons">${nostrButton} ${xButton} ${fbButton} ${linkedinButton} ${copyUrlButton}</div>`;
    } else {
      html += `
        <div class="dropdown">
          <a href="#" id="shareBtn" class="btn btn-info"><i class="fas fa-share-alt" style="margin-right:10px;"></i>Share</a>
          <div id="shareDropdown" class="dropdown-content">
            ${nostrButton} ${xButton} ${fbButton} ${linkedinButton} ${copyUrlButton}
          </div>
        </div>
      `;
    }
    html += modalHTML;
    // Render
    el.innerHTML = html;
    // Event handlers
    const shareModal = el.querySelector("#shareModal");
    const shareModalContent = el.querySelector("#share-modal-content");
    const closeShareModal = el.querySelector("#closeShareModal");
    const shareButton = el.querySelector("#shareButton");
    const shareBtn = el.querySelector("#shareBtn");
    const shareDropdown = el.querySelector("#shareDropdown");
    const copyUrlBtn = el.querySelector("#copyUrlBtn");
    const shareNostrBtn = el.querySelector("#shareNostrBtn");
    const shareXBtn = el.querySelector("#shareXBtn");
    const shareFBBtn = el.querySelector("#shareFBBtn");
    const shareLinkedinBtn = el.querySelector("#shareLinkedinBtn");

    if (shareBtn && shareDropdown) {
      shareBtn.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        shareDropdown.classList.toggle("show");
      };
    }
    if (shareNostrBtn) {
      shareNostrBtn.onclick = function (e) {
        e.preventDefault();
        el.querySelector("#shareTextarea").value = `${defaultMessage}\n\n${window.location.href}`;
        shareModal.style.display = "block";
        if (shareDropdown) shareDropdown.classList.remove("show");
      };
    }
    if (shareXBtn) {
      shareXBtn.onclick = function (e) {
        e.preventDefault();
        const text = encodeURIComponent(`${defaultMessage}\n\n${window.location.href}`);
        window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
        if (shareDropdown) shareDropdown.classList.remove("show");
      };
    }
    if (shareFBBtn) {
      shareFBBtn.onclick = function (e) {
        e.preventDefault();
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, "_blank");
        if (shareDropdown) shareDropdown.classList.remove("show");
      };
    }
    if (shareLinkedinBtn) {
      shareLinkedinBtn.onclick = function (e) {
        e.preventDefault();
        const text = encodeURIComponent(defaultMessage);
        window.open(`https://www.linkedin.com/feed/?shareActive=true&shareUrl=${encodeURIComponent(window.location.href)}&text=${text}`, "_blank");
        if (shareDropdown) shareDropdown.classList.remove("show");
      };
    }
    if (copyUrlBtn) {
      copyUrlBtn.onclick = function (e) {
        e.preventDefault();
        navigator.clipboard.writeText(window.location.href).then(() => {
          showToast("URL copied to clipboard!", "success");
        }).catch(err => {
          showToast("Failed to copy URL: " + err, "error");
        });
        if (shareDropdown) shareDropdown.classList.remove("show");
      };
    }
    if (closeShareModal) {
      closeShareModal.onclick = function () {
        shareModal.style.display = "none";
      };
    }
    window.addEventListener("click", function (event) {
      if (shareDropdown && !event.target.matches("#shareBtn")) {
        if (shareDropdown.classList.contains("show")) {
          shareDropdown.classList.remove("show");
        }
      }
      if (event.target === shareModal) {
        shareModal.style.display = "none";
      }
    });
    if (shareButton) {
      shareButton.onclick = async function () {
        const message = el.querySelector("#shareTextarea").value;
        try {
          const noteId = await createNostrNote(message);
          showToast(
            'Note shared successfully!<br>See at <a style="color: black;" target="_blank" href="https://njump.me/' +
              noteId +
              '">Njump.me</a>.',
            "success",
            7000
          );
        } catch (error) {
          showToast("Error sharing note: " + error.message, "error");
        }
        shareModal.style.display = "none";
      };
    }
  }
  window.renderShareButton = renderShareButton;
})();
