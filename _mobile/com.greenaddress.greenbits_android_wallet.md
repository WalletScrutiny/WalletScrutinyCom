---
wsId: GreenBitcoinWallet
title: Blockstream BTC Wallet (Green)
date: 2020-12-19
authors:
- leo
- danny
- keraliss
website: https://blockstream.com/green
twitter: Blockstream
social:
- https://www.linkedin.com/company/blockstream
- https://www.facebook.com/Blockstream
features:
- foss
- multiSig
- companion
- TOR
- customNode
- liquid
- ln
redirect_from:
- /greenwallet/
- /com.greenaddress.greenbits_android_wallet/
- /posts/2019/11/greenwallet/
- /posts/com.greenaddress.greenbits_android_wallet/
- /android/com.greenaddress.greenbits_android_wallet/
- /iphone/io.blockstream.green/
android:
  appId: com.greenaddress.greenbits_android_wallet
  users: 100000
  appCountry: us
  released: 2015-01-01
  updated: 2026-06-04
  version: 5.5.0
  reviews: 150
  icon: com.greenaddress.greenbits_android_wallet.jpg
  signer: 32f9cc00b13fbeace51e2fb51df482044e42ad34a9bd912f179fedb16a42970e
  alternativeStores:
  - fdroid
  meta: ok
  verdict: sourceavailable
  developerName: Blockstream Inc
  repository: https://github.com/Blockstream/green_android
iphone:
  appId: io.blockstream.green
  idd: 1402243590
  appCountry: us
  released: 2019-03-22
  updated: 2026-06-17
  version: 5.5.1
  reviews: 1173
  icon: io.blockstream.green.jpg
  meta: ok
  verdict: sourceavailable
  developerName: Blockstream
  repository: https://github.com/Blockstream/green_ios

---

## Android

*Legacy verification [here](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/249f5fed576720a6d4fb53215614327ab2ec8b38/_android/com.greenaddress.greenbits_android_wallet.md)*

## App Description

Blockstream App is a non-custodial Bitcoin wallet for Android and iOS, built on Blockstream's cross-platform wallet library `gdk`. It enables secure storage, sending, and receiving of Bitcoin while offering features such as custom spending limits, watch-only access, and a multi-signature security model. The app is open source and released under the GNU GPLv3 license, with verified APKs that can be authenticated using SHA256 and GPG signatures. Developers can build the app by following instructions in the `BUILD.md` file, and contribute via guidelines in `CONTRIBUTING.md`. Localization is community-driven and supported through translation tools, with support available via email or the app’s FAQ.

This app is **source available**

{% include featureEvidence.html feature="foss" quote="Blockstream App is released under the terms of the GNU General Public License. See LICENSE for more information or see https://opensource.org/licenses/GPL-3.0" source="GitHub README" %}

{% include featureEvidence.html feature="multiSig" quote="our unique multisig security model" source="GitHub README" %}

An issue has been opened at [https://github.com/Blockstream/green_android/issues/253](https://github.com/Blockstream/green_android/issues/253)

---

## iPhone

{% include featureEvidence.html feature="companion" source="[App Store](https://apps.apple.com/app/io.blockstream.green)" quote="Pair with Blockstream Jade for ultimate security of your private keys." %}

The description in the App Store is not explicit about the app being
non-custodial and on their website we read:

> **Unmatched Security**<br>
  Our innovative multisignature model uses dual private keys - one held by the
  user, and one by our servers. This allows us to enforce Two-Factor
  Authentication to protect your funds, while timelock smart contracts guarantee
  that users always retain full control of their coins.

This model never puts the provider in a position of being able to spend the
user's coins but the user cannot spend the coins neither until a predefined
time elapsed, should their servers not cooperate.

While not uncontroversial, this is not custodial
but so far nobody reproduced the build, so claims about security are
**not verifiable**.

{% include featureEvidence.html feature="ln" quote="Send and receive Lightning payments and manage Liquid Bitcoin (LBTC), Tether's USDt, and other Liquid assets with built-in Liquid wallet support." source="Store" %}

{% include featureEvidence.html feature="liquid" quote="Send and receive Lightning payments and manage Liquid Bitcoin (LBTC), Tether's USDt, and other Liquid assets with built-in Liquid wallet support." source="Store" %}

{% include featureEvidence.html feature="TOR" quote="Connect via Tor at the tap of a button." source="Store" %}

{% include featureEvidence.html feature="customNode" quote="CONNECT TO YOUR OWN NODE Verify transactions on your own full node with SPV support." source="Store" %}

{% include featureEvidence.html feature="foss" quote="Blockstream App is released under the terms of the GNU General Public License. See LICENSE for more information or see https://opensource.org/licenses/GPL-3.0" source="GitHub README" %}
