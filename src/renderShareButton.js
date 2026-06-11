(function(){
  function renderShareButton({
    container,
    defaultMessage = "",
    showRawButtons = false,
    showOnLabel = "Share on",
    pulseAttention = false
  }) {
    const el = (typeof container === "string") ? document.querySelector(container) : container;
    if (!el) {
      console.log('renderShareButton: container not found', container);
      return;
    }

    el.classList.add('shareButtonContainer');

    if (!document.getElementById('shareButtonComponentStyles')) {
      const style = document.createElement("style");
      style.id = 'shareButtonComponentStyles';
      style.textContent = `
      .share-nostr-modal {
        display: none;
        position: fixed;
        z-index: 10050;
        left: 0; top: 0; width: 100%; height: 100%;
        background-color: rgba(0,0,0,0.4);
      }
      .share-nostr-modal-content {
        margin: 15% auto; padding: 20px; border: 1px solid #888;
        width: 80%; max-width: 600px; border-radius: 5px;
        background: #e1e1e1;
        color: black;
      }
      body.dark .share-nostr-modal-content {
        background-color: #2d2d2d;
        color: white;
      }

      .shareButtonContainer .dropdown span {
        transform: rotate(0deg);
        -webkit-transform: rotate(0deg);
        -moz-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        -o-transform: rotate(0deg);
      }

      .share-nostr-textarea { width: 100%; height: 8em; margin: 0 0 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
      .share-button { color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
      .share-nostr-close { color: #535353; float: right; font-size: 44px; font-weight: bold; cursor: pointer; margin-top: -23px; }
      .share-nostr-close:hover { color: black; }
      .share-nostr-modal-content h2 { margin-top: 0; margin-bottom: 0; }
      .shareButtonNetwork { text-decoration: none !important; margin-right: 10px; flex: 1; }
      .share-buttons-container { display: flex; flex-direction: row; width: 100%; justify-content: space-between; margin: auto; padding: auto; justify-items: center; }
      .network-text { margin-left: 10px; }
      @media (max-width: 768px) { .network-text { display: none; } }
      #rawShareButtons { flex-direction: row; width: 100%; }
      .shareButtonNetwork img, .shareButtonNetwork i { margin-right: 6px; }
      .shareButtonNetwork svg { font-size: 23px; }
      .shareButtonContainer .dropdown { position: relative; display: inline-block; }
      .shareButtonContainer .share-dropdown-menu {
        display: none;
        position: absolute;
        background-color: #007bff;
        min-width: 275px;
        max-width: 90vw;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 10005;
        border-radius: 4px;
        left: 0;
        right: auto;
        top: 100%;
        margin-top: 2px;
        font-size: 13px;
      }
      .shareButtonContainer .share-dropdown-menu a {
        color: white;
        padding: 10px 16px;
        display: flex;
        align-items: center;
        width: 100%;
        box-sizing: border-box;
        font-size: 25px;
      }
      .shareButtonContainer .share-dropdown-menu a:hover {
        color: white;
        background-color: #0056b3;
        width: 100%;
        border-radius: 4px;
      }
      .shareButtonContainer .share-dropdown-menu.show { display: block; }
      .shareButtonContainer .share-dropdown-menu a img,
      .shareButtonContainer .share-dropdown-menu a i,
      .shareButtonContainer .share-dropdown-menu a span { margin-right: 8px; }
      .shareButtonContainer .share-dropdown-trigger { margin-bottom: 0; }
      @keyframes share-button-pulse {
        0%, 100% {
          background-color: #dc3545;
          border-color: #dc3545;
        }
        20% {
          background-color: #007bff;
          border-color: #007bff;
        }
        70% {
          background-color: #007bff;
          border-color: #007bff;
        }
      }
      .shareButtonContainer .btn-info.share-dropdown-trigger--pulse,
      .shareButtonContainer .btn-info.share-dropdown-trigger--pulse:hover {
        animation: share-button-pulse 2s ease-in-out infinite;
      }
      .shareButtonContainer .share-dropdown-trigger {
        font-family: inherit;
      }
      @media (prefers-reduced-motion: reduce) {
        .shareButtonContainer .share-dropdown-trigger--pulse {
          animation: none;
          background-color: #dc3545;
          border-color: #dc3545;
        }
      }
    `;
      document.head.appendChild(style);
    }

    const nostrButton = `<a href="#" class="btn btn-info shareButtonNetwork js-share-nostr-open"><img src="/images/nostr_logo.svg" style="width:25px;height:25px;margin-right: 0;" alt="Nostr Logo"/><span class="network-text">Share on Nostr</span></a>`;
    const xButton = `<a href="#" class="btn btn-info shareButtonNetwork js-share-x-open"><i class="fa-brands fa-square-x-twitter" aria-hidden="true"></i><span class="network-text">Share on X</span></a>`;
    const fbButton = `<a href="#" class="btn btn-info shareButtonNetwork js-share-fb-open"><i class="fa-brands fa-square-facebook" aria-hidden="true"></i><span class="network-text">Share on Facebook</span></a>`;
    const linkedinButton = `<a href="#" class="btn btn-info shareButtonNetwork js-share-linkedin-open"><i class="fa-brands fa-linkedin" aria-hidden="true"></i><span class="network-text">Share on LinkedIn</span></a>`;
    const copyUrlButton = `<a href="#" class="btn btn-info shareButtonNetwork js-share-copy-url"><i class="fas fa-copy" aria-hidden="true"></i><span class="network-text">Copy current URL</span></a>`;

    const modalHTML = `
      <div class="share-nostr-modal">
        <div class="share-nostr-modal-content">
          <span class="share-nostr-close">&times;</span>
          <h2>Share on Nostr</h2>
          <textarea class="share-nostr-textarea" placeholder="Write your message here..."></textarea>
          <button class="btn btn-success share-button js-share-nostr-submit">Share</button>
        </div>
      </div>
    `;

    let html = "";
    if (showRawButtons) {
      html += `<h4 class="page__share-title">${showOnLabel}</h4><br/><div id="rawShareButtons">${nostrButton} ${xButton} ${fbButton} ${linkedinButton} ${copyUrlButton}</div>`;
    } else {
      const pulseClass = pulseAttention ? ' share-dropdown-trigger--pulse' : '';
      html += `
        <div class="dropdown">
          <button type="button" class="btn btn-info share-dropdown-trigger${pulseClass}"><i class="fas fa-share-alt" style="margin-right:10px; font-size: 18px;"></i>Share</button>
          <div class="share-dropdown-menu">
            ${nostrButton} ${xButton} ${fbButton} ${linkedinButton} ${copyUrlButton}
          </div>
        </div>
      `;
    }
    html += modalHTML;

    el.innerHTML = html;

    const shareModal = el.querySelector(".share-nostr-modal");
    const closeShareModal = el.querySelector(".share-nostr-close");
    const shareSubmitButton = el.querySelector(".js-share-nostr-submit");
    const shareTextarea = el.querySelector(".share-nostr-textarea");
    const shareBtn = el.querySelector(".share-dropdown-trigger");
    const shareDropdown = el.querySelector(".share-dropdown-menu");
    const shareNostrBtn = el.querySelector(".js-share-nostr-open");
    const shareXBtn = el.querySelector(".js-share-x-open");
    const shareFBBtn = el.querySelector(".js-share-fb-open");
    const shareLinkedinBtn = el.querySelector(".js-share-linkedin-open");
    const copyUrlBtn = el.querySelector(".js-share-copy-url");

    const closeShareDropdown = () => {
      if (shareDropdown) {
        shareDropdown.classList.remove("show");
      }
    };

    const openShareNostrModal = () => {
      if (!shareModal || !shareTextarea) {
        return;
      }
      shareTextarea.value = `${defaultMessage}\n\n${window.location.href}`;
      document.body.appendChild(shareModal);
      shareModal.style.display = "block";
      closeShareDropdown();
    };

    const closeShareNostrModal = () => {
      if (shareModal) {
        shareModal.style.display = "none";
      }
    };

    const stopPulseAttention = () => {
      if (shareBtn) {
        shareBtn.classList.remove('share-dropdown-trigger--pulse');
      }
    };

    if (shareBtn && shareDropdown) {
      shareBtn.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        stopPulseAttention();
        shareDropdown.classList.toggle("show");
      };
    }
    if (shareNostrBtn) {
      shareNostrBtn.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        openShareNostrModal();
      };
    }
    if (shareXBtn) {
      shareXBtn.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        const text = encodeURIComponent(`${defaultMessage}\n\n${window.location.href}`);
        window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
        closeShareDropdown();
      };
    }
    if (shareFBBtn) {
      shareFBBtn.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, "_blank");
        closeShareDropdown();
      };
    }
    if (shareLinkedinBtn) {
      shareLinkedinBtn.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        const text = encodeURIComponent(defaultMessage);
        window.open(`https://www.linkedin.com/feed/?shareActive=true&shareUrl=${encodeURIComponent(window.location.href)}&text=${text}`, "_blank");
        closeShareDropdown();
      };
    }
    if (copyUrlBtn) {
      copyUrlBtn.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(window.location.href).then(() => {
          showToast("URL copied to clipboard!", "success");
        }).catch(err => {
          showToast("Failed to copy URL: " + err, "error");
        });
        closeShareDropdown();
      };
    }
    if (closeShareModal) {
      closeShareModal.onclick = function () {
        closeShareNostrModal();
      };
    }
    if (shareModal) {
      shareModal.onclick = function (event) {
        if (event.target === shareModal) {
          closeShareNostrModal();
        }
      };
    }
    if (el._shareClickAwayHandler) {
      window.removeEventListener("click", el._shareClickAwayHandler);
    }
    el._shareClickAwayHandler = function (event) {
      if (!shareDropdown || !shareDropdown.classList.contains("show")) {
        return;
      }
      if (el.contains(event.target)) {
        return;
      }
      shareDropdown.classList.remove("show");
    };
    window.addEventListener("click", el._shareClickAwayHandler);

    if (shareSubmitButton) {
      shareSubmitButton.onclick = async function () {
        const message = shareTextarea.value;
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
        closeShareNostrModal();
      };
    }
  }
  window.renderShareButton = renderShareButton;
})();
