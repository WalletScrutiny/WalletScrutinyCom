---
wsId: envoyFoundation
title: Envoy
altTitle: 
authors:
- danny
- keraliss
users: 1000
appId: com.foundationdevices.envoy
appCountry: US
released: 2022-04-01
updated: 2026-03-26
version: 2.2.12
reviews: 6
website: https://foundationdevices.com/
repository: https://github.com/Foundation-Devices/envoy
icon: com.foundationdevices.envoy.jpg
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes:
- 84628d12486a8f47879952a2cf8bb6e0650c0f0d7ad7c0ccb71fded5bcc6e5f0
- 651ee1d39e5e8373af42229e98f4cd6c4bb57e070dd8881c31a91c40bcd971b2
- ad7fccf1d8dfc1761d2dbebc8ca6cc6a55ed7ee48b9e4636301ec184bbf5eb32
- 44dedb6efff420a0fc618162ab61d6d15b57cb6f025a0e181c072a12c0621727
date: 2025-02-13
signer: 
twitter: FOUNDATIONdvcs
social:
- https://www.linkedin.com/company/foundationdevices
- https://www.youtube.com/@foundationdevices
- https://www.reddit.com/r/FoundationDevices
- https://t.me/foundationdevices
redirect_from: 
developerName: Foundation Devices
builds: 
features:
- TOR
- companion
- customNode
- foss
- segwit

---

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

{% include featureEvidence.html feature="segwit" comment="(no justification provided by LLM)" %}

An issue has been opened at [https://github.com/Foundation-Devices/envoy/issues/1395](https://github.com/Foundation-Devices/envoy/issues/1395)
