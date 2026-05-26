---
wsId: phoenix
title: Phoenix - LN Bitcoin wallet
verdict: sourceavailable
meta: ok
authors:
- leo
- danny
- keraliss
website: https://phoenix.acinq.co
twitter: PhoenixWallet
features:
- foss
- hd
- ln
- segwit
developerName: ACINQ
redirect_from:
- /fr.acinq.phoenix.mainnet/
- /posts/fr.acinq.phoenix.mainnet/
- /android/fr.acinq.phoenix.mainnet/
- /iphone/co.acinq.phoenix/
android:
  appId: fr.acinq.phoenix.mainnet
  users: 100000
  appCountry: fr
  released: 2019-12-10
  updated: 2026-02-25
  version: 2.7.5
  reviews: 10
  icon: fr.acinq.phoenix.mainnet.png
  signer: ed550bd5d607d342b61bbbbb94ffd4dde43f845171f63d3ae47573a95a132629
  date: 2025-03-19
  repository: https://github.com/ACINQ/phoenix
iphone:
  appId: co.acinq.phoenix
  idd: '1544097028'
  appCountry: gb
  released: 2021-07-13
  updated: 2026-03-17
  version: 2.7.5
  reviews: 20
  icon: co.acinq.phoenix.jpg
  date: 2024-07-05
  repository: https://github.com/ACINQ/phoenix-kmm

---

## Android

{% include featureEvidence.html feature="foss" quote="Phoenix is released under the terms of the Apache 2.0 license. See LICENSE for more information." source="GitHub README" %}

{% include featureEvidence.html feature="hd" quote="when creating a new wallet, a 12-words recovery phrase is generated. Only you have it. It is your responsibility to make a backup of that recovery phrase." source="GitHub README" %}

{% include featureEvidence.html feature="segwit" comment="(no justification provided by LLM)" %}

An issue has been opened at [https://github.com/ACINQ/phoenix/issues/112](https://github.com/ACINQ/phoenix/issues/112)

---

## iPhone

{% include featureEvidence.html feature="foss" source="[App Store](https://apps.apple.com/app/co.acinq.phoenix)" quote="Phoenix is a non-custodial wallet, and is fully open source." %}

{% include copyFromAndroid.html %}

An issue has been opened at [https://github.com/ACINQ/phoenix/issues/112](https://github.com/ACINQ/phoenix/issues/112)
