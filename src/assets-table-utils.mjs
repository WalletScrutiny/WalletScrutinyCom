import { codeSnippetKind } from "./nostr-constants.mjs";
import { getFirstTagValue, getStatusText } from "./verifications_common.mjs";
import { formatDate } from "./format-utils.mjs";
import { updateTableVisibility } from "./assets-table-filters.mjs";
import { el, sanitizeHttpUrl } from "./html-utils.mjs";

export { getStatusText };

export function formatZapAmount(amount) {
  if (amount >= 1000000) {
    return `${(amount/1000000)}M`;
  } else if (amount >= 1000) {
    return `${(amount/1000)}K`;
  } else {
    return `${amount}`;
  }
}
window.formatZapAmount = formatZapAmount;

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

function isGitHubUrl(url) {
  return url.includes('github.com') && (url.includes('/issue'));
}

function extractGitHubIssueInfo(url) {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/(?:issues?)\/(\d+)/);
  if (match) {
    return {
      owner: match[1],
      repo: match[2],
      number: match[3]
    };
  }
  return null;
}

function extractIssueNumberFromUrl(url) {
  try {
    const segments = new URL(url).pathname.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    return /^\d+$/.test(lastSegment) ? lastSegment : null;
  } catch {
    return null;
  }
}

function getIssueTrackerLinkLabel(url) {
  const issueNumber = extractIssueNumberFromUrl(url);
  return issueNumber ? `Issue #${issueNumber}` : url;
}

async function getGitHubIssueStatus(issueInfo) {
  try {
    const url = `https://api.github.com/repos/${issueInfo.owner}/${issueInfo.repo}/issues/${issueInfo.number}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      state: data.state,
      title: data.title,
      html_url: data.html_url,
      created_at: data.created_at,
      updated_at: data.updated_at,
      closed_at: data.closed_at
    };
  } catch (error) {
    console.error('❌ Error fetching GitHub issue status:', error);
    return null;
  }
}

function getIssueTrackerInfoFromVerificationsInformation(verificationsInformation) {
  const issueTrackerInfo = [];

  verificationsInformation.forEach((verificationsArrayForThisHash, hashIndex) => {
    verificationsArrayForThisHash.forEach((verification, verificationIndex) => {
      const issueTrackerUrl = getFirstTagValue(verification, 'issue-tracker-url');
      if (issueTrackerUrl) {
        const version = getFirstTagValue(verification, 'version');
        const createdAt = verification.created_at;

        const issueAlreadyPushed = issueTrackerInfo.find(info => info.issueTrackerUrl === issueTrackerUrl);
        if (issueAlreadyPushed) {
          if (issueAlreadyPushed.createdAt < createdAt) {
            issueAlreadyPushed.createdAt = createdAt;
          }
        } else {
          issueTrackerInfo.push({ issueTrackerUrl, version, createdAt });
        }
      }
    });
  });

  issueTrackerInfo.sort((a, b) => b.createdAt - a.createdAt);

  return issueTrackerInfo;
}

export async function showIssueTrackerHtmlWidget(verificationsInformation, htmlElementId, onlyFirstNumberOfIssues = 3) {
  const issueTrackerInfo = getIssueTrackerInfoFromVerificationsInformation(verificationsInformation);

  const githubStatusByUrl = new Map();
  await Promise.all(
    issueTrackerInfo
      .filter((info) => isGitHubUrl(info.issueTrackerUrl))
      .map(async (info) => {
        const issueInfo = extractGitHubIssueInfo(info.issueTrackerUrl);
        if (issueInfo) {
          githubStatusByUrl.set(info.issueTrackerUrl, await getGitHubIssueStatus(issueInfo));
        }
      }),
  );

  const openIssues = [];
  const nonGitHubIssues = [];

  for (const info of issueTrackerInfo) {
    if (isGitHubUrl(info.issueTrackerUrl)) {
      const issueInfo = extractGitHubIssueInfo(info.issueTrackerUrl);
      const status = githubStatusByUrl.get(info.issueTrackerUrl) ?? null;
      if (!issueInfo || !status || status.state === 'open') {
        openIssues.push({ ...info, status });
      }
    } else {
      nonGitHubIssues.push(info);
    }
  }

  // Combine open GitHub issues with non-GitHub issues, prioritizing open GitHub issues
  const filteredIssues = [...openIssues, ...nonGitHubIssues].slice(0, onlyFirstNumberOfIssues);

  if (filteredIssues.length > 0) {
    const issueTrackerContainer = document.createElement('div');
    issueTrackerContainer.className = 'issue-tracker-container';

    const list = el('ul', { id: 'issue-tracker-list' });
    filteredIssues.forEach((info, index) => {
      const safeUrl = sanitizeHttpUrl(info.issueTrackerUrl);
      const versionText = info.version ?? '';
      const liChildren = [
        el('span', { className: 'issue-tracker-date-full' }, formatDate(info.createdAt)),
        el('span', { className: 'issue-tracker-date-short' }, formatDate(info.createdAt, true)),
        ` - ${versionText} - `,
      ];
      if (safeUrl) {
        liChildren.push(
          el('a', { href: safeUrl, target: '_blank', rel: 'noopener noreferrer' },
            el('span', { className: 'issue-tracker-url-full' }, safeUrl),
            el('span', { className: 'issue-tracker-url-short' }, getIssueTrackerLinkLabel(safeUrl)),
          ),
        );
      } else {
        liChildren.push('(invalid URL omitted)');
      }
      list.appendChild(el('li', { id: `issue-item-${index}` }, ...liChildren));
    });

    issueTrackerContainer.append(
      el('p', {}, 'Issue Tracker Info'),
      el('small', {}, 'Issues opened by verifiers while reproducing different versions. Check before starting a new verification.'),
      list,
    );

    const targetElement = document.getElementById(htmlElementId);
    
    if (targetElement) {
      targetElement.appendChild(issueTrackerContainer);
    }
  }
}
window.showIssueTrackerHtmlWidget = showIssueTrackerHtmlWidget;

window.showMoreRows = function() {
  // Only show rows that were initially hidden (not filtered out)
  const initiallyHiddenRows = document.querySelectorAll('tr.initially-hidden');
  initiallyHiddenRows.forEach(row => {
    row.classList.remove('initially-hidden');
    row.style.display = 'table-row';
  });
  document.getElementById('show-more-row').remove();
  updateTableVisibility();
};
