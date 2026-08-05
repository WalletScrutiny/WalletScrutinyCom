---
title: CozyWallet
date: 2026-07-23
appCountry: us
redirect_from:
- /iphone/com.deltahub.spectras/
iphone:
  appId: com.deltahub.spectras
  idd: '6502897143'
  appCountry: us
  released: 2024-08-18
  updated: 2026-08-05
  version: 3.4.6
  reviews: 2475
  icon: com.deltahub.spectras.jpg
  meta: ok
  verdict: custodial
  developerName: Delta Hub Ltd.

---

## App Description

CozyWallet (`com.deltahub.spectras`) is an iOS/iPadOS-only Web3 wallet published by Delta Hub Ltd.; there is no Android build (the developer's App Store page lists this as their only app) and no public source repository, so the binary is closed-source and cannot be independently verified. Its App Store description claims support for "1000+ tokens across 60+ chains" including Bitcoin, a virtual "Cozy Card" for spending via Apple Pay / Google Pay / PayPal, and Telegram Wallet Bot / Mini App integration.

## Testing and Analysis

⚠️ **Warning: Be careful with this app — users have reported discrepancies.**

We were not able to test the app: we have no iOS device and the binary is closed-source, so the analysis below rests on publicly available information.

- **Closed source, iOS-only.** There is no public source repository and no Android build — [Delta Hub Ltd. on the App Store](https://apps.apple.com/us/developer/delta-hub-ltd/id1747256799) lists CozyWallet as its only app — so the binary cannot be reproduced or independently audited.
- **Routed to a custodial backend (Cwallet).** In its App Store replies to user complaints, the developer directs users to `support@cwallet.com`, the support domain of [Cwallet](https://cwallet.com), a custodial exchange/wallet platform. The listing's "Cozy Card" is a Cwallet product, and the current store description emphasises "cold wallet infrastructure", "HSM-grade key encryption", and "passkey login" — wording consistent with provider-held keys rather than on-device self-custody.
- **Hybrid custody.** User reviews, and an earlier version of the store description, indicate the app separates a custodial account from a self-custody "Web3" wallet (the earlier copy claimed a non-custodial wallet with cloud-backed recovery phrases). We could not confirm which mode is the default, nor whether a user's Bitcoin is under their sole control.
- **Operator.** The privacy policy is a generic freeprivacypolicy.com page naming Delta Hub Ltd. at "House of Francis Mahe" (Mahé, Seychelles); it makes no statement about custody of funds or keys.
- **No working website.** `cozywallet.com` returns HTTP 200 but only serves a bare frameset whose content page (`/wordpress`) returns **HTTP 404**, so the site displays no information about the product or its operator.
- **Negligible social footprint.** We found no verifiable official social media for the wallet — no confirmed X/Twitter, Telegram, or Discord; the `@cozywallet` X handle belongs to an unrelated account. For an app whose store copy claims a very large user base, this near-absence of an online presence is notable.

**Verdict: custodial.** Because support and, by the provider's own descriptions, key handling run through Cwallet's custodial infrastructure, we cannot establish that users hold their own Bitcoin keys. Under WalletScrutiny's policy, an app whose provider holds the coins on the user's behalf is a custodial service — the user holds an IOU — so, absent verifiable evidence of self-custody, we classify CozyWallet as **custodial**. If the developer can demonstrate that the Bitcoin wallet is non-custodial with user-controlled keys, this can be revisited.