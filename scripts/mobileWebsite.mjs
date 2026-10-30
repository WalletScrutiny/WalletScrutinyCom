/**
 * mobileWebsite.mjs
 *
 * One `website` per mobile page, fed by both stores without either taking precedence:
 * a store sets it when it is the only store still listing the app, or when the page has
 * no website yet. When both stores list the app and disagree, the page keeps what it
 * has and the refresh logs the conflict for a human to settle.
 */
import { isDelistedFromPlay } from './androidAvailability.mjs';

const isGone = (block) => block.meta === 'removed' || block.meta === 'defunct';

/** Whether Google Play currently lists the app. */
export function isOnPlay (android) {
  if (!android?.appId || android.playStore === false) return false;
  return !isDelistedFromPlay(android) && !isGone(android);
}

/** Whether the App Store currently lists the app. */
export function isOnAppStore (iphone) {
  if (!iphone?.idd && !iphone?.appId) return false;
  return !isGone(iphone);
}

/**
 * Apply the developer website a store reported for `platform` ('android' or 'iphone').
 * Returns the competing value when both stores list the app and disagree, else null.
 */
export function applyStoreWebsite (mobile, platform, url) {
  if (!url || url === mobile.website) return null;
  const otherListed = platform === 'android'
    ? isOnAppStore(mobile.iphone)
    : isOnPlay(mobile.android);
  if (!otherListed || !mobile.website) {
    mobile.website = url;
    return null;
  }
  return mobile.website;
}
