---
wsId: 
title: "Electrum Bitcoin Wallet"
altTitle: 
authors:
- leo
users: 500000
appId: org.electrum.electrum
released: 2016-03-02
latestUpdate: 2021-06-17
version: "4.1.4.0"
stars: 3.3
ratings: 2230
reviews: 1332
size: 21M
website: https://electrum.org
repository: https://github.com/spesmilo/electrum
issue: https://github.com/spesmilo/electrum/issues/5839
icon: org.electrum.electrum.png
bugbounty: 
verdict: reproducible # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2021-06-18
reviewStale: true
signer: 
reviewArchive:
- date: 2021-06-10
  version: "3.3.7"
  apkHash: 
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


After some back and forth, the update is now available for download from their
website and the
[provider's comment](https://github.com/spesmilo/electrum/issues/5839#issuecomment-862623464)
suggests that's the same binary as what we will eventually find on the Play
Store, so we will check it out.

As it turns out, [the website](https://electrum.org/#download) has version 4.1.4
available, not 4.1.3 as mentioned in the issue. Also "the binary" is two
binaries - one for 64bit and one for 32bit architectures.

Let's see, using
[these build instructions](https://github.com/spesmilo/electrum/tree/master/contrib/android#android-binary-with-docker) ...

```
$ git clone git@github.com:spesmilo/electrum.git
$ git checkout 4.1.4
$ cat contrib/android/build_docker_image.sh
#!/bin/bash

set -e

CONTRIB_ANDROID="$(dirname "$(readlink -e "$0")")"
CONTRIB="$CONTRIB_ANDROID"/..

cp "$CONTRIB/deterministic-build/requirements-build-android.txt" "$CONTRIB_ANDROID/requirements-build-android.txt"
sudo docker build -t electrum-android-builder-img "$CONTRIB_ANDROID"
rm "$CONTRIB_ANDROID/requirements-build-android.txt"
```

so as we don't feel comfortable running arbitrary code on our host, we usually
run builds in docker containers but you can't build docker images inside of
docker containers yet. The above code looks benign but we will remove the `sudo`.
It should not be necessary here.

```
$ sed -i 's/sudo //' contrib/android/build_docker_image.sh
$ cat contrib/android/build_docker_image.sh
#!/bin/bash

set -e

CONTRIB_ANDROID="$(dirname "$(readlink -e "$0")")"
CONTRIB="$CONTRIB_ANDROID"/..

cp "$CONTRIB/deterministic-build/requirements-build-android.txt" "$CONTRIB_ANDROID/requirements-build-android.txt"
docker build -t electrum-android-builder-img "$CONTRIB_ANDROID"
rm "$CONTRIB_ANDROID/requirements-build-android.txt"
$ ./contrib/android/build_docker_image.sh
```

Next the build instructions require a fresh clone, which we are working with
anyway, so we can skip cloning again.

Next comes the build command:

```
$ sudo docker run -it --rm \
    --name electrum-android-builder-cont \
    -v $PWD:/home/user/wspace/electrum \
    -v $PWD/.buildozer/.gradle:/home/user/.gradle \
    -v ~/.keystore:/home/user/.keystore \
    --workdir /home/user/wspace/electrum \
    electrum-android-builder-img \
    ./contrib/android/make_apk
```

Again, sudo is not necessary but more importantly, this command requires some
`.keystore` folder in our home directory. Coincidentally we do have one but
build instructions should not request access to **our** keystore.

As

```
make_apk takes an optional parameter which can be either release or release-unsigned
```

we will give it a try with `release-unsigned` which should make the `.keystore`
obsolete and `sudo` will be skipped, too:

```
$ docker run --rm \
    --volume $PWD:/home/user/wspace/electrum \
    --volume $PWD/.buildozer/.gradle:/home/user/.gradle \
    --workdir /home/user/wspace/electrum \
    electrum-android-builder-img \
    ./contrib/android/make_apk release-unsigned
...
e34eb71551397efbf37c6b69ffc8d2765d1cab0b3e63ceee2e3312d74f419002  /home/user/wspace/electrum/contrib/android/../../bin/Electrum-4.1.4.0-arm64-v8a-release-unsigned.apk
cb333041d754b785a7a522d454a008505fbcf90706929d1d89d613bade2a44e4  /home/user/wspace/electrum/contrib/android/../../bin/Electrum-4.1.4.0-armeabi-v7a-release-unsigned.apk
```

That looks good. After unzipping the two APKs from the download and the two
just built, the diffs look as follows:

```
$ diff --recursive --brief from*32
Only in fromDownload32/META-INF: CERT.RSA
Only in fromDownload32/META-INF: CERT.SF
Files fromBuild32/META-INF/MANIFEST.MF and fromDownload32/META-INF/MANIFEST.MF differ
$ diff --recursive --brief from*64
Only in fromDownload64/META-INF: CERT.RSA
Only in fromDownload64/META-INF: CERT.SF
Files fromBuild64/META-INF/MANIFEST.MF and fromDownload64/META-INF/MANIFEST.MF differ
```

which is a full match except for the signature which is expected.

For the record, the downloaded files had these checksums:

```
fffa9a1c27ee6d6bd1d90e8008fe53ba960d19137964b93968d68ec7a4f04433  Electrum-4.1.4.0-arm64-v8a-release.apk
fd3ea6e0abcfccce4bb494e4ed5189a2cc5e776540a7ecc7fc39aa7b7be6dc28  Electrum-4.1.4.0-armeabi-v7a-release.apk
```

Electrum 4.1.4 is **reproducible**!
