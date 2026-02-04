import { verificationKind, mainRelayUrl } from "./nostr-constants.mjs";

(function(){
  function renderNostrButton({
    container,
    verificationId
  }) {
    // Helper to get container element
    const el = (typeof container === "string") ? document.querySelector(container) : container;
    if (!el) {
      console.log('renderNostrButton: container not found', container);
      return;
    }

    // Remove any previous instance
    if (el._nostrButtonRendered) return;
    el._nostrButtonRendered = true;

    const style = document.createElement("style");
    style.textContent = `
      #nostrButtonContainer .dropdown { position: relative; display: inline-block; }
      #nostrButtonContainer .dropdown-content2 { display: none; position: absolute; background-color: #007bff; min-width: 220px; max-width: 90vw; box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2); z-index: 1000; border-radius: 4px; left: 0; right: auto; top: 100%; margin-top: 2px; font-size: 13px; }
      #nostrButtonContainer .dropdown-content2 button { color: white; background: none; border: none; padding: 10px 16px; display: flex; align-items: center; width: 100%; box-sizing: border-box; font-size: 16px; cursor: pointer; text-align: left; }
      #nostrButtonContainer .dropdown-content2 button:hover { background-color: #0056b3; border-radius: 4px; }
      #nostrBtn { margin-bottom: 0; }
      #nostrBtn img { height: 18px; }
      #nostrButtonContainer .dropdown .btn-text { display: inline; font-weight: inherit; font-size: inherit; line-height: inherit; padding: 0; transform: none; -webkit-transform: none; -moz-transform: none; -ms-transform: none; -o-transform: none; }
      #nostrButtonContainer .dropdown-content2.show { display: block; }
    `;
    document.head.appendChild(style);

    let html = `
      <div class="dropdown">
        <button id="nostrBtn" class="btn btn-info"><img src="/images/nostr_logo.svg" alt="Nostr Logo"/><span class="btn-text">Nostr</span></button>
        <div id="nostrDropdown" class="dropdown-content2">
          <button id="openNjumpBtn" type="button">Open in Njump.me</button>
          <button id="copyEmbedBtn" type="button">Copy Nostr embed code</button>
          <button id="copyRawBtn" type="button">Copy raw event</button>
        </div>
      </div>
    `;
    el.innerHTML = html;
    el.id = 'nostrButtonContainer';

    const nostrBtn = el.querySelector("#nostrBtn");
    const nostrDropdown = el.querySelector("#nostrDropdown");
    const openNjumpBtn = el.querySelector("#openNjumpBtn");
    const copyEmbedBtn = el.querySelector("#copyEmbedBtn");
    const copyRawBtn = el.querySelector("#copyRawBtn");
    nostrBtn.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      nostrDropdown.classList.toggle("show");
    };

    openNjumpBtn.onclick = function (e) {
      e.preventDefault();
      openEventInNjump(verificationId);
      nostrDropdown.classList.remove("show");
    };

    copyEmbedBtn.onclick = function (e) {
      e.preventDefault();
      copyNostrEmbedToClipboard(verificationId);
      nostrDropdown.classList.remove("show");
    };

    copyRawBtn.onclick = function (e) {
      e.preventDefault();
      copyRawEventJsonToClipboard();
      nostrDropdown.classList.remove("show");
    };


    // Close dropdown when clicking outside
    window.addEventListener("click", function (event) {
      if (nostrDropdown && !event.target.matches("#nostrBtn") && nostrDropdown.classList.contains("show")) {
        nostrDropdown.classList.remove("show");
      }
    });
  }
  window.renderNostrButton = renderNostrButton;
})();

function openEventInNjump(eventId) {
  try {
    // Create a nevent string using NIP-19 format
    const nevent = window.nip19.neventEncode({
      id: eventId,
      kind: verificationKind,
      relays: [mainRelayUrl]
    });
    
    // Open in njump.me
    window.open(`https://njump.me/${nevent}`, '_blank');
  } catch (error) {
    console.error('Error opening in njump:', error);
    showToast('Failed to open in njump', 'error');
  }
};

function copyNostrEmbedToClipboard(eventId) {
  try {
    // Create a nevent string using NIP-19 format
    const nevent = window.nip19.neventEncode({
      id: eventId,
      kind: verificationKind,
      relays: [mainRelayUrl]
    });
    
    navigator.clipboard.writeText(`nostr:${nevent}`).then(() => {
      showToast('Nostr embed code copied to clipboard', 'success');
    });
  } catch (error) {
    console.error('Error copying Nostr embed code:', error);
    showToast('Failed to copy Nostr embed code', 'error');
  }
};

function copyRawEventJsonToClipboard() {
  try {
    if (!window.currentVerification) {
      throw new Error('No verification found');
    }
    
    // Create a simplified object without circular references
    const cleanEvent = {
      id: window.currentVerification.id,
      pubkey: window.currentVerification.pubkey,
      created_at: window.currentVerification.created_at,
      kind: window.currentVerification.kind,
      tags: window.currentVerification.tags,
      content: window.currentVerification.content,
      sig: window.currentVerification.sig
    };

    // Format the JSON for better readability
    const prettyJson = JSON.stringify(cleanEvent, null, 2);
    
    navigator.clipboard.writeText(prettyJson).then(() => {
      showToast('Raw event copied to clipboard', 'success');
    });
  } catch (error) {
    console.error('Error copying raw event:', error);
    showToast('Failed to copy raw event', 'error');
  }
};