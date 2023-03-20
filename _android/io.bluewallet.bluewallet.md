---
wsId: bluewallet
title: BlueWallet Bitcoin Wallet
altTitle: 
authors:
- leo
users: 100000
appId: io.bluewallet.bluewallet
appCountry: 
released: 2018-11-01
updated: 2022-11-23
version: 6.3.2
stars: 4.2
ratings: 1810
reviews: 259
size: 
website: https://bluewallet.io
repository: https://github.com/bluewallet/bluewallet
issue: https://github.com/BlueWallet/BlueWallet/issues/758
icon: io.bluewallet.bluewallet.png
bugbounty: 
meta: ok
verdict: ftbfs
date: 2023-02-25
signer: 42250147991337ed230fbd93c0be0e5f6183d02eed9e1d53e5aac94167cf3f2f
reviewArchive:
- date: 2020-07-14
  version: 6.3.2
  appHash: 
  gitRevision: 0f9bcb13a75554cb34a522e07aa2cfeb4048480c
  verdict: custodial
- date: 2020-01-08
  version: 4.9.1
  appHash: 
  gitRevision: 21cb412a4e74b14bd6124c3e3be855d6b96ef589
  verdict: nonverifiable
twitter: bluewalletio
social:
- https://www.reddit.com/r/bluewallet
redirect_from:
- /bluewallet/
- /io.bluewallet.bluewallet/
- /posts/2019/12/bluewallet/
- /posts/io.bluewallet.bluewallet/
features:
- ln

---

As [announced two days ago](https://bluewallet.io/sunsetting-lndhub/), the
default custodial LN backend for {{ page.title }} is being discontinued. We tried it
out and as of today, creating a default LN account stopped working if the user
does not provide some backend URL. This resolves a
[long-standing issue](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/117)
that had
us list this product as "custodial" as a whole. As {{ page.title }} now is in
its entirety self-custodial (unless the user takes deliberate action to
configure a third party custodian), we have to look deeper into this popular and
feature-rich product.

The product has [public source code](https://github.com/bluewallet/bluewallet),
the latest version on Play Store - 6.3.2 - is also the
[latest release on GitHub](https://github.com/BlueWallet/BlueWallet/releases).

So, let's see if we can compile it ...

[The Readme](https://github.com/bluewallet/bluewallet) does not describe how to
locally build a release APK. Only how to install a developer version on a
connected device. In
[RELEASE.md](https://github.com/BlueWallet/BlueWallet/blob/master/RELEASE.md),
the process is described though, right? The document mainly focuses on bumping
app version, release message and testing the release before pushing it to all
users. The one line about actually building the release would be:

> * go to appcenter.ms, find this exact build under `master` builds, and press `Distribute` -> `Store` -> `Production`.

[AppCenter](https://appcenter.ms/) is a Microsoft tool to

> Continuously build, test, release, and monitor apps for every platform.

which means we have to figure out how Microsoft builds their product as the
provider doesn't build or doesn't share that configuration.

... actually, there is
[this old issue of ours](https://github.com/BlueWallet/BlueWallet/issues/758)
where we had tried many times to reproduce this product years ago. `/scripts`
folder they said?


```
$ git clone https://github.com/BlueWallet/BlueWallet
$ cd BlueWallet/
$ cat scripts/build-release-apk.sh 
#!/bin/bash


# assumes 2 env variables: KEYSTORE_FILE_HEX & KEYSTORE_PASSWORD
#
# PS. to turn file to hex and back:
#     $ xxd -plain test.txt > test.hex
#     $ xxd -plain -revert test.hex test2.txt


echo $KEYSTORE_FILE_HEX > bluewallet-release-key.keystore.hex
xxd -plain -revert bluewallet-release-key.keystore.hex > ./android/bluewallet-release-key.keystore
rm bluewallet-release-key.keystore.hex

cd android
TIMESTAMP=$(date +%s)
sed -i'.original'  "s/versionCode 1/versionCode $TIMESTAMP/g" app/build.gradle
./gradlew assembleRelease
mv ./app/build/outputs/apk/release/app-release-unsigned.apk ./app/build/outputs/apk/release/app-release.apk
$ANDROID_HOME/build-tools/30.0.2/apksigner sign --ks ./bluewallet-release-key.keystore   --ks-pass=pass:$KEYSTORE_PASSWORD ./app/build/outputs/apk/release/app-release.apk
``` 

requires a keystore and introduces randomnes in the result, which would break
reproducibility. The latter is also referenced in
[this open issue](https://github.com/BlueWallet/BlueWallet/issues/3148) so in
the best case we expect to find this product miss the goal of reproducibility
by only a timestamp. Let's see ...

```
$ git checkout v6.3.2 
HEAD is now at 81ed68b55 Merge pull request #5182 from BlueWallet/renovate/react-navigation-monorepo
$ podman run -it --rm -v$PWD:/mnt --workdir=/mnt walletscrutiny/android
# mkdir -p ~/.ssh
# ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts
# apt update -y
# apt install npm -y
# npm install
npm WARN read-shrinkwrap This version of npm is compatible with lockfileVersion@1, but package-lock.json was generated for lockfileVersion@2. I'll try to do my best with it!
npm WARN tar ENOENT: no such file or directory, open '/mnt/node_modules/.staging/crypto-js-0bc3b6fd/LICENSE'
npm WARN tar ENOENT: no such file or directory, open '/mnt/node_modules/.staging/crypto-js-0bc3b6fd/aes.js'
npm WARN tar ENOENT: no such file or directory, open '/mnt/node_modules/.staging/crypto-js-0bc3b6fd/cipher-core.js'
...
npm WARN tar ENOENT: no such file or directory, lstat '/mnt/node_modules/.staging/react-native-99ce84bc/ReactCommon/react/renderer/components'
npm WARN tar ENOENT: no such file or directory, lstat '/mnt/node_modules/.staging/react-native-99ce84bc/ReactCommon/react/renderer/components'
npm WARN tar ENOENT: no such file or directory, open '/mnt/node_modules/.staging/react-native-99ce84bc/ReactCommon/hermes/inspector/Inspector.cpp'
npm ERR! Error while executing:
npm ERR! /usr/bin/git ls-remote -h -t ssh://git@github.com/BlueWallet/react-native-secure-key-store.git
npm ERR! 
npm ERR! git@github.com: Permission denied (publickey).
npm ERR! fatal: Could not read from remote repository.
npm ERR! 
npm ERR! Please make sure you have the correct access rights
npm ERR! and the repository exists.
npm ERR! 
npm ERR! exited with error code: 128
```

... which is apparently a regression as
[this issue about ssh dependencies](https://github.com/BlueWallet/BlueWallet/issues/3059)
was closed as fixed two years ago.

We file this product as **not verifiable** for now and hope the provider
resolves all the relevant issues for a re-evaluation:

* https://github.com/BlueWallet/BlueWallet/issues/3059
* https://github.com/BlueWallet/BlueWallet/issues/3148
* https://github.com/BlueWallet/BlueWallet/issues/758
