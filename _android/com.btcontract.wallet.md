---
wsId: 
title: 'SBW: Simple Bitcoin Wallet'
altTitle: 
authors:
- leo
- emanuel
users: 100000
appId: com.btcontract.wallet
appCountry: 
released: 2015-07-15
updated: 2023-10-27
version: 2.5.8
stars: 3.9
ratings: 1061
reviews: 34
website: 
repository: https://github.com/Tactical-Advantage-Trading/wallet
issue: 
icon: com.btcontract.wallet.png
bugbounty: 
meta: removed
verdict: sourceavailable
appHashes: []
date: 2024-11-22
signer: dca2c3527ec7f7c0e38c0353278e7a5674cfa6e4b7556510ff05f60073ca338a
twitter: SimpleBtcWallet
social: 
redirect_from: 
developerName: anton kumaigorodski
features:
- ln

---

For that latest version, our {% include testScript.html %} returned this:

```
===== Begin Results =====
appId:          com.btcontract.wallet
signer:         dca2c3527ec7f7c0e38c0353278e7a5674cfa6e4b7556510ff05f60073ca338a
apkVersionName: 2.5.8
apkVersionCode: 109
verdict:        reproducible
appHash:        255a6fc14d8c900d92f9a707c73b50e2f1668ed020f2f23da3af50ca6fa7dd05
commit:         b49725b591a24d80841390e03e689c20b3f68dde

Diff:
Only in /tmp/fromPlay_com.btcontract.wallet_109/META-INF: BITCOINS.RSA
Only in /tmp/fromPlay_com.btcontract.wallet_109/META-INF: BITCOINS.SF
Files /tmp/fromPlay_com.btcontract.wallet_109/META-INF/MANIFEST.MF and /tmp/fromBuild_com.btcontract.wallet_109/META-INF/MANIFEST.MF differ

Revision, tag (and its signature):

===== End Results =====
```

The app is **reproducible**.

Here is a little experiment: The reproducible build was recorded as an
"asciicast".

{% include asciicast %}
