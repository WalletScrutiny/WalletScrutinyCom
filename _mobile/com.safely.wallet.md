---
title: Safely Wallet
date: 2026-11-05
authors:
- leo
website: https://safely.app
social:
- https://www.linkedin.com/company/safely-wallet
android:
  appId: com.safely.wallet
  users: 10
  appCountry: us
  released: 2026-09-16
  updated: 2026-10-29
  version: 1.3.1
  signer: 8ff785b2ab608e289d6118f5bcafd5bc867990cdb8f7ee44b68b17a9de349703
  meta: fewusers
  verdict: sourceavailable
  developerName: Tread Safely Inc.
  repository: https://github.com/treadsafely/Safely
iphone:
  appId: com.safely.wallet
  idd: '6784663848'
  appCountry: us
  released: 2026-09-14
  updated: 2026-11-04
  version: 1.3.2
  reviews: 0
  meta: ok
  verdict: sourceavailable
  developerName: Tread Safely Inc.
  repository: https://github.com/treadsafely/Safely

---

## Android

## App Description

Safely is a Bitcoin-only, self-custodial wallet by Tread Safely Inc., led by Oleg Andreev. It sends, receives and stores bitcoin, with a price chart, an address book, Ledger support and watch-only wallets. Users can create several isolated accounts, each holding multiple wallets, without an email or phone number.

Its distinctive feature is **Safely Sync**: an account's wallets, recovery phrases, settings and address book are copied to every device the user links. The [protocol specification](https://github.com/treadsafely/Safely/blob/master/packages/sync/doc/spec.md) describes this as end-to-end encrypted with a key that never leaves the user's devices in plaintext, so the server only relays ciphertext. The recovery phrase therefore leaves the device, but only encrypted.

## Analysis

The wallet generates and shows the recovery phrase on the device, so it is **self-custodial**.

The full client source for Android and iOS is public under the Apache 2.0 license at [treadsafely/Safely](https://github.com/treadsafely/Safely), with a tag for every release (v1.3.1 matches the current Play version). It is an Expo/React Native app built on Expo's EAS service, and each GitHub release carries the built APK, the AAB uploaded to Google Play and the iOS IPA, so it is **source-available** and a candidate **for verification**.

Least Authority [audited](https://leastauthority.com/blog/audit-of-tread-safely-safely-wallet/) the client code from July to September 2026. The [final report](https://safely.app/audit-report.pdf) lists six medium issues, all resolved. One informational suggestion, about logging sensitive information, is only partially resolved. The sync server was out of scope.

With only 10+ installs on Google Play, the Android app has too few users for a verification yet.

---

## iPhone

The Android analysis above applies to the iPhone app too.
