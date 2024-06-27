---
wsId: 
title: Komodo Mobile Crypto Wallet
altTitle: 
authors:
- danny
- leo
users: 10000
appId: com.komodoplatform.atomicdex
appCountry: 
released: 2022-12-15
updated: 2024-05-13
version: 0.9.1
stars: 3.9
ratings: 
reviews: 9
size: 
website: https://atomicdex.io
repository: https://github.com/KomodoPlatform/komodo-wallet-mobile
issue: https://github.com/KomodoPlatform/komodo-wallet-mobile/issues/116
icon: com.komodoplatform.atomicdex.png
bugbounty: 
meta: ok
verdict: ftbfs
date: 2024-02-09
signer: 
reviewArchive: 
twitter: KomodoPlatform
social:
- https://discord.com/invite/3rzDPAr
- https://www.reddit.com/r/komodoplatform
- https://t.me/KomodoPlatform_Official
redirect_from: 
developerName: Komodo Platform
features: 

---

**Update 2024-06-26**

- The [Tags issue](https://github.com/KomodoPlatform/komodo-wallet-mobile/issues/60), I will now try to build this app. 
 

**Update 2024-02-09**: This app is source-available but despite various comments
on the [open issue 60](https://github.com/KomodoPlatform/komodo-wallet-mobile/issues/60)
there is no reaction from the provider.

Emanuel has identified
[this commit](https://github.com/KomodoPlatform/komodo-wallet-mobile/commit/60113f49959b74e3e70e3be937240538bda38549)
as likely candidate for the current version `v0.9.0` on Google Play. Let's see
if we can compile it using the
[readme](https://github.com/KomodoPlatform/komodo-wallet-mobile/blob/master/README.md)
and
[what it points to](https://github.com/KomodoPlatform/komodo-wallet-mobile/wiki/Project-Setup#build-and-run)
...

```
$ git clone https://github.com/KomodoPlatform/komodo-wallet-mobile
$ cd komodo-wallet-mobile/
$ podman run -it --rm -v$PWD:/mnt --workdir=/mnt android:latest
root@44f18b8963e9:/mnt# git checkout 60113f49959b74e3e70e3be937240538bda38549
root@44f18b8963e9:/mnt# apt update && apt full-upgrade -y
root@44f18b8963e9:/mnt# apt install jq curl coreutils
root@44f18b8963e9:/mnt# ./fetch_coins.sh 
root@44f18b8963e9:/mnt# git clone https://github.com/flutter/flutter.git $HOME/flutter
root@44f18b8963e9:/mnt# export PATH="$PATH:$HOME/flutter/bin"
root@44f18b8963e9:/mnt# cd ~/flutter
root@44f18b8963e9:/root/flutter# git fetch
root@44f18b8963e9:/root/flutter# git checkout tags/2.8.1
root@44f18b8963e9:/root/flutter# cd /mnt/
root@44f18b8963e9:/mnt# flutter build apk
   Woah! You appear to be trying to run flutter as root.
   We strongly recommend running the flutter tool without superuser privileges.
  /
📎
Downloading Gradle Wrapper...                                      984ms
/usr/bin/tar: gradle/wrapper/gradle-wrapper.properties: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: gradle/wrapper/gradle-wrapper.jar: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: gradle/wrapper: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: gradle: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: gradlew: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: gradlew.bat: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: NOTICE: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: Exiting with failure status due to previous errors
Downloading Gradle Wrapper...                                    1,114ms
/usr/bin/tar: gradle/wrapper/gradle-wrapper.properties: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: gradle/wrapper/gradle-wrapper.jar: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: gradle/wrapper: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: gradle: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: gradlew: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: gradlew.bat: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: NOTICE: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: Exiting with failure status due to previous errors
Flutter could not download and/or extract
https://storage.googleapis.com/flutter_infra_release/gradle-wrapper/fd5c1f2c013565a3bea56ada6df9d2b8e96d56aa/gradle-wrapper.tgz. Ensure you have network
connectivity and all of the required dependencies listed at flutter.dev/setup.
The original exception was: ProcessException: The command failed
  Command: tar -xzf
  /root/flutter/bin/cache/downloads/storage.googleapis.com/flutter_infra_release/gradle-wrapper/fd5c1f2c013565a3bea56ada6df9d2b8e96d56aa/gradle-wrapper.tgz -C
  /root/flutter/bin/cache/artifacts/gradle_wrapper.
root@44f18b8963e9
```

and that's where we give up for now. The build instructions are geared towards
IDE integration, explaining how to build the project with Android Studio while
we need isolation in a docker container for example and automation via the
command line.

{{ page.title }} is so far **not verifiable**.


## App Description from Google Play

> AtomicDEX Mobile offers the widest permission-less cross-chain trading support of any mobile crypto app on the market.
>
> It’s a fast and secure multi-coin wallet with peer-to-peer (P2P) DEX support, designed for ease of use and perfect for storing digital assets.
>
> The app provides a secure and easy way to buy and store multiple cryptocurrencies. It supports dozens of blockchain protocols natively such as Bitcoin, BNB Chain, Ethereum, Polygon, Litecoin, Dogecoin, and many more.

## Analysis

- Once installed, we are informed that we are beta-testers.
- We created a wallet and were given a 12-word seed phrase. 
- There is a legacy BTC address with send and receive functions. 
- There in an option to back up the private keys.
- The developers [claim](https://atomicdex.io/en/blog/q1-2023-progress-report/#atomicdex-mobile-goes-100-open-source) they are 100% Open Source.
- We found the [repository](https://github.com/KomodoPlatform/komodo-wallet-mobile) for the mobile app.
- This app is **[for verification](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/490)**.