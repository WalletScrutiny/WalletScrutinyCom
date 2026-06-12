import WebSocket from 'ws';
import { DEBUG, DRY_RUN } from './config/env.mjs';
import { appLog } from './logger.mjs';
import { loadSecret, parsePublishDelayMs, sleep, tryLoadSecret } from './utils.mjs';
import { closeDb, getSince, isNotified, markNotified, updateSince } from './db.mjs';
import {
  buildNotificationForVerification,
  connectToNostr,
  disconnectFromNostr,
  fetchNewVerifications,
  publishNotification,
} from './nostr.mjs';
import { parseVerificationEvent } from './utils.mjs';

global.WebSocket = WebSocket;

let wsBotNostrPrivateKey;

try {
  if (DRY_RUN) {
    wsBotNostrPrivateKey = tryLoadSecret({
      name: 'WS_BOT_PK',
      fileEnv: 'WS_BOT_PK_FILE',
      argName: 'wsBotNostrPrivateKey',
    });
  } else {
    wsBotNostrPrivateKey = loadSecret({
      name: 'WS_BOT_PK',
      fileEnv: 'WS_BOT_PK_FILE',
      argName: 'wsBotNostrPrivateKey',
    });
  }
} catch (error) {
  appLog.error('Error loading required secrets:', error);
  process.exit(1);
}

async function main() {
  let exitCode = 0;

  try {
    if (DEBUG) {
      appLog.info('======= DEBUG MODE ENABLED =======');
    }
    if (DRY_RUN) {
      appLog.info('======= DRY RUN MODE ENABLED (no publish, no DB writes) =======');
    }

    appLog.info('======= Starting WS Notifications =======');

    const since = getSince();
    appLog.info(`Using since cursor: ${since} (${new Date(since * 1000).toISOString()})`);

    await connectToNostr(wsBotNostrPrivateKey);

    const events = await fetchNewVerifications(since);
    const publishDelayMs = DRY_RUN ? 0 : parsePublishDelayMs();
    if (publishDelayMs > 0) {
      appLog.info(`Publish delay between notes: ${publishDelayMs}ms`);
    }

    const summary = {
      fetched: events.length,
      notified: 0,
      skippedAlreadyNotified: 0,
      skippedInvalid: 0,
      errors: 0,
    };

    let maxCreatedAt = since;

    for (const event of events) {
      if (event.created_at > maxCreatedAt) {
        maxCreatedAt = event.created_at;
      }

      if (isNotified(event.id)) {
        summary.skippedAlreadyNotified++;
        continue;
      }

      const metadata = parseVerificationEvent(event);
      if (!metadata) {
        appLog.warn(`Skipping verification ${event.id}: missing required tags`);
        summary.skippedInvalid++;
        continue;
      }

      try {
        if (DRY_RUN) {
          const { content, tags } = buildNotificationForVerification(event);
          appLog.info(
            `[dry-run] Would publish kind=1 for verification ${event.id} ` +
            `(tags: ${JSON.stringify(tags)}):\n${content}`
          );
          summary.notified++;
        } else {
          await publishNotification(event);
          markNotified(event.id);
          summary.notified++;
          if (publishDelayMs > 0) {
            appLog.debug(`Waiting ${publishDelayMs}ms before next publish`);
            await sleep(publishDelayMs);
          }
        }
      } catch (error) {
        appLog.error(`Failed to notify for verification ${event.id}:`, error);
        summary.errors++;
      }
    }

    if (!DRY_RUN && events.length > 0 && maxCreatedAt > since) {
      updateSince(maxCreatedAt);
      appLog.info(`Updated since cursor to ${maxCreatedAt} (${new Date(maxCreatedAt * 1000).toISOString()})`);
    } else if (DRY_RUN && events.length > 0 && maxCreatedAt > since) {
      appLog.info(
        `[dry-run] Would update since cursor to ${maxCreatedAt} ` +
        `(${new Date(maxCreatedAt * 1000).toISOString()})`
      );
    }

    const notifiedLabel = DRY_RUN ? 'wouldNotify' : 'notified';
    appLog.info(
      `Done. fetched=${summary.fetched} ${notifiedLabel}=${summary.notified} ` +
      `skippedAlreadyNotified=${summary.skippedAlreadyNotified} ` +
      `skippedInvalid=${summary.skippedInvalid} errors=${summary.errors}` +
      (DRY_RUN ? ' dryRun=true' : '')
    );

    if (summary.errors > 0) {
      exitCode = 1;
    }
  } catch (error) {
    appLog.error('Failed to run ws_notifications:', error);
    exitCode = 1;
  } finally {
    await disconnectFromNostr();
    closeDb();
  }

  process.exit(exitCode);
}

main();
