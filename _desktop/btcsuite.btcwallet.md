---
title: BTCSuite BTCWallet
appId: btcsuite.btcwallet
authors:
- danny
released: 2015-03-04
discontinued: 
updated: 2025-04-17
version: 0.16.17
binaries: 
provider: 
providerWebsite: 
website: 
repository: https://github.com/btcsuite/btcwallet
icon: 
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2025-09-16
twitter: 
social: 
builds: 
features:
- customNode
- foss
- hd
- multiAccount
- ownFullNode

---

{% include featureEvidence.html feature="hd" quote="Public and private keys are derived using the hierarchical deterministic format described by BIP0032." source="GitHub README" %}

{% include featureEvidence.html feature="multiAccount" quote="btcwallet uses the m/44'/<coin type>'/<account>'/<branch>/<address index> HD path for all derived addresses, as described by BIP0044." source="GitHub README" %}

{% include featureEvidence.html feature="ownFullNode" quote="btcwallet is not an SPV client and requires connecting to a local or remote btcd instance for asynchronous blockchain queries and notifications over websockets." source="GitHub README" %}

{% include featureEvidence.html feature="customNode" quote="btcwallet is not an SPV client and requires connecting to a local or remote btcd instance for asynchronous blockchain queries and notifications over websockets." source="GitHub README" %}

{% include featureEvidence.html feature="foss" quote="btcwallet is licensed under the liberal ISC License." source="GitHub README" %}