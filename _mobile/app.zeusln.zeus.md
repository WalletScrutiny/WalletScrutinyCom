---
wsId: zeusln
title: ZEUS Wallet
date: 2023-12-30
authors:
- leo
- mohammad
- danny
- keraliss
website: https://zeusln.com
repository: https://github.com/ZeusLN/zeus
twitter: ZeusLN
social:
- https://iris.to/zeus@zeusln.app
- https://t.me/ZeusLN
features:
- TOR
- batching
- coinCtrl
- customNode
- foss
- ln
- multiAccount
- multiSig
- nfc
- ownFullNode
- ownLN
- segwit
- taproot
redirect_from:
- /app.zeusln.zeus/
- /posts/app.zeusln.zeus/
- /android/app.zeusln.zeus/
- /iphone/com.zeusln.zeus/
android:
  appId: app.zeusln.zeus
  users: 10000
  released: 2020-07-07
  updated: 2026-05-19
  version: 13.0.2
  reviews: 39
  icon: app.zeusln.zeus.png
  signer: cbcc8ccfbf89c002b5fed484a59f5f2a6f5c8ad30a1934f36af2c9fcdec6b359
  meta: ok
  verdict: sourceavailable
  developerName: Atlas 21 Inc.
iphone:
  appId: com.zeusln.zeus
  idd: 1456038895
  released: 2021-04-22
  updated: 2026-05-21
  version: v13.0.2
  reviews: 75
  icon: com.zeusln.zeus.jpg
  meta: ok
  verdict: sourceavailable
  developerName: Atlas 21 Inc.

---

## Android

## App Description

ZeusLN is a mobile application that functions as both a Bitcoin and Lightning Network wallet, enabling users to connect to remote `lnd` or Core Lightning nodes. The codebase is implemented in TypeScript using React Native, supporting both Android and iOS platforms. It provides extensive support for Lightning features such as LNURL, Taproot, MPP/AMP, and keysend. The application integrates with several full-node solutions including StartOS, Umbrel, RaspiBlitz, and payment platforms like BTCPay Server and LNBits. It supports self-custodial operation, connection over Tor, and advanced functionality like coin control, external signers, and watch-only accounts.

From a development perspective, the project maintains clear build instructions for both Android and iOS, highlighting requirements such as Node.js ≥ 18.18, proper ADB setup, and native dependency installation via CocoaPods. The repository actively supports reproducible builds and encourages contributors to verify code integrity using its signed releases and commits. Localization is managed through Transifex, and developers are advised against editing locale files directly. Contributions are expected to pass type checks, automated tests, and formatting rules. The project follows AGPLv3 licensing and maintains PGP-signed commits from verified maintainers.

{% include featureEvidence.html feature="segwit" quote="SegWit support" source="README" %}

{% include featureEvidence.html feature="taproot" quote="Taproot support" source="README" %}

{% include featureEvidence.html feature="TOR" quote="Connect over Tor" source="README" %}

{% include featureEvidence.html feature="ownLN" quote="Connect to LND or Core Lightning remote node" source="README" %}

{% include featureEvidence.html feature="ownFullNode" quote="The application integrates with several full-node solutions including StartOS, Umbrel, RaspiBlitz, and payment platforms like BTCPay Server and LNBits." source="App Description" %}

{% include featureEvidence.html feature="foss" quote="Distributed under the GNU Affero General Public License (AGPL v3). See LICENSE file." source="README" %}

{% include featureEvidence.html feature="nfc" quote="NFC payments and requests" source="README" %}

{% include featureEvidence.html feature="coinCtrl" quote="On-chain coin control" source="README" %}

{% include featureEvidence.html feature="batching" quote="Batch on-chain transactions" source="README" %}

{% include featureEvidence.html feature="multiAccount" quote="Manage multiple lightning nodes at once" source="README" %}

{% include featureEvidence.html feature="customNode" quote="ZEUS is a mobile Bitcoin/Lightning wallet and remote node manager for LND and Core Lightning." source="README" %}

{% include featureEvidence.html feature="multiSig" comment="(no justification provided by LLM)" %}

---

## iPhone

{% include featureEvidence.html feature="customNode" source="[README](https://github.com/ZeusLN/zeus#readme)" quote="Connect to LND or Core Lightning remote node" %}

This app is a bit special as it does not hold your private keys but neither is
it custodial. It remote-controls your lightning node that you can run for
example at home. So it is a wallet in that you can use it to send and receive
Bitcoins.

And ... best of all:

> Furthermore our builds have no proprietary dependencies, are reproducible, and
  are distributed on F-Droid.

This only applies for the Android version of course and to see how that went,
check out the Android app. For iPhone app, reproducibility is still an
unresolved issue which leaves this app to be open source but still
**not verifiable**.

{% include featureEvidence.html feature="segwit" quote="SegWit support" source="GitHub README" %}

{% include featureEvidence.html feature="taproot" quote="Taproot support" source="GitHub README" %}

{% include featureEvidence.html feature="TOR" quote="Connect over Tor" source="GitHub README" %}

{% include featureEvidence.html feature="ownLN" quote="Connect to LND or Core Lightning remote node" source="GitHub README" %}

{% include featureEvidence.html feature="foss" quote="Fully open source (AGPLv3)" source="GitHub README" %}

{% include featureEvidence.html feature="nfc" quote="NFC payments and requests" source="GitHub README" %}

{% include featureEvidence.html feature="coinCtrl" quote="On-chain coin control" source="GitHub README" %}

{% include featureEvidence.html feature="batching" quote="Batch on-chain transactions" source="GitHub README" %}

{% include featureEvidence.html feature="multiAccount" quote="Manage multiple lightning nodes at once" source="GitHub README" %}

An issue has been opened at [https://github.com/ZeusLN/zeus/issues/416](https://github.com/ZeusLN/zeus/issues/416)
