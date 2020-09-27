---
title: "Green: Bitcoin Wallet"
altTitle: 

users: 100000
appId: com.greenaddress.greenbits_android_wallet
launchDate: 2015-01-01
latestUpdate: 2020-08-31
apkVersionName: "3.3.9"
stars: 3.9
ratings: 616
reviews: 339
size: 27M
website: https://blockstream.com/green
repository: https://github.com/Blockstream/green_android/
issue: https://github.com/Blockstream/green_android/issues/75
icon: com.greenaddress.greenbits_android_wallet.png
bugbounty: 
verdict: nonverifiable # May be any of: wip, fewusers, nowallet, nobtc, custodial, nosource, nonverifiable, reproducible, bounty, defunct
date: 2020-08-31
reviewStale: false
signer: 32f9cc00b13fbeace51e2fb51df482044e42ad34a9bd912f179fedb16a42970e
reviewArchive:
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
apkVersionName: 3.3.9
apkVersionCode: 22000339
apkHash:        6a4a4bb05c0c087c4b85486f01982a8bf1bde91a70c587e22929e9faed3eb6ed

Diff:
Files /tmp/fromPlay_com.greenaddress.greenbits_android_wallet_22000339/apktool.yml and /tmp/fromBuild_com.greenaddress.greenbits_android_wallet_22000339/apktool.yml differ
Only in /tmp/fromPlay_com.greenaddress.greenbits_android_wallet_22000339/original/META-INF: GREENADD.RSA
Only in /tmp/fromPlay_com.greenaddress.greenbits_android_wallet_22000339/original/META-INF: GREENADD.SF
Files /tmp/fromPlay_com.greenaddress.greenbits_android_wallet_22000339/original/META-INF/MANIFEST.MF and /tmp/fromBuild_com.greenaddress.greenbits_android_wallet_22000339/original/META-INF/MANIFEST.MF differ
Files /tmp/fromPlay_com.greenaddress.greenbits_android_wallet_22000339/res/drawable-hdpi/ic_testnet_btc_no_padding.png and /tmp/fromBuild_com.greenaddress.greenbits_android_wallet_22000339/res/drawable-hdpi/ic_testnet_btc_no_padding.png differ
Files /tmp/fromPlay_com.greenaddress.greenbits_android_wallet_22000339/res/drawable-ldpi/ic_sent.png and /tmp/fromBuild_com.greenaddress.greenbits_android_wallet_22000339/res/drawable-ldpi/ic_sent.png differ

Revision, tag (and its signature):
object 0194942842702d3944bd0dd32407bf506f10a3bf
type commit
tag release_3.3.9
tagger Luca Vaccaro <me@lvaccaro.com> 1598555237 +0200

Release 3.3.9
```

And unfortunately there is more diff than we would hope for.
`ic_testnet_btc_no_padding.png` and `ic_sent.png` should not differ and although
this is probably not a wallet stealing backdoor as both of those images are less
than 1kB, differ by 2B in size and actually have some pixels different but
look equal to the eye, we have to give it the verdict: **not verifiable**.

As those files are generated from vector files of similar name, this is probably
the result of non-deterministic or differing build tools. In the latter case,
different build instructions might result in successful rebuilds.
