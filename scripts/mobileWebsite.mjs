/**
 * mobileWebsite.mjs
 *
 * The developer website of a mobile page, fed by both stores without either taking
 * precedence. Root `website` is the one link shown while the stores agree, or while
 * only one of them lists the app. When both list it and their normalized URLs differ,
 * `android.website` and `iphone.website` hold each store's URL and the page shows a
 * Website pill per store. Platform `website` exists only in that case.
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

/** Scheme, `www.`, case of the host and a trailing slash do not make two websites. */
export function normalizeWebsite (url) {
  const s = String(url || '').trim();
  if (!s) return '';
  try {
    const u = new URL(s);
    const host = u.host.toLowerCase().replace(/^www\./, '');
    return `${host}${u.pathname.replace(/\/+$/, '')}${u.search}`;
  } catch {
    return s.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/+$/, '');
  }
}

export const sameWebsite = (a, b) => normalizeWebsite(a) === normalizeWebsite(b);

function setSingleWebsite (mobile, url) {
  if (!sameWebsite(mobile.website, url)) {
    mobile.website = url;
  }
  if (mobile.android) delete mobile.android.website;
  if (mobile.iphone) delete mobile.iphone.website;
}

/**
 * Apply the developer website a store reported for `platform` ('android' or 'iphone').
 * Returns true when the page now shows one website per store.
 */
export function applyStoreWebsite (mobile, platform, url) {
  if (!url) return false;
  const other = platform === 'android' ? 'iphone' : 'android';
  const otherListed = other === 'iphone' ? isOnAppStore(mobile.iphone) : isOnPlay(mobile.android);
  // While the stores agree, root `website` is also the other store's URL.
  const otherSite = otherListed ? (mobile[other].website || mobile.website) : null;
  if (!otherSite || sameWebsite(url, otherSite)) {
    setSingleWebsite(mobile, url);
    return false;
  }
  mobile[platform].website = url;
  mobile[other].website = otherSite;
  return true;
}
