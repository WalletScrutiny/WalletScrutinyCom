import { verificationKind, mainRelayUrl, codeSnippetKind } from "./nostr-constants.mjs";

// Utility functions for handling tags
export function getFirstTagValue(event, tagName, valueIfNull = '') {
  return event.tags.find(tag => tag[0] === tagName)?.[1] ?? valueIfNull;
}

// Utility function for formatting dates
export function formatDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString(navigator.language, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Utility function for handling attachments
export function getAttachmentInfo(attachment) {
  let name;
  if (attachment.kind === codeSnippetKind) {
    const attachmentName = getFirstTagValue(attachment, 'name');
    const extension = getFirstTagValue(attachment, 'extension');
    name = `${attachmentName}.${extension}`;
  } else {
    name = getFirstTagValue(attachment, 'filename');
  }
  const size = getFirstTagValue(attachment, 'size');
  const sizeInKb = Math.round(size / 1024);

  return {
    name,
    sizeInKb
  };
}

// Utility function for handling verification status
export function getStatusIcon(status) {
  return status === 'reproducible' ? '✅' : '❌';
}

// Utility function for handling verification status text
export function getStatusText(status, short = false) {
  switch (status) {
    case 'reproducible':
      return short ? 'Reproducible' : 'The application was successfully reproduced';
    case 'not_reproducible':
      return short ? 'Not Reproducible' : 'The application could not be reproduced';
    case 'not_tested':
      return short ? 'Not Tested' : 'The application has not been tested yet';
    default:
      return short ? 'Unknown' : 'Unknown status';
  }
}

window.showMoreRows = function() {
  const hiddenRows = document.querySelectorAll('.hidden-row');
  hiddenRows.forEach(row => row.classList.remove('hidden-row'));
  document.getElementById('show-more-row').remove();
};

///////////////////////////////////////////////////////////////////////
// NOSTR ACTIONS
///////////////////////////////////////////////////////////////////////
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