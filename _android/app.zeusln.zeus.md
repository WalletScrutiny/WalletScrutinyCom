---
wsId: zeusln
title: ZEUS Wallet
altTitle: 
authors:
- leo
- mohammad
users: 10000
appId: app.zeusln.zeus
appCountry: 
released: 2020-07-07
updated: 2024-01-26
version: 0.8.1
stars: 4.2
ratings: 45
reviews: 27
size: 
website: https://zeusln.app
repository: https://github.com/ZeusLN/zeus
issue: 
icon: app.zeusln.zeus.png
bugbounty: 
meta: ok
verdict: reproducible
date: 2024-01-30
signer: 
reviewArchive:
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
apkVersionName: 0.8.1
apkVersionCode: 81003
verdict:        
appHash:        a5321241b0fcf3241c02515bb2d708eb30487df5da1a2ea53a283a2cf5a555cf
commit:         8ec56e8d3eb020fe52337c7b2a32a62f903ae6c4

Diff:
Files /tmp/fromPlay_app.zeusln.zeus_81003/AndroidManifest.xml and /tmp/fromBuild_app.zeusln.zeus_81003/AndroidManifest.xml differ
Only in /tmp/fromPlay_app.zeusln.zeus_81003/META-INF: GOOGPLAY.RSA
Only in /tmp/fromPlay_app.zeusln.zeus_81003/META-INF: GOOGPLAY.SF
Only in /tmp/fromPlay_app.zeusln.zeus_81003/META-INF: MANIFEST.MF
Only in /tmp/fromPlay_app.zeusln.zeus_81003: stamp-cert-sha256

Revision, tag (and its signature):

===== End Results =====
```

That is a bigger diff than expected but getting really close. If we ignore all
the stuff we usually ignore from the META-INF folder the diff is in
`AndroidManifest.xml` and `stamp-cert-sha256`.

`stamp-cert-sha256` turns out to belong on our list of acceptable files to
differ. It's Google's additional signature of the app.

But what about the first line - AndroidManifest.xml? Diffoscope can dig into
that file and this is what it found:

```
...
├── AndroidManifest.xml (decoded)
│ ├── AndroidManifest.xml
│ │ @@ -225,10 +225,9 @@
│ │      <activity android:theme="@android:style/Theme.Translucent.NoTitleBar" android:name="com.jakewharton.processphoenix.ProcessPhoenix" android:exported="false" android:process=":phoenix"/>
│ │      <service android:name="com.google.android.datatransport.runtime.backends.TransportBackendDiscovery" android:exported="false">
│ │        <meta-data android:name="backend:com.google.android.datatransport.cct.CctBackendFactory" android:value="cct"/>
│ │      </service>
│ │      <service android:name="com.google.android.datatransport.runtime.scheduling.jobscheduling.JobInfoSchedulerService" android:permission="android.permission.BIND_JOB_SERVICE" android:exported="false"/>
│ │      <receiver android:name="com.google.android.datatransport.runtime.scheduling.jobscheduling.AlarmManagerSchedulerBroadcastReceiver" android:exported="false"/>
│ │      <meta-data android:name="com.facebook.soloader.enabled" android:value="false"/>
│ │ -    <meta-data android:name="com.android.vending.derived.apk.id" android:value="1"/>
│ │    </application>
│ │  </manifest>
```

meaning the Google file contains the extra line:

```
<meta-data android:name="com.android.vending.derived.apk.id" android:value="1"/>
```

which again is expected when using the Android App Bundle (AAB) format which
{{ page.title }} apparently switched to.

While we don't know yet exactly how to automate testing, this app is
**reproducible**. We also revise our prior review that had the same issues that
were resolved in [this issue](https://github.com/ZeusLN/zeus/issues/1926).

{% include asciicast %}
