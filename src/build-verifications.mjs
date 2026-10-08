// The wallet page's "Build Verifications" section, drawn like the Android app's wallet page:
// every version as a stone to pick, and for the picked one who tested it, which files each
// build has, and where to go next. Painted from the assets table's rows every time the table
// is, so cache and network paints both land here. The picked version survives a repaint.

import { verificationDraftKind } from './nostr-constants.mjs';
import { getFirstTagValue, getStatusText } from './verifications_common.mjs';
import { formatDate } from './format-utils.mjs';
import { formatCommentDate } from './assets-table-utils.mjs';
import { createVerificationActionLink } from './assets-table-paint.mjs';
import { buildHashVerdictIndex } from './assets-table-filters.mjs';
import { renderProfilePictures } from './assets-table-profiles.js';
import { getNostrProfile, getProfileDisplayName } from './nostr-profile.mjs';
import { checkFileExistsInBlossom } from './blossom-utils.mjs';
import { getVerificationIdFromHash } from './assets-table-hash.mjs';
import { el, HASH_PREFIX_LENGTH, isSha256Hex } from './html-utils.mjs';
import {
  buildVersionTimeline,
  defaultVersionKey,
  versionKeyOfVerification,
  headlineFor,
  ledeFor,
  fileVerdict,
  buildLabel,
  statusGroup,
} from './build-verifications-model.mjs';

const MAX_PIPS = 8;

const CHEVRON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';
const DOWNLOAD_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>';
const COPY_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';

function pillModifier(status) {
  switch (statusGroup(status)) {
    case 'reproducible':
      return 'reproducible';
    case 'notReproducible':
    case 'failedToBuild':
      return 'negative';
    default:
      return status === 'warning' || status === 'notag' ? 'warning' : 'neutral';
  }
}

function pipModifier(status) {
  switch (status) {
    case 'reproducible':
      return 'bv-pip--reproducible';
    case 'not_reproducible':
      return 'bv-pip--not-reproducible';
    case 'ftbfs':
      return 'bv-pip--ftbfs';
    default:
      return '';
  }
}

function statusPill(status) {
  return el('span', { className: `verification-status-pill verification-status-pill--${pillModifier(status)}` },
    el('span', { className: 'verification-status-pill__dot', 'aria-hidden': 'true' }),
    el('span', { className: 'attestation-status' }, getStatusText(status, true)),
  );
}

// ---------------------------------------------------------------- every version

function stone(version, selected) {
  const current = version.verifications.slice(0, MAX_PIPS);
  const pips = el('span', { className: 'bv-pips', 'aria-hidden': 'true' },
    current.map(v => el('span', { className: `bv-pip ${pipModifier(getFirstTagValue(v, 'status'))}`.trim() })),
  );
  const tag = version.latest ? 'Latest' : '';
  const label = `Version ${version.name}, ${headlineFor(version)}${tag ? `, ${tag.toLowerCase()} release` : ''}`;
  return el('button', {
    type: 'button',
    className: `bv-stone bv-stone--${version.glass}`,
    'aria-pressed': selected ? 'true' : 'false',
    'aria-label': label,
    title: headlineFor(version),
    dataset: { versionKey: version.key },
  },
    el('span', { className: `bv-stone__tag${tag ? ' bv-stone__tag--latest' : ''}` }, tag),
    el('span', { className: 'bv-stone__pill' },
      el('span', { className: 'bv-stone__name' },
        version.name,
        version.hasWarning ? el('span', { className: 'bv-stone__warning', title: 'A verifier flagged a serious problem with this version' }, '⚠') : null,
      ),
      pips,
    ),
  );
}

function river(timeline, selectedKey) {
  return el('section', { className: 'bv-panel bv-versions', 'aria-label': 'Every version' },
    el('h4', { className: 'bv-caption' }, 'Every version'),
    el('div', { className: 'bv-river', role: 'group' }, timeline.map(v => stone(v, v.key === selectedKey))),
  );
}

function centerStone(riverEl, stoneEl) {
  if (!riverEl || !stoneEl) {
    return;
  }
  const target = stoneEl.offsetLeft - (riverEl.clientWidth - stoneEl.offsetWidth) / 2;
  const left = Math.max(0, target);
  if (typeof riverEl.scrollTo === 'function') {
    riverEl.scrollTo({ left, behavior: 'smooth' });
  } else {
    riverEl.scrollLeft = left;
  }
}

// ---------------------------------------------------------------- who tested

function verifierName(pubkey) {
  const span = el('span', { className: 'bv-row__name', dataset: { bvPubkey: pubkey } }, getProfileDisplayName(null, pubkey));
  if (isSha256Hex(pubkey)) {
    getNostrProfile(pubkey).then(profile => {
      if (profile) {
        span.textContent = getProfileDisplayName(profile, pubkey);
      }
    }).catch(() => {});
  }
  return span;
}

function verificationRow(verification, build, { appId, platform, userPubkey }) {
  const pubkey = isSha256Hex(verification.pubkey) ? verification.pubkey : '';
  const status = getFirstTagValue(verification, 'status');
  const draft = verification.kind === verificationDraftKind;
  const mine = Boolean(userPubkey) && verification.pubkey === userPubkey;
  return el('div', {
    className: `verification-card attestation-link bv-row${draft && mine ? ' verification-card--draft' : ''}`,
    role: 'button',
    tabindex: '0',
    dataset: {
      sha256Hash: isSha256Hex(build.sha256) ? build.sha256 : '',
      verificationId: isSha256Hex(verification.id) ? verification.id : '',
      appId: appId ?? '',
      platform: platform ?? '',
      pubkey_verifiers: pubkey,
    },
  },
    el('div', { className: 'bv-row__layout' },
      el('div', { className: `verification-card__avatar ${pubkey ? `profile-${pubkey}` : 'profile-unknown'}` }),
      el('div', { className: 'bv-row__text' },
        verifierName(pubkey),
        el('time', { className: 'bv-row__when', title: formatDate(verification.created_at) }, formatCommentDate(verification.created_at)),
        el('div', { className: 'bv-row__meta' },
          statusPill(status),
          draft ? el('span', { className: 'verification-draft-badge' }, 'Draft') : null,
        ),
      ),
      el('span', { className: 'bv-row__chevron', 'aria-hidden': 'true', html: CHEVRON_SVG }),
    ),
  );
}

function emptyRow(version) {
  return el('div', { className: 'bv-row bv-row--empty' },
    el('div', { className: 'bv-row__layout' },
      el('div', { className: 'bv-row__avatar-empty', 'aria-hidden': 'true' }, '?'),
      el('div', { className: 'bv-row__text' },
        el('span', { className: 'bv-row__name' }, 'No verifications yet'),
        el('span', { className: 'bv-row__when' },
          version.builds.some(b => b.hasAssets) ? 'The files are registered; nobody has tested them' : 'Nobody has sent this version in',
        ),
      ),
    ),
  );
}

function whoTested(version, { walletTitle, appId, platform, userPubkey }) {
  const rows = [];
  const multi = version.builds.length > 1;
  version.builds.forEach((build, index) => {
    const shown = build.verifications.concat(build.drafts.filter(d => userPubkey && d.pubkey === userPubkey));
    if (multi) {
      rows.push(el('div', { className: 'bv-build-caption' }, buildLabel(build, index, version.builds.length, HASH_PREFIX_LENGTH)));
    }
    if (shown.length === 0) {
      rows.push(emptyRow({ builds: [build] }));
      return;
    }
    for (const verification of shown) {
      rows.push(verificationRow(verification, build, { appId, platform, userPubkey }));
    }
  });
  if (rows.length === 0) {
    rows.push(emptyRow(version));
  }
  return el('section', { className: 'bv-panel bv-who', 'aria-label': 'Who tested this version' },
    el('h4', { className: 'bv-caption' }, `Who tested ${walletTitle} ${version.name}`.trim()),
    el('div', { className: 'bv-rows' }, rows),
  );
}

// ---------------------------------------------------------------- files

function fileMark(verdict) {
  const [mark, modifier, label] = verdict === 'reproducible'
    ? ['✓', 'reproducible', 'Reproducible in a verification']
    : verdict === 'not_reproducible'
      ? ['✗', 'not-reproducible', 'Not reproducible in a verification']
      : ['–', 'unverified', 'No reproducibility result for this file yet'];
  return el('span', { className: `bv-file__mark bv-file__mark--${modifier}`, role: 'img', 'aria-label': label, title: label }, mark);
}

function fileRow(file, hashVerdictIndex) {
  const hash = isSha256Hex(file.hash) ? file.hash : '';
  const name = file.fileName || '';
  const download = el('button', {
    type: 'button',
    className: 'bv-file__download js-download-blossom-file',
    hidden: true,
    title: 'Download from Blossom',
    'aria-label': `Download ${name || hash.slice(0, HASH_PREFIX_LENGTH)} from Blossom`,
    dataset: { fileHash: hash, fileName: name },
  }, el('span', { 'aria-hidden': 'true', html: DOWNLOAD_SVG }));
  if (hash) {
    checkFileExistsInBlossom(hash).then(exists => {
      if (exists) {
        download.hidden = false;
      }
    }).catch(() => {});
  }
  return el('li', { className: 'bv-file' },
    fileMark(fileVerdict(hash, hashVerdictIndex)),
    el('span', { className: 'bv-file__name', title: name }, name || 'file'),
    el('span', { className: 'hash-row bv-file__hash' },
      el('span', { className: 'bv-file__hash-text', title: hash }, hash.slice(0, HASH_PREFIX_LENGTH)),
      el('button', {
        type: 'button',
        className: 'hash-copy-btn js-copy-hash',
        dataset: { hash },
        title: 'Copy hash to clipboard',
        'aria-label': 'Copy hash to clipboard',
      }, el('span', { className: 'hash-copy-btn__icon', 'aria-hidden': 'true', html: COPY_SVG })),
    ),
    download,
  );
}

function files(version, hashVerdictIndex) {
  const builds = version.builds.filter(b => b.files.length > 0);
  if (builds.length === 0) {
    return null;
  }
  const multi = builds.length > 1;
  const blocks = builds.map((build, index) => el('div', { className: 'bv-build' },
    multi ? el('div', { className: 'bv-build-caption' }, buildLabel(build, index, builds.length, HASH_PREFIX_LENGTH)) : null,
    el('ul', { className: 'bv-files' }, build.files.map(file => fileRow(file, hashVerdictIndex))),
    build.description ? el('p', { className: 'bv-build__description', title: build.description }, build.description) : null,
  ));
  return el('section', { className: 'bv-panel bv-files-panel', 'aria-label': 'Files' },
    el('h4', { className: 'bv-caption' }, 'Files'),
    blocks,
  );
}

// ---------------------------------------------------------------- the section

function actions(version, { appId, platform }) {
  return el('div', { className: 'bv-actions' },
    createVerificationActionLink({
      identifier: appId,
      version: version.name,
      platform,
      label: version.verifications.length ? 'Create another verification' : 'Create verification',
    }),
  );
}

function panel(version, context) {
  return el('div', { className: 'bv-selected', dataset: { versionKey: version.key } },
    el('h4', { className: 'bv-headline', 'aria-live': 'polite' }, headlineFor(version)),
    el('p', { className: 'bv-lede' }, ledeFor(version, context.walletTitle)),
    whoTested(version, context),
    files(version, context.hashVerdictIndex),
    actions(version, context),
  );
}

/**
 * Paints the section into [host] from the assets table's [rows]. Returns the key of the
 * version shown, or null when there is nothing to show (the host is then hidden).
 */
export function renderBuildVerifications({
  host,
  rows,
  assetInfo,
  appId,
  platform,
  walletTitle = '',
  latestVersion = '',
}) {
  if (!host) {
    return null;
  }
  const timeline = buildVersionTimeline(rows, { latestVersion });
  if (timeline.length === 0) {
    host.hidden = true;
    host.replaceChildren();
    return null;
  }
  host.hidden = false;

  const keys = new Set(timeline.map(v => v.key));
  let selectedKey = host.dataset.selectedVersion;
  if (!keys.has(selectedKey)) {
    selectedKey = versionKeyOfVerification(timeline, getVerificationIdFromHash()) || defaultVersionKey(timeline);
  }
  host.dataset.selectedVersion = selectedKey;

  const context = {
    appId,
    platform,
    walletTitle,
    userPubkey: typeof window !== 'undefined' ? window.userPubkey : null,
    hashVerdictIndex: buildHashVerdictIndex(assetInfo?.verifications),
  };

  const riverEl = river(timeline, selectedKey);
  const panelHost = el('div', { className: 'bv-panel-host' });
  host.replaceChildren(riverEl, panelHost);

  const paintSelected = () => {
    const version = timeline.find(v => v.key === host.dataset.selectedVersion) || timeline[timeline.length - 1];
    panelHost.replaceChildren(panel(version, context));
    renderProfilePictures([...new Set(
      version.verifications.concat(version.drafts).map(v => v.pubkey).filter(isSha256Hex),
    )]);
  };

  const scroller = riverEl.querySelector('.bv-river');
  riverEl.addEventListener('click', (event) => {
    const button = event.target.closest('.bv-stone[data-version-key]');
    if (!button || !riverEl.contains(button)) {
      return;
    }
    const key = button.dataset.versionKey;
    if (!keys.has(key)) {
      return;
    }
    host.dataset.selectedVersion = key;
    scroller.querySelectorAll('.bv-stone').forEach(stoneEl => {
      stoneEl.setAttribute('aria-pressed', stoneEl.dataset.versionKey === key ? 'true' : 'false');
    });
    centerStone(scroller, button);
    paintSelected();
  });

  paintSelected();
  const selectedStone = [...scroller.querySelectorAll('.bv-stone')].find(s => s.dataset.versionKey === selectedKey);
  if (selectedStone && typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(() => centerStone(scroller, selectedStone));
  }
  return selectedKey;
}

if (typeof window !== 'undefined') {
  window.renderBuildVerifications = renderBuildVerifications;
}
