---
wsId: zapwallet
title: 'Zap: Bitcoin Lightning Wallet'
verdict: sourceavailable
meta: removed
authors:
- leo
twitter: ln_zap
social:
- https://medium.com/@JimmyMow
- https://join.slack.com/t/zaphq/shared_invite/enQtMzgyNDA2NDI2Nzg0LWQ1OGMyMWI3YTdmYTQ0YTVmODg4ZmNkYjQ1MzUxNGExMGRmZWEyNTUyOGQzMzZkYTdhODE3NmQxZWZiOGFkYWI
features:
- segwit
- TOR
- ownLN
- multiAccount
- nfc
- foss
- ln
- customNode
- hd
redirect_from:
- /posts/zapsolutions.zap/
- /android/zapsolutions.zap/
- /iphone/com.jackmallers.zap/
android:
  appId: zapsolutions.zap
  users: 10000
  updated: 2023-04-16
  version: VARY
  icon: zapsolutions.zap.png
  date: 2023-12-19
  website: https://web.archive.org/web/20200627113118/https://zap.jackmallers.com/
  repository: https://github.com/LN-Zap/zap-android
  developerName: LN OSS
iphone:
  appId: com.jackmallers.zap
  idd: 1406311960
  released: 2019-04-27
  updated: 2020-08-03
  version: 0.5.2
  reviews: 63
  icon: com.jackmallers.zap.jpg
  date: 2022-04-25
  website: https://zaphq.io
  repository: https://github.com/LN-Zap/zap-iOS

---

## Android

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

---

## iPhone

{% include featureEvidence.html feature="segwit" source="[README](https://github.com/LN-Zap/zap-iOS#readme)" quote="Support for Bech32 and P2SH addresses" %}
{% include featureEvidence.html feature="ownLN" source="[README](https://github.com/LN-Zap/zap-iOS#readme)" quote="Connect to remote Lnd node" %}
{% include featureEvidence.html feature="customNode" source="[README](https://github.com/LN-Zap/zap-iOS#readme)" quote="Connect to BTCPay Server" %}
{% include featureEvidence.html feature="hd" source="[README](https://github.com/LN-Zap/zap-iOS#readme)" quote="BIP39 passphrase" %}
{% include featureEvidence.html feature="foss" source="[README](https://github.com/LN-Zap/zap-iOS#readme)" quote="MIT License" %}

**Update 2022-04-05**: This app is not available anymore.

This app does not feature a provider website but a GitHub account which links to
[this website](http://zaphq.io).

> **Safe**<br>
  Zap is non-custodial. At no point does anyone have access to funds besides
  you, the user. Your keys, your coins, your node, your rules. All on your
  device.

So we found some code and a claim of not being custodial but the provider does
not claim reproducibility, so we conclude this app is **not verifiable**.
