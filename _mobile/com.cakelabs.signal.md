---
wsId: radarChat
title: "Radar: Chat & Bitcoin"
date: 2026-07-08
authors:
  - danny
website: https://radar.chat
twitter: RadarChat
features:
  - ln
  - foss
iphone:
  appId: com.cakelabs.signal
  idd: "6753939776"
  appCountry: us
  released: "2026-06-30"
  updated: 2026-07-07
  version: 1.0.3
  reviews: 0
  icon: com.cakelabs.signal.jpg
  meta: ok
  verdict: sourceavailable
  developerName: Radar Chat
  repository: https://github.com/radar-labs/Radar
---

{% include featureEvidence.html feature="ln" source="[BreezSdkWrapper.kt#L291](https://github.com/radar-labs/radar-android/blob/4a6e9f8f2adf914c97f951c81c80ad41c710a26d/app/src/main/java/org/thoughtcrime/securesms/payments/BreezSdkWrapper.kt#L291)" quote="config.preferSparkOverLightning = true" %}
{% include featureEvidence.html feature="foss" source="[radar-labs/radar-android](https://github.com/radar-labs/radar-android)" comment="Public repo, AGPL-3.0 licensed." %}

## App Description

Radar is a messaging app built as a fork of Signal (Android and iOS), adding self-custodial Bitcoin payments alongside Signal's end-to-end encrypted chat. Bitcoin functionality runs on the Breez SDK Spark (v0.14.0), configured to prefer Spark over standard Lightning channels (`preferSparkOverLightning = true`), with on-chain Bitcoin deposit support via `ReceivePaymentMethod.BitcoinAddress`; no arbitrary on-chain send functionality was found in the source. The wallet seed is generated on-device from 128 bits of local entropy and passed to Breez/Spark as a 12-word BIP-39 mnemonic, which the code explicitly describes as Cake/BIP-39-compatible; the BIP-39 conversion itself is provided by the MobileCoin Android SDK dependency, so this was not independently audited from Radar source alone. Both the Android (`radar-labs/radar-android`) and iOS (`radar-labs/Radar`) repositories are public on GitHub under the AGPL-3.0 license; the iOS app is live on the App Store while Android is not yet published to Google Play.

## Testing and Analysis

We do not have access to an iPhone device during testing, and the Google Play version has not yet been released. Analysis is based solely off publicly available information.

The Android source integrates the Breez SDK Spark (v0.14.0) as its payment engine, set to `preferSparkOverLightning = true` in [`BreezSdkWrapper.kt#L291`](https://github.com/radar-labs/radar-android/blob/4a6e9f8f2adf914c97f951c81c80ad41c710a26d/app/src/main/java/org/thoughtcrime/securesms/payments/BreezSdkWrapper.kt#L291). The same file implements an on-chain Bitcoin receive address via `ReceivePaymentMethod.BitcoinAddress` at [line 220](https://github.com/radar-labs/radar-android/blob/4a6e9f8f2adf914c97f951c81c80ad41c710a26d/app/src/main/java/org/thoughtcrime/securesms/payments/BreezSdkWrapper.kt#L220), confirming both Lightning payment and on-chain BTC deposit support directly in code, not just marketing copy.

In plain terms: Radar generates your Bitcoin wallet's secret key on your own phone, not on a company server — it takes a random number generated locally and turns it into the 12 recovery words you're shown, then hands that directly to the Lightning/Spark engine, so Radar Chat Inc never sees or holds the key. This matches how reputable self-custodial wallets work — if you safely back up those 12 words, the seed is intended to be restorable in compatible BIP-39/Spark tooling even if Radar's app or company disappeared. One caveat: the mnemonic conversion routine is supplied by the external MobileCoin Android SDK dependency (`com.mobilecoin:android-sdk`), not implemented in Radar's own source; MobileCoin publishes SDK source and BIP-39 mnemonic tests publicly, but the exact packaged artifact and native implementation were not independently audited here.

The full app source for both platforms is published as public repositories: [`github.com/radar-labs/radar-android`](https://github.com/radar-labs/radar-android) and [`github.com/radar-labs/Radar`](https://github.com/radar-labs/Radar) (iOS), each licensed AGPL-3.0. Both repos belong to the `radar-labs` GitHub org, whose public GitHub metadata identifies it as
Radar Chat, Inc and links to `radar.chat`, confirming the source is tied to the actual app
publisher and not an unrelated third party.

This app is **source-available**.
