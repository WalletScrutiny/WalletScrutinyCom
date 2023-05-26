---
wsId: zeusln
title: 'Zeus: Bitcoin and Lightning'
altTitle: 
authors:
- leo
users: 5000
appId: app.zeusln.zeus
appCountry: 
released: 2020-07-07
updated: 2023-04-30
version: 0.7.5
stars: 4.3
ratings: 45
reviews: 20
size: 
website: https://zeusln.app
repository: https://github.com/ZeusLN/zeus
issue: https://github.com/ZeusLN/zeus/issues/416
icon: app.zeusln.zeus.png
bugbounty: 
meta: outdated
verdict: nonverifiable
date: 2021-08-30
signer: 
reviewArchive: 
twitter: ZeusLN
social: 
redirect_from:
- /app.zeusln.zeus/
- /posts/app.zeusln.zeus/
developerName: Evan Kaloudis
features:
- ln

---

This app is a bit special as it does not hold your private keys but neither is
it custodial. It remote-controls your lightning node that you can run for
example at home. So it is a wallet in that you can use it to send and receive
Bitcoins.

And ... best of all:

> Furthermore our builds have no proprietary dependencies, are reproducible, and
  are distributed on F-Droid.

they claim to have reproducible builds! Being on F-Droid this is highly likely
to be reproducible for us, too. Let's see how it goes:

On [the repository](https://github.com/ZeusLN/zeus) there is no special mention
of reproducible builds. Only that the Play Store release is built from the
[play-releases branch](https://github.com/ZeusLN/zeus/tree/play-releases).

In that play-releases branch there is no special mention on reproducibility
neither. The build instructions end in:

```
npm i
react-native run-android
```

but `react-native run-android` is not a command to create the apk. It's to
install the app on a connected device. We'll go with

```
cd android
./gradlew assembleRelease
```

instead.

Also we will need version 0.5.1 which is the latest version we got from the Play
Store. (The following is the pruned version after [some detours](https://github.com/ZeusLN/zeus/issues/416#issuecomment-815419535).)

```
$ git clone https://github.com/ZeusLN/zeus
$ cd zeus/
$ git tag | grep 0.5.1
v0.5.1
$ git checkout v0.5.1 
$ docker run -it --volume $PWD:/mnt --workdir /mnt --rm beevelop/cordova bash
root@b5e24bbdc208:/mnt# npm install  
root@b5e24bbdc208:/mnt# npm install stream
root@b5e24bbdc208:/mnt# yes | $ANDROID_HOME/tools/bin/sdkmanager "platforms;android-28"
root@c6e507f0b5dc:/mnt# npx react-native run-android
root@b5e24bbdc208:/mnt# cd android
root@c6e507f0b5dc:/mnt/android# echo -e "\nMYAPP_RELEASE_KEY_ALIAS=a\nMYAPP_RELEASE_KEY_PASSWORD=aaaaaa\nMYAPP_RELEASE_STORE_PASSWORD=aaaaaa\nMYAPP_RELEASE_STORE_FILE=../dummy.keystore"  >> gradle.properties
root@c6e507f0b5dc:/mnt# keytool -genkey -v -keystore dummy.keystore -alias a -keyalg RSA -keysize 2048 -validity 10

(entering password aaaaaa and all the rest defaults.)

root@b5e24bbdc208:/mnt/android# ./gradlew assembleRelease
BUILD SUCCESSFUL in 40s
564 actionable tasks: 279 executed, 285 up-to-date
root@c6e507f0b5dc:/mnt/android# ls -alh app/build/outputs/apk/release/
total 126M
drwxr-xr-x 2 root root 4.0K Apr  8 04:28 .
drwxr-xr-x 4 root root 4.0K Apr  8 04:28 ..
-rw-r--r-- 1 root root  18M Apr  8 04:28 app-arm64-v8a-release.apk
-rw-r--r-- 1 root root  17M Apr  8 04:28 app-armeabi-v7a-release.apk
-rw-r--r-- 1 root root  55M Apr  8 04:28 app-universal-release.apk
-rw-r--r-- 1 root root  19M Apr  8 04:28 app-x86-release.apk
-rw-r--r-- 1 root root  19M Apr  8 04:28 app-x86_64-release.apk
-rw-r--r-- 1 root root 1.7K Apr  8 04:28 output.json
root@c6e507f0b5dc:/mnt/android# exit
$ apktool d -o fromGoogle Zeus\ 0.5.1\ \(app.zeusln.zeus\).apk 
$ apktool d -o fromBuild android/app/build/outputs/apk/release/app-universal-release.apk 
$ diff --brief --recursive from{Google,Build}
Files fromGoogle/AndroidManifest.xml and fromBuild/AndroidManifest.xml differ
Files fromGoogle/apktool.yml and fromBuild/apktool.yml differ
Files fromGoogle/assets/index.android.bundle and fromBuild/assets/index.android.bundle differ
Files fromGoogle/lib/arm64-v8a/libimagepipeline.so and fromBuild/lib/arm64-v8a/libimagepipeline.so differ
Files fromGoogle/lib/arm64-v8a/libnative-filters.so and fromBuild/lib/arm64-v8a/libnative-filters.so differ
Files fromGoogle/lib/arm64-v8a/libnative-imagetranscoder.so and fromBuild/lib/arm64-v8a/libnative-imagetranscoder.so differ
Files fromGoogle/lib/arm64-v8a/libsifir_android.so and fromBuild/lib/arm64-v8a/libsifir_android.so differ
Files fromGoogle/lib/arm64-v8a/libv8android.so and fromBuild/lib/arm64-v8a/libv8android.so differ
Files fromGoogle/lib/armeabi-v7a/libimagepipeline.so and fromBuild/lib/armeabi-v7a/libimagepipeline.so differ
Files fromGoogle/lib/armeabi-v7a/libnative-filters.so and fromBuild/lib/armeabi-v7a/libnative-filters.so differ
Files fromGoogle/lib/armeabi-v7a/libnative-imagetranscoder.so and fromBuild/lib/armeabi-v7a/libnative-imagetranscoder.so differ
Files fromGoogle/lib/armeabi-v7a/libsifir_android.so and fromBuild/lib/armeabi-v7a/libsifir_android.so differ
Files fromGoogle/lib/armeabi-v7a/libv8android.so and fromBuild/lib/armeabi-v7a/libv8android.so differ
Files fromGoogle/lib/x86/libimagepipeline.so and fromBuild/lib/x86/libimagepipeline.so differ
Files fromGoogle/lib/x86/libnative-filters.so and fromBuild/lib/x86/libnative-filters.so differ
Files fromGoogle/lib/x86/libnative-imagetranscoder.so and fromBuild/lib/x86/libnative-imagetranscoder.so differ
Files fromGoogle/lib/x86/libsifir_android.so and fromBuild/lib/x86/libsifir_android.so differ
Files fromGoogle/lib/x86/libv8android.so and fromBuild/lib/x86/libv8android.so differ
Files fromGoogle/lib/x86_64/libimagepipeline.so and fromBuild/lib/x86_64/libimagepipeline.so differ
Files fromGoogle/lib/x86_64/libnative-filters.so and fromBuild/lib/x86_64/libnative-filters.so differ
Files fromGoogle/lib/x86_64/libnative-imagetranscoder.so and fromBuild/lib/x86_64/libnative-imagetranscoder.so differ
Files fromGoogle/lib/x86_64/libsifir_android.so and fromBuild/lib/x86_64/libsifir_android.so differ
Files fromGoogle/lib/x86_64/libv8android.so and fromBuild/lib/x86_64/libv8android.so differ
Files fromGoogle/original/AndroidManifest.xml and fromBuild/original/AndroidManifest.xml differ
Only in fromBuild/original/META-INF: CERT.RSA
Only in fromBuild/original/META-INF: CERT.SF
Only in fromGoogle/original/META-INF: GOOGPLAY.RSA
Only in fromGoogle/original/META-INF: GOOGPLAY.SF
Files fromGoogle/original/META-INF/MANIFEST.MF and fromBuild/original/META-INF/MANIFEST.MF differ
Only in fromGoogle/res/raw: node_modules_browserifyaes_modes_list.json
Only in fromGoogle/res/raw: node_modules_browserifysign_browser_algorithms.json
Only in fromGoogle/res/raw: node_modules_browserifysign_browser_curves.json
Only in fromGoogle/res/raw: node_modules_diffiehellman_lib_primes.json
Files fromGoogle/res/raw/node_modules_elliptic_package.json and fromBuild/res/raw/node_modules_elliptic_package.json differ
Only in fromGoogle/res/raw: node_modules_parseasn1_aesid.json
Files fromGoogle/res/values/public.xml and fromBuild/res/values/public.xml differ
```

and that's a lot of diffs in a lot of different files. The app cannot be
reproduced from the existing source code given the not given build
instructions(?). The app is **not verifiable**.
