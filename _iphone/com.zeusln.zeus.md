---
wsId: zeusln
title: ZEUS Wallet
altTitle: 
authors:
- leo
appId: com.zeusln.zeus
appCountry: 
idd: 1456038895
released: 2021-04-22
updated: 2026-05-07
version: v13.0.1
reviews: 75
website: https://zeusln.com
repository: https://github.com/ZeusLN/zeus
icon: com.zeusln.zeus.jpg
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2023-12-30
signer: 
twitter: ZeusLN
social: 
features:
- customNode
- TOR
- batching
- coinCtrl
- foss
- ln
- multiAccount
- nfc
- ownLN
- segwit
- taproot
developerName: Atlas 21 Inc.

---

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
