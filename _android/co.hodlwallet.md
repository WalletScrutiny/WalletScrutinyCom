---
wsId: hodl
title: 'HODL Wallet : Bitcoin Wallet'
altTitle: 
authors:
- leo
users: 10000
appId: co.hodlwallet
appCountry: 
released: 2018-09-24
updated: 2020-05-18
version: 3.3.5
stars: 3.6
ratings: 124
reviews: 46
size: 
website: https://hodlwallet.com
repository: https://github.com/hodlwallet/hodl-wallet-android
issue: https://github.com/hodlwallet/hodl-wallet-android/issues/50
icon: co.hodlwallet.png
bugbounty: 
meta: obsolete
verdict: nonverifiable
date: 2022-05-09
signer: 
reviewArchive: 
twitter: hodlwallet
social:
- https://www.facebook.com/hodlwallet
redirect_from:
- /co.hodlwallet/
- /posts/co.hodlwallet/

---

**Update**: The developer closed
[the issue where we asked for help](https://github.com/hodlwallet/hodl-wallet-android/issues/50)
to verify the app build. There appears to be no interest in scrutiny.

The description sounds a bit scary:

> Your Bitcoin are stored on your device and backed up to a Backup Recovery Key
  when you create a wallet. This means HODL Wallet can never stop you from
  accessing or sending your funds.

So they can't stop me from sending my funds but can I stop them from sending my
funds if they have a backup? Or what is this "Backup Recovery Key" again? I
guess that's just me being paranoid but this could be worded more clearly.

> HODL Wallet is free, open source, and doesn't require you to create an account.

That at least sounds great! :)

> Choose to connect to your own node in advance settings

That's great, especially if it doesn't talk to a company server after that.

The website is more reassuring:

> HODL Wallet does not collect any information at any point in time and all your
  Bitcoin exist exclusively on your device.

Also do we learn about it supporting the industry standard BIP39, menmonic
backups.

Apparently [hodl-wallet-android](https://github.com/hodlwallet/hodl-wallet-android)
is their repository. It is MIT licensed, which is one of the most permissive
licenses.

There, the build instructions are very minimal and involve Android Studio. Let's
see how it goes:

> Go to github.co/hodlwallet/breadwallet-android and clone or download the project

{% include walletLink.html wallet='android/com.breadwallet' verdict='true' %}?
Ok, good to know where the code comes from but this alone
lets us doubt a bit how dedicated the team is working on the project. Also: more
guessing on our part:

```
$ git clone git@github.com:hodlwallet/hodl-wallet-android.git
Cloning into 'hodl-wallet-android'...
...
$ cd hodl-wallet-android/
$ git tag
v2
$ git branch
* develop
```

Not good. In the history we find no mention of `3.3.2` which would be the version
name mentioned on Google.

Looking at the recent history though:

<div class="language-plaintext highlighter-rouge">
<div class="highlight">
<pre class="highlight" style="line-height: 1em;font-size: medium;">$ tig



<font color="#3465A4">2019-04-22 15:49 -0400 </font><font color="#4E9A06">Igor Guerrero    </font><font color="#3465A4">o</font> <font color="#06989A"><b>[HEAD]</b></font> Bump version to `3.3.3
<font color="#3465A4">2019-04-22 15:47 -0400 </font><font color="#4E9A06">Igor Guerrero    </font><font color="#3465A4">M</font><font color="#C4A000">─┐</font> Merge pull request #42 from
<span style="background-color:#4E9A06"><font color="#D3D7CF"><b>2019-04-19 16:33 -0400 Igor Guerrero    │ o Bump version</b></font></span>
<font color="#3465A4">2019-04-19 16:33 -0400 </font><font color="#4E9A06">Igor Guerrero    </font><font color="#75507B">│</font><font color="#3465A4"> o</font> Add hodlTestnet to the igno
<font color="#3465A4">2019-04-18 13:17 -0400 </font><font color="#4E9A06">Igor Guerrero    </font><font color="#75507B">│</font><font color="#3465A4"> o</font> Add error message when we d
<font color="#3465A4">2019-04-17 17:13 -0400 </font><font color="#4E9A06">Igor Guerrero    </font><font color="#75507B">│</font><font color="#3465A4"> o</font> Fix issue with Java not kno
<font color="#3465A4">2019-04-17 13:08 -0400 </font><font color="#4E9A06">Igor Guerrero    </font><font color="#75507B">│</font><font color="#3465A4"> o</font> Fix problem with regular pa
<font color="#3465A4">2019-04-02 11:28 -0400 </font><font color="#4E9A06">Igor Guerrero    </font><font color="#3465A4">o</font><font color="#C4A000"> │</font> Add hodlTestnet to the igno
<font color="#3465A4">2019-04-02 11:27 -0400 </font><font color="#4E9A06">Igor Guerrero    </font><font color="#3465A4">o</font><font color="#C4A000"> │</font> Bump version
<font color="#3465A4">2019-03-15 11:18 -0400 </font><font color="#4E9A06">Igor Guerrero    </font><font color="#3465A4">M</font><font color="#C4A000">─┤</font> Merge pull request #41 from
<span style="background-color:#3465A4"><font color="#D3D7CF">[main] 475dc72f34fe410f567482a13fc0bd9784d2f2e8 - commit 3 of 2119   0%</font></span>
<font color="#4E9A06">+        versionCode 10</font>
<span style="background-color:#4E9A06"><font color="#D3D7CF"><b>+        versionName &quot;3.3.2&quot;</b></font></span>
         multiDexEnabled true
</pre>
</div>
</div>

we find 2 commits labled "Bump version" that both set the version name to "3.3.2".

By the way, the wallet did not see an update since a long time. Those changes
are from April 2019.

Anyway, the two "3.3.2" branches get merged on April 22nd, the day of the Google
Play release. We'll try that one: `394f23041b`. We will raise the bar in the future
and refuse to search for commits like that though. Have a tag or we can't
verify the build.

Anyway ... we'll try the same we tried with {% include walletLink.html wallet='android/com.breadwallet' %}:

```
$ git checkout 394f23041b
$ git submodule update --init --recursive
$ docker run -v $PWD:/mnt -it beevelop/cordova bash
root@7d56c86f8fae:/# cd /mnt/
root@7d56c86f8fae:/mnt# yes | $ANDROID_HOME/tools/bin/sdkmanager "platforms;android-28"
root@7d56c86f8fae:/mnt# /opt/android/tools/bin/sdkmanager ndk-bundle
root@7d56c86f8fae:/mnt# ./gradlew :app:assemble
...
BUILD SUCCESSFUL in 4m 7s
```

So lets compare it with the version from the Play Store:

```
$ apktool d -o fromBuild app/build/outputs/apk/hodl/release/app-hodl-release-unsigned.apk
$ apktool d -o fromPlay ./appFromPlay.apk
$ diff --brief --recursive fromBuild fromPlay
Files fromBuild/AndroidManifest.xml and fromPlay/AndroidManifest.xml differ
Files fromBuild/apktool.yml and fromPlay/apktool.yml differ
Files fromBuild/lib/arm64-v8a/libcore-lib.so and fromPlay/lib/arm64-v8a/libcore-lib.so differ
Files fromBuild/lib/armeabi-v7a/libcore-lib.so and fromPlay/lib/armeabi-v7a/libcore-lib.so differ
Files fromBuild/lib/x86/libcore-lib.so and fromPlay/lib/x86/libcore-lib.so differ
Files fromBuild/lib/x86_64/libcore-lib.so and fromPlay/lib/x86_64/libcore-lib.so differ
Files fromBuild/original/AndroidManifest.xml and fromPlay/original/AndroidManifest.xml differ
Only in fromPlay/original/META-INF: CERT.RSA
Only in fromPlay/original/META-INF: CERT.SF
Files fromBuild/original/META-INF/MANIFEST.MF and fromPlay/original/META-INF/MANIFEST.MF differ
Files fromBuild/smali/co/hodlwallet/BuildConfig.smali and fromPlay/smali/co/hodlwallet/BuildConfig.smali differ
Files fromBuild/smali/co/hodlwallet/presenter/activities/camera/CameraActivity.smali and fromPlay/smali/co/hodlwallet/presenter/activities/camera/CameraActivity.smali differ
Files fromBuild/smali/co/hodlwallet/presenter/activities/settings/NodesActivity$1.smali and fromPlay/smali/co/hodlwallet/presenter/activities/settings/NodesActivity$1.smali differ
Files fromBuild/smali/co/hodlwallet/tools/animation/BRAnimator.smali and fromPlay/smali/co/hodlwallet/tools/animation/BRAnimator.smali differ
Files fromBuild/smali/co/hodlwallet/tools/manager/BRApiManager.smali and fromPlay/smali/co/hodlwallet/tools/manager/BRApiManager.smali differ
Files fromBuild/smali/co/hodlwallet/tools/manager/BREventManager.smali and fromPlay/smali/co/hodlwallet/tools/manager/BREventManager.smali differ
Files fromBuild/smali/co/hodlwallet/tools/manager/SyncManager$SyncProgressTask.smali and fromPlay/smali/co/hodlwallet/tools/manager/SyncManager$SyncProgressTask.smali differ
Files fromBuild/smali/co/hodlwallet/tools/qrcode/QRCodeReaderView$DecodeFrameTask.smali and fromPlay/smali/co/hodlwallet/tools/qrcode/QRCodeReaderView$DecodeFrameTask.smali differ
Files fromBuild/smali/co/hodlwallet/tools/qrcode/QRUtils.smali and fromPlay/smali/co/hodlwallet/tools/qrcode/QRUtils.smali differ
Files fromBuild/smali/co/hodlwallet/tools/security/BRKeyStore.smali and fromPlay/smali/co/hodlwallet/tools/security/BRKeyStore.smali differ
Files fromBuild/smali/co/hodlwallet/tools/security/BRSender$1.smali and fromPlay/smali/co/hodlwallet/tools/security/BRSender$1.smali differ
Files fromBuild/smali/co/hodlwallet/tools/security/PostAuth$7.smali and fromPlay/smali/co/hodlwallet/tools/security/PostAuth$7.smali differ
Files fromBuild/smali/co/hodlwallet/tools/security/PostAuth.smali and fromPlay/smali/co/hodlwallet/tools/security/PostAuth.smali differ
Files fromBuild/smali/co/hodlwallet/tools/security/RootHelper.smali and fromPlay/smali/co/hodlwallet/tools/security/RootHelper.smali differ
Files fromBuild/smali/co/hodlwallet/tools/sqlite/CurrencyDataSource.smali and fromPlay/smali/co/hodlwallet/tools/sqlite/CurrencyDataSource.smali differ
Files fromBuild/smali/co/hodlwallet/tools/sqlite/MerkleBlockDataSource.smali and fromPlay/smali/co/hodlwallet/tools/sqlite/MerkleBlockDataSource.smali differ
Files fromBuild/smali/co/hodlwallet/tools/sqlite/PeerDataSource.smali and fromPlay/smali/co/hodlwallet/tools/sqlite/PeerDataSource.smali differ
Files fromBuild/smali/co/hodlwallet/tools/sqlite/TransactionDataSource.smali and fromPlay/smali/co/hodlwallet/tools/sqlite/TransactionDataSource.smali differ
Files fromBuild/smali/co/hodlwallet/tools/threads/PaymentProtocolPostPaymentTask.smali and fromPlay/smali/co/hodlwallet/tools/threads/PaymentProtocolPostPaymentTask.smali differ
Files fromBuild/smali/co/hodlwallet/tools/threads/PaymentProtocolTask.smali and fromPlay/smali/co/hodlwallet/tools/threads/PaymentProtocolTask.smali differ
Files fromBuild/smali/co/hodlwallet/tools/util/Bip39Reader.smali and fromPlay/smali/co/hodlwallet/tools/util/Bip39Reader.smali differ
Files fromBuild/smali/co/hodlwallet/tools/util/BRCompressor.smali and fromPlay/smali/co/hodlwallet/tools/util/BRCompressor.smali differ
Files fromBuild/smali/co/hodlwallet/tools/util/BytesUtil.smali and fromPlay/smali/co/hodlwallet/tools/util/BytesUtil.smali differ
Files fromBuild/smali/co/hodlwallet/wallet/BRWalletManager.smali and fromPlay/smali/co/hodlwallet/wallet/BRWalletManager.smali differ
Files fromBuild/smali/co/platform/APIClient.smali and fromPlay/smali/co/platform/APIClient.smali differ
Files fromBuild/smali/co/platform/kvstore/RemoteKVStore.smali and fromPlay/smali/co/platform/kvstore/RemoteKVStore.smali differ
Files fromBuild/smali/co/platform/kvstore/ReplicatedKVStore.smali and fromPlay/smali/co/platform/kvstore/ReplicatedKVStore.smali differ
Files fromBuild/smali/co/platform/middlewares/APIProxy.smali and fromPlay/smali/co/platform/middlewares/APIProxy.smali differ
Files fromBuild/smali/co/platform/middlewares/HTTPFileMiddleware.smali and fromPlay/smali/co/platform/middlewares/HTTPFileMiddleware.smali differ
Files fromBuild/smali/co/platform/middlewares/plugins/CameraPlugin$2.smali and fromPlay/smali/co/platform/middlewares/plugins/CameraPlugin$2.smali differ
Files fromBuild/smali/co/platform/middlewares/plugins/CameraPlugin.smali and fromPlay/smali/co/platform/middlewares/plugins/CameraPlugin.smali differ
Files fromBuild/smali/co/platform/middlewares/plugins/WalletPlugin$1.smali and fromPlay/smali/co/platform/middlewares/plugins/WalletPlugin$1.smali differ
Files fromBuild/smali/co/platform/tools/BRBitId$2.smali and fromPlay/smali/co/platform/tools/BRBitId$2.smali differ
Files fromBuild/smali/co/platform/tools/BRBitId.smali and fromPlay/smali/co/platform/tools/BRBitId.smali differ
```

Using diffoscope which also takes a deeper look at binaries we find:

```
├── AndroidManifest.xml (decoded)
│ ├── AndroidManifest.xml
│ │ @@ -1,9 +1,9 @@
│ │  <?xml version="1.0" encoding="utf-8"?>
│ │ -<manifest android:versionCode="10" android:versionName="3.3.2" package="co.hodlwallet" platformBuildVersionCode="10" platformBuildVersionName="3.3.2" xmlns:android="http://schemas.android.com/apk/res/android">
│ │ +<manifest android:versionCode="11" android:versionName="3.3.2" package="co.hodlwallet" platformBuildVersionCode="11" platformBuildVersionName="3.3.2" xmlns:android="http://schemas.android.com/apk/res/android">
```

that the version differs, which tells us with certainty that the version in
Google Play is not in GitHub:

We tried the last revision before the versionName was set to 3.3.3 which uses
the versionCode 10. Google rejects updates with equal versionCodes, so this is
kind of understandable and happened to all of us release managers but not
committing a new revision and not tagging stuff is at least sloppy and as we
hope will soon be unacceptable.

Which is a grave issue with verification though, are the differences in
`lib/x86/libcore-lib.so`. Those are 50MB in the diffoscope decompiled form and
beyond human review.

That is not good enough.

Our verdict for now: **not verifiable**.
