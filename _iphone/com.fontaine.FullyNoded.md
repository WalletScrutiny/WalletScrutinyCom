---
wsId: 
title: Fully Noded
altTitle: 
authors:
- danny
appId: com.fontaine.FullyNoded
appCountry: 
idd: 1436425586
released: 2018-10-03
updated: 2026-01-06
version: 2.3.1
reviews: 48
website: https://fullynoded.app
repository: https://github.com/Fonta1n3/FullyNoded
icon: com.fontaine.FullyNoded.jpg
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes: 
date: 2023-11-17
signer: 
twitter: FullyNoded
social: 
features:
- hd
- companion
- TOR
- airGapped
- customNode
- mix
- multiSig
- ownFullNode
- ownLN
developerName: Denton LLC

---

{% include featureEvidence.html feature="hd" source="[App Store](https://apps.apple.com/app/com.fontaine.FullyNoded)" quote="you can add any BIP39 recovery phrase and it will recover all of the popular wallets for you." %}
{% include featureEvidence.html feature="companion" source="[App Store](https://apps.apple.com/app/com.fontaine.FullyNoded)" quote="using your Coldcard as a watch-only or multisig wallet powered by your own node has never been easier." %}

This is an iOS only app.

## App Description

> Self sovereign, secure, powerful, easy to use wallet that utilizes your own node as a backend. Powered by PSBT's and descriptors. Acts as an offline signer using your node as a watch-only wallet. C-Lightning compatible for instant, unfairly cheap payments.

## Analysis 

With integration to Bitcoin Core and with settings that allow a user to connect to his own node, this app is self-custodial. More information [here](https://fullynoded.app/faq/#How-Do-I-Create-a-Wallet&deadLink). However, since it is an iOS only app, development relies on mostly proprietary tools. 

We've noted its repository above. 

It is however, **non-verifiable** because of how the Apple App store distributes the app.

{% include featureEvidence.html feature="ownFullNode" quote="Fully Noded is a bitcoin wallet that is powered completely by your own node over Tor." source="Store description" %}

{% include featureEvidence.html feature="TOR" quote="Fully Noded is a bitcoin wallet that is powered completely by your own node over Tor." source="Store description" %}

{% include featureEvidence.html feature="multiSig" quote="the active wallet tab offers a powerful but simple wallet experience that allows you to utilize single signature and multi signature wallets." source="Store description" %}

{% include featureEvidence.html feature="ownLN" quote="Fully Noded is a family of iOS and macOS apps which enable you to utilize your own personal node (Bitcoin Core, Core Lightning, Join Market and PayJoin over Nostr) to power your desktop and mobile wallets." source="Website" %}

{% include featureEvidence.html feature="customNode" quote="Fully Noded is a client for Bitcoin Core, Bitcoin Knots and any other Bitcoin implementation that mirrors Bitcoin Core's RPC API." source="Website" %}

{% include featureEvidence.html feature="airGapped" quote="Multisig, air gapped signing, HWW functionality, native PSBT support, integrated Tor, pair with popular HWWs and popular node packages" source="Website" %}

{% include featureEvidence.html feature="mix" quote="Fully Noded is a family of iOS and macOS apps which enable you to utilize your own personal node (Bitcoin Core, Core Lightning, Join Market and PayJoin over Nostr) to power your desktop and mobile wallets." source="Website" %}