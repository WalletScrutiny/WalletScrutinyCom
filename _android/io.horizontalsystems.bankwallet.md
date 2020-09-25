---
title: "Unstoppable - Invest In Crypto"
altTitle: 

users: 1000
appId: io.horizontalsystems.bankwallet
launchDate: 2018-12-18
latestUpdate: 2020-09-22
apkVersionName: "0.16.1"
stars: 4.6
ratings: 233
reviews: 204
size: 33M
website: https://unstoppable.money/
repository: https://github.com/horizontalsystems/unstoppable-wallet-android
issue: https://github.com/horizontalsystems/unstoppable-wallet-android/issues/2597
icon: io.horizontalsystems.bankwallet.png
bugbounty: 
verdict: reproducible # May be any of: wip, fewusers, nowallet, nobtc, custodial, nosource, nonverifiable, reproducible, bounty, defunct
date: 2020-07-24
reviewStale: false
signer: c1899493e440489178b8748851b72cbed50c282aaa8c03ae236a4652f8c4f27b
reviewArchive:
- date: 2020-07-22
  version: "0.16.0"
  apkHash: 6dc469ed865d0fe2cd855c7b227b54692877e4b09f6dc765d56fae80c20a2524
  gitRevision: ad53627c5be906793c9c868da64bf07d83b16de0
  verdict: nonverifiable
- date: 2020-07-15
  version: "0.15.0"
  apkHash: 9fad17afdb38e3ec1e38c4e88faddd479e179d2e7004722e6fb0bd440a6ea851
  gitRevision: cdff061989fc681a1fa928da59fb98a0be7d75b2
  verdict: reproducible
- date: 2020-06-14
  version: "0.14.1"
  apkHash: a45881e3ae8bba31c2fc09ecbb63ce5d200c77512f256971a12e9ab830ae719d
  gitRevision: a28d71826772bcb5d28cad48489b7f91b9c3b882
  verdict: reproducible
- date: 2020-06-07
  version: "0.14.0"
  apkHash: 9abbc4c1b7475c75437c416f5e103d4fd83625f0a7463be6aec545bff86d920d
  gitRevision: b5ebfb9fdedf9b686511645bae3e05fe13aa3d2f
  verdict: nonverifiable
- date: 2020-05-16
  version: "0.13.0"
  apkHash: 20b023949e0572af577beb0df94c6dbaf758be0d7bd323e632392c93c6640f2d
  gitRevision: f2664abad8e41ce1b3e225be0eae63d18a0cc053
  verdict: reproducible
- date: 2020-03-25
  version: "0.12.0"
  apkHash: cc616d5c4b67911e3ef65dc58f6cf045d18810826cd362a85776459607cb070c
  gitRevision: 45359b810b471200750ab0914f6c506054cf1123
  verdict: nonverifiable
- date: 2020-03-21
  version: "0.12.0"
  apkHash: cc616d5c4b67911e3ef65dc58f6cf045d18810826cd362a85776459607cb070c
  gitRevision: 65d19944379884fc3f0b9268e7e83b7dda63b5ba
  verdict: nonverifiable
- date: 2020-01-31
  version: "0.11.0"
  apkHash: f5bd6b218bb5e4fa605ed0c8e3dd9f424baf2656b9008f269d9e34697e0b21c0
  gitRevision: 43d012f4990ca6fed9d4b042224bf8fdd48ff41e
  verdict: reproducible
- date: 2020-01-29
  version: "0.11.0"
  apkHash: f5bd6b218bb5e4fa605ed0c8e3dd9f424baf2656b9008f269d9e34697e0b21c0
  gitRevision: 92e4a67ecc626220965114cd6a4cd67497e3be9f
  verdict: nonverifiable

providerTwitter: 
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:
  - /io.horizontalsystems.bankwallet/
  - /posts/io.horizontalsystems.bankwallet/
---


After we failed to reproduce version `0.16.0` we opened an
[issue on their GitHub](https://github.com/horizontalsystems/unstoppable-wallet-android/issues/2597)
and they quickly reacted and shared a new release. At the time of writing this,
that release was not yet available on Google Play but if you chose to use it,
you can check the provided sha256 hash to make sure it's not yet another binary.
In any case we will also repeat this exercise once we get the update from Google
Play.

Here is the output using our
[test script](https://gitlab.com/walletscrutiny/walletScrutinyCom/blob/master/test.sh)
on the binary provided in above issue:

```
Results:
appId:          io.horizontalsystems.bankwallet
signer:         c1899493e440489178b8748851b72cbed50c282aaa8c03ae236a4652f8c4f27b
apkVersionName: 0.16.1
apkVersionCode: 31
apkHash:        ceb4d72b8ae2358c8779b5e0bba5e08bae08e1524eb9b6c0b2ca86889cc91adc

Diff:
Files /tmp/fromPlay_io.horizontalsystems.bankwallet_31/apktool.yml and /tmp/fromBuild_io.horizontalsystems.bankwallet_31/apktool.yml differ
Files /tmp/fromPlay_io.horizontalsystems.bankwallet_31/original/META-INF/MANIFEST.MF and /tmp/fromBuild_io.horizontalsystems.bankwallet_31/original/META-INF/MANIFEST.MF differ
Only in /tmp/fromPlay_io.horizontalsystems.bankwallet_31/original/META-INF: RELEASEK.RSA
Only in /tmp/fromPlay_io.horizontalsystems.bankwallet_31/original/META-INF: RELEASEK.SF

Revision, tag (and its signature):
object ce3dd60770915278a523e64f8a9dd49eb2878ef2
type commit
tag 0.16.1
tagger Rafael Muhamedzyanov <rafaelekol@mail.ru> 1600935873 +0600

```

That's how it should look like to give it the verdict: **reproducible**.
