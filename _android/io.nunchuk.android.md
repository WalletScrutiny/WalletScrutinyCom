---
wsId: nunchuk
title: Nunchuk Bitcoin Wallet
altTitle: 
authors:
- leo
- emanuel
- mohammad
- danny
users: 10000
appId: io.nunchuk.android
appCountry: 
released: 2021-11-11
updated: 2024-12-18
version: 1.9.56
stars: 4.6
ratings: 26
reviews: 23
size: 
website: https://nunchuk.io
repository: https://github.com/nunchuk-io/nunchuk-android
issue: https://github.com/nunchuk-io/nunchuk-android/issues/23
icon: io.nunchuk.android.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2024-11-19
signer: 
reviewArchive:
- date: 2023-07-05
  version: 1.9.32
  appHash: 
  gitRevision: 5e67b0f51e6c67a3e1140ba66a1b4222e8cfe2a4
  verdict: nonverifiable
- date: 2023-01-06
  version: 1.9.23
  appHash: 
  gitRevision: 49d61c1c5807f24ea01ba185a2de6793f8df0d38
  verdict: nonverifiable
- date: 2021-12-15
  version: 1.9.21
  appHash: 
  gitRevision: f9bb0384d334f1ab3cd67824f43ff0053e7e51e7
  verdict: nosource
twitter: nunchuk_io
social:
- https://nunchuk.medium.com/
- >-
  https://join.slack.com/t/nunchukio/shared_invite/zt-xqdlvl5g-xKKohQu_R7IUo7_np8rVaw
redirect_from: 
developerName: Nunchuk Inc
features: 

---

**Update 2024-11-19**

To automate building {{ page.title }}, we had to not only update the wallet specific files `io.nunchuk.android.sh` and `io.nunchuk.android.dockerfile` but also drastically improved our general Android App Bundle (AAB) test script `testAAB.sh` which now for the first time could find an AAB to be reproducible.

*Summary of Differences*
```
Contents of diff_armeabi_v7a.txt:
Binary files /tmp/test_io.nunchuk.android_1.9.53/fromPlay-unzipped/armeabi_v7a/AndroidManifest.xml and /tmp/test_io.nunchuk.android_1.9.53/fromBuild-unzipped/armeabi_v7a/AndroidManifest.xml differ
Only in /tmp/test_io.nunchuk.android_1.9.53/fromPlay-unzipped/armeabi_v7a: META-INF
Only in /tmp/test_io.nunchuk.android_1.9.53/fromPlay-unzipped/armeabi_v7a: stamp-cert-sha256

Contents of diff_base.txt:
Binary files /tmp/test_io.nunchuk.android_1.9.53/fromPlay-unzipped/base/AndroidManifest.xml and /tmp/test_io.nunchuk.android_1.9.53/fromBuild-unzipped/base/AndroidManifest.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.53/fromPlay-unzipped/base/res/xml/splits0.xml and /tmp/test_io.nunchuk.android_1.9.53/fromBuild-unzipped/base/res/xml/splits0.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.53/fromPlay-unzipped/base/resources.arsc and /tmp/test_io.nunchuk.android_1.9.53/fromBuild-unzipped/base/resources.arsc differ
Only in /tmp/test_io.nunchuk.android_1.9.53/fromPlay-unzipped/base: stamp-cert-sha256

Contents of diff_en.txt:
Binary files /tmp/test_io.nunchuk.android_1.9.53/fromPlay-unzipped/en/AndroidManifest.xml and /tmp/test_io.nunchuk.android_1.9.53/fromBuild-unzipped/en/AndroidManifest.xml differ
Only in /tmp/test_io.nunchuk.android_1.9.53/fromPlay-unzipped/en: META-INF
Binary files /tmp/test_io.nunchuk.android_1.9.53/fromPlay-unzipped/en/resources.arsc and /tmp/test_io.nunchuk.android_1.9.53/fromBuild-unzipped/en/resources.arsc differ
Only in /tmp/test_io.nunchuk.android_1.9.53/fromPlay-unzipped/en: stamp-cert-sha256

Contents of diff_xhdpi.txt:
Binary files /tmp/test_io.nunchuk.android_1.9.53/fromPlay-unzipped/xhdpi/AndroidManifest.xml and /tmp/test_io.nunchuk.android_1.9.53/fromBuild-unzipped/xhdpi/AndroidManifest.xml differ
Only in /tmp/test_io.nunchuk.android_1.9.53/fromPlay-unzipped/xhdpi: META-INF
Binary files /tmp/test_io.nunchuk.android_1.9.53/fromPlay-unzipped/xhdpi/resources.arsc and /tmp/test_io.nunchuk.android_1.9.53/fromBuild-unzipped/xhdpi/resources.arsc differ
Only in /tmp/test_io.nunchuk.android_1.9.53/fromPlay-unzipped/xhdpi: stamp-cert-sha256
```

{% include asciicast %}

We tried to follow the guidelines in this [issue](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/574), which is currently a work-in-progress.


## We take the size of stamp-cert-sha256

```
$ wc -c fromPlay-unzipped/{base,armeabi_v7a,en,xhdpi}/stamp-cert-sha256
 32 fromPlay-unzipped/base/stamp-cert-sha256
 32 fromPlay-unzipped/armeabi_v7a/stamp-cert-sha256
 32 fromPlay-unzipped/en/stamp-cert-sha256
 32 fromPlay-unzipped/xhdpi/stamp-cert-sha256
128 total
```

## Diffoscope results

**base**

- [unzipped/base/res/xml/splits0.xml](../../assets/diffoscope-results/android/io.nunchuk.android/1.9.53/diffoscope-base-splits0.xml.html)
- [decoded/base/AndroidManifest.xml](../../assets/diffoscope-results/android/io.nunchuk.android/1.9.53/diffoscope_AndroidManifest.html)
- [unzipped/base/resources.arsc](../../assets/diffoscope-results/android/io.nunchuk.android/1.9.53/diffoscope-base-resources.arsc.html)

**armeabi_v7a**

- [unzipped/base/AndroidManifest.xml](../../assets/diffoscope-results/android/io.nunchuk.android/1.9.53/diffoscope-armeabi_v7a-AndroidManifest.xml.html)

**en**

- [unzipped/en/AndroidManifest.xml](../../assets/diffoscope-results/android/io.nunchuk.android/1.9.53/diffoscope-en-AndroidManifest.xml.html)
- [unzipped/en/resources.arsc](../../assets/diffoscope-results/android/io.nunchuk.android/1.9.53/diffoscope-en-resources.arsc.html)

**xhdpi**

- [unzipped/xhdpi/AndroidManifest.xml](../../assets/diffoscope-results/android/io.nunchuk.android/1.9.53/diffoscope-xhdpi-AndroidManifest.xml.html)
- [unzipped/xhdpi/resources.arsc](../../assets/diffoscope-results/android/io.nunchuk.android/1.9.53/diffoscope-xhdpi-resources.arsc.html)

The pattern of files match the exceptions noted in the issue mentioned above.

We note that there are too many diffs to make this version reproducibile. Therefore, version 1.9.53 is **nonverifiable**

- We are documenting these diffs in our [wiki: Excerpts in Reproducibility](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/wikis/Excerpts-about-Reproducibility-(WIP)#november-19-2024---leo-on-nunchuk-ionunchukandroid_v1953)


**Previous Review 2024-11-07** Reproducible verification for version 1.9.53

We followed the [instructions](https://github.com/nunchuk-io/nunchuk-android/tree/master/reproducible-builds) from the provider regarding their reproducibility verification steps.

## Using their [apkdiff.py](https://github.com/nunchuk-io/nunchuk-android/blob/master/reproducible-builds/apkdiff.py) 

Nunchuk has their own custom Python script to ascertain whether the built vs the device apks match or not. These were the results:

```
dannybuntu@MS-7978:~/nunchuk-android/reproducible-builds$ ./apkdiff.py ../apks/built-apks/splits/base-armeabi_v7a.apk ../apks/device-apks/split_config.armeabi_v7a.apk 
APKs are the same!
dannybuntu@MS-7978:~/nunchuk-android/reproducible-builds$ ./apkdiff.py ../apks/built-apks/splits/base-xhdpi.apk ../apks/device-apks/split_config.xhdpi.apk 
APKs are the same!
dannybuntu@MS-7978:~/nunchuk-android/reproducible-builds$ ./apkdiff.py ../apks/built-apks/splits/base-en.apk ../apks/device-apks/split_config.en.apk 
APKs are the same!
dannybuntu@MS-7978:~/nunchuk-android/reproducible-builds$ ./apkdiff.py ../apks/built-apks/splits/base-master.apk ../apks/device-apks/base.apk 
APK file classes.dex does not match
APKs are different!
```

We noticed that apkdiff.py excluded the following files: 

```
def compareApkAndBundle(first, second):
    FILES_TO_IGNORE = [
            "resources.arsc", 
            "stamp-cert-sha256", 
            "assets/dexopt/baseline.prof", 
            "assets/dexopt/baseline.profm",
            "AndroidManifest.xml",
            ]

def compareApks(first, second):
    FILES_TO_IGNORE = [
            "META-INF/MANIFEST.MF", 
            "META-INF/CERT.RSA", 
            "META-INF/CERT.SF", 
            "META-INF/BNDLTOOL.SF",
            "META-INF/BNDLTOOL.RSA",
            "stamp-cert-sha256",
            "resources.arsc", 
            "res/xml/splits0.xml",
            "AndroidManifest.xml",
            "assets/dexopt/baseline.prof",
            "assets/dexopt/baseline.profm",
            ]
```

We took the initiative to [file an issue](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/574) regarding these files.

### Proceeding with unzipping the apks, normalizing their names and running diff -r

**armeabi_v7a**

```
dannybuntu@MS-7978:~/nunchuk-android/apks$ diff -r built-apks/armeabi_v7a/ device-apks/armeabi_v7a/
Binary files built-apks/armeabi_v7a/AndroidManifest.xml and device-apks/armeabi_v7a/AndroidManifest.xml differ
Only in device-apks/armeabi_v7a/: META-INF
Only in device-apks/armeabi_v7a/: stamp-cert-sha256
```

**base**

```
$ diff -r built-apks/base/ device-apks/base/
Binary files built-apks/base/AndroidManifest.xml and device-apks/base/AndroidManifest.xml differ
Binary files built-apks/base/assets/dexopt/baseline.prof and device-apks/base/assets/dexopt/baseline.prof differ
Binary files built-apks/base/classes2.dex and device-apks/base/classes2.dex differ
Binary files built-apks/base/classes3.dex and device-apks/base/classes3.dex differ
Binary files built-apks/base/classes4.dex and device-apks/base/classes4.dex differ
Binary files built-apks/base/classes5.dex and device-apks/base/classes5.dex differ
Binary files built-apks/base/classes6.dex and device-apks/base/classes6.dex differ
Binary files built-apks/base/classes.dex and device-apks/base/classes.dex differ
Binary files built-apks/base/res/xml/splits0.xml and device-apks/base/res/xml/splits0.xml differ
Binary files built-apks/base/resources.arsc and device-apks/base/resources.arsc differ
Only in device-apks/base/: stamp-cert-sha256
```

**en**

```
$ diff -r built-apks/en/ device-apks/en/
Binary files built-apks/en/AndroidManifest.xml and device-apks/en/AndroidManifest.xml differ
Only in device-apks/en/: META-INF
Binary files built-apks/en/resources.arsc and device-apks/en/resources.arsc differ
Only in device-apks/en/: stamp-cert-sha256
```

**xhdpi**

```
$ diff -r built-apks/xhdpi/ device-apks/xhdpi/
Binary files built-apks/xhdpi/AndroidManifest.xml and device-apks/xhdpi/AndroidManifest.xml differ
Only in device-apks/xhdpi/: META-INF
Binary files built-apks/xhdpi/resources.arsc and device-apks/xhdpi/resources.arsc differ
Only in device-apks/xhdpi/: stamp-cert-sha256
```

Until we have finalized the list of files that can be considered as excluded from diffs, the presence of multiple diffs, particularly in base-master.apk, such as: 
- classes2.dex
- classes3.dex
- classes4.dex
- classes5.dex
- classes6.dex

would render version 1.9.53 as **non-verifiable**

### Hashes of the APKs

```
dannybuntu@MS-7978:~/nunchuk-android/apks/built-apks/splits$ sha256sum *.apk
aaec6e500babbd1931db8485b99205468e426f6157df131f607aa69b6e821708  base-armeabi_v7a.apk
92e6c7ab6bd7335f9012cace0a71d2339b559cfa0a1ae56a798fb226bd676e83  base-en.apk
ff7a34f14d304b27991b00cb0148dbbb508108d64255e64047a2047865d5ac9e  base-master.apk
72029da7b4d23eea8ddc7477ea6c618961e3c54971b1c257c549c62014396657  base-xhdpi.apk
```

```
dannybuntu@MS-7978:~/nunchuk-android/apks/device-apks$ sha256sum *.apk
59777895e5cc335505d9917dcbd71bd22162affae88d926c5ed92fee5216de08  base.apk
b743c962485d546ec74d8c7a21d7658d111fd5c61da465cefef188d82527cc6f  split_config.armeabi_v7a.apk
1f8a07887f49898030894acfd47447b2fd56b7395b6c926ec2756427487d5252  split_config.en.apk
26fb6d2b6775d7a1044ccabfbc0c071ce22ba1095d4e3d5a664e1691dae07209  split_config.xhdpi.apk
```

We have updated the issue with this [note.](https://github.com/nunchuk-io/nunchuk-android/issues/23#issuecomment-2462243428)

**Previous Review 2023-07-05**: We have added a 
[test script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/scripts/test/android/io.nunchuk.android.sh) 
to check the reproducibility of Nunchuk 1.9.32.
Unfortunately the result has diff on a lot of files, Which is also reported in an issue 
[here](https://github.com/nunchuk-io/nunchuk-android/issues/23).
So the app is still **not verifiable**.

The app's version for Android was released as open source under the GPLv3
[here](https://github.com/nunchuk-io/nunchuk-android).

It's build instructions are:

1. Follow the build instructions for [Nunchuk Android Native SDK](https://github.com/nunchuk-io/nunchuk-android-nativesdk).
2. Publish the SDK to the local maven. Note the SDK version number.
3. Open dependencies.gradle and update nativeSdkVersion to the SDK version you just published.
4. Build and run the app on your device.

So, what are the "build instructions for Nunchuk Android Native SDK"?
First of all, Xcode is required. That's a bit of an issue for us, as all
contributors who do builds do not have a Mac and Xcode only works on Mac.
It's not immediately clear if it really is required, so lets look further ...

```
git submodule add --force -b main https://gitlab.com/nunchuck/libnunchuk.git
```

but the user [nunchuck](https://gitlab.com/nunchuck) doesn't exist on
gitlab.com.

As Nunchuk Android's code is on GitHub, we can guess the right repo might be
[nunchuk-io/libnunchuk](https://github.com/nunchuk-io/libnunchuk).

Which is weird is that the repo's
[git submodule](https://github.com/nunchuk-io/nunchuk-android-nativesdk/blob/main/.gitmodules)
also still points to GitLab, so the error is not only in the documentation.

Let's try:

```
$ git clone https://github.com/nunchuk-io/nunchuk-android-nativesdk.git
$ cd nunchuk-android-nativesdk/
$ cat .gitmodules 
[submodule "src/main/native/libnunchuk"]
	path = src/main/native/libnunchuk
	url = https://gitlab.com/nunchuck/libnunchuk.git
	branch = main
$ git submodule update --init --recursive
Submodule 'src/main/native/libnunchuk' (https://gitlab.com/nunchuck/libnunchuk.git) registered for path 'src/main/native/libnunchuk'
Cloning into '/home/leo/tmp/nunchuk-android-nativesdk/src/main/native/libnunchuk'...
Username for 'https://gitlab.com': 
```

This repo isn't a public repo but as it might be private, git asks for a login.
As discussed above, we'll use libnunchuk from GitHub:

```
$ git submodule set-url src/main/native/libnunchuk https://github.com/nunchuk-io/libnunchuk.git
$ git submodule update --init --recursive
Cloning into '/home/leo/tmp/nunchuk-android-nativesdk/src/main/native/libnunchuk'...
Submodule path 'src/main/native/libnunchuk': checked out 'c168cf715cbe768b5cd5004609f2db6d0ebfe254'
...
error: object e35e28f52d20df27561b2780f6b9c86669a9de21: zeroPaddedFilemode: contains zero-padded file modes
fatal: fsck error in packed object
fatal: index-pack failed
fatal: clone of 'https://github.com/sqlcipher/sqlcipher' into submodule path '/home/leo/tmp/nunchuk-android-nativesdk/src/main/native/libnunchuk/contrib/sqlcipher' failed
Failed to clone 'contrib/sqlcipher'. Retry scheduled
```

So ... we can't clone that dependency. Seriously?

```
$ git clone https://github.com/sqlcipher/sqlcipher
Cloning into 'sqlcipher'...
remote: Enumerating objects: 15498, done.
remote: Counting objects: 100% (1910/1910), done.
remote: Compressing objects: 100% (816/816), done.
error: object e35e28f52d20df27561b2780f6b9c86669a9de21: zeroPaddedFilemode: contains zero-padded file modes
fatal: fsck error in packed object
fatal: index-pack failed
```

So for now we give up at this point and file this product as **not verifiable**.

**Update 2023-01-06**: As laid out in
[this issue](https://github.com/nunchuk-io/nunchuk-android/issues/7), we managed
to compile the app but with substantial differences:

```
Files ./GooglePlay/classes2.dex and ./LocalBuild/classes2.dex differ
Files ./GooglePlay/classes3.dex and ./LocalBuild/classes3.dex differ
Files ./GooglePlay/classes4.dex and ./LocalBuild/classes4.dex differ
Files ./GooglePlay/classes5.dex and ./LocalBuild/classes5.dex differ
Files ./GooglePlay/classes.dex and ./LocalBuild/classes.dex differ
Files ./GooglePlay/lib/arm64-v8a/libnunchuk-android.so and ./LocalBuild/lib/arm64-v8a/libnunchuk-android.so differ
```

Until these issues are resolved, the app is **not verifiable**.

