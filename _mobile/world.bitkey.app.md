---
wsId: bitkeyBlock
title: Bitkey - Bitcoin Wallet
verdict: sourceavailable
meta: ok
date: 2024-03-14
authors:
- danny
website: https://bitkey.world
repository: https://github.com/proto-at-block/bitkey
twitter: bitkey
social:
- https://www.linkedin.com/company/bitkey-official
- https://www.facebook.com/profile.php?id=100088526238789
- https://www.instagram.com/ownbitkey
features:
- foss
- multiSig
- nfc
- companion
- fingerprint
redirect_from:
- /android/world.bitkey.app/
- /iphone/world.bitkey.app/
android:
  appId: world.bitkey.app
  users: 10000
  appCountry: US
  released: 2024-02-28
  updated: 2026-05-13
  version: 2026.9.1 (1)
  reviews: 33
  icon: world.bitkey.app.png
  signer: c0d0f9da7158cde788d0281e9ebd07034178165584d635f7ce17f77c037d961a
  builds:
  - arch: arm64-v8a
  developerName: Block, Inc.
iphone:
  appId: world.bitkey.app
  idd: '6476990471'
  appCountry: us
  released: 2024-03-13
  updated: 2026-05-15
  version: 2026.9.1
  reviews: 117
  icon: world.bitkey.app.jpg
  developerName: Block, Inc.

---

## Android

**Disclaimer**: The WalletScrutiny project is sponsored by Spiral, a subsidiary of Block.

*Legacy verification [2025](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/569a817147cba5af29e4c569040aab6c05143a5c/_android/world.bitkey.app.md)*

## Analysis 

This is the **companion app** to the {% include walletLink.html wallet='hardware/blockhww' verdict='true' %} (screenless, 2024) and the {% include walletLink.html wallet='hardware/bitkey2026' verdict='true' %} (with OLED touchscreen, 2026). It requires an NFC-capable phone, otherwise the app would not be installed.

<hr>

[**Release Notes**](https://bitkey.world/en-US/releases)

# Verified Builds

[Documentation](https://github.com/proto-at-block/bitkey/blob/main/app/verifiable-build/android/README.md) 

This app is **source available**

{% include featureEvidence.html feature="multiSig" quote="Bitkey's 2-of-3 multisig setup is built into every wallet. You hold two keys: one on your Bitkey device and one in the app . A third is encrypted on a server and can't be used without one of your other keys." source="Website" %}

{% include featureEvidence.html feature="foss" quote="Software is licensed by Block, Inc. under the following MIT License (the &quot;License&quot;), and with no warranties or guarantees. The MIT License Copyright © 2024 Block, Inc. All rights reserved. Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the &quot;Software&quot;), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:" source="GitHub README" %}

{% include featureEvidence.html feature="nfc" quote="It requires an NFC-capable phone, otherwise the app would not be installed." source="Existing WalletScrutiny review" comment="Excluded per rule 7 — evidence found only in the Review body. Removing this entry." %}

An issue has been opened at [https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/647](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/647)

---

## iPhone

{% include featureEvidence.html feature="companion" source="[Website](https://bitkey.world)" quote="one on your Bitkey device and one in the app . A third is encrypted on a server" %}

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="multiSig" quote="Bitkey is a 2-of-3 multi-signature wallet which means there are three private keys protecting your bitcoin. You always need two out of three keys to sign a transaction, giving you extra protection." source="Store description" %}

{% include featureEvidence.html feature="foss" quote="Software is licensed by Block, Inc. under the MIT License (the &quot;License&quot;), and with no warranties or guarantees." source="GitHub README" %}

{% include featureEvidence.html feature="fingerprint" quote="Bitkey's biometric hardware can protect every transaction in the app." source="Website" %}
