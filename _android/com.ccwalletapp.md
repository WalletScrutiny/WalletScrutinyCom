---
wsId: ccwallet
title: "CCWallet: Your Bitcoin Wallet. Blockchain App"
altTitle: 
authors:
- leo
- emanuel
users: 10000
appId: com.ccwalletapp
appCountry: 
released: 2019-06-26
updated: 2020-07-29
version: "1.3.1"
stars: 4.0766916
ratings: 555
reviews: 69
size: 22M
website: https://ccwalletapp.com/
repository: https://github.com/coincasso/ccwallet
issue: https://github.com/coincasso/ccwallet/issues/1
icon: com.ccwalletapp.png
bugbounty: 
meta: stale
verdict: ftbfs
date: 2021-08-17
signer: 
reviewArchive:
twitter: CoinCasso
social:
  - https://www.linkedin.com/company/coincasso
  - https://www.facebook.com/ccwallet.mobileapp
redirect_from:
---

Also based on [Emauel](https://gitlab.com/e3amn2l)'s
[Analysis](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/172#note_522567637):

In the description we read:

> We support Bitcoin, ...

and

> The code of our crypto wallet is open-source and it is available on GitHub.

but no claim about being self-custodial. Only:

> CCWallet is a cryptocurrency wallet mobile app with the opportunity of
  sending, receiving funds, tracking transactions, as well as
  **exporting & importing private keys**.

which implies it is self-custodial.

[Their website](https://ccwalletapp.com/) uses an ssl certificate that expired
on 12/25/2020. That doesn't look like a well maintained wallet.

Let's see how far we get with building the app from the public source code:

```

$ git clone https://github.com/coincasso/ccwallet
$ cd ccwallet/
$ git log --oneline 
c1b4be7 (HEAD -> master, origin/master, origin/HEAD) +
c7cc54a Name changes
7c384e4 La commit
210b34a bugfixes
9443216 duzo zmianek
39e7af9 Merge branch 'dev1' of https://bitbucket.org/kacpertcn/coincasso-wallet into HEAD
f1586c0 -
9e08f77 face touch id p1
fc58f85 main store bugfixes
82e3500 decimals in erc20
c45af3e TouchID
e0e7ca3 erc20 value fix
13fc465 abifix
ce9857f abi fix
e33bdb4 few fixes
cb64865 erc20 tokens, bugfixes
a8e7a09 ccx token
293ba8d url to coincasso.com in settings
e5e6052 few visual edits
66dae07 no message
e5a1297 с1
cb8b083 initial
```

There is a total of 22 commits, all from May and June of 2019. None of them is
tagged. As the latest update of the wallet according to Google is 2020-07-29, we
have to consider the possibility that the app went closed source after an
initial open source release.

Now the complete install instructions:

> # CCWallet 
> 
> ### Installation
      sudo npm i rn-nodeify -g
      npm install
      cd ios
      pod install
      cd ../
      react-native run-ios
      react-native run-android

do not look like instructions that would produce an installable app package with
the final `run-android` part. In ReactNative, that step should rather read:
`cd android; gradlew assembleRelease`:

```
$ docker run -it --volume $PWD:/mnt --workdir /mnt --rm beevelop/cordova bash
root@8fc76c4dbdd3:/mnt# npm i rn-nodeify -g
root@8fc76c4dbdd3:/mnt# npm install
root@8fc76c4dbdd3:/mnt# yes | /opt/android/tools/bin/sdkmanager "build-tools;27.0.3"
root@8fc76c4dbdd3:/mnt# cd android
root@8fc76c4dbdd3:/mnt/android# ./gradlew assembleRelease
> Task :app:processReleaseManifest FAILED
/mnt/android/app/src/main/AndroidManifest.xml Error:
        uses-sdk:minSdkVersion 16 cannot be smaller than version 19 declared in library [:react-native-fs] /mnt/node_modules/react-native-fs/android/build/intermediates/manifests/full/release/AndroidManifest.xml as the library might be using APIs not available in 16
        Suggestion: use a compatible library with a minSdk of at most 16,
                or increase this project's minSdk version to at least 19,
                or use tools:overrideLibrary="com.rnfs" to force usage (may lead to runtime failures)

See http://g.co/androidstudio/manifest-merger for more information about the manifest merger.



FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':app:processReleaseManifest'.
> Manifest merger failed : uses-sdk:minSdkVersion 16 cannot be smaller than version 19 declared in library [:react-native-fs] /mnt/node_modules/react-native-fs/android/build/intermediates/manifests/full/release/AndroidManifest.xml as the library might be using APIs not available in 16
        Suggestion: use a compatible library with a minSdk of at most 16,
                or increase this project's minSdk version to at least 19,
                or use tools:overrideLibrary="com.rnfs" to force usage (may lead to runtime failures)

* Try:
Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output. Run with --scan to get full insights.

* Get more help at https://help.gradle.org

BUILD FAILED in 1m 43s
139 actionable tasks: 139 executed
```

so the build failed with the error:

```
> Manifest merger failed : uses-sdk:minSdkVersion 16 cannot be smaller than version 19 declared in library [:react-native-fs] /mnt/node_modules/react-native-fs/android/build/intermediates/manifests/full/release/AndroidManifest.xml as the library might be using APIs not available in 16
```

which looks like some `react-native-fs` library wasn't pinned to an exact version. Reproducible
builds highly depend on versions being pinned better to cryptographic hashes of
the dependency than to a version number but looking where that dependency came
from:

```
root@8fc76c4dbdd3:/mnt# grep react-native-fs package.json
    "react-native-fs": "^2.11.15",
```

the provider would be fine with any version higher than `2.11.15` of that
library. This is highly problematic, not only because the build can't be
reproduced as soon as the library gets any update but also because it makes the
wallet vulnerable to any such library getting an upgrade with a backdoor which
would automatically get compiled into the wallet. Lastly it's also problematic
because the build instructions might change.

In summary, this app is **not verifiable**.
