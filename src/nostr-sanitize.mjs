import DOMPurify from 'dompurify';
import { isSha256Hex, stripHtmlTags } from './html-utils.mjs';

export const purifyConfig = {
  ALLOWED_TAGS: ['div'],
  ALLOWED_ATTR: ['id'],
  SANITIZE_DOM: true,
  WHOLE_DOCUMENT: false,
  RETURN_DOM_FRAGMENT: false,
  RETURN_DOM: false,
  RETURN_TRUSTED_TYPE: false
};

const sanitizedEvents = new WeakSet();

function isValidJSONObject(str) {
  try {
    const parsed = JSON.parse(str);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed);
  } catch {
    return false;
  }
}

/**
 * Markdown body of a verification is sanitized at render time (marked → sanitizeRichHtml).
 * At ingest we only length-limit so legitimate markdown syntax is preserved.
 */
function sanitizeVerificationMarkdownContent(content) {
  if (!content) {
    return content;
  }
  return String(content).substring(0, 60000);
}

function canUseDomPurify() {
  // linkedom can expose a sanitize() that is a no-op when isSupported is not true
  return Boolean(DOMPurify?.isSupported && typeof DOMPurify.sanitize === 'function');
}

function purifyText(value) {
  if (canUseDomPurify()) {
    return DOMPurify.sanitize(value, purifyConfig);
  }
  // No DOM for DOMPurify (unit tests): strip tags, keep ordinary punctuation.
  return stripHtmlTags(value);
}

export function eventSanitize(event) {
  if (sanitizedEvents.has(event)) {
    return;
  }

  if (isValidJSONObject(event.content)) {
    const contentObject = JSON.parse(event.content);

    Object.keys(contentObject).forEach(key => {
      let sanitizedContent;
      if (key === 'content') {
        sanitizedContent = sanitizeVerificationMarkdownContent(contentObject[key]);
      } else {
        sanitizedContent = purifyText(contentObject[key]);
      }

      if (key === 'description') {
        sanitizedContent = sanitizedContent.substring(0, 120);
      }

      contentObject[key] = sanitizedContent;
    });

    event.content = JSON.stringify(contentObject);
  } else {
    event.content = purifyText(event.content);
    event.content = event.content.substring(0, 120);
  }

  event.tags.forEach(tag => {
    if (tag[1] == null) {
      return;
    }
    let sanitizedTag = purifyText(tag[1]);

    // Tags are interpolated into HTML attributes / handlers historically; strip both
    // quote types. Do not apply this to JSON content fields (see description above).
    sanitizedTag = sanitizedTag.replace(/["']/g, '');

    if (tag[0] === 'i') {
      sanitizedTag = sanitizedTag.substring(0, 75);
    } else if (tag[0] === 'version') {
      sanitizedTag = sanitizedTag.substring(0, 30);
    } else if (['x', 'ox'].includes(tag[0])) {
      sanitizedTag = sanitizedTag.substring(0, 64);
    } else if (tag[0] === 'platform') {
      sanitizedTag = sanitizedTag.substring(0, 10);
    } else if (tag[0] === 'status') {
      sanitizedTag = sanitizedTag.substring(0, 16);
    }

    tag[1] = sanitizedTag;
  });

  sanitizedEvents.add(event);
}

export function getVerificationHashList(event) {
  return (event.tags ?? [])
    .filter(tag => tag[0] === 'x' && isSha256Hex(tag[1]))
    .map(tag => tag[1]);
}
