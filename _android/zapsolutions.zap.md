---
wsId: zapwallet
title: 'Zap: Bitcoin Lightning Wallet'
altTitle: 
authors:
- leo
users: 10000
appId: zapsolutions.zap
alternativeStores: 
appCountry: 
released: 
updated: 2023-04-16
version: VARY
reviews: 
website: https://web.archive.org/web/20200627113118/https://zap.jackmallers.com/
repository: https://github.com/LN-Zap/zap-android
icon: zapsolutions.zap.png
bugbounty: 
meta: removed
verdict: sourceavailable
appHashes: []
date: 2023-12-19
signer: 
twitter: ln_zap
social:
- https://medium.com/@JimmyMow
- https://join.slack.com/t/zaphq/shared_invite/enQtMzgyNDA2NDI2Nzg0LWQ1OGMyMWI3YTdmYTQ0YTVmODg4ZmNkYjQ1MzUxNGExMGRmZWEyNTUyOGQzMzZkYTdhODE3NmQxZWZiOGFkYWI
redirect_from:
- /posts/zapsolutions.zap/
developerName: LN OSS
builds: 
features:
- segwit
- TOR
- ownLN
- multiAccount
- nfc
- foss
- ln

---

{% include featureEvidence.html feature="segwit" source="[README](https://github.com/LN-Zap/zap-android#readme)" quote="Support for Bech32 and P2SH addresses" %}
{% include featureEvidence.html feature="TOR" source="[README](https://github.com/LN-Zap/zap-android#readme)" quote="Tor support" %}
{% include featureEvidence.html feature="ownLN" source="[README](https://github.com/LN-Zap/zap-android#readme)" quote="it is actually a remote control for one or more of your LND Nodes" %}
{% include featureEvidence.html feature="multiAccount" source="[README](https://github.com/LN-Zap/zap-android#readme)" quote="Manage multiple wallets/nodes" %}
{% include featureEvidence.html feature="nfc" source="[README](https://github.com/LN-Zap/zap-android#readme)" quote="Read NFC tags" %}
{% include featureEvidence.html feature="foss" source="[README](https://github.com/LN-Zap/zap-android#readme)" quote="MIT License" %}

*Legacy verification [2021](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/1b96115dbe0d002e06d34997d4950d6ed2744075/_android/zapsolutions.zap.md)*

# About the app

This app is a remote control for lnd, the lightning network daemon. As such it
is not exactly a wallet in the sense of many other wallets here as the lnd
connected to, also has control over the funds but in a setup where you connect
to your own lnd, Zap gets into the position of being able to steal your funds.
If you have strong objections with the classification as a wallet, please open
an issue on our GitLab.
