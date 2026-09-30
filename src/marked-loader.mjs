import { sanitizeRichHtml } from './html-utils.mjs';

let markedPromise;

export function prefetchMarked() {
  void getMarked();
}

export function getMarked() {
  markedPromise ??= import('marked').then((module) => module.marked ?? module.default);
  return markedPromise;
}

/**
 * Parse markdown and sanitize the resulting HTML for safe assignment to innerHTML.
 */
export async function parseMarkdownToSafeHtml(markdown) {
  const marked = await getMarked();
  const rawHtml = marked.parse(String(markdown ?? ''));
  return sanitizeRichHtml(rawHtml);
}

if (typeof window !== 'undefined') {
  window.prefetchMarked = prefetchMarked;
  window.parseMarkdownToSafeHtml = parseMarkdownToSafeHtml;
}
