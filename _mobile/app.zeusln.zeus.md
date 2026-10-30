---
title: ZEUS Wallet
date: 2023-12-30
authors:
- leo
- mohammad
- danny
- keraliss
website: https://zeusln.com
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
  appCountry: us
  released: 2020-07-07
  updated: 2026-10-09
  version: 13.2.3
  reviews: 40
  icon: app.zeusln.zeus.webp
  signer: cbcc8ccfbf89c002b5fed484a59f5f2a6f5c8ad30a1934f36af2c9fcdec6b359
  alternativeStores:
  - zapstore
  meta: ok
  verdict: sourceavailable
  developerName: Atlas 21 Inc.
  repository: https://github.com/ZeusLN/zeus
iphone:
  appId: com.zeusln.zeus
  idd: 1456038895
  appCountry: us
  released: 2021-04-22
  updated: 2026-10-12
  version: v13.2.3
  reviews: 83
  icon: com.zeusln.zeus.webp
  meta: ok
  verdict: sourceavailable
  developerName: Atlas 21 Inc.
  repository: https://github.com/ZeusLN/zeus

---

## App Description

ZeusLN is a mobile application that functions as both a Bitcoin and Lightning Network wallet, enabling users to connect to remote `lnd` or Core Lightning nodes. The codebase is implemented in TypeScript using React Native, supporting both Android and iOS platforms. It provides extensive support for Lightning features such as LNURL, Taproot, MPP/AMP, and keysend. The application integrates with several full-node solutions including StartOS, Umbrel, RaspiBlitz, and payment platforms like BTCPay Server and LNBits. It supports self-custodial operation, connection over Tor, and advanced functionality like coin control, external signers, and watch-only accounts.

From a development perspective, the project maintains clear build instructions for both Android and iOS, highlighting requirements such as Node.js ≥ 18.18, proper ADB setup, and native dependency installation via CocoaPods. The repository actively supports reproducible builds and encourages contributors to verify code integrity using its signed releases and commits. Localization is managed through Transifex, and developers are advised against editing locale files directly. Contributions are expected to pass type checks, automated tests, and formatting rules. The project follows AGPLv3 licensing and maintains PGP-signed commits from verified maintainers.

{% include featureEvidence.html feature="segwit" quote="SegWit support" source="[README](https://github.com/ZeusLN/zeus#features)" %}

{% include featureEvidence.html feature="taproot" quote="Taproot support" source="[README](https://github.com/ZeusLN/zeus#features)" %}

{% include featureEvidence.html feature="TOR" quote="Connect over Tor" source="[README](https://github.com/ZeusLN/zeus#features)" %}

{% include featureEvidence.html feature="ownLN" quote="Connect to LND or Core Lightning remote node" source="[README](https://github.com/ZeusLN/zeus#features)" %}

{% include featureEvidence.html feature="foss" quote="Fully open source (AGPLv3)" source="[README](https://github.com/ZeusLN/zeus#features)" %}

{% include featureEvidence.html feature="nfc" quote="NFC payments and requests" source="[README](https://github.com/ZeusLN/zeus#features)" %}

{% include featureEvidence.html feature="coinCtrl" quote="On-chain coin control" source="[README](https://github.com/ZeusLN/zeus#features)" %}

{% include featureEvidence.html feature="batching" quote="Batch on-chain transactions" source="[README](https://github.com/ZeusLN/zeus#features)" %}

{% include featureEvidence.html feature="multiAccount" quote="Manage multiple lightning nodes at once" source="[README](https://github.com/ZeusLN/zeus#features)" %}

{% include featureEvidence.html feature="customNode" quote="ZEUS is a mobile Bitcoin/Lightning wallet and remote node manager for LND and Core Lightning." source="[README](https://github.com/ZeusLN/zeus#readme)" %}

{% include featureEvidence.html feature="ownFullNode" quote="Set the peers you would like to download block headers from and broadcast transactions through." comment="Embedded LND (Android and iOS) can connect only to chosen compact-filter peers, including a compatible full node the user operates." source="[ZEUS app text, Neutrino Peers setting](https://github.com/ZeusLN/zeus/blob/38a3129613b9ac2bf23fa485906da192ef559394/locales/en.json#L1450-L1451)" %}

{% include featureEvidence.html feature="ln" quote="Lightning address receive" comment="ZEUS sends and receives Lightning payments through the connected or embedded node; the README also lists LNURL, keysend and MPP/AMP support." source="[README](https://github.com/ZeusLN/zeus#features)" %}

This app is a bit special as it does not hold your private keys but neither is
it custodial. It remote-controls your lightning node that you can run for
example at home. So it is a wallet in that you can use it to send and receive
Bitcoins.

## Android

And ... best of all:

> Furthermore our builds have no proprietary dependencies, are reproducible, and
  are distributed on F-Droid.

How that went is reflected in the verdict for the Android app.

## iPhone

For the iPhone app, reproducibility is still an unresolved issue which leaves
this app to be open source but still **not verifiable**.

An issue has been opened at [https://github.com/ZeusLN/zeus/issues/416](https://github.com/ZeusLN/zeus/issues/416)
