// The wallet page's "Build Verifications" section, worked out from the assets table's rows and
// nothing else, so the renderer only draws it. Mirrors the Android app's wallet page
// (GlassModel.kt): one stone per version, and for the picked version who tested it and which
// files each build of it has.
//
// A row is one build: one file set (bundle or single file) with every asset registration and
// verification naming it. A version can have several builds (a Play upload and an F-Droid one,
// two language splits, a re-upload with a new base.apk). The website knows nothing about what
// the reader has installed, so unlike the app no build is "yours".

import { verificationDraftKind } from './nostr-constants.mjs';
import { getFirstTagValue, getStatusText } from './verifications_common.mjs';

/** A verifier's verdict, the way the app counts it: reproduced, not reproduced, could not build, or something else. */
export function statusGroup(status) {
  switch (status) {
    case 'reproducible':
      return 'reproducible';
    case 'not_reproducible':
      return 'notReproducible';
    case 'ftbfs':
      return 'failedToBuild';
    default:
      return 'other';
  }
}

/** Published verifications counted per verdict, plus the glass they add up to. */
export function tally(verifications) {
  const counts = { reproducible: 0, notReproducible: 0, failedToBuild: 0, other: 0 };
  for (const verification of verifications) {
    counts[statusGroup(getFirstTagValue(verification, 'status'))] += 1;
  }
  const cracks = counts.notReproducible + counts.failedToBuild;
  let glass = 'frosted';
  if (counts.reproducible > 0 && cracks > 0) {
    glass = 'split';
  } else if (counts.reproducible > 0) {
    glass = 'crystal';
  } else if (cracks > 0) {
    glass = 'cracked';
  }
  return { ...counts, cracks, glass };
}

export function normalizeVersionName(version) {
  return String(version ?? '').trim().replace(/^[vV](?=\d)/, '');
}

/**
 * Oldest first. Numeric parts decide; on a tie a pre-release ("13.2.2-rc1") comes before
 * the release it precedes ("13.2.2"), and two pre-releases sort by name.
 */
export function compareVersionNames(a, b) {
  const na = normalizeVersionName(a);
  const nb = normalizeVersionName(b);
  const partsA = na.split('.').map(part => parseInt(part, 10) || 0);
  const partsB = nb.split('.').map(part => parseInt(part, 10) || 0);
  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const diff = (partsA[i] || 0) - (partsB[i] || 0);
    if (diff !== 0) {
      return diff;
    }
  }
  const preA = /[-+]/.test(na);
  const preB = /[-+]/.test(nb);
  if (preA !== preB) {
    return preA ? -1 : 1;
  }
  return na.localeCompare(nb);
}

function isDraft(event) {
  return event?.kind === verificationDraftKind;
}

/**
 * Every version of the wallet, oldest first, each with its builds and the verifications of
 * them. Rows without a version tag have no place on a timeline and are left out.
 *
 * @param {Array<{ sha256: string, summary: object }>} rows the assets table's rows, each with
 *   the `summary` paintMainAssetsTable attaches
 * @param {{ latestVersion?: string }} options the version WalletScrutiny found in the store,
 *   so its stone can say so
 */
export function buildVersionTimeline(rows, { latestVersion = '' } = {}) {
  const latest = normalizeVersionName(latestVersion);
  const byName = new Map();
  for (const row of rows || []) {
    const summary = row?.summary;
    if (!summary) {
      continue;
    }
    const name = normalizeVersionName(summary.version);
    if (!name) {
      continue;
    }
    let version = byName.get(name);
    if (!version) {
      version = { name, key: name, builds: [], verifications: [], drafts: [] };
      byName.set(name, version);
    }
    const published = [];
    const drafts = [];
    for (const attestation of summary.attestations || []) {
      (isDraft(attestation) ? drafts : published).push(attestation);
    }
    published.sort((a, b) => b.created_at - a.created_at);
    version.builds.push({
      sha256: row.sha256 || '',
      files: summary.files || [],
      description: summary.description || '',
      hasAssets: Boolean(summary.hasAssets),
      verifications: published,
      drafts,
      identifier: summary.identifier || '',
      platform: summary.platform || '',
    });
    version.verifications.push(...published);
    version.drafts.push(...drafts);
  }

  const timeline = [...byName.values()];
  for (const version of timeline) {
    version.verifications.sort((a, b) => b.created_at - a.created_at);
    version.tally = tally(version.verifications);
    version.glass = version.tally.glass;
    version.hasWarning = version.verifications.some(v => getFirstTagValue(v, 'status') === 'warning');
    version.latest = latest !== '' && version.name === latest;
  }
  timeline.sort((a, b) => compareVersionNames(a.name, b.name));
  return timeline;
}

/** The version the section opens on: the newest. */
export function defaultVersionKey(timeline) {
  return timeline.length ? timeline[timeline.length - 1].key : null;
}

/** The version holding the verification [eventId], or null. */
export function versionKeyOfVerification(timeline, eventId) {
  if (!eventId) {
    return null;
  }
  const match = timeline.find(version =>
    version.verifications.some(v => v.id === eventId) || version.drafts.some(v => v.id === eventId));
  return match ? match.key : null;
}

function plural(count, singular, pluralWord = `${singular}s`) {
  return `${count} ${count === 1 ? singular : pluralWord}`;
}

/** The big line above the rows: what the verifications of a version add up to. */
export function headlineFor(version) {
  const t = version.tally;
  switch (version.glass) {
    case 'crystal':
      return `${plural(t.reproducible, 'verifier')} found it reproducible`;
    case 'cracked':
      return t.notReproducible > 0
        ? `${plural(t.cracks, 'verifier')} could not reproduce it`
        : `The build failed for ${plural(t.failedToBuild, 'verifier')}`;
    case 'split':
      return `${t.reproducible} reproducible, ${t.cracks} not reproducible`;
    default:
      return version.verifications.length
        ? getStatusText(getFirstTagValue(version.verifications[0], 'status'), true)
        : 'Nobody has tested this build yet';
  }
}

/** The sentence under the headline. */
export function ledeFor(version, walletTitle) {
  const subject = `${walletTitle} ${version.name}`.trim();
  const t = version.tally;
  switch (version.glass) {
    case 'crystal':
      return `Verifiers built ${subject} from its public source code and got exactly the app its developer published.`;
    case 'cracked':
      return t.notReproducible > 0
        ? `Verifiers built ${subject} from its public source code and got a different app than the one its developer published.`
        : `Nobody managed to build ${subject} from its source code, so it could not be checked.`;
    case 'split':
      return `Verifiers disagree about ${subject}.`;
    default:
      return version.verifications.length
        ? `Verifiers could not check ${subject}.`
        : `Nobody has tested ${subject} yet.`;
  }
}

/**
 * What a file's mark says, from every published verification of the wallet: a reproducible
 * set vouches for each file in it, a not-reproducible set only says some file in it differed,
 * so a file that reproduced anywhere outranks a failure elsewhere (same rule as the table's
 * hash hints).
 *
 * @param {Map<string, { reproducible: boolean, notReproducible: boolean }>} hashVerdictIndex
 */
export function fileVerdict(hash, hashVerdictIndex) {
  const verdicts = hashVerdictIndex?.get(hash);
  if (!verdicts) {
    return null;
  }
  return verdicts.reproducible ? 'reproducible' : 'not_reproducible';
}

/** A build's one-line label when a version has several: its first file and that file's hash prefix. */
export function buildLabel(build, index, count, hashPrefixLength = 8) {
  const first = build.files[0];
  const name = first?.fileName || 'file';
  const prefix = first?.hash ? ` ${first.hash.slice(0, hashPrefixLength)}` : '';
  return `Build ${index + 1} of ${count} · ${name}${prefix}`;
}
