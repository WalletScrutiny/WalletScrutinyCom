---
title: Valet
date: 2026-11-06
authors:
- leo
website: https://valet.finance
features:
- foss
- ln
- TOR
android:
  appId: finance.valet
  released: 2024-11-13
  updated: 2026-10-28
  version: 5.3.0
  signer: 334e08b87deb3f86cb6deb440817801a1969fe198d2e60dc26f7ae846c5dbc6e
  playStore: false
  alternativeStores:
  - fdroid
  meta: ok
  verdict: sourceavailable
  developerName: StandardSats
  repository: https://github.com/standardsats/valet

---

{% include featureEvidence.html feature="ln" source="[Website](https://valet.finance)" quote="Valet runs a real Lightning node in your pocket. No custodian, no vendor lock-in, no “Lightning-flavored” intermediary holding your keys behind a friendly UI. Your sats, your channels, your peers." %}

{% include featureEvidence.html feature="foss" source="[F-Droid metadata](https://gitlab.com/fdroid/fdroiddata/-/blob/master/metadata/finance.valet.yml)" quote="License: Apache-2.0" %}

{% include featureEvidence.html feature="TOR" source="[5.3.0 release notes](https://github.com/standardsats/valet/releases/tag/5.3.0)" quote="Bumped TOR library version" %}

## App Description

Valet is not distributed through Google Play. It is published on
[F-Droid](https://f-droid.org/packages/finance.valet/) and as a signed APK on
[GitHub Releases](https://github.com/standardsats/valet/releases), so the fields this entry would
normally inherit from a Play listing were filled from the APK, the repository and the F-Droid index
instead.

Valet is a fork of Simple Bitcoin Wallet ({% include walletLink.html wallet='android/com.btcontract.wallet' verdict='true' %})
built on the IMMORTAN Lightning library, a mobile-focused fork of Eclair. It runs a Lightning node on
the phone and keeps an on-chain wallet next to it. What sets it apart from SBW is Fiat Channels: hosted
channels whose capacity tracks the value of another asset such as the US dollar or the euro, described in
the [fiat-channels RFC](https://github.com/standardsats/fiat-channels-rfc).

Valet first shipped as `com.btcontract.walletfiat` ({% include walletLink.html wallet='android/com.btcontract.walletfiat' verdict='true' %})
and moved to the `finance.valet` app ID with version 4.4.4 in November 2024.

## Analysis

The website describes the app as self-custodial:

> Your private keys are generated and stored on your device. Valet has no server that can hold,
> freeze, or move your funds. There is no shared signer or co-signer.

The code is on [GitHub](https://github.com/standardsats/valet) under the Apache-2.0 license. F-Droid
rebuilds each release and publishes it only if its build matches the developer-signed APK
(`AllowedAPKSigningKeys` in the F-Droid metadata). The 5.3.0 APK from GitHub Releases carries the same
certificate, `334e08b8…5dbc6e`, issued to Ilya Evdokimov of StandardSats.

We have not tried to reproduce the build ourselves yet, so for now the app is
{% include verdictBadge.html verdict="sourceavailable" type='short' %}.
