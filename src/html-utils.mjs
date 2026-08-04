const SHA256_HEX_RE = /^[0-9a-f]{64}$/i;

export function isSha256Hex(value) {
  return typeof value === 'string' && SHA256_HEX_RE.test(value);
}

/** Strip tags when DOMPurify has no DOM (unit tests). */
export function stripHtmlTags(value) {
  return String(value ?? '').replace(/<[^>]*>/g, '');
}

/**
 * Allow only http(s) URLs for user-supplied links.
 * @returns {string|null}
 */
export function sanitizeHttpUrl(value) {
  if (value == null || value === '') {
    return null;
  }
  try {
    const url = new URL(String(value).trim());
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Build a DOM node. Attributes go through setAttribute (safe for untrusted values).
 * String/number children become text nodes (safe). Element children are appended as-is.
 *
 * Special attrs:
 * - className / class → className
 * - dataset: { fooBar: 'x' } → data-foo-bar
 * - style: object → style properties
 * - html: trusted markup only (static icons, never Nostr data)
 */
export function el(tagName, attrs = {}, ...children) {
  const node = document.createElement(tagName);

  for (const [key, raw] of Object.entries(attrs ?? {})) {
    if (raw == null || raw === false) {
      continue;
    }
    if (key === 'className' || key === 'class') {
      node.className = String(raw);
      continue;
    }
    if (key === 'dataset' && typeof raw === 'object') {
      for (const [dataKey, dataVal] of Object.entries(raw)) {
        if (dataVal != null && dataVal !== false) {
          node.dataset[dataKey] = String(dataVal);
        }
      }
      continue;
    }
    if (key === 'style' && typeof raw === 'object') {
      Object.assign(node.style, raw);
      continue;
    }
    if (key === 'html') {
      // Trusted static markup only (e.g. inline SVG constants).
      node.innerHTML = String(raw);
      continue;
    }
    node.setAttribute(key, raw === true ? '' : String(raw));
  }

  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) {
      continue;
    }
    if (typeof child === 'string' || typeof child === 'number') {
      node.appendChild(document.createTextNode(String(child)));
      continue;
    }
    node.appendChild(child);
  }

  return node;
}

/** Serialize a node built with el() / createElement for callers that still need HTML strings. */
export function htmlOf(node) {
  return node?.outerHTML ?? '';
}
