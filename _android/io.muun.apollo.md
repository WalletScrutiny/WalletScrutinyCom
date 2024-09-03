---
wsId: muun
title: 'Muun: Bitcoin Lightning Wallet'
altTitle: 
authors:
- leo
- mohammad
users: 100000
appId: io.muun.apollo
appCountry: 
released: 2017-04-25
updated: 2024-08-06
version: '52.1'
stars: 4.1
ratings: 650
reviews: 183
size: 
website: https://muun.com
repository: https://github.com/muun/apollo
issue: https://github.com/muun/apollo/issues/54
icon: io.muun.apollo.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2023-06-24
signer: 
reviewArchive:
- date: 2022-09-19
  version: '49.3'
  appHash: 70fcd9491963e6fe27f9efd41d3c90abf63539d0f9528de8abbad964675de723
  gitRevision: 5af8249d8aac7663e1f5e9eacc5f0817e1130e26
  verdict: nonverifiable
- date: 2022-04-15
  version: '49.2'
  appHash: 328a6ad2056ca798e15551d094d68eade3014b3277ff0ecaa163919c069341ad
  gitRevision: b87bc633a27569f90a012614c792e1a3c6d400c6
  verdict: nonverifiable
- date: 2022-03-24
  version: '49.1'
  appHash: c2121cdb8f6a4a3e11470ce7787cda2eb6c1d1df28b987d50a4ab39b82d3c3ae
  gitRevision: eea48a17393717f715185a6874d3e9dc7ec7c0ed
  verdict: nonverifiable
- date: 2021-10-09
  version: '46.10'
  appHash: e7504467c314b576f5f0c45eeb135396f4d771f976e886bc9b0e1111f1172ff8
  gitRevision: 0ad5c7d69a32e48712b94cb7d7572b122ad0e49c
  verdict: nonverifiable
- date: 2021-04-06
  version: '45.2'
  appHash: 292776e270739d37b9307465cbddfc11068813078d9633035d74ae67f322a3b2
  gitRevision: 707ff239df150e0b2d6810e2444e495e2ca4c174
  verdict: nonverifiable
- date: 2019-12-29
  version: beta-36.2
  appHash: 
  gitRevision: e5bd20b29118aaefc8abe66f03c728a834be9984
  verdict: nonverifiable
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
apkVersionName: 50.13
apkVersionCode: 1013
verdict:
appHash:        d9eab324dc83c171350ca4918bb24e0f14dda06f4f7b3cfa0c5f9ab86ca5ea60
commit:         58c9c82a68e63b3ae005fed05621be0cf869cc05

Diff:
Only in /tmp/fromPlay_io.muun.apollo_1013/META-INF: APOLLORE.RSA
Only in /tmp/fromPlay_io.muun.apollo_1013/META-INF: APOLLORE.SF
Only in /tmp/fromPlay_io.muun.apollo_1013/META-INF: MANIFEST.MF
Files /tmp/fromPlay_io.muun.apollo_1013/resources.arsc and /tmp/fromBuild_io.muun.apollo_1013/resources.arsc differ

Revision, tag (and its signature):
object 58c9c82a68e63b3ae005fed05621be0cf869cc05
type commit
tag v50.13
tagger acrespo <alvaro.andres.crespo@gmail.com> 1684797231 -0300

v50.13 (1013)
===== End Results =====
```

Let's unpack `resources.arsc` files and compare:

```
$ aapt2 dump resources apollo.apk > fromPlay.txt
$ aapt2 dump resources /tmp/test_io.muun.apollo/app/apk/apolloui-prod-release-unsigned.apk > fromBuild.txt
$ diff fromPlay.txt fromBuild.txt
11708c11708
<       () "e2e27f098f0f4dd5bd472ec4d8b0ba2d"
---
>       () "10abb903957f4fe18afcf69d8156997d"
```

The diff is related to `com.crashlytics.android.build_id` string value which is an
[issue in Crashlytics](https://github.com/firebase/firebase-android-sdk/issues/3677).

Sadly, while looking benign, that is **not reproducible**.
