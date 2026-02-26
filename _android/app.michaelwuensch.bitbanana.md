---
wsId: 
title: 'BitBanana: Bitcoin & Lightning'
altTitle: 
authors:
- danny
- keraliss
users: 5000
appId: app.michaelwuensch.bitbanana
appCountry: 
released: 2023-03-26
updated: 2025-09-05
version: 1.0.0
reviews: 4
website: https://bitbanana.app/
repository: https://github.com/michaelWuensch/BitBanana
issue: https://github.com/michaelWuensch/BitBanana/issues/95
icon: app.michaelwuensch.bitbanana.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes:
- fe57c48a52177a33ebc386322a1cfd36cb06d2351cb53df96bbc7b456ec3d503
- b0da32db5b75cf3ea94f6d3f9157c1d5f43a8f34f18c45376c6114f23f91f55d
- 3da406028595ae50141e13a3530e7702766577eb69551c18d5cfaecbf399fb31
date: 2025-03-19
signer: 98d818b12efa005735dc3d6b6ed78a05d8f75629e0afaf001655ed6aacfd2884
twitter: BitBananaApp
social:
- https://discord.gg/Xg85BuTc9A
- https://snort.social/p/npub1dwn7wphjhrlej6ks4sktgn77w82ayq6hn6lj37ll75tav55nd3vq07xzaj
redirect_from: 
developerName: Michael Wünsch
builds: 
features:
- customNode
- TOR
- coinCtrl
- foss
- ln
- nfc
- ownLN
- segwit
- taproot

---
{% include featureEvidence.html feature="customNode" source="[README](https://github.com/michaelWuensch/BitBanana#readme)" quote="Connect to remote lightning nodes/wallets (LND, Core Lightning, Nostr Wallet Connect & LndHub)" %}

## App Description from Google Play

> BitBanana is a native android app for node operators focused on user experience and ease of use. While it is not a wallet on its own, BitBanana works like a remote control allowing you to use your node as a wallet wherever you go. The app is designed with an educational approach, providing the user with guidance on every aspect of node operation.

{% include featureEvidence.html feature="ln" quote="Connect to remote lightning nodes/wallets (LND, Core Lightning, Nostr Wallet Connect & LndHub)" source="README" %}

{% include featureEvidence.html feature="segwit" quote="Support for SegWit & Taproot" source="README" %}

{% include featureEvidence.html feature="taproot" quote="Support for SegWit & Taproot" source="README" %}

{% include featureEvidence.html feature="ownLN" quote="Use your node as a lightning wallet wherever you are" source="README" %}

{% include featureEvidence.html feature="TOR" quote="Tor support" source="README" %}

{% include featureEvidence.html feature="foss" quote="MIT License Copyright (c) 2019-present Jack Mallers Copyright (c) 2019-present Michael Wuensch Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the &quot;Software&quot;), to deal in the Software without restriction" source="License" %}

{% include featureEvidence.html feature="coinCtrl" quote="Coin Control" source="README" %}

{% include featureEvidence.html feature="nfc" quote="NFC support" source="README" %}