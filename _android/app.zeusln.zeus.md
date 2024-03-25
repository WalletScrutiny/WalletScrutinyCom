---
wsId: zeusln
title: ZEUS Wallet
altTitle: 
authors:
- leo
- mohammad
- danny
users: 10000
appId: app.zeusln.zeus
appCountry: 
released: 2020-07-07
updated: 2024-03-13
version: 0.8.2
stars: 4.3
ratings: 45
reviews: 30
size: 
website: https://zeusln.app
repository: https://github.com/ZeusLN/zeus
issue: 
icon: app.zeusln.zeus.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2024-03-22
signer: cbcc8ccfbf89c002b5fed484a59f5f2a6f5c8ad30a1934f36af2c9fcdec6b359
reviewArchive:
- date: 2024-01-30
  version: 0.8.1
  appHash: a5321241b0fcf3241c02515bb2d708eb30487df5da1a2ea53a283a2cf5a555cf
  verdict: reproducible
- date: 2023-12-30
  version: 0.8.0
  appHash: ad9eceb26e9b52fdda63a8452d0b9d3b0c40b15187d8eb5e45173ed65cdb9397
  gitRevision: 9f3a0b296e63872f560c86a99e616877fa17ce94
  verdict: reproducible
- date: 2023-10-07
  version: 0.7.7
  appHash: 74451415ccf7a0bb60acb5be325b02937695c32bb7cfc86934349aeb1cdf9dfd
  gitRevision: 776aaf16c67d019eec5ed8522ac733a8f24e03fc
  verdict: reproducible
- date: 2023-07-23
  version: 0.7.7-beta1
  appHash: 7518899284438a824779266807c91dedb1714517e2f94f8cbe878482379c1b0e
  gitRevision: e3739160c9fcb83303d40d5ae888ec1d728567ee
  verdict: reproducible
- date: 2023-06-22
  version: 0.7.6
  appHash: 
  gitRevision: f361c11d0e4a611d6994a1cabed500efd155a9d6
  verdict: ftbfs
- date: 2021-08-30
  version: 0.5.1
  appHash: 
  gitRevision: b8c409778e3fcce1f150fe5cdcb965bde3267e7d
  verdict: nonverifiable
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
apkVersionName: 0.8.2
apkVersionCode: 83001
verdict:        
appHash:        dcc338ee0955ee1a43fe99a7d87c72961ae390b38a4400c83a637a1eff1d5f28
commit:         a805deb3a76b576a303342b971000ee7f15748bf

Diff:
Files /tmp/fromPlay_app.zeusln.zeus_83001/AndroidManifest.xml and /tmp/fromBuild_app.zeusln.zeus_83001/AndroidManifest.xml differ
Files /tmp/fromPlay_app.zeusln.zeus_83001/assets/dexopt/baseline.prof and /tmp/fromBuild_app.zeusln.zeus_83001/assets/dexopt/baseline.prof differ
Files /tmp/fromPlay_app.zeusln.zeus_83001/assets/index.android.bundle and /tmp/fromBuild_app.zeusln.zeus_83001/assets/index.android.bundle differ
Files /tmp/fromPlay_app.zeusln.zeus_83001/classes2.dex and /tmp/fromBuild_app.zeusln.zeus_83001/classes2.dex differ
Files /tmp/fromPlay_app.zeusln.zeus_83001/classes.dex and /tmp/fromBuild_app.zeusln.zeus_83001/classes.dex differ
Only in /tmp/fromPlay_app.zeusln.zeus_83001/META-INF: GOOGPLAY.RSA
Only in /tmp/fromPlay_app.zeusln.zeus_83001/META-INF: GOOGPLAY.SF
Only in /tmp/fromPlay_app.zeusln.zeus_83001/META-INF: MANIFEST.MF
Only in /tmp/fromPlay_app.zeusln.zeus_83001: stamp-cert-sha256

Revision, tag (and its signature):

===== End Results =====
```

### Found only in the app from Google Play

#### APK Signing information
- **MANIFEST.MF** - Contains a list of the app's files including their SHA-1 digests.
- **GOOGPLAY.SF** - Signature file containing the SHA-256 digests of the manifest file.
- **GOOGPLAY.RSA** - Certificate file used to verify the app's signature.
- **stamp-cert-sha256** - Contains the SHA-256 hash of the certificate used to sign the app

### Other diffs
- **AndroidManifest.xml** - describes the app's essential information to the Android system before any code is executed.
- **baseline.prof** - related to Android's [Ahead-Of-Time (AOT) compilation process](https://developer.android.com/topic/performance/baselineprofiles/overview).
- **index.android.bundle** - contains the compiled JavaScript code for the app, enabling React Native apps to execute JavaScript code natively.

### Classes.dex diffs

- contain the compiled bytecode that Android's Dalvik Virtual Machine (or ART) executes. 

## Analysis 

The diffoscope results are significant enough that we cannot paste them on any online service. The only way is to upload the [document](https://drive.google.com/file/d/1WUGomym-vp7jJW18C9xJ8FsMBjvcFjLj/view?usp=sharing). For this reason, we can say that this version is **nonverifiable**.

{% include asciicast %}
