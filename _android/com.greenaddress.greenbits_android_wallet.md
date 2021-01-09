---
title: "Green: Bitcoin Wallet"
altTitle: 

users: 100000
appId: com.greenaddress.greenbits_android_wallet
launchDate: 2015-01-01
latestUpdate: 2021-01-02
apkVersionName: "3.4.5"
stars: 3.7
ratings: 683
reviews: 377
size: 34M
website: https://blockstream.com/green
repository: https://github.com/Blockstream/green_android/
issue: https://github.com/Blockstream/green_android/issues/75
icon: com.greenaddress.greenbits_android_wallet.png
bugbounty: 
verdict: reproducible # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2021-01-03
reviewStale: false
signer: 32f9cc00b13fbeace51e2fb51df482044e42ad34a9bd912f179fedb16a42970e
reviewArchive:
- date: 2020-12-15
  version: "3.4.4"
  apkHash: d54f84856c25c302978ed5c23ad01c3c0c89930f8f9cd2098558563d9f8b1a3e
  gitRevision: 9817359e09ab4cc05136dc7dfbb40d950750ec4f
  verdict: reproducible
- date: 2020-11-08
  version: "3.4.2"
  apkHash: e631aef67a2d50cced4f3a2a850e6f32950e0a91e12678678441defa3da71681
  gitRevision: e855e82e36403f60cfebfd66a8126f9c7dc1cfd4
  verdict: reproducible
- date: 2020-10-17
  version: "3.4.1"
  apkHash: 991b1d5672faed19ee8e96a66f7b6812e23971eaf28187424c9af41c4ff16d82
  gitRevision: 84ced1caca6883b917853741705a4b70e7c40ef9
  verdict: reproducible
- date: 2020-10-07
  version: "3.4.0"
  apkHash: fb7d9611ad878ef4116b525a50255f3b16725ec673a5c717f14c5d021b242188
  gitRevision: 84ced1caca6883b917853741705a4b70e7c40ef9
  verdict: reproducible
- date: 2020-08-31
  version: "3.3.9"
  apkHash: 6a4a4bb05c0c087c4b85486f01982a8bf1bde91a70c587e22929e9faed3eb6ed
  gitRevision: ea0cf3403d57a0e33f7d7627d9854b737fc0d62e
  verdict: nonverifiable
- date: 2020-07-11
  version: "3.3.8"
  apkHash: 3a0a02ea8ccd791ab3ec24bac4d45249164f5c53366538b5befcbd4df3f6edb3
  gitRevision: 09ea9943f4ad41f83d28027e3275105483849996
  verdict: reproducible
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
apkVersionName: 3.4.5
apkVersionCode: 22000345
apkHash:        efa5e3e56b1081bb66ca99d3fea7d5b1375a8f30696acf0938a324ba12c5458c

Diff:
Files /tmp/fromPlay_com.greenaddress.greenbits_android_wallet_22000345/apktool.yml and /tmp/fromBuild_com.greenaddress.greenbits_android_wallet_22000345/apktool.yml differ
Only in /tmp/fromPlay_com.greenaddress.greenbits_android_wallet_22000345/original/META-INF: GREENADD.RSA
Only in /tmp/fromPlay_com.greenaddress.greenbits_android_wallet_22000345/original/META-INF: GREENADD.SF
Files /tmp/fromPlay_com.greenaddress.greenbits_android_wallet_22000345/original/META-INF/MANIFEST.MF and /tmp/fromBuild_com.greenaddress.greenbits_android_wallet_22000345/original/META-INF/MANIFEST.MF differ

Revision, tag (and its signature):
object 5cb9f586ec91463d59ed23c51ca2d0b13a2390fe
type commit
tag release_3.4.5
tagger Luca Vaccaro <me@lvaccaro.com> 1609618980 +0100

Release 3.4.5
```

which is what we want to see to give this wallet the verdict: **reproducible**
