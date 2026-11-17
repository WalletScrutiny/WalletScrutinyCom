// The result of the wallet page's "Check your file" panel (the drop area with
// variant="panel"), drawn like the Build Verifications panels above it: the dropped file
// with its hash, one headline saying what we know about it, and where to go next.
// drag-and-drop.js collects the facts; this only paints them.

import { getFirstTagValue } from './verifications_common.mjs';
import { formatFileSize } from './drag-and-drop-utils.mjs';
import { statusGroup } from './build-verifications-model.mjs';
import { statusPill } from './build-verifications.mjs';
import { el, HASH_PREFIX_LENGTH } from './html-utils.mjs';

const COPY_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';

const GROUP_ORDER = ['reproducible', 'notReproducible', 'failedToBuild', 'other'];

function fileRow({ fileName, size, sha256 }, maxFileSize) {
  const tooLarge = size / 1024 / 1024 > maxFileSize;
  return el('li', { className: 'bv-file drop-panel__file' },
    el('span', { className: 'bv-file__text' },
      el('span', { className: 'bv-file__name', title: fileName }, `${fileName} - `),
      el('code', { className: 'bv-file__hash-text', title: sha256 }, sha256.slice(0, HASH_PREFIX_LENGTH)),
      el('span', { className: 'drop-panel__size' }, ` · ${formatFileSize(size)}`),
      tooLarge ? el('span', { className: 'drop-panel__too-large' }, ` · over the ${maxFileSize} MB upload limit`) : null,
    ),
    el('span', { className: 'hash-row bv-file__hash' },
      el('button', {
        type: 'button',
        className: 'hash-copy-btn js-copy-hash',
        title: 'Copy hash',
        'aria-label': 'Copy hash',
        dataset: { hash: sha256 },
      }, el('span', { className: 'hash-copy-btn__icon', 'aria-hidden': 'true', html: COPY_SVG })),
    ),
  );
}

/** One pill per verdict the verifications reached, the most common first. */
function verdictPills(verifications) {
  const byGroup = new Map();
  for (const verification of verifications) {
    const status = getFirstTagValue(verification, 'status');
    const group = statusGroup(status);
    const entry = byGroup.get(group) ?? { status, count: 0 };
    entry.count += 1;
    byGroup.set(group, entry);
  }
  return [...byGroup.entries()]
    .sort(([a, x], [b, y]) => y.count - x.count || GROUP_ORDER.indexOf(a) - GROUP_ORDER.indexOf(b))
    .map(([, { status }]) => statusPill(status));
}

function link(href, label, attrs = {}) {
  return el('a', { href, className: 'verification-action-link', ...attrs }, label);
}

function button(label, onClick) {
  const node = el('button', { type: 'button', className: 'verification-action-link' }, label);
  node.addEventListener('click', onClick);
  return node;
}

function verifiersText(count) {
  return count === 1 ? '1 verifier checked this exact file.' : `${count} verifiers checked this exact file.`;
}

/**
 * What the panel says about the dropped file, without the DOM. Exported for tests.
 * Returns { outcome, headline, lede }.
 */
export function describeDroppedFile({ appTitle, version, verificationCount, hasAsset, blockingMessage, isThisWallet }) {
  const name = [appTitle, version].filter(Boolean).join(' ');
  if (blockingMessage) {
    return { outcome: 'blocked', headline: 'This file cannot be checked', lede: blockingMessage };
  }
  if (verificationCount > 0) {
    return {
      outcome: 'verified',
      headline: name ? `This is ${name}` : 'This file is known',
      lede: verifiersText(verificationCount),
    };
  }
  if (hasAsset) {
    return {
      outcome: 'registered',
      headline: 'Registered, but not verified yet',
      lede: `Somebody registered this file${name ? ` as ${name}` : ''}, but nobody has tried to build it from source yet.`,
    };
  }
  return {
    outcome: 'unknown',
    headline: 'Nobody has registered this file',
    lede: isThisWallet === false
      ? 'We have no record of a file with this hash.'
      : 'If it is a release of this wallet, register it so somebody can try to build it from source and compare.',
  };
}

/**
 * Paints the result into [host].
 *
 * facts: { files: [{ fileName, size, sha256 }], archiveName, appTitle, appId, version,
 *   verifications: [event], hasAsset, blockingMessage, isThisWallet, otherWalletUrl,
 *   newVerificationUrl, assetUrl, onRegister (null hides the button), onShowVerifications
 *   (null hides the button), maxFileSize }
 */
export function renderDropPanelResult(host, facts) {
  if (!host) {
    return;
  }
  const verifications = facts.verifications ?? [];
  const { outcome, headline, lede } = describeDroppedFile({
    appTitle: facts.appTitle,
    version: facts.version,
    verificationCount: verifications.length,
    hasAsset: facts.hasAsset,
    blockingMessage: facts.blockingMessage,
    isThisWallet: facts.isThisWallet,
  });

  const actions = [];
  if (outcome === 'verified') {
    if (facts.onShowVerifications) {
      actions.push(button('Show its verifications', facts.onShowVerifications));
    } else if (facts.otherWalletUrl) {
      actions.push(link(facts.otherWalletUrl, `Go to the ${facts.appTitle} page`));
    } else {
      actions.push(link(facts.assetUrl, 'View its verifications'));
    }
    actions.push(link(facts.newVerificationUrl, 'Create another verification'));
  } else if (outcome === 'registered') {
    actions.push(link(facts.newVerificationUrl, 'Create verification'));
    actions.push(link(facts.assetUrl, 'View the registration'));
    if (facts.otherWalletUrl) {
      actions.push(link(facts.otherWalletUrl, `Go to the ${facts.appTitle} page`));
    }
  } else if (outcome === 'unknown') {
    if (facts.onRegister) {
      actions.push(button('Register this file', facts.onRegister));
    }
    actions.push(link(facts.newVerificationUrl, 'Create verification'));
  } else if (outcome === 'blocked' && facts.assetUrl && (verifications.length || facts.hasAsset)) {
    actions.push(link(facts.assetUrl, 'View its verifications'));
  }
  actions.push(link('/verifications/', 'How verifications work', { target: '_blank', rel: 'noopener' }));

  const files = facts.files ?? [];
  host.replaceChildren(
    el('div', { className: `drop-panel__outcome drop-panel__outcome--${outcome}`, dataset: { outcome } },
      el('ul', { className: 'bv-files drop-panel__files', 'aria-label': 'Your file' },
        files.map(file => fileRow(file, facts.maxFileSize ?? Infinity))),
      facts.archiveName && files.length > 1
        ? el('p', { className: 'drop-panel__archive' }, `${files.length} APK files from ${facts.archiveName}`)
        : null,
      el('h4', { className: 'drop-panel__headline' }, headline),
      el('p', { className: 'drop-panel__lede' }, lede),
      outcome === 'verified' ? el('div', { className: 'drop-panel__pills' }, verdictPills(verifications)) : null,
      el('div', { className: 'bv-actions drop-panel__actions' }, actions),
    ),
  );
}
