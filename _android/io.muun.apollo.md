---
wsId: muun
title: "Muun - Bitcoin and Lightning Wallet"
altTitle: 
authors:
- leo
users: 50000
appId: io.muun.apollo
appCountry: 
released: 2017-04-25
updated: 2022-01-18
version: "48.4"
stars: 4.5
ratings: 621
reviews: 60
size: 44M
website: https://muun.com
repository: https://github.com/muun/apollo
issue: https://github.com/muun/apollo/issues/54
icon: io.muun.apollo.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2021-10-09
signer: 
reviewArchive:
- date: 2021-04-06
  version: "45.2"
  appHash: 292776e270739d37b9307465cbddfc11068813078d9633035d74ae67f322a3b2
  gitRevision: 707ff239df150e0b2d6810e2444e495e2ca4c174
  verdict: nonverifiable
- date: 2019-12-29
  version: "beta-36.2"
  appHash: 
  gitRevision: e5bd20b29118aaefc8abe66f03c728a834be9984
  verdict: nonverifiable
providerTwitter: MuunWallet
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:
  - /io.muun.apollo/
  - /posts/io.muun.apollo/
---

**Update 2021-10-09**: We were approached about this verdict being wrong and
while the provider hasn't claimed a fix, we noticed we haven't filed an issue
about the tiny diff in the `crashlytics.android.build_id` neither. To see if
this diff remains, we checked the latest version - `46.10`.

As {{ page.title }} was almost reproducible before, we want to keep track of
their progress as new versions get released now, too.
We had a look at
[their verification script](https://github.com/muun/apollo/blob/master/tools/verify-apollo.sh).
It builds the app from source and unzips both the file from Google and the built
app to diff them.

Surprising is the actual check:

```
# Remove the signature since OSS users won't have Muuns private signing key
rm -r "$tmp"/{to_verify,baseline}/{META-INF,resources.arsc}

diff -r "$tmp/to_verify" "$tmp/baseline" && echo "Verification success!" || echo "Verification failed :("
```

1. The first line is a comment, justifying the removal of the signature, which
   is valid.
2. The second line deletes the `META-INF` folders which does indeed contain the
   signature **but it may contain other stuff, too**. In fact
   [it does](https://github.com/muun/apollo/issues/30).
3. It also **deletes the files `resources.arsc` which has nothing to do with the signature**.
   There is no justification for doing so.

We built
[our own verification script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/scripts/test/android/io.muun.apollo.sh)
which gives us these results:

```
Results:
appId:          io.muun.apollo
signer:         026ae0ac859cc32adf2d4e7aa909daf902f40db0b4fe6138358026fd62836ad1
apkVersionName: 46.10
apkVersionCode: 610
verdict:        
appHash:        e7504467c314b576f5f0c45eeb135396f4d771f976e886bc9b0e1111f1172ff8
commit:         bf4fa4ced4a6d3f73f806a5a4b05a089aba92cb1

Diff:
Only in /tmp/fromPlay_io.muun.apollo_610/META-INF: APOLLORE.RSA
Only in /tmp/fromPlay_io.muun.apollo_610/META-INF: APOLLORE.SF
Files /tmp/fromPlay_io.muun.apollo_610/META-INF/MANIFEST.MF and /tmp/fromBuild_io.muun.apollo_610/META-INF/MANIFEST.MF differ
Files /tmp/fromPlay_io.muun.apollo_610/resources.arsc and /tmp/fromBuild_io.muun.apollo_610/resources.arsc differ

Revision, tag (and its signature):
object bf4fa4ced4a6d3f73f806a5a4b05a089aba92cb1
type commit
tag v46.10
tagger acrespo <alvaro.andres.crespo@gmail.com> 1632343796 -0300

v46.10
```

For our reproducible verdict
the first three lines of the diff are fine. The last line though, the
`resources.arsc` that their verification script explicitly ignores is not ok.
This file contains resources and altering resources can significantly change the
app, too. This app is **not verifiable**.

Upon closer inspection, the diff again is just the `crashlytics.android.build_id`:

```

$ apktool d -o apkGoogle Muun\ 46.10\ \(io.muun.apollo\).apk 
$ apktool d -o apkBuild apolloui-prod-release-unsigned.apk
$ diff --brief --recursive apkBuild apkGoogle
Files apkBuild/apktool.yml and apkGoogle/apktool.yml differ
Only in apkGoogle/original/META-INF: APOLLORE.RSA
Only in apkGoogle/original/META-INF: APOLLORE.SF
Files apkBuild/original/META-INF/MANIFEST.MF and apkGoogle/original/META-INF/MANIFEST.MF differ
Files apkBuild/res/values/strings.xml and apkGoogle/res/values/strings.xml differ
$ diff apkBuild/res/values/strings.xml apkGoogle/res/values/strings.xml
77c77
<     <string name="com.crashlytics.android.build_id">e0c37a103082460fbf95f3c097222e61</string>
---
>     <string name="com.crashlytics.android.build_id">95a3152a98594e8ca1324bdefd26a5b9</string>
```
