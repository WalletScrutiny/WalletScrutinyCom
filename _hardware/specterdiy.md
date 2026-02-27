---
title: Specter DIY Hardware Wallet
appId: specterdiy
authors:
- danny
released: 2020-02-27
discontinued: 
updated: 2021-12-23
version: 1.6.2
binaries: 
dimensions:
- 170
- 65
- 20
weight: 
provider: Specter Solutions / Crypto Advance GmbH
providerWebsite: 
website: https://specter.solutions/#diy
shop: 
country: DE
price: 
repository: https://github.com/cryptoadvance/specter-diy
issue: 
icon: specterdiy.png
bugbounty: 
meta: ok
verdict: diy
appHashes: 
date: 2022-04-11
signer: 
twitter: SpecterWallet
social: 
builds: 
features:
- airGapped
- camera
- customNode
- multiSig
- segwit

---

As the name implies, Specter solutions is allowing Bitcoin enthusiasts to build their own hardware wallets by releasing the source code publicly and by sharing do-it-yourself video tutorials on how to assemble their hardware wallet.

## Can the private keys be created offline? Yes.

Once the users are successful in piecing together the necessary components, [setting up the device](https://www.youtube.com/watch?v=1H7FqG_FmCw) and creating the private keys are the next steps.

## Are the private keys shared? No.

The device is airgapped save for the time when the firmware is flashed via a micro USB port (prior to setup).

## Does the device display the receive address for confirmation? Yes.

The device's display adequately displays details of the transaction prior to confirmation.

## Is it reproducible?

The project is **"do-it-yourself"** and the firmware's source code is public, so there's a certain level of openness to it. With that said, it would be interesting to investigate this offering further.

{% include featureEvidence.html feature="segwit" quote="PSBT for unsigned transactions, wallet descriptors for importing/exporting multisig wallets" source="GitHub README" comment="PSBT and wallet descriptors imply SegWit support; however this is not explicit enough to confirm bech32 send/receive." %}

{% include featureEvidence.html feature="multiSig" quote="Our main focus is multisignature setup with other hardware wallets, but wallet can also work as a single signer." source="GitHub README" %}

{% include featureEvidence.html feature="airGapped" quote="QR codes are a default way for Specter to communicate with the host. QR codes are pretty convenient and allow the user to be in control of the data transmission - every QR code has a very limited capacity and communication happens unidirectionally. And it's airgapped - you don't need to connect the wallet to the computer at any time." source="GitHub README" %}

{% include featureEvidence.html feature="camera" quote="QR codes are a default way for Specter to communicate with the host. QR codes are pretty convenient and allow the user to be in control of the data transmission - every QR code has a very limited capacity and communication happens unidirectionally. And it's airgapped - you don't need to connect the wallet to the computer at any time." source="GitHub README" %}


{% include featureEvidence.html feature="customNode" quote="To communicate with Bitcoin Core easier we are also working on Specter Desktop app - a small python flask server talking to your Bitcoin Core node." source="GitHub README" %}