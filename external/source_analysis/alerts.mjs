// Alerts: findings a person must look at the same day, not whenever someone
// next opens a wallet page. Today one kind: a lockfile pins a registry
// package OSV lists as malicious (MAL-*). A build dependency counts too: it
// runs on the build machine and can patch the artifact (Leo, 2026-10-20).
//
// Each alert is recorded once per (kind, app, release, package, advisory) in
// the `alerts` table and sent to every configured channel; a delivery that
// fails stays pending and is retried after the next analysis. Channels, from
// the environment:
//   ALERT_WEBHOOK_URL       POST of the alert as JSON
//   ALERT_NOSTR_NSEC        the analyser's key, and
//   ALERT_NOSTR_TO          npubs (comma-separated) that get a private
//                           message (NIP-17); default ALERT_RECIPIENTS below
//                           (Leo, 2026-10-20: Leo, Danny, Luis) on
//   ALERT_NOSTR_RELAYS      relays (comma-separated; default below)
// Without any channel the alert is still recorded and printed, and
// `node alerts-cli.mjs` lists what is open.
//
// Nothing here changes a verdict; the alert asks a person to confirm the
// finding (the registry package, not a workspace or an alias) and act.

export const DEFAULT_ALERT_RELAYS = ['wss://relay.nostr.info/', 'wss://relay.damus.io/', 'wss://nos.lol/'];

// Who is told by default: the same identities that settle dependency triage
// on the site (_data/dependencyTriage.yml).
export const ALERT_RECIPIENTS = [
  'npub1gm7tuvr9atc6u7q3gevjfeyfyvmrlul4y67k7u7hcxztz67ceexs078rf6', // Leo
  'npub1r709glp0xx2zvgac45wswufjst5xgr7cear5a8me7x9vazhjzmksp2sf7d', // Danny
  'npub1qw6sxmwrmwpxqsc8cxty62ujvst6j8pmz8hhtwnv54gpn6dh5c4qms4882', // Luis
];

export function ensureAlertsTable(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS alerts (
      kind TEXT NOT NULL,                -- malware
      app_id TEXT NOT NULL,
      version TEXT NOT NULL,
      subject TEXT NOT NULL,             -- ecosystem:name@version
      advisory TEXT NOT NULL,
      details TEXT NOT NULL DEFAULT '{}',
      status TEXT NOT NULL DEFAULT 'open', -- open | confirmed | dismissed
      note TEXT,
      first_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
      notified_at DATETIME,
      PRIMARY KEY (kind, app_id, version, subject, advisory)
    );
  `);
}

// The alert text, the same on every channel.
export function alertText(a) {
  const d = typeof a.details === 'string' ? JSON.parse(a.details || '{}') : (a.details || {});
  const lines = [
    `WalletScrutiny dependency check: possible malware in ${a.app_id} ${a.version}`,
    `${a.subject} is listed as malicious: ${a.advisory} (https://osv.dev/vulnerability/${a.advisory})`,
  ];
  if (d.summary) lines.push(d.summary);
  if (d.scope || d.dependants?.length) lines.push(`Where: ${d.scope || 'unknown'}${d.dependants?.length ? `, required by ${d.dependants.join(', ')}` : ''}`);
  if (d.lockfile) lines.push(`Lockfile: ${d.lockfile}`);
  lines.push('Confirm it is the registry package (not a workspace or an alias), then act; a build dependency can still patch the app.');
  return lines.join('\n');
}

/**
 * Record an alert for every malicious finding of one analysed release.
 * Returns the alerts that are new.
 */
export function recordMalwareAlerts(db, appId, version, findings = []) {
  ensureAlertsTable(db);
  const insert = db.prepare(`INSERT OR IGNORE INTO alerts (kind, app_id, version, subject, advisory, details) VALUES ('malware', ?, ?, ?, ?, ?)`);
  const fresh = [];
  for (const f of findings) {
    if (f.severity !== 'malicious') continue;
    const subject = `${f.ecosystem}:${f.name}@${f.version}`;
    const details = JSON.stringify({ summary: f.summary || null, scope: f.scope || null, dependants: f.dependants || null, direct: f.direct ?? null, lockfile: f.lockfile || null, aliases: f.aliases || [] });
    if (insert.run(appId, version, subject, f.id, details).changes) fresh.push({ kind: 'malware', app_id: appId, version, subject, advisory: f.id, details });
  }
  return fresh;
}

/** The channels configured in `env`, as functions taking an alert. */
export function alertChannels(env = process.env, { fetchImpl = globalThis.fetch } = {}) {
  const channels = [];
  if (env.ALERT_WEBHOOK_URL) {
    channels.push({
      name: 'webhook',
      async send(a) {
        const res = await fetchImpl(env.ALERT_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...a, details: JSON.parse(a.details || '{}'), text: alertText(a) }),
          signal: AbortSignal.timeout(20_000),
        });
        if (!res.ok) throw new Error(`webhook: HTTP ${res.status}`);
      },
    });
  }
  if (env.ALERT_NOSTR_NSEC) {
    channels.push({
      name: 'nostr',
      async send(a) {
        const { nip19, nip17, SimplePool } = await import('nostr-tools');
        const sk = nip19.decode(env.ALERT_NOSTR_NSEC.trim()).data;
        const relays = (env.ALERT_NOSTR_RELAYS || DEFAULT_ALERT_RELAYS.join(',')).split(',').map(s => s.trim()).filter(Boolean);
        const pool = new SimplePool();
        try {
          for (const npub of (env.ALERT_NOSTR_TO ? env.ALERT_NOSTR_TO.split(',') : ALERT_RECIPIENTS).map(s => s.trim()).filter(Boolean)) {
            const recipient = { publicKey: nip19.decode(npub).data, relayUrl: relays[0] };
            const wrap = nip17.wrapEvent(sk, recipient, alertText(a));
            const results = await Promise.allSettled(pool.publish(relays, wrap));
            if (!results.some(r => r.status === 'fulfilled')) throw new Error(`nostr: no relay accepted the message to ${npub}`);
          }
        } finally {
          pool.close(relays);
        }
      },
    });
  }
  return channels;
}

/**
 * Send every open alert that has not been delivered yet. An alert counts as
 * delivered when every channel took it; otherwise it is tried again next
 * time. Returns { sent, failed, channels }.
 */
export async function deliverAlerts(db, { channels = alertChannels(), log = console } = {}) {
  ensureAlertsTable(db);
  const pending = db.prepare(`SELECT * FROM alerts WHERE status = 'open' AND notified_at IS NULL`).all();
  const mark = db.prepare(`UPDATE alerts SET notified_at = CURRENT_TIMESTAMP WHERE kind = ? AND app_id = ? AND version = ? AND subject = ? AND advisory = ?`);
  let sent = 0;
  let failed = 0;
  for (const a of pending) {
    log.warn(`ALERT ${alertText(a).replace(/\n/g, ' | ')}`);
    if (!channels.length) continue;
    const results = await Promise.allSettled(channels.map(c => c.send(a)));
    const errors = results.filter(r => r.status === 'rejected').map(r => r.reason?.message || String(r.reason));
    if (errors.length) {
      failed++;
      log.warn(`alert not delivered (${errors.join('; ')}); retried after the next analysis`);
    } else {
      mark.run(a.kind, a.app_id, a.version, a.subject, a.advisory);
      sent++;
    }
  }
  return { sent, failed, pending: pending.length, channels: channels.map(c => c.name) };
}
