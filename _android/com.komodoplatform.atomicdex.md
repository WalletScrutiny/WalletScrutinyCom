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
verdict: wip
date: 2024-06-28
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

### The [Tags issue](https://github.com/KomodoPlatform/komodo-wallet-mobile/issues/60) is resolved, I will now try to build this app. 

- First, basic docker image `komodo` was created via our {% include testScript.html %}. This had the following dependencies: Android SDK, Flutter, and Gradle. The testscript failed.
- Using `docker run --rm -it --volume /tmp/test_com.komodoplatform.atomicdex:/app --name komodo-wallet-build komodo bash` an interactive docker container is created based on the `komodo` image.
- Since this is an initial manual build, I ran the following commands into the docker cmdline:
```
apt-get update && apt-get install -y coreutils jq
git clone https://github.com/flutter/flutter.git $HOME/flutter
export PATH="$PATH:$HOME/flutter/bin"
cd ~/flutter
git fetch
git checkout tags/2.8.1
git clone https://github.com/KomodoPlatform/AtomicDEX-mobile.git $HOME/atomicdex_mobile
cd  $HOME/atomicdex_mobile
flutter doctor
flutter doctor --android-licenses
mkdir -p ~/atomicdex_mobile/android/app/src/main/cpp/libs/arm64-v8a
mkdir -p ~/atomicdex_mobile/android/app/src/main/cpp/libs/armeabi-v7a
cd ~/atomicdex_mobile/android/app/src/main/cpp/libs/arm64-v8a
wget https://github.com/KomodoPlatform/komodo-defi-framework/releases/download/v2.0.0-beta/mm2-b0fd99e84-android-aarch64-CI.zip
unzip mm2-b0fd99e84-android-aarch64-CI.zip
rm mm2-b0fd99e84-android-aarch64-CI.zip
cd ~/atomicdex_mobile/android/app/src/main/cpp/libs/armeabi-v7a
wget https://github.com/KomodoPlatform/komodo-defi-framework/releases/download/v2.0.0-beta/mm2-b0fd99e84-android-armv7-CI.zip
unzip mm2-b0fd99e84-android-armv7-CI.zip 
rm mm2-b0fd99e84-android-armv7-CI.zip 
cd ~/atomicdex_mobile/
flutter pub get
flutter build apk
```
The build was successful. That generated a much larger, universal apk file than the split apk extracted from Google Play. As such there naturally was a large diff.

Next, I need to figure out how to get the universal apk from Google Play or alternately, derive the split apks from the universal apk that was built. 

I discovered this in the AndroidManifest.xml: 

`"android:isSplitRequired="true""`

This indicates that this is a split apk. After generating the app-release.bundle

I ran:

`$java -jar ~/work/tools/bundletool-all-1.17.0.jar build-apks --bundle=/tmp/test_com.komodoplatform.atomicdex/build/app/outputs/bundle/release/app-release.aab --output=~/work/builds/com.komodoplatform.atomicdex/split-apks/apks-release.apks`

It gave an error but proceeded to generate the directory and the file: `apks-release.apks`

```
WARNING: The APKs won't be signed and thus not installable unless you also pass a keystore via the flag --ks. See the command help for more information.
```

I proceeded to extract the apks from the `apks-release.apks` with

`$ java -jar ~/work/tools/bundletool-all-1.17.0.jar extract-apks --apks=/home/danny/work/builds/com.komodoplatform.atomicdex/split-apks/apks-release.apks --output-dir=~/work/builds/com.komodoplatform.atomicdex/split-apks/splits --device-spec=~/work/device-spec.json`

It generated 4 files: 

- base-arm64_v8a.apk  
- base-en.apk  
- base-master.apk  
- base-xxhdpi.apk

I used apktool to extract the contents of each apk in their respective folders:

`$ apktool d base-arm64_v8a.apk -o arm64_v8a/`
`$ apktool d base-en.apk -o en/`
`$ apktool d base-master.apk -o master/`
`$ apktool d base-xxhdpi.apk -o xxhdpi/`

For a proper comparison I also need to extract the apk I got from Google Play on my phone using apktool: 

`$ apktool d com.komodoplatform.atomicdex_v105.apk official/`

To my surprise, it did not generate multiple split apks as I expected: 

```
Files:
- AndroidManifest.xml  
- apktool.yml  

Folders:
- assets  
- kotlin  
- META-INF  
- original  
- res  
- smali  
- smali_classes2  
- unknown
```
Running $ du -sh on the directory shows 126M of data - a very large difference considering the split files generated from our built AAB. 

Perhaps a different approach is needed. I decided to use adb tools rather than an APK extractor from Google Play. I attached my phone to the PC.

First, get a list of the packages on my phone.

`1. $ adb shell pm list packages`

After identifying the app ID, com.komodoplatform.atomicdex, we then look for its path:

`2. $ adb shell pm path com.komodoplatform.atomicdex` which showed:

```
package:/data/app/~~9y_k8oerPN2pNC97UkG_bg==/com.komodoplatform.atomicdex-2czwBb3-hZljGOuOuPLnfQ==/base.apk
package:/data/app/~~9y_k8oerPN2pNC97UkG_bg==/com.komodoplatform.atomicdex-2czwBb3-hZljGOuOuPLnfQ==/split_config.armeabi_v7a.apk
package:/data/app/~~9y_k8oerPN2pNC97UkG_bg==/com.komodoplatform.atomicdex-2czwBb3-hZljGOuOuPLnfQ==/split_config.en.apk
package:/data/app/~~9y_k8oerPN2pNC97UkG_bg==/com.komodoplatform.atomicdex-2czwBb3-hZljGOuOuPLnfQ==/split_config.xhdpi.apk
```
We then do an adb pull <path> which gives us closer to the split apks we built. These are our `fromOfficial` apks:  

```
16248 -rw-r--r-- 1 dannybuntu dannybuntu 16637544 Jun 28 19:48 base.apk
83412 -rw-r--r-- 1 dannybuntu dannybuntu 85406517 Jun 28 19:49 split_config.armeabi_v7a.apk
   44 -rw-r--r-- 1 dannybuntu dannybuntu    41369 Jun 28 19:50 split_config.en.apk
   76 -rw-r--r-- 1 dannybuntu dannybuntu    76939 Jun 28 19:51 split_config.xhdpi.apk
```

Built apks derived from AAB:

```
106372 -rw-r--r-- 1 danny danny 108917115 Jun 28 10:09 base-arm64_v8a.apk
    24 -rw-r--r-- 1 danny danny     24147 Jun 28 10:09 base-en.apk
 16328 -rw-r--r-- 1 danny danny  16719156 Jun 28 10:09 base-master.apk
    68 -rw-r--r-- 1 danny danny     68721 Jun 28 10:09 base-xxhdpi.apk
```

There is still a wide chasm to be bridged if we were to compare the apks solely by their file
sizes.  

We will try to perform a quick diff by then uploading the `fromOfficial` apks to the build server. We will then run extract the contents of each apk to their own folders - matched to their built counterparts' names. For instance base.apk will be extracted to the `master` folder under the official folder. Consequently, we will extract base-master.apk to a folder named `master` as well under built folder. 

We then run:

```
$ diff -rq official/master/ built/master
Files official/master/AndroidManifest.xml and built/master/AndroidManifest.xml differ
Files official/master/apktool.yml and built/master/apktool.yml differ
Files official/master/assets/flutter_assets/AssetManifest.json and built/master/assets/flutter_assets/AssetManifest.json differ
Only in built/master/assets/flutter_assets/assets: coins_config.json
Files official/master/assets/flutter_assets/assets/coins.json and built/master/assets/flutter_assets/assets/coins.json differ
Files official/master/assets/flutter_assets/NOTICES.Z and built/master/assets/flutter_assets/NOTICES.Z differ
Files official/master/original/AndroidManifest.xml and built/master/original/AndroidManifest.xml differ
Only in official/master/original: stamp-cert-sha256
Files official/master/res/xml/splits0.xml and built/master/res/xml/splits0.xml differ
Files official/master/smali/com/dexterous/flutterlocalnotifications/FlutterLocalNotificationsPlugin$2.smali and built/master/smali/com/dexterous/flutterlocalnotifications/FlutterLocalNotificationsPlugin$2.smali differ
Files official/master/smali/com/dexterous/flutterlocalnotifications/models/BitmapSource.smali and built/master/smali/com/dexterous/flutterlocalnotifications/models/BitmapSource.smali differ
Files official/master/smali/com/dexterous/flutterlocalnotifications/models/DateTimeComponents.smali and built/master/smali/com/dexterous/flutterlocalnotifications/models/DateTimeComponents.smali differ
Files official/master/smali/com/dexterous/flutterlocalnotifications/models/IconSource.smali and built/master/smali/com/dexterous/flutterlocalnotifications/models/IconSource.smali differ
Files official/master/smali/com/dexterous/flutterlocalnotifications/models/NotificationChannelAction.smali and built/master/smali/com/dexterous/flutterlocalnotifications/models/NotificationChannelAction.smali differ
Files official/master/smali/com/dexterous/flutterlocalnotifications/models/ScheduledNotificationRepeatFrequency.smali and built/master/smali/com/dexterous/flutterlocalnotifications/models/ScheduledNotificationRepeatFrequency.smali differ
Files official/master/smali/com/dexterous/flutterlocalnotifications/models/SoundSource.smali and built/master/smali/com/dexterous/flutterlocalnotifications/models/SoundSource.smali differ
Files official/master/smali/com/dexterous/flutterlocalnotifications/NotificationStyle.smali and built/master/smali/com/dexterous/flutterlocalnotifications/NotificationStyle.smali differ
Files official/master/smali/com/dexterous/flutterlocalnotifications/RepeatInterval.smali and built/master/smali/com/dexterous/flutterlocalnotifications/RepeatInterval.smali differ
Files official/master/smali_classes2/com/it_nomads/fluttersecurestorage/FlutterSecureStoragePlugin.smali and built/master/smali_classes2/com/it_nomads/fluttersecurestorage/FlutterSecureStoragePlugin.smali differ
Files official/master/smali_classes2/com/komodoplatform/atomicdex/BuildConfig.smali and built/master/smali_classes2/com/komodoplatform/atomicdex/BuildConfig.smali differ
Files official/master/smali_classes2/com/komodoplatform/atomicdex/MainActivity$1.smali and built/master/smali_classes2/com/komodoplatform/atomicdex/MainActivity$1.smali differ
Files official/master/smali_classes2/com/komodoplatform/atomicdex/MainActivity$3$1.smali and built/master/smali_classes2/com/komodoplatform/atomicdex/MainActivity$3$1.smali differ
Files official/master/smali_classes2/com/mr/flutter/plugin/filepicker/FilePickerDelegate$1.smali and built/master/smali_classes2/com/mr/flutter/plugin/filepicker/FilePickerDelegate$1.smali differ
Files official/master/smali_classes2/com/mr/flutter/plugin/filepicker/FilePickerDelegate$2.smali and built/master/smali_classes2/com/mr/flutter/plugin/filepicker/FilePickerDelegate$2.smali differ
Files official/master/smali_classes2/com/mr/flutter/plugin/filepicker/FilePickerPlugin$MethodResultWrapper$1.smali and built/master/smali_classes2/com/mr/flutter/plugin/filepicker/FilePickerPlugin$MethodResultWrapper$1.smali differ
Files official/master/smali_classes2/com/mr/flutter/plugin/filepicker/FilePickerPlugin$MethodResultWrapper$2.smali and built/master/smali_classes2/com/mr/flutter/plugin/filepicker/FilePickerPlugin$MethodResultWrapper$2.smali differ
Files official/master/smali_classes2/com/tekartik/sqflite/SqflitePlugin$1.smali and built/master/smali_classes2/com/tekartik/sqflite/SqflitePlugin$1.smali differ
Files official/master/smali_classes2/com/tekartik/sqflite/SqflitePlugin$2.smali and built/master/smali_classes2/com/tekartik/sqflite/SqflitePlugin$2.smali differ
Files official/master/smali_classes2/com/tekartik/sqflite/SqflitePlugin$3.smali and built/master/smali_classes2/com/tekartik/sqflite/SqflitePlugin$3.smali differ
Files official/master/smali_classes2/com/tekartik/sqflite/SqflitePlugin$4.smali and built/master/smali_classes2/com/tekartik/sqflite/SqflitePlugin$4.smali differ
Files official/master/smali_classes2/com/tekartik/sqflite/SqflitePlugin$5.smali and built/master/smali_classes2/com/tekartik/sqflite/SqflitePlugin$5.smali differ
Files official/master/smali_classes2/com/tekartik/sqflite/SqflitePlugin$6.smali and built/master/smali_classes2/com/tekartik/sqflite/SqflitePlugin$6.smali differ
Files official/master/smali_classes2/com/tekartik/sqflite/SqflitePlugin$7.smali and built/master/smali_classes2/com/tekartik/sqflite/SqflitePlugin$7.smali differ
Files official/master/smali_classes2/com/tekartik/sqflite/SqflitePlugin$8.smali and built/master/smali_classes2/com/tekartik/sqflite/SqflitePlugin$8.smali differ
Files official/master/smali_classes2/com/tekartik/sqflite/SqflitePlugin$BgResult$1.smali and built/master/smali_classes2/com/tekartik/sqflite/SqflitePlugin$BgResult$1.smali differ
Files official/master/smali_classes2/com/tekartik/sqflite/SqflitePlugin$BgResult$2.smali and built/master/smali_classes2/com/tekartik/sqflite/SqflitePlugin$BgResult$2.smali differ
Files official/master/smali_classes2/dev/flutter/plugins/integration_test/FlutterDeviceScreenshot$1.smali and built/master/smali_classes2/dev/flutter/plugins/integration_test/FlutterDeviceScreenshot$1.smali differ
Files official/master/smali_classes2/io/flutter/plugins/localauth/AuthenticationHelper$1.smali and built/master/smali_classes2/io/flutter/plugins/localauth/AuthenticationHelper$1.smali differ
Files official/master/smali_classes2/io/flutter/plugins/localauth/AuthenticationHelper.smali and built/master/smali_classes2/io/flutter/plugins/localauth/AuthenticationHelper.smali differ
Files official/master/smali_classes2/io/flutter/plugins/localauth/LocalAuthPlugin$2.smali and built/master/smali_classes2/io/flutter/plugins/localauth/LocalAuthPlugin$2.smali differ
Files official/master/smali_classes2/io/flutter/plugins/pathprovider/Messages$StorageDirectory.smali and built/master/smali_classes2/io/flutter/plugins/pathprovider/Messages$StorageDirectory.smali differ
Files official/master/smali_classes2/io/flutter/plugins/sharedpreferences/MethodCallHandlerImpl$1$1.smali and built/master/smali_classes2/io/flutter/plugins/sharedpreferences/MethodCallHandlerImpl$1$1.smali differ
Files official/master/smali_classes2/io/flutter/plugins/sharedpreferences/MethodCallHandlerImpl$1.smali and built/master/smali_classes2/io/flutter/plugins/sharedpreferences/MethodCallHandlerImpl$1.smali differ
Files official/master/smali_classes2/io/flutter/plugins/urllauncher/UrlLauncher$LaunchStatus.smali and built/master/smali_classes2/io/flutter/plugins/urllauncher/UrlLauncher$LaunchStatus.smali differ
Only in official/master/unknown: stamp-cert-sha256
```

There remains a methodological gap when it comes to verifying the reproducibility of apks derived from AABs. This is still an ongoing project to research for now.  

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