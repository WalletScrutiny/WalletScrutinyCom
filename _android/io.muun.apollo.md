---
wsId: muun
title: 'Muun: Bitcoin Lightning Wallet'
altTitle: 
authors:
- leo
- mohammad
- keraliss
users: 500000
appId: io.muun.apollo
appCountry: 
released: 2017-04-25
updated: 2025-04-08
version: '53.3'
stars: 4
ratings: 650
reviews: 213
website: https://muun.com
repository: https://github.com/muun/apollo
issue: https://github.com/muun/apollo/issues/54
icon: io.muun.apollo.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes:
- 9c743af9930e7eca39581e70ec9213489e572dc93fe33d3a90bc95b00825a4dc
date: 2025-02-24
signer: 026ae0ac859cc32adf2d4e7aa909daf902f40db0b4fe6138358026fd62836ad1
twitter: MuunWallet
social: 
redirect_from:
- /io.muun.apollo/
- /posts/io.muun.apollo/
developerName: muun
features:
- ln

---

With this {% include testScript.html %} we get:

```
===== Begin Results =====
appId:          io.muun.apollo
signer:         026ae0ac859cc32adf2d4e7aa909daf902f40db0b4fe6138358026fd62836ad1
apkVersionName: 52.7
apkVersionCode: 1207
verdict:        
appHash:        9c743af9930e7eca39581e70ec9213489e572dc93fe33d3a90bc95b00825a4dc
commit:         8d6e88e553441e6493ae5c5874fed90dac596467

Diff:
Only in /tmp/fromPlay_io.muun.apollo_1207/META-INF: APOLLORE.RSA
Only in /tmp/fromPlay_io.muun.apollo_1207/META-INF: APOLLORE.SF
Only in /tmp/fromPlay_io.muun.apollo_1207/META-INF: MANIFEST.MF
Files /tmp/fromPlay_io.muun.apollo_1207/resources.arsc and /tmp/fromBuild_io.muun.apollo_1207/resources.arsc differ

Revision, tag (and its signature):
object 8d6e88e553441e6493ae5c5874fed90dac596467
type commit
tag v52.7
tagger acrespo <alvaro.andres.crespo@gmail.com> 1738355020 -0300

v52.7 (1207)
===== End Results =====
```

Let's unpack `resources.arsc` files and compare:

```
$ aapt2 dump resources apollo.apk > fromPlay.txt
$ aapt2 dump resources /tmp/test_io.muun.apollo/app/apk/apolloui-prod-release-unsigned.apk > fromBuild.txt
$ diff fromPlay.txt fromBuild.txt
11761c11761
<       () "f7425425be894acaaf938fe3767bd4db"
---
>       () "eddde0cb423a46fbbe940520e08ed81e"

```

The diff is related to `com.crashlytics.android.build_id` string value which is an
[issue in Crashlytics](https://github.com/firebase/firebase-android-sdk/issues/3677).

Sadly, while looking benign, that is **not reproducible**.
