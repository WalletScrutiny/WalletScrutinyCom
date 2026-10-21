/**
 * Entry of the opinions_moderation bundle: styles and mount for /opinions/
 * and, with data-group-by="author", /opinions_by_author/.
 */
import styles from './moderation-page.css';
import { OpinionModerationPage } from './moderation-page.mjs';
import { OpinionModerationByAuthorPage } from './moderation-by-author-page.mjs';

const STYLE_ID = 'opinion-moderation-style';

function injectStyles() {
  if (document.getElementById(STYLE_ID)) {
    return;
  }
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = styles;
  document.head.appendChild(style);
}

const root = document.getElementById('opinion-moderation');
if (root) {
  injectStyles();
  const Page = root.dataset.groupBy === 'author' ? OpinionModerationByAuthorPage : OpinionModerationPage;
  const page = new Page(root);
  page.init().catch((error) => console.error('opinions: index init failed', error));
}
