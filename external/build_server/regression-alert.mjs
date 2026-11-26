// Regression alerts: tell Carol in Buzz when an app's script may need a fix.
//
// ABS rebuilds new versions with the script of an earlier verification. When
// that earlier verification was reproducible and the new build comes out
// ftbfs or not_reproducible, or it was not_reproducible and the new build
// comes out ftbfs, the script most likely needs an update. not_reproducible
// after not_reproducible is not alerted: the differences are usually upstream,
// and a script fix cannot remove them. Each such
// regression is recorded once per (app, version) in `regression_alerts`, then
// one Buzz message lists every regression not delivered yet and tags Carol, so
// a failed delivery is picked up by the next one.
//
// Skipped-signer alerts work the same way. An Android APK whose signer differs
// from every APK its scripts were verified on gets no script at all (see
// selectCandidatesBySigner), so no verdict is published and the asset would be
// invisible. Each one is recorded once per (app, signer) in
// `skipped_signer_alerts` and listed in its own message. The first line of each
// message says which kind it is: [regression] or [skipped signer].
//
// Only while FEATURE_REGRESSION_ALERTS is true. The message is signed with the
// WalletScrutiny Notification account, loaded like source_analysis/alerts.mjs:
// ALERT_NOSTR_NSEC_FILE (LoadCredentialEncrypted=source-analysis-alert-nsec).
// Nothing here changes a verdict, and any error is logged and swallowed.

import { createHash, randomUUID } from 'node:crypto';
import { compareVersions, getFirstTagValue, loadSecret } from './utils.mjs';
import { appLog } from './logger.mjs';
import {
  FEATURE_REGRESSION_ALERTS,
  REGRESSION_ALERT_RELAY_URL,
  REGRESSION_ALERT_CHANNEL_ID,
  REGRESSION_ALERT_MENTION,
  REGRESSION_ALERT_TIMEOUT_SECONDS,
  REGRESSION_ALERT_APP_IDS,
  SKIPPED_SIGNER_ALERT_APP_IDS
} from './config/config.mjs';

// Verdicts that count as a regression, by status of the base verification.
const REGRESSED_VERDICTS = {
  reproducible: ['ftbfs', 'not_reproducible'],
  not_reproducible: ['ftbfs']
};

function stripV(version) {
  return (version ?? '').replace(/^v/i, '');
}

/**
 * True when `verdict` for `newVersion` is a regression from
 * `baseVerification`: reproducible to ftbfs or not_reproducible, or
 * not_reproducible to ftbfs, and the new version is strictly newer. Versions
 * that do not start with a digit are skipped.
 */
export function isRegression(baseVerification, newVersion, verdict) {
  const baseStatus = getFirstTagValue(baseVerification, 'status');
  if (!Object.hasOwn(REGRESSED_VERDICTS, baseStatus)) return false;
  if (!REGRESSED_VERDICTS[baseStatus].includes(verdict)) return false;
  const baseVersion = stripV(getFirstTagValue(baseVerification, 'version'));
  const version = stripV(newVersion);
  if (!/^\d/.test(baseVersion) || !/^\d/.test(version)) return false;
  return compareVersions(baseVersion, version) > 0;
}

export function ensureRegressionAlertsTable(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS regression_alerts (
      appId TEXT NOT NULL,
      version TEXT NOT NULL,
      platform TEXT NOT NULL,
      verdict TEXT NOT NULL,
      baseVersion TEXT NOT NULL,
      baseVerificationId TEXT NOT NULL,
      verificationEventId TEXT,
      buildScriptEventId TEXT,
      createdAt TEXT DEFAULT (datetime('now')),
      notifiedAt TEXT,
      PRIMARY KEY (appId, version)
    );
  `);
}

/**
 * Record one regression. Later architectures or repeat registrations of the
 * same app and version are ignored. Returns true when the row is new.
 */
export function recordRegression(db, row) {
  ensureRegressionAlertsTable(db);
  const result = db.prepare(`
    INSERT OR IGNORE INTO regression_alerts
      (appId, version, platform, verdict, baseVersion, baseVerificationId, verificationEventId, buildScriptEventId)
    VALUES (@appId, @version, @platform, @verdict, @baseVersion, @baseVerificationId, @verificationEventId, @buildScriptEventId)
  `).run({ verificationEventId: null, buildScriptEventId: null, ...row });
  return result.changes > 0;
}

export function regressionAlertText(rows, mentionName) {
  const lines = [
    `🚨 [regression] @${mentionName} ABS regression alert: ${rows.length === 1 ? 'an app regressed' : `${rows.length} apps regressed`}.`,
    ''
  ];
  for (const r of rows) {
    lines.push(`- ${r.appId} ${r.version} (${r.platform}): ${r.verdict}, base ${r.baseVersion}`);
    lines.push(`  verification ${r.verificationEventId ?? 'unknown'}, script from ${r.baseVerificationId}`);
  }
  return lines.join('\n');
}

export function ensureSkippedSignerAlertsTable(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS skipped_signer_alerts (
      appId TEXT NOT NULL,
      signer TEXT NOT NULL,
      version TEXT NOT NULL,
      platform TEXT NOT NULL,
      assetEventId TEXT,
      fileHash TEXT,
      scripts TEXT NOT NULL,
      createdAt TEXT DEFAULT (datetime('now')),
      notifiedAt TEXT,
      PRIMARY KEY (appId, signer)
    );
  `);
}

/**
 * Record one skipped asset. Later versions on the same signer are ignored:
 * once one of them is verified by hand, the signer is known and ABS picks the
 * script up by itself. Returns true when the row is new.
 */
export function recordSkippedSigner(db, row) {
  ensureSkippedSignerAlertsTable(db);
  const result = db.prepare(`
    INSERT OR IGNORE INTO skipped_signer_alerts
      (appId, signer, version, platform, assetEventId, fileHash, scripts)
    VALUES (@appId, @signer, @version, @platform, @assetEventId, @fileHash, @scripts)
  `).run({ assetEventId: null, fileHash: null, ...row });
  return result.changes > 0;
}

export function skippedSignerAlertText(rows, mentionName) {
  const lines = [
    `🚨 [skipped signer] @${mentionName} ABS skipped ${rows.length === 1 ? 'an APK' : `${rows.length} APKs`} on a signer no script was verified on.`,
    ''
  ];
  for (const r of rows) {
    lines.push(`- ${r.appId} ${r.version} (${r.platform}): signer ${r.signer}`);
    lines.push(`  asset ${r.assetEventId ?? 'unknown'}, file ${r.fileHash ?? 'unknown'}`);
    lines.push(`  scripts not tried: ${r.scripts}`);
  }
  return lines.join('\n');
}

function secretKeyBytes(secret, nip19) {
  const s = secret.trim();
  if (s.startsWith('nsec1')) return nip19.decode(s).data;
  if (/^[0-9a-f]{64}$/i.test(s)) return Uint8Array.from(Buffer.from(s, 'hex'));
  throw new Error('alert key is neither nsec nor 64-char hex');
}

/**
 * Post `content` as a kind 9 message in the Buzz channel through the relay's
 * HTTP API (POST /events with a NIP-98 Authorization header).
 */
export async function postToBuzz(content, { secret, relayUrl = REGRESSION_ALERT_RELAY_URL, channelId = REGRESSION_ALERT_CHANNEL_ID, mentionPubkey = REGRESSION_ALERT_MENTION.pubkey, timeoutMs = REGRESSION_ALERT_TIMEOUT_SECONDS * 1000, fetchImpl = globalThis.fetch } = {}) {
  const { finalizeEvent, nip19 } = await import('nostr-tools');
  const sk = secretKeyBytes(secret, nip19);
  const now = Math.floor(Date.now() / 1000);
  const message = finalizeEvent({
    kind: 9,
    created_at: now,
    tags: [['h', channelId], ['p', mentionPubkey]],
    content
  }, sk);

  const url = `${relayUrl.replace(/\/+$/, '')}/events`;
  const body = JSON.stringify(message);
  const auth = finalizeEvent({
    kind: 27235,
    created_at: now,
    tags: [
      ['u', url],
      ['method', 'POST'],
      ['nonce', randomUUID()],
      ['payload', createHash('sha256').update(body).digest('hex')]
    ],
    content: ''
  }, sk);

  const res = await fetchImpl(url, {
    method: 'POST',
    headers: {
      Authorization: `Nostr ${Buffer.from(JSON.stringify(auth)).toString('base64')}`,
      'Content-Type': 'application/json'
    },
    body,
    signal: AbortSignal.timeout(timeoutMs)
  });
  if (!res.ok) {
    throw new Error(`buzz: HTTP ${res.status} ${(await res.text().catch(() => '')).slice(0, 200)}`);
  }
  return message.id;
}

/**
 * Send one message listing every regression not delivered yet, and mark them
 * delivered when the relay accepts it. Returns the number of rows sent.
 */
export async function deliverRegressionAlerts(db, { send, mentionName = REGRESSION_ALERT_MENTION.name } = {}) {
  ensureRegressionAlertsTable(db);
  const pending = db.prepare(`SELECT * FROM regression_alerts WHERE notifiedAt IS NULL ORDER BY createdAt, appId`).all();
  if (!pending.length) return 0;
  await send(regressionAlertText(pending, mentionName));
  const mark = db.prepare(`UPDATE regression_alerts SET notifiedAt = datetime('now') WHERE appId = ? AND version = ?`);
  for (const r of pending) mark.run(r.appId, r.version);
  return pending.length;
}

/**
 * Send one message listing every skipped signer not delivered yet, and mark
 * them delivered when the relay accepts it. Returns the number of rows sent.
 */
export async function deliverSkippedSignerAlerts(db, { send, mentionName = REGRESSION_ALERT_MENTION.name } = {}) {
  ensureSkippedSignerAlertsTable(db);
  const pending = db.prepare(`SELECT * FROM skipped_signer_alerts WHERE notifiedAt IS NULL ORDER BY createdAt, appId`).all();
  if (!pending.length) return 0;
  await send(skippedSignerAlertText(pending, mentionName));
  const mark = db.prepare(`UPDATE skipped_signer_alerts SET notifiedAt = datetime('now') WHERE appId = ? AND signer = ?`);
  for (const r of pending) mark.run(r.appId, r.signer);
  return pending.length;
}

function loadAlertSecret() {
  return loadSecret({ name: 'ALERT_NOSTR_NSEC', fileEnv: 'ALERT_NOSTR_NSEC_FILE', argName: 'alertNostrNsec' });
}

async function deliverWithConfiguredKey(db) {
  const secret = loadAlertSecret();
  return deliverRegressionAlerts(db, { send: content => postToBuzz(content, { secret }) });
}

async function deliverSkippedWithConfiguredKey(db) {
  const secret = loadAlertSecret();
  return deliverSkippedSignerAlerts(db, { send: content => postToBuzz(content, { secret }) });
}

/**
 * Hook for a freshly published ABS verdict. Never throws.
 */
export async function alertIfRegression(db, { baseVerification, appId, version, platform, verdict, verificationEventId, buildScriptEventId }, { enabled = FEATURE_REGRESSION_ALERTS, appIds = REGRESSION_ALERT_APP_IDS, deliver = deliverWithConfiguredKey } = {}) {
  if (!enabled) return;
  if (appIds.length && !appIds.includes(appId)) return;
  try {
    if (!isRegression(baseVerification, version, verdict)) return;
    const fresh = recordRegression(db, {
      appId,
      version,
      platform,
      verdict,
      baseVersion: stripV(getFirstTagValue(baseVerification, 'version')),
      baseVerificationId: baseVerification.id,
      verificationEventId,
      buildScriptEventId
    });
    if (!fresh) return;
    const sent = await deliver(db);
    appLog.info(`[REGRESSION_ALERT] ${appId} ${version} ${verdict}: sent ${sent} regression(s) to Buzz`);
  } catch (error) {
    appLog.error(`[REGRESSION_ALERT] ${appId} ${version}: alert not sent, retried with the next one or next cycle: ${error?.message ?? error}`);
  }
}

/**
 * Hook for an Android asset that got no script because every candidate script
 * was verified only on other signers. `scripts` maps each script name to the
 * signers it was verified on. Never throws.
 */
export async function alertSkippedSigner(db, { appId, version, platform, signer, assetEventId, fileHash, scripts }, { enabled = FEATURE_REGRESSION_ALERTS, appIds = SKIPPED_SIGNER_ALERT_APP_IDS, deliver = deliverSkippedWithConfiguredKey } = {}) {
  if (!enabled) return;
  if (appIds.length && !appIds.includes(appId)) return;
  try {
    const fresh = recordSkippedSigner(db, {
      appId,
      signer,
      version,
      platform,
      assetEventId,
      fileHash,
      scripts: [...scripts].map(([name, signers]) => `${name} (${[...signers].join(', ')})`).join('; ')
    });
    if (!fresh) return;
    const sent = await deliver(db);
    appLog.info(`[SKIPPED_SIGNER_ALERT] ${appId} ${version} signer ${signer}: sent ${sent} skipped signer(s) to Buzz`);
  } catch (error) {
    appLog.error(`[SKIPPED_SIGNER_ALERT] ${appId} ${version}: alert not sent, retried with the next one or next cycle: ${error?.message ?? error}`);
  }
}

/**
 * Retry regressions whose alert failed earlier. Called once per main cycle.
 * Never throws.
 */
export async function retryPendingRegressionAlerts(db, { enabled = FEATURE_REGRESSION_ALERTS, deliver = deliverWithConfiguredKey, deliverSkipped = deliverSkippedWithConfiguredKey } = {}) {
  if (!enabled) return;
  try {
    ensureRegressionAlertsTable(db);
    const { n } = db.prepare(`SELECT COUNT(*) AS n FROM regression_alerts WHERE notifiedAt IS NULL`).get();
    if (n) {
      const sent = await deliver(db);
      appLog.info(`[REGRESSION_ALERT] retried: sent ${sent} pending regression(s) to Buzz`);
    }
  } catch (error) {
    appLog.error(`[REGRESSION_ALERT] retry failed: ${error?.message ?? error}`);
  }
  try {
    ensureSkippedSignerAlertsTable(db);
    const { n } = db.prepare(`SELECT COUNT(*) AS n FROM skipped_signer_alerts WHERE notifiedAt IS NULL`).get();
    if (n) {
      const sent = await deliverSkipped(db);
      appLog.info(`[SKIPPED_SIGNER_ALERT] retried: sent ${sent} pending skipped signer(s) to Buzz`);
    }
  } catch (error) {
    appLog.error(`[SKIPPED_SIGNER_ALERT] retry failed: ${error?.message ?? error}`);
  }
}
