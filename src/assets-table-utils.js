import { verificationKind, mainRelayUrl } from "./nostr-constants.mjs";

window.openEventInNjump = function(eventId) {
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

window.copyNostrEmbedToClipboard = function(eventId) {
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

window.copyRawEventJsonToClipboard = function() {
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

window.copyLinkToVerificationToClipboard = () => {
  navigator.clipboard.writeText(window.location.href)
    .then(() => showToast('Link copied to clipboard'))
    .catch(err => {
      console.error('Failed to copy link: ', err);
      showToast('Failed to copy link', 'error');
    });
};