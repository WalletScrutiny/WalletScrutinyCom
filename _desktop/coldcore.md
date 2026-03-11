---
title: JamesOB Cold Core
appId: coldcore
authors:
- danny
released: 2020-12-12
discontinued: 
updated: 2024-01-10
version: 0.4.1
binaries: 
provider: JamesOB
providerWebsite: 
website: 
repository: https://github.com/jamesob/coldcore
issue: 
icon: 
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2024-12-07
twitter: 
social: 
builds: 
features:
- airGapped
- coinCtrl
- companion
- customNode
- foss
- ownFullNode
- segwit

---

{% include featureEvidence.html feature="segwit" quote="bc1qgyq7lxmk359c3vyxzz674pr8a9gnguxkgdw55p" source="GitHub README" comment="Donation address is a native bech32 SegWit address; sending to bech32 addresses is also shown in the usage example (tb1q... addresses)." %}

{% include featureEvidence.html feature="ownFullNode" quote="A trust-minimized Bitcoin wallet interface that relies only on Bitcoin Core." source="GitHub README" %}

{% include featureEvidence.html feature="airGapped" quote="Supports only airgapped, opensource hardware wallets" source="GitHub README" %}

{% include featureEvidence.html feature="companion" quote="Supports only airgapped, opensource hardware wallets" source="GitHub README" comment="Coldcore is the companion app that prepares PSBTs and broadcasts transactions while the Coldcard handles signing with no internet connection." %}

{% include featureEvidence.html feature="coinCtrl" quote="- [ ] allow manual coin selection when sending" source="GitHub README" comment="Listed as a TODO/planned feature, not yet implemented — omitting per conservative rules." %}

{% include featureEvidence.html feature="customNode" quote="coldcore --rpc <url> Specify the Bitcoin Core RPC server. Useful if you're running Bitcoin Core on a separate host." source="GitHub README" %}

{% include featureEvidence.html feature="foss" quote="License 404: Not Found" source="GitHub README" comment="License file returned 404 — cannot confirm FOSS license. Omitting per conservative rules." %}