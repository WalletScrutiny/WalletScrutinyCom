import { wsIcon } from './icon.mjs';
import { waitNostr } from 'nip07-awaiter';
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
      /* "Share on Nostr" composer: same dialog language as the opinions
         widget (src/opinions/opinions.css) so both feel like one site. */
      .share-nostr-modal {
        display: none;
        position: fixed;
        inset: 0;
        z-index: 10050;
        align-items: center;
        justify-content: center;
        padding: 1em;
        background: rgba(0, 0, 0, 0.5);
      }
      .share-nostr-modal.is-open { display: flex; }
      .share-nostr-modal-content {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 0.75em;
        width: 100%;
        max-width: 560px;
        max-height: 90vh;
        overflow: auto;
        padding: 1.5em;
        border-radius: 8px;
        background: var(--body);
        color: var(--text);
        box-shadow: 0 10px 30px var(--shadow-3);
        text-align: left;
      }
      .share-nostr-title {
        display: flex;
        align-items: center;
        gap: 0.5em;
        margin: 0 1.5em 0 0;
        font-size: 1.25em;
        line-height: 1.3;
      }
      /* The Nostr mark is white; give it an accent tile so it reads on both themes. */
      .share-nostr-title__logo {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        width: 1.6em;
        height: 1.6em;
        border-radius: 6px;
        background: var(--accent);
      }
      .share-nostr-title__logo img { width: 1.1em; height: 1.1em; margin: 0; }
      .share-nostr-hint {
        margin: 0;
        color: var(--neutral-3);
        font-size: 0.9em;
      }
      .share-nostr-textarea {
        box-sizing: border-box;
        width: 100%;
        min-height: 9em;
        margin: 0;
        padding: 0.6em;
        border: 1px solid var(--neutral-5);
        border-radius: 6px;
        background: var(--body);
        color: var(--text);
        font: inherit;
        line-height: 1.5;
        resize: vertical;
      }
      .share-nostr-textarea:focus {
        outline: none;
        border-color: var(--accent);
        box-shadow: 0 0 0 2px var(--accent-50);
      }
      .share-nostr-actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 0.5em;
      }
      .share-nostr-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.4em;
        padding: 0.55em 1.2em;
        border: 1px solid var(--neutral-5);
        border-radius: 6px;
        background: var(--body);
        color: var(--text);
        font: inherit;
        font-weight: 500;
        cursor: pointer;
      }
      .share-nostr-btn:hover:not(:disabled) { border-color: var(--neutral-4); }
      .share-nostr-btn--primary {
        background: var(--accent);
        border-color: var(--accent);
        color: var(--permanent-white);
      }
      .share-nostr-btn--primary:hover:not(:disabled) { filter: brightness(1.08); }
      .share-nostr-btn:disabled { opacity: 0.6; cursor: default; }
      .share-nostr-btn.is-busy { position: relative; color: transparent; }
      .share-nostr-btn.is-busy::after {
        content: '';
        position: absolute;
        width: 1em;
        height: 1em;
        border: 2px solid var(--permanent-white);
        border-right-color: transparent;
        border-radius: 50%;
        animation: share-nostr-spin 0.8s linear infinite;
      }
      @keyframes share-nostr-spin { to { transform: rotate(360deg); } }
      .share-nostr-close {
        position: absolute;
        top: 0.75em;
        right: 0.75em;
        padding: 0.25em;
        border: none;
        background: none;
        color: var(--neutral-3);
        font-size: 1.25em;
        line-height: 1;
        cursor: pointer;
      }
      .share-nostr-close:hover { color: var(--text); }

      .shareButtonContainer .dropdown span {
        transform: rotate(0deg);
        -webkit-transform: rotate(0deg);
        -moz-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        -o-transform: rotate(0deg);
      }

      .shareButtonContainer:has(#rawShareButtons) {
        display: block !important;
        width: 100%;
      }
      .shareButtonNetwork {
        text-decoration: none !important;
        margin-right: 0;
        flex: 1 1 0;
        min-width: 0;
        display: inline-flex;
        align-items: center;
        box-sizing: border-box;
      }
      #rawShareButtons .shareButtonNetwork {
        justify-content: center;
      }
      /* The page buttons: the same outlined look as the verification modal
         toolbar (_sass/_verifications.scss), on the page's own background. */
      #rawShareButtons .shareButtonNetwork.btn {
        border: 1px solid var(--neutral-4) !important;
        border-radius: 6px;
        background: transparent;
        color: var(--text) !important;
        font-weight: normal;
      }
      #rawShareButtons .shareButtonNetwork.btn:hover,
      #rawShareButtons .shareButtonNetwork.btn:focus-visible {
        border-color: var(--accent) !important;
        background: var(--accent-50);
        color: var(--accent-text) !important;
        outline: none;
      }
      /* The Nostr mark is white; darken it to match the other icons (dark mode keeps it white). */
      #rawShareButtons .shareButtonNetwork img { filter: brightness(0); }
      body.dark #rawShareButtons .shareButtonNetwork img { filter: none; }
      .share-buttons-container { display: flex; flex-direction: row; width: 100%; justify-content: space-between; margin: auto; padding: auto; justify-items: center; }
      .network-text { margin-left: 10px; }
      #rawShareButtons {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        width: 100%;
        gap: 8px;
        box-sizing: border-box;
      }
      .shareButtonNetwork img, .shareButtonNetwork i { margin-right: 6px; }
      .shareButtonNetwork svg { font-size: 23px; }
      @media (max-width: 768px) {
        .network-text { display: none; }
        #rawShareButtons { gap: 6px; }
        .shareButtonNetwork.btn {
          padding: 8px 4px;
        }
        .shareButtonNetwork img,
        .shareButtonNetwork i,
        .shareButtonNetwork svg {
          margin-right: 0;
        }
        .shareButtonNetwork img {
          width: 22px;
          height: 22px;
        }
        .shareButtonNetwork svg {
          font-size: 20px;
        }
      }
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
        justify-content: flex-start;
        text-align: left;
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
    const xButton = `<a href="#" class="btn btn-info shareButtonNetwork js-share-x-open">${wsIcon('square-x-twitter')}<span class="network-text">Share on X</span></a>`;
    const fbButton = `<a href="#" class="btn btn-info shareButtonNetwork js-share-fb-open">${wsIcon('square-facebook')}<span class="network-text">Share on Facebook</span></a>`;
    const linkedinButton = `<a href="#" class="btn btn-info shareButtonNetwork js-share-linkedin-open">${wsIcon('linkedin')}<span class="network-text">Share on LinkedIn</span></a>`;
    const copyUrlButton = `<a href="#" class="btn btn-info shareButtonNetwork js-share-copy-url">${wsIcon('copy')}<span class="network-text">Copy current URL</span></a>`;

    const modalHTML = `
      <div class="share-nostr-modal" role="dialog" aria-modal="true" aria-label="Share on Nostr">
        <div class="share-nostr-modal-content">
          <button type="button" class="share-nostr-close" aria-label="Close">${wsIcon('xmark')}</button>
          <h3 class="share-nostr-title"><span class="share-nostr-title__logo"><img src="/images/nostr_logo.svg" alt=""/></span>Share on Nostr</h3>
          <p class="share-nostr-hint">Posted as a public note from your Nostr account.</p>
          <textarea class="share-nostr-textarea" rows="6" placeholder="Write your message here..." aria-label="Note text"></textarea>
          <div class="share-nostr-actions">
            <button type="button" class="share-nostr-btn js-share-nostr-cancel">Cancel</button>
            <button type="button" class="share-nostr-btn share-nostr-btn--primary js-share-nostr-submit">${wsIcon('share-nodes')}Share</button>
          </div>
        </div>
      </div>
    `;

    let html = "";
    if (showRawButtons) {
      const labelHtml = showOnLabel
        ? `<h4 class="page__share-title">${showOnLabel}</h4>`
        : "";
      html += `${labelHtml}<div id="rawShareButtons">${nostrButton} ${xButton} ${fbButton} ${linkedinButton} ${copyUrlButton}</div>`;
    } else {
      const pulseClass = pulseAttention ? ' share-dropdown-trigger--pulse' : '';
      html += `
        <div class="dropdown">
          <button type="button" class="btn btn-info share-dropdown-trigger${pulseClass}">${wsIcon('share-nodes', '', 'margin-right:10px; font-size: 18px;')}Share ${wsIcon('caret-down')}</button>
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
    const shareCancelButton = el.querySelector(".js-share-nostr-cancel");
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
      shareModal.classList.add("is-open");
      closeShareDropdown();
      shareTextarea.focus();
      shareTextarea.setSelectionRange(0, 0);
      shareTextarea.scrollTop = 0;
    };

    const closeShareNostrModal = () => {
      if (shareModal) {
        shareModal.classList.remove("is-open");
      }
    };

    const setShareBusy = (busy) => {
      if (!shareSubmitButton) {
        return;
      }
      shareSubmitButton.disabled = busy;
      shareSubmitButton.classList.toggle("is-busy", busy);
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
      // Sharing on Nostr signs with the browser extension (NIP-07), so the
      // entry only shows once one is detected. Same wait as the opinions
      // widget (src/opinions/auth.mjs): extensions inject window.nostr late.
      shareNostrBtn.style.display = "none";
      waitNostr(3125).then((nostr) => {
        if (nostr) {
          shareNostrBtn.style.display = "";
        }
      });
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
    if (shareCancelButton) {
      shareCancelButton.onclick = function () {
        closeShareNostrModal();
      };
    }
    if (shareTextarea) {
      // Ctrl/Cmd+Enter submits, like most composers.
      shareTextarea.onkeydown = function (event) {
        if (event.key === "Enter" && (event.ctrlKey || event.metaKey) && shareSubmitButton && !shareSubmitButton.disabled) {
          event.preventDefault();
          shareSubmitButton.click();
        }
      };
    }
    if (shareModal) {
      shareModal.onclick = function (event) {
        if (event.target === shareModal) {
          closeShareNostrModal();
        }
      };
    }
    if (el._shareKeydownHandler) {
      window.removeEventListener("keydown", el._shareKeydownHandler, true);
    }
    // Capture phase + stopPropagation: an open overlay consumes Escape so the
    // verification modal underneath stays open.
    el._shareKeydownHandler = function (event) {
      if (event.key === "Escape" && shareModal && shareModal.classList.contains("is-open")) {
        event.stopPropagation();
        closeShareNostrModal();
      }
    };
    window.addEventListener("keydown", el._shareKeydownHandler, true);
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
        setShareBusy(true);
        try {
          const noteId = await createNostrNote(message);
          showToast(
            'Note shared successfully!<br>See at <a style="color: black;" target="_blank" href="https://njump.me/' +
              noteId +
              '">Njump.me</a>.',
            "success",
            7000
          );
          closeShareNostrModal();
        } catch (error) {
          // Keep the dialog (and the user's text) open so they can retry.
          showToast("Error sharing note: " + error.message, "error");
        } finally {
          setShareBusy(false);
        }
      };
    }
  }
  window.renderShareButton = renderShareButton;
})();
