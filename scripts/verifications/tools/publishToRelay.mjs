/**
 * publishToRelay.mjs - Re-publish backed-up Nostr events to a target relay
 *
 * Publishes all kinds from the local backup in dependency order:
 *   1063 → 9401 → 30301 → 1337 → 30802 → 31871 → 30801
 *
 * Events are already signed — no private key needed.
 * The relay receives ["EVENT", signedEvent] and responds with ["OK", ...].
 */

import fs from "fs";
import path from "path";

const KIND_ORDER = [1063, 9401, 30301, 1337, 30802, 31871, 30801];

export const KIND_NAMES = {
  1063:  "Asset Registration",
  9401:  "Asset Bundle Registration",
  1337:  "Code Snippet",
  30301: "Verification",
  30801: "Draft",
  30802: "Comment",
  31871: "Endorsement",
};

/**
 * Count events per kind in the local backup.
 * @returns {{ [kind: number]: number }}
 */
export function countBackupEvents() {
  const backupDir = path.join(process.cwd(), "backup", "nostr-verification-events");
  const counts = {};
  for (const kind of KIND_ORDER) {
    const kindDir = path.join(backupDir, kind.toString());
    if (fs.existsSync(kindDir)) {
      counts[kind] = fs.readdirSync(kindDir).filter(f => f.endsWith(".json")).length;
    } else {
      counts[kind] = 0;
    }
  }
  return counts;
}

/**
 * Re-publish all backed-up events to a single relay.
 *
 * @param {Object} options
 * @param {string}  options.relayUrl   - Target relay WebSocket URL
 * @param {number}  options.eventDelay - Ms to wait between events (default 2000)
 * @param {number}  options.kindPause  - Ms to wait between kinds (default 10000)
 */
export async function publishToRelay({
  relayUrl,
  eventDelay = 2000,
  kindPause  = 10000,
}) {
  const backupDir = path.join(process.cwd(), "backup", "nostr-verification-events");
  let totalAccepted = 0, totalDuplicate = 0, totalFailed = 0, totalTimeout = 0;

  const kindsWithEvents = KIND_ORDER.filter(k => {
    const d = path.join(backupDir, k.toString());
    return fs.existsSync(d) && fs.readdirSync(d).filter(f => f.endsWith(".json")).length > 0;
  });

  for (let ki = 0; ki < kindsWithEvents.length; ki++) {
    const kind = kindsWithEvents[ki];
    const kindDir = path.join(backupDir, kind.toString());
    const files = fs.readdirSync(kindDir).filter(f => f.endsWith(".json"));

    console.log(`\n── Kind ${kind} (${KIND_NAMES[kind]}) — ${files.length} events ──`);

    for (let i = 0; i < files.length; i++) {
      const event = JSON.parse(fs.readFileSync(path.join(kindDir, files[i]), "utf8"));
      const shortId = event.id.substring(0, 16);

      process.stdout.write(`  [${i + 1}/${files.length}] ${shortId}... `);

      const result = await sendEvent(event, relayUrl);

      if (result.success) {
        console.log("✅ accepted");
        totalAccepted++;
      } else if (result.duplicate) {
        console.log("⚠️  duplicate");
        totalDuplicate++;
      } else if (result.timeout) {
        console.log("⏱️  timeout");
        totalTimeout++;
      } else {
        console.log(`❌ rejected: ${result.message}`);
        totalFailed++;
      }

      await sleep(eventDelay);
    }

    if (ki < kindsWithEvents.length - 1) {
      console.log(`\n  ⏸  Pausing ${kindPause / 1000}s before next kind...`);
      await sleep(kindPause);
    }
  }

  const summary = { totalAccepted, totalDuplicate, totalFailed, totalTimeout };

  console.log(`\n${"=".repeat(60)}`);
  console.log("📊 PUBLISH SUMMARY");
  console.log(`  ✅ Accepted  : ${totalAccepted}`);
  console.log(`  ⚠️  Duplicate : ${totalDuplicate}`);
  console.log(`  ⏱️  Timeout   : ${totalTimeout}`);
  console.log(`  ❌ Rejected  : ${totalFailed}`);
  console.log("=".repeat(60));

  return summary;
}

/**
 * Send a single pre-signed event to a relay and wait for the OK response.
 * Opens a fresh WebSocket per event for simplicity and reliability.
 */
async function sendEvent(event, relayUrl) {
  return new Promise((resolve) => {
    let resolved = false;
    const ws = new WebSocket(relayUrl);

    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        ws.terminate();
        resolve({ success: false, duplicate: false, timeout: true, message: "timeout" });
      }
    }, 8000);

    ws.on("open", () => {
      ws.send(JSON.stringify(["EVENT", event]));
    });

    ws.on("message", (data) => {
      if (resolved) return;
      try {
        const msg = JSON.parse(data.toString());
        if (Array.isArray(msg) && msg[0] === "OK" && msg[1] === event.id) {
          resolved = true;
          clearTimeout(timeout);
          ws.close();
          const accepted = msg[2] === true;
          const message  = (msg[3] || "").toString();
          const duplicate = !accepted &&
            (message.toLowerCase().includes("duplicate") ||
             message.toLowerCase().includes("already have"));
          resolve({ success: accepted, duplicate, timeout: false, message });
        }
      } catch (_) {}
    });

    ws.on("error", (err) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        resolve({ success: false, duplicate: false, timeout: false, message: err.message });
      }
    });
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
