---
wsId: envoyFoundation
title: Envoy
meta: ok
authors:
- danny
- keraliss
repository: https://github.com/Foundation-Devices/envoy
twitter: FOUNDATIONdvcs
social:
- https://www.linkedin.com/company/foundationdevices
- https://www.youtube.com/@foundationdevices
- https://www.reddit.com/r/FoundationDevices
- https://t.me/foundationdevices
- https://foundationdevices.com
features:
- TOR
- companion
- customNode
- foss
- segwit
redirect_from:
- /android/com.foundationdevices.envoy/
- /iphone/com.foundationdevices.envoy/
android:
  appId: com.foundationdevices.envoy
  users: 1000
  appCountry: US
  released: 2022-04-01
  updated: 2026-04-21
  version: 2.2.14
  reviews: 6
  icon: com.foundationdevices.envoy.jpg
  verdict: sourceavailable
  date: 2025-02-13
  website: https://foundationdevices.com/
  developerName: Foundation Devices
iphone:
  appId: com.foundationdevices.envoy
  idd: '1584811818'
  appCountry: us
  released: 2022-07-14
  updated: 2026-04-23
  version: 2.2.14
  reviews: 29
  icon: com.foundationdevices.envoy.jpg
  verdict: wip
  date: 2024-01-02
  developerName: Foundation Devices, Inc.

---

## Android

*Legacy verification [here](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/427a9a5ab0f6d590ee8a7ec1baf5d0fc465e8442/_android/com.foundationdevices.envoy.md)*

# App Description from Google Play

> Envoy is a simple Bitcoin wallet with powerful account management and privacy features.
>
> Use Envoy alongside your Passport hardware wallet for setup, firmware updates, and more.
>
> Envoy offers the following features:
>
> 1. Magic Backups. Get up and running with self-custody in only 60 seconds with automatic encrypted backups. Seed words optional.
>
> 2. Manage your mobile wallet and Passport hardware wallet accounts in the same app.
>
> 3. Send and receive Bitcoin in a zen-like interface.
>
> 4. Connect your Passport hardware wallet for setup, firmware updates, and support videos. Use Envoy as your software wallet connected to your Passport.
>
> 5. Fully open source and privacy preserving. Envoy optionally connects to the Internet with Tor for maximum privacy.
>
> 6. Optionally connect your own Bitcoin node.

A blog post states that this is not an ordinary "companion app", it is a fully-capable standalone self-custodial bitcoin wallet.

{% include featureEvidence.html feature="foss" quote="<!-- SPDX-License-Identifier: GPL-3.0-or-later -->" source="GitHub README" %}

{% include featureEvidence.html feature="TOR" quote="Envoy optionally connects to the Internet with Tor for maximum privacy." source="Store" %}

{% include featureEvidence.html feature="customNode" quote="Optionally connect your own Bitcoin node." source="Store" %}

{% include featureEvidence.html feature="companion" quote="Use Envoy alongside your Passport hardware wallet for setup, firmware updates, and more." source="Store" %}

Envoy is the companion app for both {% include walletLink.html wallet='hardware/passportb2' verdict='true' %} and {% include walletLink.html wallet='hardware/passportprime' verdict='true' %}.

{% include featureEvidence.html feature="segwit" comment="(no justification provided by LLM)" %}

An issue has been opened at [https://github.com/Foundation-Devices/envoy/issues/1395](https://github.com/Foundation-Devices/envoy/issues/1395)

---

## iPhone

{% include copyFromAndroid.html %}
