---
title: Keycard Pal
date: 2026-11-16
authors:
- danny
website: https://keycardpal.com/
android:
  appId: com.keycardpal
  users: 10
  appCountry: us
  released: Sep 23, 2026
  updated: 2026-11-11
  version: 1.17.0
  meta: fewusers
  verdict: sourceavailable
  developerName: mmlado
  repository: https://github.com/mmlado/keycard-pal
iphone:
  appId: com.keycardpal
  idd: '6777478235'
  appCountry: us
  released: '2026-09-29T07:00:00Z'
  updated: 2026-11-11
  version: 1.17.0
  reviews: 0
  repository: https://github.com/mmlado/keycard-pal
  meta: ok
  verdict: sourceavailable
  developerName: Mladen Milankovic

---

Keycard Pal is a companion app for the {% include walletLink.html wallet='hardware/keycard' verdict='true' %} smart card. Its [README](https://github.com/mmlado/keycard-pal/blob/v1.17.0/README.md#requirements) says it "is made by an independent developer, not by Keycard". The Keycard team provided equipment, and Android releases up to 1.16.0 carried an affiliate link to the Keycard shop.

## Android

## App Description

Keycard Pal signs Bitcoin and Ethereum transactions with the key on the card, over NFC. It talks to a watch-only wallet such as Sparrow or BlueWallet through animated QR codes.

On Android it [comes in two flavors](https://github.com/mmlado/keycard-pal/blob/v1.17.0/README.md):

- **Keycard Pal** (`com.keycardpal`) has optional online features, each off until you turn it on. This is the app on Google Play.
- **Keycard Pal Offline** (`com.keycardpal.offline`) has no internet permission at all. It is not on Google Play, only on [F-Droid](https://f-droid.org/packages/com.keycardpal.offline/) and the [GitHub releases](https://github.com/mmlado/keycard-pal/releases).

Both flavors are also [on F-Droid](https://f-droid.org/packages/com.keycardpal/).

## Analysis

The keys live on the card, which the user holds, so the app is **self-custodial**.

The card does not keep the recovery phrase away from the phone, though. When you create or import a recovery phrase, the phone shows it and derives the key, then loads that key onto the card. The [README](https://github.com/mmlado/keycard-pal/blob/v1.17.0/README.md#security) says so openly. After that, the key never leaves the card.

The source is public under the MIT license at [mmlado/keycard-pal](https://github.com/mmlado/keycard-pal), with the tag [v1.17.0](https://github.com/mmlado/keycard-pal/tree/v1.17.0) for the version on Google Play. So the app is {% include verdictBadge.html verdict="sourceavailable" type='short' %} and we can look into reproducibility next.

---

## iPhone

The iPhone app is built from the same repository and the same tag. There is no offline flavor on iOS. The Android analysis above applies here too, so this app is {% include verdictBadge.html verdict="sourceavailable" type='short' %} as well.
