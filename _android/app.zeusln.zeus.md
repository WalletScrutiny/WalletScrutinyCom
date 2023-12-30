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
updated: 2023-12-01
version: 0.8.0
stars: 4.3
ratings: 45
reviews: 26
size: 
website: https://zeusln.app
repository: https://github.com/ZeusLN/zeus
issue: https://github.com/ZeusLN/zeus/issues/1926
icon: app.zeusln.zeus.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2023-12-30
signer: 
reviewArchive:
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

We ran our {% include testScript.html %} and got this:

```
===== Begin Results =====
appId:          app.zeusln.zeus
signer:         cbcc8ccfbf89c002b5fed484a59f5f2a6f5c8ad30a1934f36af2c9fcdec6b359
apkVersionName: 0.8.0
apkVersionCode: 80003
verdict:        
appHash:        ad9eceb26e9b52fdda63a8452d0b9d3b0c40b15187d8eb5e45173ed65cdb9397
commit:         dde7620ec733a002895173ccb4ab7169f6a9fbc7

Diff:
Files /tmp/fromPlay_app.zeusln.zeus_80003/AndroidManifest.xml and /tmp/fromBuild_app.zeusln.zeus_80003/AndroidManifest.xml differ
Only in /tmp/fromBuild_app.zeusln.zeus_80003/lib: arm64
Only in /tmp/fromBuild_app.zeusln.zeus_80003/lib: armeabi
Only in /tmp/fromBuild_app.zeusln.zeus_80003/lib: armeabi-v7a
Only in /tmp/fromBuild_app.zeusln.zeus_80003/lib: x86
Only in /tmp/fromBuild_app.zeusln.zeus_80003/lib: x86_64
Only in /tmp/fromPlay_app.zeusln.zeus_80003/META-INF: GOOGPLAY.RSA
Only in /tmp/fromPlay_app.zeusln.zeus_80003/META-INF: GOOGPLAY.SF
Only in /tmp/fromPlay_app.zeusln.zeus_80003/META-INF: MANIFEST.MF
Only in /tmp/fromPlay_app.zeusln.zeus_80003: stamp-cert-sha256

Revision, tag (and its signature):

===== End Results =====
```

That is a bigger diff than expected but getting really close. If we ignore all
the stuff we usually ignore from the META-INF folder and extra stuff we got that
was not found in the Play Store version - after all, we reproduced all there was
and produced maybe a bit extra - the diff is:

```
Files /tmp/fromPlay_app.zeusln.zeus_76003/AndroidManifest.xml and /tmp/fromBuild_app.zeusln.zeus_76003/AndroidManifest.xml differ
Only in /tmp/fromPlay_app.zeusln.zeus_76003: stamp-cert-sha256
```

The second line - `stamp-cert-sha256` - is 32B of binary, hardly enough for some
backdoor and as it
[turns out](https://github.com/BlueWallet/BlueWallet/issues/758#issuecomment-849273732)
this is what Google adds when you let them sign the APK so we can add it to our
list of acceptable files to differ.

As it turns out, our test script is comparing the file `zeus-universal.apk` with
what we got from Google Play but this time, Google Play gave us the smaller
`zeus-arm64-v8a.apk` which explains these extra lib files above.

But what about the first line - AndroidManifest.xml? Diffoscope can dig into
that file and this is what it found:

```
$ diffoscope "/home/leo/Documents/walletscrutiny/incoming/Zeus 0.7.7 (app.zeusln.zeus).apk" /tmp/test_app.zeusln.zeus/app/android/app/build/outputs/apk/release/zeus-arm64-v8a.apk 
...
├── AndroidManifest.xml (decoded)
│ ├── AndroidManifest.xml
│ │ @@ -1,9 +1,9 @@
│ │  <?xml version="1.0" encoding="utf-8"?>
│ │ -<manifest xmlns:android="http://schemas.android.com/apk/res/android" android:versionCode="80003" android:versionName="0.8.0" android:compileSdkVersion="33" android:compileSdkVersionCodename="13" package="app.zeusln.zeus" platformBuildVersionCode="33" platformBuildVersionName="13">
│ │ +<manifest xmlns:android="http://schemas.android.com/apk/res/android" android:versionCode="80" android:versionName="0.8.0" android:compileSdkVersion="33" android:compileSdkVersionCodename="13" package="app.zeusln.zeus" platformBuildVersionCode="33" platformBuildVersionName="13">
│ │    <uses-sdk android:minSdkVersion="28" android:targetSdkVersion="33"/>
│ │    <uses-permission android:name="android.permission.INTERNET"/>
│ │    <uses-permission android:name="android.permission.CAMERA"/>
│ │    <uses-permission android:name="android.permission.NFC"/>
│ │    <uses-permission android:name="android.permission.VIBRATE"/>
│ │    <uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
│ │    <uses-feature android:name="android.hardware.nfc.hce" android:required="false"/>
│ │ @@ -214,10 +214,9 @@
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

But also the versionCode differs which is odd but not alarming.

For this probably unnecessary diff in the versionCode we list this app as
**not verifiable** but note that the diff is benign and we reached out to the
provider about this in [this issue](https://github.com/ZeusLN/zeus/issues/1926).