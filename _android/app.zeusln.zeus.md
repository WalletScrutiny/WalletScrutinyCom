---
wsId: zeusln
title: ZEUS Wallet
altTitle: 
authors:
- leo
- mohammad
- danny
- keraliss
users: 10000
appId: app.zeusln.zeus
appCountry: 
released: 2020-07-07
updated: 2025-04-13
version: 0.10.2
stars: 4.2
ratings: 45
reviews: 37
website: https://zeusln.com
repository: https://github.com/ZeusLN/zeus
issue: 
icon: app.zeusln.zeus.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes:
- 9c141c38553a9bfb2df11ca05921775a04a000d84328988f7d3bf5b3a9112e4d
date: 2025-03-13
signer: cbcc8ccfbf89c002b5fed484a59f5f2a6f5c8ad30a1934f36af2c9fcdec6b359
twitter: ZeusLN
social:
- https://iris.to/zeus@zeusln.app
- https://t.me/ZeusLN
redirect_from:
- /app.zeusln.zeus/
- /posts/app.zeusln.zeus/
developerName: Atlas 21 Inc.
features:
- ln

---

We ran our updated {% include testScript.html %} and got this:

```
===== Begin Results =====
appId:          app.zeusln.zeus
signer:         cbcc8ccfbf89c002b5fed484a59f5f2a6f5c8ad30a1934f36af2c9fcdec6b359
apkVersionName: 0.10.0
apkVersionCode: 102003
verdict:        
appHash:        9c141c38553a9bfb2df11ca05921775a04a000d84328988f7d3bf5b3a9112e4d
commit:         6f3be02fc840dee66309b54237e80e0666674cbd

Diff:
Files /tmp/fromPlay_app.zeusln.zeus_102003/AndroidManifest.xml and /tmp/fromBuild_app.zeusln.zeus_102003/AndroidManifest.xml differ
Only in /tmp/fromPlay_app.zeusln.zeus_102003/META-INF: GOOGPLAY.RSA
Only in /tmp/fromPlay_app.zeusln.zeus_102003/META-INF: GOOGPLAY.SF
Only in /tmp/fromPlay_app.zeusln.zeus_102003/META-INF: MANIFEST.MF
Only in /tmp/fromPlay_app.zeusln.zeus_102003: stamp-cert-sha256

Revision, tag (and its signature):

===== End Results =====

```

{% include asciicast %}

Size of stamp-cert-sha256

```
danny@lw10:/tmp/fromPlay_app.zeusln.zeus_98001$ wc -c stamp-cert-sha256
32 stamp-cert-sha256
```

32 bytes.

**diffoscope on AndroidManifest.xml**

We run: 

`danny@lw10:/tmp/test_app.zeusln.zeus$ diffoscope --html diffo-decoded-app.zeusln.zeus_v98001-AndroidManifest.xml.html armeabi_v7a/AndroidManifest.xml playAPK/AndroidManifest.xml`

{% include diffoscope-modal.html label='AndroidManifest.xml' url='/assets/diffoscope-results/android/app.zeusln.zeus/0.9.5/diffo-decoded-app.zeusln.zeus_v98001-AndroidManifest.xml.html' %}

There is only a one-line difference:

`<meta-data·android:name="com.android.vending.derived.apk.id"·android:value="1"/>`

This meta-data tag is added by Google Play when the app is processed and distributed through the Play Store. It does not exist in an APK built from source before being uploaded to Google Play.

### Purpose of com.android.vending.derived.apk.id

This tag is injected by the Google Play Store’s app signing and distribution process.

This, minus the signing differences, make version 0.9.7 of this app **reproducible**.

