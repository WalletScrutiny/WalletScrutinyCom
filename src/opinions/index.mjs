/**
 * Community opinions on review pages: entry point of the opinions_ui bundle.
 * Mounts an OpinionsWidget on every element written by
 * _includes/review/nostrOpinion.html.
 */
import styles from './opinions.css';
import { OpinionsWidget } from './widget.mjs';

const STYLE_ID = 'opinions-style';

function injectStyles() {
  if (document.getElementById(STYLE_ID)) {
    return;
  }
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = styles;
  document.head.appendChild(style);
}

export function mountOpinions(root = document) {
  injectStyles();
  const widgets = [];
  for (const element of root.querySelectorAll('[data-opinions]')) {
    if (element.dataset.opinionsMounted) {
      continue;
    }
    element.dataset.opinionsMounted = '1';
    try {
      const widget = new OpinionsWidget(element);
      widgets.push(widget);
      widget.init().catch((error) => console.error('opinions: init failed', error));
    } catch (error) {
      console.error('opinions: cannot mount', error);
    }
  }
  return widgets;
}

if (typeof window !== 'undefined') {
  mountOpinions();
}
