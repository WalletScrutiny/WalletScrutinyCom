/**
 * alternativeStoresFrontmatter.mjs
 *
 * Surgical edits of `android.alternativeStores` in a `_mobile/*.md` front matter,
 * shared by the store checks (fdroidSourceAvailableCheck.mjs, zapstoreCheck.mjs).
 * Only the lines of that one key change; the rest of the file is left byte for byte.
 *
 *   android:
 *     appId: org.electrum.electrum
 *     alternativeStores:
 *     - fdroid
 *     - zapstore
 *
 * A new key goes right after `android.appId`. Removing the last store removes the key.
 */

const FRONTMATTER_RE = /^(---\r?\n)([\s\S]*?)(\r?\n---)/;
const KEY_RE = /^  alternativeStores:(.*)$/;
const ITEM_RE = /^\s*-\s+(.+?)\s*$/;

function normalize(store) {
  return String(store).trim().replace(/^['"]|['"]$/g, '').toLowerCase();
}

function parseInlineValue(rest) {
  const v = rest.trim();
  if (!v) return null;
  if (v.startsWith('[') && v.endsWith(']')) {
    return v.slice(1, -1).split(',').map(normalize).filter(Boolean);
  }
  return [normalize(v)];
}

/** Locates the `android:` block inside the raw front matter as a range of lines. */
function findAndroidBlock(lines) {
  const start = lines.findIndex((l) => /^android:\s*$/.test(l));
  if (start < 0) return null;
  let end = start + 1;
  while (end < lines.length && (/^[ \t]/.test(lines[end]) || lines[end] === '')) end++;
  while (end > start + 1 && lines[end - 1] === '') end--;
  return { start, end };
}

/** Finds `alternativeStores` in the android block: the lines it spans and its stores. */
function findStoresKey(lines, block) {
  for (let i = block.start + 1; i < block.end; i++) {
    const m = lines[i].match(KEY_RE);
    if (!m) continue;
    const inline = parseInlineValue(m[1]);
    if (inline) return { at: i, count: 1, stores: inline, itemIndent: '  ' };
    let j = i + 1;
    const stores = [];
    let itemIndent = '  ';
    while (j < block.end) {
      const item = lines[j].match(ITEM_RE);
      if (!item || !/^ {2,}-/.test(lines[j])) break;
      if (j === i + 1) itemIndent = lines[j].match(/^ */)[0];
      stores.push(normalize(item[1]));
      j++;
    }
    return { at: i, count: j - i, stores, itemIndent };
  }
  return null;
}

/** The stores listed under `android.alternativeStores`, lower-cased. */
export function readAndroidAlternativeStores(content) {
  const fm = content.match(FRONTMATTER_RE);
  if (!fm) return [];
  const lines = fm[2].split('\n');
  const block = findAndroidBlock(lines);
  if (!block) return [];
  return findStoresKey(lines, block)?.stores ?? [];
}

/**
 * Adds (`present = true`) or removes (`present = false`) one store in `android.alternativeStores`.
 * Returns { content, status } with status one of: added, removed, unchanged, no_frontmatter, no_android_block.
 */
export function setAndroidAlternativeStore(content, store, present) {
  const fm = content.match(FRONTMATTER_RE);
  if (!fm) return { content, status: 'no_frontmatter' };
  const eol = fm[2].includes('\r\n') ? '\r\n' : '\n';
  const lines = fm[2].split(eol);
  const block = findAndroidBlock(lines);
  if (!block) return { content, status: 'no_android_block' };

  const id = normalize(store);
  const key = findStoresKey(lines, block);
  const current = key?.stores ?? [];
  if (current.includes(id) === present) return { content, status: 'unchanged' };

  const next = present ? [...current, id] : current.filter((s) => s !== id);
  const indent = key?.itemIndent ?? '  ';
  const replacement = next.length ? ['  alternativeStores:', ...next.map((s) => `${indent}- ${s}`)] : [];

  if (key) {
    lines.splice(key.at, key.count, ...replacement);
  } else {
    const appIdAt = lines.findIndex((l, i) => i > block.start && i < block.end && /^  appId:/.test(l));
    lines.splice(appIdAt >= 0 ? appIdAt + 1 : block.end, 0, ...replacement);
  }

  const nextFm = lines.join(eol);
  return {
    content: `${fm[1]}${nextFm}${fm[3]}${content.slice(fm[0].length)}`,
    status: present ? 'added' : 'removed'
  };
}
