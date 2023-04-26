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
updated: 2022-01-19
version: 2.4.27
stars: 3.9
ratings: 1061
reviews: 33
size: 
website: https://lightning-wallet.com/
repository: https://github.com/btcontract/wallet
issue: https://github.com/btcontract/wallet/issues/90
icon: com.btcontract.wallet.png
bugbounty: 
meta: stale
verdict: reproducible
date: 2023-01-16
signer: dca2c3527ec7f7c0e38c0353278e7a5674cfa6e4b7556510ff05f60073ca338a
reviewArchive:
- date: 2022-01-31
  version: 2.4.27
  appHash: d21229831b319fcb8ebbfcad5785850ff07d5d8715d02fce10c6fb1a1b2de388
  gitRevision: d75708ec1ae0c6b2febf4ff5ac2f32aa85af3139
  verdict: reproducible
- date: 2022-01-16
  version: 2.4.26
  appHash: 1995e343e5a6e89b47ae5925396dd5b0d59d8da43f0f687f7d691ef9af5f3d04
  gitRevision: 7fb8a183fee60571885418fcdf05478698687b0f
  verdict: reproducible
- date: 2021-12-20
  version: 2.4.24
  appHash: 1188199a37cb44fc25a36eb6280307289fbf462ad5bb4c31a4a902737240f4cb
  gitRevision: d29296d247b115262f2043c58bd3c6f8310789f3
  verdict: reproducible
- date: 2021-12-14
  version: 2.4.23
  appHash: 34a1f4b1e72e75d680f7c8c62ba85fc9bcc7187231ac48f1fe1347403a029341
  gitRevision: 274063068db9f48d67cfa5233880f709c2e9b285
  verdict: reproducible
- date: 2021-12-03
  version: 2.4.22
  appHash: 62d9d3300635a3a3b04a10776c4ab2ffaa5f89d3372364f95d0beced189688d8
  gitRevision: 3ac84d714e2c6193e42dd80d876d4d4d487bf141
  verdict: reproducible
- date: 2021-12-01
  version: 2.4.21
  appHash: 19ef332871f3b2db372bba3cc86492b5b5ac664bb925ba3bcbf9f084f52a40d1
  gitRevision: 07985e3defd8e5556a10de4d4612a19bef588ed6
  verdict: reproducible
- date: 2021-11-25
  version: 2.4.19
  appHash: 5584144f5661b58c39da10b81582ed2e7b6947e078e487f6b86393dc17aea1ee
  gitRevision: 6e07851bd4b7b113639b686db04f45443d2d4556
  verdict: reproducible
- date: 2021-11-18
  version: 2.4.18
  appHash: 8d31451fde848faed483b4b4f2aa1f090e31c527985cfd7b673f00e82a28d574
  gitRevision: e47ee39b5333b3b27c1849e379bd1f1d6c772bd1
  verdict: reproducible
- date: 2021-11-14
  version: 2.3.18
  appHash: 385f39ac27f728846ee908f997cbb10dfb87719e22b62d492f59c5321c6cc0b6
  gitRevision: 3ae8946f95e28c5bc9787dec573d3dd5076f237c
  verdict: reproducible
- date: 2021-10-29
  version: 2.2.17
  appHash: 18096c8996af7d0efd89d6481ee6a3a700691c8557e2f0986fc3fa7b770667b5
  gitRevision: 9a4ffd99428ebf9a8135f53771d4aa977bc9b837
  verdict: reproducible
- date: 2021-10-26
  version: 2.2.16
  appHash: dd3204688e6a23831f0daa51904112643acf859550b6a6f1d6210e91f5da14f5
  gitRevision: fa227d42296cae666acec49c980629e0b2a71636
  verdict: reproducible
- date: 2021-10-15
  version: 2.1.14
  appHash: 
  gitRevision: f43ec311500efbb0ea1c8ebadc52c545a434a341
  verdict: nonverifiable
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
apkVersionName: 2.4.27
apkVersionCode: 95
verdict:        reproducible
appHash:        3c7f6da25bd0df54dd6068ddf50ee316d82691766e31b328156591b8c5b5ea01
commit:         2bcad8faeda2ca67f8ceb4b0e686ac1cce0f0d1b

Diff:
Only in /tmp/fromPlay_com.btcontract.wallet_95/META-INF: BITCOINS.RSA
Only in /tmp/fromPlay_com.btcontract.wallet_95/META-INF: BITCOINS.SF
Files /tmp/fromPlay_com.btcontract.wallet_95/META-INF/MANIFEST.MF and /tmp/fromBuild_com.btcontract.wallet_95/META-INF/MANIFEST.MF differ

Revision, tag (and its signature):

===== End Results =====
```

The app is **reproducible**.
