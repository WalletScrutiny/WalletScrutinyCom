---
title: 'Oath: Crypto & Bitcoin Wallet'
altTitle: Oath Wallet
date: 2026-11-16
authors:
- danny
website: https://oathwallet.org
twitter: OathWallet
iphone:
  appId: com.aperture.wallet
  idd: '6780187283'
  appCountry: us
  released: 2026-07-08
  updated: 2026-11-14
  version: 5.1.0
  reviews: 37
  repository: https://github.com/OathWallet/oath-wallet
  icon: com.aperture.wallet.webp
  meta: ok
  verdict: nosource
  developerName: STAGE AND STYLE COLLECTIVE LLC

---

## App Description

Oath is a multi-chain wallet for iPhone and iPad that supports Bitcoin among more than 20 networks. It was previously published as "Aperture", which is why it still uses the bundle ID `com.aperture.wallet`. The developer account, STAGE AND STYLE COLLECTIVE LLC, has no other apps on the App Store.

From the App Store description:

> Oath is a fast, private, non-custodial crypto wallet for iPhone and iPad. You hold your own keys — there's no account, no sign-up, and no company standing between you and your assets. Your recovery phrase is generated on your device, encrypted, and stored locally with keys protected by the iOS Keychain. Oath never sees it and never holds your funds.

> Send any supported coin or token with clear fees and plain-language confirmations [...] Receive with a scannable QR code and a tap-to-copy address.

## Analysis

- **Genuine?** We found no popular wallet that Oath imitates by name or logo.
- **A wallet, for Bitcoin, that can send and receive?** Yes. The published source supports on-chain Bitcoin sending and receiving, with transactions signed on the device.
- **Self-custodial?** The published source creates the recovery phrase on the device and stores it encrypted in the iOS Keychain.
- **Is the source of the current release public?** Only in part.

The provider publishes source at [OathWallet/oath-wallet](https://github.com/OathWallet/oath-wallet). That repository was created on 2026-10-30, and its first commit is a squashed "4.1.14 source release". Its tags now go up to `v5.1.0-build110`, which matches the version 5.1.0 that the App Store ships (updated 2026-11-14).

The published code is not the complete codebase, though. The repository's publishing check, `Tools/ValidatePublicRelease.py`, rejects a public copy that contains a module named `OathCustody`, a folder named `Backend`, or code calling `flushCustody`, `retryPendingCapture`, `requestCustodySync` or a Supabase backend. The repository's documentation limits its privacy statements to the public source: "This source release has no operator endpoint for wallet credentials, recovery typing, wallet records or diagnostic uploads."

**Why {% include verdictBadge.html verdict="nosource" type='short' %}:** The source of version 5.1.0 is tagged, but the parts the developer keeps out of the public copy have names that point at custody and syncing wallet data with a server. The public documentation only speaks for the public build, so nobody outside the developer can check whether the App Store build contains those parts and what they do. Until the published source is the complete source of the app users install, we list the app as not source-available.
