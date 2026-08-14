import { getFirstTagValue, getStatusText } from './verifications_common.mjs';
import { formatDate } from './format-utils.mjs';
import { isSha256Hex } from './html-utils.mjs';
import { getUserPubkey } from './nostr-session.mjs';
import { showToast } from './toast.mjs';
import {
  deleteDraftVerificationEvent,
  deleteOwnPublishedVerification,
  deleteOwnVerificationComment,
} from './verifications-publish.mjs';

export function setupAppIdAutocomplete(firstTime = true) {
  const appIdInput = document.getElementById('appId');
  const suggestionsContainer = document.getElementById('appIdSuggestions');

  function filterWallets(searchText) {
    if (!window.wallets) return [];
    return window.wallets.filter(wallet => {
      const searchLower = searchText.toLowerCase();
      return wallet.appId.toLowerCase().includes(searchLower) ||
        wallet.title.toLowerCase().includes(searchLower);
    });
  }

  function decodeHtmlEntities(text) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  }

  function showSuggestions(suggestions) {
    suggestionsContainer.innerHTML = '';
    if (suggestions.length === 0) {
      suggestionsContainer.style.display = 'none';
      return;
    }

    const fragment = document.createDocumentFragment();

    suggestions.forEach(wallet => {
      const div = document.createElement('div');
      div.className = 'suggestion-item';
      const decodedTitle = decodeHtmlEntities(wallet.title);
      div.textContent = `${decodedTitle}${wallet.folder ? ' (' + wallet.folder + ')' : ''} - ${wallet.appId}`;
      div.onclick = () => {
        appIdInput.value = wallet.appId;
        suggestionsContainer.style.display = 'none';
        appIdInput.dispatchEvent(new Event('input', { bubbles: true }));
      };
      fragment.appendChild(div);
    });

    suggestionsContainer.appendChild(fragment);

    suggestionsContainer.style.display = 'block';
  }

  if (firstTime) {
    appIdInput.addEventListener('input', (e) => {
      const searchText = e.target.value;
      if (searchText.length > 1) {
        const filteredWallets = filterWallets(searchText);
        showSuggestions(filteredWallets);
      } else {
        showSuggestions([]);
      }
    });

    document.addEventListener('click', (e) => {
      if (!appIdInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
        suggestionsContainer.style.display = 'none';
      }
    });
  }
}

function ensureDraftNotificationClickHandler() {
  const list = document.querySelector('.notifications-list');
  if (!list || list.dataset.draftActionsWired === '1') {
    return;
  }
  list.dataset.draftActionsWired = '1';
  list.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-draft-id][data-draft-action]');
    if (!btn) {
      return;
    }
    event.preventDefault();
    doDraftVerificationAction(btn.dataset.draftId, btn.dataset.draftAction);
  });
}

export function doDraftVerificationAction(draftVerificationEventId, action) {
  if (action === 'edit') {
    window.location.href = `/new_verification?draftVerificationEventId=${draftVerificationEventId}&action=${action}`;
  } else if (action === 'delete') {
    let goToURL = null;

    if (window.location.pathname.includes('new_verification')) {
      goToURL = '/assets/';
    }

    deleteDraftVerification(draftVerificationEventId, goToURL);
  }
}

export async function deleteDraftVerification(draftVerificationEventId, moveToURL = null, reason = 'user deleted draft verification') {
  if (!draftVerificationEventId) {
    showToast('No draft verification ID found', 'error');
    return;
  }

  if (!confirm('Are you sure you want to delete this draft verification? This action cannot be undone.')) {
    return;
  }

  try {
    await deleteDraftVerificationEvent(draftVerificationEventId, reason);
    showToast('Draft verification deleted successfully');

    if (moveToURL) {
      window.location.href = moveToURL;
    } else {
      window.location.reload();
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

export async function deletePublishedVerification(verificationEventId, reason = 'User deleted verification via WalletScrutiny') {
  if (!verificationEventId) {
    showToast('No verification event ID found', 'error');
    return;
  }

  if (!confirm('Are you sure you want to delete this verification? A Nostr deletion request (kind 5) will be sent to relays. This action cannot be undone.')) {
    return;
  }

  try {
    await deleteOwnPublishedVerification(verificationEventId, reason);
    showToast('Verification deleted successfully');
    window.location.reload();
  } catch (error) {
    showToast(error.message || String(error), 'error');
  }
}

export async function deleteVerificationComment(commentEventId, reason = 'User deleted verification comment') {
  if (!commentEventId) {
    showToast('No comment event ID found', 'error');
    return false;
  }

  if (!confirm('Do you want to delete this comment?')) {
    return false;
  }

  try {
    void showToast('Deleting comment, please wait...', 'info', 5000);
    await deleteOwnVerificationComment(commentEventId, reason);
    showToast('Comment deleted successfully');
    await new Promise(resolve => setTimeout(resolve, 1000));
    window.location.reload();
  } catch (error) {
    showToast(error.message || String(error), 'error');
    return false;
  }
}

export async function loadDraftVerificationsNotifications() {
  let myPubkey;
  try {
    myPubkey = await getUserPubkey();
  } catch {
    return;
  }
  if (!myPubkey) {
    return;
  }

  let myDraftVerifications = [];

  for (const draftVerification of window.allAssetInformation.draftVerifications) {
    const arrayDraftVerificationEventsForThisSha256 = draftVerification[1];
    for (const draftVerificationEvent of arrayDraftVerificationEventsForThisSha256) {
      if (draftVerificationEvent.pubkey === myPubkey) {
        myDraftVerifications.push(draftVerificationEvent);
      }
    }
  }

  if (myDraftVerifications && myDraftVerifications.length > 0) {
    ensureDraftNotificationClickHandler();
    myDraftVerifications.forEach(verification => {
      const identifier = getFirstTagValue(verification, 'i', 'Unknown');
      const version = getFirstTagValue(verification, 'version', null);
      const wallet = window.wallets?.find(w => w.appId === identifier);
      const walletTitle = wallet ? wallet.title : identifier;
      const status = getFirstTagValue(verification, 'status');
      const statusIcon = '<span title="' + getStatusText(status) + '" style="margin-left: 4px;">' + (status === 'reproducible' ? '✅' : '❌') + ` ${getStatusText(status, true)}</span>`;

      addNotificationToIndicator('Unpublished Verification',
        `${walletTitle} - ${version ? version+' -' : ''} ${formatDate(verification.created_at)} ${statusIcon}
        <br>
        ${isSha256Hex(verification.id) ? `<button class="edit-button" data-draft-id="${verification.id}" data-draft-action="edit">Edit</button>
        <button class="delete-button" data-draft-id="${verification.id}" data-draft-action="delete">Delete</button>` : ''}`,'info')
    });
  }
}
