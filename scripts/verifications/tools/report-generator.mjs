

import { explicitRelayUrls } from "../../../src/nostr-constants.mjs";

/**
 * Generates a comparison matrix of event presence across relays.
 * @param {Array} backupEvents - The array of events from the local backup.
 * @param {Object} relayData - The object containing data from relays.
 * @returns {String} The formatted matrix as a string.
 */
export function generateRelayMatrix(backupEvents, relayData) {
  let output = "📊 RELAY COMPARISON MATRIX\n";
  output += "=".repeat(80) + "\n";

  const relayNames = explicitRelayUrls.map(url => {
    const name = url.replace('wss://', '').replace('/', '');
    return name.length > 12 ? name.substring(0, 12) : name;
  });

  output += `Event ID (short)    | Backup | ${relayNames.join(' | ')}\n`;
  output += "-".repeat(80) + "\n";

  for (const event of backupEvents) {
    const shortId = event.id.substring(0, 15) + "...";
    let line = `${shortId.padEnd(18)} |   ✅    |`;

    for (const relayUrl of explicitRelayUrls) {
      const relayEvents = relayData[relayUrl] || [];
      const hasEvent = relayEvents.some(e => e.id === event.id);
      const symbol = hasEvent ? '✅' : '❌';
      const padding = relayNames[explicitRelayUrls.indexOf(relayUrl)].length + 1;
      line += ` ${symbol}`.padEnd(padding) + " |";
    }
    output += line + "\n";
  }
  return output;
}

/**
 * Generates a report of events missing from each relay.
 * @param {Array} backupEvents - The array of events from the local backup.
 * @param {Object} relayData - The object containing data from relays.
 * @returns {String} The formatted report as a string.
 */
export function generateMissingEventsReport(backupEvents, relayData) {
  let output = "📋 MISSING EVENTS REPORT\n";
  output += "=".repeat(70) + "\n";

  for (const relayUrl of explicitRelayUrls) {
    const relayEvents = relayData[relayUrl] || [];
    const relayEventIds = new Set(relayEvents.map(e => e.id));
    const missingEvents = backupEvents.filter(e => !relayEventIds.has(e.id));

    output += `\n🔴 ${relayUrl}\n`;
    output += `   Missing: ${missingEvents.length}/${backupEvents.length} events\n`;

    if (missingEvents.length > 0) {
      output += "   Recent missing events:\n";
      const recentMissing = missingEvents
        .sort((a, b) => b.created_at - a.created_at)
        .slice(0, 5);

      for (const event of recentMissing) {
        const date = new Date(event.created_at * 1000);
        const shortPubkey = event.pubkey.substring(0, 16) + "...";
        const shortId = event.id.substring(0, 12) + "...";
        const daysAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
        output += `     - ${shortId} by ${shortPubkey} (${daysAgo} days ago)\n`;
      }

      if (missingEvents.length > 5) {
        output += `     ... and ${missingEvents.length - 5} more missing events\n`;
      }
    }
  }
  return output;
}

