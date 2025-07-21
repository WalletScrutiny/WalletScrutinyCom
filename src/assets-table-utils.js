import { verificationKind, mainRelayUrl, codeSnippetKind } from "./nostr-constants.mjs";
import { getFirstTagValue } from "./verifications_common.mjs";

export function formatDate(timestamp, short = false) {
  return new Date(timestamp * 1000).toLocaleDateString(navigator.language, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(short ? {} : { hour: '2-digit', minute: '2-digit' })
  });
}

export function formatCommentDate(timestamp) {
  const now = new Date().getTime() / 1000;
  const diffInSeconds = now - timestamp;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  // For very recent comments (less than 1 hour), show minutes
  if (diffInMinutes < 60) {
    if (diffInMinutes < 1) {
      return 'Just now';
    }
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  // For recent comments (less than 24 hours), show hours
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  // For comments within a week, show days
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  // For comments within a month, show weeks
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }
  
  // For comments within a year, show months
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }
  
  // For older comments, show years
  if (diffInYears > 0) {
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  }
  
  // Fallback: show absolute date
  return formatDate(timestamp, true);
}
window.formatCommentDate = formatCommentDate;

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