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
updated: 2024-11-10
version: 0.9.2
stars: 4.3
ratings: 45
reviews: 35
size: 
website: https://zeusln.app
repository: https://github.com/ZeusLN/zeus
issue: 
icon: app.zeusln.zeus.png
bugbounty: 
meta: ok
verdict: reproducible
date: 2024-08-28
signer: cbcc8ccfbf89c002b5fed484a59f5f2a6f5c8ad30a1934f36af2c9fcdec6b359
reviewArchive:
- date: 2024-08-28
  version: 0.9.0
  appHash: 137bf10d8cd8cd963796e936ff839d536dd244b141f0c21977116a50589d1243
  gitRevision: 7040a9add3e44cbaac48e7d412c898cff071ffb5
  verdict: reproducible
- date: 2024-07-22
  version: 0.8.5-hotfix
  appHash: 13ddb87f0f0a56c24997654b91be1e448a8c134374aeaf1f0ff9f993f1f734f8
  gitRevision: 6ae7c72d480ca51b583f6b18d05516226e30f5a4
  verdict: reproducible
- date: 2024-05-07
  version: 0.8.4
  appHash: bf668808899b1a5a5e4b8aebf5f8ef26b41dacfdc802150592e81c93de198f64
  gitRevision: 542873cd51a2ae85cae03cfe7272e34e53f3f4d3
  verdict: reproducible
- date: 2024-04-11
  version: 0.8.3
  appHash: afd3cace61fe5c896bbf3bd8399f12b9721415e78d9cbc694d8eb97dbbea21a1
  gitRevision: 2e7fd3aa27b4c11b0e8ee69dcdd012d8a9f63603
  verdict: reproducible
- date: 2024-03-24
  version: 0.8.2
  appHash: 63d61c6288323ef8daa2797fa2c7341795ca7c36bbf2d007beda7e9ddd7ccca8
  gitRevision: 540359a8e54b09cd2c779908dc00d772d77a7234
  verdict: reproducible
- date: 2024-01-30
  version: 0.8.1
  appHash: a5321241b0fcf3241c02515bb2d708eb30487df5da1a2ea53a283a2cf5a555cf
  gitRevision: 57a2e216194467fadf01e6075efb04b87b657347
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
apkVersionName: 0.9.2
apkVersionCode: 95001
verdict:        
appHash:        388d9e8b545aa657c1a147a0a24ee700af31cdecd2c9cdacaa6e208e1db9ea10
commit:         dd87266ef47f95b4d95b6b70ff0e2eaf0c1ff680

Diff:
Files /tmp/fromPlay_app.zeusln.zeus_95001/AndroidManifest.xml and /tmp/fromBuild_app.zeusln.zeus_95001/AndroidManifest.xml differ
Only in /tmp/fromPlay_app.zeusln.zeus_95001/META-INF: GOOGPLAY.RSA
Only in /tmp/fromPlay_app.zeusln.zeus_95001/META-INF: GOOGPLAY.SF
Only in /tmp/fromPlay_app.zeusln.zeus_95001/META-INF: MANIFEST.MF
Only in /tmp/fromPlay_app.zeusln.zeus_95001: stamp-cert-sha256

Revision, tag (and its signature):

===== End Results =====
```

Size of stamp-cert-sha256

```
$ wc -c stamp-cert-sha256 
32 stamp-cert-sha256
```

32 bytes.

**diffoscope on AndroidManifest.xml**

There is only a one-line difference:

`236 	····<meta-data·android:name="com.android.vending.derived.apk.id"·android:value="1"/>`

This, minus the signing differences, make version 0.9.2 of this app **reproducible**.

[Issue 2470](https://github.com/ZeusLN/zeus/issues/2470) is now closed.

{% include asciicast %}
