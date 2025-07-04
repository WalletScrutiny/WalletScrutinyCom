import { verificationKind, mainRelayUrl, codeSnippetKind } from "./nostr-constants.mjs";
import { getFirstTagValue } from "./verifications_common.mjs";

export function formatDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString(navigator.language, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

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

export function getStatusIcon(status) {
  return status === 'reproducible' ? '✅' : '❌';
}

export function getStatusText(status, short = false) {
  switch (status) {
    case 'reproducible':
      return short ? 'Reproducible' : 'The application was successfully reproduced';
    case 'not_reproducible':
      return short ? 'Not Reproducible' : 'The application could not be reproduced';
    case 'ftbfs':
      return short ? 'Failed to Build from Source' : 'The application failed to build from source';
    case 'spam':
      return short ? 'Spam' : 'The application is spam';
    case 'notag':
      return short ? 'No git revision' : 'The application has no git revision';
    case 'nosource':
      return short ? 'No source' : 'The application has no sources available';
    case 'obfuscated':
      return short ? 'Obfuscated' : 'The application\'s source code is obfuscated';
    case 'warning':
      return short ? 'Warning' : 'The application\'s source code is a warning';
    default:
      return 'Unknown';
  }
}

function getIssueTrackerInfoFromVerificationsInformation(verificationsInformation) {
  const issueTrackerInfo = [];

  verificationsInformation.forEach(verificationsArrayForThisHash => {
    verificationsArrayForThisHash.forEach(verification => {
      const issueTrackerUrl = getFirstTagValue(verification, 'issue-tracker-url');
      if (issueTrackerUrl) {
        const version = getFirstTagValue(verification, 'version');
        const createdAt = verification.created_at;
        
        issueTrackerInfo.push({ issueTrackerUrl, version, createdAt });
      }
    });
  });

  issueTrackerInfo.sort((a, b) => b.createdAt - a.createdAt);

  return issueTrackerInfo;
}

export function showIssueTrackerHtmlWidget(verificationsInformation, htmlElementId, onlyFirstNumberOfIssues = 3) {
  let issueTrackerInfo = getIssueTrackerInfoFromVerificationsInformation(verificationsInformation);

  issueTrackerInfo = issueTrackerInfo.slice(0, onlyFirstNumberOfIssues);

  if (issueTrackerInfo.length > 0) {
    const issueTrackerContainer = document.createElement('div');
    issueTrackerContainer.className = 'issue-tracker-container';
    issueTrackerContainer.innerHTML = `
      <p>Issue Tracker Info</p>
      <small>Issues opened by verifiers while reproducing different versions. Most recent first. Check before starting a new verification.</small>
      <ul>
        ${issueTrackerInfo.map(info => `<li>${formatDate(info.createdAt)} - ${info.version} - <a href="${info.issueTrackerUrl}" target="_blank">${info.issueTrackerUrl}</a></li>`).join('')}
      </ul>`;

    document.getElementById(htmlElementId).appendChild(issueTrackerContainer);
  }
}
window.showIssueTrackerHtmlWidget = showIssueTrackerHtmlWidget;

window.showMoreRows = function() {
  const hiddenRows = document.querySelectorAll('tr[style="display: none;"]');
  hiddenRows.forEach(row => row.style.display = 'table-row');
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