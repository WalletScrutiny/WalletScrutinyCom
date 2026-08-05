import { el, isSha256Hex } from './html-utils.mjs';

let assetTableCommentsContainer = null;
let assetTableCommentsVerificationKey = null;
let verificationAuthorPubkey = null;
let commentAuthorPubkeys = [];
let messageCounter = 0;

const MAX_COMMENTS_TO_SHOW = 3;

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function addCommentStyles() {
  const styleId = 'comments-section-styles';
  if (document.getElementById(styleId)) {
    return;
  }

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    .comments-section {
      margin-top: 20px;
      border-top: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      padding-top: 10px;
      padding-bottom: 15px;
    }
    body.dark .comments-section {
      border-top: 1px solid #555;
    }
    .comment-input-container {
      display: flex;
      align-items: flex-start;
      margin-bottom: 0;
    }
    .comment-input {
      flex-grow: 1;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      resize: vertical;
      height: 40px;
      background-color: white;
      color: black;
      margin-right: 10px;
    }
    body.dark .comment-input {
      background-color: #333;
      color: white;
      border-color: #555;
    }
    .comment-submit-btn {
      padding: 10px 15px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      height: fit-content;
    }
    .comment-submit-btn:hover {
      background-color: #45a049;
    }
    .comments-list {
      display: block;
      width: 100%;
    }
    .comments-section .ws-v-comment {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-items: stretch;
      align-content: flex-start;
      justify-content: flex-start;
      gap: 4px;
      flex: 0 0 auto;
      height: auto;
      min-height: 0;
      max-height: none;
      background-color: #f0f0f0;
      padding: 6px 10px;
      margin: 6px 0;
      border-radius: 8px;
      font-size: 0.9em;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      border: 1px solid #707070 !important;
    }
    body.dark .comments-section .ws-v-comment {
      background-color: #232323;
    }
    .comment-author {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: space-between;
      width: 100%;
    }
    .comment-delete-btn {
      flex-shrink: 0;
      padding: 4px 6px;
      border: none;
      background: transparent;
      color: #666;
      cursor: pointer;
      border-radius: 4px;
      line-height: 1;
    }
    .comment-delete-btn:hover {
      color: #c00;
      background-color: rgba(0, 0, 0, 0.06);
    }
    body.dark .comment-delete-btn {
      color: #aaa;
    }
    body.dark .comment-delete-btn:hover {
      color: #f66;
      background-color: rgba(255, 255, 255, 0.08);
    }
    .comment-author-name {
      font-weight: bold;
      color: black;
      cursor: pointer;
      text-decoration: underline;
    }
    .comment-author-name:hover {
      color: #0066cc;
    }
    body.dark .comment-author-name {
      color: white;
    }
    body.dark .comment-author-name:hover {
      color: #66b3ff;
    }
    .comment-author-name a {
      color: inherit;
      text-decoration: inherit;
    }
    .comment-author-name a:hover {
      color: inherit;
    }
    .comments-section .comment-content {
      color: black;
      overflow-wrap: break-word;
      flex: none;
      display: block;
      min-height: 0;
      line-height: 1.35;
    }
    body.dark .comments-section .comment-content {
      color: white;
    }
    .comments-section .comment-body {
      margin: 0;
    }
    .comments-section .comment-date {
      font-size: 0.8em;
      color: #888;
      margin-top: 2px;
      flex-shrink: 0;
    }
    body.dark .comments-section .comment-date {
      color: #aaa;
    }
    .see-more-container {
      margin-top: 3px;
      text-align: center;
    }
    .see-more-link {
      cursor: pointer;
      text-decoration: underline;
      color: #007bff;
    }
    body.dark .see-more-link {
      color: #66b3ff;
    }
    [hidden] {
      display: none !important;
    }
    `;

  document.head.appendChild(style);
}

async function fetchComments(verificationKey) {
  console.debug(`Fetching comments for verification ID: ${verificationKey}`);
  const comments = await getCommentsForVerification(verificationKey);

  commentAuthorPubkeys = [];

  return comments
    .map(comment => {
      if (!commentAuthorPubkeys.includes(comment.pubkey) && window.userPubkey !== comment.pubkey) {
        commentAuthorPubkeys.push(comment.pubkey);
      }

      const author = comment.pubkey;
      const content = comment.content;
      const date = formatCommentDate(comment.created_at);
      const pubkey = comment.pubkey;
      return { author, content, date, pubkey, created_at: comment.created_at, id: comment.id };
    })
    .sort((a, b) => b.created_at - a.created_at);
}

async function handleCommentSubmit(verificationKey, textarea, button) {
  const comment = textarea.value.trim();

  if (!comment) {
    showToast('Please enter a comment before posting.', 'error');
    return;
  }

  button.disabled = true;
  const originalText = button.textContent;
  button.textContent = 'Posting...';

  try {
    await createNostrCommentToVerification(verificationKey, comment, commentAuthorPubkeys, messageCounter);

    textarea.value = '';

    showToast('Comment posted successfully!');

    renderCommentsSection(assetTableCommentsContainer, assetTableCommentsVerificationKey, verificationAuthorPubkey);

    if (await getUserPubkey() !== verificationAuthorPubkey) {
      const notificationText = `I added a new comment to your WalletScrutiny verification: "${comment}". See or reply to it at ${window.location.href}`;
      sendPrivateMessageToVerifier(verificationAuthorPubkey, notificationText);
    }

  } catch (error) {
    console.error('Error posting comment:', error);
    showToast('Error posting comment: ' + error.message, 'error');
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
}

export async function renderCommentsSection(container, verificationKey, authorPubkey) {
  assetTableCommentsContainer = container;
  assetTableCommentsVerificationKey = verificationKey;
  verificationAuthorPubkey = authorPubkey;

  addCommentStyles();

  const commentsForThisVerification = await fetchComments(assetTableCommentsVerificationKey);

  let profilePubkeys = [];

  for (const comment of commentsForThisVerification) {
    messageCounter++;
    profilePubkeys.push(comment.pubkey);
  }

  container.innerHTML = `
    <div class="comments-section">
      <p style="font-weight: bold;">Comments</p>
      <div class="comment-input-container">
        <textarea class="comment-input" placeholder="Write a comment to this verification..."></textarea>
        <button class="comment-submit-btn">Post</button>
      </div>
      <div class="comments-list">
        ${commentsForThisVerification.map((comment, index) => {
          const safePubkey = isSha256Hex(comment.pubkey) ? comment.pubkey : '';
          const safeId = isSha256Hex(comment.id) ? comment.id : '';
          if (!safePubkey) {
            return '';
          }
          return `
          <div class="ws-v-comment comment-profile-${safePubkey}" ${index >= MAX_COMMENTS_TO_SHOW ? 'hidden' : ''}>
            <div class="comment-author">
              <span class="comment-author-name" data-pubkey="${safePubkey}">${escapeHtml(comment.author)}</span>
              ${window.userPubkey && safePubkey === window.userPubkey && safeId ? `
              <button type="button" class="comment-delete-btn" data-comment-id="${safeId}" title="Delete comment" aria-label="Delete comment">
                <i class="fas fa-trash-alt" aria-hidden="true"></i>
              </button>` : ''}
            </div>
            <div class="comment-content">
              <div class="comment-body">${escapeHtml(comment.content)}</div>
            </div>
            <div class="comment-date">
              <span>${escapeHtml(comment.date)}</span>
            </div>
          </div>
        `;
        }).join('')}
        ${commentsForThisVerification.length > MAX_COMMENTS_TO_SHOW ? `
          <div class="see-more-container">
            <a href="#" class="see-more-link">See ${commentsForThisVerification.length - MAX_COMMENTS_TO_SHOW} more comments</a>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  if (commentsForThisVerification.length > MAX_COMMENTS_TO_SHOW) {
    const seeMoreLink = container.querySelector('.see-more-link');
    if (seeMoreLink) {
      seeMoreLink.addEventListener('click', (event) => {
        event.preventDefault();
        container.querySelectorAll('.ws-v-comment[hidden]').forEach(comment => {
          comment.removeAttribute('hidden');
        });
        seeMoreLink.parentElement.remove();
      });
    }
  }

  profilePubkeys.forEach(async pubkey => {
    try {
      const [profile, npub] = await Promise.all([
        getNostrProfile(pubkey),
        getNpubFromPubkey(pubkey)
      ]);
      
      document.querySelectorAll(`.comment-profile-${pubkey}`).forEach(profileElement => {
        const commentAuthorName = profileElement.querySelector('.comment-author-name');
        if (commentAuthorName) {
          const displayName = profile?.name || pubkey;
          const profileUrl = npub ? `https://njump.me/${npub}` : null;
          commentAuthorName.replaceChildren();
          if (profileUrl) {
            commentAuthorName.appendChild(
              el('a', {
                href: profileUrl,
                target: '_blank',
                rel: 'noopener noreferrer',
              }, displayName),
            );
          } else {
            commentAuthorName.appendChild(document.createTextNode(String(displayName)));
          }
        }
      });

    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  });

  const submitButton = container.querySelector('.comment-submit-btn');
  const textarea = container.querySelector('.comment-input');

  if (submitButton && textarea) {
    submitButton.addEventListener('click', () => {
      handleCommentSubmit(assetTableCommentsVerificationKey, textarea, submitButton);
    });
    textarea.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        handleCommentSubmit(assetTableCommentsVerificationKey, textarea, submitButton);
      }
    });
  }

  container.querySelectorAll('.comment-delete-btn').forEach((deleteBtn) => {
    deleteBtn.addEventListener('click', async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const commentEventId = deleteBtn.getAttribute('data-comment-id');
      if (!commentEventId || typeof window.deleteVerificationComment !== 'function') {
        return;
      }
      deleteBtn.disabled = true;
      try {
        await window.deleteVerificationComment(commentEventId);
      } finally {
        deleteBtn.disabled = false;
      }
    });
  });
}