// The CVE records a library's own maintainers publish.
//
// OpenSSL, CPython and Qt assign their own CVE ids (each is a CVE Numbering
// Authority) and write the affected version ranges into the record on the day
// it is published. NVD adds its product data (CPE) days or months later, or
// never, and until then a lookup by product (plugins/osv.mjs nvdLookup) does
// not find the CVE: on 2026-11-22 NVD had product data for 2 of Qt's 51 CVEs
// and for 24 of CPython's 96. So for a library whose vendor publishes its own
// records, each record is asked whether it names the shipped version.
//
// plugins/osv.mjs gets the list of a vendor's CVEs from NVD (by
// `sourceIdentifier`, analysed or not); the records come from the CVE
// Program (CVE_API). They are kept on disk under CVE_RECORDS_DIR with NVD's
// lastModified, so an hourly pass fetches only the ones that changed, and an
// outage of the CVE Program's API costs nothing that was read before.
//
// A record only adds findings. One that does not name the shipped version
// removes nothing: older records give their ranges as prose ("Fixed in
// OpenSSL 1.1.1c (Affected 1.1.1-1.1.1b)"), and a version outside the listed
// ranges may be on a release line the vendor no longer looks at.
import fs from 'fs';
import path from 'path';

export const CVE_API = 'https://cveawg.mitre.org/api/cve';
const RECORD_CONCURRENCY = 8;
const STORE_VERSION = 1;

const VERSION = /^v?\d[0-9A-Za-z.+_-]*$/;
// 3.15.0a1, 3.14.5rc1, 3.0.0-alpha1: a pre-release of the version before the
// suffix. OpenSSL's 1.1.1w is a release: no number follows the letter.
const PRE_RELEASE = /[-.]?(?:a|b|c|rc|alpha|beta|pre|dev)[-.]?\d+$/i;

// A range bound as a release: among releases, "from 3.15.0a1" is "from
// 3.15.0" and "before 3.14.5rc1" or "up to 3.14.5rc1" is "before 3.14.5".
// Null for a bound that is no version ("n/a", a sentence, a commit).
function bound(text) {
  const value = String(text ?? '').trim();
  if (!VERSION.test(value) || /^[0-9a-f]{40}$/i.test(value)) return null;
  const release = value.replace(/^v(?=\d)/, '').replace(PRE_RELEASE, '');
  return { release, pre: release.length < value.replace(/^v(?=\d)/, '').length };
}

// Whether one `versions` entry of a record covers the version: true, false,
// or null when the entry cannot be read.
function covers(entry, version, compare) {
  if (!entry || entry.versionType === 'git') return null;
  const open = v => v === '*' || v === '0' || v === undefined || v === null || v === '';
  const upper = entry.lessThan ?? entry.lessThanOrEqual ?? undefined;
  if (upper === undefined) {
    const exact = bound(entry.version);
    return exact ? !exact.pre && compare(version, exact.release) === 0 : null;
  }
  const from = open(entry.version) ? null : bound(entry.version);
  const to = upper === '*' ? null : bound(upper);
  if ((from === null && !open(entry.version)) || (to === null && upper !== '*')) return null;
  if (from && compare(version, from.release) < 0) return false;
  if (!to) return true;
  const c = compare(version, to.release);
  return entry.lessThan != null || to.pre ? c < 0 : c <= 0;
}

/**
 * How a vendor's record names this version of the product: { events, modules }
 * when it lists it as affected (the range as OSV-style events, and the
 * product's modules the record names, Qt's "qtbase"), else null: not listed,
 * listed as unaffected, or not readable.
 */
export function vendorMatch(record, product, version, compare) {
  const modules = new Set();
  let events = null;
  for (const affected of Array.isArray(record?.affected) ? record.affected : []) {
    if (!product.test(String(affected?.product || '').trim())) continue;
    let status = null;
    let range = null;
    for (const entry of Array.isArray(affected.versions) ? affected.versions : []) {
      if (covers(entry, version, compare) !== true) continue;
      status = entry.status;
      range = entry;
      break;
    }
    if ((status ?? affected.defaultStatus) !== 'affected') continue;
    for (const m of Array.isArray(affected.modules) ? affected.modules : []) modules.add(String(m));
    if (events) continue;
    const from = range && range.version !== '*' && bound(range.version) ? String(range.version) : '0';
    events = [{ introduced: from },
      range?.lessThan && range.lessThan !== '*' ? { fixed: String(range.lessThan) }
        : range?.lessThanOrEqual && range.lessThanOrEqual !== '*' ? { last_affected: String(range.lessThanOrEqual) }
          : range && range.lessThan == null && range.lessThanOrEqual == null ? { last_affected: String(range.version) } : null,
    ].filter(Boolean);
  }
  return events ? { events, modules: [...modules].sort() } : null;
}

// The vendor's own rating first, in whichever form it gives one (OpenSSL
// writes "Low" under its security policy), then the ratings others added.
function rating(metrics) {
  for (const m of metrics || []) {
    const v3 = m.cvssV3_1 || m.cvssV3_0;
    if (v3?.vectorString) return { severity: [{ type: 'CVSS_V3', score: v3.vectorString }], database_specific: {} };
    const label = String(m.cvssV4_0?.baseSeverity ?? m.other?.content?.text ?? m.other?.content?.value ?? '').toLowerCase();
    if (['critical', 'high', 'moderate', 'medium', 'low'].includes(label)) return { severity: [], database_specific: { severity: label } };
  }
  return { severity: [], database_specific: {} };
}

/** A vendor's record as an OSV record for query `q`, so severity, fix and folding treat it like the others. */
export function vendorAdvisory(id, record, match, q) {
  const text = record.title || String(record.description || '').split('\n')[0].slice(0, 200);
  return {
    id,
    aliases: [],
    // which part of the product, where the vendor says: one Qt row stands for every module of the release
    summary: match.modules.length ? `${match.modules.join(', ')}: ${text}` : text,
    details: record.description || '',
    ...rating(record.metrics),
    affected: [{ package: { ecosystem: q.ecosystem, name: q.name }, ranges: [{ type: 'ECOSYSTEM', events: match.events }] }],
  };
}

// What is kept of a CVE Program record: the vendor's part, and every rating.
function slim(data, lastModified) {
  const cna = data?.containers?.cna || {};
  const adp = data?.containers?.adp || [];
  return {
    lastModified,
    title: cna.title || '',
    description: (cna.descriptions || []).find(d => /^en/i.test(d.lang || ''))?.value || '',
    affected: cna.affected || [],
    metrics: [...(cna.metrics || []), ...adp.flatMap(a => a.metrics || [])],
  };
}

const storeFile = (dir, source) => path.join(dir, `${String(source).replace(/[^A-Za-z0-9._-]+/g, '_')}.json`);

function readStore(dir, source) {
  if (!dir) return {};
  try {
    const stored = JSON.parse(fs.readFileSync(storeFile(dir, source), 'utf8'));
    return stored.version === STORE_VERSION ? stored.records || {} : {};
  } catch {
    return {}; // no file yet, or one cut short: read the records again
  }
}

// The store saves requests, nothing else: a write that fails costs the next
// pass the same fetches, not this one its records.
function writeStore(dir, source, records) {
  if (!dir) return;
  try {
    fs.mkdirSync(dir, { recursive: true });
    const file = storeFile(dir, source);
    fs.writeFileSync(`${file}.tmp-${process.pid}`, JSON.stringify({ version: STORE_VERSION, records }));
    fs.renameSync(`${file}.tmp-${process.pid}`, file);
  } catch (error) {
    console.log(`CVE records of ${source} could not be stored under ${dir}: ${error.message}`);
  }
}

/**
 * The records of a vendor's CVEs, id -> record. `listed` is NVD's list of
 * them ({ id, lastModified }); `fetchRecord(id)` resolves to the CVE Program's
 * record, or null when it has none. A record is fetched when it is not stored
 * under `dir` or NVD's lastModified moved; one that cannot be fetched is
 * answered from the stored copy, and fails the whole read when there is none:
 * a vendor's advisories with one unread are not that vendor's advisories.
 * So does a list of which no record at all could be had. An empty list reads
 * nothing and leaves the store as it is.
 */
export async function vendorRecords(source, listed, { dir, fetchRecord }) {
  if (!listed.length) return new Map();
  const stored = readStore(dir, source);
  const records = {};
  const todo = [];
  for (const { id, lastModified } of listed) {
    if (stored[id]?.lastModified === lastModified) records[id] = stored[id];
    else todo.push({ id, lastModified });
  }
  let index = 0;
  let failure = null;
  const worker = async () => {
    while (index < todo.length && !failure) {
      const { id, lastModified } = todo[index++];
      try {
        const data = await fetchRecord(id);
        if (data && !data.containers?.cna) throw new Error(`${id}: the answer is not a CVE record`);
        if (data) records[id] = slim(data, lastModified);
      } catch (error) {
        if (stored[id]) records[id] = stored[id]; // older than NVD's, asked for again next time
        else failure = error;
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(RECORD_CONCURRENCY, todo.length) }, worker));
  // what was read is kept even when one record failed: the next pass asks only for the rest
  if (todo.length || Object.keys(stored).length !== Object.keys(records).length) writeStore(dir, source, { ...(failure ? stored : {}), ...records });
  if (failure) throw failure;
  if (!Object.keys(records).length) throw new Error(`no record for any of the ${listed.length} CVEs listed for ${source}`);
  return new Map(listed.filter(l => records[l.id]).map(l => [l.id, records[l.id]]));
}
