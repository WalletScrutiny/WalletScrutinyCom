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
updated: 2021-11-17
version: "2.4.18"
stars: 3.7
ratings: 1037
reviews: 559
size: 24M
website: https://lightning-wallet.com
repository: https://github.com/btcontract/wallet/
issue: https://github.com/btcontract/wallet/issues/90
icon: com.btcontract.wallet.png
bugbounty: 
verdict: reproducible
date: 2021-11-18
signer: dca2c3527ec7f7c0e38c0353278e7a5674cfa6e4b7556510ff05f60073ca338a
reviewArchive:
- date: 2021-11-14
  version: "2.3.18"
  appHash: 385f39ac27f728846ee908f997cbb10dfb87719e22b62d492f59c5321c6cc0b6
  gitRevision: 3ae8946f95e28c5bc9787dec573d3dd5076f237c
  verdict: reproducible
- date: 2021-10-29
  version: "2.2.17"
  appHash: 18096c8996af7d0efd89d6481ee6a3a700691c8557e2f0986fc3fa7b770667b5
  gitRevision: 9a4ffd99428ebf9a8135f53771d4aa977bc9b837
  verdict: reproducible
- date: 2021-10-26
  version: "2.2.16"
  appHash: dd3204688e6a23831f0daa51904112643acf859550b6a6f1d6210e91f5da14f5
  gitRevision: fa227d42296cae666acec49c980629e0b2a71636
  verdict: reproducible
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


For that latest version, our test script returned this:

```
appId:          com.btcontract.wallet
signer:         dca2c3527ec7f7c0e38c0353278e7a5674cfa6e4b7556510ff05f60073ca338a
apkVersionName: 2.4.18
apkVersionCode: 86
verdict:        reproducible
appHash:        8d31451fde848faed483b4b4f2aa1f090e31c527985cfd7b673f00e82a28d574
commit:         d869a52f240eaa21eb7f02f26bc84edd643198ae

Diff:
Only in /tmp/fromPlay_com.btcontract.wallet_86/META-INF: BITCOINS.RSA
Only in /tmp/fromPlay_com.btcontract.wallet_86/META-INF: BITCOINS.SF
Files /tmp/fromPlay_com.btcontract.wallet_86/META-INF/MANIFEST.MF and /tmp/fromBuild_com.btcontract.wallet_86/META-INF/MANIFEST.MF differ

Revision, tag (and its signature):

```
