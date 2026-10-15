import { eventRelayUrls, opinionKind } from '../nostr-constants.mjs';

export { opinionKind };

/** Replies to an opinion are plain notes (NIP-10 threads under the opinion's address). */
export const replyKind = 1;
/** Likes / dislikes (NIP-25): content "+" or "-", an empty content withdraws the reaction. */
export const reactionKind = 7;
export const deletionKind = 5;
export const profileKind = 0;

/**
 * Relays the widget reads from and publishes to. The project relay stores
 * opinions (kind 30023 with a WalletScrutiny t tag) but rejects replies and
 * reactions, and most historical opinions only live on public relays, so the
 * site's read set is extended with the relays the nostr-opinion plugin used.
 * scripts/compileAllOpinions.mjs starts from the same list.
 */
export const opinionRelayUrls = [...new Set([
  ...eventRelayUrls,
  'wss://offchain.pub/',
  'wss://nostr-pub.wellorder.net/',
])];

/**
 * Opinion content is "<header>\n<!--HEADER END-->\n<body>\n<!--FOOTER START-->\n\n\n\n#tags footer".
 * Header and footer make the event readable in generic Nostr clients; the
 * widget only shows the body.
 */
export const opinionHeaderSeparator = '\n<!--HEADER END-->\n';
export const opinionFooterSeparator = '\n<!--FOOTER START-->\n\n\n\n';

export const SENTIMENT_POSITIVE = '1';
export const SENTIMENT_NEUTRAL = '0';
export const SENTIMENT_NEGATIVE = '-1';
export const SENTIMENTS = [SENTIMENT_POSITIVE, SENTIMENT_NEUTRAL, SENTIMENT_NEGATIVE];

export const SENTIMENT_LABELS = {
  [SENTIMENT_POSITIVE]: 'Positive',
  [SENTIMENT_NEUTRAL]: 'Neutral',
  [SENTIMENT_NEGATIVE]: 'Negative',
};

/** localStorage keys. */
export const signedInStorageKey = 'wsOpinionsSignedIn';
export const showAllConsentStorageKey = 'wsOpinionsShowAll';

export const maxOpinionLength = 60000;
export const maxReplyLength = 10000;

/** Per-relay wait for EOSE on the initial loads. */
export const fetchMaxWaitMs = 5000;

export const njumpUrl = 'https://njump.me/';
