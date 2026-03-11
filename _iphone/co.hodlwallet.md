---
wsId: hodl
title: 'HODL Wallet : Bitcoin Wallet'
altTitle: 
authors:
- leo
- danny
appId: co.hodlwallet
appCountry: 
idd: '1382342568'
released: 2018-08-01
updated: 2023-07-13
version: '1.13'
reviews: 138
website: https://hodlwallet.com
repository: https://github.com/hodlwallet/hodl-wallet-ios
issue: 
icon: co.hodlwallet.jpg
bugbounty: 
meta: removed
verdict: sourceavailable
appHashes: 
date: 2025-09-09
signer: 
twitter: hodlwallet
social:
- https://www.facebook.com/hodlwallet
features:
- secEl
- foss
- customNode
developerName: Hodl Wallet Inc

---

{% include featureEvidence.html feature="secEl" source="[README](https://github.com/hodlwallet/hodl-wallet-ios#readme)" quote="Private keys are stored only in the secure enclave of the user's phone, inaccessible to anyone other than the user." %}
{% include featureEvidence.html feature="foss" source="[README](https://github.com/hodlwallet/hodl-wallet-ios#readme)" quote="MIT license" %}
{% include featureEvidence.html feature="customNode" source="[Website](https://hodlwallet.com)" quote="Advanced users can point HODL Wallet directly to their own Bitcoin node." %}

On the App Store the provider claims:

> Your Bitcoin are stored on your device and backed up to a Backup Recovery Key
  when you create a wallet. This means HODL Wallet can never stop you from
  accessing or sending your funds.

which is not very clear. The Backup part is a bit concerning but if they had
access to that, the second sentence would be wrong. This should thus be a claim
of being non-custodial.

> HODL Wallet is free, open source

so in their source repository one could check the claim but as iPhone apps are
all currently not reproducible, the app remains **not verifiable**.
