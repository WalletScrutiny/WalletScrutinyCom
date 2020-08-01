---
title: "Green: Bitcoin Wallet"
altTitle: 

users: 100000
appId: com.greenaddress.greenbits_android_wallet
launchDate: 2015-01-01
latestUpdate: 2020-07-09
apkVersionName: "3.3.8"
stars: 4
ratings: 591
reviews: 325
size: 27M
website: https://blockstream.com/green
repository: https://github.com/Blockstream/green_android/
issue: https://github.com/Blockstream/green_android/issues/75
icon: com.greenaddress.greenbits_android_wallet.png
bugbounty: 
verdict: reproducible # May be any of: wip, fewusers, nowallet, nobtc, custodial, nosource, nonverifiable, reproducible, bounty, defunct
date: 2020-07-11
reviewStale: false
signer: 32f9cc00b13fbeace51e2fb51df482044e42ad34a9bd912f179fedb16a42970e
reviewArchive:
- date: 2020-05-06
  version: "3.3.7"
  apkHash: 847a67a5cfa498cf2e137b0a4306202322a35d4e3fba6bb90a269709e26e11ab
  gitRevision: 4392a6481b289b2cb82d790db15fa8feadf40b1d
  verdict: reproducible
- date: 2020-04-26
  version: "3.3.6"
  apkHash: b91e3c6e35aa9223c7d1f62498b162fde226db38049016a354f87578fde371ab
  gitRevision: 9cc435e13b5b513f7ecdaa1baee739b2683d2ba5
  verdict: reproducible
- date: 2020-03-14
  version: "3.3.5"
  apkHash: e30092950197aa2801b0f958a90496cf182f76e790f2d7e82e08dbe01b7c32c8
  gitRevision: a6b2771dbc314160ba304573fd0a6cc5d6d1ccb9
  verdict: reproducible
- date: 2020-02-17
  version: "3.3.4"
  apkHash: f88686a2e41718b82ba8d2f5ff7eb8d0ada044d29711e75f0128104bbee40baf
  gitRevision: bb658ba9291af3d814ba8a00c4726c9584e379d1
  verdict: reproducible
- date: 2020-01-18
  version: "3.3.2"
  apkHash: 7e48e2ff0e8d484f4000b7d96bbdc6b0939a76d8ca80355b5ebedbf68511f77c
  gitRevision: d47e69dd99ac700665328b92b3026a2cf6e36960
  verdict: reproducible
- date: 2020-01-09
  version: "3.3.0"
  apkHash: b2e3f2d437bba5d97f3b331aac20616d3312e34d25023c38c42483974828cdec
  gitRevision: 0d558ec280ca9606901f6557622af98e0cbdc97b
  verdict: reproducible
- date: 2020-01-08
  version: "3.3.0"
  apkHash: b2e3f2d437bba5d97f3b331aac20616d3312e34d25023c38c42483974828cdec
  gitRevision: 1c9fb4e1d6a1a968df8ed063fd3574e0a1cbd146
  verdict: nonverifiable
- date: 2020-01-07
  version: "3.3.0"
  apkHash: b2e3f2d437bba5d97f3b331aac20616d3312e34d25023c38c42483974828cdec
  gitRevision: aaf376040e31e2ec65f7ffbb42c20c8d1c6cd58b
  verdict: nonverifiable
- date: 2019-11-23
  version: "3.2.7"
  apkHash: 8b2e67fc333eeef5b10ce6f9f5fc3e4ca104c1eca9c539b73805276e09d838db
  gitRevision: 3d972d9773b0fd2fb1602d31117a50be01d48610
  verdict: reproducible

providerTwitter: Blockstream
providerLinkedIn: company/blockstream
providerFacebook: Blockstream
providerReddit: 

redirect_from:
  - /greenwallet/
  - /com.greenaddress.greenbits_android_wallet/
  - /posts/2019/11/greenwallet/
  - /posts/com.greenaddress.greenbits_android_wallet/
---


With
[this script](https://gitlab.com/walletscrutiny/walletScrutinyCom/blob/master/test.sh)
we get:

```
Results:
appId:          com.greenaddress.greenbits_android_wallet
signer:         32f9cc00b13fbeace51e2fb51df482044e42ad34a9bd912f179fedb16a42970e
apkVersionName: 3.3.8
apkVersionCode: 22000338
apkHash:        3a0a02ea8ccd791ab3ec24bac4d45249164f5c53366538b5befcbd4df3f6edb3

Diff:
Files /tmp/fromPlay_com.greenaddress.greenbits_android_wallet_22000338/apktool.yml and /tmp/fromBuild_com.greenaddress.greenbits_android_wallet_22000338/apktool.yml differ
Only in /tmp/fromPlay_com.greenaddress.greenbits_android_wallet_22000338/original/META-INF: GREENADD.RSA
Only in /tmp/fromPlay_com.greenaddress.greenbits_android_wallet_22000338/original/META-INF: GREENADD.SF
Files /tmp/fromPlay_com.greenaddress.greenbits_android_wallet_22000338/original/META-INF/MANIFEST.MF and /tmp/fromBuild_com.greenaddress.greenbits_android_wallet_22000338/original/META-INF/MANIFEST.MF differ
```

And that diff looks exactly as it should look. Our verdict:
This app is **reproducible**.