---
wsId: zapwallet
title: 'Zap: Bitcoin Lightning Wallet'
altTitle: 
authors:
- leo
users: 10000
appId: zapsolutions.zap
appCountry: 
released: 
updated: 2023-04-16
version: VARY
stars: 
ratings: 
reviews: 
website: http://zap.jackmallers.com
repository: https://github.com/LN-Zap/zap-android
issue: 
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
features:
- ln

---

**Update 2024-05-23**: This project was discontinued and removed from the Play
Store but the provider refers to {% include walletLink.html
wallet='android/app.michaelwuensch.bitbanana' verdict='true' %} as its successor.



Here is the output using our {% include testScript.html %} on the binary from Google Play:

```
===== Begin Results =====
appId:          zapsolutions.zap
signer:         24a0e944a65d8cea692653e1a132a042c37be334f1b0b4200575fee6f46eca86
apkVersionName: 0.5.10-beta
apkVersionCode: 3040
verdict:        reproducible
appHash:        22b3821bb6f97aa9522be2600b50ac834f939ecf4a194b7d40043e13f17f381b
commit:         e644701264e11c134e3ea177026a0495d681a227

Diff:


Revision, tag (and its signature):

===== End Results =====
```

That's how it should look like to give it the verdict: **reproducible**.

# About the app

This app is a remote control for lnd, the lightning network daemon. As such it
is not exactly a wallet in the sense of many other wallets here as the lnd
connected to, also has control over the funds but in a setup where you connect
to your own lnd, Zap gets into the position of being able to steal your funds.
If you have strong objections with the classification as a wallet, please open
an issue on our GitLab.
