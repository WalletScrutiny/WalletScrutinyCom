---
title: Yeti Cold Wallet
appId: yeticold.wallet
authors:
- danny
released: 2019-10-04
discontinued: 
updated: 2025-03-20
version: 
binaries: 
provider: JWWeatherman
providerWebsite: 
website: https://yeticold.com
repository: https://github.com/JWWeatherman/yeticold
issue: 
icon: yeticold.wallet.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2025-06-03
twitter: YetiWallet
social: 
builds: 
features:
- companion
- TOR
- airGapped
- hd
- multiSig
- ownFullNode

---
{% include featureEvidence.html feature="companion" source="[README](https://github.com/JWWeatherman/yeticold#readme)" quote="Private keys are never on any device with a channel to an Internet connected device except through USB drives." %}

## Description

It is self-described as a "self-custodial, source-available Bitcoin cold storage solution". So it's more of a methodology with its own scripts.

Yeti is a Bitcoin-only cold storage solution that prioritizes security through a 3-of-7 multisig approach. The software creates private keys in an offline fashion, ensuring they never exist on internet-connected devices except through controlled USB transfers. 

While users need to clone the repository and run the scripts themselves, the **source code is fully available** on GitHub and can be audited. This transparency allows users to verify the code's security before trusting it with their Bitcoin. The project emphasizes minimal dependencies beyond Bitcoin Core and focuses on counterfeit prevention through full node verification. However, it has no binaries to verify.

{% include featureEvidence.html feature="multiSig" quote="A 3 of 7 multisig addresses is used for bitcoin storage. This allows up to 4 keys to be lost without losing bitcoin and requires 3 locations to be compromised by an attacker to lose funds." source="GitHub README" %}

{% include featureEvidence.html feature="hd" quote="HD Multisig is used so that you can send funds to 1,000 addresses, but recover all funds using only 3 seed phrases." source="GitHub README" %}

{% include featureEvidence.html feature="ownFullNode" quote="Yeti uses a bitcoin core full node. This means nothing is shared beyond what is required to create a bitcoin transaction." source="GitHub README" %}

{% include featureEvidence.html feature="TOR" quote="Yeti also uses Tor." source="GitHub README" %}

{% include featureEvidence.html feature="airGapped" quote="Private keys are never on any device with a channel to an Internet connected device except through USB drives." source="GitHub README" %}