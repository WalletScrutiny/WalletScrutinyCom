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
updated: 2021-11-12
version: "2.3.18"
stars: 3.6
ratings: 1036
reviews: 559
size: 24M
website: https://lightning-wallet.com
repository: https://github.com/btcontract/wallet/
issue: https://github.com/btcontract/wallet/issues/90
icon: com.btcontract.wallet.png
bugbounty: 
verdict: reproducible
date: 2021-10-29
signer: dca2c3527ec7f7c0e38c0353278e7a5674cfa6e4b7556510ff05f60073ca338a
reviewArchive:
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


With the newly reproducible verdict, this wallet got some
extra scrutiny and it turned out their default lightning account is custodial
without stating so, which would warrant a "custodial" verdict.
It was named "HOSTED CHANNEL" which is
[very specific](https://lightning-wallet.com/posts/scaling-ln-with-hosted-channels/)
and well defined but not clear to novice users.

We
[petitioned to make this clearer](https://github.com/btcontract/wallet/issues/102)
and the provider reacted in record time, releasing version `2.2.17` with a fix.

For that latest version, our test script returned this:

```
Results:
appId:          com.btcontract.wallet
signer:         dca2c3527ec7f7c0e38c0353278e7a5674cfa6e4b7556510ff05f60073ca338a
apkVersionName: 2.2.17
apkVersionCode: 82
verdict:        reproducible
appHash:        18096c8996af7d0efd89d6481ee6a3a700691c8557e2f0986fc3fa7b770667b5
commit:         d1f254e66eaee912c073498cf361458e002777fb

Diff:
Only in /tmp/fromPlay_com.btcontract.wallet_82/META-INF: BITCOINS.RSA
Only in /tmp/fromPlay_com.btcontract.wallet_82/META-INF: BITCOINS.SF
Files /tmp/fromPlay_com.btcontract.wallet_82/META-INF/MANIFEST.MF and /tmp/fromBuild_com.btcontract.wallet_82/META-INF/MANIFEST.MF differ

Revision, tag (and its signature):
```

The separately downloaded `graph.snapshot-mainnet.zlib` had this hash:

```
4d3ffab44c6e4d8352b32eb2168f8f5aa829991391d9d06ebef4e5afc327c0f7 app/src/main/assets/graph.snapshot-mainnet.zlib
```
