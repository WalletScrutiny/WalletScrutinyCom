/**
 * Inline SVG icons the widget needs and the site sprite does not have
 * (sentiment faces, thumbs). Static markup only, never Nostr data.
 */
import { SENTIMENT_POSITIVE, SENTIMENT_NEUTRAL, SENTIMENT_NEGATIVE } from './constants.mjs';

const face = (mouth, className) =>
  `<svg class="opinions-icon opinions-icon--${className}" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">` +
  '<circle cx="12" cy="12" r="9.5"/><circle cx="9" cy="10" r="0.9" fill="currentColor" stroke="none"/><circle cx="15" cy="10" r="0.9" fill="currentColor" stroke="none"/>' +
  `${mouth}</svg>`;

const SENTIMENT_ICONS = {
  [SENTIMENT_POSITIVE]: face('<path d="M8.5 14.5c1 1.3 2.2 2 3.5 2s2.5-.7 3.5-2"/>', 'positive'),
  [SENTIMENT_NEUTRAL]: face('<path d="M8.5 15.5h7"/>', 'neutral'),
  [SENTIMENT_NEGATIVE]: face('<path d="M8.5 16.5c1-1.3 2.2-2 3.5-2s2.5.7 3.5 2"/>', 'negative'),
};

export function sentimentIcon(sentiment) {
  return SENTIMENT_ICONS[sentiment] ?? '';
}

const thumb = (transform, className) =>
  `<svg class="opinions-icon opinions-icon--${className}" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"${transform}>` +
  '<path d="M7 10v11"/><path d="M3 11.5A1.5 1.5 0 0 1 4.5 10H7l3.3-6.6a1.8 1.8 0 0 1 3.4.8V9h5a2 2 0 0 1 2 2.3l-1.2 7a2 2 0 0 1-2 1.7H4.5A1.5 1.5 0 0 1 3 18.5z"/></svg>';

export const thumbsUpIcon = thumb('', 'thumbs-up');
export const thumbsDownIcon = thumb(' style="transform: rotate(180deg)"', 'thumbs-down');

export const replyIcon =
  '<svg class="opinions-icon opinions-icon--reply" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
  '<path d="M9 17l-5-5 5-5"/><path d="M4 12h9a7 7 0 0 1 7 7v1"/></svg>';

export const approvedIcon =
  '<svg class="opinions-icon opinions-icon--approved" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">' +
  '<path d="M12 2l9 3.2v6.3c0 5.1-3.7 9.3-9 10.5-5.3-1.2-9-5.4-9-10.5V5.2z"/><path d="M8 12.2l2.7 2.7 5.3-5.6" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>';
