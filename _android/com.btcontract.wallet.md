---
wsId: 
title: "SBW: Simple Bitcoin Wallet"
altTitle: 
authors:
- leo
- emanuel
users: 100000
appId: com.btcontract.wallet
released: 2015-07-15
updated: 2021-10-25
version: "2.2.16"
stars: 3.6
ratings: 1029
reviews: 555
size: 24M
website: https://lightning-wallet.com
repository: https://github.com/btcontract/wallet/
issue: https://github.com/btcontract/wallet/issues/90
icon: com.btcontract.wallet.png
bugbounty: 
verdict: reproducible
date: 2021-10-26
signer: dca2c3527ec7f7c0e38c0353278e7a5674cfa6e4b7556510ff05f60073ca338a
reviewArchive:
- date: 2021-10-15
  version: "2.1.14"
  appHash: 
  gitRevision: f43ec311500efbb0ea1c8ebadc52c545a434a341
  verdict: nonverifiable

providerTwitter: SimpleBtcWallet
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:

---


**Update 2021-10-26**: With some more efforts, Emanuel and the provider's team
fixed all issues and the app is now **reproducible**! Our newly created test script,
a slight variation of the "build instructions" and Emanuel's findings comes to
these results:

```
Results:
appId:          com.btcontract.wallet
signer:         dca2c3527ec7f7c0e38c0353278e7a5674cfa6e4b7556510ff05f60073ca338a
apkVersionName: 2.2.16
apkVersionCode: 80
verdict:        reproducible
appHash:        dd3204688e6a23831f0daa51904112643acf859550b6a6f1d6210e91f5da14f5
commit:         f2238ca7096fe3752228d43149c1b48a97de0cfc

Diff:
Only in /tmp/fromPlay_com.btcontract.wallet_80/META-INF: BITCOINS.RSA
Only in /tmp/fromPlay_com.btcontract.wallet_80/META-INF: BITCOINS.SF
Files /tmp/fromPlay_com.btcontract.wallet_80/META-INF/MANIFEST.MF and /tmp/fromBuild_com.btcontract.wallet_80/META-INF/MANIFEST.MF differ

Revision, tag (and its signature):
```

The separately downloaded `graph.snapshot-mainnet.zlib` had this hash:

```
bcc0bf1a8bd7527ce3903b198a5739cfa8f763731b4f2c03b608875a3ebb0a9c app/src/main/assets/graph.snapshot-mainnet.zlib
```

**Update 2021-10-15**: Emanuel meanwhile
[was able to compile](https://github.com/btcontract/wallet/issues/63#issuecomment-924162388)
the app. Unfortunately there are remaining
[reproducibility issues](https://github.com/btcontract/wallet/issues/90).

## Old, updated Analysis

The provider
[stated here](https://github.com/btcontract/lnwallet/issues/20#issuecomment-902663980)
that {% include walletLink.html wallet='android/com.lightning.walletapp' verdict='true' %}
was discontinued and this is its successor.

Their website says:

> Simple Bitcoin Wallet (aka SBW) is an open-source, non-custodial, autonomous
  wallet for Android devices which can store, send and receive bitcoins.

This sounds good. What doesn't sound good are the many scam accusations and bug
complaints in the reviews on Play Store.

The
[link to f-droid.org](https://f-droid.org/packages/com.btcontract.wallet/) gives
hope to find a reproducible app though.
