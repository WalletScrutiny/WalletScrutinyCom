---
wsId: 
title: "Electrum Bitcoin Wallet"
altTitle: 
authors:
- leo
users: 500000
appId: org.electrum.electrum
released: 2016-03-02
updated: 2021-07-19
version: "4.1.5.0"
stars: 3.3
ratings: 2319
reviews: 1378
size: 21M
website: https://electrum.org
repository: https://github.com/spesmilo/electrum
issue: https://github.com/spesmilo/electrum/issues/7417
icon: org.electrum.electrum.png
bugbounty: 
verdict: reproducible
date: 2021-07-19
signer: 
reviewArchive:
- date: 2021-06-18
  version: "4.1.4"
  appHash: fffa9a1c27ee6d6bd1d90e8008fe53ba960d19137964b93968d68ec7a4f04433
  gitRevision: 409a7b42b7975b50077de60a0fe096a13fed2d12
  verdict: reproducible
- date: 2021-06-10
  version: "3.3.7"
  appHash: 
  gitRevision: 612e60ecd2013c802012d1c553a2ff8b56004226
  verdict: nonverifiable

providerTwitter: ElectrumWallet
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:
  - /electrum/
  - /org.electrum.electrum/
  - /posts/2019/12/elecrtum/
  - /posts/org.electrum.electrum/
---


Version `4.1.5` appeared on Play Store. let's see if that is also reproducible.
As for us, that version is still not available, we again go with the direct
download from their website and check if that's the same as what Google
distributes later.

```
$ git clone https://github.com/spesmilo/electrum
$ cd electrum/
$ git checkout 4.1.5
$ wget https://download.electrum.org/4.1.5/Electrum-4.1.5.0-arm64-v8a-release.apk
$ wget https://download.electrum.org/4.1.5/Electrum-4.1.5.0-armeabi-v7a-release.apk
```

... and now we are supposed to run `contrib/android/build.sh` which has 68 lines
of code and calls `contrib/build_tools_util.sh` with its 154 lines of code.

That's a bit too much as we want to automate reproducibility testing and don't
want to run "random" code on our infrastructure - with root privilege even. We
filed an
[issue to adjust the build instructions accordingly](https://github.com/spesmilo/electrum/issues/7417)
but it appears to be easy enough to build without running above scripts at all:

```
$ cp contrib/deterministic-build/requirements-build-android.txt contrib/android/
$ docker build -t electrum-android-builder-img contrib/android/
$ docker run -it --rm \
      --name electrum-android-builder-cont \
      --volume $PWD:/home/user/wspace/electrum \
      --volume $PWD/.buildozer/.gradle:/home/user/.gradle \
      --workdir /home/user/wspace/electrum electrum-android-builder-img \
      /bin/bash -c `./contrib/android/make_apk release-unsigned`
...
💬 INFO:  done.
total 66024
drwxr-xr-x  2 user user     4096 Jul 20 01:04 .
drwxrwxr-x 10 user user     4096 Jul 20 01:04 ..
-rw-r--r--  1 user user 22344714 Jul 20 01:04 Electrum-4.1.5.0-arm64-v8a-release-unsigned.apk
-rw-r--r--  1 user user 22228447 Jul 20 01:04 Electrum-4.1.5.0-armeabi-v7a-release-unsigned.apk
f1877d80655bf0302609d5a00cade13150d3cead5f7ab8d5a5522f707566cd93  /home/user/wspace/electrum/contrib/android/../../dist/Electrum-4.1.5.0-arm64-v8a-release-unsigned.apk
227cb4fb61157e045313ce42087369782991bfd646d78052e9dd6a8091ad1143  /home/user/wspace/electrum/contrib/android/../../dist/Electrum-4.1.5.0-armeabi-v7a-release-unsigned.apk
```

That looks good. After unzipping the two APKs from the download and the two
just built, the diffs look as follows:

```
$ unzip -d fromBuild32 dist/Electrum-4.1.5.0-armeabi-v7a-release-unsigned.apk 
$ unzip -d fromBuild64 dist/Electrum-4.1.5.0-arm64-v8a-release-unsigned.apk 
$ unzip -d fromDownload32 Electrum-4.1.5.0-armeabi-v7a-release.apk 
$ unzip -d fromDownload64 Electrum-4.1.5.0-arm64-v8a-release.apk 
$ diff --recursive --brief from*32
Only in fromDownload32/META-INF: CERT.RSA
Only in fromDownload32/META-INF: CERT.SF
Files fromBuild32/META-INF/MANIFEST.MF and fromDownload32/META-INF/MANIFEST.MF differ
$ diff --recursive --brief from*64
Only in fromDownload64/META-INF: CERT.RSA
Only in fromDownload64/META-INF: CERT.SF
Files fromBuild64/META-INF/MANIFEST.MF and fromDownload64/META-INF/MANIFEST.MF differ
```

And with the updated test script:

```
Results:
appId:          org.electrum.electrum
signer:         e543d576fa0f2a33d412bca4c7d61e2301830e956e7d947e75b9052d176027d3
apkVersionName: 4.1.5.0
apkVersionCode: 34010500
verdict:        reproducible
appHash:        de25614cc8f8fa20262f20df816634a349cf796b3e4cf026087e4dec12c15231
commit:         d8d2c180aafaec1ae9bc68c27a7d780df8de4348

Diff:
Only in /tmp/fromPlay_org.electrum.electrum_34010500/META-INF: CERT.RSA
Only in /tmp/fromPlay_org.electrum.electrum_34010500/META-INF: CERT.SF
Files /tmp/fromPlay_org.electrum.electrum_34010500/META-INF/MANIFEST.MF and /tmp/fromBuild_org.electrum.electrum_34010500/META-INF/MANIFEST.MF differ

Revision, tag (and its signature):
object d8d2c180aafaec1ae9bc68c27a7d780df8de4348
type commit
tag 4.1.5
tagger ThomasV <thomasv@electrum.org> 1626708974 +0200

4.1.5
```

which is a full match except for the signature which is expected. Electrum
`4.1.5` is **reproducible**!
