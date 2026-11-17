---
title: BTCSuite BTCWallet
appId: btcsuite.btcwallet
authors:
- danny
released: 2015-03-04
discontinued: 
updated: 2026-06-24
version: 0.18.0
binaries: 
provider: 
providerWebsite: 
website: 
repository: https://github.com/btcsuite/btcwallet
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2026-11-13
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

## Update 2026-11-13

This app builds from source, and has not released binaries since 2015-11-23.

{% include featureEvidence.html feature="hd" quote="Public and private keys are derived using the hierarchical deterministic format described by BIP0032." source="GitHub README" %}

{% include featureEvidence.html feature="multiAccount" quote="btcwallet uses the m/44'/<coin type>'/<account>'/<branch>/<address index> HD path for all derived addresses, as described by BIP0044." source="GitHub README" %}

{% include featureEvidence.html feature="ownFullNode" quote="btcwallet is not an SPV client and requires connecting to a local or remote btcd instance for asynchronous blockchain queries and notifications over websockets." source="GitHub README" %}

{% include featureEvidence.html feature="customNode" quote="btcwallet is not an SPV client and requires connecting to a local or remote btcd instance for asynchronous blockchain queries and notifications over websockets." source="GitHub README" %}

{% include featureEvidence.html feature="foss" quote="btcwallet is licensed under the liberal ISC License." source="GitHub README" %}