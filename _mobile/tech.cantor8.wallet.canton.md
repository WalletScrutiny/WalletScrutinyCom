---
title: C8 Wallet
date: 2026-09-15
authors:
- danny
website: https://www.cantor8.tech
redirect_from:
- /android/tech.cantor8.wallet.canton/
- /iphone/tech.cantor8.wallet/
- /mobile/tech.cantor8.wallet/
android:
  appId: tech.cantor8.wallet.canton
  users: 10000
  appCountry: us
  released: 2026-02-09
  updated: 2026-09-11
  version: 2.0.0
  icon: tech.cantor8.wallet.canton.png
  meta: ok
  verdict: nobtc
  developerName: Cantor8 Technologies
iphone:
  appId: tech.cantor8.wallet
  idd: '6758641279'
  appCountry: us
  released: 2026-02-23
  updated: 2026-09-11
  version: 2.0.0
  reviews: 1
  icon: tech.cantor8.wallet.jpg
  meta: ok
  verdict: nobtc
  developerName: Cantor8 Technologies SA

---

{% include review/externalResearchAlert.html url="https://kek.lol/research/appstore-wallets/#app-6758641279" author="overtorment" severity="high" finding="iPhone 1.9.0 recovery logs the mnemonic while Sentry, UXCam and Amplitude replay are enabled." note="overtorment found that iPhone version 1.9.0 logs the full recovery phrase and enables telemetry that can collect logs, screenshots and session replays; he found no separate request deliberately uploading the phrase. On the current Android 2.0.0 build, Bob observed Sentry and Amplitude replay starting and screen-video chunks being made while a phrase was visible in an unmasked input field, but found no phrase in Android logs. We have not checked the iPhone app at runtime or determined what the analytics vendors received or masked." %}

## App Description

C8 Wallet is a mobile wallet for accounts and assets on the Canton Network. Its [Google Play](https://play.google.com/store/apps/details?id=tech.cantor8.wallet.canton) and [App Store](https://apps.apple.com/us/app/c8-wallet/id6758641279) descriptions say users can create, manage and switch between accounts on different Canton validators, with keys held on the device. Both listings advertise immediate setup without registration, although creating a new MainNet account currently requires a coupon. A [Play screenshot](https://play-lh.googleusercontent.com/aZFbd9j9gPqFfMrFp_iJKGQxKLA65XvYz_tmKsu6MhFCg8AMJjxbFU8maA07U-ggNCzvpc9Q2MABQ4ShQ0t9=w2560-h1440-rw) shows Canton Coin (CC) and Canton Bitcoin (cBTC) balances; [BitSafe, the cBTC developer](https://bitsafe.finance/), describes it as Bitcoin represented on Canton, rather than BTC held directly in this wallet on the Bitcoin network.

## Testing and Analysis

This assessment was recorded on 2026-09-15.

### The account flow is gated by a coupon

We installed the current Android app from [Google Play](https://play.google.com/store/apps/details?id=tech.cantor8.wallet.canton). Creating a wallet stopped at a required coupon screen. The public codes we tried returned that they had been fully used. An [App Store review](https://apps.apple.com/us/app/c8-wallet/id6758641279) describes the same obstacle on iPhone, but we did not run the iPhone app ourselves.

Bob obtained the Google Play-signed Android 2.0.0 (65) build and launched it on an emulator. After a device-passcode prompt, **Create new wallet** opened an **Invite only / Redeem coupon** screen before showing a recovery phrase. **Recover existing wallet** instead opened **Enter recovery phrase** directly. Bob's emulator needed a test-only repack of the base APK to extract native libraries; the original Play-signed APKs were kept as the files of record for static analysis. Bob entered a throwaway recovery phrase, but the backend returned **No accounts found for this seedphrase**. No account was created or restored, so neither reviewer reached the live asset list or tested a transaction.

### Canton Bitcoin is not native Bitcoin

Bob examined the released Android build's React Native Hermes bundle. It contains icons for Canton Coin and cBTC and a Canton balance card. He found no Bitcoin node, explorer or fee endpoints, no Bitcoin address-derivation code and no native BTC asset constant. The only Bitcoin-related references were an icon-font glyph and `cbtc-logo`. This matches the store descriptions' Canton-only network model and overtorment's **CANTON** coin classification for the iPhone app. The Play screenshot's **Canton Bitcoin (cBTC)** is a Canton token representing Bitcoin value; it does not show a Bitcoin receive address or the ability to send BTC on the Bitcoin network.

### What we could check of overtorment's finding

overtorment analysed iPhone version 1.9.0 and found that its recovery flow logs the full mnemonic while Sentry, UXCam and Amplitude replay are configured to capture telemetry. He found no separate request that deliberately uploads the phrase. Bob tested the newer Android 2.0.0 build with a throwaway 24-word phrase. Sentry started on first launch with profiling set to full sampling; Amplitude Session Replay started automatically at full sampling with no client-side masking configuration visible. The app's process also created 29 screen-video chunks while the recovery input displayed the phrase in plain text. Bob found the UXCam start call and recording endpoint in the Android bundle, but could not inspect whether the field was masked in any uploaded recording. No consent screen appeared before recording began.

The claimed **mnemonic console log did not reproduce on Android 2.0.0**: Bob searched logcat after entering the phrase and found no line containing even three of its words, although other app console output appeared. That result does not disprove overtorment's iPhone 1.9.0 code finding; the platform and version differ. We have not verified that a phrase reached Sentry, UXCam or Amplitude. This telemetry remains relevant because it runs during phrase entry and the input is unmasked on screen.

### Verdict: does not support Bitcoin (BTC)

The released Android code, observed Canton account-creation flow, both store descriptions and overtorment's iPhone coin classification point to Canton assets rather than a native Bitcoin wallet. cBTC can represent Bitcoin value on Canton, but is not BTC on the Bitcoin network. We therefore record **does not support Bitcoin (BTC)** for both entries. The coupon prevented a complete asset-screen and send/receive test, so this verdict should be revisited if a released build exposes a native Bitcoin address and Bitcoin-network transaction flow. The review stops at the Bitcoin-support gate.
